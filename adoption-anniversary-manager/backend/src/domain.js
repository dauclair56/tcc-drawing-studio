export function validDate(s) {
 return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s)) && new Date(s).toISOString().slice(0,10) === s;
}
export function localDay(now = new Date()) {
 const p = Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now).map(x=>[x.type,x.value]));
 return `${p.year}-${p.month}-${p.day}`;
}
export function anniversary(adoption, year) {
 if (!validDate(adoption) || !Number.isInteger(year) || year <= Number(adoption.slice(0,4))) return null;
 const day = `${year}-${adoption.slice(5)}`;
 // Feb 29 is deliberately held for a policy decision in non-leap years.
 return validDate(day) ? day : null;
}
export function reviewDay(day) { return new Date(Date.parse(day+'T12:00:00Z')-3*86400000).toISOString().slice(0,10); }
export function eligible(p) { return p.active===1 && p.verified===1 && validDate(p.adoption_date) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.adopter_email); }
export async function prepareReviews(db, today) {
 const {results:pets} = await db.prepare('SELECT * FROM pets WHERE active=1 AND verified=1').all();
 let created=0;
 for (const p of pets) {
  if (!eligible(p)) continue;
  for (const year of [Number(today.slice(0,4)),Number(today.slice(0,4))+1]) {
   const day=anniversary(p.adoption_date,year);
   if (!day || day<today || reviewDay(day)>today) continue;
   const r=await db.prepare(`INSERT OR IGNORE INTO anniversaries(id,pet_id,anniversary_year,anniversary_date,review_opens_on,recipient) SELECT ?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM suppressions WHERE email=?)`).bind(`${p.id}:${year}`,p.id,year,day,reviewDay(day),p.adopter_email,p.adopter_email).run();
   created+=r.meta.changes;
  }
 }
 return {created};
}
