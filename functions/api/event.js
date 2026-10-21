// Optional anonymous conversion-event intake for Cloudflare Analytics Engine.
// Off by default. Set EVENTS_ENABLED=true and bind an Analytics Engine dataset
// named ANALYTICS_ENGINE after documenting collection and deployment tests.
// Never accept email, names, full URLs, IP addresses, or raw querystrings here.
const EVENTS=new Set(["site_navigation","design_interest","editorial_outbound_click","affiliate_outbound_click","signup_accepted","signup_error"]);
const reply=(payload,status)=>new Response(JSON.stringify(payload),{status,headers:{"Content-Type":"application/json","Cache-Control":"no-store"}});
export async function onRequestPost({request,env={}}){
  if(env.EVENTS_ENABLED!=="true"||!env.ANALYTICS_ENGINE||typeof env.ANALYTICS_ENGINE.writeDataPoint!=="function")return reply({error:"Event collection disabled."},503);
  const origin=request.headers.get("Origin");
  if(origin&&origin!==new URL(request.url).origin)return reply({error:"Origin denied."},403);
  if(!/application\/json/i.test(request.headers.get("Content-Type")||""))return reply({error:"Expected JSON."},415);
  if(Number(request.headers.get("Content-Length")||"0")>1024)return reply({error:"Too large."},413);
  let data;
  try{const raw=await request.text();if(raw.length>1024)return reply({error:"Too large."},413);data=JSON.parse(raw);}catch{return reply({error:"Invalid JSON."},400);}
  if(!data||!EVENTS.has(data.event))return reply({error:"Unsupported event."},400);
  const scrub=v=>(typeof v==="string"&&/^[\w-]{1,48}$/.test(v))?v:"";
  // Blobs represent event name, catalog sku, and partner/category. No identifiers.
  try{
    env.ANALYTICS_ENGINE.writeDataPoint({indexes:[data.event],blobs:[data.event,scrub(data.sku||data.design||data.action),scrub(data.partner||data.category)],doubles:[1]});
    return reply({ok:true},202);
  }catch{return reply({error:"Event collector unavailable."},503);}
}
