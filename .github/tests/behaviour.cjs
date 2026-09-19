const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const root=require('node:path').resolve(__dirname,'../..')+'/';
const tick=()=>new Promise(setImmediate);
function element(){return {attrs:{},events:{},hidden:false,disabled:false,textContent:'',dataset:{},setAttribute(k,v){this.attrs[k]=v},removeAttribute(k){delete this.attrs[k]},addEventListener(k,f){this.events[k]=f},focus(){this.focused=true}}}
function signup(fetchImpl, supported=true){
 const input=element(),button=element(),message=element(),fallback=element(),form=element();form.hidden=true;
 input.value='reader@example.test'; input.checkValidity=()=>input.value.includes('@');
 form.querySelector=s=>s.startsWith('input')?input:s.startsWith('button')?button:message;
 form.reset=()=>input.value='';form.action='https://example.test/subscribe';
 let calls=0,timers=new Map(),id=0;
 const ctx={document:{getElementById:s=>s==='chapter-signup'?form:fallback},URLSearchParams,FormData:class {constructor(){return [['fields[email]',input.value]]}},AbortController,Promise,Error};
 ctx.fetch=supported?function(...args){calls++;return fetchImpl(...args)}:undefined;
 ctx.setTimeout=f=>{timers.set(++id,f);return id};ctx.clearTimeout=i=>timers.delete(i);ctx.window=ctx;
 vm.runInNewContext(readFileSync(root+'signup.js','utf8'),ctx);
 return {input,button,message,fallback,form,submit:()=>form.events.submit({preventDefault(){}}),calls:()=>calls,timeout:()=>[...timers.values()].forEach(f=>f()),timers};
}
function analytics(initial=null,{blockRead=false,blockWrite=false}={}){
 let saved=initial,banner=null,scripts=[],cookies=[];const docEvents={},winEvents={};
 const doc={createElement(tag){let e=element();e.tag=tag;e.querySelector=()=>({focus(){e.focused=true}});e.remove=()=>{if(e===banner)banner=null;scripts=scripts.filter(s=>s!==e)};return e},querySelector(s){return s==='.analytics-consent'?banner:scripts[0]||null},querySelectorAll(){return scripts},body:{appendChild(e){banner=e}},head:{appendChild(e){scripts.push(e)}},addEventListener(k,f){docEvents[k]=f},set cookie(v){cookies.push(v)}};
 const ctx={document:doc,localStorage:{getItem(){if(blockRead)throw Error('blocked');return saved},setItem(k,v){if(blockWrite)throw Error('blocked');saved=v}},setTimeout:f=>f(),addEventListener(k,f){winEvents[k]=f}};ctx.window=ctx;
 vm.runInNewContext(readFileSync(root+'analytics-consent.js','utf8'),ctx);
 const choice=v=>{const b={dataset:{choice:v}};banner.events.click({target:{closest:s=>s==='button[data-choice]'?b:null}})};
 const settings=()=>{const b=element();docEvents.click({target:{closest:()=>b}});return b};
 return {ctx,doc,choice,settings,banner:()=>banner,scripts:()=>scripts,cookies:()=>cookies,saved:()=>saved,storage:v=>{saved=v;winEvents.storage({key:'dfg-analytics-consent'})}};
}
(async()=>{
 let count=0;const pass=n=>{console.log('PASS '+n);count++};
 let s=signup(()=>Promise.resolve({ok:true,json:async()=>({success:true})}));
 s.input.value='bad';s.submit();assert.equal(s.calls(),0);assert.equal(s.input.attrs['aria-invalid'],'true');assert(s.input.focused);pass('Invalid email stays local and focuses error field');
 let resolve;s=signup(()=>new Promise(r=>resolve=r));s.submit();s.submit();assert.equal(s.calls(),1);assert.equal(s.form.attrs['aria-busy'],'true');
 resolve({ok:true,json:async()=>({success:true})});await tick();assert.equal(s.message.attrs['data-state'],'success');assert.equal(s.button.disabled,true);assert.equal(s.form.attrs['aria-busy'],'false');assert.equal(s.timers.size,0);s.submit();assert.equal(s.calls(),1);pass('One submission while pending or already successful');
 s.input.value='another@example.test';s.input.events.input();assert.equal(s.button.disabled,false);pass('A new address restores the form after success');
 for(const [name,response,pattern] of [
 ['HTTP server error',{ok:false,status:503},/could not confirm/],
 ['Rate limiting',{ok:false,status:429},/too many requests/],
 ['Application rejection',{ok:true,json:async()=>({success:false})},/not accepted/],
 ['Invalid success value',{ok:true,json:async()=>({success:'false'})},/not accepted/],
 ['Malformed response',{ok:true,json:async()=>{throw Error('parse')}},/could not confirm/]]){
  s=signup(()=>Promise.resolve(response));s.submit();await tick();assert.match(s.message.textContent,pattern);assert.equal(s.button.disabled,false);assert.equal(s.form.attrs['aria-busy'],'false');pass(name+' gives recoverable feedback');
 }
 s=signup(()=>Promise.reject(Error('network')));s.submit();await tick();assert.equal(s.message.attrs['data-state'],'error');assert.equal(s.button.disabled,false);pass('Network failure permits retry');
 s=signup(()=>new Promise(r=>resolve=r));s.submit();s.timeout();await tick();assert.match(s.message.textContent,/taking longer/);assert.equal(s.button.disabled,false);resolve({ok:true,json:async()=>({success:true})});await tick();assert.equal(s.message.attrs['data-state'],'error');pass('Timeout finishes and a late response does not overwrite it');
 s=signup(null,false);assert.equal(s.form.hidden,true);assert.equal(s.fallback.hidden,false);pass('Unsupported browser retains email fallback');
 let a=analytics();assert.equal(a.scripts().length,0);assert.equal(a.ctx['ga-disable-G-HEXFX95CM1'],true);assert(a.banner());a.choice('declined');assert.equal(a.scripts().length,0);assert.equal(a.saved(),'declined');pass('Default and rejection load no analytics script');
 let trigger=a.settings();a.choice('accepted');assert.equal(a.scripts().length,1);assert(trigger.focused);assert.equal(a.ctx['ga-disable-G-HEXFX95CM1'],false);a.settings();a.choice('declined');assert.equal(a.scripts().length,0);assert.equal(a.ctx['ga-disable-G-HEXFX95CM1'],true);assert(a.cookies().some(c=>c.startsWith('_ga=')));pass('Accept and withdrawal update analytics and return keyboard focus');
 a=analytics('accepted');assert.equal(a.scripts().length,1);a.storage('declined');assert.equal(a.scripts().length,0);assert.equal(a.ctx['ga-disable-G-HEXFX95CM1'],true);pass('Withdrawal in another tab stops analytics');
 a=analytics(null,{blockRead:true,blockWrite:true});assert(a.banner());a.choice('accepted');assert.equal(a.scripts().length,1);a.settings();assert.match(a.banner().innerHTML,/currently on/);a.choice('declined');assert.equal(a.scripts().length,0);pass('Blocked storage preserves working accept and withdraw controls');
 a=analytics('declined',{blockWrite:true});a.settings();a.choice('accepted');a.settings();assert.match(a.banner().innerHTML,/currently on/);pass('Failed storage write still reports the current page choice');
 console.log(count+' behaviour checks passed; no external requests were made.');
})().catch(e=>{console.error(e);process.exitCode=1});
