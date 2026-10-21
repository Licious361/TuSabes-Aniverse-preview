import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {onRequestPost as submitSignup} from "../functions/api/signup.js";
import {onRequestPost as recordEvent} from "../functions/api/event.js";

const read=name=>readFileSync(new URL("../"+name,import.meta.url),"utf8");
const req=(path,data,headers={})=>new Request("https://preview.example"+path,{
  method:"POST",headers:{"Content-Type":"application/json","Origin":"https://preview.example",...headers},
  body:typeof data==="string"?data:JSON.stringify(data)
});
const valid={email:"sample@example.com",consent:true,interests:["collectibles","studio","unknown"],website:""};

test("preview has real brand lanes, consent form and clear no-sale status",()=>{
  const html=read("index.html");
  for(const text of ["Collector's Corner","Afterglow","Stone Frame","Yumiko","experience.html","affiliate-disclosure","id=\"signup-form\"","id=\"consent\""])assert.ok(html.includes(text),"Missing "+text);
  assert.ok(html.includes("NOT FOR SALE"));
  assert.ok(html.includes('id="signup-submit" disabled'));
  assert.ok(!html.includes("Add to cart")&&!html.includes("Restocked"));
  assert.ok(existsSync(new URL("../experience.html",import.meta.url)));
});

test("no active external intake until credentials, abuse rules and consent are established",()=>{
  const config=read("config.js"),privacy=read("privacy.html");
  assert.match(config,/signupEnabled:false/);
  assert.match(config,/analyticsEnabled:false/);
  assert.match(privacy,/event-collection switch is OFF/);
  assert.match(privacy,/editorial links/);
  assert.match(read("_routes.json"),/api\/\*/);
});

test("catalog is true editorial discovery, not counterfeit affiliate accounting",()=>{
  const cards=JSON.parse(read("catalog.json"));
  assert.equal(cards.length,3);
  for(const c of cards){
    assert.equal(c.status,"editorial");
    assert.equal(c.source_verified,true);
    const url=new URL(c.source_url);
    assert.equal(url.protocol,"https:");
    assert.equal(url.hostname,"www.sideshow.com");
    assert.ok(!c.affiliate_url);
  }
  const script=read("script.js");
  assert.match(script,/partner_verified!==true/);
  assert.match(script,/rights_verified!==true/);
  assert.match(script,/link_verified!==true/);
  assert.match(script,/editorial_outbound_click/);
  for (const name of ["Sideshow","Hot Topic","BoxLunch","CDJapan","Playasia"]) assert.ok(script.includes(`"${name}"`),`Merchant allowlist missing ${name}`);
  assert.match(script,/tracking_host_verified===true/);
  assert.match(script,/cjRedirectHosts/);
});

test("signup is closed by default and never claims false success",async()=>{
  const r=await submitSignup({request:req("/api/signup",valid),env:{}});
  assert.equal(r.status,503);
  assert.equal((await r.json()).error,"Email signups are not configured.");
});

test("signup validates origin, consent, input and size",async()=>{
  const env={SIGNUP_ENABLED:"true",WAITLIST:{put:async()=>{}}};
  assert.equal((await submitSignup({request:req("/api/signup",valid,{"Origin":"https://unrelated.site"}),env})).status,403);
  assert.equal((await submitSignup({request:req("/api/signup",{...valid,consent:false}),env})).status,400);
  assert.equal((await submitSignup({request:req("/api/signup",{...valid,email:"bad"}),env})).status,400);
  assert.equal((await submitSignup({request:req("/api/signup",valid,{"Content-Type":"text/plain"}),env})).status,415);
  assert.equal((await submitSignup({request:req("/api/signup"," ".repeat(4100)),env})).status,413);
});

test("signup stores one consented expiring KV record and filters unknown interests",async()=>{
  const written=[];
  const env={SIGNUP_ENABLED:"true",WAITLIST:{put:async(...args)=>written.push(args)}};
  const r=await submitSignup({request:req("/api/signup",valid),env});
  assert.equal(r.status,200);
  assert.equal((await r.json()).recorded,true);
  assert.equal(written.length,1);
  assert.match(written[0][0],/^subscriber:[a-f0-9]{64}$/);
  assert.ok(!written[0][0].includes("sample@"));
  const data=JSON.parse(written[0][1]);
  assert.equal(data.email,"sample@example.com");
  assert.deepEqual(data.interests,["collectibles","studio"]);
  assert.equal(data.consent,true);
  assert.equal(written[0][2].expirationTtl,15552000);
});

test("honeypot discards without persistence",async()=>{
  let writes=0;
  const env={SIGNUP_ENABLED:"true",WAITLIST:{put:async()=>writes++}};
  const r=await submitSignup({request:req("/api/signup",{...valid,website:"fake-subscriber"}),env});
  assert.equal(r.status,200);assert.equal(writes,0);assert.equal((await r.json()).recorded,false);
});

test("anonymous event tracking is off by default and allowlists event schema",async()=>{
  const seen=[];
  const env={EVENTS_ENABLED:"true",ANALYTICS_ENGINE:{writeDataPoint:data=>seen.push(data)}};
  const e={event:"editorial_outbound_click",sku:"sideshow-sakamoto-914821",partner:"Sideshow"};
  assert.equal((await recordEvent({request:req("/api/event",e),env:{}})).status,503);
  assert.equal((await recordEvent({request:req("/api/event",{event:"arbitrary-event",email:"private@example.com"}),env})).status,400);
  const ok=await recordEvent({request:req("/api/event",e),env});
  assert.equal(ok.status,202);assert.equal(seen.length,1);
  assert.equal(seen[0].blobs[0],"editorial_outbound_click");
  assert.ok(!JSON.stringify(seen).includes("email"));
});

test("no committed secret fixtures or unapproved sales claims",()=>{
  for(const f of ["config.js","index.html","script.js","catalog.json","functions/api/signup.js","functions/api/event.js"]){
    const c=read(f);
    assert.ok(!/sk_live_[a-z0-9]{15}|ghp_[a-z0-9]{20}|-----BEGIN PRIVATE KEY-----/i.test(c),"Secret risk "+f);
  }
  const cfg=JSON.parse(read("_routes.json"));
  assert.deepEqual(cfg.include,["/api/*"]);
});
