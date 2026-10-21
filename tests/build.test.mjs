import test from "node:test";
import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {readdirSync,readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname,join,resolve} from "node:path";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
test("only approved public assets leave the source repository",()=>{
  execFileSync(process.execPath,["scripts/build.mjs"],{cwd:root,stdio:"pipe"});
  const actual=readdirSync(join(root,"dist")).sort();
  const approved=["index.html","style.css","script.js","config.js","catalog.json",
    "privacy.html","experience.html","_headers","_routes.json","robots.txt"].sort();
  assert.deepEqual(actual,approved);
  for(const banned of ["LAUNCH_READINESS.md","tests","functions",".github",
    ".gitignore","package.json","scripts"])
    assert.ok(!actual.includes(banned),"Private build file was publicly copied: "+banned);
  assert.match(readFileSync(join(root,"dist","robots.txt"),"utf8"),/Disallow:\s*\//);
  assert.match(readFileSync(join(root,"dist","_headers"),"utf8"),/X-Robots-Tag:\s*noindex/);
});
