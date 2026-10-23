const decode = s => Uint8Array.from(atob(s.replaceAll('-','+').replaceAll('_','/')), c=>c.charCodeAt(0));
// Validate the Access signature as well as issuer/audience. A spoofed email header is never trusted.
export async function authenticate(request, env, fetcher=fetch) {
 if (!/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(env.ACCESS_ISSUER||'') || !env.ACCESS_AUD || !env.REVIEWER_EMAILS) throw new Error('Access not configured');
 const token=request.headers.get('Cf-Access-Jwt-Assertion');
 if (!token || token.length>16384) throw new Error('Missing token');
 const parts=token.split('.'); if(parts.length!==3) throw new Error('Invalid token');
 const h=JSON.parse(new TextDecoder().decode(decode(parts[0]))), p=JSON.parse(new TextDecoder().decode(decode(parts[1])));
 const now=Math.floor(Date.now()/1000);
 if(h.alg!=='RS256' || !h.kid || p.iss!==env.ACCESS_ISSUER || !Array.isArray(p.aud) || !p.aud.includes(env.ACCESS_AUD) || !Number.isFinite(p.exp) || p.exp<=now || !Number.isFinite(p.iat) || p.iat>now+30 || (p.nbf!==undefined && (!Number.isFinite(p.nbf)||p.nbf>now))) throw new Error('Invalid claims');
 const response=await fetcher(env.ACCESS_ISSUER+'/cdn-cgi/access/certs',{signal:AbortSignal.timeout(5000)});
 if(!response.ok) throw new Error('Key lookup failed');
 const {keys}=await response.json(); const jwk=keys.find(k=>k.kid===h.kid && k.kty==='RSA');
 if(!jwk) throw new Error('Unknown key');
 const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
 if(!await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,decode(parts[2]),new TextEncoder().encode(parts.slice(0,2).join('.')))) throw new Error('Bad signature');
 const allowed=env.REVIEWER_EMAILS.split(',').map(s=>s.trim().toLowerCase());
 if(typeof p.email!=='string'||!allowed.includes(p.email.toLowerCase())) throw new Error('Not authorized');
 return p.email.toLowerCase();
}
