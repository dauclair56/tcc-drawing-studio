import test from 'node:test';
import assert from 'node:assert/strict';
import {authenticate} from '../src/auth.js';
const pair=await crypto.subtle.generateKey({name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['sign','verify']);
const jwk=await crypto.subtle.exportKey('jwk',pair.publicKey);jwk.kid='test-key';
const env={ACCESS_ISSUER:'https://test-team.cloudflareaccess.com',ACCESS_AUD:'test-app',REVIEWER_EMAILS:'reviewer@example.com'};
const enc=x=>Buffer.from(JSON.stringify(x)).toString('base64url');
async function token(claims={},header={}){const p=enc({alg:'RS256',kid:'test-key',...header})+'.'+enc({iss:env.ACCESS_ISSUER,aud:['test-app'],email:'reviewer@example.com',iat:Math.floor(Date.now()/1000),exp:Math.floor(Date.now()/1000)+300,...claims});return p+'.'+Buffer.from(await crypto.subtle.sign('RSASSA-PKCS1-v1_5',pair.privateKey,new TextEncoder().encode(p))).toString('base64url');}
const request=t=>new Request('https://test.invalid',{headers:{'Cf-Access-Jwt-Assertion':t}});
const keys=async()=>Response.json({keys:[jwk]});
test('signed Access token validates authorized reviewer',async()=>assert.equal(await authenticate(request(await token()),env,keys),'reviewer@example.com'));
test('wrong audience issuer expiry signer and reviewer are rejected',async()=>{
 for(const claims of [{aud:['other']},{iss:'https://other.invalid'},{exp:0},{email:'stranger@example.com'},{nbf:Date.now()}])await assert.rejects(authenticate(request(await token(claims)),env,keys));
 await assert.rejects(authenticate(request(await token({}, {alg:'none'})),env,keys));
 const t=await token();const parts=t.split('.');parts[1]=enc({email:'attacker@example.com'});await assert.rejects(authenticate(request(parts.join('.')),env,keys));
 const badJwk={...jwk,kid:'unknown'};await assert.rejects(authenticate(request(t),env,async()=>Response.json({keys:[badJwk]})));
});
