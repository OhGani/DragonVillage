import{F as Aa,A as Fn,C as Tr,h as Tt,i as Jo,j as Pd,k as Bh,l as Fh,m as Oh,I as zh,R as Vh,p as Gh,n as Hh,o as Wh,q as Xh,r as Yh,s as qh,t as Kh,u as Qh,v as jh,w as Jh,x as Zh,y as $h,z as eu,B as tu,D as nu,E as iu,G as su,H as ou,J as ru,K as Id,L as Ud,N as Ft,O as au,Q as Nd,S as lu,T as ba,V as xt,U as Bd,W as Fd,X as Yi,Y as _r,Z as fn,_ as cu,$ as Ys,a0 as rr,a1 as du,a2 as Cr,a3 as hu,a4 as uu,a5 as fu,a6 as Od,a7 as pu,a8 as ar,a9 as mu,aa as gu,ab as _u,ac as zd,ad as vu,ae as ya,af as xu,ag as Au,ah as bu,ai as cn,aj as ui,ak as zl,al as yu,am as Vl,an as Mu,ao as Eu,ap as Su,aq as wu,ar as Tu,as as Gl,at as Hl,au as Cu,av as fo,aw as Ru,ax as ku,ay as Du,az as Lu,aA as Pu,aB as Iu,aC as Uu,aD as Nu,aE as Bu,aF as Fu,aG as Rr,aH as Wl,aI as Ou,aJ as zu,aK as Vu,aL as Gu,aM as Hu,aN as Wu,aO as Xu,aP as Yu,aQ as qu,aR as Ku,aS as Xl,aT as Yl,aU as ql,aV as Qu}from"./index-CYtbhHWF.js";const ju={coal:"석탄",glowstone_dust:"발광석 가루",emerald:"에메랄드",lapis:"청금석",quartz:"석영",apple:"사과",redstone:"레드스톤 가루",leather:"가죽",wheat:"밀",milk_bucket:"우유 양동이",egg:"달걀",carrot:"당근",snowball:"눈덩이",feather:"깃털",string:"실",flint:"부싯돌",pumpkin_seeds:"호박 씨",name_tag_blank:"빈 이름표",white_wool:"흰 양털",ink_sac:"먹물",brown_mushroom:"갈색 버섯",melon_slice:"수박 조각",slime_ball:"슬라임 볼",scute:"인갑",bucket:"양동이",water_bucket:"물 양동이",lava_source_block:"용암(원천)",water_source_block:"물",bone:"뼈",beef:"소고기",porkchop:"돼지고기",mutton:"양고기",chicken:"닭고기",rotten_flesh:"썩은 고기",gunpowder:"화약",spider_eye:"거미 눈",potato:"감자",salmon:"연어",rabbit_hide:"토끼 가죽",glow_ink_sac:"발광 먹물",crossbow:"석궁",wheat_seeds:"밀 씨",melon_seeds:"수박 씨"};function Ju(s,e){if(Array.isArray(e))for(const t of e){if(!t||typeof t!="object")continue;const{id:n,name:i}=t;typeof n=="string"&&typeof i=="string"&&!s.has(n)&&s.set(n,i)}}function Zu(s){const e=new Map;if(s.extra)for(const[i,o]of s.extra)e.set(i,o);const t=s.recipes?.recipes;if(Array.isArray(t))for(const i of t){if(!i||typeof i!="object")continue;const{out:o,name:r}=i;if(!o||typeof r!="string")continue;const a=Object.keys(o);a.length===1&&!e.has(a[0])&&e.set(a[0],r)}Ju(e,s.dragons?.materials);const n=s.potions;for(const i of[n?.ingredients,n?.modifiers])if(i)for(const[o,r]of Object.entries(i)){if(o.startsWith("_")||e.has(o))continue;const a=r?.name;typeof a=="string"&&e.set(o,a)}for(const[i,o]of Object.entries(ju))e.has(i)||e.set(i,o);return e}function Kl(s,e,t){return e.find(s)?.name??t.get(s)??s}const $u="water_bucket",ef="lava_bucket";function tf(s,e){if(s===$u){const n=e.find("water");return n?e.fluidFinite(n.num,Aa):null}if(s===ef){const n=e.find("lava");return n?e.fluidFinite(n.num,Aa):null}const t=e.find(s);return!t||t.internal||t.fluid||t.num===0?null:t.num}const nf=27,sf=nf*2,Ql=100,of=5,rf=1.5,af=24,qs=1500,lf=qs,cf={color:"#bdbdbd",power:1,stamina:25,cooldownSec:qs/1e3};function df(s){const e=s.skills.find(n=>n.type==="beam");if(!e)return cf;const t=(n,i,o,r)=>typeof n=="number"&&Number.isFinite(n)?Math.min(r,Math.max(o,n)):i;return{color:typeof e.color=="string"&&/^#[0-9a-fA-F]{6}$/.test(e.color)?e.color:s.color,power:Math.round(t(e.powerLevel,1,1,5)),stamina:t(e.stamina,25,0,1e3),cooldownSec:lf/1e3}}function po(s){return s==="adult"?Math.round(Ql*rf):Ql}function hf(s,e,t){const n=Math.max(0,t-s.at)/1e3;return Math.min(e,s.value+n*of)}const bn={sheared:8,baby:16,tamed:32,sitting:64,love:128},kr=4e4,uf=1;function jl(s,e,t){let n=0;const i=s[n++];if(i!==uf)throw new Error(`모르는 청크 저장 형식: ${i}`);const o=s[n]|s[n+1]<<8;n+=2;const r=[],a=[];for(let c=0;c<o;c++){const h=s[n++];let f="";for(let g=0;g<h;g++)f+=String.fromCharCode(s[n++]);const _=e.find(f);_?r.push(_.num):(r.push(Fn),a.push(f))}const l=s[n]|s[n+1]<<8;n+=2;const d=new Uint16Array(Tr);let u=0;for(let c=0;c<l;c++){const h=s[n]|s[n+1]<<8,f=s[n+2]|s[n+3]<<8;if(n+=4,f>=r.length)throw new Error(`팔레트 번호가 범위를 벗어났어요: ${f}`);const _=r[f];if(u+h>Tr)throw new Error("청크 데이터가 4096 을 넘어요");d.fill(_,u,u+h),u+=h}if(u!==Tr)throw new Error(`청크 데이터가 ${u}개 — 4096 이어야 해요`);return t.loadBlockIds(d),{unknownIds:a}}const ff=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];function pf(s,e,t,n,i,o,r,a,l){const d=Math.hypot(o,r,a);if(d===0)return null;o/=d,r/=d,a/=d;let u=Math.floor(t),c=Math.floor(n),h=Math.floor(i);const f=o>0?1:o<0?-1:0,_=r>0?1:r<0?-1:0,g=a>0?1:a<0?-1:0,p=f?Math.abs(1/o):1/0,m=_?Math.abs(1/r):1/0,M=g?Math.abs(1/a):1/0;let w=f>0?(u+1-t)/o:f<0?(t-u)/-o:1/0,b=_>0?(c+1-n)/r:_<0?(n-c)/-r:1/0,R=g>0?(h+1-i)/a:g<0?(i-h)/-a:1/0,v=-1,S=0;for(let C=0;C<256;C++){if(v>=0){const A=s(u,c,h);if(e(A)){const y=ff[v];return{x:u,y:c,z:h,face:v,nx:y[0],ny:y[1],nz:y[2],distance:S,id:A}}}if(w<b&&w<R){if(S=w,S>l)return null;u+=f,w+=p,v=f>0?1:0}else if(b<R){if(S=b,S>l)return null;c+=_,b+=m,v=_>0?3:2}else{if(S=R,S>l)return null;h+=g,R+=M,v=g>0?5:4}}return null}const ht=1e-4;function Ls(s,e,t,n,i){const o=e.w/2;return t+1>s.x-o+ht&&t<s.x+o-ht&&n+1>s.y+ht&&n<s.y+e.h-ht&&i+1>s.z-o+ht&&i<s.z+o-ht}function Dr(s,e,t,n,i,o,r,a,l){const d=u=>{for(let c=o;c<=r;c++)for(let h=a;h<=l;h++)if(e===0?s(u,c,h):e===1?s(c,u,h):s(c,h,u))return!0;return!1};if(i>0){const u=Math.floor(n-ht)+1,c=Math.floor(n+i-ht);for(let h=u;h<=c;h++)if(d(h))return h}else{const u=Math.floor(t+ht)-1,c=Math.floor(t+i+ht);for(let h=u;h>=c;h--)if(d(h))return h}return null}function Zo(s,e,t,n,i,o){o.onGround=!1,o.hitX=o.hitY=o.hitZ=o.hitCeiling=!1;const r=t.w/2;let a=n.y*i;if(a!==0){const l=Math.floor(e.x-r+ht),d=Math.floor(e.x+r-ht),u=Math.floor(e.z-r+ht),c=Math.floor(e.z+r-ht),h=Dr(s,1,e.y,e.y+t.h,a,l,d,u,c);h===null?e.y+=a:a>0?(e.y=h-t.h-ht,n.y=0,o.hitY=o.hitCeiling=!0):(e.y=h+1,n.y=0,o.hitY=o.onGround=!0)}if(a=n.x*i,a!==0){const l=Math.floor(e.y+ht),d=Math.floor(e.y+t.h-ht),u=Math.floor(e.z-r+ht),c=Math.floor(e.z+r-ht),h=Dr(s,0,e.x-r,e.x+r,a,l,d,u,c);h===null?e.x+=a:(e.x=a>0?h-r-ht:h+1+r+ht,n.x=0,o.hitX=!0)}if(a=n.z*i,a!==0){const l=Math.floor(e.y+ht),d=Math.floor(e.y+t.h-ht),u=Math.floor(e.x-r+ht),c=Math.floor(e.x+r-ht),h=Dr(s,2,e.z-r,e.z+r,a,u,c,l,d);h===null?e.z+=a:(e.z=a>0?h-r-ht:h+1+r+ht,n.z=0,o.hitZ=!0)}}const mo={onGround:!1,hitX:!1,hitY:!1,hitZ:!1,hitCeiling:!1};function mf(s,e,t,n,i,o,r,a=1){if(r<=0||i===0&&o===0)return null;const l={x:e.x,y:e.y,z:e.z},d={x:0,y:a/r,z:0};if(Zo(s,l,n,d,r,mo),l.y-e.y<a-.05)return null;d.x=i,d.y=0,d.z=o,Zo(s,l,n,d,r,mo);const u=(l.x-e.x)**2+(l.z-e.z)**2,c=(t.x-e.x)**2+(t.z-e.z)**2;if(u<=c+1e-9)return null;const h=d.x,f=d.z;if(d.x=0,d.y=-(a+.05)/r,d.z=0,Zo(s,l,n,d,r,mo),!mo.onGround||l.y<=e.y+1e-4)return null;const _=l.y-e.y;return t.x=l.x,t.y=l.y,t.z=l.z,{dy:_,vx:h,vz:f}}function Lr(s,e,t,n=.05){const i=t.w/2,o=Math.floor(e.y-n),r=Math.floor(e.x-i+ht),a=Math.floor(e.x+i-ht),l=Math.floor(e.z-i+ht),d=Math.floor(e.z+i-ht);for(let u=l;u<=d;u++)for(let c=r;c<=a;c++)if(s(c,o,u))return!0;return!1}const dn=15,gs=240;function Vd(s){return s>>4}function Gd(s){return s&15}const xn=0,qi=1,go=3,Ps=()=>performance.now();class gf{constructor(e,t){this.world=e,this.sx=e.sizeX,this.sy=e.sizeY,this.sz=e.sizeZ,this.strideY=this.sx*this.sz;const n=this.sx*this.sy*this.sz;this.light=new Uint8Array(n),this.cells=new Uint8Array(n),this.table=new Uint8Array(t.count);for(const i of t.defs)this.table[i.num]=Math.min(dn,i.lightEmit)<<4|Math.min(dn,i.lightFilter)}world;light;cells;table;sx;sy;sz;strideY;pending=new Set;changedChunks=new Map;tracking=!1;changedCells=0;buckets=Array.from({length:dn+1},()=>[]);stats={initialMs:0,lastFlushMs:0,lastFlushCells:0};index(e,t,n){return t*this.strideY+n*this.sx+e}get(e,t,n){return this.world.inBounds(e,t,n)?this.light[this.index(e,t,n)]:gs}skyAt(e,t,n){return Vd(this.get(e,t,n))}blockAt(e,t,n){return Gd(this.get(e,t,n))}computeAll(e=!1){const t=Ps();this.light.fill(0),this.fillCells(),this.tracking=!1,this.pending.clear();const{sx:n,sy:i,sz:o,cells:r,light:a,buckets:l,strideY:d}=this;if(e){const u=(i-1)*d;for(let c=0;c<o;c++)for(let h=0;h<n;h++){const f=u+c*n+h,_=this.fromSkyAbove(r[f]&15);_>0&&(a[f]=_<<4,l[_].push(f))}}else{const u=new Int32Array(n*o);for(let c=0;c<o;c++)for(let h=0;h<n;h++){let f=i-1,_=f*d+c*n+h;for(;f>=0&&(r[_]&15)===0;)a[_]=dn<<4,f--,_-=d;u[c*n+h]=f}for(let c=0;c<o;c++)for(let h=0;h<n;h++){const f=u[c*n+h],_=c*n+h;if(f===i-1){const p=this.fromSkyAbove(r[f*d+_]&15);p>0&&(a[f*d+_]=a[f*d+_]&15|p<<4,l[p].push(f*d+_));continue}l[dn].push((f+1)*d+_);const g=p=>{for(let m=f+2;m<=p;m++)l[dn].push(m*d+_)};h>0&&g(u[_-1]),h<n-1&&g(u[_+1]),c>0&&g(u[_-n]),c<o-1&&g(u[_+n])}}this.propagate(xn);for(let u=0;u<r.length;u++){const c=r[u]>>4;c!==0&&(a[u]=a[u]&240|c,l[c].push(u))}this.propagate(qi),this.stats.initialMs=Ps()-t}fromSkyAbove(e){return e===0?dn:dn-Math.max(1,e)}fillCells(){const{cells:e,table:t}=this;e.fill(0),this.world.forEachChunk(n=>{const i=n.cx<<4,o=n.cy<<4,r=n.cz<<4,{data:a,palette:l}=n;let d=0;for(let u=0;u<Tt;u++)for(let c=0;c<Tt;c++){let h=this.index(i,o+u,r+c);for(let f=0;f<Tt;f++,h++,d++)e[h]=t[l[a[d]]]}})}markChanged(e,t,n){this.world.inBounds(e,t,n)&&this.pending.add(this.index(e,t,n))}get pendingCount(){return this.pending.size}flush(){if(this.pending.size===0)return[];const e=Ps(),{cells:t,table:n,light:i,buckets:o}=this,r=[],a=[];for(const _ of this.pending){const g=_%this.sx,p=(_-g)/this.sx,m=p%this.sz,M=(p-m)/this.sz,w=n[this.world.getBlock(g,M,m)]??0;w!==t[_]&&(r.push(_),a.push(w))}if(this.pending.clear(),r.length===0)return this.stats.lastFlushMs=Ps()-e,this.stats.lastFlushCells=0,[];this.tracking=!0,this.changedChunks.clear(),this.changedCells=0;const l=[],d=[];for(let _=0;_<r.length;_++){const g=r[_],p=t[g],m=a[_],M=(m&15)>(p&15);M&&l.push(g),(M||m>>4<p>>4)&&d.push(g)}const u=this.remove(xn,l),c=this.remove(qi,d);for(let _=0;_<r.length;_++)t[r[_]]=a[_];const h=(_,g)=>{const p=_===xn?i[g]>>4:i[g]&15;p>0&&o[p].push(g)},f=(_,g,p,m,M)=>{h(_,g),p>0&&h(_,g-1),p<this.sx-1&&h(_,g+1),M>0&&h(_,g-this.sx),M<this.sz-1&&h(_,g+this.sx),m>0&&h(_,g-this.strideY),m<this.sy-1&&h(_,g+this.strideY)};for(const _ of u)h(xn,_);for(let _=0;_<r.length;_++){const g=r[_],p=g%this.sx,m=(g-p)/this.sx,M=m%this.sz,w=(m-M)/this.sz;if(w===this.sy-1){const b=this.fromSkyAbove(a[_]&15);b>i[g]>>4&&(i[g]=i[g]&15|b<<4,this.mark(p,w,M))}f(xn,g,p,w,M)}this.propagate(xn);for(const _ of c)h(qi,_);for(let _=0;_<r.length;_++){const g=r[_],p=g%this.sx,m=(g-p)/this.sx,M=m%this.sz,w=(m-M)/this.sz,b=a[_]>>4;b>(i[g]&15)&&(i[g]=i[g]&240|b,this.mark(p,w,M)),f(qi,g,p,w,M)}return this.propagate(qi),this.tracking=!1,this.stats.lastFlushMs=Ps()-e,this.stats.lastFlushCells=this.changedCells,[...this.changedChunks.values()]}remove(e,t){const n=[];if(t.length===0)return n;const{light:i,cells:o,sx:r,sy:a,sz:l,strideY:d}=this,u=[],c=g=>e===xn?i[g]>>4:i[g]&15,h=g=>{i[g]=e===xn?i[g]&15:i[g]&240},f=[];for(const g of t){const p=c(g);if(p===0)continue;h(g),u.push(g,p);const m=g%r,M=(g-m)/r,w=M%l;this.mark(m,(M-w)/l,w)}const _=(g,p,m,M,w,b)=>{const R=c(g);R!==0&&(R<p||e===xn&&m===go&&p===dn&&R===dn?(h(g),this.mark(M,w,b),u.push(g,R),e===qi&&o[g]>>4>0&&f.push(g)):n.push(g))};for(;u.length;){const g=u.pop(),p=u.pop(),m=p%r,M=(p-m)/r,w=M%l,b=(M-w)/l;m>0&&_(p-1,g,0,m-1,b,w),m<r-1&&_(p+1,g,1,m+1,b,w),b<a-1&&_(p+d,g,2,m,b+1,w),b>0&&_(p-d,g,go,m,b-1,w),w>0&&_(p-r,g,4,m,b,w-1),w<l-1&&_(p+r,g,5,m,b,w+1)}for(const g of f){const p=o[g]>>4;p>(i[g]&15)&&(i[g]=i[g]&240|p),n.push(g)}return n}propagate(e){const{light:t,cells:n,sx:i,sy:o,sz:r,strideY:a,buckets:l}=this,d=u=>e===xn?t[u]>>4:t[u]&15;for(let u=dn;u>=1;u--){const c=l[u];for(;c.length;){const h=c.pop();if(d(h)!==u)continue;const f=h%i,_=(h-f)/i,g=_%r,p=(_-g)/r,m=(M,w,b,R,v)=>{const S=n[M]&15;let C;e===xn&&w===go&&u===dn&&S===0?C=dn:C=u-(S>1?S:1),!(C<=0||C<=d(M))&&(t[M]=e===xn?t[M]&15|C<<4:t[M]&240|C,this.tracking&&this.mark(b,R,v),l[C].push(M))};f>0&&m(h-1,0,f-1,p,g),f<i-1&&m(h+1,1,f+1,p,g),p<o-1&&m(h+a,2,f,p+1,g),p>0&&m(h-a,go,f,p-1,g),g>0&&m(h-i,4,f,p,g-1),g<r-1&&m(h+i,5,f,p,g+1)}}}mark(e,t,n){if(!this.tracking)return;this.changedCells++;const i=e>>4,o=t>>4,r=n>>4,a=e&15,l=t&15,d=n&15,u=a===0?-1:0,c=a===15?1:0,h=l===0?-1:0,f=l===15?1:0,_=d===0?-1:0,g=d===15?1:0;for(let p=u;p<=c;p++)for(let m=h;m<=f;m++)for(let M=_;M<=g;M++){const w=i+p,b=o+m,R=r+M;if(!this.world.chunkInBounds(w,b,R))continue;const v=Jo(w,b,R);this.changedChunks.has(v)||this.changedChunks.set(v,{cx:w,cy:b,cz:R})}}buildPaddedLight(e,t,n,i){const o=i??new Uint8Array(Pd),{sx:r,sy:a,sz:l,light:d}=this,u=e<<4,c=t<<4,h=n<<4;let f=0;for(let _=-1;_<=Tt;_++){const g=c+_,p=g>=0&&g<a;for(let m=-1;m<=Tt;m++){const M=h+m,w=p&&M>=0&&M<l,b=g*this.strideY+M*r;for(let R=-1;R<=Tt;R++,f++){const v=u+R;o[f]=w&&v>=0&&v<r?d[b+v]:gs}}}return o}}const Hd={island:(s,e,t)=>{const n=Oh(s,e,t);return{world:n.world,spawn:n.spawn,portal:n.layout.portal,treasures:n.layout.treasures,den:null,genVersion:zh,ms:n.ms}},cave:(s,e,t)=>{const n=Bh(s,e,t);return{world:n.world,spawn:n.spawn,portal:n.layout.portal,treasures:n.layout.treasures,den:n.layout.den,genVersion:Fh,ms:n.ms}}};function _f(s){return Object.hasOwn(Hd,s)}function vf(s,e,t){const n=Hd[s.generator];if(!n)throw new Error(`원정지 생성기 '${s.generator}' 는 아직 없어요`);return n(e,t,s.treasures)}const xf="블록 목록. 아들이 숫자를 바꿔도 돼. hardness = 부수는 데 걸리는 초(맨손). tool = 필요한 도구 종류(없으면 null). drops = 부수면 나오는 아이템(없으면 자기 자신). lightEmit = 빛 세기 0~15 (횃불 14, 발광석·용암 15). lightFilter = 빛을 얼마나 막는지 0~15 (안 적으면 자동: 불투명 블록 15, 물 1, 유리·공기 0. 나뭇잎·얼음은 1로 적어 둠). texture = textures/ 폴더의 파일 이름(확장자 없이). 면마다 다르면 textureTop/textureSide/textureBottom. 광물(에메랄드·청금석·석영·레드스톤·고대 잔해), 흑요석 규칙, 장식·건축 블록은 아들 3차 디테일(2026-09-12) 반영. shape = 특수 형태 블록(계단·문·울타리 등, 모델은 M4에서). fluid = 액체 종류(water 또는 lava): 벽이 없으면 옆으로 퍼지고 아래로 흐른다.",Af=[{id:"air",name:"공기",solid:!1,transparent:!0},{id:"bedrock",name:"기반암",tool:null,lightEmit:0,texture:"bedrock",_note:"세계 맨 아래 한 겹. hardness 가 없으면 부술 수 없는 블록이야"},{id:"stone",name:"돌",hardness:1.5,tool:"pickaxe",drops:"cobblestone",lightEmit:0,texture:"stone"},{id:"cobblestone",name:"조약돌",hardness:2,tool:"pickaxe",lightEmit:0,texture:"cobblestone"},{id:"dirt",name:"흙",hardness:.5,tool:null,lightEmit:0,texture:"dirt"},{id:"farmland",name:"농지",hardness:.6,tool:null,drops:"dirt",lightEmit:0,texture:"farmland",_note:"밭의 갈아 놓은 흙. 마을 터 생성기(M1)가 큰 밭에 깐다. 씨앗 심기·작물은 M4"},{id:"grass",name:"잔디",hardness:.6,tool:null,drops:"dirt",lightEmit:0,textureTop:"grass_top",textureSide:"grass_side",textureBottom:"dirt"},{id:"sand",name:"모래",hardness:.5,tool:null,lightEmit:0,texture:"sand"},{id:"gravel",name:"자갈",hardness:.6,tool:null,lightEmit:0,texture:"gravel"},{id:"log",name:"원목",hardness:2,tool:"axe",lightEmit:0,textureTop:"log_top",textureSide:"log_side",textureBottom:"log_top"},{id:"planks",name:"판자",hardness:2,tool:"axe",lightEmit:0,texture:"planks"},{id:"leaves",name:"나뭇잎",bonusDrops:"sapling",bonusCount:[0,1],_saplingNote:"나뭇잎을 부수면 묘목이 덤으로 0~1개 (아들: 확률 드롭). 나무 드래곤 알 재료",hardness:.2,tool:null,transparent:!0,lightEmit:0,lightFilter:1,texture:"leaves",shearDrops:["stick","sapling","apple"],_note:"아들 7차: 가위로 자르면 막대기나 그 나무 묘목이 나오고, 참나무에서는 사과도. 맨손으로 부수면 사라짐 (M4 아이템 드롭)"},{id:"glass",name:"유리",hardness:.3,tool:null,transparent:!0,_note:"마인크래프트는 유리를 깨면 사라지지만 여기서는 유리로 돌아온다(아빠 2026-09-19, 결정 #70 — 실크 터치 없음)",lightEmit:0,texture:"glass"},{id:"water",name:"물",solid:!1,transparent:!0,fluid:"water",lightEmit:0,texture:"water"},{id:"torch",name:"횃불",hardness:0,tool:null,solid:!1,lightEmit:14,shape:"torch",texture:"torch",_note:"shape torch: 네모 덩어리가 아니라 2/16 굵기 막대로 그린다. 벽에 붙이면 기울어진다 (결정 #82). 벽 변형 torch@n/e/s/w 는 코드가 만든다"},{id:"coal_ore",name:"석탄 광석",hardness:3,tool:"pickaxe",toolTier:1,drops:"coal",lightEmit:0,texture:"coal_ore"},{id:"iron_ore",name:"철 광석",hardness:3,tool:"pickaxe",toolTier:1,lightEmit:0,texture:"iron_ore"},{id:"gold_ore",name:"금 광석",hardness:3,tool:"pickaxe",toolTier:2,lightEmit:0,texture:"gold_ore"},{id:"diamond_ore",name:"다이아몬드 광석",hardness:3,tool:"pickaxe",toolTier:2,drops:"diamond",lightEmit:0,texture:"diamond_ore"},{id:"netherrack",name:"네더랙",hardness:.4,tool:"pickaxe",lightEmit:0,texture:"netherrack"},{id:"lava",name:"용암",solid:!1,transparent:!1,fluid:"lava",lightEmit:15,damage:4,texture:"lava"},{id:"glowstone",name:"발광석",hardness:.3,tool:null,bonusDrops:"glowstone_dust",bonusCount:[0,3],_note:"캐면 발광석 블록 1개가 들어오고, 덤으로 발광석 가루 0~3개(bonusCount, 아빠 2026-09-19 — 아들 9차 '가루 2~4개'를 블록 + 덤으로 바꿈). 가루는 물약 단계 올리기 재료(potions.json). 개수 뽑기는 서버가 시드 PRNG 로",lightEmit:15,texture:"glowstone"},{id:"snow",name:"눈",hardness:.2,tool:null,lightEmit:0,texture:"snow"},{id:"ice",name:"얼음",hardness:.5,tool:"pickaxe",transparent:!0,lightEmit:0,lightFilter:1,texture:"ice",_note:"아들 7차: 물은 눈 바이옴(설원)에서 얼음으로 언다. 설원 원정지 생성기(M3)에서 물 표면을 얼음으로"},{id:"end_stone",name:"엔드 돌",hardness:3,tool:"pickaxe",toolTier:1,lightEmit:0,texture:"end_stone"},{id:"emerald_ore",name:"에메랄드 광석",hardness:3,tool:"pickaxe",toolTier:2,drops:"emerald",lightEmit:0,texture:"emerald_ore"},{id:"lapis_ore",name:"청금석 광석",hardness:3,tool:"pickaxe",toolTier:1,drops:"lapis",lightEmit:0,texture:"lapis_ore",_note:"인챈트에 필요 (아들)"},{id:"nether_quartz_ore",name:"석영 광석",hardness:3,tool:"pickaxe",toolTier:1,drops:"quartz",lightEmit:0,texture:"quartz_ore"},{id:"redstone_ore",name:"레드스톤 광석",hardness:3,tool:"pickaxe",toolTier:2,drops:"redstone",lightEmit:0,texture:"redstone_ore"},{id:"ancient_debris",name:"고대 잔해",hardness:30,tool:"pickaxe",toolTier:2,lightEmit:0,texture:"ancient_debris"},{id:"obsidian",name:"흑요석",hardness:50,tool:"pickaxe",toolTier:3,lightEmit:0,texture:"obsidian",_note:"용암 블록에 물 양동이를 부으면 생성. 다이아 곡괭이(티어3)로만 캔다 (아들)"},{id:"dragon_egg",name:"드래곤 알",tool:null,lightEmit:4,transparent:!0,shape:"egg",texture:"dragon_egg",_note:"둥지 자리에 놓인 알 (M6-2). hardness 가 없어 못 부순다. 부화하면 사라진다. 아이템은 dragon_egg.<드래곤 id>(제작대에서 재료로 만든다)"},{id:"hay_bale",name:"건초 더미",hardness:.5,tool:null,lightEmit:0,texture:"hay_bale"},{id:"bookshelf",name:"책장",hardness:1.5,tool:"axe",_note:"캐면 책장 그대로(결정 #70). 마인크래프트의 책 3개 드롭은 안 씀",lightEmit:0,texture:"bookshelf"},{id:"enchanting_table",name:"인챈트 테이블",hardness:5,tool:"pickaxe",lightEmit:7,texture:"enchanting_table",release:"v1.1"},{id:"cactus",name:"선인장",hardness:.4,tool:null,damage:1,lightEmit:0,texture:"cactus"},{id:"sugar_cane",name:"사탕수수",hardness:0,tool:null,solid:!1,lightEmit:0,texture:"sugar_cane",_note:"물가에서 자란다"},{id:"pumpkin",name:"호박",hardness:1,tool:"axe",lightEmit:0,texture:"pumpkin"},{id:"carved_pumpkin",name:"조각된 호박",hardness:1,tool:"axe",lightEmit:0,texture:"carved_pumpkin"},{id:"jack_o_lantern",name:"잭오랜턴",hardness:1,tool:"axe",lightEmit:15,texture:"jack_o_lantern"},{id:"melon",name:"수박",hardness:1,tool:"axe",lightEmit:0,texture:"melon"},{id:"iron_block",name:"철 블록",hardness:5,tool:"pickaxe",toolTier:1,lightEmit:0,texture:"iron_block"},{id:"gold_block",name:"금 블록",hardness:3,tool:"pickaxe",toolTier:2,lightEmit:0,texture:"gold_block"},{id:"quartz_block",name:"석영 블록",hardness:.8,tool:"pickaxe",lightEmit:0,texture:"quartz_block"},{id:"netherite_block",name:"네더라이트 블록",hardness:50,tool:"pickaxe",toolTier:3,lightEmit:0,texture:"netherite_block"},{id:"emerald_block",name:"에메랄드 블록",hardness:5,tool:"pickaxe",toolTier:2,lightEmit:0,texture:"emerald_block"},{id:"diamond_block",name:"다이아몬드 블록",hardness:5,tool:"pickaxe",toolTier:2,lightEmit:0,texture:"diamond_block"},{id:"oak_stairs",name:"계단",hardness:2,tool:"axe",lightEmit:0,texture:"planks",shape:"stairs"},{id:"oak_door",name:"문",hardness:3,tool:"axe",lightEmit:0,transparent:!0,textureTop:"door_top",textureSide:"door_bottom",textureBottom:"door_bottom",shape:"door",_note:"문은 두 칸(아래·위). textureTop = 윗칸 그림(창문), textureBottom = 아랫칸 그림(판·손잡이). 탭하면 열리고 닫힌다(결정 #71). 그림은 아빠가 보낸 참나무 문(2026-09-19)"},{id:"oak_trapdoor",name:"다락문",hardness:3,tool:"axe",lightEmit:0,texture:"trapdoor",shape:"trapdoor"},{id:"oak_fence",name:"울타리",hardness:2,tool:"axe",lightEmit:0,texture:"planks",shape:"fence"},{id:"sign",name:"표지판",hardness:1,tool:"axe",solid:!1,lightEmit:0,texture:"sign",shape:"sign"},{id:"bed",name:"침대",hardness:.2,tool:null,lightEmit:0,texture:"bed",shape:"bed",_note:"네더·엔드에서 클릭 시 폭발"},{id:"chest",name:"상자",hardness:2.5,tool:"axe",lightEmit:0,textureTop:"chest_top",textureSide:"chest_side",textureBottom:"chest_top",shape:"chest"},{id:"furnace",name:"화로",hardness:3.5,tool:"pickaxe",lightEmit:0,texture:"furnace"},{id:"crafting_table",name:"제작대",hardness:2.5,tool:"axe",textureTop:"crafting_table_top",textureSide:"crafting_table_side",textureBottom:"planks",_note:"M4: 판자 4개로 만들어 놓는다. 5칸 안에 있으면 레시피를 만들 수 있다. 그림은 아들 스케치(2026-09-19, 위 3×3 격자·옆 세로 판자 + 도구)를 코드로 옮긴 것 — 아들이 직접 그린 PNG 로 덮어써도 된다"},{id:"brewing_stand",name:"양조기",hardness:.5,tool:null,lightEmit:1,texture:"brewing_stand"},{id:"soul_sand",name:"영혼 모래",hardness:.5,tool:null,lightEmit:0,texture:"soul_sand"},{id:"warped_fungus",name:"뒤틀린 균",hardness:0,tool:null,solid:!1,lightEmit:0,texture:"warped_fungus"},{id:"wool",name:"양털",hardness:.8,tool:null,lightEmit:0,texture:"wool",dyeable:!0,_note:"16색 염색 가능. 텍스처는 wool_<color>"},{id:"flower",name:"꽃",hardness:0,tool:null,solid:!1,lightEmit:0,texture:"flower",variants:["poppy","dandelion","cornflower","allium","tulip_pink","oxeye_daisy"],_note:"부수면 색 염료 3개"},{id:"rail",name:"철도",hardness:.7,tool:null,solid:!1,lightEmit:0,texture:"rail",release:"v1.1"},{id:"mob_spawner",name:"몹 스포너",hardness:5,tool:"pickaxe",drops:null,lightEmit:0,texture:"spawner",release:"v1.1",_note:"캐면 경험치 15–43"},{id:"water_deep",name:"깊은 물",solid:!1,transparent:!0,fluid:"water",lightEmit:0,texture:"water",_note:"심해 — 발광 오징어 서식"},{id:"dried_ghast",name:"마른 가스트",hardness:.5,tool:null,lightEmit:0,texture:"dried_ghast",release:"v1.2",_note:"네더 바닥에 있다. 캐서 물에 불리면 해피 가스트가 된다 (아들 6차). 해피 가스트 탑승은 v1.2"}],bf={_comment:xf,blocks:Af},yf="전투 장비 — 갑옷·방패·활·화살 (아빠 2026-09-24, 마인크래프트 값. 나무위키 '마인크래프트/아이템/전투'). 갑옷 조각 id 는 '등급_부위' (leather_helmet, iron_chestplate…)로 자동으로 만들어지고 제작법(recipes)도 여기서 자동으로 나온다 — recipes.json 에 적지 않는다. defense = 방어(흉갑 반 칸 = 1). toughness = 방어 강도(다이아몬드 2·네더라이트 3, 큰 피해를 더 잘 막는다). knockbackResist = 밀려남 줄이기(네더라이트만, 아직 안 씀). durability = 내구도(아직 안 닳는다, 도구와 함께 나중에). pieces = 그 부위를 만들 때 드는 재료 수(투구 5·흉갑 8·레깅스 7·부츠 4). station = 어디서 만드나(가죽은 제작대, 금속·다이아몬드는 대장간 — 검과 같은 규칙 #102). upgradeFrom = 네더라이트는 다이아몬드 조각 + 네더라이트 1 (대장장이 형판은 생략). 사슬 갑옷은 마인크래프트에도 제작법이 없어 v1.1(거래·드롭). 피해 계산식은 shared/rules/combat.ts reduceDamage — 마인크래프트 그대로.",Mf={slots:{helmet:{name:"투구",pieces:5},chestplate:{name:"흉갑",pieces:8},leggings:{name:"레깅스",pieces:7},boots:{name:"부츠",pieces:4}},tiers:[{id:"leather",name:"가죽",material:"leather",station:"crafting_table",defense:{helmet:1,chestplate:3,leggings:2,boots:1},toughness:0,knockbackResist:0,durability:{helmet:55,chestplate:80,leggings:75,boots:65},pieceNames:{helmet:"가죽 모자",chestplate:"가죽 조끼",leggings:"가죽 바지",boots:"가죽 장화"},_note:"가죽은 소·원정 보물 상자에서. 풀세트 방어 7 (28%)"},{id:"iron",name:"철",material:"iron_ingot",station:"forge",defense:{helmet:2,chestplate:6,leggings:5,boots:2},toughness:0,knockbackResist:0,durability:{helmet:165,chestplate:240,leggings:225,boots:195},_note:"풀세트 방어 15 (60%). 철 주괴 24개"},{id:"golden",name:"황금",material:"gold_ingot",station:"forge",defense:{helmet:1,chestplate:5,leggings:3,boots:1},toughness:0,knockbackResist:0,durability:{helmet:77,chestplate:112,leggings:105,boots:91},_note:"풀세트 방어 11 (44%). 예쁘지만 철보다 약하다"},{id:"diamond",name:"다이아몬드",material:"diamond",station:"forge",defense:{helmet:3,chestplate:8,leggings:6,boots:3},toughness:2,knockbackResist:0,durability:{helmet:363,chestplate:528,leggings:495,boots:429},_note:"풀세트 방어 20 (80%) + 강도 8. 다이아몬드 24개"},{id:"netherite",name:"네더라이트",material:"netherite",station:"forge",upgradeFrom:"diamond",defense:{helmet:3,chestplate:8,leggings:6,boots:3},toughness:3,knockbackResist:.1,durability:{helmet:407,chestplate:592,leggings:555,boots:481},_note:"다이아몬드 조각 1 + 네더라이트 1. 네더라이트는 네더 원정지(v1.1)라 지금은 못 만든다"}],extra:[{id:"turtle_helmet",name:"거북 등딱지",slot:"helmet",defense:2,toughness:0,station:"crafting_table",in:{scute:5},_note:"철 투구와 같은 방어. 물속 호흡은 아직 없음"}]},Ef={id:"shield",name:"방패",station:"crafting_table",in:{planks:6,iron_ingot:1},meleeBlock:.5,arrowBlock:1,guardBlock:1,guardSlow:.5,ignoredBy:["vindicator"],_note:"방패 칸에 끼우면(아빠 결정 #107) 몹의 근접·폭발 피해 절반(meleeBlock), 약탈자 화살은 전부(arrowBlock). 🛡️ 막기 버튼(PC X 키)을 누르는 동안은 guardBlock 만큼(1 = 전부) 막고 걸음이 guardSlow 배로 느려진다(#118, 아빠 2026-09-28). 변명자 도끼는 막아도 뚫는다(마인크래프트: 도끼가 방패를 무력화)"},Sf=[{id:"bow",name:"활",station:"crafting_table",in:{stick:3,string:3},damage:6,cooldownMs:300,drawMs:1e3,range:24,_note:"몹을 노리고 누르고 있으면 활시위를 당기고(drawMs 에 가득), 놓으면 쏜다(#119). 피해는 당긴 만큼 damage 의 30%~100% (짧게 탭 = 약한 화살). 24칸까지. 화살 1개"},{id:"crossbow",name:"쇠뇌",station:"forge",in:{stick:3,string:2,iron_ingot:1},damage:9,cooldownMs:300,drawMs:1250,range:28,_note:"철사 덫 갈고리는 아직 없어 뺐다. 활보다 세고 당기는 데 오래 걸린다 (drawMs)"}],wf={id:"arrow",name:"화살",station:"inventory",in:{flint:1,stick:1,feather:1},out:4,_note:"부싯돌(자갈)·막대기·깃털(닭). 스켈레톤도 떨어뜨린다"},Tf={_comment:"만들지 않은 것과 이유 — 버전 배치",chainmail:"사슬 갑옷: 마인크래프트에도 제작법 없음 → v1.1 주민 거래·드롭",spear:"창: 돌진 피해·사거리 2~4.5 → v1.1",trident:"삼지창: 드라운드 드롭·던지기 → v1.1 (바다 원정지)",mace:"철퇴: 무거운 코어·브리즈 막대기(시련의 방) → v1.2",enchantments:"마법 부여(보호·날카로움·힘·무한…): v1.1 (CONTENT.md 검 메모)",horse_armor:"말 갑옷: 말과 함께 v1.1",wolf_armor:"늑대 갑옷: 아르마딜로 인갑 → v1.2",totem:"불사의 토템: bosses.json 소환사 드롭 그대로, 효과는 v1.1",wind_charge:"돌풍구: 브리즈 → v1.2",tipped_arrows:"물약 화살·분광 화살: v1.1"},Cf={_comment:yf,armor:Mf,shield:Ef,bows:Sf,arrow:wf,later:Tf},Rf="펫(길들인 강아지) 이름 목록 — 여기 있는 이름만 붙일 수 있다 (규칙 3: 자유 입력 없음, 결정 #109). 아들이 마음대로 넣고 빼도 된다. 1~6글자, 같은 이름 여러 마리 가능. 아빠가 2026-09-25 에 먼저 30개를 채웠다.",kf=["초코","콩이","보리","구름","별이","달이","호두","두부","감자","몽이","뭉치","복실이","코코","라떼","마루","해피","바둑이","누렁이","까망이","하늘이","번개","용감이","깜찍이","방울이","솜이","쿠키","젤리","땅콩","단추","바람"],Df={_comment:Rf,names:kf},Lf="마을 건물. cost = 공유 창고에서 빠지는 재료. unlocks = 이 건물이 열어주는 것. footprint = 마을에 실제 블록 구조물로 서는 크기(가로×세로×높이). 아빠 임시안 — 아들 답변(질문 14: 드래곤 둥지)과 M6에서 확정.",Pf=[{id:"crafting_table",name:"제작대",level:1,cost:{planks:8},footprint:[3,3,3],unlocks:["recipes:basic"]},{id:"storage",name:"창고",level:1,cost:{planks:24,cobblestone:16},footprint:[5,5,4],unlocks:["storage:+200"]},{id:"forge",name:"대장간",level:2,cost:{cobblestone:40,coal:10,iron_ore:5},footprint:[5,5,4],unlocks:["tools:stone","tools:iron"]},{id:"farm",name:"농장",level:2,cost:{planks:16,dirt:32},footprint:[7,7,2],unlocks:["food"]},{id:"lighthouse",name:"등대",level:3,cost:{cobblestone:60,glass:12,glowstone:4},footprint:[3,3,12],unlocks:["village:flag_2"]},{id:"dragon_nest_1",name:"드래곤 둥지",level:1,cost:{cobblestone:30,log:20},footprint:[7,7,6],unlocks:["dragons:hold_4"],_note:"마을이 커지면 둥지도 커진다 (아들 답변 14). 단계별로 수용 드래곤 수와 크기 증가"},{id:"dragon_nest_2",name:"큰 둥지",level:3,cost:{cobblestone:80,log:40,iron_ingot:10},footprint:[11,11,8],unlocks:["dragons:hold_10"],requires:"dragon_nest_1"},{id:"dragon_nest_3",name:"드래곤 성",level:5,cost:{stone:200,gold_ingot:20,diamond:4},footprint:[15,15,12],unlocks:["dragons:hold_16"],requires:"dragon_nest_2"},{id:"brewing_stand",name:"양조기",level:3,cost:{cobblestone:3,blaze_rod:1},footprint:[3,3,3],unlocks:["recipes:brewing"],_note:"치유의 물약 제작"},{id:"portal_1",name:"포탈 1단계",level:1,cost:{},footprint:[7,7,5],unlocks:["expedition:grass_island"],_comment:"마을 생성 시 기본 제공"},{id:"portal_2",name:"포탈 2단계",level:2,cost:{cobblestone:50,iron_ore:10},footprint:[7,7,5],unlocks:["expedition:desert","expedition:cave"]},{id:"portal_3",name:"포탈 3단계",level:3,cost:{cobblestone:80,gold_ore:10,diamond:2},footprint:[7,7,5],unlocks:["expedition:snowfield"]},{id:"portal_4",name:"포탈 4단계",level:4,cost:{diamond:5,gold_ore:20,glowstone:8},footprint:[7,7,5],unlocks:["expedition:nether"]},{id:"portal_5",name:"포탈 5단계",level:5,cost:{diamond:10,blaze_powder:6,ghast_tear:2},footprint:[7,7,5],unlocks:["expedition:the_end"]},{id:"portal_6",name:"포탈 6단계 — 고대성",level:6,cost:{dragon_breath:1,netherite:2,echo_shard:4},footprint:[7,7,5],unlocks:["expedition:ancient_castle"],release:"v1.2",_note:"네 왕의 고대성. 엔딩 원정"}],If={_comment:Lf,buildings:Pf},Uf="보스 몹 — 아들 설계(2026-09-12), 드롭·네 왕 전투·방어전 답변(2026-09-13). 중간 보스 5 + 최종 보스 2군(엔더 드래곤, 네 왕). 공통점: 모두 우리 마을을 차지하고 싶어한다 → 마을 방어전(raids) 시스템의 근거. drops 의 개수는 아들이 정한 그대로(결정 21: 개수는 아들, 난이도는 출현율로). hp·xp 는 아빠 임시값. release = 어느 버전에 넣나(v1 / v1.1 / v1.2). 상세는 docs/BOSSES.md.",Nf="모두 우리 마을을 차지하고 싶어한다",Bf=[{id:"giant_ghast",name:"초거대 가스트",sonDescription:"네더에 살고, 큰 화염을 쏜다. 아주아주 거대한 네더 요새에서 산다.",home:{expedition:"nether",structure:"giant_nether_fortress"},attacks:["big_fireball","summon_ghasts"],minions:["ghast"],hp:300,drops:[{material:"dried_ghast",name:"마른 가스트",count:5,chance:1},{material:"lava_bucket",name:"용암 양동이",count:2,chance:1},{material:"wooden_pickaxe",name:"나무 곡괭이",count:1,chance:1},{material:"stone_pickaxe",name:"돌 곡괭이",count:1,chance:1},{material:"iron_pickaxe",name:"철 곡괭이",count:1,chance:1},{material:"golden_pickaxe",name:"금 곡괭이",count:1,chance:1},{material:"diamond_pickaxe",name:"다이아 곡괭이",count:1,chance:1},{material:"netherite_pickaxe",name:"네더라이트 곡괭이",count:1,chance:1}],_dropsNote:"아들(2026-09-13). 곡괭이 6종 = 어스퀘이크 드래곤 재료 그대로 → 이 보스가 어스퀘이크 드래곤의 공급처. 아빠 메모: 화염 드래곤 재료(가스트의 눈물)도 떨구게 할지 아들과 확인",xp:100,release:"v1.1"},{id:"spider_king",name:"거미 왕",sonDescription:"왕관을 쓰고 있는 거미. 독거미이며, 거미 군단을 다스린다.",home:{expedition:"cave",structure:"spider_king_den"},attacks:["poison_bite","web_shot","summon_spiders"],minions:["spider","cave_spider"],hp:200,drops:[{material:"string",name:"실",count:64,chance:1},{material:"clock",name:"시계",count:5,chance:1},{material:"tnt",name:"TNT",count:64,chance:1},{material:"flint_and_steel",name:"라이터",count:1,chance:1}],_dropsNote:"아들(2026-09-13). 시계 5 = 타임 드래곤 재료(시계 4), TNT = 폭발 드래곤 재료 → 거미 왕이 두 드래곤의 공급처. 아빠 메모: 왕관(꾸미기 모자)도 주면 좋겠다 — 아들과 확인",xp:80,release:"v1",_why_v1:"동굴 원정지가 이미 있어 새 지형 없이 넣을 수 있는 첫 보스"},{id:"giant_warden",name:"거대 워든",sonDescription:"강력한 음파를 사용하고 맨손으로 내리치기도 한다. 워든 군대를 다스리기도 한다.",home:{expedition:"deep_dark",structure:"ancient_city"},attacks:["sonic_boom","smash","summon_wardens"],minions:["warden"],hp:500,drops:[{material:"ice",name:"얼음 블록",count:64,chance:1},{material:"netherite_sword",name:"네더라이트 칼",count:1,chance:1}],_dropsNote:"아들(2026-09-13). 얼음 = 아이스 드래곤 재료",xp:200,release:"v1.2"},{id:"evoker",name:"소환사 (우민 보스)",sonDescription:"우민들은 마을 옆 전초기지들과 삼림 대저택에서 온다. 보스는 소환사다. 소환사는 벡스 군단을 조종할 수 있고, 죽으면 4개의 HP를 더 주는 불사의 토템을 준다. 우민들은 파괴수를 타고 다닌다.",home:{expedition:"village_raid",structure:"pillager_outpost",alsoIn:{expedition:"dark_forest",structure:"woodland_mansion"}},attacks:["summon_vex","fangs"],minions:["pillager","vindicator","vex","ravager"],ravagerRiders:!0,hp:150,drops:[{material:"totem_of_undying",name:"불사의 토템",count:10,chance:1,_note:"죽을 때 HP 4를 더 준다(아들 설명). 소지 시 1회 사망 방지"}],minionDrops:{_comment:"아들(2026-09-13): 일반 우민은 가끔 도끼, 아니면 석궁. 파괴수는 익힌 파괴수 고기 3개. 벡스는 가끔 폭죽 2개. '가끔' = chance 0.3(아빠 임시)",pillager:[{material:"crossbow",name:"석궁",count:1,chance:.3}],vindicator:[{material:"iron_axe",name:"도끼",count:1,chance:.3}],ravager:[{material:"cooked_ravager_meat",name:"익힌 파괴수 고기",count:3,chance:1,_note:"아들 원문 '인 익힌' — 안 익힌(날것)인지 확인"}],vex:[{material:"firework_rocket",name:"폭죽",count:2,chance:.3}]},xp:100,release:"v1",_why_v1:"'마을 옆 전초기지에서 온다' → 새 원정지 없이 마을 방어전으로 구현 가능. '마을을 차지하려 한다'는 공통 서사의 첫 체험"},{id:"giant_gorilla",name:"거대 고릴라",sonDescription:"고릴라 군단을 가지고 있으며, 사치스러운 정글 궁궐에 산다. 화가 나면 닥치는 대로 죽이거나 부순다.",home:{expedition:"jungle",structure:"jungle_palace"},attacks:["ground_pound","throw_blocks","rage_mode"],rageMeter:!0,minions:["gorilla"],hp:400,drops:[{material:"raw_gorilla_meat",name:"안 익힌 고릴라 고기",count:10,chance:1},{material:"diamond",name:"다이아",count:64,chance:1},{material:"emerald",name:"에메랄드",count:64,chance:1},{material:"gold_ingot",name:"금",count:64,chance:1},{material:"iron_ingot",name:"철",count:64,chance:1},{material:"quartz",name:"석영",count:64,chance:1},{material:"netherite_ingot",name:"네더라이트",count:64,chance:1}],_dropsNote:"아들(2026-09-13). '사치스러운 궁궐'답게 보물 창고급. 아빠 메모: 개수는 아들 것 그대로 두고, 이 보스의 등장 횟수(v1.2, 주 1회 등)로 균형",xp:150,release:"v1.2"}],Ff=[{id:"ender_dragon",name:"엔더 드래곤",sonDescription:"엔드에 살고, 드래곤의 숨결을 바닥에 뿌리고 엔더맨들로 공격한다.",home:{expedition:"the_end",structure:"end_island"},attacks:["dragon_breath_pool","summon_endermen","charge"],minions:["enderman"],hp:200,drops:[{material:"dragon_egg",name:"드래곤 알",count:1,chance:1},{material:"dragon_breath",name:"드래곤의 숨결",count:null,chance:null,_note:"전투 중 바닥 숨결을 유리병으로 채집"}],_dropsNote:"아들(2026-09-13) 재확인: 드래곤 알",xp:500,release:"v1"},{id:"four_kings",name:"네 왕 — 거대화된 스켈레톤·크리퍼·엔더맨·좀비 왕",sonDescription:"엄청나게 거대화된 스켈레톤, 크리퍼, 엔더맨, 좀비 왕. 자신의 소형 버전 종족을 다스린다. 자신들의 첫 번째 왕들의 머리를 달고 있는 아주 거대한 고대성에 산다. 목표는 서버를 다스리는 것.",home:{expedition:"ancient_castle",structure:"ancient_castle"},kings:[{id:"skeleton_king",name:"스켈레톤 왕",minions:["skeleton","stray","wither_skeleton"],attacks:["arrow_rain","bone_wall"],hp:600,drops:[{material:"bone",name:"뼈",count:64,chance:1},{material:"bow",name:"활",count:1,chance:1},{material:"arrow",name:"화살",count:128,chance:1}],_dropsNote:"아들(2026-09-13). 아빠 메모: 폭발 드래곤 재료인 위더 스켈레톤 머리(일반 드롭 5%)의 안정 공급처가 필요하면 여기 3개 추가 — 아들과 확인",xp:300},{id:"creeper_king",name:"크리퍼 왕",minions:["creeper","charged_creeper"],attacks:["mega_explosion","creeper_swarm"],hp:600,drops:[{material:"gunpowder",name:"화약",count:64,chance:1},{material:"healing_potion",name:"치유의 물약",count:64,chance:1}],_dropsNote:"아들(2026-09-13). 치유의 물약 = 치유 드래곤 재료(6)",xp:300},{id:"enderman_king",name:"엔더맨 왕",minions:["enderman","endermite"],attacks:["teleport_strike","block_steal"],hp:600,drops:[{material:"ender_pearl",name:"엔더 진주",count:256,chance:1}],_dropsNote:"아들(2026-09-13). 엔더 진주 = 텔레포트 드래곤 재료(2)",xp:300},{id:"zombie_king",name:"좀비 왕",minions:["zombie","husk","zombie_villager"],attacks:["horde_call","rotten_grab"],hp:600,drops:[{material:"chicken",name:"닭고기",count:64,chance:1},{material:"milk_bucket",name:"우유",count:64,chance:1}],_dropsNote:"아들(2026-09-13)",xp:300}],battle:{order:"all_at_once",_orderNote:"아들(2026-09-13): 네 왕은 한 번에 싸운다. 고대성은 방 4개를 차례로 지나간다",rooms:[{id:"entrance",name:"입구",mobsPerKind:2,_note:"일반 몹 4종족(스켈레톤·크리퍼·엔더맨·좀비) 각 2마리"},{id:"early",name:"초반 방",mobsPerKind:8},{id:"middle",name:"중간 방",mobsPerKind:14},{id:"final",name:"최종 방",mobsPerKind:30,bosses:["skeleton_king","creeper_king","enderman_king","zombie_king"],_note:"보스 4마리 + 일반 몹 종족별 30마리"}],_dadNote:"6명 협동 기준 숫자. 인원이 적으면 서버가 mobsPerKind 를 비례 축소(아빠 임시 규칙)"},ending:{xp:300,title:"마을의 수호자",portalToNewDimension:!0,_note:"아들(2026-09-13): 네 왕을 다 잡으면 다른 차원으로 들어가는 포탈이 나온다. 그 차원은 v2 이후. 드래곤 16종 완성 300xp와 별개"},release:"v1.2"}],Of={_comment:"마을 방어전 — '모두 우리 마을을 차지하고 싶어한다'의 구현. 원정과 같은 시간 규칙을 따르는 10분 세션. 절대 강제 시작되지 않는다(아이 시간 규칙·원정 출발 조건 동일 적용).",trigger:"host_starts",warningInAdvance:!0,warningMethod:"bell",_warningNote:"아들(2026-09-13): 우민들이 오기 전에 마을 종을 친다",durationSec:600,minVillageLevel:2,maxPerWeek:2,waves:3,onFail:{villageDamaged:!1,bossPlantsFlag:!0,ironGolemCaptured:!0,villagersOutsideDie:!0,_note:"마을은 서버가 원상복구. 보스 깃발이 입구에 꽂히고 다음 승리 때 사라진다. 아들(2026-09-13) 추가: 철 골렘을 잡아가고, 싸우는 중에 집에 들어가지 못한 주민은 죽는다. 철 골렘·주민은 v1.1 이라 v1 방어전은 깃발만. 아빠 결정 필요: 주민 '죽음'을 영구로 할지, 잡혀간 뒤 다음 승리 때 돌아오게 할지('성장은 쌓이기만' 원칙)"},onWin:{lootToStorage:!0,guardianFlag:!0,xpEach:50},v1Raiders:["evoker"],laterRaiders:["spider_king","giant_ghast","giant_gorilla","giant_warden","four_kings"]},Wd={_comment:Uf,commonGoal:Nf,midBosses:Bf,finalBosses:Ff,raids:Of},zf="몹과 처치 보상 — 아들 4차 디테일(2026-09-12), 6·7차(2026-09-13). drops = [아이템, 개수 범위, 확률]. xp는 xp.json과 동일값 유지. 보스는 bosses.json. breedWith = 교배 먹이, followsWhenHolding = 이 아이템을 들고 있으면 야생·사육 동물이 쫓아온다(아들 7차, 모든 동물 공통).",Vf=[{id:"piglin",name:"피글린",release:"v1.1",habitat:"nether",home:"bastion",drops:[["gold_nugget",[0,1],.5]],xp:5,weapons:["golden_axe","golden_sword","crossbow"],enemy:"zombified_piglin",rides:"hoglin",friendlyIfWearing:"any_gold_armor",barter:{pay:"gold_ingot",gets:["obsidian","fire_resistance_potion","ender_pearl","misc"],_note:"금으로 거래. 흑요석·화염 저항 포션·엔더 진주 외에 잡다한 것들 (아들 6차)"},_note:"아들 6차(2026-09-13): 좀비 피글린과 전쟁하는 사이라 만날 때마다 금 도끼·금 칼·석궁으로 싸운다. 피글린 요새에 살고 호글린을 탄다(타거나 상자를 올리는 용도). 금 갑옷 4종 중 하나만 입어도 친구"},{id:"zombified_piglin",name:"좀비 피글린",release:"v1.1",habitat:"nether",drops:[["rotten_flesh",[0,1],1],["gold_nugget",[0,1],.3]],xp:5,weapons:["golden_axe","golden_sword","crossbow"],enemy:"piglin",rides:"zoglin",friendlyIfWearing:"any_gold_armor",_note:"아들 6차: 조글린을 타고 다닌다(용도는 호글린과 비슷). 금 갑옷 하나면 친구"},{id:"hoglin",name:"호글린",release:"v1.1",habitat:"nether",drops:[["porkchop",[2,4],1]],xp:5,riddenBy:"piglin",canCarryChest:!0,_note:"피글린이 타거나 상자를 올려 짐을 나른다 (아들 6차)"},{id:"zoglin",name:"조글린",release:"v1.1",habitat:"nether",drops:[["rotten_flesh",[1,3],1]],xp:5,riddenBy:"zombified_piglin",canCarryChest:!0},{id:"creeper",name:"크리퍼",drops:[["gunpowder",[0,2],1]],xp:5,_note:"TNT 재료"},{id:"zombie",name:"좀비",drops:[["rotten_flesh",[0,2],1],["iron_ingot",[1,1],.025],["carrot",[1,1],.025],["potato",[1,1],.025]],xp:5,_note:"아들: 썩은 살점, 확률적으로 철·당근·감자"},{id:"skeleton",name:"스켈레톤",drops:[["bone",[0,2],1],["arrow",[0,2],.5],["bow",[1,1],.085]],xp:5,_note:"아들: 뼈, 아주 낮은 확률로 활, 그보다 조금 높은 확률로 화살"},{id:"enderman",name:"엔더맨",drops:[["ender_pearl",[0,1],.5]],xp:5,_note:"확률적으로 엔더 진주 (텔레포트 드래곤 재료)"},{id:"spider",name:"거미",drops:[["string",[0,2],1],["spider_eye",[0,1],.33]],xp:5,_note:"거미줄 4개 = 양털 1개 가치 (아들)"},{id:"witch",name:"마녀",drops:[["glass_bottle",[0,2],.5],["redstone",[0,2],.3],["gunpowder",[0,2],.3]],xp:5,release:"v1.1"},{id:"blaze",name:"블레이즈",drops:[["blaze_rod",[0,1],.5]],xp:10},{id:"ghast",name:"가스트",drops:[["ghast_tear",[1,1],1],["gunpowder",[0,2],1]],xp:5},{id:"wither_skeleton",name:"위더 스켈레톤",drops:[["bone",[0,2],1],["coal",[0,1],.5],["wither_skeleton_skull",[1,1],.05]],xp:5}],Gf=[{id:"happy_ghast",name:"해피 가스트",release:"v1.2",habitat:"nether",madeFrom:{block:"dried_ghast",soakIn:"water"},rideable:!0,fireBreathOnCommand:!0,drops:[],xp:0,_note:"아들 6차(2026-09-13): 네더 바닥의 마른 가스트를 캐서 물에 불리면 해피 가스트가 되고, 타고 다니며 불을 뿜게 할 수 있다. 날아다니는 탈것이라 드래곤 탑승(v1) 다음인 v1.2"},{id:"horse",name:"말",release:"v1.1",rideWith:"saddle",drops:[["leather",[0,2],1]],xp:1,_note:"아들 7차: 말에 안장을 씌우면 탈 수 있다. 탈것 시스템(v1.1)과 함께"},{id:"cow",name:"소",breedWith:"wheat",followsWhenHolding:"wheat",drops:[["leather",[0,2],1],["beef",[1,3],1]],interact:"milk_bucket"},{id:"sheep",name:"양",breedWith:"wheat",followsWhenHolding:"wheat",drops:[["wool",[1,1],1],["mutton",[1,2],1]],interact:"shears→wool 1–3",dyeable:!0},{id:"chicken",name:"닭",breedWith:"wheat_seeds",followsWhenHolding:"wheat_seeds",eggHatchesChickChance:.125,_eggNote:"아들 7차: 달걀에서는 확률적으로 병아리가 나온다. 1/8 은 아빠 임시값",drops:[["feather",[0,2],1],["chicken",[1,1],1]],lays:"egg"},{id:"pig",name:"돼지",breedWith:"carrot",followsWhenHolding:"carrot",drops:[["porkchop",[1,3],1]],rideable:"v1.1"},{id:"rabbit",name:"토끼",drops:[["rabbit_hide",[0,1],1]]},{id:"squid",name:"오징어",habitat:"shallow_sea",drops:[["ink_sac",[1,3],1]],_note:"얕은 바다. 먹물로 검은 염색 (아들)"},{id:"glow_squid",name:"발광 오징어",habitat:"deep_sea",drops:[["glow_ink_sac",[1,3],1]],_note:"심해. 빛나는 먹물 (아들)",release:"v1.1"},{id:"salmon",name:"연어",habitat:"river",drops:[["salmon",[1,1],1]]},{id:"dog",name:"강아지",tameable:!0,tameWith:"bone"},{id:"cat",name:"고양이",tameable:!0,tameWith:["salmon","cod"]},{id:"goat",name:"염소",habitat:"high_snow_mountain",release:"v1.1"},{id:"strider",name:"스트라이더",habitat:"nether_lava",rideable:"v1.1",release:"v1.1"},{id:"snow_golem",name:"눈 골렘",habitat:"snowfield"}],Hf={_comment:"폐광의 몹 스포너 — 몹이 계속 생성되는 위험 지역. 스포너를 캐면 많은 경험치 (아들)",block:"mob_spawner",location:"abandoned_mineshaft",spawns:["zombie","skeleton","spider"],intervalSec:[10,40],maxNearby:6,breakXp:[15,43],_xpNote:"마인크래프트 값(15–43). 폐광은 동굴 원정지 구조물, v1.1"},Wf={_comment:zf,hostile:Vf,passive:Gf,spawner:Hf},Xf="드래곤 목록 — 이 게임의 핵심. 아들이 2026-09-12에 정한 16종. tier = 아들이 줄 세운 순서(1 가장 약함 → 16 가장 셈). recipe = 알을 만드는 데 필요한 재료와 개수(아들이 정한 그대로). targetExpeditions = 이 드래곤을 얻는 데 걸리길 바라는 원정 횟수(아들: 약한 것 1~2, 중간 3~5, 최강 6~8) — 밸런스 조정 기준값. abilities = 드래곤이 하는 일. 모든 드래곤은 안장을 만들면 탈 수 있다. color/texture는 아들이 그림 그린 뒤 채운다. skills = 아들이 정한 고유 스킬(2026-09-12 2차 답변). 공통 기본 공격은 combat.commonSkills. 숫자(damage/stamina/cooldown)는 아빠 임시값.",Yf={obtainMethod:"egg",_obtainNote:"재료를 다 모으면 알이 나오고, 알에서 아기 드래곤이 나온다 (아들 답변 2)",growth:{startsAsBaby:!0,feedWithRecipeMaterials:!0,_note:"아기로 태어나고, 만들 때 쓴 재료를 먹이면 더 빨리 자란다 (아들 답변 4). 기본 성장 시간과 먹이당 단축량은 M6에서 정한다",baseGrowMinutes:60,feedShortcutMinutes:10,stages:["baby","adult"],_stageNote:"아기: 작고 둥글게(models/*.baby). 어른: 약 2배 크기, 긴 뿔·척추 가시·이빨 줄·큰 날개·긴 꼬리·빛나는 눈(models/*.adult). 어른이 되면 스킬 위력·기력 최대치 증가(값은 M6에서). 아빠 요청(2026-09-12): '컸을 때는 더 무섭고 크게'",adultMultipliers:{skillDamage:1.5,staminaMax:1.5,hp:2,hitbox:2,_note:"임시값"}},canDie:!0,flees:!1,permanent:!0,_deathNote:"죽을 수는 있지만 도망치지 않고, 얻으면 영원히 내 것 (아들 답변 5). → 구현: 죽으면 사라지지 않고 둥지로 돌아가 회복(원정 1회 동안 출전 불가). 아들 확정(2026-09-13, 결정 #25)",rideRequires:"saddle",rideControls:{_note:"아들 답변 13: 조이스틱으로 이동, 점프 버튼으로 상승, 웅크리기(▼) 버튼으로 하강. 타고 걸을 수도 있지만 몸집이 커서 장애물에 잘 걸린다",up:"jump",down:"sneak",walkable:!0,bigHitbox:!0},hatch:{_note:"알 부화에는 경험치 레벨을 소모한다(마인크래프트 인챈트 방식). 티어별 비용은 data/xp.json hatchLevelCostByTier. 레벨이 모자라면 알은 둥지에 보관된다",costsLevels:!0},completionReward:{_note:"전부 모으면 300 경험치 (아들 답변 15) + '드래곤 마스터' 칭호 + 마을 깃발. 경험치 시스템은 docs/XP-SYSTEM.md (마인크래프트 방식, 2026-09-12 도입 확정)",xp:300,title:"드래곤 마스터"},multiplayer:{_note:"아들 답변 12: 힘 합쳐 재료 모으기, 드래곤 대결, 드래곤 경주 전부. v1은 협동 재료 모으기, 대결·경주는 v1.1",coop:"v1",battle:"v1.1",race:"v1.1"}},qf=[{id:"log",name:"나무 원목",from:["grass_island"],how:"나무 캐기",rarity:1},{id:"sapling",name:"나무 묘목",from:["grass_island"],how:"나뭇잎 부수면 확률 드롭",rarity:1},{id:"leaves",name:"나뭇잎",from:["grass_island"],how:"나뭇잎 캐기(가위 또는 맨손)",rarity:1},{id:"dirt",name:"흙",from:["grass_island"],how:"캐기",rarity:1},{id:"stone",name:"돌",from:["grass_island","cave"],how:"캐기(곡괭이)",rarity:1},{id:"iron_ingot",name:"철",from:["cave","grass_island"],how:"철 광석 캐서 제련",rarity:2},{id:"cake",name:"케이크",from:["craft"],how:"제작: 밀 3 + 설탕 2 + 우유 3 + 달걀 1 (초원 섬 농장·소·닭, 마을 농장)",rarity:2},{id:"gold_ingot",name:"금",from:["cave","desert","nether"],how:"금 광석 캐서 제련, 사막 보물 상자",rarity:2},{id:"diamond",name:"다이아몬드",from:["cave"],how:"동굴 깊은 곳 캐기(철 곡괭이 이상)",rarity:3},{id:"netherite",name:"네더라이트",from:["nether"],how:"네더에만 있음. 고대 잔해 캐기(다이아 곡괭이)",rarity:4},{id:"lava_bucket",name:"용암 양동이",from:["nether","cave"],how:"양동이로 용암 채취",rarity:2},{id:"blaze_rod",name:"블레이즈 막대기",from:["nether"],how:"블레이즈 처치 시 확률 드롭",rarity:3},{id:"ghast_tear",name:"가스트의 눈물",from:["nether","boss:giant_ghast"],how:"가스트를 죽여야만 나옴 / 초거대 가스트 처치 시 3개 확정 (v1.1)",rarity:3},{id:"ice",name:"얼음",from:["snowfield"],how:"눈 바이옴에서 캐기(실크터치 또는 그냥 드롭 허용)",rarity:2},{id:"snow_block",name:"눈 블록",from:["snowfield"],how:"눈 바이옴에서 눈덩이 4개로 제작 또는 캐기",rarity:2},{id:"water_bucket",name:"물 양동이",from:["grass_island","snowfield"],how:"양동이(철 3)로 물 채취",rarity:1},{id:"clock",name:"시계",from:["craft"],how:"제작: 금 4 + 레드스톤 1 (동굴)",rarity:3},{id:"ender_pearl",name:"엔더 진주",from:["grass_island","desert","the_end","boss:enderman_king"],how:"밤에 나오는 엔더맨 처치 시 확률 드롭",rarity:3},{id:"healing_potion",name:"치유의 물약",from:["the_end","craft"],how:"엔드 시티 상자, 또는 양조(네더 와트 + 반짝이는 수박)",rarity:3},{id:"wooden_pickaxe",name:"나무 곡괭이",from:["craft"],how:"제작",rarity:1},{id:"stone_pickaxe",name:"돌 곡괭이",from:["craft"],how:"제작",rarity:1},{id:"iron_pickaxe",name:"철 곡괭이",from:["craft"],how:"제작",rarity:2},{id:"golden_pickaxe",name:"금 곡괭이",from:["craft"],how:"제작",rarity:2},{id:"diamond_pickaxe",name:"다이아몬드 곡괭이",from:["craft"],how:"제작",rarity:3},{id:"netherite_pickaxe",name:"네더라이트 곡괭이",from:["craft"],how:"제작(대장간)",rarity:4},{id:"tnt",name:"TNT",from:["craft"],how:"제작: 화약 5(밤 크리퍼) + 모래 4(사막) / 크리퍼 왕 처치 시 2개 확정 (v1.2)",rarity:3},{id:"wither_skeleton_skull",name:"위더 스켈레톤 머리",from:["nether","boss:skeleton_king"],how:"네더 요새 위더 스켈레톤 처치 시 매우 낮은 확률 / 스켈레톤 왕 처치 시 3개 확정 (v1.2)",rarity:5},{id:"dragon_breath",name:"드래곤의 숨결",from:["the_end"],how:"엔더 드래곤이 바닥에 뿌리는 보라색 먼지 공격(닿으면 HP 감소)을 유리병으로 담는다",rarity:5},{id:"dragon_egg",name:"엔더 드래곤의 알",from:["the_end"],how:"엔더 드래곤을 잡아야만 나옴",rarity:5},{id:"totem_of_undying",name:"불사의 토템",from:["boss:evoker"],how:"소환사 처치. 소지 시 1회 사망 방지 + HP 4 회복 (아들 설명)",rarity:4,_note:"드래곤 재료는 아님 — 생존 아이템"},{id:"spider_crown",name:"거미 왕관",from:["boss:spider_king"],how:"거미 왕 처치. 꾸미기(모자)",rarity:3,_note:"드래곤 재료는 아님"}],Kf=JSON.parse(`[{"id":"wood","name":"나무 드래곤","tier":1,"targetExpeditions":[1,2],"recipe":[{"material":"log","count":5},{"material":"sapling","count":1},{"material":"leaves","count":2}],"texture":"dragon_wood","color":"#8B5A2B","skills":[{"id":"plant_tree","name":"나무 세우기","type":"utility","effect":"조준 지점에 나무 1그루 생성","stamina":20,"cooldownSec":8,"signature":true},{"id":"beam","name":"녹색 빔","type":"beam","color":"#4CAF50","power":"약한","powerLevel":1,"stamina":25,"cooldownSec":6}],"ride":true,"model":"models/dragon_wood.json","sketch":"아들 그림 2026-09-12","_recipeNote":"아들 확정(2026-09-19): 나무 묘목 1개 (그림대로). 1차 답변의 2개는 정정"},{"id":"earth","name":"대지 드래곤","tier":2,"targetExpeditions":[1,2],"recipe":[{"material":"dirt","count":2},{"material":"stone","count":2}],"texture":"dragon_earth","color":"#7F7F7F","skills":[{"id":"drop_dirt_stone","name":"흙과 돌 떨어뜨리기","type":"falling_blocks","blocks":["dirt","stone"],"damage":4,"stamina":25,"cooldownSec":6,"signature":true},{"id":"beam","name":"회색 빔","type":"beam","color":"#9E9E9E","power":"약한","powerLevel":1,"stamina":25,"cooldownSec":6}],"ride":true,"model":"models/dragon_earth.json","sketch":"아들 그림 2026-09-12"},{"id":"iron","name":"철 드래곤","tier":3,"targetExpeditions":[1,2],"recipe":[{"material":"iron_ingot","count":2}],"texture":"dragon_iron","color":"#9AA4AD","skills":[{"id":"throw_iron_block","name":"철 블록 날리기","type":"projectile","block":"iron_block","damage":7,"stamina":20,"cooldownSec":4,"signature":true},{"id":"drop_anvil","name":"모루 떨어뜨리기","type":"falling_blocks","blocks":["anvil"],"damage":10,"stamina":30,"cooldownSec":10},{"id":"beam","name":"은색 빔","type":"beam","color":"#CFD8DC","power":"약간 센","powerLevel":2,"stamina":25,"cooldownSec":6}],"ride":true,"model":"models/dragon_iron.json","sketch":"아들 그림 2026-09-12"},{"id":"cake","name":"케이크 드래곤","tier":4,"targetExpeditions":[2,3],"recipe":[{"material":"cake","count":2}],"texture":"dragon_cake","color":"#F4A7C3","skills":[{"id":"throw_cake","name":"케이크 날리기","type":"projectile","block":"cake","damage":3,"stamina":15,"cooldownSec":3},{"id":"heal_cake_beam","name":"힐 케이크 빔","type":"beam","target":"allies","heal":6,"color":"#F8BBD0","stamina":35,"cooldownSec":12,"signature":true,"_note":"주인과 동료들에게 힐"}],"ride":true},{"id":"gold","name":"금 드래곤","tier":5,"targetExpeditions":[3,5],"recipe":[{"material":"gold_ingot","count":2}],"texture":"dragon_gold","color":"#E2B32B","skills":[{"id":"throw_gold_block","name":"금 블록 날리기","type":"projectile","block":"gold_block","damage":7,"stamina":20,"cooldownSec":4,"signature":true},{"id":"scatter_gold","name":"금 뿌리기","type":"aoe","effect":"주변 적 눈부심 + 금 조각 드롭(장식)","stamina":25,"cooldownSec":10},{"id":"beam","name":"금빛 빔","type":"beam","color":"#FFD54F","power":"약간 센","powerLevel":2,"stamina":25,"cooldownSec":6}],"ride":true},{"id":"diamond","name":"다이아몬드 드래곤","tier":6,"targetExpeditions":[3,5],"recipe":[{"material":"diamond","count":2}],"texture":"dragon_diamond","color":"#5FD3E6","skills":[{"id":"throw_diamond_block","name":"다이아 블록 날리기","type":"projectile","block":"diamond_block","damage":9,"stamina":20,"cooldownSec":4},{"id":"diamond_tornado","name":"다이아 회오리","type":"aoe_spin","effect":"몸을 마구 돌리며 바람을 일으킴. 몸에 닿는 모든 것에 상당한 피해","damage":12,"radius":4,"durationSec":3,"stamina":45,"cooldownSec":15,"signature":true},{"id":"beam","name":"밝은 민트색 빔","type":"beam","color":"#A7FFEB","power":"강력한","powerLevel":3,"stamina":25,"cooldownSec":6}],"ride":true},{"id":"netherite","name":"네더라이트 드래곤","tier":7,"targetExpeditions":[3,5],"recipe":[{"material":"netherite","count":2}],"texture":"dragon_netherite","color":"#4A3B3F","skills":[{"id":"throw_netherite_block","name":"네더라이트 블록 날리기","type":"projectile","block":"netherite_block","damage":12,"stamina":25,"cooldownSec":5},{"id":"netherite_wall","name":"네더라이트 벽 세우기","type":"utility","effect":"전방 5×3 네더라이트 임시 벽 20초","stamina":35,"cooldownSec":20,"signature":true},{"id":"netherite_rain","name":"네더라이트 블록 비","type":"falling_blocks","blocks":["netherite_block"],"damage":14,"radius":6,"stamina":50,"cooldownSec":25},{"id":"beam","name":"아주 진한 보라빛 빔","type":"beam","color":"#4A148C","power":"강력한","powerLevel":3,"stamina":25,"cooldownSec":6}],"ride":true},{"id":"fire","name":"화염 드래곤","tier":8,"targetExpeditions":[3,5],"recipe":[{"material":"lava_bucket","count":1},{"material":"blaze_rod","count":2},{"material":"ghast_tear","count":1}],"_note":"불로 블록을 녹일 수 있다. 베드락·흑요석 제외 (아들 답변 3)","texture":"dragon_fire","color":"#E0562A","skills":[{"id":"breathe_fire","name":"불 뿜기","type":"cone","damage":6,"burnSec":4,"stamina":15,"cooldownSec":2,"signature":true},{"id":"shoot_lava","name":"용암 쏘기","type":"projectile","block":"lava","damage":8,"burnSec":6,"stamina":25,"cooldownSec":6},{"id":"fire_rain","name":"하늘에서 불 떨어지기","type":"aoe_rain","damage":5,"radius":6,"durationSec":5,"stamina":45,"cooldownSec":20},{"id":"fire_aura","name":"몸에 불 두르기","type":"aura","damage":3,"durationSec":10,"stamina":30,"cooldownSec":25},{"id":"melt_blocks","name":"블록 녹이기","type":"utility","except":["bedrock","obsidian"],"stamina":10,"cooldownSec":1}],"ride":true},{"id":"ice","name":"아이스 드래곤","tier":9,"targetExpeditions":[3,5],"recipe":[{"material":"ice","count":2},{"material":"snow_block","count":2}],"_note":"블록을 얼릴 수 있다 (아들 답변 3)","texture":"dragon_ice","color":"#8FD3F4","skills":[{"id":"shoot_ice","name":"얼음 쏘기","type":"projectile","damage":6,"slowSec":3,"stamina":15,"cooldownSec":3,"signature":true},{"id":"freeze_hostiles","name":"나쁜 몹 얼리기","type":"aoe","effect":"반경 안 적대 몹 5초 동결","radius":6,"durationSec":5,"stamina":40,"cooldownSec":18},{"id":"freeze_blocks","name":"블록을 얼음으로","type":"utility","effect":"조준 블록(물·용암 포함)을 얼음으로 변환","stamina":10,"cooldownSec":1}],"ride":true},{"id":"water","name":"워터 드래곤","tier":10,"targetExpeditions":[3,5],"recipe":[{"material":"water_bucket","count":1}],"texture":"dragon_water","color":"#2F80D6","skills":[{"id":"shoot_water","name":"물 쏘기","type":"projectile","damage":5,"knockback":4,"stamina":15,"cooldownSec":3,"signature":true},{"id":"tsunami","name":"쓰나미","type":"wave","damage":10,"knockback":8,"width":9,"stamina":50,"cooldownSec":25},{"id":"water_tornado","name":"물 회오리 소환","type":"summon_aoe","damage":6,"radius":3,"durationSec":6,"stamina":40,"cooldownSec":20},{"id":"water_breathing","name":"수중호흡 주기","type":"buff","target":"self_owner_allies","durationSec":1200,"stamina":40,"cooldownSec":300,"release":"v1.1","_note":"아들: 워터 드래곤에게 20분간 수중호흡을 받을 수 있다('디버프'라 썼지만 좋은 효과 → 버프)"}],"ride":true},{"id":"time","name":"타임 드래곤","tier":11,"targetExpeditions":[3,5],"recipe":[{"material":"clock","count":4}],"texture":"dragon_time","color":"#B08D57","skills":[{"id":"rewind_time","name":"시간 되돌리기","type":"world_rewind","effect":"플레이어들과 이 드래곤을 제외한 모든 것(적·몹·투사체·적이 부순 블록)을 10초 전 상태로 되돌린다. 위치 포함. 원정 타이머는 되돌리지 않는다","stamina":60,"cooldownSec":60,"rewindSec":10,"excludes":["players","self","allyDragons"],"affects":["hostileMobs","bosses","projectiles","enemyBlockChanges"],"timerAffected":false,"_note":"아들 확정(2026-09-12): 플레이어와 자신 제외, 위치 포함, 원정 타이머 제외. 동료 드래곤 제외는 아빠 해석. 플레이어가 놓은 블록은 그대로 둔다(플레이어 제외의 연장)","_serverNote":"서버가 최근 10초 적 상태·적 블록 변경 링버퍼 보관(1초 간격). 발동 시 되감기 후 전원에게 스냅샷 브로드캐스트"},{"id":"stop_time","name":"시간 멈추기","type":"global_freeze","effect":"30초 동안 적 전부 정지. 자신·플레이어·동료는 움직임","durationSec":30,"stamina":80,"cooldownSec":120,"signature":true,"timerAffected":false,"_note":"아들 확정: 원정 타이머는 멈추지 않는다"},{"id":"beam","name":"진한 초록색 빔","type":"beam","color":"#1B5E20","power":"강력한","powerLevel":3,"stamina":25,"cooldownSec":6}],"ride":true},{"id":"teleport","name":"텔레포트 드래곤","tier":12,"targetExpeditions":[6,8],"recipe":[{"material":"ender_pearl","count":2}],"texture":"dragon_teleport","color":"#1A1A22","skills":[{"id":"teleport_self","name":"텔레포트","type":"utility","range":32,"stamina":20,"cooldownSec":5,"signature":true},{"id":"banish","name":"상대를 다른 곳으로","type":"target_utility","effect":"조준한 적을 무작위 원거리로 이동","range":24,"stamina":35,"cooldownSec":12},{"id":"beam","name":"청녹색 빔","type":"beam","color":"#00897B","power":"강한","powerLevel":3,"stamina":25,"cooldownSec":6}],"ride":true},{"id":"healing","name":"치유 드래곤","tier":13,"targetExpeditions":[6,8],"recipe":[{"material":"healing_potion","count":6}],"texture":"dragon_healing","color":"#F06292","skills":[{"id":"heal_allies","name":"HP 회복","type":"heal","target":"self_owner_allies","heal":8,"radius":8,"stamina":30,"cooldownSec":10,"signature":true},{"id":"shield","name":"뚫리지 않는 방어막","type":"shield","durationSec":10,"radius":5,"stamina":60,"cooldownSec":45},{"id":"beam","name":"붉은색 빔","type":"beam","color":"#C62828","power":"강한","powerLevel":3,"stamina":25,"cooldownSec":6}],"ride":true},{"id":"earthquake","name":"어스퀘이크 드래곤","tier":14,"targetExpeditions":[6,8],"recipe":[{"material":"wooden_pickaxe","count":1},{"material":"stone_pickaxe","count":1},{"material":"iron_pickaxe","count":1},{"material":"golden_pickaxe","count":1},{"material":"diamond_pickaxe","count":1},{"material":"netherite_pickaxe","count":1}],"texture":"dragon_earthquake","color":"#8D6E4A","skills":[{"id":"dig_5x5","name":"주변 지형 5×5 캐기","type":"utility","effect":"조준 지점 중심 5×5×1 채굴, 드롭은 주인 가방으로","stamina":30,"cooldownSec":8,"signature":true,"_serverNote":"서버 블록 변경 검증에서 드래곤 스킬 예외(도달 거리 무시). 보호 구역은 여전히 불가"},{"id":"throw_pickaxes","name":"곡괭이 날리기","type":"projectile_burst","count":6,"damage":4,"stamina":25,"cooldownSec":6},{"id":"beam","name":"갈색 빔","type":"beam","color":"#6D4C41","power":"강한","powerLevel":3,"stamina":25,"cooldownSec":6}],"ride":true},{"id":"explosion","name":"폭발 드래곤","tier":15,"targetExpeditions":[6,8],"recipe":[{"material":"tnt","count":2},{"material":"wither_skeleton_skull","count":3}],"texture":"dragon_explosion","color":"#B71C1C","skills":[{"id":"self_detonate","name":"자기 몸 폭파","type":"self_aoe","damage":20,"radius":6,"selfHpCost":0.5,"effect":"부서지지 않지만 HP가 절반 깎임","stamina":50,"cooldownSec":30},{"id":"detonate_target","name":"원하는 곳 폭파","type":"target_aoe","damage":15,"radius":4,"range":24,"stamina":35,"cooldownSec":10,"signature":true},{"id":"beam","name":"흰색 빔","type":"beam","color":"#FFFFFF","power":"매우 강력한","powerLevel":4,"stamina":25,"cooldownSec":6}],"ride":true},{"id":"ender","name":"엔더 드래곤","tier":16,"targetExpeditions":[6,8],"recipe":[{"material":"dragon_breath","count":4},{"material":"dragon_egg","count":1}],"texture":"dragon_ender","color":"#1E1B24","skills":[{"id":"beam","name":"가장 강력한 보라·검정 빔","type":"beam","color":"#6A1B9A","power":"가장 강력한","powerLevel":5,"stamina":25,"cooldownSec":6},{"id":"dragon_breath_pool","name":"드래곤의 숨결 뿌리기","type":"ground_aoe","damage":4,"radius":3,"durationSec":8,"stamina":30,"cooldownSec":10,"signature":true},{"id":"purple_energy_balls","name":"하늘에서 보라색 에너지 볼","type":"aoe_rain","damage":8,"radius":6,"durationSec":5,"stamina":45,"cooldownSec":20},{"id":"purple_tornado","name":"보라색 회오리","type":"aoe_spin","damage":10,"radius":5,"durationSec":4,"stamina":45,"cooldownSec":20},{"id":"summon_enderman_army","name":"엔더맨 군대 소환","type":"summon","count":6,"durationSec":30,"friendly":true,"stamina":70,"cooldownSec":60},{"id":"teleport_far","name":"1~60블록 텔레포트","type":"utility","rangeMin":1,"rangeMax":60,"stamina":20,"cooldownSec":4},{"id":"eye_lasers","name":"눈에서 보라색 레이저","type":"beam","color":"#B39DDB","power":"강한","stamina":20,"cooldownSec":5,"powerLevel":3}],"ride":true,"model":"models/dragon_ender.json","_modelNote":"자체 디자인 — 참고 이미지(마인크래프트 엔더 드래곤 모델)는 복제하지 않고, 아들 설계(검정·보라, 티어 16)를 우리 생성기 골격으로 만든 것"}]`),Qf={_comment:"드래곤 전투 규칙 — 아들 설계(2026-09-12 스킬 답변). 모든 드래곤 공통 기본 공격 5종 + 드래곤별 고유 스킬. 빔은 색과 세기만 다른 공통 시스템.",commonSkills:[{id:"tail_whip",name:"꼬리치기",type:"melee",damage:3,knockback:2},{id:"bite",name:"깨물기",type:"melee",damage:4},{id:"headbutt",name:"머리 박치기",type:"melee",damage:4,knockback:3},{id:"claw_slam",name:"앞다리·뒷다리 내리치기",type:"melee",damage:5,aoeRadius:2},{id:"body_slam",name:"몸통 박치기",type:"melee",damage:6,knockback:4,selfStagger:!0}],friendlyFire:!1,_friendlyFireNote:"아들이 스킬마다 '자신이나 주인, 동료들은 피해가 없음'을 반복해서 적음 → 전역 규칙으로: 드래곤 스킬은 자신·주인·같은 마을 파티원에게 절대 피해를 주지 않는다. 회오리·쓰나미·낙하물 전부 포함",beamPower:{_comment:"아들이 쓴 세기 표현 → 숫자. 피해 = baseDamagePerPower × powerLevel",약한:1,"약간 센":2,강한:3,강력한:3,"매우 강력한":4,"가장 강력한":5,baseDamagePerPower:4,rangeBlocks:24,durationSec:1.5},stamina:{_comment:"드래곤 기력. 스킬마다 소모, 초당 회복. 폰에서 스킬 버튼 옆 작은 바. 아빠 임시안",max:100,regenPerSec:5},activeSkillSlots:4,_slotsNote:"폰 탑승 UI에 스킬 버튼 최대 4개. 기본 공격(꼬리·깨물기 등)은 탭 공격으로 자동 선택, 버튼을 차지하지 않는다",releasePlan:{v1:"기본 공격 5종 + 빔 + 드래곤별 대표 스킬 1개(signature: true)","v1.1":"나머지 스킬(시간 멈추기·되돌리기, 쓰나미, 엔더맨 군대, 방어막 등 복잡한 것)"}},Xd={_comment:Xf,rules:Yf,materials:qf,dragons:Kf,combat:Qf},jf="원정지 목록. 아들 답변(질문 7·11)의 재료 출처에서 역산해 6곳으로 확정. durationSec = 원정 시간(초). nightStartsAt = 밤 시작 초(0이면 항상 어두움). treasures = 재료가 들어있는 보물 상자 수(아들: 상자엔 재료만 들어있으면 됨). unlockedBy = 여는 포탈 단계. materials = 여기서 나오는 드래곤 재료(dragons.json materials id). nightMobs = 밤에만 나오는 몹. bossOrRareMobs = 특정 재료를 위해 잡아야 하는 몹. 원정지 6곳은 v1, release 필드가 있는 4곳(어두운 숲·정글·깊은 어둠·고대성)은 보스 설계에서 추가된 v1.1/v1.2. boss = 이 원정지의 보스(bosses.json). sonDetails = 아들 3차 디테일(2026-09-12). release가 붙은 것은 v1.1.",Jf=60,Zf=.5,$f=3,ep={_comment:"보물 상자를 처음 열 때 pool 에서 picks 가지를 뽑아 넣는다 (아빠 2026-09-28, #117: 가죽은 소에서 나오니 빼고 랜덤으로). weight 가 클수록 자주, min~max 개. 어느 상자에 뭐가 드는지는 원정 시드로 정해져 같은 원정에선 누가 열어도 같다. 아들이 항목·개수·확률을 바꿔도 된다.",picks:3,pool:[{item:"carrot",min:1,max:3,weight:3,_note:"돼지 먹이 (#110)"},{item:"iron_ingot",min:1,max:2,weight:3},{item:"gold_ingot",min:1,max:1,weight:2},{item:"diamond",min:1,max:1,weight:1,_note:"드물게"},{item:"emerald",min:1,max:1,weight:1},{item:"glowstone_dust",min:2,max:4,weight:2},{item:"string",min:2,max:4,weight:2,_note:"활 재료"},{item:"feather",min:1,max:3,weight:2,_note:"화살 재료"},{item:"bone",min:1,max:2,weight:2,_note:"강아지 길들이기"},{item:"apple",min:1,max:2,weight:2},{item:"arrow",min:4,max:8,weight:2}]},tp=[{id:"grass_island",name:"초원 섬",generator:"island",durationSec:600,nightStartsAt:360,treasures:3,unlockedBy:"portal_1",danger:1,materials:["log","sapling","leaves","dirt","stone","iron_ingot","water_bucket","ender_pearl"],animals:["cow","chicken","sheep"],crops:["wheat","sugar_cane","melon"],nightMobs:["zombie","creeper","enderman"],_note:"나무·대지·철·케이크(농장 재료)·워터 드래곤의 재료. 밤 크리퍼(화약→TNT), 엔더맨(엔더 진주 확률)",sonDetails:{details:["물가 사탕수수","호박·수박·감자 밭","동물: 양·소·토끼·닭·돼지","얕은 바다: 오징어(먹물 염료)","심해: 발광 오징어(v1.1)","꽃밭(염료), 양(양털)"],structuresAdd:[{id:"shipwreck",name:"난파선",release:"v1.1",loot:["heart_of_the_sea","chest","furnace"],_note:"해안. 상자와 화로, 바다의 심장 (아들)"}],nightMobsAdd:[{id:"witch",release:"v1.1"}],waterMobs:[{id:"squid",depth:"shallow",release:"v1"},{id:"glow_squid",depth:"deep",release:"v1.1"}]}},{id:"cave",name:"동굴",generator:"cave",durationSec:600,nightStartsAt:0,treasures:4,unlockedBy:"portal_2",danger:2,materials:["stone","iron_ingot","gold_ingot","diamond","redstone","lava_bucket"],nightMobs:["spider","zombie","skeleton"],_nightMobsNote:"첫째 몹이 셋에 둘, 나머지가 셋에 하나. 동굴은 거미가 주인 (M7-3). 스켈레톤은 아직 없어서 건너뛴다",depthBonus:{diamond:"y < 16",redstone:"y < 32"},_note:"철·금·다이아·시계(레드스톤) 재료. 깊을수록 다이아",boss:{id:"spider_king",structure:"spider_king_den",spawnChance:.35,_note:"거미 왕의 굴 — 35% 확률로 생성. v1"},sonDetails:{details:["폐광: 몹 스포너(좀비·스켈레톤·거미 계속 생성), 스포너 캐면 경험치 15–43 (v1.1)"],structuresAdd:[{id:"abandoned_mineshaft",name:"폐광",release:"v1.1",hasSpawner:!0,loot:["rail","minecart","iron_ingot","gold_ingot","lapis"]}]}},{id:"desert",name:"사막",generator:"desert",durationSec:600,nightStartsAt:360,treasures:4,unlockedBy:"portal_2",danger:2,materials:["sand","gold_ingot","ender_pearl"],nightMobs:["husk","creeper","enderman"],structures:["desert_pyramid"],_note:"TNT용 모래, 피라미드 상자 금, 밤 엔더맨",sonDetails:{details:["작은 사막 마을","선인장"],structuresAdd:[{id:"desert_village_small",name:"작은 사막 마을",release:"v1"}]}},{id:"snowfield",name:"설원",generator:"snow",durationSec:600,nightStartsAt:300,treasures:3,unlockedBy:"portal_3",danger:3,materials:["ice","snow_block","water_bucket"],nightMobs:["stray","zombie"],_note:"아이스 드래곤 재료. 눈 바이옴에 가야만 있음 (아들 답변 7)",sonDetails:{details:["눈 골렘(v1)","높은 눈 산의 염소(v1.1)"],mobsAdd:[{id:"snow_golem",release:"v1"},{id:"goat",release:"v1.1",where:"high_snow_mountain"}]}},{id:"nether",name:"네더",generator:"nether",durationSec:600,nightStartsAt:0,treasures:3,unlockedBy:"portal_4",danger:4,materials:["lava_bucket","blaze_rod","ghast_tear","netherite","gold_ingot","wither_skeleton_skull","nether_wart"],bossOrRareMobs:[{mob:"ghast",drops:"ghast_tear",chance:1,_note:"가스트를 죽여야만 나옴"},{mob:"blaze",drops:"blaze_rod",chance:.5,_note:"확률 드롭"},{mob:"wither_skeleton",drops:"wither_skeleton_skull",chance:.05,_note:"매우 낮은 확률 (아들 답변 11)"}],structures:["nether_fortress","bastion"],groundBlocks:["dried_ghast"],_note:"화염·네더라이트·폭발 드래곤 재료. 네더라이트는 네더에만",_note6:"아들 6차(2026-09-13): 피글린 요새(bastion)에 상자가 많고 잡다한 것이 들어 있다(v1.1). 바닥에 마른 가스트가 있어 캐서 물에 불리면 해피 가스트(v1.2). 피글린 vs 좀비 피글린 전쟁은 mobs.json",boss:{id:"giant_ghast",structure:"giant_nether_fortress",spawnChance:.3,release:"v1.1"},sonDetails:{details:["용암 위 스트라이더 — 안장 + 뒤틀린 균 낚싯대로 탑승(v1.1)","침대 설치 후 클릭 → 폭발(v1)","석영 광석, 고대 잔해"],mobsAdd:[{id:"strider",release:"v1.1",rideable:!0}],rules:["bed_explodes"]}},{id:"the_end",name:"엔드",generator:"end",durationSec:900,nightStartsAt:0,treasures:2,unlockedBy:"portal_5",danger:5,materials:["dragon_breath","dragon_egg","healing_potion","ender_pearl"],bossOrRareMobs:[{mob:"ender_dragon",drops:"dragon_egg",chance:1,_note:"엔더 드래곤을 잡아야만 나옴"},{mob:"ender_dragon",drops:"dragon_breath",chance:null,_note:"드래곤이 바닥에 뿌리는 보라색 먼지 공격을 유리병으로 담는다 — 처치 없이도 채집 가능"},{mob:"enderman",drops:"ender_pearl",chance:.5}],structures:["end_city"],_note:"마지막 원정. 15분. 엔드 시티 상자에 치유의 물약. 엔더 드래곤 전투는 협동 전제(6명)",boss:{id:"ender_dragon",structure:"end_island",spawnChance:1,_note:"항상 있음. 협동 최종 보스. v1"},sonDetails:{details:["엔드 시티: 공중에 떠 있음. 입구 양조기(치유의 물약), 내부 상자 2 + 가운데 셜커 + 그 위 겉날개","셜커 공격 → 부양 디버프, 떨어지면 낙하 피해(v1.1)","침대 폭발(v1)"],mobsAdd:[{id:"shulker",release:"v1.1",effect:"levitation"}],lootAdd:[{id:"elytra",release:"v1.1"}],rules:["bed_explodes"]}},{id:"dark_forest",name:"어두운 숲",generator:"dark_forest",durationSec:600,nightStartsAt:240,treasures:3,unlockedBy:"portal_3",danger:3,materials:["log","emerald","totem_of_undying"],structures:["woodland_mansion"],boss:{id:"evoker",structure:"woodland_mansion",spawnChance:1},release:"v1.1",_note:"삼림 대저택 — 소환사의 본거지 (아들 보스 설계)",sonDetails:{}},{id:"jungle",name:"정글",generator:"jungle",durationSec:600,nightStartsAt:360,treasures:4,unlockedBy:"portal_3",danger:3,materials:["gold_ingot","emerald","banana","melon"],structures:["jungle_palace"],boss:{id:"giant_gorilla",structure:"jungle_palace",spawnChance:1},release:"v1.2",_note:"사치스러운 정글 궁궐 — 거대 고릴라 (아들 보스 설계)",sonDetails:{}},{id:"deep_dark",name:"깊은 어둠",generator:"deep_dark",durationSec:600,nightStartsAt:0,treasures:3,unlockedBy:"portal_4",danger:4,materials:["echo_shard","sculk","diamond"],structures:["ancient_city"],boss:{id:"giant_warden",structure:"ancient_city",spawnChance:1},release:"v1.2",_note:"고대 도시 — 거대 워든 (아들 보스 설계)",sonDetails:{}},{id:"ancient_castle",name:"고대성",generator:"ancient_castle",durationSec:900,nightStartsAt:0,treasures:0,unlockedBy:"portal_6",danger:6,materials:["wither_skeleton_skull","gunpowder","ender_pearl"],structures:["ancient_castle"],boss:{id:"four_kings",structure:"ancient_castle",spawnChance:1},release:"v1.2",_note:"네 왕의 성 — 첫 번째 왕들의 머리가 걸려 있다. 엔딩 원정. 15분. 포탈 6단계(엔드 이후)",sonDetails:{}}],np={_comment:jf,returnGraceSec:Jf,failedReturnKeepRatio:Zf,minStartMarginMin:$f,treasureChestLoot:ep,expeditions:tp},ip="가족 연결 기본값. 부모 화면에서 가족별로 덮어쓸 수 있다. 시간은 분 단위, 시각은 서울 시간 HH:MM. weekday: 0=일 1=월 ... 6=토. baseMinutes는 아들이 2026-09-13에 정한 숫자(평일 20분 — +5분 보너스까지 고려해 넉넉하게, 주말 30분). 할 일 다 하면 +5분은 그대로.",sp="2026-09-12의 평일 10분 안은 원정 출발 조건(원정 10분 + 여유 3분 = 13분)과 충돌했는데, 아들이 평일 20분으로 올려 해결(결정 #50). 이제 기본 시간만으로 하루 한 번 원정이 가능하고, 할 일 보너스로 한 판 더.",op=10,rp=5,ap={0:30,1:20,2:20,3:20,4:20,5:20,6:30},lp={0:[["00:00","09:00"],["21:00","24:00"]],1:[["00:00","16:00"],["21:00","24:00"]],2:[["00:00","16:00"],["21:00","24:00"]],3:[["00:00","16:00"],["21:00","24:00"]],4:[["00:00","16:00"],["21:00","24:00"]],5:[["00:00","16:00"],["21:00","24:00"]],6:[["00:00","09:00"],["21:00","24:00"]]},cp={runAt:"MON 00:00",timezone:"Asia/Seoul",_note:"bonusCap은 아들이 정한 +5분 기준. 아빠 원안(+10분)으로 가면 10/7/4/0으로.",firstWeekBonusCap:5,tiers:[{minRate:.9,bonusCap:5,message:"지난주 대단했어. 이번 주는 매일 5분 더 열 수 있어."},{minRate:.75,bonusCap:4,message:"거의 다 했어. 이번 주 조금만 더."},{minRate:.5,bonusCap:2,message:"절반은 넘었어. 이번 주는 2분까지."},{minRate:0,bonusCap:0,message:"이번 주는 기본 시간만. 다음 주에 다시 열려."}]},dp=5,hp=[5,1],up=3,fp=!1,pp=[{title:"이 닦기",repeat:"daily",needsApproval:!1},{title:"수학 숙제",repeat:["1","2","3","4","5"],needsApproval:!0},{title:"책 20분 읽기",repeat:"daily",needsApproval:!1}],mp={_comment:ip,_resolved:sp,maxBonusMinutesPerDay:op,bonusMinutesFullCompletion:rp,baseMinutes:ap,blockedRanges:lp,weeklySettlement:cp,idleLogoutMinutes:dp,warnBeforeEndMinutes:hp,expeditionStartMarginMinutes:up,parentSelfLimitEnabled:fp,exampleTodos:pp},gp="채팅은 여기 있는 것만 보낼 수 있다. 자유 입력 없음. 아들이 2026-09-12에 고른 문구 20개와 이모지 13개(12개 요청했는데 13개를 골라서 그대로 둠 — 아빠가 하나 빼도 됨).",_p=["🥰","😄","😛","🤩","🥳","🤬","🤯","😣","😭","😱","😢","❤️","🥇"],vp=[{id:1,text:"돌아가자"},{id:2,text:"나이스"},{id:3,text:"계속 가자"},{id:4,text:"찾았다"},{id:5,text:"공격!"},{id:6,text:"후퇴하자"},{id:7,text:"방어하자"},{id:8,text:"잘했어!"},{id:9,text:"좋았어!"},{id:10,text:"조심해"},{id:11,text:"일단 숨자"},{id:12,text:"미안해"},{id:13,text:"ㅋㅋㅋ"},{id:14,text:"기습공격!"},{id:15,text:"흩어지자"},{id:16,text:"다시 모이자"},{id:17,text:"뭐지"},{id:18,text:"으악!"},{id:19,text:"헉…!"},{id:20,text:"이게무슨???"}],xp={_comment:gp,emojis:_p,phrases:vp},Ap="물약 양조 (마인크래프트 1.21 규칙, 아들 8차 디테일 2026-09-18). 양조기(brewing_stand)에서 만든다. 순서: 유리병에 물 → 물병(water_bottle) → 네더 사마귀 → 어색한 물약(awkward, 효과 없음) → 재료 하나 → 물약. from = 무엇에 재료를 넣나(water_bottle / awkward / 다른 물약 id). corruptsTo = 발효된 거미 눈을 넣으면 바뀌는 물약. seconds = 마시면 몇 초 가는지(0 = 즉시 한 번). 레드스톤은 시간 ×8/3, 발광석은 단계 +1 이고 시간 반, 화약은 던지는 물약, 던지는 물약 + 드래곤의 숨결 = 바닥에 남는 잔류형(시간 1/4). 이 배율은 코드(shared/rules/potions.ts)가 정한다. canExtend / canAmplify 가 false 면 그 보조 재료는 안 먹힌다. release 없는 것은 v1 — 양조 자체는 M4, 체력이 필요한 효과(치유·고통·독·재생·화염 저항·힘·나약함)는 체력이 생기는 M7 부터 실제로 듣는다. 개수·초는 아빠 임시값, 아들이 바꿔도 됨.",bp={water_bottle:{name:"물병",_note:"유리병(glass_bottle)을 물에 대면 물병. 레시피는 recipes.json water_bottle"},awkward:{name:"어색한 물약",from:"water_bottle",ingredient:"nether_wart",_note:"효과 없음. 모든 물약의 시작"}},yp={_comment:"물약에 넣는 보조 재료. 아들이 고칠 건 name 정도. 무엇을 하는지는 코드가 정한다.",redstone:{name:"레드스톤 가루",does:"extend",_note:"지속 시간 늘리기 (3분 → 8분)"},glowstone_dust:{name:"발광석 가루",does:"amplify",_note:"단계 올리기 (I → II), 시간은 반으로"},gunpowder:{name:"화약",does:"splash",_note:"던지는(투척용) 물약"},dragon_breath:{name:"드래곤의 숨결",does:"lingering",_note:"던지는 물약에 넣으면 바닥에 구름이 남는 잔류형. 엔더 드래곤 재료와 같은 아이템"},fermented_spider_eye:{name:"발효된 거미 눈",does:"corrupt",_note:"물약을 반대로 뒤집는다 (corruptsTo). 물병에 바로 넣으면 나약함"}},Mp={fuel:"blaze_powder",brewsPerFuel:20,bottles:3,brewSeconds:20,_note:"아빠 9차: 양조기 = 블레이즈 막대기 1 + 조약돌 3 (recipes.json brewing_stand). 왼쪽 연료 칸에 블레이즈 가루(막대기 1 → 가루 2), 가루 1개로 20번. 아래 병 자리 3개에 물병을 놓고 위에 재료 하나 → 세 병이 함께 바뀐다. 한 번 20초"},Ep=[{id:"speed",name:"신속의 물약",from:"awkward",ingredient:"sugar",effect:"speed",seconds:180,corruptsTo:"slowness",_note:"더 빨리 달린다. 설탕은 사탕수수"},{id:"slowness",name:"감속의 물약",from:"speed",ingredient:"fermented_spider_eye",effect:"slowness",seconds:90,_note:"신속 또는 도약의 물약에 발효된 거미 눈. 던져서 상대를 느리게. (가이드의 '어색한 물약 + 거미 눈 + 발효된 거미 눈'은 마인크래프트에 없는 조합이라 뺐다)"},{id:"leaping",name:"도약의 물약",from:"awkward",ingredient:"rabbit_foot",effect:"jump_boost",seconds:180,corruptsTo:"slowness",_note:"더 높이 뛴다. 토끼발은 초원 섬 토끼"},{id:"strength",name:"힘의 물약",from:"awkward",ingredient:"blaze_powder",effect:"strength",seconds:180,_note:"공격이 세진다. 블레이즈 가루는 블레이즈 막대기를 가방에서 부순 것"},{id:"healing",name:"치유의 물약",from:"awkward",ingredient:"glistering_melon",effect:"instant_health",seconds:0,canExtend:!1,corruptsTo:"harming",_note:"마시면 바로 체력 회복. 치유 드래곤 재료 6개(dragons.json). 엔드 시티 상자·양조기에서도 나옴. 반짝이는 수박 = 수박 조각 + 금 조각 8 (recipes.json)"},{id:"harming",name:"고통의 물약",from:"healing",ingredient:"fermented_spider_eye",effect:"instant_damage",seconds:0,canExtend:!1,_note:"치유 또는 독의 물약에 발효된 거미 눈. 던져서 상대에게 피해. 친구에게 던지면? → 아들에게 질문"},{id:"poison",name:"독 물약",from:"awkward",ingredient:"spider_eye",effect:"poison",seconds:45,corruptsTo:"harming",_note:"천천히 체력이 깎인다(1칸 남기고 멈춤). 거미 눈은 동굴 거미"},{id:"regeneration",name:"재생의 물약",from:"awkward",ingredient:"ghast_tear",effect:"regeneration",seconds:45,_note:"천천히 체력이 찬다. 가스트의 눈물은 네더 가스트 (화염 드래곤 재료와 같은 아이템)"},{id:"fire_resistance",name:"화염 저항의 물약",from:"awkward",ingredient:"magma_cream",effect:"fire_resistance",seconds:180,canAmplify:!1,_note:"불·용암에 안 다친다. 네더 원정 필수. 마그마 크림 = 슬라임 볼 + 블레이즈 가루 (recipes.json). 피글린 거래에서도 나옴(아들 6차)"},{id:"water_breathing",name:"수중 호흡의 물약",from:"awkward",ingredient:"pufferfish",effect:"water_breathing",seconds:180,canAmplify:!1,_note:"물속에서 숨을 쉰다. 워터 드래곤 능력과 같음. 복어는 초원 섬 바다 낚시"},{id:"night_vision",name:"야간 투시의 물약",from:"awkward",ingredient:"golden_carrot",effect:"night_vision",seconds:180,canAmplify:!1,corruptsTo:"invisibility",_note:"밤·동굴이 환하게 보인다. 황금 당근 = 당근 + 금 8 (아들 7차)"},{id:"invisibility",name:"투명화 물약",from:"night_vision",ingredient:"fermented_spider_eye",effect:"invisibility",seconds:180,canAmplify:!1,_note:"다른 플레이어·몹에게 안 보인다(들고 있는 것·갑옷은 보임). 친구들에게 안 보이는 건 서버가 처리",release:"v1.1"},{id:"turtle_master",name:"거북 도사의 물약",from:"awkward",ingredient:"turtle_shell",effect:"turtle_master",seconds:20,_note:"느려지지만(감속 IV) 튼튼해진다(저항 III). 거북 등딱지 = 인갑 5개. 거북이가 아직 게임에 없다 → 거북이(mobs.json)와 함께",release:"v1.1"},{id:"slow_falling",name:"느린 낙하의 물약",from:"awkward",ingredient:"phantom_membrane",effect:"slow_falling",seconds:90,canAmplify:!1,_note:"천천히 떨어지고 낙하 피해 없음. 팬텀 막대는 팬텀(3일 못 자면 밤에 나옴). 팬텀이 아직 게임에 없다 → 팬텀(mobs.json)과 함께",release:"v1.1"},{id:"wind_charged",name:"돌풍의 물약",from:"awkward",ingredient:"breeze_rod",effect:"wind_charged",seconds:180,_note:"1.21 새 물약. 맞은 몹이 죽으면 돌풍이 터져 주변을 밀어낸다. 브리즈 막대기는 시련의 방 브리즈 → 시련의 방 구조물이 생길 때",release:"v2"},{id:"weaving",name:"방직의 물약",from:"awkward",ingredient:"cobweb",effect:"weaving",seconds:180,_note:"1.21 새 물약. 맞은 몹이 죽으면 거미줄이 생기고, 거미줄 안에서 빨리 움직인다. 거미줄은 폐광·거미 왕 굴",release:"v2"},{id:"oozing",name:"장역화 물약",from:"awkward",ingredient:"slime_block",effect:"oozing",seconds:180,_note:"1.21 새 물약. 맞은 몹이 죽으면 슬라임 2마리가 나온다. 슬라임 블록 = 슬라임 볼 9",release:"v2"},{id:"infested",name:"벌레 먹음의 물약",from:"awkward",ingredient:"stone",effect:"infested",seconds:180,_note:"1.21 새 물약. 맞은 몹이 다치면 좀벌레가 튀어나온다. 재료가 그냥 돌이라 가장 싼 물약",release:"v2"},{id:"weakness",name:"나약함의 물약",from:"water_bottle",ingredient:"fermented_spider_eye",effect:"weakness",seconds:90,canAmplify:!1,_note:"어색한 물약을 거치지 않고 물병에 바로. 공격이 약해진다. 좀비 주민 치료 = 나약함 + 황금 사과 (아들 7차와 이어짐)"}],Sp={_comment:"재료 어디서 얻나 (아들 참고용, 코드는 안 읽음). '아직 없음' = 그 몹·구조물이 게임에 들어올 때 같이",nether_wart:{name:"네더 사마귀",source:"네더 요새 (영혼 모래에서 자람)"},sugar:{name:"설탕",source:"사탕수수 1 → 설탕 2 (recipes.json)"},rabbit_foot:{name:"토끼발",source:"초원 섬 토끼 (드물게)"},blaze_powder:{name:"블레이즈 가루",source:"블레이즈 막대기 1 → 가루 2 (recipes.json)"},glistering_melon:{name:"반짝이는 수박 조각",source:"수박 조각 + 금 조각 8 (recipes.json). 가이드에 있던 '수박 조각 + 발광석 가루'는 마인크래프트에 없는 식이라 뺐다"},spider_eye:{name:"거미 눈",source:"동굴 거미 (mobs.json)"},fermented_spider_eye:{name:"발효된 거미 눈",source:"거미 눈 + 설탕 + 갈색 버섯 (recipes.json)"},ghast_tear:{name:"가스트의 눈물",source:"네더 가스트"},magma_cream:{name:"마그마 크림",source:"슬라임 볼 + 블레이즈 가루 (recipes.json), 또는 네더 마그마 큐브 (아직 없음)"},pufferfish:{name:"복어",source:"바다 낚시 (초원 섬)"},golden_carrot:{name:"황금 당근",source:"당근 + 금 8 (recipes.json)"},turtle_shell:{name:"거북 등딱지",source:"인갑 5 (아기 거북이가 자라며 떨어뜨림) — 거북이 아직 없음"},phantom_membrane:{name:"팬텀 막대",source:"팬텀 — 아직 없음"},breeze_rod:{name:"브리즈 막대기",source:"시련의 방 브리즈 — 아직 없음"},cobweb:{name:"거미줄",source:"폐광·거미 왕 굴 (칼로 캔다)"},slime_block:{name:"슬라임 블록",source:"슬라임 볼 9 — 슬라임 아직 없음"},stone:{name:"돌",source:"어디든 (blocks.json)"},redstone:{name:"레드스톤 가루",source:"레드스톤 광석 (blocks.json)"},glowstone_dust:{name:"발광석 가루",source:"발광석 블록 1 → 가루 2~4 (네더 천장)"},gunpowder:{name:"화약",source:"크리퍼·가스트·마녀"},dragon_breath:{name:"드래곤의 숨결",source:"엔더 드래곤 숨결 바닥을 유리병으로 (bosses.json)"}},Yd={_comment:Ap,base:bp,modifiers:yp,stand:Mp,potions:Ep,ingredients:Sp},wp="제작 레시피. 드래곤 재료 중 '제작'으로 얻는 것들과 안장·도구. station = 어디서 만드나(inventory 가방 안 2×2 칸 / crafting_table 제작대 3×3 / forge 대장간 / brewing 양조기 / furnace 화로). 개수는 아빠 임시값, 아들이 바꿔도 됨. 아들 3차 디테일(2026-09-12)의 제작 사슬(종이→책→책장→인챈트 테이블)과 도구·장식 레시피 추가. 6차(2026-09-13): 가방 2×2 칸 레시피(판자·제작대·양털·염료·염색). release 없는 것은 v1. 도끼 6종(2026-09-21, 아빠 — 마인크래프트 값): 핵심 재료 3 + 막대기 2, 네더라이트만 다이아몬드 도끼 + 네더라이트(대장간). 곡괭이와 같게 나무·돌은 제작대, 쇠붙이는 대장간(M6-6). 8차(2026-09-18): 양조 물약은 data/potions.json 으로 옮겼다(양조 규칙이 따로 있어서). 여기에는 양조기와 물약 재료 만드는 법만 — water_bottle·brewing_stand·blaze_powder·fermented_spider_eye·glistering_melon·gold_nugget·magma_cream·turtle_shell(v1.1)·slime_block(v2).",Tp=JSON.parse(`[{"id":"saddle","name":"안장","station":"crafting_table","in":{"leather":5,"iron_ingot":2},"out":{"saddle":1},"_note":"안장을 만들면 드래곤을 탈 수 있다 (아들 답변 3). 가죽은 초원 섬 소"},{"id":"bucket","name":"양동이","station":"crafting_table","in":{"iron_ingot":3},"out":{"bucket":1}},{"id":"glass_bottle","name":"유리병","station":"crafting_table","in":{"glass":3},"out":{"glass_bottle":3},"_note":"드래곤의 숨결을 담는다"},{"id":"cake","name":"케이크","station":"crafting_table","in":{"wheat":3,"sugar":2,"milk_bucket":3,"egg":1},"out":{"cake":1}},{"id":"sugar","name":"설탕","station":"inventory","in":{"sugar_cane":1},"out":{"sugar":2},"_note":"아들 7차: 사탕수수 1개당 설탕 2개. 사탕수수는 물가에서 자란다"},{"id":"golden_apple","name":"황금 사과","station":"crafting_table","in":{"apple":1,"gold_ingot":8},"out":{"golden_apple":1},"_note":"아들 7차: 사과 주위로 금 8개를 두른다. 좀비 주민을 되돌린다"},{"id":"golden_carrot","name":"황금 당근","station":"crafting_table","in":{"carrot":1,"gold_ingot":8},"out":{"golden_carrot":1},"_note":"아들 7차: 당근 주위로 금 8개"},{"id":"clock","name":"시계","station":"crafting_table","in":{"gold_ingot":4,"redstone":1},"out":{"clock":1}},{"id":"tnt","name":"TNT","station":"crafting_table","in":{"gunpowder":5,"sand":4},"out":{"tnt":1}},{"id":"snow_block","name":"눈 블록","station":"crafting_table","in":{"snowball":4},"out":{"snow_block":1}},{"id":"iron_ingot","name":"철","station":"furnace","in":{"iron_ore":1,"coal":1},"out":{"iron_ingot":1}},{"id":"gold_ingot","name":"금","station":"furnace","in":{"gold_ore":1,"coal":1},"out":{"gold_ingot":1}},{"id":"netherite","name":"네더라이트","station":"forge","in":{"ancient_debris":4,"gold_ingot":4},"out":{"netherite":1}},{"id":"wooden_pickaxe","name":"나무 곡괭이","station":"crafting_table","in":{"planks":3,"stick":2},"out":{"wooden_pickaxe":1},"toolTier":0},{"id":"stone_pickaxe","name":"돌 곡괭이","station":"crafting_table","in":{"cobblestone":3,"stick":2},"out":{"stone_pickaxe":1},"toolTier":1},{"id":"iron_pickaxe","name":"철 곡괭이","station":"forge","in":{"iron_ingot":3,"stick":2},"out":{"iron_pickaxe":1},"toolTier":2},{"id":"golden_pickaxe","name":"금 곡괭이","station":"forge","in":{"gold_ingot":3,"stick":2},"out":{"golden_pickaxe":1},"toolTier":1},{"id":"diamond_pickaxe","name":"다이아몬드 곡괭이","station":"forge","in":{"diamond":3,"stick":2},"out":{"diamond_pickaxe":1},"toolTier":3},{"id":"netherite_pickaxe","name":"네더라이트 곡괭이","station":"forge","in":{"diamond_pickaxe":1,"netherite":1},"out":{"netherite_pickaxe":1},"toolTier":4},{"id":"wooden_axe","name":"나무 도끼","station":"crafting_table","in":{"planks":3,"stick":2},"out":{"wooden_axe":1},"_note":"아빠 2026-09-21 (마인크래프트 값). 나무 캐는 속도는 data/tools.json axes"},{"id":"stone_axe","name":"돌 도끼","station":"crafting_table","in":{"cobblestone":3,"stick":2},"out":{"stone_axe":1},"_note":"아빠 2026-09-21 (마인크래프트 값). 나무 캐는 속도는 data/tools.json axes"},{"id":"iron_axe","name":"철 도끼","station":"forge","in":{"iron_ingot":3,"stick":2},"out":{"iron_axe":1},"_note":"아빠 2026-09-21 (마인크래프트 값). 나무 캐는 속도는 data/tools.json axes"},{"id":"golden_axe","name":"황금 도끼","station":"forge","in":{"gold_ingot":3,"stick":2},"out":{"golden_axe":1},"_note":"아빠 2026-09-21 (마인크래프트 값). 나무 캐는 속도는 data/tools.json axes"},{"id":"diamond_axe","name":"다이아몬드 도끼","station":"forge","in":{"diamond":3,"stick":2},"out":{"diamond_axe":1},"_note":"아빠 2026-09-21 (마인크래프트 값). 나무 캐는 속도는 data/tools.json axes"},{"id":"netherite_axe","name":"네더라이트 도끼","station":"forge","in":{"diamond_axe":1,"netherite":1},"out":{"netherite_axe":1},"_note":"아빠 2026-09-21 (마인크래프트 값). 대장간에서 다이아몬드 도끼에 네더라이트를 붙인다"},{"id":"wooden_sword","name":"나무 검","station":"crafting_table","in":{"planks":2,"stick":1},"out":{"wooden_sword":1},"_note":"아빠 2026-09-24 (마인크래프트 값). 공격력은 data/tools.json swords"},{"id":"stone_sword","name":"돌 검","station":"crafting_table","in":{"cobblestone":2,"stick":1},"out":{"stone_sword":1},"_note":"아빠 2026-09-24 (마인크래프트 값). 공격력은 data/tools.json swords"},{"id":"iron_sword","name":"철 검","station":"forge","in":{"iron_ingot":2,"stick":1},"out":{"iron_sword":1},"_note":"아빠 2026-09-24 (마인크래프트 값). 공격력은 data/tools.json swords. 예전 이름 '철 칼'"},{"id":"golden_sword","name":"황금 검","station":"forge","in":{"gold_ingot":2,"stick":1},"out":{"golden_sword":1},"_note":"아빠 2026-09-24 (마인크래프트 값). 공격력은 data/tools.json swords"},{"id":"diamond_sword","name":"다이아몬드 검","station":"forge","in":{"diamond":2,"stick":1},"out":{"diamond_sword":1},"_note":"아빠 2026-09-24 (마인크래프트 값). 공격력은 data/tools.json swords"},{"id":"netherite_sword","name":"네더라이트 검","station":"forge","in":{"diamond_sword":1,"netherite":1},"out":{"netherite_sword":1},"_note":"아빠 2026-09-24 (마인크래프트 값). 공격력은 data/tools.json swords. 대장간에서 다이아몬드 검에 네더라이트를 붙인다"},{"id":"wheat_from_hay","name":"밀","station":"inventory","in":{"hay_bale":1},"out":{"wheat":9},"_note":"아빠 2026-09-24 (마인크래프트 값). 밭·창고의 건초 더미를 풀면 밀 — 소·양 먹이(M8-1). 밭 농사는 나중에"},{"id":"pumpkin_seeds","name":"호박 씨","station":"inventory","in":{"pumpkin":1},"out":{"pumpkin_seeds":4},"_note":"아빠 2026-09-24 (마인크래프트 값). 닭 먹이(M8-1)"},{"id":"melon_seeds","name":"수박 씨","station":"inventory","in":{"melon":1},"out":{"melon_seeds":4},"_note":"2026-09-24. 닭 먹이(M8-1) — 밭의 수박을 캐서 만든다. 밀 씨는 아직 나올 곳이 없어 호박 씨·수박 씨로 닭을 먹인다"},{"id":"planks","name":"판자","station":"inventory","in":{"log":1},"out":{"planks":4},"_note":"아들 6차: 가방 오른쪽 2×2 칸에 원목을 두면 판자 4개"},{"id":"crafting_table","name":"제작대","station":"inventory","in":{"planks":4},"out":{"crafting_table":1},"_note":"아들 6차: 판자 4개로 제작대 1개. 제작대는 9칸(3×3)이라 여러 가지를 만들 수 있다"},{"id":"stick","name":"막대기","station":"crafting_table","in":{"planks":2},"out":{"stick":4}},{"id":"paper","name":"종이","station":"crafting_table","in":{"sugar_cane":3},"out":{"paper":3},"_note":"아들: 사탕수수 3개 → 종이"},{"id":"book","name":"책","station":"crafting_table","in":{"leather":1,"paper":3},"out":{"book":1}},{"id":"writable_book","name":"깃펜과 책","station":"crafting_table","in":{"book":1,"feather":1},"out":{"writable_book":1},"release":"v1.1","_note":"적을 수 있게 됨. 자유 채팅 없음 규칙과 충돌 → 개인 일기(남에게 안 보임) 또는 정해진 문구만. 아빠 결정"},{"id":"bookshelf","name":"책장","station":"crafting_table","in":{"planks":6,"book":3},"out":{"bookshelf":1}},{"id":"enchanting_table","name":"인챈트 테이블","station":"crafting_table","in":{"obsidian":4,"diamond":2,"book":1},"out":{"enchanting_table":1},"release":"v1.1","_note":"책장 15개를 주위 1칸 띄워 두면 최고 30레벨 인챈트 (아들). 경험치 소비처 2번"},{"id":"obsidian_from_lava","name":"흑요석 만들기","station":"world","in":{"water_bucket":1,"lava_source_block":1},"out":{"obsidian":1},"_note":"용암 블록에 물을 부으면 흑요석. 유체 흐름 없이 규칙 하나로"},{"id":"oak_stairs","name":"계단","station":"crafting_table","in":{"planks":6},"out":{"oak_stairs":4}},{"id":"oak_door","name":"문","station":"crafting_table","in":{"planks":6},"out":{"oak_door":3},"_note":"아빠 9차 확인: 판자 6개 → 문 3개 (마인크래프트와 같음)"},{"id":"oak_trapdoor","name":"다락문","station":"crafting_table","in":{"planks":6},"out":{"oak_trapdoor":2}},{"id":"oak_fence","name":"울타리","station":"crafting_table","in":{"planks":4,"stick":2},"out":{"oak_fence":3}},{"id":"sign","name":"표지판","station":"crafting_table","in":{"planks":6,"stick":1},"out":{"sign":3}},{"id":"glass","name":"유리","station":"furnace","in":{"sand":1,"coal":1},"out":{"glass":1}},{"id":"bed","name":"침대","station":"crafting_table","in":{"wool":3,"planks":3},"out":{"bed":1}},{"id":"torch","name":"횃불","station":"crafting_table","in":{"coal":1,"stick":1},"out":{"torch":4}},{"id":"chest","name":"상자","station":"crafting_table","in":{"planks":8},"out":{"chest":1}},{"id":"furnace","name":"화로","station":"crafting_table","in":{"cobblestone":8},"out":{"furnace":1}},{"id":"bow","name":"활","station":"crafting_table","in":{"stick":3,"string":3},"out":{"bow":1}},{"id":"arrow","name":"화살","station":"crafting_table","in":{"flint":1,"stick":1,"feather":1},"out":{"arrow":4}},{"id":"iron_chestplate","name":"철 흉갑","station":"forge","in":{"iron_ingot":8},"out":{"iron_chestplate":1}},{"id":"iron_hoe","name":"철 괭이","station":"forge","in":{"iron_ingot":2,"stick":2},"out":{"iron_hoe":1}},{"id":"iron_shovel","name":"철 삽","station":"forge","in":{"iron_ingot":1,"stick":2},"out":{"iron_shovel":1}},{"id":"flint_and_steel","name":"라이터","station":"crafting_table","in":{"iron_ingot":1,"flint":1},"out":{"flint_and_steel":1}},{"id":"fishing_rod","name":"낚싯대","station":"crafting_table","in":{"stick":3,"string":2},"out":{"fishing_rod":1}},{"id":"compass","name":"나침반","station":"crafting_table","in":{"iron_ingot":4,"redstone":1},"out":{"compass":1},"_note":"마을 포탈 방향을 가리킨다 — 원정 귀환에 유용"},{"id":"shears","name":"가위","station":"crafting_table","in":{"iron_ingot":2},"out":{"shears":1}},{"id":"carved_pumpkin","name":"조각된 호박","station":"world","in":{"pumpkin":1,"shears":1},"out":{"carved_pumpkin":1,"pumpkin_seeds":4}},{"id":"jack_o_lantern","name":"잭오랜턴","station":"crafting_table","in":{"carved_pumpkin":1,"torch":1},"out":{"jack_o_lantern":1}},{"id":"iron_block","name":"철 블록","station":"crafting_table","in":{"iron_ingot":9},"out":{"iron_block":1}},{"id":"gold_block","name":"금 블록","station":"crafting_table","in":{"gold_ingot":9},"out":{"gold_block":1}},{"id":"quartz_block","name":"석영 블록","station":"crafting_table","in":{"quartz":4},"out":{"quartz_block":1}},{"id":"netherite_block","name":"네더라이트 블록","station":"forge","in":{"netherite":9},"out":{"netherite_block":1}},{"id":"emerald_block","name":"에메랄드 블록","station":"crafting_table","in":{"emerald":9},"out":{"emerald_block":1}},{"id":"diamond_block","name":"다이아몬드 블록","station":"crafting_table","in":{"diamond":9},"out":{"diamond_block":1}},{"id":"hay_bale","name":"건초 더미","station":"crafting_table","in":{"wheat":9},"out":{"hay_bale":1}},{"id":"carrot_on_a_stick","name":"당근 낚싯대","station":"crafting_table","in":{"fishing_rod":1,"carrot":1},"out":{"carrot_on_a_stick":1},"release":"v1.1","_note":"돼지 타기"},{"id":"warped_fungus_on_a_stick","name":"뒤틀린 균 낚싯대","station":"crafting_table","in":{"fishing_rod":1,"warped_fungus":1},"out":{"warped_fungus_on_a_stick":1},"release":"v1.1","_note":"스트라이더 타기"},{"id":"firework","name":"폭죽","station":"crafting_table","in":{"paper":1,"gunpowder":1},"out":{"firework":3},"release":"v1.1","_note":"겉날개 추진"},{"id":"name_tag","name":"이름표","station":"anvil","in":{"name_tag_blank":1},"out":{"name_tag":1},"release":"v2","_note":"드래곤·동물에 이름 붙이기. 자유 입력이라 닉네임 필터 필요"},{"id":"redstone_dust","name":"레드스톤 가루","station":"world","in":{"redstone_ore":1},"out":{"redstone":4},"_note":"회로는 없음(결정 7). 시계·나침반 재료로만"},{"id":"wool_from_string","name":"양털 (거미줄)","station":"inventory","in":{"string":4},"out":{"wool":1},"_note":"아들: 거미줄(실) 4개 = 양털 1개. 6차: 가방 2×2 칸에서"},{"id":"dye_from_flower","name":"염료","station":"inventory","in":{"flower":1},"out":{"dye":3},"_note":"가방 2×2 칸에 꽃을 두면 꽃 색깔에 맞는 염료 3개 (아들 6차). 4차에선 '꽃을 부수면'이었는데 6차 방식으로"},{"id":"dye_wool","name":"양털 물들이기","station":"inventory","in":{"white_wool":1,"dye":1},"out":{"colored_wool":1},"_note":"흰 양털만 염색할 수 있다. 흰 양털 1 + 원하는 염료 1 → 그 색 양털 1 (아들 6차). 침대·깃발 색"},{"id":"ink_dye","name":"검은 염료 (먹물)","station":"crafting_table","in":{"ink_sac":1},"out":{"black_dye":1}},{"id":"shield","name":"방패","station":"crafting_table","in":{"planks":6,"iron_ingot":1},"out":{"shield":1},"_note":"막기 — 폰에서는 웅크리기 길게 누르기"},{"id":"boat","name":"보트","station":"crafting_table","in":{"planks":5},"out":{"boat":1},"release":"v1.1","_note":"몹을 태울 수 있음 (아들). 강·바다"},{"id":"minecart","name":"수레","station":"forge","in":{"iron_ingot":5},"out":{"minecart":1},"release":"v1.1"},{"id":"rail","name":"철도","station":"forge","in":{"iron_ingot":6,"stick":1},"out":{"rail":16},"release":"v1.1","_note":"수레+철도 이동. 마을 안 순환선 아이디어"},{"id":"spear","name":"창","station":"forge","in":{"iron_ingot":1,"stick":2},"out":{"spear":1},"_note":"아들: 창이 있다. 칼보다 사거리 길고 느림. 던지기 가능 여부는 아들에게"},{"id":"water_bottle","name":"물병","station":"world","in":{"glass_bottle":1,"water_source_block":1},"out":{"water_bottle":1},"_note":"유리병을 들고 물을 누르면 물병. 물은 없어지지 않음. 양조의 시작 (potions.json)"},{"id":"brewing_stand","name":"양조기","station":"crafting_table","in":{"blaze_rod":1,"cobblestone":3},"out":{"brewing_stand":1},"_note":"아빠 9차: 제작대 가운데 줄에 블레이즈 막대기 1, 그 아래 줄에 조약돌 3 (흑암·조잡한 심층암 같은 돌 계열도 됨). 연료는 블레이즈 가루, 병 자리 3개 — potions.json stand. 엔드 시티 입구에도 있음(아들 3차)"},{"id":"blaze_powder","name":"블레이즈 가루","station":"inventory","in":{"blaze_rod":1},"out":{"blaze_powder":2},"_note":"양조기 연료이자 힘의 물약 재료. 블레이즈 막대기는 네더 블레이즈 (화염 드래곤 재료와 같은 아이템)"},{"id":"fermented_spider_eye","name":"발효된 거미 눈","station":"crafting_table","in":{"spider_eye":1,"sugar":1,"brown_mushroom":1},"out":{"fermented_spider_eye":1},"_note":"물약을 반대로 뒤집는 재료 (신속→감속, 치유→고통, 야간 투시→투명화, 물병→나약함)"},{"id":"glistering_melon","name":"반짝이는 수박 조각","station":"crafting_table","in":{"melon_slice":1,"gold_nugget":8},"out":{"glistering_melon":1},"_note":"치유의 물약 재료. 수박 조각 주위로 금 조각 8개. (가이드의 \\"수박 조각 + 발광석 가루\\"는 마인크래프트에 없는 식)"},{"id":"gold_nugget","name":"금 조각","station":"inventory","in":{"gold_ingot":1},"out":{"gold_nugget":9},"_note":"금 주괴 1 → 금 조각 9. 반대로 조각 9 → 주괴 1 도 됨"},{"id":"magma_cream","name":"마그마 크림","station":"inventory","in":{"slime_ball":1,"blaze_powder":1},"out":{"magma_cream":1},"_note":"화염 저항의 물약 재료. 네더 마그마 큐브가 생기면 거기서도 나옴"},{"id":"turtle_shell","name":"거북 등딱지","station":"crafting_table","in":{"scute":5},"out":{"turtle_shell":1},"release":"v1.1","_note":"거북 도사의 물약 재료. 인갑은 아기 거북이가 자라며 떨어뜨림 — 거북이가 게임에 들어올 때"},{"id":"slime_block","name":"슬라임 블록","station":"crafting_table","in":{"slime_ball":9},"out":{"slime_block":1},"release":"v2","_note":"장역화 물약 재료 (1.21). 슬라임이 게임에 들어올 때"}]`),qd={_comment:wp,recipes:Tp},Cp="레드스톤 부품 (마인크래프트 규칙, 아빠 9차 디테일 2026-09-19). 네 가지로 나눈다: power 전원(신호를 만든다) / wire 전송·제어(신호를 옮기고 바꾼다) / input 입력·감지(플레이어·환경이 신호를 켠다) / machine 기계(신호를 받아 움직인다). signal = 내보내는 신호 세기(0~15, 없으면 안 냄). does = 뭘 하는지 한 줄(아들이 고쳐도 됨). release 없는 것은 v1.1(문·레버·버튼·압력판·조명·TNT·레일처럼 신호 하나로 켜고 끄는 것), v2 는 회로(중계기·비교기·관측기·피스톤·호퍼처럼 틱 단위 시뮬이 필요한 것). 신호는 가루 1칸마다 1씩 줄어 15칸까지. 블록은 그 버전에 blocks.json 에 그림과 함께 넣는다.",Rp={maxSignal:15,wireLossPerBlock:1,tickMs:100,_note:"레드스톤 틱 = 0.1초(게임 틱 2개). 중계기 지연 1~4 틱"},kp=[{id:"redstone_block",name:"레드스톤 블록",category:"power",signal:15,does:"놓아두면 항상 주변에 최대 신호를 준다",release:"v2"},{id:"redstone_torch",name:"레드스톤 횃불",category:"power",signal:15,does:"항상 켜져 있다가, 붙어 있는 블록에 신호가 들어오면 꺼진다 (NOT 게이트)",release:"v2"},{id:"redstone_wire",name:"레드스톤 가루",category:"wire",does:"전선. 1칸마다 신호가 1씩 줄어 15칸까지 간다",release:"v2",_note:"재료 자체(레드스톤 광석 → 가루 4)는 v1 (recipes.json redstone_dust). 바닥에 놓아 전선으로 쓰는 것이 v2"},{id:"repeater",name:"레드스톤 중계기",category:"wire",signal:15,does:"약해진 신호를 다시 15로. 지연 1~4틱. 옆에서 신호를 주면 잠긴다",release:"v2"},{id:"comparator",name:"레드스톤 비교기",category:"wire",does:"신호 세기를 비교하거나 뺀다. 상자·호퍼 안 아이템 양을 신호 세기로 바꾼다",release:"v2"},{id:"observer",name:"관측기",category:"wire",signal:15,does:"앞 블록이 바뀌면 뒤로 1틱짜리 짧은 신호를 낸다",release:"v2"},{id:"lever",name:"레버",category:"input",signal:15,does:"누르면 켜지고 다시 누르면 꺼진다. 신호를 유지할 때"},{id:"button",name:"버튼",category:"input",signal:15,does:"누르면 잠깐(나무 1.5초, 돌 1초)만 신호를 내고 꺼진다",variants:["wood","stone"]},{id:"pressure_plate",name:"압력판",category:"input",signal:15,does:"플레이어·몹·아이템이 올라가면 신호. 나무는 아이템도, 돌은 플레이어·몹만",variants:["wood","stone"]},{id:"weighted_pressure_plate",name:"무게 압력판",category:"input",does:"올라간 것의 수에 따라 신호 세기가 달라진다 (금은 조금만 올라가도 세고, 철은 많이 올라가야)",variants:["gold","iron"],release:"v2"},{id:"daylight_sensor",name:"햇빛 감지기",category:"input",does:"해 높이에 따라 신호 세기가 바뀐다. 뒤집으면 밤에 켜진다 (밤에 자동 가로등)",_note:"원정지는 낮→밤이 흐르므로(ARCHITECTURE 지형) 원정에서 쓸모. 마을은 밤이 없으면 항상 낮"},{id:"tripwire_hook",name:"철사 덫 갈고리",category:"input",signal:15,does:"실로 둘을 이으면 누가 실을 건널 때 신호",_note:'아들 9차 1순위 "침입자 경보기" 재료라 v1.1 로 앞당김'},{id:"target",name:"과녁",category:"input",does:"화살이 가운데에 가까이 맞을수록 센 신호",release:"v2"},{id:"piston",name:"피스톤",category:"machine",does:"신호를 받으면 앞으로 나가 블록을 12개까지 민다",release:"v2"},{id:"sticky_piston",name:"끈끈이 피스톤",category:"machine",does:"피스톤 + 슬라임 볼. 돌아올 때 앞 블록을 같이 당겨온다",release:"v2"},{id:"dispenser",name:"발사기",category:"machine",does:"안에 든 것을 쏘거나 쓴다 (화살은 발사, 물 양동이는 물을 놓음, 물약은 던짐)",release:"v2"},{id:"dropper",name:"공급기",category:"machine",does:"안에 든 것을 그냥 앞으로 떨어뜨리거나 앞 상자에 넣는다",release:"v2"},{id:"hopper",name:"호퍼",category:"machine",does:"위에 떨어진 아이템을 모아 아래·앞 상자로 옮기는 관. 신호를 받으면 멈춘다",release:"v2"},{id:"powered_rail",name:"전동 레일",category:"machine",does:"신호를 받으면 지나가는 수레를 빨라지게 밀어준다",_note:"아들 3차 수레·철도(v1.1)와 함께"},{id:"detector_rail",name:"탐지 레일",category:"machine",signal:15,does:"수레가 지나갈 때 신호를 낸다"},{id:"activator_rail",name:"활성화 레일",category:"machine",does:"TNT 수레를 터뜨리고, 호퍼 수레를 켜고 끈다",release:"v2"},{id:"redstone_lamp",name:"레드스톤 조명",category:"machine",does:"신호를 받으면 불이 켜진다 (발광석 1 + 레드스톤 4)"},{id:"copper_bulb",name:"구리 전구",category:"machine",does:"신호가 올 때마다 켜짐↔꺼짐이 바뀐다 (1.21). 오래되면 색이 변함",release:"v2"},{id:"note_block",name:"소리 블록",category:"machine",does:"신호를 받을 때마다 정해진 음높이로 소리. 아래 블록에 따라 악기가 다르다"},{id:"tnt",name:"TNT",category:"machine",does:"신호를 받거나 불이 붙으면 4초 뒤 폭발",_note:"폭발 드래곤 재료 (recipes.json tnt). 아들 9차: 마을에서는 몹이 공격할 때(방어전) TNT 를 쏘고 싶다 → 마을 안 TNT 는 몹만 다치고 블록은 안 부순다(보호 구역, 아빠 확인 필요). 결정 #64"},{id:"iron_door",name:"철문",category:"machine",does:"손으로는 안 열리고 레드스톤 신호로만 열린다. 나무 문·다락문·울타리 문도 신호로 열 수 있다"}],Dp={_comment:"아들 9차(2026-09-19) — 레드스톤으로 제일 먼저 만들고 싶은 것, 순서대로. version = 재료가 다 들어오는 가장 이른 버전",list:[{rank:1,name:"침입자 경보기",parts:["tripwire_hook","pressure_plate","note_block","redstone_lamp"],version:"v1.1",_note:"실을 건너거나 압력판을 밟으면 소리 블록 + 조명. 회로 없이 신호 하나로 됨"},{rank:2,name:"용암 함정",parts:["pressure_plate","iron_door","dispenser"],version:"v1.1 (다락문식) / v2 (발사기식)",_note:"압력판 → 철 다락문이 열려 용암 구덩이로(v1.1). 발사기가 용암 양동이를 쏘는 식은 v2"},{rank:3,name:"아이템 분류기",parts:["hopper","comparator","repeater","redstone_torch"],version:"v2",_note:"호퍼 + 비교기 회로. 상자 시스템(M4)과 회로 시뮬(v2)이 둘 다 필요"}]},Lp={_comment:Cp,rules:Rp,parts:kp,sonWishlist:Dp},Pp="아빠가 마을 사람 모두에게 한 번씩 주는 선물. 다음에 게임에 들어올 때 가방에 들어온다. 한 사람이 같은 선물을 두 번 받지는 않는다(id 로 기억). 새 선물을 주려면 아래 목록에 새 id 로 한 덩어리를 더한다. 이미 준 선물의 id 를 바꾸면 그 선물을 다시 준다.",Ip=[{id:"iron_axe_2026_09_21",name:"철 도끼",message:"아빠가 철 도끼를 하나 줬어요! 가방을 열어 보세요",items:{iron_axe:1}},{id:"stone_sword_2026_09_24",name:"돌 검",message:"아빠가 돌 검을 하나 줬어요! 좀비·거미를 5 씩 때려요 — 가방을 열어 보세요",items:{stone_sword:1}}],Up={_comment:Pp,gifts:Ip},Np="처음 마을에 들어올 때 한 번 받는 시작 키트 (아빠 결정 2026-09-19, 서바이벌 전환 #66·#67). 아이템 id: 개수. 아들이 바꿔도 됨. 가방 한 칸은 64개까지, 칸은 37개.",Bp={planks:32,log:8,dirt:32,cobblestone:32,torch:8,glass:8,crafting_table:1,bucket:1},Fp={_comment:Np,items:Bp},Op='곡괭이·도끼·검 — 검(swords)은 아빠가 준 마인크래프트 값(2026-09-24): damage = 몹을 때리는 힘(맨손 1). 검은 블록을 캐는 데는 쓸모없다(speed 1). 인챈트(날카로움·약탈·화염 등)는 v1.1. 곡괭이는 아들 설계(2026-09-20), 도끼는 아빠가 준 마인크래프트 값(2026-09-21). speed = 맨손으로 돌을 캘 때보다 몇 배 빠른가(곡괭이가 필요한 블록에만). tier = 캘 수 있는 등급: blocks.json 의 toolTier 가 이 값 이하인 블록만 캘 수 있다(맨손은 toolTier 0 만). obsidianSpeed = 흑요석을 캘 때 속도(맨손으로 돌 캐는 속도 기준 배수) — 없으면 흑요석을 못 캔다. durability = 내구도(쓸 수 있는 횟수, 대장간·수리와 함께 M6-6 에서 적용 예정). enchantSpeedPerLevel = 인챈트 한 단계마다 곱하는 속도(인챈트는 v1.1). 네더라이트 광석(ancient_debris)은 네더에만 있다(네더 원정지는 v1.1). 도끼(axes)는 나무 계열 블록(blocks.json tool: "axe" — 원목·판자·문·상자·제작대·호박 등)을 speed 배 빨리 캔다. 도끼는 등급 제한이 없다(나무는 맨손으로도 캔다). 금 도끼가 가장 빠르고 네더라이트·다이아몬드 순이다.',zp=1.5,Vp=[{id:"wooden_axe",name:"나무 도끼",tier:0,speed:2,durability:59,_note:"판자 3 + 막대기 2. 맨손의 2배"},{id:"stone_axe",name:"돌 도끼",tier:1,speed:4,durability:131,_note:"조약돌 3 + 막대기 2"},{id:"iron_axe",name:"철 도끼",tier:2,speed:6,durability:250,_note:"철 주괴 3 + 막대기 2"},{id:"golden_axe",name:"황금 도끼",tier:2,speed:12,durability:32,_note:"금 주괴 3 + 막대기 2. 가장 빠르지만 금방 닳는다"},{id:"diamond_axe",name:"다이아몬드 도끼",tier:3,speed:8,durability:1561,_note:"다이아몬드 3 + 막대기 2"},{id:"netherite_axe",name:"네더라이트 도끼",tier:4,speed:9,durability:2031,_note:"다이아몬드 도끼 1 + 네더라이트 주괴 1 (대장간)"}],Gp=[{id:"wooden_sword",name:"나무 검",tier:0,speed:1,damage:4,durability:59,_note:"판자 2 + 막대기 1. 공격력 4 (마인크래프트 값, 아빠 2026-09-24)"},{id:"stone_sword",name:"돌 검",tier:1,speed:1,damage:5,durability:131,_note:"조약돌 2 + 막대기 1"},{id:"iron_sword",name:"철 검",tier:2,speed:1,damage:6,durability:250,_note:"철 주괴 2 + 막대기 1 (대장간)"},{id:"golden_sword",name:"황금 검",tier:2,speed:1,damage:4,durability:32,_note:"금 주괴 2 + 막대기 1 (대장간). 나무 검과 같은 힘, 금방 닳는다"},{id:"diamond_sword",name:"다이아몬드 검",tier:3,speed:1,damage:7,durability:1561,_note:"다이아몬드 2 + 막대기 1 (대장간)"},{id:"netherite_sword",name:"네더라이트 검",tier:4,speed:1,damage:8,durability:2031,_note:"다이아몬드 검 1 + 네더라이트 주괴 1 (대장간)"}],Hp=[{id:"wooden_pickaxe",name:"나무 곡괭이",tier:0,speed:1.5,durability:59,_note:"돌 캐는 속도 1.5배. 광석은 못 캔다"},{id:"stone_pickaxe",name:"돌 곡괭이",tier:1,speed:3,durability:131,_note:"나무의 2배. 석탄·철·청금석·석영 광석까지"},{id:"iron_pickaxe",name:"철 곡괭이",tier:2,speed:7.5,durability:250,_note:"돌의 2.5배. 모든 광석"},{id:"golden_pickaxe",name:"금 곡괭이",tier:2,speed:7,durability:32,_note:"철보다 살짝 느리고 내구도는 매우 약함. 모든 광석"},{id:"diamond_pickaxe",name:"다이아몬드 곡괭이",tier:3,speed:18.75,obsidianSpeed:1.5,durability:1561,_note:"철의 2.5배. 흑요석은 나무 곡괭이로 돌 캐는 속도"},{id:"netherite_pickaxe",name:"네더라이트 곡괭이",tier:4,speed:37.5,obsidianSpeed:3,durability:2031,_note:"다이아몬드의 2배. 흑요석은 돌 곡괭이로 돌 캐는 속도"}],Wp={_comment:Op,enchantSpeedPerLevel:zp,axes:Vp,swords:Gp,pickaxes:Hp},Xp="경험치 시스템 — 마인크래프트 Java 수치 기반. 레벨 공식은 코드(shared/rules/xp.ts)에 있고 여기엔 '얻는 양'과 '쓰는 양'만. 범위값은 [최소, 최대]에서 무작위(서버 시드 PRNG). 아들이 숫자를 바꿔도 된다. 설명은 docs/XP-SYSTEM.md.",Yp="minecraft-java",qp={_comment:"블록을 캐면 바로 나오는 경험치 (마인크래프트 값)",coal_ore:[0,2],redstone_ore:[1,5],diamond_ore:[3,7],nether_quartz_ore:[2,5],iron_ore:[0,0],gold_ore:[0,0],ancient_debris:[0,0],lapis_ore:[2,5],emerald_ore:[3,7]},Kp={_comment:"화로에서 꺼낼 때 개당 경험치 (소수는 누적 후 버림)",iron_ingot:.7,gold_ingot:1,netherite_scrap:2},Qp={_comment:"처치 시 경험치 (마인크래프트 값). ender_dragon은 6명 협동 보스라 마인크래프트 첫 처치 12000 대신 각자 500",zombie:5,skeleton:5,creeper:5,spider:5,enderman:5,husk:5,stray:5,wither_skeleton:5,blaze:10,ghast:5,cow:[1,3],chicken:[1,3],sheep:[1,3],ender_dragon:500},jp={breeding:[1,7],fishing:[1,6],trading:[3,6]},Jp={_comment:"이 게임 고유 항목 (마인크래프트에 없음)",expeditionReturn:10,treasureChestOpen:5,codexNewEntry:5,dragonHatchedPerTier:5,dragonGrownPerTier:3,allDragonsCollected:300,allDragonsTitle:"드래곤 마스터",fourKingsDefeated:300,fourKingsTitle:"마을의 수호자",spawnerBreak:[15,43],_spawnerNote:"폐광 몹 스포너를 캐면 (마인크래프트 값). v1.1"},Zp={1:1,2:1,3:1,4:2,5:3,6:3,7:3,8:5,9:5,10:5,11:5,12:8,13:8,14:8,15:10,16:15,_comment:"알을 부화시킬 때 소모하는 레벨 (마인크래프트 인챈트처럼 레벨 단위 차감). 티어는 dragons.json"},$p={5:"hat_basic",10:"cape_basic",20:"particle_trail",30:"title_veteran"},em={_comment:"마인크래프트 규칙: 7×레벨(최대 100)을 구슬로 드롭, 레벨 0. 구슬은 회수 가능. 아들이 가혹하다고 하면 dropsXp를 false로",dropsXp:!0,dropPerLevel:7,dropMax:100,orbsRecoverable:!0,orbsExpireWithExpedition:!0},tm={_comment:"연출용. 서버는 수치만, 클라이언트가 구슬을 그린다",color:"#7FFF00",pickupSound:"orb_pickup",pitchJitter:.25,levelUpSound:"levelup"},nm={_comment:"보스 처치 경험치 (bosses.json과 동일값 유지). 협동이라 참가자 전원 각각",spider_king:80,evoker:100,giant_ghast:100,giant_gorilla:150,giant_warden:200,ender_dragon:500,skeleton_king:300,creeper_king:300,enderman_king:300,zombie_king:300,raidWinEach:50},im={_comment:Xp,levelFormula:Yp,mining:qp,smelting:Kp,mobs:Qp,misc:jp,ours:Jp,hatchLevelCostByTier:Zp,cosmeticUnlocksByLevel:$p,death:em,orbs:tm,bosses:nm},sm=Kh(bf),om=jh(If),rm=Xh(Yd);iu(Lp);const Pr=$h(np),pn=Wh(Xd),am=Gh(Df),Dn=Hh(Cf),lm=new Vh([...Yh(qd).defs,...qh(pn),...Dn.recipes]),Jl=Jh(xp),_o=nu(mp),cm=eu(Wp),$o=Qh(im),er=Zh(Wf,$o.mobs,"data/mobs.json",Wd),Ai=tu(Wd);su(Fp);ou(Up);const Ma=Zu({recipes:qd,dragons:Xd,potions:Yd,extra:Dn.itemNames});for(const s of pn.list)Ma.set(ru(s.id),`${s.name} 알`);const ml="180",dm=0,Zl=1,hm=2,Kd=1,um=2,Qn=3,ei=0,$t=1,sn=2,pi=0,_s=1,xs=2,$l=3,ec=4,fm=5,Pi=100,pm=101,mm=102,gm=103,_m=104,vm=200,xm=201,Am=202,bm=203,Ea=204,Sa=205,ym=206,Mm=207,Em=208,Sm=209,wm=210,Tm=211,Cm=212,Rm=213,km=214,wa=0,Ta=1,Ca=2,As=3,Ra=4,ka=5,Da=6,La=7,Qd=0,Dm=1,Lm=2,mi=0,Pm=1,Im=2,Um=3,Nm=4,Bm=5,Fm=6,Om=7,jd=300,bs=301,ys=302,Pa=303,Ia=304,vr=306,Zs=1e3,Ui=1001,Ua=1002,en=1003,zm=1004,Hs=1005,gn=1006,Ir=1007,Ni=1008,Vn=1009,Jd=1010,Zd=1011,$s=1012,gl=1013,Bi=1014,Jn=1015,ro=1016,_l=1017,vl=1018,eo=1020,$d=35902,eh=35899,th=1021,nh=1022,En=1023,to=1026,no=1027,ih=1028,xl=1029,sh=1030,Al=1031,bl=1033,tr=33776,nr=33777,ir=33778,sr=33779,Na=35840,Ba=35841,Fa=35842,Oa=35843,za=36196,Va=37492,Ga=37496,Ha=37808,Wa=37809,Xa=37810,Ya=37811,qa=37812,Ka=37813,Qa=37814,ja=37815,Ja=37816,Za=37817,$a=37818,el=37819,tl=37820,nl=37821,il=36492,sl=36494,ol=36495,rl=36283,al=36284,ll=36285,cl=36286,Vm=3200,Gm=3201,Hm=0,Wm=1,jn="",mn="srgb",Ms="srgb-linear",lr="linear",gt="srgb",Ki=7680,tc=519,Xm=512,Ym=513,qm=514,oh=515,Km=516,Qm=517,jm=518,Jm=519,dl=35044,cr="300 es",zn=2e3,dr=2001;class Ss{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const o=i.indexOf(t);o!==-1&&i.splice(o,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let o=0,r=i.length;o<r;o++)i[o].call(this,e);e.target=null}}}const Yt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let nc=1234567;const Ks=Math.PI/180,io=180/Math.PI;function Zn(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Yt[s&255]+Yt[s>>8&255]+Yt[s>>16&255]+Yt[s>>24&255]+"-"+Yt[e&255]+Yt[e>>8&255]+"-"+Yt[e>>16&15|64]+Yt[e>>24&255]+"-"+Yt[t&63|128]+Yt[t>>8&255]+"-"+Yt[t>>16&255]+Yt[t>>24&255]+Yt[n&255]+Yt[n>>8&255]+Yt[n>>16&255]+Yt[n>>24&255]).toLowerCase()}function $e(s,e,t){return Math.max(e,Math.min(t,s))}function yl(s,e){return(s%e+e)%e}function Zm(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function $m(s,e,t){return s!==e?(t-s)/(e-s):0}function Qs(s,e,t){return(1-t)*s+t*e}function eg(s,e,t,n){return Qs(s,e,1-Math.exp(-t*n))}function tg(s,e=1){return e-Math.abs(yl(s,e*2)-e)}function ng(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function ig(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function sg(s,e){return s+Math.floor(Math.random()*(e-s+1))}function og(s,e){return s+Math.random()*(e-s)}function rg(s){return s*(.5-Math.random())}function ag(s){s!==void 0&&(nc=s);let e=nc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function lg(s){return s*Ks}function cg(s){return s*io}function dg(s){return(s&s-1)===0&&s!==0}function hg(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function ug(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function fg(s,e,t,n,i){const o=Math.cos,r=Math.sin,a=o(t/2),l=r(t/2),d=o((e+n)/2),u=r((e+n)/2),c=o((e-n)/2),h=r((e-n)/2),f=o((n-e)/2),_=r((n-e)/2);switch(i){case"XYX":s.set(a*u,l*c,l*h,a*d);break;case"YZY":s.set(l*h,a*u,l*c,a*d);break;case"ZXZ":s.set(l*c,l*h,a*u,a*d);break;case"XZX":s.set(a*u,l*_,l*f,a*d);break;case"YXY":s.set(l*f,a*u,l*_,a*d);break;case"ZYZ":s.set(l*_,l*f,a*u,a*d);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function In(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function pt(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const pg={DEG2RAD:Ks,RAD2DEG:io,generateUUID:Zn,clamp:$e,euclideanModulo:yl,mapLinear:Zm,inverseLerp:$m,lerp:Qs,damp:eg,pingpong:tg,smoothstep:ng,smootherstep:ig,randInt:sg,randFloat:og,randFloatSpread:rg,seededRandom:ag,degToRad:lg,radToDeg:cg,isPowerOfTwo:dg,ceilPowerOfTwo:hg,floorPowerOfTwo:ug,setQuaternionFromProperEuler:fg,normalize:pt,denormalize:In};class Je{constructor(e=0,t=0){Je.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar($e(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos($e(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),o=this.x-e.x,r=this.y-e.y;return this.x=o*n-r*i+e.x,this.y=o*i+r*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ao{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,o,r,a){let l=n[i+0],d=n[i+1],u=n[i+2],c=n[i+3];const h=o[r+0],f=o[r+1],_=o[r+2],g=o[r+3];if(a===0){e[t+0]=l,e[t+1]=d,e[t+2]=u,e[t+3]=c;return}if(a===1){e[t+0]=h,e[t+1]=f,e[t+2]=_,e[t+3]=g;return}if(c!==g||l!==h||d!==f||u!==_){let p=1-a;const m=l*h+d*f+u*_+c*g,M=m>=0?1:-1,w=1-m*m;if(w>Number.EPSILON){const R=Math.sqrt(w),v=Math.atan2(R,m*M);p=Math.sin(p*v)/R,a=Math.sin(a*v)/R}const b=a*M;if(l=l*p+h*b,d=d*p+f*b,u=u*p+_*b,c=c*p+g*b,p===1-a){const R=1/Math.sqrt(l*l+d*d+u*u+c*c);l*=R,d*=R,u*=R,c*=R}}e[t]=l,e[t+1]=d,e[t+2]=u,e[t+3]=c}static multiplyQuaternionsFlat(e,t,n,i,o,r){const a=n[i],l=n[i+1],d=n[i+2],u=n[i+3],c=o[r],h=o[r+1],f=o[r+2],_=o[r+3];return e[t]=a*_+u*c+l*f-d*h,e[t+1]=l*_+u*h+d*c-a*f,e[t+2]=d*_+u*f+a*h-l*c,e[t+3]=u*_-a*c-l*h-d*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,o=e._z,r=e._order,a=Math.cos,l=Math.sin,d=a(n/2),u=a(i/2),c=a(o/2),h=l(n/2),f=l(i/2),_=l(o/2);switch(r){case"XYZ":this._x=h*u*c+d*f*_,this._y=d*f*c-h*u*_,this._z=d*u*_+h*f*c,this._w=d*u*c-h*f*_;break;case"YXZ":this._x=h*u*c+d*f*_,this._y=d*f*c-h*u*_,this._z=d*u*_-h*f*c,this._w=d*u*c+h*f*_;break;case"ZXY":this._x=h*u*c-d*f*_,this._y=d*f*c+h*u*_,this._z=d*u*_+h*f*c,this._w=d*u*c-h*f*_;break;case"ZYX":this._x=h*u*c-d*f*_,this._y=d*f*c+h*u*_,this._z=d*u*_-h*f*c,this._w=d*u*c+h*f*_;break;case"YZX":this._x=h*u*c+d*f*_,this._y=d*f*c+h*u*_,this._z=d*u*_-h*f*c,this._w=d*u*c-h*f*_;break;case"XZY":this._x=h*u*c-d*f*_,this._y=d*f*c-h*u*_,this._z=d*u*_+h*f*c,this._w=d*u*c+h*f*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],o=t[8],r=t[1],a=t[5],l=t[9],d=t[2],u=t[6],c=t[10],h=n+a+c;if(h>0){const f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(u-l)*f,this._y=(o-d)*f,this._z=(r-i)*f}else if(n>a&&n>c){const f=2*Math.sqrt(1+n-a-c);this._w=(u-l)/f,this._x=.25*f,this._y=(i+r)/f,this._z=(o+d)/f}else if(a>c){const f=2*Math.sqrt(1+a-n-c);this._w=(o-d)/f,this._x=(i+r)/f,this._y=.25*f,this._z=(l+u)/f}else{const f=2*Math.sqrt(1+c-n-a);this._w=(r-i)/f,this._x=(o+d)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs($e(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,o=e._z,r=e._w,a=t._x,l=t._y,d=t._z,u=t._w;return this._x=n*u+r*a+i*d-o*l,this._y=i*u+r*l+o*a-n*d,this._z=o*u+r*d+n*l-i*a,this._w=r*u-n*a-i*l-o*d,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,o=this._z,r=this._w;let a=r*e._w+n*e._x+i*e._y+o*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=r,this._x=n,this._y=i,this._z=o,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-t;return this._w=f*r+t*this._w,this._x=f*n+t*this._x,this._y=f*i+t*this._y,this._z=f*o+t*this._z,this.normalize(),this}const d=Math.sqrt(l),u=Math.atan2(d,a),c=Math.sin((1-t)*u)/d,h=Math.sin(t*u)/d;return this._w=r*c+this._w*h,this._x=n*c+this._x*h,this._y=i*c+this._y*h,this._z=o*c+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),o=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),o*Math.sin(t),o*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class H{constructor(e=0,t=0,n=0){H.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ic.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ic.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,o=e.elements;return this.x=o[0]*t+o[3]*n+o[6]*i,this.y=o[1]*t+o[4]*n+o[7]*i,this.z=o[2]*t+o[5]*n+o[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,o=e.elements,r=1/(o[3]*t+o[7]*n+o[11]*i+o[15]);return this.x=(o[0]*t+o[4]*n+o[8]*i+o[12])*r,this.y=(o[1]*t+o[5]*n+o[9]*i+o[13])*r,this.z=(o[2]*t+o[6]*n+o[10]*i+o[14])*r,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,o=e.x,r=e.y,a=e.z,l=e.w,d=2*(r*i-a*n),u=2*(a*t-o*i),c=2*(o*n-r*t);return this.x=t+l*d+r*c-a*u,this.y=n+l*u+a*d-o*c,this.z=i+l*c+o*u-r*d,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i,this.y=o[1]*t+o[5]*n+o[9]*i,this.z=o[2]*t+o[6]*n+o[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar($e(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,o=e.z,r=t.x,a=t.y,l=t.z;return this.x=i*l-o*a,this.y=o*r-n*l,this.z=n*a-i*r,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ur.copy(this).projectOnVector(e),this.sub(Ur)}reflect(e){return this.sub(Ur.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos($e(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ur=new H,ic=new ao;class Ke{constructor(e,t,n,i,o,r,a,l,d){Ke.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,o,r,a,l,d)}set(e,t,n,i,o,r,a,l,d){const u=this.elements;return u[0]=e,u[1]=i,u[2]=a,u[3]=t,u[4]=o,u[5]=l,u[6]=n,u[7]=r,u[8]=d,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,o=this.elements,r=n[0],a=n[3],l=n[6],d=n[1],u=n[4],c=n[7],h=n[2],f=n[5],_=n[8],g=i[0],p=i[3],m=i[6],M=i[1],w=i[4],b=i[7],R=i[2],v=i[5],S=i[8];return o[0]=r*g+a*M+l*R,o[3]=r*p+a*w+l*v,o[6]=r*m+a*b+l*S,o[1]=d*g+u*M+c*R,o[4]=d*p+u*w+c*v,o[7]=d*m+u*b+c*S,o[2]=h*g+f*M+_*R,o[5]=h*p+f*w+_*v,o[8]=h*m+f*b+_*S,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],o=e[3],r=e[4],a=e[5],l=e[6],d=e[7],u=e[8];return t*r*u-t*a*d-n*o*u+n*a*l+i*o*d-i*r*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],o=e[3],r=e[4],a=e[5],l=e[6],d=e[7],u=e[8],c=u*r-a*d,h=a*l-u*o,f=d*o-r*l,_=t*c+n*h+i*f;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/_;return e[0]=c*g,e[1]=(i*d-u*n)*g,e[2]=(a*n-i*r)*g,e[3]=h*g,e[4]=(u*t-i*l)*g,e[5]=(i*o-a*t)*g,e[6]=f*g,e[7]=(n*l-d*t)*g,e[8]=(r*t-n*o)*g,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,o,r,a){const l=Math.cos(o),d=Math.sin(o);return this.set(n*l,n*d,-n*(l*r+d*a)+r+e,-i*d,i*l,-i*(-d*r+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Nr.makeScale(e,t)),this}rotate(e){return this.premultiply(Nr.makeRotation(-e)),this}translate(e,t){return this.premultiply(Nr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Nr=new Ke;function rh(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function hr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function mg(){const s=hr("canvas");return s.style.display="block",s}const sc={};function so(s){s in sc||(sc[s]=!0,console.warn(s))}function gg(s,e,t){return new Promise(function(n,i){function o(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(o,t);break;default:n()}}setTimeout(o,t)})}const oc=new Ke().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),rc=new Ke().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function _g(){const s={enabled:!0,workingColorSpace:Ms,spaces:{},convert:function(i,o,r){return this.enabled===!1||o===r||!o||!r||(this.spaces[o].transfer===gt&&(i.r=$n(i.r),i.g=$n(i.g),i.b=$n(i.b)),this.spaces[o].primaries!==this.spaces[r].primaries&&(i.applyMatrix3(this.spaces[o].toXYZ),i.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===gt&&(i.r=vs(i.r),i.g=vs(i.g),i.b=vs(i.b))),i},workingToColorSpace:function(i,o){return this.convert(i,this.workingColorSpace,o)},colorSpaceToWorking:function(i,o){return this.convert(i,o,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===jn?lr:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,o=this.workingColorSpace){return i.fromArray(this.spaces[o].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,o,r){return i.copy(this.spaces[o].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,o){return so("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,o)},toWorkingColorSpace:function(i,o){return so("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,o)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[Ms]:{primaries:e,whitePoint:n,transfer:lr,toXYZ:oc,fromXYZ:rc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:mn},outputColorSpaceConfig:{drawingBufferColorSpace:mn}},[mn]:{primaries:e,whitePoint:n,transfer:gt,toXYZ:oc,fromXYZ:rc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:mn}}}),s}const ct=_g();function $n(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function vs(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Qi;class vg{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Qi===void 0&&(Qi=hr("canvas")),Qi.width=e.width,Qi.height=e.height;const i=Qi.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Qi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=hr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),o=i.data;for(let r=0;r<o.length;r++)o[r]=$n(o[r]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor($n(t[n]/255)*255):t[n]=$n(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let xg=0;class Ml{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:xg++}),this.uuid=Zn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let o;if(Array.isArray(i)){o=[];for(let r=0,a=i.length;r<a;r++)i[r].isDataTexture?o.push(Br(i[r].image)):o.push(Br(i[r]))}else o=Br(i);n.url=o}return t||(e.images[this.uuid]=n),n}}function Br(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?vg.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Ag=0;const Fr=new H;class tn extends Ss{constructor(e=tn.DEFAULT_IMAGE,t=tn.DEFAULT_MAPPING,n=Ui,i=Ui,o=gn,r=Ni,a=En,l=Vn,d=tn.DEFAULT_ANISOTROPY,u=jn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ag++}),this.uuid=Zn(),this.name="",this.source=new Ml(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=o,this.minFilter=r,this.anisotropy=d,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Je(0,0),this.repeat=new Je(1,1),this.center=new Je(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Fr).x}get height(){return this.source.getSize(Fr).y}get depth(){return this.source.getSize(Fr).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==jd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Zs:e.x=e.x-Math.floor(e.x);break;case Ui:e.x=e.x<0?0:1;break;case Ua:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Zs:e.y=e.y-Math.floor(e.y);break;case Ui:e.y=e.y<0?0:1;break;case Ua:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}tn.DEFAULT_IMAGE=null;tn.DEFAULT_MAPPING=jd;tn.DEFAULT_ANISOTROPY=1;class Ct{constructor(e=0,t=0,n=0,i=1){Ct.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,o=this.w,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i+r[12]*o,this.y=r[1]*t+r[5]*n+r[9]*i+r[13]*o,this.z=r[2]*t+r[6]*n+r[10]*i+r[14]*o,this.w=r[3]*t+r[7]*n+r[11]*i+r[15]*o,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,o;const l=e.elements,d=l[0],u=l[4],c=l[8],h=l[1],f=l[5],_=l[9],g=l[2],p=l[6],m=l[10];if(Math.abs(u-h)<.01&&Math.abs(c-g)<.01&&Math.abs(_-p)<.01){if(Math.abs(u+h)<.1&&Math.abs(c+g)<.1&&Math.abs(_+p)<.1&&Math.abs(d+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const w=(d+1)/2,b=(f+1)/2,R=(m+1)/2,v=(u+h)/4,S=(c+g)/4,C=(_+p)/4;return w>b&&w>R?w<.01?(n=0,i=.707106781,o=.707106781):(n=Math.sqrt(w),i=v/n,o=S/n):b>R?b<.01?(n=.707106781,i=0,o=.707106781):(i=Math.sqrt(b),n=v/i,o=C/i):R<.01?(n=.707106781,i=.707106781,o=0):(o=Math.sqrt(R),n=S/o,i=C/o),this.set(n,i,o,t),this}let M=Math.sqrt((p-_)*(p-_)+(c-g)*(c-g)+(h-u)*(h-u));return Math.abs(M)<.001&&(M=1),this.x=(p-_)/M,this.y=(c-g)/M,this.z=(h-u)/M,this.w=Math.acos((d+f+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this.w=$e(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this.w=$e(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar($e(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class bg extends Ss{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:gn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Ct(0,0,e,t),this.scissorTest=!1,this.viewport=new Ct(0,0,e,t);const i={width:e,height:t,depth:n.depth},o=new tn(i);this.textures=[];const r=n.count;for(let a=0;a<r;a++)this.textures[a]=o.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:gn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,o=this.textures.length;i<o;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isArrayTexture=this.textures[i].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new Ml(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Fi extends bg{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class El extends tn{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=en,this.minFilter=en,this.wrapR=Ui,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class yg extends tn{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=en,this.minFilter=en,this.wrapR=Ui,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class lo{constructor(e=new H(1/0,1/0,1/0),t=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Cn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Cn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Cn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const o=n.getAttribute("position");if(t===!0&&o!==void 0&&e.isInstancedMesh!==!0)for(let r=0,a=o.count;r<a;r++)e.isMesh===!0?e.getVertexPosition(r,Cn):Cn.fromBufferAttribute(o,r),Cn.applyMatrix4(e.matrixWorld),this.expandByPoint(Cn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),vo.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),vo.copy(n.boundingBox)),vo.applyMatrix4(e.matrixWorld),this.union(vo)}const i=e.children;for(let o=0,r=i.length;o<r;o++)this.expandByObject(i[o],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Cn),Cn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Is),xo.subVectors(this.max,Is),ji.subVectors(e.a,Is),Ji.subVectors(e.b,Is),Zi.subVectors(e.c,Is),ri.subVectors(Ji,ji),ai.subVectors(Zi,Ji),bi.subVectors(ji,Zi);let t=[0,-ri.z,ri.y,0,-ai.z,ai.y,0,-bi.z,bi.y,ri.z,0,-ri.x,ai.z,0,-ai.x,bi.z,0,-bi.x,-ri.y,ri.x,0,-ai.y,ai.x,0,-bi.y,bi.x,0];return!Or(t,ji,Ji,Zi,xo)||(t=[1,0,0,0,1,0,0,0,1],!Or(t,ji,Ji,Zi,xo))?!1:(Ao.crossVectors(ri,ai),t=[Ao.x,Ao.y,Ao.z],Or(t,ji,Ji,Zi,xo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Cn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Cn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Wn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Wn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Wn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Wn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Wn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Wn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Wn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Wn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Wn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Wn=[new H,new H,new H,new H,new H,new H,new H,new H],Cn=new H,vo=new lo,ji=new H,Ji=new H,Zi=new H,ri=new H,ai=new H,bi=new H,Is=new H,xo=new H,Ao=new H,yi=new H;function Or(s,e,t,n,i){for(let o=0,r=s.length-3;o<=r;o+=3){yi.fromArray(s,o);const a=i.x*Math.abs(yi.x)+i.y*Math.abs(yi.y)+i.z*Math.abs(yi.z),l=e.dot(yi),d=t.dot(yi),u=n.dot(yi);if(Math.max(-Math.max(l,d,u),Math.min(l,d,u))>a)return!1}return!0}const Mg=new lo,Us=new H,zr=new H;class xr{constructor(e=new H,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Mg.setFromPoints(e).getCenter(n);let i=0;for(let o=0,r=e.length;o<r;o++)i=Math.max(i,n.distanceToSquared(e[o]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Us.subVectors(e,this.center);const t=Us.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Us,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(zr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Us.copy(e.center).add(zr)),this.expandByPoint(Us.copy(e.center).sub(zr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Xn=new H,Vr=new H,bo=new H,li=new H,Gr=new H,yo=new H,Hr=new H;class Eg{constructor(e=new H,t=new H(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Xn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Xn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Xn.copy(this.origin).addScaledVector(this.direction,t),Xn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Vr.copy(e).add(t).multiplyScalar(.5),bo.copy(t).sub(e).normalize(),li.copy(this.origin).sub(Vr);const o=e.distanceTo(t)*.5,r=-this.direction.dot(bo),a=li.dot(this.direction),l=-li.dot(bo),d=li.lengthSq(),u=Math.abs(1-r*r);let c,h,f,_;if(u>0)if(c=r*l-a,h=r*a-l,_=o*u,c>=0)if(h>=-_)if(h<=_){const g=1/u;c*=g,h*=g,f=c*(c+r*h+2*a)+h*(r*c+h+2*l)+d}else h=o,c=Math.max(0,-(r*h+a)),f=-c*c+h*(h+2*l)+d;else h=-o,c=Math.max(0,-(r*h+a)),f=-c*c+h*(h+2*l)+d;else h<=-_?(c=Math.max(0,-(-r*o+a)),h=c>0?-o:Math.min(Math.max(-o,-l),o),f=-c*c+h*(h+2*l)+d):h<=_?(c=0,h=Math.min(Math.max(-o,-l),o),f=h*(h+2*l)+d):(c=Math.max(0,-(r*o+a)),h=c>0?o:Math.min(Math.max(-o,-l),o),f=-c*c+h*(h+2*l)+d);else h=r>0?-o:o,c=Math.max(0,-(r*h+a)),f=-c*c+h*(h+2*l)+d;return n&&n.copy(this.origin).addScaledVector(this.direction,c),i&&i.copy(Vr).addScaledVector(bo,h),f}intersectSphere(e,t){Xn.subVectors(e.center,this.origin);const n=Xn.dot(this.direction),i=Xn.dot(Xn)-n*n,o=e.radius*e.radius;if(i>o)return null;const r=Math.sqrt(o-i),a=n-r,l=n+r;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,o,r,a,l;const d=1/this.direction.x,u=1/this.direction.y,c=1/this.direction.z,h=this.origin;return d>=0?(n=(e.min.x-h.x)*d,i=(e.max.x-h.x)*d):(n=(e.max.x-h.x)*d,i=(e.min.x-h.x)*d),u>=0?(o=(e.min.y-h.y)*u,r=(e.max.y-h.y)*u):(o=(e.max.y-h.y)*u,r=(e.min.y-h.y)*u),n>r||o>i||((o>n||isNaN(n))&&(n=o),(r<i||isNaN(i))&&(i=r),c>=0?(a=(e.min.z-h.z)*c,l=(e.max.z-h.z)*c):(a=(e.max.z-h.z)*c,l=(e.min.z-h.z)*c),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Xn)!==null}intersectTriangle(e,t,n,i,o){Gr.subVectors(t,e),yo.subVectors(n,e),Hr.crossVectors(Gr,yo);let r=this.direction.dot(Hr),a;if(r>0){if(i)return null;a=1}else if(r<0)a=-1,r=-r;else return null;li.subVectors(this.origin,e);const l=a*this.direction.dot(yo.crossVectors(li,yo));if(l<0)return null;const d=a*this.direction.dot(Gr.cross(li));if(d<0||l+d>r)return null;const u=-a*li.dot(Hr);return u<0?null:this.at(u/r,o)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Dt{constructor(e,t,n,i,o,r,a,l,d,u,c,h,f,_,g,p){Dt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,o,r,a,l,d,u,c,h,f,_,g,p)}set(e,t,n,i,o,r,a,l,d,u,c,h,f,_,g,p){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=i,m[1]=o,m[5]=r,m[9]=a,m[13]=l,m[2]=d,m[6]=u,m[10]=c,m[14]=h,m[3]=f,m[7]=_,m[11]=g,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Dt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/$i.setFromMatrixColumn(e,0).length(),o=1/$i.setFromMatrixColumn(e,1).length(),r=1/$i.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*o,t[5]=n[5]*o,t[6]=n[6]*o,t[7]=0,t[8]=n[8]*r,t[9]=n[9]*r,t[10]=n[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,o=e.z,r=Math.cos(n),a=Math.sin(n),l=Math.cos(i),d=Math.sin(i),u=Math.cos(o),c=Math.sin(o);if(e.order==="XYZ"){const h=r*u,f=r*c,_=a*u,g=a*c;t[0]=l*u,t[4]=-l*c,t[8]=d,t[1]=f+_*d,t[5]=h-g*d,t[9]=-a*l,t[2]=g-h*d,t[6]=_+f*d,t[10]=r*l}else if(e.order==="YXZ"){const h=l*u,f=l*c,_=d*u,g=d*c;t[0]=h+g*a,t[4]=_*a-f,t[8]=r*d,t[1]=r*c,t[5]=r*u,t[9]=-a,t[2]=f*a-_,t[6]=g+h*a,t[10]=r*l}else if(e.order==="ZXY"){const h=l*u,f=l*c,_=d*u,g=d*c;t[0]=h-g*a,t[4]=-r*c,t[8]=_+f*a,t[1]=f+_*a,t[5]=r*u,t[9]=g-h*a,t[2]=-r*d,t[6]=a,t[10]=r*l}else if(e.order==="ZYX"){const h=r*u,f=r*c,_=a*u,g=a*c;t[0]=l*u,t[4]=_*d-f,t[8]=h*d+g,t[1]=l*c,t[5]=g*d+h,t[9]=f*d-_,t[2]=-d,t[6]=a*l,t[10]=r*l}else if(e.order==="YZX"){const h=r*l,f=r*d,_=a*l,g=a*d;t[0]=l*u,t[4]=g-h*c,t[8]=_*c+f,t[1]=c,t[5]=r*u,t[9]=-a*u,t[2]=-d*u,t[6]=f*c+_,t[10]=h-g*c}else if(e.order==="XZY"){const h=r*l,f=r*d,_=a*l,g=a*d;t[0]=l*u,t[4]=-c,t[8]=d*u,t[1]=h*c+g,t[5]=r*u,t[9]=f*c-_,t[2]=_*c-f,t[6]=a*u,t[10]=g*c+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Sg,e,wg)}lookAt(e,t,n){const i=this.elements;return hn.subVectors(e,t),hn.lengthSq()===0&&(hn.z=1),hn.normalize(),ci.crossVectors(n,hn),ci.lengthSq()===0&&(Math.abs(n.z)===1?hn.x+=1e-4:hn.z+=1e-4,hn.normalize(),ci.crossVectors(n,hn)),ci.normalize(),Mo.crossVectors(hn,ci),i[0]=ci.x,i[4]=Mo.x,i[8]=hn.x,i[1]=ci.y,i[5]=Mo.y,i[9]=hn.y,i[2]=ci.z,i[6]=Mo.z,i[10]=hn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,o=this.elements,r=n[0],a=n[4],l=n[8],d=n[12],u=n[1],c=n[5],h=n[9],f=n[13],_=n[2],g=n[6],p=n[10],m=n[14],M=n[3],w=n[7],b=n[11],R=n[15],v=i[0],S=i[4],C=i[8],A=i[12],y=i[1],D=i[5],L=i[9],O=i[13],G=i[2],W=i[6],F=i[10],Y=i[14],B=i[3],se=i[7],de=i[11],xe=i[15];return o[0]=r*v+a*y+l*G+d*B,o[4]=r*S+a*D+l*W+d*se,o[8]=r*C+a*L+l*F+d*de,o[12]=r*A+a*O+l*Y+d*xe,o[1]=u*v+c*y+h*G+f*B,o[5]=u*S+c*D+h*W+f*se,o[9]=u*C+c*L+h*F+f*de,o[13]=u*A+c*O+h*Y+f*xe,o[2]=_*v+g*y+p*G+m*B,o[6]=_*S+g*D+p*W+m*se,o[10]=_*C+g*L+p*F+m*de,o[14]=_*A+g*O+p*Y+m*xe,o[3]=M*v+w*y+b*G+R*B,o[7]=M*S+w*D+b*W+R*se,o[11]=M*C+w*L+b*F+R*de,o[15]=M*A+w*O+b*Y+R*xe,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],o=e[12],r=e[1],a=e[5],l=e[9],d=e[13],u=e[2],c=e[6],h=e[10],f=e[14],_=e[3],g=e[7],p=e[11],m=e[15];return _*(+o*l*c-i*d*c-o*a*h+n*d*h+i*a*f-n*l*f)+g*(+t*l*f-t*d*h+o*r*h-i*r*f+i*d*u-o*l*u)+p*(+t*d*c-t*a*f-o*r*c+n*r*f+o*a*u-n*d*u)+m*(-i*a*u-t*l*c+t*a*h+i*r*c-n*r*h+n*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],o=e[3],r=e[4],a=e[5],l=e[6],d=e[7],u=e[8],c=e[9],h=e[10],f=e[11],_=e[12],g=e[13],p=e[14],m=e[15],M=c*p*d-g*h*d+g*l*f-a*p*f-c*l*m+a*h*m,w=_*h*d-u*p*d-_*l*f+r*p*f+u*l*m-r*h*m,b=u*g*d-_*c*d+_*a*f-r*g*f-u*a*m+r*c*m,R=_*c*l-u*g*l-_*a*h+r*g*h+u*a*p-r*c*p,v=t*M+n*w+i*b+o*R;if(v===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const S=1/v;return e[0]=M*S,e[1]=(g*h*o-c*p*o-g*i*f+n*p*f+c*i*m-n*h*m)*S,e[2]=(a*p*o-g*l*o+g*i*d-n*p*d-a*i*m+n*l*m)*S,e[3]=(c*l*o-a*h*o-c*i*d+n*h*d+a*i*f-n*l*f)*S,e[4]=w*S,e[5]=(u*p*o-_*h*o+_*i*f-t*p*f-u*i*m+t*h*m)*S,e[6]=(_*l*o-r*p*o-_*i*d+t*p*d+r*i*m-t*l*m)*S,e[7]=(r*h*o-u*l*o+u*i*d-t*h*d-r*i*f+t*l*f)*S,e[8]=b*S,e[9]=(_*c*o-u*g*o-_*n*f+t*g*f+u*n*m-t*c*m)*S,e[10]=(r*g*o-_*a*o+_*n*d-t*g*d-r*n*m+t*a*m)*S,e[11]=(u*a*o-r*c*o-u*n*d+t*c*d+r*n*f-t*a*f)*S,e[12]=R*S,e[13]=(u*g*i-_*c*i+_*n*h-t*g*h-u*n*p+t*c*p)*S,e[14]=(_*a*i-r*g*i-_*n*l+t*g*l+r*n*p-t*a*p)*S,e[15]=(r*c*i-u*a*i+u*n*l-t*c*l-r*n*h+t*a*h)*S,this}scale(e){const t=this.elements,n=e.x,i=e.y,o=e.z;return t[0]*=n,t[4]*=i,t[8]*=o,t[1]*=n,t[5]*=i,t[9]*=o,t[2]*=n,t[6]*=i,t[10]*=o,t[3]*=n,t[7]*=i,t[11]*=o,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),o=1-n,r=e.x,a=e.y,l=e.z,d=o*r,u=o*a;return this.set(d*r+n,d*a-i*l,d*l+i*a,0,d*a+i*l,u*a+n,u*l-i*r,0,d*l-i*a,u*l+i*r,o*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,o,r){return this.set(1,n,o,0,e,1,r,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,o=t._x,r=t._y,a=t._z,l=t._w,d=o+o,u=r+r,c=a+a,h=o*d,f=o*u,_=o*c,g=r*u,p=r*c,m=a*c,M=l*d,w=l*u,b=l*c,R=n.x,v=n.y,S=n.z;return i[0]=(1-(g+m))*R,i[1]=(f+b)*R,i[2]=(_-w)*R,i[3]=0,i[4]=(f-b)*v,i[5]=(1-(h+m))*v,i[6]=(p+M)*v,i[7]=0,i[8]=(_+w)*S,i[9]=(p-M)*S,i[10]=(1-(h+g))*S,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let o=$i.set(i[0],i[1],i[2]).length();const r=$i.set(i[4],i[5],i[6]).length(),a=$i.set(i[8],i[9],i[10]).length();this.determinant()<0&&(o=-o),e.x=i[12],e.y=i[13],e.z=i[14],Rn.copy(this);const d=1/o,u=1/r,c=1/a;return Rn.elements[0]*=d,Rn.elements[1]*=d,Rn.elements[2]*=d,Rn.elements[4]*=u,Rn.elements[5]*=u,Rn.elements[6]*=u,Rn.elements[8]*=c,Rn.elements[9]*=c,Rn.elements[10]*=c,t.setFromRotationMatrix(Rn),n.x=o,n.y=r,n.z=a,this}makePerspective(e,t,n,i,o,r,a=zn,l=!1){const d=this.elements,u=2*o/(t-e),c=2*o/(n-i),h=(t+e)/(t-e),f=(n+i)/(n-i);let _,g;if(l)_=o/(r-o),g=r*o/(r-o);else if(a===zn)_=-(r+o)/(r-o),g=-2*r*o/(r-o);else if(a===dr)_=-r/(r-o),g=-r*o/(r-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return d[0]=u,d[4]=0,d[8]=h,d[12]=0,d[1]=0,d[5]=c,d[9]=f,d[13]=0,d[2]=0,d[6]=0,d[10]=_,d[14]=g,d[3]=0,d[7]=0,d[11]=-1,d[15]=0,this}makeOrthographic(e,t,n,i,o,r,a=zn,l=!1){const d=this.elements,u=2/(t-e),c=2/(n-i),h=-(t+e)/(t-e),f=-(n+i)/(n-i);let _,g;if(l)_=1/(r-o),g=r/(r-o);else if(a===zn)_=-2/(r-o),g=-(r+o)/(r-o);else if(a===dr)_=-1/(r-o),g=-o/(r-o);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return d[0]=u,d[4]=0,d[8]=0,d[12]=h,d[1]=0,d[5]=c,d[9]=0,d[13]=f,d[2]=0,d[6]=0,d[10]=_,d[14]=g,d[3]=0,d[7]=0,d[11]=0,d[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const $i=new H,Rn=new Dt,Sg=new H(0,0,0),wg=new H(1,1,1),ci=new H,Mo=new H,hn=new H,ac=new Dt,lc=new ao;class ti{constructor(e=0,t=0,n=0,i=ti.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,o=i[0],r=i[4],a=i[8],l=i[1],d=i[5],u=i[9],c=i[2],h=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin($e(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-r,o)):(this._x=Math.atan2(h,d),this._z=0);break;case"YXZ":this._x=Math.asin(-$e(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,d)):(this._y=Math.atan2(-c,o),this._z=0);break;case"ZXY":this._x=Math.asin($e(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-c,f),this._z=Math.atan2(-r,d)):(this._y=0,this._z=Math.atan2(l,o));break;case"ZYX":this._y=Math.asin(-$e(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(l,o)):(this._x=0,this._z=Math.atan2(-r,d));break;case"YZX":this._z=Math.asin($e(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,d),this._y=Math.atan2(-c,o)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-$e(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(h,d),this._y=Math.atan2(a,o)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ac.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ac,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return lc.setFromEuler(this),this.setFromQuaternion(lc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ti.DEFAULT_ORDER="XYZ";class ah{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Tg=0;const cc=new H,es=new ao,Yn=new Dt,Eo=new H,Ns=new H,Cg=new H,Rg=new ao,dc=new H(1,0,0),hc=new H(0,1,0),uc=new H(0,0,1),fc={type:"added"},kg={type:"removed"},ts={type:"childadded",child:null},Wr={type:"childremoved",child:null};class on extends Ss{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Tg++}),this.uuid=Zn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=on.DEFAULT_UP.clone();const e=new H,t=new ti,n=new ao,i=new H(1,1,1);function o(){n.setFromEuler(t,!1)}function r(){t.setFromQuaternion(n,void 0,!1)}t._onChange(o),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Dt},normalMatrix:{value:new Ke}}),this.matrix=new Dt,this.matrixWorld=new Dt,this.matrixAutoUpdate=on.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=on.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ah,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return es.setFromAxisAngle(e,t),this.quaternion.multiply(es),this}rotateOnWorldAxis(e,t){return es.setFromAxisAngle(e,t),this.quaternion.premultiply(es),this}rotateX(e){return this.rotateOnAxis(dc,e)}rotateY(e){return this.rotateOnAxis(hc,e)}rotateZ(e){return this.rotateOnAxis(uc,e)}translateOnAxis(e,t){return cc.copy(e).applyQuaternion(this.quaternion),this.position.add(cc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(dc,e)}translateY(e){return this.translateOnAxis(hc,e)}translateZ(e){return this.translateOnAxis(uc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Yn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Eo.copy(e):Eo.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Ns.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Yn.lookAt(Ns,Eo,this.up):Yn.lookAt(Eo,Ns,this.up),this.quaternion.setFromRotationMatrix(Yn),i&&(Yn.extractRotation(i.matrixWorld),es.setFromRotationMatrix(Yn),this.quaternion.premultiply(es.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(fc),ts.child=e,this.dispatchEvent(ts),ts.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(kg),Wr.child=e,this.dispatchEvent(Wr),Wr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Yn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Yn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Yn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(fc),ts.child=e,this.dispatchEvent(ts),ts.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let o=0,r=i.length;o<r;o++)i[o].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ns,e,Cg),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ns,Rg,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let o=0,r=i.length;o<r;o++)i[o].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function o(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=o(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let d=0,u=l.length;d<u;d++){const c=l[d];o(e.shapes,c)}else o(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,d=this.material.length;l<d;l++)a.push(o(e.materials,this.material[l]));i.material=a}else i.material=o(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(o(e.animations,l))}}if(t){const a=r(e.geometries),l=r(e.materials),d=r(e.textures),u=r(e.images),c=r(e.shapes),h=r(e.skeletons),f=r(e.animations),_=r(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),d.length>0&&(n.textures=d),u.length>0&&(n.images=u),c.length>0&&(n.shapes=c),h.length>0&&(n.skeletons=h),f.length>0&&(n.animations=f),_.length>0&&(n.nodes=_)}return n.object=i,n;function r(a){const l=[];for(const d in a){const u=a[d];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}on.DEFAULT_UP=new H(0,1,0);on.DEFAULT_MATRIX_AUTO_UPDATE=!0;on.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const kn=new H,qn=new H,Xr=new H,Kn=new H,ns=new H,is=new H,pc=new H,Yr=new H,qr=new H,Kr=new H,Qr=new Ct,jr=new Ct,Jr=new Ct;class Mn{constructor(e=new H,t=new H,n=new H){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),kn.subVectors(e,t),i.cross(kn);const o=i.lengthSq();return o>0?i.multiplyScalar(1/Math.sqrt(o)):i.set(0,0,0)}static getBarycoord(e,t,n,i,o){kn.subVectors(i,t),qn.subVectors(n,t),Xr.subVectors(e,t);const r=kn.dot(kn),a=kn.dot(qn),l=kn.dot(Xr),d=qn.dot(qn),u=qn.dot(Xr),c=r*d-a*a;if(c===0)return o.set(0,0,0),null;const h=1/c,f=(d*l-a*u)*h,_=(r*u-a*l)*h;return o.set(1-f-_,_,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Kn)===null?!1:Kn.x>=0&&Kn.y>=0&&Kn.x+Kn.y<=1}static getInterpolation(e,t,n,i,o,r,a,l){return this.getBarycoord(e,t,n,i,Kn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(o,Kn.x),l.addScaledVector(r,Kn.y),l.addScaledVector(a,Kn.z),l)}static getInterpolatedAttribute(e,t,n,i,o,r){return Qr.setScalar(0),jr.setScalar(0),Jr.setScalar(0),Qr.fromBufferAttribute(e,t),jr.fromBufferAttribute(e,n),Jr.fromBufferAttribute(e,i),r.setScalar(0),r.addScaledVector(Qr,o.x),r.addScaledVector(jr,o.y),r.addScaledVector(Jr,o.z),r}static isFrontFacing(e,t,n,i){return kn.subVectors(n,t),qn.subVectors(e,t),kn.cross(qn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return kn.subVectors(this.c,this.b),qn.subVectors(this.a,this.b),kn.cross(qn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Mn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Mn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,o){return Mn.getInterpolation(e,this.a,this.b,this.c,t,n,i,o)}containsPoint(e){return Mn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Mn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,o=this.c;let r,a;ns.subVectors(i,n),is.subVectors(o,n),Yr.subVectors(e,n);const l=ns.dot(Yr),d=is.dot(Yr);if(l<=0&&d<=0)return t.copy(n);qr.subVectors(e,i);const u=ns.dot(qr),c=is.dot(qr);if(u>=0&&c<=u)return t.copy(i);const h=l*c-u*d;if(h<=0&&l>=0&&u<=0)return r=l/(l-u),t.copy(n).addScaledVector(ns,r);Kr.subVectors(e,o);const f=ns.dot(Kr),_=is.dot(Kr);if(_>=0&&f<=_)return t.copy(o);const g=f*d-l*_;if(g<=0&&d>=0&&_<=0)return a=d/(d-_),t.copy(n).addScaledVector(is,a);const p=u*_-f*c;if(p<=0&&c-u>=0&&f-_>=0)return pc.subVectors(o,i),a=(c-u)/(c-u+(f-_)),t.copy(i).addScaledVector(pc,a);const m=1/(p+g+h);return r=g*m,a=h*m,t.copy(n).addScaledVector(ns,r).addScaledVector(is,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const lh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},di={h:0,s:0,l:0},So={h:0,s:0,l:0};function Zr(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class je{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=mn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ct.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=ct.workingColorSpace){return this.r=e,this.g=t,this.b=n,ct.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=ct.workingColorSpace){if(e=yl(e,1),t=$e(t,0,1),n=$e(n,0,1),t===0)this.r=this.g=this.b=n;else{const o=n<=.5?n*(1+t):n+t-n*t,r=2*n-o;this.r=Zr(r,o,e+1/3),this.g=Zr(r,o,e),this.b=Zr(r,o,e-1/3)}return ct.colorSpaceToWorking(this,i),this}setStyle(e,t=mn){function n(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let o;const r=i[1],a=i[2];switch(r){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,t);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,t);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const o=i[1],r=o.length;if(r===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,t);if(r===6)return this.setHex(parseInt(o,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=mn){const n=lh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=$n(e.r),this.g=$n(e.g),this.b=$n(e.b),this}copyLinearToSRGB(e){return this.r=vs(e.r),this.g=vs(e.g),this.b=vs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=mn){return ct.workingToColorSpace(qt.copy(this),e),Math.round($e(qt.r*255,0,255))*65536+Math.round($e(qt.g*255,0,255))*256+Math.round($e(qt.b*255,0,255))}getHexString(e=mn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ct.workingColorSpace){ct.workingToColorSpace(qt.copy(this),t);const n=qt.r,i=qt.g,o=qt.b,r=Math.max(n,i,o),a=Math.min(n,i,o);let l,d;const u=(a+r)/2;if(a===r)l=0,d=0;else{const c=r-a;switch(d=u<=.5?c/(r+a):c/(2-r-a),r){case n:l=(i-o)/c+(i<o?6:0);break;case i:l=(o-n)/c+2;break;case o:l=(n-i)/c+4;break}l/=6}return e.h=l,e.s=d,e.l=u,e}getRGB(e,t=ct.workingColorSpace){return ct.workingToColorSpace(qt.copy(this),t),e.r=qt.r,e.g=qt.g,e.b=qt.b,e}getStyle(e=mn){ct.workingToColorSpace(qt.copy(this),e);const t=qt.r,n=qt.g,i=qt.b;return e!==mn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(di),this.setHSL(di.h+e,di.s+t,di.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(di),e.getHSL(So);const n=Qs(di.h,So.h,t),i=Qs(di.s,So.s,t),o=Qs(di.l,So.l,t);return this.setHSL(n,i,o),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,o=e.elements;return this.r=o[0]*t+o[3]*n+o[6]*i,this.g=o[1]*t+o[4]*n+o[7]*i,this.b=o[2]*t+o[5]*n+o[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const qt=new je;je.NAMES=lh;let Dg=0;class co extends Ss{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Dg++}),this.uuid=Zn(),this.name="",this.type="Material",this.blending=_s,this.side=ei,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ea,this.blendDst=Sa,this.blendEquation=Pi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new je(0,0,0),this.blendAlpha=0,this.depthFunc=As,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=tc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ki,this.stencilZFail=Ki,this.stencilZPass=Ki,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==_s&&(n.blending=this.blending),this.side!==ei&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ea&&(n.blendSrc=this.blendSrc),this.blendDst!==Sa&&(n.blendDst=this.blendDst),this.blendEquation!==Pi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==As&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==tc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ki&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ki&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ki&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(o){const r=[];for(const a in o){const l=o[a];delete l.metadata,r.push(l)}return r}if(t){const o=i(e.textures),r=i(e.images);o.length>0&&(n.textures=o),r.length>0&&(n.images=r)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let o=0;o!==i;++o)n[o]=t[o].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class zt extends co{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new je(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ti,this.combine=Qd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const kt=new H,wo=new Je;let Lg=0;class Qt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Lg++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=dl,this.updateRanges=[],this.gpuType=Jn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,o=this.itemSize;i<o;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)wo.fromBufferAttribute(this,t),wo.applyMatrix3(e),this.setXY(t,wo.x,wo.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.applyMatrix3(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.applyMatrix4(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.applyNormalMatrix(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.transformDirection(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=In(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=pt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=In(t,this.array)),t}setX(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=In(t,this.array)),t}setY(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=In(t,this.array)),t}setZ(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=In(t,this.array)),t}setW(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),i=pt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,o){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),i=pt(i,this.array),o=pt(o,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=o,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==dl&&(e.usage=this.usage),e}}class ch extends Qt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class dh extends Qt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Vt extends Qt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Pg=0;const An=new Dt,$r=new on,ss=new H,un=new lo,Bs=new lo,Bt=new H;class rn extends Ss{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Pg++}),this.uuid=Zn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(rh(e)?dh:ch)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const o=new Ke().getNormalMatrix(e);n.applyNormalMatrix(o),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return An.makeRotationFromQuaternion(e),this.applyMatrix4(An),this}rotateX(e){return An.makeRotationX(e),this.applyMatrix4(An),this}rotateY(e){return An.makeRotationY(e),this.applyMatrix4(An),this}rotateZ(e){return An.makeRotationZ(e),this.applyMatrix4(An),this}translate(e,t,n){return An.makeTranslation(e,t,n),this.applyMatrix4(An),this}scale(e,t,n){return An.makeScale(e,t,n),this.applyMatrix4(An),this}lookAt(e){return $r.lookAt(e),$r.updateMatrix(),this.applyMatrix4($r.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ss).negate(),this.translate(ss.x,ss.y,ss.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,o=e.length;i<o;i++){const r=e[i];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new Vt(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const o=e[i];t.setXYZ(i,o.x,o.y,o.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new lo);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const o=t[n];un.setFromBufferAttribute(o),this.morphTargetsRelative?(Bt.addVectors(this.boundingBox.min,un.min),this.boundingBox.expandByPoint(Bt),Bt.addVectors(this.boundingBox.max,un.max),this.boundingBox.expandByPoint(Bt)):(this.boundingBox.expandByPoint(un.min),this.boundingBox.expandByPoint(un.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new xr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new H,1/0);return}if(e){const n=this.boundingSphere.center;if(un.setFromBufferAttribute(e),t)for(let o=0,r=t.length;o<r;o++){const a=t[o];Bs.setFromBufferAttribute(a),this.morphTargetsRelative?(Bt.addVectors(un.min,Bs.min),un.expandByPoint(Bt),Bt.addVectors(un.max,Bs.max),un.expandByPoint(Bt)):(un.expandByPoint(Bs.min),un.expandByPoint(Bs.max))}un.getCenter(n);let i=0;for(let o=0,r=e.count;o<r;o++)Bt.fromBufferAttribute(e,o),i=Math.max(i,n.distanceToSquared(Bt));if(t)for(let o=0,r=t.length;o<r;o++){const a=t[o],l=this.morphTargetsRelative;for(let d=0,u=a.count;d<u;d++)Bt.fromBufferAttribute(a,d),l&&(ss.fromBufferAttribute(e,d),Bt.add(ss)),i=Math.max(i,n.distanceToSquared(Bt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,o=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Qt(new Float32Array(4*n.count),4));const r=this.getAttribute("tangent"),a=[],l=[];for(let C=0;C<n.count;C++)a[C]=new H,l[C]=new H;const d=new H,u=new H,c=new H,h=new Je,f=new Je,_=new Je,g=new H,p=new H;function m(C,A,y){d.fromBufferAttribute(n,C),u.fromBufferAttribute(n,A),c.fromBufferAttribute(n,y),h.fromBufferAttribute(o,C),f.fromBufferAttribute(o,A),_.fromBufferAttribute(o,y),u.sub(d),c.sub(d),f.sub(h),_.sub(h);const D=1/(f.x*_.y-_.x*f.y);isFinite(D)&&(g.copy(u).multiplyScalar(_.y).addScaledVector(c,-f.y).multiplyScalar(D),p.copy(c).multiplyScalar(f.x).addScaledVector(u,-_.x).multiplyScalar(D),a[C].add(g),a[A].add(g),a[y].add(g),l[C].add(p),l[A].add(p),l[y].add(p))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let C=0,A=M.length;C<A;++C){const y=M[C],D=y.start,L=y.count;for(let O=D,G=D+L;O<G;O+=3)m(e.getX(O+0),e.getX(O+1),e.getX(O+2))}const w=new H,b=new H,R=new H,v=new H;function S(C){R.fromBufferAttribute(i,C),v.copy(R);const A=a[C];w.copy(A),w.sub(R.multiplyScalar(R.dot(A))).normalize(),b.crossVectors(v,A);const D=b.dot(l[C])<0?-1:1;r.setXYZW(C,w.x,w.y,w.z,D)}for(let C=0,A=M.length;C<A;++C){const y=M[C],D=y.start,L=y.count;for(let O=D,G=D+L;O<G;O+=3)S(e.getX(O+0)),S(e.getX(O+1)),S(e.getX(O+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Qt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,f=n.count;h<f;h++)n.setXYZ(h,0,0,0);const i=new H,o=new H,r=new H,a=new H,l=new H,d=new H,u=new H,c=new H;if(e)for(let h=0,f=e.count;h<f;h+=3){const _=e.getX(h+0),g=e.getX(h+1),p=e.getX(h+2);i.fromBufferAttribute(t,_),o.fromBufferAttribute(t,g),r.fromBufferAttribute(t,p),u.subVectors(r,o),c.subVectors(i,o),u.cross(c),a.fromBufferAttribute(n,_),l.fromBufferAttribute(n,g),d.fromBufferAttribute(n,p),a.add(u),l.add(u),d.add(u),n.setXYZ(_,a.x,a.y,a.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(p,d.x,d.y,d.z)}else for(let h=0,f=t.count;h<f;h+=3)i.fromBufferAttribute(t,h+0),o.fromBufferAttribute(t,h+1),r.fromBufferAttribute(t,h+2),u.subVectors(r,o),c.subVectors(i,o),u.cross(c),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Bt.fromBufferAttribute(e,t),Bt.normalize(),e.setXYZ(t,Bt.x,Bt.y,Bt.z)}toNonIndexed(){function e(a,l){const d=a.array,u=a.itemSize,c=a.normalized,h=new d.constructor(l.length*u);let f=0,_=0;for(let g=0,p=l.length;g<p;g++){a.isInterleavedBufferAttribute?f=l[g]*a.data.stride+a.offset:f=l[g]*u;for(let m=0;m<u;m++)h[_++]=d[f++]}return new Qt(h,u,c)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new rn,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],d=e(l,n);t.setAttribute(a,d)}const o=this.morphAttributes;for(const a in o){const l=[],d=o[a];for(let u=0,c=d.length;u<c;u++){const h=d[u],f=e(h,n);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let a=0,l=r.length;a<l;a++){const d=r[a];t.addGroup(d.start,d.count,d.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const d in l)l[d]!==void 0&&(e[d]=l[d]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const d=n[l];e.data.attributes[l]=d.toJSON(e.data)}const i={};let o=!1;for(const l in this.morphAttributes){const d=this.morphAttributes[l],u=[];for(let c=0,h=d.length;c<h;c++){const f=d[c];u.push(f.toJSON(e.data))}u.length>0&&(i[l]=u,o=!0)}o&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const d in i){const u=i[d];this.setAttribute(d,u.clone(t))}const o=e.morphAttributes;for(const d in o){const u=[],c=o[d];for(let h=0,f=c.length;h<f;h++)u.push(c[h].clone(t));this.morphAttributes[d]=u}this.morphTargetsRelative=e.morphTargetsRelative;const r=e.groups;for(let d=0,u=r.length;d<u;d++){const c=r[d];this.addGroup(c.start,c.count,c.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const mc=new Dt,Mi=new Eg,To=new xr,gc=new H,Co=new H,Ro=new H,ko=new H,ea=new H,Do=new H,_c=new H,Lo=new H;class dt extends on{constructor(e=new rn,t=new zt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,r=i.length;o<r;o++){const a=i[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,o=n.morphAttributes.position,r=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const a=this.morphTargetInfluences;if(o&&a){Do.set(0,0,0);for(let l=0,d=o.length;l<d;l++){const u=a[l],c=o[l];u!==0&&(ea.fromBufferAttribute(c,e),r?Do.addScaledVector(ea,u):Do.addScaledVector(ea.sub(t),u))}t.add(Do)}return t}raycast(e,t){const n=this.geometry,i=this.material,o=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),To.copy(n.boundingSphere),To.applyMatrix4(o),Mi.copy(e.ray).recast(e.near),!(To.containsPoint(Mi.origin)===!1&&(Mi.intersectSphere(To,gc)===null||Mi.origin.distanceToSquared(gc)>(e.far-e.near)**2))&&(mc.copy(o).invert(),Mi.copy(e.ray).applyMatrix4(mc),!(n.boundingBox!==null&&Mi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Mi)))}_computeIntersections(e,t,n){let i;const o=this.geometry,r=this.material,a=o.index,l=o.attributes.position,d=o.attributes.uv,u=o.attributes.uv1,c=o.attributes.normal,h=o.groups,f=o.drawRange;if(a!==null)if(Array.isArray(r))for(let _=0,g=h.length;_<g;_++){const p=h[_],m=r[p.materialIndex],M=Math.max(p.start,f.start),w=Math.min(a.count,Math.min(p.start+p.count,f.start+f.count));for(let b=M,R=w;b<R;b+=3){const v=a.getX(b),S=a.getX(b+1),C=a.getX(b+2);i=Po(this,m,e,n,d,u,c,v,S,C),i&&(i.faceIndex=Math.floor(b/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const _=Math.max(0,f.start),g=Math.min(a.count,f.start+f.count);for(let p=_,m=g;p<m;p+=3){const M=a.getX(p),w=a.getX(p+1),b=a.getX(p+2);i=Po(this,r,e,n,d,u,c,M,w,b),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(r))for(let _=0,g=h.length;_<g;_++){const p=h[_],m=r[p.materialIndex],M=Math.max(p.start,f.start),w=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let b=M,R=w;b<R;b+=3){const v=b,S=b+1,C=b+2;i=Po(this,m,e,n,d,u,c,v,S,C),i&&(i.faceIndex=Math.floor(b/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const _=Math.max(0,f.start),g=Math.min(l.count,f.start+f.count);for(let p=_,m=g;p<m;p+=3){const M=p,w=p+1,b=p+2;i=Po(this,r,e,n,d,u,c,M,w,b),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}}}function Ig(s,e,t,n,i,o,r,a){let l;if(e.side===$t?l=n.intersectTriangle(r,o,i,!0,a):l=n.intersectTriangle(i,o,r,e.side===ei,a),l===null)return null;Lo.copy(a),Lo.applyMatrix4(s.matrixWorld);const d=t.ray.origin.distanceTo(Lo);return d<t.near||d>t.far?null:{distance:d,point:Lo.clone(),object:s}}function Po(s,e,t,n,i,o,r,a,l,d){s.getVertexPosition(a,Co),s.getVertexPosition(l,Ro),s.getVertexPosition(d,ko);const u=Ig(s,e,t,n,Co,Ro,ko,_c);if(u){const c=new H;Mn.getBarycoord(_c,Co,Ro,ko,c),i&&(u.uv=Mn.getInterpolatedAttribute(i,a,l,d,c,new Je)),o&&(u.uv1=Mn.getInterpolatedAttribute(o,a,l,d,c,new Je)),r&&(u.normal=Mn.getInterpolatedAttribute(r,a,l,d,c,new H),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const h={a,b:l,c:d,normal:new H,materialIndex:0};Mn.getNormal(Co,Ro,ko,h.normal),u.face=h,u.barycoord=c}return u}class Un extends rn{constructor(e=1,t=1,n=1,i=1,o=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:o,depthSegments:r};const a=this;i=Math.floor(i),o=Math.floor(o),r=Math.floor(r);const l=[],d=[],u=[],c=[];let h=0,f=0;_("z","y","x",-1,-1,n,t,e,r,o,0),_("z","y","x",1,-1,n,t,-e,r,o,1),_("x","z","y",1,1,e,n,t,i,r,2),_("x","z","y",1,-1,e,n,-t,i,r,3),_("x","y","z",1,-1,e,t,n,i,o,4),_("x","y","z",-1,-1,e,t,-n,i,o,5),this.setIndex(l),this.setAttribute("position",new Vt(d,3)),this.setAttribute("normal",new Vt(u,3)),this.setAttribute("uv",new Vt(c,2));function _(g,p,m,M,w,b,R,v,S,C,A){const y=b/S,D=R/C,L=b/2,O=R/2,G=v/2,W=S+1,F=C+1;let Y=0,B=0;const se=new H;for(let de=0;de<F;de++){const xe=de*D-O;for(let Oe=0;Oe<W;Oe++){const Me=Oe*y-L;se[g]=Me*M,se[p]=xe*w,se[m]=G,d.push(se.x,se.y,se.z),se[g]=0,se[p]=0,se[m]=v>0?1:-1,u.push(se.x,se.y,se.z),c.push(Oe/S),c.push(1-de/C),Y+=1}}for(let de=0;de<C;de++)for(let xe=0;xe<S;xe++){const Oe=h+xe+W*de,Me=h+xe+W*(de+1),Z=h+(xe+1)+W*(de+1),Pe=h+(xe+1)+W*de;l.push(Oe,Me,Pe),l.push(Me,Z,Pe),B+=6}a.addGroup(f,B,A),f+=B,h+=Y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Un(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Es(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Zt(s){const e={};for(let t=0;t<s.length;t++){const n=Es(s[t]);for(const i in n)e[i]=n[i]}return e}function Ug(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function hh(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ct.workingColorSpace}const Ng={clone:Es,merge:Zt};var Bg=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Fg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Gn extends co{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Bg,this.fragmentShader=Fg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Es(e.uniforms),this.uniformsGroups=Ug(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const r=this.uniforms[i].value;r&&r.isTexture?t.uniforms[i]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[i]={type:"c",value:r.getHex()}:r&&r.isVector2?t.uniforms[i]={type:"v2",value:r.toArray()}:r&&r.isVector3?t.uniforms[i]={type:"v3",value:r.toArray()}:r&&r.isVector4?t.uniforms[i]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?t.uniforms[i]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?t.uniforms[i]={type:"m4",value:r.toArray()}:t.uniforms[i]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class uh extends on{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Dt,this.projectionMatrix=new Dt,this.projectionMatrixInverse=new Dt,this.coordinateSystem=zn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const hi=new H,vc=new Je,xc=new Je;class yn extends uh{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=io*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ks*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return io*2*Math.atan(Math.tan(Ks*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){hi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(hi.x,hi.y).multiplyScalar(-e/hi.z),hi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(hi.x,hi.y).multiplyScalar(-e/hi.z)}getViewSize(e,t){return this.getViewBounds(e,vc,xc),t.subVectors(xc,vc)}setViewOffset(e,t,n,i,o,r){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=o,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ks*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,o=-.5*i;const r=this.view;if(this.view!==null&&this.view.enabled){const l=r.fullWidth,d=r.fullHeight;o+=r.offsetX*i/l,t-=r.offsetY*n/d,i*=r.width/l,n*=r.height/d}const a=this.filmOffset;a!==0&&(o+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const os=-90,rs=1;class Og extends on{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new yn(os,rs,e,t);i.layers=this.layers,this.add(i);const o=new yn(os,rs,e,t);o.layers=this.layers,this.add(o);const r=new yn(os,rs,e,t);r.layers=this.layers,this.add(r);const a=new yn(os,rs,e,t);a.layers=this.layers,this.add(a);const l=new yn(os,rs,e,t);l.layers=this.layers,this.add(l);const d=new yn(os,rs,e,t);d.layers=this.layers,this.add(d)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,o,r,a,l]=t;for(const d of t)this.remove(d);if(e===zn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===dr)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const d of t)this.add(d),d.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[o,r,a,l,d,u]=this.children,c=e.getRenderTarget(),h=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,o),e.setRenderTarget(n,1,i),e.render(t,r),e.setRenderTarget(n,2,i),e.render(t,a),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,d),n.texture.generateMipmaps=g,e.setRenderTarget(n,5,i),e.render(t,u),e.setRenderTarget(c,h,f),e.xr.enabled=_,n.texture.needsPMREMUpdate=!0}}class fh extends tn{constructor(e=[],t=bs,n,i,o,r,a,l,d,u){super(e,t,n,i,o,r,a,l,d,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class zg extends Fi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new fh(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Un(5,5,5),o=new Gn({name:"CubemapFromEquirect",uniforms:Es(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:$t,blending:pi});o.uniforms.tEquirect.value=t;const r=new dt(i,o),a=t.minFilter;return t.minFilter===Ni&&(t.minFilter=gn),new Og(1,10,this).update(e,r),t.minFilter=a,r.geometry.dispose(),r.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const o=e.getRenderTarget();for(let r=0;r<6;r++)e.setRenderTarget(this,r),e.clear(t,n,i);e.setRenderTarget(o)}}class Et extends on{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Vg={type:"move"};class ta{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Et,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Et,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Et,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,o=null,r=null;const a=this._targetRay,l=this._grip,d=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(d&&e.hand){r=!0;for(const g of e.hand.values()){const p=t.getJointPose(g,n),m=this._getHandJoint(d,g);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const u=d.joints["index-finger-tip"],c=d.joints["thumb-tip"],h=u.position.distanceTo(c.position),f=.02,_=.005;d.inputState.pinching&&h>f+_?(d.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!d.inputState.pinching&&h<=f-_&&(d.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(o=t.getPose(e.gripSpace,n),o!==null&&(l.matrix.fromArray(o.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,o.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(o.linearVelocity)):l.hasLinearVelocity=!1,o.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(o.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&o!==null&&(i=o),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Vg)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=o!==null),d!==null&&(d.visible=r!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Et;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class ph extends on{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ti,this.environmentIntensity=1,this.environmentRotation=new ti,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Gg{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=dl,this.updateRanges=[],this.version=0,this.uuid=Zn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,o=this.stride;i<o;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Zn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Zn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Jt=new H;class ur{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.applyMatrix4(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.applyNormalMatrix(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.transformDirection(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=In(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=pt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=pt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=pt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=pt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=pt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=In(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=In(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=In(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=In(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),i=pt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,o){return e=e*this.data.stride+this.offset,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),i=pt(i,this.array),o=pt(o,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=o,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let o=0;o<this.itemSize;o++)t.push(this.data.array[i+o])}return new Qt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new ur(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let o=0;o<this.itemSize;o++)t.push(this.data.array[i+o])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Sl extends co{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new je(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let as;const Fs=new H,ls=new H,cs=new H,ds=new Je,Os=new Je,mh=new Dt,Io=new H,zs=new H,Uo=new H,Ac=new Je,na=new Je,bc=new Je;class wl extends on{constructor(e=new Sl){if(super(),this.isSprite=!0,this.type="Sprite",as===void 0){as=new rn;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Gg(t,5);as.setIndex([0,1,2,0,2,3]),as.setAttribute("position",new ur(n,3,0,!1)),as.setAttribute("uv",new ur(n,2,3,!1))}this.geometry=as,this.material=e,this.center=new Je(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ls.setFromMatrixScale(this.matrixWorld),mh.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),cs.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ls.multiplyScalar(-cs.z);const n=this.material.rotation;let i,o;n!==0&&(o=Math.cos(n),i=Math.sin(n));const r=this.center;No(Io.set(-.5,-.5,0),cs,r,ls,i,o),No(zs.set(.5,-.5,0),cs,r,ls,i,o),No(Uo.set(.5,.5,0),cs,r,ls,i,o),Ac.set(0,0),na.set(1,0),bc.set(1,1);let a=e.ray.intersectTriangle(Io,zs,Uo,!1,Fs);if(a===null&&(No(zs.set(-.5,.5,0),cs,r,ls,i,o),na.set(0,1),a=e.ray.intersectTriangle(Io,Uo,zs,!1,Fs),a===null))return;const l=e.ray.origin.distanceTo(Fs);l<e.near||l>e.far||t.push({distance:l,point:Fs.clone(),uv:Mn.getInterpolation(Fs,Io,zs,Uo,Ac,na,bc,new Je),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function No(s,e,t,n,i,o){ds.subVectors(s,t).addScalar(.5).multiply(n),i!==void 0?(Os.x=o*ds.x-i*ds.y,Os.y=i*ds.x+o*ds.y):Os.copy(ds),s.copy(e),s.x+=Os.x,s.y+=Os.y,s.applyMatrix4(mh)}const ia=new H,Hg=new H,Wg=new Ke;class Di{constructor(e=new H(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=ia.subVectors(n,t).cross(Hg.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(ia),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const o=-(e.start.dot(this.normal)+this.constant)/i;return o<0||o>1?null:t.copy(e.start).addScaledVector(n,o)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Wg.getNormalMatrix(e),i=this.coplanarPoint(ia).applyMatrix4(e),o=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(o),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ei=new xr,Xg=new Je(.5,.5),Bo=new H;class gh{constructor(e=new Di,t=new Di,n=new Di,i=new Di,o=new Di,r=new Di){this.planes=[e,t,n,i,o,r]}set(e,t,n,i,o,r){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(o),a[5].copy(r),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=zn,n=!1){const i=this.planes,o=e.elements,r=o[0],a=o[1],l=o[2],d=o[3],u=o[4],c=o[5],h=o[6],f=o[7],_=o[8],g=o[9],p=o[10],m=o[11],M=o[12],w=o[13],b=o[14],R=o[15];if(i[0].setComponents(d-r,f-u,m-_,R-M).normalize(),i[1].setComponents(d+r,f+u,m+_,R+M).normalize(),i[2].setComponents(d+a,f+c,m+g,R+w).normalize(),i[3].setComponents(d-a,f-c,m-g,R-w).normalize(),n)i[4].setComponents(l,h,p,b).normalize(),i[5].setComponents(d-l,f-h,m-p,R-b).normalize();else if(i[4].setComponents(d-l,f-h,m-p,R-b).normalize(),t===zn)i[5].setComponents(d+l,f+h,m+p,R+b).normalize();else if(t===dr)i[5].setComponents(l,h,p,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ei.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ei.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ei)}intersectsSprite(e){Ei.center.set(0,0,0);const t=Xg.distanceTo(e.center);return Ei.radius=.7071067811865476+t,Ei.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ei)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let o=0;o<6;o++)if(t[o].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Bo.x=i.normal.x>0?e.max.x:e.min.x,Bo.y=i.normal.y>0?e.max.y:e.min.y,Bo.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Bo)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Ar extends tn{constructor(e,t,n,i,o,r,a,l,d){super(e,t,n,i,o,r,a,l,d),this.isCanvasTexture=!0,this.needsUpdate=!0}}class _h extends tn{constructor(e,t,n=Bi,i,o,r,a=en,l=en,d,u=to,c=1){if(u!==to&&u!==no)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:e,height:t,depth:c};super(h,i,o,r,a,l,u,n,d),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ml(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class vh extends tn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Tl extends rn{constructor(e=1,t=1,n=1,i=32,o=1,r=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:o,openEnded:r,thetaStart:a,thetaLength:l};const d=this;i=Math.floor(i),o=Math.floor(o);const u=[],c=[],h=[],f=[];let _=0;const g=[],p=n/2;let m=0;M(),r===!1&&(e>0&&w(!0),t>0&&w(!1)),this.setIndex(u),this.setAttribute("position",new Vt(c,3)),this.setAttribute("normal",new Vt(h,3)),this.setAttribute("uv",new Vt(f,2));function M(){const b=new H,R=new H;let v=0;const S=(t-e)/n;for(let C=0;C<=o;C++){const A=[],y=C/o,D=y*(t-e)+e;for(let L=0;L<=i;L++){const O=L/i,G=O*l+a,W=Math.sin(G),F=Math.cos(G);R.x=D*W,R.y=-y*n+p,R.z=D*F,c.push(R.x,R.y,R.z),b.set(W,S,F).normalize(),h.push(b.x,b.y,b.z),f.push(O,1-y),A.push(_++)}g.push(A)}for(let C=0;C<i;C++)for(let A=0;A<o;A++){const y=g[A][C],D=g[A+1][C],L=g[A+1][C+1],O=g[A][C+1];(e>0||A!==0)&&(u.push(y,D,O),v+=3),(t>0||A!==o-1)&&(u.push(D,L,O),v+=3)}d.addGroup(m,v,0),m+=v}function w(b){const R=_,v=new Je,S=new H;let C=0;const A=b===!0?e:t,y=b===!0?1:-1;for(let L=1;L<=i;L++)c.push(0,p*y,0),h.push(0,y,0),f.push(.5,.5),_++;const D=_;for(let L=0;L<=i;L++){const G=L/i*l+a,W=Math.cos(G),F=Math.sin(G);S.x=A*F,S.y=p*y,S.z=A*W,c.push(S.x,S.y,S.z),h.push(0,y,0),v.x=W*.5+.5,v.y=F*.5*y+.5,f.push(v.x,v.y),_++}for(let L=0;L<i;L++){const O=R+L,G=D+L;b===!0?u.push(G,G+1,O):u.push(G+1,G,O),C+=3}d.addGroup(m,C,b===!0?1:2),m+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Tl(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Cl extends rn{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const o=[],r=[];a(i),d(n),u(),this.setAttribute("position",new Vt(o,3)),this.setAttribute("normal",new Vt(o.slice(),3)),this.setAttribute("uv",new Vt(r,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(M){const w=new H,b=new H,R=new H;for(let v=0;v<t.length;v+=3)f(t[v+0],w),f(t[v+1],b),f(t[v+2],R),l(w,b,R,M)}function l(M,w,b,R){const v=R+1,S=[];for(let C=0;C<=v;C++){S[C]=[];const A=M.clone().lerp(b,C/v),y=w.clone().lerp(b,C/v),D=v-C;for(let L=0;L<=D;L++)L===0&&C===v?S[C][L]=A:S[C][L]=A.clone().lerp(y,L/D)}for(let C=0;C<v;C++)for(let A=0;A<2*(v-C)-1;A++){const y=Math.floor(A/2);A%2===0?(h(S[C][y+1]),h(S[C+1][y]),h(S[C][y])):(h(S[C][y+1]),h(S[C+1][y+1]),h(S[C+1][y]))}}function d(M){const w=new H;for(let b=0;b<o.length;b+=3)w.x=o[b+0],w.y=o[b+1],w.z=o[b+2],w.normalize().multiplyScalar(M),o[b+0]=w.x,o[b+1]=w.y,o[b+2]=w.z}function u(){const M=new H;for(let w=0;w<o.length;w+=3){M.x=o[w+0],M.y=o[w+1],M.z=o[w+2];const b=p(M)/2/Math.PI+.5,R=m(M)/Math.PI+.5;r.push(b,1-R)}_(),c()}function c(){for(let M=0;M<r.length;M+=6){const w=r[M+0],b=r[M+2],R=r[M+4],v=Math.max(w,b,R),S=Math.min(w,b,R);v>.9&&S<.1&&(w<.2&&(r[M+0]+=1),b<.2&&(r[M+2]+=1),R<.2&&(r[M+4]+=1))}}function h(M){o.push(M.x,M.y,M.z)}function f(M,w){const b=M*3;w.x=e[b+0],w.y=e[b+1],w.z=e[b+2]}function _(){const M=new H,w=new H,b=new H,R=new H,v=new Je,S=new Je,C=new Je;for(let A=0,y=0;A<o.length;A+=9,y+=6){M.set(o[A+0],o[A+1],o[A+2]),w.set(o[A+3],o[A+4],o[A+5]),b.set(o[A+6],o[A+7],o[A+8]),v.set(r[y+0],r[y+1]),S.set(r[y+2],r[y+3]),C.set(r[y+4],r[y+5]),R.copy(M).add(w).add(b).divideScalar(3);const D=p(R);g(v,y+0,M,D),g(S,y+2,w,D),g(C,y+4,b,D)}}function g(M,w,b,R){R<0&&M.x===1&&(r[w]=M.x-1),b.x===0&&b.z===0&&(r[w]=R/2/Math.PI+.5)}function p(M){return Math.atan2(M.z,-M.x)}function m(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Cl(e.vertices,e.indices,e.radius,e.details)}}class Rl extends Cl{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Rl(e.radius,e.detail)}}class ws extends rn{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const o=e/2,r=t/2,a=Math.floor(n),l=Math.floor(i),d=a+1,u=l+1,c=e/a,h=t/l,f=[],_=[],g=[],p=[];for(let m=0;m<u;m++){const M=m*h-r;for(let w=0;w<d;w++){const b=w*c-o;_.push(b,-M,0),g.push(0,0,1),p.push(w/a),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let M=0;M<a;M++){const w=M+d*m,b=M+d*(m+1),R=M+1+d*(m+1),v=M+1+d*m;f.push(w,b,v),f.push(b,R,v)}this.setIndex(f),this.setAttribute("position",new Vt(_,3)),this.setAttribute("normal",new Vt(g,3)),this.setAttribute("uv",new Vt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ws(e.width,e.height,e.widthSegments,e.heightSegments)}}class kl extends rn{constructor(e=1,t=32,n=16,i=0,o=Math.PI*2,r=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:o,thetaStart:r,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(r+a,Math.PI);let d=0;const u=[],c=new H,h=new H,f=[],_=[],g=[],p=[];for(let m=0;m<=n;m++){const M=[],w=m/n;let b=0;m===0&&r===0?b=.5/t:m===n&&l===Math.PI&&(b=-.5/t);for(let R=0;R<=t;R++){const v=R/t;c.x=-e*Math.cos(i+v*o)*Math.sin(r+w*a),c.y=e*Math.cos(r+w*a),c.z=e*Math.sin(i+v*o)*Math.sin(r+w*a),_.push(c.x,c.y,c.z),h.copy(c).normalize(),g.push(h.x,h.y,h.z),p.push(v+b,1-w),M.push(d++)}u.push(M)}for(let m=0;m<n;m++)for(let M=0;M<t;M++){const w=u[m][M+1],b=u[m][M],R=u[m+1][M],v=u[m+1][M+1];(m!==0||r>0)&&f.push(w,b,v),(m!==n-1||l<Math.PI)&&f.push(b,R,v)}this.setIndex(f),this.setAttribute("position",new Vt(_,3)),this.setAttribute("normal",new Vt(g,3)),this.setAttribute("uv",new Vt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new kl(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Yg extends co{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Vm,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class qg extends co{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Kg extends uh{constructor(e=-1,t=1,n=1,i=-1,o=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=o,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,o,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=o,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let o=n-e,r=n+e,a=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const d=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=d*this.view.offsetX,r=o+d*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(o,r,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Qg extends yn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}function yc(s,e,t,n){const i=jg(n);switch(t){case th:return s*e;case ih:return s*e/i.components*i.byteLength;case xl:return s*e/i.components*i.byteLength;case sh:return s*e*2/i.components*i.byteLength;case Al:return s*e*2/i.components*i.byteLength;case nh:return s*e*3/i.components*i.byteLength;case En:return s*e*4/i.components*i.byteLength;case bl:return s*e*4/i.components*i.byteLength;case tr:case nr:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case ir:case sr:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Ba:case Oa:return Math.max(s,16)*Math.max(e,8)/4;case Na:case Fa:return Math.max(s,8)*Math.max(e,8)/2;case za:case Va:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Ga:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Ha:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Wa:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case Xa:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case Ya:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case qa:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case Ka:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case Qa:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case ja:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case Ja:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case Za:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case $a:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case el:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case tl:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case nl:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case il:case sl:case ol:return Math.ceil(s/4)*Math.ceil(e/4)*16;case rl:case al:return Math.ceil(s/4)*Math.ceil(e/4)*8;case ll:case cl:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function jg(s){switch(s){case Vn:case Jd:return{byteLength:1,components:1};case $s:case Zd:case ro:return{byteLength:2,components:1};case _l:case vl:return{byteLength:2,components:4};case Bi:case gl:case Jn:return{byteLength:4,components:1};case $d:case eh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ml}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ml);function xh(){let s=null,e=!1,t=null,n=null;function i(o,r){t(o,r),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(o){t=o},setContext:function(o){s=o}}}function Jg(s){const e=new WeakMap;function t(a,l){const d=a.array,u=a.usage,c=d.byteLength,h=s.createBuffer();s.bindBuffer(l,h),s.bufferData(l,d,u),a.onUploadCallback();let f;if(d instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&d instanceof Float16Array)f=s.HALF_FLOAT;else if(d instanceof Uint16Array)a.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(d instanceof Int16Array)f=s.SHORT;else if(d instanceof Uint32Array)f=s.UNSIGNED_INT;else if(d instanceof Int32Array)f=s.INT;else if(d instanceof Int8Array)f=s.BYTE;else if(d instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:h,type:f,bytesPerElement:d.BYTES_PER_ELEMENT,version:a.version,size:c}}function n(a,l,d){const u=l.array,c=l.updateRanges;if(s.bindBuffer(d,a),c.length===0)s.bufferSubData(d,0,u);else{c.sort((f,_)=>f.start-_.start);let h=0;for(let f=1;f<c.length;f++){const _=c[h],g=c[f];g.start<=_.start+_.count+1?_.count=Math.max(_.count,g.start+g.count-_.start):(++h,c[h]=g)}c.length=h+1;for(let f=0,_=c.length;f<_;f++){const g=c[f];s.bufferSubData(d,g.start*u.BYTES_PER_ELEMENT,u,g.start,g.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function o(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(s.deleteBuffer(l.buffer),e.delete(a))}function r(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const d=e.get(a);if(d===void 0)e.set(a,t(a,l));else if(d.version<a.version){if(d.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(d.buffer,a,l),d.version=a.version}}return{get:i,remove:o,update:r}}var Zg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,$g=`#ifdef USE_ALPHAHASH
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
#endif`,e0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,t0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,n0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,i0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,s0=`#ifdef USE_AOMAP
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
#endif`,o0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,r0=`#ifdef USE_BATCHING
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
#endif`,a0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,l0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,c0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,d0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,h0=`#ifdef USE_IRIDESCENCE
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
#endif`,u0=`#ifdef USE_BUMPMAP
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
#endif`,f0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,p0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,m0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,g0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,_0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,v0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,x0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,A0=`#if defined( USE_COLOR_ALPHA )
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
#endif`,b0=`#define PI 3.141592653589793
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
} // validated`,y0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,M0=`vec3 transformedNormal = objectNormal;
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
#endif`,E0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,S0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,w0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,T0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,C0="gl_FragColor = linearToOutputTexel( gl_FragColor );",R0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,k0=`#ifdef USE_ENVMAP
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
#endif`,D0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,L0=`#ifdef USE_ENVMAP
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
#endif`,P0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,I0=`#ifdef USE_ENVMAP
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
#endif`,U0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,N0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,B0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,F0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,O0=`#ifdef USE_GRADIENTMAP
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
}`,z0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,V0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,G0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,H0=`uniform bool receiveShadow;
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
#endif`,W0=`#ifdef USE_ENVMAP
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
#endif`,X0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Y0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,q0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,K0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Q0=`PhysicalMaterial material;
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
#endif`,j0=`struct PhysicalMaterial {
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
}`,J0=`
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
#endif`,Z0=`#if defined( RE_IndirectDiffuse )
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
#endif`,$0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,e_=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,t_=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,n_=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,i_=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,s_=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,o_=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,r_=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,a_=`#if defined( USE_POINTS_UV )
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
#endif`,l_=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,c_=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,d_=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,h_=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,u_=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,f_=`#ifdef USE_MORPHTARGETS
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
#endif`,p_=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,m_=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,g_=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,__=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,v_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,x_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,A_=`#ifdef USE_NORMALMAP
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
#endif`,b_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,y_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,M_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,E_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,S_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,w_=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,T_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,C_=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,R_=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,k_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,D_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,L_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,P_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,I_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,U_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,N_=`float getShadowMask() {
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
}`,B_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,F_=`#ifdef USE_SKINNING
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
#endif`,O_=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,z_=`#ifdef USE_SKINNING
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
#endif`,V_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,G_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,H_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,W_=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,X_=`#ifdef USE_TRANSMISSION
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
#endif`,Y_=`#ifdef USE_TRANSMISSION
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
#endif`,q_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,K_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Q_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,j_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const J_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Z_=`uniform sampler2D t2D;
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
}`,$_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ev=`#ifdef ENVMAP_TYPE_CUBE
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
}`,tv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,nv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,iv=`#include <common>
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
}`,sv=`#if DEPTH_PACKING == 3200
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
}`,ov=`#define DISTANCE
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
}`,rv=`#define DISTANCE
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
}`,av=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,lv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cv=`uniform float scale;
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
}`,dv=`uniform vec3 diffuse;
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
}`,hv=`#include <common>
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
}`,uv=`uniform vec3 diffuse;
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
}`,fv=`#define LAMBERT
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
}`,pv=`#define LAMBERT
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
}`,mv=`#define MATCAP
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
}`,gv=`#define MATCAP
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
}`,_v=`#define NORMAL
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
}`,vv=`#define NORMAL
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
}`,xv=`#define PHONG
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
}`,Av=`#define PHONG
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
}`,bv=`#define STANDARD
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
}`,yv=`#define STANDARD
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
}`,Mv=`#define TOON
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
}`,Ev=`#define TOON
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
}`,Sv=`uniform float size;
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
}`,wv=`uniform vec3 diffuse;
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
}`,Tv=`#include <common>
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
}`,Cv=`uniform vec3 color;
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
}`,Rv=`uniform float rotation;
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
}`,kv=`uniform vec3 diffuse;
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
}`,Qe={alphahash_fragment:Zg,alphahash_pars_fragment:$g,alphamap_fragment:e0,alphamap_pars_fragment:t0,alphatest_fragment:n0,alphatest_pars_fragment:i0,aomap_fragment:s0,aomap_pars_fragment:o0,batching_pars_vertex:r0,batching_vertex:a0,begin_vertex:l0,beginnormal_vertex:c0,bsdfs:d0,iridescence_fragment:h0,bumpmap_pars_fragment:u0,clipping_planes_fragment:f0,clipping_planes_pars_fragment:p0,clipping_planes_pars_vertex:m0,clipping_planes_vertex:g0,color_fragment:_0,color_pars_fragment:v0,color_pars_vertex:x0,color_vertex:A0,common:b0,cube_uv_reflection_fragment:y0,defaultnormal_vertex:M0,displacementmap_pars_vertex:E0,displacementmap_vertex:S0,emissivemap_fragment:w0,emissivemap_pars_fragment:T0,colorspace_fragment:C0,colorspace_pars_fragment:R0,envmap_fragment:k0,envmap_common_pars_fragment:D0,envmap_pars_fragment:L0,envmap_pars_vertex:P0,envmap_physical_pars_fragment:W0,envmap_vertex:I0,fog_vertex:U0,fog_pars_vertex:N0,fog_fragment:B0,fog_pars_fragment:F0,gradientmap_pars_fragment:O0,lightmap_pars_fragment:z0,lights_lambert_fragment:V0,lights_lambert_pars_fragment:G0,lights_pars_begin:H0,lights_toon_fragment:X0,lights_toon_pars_fragment:Y0,lights_phong_fragment:q0,lights_phong_pars_fragment:K0,lights_physical_fragment:Q0,lights_physical_pars_fragment:j0,lights_fragment_begin:J0,lights_fragment_maps:Z0,lights_fragment_end:$0,logdepthbuf_fragment:e_,logdepthbuf_pars_fragment:t_,logdepthbuf_pars_vertex:n_,logdepthbuf_vertex:i_,map_fragment:s_,map_pars_fragment:o_,map_particle_fragment:r_,map_particle_pars_fragment:a_,metalnessmap_fragment:l_,metalnessmap_pars_fragment:c_,morphinstance_vertex:d_,morphcolor_vertex:h_,morphnormal_vertex:u_,morphtarget_pars_vertex:f_,morphtarget_vertex:p_,normal_fragment_begin:m_,normal_fragment_maps:g_,normal_pars_fragment:__,normal_pars_vertex:v_,normal_vertex:x_,normalmap_pars_fragment:A_,clearcoat_normal_fragment_begin:b_,clearcoat_normal_fragment_maps:y_,clearcoat_pars_fragment:M_,iridescence_pars_fragment:E_,opaque_fragment:S_,packing:w_,premultiplied_alpha_fragment:T_,project_vertex:C_,dithering_fragment:R_,dithering_pars_fragment:k_,roughnessmap_fragment:D_,roughnessmap_pars_fragment:L_,shadowmap_pars_fragment:P_,shadowmap_pars_vertex:I_,shadowmap_vertex:U_,shadowmask_pars_fragment:N_,skinbase_vertex:B_,skinning_pars_vertex:F_,skinning_vertex:O_,skinnormal_vertex:z_,specularmap_fragment:V_,specularmap_pars_fragment:G_,tonemapping_fragment:H_,tonemapping_pars_fragment:W_,transmission_fragment:X_,transmission_pars_fragment:Y_,uv_pars_fragment:q_,uv_pars_vertex:K_,uv_vertex:Q_,worldpos_vertex:j_,background_vert:J_,background_frag:Z_,backgroundCube_vert:$_,backgroundCube_frag:ev,cube_vert:tv,cube_frag:nv,depth_vert:iv,depth_frag:sv,distanceRGBA_vert:ov,distanceRGBA_frag:rv,equirect_vert:av,equirect_frag:lv,linedashed_vert:cv,linedashed_frag:dv,meshbasic_vert:hv,meshbasic_frag:uv,meshlambert_vert:fv,meshlambert_frag:pv,meshmatcap_vert:mv,meshmatcap_frag:gv,meshnormal_vert:_v,meshnormal_frag:vv,meshphong_vert:xv,meshphong_frag:Av,meshphysical_vert:bv,meshphysical_frag:yv,meshtoon_vert:Mv,meshtoon_frag:Ev,points_vert:Sv,points_frag:wv,shadow_vert:Tv,shadow_frag:Cv,sprite_vert:Rv,sprite_frag:kv},ye={common:{diffuse:{value:new je(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ke}},envmap:{envMap:{value:null},envMapRotation:{value:new Ke},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ke},normalScale:{value:new Je(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new je(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new je(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0},uvTransform:{value:new Ke}},sprite:{diffuse:{value:new je(16777215)},opacity:{value:1},center:{value:new Je(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}}},On={basic:{uniforms:Zt([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.fog]),vertexShader:Qe.meshbasic_vert,fragmentShader:Qe.meshbasic_frag},lambert:{uniforms:Zt([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,ye.lights,{emissive:{value:new je(0)}}]),vertexShader:Qe.meshlambert_vert,fragmentShader:Qe.meshlambert_frag},phong:{uniforms:Zt([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,ye.lights,{emissive:{value:new je(0)},specular:{value:new je(1118481)},shininess:{value:30}}]),vertexShader:Qe.meshphong_vert,fragmentShader:Qe.meshphong_frag},standard:{uniforms:Zt([ye.common,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.roughnessmap,ye.metalnessmap,ye.fog,ye.lights,{emissive:{value:new je(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Qe.meshphysical_vert,fragmentShader:Qe.meshphysical_frag},toon:{uniforms:Zt([ye.common,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.gradientmap,ye.fog,ye.lights,{emissive:{value:new je(0)}}]),vertexShader:Qe.meshtoon_vert,fragmentShader:Qe.meshtoon_frag},matcap:{uniforms:Zt([ye.common,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,{matcap:{value:null}}]),vertexShader:Qe.meshmatcap_vert,fragmentShader:Qe.meshmatcap_frag},points:{uniforms:Zt([ye.points,ye.fog]),vertexShader:Qe.points_vert,fragmentShader:Qe.points_frag},dashed:{uniforms:Zt([ye.common,ye.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Qe.linedashed_vert,fragmentShader:Qe.linedashed_frag},depth:{uniforms:Zt([ye.common,ye.displacementmap]),vertexShader:Qe.depth_vert,fragmentShader:Qe.depth_frag},normal:{uniforms:Zt([ye.common,ye.bumpmap,ye.normalmap,ye.displacementmap,{opacity:{value:1}}]),vertexShader:Qe.meshnormal_vert,fragmentShader:Qe.meshnormal_frag},sprite:{uniforms:Zt([ye.sprite,ye.fog]),vertexShader:Qe.sprite_vert,fragmentShader:Qe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Qe.background_vert,fragmentShader:Qe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ke}},vertexShader:Qe.backgroundCube_vert,fragmentShader:Qe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Qe.cube_vert,fragmentShader:Qe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Qe.equirect_vert,fragmentShader:Qe.equirect_frag},distanceRGBA:{uniforms:Zt([ye.common,ye.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Qe.distanceRGBA_vert,fragmentShader:Qe.distanceRGBA_frag},shadow:{uniforms:Zt([ye.lights,ye.fog,{color:{value:new je(0)},opacity:{value:1}}]),vertexShader:Qe.shadow_vert,fragmentShader:Qe.shadow_frag}};On.physical={uniforms:Zt([On.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ke},clearcoatNormalScale:{value:new Je(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ke},sheen:{value:0},sheenColor:{value:new je(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ke},transmissionSamplerSize:{value:new Je},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ke},attenuationDistance:{value:0},attenuationColor:{value:new je(0)},specularColor:{value:new je(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ke},anisotropyVector:{value:new Je},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ke}}]),vertexShader:Qe.meshphysical_vert,fragmentShader:Qe.meshphysical_frag};const Fo={r:0,b:0,g:0},Si=new ti,Dv=new Dt;function Lv(s,e,t,n,i,o,r){const a=new je(0);let l=o===!0?0:1,d,u,c=null,h=0,f=null;function _(w){let b=w.isScene===!0?w.background:null;return b&&b.isTexture&&(b=(w.backgroundBlurriness>0?t:e).get(b)),b}function g(w){let b=!1;const R=_(w);R===null?m(a,l):R&&R.isColor&&(m(R,1),b=!0);const v=s.xr.getEnvironmentBlendMode();v==="additive"?n.buffers.color.setClear(0,0,0,1,r):v==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(s.autoClear||b)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function p(w,b){const R=_(b);R&&(R.isCubeTexture||R.mapping===vr)?(u===void 0&&(u=new dt(new Un(1,1,1),new Gn({name:"BackgroundCubeMaterial",uniforms:Es(On.backgroundCube.uniforms),vertexShader:On.backgroundCube.vertexShader,fragmentShader:On.backgroundCube.fragmentShader,side:$t,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(v,S,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(u)),Si.copy(b.backgroundRotation),Si.x*=-1,Si.y*=-1,Si.z*=-1,R.isCubeTexture&&R.isRenderTargetTexture===!1&&(Si.y*=-1,Si.z*=-1),u.material.uniforms.envMap.value=R,u.material.uniforms.flipEnvMap.value=R.isCubeTexture&&R.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Dv.makeRotationFromEuler(Si)),u.material.toneMapped=ct.getTransfer(R.colorSpace)!==gt,(c!==R||h!==R.version||f!==s.toneMapping)&&(u.material.needsUpdate=!0,c=R,h=R.version,f=s.toneMapping),u.layers.enableAll(),w.unshift(u,u.geometry,u.material,0,0,null)):R&&R.isTexture&&(d===void 0&&(d=new dt(new ws(2,2),new Gn({name:"BackgroundMaterial",uniforms:Es(On.background.uniforms),vertexShader:On.background.vertexShader,fragmentShader:On.background.fragmentShader,side:ei,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),Object.defineProperty(d.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(d)),d.material.uniforms.t2D.value=R,d.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,d.material.toneMapped=ct.getTransfer(R.colorSpace)!==gt,R.matrixAutoUpdate===!0&&R.updateMatrix(),d.material.uniforms.uvTransform.value.copy(R.matrix),(c!==R||h!==R.version||f!==s.toneMapping)&&(d.material.needsUpdate=!0,c=R,h=R.version,f=s.toneMapping),d.layers.enableAll(),w.unshift(d,d.geometry,d.material,0,0,null))}function m(w,b){w.getRGB(Fo,hh(s)),n.buffers.color.setClear(Fo.r,Fo.g,Fo.b,b,r)}function M(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0)}return{getClearColor:function(){return a},setClearColor:function(w,b=1){a.set(w),l=b,m(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(w){l=w,m(a,l)},render:g,addToRenderList:p,dispose:M}}function Pv(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=h(null);let o=i,r=!1;function a(y,D,L,O,G){let W=!1;const F=c(O,L,D);o!==F&&(o=F,d(o.object)),W=f(y,O,L,G),W&&_(y,O,L,G),G!==null&&e.update(G,s.ELEMENT_ARRAY_BUFFER),(W||r)&&(r=!1,b(y,D,L,O),G!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(G).buffer))}function l(){return s.createVertexArray()}function d(y){return s.bindVertexArray(y)}function u(y){return s.deleteVertexArray(y)}function c(y,D,L){const O=L.wireframe===!0;let G=n[y.id];G===void 0&&(G={},n[y.id]=G);let W=G[D.id];W===void 0&&(W={},G[D.id]=W);let F=W[O];return F===void 0&&(F=h(l()),W[O]=F),F}function h(y){const D=[],L=[],O=[];for(let G=0;G<t;G++)D[G]=0,L[G]=0,O[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:L,attributeDivisors:O,object:y,attributes:{},index:null}}function f(y,D,L,O){const G=o.attributes,W=D.attributes;let F=0;const Y=L.getAttributes();for(const B in Y)if(Y[B].location>=0){const de=G[B];let xe=W[B];if(xe===void 0&&(B==="instanceMatrix"&&y.instanceMatrix&&(xe=y.instanceMatrix),B==="instanceColor"&&y.instanceColor&&(xe=y.instanceColor)),de===void 0||de.attribute!==xe||xe&&de.data!==xe.data)return!0;F++}return o.attributesNum!==F||o.index!==O}function _(y,D,L,O){const G={},W=D.attributes;let F=0;const Y=L.getAttributes();for(const B in Y)if(Y[B].location>=0){let de=W[B];de===void 0&&(B==="instanceMatrix"&&y.instanceMatrix&&(de=y.instanceMatrix),B==="instanceColor"&&y.instanceColor&&(de=y.instanceColor));const xe={};xe.attribute=de,de&&de.data&&(xe.data=de.data),G[B]=xe,F++}o.attributes=G,o.attributesNum=F,o.index=O}function g(){const y=o.newAttributes;for(let D=0,L=y.length;D<L;D++)y[D]=0}function p(y){m(y,0)}function m(y,D){const L=o.newAttributes,O=o.enabledAttributes,G=o.attributeDivisors;L[y]=1,O[y]===0&&(s.enableVertexAttribArray(y),O[y]=1),G[y]!==D&&(s.vertexAttribDivisor(y,D),G[y]=D)}function M(){const y=o.newAttributes,D=o.enabledAttributes;for(let L=0,O=D.length;L<O;L++)D[L]!==y[L]&&(s.disableVertexAttribArray(L),D[L]=0)}function w(y,D,L,O,G,W,F){F===!0?s.vertexAttribIPointer(y,D,L,G,W):s.vertexAttribPointer(y,D,L,O,G,W)}function b(y,D,L,O){g();const G=O.attributes,W=L.getAttributes(),F=D.defaultAttributeValues;for(const Y in W){const B=W[Y];if(B.location>=0){let se=G[Y];if(se===void 0&&(Y==="instanceMatrix"&&y.instanceMatrix&&(se=y.instanceMatrix),Y==="instanceColor"&&y.instanceColor&&(se=y.instanceColor)),se!==void 0){const de=se.normalized,xe=se.itemSize,Oe=e.get(se);if(Oe===void 0)continue;const Me=Oe.buffer,Z=Oe.type,Pe=Oe.bytesPerElement,K=Z===s.INT||Z===s.UNSIGNED_INT||se.gpuType===gl;if(se.isInterleavedBufferAttribute){const $=se.data,oe=$.stride,pe=se.offset;if($.isInstancedInterleavedBuffer){for(let he=0;he<B.locationSize;he++)m(B.location+he,$.meshPerAttribute);y.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let he=0;he<B.locationSize;he++)p(B.location+he);s.bindBuffer(s.ARRAY_BUFFER,Me);for(let he=0;he<B.locationSize;he++)w(B.location+he,xe/B.locationSize,Z,de,oe*Pe,(pe+xe/B.locationSize*he)*Pe,K)}else{if(se.isInstancedBufferAttribute){for(let $=0;$<B.locationSize;$++)m(B.location+$,se.meshPerAttribute);y.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let $=0;$<B.locationSize;$++)p(B.location+$);s.bindBuffer(s.ARRAY_BUFFER,Me);for(let $=0;$<B.locationSize;$++)w(B.location+$,xe/B.locationSize,Z,de,xe*Pe,xe/B.locationSize*$*Pe,K)}}else if(F!==void 0){const de=F[Y];if(de!==void 0)switch(de.length){case 2:s.vertexAttrib2fv(B.location,de);break;case 3:s.vertexAttrib3fv(B.location,de);break;case 4:s.vertexAttrib4fv(B.location,de);break;default:s.vertexAttrib1fv(B.location,de)}}}}M()}function R(){C();for(const y in n){const D=n[y];for(const L in D){const O=D[L];for(const G in O)u(O[G].object),delete O[G];delete D[L]}delete n[y]}}function v(y){if(n[y.id]===void 0)return;const D=n[y.id];for(const L in D){const O=D[L];for(const G in O)u(O[G].object),delete O[G];delete D[L]}delete n[y.id]}function S(y){for(const D in n){const L=n[D];if(L[y.id]===void 0)continue;const O=L[y.id];for(const G in O)u(O[G].object),delete O[G];delete L[y.id]}}function C(){A(),r=!0,o!==i&&(o=i,d(o.object))}function A(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:C,resetDefaultState:A,dispose:R,releaseStatesOfGeometry:v,releaseStatesOfProgram:S,initAttributes:g,enableAttribute:p,disableUnusedAttributes:M}}function Iv(s,e,t){let n;function i(d){n=d}function o(d,u){s.drawArrays(n,d,u),t.update(u,n,1)}function r(d,u,c){c!==0&&(s.drawArraysInstanced(n,d,u,c),t.update(u,n,c))}function a(d,u,c){if(c===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,d,0,u,0,c);let f=0;for(let _=0;_<c;_++)f+=u[_];t.update(f,n,1)}function l(d,u,c,h){if(c===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let _=0;_<d.length;_++)r(d[_],u[_],h[_]);else{f.multiDrawArraysInstancedWEBGL(n,d,0,u,0,h,0,c);let _=0;for(let g=0;g<c;g++)_+=u[g]*h[g];t.update(_,n,1)}}this.setMode=i,this.render=o,this.renderInstances=r,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Uv(s,e,t,n){let i;function o(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const S=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(S.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function r(S){return!(S!==En&&n.convert(S)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(S){const C=S===ro&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(S!==Vn&&n.convert(S)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&S!==Jn&&!C)}function l(S){if(S==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";S="mediump"}return S==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let d=t.precision!==void 0?t.precision:"highp";const u=l(d);u!==d&&(console.warn("THREE.WebGLRenderer:",d,"not supported, using",u,"instead."),d=u);const c=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),_=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_TEXTURE_SIZE),p=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),m=s.getParameter(s.MAX_VERTEX_ATTRIBS),M=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),w=s.getParameter(s.MAX_VARYING_VECTORS),b=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),R=_>0,v=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:o,getMaxPrecision:l,textureFormatReadable:r,textureTypeReadable:a,precision:d,logarithmicDepthBuffer:c,reversedDepthBuffer:h,maxTextures:f,maxVertexTextures:_,maxTextureSize:g,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:M,maxVaryings:w,maxFragmentUniforms:b,vertexTextures:R,maxSamples:v}}function Nv(s){const e=this;let t=null,n=0,i=!1,o=!1;const r=new Di,a=new Ke,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(c,h){const f=c.length!==0||h||n!==0||i;return i=h,n=c.length,f},this.beginShadows=function(){o=!0,u(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(c,h){t=u(c,h,0)},this.setState=function(c,h,f){const _=c.clippingPlanes,g=c.clipIntersection,p=c.clipShadows,m=s.get(c);if(!i||_===null||_.length===0||o&&!p)o?u(null):d();else{const M=o?0:n,w=M*4;let b=m.clippingState||null;l.value=b,b=u(_,h,w,f);for(let R=0;R!==w;++R)b[R]=t[R];m.clippingState=b,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=M}};function d(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(c,h,f,_){const g=c!==null?c.length:0;let p=null;if(g!==0){if(p=l.value,_!==!0||p===null){const m=f+g*4,M=h.matrixWorldInverse;a.getNormalMatrix(M),(p===null||p.length<m)&&(p=new Float32Array(m));for(let w=0,b=f;w!==g;++w,b+=4)r.copy(c[w]).applyMatrix4(M,a),r.normal.toArray(p,b),p[b+3]=r.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=g,e.numIntersection=0,p}}function Bv(s){let e=new WeakMap;function t(r,a){return a===Pa?r.mapping=bs:a===Ia&&(r.mapping=ys),r}function n(r){if(r&&r.isTexture){const a=r.mapping;if(a===Pa||a===Ia)if(e.has(r)){const l=e.get(r).texture;return t(l,r.mapping)}else{const l=r.image;if(l&&l.height>0){const d=new zg(l.height);return d.fromEquirectangularTexture(s,r),e.set(r,d),r.addEventListener("dispose",i),t(d.texture,r.mapping)}else return null}}return r}function i(r){const a=r.target;a.removeEventListener("dispose",i);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function o(){e=new WeakMap}return{get:n,dispose:o}}const ps=4,Mc=[.125,.215,.35,.446,.526,.582],Ii=20,sa=new Kg,Ec=new je;let oa=null,ra=0,aa=0,la=!1;const Li=(1+Math.sqrt(5))/2,hs=1/Li,Sc=[new H(-Li,hs,0),new H(Li,hs,0),new H(-hs,0,Li),new H(hs,0,Li),new H(0,Li,-hs),new H(0,Li,hs),new H(-1,1,-1),new H(1,1,-1),new H(-1,1,1),new H(1,1,1)],Fv=new H;class wc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100,o={}){const{size:r=256,position:a=Fv}=o;oa=this._renderer.getRenderTarget(),ra=this._renderer.getActiveCubeFace(),aa=this._renderer.getActiveMipmapLevel(),la=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,i,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Rc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Cc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(oa,ra,aa),this._renderer.xr.enabled=la,e.scissorTest=!1,Oo(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===bs||e.mapping===ys?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),oa=this._renderer.getRenderTarget(),ra=this._renderer.getActiveCubeFace(),aa=this._renderer.getActiveMipmapLevel(),la=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:gn,minFilter:gn,generateMipmaps:!1,type:ro,format:En,colorSpace:Ms,depthBuffer:!1},i=Tc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Tc(e,t,n);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Ov(o)),this._blurMaterial=zv(o,e,t)}return i}_compileMaterial(e){const t=new dt(this._lodPlanes[0],e);this._renderer.compile(t,sa)}_sceneToCubeUV(e,t,n,i,o){const l=new yn(90,1,t,n),d=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],c=this._renderer,h=c.autoClear,f=c.toneMapping;c.getClearColor(Ec),c.toneMapping=mi,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(i),c.clearDepth(),c.setRenderTarget(null));const g=new zt({name:"PMREM.Background",side:$t,depthWrite:!1,depthTest:!1}),p=new dt(new Un,g);let m=!1;const M=e.background;M?M.isColor&&(g.color.copy(M),e.background=null,m=!0):(g.color.copy(Ec),m=!0);for(let w=0;w<6;w++){const b=w%3;b===0?(l.up.set(0,d[w],0),l.position.set(o.x,o.y,o.z),l.lookAt(o.x+u[w],o.y,o.z)):b===1?(l.up.set(0,0,d[w]),l.position.set(o.x,o.y,o.z),l.lookAt(o.x,o.y+u[w],o.z)):(l.up.set(0,d[w],0),l.position.set(o.x,o.y,o.z),l.lookAt(o.x,o.y,o.z+u[w]));const R=this._cubeSize;Oo(i,b*R,w>2?R:0,R,R),c.setRenderTarget(i),m&&c.render(p,l),c.render(e,l)}p.geometry.dispose(),p.material.dispose(),c.toneMapping=f,c.autoClear=h,e.background=M}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===bs||e.mapping===ys;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Rc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Cc());const o=i?this._cubemapMaterial:this._equirectMaterial,r=new dt(this._lodPlanes[0],o),a=o.uniforms;a.envMap.value=e;const l=this._cubeSize;Oo(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(r,sa)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let o=1;o<i;o++){const r=Math.sqrt(this._sigmas[o]*this._sigmas[o]-this._sigmas[o-1]*this._sigmas[o-1]),a=Sc[(i-o-1)%Sc.length];this._blur(e,o-1,o,r,a)}t.autoClear=n}_blur(e,t,n,i,o){const r=this._pingPongRenderTarget;this._halfBlur(e,r,t,n,i,"latitudinal",o),this._halfBlur(r,e,n,n,i,"longitudinal",o)}_halfBlur(e,t,n,i,o,r,a){const l=this._renderer,d=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,c=new dt(this._lodPlanes[i],d),h=d.uniforms,f=this._sizeLods[n]-1,_=isFinite(o)?Math.PI/(2*f):2*Math.PI/(2*Ii-1),g=o/_,p=isFinite(o)?1+Math.floor(u*g):Ii;p>Ii&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Ii}`);const m=[];let M=0;for(let S=0;S<Ii;++S){const C=S/g,A=Math.exp(-C*C/2);m.push(A),S===0?M+=A:S<p&&(M+=2*A)}for(let S=0;S<m.length;S++)m[S]=m[S]/M;h.envMap.value=e.texture,h.samples.value=p,h.weights.value=m,h.latitudinal.value=r==="latitudinal",a&&(h.poleAxis.value=a);const{_lodMax:w}=this;h.dTheta.value=_,h.mipInt.value=w-n;const b=this._sizeLods[i],R=3*b*(i>w-ps?i-w+ps:0),v=4*(this._cubeSize-b);Oo(t,R,v,3*b,2*b),l.setRenderTarget(t),l.render(c,sa)}}function Ov(s){const e=[],t=[],n=[];let i=s;const o=s-ps+1+Mc.length;for(let r=0;r<o;r++){const a=Math.pow(2,i);t.push(a);let l=1/a;r>s-ps?l=Mc[r-s+ps-1]:r===0&&(l=0),n.push(l);const d=1/(a-2),u=-d,c=1+d,h=[u,u,c,u,c,c,u,u,c,c,u,c],f=6,_=6,g=3,p=2,m=1,M=new Float32Array(g*_*f),w=new Float32Array(p*_*f),b=new Float32Array(m*_*f);for(let v=0;v<f;v++){const S=v%3*2/3-1,C=v>2?0:-1,A=[S,C,0,S+2/3,C,0,S+2/3,C+1,0,S,C,0,S+2/3,C+1,0,S,C+1,0];M.set(A,g*_*v),w.set(h,p*_*v);const y=[v,v,v,v,v,v];b.set(y,m*_*v)}const R=new rn;R.setAttribute("position",new Qt(M,g)),R.setAttribute("uv",new Qt(w,p)),R.setAttribute("faceIndex",new Qt(b,m)),e.push(R),i>ps&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Tc(s,e,t){const n=new Fi(s,e,t);return n.texture.mapping=vr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Oo(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function zv(s,e,t){const n=new Float32Array(Ii),i=new H(0,1,0);return new Gn({name:"SphericalGaussianBlur",defines:{n:Ii,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Dl(),fragmentShader:`

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
		`,blending:pi,depthTest:!1,depthWrite:!1})}function Cc(){return new Gn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Dl(),fragmentShader:`

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
		`,blending:pi,depthTest:!1,depthWrite:!1})}function Rc(){return new Gn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Dl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:pi,depthTest:!1,depthWrite:!1})}function Dl(){return`

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
	`}function Vv(s){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const l=a.mapping,d=l===Pa||l===Ia,u=l===bs||l===ys;if(d||u){let c=e.get(a);const h=c!==void 0?c.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==h)return t===null&&(t=new wc(s)),c=d?t.fromEquirectangular(a,c):t.fromCubemap(a,c),c.texture.pmremVersion=a.pmremVersion,e.set(a,c),c.texture;if(c!==void 0)return c.texture;{const f=a.image;return d&&f&&f.height>0||u&&f&&i(f)?(t===null&&(t=new wc(s)),c=d?t.fromEquirectangular(a):t.fromCubemap(a),c.texture.pmremVersion=a.pmremVersion,e.set(a,c),a.addEventListener("dispose",o),c.texture):null}}}return a}function i(a){let l=0;const d=6;for(let u=0;u<d;u++)a[u]!==void 0&&l++;return l===d}function o(a){const l=a.target;l.removeEventListener("dispose",o);const d=e.get(l);d!==void 0&&(e.delete(l),d.dispose())}function r(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:r}}function Gv(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&so("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Hv(s,e,t,n){const i={},o=new WeakMap;function r(c){const h=c.target;h.index!==null&&e.remove(h.index);for(const _ in h.attributes)e.remove(h.attributes[_]);h.removeEventListener("dispose",r),delete i[h.id];const f=o.get(h);f&&(e.remove(f),o.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function a(c,h){return i[h.id]===!0||(h.addEventListener("dispose",r),i[h.id]=!0,t.memory.geometries++),h}function l(c){const h=c.attributes;for(const f in h)e.update(h[f],s.ARRAY_BUFFER)}function d(c){const h=[],f=c.index,_=c.attributes.position;let g=0;if(f!==null){const M=f.array;g=f.version;for(let w=0,b=M.length;w<b;w+=3){const R=M[w+0],v=M[w+1],S=M[w+2];h.push(R,v,v,S,S,R)}}else if(_!==void 0){const M=_.array;g=_.version;for(let w=0,b=M.length/3-1;w<b;w+=3){const R=w+0,v=w+1,S=w+2;h.push(R,v,v,S,S,R)}}else return;const p=new(rh(h)?dh:ch)(h,1);p.version=g;const m=o.get(c);m&&e.remove(m),o.set(c,p)}function u(c){const h=o.get(c);if(h){const f=c.index;f!==null&&h.version<f.version&&d(c)}else d(c);return o.get(c)}return{get:a,update:l,getWireframeAttribute:u}}function Wv(s,e,t){let n;function i(h){n=h}let o,r;function a(h){o=h.type,r=h.bytesPerElement}function l(h,f){s.drawElements(n,f,o,h*r),t.update(f,n,1)}function d(h,f,_){_!==0&&(s.drawElementsInstanced(n,f,o,h*r,_),t.update(f,n,_))}function u(h,f,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,o,h,0,_);let p=0;for(let m=0;m<_;m++)p+=f[m];t.update(p,n,1)}function c(h,f,_,g){if(_===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<h.length;m++)d(h[m]/r,f[m],g[m]);else{p.multiDrawElementsInstancedWEBGL(n,f,0,o,h,0,g,0,_);let m=0;for(let M=0;M<_;M++)m+=f[M]*g[M];t.update(m,n,1)}}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=d,this.renderMultiDraw=u,this.renderMultiDrawInstances=c}function Xv(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(o,r,a){switch(t.calls++,r){case s.TRIANGLES:t.triangles+=a*(o/3);break;case s.LINES:t.lines+=a*(o/2);break;case s.LINE_STRIP:t.lines+=a*(o-1);break;case s.LINE_LOOP:t.lines+=a*o;break;case s.POINTS:t.points+=a*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Yv(s,e,t){const n=new WeakMap,i=new Ct;function o(r,a,l){const d=r.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,c=u!==void 0?u.length:0;let h=n.get(a);if(h===void 0||h.count!==c){let A=function(){S.dispose(),n.delete(a),a.removeEventListener("dispose",A)};h!==void 0&&h.texture.dispose();const f=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,g=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],M=a.morphAttributes.color||[];let w=0;f===!0&&(w=1),_===!0&&(w=2),g===!0&&(w=3);let b=a.attributes.position.count*w,R=1;b>e.maxTextureSize&&(R=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const v=new Float32Array(b*R*4*c),S=new El(v,b,R,c);S.type=Jn,S.needsUpdate=!0;const C=w*4;for(let y=0;y<c;y++){const D=p[y],L=m[y],O=M[y],G=b*R*4*y;for(let W=0;W<D.count;W++){const F=W*C;f===!0&&(i.fromBufferAttribute(D,W),v[G+F+0]=i.x,v[G+F+1]=i.y,v[G+F+2]=i.z,v[G+F+3]=0),_===!0&&(i.fromBufferAttribute(L,W),v[G+F+4]=i.x,v[G+F+5]=i.y,v[G+F+6]=i.z,v[G+F+7]=0),g===!0&&(i.fromBufferAttribute(O,W),v[G+F+8]=i.x,v[G+F+9]=i.y,v[G+F+10]=i.z,v[G+F+11]=O.itemSize===4?i.w:1)}}h={count:c,texture:S,size:new Je(b,R)},n.set(a,h),a.addEventListener("dispose",A)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",r.morphTexture,t);else{let f=0;for(let g=0;g<d.length;g++)f+=d[g];const _=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(s,"morphTargetBaseInfluence",_),l.getUniforms().setValue(s,"morphTargetInfluences",d)}l.getUniforms().setValue(s,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",h.size)}return{update:o}}function qv(s,e,t,n){let i=new WeakMap;function o(l){const d=n.render.frame,u=l.geometry,c=e.get(l,u);if(i.get(c)!==d&&(e.update(c),i.set(c,d)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==d&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,d))),l.isSkinnedMesh){const h=l.skeleton;i.get(h)!==d&&(h.update(),i.set(h,d))}return c}function r(){i=new WeakMap}function a(l){const d=l.target;d.removeEventListener("dispose",a),t.remove(d.instanceMatrix),d.instanceColor!==null&&t.remove(d.instanceColor)}return{update:o,dispose:r}}const Ah=new tn,kc=new _h(1,1),bh=new El,yh=new yg,Mh=new fh,Dc=[],Lc=[],Pc=new Float32Array(16),Ic=new Float32Array(9),Uc=new Float32Array(4);function Ts(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let o=Dc[i];if(o===void 0&&(o=new Float32Array(i),Dc[i]=o),e!==0){n.toArray(o,0);for(let r=1,a=0;r!==e;++r)a+=t,s[r].toArray(o,a)}return o}function It(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function Ut(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function br(s,e){let t=Lc[e];t===void 0&&(t=new Int32Array(e),Lc[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function Kv(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function Qv(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;s.uniform2fv(this.addr,e),Ut(t,e)}}function jv(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(It(t,e))return;s.uniform3fv(this.addr,e),Ut(t,e)}}function Jv(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;s.uniform4fv(this.addr,e),Ut(t,e)}}function Zv(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(It(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Ut(t,e)}else{if(It(t,n))return;Uc.set(n),s.uniformMatrix2fv(this.addr,!1,Uc),Ut(t,n)}}function $v(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(It(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Ut(t,e)}else{if(It(t,n))return;Ic.set(n),s.uniformMatrix3fv(this.addr,!1,Ic),Ut(t,n)}}function ex(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(It(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Ut(t,e)}else{if(It(t,n))return;Pc.set(n),s.uniformMatrix4fv(this.addr,!1,Pc),Ut(t,n)}}function tx(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function nx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;s.uniform2iv(this.addr,e),Ut(t,e)}}function ix(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(It(t,e))return;s.uniform3iv(this.addr,e),Ut(t,e)}}function sx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;s.uniform4iv(this.addr,e),Ut(t,e)}}function ox(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function rx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;s.uniform2uiv(this.addr,e),Ut(t,e)}}function ax(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(It(t,e))return;s.uniform3uiv(this.addr,e),Ut(t,e)}}function lx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;s.uniform4uiv(this.addr,e),Ut(t,e)}}function cx(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let o;this.type===s.SAMPLER_2D_SHADOW?(kc.compareFunction=oh,o=kc):o=Ah,t.setTexture2D(e||o,i)}function dx(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||yh,i)}function hx(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Mh,i)}function ux(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||bh,i)}function fx(s){switch(s){case 5126:return Kv;case 35664:return Qv;case 35665:return jv;case 35666:return Jv;case 35674:return Zv;case 35675:return $v;case 35676:return ex;case 5124:case 35670:return tx;case 35667:case 35671:return nx;case 35668:case 35672:return ix;case 35669:case 35673:return sx;case 5125:return ox;case 36294:return rx;case 36295:return ax;case 36296:return lx;case 35678:case 36198:case 36298:case 36306:case 35682:return cx;case 35679:case 36299:case 36307:return dx;case 35680:case 36300:case 36308:case 36293:return hx;case 36289:case 36303:case 36311:case 36292:return ux}}function px(s,e){s.uniform1fv(this.addr,e)}function mx(s,e){const t=Ts(e,this.size,2);s.uniform2fv(this.addr,t)}function gx(s,e){const t=Ts(e,this.size,3);s.uniform3fv(this.addr,t)}function _x(s,e){const t=Ts(e,this.size,4);s.uniform4fv(this.addr,t)}function vx(s,e){const t=Ts(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function xx(s,e){const t=Ts(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function Ax(s,e){const t=Ts(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function bx(s,e){s.uniform1iv(this.addr,e)}function yx(s,e){s.uniform2iv(this.addr,e)}function Mx(s,e){s.uniform3iv(this.addr,e)}function Ex(s,e){s.uniform4iv(this.addr,e)}function Sx(s,e){s.uniform1uiv(this.addr,e)}function wx(s,e){s.uniform2uiv(this.addr,e)}function Tx(s,e){s.uniform3uiv(this.addr,e)}function Cx(s,e){s.uniform4uiv(this.addr,e)}function Rx(s,e,t){const n=this.cache,i=e.length,o=br(t,i);It(n,o)||(s.uniform1iv(this.addr,o),Ut(n,o));for(let r=0;r!==i;++r)t.setTexture2D(e[r]||Ah,o[r])}function kx(s,e,t){const n=this.cache,i=e.length,o=br(t,i);It(n,o)||(s.uniform1iv(this.addr,o),Ut(n,o));for(let r=0;r!==i;++r)t.setTexture3D(e[r]||yh,o[r])}function Dx(s,e,t){const n=this.cache,i=e.length,o=br(t,i);It(n,o)||(s.uniform1iv(this.addr,o),Ut(n,o));for(let r=0;r!==i;++r)t.setTextureCube(e[r]||Mh,o[r])}function Lx(s,e,t){const n=this.cache,i=e.length,o=br(t,i);It(n,o)||(s.uniform1iv(this.addr,o),Ut(n,o));for(let r=0;r!==i;++r)t.setTexture2DArray(e[r]||bh,o[r])}function Px(s){switch(s){case 5126:return px;case 35664:return mx;case 35665:return gx;case 35666:return _x;case 35674:return vx;case 35675:return xx;case 35676:return Ax;case 5124:case 35670:return bx;case 35667:case 35671:return yx;case 35668:case 35672:return Mx;case 35669:case 35673:return Ex;case 5125:return Sx;case 36294:return wx;case 36295:return Tx;case 36296:return Cx;case 35678:case 36198:case 36298:case 36306:case 35682:return Rx;case 35679:case 36299:case 36307:return kx;case 35680:case 36300:case 36308:case 36293:return Dx;case 36289:case 36303:case 36311:case 36292:return Lx}}class Ix{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=fx(t.type)}}class Ux{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Px(t.type)}}class Nx{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let o=0,r=i.length;o!==r;++o){const a=i[o];a.setValue(e,t[a.id],n)}}}const ca=/(\w+)(\])?(\[|\.)?/g;function Nc(s,e){s.seq.push(e),s.map[e.id]=e}function Bx(s,e,t){const n=s.name,i=n.length;for(ca.lastIndex=0;;){const o=ca.exec(n),r=ca.lastIndex;let a=o[1];const l=o[2]==="]",d=o[3];if(l&&(a=a|0),d===void 0||d==="["&&r+2===i){Nc(t,d===void 0?new Ix(a,s,e):new Ux(a,s,e));break}else{let c=t.map[a];c===void 0&&(c=new Nx(a),Nc(t,c)),t=c}}}class or{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const o=e.getActiveUniform(t,i),r=e.getUniformLocation(t,o.name);Bx(o,r,this)}}setValue(e,t,n,i){const o=this.map[t];o!==void 0&&o.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let o=0,r=t.length;o!==r;++o){const a=t[o],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,o=e.length;i!==o;++i){const r=e[i];r.id in t&&n.push(r)}return n}}function Bc(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const Fx=37297;let Ox=0;function zx(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),o=Math.min(e+6,t.length);for(let r=i;r<o;r++){const a=r+1;n.push(`${a===e?">":" "} ${a}: ${t[r]}`)}return n.join(`
`)}const Fc=new Ke;function Vx(s){ct._getMatrix(Fc,ct.workingColorSpace,s);const e=`mat3( ${Fc.elements.map(t=>t.toFixed(4))} )`;switch(ct.getTransfer(s)){case lr:return[e,"LinearTransferOETF"];case gt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function Oc(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),o=(s.getShaderInfoLog(e)||"").trim();if(n&&o==="")return"";const r=/ERROR: 0:(\d+)/.exec(o);if(r){const a=parseInt(r[1]);return t.toUpperCase()+`

`+o+`

`+zx(s.getShaderSource(e),a)}else return o}function Gx(s,e){const t=Vx(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Hx(s,e){let t;switch(e){case Pm:t="Linear";break;case Im:t="Reinhard";break;case Um:t="Cineon";break;case Nm:t="ACESFilmic";break;case Fm:t="AgX";break;case Om:t="Neutral";break;case Bm:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const zo=new H;function Wx(){ct.getLuminanceCoefficients(zo);const s=zo.x.toFixed(4),e=zo.y.toFixed(4),t=zo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Xx(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ws).join(`
`)}function Yx(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function qx(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const o=s.getActiveAttrib(e,i),r=o.name;let a=1;o.type===s.FLOAT_MAT2&&(a=2),o.type===s.FLOAT_MAT3&&(a=3),o.type===s.FLOAT_MAT4&&(a=4),t[r]={type:o.type,location:s.getAttribLocation(e,r),locationSize:a}}return t}function Ws(s){return s!==""}function zc(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Vc(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Kx=/^[ \t]*#include +<([\w\d./]+)>/gm;function hl(s){return s.replace(Kx,jx)}const Qx=new Map;function jx(s,e){let t=Qe[e];if(t===void 0){const n=Qx.get(e);if(n!==void 0)t=Qe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return hl(t)}const Jx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Gc(s){return s.replace(Jx,Zx)}function Zx(s,e,t,n){let i="";for(let o=parseInt(e);o<parseInt(t);o++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return i}function Hc(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function $x(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Kd?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===um?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Qn&&(e="SHADOWMAP_TYPE_VSM"),e}function eA(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case bs:case ys:e="ENVMAP_TYPE_CUBE";break;case vr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function tA(s){let e="ENVMAP_MODE_REFLECTION";return s.envMap&&s.envMapMode===ys&&(e="ENVMAP_MODE_REFRACTION"),e}function nA(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Qd:e="ENVMAP_BLENDING_MULTIPLY";break;case Dm:e="ENVMAP_BLENDING_MIX";break;case Lm:e="ENVMAP_BLENDING_ADD";break}return e}function iA(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function sA(s,e,t,n){const i=s.getContext(),o=t.defines;let r=t.vertexShader,a=t.fragmentShader;const l=$x(t),d=eA(t),u=tA(t),c=nA(t),h=iA(t),f=Xx(t),_=Yx(o),g=i.createProgram();let p,m,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Ws).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Ws).join(`
`),m.length>0&&(m+=`
`)):(p=[Hc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ws).join(`
`),m=[Hc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.envMap?"#define "+u:"",t.envMap?"#define "+c:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==mi?"#define TONE_MAPPING":"",t.toneMapping!==mi?Qe.tonemapping_pars_fragment:"",t.toneMapping!==mi?Hx("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Qe.colorspace_pars_fragment,Gx("linearToOutputTexel",t.outputColorSpace),Wx(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ws).join(`
`)),r=hl(r),r=zc(r,t),r=Vc(r,t),a=hl(a),a=zc(a,t),a=Vc(a,t),r=Gc(r),a=Gc(a),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",t.glslVersion===cr?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===cr?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const w=M+p+r,b=M+m+a,R=Bc(i,i.VERTEX_SHADER,w),v=Bc(i,i.FRAGMENT_SHADER,b);i.attachShader(g,R),i.attachShader(g,v),t.index0AttributeName!==void 0?i.bindAttribLocation(g,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(g,0,"position"),i.linkProgram(g);function S(D){if(s.debug.checkShaderErrors){const L=i.getProgramInfoLog(g)||"",O=i.getShaderInfoLog(R)||"",G=i.getShaderInfoLog(v)||"",W=L.trim(),F=O.trim(),Y=G.trim();let B=!0,se=!0;if(i.getProgramParameter(g,i.LINK_STATUS)===!1)if(B=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,g,R,v);else{const de=Oc(i,R,"vertex"),xe=Oc(i,v,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(g,i.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+W+`
`+de+`
`+xe)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):(F===""||Y==="")&&(se=!1);se&&(D.diagnostics={runnable:B,programLog:W,vertexShader:{log:F,prefix:p},fragmentShader:{log:Y,prefix:m}})}i.deleteShader(R),i.deleteShader(v),C=new or(i,g),A=qx(i,g)}let C;this.getUniforms=function(){return C===void 0&&S(this),C};let A;this.getAttributes=function(){return A===void 0&&S(this),A};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=i.getProgramParameter(g,Fx)),y},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(g),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Ox++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=R,this.fragmentShader=v,this}let oA=0;class rA{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),o=this._getShaderStage(n),r=this._getShaderCacheForMaterial(e);return r.has(i)===!1&&(r.add(i),i.usedTimes++),r.has(o)===!1&&(r.add(o),o.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new aA(e),t.set(e,n)),n}}class aA{constructor(e){this.id=oA++,this.code=e,this.usedTimes=0}}function lA(s,e,t,n,i,o,r){const a=new ah,l=new rA,d=new Set,u=[],c=i.logarithmicDepthBuffer,h=i.vertexTextures;let f=i.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(A){return d.add(A),A===0?"uv":`uv${A}`}function p(A,y,D,L,O){const G=L.fog,W=O.geometry,F=A.isMeshStandardMaterial?L.environment:null,Y=(A.isMeshStandardMaterial?t:e).get(A.envMap||F),B=Y&&Y.mapping===vr?Y.image.height:null,se=_[A.type];A.precision!==null&&(f=i.getMaxPrecision(A.precision),f!==A.precision&&console.warn("THREE.WebGLProgram.getParameters:",A.precision,"not supported, using",f,"instead."));const de=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,xe=de!==void 0?de.length:0;let Oe=0;W.morphAttributes.position!==void 0&&(Oe=1),W.morphAttributes.normal!==void 0&&(Oe=2),W.morphAttributes.color!==void 0&&(Oe=3);let Me,Z,Pe,K;if(se){const it=On[se];Me=it.vertexShader,Z=it.fragmentShader}else Me=A.vertexShader,Z=A.fragmentShader,l.update(A),Pe=l.getVertexShaderID(A),K=l.getFragmentShaderID(A);const $=s.getRenderTarget(),oe=s.state.buffers.depth.getReversed(),pe=O.isInstancedMesh===!0,he=O.isBatchedMesh===!0,Ie=!!A.map,_t=!!A.matcap,P=!!Y,ut=!!A.aoMap,I=!!A.lightMap,we=!!A.bumpMap,Se=!!A.normalMap,ot=!!A.displacementMap,ve=!!A.emissiveMap,Xe=!!A.metalnessMap,St=!!A.roughnessMap,rt=A.anisotropy>0,k=A.clearcoat>0,E=A.dispersion>0,X=A.iridescence>0,J=A.sheen>0,re=A.transmission>0,j=rt&&!!A.anisotropyMap,Ue=k&&!!A.clearcoatMap,fe=k&&!!A.clearcoatNormalMap,ke=k&&!!A.clearcoatRoughnessMap,Ne=X&&!!A.iridescenceMap,ne=X&&!!A.iridescenceThicknessMap,me=J&&!!A.sheenColorMap,Be=J&&!!A.sheenRoughnessMap,Re=!!A.specularMap,ge=!!A.specularColorMap,We=!!A.specularIntensityMap,U=re&&!!A.transmissionMap,ie=re&&!!A.thicknessMap,ae=!!A.gradientMap,Te=!!A.alphaMap,le=A.alphaTest>0,ee=!!A.alphaHash,Le=!!A.extensions;let He=mi;A.toneMapped&&($===null||$.isXRRenderTarget===!0)&&(He=s.toneMapping);const ce={shaderID:se,shaderType:A.type,shaderName:A.name,vertexShader:Me,fragmentShader:Z,defines:A.defines,customVertexShaderID:Pe,customFragmentShaderID:K,isRawShaderMaterial:A.isRawShaderMaterial===!0,glslVersion:A.glslVersion,precision:f,batching:he,batchingColor:he&&O._colorsTexture!==null,instancing:pe,instancingColor:pe&&O.instanceColor!==null,instancingMorph:pe&&O.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:$===null?s.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:Ms,alphaToCoverage:!!A.alphaToCoverage,map:Ie,matcap:_t,envMap:P,envMapMode:P&&Y.mapping,envMapCubeUVHeight:B,aoMap:ut,lightMap:I,bumpMap:we,normalMap:Se,displacementMap:h&&ot,emissiveMap:ve,normalMapObjectSpace:Se&&A.normalMapType===Wm,normalMapTangentSpace:Se&&A.normalMapType===Hm,metalnessMap:Xe,roughnessMap:St,anisotropy:rt,anisotropyMap:j,clearcoat:k,clearcoatMap:Ue,clearcoatNormalMap:fe,clearcoatRoughnessMap:ke,dispersion:E,iridescence:X,iridescenceMap:Ne,iridescenceThicknessMap:ne,sheen:J,sheenColorMap:me,sheenRoughnessMap:Be,specularMap:Re,specularColorMap:ge,specularIntensityMap:We,transmission:re,transmissionMap:U,thicknessMap:ie,gradientMap:ae,opaque:A.transparent===!1&&A.blending===_s&&A.alphaToCoverage===!1,alphaMap:Te,alphaTest:le,alphaHash:ee,combine:A.combine,mapUv:Ie&&g(A.map.channel),aoMapUv:ut&&g(A.aoMap.channel),lightMapUv:I&&g(A.lightMap.channel),bumpMapUv:we&&g(A.bumpMap.channel),normalMapUv:Se&&g(A.normalMap.channel),displacementMapUv:ot&&g(A.displacementMap.channel),emissiveMapUv:ve&&g(A.emissiveMap.channel),metalnessMapUv:Xe&&g(A.metalnessMap.channel),roughnessMapUv:St&&g(A.roughnessMap.channel),anisotropyMapUv:j&&g(A.anisotropyMap.channel),clearcoatMapUv:Ue&&g(A.clearcoatMap.channel),clearcoatNormalMapUv:fe&&g(A.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ke&&g(A.clearcoatRoughnessMap.channel),iridescenceMapUv:Ne&&g(A.iridescenceMap.channel),iridescenceThicknessMapUv:ne&&g(A.iridescenceThicknessMap.channel),sheenColorMapUv:me&&g(A.sheenColorMap.channel),sheenRoughnessMapUv:Be&&g(A.sheenRoughnessMap.channel),specularMapUv:Re&&g(A.specularMap.channel),specularColorMapUv:ge&&g(A.specularColorMap.channel),specularIntensityMapUv:We&&g(A.specularIntensityMap.channel),transmissionMapUv:U&&g(A.transmissionMap.channel),thicknessMapUv:ie&&g(A.thicknessMap.channel),alphaMapUv:Te&&g(A.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(Se||rt),vertexColors:A.vertexColors,vertexAlphas:A.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!W.attributes.uv&&(Ie||Te),fog:!!G,useFog:A.fog===!0,fogExp2:!!G&&G.isFogExp2,flatShading:A.flatShading===!0&&A.wireframe===!1,sizeAttenuation:A.sizeAttenuation===!0,logarithmicDepthBuffer:c,reversedDepthBuffer:oe,skinning:O.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:xe,morphTextureStride:Oe,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:A.dithering,shadowMapEnabled:s.shadowMap.enabled&&D.length>0,shadowMapType:s.shadowMap.type,toneMapping:He,decodeVideoTexture:Ie&&A.map.isVideoTexture===!0&&ct.getTransfer(A.map.colorSpace)===gt,decodeVideoTextureEmissive:ve&&A.emissiveMap.isVideoTexture===!0&&ct.getTransfer(A.emissiveMap.colorSpace)===gt,premultipliedAlpha:A.premultipliedAlpha,doubleSided:A.side===sn,flipSided:A.side===$t,useDepthPacking:A.depthPacking>=0,depthPacking:A.depthPacking||0,index0AttributeName:A.index0AttributeName,extensionClipCullDistance:Le&&A.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Le&&A.extensions.multiDraw===!0||he)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:A.customProgramCacheKey()};return ce.vertexUv1s=d.has(1),ce.vertexUv2s=d.has(2),ce.vertexUv3s=d.has(3),d.clear(),ce}function m(A){const y=[];if(A.shaderID?y.push(A.shaderID):(y.push(A.customVertexShaderID),y.push(A.customFragmentShaderID)),A.defines!==void 0)for(const D in A.defines)y.push(D),y.push(A.defines[D]);return A.isRawShaderMaterial===!1&&(M(y,A),w(y,A),y.push(s.outputColorSpace)),y.push(A.customProgramCacheKey),y.join()}function M(A,y){A.push(y.precision),A.push(y.outputColorSpace),A.push(y.envMapMode),A.push(y.envMapCubeUVHeight),A.push(y.mapUv),A.push(y.alphaMapUv),A.push(y.lightMapUv),A.push(y.aoMapUv),A.push(y.bumpMapUv),A.push(y.normalMapUv),A.push(y.displacementMapUv),A.push(y.emissiveMapUv),A.push(y.metalnessMapUv),A.push(y.roughnessMapUv),A.push(y.anisotropyMapUv),A.push(y.clearcoatMapUv),A.push(y.clearcoatNormalMapUv),A.push(y.clearcoatRoughnessMapUv),A.push(y.iridescenceMapUv),A.push(y.iridescenceThicknessMapUv),A.push(y.sheenColorMapUv),A.push(y.sheenRoughnessMapUv),A.push(y.specularMapUv),A.push(y.specularColorMapUv),A.push(y.specularIntensityMapUv),A.push(y.transmissionMapUv),A.push(y.thicknessMapUv),A.push(y.combine),A.push(y.fogExp2),A.push(y.sizeAttenuation),A.push(y.morphTargetsCount),A.push(y.morphAttributeCount),A.push(y.numDirLights),A.push(y.numPointLights),A.push(y.numSpotLights),A.push(y.numSpotLightMaps),A.push(y.numHemiLights),A.push(y.numRectAreaLights),A.push(y.numDirLightShadows),A.push(y.numPointLightShadows),A.push(y.numSpotLightShadows),A.push(y.numSpotLightShadowsWithMaps),A.push(y.numLightProbes),A.push(y.shadowMapType),A.push(y.toneMapping),A.push(y.numClippingPlanes),A.push(y.numClipIntersection),A.push(y.depthPacking)}function w(A,y){a.disableAll(),y.supportsVertexTextures&&a.enable(0),y.instancing&&a.enable(1),y.instancingColor&&a.enable(2),y.instancingMorph&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),y.dispersion&&a.enable(20),y.batchingColor&&a.enable(21),y.gradientMap&&a.enable(22),A.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reversedDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),A.push(a.mask)}function b(A){const y=_[A.type];let D;if(y){const L=On[y];D=Ng.clone(L.uniforms)}else D=A.uniforms;return D}function R(A,y){let D;for(let L=0,O=u.length;L<O;L++){const G=u[L];if(G.cacheKey===y){D=G,++D.usedTimes;break}}return D===void 0&&(D=new sA(s,y,A,o),u.push(D)),D}function v(A){if(--A.usedTimes===0){const y=u.indexOf(A);u[y]=u[u.length-1],u.pop(),A.destroy()}}function S(A){l.remove(A)}function C(){l.dispose()}return{getParameters:p,getProgramCacheKey:m,getUniforms:b,acquireProgram:R,releaseProgram:v,releaseShaderCache:S,programs:u,dispose:C}}function cA(){let s=new WeakMap;function e(r){return s.has(r)}function t(r){let a=s.get(r);return a===void 0&&(a={},s.set(r,a)),a}function n(r){s.delete(r)}function i(r,a,l){s.get(r)[a]=l}function o(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:o}}function dA(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function Wc(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Xc(){const s=[];let e=0;const t=[],n=[],i=[];function o(){e=0,t.length=0,n.length=0,i.length=0}function r(c,h,f,_,g,p){let m=s[e];return m===void 0?(m={id:c.id,object:c,geometry:h,material:f,groupOrder:_,renderOrder:c.renderOrder,z:g,group:p},s[e]=m):(m.id=c.id,m.object=c,m.geometry=h,m.material=f,m.groupOrder=_,m.renderOrder=c.renderOrder,m.z=g,m.group=p),e++,m}function a(c,h,f,_,g,p){const m=r(c,h,f,_,g,p);f.transmission>0?n.push(m):f.transparent===!0?i.push(m):t.push(m)}function l(c,h,f,_,g,p){const m=r(c,h,f,_,g,p);f.transmission>0?n.unshift(m):f.transparent===!0?i.unshift(m):t.unshift(m)}function d(c,h){t.length>1&&t.sort(c||dA),n.length>1&&n.sort(h||Wc),i.length>1&&i.sort(h||Wc)}function u(){for(let c=e,h=s.length;c<h;c++){const f=s[c];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:i,init:o,push:a,unshift:l,finish:u,sort:d}}function hA(){let s=new WeakMap;function e(n,i){const o=s.get(n);let r;return o===void 0?(r=new Xc,s.set(n,[r])):i>=o.length?(r=new Xc,o.push(r)):r=o[i],r}function t(){s=new WeakMap}return{get:e,dispose:t}}function uA(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new H,color:new je};break;case"SpotLight":t={position:new H,direction:new H,color:new je,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new H,color:new je,distance:0,decay:0};break;case"HemisphereLight":t={direction:new H,skyColor:new je,groundColor:new je};break;case"RectAreaLight":t={color:new je,position:new H,halfWidth:new H,halfHeight:new H};break}return s[e.id]=t,t}}}function fA(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Je};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Je};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Je,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let pA=0;function mA(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function gA(s){const e=new uA,t=fA(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let d=0;d<9;d++)n.probe.push(new H);const i=new H,o=new Dt,r=new Dt;function a(d){let u=0,c=0,h=0;for(let A=0;A<9;A++)n.probe[A].set(0,0,0);let f=0,_=0,g=0,p=0,m=0,M=0,w=0,b=0,R=0,v=0,S=0;d.sort(mA);for(let A=0,y=d.length;A<y;A++){const D=d[A],L=D.color,O=D.intensity,G=D.distance,W=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)u+=L.r*O,c+=L.g*O,h+=L.b*O;else if(D.isLightProbe){for(let F=0;F<9;F++)n.probe[F].addScaledVector(D.sh.coefficients[F],O);S++}else if(D.isDirectionalLight){const F=e.get(D);if(F.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const Y=D.shadow,B=t.get(D);B.shadowIntensity=Y.intensity,B.shadowBias=Y.bias,B.shadowNormalBias=Y.normalBias,B.shadowRadius=Y.radius,B.shadowMapSize=Y.mapSize,n.directionalShadow[f]=B,n.directionalShadowMap[f]=W,n.directionalShadowMatrix[f]=D.shadow.matrix,M++}n.directional[f]=F,f++}else if(D.isSpotLight){const F=e.get(D);F.position.setFromMatrixPosition(D.matrixWorld),F.color.copy(L).multiplyScalar(O),F.distance=G,F.coneCos=Math.cos(D.angle),F.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),F.decay=D.decay,n.spot[g]=F;const Y=D.shadow;if(D.map&&(n.spotLightMap[R]=D.map,R++,Y.updateMatrices(D),D.castShadow&&v++),n.spotLightMatrix[g]=Y.matrix,D.castShadow){const B=t.get(D);B.shadowIntensity=Y.intensity,B.shadowBias=Y.bias,B.shadowNormalBias=Y.normalBias,B.shadowRadius=Y.radius,B.shadowMapSize=Y.mapSize,n.spotShadow[g]=B,n.spotShadowMap[g]=W,b++}g++}else if(D.isRectAreaLight){const F=e.get(D);F.color.copy(L).multiplyScalar(O),F.halfWidth.set(D.width*.5,0,0),F.halfHeight.set(0,D.height*.5,0),n.rectArea[p]=F,p++}else if(D.isPointLight){const F=e.get(D);if(F.color.copy(D.color).multiplyScalar(D.intensity),F.distance=D.distance,F.decay=D.decay,D.castShadow){const Y=D.shadow,B=t.get(D);B.shadowIntensity=Y.intensity,B.shadowBias=Y.bias,B.shadowNormalBias=Y.normalBias,B.shadowRadius=Y.radius,B.shadowMapSize=Y.mapSize,B.shadowCameraNear=Y.camera.near,B.shadowCameraFar=Y.camera.far,n.pointShadow[_]=B,n.pointShadowMap[_]=W,n.pointShadowMatrix[_]=D.shadow.matrix,w++}n.point[_]=F,_++}else if(D.isHemisphereLight){const F=e.get(D);F.skyColor.copy(D.color).multiplyScalar(O),F.groundColor.copy(D.groundColor).multiplyScalar(O),n.hemi[m]=F,m++}}p>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ye.LTC_FLOAT_1,n.rectAreaLTC2=ye.LTC_FLOAT_2):(n.rectAreaLTC1=ye.LTC_HALF_1,n.rectAreaLTC2=ye.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=c,n.ambient[2]=h;const C=n.hash;(C.directionalLength!==f||C.pointLength!==_||C.spotLength!==g||C.rectAreaLength!==p||C.hemiLength!==m||C.numDirectionalShadows!==M||C.numPointShadows!==w||C.numSpotShadows!==b||C.numSpotMaps!==R||C.numLightProbes!==S)&&(n.directional.length=f,n.spot.length=g,n.rectArea.length=p,n.point.length=_,n.hemi.length=m,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=w,n.pointShadowMap.length=w,n.spotShadow.length=b,n.spotShadowMap.length=b,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=w,n.spotLightMatrix.length=b+R-v,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=v,n.numLightProbes=S,C.directionalLength=f,C.pointLength=_,C.spotLength=g,C.rectAreaLength=p,C.hemiLength=m,C.numDirectionalShadows=M,C.numPointShadows=w,C.numSpotShadows=b,C.numSpotMaps=R,C.numLightProbes=S,n.version=pA++)}function l(d,u){let c=0,h=0,f=0,_=0,g=0;const p=u.matrixWorldInverse;for(let m=0,M=d.length;m<M;m++){const w=d[m];if(w.isDirectionalLight){const b=n.directional[c];b.direction.setFromMatrixPosition(w.matrixWorld),i.setFromMatrixPosition(w.target.matrixWorld),b.direction.sub(i),b.direction.transformDirection(p),c++}else if(w.isSpotLight){const b=n.spot[f];b.position.setFromMatrixPosition(w.matrixWorld),b.position.applyMatrix4(p),b.direction.setFromMatrixPosition(w.matrixWorld),i.setFromMatrixPosition(w.target.matrixWorld),b.direction.sub(i),b.direction.transformDirection(p),f++}else if(w.isRectAreaLight){const b=n.rectArea[_];b.position.setFromMatrixPosition(w.matrixWorld),b.position.applyMatrix4(p),r.identity(),o.copy(w.matrixWorld),o.premultiply(p),r.extractRotation(o),b.halfWidth.set(w.width*.5,0,0),b.halfHeight.set(0,w.height*.5,0),b.halfWidth.applyMatrix4(r),b.halfHeight.applyMatrix4(r),_++}else if(w.isPointLight){const b=n.point[h];b.position.setFromMatrixPosition(w.matrixWorld),b.position.applyMatrix4(p),h++}else if(w.isHemisphereLight){const b=n.hemi[g];b.direction.setFromMatrixPosition(w.matrixWorld),b.direction.transformDirection(p),g++}}}return{setup:a,setupView:l,state:n}}function Yc(s){const e=new gA(s),t=[],n=[];function i(u){d.camera=u,t.length=0,n.length=0}function o(u){t.push(u)}function r(u){n.push(u)}function a(){e.setup(t)}function l(u){e.setupView(t,u)}const d={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:d,setupLights:a,setupLightsView:l,pushLight:o,pushShadow:r}}function _A(s){let e=new WeakMap;function t(i,o=0){const r=e.get(i);let a;return r===void 0?(a=new Yc(s),e.set(i,[a])):o>=r.length?(a=new Yc(s),r.push(a)):a=r[o],a}function n(){e=new WeakMap}return{get:t,dispose:n}}const vA=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,xA=`uniform sampler2D shadow_pass;
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
}`;function AA(s,e,t){let n=new gh;const i=new Je,o=new Je,r=new Ct,a=new Yg({depthPacking:Gm}),l=new qg,d={},u=t.maxTextureSize,c={[ei]:$t,[$t]:ei,[sn]:sn},h=new Gn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Je},radius:{value:4}},vertexShader:vA,fragmentShader:xA}),f=h.clone();f.defines.HORIZONTAL_PASS=1;const _=new rn;_.setAttribute("position",new Qt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new dt(_,h),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Kd;let m=this.type;this.render=function(v,S,C){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||v.length===0)return;const A=s.getRenderTarget(),y=s.getActiveCubeFace(),D=s.getActiveMipmapLevel(),L=s.state;L.setBlending(pi),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);const O=m!==Qn&&this.type===Qn,G=m===Qn&&this.type!==Qn;for(let W=0,F=v.length;W<F;W++){const Y=v[W],B=Y.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;i.copy(B.mapSize);const se=B.getFrameExtents();if(i.multiply(se),o.copy(B.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(o.x=Math.floor(u/se.x),i.x=o.x*se.x,B.mapSize.x=o.x),i.y>u&&(o.y=Math.floor(u/se.y),i.y=o.y*se.y,B.mapSize.y=o.y)),B.map===null||O===!0||G===!0){const xe=this.type!==Qn?{minFilter:en,magFilter:en}:{};B.map!==null&&B.map.dispose(),B.map=new Fi(i.x,i.y,xe),B.map.texture.name=Y.name+".shadowMap",B.camera.updateProjectionMatrix()}s.setRenderTarget(B.map),s.clear();const de=B.getViewportCount();for(let xe=0;xe<de;xe++){const Oe=B.getViewport(xe);r.set(o.x*Oe.x,o.y*Oe.y,o.x*Oe.z,o.y*Oe.w),L.viewport(r),B.updateMatrices(Y,xe),n=B.getFrustum(),b(S,C,B.camera,Y,this.type)}B.isPointLightShadow!==!0&&this.type===Qn&&M(B,C),B.needsUpdate=!1}m=this.type,p.needsUpdate=!1,s.setRenderTarget(A,y,D)};function M(v,S){const C=e.update(g);h.defines.VSM_SAMPLES!==v.blurSamples&&(h.defines.VSM_SAMPLES=v.blurSamples,f.defines.VSM_SAMPLES=v.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),v.mapPass===null&&(v.mapPass=new Fi(i.x,i.y)),h.uniforms.shadow_pass.value=v.map.texture,h.uniforms.resolution.value=v.mapSize,h.uniforms.radius.value=v.radius,s.setRenderTarget(v.mapPass),s.clear(),s.renderBufferDirect(S,null,C,h,g,null),f.uniforms.shadow_pass.value=v.mapPass.texture,f.uniforms.resolution.value=v.mapSize,f.uniforms.radius.value=v.radius,s.setRenderTarget(v.map),s.clear(),s.renderBufferDirect(S,null,C,f,g,null)}function w(v,S,C,A){let y=null;const D=C.isPointLight===!0?v.customDistanceMaterial:v.customDepthMaterial;if(D!==void 0)y=D;else if(y=C.isPointLight===!0?l:a,s.localClippingEnabled&&S.clipShadows===!0&&Array.isArray(S.clippingPlanes)&&S.clippingPlanes.length!==0||S.displacementMap&&S.displacementScale!==0||S.alphaMap&&S.alphaTest>0||S.map&&S.alphaTest>0||S.alphaToCoverage===!0){const L=y.uuid,O=S.uuid;let G=d[L];G===void 0&&(G={},d[L]=G);let W=G[O];W===void 0&&(W=y.clone(),G[O]=W,S.addEventListener("dispose",R)),y=W}if(y.visible=S.visible,y.wireframe=S.wireframe,A===Qn?y.side=S.shadowSide!==null?S.shadowSide:S.side:y.side=S.shadowSide!==null?S.shadowSide:c[S.side],y.alphaMap=S.alphaMap,y.alphaTest=S.alphaToCoverage===!0?.5:S.alphaTest,y.map=S.map,y.clipShadows=S.clipShadows,y.clippingPlanes=S.clippingPlanes,y.clipIntersection=S.clipIntersection,y.displacementMap=S.displacementMap,y.displacementScale=S.displacementScale,y.displacementBias=S.displacementBias,y.wireframeLinewidth=S.wireframeLinewidth,y.linewidth=S.linewidth,C.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const L=s.properties.get(y);L.light=C}return y}function b(v,S,C,A,y){if(v.visible===!1)return;if(v.layers.test(S.layers)&&(v.isMesh||v.isLine||v.isPoints)&&(v.castShadow||v.receiveShadow&&y===Qn)&&(!v.frustumCulled||n.intersectsObject(v))){v.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,v.matrixWorld);const O=e.update(v),G=v.material;if(Array.isArray(G)){const W=O.groups;for(let F=0,Y=W.length;F<Y;F++){const B=W[F],se=G[B.materialIndex];if(se&&se.visible){const de=w(v,se,A,y);v.onBeforeShadow(s,v,S,C,O,de,B),s.renderBufferDirect(C,null,O,de,v,B),v.onAfterShadow(s,v,S,C,O,de,B)}}}else if(G.visible){const W=w(v,G,A,y);v.onBeforeShadow(s,v,S,C,O,W,null),s.renderBufferDirect(C,null,O,W,v,null),v.onAfterShadow(s,v,S,C,O,W,null)}}const L=v.children;for(let O=0,G=L.length;O<G;O++)b(L[O],S,C,A,y)}function R(v){v.target.removeEventListener("dispose",R);for(const C in d){const A=d[C],y=v.target.uuid;y in A&&(A[y].dispose(),delete A[y])}}}const bA={[wa]:Ta,[Ca]:Da,[Ra]:La,[As]:ka,[Ta]:wa,[Da]:Ca,[La]:Ra,[ka]:As};function yA(s,e){function t(){let U=!1;const ie=new Ct;let ae=null;const Te=new Ct(0,0,0,0);return{setMask:function(le){ae!==le&&!U&&(s.colorMask(le,le,le,le),ae=le)},setLocked:function(le){U=le},setClear:function(le,ee,Le,He,ce){ce===!0&&(le*=He,ee*=He,Le*=He),ie.set(le,ee,Le,He),Te.equals(ie)===!1&&(s.clearColor(le,ee,Le,He),Te.copy(ie))},reset:function(){U=!1,ae=null,Te.set(-1,0,0,0)}}}function n(){let U=!1,ie=!1,ae=null,Te=null,le=null;return{setReversed:function(ee){if(ie!==ee){const Le=e.get("EXT_clip_control");ee?Le.clipControlEXT(Le.LOWER_LEFT_EXT,Le.ZERO_TO_ONE_EXT):Le.clipControlEXT(Le.LOWER_LEFT_EXT,Le.NEGATIVE_ONE_TO_ONE_EXT),ie=ee;const He=le;le=null,this.setClear(He)}},getReversed:function(){return ie},setTest:function(ee){ee?$(s.DEPTH_TEST):oe(s.DEPTH_TEST)},setMask:function(ee){ae!==ee&&!U&&(s.depthMask(ee),ae=ee)},setFunc:function(ee){if(ie&&(ee=bA[ee]),Te!==ee){switch(ee){case wa:s.depthFunc(s.NEVER);break;case Ta:s.depthFunc(s.ALWAYS);break;case Ca:s.depthFunc(s.LESS);break;case As:s.depthFunc(s.LEQUAL);break;case Ra:s.depthFunc(s.EQUAL);break;case ka:s.depthFunc(s.GEQUAL);break;case Da:s.depthFunc(s.GREATER);break;case La:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}Te=ee}},setLocked:function(ee){U=ee},setClear:function(ee){le!==ee&&(ie&&(ee=1-ee),s.clearDepth(ee),le=ee)},reset:function(){U=!1,ae=null,Te=null,le=null,ie=!1}}}function i(){let U=!1,ie=null,ae=null,Te=null,le=null,ee=null,Le=null,He=null,ce=null;return{setTest:function(it){U||(it?$(s.STENCIL_TEST):oe(s.STENCIL_TEST))},setMask:function(it){ie!==it&&!U&&(s.stencilMask(it),ie=it)},setFunc:function(it,_n,an){(ae!==it||Te!==_n||le!==an)&&(s.stencilFunc(it,_n,an),ae=it,Te=_n,le=an)},setOp:function(it,_n,an){(ee!==it||Le!==_n||He!==an)&&(s.stencilOp(it,_n,an),ee=it,Le=_n,He=an)},setLocked:function(it){U=it},setClear:function(it){ce!==it&&(s.clearStencil(it),ce=it)},reset:function(){U=!1,ie=null,ae=null,Te=null,le=null,ee=null,Le=null,He=null,ce=null}}}const o=new t,r=new n,a=new i,l=new WeakMap,d=new WeakMap;let u={},c={},h=new WeakMap,f=[],_=null,g=!1,p=null,m=null,M=null,w=null,b=null,R=null,v=null,S=new je(0,0,0),C=0,A=!1,y=null,D=null,L=null,O=null,G=null;const W=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let F=!1,Y=0;const B=s.getParameter(s.VERSION);B.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(B)[1]),F=Y>=1):B.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),F=Y>=2);let se=null,de={};const xe=s.getParameter(s.SCISSOR_BOX),Oe=s.getParameter(s.VIEWPORT),Me=new Ct().fromArray(xe),Z=new Ct().fromArray(Oe);function Pe(U,ie,ae,Te){const le=new Uint8Array(4),ee=s.createTexture();s.bindTexture(U,ee),s.texParameteri(U,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(U,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Le=0;Le<ae;Le++)U===s.TEXTURE_3D||U===s.TEXTURE_2D_ARRAY?s.texImage3D(ie,0,s.RGBA,1,1,Te,0,s.RGBA,s.UNSIGNED_BYTE,le):s.texImage2D(ie+Le,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,le);return ee}const K={};K[s.TEXTURE_2D]=Pe(s.TEXTURE_2D,s.TEXTURE_2D,1),K[s.TEXTURE_CUBE_MAP]=Pe(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),K[s.TEXTURE_2D_ARRAY]=Pe(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),K[s.TEXTURE_3D]=Pe(s.TEXTURE_3D,s.TEXTURE_3D,1,1),o.setClear(0,0,0,1),r.setClear(1),a.setClear(0),$(s.DEPTH_TEST),r.setFunc(As),we(!1),Se(Zl),$(s.CULL_FACE),ut(pi);function $(U){u[U]!==!0&&(s.enable(U),u[U]=!0)}function oe(U){u[U]!==!1&&(s.disable(U),u[U]=!1)}function pe(U,ie){return c[U]!==ie?(s.bindFramebuffer(U,ie),c[U]=ie,U===s.DRAW_FRAMEBUFFER&&(c[s.FRAMEBUFFER]=ie),U===s.FRAMEBUFFER&&(c[s.DRAW_FRAMEBUFFER]=ie),!0):!1}function he(U,ie){let ae=f,Te=!1;if(U){ae=h.get(ie),ae===void 0&&(ae=[],h.set(ie,ae));const le=U.textures;if(ae.length!==le.length||ae[0]!==s.COLOR_ATTACHMENT0){for(let ee=0,Le=le.length;ee<Le;ee++)ae[ee]=s.COLOR_ATTACHMENT0+ee;ae.length=le.length,Te=!0}}else ae[0]!==s.BACK&&(ae[0]=s.BACK,Te=!0);Te&&s.drawBuffers(ae)}function Ie(U){return _!==U?(s.useProgram(U),_=U,!0):!1}const _t={[Pi]:s.FUNC_ADD,[pm]:s.FUNC_SUBTRACT,[mm]:s.FUNC_REVERSE_SUBTRACT};_t[gm]=s.MIN,_t[_m]=s.MAX;const P={[vm]:s.ZERO,[xm]:s.ONE,[Am]:s.SRC_COLOR,[Ea]:s.SRC_ALPHA,[wm]:s.SRC_ALPHA_SATURATE,[Em]:s.DST_COLOR,[ym]:s.DST_ALPHA,[bm]:s.ONE_MINUS_SRC_COLOR,[Sa]:s.ONE_MINUS_SRC_ALPHA,[Sm]:s.ONE_MINUS_DST_COLOR,[Mm]:s.ONE_MINUS_DST_ALPHA,[Tm]:s.CONSTANT_COLOR,[Cm]:s.ONE_MINUS_CONSTANT_COLOR,[Rm]:s.CONSTANT_ALPHA,[km]:s.ONE_MINUS_CONSTANT_ALPHA};function ut(U,ie,ae,Te,le,ee,Le,He,ce,it){if(U===pi){g===!0&&(oe(s.BLEND),g=!1);return}if(g===!1&&($(s.BLEND),g=!0),U!==fm){if(U!==p||it!==A){if((m!==Pi||b!==Pi)&&(s.blendEquation(s.FUNC_ADD),m=Pi,b=Pi),it)switch(U){case _s:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case xs:s.blendFunc(s.ONE,s.ONE);break;case $l:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case ec:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case _s:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case xs:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case $l:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ec:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}M=null,w=null,R=null,v=null,S.set(0,0,0),C=0,p=U,A=it}return}le=le||ie,ee=ee||ae,Le=Le||Te,(ie!==m||le!==b)&&(s.blendEquationSeparate(_t[ie],_t[le]),m=ie,b=le),(ae!==M||Te!==w||ee!==R||Le!==v)&&(s.blendFuncSeparate(P[ae],P[Te],P[ee],P[Le]),M=ae,w=Te,R=ee,v=Le),(He.equals(S)===!1||ce!==C)&&(s.blendColor(He.r,He.g,He.b,ce),S.copy(He),C=ce),p=U,A=!1}function I(U,ie){U.side===sn?oe(s.CULL_FACE):$(s.CULL_FACE);let ae=U.side===$t;ie&&(ae=!ae),we(ae),U.blending===_s&&U.transparent===!1?ut(pi):ut(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),r.setFunc(U.depthFunc),r.setTest(U.depthTest),r.setMask(U.depthWrite),o.setMask(U.colorWrite);const Te=U.stencilWrite;a.setTest(Te),Te&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),ve(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?$(s.SAMPLE_ALPHA_TO_COVERAGE):oe(s.SAMPLE_ALPHA_TO_COVERAGE)}function we(U){y!==U&&(U?s.frontFace(s.CW):s.frontFace(s.CCW),y=U)}function Se(U){U!==dm?($(s.CULL_FACE),U!==D&&(U===Zl?s.cullFace(s.BACK):U===hm?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):oe(s.CULL_FACE),D=U}function ot(U){U!==L&&(F&&s.lineWidth(U),L=U)}function ve(U,ie,ae){U?($(s.POLYGON_OFFSET_FILL),(O!==ie||G!==ae)&&(s.polygonOffset(ie,ae),O=ie,G=ae)):oe(s.POLYGON_OFFSET_FILL)}function Xe(U){U?$(s.SCISSOR_TEST):oe(s.SCISSOR_TEST)}function St(U){U===void 0&&(U=s.TEXTURE0+W-1),se!==U&&(s.activeTexture(U),se=U)}function rt(U,ie,ae){ae===void 0&&(se===null?ae=s.TEXTURE0+W-1:ae=se);let Te=de[ae];Te===void 0&&(Te={type:void 0,texture:void 0},de[ae]=Te),(Te.type!==U||Te.texture!==ie)&&(se!==ae&&(s.activeTexture(ae),se=ae),s.bindTexture(U,ie||K[U]),Te.type=U,Te.texture=ie)}function k(){const U=de[se];U!==void 0&&U.type!==void 0&&(s.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function E(){try{s.compressedTexImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function X(){try{s.compressedTexImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function J(){try{s.texSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function re(){try{s.texSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function j(){try{s.compressedTexSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ue(){try{s.compressedTexSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function fe(){try{s.texStorage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ke(){try{s.texStorage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ne(){try{s.texImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ne(){try{s.texImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function me(U){Me.equals(U)===!1&&(s.scissor(U.x,U.y,U.z,U.w),Me.copy(U))}function Be(U){Z.equals(U)===!1&&(s.viewport(U.x,U.y,U.z,U.w),Z.copy(U))}function Re(U,ie){let ae=d.get(ie);ae===void 0&&(ae=new WeakMap,d.set(ie,ae));let Te=ae.get(U);Te===void 0&&(Te=s.getUniformBlockIndex(ie,U.name),ae.set(U,Te))}function ge(U,ie){const Te=d.get(ie).get(U);l.get(ie)!==Te&&(s.uniformBlockBinding(ie,Te,U.__bindingPointIndex),l.set(ie,Te))}function We(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),r.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),u={},se=null,de={},c={},h=new WeakMap,f=[],_=null,g=!1,p=null,m=null,M=null,w=null,b=null,R=null,v=null,S=new je(0,0,0),C=0,A=!1,y=null,D=null,L=null,O=null,G=null,Me.set(0,0,s.canvas.width,s.canvas.height),Z.set(0,0,s.canvas.width,s.canvas.height),o.reset(),r.reset(),a.reset()}return{buffers:{color:o,depth:r,stencil:a},enable:$,disable:oe,bindFramebuffer:pe,drawBuffers:he,useProgram:Ie,setBlending:ut,setMaterial:I,setFlipSided:we,setCullFace:Se,setLineWidth:ot,setPolygonOffset:ve,setScissorTest:Xe,activeTexture:St,bindTexture:rt,unbindTexture:k,compressedTexImage2D:E,compressedTexImage3D:X,texImage2D:Ne,texImage3D:ne,updateUBOMapping:Re,uniformBlockBinding:ge,texStorage2D:fe,texStorage3D:ke,texSubImage2D:J,texSubImage3D:re,compressedTexSubImage2D:j,compressedTexSubImage3D:Ue,scissor:me,viewport:Be,reset:We}}function MA(s,e,t,n,i,o,r){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),d=new Je,u=new WeakMap;let c;const h=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(k,E){return f?new OffscreenCanvas(k,E):hr("canvas")}function g(k,E,X){let J=1;const re=rt(k);if((re.width>X||re.height>X)&&(J=X/Math.max(re.width,re.height)),J<1)if(typeof HTMLImageElement<"u"&&k instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&k instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&k instanceof ImageBitmap||typeof VideoFrame<"u"&&k instanceof VideoFrame){const j=Math.floor(J*re.width),Ue=Math.floor(J*re.height);c===void 0&&(c=_(j,Ue));const fe=E?_(j,Ue):c;return fe.width=j,fe.height=Ue,fe.getContext("2d").drawImage(k,0,0,j,Ue),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+re.width+"x"+re.height+") to ("+j+"x"+Ue+")."),fe}else return"data"in k&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+re.width+"x"+re.height+")."),k;return k}function p(k){return k.generateMipmaps}function m(k){s.generateMipmap(k)}function M(k){return k.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:k.isWebGL3DRenderTarget?s.TEXTURE_3D:k.isWebGLArrayRenderTarget||k.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function w(k,E,X,J,re=!1){if(k!==null){if(s[k]!==void 0)return s[k];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+k+"'")}let j=E;if(E===s.RED&&(X===s.FLOAT&&(j=s.R32F),X===s.HALF_FLOAT&&(j=s.R16F),X===s.UNSIGNED_BYTE&&(j=s.R8)),E===s.RED_INTEGER&&(X===s.UNSIGNED_BYTE&&(j=s.R8UI),X===s.UNSIGNED_SHORT&&(j=s.R16UI),X===s.UNSIGNED_INT&&(j=s.R32UI),X===s.BYTE&&(j=s.R8I),X===s.SHORT&&(j=s.R16I),X===s.INT&&(j=s.R32I)),E===s.RG&&(X===s.FLOAT&&(j=s.RG32F),X===s.HALF_FLOAT&&(j=s.RG16F),X===s.UNSIGNED_BYTE&&(j=s.RG8)),E===s.RG_INTEGER&&(X===s.UNSIGNED_BYTE&&(j=s.RG8UI),X===s.UNSIGNED_SHORT&&(j=s.RG16UI),X===s.UNSIGNED_INT&&(j=s.RG32UI),X===s.BYTE&&(j=s.RG8I),X===s.SHORT&&(j=s.RG16I),X===s.INT&&(j=s.RG32I)),E===s.RGB_INTEGER&&(X===s.UNSIGNED_BYTE&&(j=s.RGB8UI),X===s.UNSIGNED_SHORT&&(j=s.RGB16UI),X===s.UNSIGNED_INT&&(j=s.RGB32UI),X===s.BYTE&&(j=s.RGB8I),X===s.SHORT&&(j=s.RGB16I),X===s.INT&&(j=s.RGB32I)),E===s.RGBA_INTEGER&&(X===s.UNSIGNED_BYTE&&(j=s.RGBA8UI),X===s.UNSIGNED_SHORT&&(j=s.RGBA16UI),X===s.UNSIGNED_INT&&(j=s.RGBA32UI),X===s.BYTE&&(j=s.RGBA8I),X===s.SHORT&&(j=s.RGBA16I),X===s.INT&&(j=s.RGBA32I)),E===s.RGB&&(X===s.UNSIGNED_INT_5_9_9_9_REV&&(j=s.RGB9_E5),X===s.UNSIGNED_INT_10F_11F_11F_REV&&(j=s.R11F_G11F_B10F)),E===s.RGBA){const Ue=re?lr:ct.getTransfer(J);X===s.FLOAT&&(j=s.RGBA32F),X===s.HALF_FLOAT&&(j=s.RGBA16F),X===s.UNSIGNED_BYTE&&(j=Ue===gt?s.SRGB8_ALPHA8:s.RGBA8),X===s.UNSIGNED_SHORT_4_4_4_4&&(j=s.RGBA4),X===s.UNSIGNED_SHORT_5_5_5_1&&(j=s.RGB5_A1)}return(j===s.R16F||j===s.R32F||j===s.RG16F||j===s.RG32F||j===s.RGBA16F||j===s.RGBA32F)&&e.get("EXT_color_buffer_float"),j}function b(k,E){let X;return k?E===null||E===Bi||E===eo?X=s.DEPTH24_STENCIL8:E===Jn?X=s.DEPTH32F_STENCIL8:E===$s&&(X=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Bi||E===eo?X=s.DEPTH_COMPONENT24:E===Jn?X=s.DEPTH_COMPONENT32F:E===$s&&(X=s.DEPTH_COMPONENT16),X}function R(k,E){return p(k)===!0||k.isFramebufferTexture&&k.minFilter!==en&&k.minFilter!==gn?Math.log2(Math.max(E.width,E.height))+1:k.mipmaps!==void 0&&k.mipmaps.length>0?k.mipmaps.length:k.isCompressedTexture&&Array.isArray(k.image)?E.mipmaps.length:1}function v(k){const E=k.target;E.removeEventListener("dispose",v),C(E),E.isVideoTexture&&u.delete(E)}function S(k){const E=k.target;E.removeEventListener("dispose",S),y(E)}function C(k){const E=n.get(k);if(E.__webglInit===void 0)return;const X=k.source,J=h.get(X);if(J){const re=J[E.__cacheKey];re.usedTimes--,re.usedTimes===0&&A(k),Object.keys(J).length===0&&h.delete(X)}n.remove(k)}function A(k){const E=n.get(k);s.deleteTexture(E.__webglTexture);const X=k.source,J=h.get(X);delete J[E.__cacheKey],r.memory.textures--}function y(k){const E=n.get(k);if(k.depthTexture&&(k.depthTexture.dispose(),n.remove(k.depthTexture)),k.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(E.__webglFramebuffer[J]))for(let re=0;re<E.__webglFramebuffer[J].length;re++)s.deleteFramebuffer(E.__webglFramebuffer[J][re]);else s.deleteFramebuffer(E.__webglFramebuffer[J]);E.__webglDepthbuffer&&s.deleteRenderbuffer(E.__webglDepthbuffer[J])}else{if(Array.isArray(E.__webglFramebuffer))for(let J=0;J<E.__webglFramebuffer.length;J++)s.deleteFramebuffer(E.__webglFramebuffer[J]);else s.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&s.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&s.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let J=0;J<E.__webglColorRenderbuffer.length;J++)E.__webglColorRenderbuffer[J]&&s.deleteRenderbuffer(E.__webglColorRenderbuffer[J]);E.__webglDepthRenderbuffer&&s.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const X=k.textures;for(let J=0,re=X.length;J<re;J++){const j=n.get(X[J]);j.__webglTexture&&(s.deleteTexture(j.__webglTexture),r.memory.textures--),n.remove(X[J])}n.remove(k)}let D=0;function L(){D=0}function O(){const k=D;return k>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+k+" texture units while this GPU supports only "+i.maxTextures),D+=1,k}function G(k){const E=[];return E.push(k.wrapS),E.push(k.wrapT),E.push(k.wrapR||0),E.push(k.magFilter),E.push(k.minFilter),E.push(k.anisotropy),E.push(k.internalFormat),E.push(k.format),E.push(k.type),E.push(k.generateMipmaps),E.push(k.premultiplyAlpha),E.push(k.flipY),E.push(k.unpackAlignment),E.push(k.colorSpace),E.join()}function W(k,E){const X=n.get(k);if(k.isVideoTexture&&Xe(k),k.isRenderTargetTexture===!1&&k.isExternalTexture!==!0&&k.version>0&&X.__version!==k.version){const J=k.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{K(X,k,E);return}}else k.isExternalTexture&&(X.__webglTexture=k.sourceTexture?k.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,X.__webglTexture,s.TEXTURE0+E)}function F(k,E){const X=n.get(k);if(k.isRenderTargetTexture===!1&&k.version>0&&X.__version!==k.version){K(X,k,E);return}t.bindTexture(s.TEXTURE_2D_ARRAY,X.__webglTexture,s.TEXTURE0+E)}function Y(k,E){const X=n.get(k);if(k.isRenderTargetTexture===!1&&k.version>0&&X.__version!==k.version){K(X,k,E);return}t.bindTexture(s.TEXTURE_3D,X.__webglTexture,s.TEXTURE0+E)}function B(k,E){const X=n.get(k);if(k.version>0&&X.__version!==k.version){$(X,k,E);return}t.bindTexture(s.TEXTURE_CUBE_MAP,X.__webglTexture,s.TEXTURE0+E)}const se={[Zs]:s.REPEAT,[Ui]:s.CLAMP_TO_EDGE,[Ua]:s.MIRRORED_REPEAT},de={[en]:s.NEAREST,[zm]:s.NEAREST_MIPMAP_NEAREST,[Hs]:s.NEAREST_MIPMAP_LINEAR,[gn]:s.LINEAR,[Ir]:s.LINEAR_MIPMAP_NEAREST,[Ni]:s.LINEAR_MIPMAP_LINEAR},xe={[Xm]:s.NEVER,[Jm]:s.ALWAYS,[Ym]:s.LESS,[oh]:s.LEQUAL,[qm]:s.EQUAL,[jm]:s.GEQUAL,[Km]:s.GREATER,[Qm]:s.NOTEQUAL};function Oe(k,E){if(E.type===Jn&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===gn||E.magFilter===Ir||E.magFilter===Hs||E.magFilter===Ni||E.minFilter===gn||E.minFilter===Ir||E.minFilter===Hs||E.minFilter===Ni)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(k,s.TEXTURE_WRAP_S,se[E.wrapS]),s.texParameteri(k,s.TEXTURE_WRAP_T,se[E.wrapT]),(k===s.TEXTURE_3D||k===s.TEXTURE_2D_ARRAY)&&s.texParameteri(k,s.TEXTURE_WRAP_R,se[E.wrapR]),s.texParameteri(k,s.TEXTURE_MAG_FILTER,de[E.magFilter]),s.texParameteri(k,s.TEXTURE_MIN_FILTER,de[E.minFilter]),E.compareFunction&&(s.texParameteri(k,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(k,s.TEXTURE_COMPARE_FUNC,xe[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===en||E.minFilter!==Hs&&E.minFilter!==Ni||E.type===Jn&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||n.get(E).__currentAnisotropy){const X=e.get("EXT_texture_filter_anisotropic");s.texParameterf(k,X.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,i.getMaxAnisotropy())),n.get(E).__currentAnisotropy=E.anisotropy}}}function Me(k,E){let X=!1;k.__webglInit===void 0&&(k.__webglInit=!0,E.addEventListener("dispose",v));const J=E.source;let re=h.get(J);re===void 0&&(re={},h.set(J,re));const j=G(E);if(j!==k.__cacheKey){re[j]===void 0&&(re[j]={texture:s.createTexture(),usedTimes:0},r.memory.textures++,X=!0),re[j].usedTimes++;const Ue=re[k.__cacheKey];Ue!==void 0&&(re[k.__cacheKey].usedTimes--,Ue.usedTimes===0&&A(E)),k.__cacheKey=j,k.__webglTexture=re[j].texture}return X}function Z(k,E,X){return Math.floor(Math.floor(k/X)/E)}function Pe(k,E,X,J){const j=k.updateRanges;if(j.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,E.width,E.height,X,J,E.data);else{j.sort((ne,me)=>ne.start-me.start);let Ue=0;for(let ne=1;ne<j.length;ne++){const me=j[Ue],Be=j[ne],Re=me.start+me.count,ge=Z(Be.start,E.width,4),We=Z(me.start,E.width,4);Be.start<=Re+1&&ge===We&&Z(Be.start+Be.count-1,E.width,4)===ge?me.count=Math.max(me.count,Be.start+Be.count-me.start):(++Ue,j[Ue]=Be)}j.length=Ue+1;const fe=s.getParameter(s.UNPACK_ROW_LENGTH),ke=s.getParameter(s.UNPACK_SKIP_PIXELS),Ne=s.getParameter(s.UNPACK_SKIP_ROWS);s.pixelStorei(s.UNPACK_ROW_LENGTH,E.width);for(let ne=0,me=j.length;ne<me;ne++){const Be=j[ne],Re=Math.floor(Be.start/4),ge=Math.ceil(Be.count/4),We=Re%E.width,U=Math.floor(Re/E.width),ie=ge,ae=1;s.pixelStorei(s.UNPACK_SKIP_PIXELS,We),s.pixelStorei(s.UNPACK_SKIP_ROWS,U),t.texSubImage2D(s.TEXTURE_2D,0,We,U,ie,ae,X,J,E.data)}k.clearUpdateRanges(),s.pixelStorei(s.UNPACK_ROW_LENGTH,fe),s.pixelStorei(s.UNPACK_SKIP_PIXELS,ke),s.pixelStorei(s.UNPACK_SKIP_ROWS,Ne)}}function K(k,E,X){let J=s.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(J=s.TEXTURE_2D_ARRAY),E.isData3DTexture&&(J=s.TEXTURE_3D);const re=Me(k,E),j=E.source;t.bindTexture(J,k.__webglTexture,s.TEXTURE0+X);const Ue=n.get(j);if(j.version!==Ue.__version||re===!0){t.activeTexture(s.TEXTURE0+X);const fe=ct.getPrimaries(ct.workingColorSpace),ke=E.colorSpace===jn?null:ct.getPrimaries(E.colorSpace),Ne=E.colorSpace===jn||fe===ke?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,E.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,E.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ne);let ne=g(E.image,!1,i.maxTextureSize);ne=St(E,ne);const me=o.convert(E.format,E.colorSpace),Be=o.convert(E.type);let Re=w(E.internalFormat,me,Be,E.colorSpace,E.isVideoTexture);Oe(J,E);let ge;const We=E.mipmaps,U=E.isVideoTexture!==!0,ie=Ue.__version===void 0||re===!0,ae=j.dataReady,Te=R(E,ne);if(E.isDepthTexture)Re=b(E.format===no,E.type),ie&&(U?t.texStorage2D(s.TEXTURE_2D,1,Re,ne.width,ne.height):t.texImage2D(s.TEXTURE_2D,0,Re,ne.width,ne.height,0,me,Be,null));else if(E.isDataTexture)if(We.length>0){U&&ie&&t.texStorage2D(s.TEXTURE_2D,Te,Re,We[0].width,We[0].height);for(let le=0,ee=We.length;le<ee;le++)ge=We[le],U?ae&&t.texSubImage2D(s.TEXTURE_2D,le,0,0,ge.width,ge.height,me,Be,ge.data):t.texImage2D(s.TEXTURE_2D,le,Re,ge.width,ge.height,0,me,Be,ge.data);E.generateMipmaps=!1}else U?(ie&&t.texStorage2D(s.TEXTURE_2D,Te,Re,ne.width,ne.height),ae&&Pe(E,ne,me,Be)):t.texImage2D(s.TEXTURE_2D,0,Re,ne.width,ne.height,0,me,Be,ne.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){U&&ie&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Te,Re,We[0].width,We[0].height,ne.depth);for(let le=0,ee=We.length;le<ee;le++)if(ge=We[le],E.format!==En)if(me!==null)if(U){if(ae)if(E.layerUpdates.size>0){const Le=yc(ge.width,ge.height,E.format,E.type);for(const He of E.layerUpdates){const ce=ge.data.subarray(He*Le/ge.data.BYTES_PER_ELEMENT,(He+1)*Le/ge.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,le,0,0,He,ge.width,ge.height,1,me,ce)}E.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,le,0,0,0,ge.width,ge.height,ne.depth,me,ge.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,le,Re,ge.width,ge.height,ne.depth,0,ge.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else U?ae&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,le,0,0,0,ge.width,ge.height,ne.depth,me,Be,ge.data):t.texImage3D(s.TEXTURE_2D_ARRAY,le,Re,ge.width,ge.height,ne.depth,0,me,Be,ge.data)}else{U&&ie&&t.texStorage2D(s.TEXTURE_2D,Te,Re,We[0].width,We[0].height);for(let le=0,ee=We.length;le<ee;le++)ge=We[le],E.format!==En?me!==null?U?ae&&t.compressedTexSubImage2D(s.TEXTURE_2D,le,0,0,ge.width,ge.height,me,ge.data):t.compressedTexImage2D(s.TEXTURE_2D,le,Re,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):U?ae&&t.texSubImage2D(s.TEXTURE_2D,le,0,0,ge.width,ge.height,me,Be,ge.data):t.texImage2D(s.TEXTURE_2D,le,Re,ge.width,ge.height,0,me,Be,ge.data)}else if(E.isDataArrayTexture)if(U){if(ie&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Te,Re,ne.width,ne.height,ne.depth),ae)if(E.layerUpdates.size>0){const le=yc(ne.width,ne.height,E.format,E.type);for(const ee of E.layerUpdates){const Le=ne.data.subarray(ee*le/ne.data.BYTES_PER_ELEMENT,(ee+1)*le/ne.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,ee,ne.width,ne.height,1,me,Be,Le)}E.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,me,Be,ne.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,Re,ne.width,ne.height,ne.depth,0,me,Be,ne.data);else if(E.isData3DTexture)U?(ie&&t.texStorage3D(s.TEXTURE_3D,Te,Re,ne.width,ne.height,ne.depth),ae&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,me,Be,ne.data)):t.texImage3D(s.TEXTURE_3D,0,Re,ne.width,ne.height,ne.depth,0,me,Be,ne.data);else if(E.isFramebufferTexture){if(ie)if(U)t.texStorage2D(s.TEXTURE_2D,Te,Re,ne.width,ne.height);else{let le=ne.width,ee=ne.height;for(let Le=0;Le<Te;Le++)t.texImage2D(s.TEXTURE_2D,Le,Re,le,ee,0,me,Be,null),le>>=1,ee>>=1}}else if(We.length>0){if(U&&ie){const le=rt(We[0]);t.texStorage2D(s.TEXTURE_2D,Te,Re,le.width,le.height)}for(let le=0,ee=We.length;le<ee;le++)ge=We[le],U?ae&&t.texSubImage2D(s.TEXTURE_2D,le,0,0,me,Be,ge):t.texImage2D(s.TEXTURE_2D,le,Re,me,Be,ge);E.generateMipmaps=!1}else if(U){if(ie){const le=rt(ne);t.texStorage2D(s.TEXTURE_2D,Te,Re,le.width,le.height)}ae&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,me,Be,ne)}else t.texImage2D(s.TEXTURE_2D,0,Re,me,Be,ne);p(E)&&m(J),Ue.__version=j.version,E.onUpdate&&E.onUpdate(E)}k.__version=E.version}function $(k,E,X){if(E.image.length!==6)return;const J=Me(k,E),re=E.source;t.bindTexture(s.TEXTURE_CUBE_MAP,k.__webglTexture,s.TEXTURE0+X);const j=n.get(re);if(re.version!==j.__version||J===!0){t.activeTexture(s.TEXTURE0+X);const Ue=ct.getPrimaries(ct.workingColorSpace),fe=E.colorSpace===jn?null:ct.getPrimaries(E.colorSpace),ke=E.colorSpace===jn||Ue===fe?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,E.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,E.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ke);const Ne=E.isCompressedTexture||E.image[0].isCompressedTexture,ne=E.image[0]&&E.image[0].isDataTexture,me=[];for(let ee=0;ee<6;ee++)!Ne&&!ne?me[ee]=g(E.image[ee],!0,i.maxCubemapSize):me[ee]=ne?E.image[ee].image:E.image[ee],me[ee]=St(E,me[ee]);const Be=me[0],Re=o.convert(E.format,E.colorSpace),ge=o.convert(E.type),We=w(E.internalFormat,Re,ge,E.colorSpace),U=E.isVideoTexture!==!0,ie=j.__version===void 0||J===!0,ae=re.dataReady;let Te=R(E,Be);Oe(s.TEXTURE_CUBE_MAP,E);let le;if(Ne){U&&ie&&t.texStorage2D(s.TEXTURE_CUBE_MAP,Te,We,Be.width,Be.height);for(let ee=0;ee<6;ee++){le=me[ee].mipmaps;for(let Le=0;Le<le.length;Le++){const He=le[Le];E.format!==En?Re!==null?U?ae&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Le,0,0,He.width,He.height,Re,He.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Le,We,He.width,He.height,0,He.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?ae&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Le,0,0,He.width,He.height,Re,ge,He.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Le,We,He.width,He.height,0,Re,ge,He.data)}}}else{if(le=E.mipmaps,U&&ie){le.length>0&&Te++;const ee=rt(me[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,Te,We,ee.width,ee.height)}for(let ee=0;ee<6;ee++)if(ne){U?ae&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,me[ee].width,me[ee].height,Re,ge,me[ee].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,We,me[ee].width,me[ee].height,0,Re,ge,me[ee].data);for(let Le=0;Le<le.length;Le++){const ce=le[Le].image[ee].image;U?ae&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Le+1,0,0,ce.width,ce.height,Re,ge,ce.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Le+1,We,ce.width,ce.height,0,Re,ge,ce.data)}}else{U?ae&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,Re,ge,me[ee]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,We,Re,ge,me[ee]);for(let Le=0;Le<le.length;Le++){const He=le[Le];U?ae&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Le+1,0,0,Re,ge,He.image[ee]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Le+1,We,Re,ge,He.image[ee])}}}p(E)&&m(s.TEXTURE_CUBE_MAP),j.__version=re.version,E.onUpdate&&E.onUpdate(E)}k.__version=E.version}function oe(k,E,X,J,re,j){const Ue=o.convert(X.format,X.colorSpace),fe=o.convert(X.type),ke=w(X.internalFormat,Ue,fe,X.colorSpace),Ne=n.get(E),ne=n.get(X);if(ne.__renderTarget=E,!Ne.__hasExternalTextures){const me=Math.max(1,E.width>>j),Be=Math.max(1,E.height>>j);re===s.TEXTURE_3D||re===s.TEXTURE_2D_ARRAY?t.texImage3D(re,j,ke,me,Be,E.depth,0,Ue,fe,null):t.texImage2D(re,j,ke,me,Be,0,Ue,fe,null)}t.bindFramebuffer(s.FRAMEBUFFER,k),ve(E)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,J,re,ne.__webglTexture,0,ot(E)):(re===s.TEXTURE_2D||re>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&re<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,J,re,ne.__webglTexture,j),t.bindFramebuffer(s.FRAMEBUFFER,null)}function pe(k,E,X){if(s.bindRenderbuffer(s.RENDERBUFFER,k),E.depthBuffer){const J=E.depthTexture,re=J&&J.isDepthTexture?J.type:null,j=b(E.stencilBuffer,re),Ue=E.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,fe=ot(E);ve(E)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,fe,j,E.width,E.height):X?s.renderbufferStorageMultisample(s.RENDERBUFFER,fe,j,E.width,E.height):s.renderbufferStorage(s.RENDERBUFFER,j,E.width,E.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Ue,s.RENDERBUFFER,k)}else{const J=E.textures;for(let re=0;re<J.length;re++){const j=J[re],Ue=o.convert(j.format,j.colorSpace),fe=o.convert(j.type),ke=w(j.internalFormat,Ue,fe,j.colorSpace),Ne=ot(E);X&&ve(E)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Ne,ke,E.width,E.height):ve(E)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Ne,ke,E.width,E.height):s.renderbufferStorage(s.RENDERBUFFER,ke,E.width,E.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function he(k,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,k),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const J=n.get(E.depthTexture);J.__renderTarget=E,(!J.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),W(E.depthTexture,0);const re=J.__webglTexture,j=ot(E);if(E.depthTexture.format===to)ve(E)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,re,0,j):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,re,0);else if(E.depthTexture.format===no)ve(E)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,re,0,j):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,re,0);else throw new Error("Unknown depthTexture format")}function Ie(k){const E=n.get(k),X=k.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==k.depthTexture){const J=k.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),J){const re=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,J.removeEventListener("dispose",re)};J.addEventListener("dispose",re),E.__depthDisposeCallback=re}E.__boundDepthTexture=J}if(k.depthTexture&&!E.__autoAllocateDepthBuffer){if(X)throw new Error("target.depthTexture not supported in Cube render targets");const J=k.texture.mipmaps;J&&J.length>0?he(E.__webglFramebuffer[0],k):he(E.__webglFramebuffer,k)}else if(X){E.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(t.bindFramebuffer(s.FRAMEBUFFER,E.__webglFramebuffer[J]),E.__webglDepthbuffer[J]===void 0)E.__webglDepthbuffer[J]=s.createRenderbuffer(),pe(E.__webglDepthbuffer[J],k,!1);else{const re=k.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,j=E.__webglDepthbuffer[J];s.bindRenderbuffer(s.RENDERBUFFER,j),s.framebufferRenderbuffer(s.FRAMEBUFFER,re,s.RENDERBUFFER,j)}}else{const J=k.texture.mipmaps;if(J&&J.length>0?t.bindFramebuffer(s.FRAMEBUFFER,E.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=s.createRenderbuffer(),pe(E.__webglDepthbuffer,k,!1);else{const re=k.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,j=E.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,j),s.framebufferRenderbuffer(s.FRAMEBUFFER,re,s.RENDERBUFFER,j)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function _t(k,E,X){const J=n.get(k);E!==void 0&&oe(J.__webglFramebuffer,k,k.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),X!==void 0&&Ie(k)}function P(k){const E=k.texture,X=n.get(k),J=n.get(E);k.addEventListener("dispose",S);const re=k.textures,j=k.isWebGLCubeRenderTarget===!0,Ue=re.length>1;if(Ue||(J.__webglTexture===void 0&&(J.__webglTexture=s.createTexture()),J.__version=E.version,r.memory.textures++),j){X.__webglFramebuffer=[];for(let fe=0;fe<6;fe++)if(E.mipmaps&&E.mipmaps.length>0){X.__webglFramebuffer[fe]=[];for(let ke=0;ke<E.mipmaps.length;ke++)X.__webglFramebuffer[fe][ke]=s.createFramebuffer()}else X.__webglFramebuffer[fe]=s.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){X.__webglFramebuffer=[];for(let fe=0;fe<E.mipmaps.length;fe++)X.__webglFramebuffer[fe]=s.createFramebuffer()}else X.__webglFramebuffer=s.createFramebuffer();if(Ue)for(let fe=0,ke=re.length;fe<ke;fe++){const Ne=n.get(re[fe]);Ne.__webglTexture===void 0&&(Ne.__webglTexture=s.createTexture(),r.memory.textures++)}if(k.samples>0&&ve(k)===!1){X.__webglMultisampledFramebuffer=s.createFramebuffer(),X.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,X.__webglMultisampledFramebuffer);for(let fe=0;fe<re.length;fe++){const ke=re[fe];X.__webglColorRenderbuffer[fe]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,X.__webglColorRenderbuffer[fe]);const Ne=o.convert(ke.format,ke.colorSpace),ne=o.convert(ke.type),me=w(ke.internalFormat,Ne,ne,ke.colorSpace,k.isXRRenderTarget===!0),Be=ot(k);s.renderbufferStorageMultisample(s.RENDERBUFFER,Be,me,k.width,k.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+fe,s.RENDERBUFFER,X.__webglColorRenderbuffer[fe])}s.bindRenderbuffer(s.RENDERBUFFER,null),k.depthBuffer&&(X.__webglDepthRenderbuffer=s.createRenderbuffer(),pe(X.__webglDepthRenderbuffer,k,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(j){t.bindTexture(s.TEXTURE_CUBE_MAP,J.__webglTexture),Oe(s.TEXTURE_CUBE_MAP,E);for(let fe=0;fe<6;fe++)if(E.mipmaps&&E.mipmaps.length>0)for(let ke=0;ke<E.mipmaps.length;ke++)oe(X.__webglFramebuffer[fe][ke],k,E,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+fe,ke);else oe(X.__webglFramebuffer[fe],k,E,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0);p(E)&&m(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ue){for(let fe=0,ke=re.length;fe<ke;fe++){const Ne=re[fe],ne=n.get(Ne);let me=s.TEXTURE_2D;(k.isWebGL3DRenderTarget||k.isWebGLArrayRenderTarget)&&(me=k.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(me,ne.__webglTexture),Oe(me,Ne),oe(X.__webglFramebuffer,k,Ne,s.COLOR_ATTACHMENT0+fe,me,0),p(Ne)&&m(me)}t.unbindTexture()}else{let fe=s.TEXTURE_2D;if((k.isWebGL3DRenderTarget||k.isWebGLArrayRenderTarget)&&(fe=k.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(fe,J.__webglTexture),Oe(fe,E),E.mipmaps&&E.mipmaps.length>0)for(let ke=0;ke<E.mipmaps.length;ke++)oe(X.__webglFramebuffer[ke],k,E,s.COLOR_ATTACHMENT0,fe,ke);else oe(X.__webglFramebuffer,k,E,s.COLOR_ATTACHMENT0,fe,0);p(E)&&m(fe),t.unbindTexture()}k.depthBuffer&&Ie(k)}function ut(k){const E=k.textures;for(let X=0,J=E.length;X<J;X++){const re=E[X];if(p(re)){const j=M(k),Ue=n.get(re).__webglTexture;t.bindTexture(j,Ue),m(j),t.unbindTexture()}}}const I=[],we=[];function Se(k){if(k.samples>0){if(ve(k)===!1){const E=k.textures,X=k.width,J=k.height;let re=s.COLOR_BUFFER_BIT;const j=k.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Ue=n.get(k),fe=E.length>1;if(fe)for(let Ne=0;Ne<E.length;Ne++)t.bindFramebuffer(s.FRAMEBUFFER,Ue.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ne,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,Ue.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ne,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,Ue.__webglMultisampledFramebuffer);const ke=k.texture.mipmaps;ke&&ke.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ue.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ue.__webglFramebuffer);for(let Ne=0;Ne<E.length;Ne++){if(k.resolveDepthBuffer&&(k.depthBuffer&&(re|=s.DEPTH_BUFFER_BIT),k.stencilBuffer&&k.resolveStencilBuffer&&(re|=s.STENCIL_BUFFER_BIT)),fe){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Ue.__webglColorRenderbuffer[Ne]);const ne=n.get(E[Ne]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,ne,0)}s.blitFramebuffer(0,0,X,J,0,0,X,J,re,s.NEAREST),l===!0&&(I.length=0,we.length=0,I.push(s.COLOR_ATTACHMENT0+Ne),k.depthBuffer&&k.resolveDepthBuffer===!1&&(I.push(j),we.push(j),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,we)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,I))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),fe)for(let Ne=0;Ne<E.length;Ne++){t.bindFramebuffer(s.FRAMEBUFFER,Ue.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ne,s.RENDERBUFFER,Ue.__webglColorRenderbuffer[Ne]);const ne=n.get(E[Ne]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,Ue.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ne,s.TEXTURE_2D,ne,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ue.__webglMultisampledFramebuffer)}else if(k.depthBuffer&&k.resolveDepthBuffer===!1&&l){const E=k.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[E])}}}function ot(k){return Math.min(i.maxSamples,k.samples)}function ve(k){const E=n.get(k);return k.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function Xe(k){const E=r.render.frame;u.get(k)!==E&&(u.set(k,E),k.update())}function St(k,E){const X=k.colorSpace,J=k.format,re=k.type;return k.isCompressedTexture===!0||k.isVideoTexture===!0||X!==Ms&&X!==jn&&(ct.getTransfer(X)===gt?(J!==En||re!==Vn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",X)),E}function rt(k){return typeof HTMLImageElement<"u"&&k instanceof HTMLImageElement?(d.width=k.naturalWidth||k.width,d.height=k.naturalHeight||k.height):typeof VideoFrame<"u"&&k instanceof VideoFrame?(d.width=k.displayWidth,d.height=k.displayHeight):(d.width=k.width,d.height=k.height),d}this.allocateTextureUnit=O,this.resetTextureUnits=L,this.setTexture2D=W,this.setTexture2DArray=F,this.setTexture3D=Y,this.setTextureCube=B,this.rebindTextures=_t,this.setupRenderTarget=P,this.updateRenderTargetMipmap=ut,this.updateMultisampleRenderTarget=Se,this.setupDepthRenderbuffer=Ie,this.setupFrameBufferTexture=oe,this.useMultisampledRTT=ve}function EA(s,e){function t(n,i=jn){let o;const r=ct.getTransfer(i);if(n===Vn)return s.UNSIGNED_BYTE;if(n===_l)return s.UNSIGNED_SHORT_4_4_4_4;if(n===vl)return s.UNSIGNED_SHORT_5_5_5_1;if(n===$d)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===eh)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===Jd)return s.BYTE;if(n===Zd)return s.SHORT;if(n===$s)return s.UNSIGNED_SHORT;if(n===gl)return s.INT;if(n===Bi)return s.UNSIGNED_INT;if(n===Jn)return s.FLOAT;if(n===ro)return s.HALF_FLOAT;if(n===th)return s.ALPHA;if(n===nh)return s.RGB;if(n===En)return s.RGBA;if(n===to)return s.DEPTH_COMPONENT;if(n===no)return s.DEPTH_STENCIL;if(n===ih)return s.RED;if(n===xl)return s.RED_INTEGER;if(n===sh)return s.RG;if(n===Al)return s.RG_INTEGER;if(n===bl)return s.RGBA_INTEGER;if(n===tr||n===nr||n===ir||n===sr)if(r===gt)if(o=e.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(n===tr)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===nr)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ir)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===sr)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=e.get("WEBGL_compressed_texture_s3tc"),o!==null){if(n===tr)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===nr)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ir)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===sr)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Na||n===Ba||n===Fa||n===Oa)if(o=e.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(n===Na)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ba)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Fa)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Oa)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===za||n===Va||n===Ga)if(o=e.get("WEBGL_compressed_texture_etc"),o!==null){if(n===za||n===Va)return r===gt?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(n===Ga)return r===gt?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Ha||n===Wa||n===Xa||n===Ya||n===qa||n===Ka||n===Qa||n===ja||n===Ja||n===Za||n===$a||n===el||n===tl||n===nl)if(o=e.get("WEBGL_compressed_texture_astc"),o!==null){if(n===Ha)return r===gt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Wa)return r===gt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Xa)return r===gt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ya)return r===gt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===qa)return r===gt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ka)return r===gt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Qa)return r===gt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ja)return r===gt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ja)return r===gt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Za)return r===gt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===$a)return r===gt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===el)return r===gt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===tl)return r===gt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===nl)return r===gt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===il||n===sl||n===ol)if(o=e.get("EXT_texture_compression_bptc"),o!==null){if(n===il)return r===gt?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===sl)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ol)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===rl||n===al||n===ll||n===cl)if(o=e.get("EXT_texture_compression_rgtc"),o!==null){if(n===rl)return o.COMPRESSED_RED_RGTC1_EXT;if(n===al)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ll)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===cl)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===eo?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}const SA=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,wA=`
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

}`;class TA{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new vh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Gn({vertexShader:SA,fragmentShader:wA,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new dt(new ws(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class CA extends Ss{constructor(e,t){super();const n=this;let i=null,o=1,r=null,a="local-floor",l=1,d=null,u=null,c=null,h=null,f=null,_=null;const g=typeof XRWebGLBinding<"u",p=new TA,m={},M=t.getContextAttributes();let w=null,b=null;const R=[],v=[],S=new Je;let C=null;const A=new yn;A.viewport=new Ct;const y=new yn;y.viewport=new Ct;const D=[A,y],L=new Qg;let O=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let $=R[K];return $===void 0&&($=new ta,R[K]=$),$.getTargetRaySpace()},this.getControllerGrip=function(K){let $=R[K];return $===void 0&&($=new ta,R[K]=$),$.getGripSpace()},this.getHand=function(K){let $=R[K];return $===void 0&&($=new ta,R[K]=$),$.getHandSpace()};function W(K){const $=v.indexOf(K.inputSource);if($===-1)return;const oe=R[$];oe!==void 0&&(oe.update(K.inputSource,K.frame,d||r),oe.dispatchEvent({type:K.type,data:K.inputSource}))}function F(){i.removeEventListener("select",W),i.removeEventListener("selectstart",W),i.removeEventListener("selectend",W),i.removeEventListener("squeeze",W),i.removeEventListener("squeezestart",W),i.removeEventListener("squeezeend",W),i.removeEventListener("end",F),i.removeEventListener("inputsourceschange",Y);for(let K=0;K<R.length;K++){const $=v[K];$!==null&&(v[K]=null,R[K].disconnect($))}O=null,G=null,p.reset();for(const K in m)delete m[K];e.setRenderTarget(w),f=null,h=null,c=null,i=null,b=null,Pe.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){o=K,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){a=K,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return d||r},this.setReferenceSpace=function(K){d=K},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return c===null&&g&&(c=new XRWebGLBinding(i,t)),c},this.getFrame=function(){return _},this.getSession=function(){return i},this.setSession=async function(K){if(i=K,i!==null){if(w=e.getRenderTarget(),i.addEventListener("select",W),i.addEventListener("selectstart",W),i.addEventListener("selectend",W),i.addEventListener("squeeze",W),i.addEventListener("squeezestart",W),i.addEventListener("squeezeend",W),i.addEventListener("end",F),i.addEventListener("inputsourceschange",Y),M.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),g&&"createProjectionLayer"in XRWebGLBinding.prototype){let oe=null,pe=null,he=null;M.depth&&(he=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,oe=M.stencil?no:to,pe=M.stencil?eo:Bi);const Ie={colorFormat:t.RGBA8,depthFormat:he,scaleFactor:o};c=this.getBinding(),h=c.createProjectionLayer(Ie),i.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),b=new Fi(h.textureWidth,h.textureHeight,{format:En,type:Vn,depthTexture:new _h(h.textureWidth,h.textureHeight,pe,void 0,void 0,void 0,void 0,void 0,void 0,oe),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{const oe={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:o};f=new XRWebGLLayer(i,t,oe),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),b=new Fi(f.framebufferWidth,f.framebufferHeight,{format:En,type:Vn,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),d=null,r=await i.requestReferenceSpace(a),Pe.setContext(i),Pe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function Y(K){for(let $=0;$<K.removed.length;$++){const oe=K.removed[$],pe=v.indexOf(oe);pe>=0&&(v[pe]=null,R[pe].disconnect(oe))}for(let $=0;$<K.added.length;$++){const oe=K.added[$];let pe=v.indexOf(oe);if(pe===-1){for(let Ie=0;Ie<R.length;Ie++)if(Ie>=v.length){v.push(oe),pe=Ie;break}else if(v[Ie]===null){v[Ie]=oe,pe=Ie;break}if(pe===-1)break}const he=R[pe];he&&he.connect(oe)}}const B=new H,se=new H;function de(K,$,oe){B.setFromMatrixPosition($.matrixWorld),se.setFromMatrixPosition(oe.matrixWorld);const pe=B.distanceTo(se),he=$.projectionMatrix.elements,Ie=oe.projectionMatrix.elements,_t=he[14]/(he[10]-1),P=he[14]/(he[10]+1),ut=(he[9]+1)/he[5],I=(he[9]-1)/he[5],we=(he[8]-1)/he[0],Se=(Ie[8]+1)/Ie[0],ot=_t*we,ve=_t*Se,Xe=pe/(-we+Se),St=Xe*-we;if($.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(St),K.translateZ(Xe),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),he[10]===-1)K.projectionMatrix.copy($.projectionMatrix),K.projectionMatrixInverse.copy($.projectionMatrixInverse);else{const rt=_t+Xe,k=P+Xe,E=ot-St,X=ve+(pe-St),J=ut*P/k*rt,re=I*P/k*rt;K.projectionMatrix.makePerspective(E,X,J,re,rt,k),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function xe(K,$){$===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices($.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(i===null)return;let $=K.near,oe=K.far;p.texture!==null&&(p.depthNear>0&&($=p.depthNear),p.depthFar>0&&(oe=p.depthFar)),L.near=y.near=A.near=$,L.far=y.far=A.far=oe,(O!==L.near||G!==L.far)&&(i.updateRenderState({depthNear:L.near,depthFar:L.far}),O=L.near,G=L.far),L.layers.mask=K.layers.mask|6,A.layers.mask=L.layers.mask&3,y.layers.mask=L.layers.mask&5;const pe=K.parent,he=L.cameras;xe(L,pe);for(let Ie=0;Ie<he.length;Ie++)xe(he[Ie],pe);he.length===2?de(L,A,y):L.projectionMatrix.copy(A.projectionMatrix),Oe(K,L,pe)};function Oe(K,$,oe){oe===null?K.matrix.copy($.matrixWorld):(K.matrix.copy(oe.matrixWorld),K.matrix.invert(),K.matrix.multiply($.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy($.projectionMatrix),K.projectionMatrixInverse.copy($.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=io*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(h===null&&f===null))return l},this.setFoveation=function(K){l=K,h!==null&&(h.fixedFoveation=K),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=K)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(L)},this.getCameraTexture=function(K){return m[K]};let Me=null;function Z(K,$){if(u=$.getViewerPose(d||r),_=$,u!==null){const oe=u.views;f!==null&&(e.setRenderTargetFramebuffer(b,f.framebuffer),e.setRenderTarget(b));let pe=!1;oe.length!==L.cameras.length&&(L.cameras.length=0,pe=!0);for(let P=0;P<oe.length;P++){const ut=oe[P];let I=null;if(f!==null)I=f.getViewport(ut);else{const Se=c.getViewSubImage(h,ut);I=Se.viewport,P===0&&(e.setRenderTargetTextures(b,Se.colorTexture,Se.depthStencilTexture),e.setRenderTarget(b))}let we=D[P];we===void 0&&(we=new yn,we.layers.enable(P),we.viewport=new Ct,D[P]=we),we.matrix.fromArray(ut.transform.matrix),we.matrix.decompose(we.position,we.quaternion,we.scale),we.projectionMatrix.fromArray(ut.projectionMatrix),we.projectionMatrixInverse.copy(we.projectionMatrix).invert(),we.viewport.set(I.x,I.y,I.width,I.height),P===0&&(L.matrix.copy(we.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),pe===!0&&L.cameras.push(we)}const he=i.enabledFeatures;if(he&&he.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&g){c=n.getBinding();const P=c.getDepthInformation(oe[0]);P&&P.isValid&&P.texture&&p.init(P,i.renderState)}if(he&&he.includes("camera-access")&&g){e.state.unbindTexture(),c=n.getBinding();for(let P=0;P<oe.length;P++){const ut=oe[P].camera;if(ut){let I=m[ut];I||(I=new vh,m[ut]=I);const we=c.getCameraImage(ut);I.sourceTexture=we}}}}for(let oe=0;oe<R.length;oe++){const pe=v[oe],he=R[oe];pe!==null&&he!==void 0&&he.update(pe,$,d||r)}Me&&Me(K,$),$.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:$}),_=null}const Pe=new xh;Pe.setAnimationLoop(Z),this.setAnimationLoop=function(K){Me=K},this.dispose=function(){}}}const wi=new ti,RA=new Dt;function kA(s,e){function t(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,hh(s)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function i(p,m,M,w,b){m.isMeshBasicMaterial||m.isMeshLambertMaterial?o(p,m):m.isMeshToonMaterial?(o(p,m),c(p,m)):m.isMeshPhongMaterial?(o(p,m),u(p,m)):m.isMeshStandardMaterial?(o(p,m),h(p,m),m.isMeshPhysicalMaterial&&f(p,m,b)):m.isMeshMatcapMaterial?(o(p,m),_(p,m)):m.isMeshDepthMaterial?o(p,m):m.isMeshDistanceMaterial?(o(p,m),g(p,m)):m.isMeshNormalMaterial?o(p,m):m.isLineBasicMaterial?(r(p,m),m.isLineDashedMaterial&&a(p,m)):m.isPointsMaterial?l(p,m,M,w):m.isSpriteMaterial?d(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function o(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,t(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===$t&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,t(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===$t&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,t(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,t(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const M=e.get(m),w=M.envMap,b=M.envMapRotation;w&&(p.envMap.value=w,wi.copy(b),wi.x*=-1,wi.y*=-1,wi.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(wi.y*=-1,wi.z*=-1),p.envMapRotation.value.setFromMatrix4(RA.makeRotationFromEuler(wi)),p.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,p.aoMapTransform))}function r(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform))}function a(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,M,w){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*M,p.scale.value=w*.5,m.map&&(p.map.value=m.map,t(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function d(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function u(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function c(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function h(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,M){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===$t&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=M.texture,p.transmissionSamplerSize.value.set(M.width,M.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,p.specularIntensityMapTransform))}function _(p,m){m.matcap&&(p.matcap.value=m.matcap)}function g(p,m){const M=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(M.matrixWorld),p.nearDistance.value=M.shadow.camera.near,p.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function DA(s,e,t,n){let i={},o={},r=[];const a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,w){const b=w.program;n.uniformBlockBinding(M,b)}function d(M,w){let b=i[M.id];b===void 0&&(_(M),b=u(M),i[M.id]=b,M.addEventListener("dispose",p));const R=w.program;n.updateUBOMapping(M,R);const v=e.render.frame;o[M.id]!==v&&(h(M),o[M.id]=v)}function u(M){const w=c();M.__bindingPointIndex=w;const b=s.createBuffer(),R=M.__size,v=M.usage;return s.bindBuffer(s.UNIFORM_BUFFER,b),s.bufferData(s.UNIFORM_BUFFER,R,v),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,w,b),b}function c(){for(let M=0;M<a;M++)if(r.indexOf(M)===-1)return r.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(M){const w=i[M.id],b=M.uniforms,R=M.__cache;s.bindBuffer(s.UNIFORM_BUFFER,w);for(let v=0,S=b.length;v<S;v++){const C=Array.isArray(b[v])?b[v]:[b[v]];for(let A=0,y=C.length;A<y;A++){const D=C[A];if(f(D,v,A,R)===!0){const L=D.__offset,O=Array.isArray(D.value)?D.value:[D.value];let G=0;for(let W=0;W<O.length;W++){const F=O[W],Y=g(F);typeof F=="number"||typeof F=="boolean"?(D.__data[0]=F,s.bufferSubData(s.UNIFORM_BUFFER,L+G,D.__data)):F.isMatrix3?(D.__data[0]=F.elements[0],D.__data[1]=F.elements[1],D.__data[2]=F.elements[2],D.__data[3]=0,D.__data[4]=F.elements[3],D.__data[5]=F.elements[4],D.__data[6]=F.elements[5],D.__data[7]=0,D.__data[8]=F.elements[6],D.__data[9]=F.elements[7],D.__data[10]=F.elements[8],D.__data[11]=0):(F.toArray(D.__data,G),G+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,L,D.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(M,w,b,R){const v=M.value,S=w+"_"+b;if(R[S]===void 0)return typeof v=="number"||typeof v=="boolean"?R[S]=v:R[S]=v.clone(),!0;{const C=R[S];if(typeof v=="number"||typeof v=="boolean"){if(C!==v)return R[S]=v,!0}else if(C.equals(v)===!1)return C.copy(v),!0}return!1}function _(M){const w=M.uniforms;let b=0;const R=16;for(let S=0,C=w.length;S<C;S++){const A=Array.isArray(w[S])?w[S]:[w[S]];for(let y=0,D=A.length;y<D;y++){const L=A[y],O=Array.isArray(L.value)?L.value:[L.value];for(let G=0,W=O.length;G<W;G++){const F=O[G],Y=g(F),B=b%R,se=B%Y.boundary,de=B+se;b+=se,de!==0&&R-de<Y.storage&&(b+=R-de),L.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=b,b+=Y.storage}}}const v=b%R;return v>0&&(b+=R-v),M.__size=b,M.__cache={},this}function g(M){const w={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(w.boundary=4,w.storage=4):M.isVector2?(w.boundary=8,w.storage=8):M.isVector3||M.isColor?(w.boundary=16,w.storage=12):M.isVector4?(w.boundary=16,w.storage=16):M.isMatrix3?(w.boundary=48,w.storage=48):M.isMatrix4?(w.boundary=64,w.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),w}function p(M){const w=M.target;w.removeEventListener("dispose",p);const b=r.indexOf(w.__bindingPointIndex);r.splice(b,1),s.deleteBuffer(i[w.id]),delete i[w.id],delete o[w.id]}function m(){for(const M in i)s.deleteBuffer(i[M]);r=[],i={},o={}}return{bind:l,update:d,dispose:m}}class LA{constructor(e={}){const{canvas:t=mg(),context:n=null,depth:i=!0,stencil:o=!1,alpha:r=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:d=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:c=!1,reversedDepthBuffer:h=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=r;const _=new Uint32Array(4),g=new Int32Array(4);let p=null,m=null;const M=[],w=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=mi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const b=this;let R=!1;this._outputColorSpace=mn;let v=0,S=0,C=null,A=-1,y=null;const D=new Ct,L=new Ct;let O=null;const G=new je(0);let W=0,F=t.width,Y=t.height,B=1,se=null,de=null;const xe=new Ct(0,0,F,Y),Oe=new Ct(0,0,F,Y);let Me=!1;const Z=new gh;let Pe=!1,K=!1;const $=new Dt,oe=new H,pe=new Ct,he={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ie=!1;function _t(){return C===null?B:1}let P=n;function ut(T,z){return t.getContext(T,z)}try{const T={alpha:!0,depth:i,stencil:o,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:d,powerPreference:u,failIfMajorPerformanceCaveat:c};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ml}`),t.addEventListener("webglcontextlost",ae,!1),t.addEventListener("webglcontextrestored",Te,!1),t.addEventListener("webglcontextcreationerror",le,!1),P===null){const z="webgl2";if(P=ut(z,T),P===null)throw ut(z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let I,we,Se,ot,ve,Xe,St,rt,k,E,X,J,re,j,Ue,fe,ke,Ne,ne,me,Be,Re,ge,We;function U(){I=new Gv(P),I.init(),Re=new EA(P,I),we=new Uv(P,I,e,Re),Se=new yA(P,I),we.reversedDepthBuffer&&h&&Se.buffers.depth.setReversed(!0),ot=new Xv(P),ve=new cA,Xe=new MA(P,I,Se,ve,we,Re,ot),St=new Bv(b),rt=new Vv(b),k=new Jg(P),ge=new Pv(P,k),E=new Hv(P,k,ot,ge),X=new qv(P,E,k,ot),ne=new Yv(P,we,Xe),fe=new Nv(ve),J=new lA(b,St,rt,I,we,ge,fe),re=new kA(b,ve),j=new hA,Ue=new _A(I),Ne=new Lv(b,St,rt,Se,X,f,l),ke=new AA(b,X,we),We=new DA(P,ot,we,Se),me=new Iv(P,I,ot),Be=new Wv(P,I,ot),ot.programs=J.programs,b.capabilities=we,b.extensions=I,b.properties=ve,b.renderLists=j,b.shadowMap=ke,b.state=Se,b.info=ot}U();const ie=new CA(b,P);this.xr=ie,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const T=I.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=I.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return B},this.setPixelRatio=function(T){T!==void 0&&(B=T,this.setSize(F,Y,!1))},this.getSize=function(T){return T.set(F,Y)},this.setSize=function(T,z,q=!0){if(ie.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=T,Y=z,t.width=Math.floor(T*B),t.height=Math.floor(z*B),q===!0&&(t.style.width=T+"px",t.style.height=z+"px"),this.setViewport(0,0,T,z)},this.getDrawingBufferSize=function(T){return T.set(F*B,Y*B).floor()},this.setDrawingBufferSize=function(T,z,q){F=T,Y=z,B=q,t.width=Math.floor(T*q),t.height=Math.floor(z*q),this.setViewport(0,0,T,z)},this.getCurrentViewport=function(T){return T.copy(D)},this.getViewport=function(T){return T.copy(xe)},this.setViewport=function(T,z,q,Q){T.isVector4?xe.set(T.x,T.y,T.z,T.w):xe.set(T,z,q,Q),Se.viewport(D.copy(xe).multiplyScalar(B).round())},this.getScissor=function(T){return T.copy(Oe)},this.setScissor=function(T,z,q,Q){T.isVector4?Oe.set(T.x,T.y,T.z,T.w):Oe.set(T,z,q,Q),Se.scissor(L.copy(Oe).multiplyScalar(B).round())},this.getScissorTest=function(){return Me},this.setScissorTest=function(T){Se.setScissorTest(Me=T)},this.setOpaqueSort=function(T){se=T},this.setTransparentSort=function(T){de=T},this.getClearColor=function(T){return T.copy(Ne.getClearColor())},this.setClearColor=function(){Ne.setClearColor(...arguments)},this.getClearAlpha=function(){return Ne.getClearAlpha()},this.setClearAlpha=function(){Ne.setClearAlpha(...arguments)},this.clear=function(T=!0,z=!0,q=!0){let Q=0;if(T){let V=!1;if(C!==null){const ue=C.texture.format;V=ue===bl||ue===Al||ue===xl}if(V){const ue=C.texture.type,be=ue===Vn||ue===Bi||ue===$s||ue===eo||ue===_l||ue===vl,De=Ne.getClearColor(),Ce=Ne.getClearAlpha(),Ee=De.r,Ve=De.g,Fe=De.b;be?(_[0]=Ee,_[1]=Ve,_[2]=Fe,_[3]=Ce,P.clearBufferuiv(P.COLOR,0,_)):(g[0]=Ee,g[1]=Ve,g[2]=Fe,g[3]=Ce,P.clearBufferiv(P.COLOR,0,g))}else Q|=P.COLOR_BUFFER_BIT}z&&(Q|=P.DEPTH_BUFFER_BIT),q&&(Q|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ae,!1),t.removeEventListener("webglcontextrestored",Te,!1),t.removeEventListener("webglcontextcreationerror",le,!1),Ne.dispose(),j.dispose(),Ue.dispose(),ve.dispose(),St.dispose(),rt.dispose(),X.dispose(),ge.dispose(),We.dispose(),J.dispose(),ie.dispose(),ie.removeEventListener("sessionstart",an),ie.removeEventListener("sessionend",gi),Nn.stop()};function ae(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function Te(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;const T=ot.autoReset,z=ke.enabled,q=ke.autoUpdate,Q=ke.needsUpdate,V=ke.type;U(),ot.autoReset=T,ke.enabled=z,ke.autoUpdate=q,ke.needsUpdate=Q,ke.type=V}function le(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function ee(T){const z=T.target;z.removeEventListener("dispose",ee),Le(z)}function Le(T){He(T),ve.remove(T)}function He(T){const z=ve.get(T).programs;z!==void 0&&(z.forEach(function(q){J.releaseProgram(q)}),T.isShaderMaterial&&J.releaseShaderCache(T))}this.renderBufferDirect=function(T,z,q,Q,V,ue){z===null&&(z=he);const be=V.isMesh&&V.matrixWorld.determinant()<0,De=ln(T,z,q,Q,V);Se.setMaterial(Q,be);let Ce=q.index,Ee=1;if(Q.wireframe===!0){if(Ce=E.getWireframeAttribute(q),Ce===void 0)return;Ee=2}const Ve=q.drawRange,Fe=q.attributes.position;let Ge=Ve.start*Ee,Ye=(Ve.start+Ve.count)*Ee;ue!==null&&(Ge=Math.max(Ge,ue.start*Ee),Ye=Math.min(Ye,(ue.start+ue.count)*Ee)),Ce!==null?(Ge=Math.max(Ge,0),Ye=Math.min(Ye,Ce.count)):Fe!=null&&(Ge=Math.max(Ge,0),Ye=Math.min(Ye,Fe.count));const At=Ye-Ge;if(At<0||At===1/0)return;ge.setup(V,Q,De,q,Ce);let vt,ft=me;if(Ce!==null&&(vt=k.get(Ce),ft=Be,ft.setIndex(vt)),V.isMesh)Q.wireframe===!0?(Se.setLineWidth(Q.wireframeLinewidth*_t()),ft.setMode(P.LINES)):ft.setMode(P.TRIANGLES);else if(V.isLine){let ze=Q.linewidth;ze===void 0&&(ze=1),Se.setLineWidth(ze*_t()),V.isLineSegments?ft.setMode(P.LINES):V.isLineLoop?ft.setMode(P.LINE_LOOP):ft.setMode(P.LINE_STRIP)}else V.isPoints?ft.setMode(P.POINTS):V.isSprite&&ft.setMode(P.TRIANGLES);if(V.isBatchedMesh)if(V._multiDrawInstances!==null)so("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ft.renderMultiDrawInstances(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount,V._multiDrawInstances);else if(I.get("WEBGL_multi_draw"))ft.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{const ze=V._multiDrawStarts,mt=V._multiDrawCounts,et=V._multiDrawCount,jt=Ce?k.get(Ce).bytesPerElement:1,ni=ve.get(Q).currentProgram.getUniforms();for(let Nt=0;Nt<et;Nt++)ni.setValue(P,"_gl_DrawID",Nt),ft.render(ze[Nt]/jt,mt[Nt])}else if(V.isInstancedMesh)ft.renderInstances(Ge,At,V.count);else if(q.isInstancedBufferGeometry){const ze=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,mt=Math.min(q.instanceCount,ze);ft.renderInstances(Ge,At,mt)}else ft.render(Ge,At)};function ce(T,z,q){T.transparent===!0&&T.side===sn&&T.forceSinglePass===!1?(T.side=$t,T.needsUpdate=!0,vi(T,z,q),T.side=ei,T.needsUpdate=!0,vi(T,z,q),T.side=sn):vi(T,z,q)}this.compile=function(T,z,q=null){q===null&&(q=T),m=Ue.get(q),m.init(z),w.push(m),q.traverseVisible(function(V){V.isLight&&V.layers.test(z.layers)&&(m.pushLight(V),V.castShadow&&m.pushShadow(V))}),T!==q&&T.traverseVisible(function(V){V.isLight&&V.layers.test(z.layers)&&(m.pushLight(V),V.castShadow&&m.pushShadow(V))}),m.setupLights();const Q=new Set;return T.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;const ue=V.material;if(ue)if(Array.isArray(ue))for(let be=0;be<ue.length;be++){const De=ue[be];ce(De,q,V),Q.add(De)}else ce(ue,q,V),Q.add(ue)}),m=w.pop(),Q},this.compileAsync=function(T,z,q=null){const Q=this.compile(T,z,q);return new Promise(V=>{function ue(){if(Q.forEach(function(be){ve.get(be).currentProgram.isReady()&&Q.delete(be)}),Q.size===0){V(T);return}setTimeout(ue,10)}I.get("KHR_parallel_shader_compile")!==null?ue():setTimeout(ue,10)})};let it=null;function _n(T){it&&it(T)}function an(){Nn.stop()}function gi(){Nn.start()}const Nn=new xh;Nn.setAnimationLoop(_n),typeof self<"u"&&Nn.setContext(self),this.setAnimationLoop=function(T){it=T,ie.setAnimationLoop(T),T===null?Nn.stop():Nn.start()},ie.addEventListener("sessionstart",an),ie.addEventListener("sessionend",gi),this.render=function(T,z){if(z!==void 0&&z.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),ie.enabled===!0&&ie.isPresenting===!0&&(ie.cameraAutoUpdate===!0&&ie.updateCamera(z),z=ie.getCamera()),T.isScene===!0&&T.onBeforeRender(b,T,z,C),m=Ue.get(T,w.length),m.init(z),w.push(m),$.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),Z.setFromProjectionMatrix($,zn,z.reversedDepth),K=this.localClippingEnabled,Pe=fe.init(this.clippingPlanes,K),p=j.get(T,M.length),p.init(),M.push(p),ie.enabled===!0&&ie.isPresenting===!0){const ue=b.xr.getDepthSensingMesh();ue!==null&&_i(ue,z,-1/0,b.sortObjects)}_i(T,z,0,b.sortObjects),p.finish(),b.sortObjects===!0&&p.sort(se,de),Ie=ie.enabled===!1||ie.isPresenting===!1||ie.hasDepthSensing()===!1,Ie&&Ne.addToRenderList(p,T),this.info.render.frame++,Pe===!0&&fe.beginShadows();const q=m.state.shadowsArray;ke.render(q,T,z),Pe===!0&&fe.endShadows(),this.info.autoReset===!0&&this.info.reset();const Q=p.opaque,V=p.transmissive;if(m.setupLights(),z.isArrayCamera){const ue=z.cameras;if(V.length>0)for(let be=0,De=ue.length;be<De;be++){const Ce=ue[be];ho(Q,V,T,Ce)}Ie&&Ne.render(T);for(let be=0,De=ue.length;be<De;be++){const Ce=ue[be];Oi(p,T,Ce,Ce.viewport)}}else V.length>0&&ho(Q,V,T,z),Ie&&Ne.render(T),Oi(p,T,z);C!==null&&S===0&&(Xe.updateMultisampleRenderTarget(C),Xe.updateRenderTargetMipmap(C)),T.isScene===!0&&T.onAfterRender(b,T,z),ge.resetDefaultState(),A=-1,y=null,w.pop(),w.length>0?(m=w[w.length-1],Pe===!0&&fe.setGlobalState(b.clippingPlanes,m.state.camera)):m=null,M.pop(),M.length>0?p=M[M.length-1]:p=null};function _i(T,z,q,Q){if(T.visible===!1)return;if(T.layers.test(z.layers)){if(T.isGroup)q=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(z);else if(T.isLight)m.pushLight(T),T.castShadow&&m.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||Z.intersectsSprite(T)){Q&&pe.setFromMatrixPosition(T.matrixWorld).applyMatrix4($);const be=X.update(T),De=T.material;De.visible&&p.push(T,be,De,q,pe.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||Z.intersectsObject(T))){const be=X.update(T),De=T.material;if(Q&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),pe.copy(T.boundingSphere.center)):(be.boundingSphere===null&&be.computeBoundingSphere(),pe.copy(be.boundingSphere.center)),pe.applyMatrix4(T.matrixWorld).applyMatrix4($)),Array.isArray(De)){const Ce=be.groups;for(let Ee=0,Ve=Ce.length;Ee<Ve;Ee++){const Fe=Ce[Ee],Ge=De[Fe.materialIndex];Ge&&Ge.visible&&p.push(T,be,Ge,q,pe.z,Fe)}}else De.visible&&p.push(T,be,De,q,pe.z,null)}}const ue=T.children;for(let be=0,De=ue.length;be<De;be++)_i(ue[be],z,q,Q)}function Oi(T,z,q,Q){const V=T.opaque,ue=T.transmissive,be=T.transparent;m.setupLightsView(q),Pe===!0&&fe.setGlobalState(b.clippingPlanes,q),Q&&Se.viewport(D.copy(Q)),V.length>0&&zi(V,z,q),ue.length>0&&zi(ue,z,q),be.length>0&&zi(be,z,q),Se.buffers.depth.setTest(!0),Se.buffers.depth.setMask(!0),Se.buffers.color.setMask(!0),Se.setPolygonOffset(!1)}function ho(T,z,q,Q){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[Q.id]===void 0&&(m.state.transmissionRenderTarget[Q.id]=new Fi(1,1,{generateMipmaps:!0,type:I.has("EXT_color_buffer_half_float")||I.has("EXT_color_buffer_float")?ro:Vn,minFilter:Ni,samples:4,stencilBuffer:o,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ct.workingColorSpace}));const ue=m.state.transmissionRenderTarget[Q.id],be=Q.viewport||D;ue.setSize(be.z*b.transmissionResolutionScale,be.w*b.transmissionResolutionScale);const De=b.getRenderTarget(),Ce=b.getActiveCubeFace(),Ee=b.getActiveMipmapLevel();b.setRenderTarget(ue),b.getClearColor(G),W=b.getClearAlpha(),W<1&&b.setClearColor(16777215,.5),b.clear(),Ie&&Ne.render(q);const Ve=b.toneMapping;b.toneMapping=mi;const Fe=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),m.setupLightsView(Q),Pe===!0&&fe.setGlobalState(b.clippingPlanes,Q),zi(T,q,Q),Xe.updateMultisampleRenderTarget(ue),Xe.updateRenderTargetMipmap(ue),I.has("WEBGL_multisampled_render_to_texture")===!1){let Ge=!1;for(let Ye=0,At=z.length;Ye<At;Ye++){const vt=z[Ye],ft=vt.object,ze=vt.geometry,mt=vt.material,et=vt.group;if(mt.side===sn&&ft.layers.test(Q.layers)){const jt=mt.side;mt.side=$t,mt.needsUpdate=!0,nn(ft,q,Q,ze,mt,et),mt.side=jt,mt.needsUpdate=!0,Ge=!0}}Ge===!0&&(Xe.updateMultisampleRenderTarget(ue),Xe.updateRenderTargetMipmap(ue))}b.setRenderTarget(De,Ce,Ee),b.setClearColor(G,W),Fe!==void 0&&(Q.viewport=Fe),b.toneMapping=Ve}function zi(T,z,q){const Q=z.isScene===!0?z.overrideMaterial:null;for(let V=0,ue=T.length;V<ue;V++){const be=T[V],De=be.object,Ce=be.geometry,Ee=be.group;let Ve=be.material;Ve.allowOverride===!0&&Q!==null&&(Ve=Q),De.layers.test(q.layers)&&nn(De,z,q,Ce,Ve,Ee)}}function nn(T,z,q,Q,V,ue){T.onBeforeRender(b,z,q,Q,V,ue),T.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),V.onBeforeRender(b,z,q,Q,T,ue),V.transparent===!0&&V.side===sn&&V.forceSinglePass===!1?(V.side=$t,V.needsUpdate=!0,b.renderBufferDirect(q,z,Q,V,T,ue),V.side=ei,V.needsUpdate=!0,b.renderBufferDirect(q,z,Q,V,T,ue),V.side=sn):b.renderBufferDirect(q,z,Q,V,T,ue),T.onAfterRender(b,z,q,Q,V,ue)}function vi(T,z,q){z.isScene!==!0&&(z=he);const Q=ve.get(T),V=m.state.lights,ue=m.state.shadowsArray,be=V.state.version,De=J.getParameters(T,V.state,ue,z,q),Ce=J.getProgramCacheKey(De);let Ee=Q.programs;Q.environment=T.isMeshStandardMaterial?z.environment:null,Q.fog=z.fog,Q.envMap=(T.isMeshStandardMaterial?rt:St).get(T.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&T.envMap===null?z.environmentRotation:T.envMapRotation,Ee===void 0&&(T.addEventListener("dispose",ee),Ee=new Map,Q.programs=Ee);let Ve=Ee.get(Ce);if(Ve!==void 0){if(Q.currentProgram===Ve&&Q.lightsStateVersion===be)return Rs(T,De),Ve}else De.uniforms=J.getUniforms(T),T.onBeforeCompile(De,b),Ve=J.acquireProgram(De,Ce),Ee.set(Ce,Ve),Q.uniforms=De.uniforms;const Fe=Q.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Fe.clippingPlanes=fe.uniform),Rs(T,De),Q.needsLights=Vi(T),Q.lightsStateVersion=be,Q.needsLights&&(Fe.ambientLightColor.value=V.state.ambient,Fe.lightProbe.value=V.state.probe,Fe.directionalLights.value=V.state.directional,Fe.directionalLightShadows.value=V.state.directionalShadow,Fe.spotLights.value=V.state.spot,Fe.spotLightShadows.value=V.state.spotShadow,Fe.rectAreaLights.value=V.state.rectArea,Fe.ltc_1.value=V.state.rectAreaLTC1,Fe.ltc_2.value=V.state.rectAreaLTC2,Fe.pointLights.value=V.state.point,Fe.pointLightShadows.value=V.state.pointShadow,Fe.hemisphereLights.value=V.state.hemi,Fe.directionalShadowMap.value=V.state.directionalShadowMap,Fe.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Fe.spotShadowMap.value=V.state.spotShadowMap,Fe.spotLightMatrix.value=V.state.spotLightMatrix,Fe.spotLightMap.value=V.state.spotLightMap,Fe.pointShadowMap.value=V.state.pointShadowMap,Fe.pointShadowMatrix.value=V.state.pointShadowMatrix),Q.currentProgram=Ve,Q.uniformsList=null,Ve}function wn(T){if(T.uniformsList===null){const z=T.currentProgram.getUniforms();T.uniformsList=or.seqWithValue(z.seq,T.uniforms)}return T.uniformsList}function Rs(T,z){const q=ve.get(T);q.outputColorSpace=z.outputColorSpace,q.batching=z.batching,q.batchingColor=z.batchingColor,q.instancing=z.instancing,q.instancingColor=z.instancingColor,q.instancingMorph=z.instancingMorph,q.skinning=z.skinning,q.morphTargets=z.morphTargets,q.morphNormals=z.morphNormals,q.morphColors=z.morphColors,q.morphTargetsCount=z.morphTargetsCount,q.numClippingPlanes=z.numClippingPlanes,q.numIntersection=z.numClipIntersection,q.vertexAlphas=z.vertexAlphas,q.vertexTangents=z.vertexTangents,q.toneMapping=z.toneMapping}function ln(T,z,q,Q,V){z.isScene!==!0&&(z=he),Xe.resetTextureUnits();const ue=z.fog,be=Q.isMeshStandardMaterial?z.environment:null,De=C===null?b.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:Ms,Ce=(Q.isMeshStandardMaterial?rt:St).get(Q.envMap||be),Ee=Q.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Ve=!!q.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),Fe=!!q.morphAttributes.position,Ge=!!q.morphAttributes.normal,Ye=!!q.morphAttributes.color;let At=mi;Q.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(At=b.toneMapping);const vt=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,ft=vt!==void 0?vt.length:0,ze=ve.get(Q),mt=m.state.lights;if(Pe===!0&&(K===!0||T!==y)){const Lt=T===y&&Q.id===A;fe.setState(Q,T,Lt)}let et=!1;Q.version===ze.__version?(ze.needsLights&&ze.lightsStateVersion!==mt.state.version||ze.outputColorSpace!==De||V.isBatchedMesh&&ze.batching===!1||!V.isBatchedMesh&&ze.batching===!0||V.isBatchedMesh&&ze.batchingColor===!0&&V.colorTexture===null||V.isBatchedMesh&&ze.batchingColor===!1&&V.colorTexture!==null||V.isInstancedMesh&&ze.instancing===!1||!V.isInstancedMesh&&ze.instancing===!0||V.isSkinnedMesh&&ze.skinning===!1||!V.isSkinnedMesh&&ze.skinning===!0||V.isInstancedMesh&&ze.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&ze.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&ze.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&ze.instancingMorph===!1&&V.morphTexture!==null||ze.envMap!==Ce||Q.fog===!0&&ze.fog!==ue||ze.numClippingPlanes!==void 0&&(ze.numClippingPlanes!==fe.numPlanes||ze.numIntersection!==fe.numIntersection)||ze.vertexAlphas!==Ee||ze.vertexTangents!==Ve||ze.morphTargets!==Fe||ze.morphNormals!==Ge||ze.morphColors!==Ye||ze.toneMapping!==At||ze.morphTargetsCount!==ft)&&(et=!0):(et=!0,ze.__version=Q.version);let jt=ze.currentProgram;et===!0&&(jt=vi(Q,z,V));let ni=!1,Nt=!1,xi=!1;const bt=jt.getUniforms(),Wt=ze.uniforms;if(Se.useProgram(jt.program)&&(ni=!0,Nt=!0,xi=!0),Q.id!==A&&(A=Q.id,Nt=!0),ni||y!==T){Se.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),bt.setValue(P,"projectionMatrix",T.projectionMatrix),bt.setValue(P,"viewMatrix",T.matrixWorldInverse);const Pt=bt.map.cameraPosition;Pt!==void 0&&Pt.setValue(P,oe.setFromMatrixPosition(T.matrixWorld)),we.logarithmicDepthBuffer&&bt.setValue(P,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&bt.setValue(P,"isOrthographic",T.isOrthographicCamera===!0),y!==T&&(y=T,Nt=!0,xi=!0)}if(V.isSkinnedMesh){bt.setOptional(P,V,"bindMatrix"),bt.setOptional(P,V,"bindMatrixInverse");const Lt=V.skeleton;Lt&&(Lt.boneTexture===null&&Lt.computeBoneTexture(),bt.setValue(P,"boneTexture",Lt.boneTexture,Xe))}V.isBatchedMesh&&(bt.setOptional(P,V,"batchingTexture"),bt.setValue(P,"batchingTexture",V._matricesTexture,Xe),bt.setOptional(P,V,"batchingIdTexture"),bt.setValue(P,"batchingIdTexture",V._indirectTexture,Xe),bt.setOptional(P,V,"batchingColorTexture"),V._colorsTexture!==null&&bt.setValue(P,"batchingColorTexture",V._colorsTexture,Xe));const Xt=q.morphAttributes;if((Xt.position!==void 0||Xt.normal!==void 0||Xt.color!==void 0)&&ne.update(V,q,jt),(Nt||ze.receiveShadow!==V.receiveShadow)&&(ze.receiveShadow=V.receiveShadow,bt.setValue(P,"receiveShadow",V.receiveShadow)),Q.isMeshGouraudMaterial&&Q.envMap!==null&&(Wt.envMap.value=Ce,Wt.flipEnvMap.value=Ce.isCubeTexture&&Ce.isRenderTargetTexture===!1?-1:1),Q.isMeshStandardMaterial&&Q.envMap===null&&z.environment!==null&&(Wt.envMapIntensity.value=z.environmentIntensity),Nt&&(bt.setValue(P,"toneMappingExposure",b.toneMappingExposure),ze.needsLights&&yr(Wt,xi),ue&&Q.fog===!0&&re.refreshFogUniforms(Wt,ue),re.refreshMaterialUniforms(Wt,Q,B,Y,m.state.transmissionRenderTarget[T.id]),or.upload(P,wn(ze),Wt,Xe)),Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(or.upload(P,wn(ze),Wt,Xe),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&bt.setValue(P,"center",V.center),bt.setValue(P,"modelViewMatrix",V.modelViewMatrix),bt.setValue(P,"normalMatrix",V.normalMatrix),bt.setValue(P,"modelMatrix",V.matrixWorld),Q.isShaderMaterial||Q.isRawShaderMaterial){const Lt=Q.uniformsGroups;for(let Pt=0,Hi=Lt.length;Pt<Hi;Pt++){const Tn=Lt[Pt];We.update(Tn,jt),We.bind(Tn,jt)}}return jt}function yr(T,z){T.ambientLightColor.needsUpdate=z,T.lightProbe.needsUpdate=z,T.directionalLights.needsUpdate=z,T.directionalLightShadows.needsUpdate=z,T.pointLights.needsUpdate=z,T.pointLightShadows.needsUpdate=z,T.spotLights.needsUpdate=z,T.spotLightShadows.needsUpdate=z,T.rectAreaLights.needsUpdate=z,T.hemisphereLights.needsUpdate=z}function Vi(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return v},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(T,z,q){const Q=ve.get(T);Q.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,Q.__autoAllocateDepthBuffer===!1&&(Q.__useRenderToTexture=!1),ve.get(T.texture).__webglTexture=z,ve.get(T.depthTexture).__webglTexture=Q.__autoAllocateDepthBuffer?void 0:q,Q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,z){const q=ve.get(T);q.__webglFramebuffer=z,q.__useDefaultFramebuffer=z===void 0};const ks=P.createFramebuffer();this.setRenderTarget=function(T,z=0,q=0){C=T,v=z,S=q;let Q=!0,V=null,ue=!1,be=!1;if(T){const Ce=ve.get(T);if(Ce.__useDefaultFramebuffer!==void 0)Se.bindFramebuffer(P.FRAMEBUFFER,null),Q=!1;else if(Ce.__webglFramebuffer===void 0)Xe.setupRenderTarget(T);else if(Ce.__hasExternalTextures)Xe.rebindTextures(T,ve.get(T.texture).__webglTexture,ve.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const Fe=T.depthTexture;if(Ce.__boundDepthTexture!==Fe){if(Fe!==null&&ve.has(Fe)&&(T.width!==Fe.image.width||T.height!==Fe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Xe.setupDepthRenderbuffer(T)}}const Ee=T.texture;(Ee.isData3DTexture||Ee.isDataArrayTexture||Ee.isCompressedArrayTexture)&&(be=!0);const Ve=ve.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Ve[z])?V=Ve[z][q]:V=Ve[z],ue=!0):T.samples>0&&Xe.useMultisampledRTT(T)===!1?V=ve.get(T).__webglMultisampledFramebuffer:Array.isArray(Ve)?V=Ve[q]:V=Ve,D.copy(T.viewport),L.copy(T.scissor),O=T.scissorTest}else D.copy(xe).multiplyScalar(B).floor(),L.copy(Oe).multiplyScalar(B).floor(),O=Me;if(q!==0&&(V=ks),Se.bindFramebuffer(P.FRAMEBUFFER,V)&&Q&&Se.drawBuffers(T,V),Se.viewport(D),Se.scissor(L),Se.setScissorTest(O),ue){const Ce=ve.get(T.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+z,Ce.__webglTexture,q)}else if(be){const Ce=z;for(let Ee=0;Ee<T.textures.length;Ee++){const Ve=ve.get(T.textures[Ee]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+Ee,Ve.__webglTexture,q,Ce)}}else if(T!==null&&q!==0){const Ce=ve.get(T.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Ce.__webglTexture,q)}A=-1},this.readRenderTargetPixels=function(T,z,q,Q,V,ue,be,De=0){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ce=ve.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&be!==void 0&&(Ce=Ce[be]),Ce){Se.bindFramebuffer(P.FRAMEBUFFER,Ce);try{const Ee=T.textures[De],Ve=Ee.format,Fe=Ee.type;if(!we.textureFormatReadable(Ve)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!we.textureTypeReadable(Fe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=T.width-Q&&q>=0&&q<=T.height-V&&(T.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+De),P.readPixels(z,q,Q,V,Re.convert(Ve),Re.convert(Fe),ue))}finally{const Ee=C!==null?ve.get(C).__webglFramebuffer:null;Se.bindFramebuffer(P.FRAMEBUFFER,Ee)}}},this.readRenderTargetPixelsAsync=async function(T,z,q,Q,V,ue,be,De=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ce=ve.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&be!==void 0&&(Ce=Ce[be]),Ce)if(z>=0&&z<=T.width-Q&&q>=0&&q<=T.height-V){Se.bindFramebuffer(P.FRAMEBUFFER,Ce);const Ee=T.textures[De],Ve=Ee.format,Fe=Ee.type;if(!we.textureFormatReadable(Ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!we.textureTypeReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ge=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,Ge),P.bufferData(P.PIXEL_PACK_BUFFER,ue.byteLength,P.STREAM_READ),T.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+De),P.readPixels(z,q,Q,V,Re.convert(Ve),Re.convert(Fe),0);const Ye=C!==null?ve.get(C).__webglFramebuffer:null;Se.bindFramebuffer(P.FRAMEBUFFER,Ye);const At=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await gg(P,At,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,Ge),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,ue),P.deleteBuffer(Ge),P.deleteSync(At),ue}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,z=null,q=0){const Q=Math.pow(2,-q),V=Math.floor(T.image.width*Q),ue=Math.floor(T.image.height*Q),be=z!==null?z.x:0,De=z!==null?z.y:0;Xe.setTexture2D(T,0),P.copyTexSubImage2D(P.TEXTURE_2D,q,0,0,be,De,V,ue),Se.unbindTexture()};const Ds=P.createFramebuffer(),Gi=P.createFramebuffer();this.copyTextureToTexture=function(T,z,q=null,Q=null,V=0,ue=null){ue===null&&(V!==0?(so("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ue=V,V=0):ue=0);let be,De,Ce,Ee,Ve,Fe,Ge,Ye,At;const vt=T.isCompressedTexture?T.mipmaps[ue]:T.image;if(q!==null)be=q.max.x-q.min.x,De=q.max.y-q.min.y,Ce=q.isBox3?q.max.z-q.min.z:1,Ee=q.min.x,Ve=q.min.y,Fe=q.isBox3?q.min.z:0;else{const Xt=Math.pow(2,-V);be=Math.floor(vt.width*Xt),De=Math.floor(vt.height*Xt),T.isDataArrayTexture?Ce=vt.depth:T.isData3DTexture?Ce=Math.floor(vt.depth*Xt):Ce=1,Ee=0,Ve=0,Fe=0}Q!==null?(Ge=Q.x,Ye=Q.y,At=Q.z):(Ge=0,Ye=0,At=0);const ft=Re.convert(z.format),ze=Re.convert(z.type);let mt;z.isData3DTexture?(Xe.setTexture3D(z,0),mt=P.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?(Xe.setTexture2DArray(z,0),mt=P.TEXTURE_2D_ARRAY):(Xe.setTexture2D(z,0),mt=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,z.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,z.unpackAlignment);const et=P.getParameter(P.UNPACK_ROW_LENGTH),jt=P.getParameter(P.UNPACK_IMAGE_HEIGHT),ni=P.getParameter(P.UNPACK_SKIP_PIXELS),Nt=P.getParameter(P.UNPACK_SKIP_ROWS),xi=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,vt.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,vt.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Ee),P.pixelStorei(P.UNPACK_SKIP_ROWS,Ve),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Fe);const bt=T.isDataArrayTexture||T.isData3DTexture,Wt=z.isDataArrayTexture||z.isData3DTexture;if(T.isDepthTexture){const Xt=ve.get(T),Lt=ve.get(z),Pt=ve.get(Xt.__renderTarget),Hi=ve.get(Lt.__renderTarget);Se.bindFramebuffer(P.READ_FRAMEBUFFER,Pt.__webglFramebuffer),Se.bindFramebuffer(P.DRAW_FRAMEBUFFER,Hi.__webglFramebuffer);for(let Tn=0;Tn<Ce;Tn++)bt&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,ve.get(T).__webglTexture,V,Fe+Tn),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,ve.get(z).__webglTexture,ue,At+Tn)),P.blitFramebuffer(Ee,Ve,be,De,Ge,Ye,be,De,P.DEPTH_BUFFER_BIT,P.NEAREST);Se.bindFramebuffer(P.READ_FRAMEBUFFER,null),Se.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(V!==0||T.isRenderTargetTexture||ve.has(T)){const Xt=ve.get(T),Lt=ve.get(z);Se.bindFramebuffer(P.READ_FRAMEBUFFER,Ds),Se.bindFramebuffer(P.DRAW_FRAMEBUFFER,Gi);for(let Pt=0;Pt<Ce;Pt++)bt?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Xt.__webglTexture,V,Fe+Pt):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Xt.__webglTexture,V),Wt?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Lt.__webglTexture,ue,At+Pt):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Lt.__webglTexture,ue),V!==0?P.blitFramebuffer(Ee,Ve,be,De,Ge,Ye,be,De,P.COLOR_BUFFER_BIT,P.NEAREST):Wt?P.copyTexSubImage3D(mt,ue,Ge,Ye,At+Pt,Ee,Ve,be,De):P.copyTexSubImage2D(mt,ue,Ge,Ye,Ee,Ve,be,De);Se.bindFramebuffer(P.READ_FRAMEBUFFER,null),Se.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else Wt?T.isDataTexture||T.isData3DTexture?P.texSubImage3D(mt,ue,Ge,Ye,At,be,De,Ce,ft,ze,vt.data):z.isCompressedArrayTexture?P.compressedTexSubImage3D(mt,ue,Ge,Ye,At,be,De,Ce,ft,vt.data):P.texSubImage3D(mt,ue,Ge,Ye,At,be,De,Ce,ft,ze,vt):T.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,ue,Ge,Ye,be,De,ft,ze,vt.data):T.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,ue,Ge,Ye,vt.width,vt.height,ft,vt.data):P.texSubImage2D(P.TEXTURE_2D,ue,Ge,Ye,be,De,ft,ze,vt);P.pixelStorei(P.UNPACK_ROW_LENGTH,et),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,jt),P.pixelStorei(P.UNPACK_SKIP_PIXELS,ni),P.pixelStorei(P.UNPACK_SKIP_ROWS,Nt),P.pixelStorei(P.UNPACK_SKIP_IMAGES,xi),ue===0&&z.generateMipmaps&&P.generateMipmap(mt),Se.unbindTexture()},this.initRenderTarget=function(T){ve.get(T).__webglFramebuffer===void 0&&Xe.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?Xe.setTextureCube(T,0):T.isData3DTexture?Xe.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?Xe.setTexture2DArray(T,0):Xe.setTexture2D(T,0),Se.unbindTexture()},this.resetState=function(){v=0,S=0,C=null,Se.reset(),ge.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return zn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=ct._getDrawingBufferColorSpace(e),t.unpackColorSpace=ct._getUnpackColorSpace()}}let Vs=null,Ti=2654435769;function Ll(){return Ti^=Ti<<13,Ti^=Ti>>>17,Ti^=Ti<<5,(Ti>>>0)/4294967296}function Hn(){try{return Vs||(Vs=new(window.AudioContext||window.webkitAudioContext)),Vs.state==="suspended"&&Vs.resume(),Vs}catch{return null}}function Gt(s,e,t,n=.12,i="sine"){const o=Hn();if(!o)return;const r=o.createOscillator(),a=o.createGain();r.type=i,r.frequency.setValueAtTime(s,e),a.gain.setValueAtTime(0,e),a.gain.linearRampToValueAtTime(n,e+.01),a.gain.exponentialRampToValueAtTime(5e-4,e+t),r.connect(a).connect(o.destination),r.start(e),r.stop(e+t+.02)}function Vo(s=.25){const e=Hn();if(!e)return;const t=1200*(1+(Ll()*2-1)*s);Gt(t,e.currentTime,.14,.08),Gt(t*2,e.currentTime,.08,.03)}function da(){const s=Hn();if(!s)return;const e=s.currentTime;for(const[t,n]of[523.25,659.25,783.99,1046.5].entries())Gt(n,e+t*.09,.22,.1,"triangle")}function PA(s=1){const e=Hn();if(!e)return;const t=e.currentTime,n=Math.max(1,Math.min(5,s)),i=e.createOscillator(),o=e.createGain();i.type="sawtooth",i.frequency.setValueAtTime(90+20*n,t),i.frequency.exponentialRampToValueAtTime(400+160*n,t+.25),i.frequency.exponentialRampToValueAtTime(140+30*n,t+.9+.1*n),o.gain.setValueAtTime(0,t),o.gain.linearRampToValueAtTime(.05+.015*n,t+.05),o.gain.exponentialRampToValueAtTime(5e-4,t+1+.1*n),i.connect(o).connect(e.destination),i.start(t),i.stop(t+1.2+.1*n),Gt(1600+200*n,t,.12,.03)}function IA(){const s=Hn();if(!s)return;const e=s.currentTime;Gt(140,e,.12,.12,"square"),Gt(90,e+.02,.18,.1,"triangle")}function UA(){const s=Hn();if(!s)return;const e=s.currentTime;Gt(520+Ll()*80,e,.05,.1,"square"),Gt(250,e+.01,.08,.08,"triangle")}function ha(){const s=Hn();if(!s)return;const e=s.currentTime;Gt(70,e,.45,.18,"sawtooth"),Gt(95,e+.08,.4,.12,"square"),Gt(55,e+.2,.5,.14,"triangle")}function NA(){const s=Hn();if(!s)return;const e=s.currentTime;for(let t=0;t<3;t++)Gt(880,e+t*.55,.5,.12,"sine"),Gt(1320,e+t*.55,.35,.05,"triangle")}function qc(){const s=Hn();if(!s)return;const e=s.currentTime;Gt(392,e,.3,.12,"square"),Gt(330,e+.3,.3,.12,"square"),Gt(262,e+.6,.6,.12,"square")}function BA(){const s=Hn();if(!s)return;const e=s.currentTime;Gt(60,e,.5,.2,"sawtooth"),Gt(38,e+.02,.7,.16,"square");const t=s.createBuffer(1,Math.floor(s.sampleRate*.35),s.sampleRate),n=t.getChannelData(0);for(let r=0;r<n.length;r++)n[r]=(Ll()*2-1)*(1-r/n.length);const i=s.createBufferSource(),o=s.createGain();i.buffer=t,o.gain.setValueAtTime(.18,e),o.gain.exponentialRampToValueAtTime(5e-4,e+.35),i.connect(o).connect(s.destination),i.start(e)}const ua=.18,Kc=3.2;class FA{prevButtons=[];lastActive=0;axis(e){const t=Math.abs(e);return t<ua?0:Math.sign(e)*((t-ua)/(1-ua))}poll(e,t){const n=typeof navigator.getGamepads=="function"?navigator.getGamepads():[],i=Array.from(n).find(c=>!!c&&c.connected);if(!i)return;const o=i.buttons.map(c=>c.pressed),r=c=>o[c]&&!this.prevButtons[c],a=this.axis(i.axes[0]??0),l=-this.axis(i.axes[1]??0),d=this.axis(i.axes[2]??0),u=this.axis(i.axes[3]??0);(a||l||d||u||o.some(Boolean))&&(this.lastActive=performance.now()),e.moveX+=a,e.moveZ+=l,e.lookDX+=d*Kc*t,e.lookDY+=u*Kc*t,o[0]&&(e.jump=!0),o[1]&&(e.sneak=!0),o[10]&&(e.sprint=!0),o[2]&&(e.guard=!0),o[7]&&(e.primary=!0),o[6]&&(e.secondaryHold=!0),r(6)&&(e.secondaryTap=!0),r(5)&&(e.slotDelta+=1),r(4)&&(e.slotDelta-=1),r(9)&&(e.toggleDebug=!0),this.prevButtons=o}dispose(){}}function Eh(s){s.moveX=0,s.moveZ=0,s.lookDX=0,s.lookDY=0,s.jump=!1,s.sneak=!1,s.sprint=!1,s.primary=!1,s.secondaryTap=!1,s.secondaryHold=!1,s.guard=!1,s.slotDelta=0,s.slotSelect=-1,s.toggleDebug=!1}function Qc(){const s={};return Eh(s),s}class OA{state=Qc();sources=[];paused=!1;add(e){this.sources.push(e)}frame(e){const t=this.state;if(Eh(t),this.paused){const i=Qc();for(const o of this.sources)o.poll(i,e);return t}for(const i of this.sources)i.poll(t,e);const n=Math.hypot(t.moveX,t.moveZ);return n>1&&(t.moveX/=n,t.moveZ/=n),t}dispose(){for(const e of this.sources)e.dispose();this.sources.length=0}}const jc=.0022;class zA{constructor(e){this.element=e,document.addEventListener("pointerlockerror",this.onLockError),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp),window.addEventListener("blur",this.onBlur),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("mousedown",this.onMouseDown),document.addEventListener("mouseup",this.onMouseUp),document.addEventListener("wheel",this.onWheel,{passive:!0}),document.addEventListener("contextmenu",this.onContextMenu)}element;keys=new Set;lookDX=0;lookDY=0;primary=!1;secondaryHold=!1;secondaryTap=!1;slotDelta=0;slotSelect=-1;toggleDebug=!1;lastActive=0;lockFailed=!1;enabled=!1;onKeyDown=e=>{if(!e.repeat){if(this.lastActive=performance.now(),this.keys.add(e.code),e.code.startsWith("Digit")){const t=Number(e.code.slice(5));t>=1&&t<=9?this.slotSelect=t-1:t===0&&(this.slotSelect=9)}e.code==="F3"&&(this.toggleDebug=!0,e.preventDefault()),(e.code==="Space"||e.code==="Tab")&&e.preventDefault()}};onKeyUp=e=>{this.keys.delete(e.code)};onBlur=()=>{this.keys.clear(),this.primary=!1,this.secondaryHold=!1};onMouseMove=e=>{this.active&&(this.lookDX+=e.movementX*jc,this.lookDY+=e.movementY*jc)};onMouseDown=e=>{this.active&&(this.lastActive=performance.now(),e.button===0&&(this.primary=!0),e.button===2&&(this.secondaryHold=!0,this.secondaryTap=!0))};onMouseUp=e=>{e.button===0&&(this.primary=!1),e.button===2&&(this.secondaryHold=!1)};onWheel=e=>{this.active&&(e.deltaY>0?this.slotDelta++:e.deltaY<0&&this.slotDelta--)};onContextMenu=e=>e.preventDefault();onLockError=()=>{this.lockFailed=!0};get locked(){return document.pointerLockElement===this.element}get active(){return this.locked||this.lockFailed&&this.enabled}async requestLock(){if(this.locked)return!0;if(!this.element.requestPointerLock)return this.lockFailed=!0,!1;const e=this.element.requestPointerLock;try{await e.call(this.element,{unadjustedMovement:!0})}catch{try{await e.call(this.element)}catch{return this.lockFailed=!0,!1}}return await new Promise(t=>setTimeout(t,50)),this.locked?(this.lockFailed=!1,!0):(this.lockFailed=!0,!1)}down(...e){for(const t of e)if(this.keys.has(t))return!0;return!1}poll(e){this.down("KeyW","ArrowUp")&&(e.moveZ+=1),this.down("KeyS","ArrowDown")&&(e.moveZ-=1),this.down("KeyD","ArrowRight")&&(e.moveX+=1),this.down("KeyA","ArrowLeft")&&(e.moveX-=1),this.down("Space")&&(e.jump=!0),this.down("ShiftLeft","ShiftRight")&&(e.sneak=!0),this.down("ControlLeft","ControlRight")&&(e.sprint=!0),this.down("KeyX")&&(e.guard=!0),e.lookDX+=this.lookDX,e.lookDY+=this.lookDY,this.lookDX=0,this.lookDY=0,this.primary&&(e.primary=!0),this.secondaryHold&&(e.secondaryHold=!0),this.secondaryTap&&(e.secondaryTap=!0),this.secondaryTap=!1,e.slotDelta+=this.slotDelta,this.slotDelta=0,this.slotSelect>=0&&(e.slotSelect=this.slotSelect),this.slotSelect=-1,this.toggleDebug&&(e.toggleDebug=!0),this.toggleDebug=!1}dispose(){document.removeEventListener("pointerlockerror",this.onLockError),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),window.removeEventListener("blur",this.onBlur),document.removeEventListener("mousemove",this.onMouseMove),document.removeEventListener("mousedown",this.onMouseDown),document.removeEventListener("mouseup",this.onMouseUp),document.removeEventListener("wheel",this.onWheel),document.removeEventListener("contextmenu",this.onContextMenu)}}const VA=.0082,GA=.0056,Gs=56,HA=28,fa=.12,Jc=220,WA=320,XA=14;class pa{constructor(e,t){this.el=e,this.onChange=t}el;onChange;held=!1;locked=!1;lockPending=!1;lastUp=0;get on(){return this.held||this.locked}press(e){if(this.locked){this.locked=!1,this.held=!1,this.lockPending=!1,this.lastUp=e,this.paint();return}this.lockPending=e-this.lastUp<=WA,this.held=!0,this.paint()}release(e){this.lastUp=e,this.lockPending&&(this.locked=!0,this.lockPending=!1),this.held=!1,this.paint()}clear(){this.held=this.locked=this.lockPending=!1,this.paint()}paint(){this.el.classList.toggle("active",this.on),this.el.classList.toggle("locked",this.locked),this.onChange?.(this.on)}}class YA{constructor(e){this.ui=e,this.jump=new pa(e.jumpButton),this.sneak=new pa(e.sneakButton,n=>e.onSneakToggle?.(n)),this.guard=new pa(e.guardButton);const t={passive:!1};e.surface.addEventListener("touchstart",this.onStart,t),e.surface.addEventListener("touchmove",this.onMove,t),e.surface.addEventListener("touchend",this.onEnd,t),e.surface.addEventListener("touchcancel",this.onEnd,t),e.jumpButton.addEventListener("touchstart",this.onJumpStart,t),e.jumpButton.addEventListener("touchend",this.onJumpEnd,t),e.jumpButton.addEventListener("touchcancel",this.onJumpEnd,t),e.sneakButton.addEventListener("touchstart",this.onSneakStart,t),e.sneakButton.addEventListener("touchend",this.onSneakEnd,t),e.sneakButton.addEventListener("touchcancel",this.onSneakEnd,t),e.guardButton.addEventListener("touchstart",this.onGuardStart,t),e.guardButton.addEventListener("touchend",this.onGuardEnd,t),e.guardButton.addEventListener("touchcancel",this.onGuardEnd,t),e.stickBase.hidden=!1}ui;stick=null;look=null;lookDX=0;lookDY=0;secondaryTap=!1;jump;sneak;guard;lastActive=0;stickCenter(){const e=this.ui.stickBase.getBoundingClientRect();return{cx:e.left+e.width/2,cy:e.top+e.height/2}}onStickArea(e,t){const n=this.ui.stickBase.getBoundingClientRect(),i=HA;return e>=n.left-i&&e<=n.right+i&&t>=n.top-i&&t<=n.bottom+i}onStart=e=>{let t=!1;for(const n of Array.from(e.changedTouches))if(!n.target?.closest?.(".hotbar, .tbtn, .sbtn, .topbar, .overlay, .help-panel, .action-card, .result-panel, .bag-panel, .chat-panel, .side-btns, .time-chip, .today-panel, .approval-card, .nest-panel, .chest-panel"))if(t=!0,this.stick===null&&this.onStickArea(n.clientX,n.clientY)){const{cx:i,cy:o}=this.stickCenter();this.stick={id:n.identifier,ox:i,oy:o,dx:0,dy:0},this.moveStick(n.clientX,n.clientY)}else this.look===null&&(this.look={id:n.identifier,startX:n.clientX,startY:n.clientY,lastX:n.clientX,lastY:n.clientY,startTime:performance.now(),mode:"undecided"});t&&(this.lastActive=performance.now(),e.preventDefault())};onMove=e=>{(this.stick||this.look)&&e.preventDefault();for(const t of Array.from(e.changedTouches))if(this.stick&&t.identifier===this.stick.id)this.moveStick(t.clientX,t.clientY);else if(this.look&&t.identifier===this.look.id){const n=this.look,i=t.clientX-n.lastX,o=t.clientY-n.lastY;n.lastX=t.clientX,n.lastY=t.clientY,n.mode==="undecided"&&Math.hypot(t.clientX-n.startX,t.clientY-n.startY)>XA&&(n.mode="look"),n.mode!=="undecided"&&(this.lookDX+=i*VA,this.lookDY+=o*GA)}};moveStick(e,t){if(!this.stick)return;let n=e-this.stick.ox,i=t-this.stick.oy;const o=Math.hypot(n,i);o>Gs&&(n*=Gs/o,i*=Gs/o),this.stick.dx=n,this.stick.dy=i,this.ui.stickKnob.style.transform=`translate(${n}px, ${i}px)`,this.ui.stickBase.classList.add("active")}onEnd=e=>{let t=!1;for(const n of Array.from(e.changedTouches))this.stick&&n.identifier===this.stick.id?(this.stick=null,this.ui.stickKnob.style.transform="translate(0px, 0px)",this.ui.stickBase.classList.remove("active"),t=!0):this.look&&n.identifier===this.look.id&&(this.look.mode==="undecided"&&performance.now()-this.look.startTime<Jc&&(this.secondaryTap=!0),this.look=null,t=!0);t&&e.preventDefault()};onJumpStart=e=>{e.preventDefault(),this.lastActive=performance.now(),this.jump.press(this.lastActive)};onJumpEnd=e=>{e.preventDefault(),this.jump.release(performance.now())};onSneakStart=e=>{e.preventDefault(),this.lastActive=performance.now(),this.sneak.press(this.lastActive)};onSneakEnd=e=>{e.preventDefault(),this.sneak.release(performance.now())};onGuardStart=e=>{e.preventDefault(),this.lastActive=performance.now(),this.guard.press(this.lastActive)};onGuardEnd=e=>{e.preventDefault(),this.guard.release(performance.now())};clearHolds(){this.jump.clear(),this.sneak.clear(),this.guard.clear()}poll(e){if(this.stick){let t=this.stick.dx/Gs,n=-this.stick.dy/Gs;const i=Math.hypot(t,n);if(i<fa)t=n=0;else{const o=(i-fa)/(1-fa)/i;t*=o,n*=o}e.moveX+=t,e.moveZ+=n,n>.97&&(e.sprint=!0)}if(this.look){const t=this.look;t.mode==="undecided"&&performance.now()-t.startTime>=Jc&&(t.mode="break"),t.mode==="break"&&(e.primary=!0)}e.lookDX+=this.lookDX,e.lookDY+=this.lookDY,this.lookDX=0,this.lookDY=0,this.secondaryTap&&(e.secondaryTap=!0),this.secondaryTap=!1,this.jump.on&&(e.jump=!0),this.sneak.on&&(e.sneak=!0),this.guard.on&&(e.guard=!0)}dispose(){const e=this.ui.surface;e.removeEventListener("touchstart",this.onStart),e.removeEventListener("touchmove",this.onMove),e.removeEventListener("touchend",this.onEnd),e.removeEventListener("touchcancel",this.onEnd),this.ui.jumpButton.removeEventListener("touchstart",this.onJumpStart),this.ui.jumpButton.removeEventListener("touchend",this.onJumpEnd),this.ui.jumpButton.removeEventListener("touchcancel",this.onJumpEnd),this.ui.sneakButton.removeEventListener("touchstart",this.onSneakStart),this.ui.sneakButton.removeEventListener("touchend",this.onSneakEnd),this.ui.sneakButton.removeEventListener("touchcancel",this.onSneakEnd),this.ui.guardButton.removeEventListener("touchstart",this.onGuardStart),this.ui.guardButton.removeEventListener("touchend",this.onGuardEnd),this.ui.guardButton.removeEventListener("touchcancel",this.onGuardEnd)}}const Sh=0,qA=1,KA=2,Xs=3;function QA(s,e){const t=e.get("missing")??0,n=i=>e.get(i)??t;return s.defs.map(i=>{if(i.id==="air"||!i.textures)return{layer:Sh,opaque:!1,castAO:!1,sameCull:!1,tex:[0,0,0,0,0,0],fluidKind:0,fluidHeight:0,panel:null,torch:null,egg:!1};const o=i.fluid==="water"||i.id==="ice",r=i.solid&&!i.transparent||i.fluid==="lava",a=o?Xs:r?qA:KA,[l,d,u]=i.textures,c=n(d);let h=null;if(i.door){const[f,_]=Id[i.door.facing];if(!i.door.open)h=[f!==0?0:2,f<0||_<0?1:0];else{const g=i.door.hinge?-_:_,p=i.door.hinge?f:-f;h=[g!==0?0:2,g<0||p<0?0:1]}}return{panel:h,torch:i.torch?i.torch.wall:null,egg:i.shape==="egg",layer:a,opaque:r,castAO:r&&!i.fluid||i.id==="leaves",sameCull:i.transparent,tex:[c,c,n(l),n(u),c,c],fluidKind:i.fluid==="water"?1:i.fluid==="lava"?2:0,fluidHeight:i.fluid?(8-i.fluidLevel)/9:0}})}(function(s,e){typeof module=="object"&&module.exports?module.exports=e():s.DragonVoxels=e()})(typeof self<"u"?self:void 0,function(){function s(u,c,h,f){let _=u*374761393+c*668265263+h*2147483647+f*97|0;return _=(_^_>>>13)*1274126177,_=_^_>>>16,(_>>>0)%1e3/1e3}class e{constructor(){this.map=new Map}key(c,h,f){return c+","+h+","+f}set(c,h,f,_){h<0||this.map.set(this.key(c,h,f),{x:c,y:h,z:f,c:_})}get(c,h,f){return this.map.get(this.key(c,h,f))}box(c,h,f,_,g,p,m){for(let M=Math.min(c,_);M<=Math.max(c,_);M++)for(let w=Math.min(h,g);w<=Math.max(h,g);w++)for(let b=Math.min(f,p);b<=Math.max(f,p);b++)this.set(M,w,b,m)}mirror(){for(const c of Array.from(this.map.values()))c.x<0&&this.set(-c.x,c.y,c.z,c.c)}list(){return Array.from(this.map.values())}}function t(u){const c=new e,h=u.colors,f=u.seed;for(let v=-5;v<=5;v++){const S=Math.abs(v)>=5?1:2,C=7+(Math.abs(v)>=4?-1:0);for(let A=-S;A<=S;A++)for(let y=4;y<=C;y++){let D=h.body;y===4?D=h.belly:y===C&&s(A,y,v,f)<u.scaleNoise&&(D=h.dark),c.set(A,y,v,D)}}for(let v=-5;v<=4;v+=2)c.set(0,8,v,u.spineStyle==="blade"?h.accent:h.dark);if(u.spineStyle==="blade")for(let v=-4;v<=3;v+=2)c.set(0,9,v,h.accent);const _=[[6,6],[7,7],[8,8],[8,9]];for(const[v,S]of _)c.box(-1,S,v,1,S+1,v,h.body),c.set(0,S,v,h.belly);const g=9,p=9;c.box(-1,p,g,1,p+2,g+3,h.body),c.box(-1,p,g+4,1,p+1,g+5,h.body),c.box(-1,p,g+4,1,p,g+5,h.belly),c.set(-1,p+2,g+2,h.eye),c.set(1,p+2,g+2,h.eye),c.set(-1,p+2,g+3,h.eyeDark),c.set(1,p+2,g+3,h.eyeDark),c.set(-1,p,g+5,h.dark),c.set(1,p,g+5,h.dark),c.set(-1,p-1,g+5,h.tooth),c.set(1,p-1,g+5,h.tooth),u.horn==="spiky"?(c.box(-1,p+3,g,-1,p+4,g,h.accent),c.set(-2,p+5,g-1,h.accent),c.set(-1,p+5,g+1,h.accent),c.set(0,p+3,g+1,h.accent),c.set(0,p+4,g+1,h.accent)):u.horn==="ears"?(c.box(-2,p+2,g,-2,p+4,g+1,h.dark),c.set(-2,p+5,g+1,h.dark),c.set(0,p+3,g+2,h.accent)):u.horn==="blade"&&(c.set(0,p+3,g,h.accent),c.set(0,p+4,g-1,h.accent),c.set(0,p+5,g-2,h.accent),c.set(0,p+6,g-3,h.accent),c.set(-2,p+2,g+1,h.accent),c.set(-2,p+3,g,h.accent));for(const[v,S]of[[-2,3],[-2,-4]])c.box(v,1,S,v,4,S+1,h.body),c.box(v,0,S-1,v,0,S+1,h.dark),c.set(v,0,S+2,h.tooth),u.bulky&&c.box(v-1,3,S,v-1,4,S+1,h.body);[[-6,5],[-7,5],[-8,5],[-9,6],[-10,6],[-11,7],[-12,8]].forEach(([v,S],C)=>{const A=C<3?1:0;c.box(-A,S,v,A,S+(C<4?1:0),v,h.body),C%2===0&&C<5&&c.set(0,S+2,v,h.dark)}),u.tailTip==="leaf"?(c.box(-1,8,-13,1,9,-13,h.wing),c.set(0,10,-13,h.wing),c.set(0,8,-14,h.wing)):u.tailTip==="club"?c.box(-1,7,-13,1,9,-14,h.dark):u.tailTip==="blade"&&(c.set(0,9,-13,h.accent),c.set(0,10,-13,h.accent),c.set(0,8,-14,h.accent),c.set(0,9,-14,h.accent));const M=-2,w=7,b=1;function R(v,S,C,A){for(let L=1;L<=v;L++){const O=w+Math.round(L*S),G=b-Math.round(L*C),W=b+1-(L>v-2?1:0);for(let F=G;F<=W;F++){let Y=h.wing;F===W?Y=h.dark:(F-G)%3===0&&L>1&&(Y=h.wingVein),c.set(M-L,O,F,Y)}L===1&&c.set(M-L,O-1,b,h.dark)}const y=M-v-1,D=w+Math.round(v*S);A==="claw"&&(c.set(y,D,b+1,h.tooth),c.set(y,D+1,b+1,h.dark)),A==="spike"&&(c.set(y,D+1,b,h.accent),c.set(y-1,D+2,b,h.accent))}return u.wing==="leaf"&&R(8,.7,.9,"claw"),u.wing==="stub"&&R(4,.5,.6,"claw"),u.wing==="plate"&&R(6,.8,.7,"spike"),c.mirror(),c.list()}function n(u,c){const h=parseInt(u.slice(1),16),f=Math.min(255,Math.round((h>>16&255)*c)),_=Math.min(255,Math.round((h>>8&255)*c)),g=Math.min(255,Math.round((h&255)*c));return"#"+(f<<16|_<<8|g).toString(16).padStart(6,"0")}function i(u){const c=new e,h=Object.assign({},u.colors,{body:n(u.colors.body,.88),dark:n(u.colors.dark,.85),eye:u.colors.eye,glow:n(u.colors.eye,1.15)}),f=u.seed+7;for(let v=-8;v<=8;v++){const S=Math.abs(v)>=8?1:Math.abs(v)>=6?2:3,C=11-(Math.abs(v)>=6?1:0)-(Math.abs(v)>=8?1:0);for(let A=-S;A<=S;A++)for(let y=5;y<=C;y++){let D=h.body;y<=6&&Math.abs(A)<=1?D=h.belly:y===C&&s(A,y,v,f)<u.scaleNoise+.15&&(D=h.dark),u.armor&&y>=9&&Math.abs(A)===S&&(v+8)%3===0&&(D=h.dark),u.plates&&y===C&&(v+8)%2===0&&(D=h.accent),c.set(A,y,v,D)}}for(let v=-8;v<=6;v++){const S=(v+8)%2===0?2:1;for(let C=1;C<=S;C++)c.set(0,11+C,v,u.spineStyle==="blade"?h.accent:h.dark)}c.box(-4,9,1,-4,10,3,h.dark),c.box(-4,11,2,-4,11,2,h.accent);const _=[[9,8],[10,9],[11,10],[12,11],[13,12]];for(const[v,S]of _)c.box(-2,S,v,2,S+2,v,h.body),c.box(-1,S,v,1,S,v,h.belly),c.set(0,S+3,v,h.dark);const g=14,p=12;c.box(-2,p,g,2,p+3,g+4,h.body),c.box(-2,p+4,g+1,2,p+4,g+3,h.dark),c.box(-2,p,g+5,2,p+2,g+8,h.body),c.box(-2,p-1,g+5,2,p-1,g+8,h.belly);for(const v of[-2,2])c.set(v,p+3,g+3,h.glow),c.set(v,p+3,g+4,h.eyeDark),c.set(v,p+2,g+3,h.eye);c.set(-2,p+2,g+8,h.dark),c.set(2,p+2,g+8,h.dark);for(let v=g+5;v<=g+8;v++){const S=v%2===0?-2:2;c.set(S,p-2,v,h.tooth),c.set(-S,p-1,v,h.tooth)}if(c.set(-2,p-2,g+8,h.tooth),c.set(2,p-2,g+8,h.tooth),c.set(0,p-3,g+8,h.dark),u.horn==="spiky")for(const v of[-2,2])[[0,0],[1,-1],[2,-2],[3,-3],[4,-4]].forEach(([S,C],A)=>c.set(v+(v<0?-Math.floor(A/2):Math.floor(A/2)),p+4+S,g+C,h.accent)),c.set(v+(v<0?-2:2),p+9,g-4,h.wing),c.set(v+(v<0?-1:1),p+7,g-1,h.wing);else if(u.horn==="ears"){for(const v of[-3,3])c.box(v,p+2,g-1,v,p+6,g+2,h.dark),c.set(v,p+7,g+1,h.dark);c.box(-1,p+4,g+3,1,p+6,g+3,h.accent),c.set(0,p+7,g+3,h.accent)}else if(u.horn==="blade"){for(const v of[-1,1])[[0,0],[1,-1],[2,-2],[3,-3],[4,-4],[5,-5],[5,-6]].forEach(([S,C])=>c.set(v,p+4+S,g+C,h.accent));for(const v of[-3,3])c.set(v,p+3,g+1,h.accent),c.set(v,p+4,g,h.accent),c.set(v,p+5,g-1,h.accent)}for(const[v,S]of[[-3,5],[-3,-6]]){c.box(v,1,S,v+1,5,S+1,h.body),u.bulky,c.box(v-1,4,S,v-1,6,S+1,h.body),c.box(v,0,S-1,v+1,0,S+2,h.dark);for(const C of[S-1,S+1,S+3])c.set(v,0,C+(C===S+3,0),h.tooth);c.set(v+1,0,S+3,h.tooth)}if([[-9,6,2],[-10,6,2],[-11,6,1],[-12,7,1],[-13,7,1],[-14,8,1],[-15,9,0],[-16,10,0],[-17,11,0],[-18,12,0]].forEach(([v,S,C],A)=>{c.box(-C,S,v,C,S+(C?1:0),v,h.body),A%2===0&&c.set(0,S+(C?2:1),v,h.dark)}),u.tailTip==="leaf")c.box(-2,12,-19,2,14,-19,h.wing),c.box(-1,15,-19,1,15,-19,h.wing),c.set(0,13,-20,h.wingVein),c.set(0,16,-19,h.wing);else if(u.tailTip==="club")c.box(-2,11,-19,2,14,-21,h.dark),c.set(0,15,-20,h.dark),c.set(-2,12,-22,h.tooth),c.set(2,12,-22,h.tooth);else if(u.tailTip==="blade"){for(let v=0;v<=4;v++)c.set(0,12+v,-19-Math.floor(v/2),h.accent);c.set(0,11,-19,h.accent),c.set(0,13,-21,h.accent)}const M=-3,w=10,b=1;function R(v,S,C,A){for(let L=1;L<=v;L++){const O=w+Math.round(L*S),G=b-Math.round(L*C)-1,W=b+2-(L>v-3?Math.ceil((L-(v-3))/2):0);for(let F=G;F<=W;F++){let Y=h.wing;F===W||F===W-1&&L<=2?Y=h.dark:(F-G)%4===0&&L>1?Y=h.wingVein:L===v&&F===G&&(Y=h.dark),c.set(M-L,O,F,Y)}L<=2&&c.box(M-L,O-1,b,M-L,O-1,b+1,h.dark),L%4===0&&(c.set(M-L,O,G-1,h.dark),c.set(M-L,O-1,G-1,h.tooth))}const y=M-v-1,D=w+Math.round(v*S);A==="claw"&&(c.set(y,D,b+2,h.dark),c.set(y-1,D,b+2,h.tooth),c.set(y,D+1,b+1,h.dark)),A==="spike"&&(c.set(y,D+1,b+1,h.accent),c.set(y-1,D+2,b+1,h.accent),c.set(y-2,D+3,b+1,h.accent))}return u.wing==="leaf"&&R(14,.6,1,"claw"),u.wing==="stub"&&R(9,.5,.8,"claw"),u.wing==="plate"&&R(12,.8,.8,"spike"),c.mirror(),c.list()}function o(u,c){return c==="adult"?i(u):t(u)}const r={wood:{id:"wood",name:"나무 드래곤",tier:1,colorName:"갈색",recipe:"나무 원목 5, 나무 묘목 1~2, 나뭇잎 2",signature:"나무 세우기",beam:"약한 녹색 빔",seed:11,scaleNoise:.25,horn:"spiky",wing:"leaf",tailTip:"leaf",spineStyle:"thorn",bulky:!1,colors:{body:"#8B5A2B",belly:"#C9A066",dark:"#5C3A1A",accent:"#3E2A14",wing:"#5CA83A",wingVein:"#3F7F28",eye:"#D9F25A",eyeDark:"#1F2A0F",tooth:"#F4EFE1"}},earth:{id:"earth",name:"대지 드래곤",tier:2,colorName:"회색",recipe:"흙 2, 돌 2",signature:"흙과 돌 떨어뜨리기",beam:"약한 회색 빔",seed:22,scaleNoise:.4,horn:"ears",wing:"stub",tailTip:"club",spineStyle:"thorn",bulky:!0,armor:!0,colors:{body:"#7F7F7F",belly:"#B0B0B0",dark:"#555555",accent:"#6B4A2B",wing:"#8E8E8E",wingVein:"#6A6A6A",eye:"#F2B84B",eyeDark:"#2A1E0A",tooth:"#F4EFE1"}},iron:{id:"iron",name:"철 드래곤",tier:3,colorName:"은색",recipe:"철 2",signature:"철 블록 날리기",beam:"약간 센 은색 빔",seed:33,scaleNoise:.15,horn:"blade",wing:"plate",tailTip:"blade",spineStyle:"blade",bulky:!1,plates:!0,colors:{body:"#9AA4AD",belly:"#CDD5DB",dark:"#5F6A73",accent:"#3F4A53",wing:"#B7C1C9",wingVein:"#7F8B94",eye:"#57D3F5",eyeDark:"#0D2B36",tooth:"#F7FAFC"}},cake:{id:"cake",name:"케이크 드래곤",tier:4,colorName:"분홍·크림",recipe:"케이크 2",signature:"케이크 던지기",beam:"달콤한 분홍 빔",seed:44,scaleNoise:.2,horn:"ears",wing:"stub",tailTip:"club",spineStyle:"thorn",bulky:!0,colors:{body:"#F4A7C3",belly:"#FFF3E0",dark:"#C9789A",accent:"#8B2E52",wing:"#FFE08A",wingVein:"#D9A93E",eye:"#FF4F79",eyeDark:"#4A1020",tooth:"#FFFFFF"}},gold:{id:"gold",name:"금 드래곤",tier:5,colorName:"금색",recipe:"금 2",signature:"금 블록 소환",beam:"눈부신 금빛 빔",seed:55,scaleNoise:.15,horn:"blade",wing:"plate",tailTip:"blade",spineStyle:"blade",bulky:!1,plates:!0,colors:{body:"#E2B32B",belly:"#FFE27A",dark:"#B8860B",accent:"#8A6508",wing:"#F5D66B",wingVein:"#B8860B",eye:"#FF6F3C",eyeDark:"#3A1A00",tooth:"#FFF8E1"}},diamond:{id:"diamond",name:"다이아몬드 드래곤",tier:6,colorName:"하늘·청록",recipe:"다이아몬드 2",signature:"다이아몬드 창",beam:"반짝이는 청록 빔",seed:77,scaleNoise:.15,horn:"blade",wing:"plate",tailTip:"blade",spineStyle:"blade",bulky:!1,plates:!0,colors:{body:"#5FD3E6",belly:"#C8F7FF",dark:"#2FA3B8",accent:"#1B6C7D",wing:"#9FE9F5",wingVein:"#3FB6CC",eye:"#FFFFFF",eyeDark:"#0B3A44",tooth:"#FFFFFF"}},netherite:{id:"netherite",name:"네더라이트 드래곤",tier:7,colorName:"어두운 갈색·금",recipe:"네더라이트 2",signature:"네더라이트 갑옷",beam:"무거운 검붉은 빔",seed:88,scaleNoise:.3,horn:"blade",wing:"plate",tailTip:"blade",spineStyle:"blade",bulky:!0,armor:!0,plates:!0,colors:{body:"#4A3B3F",belly:"#6B5A5F",dark:"#2C2124",accent:"#B58B5A",wing:"#5A484D",wingVein:"#8A6B4A",eye:"#FF9A3C",eyeDark:"#2A0F00",tooth:"#E8E0DA"}},fire:{id:"fire",name:"화염 드래곤",tier:8,colorName:"빨강·주황",recipe:"용암 양동이 1, 블레이즈 막대기 2, 가스트의 눈물 1",signature:"불 뿜기",beam:"뜨거운 주황 빔",seed:99,scaleNoise:.3,horn:"spiky",wing:"leaf",tailTip:"blade",spineStyle:"thorn",bulky:!1,colors:{body:"#E0562A",belly:"#FFB347",dark:"#A83415",accent:"#FFE04D",wing:"#FF7A2A",wingVein:"#B53A0C",eye:"#FFF176",eyeDark:"#4A1500",tooth:"#FFF3E0"}},ice:{id:"ice",name:"아이스 드래곤",tier:9,colorName:"하늘·하양",recipe:"얼음 2, 눈 블록 2",signature:"얼리기",beam:"차가운 하늘색 빔",seed:111,scaleNoise:.2,horn:"spiky",wing:"plate",tailTip:"blade",spineStyle:"blade",bulky:!1,colors:{body:"#8FD3F4",belly:"#E6F9FF",dark:"#5AA9D6",accent:"#FFFFFF",wing:"#BFEAFF",wingVein:"#7FC4E8",eye:"#1F5FBF",eyeDark:"#0A2A5C",tooth:"#FFFFFF"}},water:{id:"water",name:"워터 드래곤",tier:10,colorName:"파랑",recipe:"물 양동이 1",signature:"물살",beam:"푸른 물 빔",seed:122,scaleNoise:.25,horn:"ears",wing:"leaf",tailTip:"club",spineStyle:"thorn",bulky:!1,colors:{body:"#2F80D6",belly:"#8CC8FF",dark:"#1F5AA0",accent:"#1B3F73",wing:"#5CA9F0",wingVein:"#2F6FB8",eye:"#B3FFF7",eyeDark:"#062B4A",tooth:"#EAF6FF"}},time:{id:"time",name:"타임 드래곤",tier:11,colorName:"청동",recipe:"시계 4",signature:"시간 멈추기",beam:"반짝이는 청동 빔",seed:133,scaleNoise:.2,horn:"ears",wing:"stub",tailTip:"club",spineStyle:"thorn",bulky:!1,colors:{body:"#B08D57",belly:"#E6D3A3",dark:"#7A5C2E",accent:"#3F2E12",wing:"#D4B36A",wingVein:"#8C6D35",eye:"#37E0FF",eyeDark:"#0B2A33",tooth:"#F4EFE1"}},teleport:{id:"teleport",name:"텔레포트 드래곤",tier:12,colorName:"검정·연보라",recipe:"엔더 진주 2",signature:"순간이동",beam:"보라 빔",seed:144,scaleNoise:.3,horn:"spiky",wing:"leaf",tailTip:"blade",spineStyle:"thorn",bulky:!1,colors:{body:"#1A1A22",belly:"#3D2B4F",dark:"#0D0D12",accent:"#9B59FF",wing:"#2B1F3D",wingVein:"#B47CFF",eye:"#D65CFF",eyeDark:"#2A0A4A",tooth:"#EDE7F6"}},healing:{id:"healing",name:"치유 드래곤",tier:13,colorName:"분홍·빨강",recipe:"치유의 물약 6",signature:"치유",beam:"따뜻한 분홍 빔",seed:155,scaleNoise:.15,horn:"ears",wing:"leaf",tailTip:"club",spineStyle:"thorn",bulky:!1,colors:{body:"#F06292",belly:"#FFD6E3",dark:"#C2185B",accent:"#FFFFFF",wing:"#FF9EBE",wingVein:"#D8467A",eye:"#7CFFB2",eyeDark:"#0D3D22",tooth:"#FFFFFF"}},earthquake:{id:"earthquake",name:"어스퀘이크 드래곤",tier:14,colorName:"갈색·주황",recipe:"곡괭이 6종",signature:"지진",beam:"땅을 흔드는 갈색 빔",seed:166,scaleNoise:.4,horn:"ears",wing:"stub",tailTip:"club",spineStyle:"thorn",bulky:!0,armor:!0,colors:{body:"#8D6E4A",belly:"#C9A97A",dark:"#5A4229",accent:"#E08A2E",wing:"#A67C52",wingVein:"#6E4E2E",eye:"#FFB300",eyeDark:"#3A2000",tooth:"#F4EFE1"}},explosion:{id:"explosion",name:"폭발 드래곤",tier:15,colorName:"빨강·검정",recipe:"TNT 2, 위더 스켈레톤 머리 3",signature:"폭발",beam:"터지는 빨간 빔",seed:177,scaleNoise:.35,horn:"spiky",wing:"leaf",tailTip:"blade",spineStyle:"thorn",bulky:!0,colors:{body:"#B71C1C",belly:"#E57373",dark:"#7F0000",accent:"#212121",wing:"#D32F2F",wingVein:"#7F0000",eye:"#FFEB3B",eyeDark:"#3A2A00",tooth:"#F4EFE1"}},ender:{id:"ender",name:"엔더 드래곤",tier:16,colorName:"검정·보라",recipe:"드래곤의 숨결 4, 엔더 드래곤의 알 1",signature:"드래곤의 숨결 뿌리기",beam:"가장 강력한 보라·검정 빔",seed:66,scaleNoise:.35,horn:"blade",wing:"plate",tailTip:"blade",spineStyle:"blade",bulky:!0,armor:!0,plates:!0,colors:{body:"#1E1B24",belly:"#3A2F4A",dark:"#0F0D14",accent:"#5B2E91",wing:"#2A2136",wingVein:"#6D3FB3",eye:"#E040FB",eyeDark:"#3A0F5C",tooth:"#EDE7F6"},_note:"우리 게임의 엔더 드래곤 — 아들 설계(티어 16, 검정·보라 빔, 엔더맨 군대)를 우리 생성기 골격으로 만든 자체 디자인"}};function a(u,c){const h=r[u];return c=c||"baby",{...d(h),stage:c,voxels:o(h,c)}}function l(u){const c=r[u];return{...d(c),baby:o(c,"baby"),adult:o(c,"adult")}}function d(u){const{seed:c,scaleNoise:h,horn:f,wing:_,tailTip:g,spineStyle:p,bulky:m,armor:M,plates:w,colors:b,...R}=u;return{...R,colors:b}}return{DRAGONS:r,build:o,model:a,modelBoth:l,stages:["baby","adult"],ids:Object.keys(r)}});const Go=globalThis.DragonVoxels,Zc=new Map;function jA(s,e){const t=`${s}/${e}`;let n=Zc.get(t);if(!n){const i=Go?.DRAGONS[s]??Go?.DRAGONS.wood;n=Go&&i?Go.build(i,e):[],Zc.set(t,n)}return n}const $c=[{n:[1,0,0],shade:.78,corners:[[1,0,0],[1,1,0],[1,1,1],[1,0,1]]},{n:[-1,0,0],shade:.72,corners:[[0,0,1],[0,1,1],[0,1,0],[0,0,0]]},{n:[0,1,0],shade:1,corners:[[0,1,0],[0,1,1],[1,1,1],[1,1,0]]},{n:[0,-1,0],shade:.5,corners:[[0,0,1],[0,0,0],[1,0,0],[1,0,1]]},{n:[0,0,1],shade:.88,corners:[[0,0,1],[1,0,1],[1,1,1],[0,1,1]]},{n:[0,0,-1],shade:.84,corners:[[1,0,0],[0,0,0],[0,1,0],[1,1,0]]}];function Cs(s,e,t){const n=new Set(s.map(d=>`${d.x},${d.y},${d.z}`)),i=[],o=[],r=[],a=new je;for(const d of s){a.set(d.c);for(let u=0;u<$c.length;u++){const c=$c[u];if(n.has(`${d.x+c.n[0]},${d.y+c.n[1]},${d.z+c.n[2]}`))continue;const h=t?.[u]??c.shade,f=i.length/3;for(const[_,g,p]of c.corners)i.push((d.x+_)*e,(d.y+g)*e,(d.z+p)*e),o.push(a.r*h,a.g*h,a.b*h);r.push(f,f+1,f+2,f,f+2,f+3)}}const l=new rn;return l.setAttribute("position",new Vt(i,3)),l.setAttribute("color",new Vt(o,3)),l.setIndex(r),l.translate(-.5*e,0,-.5*e),l.computeBoundingBox(),l}const JA=1/16,ed=new Map;function wh(s,e){const t=`${s}/${e}`;let n=ed.get(t);return n||(n=Cs(jA(s,e),JA),ed.set(t,n)),n}const Th=new zt({vertexColors:!0});function Ch(s,e){return new dt(wh(s,e),Th)}class ZA{group=new Et;mesh=null;t=0;constructor(e){this.group.visible=!1,e.add(this.group)}get active(){return this.mesh!==null}set(e){this.mesh&&(this.group.remove(this.mesh),this.mesh=null),e&&(this.mesh=Ch(e,"adult"),this.group.add(this.mesh)),this.group.visible=e!==null}update(e,t){this.mesh&&(this.t+=t,this.group.position.set(e.pos.x,e.pos.y-Ud,e.pos.z),this.group.rotation.y=e.yaw+Math.PI,this.mesh.scale.set(1,1+.015*Math.sin(this.t*2.5),1))}}class $A{group=new Et;entries=new Map;t=0;constructor(e){e.add(this.group)}get visible(){return this.group.visible}set visible(e){this.group.visible=e}get count(){return this.entries.size}sync(e){const t=new Set;for(const n of e){t.add(n.id);const i=this.entries.get(n.id);if(i&&i.info.stage===n.stage&&i.info.perch.x===n.perch.x&&i.info.perch.z===n.perch.z&&i.info.owner===n.owner){i.info=n;continue}i&&this.dispose(i),this.entries.set(n.id,this.make(n))}for(const[n,i]of this.entries)t.has(n)||(this.dispose(i),this.entries.delete(n))}make(e){const t=wh(e.dragon,e.stage),n=new dt(t,Th),i=t.boundingBox?t.boundingBox.max.y:1,o=new Et;o.add(n);const r=fr(e.owner,e.mine?"rgba(40,120,40,0.55)":"rgba(0,0,0,0.45)",.28);return r.position.y=i+.25,o.add(r),o.position.set(e.perch.x+.5,e.perch.y,e.perch.z+.5),o.rotation.y=e.yaw,this.group.add(o),{info:e,group:o,mesh:n,label:r,phase:e.id*1.7%(Math.PI*2),height:i}}dispose(e){this.group.remove(e.group),e.label.material.map?.dispose(),e.label.material.dispose()}update(e){if(!(!this.group.visible||this.entries.size===0)){this.t+=e;for(const t of this.entries.values()){const n=this.t+t.phase,i=1+.025*Math.sin(n*1.6);t.mesh.scale.set(1,i,1);const o=Math.max(0,Math.sin(n*.9))**8;t.group.position.y=t.info.perch.y+o*(t.info.stage==="adult"?.12:.08),t.group.rotation.y=t.info.yaw+.18*Math.sin(n*.35)}}}}const e1={leather:9067068,iron:14211288,golden:15911244,diamond:6281448,netherite:4865866,turtle:5212730};function Ho(s,e){const t=au(Dn,s[e]);return t?e1[t.tier]??11579568:null}function t1(s){const e={head:[],torso:[],armL:[],armR:[],legL:[],legR:[]},t=Ho(s,"helmet");if(t!==null){const r=()=>t;e.head.push(...Ft(-5,4,8,8,-5,4,r)),e.head.push(...Ft(-5,-5,0,7,-4,3,r),...Ft(4,4,0,7,-4,3,r)),e.head.push(...Ft(-4,3,0,7,4,4,r)),e.head.push(...Ft(-4,3,7,7,-5,-5,r))}const n=Ho(s,"chestplate");if(n!==null){const r=()=>n;e.torso.push(...Ft(-3,2,1,11,-3,-3,r),...Ft(-3,2,1,11,2,2,r));const a=l=>[...Ft(-2,1,0,0,-2,1,r),...Ft(-2,1,-3,-1,-3,-3,r),...Ft(-2,1,-3,-1,2,2,r),...Ft(l,l,-3,-1,-2,1,r)];e.armL.push(...a(-3)),e.armR.push(...a(2))}const i=Ho(s,"leggings");if(i!==null){const r=()=>i,a=l=>[...Ft(-2,1,-8,-1,-3,-3,r),...Ft(-2,1,-8,-1,2,2,r),...Ft(l,l,-8,-1,-2,1,r)];e.legL.push(...a(-3)),e.legR.push(...a(2))}const o=Ho(s,"boots");if(o!==null){const r=()=>o,a=l=>[...Ft(-2,1,-12,-9,-3,-3,r),...Ft(-2,1,-12,-9,2,2,r),...Ft(l,l,-12,-9,-2,1,r)];e.legL.push(...a(-3)),e.legR.push(...a(2))}return e}function n1(){const s=()=>10514490,e=()=>14211288,t=[];return t.push(...Ft(-4,-4,-9,0,-3,2,(n,i,o)=>i===0||i===-9||o===-3||o===2?e():s())),t}const td=.05,i1=new je(1,.86,.68),nd=new je;function s1(s,e,t){const n=Vd(s)/15*e,i=Gd(s)/15,o=td+(1-td)*Math.pow(Math.max(n,i),1.5);return t.set(16777215).lerp(i1,Math.max(0,Math.min(1,i-n))),o}const Wo=32*xt;function Ci(s,e){const t=Cs(s,xt,_r);return t.translate(xt/2,0,xt/2),new dt(t,e)}function fr(s,e="rgba(0,0,0,0.45)",t=.55){const n=document.createElement("canvas"),i=n.getContext("2d");i.font="bold 40px system-ui, sans-serif";const o=Math.ceil(i.measureText(s).width)+32;n.width=o,n.height=56,i.font="bold 40px system-ui, sans-serif",i.fillStyle=e,i.fillRect(0,0,o,56),i.fillStyle="#fff",i.textBaseline="middle",i.fillText(s,16,30);const r=new Ar(n);r.minFilter=gn;const a=new wl(new Sl({map:r,depthTest:!0,transparent:!0}));return a.scale.set(o/56*t,t,1),a}class o1{group=new Et;figures=new Map;iconOf=null;constructor(e){e.add(this.group)}get count(){return this.figures.size}upsert(e){this.remove(e.idx);const t=Nd(lu(e.color)),n=new zt({vertexColors:!0}),i=new Et,o=new Et,r=(_,g)=>(_.position.set(g[0]*xt,g[1]*xt,0),_),a=r(Ci(t.torso,n),Yi.torso),l=r(Ci(t.head,n),Yi.head),d=r(Ci(t.leg,n),Yi.legL),u=r(Ci(t.leg,n),Yi.legR),c=r(Ci(t.arm,n),Yi.armL),h=r(Ci(t.arm,n),Yi.armR);o.add(a,l,d,u,c,h),i.add(o);const f=fr(e.nick);f.position.y=Wo+.3,i.add(f),i.position.set(e.x,e.y,e.z),o.rotation.y=e.yaw,this.group.add(i),this.figures.set(e.idx,{info:e,group:i,body:o,label:f,torso:a,head:l,legL:d,legR:u,armL:c,armR:h,held:null,armor:[],target:{x:e.x,y:e.y,z:e.z,yaw:e.yaw,pitch:e.pitch,flags:0},cur:{x:e.x,y:e.y,z:e.z,yaw:e.yaw},walk:0,lastMove:0,bubble:null,mount:null,material:n,lum:1}),e.riding&&this.setMount(e.idx,e.riding),e.held&&this.setHeld(e.idx,e.held),e.equip&&this.setEquip(e.idx,e.equip)}setEquip(e,t){const n=this.figures.get(e);if(!n)return;for(const l of n.armor)l.parent?.remove(l),l.geometry.dispose();n.armor=[];const i=ba(Dn,t);n.info.equip=i;const o=t1(i),r=n.torso,a=(l,d)=>{if(!l||d.length===0)return;const u=Ci(d,n.material);l.add(u),n.armor.push(u)};a(n.head,o.head),a(r,o.torso),a(n.armL,o.armL),a(n.armR,o.armR),a(n.legL,o.legL),a(n.legR,o.legR),i.shield&&a(n.armL,n1())}setHeld(e,t){const n=this.figures.get(e);if(!n)return;if(n.held){n.armR.remove(n.held),n.held.geometry.dispose();const a=n.held.material;a.map?.dispose(),a.dispose(),n.held=null}if(n.info.held=t,!t||!this.iconOf)return;const i=this.iconOf(t);if(!i)return;const o=new Ar(i);o.minFilter=gn,o.magFilter=en;const r=new dt(new ws(.42,.42),new zt({map:o,transparent:!0,alphaTest:.2,side:sn}));r.position.set(1.5*xt,-11*xt,-3*xt),r.rotation.set(-.35,.45,0),n.armR.add(r),n.held=r}setMount(e,t){const n=this.figures.get(e);if(n&&(n.mount&&(n.body.remove(n.mount),n.mount=null),t)){const i=Ch(t.dragon,"adult");i.material=n.material,i.position.y=-Ud,i.rotation.y=Math.PI,n.body.add(i),n.mount=i}}say(e,t,n=3){const i=this.figures.get(e);if(!i)return;this.clearBubble(i);const o=fr(t,"rgba(255,255,255,0.92)");o.material.color.setHex(2236979),o.position.y=Wo+.8,i.group.add(o),i.bubble={sprite:o,until:performance.now()+n*1e3}}clearBubble(e){e.bubble&&(e.group.remove(e.bubble.sprite),e.bubble.sprite.material.map?.dispose(),e.bubble.sprite.material.dispose(),e.bubble=null)}remove(e){const t=this.figures.get(e);t&&(this.clearBubble(t),this.setMount(e,null),this.group.remove(t.group),t.material.dispose(),t.group.traverse(n=>{n instanceof dt&&n.geometry.dispose(),n instanceof wl&&(n.material.map?.dispose(),n.material.dispose())}),this.figures.delete(e))}indices(){return[...this.figures.keys()]}nickOf(e){return this.figures.get(e)?.info.nick}setState(e,t){for(const n of e){if(n.idx===t)continue;const i=this.figures.get(n.idx);i&&(i.target.x=n.x,i.target.y=n.y,i.target.z=n.z,i.target.yaw=n.yaw,i.target.pitch=n.pitch,i.target.flags=n.flags)}}update(e,t,n=1){const i=1-Math.exp(-e*14);for(const o of this.figures.values()){const r=o.cur,a=o.target,l=a.x-r.x,d=a.z-r.z;r.x+=l*i,r.y+=(a.y-r.y)*i,r.z+=d*i;let u=a.yaw-r.yaw;u=Math.atan2(Math.sin(u),Math.cos(u)),r.yaw+=u*i,o.group.position.set(r.x,r.y,r.z),o.body.rotation.y=r.yaw,o.head.rotation.x=-a.pitch*.6;const c=Math.hypot(l,d)*14;c>.3&&(o.walk+=e*Math.min(12,c*2.2));const h=(a.flags&Bd)!==0,f=c>.3&&!h?Math.sin(o.walk)*.55:0;o.legL.rotation.x=f,o.legR.rotation.x=-f,o.armL.rotation.x=-f,o.armR.rotation.x=f;const _=(a.flags&Fd)!==0;if(o.body.scale.y=_?.85:1,o.label.position.y=(_?Wo*.85:Wo)+.3,t){const g=s1(t.get(Math.floor(r.x),Math.floor(r.y+1),Math.floor(r.z)),n,nd);o.lum+=(g-o.lum)*i,o.material.color.copy(nd).multiplyScalar(o.lum)}o.bubble&&performance.now()>o.bubble.until&&this.clearBubble(o)}}dispose(){for(const e of[...this.figures.keys()])this.remove(e)}}const Ln={w:.6,h:1.8},id=1.62,r1=1.27,sd=4.317,a1=5.612,l1=1.31,c1=2.2,d1=32,od=9,rd=9,ad=6,ld=.15,h1=.75,Xo=1/60,u1=1,f1=1.3,p1=14,cd=89.5*Math.PI/180;class m1{constructor(e,t,n,i=0){this.world=e,this.registry=t,this.pos={...n},this.spawn={...n},this.yaw=i}world;registry;pos;vel={x:0,y:0,z:0};yaw=0;pitch=0;onGround=!1;sneaking=!1;guarding=!1;guardSlow=.5;sprinting=!1;inWater=!1;riding=!1;eyeHeight=id;walkCycle=0;horizontalSpeed=0;stepCamOffset=0;accumulator=0;moveOut={onGround:!1,hitX:!1,hitY:!1,hitZ:!1,hitCeiling:!1};spawn;isSolid=(e,t,n)=>this.registry.isSolid(this.world.getBlock(e,t,n));isWaterAt(e,t,n){return this.registry.get(this.world.getBlock(Math.floor(e),Math.floor(t),Math.floor(n))).fluid!==null}respawn(){this.pos.x=this.spawn.x,this.pos.y=this.spawn.y,this.pos.z=this.spawn.z,this.vel.x=this.vel.y=this.vel.z=0}applyLook(e,t){this.yaw-=e,this.pitch=Math.max(-cd,Math.min(cd,this.pitch-t)),this.yaw>Math.PI?this.yaw-=Math.PI*2:this.yaw<-Math.PI&&(this.yaw+=Math.PI*2)}get eye(){return{x:this.pos.x,y:this.pos.y+this.eyeHeight,z:this.pos.z}}get lookDir(){const e=Math.cos(this.pitch);return{x:-e*Math.sin(this.yaw),y:Math.sin(this.pitch),z:-e*Math.cos(this.yaw)}}update(e,t){for(this.applyLook(e.lookDX,e.lookDY),this.accumulator=Math.min(this.accumulator+t,Xo*8);this.accumulator>=Xo;)this.step(e,Xo),this.accumulator-=Xo}step(e,t){const n=this.pos,i=this.vel;this.inWater=this.isWaterAt(n.x,n.y+.2,n.z)||this.isWaterAt(n.x,n.y+this.eyeHeight-.1,n.z),this.sneaking=e.sneak&&!this.inWater&&!this.riding,this.guarding=e.guard&&!this.riding,this.sprinting=e.sprint&&e.moveZ>.5&&!this.sneaking;const o=Math.sin(this.yaw),r=Math.cos(this.yaw);let a=r*e.moveX-o*e.moveZ,l=-o*e.moveX-r*e.moveZ;const d=Math.hypot(a,l);d>1&&(a/=d,l/=d);const u=(this.riding?rd:this.inWater?c1:this.sneaking?l1:this.sprinting?a1:sd)*(this.guarding?this.guardSlow:1),c=this.riding?8:this.inWater?6:this.onGround?18:3.5,h=Math.min(1,c*t);let f=0;this.riding&&e.moveZ!==0&&(f=Math.max(0,Math.min(1,(Math.abs(this.pitch)-ld)/(h1-ld)))*Math.sign(this.pitch));const _=1-Math.abs(f)*.6;if(i.x+=(a*u*_-i.x)*h,i.z+=(l*u*_-i.z)*h,this.riding){const A=f*Math.sign(e.moveZ)*rd*.8+(e.jump?ad:e.sneak?-ad:0);i.y+=(A-i.y)*Math.min(1,8*t)}else if(this.inWater)if(e.jump&&this.onGround&&!this.isWaterAt(n.x,n.y+1,n.z))i.y=od,this.onGround=!1;else{const C=(this.moveOut.hitX||this.moveOut.hitZ)&&(e.moveX!==0||e.moveZ!==0),A=e.jump||C?4:-2.2;i.y+=(A-i.y)*Math.min(1,6*t)}else i.y-=d1*t,i.y<-78&&(i.y=-78),e.jump&&this.onGround&&(i.y=od,this.onGround=!1);const g=this.onGround,p=n.x,m=n.y,M=n.z,w=i.x,b=i.z;if(Zo(this.isSolid,n,Ln,i,t,this.moveOut),this.onGround=this.moveOut.onGround,!this.riding&&!this.sneaking&&(g||this.inWater)&&(this.moveOut.hitX||this.moveOut.hitZ)){const C=mf(this.isSolid,{x:p,y:m,z:M},n,Ln,w,b,t,this.inWater?f1:u1);C&&(i.x=C.vx,i.z=C.vz,i.y=0,this.onGround=!0,this.stepCamOffset-=C.dy)}if(this.stepCamOffset+=(0-this.stepCamOffset)*Math.min(1,p1*t),Math.abs(this.stepCamOffset)<.002&&(this.stepCamOffset=0),this.sneaking&&g&&!Lr(this.isSolid,n,Ln)){const C=n.x;n.x=p,Lr(this.isSolid,n,Ln)||(n.x=C,n.z=M,Lr(this.isSolid,n,Ln)||(n.x=p)),i.x=i.z=0,this.onGround=!0}const R=Ln.w/2+.001;n.x<R?(n.x=R,i.x=0):n.x>this.world.sizeX-R&&(n.x=this.world.sizeX-R,i.x=0),n.z<R?(n.z=R,i.z=0):n.z>this.world.sizeZ-R&&(n.z=this.world.sizeZ-R,i.z=0),n.y<-24&&this.respawn();const v=this.sneaking?r1:id;this.eyeHeight+=(v-this.eyeHeight)*Math.min(1,22*t);const S=Math.hypot(i.x,i.z);this.horizontalSpeed=S,this.onGround&&S>.4&&(this.walkCycle+=S*t*1.9)}applyToCamera(e,t){const n=this.eye,o=(this.onGround&&this.horizontalSpeed>.4?Math.min(1,this.horizontalSpeed/sd):0)*t;e.position.set(n.x,n.y+this.stepCamOffset-Math.abs(Math.cos(this.walkCycle))*.045*o,n.z),e.rotation.order="YXZ",e.rotation.set(this.pitch,this.yaw,Math.sin(this.walkCycle)*.006*o)}}const pr=new je(8103167),ul=new je(12638463),dd=.05,g1=`
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
  float lum = ${dd.toFixed(2)} + ${(1-dd).toFixed(2)} * pow(l, 1.5);
  vec3 warm = mix(vec3(1.0), vec3(1.0, 0.86, 0.68), clamp(blk - sky, 0.0, 1.0));
  vLight = lum * warm;

  vUvw = vec3(uv, meta.x);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`,_1=`
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
`;function v1(s){const e=(r,a={})=>new Gn({glslVersion:cr,vertexShader:g1,fragmentShader:_1,uniforms:{uTex:{value:s},uFogColor:{value:ul.clone()},uFogNear:{value:60},uFogFar:{value:120},uSkyLight:{value:1},uCutout:{value:r},uTime:{value:0}},...a}),t=e(1,{side:ei}),n=e(0,{transparent:!0,depthWrite:!1,side:sn}),i=e(1);i.uniforms.uFogNear.value=1e5,i.uniforms.uFogFar.value=1e6;const o=[t,n,i];return{opaque:t,translucent:n,hand:i,setFog(r,a){t.uniforms.uFogNear.value=r,t.uniforms.uFogFar.value=a,n.uniforms.uFogNear.value=r,n.uniforms.uFogFar.value=a},setTime(r){for(const a of o)a.uniforms.uTime.value=r},setSkyLight(r){for(const a of o)a.uniforms.uSkyLight.value=r},dispose(){for(const r of o)r.dispose()}}}function Rh(s,e,t){const n=new rn;return n.setAttribute("position",new Qt(s.positions,3)),n.setAttribute("uv",new Qt(s.uvs,2)),n.setAttribute("meta",new Qt(s.meta,4)),n.setIndex(new Qt(s.indices,1)),n.boundingSphere=new xr(t,e),n}class x1{constructor(e,t,n,i,o){this.world=e,this.lights=t,this.materials=n,this.pool=i,o.add(this.group)}world;lights;materials;pool;group=new Et;stats={meshed:0,lastMs:0,avgMs:0,maxMs:0,visibleChunks:0};renderDistance=8;maxPerFrame=2;burst=!0;entries=new Map;dirty=new Map;boundingRadius=Math.sqrt(3)*Tt/2+.5;paddedScratch=null;get queued(){return this.dirty.size}get inflight(){return this.pool.inflight}markDirty(e,t,n){this.world.chunkInBounds(e,t,n)&&this.dirty.set(Jo(e,t,n),{cx:e,cy:t,cz:n})}markDirtyAll(e){for(const t of e)this.markDirty(t.cx,t.cy,t.cz)}markAll(){this.world.forEachChunk(e=>this.markDirty(e.cx,e.cy,e.cz))}update(e,t,n){const i=Math.floor(e/Tt),o=Math.floor(t/Tt),r=Math.floor(n/Tt);if(this.dirty.size>0){const l=this.burst?24:this.maxPerFrame,d=[...this.dirty.values()];d.length>1&&d.sort((c,h)=>{const f=(c.cx-i)**2+(c.cz-r)**2+(c.cy-o)**2,_=(h.cx-i)**2+(h.cz-r)**2+(h.cy-o)**2;return f-_});let u=0;for(const c of d){if(u>=l||this.pool.inflight>=this.pool.size*3)break;this.dirty.delete(Jo(c.cx,c.cy,c.cz)),this.dispatch(c)&&u++}}else this.burst&&this.pool.inflight===0&&(this.burst=!1);let a=0;for(const l of this.entries.values()){const d=Math.abs(l.cx-i),u=Math.abs(l.cz-r),c=Math.max(d,u)<=this.renderDistance;l.opaque&&(l.opaque.visible=c),l.translucent&&(l.translucent.visible=c),c&&(l.opaque||l.translucent)&&a++}this.stats.visibleChunks=a}entry(e){const t=Jo(e.cx,e.cy,e.cz);let n=this.entries.get(t);return n||(n={cx:e.cx,cy:e.cy,cz:e.cz,opaque:null,translucent:null,inflight:!1,redo:!1},this.entries.set(t,n)),n}dispatch(e){const t=this.entry(e),n=this.world.getChunk(e.cx,e.cy,e.cz);if(!n||n.isEmpty())return this.removeMesh(t,"opaque"),this.removeMesh(t,"translucent"),!1;if(t.inflight)return t.redo=!0,!1;t.inflight=!0;const i=n.version,o=this.world.buildPadded(e.cx,e.cy,e.cz,this.paddedScratch??void 0);this.paddedScratch=null;const r=this.lights.buildPaddedLight(e.cx,e.cy,e.cz);return this.pool.mesh(e.cx,e.cy,e.cz,o,r).then(a=>{t.inflight=!1,this.apply(t,a),(t.redo||n.version!==i)&&(t.redo=!1,this.markDirty(e.cx,e.cy,e.cz))},a=>{t.inflight=!1,console.error("메싱 실패",e,a)}),!0}apply(e,t){const n=this.stats;n.meshed++,n.lastMs=t.ms,n.avgMs=n.avgMs===0?t.ms:n.avgMs*.9+t.ms*.1,n.maxMs=Math.max(n.maxMs,t.ms);const i=new H(Tt/2,Tt/2,Tt/2);for(const o of["opaque","translucent"]){const r=t.result[o];if(!r){this.removeMesh(e,o);continue}const a=Rh(r,this.boundingRadius,i);let l=e[o];l?(l.geometry.dispose(),l.geometry=a):(l=new dt(a,o==="opaque"?this.materials.opaque:this.materials.translucent),l.position.set(e.cx*Tt,e.cy*Tt,e.cz*Tt),l.matrixAutoUpdate=!1,l.updateMatrix(),l.renderOrder=o==="opaque"?0:10,e[o]=l,this.group.add(l))}}removeMesh(e,t){const n=e[t];n&&(this.group.remove(n),n.geometry.dispose(),e[t]=null)}dispose(){for(const e of this.entries.values())this.removeMesh(e,"opaque"),this.removeMesh(e,"translucent");this.entries.clear(),this.dirty.clear()}}const st=Tt,hd=3/16,us=1/16,ud=10/16,fd=25*Math.PI/180,A1=7/16,pd=7/16,b1=3/16,Yo=[[3,0,1],[2,1,8],[3,8,12],[4,12,14],[5,14,15],[6,15,16]],md=[[0,0,-1],[0,0,1],[1,0,0],[1,0,0],[1,0,0],[-1,0,0]],gd=[[0,1,0],[0,1,0],[0,0,1],[0,0,1],[0,1,0],[0,1,0]],y1=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],M1=[[0,1,0],[1,-1,0],[4,0,1],[5,0,-1]];class _d{positions;uvs;meta;indices;vc=0;ic=0;constructor(e=512){this.positions=new Float32Array(e*4*3),this.uvs=new Float32Array(e*4*2),this.meta=new Uint8Array(e*4*4),this.indices=new Uint32Array(e*6)}ensure(){if((this.vc+4)*3<=this.positions.length)return;const e=t=>{const n=new t.constructor(t.length*2);return n.set(t),n};this.positions=e(this.positions),this.uvs=e(this.uvs),this.meta=e(this.meta),this.indices=e(this.indices)}quad(e,t,n){this.ensure();const i=this.vc;for(let a=0;a<4;a++){const l=e[a],d=(i+a)*3;this.positions[d]=l[0],this.positions[d+1]=l[1],this.positions[d+2]=l[2];const u=(i+a)*2;this.uvs[u]=l[3],this.uvs[u+1]=l[4];const c=(i+a)*4;this.meta[c]=t,this.meta[c+1]=l[5],this.meta[c+2]=n,this.meta[c+3]=l[6]??gs}const o=e[0][5]+e[2][5]>e[1][5]+e[3][5],r=this.ic;o?(this.indices[r]=i+1,this.indices[r+1]=i+2,this.indices[r+2]=i+3,this.indices[r+3]=i+1,this.indices[r+4]=i+3,this.indices[r+5]=i):(this.indices[r]=i,this.indices[r+1]=i+1,this.indices[r+2]=i+2,this.indices[r+3]=i,this.indices[r+4]=i+2,this.indices[r+5]=i+3),this.vc+=4,this.ic+=6}build(){return this.vc===0?null:{positions:this.positions.slice(0,this.vc*3),uvs:this.uvs.slice(0,this.vc*2),meta:this.meta.slice(0,this.vc*4),indices:this.indices.slice(0,this.ic),vertexCount:this.vc,indexCount:this.ic}}}function E1(s,e,t){const n=new _d,i=new _d,o=new Int32Array(st*st),r=new Int32Array(st*st),a=new Int32Array(st*st),l=new Int32Array(st*st),d=[0,0,0],u=[0,0,0];let c=gs;const h=(v,S,C,A,y,D)=>{u[0]=d[0],u[1]=d[1],u[2]=d[2],u[v]+=S,fn(u[0],u[1],u[2]);const L=u[C],O=u[y];u[C]=L+A;const G=fn(u[0],u[1],u[2]);u[C]=L,u[y]=O+D;const W=fn(u[0],u[1],u[2]);u[C]=L+A;const F=fn(u[0],u[1],u[2]),Y=e[s[G]],B=e[s[W]],se=e[s[F]],de=Y!==void 0&&Y.castAO,xe=B!==void 0&&B.castAO,Oe=se!==void 0&&se.castAO;return c=gs,de&&xe?0:3-((de?1:0)+(xe?1:0)+(Oe?1:0))},f=(v,S,C)=>gs,_=(v,S,C)=>{const A=e[C];return A?!(A.opaque||S===C&&v.sameCull||v.layer===Xs&&A.layer===Xs&&A.fluidKind===0):!0},g=(v,S,C,A,y,D)=>{const[L,O,G]=C,[W,F,Y]=A;let B;switch(S){case 0:B=[[W,O,G],[W,O,Y],[W,F,Y],[W,F,G]];break;case 1:B=[[L,O,G],[L,O,Y],[L,F,Y],[L,F,G]];break;case 2:B=[[L,F,G],[W,F,G],[W,F,Y],[L,F,Y]];break;case 3:B=[[L,O,G],[W,O,G],[W,O,Y],[L,O,Y]];break;case 4:B=[[L,O,Y],[W,O,Y],[W,F,Y],[L,F,Y]];break;default:B=[[L,O,G],[W,O,G],[W,F,G],[L,F,G]]}const se=y1[S],de=[B[1][0]-B[0][0],B[1][1]-B[0][1],B[1][2]-B[0][2]],xe=[B[3][0]-B[0][0],B[3][1]-B[0][1],B[3][2]-B[0][2]],Oe=[de[1]*xe[2]-de[2]*xe[1],de[2]*xe[0]-de[0]*xe[2],de[0]*xe[1]-de[1]*xe[0]];Oe[0]*se[0]+Oe[1]*se[1]+Oe[2]*se[2]<0&&(B=[B[0],B[3],B[2],B[1]]);const Me=md[S],Z=gd[S],Pe=B.map(K=>[K[0],K[1],K[2],K[0]*Me[0]+K[1]*Me[1]+K[2]*Me[2],K[0]*Z[0]+K[1]*Z[1]+K[2]*Z[2],3,D]);v.quad(Pe,y,S)},p=(v,S,C,A,y,D,L,O)=>g(v,S,[C,A+D,y],[C+1,A+L,y+1],O,f()),m=()=>{for(let v=0;v<st;v++)for(let S=0;S<st;S++)for(let C=0;C<st;C++){const A=e[s[fn(C,v,S)]];if(A===void 0||A.panel===null)continue;const[y,D]=A.panel,L=[C,v,S],O=[C+1,v+1,S+1];D===0?O[y]=L[y]+hd:L[y]=O[y]-hd;const G=f();for(let W=0;W<6;W++)g(n,W,L,O,A.tex[W],G)}},M=()=>{for(let v=0;v<st;v++)for(let S=0;S<st;S++)for(let C=0;C<st;C++){const A=e[s[fn(C,v,S)]];if(A===void 0||A.torch===null)continue;const y=f(),D=A.tex[0];if(A.torch<0){const $=[C+.5-us,v,S+.5-us],oe=[C+.5+us,v+ud,S+.5+us];for(let pe=0;pe<6;pe++)g(n,pe,$,oe,D,y);continue}const[L,O]=Id[A.torch],G=Math.sin(fd),W=Math.cos(fd),F=[-L*G,W,-O*G],Y=[O,0,-L],B=[L*W,G,O*W],se=C+.5+L*pd,de=v+b1,xe=S+.5+O*pd,Oe=($,oe,pe)=>[se+Y[0]*$+F[0]*oe+B[0]*pe,de+Y[1]*$+F[1]*oe+B[1]*pe,xe+Y[2]*$+F[2]*oe+B[2]*pe],Me=$=>A1+($+us),Z=us,Pe=ud,K=($,oe,pe)=>{let he=$.map((we,Se)=>{const ot=Oe(we[0],we[1],we[2]);return[ot[0],ot[1],ot[2],oe[Se][0],oe[Se][1]]});const Ie=[he[1][0]-he[0][0],he[1][1]-he[0][1],he[1][2]-he[0][2]],_t=[he[3][0]-he[0][0],he[3][1]-he[0][1],he[3][2]-he[0][2]],P=[Ie[1]*_t[2]-Ie[2]*_t[1],Ie[2]*_t[0]-Ie[0]*_t[2],Ie[0]*_t[1]-Ie[1]*_t[0]];P[0]*pe[0]+P[1]*pe[1]+P[2]*pe[2]<0&&(he=[he[0],he[3],he[2],he[1]]);const ut=Math.abs(pe[0])>=Math.abs(pe[1])&&Math.abs(pe[0])>=Math.abs(pe[2])?0:Math.abs(pe[1])>=Math.abs(pe[2])?1:2,I=ut===0?pe[0]>0?0:1:ut===1?pe[1]>0?2:3:pe[2]>0?4:5;n.quad(he.map(we=>[we[0],we[1],we[2],we[3],we[4],3,y]),D,I)};K([[Z,0,-Z],[Z,0,Z],[Z,Pe,Z],[Z,Pe,-Z]],[[Me(-Z),0],[Me(Z),0],[Me(Z),Pe],[Me(-Z),Pe]],Y),K([[-Z,0,-Z],[-Z,0,Z],[-Z,Pe,Z],[-Z,Pe,-Z]],[[Me(-Z),0],[Me(Z),0],[Me(Z),Pe],[Me(-Z),Pe]],[-Y[0],-0,-Y[2]]),K([[-Z,0,Z],[Z,0,Z],[Z,Pe,Z],[-Z,Pe,Z]],[[Me(-Z),0],[Me(Z),0],[Me(Z),Pe],[Me(-Z),Pe]],B),K([[-Z,0,-Z],[Z,0,-Z],[Z,Pe,-Z],[-Z,Pe,-Z]],[[Me(-Z),0],[Me(Z),0],[Me(Z),Pe],[Me(-Z),Pe]],[-B[0],-B[1],-B[2]]),K([[-Z,Pe,-Z],[Z,Pe,-Z],[Z,Pe,Z],[-Z,Pe,Z]],[[Me(-Z),Me(-Z)],[Me(Z),Me(-Z)],[Me(Z),Me(Z)],[Me(-Z),Me(Z)]],F),K([[-Z,0,-Z],[Z,0,-Z],[Z,0,Z],[-Z,0,Z]],[[Me(-Z),Me(-Z)],[Me(Z),Me(-Z)],[Me(Z),Me(Z)],[Me(-Z),Me(Z)]],[-F[0],-F[1],-F[2]])}},w=()=>{for(let v=0;v<st;v++)for(let S=0;S<st;S++)for(let C=0;C<st;C++){const A=e[s[fn(C,v,S)]];if(A===void 0||!A.egg)continue;const y=f();for(let D=0;D<Yo.length;D++){const[L,O,G]=Yo[D],W=Yo[D-1],F=Yo[D+1],Y=[C+L/16,v+O/16,S+L/16],B=[C+1-L/16,v+G/16,S+1-L/16];for(const se of[0,1,4,5])g(n,se,Y,B,A.tex[se],y);(!F||F[0]>L)&&g(n,2,Y,B,A.tex[2],y),(!W||W[0]>L)&&g(n,3,Y,B,A.tex[3],y)}}},b=()=>{for(let v=0;v<st;v++)for(let S=0;S<st;S++)for(let C=0;C<st;C++){const A=e[s[fn(C,v,S)]];if(A===void 0||A.fluidKind===0)continue;const y=A.fluidHeight,D=A.fluidKind,L=A.layer===Xs?i:n,O=(F,Y,B)=>e[s[fn(C+F,v+Y,S+B)]],G=O(0,1,0);(G===void 0||G.fluidKind!==D)&&p(L,2,C,v,S,0,y,A.tex[2]);const W=O(0,-1,0);(W===void 0||!(W.opaque||W.fluidKind===D))&&p(L,3,C,v,S,0,y,A.tex[3]);for(const[F,Y,B]of M1){const se=O(Y,0,B);let de=0;if(se!==void 0){if(se.opaque)continue;if(se.fluidKind===D){if(se.fluidHeight>=y-1e-6)continue;de=se.fluidHeight}}p(L,F,C,v,S,de,y,A.tex[F])}}},R=(v,S,C,A,y,D,L,O)=>{const G=md[D],W=gd[D];for(let F=0;F<st;F++)for(let Y=0;Y<st;){const B=v[F*st+Y];if(B===0){Y++;continue}const se=S[F*st+Y];let de=1;for(;Y+de<st&&v[F*st+Y+de]===B&&S[F*st+Y+de]===se;)de++;let xe=1;e:for(;F+xe<st;xe++)for(let oe=0;oe<de;oe++){const pe=(F+xe)*st+Y+oe;if(v[pe]!==B||S[pe]!==se)break e}const Oe=B>>>8,Me=B&255,Z=e[Oe],Pe=Z.tex[D],K=[];for(let oe=0;oe<4;oe++){const pe=oe===1||oe===2?1:0,he=oe===2||oe===3?1:0,Ie=[0,0,0];Ie[C]=L,Ie[A]=F+pe*xe,Ie[y]=Y+he*de;const _t=Ie[0]*G[0]+Ie[1]*G[1]+Ie[2]*G[2],P=Ie[0]*W[0]+Ie[1]*W[1]+Ie[2]*W[2];K.push([Ie[0],Ie[1],Ie[2],_t,P,Me>>oe*2&3,se>>>oe*8&255])}const $=O?K:[K[0],K[3],K[2],K[1]];(Z.layer===Xs?i:n).quad($,Pe,D);for(let oe=0;oe<xe;oe++)for(let pe=0;pe<de;pe++){const he=(F+oe)*st+Y+pe;v[he]=0,S[he]=0}Y+=de}};for(let v=0;v<3;v++){const S=(v+1)%3,C=(v+2)%3,A=v*2,y=v*2+1;for(let D=0;D<st;D++){let L=0;for(let O=0;O<st;O++)for(let G=0;G<st;G++,L++){d[v]=D,d[S]=O,d[C]=G;const W=s[fn(d[0],d[1],d[2])],F=e[W];let Y=0,B=0,se=0,de=0;if(F!==void 0&&F.layer!==Sh&&F.fluidKind===0&&F.panel===null&&F.torch===null&&!F.egg){d[v]=D+1;const xe=s[fn(d[0],d[1],d[2])];if(d[v]=D,_(F,W,xe)){const Me=h(v,1,S,-1,C,-1),Z=c,Pe=h(v,1,S,1,C,-1),K=c,$=h(v,1,S,1,C,1),oe=c,pe=h(v,1,S,-1,C,1),he=c;Y=W<<8|Me|Pe<<2|$<<4|pe<<6,se=Z|K<<8|oe<<16|he<<24}d[v]=D-1;const Oe=s[fn(d[0],d[1],d[2])];if(d[v]=D,_(F,W,Oe)){const Me=h(v,-1,S,-1,C,-1),Z=c,Pe=h(v,-1,S,1,C,-1),K=c,$=h(v,-1,S,1,C,1),oe=c,pe=h(v,-1,S,-1,C,1),he=c;B=W<<8|Me|Pe<<2|$<<4|pe<<6,de=Z|K<<8|oe<<16|he<<24}}o[L]=Y,r[L]=B,a[L]=se,l[L]=de}R(o,a,v,S,C,A,D+1,!0),R(r,l,v,S,C,y,D,!1)}}return b(),m(),M(),w(),{opaque:n.build(),translucent:i.build()}}const S1=.24,w1=.85,T1=-.7,ma=-1.25,C1=.34,vd=.3,xd=.6,qo=.9/16,R1=[.78,.7,1,.5,.86,.94];function k1(s){const e=s.getContext("2d");if(!e)return[];const t=s.width,n=s.height,i=e.getImageData(0,0,t,n).data,o=[];for(let r=0;r<16;r++)for(let a=0;a<16;a++){const l=Math.min(t-1,Math.floor((a+.5)*t/16)),u=(Math.min(n-1,Math.floor((r+.5)*n/16))*t+l)*4;i[u+3]<128||o.push({x:a,y:15-r,z:0,c:`#${(i[u]<<16|i[u+1]<<8|i[u+2]).toString(16).padStart(6,"0")}`})}return o}class D1{constructor(e,t){this.materials=e,this.blockInfo=t,this.scene.add(this.anchor),this.anchor.add(this.pivot),this.pivot.position.set(0,0,ma),this.pivot.rotation.set(vd,xd,0)}materials;blockInfo;scene=new ph;anchor=new Et;pivot=new Et;mesh=null;swingT=1;draw=0;currentBlock=-1;currentItem=null;clearMesh(){this.mesh&&(this.pivot.remove(this.mesh),this.mesh.geometry.dispose(),this.currentItem&&this.mesh.material.dispose(),this.mesh=null)}setItem(e,t){if(e===this.currentItem&&this.currentBlock<=0||(this.clearMesh(),this.currentBlock=0,this.currentItem=e,!e||!t))return;const n=k1(t);if(n.length===0)return;const i=Cs(n,qo,R1);i.translate(-8*qo,-8*qo,-.5*qo),this.mesh=new dt(i,new zt({vertexColors:!0}));const o=/_sword$/.test(e),r=!o&&(/_(pickaxe|axe|shovel|hoe)$/.test(e)||e==="shears"||e==="flint_and_steel");o?(this.mesh.rotation.set(-.3,-.6,.35),this.mesh.position.set(-.55,.3,.1),this.mesh.scale.setScalar(1.3)):r?(this.mesh.rotation.set(.25,-.45,2.35),this.mesh.position.set(-.45,.4,.12),this.mesh.scale.setScalar(1.5)):(this.mesh.rotation.set(0,-xd*.7,.15),this.mesh.position.set(-.05,.05,0)),this.mesh.frustumCulled=!1,this.pivot.add(this.mesh)}setBlock(e){if(e===this.currentBlock&&!this.currentItem||(this.clearMesh(),this.currentItem=null,this.currentBlock=e,e<=0))return;const t=new Uint16Array(Pd);t[fn(0,0,0)]=e;const n=E1(t,this.blockInfo),i=n.opaque??n.translucent;if(!i)return;const o=Rh(i,1,new H(.5,.5,.5));o.translate(-.5,-.5,-.5),this.mesh=new dt(o,n.opaque?this.materials.hand:this.materials.translucent),this.mesh.scale.setScalar(C1),this.mesh.frustumCulled=!1,this.pivot.add(this.mesh)}setDraw(e){this.draw=Math.max(0,Math.min(1,e))}swing(){(this.swingT>=1||this.swingT>.5)&&(this.swingT=0)}update(e,t,n,i){this.anchor.position.copy(t.position),this.anchor.quaternion.copy(t.quaternion);const o=Math.tan(pg.degToRad(t.fov/2))*-ma,r=o*t.aspect,a=w1*r,l=T1*o;let d=0,u=0,c=0;if(d+=Math.sin(n)*.02*i,u+=-Math.abs(Math.cos(n))*.025*i,this.swingT<1){this.swingT=Math.min(1,this.swingT+e/S1);const h=Math.sin(this.swingT*Math.PI);u-=h*.28,d-=h*.12,c-=h*1.1}d-=this.draw*.08,u+=this.draw*.05,c+=this.draw*.35,this.pivot.position.set(a+d,l+u,ma+this.draw*.12),this.pivot.rotation.x=vd+c}render(e,t){this.mesh&&(e.clearDepth(),e.render(this.scene,t))}dispose(){this.clearMesh()}}function L1(s,e=!1){const t=s[0].index!==null,n=new Set(Object.keys(s[0].attributes)),i=new Set(Object.keys(s[0].morphAttributes)),o={},r={},a=s[0].morphTargetsRelative,l=new rn;let d=0;for(let u=0;u<s.length;++u){const c=s[u];let h=0;if(t!==(c.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in c.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;o[f]===void 0&&(o[f]=[]),o[f].push(c.attributes[f]),h++}if(h!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(a!==c.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in c.morphAttributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;r[f]===void 0&&(r[f]=[]),r[f].push(c.morphAttributes[f])}if(e){let f;if(t)f=c.index.count;else if(c.attributes.position!==void 0)f=c.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;l.addGroup(d,f,u),d+=f}}if(t){let u=0;const c=[];for(let h=0;h<s.length;++h){const f=s[h].index;for(let _=0;_<f.count;++_)c.push(f.getX(_)+u);u+=s[h].attributes.position.count}l.setIndex(c)}for(const u in o){const c=Ad(o[u]);if(!c)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;l.setAttribute(u,c)}for(const u in r){const c=r[u][0].length;if(c===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[u]=[];for(let h=0;h<c;++h){const f=[];for(let g=0;g<r[u].length;++g)f.push(r[u][g][h]);const _=Ad(f);if(!_)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;l.morphAttributes[u].push(_)}}return l}function Ad(s){let e,t,n,i=-1,o=0;for(let d=0;d<s.length;++d){const u=s[d];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=u.gpuType),i!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;o+=u.count*t}const r=new e(o),a=new Qt(r,t,n);let l=0;for(let d=0;d<s.length;++d){const u=s[d];if(u.isInterleavedBufferAttribute){const c=l/t;for(let h=0,f=u.count;h<f;h++)for(let _=0;_<t;_++){const g=u.getComponent(h,_);a.setComponent(h+c,_,g)}}else r.set(u.array,l);l+=u.count*t}return i!==void 0&&(a.gpuType=i),a}const mr=10,P1=.02;function I1(){const s=cu(51116),e=[],t=new Set,n=(r,a)=>{r=Math.max(0,Math.min(15,r)),a=Math.max(0,Math.min(15,a));const l=a*16+r;t.has(l)||(t.add(l),e.push([r,a]))};for(let r=0;r<14;r++){let a=6+Math.floor(s()*4),l=6+Math.floor(s()*4);const d=s()<.5?-1:1,u=s()<.5?-1:1;for(let c=0;c<12;c++)n(a,l),s()<.55?a+=d:l+=u,s()<.15&&n(a+(s()<.5?1:-1),l)}const i=e.length,o=[];for(let r=0;r<mr;r++){const a=document.createElement("canvas");a.width=a.height=16;const l=a.getContext("2d");l.clearRect(0,0,16,16);const d=Math.floor(i*(r+1)/mr);for(let c=0;c<d;c++){const[h,f]=e[c],_=.55+.35*(c/i);l.fillStyle=`rgba(15,15,15,${_.toFixed(2)})`,l.fillRect(h,f,1,1)}const u=new Ar(a);u.magFilter=en,u.minFilter=en,u.colorSpace=mn,o.push(u)}return o}function U1(s,e){const t=s/2,n=[],i=(a,l,d,u,c,h)=>{const f=new Un(a,l,d);f.translate(u,c,h),n.push(f)},o=s+e;for(const a of[-t,t])for(const l of[-t,t])i(o,e,e,0,a,l),i(e,o,e,a,0,l),i(e,e,o,a,l,0);const r=L1(n,!1);for(const a of n)a.dispose();return r}class N1{outline;crack;crackMat;crackTextures;stage=-1;constructor(e){this.outline=new dt(U1(1.004,P1),new zt({color:0,transparent:!0,opacity:.45,depthWrite:!1})),this.outline.renderOrder=5,this.outline.visible=!1,e.add(this.outline),this.crackTextures=I1(),this.crackMat=new zt({map:this.crackTextures[0],transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),this.crack=new dt(new Un(1.002,1.002,1.002),this.crackMat),this.crack.renderOrder=4,this.crack.visible=!1,e.add(this.crack)}setTarget(e,t,n){this.outline.visible=!0,this.outline.position.set(e+.5,t+.5,n+.5),this.crack.position.copy(this.outline.position)}clearTarget(){this.outline.visible=!1,this.crack.visible=!1}setProgress(e){if(e<=0||!this.outline.visible){this.crack.visible=!1,this.stage=-1;return}const t=Math.min(mr-1,Math.floor(e*mr));t!==this.stage&&(this.stage=t,this.crackMat.map=this.crackTextures[t],this.crackMat.needsUpdate=!0),this.crack.visible=!0}dispose(){this.outline.geometry.dispose(),this.outline.material.dispose(),this.crack.geometry.dispose(),this.crackMat.dispose();for(const e of this.crackTextures)e.dispose()}}class B1{constructor(e,t,n=9060348){this.scene=e,this.material=new zt({color:n,transparent:!0,opacity:.55,side:sn,depthWrite:!1}),this.mesh=new dt(new ws(2,3),this.material),this.mesh.position.set(t.x,t.y+2.5,t.z+.5),this.mesh.renderOrder=5,e.add(this.mesh)}scene;mesh;material;update(e){this.material.opacity=.45+.15*Math.sin(e*2.2);const t=.72+.03*Math.sin(e*.9);this.material.color.setHSL(t,.85,.6)}dispose(){this.scene.remove(this.mesh),this.mesh.geometry.dispose(),this.material.dispose()}}class F1{mesh;material;constructor(e){this.material=new Gn({glslVersion:cr,side:$t,depthWrite:!1,depthTest:!1,uniforms:{uZenith:{value:new je(5210088)},uHorizon:{value:pr.clone()},uFog:{value:ul.clone()},uVoid:{value:new je(2832988)},uSunDir:{value:new H(.45,.72,.3).normalize()}},vertexShader:`
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
      `}),this.mesh=new dt(new kl(1,24,12),this.material),this.mesh.scale.setScalar(400),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-100,e.add(this.mesh)}update(e){this.mesh.position.copy(e)}setBrightness(e){const t=this.material.uniforms,n=1-e;t.uZenith.value.setHex(5210088).multiplyScalar(e).lerp(new je(660016),n*.6),t.uHorizon.value.copy(pr).multiplyScalar(e).lerp(new je(1317946),n*.6),t.uFog.value.copy(ul).multiplyScalar(Math.max(.35,e)),t.uVoid.value.setHex(2832988).multiplyScalar(e),this.material.uniforms.uSunDir.value.set(.45,.72*(.3+.7*e)-.2*n,.3).normalize()}dispose(){this.mesh.geometry.dispose(),this.material.dispose()}}const O1="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAChUlEQVR42kWSV3PaUBCF9VvyEjuxKSqoXXUkkGihdwMGgxuBics4zo8/mV2G5OHM3pHmfFul53qIiV3AY+bjxlMxEgqmXglDIbOOrQjvvRSHZoiPYQ11+RJZ4StqxQv0zCKkw48YIzMHAj3VAjatEoF5aLKeUhdLV2EQvRexgLj4wqL/0m1k4r7q4thOsG9GGNhFrCsu5oHBb8q6r/l47VRwFxloqd9xE1mY+DpXI5HxLraxTQR2FQdjR+UWJq6GtnaFt26VWyAAtdG3ZC5/Gpxg0ibUsQ40bMsmx9d2gk1QwueogX3moW/m0dWvMRIyJo6Kh6qDG0fGS6fCko7NiEs8NELOdutrbPw9rOHYDLGKBQZWAT0jx4D7isDS13BoRgySVq6CP+MGmz+Hdaw8hUWQQyPAXephWbYx80rolK6wiQzM7ALH53oA6aUd42c94AF9DGr4GGR471axjQyuoqV8wyKyuIWpq2GX2NzGXBRPLWyS/2sZGDke2K9WmWE0H5r4yFHRt4qYeDpuHAVzgtkFPKQupGVoYCJk7DIfff2ajQR4rArsYusffOrraOs5LFwVm7KJ21A/AdaxjbFdxNDMM4jaocwkqoYyD4WCZSzQ0XOcmYZIcR0ZkBaBjlVkYuaq2KYeD5Mg58yzwEDXyGPsagw6f3/pVrGvh5CmroqJo6CnX2Ob+nwPtCLS0lPZTKWfjW3tO29mZMvYZj6kTcXFfS3AWMgcH1OXIeeDaWlXGAgFDfmS30OriEVoYJ0ILCMT0i4LQBAC9I0cA54yD2+9FO/9jE00QBJvITAwFgo2VZff0jzQMbQKDFgnDpsoM+15Heqo0937Ojp6/gRyNb5IilTJXzsd2hofgxXhAAAAAElFTkSuQmCC",z1="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAxUlEQVR42u1SyQ3CQAx0JbynCkpIAZRDKfwh6+xuQqAlHnRgZGksWTzZL49RLB8zHmelAXYFbAPsCVgBbGf8AKwDtgJ2A2xJ8B6fFS+836+f4CTSBwh8S9HRDZR+fJM7ve706QpzyjuUX79ZdYLGps5kT4eKWFlrJK2M/eBSqRgq69efWCgwp+sXwntlTcwLk4EYji03ipRkSXY2bywoBytzGYWbFr6ROd6BpiOG78a4sjlqYVOZk9PxYCOQy3myEfwJJvsAjIFrcP/cvEwAAAAASUVORK5CYII=",V1="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACKUlEQVR42jWT51JqUQxG9/sAShGkSBPpTXovglSpMo6AgwxPnjsrd/zB5JzNzpeVLzkmHo+L0+mUfr+v8f7+Xp6ensRms4nP55Nisaj/BYNBeX19lcFgIIVCQcLhsHg8HjHtdltCoZAQ+XH57e1NvF6vRCIRCQQCkkqlpNPpyHK5lPF4rO+xWEx6vZ6Y4XCohyRzmYvlclnq9boKNBoNeX5+VqpcLqfn+/1eFouFHA6H/wKPj4+afHd3p7FSqcjLy4v4/X5JJBL6fDwelaBUKsnHx4e43W4VMev1Wr6/v6XVamlvoCGSz+el2WzqpXQ6LbVaTVwulxJQAEHaNJlMRjG/vr4UkWokUpmYTCa1RapyRtJ0OhXyIDIoYUa1WpXz+SwQORwOFYIIMvqH5OHhQSNnp9NJaUw2m1XnV6uVTgOHwe12u2K32zV5MpkoHUS0s9lsZDQaCf4Z1BgbeNvtVj3AdYQxETLmjzgG8sxuQPP+/i6GRUKd0eAD7bBAiCFssVh0if4WDfe5QwEEDcm73U6u16uaAwGYs9lM24EMCnxBhMiUGD0Gq4kkg/b7+yvRaFR7phI+QMBFDLVarZpMUVpi3Q3o7DVzJxkzaQEaNhIa5g7JHx2C5ECpAjyQfLvd1GlWlBkza6gul4vi8x+FECAPcgPSz8+PKrIszB8hnObC5+enbh2jg4JECBHBI0MvLBCfKYjz+Vxd56NinLxDwz5Aw1YiwsdH/AcfgvkbkXGX1AAAAABJRU5ErkJggg==",G1="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB20lEQVR42o3SzU4aURQH8Ps4bBprmVoXdNNUJTpfDPOBjaum1CqWNm1apTYjHyOC4KpBLRGpOqCMYF+jT8Jr/JtzEhqmsGBxknvvOf/fvcmMCKpJdD0Vg5oFNx3DQ92GX5TRO0rg/tjEXVnH7xMHfklGv2ah4yl8dk+5QxWCGr1KggMEdEoKgxSmAcKCioHbss77Qd3idf/Y5JwIqgbrJHqZF3g4sTn8J4jxIAX8ksL9Qd3G3vIpX0YvpVeLzxvPEEQiXMPhkAdoTQDtqUb73Ovn3B+df1yXIH4V1JmBdl4JATdeAuLGM2YGropaCGjuxyF+5lZmBigwDrTcNYiMLc0M7DhSCMimFiC6ZR13RwZ6lSQirwKujqehX7PRPdS5rosyaM4vqSE0qJoQV/m1fy8YAVTXBRmxeoxr1Pe9KQDdNg2g4f8BCowDt+UExHsnOhXIpqQJ4ENKCgGfNhYhznPxqcBZLj4BtAtaCPjx5SXE2dhnHAcaX5cmgJarhIB2XoNo7C7h8kDlQPP7Kk73VnCZ17haByouXBkXrgL65c+/xXm2ub/K68buMsSWFcVb4zF2nAW8M59g25bwRnuEzeQ8Ms5TZNcXsWnMY8uMIq3Pgea3LQnpxByf/wVkjXV/2HuxXAAAAABJRU5ErkJggg==",H1="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA5ElEQVR42u2Pu4qDYBCF/zdTUKKoRSxE8Q0sveP9ihfIg+UhUqfeepuzzIBbLCwLS1IEMnBg+OfMd+YX4pn1efNB+jfgdLJAeiHA9XbHX4Cfnu+6n8849BvAv3zg0BvwSEBRFJjnGeu6ous6eJ4HSZKQZRmCIIBhGDBNE6qqgrx933MvyzL7RVmWqKqKB9u2oa5ruK4LRVGgaRrP2rZlM/VpmrLXtm0sywJBjweEtO87p9IltERqmgZxHLOSJEEURbAsiy8XZKTFcRw5fZomHui6zsZhGBCGIScTjL6R5zmHOo6DL77IJcHVaQZsAAAAAElFTkSuQmCC",W1="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABQklEQVR42qXSR1IDQQyFYZ+EJZick8k5noCTkHOGOzf1TdVrmCp2Xshya6Rfr6XudM8GSj/W8bP1MFlWr0fK3stsWbsZLcefS+XwfaHsPE03tnI1XE6+lht/+t0rG3fjZf127BegSGD7caocfSw2Z0mAYL3LbgP0f/91rhy8zTfACkCmIh2YghgYCDUAu88zbQXkL18MNUmb9xNVIs8o0pGnUEyzFmDpfLAxhc7ppChwZzmuAFIB6BLSRTElYjrqxsB5swCqAB2YQklmwAdAka6GCmAWrSFKlsiy0hRmjWDZjMH69u8ao0IsCpyzQuoyhwqQhOoaWRtPpgKqMlSds40K8DGPBSSK/r5M8bxG1lLgnhKZbhIzB4kpBlJMoetWQJL4vPs8JjEKxRRlS9bcesquYDgSsxFQMclyMrycK6Af+wF7td4ljUgE9gAAAABJRU5ErkJggg==",X1="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABtUlEQVR42l2TZ1ICURCE3wn8AQUIywLmU2GRQW5gznoWKYFlSYcxZz3F6DcwYPHj1b7d6enuCeta+Yjc76Xk9SQnX5cb8na6Ip1iQu/vZ6v6fNj3pF2Iyc/1lnxfbcrjQVqeDn0JKklxYdVTgo/zNSV5PspIWPPk5TirZBAAHtR9TSQOIdhWPiquX/MUaMkk3hZiSsrd1FrbUfm8WNfvd7tJxbaLcXG9SlJt8REwT0i5c3BGKRBACBZBngi54c7cEoFMfElLoF7rA6qAiYFDhG/0RR0YGIAdFCA2gsWYOdUe8EKd1nUcoASQWjk4pQTErLywmhI3amZnSiRAwHhIshHiYDQl4J2+IKglDBvzAKwkDRr+zKZ1vl9Pqyuw9q1bXhYX/JsCqgSZr4GIcUcNcpsC95t8RBzM2McSDSIwbubUkTWNBGaOdWsiuG4pIS4oT5RtkRa7vTgdwyHKFrthw1ertgs4GTezM2WbjhGC5VAW/dNFMgd8hIgeACYR27joFOP6bqMGq3tAE1GBlSkQGE1JIbH17ZQmfyh7wKHpAVOwP88WhiCurOM2GUaLO+64Iqf3t0i/euJVJP6LFFwAAAAASUVORK5CYII=",Y1="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACM0lEQVR42qWRW1NSURTH+QQ9NNNLPWTOUKgczjlyh/DyCXrSZhomKxE1UeIeIMhlKJ1xJjIyMx3KG4hCXBRiqnenL/Vv1mo89FQPPux91v7vtX7/tddR9d+8jqssFW1Frx7b8zq8nxnAh9khHIVs2F2U8fmFAVtzWtaLS3osT6ix65Gx45FYVwDhB7dRmNZgz2/GUdiGTfcgJ33xGVGK2LHjkbEfMKMUtqPg0iD3WMSnBbEHOAxaUfQacBC0sGtuSuSY9O3nOi4iGGkE+zgvsP5XB31YfSqzAyVlnQL2/CZcXPxCKpXhtumZpFFMOQrg1o1rWH8ygA23iNjkIDbcOryblbA+pUGlcsqAN8+0WHOqseUxYtWpRt4lID8tgGpV/5rwJeC/f6EeNaCbcaAZN6GdtPG5k7IrgEbMyPqP3BjOE1a+o1gBnAYlnCUsqIZkfM+OMuCtS1AAJwER7RUbCnMyumkHjn0CapHhHqARNeLnq3GeQytuZuCa8y67UWE1JHFBM2ZkZwKQmQLIu0R00qMo+yWcpxz8PQ7IOPQKqL004bXzHuvfMmMoByQ+Zx/29wDNZdufS7+ERtyKr1Ezzlcc2FwwoZ0aQTc7jvTkHb6rhIZxlrzPsQK4JFPh/uIQ6nELDpa0DExN9KHsF1GLmrgrMmsl7TgJ6XsASqRWya0eszCombBxTG70ROog90jNha2EnUEKgJJoBiWfyDEVdtIjyhxo5WeoQxPHBKpGjD3AVdZv/A4FcAD3pJwAAAAASUVORK5CYII=",q1="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACP0lEQVR42qWQ61MSYRTG/Rv62McmuwjpcluX20Jo9S/oOFMzOU2TUJqmAgISsMCidJk+OFOT2Sg65cgkIhqBgIDd/6anOcfa7bsfzr7vnPOc3/O823Ph/DmcpXro83FOxPa8iPVH/SjFZKz5DXj/8BrX1owFOyEJ7/x9KIbtfK5O9GEtYNQB6h0DsrcNKEwJPNwJkdCArWkzNiYHkBy9hGLIjtWJq1DGrvByfnxAB5w6GJAc7cVu1IUPszZsz4mchGCfIk5sPjadpgsYeZYYuagD8uMCR12+24/ESC+KYQdKMTenodipscvYnDZxjyCk3ZgSdEAtLuJrzovfL2/hMGLm8zjtQv3pIH48G8b6jMRVjVrxbdmHbtaDasyqA0jUTDl4SLDv+SH8fH6D6yTnRUtxopG0s6aretDNynzXAMeKk5dOVA8DjhISPkct6GRl/HpxE+2MmwGtlIOdCUqmGoCE/8QEIgCB6Dm0TK5fFm2chFLRnXQaoJGQuLly38iLhVkHJyBXciQxGRSe2LlPRgTTAKWgCZ2cD6WggN15AYexQZTDFu5VFqzY5/sQDqIiqosSXt0zoqHIOmB/wYJKxIpqXOKlVsaLo5QbzbSM134zWhkP6kknzzqqD+WwmU00AIkbihvdpWFeqiWc2AuZ0Fav8xLNqnE73k6KaKs+TasByiEzukt/I8YlvtcSDoZR7yBiQyVi4xRUe0ETmmnPfz9RkTk2PYXotFxPurDyQGAnWn4TsHCfiuJTQg1wlvoD59QmUQMoblEAAAAASUVORK5CYII=",K1="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABsElEQVR42k3TWVKCQQwE4DmGBSqcTwFZRfZdcUG4cawvVVPlQ8iQpdPpmb+MRqOYTCbB93q9+Pz8jNVqFe/v7/Hx8RHn8znP/PV6jcPhkPHL5ZLnonE6ncbr62u8vLzEer2Or6+vjNXC39/fjG+32/Tip9MpActsNot+v58Aw+EwNptNsjgejzGfz+P7+zsNENvtdgmwWCwSsDw/P0en08nmwWCQCSDoVSCMrABQrtlsxsPDQ9zd3UWxL7oaNKNIk8fHx2i323F/fx/L5TJB2M/PTzQajcwBLX4ENEBUDEAjIyANsNnv97lCq9XKdQwvilBiGBCy6oGNhtvtlgDANdmdWaOYWpEJajoAuyrSUAGc6UAXOayLRsVAmClidSJQgFZlVYuqS6lXpRCqZp5YvLUqO03EJrqh+ooHIWk6wXgUFWNhqjM9NDmrA5wivr29JRV//j8QoM48IM1MTI9ag0p99zyqGChUZD1mutsx/enpKVeoN1b+06wT62sUAwSg3lS328282wJe0KBypalQsl4hgLqvOt8N4MooASSJWa9UzH9+PB5nzHcCGAMxwED+AE3kZHy1bKoMAAAAAElFTkSuQmCC",Q1="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB4UlEQVR42jWTZRLCQAyF92a4uw9XQIq3uDuHfsyXmf1RCrvJswS33+/1er10v991OByUy+WUz+eVyWQ0m800nU5VKBRUrVaVTqftrlQqqd1u63w+y3FZLBZVq9XU7XaVTCYVi8UMgMJsNmvvZrOpSqVijdRDVC6X5Y7Hoz6fjwHE43GFYaj5fK4oijQYDKzJg/R6PVPT6XQMEEL3fr+FDYpoXiwWWi6XJn+1WhlYKpXSer3WZrMxu5Ciol6vy7VaLfNHM42j0ciYJ5OJAWCJYjKiebfb6fl82sOZ2263Jg8GQGD2IcKMBZoajYYej4exn04n3W43XS4XOVDwjz+K8EdQqAIIC9iCCN+AYIWJAeSQRRMj+X6/FijfUUWQKKKBcTJGpKPWK3GMAik08uaBBVXkgHzYYeQMa4THb9sDQvr9fnaAHQAYD6w0AsCDFSaFKkh98I4Pwur3+yYLiaTOOVOgAQCYAUQ+WfCG1BbJB8TDWPHvpTIFCAAFDGVYoZmxOz5g4BIALpGYSCQsNHKAgA30S8Ya45+AHVtImrByQSFex+OxhsOhvYMgMBWQwIx/QFFvfyZksgN+tpyBTiM5IJ8mGlBLPWOF3OGJ5Anver3aulJMIwBePupQwTTIhxoW7g+s+zDX4AYuzgAAAABJRU5ErkJggg==",j1="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACa0lEQVR42lVTWU8aYRSdX2PamFSl0gqiabGxlJ0ZsOBSmxqLKIhbfRFhNoai777YIrtV+5OaPvSPnOZcHBIfbr6ZL3PPPcsdRf+6gMoXH+y9ILTgBPT8IpziEqzCG6SDE7AKizB3FuTMLj/H5cEynOJb1LbnsRqahFLbDsApLeF8y4+18AtUtvyP5RPARjEIIx8QkFxoEs3yOzRKQbn/FJ2C0qqG0TXj6Bhx7KZn8LMaxtBR0TZiKKRn0NEjuG2kcPddw9H6HG6dFHpWDF0jisO111CuKyFpbusxrAafoWsl0LOSuKlFsJvxoG/F0TNj6BgR7GdnBejhIiMA5dwslI4Zx/XZe/yofBAAMpA6D+N4wy8N/Pjq6upJ/b5cwenm/IhBW4/i+iyEv//+SA0dDZRGSZz+q6HCNM0ndd9Mo5ydhdKzEuLBoK6OATqPnhS0aaFLAOreVz24v0hjYCfEC3qisLlfT4kHYwYNTUB31CkBuGtq0kAAvhOAdfo5AIVmdYyYaHYBumYCN7WoSKDWh4u0SHEBeCeAH19CGdRTQpfRuQA3ehStagSlrFdiFMqNEQMayua+HUdpxQNl4KgynVPZTDMph/fl3CsM60lpcj2QvXBSEuvJhg8K42MD03AZtGoRYZFXpyRGUuY+EMDdg4fLDIpkwAj7dkqiO1r3yTP1U9JexoO2HhYGTIIA7VpYWPBOUuCknp0U6vtZr0gZSCrR8R5wKpu+bfqFCcGG9QQOcl53kWJCmwwIwHee+ccYOY1GFldGgPSF93uZaSh9OymOs0iZQGzmP3G4NjfeRJ7HGz50jYhsIQGYwn/FrmC+c8IzXAAAAABJRU5ErkJggg==",J1="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACNUlEQVR42pWSyVJTURCGz1P4CC5VUONNABcuVMhwb+7NnFSMhaJSJSZQEQOZyERGyBYlEEPmUfABf6s7Q7kMi670f/r8X5/uXNHJyuidWjEs2dFMm9HPq+jlrRhXnKybKRNGJTui2wa0sxbOb1ImDIs2DkHmQdGGccXBoFbajMmZk4F03i9oGBQ1JHY20MqYZ2cqn7czFohJxclJM21iQDsrc+dx2cGGTk5GN6cg/nGdXzcoaHy3k1MwKtshDgNr2HM9xVfnKgwPHywVh4F17Ht12Pe+gKB5iExEKlL37mws0rSjUXk63hwwr0cCEsRwthRaGhWp0MpY+NmsadaszHfmAMqp4dF7PUQvr3IHMlGRNM1OYNK0XOrYODEuAGSmfye9+woi5HmOA5+EsF+/9A7C7wwIup+xR0wqDgyLGm7PpyOMyzYMClZ0c9MXTcp29PNWjEq2BaB3St+OgruqC+Jv1c2Gu6qbi7fnLoxKGv6cORZA0v8DqEbmYUGFICOZ6CVzej+vYFhUWY+KGno5mUFzADWcVOwMFkfbGzj+8BJhv3SP72ANBz4dh6ifWHAZ28JV3Lg0oBbbwmV0E420AkFGSm7SCi4ibxhWT1pwlTDhV3QTF5HXaKQU1r9TMn4EDGhlVVwnzaxFPWkGRS1mxHXCxJcJSAbqUosbORopmYHf/RLnzayKn8dvIYJeCV9sKwh59Qh6JLDWVvDNIyHk02PPrcNn9Qnf2bE+4vqubZV/P6mP8Q/a0iedKWTMOAAAAABJRU5ErkJggg==",Z1="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABD0lEQVR42qXRV1KDMQwE4ByRY9D7+XKQ0NMgELiCmc8za2z+xzzIRdKuVtLsaD4vh9jMcb59Lnffm3L58Vqudm/l5mtV7/59un4sJ6uHmsN38f7yRwB8/7Otd0AAZ5un6gf0B2b8chsBh0BA2BFJYv7sdr9uKqkeWuireCMCYPyxqBgIUjlzSN+RG0XIkKfY0ML157JJ9JYAdLxc1DcSN/IongxRABhJBsoXNf2WJltgkqmRkOFlC1HpRjIoiOTIRpTKvR8hoJgijUCfkZf1RXYfM6MMdNiChKwLc/6SJXpHNvOnuhEA6e2/SUrlEOQWnwwxew8gJNpQxED5+YYWAAQzTEH/tJE4EhZljeAQ+wU3pxxrczn9YAAAAABJRU5ErkJggg==",$1="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABzElEQVR42k2SuUoEQRCG+x3FjdRARRCc2fs+Zu/7eigDZUE01EAFQRYUEQMx2l++ghKDZrqr6j+qakK73Vaz2VShUFCSJMrn80qn0yKeyWQ0Ho8t3mq1NJlM7M0XzHq9VqhWq8rlclbU7/eVzWYNHMexyuWy3S+009HLo4bDoZbLpXq9nlarleWMABDKEKAEWaPRMAK+57sf7V1farFYmCoxwNPpVAErlUrFijudjhFQAAnx0Wik+XxulgE5uNvtGmHgUqvVrA0c0HepVDJCXAEEBLGT0AKkfK0FHxIgyCjEdupuo9TtxggQohbbg8HADnMIgEiijiLzYIAnH1udfX/adiBFDSLqcIF9Wg71et2YUYWAIlooFovWDmCPIUYd6rimjcCD9ZDgkADIv+BrhAwRxGiVO87IB6wBclbUKOQwWAdBzp167k4eSGKTL05IsD6S2KZP8ihyfJi44gQUfbfsnCJa8J27ZV8rBLjgTW1gqlgDTDGsURQZiRfxjiTt31z9tUccQiNAyYfEIQGYdR4+P+jg6V6nX29GRA4Rhkxr4f+AfGVOSPHx+6tiyebBUPlPAPtaw2w2s+FxAKFKkhYgAoAycYYLiduH6BfsHX2OvyqTWAAAAABJRU5ErkJggg==",eb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABvklEQVR42k3TWVNVQQwE4Pk58ARFlYjsLmyyXRBREREui+zPgAIKKG6oKP93rC9WLB5ScybT6e5k5pSfWxP15HlP/fCyP8L+0/LD+n6hrx4/6474ujZSr948jvNf25P1/NVg3ZzorB9fP6jlemcqCmwOn3TWg9k79d38vYizxYEoVugb2ZfV4SC/XHlUf+9O1wKgWOH+bG8cUvi+MVaP5u7Wb+ujoYqEmD2hz82hfw4wsY0NiYNckclzQ1mOE/uLpftBViSoifXRjiDDTPXH5ngUaRER7G6jOxyYCfcFANvN/kzYTHt7jZ4gVfz2aVcQK4KFaw63R0uFEiv6trKaASivJfMwRE7cWroq2G3M4s9eI0IB+0iAiMCcvugNHFJtchMOWGHRoaAkb835AGc4IxwtsGaqWBUblG/K5gHEjSv2rZAzRP8J2APO9+D6APIqEZiH7+ZQWwzcudp4B6aLLZ9tPmGEivMdwNkT1Aa3xeQxAyvihP3bgzUfOATak8srLpKuRYILe9aR5BUiQpDPmqA24hqxKRLbk10BRqRnBfokgCxxSFI4ZuDV5d+XKoiRWBf6WwJMWYvOFwdag/wvxBgmgSkewCoAAAAASUVORK5CYII=",tb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABdUlEQVR42qWTyVICMRCGeRAfwyMnTx4wiLKN+/IquBBUoLTc1yqpYQaEGS9a7utztfU36TDgHKzy0KTDn3zp9J9JjI+O0MvxHMfnxTLd7+Xp63KFvq9WKagWqFFK8f+PBw6vwfh8NEtvpwuEvQn8POwXeTIc7kaawroTqwFiATgVo68VdbTiEfP2VpYaaxO9XCtqaUVNoymV7QNQsgDcCCCsObYCgAOtGIR5Mjn2+wpdrSg0VWDe3JykbrXAeWDAoknVDLjbzfU2mBO6ZpGvp7iKKCCIA8hkONADr5yJ1Z4OZwYBryfzXAm6ixzW3Wzn+Aro0cf5El8VuuQWIJ4OBxxw19OxGg6xADyQaA/EhetSygI8rThEez9b7AOEJk3yzCKUH7XRi2gDL1Ga6JrHIl63K1nq7ORtBZ2INuCClBOahyRWYbO8xKbRBIAmWwA+nLhG+eUMtSrTf7MRFuJeEEBHVUGtSLd1h79A6OgVcmiw0gL+Ez92GiA6laiT0wAAAABJRU5ErkJggg==",nb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVR42mPwMJH5TwlmABF7ZkSRrPHQvASEATunhoM5X3/9+f/ozSc4hinGJg6zlAHZNGRFyAZgEz+6MBnTC6QYsG9WDMKAvTOjSTYAxQvkBCLMUrIDcceUMIQBB+bEkeyFw/MTEQbAQpQUA2CWgg04ODeeZANgelDCgOyUCApRUEyA/HVkQdL/3dMjwfG8oiPg/+quYLDi/bNjwQG3a1oEmA2iUQIRpAGkEGQYKExATlzXG/p/XV8Y2FCQK0EGgywBYZRYACkGaQQpACkEmQ4ybGVHwP9VXUFg14EMBVkEkocZBjdgWpkDWRikFwBh6nG6mkGYKgAAAABJRU5ErkJggg==",ib="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACzUlEQVR42iWS2XbiVhBF9Zi2kQQaEMZ4aLtNY2wMiEFIQmKWAQO2PLs76X7JS5J/zGfkd3aWqh9qnVq36p46p+5Vlqc/GdqPhGYq2FbndPNLhqUHOvot6dnfjI0PiSzvF9aMD19ITr8R2Pcoy88/iOxHRs4zs8oHk+NnXG1B11jSt9ZEhRf+e/+Xx+o/JKUfDJ0HolKKb22Zn7yjzI4+6OkrFiffpbGlTokPH+iZS0aVlEX5D9LqX0yL34iNV8aVJ4bllLB0z+zkFSVyUqZHbyJbpJd3NHIjQeu3YybFd4mx/cb27E86hURUZrXw4B5lVH4hLj0zqbwxMHbEzjOr85/0tDXJ6e+4akJcfsIz7ohKj3j2mvgoFYWD4h1KdPBIN79ifvqBb+/wjA1DJxU7yefvjI+eZbGZ5Kic0tTGdK1brvdjQcW3t7haQt9YSwxLqUwdmBsy8rY2x7PWuPqCm9xEiMPDDf7BmoYao0SHKYGzpZmb0dyfiLeWOmd2+ipnPWtJS5/JTrK8oUUMDlb0igk3eoxS1wI6xTm13IArPcQvbnD1hG5hSSd/K959a8Oo/CTk85M3ecbMaldfolxqPh1nKtKa1oigtMXNL/CdDYNiZmuF72wFA2cnakNnx/T4Rf6L0jBC6rrPVd7nq9rHNRZ0zYTh4U7yjDjb+o06EcwGZNt38wlxJUWpqj2ujYCrgk/DDOmYc8LKlrYx5Wo/ol9cSXjOmqB0J3+krc8YOHcySLnWhrTNKS1zIljLebTsEdf5gJYV0zRjWtaIGzMSq1k9U3WpetKjfN3zZDnZAutqQDXX/dWge3zZ68jFlh2LvZrm0SzG1PMDrgoBZ5/a2Sv4MsV1JmR5TetRL3ic77k0rJCLXIea1hfSi1yXqtqlWYy4yLmSK9nES/0X4/knlxs7pJbvcb7XomEHou7a9OU8i7rh8SXXlvrZXpP/Aai/mcmoOHeuAAAAAElFTkSuQmCC",sb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABwUlEQVR42k2T2XbiQAxE+9vykD+eTBJCvIGN990GDMkkP6I5VyAfHnTUW5WqS93O27xIsH2VyHuXMo2kLRMpDqE0RazzuS/lNNaaf6+z7Px3icMPSfeeZLEvLom2epDJzt/oeGgynUN0PfXSVYkscyt9fVAgGCNyAPbBRvIkWIOKkBAAxzZbVXibP0oCeCU47D61GgGozvcydYUChiZVkq/zoJnqwfavFHecMxB5bHOV3lUHZa+ynaoD1JSJxuXY6v55qtUnh2QWOAwB8hijDCXsP5q2zI18L6Pm01iJQwZAu9Pz07OGVUYuZLbe16lMbS5jk8n11N0UmGyIAKHAVJlHdRGr86wf+3IlcoAwi4MG4m4QcwXGZjDX+D4Paiw42qsm5omvD8h8gJ31y9zKcahWcsggoEN05HLsxJ2nRgk4aBWtlbc23h4V+4whoPK/ZZSfyyQONqpaRgkkZtqjeUb6+zVrJhz3QiLZTKRi5L2paVQ1+agIP1816E7KX4AZICS0EbBlSJa7D6YMEAR5Et4IqGz3fHw4vAMqQzDf28Z/yOJA/I8X3edfOA4DpAP2KiFDkT1zSDBbVUbb++cLtdB/a9NSJwf7IrIAAAAASUVORK5CYII=",ob="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABJUlEQVR42qXSSVZCMRCFYZbjClQUFR2wDEEBuwW5IMEGRLcUzpdzbjRjBvWSl9z6q0kNjl4n5RAb+FxsluX657kM3+/K6XpWzj/ndXV2uX0oo69F3Tv3P9491X0HuPp+rJfs+O22igBZgPa0VvoGQD/7uK9GLGIysDJgdwl2spr+ATigAhAQ2hMy9/5vfl/qnjNoA7jgKAoH6YuevjjPGp3/BkhtHAD0QCSZMAFElEV605XgkEWUdFM7mACcwJ37b4B0naN9nNKsPG+eNdk2ABFLE0VPzYTg/+eBtpuDpJZmphd5Mqt7ugwSbQOgpTGZOE7STv2ZFYDoOkCeL+lG6C59sGYSu2fMm3MGykSyQJ0Hkgy7HqgpNRICZhYynRkw+66EQ2wPLItP+i1ConcAAAAASUVORK5CYII=",rb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABx0lEQVR42j2TuU4DQRBE5zPAyMYfhQROSMBIIK/vY33f9/E/ZAgJYmICLJEgESHxAY1eod5gNDtd3VXVPbOh0WhYv9+3brdrfC+XS63tdmuDwUDf8/ncptOptdtt5c1mM2GdTsdCrVZTwmQyUYAkEnq9npLARqORCDjX63Vhw+HQFouFBVQphpkgOwtlCkiCmPNqtdI3ZLiWA5JhZI/jWCCqFHCGHBKceYwzC4EAEyCtALJwghrWOaME3mw2rVQqWavVsmKxaOVy2QIB751kQBz4NyrsuGQVCgWrVCqqIScAUkwARp/weDxOWqINYtVqVcrkUsc5MFW35KpYhYA+aYM20+83dv79YNnff+tRFCk3+NBY3jdq9Ay5z+H06dLSH7dyhACuucHgKpvNxg6Hg5Jpg2J2VFip15yc+M2AswcmvtvtbL1eK8Cg6NGTUeT6OLOD4RaH5IoAy07CtyuAsfwVEvdXCqEIAGgBVoI+debBIHlgZ2/Xlvm6V9/gfkPMIiEgiD3mgKorqf/nK0u95JK5+KvVDAjASgAFivxGwBwHQyT7E1n6mLeTxwsRBQpxwQEn+/1exez+YHy4XFvmmLfM513yi/8Ba651cdcejQwAAAAASUVORK5CYII=",ab="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACH0lEQVR42k1RSXLbMBDEzZa4LwIILiBFSZZkyXaqcuB38qIkjpM4juw8Lqf8olM9hqp0mBoOgF6mqV7chJOb8MVNeHITfrkJP/38x014vTh7unjH899ugnpzEz79+ysDD5/9xXffXzzo5O/4/egxnNWTHz5fAM6Pv7pJzt88Ie++eQfEUFCdLmz+8I9P/uHrBdGjX+Ncz55U5dGAobmHLbdIQ4ci6dGYHfLYSe+bOyTzFmnQYeU+QOcrjO4BbbVHVayhWnMLVx+FgN0Ua2RRJwQ6H9GaPcbuAba8QRY6AeVxjzTsUCQDFIGsRu+FgCAqk6RMB5hi44k3qBdbIaCDeN6IG1Umo1zGsxadPSCe1VIk6pujKHf2FkN7L0VlVx+k816VaY8kqJGGNVq7FWaTr8TF0N5BZ2vJgUIUWWQD8rhDGjUgVsVzi+BKI4tbIcoiJ0CGRBWuxgyyqJeqzQY6H1AkTjDqXdXCFON7z1dirUyXQkR1y90ZYtQjvDawei09DiwUrdB+kTpxQgLuyISX3T266iAkBLNHMyNrtNVWSFRjbgTIgS5qvUaRdqjNGnFQYdk9wNmjD9DB1Xv07UFIwusKKg0bCYXgqlxhkfUIrhbQeY9obrAZPiKPB+lcJQ1bUU+CRn61IiMdMEBdLBHONMrMSc/iRlSpTgL+EdfcSoDnNVRnd+IgmlVij0BWtRgRXmsJT4D2iFrvRJkYgrnKf4SBd1yXkk+ZAAAAAElFTkSuQmCC",lb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkElEQVR42kVTaVMaURDcH6+JotwqoGhEkcMziYjIcu3FtbCLUblvVwSp/IZOzRCTD6/YKl739HT3ExTVBa3kRbm6i4q+B1lxo9s/xXPzEP3hGZ6bR8gVHEimNmA+7uNB3IJadKNmBKBoLggElhQn6uYBytU9/pZVNx7ETciqBz8TazDMAKq1PdRNP+4fNjEcn+H1LY73xTWEyWsMo8kZKroP6YwNpfIuFM2NYnkXg1EYiuZBIvkFj0/BfwR0nwiG4zCE0SQCve5HWtyEmCV5HowmUf7tDU7R7h4z2X1qAzXDh9vEGvR6AFMrhvE0AkGv+5ggm7fz/rLiQrcfgjW7RK5gZxVEaM0uUNH9ELN21Ix9FMs70Gt+CNYsvjJE9UDM2pCXHJhacSbJS3Z0eiE+BcmB27s1tDonMBoBiNlt1I0AhPnHNbSSB/mCA63OMSsh6bQagSTFxdPIbPLGMP1Mks5sYf5xRSZGQCQ0uTcIs/sEHo4jTESyFdWN/vCUiRLJdTbTfAxiakUhkJuz+SXykhOjSQyZ3DZUzYOpdc5xSbITk9c4H1KQzmwjcbfOBIvlzcoDUlGq7GA4jkLVvLw7mUl9oAQ+1dAaqbSNy1St+fD2frFSsPz9A2bjgPenLlCZKAEqEilTizscq6y6WEUy9RVG44CVC8RE0ylOml6Q6ZIXBcmJwSjChyrd7YfZI/pvPI2i9D/GcyyW3znKldNefgudHp0TBrU6ob/v4pCHUMzURsIJ9DFf3nCzaB0xY2NQu3vCoF/PQfam2f7GhKSYKkzy2YNVZGGQEmodxUiAp5cgE5GaZvuYX+VL64gJ3hdXPJDfAkVBYGKbza/YA5Lf7oaYgKYSIXmRzdm59nT3U8UfqCw72Pj57lEAAAAASUVORK5CYII=",cb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACBUlEQVR42jWT51bbQBBG9w0SkhBkuVvIBVww7rZMT3KMjUOIA6ak9/d/gC/nDtkfc6Zs0dxvVu7rYUW3g7x+v2ro75uW2Z/XTbMfJzvmWX8Yl/Qp2Ta7HxX1eRrr+3FNblB6rpNG7tHqOZEnlUBnrYLZKNo0f9rM67ieVTf/VMPohSbxlo52M3KrQUmz+pbmzVCLVqirXkGrQaRZPdBqGOmyk9P7fkmXnbyW7YyW7aytsx/vfp7uWpt3w4K1DBJt0iKtUgePfeS/zuoWUwPLwcEhPIVvR1XLuQDz2nCINf8xLiN3ndwT4/LMB7VQ4/iluvkNjbY31S8+M49GaAP3tJoyrQ530nJ305rmzZRuxrHxz1uhzpsp4ztvBP8tpetRLPQiZg1tOGsItLju5/RxEpkOjA1W2qRGy3gQiT0iWrkvB2UrYH7u1LjU6+ENHfBcjNkFMCblwHjgJGfGeGY/KT/OG11gZx8xe9jvmPe7bsFYb5OqxTfjspb7WS1aaau93c/qehxrsZfWRTujD8PI1meNQI424IUJjybwggAKrcIOntfJj5TcIRgFjENs5jLqHOID/uGQc4H/GHo4mHgHGKzM2vMya3sb1dA8tV5hw96KP+Pg5K0zU2LexDqpWIw+6EG8nlTsP7jqFe2fudhL27/hPCPjgwk22oQfPfwbIKdtr4vH/geZ9KljEaVWjQAAAABJRU5ErkJggg==",db="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAO0lEQVR42mNgGL7gjpHNfxgmS/OvO25wTLIhA28AxWEAAzY9Rv8piomBNQCkmWwDYBqp4gWKvUHzQAQAlSpNE3D8AIoAAAAASUVORK5CYII=",hb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB3ElEQVR42oWTSW4CQQxF6xCs+x5sEBLzPA9bQMAKwQIQ8zxzgCiR2GWRG+RafQNHz63KtEgWlqvL/t/fdrXZ7XayWq0kEonIYrGQVColoVBIisWibLdbuVwuaqVSSRKJhGSzWclkMhoDZzabjR4Ilstl6ff70ul0pFqtyu12U1IMwOFw0DyKzmYzGY1GYjiQUKlUpN1uK0G325V6vS73+13J8RAcj0cl5g6S6XTqKYAkHA5Lo9HQ6s1mU2q1miat12utvN/v1VMIjykBzMjy+/3SarUUjAoIrterJuJph96tQYxyw7ACgYAEg0GJxWLqe72exONxlU1iOp3Wyslk8lM+cVXAB/IwGEkgCDEgtkLv3GPkAaRtlBsrhSD+dDppAiAqk8iclsulgieTicYLhYIq0i2QDJCzz+f70wDzFlDG2o1dB8Pi/B+BbYs28YZDLpfTAfLavie7b47nn5wfCmhnPp9rUQMISRBhCnhxxH3+ArmvjrgP7/t8PmshlOTzeW+N9M5ueUy/JbvvjhLYbyYPhv5RbqLRqE6fCbMJ1AwGAxkOh/rWaW08HqtkYvxoTJ8NsQlVwPAA2BVBCtDOhpfJPZItkBiExl5CghKqQco9laxxT3VAFKBtCn4AuTYZj0NdJJ4AAAAASUVORK5CYII=",ub="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAARElEQVR42mN4+OHrM0owA4j4//8/Azl41ICBNODDr/8nyDYAppmgAcgKcYnhNIAYzTgNIFYzVgNI0YxhAKmaqZsOKMEAk/kuojV/pp8AAAAASUVORK5CYII=",fb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACEklEQVR42k2SWU/TURDF78cSF9xYXEBR/AxYtBQrdBFaaw0xgrKIC6JAQRbjA8/qs/BmCDyQkDQ1jVvaoMQg2NLUHPMbcg0Pk/ufe+d/zpkz42ZSl/Ssu0Glwpy+bYzr1Z3Lmr7dotl0qx6HT9s53HFc1A0Fa/XkZp0eXjuq4lqnSp+icvzQf7VG2ZVRSe9VLs5rK58xEICnEhfsfe7uFcsJQFTu03jsrNyL+DljGrx+TNtfZlT58doKRm+c0kDgsLE9aD9iysgB39tc0O73WVPlVL1n6C9vnTdWCgF9Hj1j3wADBtvTrnpJHyS9ldQvFRNyPAAAGgWwowgAbSYFwdePQVNi0vXOyPQrpZ1st5wv5qSAR4yDXdtpZZcC0u+0sssBTfQ0mRrAHnWeNFMdrD4AoA3UUIjMSj6mn+thA+SeAAgzzcSR0An7kcv7bYfsxCyCfLK32QrxhXEChAJvrnkAAMFPtAD7WKTR7igih4hxYipnJnnRAB2P9OIL2QWW6u/WGyvybxjNCcDBe8eiII+ESwC0s/hflQ9qaId6TnLzgBGB7leWYr8LsNEKU4KVn6mhHUb4JxfZbwFDMI8JkAPCmLgHhBH7YAp4Vf0ct9HaGGEDAAORByMstAUrKgBnKh6klIuaUpuC7x93aYWWkAy73w9O3mGHjADYaa/PHmFFsmfgJ4D8HkDgDQSY7SyshvQPMjiB12kpDZcAAAAASUVORK5CYII=",pb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABIklEQVR42qWSSXLCQAxFOVOOAQmQAZ+Uk7AOZA4+QCATIOqp8hyrWLKQuy19fam/NFjML+IcG/CJ9Sx+X67j+2kSu9eb2K4u09c/f56nsVmO4utxHPu327wXAgIa4GibBGEf98OOgAKckPwTtE06AHqHCCDVOemQOP/EwHUEtE4XAEjGqHR4v+uqS8yJEe8I+MFJFezz4SoJIYYkCdaz7AQcHeAvGhAgMdv7E05BISIGAXeKFAKSrAaQu4IqHKTEwJwQ+E6MZNWnOkDNCTneIiJOmAEppkI6Qk6FLGP0rTjtIKu0TfFDrtBlCiSovC2ShI9/38ydxBMNcNoaAQh8v63nCHtCllWG0XUm6A7Ytk9QK+NljCoPgfsu0Kr9rsoqn2NHAE8QOxtBUK8AAAAASUVORK5CYII=",mb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAByElEQVR42k2TuU6DQQyE/XJQIoiCQPAGuZT7vu87eSsK6CmgpAEJaJKKSIM+S0YUm931zozH/h3T6UbPD2c6fVypUqmoVqupXq+rWq2q2+1Kx6ReHs/9XiwW1Ww2lc1m/Z7JZGTSnRCByOr3+2q1Wn5GAFKn09FgMPB7u932N0RIaDokHTCZTDSdTv3c6/X8DBgiBEQRIDMOWeCMHwCAS6WSRqORZrOZhsOhZ2AVCgW/hxjWSUQ5tt/vxSIAcbvdOni1Wmk+n2uxWDiR0hAHt9vttF6vtVwuZQTIvtlsHMCOXWLj8dhFiQNGhEUpETdqJxMXnKAOgDh7gCmVGJnBEgdv/+2EbVyQCXdRAk2lcZAjKcIWRC7YBoB1FkQahRBlNRqNvy8SrgxVmsZONh4RgRx9IBtgXEUcUcowLrggEwBEcEQZ+k5IupWO146J5rLAc/cSyIg9ssX3ZvcpPSTdAQQykoRz9MEYknK57CRsMjiQEQREguPbhaR7F2SEEYAD11CFRIBJjMeYD0Rfn86lz4SXRiydTiuXyymfz8tiZCFRExYpBSKNRUhfCXfDW4xyOLeYdx4JRqdj1vmn/rxfuv34WizIqVRKv2Fqi4/rqCKfAAAAAElFTkSuQmCC",gb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB9klEQVR42k2S504bQBCE730oogQDxgVMSyA0Y5tebFNCFSKJRO+E3olC7+856Ft0KD9Od7e7szOzd274tUptJ3nq+lei3psyjbzFlH4Ma+il0s4D9xV2ZqcueVGovttyDT6E1HqcKwew/y5ol8R5gTr+FlsjCrqvApajUeYpIshokLosskXe9VyXKh3Lsa7x03xNNgc0mwhrrKFY5H6lIrbTJFubbyoAQpx9jsrNxINa6w7rdypqUk/Gvmuzr1IXU60ab/yi88kWA6DsdLzJCDLVH2pR6ghu9Vdpvj2gn8mILqfbtJet05/Bah3/aNRuptYAEHCfi5doMVmm2faQxdxOukYsgssdQWMHvNoV0uHIt8+GS6ly7Q/Va70nYkogRLkDRCH7SmeFJQ+Gv5oV2BcSpXanhjvx7YHY59nBxgUbSIQZ0NFog8U3eqN254wSmtGAOmIOichjJ4EVOqOIHTByAVCHRWJetYOZrhThD5/MBABxAN4eMZShBGXU2xCxATtJ7jChhCJmwo49VNKIvFdlz+i9wkgT/gCsHsTCDuqInU002/8Aaw3oii8SNMCffwksUAwQZs6ooxaMA4AXLlgBQKG34ocGiMXMIMQCipxn88/m3544BcyGoRFjxxrs2KK5+z/BGWZ+GDF2WP3Q/D8gjhXm9g6tYSS0EsY1RAAAAABJRU5ErkJggg==",_b="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABiElEQVR42k3TZ05YQQwE4L0PHRJqgAAHCL2FXk8TOqGGzjkdfZYs8eNpd+3xzHjXrx2+T8XB28/Yf52MrcfR2LgfzvX33VDGNx9GYuG8J7b/jcX67WAcfUxnbvmqP3aefkQrkKRiQfuV64GYPenMHPK50648E1S8eNGbsQZMQaJAALvP4+kAkbyVsnXpsi+J126+RxOgyppiewWl7KyAgLwiOXttNUqSwHsvEwlGRn3177e0auVK/Nefjowdf87E/Fl3NLa1gQCRe5CwR46QUl2yVSucIGrFXgH2kPiQFDkMscLJI2p60TP7X1dFyLUC6JPzIVWHJO+ANWBJKoqAtOIMWGu15HLVtGJ1OUCU7FkFQkIEGCmsnJa02NysQ1llvd5cjNW6QAUc1JzkJLLFEnXsgDW+lKiKFSkSbtTJ5SUCIMHOco2zmByimgvtcYRALAlsALVjQGqsuWC1Rhk5+85qcpDYAkKkiH1nZAD1P3DFURESzJ+pnrCGpZ6z3rrIFMtps/5ERP8Bnh4qEBy90cgAAAAASUVORK5CYII=",vb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACq0lEQVR42i1TZ3PaQBDV78rE44KxqRKqFAECBAjRezXVNBtwcJk4ZfJbX2Y3+XBzN3e7b9++fSfMhl2oYgh5K4njZolIOIBmxYEqhXHarrAc97GZT2CZMSQMFXFNgS6LWD0MMR12IUTVCOK6gpgmIxU3kDHjDBK482Ax7mE9G0EM+DDptxHTFOQzKWTMGCIhP+cJdtpEQlfw0G/zImRDlqBFRMTUCKjAoF1Hu+ryezpu4P24x345ZcbC8+McFScP20oyVVpmVEe/WUPIf4fpoINWpYTFuI9xt4lSPovjdgnKO+1WEAjNUCLQZYn7VqUQHgYdDFp1dBsVbqtRLmLYbmA+6rEOb4cdPs9H1kioODY69TIH06IzgQ07DbRrLkI+L5plB4vxgN+pb2o7k4whm4xDyKUSHEAVKGDca2HSa0MRg4jrKu+kBzGrlQqc1K6Vcdws8LJ7hPDr/QV+7w2qjo1es4qoJkMK+iGLQRbMc3nBiW+HLc5Pa2STMbRqLj5Oe/z5/grhx+uRL+OGikiIxncLx7ZAzKpOHpYZRbNSYtrU8++PbwzweT7ghUQkFDr4vR5YiX/BGTPKVelMbBplh81FoES9mE3j59sJxF4gBxqKBM/VBVeh4FbVRTGXRiGbgvfmCnY6ATef5d6DPi/ubq7g5jN8J+xXM6bdqVfgu72Gk7NQLuTY2qQBeYGEq7sFfiOmUsjPxWicwmG9gBYJY9Rt8viojeC9l6tSC1Sl7hYZkBgQYMnOgPLYSIQ66jRRyllMjYySjGq491zzmXzfqpb+szJx+fULzs8bHLcrnGiMJEi1aENXJBZpO59wsCaLrE0xZ2E9HSEV01kXAjWjGt/TxxLkcIB/G3n8aTWDaajsAbK1IYtciQzjFnJIJ6L80QatGtazMXbLKf4C7Skyh5I8TO0AAAAASUVORK5CYII=",xb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB+UlEQVR42j2T6VJTQRCF51UEI8GAstyouCKrr8ISExIslKRKIBINO+Efsm+Cig+ggAu4srzSsb6uan50zUz36e5z+vYNRyt3dLB0S9/W7up8v1s/tx/p97vH5vPzZOuhGZivqy36vn7P/BefnihQ4HjzgSWffui0AL6zj106XL6tv3vtlvxnt80SiIEl9nkxUiAJEJUxgIDoQqI3wL68TVoizDBjUOyPqVJIqpSp1Vh/TPP5SC97rqiSjzQ9dNNstK9a5VxCU89uyPD5yN7EAlTpCosfG/fN0Pprp9U6cocltGEIA3zkgA0A0Q2AO4WgC338vJ2uz4rCYClsQwQMiCAgunD3wiRwwpZEnxW4MDFYr0oh0uzzxkttI71VprWUjmuhkNRob7XG03Gb0cxQg8hhHuVcncK/9x2mhZNO/t3pRBf0shswcN18IZjzDgTR6Z8HCQR8iNAGg4+47wN+4oFEqhJ0fb4kDAkw3elIAs184PjCSE+VaWMXJnJ1evW0RuVsQqVMXLMvGjU33GQzYBaTg/V6PVBrPptRJq6ARirDAqq8mQE6oYv57tOdWWH4wQecTgtdnMihCHdOZFAEo5n/gCbB9963Df2+JMyB4s7Q/0hfOOYV0FZMxWwX+A/Yh/nhZtM91nfVduFN9rrNpZi6ZvuAdvaFvP9j6YXjKJEr0QAAAABJRU5ErkJggg==",Ab="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACcUlEQVR42jVSaVfaQBTNb2/dWEM2wK1qv1Sr7JCQBGjrUm1/w/3coxZRthBQnJ77cvphzpvJ5C7vzdXynSWObxVYD64VrO4Ktv+KYrhGujZGpjaC7c9gejNsnj3ACtZIN2bItiKUBgpasa+Qa8fYv1KwQyUggjP1CUxvCb01Qb45xsbpvayDK4VPNwrlbwrEarq7gtF9kw8kMNwY5f5awNnGVJQ/fPkjNVUZIt+JkWnORZ17bfe7gumvYQXvUku9RJ0kqeqLqGfrz9IG96b/hr0fSki4NNuPUOjMwJpvTaG7S7FGm1xOEMmd3Y2Qrb9g/1KBrp2+SmZguHPsVJ5QCpMfj36ylXe5pNrW+aN811tTmG4EK1Qyh4L3BrunoFndCKYXgUR0wJbogjM5vFYotGdIVZ+EiCR0YLDVgcLJnYKWqb/g4+k9ts7/YuPsQVR5yTacnhLVdG0ka6cyFFK2wDmwRc3wlkjVxmDVOwvJA1+FP7Ie3yV2mZGjW4Vyfwm9PYfVjbF1PoTmhGtkmzMUe+/IteYCYo9U57MSyHY+/1Y4vFEohkvsVEYw3AV2B0tolv+K8kAJON+OJFR0UfBehSjXWeHkVzJxho0OqJyqPsP0FtBomyQFBog/XSZWaZ1kBO5dKlhBMhcS5JpTIaELreBGyLWmyDQmMLsxigHzMJGBbn59lPzb/gJWdwHDTbKSqo7g+LGcNTtYwQlX2L54EoLtiyH09hR8HWZDb8+Qa06EIF17FiDPvOdZHJCg1F+Be4KyjbGkkwHj3gkW4oLqBDtBLA5Jrol6ZSTL8BZim+x0wmxwTyKq/W/D8mIUw1ha+QcfOBvm79E87QAAAABJRU5ErkJggg==",bb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA5klEQVR42qWTQRKEMAgE/f+jfIgaE/1ItjpVnQLdmwcWMpJhIOyyrmv/Ygs/x3H08zyHv66rt9aGgWFi+lLKsEkgsO/7SNi2bSTjJeI7BcDIwycCwPu+Z1XOGt8hFK+1ZgJAW/gnPaojhoBik4ADjBix/RKrjIuQGkOSFAB4yYpcgNThEoOpchLYU2wDTBLMAhFLLVjB/jxzQVI86mzxReCgiFXlHHxq5YNNAidupdiC5GLkgKVXMNkEzNhqxqhwwRJBXJI4MKv71C5VmoGyXOHnEllZYp/59V/QHKBtxMt4VUyCL/YDPqSC2MwXqD4AAAAASUVORK5CYII=",yb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB1klEQVR42j2TyUqDQRCE54Gz7/vyZ1/+JCBoUDwZDHgQRPFkEHMWvHgRRBCvIuoLlHwN7WHomenu6urqmTAYDNRut9VqtTSbzdTtdlUqlZTP521FUaRer6dGo6HFYqFms6lMJmMxhUJBASfJy+VSq9VK5XLZkgDCktTpdAycPUD4AAco9Pt9CxiPx+bI5XIGWK/XVa1WNZ/PrSp+7lkUwZ/NZhVIgsVkMjEgp0YFgkjAB8PhcGjJlUrFkok1BlDDiRZxHOvt+li7dWQMoAwLGNBGsVi0RRGsaUAyYjr116u17o4i1Wo1jUYjS4YFC10ohCU2kAwDKLpgBBLEnuqwmk6n+rg91efuzHSCPjY8bZf6ut/o+eLgf0w+WioARpusl8tD/ey35kMLWgzfD+d63MR2kU6nzSKQ9wkLAmFAi5yhzwhNA6ZAgPfPJb3DBAD2iIfytEN1CnCmWOCCXgAimKREImE9EgR1wH/3W73fnFh1zuSYBj4Wf1mAOH0YAQJ9poIeVMUPa3sHBMKCC/qDOhX8HstbYJEIU48xAHf4bAEiAMsZYaHqT9s/G8Dsg9Pm0tGxUPWfl0wmLcanhB9A+42uNiz8s1AJpf3bplIpS/DRsWfxiv8AVLh/8HhF7HkAAAAASUVORK5CYII=",Mb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABuElEQVR42l2TV3ICQQxE5wwGTFiS86kIJqwNJ3DO4S7kzGGcE7ZPIdcTpa0tf0ztbE+rJbVm3Nj35OU0I4ubTfm63pDnk7RMG9kA+77d0v2wltTv61lWsc+rdemUouK65VV5O88p+HiUkqdjTwa1pP7/3u8EAv1KXIPeL/LKIQae65ZjCoaroAL2BPAl66yZk5+7bRWFz9monhLXq8Tl43JNQVQRoC1aAScb5PFeWvdUaa2AuU45plkIeDhMiiwOpFWMaLDhiE72M3oGTiJw2nLzZl6zQ4Zgi2wmgA/hMzDO582cOLJRomWEPPbTgamWkXIJpHTD8c/NGlk1hkVvGAUZkvmAAF5xTmYwzkd1T1yrEAkMNHdpi77NRIQYNxVaMNwhUyCbKRPEahejSgSnMjDMJpDW+NeLRAvcJnMag6gEZTAzTUfmLy8P/3ZvJuExkskItszY/xNAEO7I98T1q4ngDbBQbhVWlMyeUq06BI1HFXjlBtVE0AIEptDbXb4PgrlcfLlIcPCBCqiYK+/o11qAjIg9JoQRohLICMAhOyLaQrsU1WB7PEyD+YbvPKJcOHsrNolhLSV/b3F+vBmIIJwAAAAASUVORK5CYII=",Eb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB0ElEQVR42j2TSUsDURCE329Rg2ggv0ZE8eDFg5GQzGTfM9nXSZiLCIInr97E3PWHtXwFncPjTfpVVVcvCev12gaDgfX7fWu1WjadTm02mxnxbrert9FoZOPx2CaTiWLVatWSJLFarWZhtVrZYrEQGXCaprZcLiW03+9FQIw4v8EgBr7RaFhAlewAPeNms9HZ7XbKCpkb0WazKXyn07F6vW6BbJ4dqzwCns/n1uv1dA6Hg2JkhhTHsQ2HQ4kEyHwgQG0AXSDLMgFxRmYwlEvZ9EkOUANAJm5s8wiYQ7xSqegmGQ4RRbDdblsgKwAa4j0ATGnb7VZACLjizt2/W774IzHwIYoilcCjN9AbhxO3T38gFaJfxb1vgVrJ7jViC0f8Pr99tfzL0S7u3oQplUqKU/ZpjHywFBzG5L3A1dlNZrmHD4lyIOK4XC5LjO8AifGwLJCwygNCZKdHvidkRAgyW6gp+PwhUL+vKiKAIPOGOCVdP3+rDMi4Dyh6EyFdPX1Zvng8uQGICLYvHz9PO0KTGbnGyIFAJhpWiP9UFqII+EYixBK5OJhAkK4TwD5B+kIm3wkXxwWO+eaNPQkEqQkyYkyDrAh6WYCJ4RT7rLP/S/8BOjhvX8hCe+kAAAAASUVORK5CYII=",Sb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADP0lEQVR42h2P608TVhyGD3bl0pbWXugKFQpF2Vi2Txtj02zK1VooUC69UKF0wJSRGJclu/xTS5jhJihQoFjaUsqtBVIETWRsTl2MMS7LnqXnw5Pz5by/93lFtNdA9vYHHN66xFSDYMFZyO5QOXGPiaPpz4h0aYn26Fnp1Mh3p0tJ1qflqF/HizEbYjNQytx1JX8s1cP+12SGK+XHiFvLXqiCZL9FHkn4zByM2En3FHHg0cjwobcYEXapifvMvEtcYaYpj/Q3Nla7imUw1mdkw/8+24NWYh4T2ds17LrzpcXbHz5kwykQS+0qOWGt+zwxb4k0SHhLpEXObn+4Ss6av66U5IK55hxno1bEyWwd/FRLukPw14iZRGch+/1GSapHw6bPRNhZQKRDzapLxZRDzX2XjokmJacPP0f8Ga7n3V07/3xfzds7lUQceSTdKjJ+g+RBSx5zTYJEn575ZkE0UE48WMWyx8LxTB3iiV/Ny28t0uBN9DJni/U8uV8nDU7H7PJAyl/C7kAp8d7zrHrLpMVSTwmJoB2R0z4LGthtExzP1snw09FyzsYv8uJuLXuDZXJGdrSKk7Eafm1QkBq+xPQNNZMOFWK6NZ85p4p7jQr+3bzCaoeaDa+R47Ea1nt0bISq5d4HnXpmnBommxSkRy4y1fweE1cFYitkJ8dks5LlbgPRbi0n39Ww4lIx33KOZKia+GAl6zcrSASr2BqysXHzApON55h3FiFy7Q9dWiauCcJuvQwuOJSyPROq4LfmfFa9pZLZtmJmWvMlix1alt16xGKnjmTQxs5wNbH+MvYGrcT79CR9JhIeA+FeM4vdJjljxWOR2pFeI4mAlUeeEsTxaCUpj54tr4G19gKyfUU89qpJdyn478ePiPpLmbiWR2qoioVOHZH2AhZahORoxIZ4PGLj7E4t2z4jewEzz0ctPBvUw88f8/fYBdb7y2T494V63qxf5vWjL9n2mwg7FMTcGkS0o4jFFsGyQ0GyV8dp0Ai/fMKOS0D6K3jawKvIF/C8GY6usuYqlO0nt+xkBkoRh0NWno3XkBmwsNSaJye8HrdJg4N7n8JpI6mQnfk2DbGAVU44DJWz6dGzGzDzP8aiSHpbdiwFAAAAAElFTkSuQmCC",wb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB3ElEQVR42k2ThVIDQQyG9xGwwZ1iLbQ4tMXd/Smwwd2dwd151TBfOrlpZ667t5vkl+TcxHeHlC6liXPOVe8USN2+TwJrWRI9C+h5wWyi3vGr3SuSksVUfa/azpfQVl7srvGoVDdNx2VCEEktF5VSOJfkJdsPkMmfTqlYz47dl69kyMh7i3RcV2syQVTm6b6r03f/aqZM/3XLwHNY3/seG3Xtua+PAYAc3MzVqrDhQQaJAERO/TL81qwg9QfFMvgSUTDkqhaqD71Gpeu2VormkxUZmqz5MwmeDGQZq7arUOycgN6HBhn7bBOYYFLnTY20XgalciNHg1h9CymazLkVLFtOF4dhUOQAL0Y/WtWc/qcmQSvMrBAJdMeM147QKiQQBC1W9DUclnhIgIRPyrWteIIXHgOM4GDqt8urbl7gMrphxR5UCsGOOIrpH8HjX+2Kjn4ucRqD8YUi8bPQfF6hYN6c0HMSzQuQaCl7itMR9siyJG8KcZUgCkANSTa+UOcMebwDQCzzwVzA0GEgVfFBB8M5ZygEG22+GViZT0ijQ3qJMaxGFbfxo2a3UF2nXXQIRBt3QDBbk0gwzTbj0KcAK0Nm5hkb+0acDQmH1l/Q6Eo8Kz4kaKMdafjEBP8DKnZwzOo3JTUAAAAASUVORK5CYII=",Tb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACj0lEQVR42j2T6VbaUBSF8x6t2qItViAzYRIcUBkTAiSBMAgIxEAooLZ9/d11DuqvrCTrfvfs4QjTRgr1wg+suiqK8ldEXgbTpohlW0PkpvHYVPAyzOPJkrHtZ/Hb0zExFfwZF3ClHEEIOhofCjsKrtUTrF0DC1s9QFoinNs4XkcFjKsXCDsqXgZZ+JUEA+YtDcLcklDNnWLnZ/DYkBC0FSxtlW98bitwbuKIHB1PpsTvNMHM0rD3M7jWTiA8d3TU8meIHA0l5QiLloRJPYlxLYmdn8OwJrK8cS3BkraejnFD4ucnIPIMhB0ZV+oxItdg/ZNGCtt+Bu7tOcK2gtAxGLjtpTGoJPE2yqMkf4WwaMloFH7ibVRA2YhhbokIOjoWtsaa/UoSz235E0AHvbtz9mBYTUAInTSaxTj2fpYBS1tBwBOI7DqlQJPMmiID/02KGFZT2Lga7jOnECaNJCq5GDaujkvpC1ZOGjNT4hQCW0bv/gI7P8uywq7KN49qIk9yZ8QgBG2Ve0ASSuoxSwi7afZg2ZIwqkt4HRYYuHI07PoGpqbKXkxN+QBoXsax7qqcwtKWOcYPgHsbx8Y7ABeWyACKm+K8oRSoiZVsjI36AJBhM1PGxjPYRJIwbykMoCKRBPLiIXt2KNK98Q2vwzyu1BNseocqUwrkgVf+xT0gYwm4fy/c3jcwtzUI1DDygKpclI/Yg7kls5GBLbGJ9I+KtHZ0RI4KrxxnM8vpGIRpM8VN3PYNjpGqTHpJwgeAnvSNJiIJM0tlEDfxyRR5FyJX52Xa9A56qUz7QY6Xae1oLGs3yOPv4yX8hwSbyD1YuxlUMjGsOgpKyjEDqFy0TKR5UE1xjDQBLRPvQl16l/Ad/wHpztuqEpuNnAAAAABJRU5ErkJggg==",Cb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABuklEQVR42lWTZ3LCQAyF90Lp7RAxGJuQfyn0lAvQCblCAgYMwzHS28k2871EnuTHjtaS3nuS1nJXpX3fiLZ9vbDlq/kN3Zvxji8Ha7L4Loq7vhZu+sujPeXZneNIIsEARoBN2jkdQPgQMyG+IRLB9fGBDqBZN/TTTt5/pHX/PDnXebw/9fNewaf9SKoAEQXrcACEfdw6FPBr2dR5Gp/pvCTljBAiwAhWcuveAaakaTdU0sPdiUBJJ+fn/UiA1agk/+u0ohyEaBkiZ6WQiALKtIHq26wqMmvhfV5TPB1EqlgEtEAFBGGftHOyn4uGfBBZG+NWoBjfDFMEMC2GRQVQmrQDlct9OSyqFQCQzXqh/LSSdPI/Q2QYPBVOVFe3JZGhCNmkFQik2KiUtbYYxGrDWS+oQEKvJNErFh/qkPC85DGr7D8AzEswcQKwUzpgQLRDRUYMAXFegdk5WGBb3hSlRgLl8lSLYaz2UP77KrwCBAg7+++ZKomATZ2KTNWqg9T2Q7tABcyBYULC0NJB/A9ICwzN9oI/kPxsmSDBCTNO29D0F0SMY9uItd1RBVxsZW2FbfOwtn1Yy7EV+Aab+kevh+NElQAAAABJRU5ErkJggg==",Rb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAaUlEQVR42mOImmb0H4bNouT+I/OxYXQ1DMgC6JIgPj55DAOIdQWyWgwXkGwAqU7GawAxgYYRBqQYgC28GEixHZsXSY5GjHRASRgQFYgUxQKhdIERBsQ4GW9eINUArCmRkI14o5HUGAHxAcRDCDOV7zHzAAAAAElFTkSuQmCC",kb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAI0lEQVR42mP4wfDjPz7MwMCAH48aMCwMIKSACAtGDRj6BgAA9VT3EP8L2v4AAAAASUVORK5CYII=",Db="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABEklEQVR42qXTSVLDQAwF0ByIYsECMnjOAPe/UFPPVV/YZJmFLLWGr99q+fDx9t5ekYPPcDy38XRp93Fe7encrWf2bZjaY1rK33+d2tIN7We5/QFwCFz7cU2iu89jFQAA5KzJ93xd/TsGSZQ0X/r1jEXssFDMRxdAEjFhB4iNje7i6Q6IFECoJ6ijZH46HTOTsCoAQSJIMNkycBZnB0y8AExUcqYLPUCuk3vnemGyGyJEwlZIK+LLWXEYPA0xiTT0DCySeQCigRUA1ExWkOT+rgSU/r8LBZDlAbTtrogvzyqHPy+0Y2Bw2xkoso1A4hPnZ5MCyLvnuWgdsnnZjQw1/83TDATyxgCSyJf/ISuOXQG8Ir94H6/lUHiUYQAAAABJRU5ErkJggg==",Lb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACsUlEQVR42j2Te1faaBDG81HqsSbkQkIgt0ISLgbQL7C7p65UuYoCBbFStVVru9t+69/uvKftH3NmwuF95nmemdFuWy1GjsNVGLKIIoa2zTbLOLdtVnHMY56zKJdZui63ccxtnnOyv8+5aXJZraIJwKlhKJBtmjL1PN4nCXedDjdZxsc3b5hbFh+iiJswZO77bBsNzkollbXLIEBAhMEfr16xa7VYRpECkfin1+PH0ZF6LPVA17nvdBg7DkPLQpM/jctlBXJuWUrChe+zaTT4a2/vd/fv/T4b31edr+t1lmGoam0Rx6zTlIsgYOS6bPOcgWlyWioxdl2ei4Knw0O24keno/Ku0WDp+3xqtdBOTZNZrcbY81jV62zSlHkQ8LdhcBVFfO33mVoWC99X9ZeiYB0EfO31WFQqaNL5xDCYVqtssowzy2JULnOi64rBzLYZGQY3SaLyJgy5z3Neul0+pinaW13nnW0zsCyEjWiXEU4qFVZJwtnr14q2MJBaHl66rpIl35o4+9hsKodVHB1xl6Z8aja5cl1Wnsddvc7nPGddrbJNEp7lTVGwyzK0pefx/fiYl8ND/hWng4Bv/T7yu8SP42MVE8NQAMtqlYd2m6FhMHMcNJnvLkkUwDYIeMhzxeI6DBXQhzhWAJJlI8emyWB/n3UY8tTtoj21WnzrdrkwTVaVCpflMsODA9a1Go/tNtsw5KUoFMBNFKnuAvI+CBQb7bndZlYqMdF1pBb9F3IPcczccdhEEV96PaaOw32zycTz1K0MSiX+3NtDkwOZGoaSIFs3/jmy+yxjaprs0pSJbTO2LB5kW21b3c60UmH4ywORIPqFgZg40nWlX3wQ16/jWHWXuG02OTk4YOb76noVAwERL8QHoS6zXvm+kiLdn4pC7YHontdqaj+E/tv/9+A/PqbZa63/AUIAAAAASUVORK5CYII=",Pb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACMUlEQVR42j2T2ZKlIBBEfev2KiougALud9+6Z/7/23Kisif6oYIIIU8mRZnoIqDMB8jalCOm4YE1vjGYM7pqRacnuG5F/mnQmw2zf/yWa49IXLehNzvaaiJg9k8UB4+2XFDlEXlqYNsFWvkfWHtEmXkaBHdFUmQ9xZXyUKnlhlYTN5fworNpZqiDRfbRUVykA0FNOf8AJIFtFth2pXPs72iKmUlE7O2RAFlFKIC+O7GSOTzRlBN0HmGbDXN4YZ/+YBu/4M0FtRLADdv4jaG7oswGeHuG63aMwxWJiIO7QKUDqiz8AqRce8LYP1jT8ITOJ1S5Z69MvSD/tEgm/8ASXzD1SkBdzLD1EeUhoqs2VNmI6O5MImtwZ8T+wiQEiHOtRgzmhHG4U2j0jmBv7Ic4S/SmWLDEL6jUsSS+bTfpwYt37dsT2mph9CW8cZz/osxG9O2ZSby5Yhwe8O6MvtuZQKU9klpNvPfknygPgWIRuuaETu8UinuRBgKKQ4/QX1hOEohz7G8swvyLkODuFApAUph65/fBnuheF5FrolLPgdinb0IEIE2Uw1IyE2UWmWCNX3SVF5BVrpJwoooZOv/5D8qD5zxIQ729wNQbtBqxjm/2aDBHdHpGXf5PIEKBRHfjYZku9dnDtTtBsjeHB0tA8ozinn0YwhLb7HwuiSkwuYb8B3UxckKjuxJaFxNTiKs0UlJwDuSjXKHTKweq0wvFMlhaRfZHxAKSM62eGL+pRsL+AZT8TCB+Q24BAAAAAElFTkSuQmCC",Ib="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACf0lEQVR42kVQWVPaYBTNL3JDFpUu04dqIYQkQJRtqljrRsuijooKBMLi2r612iq7gGi1/YOncy+mfbhzvnvuWTIR9pemUc+70SkpaBsymgUJ7aIXDV1ELedi7FZUtA0vGnkRvaoP3bKKjiEzL2RiM6jl3GgVJDR0D26yLg5r6h7G27KKOt2LEhuJ71Z8z6XyMKBf9XMDzTBIxC2bFbSKXm6l4FrWhV7Vz831vMihQjJkR1ybQCJoxYZ/HMmQDZ8XrLyv+8YQ1yzYDIwjFXYwR/pEyIZ0ZAqJoA3C3bEPHUPC4MSPdtHD2KsoaBVE6Guv0a+qzJu6li7y3quozAkkoOmWZTYRUgBhfu0VOkUJtyXvP83gJID70wCHtQseCA9nGi+Eppl2Sj/64OR3U3ezibBj/A+jEXYXZ/Bpnv7BJNJhO3beT2Mr6kA6YsdWxMG3VMiG3UUnkvwPrGCPNsGc8OPQhZuciJahoK5LaBRk1PIStqN21PIe3uu6F6S7OniHn0duXGdFRhrh6mCOzc2ijKvMHBoFL89+zMmB11k3z7e9t1z0fX8Wl5lZtAwVzaICgQhKvszMsYCC6LATtTNSgWnikgNTpzAvrKpjSIQcWFVGsRGwYEUewbpvHPF5K8+qOopUZAoflVEkw4QjSIYc+LRgw6ZmgfB0MY9+RUav7MWfr0HkVpyMNMTRjTTmu18Z6n6d+fF4HoBwf+LD7y8LeDrXmDyMTWFwrKJb8uDhdCgaHCusuasOA54uNL6RTjCbH881binF37CQTN2SBCowhwyPz0XmVwuZ5ZdIh63YitiGGLYhs/wCe0tOpJ/fu4vT2I46kAxakApNIhOj+wzjX3dKVZPw0/wfAAAAAElFTkSuQmCC",Ub="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABuElEQVR42k2TZ1JCQRCE9wxKBnmYT6USBARPYM56F5VQIHgYc9ZTjPUN1a/48djZ2emenkAYtyJ73i/Yy8Gcn19ni9arZezzdMGe9vL2cTJvj7s5G7WK9nYU2c/Fsr0fl+xhJ2vX67MWupW0gwAQ8HpYtEE974F/V6t+h/i+Hfn9+3zJfbx3q2kL/VrGs5OJj6yjrTkPhpg75ONWMVbFiYphs2BhUM85gRQgbdyO7PdyxbPwBlmnkvKTcoiDwBXcNQuxLNgB9TezbqOAQD4SAVSvXFU7migAjIMSVBsEqCAj9vXajAMh445Smh0rAMhHFvqCrSkAui0nnYBYqWIygVFwQQHyAN1uJGL5EKBk0JhkxcYHERMMnXLSwQBwQkJ38UkRgF417WD8EBHPaAONoE6CcdLpXjXjclGjuoeNvJMTy52+0ewAixRoPOyB+kIgQJZLmygl/RoE26VYAdl5pCxsZYf8ZiPhtvyQdcopC9r76WxsnTYTctRQFidg+WlsYOYQSAVBlCWp2hE2ESUC+8ozRn40GjVHfSFQGWki78RqD9iNMGxM6iF4euum/6GQsLGaFHdsyv8HSmltC4Nie4cAAAAASUVORK5CYII=",Nb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABAUlEQVR42l3TWZICQQgEUO5/SPddZ/QGGknE60A/sIGChMos63k/vv+u+7brcb34ySf+vx36yy6HVefu523XVYLbabMAxFcUkNjjsus8Myh+mRTEFAJJbGJqAmibNCf/epzeBTVBkmmMJTYlPlAgiTOw8hNL8+TBVvKTCxxks4IakCRMMtnqeMBJgANWJpliNRzMZjzNAYXpJCZRps2mnJEYV0W2FOUwqN6GBtLZFEjLiBBfUiok46+UapsDTYCQl6/7zzfCbwAruwLpvIUUWtfdEdocKMA4ELJ6E/NsXqfmfwBhSFM4a2zyRSL2Xcd6AMk48wuJiJsMzwdl2pQ2PnU+npq1EOyYkt8AAAAASUVORK5CYII=",Bb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB7ElEQVR42j3TR09QURAF4Ptb6L333n+FCij2LtgL/C9d6UZcCBuCkRiNLExk44IYF5ox35jr4uW9O/fMOWfKKxE/Y62lJZ7MzcXt4eF4Oj8fNwYG8lltbo5LXV2xNTERd0ZG4mpvb1xob4/zbW35vfv6ZZTt5eV4PDsbzxcX42xjY+ysrMTFzs4EnWtqipuDg3GlpyfWW1vzXuzu6GgSEiwSKTxbWMgLjwtEj2ZmUune2Fhc7++P+5OT6RBGHtfFgV2qt4aG8vJaX1+6kvRwejpLREqdG+qICJcKUi+gMzeAm+PjSfZgaiqJOUHivNHRkS4KdYnVemXnQP1ArMMhg9NIZETL5e7utA/kUs2SKFBSp0T9IIRYXPPlZA/Ypg7Itm9ESJRTGylBCaYR8Ss+Hbz/54A9QSDf6n/35lUc7r2NH98+/5+COAcvlpbi+9ePcbi/G8WisKwul+ZP9eT4KOLPaTaYK33hCJ4LCyhejMKSeLhRG/CXD/tZ95mGhiSvo4WB1ezsAXtUsbmU5E3NXpiEsuCc9UNjLZq8glltAqyzzIWyvMW8PaYlTl1POMp/AQF2yeyZr5iEatvZxJTMFeF0oPuSHDxAEs0aCKmua1zdSjFY8WKWdZ0FapeVpPb651G1SEqqi/T79CT+ApA28gZA+69hAAAAAElFTkSuQmCC",Fb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAtElEQVR42oWS7Q3CMAxEsxC7MAmTlJZ+vZZCC5saBbVSFPAlkn9EFzm+5wshOVewBiw4pwNr/+mX88lizWAPsOOe1wi2JfpPoxdYLSaYwCahh9j9KR4ANqgG9T6ip/feB4enO9gqGLz3CVwGERJigq2gh7ngkcKavx7VFhawTjHosz3nFYNWKQab90Oir8pC5UU1gdyWGIziQeNBTHNQCQbD3sBlEHO+FBj0JQsqKDGJt0z/ABez/Li/+XLPAAAAAElFTkSuQmCC",Ob="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABvElEQVR42j2TSU7EQAxF6wapDOdstXpMp+d5TPdtQALEAZBYskCIDVwAIfaG95F74VTKZT9/O5VQVZWtVisbDoc2GAxsvV5rHY1GNp1ObT6fW6/X0/l4PJa/2+1au922yWRigQ0BBANbLpe2WCyuEE8EzMoeKNZsNi3MZjNtUEEiIMhUwMcZMZ1OR9ZqtQTH+v2+BYJQ4BCCUVWWpdbNZqNAwLdJYs9pam9ZJoBaIMArkgSg0WjoHYlAkc/6UxT2XRSCAscXcLgc+mMOJGP0fDgcBKUI76z472K0mySxsN1uFQyVGdAOhiKAVEE+yafTSXOg4EOM9pHnFgiiOiAgPjRWgo/Ho76Mg1ixxxj/W0AOxgZ5/iUA7nY7O5/POr9cLpoFhho/Dz4k790vEmpYSd7v9/I73HNoKUAhmUuDcUCCXxbkk+Sq6roWCCNWLVCNAIKZCUoA+/fHzywAUAQF5KkFqiCFHp3K8PxOUNGH9vk3dXwU8X9FVxkyxnBIZJhUB4YfwGuWCfaUpvZVFPae5yoUkIYKqMB8eEB495/IW7iP0V6yTIVQEXjQCwAkeVUUuAo+JUBa5QoT63/wL8Pic44jF1AkAAAAAElFTkSuQmCC",zb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACJklEQVR42j2TZ3LiUBCE3/1PsBiDkEgCge3dK6wNBoNyFkhkHPYOvdVD+DE1VD36m9AjdUgsJB8ajukIp2yMtdfBym1L3kYmgmkd0ayB0u8hW+qI5xr8SV3y2utBrb0uCCFgG5pIFxr2yVDEhFCYLlp3ULY0sHK7SBc6olkT6kYvnDZWbgebsI9dPEDpdyUoZod8Y7EqMKVy8tG6dMAHBgHxvCntE1AFPckUsTqjCvoCCN8bkjmGSpe6kPxpHTErOQZKr4N9MkDld1E4xnWULj6LJ+R2S8AckaGieVPEud0W6k/1G9/lC77WzzikQ5yyEXJbx9fqWWAEZEsNx2yEQ2pBJYsWSr+PwukgeH/EMbOwi00BrESgC4QAjkUR98RRCZQOGJtwICNQyA44RmHrAjjnY2n/e/0iAMLoFEdRrE5bgumjLOVcPIlwE/SQLy+blu6u7/vEwiEdiaW7eEgbmwKgvwzOxuq7aCAQ9+1BdnTLdOVm/SY0oegnhQSxEqtz+wx2w6q0zXmtCYRVb7bntgHFzbuvNXHB+ftLqvIiOSODF0eIN6lfD0gTCG+CR6bWXhufBb+BNv5Vf+SU5ZzjgSzvZnM4a8iSCaULvItk3oTahD3xm2JmCmnbMbXkNztjZXaa2cb9Y6OFBKlzzq/QkthGfewi894F/8TKFPJevMkDTvlYrM2WLcnq4i0XY6D0OyKi53SCI9Ah960mC75crC5dXPaj4T92a1FHsT/T1wAAAABJRU5ErkJggg==",Vb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAl0lEQVR42u2STQrCMBCFexJv4KZLD+By8Ag9gWvXc46a39Z4yycDTyhNFlpcFQcej2HC9yYkXbefug0nfKMKMKvAqWBSQVTBQwVeBVkFNhvZm+4qNSAScO4PKCv39ImA1AI8Sc7cwLxQ8yK9cLsKEDi0pLxINA+EBIaMLYDjocQkR73vH7iZp//+FVp1vRxh2vw3/oDPAC9hB9T0l8HLxwAAAABJRU5ErkJggg==",Gb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABJ0lEQVR42l3TWU5DMRBEUe9/qRAg8ywZHaMbRXz42S5XV49vnB6PuT2fp/3rcJifu9382G7n9/G4zrDeD7fbWu4/p9M8P59zIOyv15cxkMDuclki3hLo3Xmz3/8JUERKJEHkPBKzEz7e70sw0eFTuEACyDBeLAJwXOIJLoG8Ae0MnQuzVCx5wxgnPoQE4AFQCnD3UmEsBbslWuLDBzGAYV1IwBvRhJxLZyBYDGtb+eaxVhLAI+7uPAonT8DSqi7uBHErKPFVRIRyd67v1SKv8RogHCLjvYWlgFRnCDCA1d6mF3dUvPIt3OpQStWgtler0bRV3YraHDQ4hV6Ejft4H5LmoTAb8dILqxavSezy/x94T4WICGohbEVQYfLWvxHGCNHqria18xdmWdtSHY2e5AAAAABJRU5ErkJggg==",Hb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABoUlEQVR42lXT11IcUQwE0PsVpPXa+0JYYDE5L9EmZ7DB8f//Qq6jsih4uDUzUnerJd1pv89243ytH1Od0VjodeJ253N8O1yLi/XZ+HW6E/fDpXj5shlXm/NxtjoTTwer8bC3nDG59v1oPcEzH8ai3x3PJBDAn/Nh/DzZjuutQZLlTpan4sfXreQo3HyoxAnSzfZCPp+PNxKkMky58P64vxKnK9PJaxKCBJA8Lzfm4m53MUFclBCCdy0SgW/ArLGjf0QkZNZZJqpfWDEHRrwhCVB09F8DU424g6BizYQbzhsVQSDVCZa69sSIik3/35ScY15Nkj0tsKg6EQ5quOJzHyfyDHqdd600QNatkyKSBOGah5g1T06MvG6n3x1LNw1ZC+Xg7SbKUV0aQn8v9jJPzDaaanV5PAUNhyCwbwTkytmMkwJsqoKgjRoimzU81a0V1vtsdzxbyjUiOgBINTxEhLof2oFRbPCpk8W8Nz2zbg6AEqrUSqtncyjbTv0rrarorXqvuRAgXP8B4brysDkDQYFaoa14slu/LWDdSESzIeT7H04PvEDmpaTbAAAAAElFTkSuQmCC",Wb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABpElEQVR42k3TWW4bQQwE0L6ErG1GtkeA90W77cSJfawcMbdi8DgikI+GeqqLxeKi9vBwiL5fx/PzW9zf72MyWcZu9xl3d7tYLC7j5eX9fL9K/PX1I6bTPnGnzWarmM8vYzJZRNcN0XXXMZ12ibl7h19cdCkynxd/mXij2PdD7Pe/0oXgw+F33N5uUwDum8vt9ufZ5SKzc982mx+pSMgdkeWnp1PiiMUhhMfNzc0mBZssrC2XVxnssKdOQX5hSpnN+gzmEl9cYxVBJuqIMh2PX4k/Ph7zrZwp0/10+s57U9Nqtc4gp2wLrH6wKjMBdWukspTRjIri2PUh7Tt//3wmxqY7Z3BcZXsj1GQSWJ03EVnYK2e+9aKaKLDKaf+PS93EalwyOwJxBBCrcnBadbsWx/fY+SE3sZaJfVNwJKlla6P6kNbGpVpnFuoIGsUlEbgGE+EyS7DfsngEUvaLqIFwAnBcgkqQLEvQKIAMLNc0auctjGBveKP9/vzfuY5mIQSzUwtjxjIjwznSAxnH0lbZcOW3Ggti/ZkIuMtSQbV9xDgjYBL/AKWRdCNhqY20AAAAAElFTkSuQmCC",Xb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABkElEQVR42jXTV3IDQQgE0D2vrCxZOeds3RjXo4oPanYYumnCNrPZLHa7XUyn0/j9/Y3H4xHP5zO+32+sVqs4nU5xu91is9mk/+fnJ3q9XiyXy3xvjsdjBiFh+/0++C6XS9zv9zw/n0+Ct9ttAjudTiwWi2i329FQMB6P43A4xHq9TsD1es1APqDz+ZwqJKjMSHw3JRMYEYK/v794vV7xfr8TjEhp7kDD4TDLQNIAkUy6h/l8noQkehuNRtHv92MymSSYXyw14pqqSxNlclZfGMIqkwEjqaQNJuyyIysFzlIFoFRN4/dtKrCN7NgGg0E+IhPAB6g37kw5kvAhyCZWx7FxkousxunUWFPQWOrcS0XjonYXJqsgRKyym4DsRVb3LMGSAAkkj4KSD8CM0UJJRhmSbKISmEstiT4AI5UJGQCfrLUfucpkdrvdnDUzRgDftfP+kdpUo4SpuCyhnIgE164boUwUivFWi1RnU7V6RNBqtbIERgFizS3JlNRk+PJfKEklC5Hsmln9QQJEiZEjYv/MknbK6xSXvQAAAABJRU5ErkJggg==",Yb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA5ElEQVR42oVSSQoCQQzsb6l4UfAF7ruoeNG7L1Dx4rjvv/AF7rtPipQwjUqSKejLVKaSqsSYL4xPKVo9i2QYzK5ZcrZRlrPo72K0fBQ+Rc1N5Kd4eEgQeFUA3ee3HP3/DOA7plAFRsekaGFyTtNgH9cFKm0/4XFcwwlTrRvUBRCim4EL1w4mAK8KTC8Z1idEFve8twCSlnxiA+oW0AXdpRBxA55rrHYChLA4rt4LiZwFxkdYUj543I1YrF8l0QJCxJ2oE6A7CqUQcY2qAEKULOA+sCVVoNzyqZfoGSI8IgcpRI57Aw/Htn+kY38BAAAAAElFTkSuQmCC",qb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAQUlEQVR42mNgGAWDHPyfJPX/f4PQf/INuGbz//8RAwoM+Lbv//8XTeQbkOar89/TVI58A7oybP4ne2gOoAEjxAsAleMswpFhqRMAAAAASUVORK5CYII=",Kb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACBElEQVR42q2SW08aURSF/Tl9aowGKcWaxgflOjPMDBfRtkhiakhbbWsjl6HIcGe09omogFRA7tDaP7iavY1D+2wf1uxz1ln72yczsxBef4LHaIEeN7qIH1kBl8lNXCQ20Drx4iKxiauUA528jLrmZO+hUrZ1IswBl0kHi0xqan714DrjwVXKibrmMitBG2kXQ2iYCXgfsmBPeorDbRs+bFlxEH6Gd0EL3sqLiKlLiPmXcBC2Yl9ZvPf8y9xjAkYVBR3dg35RYo2rKnu1Wo1F3uwsiG7Oi+SuDRPDz54JuM0LDCBRcFxR0cm60dU9GJUVDEo+tLNuTI0A4hErhiUfZ03A9DTAEApS7RVE9Asipoaf13QjOuvlBaSizzEsy+yZgEd/xmFJwqSq4OdZAKOyD+OKD7NTFTNDxe/vW7g7D2JQFHF3HuKcvr+GqaHMAWT2CwIDqHFSlU0gwX99CzJ0VJa4ZvZW+Xz+DgyVG2nCoCjwNFK/4P0HRpVumIu9xLgizwGJ6Co+76wgvmvHYWgZX17beB2P2PFpewVHr6xIRF/gOHLvfQxbeG8CunkJrYwbDc2JTl5CM+1idXIibrJe9EsKbgs+3tc1B5JRO64z7jmAmijU1kUOUW2mnWhoDq5tXWAQDSEdv7HxmQn4O/wQaudE9qiRAARmXxdxtGNBryj/n//gD7hEMxHp4e3zAAAAAElFTkSuQmCC",Qb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAP0lEQVR42mNgGAVYgcaJLf9B+EOFzX8YG4SJ1oyukSRDsGlCNpAsA5ANISkMSHY+OnCb1vMfhMmOjVED6GQAALcOgI9WvP2/AAAAAElFTkSuQmCC",jb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC10lEQVR42j2S11IiYRCF52EWHGbIEgQMCK63KgxhAMkmQEB9qfMkuiaigCQluIjIurrhfutvq/aiq6em6nx9/u7DfT39gPN4jo2Td7gKb7Ckp3AVf0O3O4AY6kMllWBN9rB6NIZjf4DVzBQauQV9pANz4hGcLtLD5tkvKDxVWNJjCHIP+ugQqmAXi4knAii2r7ByOIIt/UCA9eNXGHa7WMu+gFN6azAlhjAnRxCDLdiP5tg4/Yu1/AeWDmZYz00g+MrQhe7IgSs/hxhoQB1sQuW/A6cJdSAEmnAXf9ITjPExzKkJ3Cd/sJx9o6nKnWu4889YSvXJujM3g21vDKW3As5d+AFLckA/VL46TNEGbKkOrIl7fNk6hznRgzHaxoK3DEuyj7XsBAueWxgiLSqOl2pQeCpE3ii+wRJvkXAp2aZvXipD8FexGOtAsfMpVO7cQPBVoA83wVlTQ9qmff+JrDkzQ2gCJYIseL7BFO9io/hKnQF4bwkqqQxzvIv14yk4Znsx1qftMje85xI6uQJBuoZjv/8pksrkwJp6oKkM4sw9U+e0kR5MyTFchXeIwTbMsTsYwhUqfucCmmCNiuVAHahCHajBuHsP0V+lXXBKqYGl/We4ix/URekKq4d9mKJ1LO916Qr6cIPELBPMgW1vQLsgwObZH+ijj+B9Taxk59DJJSxsnxPAGKnCmf1OWdDKdcoBEzHI/ysYYgMSs2IwNl3wXhJAG7wl+yyFlsSnG2afQXShxucOnLkJ7JTxJ7r3WpZFdQbeV4MYbJA7694ExvgQ7LmCdANdqAZ9uA7RXwLHaOyu7DSOgyHchTlc+VesHE2g8texmBhBE+piOfNK3RRrEsCZGUGxdQGOTWWbZQD2zaazyZbUgEDsOraDKdRyB/bDF6wcPMKe7kHlvQbvuQJn2L2nVC0fjqALNwmglpvkwJoekpjtiZXjaEZPsCbbMETq0MpV/AMIQhUoMjIUHAAAAABJRU5ErkJggg==",Jb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABYUlEQVR42k3SRw5DMQgEUN//iuk9P72uHT2kif7CAsMwDNjteDz2x+PRz+dzv1wu/X6/1/l+v/3z+fTdbtdh5K7Xa9ntdls1bDscDv/CYRiqyJ0vB8QuFouKIUYkxrZxsQAA//V69efz+S90brdbHTh5JA2IfJKcJMSRLZfLHpWbzaYUwkRtMx9GswLzESoCok5XeXa1WhURDL92kC5ZVhYXciSn06m/3++6i6/X64o3LAKKFPN12O/3Nb8Cd3kF8Ky8kVsWCCCoYD6fFxmZ7qTbieNVxCiAbxzFEtiBSUWc7plXTNfxf2jmzycyZ2xeAmi8aA0Qacxv5JKiKHIVI0UgFzWZPWPUK2DKZu1CYb6x90Y8XpoG2U2NkL8fqVgnk0lZMQ0cRfmRWWApINNsErpJGkEy6nQWg/O00+m08vUKtqyTJAKAqJBzxsSWDu8gahygbF3QKOKz2axsCDIiP7kfk3S5iRcXcFYAAAAASUVORK5CYII=",Mt=16,Zb=Object.assign({"../../../../textures/ancient_debris.png":O1,"../../../../textures/bed.png":z1,"../../../../textures/bedrock.png":V1,"../../../../textures/bookshelf.png":G1,"../../../../textures/brewing_stand.png":H1,"../../../../textures/cactus.png":W1,"../../../../textures/carved_pumpkin.png":X1,"../../../../textures/chest_side.png":Y1,"../../../../textures/chest_top.png":q1,"../../../../textures/coal_ore.png":K1,"../../../../textures/cobblestone.png":Q1,"../../../../textures/crafting_table_side.png":j1,"../../../../textures/crafting_table_top.png":J1,"../../../../textures/diamond_block.png":Z1,"../../../../textures/diamond_ore.png":$1,"../../../../textures/dirt.png":eb,"../../../../textures/door_bottom.png":tb,"../../../../textures/door_top.png":nb,"../../../../textures/dragon_egg.png":ib,"../../../../textures/dried_ghast.png":sb,"../../../../textures/emerald_block.png":ob,"../../../../textures/emerald_ore.png":rb,"../../../../textures/enchanting_table.png":ab,"../../../../textures/end_stone.png":lb,"../../../../textures/farmland.png":cb,"../../../../textures/flower.png":db,"../../../../textures/furnace.png":hb,"../../../../textures/glass.png":ub,"../../../../textures/glowstone.png":fb,"../../../../textures/gold_block.png":pb,"../../../../textures/gold_ore.png":mb,"../../../../textures/grass_side.png":gb,"../../../../textures/grass_top.png":_b,"../../../../textures/gravel.png":vb,"../../../../textures/hay_bale.png":xb,"../../../../textures/ice.png":Ab,"../../../../textures/iron_block.png":bb,"../../../../textures/iron_ore.png":yb,"../../../../textures/jack_o_lantern.png":Mb,"../../../../textures/lapis_ore.png":Eb,"../../../../textures/lava.png":Sb,"../../../../textures/leaves.png":wb,"../../../../textures/log_side.png":Tb,"../../../../textures/log_top.png":Cb,"../../../../textures/melon.png":Rb,"../../../../textures/missing.png":kb,"../../../../textures/netherite_block.png":Db,"../../../../textures/netherrack.png":Lb,"../../../../textures/obsidian.png":Pb,"../../../../textures/planks.png":Ib,"../../../../textures/pumpkin.png":Ub,"../../../../textures/quartz_block.png":Nb,"../../../../textures/quartz_ore.png":Bb,"../../../../textures/rail.png":Fb,"../../../../textures/redstone_ore.png":Ob,"../../../../textures/sand.png":zb,"../../../../textures/sign.png":Vb,"../../../../textures/snow.png":Gb,"../../../../textures/soul_sand.png":Hb,"../../../../textures/spawner.png":Wb,"../../../../textures/stone.png":Xb,"../../../../textures/sugar_cane.png":Yb,"../../../../textures/torch.png":qb,"../../../../textures/trapdoor.png":Kb,"../../../../textures/warped_fungus.png":Qb,"../../../../textures/water.png":jb,"../../../../textures/wool.png":Jb});function $b(s){return s.slice(s.lastIndexOf("/")+1).replace(/\.png$/,"")}function ey(s){return new Promise((e,t)=>{const n=new Image;n.onload=()=>e(n),n.onerror=()=>t(new Error(`그림을 못 읽었어요: ${s}`)),n.src=s})}function ty(){const s=new ImageData(Mt,Mt);for(let e=0;e<Mt;e++)for(let t=0;t<Mt;t++){const n=(e*Mt+t)*4,i=(t>>3)+(e>>3)&1;s.data[n]=i?0:248,s.data[n+1]=0,s.data[n+2]=i?0:248,s.data[n+3]=255}return s}async function ny(){const s=document.createElement("canvas");s.width=Mt,s.height=Mt;const e=s.getContext("2d",{willReadFrequently:!0});if(!e)throw new Error("2D 캔버스를 만들 수 없어요");e.imageSmoothingEnabled=!1;const t=Object.entries(Zb).map(([c,h])=>({name:$b(c),url:h})).filter(c=>c.name!=="missing").sort((c,h)=>c.name.localeCompare(h.name)),n=new Map;n.set("missing",ty());const i=await Promise.all(t.map(async c=>{try{const h=await ey(c.url);return(h.width!==Mt||h.height!==Mt)&&console.warn(`textures/${c.name}.png 는 ${h.width}×${h.height} 예요. 16×16 으로 줄여서 써요.`),e.clearRect(0,0,Mt,Mt),e.drawImage(h,0,0,Mt,Mt),{name:c.name,data:e.getImageData(0,0,Mt,Mt)}}catch(h){return console.warn(h),null}}));for(const c of i)c&&n.set(c.name,c.data);const o=["missing",...[...n.keys()].filter(c=>c!=="missing")],r=o.length,a=new Uint8Array(Mt*Mt*4*r),l=new Map,d=Mt*4;o.forEach((c,h)=>{l.set(c,h);const f=n.get(c).data,_=h*Mt*d;for(let g=0;g<Mt;g++)a.set(f.subarray(g*d,(g+1)*d),_+(Mt-1-g)*d)});const u=new El(a,Mt,Mt,r);return u.format=En,u.type=Vn,u.magFilter=en,u.minFilter=Hs,u.generateMipmaps=!0,u.wrapS=Zs,u.wrapT=Zs,u.colorSpace=jn,u.needsUpdate=!0,{texture:u,index:l,images:n}}const bd={helmet:"투구",chestplate:"흉갑",leggings:"레깅스",boots:"부츠",shield:"방패"};class iy{constructor(e,t){this.deps=t,this.el=document.createElement("div"),this.el.className="bag-panel",this.el.hidden=!0,this.el.innerHTML=`
      <div class="bag-card">
        <div class="bag-head">
          <div class="bag-tabs"></div>
          <button class="plain-btn bag-close" aria-label="닫기">✕</button>
        </div>
        <div class="bag-body">
          <div class="bag-grid"></div>
          <div class="bag-side"></div>
        </div>
      </div>`,e.appendChild(this.el),this.grid=this.el.querySelector(".bag-grid"),this.side=this.el.querySelector(".bag-side"),this.tabs=this.el.querySelector(".bag-tabs"),this.el.querySelector(".bag-close").addEventListener("click",()=>t.onClose()),this.el.addEventListener("click",n=>{n.target===this.el&&t.onClose()});for(let n=0;n<Ys;n++){const i=document.createElement("button");i.className="bag-cell"+(n<rr?" hot":""),i.dataset.slot=String(n),i.addEventListener("click",()=>this.tapCell(n)),this.cells.push(i)}this.renderTabs(),this.renderGrid(),this.renderSide()}deps;el;inv=new Array(Ys).fill(null);stations={};tab="bag";drawnTab=null;selected=-1;half=!1;confirmDrop=!1;bottles=[];ingredient=-1;grid;side;tabs;cells=[];get visible(){return!this.el.hidden}show(e="bag"){this.tab=e,this.selected=-1,this.confirmDrop=!1,this.drawnTab=null,this.el.hidden=!1,this.renderAll()}hide(){this.el.hidden=!0}setInventory(e){this.inv=e,this.visible&&this.renderAll()}refresh(){this.visible&&this.renderAll()}setStations(e){const t=JSON.stringify(e)!==JSON.stringify(this.stations);this.stations=e,this.tab==="brew"&&!e.brewing_stand&&(this.tab="bag"),t&&this.visible&&this.renderAll()}renderAll(){this.renderTabs(),this.renderGrid(),this.renderSide()}renderTabs(){const e=[["bag","🎒 가방"],["craft","🔨 만들기"]];this.stations.brewing_stand&&e.push(["brew","⚗️ 양조"]),e.push(["codex","📖 도감"]),this.tabs.innerHTML="";for(const[t,n]of e){const i=document.createElement("button");i.className="bag-tab"+(this.tab===t?" on":""),i.textContent=n,i.addEventListener("click",()=>{this.tab=t,this.selected=-1,this.renderAll()}),this.tabs.appendChild(i)}}renderGrid(){this.grid.innerHTML="";const e=document.createElement("div");e.className="bag-row hotrow";const t=document.createElement("div");t.className="bag-row bagrow";for(let i=0;i<Ys;i++){const o=this.cells[i],r=this.inv[i];if(o.innerHTML="",o.classList.toggle("selected",i===this.selected),o.classList.toggle("bottle",this.tab==="brew"&&this.bottles.includes(i)),o.classList.toggle("ingredient",this.tab==="brew"&&this.ingredient===i),o.title=r?`${this.deps.nameOf(r.item)} ×${r.count}`:"",r){const a=this.deps.icon(r.item,36);if(a&&o.appendChild(a),r.count>1){const l=document.createElement("span");l.className="bag-count",l.textContent=String(r.count),o.appendChild(l)}}(i<rr?e:t).appendChild(o)}const n=document.createElement("div");n.className="bag-label",n.textContent="아래 10칸이 게임 화면의 핫바예요",this.grid.append(t,n,e)}tapCell(e){const t=this.inv[e];if(this.tab==="brew"){if(!t)return;if(du(t.item)){const n=this.bottles.indexOf(e);n>=0?this.bottles.splice(n,1):this.bottles.length<this.deps.potions.stand.bottles&&this.bottles.push(e)}else this.ingredient=this.ingredient===e?-1:e;this.renderGrid(),this.renderSide();return}if(this.confirmDrop=!1,this.selected<0)t&&(this.selected=e);else if(this.selected===e)this.selected=-1;else{const n=this.inv[this.selected];if(n){const i=this.half?Math.max(1,Math.floor(n.count/2)):n.count;this.deps.onMove(this.selected,e,i)}this.selected=-1}this.renderGrid(),this.renderSide()}renderSide(){const e=this.el.querySelector(".bag-card"),t=this.drawnTab===this.tab,n=t?e?.scrollTop??0:0,i=t?this.side.querySelector(".craft-list, .codex-grid")?.scrollTop??0:0;this.side.innerHTML="",this.grid.hidden=this.tab==="codex",this.tab==="bag"?this.renderBagSide():this.tab==="craft"?this.renderCraftSide():this.tab==="codex"?this.renderCodex():this.renderBrewSide(),this.drawnTab=this.tab;const o=this.side.querySelector(".craft-list, .codex-grid");o&&i>0&&(o.scrollTop=i),e&&n>0&&(e.scrollTop=n)}renderCodex(){const e=this.deps.owned(),t=document.createElement("div");t.className="bag-title",t.textContent=`드래곤 도감 ${[...e].length}/${this.deps.dragons.count}`,this.side.appendChild(t);const n=document.createElement("div");n.className="codex-grid";for(const l of this.deps.dragons.list){const d=document.createElement("div"),u=e.has(l.id);d.className="codex-cell"+(u?" on":"");const c=document.createElement("span");c.className="nest-chip",c.style.background=u?l.color:"#444";const h=document.createElement("span");h.className="codex-name",h.textContent=`${l.tier}. ${l.name}`;const f=document.createElement("span");f.className="codex-sub",f.textContent=u?"얻었어요!":l.recipe.map(_=>`${this.deps.nameOf(_.material)} ${_.count}`).join(" · "),d.append(c,h,f),n.appendChild(d)}this.side.appendChild(n);const i=this.deps.codexBlocks(),o=this.deps.codexCandidates(),r=document.createElement("div");r.className="bag-title",r.textContent=`블록 도감 ${i.size}/${o.length} (마을 공용 · 10종마다 마을 레벨 +1)`,this.side.appendChild(r);const a=document.createElement("div");a.className="codex-blocks";for(const[l,d]of o){const u=i.has(l),c=document.createElement("div");c.className="codex-block"+(u?" on":"");const h=this.deps.icon(l,24);h&&c.appendChild(h);const f=document.createElement("span");f.textContent=u?d:"???",c.appendChild(f),a.appendChild(c)}this.side.appendChild(a)}button(e,t,n,i=!1){const o=document.createElement("button");return o.className=t,o.textContent=e,o.disabled=i,o.addEventListener("click",n),o}renderBagSide(){const e=this.selected>=0?this.inv[this.selected]:null,t=document.createElement("div");t.className="bag-info",t.textContent=e?`${this.deps.nameOf(e.item)} ×${e.count}`:"칸을 탭해서 고르고, 다른 칸을 탭하면 옮겨요",this.side.appendChild(t);const n=this.button(this.half?"반만 옮기기: 켜짐":"반만 옮기기: 꺼짐","plain-btn"+(this.half?" on":""),()=>{this.half=!this.half,this.renderSide()});if(this.side.appendChild(n),e){const u=this.button(this.confirmDrop?"정말 버릴까요? (사라져요)":"버리기","plain-btn danger",()=>{if(!this.confirmDrop){this.confirmDrop=!0,this.renderSide();return}this.deps.onDrop(this.selected,e.count),this.selected=-1,this.confirmDrop=!1,this.renderGrid(),this.renderSide()});this.side.appendChild(u);const c=this.deps.equipSlotOf(e.item);if(c){const h=this.button(c==="shield"?"🛡️ 방패 들기":`🛡️ 입기 (${bd[c]})`,"big-btn small",()=>{this.deps.onEquip(this.selected),this.selected=-1,this.renderGrid(),this.renderSide()});this.side.appendChild(h)}}const i=this.deps.equipment(),o=document.createElement("div");o.className="equip-box";const r=document.createElement("div");r.className="bag-title";const a=this.deps.armorDefense();r.textContent=`🛡️ 장비${a>0?` · 방어 ${a}`:""}`,o.appendChild(r);for(const u of["helmet","chestplate","leggings","boots","shield"]){const c=document.createElement("div");c.className="equip-row";const h=document.createElement("span");h.className="equip-label",h.textContent=bd[u]??u,c.appendChild(h);const f=i[u]??null;if(f){const g=this.deps.icon(f,24);g&&c.appendChild(g)}const _=document.createElement("span");_.className="equip-name"+(f?"":" none"),_.textContent=f?this.deps.nameOf(f):"비었어요",c.appendChild(_),f&&c.appendChild(this.button("벗기","plain-btn",()=>this.deps.onUnequip(u))),o.appendChild(c)}this.side.appendChild(o);const l=["crafting_table","furnace","brewing_stand","forge"].filter(u=>this.stations[u]),d=document.createElement("div");d.className="bag-tip",d.textContent=l.length?`가까이에: ${l.map(u=>this.deps.nameOf(u)).join(", ")}`:"제작대·화로·양조기 가까이 가면 더 만들 수 있어요",this.side.appendChild(d)}renderCraftSide(){const e=document.createElement("div");e.className="craft-list";const t=["inventory"];this.stations.crafting_table&&t.push("crafting_table"),this.stations.furnace&&t.push("furnace"),this.stations.forge&&t.push("forge");const n=t.flatMap(i=>this.deps.recipes.forStation(i));n.sort((i,o)=>Number(Cr(this.inv,o))-Number(Cr(this.inv,i)));for(const i of n){const o=Cr(this.inv,i),r=document.createElement("div");r.className="craft-row"+(o?"":" no");const a=Object.keys(i.out)[0],l=this.deps.icon(a,32);l&&r.appendChild(l);const d=document.createElement("div");d.className="craft-text";const u=i.out[a],c=Object.entries(i.in).map(([_,g])=>{const p=this.inv.reduce((m,M)=>M&&M.item===_?m+M.count:m,0);return`${this.deps.nameOf(_)} ${Math.min(p,g)}/${g}`}).join(" · "),h=(o||Object.keys(hu(this.inv,i.in)).length,"");d.innerHTML=`<b>${i.name}${u>1?` ×${u}`:""}</b>${i.station!=="inventory"?` <span class="craft-station">${this.deps.nameOf(i.station)}</span>`:""}<br><span class="craft-need">${c}${h}</span>`,r.appendChild(d);const f=uu(this.inv,i);r.appendChild(this.button(o?`만들기${f>1?` (${f}번 가능)`:""}`:"재료 부족","big-btn small",()=>this.deps.onCraft(i.id),!o)),e.appendChild(r)}n.length===0&&(e.textContent="만들 수 있는 것이 없어요"),this.side.appendChild(e)}renderBrewSide(){const e=document.createElement("div");e.className="brew-box";const t=this.deps.potions.stand,n=document.createElement("div");n.className="bag-info",n.textContent=`병 ${this.bottles.length}/${t.bottles} · 재료 ${this.ingredient>=0?this.deps.nameOf(this.inv[this.ingredient].item):"없음"}`,e.appendChild(n);const i=document.createElement("div");i.className="bag-tip",i.textContent=`가방에서 물병·물약을 탭하면 병 칸(최대 ${t.bottles}개), 다른 것을 탭하면 재료. 연료: ${this.deps.nameOf(t.fuel)} 1개 = ${t.brewsPerFuel}번`,e.appendChild(i);const o=this.ingredient>=0?this.inv[this.ingredient]:null,r=document.createElement("ul");r.className="brew-preview";let a=!1;for(const l of this.bottles){const d=this.inv[l];if(!d)continue;const u=fu(d.item),c=o?this.deps.potions.brew(u,o.item):null,h=document.createElement("li");h.textContent=`${this.deps.potions.displayName(u)} → ${c?this.deps.potions.displayName(c):o?"(아무 일 없음)":"?"}`,c&&(a=!0),r.appendChild(h)}e.appendChild(r),e.appendChild(this.button("양조하기","big-btn small",()=>this.deps.onBrew([...this.bottles],this.ingredient),!(a&&o&&this.bottles.length>0))),this.side.appendChild(e)}clearBrewSelection(){this.bottles=[],this.ingredient=-1,this.visible&&this.renderAll()}}class sy{constructor(e,t,n,i){this.onSend=n,this.onClose=i,this.sheet=document.createElement("div"),this.sheet.className="chat-panel",this.sheet.hidden=!0;const o=document.createElement("div");o.className="chat-card";const r=document.createElement("div");r.className="chat-emojis",t.emojis.forEach((d,u)=>{const c=document.createElement("button");c.className="chat-emoji",c.textContent=d,c.addEventListener("click",()=>this.send(Od,u)),r.appendChild(c)});const a=document.createElement("div");a.className="chat-phrases";for(const d of t.phrases){const u=document.createElement("button");u.className="chat-phrase",u.textContent=d.text,u.addEventListener("click",()=>this.send(pu,d.id)),a.appendChild(u)}const l=document.createElement("button");l.className="plain-btn chat-close",l.textContent="닫기",l.addEventListener("click",()=>i()),o.append(r,a,l),this.sheet.appendChild(o),this.sheet.addEventListener("click",d=>{d.target===this.sheet&&i()}),e.appendChild(this.sheet),this.log=document.createElement("div"),this.log.className="chat-log",this.log.hidden=!0,e.appendChild(this.log)}onSend;onClose;sheet;log;lines=[];hideTimer=null;send(e,t){this.onSend(e,t),this.onClose()}get visible(){return!this.sheet.hidden}show(){this.sheet.hidden=!1}hide(){this.sheet.hidden=!0}add(e,t){this.lines.push(`${e}: ${t}`),this.lines.length>5&&this.lines.shift(),this.log.innerHTML="";for(const n of this.lines){const i=document.createElement("div");i.textContent=n,this.log.appendChild(i)}this.log.hidden=!1,this.hideTimer&&window.clearTimeout(this.hideTimer),this.hideTimer=window.setTimeout(()=>{this.log.hidden=!0,this.lines.length=0},8e3)}}class oy{constructor(e,t,n,i=()=>{}){this.onPick=n,this.onClose=i,this.sheet=document.createElement("div"),this.sheet.className="chat-panel pet-names",this.sheet.hidden=!0;const o=document.createElement("div");o.className="chat-card",this.title=document.createElement("div"),this.title.className="bag-title",this.title.textContent="🐾 이름 고르기";const r=document.createElement("div");r.className="chat-phrases";for(const l of t){const d=document.createElement("button");d.className="chat-phrase",d.textContent=l,d.addEventListener("click",()=>{this.mobId!==null&&this.onPick(this.mobId,l),this.hide()}),r.appendChild(d)}const a=document.createElement("button");a.className="plain-btn chat-close",a.textContent="닫기",a.addEventListener("click",()=>this.hide()),o.append(this.title,r,a),this.sheet.appendChild(o),this.sheet.addEventListener("click",l=>{l.target===this.sheet&&this.hide()}),e.appendChild(this.sheet)}onPick;onClose;sheet;title;mobId=null;get visible(){return!this.sheet.hidden}show(e,t){this.mobId=e,this.title.textContent=t?`🐾 ${t} — 다른 이름으로 바꾸기`:"🐾 이름 고르기",this.sheet.hidden=!1}hide(){this.sheet.hidden||(this.sheet.hidden=!0,this.mobId=null,this.onClose())}}class ry{constructor(e,t){this.deps=t,this.el=document.createElement("div"),this.el.className="bag-panel chest-panel",this.el.hidden=!0,this.el.innerHTML=`
      <div class="bag-card chest-card">
        <div class="bag-head">
          <div class="chest-title">상자</div>
          <button class="plain-btn chest-half">반만 옮기기: 꺼짐</button>
          <button class="plain-btn chest-close" aria-label="닫기">✕</button>
        </div>
        <div class="chest-body">
          <div class="chest-grid"></div>
          <div class="chest-label">내 가방</div>
          <div class="chest-bag"></div>
        </div>
      </div>`,e.appendChild(this.el),this.title=this.el.querySelector(".chest-title"),this.chestGrid=this.el.querySelector(".chest-grid"),this.bagGrid=this.el.querySelector(".chest-bag"),this.halfBtn=this.el.querySelector(".chest-half"),this.el.querySelector(".chest-close").addEventListener("click",()=>t.onClose()),this.el.addEventListener("click",n=>{n.target===this.el&&t.onClose()}),this.halfBtn.addEventListener("click",()=>{this.half=!this.half,this.halfBtn.textContent=`반만 옮기기: ${this.half?"켜짐":"꺼짐"}`,this.halfBtn.classList.toggle("on",this.half)})}deps;el;at=null;chest=[];bag=new Array(Ys).fill(null);selected=-1;half=!1;title;chestGrid;bagGrid;halfBtn;get visible(){return!this.el.hidden}get position(){return this.at}setChest(e,t,n,i){const o=!this.at||this.at.x!==e||this.at.y!==t||this.at.z!==n;this.at={x:e,y:t,z:n},this.chest=i,o&&(this.selected=-1),this.el.hidden=!1,this.render()}setInventory(e){this.bag=e,this.visible&&this.render()}hide(){this.el.hidden=!0,this.at=null,this.selected=-1}cell(e,t,n){const i=document.createElement("button");if(i.className="bag-cell"+(n?" hot":"")+(e===this.selected?" selected":""),i.title=t?`${this.deps.nameOf(t.item)} ×${t.count}`:"",t){const o=this.deps.icon(t.item,36);if(o&&i.appendChild(o),t.count>1){const r=document.createElement("span");r.className="bag-count",r.textContent=String(t.count),i.appendChild(r)}}return i.addEventListener("click",()=>this.tap(e)),i}render(){const e=this.chest.length===sf;this.title.textContent=`${e?"큰 상자":"상자"} (${this.chest.filter(Boolean).length}/${this.chest.length}칸 참)`,this.chestGrid.innerHTML="",this.chestGrid.classList.toggle("big",e);for(let n=0;n<this.chest.length;n++)this.chestGrid.appendChild(this.cell(n,this.chest[n],!1));this.bagGrid.innerHTML="";const t=this.chest.length;for(let n=0;n<Ys;n++)this.bagGrid.appendChild(this.cell(t+n,this.bag[n],n<rr))}slotAt(e){const t=this.chest.length;return e<t?this.chest[e]:this.bag[e-t]??null}tap(e){if(this.selected<0)this.slotAt(e)&&(this.selected=e);else if(this.selected===e)this.selected=-1;else{const t=this.slotAt(this.selected);if(t){const n=this.half?Math.max(1,Math.floor(t.count/2)):t.count;this.deps.onMove(this.selected,e,n)}this.selected=-1}this.render()}}let Ri=625341585;function ga(){return Ri^=Ri<<13,Ri^=Ri>>>17,Ri^=Ri<<5,(Ri>>>0)/4294967296}const fl=15,_a=2*Math.PI*fl,ay=["북","북동","동","남동","남","남서","서","북서"];class ly{el;touchUI;gaugeFg;hotbar;xpBar;xpFill;xpLevel;orbLayer;effects=[];slotEls=[];slotName;toastEl;debugEl;overlay;overlayTitle;overlaySub;overlayBtn;fullscreenBtn;debugBtn;bagBtn;rideBtn;skillBtn;heartsEl;armorEl;vignette;vignetteTimer=null;skillBox;staminaFill;staminaText;skillLabel="✨ 빔";familyBtn;familyText;timeChip;timeChipMin;timeChipSub;todayEl;todayTime;todayList;todayNote;approvalEl;approvalText;today=null;approveChip;approveChipText;pending=[];currentAsk=null;onCheckTodo=null;onApprove=null;chatBtn;helpEl;compassRose;compassLabels;compassText;lastBearing=NaN;onHelpToggle=null;villageEl;slots=[];selected=0;nameTimer=null;toastTimer=null;onSelect=null;onOverlayClick=null;timerEl;timerPhase;timerTime;actionEl;actionTitle;actionSub;actionBtn;actionAlt;onAction=null;onActionAlt=null;resultEl;onResultAgain=null;onResultClose=null;constructor(e,t){const n=document.createElement("div");n.className=`hud${t?" touch":""}`,n.innerHTML=`
      <div class="crosshair"></div>
      <svg class="gauge" viewBox="0 0 40 40" aria-hidden="true">
        <circle class="gauge-bg" cx="20" cy="20" r="${fl}"></circle>
        <circle class="gauge-fg" cx="20" cy="20" r="${fl}"></circle>
      </svg>
      <div class="slot-name"></div>
      <div class="armor" aria-label="방어" hidden></div>
      <div class="hearts" aria-label="체력" hidden></div>
      <div class="raid-bar" hidden></div>
      <div class="boss-bar" hidden><div class="boss-name"></div><div class="boss-track"><div class="boss-fill"></div></div><div class="boss-text"></div></div>
      <div class="hurt-vignette"></div>
      <div class="xp-bar" hidden><div class="xp-fill"></div><div class="xp-level"></div></div>
      <div class="xp-orbs"></div>
      <div class="hotbar"></div>
      <div class="side-btns">
        <button class="sbtn bag-btn" aria-label="가방">🎒</button>
        <button class="sbtn chat-btn" aria-label="채팅">💬</button>
      </div>
      <button class="sbtn ride-btn" aria-label="드래곤에서 내리기" hidden>🐉 내리기</button>
      <div class="skill-box" hidden>
        <button class="sbtn skill-btn" aria-label="빔 쏘기">✨ 빔</button>
        <div class="stamina-bar" aria-label="기력"><div class="stamina-fill"></div><div class="stamina-text"></div></div>
        <div class="dragon-hp" aria-label="드래곤 체력"><div class="dragon-hp-fill"></div><div class="dragon-hp-text"></div></div>
      </div>
      <div class="touch-controls">
        <div class="stick-base" hidden><div class="stick-knob"></div></div>
        <button class="tbtn jump" aria-label="점프">▲</button>
        <button class="tbtn sneak" aria-label="웅크리기">▼</button>
        <button class="tbtn guard" aria-label="방패로 막기" hidden>🛡️</button>
      </div>
      <div class="compass" aria-label="나침반">
        <div class="compass-dial">
          <div class="compass-rose">
            <span class="compass-label compass-n">북</span>
            <span class="compass-label compass-e">동</span>
            <span class="compass-label compass-s">남</span>
            <span class="compass-label compass-w">서</span>
            <span class="compass-home" hidden></span>
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
      <div class="exp-timer" hidden><span class="exp-phase"></span><span class="exp-time"></span></div>
      <button class="time-chip" hidden aria-label="오늘 남은 시간과 할 일"><span class="time-chip-min"></span><span class="time-chip-sub"></span></button>
      <button class="time-chip approve-chip" hidden aria-label="승인 기다리는 할 일"><span class="approve-chip-text"></span></button>
      <div class="approval-card" hidden>
        <div class="approval-text"></div>
        <div class="approval-btns"><button class="big-btn approval-ok">승인</button><button class="plain-btn approval-no">아직</button><button class="plain-btn approval-later">나중에</button></div>
      </div>
      <div class="today-panel" hidden>
        <div class="help-card today-card">
          <div class="help-head">
            <h2>오늘</h2>
            <button class="help-close today-close" aria-label="닫기">✕</button>
          </div>
          <div class="today-time"></div>
          <ul class="today-list"></ul>
          <p class="today-note"></p>
        </div>
      </div>
      <pre class="debug-text" hidden></pre>
      <div class="toast" hidden></div>
      <div class="guide" hidden></div>
      <div class="action-card" hidden>
        <div class="action-title"></div>
        <div class="action-sub"></div>
        <button class="big-btn action-btn"></button>
        <button class="big-btn small action-alt" hidden></button>
      </div>
      <div class="result-panel" hidden>
        <div class="result-card">
          <h2 class="result-title"></h2>
          <p class="result-sub"></p>
          <ul class="result-items"></ul>
          <div class="result-buttons">
            <button class="big-btn result-again"></button>
            <button class="plain-btn result-close">마을 구경하기</button>
          </div>
        </div>
      </div>
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
          <p class="help-village"></p>
          <div class="help-family">
            <span class="help-family-text"></span>
            <button class="plain-btn help-family-btn">가족 연결</button>
          </div>
        </div>
      </div>`,e.appendChild(n),this.el=n;const i=a=>n.querySelector(a);this.gaugeFg=i(".gauge-fg"),this.gaugeFg.style.strokeDasharray=`${_a}`,this.gaugeFg.style.strokeDashoffset=`${_a}`,this.hotbar=i(".hotbar"),this.heartsEl=i(".hearts"),this.armorEl=i(".armor"),this.vignette=i(".hurt-vignette"),this.xpBar=i(".xp-bar"),this.xpFill=i(".xp-fill"),this.xpLevel=i(".xp-level"),this.orbLayer=i(".xp-orbs"),this.slotName=i(".slot-name"),this.toastEl=i(".toast"),this.debugEl=i(".debug-text"),this.overlay=i(".overlay"),this.overlayTitle=i(".overlay-title"),this.overlaySub=i(".overlay-sub"),this.overlayBtn=i(".overlay .overlay-btn"),this.fullscreenBtn=i(".fullscreen"),this.debugBtn=i(".debug"),this.bagBtn=i(".bag-btn"),this.rideBtn=i(".ride-btn"),this.skillBtn=i(".skill-btn"),this.skillBox=i(".skill-box"),this.staminaFill=i(".stamina-fill"),this.staminaText=i(".stamina-text"),this.familyBtn=i(".help-family-btn"),this.familyText=i(".help-family-text"),this.timeChip=i(".time-chip"),this.timeChipMin=i(".time-chip-min"),this.timeChipSub=i(".time-chip-sub"),this.todayEl=i(".today-panel"),this.todayTime=i(".today-time"),this.todayList=i(".today-list"),this.todayNote=i(".today-note"),this.approvalEl=i(".approval-card"),this.approvalText=i(".approval-text"),this.approveChip=i(".approve-chip"),this.approveChipText=i(".approve-chip-text"),this.approveChip.addEventListener("click",a=>{a.preventDefault();const l=this.pending[0];l&&this.showApproval(l)}),this.timeChip.addEventListener("click",a=>{a.preventDefault(),this.todayEl.hidden?this.showToday():this.hideToday()}),i(".today-close").addEventListener("click",()=>this.hideToday()),this.todayEl.addEventListener("click",a=>{a.target===this.todayEl&&this.hideToday()}),i(".approval-ok").addEventListener("click",()=>this.decideApproval(!0)),i(".approval-no").addEventListener("click",()=>this.decideApproval(!1)),i(".approval-later").addEventListener("click",()=>this.decideApproval(null)),this.chatBtn=i(".chat-btn"),this.helpEl=i(".help-panel"),this.compassRose=i(".compass-rose"),this.compassLabels=Array.from(n.querySelectorAll(".compass-label")),this.compassText=i(".compass-text"),i(".help-body").innerHTML=cy(t);const o=a=>{a.preventDefault(),this.showHelp()},r=a=>{a.preventDefault(),this.hideHelp()};this.helpEl.addEventListener("click",a=>{a.target===this.helpEl&&this.hideHelp()}),i(".sbtn.help").addEventListener("click",o),i(".overlay .overlay-help").addEventListener("click",o),i(".help-panel .help-close").addEventListener("click",r),i(".help-ok").addEventListener("click",r),this.villageEl=i(".help-village"),this.timerEl=i(".exp-timer"),this.timerPhase=i(".exp-phase"),this.timerTime=i(".exp-time"),this.actionEl=i(".action-card"),this.actionTitle=i(".action-title"),this.actionSub=i(".action-sub"),this.actionBtn=i(".action-btn"),this.actionBtn.addEventListener("click",a=>{a.preventDefault(),this.onAction?.()}),this.actionAlt=i(".action-alt"),this.actionAlt.addEventListener("click",a=>{a.preventDefault(),this.onActionAlt?.()}),this.resultEl=i(".result-panel"),i(".result-again").addEventListener("click",()=>{this.hideResult(),this.onResultAgain?.()}),i(".result-close").addEventListener("click",()=>{this.hideResult(),this.onResultClose?.()}),this.touchUI={surface:n,stickBase:i(".stick-base"),stickKnob:i(".stick-knob"),jumpButton:i(".jump"),sneakButton:i(".sneak"),guardButton:i(".guard")},this.overlayBtn.addEventListener("click",()=>this.onOverlayClick?.()),this.overlay.addEventListener("click",a=>{a.target===this.overlay&&this.onOverlayClick?.()})}setFullscreen(e){const t=this.fullscreenBtn;t.hidden=e==="hidden",t.classList.toggle("active",e==="on"),t.textContent=e==="on"?"⛶ 전체화면 끄기":"⛶ 전체화면",t.setAttribute("aria-label",e==="on"?"전체화면 끄기":"전체화면")}setSlots(e){const t=this.slotEls.length!==e.length;this.slots=e,t&&(this.hotbar.innerHTML="",this.slotEls.length=0,e.forEach((n,i)=>{const o=document.createElement("div");o.className="slot",o.dataset.index=String(i);const r=document.createElement("span");r.className="slot-key",r.textContent=String((i+1)%10),o.appendChild(r),o.addEventListener("pointerdown",a=>{a.preventDefault(),a.stopPropagation(),this.select(i),this.onSelect?.(i)}),this.hotbar.appendChild(o),this.slotEls.push(o)})),e.forEach((n,i)=>this.paintSlot(i,n)),t?this.select(0,!1):this.select(this.selected,!1)}paintSlot(e,t){const n=this.slotEls[e];if(n&&(n.querySelectorAll("canvas, .slot-count").forEach(i=>i.remove()),n.classList.toggle("empty",t.item===null),t.icon&&n.appendChild(t.icon),t.count>1)){const i=document.createElement("span");i.className="slot-count",i.textContent=String(t.count),n.appendChild(i)}}select(e,t=!0){this.slots.length!==0&&(e=(e%this.slots.length+this.slots.length)%this.slots.length,this.selected=e,this.slotEls.forEach((n,i)=>n.classList.toggle("selected",i===e)),t&&this.showSlotName(this.slots[e].item?this.slots[e].name:"빈 칸"))}selectDelta(e){this.select(this.selected+e)}get selectedIndex(){return this.selected}get selectedItem(){return this.slots[this.selected]?.item??null}showSlotName(e){this.slotName.textContent=e,this.slotName.classList.add("show"),this.nameTimer&&window.clearTimeout(this.nameTimer),this.nameTimer=window.setTimeout(()=>this.slotName.classList.remove("show"),1200)}setCompassTarget(e,t){const n=this.el.querySelector(".compass-home");if(e===null){n.hidden||(n.hidden=!0),this.compassTargetLabel!==null&&(this.compassTargetLabel=null,this.lastBearing=-999);return}n.hidden=!1,n.style.transform=`rotate(${e}deg) translateY(-23px)`,this.compassTargetLabel!==t&&(this.compassTargetLabel=t,this.lastBearing=-999)}compassTargetLabel=null;setHeading(e){const t=(-e*180/Math.PI%360+360)%360;if(!(Math.abs(t-this.lastBearing)<.3)){this.lastBearing=t,this.compassRose.style.transform=`rotate(${-t}deg)`;for(const n of this.compassLabels)n.style.transform=`rotate(${t}deg)`;this.compassText.textContent=ay[Math.round(t/45)%8]+(this.compassTargetLabel?` · ${this.compassTargetLabel}`:"")}}get todayVisible(){return!this.todayEl.hidden}setToday(e){if(this.today=e,!e){this.timeChip.hidden=!0,this.todayEl.hidden=!0;return}this.timeChip.hidden=!1;const t=e.todos.filter(n=>n.status==="approved").length;this.timeChipMin.textContent=`⏱ ${e.remainingMin}분`,this.timeChipSub.textContent=e.todos.length?`할 일 ${t}/${e.todos.length}`:"",this.timeChip.classList.toggle("warn",e.remainingMin>0&&e.remainingMin<=5),this.timeChip.classList.toggle("danger",e.remainingMin<=0),this.renderToday()}renderToday(){const e=this.today;if(!e)return;const t=e.manualAdj?` ${e.manualAdj>0?"+":"−"}${Math.abs(e.manualAdj)}분 조정`:"";this.todayTime.innerHTML="";const n=document.createElement("div");n.className="today-remaining",n.textContent=`남은 시간 ${e.remainingMin}분`;const i=document.createElement("div");if(i.className="today-detail",i.textContent=`기본 ${e.baseMin}분 + 보너스 ${e.bonusMin}/${e.bonusCap}분${t} − 쓴 ${e.usedMin}분`,this.todayTime.append(n,i),this.todayList.innerHTML="",e.todos.length===0){const r=document.createElement("li");r.className="today-empty",r.textContent="오늘 할 일이 없어요. 아빠·엄마가 /family 에서 만들어요",this.todayList.appendChild(r)}for(const r of e.todos){const a=document.createElement("li"),l=document.createElement("span");if(l.className="todo-title",l.textContent=r.title,a.appendChild(l),r.status==="pending"||r.status==="rejected"){if(r.status==="rejected"){const u=document.createElement("span");u.className="todo-state",u.textContent="다시 해 봐요",a.appendChild(u)}const d=document.createElement("button");d.className="todo-btn",d.textContent="했어요",d.addEventListener("click",()=>{d.disabled=!0,this.onCheckTodo?.(r.id)}),a.appendChild(d)}else{const d=document.createElement("span");d.className="todo-state",d.textContent=r.status==="approved"?"✅ 했어요":"⏳ 확인 기다리는 중",a.appendChild(d)}this.todayList.appendChild(a)}for(const r of e.adjustments){const a=document.createElement("li");a.className="today-adjust";const l=document.createElement("span");l.className="todo-title",l.textContent=`아빠·엄마 조정 ${r.min>0?"+":"−"}${Math.abs(r.min)}분${r.reason?` — ${r.reason}`:""}`,a.appendChild(l),this.todayList.appendChild(a)}const o=[];e.weekMessage?o.push(e.weekMessage):o.push("처음이니까 믿고 시작할게. 이번 주 할 일을 잘하면 다음 주 보너스가 정해져요."),e.noPlayToday&&o.push("오늘은 게임 없는 날이에요."),e.todos.some(r=>r.needsApproval)&&o.push("아빠·엄마가 확인해 주면 시간이 더 생겨요."),e.blocked?o.push(e.nextOpen?`지금은 게임 시간이 아니에요. ${e.nextOpen} 에 열려요.`:"지금은 게임 시간이 아니에요."):e.minutesUntilBlocked<1440&&o.push(`게임 시간은 ${e.minutesUntilBlocked}분 뒤에 끝나요.`),o.push(e.enforced?"남은 시간이 0 이 되면 마을에서 나가요. 5분 동안 가만히 있어도 나가요.":"지금은 시간을 재기만 해요. 0 이 돼도 게임은 계속돼요."),this.todayNote.textContent=o.join(" ")}showToday(){this.today&&(this.renderToday(),this.todayEl.hidden=!1)}hideToday(){this.todayEl.hidden=!0}setPending(e){this.pending=e,this.approveChip.hidden=e.length===0,this.approveChipText.textContent=`✅ 승인 ${e.length}`,this.currentAsk&&!e.some(t=>t.id===this.currentAsk.id&&t.date===this.currentAsk.date)&&(this.currentAsk=null,this.approvalEl.hidden=!0)}showApproval(e){this.currentAsk=e;const t=this.pending.filter(n=>!(n.id===e.id&&n.date===e.date)).length;this.approvalText.textContent=`${e.child}: "${e.title}" 했대요. 확인해 주세요${t>0?` (${t}개 더 기다려요)`:""}`,this.approvalEl.hidden=!1}decideApproval(e){const t=this.currentAsk;this.currentAsk=null,this.approvalEl.hidden=!0,!(!t||e===null)&&(this.onApprove?.(t,e),this.setPending(this.pending.filter(n=>!(n.id===t.id&&n.date===t.date))))}setHealth(e,t){this.heartsEl.hidden=!1;const n=Math.ceil(t/2);let i="";for(let o=0;o<n;o++){const r=Math.max(0,Math.min(2,e-o*2));i+=`<span class="heart ${r===2?"full":r===1?"half":"empty"}"></span>`}this.heartsEl.innerHTML=i,this.heartsEl.classList.toggle("low",e<=6)}setGuardAvailable(e){const t=this.el.querySelector(".tbtn.guard");t.hidden!==!e&&(t.hidden=!e)}setGuarding(e){this.el.querySelector(".tbtn.guard").classList.toggle("active",e)}setDragonHp(e,t){const n=this.el.querySelector(".dragon-hp-fill"),i=this.el.querySelector(".dragon-hp-text");n.style.width=`${Math.round(Math.max(0,e)/Math.max(1,t)*100)}%`,n.classList.toggle("low",e<=t*.3),i.textContent=`🐉 ${Math.max(0,e)} / ${t}`}setGuide(e){const t=this.el.querySelector(".guide");if(!e){t.hidden=!0;return}t.hidden=!1,t.textContent=e}setArmor(e){if(e<=0){this.armorEl.hidden=!0;return}this.armorEl.hidden=!1;let t="";for(let n=0;n<10;n++){const i=Math.max(0,Math.min(2,e-n*2));t+=`<span class="armor-pt ${i===2?"full":i===1?"half":"empty"}"></span>`}this.armorEl.innerHTML=t}hurtFlash(){this.vignette.classList.add("on"),this.vignetteTimer&&clearTimeout(this.vignetteTimer),this.vignetteTimer=setTimeout(()=>this.vignette.classList.remove("on"),350)}setXp(e){const t=ar(e);this.xpBar.hidden=!1,this.xpFill.style.width=`${Math.round(t.progress*100)}%`,this.xpLevel.textContent=String(t.level),this.xpLevel.classList.toggle("zero",t.level===0)}xpOrbs(e,t,n,i=0){const o=this.xpBar.getBoundingClientRect(),r=this.el.getBoundingClientRect(),a=o.left+o.width/2-r.left,l=o.top+o.height/2-r.top;if(i>0){const d=document.createElement("div");d.className="xp-float",d.textContent=`+${i}`,d.style.left=`${a}px`,d.style.top=`${l-28}px`,d.style.opacity="0",this.orbLayer.appendChild(d),this.effects.push({el:d,kind:"label",t:0,delay:0,dur:1.6,sx:a,sy:l-28,mx:a,my:l-68,tx:a,ty:l-68})}for(let d=0;d<n;d++){const u=document.createElement("div");u.className="xp-orb",u.style.left=`${e}px`,u.style.top=`${t}px`,u.style.opacity="0",this.orbLayer.appendChild(u);const c=ga()*Math.PI*2,h=24+ga()*56;this.effects.push({el:u,kind:"orb",t:0,delay:d*.07,dur:1.1+ga()*.5,sx:e,sy:t,mx:e+Math.cos(c)*h,my:t+Math.sin(c)*h-40,tx:a,ty:l})}}tickEffects(e){if(this.effects.length===0)return;const t=n=>1-(1-n)*(1-n);for(let n=this.effects.length-1;n>=0;n--){const i=this.effects[n];i.t+=e;const o=Math.max(0,Math.min(1,(i.t-i.delay)/i.dur));if(i.t<i.delay)continue;let r,a,l,d;if(i.kind==="label")r=i.sx,a=i.sy+(i.ty-i.sy)*o,l=o<.2?.8+o/.2*.35:1.15-(o-.2)/.8*.15,d=o<.2?o/.2:1-(o-.2)/.8;else if(o<.3){const u=t(o/.3);r=i.sx+(i.mx-i.sx)*u,a=i.sy+(i.my-i.sy)*u,l=.6+.5*u,d=.9+.1*u}else{const u=(o-.3)/.7,c=u*u;r=i.mx+(i.tx-i.mx)*c,a=i.my+(i.ty-i.my)*c,l=1.1-.6*u,d=1-.8*u}i.el.style.left=`${r}px`,i.el.style.top=`${a}px`,i.el.style.opacity=String(d),i.el.style.transform=`translate(-50%, -50%) scale(${l.toFixed(3)})`,o>=1&&(i.el.remove(),this.effects.splice(n,1))}}setRiding(e,t="빔"){this.rideBtn.hidden=!e,this.skillBox.hidden=!e,this.skillLabel=`✨ ${t}`,this.skillBtn.textContent=this.skillLabel}setStamina(e,t,n,i){const o=t>0?Math.max(0,Math.min(1,e/t)):0;this.staminaFill.style.width=`${Math.round(o*100)}%`,this.staminaFill.classList.toggle("low",e<n),this.staminaText.textContent=`${Math.floor(e)} / ${t}`,this.skillBtn.disabled=i>0||e<n,this.skillBtn.classList.toggle("cooling",i>0);const r=i>0?`⏳ ${Math.ceil(i)}`:this.skillLabel;this.skillBtn.textContent!==r&&(this.skillBtn.textContent=r)}setFamily(e,t=null){if(t){this.familyText.textContent=`부모로 연결됨 (가족 코드 ${t}) — 아이가 할 일을 체크하면 승인 카드가 떠요`,this.familyBtn.hidden=!0;return}this.familyBtn.hidden=!1,this.familyText.textContent=e?`가족 연결됨 (코드 ${e}) — 위의 ⏱ 에서 오늘 할 일과 남은 시간을 봐요`:"아빠·엄마 화면(/family)의 가족 코드로 내 계정을 연결해요 (아이만)",this.familyBtn.textContent=e?"다시 연결":"가족 연결"}setVillageInfo(e){this.villageEl.textContent=e}setProgress(e){const t=e>0;this.gaugeFg.parentElement.classList.toggle("show",t),t&&(this.gaugeFg.style.strokeDashoffset=`${_a*(1-Math.min(1,e))}`)}toast(e,t=4e3){this.toastEl.textContent=e,this.toastEl.hidden=!1,this.toastTimer&&window.clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>this.toastEl.hidden=!0,t)}setDebug(e){this.debugEl.hidden=e===null,e!==null&&(this.debugEl.textContent=e)}setTimer(e,t){if(e===null){this.timerEl.hidden=!0;return}this.timerEl.hidden=!1;const n=Math.floor(e/60),i=Math.floor(e%60);this.timerTime.textContent=n+":"+String(i).padStart(2,"0"),this.timerPhase.textContent=t==="night"?"🌙 밤":t==="evening"?"🌇 저녁":"☀️ 낮",this.timerEl.classList.toggle("warn",e<=180),this.timerEl.classList.toggle("danger",e<=60),this.timerEl.classList.toggle("night",t==="night")}showAction(e,t,n,i,o){this.onAction=i,this.onActionAlt=o?.onClick??null,this.actionTitle.textContent!==e&&(this.actionTitle.textContent=e),this.actionSub.textContent!==t&&(this.actionSub.textContent=t),this.actionBtn.textContent!==n&&(this.actionBtn.textContent=n),o&&this.actionAlt.textContent!==o.label&&(this.actionAlt.textContent=o.label),this.actionAlt.hidden=!o,this.actionEl.hidden=!1}setBoss(e,t,n){const i=this.el.querySelector(".boss-bar");i.hidden=!1;const o=i.querySelector(".boss-name");o.textContent!==e&&(o.textContent=e),i.querySelector(".boss-fill").style.width=`${Math.max(0,Math.min(100,t/Math.max(1,n)*100))}%`;const r=`${t} / ${n}`,a=i.querySelector(".boss-text");a.textContent!==r&&(a.textContent=r)}setRaid(e,t=!1){const n=this.el.querySelector(".raid-bar");n.hidden=!1,n.textContent!==e&&(n.textContent=e),n.classList.toggle("danger",t)}hideRaid(){const e=this.el.querySelector(".raid-bar");e&&(e.hidden=!0)}hideBoss(){const e=this.el.querySelector(".boss-bar");e&&(e.hidden=!0)}hideAction(){this.actionEl.hidden=!0,this.onAction=null,this.onActionAlt=null}triggerAction(){this.actionEl.hidden||this.onAction?.()}get actionVisible(){return!this.actionEl.hidden}showResult(e,t,n,i,o,r){this.onResultAgain=o,this.onResultClose=r;const a=d=>this.resultEl.querySelector(d);a(".result-title").textContent=e,a(".result-sub").textContent=t;const l=a(".result-items");if(l.innerHTML="",n.length===0){const d=document.createElement("li");d.className="result-empty",d.textContent="이번엔 빈손이에요. 블록을 부수면 가져올 수 있어요",l.appendChild(d)}for(const d of n){const u=document.createElement("li");d.icon&&u.appendChild(d.icon);const c=document.createElement("span");c.className="result-name",c.textContent=d.name;const h=document.createElement("span");h.className="result-count",h.textContent="×"+d.count,u.append(c,h),l.appendChild(u)}a(".result-again").textContent=i,this.resultEl.hidden=!1}hideResult(){this.resultEl.hidden=!0}get resultVisible(){return!this.resultEl.hidden}showOverlay(e,t,n){this.overlayTitle.textContent=e,this.overlaySub.textContent=t,this.overlayBtn.textContent=n??"",this.overlayBtn.hidden=n===null,this.overlay.classList.add("show")}hideOverlay(){this.overlay.classList.remove("show")}get overlayVisible(){return this.overlay.classList.contains("show")}showHelp(){this.helpEl.hidden&&(this.helpEl.hidden=!1,this.helpEl.querySelector(".help-card").scrollTop=0,this.onHelpToggle?.(!0))}hideHelp(){this.helpEl.hidden||(this.helpEl.hidden=!0,this.onHelpToggle?.(!1))}get helpVisible(){return!this.helpEl.hidden}}function cy(s){const e=s?[["걷기","왼쪽 아래 <b>스틱</b>을 누른 채 밀기. 끝까지 앞으로 밀면 달리기"],["둘러보기","스틱이 아닌 곳을 <b>드래그</b>"],["블록 놓기","놓을 자리를 <b>짧게 탭</b>"],["블록 부수기","블록을 <b>꾹 누르기</b>. 게이지가 차고 금이 가면 부서져요"],["점프","오른쪽 아래 <b>▲</b> (꾹 누르면 그동안, <b>두 번 톡톡</b> 치면 손을 떼도 계속 눌린 채. 다시 한 번 누르면 풀려요)"],["웅크리기","<b>▼</b> (▲ 와 같아요 — 꾹 누르면 그동안, 두 번 톡톡 치면 계속). 웅크리면 모서리에서 안 떨어져요"],["블록 고르기","아래 칸(핫바)을 탭"],["가방 · 만들기","핫바 옆 <b>🎒</b>. 칸을 탭해 고르고 다른 칸을 탭하면 옮겨요"],["공격 · 막기","몹을 노리고 <b>짧게 탭</b>하면 때려요. 활·쇠뇌는 <b>꾹 누르면 시위를 당기고</b> 놓으면 쏴요(가득 당기면 세요). 방패를 끼면 <b>🛡️</b> 버튼이 생겨요 — 누르는 동안 몹 공격을 다 막고 천천히 걸어요"],["채팅","<b>💬</b> → 이모지나 문구를 골라요"],["FPS 보기","오른쪽 위 <b>i</b>"]]:[["걷기 / 달리기","<b>W A S D</b> / Ctrl 누른 채 W"],["둘러보기","마우스. 클릭하면 마우스가 잠기고, <b>ESC</b>로 풀려요"],["블록 놓기","<b>오른쪽 클릭</b> (누르고 있으면 연속)"],["블록 부수기","<b>왼쪽 클릭 꾹</b>. 금이 가면 부서져요"],["점프 / 웅크리기","<b>Space</b> / <b>Shift</b>"],["블록 고르기","<b>1~9, 0</b> 또는 마우스 휠"],["가방 · 만들기","<b>E</b> (또는 핫바 옆 🎒)"],["공격 · 막기","몹을 노리고 <b>클릭</b>(검). 활·쇠뇌는 <b>왼쪽 클릭을 누르고 있으면 당기고</b> 놓으면 쏴요. 방패를 끼고 <b>X</b> 를 누르는 동안 몹 공격을 다 막아요(천천히 걸어요)"],["채팅","<b>T</b> (또는 💬) → 이모지·문구 고르기"],["정보","<b>F3</b>"]],t=s?"PC 에서는: WASD 이동 · 마우스 둘러보기 · 왼쪽 클릭 꾹 부수기 · 오른쪽 클릭 놓기 · 1~9 블록":"폰에서는: 왼쪽 아래 스틱 · 드래그로 둘러보기 · 짧게 탭 놓기 · 꾹 눌러 부수기 · ▲ 점프",n=["왼쪽 위 <b>나침반</b>: 맨 위 글자가 지금 내가 보는 방향이에요(북은 빨강). 광장에서 북쪽에 포탈 자리와 강, 서쪽·동쪽에 큰 밭, 남쪽에 집 뼈대, 둘레는 참나무 숲과 언덕.","<b>블록은 유한</b>해요. 부수면 가방에 들어오고, 놓으면 가방에서 나가요. 처음엔 시작 키트(판자·흙·조약돌·횃불·유리·제작대·양동이)를 받아요. 물은 빈 양동이로 떠서 옮겨요.","<b>만들기</b>: 가방 화면의 🔨 탭. 판자·제작대 같은 건 어디서나, 문·계단 같은 건 <b>제작대</b>를 놓고 그 옆(5칸)에서. 양조기 옆에서는 ⚗️ 탭이 생겨요. 레시피는 아빠·아들이 recipes.json 에 적어요.","한 칸 높은 턱은 그냥 걸어가면 올라가요. 두 칸부터는 점프.","손에 든 블록이 오른쪽 아래에 보이고, 조준한 블록엔 검은 테두리가 생겨요. 닿는 거리는 5블록.","블록마다 부수는 시간이 달라요. 흙·모래 0.5초, 돌 1.5초, 원목·판자 2초. 맨 아래 기반암과 물은 못 부숴요.","내 몸이 있는 자리에는 블록을 놓을 수 없어요.","물에 들어가면 천천히 가라앉고, 점프를 누르면 위로 헤엄쳐요.","내가 놓은 물·용암은 양동이 하나만큼이에요. 사방으로 퍼지면서 낮아지고, 양만큼만 퍼지고 멈춰요(위로는 안 차요). 강·연못 같은 원래 있던 물은 마르지 않아요. 물이나 용암을 꾹 누르면(PC: 왼쪽 클릭) 떠내거나 닦아낼 수 있어요. 물이 용암을 만나면 돌이 돼요.","광장 남쪽에 뼈대만 있는 집이 있어요. 문·창문·지붕을 채워 봐요. 동남쪽 언덕엔 동굴 입구가 있고 땅속엔 광물과 동굴이 있어요.",'<b>원정</b>: 광장 북쪽 보라색 포탈 안에 서면 "원정 출발" 버튼이 나와요. 초원 섬에 10분 동안 다녀오는데, 6분이 지나면 밤이 돼요. 섬 가운데 포탈로 돌아오면 부순 블록을 마을 창고에 가져와요. 시간이 다 되면 저절로 돌아오지만 절반만 가져와요. 친구가 먼저 갔으면 같은 포탈에서 "따라가기".',"세계 끝은 보이지 않는 벽. 떨어지면 광장으로 돌아와요.","만든 것은 서버에 저장돼요. 같은 마을 코드로 들어오면 어느 폰·PC 에서도 같은 마을이에요. 친구에게 마을 코드 6자리를 알려 주면 함께 지을 수 있어요(6명까지).",'다른 사람이 놓거나 부순 블록도 바로 보여요. 서버가 "너무 멀어요" 같은 말을 하면 그 블록은 되돌아가요.',"<b>체력</b>: 하트 10개. 4칸 넘게 떨어지면 아프고, 원정 밤엔 좀비·크리퍼·거미·스켈레톤이 와요. 몹을 노리고 탭하면 때려요(검이 세요). 하트가 다 떨어지면 경험치를 초록 구슬로 떨어뜨리고 포탈 앞(마을은 광장)에서 다시 — 구슬을 밟으면 되찾아요.","<b>경험치·드래곤</b>: 원정 귀환·블록 발견·몹 잡기로 경험치. 레벨을 써서 광장 남쪽 둥지에서 드래곤 알을 부화시키고, 어른이 되면 안장(가죽 5 + 철 2)을 얹어 타고 날아요. 타고 ✨ 를 누르면 빔!",'<b>갑옷·방패·활</b>: 가죽(제작대)이나 철·황금·다이아몬드(대장간)로 투구·흉갑·레깅스·부츠를 만들어 가방에서 "🛡️ 입기". 방패를 끼우면 몹 피해가 반으로. 활(막대기 3 + 실 3)과 화살(부싯돌·막대기·깃털)을 들면 멀리 있는 몹도 쏴요.',"<b>동물</b>: 광장에서 50칸쯤 바깥 숲에 소·돼지·양·닭·강아지가 무리로 살아요. 먹이(밀·당근·씨앗)를 들면 따라오고, 둘에게 먹이면 아기가 태어나요. 강아지는 뼈로 길들여 펫으로 — 이름도 지어 줄 수 있어요. 가위로 양털, 빈손으로 닭을 탭하면 달걀.","<b>마을 창고·건물</b>: 광장 동쪽 창고에 재료를 모아 대장간·농장·등대·포탈 2단계를 지어요. 건물이 늘면 마을 레벨이 오르고 깃발이 늘어요. 마을 레벨 2부터 깃대 옆에서 우민 방어전을 열 수 있어요(주 2회)."];return`<table class="help-table">${e.map(([i,o])=>`<tr><th>${i}</th><td>${o}</td></tr>`).join("")}</table><p class="help-other">${t}</p><h3>알아두면 좋아요</h3><ul class="help-tips">${n.map(i=>`<li>${i}</li>`).join("")}</ul>`}function dy(s,e){if(s===null)return"어른";const t=s-e;if(t<=0)return"곧 어른이 돼요";const n=Math.ceil(t/6e4);return n>=60?`어른까지 ${Math.floor(n/60)}시간 ${n%60}분`:`어른까지 ${n}분`}class hy{constructor(e,t){this.deps=t,this.el=document.createElement("div"),this.el.className="nest-panel",this.el.hidden=!0,this.el.innerHTML=`
      <div class="help-card nest-card">
        <div class="help-head">
          <h2>🥚 드래곤 둥지</h2>
          <button class="help-close nest-close" aria-label="닫기">✕</button>
        </div>
        <div class="nest-body"></div>
      </div>`,e.appendChild(this.el),this.body=this.el.querySelector(".nest-body"),this.el.querySelector(".nest-close").addEventListener("click",()=>t.onClose()),this.el.addEventListener("click",n=>{n.target===this.el&&t.onClose()})}deps;el;inv=[];mine=[];slots=[];nestDragons=[];xpTotal=0;body;get visible(){return!this.el.hidden}show(){this.el.hidden=!1,this.render()}hide(){this.el.hidden=!0}setInventory(e){this.inv=e,this.visible&&this.render()}setDragons(e){this.mine=e,this.visible&&this.render()}setNest(e,t){this.slots=e,t&&(this.nestDragons=t),this.visible&&this.render()}setXp(e){this.xpTotal=e,this.visible&&this.render()}eggsInBag(){const e=new Map;for(const t of this.inv)t&&mu(t.item)&&e.set(t.item,(e.get(t.item)??0)+t.count);return[...e].map(([t,n])=>({item:t,count:n}))}countOf(e){let t=0;for(const n of this.inv)n&&n.item===e&&(t+=n.count);return t}chip(e){const t=document.createElement("span");return t.className="nest-chip",t.style.background=e??"#999",t}render(){const e=this.body;e.innerHTML="";const t=ar(this.xpTotal).level,n=this.eggsInBag(),i=this.deps.now?this.deps.now():Date.now(),o=document.createElement("p");o.className="nest-note",o.textContent=`내 레벨 ${t} · 가방에 알 ${n.reduce((h,f)=>h+f.count,0)}개 · 내 드래곤 ${this.mine.filter(h=>h.stage!=="egg").length}마리`,e.appendChild(o);const r=document.createElement("div");r.className="nest-slots";const a=this.deps.eggSlots();for(let h=0;h<a;h++){const f=document.createElement("div");f.className="nest-slot";const _=this.slots.find(p=>p.slot===h),g=document.createElement("div");if(g.className="nest-slot-title",_){const p=this.deps.dragons.find(_.dragon);if(g.append(this.chip(p?.color),document.createTextNode(` ${p?.name??_.dragon} 알 — ${_.mine?"내 것":`${_.owner} 것`}`)),f.appendChild(g),_.mine&&p){const m=gu(this.deps.xp,p.tier),M=t>=m,w=document.createElement("button");w.className="big-btn nest-btn",w.textContent=M?`부화하기 (레벨 ${m} 씀)`:`부화하려면 레벨 ${m} (지금 ${t})`,w.disabled=!M,w.addEventListener("click",()=>this.deps.onHatch(_.id)),f.appendChild(w)}}else{g.textContent=`${h+1}번 자리 — 비었어요`,f.appendChild(g);for(const p of n){const m=document.createElement("button");m.className="plain-btn nest-btn",m.textContent=`${this.deps.nameOf(p.item)} 놓기${p.count>1?` (${p.count})`:""}`,m.addEventListener("click",()=>this.deps.onPlace(h,p.item)),f.appendChild(m)}if(n.length===0){const p=document.createElement("div");p.className="nest-hint",p.textContent="제작대에서 재료로 알을 만들어 와요",f.appendChild(p)}}r.appendChild(f)}if(a<_u){const h=document.createElement("div");h.className="nest-hint",h.textContent=`알 자리 ${a}개 · 창고에서 ${a<6?"큰 둥지를":"드래곤 성을"} 지으면 2개 더 열려요`,r.appendChild(h)}e.appendChild(r);const l=document.createElement("h3");l.textContent=`둥지의 드래곤 ${this.nestDragons.length}마리`,e.appendChild(l);const d=document.createElement("ul");if(d.className="nest-list",this.nestDragons.length===0){const h=document.createElement("li");h.className="nest-hint",h.textContent="아직 없어요. 알을 놓고 부화시켜요!",d.appendChild(h)}const u=[...this.nestDragons].sort((h,f)=>Number(f.mine)-Number(h.mine)||h.id-f.id);for(const h of u){const f=this.deps.dragons.find(h.dragon),_=document.createElement("li"),g=document.createElement("div");if(g.append(this.chip(f?.color),document.createTextNode(` ${f?.name??h.dragon} · ${h.stage==="baby"?"아기":"어른"} · ${h.mine?"내 것":`${h.owner} 것`}`)),_.appendChild(g),h.stage==="adult"&&h.mine){const p=document.createElement("div");if(p.className="nest-feed",h.restingUntil&&h.restingUntil>Date.now()){const m=document.createElement("span");m.className="nest-hint",m.textContent=`😵 쓰러져서 쉬는 중 — ${Math.max(1,Math.ceil((h.restingUntil-Date.now())/6e4))}분 뒤에 탈 수 있어요`,p.appendChild(m)}else if(this.countOf(zd)>0){const m=document.createElement("button");m.className="big-btn nest-btn",m.textContent="🐉 타기",m.addEventListener("click",()=>this.deps.onRide(h.id)),p.appendChild(m)}else{const m=document.createElement("span");m.className="nest-hint",m.textContent="안장이 있으면 탈 수 있어요 (제작대: 가죽 5 + 철 2, 가죽은 소에서)",p.appendChild(m)}_.appendChild(p)}if(h.stage==="baby"){const p=document.createElement("div");if(p.className="nest-hint",p.textContent=dy(h.growAt,i)+(h.mine?` · 먹이 ${h.fed}개 줬어요`:""),_.appendChild(p),h.mine&&f){const m=document.createElement("div");m.className="nest-feed";const M=vu(f);let w=!1;for(const b of M){const R=this.countOf(b);if(R<=0)continue;w=!0;const v=document.createElement("button");v.className="plain-btn nest-btn",v.textContent=`${this.deps.nameOf(b)} 먹이기 (${R})`,v.addEventListener("click",()=>this.deps.onFeed(h.id,b)),m.appendChild(v)}if(!w){const b=document.createElement("span");b.className="nest-hint",b.textContent=`먹이: ${M.map(R=>this.deps.nameOf(R)).join("·")} (1개 = 10분 빨리 자라요)`,m.appendChild(b)}_.appendChild(m)}}d.appendChild(_)}e.appendChild(d);const c=document.createElement("p");c.className="nest-note",c.textContent="아기는 1시간이면 어른이 돼요(먹이로 더 빨리). 어른은 안장을 만들어 탈 수 있어요. 빔은 다음 단계에서.",e.appendChild(c)}}const uy=150,yd=400,gr=new Tl(1,1,1,10,1,!0);gr.rotateX(Math.PI/2);gr.translate(0,0,.5);class fy{group=new Et;beams=[];constructor(e){e.add(this.group)}get count(){return this.beams.length}fire(e,t,n,i,o=af,r=performance.now()){const a=Math.max(1,Math.min(5,i)),l=.12+.07*a,d=new je(n),u=new dt(gr,new zt({color:d.clone().lerp(new je(16777215),.4),transparent:!0,opacity:.95,blending:xs,depthWrite:!1,side:sn})),c=new dt(gr,new zt({color:d,transparent:!0,opacity:.35+.08*a,blending:xs,depthWrite:!1,side:sn}));u.scale.set(l*.45,l*.45,.01),c.scale.set(l,l,.01);const h=new Et;h.add(c,u),h.position.set(e.x,e.y,e.z);const f=Math.hypot(t.x,t.y,t.z)||1;h.lookAt(e.x+t.x/f,e.y+t.y/f,e.z+t.z/f),this.group.add(h),this.beams.push({group:h,core:u,glow:c,born:r,range:o})}update(e=performance.now()){for(let t=this.beams.length-1;t>=0;t--){const n=this.beams[t],i=e-n.born;if(i>=qs){this.group.remove(n.group),n.core.material.dispose(),n.glow.material.dispose(),this.beams.splice(t,1);continue}const o=n.range*Math.min(1,i/uy);n.core.scale.z=o,n.glow.scale.z=o;const r=i>qs-yd?(qs-i)/yd:1,a=1+.12*Math.sin(i*.03);n.core.material.opacity=.95*r,n.glow.material.opacity=(.35+.08*(n.glow.scale.x-.12)/.07)*r*a}}dispose(){for(const e of this.beams)this.group.remove(e.group),e.core.material.dispose(),e.glow.material.dispose();this.beams.length=0}}class py{constructor(e,t){this.deps=t,this.el=document.createElement("div"),this.el.className="bag-panel storage-panel",this.el.hidden=!0,this.el.innerHTML=`
      <div class="bag-card storage-card">
        <div class="bag-head">
          <div class="bag-tabs storage-tabs"></div>
          <button class="plain-btn storage-close" aria-label="닫기">✕</button>
        </div>
        <div class="storage-title"></div>
        <div class="storage-body"></div>
      </div>`,e.appendChild(this.el),this.title=this.el.querySelector(".storage-title"),this.tabs=this.el.querySelector(".storage-tabs"),this.body=this.el.querySelector(".storage-body"),this.el.querySelector(".storage-close").addEventListener("click",()=>t.onClose()),this.el.addEventListener("click",n=>{n.target===this.el&&t.onClose()})}deps;el;inv=[];stock=new Map;built=new Set;level=1;codexCount=0;tab="stock";title;tabs;body;get visible(){return!this.el.hidden}show(e="stock"){this.tab=e,this.el.hidden=!1,this.render()}hide(){this.el.hidden=!0}setInventory(e){this.inv=e,this.visible&&this.render()}setStorage(e){this.stock=new Map(e.map(t=>[t.item,t.count])),this.visible&&this.render()}setVillage(e,t,n){this.built=new Set(e),this.level=t,this.codexCount=n,this.visible&&this.render()}mine(e){let t=0;for(const n of this.inv)n&&n.item===e&&(t+=n.count);return t}render(){const e=this.body.querySelector(".storage-list")?.scrollTop??0;this.tabs.innerHTML="";const t=[["stock","📦 창고"],["build","🏗️ 건물"]];for(const[i,o]of t){const r=document.createElement("button");r.className="bag-tab"+(this.tab===i?" on":""),r.textContent=o,r.addEventListener("click",()=>{this.tab=i,this.render()}),this.tabs.appendChild(r)}this.title.textContent=`🏘️ 마을 레벨 ${this.level} · 건물 ${this.built.size}개 · 도감 ${this.codexCount}종`,this.body.innerHTML="",this.tab==="stock"?this.renderStock():this.renderBuild();const n=this.body.querySelector(".storage-list");n&&e>0&&(n.scrollTop=e)}btn(e,t,n,i=!1){const o=document.createElement("button");return o.className=t,o.textContent=e,o.disabled=i,o.addEventListener("click",n),o}renderStock(){const e=document.createElement("p");e.className="bag-tip",e.textContent="마을 모두가 같이 쓰는 창고예요. 넣은 재료로 건물을 지어요. 누가 얼마나 넣었는지는 세지 않아요.",this.body.appendChild(e);const t=new Set([...this.stock.keys()]);for(const o of this.inv)o&&t.add(o.item);const n=document.createElement("div");n.className="storage-list";const i=[...t].sort((o,r)=>(this.stock.get(r)??0)-(this.stock.get(o)??0)||o.localeCompare(r));for(const o of i){const r=this.stock.get(o)??0,a=this.mine(o),l=document.createElement("div");l.className="storage-row";const d=this.deps.icon(o,28);d&&l.appendChild(d);const u=document.createElement("div");u.className="storage-text",u.innerHTML=`<b>${this.deps.nameOf(o)}</b><br><span class="storage-sub">창고 ${r} · 내 가방 ${a}</span>`,l.appendChild(u);const c=document.createElement("div");c.className="storage-acts",a>=1&&c.append(this.btn("넣기 1","plain-btn small",()=>this.deps.onMove(o,1,"in"))),a>16&&c.append(this.btn("넣기 16","plain-btn small",()=>this.deps.onMove(o,16,"in"))),a>=2&&c.append(this.btn(`전부 넣기 ${a}`,"plain-btn small",()=>this.deps.onMove(o,Math.min(a,999),"in"))),r>=1&&c.append(this.btn("꺼내기 1","plain-btn small",()=>this.deps.onMove(o,1,"out"))),r>16&&c.append(this.btn("꺼내기 16","plain-btn small",()=>this.deps.onMove(o,16,"out"))),r>=2&&c.append(this.btn(r>999?"꺼내기 999":`전부 꺼내기 ${r}`,"plain-btn small",()=>this.deps.onMove(o,Math.min(r,999),"out"))),l.appendChild(c),n.appendChild(l)}i.length===0&&(n.textContent="창고도 가방도 비어 있어요. 원정에서 모아 와요!"),this.body.appendChild(n)}renderBuild(){const e=document.createElement("div");e.className="storage-list";const t=[...this.deps.buildings.list].sort((o,r)=>o.level-r.level),n=o=>this.built.has(o)||Au.includes(o)||o==="dragon_nest_1"||o===bu;for(const o of t){const r=ya(o.id),a=n(o.id),l=document.createElement("div");l.className="storage-row"+(a?" built":"");const d=document.createElement("div");d.className="storage-text";const u=Object.entries(o.cost).map(([_,g])=>`${this.deps.nameOf(_)} ${Math.min(this.stock.get(_)??0,g)}/${g}`).join(" · "),c=xu(this.stock,o.cost),h=o.requires&&!n(o.requires)?this.deps.buildings.find(o.requires)?.name:null;let f;if(a?f="✅ 지어졌어요":r?this.level<o.level?f=`마을 레벨 ${o.level} 필요 (지금 ${this.level})`:h?f=`${h}를 먼저 지어요`:Object.keys(c).length?f=`모자라요: ${Object.entries(c).map(([_,g])=>`${this.deps.nameOf(_)} ${g}`).join(", ")}`:f="지을 수 있어요!":f="🔒 다음 단계에서",d.innerHTML=`<b>${o.name}</b> <span class="craft-station">레벨 ${o.level}</span><br><span class="storage-sub">${u||"비용 없음"}</span><br><span class="storage-sub">${f}</span>`,l.appendChild(d),!a&&r){const _=this.level>=o.level&&!h&&Object.keys(c).length===0;l.appendChild(this.btn("짓기","big-btn small",()=>this.deps.onBuild(o.id),!_))}e.appendChild(l)}this.body.appendChild(e);const i=document.createElement("p");i.className="nest-note",i.textContent="건물은 광장 둘레 정해진 자리에 서고, 아무도 부술 수 없어요. 마을 레벨은 건물 수와 도감(처음 손에 넣은 블록 종류 10개마다)으로 올라가고, 광장 북쪽 깃대에 레벨만큼 깃발이 걸려요.",this.body.appendChild(i)}}const Md=new Rl(.16,0),my=new zt({color:14679984,transparent:!0,opacity:.95,blending:xs,depthWrite:!1}),gy=new zt({color:8388352,transparent:!0,opacity:.45,blending:xs,depthWrite:!1});class _y{group=new Et;orbs=new Map;t=0;constructor(e){e.add(this.group)}get count(){return this.orbs.size}set(e){const t=new Set;for(const n of e)t.add(n.id),this.orbs.has(n.id)||this.add(n);for(const n of[...this.orbs.keys()])t.has(n)||this.remove(n)}add(e){if(this.orbs.has(e.id))return;const t=new Et,n=new dt(Md,my),i=new dt(Md,gy);i.scale.setScalar(1.8+Math.min(1.5,e.amount/40)),t.add(i,n),t.position.set(e.x,e.y+.3,e.z),this.group.add(t),this.orbs.set(e.id,{group:t,info:e,phase:e.id*.7%(Math.PI*2)})}remove(e){const t=this.orbs.get(e);t&&(this.group.remove(t.group),this.orbs.delete(e))}clear(){for(const e of[...this.orbs.keys()])this.remove(e)}update(e){this.t+=e;for(const t of this.orbs.values())t.group.rotation.y=this.t*2+t.phase,t.group.position.y=t.info.y+.3+.08*Math.sin(this.t*3+t.phase)}}const vy=new Un(.1,.1,.1),xy=new Un(.06,.06,.06);let ki=625341585;function Kt(){return ki^=ki<<13,ki^=ki>>>17,ki^=ki<<5,(ki>>>0)/4294967296}function Ay(s){if(!s)return 10395294;const e=s.getContext("2d");if(!e)return 10395294;const{width:t,height:n}=s,i=e.getImageData(0,0,t,n).data;let o=0,r=0,a=0,l=0;for(let d=0;d<i.length;d+=4)i[d+3]<128||(o+=i[d],r+=i[d+1],a+=i[d+2],l++);return l===0?10395294:Math.round(o/l)<<16|Math.round(r/l)<<8|Math.round(a/l)}class by{group=new Et;parts=[];materials=new Map;constructor(e){e.add(this.group)}material(e){let t=this.materials.get(e);return t||(t=new zt({color:e}),this.materials.set(e,t)),t}add(e,t,n,i,o,r,a,l){const d=new dt(e,this.material(t));d.position.set(n,i,o),d.rotation.set(Kt()*3,Kt()*3,0),this.group.add(d),this.parts.push({mesh:d,vel:r,born:l,life:a}),this.parts.length>400&&this.drop(0)}burst(e,t,n,i,o=16,r=performance.now()){for(let a=0;a<o;a++){const l=e+.15+Kt()*.7,d=t+.15+Kt()*.7,u=n+.15+Kt()*.7,c=new H((l-e-.5)*4+(Kt()-.5)*1.5,2+Kt()*2.5,(u-n-.5)*4+(Kt()-.5)*1.5);this.add(vy,i,l,d,u,c,.7+Kt()*.4,r)}}crumb(e,t,n,i,o,r=performance.now()){const a=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]][i]??[0,1,0],l=e+.5+a[0]*.52+(a[0]?0:(Kt()-.5)*.8),d=t+.5+a[1]*.52+(a[1]?0:(Kt()-.5)*.8),u=n+.5+a[2]*.52+(a[2]?0:(Kt()-.5)*.8),c=new H(a[0]*1.2+(Kt()-.5),1.5+Kt()+a[1]*1.2,a[2]*1.2+(Kt()-.5));this.add(xy,o,l,d,u,c,.45+Kt()*.2,r)}drop(e){const t=this.parts[e];this.group.remove(t.mesh),this.parts.splice(e,1)}update(e,t=performance.now()){for(let n=this.parts.length-1;n>=0;n--){const i=this.parts[n],o=(t-i.born)/1e3;if(o>i.life){this.drop(n);continue}i.vel.y-=12*e,i.mesh.position.addScaledVector(i.vel,e),i.mesh.rotation.x+=e*4;const r=o>i.life-.2?Math.max(.1,(i.life-o)/.2):1;i.mesh.scale.setScalar(r)}}get count(){return this.parts.length}}function Ed(s){return`#${s.toString(16).padStart(6,"0")}`}function Pn(s,e){const t=n=>Math.max(0,Math.min(255,Math.round(n*e)));return t(s>>16)<<16|t(s>>8&255)<<8|t(s&255)}function fi(s,e,t,n,i=.12){const o=s*73856093^e*19349663^t*83492791,r=1-i/2+(o>>>0)%100/100*i;return Pn(n,r*(.9+.006*e))}const ms=s=>()=>s,Ht=(s,e=.12)=>(t,n,i)=>fi(t,n,i,s,e);function yy(s){let e=s*2654435761>>>0;return e^=e>>>15,e=e*2246822519>>>0,e^=e>>>13,e%1e4/1e4}class Ot{cells=new Map;get out(){return[...this.cells.values()]}box(e,t,n,i,o,r,a){for(let l=n;l<=i;l++)for(let d=o;d<=r;d++)for(let u=e;u<=t;u++)this.cells.set(`${u},${l},${d}`,{x:u,y:l,z:d,c:Ed(a(u,l,d))});return this}dot(e,t,n,i){return this.cells.set(`${e},${t},${n}`,{x:e,y:t,z:n,c:Ed(i)}),this}}function Sn(s,e){return{v:s.out,pivot:e}}function oo(s,e,t,n,i,o,r){return[[-t,n],[t-s,n],[-t,i],[t-s,i]].map(([l,d])=>{const u=new Ot;return u.box(l,l+s-1,0,e-1,d,d+s-1,(c,h,f)=>r&&h>=e-r.rows?r.color(c,h,f):o(c,h,f)),Sn(u,[l+s/2,e,d+s/2])})}function My(s){const e=s<.34?"temperate":s<.67?"cold":"warm",t=e==="temperate"?4862752:e==="cold"?3877406:11569756,n=e==="temperate"?15658734:e==="cold"?5915698:15128511,i=(c,h,f)=>e==="warm"?h<=13?fi(c,h,f,n,.06):fi(c,h,f,t):e==="cold"?fi(c,h,f,(c*5+h*3+f*7>>>0)%9<2?n:t,.16):(c*7+h*3+f*5>>>0)%11<3?fi(c,h,f,n,.06):fi(c,h,f,t),o=new Ot().box(-6,5,12,21,-9,8,i).box(-2,1,11,11,2,7,Ht(15251881,.06)),r=oo(4,12,6,-7,4,Ht(e==="warm"?9071173:3811352)),a=new Ot().box(-4,3,16,23,-15,-10,i),l=e==="cold"?7230785:14202784;a.box(-4,3,16,18,-15,-15,Ht(l,.05)),a.dot(-2,17,-15,5913132).dot(1,17,-15,5913132),e==="cold"?a.box(-4,3,21,23,-15,-14,Ht(9071178,.14)):(a.dot(-3,21,-15,16777215).dot(-2,21,-15,1710618).dot(1,21,-15,1710618).dot(2,21,-15,16777215),e==="temperate"&&a.box(-1,0,19,23,-15,-15,Ht(15658734,.04)));const d=e==="cold"?3:2;a.box(-5-(e==="cold"?1:0),-5,22,21+d,-12,-11,ms(13684944)).box(4,4+(e==="cold"?1:0),22,21+d,-12,-11,ms(13684944));const u=new Ot().box(-1,0,15,21,9,9,Ht(t,.08)).dot(-1,15,9,2760212).dot(0,15,9,2760212);return{body:o.out,head:Sn(a,[0,19,-10]),legs:r,tail:Sn(u,[0,22,9]),wings:[],babyHead:1.5}}function Ey(s){const e=s<.6?"temperate":s<.8?"cold":"warm",t=e==="temperate"?15770536:e==="cold"?15327958:12880506,n=e==="cold"?14984616:e==="warm"?11037278:14252672,i=(d,u,c)=>e==="warm"&&(d*3+u*7+c*5>>>0)%13<2?fi(d,u,c,9067080,.1):fi(d,u,c,t,.08),o=new Ot().box(-5,4,6,13,-8,7,i),r=oo(4,6,5,-6,3,i),a=new Ot().box(-4,3,8,15,-16,-9,i);a.box(-2,1,9,11,-17,-17,Ht(n,.04)),a.dot(-2,10,-17,Pn(n,.7)).dot(1,10,-17,Pn(n,.7)),a.dot(-4,13,-16,16777215).dot(-3,13,-16,1710618).dot(2,13,-16,1710618).dot(3,13,-16,16777215),a.box(-4,-4,16,16,-13,-12,i).box(3,3,16,16,-13,-12,i);const l=new Ot().box(0,0,11,13,8,8,Ht(t,.05)).dot(0,11,9,Pn(t,.9));return{body:o.out,head:Sn(a,[0,12,-9]),legs:r,tail:Sn(l,[0,14,8]),wings:[],babyHead:1.5}}function Sy(s,e=!1){const t=s<.55?15921906:s<.7?13224393:s<.8?9079434:s<.9?3092271:s<.97?7031339:15769792,n=t===3092271,i=n?7234649:14272688,o=Ht(t,n?.2:.1),r=Ht(i,.06),a=e?new Ot().box(-4,3,11,16,-8,7,r):new Ot().box(-5,4,10,17,-9,8,o),l=e?oo(4,11,5,-7,4,r):oo(4,10,5,-7,4,r,{rows:2,color:o}),d=new Ot().box(-3,2,12,17,-15,-10,r);e||d.box(-3,2,15,18,-13,-10,o),d.box(-3,2,12,13,-15,-15,Ht(Pn(i,.85),.04)),d.dot(-2,15,-15,1710618).dot(1,15,-15,1710618),d.dot(-3,15,-15,n?13684944:16777215).dot(2,15,-15,n?13684944:16777215);const u=new Ot().box(-1,0,15,17,e?8:9,e?8:9,e?r:o);return{body:a.out,head:Sn(d,[0,15,-10]),legs:l,tail:Sn(u,[0,18,9]),wings:[],babyHead:1.5}}function wy(s){const e=s<.5?"temperate":s<.75?"cold":"warm",n=Ht(e==="temperate"?16185078:e==="cold"?12569042:10119740,.08),i=e==="warm"?4862752:e==="cold"?9082787:14606046,o=new Ot().box(-3,2,5,10,-4,3,n);o.box(-2,1,9,11,4,5,Ht(i,.1)).box(-1,0,11,12,5,6,Ht(i,.1));const r=ms(15114812),a=[-2,1].map(u=>{const c=new Ot().box(u,u,0,4,0,0,r).box(u-1,u+1,0,0,-2,0,r);return Sn(c,[u+.5,5,.5])}),l=new Ot().box(-2,1,9,14,-7,-5,n);l.box(-2,1,10,11,-9,-8,ms(15114812)),l.box(-1,0,8,9,-9,-8,ms(15022389)),l.dot(-2,13,-7,1710618).dot(1,13,-7,1710618),e!=="cold"&&l.box(-1,0,15,15,-6,-5,ms(15022389));const d=[-4,3].map(u=>{const c=new Ot().box(u,u,7,10,-3,2,n);return Sn(c,[u+.5,10,0])});return{body:o.out,head:Sn(l,[0,9,-4]),legs:a,tail:null,wings:d,babyHead:1.4}}function Ty(s){const e=s<.7?13158600:9136714,t=Ht(e,.14),n=new Ot().box(-3,2,8,13,-3,6,t);n.box(-4,3,8,14,-7,-1,Ht(Pn(e,.93),.16)),n.box(-2,1,11,14,-8,-8,t);const i=oo(2,8,3,-5,4,t),o=new Ot().box(-3,2,10,15,-12,-9,t);o.box(-1,1,10,12,-16,-13,Ht(Pn(e,.96),.06)),o.dot(-1,12,-16,1710618).dot(0,12,-16,1710618).dot(1,12,-16,1710618),o.dot(-3,14,-12,16777215).dot(-2,14,-12,1710618).dot(1,14,-12,1710618).dot(2,14,-12,16777215),o.box(-3,-2,16,17,-11,-11,t).box(1,2,16,17,-11,-11,t),o.dot(-2,16,-11,Pn(e,.7)).dot(1,16,-11,Pn(e,.7));const r=new Ot().box(-1,0,6,13,7,8,t).dot(-1,6,7,Pn(e,.85)).dot(0,6,8,Pn(e,.85));return{body:n.out,head:Sn(o,[0,13,-9]),legs:i,tail:Sn(r,[0,14,7]),wings:[],babyHead:1.5}}function Cy(s,e,t={}){switch(s){case"cow":return My(e);case"pig":return Ey(e);case"sheep":return Sy(e,t.sheared===!0);case"chicken":return wy(e);default:return Ty(e)}}function Ry(){const s=[];for(let e=-3;e<=2;e++)for(let t=10;t<=15;t++)(e===-3||e===2||t===10||t===15)&&s.push({x:e,y:t,z:-8,c:"#e53935"});return s.push({x:-1,y:9,z:-8,c:"#ffd54f"},{x:0,y:9,z:-8,c:"#ffd54f"}),s}const ky={shirt:3107450,skin:6130506,hair:2899499,pants:3814752,shoes:2433311},Dy={zombie:ky,vindicator:{shirt:3096402,skin:10134441,hair:2763306,pants:1976886,shoes:1710618},pillager:{shirt:5916210,skin:10134441,hair:2763306,pants:3813156,shoes:1710618},evoker:{shirt:1842210,skin:10134441,hair:1118481,pants:1842210,shoes:1118481},skeleton:{shirt:14474460,skin:14211288,hair:12434877,pants:13619151,shoes:10395294}},Ly=5025616,kh=2761504,Sd=new Set(["cow","pig","sheep","chicken","dog"]),Py=3810116,Iy=4860494,pl=16766287;function js(s){return"#"+s.toString(16).padStart(6,"0")}function Uy(){const s=[],e=(i,o,r,a,l,d,u)=>{for(let c=r;c<=a;c++)for(let h=l;h<=d;h++)for(let f=i;f<=o;f++)s.push({x:f,y:c,z:h,c:js(u(f,c,h))})},t=(i,o,r)=>{const l=.85+((i*73856093^o*19349663^r*83492791)>>>0)%100/100*.3,d=Math.min(255,Math.round(76*l)),u=Math.min(255,Math.round(175*l)),c=Math.min(255,Math.round(80*l));return d<<16|u<<8|c};for(const[i,o]of[[-4,-4],[0,-4],[-4,1],[0,1]])e(i,i+3,0,5,o,o+3,t);e(-2,1,6,17,-2,1,t);const n=["        ","        "," xx  xx "," xx  xx ","   xx   ","  xxxx  ","  x  x  ","  x  x  "];return e(-4,3,18,25,-4,3,(i,o,r)=>r===-4&&n[25-o][i+4]==="x"?1053712:t(i,o,r)),s}function Ny(s=!1){const e=s?Py:kh,t=s?Iy:3813162,n=[],i=(a,l,d,u)=>{const h=.85+((a*73856093^l*19349663^d*83492791)>>>0)%100/100*.3,f=Math.min(255,Math.round((u>>16&255)*h)),_=Math.min(255,Math.round((u>>8&255)*h)),g=Math.min(255,Math.round((u&255)*h));return f<<16|_<<8|g},o=(a,l,d,u,c,h,f)=>{for(let _=d;_<=u;_++)for(let g=c;g<=h;g++)for(let p=a;p<=l;p++)n.push({x:p,y:_,z:g,c:js(f(p,_,g))})};o(-5,4,5,12,1,12,(a,l,d)=>i(a,l,d,t)),o(-3,2,6,11,-5,0,(a,l,d)=>i(a,l,d,e));const r=["        "," r    r ","r r  r r"," r    r ","  r  r  ","        ","        ","        "];if(o(-4,3,5,12,-11,-6,(a,l,d)=>d===-11&&r[12-l][a+4]==="r"?s?16724016:13639712:i(a,l,d,e)),s){const a=["x x x x ","xxxxxxxx"];for(let l=-11;l<=-6;l++)for(let d=-4;d<=3;d++)(l===-11||l===-6||d===-4||d===3)&&(n.push({x:d,y:13,z:l,c:js(pl)}),a[0][d+4]==="x"&&(l===-11||l===-6)&&n.push({x:d,y:14,z:l,c:js(l===-11&&(d===-1||d===0)?15022389:pl)}))}return n}function By(){const s=[];for(let e=0;e<14;e++)for(let t=0;t<2;t++)for(let n=0;n<2;n++)s.push({x:e,y:t,z:n,c:js(e>9?1709588:2367003)});return s}function va(s,e,t,n){const i=document.createElement("canvas");i.width=s,i.height=e;const o=i.getContext("2d"),r=new Ar(i);r.minFilter=gn;const a=new wl(new Sl({map:r,depthTest:!0,transparent:!0}));return a.scale.set(t,n,1),{sprite:a,ctx:o,tex:r}}function xa(s,e,t,n){const i=s.canvas.width,o=s.canvas.height;s.clearRect(0,0,i,o),s.fillStyle="rgba(0,0,0,0.6)",s.fillRect(0,6,i,o-12);const r=Math.max(0,Math.min(1,t/Math.max(1,n)));s.fillStyle=r>.5?"#e53935":r>.25?"#fb8c00":"#ffd600",s.fillRect(3,9,(i-6)*r,o-18),s.font="bold 15px system-ui, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillStyle="#fff",s.strokeStyle="rgba(0,0,0,0.8)",s.lineWidth=3,s.strokeText(`${t} / ${n}`,i/2,o/2),s.fillText(`${t} / ${n}`,i/2,o/2),e.needsUpdate=!0}function Bn(s,e){const t=Cs(s,xt,_r);return t.translate(xt/2,0,xt/2),new dt(t,e)}function Ko(s,e){const t=Cs(s.v,xt,_r);t.translate((.5-s.pivot[0])*xt,-s.pivot[1]*xt,(.5-s.pivot[2])*xt);const n=new dt(t,e);return n.position.set(s.pivot[0]*xt,s.pivot[1]*xt,s.pivot[2]*xt),n}const Fy=new Un(.16,.16,.16),Oy=new Un(.06,.06,.7),zy=new zt({color:14272672});class Vy{group=new Et;figures=new Map;bursts=[];pops=[];shots=[];constructor(e){e.add(this.group)}get count(){return this.figures.size}petNames=new Map;setPetNames(e){this.petNames.clear();for(const t of e)t.name&&this.petNames.set(t.id,t.name);for(const[t,n]of this.figures)this.applyName(t,n)}applyName(e,t){const n=this.petNames.get(e)??null;if(t.nameLabel&&t.nameLabel.text===n||(t.nameLabel&&(t.group.remove(t.nameLabel.sprite),t.nameLabel.sprite.material.map?.dispose(),t.nameLabel.sprite.material.dispose(),t.nameLabel=null),!n))return;const i=fr(`🐾 ${n}`,"rgba(60,30,10,0.55)",.4);i.position.set(0,cn(t.kind).h+.55,0),t.group.add(i),t.nameLabel={sprite:i,text:n}}positionOf(e){const t=this.figures.get(e);return t?{x:t.cur.x,y:t.cur.y+cn(t.kind).h*.5*(t.state&bn.baby?.5:1),z:t.cur.z}:null}shot(e,t){const n=new dt(Oy,zy),i=new H(e.x,e.y,e.z),o=new H(t.x,t.y,t.z);n.position.copy(i),n.lookAt(o),this.group.add(n),this.shots.push({mesh:n,from:i,to:o,born:-1})}figureOf(e){const t=this.figures.get(e);return t?{kind:t.kind,state:t.state}:void 0}make(e){const t=new zt({vertexColors:!0}),n=new Et,i=new Et;let o=null,r=null,a=null,l=null;const d=[],u=[],c=[];let h=null,f=null,_=1;const g=ui[e.kind]??"zombie",p=Dy[g];if(p){const R=Nd(p),v=(A,y)=>(A.position.set(y[0]*xt,y[1]*xt,0),A),S=v(Bn(R.torso,t),[0,12]),C=v(Bn(R.head,t),[0,24]);a=v(Bn(R.leg,t),[-2,12]),l=v(Bn(R.leg,t),[2,12]),o=v(Bn(R.arm,t),[-6,24]),r=v(Bn(R.arm,t),[6,24]),g==="zombie"?o.rotation.x=r.rotation.x=-Math.PI/2+.15:g==="evoker"&&(o.rotation.x=r.rotation.x=-Math.PI/2+.6),i.add(S,C,a,l,o,r)}else if(ui[e.kind]==="spider"||ui[e.kind]==="spider_king"){i.add(Bn(Ny(ui[e.kind]==="spider_king"),t));const R=Cs(By(),xt,_r);R.translate(0,-xt,-xt);for(let v=0;v<8;v++){const S=v>=4,C=v%4,A=new dt(R,t);A.position.set((S?3:-3)*xt,9*xt,(-4+C*3)*xt),A.rotation.set(0,(S?0:Math.PI)+(S?1:-1)*(.55-C*.37),S?-.75:.75),A.userData.baseY=A.rotation.y,d.push(A),i.add(A)}}else if(Sd.has(g)){const R=Cy(g,yy(e.id),{sheared:(e.state&bn.sheared)!==0});i.add(Bn(R.body,t)),h=Ko(R.head,t),i.add(h);for(const v of R.legs){const S=Ko(v,t);u.push(S),i.add(S)}R.tail&&(f=Ko(R.tail,t),i.add(f));for(const v of R.wings){const S=Ko(v,t);c.push(S),i.add(S)}_=R.babyHead}else i.add(Bn(Uy(),t));n.add(i);const m=er.get(g).hp,M=ui[e.kind]==="spider_king",w=M?2.2:1;i.scale.setScalar(w);const b=va(128,28,M?2.2:1.1,M?.4:.24);return b.sprite.position.set(0,cn(e.kind).h+(M?.7:.35),0),xa(b.ctx,b.tex,e.hp,m),n.add(b.sprite),this.group.add(n),{group:n,body:i,material:t,kind:e.kind,cur:{x:e.x,y:e.y,z:e.z,yaw:e.yaw},target:{x:e.x,y:e.y,z:e.z,yaw:e.yaw},state:e.state,hp:e.hp,flashUntil:0,fuseT:0,armL:o,armR:r,legL:a,legR:l,spiderLegs:d,walk:0,bar:b,maxHp:m,shownHp:e.hp,baseScale:w,summonT:0,animal:Sd.has(g),collar:null,nextHeart:0,legs:u,head:h,tail:f,wings:c,babyHead:_,id:e.id,sheared:(e.state&bn.sheared)!==0,nameLabel:null}}setState(e){const t=new Set;for(const n of e){t.add(n.id);let i=this.figures.get(n.id);if(i&&i.animal&&i.sheared!==((n.state&bn.sheared)!==0)){const o=i.cur;this.remove(n.id),i=this.make(n),i.cur={...o},i.group.position.set(o.x,o.y,o.z),this.figures.set(n.id,i)}i||(i=this.make(n),i.group.position.set(n.x,n.y,n.z),this.figures.set(n.id,i)),i.animal&&(this.petNames.has(n.id)||i.nameLabel)&&this.applyName(n.id,i),i.target={x:n.x,y:n.y,z:n.z,yaw:n.yaw},i.state=n.state,i.hp=n.hp,i.shownHp!==n.hp&&(i.shownHp=n.hp,xa(i.bar.ctx,i.bar.tex,n.hp,i.maxHp)),i.animal&&(i.bar.sprite.visible=n.hp<i.maxHp,(n.state&bn.tamed)!==0&&!i.collar&&(i.collar=Bn(Ry(),new zt({vertexColors:!0})),i.body.add(i.collar)))}for(const n of[...this.figures.keys()])t.has(n)||this.remove(n)}event(e,t,n,i,o,r=performance.now(),a){const l=this.figures.get(t);if(e==="hit")l&&(l.flashUntil=r+160,l.target={...l.target,x:n,y:i,z:o},l.hp>0&&a&&(l.hp=Math.max(0,l.hp-a),l.shownHp=l.hp,xa(l.bar.ctx,l.bar.tex,l.hp,l.maxHp))),a&&this.pop(n,i+cn(l?.kind??0).h+.7,o,a,r);else if(e==="wake"&&l)l.flashUntil=r+400;else if(e==="love"||e==="tame"||e==="eat"||e==="grow"||e==="sit"||e==="shear"||e==="egg")e==="eat"?this.popText(n,i+cn(l?.kind??0).h+.5,o,"냠","#ffffff",r):e==="love"?this.popText(n,i+cn(l?.kind??0).h+.5,o,"♥","#ff5c8a",r):e==="tame"?this.popText(n,i+cn(l?.kind??0).h+.5,o,"♥♥","#ff5c8a",r):e==="grow"?this.popText(n,i+cn(l?.kind??0).h+.5,o,"어른!","#ffeb3b",r):e==="shear"?this.popText(n,i+cn(l?.kind??0).h+.5,o,"✂️","#ffffff",r):e==="egg"&&this.popText(n,i+cn(l?.kind??0).h+.5,o,"🥚","#ffffff",r);else if(e==="summon"&&l)l.summonT=.8,this.burst(n,i+.6,o,11766015,16,r);else if(e==="die"||e==="explode"){const d=e==="explode"?16765562:l?l.kind===0?6130506:l.kind===2?kh:l.kind===3?pl:l.kind>=4?10134441:Ly:16777215;this.burst(n,i+cn(l?.kind??0).h*.5,o,d,e==="explode"?28:l?.kind===3?40:12,r),this.remove(t)}}animateAnimal(e,t,n,i){const o=ui[e.kind]??"cow",r=i/1e3+e.id%97*.37,a=(e.state&bn.sitting)!==0,l=(e.state&bn.baby)!==0,d=(e.state&bn.tamed)!==0;if(e.legs.forEach((u,c)=>{let h=c===0||c===3?n:-n;a&&c>=2&&(h=-1.35),u.rotation.x=h}),e.head){let u=t?Math.sin(e.walk*2)*.06:0;if(!t&&!a&&o!=="dog"){const c=r%7;c<1.8&&(u-=(o==="chicken"?.5:.75)*Math.sin(c/1.8*Math.PI))}e.head.rotation.x=u,e.head.scale.setScalar(l?e.babyHead:1)}e.tail&&(o==="dog"?(e.tail.rotation.x=a?-.35:d?-2.2:-.9,e.tail.rotation.z=d||t?Math.sin(r*9)*.45:0):(e.tail.rotation.x=.15,e.tail.rotation.z=Math.sin(r*2.2)*.25)),e.wings.forEach((u,c)=>{u.rotation.z=(c===0?-1:1)*(t?Math.abs(Math.sin(e.walk*3))*.9:0)}),e.body.position.y=a?-.14:0}popText(e,t,n,i,o,r){const a=va(96,48,.9,.45);a.ctx.font="bold 30px system-ui, sans-serif",a.ctx.textAlign="center",a.ctx.textBaseline="middle",a.ctx.strokeStyle="rgba(0,0,0,0.85)",a.ctx.lineWidth=6,a.ctx.fillStyle=o,a.ctx.strokeText(i,48,26),a.ctx.fillText(i,48,26),a.tex.needsUpdate=!0,a.sprite.position.set(e,t,n),this.group.add(a.sprite),this.pops.push({sprite:a.sprite,born:r})}pop(e,t,n,i,o){const r=va(96,48,.9,.45);r.ctx.font="bold 34px system-ui, sans-serif",r.ctx.textAlign="center",r.ctx.textBaseline="middle",r.ctx.strokeStyle="rgba(0,0,0,0.85)",r.ctx.lineWidth=6,r.ctx.fillStyle="#ffeb3b",r.ctx.strokeText(`-${i}`,48,26),r.ctx.fillText(`-${i}`,48,26),r.tex.needsUpdate=!0,r.sprite.position.set(e,t,n),this.group.add(r.sprite),this.pops.push({sprite:r.sprite,born:o})}burst(e,t,n,i,o,r){const a=new Et,l=new zt({color:i,transparent:!0,opacity:.95}),d=[];for(let u=0;u<o;u++){const c=new dt(Fy,l),h=u/o*Math.PI*2,f=u*7%o/o-.5,_=new H(Math.cos(h)*(2+f),2.5+f*2,Math.sin(h)*(2+f));c.position.set(e,t,n),d.push({m:c,v:_}),a.add(c)}this.group.add(a),this.bursts.push({group:a,born:r,parts:d})}remove(e){const t=this.figures.get(e);t&&(this.group.remove(t.group),t.material.dispose(),t.bar.tex.dispose(),t.bar.sprite.material.dispose(),t.group.traverse(n=>{n instanceof dt&&n.geometry.dispose()}),this.figures.delete(e))}clear(){for(const e of[...this.figures.keys()])this.remove(e);for(const e of this.bursts)this.group.remove(e.group);this.bursts.length=0;for(const e of this.pops)this.group.remove(e.sprite);this.pops.length=0}aim(e,t,n){let i=null,o=n;for(const[r,a]of this.figures){const l=a.cur,d=cn(a.kind),u=d.w/2,c=[l.x-u,l.y,l.z-u],h=[l.x+u,l.y+d.h,l.z+u],f=[e.x,e.y,e.z],_=[t.x,t.y,t.z];let g=0,p=o,m=!0;for(let M=0;M<3&&m;M++){if(Math.abs(_[M])<1e-9){(f[M]<c[M]||f[M]>h[M])&&(m=!1);continue}let w=(c[M]-f[M])/_[M],b=(h[M]-f[M])/_[M];w>b&&([w,b]=[b,w]),g=Math.max(g,w),p=Math.min(p,b),g>p&&(m=!1)}m&&g<o&&(o=g,i=r)}return i}update(e,t=performance.now()){const n=1-Math.exp(-e*12);for(const i of this.figures.values()){const o=i.cur,r=i.target,a=r.x-o.x,l=r.z-o.z;o.x+=a*n,o.y+=(r.y-o.y)*n,o.z+=l*n;let d=r.yaw-o.yaw;d=Math.atan2(Math.sin(d),Math.cos(d)),o.yaw+=d*n,i.group.position.set(o.x,o.y,o.z),i.body.rotation.y=o.yaw;const u=Math.hypot(a,l)*12;u>.3&&(i.walk+=e*Math.min(10,u*2));const c=u>.3?Math.sin(i.walk)*.5:0;if(i.legL&&i.legR&&(i.legL.rotation.x=c,i.legR.rotation.x=-c),i.spiderLegs.forEach((h,f)=>{const _=h.userData.baseY;h.rotation.y=_+(f%2===0?c:-c)*.5}),i.animal&&this.animateAnimal(i,u>.3,c,t),i.state===zl.fuse){i.fuseT+=e;const h=1+.25*Math.min(1,i.fuseT/1.5)+.06*Math.sin(i.fuseT*30);i.body.scale.set(h,h,h),i.material.color.setRGB(1+i.fuseT,1+i.fuseT,1+i.fuseT)}else{i.fuseT=0;let h=i.baseScale;i.state===zl.sleep&&(h*=.85),i.animal&&(i.state&bn.baby&&(h*=.5),i.state&bn.love&&t>=i.nextHeart&&(i.nextHeart=t+900,this.popText(o.x,o.y+cn(i.kind).h*h+.4,o.z,"♥","#ff5c8a",t))),i.summonT>0&&(i.summonT=Math.max(0,i.summonT-e),h*=1+.12*Math.sin(i.summonT/.8*Math.PI)),i.body.scale.set(h,h,h),i.material.color.setRGB(1,1,1)}t<i.flashUntil&&i.material.color.setRGB(2.2,.6,.6)}for(let i=this.bursts.length-1;i>=0;i--){const o=this.bursts[i],r=(t-o.born)/1e3;if(r>.9){this.group.remove(o.group),this.bursts.splice(i,1);continue}for(const a of o.parts)a.m.position.addScaledVector(a.v,e),a.v.y-=9.8*e;o.parts[0].m.material.opacity=Math.max(0,1-r/.9)}for(let i=this.shots.length-1;i>=0;i--){const o=this.shots[i];o.born<0&&(o.born=t);const r=(t-o.born)/250;if(r>=1){this.group.remove(o.mesh),this.shots.splice(i,1);continue}o.mesh.position.lerpVectors(o.from,o.to,r)}for(let i=this.pops.length-1;i>=0;i--){const o=this.pops[i],r=(t-o.born)/1e3;if(r>.8){this.group.remove(o.sprite),o.sprite.material.map?.dispose(),o.sprite.material.dispose(),this.pops.splice(i,1);continue}o.sprite.position.y+=e*.9,o.sprite.material.opacity=r<.5?1:1-(r-.5)/.3}}}const wd=new WeakMap;function Td(s){let e=wd.get(s);return e||(e=document.createElement("canvas"),e.width=s.width,e.height=s.height,e.getContext("2d").putImageData(s,0,0),wd.set(s,e)),e}function Gy(s,e,t=40){const n=Math.min(2,window.devicePixelRatio||1),i=document.createElement("canvas");i.width=i.height=Math.round(t*n),i.style.width=i.style.height=`${t}px`;const o=i.getContext("2d");o.imageSmoothingEnabled=!1;const r=t*n/32,a=Td(s),l=Td(e),d=u=>{o.globalCompositeOperation="source-atop",o.fillStyle=`rgba(0,0,0,${u})`,o.fillRect(0,0,16,16),o.globalCompositeOperation="source-over"};return o.setTransform(r,.5*r,-r,.5*r,16*r,0),o.drawImage(a,0,0,16,16),o.setTransform(r,.5*r,0,r,0,8*r),o.drawImage(l,0,0,16,16),d(.22),o.setTransform(r,-.5*r,0,r,16*r,16*r),o.drawImage(l,0,0,16,16),d(.42),o.setTransform(1,0,0,1,0,0),i}const Cd=new Map;function Hy(s){let e=0;for(let t=0;t<s.length;t++)e=e*31+s.charCodeAt(t)>>>0;return e%360}const Rd={wooden:"#a0703a",stone:"#8a8a8a",iron:"#d8d8d8",golden:"#f2c94c",gold:"#f2c94c",diamond:"#5fd8e8",netherite:"#4a3f4a",leather:"#8a5a3c",turtle:"#4f8a3a"},Wy=["............bBB.","...........bBB..","..........bBB...",".........bBB....","........bBB.....",".......bBB......","......bBB.......",".....bBB........","..g.bBB.........","..ggBB..........","...gggg.........","..hhg.gg........",".hh.............","hh..............","kh..............","................"];function Js(s,e){const t=parseInt(s.slice(1),16),n=i=>Math.max(0,Math.min(255,Math.round(i*e)));return`#${(n(t>>16)<<16|n(t>>8&255)<<8|n(t&255)).toString(16).padStart(6,"0")}`}const Xy=["................","................",".....llllll.....","....lmmmmmml....","...lmmmmmmmml...","...mmmmmmmmmm...","...mmmmmmmmmm...","...MmmmmmmmmM...","...MM......MM...","...MM......MM...","...MMM....MMM...","................","................","................","................","................"],Yy=["................","..lll......lll..","..lmml....lmml..","..lmmm....mmml..","..mmmmmmmmmmmm..","..mmmmmmmmmmmm..","..MmmmmmmmmmmM..","...mmmmmmmmmm...","...mmmmmmmmmm...","...mmmmmmmmmm...","...MmmmmmmmmM...","...MMmmmmmmMM...","...MMMMMMMMMM...","................","................","................"],qy=["................","...llllllllll...","...mmmmmmmmmm...","...mmmmmmmmmm...","...mmmm..mmmm...","...mmmm..mmmm...","...mmm....mmm...","...mmm....mmm...","...mmm....mmm...","...MmM....MmM...","...MmM....MmM...","...MMM....MMM...","................","................","................","................"],Ky=["................","................","................","................","...lll....lll...","...mmm....mmm...","...mmm....mmm...","...mmm....mmm...","...mmmm...mmmm..","..mmmmm..mmmmm..","..MMMMM..MMMMM..","................","................","................","................","................"],Qy=["....iiiiiiii....","...iwwwwwwwwi...","...iwwwWWwwwi...","...iwwWiiWwwi...","...iwwWiiWwwi...","...iwwwWWwwwi...","...iwwwwwwwwi...","...iwwwwwwwwi...","....iwwwwwwi....","....iwwwwwwi....",".....iwwwwi.....","......iwwi......",".......ii.......","................","................","................"],jy=["......hhh.......",".....h....s.....","....h.....s.....","...h......s.....","...h......s.....","..h.......s.....","..h.......s.....","..h.......s.....","..h.......s.....","...h......s.....","...h......s.....","....h.....s.....",".....h....s.....","......hhh.......","................","................"],Jy=["..h..........h..","..h....ii....h..","...h..iwwi..h...","....hiwwwwih....",".....sssssss....","......wwww......","......wwww......","......wwww......","......wwww......","......wwww......","......WWWW......","................","................","................","................","................"],Zy=[".............ii.","............iii.","...........iii..","..........iii...",".........iii....","........iii.....",".......iii......","......iii.......",".....iki........","....hh.hh.......","...hh...hh......","..hh.....hh.....",".hh.......hh....","hh.........hh...","................","................"],$y=["..............f.",".............ff.","............fff.","...........hf...","..........h.....",".........h......","........h.......",".......h........","......h.........",".....h..........","...eh...........","..eeh...........",".eee............","ee..............","................","................"];function fs(s,e,t,n){for(let i=0;i<16;i++)for(let o=0;o<16;o++){const r=e[i][o];r!=="."&&(s.fillStyle=n[r]??"#ff00ff",s.fillRect(o*t,i*t,t+.5,t+.5))}}function eM(s){return{m:s,M:Js(s,.72),l:Js(s,1.22)}}function tM(s,e,t){const n={b:Js(e,1.18),B:Js(e,.82),g:Js(e,.7),h:"#6b4a2b",k:"#3d2a17"};for(let i=0;i<16;i++)for(let o=0;o<16;o++){const r=Wy[i][o];r!=="."&&(s.fillStyle=n[r]??e,s.fillRect(o*t,i*t,t+.5,t+.5))}}function Qo(s){for(const e of Object.keys(Rd))if(s.startsWith(e+"_")||s===e)return Rd[e];return"#b0b0b0"}function jo(s,e,t,n,i,o){o=Math.min(o,n/2,i/2),s.beginPath(),s.moveTo(e+o,t),s.lineTo(e+n-o,t),s.quadraticCurveTo(e+n,t,e+n,t+o),s.lineTo(e+n,t+i-o),s.quadraticCurveTo(e+n,t+i,e+n-o,t+i),s.lineTo(e+o,t+i),s.quadraticCurveTo(e,t+i,e,t+i-o),s.lineTo(e,t+o),s.quadraticCurveTo(e,t,e+o,t),s.closePath()}function nM(s,e,t,n){const i=n/16;s.lineWidth=Math.max(1,i*.8),s.strokeStyle="rgba(0,0,0,0.55)";const o=e==="water_bottle"||e==="glass_bottle"||e.startsWith("potion.")||e.startsWith("splash_potion.")||e.startsWith("lingering_potion."),r=/_(pickaxe|axe|sword|shovel|hoe)$/.test(e),a=e==="bucket"||e.endsWith("_bucket"),l=e.endsWith("_dust")||e==="redstone"||e==="sugar"||e==="gunpowder"||e==="glowstone_dust",d=e.endsWith("_ingot")||e==="netherite"||e==="gold_nugget",u=e==="stick"||e==="blaze_rod"||e==="breeze_rod"||e==="bone",c=e==="string";if(e.endsWith("_sword")){tM(s,Qo(e),i);return}const h=/_(helmet|chestplate|leggings|boots)$/.exec(e)?.[1];if(h){fs(s,h==="helmet"?Xy:h==="chestplate"?Yy:h==="leggings"?qy:Ky,i,eM(Qo(e)));return}if(e==="shield"){fs(s,Qy,i,{i:"#d8d8d8",w:"#a0703a",W:"#5a3a1b"});return}if(e==="bow"){fs(s,jy,i,{h:"#8a5a2b",s:"#e8e8e8"});return}if(e==="crossbow"){fs(s,Jy,i,{h:"#8a5a2b",s:"#e8e8e8",i:"#d8d8d8",w:"#a0703a",W:"#5a3a1b"});return}if(e==="shears"){fs(s,Zy,i,{i:"#d8d8d8",k:"#555555",h:"#8a5a2b"});return}if(e==="egg"){s.fillStyle="#f3e7c9",s.beginPath(),s.ellipse(8*i,8.5*i,4.2*i,5.4*i,0,0,Math.PI*2),s.fill(),s.stroke(),s.fillStyle="rgba(255,255,255,0.6)",s.fillRect(6*i,5*i,i,2*i);return}if(e==="arrow"){fs(s,$y,i,{f:"#9a9a9a",h:"#8a5a2b",e:"#f2f2f2"});return}const f=yu(e);if(f){const _=pn.find(f)?.color??"#9a9a9a";s.fillStyle=_,s.beginPath(),s.ellipse(8*i,9*i,4.6*i,6*i,0,0,Math.PI*2),s.fill(),s.stroke(),s.fillStyle="rgba(0,0,0,0.25)",s.beginPath(),s.ellipse(8*i,12*i,4*i,2.6*i,0,0,Math.PI),s.fill(),s.fillStyle="rgba(255,255,255,0.55)";for(const[g,p]of[[6.2,6.5],[9.5,8],[7,10.5]])s.fillRect(g*i,p*i,i,i);return}if(o){const _=e==="glass_bottle"?null:e==="water_bottle"?"#3d7be6":e.includes("healing")?"#e64a4a":e.includes("speed")?"#7fd3ff":e.includes("awkward")?"#6b6ba8":"#a24ae6";s.fillStyle="rgba(200,225,255,0.55)",jo(s,4*i,6*i,8*i,9*i,3*i),s.fill(),s.stroke(),s.fillRect(6.5*i,2*i,3*i,4.5*i),s.strokeRect(6.5*i,2*i,3*i,4.5*i),s.fillStyle="#b07a3a",s.fillRect(6*i,1*i,4*i,1.6*i),_&&(s.fillStyle=_,jo(s,5*i,9*i,6*i,5*i,2.4*i),s.fill());return}if(a){const _=e==="water_bucket"?["#2f5fd6","#4d86ff"]:e==="lava_bucket"?["#e0561a","#ffa030"]:e==="milk_bucket"?["#e8e8e8","#ffffff"]:null,g=(b,R,v,S,C)=>{s.fillStyle=C,s.fillRect(b*i,R*i,v*i,S*i)},p="#2a2a2a",m="#5c5c5c",M="#9a9a9a",w="#d9d9d9";g(6,1,4,1,p),g(5,2,1,1,p),g(10,2,1,1,p),g(4,3,1,1,p),g(11,3,1,1,p),g(3,4,10,1,p),g(2,5,12,1,p),g(3,5,10,1,_?_[0]:m),g(4,5,4,1,_?_[1]:M),g(2,6,12,4,p),g(3,6,10,4,M),g(3,6,2,4,w),g(11,6,1,4,m),g(3,10,10,3,p),g(4,10,8,3,M),g(4,10,2,3,w),g(10,10,1,3,m),g(4,13,8,1,p),g(5,13,6,1,m),g(5,14,6,1,p);return}if(r){const _=Qo(e);s.strokeStyle="#8a5a2b",s.lineWidth=2*i,s.beginPath(),s.moveTo(3*i,13*i),s.lineTo(10.5*i,5.5*i),s.stroke(),s.fillStyle=_,s.strokeStyle="rgba(0,0,0,0.55)",s.lineWidth=Math.max(1,i*.8),e.endsWith("pickaxe")?(s.beginPath(),s.moveTo(6*i,2.5*i),s.quadraticCurveTo(11*i,1.5*i,14*i,6*i),s.lineTo(12*i,7.5*i),s.quadraticCurveTo(10.5*i,4.5*i,7*i,4.5*i),s.closePath()):e.endsWith("axe")?(s.beginPath(),s.moveTo(9*i,2*i),s.lineTo(14*i,4*i),s.lineTo(13*i,8*i),s.lineTo(9.5*i,6.5*i),s.closePath()):e.endsWith("sword")?(s.beginPath(),s.moveTo(9*i,7*i),s.lineTo(13.5*i,2.5*i),s.lineTo(15*i,4*i),s.lineTo(10.5*i,8.5*i),s.closePath()):e.endsWith("shovel")?jo(s,9.5*i,1.5*i,5*i,6*i,2*i):(s.beginPath(),s.moveTo(9*i,3*i),s.lineTo(14.5*i,3*i),s.lineTo(14.5*i,5.5*i),s.lineTo(11*i,5.5*i),s.closePath()),s.fill(),s.stroke();return}if(l){const _=e==="glowstone_dust"?"#ffd75e":e==="redstone"?"#e03030":e==="sugar"?"#f4f4f4":e==="gunpowder"?"#666":"#c8c8c8";s.fillStyle=_;const g=[[8,11,4.5],[5,12.5,3],[11.5,12.5,3],[7,8,2],[10.5,8.5,1.6],[8.5,5.5,1.2]];for(const[p,m,M]of g)s.beginPath(),s.arc(p*i,m*i,M*i,0,Math.PI*2),s.fill();return}if(d){s.fillStyle=Qo(e.replace("_ingot","").replace("gold_nugget","gold")),s.beginPath(),s.moveTo(2*i,11*i),s.lineTo(5*i,6*i),s.lineTo(14*i,6*i),s.lineTo(11*i,11*i),s.closePath(),s.fill(),s.stroke(),s.fillStyle="rgba(0,0,0,0.18)",s.fillRect(2*i,11*i,9*i,2*i);return}if(u){s.strokeStyle=e==="blaze_rod"?"#ffb02e":e==="bone"?"#eee":e==="breeze_rod"?"#9fd7ff":"#8a5a2b",s.lineWidth=2.2*i,s.beginPath(),s.moveTo(4*i,12.5*i),s.lineTo(12*i,3.5*i),s.stroke();return}if(c){s.strokeStyle="#f0f0f0",s.lineWidth=1.4*i,s.beginPath(),s.moveTo(3*i,4*i),s.bezierCurveTo(12*i,2*i,2*i,12*i,13*i,12*i),s.stroke();return}s.fillStyle=`hsl(${Hy(e)} 45% 38%)`,jo(s,2*i,2*i,12*i,12*i,3*i),s.fill(),s.strokeStyle="rgba(255,255,255,0.35)",s.stroke(),s.fillStyle="#fff",s.font=`bold ${Math.round(n*.34)}px system-ui, sans-serif`,s.textAlign="center",s.textBaseline="middle",s.fillText(Array.from(t.replace(/\s/g,"")).slice(0,2).join(""),n/2,n/2)}function iM(s,e,t,n,i){const o=`${s}@${e}`,r=Cd.get(o);if(r)return kd(r);const a=t.find(s);let l;if(a&&a.textures){const d=n.images.get("missing");l=Gy(n.images.get(a.textures[0])??d,n.images.get(a.textures[1])??d,e)}else{const d=Math.min(3,window.devicePixelRatio||1);l=document.createElement("canvas"),l.width=l.height=Math.round(e*d),l.style.width=l.style.height=`${e}px`;const u=l.getContext("2d");nM(u,s,i,e*d)}return Cd.set(o,l),kd(l)}function kd(s){const e=document.createElement("canvas");return e.width=s.width,e.height=s.height,e.style.width=s.style.width,e.style.height=s.style.height,e.getContext("2d").drawImage(s,0,0),e}class Pl{workers=[];busy=[];pending=new Map;nextJob=1;constructor(e,t=Pl.defaultCount()){for(let n=0;n<t;n++){const i=new Worker(new URL("/DragonVillage/assets/mesher.worker-XgEUB0JK.js",import.meta.url),{type:"module",name:`mesher-${n}`});i.onmessage=r=>this.onMessage(r.data),i.onerror=r=>console.error("메싱 워커 오류",r);const o={type:"init",blockInfo:e};i.postMessage(o),this.workers.push(i),this.busy.push(0)}}static defaultCount(){const e=typeof navigator<"u"&&navigator.hardwareConcurrency||2;return Math.max(1,Math.min(4,e-1))}get size(){return this.workers.length}get inflight(){return this.pending.size}mesh(e,t,n,i,o){let r=0;for(let l=1;l<this.busy.length;l++)this.busy[l]<this.busy[r]&&(r=l);const a=this.nextJob++;return this.busy[r]++,new Promise((l,d)=>{this.pending.set(a,{resolve:l,reject:d,worker:r});const u={type:"mesh",jobId:a,cx:e,cy:t,cz:n,padded:i,light:o};this.workers[r].postMessage(u,[i.buffer,o.buffer])})}onMessage(e){const t=this.pending.get(e.jobId);t&&(this.pending.delete(e.jobId),this.busy[t.worker]--,t.resolve(e))}dispose(){for(const e of this.workers)e.terminate();this.workers.length=0;for(const e of this.pending.values())e.reject(new Error("워커 풀 종료"));this.pending.clear()}}class sM{constructor(e,t){this.renderer=e;const n=window.devicePixelRatio||1;this.maxPixelRatio=Math.min(n,t?1.5:2),this.pixelRatio=t?Math.min(n,1):this.maxPixelRatio,this.apply()}renderer;ema=16;pixelRatio;maxPixelRatio;minPixelRatio=.5;timer=0;goodStreak=0;onChange=null;apply(){this.renderer.setPixelRatio(this.pixelRatio),this.onChange?.(this.pixelRatio)}frame(e){this.ema=this.ema*.94+e*1e3*.06,this.timer+=e,!(this.timer<2)&&(this.timer=0,this.ema>36&&this.pixelRatio>this.minPixelRatio?(this.pixelRatio=Math.max(this.minPixelRatio,this.pixelRatio-.25),this.goodStreak=0,this.apply()):this.ema<14&&this.pixelRatio<this.maxPixelRatio?++this.goodStreak>=3&&(this.pixelRatio=Math.min(this.maxPixelRatio,this.pixelRatio+.25),this.goodStreak=0,this.apply()):this.goodStreak=0)}resize(){this.apply()}}const oM=5,Dd=.3,Ld=.25;class rM{constructor(e,t,n,i){this.world=e,this.registry=t,this.player=n,this.events=i}world;registry;player;events;target=null;progress=0;suppressPrimary=!1;suppressSecondary=!1;breakingKey=-1;cooldown=0;placeTimer=0;swingTimer=0;selectedBlock=0;heldItem=null;hintTimer=0;getBlock=(e,t,n)=>this.world.getBlock(e,t,n);placeDoor(e,t,n,i,o){if(!this.world.inBounds(e,t+1,n)||this.world.getBlock(e,t+1,n)!==Fn||Ls(this.player.pos,Ln,e,t,n)||Ls(this.player.pos,Ln,e,t+1,n))return;const r=this.player.lookDir,a=Vl(r.x,r.z),d=Mu((_,g,p)=>{if(!this.world.inBounds(_,g,p))return!1;const m=this.registry.get(this.world.getBlock(_,g,p));return m.solid&&m.door===null},e,t,n,a),u=this.registry.doorVariant(i.num,a,!1,!1,d),c=this.registry.doorVariant(i.num,a,!0,!1,d),h=this.world.setBlock(e,t,n,u),f=this.world.setBlock(e,t+1,n,c);(h.changed||f.changed)&&(this.events.onBlocksChanged([...h.dirty,...f.dirty]),this.events.onPlaced?.(e,t,n,u,o),this.events.onSwing())}toggleDoor(e,t){const n=t.door,i=n.upper?e.y-1:e.y;if(n.open&&(Ls(this.player.pos,Ln,e.x,i,e.z)||Ls(this.player.pos,Ln,e.x,i+1,e.z)))return;const o=this.registry.doorVariant(n.base,n.facing,!1,!n.open,n.hinge),r=this.registry.doorVariant(n.base,n.facing,!0,!n.open,n.hinge),a=this.world.setBlock(e.x,i,e.z,o),l=this.world.setBlock(e.x,i+1,e.z,r);(a.changed||l.changed)&&(this.events.onBlocksChanged([...a.dirty,...l.dirty]),this.events.onPlaced?.(e.x,e.y,e.z,n.upper?r:o,e.id),this.events.onSwing())}targetable=e=>e!==Fn&&(this.bucketMode||!this.registry.isFluid(e));get bucketMode(){return this.selectedBlock>0&&this.registry.get(this.selectedBlock).fluid!==null}update(e,t){const n=this.player.eye,i=this.player.lookDir;if(this.target=pf(this.getBlock,this.targetable,n.x,n.y,n.z,i.x,i.y,i.z,oM),this.cooldown=Math.max(0,this.cooldown-t),this.suppressPrimary&&(this.breakingKey=-1,this.progress=0),e.primary&&this.target&&!this.suppressPrimary){const o=this.target,r=(o.x*1024+o.y)*1024+o.z|0;r!==this.breakingKey&&(this.breakingKey=r,this.progress=0),this.swingTimer-=t,this.swingTimer<=0&&(this.events.onSwing(),this.swingTimer=.25);const a=this.registry.get(o.id);if(a.fluid){if(this.progress=0,this.cooldown<=0&&(a.fluidLevel===0||a.fluidVolume>0)){const l=this.world.setBlock(o.x,o.y,o.z,Fn);l.changed&&(this.events.onBlocksChanged(l.dirty),this.events.onBroken?.(o.x,o.y,o.z,o.id)),this.breakingKey=-1,this.cooldown=Dd}}else if(a.hardness===null)this.progress=0;else if(this.cooldown<=0){const l=Eu(a,Su(cm,this.heldItem));if(l===null){this.progress=0,this.hintTimer-=t,this.hintTimer<=0&&(this.events.onHint?.(wu(a)),this.hintTimer=2);return}if(this.progress+=l<=0?1:t/l,this.progress>=1){const d=this.world.setBlock(o.x,o.y,o.z,Fn);if(d.changed&&(this.events.onBlocksChanged(d.dirty),this.events.onBroken?.(o.x,o.y,o.z,o.id),a.door)){const u=this.world.setBlock(o.x,a.door.upper?o.y-1:o.y+1,o.z,Fn);u.changed&&this.events.onBlocksChanged(u.dirty)}this.progress=0,this.breakingKey=-1,this.cooldown=Dd}}}else this.progress=0,this.breakingKey=-1,this.swingTimer=0;this.suppressSecondary?this.placeTimer=0:e.secondaryTap?(this.place(),this.placeTimer=Ld):e.secondaryHold?(this.placeTimer-=t,this.placeTimer<=0&&(this.place(),this.placeTimer=Ld)):this.placeTimer=0}place(){const e=this.target;if(!e)return;const t=this.registry.get(e.id);if(t.door){this.toggleDoor(e,t);return}if(t.chest){this.events.onOpenChest?.(e.x,e.y,e.z),this.events.onSwing();return}if(this.selectedBlock<=0)return;const n=e.x+e.nx,i=e.y+e.ny,o=e.z+e.nz;if(!this.world.inBounds(n,i,o))return;const r=this.world.getBlock(n,i,o);if(r!==Fn&&!this.registry.isFluid(r))return;const a=this.registry.get(this.selectedBlock);if(a.shape==="door"&&this.registry.isDoor(a.num)){this.placeDoor(n,i,o,a,r);return}if(a.torch){if(e.ny<0)return;const u=e.ny>0?-1:Vl(-e.nx,-e.nz),c=u<0?a.num:this.registry.torchVariant(a.num,u),h=this.world.setBlock(n,i,o,c);h.changed&&(this.events.onBlocksChanged(h.dirty),this.events.onPlaced?.(n,i,o,c,r),this.events.onSwing());return}if(a.solid&&Ls(this.player.pos,Ln,n,i,o))return;const l=a.fluid?this.registry.fluidFinite(a.fluidSource,Aa):this.selectedBlock,d=this.world.setBlock(n,i,o,l);d.changed&&(this.events.onBlocksChanged(d.dirty),this.events.onPlaced?.(n,i,o,l,r),this.events.onSwing())}}const aM=500,lM=50,cM="grass_island";function dM(s){const e=s.charCodeAt(s.length-1)-44032;if(e<0||e>11171)return"로";const t=e%28;return t===0||t===8?"로":"으로"}const hM=["북","북서","서","남서","남","남동","동","북동"];async function fM(s,e){const{isTouch:t,net:n,welcome:i}=e,o=sm,r=await ny(),a=QA(o,r.index),l=i.playerIdx,d=new LA({antialias:!1,alpha:!1,powerPreference:"high-performance",stencil:!1});d.domElement.className="game",d.domElement.tabIndex=0,d.autoClear=!1,d.setClearColor(pr,1),s.appendChild(d.domElement);const u=new ph,c=new yn(70,1,.05,600);c.rotation.order="YXZ";const h=v1(r.texture),f=new Pl(a),_=t?5:8;(()=>{const x=_*Tt;h.setFog(x*.55,x*.98),c.far=x*1.3+50,c.updateProjectionMatrix()})();const p=new F1(u),m=new N1(u),M=new D1(h,a),w=new o1(u),b=new $A(u);b.sync(i.nestDragons);let R=i.nestDragons,v=i.spawn.riding??null;const S="dv.guide",C={1:"① 나침반의 금색 점을 따라 북쪽 포탈로 가요",2:'② 포탈 안에 서서 "원정 출발" 을 눌러요',3:"③ 블록을 꾹 눌러 모아요 · 6분 뒤엔 밤! 가운데 포탈로 돌아와요"};let A=(()=>{try{const x=localStorage.getItem(S);if(x==="done")return 0;if(x)return Number(x)||0}catch{}return i.first?1:0})();const y=x=>{A=x;try{localStorage.setItem(S,x===0?"done":String(x))}catch{}I.setGuide(C[x]??null)},D=new Map;let L=null;const O=new oy(s,am.names,(x,N)=>n.sendNameMob(x,N),()=>{Ee&&!I.overlayVisible&&!I.resultVisible&&!Ye()&&Ge()});let G=ba(Dn,i.spawn.equip??null),W=!1,F=0,Y=!1,B=null,se=0;const de=new ZA(u),xe=new fy(u),Oe=new _y(u),Me=new by(u),Z=new Map,Pe=x=>{let N=Z.get(x);return N===void 0&&(N=Ay(Se(o.get(x).id,16)),Z.set(x,N)),N};let K=0,$=i.hp;const oe=new Vy(u);let pe=0,he=null,Ie=0;const _t=()=>v?df(pn.require(v.dragon)).stamina:0,P=()=>{if(!he||!v)return;const x=Date.now()+Ie,N=hf({value:he.value,at:he.at},he.max,x);I.setStamina(N,he.max,_t(),Math.max(0,he.readyAt-x)/1e3)},ut=()=>{!v||!Ee||nn||n.sendSkill("beam")},I=new ly(s,t),we=x=>x in Gl?Gl[x]:Kl(x,o,Ma),Se=(x,N)=>iM(x,N,o,r,we(x));w.iconOf=x=>Se(x,32);let ot;const ve=Tu(i.inventory),Xe=()=>{const x=[];for(let N=0;N<rr;N++){const te=ve[N];x.push(te?{item:te.item,count:te.count,name:we(te.item),icon:Se(te.item,40)}:{item:null,count:0,name:"빈 칸",icon:null})}I.setSlots(x)};Xe();const St=()=>{const x=I.selectedItem;return x?tf(x,o)??0:0};let rt=i.expedition,k=i.village_state??{built:[],level:1,codex:0,codexIds:[],eggSlots:4},E=null,X=null,J=null,re=0;const j=()=>Pr.v1().filter(x=>_f(x.generator)&&Qu(x.unlockedBy,k.built));let Ue=new Set(k.codexIds);const fe=()=>{const x=rt?` · 원정 중: ${rt.name} ${rt.players}명`:"";I.setVillageInfo(`마을 "${i.village.name}" 레벨 ${k.level} · 코드 ${i.village.code} · 지금 ${w.count+1}명${x} (친구에게 코드를 알려 주면 같은 마을에 들어와요)`)};let ke=i.dragons,Ne=i.nest;const ne=new iy(s,{recipes:lm,potions:rm,dragons:pn,owned:()=>new Set(ke.filter(x=>x.stage!=="egg").map(x=>x.dragon)),codexBlocks:()=>Ue,codexCandidates:()=>o.defs.filter(x=>!x.internal&&x.id!=="air"&&x.textures).map(x=>[x.id,x.name]),icon:Se,nameOf:we,onMove:(x,N,te)=>n.sendInvMove(x,N,te),onDrop:(x,N)=>n.sendInvDrop(x,N),onCraft:x=>n.sendCraft(x),equipment:()=>G,equipSlotOf:x=>Cu(Dn,x),armorDefense:()=>Hl(Dn,G).defense,onEquip:x=>n.sendEquip(x),onUnequip:x=>n.sendUnequip(x),onBrew:(x,N)=>{n.sendBrew(x,N),ne.clearBrewSelection()},onClose:()=>mt()});ne.setInventory(ve);const me=new hy(s,{dragons:pn,xp:$o,nameOf:we,onPlace:(x,N)=>n.sendPlaceEgg(x,N),onHatch:x=>n.sendHatch(x),onFeed:(x,N)=>n.sendFeed(x,N),onRide:x=>{n.sendRide(x),bt()},onClose:()=>bt(),eggSlots:()=>k.eggSlots});me.setInventory(ve),me.setDragons(ke),me.setNest(Ne,i.nestDragons),me.setXp(i.xp);const Be=new py(s,{buildings:om,icon:Se,nameOf:we,onMove:(x,N,te)=>n.sendStorageMove(x,N,te),onBuild:x=>n.sendBuild(x),onClose:()=>ft()});Be.setInventory(ve),Be.setStorage(i.storage??[]),Be.setVillage(k.built,k.level,k.codex);const Re=new ry(s,{icon:Se,nameOf:we,onMove:(x,N,te)=>{const _e=Re.position;_e&&n.sendChestMove(_e.x,_e.y,_e.z,x,N,te)},onClose:()=>ni()}),ge=new sy(s,Jl,(x,N)=>n.sendEmote(x,N),()=>Nt());let We=0;const U=()=>{const x={},N=ce.world,te=ce.player.pos,_e=Math.floor(te.x),Ae=Math.floor(te.y+1),qe=Math.floor(te.z),tt=new Map;for(const lt of["crafting_table","furnace","brewing_stand"]){const nt=o.find(lt);nt&&tt.set(nt.num,lt)}for(let lt=Ae-5;lt<=Ae+5&&tt.size;lt++)for(let nt=qe-5;nt<=qe+5&&tt.size;nt++)for(let vn=_e-5;vn<=_e+5&&tt.size;vn++){if(!N.inBounds(vn,lt,nt))continue;const si=tt.get(N.getBlock(vn,lt,nt));si&&(x[si]=!0,tt.delete(N.getBlock(vn,lt,nt)))}const at=ya("forge");if(ce.kind==="village"&&at&&k.built.includes("forge")){const lt=Rr(at);Math.hypot(te.x-lt.x,te.z-lt.z)<=Wl&&(x.forge=!0)}return x},ie=new OA,ae=new zA(d.domElement);ie.add(ae);const Te=new YA(I.touchUI);ie.add(Te),ie.add(new FA),ie.paused=!0;const le=new Map;let ee=0;const Le=(x,N,te,_e,Ae)=>{ee=ee+1&65535,le.set(ee,{x,y:N,z:te,prev:Ae,id:_e}),n.sendBlockChange({seq:ee,x,y:N,z:te,id:o.get(_e).id,slot:I.selectedIndex}),le.size>200&&le.delete(le.keys().next().value)},He=(x,N,te)=>{for(const[_e,Ae]of le)Ae.x===x&&Ae.y===N&&Ae.z===te&&le.delete(_e)};let ce;const it=(x,N,te,_e)=>{const Ae=x==="expedition"&&N?vf(Pr.require(N.id),o,N.seed):Nu(o,i.village.seed),{world:qe}=Ae;for(const Ze of _e)qe.chunkInBounds(Ze.cx,Ze.cy,Ze.cz)&&jl(Ze.bytes,o,qe.getOrCreateChunk(Ze.cx,Ze.cy,Ze.cz));const tt=new gf(qe,o);tt.computeAll();const at=new x1(qe,tt,h,f,u);at.renderDistance=_,at.markAll();const lt=new m1(qe,o,te,te.yaw);lt.pitch=te.pitch,lt.riding=v!==null;const nt=(Ze,wt,Rt,oi)=>{const Wi=o.find(oi),wr=Wi?Wi.num:Fn,Xi=qe.setBlock(Ze,wt,Rt,wr);Xi.changed&&(at.markDirtyAll(Xi.dirty),tt.markChanged(Ze,wt,Rt))},vn=new rM(qe,o,lt,{onBlocksChanged:Ze=>at.markDirtyAll(Ze),onSwing:()=>M.swing(),onPlaced:(Ze,wt,Rt,oi,Wi)=>{tt.markChanged(Ze,wt,Rt),Le(Ze,wt,Rt,oi,Wi)},onBroken:(Ze,wt,Rt,oi)=>{tt.markChanged(Ze,wt,Rt),Le(Ze,wt,Rt,Fn,oi),Me.burst(Ze,wt,Rt,Pe(oi))},onHint:Ze=>I.toast(Ze,2e3),onOpenChest:(Ze,wt,Rt)=>{ne.visible||me.visible||ge.visible||n.sendOpenChest(Ze,wt,Rt)}}),si="layout"in Ae?Ae.layout.portal:Ae.portal,Sr=new B1(u,si,x==="expedition"?4177148:9060348);return{kind:x,world:qe,light:tt,chunks:at,player:lt,interaction:vn,portal:Sr,portalPos:si,genMs:Ae.ms,expedition:N,localStart:N?performance.now()-(N.serverNow-N.startedAt):0,applyServerBlock:nt}},_n=(x,N,te,_e)=>ce.applyServerBlock(x,N,te,_e),an=x=>{x.chunks.dispose(),u.remove(x.chunks.group),x.portal.dispose()};let gi=1;const Nn=x=>{Math.abs(x-gi)<.002||(gi=x,h.setSkyLight(x),p.setBrightness(x),d.setClearColor(pr.clone().multiplyScalar(x),1))};ce=it("village",null,{...i.spawn},i.chunks);for(const x of i.players)w.upsert(x);fe();let _i=!1,Oi=!1;const ho=x=>{an(ce),le.clear(),ce=it(x.kind,x.expedition,{...x.spawn},x.chunks);for(const N of w.indices())w.remove(N);for(const N of x.players)w.upsert(N);b.visible=x.kind==="village",Te.clearHolds(),_i=Oi=!1,I.hideAction(),Oe.clear(),oe.clear(),x.kind==="expedition"&&x.expedition?I.toast(`${x.expedition.name}에 도착했어요! 가운데 포탈로 돌아오면 모은 것을 가져가요`,5e3):(Nn(1),I.setTimer(null,null),I.toast("마을로 돌아왔어요",3e3)),fe(),uo()},zi=x=>{const N=x.items.map(tt=>({name:Kl(tt.id,o,Ma),count:tt.count,icon:Se(tt.id,28)})),te=x.items.reduce((tt,at)=>tt+at.count,0),_e=Math.floor(x.elapsedSec/60),Ae=x.elapsedSec%60,qe=x.late?`시간이 다 되어 저절로 돌아왔어요. 절반만 가져왔어요 (${Math.round(x.keepRatio*100)}%)`:`${_e}분 ${Ae}초 만에 돌아왔어요. 모은 것 ${te}개를 마을 창고에 넣었어요`;ie.paused=!0,ae.enabled=!1,I.showResult(`${x.name} 원정 끝!`,qe,N,"한 번 더 갈까?",()=>{n.sendStartExpedition(x.expedition),Ge()},()=>Ge())};let nn=!1,vi=!1,wn=i.xp;I.setXp(wn);const Rs=(x,N,te)=>{const _e=ar(wn).level;if(wn=x,I.setXp(wn),me.setXp(wn),N){const qe=new H(N.x,N.y,N.z).project(c),tt=d.domElement.clientWidth,at=d.domElement.clientHeight,lt=qe.z<1&&Math.abs(qe.x)<=1.1&&Math.abs(qe.y)<=1.1,nt=lt?(qe.x+1)/2*tt:tt/2,vn=lt?(1-qe.y)/2*at:at*.55;window.setTimeout(()=>{I.xpOrbs(nt,vn,Math.min(10,3+Math.ceil(te/2)),te),Vo()},350)}const Ae=ar(wn).level;if(Ae>_e){da();const qe=Bu($o,_e,Ae);I.toast(qe.length?`레벨 ${Ae}! ${qe.map(tt=>Fu[tt.id]??tt.id).join("·")} 열렸어요`:`레벨 ${Ae}!`,4e3)}};let ln=i.today;const yr=x=>{const N=ln;ln=x,I.setToday(x),N&&x.bonusMin>N.bonusMin&&I.toast(`+${x.bonusMin-N.bonusMin}분! 할 일이 확인됐어요`,5e3),!(!x.enforced||!N)&&(N.remainingMin>5&&x.remainingMin<=5&&x.remainingMin>1?I.toast(`오늘 게임 시간이 ${x.remainingMin}분 남았어요`,6e3):N.remainingMin>1&&x.remainingMin===1&&I.toast("1분 남았어요 — 곧 마을에서 나가요. 내일 다시!",8e3),N.minutesUntilBlocked>5&&x.minutesUntilBlocked<=5&&x.minutesUntilBlocked>0&&I.toast(`${x.minutesUntilBlocked}분 뒤에 게임 시간이 끝나요`,6e3))};n.attach({onChunk:x=>{if(ce.world.chunkInBounds(x.cx,x.cy,x.cz)){jl(x.bytes,o,ce.world.getOrCreateChunk(x.cx,x.cy,x.cz)),ce.chunks.markDirty(x.cx,x.cy,x.cz);for(let N=0;N<Tt;N++)for(let te=0;te<Tt;te++)for(let _e=0;_e<Tt;_e++)ce.light.markChanged(x.cx*16+_e,x.cy*16+N,x.cz*16+te)}},onBlockChanged:x=>{He(x.x,x.y,x.z),_n(x.x,x.y,x.z,x.id)},onBlockBatch:x=>{for(const N of x.blocks)_n(N.x,N.y,N.z,N.id)},onRejected:x=>{const N=le.get(x.seq);if(le.delete(x.seq),N){const te=ce.world.setBlock(N.x,N.y,N.z,N.prev);te.changed&&(ce.chunks.markDirtyAll(te.dirty),ce.light.markChanged(N.x,N.y,N.z));const _e=o.get(N.prev).door,Ae=o.get(N.id).door??_e;if(Ae){const qe=Ae.upper?N.y-1:N.y+1,tt=_e?o.doorVariant(_e.base,_e.facing,!_e.upper,_e.open,_e.hinge):Fn,at=ce.world.setBlock(N.x,qe,N.z,tt);at.changed&&(ce.chunks.markDirtyAll(at.dirty),ce.light.markChanged(N.x,qe,N.z))}}I.toast(ku[x.reason]??"서버가 거절했어요",2500)},onPlayers:x=>w.setState(x,l),onPlayerJoined:x=>{w.upsert(x),I.toast(ce.kind==="expedition"?`${x.nick} 님이 원정에 왔어요`:`${x.nick} 님이 들어왔어요`,3e3),fe()},onPlayerLeft:x=>{const N=w.nickOf(x);w.remove(x),N&&I.toast(ce.kind==="expedition"?`${N} 님이 마을로 갔어요`:`${N} 님이 나갔어요`,3e3),fe()},onError:(x,N)=>I.toast(N,4e3),onToday:x=>yr(x),onDragons:x=>{const N=ke.filter(Ae=>Ae.stage!=="egg").length,te=new Map(ke.map(Ae=>[Ae.id,Ae.stage]));if(ke=x,me.setDragons(x),x.filter(Ae=>Ae.stage!=="egg").length>N){const Ae=x.filter(qe=>qe.stage!=="egg").at(-1);I.toast(`🐉 ${pn.find(Ae.dragon)?.name??Ae.dragon}이 태어났어요! 도감에 등록됐어요`,6e3)}for(const Ae of x)Ae.stage==="adult"&&te.get(Ae.id)==="baby"&&I.toast(`🐲 ${pn.find(Ae.dragon)?.name??Ae.dragon}이 어른이 됐어요! 더 크고 무서워졌어요`,6e3)},onNest:(x,N)=>{Ne=x,R=N,me.setNest(x,N),b.sync(N)},onChest:(x,N,te,_e)=>{Re.setInventory(ve),Re.setChest(x,N,te,_e),ie.paused=!0,ae.enabled=!1,ae.locked&&document.exitPointerLock()},onHeld:(x,N)=>{x!==l&&w.setHeld(x,N)},onEquip:x=>{if(x.idx!==l){w.setEquip(x.idx,x.parts);return}G=ba(Dn,x.parts),I.setArmor(x.defense),I.setGuardAvailable(G.shield!==null),ne.refresh()},onArrow:x=>oe.shot(x.from,x.to),onDragonHp:x=>I.setDragonHp(x.hp,x.max),onDragonDown:x=>{const N=pn.find(x.dragon)?.name??x.dragon;I.toast(`😵 ${N}이(가) 쓰러졌어요 — 둥지에서 ${Math.round((x.restUntil-(Date.now()+Ie))/6e4)}분 쉬면 다시 탈 수 있어요`,7e3),qc()},onPets:x=>{D.clear();for(const N of x)D.set(N.id,{name:N.name,mine:N.mine});oe.setPetNames(x)},onShot:x=>{const N=oe.positionOf(x.id);if(!N)return;const te=ce.player,_e=x.idx===l?{x:te.eye.x+te.lookDir.x*.6,y:te.eye.y-.25,z:te.eye.z+te.lookDir.z*.6}:x.from;oe.shot(_e,N)},onRaid:x=>{if(E=x,!x){I.hideRaid(),J=null;return}x.phase!==J&&(J=x.phase,x.phase==="warning"?NA():x.phase==="wave"?ha():x.phase==="won"?da():x.phase==="lost"&&qc());const N=`${Math.floor(x.secLeft/60)}:${String(x.secLeft%60).padStart(2,"0")}`;x.phase==="warning"?I.setRaid(`🔔 우민이 온다! ${x.warnLeft}초 · 깃대를 지켜요`):x.phase==="wave"?I.setRaid(`⚔️ 파도 ${x.wave}/${x.waves} · 우민 ${x.remaining} · ${N}${x.capture>0?` · 🚩 깃대 ${x.capture}/${Ru}`:""}`,x.capture>0):x.phase==="won"?I.setRaid("🏆 마을을 지켰다!"):I.setRaid("💀 우민이 깃대를 차지했어요…",!0)},onMount:(x,N)=>{if(x!==l){w.setMount(x,N);return}v=N,ce.player.riding=!0,de.set(N.dragon),I.setRiding(!0,pn.find(N.dragon)?.skills.find(te=>te.type==="beam")?.name??"빔"),he={value:po("adult"),max:po("adult"),at:Date.now()+Ie,readyAt:0},P(),I.hideAction(),I.toast(`🐉 ${pn.find(N.dragon)?.name??N.dragon}을 탔어요! ${t?"▲ 위로 · ▼ 아래로":"Space 위로 · Shift 아래로"} · 내리기는 🐉 버튼`,6e3)},onDismount:x=>{if(x!==l){w.setMount(x,null);return}v=null,ce.player.riding=!1,de.set(null),I.setRiding(!1),he=null,Te.clearHolds()},onStorage:x=>{Be.setStorage(x),!Be.visible&&At&&(At=!1,Be.show(),ie.paused=!0,ae.enabled=!1,ae.locked&&document.exitPointerLock())},onVillage:x=>{const N=k.level;k={...k,built:x.built,level:x.level,codex:x.codex,eggSlots:x.eggSlots},Be.setVillage(x.built,x.level,x.codex),me.setInventory(ve),fe(),x.level>N&&I.toast(`🏘️ 마을 레벨 ${x.level}! 광장 깃대에 깃발이 늘었어요`,5e3)},onCodex:x=>{Ue=new Set([...Ue,x.id]),ne.setInventory(ve),I.toast(`📖 새로 발견! ${we(x.id)} — 마을 도감 ${x.total}종 (+${$o.ours.codexNewEntry})`,4500)},onHealth:x=>{x.hp<$&&(I.hurtFlash(),IA(),x.cause==="poison"&&I.toast("🕷️ 독에 물렸어요 — 잠깐 아파요",1500)),x.cause==="blocked"&&I.toast("🛡️ 방패로 막았어요",1200),$=x.hp,I.setHealth(x.hp,x.max)},onRespawn:x=>{const N=ce.player;N.pos.x=x.x,N.pos.y=x.y,N.pos.z=x.z,N.vel.x=N.vel.y=N.vel.z=0,uo(),I.toast(x.dropped>0?`💀 쓰러졌어요… 경험치 구슬 ${x.dropped}개가 그 자리에 남았어요. 가서 되찾아요!`:"💀 쓰러졌어요… 다시 일어났어요",6e3)},onMobs:x=>{oe.setState(x);const N=x.find(te=>ui[te.kind]===fo);N?I.setBoss(`🕷️ ${er.get(fo).name}`,N.hp,er.get(fo).hp):I.hideBoss()},onMobEvent:x=>{oe.event(x.ev,x.id,x.x,x.y,x.z,performance.now(),x.dmg),x.ev==="explode"?(I.hurtFlash(),BA()):x.ev==="die"?(Vo(),x.mob===fo&&(I.hideBoss(),da())):x.ev==="hit"?UA():x.ev==="love"||x.ev==="tame"||x.ev==="grow"?Vo():x.ev==="wake"?(ha(),I.hurtFlash()):x.ev==="summon"&&ha()},onOrbs:x=>Oe.set(x),onOrbGone:(x,N)=>{Oe.remove(x),N===l&&Vo()},onBeam:x=>{xe.fire(x.from,x.dir,x.color,x.power,x.range),PA(x.power)},onStamina:x=>{Ie=x.now-Date.now(),he={value:x.value,max:x.max,at:x.now,readyAt:x.readyAt},P()},onXpGained:x=>Rs(wn+x.amount,{x:x.x,y:x.y,z:x.z},x.amount),onXpState:x=>Rs(x.total,null,0),onTimeUp:(x,N)=>{vi=!0,nn=!0,ie.paused=!0,ae.enabled=!1,I.hideToday(),I.hideAction(),I.showOverlay("오늘은 여기까지!",N+`
확인을 누르면 마을에서 나가요.`,"확인")},onApprovalAsk:x=>I.showApproval(x),onPending:x=>I.setPending(x),onClose:x=>{nn=!0,ie.paused=!0,ae.enabled=!1,!vi&&I.showOverlay("서버와 연결이 끊어졐어요",x+`
다시 들어가려면 아래를 눌러요.`,"다시 연결")},onWorldEnter:ho,onExpeditionResult:x=>{zi(x),A===3&&(y(0),setTimeout(()=>I.toast("🎉 첫 원정 끝! 가져온 걸로 마을을 꾸며 봐요 — 게임 방법(?)에 더 많은 게 있어요",7e3),1500))},onExpeditionState:x=>{const N=!!rt;rt=x,!N&&x&&ce.kind==="village"&&I.toast(`${x.name} 원정이 시작됐어요! 포탈에서 따라갈 수 있어요`,5e3),fe()},onTimer:x=>{ce.expedition&&(ce.localStart=performance.now()-x.elapsedSec*1e3)},onInvSlots:x=>{for(const N of x.slots)N.slot>=0&&N.slot<ve.length&&(ve[N.slot]=N.count>0?{item:N.item,count:N.count}:null);Xe(),ne.setInventory(ve),me.setInventory(ve),Re.setInventory(ve),Be.setInventory(ve)},onEmote:x=>{const N=Jl.text(x.kind,x.id);if(!N)return;const te=x.idx===l?"나":w.nickOf(x.idx)??"누군가";ge.add(te,N),x.idx!==l?w.say(x.idx,N,x.kind===Od?2.5:3.5):I.toast(N,2500)}});const Vi=new sM(d,t);let ks=0,Ds=0;const Gi=(x=!1)=>{const N=s.clientWidth||window.innerWidth,te=s.clientHeight||window.innerHeight;N<=0||te<=0||!x&&N===ks&&te===Ds||(ks=N,Ds=te,c.aspect=N/te,c.updateProjectionMatrix(),d.setSize(N,te,!1))};Vi.onChange=()=>Gi(!0),Gi(!0);const T=()=>Gi();window.addEventListener("resize",T),window.addEventListener("orientationchange",()=>setTimeout(T,200)),document.addEventListener("fullscreenchange",()=>{T(),setTimeout(T,300)}),window.visualViewport?.addEventListener("resize",T);const z=typeof ResizeObserver<"u"?new ResizeObserver(T):null;z?.observe(s);let q=!1;I.debugBtn.addEventListener("click",()=>q=!q);const Q=window.matchMedia("(display-mode: standalone), (display-mode: fullscreen)").matches||navigator.standalone===!0,V=!!document.fullscreenEnabled&&typeof document.documentElement.requestFullscreen=="function",ue=`이 브라우저는 전체화면이 안 돼요.
공유 버튼 → "홈 화면에 추가" 로 열면 전체화면이 돼요.`,be=()=>{Q?I.setFullscreen("hidden"):V?I.setFullscreen(document.fullscreenElement?"on":"off"):I.setFullscreen("unavailable")};be(),document.addEventListener("fullscreenchange",be);async function De(){if(!V)return!1;try{document.fullscreenElement||await document.documentElement.requestFullscreen({navigationUI:"hide"});const x=screen.orientation;return x.lock&&await x.lock("landscape").catch(()=>{}),!0}catch{return!1}}async function Ce(){try{document.fullscreenElement&&await document.exitFullscreen()}catch{}}I.fullscreenBtn.addEventListener("click",()=>{if(!V){I.toast(ue,7e3);return}document.fullscreenElement?Ce():De().then(x=>{x||I.toast("전체화면을 켤 수 없었어요. 다시 한 번 눌러 보세요.",4e3)})});let Ee=!1,Ve=!1;const Fe=()=>{ie.paused=!0,ae.enabled=!1,I.showOverlay("잠깐 멈춤","ESC 로 나왔어요. 다시 들어가려면 아래를 눌러요.","계속하기")},Ge=()=>{nn||(I.hideOverlay(),ie.paused=!1,ae.enabled=!0,d.domElement.focus(),t||ae.requestLock().then(x=>{!x&&!Ve&&(Ve=!0,I.toast("이 브라우저는 마우스 잠금이 안 돼요. 마우스를 움직여 둘러보세요.",5e3))}))},Ye=()=>ne.visible||ge.visible||me.visible||Re.visible||Be.visible||O.visible;let At=!1;const vt=()=>{Ye()||!Ee||nn||(At=!0,n.sendOpenStorage())},ft=()=>{Be.visible&&(Be.hide(),Ee&&!I.overlayVisible&&!I.resultVisible&&!Ye()&&Ge())},ze=()=>{!Ee||nn||I.resultVisible||(ie.paused=!0,ae.enabled=!1,ae.locked&&document.exitPointerLock(),ne.setStations(U()),ne.setInventory(ve),ne.show())},mt=()=>{ne.visible&&(ne.hide(),Ee&&!I.overlayVisible&&!I.resultVisible&&!Ye()&&Ge())},et=()=>{!Ee||nn||I.resultVisible||(ie.paused=!0,ae.enabled=!1,ae.locked&&document.exitPointerLock(),ge.show())},jt=(x,N)=>{!Ee||nn||I.resultVisible||Ye()||(I.hideAction(),ie.paused=!0,ae.enabled=!1,ae.locked&&document.exitPointerLock(),O.show(x,N))},ni=()=>{Re.visible&&(Re.hide(),Ee&&!I.overlayVisible&&!I.resultVisible&&!Ye()&&Ge())},Nt=()=>{ge.visible&&(ge.hide(),Ee&&!I.overlayVisible&&!I.resultVisible&&!Ye()&&Ge())},xi=()=>{Ye()||(me.setXp(wn),me.setInventory(ve),me.show(),ie.paused=!0,ae.enabled=!1)},bt=()=>{me.visible&&(me.hide(),Ee&&!I.overlayVisible&&!I.resultVisible&&!Ye()&&Ge())};I.bagBtn.addEventListener("click",()=>ne.visible?mt():ze()),I.rideBtn.addEventListener("click",()=>n.sendDismount()),I.skillBtn.addEventListener("click",ut),I.setToday(i.today),I.setHealth($,20),I.setArmor(Hl(Dn,G).defense),I.setGuide(C[A]??null),I.setGuardAvailable(G.shield!==null),ce.player.guardSlow=Dn.shield.guardSlow,v&&(de.set(v.dragon),I.setRiding(!0,pn.find(v.dragon)?.skills.find(x=>x.type==="beam")?.name??"빔"),he={value:po("adult"),max:po("adult"),at:Date.now()+Ie,readyAt:0},P()),I.onCheckTodo=x=>n.sendCheckTodo(x),I.onApprove=(x,N)=>n.sendApproveTodo(x.id,x.date,N),I.setPending(i.pending),i.pending.length&&I.toast(`승인 기다리는 할 일이 ${i.pending.length}개 있어요 — 위의 ✅ 를 눌러 보세요`,6e3),i.today&&I.toast(`오늘 남은 시간 ${i.today.remainingMin}분 · 할 일 ${i.today.todos.length}개 — 위의 ⏱ 를 누르면 보여요`,6e3),I.setFamily(i.family,i.parentOf),I.familyBtn.addEventListener("click",async()=>{const x=await Du(s,{title:"가족 연결",sub:"아빠·엄마 화면(/family)에 있는 가족 코드 6자리를 넣어요",pattern:/^\d{6}$/,invalid:"숫자 6자리예요",placeholder:"가족 코드 6자리",maxLength:6,okLabel:"다음"});if(!x)return;const N=await Lu(s,"내 PIN","내 계정이 맞는지 PIN 4자리로 확인해요","연결","취소");if(N)try{const te=await n.linkFamily(x,N);I.setFamily(te),I.toast("가족에 연결됐어요! 아빠·엄마 화면에 내 이름이 보여요",5e3)}catch(te){I.toast(te.message||"연결할 수 없어요",5e3)}}),I.chatBtn.addEventListener("click",()=>ge.visible?Nt():et()),window.addEventListener("keydown",x=>{!Ee||nn||(x.code==="KeyE"?(ne.visible?mt():!ge.visible&&!I.overlayVisible&&!I.helpVisible&&!I.resultVisible&&ze(),x.preventDefault()):x.code==="KeyF"&&v&&!Ye()&&!I.overlayVisible?(ut(),x.preventDefault()):x.code==="KeyT"?(ge.visible?Nt():!ne.visible&&!I.overlayVisible&&!I.helpVisible&&!I.resultVisible&&et(),x.preventDefault()):x.code==="Escape"&&(ne.visible||ge.visible)&&(mt(),Nt()))}),I.onOverlayClick=()=>{if(nn){window.location.reload();return}Ee&&Ge()},I.onHelpToggle=x=>{x?(ie.paused=!0,ae.enabled=!1):Ee&&!I.overlayVisible&&!I.resultVisible&&!Ye()&&Ge()},document.addEventListener("pointerlockchange",()=>{t||!Ee||ae.lockFailed||nn||!ae.locked&&!I.overlayVisible&&!I.helpVisible&&!I.resultVisible&&!I.actionVisible&&!Ye()&&Fe()}),s.addEventListener("click",x=>{x.target?.closest(".action-card, .result-panel, .bag-panel, .chat-panel, .nest-panel, .side-btns")||Ee&&!t&&!ae.locked&&!I.overlayVisible&&!I.resultVisible&&!Ye()&&Ge()});let Wt=!1,Xt=performance.now(),Lt=0,Pt=0,Hi=0,Tn=0,Il=0,Ul=0,Nl=0,Mr=0;const Dh=t?.6:1;function uo(){if(!n.connected)return;const x=ce.player,N=(x.sneaking?Fd:0)|(x.sprinting?Pu:0)|(x.onGround?Iu:0)|(x.inWater?Uu:0)|(x.riding?Bd:0);n.sendMove({x:x.pos.x,y:x.pos.y,z:x.pos.z,yaw:x.yaw,pitch:x.pitch,flags:N})}const Bl=()=>ce.expedition?(performance.now()-ce.localStart)/1e3:0,ii=t?"":"  (Enter)",Fl=x=>{x.code!=="Enter"&&x.code!=="NumpadEnter"||!Ee||!I.actionVisible||I.resultVisible||I.overlayVisible||I.helpVisible||(x.preventDefault(),I.triggerAction())};window.addEventListener("keydown",Fl);const Lh=()=>{const x=ce.player.eye,N=ce.player.lookDir;let te=null,_e=5;for(const Ae of R){if(!Ae.mine)continue;const qe=Ae.perch.x+.5-x.x,tt=Ae.perch.y+.6-x.y,at=Ae.perch.z+.5-x.z,lt=Math.hypot(qe,tt,at);lt>_e||lt<.01||(qe*N.x+tt*N.y+at*N.z)/lt<.8||(te=Ae,_e=lt)}return te},Ph=()=>ve.some(x=>x!==null&&x.item===zd);let Er=null;const Ih=()=>{const x=ce.player.pos;if(L!==null&&D.get(L)?.mine&&!O.visible){const te=D.get(L),_e=L;I.showAction(`🐾 ${te.name??"내 강아지"}`,te.name?"빈손 탭 → 앉기/일어나기 · 이름을 바꿀 수도 있어요":"이름을 지어 줘요 (목록에서 골라요) · 빈손 탭 → 앉기/일어나기",(te.name?"이름 바꾸기":"이름 짓기")+ii,()=>jt(_e,te.name));return}if(!Yu(ce.portalPos,x.x,x.y,x.z)){if(ce.kind==="village"&&!v){const _e=Lh();if(_e||(Er=null),_e&&_e.id!==Er){const Ae=pn.find(_e.dragon)?.name??_e.dragon,qe=()=>{Er=_e.id,I.hideAction()};_e.stage!=="adult"?I.showAction(`${Ae} (아기)`,"어른이 되면 탈 수 있어요 — 둥지 창에서 먹이를 주면 빨리 자라요","알겠어요",qe):_e.restingUntil&&_e.restingUntil>Date.now()+Ie?I.showAction(`${Ae} 쉬는 중`,`쓰러져서 ${Math.max(1,Math.ceil((_e.restingUntil-(Date.now()+Ie))/6e4))}분 더 쉬어야 탈 수 있어요`,"알겠어요",qe):Ph()?I.showAction(`🐉 ${Ae} 타기`,t?"앞으로 밀면 보는 쪽으로 날아요 · ▲ 위로 · ▼ 아래로 · 🐉 버튼으로 내려요":"W 로 보는 쪽으로 날아요 · Space 위로 · Shift 아래로 · 🐉 버튼으로 내려요","타기"+ii,()=>n.sendRide(_e.id)):I.showAction(`${Ae} 타기`,"안장이 있어야 해요 — 제작대: 가죽 5 + 철 2 (가죽은 원정 보물 상자)","알겠어요",qe);return}}const te=ya("storage");if(ce.kind==="village"&&te&&Math.hypot(x.x-Rr(te).x,x.z-Rr(te).z)<=Wl){I.showAction("마을 창고",`마을 레벨 ${k.level} · 재료를 모아 건물을 지어요`,"창고 열기"+ii,vt);return}if(ce.kind==="village"&&qu(Ku,x.x,x.y,x.z)){I.showAction("드래곤 둥지","알을 놓고, 레벨을 써서 부화시켜요","둥지 열기"+ii,xi);return}if(ce.kind==="village"&&!E&&Math.hypot(x.x-(Xl.x+.5),x.z-(Xl.z+.5))<=4){const _e=Yl(Math.ceil(Ai.durationSec/60),_o);if(ln?.enforced&&!ql(ln,Math.ceil(Ai.durationSec/60),_o)){I.showAction("오늘은 방어전은 쉬어요",`방어전은 ${_e}분 필요해요`,"알겠어요",()=>I.hideAction());return}k.level<Ai.minVillageLevel?I.showAction("🔔 우민 방어전",`마을 레벨 ${Ai.minVillageLevel}부터 우민이 쳐들어와요 (지금 ${k.level})`,"알겠어요",()=>I.hideAction()):I.showAction("🔔 우민 방어전",`${Math.round(Ai.durationSec/60)}분 · 파도 ${Ai.waves}번 · 우민이 북쪽에서 깃대로 와요
마을은 부서지지 않아요 · 일주일에 ${Ai.maxPerWeek}번`,"방어 시작"+ii,()=>n.sendStartRaid());return}I.actionVisible&&I.hideAction();return}if(ce.kind==="village"){const te=j(),_e=te[re%Math.max(1,te.length)]??Pr.require(cM);if(ln?.enforced&&!ql(ln,Math.ceil(_e.durationSec/60),_o)){const Ae=Yl(Math.ceil(_e.durationSec/60),_o),qe=ln.noPlayToday?"오늘은 게임 없는 날이에요":ln.minutesUntilBlocked<ln.remainingMin?`게임 시간이 ${ln.minutesUntilBlocked}분 뒤에 끝나요`:`남은 시간 ${ln.remainingMin}분`;I.showAction("오늘은 마을에서 놀자",`${qe} · 원정은 ${Ae}분 필요해요`,"알겠어요",()=>I.hideAction());return}if(rt){const Ae=Math.floor(rt.remainingSec/60);I.showAction(`${rt.name} 원정 중`,`${rt.players}명이 나가 있어요 · 약 ${Ae}분 남음`,"따라가기"+ii,()=>n.sendStartExpedition(rt.id))}else{const Ae=_e.nightStartsAt>0?`${Math.round(_e.nightStartsAt/60)}분 뒤 밤`:"처음부터 어두워요 · 몹이 바로 나와요",qe=te.length>1?{label:`다른 곳 ▸ ${te[(re+1)%te.length].name}`,onClick:()=>{re=(re+1)%te.length}}:void 0;I.showAction(`${_e.name}${dM(_e.name)} 원정`,`${Math.round(_e.durationSec/60)}분 · ${Ae} · 보물 상자 ${_e.treasures}개
포탈로 돌아오면 모은 것을 가져와요`,"원정 출발"+ii,()=>n.sendStartExpedition(_e.id),qe)}}else I.showAction("마을로 돌아가기","지금까지 모은 것을 마을 창고에 넣어요","돌아가기"+ii,()=>n.sendReturnHome())},Uh=()=>{const x=ce.player,N=x.pos,te=(x.yaw*180/Math.PI+360)%360,_e=hM[Math.round(te/45)%8],Ae=ce.interaction.target,qe=Ae?`${o.get(Ae.id).name} (${Ae.x}, ${Ae.y}, ${Ae.z}) 면 ${["+X","-X","+Y","-Y","+Z","-Z"][Ae.face]}`:"없음",tt=ce.expedition?`원정 ${ce.expedition.name} 시드 ${ce.expedition.seed} 경과 ${Bl().toFixed(0)}s 하늘 ${gi.toFixed(2)}`:`마을 ${i.village.code} 시드 ${i.village.seed}`;return[`FPS ${Hi}  프레임 ${Vi.ema.toFixed(1)}ms  해상도 ×${Vi.pixelRatio.toFixed(2)}  렌더거리 ${ce.chunks.renderDistance}  화면 ${ks}×${Ds} 버퍼 ${d.domElement.width}×${d.domElement.height} 비율 ${c.aspect.toFixed(2)}`,`드로우 ${Il}  삼각형 ${(Ul/1e3).toFixed(1)}k`,`청크 보임 ${ce.chunks.stats.visibleChunks}  큐 ${ce.chunks.queued}  진행 ${ce.chunks.inflight}  워커 ${f.size}`,`메싱 최근 ${ce.chunks.stats.lastMs.toFixed(1)}ms  평균 ${ce.chunks.stats.avgMs.toFixed(1)}ms  최대 ${ce.chunks.stats.maxMs.toFixed(1)}ms  총 ${ce.chunks.stats.meshed}`,`위치 ${N.x.toFixed(2)} ${N.y.toFixed(2)} ${N.z.toFixed(2)}  yaw ${te.toFixed(0)}°  pitch ${(x.pitch*180/Math.PI).toFixed(0)}°  ${_e}`,`조준 ${qe}`,`바닥 ${x.onGround?"O":"X"}  물 ${x.inWater?"O":"X"}  웅크림 ${x.sneaking?"O":"X"}  달리기 ${x.sprinting?"O":"X"}`,`빛 여기 하늘 ${ce.light.skyAt(Math.floor(N.x),Math.floor(N.y+1),Math.floor(N.z))} 블록 ${ce.light.blockAt(Math.floor(N.x),Math.floor(N.y+1),Math.floor(N.z))}  조명 처음 ${ce.light.stats.initialMs.toFixed(0)}ms  최근 ${ce.light.stats.lastFlushMs.toFixed(1)}ms/${ce.light.stats.lastFlushCells}칸  지형 생성 ${ce.genMs.toFixed(0)}ms  청크 ${ce.world.chunkCount}`,`${t?"터치":"PC"}  ${navigator.hardwareConcurrency??"?"}코어  ${window.innerWidth}×${window.innerHeight}@${(window.devicePixelRatio||1).toFixed(1)}`,`서버 ${n.connected?`연결됨 왕복 ${n.rtt}ms`:"끊김"}  나 #${l}  같이 ${w.count}명  블록 대기 ${le.size}  ${tt}`,`가방 ${ve.filter(Boolean).length}/${ve.length}칸  손 ${I.selectedItem??"빈 손"}`].join(`
`)},Ol=x=>{Wt&&(requestAnimationFrame(Ol),Nh(x))},Nh=(x,N)=>{const te=Math.max(0,Math.min(.1,(x-Xt)/1e3));Xt=Math.max(Xt,x);const{player:_e,interaction:Ae,chunks:qe,light:tt}=ce;(Nl=(Nl+1)%15)===0&&Gi();const at=ie.frame(te);I.tickEffects(te),at.toggleDebug&&(q=!q),at.slotDelta!==0&&I.selectDelta(at.slotDelta),at.slotSelect>=0&&I.select(at.slotSelect),Ae.selectedBlock=St(),Ae.heldItem=I.selectedItem,_e.update(at,te),pe=Math.max(0,pe-te);const lt=Ou(Dn,I.selectedItem),nt=oe.count>0?oe.aim(_e.eye,_e.lookDir,lt?lt.range:zu+1):null;L=nt,Ae.suppressPrimary=nt!==null||lt!==null,Ae.suppressSecondary=nt!==null;const vn=at.guard&&G.shield!==null&&!v&&!Ye();vn!==Y&&(Y=vn,I.setGuarding(Y)),Ee&&(Y!==W||Y&&x-F>=Vu)&&(W=Y,F=x,n.sendGuard(Y));const si=at.secondaryTap&&nt!==null&&nt<kr;if(lt&&!Y){if(at.primary)B===null&&(B=x);else if(B!==null){const yt=x-B;B=null,nt!==null&&pe<=0?(pe=lt.cooldownMs/1e3,n.sendShoot(nt,I.selectedIndex,yt),M.swing()):yt>300&&I.toast("몹을 노린 채 놓아야 화살이 나가요",1200)}si&&B===null&&pe<=0&&(pe=lt.cooldownMs/1e3,n.sendShoot(nt,I.selectedIndex,0),M.swing()),se=B===null?0:Math.min(1,(x-B)/lt.drawMs)}else B=null,se=0,nt!==null&&(at.primary||si)&&pe<=0&&!Y&&(pe=Gu/1e3,n.sendHit(nt,I.selectedIndex),M.swing());if(M.setDraw(se),nt!==null&&at.secondaryTap&&nt>=kr&&(n.sendUseMob(nt,I.selectedIndex),M.swing()),nt!==X){X=nt;const yt=nt!==null?oe.figureOf(nt):void 0;if(yt&&nt!==null&&nt>=kr){const Ze=er.get(ui[yt.kind]??"cow"),wt=(yt.state&bn.baby)!==0,Rt=(yt.state&bn.tamed)!==0,oi=Ze.food.map(Xi=>we(Xi)).join("·"),Wi=Rt?D.get(nt)?.mine?"빈손 탭 → 앉기/일어나기 · 카드에서 이름 짓기":"남이 길들인 강아지예요":Ze.tameWith.length?`${Ze.tameWith.map(Xi=>we(Xi)).join("·")}을(를) 들고 탭 → 길들이기`:`${oi}을(를) 들고 탭 → 먹이기`,wr=Ze.id==="sheep"?" · ✂️ 가위 들고 탭 → 양털":Ze.id==="chicken"?" · 빈손 탭 → 🥚 달걀":"";I.toast(`${Ze.name}${wt?" (아기)":""}${Rt?" 🐾":""} · ${Wi}${wr}`,3e3)}}if(Ae.update(at,te),_e.applyToCamera(c,Dh),Mr+=te*1e3,Ee&&Mr>=lM&&(Mr=0,uo()),w.update(te,ce.light,gi),b.update(te),de.update(_e,te),xe.update(),Oe.update(te),oe.update(te),he&&P(),qe.markDirtyAll(tt.flush()),Ae.target){if(m.setTarget(Ae.target.x,Ae.target.y,Ae.target.z),m.setProgress(Ae.progress),Ae.progress>0&&(K+=te)>=.11){K=0;const yt=Ae.target;Me.crumb(yt.x,yt.y,yt.z,yt.face,Pe(yt.id))}}else m.clearTarget();Me.update(te),I.setProgress(se>0?se:Ae.progress);{const yt=ce.kind==="village"?A===1?{x:ce.portalPos.x+.5,z:ce.portalPos.z+.5,name:"포탈",near:3}:{x:64.5,z:64.5,name:"광장",near:24}:{x:ce.portalPos.x,z:ce.portalPos.z+.5,name:"포탈",near:12},Ze=yt.x-_e.pos.x,wt=yt.z-_e.pos.z,Rt=Math.hypot(Ze,wt);A===1&&ce.kind==="village"&&Rt<=7?y(2):A===2&&ce.kind==="expedition"&&y(3),Rt>yt.near?I.setCompassTarget((Math.atan2(Ze,-wt)*180/Math.PI+360)%360,`${yt.name} ${Math.round(Rt)}칸`):I.setCompassTarget(null,null)}if(I.setHeading(_e.yaw),Ee&&Ih(),ne.visible&&(We+=te*1e3)>=aM&&(We=0,ne.setStations(U())),ce.expedition){const yt=ce.expedition,Ze=Bl(),wt=Math.max(0,yt.durationSec-Ze),Rt=Hu(yt,Ze);I.setTimer(wt,Rt),Nn(Math.max(Wu,Xu(yt,Ze))),!_i&&wt<=180&&wt>60&&(_i=!0,I.toast("3분 남았어요! 포탈로 돌아가요",5e3)),!Oi&&wt<=60&&(Oi=!0,I.toast("1분! 지금 돌아가지 않으면 절반만 가져가요",6e3))}qe.update(_e.pos.x,_e.pos.y,_e.pos.z),h.setTime(x/1e3),p.update(c.position),ce.portal.update(x/1e3);{const yt=St();Y?M.setItem("shield",Se("shield",16)):yt>0?M.setBlock(yt):M.setItem(I.selectedItem,I.selectedItem?Se(I.selectedItem,16):null)}Ee&&I.selectedItem!==ot&&(ot=I.selectedItem,n.sendHeld(ot));const Sr=_e.onGround&&_e.horizontalSpeed>.4?Math.min(1,_e.horizontalSpeed/4.3):0;M.update(te,c,_e.walkCycle,Sr),d.clear(),d.render(u,c),Il=d.info.render.calls,Ul=d.info.render.triangles,M.render(d,c),Vi.frame(te),Lt++,Pt+=te,Pt>=.5&&(Hi=Math.round(Lt/Pt),Lt=0,Pt=0),Tn+=te,q&&Tn>=.25?(Tn=0,I.setDebug(Uh())):q||I.setDebug(null)};return Wt=!0,requestAnimationFrame(Ol),I.showOverlay(`${i.village.name}`,(t?`왼쪽 아래 스틱: 움직이기  ·  드래그: 둘러보기
짧게 탭: 놓기  ·  꾹: 부수기`:`WASD 이동  ·  마우스 둘러보기
좌클릭 꾹: 부수기  ·  우클릭: 놓기`)+`
마을 코드 ${i.village.code}`,t?"탭해서 시작":"클릭해서 시작"),{start(){if(Ee)return;Ee=!0;const x=w.count;I.toast(x>0?`마을에 들어왔어요. 지금 ${x}명이 함께 있어요`:"마을에 들어왔어요. 친구에게 마을 코드를 알려 주세요",4e3),t&&(V?De():Q||I.toast(ue,7e3),window.innerHeight>window.innerWidth&&(V||Q)&&I.toast("폰을 가로로 돌리면 더 편해요",3500)),i.gifts.forEach((N,te)=>setTimeout(()=>I.toast(`🎁 ${N.message}`,8e3),2500+te*1500)),uo(),Ge()},dispose(){Wt=!1,n.close(),ie.dispose(),an(ce),f.dispose(),p.dispose(),m.dispose(),M.dispose(),w.dispose(),h.dispose(),r.texture.dispose(),d.dispose(),window.removeEventListener("resize",T),window.removeEventListener("keydown",Fl),ne.el.remove(),ge.sheet.remove(),ge.log.remove(),z?.disconnect(),s.innerHTML=""}}}export{fM as createGame};
//# sourceMappingURL=Game-hZXJQwEa.js.map
