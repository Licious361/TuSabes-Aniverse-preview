"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const config = window.ANIVERSE_CONFIG || {};
  const emit = (event, detail={}) => {
    const safe={event, ...detail};
    window.dataLayer=window.dataLayer || [];
    window.dataLayer.push(safe);
    window.dispatchEvent(new CustomEvent("aniverse:analytics", {detail:safe}));
    // First-party event intake is opt-in at configuration and OFF by default.
    // Only non-identifying, allowlisted fields reach the Cloudflare endpoint.
    if(config.analyticsEnabled===true && config.eventEndpoint==="/api/event"){
      const packet={event:safe.event};
      for(const field of ["action","design","sku","partner","category"]){
        if(typeof safe[field]==="string"&&/^[\\w-]{1,48}$/.test(safe[field]))packet[field]=safe[field];
      }
      fetch(config.eventEndpoint,{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify(packet),credentials:"omit",keepalive:true
      }).catch(()=>{});
    }
  };
  const year=document.getElementById("year"); if(year) year.textContent=String(new Date().getFullYear());
  document.querySelectorAll("[data-action]").forEach(el=>el.addEventListener("click",()=>emit("site_navigation",{action:el.dataset.action})));
  document.querySelectorAll("[data-interest]").forEach(el=>el.addEventListener("click",()=>{
    const selected=el.dataset.interest;
    const form=document.getElementById("signup-form");
    if(form){const box=form.querySelector('input[value="red-signal"]');if(box)box.checked=true;}
    emit("design_interest",{design:selected});
  }));
  const cardHost=document.getElementById("affiliate-cards");
  fetch("catalog.json",{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("Catalog unavailable");return r.json();}).then(items=>{
    if(!Array.isArray(items))return;
    const approved=items.filter(item=>{
      if(!item || !["affiliate","editorial"].includes(item.status))return false;
      if(typeof item.id!=="string"||typeof item.title!=="string"||typeof item.partner!=="string")return false;
      const link=item.status==="affiliate"?item.affiliate_url:item.source_url;
      if(typeof link!=="string"||!/^https:\/\//i.test(link))return false;
      if(item.status==="affiliate" && (item.partner_verified!==true || item.rights_verified!==true || item.link_verified!==true))return false;
      if(item.status==="editorial" && item.source_verified!==true)return false;
      try{const u=new URL(link);return u.protocol==="https:"&&u.hostname.toLowerCase()==="www.sideshow.com";}catch{return false;}
    });
    if(!approved.length||!cardHost)return;
    cardHost.replaceChildren();
    approved.slice(0,6).forEach(item=>{
      const isAffiliate=item.status==="affiliate",article=document.createElement("article");
      article.className="product-card";
      const label=document.createElement("p");label.className="eyebrow";
      label.textContent=isAffiliate?"VERIFIED AFFILIATE OFFER":"COLLECTOR RESEARCH · EDITORIAL LINK";
      const graphic=document.createElement("div");graphic.className="card-visual";
      graphic.setAttribute("aria-hidden","true");
      graphic.textContent=item.icon||"◇";
      const h=document.createElement("h3");h.textContent=item.title;
      const p=document.createElement("p");p.textContent=item.description||"Inspect product details directly with the retailer.";
      const partner=document.createElement("p");partner.className="fineprint";
      partner.textContent=isAffiliate?"Affiliate link · Tu Sabes AniVerse may earn a commission. Seller: "+item.partner+".":("Independent editorial selection. No commission link is active. Seller: "+item.partner+".");
      const a=document.createElement("a");a.className="text-link";
      a.textContent="See current price & availability at "+item.partner+" ↗";
      a.href=isAffiliate?item.affiliate_url:item.source_url;
      a.target="_blank";a.rel=(isAffiliate?"sponsored ":"")+"noopener noreferrer";
      a.addEventListener("click",()=>emit(isAffiliate?"affiliate_outbound_click":"editorial_outbound_click",{sku:item.id,partner:item.partner,category:item.category||"unknown"}));
      article.append(label,graphic,h,p,partner,a);cardHost.append(article);
    });
  }).catch(()=>{ /* The safe curation-queue fallback remains visible. */ });
  const form=document.getElementById("signup-form"), btn=document.getElementById("signup-submit"), message=document.getElementById("signup-message");
  if(!form||!btn||!message)return;
  const endpoint=(typeof config.signupEndpoint==="string")?config.signupEndpoint.trim():"";
  const validEndpoint=config.signupEnabled===true && endpoint==="/api/signup";
  if(!validEndpoint)return;
  btn.disabled=false;btn.textContent="Join the first-access list";
  message.textContent="You'll receive occasional emails about your chosen interests. Unsubscribe anytime.";
  form.addEventListener("submit",async e=>{
    e.preventDefault();
    if(!form.reportValidity()||!form.querySelector("#consent").checked){message.textContent="Please enter a valid email and accept the email consent.";return;}
    if(form.elements.website.value)return;
    const email=form.elements.email.value.trim();
    const interests=Array.from(form.querySelectorAll('input[name="interests"]:checked')).map(x=>x.value);
    btn.disabled=true;message.textContent="Submitting securely…";
    try{
      const res=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,interests,consent:true,website:form.elements.website.value,source:"aniverse-preview"})});
      if(!res.ok)throw Error("Signup not accepted");
      message.textContent="Your first-access interest has been recorded. No email will be sent until the service is configured to deliver it.";
      emit("signup_accepted",{interest_count:interests.length});form.reset();
    }catch(err){message.textContent="Signup didn't complete. Please try later.";emit("signup_error",{stage:"submission"});}
    finally{btn.disabled=false;}
  });
});