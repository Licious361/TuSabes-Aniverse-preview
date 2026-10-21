import {copyFileSync,existsSync,mkdirSync,readFileSync,rmSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname,join,resolve} from "node:path";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const output=join(root,"dist");
// Explicit allowlist: NEVER copy repo root, GitHub metadata, tests, work logs,
// backend Functions, original source registers, or private customer records.
const publicFiles=[
  "index.html","style.css","script.js","config.js","catalog.json",
  "privacy.html","experience.html","_headers","_routes.json","robots.txt"
];
for(const f of publicFiles){
  if(!existsSync(join(root,f)))throw Error("Missing required public asset: "+f);
}
const config=readFileSync(join(root,"config.js"),"utf8");
// Release gate: the repository is staging-only. Activation must be explicit.
if(/signupEnabled\s*:\s*true|analyticsEnabled\s*:\s*true/.test(config) &&
   process.env.ANIVERSE_PUBLICATION_APPROVED!=="yes")
  throw Error("A collection switch was enabled without a release authorization.");
const catalog=JSON.parse(readFileSync(join(root,"catalog.json"),"utf8"));
if(!Array.isArray(catalog))throw Error("Collector catalog must be an array.");
for(const item of catalog){
  if(!item||!["affiliate","editorial"].includes(item.status))
    throw Error("Unapproved collector item status.");
  if(item.source_verified!==true)throw Error("Missing verified product-source evidence.");
  if(item.status==="affiliate"&&
    [item.partner_verified,item.rights_verified,item.link_verified].some(v=>v!==true))
    throw Error("Affiliate item lacks verified partner, rights or tracking link.");
}
const html=readFileSync(join(root,"index.html"),"utf8");
if(/Add to cart|Guaranteed earnings|Restocked/.test(html))
  throw Error("Draft contains unverified commerce claims.");
rmSync(output,{force:true,recursive:true});mkdirSync(output,{recursive:true});
for(const name of publicFiles)copyFileSync(join(root,name),join(output,name));
console.log("AniVerse preview generated:",publicFiles.length,"public assets in dist/.");
console.log("Functions stay in source root for Cloudflare Pages to package separately.");
console.log("Crawler access remains blocked until explicit public-launch approval.");
