function Xo(n){const e=Object.values(n).filter(i=>typeof i=="number");return Object.entries(n).filter(([i,r])=>e.indexOf(+i)===-1).map(([i,r])=>r)}function Mc(n,e="|"){return n.map(t=>Pu(t)).join(e)}function Yo(n,e){return typeof e=="bigint"?e.toString():e}class pf{constructor(e){this._getter=e,this._value=void 0}get value(){const e=this._getter;return e!==void 0&&(this._value=e(),this._getter=void 0),this._value}}function Ha(n){return new pf(n)}function mf(n){return n==null}function Wa(n){const e=n.startsWith("^")?1:0,t=n.endsWith("$")?n.length-1:n.length;return n.slice(e,t)}function gf(n,e){const t=n/e,i=Math.round(t),r=4*Number.EPSILON*Math.max(Math.abs(t),1);return Math.abs(t-i)<r?0:t-i}function Si(n,e,t){Object.defineProperty(n,e,{value:t,writable:!0,enumerable:!0,configurable:!0})}function bu(n){const e=Object.getOwnPropertyDescriptor(n,"shape");return e?.get?e.get.raw:e?.value}function On(n){return bu(n._zod.def)??n._zod.def.shape}function wu(n,e,t){Object.defineProperty(n,e,{get(){const i=t();return Si(this,e,i),i},enumerable:!0,configurable:!0})}function Tu(n,e,t){e in n?Si(n,e,t):n[e]=t}function xi(n,e,t,i){const r=On(e);for(const s of t){const o=Object.getOwnPropertyDescriptor(r,s);o.enumerable&&(o.get?wu(n,s,()=>{const a=e._zod.def.shape[s];return i?i(a,s):a}):Tu(n,s,i?i(o.value,s):o.value))}}function _f(n,e){for(const t of Reflect.ownKeys(e)){const i=Object.getOwnPropertyDescriptor(e,t);i.enumerable&&(i.get?wu(n,t,()=>e[t]):Tu(n,t,i.value))}}function qt(...n){const e={};for(const t of n){const i=Object.getOwnPropertyDescriptors(t);Object.assign(e,i)}return Object.defineProperties({},e)}function vf(n){return JSON.stringify(n)}function xf(n){return n.toLowerCase().trim().replace(/[^\w\s-]/g,"").replace(/[\s_-]+/g,"-").replace(/^-+|-+$/g,"")}const Ru="captureStackTrace"in Error?Error.captureStackTrace:(...n)=>{};function Rs(n){return typeof n=="object"&&n!==null&&!Array.isArray(n)}const Af=Ha(()=>{if(Sn.jitless||typeof navigator<"u"&&navigator?.userAgent?.includes("Cloudflare"))return!1;try{const n=Function;return new n(""),!0}catch{return!1}});function Cr(n){if(Rs(n)===!1)return!1;const e=n.constructor;if(e===void 0||typeof e!="function")return!0;const t=e.prototype;return!(Rs(t)===!1||Object.prototype.hasOwnProperty.call(t,"isPrototypeOf")===!1)}function Cu(n){return Cr(n)?{...n}:Array.isArray(n)?[...n]:n instanceof Map?new Map(n):n instanceof Set?new Set(n):n}const Ef=new Set(["string","number","symbol"]);function zs(n){return n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function $n(n,e,t){const i=new n._zod.constr(e??n._zod.def);return(!e||t?.parent)&&(i._zod.parent=n),i}function Ue(n){const e=n;if(!e)return{};if(typeof e=="string")return{error:()=>e};if(e?.message!==void 0){if(e?.error!==void 0)throw new Error("Cannot specify both `message` and `error` params");e.error=e.message}return delete e.message,typeof e.error=="string"?{...e,error:()=>e.error}:e}function Pu(n){return typeof n=="bigint"?n.toString()+"n":typeof n=="string"?`"${n}"`:`${n}`}function Sf(n){return Object.keys(n).filter(e=>n[e]._zod.optin!==void 0&&n[e]._zod.optout==="optional")}const Du={safeint:[Number.MIN_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],int32:[-2147483648,2147483647],uint32:[0,4294967295],float32:[-34028234663852886e22,34028234663852886e22],float64:[-Number.MAX_VALUE,Number.MAX_VALUE]},yf={int64:[BigInt("-9223372036854775808"),BigInt("9223372036854775807")],uint64:[BigInt(0),BigInt("18446744073709551615")]};function Mf(n,e){const t=n._zod.def,i=t.checks;if(i&&i.length>0)throw new Error(".pick() cannot be used on object schemas containing refinements");const s={};return xi(s,n,Vs(n,e)),$n(n,qt(t,{shape:s,checks:[]}))}function Vs(n,e){const t=On(n),i=[];for(const r of Reflect.ownKeys(e)){if(!Object.getOwnPropertyDescriptor(t,r)?.enumerable)throw new Error(`Unrecognized key: "${String(r)}"`);e[r]&&i.push(r)}return i}function bf(n,e){const t=n._zod.def,i=t.checks;if(i&&i.length>0)throw new Error(".omit() cannot be used on object schemas containing refinements");const s=new Set(Vs(n,e)),o={};return xi(o,n,Reflect.ownKeys(On(n)).filter(a=>!s.has(a))),$n(n,qt(t,{shape:o,checks:[]}))}function wf(n,e){if(!Cr(e))throw new Error("Invalid input to extend: expected a plain object");const t=n._zod.def.checks;if(t&&t.length>0){const r=On(n);for(const s of Reflect.ownKeys(e))if(Object.getOwnPropertyDescriptor(r,s)!==void 0)throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.")}return $n(n,qt(n._zod.def,{shape:Iu(n,e)}))}function Iu(n,e){const t={};return xi(t,n,Reflect.ownKeys(On(n))),_f(t,e),t}function Tf(n,e){if(!Cr(e))throw new Error("Invalid input to safeExtend: expected a plain object");return $n(n,qt(n._zod.def,{shape:Iu(n,e)}))}function Rf(n,e){if(!e?._zod?.def)throw new Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");if(n._zod.def.checks?.length)throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");const t={};xi(t,n,Reflect.ownKeys(On(n))),xi(t,e,Reflect.ownKeys(On(e)));const i=qt(n._zod.def,{shape:t,get catchall(){return e._zod.def.catchall},checks:e._zod.def.checks??[]});return $n(n,i)}function bc(n,e,t,i="partial"){const s=e._zod.def.checks;if(s&&s.length>0)throw new Error(`.${i}() cannot be used on object schemas containing refinements`);const a=t?new Set(Vs(e,t)):void 0,c={};return xi(c,e,Reflect.ownKeys(On(e)),n&&((l,u)=>a&&!a.has(u)?l:new n({type:"optional",innerType:l}))),$n(e,qt(e._zod.def,{shape:c,checks:[]}))}function Cf(n,e,t){const i=t?new Set(Vs(e,t)):void 0,r={};return xi(r,e,Reflect.ownKeys(On(e)),(s,o)=>i&&!i.has(o)?s:new n({type:"nonoptional",innerType:s})),$n(e,qt(e._zod.def,{shape:r}))}function Nn(n,e=0){if(n.aborted===!0)return!0;for(let t=e;t<n.issues.length;t++)if(n.issues[t]?.continue!==!0)return!0;return!1}function Pf(n,e=0){if(n.aborted===!0)return!0;for(let t=e;t<n.issues.length;t++)if(n.issues[t]?.continue===!1)return!0;return!1}function Uu(n,e){return e.map(t=>{var i;return(i=t).path??(i.path=[]),t.path.unshift(n),t})}function or(n){return typeof n=="string"?n:n?.message}function wc(n,e,t){var i;for(let r=e;r<n.length;r++)(i=n[r]).schema??(i.schema=t)}function $i(n,e,t){var i;const r=n.inst?._zod?.traits;r?.has("$ZodType")&&(r.has("$ZodCheck")?(i=n).schema??(i.schema=n.inst):n.schema=n.inst);const s=n.schema!==n.inst?n.schema?._zod.def?.error:void 0,o=n.message?n.message:or(n.inst?._zod.def?.error?.(n))??or(s?.(n))??or(e?.error?.(n))??or(t.customError?.(n))??or(t.localeError?.(n))??"Invalid input",a={};for(const c of Object.keys(n))c==="inst"||c==="schema"||c==="continue"||c==="input"||c==="__proto__"||(a[c]=n[c]);return a.path??(a.path=[]),a.message=o,e?.reportInput&&(a.input=n.input),a}const Df=/[\uD800-\uDBFF]/;function Xa(n){const e=n.length;if(!Df.test(n))return e;let t=e;for(let i=0;i<e-1;i++)(n.charCodeAt(i)&64512)===55296&&(n.charCodeAt(i+1)&64512)===56320&&(t--,i++);return t}function Ya(n){return Array.isArray(n)?"array":typeof n=="string"?"string":"unknown"}function If(n){const e=typeof n;switch(e){case"number":return Number.isNaN(n)?"nan":"number";case"object":{if(n===null)return"null";if(Array.isArray(n))return"array";const t=n;if(t&&Object.getPrototypeOf(t)!==Object.prototype&&"constructor"in t&&t.constructor)return t.constructor.name}}return e}function Pr(...n){const[e,t,i]=n;return typeof e=="string"?{message:e,code:"custom",input:t,inst:i}:{...e}}function Uf(n,e){for(const t in e){const i=Object.getOwnPropertyDescriptor(e,t);i.get?Object.defineProperty(n,t,{...i,enumerable:!1}):Tc(n,t,i.value)}for(const t of Object.getOwnPropertySymbols(e))Tc(n,t,e[t])}function Jn(n,e,t,i=!0){return Object.defineProperty(n,e,{configurable:!0,writable:!0,enumerable:i,value:t}),t}function Lu(n,e,t){return Jn(n,e,t,!1)}function Nu(n,e){for(const t in n){const i=n[t];Object.defineProperty(e,t,{configurable:!0,enumerable:!0,get(){return Jn(this,t,i(this))},set(r){Jn(this,t,r)}})}return e}function Tc(n,e,t){Object.defineProperty(n,e,{configurable:!0,get(){return this==null?t:Jn(this,e,t.bind(this))},set(i){Jn(this,e,i)}})}function Lf(n,e){const t=Object.getPrototypeOf(n);return e in t?void 0:t}let Qs,Kn=!1;const Nf={configurable:!0,get(){Kn=!0}};function nt(n,e,t){const i=Object.getPrototypeOf(n._zod);if(e in i&&Qs!==n._zod){Qs=void 0;return}Qs=n._zod,Object.defineProperty(i,e,{configurable:!0,get(){Object.defineProperty(this,e,Nf);const r=Kn;Kn=!1;try{const s=t(this);return Kn?delete this[e]:Object.defineProperty(this,e,{configurable:!0,writable:!0,value:s}),Kn=Kn||r,s}catch(s){throw delete this[e],Kn=Kn||r,s}},set(r){Object.defineProperty(this,e,{configurable:!0,writable:!0,value:r})}})}function kf(n,e,t,i){const r=Lf(n,e);r&&Object.defineProperty(r,e,{configurable:!0,get(){const s={configurable:!0,writable:!0,enumerable:i,value:void 0};return Object.defineProperty(this,e,s),s.value=t(this),Object.defineProperty(this,e,s),s.value},set(s){Object.defineProperty(this,e,{configurable:!0,writable:!0,enumerable:i,value:s})}})}const Ff="~constantCatch";function Of(n){const e=()=>n;return e[Ff]=!0,e}var Rc;const Js={value:void 0,enumerable:!1};let Cc="captureStackTrace"in Error?Error:null;function Bf(n){const e=Cc;if(e){const t=e.stackTraceLimit;if(typeof t=="number"){try{e.stackTraceLimit=0}catch{return Cc=null,new n}try{return new n}finally{e.stackTraceLimit=t}}}return new n}function J(n,e,t,i){const r={};function s(f){this.def=f,this.constr=h,this.traits=new Set}s.prototype=r;const o=t,a=o&&new WeakSet;function c(f,d){if(!f._zod){Js.value=new s(d);try{Object.defineProperty(f,"_zod",Js)}finally{Js.value=void 0}}if(f._zod.traits.has(n))return;if(f._zod.traits.add(n),e(f,d),a){const _=Object.getPrototypeOf(f),m=f._zod.constr.prototype;let p=_;for(;p&&p!==m;)p=Object.getPrototypeOf(p);const A=p??_;a.has(A)||(a.add(A),Uf(A,o))}const g=h.prototype;for(const _ in g)Object.prototype.hasOwnProperty.call(g,_)&&(_ in f||(f[_]=g[_].bind(f)))}const l=i?.Parent??Object;class u extends l{}Object.defineProperty(u,"name",{value:n});function h(f){const d=i?.Parent?Bf(u):this;c(d,f);const g=d._zod.deferred;if(g){for(const m of g)m();d._zod.deferred=void 0}const _=globalThis.__zod_globalConfig?.postProcessor;return _&&_(d),d}return Object.defineProperty(h,"init",{value:c}),Object.defineProperty(h,Symbol.hasInstance,{value:f=>i?.Parent&&f instanceof i.Parent?!0:f?._zod?.traits?.has(n)}),Object.defineProperty(h,"name",{value:n}),h}class vi extends Error{constructor(){super("Encountered Promise during synchronous parse. Use .parseAsync() instead.")}}class ku extends Error{constructor(e){super(`Encountered unidirectional transform during encode: ${e}`),this.name="ZodEncodeError"}}(Rc=globalThis).__zod_globalConfig??(Rc.__zod_globalConfig={});const Sn=globalThis.__zod_globalConfig;function ei(n){return n&&Object.assign(Sn,n),Sn}function zf(){const n=this._zod;return n.message??(n.message=JSON.stringify(n.def,Yo,2)),n.message}function Vf(n){this._zod.message=n}const Gf={get:zf,set:Vf,enumerable:!0,configurable:!0},$s={value:void 0,enumerable:!1},Pc=new WeakSet([Object.prototype,Error.prototype]),Hf=(n,e)=>{n.name="$ZodError",$s.value=e,Object.defineProperty(n,"issues",$s),$s.value=void 0,Object.defineProperty(n,"message",Gf);const t=Object.getPrototypeOf(n);Pc.has(t)||(Pc.add(t),Object.defineProperty(t,"toString",{configurable:!0,enumerable:!1,get(){const i=()=>this.message;return Object.defineProperty(this,"toString",{value:i,configurable:!0,writable:!0}),i},set(i){Object.defineProperty(this,"toString",{value:i,configurable:!0,writable:!0})}}))},Wf=J("$ZodError",Hf);function Xf(n,e,t){return Object.prototype.hasOwnProperty.call(n,e)||(e==="__proto__"?Object.defineProperty(n,e,{value:t(),writable:!0,enumerable:!0,configurable:!0}):n[e]=t()),n[e]}function Yf(n,e=t=>t.message){const t={},i=[];for(const r of n.issues)r.path.length>0?Xf(t,r.path[0],()=>[]).push(e(r)):i.push(e(r));return{formErrors:i,fieldErrors:t}}function Zf(n,e=t=>t.message){const t={_errors:[]},i=(r,s=[])=>{for(const o of r.issues)if(o.code==="invalid_union"&&o.errors.length)o.errors.map(a=>i({issues:a},[...s,...o.path]));else if(o.code==="invalid_key")i({issues:o.issues},[...s,...o.path]);else if(o.code==="invalid_element")i({issues:o.issues},[...s,...o.path]);else{const a=[...s,...o.path];if(a.length===0)t._errors.push(e(o));else{let c=t,l=0;for(;l<a.length;){const u=a[l],h=l===a.length-1;if(u==="_errors"){h&&c._errors.push(e(o)),l++;continue}Object.prototype.hasOwnProperty.call(c,u)||Object.defineProperty(c,u,{value:{_errors:[]},enumerable:!0,writable:!0,configurable:!0});const f=c[u];h&&f._errors.push(e(o)),c=f,l++}}}};return i(n),t}function Gs(n,e){return{callee:e?.callee??n,Err:e?.Err}}const Za=n=>{const e=(t,i,r,s)=>{const o=r?{...r,async:!1}:{async:!1},a=t._zod.run({value:i,issues:[]},o);if(a instanceof Promise)throw new vi;if(a.issues.length){const c=new(s?.Err??n)(a.issues.map(l=>$i(l,o,ei())));throw Ru(c,s?.callee??e),c}return a.value};return e},ja=n=>{const e=async(t,i,r,s)=>{const o=r?{...r,async:!0}:{async:!0};let a=t._zod.run({value:i,issues:[]},o);if(a instanceof Promise&&(a=await a),a.issues.length){const c=new(s?.Err??n)(a.issues.map(l=>$i(l,o,ei())));throw Ru(c,s?.callee??e),c}return a.value};return e},Ka=n=>(e,t,i)=>{const r=i?{...i,async:!1}:{async:!1},s=e._zod.run({value:t,issues:[]},r);if(s instanceof Promise)throw new vi;return s.issues.length?Fu(n,s.issues,r):{success:!0,data:s.value}};function Fu(n,e,t){let i;return{success:!1,get error(){return i||(i=new n(e.map(r=>$i(r,t,ei()))),e=void 0,t=void 0),i},set error(r){i=r,e=void 0,t=void 0}}}const qa=n=>async(e,t,i)=>{const r=i?{...i,async:!0}:{async:!0};let s=e._zod.run({value:t,issues:[]},r);return s instanceof Promise&&(s=await s),s.issues.length?Fu(n,s.issues,r):{success:!0,data:s.value}},jf=Symbol.for("zod.compile.invalid"),Kf=Symbol.for("zod.compile.fallback"),qf=((n,e,t)=>{const i=n._zod.bag.validator;if(i!==void 0){if(i(e)!==jf)return!0;if(i.definite===!0&&t===void 0)return!1}return Qf(n,e,t)});function Qf(n,e,t){const i=t?{...t,async:!1,abortEarly:!0}:{async:!1,abortEarly:!0},r=n._zod.bag.fallbackRun;let s;if(r?(i[Kf]=!0,s=r({value:e,issues:[]},i)):s=n._zod.run({value:e,issues:[]},i),s instanceof Promise)throw new vi;return s.issues.length===0}const Jf=async(n,e,t)=>{const i=t?{...t,async:!0,abortEarly:!0}:{async:!0,abortEarly:!0};let r=n._zod.run({value:e,issues:[]},i);return r instanceof Promise&&(r=await r),r.issues.length===0},$f=n=>{const e=Za(n),t=(i,r,s,o)=>{const a=s?{...s,direction:"backward"}:{direction:"backward"};return e(i,r,a,Gs(t,o))};return t},ed=n=>{const e=Za(n),t=(i,r,s,o)=>e(i,r,s,Gs(t,o));return t},td=n=>{const e=ja(n),t=async(i,r,s,o)=>{const a=s?{...s,direction:"backward"}:{direction:"backward"};return await e(i,r,a,Gs(t,o))};return t},nd=n=>{const e=ja(n),t=async(i,r,s,o)=>await e(i,r,s,Gs(t,o));return t},id=n=>(e,t,i)=>{const r=i?{...i,direction:"backward"}:{direction:"backward"};return Ka(n)(e,t,r)},rd=n=>(e,t,i)=>Ka(n)(e,t,i),sd=n=>async(e,t,i)=>{const r=i?{...i,direction:"backward"}:{direction:"backward"};return qa(n)(e,t,r)},od=n=>async(e,t,i)=>qa(n)(e,t,i),ad=/^[cC][0-9a-z]{6,}$/,cd=/^[0-9a-z]+$/,ld=/^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/,ud=/^[0-9a-vA-V]{20}$/,hd=/^[A-Za-z0-9]{27}$/,fd=/^[a-zA-Z0-9_-]{21}$/;function dd(n){return new RegExp(`^[a-zA-Z0-9_-]{${n}}$`)}const pd=/^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/,md=/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,Dc=n=>n?new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${n}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`):/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,gd=/^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,_d="^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$";function vd(){return new RegExp(_d,"u")}const xd=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,Ad=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,Ed=/^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,Sd=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,yd=/^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/,Md=/^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/,bd=/^https?$/,wd=/^\+[1-9]\d{6,14}$/,Ou="(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))";function Td(n){return new RegExp(`^${n}$`)}const Rd=Td(Ou);function Zo(n){const e="(?:[01]\\d|2[0-3]):[0-5]\\d";return typeof n.precision=="number"?n.precision===-1?`${e}`:n.precision===0?`${e}:[0-5]\\d`:`${e}:[0-5]\\d\\.\\d{${n.precision}}`:n.seconds?`${e}:[0-5]\\d(?:\\.\\d+)?`:`${e}(?::[0-5]\\d(?:\\.\\d+)?)?`}function Cd(n){return new RegExp(`^${Zo(n)}$`)}function Pd(n){const e=["Z"];n.offset&&e.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");const t=`${Zo({precision:n.precision,seconds:!0})}(?:${e.join("|")})`,i=n.local?`${t}|${Zo({precision:n.precision})}`:t;return new RegExp(`^${Ou}T(?:${i})$`)}const Dd=/^[\s\S]{0,}$/,Id=/^-?\d+(?:\.\d+)?$/,Ud=/^(?:true|false)$/i,Ld=/^[^A-Z]*$/,Nd=/^[^a-z]*$/,Gt=J("$ZodCheck",(n,e)=>{var t;n._zod??(n._zod={}),n._zod.def=e,(t=n._zod).onattach??(t.onattach=[])}),Qa=n=>{const e=n.value;return!mf(e)&&e.length!==void 0},Cs={number:"number",bigint:"bigint",object:"date"},Bu=J("$ZodCheckLessThan",(n,e)=>{Gt.init(n,e);const t=Cs[typeof e.value];n._zod.check=i=>{(e.inclusive?i.value<=e.value:i.value<e.value)||i.issues.push({origin:Cs[typeof i.value]??t,code:"too_big",maximum:typeof e.value=="object"?e.value.getTime():e.value,input:i.value,inclusive:e.inclusive,inst:n,continue:!e.abort})}}),zu=J("$ZodCheckGreaterThan",(n,e)=>{Gt.init(n,e);const t=Cs[typeof e.value];n._zod.check=i=>{(e.inclusive?i.value>=e.value:i.value>e.value)||i.issues.push({origin:Cs[typeof i.value]??t,code:"too_small",minimum:typeof e.value=="object"?e.value.getTime():e.value,input:i.value,inclusive:e.inclusive,inst:n,continue:!e.abort})}}),kd=J("$ZodCheckMultipleOf",(n,e)=>{Gt.init(n,e),n._zod.check=t=>{if(typeof t.value!=typeof e.value)throw new Error("Cannot mix number and bigint in multiple_of check.");(typeof t.value=="bigint"?e.value!==BigInt(0)&&t.value%e.value===BigInt(0):gf(t.value,e.value)===0)||t.issues.push({origin:typeof t.value,code:"not_multiple_of",divisor:e.value,input:t.value,inst:n,continue:!e.abort})}}),Fd=J("$ZodCheckNumberFormat",(n,e)=>{Gt.init(n,e),e.format=e.format||"float64";const t=e.format?.includes("int"),i=t?"int":"number",[r,s]=Du[e.format];n._zod.check=o=>{const a=o.value;if(t){if(!Number.isInteger(a)){o.issues.push({expected:i,format:e.format,code:"invalid_type",continue:!1,input:a,inst:n});return}if(!Number.isSafeInteger(a)){a>0?o.issues.push({input:a,code:"too_big",maximum:Number.MAX_SAFE_INTEGER,note:"Integers must be within the safe integer range.",inst:n,origin:i,inclusive:!0,continue:!e.abort}):o.issues.push({input:a,code:"too_small",minimum:Number.MIN_SAFE_INTEGER,note:"Integers must be within the safe integer range.",inst:n,origin:i,inclusive:!0,continue:!e.abort});return}}a<r&&o.issues.push({origin:"number",input:a,code:"too_small",minimum:r,inclusive:!0,inst:n,continue:!e.abort}),a>s&&o.issues.push({origin:"number",input:a,code:"too_big",maximum:s,inclusive:!0,inst:n,continue:!e.abort})}}),Od=J("$ZodCheckMaxLength",(n,e)=>{var t;Gt.init(n,e),(t=n._zod.def).when??(t.when=Qa),n._zod.check=i=>{const r=i.value,s=r.length;if((typeof r=="string"&&s>e.maximum?Xa(r):s)<=e.maximum)return;const a=Ya(r);i.issues.push({origin:a,code:"too_big",maximum:e.maximum,inclusive:!0,input:r,inst:n,continue:!e.abort})}}),Bd=J("$ZodCheckMinLength",(n,e)=>{var t;Gt.init(n,e),(t=n._zod.def).when??(t.when=Qa),n._zod.check=i=>{const r=i.value,s=r.length;if((typeof r=="string"&&s>=e.minimum&&s<e.minimum*2?Xa(r):s)>=e.minimum)return;const a=Ya(r);i.issues.push({origin:a,code:"too_small",minimum:e.minimum,inclusive:!0,input:r,inst:n,continue:!e.abort})}}),zd=J("$ZodCheckLengthEquals",(n,e)=>{var t;Gt.init(n,e),(t=n._zod.def).when??(t.when=Qa),n._zod.check=i=>{const r=i.value,s=r.length,o=typeof r=="string"&&s>=e.length&&s<=e.length*2?Xa(r):s;if(o===e.length)return;const a=Ya(r),c=o>e.length;i.issues.push({origin:a,...c?{code:"too_big",maximum:e.length}:{code:"too_small",minimum:e.length},inclusive:!0,exact:!0,input:i.value,inst:n,continue:!e.abort})}}),Hs=J("$ZodCheckStringFormat",(n,e)=>{var t,i;Gt.init(n,e),e.pattern?(t=n._zod).check??(t.check=r=>{e.pattern.lastIndex=0,!e.pattern.test(r.value)&&r.issues.push({origin:"string",code:"invalid_format",format:e.format,input:r.value,...e.pattern?{pattern:e.pattern.toString()}:{},inst:n,continue:!e.abort})}):(i=n._zod).check??(i.check=()=>{})}),Vd=J("$ZodCheckRegex",(n,e)=>{Hs.init(n,e),n._zod.check=t=>{e.pattern.lastIndex=0,!e.pattern.test(t.value)&&t.issues.push({origin:"string",code:"invalid_format",format:"regex",input:t.value,pattern:e.pattern.toString(),inst:n,continue:!e.abort})}}),Gd=J("$ZodCheckLowerCase",(n,e)=>{e.pattern??(e.pattern=Ld),Hs.init(n,e)}),Hd=J("$ZodCheckUpperCase",(n,e)=>{e.pattern??(e.pattern=Nd),Hs.init(n,e)}),Wd=J("$ZodCheckIncludes",(n,e)=>{Gt.init(n,e);const t=zs(e.includes),i=new RegExp(typeof e.position=="number"?`^.{${e.position},}${t}`:t);e.pattern=i,n._zod.check=r=>{r.value.includes(e.includes,e.position)||r.issues.push({origin:"string",code:"invalid_format",format:"includes",includes:e.includes,input:r.value,inst:n,continue:!e.abort})}}),Xd=J("$ZodCheckStartsWith",(n,e)=>{Gt.init(n,e);const t=new RegExp(`^${zs(e.prefix)}.*`);e.pattern??(e.pattern=t),n._zod.check=i=>{i.value.startsWith(e.prefix)||i.issues.push({origin:"string",code:"invalid_format",format:"starts_with",prefix:e.prefix,input:i.value,inst:n,continue:!e.abort})}}),Yd=J("$ZodCheckEndsWith",(n,e)=>{Gt.init(n,e);const t=new RegExp(`.*${zs(e.suffix)}$`);e.pattern??(e.pattern=t),n._zod.check=i=>{i.value.endsWith(e.suffix)||i.issues.push({origin:"string",code:"invalid_format",format:"ends_with",suffix:e.suffix,input:i.value,inst:n,continue:!e.abort})}}),Zd=J("$ZodCheckOverwrite",(n,e)=>{Gt.init(n,e),n._zod.check=t=>{t.value=e.tx(t.value)}});class jd{constructor(e=[],t={}){this.content=[],this.indent=0,this.args=e,this.closed=t}indented(e){this.indent+=1;try{e(this)}finally{this.indent-=1}}write(e){if(typeof e=="function"){e(this,{execution:"sync"}),e(this,{execution:"async"});return}const i=e.split(`
`).filter(o=>o),r=Math.min(...i.map(o=>o.length-o.trimStart().length)),s=i.map(o=>o.slice(r)).map(o=>" ".repeat(this.indent*2)+o);for(const o of s)this.content.push(o)}compile(){const e=Function,t=this?.content??[""];return new e(...Object.keys(this.closed),`return function (${this.args.join(", ")}) {
${t.join(`
`)}
};`)(...Object.values(this.closed))}}const Kd={major:4,minor:6,patch:2},At=J("$ZodType",(n,e)=>{var t;n??(n={}),n._zod.def=e,n._zod.bag=n._zod.bag||{},n._zod.version=Kd;const i=n._zod.def.checks,r=n._zod.traits.has("$ZodCheck")?[n,...i??[]]:i?.length?[...i]:[];for(const s of r)for(const o of s._zod.onattach)o(n);if(r.length===0)(t=n._zod).deferred??(t.deferred=[]),n._zod.deferred?.push(()=>{n._zod.run=n._zod.parse});else{const s=(a,c,l)=>{if(a.memo)return a;let u=Nn(a),h;for(const f of c){if(f._zod.def.when){if(Pf(a)||!f._zod.def.when(a))continue}else if(u)continue;const d=a.issues.length,g=f._zod.check(a);if(g instanceof Promise&&l?.async===!1)throw new vi;if(h||g instanceof Promise)h=(h??Promise.resolve()).then(async()=>{await g,a.issues.length!==d&&(wc(a.issues,d,n),u||(u=Nn(a,d)))});else{if(a.issues.length===d)continue;wc(a.issues,d,n),u||(u=Nn(a,d))}}return h?h.then(()=>a):a},o=(a,c,l)=>{if(Nn(a))return a.aborted=!0,a;const u=s(c,r,l);if(u instanceof Promise){if(l.async===!1)throw new vi;return u.then(h=>n._zod.parse(h,l))}return n._zod.parse(u,l)};n._zod.run=(a,c)=>{if(c.skipChecks)return n._zod.parse(a,c);if(c.direction==="backward"){const u=n._zod.parse({value:a.value,issues:[]},{...c,skipChecks:!0});return u instanceof Promise?u.then(h=>o(h,a,c)):o(u,a,c)}const l=n._zod.parse(a,c);if(l instanceof Promise){if(c.async===!1)throw new vi;return l.then(u=>s(u,r,c))}return s(l,r,c)}}},{get"~standard"(){return Lu(this,"~standard",Gu(this))},set"~standard"(n){Jn(this,"~standard",n)}}),Vu=(n,e)=>n.issues.length?{issues:n.issues.map(t=>$i(t,e,ei()))}:{value:n.value};async function qd(n,e){const t={async:!0};return Vu(await n._zod.run({value:e,issues:[]},t),t)}function Gu(n){return{validate:e=>{const t={async:!1};try{const i=n._zod.run({value:e,issues:[]},t);if(!(i instanceof Promise))return Vu(i,t)}catch{}return qd(n,e)},vendor:"zod",version:1}}const Ja=J("$ZodString",(n,e)=>{At.init(n,e),n._zod.pattern=e.pattern??Dd,n._zod.parse=(t,i)=>{if(e.coerce)try{t.value=String(t.value)}catch{}return typeof t.value=="string"||t.issues.push({expected:"string",code:"invalid_type",input:t.value,inst:n}),t}}),dt=J("$ZodStringFormat",(n,e)=>{Hs.init(n,e),Ja.init(n,e)}),Qd=J("$ZodGUID",(n,e)=>{e.pattern??(e.pattern=md),dt.init(n,e)}),Jd=J("$ZodUUID",(n,e)=>{if(e.version){const i={v1:1,v2:2,v3:3,v4:4,v5:5,v6:6,v7:7,v8:8}[e.version];if(i===void 0)throw new Error(`Invalid UUID version: "${e.version}"`);e.pattern??(e.pattern=Dc(i))}else e.pattern??(e.pattern=Dc());dt.init(n,e)}),$d=J("$ZodEmail",(n,e)=>{e.pattern??(e.pattern=gd),dt.init(n,e)}),Hu=1,Wu=2;function ep(n,e){if(!e.normalize&&e.protocol?.source===bd.source&&!/^https?:\/\//i.test(n))return Hu;try{return new URL(n)}catch{return Wu}}const tp=/[\t\n\r]/g;function np(n){return n.replace(tp,"")}function ip(n,e){return e.lastIndex=0,e.test(n.hostname)}function rp(n,e){return e.lastIndex=0,e.test(n.protocol.endsWith(":")?n.protocol.slice(0,-1):n.protocol)}const sp=J("$ZodURL",(n,e)=>{dt.init(n,e),n._zod.check=t=>{try{const i=t.value.trim(),r=ep(i,e);if(r===Hu){t.issues.push({code:"invalid_format",format:"url",note:"Invalid URL format",input:t.value,inst:n,continue:!e.abort});return}if(r===Wu){t.issues.push({code:"invalid_format",format:"url",input:t.value,inst:n,continue:!e.abort});return}e.hostname&&!ip(r,e.hostname)&&t.issues.push({code:"invalid_format",format:"url",note:"Invalid hostname",pattern:e.hostname.source,input:t.value,inst:n,continue:!e.abort}),e.protocol&&!rp(r,e.protocol)&&t.issues.push({code:"invalid_format",format:"url",note:"Invalid protocol",pattern:e.protocol.source,input:t.value,inst:n,continue:!e.abort}),t.value=e.normalize?r.href:np(i);return}catch{t.issues.push({code:"invalid_format",format:"url",input:t.value,inst:n,continue:!e.abort})}}}),op=J("$ZodEmoji",(n,e)=>{e.pattern??(e.pattern=vd()),dt.init(n,e)}),ap=J("$ZodNanoID",(n,e)=>{if(e.length!==void 0&&(!Number.isInteger(e.length)||e.length<1))throw new Error(`Invalid nanoid length: ${e.length}`);e.pattern??(e.pattern=e.length===void 0?fd:dd(e.length)),dt.init(n,e)}),cp=J("$ZodCUID",(n,e)=>{e.pattern??(e.pattern=ad),dt.init(n,e)}),lp=J("$ZodCUID2",(n,e)=>{e.pattern??(e.pattern=cd),dt.init(n,e)}),up=J("$ZodULID",(n,e)=>{e.pattern??(e.pattern=ld),dt.init(n,e)}),hp=J("$ZodXID",(n,e)=>{e.pattern??(e.pattern=ud),dt.init(n,e)}),fp=J("$ZodKSUID",(n,e)=>{e.pattern??(e.pattern=hd),dt.init(n,e)}),dp=J("$ZodISODateTime",(n,e)=>{e.pattern??(e.pattern=Pd(e)),dt.init(n,e)}),pp=J("$ZodISODate",(n,e)=>{e.pattern??(e.pattern=Rd),dt.init(n,e)}),mp=J("$ZodISOTime",(n,e)=>{e.pattern??(e.pattern=Cd(e)),dt.init(n,e)}),gp=J("$ZodISODuration",(n,e)=>{e.pattern??(e.pattern=pd),dt.init(n,e)}),_p=J("$ZodIPv4",(n,e)=>{e.pattern??(e.pattern=xd),dt.init(n,e)}),vp=/^[0-9a-fA-F:.]+$/;function Xu(n){if(!vp.test(n))return!1;try{return new URL(`http://[${n}]`),!0}catch{return!1}}const xp=J("$ZodIPv6",(n,e)=>{e.pattern??(e.pattern=Ad),dt.init(n,e),n._zod.check=t=>{Xu(t.value)||t.issues.push({code:"invalid_format",format:"ipv6",input:t.value,inst:n,continue:!e.abort})}}),Ap=J("$ZodCIDRv4",(n,e)=>{e.pattern??(e.pattern=Ed),dt.init(n,e)});function Ep(n){const e=n.split("/");if(e.length!==2)return!1;const[t,i]=e;if(!i)return!1;const r=Number(i);return`${r}`!==i||r<0||r>128?!1:Xu(t)}const Sp=J("$ZodCIDRv6",(n,e)=>{e.pattern??(e.pattern=Sd),dt.init(n,e),n._zod.check=t=>{Ep(t.value)||t.issues.push({code:"invalid_format",format:"cidrv6",input:t.value,inst:n,continue:!e.abort})}});function Yu(n){if(n==="")return!0;if(/\s/.test(n)||n.length%4!==0)return!1;try{return atob(n),!0}catch{return!1}}const Zu=/^[0-9a-zA-Z+/]*={0,2}$/,yp=J("$ZodBase64",(n,e)=>{e.pattern??(e.pattern=Zu),dt.init(n,e),n._zod.check=t=>{Yu(t.value)||t.issues.push({code:"invalid_format",format:"base64",input:t.value,inst:n,continue:!e.abort})}}),$a=/^[A-Za-z0-9_-]*$/;function Mp(n){if(!$a.test(n))return!1;const e=n.replace(/[-_]/g,i=>i==="-"?"+":"/"),t=e.padEnd(Math.ceil(e.length/4)*4,"=");return Yu(t)}const bp=J("$ZodBase64URL",(n,e)=>{e.pattern??(e.pattern=$a),dt.init(n,e),n._zod.check=t=>{Mp(t.value)||t.issues.push({code:"invalid_format",format:"base64url",input:t.value,inst:n,continue:!e.abort})}}),wp=J("$ZodE164",(n,e)=>{e.pattern??(e.pattern=wd),dt.init(n,e)});function Tp(n,e=null){try{const t=n.split(".");if(t.length!==3)return!1;const[i]=t;if(!i)return!1;const r=JSON.parse(atob(i));return!("typ"in r&&r?.typ!=="JWT"||!r.alg||e&&(!("alg"in r)||r.alg!==e))}catch{return!1}}const Rp=J("$ZodJWT",(n,e)=>{dt.init(n,e),n._zod.check=t=>{Tp(t.value,e.alg)||t.issues.push({code:"invalid_format",format:"jwt",input:t.value,inst:n,continue:!e.abort})}}),ju=J("$ZodNumber",(n,e)=>{At.init(n,e),n._zod.pattern=Id,n._zod.parse=(t,i)=>{if(e.coerce)try{t.value=Number(t.value)}catch{}const r=t.value;if(typeof r=="number"&&!Number.isNaN(r)&&Number.isFinite(r))return t;const s=typeof r=="number"?Number.isNaN(r)?"NaN":Number.isFinite(r)?void 0:String(r):void 0;return t.issues.push({expected:"number",code:"invalid_type",input:r,inst:n,...s?{received:s}:{}}),t}}),Cp=J("$ZodNumberFormat",(n,e)=>{Fd.init(n,e),ju.init(n,e)}),Pp=J("$ZodBoolean",(n,e)=>{At.init(n,e),n._zod.pattern=Ud,n._zod.parse=(t,i)=>{if(e.coerce)try{t.value=!!t.value}catch{}const r=t.value;return typeof r=="boolean"||t.issues.push({expected:"boolean",code:"invalid_type",input:r,inst:n}),t}}),Dp=J("$ZodUnknown",(n,e)=>{At.init(n,e),n._zod.parse=t=>t}),Ip=J("$ZodNever",(n,e)=>{At.init(n,e),n._zod.parse=(t,i)=>(t.issues.push({expected:"never",code:"invalid_type",input:t.value,inst:n}),t)});function Ic(n,e,t){n.issues.length&&e.issues.push(...Uu(t,n.issues)),e.value[t]=n.value}const Up=J("$ZodArray",(n,e)=>{At.init(n,e);const t=Sn.memoizer;t?.attach(n),n._zod.parse=(i,r)=>{const s=i.value;if(!Array.isArray(s))return i.issues.push({expected:"array",code:"invalid_type",input:s,inst:n}),i;i.value=t?t.alloc(n,i,Array(s.length),r):Array(s.length);const o=[],a=r?.abortEarly;for(let c=0;c<s.length;c++){const l=s[c],u=e.element._zod.run({value:l,issues:[]},r);if(u instanceof Promise)o.push(u.then(h=>Ic(h,i,c)));else if(Ic(u,i,c),a&&u.issues.length!==0&&Nn(u))break}return o.length?Promise.all(o).then(()=>i):i}});function Ps(n,e,t,i,r,s){const o=t in i,a=s==="optional";if(!(!o&&a&&r==="optional")){if(n.issues.length){if(r!==void 0&&a&&!o)return;e.issues.push(...Uu(t,n.issues))}if(!o&&r===void 0){n.issues.length||e.issues.push({code:"invalid_type",expected:"nonoptional",input:void 0,path:[t]});return}n.value===void 0?(o||r==="defaulted"&&!a)&&(e.value[t]=void 0):e.value[t]=n.value}}const Lp=[];function Ku(n){const e=Object.keys(n.shape),t=Object.getOwnPropertySymbols(n.shape),i=t.length?t:Lp,r=i.length?[...e,...i]:e;for(const o of r)if(!n.shape?.[o]?._zod?.traits?.has("$ZodType"))throw new Error(`Invalid element at key "${String(o)}": expected a Zod schema`);const s=Sf(n.shape);return{...n,allKeys:r,symbolKeys:i,keySet:new Set(e),numKeys:e.length,optionalKeys:new Set(s)}}function qu(n,e,t,i,r,s,o){const a=[],c=r.keySet,l=r.catchall._zod,u=l.def.type,h=l.optin,f=l.optout;let d=0;for(const g in e){if(o&&t.issues.length!==d){if(Nn(t,d))break;d=t.issues.length}if(c.has(g))continue;if(g==="__proto__"){u==="never"&&a.push(g);continue}if(u==="never"){a.push(g);continue}const _=l.run({value:e[g],issues:[]},i);_ instanceof Promise?n.push(_.then(m=>Ps(m,t,g,e,h,f))):Ps(_,t,g,e,h,f)}return a.length&&t.issues.push({code:"unrecognized_keys",keys:a,input:e,inst:s,continue:!0}),n.length?Promise.all(n).then(()=>t):t}const Np=J("$ZodObject",(n,e)=>{At.init(n,e);const t=Object.getOwnPropertyDescriptor(e,"shape"),i=t?.get?t.get.raw:e.shape??{};if(i){const l=()=>{const u={...i};return Object.defineProperty(e,"shape",{value:u}),l.raw=u,u};l.raw=i,Object.defineProperty(e,"shape",{get:l})}const r=Ha(()=>Ku(e));nt(n,"propValues",l=>{const u=l.def.shape,h={};for(const f in u){const d=u[f]._zod;if(d.values){Object.prototype.hasOwnProperty.call(h,f)||Si(h,f,new Set);for(const g of d.values)h[f].add(g);d.optin!==void 0&&h[f].add(void 0)}}return h});const s=Rs,o=e.catchall;let a;const c=Sn.memoizer;c?.attach(n),n._zod.parse=(l,u)=>{a??(a=r.value);const h=l.value;if(!s(h))return l.issues.push({expected:"object",code:"invalid_type",input:h,inst:n}),l;l.value=c?c.alloc(n,l,{},u):{};const f=[],d=a.shape,g=u?.abortEarly;let _=l.issues.length;for(const m of a.allKeys){if(g&&l.issues.length!==_){if(Nn(l,_))break;_=l.issues.length}if(m==="__proto__")continue;const p=d[m],A=p._zod.optin,E=p._zod.optout,x=p._zod.run({value:h[m],issues:[]},u);x instanceof Promise?f.push(x.then(w=>Ps(w,l,m,h,A,E))):Ps(x,l,m,h,A,E)}return o?qu(f,h,l,u,r.value,n,g===!0):f.length?Promise.all(f).then(()=>l):l}}),kp=J("$ZodObjectJIT",(n,e)=>{Np.init(n,e);const t=n._zod.parse,i=Ha(()=>Ku(e)),r=Sn.memoizer,s=d=>{const g=i.value,_=g.symbolKeys,m=new jd(["payload","ctx"],{shape:d,inst:n,memo:r,syms:_}),p=w=>`shape[${w}]._zod.run({ value: input[${w}], issues: [] }, ctx)`,A=(w,b)=>`
          let ${w}_ab = false;
          for (let i = 0; i < ${w}.issues.length; i++) {
            const iss = ${w}.issues[i];
            iss.path = iss.path ? [${b}, ...iss.path] : [${b}];
            payload.issues.push(iss);
            if (iss.continue !== true) ${w}_ab = true;
          }
          if (${w}_ab && ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }`;m.write("const input = payload.value;");const E=Object.create(null);let x=0;for(const w of g.allKeys)E[w]=`key_${x++}`;m.write(r?"const newResult = memo.alloc(inst, payload, {}, ctx);":"const newResult = {};");for(const w of g.allKeys){if(w==="__proto__")continue;const b=E[w],R=typeof w=="symbol"?`syms[${_.indexOf(w)}]`:vf(w),I=`${R} in input`,M=d[w],S=M?._zod?.optin,C=S!==void 0,U=M?._zod?.optout==="optional";if(m.write(`const ${b} = ${p(R)};`),C&&U){const k=S==="optional"?`${b}_present`:`${b}.value !== undefined || ${b}_present`;m.write(`
        const ${b}_present = ${I};
        if (!${b}.issues.length || ${b}_present) {
          if (${b}.issues.length) {${A(b,R)}
          }

          if (${k}) {
            newResult[${R}] = ${b}.value;
          }
        }

      `)}else C?(m.write(`
        if (${b}.issues.length) {${A(b,R)}
        }
      `),S==="defaulted"?m.write(`newResult[${R}] = ${b}.value;`):m.write(`
        if (${b}.value !== undefined || ${I}) {
          newResult[${R}] = ${b}.value;
        }
      `)):m.write(`
        const ${b}_present = ${I};
        if (${b}.issues.length) {${A(b,R)}
        }
        if (!${b}_present && !${b}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${R}]
          });
          if (ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }
        }

        if (${b}_present) {
          newResult[${R}] = ${b}.value;
        }

      `)}return m.write("payload.value = newResult;"),m.write("return payload;"),m.compile()};let o;const a=Rs,c=!Sn.jitless,u=c&&Af.value,h=e.catchall;let f;n._zod.parse=(d,g)=>{f??(f=i.value);const _=d.value;return a(_)?c&&u&&g?.async===!1&&g.jitless!==!0?(o||(o=s(e.shape)),d=o(d,g),h?qu([],_,d,g,f,n,g?.abortEarly===!0):d):t(d,g):(d.issues.push({expected:"object",code:"invalid_type",input:_,inst:n}),d)}});function Uc(n,e,t,i){for(const s of n)if(s.issues.length===0)return e.value=s.value,e;const r=n.filter(s=>!Nn(s));return r.length===1?(e.value=r[0].value,r[0]):(e.issues.push({code:"invalid_union",input:e.value,inst:t,errors:n.map(s=>s.issues.map(o=>$i(o,i,ei())))}),e)}const Fp=J("$ZodUnion",(n,e)=>{At.init(n,e),nt(n,"optin",i=>i.def.options.some(r=>r._zod.optin==="defaulted")?"defaulted":i.def.options.some(r=>r._zod.optin!==void 0)?"optional":void 0),nt(n,"optout",i=>i.def.options.some(r=>r._zod.optout==="optional")?"optional":void 0),nt(n,"values",i=>{if(i.def.options.every(r=>r._zod.values))return new Set(i.def.options.flatMap(r=>Array.from(r._zod.values)))}),nt(n,"pattern",i=>{if(i.def.options.every(r=>r._zod.pattern)){const r=i.def.options.map(s=>s._zod.pattern);return new RegExp(`^(${r.map(s=>Wa(s.source)).join("|")})$`)}});const t=e.options.length===1?e.options[0]._zod.run:null;n._zod.parse=(i,r)=>{if(t)return t(i,r);let s=!1;const o=[];for(const a of e.options){const c=a._zod.run({value:i.value,issues:[]},r);if(c instanceof Promise)o.push(c),s=!0;else{if(c.issues.length===0)return c;o.push(c)}}return s?Promise.all(o).then(a=>Uc(a,i,n,r)):Uc(o,i,n,r)}}),Op=J("$ZodIntersection",(n,e)=>{At.init(n,e),n._zod.parse=(t,i)=>{const r=t.value,s=e.left._zod.run({value:r,issues:[]},i),o=e.right._zod.run({value:r,issues:[]},i);return s instanceof Promise||o instanceof Promise?Promise.all([s,o]).then(([c,l])=>Lc(t,c,l)):Lc(t,s,o)}});function jo(n,e){if(n===e)return{valid:!0,data:n};if(n instanceof Date&&e instanceof Date&&+n==+e)return{valid:!0,data:n};if(Cr(n)&&Cr(e)){const t=Object.keys(e),i=Object.keys(n).filter(s=>t.indexOf(s)!==-1),r={...n,...e};Object.prototype.hasOwnProperty.call(r,"__proto__")&&delete r.__proto__;for(const s of i){if(s==="__proto__")continue;const o=jo(n[s],e[s]);if(!o.valid)return{valid:!1,mergeErrorPath:[s,...o.mergeErrorPath]};r[s]=o.data}return{valid:!0,data:r}}if(Array.isArray(n)&&Array.isArray(e)){if(n.length!==e.length)return{valid:!1,mergeErrorPath:[]};const t=[];for(let i=0;i<n.length;i++){const r=n[i],s=e[i],o=jo(r,s);if(!o.valid)return{valid:!1,mergeErrorPath:[i,...o.mergeErrorPath]};t.push(o.data)}return{valid:!0,data:t}}return{valid:!1,mergeErrorPath:[]}}function Lc(n,e,t){const i=new Map;let r;const s=new Map,o=(l,u)=>{let h;if(l.code==="unrecognized_keys"&&!l.path?.length)r??(r=l),h=l.keys;else if(l.code==="invalid_key"&&l.origin==="record"&&l.path?.length===1){const f=String(l.path[0]);s.has(f)||s.set(f,l),h=[f]}else return!1;for(const f of h)i.has(f)||i.set(f,{}),i.get(f)[u]=!0;return!0};for(const l of e.issues)o(l,"l")||n.issues.push(l);for(const l of t.issues)o(l,"r")||n.issues.push(l);const a=[...i].filter(([,l])=>l.l&&l.r).map(([l])=>l);if(a.length){const l=r?a.filter(u=>r.keys.includes(u)):[];l.length&&n.issues.push({...r,keys:l});for(const u of a)!l.includes(u)&&s.has(u)&&n.issues.push(s.get(u))}const c=jo(e.value,t.value);if(!c.valid){if(Nn(n))return n;throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(c.mergeErrorPath)}`)}return n.value=c.data,n}const Bp=J("$ZodEnum",(n,e)=>{At.init(n,e);const t=Xo(e.entries),i=new Set(t);n._zod.values=i,nt(n,"pattern",r=>{const s=Xo(r.def.entries).filter(o=>Ef.has(typeof o));return new RegExp(s.length?`^(${s.map(o=>zs(o.toString())).join("|")})$`:"^[^\\s\\S]$")}),n._zod.parse=(r,s)=>{const o=r.value;return i.has(o)||r.issues.push({code:"invalid_value",values:t,input:o,inst:n}),r}}),zp=J("$ZodTransform",(n,e)=>{At.init(n,e),n._zod.optin="optional",Sn.memoizer?.guard(n),n._zod.parse=(t,i)=>{if(i.direction==="backward")throw new ku(n.constructor.name);const r=e.transform(t.value,t);if(i.async)return(r instanceof Promise?r:Promise.resolve(r)).then(o=>(t.value=o,t));if(r instanceof Promise)throw new vi;return t.value=r,t}});function Nc(n,e){return n.value=e.issues.length?void 0:e.value,n}const Qu=J("$ZodOptional",(n,e)=>{At.init(n,e),nt(n,"optin",t=>t.def.innerType._zod.optin==="defaulted"?"defaulted":"optional"),n._zod.optout="optional",nt(n,"values",t=>{const i=t.def.innerType._zod.values;return i?new Set([...i,void 0]):void 0}),nt(n,"pattern",t=>{const i=t.def.innerType._zod.pattern;return i?new RegExp(`^(${Wa(i.source)})?$`):void 0}),n._zod.parse=(t,i)=>{if(t.value===void 0){if(e.innerType._zod.optin!=="defaulted")return t;const r=e.innerType._zod.run({value:t.value,issues:[]},i);return r instanceof Promise?r.then(s=>Nc(t,s)):Nc(t,r)}return e.innerType._zod.run(t,i)}}),Vp=J("$ZodExactOptional",(n,e)=>{Qu.init(n,e),nt(n,"values",t=>t.def.innerType._zod.values),nt(n,"pattern",t=>t.def.innerType._zod.pattern),n._zod.parse=(t,i)=>e.innerType._zod.run(t,i)}),Gp=J("$ZodNullable",(n,e)=>{At.init(n,e),nt(n,"optin",t=>t.def.innerType._zod.optin),nt(n,"optout",t=>t.def.innerType._zod.optout),nt(n,"pattern",t=>{const i=t.def.innerType._zod.pattern;return i?new RegExp(`^(${Wa(i.source)}|null)$`):void 0}),nt(n,"values",t=>t.def.innerType._zod.values?new Set([...t.def.innerType._zod.values,null]):void 0),n._zod.parse=(t,i)=>t.value===null?t:e.innerType._zod.run(t,i)}),Hp=J("$ZodDefault",(n,e)=>{At.init(n,e),n._zod.optin="defaulted",nt(n,"values",t=>t.def.innerType._zod.values),n._zod.parse=(t,i)=>{if(i.direction==="backward")return e.innerType._zod.run(t,i);if(t.value===void 0)return t.value=e.defaultValue,t;const r=e.innerType._zod.run(t,i);return r instanceof Promise?r.then(s=>kc(s,e)):kc(r,e)}});function kc(n,e){return n.value===void 0&&(n.value=e.defaultValue),n}const Wp=J("$ZodPrefault",(n,e)=>{At.init(n,e),n._zod.optin="defaulted",nt(n,"values",t=>t.def.innerType._zod.values),n._zod.parse=(t,i)=>(i.direction==="backward"||t.value===void 0&&(t.value=e.defaultValue),e.innerType._zod.run(t,i))}),Xp=J("$ZodNonOptional",(n,e)=>{At.init(n,e),nt(n,"values",t=>{const i=t.def.innerType._zod.values;return i?new Set([...i].filter(r=>r!==void 0)):void 0}),n._zod.parse=(t,i)=>{const r=e.innerType._zod.run(t,i);return r instanceof Promise?r.then(s=>Fc(s,n)):Fc(r,n)}});function Fc(n,e){return!n.issues.length&&n.value===void 0&&n.issues.push({code:"invalid_type",expected:"nonoptional",input:n.value,inst:e}),n}function Oc(n,e,t,i){return e.issues.length?(n.value=t.catchValue({...e,value:n.value,error:{issues:e.issues.map(r=>$i(r,i,ei()))},input:n.value}),n):(n.value=e.value,e.memo&&(n.memo=!0),n)}const Yp=J("$ZodCatch",(n,e)=>{At.init(n,e),nt(n,"optin",t=>t.def.innerType._zod.optin==="defaulted"?"defaulted":"optional"),nt(n,"optout",t=>t.def.innerType._zod.optout),nt(n,"values",t=>t.def.innerType._zod.values),n._zod.parse=(t,i)=>{if(i.direction==="backward")return e.innerType._zod.run(t,i);const r=e.innerType._zod.run({value:t.value,issues:[]},i);return r instanceof Promise?r.then(s=>Oc(t,s,e,i)):Oc(t,r,e,i)}}),Zp=J("$ZodPipe",(n,e)=>{At.init(n,e),nt(n,"values",t=>t.def.in._zod.values),nt(n,"optin",t=>t.def.in._zod.optin),nt(n,"optout",t=>t.def.out._zod.optout),nt(n,"propValues",t=>t.def.in._zod.propValues),n._zod.parse=(t,i)=>{if(i.direction==="backward"){const s=e.out._zod.run(t,i);return s instanceof Promise?s.then(o=>Hr(o,e.in,i)):Hr(s,e.in,i)}const r=e.in._zod.run(t,i);return r instanceof Promise?r.then(s=>Hr(s,e.out,i)):Hr(r,e.out,i)}});function Hr(n,e,t){return n.issues.some(i=>i.code!=="unrecognized_keys")?(n.aborted=!0,n):e._zod.run({value:n.value,issues:n.issues},t)}const jp=J("$ZodReadonly",(n,e)=>{At.init(n,e),nt(n,"propValues",t=>t.def.innerType._zod.propValues),nt(n,"values",t=>t.def.innerType._zod.values),nt(n,"optin",t=>t.def.innerType?._zod?.optin),nt(n,"optout",t=>t.def.innerType?._zod?.optout),n._zod.parse=(t,i)=>{if(i.direction==="backward")return e.innerType._zod.run(t,i);const r=e.innerType._zod.run(t,i);return r instanceof Promise?r.then(Bc):Bc(r)}});function Bc(n){return n.memo||(n.value=Object.freeze(n.value)),n}const Kp=J("$ZodCustom",(n,e)=>{Gt.init(n,e),At.init(n,e),n._zod.parse=(t,i)=>t,n._zod.check=t=>{const i=t.value,r=e.fn(i);if(r instanceof Promise)return r.then(s=>zc(s,t,i,n));zc(r,t,i,n)}});function zc(n,e,t,i){if(!n){const r={code:"custom",input:t,inst:i,path:[...i._zod.def.path??[]],continue:!i._zod.def.abort};i._zod.def.params&&(r.params=i._zod.def.params),e.issues.push(Pr(r))}}class qp extends Error{constructor(){super("Cannot parse a reference cycle that closes through a transform"),this.name="ZodCyclicError"}}const Ko="~memo",Vc=[];function Ju(n){return n!==null&&(typeof n=="object"||typeof n=="function")}function eo(n){return n.map(e=>e.path?{...e,path:e.path.slice()}:{...e})}const $u=new WeakMap,vr=0,As=1,yr=2;function Es(n,e,t){const i=$u.get(n);if(i!==void 0)return i?yr:vr;if(e.has(n))return yr;e.add(n);let r=vr;const s=u=>{if(r!==yr&&u?._zod){const h=Es(u,e);h>r&&(r=h)}},o=(u,h)=>{let f=vr;for(const d of Reflect.ownKeys(u)){const g=Object.getOwnPropertyDescriptor(u,d);if(h&&!g.enumerable)continue;const _=g.get?As:g.value?._zod?Es(g.value,e):vr;_>f&&(f=_)}return f},a=u=>{u>r&&(r=u)},c=n._zod.def;switch(c.type){case"object":{const u=bu(c);a(u?o(u,!0):As),s(c.catchall);break}case"properties":a(o(c.shape,!1));break;case"array":s(c.element);break;case"tuple":for(const u of c.items)s(u);s(c.rest);break;case"record":case"map":s(c.keyType),s(c.valueType);break;case"set":s(c.valueType);break;case"union":for(const u of c.options)s(u);break;case"intersection":s(c.left),s(c.right);break;case"optional":case"nullable":case"default":case"prefault":case"catch":case"readonly":case"nonoptional":case"promise":case"success":s(c.innerType);break;case"pipe":s(c.in),s(c.out);break;case"function":s(c.input),s(c.output);break;case"lazy":{const u=c._cachedInner??void 0;a(u?Es(u,e):As);break}case"template_literal":case"string":case"number":case"int":case"boolean":case"bigint":case"symbol":case"undefined":case"null":case"void":case"never":case"any":case"unknown":case"date":case"nan":case"enum":case"literal":case"file":case"transform":case"custom":break;default:for(const u in c){const h=Object.getOwnPropertyDescriptor(c,u);if(!h||h.get)continue;const f=h.value;if(!(!f||typeof f!="object")){if(f._zod)s(f);else if(Array.isArray(f))for(const d of f)s(d)}}}return e.delete(n),Qp(n,r)}function Qp(n,e){return e!==As&&$u.set(n,e===yr),e}function Jp(n,e){let t=n.buckets.get(e);return t||(t=new WeakMap,n.buckets.set(e,t)),t}let Wr;const Xr=[],$p={alloc(n,e,t){const i=Wr;if(!i)return t;Wr=void 0;const r={value:t,issues:null};return i.set(e.value,r),Xr.push(r),t},guard(n){var e;(e=n._zod).deferred??(e.deferred=[]),n._zod.deferred.push(()=>{const t=n._zod.parse,i=(r,s)=>{if(s.direction!=="backward"&&tm(s,r.value))throw new qp;return t(r,s)};n._zod.parse=i,n._zod.run===t&&(n._zod.run=i)})},attach(n){var e;let t,i=!1,r,s;(e=n._zod).deferred??(e.deferred=[]),n._zod.deferred.push(()=>{const o=n._zod.parse,a=(c,l)=>{if(t===void 0){const p=Es(n,new Set);if(p===vr)return n._zod.parse=o,n._zod.run===a&&(n._zod.run=o),o(c,l);p===yr||i?t=!0:i=!0}const u=c.value;if(!Ju(u))return o(c,l);let h=l[Ko];h||(h={buckets:new WeakMap,backEdges:void 0},l[Ko]=h);let f;r===l?f=s:(f=Jp(h,n),r=l,s=f);const d=f.get(u);if(d)return c.value=d.value,d.issues?d.issues.length&&c.issues.push(...eo(d.issues)):(c.memo=!0,h.backEdges??(h.backEdges=new WeakSet),h.backEdges.add(d.value)),c;Wr=f;const g=Xr.length,_=o(c,l);Wr=void 0;const m=Xr.length>g?Xr.pop():void 0;return _ instanceof Promise?_.then(p=>(m&&(m.issues=p.issues.length?eo(p.issues):Vc),p)):(m&&(m.issues=_.issues.length?eo(_.issues):Vc),_)};n._zod.parse=a,n._zod.run===o&&(n._zod.run=a)})}};function em(){return $p}function tm(n,e){const t=n[Ko]?.backEdges;return t!==void 0&&Ju(e)&&t.has(e)}const nm=()=>{const n={string:{unit:"characters",verb:"to have"},file:{unit:"bytes",verb:"to have"},array:{unit:"items",verb:"to have"},set:{unit:"items",verb:"to have"},map:{unit:"entries",verb:"to have"}};function e(s){return n[s]??null}const t={regex:"input",email:"email address",url:"URL",emoji:"emoji",uuid:"UUID",uuidv4:"UUIDv4",uuidv6:"UUIDv6",nanoid:"nanoid",guid:"GUID",cuid:"cuid",cuid2:"cuid2",ulid:"ULID",xid:"XID",ksuid:"KSUID",datetime:"ISO datetime",date:"ISO date",time:"ISO time",duration:"ISO duration",ipv4:"IPv4 address",ipv6:"IPv6 address",mac:"MAC address",cidrv4:"IPv4 range",cidrv6:"IPv6 range",base64:"base64-encoded string",base64url:"base64url-encoded string",json_string:"JSON string",e164:"E.164 number",credit_card:"credit card number",iban:"IBAN",jwt:"JWT",template_literal:"input"},i={nan:"NaN"};function r(s,o){return s==="number"&&typeof o=="number"&&!Number.isFinite(o)?String(o):i[s]??s}return s=>{switch(s.code){case"invalid_type":{const o=r(s.expected),a=If(s.input),c=r(a,s.input);return`Invalid input: expected ${o}, received ${c}`}case"invalid_value":return s.values.length===1?`Invalid input: expected ${Pu(s.values[0])}`:`Invalid option: expected one of ${Mc(s.values,"|")}`;case"too_big":{const o=s.exact?"exactly ":s.inclusive?"<=":"<",a=e(s.origin);return a?`Too big: expected ${s.origin??"value"} to have ${o}${s.maximum.toString()} ${a.unit??"elements"}`:`Too big: expected ${s.origin??"value"} to be ${o}${s.maximum.toString()}`}case"too_small":{const o=s.exact?"exactly ":s.inclusive?">=":">",a=e(s.origin);return a?`Too small: expected ${s.origin} to have ${o}${s.minimum.toString()} ${a.unit}`:`Too small: expected ${s.origin} to be ${o}${s.minimum.toString()}`}case"invalid_format":{const o=s;return o.format==="starts_with"?`Invalid string: must start with "${o.prefix}"`:o.format==="ends_with"?`Invalid string: must end with "${o.suffix}"`:o.format==="includes"?`Invalid string: must include "${o.includes}"`:o.format==="regex"?`Invalid string: must match pattern ${o.pattern}`:`Invalid ${t[o.format]??s.format}`}case"not_multiple_of":return`Invalid number: must be a multiple of ${s.divisor}`;case"unrecognized_keys":return`Unrecognized key${s.keys.length>1?"s":""}: ${Mc(s.keys,", ")}`;case"invalid_key":return`Invalid key in ${s.origin}`;case"invalid_union":return s.options&&Array.isArray(s.options)&&s.options.length>0?`Invalid discriminator value. Expected ${s.options.map(a=>`'${a}'`).join(" | ")}`:s.inclusive===!1?"Invalid input: more than one option matched":"Invalid input";case"invalid_element":return`Invalid value in ${s.origin}`;default:return"Invalid input"}}};function im(){return{localeError:nm()}}var Gc;class rm{constructor(){this._map=new WeakMap,this._idmap=new Map}add(e,...t){const i=t[0];return this._map.set(e,i),i&&typeof i=="object"&&"id"in i&&this._idmap.set(i.id,e),this}clear(){return this._map=new WeakMap,this._idmap=new Map,this}remove(e){const t=this._map.get(e);return t&&typeof t=="object"&&"id"in t&&this._idmap.delete(t.id),this._map.delete(e),this}get(e){const t=e._zod.parent;if(t){const i={...this.get(t)??{}};delete i.id;const r={...i,...this._map.get(e)};return Object.keys(r).length?r:void 0}return this._map.get(e)}has(e){return this._map.has(e)}}function sm(){return new rm}(Gc=globalThis).__zod_globalRegistry??(Gc.__zod_globalRegistry=sm());const xr=globalThis.__zod_globalRegistry;function om(n,e){return new n({type:"string",...Ue(e)})}function am(n,e){return new n({type:"string",format:"email",check:"string_format",abort:!1,...Ue(e)})}function cm(n,e){return new n({type:"string",format:"guid",check:"string_format",abort:!1,...Ue(e)})}function lm(n,e){return new n({type:"string",format:"uuid",check:"string_format",abort:!1,...Ue(e)})}function um(n,e){return new n({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v4",...Ue(e)})}function hm(n,e){return new n({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v6",...Ue(e)})}function fm(n,e){return new n({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v7",...Ue(e)})}function dm(n,e){return new n({type:"string",format:"url",check:"string_format",abort:!1,...Ue(e)})}function pm(n,e){return new n({type:"string",format:"emoji",check:"string_format",abort:!1,...Ue(e)})}function mm(n,e){return new n({type:"string",format:"nanoid",check:"string_format",abort:!1,...Ue(e)})}function gm(n,e){return new n({type:"string",format:"cuid",check:"string_format",abort:!1,...Ue(e)})}function _m(n,e){return new n({type:"string",format:"cuid2",check:"string_format",abort:!1,...Ue(e)})}function vm(n,e){return new n({type:"string",format:"ulid",check:"string_format",abort:!1,...Ue(e)})}function xm(n,e){return new n({type:"string",format:"xid",check:"string_format",abort:!1,...Ue(e)})}function Am(n,e){return new n({type:"string",format:"ksuid",check:"string_format",abort:!1,...Ue(e)})}function Em(n,e){return new n({type:"string",format:"ipv4",check:"string_format",abort:!1,...Ue(e)})}function Sm(n,e){return new n({type:"string",format:"ipv6",check:"string_format",abort:!1,...Ue(e)})}function ym(n,e){return new n({type:"string",format:"cidrv4",check:"string_format",abort:!1,...Ue(e)})}function Mm(n,e){return new n({type:"string",format:"cidrv6",check:"string_format",abort:!1,...Ue(e)})}function bm(n,e){return new n({type:"string",format:"base64",check:"string_format",abort:!1,...Ue(e)})}function wm(n,e){return new n({type:"string",format:"base64url",check:"string_format",abort:!1,...Ue(e)})}function Tm(n,e){return new n({type:"string",format:"e164",check:"string_format",abort:!1,...Ue(e)})}function Rm(n,e){return new n({type:"string",format:"jwt",check:"string_format",abort:!1,...Ue(e)})}function Cm(n,e){return new n({type:"string",format:"datetime",check:"string_format",offset:!1,local:!1,precision:null,...Ue(e)})}function Pm(n,e){return new n({type:"string",format:"date",check:"string_format",...Ue(e)})}function Dm(n,e){return new n({type:"string",format:"time",check:"string_format",precision:null,...Ue(e)})}function Im(n,e){return new n({type:"string",format:"duration",check:"string_format",...Ue(e)})}function Um(n,e){return new n({type:"number",checks:[],...Ue(e)})}function Lm(n,e){return new n({type:"number",check:"number_format",abort:!1,format:"safeint",...Ue(e)})}function Nm(n,e){return new n({type:"boolean",...Ue(e)})}function km(n){return new n({type:"unknown"})}function Fm(n,e){return new n({type:"never",...Ue(e)})}function Hc(n,e){return new Bu({check:"less_than",...Ue(e),value:n,inclusive:!1})}function to(n,e){return new Bu({check:"less_than",...Ue(e),value:n,inclusive:!0})}function Wc(n,e){return new zu({check:"greater_than",...Ue(e),value:n,inclusive:!1})}function no(n,e){return new zu({check:"greater_than",...Ue(e),value:n,inclusive:!0})}function Xc(n,e){return new kd({check:"multiple_of",...Ue(e),value:n})}function eh(n,e){return new Od({check:"max_length",...Ue(e),maximum:n})}function Ds(n,e){return new Bd({check:"min_length",...Ue(e),minimum:n})}function th(n,e){return new zd({check:"length_equals",...Ue(e),length:n})}function Om(n,e){return new Vd({check:"string_format",format:"regex",...Ue(e),pattern:n})}function Bm(n){return new Gd({check:"string_format",format:"lowercase",...Ue(n)})}function zm(n){return new Hd({check:"string_format",format:"uppercase",...Ue(n)})}function Vm(n,e){return new Wd({check:"string_format",format:"includes",...Ue(e),includes:n})}function Gm(n,e){return new Xd({check:"string_format",format:"starts_with",...Ue(e),prefix:n})}function Hm(n,e){return new Yd({check:"string_format",format:"ends_with",...Ue(e),suffix:n})}function er(n){return new Zd({check:"overwrite",tx:n})}function Wm(n){return er(e=>e.normalize(n))}function Xm(){return er(n=>n.trim())}function Ym(){return er(n=>n.toLowerCase())}function Zm(){return er(n=>n.toUpperCase())}function jm(){return er(n=>xf(n))}function Km(n,e,t){return new n({type:"array",element:e,...Ue(t)})}function qm(n,e,t){return new n({type:"custom",check:"custom",fn:e,...Ue(t)})}function Qm(n,e){const t=Jm(i=>(i.addIssue=r=>{if(typeof r=="string")i.issues.push(Pr(r,i.value,t._zod.def));else{const s=r;s.fatal&&(s.continue=!1),s.code??(s.code="custom"),"input"in s||(s.input=i.value),s.inst??(s.inst=t),s.continue??(s.continue=!t._zod.def.abort),i.issues.push(Pr(s))}},n(i.value,i)),e);return t}function Jm(n,e){const t=new Gt({check:"custom",...Ue(e)});return t._zod.check=n,t}function Mr(n,...e){for(const t of e)for(const i of Reflect.ownKeys(t))Object.prototype.propertyIsEnumerable.call(t,i)&&Si(n,i,t[i]);return n}function nh(n){let e=n?.target??"draft-2020-12";return e==="draft-4"&&(e="draft-04"),e==="draft-7"&&(e="draft-07"),{processors:n.processors??{},metadataRegistry:n?.metadata??xr,target:e,unrepresentable:n?.unrepresentable??"throw",override:n?.override??(()=>{}),io:n?.io??"output",counter:0,seen:new Map,sharedDefsExtractedFor:void 0,sharedEmitDoneFor:void 0,cycles:n?.cycles??"ref",reused:n?.reused??"inline",intersections:[],deferred:[],external:n?.external??void 0}}function tr(n,e,t,i,r){const s=typeof e.unrepresentable=="function"?e.unrepresentable({zodSchema:n,path:i.path,message:r}):e.unrepresentable;if(s==="any")return!1;if(s===void 0||s==="throw")throw new Error(r);return Object.assign(t,s),!0}function Tt(n,e,t={path:[],schemaPath:[]}){var i;const r=n._zod.def,s=e.seen.get(n);if(s)return s.count++,t.schemaPath.includes(n)&&(s.cycle=t.path),s.schema;const o={schema:{},count:1,cycle:void 0,path:t.path};e.seen.set(n,o),e.sharedDefsExtractedFor=void 0,e.sharedEmitDoneFor=void 0;const a=n._zod.toJSONSchema?.();if(a)o.schema=a;else{const u={...t,schemaPath:[...t.schemaPath,n],path:t.path};if(n._zod.processJSONSchema)n._zod.processJSONSchema(e,o.schema,u);else{const f=o.schema,d=e.processors[r.type];if(!d)throw new Error(`[toJSONSchema]: Non-representable type encountered: ${r.type}`);d(n,e,f,u)}const h=n._zod.parent;h&&(o.ref||(o.ref=h),Tt(h,e,u),e.seen.get(h).isParent=!0)}const c=e.metadataRegistry.get(n);return c&&Mr(o.schema,c),e.io==="input"&&Dt(n)&&(delete o.schema.examples,delete o.schema.default),e.io==="input"&&"_prefault"in o.schema&&((i=o.schema).default??(i.default=o.schema._prefault)),delete o.schema._prefault,e.seen.get(n).schema}function Yc(n){return n.replace(/~/g,"~0").replace(/\//g,"~1")}function ih(n,e){const t=n.seen.get(e);if(!t)throw new Error("Unprocessed schema. This is a bug in Zod.");if(n.external&&n.sharedDefsExtractedFor===n.external)return;const i=new Map;for(const o of n.seen.entries()){const a=n.metadataRegistry.get(o[0])?.id;if(a){const c=i.get(a);if(c&&c!==o[0])throw new Error(`Duplicate schema id "${a}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);i.set(a,o[0])}}const r=o=>{const a=n.target==="draft-2020-12"?"$defs":"definitions";if(n.external){const h=n.external.registry.get(o[0])?.id,f=n.external.uri??(g=>g);if(h)return{ref:f(h)};const d=o[1].defId??o[1].schema.id??`schema${n.counter++}`;return o[1].defId=d,{defId:d,ref:`${f("__shared")}#/${a}/${Yc(d)}`}}const c="#",l=`${c}/${a}/`;if(o[1]===t&&!o[1].schema.id)return{ref:c};const u=o[1].schema.id??`__schema${n.counter++}`;return{defId:u,ref:l+Yc(u)}},s=o=>{if(o[1].schema.$ref)return;const a=o[1],{ref:c,defId:l}=r(o);a.def={...a.schema},l&&(a.defId=l);const u=a.schema;for(const h in u)delete u[h];u.$ref=c};if(n.cycles==="throw")for(const o of n.seen.entries()){const a=o[1];if(a.cycle)throw new Error(`Cycle detected: #/${a.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`)}for(const o of n.seen.entries()){const a=o[1];if(e===o[0]){s(o);continue}if(n.external){const l=n.external.registry.get(o[0])?.id;if(e!==o[0]&&l){s(o);continue}}if(n.metadataRegistry.get(o[0])?.id){s(o);continue}if(a.cycle){s(o);continue}a.count>1&&n.reused==="ref"&&s(o)}n.external&&(n.sharedDefsExtractedFor=n.external)}function rh(n){const e=n.anyOf;if(!Array.isArray(e)||e.length===0||n.type!==void 0)return;const t=[];for(const i of e){if(!i||typeof i!="object")return;rh(i);const r=Object.keys(i);if(r.length!==1||r[0]!=="type")return;const s=i.type;for(const o of Array.isArray(s)?s:[s]){if(typeof o!="string")return;t.includes(o)||t.push(o)}}delete n.anyOf,n.type=t.length===1?t[0]:t}const sh=new Set(["type","properties","required","additionalProperties"]),Zc=["oneOf","anyOf"];function jc(n){const e=n.additionalProperties;return e===void 0||e===!1||typeof e!="object"||e===null?null:Object.keys(e).length?e:null}function qo(n){const e=[];for(const s of n){if(typeof s!="object"||s.type!=="object")return null;for(const o in s)if(!sh.has(o))return null;e.push(s)}const t={},i=new Set;for(const s of e){for(const o in s.properties){if(Object.prototype.hasOwnProperty.call(t,o))continue;const a=[];for(const l of e){const u=l.properties?.[o]??jc(l);u!=null&&(a.some(h=>JSON.stringify(h)===JSON.stringify(u))||a.push(u))}const c=a.length===1?a[0]:qo(a)??{allOf:a};Si(t,o,c)}for(const o of s.required??[])i.add(o)}const r={type:"object",properties:t};if(i.size&&(r.required=[...i]),e.every(s=>s.additionalProperties===!1))r.additionalProperties=!1;else{const s=[];for(const o of e){const a=jc(o);a&&!s.some(c=>JSON.stringify(c)===JSON.stringify(a))&&s.push(a)}s.length===1?r.additionalProperties=s[0]:s.length>1&&(r.additionalProperties={allOf:s})}return r}function $m(n){const e=n.allOf;if(!Array.isArray(e)||e.length<2)return;for(const r of sh)if(r in n)return;const t=e.filter(r=>Zc.some(s=>Array.isArray(r[s])));let i=null;if(!t.length)i=qo(e);else{const r=t[0],s=Zc.find(c=>Array.isArray(r[c]));if(Object.keys(r).length!==1)return;const o=e.filter(c=>c!==r),a=r[s].map(c=>qo([...o,c]));if(a.some(c=>!c))return;i={[s]:a}}i&&(delete n.allOf,Mr(n,i))}function oh(n,e){const t=n.seen.get(e);if(!t)throw new Error("Unprocessed schema. This is a bug in Zod.");const i=a=>{const c=n.seen.get(a);if(c.ref===null)return;const l=c.def??c.schema,u={...l},h=c.ref;if(c.ref=null,h){i(h);const d=n.seen.get(h),g=d.schema;if(g.$ref&&(n.target==="draft-07"||n.target==="draft-04"||n.target==="openapi-3.0")?(l.allOf=l.allOf??[],l.allOf.push(g)):Mr(l,g),Mr(l,u),a._zod.parent===h)for(const m in l)m==="$ref"||m==="allOf"||m in u||delete l[m];if(g.$ref&&d.def)for(const m in l)m==="$ref"||m==="allOf"||m in d.def&&JSON.stringify(l[m])===JSON.stringify(d.def[m])&&delete l[m]}const f=a._zod.parent;if(f&&f!==h){i(f);const d=n.seen.get(f);if(d?.schema.$ref&&(l.$ref=d.schema.$ref,d.def))for(const g in l)g==="$ref"||g==="allOf"||g in d.def&&JSON.stringify(l[g])===JSON.stringify(d.def[g])&&delete l[g]}n.override({zodSchema:a,jsonSchema:l,path:c.path??[]})};if(!n.external||n.sharedEmitDoneFor!==n.external){for(const a of[...n.seen.entries()].reverse())i(a[0]);if(n.target!=="openapi-3.0")for(const a of n.seen.entries())rh(a[1].def??a[1].schema);for(const a of n.deferred)a();if(n.intersections.length){const a=new Map;for(const c of n.seen.values())for(const l of[c.schema,c.def]){const u=l?.allOf;if(!Array.isArray(u))continue;const h=a.get(u);h?h.push(l):a.set(u,[l])}for(const c of n.intersections)for(const l of a.get(c)??[])$m(l)}}const r={};if(n.target==="draft-2020-12"?r.$schema="https://json-schema.org/draft/2020-12/schema":n.target==="draft-07"?r.$schema="http://json-schema.org/draft-07/schema#":n.target==="draft-04"?r.$schema="http://json-schema.org/draft-04/schema#":n.target,n.external?.uri){const a=n.external.registry.get(e)?.id;if(!a)throw new Error("Schema is missing an `id` property");r.$id=n.external.uri(a)}Mr(r,t.defId?t.schema:t.def??t.schema);const s=n.metadataRegistry.get(e)?.id;s!==void 0&&r.id===s&&delete r.id;const o=n.external?.defs??{};if(!n.external||n.sharedEmitDoneFor!==n.external)for(const a of n.seen.entries()){const c=a[1];c.def&&c.defId&&(c.def.id===c.defId&&delete c.def.id,Si(o,c.defId,c.def))}n.external&&(n.sharedEmitDoneFor=n.external),n.external||Object.keys(o).length>0&&(n.target==="draft-2020-12"?r.$defs=o:r.definitions=o);try{const a=JSON.parse(JSON.stringify(r));return Object.defineProperty(a,"~standard",{value:{...e["~standard"],jsonSchema:{input:Is(e,"input",n.processors),output:Is(e,"output",n.processors)}},enumerable:!1,writable:!1}),a}catch{throw new Error("Error converting schema to JSON.")}}function Dt(n,e){const t=e??{seen:new Set};if(t.seen.has(n))return!1;t.seen.add(n);const i=n._zod.def;if(i.type==="transform")return!0;if(i.type==="array")return Dt(i.element,t);if(i.type==="set")return Dt(i.valueType,t);if(i.type==="lazy")return Dt(i.getter(),t);if(i.type==="promise"||i.type==="optional"||i.type==="nonoptional"||i.type==="nullable"||i.type==="readonly"||i.type==="default"||i.type==="prefault"||i.type==="catch")return Dt(i.innerType,t);if(i.type==="intersection")return Dt(i.left,t)||Dt(i.right,t);if(i.type==="record"||i.type==="map")return Dt(i.keyType,t)||Dt(i.valueType,t);if(i.type==="pipe")return n._zod.traits.has("$ZodCodec")?!0:Dt(i.in,t)||Dt(i.out,t);if(i.type==="object"){for(const r in i.shape)if(Dt(i.shape[r],t))return!0;return!1}if(i.type==="union"){for(const r of i.options)if(Dt(r,t))return!0;return!1}if(i.type==="tuple"){for(const r of i.items)if(Dt(r,t))return!0;return!!(i.rest&&Dt(i.rest,t))}return!1}const eg=(n,e={})=>t=>{const i=nh({...t,processors:e});return Tt(n,i),ih(i,n),oh(i,n)},Is=(n,e,t={})=>i=>{const{libraryOptions:r,target:s}=i??{},o=nh({...r??{},target:s,io:e,processors:t});return Tt(n,o),ih(o,n),oh(o,n)},Yi=(n,e,t)=>{(n[e]===void 0||t>n[e])&&(n[e]=t)},Zi=(n,e,t)=>{(n[e]===void 0||t<n[e])&&(n[e]=t)},Kc=(n,e)=>{Yi(n,"minimum",e),Zi(n,"maximum",e)},ah=(n,e)=>{n.multipleOf??(n.multipleOf=[]),n.multipleOf.includes(e)||n.multipleOf.push(e)},ch=(n,e)=>{n.patterns??(n.patterns=new Set),n.patterns.add(e)},lh=(n,e)=>{n.mime=n.mime?n.mime.filter(t=>e.includes(t)):[...e]},uh=(n,e)=>{n.format=e,e.includes("int")&&(n.isInt=!0)},qc=(n,e)=>Yi(n,"minimum",e.minimum),Qc=(n,e)=>Zi(n,"maximum",e.maximum),Jc=n=>(e,t)=>{uh(e,t.format);const[i,r]=n[t.format];Yi(e,"minimum",i),Zi(e,"maximum",r)},tg={greater_than:(n,e)=>Yi(n,e.inclusive?"minimum":"exclusiveMinimum",e.value),less_than:(n,e)=>Zi(n,e.inclusive?"maximum":"exclusiveMaximum",e.value),multiple_of:(n,e)=>ah(n,e.value),number_format:Jc(Du),bigint_format:Jc(yf),min_length:qc,max_length:Qc,length_equals:(n,e)=>Kc(n,e.length),min_size:qc,max_size:Qc,size_equals:(n,e)=>Kc(n,e.size),string_format:(n,e)=>{uh(n,e.format),e.pattern&&ch(n,e.pattern),(e.format==="base64"||e.format==="base64url")&&(n.contentEncoding=e.format),(e.local||e.precision===-1)&&(n.laxFormat=!0)},mime_type:(n,e)=>lh(n,e.mime)};function vn(n){const e={},t=n._zod.def,i=n._zod.traits.has("$ZodCheck")?[n,...t.checks??[]]:t.checks??[];for(const s of i)tg[s._zod.def.check]?.(e,s._zod.def);const r=n._zod.bag;r.minimum!==void 0&&Yi(e,"minimum",r.minimum),r.exclusiveMinimum!==void 0&&Yi(e,"exclusiveMinimum",r.exclusiveMinimum),r.maximum!==void 0&&Zi(e,"maximum",r.maximum),r.exclusiveMaximum!==void 0&&Zi(e,"exclusiveMaximum",r.exclusiveMaximum),r.multipleOf!==void 0&&ah(e,r.multipleOf),r.format!==void 0&&(e.format??(e.format=r.format),r.format.includes("int")&&(e.isInt=!0)),r.mime&&lh(e,r.mime);for(const s of r.patterns??[])ch(e,s);return e}const ng={guid:"uuid",url:"uri",datetime:"date-time",json_string:"json-string",regex:""},ig=new Map([[Zu,yd],[$a,Md]]),rg=n=>ig.get(n)??n,sg=(n,e,t,i)=>{const r=t;r.type="string";const{minimum:s,maximum:o,format:a,patterns:c,contentEncoding:l,laxFormat:u}=vn(n);if(typeof s=="number"&&(r.minLength=s),typeof o=="number"&&(r.maxLength=o),a&&(r.format=ng[a]??a,r.format===""&&delete r.format,(a==="time"||u)&&delete r.format),l&&(r.contentEncoding=l),c&&c.size>0){const h=[...c].map(rg);h.length===1?r.pattern=h[0].source:h.length>1&&(r.allOf=[...h.map(f=>({...e.target==="draft-07"||e.target==="draft-04"||e.target==="openapi-3.0"?{type:"string"}:{},pattern:f.source}))])}},og=(n,e,t,i)=>{const r=t,{minimum:s,maximum:o,multipleOf:a,exclusiveMaximum:c,exclusiveMinimum:l,isInt:u}=vn(n);r.type=u?"integer":"number";const h=typeof l=="number"&&l>=(s??Number.NEGATIVE_INFINITY),f=typeof c=="number"&&c<=(o??Number.POSITIVE_INFINITY),d=e.target==="draft-04"||e.target==="openapi-3.0";if(h?d?(r.minimum=l,r.exclusiveMinimum=!0):r.exclusiveMinimum=l:typeof s=="number"&&(r.minimum=s),f?d?(r.maximum=c,r.exclusiveMaximum=!0):r.exclusiveMaximum=c:typeof o=="number"&&(r.maximum=o),a){const g=new Set;for(const p of a)Number.isFinite(p)&&p!==0?g.add(Math.abs(p)):tr(n,e,r,i,`A multipleOf divisor of ${p} cannot be represented in JSON Schema`);const[_,...m]=g;_!==void 0&&(r.multipleOf=_),m.length&&(r.allOf=[...r.allOf??[],...m.map(p=>({multipleOf:p}))])}},ag=(n,e,t,i)=>{t.type="boolean"},cg=(n,e,t,i)=>{t.not={}},lg=(n,e,t,i)=>{},ug=(n,e,t,i)=>{const r=n._zod.def,s=Xo(r.entries);if(s.length===0){t.not={};return}s.every(o=>typeof o=="number")&&(t.type="number"),s.every(o=>typeof o=="string")&&(t.type="string"),t.enum=s},hg=(n,e,t,i)=>{tr(n,e,t,i,"Custom types cannot be represented in JSON Schema")},fg=(n,e,t,i)=>{tr(n,e,t,i,"Transforms cannot be represented in JSON Schema")},dg=(n,e,t,i)=>{const r=t,s=n._zod.def,{minimum:o,maximum:a}=vn(n);typeof o=="number"&&(r.minItems=o),typeof a=="number"&&(r.maxItems=a),r.type="array",r.items=Tt(s.element,e,{...i,path:[...i.path,"items"]})};function Qo(n){const e=n._zod.def;return e.type==="pipe"&&e.in._zod.traits.has("$ZodTransform")?Qo(e.out):e.type==="catch"?Qo(e.innerType):n._zod.optin}const pg=(n,e,t,i)=>{const r=t,s=n._zod.def,o=s.shape;if(Object.getOwnPropertySymbols(o).length&&tr(n,e,r,i,"Symbol keys cannot be represented in JSON Schema"))return;r.type="object",r.properties={};for(const u in o)Si(r.properties,u,Tt(o[u],e,{...i,path:[...i.path,"properties",u]}));const c=new Set(Object.keys(o)),l=new Set([...c].filter(u=>{const h=s.shape[u];return e.io==="input"?Qo(h)===void 0:h._zod.optout===void 0}));l.size>0&&(r.required=Array.from(l)),s.catchall?._zod.def.type==="never"?r.additionalProperties=!1:s.catchall?s.catchall&&(r.additionalProperties=Tt(s.catchall,e,{...i,path:[...i.path,"additionalProperties"]})):e.io==="output"&&(r.additionalProperties=!1)},mg=(n,e,t,i)=>{const r=n._zod.def,s=r.inclusive===!1,o=r.options.map((a,c)=>Tt(a,e,{...i,path:[...i.path,s?"oneOf":"anyOf",c]}));s?t.oneOf=o:t.anyOf=o},gg=(n,e,t,i)=>{const r=n._zod.def,s=Tt(r.left,e,{...i,path:[...i.path,"allOf",0]}),o=Tt(r.right,e,{...i,path:[...i.path,"allOf",1]}),a=l=>"allOf"in l&&Object.keys(l).length===1,c=[...a(s)?s.allOf:[s],...a(o)?o.allOf:[o]];t.allOf=c,e.intersections.push(c)},_g=(n,e,t,i)=>{const r=n._zod.def,s=Tt(r.innerType,e,i),o=e.seen.get(n);e.target==="openapi-3.0"?(o.ref=r.innerType,t.nullable=!0):t.anyOf=[s,{type:"null"}]},vg=(n,e,t,i)=>{const r=n._zod.def;Tt(r.innerType,e,i);const s=e.seen.get(n);s.ref=r.innerType},ec=Symbol();function hh(n,e,t,i,r){let s=!1;const o=JSON.stringify(n,(a,c)=>typeof c!="bigint"?c:(s=!0,null));return s?(tr(e,t,i,r,"BigInt defaults cannot be represented in JSON Schema"),ec):JSON.parse(o)}const xg=(n,e,t,i)=>{const r=n._zod.def;Tt(r.innerType,e,i);const s=e.seen.get(n);s.ref=r.innerType;const o=hh(r.defaultValue,n,e,t,i);o!==ec&&(t.default=o)},Ag=(n,e,t,i)=>{const r=n._zod.def;Tt(r.innerType,e,i);const s=e.seen.get(n);if(s.ref=r.innerType,e.io!=="input")return;const o=hh(r.defaultValue,n,e,t,i);o!==ec&&(t._prefault=o)},Eg=(n,e,t,i)=>{const r=n._zod.def;Tt(r.innerType,e,i);const s=e.seen.get(n);s.ref=r.innerType;let o;try{o=r.catchValue(void 0)}catch{tr(n,e,t,i,"Dynamic catch values are not supported in JSON Schema");return}t.default=o},Sg=(n,e,t,i)=>{const r=n._zod.def,s=r.in._zod.traits.has("$ZodTransform"),o=e.io==="input"?s?r.out:r.in:r.out;Tt(o,e,i);const a=e.seen.get(n);a.ref=o},yg=(n,e,t,i)=>{const r=n._zod.def;Tt(r.innerType,e,i);const s=e.seen.get(n);s.ref=r.innerType,t.readOnly=!0},fh=(n,e,t,i)=>{const r=n._zod.def;Tt(r.innerType,e,i);const s=e.seen.get(n);s.ref=r.innerType},$c=new WeakSet([Object.prototype,Error.prototype]);function Yr(n,e,t){Object.defineProperty(n,e,{configurable:!0,enumerable:!1,get(){const i=t(this);return Object.defineProperty(this,e,{value:i,configurable:!0,writable:!0}),i},set(i){Object.defineProperty(this,e,{value:i,configurable:!0,writable:!0})}})}const Mg=(n,e)=>{Wf.init(n,e),n.name="ZodError";const t=Object.getPrototypeOf(n);$c.has(t)||($c.add(t),Yr(t,"format",i=>r=>Zf(i,r)),Yr(t,"flatten",i=>r=>Yf(i,r)),Yr(t,"addIssue",i=>r=>{i.issues.push(r),i.message=JSON.stringify(i.issues,Yo,2)}),Yr(t,"addIssues",i=>r=>{i.issues.push(...r),i.message=JSON.stringify(i.issues,Yo,2)}),Object.defineProperty(t,"isEmpty",{configurable:!0,enumerable:!1,get(){return this.issues.length===0}}))},on=J("ZodError",Mg,void 0,{Parent:Error}),bg=Za(on),wg=ja(on),Tg=Ka(on),Rg=qa(on),Cg=$f(on),Pg=ed(on),Dg=td(on),Ig=nd(on),Ug=id(on),Lg=rd(on),Ng=sd(on),kg=od(on);function Fg(){Sn.localeError||ei(im())}function tc(){Sn.memoizer||ei({memoizer:em()})}const Et=J("ZodType",(n,e)=>(Fg(),At.init(n,e),n.def=e,n.type=e.type,n),{check(...n){const e=this.def;return this.clone(qt(e,{checks:[...e.checks??[],...n.map(t=>typeof t=="function"?{_zod:{check:t,def:{check:"custom"},onattach:[]}}:t)]}),{parent:!0})},with(...n){return this.check(...n)},clone(n,e){return $n(this,n,e)},brand(){return this},register(n,e){return n.add(this,e),this},refine(n,e){return this.check(U_(n,e))},superRefine(n,e){return this.check(L_(n,e))},overwrite(n){return this.check(er(n))},optional(){return nl(this)},exactOptional(){return A_(this)},nullable(){return il(this)},nullish(){return nl(il(this))},nonoptional(n){return w_(this,n)},array(){return nc(this)},or(n){return m_([this,n])},and(n){return __(this,n)},transform(n){return rl(this,x_(n))},default(n){return y_(this,n)},prefault(n){return b_(this,n)},catch(n){return R_(this,n)},pipe(n){return rl(this,n)},readonly(){return D_(this)},describe(n){const e=this.clone();return xr.add(e,{description:n}),e},meta(...n){if(n.length===0)return xr.get(this);const e=this.clone();return xr.add(e,n[0]),e},isOptional(){return this.safeParse(void 0).success},isNullable(){return this.safeParse(null).success},apply(n,...e){return e.length===0?n(this):n(this,...e)},get"~standard"(){return Lu(this,"~standard",{...Gu(this),jsonSchema:{input:Is(this,"input"),output:Is(this,"output")}})},set"~standard"(n){Jn(this,"~standard",n)},parse:function n(e,t){return bg(this,e,t,{callee:n})},parseAsync:async function n(e,t){return await wg(this,e,t,{callee:n})},safeParse(n,e){return Tg(this,n,e)},async safeParseAsync(n,e){return Rg(this,n,e)},get spa(){return this?.safeParseAsync},set spa(n){Jn(this,"spa",n)},validate(n,e){return qf(this,n,e)},validateAsync(n,e){return Jf(this,n,e)},encode:function n(e,t){return Cg(this,e,t,{callee:n})},decode:function n(e,t){return Pg(this,e,t,{callee:n})},encodeAsync:async function n(e,t){return await Dg(this,e,t,{callee:n})},decodeAsync:async function n(e,t){return await Ig(this,e,t,{callee:n})},safeEncode(n,e){return Ug(this,n,e)},safeDecode(n,e){return Lg(this,n,e)},async safeEncodeAsync(n,e){return Ng(this,n,e)},async safeDecodeAsync(n,e){return kg(this,n,e)},toJSONSchema(n){return eg(this,{})(n)},get description(){return xr.get(this)?.description},get _def(){return this._zod.def}}),dh=J("_ZodString",(n,e)=>{Ja.init(n,e),Et.init(n,e),n._zod.processJSONSchema=(t,i,r)=>sg(n,t,i)},Nu({format:n=>vn(n).format??null,minLength:n=>vn(n).minimum??null,maxLength:n=>vn(n).maximum??null},{regex(...n){return this.check(Om(...n))},includes(...n){return this.check(Vm(...n))},startsWith(...n){return this.check(Gm(...n))},endsWith(...n){return this.check(Hm(...n))},min(...n){return this.check(Ds(...n))},max(...n){return this.check(eh(...n))},length(...n){return this.check(th(...n))},nonempty(...n){return this.check(Ds(1,...n))},lowercase(n){return this.check(Bm(n))},uppercase(n){return this.check(zm(n))},trim(){return this.check(Xm())},normalize(...n){return this.check(Wm(...n))},toLowerCase(){return this.check(Ym())},toUpperCase(){return this.check(Zm())},slugify(){return this.check(jm())}})),Og=J("ZodString",(n,e)=>{Ja.init(n,e),dh.init(n,e)},{email(n){return this.check(am(Hg,n))},url(n){return this.check(dm(Xg,n))},jwt(n){return this.check(Rm(o_,n))},emoji(n){return this.check(pm(Yg,n))},guid(n){return this.check(cm(Wg,n))},uuid(n){return this.check(lm(Zr,n))},uuidv4(n){return this.check(um(Zr,n))},uuidv6(n){return this.check(hm(Zr,n))},uuidv7(n){return this.check(fm(Zr,n))},nanoid(n){return this.check(mm(Zg,n))},cuid(n){return this.check(gm(jg,n))},cuid2(n){return this.check(_m(Kg,n))},ulid(n){return this.check(vm(qg,n))},base64(n){return this.check(bm(i_,n))},base64url(n){return this.check(wm(r_,n))},xid(n){return this.check(xm(Qg,n))},ksuid(n){return this.check(Am(Jg,n))},ipv4(n){return this.check(Em($g,n))},ipv6(n){return this.check(Sm(e_,n))},cidrv4(n){return this.check(ym(t_,n))},cidrv6(n){return this.check(Mm(n_,n))},e164(n){return this.check(Tm(s_,n))},datetime(n){return this.check(Cm(Bg,n))},date(n){return this.check(Pm(zg,n))},time(n){return this.check(Dm(Vg,n))},duration(n){return this.check(Im(Gg,n))}});function Un(n){return om(Og,n)}const _t=J("ZodStringFormat",(n,e)=>{dt.init(n,e),dh.init(n,e)}),Bg=J("ZodISODateTime",(n,e)=>{dp.init(n,e),_t.init(n,e)}),zg=J("ZodISODate",(n,e)=>{pp.init(n,e),_t.init(n,e)}),Vg=J("ZodISOTime",(n,e)=>{mp.init(n,e),_t.init(n,e)}),Gg=J("ZodISODuration",(n,e)=>{gp.init(n,e),_t.init(n,e)}),Hg=J("ZodEmail",(n,e)=>{$d.init(n,e),_t.init(n,e)}),Wg=J("ZodGUID",(n,e)=>{Qd.init(n,e),_t.init(n,e)}),Zr=J("ZodUUID",(n,e)=>{Jd.init(n,e),_t.init(n,e)}),Xg=J("ZodURL",(n,e)=>{sp.init(n,e),_t.init(n,e)}),Yg=J("ZodEmoji",(n,e)=>{op.init(n,e),_t.init(n,e)}),Zg=J("ZodNanoID",(n,e)=>{ap.init(n,e),_t.init(n,e)}),jg=J("ZodCUID",(n,e)=>{cp.init(n,e),_t.init(n,e)}),Kg=J("ZodCUID2",(n,e)=>{lp.init(n,e),_t.init(n,e)}),qg=J("ZodULID",(n,e)=>{up.init(n,e),_t.init(n,e)}),Qg=J("ZodXID",(n,e)=>{hp.init(n,e),_t.init(n,e)}),Jg=J("ZodKSUID",(n,e)=>{fp.init(n,e),_t.init(n,e)}),$g=J("ZodIPv4",(n,e)=>{_p.init(n,e),_t.init(n,e)}),e_=J("ZodIPv6",(n,e)=>{xp.init(n,e),_t.init(n,e)}),t_=J("ZodCIDRv4",(n,e)=>{Ap.init(n,e),_t.init(n,e)}),n_=J("ZodCIDRv6",(n,e)=>{Sp.init(n,e),_t.init(n,e)}),i_=J("ZodBase64",(n,e)=>{yp.init(n,e),_t.init(n,e)}),r_=J("ZodBase64URL",(n,e)=>{bp.init(n,e),_t.init(n,e)}),s_=J("ZodE164",(n,e)=>{wp.init(n,e),_t.init(n,e)}),o_=J("ZodJWT",(n,e)=>{Rp.init(n,e),_t.init(n,e)}),ph=J("ZodNumber",(n,e)=>{ju.init(n,e),Et.init(n,e),n._zod.processJSONSchema=(t,i,r)=>og(n,t,i,r),n.isFinite=!0},Nu({minValue:n=>{const{minimum:e,exclusiveMinimum:t}=vn(n);return Math.max(e??Number.NEGATIVE_INFINITY,t??Number.NEGATIVE_INFINITY)},maxValue:n=>{const{maximum:e,exclusiveMaximum:t}=vn(n);return Math.min(e??Number.POSITIVE_INFINITY,t??Number.POSITIVE_INFINITY)},isInt:n=>{const{isInt:e,multipleOf:t}=vn(n);return!!e||!!t?.some(Number.isSafeInteger)},format:n=>vn(n).format??null},{gt(n,e){return this.check(Wc(n,e))},gte(n,e){return this.check(no(n,e))},min(n,e){return this.check(no(n,e))},lt(n,e){return this.check(Hc(n,e))},lte(n,e){return this.check(to(n,e))},max(n,e){return this.check(to(n,e))},int(n){return this.check(el(n))},safe(n){return this.check(el(n))},positive(n){return this.check(Wc(0,n))},nonnegative(n){return this.check(no(0,n))},negative(n){return this.check(Hc(0,n))},nonpositive(n){return this.check(to(0,n))},multipleOf(n,e){return this.check(Xc(n,e))},step(n,e){return this.check(Xc(n,e))},finite(){return this}}));function ar(n){return Um(ph,n)}const a_=J("ZodNumberFormat",(n,e)=>{Cp.init(n,e),ph.init(n,e)});function el(n){return Lm(a_,n)}const c_=J("ZodBoolean",(n,e)=>{Pp.init(n,e),Et.init(n,e),n._zod.processJSONSchema=(t,i,r)=>ag(n,t,i)});function io(n){return Nm(c_,n)}const l_=J("ZodUnknown",(n,e)=>{Dp.init(n,e),Et.init(n,e),n._zod.processJSONSchema=(t,i,r)=>lg()});function tl(){return km(l_)}const u_=J("ZodNever",(n,e)=>{Ip.init(n,e),Et.init(n,e),n._zod.processJSONSchema=(t,i,r)=>cg(n,t,i)});function h_(n){return Fm(u_,n)}const f_=J("ZodArray",(n,e)=>{tc(),Up.init(n,e),Et.init(n,e),n._zod.processJSONSchema=(t,i,r)=>dg(n,t,i,r),n.element=e.element},{min(n,e){return this.check(Ds(n,e))},nonempty(n){return this.check(Ds(1,n))},max(n,e){return this.check(eh(n,e))},length(n,e){return this.check(th(n,e))},unwrap(){return this.element}});function nc(n,e){return Km(f_,n,e)}const d_=J("ZodObject",(n,e)=>{tc(),kp.init(n,e),Et.init(n,e),n._zod.processJSONSchema=(t,i,r)=>pg(n,t,i,r),kf(n,"shape",t=>t._zod.def.shape,!1)},{keyof(){return gh(Object.keys(this._zod.def.shape))},catchall(n){return this.clone(qt(this._zod.def,{catchall:n}))},passthrough(){return this.clone(qt(this._zod.def,{catchall:tl()}))},loose(){return this.clone(qt(this._zod.def,{catchall:tl()}))},strict(){return this.clone(qt(this._zod.def,{catchall:h_()}))},strip(){return this.clone(qt(this._zod.def,{catchall:void 0}))},extend(n){return wf(this,n)},safeExtend(n){return Tf(this,n)},merge(n){return Rf(this,n)},pick(n){return Mf(this,n)},omit(n){return bf(this,n)},partial(...n){return bc(_h,this,n[0])},exactPartial(...n){return bc(vh,this,n[0],"exactPartial")},required(...n){return Cf(xh,this,n[0])}});function mh(n,e){const t={type:"object",shape:n??{},...Ue(e)};return new d_(t)}const p_=J("ZodUnion",(n,e)=>{Fp.init(n,e),Et.init(n,e),n._zod.processJSONSchema=(t,i,r)=>mg(n,t,i,r),n.options=e.options});function m_(n,e){return new p_({type:"union",options:n,...Ue(e)})}const g_=J("ZodIntersection",(n,e)=>{Op.init(n,e),Et.init(n,e),n._zod.processJSONSchema=(t,i,r)=>gg(n,t,i,r)});function __(n,e){return new g_({type:"intersection",left:n,right:e})}const Jo=J("ZodEnum",(n,e)=>{Bp.init(n,e),Et.init(n,e),n._zod.processJSONSchema=(i,r,s)=>ug(n,i,r),n.enum=e.entries,n.options=[...n._zod.values];const t=new Set(Object.keys(e.entries));n.extract=(i,r)=>{const s={};for(const o of i)if(t.has(o))s[o]=e.entries[o];else throw new Error(`Key ${o} not found in enum`);return new Jo({...e,checks:[],...Ue(r),entries:s})},n.exclude=(i,r)=>{const s={...e.entries};for(const o of i)if(t.has(o))delete s[o];else throw new Error(`Key ${o} not found in enum`);return new Jo({...e,checks:[],...Ue(r),entries:s})}});function gh(n,e){const t=Array.isArray(n)?Object.fromEntries(n.map(i=>[i,i])):n;return new Jo({type:"enum",entries:t,...Ue(e)})}const v_=J("ZodTransform",(n,e)=>{tc(),zp.init(n,e),Et.init(n,e),n._zod.processJSONSchema=(t,i,r)=>fg(n,t,i,r),n._zod.parse=(t,i)=>{if(i.direction==="backward")throw new ku(n.constructor.name);t.addIssue=s=>{if(typeof s=="string")t.issues.push(Pr(s,t.value,e));else{const o=s;o.fatal&&(o.continue=!1),o.code??(o.code="custom"),"input"in o||(o.input=t.value),o.inst??(o.inst=n),t.issues.push(Pr(o))}};const r=e.transform(t.value,t);return r instanceof Promise?r.then(s=>(t.value=s,t)):(t.value=r,t)}});function x_(n){return new v_({type:"transform",transform:n})}const _h=J("ZodOptional",(n,e)=>{Qu.init(n,e),Et.init(n,e),n._zod.processJSONSchema=(t,i,r)=>fh(n,t,i,r),n.unwrap=()=>n._zod.def.innerType});function nl(n){return new _h({type:"optional",innerType:n})}const vh=J("ZodExactOptional",(n,e)=>{Vp.init(n,e),Et.init(n,e),n._zod.processJSONSchema=(t,i,r)=>fh(n,t,i,r),n.unwrap=()=>n._zod.def.innerType});function A_(n){return new vh({type:"optional",innerType:n})}const E_=J("ZodNullable",(n,e)=>{Gp.init(n,e),Et.init(n,e),n._zod.processJSONSchema=(t,i,r)=>_g(n,t,i,r),n.unwrap=()=>n._zod.def.innerType});function il(n){return new E_({type:"nullable",innerType:n})}const S_=J("ZodDefault",(n,e)=>{Hp.init(n,e),Et.init(n,e),n._zod.processJSONSchema=(t,i,r)=>xg(n,t,i,r),n.unwrap=()=>n._zod.def.innerType,n.removeDefault=n.unwrap});function y_(n,e){return new S_({type:"default",innerType:n,get defaultValue(){return typeof e=="function"?e():Cu(e)}})}const M_=J("ZodPrefault",(n,e)=>{Wp.init(n,e),Et.init(n,e),n._zod.processJSONSchema=(t,i,r)=>Ag(n,t,i,r),n.unwrap=()=>n._zod.def.innerType});function b_(n,e){return new M_({type:"prefault",innerType:n,get defaultValue(){return typeof e=="function"?e():Cu(e)}})}const xh=J("ZodNonOptional",(n,e)=>{Xp.init(n,e),Et.init(n,e),n._zod.processJSONSchema=(t,i,r)=>vg(n,t,i,r),n.unwrap=()=>n._zod.def.innerType});function w_(n,e){return new xh({type:"nonoptional",innerType:n,...Ue(e)})}const T_=J("ZodCatch",(n,e)=>{Yp.init(n,e),Et.init(n,e),n._zod.processJSONSchema=(t,i,r)=>Eg(n,t,i,r),n.unwrap=()=>n._zod.def.innerType,n.removeCatch=n.unwrap});function R_(n,e){return new T_({type:"catch",innerType:n,catchValue:typeof e=="function"?e:Of(e)})}const C_=J("ZodPipe",(n,e)=>{Zp.init(n,e),Et.init(n,e),n._zod.processJSONSchema=(t,i,r)=>Sg(n,t,i,r),n.in=e.in,n.out=e.out});function rl(n,e){return new C_({type:"pipe",in:n,out:e})}const P_=J("ZodReadonly",(n,e)=>{jp.init(n,e),Et.init(n,e),n._zod.processJSONSchema=(t,i,r)=>yg(n,t,i,r),n.unwrap=()=>n._zod.def.innerType});function D_(n){return new P_({type:"readonly",innerType:n})}const I_=J("ZodCustom",(n,e)=>{Kp.init(n,e),Et.init(n,e),n._zod.processJSONSchema=(t,i,r)=>hg(n,t,i,r)});function U_(n,e={}){return qm(I_,n,e)}function L_(n,e){return Qm(n,e)}const lt=0,Ah=/^[a-z0-9_]+$/,jr=Un().regex(Ah,"영문 소문자·숫자·밑줄(_)만 쓸 수 있어요"),N_=mh({id:Un().regex(Ah,"영문 소문자·숫자·밑줄(_)만 쓸 수 있어요 (예: iron_ore)"),name:Un().min(1,"한국어 이름이 비어 있어요"),solid:io().optional(),transparent:io().optional(),hardness:ar().min(0,"0 이상이어야 해요").optional(),tool:Un().nullable().optional(),toolTier:ar().int().min(0).max(4,"0~4 사이여야 해요").optional(),drops:Un().nullable().optional(),lightEmit:ar().int().min(0,"0~15 사이여야 해요").max(15,"0~15 사이여야 해요").optional(),lightFilter:ar().int().min(0,"0~15 사이여야 해요").max(15,"0~15 사이여야 해요").optional(),damage:ar().min(0,"0 이상이어야 해요").optional(),texture:jr.optional(),textureTop:jr.optional(),textureSide:jr.optional(),textureBottom:jr.optional(),shape:Un().optional(),release:Un().optional(),dyeable:io().optional(),variants:nc(Un()).optional(),fluid:gh(["water","lava"]).optional()}),Eh=7,Sh=[[0,0],[1,0],[-1,0],[0,1],[0,-1]],k_=["","e","w","s","n"],F_=["","동쪽으로","서쪽으로","남쪽으로","북쪽으로"],O_=mh({_comment:Un().optional(),blocks:nc(N_).min(1,"블록이 하나도 없어요")}),B_={id:"id(영문 이름)",name:"name(한국어 이름)",solid:"solid(밟을 수 있는지)",transparent:"transparent(투명한지)",hardness:"hardness(부수는 데 걸리는 초)",tool:"tool(필요한 도구)",toolTier:"toolTier(도구 등급)",drops:"drops(떨어지는 아이템)",lightEmit:"lightEmit(빛 세기)",lightFilter:"lightFilter(빛을 얼마나 막는지)",damage:"damage(닿으면 받는 피해)",texture:"texture(그림 파일 이름)",textureTop:"textureTop(윗면 그림)",textureSide:"textureSide(옆면 그림)",textureBottom:"textureBottom(아랫면 그림)",shape:"shape(특수 모양)",release:"release(버전)",variants:"variants(종류 목록)",fluid:"fluid(액체 종류)"};class sl extends Error{constructor(e,t){super(`${e} 파일에 고칠 곳이 ${t.length}개 있어요:
`+t.map(i=>`  - ${i}`).join(`
`)),this.file=e,this.problems=t,this.name="DataError"}file;problems}class z_{constructor(e){this.defs=e;for(const t of e)if(this.byId.set(t.id,t),t.fluid){let i=this.fluidLevels.get(t.fluidSource);i||(i=[],this.fluidLevels.set(t.fluidSource,i)),(i[t.fluidDir]??=[])[t.fluidLevel]=t.num}}defs;byId=new Map;fluidLevels=new Map;isFluid(e){return this.get(e).fluid!==null}fluidVariant(e,t,i=0){const r=this.fluidLevels.get(e);if(!r)throw new Error(`액체가 아닌 블록 번호: ${e}`);return(r[i]??r[0])?.[Math.max(0,Math.min(Eh,t))]??e}get count(){return this.defs.length}get(e){return this.defs[e]??this.defs[lt]}find(e){return this.byId.get(e)}require(e){const t=this.byId.get(e);if(!t)throw new Error(`블록 '${e}' 을(를) data/blocks.json 에서 찾을 수 없어요`);return t}numOf(e){return this.require(e).num}isSolid(e){return this.get(e).solid}isOpaque(e){const t=this.get(e);return t.solid&&!t.transparent}v1(){return this.defs.filter(e=>e.release==="v1"&&!e.internal)}}function V_(n,e,t,i){return n?0:i==="lava"?15:i==="water"?1:e&&!t?15:0}function G_(n,e){if(n[0]!=="blocks"||typeof n[1]!="number")return n.map(String).join(".");const t=n[1],i=e?.blocks,r=Array.isArray(i)?i[t]:void 0,s=r&&typeof r.id=="string"?r.id:"?",o=n[2],a=typeof o=="string"?B_[o]??o:"";return`${t+1}번째 블록(id: ${s})${a?`의 ${a}`:""}`}function H_(n){return/expected number/i.test(n)?"숫자여야 해요":/expected string/i.test(n)?"글자(따옴표 안)여야 해요":/expected boolean/i.test(n)?"true 또는 false 여야 해요":/expected array/i.test(n)?"목록([ ... ])이어야 해요":/expected object/i.test(n)?"{ ... } 모양이어야 해요":/expected int|integer/i.test(n)?"정수(소수점 없는 수)여야 해요":/invalid option|invalid enum|expected one of/i.test(n)?`쓸 수 있는 값이 아니에요 (${n.replace(/^Invalid option: /,"")})`:/invalid input/i.test(n)?"값이 이상해요":n}function W_(n,e="data/blocks.json"){const t=O_.safeParse(n);if(!t.success){const c=t.error.issues.map(l=>`${G_(l.path,n)}: ${H_(l.message)}`);throw new sl(e,c)}const i=[],r=t.data.blocks,s=new Set;r.forEach((c,l)=>{s.has(c.id)&&i.push(`${l+1}번째 블록: id '${c.id}' 가 두 번 나와요. 하나는 이름을 바꿔 주세요`),s.add(c.id)}),s.has("air")||i.push("'air'(공기) 블록이 꼭 있어야 해요");const a=[...r.filter(c=>c.id==="air"),...r.filter(c=>c.id!=="air")].map((c,l)=>{const u=c.id==="air",h=c.solid??!u,f=c.transparent??u;let d=null;if(!u){const g=c.textureTop??c.texture,_=c.textureSide??c.texture,m=c.textureBottom??c.textureTop??c.texture;!g||!_||!m?(i.push(`블록 '${c.id}'(${c.name}): 그림이 없어요. texture 하나를 쓰거나 textureTop·textureSide·textureBottom 을 모두 적어 주세요`),d=["missing","missing","missing"]):d=[g,_,m]}return c.fluid&&h&&i.push(`블록 '${c.id}'(${c.name}): 액체(fluid)는 solid 가 false 여야 해요`),{num:l,id:c.id,name:c.name,solid:h,transparent:f,hardness:c.hardness??null,tool:c.tool??null,toolTier:c.toolTier??0,drops:c.drops===void 0?c.id:c.drops,lightEmit:c.lightEmit??0,lightFilter:c.lightFilter??V_(u,h,f,c.fluid??null),damage:c.damage??0,textures:d,shape:c.shape??null,release:c.release??"v1",fluid:c.fluid??null,fluidLevel:0,fluidSource:c.fluid?l:-1,fluidDir:0,internal:!1}});for(const c of[...a])if(c.fluid)for(let l=0;l<Sh.length;l++)for(let u=l===0?1:0;u<=Eh;u++){const h=l?`>${k_[l]}`:"",f=u?`~${u}`:"",d=[l?F_[l]:"",u?`흐름 ${u}`:""].filter(Boolean);a.push({...c,num:a.length,id:`${c.id}${h}${f}`,name:`${c.name}(${d.join(", ")})`,hardness:null,drops:null,fluidLevel:u,fluidSource:c.num,fluidDir:l,internal:!0})}if(a.length>65535&&i.push("블록이 너무 많아요 (최대 65535개)"),i.length)throw new sl(e,i);return new z_(a)}const nn=4,Oe=1<<nn,X_=Oe*Oe,Nt=X_*Oe;function $o(n,e,t){return e<<nn*2|t<<nn|n}function ol(n,e,t){if((n|e|t)<0||n>=Oe||e>=Oe||t>=Oe)throw new RangeError(`청크 밖 좌표: (${n}, ${e}, ${t})`)}class Y_{constructor(e,t,i){this.cx=e,this.cy=t,this.cz=i}cx;cy;cz;data=new Uint16Array(Nt);palette=[lt];lookup=new Map([[lt,0]]);nonAir=0;version=0;get(e,t,i){return ol(e,t,i),this.palette[this.data[$o(e,t,i)]]}set(e,t,i,r){ol(e,t,i);const s=$o(e,t,i),o=this.palette[this.data[s]];if(o===r)return!1;let a=this.lookup.get(r);return a===void 0&&(a=this.palette.length,this.palette.push(r),this.lookup.set(r,a)),this.data[s]=a,o===lt?this.nonAir++:r===lt&&this.nonAir--,this.version++,!0}isEmpty(){return this.nonAir===0}fill(e){for(let t=0;t<Oe;t++)for(let i=0;i<Oe;i++)for(let r=0;r<Oe;r++)this.set(r,t,i,e)}toBlockIds(e=new Uint16Array(Nt)){for(let t=0;t<Nt;t++)e[t]=this.palette[this.data[t]];return e}loadBlockIds(e){if(e.length!==Nt)throw new RangeError(`청크 데이터 길이가 ${e.length} — 4096 이어야 해요`);this.palette.length=1,this.palette[0]=lt,this.lookup.clear(),this.lookup.set(lt,0),this.nonAir=0;for(let t=0;t<Nt;t++){const i=e[t];if(i===lt){this.data[t]=0;continue}let r=this.lookup.get(i);r===void 0&&(r=this.palette.length,this.palette.push(i),this.lookup.set(i,r)),this.data[t]=r,this.nonAir++}this.version++}compactPalette(){const e=new Uint8Array(this.palette.length);for(let r=0;r<Nt;r++)e[this.data[r]]=1;e[0]=1;const t=new Uint16Array(this.palette.length),i=[];for(let r=0;r<this.palette.length;r++)e[r]&&(t[r]=i.length,i.push(this.palette[r]));for(let r=0;r<Nt;r++)this.data[r]=t[this.data[r]];this.palette.length=0,this.palette.push(...i),this.lookup.clear(),i.forEach((r,s)=>this.lookup.set(r,s))}}const ro=512;function fn(n,e,t){return n+ro|e+ro<<10|t+ro<<20}const br=Oe+2,ic=br*br*br;function mn(n,e,t){return((e+1)*br+(t+1))*br+(n+1)}class Z_{constructor(e){this.bounds=e}bounds;chunks=new Map;get sizeX(){return this.bounds.sizeCX*Oe}get sizeY(){return this.bounds.sizeCY*Oe}get sizeZ(){return this.bounds.sizeCZ*Oe}inBounds(e,t,i){return e>=0&&t>=0&&i>=0&&e<this.sizeX&&t<this.sizeY&&i<this.sizeZ}chunkInBounds(e,t,i){return e>=0&&t>=0&&i>=0&&e<this.bounds.sizeCX&&t<this.bounds.sizeCY&&i<this.bounds.sizeCZ}getChunk(e,t,i){return this.chunks.get(fn(e,t,i))}getOrCreateChunk(e,t,i){if(!this.chunkInBounds(e,t,i))throw new RangeError(`월드 밖 청크: (${e}, ${t}, ${i})`);const r=fn(e,t,i);let s=this.chunks.get(r);return s||(s=new Y_(e,t,i),this.chunks.set(r,s)),s}forEachChunk(e){for(const t of this.chunks.values())e(t)}get chunkCount(){return this.chunks.size}getBlock(e,t,i){if(!this.inBounds(e,t,i))return lt;const r=this.chunks.get(fn(e>>nn,t>>nn,i>>nn));return r?r.get(e&15,t&15,i&15):lt}setBlock(e,t,i,r){if(!this.inBounds(e,t,i))return{changed:!1,dirty:[]};const s=e>>nn,o=t>>nn,a=i>>nn,c=e&15,l=t&15,u=i&15,h=this.getChunk(s,o,a);if(!h&&r===lt)return{changed:!1,dirty:[]};if(!(h??this.getOrCreateChunk(s,o,a)).set(c,l,u,r))return{changed:!1,dirty:[]};const g=c===0?[0,-1]:c===15?[0,1]:[0],_=l===0?[0,-1]:l===15?[0,1]:[0],m=u===0?[0,-1]:u===15?[0,1]:[0],p=[];for(const A of g)for(const E of _)for(const x of m){const w=s+A,b=o+E,R=a+x;this.chunkInBounds(w,b,R)&&p.push({cx:w,cy:b,cz:R})}return{changed:!0,dirty:p}}buildPadded(e,t,i,r){const s=r??new Uint16Array(ic),o=e<<nn,a=t<<nn,c=i<<nn,l=this.getChunk(e,t,i);let u=0;for(let h=-1;h<=Oe;h++)for(let f=-1;f<=Oe;f++)for(let d=-1;d<=Oe;d++){const g=(d|h|f)>=0&&d<Oe&&h<Oe&&f<Oe;s[u++]=g?l?l.palette[l.data[h<<8|f<<4|d]]:lt:this.getBlock(o+d,a+h,c+f)}return s}}const yh=1;function j_(n,e){const t=n.toBlockIds(),i=[lt],r=new Map([[lt,0]]),s=new Uint16Array(Nt);for(let d=0;d<Nt;d++){const g=t[d];let _=r.get(g);_===void 0&&(_=i.length,i.push(g),r.set(g,_)),s[d]=_}const o=i.map(d=>e.get(d).id),a=[];let c=0;for(;c<Nt;){const d=s[c];let g=1;for(;c+g<Nt&&s[c+g]===d&&g<65535;)g++;a.push(g,d),c+=g}let l=5+a.length*2;for(const d of o)l+=1+d.length;const u=new Uint8Array(l);let h=0;u[h++]=yh,u[h++]=o.length&255,u[h++]=o.length>>8;for(const d of o){if(d.length>255)throw new Error(`블록 id 가 너무 길어요: ${d}`);u[h++]=d.length;for(let g=0;g<d.length;g++){const _=d.charCodeAt(g);if(_>127)throw new Error(`블록 id 는 영문·숫자·기호만: ${d}`);u[h++]=_}}const f=a.length/2;u[h++]=f&255,u[h++]=f>>8;for(const d of a)u[h++]=d&255,u[h++]=d>>8;return u}function K_(n,e,t){let i=0;const r=n[i++];if(r!==yh)throw new Error(`모르는 청크 저장 형식: ${r}`);const s=n[i]|n[i+1]<<8;i+=2;const o=[],a=[];for(let h=0;h<s;h++){const f=n[i++];let d="";for(let _=0;_<f;_++)d+=String.fromCharCode(n[i++]);const g=e.find(d);g?o.push(g.num):(o.push(lt),a.push(d))}const c=n[i]|n[i+1]<<8;i+=2;const l=new Uint16Array(Nt);let u=0;for(let h=0;h<c;h++){const f=n[i]|n[i+1]<<8,d=n[i+2]|n[i+3]<<8;if(i+=4,d>=o.length)throw new Error(`팔레트 번호가 범위를 벗어났어요: ${d}`);const g=o[d];if(u+f>Nt)throw new Error("청크 데이터가 4096 을 넘어요");l.fill(g,u,u+f),u+=f}if(u!==Nt)throw new Error(`청크 데이터가 ${u}개 — 4096 이어야 해요`);return t.loadBlockIds(l),{unknownIds:a}}const q_=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];function Q_(n,e,t,i,r,s,o,a,c){const l=Math.hypot(s,o,a);if(l===0)return null;s/=l,o/=l,a/=l;let u=Math.floor(t),h=Math.floor(i),f=Math.floor(r);const d=s>0?1:s<0?-1:0,g=o>0?1:o<0?-1:0,_=a>0?1:a<0?-1:0,m=d?Math.abs(1/s):1/0,p=g?Math.abs(1/o):1/0,A=_?Math.abs(1/a):1/0;let E=d>0?(u+1-t)/s:d<0?(t-u)/-s:1/0,x=g>0?(h+1-i)/o:g<0?(i-h)/-o:1/0,w=_>0?(f+1-r)/a:_<0?(r-f)/-a:1/0,b=-1,R=0;for(let I=0;I<256;I++){if(b>=0){const M=n(u,h,f);if(e(M)){const S=q_[b];return{x:u,y:h,z:f,face:b,nx:S[0],ny:S[1],nz:S[2],distance:R,id:M}}}if(E<x&&E<w){if(R=E,R>c)return null;u+=d,E+=m,b=d>0?1:0}else if(x<w){if(R=x,R>c)return null;h+=g,x+=p,b=g>0?3:2}else{if(R=w,R>c)return null;f+=_,w+=A,b=_>0?5:4}}return null}const Qe=1e-4;function J_(n,e,t,i,r){const s=e.w/2;return t+1>n.x-s+Qe&&t<n.x+s-Qe&&i+1>n.y+Qe&&i<n.y+e.h-Qe&&r+1>n.z-s+Qe&&r<n.z+s-Qe}function so(n,e,t,i,r,s,o,a,c){const l=u=>{for(let h=s;h<=o;h++)for(let f=a;f<=c;f++)if(e===0?n(u,h,f):e===1?n(h,u,f):n(h,f,u))return!0;return!1};if(r>0){const u=Math.floor(i-Qe)+1,h=Math.floor(i+r-Qe);for(let f=u;f<=h;f++)if(l(f))return f}else{const u=Math.floor(t+Qe)-1,h=Math.floor(t+r+Qe);for(let f=u;f>=h;f--)if(l(f))return f}return null}function Ss(n,e,t,i,r,s){s.onGround=!1,s.hitX=s.hitY=s.hitZ=s.hitCeiling=!1;const o=t.w/2;let a=i.y*r;if(a!==0){const c=Math.floor(e.x-o+Qe),l=Math.floor(e.x+o-Qe),u=Math.floor(e.z-o+Qe),h=Math.floor(e.z+o-Qe),f=so(n,1,e.y,e.y+t.h,a,c,l,u,h);f===null?e.y+=a:a>0?(e.y=f-t.h-Qe,i.y=0,s.hitY=s.hitCeiling=!0):(e.y=f+1,i.y=0,s.hitY=s.onGround=!0)}if(a=i.x*r,a!==0){const c=Math.floor(e.y+Qe),l=Math.floor(e.y+t.h-Qe),u=Math.floor(e.z-o+Qe),h=Math.floor(e.z+o-Qe),f=so(n,0,e.x-o,e.x+o,a,c,l,u,h);f===null?e.x+=a:(e.x=a>0?f-o-Qe:f+1+o+Qe,i.x=0,s.hitX=!0)}if(a=i.z*r,a!==0){const c=Math.floor(e.y+Qe),l=Math.floor(e.y+t.h-Qe),u=Math.floor(e.x-o+Qe),h=Math.floor(e.x+o-Qe),f=so(n,2,e.z-o,e.z+o,a,u,h,c,l);f===null?e.z+=a:(e.z=a>0?f-o-Qe:f+1+o+Qe,i.z=0,s.hitZ=!0)}}const Kr={onGround:!1,hitX:!1,hitY:!1,hitZ:!1,hitCeiling:!1};function $_(n,e,t,i,r,s,o,a=1){if(o<=0||r===0&&s===0)return null;const c={x:e.x,y:e.y,z:e.z},l={x:0,y:a/o,z:0};if(Ss(n,c,i,l,o,Kr),c.y-e.y<a-.05)return null;l.x=r,l.y=0,l.z=s,Ss(n,c,i,l,o,Kr);const u=(c.x-e.x)**2+(c.z-e.z)**2,h=(t.x-e.x)**2+(t.z-e.z)**2;if(u<=h+1e-9)return null;const f=l.x,d=l.z;if(l.x=0,l.y=-(a+.05)/o,l.z=0,Ss(n,c,i,l,o,Kr),!Kr.onGround||c.y<=e.y+1e-4)return null;const g=c.y-e.y;return t.x=c.x,t.y=c.y,t.z=c.z,{dy:g,vx:f,vz:d}}function oo(n,e,t,i=.05){const r=t.w/2,s=Math.floor(e.y-i),o=Math.floor(e.x-r+Qe),a=Math.floor(e.x+r-Qe),c=Math.floor(e.z-r+Qe),l=Math.floor(e.z+r-Qe);for(let u=c;u<=l;u++)for(let h=o;h<=a;h++)if(n(h,s,u))return!0;return!1}function ea(n){let e=n>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function ii(n,e,t,i){let r=Math.imul(n|0,668265261)^Math.imul(e|0,374761393)^Math.imul(t|0,2654435761)^(i|0);return r=Math.imul(r^r>>>15,2246822507),r=Math.imul(r^r>>>13,3266489909),((r^r>>>16)>>>0)/4294967296}const al={water:{maxLevel:7,step:1,interval:5},lava:{maxLevel:6,step:2,interval:30}},e0=2048,cl=[[1,0],[-1,0],[0,1],[0,-1]];function t0(n,e,t){return(n*4096+e)*4096+t}class n0{constructor(e,t){this.world=e,this.registry=t;const i=(...r)=>{for(const s of r){const o=t.find(s);if(o)return o.num}return lt};this.obsidian=i("obsidian","cobblestone","stone"),this.cobble=i("cobblestone","stone")}world;registry;pending=new Map;dirty=new Map;changed=new Map;tickCount=0;obsidian;cobble;onBlockSet=null;get pendingCount(){return this.pending.size}get ticks(){return this.tickCount}touch(e,t,i){this.schedule(e,t,i),this.touchNeighbors(e,t,i)}touchNeighbors(e,t,i){this.schedule(e+1,t,i),this.schedule(e-1,t,i),this.schedule(e,t+1,i),this.schedule(e,t-1,i),this.schedule(e,t,i+1),this.schedule(e,t,i-1)}schedule(e,t,i){if(!this.world.inBounds(e,t,i))return;const r=this.registry.get(this.world.getBlock(e,t,i));if(!r.fluid)return;const s=this.tickCount+al[r.fluid].interval,o=t0(e,t,i),a=this.pending.get(o);(a===void 0||s<a)&&this.pending.set(o,s)}tick(){this.tickCount++;const e=[];for(const[r,s]of this.pending)s<=this.tickCount&&e.push(r);e.sort((r,s)=>r-s);const t=Math.min(e.length,e0);for(let r=0;r<t;r++){const s=e[r];this.pending.delete(s);const o=s%4096,a=Math.floor(s/4096)%4096,c=Math.floor(s/(4096*4096));this.process(c,a,o)}const i=[...this.dirty.values()];return this.dirty.clear(),i}set(e,t,i,r){const s=this.world.setBlock(e,t,i,r);for(const o of s.dirty)this.dirty.set(fn(o.cx,o.cy,o.cz),o);if(s.changed){const o=e>>4,a=t>>4,c=i>>4;this.changed.set(fn(o,a,c),{cx:o,cy:a,cz:c}),this.onBlockSet?.(e,t,i)}}takeChanged(){const e=[...this.changed.values()];return this.changed.clear(),e}sameKind(e,t){const i=this.registry.get(e);return i.fluid===t?i:null}canFlowInto(e,t,i){const r=this.registry.get(e);return r.solid?!1:!r.fluid||r.fluid!==t?!0:r.fluidLevel>i}flowInto(e,t,i,r,s,o,a,c){const l=this.registry.get(c);if(l.fluid&&l.fluid!==r){const u=r==="water"&&l.fluidLevel===0?this.obsidian:this.cobble;this.set(e,t,i,u),this.touchNeighbors(e,t,i);return}this.set(e,t,i,this.registry.fluidVariant(s,o,a)),this.schedule(e,t,i),this.touchNeighbors(e,t,i)}process(e,t,i){const r=this.world,s=r.getBlock(e,t,i),o=this.registry.get(s);if(!o.fluid)return;const a=o.fluid,c=al[a],l=o.fluidSource,u=o.fluidDir,[h,f]=Sh[u];let d=o.fluidLevel;if(d>0){const _=this.sameKind(r.getBlock(e,t+1,i),a);let m;if(u===0){let p=1/0,A=0;for(const[E,x]of cl){const w=this.sameKind(r.getBlock(e+E,t,i+x),a);w&&(w.fluidLevel<p&&(p=w.fluidLevel),w.fluidLevel===0&&A++)}if(m=_?c.step:p+c.step,a==="water"&&A>=2){const E=r.getBlock(e,t-1,i),x=this.sameKind(E,a);(this.registry.isSolid(E)||x&&x.fluidLevel===0||t===0)&&(m=0)}}else{const p=this.sameKind(r.getBlock(e-h,t,i-f),a);m=_?c.step:(p?p.fluidLevel:1/0)+c.step}if(m>c.maxLevel){this.set(e,t,i,lt),this.touchNeighbors(e,t,i);return}m!==d&&(this.set(e,t,i,this.registry.fluidVariant(l,m,u)),d=m,this.schedule(e,t,i),this.touchNeighbors(e,t,i))}let g;if(t>0){const _=r.getBlock(e,t-1,i);this.canFlowInto(_,a,c.step)&&this.flowInto(e,t-1,i,a,l,c.step,u,_);const m=this.registry.get(r.getBlock(e,t-1,i));g=m.solid||m.fluid===a}else g=!0;if(g&&d+c.step<=c.maxLevel){const _=d+c.step,m=u===0?cl:[[h,f]];for(const[p,A]of m){const E=e+p,x=i+A;if(!r.inBounds(E,t,x))continue;const w=r.getBlock(E,t,x);this.canFlowInto(w,a,_)&&this.flowInto(E,t,x,a,l,_,u,w)}}}}const Xt=15,Hi=240;function i0(n){return n>>4}function r0(n){return n&15}const en=0,bi=1,qr=3,cr=()=>performance.now();class s0{constructor(e,t){this.world=e,this.sx=e.sizeX,this.sy=e.sizeY,this.sz=e.sizeZ,this.strideY=this.sx*this.sz;const i=this.sx*this.sy*this.sz;this.light=new Uint8Array(i),this.cells=new Uint8Array(i),this.table=new Uint8Array(t.count);for(const r of t.defs)this.table[r.num]=Math.min(Xt,r.lightEmit)<<4|Math.min(Xt,r.lightFilter)}world;light;cells;table;sx;sy;sz;strideY;pending=new Set;changedChunks=new Map;tracking=!1;changedCells=0;buckets=Array.from({length:Xt+1},()=>[]);stats={initialMs:0,lastFlushMs:0,lastFlushCells:0};index(e,t,i){return t*this.strideY+i*this.sx+e}get(e,t,i){return this.world.inBounds(e,t,i)?this.light[this.index(e,t,i)]:Hi}skyAt(e,t,i){return i0(this.get(e,t,i))}blockAt(e,t,i){return r0(this.get(e,t,i))}computeAll(e=!1){const t=cr();this.light.fill(0),this.fillCells(),this.tracking=!1,this.pending.clear();const{sx:i,sy:r,sz:s,cells:o,light:a,buckets:c,strideY:l}=this;if(e){const u=(r-1)*l;for(let h=0;h<s;h++)for(let f=0;f<i;f++){const d=u+h*i+f,g=this.fromSkyAbove(o[d]&15);g>0&&(a[d]=g<<4,c[g].push(d))}}else{const u=new Int32Array(i*s);for(let h=0;h<s;h++)for(let f=0;f<i;f++){let d=r-1,g=d*l+h*i+f;for(;d>=0&&(o[g]&15)===0;)a[g]=Xt<<4,d--,g-=l;u[h*i+f]=d}for(let h=0;h<s;h++)for(let f=0;f<i;f++){const d=u[h*i+f],g=h*i+f;if(d===r-1){const m=this.fromSkyAbove(o[d*l+g]&15);m>0&&(a[d*l+g]=a[d*l+g]&15|m<<4,c[m].push(d*l+g));continue}c[Xt].push((d+1)*l+g);const _=m=>{for(let p=d+2;p<=m;p++)c[Xt].push(p*l+g)};f>0&&_(u[g-1]),f<i-1&&_(u[g+1]),h>0&&_(u[g-i]),h<s-1&&_(u[g+i])}}this.propagate(en);for(let u=0;u<o.length;u++){const h=o[u]>>4;h!==0&&(a[u]=a[u]&240|h,c[h].push(u))}this.propagate(bi),this.stats.initialMs=cr()-t}fromSkyAbove(e){return e===0?Xt:Xt-Math.max(1,e)}fillCells(){const{cells:e,table:t}=this;e.fill(0),this.world.forEachChunk(i=>{const r=i.cx<<4,s=i.cy<<4,o=i.cz<<4,{data:a,palette:c}=i;let l=0;for(let u=0;u<Oe;u++)for(let h=0;h<Oe;h++){let f=this.index(r,s+u,o+h);for(let d=0;d<Oe;d++,f++,l++)e[f]=t[c[a[l]]]}})}markChanged(e,t,i){this.world.inBounds(e,t,i)&&this.pending.add(this.index(e,t,i))}get pendingCount(){return this.pending.size}flush(){if(this.pending.size===0)return[];const e=cr(),{cells:t,table:i,light:r,buckets:s}=this,o=[],a=[];for(const g of this.pending){const _=g%this.sx,m=(g-_)/this.sx,p=m%this.sz,A=(m-p)/this.sz,E=i[this.world.getBlock(_,A,p)]??0;E!==t[g]&&(o.push(g),a.push(E))}if(this.pending.clear(),o.length===0)return this.stats.lastFlushMs=cr()-e,this.stats.lastFlushCells=0,[];this.tracking=!0,this.changedChunks.clear(),this.changedCells=0;const c=[],l=[];for(let g=0;g<o.length;g++){const _=o[g],m=t[_],p=a[g],A=(p&15)>(m&15);A&&c.push(_),(A||p>>4<m>>4)&&l.push(_)}const u=this.remove(en,c),h=this.remove(bi,l);for(let g=0;g<o.length;g++)t[o[g]]=a[g];const f=(g,_)=>{const m=g===en?r[_]>>4:r[_]&15;m>0&&s[m].push(_)},d=(g,_,m,p,A)=>{f(g,_),m>0&&f(g,_-1),m<this.sx-1&&f(g,_+1),A>0&&f(g,_-this.sx),A<this.sz-1&&f(g,_+this.sx),p>0&&f(g,_-this.strideY),p<this.sy-1&&f(g,_+this.strideY)};for(const g of u)f(en,g);for(let g=0;g<o.length;g++){const _=o[g],m=_%this.sx,p=(_-m)/this.sx,A=p%this.sz,E=(p-A)/this.sz;if(E===this.sy-1){const x=this.fromSkyAbove(a[g]&15);x>r[_]>>4&&(r[_]=r[_]&15|x<<4,this.mark(m,E,A))}d(en,_,m,E,A)}this.propagate(en);for(const g of h)f(bi,g);for(let g=0;g<o.length;g++){const _=o[g],m=_%this.sx,p=(_-m)/this.sx,A=p%this.sz,E=(p-A)/this.sz,x=a[g]>>4;x>(r[_]&15)&&(r[_]=r[_]&240|x,this.mark(m,E,A)),d(bi,_,m,E,A)}return this.propagate(bi),this.tracking=!1,this.stats.lastFlushMs=cr()-e,this.stats.lastFlushCells=this.changedCells,[...this.changedChunks.values()]}remove(e,t){const i=[];if(t.length===0)return i;const{light:r,cells:s,sx:o,sy:a,sz:c,strideY:l}=this,u=[],h=_=>e===en?r[_]>>4:r[_]&15,f=_=>{r[_]=e===en?r[_]&15:r[_]&240},d=[];for(const _ of t){const m=h(_);if(m===0)continue;f(_),u.push(_,m);const p=_%o,A=(_-p)/o,E=A%c;this.mark(p,(A-E)/c,E)}const g=(_,m,p,A,E,x)=>{const w=h(_);w!==0&&(w<m||e===en&&p===qr&&m===Xt&&w===Xt?(f(_),this.mark(A,E,x),u.push(_,w),e===bi&&s[_]>>4>0&&d.push(_)):i.push(_))};for(;u.length;){const _=u.pop(),m=u.pop(),p=m%o,A=(m-p)/o,E=A%c,x=(A-E)/c;p>0&&g(m-1,_,0,p-1,x,E),p<o-1&&g(m+1,_,1,p+1,x,E),x<a-1&&g(m+l,_,2,p,x+1,E),x>0&&g(m-l,_,qr,p,x-1,E),E>0&&g(m-o,_,4,p,x,E-1),E<c-1&&g(m+o,_,5,p,x,E+1)}for(const _ of d){const m=s[_]>>4;m>(r[_]&15)&&(r[_]=r[_]&240|m),i.push(_)}return i}propagate(e){const{light:t,cells:i,sx:r,sy:s,sz:o,strideY:a,buckets:c}=this,l=u=>e===en?t[u]>>4:t[u]&15;for(let u=Xt;u>=1;u--){const h=c[u];for(;h.length;){const f=h.pop();if(l(f)!==u)continue;const d=f%r,g=(f-d)/r,_=g%o,m=(g-_)/o,p=(A,E,x,w,b)=>{const R=i[A]&15;let I;e===en&&E===qr&&u===Xt&&R===0?I=Xt:I=u-(R>1?R:1),!(I<=0||I<=l(A))&&(t[A]=e===en?t[A]&15|I<<4:t[A]&240|I,this.tracking&&this.mark(x,w,b),c[I].push(A))};d>0&&p(f-1,0,d-1,m,_),d<r-1&&p(f+1,1,d+1,m,_),m<s-1&&p(f+a,2,d,m+1,_),m>0&&p(f-a,qr,d,m-1,_),_>0&&p(f-r,4,d,m,_-1),_<o-1&&p(f+r,5,d,m,_+1)}}}mark(e,t,i){if(!this.tracking)return;this.changedCells++;const r=e>>4,s=t>>4,o=i>>4,a=e&15,c=t&15,l=i&15,u=a===0?-1:0,h=a===15?1:0,f=c===0?-1:0,d=c===15?1:0,g=l===0?-1:0,_=l===15?1:0;for(let m=u;m<=h;m++)for(let p=f;p<=d;p++)for(let A=g;A<=_;A++){const E=r+m,x=s+p,w=o+A;if(!this.world.chunkInBounds(E,x,w))continue;const b=fn(E,x,w);this.changedChunks.has(b)||this.changedChunks.set(b,{cx:E,cy:x,cz:w})}}buildPaddedLight(e,t,i,r){const s=r??new Uint8Array(ic),{sx:o,sy:a,sz:c,light:l}=this,u=e<<4,h=t<<4,f=i<<4;let d=0;for(let g=-1;g<=Oe;g++){const _=h+g,m=_>=0&&_<a;for(let p=-1;p<=Oe;p++){const A=f+p,E=m&&A>=0&&A<c,x=_*this.strideY+A*o;for(let w=-1;w<=Oe;w++,d++){const b=u+w;s[d]=E&&b>=0&&b<o?l[x+b]:Hi}}}return s}}const Mh=Math.sqrt(3),o0=.5*(Mh-1),lr=(3-Mh)/6,a0=1/3,pn=1/6,wr=n=>Math.floor(n)|0,ll=new Float64Array([1,1,-1,1,1,-1,-1,-1,1,0,-1,0,1,0,-1,0,0,1,0,-1,0,1,0,-1]),ao=new Float64Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]);function c0(n=Math.random){const e=bh(n),t=new Float64Array(e).map(r=>ll[r%12*2]),i=new Float64Array(e).map(r=>ll[r%12*2+1]);return function(s,o){let a=0,c=0,l=0;const u=(s+o)*o0,h=wr(s+u),f=wr(o+u),d=(h+f)*lr,g=h-d,_=f-d,m=s-g,p=o-_;let A,E;m>p?(A=1,E=0):(A=0,E=1);const x=m-A+lr,w=p-E+lr,b=m-1+2*lr,R=p-1+2*lr,I=h&255,M=f&255;let S=.5-m*m-p*p;if(S>=0){const k=I+e[M],V=t[k],H=i[k];S*=S,a=S*S*(V*m+H*p)}let C=.5-x*x-w*w;if(C>=0){const k=I+A+e[M+E],V=t[k],H=i[k];C*=C,c=C*C*(V*x+H*w)}let U=.5-b*b-R*R;if(U>=0){const k=I+1+e[M+1],V=t[k],H=i[k];U*=U,l=U*U*(V*b+H*R)}return 70*(a+c+l)}}function l0(n=Math.random){const e=bh(n),t=new Float64Array(e).map(s=>ao[s%12*3]),i=new Float64Array(e).map(s=>ao[s%12*3+1]),r=new Float64Array(e).map(s=>ao[s%12*3+2]);return function(o,a,c){let l,u,h,f;const d=(o+a+c)*a0,g=wr(o+d),_=wr(a+d),m=wr(c+d),p=(g+_+m)*pn,A=g-p,E=_-p,x=m-p,w=o-A,b=a-E,R=c-x;let I,M,S,C,U,k;w>=b?b>=R?(I=1,M=0,S=0,C=1,U=1,k=0):w>=R?(I=1,M=0,S=0,C=1,U=0,k=1):(I=0,M=0,S=1,C=1,U=0,k=1):b<R?(I=0,M=0,S=1,C=0,U=1,k=1):w<R?(I=0,M=1,S=0,C=0,U=1,k=1):(I=0,M=1,S=0,C=1,U=1,k=0);const V=w-I+pn,H=b-M+pn,W=R-S+pn,$=w-C+2*pn,X=b-U+2*pn,te=R-k+2*pn,ae=w-1+3*pn,_e=b-1+3*pn,ye=R-1+3*pn,Ve=g&255,Ce=_&255,Pe=m&255;let K=.6-w*w-b*b-R*R;if(K<0)l=0;else{const fe=Ve+e[Ce+e[Pe]];K*=K,l=K*K*(t[fe]*w+i[fe]*b+r[fe]*R)}let Q=.6-V*V-H*H-W*W;if(Q<0)u=0;else{const fe=Ve+I+e[Ce+M+e[Pe+S]];Q*=Q,u=Q*Q*(t[fe]*V+i[fe]*H+r[fe]*W)}let pe=.6-$*$-X*X-te*te;if(pe<0)h=0;else{const fe=Ve+C+e[Ce+U+e[Pe+k]];pe*=pe,h=pe*pe*(t[fe]*$+i[fe]*X+r[fe]*te)}let Me=.6-ae*ae-_e*_e-ye*ye;if(Me<0)f=0;else{const fe=Ve+1+e[Ce+1+e[Pe+1]];Me*=Me,f=Me*Me*(t[fe]*ae+i[fe]*_e+r[fe]*ye)}return 32*(l+u+h+f)}}function bh(n){const t=new Uint8Array(512);for(let i=0;i<512/2;i++)t[i]=i;for(let i=0;i<512/2-1;i++){const r=i+~~(n()*(256-i)),s=t[i];t[i]=t[r],t[r]=s}for(let i=256;i<512;i++)t[i]=t[i-256];return t}const Vi={sizeCX:8,sizeCY:8,sizeCZ:8},u0="village",h0=1,wh=20260913,ft=40,co=ft-1,It=Vi.sizeCX*Oe,ul=Vi.sizeCY*Oe,tt=It/2,Qr=14,ur={x0:20,z0:54,x1:44,z1:74},hr={x0:84,z0:54,x1:108,z1:74},fr={x0:61,z0:82,x1:66,z1:86},Yt={x:64,y:ft+1,z:44},an={x0:61,z0:41,x1:67,z1:47},Vn={x:108,z:92};function lo(n,e,t){const i=Math.max(0,Math.min(1,(t-n)/(e-n)));return i*i*(3-2*i)}function Gn(n,e,t,i=0){return e>=n.x0-i&&e<=n.x1+i&&t>=n.z0-i&&t<=n.z1+i}function f0(n,e=wh){const t=typeof performance<"u"?performance.now():0,i=F=>n.numOf(F),r=i("bedrock"),s=i("stone"),o=i("cobblestone"),a=i("dirt"),c=i("grass"),l=i("sand"),u=i("gravel"),h=i("water"),f=i("log"),d=i("leaves"),g=i("planks"),_=i("glass"),m=i("obsidian"),p=i("glowstone"),A=i("farmland"),E=i("hay_bale"),x=i("pumpkin"),w=i("melon"),b=i("coal_ore"),R=i("iron_ore"),I=i("gold_ore"),M=i("redstone_ore"),S=i("lapis_ore"),C=i("diamond_ore"),U=i("emerald_ore"),k=F=>c0(ea((e^F*2654435769)>>>0)),V=F=>l0(ea((e^F*2654435769)>>>0)),H=k(1),W=k(2),$=k(3),X=k(4),te=k(5),ae=V(6),_e=V(7),ye=F=>36+9*Math.sin(F/31-3.63)+4*X(F/19,.5),Ve=F=>3.2+1.3*te(F/23,7.5),Ce=(F,q)=>{const le=F-tt,T=q-tt,v=Math.hypot(le,T),L=2.2*H(F/41,q/41)+.9*W(F/14,q/14),G=lo(44,62,v)*(7+2.5*($(F/26,q/26)+1));let O=ft+L+G;const ce=1-lo(Qr,Qr+10,v);return O=O+(ft-O)*ce,(Gn(ur,F,q,2)||Gn(hr,F,q,2)||Gn(an,F,q,2)||Gn(fr,F,q,3))&&(O=ft),O},Pe=new Array(It*It);for(let F=0;F<It;F++)for(let q=0;q<It;q++){let le=Ce(q,F),T=c,v=!1;const L=Math.abs(F-ye(q)),D=Ve(q);if(L<D){v=!0;const O=1+Math.floor(2.6*(1-(L/D)**2));le=co-O,T=O>=3&&ii(q,0,F,e)<.5?u:l}else if(L<D+4){const O=(L-D)/4;le=Math.max(ft,Math.min(le,ft+O*3)),L<D+1.5&&(T=l)}const G=Math.max(24,Math.min(ul-20,Math.round(le)));Pe[F*It+q]={h:G,top:T,river:v}}const K=new Z_(Vi),Q=new Uint16Array(Nt),pe=(F,q,le)=>{const T=ae(F/22,q/14,le/22);if(Math.abs(T)>.085)return!1;const v=_e(F/22,q/14,le/22);return Math.abs(v)<.085},Me=(F,q,le,T)=>{const v=ii(F,q,le,e);return v>=.026?s:v<.01?q<T-6?b:s:v<.016?q<34?R:s:v<.0185?q<20?I:s:v<.0225?q<16?M:s:v<.024?q<26?S:s:v<.025?q<13?C:s:q<30?U:s};for(let F=0;F<Vi.sizeCZ;F++)for(let q=0;q<Vi.sizeCX;q++){let le=0;for(let T=0;T<Oe;T++)for(let v=0;v<Oe;v++){const L=Pe[(F*Oe+T)*It+q*Oe+v];le=Math.max(le,L.river?co:L.h)}for(let T=0;T<Vi.sizeCY;T++){const v=T*Oe;if(v>le)break;Q.fill(lt);let L=0;for(let D=0;D<Oe;D++){const G=F*Oe+D;for(let O=0;O<Oe;O++){const ce=q*Oe+O,ie=Pe[G*It+ce],Ee=ie.h;for(let be=0;be<Oe;be++){const ne=v+be;let ue=lt;ne===0||ne===1&&ii(ce,ne,G,e)<.5?ue=r:ne<=Ee-4?ne>=4&&ne<=Ee-7&&pe(ce,ne,G)?ue=lt:ue=Me(ce,ne,G,Ee):ne<Ee?ue=ie.river||ie.top===l?l:a:ne===Ee?ue=ie.top:ie.river&&ne<=co&&(ue=h),ue!==lt&&(Q[$o(O,be,D)]=ue,L++)}}}L>0&&K.getOrCreateChunk(q,T,F).loadBlockIds(Q)}}const fe=(F,q)=>Pe[q*It+F].h,Te=(F,q,le,T)=>{q>=0&&q<ul&&K.setBlock(F,q,le,T)};for(let F=tt-6;F<=tt+6;F++)for(let q=tt-6;q<=tt+6;q++)Math.hypot(F-tt+.5,q-tt+.5)<=5.6&&Te(F,ft,q,o);Te(tt,ft,tt,s);const at=(F,q)=>{const le=Pe[q*It+F];!le.river&&le.top===c&&Te(F,le.h,q,o)};for(let F=an.z1+1;F<tt-5;F++)for(const q of[tt-1,tt])at(q,F);for(let F=tt+6;F<fr.z0;F++)for(const q of[tt-1,tt])at(q,F);for(let F=ur.x1+1;F<tt-5;F++)for(const q of[tt-1,tt])at(F,q);for(let F=tt+6;F<hr.x0;F++)for(const q of[tt-1,tt])at(F,q);for(let F=an.x0;F<=an.x1;F++)for(let q=an.z0;q<=an.z1;q++){const le=(F===an.x0||F===an.x1)&&(q===an.z0||q===an.z1);Te(F,ft,q,le?p:o)}for(let F=Yt.x-2;F<=Yt.x+1;F++)Te(F,Yt.y,Yt.z,m),Te(F,Yt.y+4,Yt.z,m);for(let F=Yt.y+1;F<=Yt.y+3;F++)Te(Yt.x-2,F,Yt.z,m),Te(Yt.x+1,F,Yt.z,m);const P=(F,q)=>{for(let le=F.z0;le<=F.z1;le++){const T=(le-F.z0)%5===2;for(let v=F.x0;v<=F.x1;v++)if(T)Te(v,ft,le,h);else{Te(v,ft,le,A);const L=ii(v,q,le,e);L<.035?Te(v,ft+1,le,x):L<.065&&Te(v,ft+1,le,w)}}for(const[le,T]of[[F.x0,F.z0],[F.x1,F.z0],[F.x0,F.z1],[F.x1,F.z1]])Te(le,ft+1,T,E),Te(le,ft+2,T,E);for(let le=F.x0+6;le<F.x1;le+=6)Te(le,ft+1,F.z0,E),Te(le,ft+1,F.z1,E)};P(ur,11),P(hr,12);{const{x0:F,z0:q,x1:le,z1:T}=fr,v=F+2;for(let L=F;L<=le;L++)for(let D=q;D<=T;D++)for(let G=ft+1;G<=ft+4;G++){if(!(L===F||L===le||D===q||D===T))continue;let ce=g;const ie=q+T>>1;G===ft+2&&(L===F&&D===ie||L===le&&D===ie||D===T&&L===F+2||D===T&&L===le-1)&&(ce=_),D===q&&L===v&&G<=ft+2&&(ce=lt),Te(L,G,D,ce)}for(let L=F;L<=le;L++)for(let D=q;D<=T;D++)Te(L,ft+5,D,g)}{const F=fe(Vn.x,Vn.z)+1;for(let q=0;q<26;q++){const le=Vn.x-q,T=F-q*.55;for(let v=-2;v<=2;v++)for(let L=-1;L<=2;L++)for(let D=-2;D<=2;D++){if(v*v+L*L*1.3+D*D>4.2)continue;const G=Math.floor(T+L);G>=2&&Te(le+v,G,Vn.z+D,lt)}q===25&&Te(le-2,Math.floor(T),Vn.z,p)}}const Je=(F,q)=>{const le=fe(F,q),T=le+4+Math.floor(ii(F,2,q,e)*3);for(let v=le+1;v<=T;v++)Te(F,v,q,f);for(let v=-2;v<=1;v++){const L=T+v,D=v<=-1?2:1;for(let G=-D;G<=D;G++)for(let O=-D;O<=D;O++)G===0&&O===0&&v<=0||D===2&&Math.abs(G)===2&&Math.abs(O)===2&&ii(F+G,L,q+O,e)<.5||K.getBlock(F+G,L,q+O)===lt&&Te(F+G,L,q+O,d)}Te(F,T+2,q,d)},ke=new Set,Ie=(F,q)=>{for(let le=-2;le<=2;le++)for(let T=-2;T<=2;T++)if(ke.has((F+le)*It+q+T))return!0;return!1};for(let F=2;F<It-2;F++)for(let q=2;q<It-2;q++){if(Pe[F*It+q].top!==c)continue;const T=Math.hypot(q-tt,F-tt);if(T<Qr+12||Gn(ur,q,F,3)||Gn(hr,q,F,3)||Gn(an,q,F,3)||Gn(fr,q,F,3)||Math.abs(F-ye(q))<Ve(q)+5||Math.hypot(q-Vn.x,F-Vn.z)<5||Math.abs(q-tt)<=1||Math.abs(F-tt)<=1)continue;const v=.012+.1*lo(40,60,T);ii(q,1,F,e)>=v||Ie(q,F)||(ke.add(q*It+F),Je(q,F))}const xe={x:tt+.5,y:ft+1,z:tt+.5,yaw:0},$e={center:{x:tt,z:tt},plazaRadius:Qr,portal:{...Yt},fields:[ur,hr],house:fr,caveEntrance:{...Vn}},Ae=typeof performance<"u"?performance.now()-t:0;return{world:K,spawn:xe,layout:$e,ms:Ae}}const d0="블록 목록. 아들이 숫자를 바꿔도 돼. hardness = 부수는 데 걸리는 초(맨손). tool = 필요한 도구 종류(없으면 null). drops = 부수면 나오는 아이템(없으면 자기 자신). lightEmit = 빛 세기 0~15 (횃불 14, 발광석·용암 15). lightFilter = 빛을 얼마나 막는지 0~15 (안 적으면 자동: 불투명 블록 15, 물 1, 유리·공기 0. 나뭇잎·얼음은 1로 적어 둠). texture = textures/ 폴더의 파일 이름(확장자 없이). 면마다 다르면 textureTop/textureSide/textureBottom. 광물(에메랄드·청금석·석영·레드스톤·고대 잔해), 흑요석 규칙, 장식·건축 블록은 아들 3차 디테일(2026-09-12) 반영. shape = 특수 형태 블록(계단·문·울타리 등, 모델은 M4에서). fluid = 액체 종류(water 또는 lava): 벽이 없으면 옆으로 퍼지고 아래로 흐른다.",p0=[{id:"air",name:"공기",solid:!1,transparent:!0},{id:"bedrock",name:"기반암",tool:null,lightEmit:0,texture:"bedrock",_note:"세계 맨 아래 한 겹. hardness 가 없으면 부술 수 없는 블록이야"},{id:"stone",name:"돌",hardness:1.5,tool:"pickaxe",drops:"cobblestone",lightEmit:0,texture:"stone"},{id:"cobblestone",name:"조약돌",hardness:2,tool:"pickaxe",lightEmit:0,texture:"cobblestone"},{id:"dirt",name:"흙",hardness:.5,tool:null,lightEmit:0,texture:"dirt"},{id:"farmland",name:"농지",hardness:.6,tool:null,drops:"dirt",lightEmit:0,texture:"farmland",_note:"밭의 갈아 놓은 흙. 마을 터 생성기(M1)가 큰 밭에 깐다. 씨앗 심기·작물은 M4"},{id:"grass",name:"잔디",hardness:.6,tool:null,drops:"dirt",lightEmit:0,textureTop:"grass_top",textureSide:"grass_side",textureBottom:"dirt"},{id:"sand",name:"모래",hardness:.5,tool:null,lightEmit:0,texture:"sand"},{id:"gravel",name:"자갈",hardness:.6,tool:null,lightEmit:0,texture:"gravel"},{id:"log",name:"원목",hardness:2,tool:null,lightEmit:0,textureTop:"log_top",textureSide:"log_side",textureBottom:"log_top"},{id:"planks",name:"판자",hardness:2,tool:null,lightEmit:0,texture:"planks"},{id:"leaves",name:"나뭇잎",hardness:.2,tool:null,transparent:!0,lightEmit:0,lightFilter:1,texture:"leaves",shearDrops:["stick","sapling","apple"],_note:"아들 7차: 가위로 자르면 막대기나 그 나무 묘목이 나오고, 참나무에서는 사과도. 맨손으로 부수면 사라짐 (M4 아이템 드롭)"},{id:"glass",name:"유리",hardness:.3,tool:null,transparent:!0,drops:null,lightEmit:0,texture:"glass"},{id:"water",name:"물",solid:!1,transparent:!0,fluid:"water",lightEmit:0,texture:"water"},{id:"torch",name:"횃불",hardness:0,tool:null,solid:!1,lightEmit:14,texture:"torch"},{id:"coal_ore",name:"석탄 광석",hardness:3,tool:"pickaxe",toolTier:1,drops:"coal",lightEmit:0,texture:"coal_ore"},{id:"iron_ore",name:"철 광석",hardness:3,tool:"pickaxe",toolTier:2,lightEmit:0,texture:"iron_ore"},{id:"gold_ore",name:"금 광석",hardness:3,tool:"pickaxe",toolTier:3,lightEmit:0,texture:"gold_ore"},{id:"diamond_ore",name:"다이아몬드 광석",hardness:3,tool:"pickaxe",toolTier:3,drops:"diamond",lightEmit:0,texture:"diamond_ore"},{id:"netherrack",name:"네더랙",hardness:.4,tool:"pickaxe",lightEmit:0,texture:"netherrack"},{id:"lava",name:"용암",solid:!1,transparent:!1,fluid:"lava",lightEmit:15,damage:4,texture:"lava"},{id:"glowstone",name:"발광석",hardness:.3,tool:null,lightEmit:15,texture:"glowstone"},{id:"snow",name:"눈",hardness:.2,tool:null,lightEmit:0,texture:"snow"},{id:"ice",name:"얼음",hardness:.5,tool:"pickaxe",transparent:!0,drops:null,lightEmit:0,lightFilter:1,texture:"ice",_note:"아들 7차: 물은 눈 바이옴(설원)에서 얼음으로 언다. 설원 원정지 생성기(M3)에서 물 표면을 얼음으로"},{id:"end_stone",name:"엔드 돌",hardness:3,tool:"pickaxe",toolTier:2,lightEmit:0,texture:"end_stone"},{id:"emerald_ore",name:"에메랄드 광석",hardness:3,tool:"pickaxe",toolTier:2,drops:"emerald",lightEmit:0,texture:"emerald_ore"},{id:"lapis_ore",name:"청금석 광석",hardness:3,tool:"pickaxe",toolTier:1,drops:"lapis",lightEmit:0,texture:"lapis_ore",_note:"인챈트에 필요 (아들)"},{id:"nether_quartz_ore",name:"석영 광석",hardness:3,tool:"pickaxe",toolTier:1,drops:"quartz",lightEmit:0,texture:"quartz_ore"},{id:"redstone_ore",name:"레드스톤 광석",hardness:3,tool:"pickaxe",toolTier:2,drops:"redstone",lightEmit:0,texture:"redstone_ore"},{id:"ancient_debris",name:"고대 잔해",hardness:30,tool:"pickaxe",toolTier:3,lightEmit:0,texture:"ancient_debris"},{id:"obsidian",name:"흑요석",hardness:50,tool:"pickaxe",toolTier:3,lightEmit:0,texture:"obsidian",_note:"용암 블록에 물 양동이를 부으면 생성. 다이아 곡괭이(티어3)로만 캔다 (아들)"},{id:"hay_bale",name:"건초 더미",hardness:.5,tool:null,lightEmit:0,texture:"hay_bale"},{id:"bookshelf",name:"책장",hardness:1.5,tool:null,drops:"book",lightEmit:0,texture:"bookshelf"},{id:"enchanting_table",name:"인챈트 테이블",hardness:5,tool:"pickaxe",lightEmit:7,texture:"enchanting_table",release:"v1.1"},{id:"cactus",name:"선인장",hardness:.4,tool:null,damage:1,lightEmit:0,texture:"cactus"},{id:"sugar_cane",name:"사탕수수",hardness:0,tool:null,solid:!1,lightEmit:0,texture:"sugar_cane",_note:"물가에서 자란다"},{id:"pumpkin",name:"호박",hardness:1,tool:null,lightEmit:0,texture:"pumpkin"},{id:"carved_pumpkin",name:"조각된 호박",hardness:1,tool:null,lightEmit:0,texture:"carved_pumpkin"},{id:"jack_o_lantern",name:"잭오랜턴",hardness:1,tool:null,lightEmit:15,texture:"jack_o_lantern"},{id:"melon",name:"수박",hardness:1,tool:null,lightEmit:0,texture:"melon"},{id:"iron_block",name:"철 블록",hardness:5,tool:"pickaxe",toolTier:1,lightEmit:0,texture:"iron_block"},{id:"gold_block",name:"금 블록",hardness:3,tool:"pickaxe",toolTier:2,lightEmit:0,texture:"gold_block"},{id:"quartz_block",name:"석영 블록",hardness:.8,tool:"pickaxe",lightEmit:0,texture:"quartz_block"},{id:"netherite_block",name:"네더라이트 블록",hardness:50,tool:"pickaxe",toolTier:3,lightEmit:0,texture:"netherite_block"},{id:"emerald_block",name:"에메랄드 블록",hardness:5,tool:"pickaxe",toolTier:2,lightEmit:0,texture:"emerald_block"},{id:"diamond_block",name:"다이아몬드 블록",hardness:5,tool:"pickaxe",toolTier:2,lightEmit:0,texture:"diamond_block"},{id:"oak_stairs",name:"계단",hardness:2,tool:null,lightEmit:0,texture:"planks",shape:"stairs"},{id:"oak_door",name:"문",hardness:3,tool:null,lightEmit:0,texture:"door",shape:"door"},{id:"oak_trapdoor",name:"다락문",hardness:3,tool:null,lightEmit:0,texture:"trapdoor",shape:"trapdoor"},{id:"oak_fence",name:"울타리",hardness:2,tool:null,lightEmit:0,texture:"planks",shape:"fence"},{id:"sign",name:"표지판",hardness:1,tool:null,solid:!1,lightEmit:0,texture:"sign",shape:"sign"},{id:"bed",name:"침대",hardness:.2,tool:null,lightEmit:0,texture:"bed",shape:"bed",_note:"네더·엔드에서 클릭 시 폭발"},{id:"chest",name:"상자",hardness:2.5,tool:null,lightEmit:0,texture:"chest",shape:"chest"},{id:"furnace",name:"화로",hardness:3.5,tool:"pickaxe",lightEmit:0,texture:"furnace"},{id:"brewing_stand",name:"양조기",hardness:.5,tool:null,lightEmit:1,texture:"brewing_stand"},{id:"soul_sand",name:"영혼 모래",hardness:.5,tool:null,lightEmit:0,texture:"soul_sand"},{id:"warped_fungus",name:"뒤틀린 균",hardness:0,tool:null,solid:!1,lightEmit:0,texture:"warped_fungus"},{id:"wool",name:"양털",hardness:.8,tool:null,lightEmit:0,texture:"wool",dyeable:!0,_note:"16색 염색 가능. 텍스처는 wool_<color>"},{id:"flower",name:"꽃",hardness:0,tool:null,solid:!1,lightEmit:0,texture:"flower",variants:["poppy","dandelion","cornflower","allium","tulip_pink","oxeye_daisy"],_note:"부수면 색 염료 3개"},{id:"rail",name:"철도",hardness:.7,tool:null,solid:!1,lightEmit:0,texture:"rail",release:"v1.1"},{id:"mob_spawner",name:"몹 스포너",hardness:5,tool:"pickaxe",drops:null,lightEmit:0,texture:"spawner",release:"v1.1",_note:"캐면 경험치 15–43"},{id:"water_deep",name:"깊은 물",solid:!1,transparent:!0,fluid:"water",lightEmit:0,texture:"water",_note:"심해 — 발광 오징어 서식"},{id:"dried_ghast",name:"마른 가스트",hardness:.5,tool:null,lightEmit:0,texture:"dried_ghast",release:"v1.2",_note:"네더 바닥에 있다. 캐서 물에 불리면 해피 가스트가 된다 (아들 6차). 해피 가스트 탑승은 v1.2"}],m0={_comment:d0,blocks:p0},g0=W_(m0);const rc="180",_0=0,hl=1,v0=2,Th=1,x0=2,In=3,Bn=0,Ft=1,_n=2,qn=0,Wi=1,fl=2,dl=3,pl=4,A0=5,di=100,E0=101,S0=102,y0=103,M0=104,b0=200,w0=201,T0=202,R0=203,ta=204,na=205,C0=206,P0=207,D0=208,I0=209,U0=210,L0=211,N0=212,k0=213,F0=214,ia=0,ra=1,sa=2,ji=3,oa=4,aa=5,ca=6,la=7,Rh=0,O0=1,B0=2,Qn=0,z0=1,V0=2,G0=3,H0=4,W0=5,X0=6,Y0=7,Ch=300,Ki=301,qi=302,ua=303,ha=304,Ws=306,Dr=1e3,mi=1001,fa=1002,Vt=1003,Z0=1004,Ar=1005,xn=1006,uo=1007,gi=1008,yn=1009,Ph=1010,Dh=1011,Ir=1012,sc=1013,Ai=1014,kn=1015,Or=1016,oc=1017,ac=1018,Ur=1020,Ih=35902,Uh=35899,Lh=1021,Nh=1022,sn=1023,Lr=1026,Nr=1027,kh=1028,cc=1029,Fh=1030,lc=1031,uc=1033,ys=33776,Ms=33777,bs=33778,ws=33779,da=35840,pa=35841,ma=35842,ga=35843,_a=36196,va=37492,xa=37496,Aa=37808,Ea=37809,Sa=37810,ya=37811,Ma=37812,ba=37813,wa=37814,Ta=37815,Ra=37816,Ca=37817,Pa=37818,Da=37819,Ia=37820,Ua=37821,La=36492,Na=36494,ka=36495,Fa=36283,Oa=36284,Ba=36285,za=36286,j0=3200,K0=3201,q0=0,Q0=1,Ln="",Kt="srgb",Qi="srgb-linear",Us="linear",rt="srgb",wi=7680,ml=519,J0=512,$0=513,ev=514,Oh=515,tv=516,nv=517,iv=518,rv=519,gl=35044,Ls="300 es",An=2e3,Ns=2001;class nr{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const Rt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let _l=1234567;const Tr=Math.PI/180,kr=180/Math.PI;function ir(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Rt[n&255]+Rt[n>>8&255]+Rt[n>>16&255]+Rt[n>>24&255]+"-"+Rt[e&255]+Rt[e>>8&255]+"-"+Rt[e>>16&15|64]+Rt[e>>24&255]+"-"+Rt[t&63|128]+Rt[t>>8&255]+"-"+Rt[t>>16&255]+Rt[t>>24&255]+Rt[i&255]+Rt[i>>8&255]+Rt[i>>16&255]+Rt[i>>24&255]).toLowerCase()}function Ze(n,e,t){return Math.max(e,Math.min(t,n))}function hc(n,e){return(n%e+e)%e}function sv(n,e,t,i,r){return i+(n-e)*(r-i)/(t-e)}function ov(n,e,t){return n!==e?(t-n)/(e-n):0}function Rr(n,e,t){return(1-t)*n+t*e}function av(n,e,t,i){return Rr(n,e,1-Math.exp(-t*i))}function cv(n,e=1){return e-Math.abs(hc(n,e*2)-e)}function lv(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function uv(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function hv(n,e){return n+Math.floor(Math.random()*(e-n+1))}function fv(n,e){return n+Math.random()*(e-n)}function dv(n){return n*(.5-Math.random())}function pv(n){n!==void 0&&(_l=n);let e=_l+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function mv(n){return n*Tr}function gv(n){return n*kr}function _v(n){return(n&n-1)===0&&n!==0}function vv(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function xv(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Av(n,e,t,i,r){const s=Math.cos,o=Math.sin,a=s(t/2),c=o(t/2),l=s((e+i)/2),u=o((e+i)/2),h=s((e-i)/2),f=o((e-i)/2),d=s((i-e)/2),g=o((i-e)/2);switch(r){case"XYX":n.set(a*u,c*h,c*f,a*l);break;case"YZY":n.set(c*f,a*u,c*h,a*l);break;case"ZXZ":n.set(c*h,c*f,a*u,a*l);break;case"XZX":n.set(a*u,c*g,c*d,a*l);break;case"YXY":n.set(c*d,a*u,c*g,a*l);break;case"ZYZ":n.set(c*g,c*d,a*u,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function zi(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Ut(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Ev={DEG2RAD:Tr,RAD2DEG:kr,generateUUID:ir,clamp:Ze,euclideanModulo:hc,mapLinear:sv,inverseLerp:ov,lerp:Rr,damp:av,pingpong:cv,smoothstep:lv,smootherstep:uv,randInt:hv,randFloat:fv,randFloatSpread:dv,seededRandom:pv,degToRad:mv,radToDeg:gv,isPowerOfTwo:_v,ceilPowerOfTwo:vv,floorPowerOfTwo:xv,setQuaternionFromProperEuler:Av,normalize:Ut,denormalize:zi};class st{constructor(e=0,t=0){st.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ze(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Br{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,a){let c=i[r+0],l=i[r+1],u=i[r+2],h=i[r+3];const f=s[o+0],d=s[o+1],g=s[o+2],_=s[o+3];if(a===0){e[t+0]=c,e[t+1]=l,e[t+2]=u,e[t+3]=h;return}if(a===1){e[t+0]=f,e[t+1]=d,e[t+2]=g,e[t+3]=_;return}if(h!==_||c!==f||l!==d||u!==g){let m=1-a;const p=c*f+l*d+u*g+h*_,A=p>=0?1:-1,E=1-p*p;if(E>Number.EPSILON){const w=Math.sqrt(E),b=Math.atan2(w,p*A);m=Math.sin(m*b)/w,a=Math.sin(a*b)/w}const x=a*A;if(c=c*m+f*x,l=l*m+d*x,u=u*m+g*x,h=h*m+_*x,m===1-a){const w=1/Math.sqrt(c*c+l*l+u*u+h*h);c*=w,l*=w,u*=w,h*=w}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,r,s,o){const a=i[r],c=i[r+1],l=i[r+2],u=i[r+3],h=s[o],f=s[o+1],d=s[o+2],g=s[o+3];return e[t]=a*g+u*h+c*d-l*f,e[t+1]=c*g+u*f+l*h-a*d,e[t+2]=l*g+u*d+a*f-c*h,e[t+3]=u*g-a*h-c*f-l*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(i/2),u=a(r/2),h=a(s/2),f=c(i/2),d=c(r/2),g=c(s/2);switch(o){case"XYZ":this._x=f*u*h+l*d*g,this._y=l*d*h-f*u*g,this._z=l*u*g+f*d*h,this._w=l*u*h-f*d*g;break;case"YXZ":this._x=f*u*h+l*d*g,this._y=l*d*h-f*u*g,this._z=l*u*g-f*d*h,this._w=l*u*h+f*d*g;break;case"ZXY":this._x=f*u*h-l*d*g,this._y=l*d*h+f*u*g,this._z=l*u*g+f*d*h,this._w=l*u*h-f*d*g;break;case"ZYX":this._x=f*u*h-l*d*g,this._y=l*d*h+f*u*g,this._z=l*u*g-f*d*h,this._w=l*u*h+f*d*g;break;case"YZX":this._x=f*u*h+l*d*g,this._y=l*d*h+f*u*g,this._z=l*u*g-f*d*h,this._w=l*u*h-f*d*g;break;case"XZY":this._x=f*u*h-l*d*g,this._y=l*d*h-f*u*g,this._z=l*u*g+f*d*h,this._w=l*u*h+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],c=t[9],l=t[2],u=t[6],h=t[10],f=i+a+h;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(u-c)*d,this._y=(s-l)*d,this._z=(o-r)*d}else if(i>a&&i>h){const d=2*Math.sqrt(1+i-a-h);this._w=(u-c)/d,this._x=.25*d,this._y=(r+o)/d,this._z=(s+l)/d}else if(a>h){const d=2*Math.sqrt(1+a-i-h);this._w=(s-l)/d,this._x=(r+o)/d,this._y=.25*d,this._z=(c+u)/d}else{const d=2*Math.sqrt(1+h-i-a);this._w=(o-r)/d,this._x=(s+l)/d,this._y=(c+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ze(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,c=t._y,l=t._z,u=t._w;return this._x=i*u+o*a+r*l-s*c,this._y=r*u+o*c+s*a-i*l,this._z=s*u+o*l+i*c-r*a,this._w=o*u-i*a-r*c-s*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const c=1-a*a;if(c<=Number.EPSILON){const d=1-t;return this._w=d*o+t*this._w,this._x=d*i+t*this._x,this._y=d*r+t*this._y,this._z=d*s+t*this._z,this.normalize(),this}const l=Math.sqrt(c),u=Math.atan2(l,a),h=Math.sin((1-t)*u)/l,f=Math.sin(t*u)/l;return this._w=o*h+this._w*f,this._x=i*h+this._x*f,this._y=r*h+this._y*f,this._z=s*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class Y{constructor(e=0,t=0,i=0){Y.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(vl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(vl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*r-a*i),u=2*(a*t-s*r),h=2*(s*i-o*t);return this.x=t+c*l+o*h-a*u,this.y=i+c*u+a*l-s*h,this.z=r+c*h+s*u-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this.z=Ze(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this.z=Ze(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,c=t.z;return this.x=r*c-s*a,this.y=s*o-i*c,this.z=i*a-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return ho.copy(this).projectOnVector(e),this.sub(ho)}reflect(e){return this.sub(ho.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ze(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ho=new Y,vl=new Br;class We{constructor(e,t,i,r,s,o,a,c,l){We.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,c,l)}set(e,t,i,r,s,o,a,c,l){const u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=t,u[4]=s,u[5]=c,u[6]=i,u[7]=o,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],c=i[6],l=i[1],u=i[4],h=i[7],f=i[2],d=i[5],g=i[8],_=r[0],m=r[3],p=r[6],A=r[1],E=r[4],x=r[7],w=r[2],b=r[5],R=r[8];return s[0]=o*_+a*A+c*w,s[3]=o*m+a*E+c*b,s[6]=o*p+a*x+c*R,s[1]=l*_+u*A+h*w,s[4]=l*m+u*E+h*b,s[7]=l*p+u*x+h*R,s[2]=f*_+d*A+g*w,s[5]=f*m+d*E+g*b,s[8]=f*p+d*x+g*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8];return t*o*u-t*a*l-i*s*u+i*a*c+r*s*l-r*o*c}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],h=u*o-a*l,f=a*c-u*s,d=l*s-o*c,g=t*h+i*f+r*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=h*_,e[1]=(r*l-u*i)*_,e[2]=(a*i-r*o)*_,e[3]=f*_,e[4]=(u*t-r*c)*_,e[5]=(r*s-a*t)*_,e[6]=d*_,e[7]=(i*c-l*t)*_,e[8]=(o*t-i*s)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){const c=Math.cos(s),l=Math.sin(s);return this.set(i*c,i*l,-i*(c*o+l*a)+o+e,-r*l,r*c,-r*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(fo.makeScale(e,t)),this}rotate(e){return this.premultiply(fo.makeRotation(-e)),this}translate(e,t){return this.premultiply(fo.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const fo=new We;function Bh(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function ks(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Sv(){const n=ks("canvas");return n.style.display="block",n}const xl={};function Fr(n){n in xl||(xl[n]=!0,console.warn(n))}function yv(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}const Al=new We().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),El=new We().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Mv(){const n={enabled:!0,workingColorSpace:Qi,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===rt&&(r.r=Fn(r.r),r.g=Fn(r.g),r.b=Fn(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===rt&&(r.r=Xi(r.r),r.g=Xi(r.g),r.b=Xi(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Ln?Us:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Fr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Fr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Qi]:{primaries:e,whitePoint:i,transfer:Us,toXYZ:Al,fromXYZ:El,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Kt},outputColorSpaceConfig:{drawingBufferColorSpace:Kt}},[Kt]:{primaries:e,whitePoint:i,transfer:rt,toXYZ:Al,fromXYZ:El,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Kt}}}),n}const Ke=Mv();function Fn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Xi(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Ti;class bv{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Ti===void 0&&(Ti=ks("canvas")),Ti.width=e.width,Ti.height=e.height;const r=Ti.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=Ti}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ks("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Fn(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Fn(t[i]/255)*255):t[i]=Fn(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let wv=0;class fc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:wv++}),this.uuid=ir(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(po(r[o].image)):s.push(po(r[o]))}else s=po(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function po(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?bv.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Tv=0;const mo=new Y;class Ot extends nr{constructor(e=Ot.DEFAULT_IMAGE,t=Ot.DEFAULT_MAPPING,i=mi,r=mi,s=xn,o=gi,a=sn,c=yn,l=Ot.DEFAULT_ANISOTROPY,u=Ln){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Tv++}),this.uuid=ir(),this.name="",this.source=new fc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new st(0,0),this.repeat=new st(1,1),this.center=new st(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new We,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(mo).x}get height(){return this.source.getSize(mo).y}get depth(){return this.source.getSize(mo).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ch)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Dr:e.x=e.x-Math.floor(e.x);break;case mi:e.x=e.x<0?0:1;break;case fa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Dr:e.y=e.y-Math.floor(e.y);break;case mi:e.y=e.y<0?0:1;break;case fa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ot.DEFAULT_IMAGE=null;Ot.DEFAULT_MAPPING=Ch;Ot.DEFAULT_ANISOTROPY=1;class xt{constructor(e=0,t=0,i=0,r=1){xt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const c=e.elements,l=c[0],u=c[4],h=c[8],f=c[1],d=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(u-f)<.01&&Math.abs(h-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+f)<.1&&Math.abs(h+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+d+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const E=(l+1)/2,x=(d+1)/2,w=(p+1)/2,b=(u+f)/4,R=(h+_)/4,I=(g+m)/4;return E>x&&E>w?E<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(E),r=b/i,s=R/i):x>w?x<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(x),i=b/r,s=I/r):w<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(w),i=R/s,r=I/s),this.set(i,r,s,t),this}let A=Math.sqrt((m-g)*(m-g)+(h-_)*(h-_)+(f-u)*(f-u));return Math.abs(A)<.001&&(A=1),this.x=(m-g)/A,this.y=(h-_)/A,this.z=(f-u)/A,this.w=Math.acos((l+d+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this.z=Ze(this.z,e.z,t.z),this.w=Ze(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this.z=Ze(this.z,e,t),this.w=Ze(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Rv extends nr{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:xn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new xt(0,0,e,t),this.scissorTest=!1,this.viewport=new xt(0,0,e,t);const r={width:e,height:t,depth:i.depth},s=new Ot(r);this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:xn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isArrayTexture=this.textures[r].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new fc(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ei extends Rv{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class dc extends Ot{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Vt,this.minFilter=Vt,this.wrapR=mi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Cv extends Ot{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Vt,this.minFilter=Vt,this.wrapR=mi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class zr{constructor(e=new Y(1/0,1/0,1/0),t=new Y(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(cn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(cn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=cn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,cn):cn.fromBufferAttribute(s,o),cn.applyMatrix4(e.matrixWorld),this.expandByPoint(cn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Jr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Jr.copy(i.boundingBox)),Jr.applyMatrix4(e.matrixWorld),this.union(Jr)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,cn),cn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(dr),$r.subVectors(this.max,dr),Ri.subVectors(e.a,dr),Ci.subVectors(e.b,dr),Pi.subVectors(e.c,dr),Hn.subVectors(Ci,Ri),Wn.subVectors(Pi,Ci),ri.subVectors(Ri,Pi);let t=[0,-Hn.z,Hn.y,0,-Wn.z,Wn.y,0,-ri.z,ri.y,Hn.z,0,-Hn.x,Wn.z,0,-Wn.x,ri.z,0,-ri.x,-Hn.y,Hn.x,0,-Wn.y,Wn.x,0,-ri.y,ri.x,0];return!go(t,Ri,Ci,Pi,$r)||(t=[1,0,0,0,1,0,0,0,1],!go(t,Ri,Ci,Pi,$r))?!1:(es.crossVectors(Hn,Wn),t=[es.x,es.y,es.z],go(t,Ri,Ci,Pi,$r))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,cn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(cn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Tn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Tn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Tn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Tn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Tn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Tn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Tn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Tn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Tn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Tn=[new Y,new Y,new Y,new Y,new Y,new Y,new Y,new Y],cn=new Y,Jr=new zr,Ri=new Y,Ci=new Y,Pi=new Y,Hn=new Y,Wn=new Y,ri=new Y,dr=new Y,$r=new Y,es=new Y,si=new Y;function go(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){si.fromArray(n,s);const a=r.x*Math.abs(si.x)+r.y*Math.abs(si.y)+r.z*Math.abs(si.z),c=e.dot(si),l=t.dot(si),u=i.dot(si);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return!1}return!0}const Pv=new zr,pr=new Y,_o=new Y;class Xs{constructor(e=new Y,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Pv.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;pr.subVectors(e,this.center);const t=pr.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(pr,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(_o.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(pr.copy(e.center).add(_o)),this.expandByPoint(pr.copy(e.center).sub(_o))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Rn=new Y,vo=new Y,ts=new Y,Xn=new Y,xo=new Y,ns=new Y,Ao=new Y;class Dv{constructor(e=new Y,t=new Y(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Rn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Rn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Rn.copy(this.origin).addScaledVector(this.direction,t),Rn.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){vo.copy(e).add(t).multiplyScalar(.5),ts.copy(t).sub(e).normalize(),Xn.copy(this.origin).sub(vo);const s=e.distanceTo(t)*.5,o=-this.direction.dot(ts),a=Xn.dot(this.direction),c=-Xn.dot(ts),l=Xn.lengthSq(),u=Math.abs(1-o*o);let h,f,d,g;if(u>0)if(h=o*c-a,f=o*a-c,g=s*u,h>=0)if(f>=-g)if(f<=g){const _=1/u;h*=_,f*=_,d=h*(h+o*f+2*a)+f*(o*h+f+2*c)+l}else f=s,h=Math.max(0,-(o*f+a)),d=-h*h+f*(f+2*c)+l;else f=-s,h=Math.max(0,-(o*f+a)),d=-h*h+f*(f+2*c)+l;else f<=-g?(h=Math.max(0,-(-o*s+a)),f=h>0?-s:Math.min(Math.max(-s,-c),s),d=-h*h+f*(f+2*c)+l):f<=g?(h=0,f=Math.min(Math.max(-s,-c),s),d=f*(f+2*c)+l):(h=Math.max(0,-(o*s+a)),f=h>0?s:Math.min(Math.max(-s,-c),s),d=-h*h+f*(f+2*c)+l);else f=o>0?-s:s,h=Math.max(0,-(o*f+a)),d=-h*h+f*(f+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(vo).addScaledVector(ts,f),d}intersectSphere(e,t){Rn.subVectors(e.center,this.origin);const i=Rn.dot(this.direction),r=Rn.dot(Rn)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,c=i+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,c;const l=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,f=this.origin;return l>=0?(i=(e.min.x-f.x)*l,r=(e.max.x-f.x)*l):(i=(e.max.x-f.x)*l,r=(e.min.x-f.x)*l),u>=0?(s=(e.min.y-f.y)*u,o=(e.max.y-f.y)*u):(s=(e.max.y-f.y)*u,o=(e.min.y-f.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(e.min.z-f.z)*h,c=(e.max.z-f.z)*h):(a=(e.max.z-f.z)*h,c=(e.min.z-f.z)*h),i>c||a>r)||((a>i||i!==i)&&(i=a),(c<r||r!==r)&&(r=c),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,Rn)!==null}intersectTriangle(e,t,i,r,s){xo.subVectors(t,e),ns.subVectors(i,e),Ao.crossVectors(xo,ns);let o=this.direction.dot(Ao),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Xn.subVectors(this.origin,e);const c=a*this.direction.dot(ns.crossVectors(Xn,ns));if(c<0)return null;const l=a*this.direction.dot(xo.cross(Xn));if(l<0||c+l>o)return null;const u=-a*Xn.dot(Ao);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class yt{constructor(e,t,i,r,s,o,a,c,l,u,h,f,d,g,_,m){yt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,c,l,u,h,f,d,g,_,m)}set(e,t,i,r,s,o,a,c,l,u,h,f,d,g,_,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=r,p[1]=s,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=u,p[10]=h,p[14]=f,p[3]=d,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new yt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/Di.setFromMatrixColumn(e,0).length(),s=1/Di.setFromMatrixColumn(e,1).length(),o=1/Di.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),c=Math.cos(r),l=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const f=o*u,d=o*h,g=a*u,_=a*h;t[0]=c*u,t[4]=-c*h,t[8]=l,t[1]=d+g*l,t[5]=f-_*l,t[9]=-a*c,t[2]=_-f*l,t[6]=g+d*l,t[10]=o*c}else if(e.order==="YXZ"){const f=c*u,d=c*h,g=l*u,_=l*h;t[0]=f+_*a,t[4]=g*a-d,t[8]=o*l,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=d*a-g,t[6]=_+f*a,t[10]=o*c}else if(e.order==="ZXY"){const f=c*u,d=c*h,g=l*u,_=l*h;t[0]=f-_*a,t[4]=-o*h,t[8]=g+d*a,t[1]=d+g*a,t[5]=o*u,t[9]=_-f*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){const f=o*u,d=o*h,g=a*u,_=a*h;t[0]=c*u,t[4]=g*l-d,t[8]=f*l+_,t[1]=c*h,t[5]=_*l+f,t[9]=d*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){const f=o*c,d=o*l,g=a*c,_=a*l;t[0]=c*u,t[4]=_-f*h,t[8]=g*h+d,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-l*u,t[6]=d*h+g,t[10]=f-_*h}else if(e.order==="XZY"){const f=o*c,d=o*l,g=a*c,_=a*l;t[0]=c*u,t[4]=-h,t[8]=l*u,t[1]=f*h+_,t[5]=o*u,t[9]=d*h-g,t[2]=g*h-d,t[6]=a*u,t[10]=_*h+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Iv,e,Uv)}lookAt(e,t,i){const r=this.elements;return Zt.subVectors(e,t),Zt.lengthSq()===0&&(Zt.z=1),Zt.normalize(),Yn.crossVectors(i,Zt),Yn.lengthSq()===0&&(Math.abs(i.z)===1?Zt.x+=1e-4:Zt.z+=1e-4,Zt.normalize(),Yn.crossVectors(i,Zt)),Yn.normalize(),is.crossVectors(Zt,Yn),r[0]=Yn.x,r[4]=is.x,r[8]=Zt.x,r[1]=Yn.y,r[5]=is.y,r[9]=Zt.y,r[2]=Yn.z,r[6]=is.z,r[10]=Zt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],c=i[8],l=i[12],u=i[1],h=i[5],f=i[9],d=i[13],g=i[2],_=i[6],m=i[10],p=i[14],A=i[3],E=i[7],x=i[11],w=i[15],b=r[0],R=r[4],I=r[8],M=r[12],S=r[1],C=r[5],U=r[9],k=r[13],V=r[2],H=r[6],W=r[10],$=r[14],X=r[3],te=r[7],ae=r[11],_e=r[15];return s[0]=o*b+a*S+c*V+l*X,s[4]=o*R+a*C+c*H+l*te,s[8]=o*I+a*U+c*W+l*ae,s[12]=o*M+a*k+c*$+l*_e,s[1]=u*b+h*S+f*V+d*X,s[5]=u*R+h*C+f*H+d*te,s[9]=u*I+h*U+f*W+d*ae,s[13]=u*M+h*k+f*$+d*_e,s[2]=g*b+_*S+m*V+p*X,s[6]=g*R+_*C+m*H+p*te,s[10]=g*I+_*U+m*W+p*ae,s[14]=g*M+_*k+m*$+p*_e,s[3]=A*b+E*S+x*V+w*X,s[7]=A*R+E*C+x*H+w*te,s[11]=A*I+E*U+x*W+w*ae,s[15]=A*M+E*k+x*$+w*_e,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],c=e[9],l=e[13],u=e[2],h=e[6],f=e[10],d=e[14],g=e[3],_=e[7],m=e[11],p=e[15];return g*(+s*c*h-r*l*h-s*a*f+i*l*f+r*a*d-i*c*d)+_*(+t*c*d-t*l*f+s*o*f-r*o*d+r*l*u-s*c*u)+m*(+t*l*h-t*a*d-s*o*h+i*o*d+s*a*u-i*l*u)+p*(-r*a*u-t*c*h+t*a*f+r*o*h-i*o*f+i*c*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],h=e[9],f=e[10],d=e[11],g=e[12],_=e[13],m=e[14],p=e[15],A=h*m*l-_*f*l+_*c*d-a*m*d-h*c*p+a*f*p,E=g*f*l-u*m*l-g*c*d+o*m*d+u*c*p-o*f*p,x=u*_*l-g*h*l+g*a*d-o*_*d-u*a*p+o*h*p,w=g*h*c-u*_*c-g*a*f+o*_*f+u*a*m-o*h*m,b=t*A+i*E+r*x+s*w;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/b;return e[0]=A*R,e[1]=(_*f*s-h*m*s-_*r*d+i*m*d+h*r*p-i*f*p)*R,e[2]=(a*m*s-_*c*s+_*r*l-i*m*l-a*r*p+i*c*p)*R,e[3]=(h*c*s-a*f*s-h*r*l+i*f*l+a*r*d-i*c*d)*R,e[4]=E*R,e[5]=(u*m*s-g*f*s+g*r*d-t*m*d-u*r*p+t*f*p)*R,e[6]=(g*c*s-o*m*s-g*r*l+t*m*l+o*r*p-t*c*p)*R,e[7]=(o*f*s-u*c*s+u*r*l-t*f*l-o*r*d+t*c*d)*R,e[8]=x*R,e[9]=(g*h*s-u*_*s-g*i*d+t*_*d+u*i*p-t*h*p)*R,e[10]=(o*_*s-g*a*s+g*i*l-t*_*l-o*i*p+t*a*p)*R,e[11]=(u*a*s-o*h*s-u*i*l+t*h*l+o*i*d-t*a*d)*R,e[12]=w*R,e[13]=(u*_*r-g*h*r+g*i*f-t*_*f-u*i*m+t*h*m)*R,e[14]=(g*a*r-o*_*r-g*i*c+t*_*c+o*i*m-t*a*m)*R,e[15]=(o*h*r-u*a*r+u*i*c-t*h*c-o*i*f+t*a*f)*R,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,c=e.z,l=s*o,u=s*a;return this.set(l*o+i,l*a-r*c,l*c+r*a,0,l*a+r*c,u*a+i,u*c-r*o,0,l*c-r*a,u*c+r*o,s*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,o=t._y,a=t._z,c=t._w,l=s+s,u=o+o,h=a+a,f=s*l,d=s*u,g=s*h,_=o*u,m=o*h,p=a*h,A=c*l,E=c*u,x=c*h,w=i.x,b=i.y,R=i.z;return r[0]=(1-(_+p))*w,r[1]=(d+x)*w,r[2]=(g-E)*w,r[3]=0,r[4]=(d-x)*b,r[5]=(1-(f+p))*b,r[6]=(m+A)*b,r[7]=0,r[8]=(g+E)*R,r[9]=(m-A)*R,r[10]=(1-(f+_))*R,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let s=Di.set(r[0],r[1],r[2]).length();const o=Di.set(r[4],r[5],r[6]).length(),a=Di.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],ln.copy(this);const l=1/s,u=1/o,h=1/a;return ln.elements[0]*=l,ln.elements[1]*=l,ln.elements[2]*=l,ln.elements[4]*=u,ln.elements[5]*=u,ln.elements[6]*=u,ln.elements[8]*=h,ln.elements[9]*=h,ln.elements[10]*=h,t.setFromRotationMatrix(ln),i.x=s,i.y=o,i.z=a,this}makePerspective(e,t,i,r,s,o,a=An,c=!1){const l=this.elements,u=2*s/(t-e),h=2*s/(i-r),f=(t+e)/(t-e),d=(i+r)/(i-r);let g,_;if(c)g=s/(o-s),_=o*s/(o-s);else if(a===An)g=-(o+s)/(o-s),_=-2*o*s/(o-s);else if(a===Ns)g=-o/(o-s),_=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,o,a=An,c=!1){const l=this.elements,u=2/(t-e),h=2/(i-r),f=-(t+e)/(t-e),d=-(i+r)/(i-r);let g,_;if(c)g=1/(o-s),_=o/(o-s);else if(a===An)g=-2/(o-s),_=-(o+s)/(o-s);else if(a===Ns)g=-1/(o-s),_=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=h,l[9]=0,l[13]=d,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Di=new Y,ln=new yt,Iv=new Y(0,0,0),Uv=new Y(1,1,1),Yn=new Y,is=new Y,Zt=new Y,Sl=new yt,yl=new Br;class zn{constructor(e=0,t=0,i=0,r=zn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],c=r[1],l=r[5],u=r[9],h=r[2],f=r[6],d=r[10];switch(t){case"XYZ":this._y=Math.asin(Ze(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ze(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(Ze(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,d),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Ze(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Ze(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Sl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Sl,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return yl.setFromEuler(this),this.setFromQuaternion(yl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}zn.DEFAULT_ORDER="XYZ";class zh{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Lv=0;const Ml=new Y,Ii=new Br,Cn=new yt,rs=new Y,mr=new Y,Nv=new Y,kv=new Br,bl=new Y(1,0,0),wl=new Y(0,1,0),Tl=new Y(0,0,1),Rl={type:"added"},Fv={type:"removed"},Ui={type:"childadded",child:null},Eo={type:"childremoved",child:null};class Qt extends nr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Lv++}),this.uuid=ir(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Qt.DEFAULT_UP.clone();const e=new Y,t=new zn,i=new Br,r=new Y(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new yt},normalMatrix:{value:new We}}),this.matrix=new yt,this.matrixWorld=new yt,this.matrixAutoUpdate=Qt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Qt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new zh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ii.setFromAxisAngle(e,t),this.quaternion.multiply(Ii),this}rotateOnWorldAxis(e,t){return Ii.setFromAxisAngle(e,t),this.quaternion.premultiply(Ii),this}rotateX(e){return this.rotateOnAxis(bl,e)}rotateY(e){return this.rotateOnAxis(wl,e)}rotateZ(e){return this.rotateOnAxis(Tl,e)}translateOnAxis(e,t){return Ml.copy(e).applyQuaternion(this.quaternion),this.position.add(Ml.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(bl,e)}translateY(e){return this.translateOnAxis(wl,e)}translateZ(e){return this.translateOnAxis(Tl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Cn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?rs.copy(e):rs.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),mr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Cn.lookAt(mr,rs,this.up):Cn.lookAt(rs,mr,this.up),this.quaternion.setFromRotationMatrix(Cn),r&&(Cn.extractRotation(r.matrixWorld),Ii.setFromRotationMatrix(Cn),this.quaternion.premultiply(Ii.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Rl),Ui.child=e,this.dispatchEvent(Ui),Ui.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Fv),Eo.child=e,this.dispatchEvent(Eo),Eo.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Cn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Cn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Cn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Rl),Ui.child=e,this.dispatchEvent(Ui),Ui.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(mr,e,Nv),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(mr,kv,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const h=c[l];s(e.shapes,h)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(s(e.materials,this.material[c]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];r.animations.push(s(e.animations,c))}}if(t){const a=o(e.geometries),c=o(e.materials),l=o(e.textures),u=o(e.images),h=o(e.shapes),f=o(e.skeletons),d=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),f.length>0&&(i.skeletons=f),d.length>0&&(i.animations=d),g.length>0&&(i.nodes=g)}return i.object=r,i;function o(a){const c=[];for(const l in a){const u=a[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Qt.DEFAULT_UP=new Y(0,1,0);Qt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Qt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const un=new Y,Pn=new Y,So=new Y,Dn=new Y,Li=new Y,Ni=new Y,Cl=new Y,yo=new Y,Mo=new Y,bo=new Y,wo=new xt,To=new xt,Ro=new xt;class hn{constructor(e=new Y,t=new Y,i=new Y){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),un.subVectors(e,t),r.cross(un);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){un.subVectors(r,t),Pn.subVectors(i,t),So.subVectors(e,t);const o=un.dot(un),a=un.dot(Pn),c=un.dot(So),l=Pn.dot(Pn),u=Pn.dot(So),h=o*l-a*a;if(h===0)return s.set(0,0,0),null;const f=1/h,d=(l*c-a*u)*f,g=(o*u-a*c)*f;return s.set(1-d-g,g,d)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,Dn)===null?!1:Dn.x>=0&&Dn.y>=0&&Dn.x+Dn.y<=1}static getInterpolation(e,t,i,r,s,o,a,c){return this.getBarycoord(e,t,i,r,Dn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,Dn.x),c.addScaledVector(o,Dn.y),c.addScaledVector(a,Dn.z),c)}static getInterpolatedAttribute(e,t,i,r,s,o){return wo.setScalar(0),To.setScalar(0),Ro.setScalar(0),wo.fromBufferAttribute(e,t),To.fromBufferAttribute(e,i),Ro.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(wo,s.x),o.addScaledVector(To,s.y),o.addScaledVector(Ro,s.z),o}static isFrontFacing(e,t,i,r){return un.subVectors(i,t),Pn.subVectors(e,t),un.cross(Pn).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return un.subVectors(this.c,this.b),Pn.subVectors(this.a,this.b),un.cross(Pn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return hn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return hn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return hn.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return hn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return hn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let o,a;Li.subVectors(r,i),Ni.subVectors(s,i),yo.subVectors(e,i);const c=Li.dot(yo),l=Ni.dot(yo);if(c<=0&&l<=0)return t.copy(i);Mo.subVectors(e,r);const u=Li.dot(Mo),h=Ni.dot(Mo);if(u>=0&&h<=u)return t.copy(r);const f=c*h-u*l;if(f<=0&&c>=0&&u<=0)return o=c/(c-u),t.copy(i).addScaledVector(Li,o);bo.subVectors(e,s);const d=Li.dot(bo),g=Ni.dot(bo);if(g>=0&&d<=g)return t.copy(s);const _=d*l-c*g;if(_<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(i).addScaledVector(Ni,a);const m=u*g-d*h;if(m<=0&&h-u>=0&&d-g>=0)return Cl.subVectors(s,r),a=(h-u)/(h-u+(d-g)),t.copy(r).addScaledVector(Cl,a);const p=1/(m+_+f);return o=_*p,a=f*p,t.copy(i).addScaledVector(Li,o).addScaledVector(Ni,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Vh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Zn={h:0,s:0,l:0},ss={h:0,s:0,l:0};function Co(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class qe{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Kt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ke.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=Ke.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ke.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=Ke.workingColorSpace){if(e=hc(e,1),t=Ze(t,0,1),i=Ze(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=Co(o,s,e+1/3),this.g=Co(o,s,e),this.b=Co(o,s,e-1/3)}return Ke.colorSpaceToWorking(this,r),this}setStyle(e,t=Kt){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Kt){const i=Vh[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Fn(e.r),this.g=Fn(e.g),this.b=Fn(e.b),this}copyLinearToSRGB(e){return this.r=Xi(e.r),this.g=Xi(e.g),this.b=Xi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Kt){return Ke.workingToColorSpace(Ct.copy(this),e),Math.round(Ze(Ct.r*255,0,255))*65536+Math.round(Ze(Ct.g*255,0,255))*256+Math.round(Ze(Ct.b*255,0,255))}getHexString(e=Kt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ke.workingColorSpace){Ke.workingToColorSpace(Ct.copy(this),t);const i=Ct.r,r=Ct.g,s=Ct.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let c,l;const u=(a+o)/2;if(a===o)c=0,l=0;else{const h=o-a;switch(l=u<=.5?h/(o+a):h/(2-o-a),o){case i:c=(r-s)/h+(r<s?6:0);break;case r:c=(s-i)/h+2;break;case s:c=(i-r)/h+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=Ke.workingColorSpace){return Ke.workingToColorSpace(Ct.copy(this),t),e.r=Ct.r,e.g=Ct.g,e.b=Ct.b,e}getStyle(e=Kt){Ke.workingToColorSpace(Ct.copy(this),e);const t=Ct.r,i=Ct.g,r=Ct.b;return e!==Kt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Zn),this.setHSL(Zn.h+e,Zn.s+t,Zn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Zn),e.getHSL(ss);const i=Rr(Zn.h,ss.h,t),r=Rr(Zn.s,ss.s,t),s=Rr(Zn.l,ss.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ct=new qe;qe.NAMES=Vh;let Ov=0;class Ys extends nr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ov++}),this.uuid=ir(),this.name="",this.type="Material",this.blending=Wi,this.side=Bn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ta,this.blendDst=na,this.blendEquation=di,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qe(0,0,0),this.blendAlpha=0,this.depthFunc=ji,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ml,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=wi,this.stencilZFail=wi,this.stencilZPass=wi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Wi&&(i.blending=this.blending),this.side!==Bn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ta&&(i.blendSrc=this.blendSrc),this.blendDst!==na&&(i.blendDst=this.blendDst),this.blendEquation!==di&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==ji&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ml&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==wi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==wi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==wi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const c=s[a];delete c.metadata,o.push(c)}return o}if(t){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Fs extends Ys{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.combine=Rh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const St=new Y,os=new st;let Bv=0;class kt{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Bv++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=gl,this.updateRanges=[],this.gpuType=kn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)os.fromBufferAttribute(this,t),os.applyMatrix3(e),this.setXY(t,os.x,os.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)St.fromBufferAttribute(this,t),St.applyMatrix3(e),this.setXYZ(t,St.x,St.y,St.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)St.fromBufferAttribute(this,t),St.applyMatrix4(e),this.setXYZ(t,St.x,St.y,St.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)St.fromBufferAttribute(this,t),St.applyNormalMatrix(e),this.setXYZ(t,St.x,St.y,St.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)St.fromBufferAttribute(this,t),St.transformDirection(e),this.setXYZ(t,St.x,St.y,St.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=zi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Ut(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=zi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ut(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=zi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ut(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=zi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ut(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=zi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ut(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Ut(t,this.array),i=Ut(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=Ut(t,this.array),i=Ut(i,this.array),r=Ut(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=Ut(t,this.array),i=Ut(i,this.array),r=Ut(r,this.array),s=Ut(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==gl&&(e.usage=this.usage),e}}class Gh extends kt{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Hh extends kt{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class En extends kt{constructor(e,t,i){super(new Float32Array(e),t,i)}}let zv=0;const tn=new yt,Po=new Qt,ki=new Y,jt=new zr,gr=new zr,wt=new Y;class bn extends nr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:zv++}),this.uuid=ir(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Bh(e)?Hh:Gh)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new We().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return tn.makeRotationFromQuaternion(e),this.applyMatrix4(tn),this}rotateX(e){return tn.makeRotationX(e),this.applyMatrix4(tn),this}rotateY(e){return tn.makeRotationY(e),this.applyMatrix4(tn),this}rotateZ(e){return tn.makeRotationZ(e),this.applyMatrix4(tn),this}translate(e,t,i){return tn.makeTranslation(e,t,i),this.applyMatrix4(tn),this}scale(e,t,i){return tn.makeScale(e,t,i),this.applyMatrix4(tn),this}lookAt(e){return Po.lookAt(e),Po.updateMatrix(),this.applyMatrix4(Po.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ki).negate(),this.translate(ki.x,ki.y,ki.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new En(i,3))}else{const i=Math.min(e.length,t.count);for(let r=0;r<i;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new zr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new Y(-1/0,-1/0,-1/0),new Y(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];jt.setFromBufferAttribute(s),this.morphTargetsRelative?(wt.addVectors(this.boundingBox.min,jt.min),this.boundingBox.expandByPoint(wt),wt.addVectors(this.boundingBox.max,jt.max),this.boundingBox.expandByPoint(wt)):(this.boundingBox.expandByPoint(jt.min),this.boundingBox.expandByPoint(jt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Xs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new Y,1/0);return}if(e){const i=this.boundingSphere.center;if(jt.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];gr.setFromBufferAttribute(a),this.morphTargetsRelative?(wt.addVectors(jt.min,gr.min),jt.expandByPoint(wt),wt.addVectors(jt.max,gr.max),jt.expandByPoint(wt)):(jt.expandByPoint(gr.min),jt.expandByPoint(gr.max))}jt.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)wt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(wt));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)wt.fromBufferAttribute(a,l),c&&(ki.fromBufferAttribute(e,l),wt.add(ki)),r=Math.max(r,i.distanceToSquared(wt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new kt(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let I=0;I<i.count;I++)a[I]=new Y,c[I]=new Y;const l=new Y,u=new Y,h=new Y,f=new st,d=new st,g=new st,_=new Y,m=new Y;function p(I,M,S){l.fromBufferAttribute(i,I),u.fromBufferAttribute(i,M),h.fromBufferAttribute(i,S),f.fromBufferAttribute(s,I),d.fromBufferAttribute(s,M),g.fromBufferAttribute(s,S),u.sub(l),h.sub(l),d.sub(f),g.sub(f);const C=1/(d.x*g.y-g.x*d.y);isFinite(C)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(h,-d.y).multiplyScalar(C),m.copy(h).multiplyScalar(d.x).addScaledVector(u,-g.x).multiplyScalar(C),a[I].add(_),a[M].add(_),a[S].add(_),c[I].add(m),c[M].add(m),c[S].add(m))}let A=this.groups;A.length===0&&(A=[{start:0,count:e.count}]);for(let I=0,M=A.length;I<M;++I){const S=A[I],C=S.start,U=S.count;for(let k=C,V=C+U;k<V;k+=3)p(e.getX(k+0),e.getX(k+1),e.getX(k+2))}const E=new Y,x=new Y,w=new Y,b=new Y;function R(I){w.fromBufferAttribute(r,I),b.copy(w);const M=a[I];E.copy(M),E.sub(w.multiplyScalar(w.dot(M))).normalize(),x.crossVectors(b,M);const C=x.dot(c[I])<0?-1:1;o.setXYZW(I,E.x,E.y,E.z,C)}for(let I=0,M=A.length;I<M;++I){const S=A[I],C=S.start,U=S.count;for(let k=C,V=C+U;k<V;k+=3)R(e.getX(k+0)),R(e.getX(k+1)),R(e.getX(k+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new kt(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,d=i.count;f<d;f++)i.setXYZ(f,0,0,0);const r=new Y,s=new Y,o=new Y,a=new Y,c=new Y,l=new Y,u=new Y,h=new Y;if(e)for(let f=0,d=e.count;f<d;f+=3){const g=e.getX(f+0),_=e.getX(f+1),m=e.getX(f+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),a.fromBufferAttribute(i,g),c.fromBufferAttribute(i,_),l.fromBufferAttribute(i,m),a.add(u),c.add(u),l.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,d=t.count;f<d;f+=3)r.fromBufferAttribute(t,f+0),s.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),i.setXYZ(f+0,u.x,u.y,u.z),i.setXYZ(f+1,u.x,u.y,u.z),i.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)wt.fromBufferAttribute(e,t),wt.normalize(),e.setXYZ(t,wt.x,wt.y,wt.z)}toNonIndexed(){function e(a,c){const l=a.array,u=a.itemSize,h=a.normalized,f=new l.constructor(c.length*u);let d=0,g=0;for(let _=0,m=c.length;_<m;_++){a.isInterleavedBufferAttribute?d=c[_]*a.data.stride+a.offset:d=c[_]*u;for(let p=0;p<u;p++)f[g++]=l[d++]}return new kt(f,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new bn,i=this.index.array,r=this.attributes;for(const a in r){const c=r[a],l=e(c,i);t.setAttribute(a,l)}const s=this.morphAttributes;for(const a in s){const c=[],l=s[a];for(let u=0,h=l.length;u<h;u++){const f=l[u],d=e(f,i);c.push(d)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const l=i[c];e.data.attributes[c]=l.toJSON(e.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let h=0,f=l.length;h<f;h++){const d=l[h];u.push(d.toJSON(e.data))}u.length>0&&(r[c]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const l in r){const u=r[l];this.setAttribute(l,u.clone(t))}const s=e.morphAttributes;for(const l in s){const u=[],h=s[l];for(let f=0,d=h.length;f<d;f++)u.push(h[f].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let l=0,u=o.length;l<u;l++){const h=o[l];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Pl=new yt,oi=new Dv,as=new Xs,Dl=new Y,cs=new Y,ls=new Y,us=new Y,Do=new Y,hs=new Y,Il=new Y,fs=new Y;class zt extends Qt{constructor(e=new bn,t=new Fs){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){hs.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const u=a[c],h=s[c];u!==0&&(Do.fromBufferAttribute(h,e),o?hs.addScaledVector(Do,u):hs.addScaledVector(Do.sub(t),u))}t.add(hs)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),as.copy(i.boundingSphere),as.applyMatrix4(s),oi.copy(e.ray).recast(e.near),!(as.containsPoint(oi.origin)===!1&&(oi.intersectSphere(as,Dl)===null||oi.origin.distanceToSquared(Dl)>(e.far-e.near)**2))&&(Pl.copy(s).invert(),oi.copy(e.ray).applyMatrix4(Pl),!(i.boundingBox!==null&&oi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,oi)))}_computeIntersections(e,t,i){let r;const s=this.geometry,o=this.material,a=s.index,c=s.attributes.position,l=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,f=s.groups,d=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){const m=f[g],p=o[m.materialIndex],A=Math.max(m.start,d.start),E=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let x=A,w=E;x<w;x+=3){const b=a.getX(x),R=a.getX(x+1),I=a.getX(x+2);r=ds(this,p,e,i,l,u,h,b,R,I),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,d.start),_=Math.min(a.count,d.start+d.count);for(let m=g,p=_;m<p;m+=3){const A=a.getX(m),E=a.getX(m+1),x=a.getX(m+2);r=ds(this,o,e,i,l,u,h,A,E,x),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){const m=f[g],p=o[m.materialIndex],A=Math.max(m.start,d.start),E=Math.min(c.count,Math.min(m.start+m.count,d.start+d.count));for(let x=A,w=E;x<w;x+=3){const b=x,R=x+1,I=x+2;r=ds(this,p,e,i,l,u,h,b,R,I),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,d.start),_=Math.min(c.count,d.start+d.count);for(let m=g,p=_;m<p;m+=3){const A=m,E=m+1,x=m+2;r=ds(this,o,e,i,l,u,h,A,E,x),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function Vv(n,e,t,i,r,s,o,a){let c;if(e.side===Ft?c=i.intersectTriangle(o,s,r,!0,a):c=i.intersectTriangle(r,s,o,e.side===Bn,a),c===null)return null;fs.copy(a),fs.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(fs);return l<t.near||l>t.far?null:{distance:l,point:fs.clone(),object:n}}function ds(n,e,t,i,r,s,o,a,c,l){n.getVertexPosition(a,cs),n.getVertexPosition(c,ls),n.getVertexPosition(l,us);const u=Vv(n,e,t,i,cs,ls,us,Il);if(u){const h=new Y;hn.getBarycoord(Il,cs,ls,us,h),r&&(u.uv=hn.getInterpolatedAttribute(r,a,c,l,h,new st)),s&&(u.uv1=hn.getInterpolatedAttribute(s,a,c,l,h,new st)),o&&(u.normal=hn.getInterpolatedAttribute(o,a,c,l,h,new Y),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const f={a,b:c,c:l,normal:new Y,materialIndex:0};hn.getNormal(cs,ls,us,f.normal),u.face=f,u.barycoord=h}return u}class yi extends bn{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const c=[],l=[],u=[],h=[];let f=0,d=0;g("z","y","x",-1,-1,i,t,e,o,s,0),g("z","y","x",1,-1,i,t,-e,o,s,1),g("x","z","y",1,1,e,i,t,r,o,2),g("x","z","y",1,-1,e,i,-t,r,o,3),g("x","y","z",1,-1,e,t,i,r,s,4),g("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(c),this.setAttribute("position",new En(l,3)),this.setAttribute("normal",new En(u,3)),this.setAttribute("uv",new En(h,2));function g(_,m,p,A,E,x,w,b,R,I,M){const S=x/R,C=w/I,U=x/2,k=w/2,V=b/2,H=R+1,W=I+1;let $=0,X=0;const te=new Y;for(let ae=0;ae<W;ae++){const _e=ae*C-k;for(let ye=0;ye<H;ye++){const Ve=ye*S-U;te[_]=Ve*A,te[m]=_e*E,te[p]=V,l.push(te.x,te.y,te.z),te[_]=0,te[m]=0,te[p]=b>0?1:-1,u.push(te.x,te.y,te.z),h.push(ye/R),h.push(1-ae/I),$+=1}}for(let ae=0;ae<I;ae++)for(let _e=0;_e<R;_e++){const ye=f+_e+H*ae,Ve=f+_e+H*(ae+1),Ce=f+(_e+1)+H*(ae+1),Pe=f+(_e+1)+H*ae;c.push(ye,Ve,Pe),c.push(Ve,Ce,Pe),X+=6}a.addGroup(d,X,M),d+=X,f+=$}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new yi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ji(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function Lt(n){const e={};for(let t=0;t<n.length;t++){const i=Ji(n[t]);for(const r in i)e[r]=i[r]}return e}function Gv(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Wh(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ke.workingColorSpace}const Hv={clone:Ji,merge:Lt};var Wv=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Xv=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Mn extends Ys{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Wv,this.fragmentShader=Xv,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ji(e.uniforms),this.uniformsGroups=Gv(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Xh extends Qt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new yt,this.projectionMatrix=new yt,this.projectionMatrixInverse=new yt,this.coordinateSystem=An,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const jn=new Y,Ul=new st,Ll=new st;class rn extends Xh{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=kr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Tr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return kr*2*Math.atan(Math.tan(Tr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){jn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(jn.x,jn.y).multiplyScalar(-e/jn.z),jn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(jn.x,jn.y).multiplyScalar(-e/jn.z)}getViewSize(e,t){return this.getViewBounds(e,Ul,Ll),t.subVectors(Ll,Ul)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Tr*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*r/c,t-=o.offsetY*i/l,r*=o.width/c,i*=o.height/l}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Fi=-90,Oi=1;class Yv extends Qt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new rn(Fi,Oi,e,t);r.layers=this.layers,this.add(r);const s=new rn(Fi,Oi,e,t);s.layers=this.layers,this.add(s);const o=new rn(Fi,Oi,e,t);o.layers=this.layers,this.add(o);const a=new rn(Fi,Oi,e,t);a.layers=this.layers,this.add(a);const c=new rn(Fi,Oi,e,t);c.layers=this.layers,this.add(c);const l=new rn(Fi,Oi,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,o,a,c]=t;for(const l of t)this.remove(l);if(e===An)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Ns)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,c,l,u]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,o),e.setRenderTarget(i,2,r),e.render(t,a),e.setRenderTarget(i,3,r),e.render(t,c),e.setRenderTarget(i,4,r),e.render(t,l),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,r),e.render(t,u),e.setRenderTarget(h,f,d),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Yh extends Ot{constructor(e=[],t=Ki,i,r,s,o,a,c,l,u){super(e,t,i,r,s,o,a,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Zv extends Ei{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Yh(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new yi(5,5,5),s=new Mn({name:"CubemapFromEquirect",uniforms:Ji(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Ft,blending:qn});s.uniforms.tEquirect.value=t;const o=new zt(r,s),a=t.minFilter;return t.minFilter===gi&&(t.minFilter=xn),new Yv(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}}class _i extends Qt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const jv={type:"move"};class Io{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new _i,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new _i,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Y,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Y),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new _i,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Y,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Y),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,i),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],f=u.position.distanceTo(h.position),d=.02,g=.005;l.inputState.pinching&&f>d+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=d-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(jv)))}return a!==null&&(a.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new _i;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class Zh extends Qt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new zn,this.environmentIntensity=1,this.environmentRotation=new zn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Uo=new Y,Kv=new Y,qv=new We;class ui{constructor(e=new Y(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=Uo.subVectors(i,t).cross(Kv.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Uo),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||qv.getNormalMatrix(e),r=this.coplanarPoint(Uo).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ai=new Xs,Qv=new st(.5,.5),ps=new Y;class jh{constructor(e=new ui,t=new ui,i=new ui,r=new ui,s=new ui,o=new ui){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=An,i=!1){const r=this.planes,s=e.elements,o=s[0],a=s[1],c=s[2],l=s[3],u=s[4],h=s[5],f=s[6],d=s[7],g=s[8],_=s[9],m=s[10],p=s[11],A=s[12],E=s[13],x=s[14],w=s[15];if(r[0].setComponents(l-o,d-u,p-g,w-A).normalize(),r[1].setComponents(l+o,d+u,p+g,w+A).normalize(),r[2].setComponents(l+a,d+h,p+_,w+E).normalize(),r[3].setComponents(l-a,d-h,p-_,w-E).normalize(),i)r[4].setComponents(c,f,m,x).normalize(),r[5].setComponents(l-c,d-f,p-m,w-x).normalize();else if(r[4].setComponents(l-c,d-f,p-m,w-x).normalize(),t===An)r[5].setComponents(l+c,d+f,p+m,w+x).normalize();else if(t===Ns)r[5].setComponents(c,f,m,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ai.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ai.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ai)}intersectsSprite(e){ai.center.set(0,0,0);const t=Qv.distanceTo(e.center);return ai.radius=.7071067811865476+t,ai.applyMatrix4(e.matrixWorld),this.intersectsSphere(ai)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(ps.x=r.normal.x>0?e.max.x:e.min.x,ps.y=r.normal.y>0?e.max.y:e.min.y,ps.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(ps)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Jv extends Ot{constructor(e,t,i,r,s,o,a,c,l){super(e,t,i,r,s,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Kh extends Ot{constructor(e,t,i=Ai,r,s,o,a=Vt,c=Vt,l,u=Lr,h=1){if(u!==Lr&&u!==Nr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:h};super(f,r,s,o,a,c,u,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new fc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class qh extends Ot{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Zs extends bn{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,o=t/2,a=Math.floor(i),c=Math.floor(r),l=a+1,u=c+1,h=e/a,f=t/c,d=[],g=[],_=[],m=[];for(let p=0;p<u;p++){const A=p*f-o;for(let E=0;E<l;E++){const x=E*h-s;g.push(x,-A,0),_.push(0,0,1),m.push(E/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let A=0;A<a;A++){const E=A+l*p,x=A+l*(p+1),w=A+1+l*(p+1),b=A+1+l*p;d.push(E,x,b),d.push(x,w,b)}this.setIndex(d),this.setAttribute("position",new En(g,3)),this.setAttribute("normal",new En(_,3)),this.setAttribute("uv",new En(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Zs(e.width,e.height,e.widthSegments,e.heightSegments)}}class pc extends bn{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const c=Math.min(o+a,Math.PI);let l=0;const u=[],h=new Y,f=new Y,d=[],g=[],_=[],m=[];for(let p=0;p<=i;p++){const A=[],E=p/i;let x=0;p===0&&o===0?x=.5/t:p===i&&c===Math.PI&&(x=-.5/t);for(let w=0;w<=t;w++){const b=w/t;h.x=-e*Math.cos(r+b*s)*Math.sin(o+E*a),h.y=e*Math.cos(o+E*a),h.z=e*Math.sin(r+b*s)*Math.sin(o+E*a),g.push(h.x,h.y,h.z),f.copy(h).normalize(),_.push(f.x,f.y,f.z),m.push(b+x,1-E),A.push(l++)}u.push(A)}for(let p=0;p<i;p++)for(let A=0;A<t;A++){const E=u[p][A+1],x=u[p][A],w=u[p+1][A],b=u[p+1][A+1];(p!==0||o>0)&&d.push(E,x,b),(p!==i-1||c<Math.PI)&&d.push(x,w,b)}this.setIndex(d),this.setAttribute("position",new En(g,3)),this.setAttribute("normal",new En(_,3)),this.setAttribute("uv",new En(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new pc(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class $v extends Ys{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=j0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class ex extends Ys{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class tx extends Xh{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+t,c=r-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class nx extends rn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}function Nl(n,e,t,i){const r=ix(i);switch(t){case Lh:return n*e;case kh:return n*e/r.components*r.byteLength;case cc:return n*e/r.components*r.byteLength;case Fh:return n*e*2/r.components*r.byteLength;case lc:return n*e*2/r.components*r.byteLength;case Nh:return n*e*3/r.components*r.byteLength;case sn:return n*e*4/r.components*r.byteLength;case uc:return n*e*4/r.components*r.byteLength;case ys:case Ms:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case bs:case ws:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case pa:case ga:return Math.max(n,16)*Math.max(e,8)/4;case da:case ma:return Math.max(n,8)*Math.max(e,8)/2;case _a:case va:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case xa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Aa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ea:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Sa:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case ya:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Ma:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case ba:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case wa:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Ta:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Ra:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Ca:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Pa:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Da:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Ia:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Ua:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case La:case Na:case ka:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Fa:case Oa:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Ba:case za:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function ix(n){switch(n){case yn:case Ph:return{byteLength:1,components:1};case Ir:case Dh:case Or:return{byteLength:2,components:1};case oc:case ac:return{byteLength:2,components:4};case Ai:case sc:case kn:return{byteLength:4,components:1};case Ih:case Uh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:rc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=rc);function Qh(){let n=null,e=!1,t=null,i=null;function r(s,o){t(s,o),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function rx(n){const e=new WeakMap;function t(a,c){const l=a.array,u=a.usage,h=l.byteLength,f=n.createBuffer();n.bindBuffer(c,f),n.bufferData(c,l,u),a.onUploadCallback();let d;if(l instanceof Float32Array)d=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)d=n.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?d=n.HALF_FLOAT:d=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=n.SHORT;else if(l instanceof Uint32Array)d=n.UNSIGNED_INT;else if(l instanceof Int32Array)d=n.INT;else if(l instanceof Int8Array)d=n.BYTE;else if(l instanceof Uint8Array)d=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,c,l){const u=c.array,h=c.updateRanges;if(n.bindBuffer(l,a),h.length===0)n.bufferSubData(l,0,u);else{h.sort((d,g)=>d.start-g.start);let f=0;for(let d=1;d<h.length;d++){const g=h[f],_=h[d];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++f,h[f]=_)}h.length=f+1;for(let d=0,g=h.length;d<g;d++){const _=h[d];n.bufferSubData(l,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=e.get(a);c&&(n.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,a,c),l.version=a.version}}return{get:r,remove:s,update:o}}var sx=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ox=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,ax=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,cx=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,lx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ux=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,hx=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,fx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,dx=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,px=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,mx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,gx=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,_x=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,vx=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,xx=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Ax=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Ex=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Sx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,yx=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Mx=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,bx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,wx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Tx=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Rx=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Cx=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Px=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Dx=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ix=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ux=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Lx=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Nx="gl_FragColor = linearToOutputTexel( gl_FragColor );",kx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Fx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Ox=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Bx=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,zx=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Vx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Gx=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Hx=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Wx=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Xx=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Yx=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Zx=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,jx=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Kx=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,qx=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Qx=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Jx=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,$x=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,eA=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,tA=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,nA=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,iA=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,rA=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,sA=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,oA=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,aA=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,cA=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,lA=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,uA=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,hA=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,fA=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,dA=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,pA=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,mA=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,gA=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,_A=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,vA=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,xA=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,AA=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,EA=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,SA=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,yA=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,MA=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,bA=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,wA=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,TA=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,RA=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,CA=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,PA=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,DA=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,IA=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,UA=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,LA=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,NA=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,kA=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,FA=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,OA=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,BA=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,zA=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,VA=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,GA=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,HA=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,WA=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,XA=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,YA=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ZA=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,jA=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,KA=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,qA=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,QA=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,JA=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,$A=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,eE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,tE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,nE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,iE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const rE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,sE=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,oE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,aE=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,lE=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,uE=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,hE=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,fE=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,dE=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,pE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,mE=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gE=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,_E=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,vE=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,xE=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,AE=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,EE=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,SE=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,yE=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ME=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,bE=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,wE=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,TE=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,RE=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,CE=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,PE=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,DE=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,IE=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,UE=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,LE=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,NE=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,kE=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,FE=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Xe={alphahash_fragment:sx,alphahash_pars_fragment:ox,alphamap_fragment:ax,alphamap_pars_fragment:cx,alphatest_fragment:lx,alphatest_pars_fragment:ux,aomap_fragment:hx,aomap_pars_fragment:fx,batching_pars_vertex:dx,batching_vertex:px,begin_vertex:mx,beginnormal_vertex:gx,bsdfs:_x,iridescence_fragment:vx,bumpmap_pars_fragment:xx,clipping_planes_fragment:Ax,clipping_planes_pars_fragment:Ex,clipping_planes_pars_vertex:Sx,clipping_planes_vertex:yx,color_fragment:Mx,color_pars_fragment:bx,color_pars_vertex:wx,color_vertex:Tx,common:Rx,cube_uv_reflection_fragment:Cx,defaultnormal_vertex:Px,displacementmap_pars_vertex:Dx,displacementmap_vertex:Ix,emissivemap_fragment:Ux,emissivemap_pars_fragment:Lx,colorspace_fragment:Nx,colorspace_pars_fragment:kx,envmap_fragment:Fx,envmap_common_pars_fragment:Ox,envmap_pars_fragment:Bx,envmap_pars_vertex:zx,envmap_physical_pars_fragment:Qx,envmap_vertex:Vx,fog_vertex:Gx,fog_pars_vertex:Hx,fog_fragment:Wx,fog_pars_fragment:Xx,gradientmap_pars_fragment:Yx,lightmap_pars_fragment:Zx,lights_lambert_fragment:jx,lights_lambert_pars_fragment:Kx,lights_pars_begin:qx,lights_toon_fragment:Jx,lights_toon_pars_fragment:$x,lights_phong_fragment:eA,lights_phong_pars_fragment:tA,lights_physical_fragment:nA,lights_physical_pars_fragment:iA,lights_fragment_begin:rA,lights_fragment_maps:sA,lights_fragment_end:oA,logdepthbuf_fragment:aA,logdepthbuf_pars_fragment:cA,logdepthbuf_pars_vertex:lA,logdepthbuf_vertex:uA,map_fragment:hA,map_pars_fragment:fA,map_particle_fragment:dA,map_particle_pars_fragment:pA,metalnessmap_fragment:mA,metalnessmap_pars_fragment:gA,morphinstance_vertex:_A,morphcolor_vertex:vA,morphnormal_vertex:xA,morphtarget_pars_vertex:AA,morphtarget_vertex:EA,normal_fragment_begin:SA,normal_fragment_maps:yA,normal_pars_fragment:MA,normal_pars_vertex:bA,normal_vertex:wA,normalmap_pars_fragment:TA,clearcoat_normal_fragment_begin:RA,clearcoat_normal_fragment_maps:CA,clearcoat_pars_fragment:PA,iridescence_pars_fragment:DA,opaque_fragment:IA,packing:UA,premultiplied_alpha_fragment:LA,project_vertex:NA,dithering_fragment:kA,dithering_pars_fragment:FA,roughnessmap_fragment:OA,roughnessmap_pars_fragment:BA,shadowmap_pars_fragment:zA,shadowmap_pars_vertex:VA,shadowmap_vertex:GA,shadowmask_pars_fragment:HA,skinbase_vertex:WA,skinning_pars_vertex:XA,skinning_vertex:YA,skinnormal_vertex:ZA,specularmap_fragment:jA,specularmap_pars_fragment:KA,tonemapping_fragment:qA,tonemapping_pars_fragment:QA,transmission_fragment:JA,transmission_pars_fragment:$A,uv_pars_fragment:eE,uv_pars_vertex:tE,uv_vertex:nE,worldpos_vertex:iE,background_vert:rE,background_frag:sE,backgroundCube_vert:oE,backgroundCube_frag:aE,cube_vert:cE,cube_frag:lE,depth_vert:uE,depth_frag:hE,distanceRGBA_vert:fE,distanceRGBA_frag:dE,equirect_vert:pE,equirect_frag:mE,linedashed_vert:gE,linedashed_frag:_E,meshbasic_vert:vE,meshbasic_frag:xE,meshlambert_vert:AE,meshlambert_frag:EE,meshmatcap_vert:SE,meshmatcap_frag:yE,meshnormal_vert:ME,meshnormal_frag:bE,meshphong_vert:wE,meshphong_frag:TE,meshphysical_vert:RE,meshphysical_frag:CE,meshtoon_vert:PE,meshtoon_frag:DE,points_vert:IE,points_frag:UE,shadow_vert:LE,shadow_frag:NE,sprite_vert:kE,sprite_frag:FE},de={common:{diffuse:{value:new qe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new We}},envmap:{envMap:{value:null},envMapRotation:{value:new We},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new We}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new We}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new We},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new We},normalScale:{value:new st(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new We},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new We}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new We}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new We}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0},uvTransform:{value:new We}},sprite:{diffuse:{value:new qe(16777215)},opacity:{value:1},center:{value:new st(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}}},gn={basic:{uniforms:Lt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:Lt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new qe(0)}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:Lt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new qe(0)},specular:{value:new qe(1118481)},shininess:{value:30}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:Lt([de.common,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.roughnessmap,de.metalnessmap,de.fog,de.lights,{emissive:{value:new qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:Lt([de.common,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.gradientmap,de.fog,de.lights,{emissive:{value:new qe(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:Lt([de.common,de.bumpmap,de.normalmap,de.displacementmap,de.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:Lt([de.points,de.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:Lt([de.common,de.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:Lt([de.common,de.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:Lt([de.common,de.bumpmap,de.normalmap,de.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:Lt([de.sprite,de.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new We},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new We}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distanceRGBA:{uniforms:Lt([de.common,de.displacementmap,{referencePosition:{value:new Y},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distanceRGBA_vert,fragmentShader:Xe.distanceRGBA_frag},shadow:{uniforms:Lt([de.lights,de.fog,{color:{value:new qe(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};gn.physical={uniforms:Lt([gn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new We},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new We},clearcoatNormalScale:{value:new st(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new We},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new We},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new We},sheen:{value:0},sheenColor:{value:new qe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new We},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new We},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new We},transmissionSamplerSize:{value:new st},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new We},attenuationDistance:{value:0},attenuationColor:{value:new qe(0)},specularColor:{value:new qe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new We},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new We},anisotropyVector:{value:new st},anisotropyMap:{value:null},anisotropyMapTransform:{value:new We}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};const ms={r:0,b:0,g:0},ci=new zn,OE=new yt;function BE(n,e,t,i,r,s,o){const a=new qe(0);let c=s===!0?0:1,l,u,h=null,f=0,d=null;function g(E){let x=E.isScene===!0?E.background:null;return x&&x.isTexture&&(x=(E.backgroundBlurriness>0?t:e).get(x)),x}function _(E){let x=!1;const w=g(E);w===null?p(a,c):w&&w.isColor&&(p(w,1),x=!0);const b=n.xr.getEnvironmentBlendMode();b==="additive"?i.buffers.color.setClear(0,0,0,1,o):b==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(E,x){const w=g(x);w&&(w.isCubeTexture||w.mapping===Ws)?(u===void 0&&(u=new zt(new yi(1,1,1),new Mn({name:"BackgroundCubeMaterial",uniforms:Ji(gn.backgroundCube.uniforms),vertexShader:gn.backgroundCube.vertexShader,fragmentShader:gn.backgroundCube.fragmentShader,side:Ft,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(b,R,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),ci.copy(x.backgroundRotation),ci.x*=-1,ci.y*=-1,ci.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(ci.y*=-1,ci.z*=-1),u.material.uniforms.envMap.value=w,u.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(OE.makeRotationFromEuler(ci)),u.material.toneMapped=Ke.getTransfer(w.colorSpace)!==rt,(h!==w||f!==w.version||d!==n.toneMapping)&&(u.material.needsUpdate=!0,h=w,f=w.version,d=n.toneMapping),u.layers.enableAll(),E.unshift(u,u.geometry,u.material,0,0,null)):w&&w.isTexture&&(l===void 0&&(l=new zt(new Zs(2,2),new Mn({name:"BackgroundMaterial",uniforms:Ji(gn.background.uniforms),vertexShader:gn.background.vertexShader,fragmentShader:gn.background.fragmentShader,side:Bn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=w,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=Ke.getTransfer(w.colorSpace)!==rt,w.matrixAutoUpdate===!0&&w.updateMatrix(),l.material.uniforms.uvTransform.value.copy(w.matrix),(h!==w||f!==w.version||d!==n.toneMapping)&&(l.material.needsUpdate=!0,h=w,f=w.version,d=n.toneMapping),l.layers.enableAll(),E.unshift(l,l.geometry,l.material,0,0,null))}function p(E,x){E.getRGB(ms,Wh(n)),i.buffers.color.setClear(ms.r,ms.g,ms.b,x,o)}function A(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(E,x=1){a.set(E),c=x,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(E){c=E,p(a,c)},render:_,addToRenderList:m,dispose:A}}function zE(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=f(null);let s=r,o=!1;function a(S,C,U,k,V){let H=!1;const W=h(k,U,C);s!==W&&(s=W,l(s.object)),H=d(S,k,U,V),H&&g(S,k,U,V),V!==null&&e.update(V,n.ELEMENT_ARRAY_BUFFER),(H||o)&&(o=!1,x(S,C,U,k),V!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function c(){return n.createVertexArray()}function l(S){return n.bindVertexArray(S)}function u(S){return n.deleteVertexArray(S)}function h(S,C,U){const k=U.wireframe===!0;let V=i[S.id];V===void 0&&(V={},i[S.id]=V);let H=V[C.id];H===void 0&&(H={},V[C.id]=H);let W=H[k];return W===void 0&&(W=f(c()),H[k]=W),W}function f(S){const C=[],U=[],k=[];for(let V=0;V<t;V++)C[V]=0,U[V]=0,k[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:U,attributeDivisors:k,object:S,attributes:{},index:null}}function d(S,C,U,k){const V=s.attributes,H=C.attributes;let W=0;const $=U.getAttributes();for(const X in $)if($[X].location>=0){const ae=V[X];let _e=H[X];if(_e===void 0&&(X==="instanceMatrix"&&S.instanceMatrix&&(_e=S.instanceMatrix),X==="instanceColor"&&S.instanceColor&&(_e=S.instanceColor)),ae===void 0||ae.attribute!==_e||_e&&ae.data!==_e.data)return!0;W++}return s.attributesNum!==W||s.index!==k}function g(S,C,U,k){const V={},H=C.attributes;let W=0;const $=U.getAttributes();for(const X in $)if($[X].location>=0){let ae=H[X];ae===void 0&&(X==="instanceMatrix"&&S.instanceMatrix&&(ae=S.instanceMatrix),X==="instanceColor"&&S.instanceColor&&(ae=S.instanceColor));const _e={};_e.attribute=ae,ae&&ae.data&&(_e.data=ae.data),V[X]=_e,W++}s.attributes=V,s.attributesNum=W,s.index=k}function _(){const S=s.newAttributes;for(let C=0,U=S.length;C<U;C++)S[C]=0}function m(S){p(S,0)}function p(S,C){const U=s.newAttributes,k=s.enabledAttributes,V=s.attributeDivisors;U[S]=1,k[S]===0&&(n.enableVertexAttribArray(S),k[S]=1),V[S]!==C&&(n.vertexAttribDivisor(S,C),V[S]=C)}function A(){const S=s.newAttributes,C=s.enabledAttributes;for(let U=0,k=C.length;U<k;U++)C[U]!==S[U]&&(n.disableVertexAttribArray(U),C[U]=0)}function E(S,C,U,k,V,H,W){W===!0?n.vertexAttribIPointer(S,C,U,V,H):n.vertexAttribPointer(S,C,U,k,V,H)}function x(S,C,U,k){_();const V=k.attributes,H=U.getAttributes(),W=C.defaultAttributeValues;for(const $ in H){const X=H[$];if(X.location>=0){let te=V[$];if(te===void 0&&($==="instanceMatrix"&&S.instanceMatrix&&(te=S.instanceMatrix),$==="instanceColor"&&S.instanceColor&&(te=S.instanceColor)),te!==void 0){const ae=te.normalized,_e=te.itemSize,ye=e.get(te);if(ye===void 0)continue;const Ve=ye.buffer,Ce=ye.type,Pe=ye.bytesPerElement,K=Ce===n.INT||Ce===n.UNSIGNED_INT||te.gpuType===sc;if(te.isInterleavedBufferAttribute){const Q=te.data,pe=Q.stride,Me=te.offset;if(Q.isInstancedInterleavedBuffer){for(let fe=0;fe<X.locationSize;fe++)p(X.location+fe,Q.meshPerAttribute);S.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let fe=0;fe<X.locationSize;fe++)m(X.location+fe);n.bindBuffer(n.ARRAY_BUFFER,Ve);for(let fe=0;fe<X.locationSize;fe++)E(X.location+fe,_e/X.locationSize,Ce,ae,pe*Pe,(Me+_e/X.locationSize*fe)*Pe,K)}else{if(te.isInstancedBufferAttribute){for(let Q=0;Q<X.locationSize;Q++)p(X.location+Q,te.meshPerAttribute);S.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let Q=0;Q<X.locationSize;Q++)m(X.location+Q);n.bindBuffer(n.ARRAY_BUFFER,Ve);for(let Q=0;Q<X.locationSize;Q++)E(X.location+Q,_e/X.locationSize,Ce,ae,_e*Pe,_e/X.locationSize*Q*Pe,K)}}else if(W!==void 0){const ae=W[$];if(ae!==void 0)switch(ae.length){case 2:n.vertexAttrib2fv(X.location,ae);break;case 3:n.vertexAttrib3fv(X.location,ae);break;case 4:n.vertexAttrib4fv(X.location,ae);break;default:n.vertexAttrib1fv(X.location,ae)}}}}A()}function w(){I();for(const S in i){const C=i[S];for(const U in C){const k=C[U];for(const V in k)u(k[V].object),delete k[V];delete C[U]}delete i[S]}}function b(S){if(i[S.id]===void 0)return;const C=i[S.id];for(const U in C){const k=C[U];for(const V in k)u(k[V].object),delete k[V];delete C[U]}delete i[S.id]}function R(S){for(const C in i){const U=i[C];if(U[S.id]===void 0)continue;const k=U[S.id];for(const V in k)u(k[V].object),delete k[V];delete U[S.id]}}function I(){M(),o=!0,s!==r&&(s=r,l(s.object))}function M(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:I,resetDefaultState:M,dispose:w,releaseStatesOfGeometry:b,releaseStatesOfProgram:R,initAttributes:_,enableAttribute:m,disableUnusedAttributes:A}}function VE(n,e,t){let i;function r(l){i=l}function s(l,u){n.drawArrays(i,l,u),t.update(u,i,1)}function o(l,u,h){h!==0&&(n.drawArraysInstanced(i,l,u,h),t.update(u,i,h))}function a(l,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,u,0,h);let d=0;for(let g=0;g<h;g++)d+=u[g];t.update(d,i,1)}function c(l,u,h,f){if(h===0)return;const d=e.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<l.length;g++)o(l[g],u[g],f[g]);else{d.multiDrawArraysInstancedWEBGL(i,l,0,u,0,f,0,h);let g=0;for(let _=0;_<h;_++)g+=u[_]*f[_];t.update(g,i,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function GE(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(R){return!(R!==sn&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){const I=R===Or&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==yn&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==kn&&!I)}function c(R){if(R==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const u=c(l);u!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const h=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),d=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),A=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),E=n.getParameter(n.MAX_VARYING_VECTORS),x=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=g>0,b=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:h,reversedDepthBuffer:f,maxTextures:d,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:A,maxVaryings:E,maxFragmentUniforms:x,vertexTextures:w,maxSamples:b}}function HE(n){const e=this;let t=null,i=0,r=!1,s=!1;const o=new ui,a=new We,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const d=h.length!==0||f||i!==0||r;return r=f,i=h.length,d},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,f){t=u(h,f,0)},this.setState=function(h,f,d){const g=h.clippingPlanes,_=h.clipIntersection,m=h.clipShadows,p=n.get(h);if(!r||g===null||g.length===0||s&&!m)s?u(null):l();else{const A=s?0:i,E=A*4;let x=p.clippingState||null;c.value=x,x=u(g,f,E,d);for(let w=0;w!==E;++w)x[w]=t[w];p.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=A}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,f,d,g){const _=h!==null?h.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const p=d+_*4,A=f.matrixWorldInverse;a.getNormalMatrix(A),(m===null||m.length<p)&&(m=new Float32Array(p));for(let E=0,x=d;E!==_;++E,x+=4)o.copy(h[E]).applyMatrix4(A,a),o.normal.toArray(m,x),m[x+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function WE(n){let e=new WeakMap;function t(o,a){return a===ua?o.mapping=Ki:a===ha&&(o.mapping=qi),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===ua||a===ha)if(e.has(o)){const c=e.get(o).texture;return t(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new Zv(c.height);return l.fromEquirectangularTexture(n,o),e.set(o,l),o.addEventListener("dispose",r),t(l.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}const Gi=4,kl=[.125,.215,.35,.446,.526,.582],pi=20,Lo=new tx,Fl=new qe;let No=null,ko=0,Fo=0,Oo=!1;const hi=(1+Math.sqrt(5))/2,Bi=1/hi,Ol=[new Y(-hi,Bi,0),new Y(hi,Bi,0),new Y(-Bi,0,hi),new Y(Bi,0,hi),new Y(0,hi,-Bi),new Y(0,hi,Bi),new Y(-1,1,-1),new Y(1,1,-1),new Y(-1,1,1),new Y(1,1,1)],XE=new Y;class Bl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100,s={}){const{size:o=256,position:a=XE}=s;No=this._renderer.getRenderTarget(),ko=this._renderer.getActiveCubeFace(),Fo=this._renderer.getActiveMipmapLevel(),Oo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,r,c,a),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Gl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Vl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(No,ko,Fo),this._renderer.xr.enabled=Oo,e.scissorTest=!1,gs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ki||e.mapping===qi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),No=this._renderer.getRenderTarget(),ko=this._renderer.getActiveCubeFace(),Fo=this._renderer.getActiveMipmapLevel(),Oo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:xn,minFilter:xn,generateMipmaps:!1,type:Or,format:sn,colorSpace:Qi,depthBuffer:!1},r=zl(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=zl(e,t,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=YE(s)),this._blurMaterial=ZE(s,e,t)}return r}_compileMaterial(e){const t=new zt(this._lodPlanes[0],e);this._renderer.compile(t,Lo)}_sceneToCubeUV(e,t,i,r,s){const c=new rn(90,1,t,i),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,d=h.toneMapping;h.getClearColor(Fl),h.toneMapping=Qn,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(r),h.clearDepth(),h.setRenderTarget(null));const _=new Fs({name:"PMREM.Background",side:Ft,depthWrite:!1,depthTest:!1}),m=new zt(new yi,_);let p=!1;const A=e.background;A?A.isColor&&(_.color.copy(A),e.background=null,p=!0):(_.color.copy(Fl),p=!0);for(let E=0;E<6;E++){const x=E%3;x===0?(c.up.set(0,l[E],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+u[E],s.y,s.z)):x===1?(c.up.set(0,0,l[E]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+u[E],s.z)):(c.up.set(0,l[E],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+u[E]));const w=this._cubeSize;gs(r,x*w,E>2?w:0,w,w),h.setRenderTarget(r),p&&h.render(m,c),h.render(e,c)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=d,h.autoClear=f,e.background=A}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===Ki||e.mapping===qi;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Gl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Vl());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new zt(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const c=this._cubeSize;gs(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(o,Lo)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Ol[(r-s-1)%Ol.length];this._blur(e,s-1,s,o,a)}t.autoClear=i}_blur(e,t,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new zt(this._lodPlanes[r],l),f=l.uniforms,d=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*d):2*Math.PI/(2*pi-1),_=s/g,m=isFinite(s)?1+Math.floor(u*_):pi;m>pi&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${pi}`);const p=[];let A=0;for(let R=0;R<pi;++R){const I=R/_,M=Math.exp(-I*I/2);p.push(M),R===0?A+=M:R<m&&(A+=2*M)}for(let R=0;R<p.length;R++)p[R]=p[R]/A;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:E}=this;f.dTheta.value=g,f.mipInt.value=E-i;const x=this._sizeLods[r],w=3*x*(r>E-Gi?r-E+Gi:0),b=4*(this._cubeSize-x);gs(t,w,b,3*x,2*x),c.setRenderTarget(t),c.render(h,Lo)}}function YE(n){const e=[],t=[],i=[];let r=n;const s=n-Gi+1+kl.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);t.push(a);let c=1/a;o>n-Gi?c=kl[o-n+Gi-1]:o===0&&(c=0),i.push(c);const l=1/(a-2),u=-l,h=1+l,f=[u,u,h,u,h,h,u,u,h,h,u,h],d=6,g=6,_=3,m=2,p=1,A=new Float32Array(_*g*d),E=new Float32Array(m*g*d),x=new Float32Array(p*g*d);for(let b=0;b<d;b++){const R=b%3*2/3-1,I=b>2?0:-1,M=[R,I,0,R+2/3,I,0,R+2/3,I+1,0,R,I,0,R+2/3,I+1,0,R,I+1,0];A.set(M,_*g*b),E.set(f,m*g*b);const S=[b,b,b,b,b,b];x.set(S,p*g*b)}const w=new bn;w.setAttribute("position",new kt(A,_)),w.setAttribute("uv",new kt(E,m)),w.setAttribute("faceIndex",new kt(x,p)),e.push(w),r>Gi&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function zl(n,e,t){const i=new Ei(n,e,t);return i.texture.mapping=Ws,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function gs(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function ZE(n,e,t){const i=new Float32Array(pi),r=new Y(0,1,0);return new Mn({name:"SphericalGaussianBlur",defines:{n:pi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:mc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:qn,depthTest:!1,depthWrite:!1})}function Vl(){return new Mn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:mc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:qn,depthTest:!1,depthWrite:!1})}function Gl(){return new Mn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:mc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:qn,depthTest:!1,depthWrite:!1})}function mc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function jE(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){const c=a.mapping,l=c===ua||c===ha,u=c===Ki||c===qi;if(l||u){let h=e.get(a);const f=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new Bl(n)),h=l?t.fromEquirectangular(a,h):t.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{const d=a.image;return l&&d&&d.height>0||u&&d&&r(d)?(t===null&&(t=new Bl(n)),h=l?t.fromEquirectangular(a):t.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",s),h.texture):null}}}return a}function r(a){let c=0;const l=6;for(let u=0;u<l;u++)a[u]!==void 0&&c++;return c===l}function s(a){const c=a.target;c.removeEventListener("dispose",s);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function KE(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&Fr("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function qE(n,e,t,i){const r={},s=new WeakMap;function o(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);f.removeEventListener("dispose",o),delete r[f.id];const d=s.get(f);d&&(e.remove(d),s.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(h,f){return r[f.id]===!0||(f.addEventListener("dispose",o),r[f.id]=!0,t.memory.geometries++),f}function c(h){const f=h.attributes;for(const d in f)e.update(f[d],n.ARRAY_BUFFER)}function l(h){const f=[],d=h.index,g=h.attributes.position;let _=0;if(d!==null){const A=d.array;_=d.version;for(let E=0,x=A.length;E<x;E+=3){const w=A[E+0],b=A[E+1],R=A[E+2];f.push(w,b,b,R,R,w)}}else if(g!==void 0){const A=g.array;_=g.version;for(let E=0,x=A.length/3-1;E<x;E+=3){const w=E+0,b=E+1,R=E+2;f.push(w,b,b,R,R,w)}}else return;const m=new(Bh(f)?Hh:Gh)(f,1);m.version=_;const p=s.get(h);p&&e.remove(p),s.set(h,m)}function u(h){const f=s.get(h);if(f){const d=h.index;d!==null&&f.version<d.version&&l(h)}else l(h);return s.get(h)}return{get:a,update:c,getWireframeAttribute:u}}function QE(n,e,t){let i;function r(f){i=f}let s,o;function a(f){s=f.type,o=f.bytesPerElement}function c(f,d){n.drawElements(i,d,s,f*o),t.update(d,i,1)}function l(f,d,g){g!==0&&(n.drawElementsInstanced(i,d,s,f*o,g),t.update(d,i,g))}function u(f,d,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,s,f,0,g);let m=0;for(let p=0;p<g;p++)m+=d[p];t.update(m,i,1)}function h(f,d,g,_){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<f.length;p++)l(f[p]/o,d[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(i,d,0,s,f,0,_,0,g);let p=0;for(let A=0;A<g;A++)p+=d[A]*_[A];t.update(p,i,1)}}this.setMode=r,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function JE(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function $E(n,e,t){const i=new WeakMap,r=new xt;function s(o,a,c){const l=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let f=i.get(a);if(f===void 0||f.count!==h){let M=function(){R.dispose(),i.delete(a),a.removeEventListener("dispose",M)};f!==void 0&&f.texture.dispose();const d=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],A=a.morphAttributes.color||[];let E=0;d===!0&&(E=1),g===!0&&(E=2),_===!0&&(E=3);let x=a.attributes.position.count*E,w=1;x>e.maxTextureSize&&(w=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);const b=new Float32Array(x*w*4*h),R=new dc(b,x,w,h);R.type=kn,R.needsUpdate=!0;const I=E*4;for(let S=0;S<h;S++){const C=m[S],U=p[S],k=A[S],V=x*w*4*S;for(let H=0;H<C.count;H++){const W=H*I;d===!0&&(r.fromBufferAttribute(C,H),b[V+W+0]=r.x,b[V+W+1]=r.y,b[V+W+2]=r.z,b[V+W+3]=0),g===!0&&(r.fromBufferAttribute(U,H),b[V+W+4]=r.x,b[V+W+5]=r.y,b[V+W+6]=r.z,b[V+W+7]=0),_===!0&&(r.fromBufferAttribute(k,H),b[V+W+8]=r.x,b[V+W+9]=r.y,b[V+W+10]=r.z,b[V+W+11]=k.itemSize===4?r.w:1)}}f={count:h,texture:R,size:new st(x,w)},i.set(a,f),a.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let d=0;for(let _=0;_<l.length;_++)d+=l[_];const g=a.morphTargetsRelative?1:1-d;c.getUniforms().setValue(n,"morphTargetBaseInfluence",g),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:s}}function eS(n,e,t,i){let r=new WeakMap;function s(c){const l=i.render.frame,u=c.geometry,h=e.get(c,u);if(r.get(h)!==l&&(e.update(h),r.set(h,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),r.get(c)!==l&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==l&&(f.update(),r.set(f,l))}return h}function o(){r=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:s,dispose:o}}const Jh=new Ot,Hl=new Kh(1,1),$h=new dc,ef=new Cv,tf=new Yh,Wl=[],Xl=[],Yl=new Float32Array(16),Zl=new Float32Array(9),jl=new Float32Array(4);function rr(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=Wl[r];if(s===void 0&&(s=new Float32Array(r),Wl[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function Mt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function bt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function js(n,e){let t=Xl[e];t===void 0&&(t=new Int32Array(e),Xl[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function tS(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function nS(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;n.uniform2fv(this.addr,e),bt(t,e)}}function iS(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Mt(t,e))return;n.uniform3fv(this.addr,e),bt(t,e)}}function rS(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;n.uniform4fv(this.addr,e),bt(t,e)}}function sS(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Mt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),bt(t,e)}else{if(Mt(t,i))return;jl.set(i),n.uniformMatrix2fv(this.addr,!1,jl),bt(t,i)}}function oS(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Mt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),bt(t,e)}else{if(Mt(t,i))return;Zl.set(i),n.uniformMatrix3fv(this.addr,!1,Zl),bt(t,i)}}function aS(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Mt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),bt(t,e)}else{if(Mt(t,i))return;Yl.set(i),n.uniformMatrix4fv(this.addr,!1,Yl),bt(t,i)}}function cS(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function lS(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;n.uniform2iv(this.addr,e),bt(t,e)}}function uS(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Mt(t,e))return;n.uniform3iv(this.addr,e),bt(t,e)}}function hS(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;n.uniform4iv(this.addr,e),bt(t,e)}}function fS(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function dS(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;n.uniform2uiv(this.addr,e),bt(t,e)}}function pS(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Mt(t,e))return;n.uniform3uiv(this.addr,e),bt(t,e)}}function mS(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;n.uniform4uiv(this.addr,e),bt(t,e)}}function gS(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(Hl.compareFunction=Oh,s=Hl):s=Jh,t.setTexture2D(e||s,r)}function _S(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||ef,r)}function vS(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||tf,r)}function xS(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||$h,r)}function AS(n){switch(n){case 5126:return tS;case 35664:return nS;case 35665:return iS;case 35666:return rS;case 35674:return sS;case 35675:return oS;case 35676:return aS;case 5124:case 35670:return cS;case 35667:case 35671:return lS;case 35668:case 35672:return uS;case 35669:case 35673:return hS;case 5125:return fS;case 36294:return dS;case 36295:return pS;case 36296:return mS;case 35678:case 36198:case 36298:case 36306:case 35682:return gS;case 35679:case 36299:case 36307:return _S;case 35680:case 36300:case 36308:case 36293:return vS;case 36289:case 36303:case 36311:case 36292:return xS}}function ES(n,e){n.uniform1fv(this.addr,e)}function SS(n,e){const t=rr(e,this.size,2);n.uniform2fv(this.addr,t)}function yS(n,e){const t=rr(e,this.size,3);n.uniform3fv(this.addr,t)}function MS(n,e){const t=rr(e,this.size,4);n.uniform4fv(this.addr,t)}function bS(n,e){const t=rr(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function wS(n,e){const t=rr(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function TS(n,e){const t=rr(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function RS(n,e){n.uniform1iv(this.addr,e)}function CS(n,e){n.uniform2iv(this.addr,e)}function PS(n,e){n.uniform3iv(this.addr,e)}function DS(n,e){n.uniform4iv(this.addr,e)}function IS(n,e){n.uniform1uiv(this.addr,e)}function US(n,e){n.uniform2uiv(this.addr,e)}function LS(n,e){n.uniform3uiv(this.addr,e)}function NS(n,e){n.uniform4uiv(this.addr,e)}function kS(n,e,t){const i=this.cache,r=e.length,s=js(t,r);Mt(i,s)||(n.uniform1iv(this.addr,s),bt(i,s));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||Jh,s[o])}function FS(n,e,t){const i=this.cache,r=e.length,s=js(t,r);Mt(i,s)||(n.uniform1iv(this.addr,s),bt(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||ef,s[o])}function OS(n,e,t){const i=this.cache,r=e.length,s=js(t,r);Mt(i,s)||(n.uniform1iv(this.addr,s),bt(i,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||tf,s[o])}function BS(n,e,t){const i=this.cache,r=e.length,s=js(t,r);Mt(i,s)||(n.uniform1iv(this.addr,s),bt(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||$h,s[o])}function zS(n){switch(n){case 5126:return ES;case 35664:return SS;case 35665:return yS;case 35666:return MS;case 35674:return bS;case 35675:return wS;case 35676:return TS;case 5124:case 35670:return RS;case 35667:case 35671:return CS;case 35668:case 35672:return PS;case 35669:case 35673:return DS;case 5125:return IS;case 36294:return US;case 36295:return LS;case 36296:return NS;case 35678:case 36198:case 36298:case 36306:case 35682:return kS;case 35679:case 36299:case 36307:return FS;case 35680:case 36300:case 36308:case 36293:return OS;case 36289:case 36303:case 36311:case 36292:return BS}}class VS{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=AS(t.type)}}class GS{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=zS(t.type)}}class HS{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,t[a.id],i)}}}const Bo=/(\w+)(\])?(\[|\.)?/g;function Kl(n,e){n.seq.push(e),n.map[e.id]=e}function WS(n,e,t){const i=n.name,r=i.length;for(Bo.lastIndex=0;;){const s=Bo.exec(i),o=Bo.lastIndex;let a=s[1];const c=s[2]==="]",l=s[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===r){Kl(t,l===void 0?new VS(a,n,e):new GS(a,n,e));break}else{let h=t.map[a];h===void 0&&(h=new HS(a),Kl(t,h)),t=h}}}class Ts{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(t,r),o=e.getUniformLocation(t,s.name);WS(s,o,this)}}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){const a=t[s],c=i[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in t&&i.push(o)}return i}}function ql(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const XS=37297;let YS=0;function ZS(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}const Ql=new We;function jS(n){Ke._getMatrix(Ql,Ke.workingColorSpace,n);const e=`mat3( ${Ql.elements.map(t=>t.toFixed(4))} )`;switch(Ke.getTransfer(n)){case Us:return[e,"LinearTransferOETF"];case rt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Jl(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),s=(n.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const a=parseInt(o[1]);return t.toUpperCase()+`

`+s+`

`+ZS(n.getShaderSource(e),a)}else return s}function KS(n,e){const t=jS(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function qS(n,e){let t;switch(e){case z0:t="Linear";break;case V0:t="Reinhard";break;case G0:t="Cineon";break;case H0:t="ACESFilmic";break;case X0:t="AgX";break;case Y0:t="Neutral";break;case W0:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const _s=new Y;function QS(){Ke.getLuminanceCoefficients(_s);const n=_s.x.toFixed(4),e=_s.y.toFixed(4),t=_s.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function JS(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Er).join(`
`)}function $S(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function ey(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),o=s.name;let a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function Er(n){return n!==""}function $l(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function eu(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const ty=/^[ \t]*#include +<([\w\d./]+)>/gm;function Va(n){return n.replace(ty,iy)}const ny=new Map;function iy(n,e){let t=Xe[e];if(t===void 0){const i=ny.get(e);if(i!==void 0)t=Xe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Va(t)}const ry=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function tu(n){return n.replace(ry,sy)}function sy(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function nu(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function oy(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Th?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===x0?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===In&&(e="SHADOWMAP_TYPE_VSM"),e}function ay(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Ki:case qi:e="ENVMAP_TYPE_CUBE";break;case Ws:e="ENVMAP_TYPE_CUBE_UV";break}return e}function cy(n){let e="ENVMAP_MODE_REFLECTION";return n.envMap&&n.envMapMode===qi&&(e="ENVMAP_MODE_REFRACTION"),e}function ly(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Rh:e="ENVMAP_BLENDING_MULTIPLY";break;case O0:e="ENVMAP_BLENDING_MIX";break;case B0:e="ENVMAP_BLENDING_ADD";break}return e}function uy(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function hy(n,e,t,i){const r=n.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const c=oy(t),l=ay(t),u=cy(t),h=ly(t),f=uy(t),d=JS(t),g=$S(s),_=r.createProgram();let m,p,A=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Er).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Er).join(`
`),p.length>0&&(p+=`
`)):(m=[nu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Er).join(`
`),p=[nu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Qn?"#define TONE_MAPPING":"",t.toneMapping!==Qn?Xe.tonemapping_pars_fragment:"",t.toneMapping!==Qn?qS("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,KS("linearToOutputTexel",t.outputColorSpace),QS(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Er).join(`
`)),o=Va(o),o=$l(o,t),o=eu(o,t),a=Va(a),a=$l(a,t),a=eu(a,t),o=tu(o),a=tu(a),t.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Ls?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ls?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const E=A+m+o,x=A+p+a,w=ql(r,r.VERTEX_SHADER,E),b=ql(r,r.FRAGMENT_SHADER,x);r.attachShader(_,w),r.attachShader(_,b),t.index0AttributeName!==void 0?r.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function R(C){if(n.debug.checkShaderErrors){const U=r.getProgramInfoLog(_)||"",k=r.getShaderInfoLog(w)||"",V=r.getShaderInfoLog(b)||"",H=U.trim(),W=k.trim(),$=V.trim();let X=!0,te=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(X=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,_,w,b);else{const ae=Jl(r,w,"vertex"),_e=Jl(r,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+H+`
`+ae+`
`+_e)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):(W===""||$==="")&&(te=!1);te&&(C.diagnostics={runnable:X,programLog:H,vertexShader:{log:W,prefix:m},fragmentShader:{log:$,prefix:p}})}r.deleteShader(w),r.deleteShader(b),I=new Ts(r,_),M=ey(r,_)}let I;this.getUniforms=function(){return I===void 0&&R(this),I};let M;this.getAttributes=function(){return M===void 0&&R(this),M};let S=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=r.getProgramParameter(_,XS)),S},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=YS++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=w,this.fragmentShader=b,this}let fy=0;class dy{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new py(e),t.set(e,i)),i}}class py{constructor(e){this.id=fy++,this.code=e,this.usedTimes=0}}function my(n,e,t,i,r,s,o){const a=new zh,c=new dy,l=new Set,u=[],h=r.logarithmicDepthBuffer,f=r.vertexTextures;let d=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(M){return l.add(M),M===0?"uv":`uv${M}`}function m(M,S,C,U,k){const V=U.fog,H=k.geometry,W=M.isMeshStandardMaterial?U.environment:null,$=(M.isMeshStandardMaterial?t:e).get(M.envMap||W),X=$&&$.mapping===Ws?$.image.height:null,te=g[M.type];M.precision!==null&&(d=r.getMaxPrecision(M.precision),d!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",d,"instead."));const ae=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,_e=ae!==void 0?ae.length:0;let ye=0;H.morphAttributes.position!==void 0&&(ye=1),H.morphAttributes.normal!==void 0&&(ye=2),H.morphAttributes.color!==void 0&&(ye=3);let Ve,Ce,Pe,K;if(te){const et=gn[te];Ve=et.vertexShader,Ce=et.fragmentShader}else Ve=M.vertexShader,Ce=M.fragmentShader,c.update(M),Pe=c.getVertexShaderID(M),K=c.getFragmentShaderID(M);const Q=n.getRenderTarget(),pe=n.state.buffers.depth.getReversed(),Me=k.isInstancedMesh===!0,fe=k.isBatchedMesh===!0,Te=!!M.map,at=!!M.matcap,P=!!$,Je=!!M.aoMap,ke=!!M.lightMap,Ie=!!M.bumpMap,xe=!!M.normalMap,$e=!!M.displacementMap,Ae=!!M.emissiveMap,F=!!M.metalnessMap,q=!!M.roughnessMap,le=M.anisotropy>0,T=M.clearcoat>0,v=M.dispersion>0,L=M.iridescence>0,D=M.sheen>0,G=M.transmission>0,O=le&&!!M.anisotropyMap,ce=T&&!!M.clearcoatMap,ie=T&&!!M.clearcoatNormalMap,Ee=T&&!!M.clearcoatRoughnessMap,be=L&&!!M.iridescenceMap,ne=L&&!!M.iridescenceThicknessMap,ue=D&&!!M.sheenColorMap,Be=D&&!!M.sheenRoughnessMap,De=!!M.specularMap,me=!!M.specularColorMap,He=!!M.specularIntensityMap,N=G&&!!M.transmissionMap,oe=G&&!!M.thicknessMap,he=!!M.gradientMap,Se=!!M.alphaMap,re=M.alphaTest>0,ee=!!M.alphaHash,Re=!!M.extensions;let Ge=Qn;M.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(Ge=n.toneMapping);const ct={shaderID:te,shaderType:M.type,shaderName:M.name,vertexShader:Ve,fragmentShader:Ce,defines:M.defines,customVertexShaderID:Pe,customFragmentShaderID:K,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:d,batching:fe,batchingColor:fe&&k._colorsTexture!==null,instancing:Me,instancingColor:Me&&k.instanceColor!==null,instancingMorph:Me&&k.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:Q===null?n.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:Qi,alphaToCoverage:!!M.alphaToCoverage,map:Te,matcap:at,envMap:P,envMapMode:P&&$.mapping,envMapCubeUVHeight:X,aoMap:Je,lightMap:ke,bumpMap:Ie,normalMap:xe,displacementMap:f&&$e,emissiveMap:Ae,normalMapObjectSpace:xe&&M.normalMapType===Q0,normalMapTangentSpace:xe&&M.normalMapType===q0,metalnessMap:F,roughnessMap:q,anisotropy:le,anisotropyMap:O,clearcoat:T,clearcoatMap:ce,clearcoatNormalMap:ie,clearcoatRoughnessMap:Ee,dispersion:v,iridescence:L,iridescenceMap:be,iridescenceThicknessMap:ne,sheen:D,sheenColorMap:ue,sheenRoughnessMap:Be,specularMap:De,specularColorMap:me,specularIntensityMap:He,transmission:G,transmissionMap:N,thicknessMap:oe,gradientMap:he,opaque:M.transparent===!1&&M.blending===Wi&&M.alphaToCoverage===!1,alphaMap:Se,alphaTest:re,alphaHash:ee,combine:M.combine,mapUv:Te&&_(M.map.channel),aoMapUv:Je&&_(M.aoMap.channel),lightMapUv:ke&&_(M.lightMap.channel),bumpMapUv:Ie&&_(M.bumpMap.channel),normalMapUv:xe&&_(M.normalMap.channel),displacementMapUv:$e&&_(M.displacementMap.channel),emissiveMapUv:Ae&&_(M.emissiveMap.channel),metalnessMapUv:F&&_(M.metalnessMap.channel),roughnessMapUv:q&&_(M.roughnessMap.channel),anisotropyMapUv:O&&_(M.anisotropyMap.channel),clearcoatMapUv:ce&&_(M.clearcoatMap.channel),clearcoatNormalMapUv:ie&&_(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ee&&_(M.clearcoatRoughnessMap.channel),iridescenceMapUv:be&&_(M.iridescenceMap.channel),iridescenceThicknessMapUv:ne&&_(M.iridescenceThicknessMap.channel),sheenColorMapUv:ue&&_(M.sheenColorMap.channel),sheenRoughnessMapUv:Be&&_(M.sheenRoughnessMap.channel),specularMapUv:De&&_(M.specularMap.channel),specularColorMapUv:me&&_(M.specularColorMap.channel),specularIntensityMapUv:He&&_(M.specularIntensityMap.channel),transmissionMapUv:N&&_(M.transmissionMap.channel),thicknessMapUv:oe&&_(M.thicknessMap.channel),alphaMapUv:Se&&_(M.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(xe||le),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!H.attributes.uv&&(Te||Se),fog:!!V,useFog:M.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:M.flatShading===!0&&M.wireframe===!1,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:pe,skinning:k.isSkinnedMesh===!0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:_e,morphTextureStride:ye,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:n.shadowMap.enabled&&C.length>0,shadowMapType:n.shadowMap.type,toneMapping:Ge,decodeVideoTexture:Te&&M.map.isVideoTexture===!0&&Ke.getTransfer(M.map.colorSpace)===rt,decodeVideoTextureEmissive:Ae&&M.emissiveMap.isVideoTexture===!0&&Ke.getTransfer(M.emissiveMap.colorSpace)===rt,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===_n,flipSided:M.side===Ft,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Re&&M.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Re&&M.extensions.multiDraw===!0||fe)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return ct.vertexUv1s=l.has(1),ct.vertexUv2s=l.has(2),ct.vertexUv3s=l.has(3),l.clear(),ct}function p(M){const S=[];if(M.shaderID?S.push(M.shaderID):(S.push(M.customVertexShaderID),S.push(M.customFragmentShaderID)),M.defines!==void 0)for(const C in M.defines)S.push(C),S.push(M.defines[C]);return M.isRawShaderMaterial===!1&&(A(S,M),E(S,M),S.push(n.outputColorSpace)),S.push(M.customProgramCacheKey),S.join()}function A(M,S){M.push(S.precision),M.push(S.outputColorSpace),M.push(S.envMapMode),M.push(S.envMapCubeUVHeight),M.push(S.mapUv),M.push(S.alphaMapUv),M.push(S.lightMapUv),M.push(S.aoMapUv),M.push(S.bumpMapUv),M.push(S.normalMapUv),M.push(S.displacementMapUv),M.push(S.emissiveMapUv),M.push(S.metalnessMapUv),M.push(S.roughnessMapUv),M.push(S.anisotropyMapUv),M.push(S.clearcoatMapUv),M.push(S.clearcoatNormalMapUv),M.push(S.clearcoatRoughnessMapUv),M.push(S.iridescenceMapUv),M.push(S.iridescenceThicknessMapUv),M.push(S.sheenColorMapUv),M.push(S.sheenRoughnessMapUv),M.push(S.specularMapUv),M.push(S.specularColorMapUv),M.push(S.specularIntensityMapUv),M.push(S.transmissionMapUv),M.push(S.thicknessMapUv),M.push(S.combine),M.push(S.fogExp2),M.push(S.sizeAttenuation),M.push(S.morphTargetsCount),M.push(S.morphAttributeCount),M.push(S.numDirLights),M.push(S.numPointLights),M.push(S.numSpotLights),M.push(S.numSpotLightMaps),M.push(S.numHemiLights),M.push(S.numRectAreaLights),M.push(S.numDirLightShadows),M.push(S.numPointLightShadows),M.push(S.numSpotLightShadows),M.push(S.numSpotLightShadowsWithMaps),M.push(S.numLightProbes),M.push(S.shadowMapType),M.push(S.toneMapping),M.push(S.numClippingPlanes),M.push(S.numClipIntersection),M.push(S.depthPacking)}function E(M,S){a.disableAll(),S.supportsVertexTextures&&a.enable(0),S.instancing&&a.enable(1),S.instancingColor&&a.enable(2),S.instancingMorph&&a.enable(3),S.matcap&&a.enable(4),S.envMap&&a.enable(5),S.normalMapObjectSpace&&a.enable(6),S.normalMapTangentSpace&&a.enable(7),S.clearcoat&&a.enable(8),S.iridescence&&a.enable(9),S.alphaTest&&a.enable(10),S.vertexColors&&a.enable(11),S.vertexAlphas&&a.enable(12),S.vertexUv1s&&a.enable(13),S.vertexUv2s&&a.enable(14),S.vertexUv3s&&a.enable(15),S.vertexTangents&&a.enable(16),S.anisotropy&&a.enable(17),S.alphaHash&&a.enable(18),S.batching&&a.enable(19),S.dispersion&&a.enable(20),S.batchingColor&&a.enable(21),S.gradientMap&&a.enable(22),M.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reversedDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),M.push(a.mask)}function x(M){const S=g[M.type];let C;if(S){const U=gn[S];C=Hv.clone(U.uniforms)}else C=M.uniforms;return C}function w(M,S){let C;for(let U=0,k=u.length;U<k;U++){const V=u[U];if(V.cacheKey===S){C=V,++C.usedTimes;break}}return C===void 0&&(C=new hy(n,S,M,s),u.push(C)),C}function b(M){if(--M.usedTimes===0){const S=u.indexOf(M);u[S]=u[u.length-1],u.pop(),M.destroy()}}function R(M){c.remove(M)}function I(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:x,acquireProgram:w,releaseProgram:b,releaseShaderCache:R,programs:u,dispose:I}}function gy(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function r(o,a,c){n.get(o)[a]=c}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function _y(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function iu(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function ru(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(h,f,d,g,_,m){let p=n[e];return p===void 0?(p={id:h.id,object:h,geometry:f,material:d,groupOrder:g,renderOrder:h.renderOrder,z:_,group:m},n[e]=p):(p.id=h.id,p.object=h,p.geometry=f,p.material=d,p.groupOrder=g,p.renderOrder=h.renderOrder,p.z=_,p.group=m),e++,p}function a(h,f,d,g,_,m){const p=o(h,f,d,g,_,m);d.transmission>0?i.push(p):d.transparent===!0?r.push(p):t.push(p)}function c(h,f,d,g,_,m){const p=o(h,f,d,g,_,m);d.transmission>0?i.unshift(p):d.transparent===!0?r.unshift(p):t.unshift(p)}function l(h,f){t.length>1&&t.sort(h||_y),i.length>1&&i.sort(f||iu),r.length>1&&r.sort(f||iu)}function u(){for(let h=e,f=n.length;h<f;h++){const d=n[h];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:a,unshift:c,finish:u,sort:l}}function vy(){let n=new WeakMap;function e(i,r){const s=n.get(i);let o;return s===void 0?(o=new ru,n.set(i,[o])):r>=s.length?(o=new ru,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function xy(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new Y,color:new qe};break;case"SpotLight":t={position:new Y,direction:new Y,color:new qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new Y,color:new qe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new Y,skyColor:new qe,groundColor:new qe};break;case"RectAreaLight":t={color:new qe,position:new Y,halfWidth:new Y,halfHeight:new Y};break}return n[e.id]=t,t}}}function Ay(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let Ey=0;function Sy(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function yy(n){const e=new xy,t=Ay(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new Y);const r=new Y,s=new yt,o=new yt;function a(l){let u=0,h=0,f=0;for(let M=0;M<9;M++)i.probe[M].set(0,0,0);let d=0,g=0,_=0,m=0,p=0,A=0,E=0,x=0,w=0,b=0,R=0;l.sort(Sy);for(let M=0,S=l.length;M<S;M++){const C=l[M],U=C.color,k=C.intensity,V=C.distance,H=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)u+=U.r*k,h+=U.g*k,f+=U.b*k;else if(C.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(C.sh.coefficients[W],k);R++}else if(C.isDirectionalLight){const W=e.get(C);if(W.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const $=C.shadow,X=t.get(C);X.shadowIntensity=$.intensity,X.shadowBias=$.bias,X.shadowNormalBias=$.normalBias,X.shadowRadius=$.radius,X.shadowMapSize=$.mapSize,i.directionalShadow[d]=X,i.directionalShadowMap[d]=H,i.directionalShadowMatrix[d]=C.shadow.matrix,A++}i.directional[d]=W,d++}else if(C.isSpotLight){const W=e.get(C);W.position.setFromMatrixPosition(C.matrixWorld),W.color.copy(U).multiplyScalar(k),W.distance=V,W.coneCos=Math.cos(C.angle),W.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),W.decay=C.decay,i.spot[_]=W;const $=C.shadow;if(C.map&&(i.spotLightMap[w]=C.map,w++,$.updateMatrices(C),C.castShadow&&b++),i.spotLightMatrix[_]=$.matrix,C.castShadow){const X=t.get(C);X.shadowIntensity=$.intensity,X.shadowBias=$.bias,X.shadowNormalBias=$.normalBias,X.shadowRadius=$.radius,X.shadowMapSize=$.mapSize,i.spotShadow[_]=X,i.spotShadowMap[_]=H,x++}_++}else if(C.isRectAreaLight){const W=e.get(C);W.color.copy(U).multiplyScalar(k),W.halfWidth.set(C.width*.5,0,0),W.halfHeight.set(0,C.height*.5,0),i.rectArea[m]=W,m++}else if(C.isPointLight){const W=e.get(C);if(W.color.copy(C.color).multiplyScalar(C.intensity),W.distance=C.distance,W.decay=C.decay,C.castShadow){const $=C.shadow,X=t.get(C);X.shadowIntensity=$.intensity,X.shadowBias=$.bias,X.shadowNormalBias=$.normalBias,X.shadowRadius=$.radius,X.shadowMapSize=$.mapSize,X.shadowCameraNear=$.camera.near,X.shadowCameraFar=$.camera.far,i.pointShadow[g]=X,i.pointShadowMap[g]=H,i.pointShadowMatrix[g]=C.shadow.matrix,E++}i.point[g]=W,g++}else if(C.isHemisphereLight){const W=e.get(C);W.skyColor.copy(C.color).multiplyScalar(k),W.groundColor.copy(C.groundColor).multiplyScalar(k),i.hemi[p]=W,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=de.LTC_FLOAT_1,i.rectAreaLTC2=de.LTC_FLOAT_2):(i.rectAreaLTC1=de.LTC_HALF_1,i.rectAreaLTC2=de.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=f;const I=i.hash;(I.directionalLength!==d||I.pointLength!==g||I.spotLength!==_||I.rectAreaLength!==m||I.hemiLength!==p||I.numDirectionalShadows!==A||I.numPointShadows!==E||I.numSpotShadows!==x||I.numSpotMaps!==w||I.numLightProbes!==R)&&(i.directional.length=d,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=A,i.directionalShadowMap.length=A,i.pointShadow.length=E,i.pointShadowMap.length=E,i.spotShadow.length=x,i.spotShadowMap.length=x,i.directionalShadowMatrix.length=A,i.pointShadowMatrix.length=E,i.spotLightMatrix.length=x+w-b,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=b,i.numLightProbes=R,I.directionalLength=d,I.pointLength=g,I.spotLength=_,I.rectAreaLength=m,I.hemiLength=p,I.numDirectionalShadows=A,I.numPointShadows=E,I.numSpotShadows=x,I.numSpotMaps=w,I.numLightProbes=R,i.version=Ey++)}function c(l,u){let h=0,f=0,d=0,g=0,_=0;const m=u.matrixWorldInverse;for(let p=0,A=l.length;p<A;p++){const E=l[p];if(E.isDirectionalLight){const x=i.directional[h];x.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),x.direction.sub(r),x.direction.transformDirection(m),h++}else if(E.isSpotLight){const x=i.spot[d];x.position.setFromMatrixPosition(E.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),x.direction.sub(r),x.direction.transformDirection(m),d++}else if(E.isRectAreaLight){const x=i.rectArea[g];x.position.setFromMatrixPosition(E.matrixWorld),x.position.applyMatrix4(m),o.identity(),s.copy(E.matrixWorld),s.premultiply(m),o.extractRotation(s),x.halfWidth.set(E.width*.5,0,0),x.halfHeight.set(0,E.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),g++}else if(E.isPointLight){const x=i.point[f];x.position.setFromMatrixPosition(E.matrixWorld),x.position.applyMatrix4(m),f++}else if(E.isHemisphereLight){const x=i.hemi[_];x.direction.setFromMatrixPosition(E.matrixWorld),x.direction.transformDirection(m),_++}}}return{setup:a,setupView:c,state:i}}function su(n){const e=new yy(n),t=[],i=[];function r(u){l.camera=u,t.length=0,i.length=0}function s(u){t.push(u)}function o(u){i.push(u)}function a(){e.setup(t)}function c(u){e.setupView(t,u)}const l={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:a,setupLightsView:c,pushLight:s,pushShadow:o}}function My(n){let e=new WeakMap;function t(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new su(n),e.set(r,[a])):s>=o.length?(a=new su(n),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:t,dispose:i}}const by=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,wy=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Ty(n,e,t){let i=new jh;const r=new st,s=new st,o=new xt,a=new $v({depthPacking:K0}),c=new ex,l={},u=t.maxTextureSize,h={[Bn]:Ft,[Ft]:Bn,[_n]:_n},f=new Mn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new st},radius:{value:4}},vertexShader:by,fragmentShader:wy}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const g=new bn;g.setAttribute("position",new kt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new zt(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Th;let p=this.type;this.render=function(b,R,I){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;const M=n.getRenderTarget(),S=n.getActiveCubeFace(),C=n.getActiveMipmapLevel(),U=n.state;U.setBlending(qn),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const k=p!==In&&this.type===In,V=p===In&&this.type!==In;for(let H=0,W=b.length;H<W;H++){const $=b[H],X=$.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;r.copy(X.mapSize);const te=X.getFrameExtents();if(r.multiply(te),s.copy(X.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/te.x),r.x=s.x*te.x,X.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/te.y),r.y=s.y*te.y,X.mapSize.y=s.y)),X.map===null||k===!0||V===!0){const _e=this.type!==In?{minFilter:Vt,magFilter:Vt}:{};X.map!==null&&X.map.dispose(),X.map=new Ei(r.x,r.y,_e),X.map.texture.name=$.name+".shadowMap",X.camera.updateProjectionMatrix()}n.setRenderTarget(X.map),n.clear();const ae=X.getViewportCount();for(let _e=0;_e<ae;_e++){const ye=X.getViewport(_e);o.set(s.x*ye.x,s.y*ye.y,s.x*ye.z,s.y*ye.w),U.viewport(o),X.updateMatrices($,_e),i=X.getFrustum(),x(R,I,X.camera,$,this.type)}X.isPointLightShadow!==!0&&this.type===In&&A(X,I),X.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(M,S,C)};function A(b,R){const I=e.update(_);f.defines.VSM_SAMPLES!==b.blurSamples&&(f.defines.VSM_SAMPLES=b.blurSamples,d.defines.VSM_SAMPLES=b.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new Ei(r.x,r.y)),f.uniforms.shadow_pass.value=b.map.texture,f.uniforms.resolution.value=b.mapSize,f.uniforms.radius.value=b.radius,n.setRenderTarget(b.mapPass),n.clear(),n.renderBufferDirect(R,null,I,f,_,null),d.uniforms.shadow_pass.value=b.mapPass.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,n.setRenderTarget(b.map),n.clear(),n.renderBufferDirect(R,null,I,d,_,null)}function E(b,R,I,M){let S=null;const C=I.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(C!==void 0)S=C;else if(S=I.isPointLight===!0?c:a,n.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const U=S.uuid,k=R.uuid;let V=l[U];V===void 0&&(V={},l[U]=V);let H=V[k];H===void 0&&(H=S.clone(),V[k]=H,R.addEventListener("dispose",w)),S=H}if(S.visible=R.visible,S.wireframe=R.wireframe,M===In?S.side=R.shadowSide!==null?R.shadowSide:R.side:S.side=R.shadowSide!==null?R.shadowSide:h[R.side],S.alphaMap=R.alphaMap,S.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,S.map=R.map,S.clipShadows=R.clipShadows,S.clippingPlanes=R.clippingPlanes,S.clipIntersection=R.clipIntersection,S.displacementMap=R.displacementMap,S.displacementScale=R.displacementScale,S.displacementBias=R.displacementBias,S.wireframeLinewidth=R.wireframeLinewidth,S.linewidth=R.linewidth,I.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const U=n.properties.get(S);U.light=I}return S}function x(b,R,I,M,S){if(b.visible===!1)return;if(b.layers.test(R.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&S===In)&&(!b.frustumCulled||i.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,b.matrixWorld);const k=e.update(b),V=b.material;if(Array.isArray(V)){const H=k.groups;for(let W=0,$=H.length;W<$;W++){const X=H[W],te=V[X.materialIndex];if(te&&te.visible){const ae=E(b,te,M,S);b.onBeforeShadow(n,b,R,I,k,ae,X),n.renderBufferDirect(I,null,k,ae,b,X),b.onAfterShadow(n,b,R,I,k,ae,X)}}}else if(V.visible){const H=E(b,V,M,S);b.onBeforeShadow(n,b,R,I,k,H,null),n.renderBufferDirect(I,null,k,H,b,null),b.onAfterShadow(n,b,R,I,k,H,null)}}const U=b.children;for(let k=0,V=U.length;k<V;k++)x(U[k],R,I,M,S)}function w(b){b.target.removeEventListener("dispose",w);for(const I in l){const M=l[I],S=b.target.uuid;S in M&&(M[S].dispose(),delete M[S])}}}const Ry={[ia]:ra,[sa]:ca,[oa]:la,[ji]:aa,[ra]:ia,[ca]:sa,[la]:oa,[aa]:ji};function Cy(n,e){function t(){let N=!1;const oe=new xt;let he=null;const Se=new xt(0,0,0,0);return{setMask:function(re){he!==re&&!N&&(n.colorMask(re,re,re,re),he=re)},setLocked:function(re){N=re},setClear:function(re,ee,Re,Ge,ct){ct===!0&&(re*=Ge,ee*=Ge,Re*=Ge),oe.set(re,ee,Re,Ge),Se.equals(oe)===!1&&(n.clearColor(re,ee,Re,Ge),Se.copy(oe))},reset:function(){N=!1,he=null,Se.set(-1,0,0,0)}}}function i(){let N=!1,oe=!1,he=null,Se=null,re=null;return{setReversed:function(ee){if(oe!==ee){const Re=e.get("EXT_clip_control");ee?Re.clipControlEXT(Re.LOWER_LEFT_EXT,Re.ZERO_TO_ONE_EXT):Re.clipControlEXT(Re.LOWER_LEFT_EXT,Re.NEGATIVE_ONE_TO_ONE_EXT),oe=ee;const Ge=re;re=null,this.setClear(Ge)}},getReversed:function(){return oe},setTest:function(ee){ee?Q(n.DEPTH_TEST):pe(n.DEPTH_TEST)},setMask:function(ee){he!==ee&&!N&&(n.depthMask(ee),he=ee)},setFunc:function(ee){if(oe&&(ee=Ry[ee]),Se!==ee){switch(ee){case ia:n.depthFunc(n.NEVER);break;case ra:n.depthFunc(n.ALWAYS);break;case sa:n.depthFunc(n.LESS);break;case ji:n.depthFunc(n.LEQUAL);break;case oa:n.depthFunc(n.EQUAL);break;case aa:n.depthFunc(n.GEQUAL);break;case ca:n.depthFunc(n.GREATER);break;case la:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Se=ee}},setLocked:function(ee){N=ee},setClear:function(ee){re!==ee&&(oe&&(ee=1-ee),n.clearDepth(ee),re=ee)},reset:function(){N=!1,he=null,Se=null,re=null,oe=!1}}}function r(){let N=!1,oe=null,he=null,Se=null,re=null,ee=null,Re=null,Ge=null,ct=null;return{setTest:function(et){N||(et?Q(n.STENCIL_TEST):pe(n.STENCIL_TEST))},setMask:function(et){oe!==et&&!N&&(n.stencilMask(et),oe=et)},setFunc:function(et,wn,dn){(he!==et||Se!==wn||re!==dn)&&(n.stencilFunc(et,wn,dn),he=et,Se=wn,re=dn)},setOp:function(et,wn,dn){(ee!==et||Re!==wn||Ge!==dn)&&(n.stencilOp(et,wn,dn),ee=et,Re=wn,Ge=dn)},setLocked:function(et){N=et},setClear:function(et){ct!==et&&(n.clearStencil(et),ct=et)},reset:function(){N=!1,oe=null,he=null,Se=null,re=null,ee=null,Re=null,Ge=null,ct=null}}}const s=new t,o=new i,a=new r,c=new WeakMap,l=new WeakMap;let u={},h={},f=new WeakMap,d=[],g=null,_=!1,m=null,p=null,A=null,E=null,x=null,w=null,b=null,R=new qe(0,0,0),I=0,M=!1,S=null,C=null,U=null,k=null,V=null;const H=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,$=0;const X=n.getParameter(n.VERSION);X.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(X)[1]),W=$>=1):X.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),W=$>=2);let te=null,ae={};const _e=n.getParameter(n.SCISSOR_BOX),ye=n.getParameter(n.VIEWPORT),Ve=new xt().fromArray(_e),Ce=new xt().fromArray(ye);function Pe(N,oe,he,Se){const re=new Uint8Array(4),ee=n.createTexture();n.bindTexture(N,ee),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Re=0;Re<he;Re++)N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY?n.texImage3D(oe,0,n.RGBA,1,1,Se,0,n.RGBA,n.UNSIGNED_BYTE,re):n.texImage2D(oe+Re,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,re);return ee}const K={};K[n.TEXTURE_2D]=Pe(n.TEXTURE_2D,n.TEXTURE_2D,1),K[n.TEXTURE_CUBE_MAP]=Pe(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),K[n.TEXTURE_2D_ARRAY]=Pe(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),K[n.TEXTURE_3D]=Pe(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),Q(n.DEPTH_TEST),o.setFunc(ji),Ie(!1),xe(hl),Q(n.CULL_FACE),Je(qn);function Q(N){u[N]!==!0&&(n.enable(N),u[N]=!0)}function pe(N){u[N]!==!1&&(n.disable(N),u[N]=!1)}function Me(N,oe){return h[N]!==oe?(n.bindFramebuffer(N,oe),h[N]=oe,N===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=oe),N===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=oe),!0):!1}function fe(N,oe){let he=d,Se=!1;if(N){he=f.get(oe),he===void 0&&(he=[],f.set(oe,he));const re=N.textures;if(he.length!==re.length||he[0]!==n.COLOR_ATTACHMENT0){for(let ee=0,Re=re.length;ee<Re;ee++)he[ee]=n.COLOR_ATTACHMENT0+ee;he.length=re.length,Se=!0}}else he[0]!==n.BACK&&(he[0]=n.BACK,Se=!0);Se&&n.drawBuffers(he)}function Te(N){return g!==N?(n.useProgram(N),g=N,!0):!1}const at={[di]:n.FUNC_ADD,[E0]:n.FUNC_SUBTRACT,[S0]:n.FUNC_REVERSE_SUBTRACT};at[y0]=n.MIN,at[M0]=n.MAX;const P={[b0]:n.ZERO,[w0]:n.ONE,[T0]:n.SRC_COLOR,[ta]:n.SRC_ALPHA,[U0]:n.SRC_ALPHA_SATURATE,[D0]:n.DST_COLOR,[C0]:n.DST_ALPHA,[R0]:n.ONE_MINUS_SRC_COLOR,[na]:n.ONE_MINUS_SRC_ALPHA,[I0]:n.ONE_MINUS_DST_COLOR,[P0]:n.ONE_MINUS_DST_ALPHA,[L0]:n.CONSTANT_COLOR,[N0]:n.ONE_MINUS_CONSTANT_COLOR,[k0]:n.CONSTANT_ALPHA,[F0]:n.ONE_MINUS_CONSTANT_ALPHA};function Je(N,oe,he,Se,re,ee,Re,Ge,ct,et){if(N===qn){_===!0&&(pe(n.BLEND),_=!1);return}if(_===!1&&(Q(n.BLEND),_=!0),N!==A0){if(N!==m||et!==M){if((p!==di||x!==di)&&(n.blendEquation(n.FUNC_ADD),p=di,x=di),et)switch(N){case Wi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case fl:n.blendFunc(n.ONE,n.ONE);break;case dl:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case pl:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case Wi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case fl:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case dl:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case pl:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}A=null,E=null,w=null,b=null,R.set(0,0,0),I=0,m=N,M=et}return}re=re||oe,ee=ee||he,Re=Re||Se,(oe!==p||re!==x)&&(n.blendEquationSeparate(at[oe],at[re]),p=oe,x=re),(he!==A||Se!==E||ee!==w||Re!==b)&&(n.blendFuncSeparate(P[he],P[Se],P[ee],P[Re]),A=he,E=Se,w=ee,b=Re),(Ge.equals(R)===!1||ct!==I)&&(n.blendColor(Ge.r,Ge.g,Ge.b,ct),R.copy(Ge),I=ct),m=N,M=!1}function ke(N,oe){N.side===_n?pe(n.CULL_FACE):Q(n.CULL_FACE);let he=N.side===Ft;oe&&(he=!he),Ie(he),N.blending===Wi&&N.transparent===!1?Je(qn):Je(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),s.setMask(N.colorWrite);const Se=N.stencilWrite;a.setTest(Se),Se&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Ae(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?Q(n.SAMPLE_ALPHA_TO_COVERAGE):pe(n.SAMPLE_ALPHA_TO_COVERAGE)}function Ie(N){S!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),S=N)}function xe(N){N!==_0?(Q(n.CULL_FACE),N!==C&&(N===hl?n.cullFace(n.BACK):N===v0?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):pe(n.CULL_FACE),C=N}function $e(N){N!==U&&(W&&n.lineWidth(N),U=N)}function Ae(N,oe,he){N?(Q(n.POLYGON_OFFSET_FILL),(k!==oe||V!==he)&&(n.polygonOffset(oe,he),k=oe,V=he)):pe(n.POLYGON_OFFSET_FILL)}function F(N){N?Q(n.SCISSOR_TEST):pe(n.SCISSOR_TEST)}function q(N){N===void 0&&(N=n.TEXTURE0+H-1),te!==N&&(n.activeTexture(N),te=N)}function le(N,oe,he){he===void 0&&(te===null?he=n.TEXTURE0+H-1:he=te);let Se=ae[he];Se===void 0&&(Se={type:void 0,texture:void 0},ae[he]=Se),(Se.type!==N||Se.texture!==oe)&&(te!==he&&(n.activeTexture(he),te=he),n.bindTexture(N,oe||K[N]),Se.type=N,Se.texture=oe)}function T(){const N=ae[te];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function v(){try{n.compressedTexImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function L(){try{n.compressedTexImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function D(){try{n.texSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function G(){try{n.texSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function O(){try{n.compressedTexSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ce(){try{n.compressedTexSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ie(){try{n.texStorage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ee(){try{n.texStorage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function be(){try{n.texImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ne(){try{n.texImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ue(N){Ve.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),Ve.copy(N))}function Be(N){Ce.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),Ce.copy(N))}function De(N,oe){let he=l.get(oe);he===void 0&&(he=new WeakMap,l.set(oe,he));let Se=he.get(N);Se===void 0&&(Se=n.getUniformBlockIndex(oe,N.name),he.set(N,Se))}function me(N,oe){const Se=l.get(oe).get(N);c.get(oe)!==Se&&(n.uniformBlockBinding(oe,Se,N.__bindingPointIndex),c.set(oe,Se))}function He(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},te=null,ae={},h={},f=new WeakMap,d=[],g=null,_=!1,m=null,p=null,A=null,E=null,x=null,w=null,b=null,R=new qe(0,0,0),I=0,M=!1,S=null,C=null,U=null,k=null,V=null,Ve.set(0,0,n.canvas.width,n.canvas.height),Ce.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:Q,disable:pe,bindFramebuffer:Me,drawBuffers:fe,useProgram:Te,setBlending:Je,setMaterial:ke,setFlipSided:Ie,setCullFace:xe,setLineWidth:$e,setPolygonOffset:Ae,setScissorTest:F,activeTexture:q,bindTexture:le,unbindTexture:T,compressedTexImage2D:v,compressedTexImage3D:L,texImage2D:be,texImage3D:ne,updateUBOMapping:De,uniformBlockBinding:me,texStorage2D:ie,texStorage3D:Ee,texSubImage2D:D,texSubImage3D:G,compressedTexSubImage2D:O,compressedTexSubImage3D:ce,scissor:ue,viewport:Be,reset:He}}function Py(n,e,t,i,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new st,u=new WeakMap;let h;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,v){return d?new OffscreenCanvas(T,v):ks("canvas")}function _(T,v,L){let D=1;const G=le(T);if((G.width>L||G.height>L)&&(D=L/Math.max(G.width,G.height)),D<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const O=Math.floor(D*G.width),ce=Math.floor(D*G.height);h===void 0&&(h=g(O,ce));const ie=v?g(O,ce):h;return ie.width=O,ie.height=ce,ie.getContext("2d").drawImage(T,0,0,O,ce),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+G.width+"x"+G.height+") to ("+O+"x"+ce+")."),ie}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+G.width+"x"+G.height+")."),T;return T}function m(T){return T.generateMipmaps}function p(T){n.generateMipmap(T)}function A(T){return T.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?n.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function E(T,v,L,D,G=!1){if(T!==null){if(n[T]!==void 0)return n[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let O=v;if(v===n.RED&&(L===n.FLOAT&&(O=n.R32F),L===n.HALF_FLOAT&&(O=n.R16F),L===n.UNSIGNED_BYTE&&(O=n.R8)),v===n.RED_INTEGER&&(L===n.UNSIGNED_BYTE&&(O=n.R8UI),L===n.UNSIGNED_SHORT&&(O=n.R16UI),L===n.UNSIGNED_INT&&(O=n.R32UI),L===n.BYTE&&(O=n.R8I),L===n.SHORT&&(O=n.R16I),L===n.INT&&(O=n.R32I)),v===n.RG&&(L===n.FLOAT&&(O=n.RG32F),L===n.HALF_FLOAT&&(O=n.RG16F),L===n.UNSIGNED_BYTE&&(O=n.RG8)),v===n.RG_INTEGER&&(L===n.UNSIGNED_BYTE&&(O=n.RG8UI),L===n.UNSIGNED_SHORT&&(O=n.RG16UI),L===n.UNSIGNED_INT&&(O=n.RG32UI),L===n.BYTE&&(O=n.RG8I),L===n.SHORT&&(O=n.RG16I),L===n.INT&&(O=n.RG32I)),v===n.RGB_INTEGER&&(L===n.UNSIGNED_BYTE&&(O=n.RGB8UI),L===n.UNSIGNED_SHORT&&(O=n.RGB16UI),L===n.UNSIGNED_INT&&(O=n.RGB32UI),L===n.BYTE&&(O=n.RGB8I),L===n.SHORT&&(O=n.RGB16I),L===n.INT&&(O=n.RGB32I)),v===n.RGBA_INTEGER&&(L===n.UNSIGNED_BYTE&&(O=n.RGBA8UI),L===n.UNSIGNED_SHORT&&(O=n.RGBA16UI),L===n.UNSIGNED_INT&&(O=n.RGBA32UI),L===n.BYTE&&(O=n.RGBA8I),L===n.SHORT&&(O=n.RGBA16I),L===n.INT&&(O=n.RGBA32I)),v===n.RGB&&(L===n.UNSIGNED_INT_5_9_9_9_REV&&(O=n.RGB9_E5),L===n.UNSIGNED_INT_10F_11F_11F_REV&&(O=n.R11F_G11F_B10F)),v===n.RGBA){const ce=G?Us:Ke.getTransfer(D);L===n.FLOAT&&(O=n.RGBA32F),L===n.HALF_FLOAT&&(O=n.RGBA16F),L===n.UNSIGNED_BYTE&&(O=ce===rt?n.SRGB8_ALPHA8:n.RGBA8),L===n.UNSIGNED_SHORT_4_4_4_4&&(O=n.RGBA4),L===n.UNSIGNED_SHORT_5_5_5_1&&(O=n.RGB5_A1)}return(O===n.R16F||O===n.R32F||O===n.RG16F||O===n.RG32F||O===n.RGBA16F||O===n.RGBA32F)&&e.get("EXT_color_buffer_float"),O}function x(T,v){let L;return T?v===null||v===Ai||v===Ur?L=n.DEPTH24_STENCIL8:v===kn?L=n.DEPTH32F_STENCIL8:v===Ir&&(L=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===Ai||v===Ur?L=n.DEPTH_COMPONENT24:v===kn?L=n.DEPTH_COMPONENT32F:v===Ir&&(L=n.DEPTH_COMPONENT16),L}function w(T,v){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==Vt&&T.minFilter!==xn?Math.log2(Math.max(v.width,v.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?v.mipmaps.length:1}function b(T){const v=T.target;v.removeEventListener("dispose",b),I(v),v.isVideoTexture&&u.delete(v)}function R(T){const v=T.target;v.removeEventListener("dispose",R),S(v)}function I(T){const v=i.get(T);if(v.__webglInit===void 0)return;const L=T.source,D=f.get(L);if(D){const G=D[v.__cacheKey];G.usedTimes--,G.usedTimes===0&&M(T),Object.keys(D).length===0&&f.delete(L)}i.remove(T)}function M(T){const v=i.get(T);n.deleteTexture(v.__webglTexture);const L=T.source,D=f.get(L);delete D[v.__cacheKey],o.memory.textures--}function S(T){const v=i.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),i.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let D=0;D<6;D++){if(Array.isArray(v.__webglFramebuffer[D]))for(let G=0;G<v.__webglFramebuffer[D].length;G++)n.deleteFramebuffer(v.__webglFramebuffer[D][G]);else n.deleteFramebuffer(v.__webglFramebuffer[D]);v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer[D])}else{if(Array.isArray(v.__webglFramebuffer))for(let D=0;D<v.__webglFramebuffer.length;D++)n.deleteFramebuffer(v.__webglFramebuffer[D]);else n.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&n.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let D=0;D<v.__webglColorRenderbuffer.length;D++)v.__webglColorRenderbuffer[D]&&n.deleteRenderbuffer(v.__webglColorRenderbuffer[D]);v.__webglDepthRenderbuffer&&n.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const L=T.textures;for(let D=0,G=L.length;D<G;D++){const O=i.get(L[D]);O.__webglTexture&&(n.deleteTexture(O.__webglTexture),o.memory.textures--),i.remove(L[D])}i.remove(T)}let C=0;function U(){C=0}function k(){const T=C;return T>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+r.maxTextures),C+=1,T}function V(T){const v=[];return v.push(T.wrapS),v.push(T.wrapT),v.push(T.wrapR||0),v.push(T.magFilter),v.push(T.minFilter),v.push(T.anisotropy),v.push(T.internalFormat),v.push(T.format),v.push(T.type),v.push(T.generateMipmaps),v.push(T.premultiplyAlpha),v.push(T.flipY),v.push(T.unpackAlignment),v.push(T.colorSpace),v.join()}function H(T,v){const L=i.get(T);if(T.isVideoTexture&&F(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&L.__version!==T.version){const D=T.image;if(D===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(D.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{K(L,T,v);return}}else T.isExternalTexture&&(L.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,L.__webglTexture,n.TEXTURE0+v)}function W(T,v){const L=i.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&L.__version!==T.version){K(L,T,v);return}t.bindTexture(n.TEXTURE_2D_ARRAY,L.__webglTexture,n.TEXTURE0+v)}function $(T,v){const L=i.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&L.__version!==T.version){K(L,T,v);return}t.bindTexture(n.TEXTURE_3D,L.__webglTexture,n.TEXTURE0+v)}function X(T,v){const L=i.get(T);if(T.version>0&&L.__version!==T.version){Q(L,T,v);return}t.bindTexture(n.TEXTURE_CUBE_MAP,L.__webglTexture,n.TEXTURE0+v)}const te={[Dr]:n.REPEAT,[mi]:n.CLAMP_TO_EDGE,[fa]:n.MIRRORED_REPEAT},ae={[Vt]:n.NEAREST,[Z0]:n.NEAREST_MIPMAP_NEAREST,[Ar]:n.NEAREST_MIPMAP_LINEAR,[xn]:n.LINEAR,[uo]:n.LINEAR_MIPMAP_NEAREST,[gi]:n.LINEAR_MIPMAP_LINEAR},_e={[J0]:n.NEVER,[rv]:n.ALWAYS,[$0]:n.LESS,[Oh]:n.LEQUAL,[ev]:n.EQUAL,[iv]:n.GEQUAL,[tv]:n.GREATER,[nv]:n.NOTEQUAL};function ye(T,v){if(v.type===kn&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===xn||v.magFilter===uo||v.magFilter===Ar||v.magFilter===gi||v.minFilter===xn||v.minFilter===uo||v.minFilter===Ar||v.minFilter===gi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(T,n.TEXTURE_WRAP_S,te[v.wrapS]),n.texParameteri(T,n.TEXTURE_WRAP_T,te[v.wrapT]),(T===n.TEXTURE_3D||T===n.TEXTURE_2D_ARRAY)&&n.texParameteri(T,n.TEXTURE_WRAP_R,te[v.wrapR]),n.texParameteri(T,n.TEXTURE_MAG_FILTER,ae[v.magFilter]),n.texParameteri(T,n.TEXTURE_MIN_FILTER,ae[v.minFilter]),v.compareFunction&&(n.texParameteri(T,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(T,n.TEXTURE_COMPARE_FUNC,_e[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Vt||v.minFilter!==Ar&&v.minFilter!==gi||v.type===kn&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||i.get(v).__currentAnisotropy){const L=e.get("EXT_texture_filter_anisotropic");n.texParameterf(T,L.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,r.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy}}}function Ve(T,v){let L=!1;T.__webglInit===void 0&&(T.__webglInit=!0,v.addEventListener("dispose",b));const D=v.source;let G=f.get(D);G===void 0&&(G={},f.set(D,G));const O=V(v);if(O!==T.__cacheKey){G[O]===void 0&&(G[O]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,L=!0),G[O].usedTimes++;const ce=G[T.__cacheKey];ce!==void 0&&(G[T.__cacheKey].usedTimes--,ce.usedTimes===0&&M(v)),T.__cacheKey=O,T.__webglTexture=G[O].texture}return L}function Ce(T,v,L){return Math.floor(Math.floor(T/L)/v)}function Pe(T,v,L,D){const O=T.updateRanges;if(O.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,v.width,v.height,L,D,v.data);else{O.sort((ne,ue)=>ne.start-ue.start);let ce=0;for(let ne=1;ne<O.length;ne++){const ue=O[ce],Be=O[ne],De=ue.start+ue.count,me=Ce(Be.start,v.width,4),He=Ce(ue.start,v.width,4);Be.start<=De+1&&me===He&&Ce(Be.start+Be.count-1,v.width,4)===me?ue.count=Math.max(ue.count,Be.start+Be.count-ue.start):(++ce,O[ce]=Be)}O.length=ce+1;const ie=n.getParameter(n.UNPACK_ROW_LENGTH),Ee=n.getParameter(n.UNPACK_SKIP_PIXELS),be=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,v.width);for(let ne=0,ue=O.length;ne<ue;ne++){const Be=O[ne],De=Math.floor(Be.start/4),me=Math.ceil(Be.count/4),He=De%v.width,N=Math.floor(De/v.width),oe=me,he=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,He),n.pixelStorei(n.UNPACK_SKIP_ROWS,N),t.texSubImage2D(n.TEXTURE_2D,0,He,N,oe,he,L,D,v.data)}T.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,ie),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ee),n.pixelStorei(n.UNPACK_SKIP_ROWS,be)}}function K(T,v,L){let D=n.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(D=n.TEXTURE_2D_ARRAY),v.isData3DTexture&&(D=n.TEXTURE_3D);const G=Ve(T,v),O=v.source;t.bindTexture(D,T.__webglTexture,n.TEXTURE0+L);const ce=i.get(O);if(O.version!==ce.__version||G===!0){t.activeTexture(n.TEXTURE0+L);const ie=Ke.getPrimaries(Ke.workingColorSpace),Ee=v.colorSpace===Ln?null:Ke.getPrimaries(v.colorSpace),be=v.colorSpace===Ln||ie===Ee?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,be);let ne=_(v.image,!1,r.maxTextureSize);ne=q(v,ne);const ue=s.convert(v.format,v.colorSpace),Be=s.convert(v.type);let De=E(v.internalFormat,ue,Be,v.colorSpace,v.isVideoTexture);ye(D,v);let me;const He=v.mipmaps,N=v.isVideoTexture!==!0,oe=ce.__version===void 0||G===!0,he=O.dataReady,Se=w(v,ne);if(v.isDepthTexture)De=x(v.format===Nr,v.type),oe&&(N?t.texStorage2D(n.TEXTURE_2D,1,De,ne.width,ne.height):t.texImage2D(n.TEXTURE_2D,0,De,ne.width,ne.height,0,ue,Be,null));else if(v.isDataTexture)if(He.length>0){N&&oe&&t.texStorage2D(n.TEXTURE_2D,Se,De,He[0].width,He[0].height);for(let re=0,ee=He.length;re<ee;re++)me=He[re],N?he&&t.texSubImage2D(n.TEXTURE_2D,re,0,0,me.width,me.height,ue,Be,me.data):t.texImage2D(n.TEXTURE_2D,re,De,me.width,me.height,0,ue,Be,me.data);v.generateMipmaps=!1}else N?(oe&&t.texStorage2D(n.TEXTURE_2D,Se,De,ne.width,ne.height),he&&Pe(v,ne,ue,Be)):t.texImage2D(n.TEXTURE_2D,0,De,ne.width,ne.height,0,ue,Be,ne.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){N&&oe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Se,De,He[0].width,He[0].height,ne.depth);for(let re=0,ee=He.length;re<ee;re++)if(me=He[re],v.format!==sn)if(ue!==null)if(N){if(he)if(v.layerUpdates.size>0){const Re=Nl(me.width,me.height,v.format,v.type);for(const Ge of v.layerUpdates){const ct=me.data.subarray(Ge*Re/me.data.BYTES_PER_ELEMENT,(Ge+1)*Re/me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,re,0,0,Ge,me.width,me.height,1,ue,ct)}v.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,re,0,0,0,me.width,me.height,ne.depth,ue,me.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,re,De,me.width,me.height,ne.depth,0,me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else N?he&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,re,0,0,0,me.width,me.height,ne.depth,ue,Be,me.data):t.texImage3D(n.TEXTURE_2D_ARRAY,re,De,me.width,me.height,ne.depth,0,ue,Be,me.data)}else{N&&oe&&t.texStorage2D(n.TEXTURE_2D,Se,De,He[0].width,He[0].height);for(let re=0,ee=He.length;re<ee;re++)me=He[re],v.format!==sn?ue!==null?N?he&&t.compressedTexSubImage2D(n.TEXTURE_2D,re,0,0,me.width,me.height,ue,me.data):t.compressedTexImage2D(n.TEXTURE_2D,re,De,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):N?he&&t.texSubImage2D(n.TEXTURE_2D,re,0,0,me.width,me.height,ue,Be,me.data):t.texImage2D(n.TEXTURE_2D,re,De,me.width,me.height,0,ue,Be,me.data)}else if(v.isDataArrayTexture)if(N){if(oe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Se,De,ne.width,ne.height,ne.depth),he)if(v.layerUpdates.size>0){const re=Nl(ne.width,ne.height,v.format,v.type);for(const ee of v.layerUpdates){const Re=ne.data.subarray(ee*re/ne.data.BYTES_PER_ELEMENT,(ee+1)*re/ne.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ee,ne.width,ne.height,1,ue,Be,Re)}v.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,ue,Be,ne.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,De,ne.width,ne.height,ne.depth,0,ue,Be,ne.data);else if(v.isData3DTexture)N?(oe&&t.texStorage3D(n.TEXTURE_3D,Se,De,ne.width,ne.height,ne.depth),he&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,ue,Be,ne.data)):t.texImage3D(n.TEXTURE_3D,0,De,ne.width,ne.height,ne.depth,0,ue,Be,ne.data);else if(v.isFramebufferTexture){if(oe)if(N)t.texStorage2D(n.TEXTURE_2D,Se,De,ne.width,ne.height);else{let re=ne.width,ee=ne.height;for(let Re=0;Re<Se;Re++)t.texImage2D(n.TEXTURE_2D,Re,De,re,ee,0,ue,Be,null),re>>=1,ee>>=1}}else if(He.length>0){if(N&&oe){const re=le(He[0]);t.texStorage2D(n.TEXTURE_2D,Se,De,re.width,re.height)}for(let re=0,ee=He.length;re<ee;re++)me=He[re],N?he&&t.texSubImage2D(n.TEXTURE_2D,re,0,0,ue,Be,me):t.texImage2D(n.TEXTURE_2D,re,De,ue,Be,me);v.generateMipmaps=!1}else if(N){if(oe){const re=le(ne);t.texStorage2D(n.TEXTURE_2D,Se,De,re.width,re.height)}he&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ue,Be,ne)}else t.texImage2D(n.TEXTURE_2D,0,De,ue,Be,ne);m(v)&&p(D),ce.__version=O.version,v.onUpdate&&v.onUpdate(v)}T.__version=v.version}function Q(T,v,L){if(v.image.length!==6)return;const D=Ve(T,v),G=v.source;t.bindTexture(n.TEXTURE_CUBE_MAP,T.__webglTexture,n.TEXTURE0+L);const O=i.get(G);if(G.version!==O.__version||D===!0){t.activeTexture(n.TEXTURE0+L);const ce=Ke.getPrimaries(Ke.workingColorSpace),ie=v.colorSpace===Ln?null:Ke.getPrimaries(v.colorSpace),Ee=v.colorSpace===Ln||ce===ie?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ee);const be=v.isCompressedTexture||v.image[0].isCompressedTexture,ne=v.image[0]&&v.image[0].isDataTexture,ue=[];for(let ee=0;ee<6;ee++)!be&&!ne?ue[ee]=_(v.image[ee],!0,r.maxCubemapSize):ue[ee]=ne?v.image[ee].image:v.image[ee],ue[ee]=q(v,ue[ee]);const Be=ue[0],De=s.convert(v.format,v.colorSpace),me=s.convert(v.type),He=E(v.internalFormat,De,me,v.colorSpace),N=v.isVideoTexture!==!0,oe=O.__version===void 0||D===!0,he=G.dataReady;let Se=w(v,Be);ye(n.TEXTURE_CUBE_MAP,v);let re;if(be){N&&oe&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Se,He,Be.width,Be.height);for(let ee=0;ee<6;ee++){re=ue[ee].mipmaps;for(let Re=0;Re<re.length;Re++){const Ge=re[Re];v.format!==sn?De!==null?N?he&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Re,0,0,Ge.width,Ge.height,De,Ge.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Re,He,Ge.width,Ge.height,0,Ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?he&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Re,0,0,Ge.width,Ge.height,De,me,Ge.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Re,He,Ge.width,Ge.height,0,De,me,Ge.data)}}}else{if(re=v.mipmaps,N&&oe){re.length>0&&Se++;const ee=le(ue[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Se,He,ee.width,ee.height)}for(let ee=0;ee<6;ee++)if(ne){N?he&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,ue[ee].width,ue[ee].height,De,me,ue[ee].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,He,ue[ee].width,ue[ee].height,0,De,me,ue[ee].data);for(let Re=0;Re<re.length;Re++){const ct=re[Re].image[ee].image;N?he&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Re+1,0,0,ct.width,ct.height,De,me,ct.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Re+1,He,ct.width,ct.height,0,De,me,ct.data)}}else{N?he&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,De,me,ue[ee]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,He,De,me,ue[ee]);for(let Re=0;Re<re.length;Re++){const Ge=re[Re];N?he&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Re+1,0,0,De,me,Ge.image[ee]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Re+1,He,De,me,Ge.image[ee])}}}m(v)&&p(n.TEXTURE_CUBE_MAP),O.__version=G.version,v.onUpdate&&v.onUpdate(v)}T.__version=v.version}function pe(T,v,L,D,G,O){const ce=s.convert(L.format,L.colorSpace),ie=s.convert(L.type),Ee=E(L.internalFormat,ce,ie,L.colorSpace),be=i.get(v),ne=i.get(L);if(ne.__renderTarget=v,!be.__hasExternalTextures){const ue=Math.max(1,v.width>>O),Be=Math.max(1,v.height>>O);G===n.TEXTURE_3D||G===n.TEXTURE_2D_ARRAY?t.texImage3D(G,O,Ee,ue,Be,v.depth,0,ce,ie,null):t.texImage2D(G,O,Ee,ue,Be,0,ce,ie,null)}t.bindFramebuffer(n.FRAMEBUFFER,T),Ae(v)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,D,G,ne.__webglTexture,0,$e(v)):(G===n.TEXTURE_2D||G>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&G<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,D,G,ne.__webglTexture,O),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Me(T,v,L){if(n.bindRenderbuffer(n.RENDERBUFFER,T),v.depthBuffer){const D=v.depthTexture,G=D&&D.isDepthTexture?D.type:null,O=x(v.stencilBuffer,G),ce=v.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ie=$e(v);Ae(v)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ie,O,v.width,v.height):L?n.renderbufferStorageMultisample(n.RENDERBUFFER,ie,O,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,O,v.width,v.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,ce,n.RENDERBUFFER,T)}else{const D=v.textures;for(let G=0;G<D.length;G++){const O=D[G],ce=s.convert(O.format,O.colorSpace),ie=s.convert(O.type),Ee=E(O.internalFormat,ce,ie,O.colorSpace),be=$e(v);L&&Ae(v)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,be,Ee,v.width,v.height):Ae(v)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,be,Ee,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,Ee,v.width,v.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function fe(T,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,T),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const D=i.get(v.depthTexture);D.__renderTarget=v,(!D.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),H(v.depthTexture,0);const G=D.__webglTexture,O=$e(v);if(v.depthTexture.format===Lr)Ae(v)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,G,0,O):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,G,0);else if(v.depthTexture.format===Nr)Ae(v)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,G,0,O):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,G,0);else throw new Error("Unknown depthTexture format")}function Te(T){const v=i.get(T),L=T.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==T.depthTexture){const D=T.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),D){const G=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,D.removeEventListener("dispose",G)};D.addEventListener("dispose",G),v.__depthDisposeCallback=G}v.__boundDepthTexture=D}if(T.depthTexture&&!v.__autoAllocateDepthBuffer){if(L)throw new Error("target.depthTexture not supported in Cube render targets");const D=T.texture.mipmaps;D&&D.length>0?fe(v.__webglFramebuffer[0],T):fe(v.__webglFramebuffer,T)}else if(L){v.__webglDepthbuffer=[];for(let D=0;D<6;D++)if(t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[D]),v.__webglDepthbuffer[D]===void 0)v.__webglDepthbuffer[D]=n.createRenderbuffer(),Me(v.__webglDepthbuffer[D],T,!1);else{const G=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,O=v.__webglDepthbuffer[D];n.bindRenderbuffer(n.RENDERBUFFER,O),n.framebufferRenderbuffer(n.FRAMEBUFFER,G,n.RENDERBUFFER,O)}}else{const D=T.texture.mipmaps;if(D&&D.length>0?t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=n.createRenderbuffer(),Me(v.__webglDepthbuffer,T,!1);else{const G=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,O=v.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,O),n.framebufferRenderbuffer(n.FRAMEBUFFER,G,n.RENDERBUFFER,O)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function at(T,v,L){const D=i.get(T);v!==void 0&&pe(D.__webglFramebuffer,T,T.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),L!==void 0&&Te(T)}function P(T){const v=T.texture,L=i.get(T),D=i.get(v);T.addEventListener("dispose",R);const G=T.textures,O=T.isWebGLCubeRenderTarget===!0,ce=G.length>1;if(ce||(D.__webglTexture===void 0&&(D.__webglTexture=n.createTexture()),D.__version=v.version,o.memory.textures++),O){L.__webglFramebuffer=[];for(let ie=0;ie<6;ie++)if(v.mipmaps&&v.mipmaps.length>0){L.__webglFramebuffer[ie]=[];for(let Ee=0;Ee<v.mipmaps.length;Ee++)L.__webglFramebuffer[ie][Ee]=n.createFramebuffer()}else L.__webglFramebuffer[ie]=n.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){L.__webglFramebuffer=[];for(let ie=0;ie<v.mipmaps.length;ie++)L.__webglFramebuffer[ie]=n.createFramebuffer()}else L.__webglFramebuffer=n.createFramebuffer();if(ce)for(let ie=0,Ee=G.length;ie<Ee;ie++){const be=i.get(G[ie]);be.__webglTexture===void 0&&(be.__webglTexture=n.createTexture(),o.memory.textures++)}if(T.samples>0&&Ae(T)===!1){L.__webglMultisampledFramebuffer=n.createFramebuffer(),L.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,L.__webglMultisampledFramebuffer);for(let ie=0;ie<G.length;ie++){const Ee=G[ie];L.__webglColorRenderbuffer[ie]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,L.__webglColorRenderbuffer[ie]);const be=s.convert(Ee.format,Ee.colorSpace),ne=s.convert(Ee.type),ue=E(Ee.internalFormat,be,ne,Ee.colorSpace,T.isXRRenderTarget===!0),Be=$e(T);n.renderbufferStorageMultisample(n.RENDERBUFFER,Be,ue,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ie,n.RENDERBUFFER,L.__webglColorRenderbuffer[ie])}n.bindRenderbuffer(n.RENDERBUFFER,null),T.depthBuffer&&(L.__webglDepthRenderbuffer=n.createRenderbuffer(),Me(L.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(O){t.bindTexture(n.TEXTURE_CUBE_MAP,D.__webglTexture),ye(n.TEXTURE_CUBE_MAP,v);for(let ie=0;ie<6;ie++)if(v.mipmaps&&v.mipmaps.length>0)for(let Ee=0;Ee<v.mipmaps.length;Ee++)pe(L.__webglFramebuffer[ie][Ee],T,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ee);else pe(L.__webglFramebuffer[ie],T,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0);m(v)&&p(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ce){for(let ie=0,Ee=G.length;ie<Ee;ie++){const be=G[ie],ne=i.get(be);let ue=n.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ue=T.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ue,ne.__webglTexture),ye(ue,be),pe(L.__webglFramebuffer,T,be,n.COLOR_ATTACHMENT0+ie,ue,0),m(be)&&p(ue)}t.unbindTexture()}else{let ie=n.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ie=T.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ie,D.__webglTexture),ye(ie,v),v.mipmaps&&v.mipmaps.length>0)for(let Ee=0;Ee<v.mipmaps.length;Ee++)pe(L.__webglFramebuffer[Ee],T,v,n.COLOR_ATTACHMENT0,ie,Ee);else pe(L.__webglFramebuffer,T,v,n.COLOR_ATTACHMENT0,ie,0);m(v)&&p(ie),t.unbindTexture()}T.depthBuffer&&Te(T)}function Je(T){const v=T.textures;for(let L=0,D=v.length;L<D;L++){const G=v[L];if(m(G)){const O=A(T),ce=i.get(G).__webglTexture;t.bindTexture(O,ce),p(O),t.unbindTexture()}}}const ke=[],Ie=[];function xe(T){if(T.samples>0){if(Ae(T)===!1){const v=T.textures,L=T.width,D=T.height;let G=n.COLOR_BUFFER_BIT;const O=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ce=i.get(T),ie=v.length>1;if(ie)for(let be=0;be<v.length;be++)t.bindFramebuffer(n.FRAMEBUFFER,ce.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+be,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,ce.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+be,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,ce.__webglMultisampledFramebuffer);const Ee=T.texture.mipmaps;Ee&&Ee.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ce.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ce.__webglFramebuffer);for(let be=0;be<v.length;be++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(G|=n.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(G|=n.STENCIL_BUFFER_BIT)),ie){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,ce.__webglColorRenderbuffer[be]);const ne=i.get(v[be]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,ne,0)}n.blitFramebuffer(0,0,L,D,0,0,L,D,G,n.NEAREST),c===!0&&(ke.length=0,Ie.length=0,ke.push(n.COLOR_ATTACHMENT0+be),T.depthBuffer&&T.resolveDepthBuffer===!1&&(ke.push(O),Ie.push(O),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Ie)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,ke))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ie)for(let be=0;be<v.length;be++){t.bindFramebuffer(n.FRAMEBUFFER,ce.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+be,n.RENDERBUFFER,ce.__webglColorRenderbuffer[be]);const ne=i.get(v[be]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,ce.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+be,n.TEXTURE_2D,ne,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ce.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&c){const v=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[v])}}}function $e(T){return Math.min(r.maxSamples,T.samples)}function Ae(T){const v=i.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function F(T){const v=o.render.frame;u.get(T)!==v&&(u.set(T,v),T.update())}function q(T,v){const L=T.colorSpace,D=T.format,G=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||L!==Qi&&L!==Ln&&(Ke.getTransfer(L)===rt?(D!==sn||G!==yn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",L)),v}function le(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(l.width=T.naturalWidth||T.width,l.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(l.width=T.displayWidth,l.height=T.displayHeight):(l.width=T.width,l.height=T.height),l}this.allocateTextureUnit=k,this.resetTextureUnits=U,this.setTexture2D=H,this.setTexture2DArray=W,this.setTexture3D=$,this.setTextureCube=X,this.rebindTextures=at,this.setupRenderTarget=P,this.updateRenderTargetMipmap=Je,this.updateMultisampleRenderTarget=xe,this.setupDepthRenderbuffer=Te,this.setupFrameBufferTexture=pe,this.useMultisampledRTT=Ae}function Dy(n,e){function t(i,r=Ln){let s;const o=Ke.getTransfer(r);if(i===yn)return n.UNSIGNED_BYTE;if(i===oc)return n.UNSIGNED_SHORT_4_4_4_4;if(i===ac)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Ih)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Uh)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Ph)return n.BYTE;if(i===Dh)return n.SHORT;if(i===Ir)return n.UNSIGNED_SHORT;if(i===sc)return n.INT;if(i===Ai)return n.UNSIGNED_INT;if(i===kn)return n.FLOAT;if(i===Or)return n.HALF_FLOAT;if(i===Lh)return n.ALPHA;if(i===Nh)return n.RGB;if(i===sn)return n.RGBA;if(i===Lr)return n.DEPTH_COMPONENT;if(i===Nr)return n.DEPTH_STENCIL;if(i===kh)return n.RED;if(i===cc)return n.RED_INTEGER;if(i===Fh)return n.RG;if(i===lc)return n.RG_INTEGER;if(i===uc)return n.RGBA_INTEGER;if(i===ys||i===Ms||i===bs||i===ws)if(o===rt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===ys)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Ms)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===bs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===ws)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===ys)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Ms)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===bs)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===ws)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===da||i===pa||i===ma||i===ga)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===da)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===pa)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ma)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ga)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===_a||i===va||i===xa)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===_a||i===va)return o===rt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===xa)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Aa||i===Ea||i===Sa||i===ya||i===Ma||i===ba||i===wa||i===Ta||i===Ra||i===Ca||i===Pa||i===Da||i===Ia||i===Ua)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Aa)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Ea)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Sa)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ya)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ma)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===ba)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===wa)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ta)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ra)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Ca)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Pa)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Da)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ia)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ua)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===La||i===Na||i===ka)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===La)return o===rt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Na)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ka)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Fa||i===Oa||i===Ba||i===za)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Fa)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Oa)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ba)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===za)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ur?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const Iy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Uy=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Ly{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new qh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Mn({vertexShader:Iy,fragmentShader:Uy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new zt(new Zs(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Ny extends nr{constructor(e,t){super();const i=this;let r=null,s=1,o=null,a="local-floor",c=1,l=null,u=null,h=null,f=null,d=null,g=null;const _=typeof XRWebGLBinding<"u",m=new Ly,p={},A=t.getContextAttributes();let E=null,x=null;const w=[],b=[],R=new st;let I=null;const M=new rn;M.viewport=new xt;const S=new rn;S.viewport=new xt;const C=[M,S],U=new nx;let k=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let Q=w[K];return Q===void 0&&(Q=new Io,w[K]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(K){let Q=w[K];return Q===void 0&&(Q=new Io,w[K]=Q),Q.getGripSpace()},this.getHand=function(K){let Q=w[K];return Q===void 0&&(Q=new Io,w[K]=Q),Q.getHandSpace()};function H(K){const Q=b.indexOf(K.inputSource);if(Q===-1)return;const pe=w[Q];pe!==void 0&&(pe.update(K.inputSource,K.frame,l||o),pe.dispatchEvent({type:K.type,data:K.inputSource}))}function W(){r.removeEventListener("select",H),r.removeEventListener("selectstart",H),r.removeEventListener("selectend",H),r.removeEventListener("squeeze",H),r.removeEventListener("squeezestart",H),r.removeEventListener("squeezeend",H),r.removeEventListener("end",W),r.removeEventListener("inputsourceschange",$);for(let K=0;K<w.length;K++){const Q=b[K];Q!==null&&(b[K]=null,w[K].disconnect(Q))}k=null,V=null,m.reset();for(const K in p)delete p[K];e.setRenderTarget(E),d=null,f=null,h=null,r=null,x=null,Pe.stop(),i.isPresenting=!1,e.setPixelRatio(I),e.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){s=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){a=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(K){l=K},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return h===null&&_&&(h=new XRWebGLBinding(r,t)),h},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(K){if(r=K,r!==null){if(E=e.getRenderTarget(),r.addEventListener("select",H),r.addEventListener("selectstart",H),r.addEventListener("selectend",H),r.addEventListener("squeeze",H),r.addEventListener("squeezestart",H),r.addEventListener("squeezeend",H),r.addEventListener("end",W),r.addEventListener("inputsourceschange",$),A.xrCompatible!==!0&&await t.makeXRCompatible(),I=e.getPixelRatio(),e.getSize(R),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let pe=null,Me=null,fe=null;A.depth&&(fe=A.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,pe=A.stencil?Nr:Lr,Me=A.stencil?Ur:Ai);const Te={colorFormat:t.RGBA8,depthFormat:fe,scaleFactor:s};h=this.getBinding(),f=h.createProjectionLayer(Te),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),x=new Ei(f.textureWidth,f.textureHeight,{format:sn,type:yn,depthTexture:new Kh(f.textureWidth,f.textureHeight,Me,void 0,void 0,void 0,void 0,void 0,void 0,pe),stencilBuffer:A.stencil,colorSpace:e.outputColorSpace,samples:A.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const pe={antialias:A.antialias,alpha:!0,depth:A.depth,stencil:A.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(r,t,pe),r.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),x=new Ei(d.framebufferWidth,d.framebufferHeight,{format:sn,type:yn,colorSpace:e.outputColorSpace,stencilBuffer:A.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await r.requestReferenceSpace(a),Pe.setContext(r),Pe.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function $(K){for(let Q=0;Q<K.removed.length;Q++){const pe=K.removed[Q],Me=b.indexOf(pe);Me>=0&&(b[Me]=null,w[Me].disconnect(pe))}for(let Q=0;Q<K.added.length;Q++){const pe=K.added[Q];let Me=b.indexOf(pe);if(Me===-1){for(let Te=0;Te<w.length;Te++)if(Te>=b.length){b.push(pe),Me=Te;break}else if(b[Te]===null){b[Te]=pe,Me=Te;break}if(Me===-1)break}const fe=w[Me];fe&&fe.connect(pe)}}const X=new Y,te=new Y;function ae(K,Q,pe){X.setFromMatrixPosition(Q.matrixWorld),te.setFromMatrixPosition(pe.matrixWorld);const Me=X.distanceTo(te),fe=Q.projectionMatrix.elements,Te=pe.projectionMatrix.elements,at=fe[14]/(fe[10]-1),P=fe[14]/(fe[10]+1),Je=(fe[9]+1)/fe[5],ke=(fe[9]-1)/fe[5],Ie=(fe[8]-1)/fe[0],xe=(Te[8]+1)/Te[0],$e=at*Ie,Ae=at*xe,F=Me/(-Ie+xe),q=F*-Ie;if(Q.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(q),K.translateZ(F),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),fe[10]===-1)K.projectionMatrix.copy(Q.projectionMatrix),K.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{const le=at+F,T=P+F,v=$e-q,L=Ae+(Me-q),D=Je*P/T*le,G=ke*P/T*le;K.projectionMatrix.makePerspective(v,L,D,G,le,T),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function _e(K,Q){Q===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(Q.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(r===null)return;let Q=K.near,pe=K.far;m.texture!==null&&(m.depthNear>0&&(Q=m.depthNear),m.depthFar>0&&(pe=m.depthFar)),U.near=S.near=M.near=Q,U.far=S.far=M.far=pe,(k!==U.near||V!==U.far)&&(r.updateRenderState({depthNear:U.near,depthFar:U.far}),k=U.near,V=U.far),U.layers.mask=K.layers.mask|6,M.layers.mask=U.layers.mask&3,S.layers.mask=U.layers.mask&5;const Me=K.parent,fe=U.cameras;_e(U,Me);for(let Te=0;Te<fe.length;Te++)_e(fe[Te],Me);fe.length===2?ae(U,M,S):U.projectionMatrix.copy(M.projectionMatrix),ye(K,U,Me)};function ye(K,Q,pe){pe===null?K.matrix.copy(Q.matrixWorld):(K.matrix.copy(pe.matrixWorld),K.matrix.invert(),K.matrix.multiply(Q.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(Q.projectionMatrix),K.projectionMatrixInverse.copy(Q.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=kr*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(K){c=K,f!==null&&(f.fixedFoveation=K),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=K)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(U)},this.getCameraTexture=function(K){return p[K]};let Ve=null;function Ce(K,Q){if(u=Q.getViewerPose(l||o),g=Q,u!==null){const pe=u.views;d!==null&&(e.setRenderTargetFramebuffer(x,d.framebuffer),e.setRenderTarget(x));let Me=!1;pe.length!==U.cameras.length&&(U.cameras.length=0,Me=!0);for(let P=0;P<pe.length;P++){const Je=pe[P];let ke=null;if(d!==null)ke=d.getViewport(Je);else{const xe=h.getViewSubImage(f,Je);ke=xe.viewport,P===0&&(e.setRenderTargetTextures(x,xe.colorTexture,xe.depthStencilTexture),e.setRenderTarget(x))}let Ie=C[P];Ie===void 0&&(Ie=new rn,Ie.layers.enable(P),Ie.viewport=new xt,C[P]=Ie),Ie.matrix.fromArray(Je.transform.matrix),Ie.matrix.decompose(Ie.position,Ie.quaternion,Ie.scale),Ie.projectionMatrix.fromArray(Je.projectionMatrix),Ie.projectionMatrixInverse.copy(Ie.projectionMatrix).invert(),Ie.viewport.set(ke.x,ke.y,ke.width,ke.height),P===0&&(U.matrix.copy(Ie.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),Me===!0&&U.cameras.push(Ie)}const fe=r.enabledFeatures;if(fe&&fe.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&_){h=i.getBinding();const P=h.getDepthInformation(pe[0]);P&&P.isValid&&P.texture&&m.init(P,r.renderState)}if(fe&&fe.includes("camera-access")&&_){e.state.unbindTexture(),h=i.getBinding();for(let P=0;P<pe.length;P++){const Je=pe[P].camera;if(Je){let ke=p[Je];ke||(ke=new qh,p[Je]=ke);const Ie=h.getCameraImage(Je);ke.sourceTexture=Ie}}}}for(let pe=0;pe<w.length;pe++){const Me=b[pe],fe=w[pe];Me!==null&&fe!==void 0&&fe.update(Me,Q,l||o)}Ve&&Ve(K,Q),Q.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Q}),g=null}const Pe=new Qh;Pe.setAnimationLoop(Ce),this.setAnimationLoop=function(K){Ve=K},this.dispose=function(){}}}const li=new zn,ky=new yt;function Fy(n,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Wh(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,A,E,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),h(m,p)):p.isMeshPhongMaterial?(s(m,p),u(m,p)):p.isMeshStandardMaterial?(s(m,p),f(m,p),p.isMeshPhysicalMaterial&&d(m,p,x)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),_(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,A,E):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ft&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ft&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const A=e.get(p),E=A.envMap,x=A.envMapRotation;E&&(m.envMap.value=E,li.copy(x),li.x*=-1,li.y*=-1,li.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(li.y*=-1,li.z*=-1),m.envMapRotation.value.setFromMatrix4(ky.makeRotationFromEuler(li)),m.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,A,E){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*A,m.scale.value=E*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function h(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,A){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ft&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=A.texture,m.transmissionSamplerSize.value.set(A.width,A.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const A=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(A.matrixWorld),m.nearDistance.value=A.shadow.camera.near,m.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function Oy(n,e,t,i){let r={},s={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(A,E){const x=E.program;i.uniformBlockBinding(A,x)}function l(A,E){let x=r[A.id];x===void 0&&(g(A),x=u(A),r[A.id]=x,A.addEventListener("dispose",m));const w=E.program;i.updateUBOMapping(A,w);const b=e.render.frame;s[A.id]!==b&&(f(A),s[A.id]=b)}function u(A){const E=h();A.__bindingPointIndex=E;const x=n.createBuffer(),w=A.__size,b=A.usage;return n.bindBuffer(n.UNIFORM_BUFFER,x),n.bufferData(n.UNIFORM_BUFFER,w,b),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,E,x),x}function h(){for(let A=0;A<a;A++)if(o.indexOf(A)===-1)return o.push(A),A;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(A){const E=r[A.id],x=A.uniforms,w=A.__cache;n.bindBuffer(n.UNIFORM_BUFFER,E);for(let b=0,R=x.length;b<R;b++){const I=Array.isArray(x[b])?x[b]:[x[b]];for(let M=0,S=I.length;M<S;M++){const C=I[M];if(d(C,b,M,w)===!0){const U=C.__offset,k=Array.isArray(C.value)?C.value:[C.value];let V=0;for(let H=0;H<k.length;H++){const W=k[H],$=_(W);typeof W=="number"||typeof W=="boolean"?(C.__data[0]=W,n.bufferSubData(n.UNIFORM_BUFFER,U+V,C.__data)):W.isMatrix3?(C.__data[0]=W.elements[0],C.__data[1]=W.elements[1],C.__data[2]=W.elements[2],C.__data[3]=0,C.__data[4]=W.elements[3],C.__data[5]=W.elements[4],C.__data[6]=W.elements[5],C.__data[7]=0,C.__data[8]=W.elements[6],C.__data[9]=W.elements[7],C.__data[10]=W.elements[8],C.__data[11]=0):(W.toArray(C.__data,V),V+=$.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,U,C.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function d(A,E,x,w){const b=A.value,R=E+"_"+x;if(w[R]===void 0)return typeof b=="number"||typeof b=="boolean"?w[R]=b:w[R]=b.clone(),!0;{const I=w[R];if(typeof b=="number"||typeof b=="boolean"){if(I!==b)return w[R]=b,!0}else if(I.equals(b)===!1)return I.copy(b),!0}return!1}function g(A){const E=A.uniforms;let x=0;const w=16;for(let R=0,I=E.length;R<I;R++){const M=Array.isArray(E[R])?E[R]:[E[R]];for(let S=0,C=M.length;S<C;S++){const U=M[S],k=Array.isArray(U.value)?U.value:[U.value];for(let V=0,H=k.length;V<H;V++){const W=k[V],$=_(W),X=x%w,te=X%$.boundary,ae=X+te;x+=te,ae!==0&&w-ae<$.storage&&(x+=w-ae),U.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=x,x+=$.storage}}}const b=x%w;return b>0&&(x+=w-b),A.__size=x,A.__cache={},this}function _(A){const E={boundary:0,storage:0};return typeof A=="number"||typeof A=="boolean"?(E.boundary=4,E.storage=4):A.isVector2?(E.boundary=8,E.storage=8):A.isVector3||A.isColor?(E.boundary=16,E.storage=12):A.isVector4?(E.boundary=16,E.storage=16):A.isMatrix3?(E.boundary=48,E.storage=48):A.isMatrix4?(E.boundary=64,E.storage=64):A.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",A),E}function m(A){const E=A.target;E.removeEventListener("dispose",m);const x=o.indexOf(E.__bindingPointIndex);o.splice(x,1),n.deleteBuffer(r[E.id]),delete r[E.id],delete s[E.id]}function p(){for(const A in r)n.deleteBuffer(r[A]);o=[],r={},s={}}return{bind:c,update:l,dispose:p}}class By{constructor(e={}){const{canvas:t=Sv(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let d;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=i.getContextAttributes().alpha}else d=o;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const A=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Qn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const x=this;let w=!1;this._outputColorSpace=Kt;let b=0,R=0,I=null,M=-1,S=null;const C=new xt,U=new xt;let k=null;const V=new qe(0);let H=0,W=t.width,$=t.height,X=1,te=null,ae=null;const _e=new xt(0,0,W,$),ye=new xt(0,0,W,$);let Ve=!1;const Ce=new jh;let Pe=!1,K=!1;const Q=new yt,pe=new Y,Me=new xt,fe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Te=!1;function at(){return I===null?X:1}let P=i;function Je(y,B){return t.getContext(y,B)}try{const y={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${rc}`),t.addEventListener("webglcontextlost",he,!1),t.addEventListener("webglcontextrestored",Se,!1),t.addEventListener("webglcontextcreationerror",re,!1),P===null){const B="webgl2";if(P=Je(B,y),P===null)throw Je(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let ke,Ie,xe,$e,Ae,F,q,le,T,v,L,D,G,O,ce,ie,Ee,be,ne,ue,Be,De,me,He;function N(){ke=new KE(P),ke.init(),De=new Dy(P,ke),Ie=new GE(P,ke,e,De),xe=new Cy(P,ke),Ie.reversedDepthBuffer&&f&&xe.buffers.depth.setReversed(!0),$e=new JE(P),Ae=new gy,F=new Py(P,ke,xe,Ae,Ie,De,$e),q=new WE(x),le=new jE(x),T=new rx(P),me=new zE(P,T),v=new qE(P,T,$e,me),L=new eS(P,v,T,$e),ne=new $E(P,Ie,F),ie=new HE(Ae),D=new my(x,q,le,ke,Ie,me,ie),G=new Fy(x,Ae),O=new vy,ce=new My(ke),be=new BE(x,q,le,xe,L,d,c),Ee=new Ty(x,L,Ie),He=new Oy(P,$e,Ie,xe),ue=new VE(P,ke,$e),Be=new QE(P,ke,$e),$e.programs=D.programs,x.capabilities=Ie,x.extensions=ke,x.properties=Ae,x.renderLists=O,x.shadowMap=Ee,x.state=xe,x.info=$e}N();const oe=new Ny(x,P);this.xr=oe,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const y=ke.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=ke.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return X},this.setPixelRatio=function(y){y!==void 0&&(X=y,this.setSize(W,$,!1))},this.getSize=function(y){return y.set(W,$)},this.setSize=function(y,B,Z=!0){if(oe.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=y,$=B,t.width=Math.floor(y*X),t.height=Math.floor(B*X),Z===!0&&(t.style.width=y+"px",t.style.height=B+"px"),this.setViewport(0,0,y,B)},this.getDrawingBufferSize=function(y){return y.set(W*X,$*X).floor()},this.setDrawingBufferSize=function(y,B,Z){W=y,$=B,X=Z,t.width=Math.floor(y*Z),t.height=Math.floor(B*Z),this.setViewport(0,0,y,B)},this.getCurrentViewport=function(y){return y.copy(C)},this.getViewport=function(y){return y.copy(_e)},this.setViewport=function(y,B,Z,j){y.isVector4?_e.set(y.x,y.y,y.z,y.w):_e.set(y,B,Z,j),xe.viewport(C.copy(_e).multiplyScalar(X).round())},this.getScissor=function(y){return y.copy(ye)},this.setScissor=function(y,B,Z,j){y.isVector4?ye.set(y.x,y.y,y.z,y.w):ye.set(y,B,Z,j),xe.scissor(U.copy(ye).multiplyScalar(X).round())},this.getScissorTest=function(){return Ve},this.setScissorTest=function(y){xe.setScissorTest(Ve=y)},this.setOpaqueSort=function(y){te=y},this.setTransparentSort=function(y){ae=y},this.getClearColor=function(y){return y.copy(be.getClearColor())},this.setClearColor=function(){be.setClearColor(...arguments)},this.getClearAlpha=function(){return be.getClearAlpha()},this.setClearAlpha=function(){be.setClearAlpha(...arguments)},this.clear=function(y=!0,B=!0,Z=!0){let j=0;if(y){let z=!1;if(I!==null){const se=I.texture.format;z=se===uc||se===lc||se===cc}if(z){const se=I.texture.type,ge=se===yn||se===Ai||se===Ir||se===Ur||se===oc||se===ac,we=be.getClearColor(),ve=be.getClearAlpha(),Fe=we.r,ze=we.g,Le=we.b;ge?(g[0]=Fe,g[1]=ze,g[2]=Le,g[3]=ve,P.clearBufferuiv(P.COLOR,0,g)):(_[0]=Fe,_[1]=ze,_[2]=Le,_[3]=ve,P.clearBufferiv(P.COLOR,0,_))}else j|=P.COLOR_BUFFER_BIT}B&&(j|=P.DEPTH_BUFFER_BIT),Z&&(j|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(j)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",he,!1),t.removeEventListener("webglcontextrestored",Se,!1),t.removeEventListener("webglcontextcreationerror",re,!1),be.dispose(),O.dispose(),ce.dispose(),Ae.dispose(),q.dispose(),le.dispose(),L.dispose(),me.dispose(),He.dispose(),D.dispose(),oe.dispose(),oe.removeEventListener("sessionstart",dn),oe.removeEventListener("sessionend",vc),ti.stop()};function he(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function Se(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const y=$e.autoReset,B=Ee.enabled,Z=Ee.autoUpdate,j=Ee.needsUpdate,z=Ee.type;N(),$e.autoReset=y,Ee.enabled=B,Ee.autoUpdate=Z,Ee.needsUpdate=j,Ee.type=z}function re(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function ee(y){const B=y.target;B.removeEventListener("dispose",ee),Re(B)}function Re(y){Ge(y),Ae.remove(y)}function Ge(y){const B=Ae.get(y).programs;B!==void 0&&(B.forEach(function(Z){D.releaseProgram(Z)}),y.isShaderMaterial&&D.releaseShaderCache(y))}this.renderBufferDirect=function(y,B,Z,j,z,se){B===null&&(B=fe);const ge=z.isMesh&&z.matrixWorld.determinant()<0,we=cf(y,B,Z,j,z);xe.setMaterial(j,ge);let ve=Z.index,Fe=1;if(j.wireframe===!0){if(ve=v.getWireframeAttribute(Z),ve===void 0)return;Fe=2}const ze=Z.drawRange,Le=Z.attributes.position;let Ye=ze.start*Fe,it=(ze.start+ze.count)*Fe;se!==null&&(Ye=Math.max(Ye,se.start*Fe),it=Math.min(it,(se.start+se.count)*Fe)),ve!==null?(Ye=Math.max(Ye,0),it=Math.min(it,ve.count)):Le!=null&&(Ye=Math.max(Ye,0),it=Math.min(it,Le.count));const vt=it-Ye;if(vt<0||vt===1/0)return;me.setup(z,j,we,Z,ve);let ut,ot=ue;if(ve!==null&&(ut=T.get(ve),ot=Be,ot.setIndex(ut)),z.isMesh)j.wireframe===!0?(xe.setLineWidth(j.wireframeLinewidth*at()),ot.setMode(P.LINES)):ot.setMode(P.TRIANGLES);else if(z.isLine){let Ne=j.linewidth;Ne===void 0&&(Ne=1),xe.setLineWidth(Ne*at()),z.isLineSegments?ot.setMode(P.LINES):z.isLineLoop?ot.setMode(P.LINE_LOOP):ot.setMode(P.LINE_STRIP)}else z.isPoints?ot.setMode(P.POINTS):z.isSprite&&ot.setMode(P.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)Fr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ot.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(ke.get("WEBGL_multi_draw"))ot.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{const Ne=z._multiDrawStarts,pt=z._multiDrawCounts,je=z._multiDrawCount,Ht=ve?T.get(ve).bytesPerElement:1,Mi=Ae.get(j).currentProgram.getUniforms();for(let Wt=0;Wt<je;Wt++)Mi.setValue(P,"_gl_DrawID",Wt),ot.render(Ne[Wt]/Ht,pt[Wt])}else if(z.isInstancedMesh)ot.renderInstances(Ye,vt,z.count);else if(Z.isInstancedBufferGeometry){const Ne=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,pt=Math.min(Z.instanceCount,Ne);ot.renderInstances(Ye,vt,pt)}else ot.render(Ye,vt)};function ct(y,B,Z){y.transparent===!0&&y.side===_n&&y.forceSinglePass===!1?(y.side=Ft,y.needsUpdate=!0,Gr(y,B,Z),y.side=Bn,y.needsUpdate=!0,Gr(y,B,Z),y.side=_n):Gr(y,B,Z)}this.compile=function(y,B,Z=null){Z===null&&(Z=y),p=ce.get(Z),p.init(B),E.push(p),Z.traverseVisible(function(z){z.isLight&&z.layers.test(B.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),y!==Z&&y.traverseVisible(function(z){z.isLight&&z.layers.test(B.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),p.setupLights();const j=new Set;return y.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;const se=z.material;if(se)if(Array.isArray(se))for(let ge=0;ge<se.length;ge++){const we=se[ge];ct(we,Z,z),j.add(we)}else ct(se,Z,z),j.add(se)}),p=E.pop(),j},this.compileAsync=function(y,B,Z=null){const j=this.compile(y,B,Z);return new Promise(z=>{function se(){if(j.forEach(function(ge){Ae.get(ge).currentProgram.isReady()&&j.delete(ge)}),j.size===0){z(y);return}setTimeout(se,10)}ke.get("KHR_parallel_shader_compile")!==null?se():setTimeout(se,10)})};let et=null;function wn(y){et&&et(y)}function dn(){ti.stop()}function vc(){ti.start()}const ti=new Qh;ti.setAnimationLoop(wn),typeof self<"u"&&ti.setContext(self),this.setAnimationLoop=function(y){et=y,oe.setAnimationLoop(y),y===null?ti.stop():ti.start()},oe.addEventListener("sessionstart",dn),oe.addEventListener("sessionend",vc),this.render=function(y,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),oe.enabled===!0&&oe.isPresenting===!0&&(oe.cameraAutoUpdate===!0&&oe.updateCamera(B),B=oe.getCamera()),y.isScene===!0&&y.onBeforeRender(x,y,B,I),p=ce.get(y,E.length),p.init(B),E.push(p),Q.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),Ce.setFromProjectionMatrix(Q,An,B.reversedDepth),K=this.localClippingEnabled,Pe=ie.init(this.clippingPlanes,K),m=O.get(y,A.length),m.init(),A.push(m),oe.enabled===!0&&oe.isPresenting===!0){const se=x.xr.getDepthSensingMesh();se!==null&&Ks(se,B,-1/0,x.sortObjects)}Ks(y,B,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(te,ae),Te=oe.enabled===!1||oe.isPresenting===!1||oe.hasDepthSensing()===!1,Te&&be.addToRenderList(m,y),this.info.render.frame++,Pe===!0&&ie.beginShadows();const Z=p.state.shadowsArray;Ee.render(Z,y,B),Pe===!0&&ie.endShadows(),this.info.autoReset===!0&&this.info.reset();const j=m.opaque,z=m.transmissive;if(p.setupLights(),B.isArrayCamera){const se=B.cameras;if(z.length>0)for(let ge=0,we=se.length;ge<we;ge++){const ve=se[ge];Ac(j,z,y,ve)}Te&&be.render(y);for(let ge=0,we=se.length;ge<we;ge++){const ve=se[ge];xc(m,y,ve,ve.viewport)}}else z.length>0&&Ac(j,z,y,B),Te&&be.render(y),xc(m,y,B);I!==null&&R===0&&(F.updateMultisampleRenderTarget(I),F.updateRenderTargetMipmap(I)),y.isScene===!0&&y.onAfterRender(x,y,B),me.resetDefaultState(),M=-1,S=null,E.pop(),E.length>0?(p=E[E.length-1],Pe===!0&&ie.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,A.pop(),A.length>0?m=A[A.length-1]:m=null};function Ks(y,B,Z,j){if(y.visible===!1)return;if(y.layers.test(B.layers)){if(y.isGroup)Z=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(B);else if(y.isLight)p.pushLight(y),y.castShadow&&p.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||Ce.intersectsSprite(y)){j&&Me.setFromMatrixPosition(y.matrixWorld).applyMatrix4(Q);const ge=L.update(y),we=y.material;we.visible&&m.push(y,ge,we,Z,Me.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||Ce.intersectsObject(y))){const ge=L.update(y),we=y.material;if(j&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Me.copy(y.boundingSphere.center)):(ge.boundingSphere===null&&ge.computeBoundingSphere(),Me.copy(ge.boundingSphere.center)),Me.applyMatrix4(y.matrixWorld).applyMatrix4(Q)),Array.isArray(we)){const ve=ge.groups;for(let Fe=0,ze=ve.length;Fe<ze;Fe++){const Le=ve[Fe],Ye=we[Le.materialIndex];Ye&&Ye.visible&&m.push(y,ge,Ye,Z,Me.z,Le)}}else we.visible&&m.push(y,ge,we,Z,Me.z,null)}}const se=y.children;for(let ge=0,we=se.length;ge<we;ge++)Ks(se[ge],B,Z,j)}function xc(y,B,Z,j){const z=y.opaque,se=y.transmissive,ge=y.transparent;p.setupLightsView(Z),Pe===!0&&ie.setGlobalState(x.clippingPlanes,Z),j&&xe.viewport(C.copy(j)),z.length>0&&Vr(z,B,Z),se.length>0&&Vr(se,B,Z),ge.length>0&&Vr(ge,B,Z),xe.buffers.depth.setTest(!0),xe.buffers.depth.setMask(!0),xe.buffers.color.setMask(!0),xe.setPolygonOffset(!1)}function Ac(y,B,Z,j){if((Z.isScene===!0?Z.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[j.id]===void 0&&(p.state.transmissionRenderTarget[j.id]=new Ei(1,1,{generateMipmaps:!0,type:ke.has("EXT_color_buffer_half_float")||ke.has("EXT_color_buffer_float")?Or:yn,minFilter:gi,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ke.workingColorSpace}));const se=p.state.transmissionRenderTarget[j.id],ge=j.viewport||C;se.setSize(ge.z*x.transmissionResolutionScale,ge.w*x.transmissionResolutionScale);const we=x.getRenderTarget(),ve=x.getActiveCubeFace(),Fe=x.getActiveMipmapLevel();x.setRenderTarget(se),x.getClearColor(V),H=x.getClearAlpha(),H<1&&x.setClearColor(16777215,.5),x.clear(),Te&&be.render(Z);const ze=x.toneMapping;x.toneMapping=Qn;const Le=j.viewport;if(j.viewport!==void 0&&(j.viewport=void 0),p.setupLightsView(j),Pe===!0&&ie.setGlobalState(x.clippingPlanes,j),Vr(y,Z,j),F.updateMultisampleRenderTarget(se),F.updateRenderTargetMipmap(se),ke.has("WEBGL_multisampled_render_to_texture")===!1){let Ye=!1;for(let it=0,vt=B.length;it<vt;it++){const ut=B[it],ot=ut.object,Ne=ut.geometry,pt=ut.material,je=ut.group;if(pt.side===_n&&ot.layers.test(j.layers)){const Ht=pt.side;pt.side=Ft,pt.needsUpdate=!0,Ec(ot,Z,j,Ne,pt,je),pt.side=Ht,pt.needsUpdate=!0,Ye=!0}}Ye===!0&&(F.updateMultisampleRenderTarget(se),F.updateRenderTargetMipmap(se))}x.setRenderTarget(we,ve,Fe),x.setClearColor(V,H),Le!==void 0&&(j.viewport=Le),x.toneMapping=ze}function Vr(y,B,Z){const j=B.isScene===!0?B.overrideMaterial:null;for(let z=0,se=y.length;z<se;z++){const ge=y[z],we=ge.object,ve=ge.geometry,Fe=ge.group;let ze=ge.material;ze.allowOverride===!0&&j!==null&&(ze=j),we.layers.test(Z.layers)&&Ec(we,B,Z,ve,ze,Fe)}}function Ec(y,B,Z,j,z,se){y.onBeforeRender(x,B,Z,j,z,se),y.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),z.onBeforeRender(x,B,Z,j,y,se),z.transparent===!0&&z.side===_n&&z.forceSinglePass===!1?(z.side=Ft,z.needsUpdate=!0,x.renderBufferDirect(Z,B,j,z,y,se),z.side=Bn,z.needsUpdate=!0,x.renderBufferDirect(Z,B,j,z,y,se),z.side=_n):x.renderBufferDirect(Z,B,j,z,y,se),y.onAfterRender(x,B,Z,j,z,se)}function Gr(y,B,Z){B.isScene!==!0&&(B=fe);const j=Ae.get(y),z=p.state.lights,se=p.state.shadowsArray,ge=z.state.version,we=D.getParameters(y,z.state,se,B,Z),ve=D.getProgramCacheKey(we);let Fe=j.programs;j.environment=y.isMeshStandardMaterial?B.environment:null,j.fog=B.fog,j.envMap=(y.isMeshStandardMaterial?le:q).get(y.envMap||j.environment),j.envMapRotation=j.environment!==null&&y.envMap===null?B.environmentRotation:y.envMapRotation,Fe===void 0&&(y.addEventListener("dispose",ee),Fe=new Map,j.programs=Fe);let ze=Fe.get(ve);if(ze!==void 0){if(j.currentProgram===ze&&j.lightsStateVersion===ge)return yc(y,we),ze}else we.uniforms=D.getUniforms(y),y.onBeforeCompile(we,x),ze=D.acquireProgram(we,ve),Fe.set(ve,ze),j.uniforms=we.uniforms;const Le=j.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Le.clippingPlanes=ie.uniform),yc(y,we),j.needsLights=uf(y),j.lightsStateVersion=ge,j.needsLights&&(Le.ambientLightColor.value=z.state.ambient,Le.lightProbe.value=z.state.probe,Le.directionalLights.value=z.state.directional,Le.directionalLightShadows.value=z.state.directionalShadow,Le.spotLights.value=z.state.spot,Le.spotLightShadows.value=z.state.spotShadow,Le.rectAreaLights.value=z.state.rectArea,Le.ltc_1.value=z.state.rectAreaLTC1,Le.ltc_2.value=z.state.rectAreaLTC2,Le.pointLights.value=z.state.point,Le.pointLightShadows.value=z.state.pointShadow,Le.hemisphereLights.value=z.state.hemi,Le.directionalShadowMap.value=z.state.directionalShadowMap,Le.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Le.spotShadowMap.value=z.state.spotShadowMap,Le.spotLightMatrix.value=z.state.spotLightMatrix,Le.spotLightMap.value=z.state.spotLightMap,Le.pointShadowMap.value=z.state.pointShadowMap,Le.pointShadowMatrix.value=z.state.pointShadowMatrix),j.currentProgram=ze,j.uniformsList=null,ze}function Sc(y){if(y.uniformsList===null){const B=y.currentProgram.getUniforms();y.uniformsList=Ts.seqWithValue(B.seq,y.uniforms)}return y.uniformsList}function yc(y,B){const Z=Ae.get(y);Z.outputColorSpace=B.outputColorSpace,Z.batching=B.batching,Z.batchingColor=B.batchingColor,Z.instancing=B.instancing,Z.instancingColor=B.instancingColor,Z.instancingMorph=B.instancingMorph,Z.skinning=B.skinning,Z.morphTargets=B.morphTargets,Z.morphNormals=B.morphNormals,Z.morphColors=B.morphColors,Z.morphTargetsCount=B.morphTargetsCount,Z.numClippingPlanes=B.numClippingPlanes,Z.numIntersection=B.numClipIntersection,Z.vertexAlphas=B.vertexAlphas,Z.vertexTangents=B.vertexTangents,Z.toneMapping=B.toneMapping}function cf(y,B,Z,j,z){B.isScene!==!0&&(B=fe),F.resetTextureUnits();const se=B.fog,ge=j.isMeshStandardMaterial?B.environment:null,we=I===null?x.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:Qi,ve=(j.isMeshStandardMaterial?le:q).get(j.envMap||ge),Fe=j.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,ze=!!Z.attributes.tangent&&(!!j.normalMap||j.anisotropy>0),Le=!!Z.morphAttributes.position,Ye=!!Z.morphAttributes.normal,it=!!Z.morphAttributes.color;let vt=Qn;j.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(vt=x.toneMapping);const ut=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,ot=ut!==void 0?ut.length:0,Ne=Ae.get(j),pt=p.state.lights;if(Pe===!0&&(K===!0||y!==S)){const Pt=y===S&&j.id===M;ie.setState(j,y,Pt)}let je=!1;j.version===Ne.__version?(Ne.needsLights&&Ne.lightsStateVersion!==pt.state.version||Ne.outputColorSpace!==we||z.isBatchedMesh&&Ne.batching===!1||!z.isBatchedMesh&&Ne.batching===!0||z.isBatchedMesh&&Ne.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&Ne.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&Ne.instancing===!1||!z.isInstancedMesh&&Ne.instancing===!0||z.isSkinnedMesh&&Ne.skinning===!1||!z.isSkinnedMesh&&Ne.skinning===!0||z.isInstancedMesh&&Ne.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&Ne.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&Ne.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&Ne.instancingMorph===!1&&z.morphTexture!==null||Ne.envMap!==ve||j.fog===!0&&Ne.fog!==se||Ne.numClippingPlanes!==void 0&&(Ne.numClippingPlanes!==ie.numPlanes||Ne.numIntersection!==ie.numIntersection)||Ne.vertexAlphas!==Fe||Ne.vertexTangents!==ze||Ne.morphTargets!==Le||Ne.morphNormals!==Ye||Ne.morphColors!==it||Ne.toneMapping!==vt||Ne.morphTargetsCount!==ot)&&(je=!0):(je=!0,Ne.__version=j.version);let Ht=Ne.currentProgram;je===!0&&(Ht=Gr(j,B,z));let Mi=!1,Wt=!1,sr=!1;const mt=Ht.getUniforms(),Jt=Ne.uniforms;if(xe.useProgram(Ht.program)&&(Mi=!0,Wt=!0,sr=!0),j.id!==M&&(M=j.id,Wt=!0),Mi||S!==y){xe.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),mt.setValue(P,"projectionMatrix",y.projectionMatrix),mt.setValue(P,"viewMatrix",y.matrixWorldInverse);const Bt=mt.map.cameraPosition;Bt!==void 0&&Bt.setValue(P,pe.setFromMatrixPosition(y.matrixWorld)),Ie.logarithmicDepthBuffer&&mt.setValue(P,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(j.isMeshPhongMaterial||j.isMeshToonMaterial||j.isMeshLambertMaterial||j.isMeshBasicMaterial||j.isMeshStandardMaterial||j.isShaderMaterial)&&mt.setValue(P,"isOrthographic",y.isOrthographicCamera===!0),S!==y&&(S=y,Wt=!0,sr=!0)}if(z.isSkinnedMesh){mt.setOptional(P,z,"bindMatrix"),mt.setOptional(P,z,"bindMatrixInverse");const Pt=z.skeleton;Pt&&(Pt.boneTexture===null&&Pt.computeBoneTexture(),mt.setValue(P,"boneTexture",Pt.boneTexture,F))}z.isBatchedMesh&&(mt.setOptional(P,z,"batchingTexture"),mt.setValue(P,"batchingTexture",z._matricesTexture,F),mt.setOptional(P,z,"batchingIdTexture"),mt.setValue(P,"batchingIdTexture",z._indirectTexture,F),mt.setOptional(P,z,"batchingColorTexture"),z._colorsTexture!==null&&mt.setValue(P,"batchingColorTexture",z._colorsTexture,F));const $t=Z.morphAttributes;if(($t.position!==void 0||$t.normal!==void 0||$t.color!==void 0)&&ne.update(z,Z,Ht),(Wt||Ne.receiveShadow!==z.receiveShadow)&&(Ne.receiveShadow=z.receiveShadow,mt.setValue(P,"receiveShadow",z.receiveShadow)),j.isMeshGouraudMaterial&&j.envMap!==null&&(Jt.envMap.value=ve,Jt.flipEnvMap.value=ve.isCubeTexture&&ve.isRenderTargetTexture===!1?-1:1),j.isMeshStandardMaterial&&j.envMap===null&&B.environment!==null&&(Jt.envMapIntensity.value=B.environmentIntensity),Wt&&(mt.setValue(P,"toneMappingExposure",x.toneMappingExposure),Ne.needsLights&&lf(Jt,sr),se&&j.fog===!0&&G.refreshFogUniforms(Jt,se),G.refreshMaterialUniforms(Jt,j,X,$,p.state.transmissionRenderTarget[y.id]),Ts.upload(P,Sc(Ne),Jt,F)),j.isShaderMaterial&&j.uniformsNeedUpdate===!0&&(Ts.upload(P,Sc(Ne),Jt,F),j.uniformsNeedUpdate=!1),j.isSpriteMaterial&&mt.setValue(P,"center",z.center),mt.setValue(P,"modelViewMatrix",z.modelViewMatrix),mt.setValue(P,"normalMatrix",z.normalMatrix),mt.setValue(P,"modelMatrix",z.matrixWorld),j.isShaderMaterial||j.isRawShaderMaterial){const Pt=j.uniformsGroups;for(let Bt=0,qs=Pt.length;Bt<qs;Bt++){const ni=Pt[Bt];He.update(ni,Ht),He.bind(ni,Ht)}}return Ht}function lf(y,B){y.ambientLightColor.needsUpdate=B,y.lightProbe.needsUpdate=B,y.directionalLights.needsUpdate=B,y.directionalLightShadows.needsUpdate=B,y.pointLights.needsUpdate=B,y.pointLightShadows.needsUpdate=B,y.spotLights.needsUpdate=B,y.spotLightShadows.needsUpdate=B,y.rectAreaLights.needsUpdate=B,y.hemisphereLights.needsUpdate=B}function uf(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(y,B,Z){const j=Ae.get(y);j.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,j.__autoAllocateDepthBuffer===!1&&(j.__useRenderToTexture=!1),Ae.get(y.texture).__webglTexture=B,Ae.get(y.depthTexture).__webglTexture=j.__autoAllocateDepthBuffer?void 0:Z,j.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,B){const Z=Ae.get(y);Z.__webglFramebuffer=B,Z.__useDefaultFramebuffer=B===void 0};const hf=P.createFramebuffer();this.setRenderTarget=function(y,B=0,Z=0){I=y,b=B,R=Z;let j=!0,z=null,se=!1,ge=!1;if(y){const ve=Ae.get(y);if(ve.__useDefaultFramebuffer!==void 0)xe.bindFramebuffer(P.FRAMEBUFFER,null),j=!1;else if(ve.__webglFramebuffer===void 0)F.setupRenderTarget(y);else if(ve.__hasExternalTextures)F.rebindTextures(y,Ae.get(y.texture).__webglTexture,Ae.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const Le=y.depthTexture;if(ve.__boundDepthTexture!==Le){if(Le!==null&&Ae.has(Le)&&(y.width!==Le.image.width||y.height!==Le.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");F.setupDepthRenderbuffer(y)}}const Fe=y.texture;(Fe.isData3DTexture||Fe.isDataArrayTexture||Fe.isCompressedArrayTexture)&&(ge=!0);const ze=Ae.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(ze[B])?z=ze[B][Z]:z=ze[B],se=!0):y.samples>0&&F.useMultisampledRTT(y)===!1?z=Ae.get(y).__webglMultisampledFramebuffer:Array.isArray(ze)?z=ze[Z]:z=ze,C.copy(y.viewport),U.copy(y.scissor),k=y.scissorTest}else C.copy(_e).multiplyScalar(X).floor(),U.copy(ye).multiplyScalar(X).floor(),k=Ve;if(Z!==0&&(z=hf),xe.bindFramebuffer(P.FRAMEBUFFER,z)&&j&&xe.drawBuffers(y,z),xe.viewport(C),xe.scissor(U),xe.setScissorTest(k),se){const ve=Ae.get(y.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+B,ve.__webglTexture,Z)}else if(ge){const ve=B;for(let Fe=0;Fe<y.textures.length;Fe++){const ze=Ae.get(y.textures[Fe]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+Fe,ze.__webglTexture,Z,ve)}}else if(y!==null&&Z!==0){const ve=Ae.get(y.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,ve.__webglTexture,Z)}M=-1},this.readRenderTargetPixels=function(y,B,Z,j,z,se,ge,we=0){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ve=Ae.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&ge!==void 0&&(ve=ve[ge]),ve){xe.bindFramebuffer(P.FRAMEBUFFER,ve);try{const Fe=y.textures[we],ze=Fe.format,Le=Fe.type;if(!Ie.textureFormatReadable(ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ie.textureTypeReadable(Le)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=y.width-j&&Z>=0&&Z<=y.height-z&&(y.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+we),P.readPixels(B,Z,j,z,De.convert(ze),De.convert(Le),se))}finally{const Fe=I!==null?Ae.get(I).__webglFramebuffer:null;xe.bindFramebuffer(P.FRAMEBUFFER,Fe)}}},this.readRenderTargetPixelsAsync=async function(y,B,Z,j,z,se,ge,we=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ve=Ae.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&ge!==void 0&&(ve=ve[ge]),ve)if(B>=0&&B<=y.width-j&&Z>=0&&Z<=y.height-z){xe.bindFramebuffer(P.FRAMEBUFFER,ve);const Fe=y.textures[we],ze=Fe.format,Le=Fe.type;if(!Ie.textureFormatReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ie.textureTypeReadable(Le))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ye=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,Ye),P.bufferData(P.PIXEL_PACK_BUFFER,se.byteLength,P.STREAM_READ),y.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+we),P.readPixels(B,Z,j,z,De.convert(ze),De.convert(Le),0);const it=I!==null?Ae.get(I).__webglFramebuffer:null;xe.bindFramebuffer(P.FRAMEBUFFER,it);const vt=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await yv(P,vt,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,Ye),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,se),P.deleteBuffer(Ye),P.deleteSync(vt),se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,B=null,Z=0){const j=Math.pow(2,-Z),z=Math.floor(y.image.width*j),se=Math.floor(y.image.height*j),ge=B!==null?B.x:0,we=B!==null?B.y:0;F.setTexture2D(y,0),P.copyTexSubImage2D(P.TEXTURE_2D,Z,0,0,ge,we,z,se),xe.unbindTexture()};const ff=P.createFramebuffer(),df=P.createFramebuffer();this.copyTextureToTexture=function(y,B,Z=null,j=null,z=0,se=null){se===null&&(z!==0?(Fr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),se=z,z=0):se=0);let ge,we,ve,Fe,ze,Le,Ye,it,vt;const ut=y.isCompressedTexture?y.mipmaps[se]:y.image;if(Z!==null)ge=Z.max.x-Z.min.x,we=Z.max.y-Z.min.y,ve=Z.isBox3?Z.max.z-Z.min.z:1,Fe=Z.min.x,ze=Z.min.y,Le=Z.isBox3?Z.min.z:0;else{const $t=Math.pow(2,-z);ge=Math.floor(ut.width*$t),we=Math.floor(ut.height*$t),y.isDataArrayTexture?ve=ut.depth:y.isData3DTexture?ve=Math.floor(ut.depth*$t):ve=1,Fe=0,ze=0,Le=0}j!==null?(Ye=j.x,it=j.y,vt=j.z):(Ye=0,it=0,vt=0);const ot=De.convert(B.format),Ne=De.convert(B.type);let pt;B.isData3DTexture?(F.setTexture3D(B,0),pt=P.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(F.setTexture2DArray(B,0),pt=P.TEXTURE_2D_ARRAY):(F.setTexture2D(B,0),pt=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,B.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,B.unpackAlignment);const je=P.getParameter(P.UNPACK_ROW_LENGTH),Ht=P.getParameter(P.UNPACK_IMAGE_HEIGHT),Mi=P.getParameter(P.UNPACK_SKIP_PIXELS),Wt=P.getParameter(P.UNPACK_SKIP_ROWS),sr=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,ut.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,ut.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Fe),P.pixelStorei(P.UNPACK_SKIP_ROWS,ze),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Le);const mt=y.isDataArrayTexture||y.isData3DTexture,Jt=B.isDataArrayTexture||B.isData3DTexture;if(y.isDepthTexture){const $t=Ae.get(y),Pt=Ae.get(B),Bt=Ae.get($t.__renderTarget),qs=Ae.get(Pt.__renderTarget);xe.bindFramebuffer(P.READ_FRAMEBUFFER,Bt.__webglFramebuffer),xe.bindFramebuffer(P.DRAW_FRAMEBUFFER,qs.__webglFramebuffer);for(let ni=0;ni<ve;ni++)mt&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Ae.get(y).__webglTexture,z,Le+ni),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Ae.get(B).__webglTexture,se,vt+ni)),P.blitFramebuffer(Fe,ze,ge,we,Ye,it,ge,we,P.DEPTH_BUFFER_BIT,P.NEAREST);xe.bindFramebuffer(P.READ_FRAMEBUFFER,null),xe.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(z!==0||y.isRenderTargetTexture||Ae.has(y)){const $t=Ae.get(y),Pt=Ae.get(B);xe.bindFramebuffer(P.READ_FRAMEBUFFER,ff),xe.bindFramebuffer(P.DRAW_FRAMEBUFFER,df);for(let Bt=0;Bt<ve;Bt++)mt?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,$t.__webglTexture,z,Le+Bt):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,$t.__webglTexture,z),Jt?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Pt.__webglTexture,se,vt+Bt):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Pt.__webglTexture,se),z!==0?P.blitFramebuffer(Fe,ze,ge,we,Ye,it,ge,we,P.COLOR_BUFFER_BIT,P.NEAREST):Jt?P.copyTexSubImage3D(pt,se,Ye,it,vt+Bt,Fe,ze,ge,we):P.copyTexSubImage2D(pt,se,Ye,it,Fe,ze,ge,we);xe.bindFramebuffer(P.READ_FRAMEBUFFER,null),xe.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else Jt?y.isDataTexture||y.isData3DTexture?P.texSubImage3D(pt,se,Ye,it,vt,ge,we,ve,ot,Ne,ut.data):B.isCompressedArrayTexture?P.compressedTexSubImage3D(pt,se,Ye,it,vt,ge,we,ve,ot,ut.data):P.texSubImage3D(pt,se,Ye,it,vt,ge,we,ve,ot,Ne,ut):y.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,se,Ye,it,ge,we,ot,Ne,ut.data):y.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,se,Ye,it,ut.width,ut.height,ot,ut.data):P.texSubImage2D(P.TEXTURE_2D,se,Ye,it,ge,we,ot,Ne,ut);P.pixelStorei(P.UNPACK_ROW_LENGTH,je),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Ht),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Mi),P.pixelStorei(P.UNPACK_SKIP_ROWS,Wt),P.pixelStorei(P.UNPACK_SKIP_IMAGES,sr),se===0&&B.generateMipmaps&&P.generateMipmap(pt),xe.unbindTexture()},this.initRenderTarget=function(y){Ae.get(y).__webglFramebuffer===void 0&&F.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?F.setTextureCube(y,0):y.isData3DTexture?F.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?F.setTexture2DArray(y,0):F.setTexture2D(y,0),xe.unbindTexture()},this.resetState=function(){b=0,R=0,I=null,xe.reset(),me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return An}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ke._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ke._getUnpackColorSpace()}}const zo=.18,ou=3.2;class zy{prevButtons=[];lastActive=0;axis(e){const t=Math.abs(e);return t<zo?0:Math.sign(e)*((t-zo)/(1-zo))}poll(e,t){const i=typeof navigator.getGamepads=="function"?navigator.getGamepads():[],r=Array.from(i).find(h=>!!h&&h.connected);if(!r)return;const s=r.buttons.map(h=>h.pressed),o=h=>s[h]&&!this.prevButtons[h],a=this.axis(r.axes[0]??0),c=-this.axis(r.axes[1]??0),l=this.axis(r.axes[2]??0),u=this.axis(r.axes[3]??0);(a||c||l||u||s.some(Boolean))&&(this.lastActive=performance.now()),e.moveX+=a,e.moveZ+=c,e.lookDX+=l*ou*t,e.lookDY+=u*ou*t,s[0]&&(e.jump=!0),s[1]&&(e.sneak=!0),s[10]&&(e.sprint=!0),s[7]&&(e.primary=!0),s[6]&&(e.secondaryHold=!0),o(6)&&(e.secondaryTap=!0),o(5)&&(e.slotDelta+=1),o(4)&&(e.slotDelta-=1),o(9)&&(e.toggleDebug=!0),this.prevButtons=s}dispose(){}}function nf(n){n.moveX=0,n.moveZ=0,n.lookDX=0,n.lookDY=0,n.jump=!1,n.sneak=!1,n.sprint=!1,n.primary=!1,n.secondaryTap=!1,n.secondaryHold=!1,n.slotDelta=0,n.slotSelect=-1,n.toggleDebug=!1}function au(){const n={};return nf(n),n}class Vy{state=au();sources=[];paused=!1;add(e){this.sources.push(e)}frame(e){const t=this.state;if(nf(t),this.paused){const r=au();for(const s of this.sources)s.poll(r,e);return t}for(const r of this.sources)r.poll(t,e);const i=Math.hypot(t.moveX,t.moveZ);return i>1&&(t.moveX/=i,t.moveZ/=i),t}dispose(){for(const e of this.sources)e.dispose();this.sources.length=0}}const cu=.0022;class Gy{constructor(e){this.element=e,document.addEventListener("pointerlockerror",this.onLockError),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp),window.addEventListener("blur",this.onBlur),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("mousedown",this.onMouseDown),document.addEventListener("mouseup",this.onMouseUp),document.addEventListener("wheel",this.onWheel,{passive:!0}),document.addEventListener("contextmenu",this.onContextMenu)}element;keys=new Set;lookDX=0;lookDY=0;primary=!1;secondaryHold=!1;secondaryTap=!1;slotDelta=0;slotSelect=-1;toggleDebug=!1;lastActive=0;lockFailed=!1;enabled=!1;onKeyDown=e=>{if(!e.repeat){if(this.lastActive=performance.now(),this.keys.add(e.code),e.code.startsWith("Digit")){const t=Number(e.code.slice(5));t>=1&&t<=9?this.slotSelect=t-1:t===0&&(this.slotSelect=9)}e.code==="F3"&&(this.toggleDebug=!0,e.preventDefault()),(e.code==="Space"||e.code==="Tab")&&e.preventDefault()}};onKeyUp=e=>{this.keys.delete(e.code)};onBlur=()=>{this.keys.clear(),this.primary=!1,this.secondaryHold=!1};onMouseMove=e=>{this.active&&(this.lookDX+=e.movementX*cu,this.lookDY+=e.movementY*cu)};onMouseDown=e=>{this.active&&(this.lastActive=performance.now(),e.button===0&&(this.primary=!0),e.button===2&&(this.secondaryHold=!0,this.secondaryTap=!0))};onMouseUp=e=>{e.button===0&&(this.primary=!1),e.button===2&&(this.secondaryHold=!1)};onWheel=e=>{this.active&&(e.deltaY>0?this.slotDelta++:e.deltaY<0&&this.slotDelta--)};onContextMenu=e=>e.preventDefault();onLockError=()=>{this.lockFailed=!0};get locked(){return document.pointerLockElement===this.element}get active(){return this.locked||this.lockFailed&&this.enabled}async requestLock(){if(this.locked)return!0;if(!this.element.requestPointerLock)return this.lockFailed=!0,!1;const e=this.element.requestPointerLock;try{await e.call(this.element,{unadjustedMovement:!0})}catch{try{await e.call(this.element)}catch{return this.lockFailed=!0,!1}}return await new Promise(t=>setTimeout(t,50)),this.locked?(this.lockFailed=!1,!0):(this.lockFailed=!0,!1)}down(...e){for(const t of e)if(this.keys.has(t))return!0;return!1}poll(e){this.down("KeyW","ArrowUp")&&(e.moveZ+=1),this.down("KeyS","ArrowDown")&&(e.moveZ-=1),this.down("KeyD","ArrowRight")&&(e.moveX+=1),this.down("KeyA","ArrowLeft")&&(e.moveX-=1),this.down("Space")&&(e.jump=!0),this.down("ShiftLeft","ShiftRight")&&(e.sneak=!0),this.down("ControlLeft","ControlRight")&&(e.sprint=!0),e.lookDX+=this.lookDX,e.lookDY+=this.lookDY,this.lookDX=0,this.lookDY=0,this.primary&&(e.primary=!0),this.secondaryHold&&(e.secondaryHold=!0),this.secondaryTap&&(e.secondaryTap=!0),this.secondaryTap=!1,e.slotDelta+=this.slotDelta,this.slotDelta=0,this.slotSelect>=0&&(e.slotSelect=this.slotSelect),this.slotSelect=-1,this.toggleDebug&&(e.toggleDebug=!0),this.toggleDebug=!1}dispose(){document.removeEventListener("pointerlockerror",this.onLockError),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),window.removeEventListener("blur",this.onBlur),document.removeEventListener("mousemove",this.onMouseMove),document.removeEventListener("mousedown",this.onMouseDown),document.removeEventListener("mouseup",this.onMouseUp),document.removeEventListener("wheel",this.onWheel),document.removeEventListener("contextmenu",this.onContextMenu)}}const Hy=.0082,Wy=.0056,_r=56,Xy=28,Vo=.12,lu=220,Yy=14;class Zy{constructor(e){this.ui=e;const t={passive:!1};e.surface.addEventListener("touchstart",this.onStart,t),e.surface.addEventListener("touchmove",this.onMove,t),e.surface.addEventListener("touchend",this.onEnd,t),e.surface.addEventListener("touchcancel",this.onEnd,t),e.jumpButton.addEventListener("touchstart",this.onJumpStart,t),e.jumpButton.addEventListener("touchend",this.onJumpEnd,t),e.jumpButton.addEventListener("touchcancel",this.onJumpEnd,t),e.sneakButton.addEventListener("touchstart",this.onSneak,t),e.stickBase.hidden=!1}ui;stick=null;look=null;lookDX=0;lookDY=0;secondaryTap=!1;jumpHeld=!1;sneakOn=!1;lastActive=0;stickCenter(){const e=this.ui.stickBase.getBoundingClientRect();return{cx:e.left+e.width/2,cy:e.top+e.height/2}}onStickArea(e,t){const i=this.ui.stickBase.getBoundingClientRect(),r=Xy;return e>=i.left-r&&e<=i.right+r&&t>=i.top-r&&t<=i.bottom+r}onStart=e=>{let t=!1;for(const i of Array.from(e.changedTouches))if(!i.target?.closest?.(".hotbar, .tbtn, .sbtn, .topbar, .overlay, .help-panel"))if(t=!0,this.stick===null&&this.onStickArea(i.clientX,i.clientY)){const{cx:r,cy:s}=this.stickCenter();this.stick={id:i.identifier,ox:r,oy:s,dx:0,dy:0},this.moveStick(i.clientX,i.clientY)}else this.look===null&&(this.look={id:i.identifier,startX:i.clientX,startY:i.clientY,lastX:i.clientX,lastY:i.clientY,startTime:performance.now(),mode:"undecided"});t&&(this.lastActive=performance.now(),e.preventDefault())};onMove=e=>{(this.stick||this.look)&&e.preventDefault();for(const t of Array.from(e.changedTouches))if(this.stick&&t.identifier===this.stick.id)this.moveStick(t.clientX,t.clientY);else if(this.look&&t.identifier===this.look.id){const i=this.look,r=t.clientX-i.lastX,s=t.clientY-i.lastY;i.lastX=t.clientX,i.lastY=t.clientY,i.mode==="undecided"&&Math.hypot(t.clientX-i.startX,t.clientY-i.startY)>Yy&&(i.mode="look"),i.mode!=="undecided"&&(this.lookDX+=r*Hy,this.lookDY+=s*Wy)}};moveStick(e,t){if(!this.stick)return;let i=e-this.stick.ox,r=t-this.stick.oy;const s=Math.hypot(i,r);s>_r&&(i*=_r/s,r*=_r/s),this.stick.dx=i,this.stick.dy=r,this.ui.stickKnob.style.transform=`translate(${i}px, ${r}px)`,this.ui.stickBase.classList.add("active")}onEnd=e=>{let t=!1;for(const i of Array.from(e.changedTouches))this.stick&&i.identifier===this.stick.id?(this.stick=null,this.ui.stickKnob.style.transform="translate(0px, 0px)",this.ui.stickBase.classList.remove("active"),t=!0):this.look&&i.identifier===this.look.id&&(this.look.mode==="undecided"&&performance.now()-this.look.startTime<lu&&(this.secondaryTap=!0),this.look=null,t=!0);t&&e.preventDefault()};onJumpStart=e=>{e.preventDefault(),this.jumpHeld=!0,this.ui.jumpButton.classList.add("active")};onJumpEnd=e=>{e.preventDefault(),this.jumpHeld=!1,this.ui.jumpButton.classList.remove("active")};onSneak=e=>{e.preventDefault(),this.sneakOn=!this.sneakOn,this.ui.sneakButton.classList.toggle("active",this.sneakOn),this.ui.onSneakToggle?.(this.sneakOn)};poll(e){if(this.stick){let t=this.stick.dx/_r,i=-this.stick.dy/_r;const r=Math.hypot(t,i);if(r<Vo)t=i=0;else{const s=(r-Vo)/(1-Vo)/r;t*=s,i*=s}e.moveX+=t,e.moveZ+=i,i>.97&&(e.sprint=!0)}if(this.look){const t=this.look;t.mode==="undecided"&&performance.now()-t.startTime>=lu&&(t.mode="break"),t.mode==="break"&&(e.primary=!0)}e.lookDX+=this.lookDX,e.lookDY+=this.lookDY,this.lookDX=0,this.lookDY=0,this.secondaryTap&&(e.secondaryTap=!0),this.secondaryTap=!1,this.jumpHeld&&(e.jump=!0),this.sneakOn&&(e.sneak=!0)}dispose(){const e=this.ui.surface;e.removeEventListener("touchstart",this.onStart),e.removeEventListener("touchmove",this.onMove),e.removeEventListener("touchend",this.onEnd),e.removeEventListener("touchcancel",this.onEnd),this.ui.jumpButton.removeEventListener("touchstart",this.onJumpStart),this.ui.jumpButton.removeEventListener("touchend",this.onJumpEnd),this.ui.jumpButton.removeEventListener("touchcancel",this.onJumpEnd),this.ui.sneakButton.removeEventListener("touchstart",this.onSneak)}}const rf=0,jy=1,Ky=2,Sr=3;function qy(n,e){const t=e.get("missing")??0,i=r=>e.get(r)??t;return n.defs.map(r=>{if(r.id==="air"||!r.textures)return{layer:rf,opaque:!1,castAO:!1,sameCull:!1,tex:[0,0,0,0,0,0],fluidKind:0,fluidHeight:0};const s=r.fluid==="water"||r.id==="ice",o=r.solid&&!r.transparent||r.fluid==="lava",a=s?Sr:o?jy:Ky,[c,l,u]=r.textures,h=i(l);return{layer:a,opaque:o,castAO:o&&!r.fluid||r.id==="leaves",sameCull:r.transparent,tex:[h,h,i(c),i(u),h,h],fluidKind:r.fluid==="water"?1:r.fluid==="lava"?2:0,fluidHeight:r.fluid?(8-r.fluidLevel)/9:0}})}const fi={w:.6,h:1.8},uu=1.62,Qy=1.27,hu=4.317,Jy=5.612,$y=1.31,eM=2.2,tM=32,fu=9,vs=1/60,nM=1,iM=1.3,rM=14,du=89.5*Math.PI/180;class sM{constructor(e,t,i,r=0){this.world=e,this.registry=t,this.pos={...i},this.spawn={...i},this.yaw=r}world;registry;pos;vel={x:0,y:0,z:0};yaw=0;pitch=0;onGround=!1;sneaking=!1;sprinting=!1;inWater=!1;eyeHeight=uu;walkCycle=0;horizontalSpeed=0;stepCamOffset=0;accumulator=0;moveOut={onGround:!1,hitX:!1,hitY:!1,hitZ:!1,hitCeiling:!1};spawn;isSolid=(e,t,i)=>this.registry.isSolid(this.world.getBlock(e,t,i));isWaterAt(e,t,i){return this.registry.get(this.world.getBlock(Math.floor(e),Math.floor(t),Math.floor(i))).fluid!==null}respawn(){this.pos.x=this.spawn.x,this.pos.y=this.spawn.y,this.pos.z=this.spawn.z,this.vel.x=this.vel.y=this.vel.z=0}applyLook(e,t){this.yaw-=e,this.pitch=Math.max(-du,Math.min(du,this.pitch-t)),this.yaw>Math.PI?this.yaw-=Math.PI*2:this.yaw<-Math.PI&&(this.yaw+=Math.PI*2)}get eye(){return{x:this.pos.x,y:this.pos.y+this.eyeHeight,z:this.pos.z}}get lookDir(){const e=Math.cos(this.pitch);return{x:-e*Math.sin(this.yaw),y:Math.sin(this.pitch),z:-e*Math.cos(this.yaw)}}update(e,t){for(this.applyLook(e.lookDX,e.lookDY),this.accumulator=Math.min(this.accumulator+t,vs*8);this.accumulator>=vs;)this.step(e,vs),this.accumulator-=vs}step(e,t){const i=this.pos,r=this.vel;this.inWater=this.isWaterAt(i.x,i.y+.2,i.z)||this.isWaterAt(i.x,i.y+this.eyeHeight-.1,i.z),this.sneaking=e.sneak&&!this.inWater,this.sprinting=e.sprint&&e.moveZ>.5&&!this.sneaking;const s=Math.sin(this.yaw),o=Math.cos(this.yaw);let a=o*e.moveX-s*e.moveZ,c=-s*e.moveX-o*e.moveZ;const l=Math.hypot(a,c);l>1&&(a/=l,c/=l);const u=this.inWater?eM:this.sneaking?$y:this.sprinting?Jy:hu,h=this.inWater?6:this.onGround?18:3.5,f=Math.min(1,h*t);if(r.x+=(a*u-r.x)*f,r.z+=(c*u-r.z)*f,this.inWater)if(e.jump&&this.onGround&&!this.isWaterAt(i.x,i.y+1,i.z))r.y=fu,this.onGround=!1;else{const b=(this.moveOut.hitX||this.moveOut.hitZ)&&(e.moveX!==0||e.moveZ!==0),R=e.jump||b?4:-2.2;r.y+=(R-r.y)*Math.min(1,6*t)}else r.y-=tM*t,r.y<-78&&(r.y=-78),e.jump&&this.onGround&&(r.y=fu,this.onGround=!1);const d=this.onGround,g=i.x,_=i.y,m=i.z,p=r.x,A=r.z;if(Ss(this.isSolid,i,fi,r,t,this.moveOut),this.onGround=this.moveOut.onGround,!this.sneaking&&(d||this.inWater)&&(this.moveOut.hitX||this.moveOut.hitZ)){const b=$_(this.isSolid,{x:g,y:_,z:m},i,fi,p,A,t,this.inWater?iM:nM);b&&(r.x=b.vx,r.z=b.vz,r.y=0,this.onGround=!0,this.stepCamOffset-=b.dy)}if(this.stepCamOffset+=(0-this.stepCamOffset)*Math.min(1,rM*t),Math.abs(this.stepCamOffset)<.002&&(this.stepCamOffset=0),this.sneaking&&d&&!oo(this.isSolid,i,fi)){const b=i.x;i.x=g,oo(this.isSolid,i,fi)||(i.x=b,i.z=m,oo(this.isSolid,i,fi)||(i.x=g)),r.x=r.z=0,this.onGround=!0}const E=fi.w/2+.001;i.x<E?(i.x=E,r.x=0):i.x>this.world.sizeX-E&&(i.x=this.world.sizeX-E,r.x=0),i.z<E?(i.z=E,r.z=0):i.z>this.world.sizeZ-E&&(i.z=this.world.sizeZ-E,r.z=0),i.y<-24&&this.respawn();const x=this.sneaking?Qy:uu;this.eyeHeight+=(x-this.eyeHeight)*Math.min(1,22*t);const w=Math.hypot(r.x,r.z);this.horizontalSpeed=w,this.onGround&&w>.4&&(this.walkCycle+=w*t*1.9)}applyToCamera(e,t){const i=this.eye,s=(this.onGround&&this.horizontalSpeed>.4?Math.min(1,this.horizontalSpeed/hu):0)*t;e.position.set(i.x,i.y+this.stepCamOffset-Math.abs(Math.cos(this.walkCycle))*.045*s,i.z),e.rotation.order="YXZ",e.rotation.set(this.pitch,this.yaw,Math.sin(this.walkCycle)*.006*s)}}const sf=new qe(8103167),of=new qe(12638463),pu=.05,oM=`
in vec4 meta; // 텍스처 레이어, AO(0..3), 면(0..5), 빛(스카이<<4 | 블록)
uniform float uSkyLight; // 낮 1.0 → 밤 0.2 (M3). 스카이라이트에만 곱한다
out vec3 vUvw;
out float vShade;
out vec3 vLight;
out float vDepth;

void main() {
  float face = meta.z;
  // 마인크래프트 면 음영: 위 1.0, 아래 0.5, ±Z 0.8, ±X 0.6
  float shade = face == 2.0 ? 1.0 : (face == 3.0 ? 0.5 : (face < 2.0 ? 0.6 : 0.8));
  float ao = 0.4 + 0.2 * meta.y; // 3 → 1.0, 0 → 0.4
  vShade = shade * ao;

  // 빛: 스카이(밤에 어두워짐)와 블록(횃불·용암, 따뜻한 색) 중 밝은 쪽
  float skyRaw = floor(meta.w / 16.0 + 0.001);
  float sky = skyRaw / 15.0 * uSkyLight;
  float blk = (meta.w - skyRaw * 16.0) / 15.0;
  float l = max(sky, blk);
  float lum = ${pu.toFixed(2)} + ${(1-pu).toFixed(2)} * pow(l, 1.5);
  vec3 warm = mix(vec3(1.0), vec3(1.0, 0.86, 0.68), clamp(blk - sky, 0.0, 1.0));
  vLight = lum * warm;

  vUvw = vec3(uv, meta.x);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`,aM=`
precision highp sampler2DArray;
out vec4 fragColor;
uniform sampler2DArray uTex;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;
uniform float uCutout; // 1 = 불투명 패스(알파 컷), 0 = 반투명 패스
uniform float uTime;
in vec3 vUvw;
in float vShade;
in vec3 vLight;
in float vDepth;

void main() {
  vec2 uv = vUvw.xy;
  if (uCutout < 0.5) uv += vec2(uTime * 0.03, uTime * 0.017); // 물 흐름
  vec4 tex = texture(uTex, vec3(uv, vUvw.z));
  if (uCutout > 0.5 && tex.a < 0.5) discard;
  vec3 col = tex.rgb * vShade * vLight;
  // 안개도 그 자리 밝기만큼만 — 동굴 안에서 멀리가 하늘색으로 뿌옇게 되지 않게
  float f = smoothstep(uFogNear, uFogFar, vDepth);
  col = mix(col, uFogColor * vLight.r, f);
  fragColor = vec4(col, uCutout > 0.5 ? 1.0 : tex.a);
}
`;function cM(n){const e=(o,a={})=>new Mn({glslVersion:Ls,vertexShader:oM,fragmentShader:aM,uniforms:{uTex:{value:n},uFogColor:{value:of.clone()},uFogNear:{value:60},uFogFar:{value:120},uSkyLight:{value:1},uCutout:{value:o},uTime:{value:0}},...a}),t=e(1,{side:Bn}),i=e(0,{transparent:!0,depthWrite:!1,side:_n}),r=e(1);r.uniforms.uFogNear.value=1e5,r.uniforms.uFogFar.value=1e6;const s=[t,i,r];return{opaque:t,translucent:i,hand:r,setFog(o,a){t.uniforms.uFogNear.value=o,t.uniforms.uFogFar.value=a,i.uniforms.uFogNear.value=o,i.uniforms.uFogFar.value=a},setTime(o){for(const a of s)a.uniforms.uTime.value=o},setSkyLight(o){for(const a of s)a.uniforms.uSkyLight.value=o},dispose(){for(const o of s)o.dispose()}}}function af(n,e,t){const i=new bn;return i.setAttribute("position",new kt(n.positions,3)),i.setAttribute("uv",new kt(n.uvs,2)),i.setAttribute("meta",new kt(n.meta,4)),i.setIndex(new kt(n.indices,1)),i.boundingSphere=new Xs(t,e),i}class lM{constructor(e,t,i,r,s){this.world=e,this.lights=t,this.materials=i,this.pool=r,s.add(this.group)}world;lights;materials;pool;group=new _i;stats={meshed:0,lastMs:0,avgMs:0,maxMs:0,visibleChunks:0};renderDistance=8;maxPerFrame=2;burst=!0;entries=new Map;dirty=new Map;boundingRadius=Math.sqrt(3)*Oe/2+.5;paddedScratch=null;get queued(){return this.dirty.size}get inflight(){return this.pool.inflight}markDirty(e,t,i){this.world.chunkInBounds(e,t,i)&&this.dirty.set(fn(e,t,i),{cx:e,cy:t,cz:i})}markDirtyAll(e){for(const t of e)this.markDirty(t.cx,t.cy,t.cz)}markAll(){this.world.forEachChunk(e=>this.markDirty(e.cx,e.cy,e.cz))}update(e,t,i){const r=Math.floor(e/Oe),s=Math.floor(t/Oe),o=Math.floor(i/Oe);if(this.dirty.size>0){const c=this.burst?24:this.maxPerFrame,l=[...this.dirty.values()];l.length>1&&l.sort((h,f)=>{const d=(h.cx-r)**2+(h.cz-o)**2+(h.cy-s)**2,g=(f.cx-r)**2+(f.cz-o)**2+(f.cy-s)**2;return d-g});let u=0;for(const h of l){if(u>=c||this.pool.inflight>=this.pool.size*3)break;this.dirty.delete(fn(h.cx,h.cy,h.cz)),this.dispatch(h)&&u++}}else this.burst&&this.pool.inflight===0&&(this.burst=!1);let a=0;for(const c of this.entries.values()){const l=Math.abs(c.cx-r),u=Math.abs(c.cz-o),h=Math.max(l,u)<=this.renderDistance;c.opaque&&(c.opaque.visible=h),c.translucent&&(c.translucent.visible=h),h&&(c.opaque||c.translucent)&&a++}this.stats.visibleChunks=a}entry(e){const t=fn(e.cx,e.cy,e.cz);let i=this.entries.get(t);return i||(i={cx:e.cx,cy:e.cy,cz:e.cz,opaque:null,translucent:null,inflight:!1,redo:!1},this.entries.set(t,i)),i}dispatch(e){const t=this.entry(e),i=this.world.getChunk(e.cx,e.cy,e.cz);if(!i||i.isEmpty())return this.removeMesh(t,"opaque"),this.removeMesh(t,"translucent"),!1;if(t.inflight)return t.redo=!0,!1;t.inflight=!0;const r=i.version,s=this.world.buildPadded(e.cx,e.cy,e.cz,this.paddedScratch??void 0);this.paddedScratch=null;const o=this.lights.buildPaddedLight(e.cx,e.cy,e.cz);return this.pool.mesh(e.cx,e.cy,e.cz,s,o).then(a=>{t.inflight=!1,this.apply(t,a),(t.redo||i.version!==r)&&(t.redo=!1,this.markDirty(e.cx,e.cy,e.cz))},a=>{t.inflight=!1,console.error("메싱 실패",e,a)}),!0}apply(e,t){const i=this.stats;i.meshed++,i.lastMs=t.ms,i.avgMs=i.avgMs===0?t.ms:i.avgMs*.9+t.ms*.1,i.maxMs=Math.max(i.maxMs,t.ms);const r=new Y(Oe/2,Oe/2,Oe/2);for(const s of["opaque","translucent"]){const o=t.result[s];if(!o){this.removeMesh(e,s);continue}const a=af(o,this.boundingRadius,r);let c=e[s];c?(c.geometry.dispose(),c.geometry=a):(c=new zt(a,s==="opaque"?this.materials.opaque:this.materials.translucent),c.position.set(e.cx*Oe,e.cy*Oe,e.cz*Oe),c.matrixAutoUpdate=!1,c.updateMatrix(),c.renderOrder=s==="opaque"?0:10,e[s]=c,this.group.add(c))}}removeMesh(e,t){const i=e[t];i&&(this.group.remove(i),i.geometry.dispose(),e[t]=null)}dispose(){for(const e of this.entries.values())this.removeMesh(e,"opaque"),this.removeMesh(e,"translucent");this.entries.clear(),this.dirty.clear()}}const ht=Oe,mu=[[0,0,-1],[0,0,1],[1,0,0],[1,0,0],[1,0,0],[-1,0,0]],gu=[[0,1,0],[0,1,0],[0,0,1],[0,0,1],[0,1,0],[0,1,0]],uM=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],hM=[[0,1,0],[1,-1,0],[4,0,1],[5,0,-1]];class _u{positions;uvs;meta;indices;vc=0;ic=0;constructor(e=512){this.positions=new Float32Array(e*4*3),this.uvs=new Float32Array(e*4*2),this.meta=new Uint8Array(e*4*4),this.indices=new Uint32Array(e*6)}ensure(){if((this.vc+4)*3<=this.positions.length)return;const e=t=>{const i=new t.constructor(t.length*2);return i.set(t),i};this.positions=e(this.positions),this.uvs=e(this.uvs),this.meta=e(this.meta),this.indices=e(this.indices)}quad(e,t,i){this.ensure();const r=this.vc;for(let a=0;a<4;a++){const c=e[a],l=(r+a)*3;this.positions[l]=c[0],this.positions[l+1]=c[1],this.positions[l+2]=c[2];const u=(r+a)*2;this.uvs[u]=c[3],this.uvs[u+1]=c[4];const h=(r+a)*4;this.meta[h]=t,this.meta[h+1]=c[5],this.meta[h+2]=i,this.meta[h+3]=c[6]??Hi}const s=e[0][5]+e[2][5]>e[1][5]+e[3][5],o=this.ic;s?(this.indices[o]=r+1,this.indices[o+1]=r+2,this.indices[o+2]=r+3,this.indices[o+3]=r+1,this.indices[o+4]=r+3,this.indices[o+5]=r):(this.indices[o]=r,this.indices[o+1]=r+1,this.indices[o+2]=r+2,this.indices[o+3]=r,this.indices[o+4]=r+2,this.indices[o+5]=r+3),this.vc+=4,this.ic+=6}build(){return this.vc===0?null:{positions:this.positions.slice(0,this.vc*3),uvs:this.uvs.slice(0,this.vc*2),meta:this.meta.slice(0,this.vc*4),indices:this.indices.slice(0,this.ic),vertexCount:this.vc,indexCount:this.ic}}}function fM(n,e,t){const i=new _u,r=new _u,s=new Int32Array(ht*ht),o=new Int32Array(ht*ht),a=new Int32Array(ht*ht),c=new Int32Array(ht*ht),l=[0,0,0],u=[0,0,0];let h=Hi;const f=(A,E,x,w,b,R)=>{u[0]=l[0],u[1]=l[1],u[2]=l[2],u[A]+=E,mn(u[0],u[1],u[2]);const I=u[x],M=u[b];u[x]=I+w;const S=mn(u[0],u[1],u[2]);u[x]=I,u[b]=M+R;const C=mn(u[0],u[1],u[2]);u[x]=I+w;const U=mn(u[0],u[1],u[2]),k=e[n[S]],V=e[n[C]],H=e[n[U]],W=k!==void 0&&k.castAO,$=V!==void 0&&V.castAO,X=H!==void 0&&H.castAO;return h=Hi,W&&$?0:3-((W?1:0)+($?1:0)+(X?1:0))},d=(A,E,x)=>Hi,g=(A,E,x)=>{const w=e[x];return w?!(w.opaque||E===x&&A.sameCull||A.layer===Sr&&w.layer===Sr&&w.fluidKind===0):!0},_=(A,E,x,w,b,R,I,M)=>{const S=d();let C;switch(E){case 0:C=[[x+1,w+R,b],[x+1,w+R,b+1],[x+1,w+I,b+1],[x+1,w+I,b]];break;case 1:C=[[x,w+R,b],[x,w+R,b+1],[x,w+I,b+1],[x,w+I,b]];break;case 2:C=[[x,w+I,b],[x+1,w+I,b],[x+1,w+I,b+1],[x,w+I,b+1]];break;case 3:C=[[x,w,b],[x+1,w,b],[x+1,w,b+1],[x,w,b+1]];break;case 4:C=[[x,w+R,b+1],[x+1,w+R,b+1],[x+1,w+I,b+1],[x,w+I,b+1]];break;default:C=[[x,w+R,b],[x+1,w+R,b],[x+1,w+I,b],[x,w+I,b]]}const U=uM[E],k=[C[1][0]-C[0][0],C[1][1]-C[0][1],C[1][2]-C[0][2]],V=[C[3][0]-C[0][0],C[3][1]-C[0][1],C[3][2]-C[0][2]],H=[k[1]*V[2]-k[2]*V[1],k[2]*V[0]-k[0]*V[2],k[0]*V[1]-k[1]*V[0]];H[0]*U[0]+H[1]*U[1]+H[2]*U[2]<0&&(C=[C[0],C[3],C[2],C[1]]);const W=mu[E],$=gu[E],X=C.map(te=>[te[0],te[1],te[2],te[0]*W[0]+te[1]*W[1]+te[2]*W[2],te[0]*$[0]+te[1]*$[1]+te[2]*$[2],3,S]);A.quad(X,M,E)},m=()=>{for(let A=0;A<ht;A++)for(let E=0;E<ht;E++)for(let x=0;x<ht;x++){const w=e[n[mn(x,A,E)]];if(w===void 0||w.fluidKind===0)continue;const b=w.fluidHeight,R=w.fluidKind,I=w.layer===Sr?r:i,M=(U,k,V)=>e[n[mn(x+U,A+k,E+V)]],S=M(0,1,0);(S===void 0||S.fluidKind!==R)&&_(I,2,x,A,E,0,b,w.tex[2]);const C=M(0,-1,0);(C===void 0||!(C.opaque||C.fluidKind===R))&&_(I,3,x,A,E,0,b,w.tex[3]);for(const[U,k,V]of hM){const H=M(k,0,V);let W=0;if(H!==void 0){if(H.opaque)continue;if(H.fluidKind===R){if(H.fluidHeight>=b-1e-6)continue;W=H.fluidHeight}}_(I,U,x,A,E,W,b,w.tex[U])}}},p=(A,E,x,w,b,R,I,M)=>{const S=mu[R],C=gu[R];for(let U=0;U<ht;U++)for(let k=0;k<ht;){const V=A[U*ht+k];if(V===0){k++;continue}const H=E[U*ht+k];let W=1;for(;k+W<ht&&A[U*ht+k+W]===V&&E[U*ht+k+W]===H;)W++;let $=1;e:for(;U+$<ht;$++)for(let Ce=0;Ce<W;Ce++){const Pe=(U+$)*ht+k+Ce;if(A[Pe]!==V||E[Pe]!==H)break e}const X=V>>>8,te=V&255,ae=e[X],_e=ae.tex[R],ye=[];for(let Ce=0;Ce<4;Ce++){const Pe=Ce===1||Ce===2?1:0,K=Ce===2||Ce===3?1:0,Q=[0,0,0];Q[x]=I,Q[w]=U+Pe*$,Q[b]=k+K*W;const pe=Q[0]*S[0]+Q[1]*S[1]+Q[2]*S[2],Me=Q[0]*C[0]+Q[1]*C[1]+Q[2]*C[2];ye.push([Q[0],Q[1],Q[2],pe,Me,te>>Ce*2&3,H>>>Ce*8&255])}const Ve=M?ye:[ye[0],ye[3],ye[2],ye[1]];(ae.layer===Sr?r:i).quad(Ve,_e,R);for(let Ce=0;Ce<$;Ce++)for(let Pe=0;Pe<W;Pe++){const K=(U+Ce)*ht+k+Pe;A[K]=0,E[K]=0}k+=W}};for(let A=0;A<3;A++){const E=(A+1)%3,x=(A+2)%3,w=A*2,b=A*2+1;for(let R=0;R<ht;R++){let I=0;for(let M=0;M<ht;M++)for(let S=0;S<ht;S++,I++){l[A]=R,l[E]=M,l[x]=S;const C=n[mn(l[0],l[1],l[2])],U=e[C];let k=0,V=0,H=0,W=0;if(U!==void 0&&U.layer!==rf&&U.fluidKind===0){l[A]=R+1;const $=n[mn(l[0],l[1],l[2])];if(l[A]=R,g(U,C,$)){const te=f(A,1,E,-1,x,-1),ae=h,_e=f(A,1,E,1,x,-1),ye=h,Ve=f(A,1,E,1,x,1),Ce=h,Pe=f(A,1,E,-1,x,1),K=h;k=C<<8|te|_e<<2|Ve<<4|Pe<<6,H=ae|ye<<8|Ce<<16|K<<24}l[A]=R-1;const X=n[mn(l[0],l[1],l[2])];if(l[A]=R,g(U,C,X)){const te=f(A,-1,E,-1,x,-1),ae=h,_e=f(A,-1,E,1,x,-1),ye=h,Ve=f(A,-1,E,1,x,1),Ce=h,Pe=f(A,-1,E,-1,x,1),K=h;V=C<<8|te|_e<<2|Ve<<4|Pe<<6,W=ae|ye<<8|Ce<<16|K<<24}}s[I]=k,o[I]=V,a[I]=H,c[I]=W}p(s,a,A,E,x,w,R+1,!0),p(o,c,A,E,x,b,R,!1)}}return m(),{opaque:i.build(),translucent:r.build()}}const dM=.24,pM=.85,mM=-.7,Go=-1.25,gM=.34,vu=.3,_M=.6;class vM{constructor(e,t){this.materials=e,this.blockInfo=t,this.scene.add(this.anchor),this.anchor.add(this.pivot),this.pivot.position.set(0,0,Go),this.pivot.rotation.set(vu,_M,0)}materials;blockInfo;scene=new Zh;anchor=new _i;pivot=new _i;mesh=null;swingT=1;currentBlock=-1;setBlock(e){if(e===this.currentBlock||(this.currentBlock=e,this.mesh&&(this.pivot.remove(this.mesh),this.mesh.geometry.dispose(),this.mesh=null),e<=0))return;const t=new Uint16Array(ic);t[mn(0,0,0)]=e;const i=fM(t,this.blockInfo),r=i.opaque??i.translucent;if(!r)return;const s=af(r,1,new Y(.5,.5,.5));s.translate(-.5,-.5,-.5),this.mesh=new zt(s,i.opaque?this.materials.hand:this.materials.translucent),this.mesh.scale.setScalar(gM),this.mesh.frustumCulled=!1,this.pivot.add(this.mesh)}swing(){(this.swingT>=1||this.swingT>.5)&&(this.swingT=0)}update(e,t,i,r){this.anchor.position.copy(t.position),this.anchor.quaternion.copy(t.quaternion);const s=Math.tan(Ev.degToRad(t.fov/2))*-Go,o=s*t.aspect,a=pM*o,c=mM*s;let l=0,u=0,h=0;if(l+=Math.sin(i)*.02*r,u+=-Math.abs(Math.cos(i))*.025*r,this.swingT<1){this.swingT=Math.min(1,this.swingT+e/dM);const f=Math.sin(this.swingT*Math.PI);u-=f*.28,l-=f*.12,h-=f*1.1}this.pivot.position.set(a+l,c+u,Go),this.pivot.rotation.x=vu+h}render(e,t){this.mesh&&(e.clearDepth(),e.render(this.scene,t))}dispose(){this.mesh&&this.mesh.geometry.dispose()}}function xM(n,e=!1){const t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),r=new Set(Object.keys(n[0].morphAttributes)),s={},o={},a=n[0].morphTargetsRelative,c=new bn;let l=0;for(let u=0;u<n.length;++u){const h=n[u];let f=0;if(t!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in h.attributes){if(!i.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;s[d]===void 0&&(s[d]=[]),s[d].push(h.attributes[d]),f++}if(f!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(a!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in h.morphAttributes){if(!r.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;o[d]===void 0&&(o[d]=[]),o[d].push(h.morphAttributes[d])}if(e){let d;if(t)d=h.index.count;else if(h.attributes.position!==void 0)d=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,d,u),l+=d}}if(t){let u=0;const h=[];for(let f=0;f<n.length;++f){const d=n[f].index;for(let g=0;g<d.count;++g)h.push(d.getX(g)+u);u+=n[f].attributes.position.count}c.setIndex(h)}for(const u in s){const h=xu(s[u]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;c.setAttribute(u,h)}for(const u in o){const h=o[u][0].length;if(h===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[u]=[];for(let f=0;f<h;++f){const d=[];for(let _=0;_<o[u].length;++_)d.push(o[u][_][f]);const g=xu(d);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;c.morphAttributes[u].push(g)}}return c}function xu(n){let e,t,i,r=-1,s=0;for(let l=0;l<n.length;++l){const u=n[l];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=u.normalized),i!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=u.gpuType),r!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=u.count*t}const o=new e(s),a=new kt(o,t,i);let c=0;for(let l=0;l<n.length;++l){const u=n[l];if(u.isInterleavedBufferAttribute){const h=c/t;for(let f=0,d=u.count;f<d;f++)for(let g=0;g<t;g++){const _=u.getComponent(f,g);a.setComponent(f+h,g,_)}}else o.set(u.array,c);c+=u.count*t}return r!==void 0&&(a.gpuType=r),a}const Os=10,AM=.02;function EM(){const n=ea(51116),e=[],t=new Set,i=(o,a)=>{o=Math.max(0,Math.min(15,o)),a=Math.max(0,Math.min(15,a));const c=a*16+o;t.has(c)||(t.add(c),e.push([o,a]))};for(let o=0;o<14;o++){let a=6+Math.floor(n()*4),c=6+Math.floor(n()*4);const l=n()<.5?-1:1,u=n()<.5?-1:1;for(let h=0;h<12;h++)i(a,c),n()<.55?a+=l:c+=u,n()<.15&&i(a+(n()<.5?1:-1),c)}const r=e.length,s=[];for(let o=0;o<Os;o++){const a=document.createElement("canvas");a.width=a.height=16;const c=a.getContext("2d");c.clearRect(0,0,16,16);const l=Math.floor(r*(o+1)/Os);for(let h=0;h<l;h++){const[f,d]=e[h],g=.55+.35*(h/r);c.fillStyle=`rgba(15,15,15,${g.toFixed(2)})`,c.fillRect(f,d,1,1)}const u=new Jv(a);u.magFilter=Vt,u.minFilter=Vt,u.colorSpace=Kt,s.push(u)}return s}function SM(n,e){const t=n/2,i=[],r=(a,c,l,u,h,f)=>{const d=new yi(a,c,l);d.translate(u,h,f),i.push(d)},s=n+e;for(const a of[-t,t])for(const c of[-t,t])r(s,e,e,0,a,c),r(e,s,e,a,0,c),r(e,e,s,a,c,0);const o=xM(i,!1);for(const a of i)a.dispose();return o}class yM{outline;crack;crackMat;crackTextures;stage=-1;constructor(e){this.outline=new zt(SM(1.004,AM),new Fs({color:0,transparent:!0,opacity:.45,depthWrite:!1})),this.outline.renderOrder=5,this.outline.visible=!1,e.add(this.outline),this.crackTextures=EM(),this.crackMat=new Fs({map:this.crackTextures[0],transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),this.crack=new zt(new yi(1.002,1.002,1.002),this.crackMat),this.crack.renderOrder=4,this.crack.visible=!1,e.add(this.crack)}setTarget(e,t,i){this.outline.visible=!0,this.outline.position.set(e+.5,t+.5,i+.5),this.crack.position.copy(this.outline.position)}clearTarget(){this.outline.visible=!1,this.crack.visible=!1}setProgress(e){if(e<=0||!this.outline.visible){this.crack.visible=!1,this.stage=-1;return}const t=Math.min(Os-1,Math.floor(e*Os));t!==this.stage&&(this.stage=t,this.crackMat.map=this.crackTextures[t],this.crackMat.needsUpdate=!0),this.crack.visible=!0}dispose(){this.outline.geometry.dispose(),this.outline.material.dispose(),this.crack.geometry.dispose(),this.crackMat.dispose();for(const e of this.crackTextures)e.dispose()}}class MM{mesh;material;constructor(e){this.material=new Mn({glslVersion:Ls,side:Ft,depthWrite:!1,depthTest:!1,uniforms:{uZenith:{value:new qe(5210088)},uHorizon:{value:sf.clone()},uFog:{value:of.clone()},uVoid:{value:new qe(2832988)},uSunDir:{value:new Y(.45,.72,.3).normalize()}},vertexShader:`
        out vec3 vDir;
        void main() {
          vDir = position;
          vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_Position = p.xyww; // 항상 가장 멀리
        }
      `,fragmentShader:`
        out vec4 fragColor;
        uniform vec3 uZenith, uHorizon, uFog, uVoid, uSunDir;
        in vec3 vDir;
        void main() {
          vec3 d = normalize(vDir);
          vec3 col = mix(uFog, uHorizon, smoothstep(0.0, 0.12, d.y));
          col = mix(col, uZenith, smoothstep(0.1, 0.6, d.y));
          if (d.y < 0.0) col = mix(uFog, uVoid, smoothstep(0.0, -0.35, d.y));
          float s = dot(d, uSunDir);
          if (s > 0.9988) col = vec3(1.0, 0.98, 0.92);
          else if (s > 0.995) col = mix(col, vec3(1.0, 0.96, 0.85), 0.35);
          fragColor = vec4(col, 1.0);
        }
      `}),this.mesh=new zt(new pc(1,24,12),this.material),this.mesh.scale.setScalar(400),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-100,e.add(this.mesh)}update(e){this.mesh.position.copy(e)}dispose(){this.mesh.geometry.dispose(),this.material.dispose()}}const bM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACKUlEQVR42jWT51JqUQxG9/sAShGkSBPpTXovglSpMo6AgwxPnjsrd/zB5JzNzpeVLzkmHo+L0+mUfr+v8f7+Xp6ensRms4nP55Nisaj/BYNBeX19lcFgIIVCQcLhsHg8HjHtdltCoZAQ+XH57e1NvF6vRCIRCQQCkkqlpNPpyHK5lPF4rO+xWEx6vZ6Y4XCohyRzmYvlclnq9boKNBoNeX5+VqpcLqfn+/1eFouFHA6H/wKPj4+afHd3p7FSqcjLy4v4/X5JJBL6fDwelaBUKsnHx4e43W4VMev1Wr6/v6XVamlvoCGSz+el2WzqpXQ6LbVaTVwulxJQAEHaNJlMRjG/vr4UkWokUpmYTCa1RapyRtJ0OhXyIDIoYUa1WpXz+SwQORwOFYIIMvqH5OHhQSNnp9NJaUw2m1XnV6uVTgOHwe12u2K32zV5MpkoHUS0s9lsZDQaCf4Z1BgbeNvtVj3AdYQxETLmjzgG8sxuQPP+/i6GRUKd0eAD7bBAiCFssVh0if4WDfe5QwEEDcm73U6u16uaAwGYs9lM24EMCnxBhMiUGD0Gq4kkg/b7+yvRaFR7phI+QMBFDLVarZpMUVpi3Q3o7DVzJxkzaQEaNhIa5g7JHx2C5ECpAjyQfLvd1GlWlBkza6gul4vi8x+FECAPcgPSz8+PKrIszB8hnObC5+enbh2jg4JECBHBI0MvLBCfKYjz+Vxd56NinLxDwz5Aw1YiwsdH/AcfgvkbkXGX1AAAAABJRU5ErkJggg==",wM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB20lEQVR42o3SzU4aURQH8Ps4bBprmVoXdNNUJTpfDPOBjaum1CqWNm1apTYjHyOC4KpBLRGpOqCMYF+jT8Jr/JtzEhqmsGBxknvvOf/fvcmMCKpJdD0Vg5oFNx3DQ92GX5TRO0rg/tjEXVnH7xMHfklGv2ah4yl8dk+5QxWCGr1KggMEdEoKgxSmAcKCioHbss77Qd3idf/Y5JwIqgbrJHqZF3g4sTn8J4jxIAX8ksL9Qd3G3vIpX0YvpVeLzxvPEEQiXMPhkAdoTQDtqUb73Ovn3B+df1yXIH4V1JmBdl4JATdeAuLGM2YGropaCGjuxyF+5lZmBigwDrTcNYiMLc0M7DhSCMimFiC6ZR13RwZ6lSQirwKujqehX7PRPdS5rosyaM4vqSE0qJoQV/m1fy8YAVTXBRmxeoxr1Pe9KQDdNg2g4f8BCowDt+UExHsnOhXIpqQJ4ENKCgGfNhYhznPxqcBZLj4BtAtaCPjx5SXE2dhnHAcaX5cmgJarhIB2XoNo7C7h8kDlQPP7Kk73VnCZ17haByouXBkXrgL65c+/xXm2ub/K68buMsSWFcVb4zF2nAW8M59g25bwRnuEzeQ8Ms5TZNcXsWnMY8uMIq3Pgea3LQnpxByf/wVkjXV/2HuxXAAAAABJRU5ErkJggg==",TM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABQklEQVR42qXSR1IDQQyFYZ+EJZick8k5noCTkHOGOzf1TdVrmCp2Xshya6Rfr6XudM8GSj/W8bP1MFlWr0fK3stsWbsZLcefS+XwfaHsPE03tnI1XE6+lht/+t0rG3fjZf127BegSGD7caocfSw2Z0mAYL3LbgP0f/91rhy8zTfACkCmIh2YghgYCDUAu88zbQXkL18MNUmb9xNVIs8o0pGnUEyzFmDpfLAxhc7ppChwZzmuAFIB6BLSRTElYjrqxsB5swCqAB2YQklmwAdAka6GCmAWrSFKlsiy0hRmjWDZjMH69u8ao0IsCpyzQuoyhwqQhOoaWRtPpgKqMlSds40K8DGPBSSK/r5M8bxG1lLgnhKZbhIzB4kpBlJMoetWQJL4vPs8JjEKxRRlS9bcesquYDgSsxFQMclyMrycK6Af+wF7td4ljUgE9gAAAABJRU5ErkJggg==",RM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABsElEQVR42k3TWVKCQQwE4DmGBSqcTwFZRfZdcUG4cawvVVPlQ8iQpdPpmb+MRqOYTCbB93q9+Pz8jNVqFe/v7/Hx8RHn8znP/PV6jcPhkPHL5ZLnonE6ncbr62u8vLzEer2Or6+vjNXC39/fjG+32/Tip9MpActsNot+v58Aw+EwNptNsjgejzGfz+P7+zsNENvtdgmwWCwSsDw/P0en08nmwWCQCSDoVSCMrABQrtlsxsPDQ9zd3UWxL7oaNKNIk8fHx2i323F/fx/L5TJB2M/PTzQajcwBLX4ENEBUDEAjIyANsNnv97lCq9XKdQwvilBiGBCy6oGNhtvtlgDANdmdWaOYWpEJajoAuyrSUAGc6UAXOayLRsVAmClidSJQgFZlVYuqS6lXpRCqZp5YvLUqO03EJrqh+ooHIWk6wXgUFWNhqjM9NDmrA5wivr29JRV//j8QoM48IM1MTI9ag0p99zyqGChUZD1mutsx/enpKVeoN1b+06wT62sUAwSg3lS328282wJe0KBypalQsl4hgLqvOt8N4MooASSJWa9UzH9+PB5nzHcCGAMxwED+AE3kZHy1bKoMAAAAAElFTkSuQmCC",CM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB4UlEQVR42jWTZRLCQAyF92a4uw9XQIq3uDuHfsyXmf1RCrvJswS33+/1er10v991OByUy+WUz+eVyWQ0m800nU5VKBRUrVaVTqftrlQqqd1u63w+y3FZLBZVq9XU7XaVTCYVi8UMgMJsNmvvZrOpSqVijdRDVC6X5Y7Hoz6fjwHE43GFYaj5fK4oijQYDKzJg/R6PVPT6XQMEEL3fr+FDYpoXiwWWi6XJn+1WhlYKpXSer3WZrMxu5Ciol6vy7VaLfNHM42j0ciYJ5OJAWCJYjKiebfb6fl82sOZ2263Jg8GQGD2IcKMBZoajYYej4exn04n3W43XS4XOVDwjz+K8EdQqAIIC9iCCN+AYIWJAeSQRRMj+X6/FijfUUWQKKKBcTJGpKPWK3GMAik08uaBBVXkgHzYYeQMa4THb9sDQvr9fnaAHQAYD6w0AsCDFSaFKkh98I4Pwur3+yYLiaTOOVOgAQCYAUQ+WfCG1BbJB8TDWPHvpTIFCAAFDGVYoZmxOz5g4BIALpGYSCQsNHKAgA30S8Ya45+AHVtImrByQSFex+OxhsOhvYMgMBWQwIx/QFFvfyZksgN+tpyBTiM5IJ8mGlBLPWOF3OGJ5Anver3aulJMIwBePupQwTTIhxoW7g+s+zDX4AYuzgAAAABJRU5ErkJggg==",PM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABD0lEQVR42qXRV1KDMQwE4ByRY9D7+XKQ0NMgELiCmc8za2z+xzzIRdKuVtLsaD4vh9jMcb59Lnffm3L58Vqudm/l5mtV7/59un4sJ6uHmsN38f7yRwB8/7Otd0AAZ5un6gf0B2b8chsBh0BA2BFJYv7sdr9uKqkeWuireCMCYPyxqBgIUjlzSN+RG0XIkKfY0ML157JJ9JYAdLxc1DcSN/IongxRABhJBsoXNf2WJltgkqmRkOFlC1HpRjIoiOTIRpTKvR8hoJgijUCfkZf1RXYfM6MMdNiChKwLc/6SJXpHNvOnuhEA6e2/SUrlEOQWnwwxew8gJNpQxED5+YYWAAQzTEH/tJE4EhZljeAQ+wU3pxxrczn9YAAAAABJRU5ErkJggg==",DM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABzElEQVR42k2SuUoEQRCG+x3FjdRARRCc2fs+Zu/7eigDZUE01EAFQRYUEQMx2l++ghKDZrqr6j+qakK73Vaz2VShUFCSJMrn80qn0yKeyWQ0Ho8t3mq1NJlM7M0XzHq9VqhWq8rlclbU7/eVzWYNHMexyuWy3S+009HLo4bDoZbLpXq9nlarleWMABDKEKAEWaPRMAK+57sf7V1farFYmCoxwNPpVAErlUrFijudjhFQAAnx0Wik+XxulgE5uNvtGmHgUqvVrA0c0HepVDJCXAEEBLGT0AKkfK0FHxIgyCjEdupuo9TtxggQohbbg8HADnMIgEiijiLzYIAnH1udfX/adiBFDSLqcIF9Wg71et2YUYWAIlooFovWDmCPIUYd6rimjcCD9ZDgkADIv+BrhAwRxGiVO87IB6wBclbUKOQwWAdBzp167k4eSGKTL05IsD6S2KZP8ihyfJi44gQUfbfsnCJa8J27ZV8rBLjgTW1gqlgDTDGsURQZiRfxjiTt31z9tUccQiNAyYfEIQGYdR4+P+jg6V6nX29GRA4Rhkxr4f+AfGVOSPHx+6tiyebBUPlPAPtaw2w2s+FxAKFKkhYgAoAycYYLiduH6BfsHX2OvyqTWAAAAABJRU5ErkJggg==",IM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABvklEQVR42k3TWVNVQQwE4Pk58ARFlYjsLmyyXRBREREui+zPgAIKKG6oKP93rC9WLB5ScybT6e5k5pSfWxP15HlP/fCyP8L+0/LD+n6hrx4/6474ujZSr948jvNf25P1/NVg3ZzorB9fP6jlemcqCmwOn3TWg9k79d38vYizxYEoVugb2ZfV4SC/XHlUf+9O1wKgWOH+bG8cUvi+MVaP5u7Wb+ujoYqEmD2hz82hfw4wsY0NiYNckclzQ1mOE/uLpftBViSoifXRjiDDTPXH5ngUaRER7G6jOxyYCfcFANvN/kzYTHt7jZ4gVfz2aVcQK4KFaw63R0uFEiv6trKaASivJfMwRE7cWroq2G3M4s9eI0IB+0iAiMCcvugNHFJtchMOWGHRoaAkb835AGc4IxwtsGaqWBUblG/K5gHEjSv2rZAzRP8J2APO9+D6APIqEZiH7+ZQWwzcudp4B6aLLZ9tPmGEivMdwNkT1Aa3xeQxAyvihP3bgzUfOATak8srLpKuRYILe9aR5BUiQpDPmqA24hqxKRLbk10BRqRnBfokgCxxSFI4ZuDV5d+XKoiRWBf6WwJMWYvOFwdag/wvxBgmgSkewCoAAAAASUVORK5CYII=",UM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABwUlEQVR42k2T2XbiQAxE+9vykD+eTBJCvIGN990GDMkkP6I5VyAfHnTUW5WqS93O27xIsH2VyHuXMo2kLRMpDqE0RazzuS/lNNaaf6+z7Px3icMPSfeeZLEvLom2epDJzt/oeGgynUN0PfXSVYkscyt9fVAgGCNyAPbBRvIkWIOKkBAAxzZbVXibP0oCeCU47D61GgGozvcydYUChiZVkq/zoJnqwfavFHecMxB5bHOV3lUHZa+ynaoD1JSJxuXY6v55qtUnh2QWOAwB8hijDCXsP5q2zI18L6Pm01iJQwZAu9Pz07OGVUYuZLbe16lMbS5jk8n11N0UmGyIAKHAVJlHdRGr86wf+3IlcoAwi4MG4m4QcwXGZjDX+D4Paiw42qsm5omvD8h8gJ31y9zKcahWcsggoEN05HLsxJ2nRgk4aBWtlbc23h4V+4whoPK/ZZSfyyQONqpaRgkkZtqjeUb6+zVrJhz3QiLZTKRi5L2paVQ1+agIP1816E7KX4AZICS0EbBlSJa7D6YMEAR5Et4IqGz3fHw4vAMqQzDf28Z/yOJA/I8X3edfOA4DpAP2KiFDkT1zSDBbVUbb++cLtdB/a9NSJwf7IrIAAAAASUVORK5CYII=",LM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABJUlEQVR42qXSSVZCMRCFYZbjClQUFR2wDEEBuwW5IMEGRLcUzpdzbjRjBvWSl9z6q0kNjl4n5RAb+FxsluX657kM3+/K6XpWzj/ndXV2uX0oo69F3Tv3P9491X0HuPp+rJfs+O22igBZgPa0VvoGQD/7uK9GLGIysDJgdwl2spr+ATigAhAQ2hMy9/5vfl/qnjNoA7jgKAoH6YuevjjPGp3/BkhtHAD0QCSZMAFElEV605XgkEWUdFM7mACcwJ37b4B0naN9nNKsPG+eNdk2ABFLE0VPzYTg/+eBtpuDpJZmphd5Mqt7ugwSbQOgpTGZOE7STv2ZFYDoOkCeL+lG6C59sGYSu2fMm3MGykSyQJ0Hkgy7HqgpNRICZhYynRkw+66EQ2wPLItP+i1ConcAAAAASUVORK5CYII=",NM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABx0lEQVR42j2TuU4DQRBE5zPAyMYfhQROSMBIIK/vY33f9/E/ZAgJYmICLJEgESHxAY1eod5gNDtd3VXVPbOh0WhYv9+3brdrfC+XS63tdmuDwUDf8/ncptOptdtt5c1mM2GdTsdCrVZTwmQyUYAkEnq9npLARqORCDjX63Vhw+HQFouFBVQphpkgOwtlCkiCmPNqtdI3ZLiWA5JhZI/jWCCqFHCGHBKceYwzC4EAEyCtALJwghrWOaME3mw2rVQqWavVsmKxaOVy2QIB751kQBz4NyrsuGQVCgWrVCqqIScAUkwARp/weDxOWqINYtVqVcrkUsc5MFW35KpYhYA+aYM20+83dv79YNnff+tRFCk3+NBY3jdq9Ay5z+H06dLSH7dyhACuucHgKpvNxg6Hg5Jpg2J2VFip15yc+M2AswcmvtvtbL1eK8Cg6NGTUeT6OLOD4RaH5IoAy07CtyuAsfwVEvdXCqEIAGgBVoI+debBIHlgZ2/Xlvm6V9/gfkPMIiEgiD3mgKorqf/nK0u95JK5+KvVDAjASgAFivxGwBwHQyT7E1n6mLeTxwsRBQpxwQEn+/1exez+YHy4XFvmmLfM513yi/8Ba651cdcejQwAAAAASUVORK5CYII=",kM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkElEQVR42kVTaVMaURDcH6+JotwqoGhEkcMziYjIcu3FtbCLUblvVwSp/IZOzRCTD6/YKl739HT3ExTVBa3kRbm6i4q+B1lxo9s/xXPzEP3hGZ6bR8gVHEimNmA+7uNB3IJadKNmBKBoLggElhQn6uYBytU9/pZVNx7ETciqBz8TazDMAKq1PdRNP+4fNjEcn+H1LY73xTWEyWsMo8kZKroP6YwNpfIuFM2NYnkXg1EYiuZBIvkFj0/BfwR0nwiG4zCE0SQCve5HWtyEmCV5HowmUf7tDU7R7h4z2X1qAzXDh9vEGvR6AFMrhvE0AkGv+5ggm7fz/rLiQrcfgjW7RK5gZxVEaM0uUNH9ELN21Ix9FMs70Gt+CNYsvjJE9UDM2pCXHJhacSbJS3Z0eiE+BcmB27s1tDonMBoBiNlt1I0AhPnHNbSSB/mCA63OMSsh6bQagSTFxdPIbPLGMP1Mks5sYf5xRSZGQCQ0uTcIs/sEHo4jTESyFdWN/vCUiRLJdTbTfAxiakUhkJuz+SXykhOjSQyZ3DZUzYOpdc5xSbITk9c4H1KQzmwjcbfOBIvlzcoDUlGq7GA4jkLVvLw7mUl9oAQ+1dAaqbSNy1St+fD2frFSsPz9A2bjgPenLlCZKAEqEilTizscq6y6WEUy9RVG44CVC8RE0ylOml6Q6ZIXBcmJwSjChyrd7YfZI/pvPI2i9D/GcyyW3znKldNefgudHp0TBrU6ob/v4pCHUMzURsIJ9DFf3nCzaB0xY2NQu3vCoF/PQfam2f7GhKSYKkzy2YNVZGGQEmodxUiAp5cgE5GaZvuYX+VL64gJ3hdXPJDfAkVBYGKbza/YA5Lf7oaYgKYSIXmRzdm59nT3U8UfqCw72Pj57lEAAAAASUVORK5CYII=",FM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACBUlEQVR42jWT51bbQBBG9w0SkhBkuVvIBVww7rZMT3KMjUOIA6ak9/d/gC/nDtkfc6Zs0dxvVu7rYUW3g7x+v2ro75uW2Z/XTbMfJzvmWX8Yl/Qp2Ta7HxX1eRrr+3FNblB6rpNG7tHqOZEnlUBnrYLZKNo0f9rM67ieVTf/VMPohSbxlo52M3KrQUmz+pbmzVCLVqirXkGrQaRZPdBqGOmyk9P7fkmXnbyW7YyW7aytsx/vfp7uWpt3w4K1DBJt0iKtUgePfeS/zuoWUwPLwcEhPIVvR1XLuQDz2nCINf8xLiN3ndwT4/LMB7VQ4/iluvkNjbY31S8+M49GaAP3tJoyrQ530nJ305rmzZRuxrHxz1uhzpsp4ztvBP8tpetRLPQiZg1tOGsItLju5/RxEpkOjA1W2qRGy3gQiT0iWrkvB2UrYH7u1LjU6+ENHfBcjNkFMCblwHjgJGfGeGY/KT/OG11gZx8xe9jvmPe7bsFYb5OqxTfjspb7WS1aaau93c/qehxrsZfWRTujD8PI1meNQI424IUJjybwggAKrcIOntfJj5TcIRgFjENs5jLqHOID/uGQc4H/GHo4mHgHGKzM2vMya3sb1dA8tV5hw96KP+Pg5K0zU2LexDqpWIw+6EG8nlTsP7jqFe2fudhL27/hPCPjgwk22oQfPfwbIKdtr4vH/geZ9KljEaVWjQAAAABJRU5ErkJggg==",OM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB3ElEQVR42oWTSW4CQQxF6xCs+x5sEBLzPA9bQMAKwQIQ8zxzgCiR2GWRG+RafQNHz63KtEgWlqvL/t/fdrXZ7XayWq0kEonIYrGQVColoVBIisWibLdbuVwuaqVSSRKJhGSzWclkMhoDZzabjR4Ilstl6ff70ul0pFqtyu12U1IMwOFw0DyKzmYzGY1GYjiQUKlUpN1uK0G325V6vS73+13J8RAcj0cl5g6S6XTqKYAkHA5Lo9HQ6s1mU2q1miat12utvN/v1VMIjykBzMjy+/3SarUUjAoIrterJuJph96tQYxyw7ACgYAEg0GJxWLqe72exONxlU1iOp3Wyslk8lM+cVXAB/IwGEkgCDEgtkLv3GPkAaRtlBsrhSD+dDppAiAqk8iclsulgieTicYLhYIq0i2QDJCzz+f70wDzFlDG2o1dB8Pi/B+BbYs28YZDLpfTAfLavie7b47nn5wfCmhnPp9rUQMISRBhCnhxxH3+ArmvjrgP7/t8PmshlOTzeW+N9M5ueUy/JbvvjhLYbyYPhv5RbqLRqE6fCbMJ1AwGAxkOh/rWaW08HqtkYvxoTJ8NsQlVwPAA2BVBCtDOhpfJPZItkBiExl5CghKqQco9laxxT3VAFKBtCn4AuTYZj0NdJJ4AAAAASUVORK5CYII=",BM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAARElEQVR42mN4+OHrM0owA4j4//8/Azl41ICBNODDr/8nyDYAppmgAcgKcYnhNIAYzTgNIFYzVgNI0YxhAKmaqZsOKMEAk/kuojV/pp8AAAAASUVORK5CYII=",zM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACEklEQVR42k2SWU/TURDF78cSF9xYXEBR/AxYtBQrdBFaaw0xgrKIC6JAQRbjA8/qs/BmCDyQkDQ1jVvaoMQg2NLUHPMbcg0Pk/ufe+d/zpkz42ZSl/Ssu0Glwpy+bYzr1Z3Lmr7dotl0qx6HT9s53HFc1A0Fa/XkZp0eXjuq4lqnSp+icvzQf7VG2ZVRSe9VLs5rK58xEICnEhfsfe7uFcsJQFTu03jsrNyL+DljGrx+TNtfZlT58doKRm+c0kDgsLE9aD9iysgB39tc0O73WVPlVL1n6C9vnTdWCgF9Hj1j3wADBtvTrnpJHyS9ldQvFRNyPAAAGgWwowgAbSYFwdePQVNi0vXOyPQrpZ1st5wv5qSAR4yDXdtpZZcC0u+0sssBTfQ0mRrAHnWeNFMdrD4AoA3UUIjMSj6mn+thA+SeAAgzzcSR0An7kcv7bYfsxCyCfLK32QrxhXEChAJvrnkAAMFPtAD7WKTR7igih4hxYipnJnnRAB2P9OIL2QWW6u/WGyvybxjNCcDBe8eiII+ESwC0s/hflQ9qaId6TnLzgBGB7leWYr8LsNEKU4KVn6mhHUb4JxfZbwFDMI8JkAPCmLgHhBH7YAp4Vf0ct9HaGGEDAAORByMstAUrKgBnKh6klIuaUpuC7x93aYWWkAy73w9O3mGHjADYaa/PHmFFsmfgJ4D8HkDgDQSY7SyshvQPMjiB12kpDZcAAAAASUVORK5CYII=",VM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABIklEQVR42qWSSXLCQAxFOVOOAQmQAZ+Uk7AOZA4+QCATIOqp8hyrWLKQuy19fam/NFjML+IcG/CJ9Sx+X67j+2kSu9eb2K4u09c/f56nsVmO4utxHPu327wXAgIa4GibBGEf98OOgAKckPwTtE06AHqHCCDVOemQOP/EwHUEtE4XAEjGqHR4v+uqS8yJEe8I+MFJFezz4SoJIYYkCdaz7AQcHeAvGhAgMdv7E05BISIGAXeKFAKSrAaQu4IqHKTEwJwQ+E6MZNWnOkDNCTneIiJOmAEppkI6Qk6FLGP0rTjtIKu0TfFDrtBlCiSovC2ShI9/38ydxBMNcNoaAQh8v63nCHtCllWG0XUm6A7Ytk9QK+NljCoPgfsu0Kr9rsoqn2NHAE8QOxtBUK8AAAAASUVORK5CYII=",GM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAByElEQVR42k2TuU6DQQyE/XJQIoiCQPAGuZT7vu87eSsK6CmgpAEJaJKKSIM+S0YUm931zozH/h3T6UbPD2c6fVypUqmoVqupXq+rWq2q2+1Kx6ReHs/9XiwW1Ww2lc1m/Z7JZGTSnRCByOr3+2q1Wn5GAFKn09FgMPB7u932N0RIaDokHTCZTDSdTv3c6/X8DBgiBEQRIDMOWeCMHwCAS6WSRqORZrOZhsOhZ2AVCgW/hxjWSUQ5tt/vxSIAcbvdOni1Wmk+n2uxWDiR0hAHt9vttF6vtVwuZQTIvtlsHMCOXWLj8dhFiQNGhEUpETdqJxMXnKAOgDh7gCmVGJnBEgdv/+2EbVyQCXdRAk2lcZAjKcIWRC7YBoB1FkQahRBlNRqNvy8SrgxVmsZONh4RgRx9IBtgXEUcUcowLrggEwBEcEQZ+k5IupWO146J5rLAc/cSyIg9ssX3ZvcpPSTdAQQykoRz9MEYknK57CRsMjiQEQREguPbhaR7F2SEEYAD11CFRIBJjMeYD0Rfn86lz4SXRiydTiuXyymfz8tiZCFRExYpBSKNRUhfCXfDW4xyOLeYdx4JRqdj1vmn/rxfuv34WizIqVRKv2Fqi4/rqCKfAAAAAElFTkSuQmCC",HM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB9klEQVR42k2S504bQBCE730oogQDxgVMSyA0Y5tebFNCFSKJRO+E3olC7+856Ft0KD9Od7e7szOzd274tUptJ3nq+lei3psyjbzFlH4Ma+il0s4D9xV2ZqcueVGovttyDT6E1HqcKwew/y5ol8R5gTr+FlsjCrqvApajUeYpIshokLosskXe9VyXKh3Lsa7x03xNNgc0mwhrrKFY5H6lIrbTJFubbyoAQpx9jsrNxINa6w7rdypqUk/Gvmuzr1IXU60ab/yi88kWA6DsdLzJCDLVH2pR6ghu9Vdpvj2gn8mILqfbtJet05/Bah3/aNRuptYAEHCfi5doMVmm2faQxdxOukYsgssdQWMHvNoV0uHIt8+GS6ly7Q/Va70nYkogRLkDRCH7SmeFJQ+Gv5oV2BcSpXanhjvx7YHY59nBxgUbSIQZ0NFog8U3eqN254wSmtGAOmIOichjJ4EVOqOIHTByAVCHRWJetYOZrhThD5/MBABxAN4eMZShBGXU2xCxATtJ7jChhCJmwo49VNKIvFdlz+i9wkgT/gCsHsTCDuqInU002/8Aaw3oii8SNMCffwksUAwQZs6ooxaMA4AXLlgBQKG34ocGiMXMIMQCipxn88/m3544BcyGoRFjxxrs2KK5+z/BGWZ+GDF2WP3Q/D8gjhXm9g6tYSS0EsY1RAAAAABJRU5ErkJggg==",WM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABiElEQVR42k3TZ05YQQwE4L0PHRJqgAAHCL2FXk8TOqGGzjkdfZYs8eNpd+3xzHjXrx2+T8XB28/Yf52MrcfR2LgfzvX33VDGNx9GYuG8J7b/jcX67WAcfUxnbvmqP3aefkQrkKRiQfuV64GYPenMHPK50648E1S8eNGbsQZMQaJAALvP4+kAkbyVsnXpsi+J126+RxOgyppiewWl7KyAgLwiOXttNUqSwHsvEwlGRn3177e0auVK/Nefjowdf87E/Fl3NLa1gQCRe5CwR46QUl2yVSucIGrFXgH2kPiQFDkMscLJI2p60TP7X1dFyLUC6JPzIVWHJO+ANWBJKoqAtOIMWGu15HLVtGJ1OUCU7FkFQkIEGCmsnJa02NysQ1llvd5cjNW6QAUc1JzkJLLFEnXsgDW+lKiKFSkSbtTJ5SUCIMHOco2zmByimgvtcYRALAlsALVjQGqsuWC1Rhk5+85qcpDYAkKkiH1nZAD1P3DFURESzJ+pnrCGpZ6z3rrIFMtps/5ERP8Bnh4qEBy90cgAAAAASUVORK5CYII=",XM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACq0lEQVR42i1TZ3PaQBDV78rE44KxqRKqFAECBAjRezXVNBtwcJk4ZfJbX2Y3+XBzN3e7b9++fSfMhl2oYgh5K4njZolIOIBmxYEqhXHarrAc97GZT2CZMSQMFXFNgS6LWD0MMR12IUTVCOK6gpgmIxU3kDHjDBK482Ax7mE9G0EM+DDptxHTFOQzKWTMGCIhP+cJdtpEQlfw0G/zImRDlqBFRMTUCKjAoF1Hu+ryezpu4P24x345ZcbC8+McFScP20oyVVpmVEe/WUPIf4fpoINWpYTFuI9xt4lSPovjdgnKO+1WEAjNUCLQZYn7VqUQHgYdDFp1dBsVbqtRLmLYbmA+6rEOb4cdPs9H1kioODY69TIH06IzgQ07DbRrLkI+L5plB4vxgN+pb2o7k4whm4xDyKUSHEAVKGDca2HSa0MRg4jrKu+kBzGrlQqc1K6Vcdws8LJ7hPDr/QV+7w2qjo1es4qoJkMK+iGLQRbMc3nBiW+HLc5Pa2STMbRqLj5Oe/z5/grhx+uRL+OGikiIxncLx7ZAzKpOHpYZRbNSYtrU8++PbwzweT7ghUQkFDr4vR5YiX/BGTPKVelMbBplh81FoES9mE3j59sJxF4gBxqKBM/VBVeh4FbVRTGXRiGbgvfmCnY6ATef5d6DPi/ubq7g5jN8J+xXM6bdqVfgu72Gk7NQLuTY2qQBeYGEq7sFfiOmUsjPxWicwmG9gBYJY9Rt8viojeC9l6tSC1Sl7hYZkBgQYMnOgPLYSIQ66jRRyllMjYySjGq491zzmXzfqpb+szJx+fULzs8bHLcrnGiMJEi1aENXJBZpO59wsCaLrE0xZ2E9HSEV01kXAjWjGt/TxxLkcIB/G3n8aTWDaajsAbK1IYtciQzjFnJIJ6L80QatGtazMXbLKf4C7Skyh5I8TO0AAAAASUVORK5CYII=",YM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB+UlEQVR42j2T6VJTQRCF51UEI8GAstyouCKrr8ISExIslKRKIBINO+Efsm+Cig+ggAu4srzSsb6uan50zUz36e5z+vYNRyt3dLB0S9/W7up8v1s/tx/p97vH5vPzZOuhGZivqy36vn7P/BefnihQ4HjzgSWffui0AL6zj106XL6tv3vtlvxnt80SiIEl9nkxUiAJEJUxgIDoQqI3wL68TVoizDBjUOyPqVJIqpSp1Vh/TPP5SC97rqiSjzQ9dNNstK9a5VxCU89uyPD5yN7EAlTpCosfG/fN0Pprp9U6cocltGEIA3zkgA0A0Q2AO4WgC338vJ2uz4rCYClsQwQMiCAgunD3wiRwwpZEnxW4MDFYr0oh0uzzxkttI71VprWUjmuhkNRob7XG03Gb0cxQg8hhHuVcncK/9x2mhZNO/t3pRBf0shswcN18IZjzDgTR6Z8HCQR8iNAGg4+47wN+4oFEqhJ0fb4kDAkw3elIAs184PjCSE+VaWMXJnJ1evW0RuVsQqVMXLMvGjU33GQzYBaTg/V6PVBrPptRJq6ARirDAqq8mQE6oYv57tOdWWH4wQecTgtdnMihCHdOZFAEo5n/gCbB9963Df2+JMyB4s7Q/0hfOOYV0FZMxWwX+A/Yh/nhZtM91nfVduFN9rrNpZi6ZvuAdvaFvP9j6YXjKJEr0QAAAABJRU5ErkJggg==",ZM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACcUlEQVR42jVSaVfaQBTNb2/dWEM2wK1qv1Sr7JCQBGjrUm1/w/3coxZRthBQnJ77cvphzpvJ5C7vzdXynSWObxVYD64VrO4Ktv+KYrhGujZGpjaC7c9gejNsnj3ACtZIN2bItiKUBgpasa+Qa8fYv1KwQyUggjP1CUxvCb01Qb45xsbpvayDK4VPNwrlbwrEarq7gtF9kw8kMNwY5f5awNnGVJQ/fPkjNVUZIt+JkWnORZ17bfe7gumvYQXvUku9RJ0kqeqLqGfrz9IG96b/hr0fSki4NNuPUOjMwJpvTaG7S7FGm1xOEMmd3Y2Qrb9g/1KBrp2+SmZguHPsVJ5QCpMfj36ylXe5pNrW+aN811tTmG4EK1Qyh4L3BrunoFndCKYXgUR0wJbogjM5vFYotGdIVZ+EiCR0YLDVgcLJnYKWqb/g4+k9ts7/YuPsQVR5yTacnhLVdG0ka6cyFFK2wDmwRc3wlkjVxmDVOwvJA1+FP7Ie3yV2mZGjW4Vyfwm9PYfVjbF1PoTmhGtkmzMUe+/IteYCYo9U57MSyHY+/1Y4vFEohkvsVEYw3AV2B0tolv+K8kAJON+OJFR0UfBehSjXWeHkVzJxho0OqJyqPsP0FtBomyQFBog/XSZWaZ1kBO5dKlhBMhcS5JpTIaELreBGyLWmyDQmMLsxigHzMJGBbn59lPzb/gJWdwHDTbKSqo7g+LGcNTtYwQlX2L54EoLtiyH09hR8HWZDb8+Qa06EIF17FiDPvOdZHJCg1F+Be4KyjbGkkwHj3gkW4oLqBDtBLA5Jrol6ZSTL8BZim+x0wmxwTyKq/W/D8mIUw1ha+QcfOBvm79E87QAAAABJRU5ErkJggg==",jM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA5klEQVR42qWTQRKEMAgE/f+jfIgaE/1ItjpVnQLdmwcWMpJhIOyyrmv/Ygs/x3H08zyHv66rt9aGgWFi+lLKsEkgsO/7SNi2bSTjJeI7BcDIwycCwPu+Z1XOGt8hFK+1ZgJAW/gnPaojhoBik4ADjBix/RKrjIuQGkOSFAB4yYpcgNThEoOpchLYU2wDTBLMAhFLLVjB/jxzQVI86mzxReCgiFXlHHxq5YNNAidupdiC5GLkgKVXMNkEzNhqxqhwwRJBXJI4MKv71C5VmoGyXOHnEllZYp/59V/QHKBtxMt4VUyCL/YDPqSC2MwXqD4AAAAASUVORK5CYII=",KM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB1klEQVR42j2TyUqDQRCE54Gz7/vyZ1/+JCBoUDwZDHgQRPFkEHMWvHgRRBCvIuoLlHwN7WHomenu6urqmTAYDNRut9VqtTSbzdTtdlUqlZTP521FUaRer6dGo6HFYqFms6lMJmMxhUJBASfJy+VSq9VK5XLZkgDCktTpdAycPUD4AAco9Pt9CxiPx+bI5XIGWK/XVa1WNZ/PrSp+7lkUwZ/NZhVIgsVkMjEgp0YFgkjAB8PhcGjJlUrFkok1BlDDiRZxHOvt+li7dWQMoAwLGNBGsVi0RRGsaUAyYjr116u17o4i1Wo1jUYjS4YFC10ohCU2kAwDKLpgBBLEnuqwmk6n+rg91efuzHSCPjY8bZf6ut/o+eLgf0w+WioARpusl8tD/ey35kMLWgzfD+d63MR2kU6nzSKQ9wkLAmFAi5yhzwhNA6ZAgPfPJb3DBAD2iIfytEN1CnCmWOCCXgAimKREImE9EgR1wH/3W73fnFh1zuSYBj4Wf1mAOH0YAQJ9poIeVMUPa3sHBMKCC/qDOhX8HstbYJEIU48xAHf4bAEiAMsZYaHqT9s/G8Dsg9Pm0tGxUPWfl0wmLcanhB9A+42uNiz8s1AJpf3bplIpS/DRsWfxiv8AVLh/8HhF7HkAAAAASUVORK5CYII=",qM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB0ElEQVR42j2TSUsDURCE329Rg2ggv0ZE8eDFg5GQzGTfM9nXSZiLCIInr97E3PWHtXwFncPjTfpVVVcvCev12gaDgfX7fWu1WjadTm02mxnxbrert9FoZOPx2CaTiWLVatWSJLFarWZhtVrZYrEQGXCaprZcLiW03+9FQIw4v8EgBr7RaFhAlewAPeNms9HZ7XbKCpkb0WazKXyn07F6vW6BbJ4dqzwCns/n1uv1dA6Hg2JkhhTHsQ2HQ4kEyHwgQG0AXSDLMgFxRmYwlEvZ9EkOUANAJm5s8wiYQ7xSqegmGQ4RRbDdblsgKwAa4j0ATGnb7VZACLjizt2/W774IzHwIYoilcCjN9AbhxO3T38gFaJfxb1vgVrJ7jViC0f8Pr99tfzL0S7u3oQplUqKU/ZpjHywFBzG5L3A1dlNZrmHD4lyIOK4XC5LjO8AifGwLJCwygNCZKdHvidkRAgyW6gp+PwhUL+vKiKAIPOGOCVdP3+rDMi4Dyh6EyFdPX1Zvng8uQGICLYvHz9PO0KTGbnGyIFAJhpWiP9UFqII+EYixBK5OJhAkK4TwD5B+kIm3wkXxwWO+eaNPQkEqQkyYkyDrAh6WYCJ4RT7rLP/S/8BOjhvX8hCe+kAAAAASUVORK5CYII=",QM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADP0lEQVR42h2P608TVhyGD3bl0pbWXugKFQpF2Vi2Txtj02zK1VooUC69UKF0wJSRGJclu/xTS5jhJihQoFjaUsqtBVIETWRsTl2MMS7LnqXnw5Pz5by/93lFtNdA9vYHHN66xFSDYMFZyO5QOXGPiaPpz4h0aYn26Fnp1Mh3p0tJ1qflqF/HizEbYjNQytx1JX8s1cP+12SGK+XHiFvLXqiCZL9FHkn4zByM2En3FHHg0cjwobcYEXapifvMvEtcYaYpj/Q3Nla7imUw1mdkw/8+24NWYh4T2ds17LrzpcXbHz5kwykQS+0qOWGt+zwxb4k0SHhLpEXObn+4Ss6av66U5IK55hxno1bEyWwd/FRLukPw14iZRGch+/1GSapHw6bPRNhZQKRDzapLxZRDzX2XjokmJacPP0f8Ga7n3V07/3xfzds7lUQceSTdKjJ+g+RBSx5zTYJEn575ZkE0UE48WMWyx8LxTB3iiV/Ny28t0uBN9DJni/U8uV8nDU7H7PJAyl/C7kAp8d7zrHrLpMVSTwmJoB2R0z4LGthtExzP1snw09FyzsYv8uJuLXuDZXJGdrSKk7Eafm1QkBq+xPQNNZMOFWK6NZ85p4p7jQr+3bzCaoeaDa+R47Ea1nt0bISq5d4HnXpmnBommxSkRy4y1fweE1cFYitkJ8dks5LlbgPRbi0n39Ww4lIx33KOZKia+GAl6zcrSASr2BqysXHzApON55h3FiFy7Q9dWiauCcJuvQwuOJSyPROq4LfmfFa9pZLZtmJmWvMlix1alt16xGKnjmTQxs5wNbH+MvYGrcT79CR9JhIeA+FeM4vdJjljxWOR2pFeI4mAlUeeEsTxaCUpj54tr4G19gKyfUU89qpJdyn478ePiPpLmbiWR2qoioVOHZH2AhZahORoxIZ4PGLj7E4t2z4jewEzz0ctPBvUw88f8/fYBdb7y2T494V63qxf5vWjL9n2mwg7FMTcGkS0o4jFFsGyQ0GyV8dp0Ai/fMKOS0D6K3jawKvIF/C8GY6usuYqlO0nt+xkBkoRh0NWno3XkBmwsNSaJye8HrdJg4N7n8JpI6mQnfk2DbGAVU44DJWz6dGzGzDzP8aiSHpbdiwFAAAAAElFTkSuQmCC",JM="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB3ElEQVR42k2ThVIDQQyG9xGwwZ1iLbQ4tMXd/Smwwd2dwd151TBfOrlpZ667t5vkl+TcxHeHlC6liXPOVe8USN2+TwJrWRI9C+h5wWyi3vGr3SuSksVUfa/azpfQVl7srvGoVDdNx2VCEEktF5VSOJfkJdsPkMmfTqlYz47dl69kyMh7i3RcV2syQVTm6b6r03f/aqZM/3XLwHNY3/seG3Xtua+PAYAc3MzVqrDhQQaJAERO/TL81qwg9QfFMvgSUTDkqhaqD71Gpeu2VormkxUZmqz5MwmeDGQZq7arUOycgN6HBhn7bBOYYFLnTY20XgalciNHg1h9CymazLkVLFtOF4dhUOQAL0Y/WtWc/qcmQSvMrBAJdMeM147QKiQQBC1W9DUclnhIgIRPyrWteIIXHgOM4GDqt8urbl7gMrphxR5UCsGOOIrpH8HjX+2Kjn4ucRqD8YUi8bPQfF6hYN6c0HMSzQuQaCl7itMR9siyJG8KcZUgCkANSTa+UOcMebwDQCzzwVzA0GEgVfFBB8M5ZygEG22+GViZT0ijQ3qJMaxGFbfxo2a3UF2nXXQIRBt3QDBbk0gwzTbj0KcAK0Nm5hkb+0acDQmH1l/Q6Eo8Kz4kaKMdafjEBP8DKnZwzOo3JTUAAAAASUVORK5CYII=",$M="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACj0lEQVR42j2T6VbaUBSF8x6t2qItViAzYRIcUBkTAiSBMAgIxEAooLZ9/d11DuqvrCTrfvfs4QjTRgr1wg+suiqK8ldEXgbTpohlW0PkpvHYVPAyzOPJkrHtZ/Hb0zExFfwZF3ClHEEIOhofCjsKrtUTrF0DC1s9QFoinNs4XkcFjKsXCDsqXgZZ+JUEA+YtDcLcklDNnWLnZ/DYkBC0FSxtlW98bitwbuKIHB1PpsTvNMHM0rD3M7jWTiA8d3TU8meIHA0l5QiLloRJPYlxLYmdn8OwJrK8cS3BkraejnFD4ucnIPIMhB0ZV+oxItdg/ZNGCtt+Bu7tOcK2gtAxGLjtpTGoJPE2yqMkf4WwaMloFH7ibVRA2YhhbokIOjoWtsaa/UoSz235E0AHvbtz9mBYTUAInTSaxTj2fpYBS1tBwBOI7DqlQJPMmiID/02KGFZT2Lga7jOnECaNJCq5GDaujkvpC1ZOGjNT4hQCW0bv/gI7P8uywq7KN49qIk9yZ8QgBG2Ve0ASSuoxSwi7afZg2ZIwqkt4HRYYuHI07PoGpqbKXkxN+QBoXsax7qqcwtKWOcYPgHsbx8Y7ABeWyACKm+K8oRSoiZVsjI36AJBhM1PGxjPYRJIwbykMoCKRBPLiIXt2KNK98Q2vwzyu1BNseocqUwrkgVf+xT0gYwm4fy/c3jcwtzUI1DDygKpclI/Yg7kls5GBLbGJ9I+KtHZ0RI4KrxxnM8vpGIRpM8VN3PYNjpGqTHpJwgeAnvSNJiIJM0tlEDfxyRR5FyJX52Xa9A56qUz7QY6Xae1oLGs3yOPv4yX8hwSbyD1YuxlUMjGsOgpKyjEDqFy0TKR5UE1xjDQBLRPvQl16l/Ad/wHpztuqEpuNnAAAAABJRU5ErkJggg==",eb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABuklEQVR42lWTZ3LCQAyF90Lp7RAxGJuQfyn0lAvQCblCAgYMwzHS28k2871EnuTHjtaS3nuS1nJXpX3fiLZ9vbDlq/kN3Zvxji8Ha7L4Loq7vhZu+sujPeXZneNIIsEARoBN2jkdQPgQMyG+IRLB9fGBDqBZN/TTTt5/pHX/PDnXebw/9fNewaf9SKoAEQXrcACEfdw6FPBr2dR5Gp/pvCTljBAiwAhWcuveAaakaTdU0sPdiUBJJ+fn/UiA1agk/+u0ohyEaBkiZ6WQiALKtIHq26wqMmvhfV5TPB1EqlgEtEAFBGGftHOyn4uGfBBZG+NWoBjfDFMEMC2GRQVQmrQDlct9OSyqFQCQzXqh/LSSdPI/Q2QYPBVOVFe3JZGhCNmkFQik2KiUtbYYxGrDWS+oQEKvJNErFh/qkPC85DGr7D8AzEswcQKwUzpgQLRDRUYMAXFegdk5WGBb3hSlRgLl8lSLYaz2UP77KrwCBAg7+++ZKomATZ2KTNWqg9T2Q7tABcyBYULC0NJB/A9ICwzN9oI/kPxsmSDBCTNO29D0F0SMY9uItd1RBVxsZW2FbfOwtn1Yy7EV+Aab+kevh+NElQAAAABJRU5ErkJggg==",tb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAaUlEQVR42mOImmb0H4bNouT+I/OxYXQ1DMgC6JIgPj55DAOIdQWyWgwXkGwAqU7GawAxgYYRBqQYgC28GEixHZsXSY5GjHRASRgQFYgUxQKhdIERBsQ4GW9eINUArCmRkI14o5HUGAHxAcRDCDOV7zHzAAAAAElFTkSuQmCC",nb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAI0lEQVR42mP4wfDjPz7MwMCAH48aMCwMIKSACAtGDRj6BgAA9VT3EP8L2v4AAAAASUVORK5CYII=",ib="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABEklEQVR42qXTSVLDQAwF0ByIYsECMnjOAPe/UFPPVV/YZJmFLLWGr99q+fDx9t5ekYPPcDy38XRp93Fe7encrWf2bZjaY1rK33+d2tIN7We5/QFwCFz7cU2iu89jFQAA5KzJ93xd/TsGSZQ0X/r1jEXssFDMRxdAEjFhB4iNje7i6Q6IFECoJ6ijZH46HTOTsCoAQSJIMNkycBZnB0y8AExUcqYLPUCuk3vnemGyGyJEwlZIK+LLWXEYPA0xiTT0DCySeQCigRUA1ExWkOT+rgSU/r8LBZDlAbTtrogvzyqHPy+0Y2Bw2xkoso1A4hPnZ5MCyLvnuWgdsnnZjQw1/83TDATyxgCSyJf/ISuOXQG8Ir94H6/lUHiUYQAAAABJRU5ErkJggg==",rb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACsUlEQVR42j2Te1faaBDG81HqsSbkQkIgt0ISLgbQL7C7p65UuYoCBbFStVVru9t+69/uvKftH3NmwuF95nmemdFuWy1GjsNVGLKIIoa2zTbLOLdtVnHMY56zKJdZui63ccxtnnOyv8+5aXJZraIJwKlhKJBtmjL1PN4nCXedDjdZxsc3b5hbFh+iiJswZO77bBsNzkollbXLIEBAhMEfr16xa7VYRpECkfin1+PH0ZF6LPVA17nvdBg7DkPLQpM/jctlBXJuWUrChe+zaTT4a2/vd/fv/T4b31edr+t1lmGoam0Rx6zTlIsgYOS6bPOcgWlyWioxdl2ei4Knw0O24keno/Ku0WDp+3xqtdBOTZNZrcbY81jV62zSlHkQ8LdhcBVFfO33mVoWC99X9ZeiYB0EfO31WFQqaNL5xDCYVqtssowzy2JULnOi64rBzLYZGQY3SaLyJgy5z3Neul0+pinaW13nnW0zsCyEjWiXEU4qFVZJwtnr14q2MJBaHl66rpIl35o4+9hsKodVHB1xl6Z8aja5cl1Wnsddvc7nPGddrbJNEp7lTVGwyzK0pefx/fiYl8ND/hWng4Bv/T7yu8SP42MVE8NQAMtqlYd2m6FhMHMcNJnvLkkUwDYIeMhzxeI6DBXQhzhWAJJlI8emyWB/n3UY8tTtoj21WnzrdrkwTVaVCpflMsODA9a1Go/tNtsw5KUoFMBNFKnuAvI+CBQb7bndZlYqMdF1pBb9F3IPcczccdhEEV96PaaOw32zycTz1K0MSiX+3NtDkwOZGoaSIFs3/jmy+yxjaprs0pSJbTO2LB5kW21b3c60UmH4ywORIPqFgZg40nWlX3wQ16/jWHWXuG02OTk4YOb76noVAwERL8QHoS6zXvm+kiLdn4pC7YHontdqaj+E/tv/9+A/PqbZa63/AUIAAAAASUVORK5CYII=",sb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACMUlEQVR42j2T2ZKlIBBEfev2KiougALud9+6Z/7/23Kisif6oYIIIU8mRZnoIqDMB8jalCOm4YE1vjGYM7pqRacnuG5F/mnQmw2zf/yWa49IXLehNzvaaiJg9k8UB4+2XFDlEXlqYNsFWvkfWHtEmXkaBHdFUmQ9xZXyUKnlhlYTN5fworNpZqiDRfbRUVykA0FNOf8AJIFtFth2pXPs72iKmUlE7O2RAFlFKIC+O7GSOTzRlBN0HmGbDXN4YZ/+YBu/4M0FtRLADdv4jaG7oswGeHuG63aMwxWJiIO7QKUDqiz8AqRce8LYP1jT8ITOJ1S5Z69MvSD/tEgm/8ASXzD1SkBdzLD1EeUhoqs2VNmI6O5MImtwZ8T+wiQEiHOtRgzmhHG4U2j0jmBv7Ic4S/SmWLDEL6jUsSS+bTfpwYt37dsT2mph9CW8cZz/osxG9O2ZSby5Yhwe8O6MvtuZQKU9klpNvPfknygPgWIRuuaETu8UinuRBgKKQ4/QX1hOEohz7G8swvyLkODuFApAUph65/fBnuheF5FrolLPgdinb0IEIE2Uw1IyE2UWmWCNX3SVF5BVrpJwoooZOv/5D8qD5zxIQ729wNQbtBqxjm/2aDBHdHpGXf5PIEKBRHfjYZku9dnDtTtBsjeHB0tA8ozinn0YwhLb7HwuiSkwuYb8B3UxckKjuxJaFxNTiKs0UlJwDuSjXKHTKweq0wvFMlhaRfZHxAKSM62eGL+pRsL+AZT8TCB+Q24BAAAAAElFTkSuQmCC",ob="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACf0lEQVR42kVQWVPaYBTNL3JDFpUu04dqIYQkQJRtqljrRsuijooKBMLi2r612iq7gGi1/YOncy+mfbhzvnvuWTIR9pemUc+70SkpaBsymgUJ7aIXDV1ELedi7FZUtA0vGnkRvaoP3bKKjiEzL2RiM6jl3GgVJDR0D26yLg5r6h7G27KKOt2LEhuJ71Z8z6XyMKBf9XMDzTBIxC2bFbSKXm6l4FrWhV7Vz831vMihQjJkR1ybQCJoxYZ/HMmQDZ8XrLyv+8YQ1yzYDIwjFXYwR/pEyIZ0ZAqJoA3C3bEPHUPC4MSPdtHD2KsoaBVE6Guv0a+qzJu6li7y3quozAkkoOmWZTYRUgBhfu0VOkUJtyXvP83gJID70wCHtQseCA9nGi+Eppl2Sj/64OR3U3ezibBj/A+jEXYXZ/Bpnv7BJNJhO3beT2Mr6kA6YsdWxMG3VMiG3UUnkvwPrGCPNsGc8OPQhZuciJahoK5LaBRk1PIStqN21PIe3uu6F6S7OniHn0duXGdFRhrh6mCOzc2ijKvMHBoFL89+zMmB11k3z7e9t1z0fX8Wl5lZtAwVzaICgQhKvszMsYCC6LATtTNSgWnikgNTpzAvrKpjSIQcWFVGsRGwYEUewbpvHPF5K8+qOopUZAoflVEkw4QjSIYc+LRgw6ZmgfB0MY9+RUav7MWfr0HkVpyMNMTRjTTmu18Z6n6d+fF4HoBwf+LD7y8LeDrXmDyMTWFwrKJb8uDhdCgaHCusuasOA54uNL6RTjCbH881binF37CQTN2SBCowhwyPz0XmVwuZ5ZdIh63YitiGGLYhs/wCe0tOpJ/fu4vT2I46kAxakApNIhOj+wzjX3dKVZPw0/wfAAAAAElFTkSuQmCC",ab="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABuElEQVR42k2TZ1JCQRCE9wxKBnmYT6USBARPYM56F5VQIHgYc9ZTjPUN1a/48djZ2emenkAYtyJ73i/Yy8Gcn19ni9arZezzdMGe9vL2cTJvj7s5G7WK9nYU2c/Fsr0fl+xhJ2vX67MWupW0gwAQ8HpYtEE974F/V6t+h/i+Hfn9+3zJfbx3q2kL/VrGs5OJj6yjrTkPhpg75ONWMVbFiYphs2BhUM85gRQgbdyO7PdyxbPwBlmnkvKTcoiDwBXcNQuxLNgB9TezbqOAQD4SAVSvXFU7migAjIMSVBsEqCAj9vXajAMh445Smh0rAMhHFvqCrSkAui0nnYBYqWIygVFwQQHyAN1uJGL5EKBk0JhkxcYHERMMnXLSwQBwQkJ38UkRgF417WD8EBHPaAONoE6CcdLpXjXjclGjuoeNvJMTy52+0ewAixRoPOyB+kIgQJZLmygl/RoE26VYAdl5pCxsZYf8ZiPhtvyQdcopC9r76WxsnTYTctRQFidg+WlsYOYQSAVBlCWp2hE2ESUC+8ozRn40GjVHfSFQGWki78RqD9iNMGxM6iF4euum/6GQsLGaFHdsyv8HSmltC4Nie4cAAAAASUVORK5CYII=",cb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABAUlEQVR42l3TWZICQQgEUO5/SPddZ/QGGknE60A/sIGChMos63k/vv+u+7brcb34ySf+vx36yy6HVefu523XVYLbabMAxFcUkNjjsus8Myh+mRTEFAJJbGJqAmibNCf/epzeBTVBkmmMJTYlPlAgiTOw8hNL8+TBVvKTCxxks4IakCRMMtnqeMBJgANWJpliNRzMZjzNAYXpJCZRps2mnJEYV0W2FOUwqN6GBtLZFEjLiBBfUiok46+UapsDTYCQl6/7zzfCbwAruwLpvIUUWtfdEdocKMA4ELJ6E/NsXqfmfwBhSFM4a2zyRSL2Xcd6AMk48wuJiJsMzwdl2pQ2PnU+npq1EOyYkt8AAAAASUVORK5CYII=",lb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB7ElEQVR42j3TR09QURAF4Ptb6L333n+FCij2LtgL/C9d6UZcCBuCkRiNLExk44IYF5ox35jr4uW9O/fMOWfKKxE/Y62lJZ7MzcXt4eF4Oj8fNwYG8lltbo5LXV2xNTERd0ZG4mpvb1xob4/zbW35vfv6ZZTt5eV4PDsbzxcX42xjY+ysrMTFzs4EnWtqipuDg3GlpyfWW1vzXuzu6GgSEiwSKTxbWMgLjwtEj2ZmUune2Fhc7++P+5OT6RBGHtfFgV2qt4aG8vJaX1+6kvRwejpLREqdG+qICJcKUi+gMzeAm+PjSfZgaiqJOUHivNHRkS4KdYnVemXnQP1ArMMhg9NIZETL5e7utA/kUs2SKFBSp0T9IIRYXPPlZA/Ypg7Itm9ESJRTGylBCaYR8Ss+Hbz/54A9QSDf6n/35lUc7r2NH98+/5+COAcvlpbi+9ePcbi/G8WisKwul+ZP9eT4KOLPaTaYK33hCJ4LCyhejMKSeLhRG/CXD/tZ95mGhiSvo4WB1ezsAXtUsbmU5E3NXpiEsuCc9UNjLZq8glltAqyzzIWyvMW8PaYlTl1POMp/AQF2yeyZr5iEatvZxJTMFeF0oPuSHDxAEs0aCKmua1zdSjFY8WKWdZ0FapeVpPb651G1SEqqi/T79CT+ApA28gZA+69hAAAAAElFTkSuQmCC",ub="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABvElEQVR42j2TSU7EQAxF6wapDOdstXpMp+d5TPdtQALEAZBYskCIDVwAIfaG95F74VTKZT9/O5VQVZWtVisbDoc2GAxsvV5rHY1GNp1ObT6fW6/X0/l4PJa/2+1au922yWRigQ0BBANbLpe2WCyuEE8EzMoeKNZsNi3MZjNtUEEiIMhUwMcZMZ1OR9ZqtQTH+v2+BYJQ4BCCUVWWpdbNZqNAwLdJYs9pam9ZJoBaIMArkgSg0WjoHYlAkc/6UxT2XRSCAscXcLgc+mMOJGP0fDgcBKUI76z472K0mySxsN1uFQyVGdAOhiKAVEE+yafTSXOg4EOM9pHnFgiiOiAgPjRWgo/Ho76Mg1ixxxj/W0AOxgZ5/iUA7nY7O5/POr9cLpoFhho/Dz4k790vEmpYSd7v9/I73HNoKUAhmUuDcUCCXxbkk+Sq6roWCCNWLVCNAIKZCUoA+/fHzywAUAQF5KkFqiCFHp3K8PxOUNGH9vk3dXwU8X9FVxkyxnBIZJhUB4YfwGuWCfaUpvZVFPae5yoUkIYKqMB8eEB495/IW7iP0V6yTIVQEXjQCwAkeVUUuAo+JUBa5QoT63/wL8Pic44jF1AkAAAAAElFTkSuQmCC",hb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACJklEQVR42j2TZ3LiUBCE3/1PsBiDkEgCge3dK6wNBoNyFkhkHPYOvdVD+DE1VD36m9AjdUgsJB8ajukIp2yMtdfBym1L3kYmgmkd0ayB0u8hW+qI5xr8SV3y2utBrb0uCCFgG5pIFxr2yVDEhFCYLlp3ULY0sHK7SBc6olkT6kYvnDZWbgebsI9dPEDpdyUoZod8Y7EqMKVy8tG6dMAHBgHxvCntE1AFPckUsTqjCvoCCN8bkjmGSpe6kPxpHTErOQZKr4N9MkDld1E4xnWULj6LJ+R2S8AckaGieVPEud0W6k/1G9/lC77WzzikQ5yyEXJbx9fqWWAEZEsNx2yEQ2pBJYsWSr+PwukgeH/EMbOwi00BrESgC4QAjkUR98RRCZQOGJtwICNQyA44RmHrAjjnY2n/e/0iAMLoFEdRrE5bgumjLOVcPIlwE/SQLy+blu6u7/vEwiEdiaW7eEgbmwKgvwzOxuq7aCAQ9+1BdnTLdOVm/SY0oegnhQSxEqtz+wx2w6q0zXmtCYRVb7bntgHFzbuvNXHB+ftLqvIiOSODF0eIN6lfD0gTCG+CR6bWXhufBb+BNv5Vf+SU5ZzjgSzvZnM4a8iSCaULvItk3oTahD3xm2JmCmnbMbXkNztjZXaa2cb9Y6OFBKlzzq/QkthGfewi894F/8TKFPJevMkDTvlYrM2WLcnq4i0XY6D0OyKi53SCI9Ah960mC75crC5dXPaj4T92a1FHsT/T1wAAAABJRU5ErkJggg==",fb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABJ0lEQVR42l3TWU5DMRBEUe9/qRAg8ywZHaMbRXz42S5XV49vnB6PuT2fp/3rcJifu9382G7n9/G4zrDeD7fbWu4/p9M8P59zIOyv15cxkMDuclki3hLo3Xmz3/8JUERKJEHkPBKzEz7e70sw0eFTuEACyDBeLAJwXOIJLoG8Ae0MnQuzVCx5wxgnPoQE4AFQCnD3UmEsBbslWuLDBzGAYV1IwBvRhJxLZyBYDGtb+eaxVhLAI+7uPAonT8DSqi7uBHErKPFVRIRyd67v1SKv8RogHCLjvYWlgFRnCDCA1d6mF3dUvPIt3OpQStWgtler0bRV3YraHDQ4hV6Ejft4H5LmoTAb8dILqxavSezy/x94T4WICGohbEVQYfLWvxHGCNHqria18xdmWdtSHY2e5AAAAABJRU5ErkJggg==",db="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABoUlEQVR42lXT11IcUQwE0PsVpPXa+0JYYDE5L9EmZ7DB8f//Qq6jsih4uDUzUnerJd1pv89243ytH1Od0VjodeJ253N8O1yLi/XZ+HW6E/fDpXj5shlXm/NxtjoTTwer8bC3nDG59v1oPcEzH8ai3x3PJBDAn/Nh/DzZjuutQZLlTpan4sfXreQo3HyoxAnSzfZCPp+PNxKkMky58P64vxKnK9PJaxKCBJA8Lzfm4m53MUFclBCCdy0SgW/ArLGjf0QkZNZZJqpfWDEHRrwhCVB09F8DU424g6BizYQbzhsVQSDVCZa69sSIik3/35ScY15Nkj0tsKg6EQ5quOJzHyfyDHqdd600QNatkyKSBOGah5g1T06MvG6n3x1LNw1ZC+Xg7SbKUV0aQn8v9jJPzDaaanV5PAUNhyCwbwTkytmMkwJsqoKgjRoimzU81a0V1vtsdzxbyjUiOgBINTxEhLof2oFRbPCpk8W8Nz2zbg6AEqrUSqtncyjbTv0rrarorXqvuRAgXP8B4brysDkDQYFaoa14slu/LWDdSESzIeT7H04PvEDmpaTbAAAAAElFTkSuQmCC",pb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABkElEQVR42jXTV3IDQQgE0D2vrCxZOeds3RjXo4oPanYYumnCNrPZLHa7XUyn0/j9/Y3H4xHP5zO+32+sVqs4nU5xu91is9mk/+fnJ3q9XiyXy3xvjsdjBiFh+/0++C6XS9zv9zw/n0+Ct9ttAjudTiwWi2i329FQMB6P43A4xHq9TsD1es1APqDz+ZwqJKjMSHw3JRMYEYK/v794vV7xfr8TjEhp7kDD4TDLQNIAkUy6h/l8noQkehuNRtHv92MymSSYXyw14pqqSxNlclZfGMIqkwEjqaQNJuyyIysFzlIFoFRN4/dtKrCN7NgGg0E+IhPAB6g37kw5kvAhyCZWx7FxkousxunUWFPQWOrcS0XjonYXJqsgRKyym4DsRVb3LMGSAAkkj4KSD8CM0UJJRhmSbKISmEstiT4AI5UJGQCfrLUfucpkdrvdnDUzRgDftfP+kdpUo4SpuCyhnIgE164boUwUivFWi1RnU7V6RNBqtbIERgFizS3JlNRk+PJfKEklC5Hsmln9QQJEiZEjYv/MknbK6xSXvQAAAABJRU5ErkJggg==",mb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC10lEQVR42j2S11IiYRCF52EWHGbIEgQMCK63KgxhAMkmQEB9qfMkuiaigCQluIjIurrhfutvq/aiq6em6nx9/u7DfT39gPN4jo2Td7gKb7Ckp3AVf0O3O4AY6kMllWBN9rB6NIZjf4DVzBQauQV9pANz4hGcLtLD5tkvKDxVWNJjCHIP+ugQqmAXi4knAii2r7ByOIIt/UCA9eNXGHa7WMu+gFN6azAlhjAnRxCDLdiP5tg4/Yu1/AeWDmZYz00g+MrQhe7IgSs/hxhoQB1sQuW/A6cJdSAEmnAXf9ITjPExzKkJ3Cd/sJx9o6nKnWu4889YSvXJujM3g21vDKW3As5d+AFLckA/VL46TNEGbKkOrIl7fNk6hznRgzHaxoK3DEuyj7XsBAueWxgiLSqOl2pQeCpE3ii+wRJvkXAp2aZvXipD8FexGOtAsfMpVO7cQPBVoA83wVlTQ9qmff+JrDkzQ2gCJYIseL7BFO9io/hKnQF4bwkqqQxzvIv14yk4Znsx1qftMje85xI6uQJBuoZjv/8pksrkwJp6oKkM4sw9U+e0kR5MyTFchXeIwTbMsTsYwhUqfucCmmCNiuVAHahCHajBuHsP0V+lXXBKqYGl/We4ix/URekKq4d9mKJ1LO916Qr6cIPELBPMgW1vQLsgwObZH+ijj+B9Taxk59DJJSxsnxPAGKnCmf1OWdDKdcoBEzHI/ysYYgMSs2IwNl3wXhJAG7wl+yyFlsSnG2afQXShxucOnLkJ7JTxJ7r3WpZFdQbeV4MYbJA7694ExvgQ7LmCdANdqAZ9uA7RXwLHaOyu7DSOgyHchTlc+VesHE2g8texmBhBE+piOfNK3RRrEsCZGUGxdQGOTWWbZQD2zaazyZbUgEDsOraDKdRyB/bDF6wcPMKe7kHlvQbvuQJn2L2nVC0fjqALNwmglpvkwJoekpjtiZXjaEZPsCbbMETq0MpV/AMIQhUoMjIUHAAAAABJRU5ErkJggg==",gb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABYUlEQVR42k3SRw5DMQgEUN//iuk9P72uHT2kif7CAsMwDNjteDz2x+PRz+dzv1wu/X6/1/l+v/3z+fTdbtdh5K7Xa9ntdls1bDscDv/CYRiqyJ0vB8QuFouKIUYkxrZxsQAA//V69efz+S90brdbHTh5JA2IfJKcJMSRLZfLHpWbzaYUwkRtMx9GswLzESoCok5XeXa1WhURDL92kC5ZVhYXciSn06m/3++6i6/X64o3LAKKFPN12O/3Nb8Cd3kF8Ky8kVsWCCCoYD6fFxmZ7qTbieNVxCiAbxzFEtiBSUWc7plXTNfxf2jmzycyZ2xeAmi8aA0Qacxv5JKiKHIVI0UgFzWZPWPUK2DKZu1CYb6x90Y8XpoG2U2NkL8fqVgnk0lZMQ0cRfmRWWApINNsErpJGkEy6nQWg/O00+m08vUKtqyTJAKAqJBzxsSWDu8gahygbF3QKOKz2axsCDIiP7kfk3S5iRcXcFYAAAAASUVORK5CYII=",gt=16,_b=Object.assign({"../../../../textures/bedrock.png":bM,"../../../../textures/bookshelf.png":wM,"../../../../textures/cactus.png":TM,"../../../../textures/coal_ore.png":RM,"../../../../textures/cobblestone.png":CM,"../../../../textures/diamond_block.png":PM,"../../../../textures/diamond_ore.png":DM,"../../../../textures/dirt.png":IM,"../../../../textures/dried_ghast.png":UM,"../../../../textures/emerald_block.png":LM,"../../../../textures/emerald_ore.png":NM,"../../../../textures/end_stone.png":kM,"../../../../textures/farmland.png":FM,"../../../../textures/furnace.png":OM,"../../../../textures/glass.png":BM,"../../../../textures/glowstone.png":zM,"../../../../textures/gold_block.png":VM,"../../../../textures/gold_ore.png":GM,"../../../../textures/grass_side.png":HM,"../../../../textures/grass_top.png":WM,"../../../../textures/gravel.png":XM,"../../../../textures/hay_bale.png":YM,"../../../../textures/ice.png":ZM,"../../../../textures/iron_block.png":jM,"../../../../textures/iron_ore.png":KM,"../../../../textures/lapis_ore.png":qM,"../../../../textures/lava.png":QM,"../../../../textures/leaves.png":JM,"../../../../textures/log_side.png":$M,"../../../../textures/log_top.png":eb,"../../../../textures/melon.png":tb,"../../../../textures/missing.png":nb,"../../../../textures/netherite_block.png":ib,"../../../../textures/netherrack.png":rb,"../../../../textures/obsidian.png":sb,"../../../../textures/planks.png":ob,"../../../../textures/pumpkin.png":ab,"../../../../textures/quartz_block.png":cb,"../../../../textures/quartz_ore.png":lb,"../../../../textures/redstone_ore.png":ub,"../../../../textures/sand.png":hb,"../../../../textures/snow.png":fb,"../../../../textures/soul_sand.png":db,"../../../../textures/stone.png":pb,"../../../../textures/water.png":mb,"../../../../textures/wool.png":gb});function vb(n){return n.slice(n.lastIndexOf("/")+1).replace(/\.png$/,"")}function xb(n){return new Promise((e,t)=>{const i=new Image;i.onload=()=>e(i),i.onerror=()=>t(new Error(`그림을 못 읽었어요: ${n}`)),i.src=n})}function Ab(){const n=new ImageData(gt,gt);for(let e=0;e<gt;e++)for(let t=0;t<gt;t++){const i=(e*gt+t)*4,r=(t>>3)+(e>>3)&1;n.data[i]=r?0:248,n.data[i+1]=0,n.data[i+2]=r?0:248,n.data[i+3]=255}return n}async function Eb(){const n=document.createElement("canvas");n.width=gt,n.height=gt;const e=n.getContext("2d",{willReadFrequently:!0});if(!e)throw new Error("2D 캔버스를 만들 수 없어요");e.imageSmoothingEnabled=!1;const t=Object.entries(_b).map(([h,f])=>({name:vb(h),url:f})).filter(h=>h.name!=="missing").sort((h,f)=>h.name.localeCompare(f.name)),i=new Map;i.set("missing",Ab());const r=await Promise.all(t.map(async h=>{try{const f=await xb(h.url);return(f.width!==gt||f.height!==gt)&&console.warn(`textures/${h.name}.png 는 ${f.width}×${f.height} 예요. 16×16 으로 줄여서 써요.`),e.clearRect(0,0,gt,gt),e.drawImage(f,0,0,gt,gt),{name:h.name,data:e.getImageData(0,0,gt,gt)}}catch(f){return console.warn(f),null}}));for(const h of r)h&&i.set(h.name,h.data);const s=["missing",...[...i.keys()].filter(h=>h!=="missing")],o=s.length,a=new Uint8Array(gt*gt*4*o),c=new Map,l=gt*4;s.forEach((h,f)=>{c.set(h,f);const d=i.get(h).data,g=f*gt*l;for(let _=0;_<gt;_++)a.set(d.subarray(_*l,(_+1)*l),g+(gt-1-_)*l)});const u=new dc(a,gt,gt,o);return u.format=sn,u.type=yn,u.magFilter=Vt,u.minFilter=Ar,u.generateMipmaps=!0,u.wrapS=Dr,u.wrapT=Dr,u.colorSpace=Ln,u.needsUpdate=!0,{texture:u,index:c,images:i}}const Ga=15,Ho=2*Math.PI*Ga,Sb=["북","북동","동","남동","남","남서","서","북서"];class yb{el;touchUI;gaugeFg;hotbar;slotEls=[];slotName;toastEl;debugEl;overlay;overlayTitle;overlaySub;overlayBtn;fullscreenBtn;debugBtn;helpEl;compassRose;compassLabels;compassText;lastBearing=NaN;onHelpToggle=null;onResetWorld=null;slots=[];selected=0;nameTimer=null;toastTimer=null;onSelect=null;onOverlayClick=null;constructor(e,t){const i=document.createElement("div");i.className=`hud${t?" touch":""}`,i.innerHTML=`
      <div class="crosshair"></div>
      <svg class="gauge" viewBox="0 0 40 40" aria-hidden="true">
        <circle class="gauge-bg" cx="20" cy="20" r="${Ga}"></circle>
        <circle class="gauge-fg" cx="20" cy="20" r="${Ga}"></circle>
      </svg>
      <div class="slot-name"></div>
      <div class="hotbar"></div>
      <div class="touch-controls">
        <div class="stick-base" hidden><div class="stick-knob"></div></div>
        <button class="tbtn jump" aria-label="점프">▲</button>
        <button class="tbtn sneak" aria-label="웅크리기">▼</button>
      </div>
      <div class="compass" aria-label="나침반">
        <div class="compass-dial">
          <div class="compass-rose">
            <span class="compass-label compass-n">북</span>
            <span class="compass-label compass-e">동</span>
            <span class="compass-label compass-s">남</span>
            <span class="compass-label compass-w">서</span>
          </div>
          <div class="compass-pointer"></div>
        </div>
        <div class="compass-text">북</div>
      </div>
      <div class="topbar">
        <button class="sbtn help" aria-label="게임 방법">?</button>
        <button class="sbtn fullscreen" aria-label="전체화면">⛶ 전체화면</button>
        <button class="sbtn debug" aria-label="정보">i</button>
      </div>
      <pre class="debug-text" hidden></pre>
      <div class="toast" hidden></div>
      <div class="overlay">
        <div class="overlay-card">
          <h1 class="overlay-title"></h1>
          <p class="overlay-sub"></p>
          <button class="overlay-btn"></button>
          <button class="overlay-help">게임 방법 보기</button>
        </div>
      </div>
      <div class="help-panel" hidden>
        <div class="help-card">
          <div class="help-head">
            <h2>게임 방법</h2>
            <button class="help-close" aria-label="닫기">✕</button>
          </div>
          <div class="help-body"></div>
          <button class="overlay-btn help-ok">알겠어요</button>
          <button class="help-reset">처음 세계로 되돌리기 (만든 것이 지워져요)</button>
        </div>
      </div>`,e.appendChild(i),this.el=i;const r=a=>i.querySelector(a);this.gaugeFg=r(".gauge-fg"),this.gaugeFg.style.strokeDasharray=`${Ho}`,this.gaugeFg.style.strokeDashoffset=`${Ho}`,this.hotbar=r(".hotbar"),this.slotName=r(".slot-name"),this.toastEl=r(".toast"),this.debugEl=r(".debug-text"),this.overlay=r(".overlay"),this.overlayTitle=r(".overlay-title"),this.overlaySub=r(".overlay-sub"),this.overlayBtn=r(".overlay-btn"),this.fullscreenBtn=r(".fullscreen"),this.debugBtn=r(".debug"),this.helpEl=r(".help-panel"),this.compassRose=r(".compass-rose"),this.compassLabels=Array.from(i.querySelectorAll(".compass-label")),this.compassText=r(".compass-text"),r(".help-body").innerHTML=Mb(t);const s=a=>{a.preventDefault(),this.showHelp()},o=a=>{a.preventDefault(),this.hideHelp()};this.helpEl.addEventListener("click",a=>{a.target===this.helpEl&&this.hideHelp()}),r(".sbtn.help").addEventListener("click",s),r(".overlay-help").addEventListener("click",s),r(".help-close").addEventListener("click",o),r(".help-ok").addEventListener("click",o),r(".help-reset").addEventListener("click",a=>{a.preventDefault(),this.onResetWorld?.()}),this.touchUI={surface:i,stickBase:r(".stick-base"),stickKnob:r(".stick-knob"),jumpButton:r(".jump"),sneakButton:r(".sneak")},this.overlayBtn.addEventListener("click",()=>this.onOverlayClick?.()),this.overlay.addEventListener("click",a=>{a.target===this.overlay&&this.onOverlayClick?.()})}setFullscreen(e){const t=this.fullscreenBtn;t.hidden=e==="hidden",t.classList.toggle("active",e==="on"),t.textContent=e==="on"?"⛶ 전체화면 끄기":"⛶ 전체화면",t.setAttribute("aria-label",e==="on"?"전체화면 끄기":"전체화면")}setSlots(e){this.slots=e,this.hotbar.innerHTML="",this.slotEls.length=0,e.forEach((t,i)=>{const r=document.createElement("div");r.className="slot",r.dataset.index=String(i),t.icon&&r.appendChild(t.icon);const s=document.createElement("span");s.className="slot-key",s.textContent=String((i+1)%10),r.appendChild(s),r.addEventListener("pointerdown",o=>{o.preventDefault(),o.stopPropagation(),this.select(i),this.onSelect?.(i)}),this.hotbar.appendChild(r),this.slotEls.push(r)}),this.select(0,!1)}select(e,t=!0){this.slots.length!==0&&(e=(e%this.slots.length+this.slots.length)%this.slots.length,this.selected=e,this.slotEls.forEach((i,r)=>i.classList.toggle("selected",r===e)),t&&this.showSlotName(this.slots[e].name))}selectDelta(e){this.select(this.selected+e)}get selectedIndex(){return this.selected}get selectedBlock(){return this.slots[this.selected]?.blockNum??0}showSlotName(e){this.slotName.textContent=e,this.slotName.classList.add("show"),this.nameTimer&&window.clearTimeout(this.nameTimer),this.nameTimer=window.setTimeout(()=>this.slotName.classList.remove("show"),1200)}setHeading(e){const t=(-e*180/Math.PI%360+360)%360;if(!(Math.abs(t-this.lastBearing)<.3)){this.lastBearing=t,this.compassRose.style.transform=`rotate(${-t}deg)`;for(const i of this.compassLabels)i.style.transform=`rotate(${t}deg)`;this.compassText.textContent=Sb[Math.round(t/45)%8]}}setProgress(e){const t=e>0;this.gaugeFg.parentElement.classList.toggle("show",t),t&&(this.gaugeFg.style.strokeDashoffset=`${Ho*(1-Math.min(1,e))}`)}toast(e,t=4e3){this.toastEl.textContent=e,this.toastEl.hidden=!1,this.toastTimer&&window.clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>this.toastEl.hidden=!0,t)}setDebug(e){this.debugEl.hidden=e===null,e!==null&&(this.debugEl.textContent=e)}showOverlay(e,t,i){this.overlayTitle.textContent=e,this.overlaySub.textContent=t,this.overlayBtn.textContent=i??"",this.overlayBtn.hidden=i===null,this.overlay.classList.add("show")}hideOverlay(){this.overlay.classList.remove("show")}get overlayVisible(){return this.overlay.classList.contains("show")}showHelp(){this.helpEl.hidden&&(this.helpEl.hidden=!1,this.helpEl.querySelector(".help-card").scrollTop=0,this.onHelpToggle?.(!0))}hideHelp(){this.helpEl.hidden||(this.helpEl.hidden=!0,this.onHelpToggle?.(!1))}get helpVisible(){return!this.helpEl.hidden}}function Mb(n){const e=n?[["걷기","왼쪽 아래 <b>스틱</b>을 누른 채 밀기. 끝까지 앞으로 밀면 달리기"],["둘러보기","스틱이 아닌 곳을 <b>드래그</b>"],["블록 놓기","놓을 자리를 <b>짧게 탭</b>"],["블록 부수기","블록을 <b>꾹 누르기</b>. 게이지가 차고 금이 가면 부서져요"],["점프","오른쪽 아래 <b>▲</b>"],["웅크리기","<b>▼</b> (한 번 누르면 켜짐, 다시 누르면 꺼짐). 웅크리면 모서리에서 안 떨어져요"],["블록 고르기","아래 칸(핫바)을 탭"],["FPS 보기","오른쪽 위 <b>i</b>"]]:[["걷기 / 달리기","<b>W A S D</b> / Ctrl 누른 채 W"],["둘러보기","마우스. 클릭하면 마우스가 잠기고, <b>ESC</b>로 풀려요"],["블록 놓기","<b>오른쪽 클릭</b> (누르고 있으면 연속)"],["블록 부수기","<b>왼쪽 클릭 꾹</b>. 금이 가면 부서져요"],["점프 / 웅크리기","<b>Space</b> / <b>Shift</b>"],["블록 고르기","<b>1~9, 0</b> 또는 마우스 휠"],["정보","<b>F3</b>"]],t=n?"PC 에서는: WASD 이동 · 마우스 둘러보기 · 왼쪽 클릭 꾹 부수기 · 오른쪽 클릭 놓기 · 1~9 블록":"폰에서는: 왼쪽 아래 스틱 · 드래그로 둘러보기 · 짧게 탭 놓기 · 꾹 눌러 부수기 · ▲ 점프",i=["위 가운데 <b>나침반</b>: 맨 위 글자가 지금 내가 보는 방향이에요(북은 빨강). 광장에서 북쪽에 포탈 자리와 강, 서쪽·동쪽에 큰 밭, 남쪽에 집 뼈대, 둘레는 참나무 숲과 언덕.","한 칸 높은 턱은 그냥 걸어가면 올라가요. 두 칸부터는 점프.","손에 든 블록이 오른쪽 아래에 보이고, 조준한 블록엔 검은 테두리가 생겨요. 닿는 거리는 5블록.","블록마다 부수는 시간이 달라요. 흙·모래 0.5초, 돌 1.5초, 원목·판자 2초. 맨 아래 기반암과 물은 못 부숴요.","내 몸이 있는 자리에는 블록을 놓을 수 없어요.","물에 들어가면 천천히 가라앉고, 점프를 누르면 위로 헤엄쳐요.","내가 놓은 물·용암은 내가 보는 방향으로만 흘러요(아래로는 떨어져요). 원래 있던 연못은 벽이 없으면 사방으로 퍼져요. 물이나 용암을 들고 원천을 꾹 누르면(PC: 왼쪽 클릭) 떠낼 수 있어요. 물이 용암을 만나면 돌이 돼요.","광장 남쪽에 뼈대만 있는 집이 있어요. 문·창문·지붕을 채워 봐요. 북쪽 흑요석 문틀은 나중에 포탈이 될 자리. 동남쪽 언덕엔 동굴 입구가 있고 땅속엔 광물과 동굴이 있어요.","세계 끝은 보이지 않는 벽. 떨어지면 광장으로 돌아와요.","만든 것은 이 폰(또는 PC) 브라우저에 자동으로 저장돼요. 다른 기기에서는 안 보여요 — 친구와 같은 마을은 나중에(멀티) 생겨요."];return`<table class="help-table">${e.map(([r,s])=>`<tr><th>${r}</th><td>${s}</td></tr>`).join("")}</table><p class="help-other">${t}</p><h3>알아두면 좋아요</h3><ul class="help-tips">${i.map(r=>`<li>${r}</li>`).join("")}</ul>`}const Au=new WeakMap;function Eu(n){let e=Au.get(n);return e||(e=document.createElement("canvas"),e.width=n.width,e.height=n.height,e.getContext("2d").putImageData(n,0,0),Au.set(n,e)),e}function bb(n,e,t=40){const i=Math.min(2,window.devicePixelRatio||1),r=document.createElement("canvas");r.width=r.height=Math.round(t*i),r.style.width=r.style.height=`${t}px`;const s=r.getContext("2d");s.imageSmoothingEnabled=!1;const o=t*i/32,a=Eu(n),c=Eu(e),l=u=>{s.globalCompositeOperation="source-atop",s.fillStyle=`rgba(0,0,0,${u})`,s.fillRect(0,0,16,16),s.globalCompositeOperation="source-over"};return s.setTransform(o,.5*o,-o,.5*o,16*o,0),s.drawImage(a,0,0,16,16),s.setTransform(o,.5*o,0,o,0,8*o),s.drawImage(c,0,0,16,16),l(.22),s.setTransform(o,-.5*o,0,o,16*o,16*o),s.drawImage(c,0,0,16,16),l(.42),s.setTransform(1,0,0,1,0,0),r}class gc{workers=[];busy=[];pending=new Map;nextJob=1;constructor(e,t=gc.defaultCount()){for(let i=0;i<t;i++){const r=new Worker(new URL("/DragonVillage/assets/mesher.worker-BKwCU3sk.js",import.meta.url),{type:"module",name:`mesher-${i}`});r.onmessage=o=>this.onMessage(o.data),r.onerror=o=>console.error("메싱 워커 오류",o);const s={type:"init",blockInfo:e};r.postMessage(s),this.workers.push(r),this.busy.push(0)}}static defaultCount(){const e=typeof navigator<"u"&&navigator.hardwareConcurrency||2;return Math.max(1,Math.min(4,e-1))}get size(){return this.workers.length}get inflight(){return this.pending.size}mesh(e,t,i,r,s){let o=0;for(let c=1;c<this.busy.length;c++)this.busy[c]<this.busy[o]&&(o=c);const a=this.nextJob++;return this.busy[o]++,new Promise((c,l)=>{this.pending.set(a,{resolve:c,reject:l,worker:o});const u={type:"mesh",jobId:a,cx:e,cy:t,cz:i,padded:r,light:s};this.workers[o].postMessage(u,[r.buffer,s.buffer])})}onMessage(e){const t=this.pending.get(e.jobId);t&&(this.pending.delete(e.jobId),this.busy[t.worker]--,t.resolve(e))}dispose(){for(const e of this.workers)e.terminate();this.workers.length=0;for(const e of this.pending.values())e.reject(new Error("워커 풀 종료"));this.pending.clear()}}const wb="dragoncraft",Tb=1;function Wo(n){return new Promise((e,t)=>{n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error??new Error("IndexedDB 요청 실패"))})}function Su(n){return new Promise((e,t)=>{n.oncomplete=()=>e(),n.onerror=()=>t(n.error??new Error("IndexedDB 트랜잭션 실패")),n.onabort=()=>t(n.error??new Error("IndexedDB 트랜잭션 중단"))})}class Bs{constructor(e){this.db=e}db;static available(){return typeof indexedDB<"u"}static open(){return new Promise((e,t)=>{const i=indexedDB.open(wb,Tb);i.onupgradeneeded=()=>{const r=i.result;r.objectStoreNames.contains("chunks")||r.createObjectStore("chunks",{keyPath:"key"}).createIndex("byWorld","worldId",{unique:!1}),r.objectStoreNames.contains("meta")||r.createObjectStore("meta",{keyPath:"worldId"})},i.onsuccess=()=>e(new Bs(i.result)),i.onerror=()=>t(i.error??new Error("IndexedDB 를 열 수 없어요")),i.onblocked=()=>t(new Error("IndexedDB 가 다른 탭에 막혔어요"))})}async loadMeta(e){const t=this.db.transaction("meta","readonly");return await Wo(t.objectStore("meta").get(e))}async loadChunks(e){const t=this.db.transaction("chunks","readonly");return await Wo(t.objectStore("chunks").index("byWorld").getAll(e))}async save(e,t,i){const r=this.db.transaction(["chunks","meta"],"readwrite"),s=r.objectStore("chunks");for(const o of t)s.put({...o,key:`${e}|${o.cx},${o.cy},${o.cz}`});r.objectStore("meta").put(i),await Su(r)}async clearWorld(e){const t=this.db.transaction(["chunks","meta"],"readwrite"),i=t.objectStore("chunks"),r=await Wo(i.index("byWorld").getAllKeys(e));for(const s of r)i.delete(s);t.objectStore("meta").delete(e),await Su(t)}close(){this.db.close()}}const Rb=1500,Cb=2e4;class _c{constructor(e,t,i,r,s){this.store=e,this.world=t,this.registry=i,this.worldId=r,this.genVersion=s}store;world;registry;worldId;genVersion;modified=new Map;timer=null;periodic=null;flushing=null;player=null;lastSavedAt=0;lastError=null;onSaved=null;static async create(e,t,i,r){let s=null;if(Bs.available())try{s=await Bs.open()}catch(o){console.warn("저장소를 열 수 없어요 — 저장 없이 진행",o)}return new _c(s,e,t,i,r)}get available(){return this.store!==null}get pendingCount(){return this.modified.size}bindPlayer(e){this.player=e}async discardLegacy(e){if(!this.store)return!1;try{return await this.store.loadMeta(e)?(await this.store.clearWorld(e),!0):!1}catch{return!1}}async load(){const e={loaded:!1,chunks:0,player:null,discardedOldWorld:!1,unknownIds:[]};if(!this.store)return e;try{const t=await this.store.loadMeta(this.worldId);if(!t)return e;if(t.genVersion!==this.genVersion)return await this.store.clearWorld(this.worldId),{...e,discardedOldWorld:!0};const i=await this.store.loadChunks(this.worldId),r=new Set;for(const s of i){if(!this.world.chunkInBounds(s.cx,s.cy,s.cz))continue;const o=this.world.getOrCreateChunk(s.cx,s.cy,s.cz),a=K_(s.bytes,this.registry,o);for(const c of a.unknownIds)r.add(c)}return{loaded:!0,chunks:i.length,player:t.player??null,discardedOldWorld:!1,unknownIds:[...r]}}catch(t){return this.lastError=t instanceof Error?t.message:String(t),console.warn("저장 불러오기 실패",t),e}}markChunk(e,t,i){!this.store||!this.world.chunkInBounds(e,t,i)||(this.modified.set(fn(e,t,i),{cx:e,cy:t,cz:i}),this.schedule())}markBlock(e,t,i){this.markChunk(e>>4,t>>4,i>>4)}markChunks(e){for(const t of e)this.markChunk(t.cx,t.cy,t.cz)}schedule(){this.timer===null&&(this.timer=window.setTimeout(()=>{this.timer=null,this.flush()},Rb))}attachLifecycle(){if(!this.store)return;this.periodic=window.setInterval(()=>{this.flush()},Cb);const e=()=>{this.flush(!0)};document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&e()}),window.addEventListener("pagehide",e),window.addEventListener("beforeunload",e)}flush(e=!1){if(!this.store)return Promise.resolve();if(this.flushing)return this.flushing;if(this.modified.size===0&&!e)return Promise.resolve();const t=this.store,i=[...this.modified.values()];return this.modified.clear(),this.timer!==null&&(window.clearTimeout(this.timer),this.timer=null),this.flushing=(async()=>{try{const r=[];for(const a of i){const c=this.world.getChunk(a.cx,a.cy,a.cz);c&&r.push({worldId:this.worldId,cx:a.cx,cy:a.cy,cz:a.cz,bytes:j_(c,this.registry)})}const s=await t.loadMeta(this.worldId),o={worldId:this.worldId,genVersion:this.genVersion,savedAt:Date.now(),player:this.player?.()??s?.player,chunkCount:(s?.chunkCount??0)+r.length};await t.save(this.worldId,r,o),this.lastSavedAt=o.savedAt,this.lastError=null,this.onSaved?.(r.length)}catch(r){for(const s of i)this.modified.set(fn(s.cx,s.cy,s.cz),s);this.lastError=r instanceof Error?r.message:String(r),console.warn("저장 실패",r)}finally{this.flushing=null}})(),this.flushing}async clear(){this.store&&(this.modified.clear(),await this.store.clearWorld(this.worldId))}dispose(){this.timer!==null&&window.clearTimeout(this.timer),this.periodic!==null&&window.clearInterval(this.periodic),this.store?.close()}}class Pb{constructor(e,t){this.renderer=e;const i=window.devicePixelRatio||1;this.maxPixelRatio=Math.min(i,t?1.5:2),this.pixelRatio=t?Math.min(i,1):this.maxPixelRatio,this.apply()}renderer;ema=16;pixelRatio;maxPixelRatio;minPixelRatio=.5;timer=0;goodStreak=0;onChange=null;apply(){this.renderer.setPixelRatio(this.pixelRatio),this.onChange?.(this.pixelRatio)}frame(e){this.ema=this.ema*.94+e*1e3*.06,this.timer+=e,!(this.timer<2)&&(this.timer=0,this.ema>36&&this.pixelRatio>this.minPixelRatio?(this.pixelRatio=Math.max(this.minPixelRatio,this.pixelRatio-.25),this.goodStreak=0,this.apply()):this.ema<14&&this.pixelRatio<this.maxPixelRatio?++this.goodStreak>=3&&(this.pixelRatio=Math.min(this.maxPixelRatio,this.pixelRatio+.25),this.goodStreak=0,this.apply()):this.goodStreak=0)}resize(){this.apply()}}const Db=5,yu=.3,Mu=.25;class Ib{constructor(e,t,i,r){this.world=e,this.registry=t,this.player=i,this.events=r}world;registry;player;events;target=null;progress=0;breakingKey=-1;cooldown=0;placeTimer=0;swingTimer=0;selectedBlock=0;getBlock=(e,t,i)=>this.world.getBlock(e,t,i);targetable=e=>this.registry.isSolid(e)||this.bucketMode&&this.registry.isFluid(e);get bucketMode(){return this.selectedBlock>0&&this.registry.get(this.selectedBlock).fluid!==null}update(e,t){const i=this.player.eye,r=this.player.lookDir;if(this.target=Q_(this.getBlock,this.targetable,i.x,i.y,i.z,r.x,r.y,r.z,Db),this.cooldown=Math.max(0,this.cooldown-t),e.primary&&this.target){const s=this.target,o=(s.x*1024+s.y)*1024+s.z|0;o!==this.breakingKey&&(this.breakingKey=o,this.progress=0),this.swingTimer-=t,this.swingTimer<=0&&(this.events.onSwing(),this.swingTimer=.25);const a=this.registry.get(s.id);if(a.fluid){if(this.progress=0,this.cooldown<=0&&a.fluidLevel===0){const c=this.world.setBlock(s.x,s.y,s.z,lt);c.changed&&(this.events.onBlocksChanged(c.dirty),this.events.onBroken?.(s.x,s.y,s.z,s.id)),this.breakingKey=-1,this.cooldown=yu}}else if(a.hardness===null)this.progress=0;else if(this.cooldown<=0&&(this.progress+=a.hardness<=0?1:t/a.hardness,this.progress>=1)){const c=this.world.setBlock(s.x,s.y,s.z,lt);c.changed&&(this.events.onBlocksChanged(c.dirty),this.events.onBroken?.(s.x,s.y,s.z,s.id)),this.progress=0,this.breakingKey=-1,this.cooldown=yu}}else this.progress=0,this.breakingKey=-1,this.swingTimer=0;e.secondaryTap?(this.place(),this.placeTimer=Mu):e.secondaryHold?(this.placeTimer-=t,this.placeTimer<=0&&(this.place(),this.placeTimer=Mu)):this.placeTimer=0}place(){const e=this.target;if(!e||this.selectedBlock<=0)return;const t=e.x+e.nx,i=e.y+e.ny,r=e.z+e.nz;if(!this.world.inBounds(t,i,r))return;const s=this.world.getBlock(t,i,r);if(this.registry.isSolid(s))return;const o=this.registry.get(this.selectedBlock);if(o.solid&&J_(this.player.pos,fi,t,i,r))return;const a=o.fluid?this.registry.fluidVariant(o.fluidSource,0,this.facingDir()):this.selectedBlock,c=this.world.setBlock(t,i,r,a);c.changed&&(this.events.onBlocksChanged(c.dirty),this.events.onPlaced?.(t,i,r,a),this.events.onSwing())}facingDir(){const e=-Math.sin(this.player.yaw),t=-Math.cos(this.player.yaw);return Math.abs(e)>Math.abs(t)?e>0?1:2:t>0?3:4}}const Ub=["grass","dirt","stone","planks","log","leaves","glass","glowstone","water","lava"],xs=.05,Lb=["북","북서","서","남서","남","남동","동","북동"];async function Nb(n,e){const{isTouch:t}=e,i=g0,r=await Eb(),s=qy(i,r.index),o=f0(i,wh),{world:a,spawn:c}=o,l=await _c.create(a,i,u0,h0),u=await l.discardLegacy("test-world"),h=await l.load();if(u&&(h.discardedOldWorld=!0),h.player){const D=h.player;a.inBounds(Math.floor(D.x),Math.floor(Math.max(0,Math.min(a.sizeY-2,D.y))),Math.floor(D.z))&&(c.x=D.x,c.y=D.y,c.z=D.z,c.yaw=D.yaw)}const f=new s0(a,i);f.computeAll();const d=new By({antialias:!1,alpha:!1,powerPreference:"high-performance",stencil:!1});d.domElement.className="game",d.domElement.tabIndex=0,d.autoClear=!1,d.setClearColor(sf,1),n.appendChild(d.domElement);const g=new Zh,_=new rn(70,1,.05,600);_.rotation.order="YXZ";const m=cM(r.texture),p=new gc(s),A=new lM(a,f,m,p,g);A.renderDistance=t?5:8,(()=>{const D=A.renderDistance*Oe;m.setFog(D*.55,D*.98),_.far=D*1.3+50,_.updateProjectionMatrix()})(),A.markAll();const x=new MM(g),w=new yM(g),b=new vM(m,s),R=new yb(n,t),I=Ub.map(D=>{const G=i.find(D);if(!G||!G.textures)return{blockNum:0,name:D,icon:null};const O=r.images.get("missing"),ce=r.images.get(G.textures[0])??O,ie=r.images.get(G.textures[1])??O;return{blockNum:G.num,name:G.name,icon:bb(ce,ie,40)}});R.setSlots(I);const M=new Vy,S=new Gy(d.domElement);M.add(S);const C=new Zy(R.touchUI);M.add(C),M.add(new zy),M.paused=!0;const U=new sM(a,i,c,c.yaw);h.player&&(U.pitch=h.player.pitch),l.bindPlayer(()=>({x:U.pos.x,y:U.pos.y,z:U.pos.z,yaw:U.yaw,pitch:U.pitch})),l.attachLifecycle();const k=new n0(a,i);k.onBlockSet=(D,G,O)=>f.markChanged(D,G,O);let V=0;const H=new Ib(a,i,U,{onBlocksChanged:D=>A.markDirtyAll(D),onSwing:()=>b.swing(),onPlaced:(D,G,O)=>{k.touch(D,G,O),f.markChanged(D,G,O),l.markBlock(D,G,O)},onBroken:(D,G,O)=>{k.touch(D,G,O),f.markChanged(D,G,O),l.markBlock(D,G,O)}}),W=new Pb(d,t);let $=0,X=0;const te=(D=!1)=>{const G=n.clientWidth||window.innerWidth,O=n.clientHeight||window.innerHeight;G<=0||O<=0||!D&&G===$&&O===X||($=G,X=O,_.aspect=G/O,_.updateProjectionMatrix(),d.setSize(G,O,!1))};W.onChange=()=>te(!0),te(!0);const ae=()=>te();window.addEventListener("resize",ae),window.addEventListener("orientationchange",()=>setTimeout(ae,200)),document.addEventListener("fullscreenchange",()=>{ae(),setTimeout(ae,300)}),window.visualViewport?.addEventListener("resize",ae);const _e=typeof ResizeObserver<"u"?new ResizeObserver(ae):null;_e?.observe(n);let ye=!1;R.debugBtn.addEventListener("click",()=>ye=!ye);const Ve=window.matchMedia("(display-mode: standalone), (display-mode: fullscreen)").matches||navigator.standalone===!0,Ce=!!document.fullscreenEnabled&&typeof document.documentElement.requestFullscreen=="function",Pe=`이 브라우저는 전체화면이 안 돼요.
공유 버튼 → "홈 화면에 추가" 로 열면 전체화면이 돼요.`,K=()=>{Ve?R.setFullscreen("hidden"):Ce?R.setFullscreen(document.fullscreenElement?"on":"off"):R.setFullscreen("unavailable")};K(),document.addEventListener("fullscreenchange",K);async function Q(){if(!Ce)return!1;try{document.fullscreenElement||await document.documentElement.requestFullscreen({navigationUI:"hide"});const D=screen.orientation;return D.lock&&await D.lock("landscape").catch(()=>{}),!0}catch{return!1}}async function pe(){try{document.fullscreenElement&&await document.exitFullscreen()}catch{}}R.fullscreenBtn.addEventListener("click",()=>{if(!Ce){R.toast(Pe,7e3);return}document.fullscreenElement?pe():Q().then(D=>{D||R.toast("전체화면을 켤 수 없었어요. 다시 한 번 눌러 보세요.",4e3)})});let Me=!1,fe=!1;const Te=()=>{M.paused=!0,S.enabled=!1,R.showOverlay("잠깐 멈춤","ESC 로 나왔어요. 다시 들어가려면 아래를 눌러요.","계속하기")},at=()=>{R.hideOverlay(),M.paused=!1,S.enabled=!0,d.domElement.focus(),t||S.requestLock().then(D=>{!D&&!fe&&(fe=!0,R.toast("이 브라우저는 마우스 잠금이 안 돼요. 마우스를 움직여 둘러보세요.",5e3))})};R.onOverlayClick=()=>{Me&&at()},R.onResetWorld=()=>{if(!l.available){R.toast("이 브라우저는 저장이 안 돼서 되돌릴 것도 없어요.",4e3);return}window.confirm(`정말 처음 세계로 되돌릴까요?
지금까지 만든 것이 모두 지워져요.`)&&l.clear().then(()=>window.location.reload())},R.onHelpToggle=D=>{D?(M.paused=!0,S.enabled=!1):Me&&!R.overlayVisible&&at()},document.addEventListener("pointerlockchange",()=>{t||!Me||S.lockFailed||!S.locked&&!R.overlayVisible&&!R.helpVisible&&Te()}),n.addEventListener("click",()=>{Me&&!t&&!S.locked&&!R.overlayVisible&&at()});let P=!1,Je=performance.now(),ke=0,Ie=0,xe=0,$e=0,Ae=0,F=0,q=0;const le=t?.6:1,T=()=>{const D=U.pos,G=(U.yaw*180/Math.PI+360)%360,O=Lb[Math.round(G/45)%8],ce=H.target,ie=ce?`${i.get(ce.id).name} (${ce.x}, ${ce.y}, ${ce.z}) 면 ${["+X","-X","+Y","-Y","+Z","-Z"][ce.face]}`:"없음";return[`FPS ${xe}  프레임 ${W.ema.toFixed(1)}ms  해상도 ×${W.pixelRatio.toFixed(2)}  렌더거리 ${A.renderDistance}  화면 ${$}×${X} 버퍼 ${d.domElement.width}×${d.domElement.height} 비율 ${_.aspect.toFixed(2)}`,`드로우 ${Ae}  삼각형 ${(F/1e3).toFixed(1)}k`,`청크 보임 ${A.stats.visibleChunks}  큐 ${A.queued}  진행 ${A.inflight}  워커 ${p.size}`,`메싱 최근 ${A.stats.lastMs.toFixed(1)}ms  평균 ${A.stats.avgMs.toFixed(1)}ms  최대 ${A.stats.maxMs.toFixed(1)}ms  총 ${A.stats.meshed}`,`위치 ${D.x.toFixed(2)} ${D.y.toFixed(2)} ${D.z.toFixed(2)}  yaw ${G.toFixed(0)}°  pitch ${(U.pitch*180/Math.PI).toFixed(0)}°  ${O}`,`조준 ${ie}`,`바닥 ${U.onGround?"O":"X"}  물 ${U.inWater?"O":"X"}  웅크림 ${U.sneaking?"O":"X"}  달리기 ${U.sprinting?"O":"X"}  액체 대기 ${k.pendingCount}`,`빛 여기 하늘 ${f.skyAt(Math.floor(D.x),Math.floor(D.y+1),Math.floor(D.z))} 블록 ${f.blockAt(Math.floor(D.x),Math.floor(D.y+1),Math.floor(D.z))}  조명 처음 ${f.stats.initialMs.toFixed(0)}ms  최근 ${f.stats.lastFlushMs.toFixed(1)}ms/${f.stats.lastFlushCells}칸  지형 생성 ${o.ms.toFixed(0)}ms  청크 ${a.chunkCount}`,`${t?"터치":"PC"}  ${navigator.hardwareConcurrency??"?"}코어  ${window.innerWidth}×${window.innerHeight}@${(window.devicePixelRatio||1).toFixed(1)}`,`저장 ${l.available?l.lastError?`오류: ${l.lastError}`:l.lastSavedAt?`${Math.round((Date.now()-l.lastSavedAt)/1e3)}초 전`:"아직 없음":"불가"}  대기 ${l.pendingCount}`].join(`
`)},v=D=>{P&&(requestAnimationFrame(v),L(D))},L=(D,G)=>{const O=Math.max(0,Math.min(.1,(D-Je)/1e3));Je=Math.max(Je,D),(q=(q+1)%15)===0&&te();const ce=M.frame(O);for(ce.toggleDebug&&(ye=!ye),ce.slotDelta!==0&&R.selectDelta(ce.slotDelta),ce.slotSelect>=0&&R.select(ce.slotSelect),H.selectedBlock=R.selectedBlock,U.update(ce,O),H.update(ce,O),U.applyToCamera(_,le),V+=O,V>xs*4&&(V=xs*4);V>=xs;)A.markDirtyAll(k.tick()),V-=xs;l.markChunks(k.takeChanged()),A.markDirtyAll(f.flush()),H.target?(w.setTarget(H.target.x,H.target.y,H.target.z),w.setProgress(H.progress)):w.clearTarget(),R.setProgress(H.progress),R.setHeading(U.yaw),A.update(U.pos.x,U.pos.y,U.pos.z),m.setTime(D/1e3),x.update(_.position),b.setBlock(R.selectedBlock);const ie=U.onGround&&U.horizontalSpeed>.4?Math.min(1,U.horizontalSpeed/4.3):0;b.update(O,_,U.walkCycle,ie),d.clear(),d.render(g,_),Ae=d.info.render.calls,F=d.info.render.triangles,b.render(d,_),W.frame(O),ke++,Ie+=O,Ie>=.5&&(xe=Math.round(ke/Ie),ke=0,Ie=0),$e+=O,ye&&$e>=.25?($e=0,R.setDebug(T())):ye||R.setDebug(null)};return P=!0,requestAnimationFrame(v),R.showOverlay("드래곤 크래프트",t?`왼쪽 아래 스틱: 움직이기  ·  드래그: 둘러보기
짧게 탭: 놓기  ·  꾹: 부수기`:`WASD 이동  ·  마우스 둘러보기
좌클릭 꾹: 부수기  ·  우클릭: 놓기`,t?"탭해서 시작":"클릭해서 시작"),{start(){Me||(Me=!0,h.loaded?R.toast(`저장된 세계를 불러왔어요 (청크 ${h.chunks}개)`,3500):h.discardedOldWorld?R.toast("세계가 새로 바뀌어서 예전 저장은 지웠어요. 새로 시작!",5e3):l.available||R.toast("이 브라우저에서는 만든 것이 저장되지 않아요.",5e3),h.unknownIds.length&&R.toast(`모르는 블록 ${h.unknownIds.join(", ")} 은(는) 공기로 바꿨어요`,6e3),t&&(Ce?Q():Ve||R.toast(Pe,7e3),window.innerHeight>window.innerWidth&&(Ce||Ve)&&R.toast("폰을 가로로 돌리면 더 편해요",3500)),at())},dispose(){P=!1,l.flush(!0).finally(()=>l.dispose()),M.dispose(),A.dispose(),p.dispose(),x.dispose(),w.dispose(),b.dispose(),m.dispose(),r.texture.dispose(),d.dispose(),window.removeEventListener("resize",ae),_e?.disconnect(),n.innerHTML=""}}}export{Nb as createGame};
//# sourceMappingURL=Game-BNBKJkJ1.js.map
