// Cloudflare Pages Function for consented first-access requests.
// Built from the previous AniVerse Cloudflare draft; deployment is OFF by default.
// Bind a KV namespace WAITLIST, set SIGNUP_ENABLED=true server-side, and
// configure rate limiting, privacy/mailbox procedures and approved contact route.
// Client config signupEnabled must be enabled only after real end-to-end QA.
const ALLOWED=new Set(["collectibles","red-signal","studio","art","apparel","discoveries"]);
const respond=(body,status=200)=>new Response(JSON.stringify(body),{
  status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}
});
export async function onRequestPost({request,env={}}){
  if(env.SIGNUP_ENABLED!=="true"||!env.WAITLIST||typeof env.WAITLIST.put!=="function")return respond({error:"Email signups are not configured."},503);
  const origin=request.headers.get("Origin");
  if(origin && origin!==new URL(request.url).origin)return respond({error:"Origin is not permitted."},403);
  if(!/application\/json/i.test(request.headers.get("Content-Type")||""))return respond({error:"Expected JSON."},415);
  if(Number(request.headers.get("Content-Length")||"0")>4096)return respond({error:"Request too large."},413);
  let raw;
  try{raw=await request.text();}catch{return respond({error:"Invalid payload."},400);}
  if(raw.length>4096)return respond({error:"Request too large."},413);
  let data;
  try{data=JSON.parse(raw);}catch{return respond({error:"Invalid JSON."},400);}
  if(!data||Array.isArray(data)||typeof data!=="object")return respond({error:"Invalid submission."},400);
  if(data.website)return respond({ok:true,recorded:false});
  const email=typeof data.email==="string"?data.email.trim().toLowerCase():"";
  if(!email||email.length>254||!/^[^\s@<>]{1,64}@[^\s@<>]+\.[^\s@<>]+$/.test(email)||data.consent!==true)
    return respond({error:"Valid email and consent are required."},400);
  const interests=Array.isArray(data.interests)?
    [...new Set(data.interests.filter(v=>typeof v==="string"&&ALLOWED.has(v)))].slice(0,4):[];
  const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(email));
  const key="subscriber:"+Array.from(new Uint8Array(digest),v=>v.toString(16).padStart(2,"0")).join("");
  try{
    await env.WAITLIST.put(key,JSON.stringify({
      email,interests,consent:true,consentAt:new Date().toISOString(),
      source:"aniverse-prelaunch",policyVersion:"draft-2026-10-21"
    }),{expirationTtl:15552000}); // 180 days, draft retention, confirm in public privacy policy
    return respond({ok:true,recorded:true});
  }catch{return respond({error:"Email signup temporarily unavailable."},503);}
}
