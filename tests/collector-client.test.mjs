import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
import {setImmediate} from "node:timers";

const source=readFileSync(new URL("../script.js",import.meta.url),"utf8");
const seeded=JSON.parse(readFileSync(new URL("../catalog.json",import.meta.url),"utf8"));

async function mount(catalog){
  const displayed=[];
  let ready;
  const makeElement=tag=>({
    tagName:tag,children:[],textContent:"",attributes:{},className:"",
    setAttribute(k,v){this.attributes[k]=v;},
    append(...children){this.children.push(...children);},
    addEventListener(event,fn){this["on_"+event]=fn;}
  });
  const container={replaceChildren(){displayed.length=0;},append(node){displayed.push(node);}};
  const document={
    addEventListener(name,cb){if(name==="DOMContentLoaded")ready=cb;},
    querySelectorAll(){return [];},
    createElement:makeElement,
    getElementById(id){return id==="affiliate-cards"?container:null;}
  };
  let otherFetches=0;
  const fetch=async path=>{
    if(path!=="catalog.json"){otherFetches++;throw Error("Unexpected request");}
    return {ok:true,json:async()=>catalog};
  };
  const window={ANIVERSE_CONFIG:{signupEnabled:false,analyticsEnabled:false},dataLayer:[],dispatchEvent(){}};
  class CustomEventMock{constructor(type,options){this.type=type;this.detail=options?.detail;}}
  vm.runInNewContext(source,{document,window,fetch,URL,CustomEvent:CustomEventMock,Date,console},{timeout:1000});
  ready();
  await new Promise(r=>setImmediate(r));
  return {displayed,window,otherFetches};
}
const child=(el,tag)=>el.children.find(c=>c.tagName===tag);

test("render three original editorial picks as noncommission referrals",async()=>{
  const {displayed,window,otherFetches}=await mount(seeded);
  assert.equal(displayed.length,3);
  for(const card of displayed){
    const a=child(card,"a");
    assert.match(a.href,/^https:\/\/www\.sideshow\.com\/collectibles\//);
    assert.equal(a.rel,"noopener noreferrer");
    assert.match(child(card,"p").textContent,/COLLECTOR RESEARCH/);
  }
  assert.deepEqual(window.dataLayer.map(x=>x.event),["page_view"]);
  assert.equal(otherFetches,0);
});

test("reject typosquatting links and pending affiliate relationships",async()=>{
  const bad=[
    {...seeded[0],id:"typo",source_url:"https://evil.sideshow.com/collectibles/example"},
    {...seeded[0],id:"pending",status:"affiliate",partner_verified:false,rights_verified:true,link_verified:true,affiliate_url:"https://www.sideshow.com/collectibles/example"},
    {...seeded[0],id:"bad-redirect",status:"affiliate",partner_verified:true,rights_verified:true,link_verified:true,affiliate_url:"https://phishing.example"},
  ];
  const {displayed}=await mount(bad);
  assert.equal(displayed.length,0);
});

test("require explicit verified CJ origin for otherwise approved publisher link",async()=>{
  const base={...seeded[0],id:"cj-approved",partner:"Hot Topic",status:"affiliate",
    source_url:"https://www.hottopic.com/product/example",
    affiliate_url:"https://www.jdoqocy.com/click-1234567-222222",
    partner_verified:true,rights_verified:true,link_verified:true,
    source_verified:true,tracking_network:"CJ",tracking_host_verified:true};
  const {displayed}=await mount([base,{...base,id:"cj-not-verified",tracking_host_verified:false}]);
  assert.equal(displayed.length,1);
  assert.match(child(displayed[0],"a").rel,/sponsored/);
  assert.match(child(displayed[0],"p").textContent,/VERIFIED AFFILIATE OFFER/);
});

test("keep other documented partner domains accessible for verified editorial curation",async()=>{
  const mapped=[
    ["BoxLunch","https://www.boxlunch.com/product/example"],
    ["CDJapan","https://www.cdjapan.co.jp/product/example"],
    ["Playasia","https://www.play-asia.com/en/product/example"],
  ];
  const {displayed}=await mount(mapped.map(([partner,source_url],i)=>({...seeded[0],id:"partner-"+i,partner,source_url,status:"editorial",source_verified:true})));
  assert.equal(displayed.length,mapped.length);
});

test("partner IDs are normalized before any potential analytics event transmission",async()=>{
  const approved={...seeded[0],id:"cj",partner:"Hot Topic",status:"affiliate",source_url:"https://www.hottopic.com/p/example",
    affiliate_url:"https://www.jdoqocy.com/click-1234567-222222",source_verified:true,
    partner_verified:true,rights_verified:true,link_verified:true,
    tracking_network:"CJ",tracking_host_verified:true};
  const {displayed,window}=await mount([approved]);
  child(displayed[0],"a").on_click();
  const event=window.dataLayer.at(-1);
  assert.equal(event.event,"affiliate_outbound_click");
  assert.equal(event.partner,"hot-topic");
  assert.equal(event.sku,"cj");
});
