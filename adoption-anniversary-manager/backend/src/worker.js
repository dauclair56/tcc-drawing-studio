import {authenticate} from './auth.js';
import {localDay,prepareReviews,eligible} from './domain.js';
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export async function handleAuthorized(request,env,actor,now=new Date()) {
 const path=new URL(request.url).pathname, db=env.DB;
 if(request.method==='GET' && path==='/api/status') return json({mode:env.MODE||'staging',sending_enabled:false,import_enabled:false,review_notifications_enabled:false});
 if(request.method==='GET' && path==='/api/anniversaries') return json({records:(await db.prepare('SELECT a.*,p.pet_name,p.adopter_name FROM anniversaries a JOIN pets p ON p.id=a.pet_id ORDER BY anniversary_date,a.id LIMIT 200').all()).results});
 if(request.method==='POST' && path==='/api/jobs/prepare-reviews') return json(await prepareReviews(db,localDay(now)));
 if(request.method==='POST' && ['/api/import/petstablished','/api/email/test','/api/jobs/send-approved'].includes(path)) return json({error:'Not enabled in this build'},409);
 const match=path.match(/^\/api\/anniversaries\/([^/]+)\/(draft|approve|ignore|remove|reopen)$/);
 if(!match || request.method!=='POST') return json({error:'Not found'},404);
 if(!request.headers.get('content-type')?.startsWith('application/json')) return json({error:'JSON required'},415);
 const raw=await request.text();if(raw.length>32000)return json({error:'Request too large'},413);
 let input;try{input=JSON.parse(raw);}catch{return json({error:'Invalid JSON'},400);}
 if(!input || !Number.isInteger(input.revision)) return json({error:'Revision required'},400);
 const id=decodeURIComponent(match[1]), action=match[2];
 const row=await db.prepare('SELECT a.*,p.active,p.verified,p.adoption_date,p.adopter_email FROM anniversaries a JOIN pets p ON p.id=a.pet_id WHERE a.id=?').bind(id).first();
 if(!row)return json({error:'Not found'},404);
 if(row.revision!==input.revision)return json({error:'Record changed; reload'},409);
 let status=row.status,subject=row.subject,body=row.body;
 if(action==='draft'){
  if(status!=='needs_review')return json({error:'Reopen before editing'},409);
  if(typeof input.subject!=='string'||!input.subject.trim()||input.subject.length>300||/[\r\n]/.test(input.subject)||typeof input.body!=='string'||!input.body.trim()||input.body.length>20000)return json({error:'Valid subject and body required'},400);
  subject=input.subject;body=input.body;
 }else if(action==='approve'){
  const suppressed=await db.prepare('SELECT email FROM suppressions WHERE email=?').bind(row.recipient).first();
  if(status!=='needs_review'||!eligible(row)||suppressed||row.recipient!==row.adopter_email||!subject||!body||row.anniversary_date<localDay(now))return json({error:'Not eligible for approval'},409);
  status='approved';
 }else if(action==='ignore'){
  if(!['needs_review','approved'].includes(status))return json({error:'Cannot ignore'},409);status='ignored';
 }else if(action==='reopen'){
  if(!['approved','ignored'].includes(status))return json({error:'Cannot reopen'},409);status='needs_review';
 }else{
  if(['sent','removed'].includes(status))return json({error:'Cannot remove'},409);status='removed';
 }
 const statements=[db.prepare('UPDATE anniversaries SET status=?,subject=?,body=?,approved_at=?,approved_by=?,revision=revision+1 WHERE id=? AND revision=?').bind(status,subject,body,status==='approved'?now.toISOString():null,status==='approved'?actor:null,id,input.revision),db.prepare('INSERT INTO audit_events(instance_id,actor,action) SELECT ?,?,? WHERE changes()=1').bind(id,actor,action)];
 if(action==='remove'){
  statements.push(db.prepare("UPDATE pets SET active=0 WHERE id=? AND EXISTS(SELECT 1 FROM anniversaries WHERE id=? AND revision=? AND status='removed')").bind(row.pet_id,id,input.revision+1));
  statements.push(db.prepare("UPDATE anniversaries SET status='removed',approved_at=NULL,approved_by=NULL,revision=revision+1 WHERE pet_id=? AND id!=? AND status IN('needs_review','approved','ignored') AND EXISTS(SELECT 1 FROM pets WHERE id=? AND active=0)").bind(row.pet_id,id,row.pet_id));
 }
 const results=await db.batch(statements);
 if(results[0].meta.changes!==1)return json({error:'Record changed; reload'},409);
 return json({id,status,revision:input.revision+1,sending_enabled:false});
}
export default {
 async fetch(request,env){
  const url=new URL(request.url);
  if(url.pathname==='/health'&&request.method==='GET')return json({ok:true,service:'tcc-adoption-manager-api'});
  if(!['GET','HEAD'].includes(request.method)&&request.headers.get('Origin')!==url.origin)return json({error:'Same-origin request required'},403);
  let actor;try{actor=await authenticate(request,env);}catch{return json({error:'Authentication required'},401);}
  try{return await handleAuthorized(request,env,actor);}catch{return json({error:'Request failed'},500);}
 },
 async scheduled(event,env){if(env.PREPARE_REVIEWS_ENABLED==='true')await prepareReviews(env.DB,localDay(new Date(event.scheduledTime)));}
};
