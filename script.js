"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const config = window.ANIVERSE_CONFIG || {};
  const emit = (event, detail={}) => {
    const safe={event, ...detail};
    window.dataLayer=window.dataLayer || [];
    window.dataLayer.push(safe);
    window.dispatchEvent(new CustomEvent("aniverse:analytics", {detail:safe}));
    // Events are only queued for a future analytics integration; no external request is sent here.
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
    const approved=items.filter(item=>item&&item.status==="approved"&&item.rights_verified===true&&item.partner_verified===true&&typeof item.affiliate_url==="string"&&/^https:\/\//i.test(item.affiliate_url)&&typeof item.title==="string"&&typeof item.partner==="string");
    if(!approved.length || !cardHost)return;
    cardHost.replaceChildren();
    approved.slice(0,6).forEach(item=>{
      const article=document.createElement("article");article.className="product-card";
      const meta=document.createElement("p");meta.className="eyebrow";meta.textContent="CURATED COLLECTIBLE · VERIFIED PARTNER";
      const h=document.createElement("h3");h.textContent=item.title;
      const p=document.createElement("p");p.textContent=item.description||"Details on the retailer's website.";
      const partner=document.createElement("p");partner.className="fineprint";partner.textContent="Offered by "+item.partner+". Final price and availability on retailer site.";
      const a=document.createElement("a");a.className="text-link";a.textContent="View at "+item.partner+" ↗";a.href=item.affiliate_url;a.target="_blank";a.rel="sponsored noopener noreferrer";a.addEventListener("click",()=>emit("affiliate_outbound_click",{sku:item.id||"unassigned",partner:item.partner,category:item.category||"unknown"}));
      article.append(meta,h,p,partner,a);cardHost.append(article);
    });
  }).catch(()=>{ /* The safe curation-queue fallback remains visible. */ });
  const form=document.getElementById("signup-form"), btn=document.getElementById("signup-submit"), message=document.getElementById("signup-message");
  if(!form||!btn||!message)return;
  const endpoint=(typeof config.signupEndpoint==="string")?config.signupEndpoint.trim():"";
  const validEndpoint=endpoint.startsWith("https://") && !endpoint.includes("REPLACE");
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
      const res=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,interests,consent:true,source:"aniverse-preview",submitted_at:new Date().toISOString()})});
      if(!res.ok)throw Error("Signup not accepted");
      message.textContent="Your request was received. Watch for a confirmation from the signup provider.";
      emit("signup_accepted",{interest_count:interests.length});form.reset();
    }catch(err){message.textContent="Signup didn't complete. Please try later.";emit("signup_error",{stage:"submission"});}
    finally{btn.disabled=false;}
  });
});