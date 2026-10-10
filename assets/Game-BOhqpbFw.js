import{A as kn,C as Bo,h as It,i as so,j as jh,k as ou,E as au,l as lu,N as cu,m as hu,S as du,n as uu,D as fu,o as pu,p as mu,q as gu,I as Au,r as Jh,R as Zh,s as hr,V as bt,t as $h,u as vu,v as Ca,F as ed,w as td,x as Xi,y as mn,z as _u,B as Js,H as fo,G as Ql,J as xu,K as nd,L as Ps,O as bu,Q as yu,T as id,U as sd,W as rd,X as Mu,Y as po,Z as Eu,_ as Su,$ as jl,a0 as od,a1 as Ys,a2 as wu,a3 as Tu,a4 as Cu,a5 as Zt,a6 as Un,a7 as Jl,a8 as Ru,a9 as Zl,aa as Du,ab as Lu,ac as ad,ad as Iu,ae as Pu,af as Us,ag as Uu,ah as $l,ai as ec,aj as Nu,ak as tc,al as Fu,am as Bu,an as ku,ao as Ou,ap as zu,aq as Vu,ar as Gu,as as Hu,at as Wu,au as Xu,av as nc,aw as Yu,ax as ic,ay as qu,az as Ku,aA as Qu,aB as ju,aC as Ju,aD as Zu,aE as $u,aF as ef,aG as tf,aH as sc,aI as rc,aJ as oc,aK as nf,aL as sf}from"./index-D6CabKYW.js";import{C as di,M as ro,D as Pn,B as ac,T as ld,P as rf,a as lc,R as of,b as af,X as ko,c as lf,d as cc,i as hc,E as Oo,I as dc,e as cf,f as _i,F as xr}from"./data-D1doTI0Z.js";import{armorVoxels as hf,shieldVoxels as df}from"./armorModel-Dq0ru_Rg.js";const uf=27,ff=uf*2,uc=100,pf=5,mf=1.5,gf=24,Zs=1500,Af=Zs,vf={color:"#bdbdbd",power:1,stamina:25,cooldownSec:Zs/1e3};function _f(s){const e=s.skills.find(n=>n.type==="beam");if(!e)return vf;const t=(n,i,r,o)=>typeof n=="number"&&Number.isFinite(n)?Math.min(o,Math.max(r,n)):i;return{color:typeof e.color=="string"&&/^#[0-9a-fA-F]{6}$/.test(e.color)?e.color:s.color,power:Math.round(t(e.powerLevel,1,1,5)),stamina:t(e.stamina,25,0,1e3),cooldownSec:Af/1e3}}function br(s){return s==="adult"?Math.round(uc*mf):uc}function xf(s,e,t){const n=Math.max(0,t-s.at)/1e3;return Math.min(e,s.value+n*pf)}const En={sheared:8,baby:16,tamed:32,sitting:64,love:128},qs=4e4,bf=1.25,yf=1;function fc(s,e,t){let n=0;const i=s[n++];if(i!==yf)throw new Error(`모르는 청크 저장 형식: ${i}`);const r=s[n]|s[n+1]<<8;n+=2;const o=[],a=[];for(let l=0;l<r;l++){const d=s[n++];let f="";for(let g=0;g<d;g++)f+=String.fromCharCode(s[n++]);const A=e.find(f);A?o.push(A.num):(o.push(kn),a.push(f))}const c=s[n]|s[n+1]<<8;n+=2;const h=new Uint16Array(Bo);let u=0;for(let l=0;l<c;l++){const d=s[n]|s[n+1]<<8,f=s[n+2]|s[n+3]<<8;if(n+=4,f>=o.length)throw new Error(`팔레트 번호가 범위를 벗어났어요: ${f}`);const A=o[f];if(u+d>Bo)throw new Error("청크 데이터가 4096 을 넘어요");h.fill(A,u,u+d),u+=d}if(u!==Bo)throw new Error(`청크 데이터가 ${u}개 — 4096 이어야 해요`);return t.loadBlockIds(h),{unknownIds:a}}const Mf=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];function Ef(s,e,t,n,i,r,o,a,c){const h=Math.hypot(r,o,a);if(h===0)return null;r/=h,o/=h,a/=h;let u=Math.floor(t),l=Math.floor(n),d=Math.floor(i);const f=r>0?1:r<0?-1:0,A=o>0?1:o<0?-1:0,g=a>0?1:a<0?-1:0,p=f?Math.abs(1/r):1/0,m=A?Math.abs(1/o):1/0,M=g?Math.abs(1/a):1/0;let S=f>0?(u+1-t)/r:f<0?(t-u)/-r:1/0,y=A>0?(l+1-n)/o:A<0?(n-l)/-o:1/0,D=g>0?(d+1-i)/a:g<0?(i-d)/-a:1/0,v=-1,E=0;for(let R=0;R<256;R++){if(v>=0){const x=s(u,l,d);if(e(x)){const b=Mf[v];return{x:u,y:l,z:d,face:v,nx:b[0],ny:b[1],nz:b[2],distance:E,id:x}}}if(S<y&&S<D){if(E=S,E>c)return null;u+=f,S+=p,v=f>0?1:0}else if(y<D){if(E=y,E>c)return null;l+=A,y+=m,v=A>0?3:2}else{if(E=D,E>c)return null;d+=g,D+=M,v=g>0?5:4}}return null}const ut=1e-4;function Ns(s,e,t,n,i){const r=e.w/2;return t+1>s.x-r+ut&&t<s.x+r-ut&&n+1>s.y+ut&&n<s.y+e.h-ut&&i+1>s.z-r+ut&&i<s.z+r-ut}function zo(s,e,t,n,i,r,o,a,c){const h=u=>{for(let l=r;l<=o;l++)for(let d=a;d<=c;d++)if(e===0?s(u,l,d):e===1?s(l,u,d):s(l,d,u))return!0;return!1};if(i>0){const u=Math.floor(n-ut)+1,l=Math.floor(n+i-ut);for(let d=u;d<=l;d++)if(h(d))return d}else{const u=Math.floor(t+ut)-1,l=Math.floor(t+i+ut);for(let d=u;d>=l;d--)if(h(d))return d}return null}function oo(s,e,t,n,i,r){r.onGround=!1,r.hitX=r.hitY=r.hitZ=r.hitCeiling=!1;const o=t.w/2;let a=n.y*i;if(a!==0){const c=Math.floor(e.x-o+ut),h=Math.floor(e.x+o-ut),u=Math.floor(e.z-o+ut),l=Math.floor(e.z+o-ut),d=zo(s,1,e.y,e.y+t.h,a,c,h,u,l);d===null?e.y+=a:a>0?(e.y=d-t.h-ut,n.y=0,r.hitY=r.hitCeiling=!0):(e.y=d+1,n.y=0,r.hitY=r.onGround=!0)}if(a=n.x*i,a!==0){const c=Math.floor(e.y+ut),h=Math.floor(e.y+t.h-ut),u=Math.floor(e.z-o+ut),l=Math.floor(e.z+o-ut),d=zo(s,0,e.x-o,e.x+o,a,c,h,u,l);d===null?e.x+=a:(e.x=a>0?d-o-ut:d+1+o+ut,n.x=0,r.hitX=!0)}if(a=n.z*i,a!==0){const c=Math.floor(e.y+ut),h=Math.floor(e.y+t.h-ut),u=Math.floor(e.x-o+ut),l=Math.floor(e.x+o-ut),d=zo(s,2,e.z-o,e.z+o,a,u,l,c,h);d===null?e.z+=a:(e.z=a>0?d-o-ut:d+1+o+ut,n.z=0,r.hitZ=!0)}}const yr={onGround:!1,hitX:!1,hitY:!1,hitZ:!1,hitCeiling:!1};function Sf(s,e,t,n,i,r,o,a=1){if(o<=0||i===0&&r===0)return null;const c={x:e.x,y:e.y,z:e.z},h={x:0,y:a/o,z:0};if(oo(s,c,n,h,o,yr),c.y-e.y<a-.05)return null;h.x=i,h.y=0,h.z=r,oo(s,c,n,h,o,yr);const u=(c.x-e.x)**2+(c.z-e.z)**2,l=(t.x-e.x)**2+(t.z-e.z)**2;if(u<=l+1e-9)return null;const d=h.x,f=h.z;if(h.x=0,h.y=-(a+.05)/o,h.z=0,oo(s,c,n,h,o,yr),!yr.onGround||c.y<=e.y+1e-4)return null;const A=c.y-e.y;return t.x=c.x,t.y=c.y,t.z=c.z,{dy:A,vx:d,vz:f}}function Vo(s,e,t,n=.05){const i=t.w/2,r=Math.floor(e.y-n),o=Math.floor(e.x-i+ut),a=Math.floor(e.x+i-ut),c=Math.floor(e.z-i+ut),h=Math.floor(e.z+i-ut);for(let u=c;u<=h;u++)for(let l=o;l<=a;l++)if(s(l,r,u))return!0;return!1}const un=15,ms=240;function cd(s){return s>>4}function hd(s){return s&15}const bn=0,Yi=1,Mr=3,Fs=()=>performance.now();class wf{constructor(e,t){this.world=e,this.sx=e.sizeX,this.sy=e.sizeY,this.sz=e.sizeZ,this.strideY=this.sx*this.sz;const n=this.sx*this.sy*this.sz;this.light=new Uint8Array(n),this.cells=new Uint8Array(n),this.table=new Uint8Array(t.count);for(const i of t.defs)this.table[i.num]=Math.min(un,i.lightEmit)<<4|Math.min(un,i.lightFilter)}world;light;cells;table;sx;sy;sz;strideY;pending=new Set;changedChunks=new Map;tracking=!1;changedCells=0;buckets=Array.from({length:un+1},()=>[]);stats={initialMs:0,lastFlushMs:0,lastFlushCells:0};index(e,t,n){return t*this.strideY+n*this.sx+e}get(e,t,n){return this.world.inBounds(e,t,n)?this.light[this.index(e,t,n)]:ms}skyAt(e,t,n){return cd(this.get(e,t,n))}blockAt(e,t,n){return hd(this.get(e,t,n))}computeAll(e=!1){const t=Fs();this.light.fill(0),this.fillCells(),this.tracking=!1,this.pending.clear();const{sx:n,sy:i,sz:r,cells:o,light:a,buckets:c,strideY:h}=this;if(e){const u=(i-1)*h;for(let l=0;l<r;l++)for(let d=0;d<n;d++){const f=u+l*n+d,A=this.fromSkyAbove(o[f]&15);A>0&&(a[f]=A<<4,c[A].push(f))}}else{const u=new Int32Array(n*r);for(let l=0;l<r;l++)for(let d=0;d<n;d++){let f=i-1,A=f*h+l*n+d;for(;f>=0&&(o[A]&15)===0;)a[A]=un<<4,f--,A-=h;u[l*n+d]=f}for(let l=0;l<r;l++)for(let d=0;d<n;d++){const f=u[l*n+d],A=l*n+d;if(f===i-1){const p=this.fromSkyAbove(o[f*h+A]&15);p>0&&(a[f*h+A]=a[f*h+A]&15|p<<4,c[p].push(f*h+A));continue}c[un].push((f+1)*h+A);const g=p=>{for(let m=f+2;m<=p;m++)c[un].push(m*h+A)};d>0&&g(u[A-1]),d<n-1&&g(u[A+1]),l>0&&g(u[A-n]),l<r-1&&g(u[A+n])}}this.propagate(bn);for(let u=0;u<o.length;u++){const l=o[u]>>4;l!==0&&(a[u]=a[u]&240|l,c[l].push(u))}this.propagate(Yi),this.stats.initialMs=Fs()-t}fromSkyAbove(e){return e===0?un:un-Math.max(1,e)}fillCells(){const{cells:e,table:t}=this;e.fill(0),this.world.forEachChunk(n=>{const i=n.cx<<4,r=n.cy<<4,o=n.cz<<4,{data:a,palette:c}=n;let h=0;for(let u=0;u<It;u++)for(let l=0;l<It;l++){let d=this.index(i,r+u,o+l);for(let f=0;f<It;f++,d++,h++)e[d]=t[c[a[h]]]}})}markChanged(e,t,n){this.world.inBounds(e,t,n)&&this.pending.add(this.index(e,t,n))}get pendingCount(){return this.pending.size}flush(){if(this.pending.size===0)return[];const e=Fs(),{cells:t,table:n,light:i,buckets:r}=this,o=[],a=[];for(const A of this.pending){const g=A%this.sx,p=(A-g)/this.sx,m=p%this.sz,M=(p-m)/this.sz,S=n[this.world.getBlock(g,M,m)]??0;S!==t[A]&&(o.push(A),a.push(S))}if(this.pending.clear(),o.length===0)return this.stats.lastFlushMs=Fs()-e,this.stats.lastFlushCells=0,[];this.tracking=!0,this.changedChunks.clear(),this.changedCells=0;const c=[],h=[];for(let A=0;A<o.length;A++){const g=o[A],p=t[g],m=a[A],M=(m&15)>(p&15);M&&c.push(g),(M||m>>4<p>>4)&&h.push(g)}const u=this.remove(bn,c),l=this.remove(Yi,h);for(let A=0;A<o.length;A++)t[o[A]]=a[A];const d=(A,g)=>{const p=A===bn?i[g]>>4:i[g]&15;p>0&&r[p].push(g)},f=(A,g,p,m,M)=>{d(A,g),p>0&&d(A,g-1),p<this.sx-1&&d(A,g+1),M>0&&d(A,g-this.sx),M<this.sz-1&&d(A,g+this.sx),m>0&&d(A,g-this.strideY),m<this.sy-1&&d(A,g+this.strideY)};for(const A of u)d(bn,A);for(let A=0;A<o.length;A++){const g=o[A],p=g%this.sx,m=(g-p)/this.sx,M=m%this.sz,S=(m-M)/this.sz;if(S===this.sy-1){const y=this.fromSkyAbove(a[A]&15);y>i[g]>>4&&(i[g]=i[g]&15|y<<4,this.mark(p,S,M))}f(bn,g,p,S,M)}this.propagate(bn);for(const A of l)d(Yi,A);for(let A=0;A<o.length;A++){const g=o[A],p=g%this.sx,m=(g-p)/this.sx,M=m%this.sz,S=(m-M)/this.sz,y=a[A]>>4;y>(i[g]&15)&&(i[g]=i[g]&240|y,this.mark(p,S,M)),f(Yi,g,p,S,M)}return this.propagate(Yi),this.tracking=!1,this.stats.lastFlushMs=Fs()-e,this.stats.lastFlushCells=this.changedCells,[...this.changedChunks.values()]}remove(e,t){const n=[];if(t.length===0)return n;const{light:i,cells:r,sx:o,sy:a,sz:c,strideY:h}=this,u=[],l=g=>e===bn?i[g]>>4:i[g]&15,d=g=>{i[g]=e===bn?i[g]&15:i[g]&240},f=[];for(const g of t){const p=l(g);if(p===0)continue;d(g),u.push(g,p);const m=g%o,M=(g-m)/o,S=M%c;this.mark(m,(M-S)/c,S)}const A=(g,p,m,M,S,y)=>{const D=l(g);D!==0&&(D<p||e===bn&&m===Mr&&p===un&&D===un?(d(g),this.mark(M,S,y),u.push(g,D),e===Yi&&r[g]>>4>0&&f.push(g)):n.push(g))};for(;u.length;){const g=u.pop(),p=u.pop(),m=p%o,M=(p-m)/o,S=M%c,y=(M-S)/c;m>0&&A(p-1,g,0,m-1,y,S),m<o-1&&A(p+1,g,1,m+1,y,S),y<a-1&&A(p+h,g,2,m,y+1,S),y>0&&A(p-h,g,Mr,m,y-1,S),S>0&&A(p-o,g,4,m,y,S-1),S<c-1&&A(p+o,g,5,m,y,S+1)}for(const g of f){const p=r[g]>>4;p>(i[g]&15)&&(i[g]=i[g]&240|p),n.push(g)}return n}propagate(e){const{light:t,cells:n,sx:i,sy:r,sz:o,strideY:a,buckets:c}=this,h=u=>e===bn?t[u]>>4:t[u]&15;for(let u=un;u>=1;u--){const l=c[u];for(;l.length;){const d=l.pop();if(h(d)!==u)continue;const f=d%i,A=(d-f)/i,g=A%o,p=(A-g)/o,m=(M,S,y,D,v)=>{const E=n[M]&15;let R;e===bn&&S===Mr&&u===un&&E===0?R=un:R=u-(E>1?E:1),!(R<=0||R<=h(M))&&(t[M]=e===bn?t[M]&15|R<<4:t[M]&240|R,this.tracking&&this.mark(y,D,v),c[R].push(M))};f>0&&m(d-1,0,f-1,p,g),f<i-1&&m(d+1,1,f+1,p,g),p<r-1&&m(d+a,2,f,p+1,g),p>0&&m(d-a,Mr,f,p-1,g),g>0&&m(d-i,4,f,p,g-1),g<o-1&&m(d+i,5,f,p,g+1)}}}mark(e,t,n){if(!this.tracking)return;this.changedCells++;const i=e>>4,r=t>>4,o=n>>4,a=e&15,c=t&15,h=n&15,u=a===0?-1:0,l=a===15?1:0,d=c===0?-1:0,f=c===15?1:0,A=h===0?-1:0,g=h===15?1:0;for(let p=u;p<=l;p++)for(let m=d;m<=f;m++)for(let M=A;M<=g;M++){const S=i+p,y=r+m,D=o+M;if(!this.world.chunkInBounds(S,y,D))continue;const v=so(S,y,D);this.changedChunks.has(v)||this.changedChunks.set(v,{cx:S,cy:y,cz:D})}}buildPaddedLight(e,t,n,i){const r=i??new Uint8Array(jh),{sx:o,sy:a,sz:c,light:h}=this,u=e<<4,l=t<<4,d=n<<4;let f=0;for(let A=-1;A<=It;A++){const g=l+A,p=g>=0&&g<a;for(let m=-1;m<=It;m++){const M=d+m,S=p&&M>=0&&M<c,y=g*this.strideY+M*o;for(let D=-1;D<=It;D++,f++){const v=u+D;r[f]=S&&v>=0&&v<o?h[y+v]:ms}}}return r}}const dd={island:(s,e,t)=>{const n=gu(s,e,t);return{world:n.world,spawn:n.spawn,portal:n.layout.portal,treasures:n.layout.treasures,den:null,genVersion:Au,ms:n.ms}},cave:(s,e,t)=>{const n=pu(s,e,t);return{world:n.world,spawn:n.spawn,portal:n.layout.portal,treasures:n.layout.treasures,den:n.layout.den,genVersion:mu,ms:n.ms}},desert:(s,e,t)=>{const n=uu(s,e,t);return{world:n.world,spawn:n.spawn,portal:n.layout.portal,treasures:n.layout.treasures,den:null,genVersion:fu,ms:n.ms}},snow:(s,e,t)=>{const n=hu(s,e,t);return{world:n.world,spawn:n.spawn,portal:n.layout.portal,treasures:n.layout.treasures,den:null,genVersion:du,ms:n.ms}},nether:(s,e,t)=>{const n=lu(s,e,t);return{world:n.world,spawn:n.spawn,portal:n.layout.portal,treasures:n.layout.treasures,den:null,genVersion:cu,ms:n.ms}},end:(s,e,t)=>{const n=ou(s,e,t);return{world:n.world,spawn:n.spawn,portal:n.layout.portal,treasures:n.layout.treasures,den:n.layout.den,genVersion:au,ms:n.ms}}};function Tf(s){return Object.hasOwn(dd,s)}function Cf(s,e,t){const n=dd[s.generator];if(!n)throw new Error(`원정지 생성기 '${s.generator}' 는 아직 없어요`);return n(e,t,s.treasures)}const xl="180",Rf=0,pc=1,Df=2,ud=1,Lf=2,Jn=3,ni=0,tn=1,ln=2,fi=0,gs=1,vs=2,mc=3,gc=4,If=5,Ii=100,Pf=101,Uf=102,Nf=103,Ff=104,Bf=200,kf=201,Of=202,zf=203,Ra=204,Da=205,Vf=206,Gf=207,Hf=208,Wf=209,Xf=210,Yf=211,qf=212,Kf=213,Qf=214,La=0,Ia=1,Pa=2,_s=3,Ua=4,Na=5,Fa=6,Ba=7,fd=0,jf=1,Jf=2,pi=0,Zf=1,$f=2,ep=3,tp=4,np=5,ip=6,sp=7,pd=300,xs=301,bs=302,ka=303,Oa=304,Mo=306,nr=1e3,Ui=1001,za=1002,nn=1003,rp=1004,Ks=1005,An=1006,Go=1007,Ni=1008,Vn=1009,md=1010,gd=1011,ir=1012,bl=1013,Bi=1014,$n=1015,dr=1016,yl=1017,Ml=1018,sr=1020,Ad=35902,vd=35899,_d=1021,xd=1022,Cn=1023,rr=1026,or=1027,bd=1028,El=1029,yd=1030,Sl=1031,wl=1033,ao=33776,lo=33777,co=33778,ho=33779,Va=35840,Ga=35841,Ha=35842,Wa=35843,Xa=36196,Ya=37492,qa=37496,Ka=37808,Qa=37809,ja=37810,Ja=37811,Za=37812,$a=37813,el=37814,tl=37815,nl=37816,il=37817,sl=37818,rl=37819,ol=37820,al=37821,ll=36492,cl=36494,hl=36495,dl=36283,ul=36284,fl=36285,pl=36286,op=3200,ap=3201,lp=0,cp=1,Zn="",gn="srgb",ys="srgb-linear",mo="linear",xt="srgb",qi=7680,Ac=519,hp=512,dp=513,up=514,Md=515,fp=516,pp=517,mp=518,gp=519,ml=35044,go="300 es",zn=2e3,Ao=2001;class Ss{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,e);e.target=null}}}const Kt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let vc=1234567;const $s=Math.PI/180,ar=180/Math.PI;function ei(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Kt[s&255]+Kt[s>>8&255]+Kt[s>>16&255]+Kt[s>>24&255]+"-"+Kt[e&255]+Kt[e>>8&255]+"-"+Kt[e>>16&15|64]+Kt[e>>24&255]+"-"+Kt[t&63|128]+Kt[t>>8&255]+"-"+Kt[t>>16&255]+Kt[t>>24&255]+Kt[n&255]+Kt[n>>8&255]+Kt[n>>16&255]+Kt[n>>24&255]).toLowerCase()}function nt(s,e,t){return Math.max(e,Math.min(t,s))}function Tl(s,e){return(s%e+e)%e}function Ap(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function vp(s,e,t){return s!==e?(t-s)/(e-s):0}function er(s,e,t){return(1-t)*s+t*e}function _p(s,e,t,n){return er(s,e,1-Math.exp(-t*n))}function xp(s,e=1){return e-Math.abs(Tl(s,e*2)-e)}function bp(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function yp(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function Mp(s,e){return s+Math.floor(Math.random()*(e-s+1))}function Ep(s,e){return s+Math.random()*(e-s)}function Sp(s){return s*(.5-Math.random())}function wp(s){s!==void 0&&(vc=s);let e=vc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Tp(s){return s*$s}function Cp(s){return s*ar}function Rp(s){return(s&s-1)===0&&s!==0}function Dp(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Lp(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Ip(s,e,t,n,i){const r=Math.cos,o=Math.sin,a=r(t/2),c=o(t/2),h=r((e+n)/2),u=o((e+n)/2),l=r((e-n)/2),d=o((e-n)/2),f=r((n-e)/2),A=o((n-e)/2);switch(i){case"XYX":s.set(a*u,c*l,c*d,a*h);break;case"YZY":s.set(c*d,a*u,c*l,a*h);break;case"ZXZ":s.set(c*l,c*d,a*u,a*h);break;case"XZX":s.set(a*u,c*A,c*f,a*h);break;case"YXY":s.set(c*f,a*u,c*A,a*h);break;case"ZYZ":s.set(c*A,c*f,a*u,a*h);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Fn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function At(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Pp={DEG2RAD:$s,RAD2DEG:ar,generateUUID:ei,clamp:nt,euclideanModulo:Tl,mapLinear:Ap,inverseLerp:vp,lerp:er,damp:_p,pingpong:xp,smoothstep:bp,smootherstep:yp,randInt:Mp,randFloat:Ep,randFloatSpread:Sp,seededRandom:wp,degToRad:Tp,radToDeg:Cp,isPowerOfTwo:Rp,ceilPowerOfTwo:Dp,floorPowerOfTwo:Lp,setQuaternionFromProperEuler:Ip,normalize:At,denormalize:Fn};class tt{constructor(e=0,t=0){tt.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(nt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*i+e.x,this.y=r*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ur{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,o,a){let c=n[i+0],h=n[i+1],u=n[i+2],l=n[i+3];const d=r[o+0],f=r[o+1],A=r[o+2],g=r[o+3];if(a===0){e[t+0]=c,e[t+1]=h,e[t+2]=u,e[t+3]=l;return}if(a===1){e[t+0]=d,e[t+1]=f,e[t+2]=A,e[t+3]=g;return}if(l!==g||c!==d||h!==f||u!==A){let p=1-a;const m=c*d+h*f+u*A+l*g,M=m>=0?1:-1,S=1-m*m;if(S>Number.EPSILON){const D=Math.sqrt(S),v=Math.atan2(D,m*M);p=Math.sin(p*v)/D,a=Math.sin(a*v)/D}const y=a*M;if(c=c*p+d*y,h=h*p+f*y,u=u*p+A*y,l=l*p+g*y,p===1-a){const D=1/Math.sqrt(c*c+h*h+u*u+l*l);c*=D,h*=D,u*=D,l*=D}}e[t]=c,e[t+1]=h,e[t+2]=u,e[t+3]=l}static multiplyQuaternionsFlat(e,t,n,i,r,o){const a=n[i],c=n[i+1],h=n[i+2],u=n[i+3],l=r[o],d=r[o+1],f=r[o+2],A=r[o+3];return e[t]=a*A+u*l+c*f-h*d,e[t+1]=c*A+u*d+h*l-a*f,e[t+2]=h*A+u*f+a*d-c*l,e[t+3]=u*A-a*l-c*d-h*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,h=a(n/2),u=a(i/2),l=a(r/2),d=c(n/2),f=c(i/2),A=c(r/2);switch(o){case"XYZ":this._x=d*u*l+h*f*A,this._y=h*f*l-d*u*A,this._z=h*u*A+d*f*l,this._w=h*u*l-d*f*A;break;case"YXZ":this._x=d*u*l+h*f*A,this._y=h*f*l-d*u*A,this._z=h*u*A-d*f*l,this._w=h*u*l+d*f*A;break;case"ZXY":this._x=d*u*l-h*f*A,this._y=h*f*l+d*u*A,this._z=h*u*A+d*f*l,this._w=h*u*l-d*f*A;break;case"ZYX":this._x=d*u*l-h*f*A,this._y=h*f*l+d*u*A,this._z=h*u*A-d*f*l,this._w=h*u*l+d*f*A;break;case"YZX":this._x=d*u*l+h*f*A,this._y=h*f*l+d*u*A,this._z=h*u*A-d*f*l,this._w=h*u*l-d*f*A;break;case"XZY":this._x=d*u*l-h*f*A,this._y=h*f*l-d*u*A,this._z=h*u*A+d*f*l,this._w=h*u*l+d*f*A;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],o=t[1],a=t[5],c=t[9],h=t[2],u=t[6],l=t[10],d=n+a+l;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-c)*f,this._y=(r-h)*f,this._z=(o-i)*f}else if(n>a&&n>l){const f=2*Math.sqrt(1+n-a-l);this._w=(u-c)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+h)/f}else if(a>l){const f=2*Math.sqrt(1+a-n-l);this._w=(r-h)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(c+u)/f}else{const f=2*Math.sqrt(1+l-n-a);this._w=(o-i)/f,this._x=(r+h)/f,this._y=(c+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(nt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,o=e._w,a=t._x,c=t._y,h=t._z,u=t._w;return this._x=n*u+o*a+i*h-r*c,this._y=i*u+o*c+r*a-n*h,this._z=r*u+o*h+n*c-i*a,this._w=o*u-n*a-i*c-r*h,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,r=this._z,o=this._w;let a=o*e._w+n*e._x+i*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const f=1-t;return this._w=f*o+t*this._w,this._x=f*n+t*this._x,this._y=f*i+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}const h=Math.sqrt(c),u=Math.atan2(h,a),l=Math.sin((1-t)*u)/h,d=Math.sin(t*u)/h;return this._w=o*l+this._w*d,this._x=n*l+this._x*d,this._y=i*l+this._y*d,this._z=r*l+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class H{constructor(e=0,t=0,n=0){H.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(_c.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(_c.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,o=e.y,a=e.z,c=e.w,h=2*(o*i-a*n),u=2*(a*t-r*i),l=2*(r*n-o*t);return this.x=t+c*h+o*l-a*u,this.y=n+c*u+a*h-r*l,this.z=i+c*l+r*u-o*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this.z=nt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this.z=nt(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=i*c-r*a,this.y=r*o-n*c,this.z=n*a-i*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ho.copy(this).projectOnVector(e),this.sub(Ho)}reflect(e){return this.sub(Ho.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(nt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ho=new H,_c=new ur;class Je{constructor(e,t,n,i,r,o,a,c,h){Je.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,c,h)}set(e,t,n,i,r,o,a,c,h){const u=this.elements;return u[0]=e,u[1]=i,u[2]=a,u[3]=t,u[4]=r,u[5]=c,u[6]=n,u[7]=o,u[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[3],c=n[6],h=n[1],u=n[4],l=n[7],d=n[2],f=n[5],A=n[8],g=i[0],p=i[3],m=i[6],M=i[1],S=i[4],y=i[7],D=i[2],v=i[5],E=i[8];return r[0]=o*g+a*M+c*D,r[3]=o*p+a*S+c*v,r[6]=o*m+a*y+c*E,r[1]=h*g+u*M+l*D,r[4]=h*p+u*S+l*v,r[7]=h*m+u*y+l*E,r[2]=d*g+f*M+A*D,r[5]=d*p+f*S+A*v,r[8]=d*m+f*y+A*E,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],c=e[6],h=e[7],u=e[8];return t*o*u-t*a*h-n*r*u+n*a*c+i*r*h-i*o*c}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],c=e[6],h=e[7],u=e[8],l=u*o-a*h,d=a*c-u*r,f=h*r-o*c,A=t*l+n*d+i*f;if(A===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/A;return e[0]=l*g,e[1]=(i*h-u*n)*g,e[2]=(a*n-i*o)*g,e[3]=d*g,e[4]=(u*t-i*c)*g,e[5]=(i*r-a*t)*g,e[6]=f*g,e[7]=(n*c-h*t)*g,e[8]=(o*t-n*r)*g,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,o,a){const c=Math.cos(r),h=Math.sin(r);return this.set(n*c,n*h,-n*(c*o+h*a)+o+e,-i*h,i*c,-i*(-h*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Wo.makeScale(e,t)),this}rotate(e){return this.premultiply(Wo.makeRotation(-e)),this}translate(e,t){return this.premultiply(Wo.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Wo=new Je;function Ed(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function vo(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Up(){const s=vo("canvas");return s.style.display="block",s}const xc={};function lr(s){s in xc||(xc[s]=!0,console.warn(s))}function Np(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const bc=new Je().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),yc=new Je().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Fp(){const s={enabled:!0,workingColorSpace:ys,spaces:{},convert:function(i,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===xt&&(i.r=ti(i.r),i.g=ti(i.g),i.b=ti(i.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===xt&&(i.r=As(i.r),i.g=As(i.g),i.b=As(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Zn?mo:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,o){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return lr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return lr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[ys]:{primaries:e,whitePoint:n,transfer:mo,toXYZ:bc,fromXYZ:yc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:gn},outputColorSpaceConfig:{drawingBufferColorSpace:gn}},[gn]:{primaries:e,whitePoint:n,transfer:xt,toXYZ:bc,fromXYZ:yc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:gn}}}),s}const dt=Fp();function ti(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function As(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Ki;class Bp{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ki===void 0&&(Ki=vo("canvas")),Ki.width=e.width,Ki.height=e.height;const i=Ki.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Ki}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=vo("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=ti(r[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ti(t[n]/255)*255):t[n]=ti(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let kp=0;class Cl{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:kp++}),this.uuid=ei(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(Xo(i[o].image)):r.push(Xo(i[o]))}else r=Xo(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function Xo(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Bp.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Op=0;const Yo=new H;class sn extends Ss{constructor(e=sn.DEFAULT_IMAGE,t=sn.DEFAULT_MAPPING,n=Ui,i=Ui,r=An,o=Ni,a=Cn,c=Vn,h=sn.DEFAULT_ANISOTROPY,u=Zn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Op++}),this.uuid=ei(),this.name="",this.source=new Cl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=h,this.format=a,this.internalFormat=null,this.type=c,this.offset=new tt(0,0),this.repeat=new tt(1,1),this.center=new tt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Je,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Yo).x}get height(){return this.source.getSize(Yo).y}get depth(){return this.source.getSize(Yo).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==pd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case nr:e.x=e.x-Math.floor(e.x);break;case Ui:e.x=e.x<0?0:1;break;case za:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case nr:e.y=e.y-Math.floor(e.y);break;case Ui:e.y=e.y<0?0:1;break;case za:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}sn.DEFAULT_IMAGE=null;sn.DEFAULT_MAPPING=pd;sn.DEFAULT_ANISOTROPY=1;class Ut{constructor(e=0,t=0,n=0,i=1){Ut.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const c=e.elements,h=c[0],u=c[4],l=c[8],d=c[1],f=c[5],A=c[9],g=c[2],p=c[6],m=c[10];if(Math.abs(u-d)<.01&&Math.abs(l-g)<.01&&Math.abs(A-p)<.01){if(Math.abs(u+d)<.1&&Math.abs(l+g)<.1&&Math.abs(A+p)<.1&&Math.abs(h+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const S=(h+1)/2,y=(f+1)/2,D=(m+1)/2,v=(u+d)/4,E=(l+g)/4,R=(A+p)/4;return S>y&&S>D?S<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(S),i=v/n,r=E/n):y>D?y<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(y),n=v/i,r=R/i):D<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(D),n=E/r,i=R/r),this.set(n,i,r,t),this}let M=Math.sqrt((p-A)*(p-A)+(l-g)*(l-g)+(d-u)*(d-u));return Math.abs(M)<.001&&(M=1),this.x=(p-A)/M,this.y=(l-g)/M,this.z=(d-u)/M,this.w=Math.acos((h+f+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this.z=nt(this.z,e.z,t.z),this.w=nt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this.z=nt(this.z,e,t),this.w=nt(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class zp extends Ss{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:An,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Ut(0,0,e,t),this.scissorTest=!1,this.viewport=new Ut(0,0,e,t);const i={width:e,height:t,depth:n.depth},r=new sn(i);this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:An,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isArrayTexture=this.textures[i].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new Cl(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ki extends zp{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Rl extends sn{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=nn,this.minFilter=nn,this.wrapR=Ui,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Vp extends sn{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=nn,this.minFilter=nn,this.wrapR=Ui,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class fr{constructor(e=new H(1/0,1/0,1/0),t=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Dn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Dn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Dn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Dn):Dn.fromBufferAttribute(r,o),Dn.applyMatrix4(e.matrixWorld),this.expandByPoint(Dn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Er.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Er.copy(n.boundingBox)),Er.applyMatrix4(e.matrixWorld),this.union(Er)}const i=e.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Dn),Dn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Bs),Sr.subVectors(this.max,Bs),Qi.subVectors(e.a,Bs),ji.subVectors(e.b,Bs),Ji.subVectors(e.c,Bs),ri.subVectors(ji,Qi),oi.subVectors(Ji,ji),xi.subVectors(Qi,Ji);let t=[0,-ri.z,ri.y,0,-oi.z,oi.y,0,-xi.z,xi.y,ri.z,0,-ri.x,oi.z,0,-oi.x,xi.z,0,-xi.x,-ri.y,ri.x,0,-oi.y,oi.x,0,-xi.y,xi.x,0];return!qo(t,Qi,ji,Ji,Sr)||(t=[1,0,0,0,1,0,0,0,1],!qo(t,Qi,ji,Ji,Sr))?!1:(wr.crossVectors(ri,oi),t=[wr.x,wr.y,wr.z],qo(t,Qi,ji,Ji,Sr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Dn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Dn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Yn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Yn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Yn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Yn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Yn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Yn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Yn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Yn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Yn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Yn=[new H,new H,new H,new H,new H,new H,new H,new H],Dn=new H,Er=new fr,Qi=new H,ji=new H,Ji=new H,ri=new H,oi=new H,xi=new H,Bs=new H,Sr=new H,wr=new H,bi=new H;function qo(s,e,t,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){bi.fromArray(s,r);const a=i.x*Math.abs(bi.x)+i.y*Math.abs(bi.y)+i.z*Math.abs(bi.z),c=e.dot(bi),h=t.dot(bi),u=n.dot(bi);if(Math.max(-Math.max(c,h,u),Math.min(c,h,u))>a)return!1}return!0}const Gp=new fr,ks=new H,Ko=new H;class Eo{constructor(e=new H,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Gp.setFromPoints(e).getCenter(n);let i=0;for(let r=0,o=e.length;r<o;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ks.subVectors(e,this.center);const t=ks.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(ks,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ko.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ks.copy(e.center).add(Ko)),this.expandByPoint(ks.copy(e.center).sub(Ko))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const qn=new H,Qo=new H,Tr=new H,ai=new H,jo=new H,Cr=new H,Jo=new H;class Hp{constructor(e=new H,t=new H(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,qn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=qn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(qn.copy(this.origin).addScaledVector(this.direction,t),qn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Qo.copy(e).add(t).multiplyScalar(.5),Tr.copy(t).sub(e).normalize(),ai.copy(this.origin).sub(Qo);const r=e.distanceTo(t)*.5,o=-this.direction.dot(Tr),a=ai.dot(this.direction),c=-ai.dot(Tr),h=ai.lengthSq(),u=Math.abs(1-o*o);let l,d,f,A;if(u>0)if(l=o*c-a,d=o*a-c,A=r*u,l>=0)if(d>=-A)if(d<=A){const g=1/u;l*=g,d*=g,f=l*(l+o*d+2*a)+d*(o*l+d+2*c)+h}else d=r,l=Math.max(0,-(o*d+a)),f=-l*l+d*(d+2*c)+h;else d=-r,l=Math.max(0,-(o*d+a)),f=-l*l+d*(d+2*c)+h;else d<=-A?(l=Math.max(0,-(-o*r+a)),d=l>0?-r:Math.min(Math.max(-r,-c),r),f=-l*l+d*(d+2*c)+h):d<=A?(l=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+h):(l=Math.max(0,-(o*r+a)),d=l>0?r:Math.min(Math.max(-r,-c),r),f=-l*l+d*(d+2*c)+h);else d=o>0?-r:r,l=Math.max(0,-(o*d+a)),f=-l*l+d*(d+2*c)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,l),i&&i.copy(Qo).addScaledVector(Tr,d),f}intersectSphere(e,t){qn.subVectors(e.center,this.origin);const n=qn.dot(this.direction),i=qn.dot(qn)-n*n,r=e.radius*e.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,o,a,c;const h=1/this.direction.x,u=1/this.direction.y,l=1/this.direction.z,d=this.origin;return h>=0?(n=(e.min.x-d.x)*h,i=(e.max.x-d.x)*h):(n=(e.max.x-d.x)*h,i=(e.min.x-d.x)*h),u>=0?(r=(e.min.y-d.y)*u,o=(e.max.y-d.y)*u):(r=(e.max.y-d.y)*u,o=(e.min.y-d.y)*u),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),l>=0?(a=(e.min.z-d.z)*l,c=(e.max.z-d.z)*l):(a=(e.max.z-d.z)*l,c=(e.min.z-d.z)*l),n>c||a>i)||((a>n||n!==n)&&(n=a),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,qn)!==null}intersectTriangle(e,t,n,i,r){jo.subVectors(t,e),Cr.subVectors(n,e),Jo.crossVectors(jo,Cr);let o=this.direction.dot(Jo),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ai.subVectors(this.origin,e);const c=a*this.direction.dot(Cr.crossVectors(ai,Cr));if(c<0)return null;const h=a*this.direction.dot(jo.cross(ai));if(h<0||c+h>o)return null;const u=-a*ai.dot(Jo);return u<0?null:this.at(u/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Bt{constructor(e,t,n,i,r,o,a,c,h,u,l,d,f,A,g,p){Bt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,c,h,u,l,d,f,A,g,p)}set(e,t,n,i,r,o,a,c,h,u,l,d,f,A,g,p){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=i,m[1]=r,m[5]=o,m[9]=a,m[13]=c,m[2]=h,m[6]=u,m[10]=l,m[14]=d,m[3]=f,m[7]=A,m[11]=g,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Bt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/Zi.setFromMatrixColumn(e,0).length(),r=1/Zi.setFromMatrixColumn(e,1).length(),o=1/Zi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(i),h=Math.sin(i),u=Math.cos(r),l=Math.sin(r);if(e.order==="XYZ"){const d=o*u,f=o*l,A=a*u,g=a*l;t[0]=c*u,t[4]=-c*l,t[8]=h,t[1]=f+A*h,t[5]=d-g*h,t[9]=-a*c,t[2]=g-d*h,t[6]=A+f*h,t[10]=o*c}else if(e.order==="YXZ"){const d=c*u,f=c*l,A=h*u,g=h*l;t[0]=d+g*a,t[4]=A*a-f,t[8]=o*h,t[1]=o*l,t[5]=o*u,t[9]=-a,t[2]=f*a-A,t[6]=g+d*a,t[10]=o*c}else if(e.order==="ZXY"){const d=c*u,f=c*l,A=h*u,g=h*l;t[0]=d-g*a,t[4]=-o*l,t[8]=A+f*a,t[1]=f+A*a,t[5]=o*u,t[9]=g-d*a,t[2]=-o*h,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){const d=o*u,f=o*l,A=a*u,g=a*l;t[0]=c*u,t[4]=A*h-f,t[8]=d*h+g,t[1]=c*l,t[5]=g*h+d,t[9]=f*h-A,t[2]=-h,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){const d=o*c,f=o*h,A=a*c,g=a*h;t[0]=c*u,t[4]=g-d*l,t[8]=A*l+f,t[1]=l,t[5]=o*u,t[9]=-a*u,t[2]=-h*u,t[6]=f*l+A,t[10]=d-g*l}else if(e.order==="XZY"){const d=o*c,f=o*h,A=a*c,g=a*h;t[0]=c*u,t[4]=-l,t[8]=h*u,t[1]=d*l+g,t[5]=o*u,t[9]=f*l-A,t[2]=A*l-f,t[6]=a*u,t[10]=g*l+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Wp,e,Xp)}lookAt(e,t,n){const i=this.elements;return fn.subVectors(e,t),fn.lengthSq()===0&&(fn.z=1),fn.normalize(),li.crossVectors(n,fn),li.lengthSq()===0&&(Math.abs(n.z)===1?fn.x+=1e-4:fn.z+=1e-4,fn.normalize(),li.crossVectors(n,fn)),li.normalize(),Rr.crossVectors(fn,li),i[0]=li.x,i[4]=Rr.x,i[8]=fn.x,i[1]=li.y,i[5]=Rr.y,i[9]=fn.y,i[2]=li.z,i[6]=Rr.z,i[10]=fn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[4],c=n[8],h=n[12],u=n[1],l=n[5],d=n[9],f=n[13],A=n[2],g=n[6],p=n[10],m=n[14],M=n[3],S=n[7],y=n[11],D=n[15],v=i[0],E=i[4],R=i[8],x=i[12],b=i[1],I=i[5],P=i[9],k=i[13],G=i[2],W=i[6],B=i[10],Y=i[14],O=i[3],ie=i[7],re=i[11],Ae=i[15];return r[0]=o*v+a*b+c*G+h*O,r[4]=o*E+a*I+c*W+h*ie,r[8]=o*R+a*P+c*B+h*re,r[12]=o*x+a*k+c*Y+h*Ae,r[1]=u*v+l*b+d*G+f*O,r[5]=u*E+l*I+d*W+f*ie,r[9]=u*R+l*P+d*B+f*re,r[13]=u*x+l*k+d*Y+f*Ae,r[2]=A*v+g*b+p*G+m*O,r[6]=A*E+g*I+p*W+m*ie,r[10]=A*R+g*P+p*B+m*re,r[14]=A*x+g*k+p*Y+m*Ae,r[3]=M*v+S*b+y*G+D*O,r[7]=M*E+S*I+y*W+D*ie,r[11]=M*R+S*P+y*B+D*re,r[15]=M*x+S*k+y*Y+D*Ae,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],o=e[1],a=e[5],c=e[9],h=e[13],u=e[2],l=e[6],d=e[10],f=e[14],A=e[3],g=e[7],p=e[11],m=e[15];return A*(+r*c*l-i*h*l-r*a*d+n*h*d+i*a*f-n*c*f)+g*(+t*c*f-t*h*d+r*o*d-i*o*f+i*h*u-r*c*u)+p*(+t*h*l-t*a*f-r*o*l+n*o*f+r*a*u-n*h*u)+m*(-i*a*u-t*c*l+t*a*d+i*o*l-n*o*d+n*c*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],c=e[6],h=e[7],u=e[8],l=e[9],d=e[10],f=e[11],A=e[12],g=e[13],p=e[14],m=e[15],M=l*p*h-g*d*h+g*c*f-a*p*f-l*c*m+a*d*m,S=A*d*h-u*p*h-A*c*f+o*p*f+u*c*m-o*d*m,y=u*g*h-A*l*h+A*a*f-o*g*f-u*a*m+o*l*m,D=A*l*c-u*g*c-A*a*d+o*g*d+u*a*p-o*l*p,v=t*M+n*S+i*y+r*D;if(v===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/v;return e[0]=M*E,e[1]=(g*d*r-l*p*r-g*i*f+n*p*f+l*i*m-n*d*m)*E,e[2]=(a*p*r-g*c*r+g*i*h-n*p*h-a*i*m+n*c*m)*E,e[3]=(l*c*r-a*d*r-l*i*h+n*d*h+a*i*f-n*c*f)*E,e[4]=S*E,e[5]=(u*p*r-A*d*r+A*i*f-t*p*f-u*i*m+t*d*m)*E,e[6]=(A*c*r-o*p*r-A*i*h+t*p*h+o*i*m-t*c*m)*E,e[7]=(o*d*r-u*c*r+u*i*h-t*d*h-o*i*f+t*c*f)*E,e[8]=y*E,e[9]=(A*l*r-u*g*r-A*n*f+t*g*f+u*n*m-t*l*m)*E,e[10]=(o*g*r-A*a*r+A*n*h-t*g*h-o*n*m+t*a*m)*E,e[11]=(u*a*r-o*l*r-u*n*h+t*l*h+o*n*f-t*a*f)*E,e[12]=D*E,e[13]=(u*g*i-A*l*i+A*n*d-t*g*d-u*n*p+t*l*p)*E,e[14]=(A*a*i-o*g*i-A*n*c+t*g*c+o*n*p-t*a*p)*E,e[15]=(o*l*i-u*a*i+u*n*c-t*l*c-o*n*d+t*a*d)*E,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,o=e.x,a=e.y,c=e.z,h=r*o,u=r*a;return this.set(h*o+n,h*a-i*c,h*c+i*a,0,h*a+i*c,u*a+n,u*c-i*o,0,h*c-i*a,u*c+i*o,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,o){return this.set(1,n,r,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,h=r+r,u=o+o,l=a+a,d=r*h,f=r*u,A=r*l,g=o*u,p=o*l,m=a*l,M=c*h,S=c*u,y=c*l,D=n.x,v=n.y,E=n.z;return i[0]=(1-(g+m))*D,i[1]=(f+y)*D,i[2]=(A-S)*D,i[3]=0,i[4]=(f-y)*v,i[5]=(1-(d+m))*v,i[6]=(p+M)*v,i[7]=0,i[8]=(A+S)*E,i[9]=(p-M)*E,i[10]=(1-(d+g))*E,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let r=Zi.set(i[0],i[1],i[2]).length();const o=Zi.set(i[4],i[5],i[6]).length(),a=Zi.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],Ln.copy(this);const h=1/r,u=1/o,l=1/a;return Ln.elements[0]*=h,Ln.elements[1]*=h,Ln.elements[2]*=h,Ln.elements[4]*=u,Ln.elements[5]*=u,Ln.elements[6]*=u,Ln.elements[8]*=l,Ln.elements[9]*=l,Ln.elements[10]*=l,t.setFromRotationMatrix(Ln),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,i,r,o,a=zn,c=!1){const h=this.elements,u=2*r/(t-e),l=2*r/(n-i),d=(t+e)/(t-e),f=(n+i)/(n-i);let A,g;if(c)A=r/(o-r),g=o*r/(o-r);else if(a===zn)A=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===Ao)A=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return h[0]=u,h[4]=0,h[8]=d,h[12]=0,h[1]=0,h[5]=l,h[9]=f,h[13]=0,h[2]=0,h[6]=0,h[10]=A,h[14]=g,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(e,t,n,i,r,o,a=zn,c=!1){const h=this.elements,u=2/(t-e),l=2/(n-i),d=-(t+e)/(t-e),f=-(n+i)/(n-i);let A,g;if(c)A=1/(o-r),g=o/(o-r);else if(a===zn)A=-2/(o-r),g=-(o+r)/(o-r);else if(a===Ao)A=-1/(o-r),g=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return h[0]=u,h[4]=0,h[8]=0,h[12]=d,h[1]=0,h[5]=l,h[9]=0,h[13]=f,h[2]=0,h[6]=0,h[10]=A,h[14]=g,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Zi=new H,Ln=new Bt,Wp=new H(0,0,0),Xp=new H(1,1,1),li=new H,Rr=new H,fn=new H,Mc=new Bt,Ec=new ur;class ii{constructor(e=0,t=0,n=0,i=ii.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],o=i[4],a=i[8],c=i[1],h=i[5],u=i[9],l=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(nt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,h),this._z=0);break;case"YXZ":this._x=Math.asin(-nt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-l,r),this._z=0);break;case"ZXY":this._x=Math.asin(nt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-l,f),this._z=Math.atan2(-o,h)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-nt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,h));break;case"YZX":this._z=Math.asin(nt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,h),this._y=Math.atan2(-l,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-nt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,h),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Mc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Mc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ec.setFromEuler(this),this.setFromQuaternion(Ec,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ii.DEFAULT_ORDER="XYZ";class Sd{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Yp=0;const Sc=new H,$i=new ur,Kn=new Bt,Dr=new H,Os=new H,qp=new H,Kp=new ur,wc=new H(1,0,0),Tc=new H(0,1,0),Cc=new H(0,0,1),Rc={type:"added"},Qp={type:"removed"},es={type:"childadded",child:null},Zo={type:"childremoved",child:null};class cn extends Ss{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Yp++}),this.uuid=ei(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=cn.DEFAULT_UP.clone();const e=new H,t=new ii,n=new ur,i=new H(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Bt},normalMatrix:{value:new Je}}),this.matrix=new Bt,this.matrixWorld=new Bt,this.matrixAutoUpdate=cn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=cn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Sd,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return $i.setFromAxisAngle(e,t),this.quaternion.multiply($i),this}rotateOnWorldAxis(e,t){return $i.setFromAxisAngle(e,t),this.quaternion.premultiply($i),this}rotateX(e){return this.rotateOnAxis(wc,e)}rotateY(e){return this.rotateOnAxis(Tc,e)}rotateZ(e){return this.rotateOnAxis(Cc,e)}translateOnAxis(e,t){return Sc.copy(e).applyQuaternion(this.quaternion),this.position.add(Sc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(wc,e)}translateY(e){return this.translateOnAxis(Tc,e)}translateZ(e){return this.translateOnAxis(Cc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Kn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Dr.copy(e):Dr.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Os.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Kn.lookAt(Os,Dr,this.up):Kn.lookAt(Dr,Os,this.up),this.quaternion.setFromRotationMatrix(Kn),i&&(Kn.extractRotation(i.matrixWorld),$i.setFromRotationMatrix(Kn),this.quaternion.premultiply($i.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Rc),es.child=e,this.dispatchEvent(es),es.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Qp),Zo.child=e,this.dispatchEvent(Zo),Zo.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Kn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Kn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Kn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Rc),es.child=e,this.dispatchEvent(es),es.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Os,e,qp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Os,Kp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let h=0,u=c.length;h<u;h++){const l=c[h];r(e.shapes,l)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,h=this.material.length;c<h;c++)a.push(r(e.materials,this.material[c]));i.material=a}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];i.animations.push(r(e.animations,c))}}if(t){const a=o(e.geometries),c=o(e.materials),h=o(e.textures),u=o(e.images),l=o(e.shapes),d=o(e.skeletons),f=o(e.animations),A=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),h.length>0&&(n.textures=h),u.length>0&&(n.images=u),l.length>0&&(n.shapes=l),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),A.length>0&&(n.nodes=A)}return n.object=i,n;function o(a){const c=[];for(const h in a){const u=a[h];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}cn.DEFAULT_UP=new H(0,1,0);cn.DEFAULT_MATRIX_AUTO_UPDATE=!0;cn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const In=new H,Qn=new H,$o=new H,jn=new H,ts=new H,ns=new H,Dc=new H,ea=new H,ta=new H,na=new H,ia=new Ut,sa=new Ut,ra=new Ut;class Tn{constructor(e=new H,t=new H,n=new H){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),In.subVectors(e,t),i.cross(In);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){In.subVectors(i,t),Qn.subVectors(n,t),$o.subVectors(e,t);const o=In.dot(In),a=In.dot(Qn),c=In.dot($o),h=Qn.dot(Qn),u=Qn.dot($o),l=o*h-a*a;if(l===0)return r.set(0,0,0),null;const d=1/l,f=(h*c-a*u)*d,A=(o*u-a*c)*d;return r.set(1-f-A,A,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,jn)===null?!1:jn.x>=0&&jn.y>=0&&jn.x+jn.y<=1}static getInterpolation(e,t,n,i,r,o,a,c){return this.getBarycoord(e,t,n,i,jn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,jn.x),c.addScaledVector(o,jn.y),c.addScaledVector(a,jn.z),c)}static getInterpolatedAttribute(e,t,n,i,r,o){return ia.setScalar(0),sa.setScalar(0),ra.setScalar(0),ia.fromBufferAttribute(e,t),sa.fromBufferAttribute(e,n),ra.fromBufferAttribute(e,i),o.setScalar(0),o.addScaledVector(ia,r.x),o.addScaledVector(sa,r.y),o.addScaledVector(ra,r.z),o}static isFrontFacing(e,t,n,i){return In.subVectors(n,t),Qn.subVectors(e,t),In.cross(Qn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return In.subVectors(this.c,this.b),Qn.subVectors(this.a,this.b),In.cross(Qn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Tn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Tn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return Tn.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return Tn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Tn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let o,a;ts.subVectors(i,n),ns.subVectors(r,n),ea.subVectors(e,n);const c=ts.dot(ea),h=ns.dot(ea);if(c<=0&&h<=0)return t.copy(n);ta.subVectors(e,i);const u=ts.dot(ta),l=ns.dot(ta);if(u>=0&&l<=u)return t.copy(i);const d=c*l-u*h;if(d<=0&&c>=0&&u<=0)return o=c/(c-u),t.copy(n).addScaledVector(ts,o);na.subVectors(e,r);const f=ts.dot(na),A=ns.dot(na);if(A>=0&&f<=A)return t.copy(r);const g=f*h-c*A;if(g<=0&&h>=0&&A<=0)return a=h/(h-A),t.copy(n).addScaledVector(ns,a);const p=u*A-f*l;if(p<=0&&l-u>=0&&f-A>=0)return Dc.subVectors(r,i),a=(l-u)/(l-u+(f-A)),t.copy(i).addScaledVector(Dc,a);const m=1/(p+g+d);return o=g*m,a=d*m,t.copy(n).addScaledVector(ts,o).addScaledVector(ns,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const wd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ci={h:0,s:0,l:0},Lr={h:0,s:0,l:0};function oa(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class $e{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=gn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,dt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=dt.workingColorSpace){return this.r=e,this.g=t,this.b=n,dt.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=dt.workingColorSpace){if(e=Tl(e,1),t=nt(t,0,1),n=nt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=oa(o,r,e+1/3),this.g=oa(o,r,e),this.b=oa(o,r,e-1/3)}return dt.colorSpaceToWorking(this,i),this}setStyle(e,t=gn){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=gn){const n=wd[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ti(e.r),this.g=ti(e.g),this.b=ti(e.b),this}copyLinearToSRGB(e){return this.r=As(e.r),this.g=As(e.g),this.b=As(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=gn){return dt.workingToColorSpace(Qt.copy(this),e),Math.round(nt(Qt.r*255,0,255))*65536+Math.round(nt(Qt.g*255,0,255))*256+Math.round(nt(Qt.b*255,0,255))}getHexString(e=gn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=dt.workingColorSpace){dt.workingToColorSpace(Qt.copy(this),t);const n=Qt.r,i=Qt.g,r=Qt.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let c,h;const u=(a+o)/2;if(a===o)c=0,h=0;else{const l=o-a;switch(h=u<=.5?l/(o+a):l/(2-o-a),o){case n:c=(i-r)/l+(i<r?6:0);break;case i:c=(r-n)/l+2;break;case r:c=(n-i)/l+4;break}c/=6}return e.h=c,e.s=h,e.l=u,e}getRGB(e,t=dt.workingColorSpace){return dt.workingToColorSpace(Qt.copy(this),t),e.r=Qt.r,e.g=Qt.g,e.b=Qt.b,e}getStyle(e=gn){dt.workingToColorSpace(Qt.copy(this),e);const t=Qt.r,n=Qt.g,i=Qt.b;return e!==gn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(ci),this.setHSL(ci.h+e,ci.s+t,ci.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ci),e.getHSL(Lr);const n=er(ci.h,Lr.h,t),i=er(ci.s,Lr.s,t),r=er(ci.l,Lr.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Qt=new $e;$e.NAMES=wd;let jp=0;class pr extends Ss{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:jp++}),this.uuid=ei(),this.name="",this.type="Material",this.blending=gs,this.side=ni,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ra,this.blendDst=Da,this.blendEquation=Ii,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new $e(0,0,0),this.blendAlpha=0,this.depthFunc=_s,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ac,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=qi,this.stencilZFail=qi,this.stencilZPass=qi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==gs&&(n.blending=this.blending),this.side!==ni&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ra&&(n.blendSrc=this.blendSrc),this.blendDst!==Da&&(n.blendDst=this.blendDst),this.blendEquation!==Ii&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==_s&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ac&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==qi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==qi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==qi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(t){const r=i(e.textures),o=i(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Ht extends pr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new $e(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ii,this.combine=fd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ft=new H,Ir=new tt;let Jp=0;class Jt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Jp++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=ml,this.updateRanges=[],this.gpuType=$n,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ir.fromBufferAttribute(this,t),Ir.applyMatrix3(e),this.setXY(t,Ir.x,Ir.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyMatrix3(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyMatrix4(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyNormalMatrix(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.transformDirection(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Fn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=At(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Fn(t,this.array)),t}setX(e,t){return this.normalized&&(t=At(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Fn(t,this.array)),t}setY(e,t){return this.normalized&&(t=At(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Fn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=At(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Fn(t,this.array)),t}setW(e,t){return this.normalized&&(t=At(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=At(t,this.array),n=At(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=At(t,this.array),n=At(n,this.array),i=At(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=At(t,this.array),n=At(n,this.array),i=At(i,this.array),r=At(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ml&&(e.usage=this.usage),e}}class Td extends Jt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Cd extends Jt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Wt extends Jt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Zp=0;const yn=new Bt,aa=new cn,is=new H,pn=new fr,zs=new fr,Gt=new H;class dn extends Ss{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Zp++}),this.uuid=ei(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ed(e)?Cd:Td)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Je().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return yn.makeRotationFromQuaternion(e),this.applyMatrix4(yn),this}rotateX(e){return yn.makeRotationX(e),this.applyMatrix4(yn),this}rotateY(e){return yn.makeRotationY(e),this.applyMatrix4(yn),this}rotateZ(e){return yn.makeRotationZ(e),this.applyMatrix4(yn),this}translate(e,t,n){return yn.makeTranslation(e,t,n),this.applyMatrix4(yn),this}scale(e,t,n){return yn.makeScale(e,t,n),this.applyMatrix4(yn),this}lookAt(e){return aa.lookAt(e),aa.updateMatrix(),this.applyMatrix4(aa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(is).negate(),this.translate(is.x,is.y,is.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,r=e.length;i<r;i++){const o=e[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Wt(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new fr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];pn.setFromBufferAttribute(r),this.morphTargetsRelative?(Gt.addVectors(this.boundingBox.min,pn.min),this.boundingBox.expandByPoint(Gt),Gt.addVectors(this.boundingBox.max,pn.max),this.boundingBox.expandByPoint(Gt)):(this.boundingBox.expandByPoint(pn.min),this.boundingBox.expandByPoint(pn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Eo);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new H,1/0);return}if(e){const n=this.boundingSphere.center;if(pn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];zs.setFromBufferAttribute(a),this.morphTargetsRelative?(Gt.addVectors(pn.min,zs.min),pn.expandByPoint(Gt),Gt.addVectors(pn.max,zs.max),pn.expandByPoint(Gt)):(pn.expandByPoint(zs.min),pn.expandByPoint(zs.max))}pn.getCenter(n);let i=0;for(let r=0,o=e.count;r<o;r++)Gt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(Gt));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],c=this.morphTargetsRelative;for(let h=0,u=a.count;h<u;h++)Gt.fromBufferAttribute(a,h),c&&(is.fromBufferAttribute(e,h),Gt.add(is)),i=Math.max(i,n.distanceToSquared(Gt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Jt(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let R=0;R<n.count;R++)a[R]=new H,c[R]=new H;const h=new H,u=new H,l=new H,d=new tt,f=new tt,A=new tt,g=new H,p=new H;function m(R,x,b){h.fromBufferAttribute(n,R),u.fromBufferAttribute(n,x),l.fromBufferAttribute(n,b),d.fromBufferAttribute(r,R),f.fromBufferAttribute(r,x),A.fromBufferAttribute(r,b),u.sub(h),l.sub(h),f.sub(d),A.sub(d);const I=1/(f.x*A.y-A.x*f.y);isFinite(I)&&(g.copy(u).multiplyScalar(A.y).addScaledVector(l,-f.y).multiplyScalar(I),p.copy(l).multiplyScalar(f.x).addScaledVector(u,-A.x).multiplyScalar(I),a[R].add(g),a[x].add(g),a[b].add(g),c[R].add(p),c[x].add(p),c[b].add(p))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let R=0,x=M.length;R<x;++R){const b=M[R],I=b.start,P=b.count;for(let k=I,G=I+P;k<G;k+=3)m(e.getX(k+0),e.getX(k+1),e.getX(k+2))}const S=new H,y=new H,D=new H,v=new H;function E(R){D.fromBufferAttribute(i,R),v.copy(D);const x=a[R];S.copy(x),S.sub(D.multiplyScalar(D.dot(x))).normalize(),y.crossVectors(v,x);const I=y.dot(c[R])<0?-1:1;o.setXYZW(R,S.x,S.y,S.z,I)}for(let R=0,x=M.length;R<x;++R){const b=M[R],I=b.start,P=b.count;for(let k=I,G=I+P;k<G;k+=3)E(e.getX(k+0)),E(e.getX(k+1)),E(e.getX(k+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Jt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new H,r=new H,o=new H,a=new H,c=new H,h=new H,u=new H,l=new H;if(e)for(let d=0,f=e.count;d<f;d+=3){const A=e.getX(d+0),g=e.getX(d+1),p=e.getX(d+2);i.fromBufferAttribute(t,A),r.fromBufferAttribute(t,g),o.fromBufferAttribute(t,p),u.subVectors(o,r),l.subVectors(i,r),u.cross(l),a.fromBufferAttribute(n,A),c.fromBufferAttribute(n,g),h.fromBufferAttribute(n,p),a.add(u),c.add(u),h.add(u),n.setXYZ(A,a.x,a.y,a.z),n.setXYZ(g,c.x,c.y,c.z),n.setXYZ(p,h.x,h.y,h.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),u.subVectors(o,r),l.subVectors(i,r),u.cross(l),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Gt.fromBufferAttribute(e,t),Gt.normalize(),e.setXYZ(t,Gt.x,Gt.y,Gt.z)}toNonIndexed(){function e(a,c){const h=a.array,u=a.itemSize,l=a.normalized,d=new h.constructor(c.length*u);let f=0,A=0;for(let g=0,p=c.length;g<p;g++){a.isInterleavedBufferAttribute?f=c[g]*a.data.stride+a.offset:f=c[g]*u;for(let m=0;m<u;m++)d[A++]=h[f++]}return new Jt(d,u,l)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new dn,n=this.index.array,i=this.attributes;for(const a in i){const c=i[a],h=e(c,n);t.setAttribute(a,h)}const r=this.morphAttributes;for(const a in r){const c=[],h=r[a];for(let u=0,l=h.length;u<l;u++){const d=h[u],f=e(d,n);c.push(f)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const h=o[a];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const h in c)c[h]!==void 0&&(e[h]=c[h]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const h=n[c];e.data.attributes[c]=h.toJSON(e.data)}const i={};let r=!1;for(const c in this.morphAttributes){const h=this.morphAttributes[c],u=[];for(let l=0,d=h.length;l<d;l++){const f=h[l];u.push(f.toJSON(e.data))}u.length>0&&(i[c]=u,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const h in i){const u=i[h];this.setAttribute(h,u.clone(t))}const r=e.morphAttributes;for(const h in r){const u=[],l=r[h];for(let d=0,f=l.length;d<f;d++)u.push(l[d].clone(t));this.morphAttributes[h]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let h=0,u=o.length;h<u;h++){const l=o[h];this.addGroup(l.start,l.count,l.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Lc=new Bt,yi=new Hp,Pr=new Eo,Ic=new H,Ur=new H,Nr=new H,Fr=new H,la=new H,Br=new H,Pc=new H,kr=new H;class lt extends cn{constructor(e=new dn,t=new Ht){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const a=this.morphTargetInfluences;if(r&&a){Br.set(0,0,0);for(let c=0,h=r.length;c<h;c++){const u=a[c],l=r[c];u!==0&&(la.fromBufferAttribute(l,e),o?Br.addScaledVector(la,u):Br.addScaledVector(la.sub(t),u))}t.add(Br)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Pr.copy(n.boundingSphere),Pr.applyMatrix4(r),yi.copy(e.ray).recast(e.near),!(Pr.containsPoint(yi.origin)===!1&&(yi.intersectSphere(Pr,Ic)===null||yi.origin.distanceToSquared(Ic)>(e.far-e.near)**2))&&(Lc.copy(r).invert(),yi.copy(e.ray).applyMatrix4(Lc),!(n.boundingBox!==null&&yi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,yi)))}_computeIntersections(e,t,n){let i;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,h=r.attributes.uv,u=r.attributes.uv1,l=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let A=0,g=d.length;A<g;A++){const p=d[A],m=o[p.materialIndex],M=Math.max(p.start,f.start),S=Math.min(a.count,Math.min(p.start+p.count,f.start+f.count));for(let y=M,D=S;y<D;y+=3){const v=a.getX(y),E=a.getX(y+1),R=a.getX(y+2);i=Or(this,m,e,n,h,u,l,v,E,R),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const A=Math.max(0,f.start),g=Math.min(a.count,f.start+f.count);for(let p=A,m=g;p<m;p+=3){const M=a.getX(p),S=a.getX(p+1),y=a.getX(p+2);i=Or(this,o,e,n,h,u,l,M,S,y),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}else if(c!==void 0)if(Array.isArray(o))for(let A=0,g=d.length;A<g;A++){const p=d[A],m=o[p.materialIndex],M=Math.max(p.start,f.start),S=Math.min(c.count,Math.min(p.start+p.count,f.start+f.count));for(let y=M,D=S;y<D;y+=3){const v=y,E=y+1,R=y+2;i=Or(this,m,e,n,h,u,l,v,E,R),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const A=Math.max(0,f.start),g=Math.min(c.count,f.start+f.count);for(let p=A,m=g;p<m;p+=3){const M=p,S=p+1,y=p+2;i=Or(this,o,e,n,h,u,l,M,S,y),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}}}function $p(s,e,t,n,i,r,o,a){let c;if(e.side===tn?c=n.intersectTriangle(o,r,i,!0,a):c=n.intersectTriangle(i,r,o,e.side===ni,a),c===null)return null;kr.copy(a),kr.applyMatrix4(s.matrixWorld);const h=t.ray.origin.distanceTo(kr);return h<t.near||h>t.far?null:{distance:h,point:kr.clone(),object:s}}function Or(s,e,t,n,i,r,o,a,c,h){s.getVertexPosition(a,Ur),s.getVertexPosition(c,Nr),s.getVertexPosition(h,Fr);const u=$p(s,e,t,n,Ur,Nr,Fr,Pc);if(u){const l=new H;Tn.getBarycoord(Pc,Ur,Nr,Fr,l),i&&(u.uv=Tn.getInterpolatedAttribute(i,a,c,h,l,new tt)),r&&(u.uv1=Tn.getInterpolatedAttribute(r,a,c,h,l,new tt)),o&&(u.normal=Tn.getInterpolatedAttribute(o,a,c,h,l,new H),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const d={a,b:c,c:h,normal:new H,materialIndex:0};Tn.getNormal(Ur,Nr,Fr,d.normal),u.face=d,u.barycoord=l}return u}class Bn extends dn{constructor(e=1,t=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const c=[],h=[],u=[],l=[];let d=0,f=0;A("z","y","x",-1,-1,n,t,e,o,r,0),A("z","y","x",1,-1,n,t,-e,o,r,1),A("x","z","y",1,1,e,n,t,i,o,2),A("x","z","y",1,-1,e,n,-t,i,o,3),A("x","y","z",1,-1,e,t,n,i,r,4),A("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(c),this.setAttribute("position",new Wt(h,3)),this.setAttribute("normal",new Wt(u,3)),this.setAttribute("uv",new Wt(l,2));function A(g,p,m,M,S,y,D,v,E,R,x){const b=y/E,I=D/R,P=y/2,k=D/2,G=v/2,W=E+1,B=R+1;let Y=0,O=0;const ie=new H;for(let re=0;re<B;re++){const Ae=re*I-k;for(let Ve=0;Ve<W;Ve++){const Me=Ve*b-P;ie[g]=Me*M,ie[p]=Ae*S,ie[m]=G,h.push(ie.x,ie.y,ie.z),ie[g]=0,ie[p]=0,ie[m]=v>0?1:-1,u.push(ie.x,ie.y,ie.z),l.push(Ve/E),l.push(1-re/R),Y+=1}}for(let re=0;re<R;re++)for(let Ae=0;Ae<E;Ae++){const Ve=d+Ae+W*re,Me=d+Ae+W*(re+1),Q=d+(Ae+1)+W*(re+1),De=d+(Ae+1)+W*re;c.push(Ve,Me,De),c.push(Me,Q,De),O+=6}a.addGroup(f,O,x),f+=O,d+=Y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Bn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ms(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function en(s){const e={};for(let t=0;t<s.length;t++){const n=Ms(s[t]);for(const i in n)e[i]=n[i]}return e}function em(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Rd(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:dt.workingColorSpace}const tm={clone:Ms,merge:en};var nm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,im=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Gn extends pr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=nm,this.fragmentShader=im,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ms(e.uniforms),this.uniformsGroups=em(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Dd extends cn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Bt,this.projectionMatrix=new Bt,this.projectionMatrixInverse=new Bt,this.coordinateSystem=zn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const hi=new H,Uc=new tt,Nc=new tt;class Sn extends Dd{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ar*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan($s*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ar*2*Math.atan(Math.tan($s*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){hi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(hi.x,hi.y).multiplyScalar(-e/hi.z),hi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(hi.x,hi.y).multiplyScalar(-e/hi.z)}getViewSize(e,t){return this.getViewBounds(e,Uc,Nc),t.subVectors(Nc,Uc)}setViewOffset(e,t,n,i,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan($s*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,h=o.fullHeight;r+=o.offsetX*i/c,t-=o.offsetY*n/h,i*=o.width/c,n*=o.height/h}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const ss=-90,rs=1;class sm extends cn{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Sn(ss,rs,e,t);i.layers=this.layers,this.add(i);const r=new Sn(ss,rs,e,t);r.layers=this.layers,this.add(r);const o=new Sn(ss,rs,e,t);o.layers=this.layers,this.add(o);const a=new Sn(ss,rs,e,t);a.layers=this.layers,this.add(a);const c=new Sn(ss,rs,e,t);c.layers=this.layers,this.add(c);const h=new Sn(ss,rs,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,o,a,c]=t;for(const h of t)this.remove(h);if(e===zn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Ao)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,h,u]=this.children,l=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),A=e.xr.enabled;e.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,o),e.setRenderTarget(n,2,i),e.render(t,a),e.setRenderTarget(n,3,i),e.render(t,c),e.setRenderTarget(n,4,i),e.render(t,h),n.texture.generateMipmaps=g,e.setRenderTarget(n,5,i),e.render(t,u),e.setRenderTarget(l,d,f),e.xr.enabled=A,n.texture.needsPMREMUpdate=!0}}class Ld extends sn{constructor(e=[],t=xs,n,i,r,o,a,c,h,u){super(e,t,n,i,r,o,a,c,h,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class rm extends ki{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Ld(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Bn(5,5,5),r=new Gn({name:"CubemapFromEquirect",uniforms:Ms(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:tn,blending:fi});r.uniforms.tEquirect.value=t;const o=new lt(i,r),a=t.minFilter;return t.minFilter===Ni&&(t.minFilter=An),new sm(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(r)}}class Dt extends cn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const om={type:"move"};class ca{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Dt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Dt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Dt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,o=null;const a=this._targetRay,c=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){o=!0;for(const g of e.hand.values()){const p=t.getJointPose(g,n),m=this._getHandJoint(h,g);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const u=h.joints["index-finger-tip"],l=h.joints["thumb-tip"],d=u.position.distanceTo(l.position),f=.02,A=.005;h.inputState.pinching&&d>f+A?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&d<=f-A&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(om)))}return a!==null&&(a.visible=i!==null),c!==null&&(c.visible=r!==null),h!==null&&(h.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Dt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Id extends cn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ii,this.environmentIntensity=1,this.environmentRotation=new ii,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class am{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=ml,this.updateRanges=[],this.version=0,this.uuid=ei()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ei()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ei()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const $t=new H;class _o{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.applyMatrix4(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.applyNormalMatrix(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.transformDirection(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Fn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=At(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=At(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=At(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=At(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=At(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Fn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Fn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Fn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Fn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=At(t,this.array),n=At(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=At(t,this.array),n=At(n,this.array),i=At(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=At(t,this.array),n=At(n,this.array),i=At(i,this.array),r=At(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new Jt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new _o(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Dl extends pr{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new $e(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let os;const Vs=new H,as=new H,ls=new H,cs=new tt,Gs=new tt,Pd=new Bt,zr=new H,Hs=new H,Vr=new H,Fc=new tt,ha=new tt,Bc=new tt;class Ll extends cn{constructor(e=new Dl){if(super(),this.isSprite=!0,this.type="Sprite",os===void 0){os=new dn;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new am(t,5);os.setIndex([0,1,2,0,2,3]),os.setAttribute("position",new _o(n,3,0,!1)),os.setAttribute("uv",new _o(n,2,3,!1))}this.geometry=os,this.material=e,this.center=new tt(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),as.setFromMatrixScale(this.matrixWorld),Pd.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),ls.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&as.multiplyScalar(-ls.z);const n=this.material.rotation;let i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));const o=this.center;Gr(zr.set(-.5,-.5,0),ls,o,as,i,r),Gr(Hs.set(.5,-.5,0),ls,o,as,i,r),Gr(Vr.set(.5,.5,0),ls,o,as,i,r),Fc.set(0,0),ha.set(1,0),Bc.set(1,1);let a=e.ray.intersectTriangle(zr,Hs,Vr,!1,Vs);if(a===null&&(Gr(Hs.set(-.5,.5,0),ls,o,as,i,r),ha.set(0,1),a=e.ray.intersectTriangle(zr,Vr,Hs,!1,Vs),a===null))return;const c=e.ray.origin.distanceTo(Vs);c<e.near||c>e.far||t.push({distance:c,point:Vs.clone(),uv:Tn.getInterpolation(Vs,zr,Hs,Vr,Fc,ha,Bc,new tt),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Gr(s,e,t,n,i,r){cs.subVectors(s,t).addScalar(.5).multiply(n),i!==void 0?(Gs.x=r*cs.x-i*cs.y,Gs.y=i*cs.x+r*cs.y):Gs.copy(cs),s.copy(e),s.x+=Gs.x,s.y+=Gs.y,s.applyMatrix4(Pd)}const da=new H,lm=new H,cm=new Je;class Di{constructor(e=new H(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=da.subVectors(n,t).cross(lm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(da),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||cm.getNormalMatrix(e),i=this.coplanarPoint(da).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Mi=new Eo,hm=new tt(.5,.5),Hr=new H;class Ud{constructor(e=new Di,t=new Di,n=new Di,i=new Di,r=new Di,o=new Di){this.planes=[e,t,n,i,r,o]}set(e,t,n,i,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=zn,n=!1){const i=this.planes,r=e.elements,o=r[0],a=r[1],c=r[2],h=r[3],u=r[4],l=r[5],d=r[6],f=r[7],A=r[8],g=r[9],p=r[10],m=r[11],M=r[12],S=r[13],y=r[14],D=r[15];if(i[0].setComponents(h-o,f-u,m-A,D-M).normalize(),i[1].setComponents(h+o,f+u,m+A,D+M).normalize(),i[2].setComponents(h+a,f+l,m+g,D+S).normalize(),i[3].setComponents(h-a,f-l,m-g,D-S).normalize(),n)i[4].setComponents(c,d,p,y).normalize(),i[5].setComponents(h-c,f-d,m-p,D-y).normalize();else if(i[4].setComponents(h-c,f-d,m-p,D-y).normalize(),t===zn)i[5].setComponents(h+c,f+d,m+p,D+y).normalize();else if(t===Ao)i[5].setComponents(c,d,p,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Mi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Mi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Mi)}intersectsSprite(e){Mi.center.set(0,0,0);const t=hm.distanceTo(e.center);return Mi.radius=.7071067811865476+t,Mi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Mi)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Hr.x=i.normal.x>0?e.max.x:e.min.x,Hr.y=i.normal.y>0?e.max.y:e.min.y,Hr.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Hr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class So extends sn{constructor(e,t,n,i,r,o,a,c,h){super(e,t,n,i,r,o,a,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Nd extends sn{constructor(e,t,n=Bi,i,r,o,a=nn,c=nn,h,u=rr,l=1){if(u!==rr&&u!==or)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:l};super(d,i,r,o,a,c,u,n,h),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Cl(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Fd extends sn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Il extends dn{constructor(e=1,t=1,n=1,i=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const h=this;i=Math.floor(i),r=Math.floor(r);const u=[],l=[],d=[],f=[];let A=0;const g=[],p=n/2;let m=0;M(),o===!1&&(e>0&&S(!0),t>0&&S(!1)),this.setIndex(u),this.setAttribute("position",new Wt(l,3)),this.setAttribute("normal",new Wt(d,3)),this.setAttribute("uv",new Wt(f,2));function M(){const y=new H,D=new H;let v=0;const E=(t-e)/n;for(let R=0;R<=r;R++){const x=[],b=R/r,I=b*(t-e)+e;for(let P=0;P<=i;P++){const k=P/i,G=k*c+a,W=Math.sin(G),B=Math.cos(G);D.x=I*W,D.y=-b*n+p,D.z=I*B,l.push(D.x,D.y,D.z),y.set(W,E,B).normalize(),d.push(y.x,y.y,y.z),f.push(k,1-b),x.push(A++)}g.push(x)}for(let R=0;R<i;R++)for(let x=0;x<r;x++){const b=g[x][R],I=g[x+1][R],P=g[x+1][R+1],k=g[x][R+1];(e>0||x!==0)&&(u.push(b,I,k),v+=3),(t>0||x!==r-1)&&(u.push(I,P,k),v+=3)}h.addGroup(m,v,0),m+=v}function S(y){const D=A,v=new tt,E=new H;let R=0;const x=y===!0?e:t,b=y===!0?1:-1;for(let P=1;P<=i;P++)l.push(0,p*b,0),d.push(0,b,0),f.push(.5,.5),A++;const I=A;for(let P=0;P<=i;P++){const G=P/i*c+a,W=Math.cos(G),B=Math.sin(G);E.x=x*B,E.y=p*b,E.z=x*W,l.push(E.x,E.y,E.z),d.push(0,b,0),v.x=W*.5+.5,v.y=B*.5*b+.5,f.push(v.x,v.y),A++}for(let P=0;P<i;P++){const k=D+P,G=I+P;y===!0?u.push(G,G+1,k):u.push(G+1,G,k),R+=3}h.addGroup(m,R,y===!0?1:2),m+=R}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Il(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Pl extends dn{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const r=[],o=[];a(i),h(n),u(),this.setAttribute("position",new Wt(r,3)),this.setAttribute("normal",new Wt(r.slice(),3)),this.setAttribute("uv",new Wt(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(M){const S=new H,y=new H,D=new H;for(let v=0;v<t.length;v+=3)f(t[v+0],S),f(t[v+1],y),f(t[v+2],D),c(S,y,D,M)}function c(M,S,y,D){const v=D+1,E=[];for(let R=0;R<=v;R++){E[R]=[];const x=M.clone().lerp(y,R/v),b=S.clone().lerp(y,R/v),I=v-R;for(let P=0;P<=I;P++)P===0&&R===v?E[R][P]=x:E[R][P]=x.clone().lerp(b,P/I)}for(let R=0;R<v;R++)for(let x=0;x<2*(v-R)-1;x++){const b=Math.floor(x/2);x%2===0?(d(E[R][b+1]),d(E[R+1][b]),d(E[R][b])):(d(E[R][b+1]),d(E[R+1][b+1]),d(E[R+1][b]))}}function h(M){const S=new H;for(let y=0;y<r.length;y+=3)S.x=r[y+0],S.y=r[y+1],S.z=r[y+2],S.normalize().multiplyScalar(M),r[y+0]=S.x,r[y+1]=S.y,r[y+2]=S.z}function u(){const M=new H;for(let S=0;S<r.length;S+=3){M.x=r[S+0],M.y=r[S+1],M.z=r[S+2];const y=p(M)/2/Math.PI+.5,D=m(M)/Math.PI+.5;o.push(y,1-D)}A(),l()}function l(){for(let M=0;M<o.length;M+=6){const S=o[M+0],y=o[M+2],D=o[M+4],v=Math.max(S,y,D),E=Math.min(S,y,D);v>.9&&E<.1&&(S<.2&&(o[M+0]+=1),y<.2&&(o[M+2]+=1),D<.2&&(o[M+4]+=1))}}function d(M){r.push(M.x,M.y,M.z)}function f(M,S){const y=M*3;S.x=e[y+0],S.y=e[y+1],S.z=e[y+2]}function A(){const M=new H,S=new H,y=new H,D=new H,v=new tt,E=new tt,R=new tt;for(let x=0,b=0;x<r.length;x+=9,b+=6){M.set(r[x+0],r[x+1],r[x+2]),S.set(r[x+3],r[x+4],r[x+5]),y.set(r[x+6],r[x+7],r[x+8]),v.set(o[b+0],o[b+1]),E.set(o[b+2],o[b+3]),R.set(o[b+4],o[b+5]),D.copy(M).add(S).add(y).divideScalar(3);const I=p(D);g(v,b+0,M,I),g(E,b+2,S,I),g(R,b+4,y,I)}}function g(M,S,y,D){D<0&&M.x===1&&(o[S]=M.x-1),y.x===0&&y.z===0&&(o[S]=D/2/Math.PI+.5)}function p(M){return Math.atan2(M.z,-M.x)}function m(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Pl(e.vertices,e.indices,e.radius,e.details)}}class Ul extends Pl{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ul(e.radius,e.detail)}}class ws extends dn{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,o=t/2,a=Math.floor(n),c=Math.floor(i),h=a+1,u=c+1,l=e/a,d=t/c,f=[],A=[],g=[],p=[];for(let m=0;m<u;m++){const M=m*d-o;for(let S=0;S<h;S++){const y=S*l-r;A.push(y,-M,0),g.push(0,0,1),p.push(S/a),p.push(1-m/c)}}for(let m=0;m<c;m++)for(let M=0;M<a;M++){const S=M+h*m,y=M+h*(m+1),D=M+1+h*(m+1),v=M+1+h*m;f.push(S,y,v),f.push(y,D,v)}this.setIndex(f),this.setAttribute("position",new Wt(A,3)),this.setAttribute("normal",new Wt(g,3)),this.setAttribute("uv",new Wt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ws(e.width,e.height,e.widthSegments,e.heightSegments)}}class Nl extends dn{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let h=0;const u=[],l=new H,d=new H,f=[],A=[],g=[],p=[];for(let m=0;m<=n;m++){const M=[],S=m/n;let y=0;m===0&&o===0?y=.5/t:m===n&&c===Math.PI&&(y=-.5/t);for(let D=0;D<=t;D++){const v=D/t;l.x=-e*Math.cos(i+v*r)*Math.sin(o+S*a),l.y=e*Math.cos(o+S*a),l.z=e*Math.sin(i+v*r)*Math.sin(o+S*a),A.push(l.x,l.y,l.z),d.copy(l).normalize(),g.push(d.x,d.y,d.z),p.push(v+y,1-S),M.push(h++)}u.push(M)}for(let m=0;m<n;m++)for(let M=0;M<t;M++){const S=u[m][M+1],y=u[m][M],D=u[m+1][M],v=u[m+1][M+1];(m!==0||o>0)&&f.push(S,y,v),(m!==n-1||c<Math.PI)&&f.push(y,D,v)}this.setIndex(f),this.setAttribute("position",new Wt(A,3)),this.setAttribute("normal",new Wt(g,3)),this.setAttribute("uv",new Wt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Nl(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class dm extends pr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=op,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class um extends pr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class fm extends Dd{constructor(e=-1,t=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=i+t,c=i-t;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,o=r+h*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class pm extends Sn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}function kc(s,e,t,n){const i=mm(n);switch(t){case _d:return s*e;case bd:return s*e/i.components*i.byteLength;case El:return s*e/i.components*i.byteLength;case yd:return s*e*2/i.components*i.byteLength;case Sl:return s*e*2/i.components*i.byteLength;case xd:return s*e*3/i.components*i.byteLength;case Cn:return s*e*4/i.components*i.byteLength;case wl:return s*e*4/i.components*i.byteLength;case ao:case lo:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case co:case ho:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Ga:case Wa:return Math.max(s,16)*Math.max(e,8)/4;case Va:case Ha:return Math.max(s,8)*Math.max(e,8)/2;case Xa:case Ya:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case qa:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Ka:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Qa:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case ja:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case Ja:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case Za:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case $a:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case el:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case tl:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case nl:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case il:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case sl:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case rl:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case ol:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case al:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case ll:case cl:case hl:return Math.ceil(s/4)*Math.ceil(e/4)*16;case dl:case ul:return Math.ceil(s/4)*Math.ceil(e/4)*8;case fl:case pl:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function mm(s){switch(s){case Vn:case md:return{byteLength:1,components:1};case ir:case gd:case dr:return{byteLength:2,components:1};case yl:case Ml:return{byteLength:2,components:4};case Bi:case bl:case $n:return{byteLength:4,components:1};case Ad:case vd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:xl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=xl);function Bd(){let s=null,e=!1,t=null,n=null;function i(r,o){t(r,o),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function gm(s){const e=new WeakMap;function t(a,c){const h=a.array,u=a.usage,l=h.byteLength,d=s.createBuffer();s.bindBuffer(c,d),s.bufferData(c,h,u),a.onUploadCallback();let f;if(h instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&h instanceof Float16Array)f=s.HALF_FLOAT;else if(h instanceof Uint16Array)a.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(h instanceof Int16Array)f=s.SHORT;else if(h instanceof Uint32Array)f=s.UNSIGNED_INT;else if(h instanceof Int32Array)f=s.INT;else if(h instanceof Int8Array)f=s.BYTE;else if(h instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:d,type:f,bytesPerElement:h.BYTES_PER_ELEMENT,version:a.version,size:l}}function n(a,c,h){const u=c.array,l=c.updateRanges;if(s.bindBuffer(h,a),l.length===0)s.bufferSubData(h,0,u);else{l.sort((f,A)=>f.start-A.start);let d=0;for(let f=1;f<l.length;f++){const A=l[d],g=l[f];g.start<=A.start+A.count+1?A.count=Math.max(A.count,g.start+g.count-A.start):(++d,l[d]=g)}l.length=d+1;for(let f=0,A=l.length;f<A;f++){const g=l[f];s.bufferSubData(h,g.start*u.BYTES_PER_ELEMENT,u,g.start,g.count)}c.clearUpdateRanges()}c.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=e.get(a);c&&(s.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const h=e.get(a);if(h===void 0)e.set(a,t(a,c));else if(h.version<a.version){if(h.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(h.buffer,a,c),h.version=a.version}}return{get:i,remove:r,update:o}}var Am=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,vm=`#ifdef USE_ALPHAHASH
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
#endif`,_m=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,xm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ym=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Mm=`#ifdef USE_AOMAP
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
#endif`,Em=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Sm=`#ifdef USE_BATCHING
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
#endif`,wm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Tm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Cm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Rm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Dm=`#ifdef USE_IRIDESCENCE
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
#endif`,Lm=`#ifdef USE_BUMPMAP
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
#endif`,Im=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Pm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Um=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Nm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Fm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Bm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,km=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Om=`#if defined( USE_COLOR_ALPHA )
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
#endif`,zm=`#define PI 3.141592653589793
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
} // validated`,Vm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Gm=`vec3 transformedNormal = objectNormal;
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
#endif`,Hm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Wm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Xm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ym=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,qm="gl_FragColor = linearToOutputTexel( gl_FragColor );",Km=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Qm=`#ifdef USE_ENVMAP
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
#endif`,jm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Jm=`#ifdef USE_ENVMAP
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
#endif`,Zm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,$m=`#ifdef USE_ENVMAP
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
#endif`,eg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,tg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ng=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ig=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,sg=`#ifdef USE_GRADIENTMAP
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
}`,rg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,og=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ag=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lg=`uniform bool receiveShadow;
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
#endif`,cg=`#ifdef USE_ENVMAP
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
#endif`,hg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,dg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ug=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,fg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,pg=`PhysicalMaterial material;
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
#endif`,mg=`struct PhysicalMaterial {
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
}`,gg=`
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
#endif`,Ag=`#if defined( RE_IndirectDiffuse )
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
#endif`,vg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,_g=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,xg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,bg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,yg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Mg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Eg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Sg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,wg=`#if defined( USE_POINTS_UV )
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
#endif`,Tg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Cg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Rg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Dg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Lg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ig=`#ifdef USE_MORPHTARGETS
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
#endif`,Pg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ug=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Ng=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Fg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Bg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,kg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Og=`#ifdef USE_NORMALMAP
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
#endif`,zg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Vg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Gg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Hg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Wg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Xg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Yg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,qg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Kg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Qg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,jg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Jg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Zg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,$g=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,e0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,t0=`float getShadowMask() {
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
}`,n0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,i0=`#ifdef USE_SKINNING
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
#endif`,s0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,r0=`#ifdef USE_SKINNING
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
#endif`,o0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,a0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,l0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,c0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,h0=`#ifdef USE_TRANSMISSION
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
#endif`,d0=`#ifdef USE_TRANSMISSION
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
#endif`,u0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,f0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,p0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,m0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const g0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,A0=`uniform sampler2D t2D;
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
}`,v0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,_0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,x0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,b0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,y0=`#include <common>
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
}`,M0=`#if DEPTH_PACKING == 3200
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
}`,E0=`#define DISTANCE
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
}`,S0=`#define DISTANCE
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
}`,w0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,T0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,C0=`uniform float scale;
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
}`,R0=`uniform vec3 diffuse;
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
}`,D0=`#include <common>
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
}`,L0=`uniform vec3 diffuse;
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
}`,I0=`#define LAMBERT
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
}`,P0=`#define LAMBERT
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
}`,U0=`#define MATCAP
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
}`,N0=`#define MATCAP
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
}`,F0=`#define NORMAL
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
}`,B0=`#define NORMAL
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
}`,k0=`#define PHONG
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
}`,O0=`#define PHONG
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
}`,z0=`#define STANDARD
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
}`,V0=`#define STANDARD
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
}`,G0=`#define TOON
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
}`,H0=`#define TOON
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
}`,W0=`uniform float size;
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
}`,X0=`uniform vec3 diffuse;
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
}`,Y0=`#include <common>
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
}`,q0=`uniform vec3 color;
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
}`,K0=`uniform float rotation;
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
}`,Q0=`uniform vec3 diffuse;
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
}`,Ze={alphahash_fragment:Am,alphahash_pars_fragment:vm,alphamap_fragment:_m,alphamap_pars_fragment:xm,alphatest_fragment:bm,alphatest_pars_fragment:ym,aomap_fragment:Mm,aomap_pars_fragment:Em,batching_pars_vertex:Sm,batching_vertex:wm,begin_vertex:Tm,beginnormal_vertex:Cm,bsdfs:Rm,iridescence_fragment:Dm,bumpmap_pars_fragment:Lm,clipping_planes_fragment:Im,clipping_planes_pars_fragment:Pm,clipping_planes_pars_vertex:Um,clipping_planes_vertex:Nm,color_fragment:Fm,color_pars_fragment:Bm,color_pars_vertex:km,color_vertex:Om,common:zm,cube_uv_reflection_fragment:Vm,defaultnormal_vertex:Gm,displacementmap_pars_vertex:Hm,displacementmap_vertex:Wm,emissivemap_fragment:Xm,emissivemap_pars_fragment:Ym,colorspace_fragment:qm,colorspace_pars_fragment:Km,envmap_fragment:Qm,envmap_common_pars_fragment:jm,envmap_pars_fragment:Jm,envmap_pars_vertex:Zm,envmap_physical_pars_fragment:cg,envmap_vertex:$m,fog_vertex:eg,fog_pars_vertex:tg,fog_fragment:ng,fog_pars_fragment:ig,gradientmap_pars_fragment:sg,lightmap_pars_fragment:rg,lights_lambert_fragment:og,lights_lambert_pars_fragment:ag,lights_pars_begin:lg,lights_toon_fragment:hg,lights_toon_pars_fragment:dg,lights_phong_fragment:ug,lights_phong_pars_fragment:fg,lights_physical_fragment:pg,lights_physical_pars_fragment:mg,lights_fragment_begin:gg,lights_fragment_maps:Ag,lights_fragment_end:vg,logdepthbuf_fragment:_g,logdepthbuf_pars_fragment:xg,logdepthbuf_pars_vertex:bg,logdepthbuf_vertex:yg,map_fragment:Mg,map_pars_fragment:Eg,map_particle_fragment:Sg,map_particle_pars_fragment:wg,metalnessmap_fragment:Tg,metalnessmap_pars_fragment:Cg,morphinstance_vertex:Rg,morphcolor_vertex:Dg,morphnormal_vertex:Lg,morphtarget_pars_vertex:Ig,morphtarget_vertex:Pg,normal_fragment_begin:Ug,normal_fragment_maps:Ng,normal_pars_fragment:Fg,normal_pars_vertex:Bg,normal_vertex:kg,normalmap_pars_fragment:Og,clearcoat_normal_fragment_begin:zg,clearcoat_normal_fragment_maps:Vg,clearcoat_pars_fragment:Gg,iridescence_pars_fragment:Hg,opaque_fragment:Wg,packing:Xg,premultiplied_alpha_fragment:Yg,project_vertex:qg,dithering_fragment:Kg,dithering_pars_fragment:Qg,roughnessmap_fragment:jg,roughnessmap_pars_fragment:Jg,shadowmap_pars_fragment:Zg,shadowmap_pars_vertex:$g,shadowmap_vertex:e0,shadowmask_pars_fragment:t0,skinbase_vertex:n0,skinning_pars_vertex:i0,skinning_vertex:s0,skinnormal_vertex:r0,specularmap_fragment:o0,specularmap_pars_fragment:a0,tonemapping_fragment:l0,tonemapping_pars_fragment:c0,transmission_fragment:h0,transmission_pars_fragment:d0,uv_pars_fragment:u0,uv_pars_vertex:f0,uv_vertex:p0,worldpos_vertex:m0,background_vert:g0,background_frag:A0,backgroundCube_vert:v0,backgroundCube_frag:_0,cube_vert:x0,cube_frag:b0,depth_vert:y0,depth_frag:M0,distanceRGBA_vert:E0,distanceRGBA_frag:S0,equirect_vert:w0,equirect_frag:T0,linedashed_vert:C0,linedashed_frag:R0,meshbasic_vert:D0,meshbasic_frag:L0,meshlambert_vert:I0,meshlambert_frag:P0,meshmatcap_vert:U0,meshmatcap_frag:N0,meshnormal_vert:F0,meshnormal_frag:B0,meshphong_vert:k0,meshphong_frag:O0,meshphysical_vert:z0,meshphysical_frag:V0,meshtoon_vert:G0,meshtoon_frag:H0,points_vert:W0,points_frag:X0,shadow_vert:Y0,shadow_frag:q0,sprite_vert:K0,sprite_frag:Q0},be={common:{diffuse:{value:new $e(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Je},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Je}},envmap:{envMap:{value:null},envMapRotation:{value:new Je},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Je}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Je}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Je},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Je},normalScale:{value:new tt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Je},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Je}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Je}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Je}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new $e(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new $e(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0},uvTransform:{value:new Je}},sprite:{diffuse:{value:new $e(16777215)},opacity:{value:1},center:{value:new tt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Je},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0}}},On={basic:{uniforms:en([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.fog]),vertexShader:Ze.meshbasic_vert,fragmentShader:Ze.meshbasic_frag},lambert:{uniforms:en([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.fog,be.lights,{emissive:{value:new $e(0)}}]),vertexShader:Ze.meshlambert_vert,fragmentShader:Ze.meshlambert_frag},phong:{uniforms:en([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.fog,be.lights,{emissive:{value:new $e(0)},specular:{value:new $e(1118481)},shininess:{value:30}}]),vertexShader:Ze.meshphong_vert,fragmentShader:Ze.meshphong_frag},standard:{uniforms:en([be.common,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.roughnessmap,be.metalnessmap,be.fog,be.lights,{emissive:{value:new $e(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag},toon:{uniforms:en([be.common,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.gradientmap,be.fog,be.lights,{emissive:{value:new $e(0)}}]),vertexShader:Ze.meshtoon_vert,fragmentShader:Ze.meshtoon_frag},matcap:{uniforms:en([be.common,be.bumpmap,be.normalmap,be.displacementmap,be.fog,{matcap:{value:null}}]),vertexShader:Ze.meshmatcap_vert,fragmentShader:Ze.meshmatcap_frag},points:{uniforms:en([be.points,be.fog]),vertexShader:Ze.points_vert,fragmentShader:Ze.points_frag},dashed:{uniforms:en([be.common,be.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ze.linedashed_vert,fragmentShader:Ze.linedashed_frag},depth:{uniforms:en([be.common,be.displacementmap]),vertexShader:Ze.depth_vert,fragmentShader:Ze.depth_frag},normal:{uniforms:en([be.common,be.bumpmap,be.normalmap,be.displacementmap,{opacity:{value:1}}]),vertexShader:Ze.meshnormal_vert,fragmentShader:Ze.meshnormal_frag},sprite:{uniforms:en([be.sprite,be.fog]),vertexShader:Ze.sprite_vert,fragmentShader:Ze.sprite_frag},background:{uniforms:{uvTransform:{value:new Je},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ze.background_vert,fragmentShader:Ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Je}},vertexShader:Ze.backgroundCube_vert,fragmentShader:Ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ze.cube_vert,fragmentShader:Ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ze.equirect_vert,fragmentShader:Ze.equirect_frag},distanceRGBA:{uniforms:en([be.common,be.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ze.distanceRGBA_vert,fragmentShader:Ze.distanceRGBA_frag},shadow:{uniforms:en([be.lights,be.fog,{color:{value:new $e(0)},opacity:{value:1}}]),vertexShader:Ze.shadow_vert,fragmentShader:Ze.shadow_frag}};On.physical={uniforms:en([On.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Je},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Je},clearcoatNormalScale:{value:new tt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Je},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Je},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Je},sheen:{value:0},sheenColor:{value:new $e(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Je},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Je},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Je},transmissionSamplerSize:{value:new tt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Je},attenuationDistance:{value:0},attenuationColor:{value:new $e(0)},specularColor:{value:new $e(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Je},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Je},anisotropyVector:{value:new tt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Je}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag};const Wr={r:0,b:0,g:0},Ei=new ii,j0=new Bt;function J0(s,e,t,n,i,r,o){const a=new $e(0);let c=r===!0?0:1,h,u,l=null,d=0,f=null;function A(S){let y=S.isScene===!0?S.background:null;return y&&y.isTexture&&(y=(S.backgroundBlurriness>0?t:e).get(y)),y}function g(S){let y=!1;const D=A(S);D===null?m(a,c):D&&D.isColor&&(m(D,1),y=!0);const v=s.xr.getEnvironmentBlendMode();v==="additive"?n.buffers.color.setClear(0,0,0,1,o):v==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function p(S,y){const D=A(y);D&&(D.isCubeTexture||D.mapping===Mo)?(u===void 0&&(u=new lt(new Bn(1,1,1),new Gn({name:"BackgroundCubeMaterial",uniforms:Ms(On.backgroundCube.uniforms),vertexShader:On.backgroundCube.vertexShader,fragmentShader:On.backgroundCube.fragmentShader,side:tn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(v,E,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(u)),Ei.copy(y.backgroundRotation),Ei.x*=-1,Ei.y*=-1,Ei.z*=-1,D.isCubeTexture&&D.isRenderTargetTexture===!1&&(Ei.y*=-1,Ei.z*=-1),u.material.uniforms.envMap.value=D,u.material.uniforms.flipEnvMap.value=D.isCubeTexture&&D.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(j0.makeRotationFromEuler(Ei)),u.material.toneMapped=dt.getTransfer(D.colorSpace)!==xt,(l!==D||d!==D.version||f!==s.toneMapping)&&(u.material.needsUpdate=!0,l=D,d=D.version,f=s.toneMapping),u.layers.enableAll(),S.unshift(u,u.geometry,u.material,0,0,null)):D&&D.isTexture&&(h===void 0&&(h=new lt(new ws(2,2),new Gn({name:"BackgroundMaterial",uniforms:Ms(On.background.uniforms),vertexShader:On.background.vertexShader,fragmentShader:On.background.fragmentShader,side:ni,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(h)),h.material.uniforms.t2D.value=D,h.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,h.material.toneMapped=dt.getTransfer(D.colorSpace)!==xt,D.matrixAutoUpdate===!0&&D.updateMatrix(),h.material.uniforms.uvTransform.value.copy(D.matrix),(l!==D||d!==D.version||f!==s.toneMapping)&&(h.material.needsUpdate=!0,l=D,d=D.version,f=s.toneMapping),h.layers.enableAll(),S.unshift(h,h.geometry,h.material,0,0,null))}function m(S,y){S.getRGB(Wr,Rd(s)),n.buffers.color.setClear(Wr.r,Wr.g,Wr.b,y,o)}function M(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0)}return{getClearColor:function(){return a},setClearColor:function(S,y=1){a.set(S),c=y,m(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(S){c=S,m(a,c)},render:g,addToRenderList:p,dispose:M}}function Z0(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null);let r=i,o=!1;function a(b,I,P,k,G){let W=!1;const B=l(k,P,I);r!==B&&(r=B,h(r.object)),W=f(b,k,P,G),W&&A(b,k,P,G),G!==null&&e.update(G,s.ELEMENT_ARRAY_BUFFER),(W||o)&&(o=!1,y(b,I,P,k),G!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(G).buffer))}function c(){return s.createVertexArray()}function h(b){return s.bindVertexArray(b)}function u(b){return s.deleteVertexArray(b)}function l(b,I,P){const k=P.wireframe===!0;let G=n[b.id];G===void 0&&(G={},n[b.id]=G);let W=G[I.id];W===void 0&&(W={},G[I.id]=W);let B=W[k];return B===void 0&&(B=d(c()),W[k]=B),B}function d(b){const I=[],P=[],k=[];for(let G=0;G<t;G++)I[G]=0,P[G]=0,k[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:P,attributeDivisors:k,object:b,attributes:{},index:null}}function f(b,I,P,k){const G=r.attributes,W=I.attributes;let B=0;const Y=P.getAttributes();for(const O in Y)if(Y[O].location>=0){const re=G[O];let Ae=W[O];if(Ae===void 0&&(O==="instanceMatrix"&&b.instanceMatrix&&(Ae=b.instanceMatrix),O==="instanceColor"&&b.instanceColor&&(Ae=b.instanceColor)),re===void 0||re.attribute!==Ae||Ae&&re.data!==Ae.data)return!0;B++}return r.attributesNum!==B||r.index!==k}function A(b,I,P,k){const G={},W=I.attributes;let B=0;const Y=P.getAttributes();for(const O in Y)if(Y[O].location>=0){let re=W[O];re===void 0&&(O==="instanceMatrix"&&b.instanceMatrix&&(re=b.instanceMatrix),O==="instanceColor"&&b.instanceColor&&(re=b.instanceColor));const Ae={};Ae.attribute=re,re&&re.data&&(Ae.data=re.data),G[O]=Ae,B++}r.attributes=G,r.attributesNum=B,r.index=k}function g(){const b=r.newAttributes;for(let I=0,P=b.length;I<P;I++)b[I]=0}function p(b){m(b,0)}function m(b,I){const P=r.newAttributes,k=r.enabledAttributes,G=r.attributeDivisors;P[b]=1,k[b]===0&&(s.enableVertexAttribArray(b),k[b]=1),G[b]!==I&&(s.vertexAttribDivisor(b,I),G[b]=I)}function M(){const b=r.newAttributes,I=r.enabledAttributes;for(let P=0,k=I.length;P<k;P++)I[P]!==b[P]&&(s.disableVertexAttribArray(P),I[P]=0)}function S(b,I,P,k,G,W,B){B===!0?s.vertexAttribIPointer(b,I,P,G,W):s.vertexAttribPointer(b,I,P,k,G,W)}function y(b,I,P,k){g();const G=k.attributes,W=P.getAttributes(),B=I.defaultAttributeValues;for(const Y in W){const O=W[Y];if(O.location>=0){let ie=G[Y];if(ie===void 0&&(Y==="instanceMatrix"&&b.instanceMatrix&&(ie=b.instanceMatrix),Y==="instanceColor"&&b.instanceColor&&(ie=b.instanceColor)),ie!==void 0){const re=ie.normalized,Ae=ie.itemSize,Ve=e.get(ie);if(Ve===void 0)continue;const Me=Ve.buffer,Q=Ve.type,De=Ve.bytesPerElement,q=Q===s.INT||Q===s.UNSIGNED_INT||ie.gpuType===bl;if(ie.isInterleavedBufferAttribute){const $=ie.data,oe=$.stride,fe=ie.offset;if($.isInstancedInterleavedBuffer){for(let he=0;he<O.locationSize;he++)m(O.location+he,$.meshPerAttribute);b.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let he=0;he<O.locationSize;he++)p(O.location+he);s.bindBuffer(s.ARRAY_BUFFER,Me);for(let he=0;he<O.locationSize;he++)S(O.location+he,Ae/O.locationSize,Q,re,oe*De,(fe+Ae/O.locationSize*he)*De,q)}else{if(ie.isInstancedBufferAttribute){for(let $=0;$<O.locationSize;$++)m(O.location+$,ie.meshPerAttribute);b.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let $=0;$<O.locationSize;$++)p(O.location+$);s.bindBuffer(s.ARRAY_BUFFER,Me);for(let $=0;$<O.locationSize;$++)S(O.location+$,Ae/O.locationSize,Q,re,Ae*De,Ae/O.locationSize*$*De,q)}}else if(B!==void 0){const re=B[Y];if(re!==void 0)switch(re.length){case 2:s.vertexAttrib2fv(O.location,re);break;case 3:s.vertexAttrib3fv(O.location,re);break;case 4:s.vertexAttrib4fv(O.location,re);break;default:s.vertexAttrib1fv(O.location,re)}}}}M()}function D(){R();for(const b in n){const I=n[b];for(const P in I){const k=I[P];for(const G in k)u(k[G].object),delete k[G];delete I[P]}delete n[b]}}function v(b){if(n[b.id]===void 0)return;const I=n[b.id];for(const P in I){const k=I[P];for(const G in k)u(k[G].object),delete k[G];delete I[P]}delete n[b.id]}function E(b){for(const I in n){const P=n[I];if(P[b.id]===void 0)continue;const k=P[b.id];for(const G in k)u(k[G].object),delete k[G];delete P[b.id]}}function R(){x(),o=!0,r!==i&&(r=i,h(r.object))}function x(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:R,resetDefaultState:x,dispose:D,releaseStatesOfGeometry:v,releaseStatesOfProgram:E,initAttributes:g,enableAttribute:p,disableUnusedAttributes:M}}function $0(s,e,t){let n;function i(h){n=h}function r(h,u){s.drawArrays(n,h,u),t.update(u,n,1)}function o(h,u,l){l!==0&&(s.drawArraysInstanced(n,h,u,l),t.update(u,n,l))}function a(h,u,l){if(l===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,h,0,u,0,l);let f=0;for(let A=0;A<l;A++)f+=u[A];t.update(f,n,1)}function c(h,u,l,d){if(l===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let A=0;A<h.length;A++)o(h[A],u[A],d[A]);else{f.multiDrawArraysInstancedWEBGL(n,h,0,u,0,d,0,l);let A=0;for(let g=0;g<l;g++)A+=u[g]*d[g];t.update(A,n,1)}}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function eA(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const E=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(E){return!(E!==Cn&&n.convert(E)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(E){const R=E===dr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(E!==Vn&&n.convert(E)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==$n&&!R)}function c(E){if(E==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=t.precision!==void 0?t.precision:"highp";const u=c(h);u!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",u,"instead."),h=u);const l=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),A=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_TEXTURE_SIZE),p=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),m=s.getParameter(s.MAX_VERTEX_ATTRIBS),M=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),S=s.getParameter(s.MAX_VARYING_VECTORS),y=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),D=A>0,v=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:h,logarithmicDepthBuffer:l,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:A,maxTextureSize:g,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:M,maxVaryings:S,maxFragmentUniforms:y,vertexTextures:D,maxSamples:v}}function tA(s){const e=this;let t=null,n=0,i=!1,r=!1;const o=new Di,a=new Je,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(l,d){const f=l.length!==0||d||n!==0||i;return i=d,n=l.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(l,d){t=u(l,d,0)},this.setState=function(l,d,f){const A=l.clippingPlanes,g=l.clipIntersection,p=l.clipShadows,m=s.get(l);if(!i||A===null||A.length===0||r&&!p)r?u(null):h();else{const M=r?0:n,S=M*4;let y=m.clippingState||null;c.value=y,y=u(A,d,S,f);for(let D=0;D!==S;++D)y[D]=t[D];m.clippingState=y,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=M}};function h(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(l,d,f,A){const g=l!==null?l.length:0;let p=null;if(g!==0){if(p=c.value,A!==!0||p===null){const m=f+g*4,M=d.matrixWorldInverse;a.getNormalMatrix(M),(p===null||p.length<m)&&(p=new Float32Array(m));for(let S=0,y=f;S!==g;++S,y+=4)o.copy(l[S]).applyMatrix4(M,a),o.normal.toArray(p,y),p[y+3]=o.constant}c.value=p,c.needsUpdate=!0}return e.numPlanes=g,e.numIntersection=0,p}}function nA(s){let e=new WeakMap;function t(o,a){return a===ka?o.mapping=xs:a===Oa&&(o.mapping=bs),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===ka||a===Oa)if(e.has(o)){const c=e.get(o).texture;return t(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const h=new rm(c.height);return h.fromEquirectangularTexture(s,o),e.set(o,h),o.addEventListener("dispose",i),t(h.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const fs=4,Oc=[.125,.215,.35,.446,.526,.582],Pi=20,ua=new fm,zc=new $e;let fa=null,pa=0,ma=0,ga=!1;const Li=(1+Math.sqrt(5))/2,hs=1/Li,Vc=[new H(-Li,hs,0),new H(Li,hs,0),new H(-hs,0,Li),new H(hs,0,Li),new H(0,Li,-hs),new H(0,Li,hs),new H(-1,1,-1),new H(1,1,-1),new H(-1,1,1),new H(1,1,1)],iA=new H;class Gc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100,r={}){const{size:o=256,position:a=iA}=r;fa=this._renderer.getRenderTarget(),pa=this._renderer.getActiveCubeFace(),ma=this._renderer.getActiveMipmapLevel(),ga=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,i,c,a),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Xc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Wc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(fa,pa,ma),this._renderer.xr.enabled=ga,e.scissorTest=!1,Xr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===xs||e.mapping===bs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),fa=this._renderer.getRenderTarget(),pa=this._renderer.getActiveCubeFace(),ma=this._renderer.getActiveMipmapLevel(),ga=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:An,minFilter:An,generateMipmaps:!1,type:dr,format:Cn,colorSpace:ys,depthBuffer:!1},i=Hc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Hc(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=sA(r)),this._blurMaterial=rA(r,e,t)}return i}_compileMaterial(e){const t=new lt(this._lodPlanes[0],e);this._renderer.compile(t,ua)}_sceneToCubeUV(e,t,n,i,r){const c=new Sn(90,1,t,n),h=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],l=this._renderer,d=l.autoClear,f=l.toneMapping;l.getClearColor(zc),l.toneMapping=pi,l.autoClear=!1,l.state.buffers.depth.getReversed()&&(l.setRenderTarget(i),l.clearDepth(),l.setRenderTarget(null));const g=new Ht({name:"PMREM.Background",side:tn,depthWrite:!1,depthTest:!1}),p=new lt(new Bn,g);let m=!1;const M=e.background;M?M.isColor&&(g.color.copy(M),e.background=null,m=!0):(g.color.copy(zc),m=!0);for(let S=0;S<6;S++){const y=S%3;y===0?(c.up.set(0,h[S],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+u[S],r.y,r.z)):y===1?(c.up.set(0,0,h[S]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+u[S],r.z)):(c.up.set(0,h[S],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+u[S]));const D=this._cubeSize;Xr(i,y*D,S>2?D:0,D,D),l.setRenderTarget(i),m&&l.render(p,c),l.render(e,c)}p.geometry.dispose(),p.material.dispose(),l.toneMapping=f,l.autoClear=d,e.background=M}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===xs||e.mapping===bs;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Xc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Wc());const r=i?this._cubemapMaterial:this._equirectMaterial,o=new lt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const c=this._cubeSize;Xr(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,ua)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Vc[(i-r-1)%Vc.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",r),this._halfBlur(o,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,o,a){const c=this._renderer,h=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,l=new lt(this._lodPlanes[i],h),d=h.uniforms,f=this._sizeLods[n]-1,A=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Pi-1),g=r/A,p=isFinite(r)?1+Math.floor(u*g):Pi;p>Pi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Pi}`);const m=[];let M=0;for(let E=0;E<Pi;++E){const R=E/g,x=Math.exp(-R*R/2);m.push(x),E===0?M+=x:E<p&&(M+=2*x)}for(let E=0;E<m.length;E++)m[E]=m[E]/M;d.envMap.value=e.texture,d.samples.value=p,d.weights.value=m,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:S}=this;d.dTheta.value=A,d.mipInt.value=S-n;const y=this._sizeLods[i],D=3*y*(i>S-fs?i-S+fs:0),v=4*(this._cubeSize-y);Xr(t,D,v,3*y,2*y),c.setRenderTarget(t),c.render(l,ua)}}function sA(s){const e=[],t=[],n=[];let i=s;const r=s-fs+1+Oc.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);t.push(a);let c=1/a;o>s-fs?c=Oc[o-s+fs-1]:o===0&&(c=0),n.push(c);const h=1/(a-2),u=-h,l=1+h,d=[u,u,l,u,l,l,u,u,l,l,u,l],f=6,A=6,g=3,p=2,m=1,M=new Float32Array(g*A*f),S=new Float32Array(p*A*f),y=new Float32Array(m*A*f);for(let v=0;v<f;v++){const E=v%3*2/3-1,R=v>2?0:-1,x=[E,R,0,E+2/3,R,0,E+2/3,R+1,0,E,R,0,E+2/3,R+1,0,E,R+1,0];M.set(x,g*A*v),S.set(d,p*A*v);const b=[v,v,v,v,v,v];y.set(b,m*A*v)}const D=new dn;D.setAttribute("position",new Jt(M,g)),D.setAttribute("uv",new Jt(S,p)),D.setAttribute("faceIndex",new Jt(y,m)),e.push(D),i>fs&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Hc(s,e,t){const n=new ki(s,e,t);return n.texture.mapping=Mo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Xr(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function rA(s,e,t){const n=new Float32Array(Pi),i=new H(0,1,0);return new Gn({name:"SphericalGaussianBlur",defines:{n:Pi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Fl(),fragmentShader:`

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
		`,blending:fi,depthTest:!1,depthWrite:!1})}function Wc(){return new Gn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Fl(),fragmentShader:`

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
		`,blending:fi,depthTest:!1,depthWrite:!1})}function Xc(){return new Gn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Fl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:fi,depthTest:!1,depthWrite:!1})}function Fl(){return`

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
	`}function oA(s){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const c=a.mapping,h=c===ka||c===Oa,u=c===xs||c===bs;if(h||u){let l=e.get(a);const d=l!==void 0?l.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new Gc(s)),l=h?t.fromEquirectangular(a,l):t.fromCubemap(a,l),l.texture.pmremVersion=a.pmremVersion,e.set(a,l),l.texture;if(l!==void 0)return l.texture;{const f=a.image;return h&&f&&f.height>0||u&&f&&i(f)?(t===null&&(t=new Gc(s)),l=h?t.fromEquirectangular(a):t.fromCubemap(a),l.texture.pmremVersion=a.pmremVersion,e.set(a,l),a.addEventListener("dispose",r),l.texture):null}}}return a}function i(a){let c=0;const h=6;for(let u=0;u<h;u++)a[u]!==void 0&&c++;return c===h}function r(a){const c=a.target;c.removeEventListener("dispose",r);const h=e.get(c);h!==void 0&&(e.delete(c),h.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function aA(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&lr("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function lA(s,e,t,n){const i={},r=new WeakMap;function o(l){const d=l.target;d.index!==null&&e.remove(d.index);for(const A in d.attributes)e.remove(d.attributes[A]);d.removeEventListener("dispose",o),delete i[d.id];const f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(l,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,t.memory.geometries++),d}function c(l){const d=l.attributes;for(const f in d)e.update(d[f],s.ARRAY_BUFFER)}function h(l){const d=[],f=l.index,A=l.attributes.position;let g=0;if(f!==null){const M=f.array;g=f.version;for(let S=0,y=M.length;S<y;S+=3){const D=M[S+0],v=M[S+1],E=M[S+2];d.push(D,v,v,E,E,D)}}else if(A!==void 0){const M=A.array;g=A.version;for(let S=0,y=M.length/3-1;S<y;S+=3){const D=S+0,v=S+1,E=S+2;d.push(D,v,v,E,E,D)}}else return;const p=new(Ed(d)?Cd:Td)(d,1);p.version=g;const m=r.get(l);m&&e.remove(m),r.set(l,p)}function u(l){const d=r.get(l);if(d){const f=l.index;f!==null&&d.version<f.version&&h(l)}else h(l);return r.get(l)}return{get:a,update:c,getWireframeAttribute:u}}function cA(s,e,t){let n;function i(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function c(d,f){s.drawElements(n,f,r,d*o),t.update(f,n,1)}function h(d,f,A){A!==0&&(s.drawElementsInstanced(n,f,r,d*o,A),t.update(f,n,A))}function u(d,f,A){if(A===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,A);let p=0;for(let m=0;m<A;m++)p+=f[m];t.update(p,n,1)}function l(d,f,A,g){if(A===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<d.length;m++)h(d[m]/o,f[m],g[m]);else{p.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,g,0,A);let m=0;for(let M=0;M<A;M++)m+=f[M]*g[M];t.update(m,n,1)}}this.setMode=i,this.setIndex=a,this.render=c,this.renderInstances=h,this.renderMultiDraw=u,this.renderMultiDrawInstances=l}function hA(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case s.TRIANGLES:t.triangles+=a*(r/3);break;case s.LINES:t.lines+=a*(r/2);break;case s.LINE_STRIP:t.lines+=a*(r-1);break;case s.LINE_LOOP:t.lines+=a*r;break;case s.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function dA(s,e,t){const n=new WeakMap,i=new Ut;function r(o,a,c){const h=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,l=u!==void 0?u.length:0;let d=n.get(a);if(d===void 0||d.count!==l){let x=function(){E.dispose(),n.delete(a),a.removeEventListener("dispose",x)};d!==void 0&&d.texture.dispose();const f=a.morphAttributes.position!==void 0,A=a.morphAttributes.normal!==void 0,g=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],M=a.morphAttributes.color||[];let S=0;f===!0&&(S=1),A===!0&&(S=2),g===!0&&(S=3);let y=a.attributes.position.count*S,D=1;y>e.maxTextureSize&&(D=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);const v=new Float32Array(y*D*4*l),E=new Rl(v,y,D,l);E.type=$n,E.needsUpdate=!0;const R=S*4;for(let b=0;b<l;b++){const I=p[b],P=m[b],k=M[b],G=y*D*4*b;for(let W=0;W<I.count;W++){const B=W*R;f===!0&&(i.fromBufferAttribute(I,W),v[G+B+0]=i.x,v[G+B+1]=i.y,v[G+B+2]=i.z,v[G+B+3]=0),A===!0&&(i.fromBufferAttribute(P,W),v[G+B+4]=i.x,v[G+B+5]=i.y,v[G+B+6]=i.z,v[G+B+7]=0),g===!0&&(i.fromBufferAttribute(k,W),v[G+B+8]=i.x,v[G+B+9]=i.y,v[G+B+10]=i.z,v[G+B+11]=k.itemSize===4?i.w:1)}}d={count:l,texture:E,size:new tt(y,D)},n.set(a,d),a.addEventListener("dispose",x)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(s,"morphTexture",o.morphTexture,t);else{let f=0;for(let g=0;g<h.length;g++)f+=h[g];const A=a.morphTargetsRelative?1:1-f;c.getUniforms().setValue(s,"morphTargetBaseInfluence",A),c.getUniforms().setValue(s,"morphTargetInfluences",h)}c.getUniforms().setValue(s,"morphTargetsTexture",d.texture,t),c.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function uA(s,e,t,n){let i=new WeakMap;function r(c){const h=n.render.frame,u=c.geometry,l=e.get(c,u);if(i.get(l)!==h&&(e.update(l),i.set(l,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),i.get(c)!==h&&(t.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,s.ARRAY_BUFFER),i.set(c,h))),c.isSkinnedMesh){const d=c.skeleton;i.get(d)!==h&&(d.update(),i.set(d,h))}return l}function o(){i=new WeakMap}function a(c){const h=c.target;h.removeEventListener("dispose",a),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:r,dispose:o}}const kd=new sn,Yc=new Nd(1,1),Od=new Rl,zd=new Vp,Vd=new Ld,qc=[],Kc=[],Qc=new Float32Array(16),jc=new Float32Array(9),Jc=new Float32Array(4);function Ts(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=qc[i];if(r===void 0&&(r=new Float32Array(i),qc[i]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,s[o].toArray(r,a)}return r}function Ot(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function zt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function wo(s,e){let t=Kc[e];t===void 0&&(t=new Int32Array(e),Kc[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function fA(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function pA(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ot(t,e))return;s.uniform2fv(this.addr,e),zt(t,e)}}function mA(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ot(t,e))return;s.uniform3fv(this.addr,e),zt(t,e)}}function gA(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ot(t,e))return;s.uniform4fv(this.addr,e),zt(t,e)}}function AA(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ot(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),zt(t,e)}else{if(Ot(t,n))return;Jc.set(n),s.uniformMatrix2fv(this.addr,!1,Jc),zt(t,n)}}function vA(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ot(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),zt(t,e)}else{if(Ot(t,n))return;jc.set(n),s.uniformMatrix3fv(this.addr,!1,jc),zt(t,n)}}function _A(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ot(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),zt(t,e)}else{if(Ot(t,n))return;Qc.set(n),s.uniformMatrix4fv(this.addr,!1,Qc),zt(t,n)}}function xA(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function bA(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ot(t,e))return;s.uniform2iv(this.addr,e),zt(t,e)}}function yA(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ot(t,e))return;s.uniform3iv(this.addr,e),zt(t,e)}}function MA(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ot(t,e))return;s.uniform4iv(this.addr,e),zt(t,e)}}function EA(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function SA(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ot(t,e))return;s.uniform2uiv(this.addr,e),zt(t,e)}}function wA(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ot(t,e))return;s.uniform3uiv(this.addr,e),zt(t,e)}}function TA(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ot(t,e))return;s.uniform4uiv(this.addr,e),zt(t,e)}}function CA(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(Yc.compareFunction=Md,r=Yc):r=kd,t.setTexture2D(e||r,i)}function RA(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||zd,i)}function DA(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Vd,i)}function LA(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Od,i)}function IA(s){switch(s){case 5126:return fA;case 35664:return pA;case 35665:return mA;case 35666:return gA;case 35674:return AA;case 35675:return vA;case 35676:return _A;case 5124:case 35670:return xA;case 35667:case 35671:return bA;case 35668:case 35672:return yA;case 35669:case 35673:return MA;case 5125:return EA;case 36294:return SA;case 36295:return wA;case 36296:return TA;case 35678:case 36198:case 36298:case 36306:case 35682:return CA;case 35679:case 36299:case 36307:return RA;case 35680:case 36300:case 36308:case 36293:return DA;case 36289:case 36303:case 36311:case 36292:return LA}}function PA(s,e){s.uniform1fv(this.addr,e)}function UA(s,e){const t=Ts(e,this.size,2);s.uniform2fv(this.addr,t)}function NA(s,e){const t=Ts(e,this.size,3);s.uniform3fv(this.addr,t)}function FA(s,e){const t=Ts(e,this.size,4);s.uniform4fv(this.addr,t)}function BA(s,e){const t=Ts(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function kA(s,e){const t=Ts(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function OA(s,e){const t=Ts(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function zA(s,e){s.uniform1iv(this.addr,e)}function VA(s,e){s.uniform2iv(this.addr,e)}function GA(s,e){s.uniform3iv(this.addr,e)}function HA(s,e){s.uniform4iv(this.addr,e)}function WA(s,e){s.uniform1uiv(this.addr,e)}function XA(s,e){s.uniform2uiv(this.addr,e)}function YA(s,e){s.uniform3uiv(this.addr,e)}function qA(s,e){s.uniform4uiv(this.addr,e)}function KA(s,e,t){const n=this.cache,i=e.length,r=wo(t,i);Ot(n,r)||(s.uniform1iv(this.addr,r),zt(n,r));for(let o=0;o!==i;++o)t.setTexture2D(e[o]||kd,r[o])}function QA(s,e,t){const n=this.cache,i=e.length,r=wo(t,i);Ot(n,r)||(s.uniform1iv(this.addr,r),zt(n,r));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||zd,r[o])}function jA(s,e,t){const n=this.cache,i=e.length,r=wo(t,i);Ot(n,r)||(s.uniform1iv(this.addr,r),zt(n,r));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||Vd,r[o])}function JA(s,e,t){const n=this.cache,i=e.length,r=wo(t,i);Ot(n,r)||(s.uniform1iv(this.addr,r),zt(n,r));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||Od,r[o])}function ZA(s){switch(s){case 5126:return PA;case 35664:return UA;case 35665:return NA;case 35666:return FA;case 35674:return BA;case 35675:return kA;case 35676:return OA;case 5124:case 35670:return zA;case 35667:case 35671:return VA;case 35668:case 35672:return GA;case 35669:case 35673:return HA;case 5125:return WA;case 36294:return XA;case 36295:return YA;case 36296:return qA;case 35678:case 36198:case 36298:case 36306:case 35682:return KA;case 35679:case 36299:case 36307:return QA;case 35680:case 36300:case 36308:case 36293:return jA;case 36289:case 36303:case 36311:case 36292:return JA}}class $A{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=IA(t.type)}}class ev{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ZA(t.type)}}class tv{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(e,t[a.id],n)}}}const Aa=/(\w+)(\])?(\[|\.)?/g;function Zc(s,e){s.seq.push(e),s.map[e.id]=e}function nv(s,e,t){const n=s.name,i=n.length;for(Aa.lastIndex=0;;){const r=Aa.exec(n),o=Aa.lastIndex;let a=r[1];const c=r[2]==="]",h=r[3];if(c&&(a=a|0),h===void 0||h==="["&&o+2===i){Zc(t,h===void 0?new $A(a,s,e):new ev(a,s,e));break}else{let l=t.map[a];l===void 0&&(l=new tv(a),Zc(t,l)),t=l}}}class uo{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=e.getActiveUniform(t,i),o=e.getUniformLocation(t,r.name);nv(r,o,this)}}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,o=t.length;r!==o;++r){const a=t[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const o=e[i];o.id in t&&n.push(o)}return n}}function $c(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const iv=37297;let sv=0;function rv(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}const eh=new Je;function ov(s){dt._getMatrix(eh,dt.workingColorSpace,s);const e=`mat3( ${eh.elements.map(t=>t.toFixed(4))} )`;switch(dt.getTransfer(s)){case mo:return[e,"LinearTransferOETF"];case xt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function th(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),r=(s.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+rv(s.getShaderSource(e),a)}else return r}function av(s,e){const t=ov(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function lv(s,e){let t;switch(e){case Zf:t="Linear";break;case $f:t="Reinhard";break;case ep:t="Cineon";break;case tp:t="ACESFilmic";break;case ip:t="AgX";break;case sp:t="Neutral";break;case np:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Yr=new H;function cv(){dt.getLuminanceCoefficients(Yr);const s=Yr.x.toFixed(4),e=Yr.y.toFixed(4),t=Yr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function hv(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Qs).join(`
`)}function dv(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function uv(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:s.getAttribLocation(e,o),locationSize:a}}return t}function Qs(s){return s!==""}function nh(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ih(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const fv=/^[ \t]*#include +<([\w\d./]+)>/gm;function gl(s){return s.replace(fv,mv)}const pv=new Map;function mv(s,e){let t=Ze[e];if(t===void 0){const n=pv.get(e);if(n!==void 0)t=Ze[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return gl(t)}const gv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function sh(s){return s.replace(gv,Av)}function Av(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function rh(s){let e=`precision ${s.precision} float;
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
#define LOW_PRECISION`),e}function vv(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===ud?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===Lf?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Jn&&(e="SHADOWMAP_TYPE_VSM"),e}function _v(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case xs:case bs:e="ENVMAP_TYPE_CUBE";break;case Mo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function xv(s){let e="ENVMAP_MODE_REFLECTION";return s.envMap&&s.envMapMode===bs&&(e="ENVMAP_MODE_REFRACTION"),e}function bv(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case fd:e="ENVMAP_BLENDING_MULTIPLY";break;case jf:e="ENVMAP_BLENDING_MIX";break;case Jf:e="ENVMAP_BLENDING_ADD";break}return e}function yv(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Mv(s,e,t,n){const i=s.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const c=vv(t),h=_v(t),u=xv(t),l=bv(t),d=yv(t),f=hv(t),A=dv(r),g=i.createProgram();let p,m,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,A].filter(Qs).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,A].filter(Qs).join(`
`),m.length>0&&(m+=`
`)):(p=[rh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,A,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Qs).join(`
`),m=[rh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,A,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",t.envMap?"#define "+l:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==pi?"#define TONE_MAPPING":"",t.toneMapping!==pi?Ze.tonemapping_pars_fragment:"",t.toneMapping!==pi?lv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ze.colorspace_pars_fragment,av("linearToOutputTexel",t.outputColorSpace),cv(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Qs).join(`
`)),o=gl(o),o=nh(o,t),o=ih(o,t),a=gl(a),a=nh(a,t),a=ih(a,t),o=sh(o),a=sh(a),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",t.glslVersion===go?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===go?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const S=M+p+o,y=M+m+a,D=$c(i,i.VERTEX_SHADER,S),v=$c(i,i.FRAGMENT_SHADER,y);i.attachShader(g,D),i.attachShader(g,v),t.index0AttributeName!==void 0?i.bindAttribLocation(g,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(g,0,"position"),i.linkProgram(g);function E(I){if(s.debug.checkShaderErrors){const P=i.getProgramInfoLog(g)||"",k=i.getShaderInfoLog(D)||"",G=i.getShaderInfoLog(v)||"",W=P.trim(),B=k.trim(),Y=G.trim();let O=!0,ie=!0;if(i.getProgramParameter(g,i.LINK_STATUS)===!1)if(O=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,g,D,v);else{const re=th(i,D,"vertex"),Ae=th(i,v,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(g,i.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+W+`
`+re+`
`+Ae)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):(B===""||Y==="")&&(ie=!1);ie&&(I.diagnostics={runnable:O,programLog:W,vertexShader:{log:B,prefix:p},fragmentShader:{log:Y,prefix:m}})}i.deleteShader(D),i.deleteShader(v),R=new uo(i,g),x=uv(i,g)}let R;this.getUniforms=function(){return R===void 0&&E(this),R};let x;this.getAttributes=function(){return x===void 0&&E(this),x};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=i.getProgramParameter(g,iv)),b},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(g),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=sv++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=D,this.fragmentShader=v,this}let Ev=0;class Sv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new wv(e),t.set(e,n)),n}}class wv{constructor(e){this.id=Ev++,this.code=e,this.usedTimes=0}}function Tv(s,e,t,n,i,r,o){const a=new Sd,c=new Sv,h=new Set,u=[],l=i.logarithmicDepthBuffer,d=i.vertexTextures;let f=i.precision;const A={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(x){return h.add(x),x===0?"uv":`uv${x}`}function p(x,b,I,P,k){const G=P.fog,W=k.geometry,B=x.isMeshStandardMaterial?P.environment:null,Y=(x.isMeshStandardMaterial?t:e).get(x.envMap||B),O=Y&&Y.mapping===Mo?Y.image.height:null,ie=A[x.type];x.precision!==null&&(f=i.getMaxPrecision(x.precision),f!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",f,"instead."));const re=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Ae=re!==void 0?re.length:0;let Ve=0;W.morphAttributes.position!==void 0&&(Ve=1),W.morphAttributes.normal!==void 0&&(Ve=2),W.morphAttributes.color!==void 0&&(Ve=3);let Me,Q,De,q;if(ie){const rt=On[ie];Me=rt.vertexShader,Q=rt.fragmentShader}else Me=x.vertexShader,Q=x.fragmentShader,c.update(x),De=c.getVertexShaderID(x),q=c.getFragmentShaderID(x);const $=s.getRenderTarget(),oe=s.state.buffers.depth.getReversed(),fe=k.isInstancedMesh===!0,he=k.isBatchedMesh===!0,Ue=!!x.map,mt=!!x.matcap,U=!!Y,ft=!!x.aoMap,We=!!x.lightMap,Le=!!x.bumpMap,ve=!!x.normalMap,Qe=!!x.displacementMap,Te=!!x.emissiveMap,ze=!!x.metalnessMap,yt=!!x.roughnessMap,Ct=x.anisotropy>0,L=x.clearcoat>0,w=x.dispersion>0,T=x.iridescence>0,j=x.sheen>0,ne=x.transmission>0,J=Ct&&!!x.anisotropyMap,xe=L&&!!x.clearcoatMap,de=L&&!!x.clearcoatNormalMap,Ie=L&&!!x.clearcoatRoughnessMap,Se=T&&!!x.iridescenceMap,se=T&&!!x.iridescenceThicknessMap,ye=j&&!!x.sheenColorMap,Ge=j&&!!x.sheenRoughnessMap,Pe=!!x.specularMap,ge=!!x.specularColorMap,Ye=!!x.specularIntensityMap,F=ne&&!!x.transmissionMap,ae=ne&&!!x.thicknessMap,ue=!!x.gradientMap,Ce=!!x.alphaMap,te=x.alphaTest>0,Z=!!x.alphaHash,Ee=!!x.extensions;let He=pi;x.toneMapped&&($===null||$.isXRRenderTarget===!0)&&(He=s.toneMapping);const et={shaderID:ie,shaderType:x.type,shaderName:x.name,vertexShader:Me,fragmentShader:Q,defines:x.defines,customVertexShaderID:De,customFragmentShaderID:q,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:f,batching:he,batchingColor:he&&k._colorsTexture!==null,instancing:fe,instancingColor:fe&&k.instanceColor!==null,instancingMorph:fe&&k.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:$===null?s.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:ys,alphaToCoverage:!!x.alphaToCoverage,map:Ue,matcap:mt,envMap:U,envMapMode:U&&Y.mapping,envMapCubeUVHeight:O,aoMap:ft,lightMap:We,bumpMap:Le,normalMap:ve,displacementMap:d&&Qe,emissiveMap:Te,normalMapObjectSpace:ve&&x.normalMapType===cp,normalMapTangentSpace:ve&&x.normalMapType===lp,metalnessMap:ze,roughnessMap:yt,anisotropy:Ct,anisotropyMap:J,clearcoat:L,clearcoatMap:xe,clearcoatNormalMap:de,clearcoatRoughnessMap:Ie,dispersion:w,iridescence:T,iridescenceMap:Se,iridescenceThicknessMap:se,sheen:j,sheenColorMap:ye,sheenRoughnessMap:Ge,specularMap:Pe,specularColorMap:ge,specularIntensityMap:Ye,transmission:ne,transmissionMap:F,thicknessMap:ae,gradientMap:ue,opaque:x.transparent===!1&&x.blending===gs&&x.alphaToCoverage===!1,alphaMap:Ce,alphaTest:te,alphaHash:Z,combine:x.combine,mapUv:Ue&&g(x.map.channel),aoMapUv:ft&&g(x.aoMap.channel),lightMapUv:We&&g(x.lightMap.channel),bumpMapUv:Le&&g(x.bumpMap.channel),normalMapUv:ve&&g(x.normalMap.channel),displacementMapUv:Qe&&g(x.displacementMap.channel),emissiveMapUv:Te&&g(x.emissiveMap.channel),metalnessMapUv:ze&&g(x.metalnessMap.channel),roughnessMapUv:yt&&g(x.roughnessMap.channel),anisotropyMapUv:J&&g(x.anisotropyMap.channel),clearcoatMapUv:xe&&g(x.clearcoatMap.channel),clearcoatNormalMapUv:de&&g(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ie&&g(x.clearcoatRoughnessMap.channel),iridescenceMapUv:Se&&g(x.iridescenceMap.channel),iridescenceThicknessMapUv:se&&g(x.iridescenceThicknessMap.channel),sheenColorMapUv:ye&&g(x.sheenColorMap.channel),sheenRoughnessMapUv:Ge&&g(x.sheenRoughnessMap.channel),specularMapUv:Pe&&g(x.specularMap.channel),specularColorMapUv:ge&&g(x.specularColorMap.channel),specularIntensityMapUv:Ye&&g(x.specularIntensityMap.channel),transmissionMapUv:F&&g(x.transmissionMap.channel),thicknessMapUv:ae&&g(x.thicknessMap.channel),alphaMapUv:Ce&&g(x.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(ve||Ct),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!W.attributes.uv&&(Ue||Ce),fog:!!G,useFog:x.fog===!0,fogExp2:!!G&&G.isFogExp2,flatShading:x.flatShading===!0&&x.wireframe===!1,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:l,reversedDepthBuffer:oe,skinning:k.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:Ae,morphTextureStride:Ve,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:x.dithering,shadowMapEnabled:s.shadowMap.enabled&&I.length>0,shadowMapType:s.shadowMap.type,toneMapping:He,decodeVideoTexture:Ue&&x.map.isVideoTexture===!0&&dt.getTransfer(x.map.colorSpace)===xt,decodeVideoTextureEmissive:Te&&x.emissiveMap.isVideoTexture===!0&&dt.getTransfer(x.emissiveMap.colorSpace)===xt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===ln,flipSided:x.side===tn,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:Ee&&x.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ee&&x.extensions.multiDraw===!0||he)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return et.vertexUv1s=h.has(1),et.vertexUv2s=h.has(2),et.vertexUv3s=h.has(3),h.clear(),et}function m(x){const b=[];if(x.shaderID?b.push(x.shaderID):(b.push(x.customVertexShaderID),b.push(x.customFragmentShaderID)),x.defines!==void 0)for(const I in x.defines)b.push(I),b.push(x.defines[I]);return x.isRawShaderMaterial===!1&&(M(b,x),S(b,x),b.push(s.outputColorSpace)),b.push(x.customProgramCacheKey),b.join()}function M(x,b){x.push(b.precision),x.push(b.outputColorSpace),x.push(b.envMapMode),x.push(b.envMapCubeUVHeight),x.push(b.mapUv),x.push(b.alphaMapUv),x.push(b.lightMapUv),x.push(b.aoMapUv),x.push(b.bumpMapUv),x.push(b.normalMapUv),x.push(b.displacementMapUv),x.push(b.emissiveMapUv),x.push(b.metalnessMapUv),x.push(b.roughnessMapUv),x.push(b.anisotropyMapUv),x.push(b.clearcoatMapUv),x.push(b.clearcoatNormalMapUv),x.push(b.clearcoatRoughnessMapUv),x.push(b.iridescenceMapUv),x.push(b.iridescenceThicknessMapUv),x.push(b.sheenColorMapUv),x.push(b.sheenRoughnessMapUv),x.push(b.specularMapUv),x.push(b.specularColorMapUv),x.push(b.specularIntensityMapUv),x.push(b.transmissionMapUv),x.push(b.thicknessMapUv),x.push(b.combine),x.push(b.fogExp2),x.push(b.sizeAttenuation),x.push(b.morphTargetsCount),x.push(b.morphAttributeCount),x.push(b.numDirLights),x.push(b.numPointLights),x.push(b.numSpotLights),x.push(b.numSpotLightMaps),x.push(b.numHemiLights),x.push(b.numRectAreaLights),x.push(b.numDirLightShadows),x.push(b.numPointLightShadows),x.push(b.numSpotLightShadows),x.push(b.numSpotLightShadowsWithMaps),x.push(b.numLightProbes),x.push(b.shadowMapType),x.push(b.toneMapping),x.push(b.numClippingPlanes),x.push(b.numClipIntersection),x.push(b.depthPacking)}function S(x,b){a.disableAll(),b.supportsVertexTextures&&a.enable(0),b.instancing&&a.enable(1),b.instancingColor&&a.enable(2),b.instancingMorph&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),b.dispersion&&a.enable(20),b.batchingColor&&a.enable(21),b.gradientMap&&a.enable(22),x.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.reversedDepthBuffer&&a.enable(4),b.skinning&&a.enable(5),b.morphTargets&&a.enable(6),b.morphNormals&&a.enable(7),b.morphColors&&a.enable(8),b.premultipliedAlpha&&a.enable(9),b.shadowMapEnabled&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.decodeVideoTextureEmissive&&a.enable(20),b.alphaToCoverage&&a.enable(21),x.push(a.mask)}function y(x){const b=A[x.type];let I;if(b){const P=On[b];I=tm.clone(P.uniforms)}else I=x.uniforms;return I}function D(x,b){let I;for(let P=0,k=u.length;P<k;P++){const G=u[P];if(G.cacheKey===b){I=G,++I.usedTimes;break}}return I===void 0&&(I=new Mv(s,b,x,r),u.push(I)),I}function v(x){if(--x.usedTimes===0){const b=u.indexOf(x);u[b]=u[u.length-1],u.pop(),x.destroy()}}function E(x){c.remove(x)}function R(){c.dispose()}return{getParameters:p,getProgramCacheKey:m,getUniforms:y,acquireProgram:D,releaseProgram:v,releaseShaderCache:E,programs:u,dispose:R}}function Cv(){let s=new WeakMap;function e(o){return s.has(o)}function t(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,c){s.get(o)[a]=c}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function Rv(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function oh(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function ah(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function o(l,d,f,A,g,p){let m=s[e];return m===void 0?(m={id:l.id,object:l,geometry:d,material:f,groupOrder:A,renderOrder:l.renderOrder,z:g,group:p},s[e]=m):(m.id=l.id,m.object=l,m.geometry=d,m.material=f,m.groupOrder=A,m.renderOrder=l.renderOrder,m.z=g,m.group=p),e++,m}function a(l,d,f,A,g,p){const m=o(l,d,f,A,g,p);f.transmission>0?n.push(m):f.transparent===!0?i.push(m):t.push(m)}function c(l,d,f,A,g,p){const m=o(l,d,f,A,g,p);f.transmission>0?n.unshift(m):f.transparent===!0?i.unshift(m):t.unshift(m)}function h(l,d){t.length>1&&t.sort(l||Rv),n.length>1&&n.sort(d||oh),i.length>1&&i.sort(d||oh)}function u(){for(let l=e,d=s.length;l<d;l++){const f=s[l];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:a,unshift:c,finish:u,sort:h}}function Dv(){let s=new WeakMap;function e(n,i){const r=s.get(n);let o;return r===void 0?(o=new ah,s.set(n,[o])):i>=r.length?(o=new ah,r.push(o)):o=r[i],o}function t(){s=new WeakMap}return{get:e,dispose:t}}function Lv(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new H,color:new $e};break;case"SpotLight":t={position:new H,direction:new H,color:new $e,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new H,color:new $e,distance:0,decay:0};break;case"HemisphereLight":t={direction:new H,skyColor:new $e,groundColor:new $e};break;case"RectAreaLight":t={color:new $e,position:new H,halfWidth:new H,halfHeight:new H};break}return s[e.id]=t,t}}}function Iv(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let Pv=0;function Uv(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function Nv(s){const e=new Lv,t=Iv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)n.probe.push(new H);const i=new H,r=new Bt,o=new Bt;function a(h){let u=0,l=0,d=0;for(let x=0;x<9;x++)n.probe[x].set(0,0,0);let f=0,A=0,g=0,p=0,m=0,M=0,S=0,y=0,D=0,v=0,E=0;h.sort(Uv);for(let x=0,b=h.length;x<b;x++){const I=h[x],P=I.color,k=I.intensity,G=I.distance,W=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)u+=P.r*k,l+=P.g*k,d+=P.b*k;else if(I.isLightProbe){for(let B=0;B<9;B++)n.probe[B].addScaledVector(I.sh.coefficients[B],k);E++}else if(I.isDirectionalLight){const B=e.get(I);if(B.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){const Y=I.shadow,O=t.get(I);O.shadowIntensity=Y.intensity,O.shadowBias=Y.bias,O.shadowNormalBias=Y.normalBias,O.shadowRadius=Y.radius,O.shadowMapSize=Y.mapSize,n.directionalShadow[f]=O,n.directionalShadowMap[f]=W,n.directionalShadowMatrix[f]=I.shadow.matrix,M++}n.directional[f]=B,f++}else if(I.isSpotLight){const B=e.get(I);B.position.setFromMatrixPosition(I.matrixWorld),B.color.copy(P).multiplyScalar(k),B.distance=G,B.coneCos=Math.cos(I.angle),B.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),B.decay=I.decay,n.spot[g]=B;const Y=I.shadow;if(I.map&&(n.spotLightMap[D]=I.map,D++,Y.updateMatrices(I),I.castShadow&&v++),n.spotLightMatrix[g]=Y.matrix,I.castShadow){const O=t.get(I);O.shadowIntensity=Y.intensity,O.shadowBias=Y.bias,O.shadowNormalBias=Y.normalBias,O.shadowRadius=Y.radius,O.shadowMapSize=Y.mapSize,n.spotShadow[g]=O,n.spotShadowMap[g]=W,y++}g++}else if(I.isRectAreaLight){const B=e.get(I);B.color.copy(P).multiplyScalar(k),B.halfWidth.set(I.width*.5,0,0),B.halfHeight.set(0,I.height*.5,0),n.rectArea[p]=B,p++}else if(I.isPointLight){const B=e.get(I);if(B.color.copy(I.color).multiplyScalar(I.intensity),B.distance=I.distance,B.decay=I.decay,I.castShadow){const Y=I.shadow,O=t.get(I);O.shadowIntensity=Y.intensity,O.shadowBias=Y.bias,O.shadowNormalBias=Y.normalBias,O.shadowRadius=Y.radius,O.shadowMapSize=Y.mapSize,O.shadowCameraNear=Y.camera.near,O.shadowCameraFar=Y.camera.far,n.pointShadow[A]=O,n.pointShadowMap[A]=W,n.pointShadowMatrix[A]=I.shadow.matrix,S++}n.point[A]=B,A++}else if(I.isHemisphereLight){const B=e.get(I);B.skyColor.copy(I.color).multiplyScalar(k),B.groundColor.copy(I.groundColor).multiplyScalar(k),n.hemi[m]=B,m++}}p>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=be.LTC_FLOAT_1,n.rectAreaLTC2=be.LTC_FLOAT_2):(n.rectAreaLTC1=be.LTC_HALF_1,n.rectAreaLTC2=be.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=l,n.ambient[2]=d;const R=n.hash;(R.directionalLength!==f||R.pointLength!==A||R.spotLength!==g||R.rectAreaLength!==p||R.hemiLength!==m||R.numDirectionalShadows!==M||R.numPointShadows!==S||R.numSpotShadows!==y||R.numSpotMaps!==D||R.numLightProbes!==E)&&(n.directional.length=f,n.spot.length=g,n.rectArea.length=p,n.point.length=A,n.hemi.length=m,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=y+D-v,n.spotLightMap.length=D,n.numSpotLightShadowsWithMaps=v,n.numLightProbes=E,R.directionalLength=f,R.pointLength=A,R.spotLength=g,R.rectAreaLength=p,R.hemiLength=m,R.numDirectionalShadows=M,R.numPointShadows=S,R.numSpotShadows=y,R.numSpotMaps=D,R.numLightProbes=E,n.version=Pv++)}function c(h,u){let l=0,d=0,f=0,A=0,g=0;const p=u.matrixWorldInverse;for(let m=0,M=h.length;m<M;m++){const S=h[m];if(S.isDirectionalLight){const y=n.directional[l];y.direction.setFromMatrixPosition(S.matrixWorld),i.setFromMatrixPosition(S.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(p),l++}else if(S.isSpotLight){const y=n.spot[f];y.position.setFromMatrixPosition(S.matrixWorld),y.position.applyMatrix4(p),y.direction.setFromMatrixPosition(S.matrixWorld),i.setFromMatrixPosition(S.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(p),f++}else if(S.isRectAreaLight){const y=n.rectArea[A];y.position.setFromMatrixPosition(S.matrixWorld),y.position.applyMatrix4(p),o.identity(),r.copy(S.matrixWorld),r.premultiply(p),o.extractRotation(r),y.halfWidth.set(S.width*.5,0,0),y.halfHeight.set(0,S.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),A++}else if(S.isPointLight){const y=n.point[d];y.position.setFromMatrixPosition(S.matrixWorld),y.position.applyMatrix4(p),d++}else if(S.isHemisphereLight){const y=n.hemi[g];y.direction.setFromMatrixPosition(S.matrixWorld),y.direction.transformDirection(p),g++}}}return{setup:a,setupView:c,state:n}}function lh(s){const e=new Nv(s),t=[],n=[];function i(u){h.camera=u,t.length=0,n.length=0}function r(u){t.push(u)}function o(u){n.push(u)}function a(){e.setup(t)}function c(u){e.setupView(t,u)}const h={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:h,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function Fv(s){let e=new WeakMap;function t(i,r=0){const o=e.get(i);let a;return o===void 0?(a=new lh(s),e.set(i,[a])):r>=o.length?(a=new lh(s),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}const Bv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,kv=`uniform sampler2D shadow_pass;
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
}`;function Ov(s,e,t){let n=new Ud;const i=new tt,r=new tt,o=new Ut,a=new dm({depthPacking:ap}),c=new um,h={},u=t.maxTextureSize,l={[ni]:tn,[tn]:ni,[ln]:ln},d=new Gn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new tt},radius:{value:4}},vertexShader:Bv,fragmentShader:kv}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const A=new dn;A.setAttribute("position",new Jt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new lt(A,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ud;let m=this.type;this.render=function(v,E,R){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||v.length===0)return;const x=s.getRenderTarget(),b=s.getActiveCubeFace(),I=s.getActiveMipmapLevel(),P=s.state;P.setBlending(fi),P.buffers.depth.getReversed()===!0?P.buffers.color.setClear(0,0,0,0):P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);const k=m!==Jn&&this.type===Jn,G=m===Jn&&this.type!==Jn;for(let W=0,B=v.length;W<B;W++){const Y=v[W],O=Y.shadow;if(O===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;i.copy(O.mapSize);const ie=O.getFrameExtents();if(i.multiply(ie),r.copy(O.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(r.x=Math.floor(u/ie.x),i.x=r.x*ie.x,O.mapSize.x=r.x),i.y>u&&(r.y=Math.floor(u/ie.y),i.y=r.y*ie.y,O.mapSize.y=r.y)),O.map===null||k===!0||G===!0){const Ae=this.type!==Jn?{minFilter:nn,magFilter:nn}:{};O.map!==null&&O.map.dispose(),O.map=new ki(i.x,i.y,Ae),O.map.texture.name=Y.name+".shadowMap",O.camera.updateProjectionMatrix()}s.setRenderTarget(O.map),s.clear();const re=O.getViewportCount();for(let Ae=0;Ae<re;Ae++){const Ve=O.getViewport(Ae);o.set(r.x*Ve.x,r.y*Ve.y,r.x*Ve.z,r.y*Ve.w),P.viewport(o),O.updateMatrices(Y,Ae),n=O.getFrustum(),y(E,R,O.camera,Y,this.type)}O.isPointLightShadow!==!0&&this.type===Jn&&M(O,R),O.needsUpdate=!1}m=this.type,p.needsUpdate=!1,s.setRenderTarget(x,b,I)};function M(v,E){const R=e.update(g);d.defines.VSM_SAMPLES!==v.blurSamples&&(d.defines.VSM_SAMPLES=v.blurSamples,f.defines.VSM_SAMPLES=v.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),v.mapPass===null&&(v.mapPass=new ki(i.x,i.y)),d.uniforms.shadow_pass.value=v.map.texture,d.uniforms.resolution.value=v.mapSize,d.uniforms.radius.value=v.radius,s.setRenderTarget(v.mapPass),s.clear(),s.renderBufferDirect(E,null,R,d,g,null),f.uniforms.shadow_pass.value=v.mapPass.texture,f.uniforms.resolution.value=v.mapSize,f.uniforms.radius.value=v.radius,s.setRenderTarget(v.map),s.clear(),s.renderBufferDirect(E,null,R,f,g,null)}function S(v,E,R,x){let b=null;const I=R.isPointLight===!0?v.customDistanceMaterial:v.customDepthMaterial;if(I!==void 0)b=I;else if(b=R.isPointLight===!0?c:a,s.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0||E.alphaToCoverage===!0){const P=b.uuid,k=E.uuid;let G=h[P];G===void 0&&(G={},h[P]=G);let W=G[k];W===void 0&&(W=b.clone(),G[k]=W,E.addEventListener("dispose",D)),b=W}if(b.visible=E.visible,b.wireframe=E.wireframe,x===Jn?b.side=E.shadowSide!==null?E.shadowSide:E.side:b.side=E.shadowSide!==null?E.shadowSide:l[E.side],b.alphaMap=E.alphaMap,b.alphaTest=E.alphaToCoverage===!0?.5:E.alphaTest,b.map=E.map,b.clipShadows=E.clipShadows,b.clippingPlanes=E.clippingPlanes,b.clipIntersection=E.clipIntersection,b.displacementMap=E.displacementMap,b.displacementScale=E.displacementScale,b.displacementBias=E.displacementBias,b.wireframeLinewidth=E.wireframeLinewidth,b.linewidth=E.linewidth,R.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const P=s.properties.get(b);P.light=R}return b}function y(v,E,R,x,b){if(v.visible===!1)return;if(v.layers.test(E.layers)&&(v.isMesh||v.isLine||v.isPoints)&&(v.castShadow||v.receiveShadow&&b===Jn)&&(!v.frustumCulled||n.intersectsObject(v))){v.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,v.matrixWorld);const k=e.update(v),G=v.material;if(Array.isArray(G)){const W=k.groups;for(let B=0,Y=W.length;B<Y;B++){const O=W[B],ie=G[O.materialIndex];if(ie&&ie.visible){const re=S(v,ie,x,b);v.onBeforeShadow(s,v,E,R,k,re,O),s.renderBufferDirect(R,null,k,re,v,O),v.onAfterShadow(s,v,E,R,k,re,O)}}}else if(G.visible){const W=S(v,G,x,b);v.onBeforeShadow(s,v,E,R,k,W,null),s.renderBufferDirect(R,null,k,W,v,null),v.onAfterShadow(s,v,E,R,k,W,null)}}const P=v.children;for(let k=0,G=P.length;k<G;k++)y(P[k],E,R,x,b)}function D(v){v.target.removeEventListener("dispose",D);for(const R in h){const x=h[R],b=v.target.uuid;b in x&&(x[b].dispose(),delete x[b])}}}const zv={[La]:Ia,[Pa]:Fa,[Ua]:Ba,[_s]:Na,[Ia]:La,[Fa]:Pa,[Ba]:Ua,[Na]:_s};function Vv(s,e){function t(){let F=!1;const ae=new Ut;let ue=null;const Ce=new Ut(0,0,0,0);return{setMask:function(te){ue!==te&&!F&&(s.colorMask(te,te,te,te),ue=te)},setLocked:function(te){F=te},setClear:function(te,Z,Ee,He,et){et===!0&&(te*=He,Z*=He,Ee*=He),ae.set(te,Z,Ee,He),Ce.equals(ae)===!1&&(s.clearColor(te,Z,Ee,He),Ce.copy(ae))},reset:function(){F=!1,ue=null,Ce.set(-1,0,0,0)}}}function n(){let F=!1,ae=!1,ue=null,Ce=null,te=null;return{setReversed:function(Z){if(ae!==Z){const Ee=e.get("EXT_clip_control");Z?Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.ZERO_TO_ONE_EXT):Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.NEGATIVE_ONE_TO_ONE_EXT),ae=Z;const He=te;te=null,this.setClear(He)}},getReversed:function(){return ae},setTest:function(Z){Z?$(s.DEPTH_TEST):oe(s.DEPTH_TEST)},setMask:function(Z){ue!==Z&&!F&&(s.depthMask(Z),ue=Z)},setFunc:function(Z){if(ae&&(Z=zv[Z]),Ce!==Z){switch(Z){case La:s.depthFunc(s.NEVER);break;case Ia:s.depthFunc(s.ALWAYS);break;case Pa:s.depthFunc(s.LESS);break;case _s:s.depthFunc(s.LEQUAL);break;case Ua:s.depthFunc(s.EQUAL);break;case Na:s.depthFunc(s.GEQUAL);break;case Fa:s.depthFunc(s.GREATER);break;case Ba:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}Ce=Z}},setLocked:function(Z){F=Z},setClear:function(Z){te!==Z&&(ae&&(Z=1-Z),s.clearDepth(Z),te=Z)},reset:function(){F=!1,ue=null,Ce=null,te=null,ae=!1}}}function i(){let F=!1,ae=null,ue=null,Ce=null,te=null,Z=null,Ee=null,He=null,et=null;return{setTest:function(rt){F||(rt?$(s.STENCIL_TEST):oe(s.STENCIL_TEST))},setMask:function(rt){ae!==rt&&!F&&(s.stencilMask(rt),ae=rt)},setFunc:function(rt,vn,gt){(ue!==rt||Ce!==vn||te!==gt)&&(s.stencilFunc(rt,vn,gt),ue=rt,Ce=vn,te=gt)},setOp:function(rt,vn,gt){(Z!==rt||Ee!==vn||He!==gt)&&(s.stencilOp(rt,vn,gt),Z=rt,Ee=vn,He=gt)},setLocked:function(rt){F=rt},setClear:function(rt){et!==rt&&(s.clearStencil(rt),et=rt)},reset:function(){F=!1,ae=null,ue=null,Ce=null,te=null,Z=null,Ee=null,He=null,et=null}}}const r=new t,o=new n,a=new i,c=new WeakMap,h=new WeakMap;let u={},l={},d=new WeakMap,f=[],A=null,g=!1,p=null,m=null,M=null,S=null,y=null,D=null,v=null,E=new $e(0,0,0),R=0,x=!1,b=null,I=null,P=null,k=null,G=null;const W=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,Y=0;const O=s.getParameter(s.VERSION);O.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(O)[1]),B=Y>=1):O.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(O)[1]),B=Y>=2);let ie=null,re={};const Ae=s.getParameter(s.SCISSOR_BOX),Ve=s.getParameter(s.VIEWPORT),Me=new Ut().fromArray(Ae),Q=new Ut().fromArray(Ve);function De(F,ae,ue,Ce){const te=new Uint8Array(4),Z=s.createTexture();s.bindTexture(F,Z),s.texParameteri(F,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(F,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Ee=0;Ee<ue;Ee++)F===s.TEXTURE_3D||F===s.TEXTURE_2D_ARRAY?s.texImage3D(ae,0,s.RGBA,1,1,Ce,0,s.RGBA,s.UNSIGNED_BYTE,te):s.texImage2D(ae+Ee,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,te);return Z}const q={};q[s.TEXTURE_2D]=De(s.TEXTURE_2D,s.TEXTURE_2D,1),q[s.TEXTURE_CUBE_MAP]=De(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),q[s.TEXTURE_2D_ARRAY]=De(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),q[s.TEXTURE_3D]=De(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),$(s.DEPTH_TEST),o.setFunc(_s),Le(!1),ve(pc),$(s.CULL_FACE),ft(fi);function $(F){u[F]!==!0&&(s.enable(F),u[F]=!0)}function oe(F){u[F]!==!1&&(s.disable(F),u[F]=!1)}function fe(F,ae){return l[F]!==ae?(s.bindFramebuffer(F,ae),l[F]=ae,F===s.DRAW_FRAMEBUFFER&&(l[s.FRAMEBUFFER]=ae),F===s.FRAMEBUFFER&&(l[s.DRAW_FRAMEBUFFER]=ae),!0):!1}function he(F,ae){let ue=f,Ce=!1;if(F){ue=d.get(ae),ue===void 0&&(ue=[],d.set(ae,ue));const te=F.textures;if(ue.length!==te.length||ue[0]!==s.COLOR_ATTACHMENT0){for(let Z=0,Ee=te.length;Z<Ee;Z++)ue[Z]=s.COLOR_ATTACHMENT0+Z;ue.length=te.length,Ce=!0}}else ue[0]!==s.BACK&&(ue[0]=s.BACK,Ce=!0);Ce&&s.drawBuffers(ue)}function Ue(F){return A!==F?(s.useProgram(F),A=F,!0):!1}const mt={[Ii]:s.FUNC_ADD,[Pf]:s.FUNC_SUBTRACT,[Uf]:s.FUNC_REVERSE_SUBTRACT};mt[Nf]=s.MIN,mt[Ff]=s.MAX;const U={[Bf]:s.ZERO,[kf]:s.ONE,[Of]:s.SRC_COLOR,[Ra]:s.SRC_ALPHA,[Xf]:s.SRC_ALPHA_SATURATE,[Hf]:s.DST_COLOR,[Vf]:s.DST_ALPHA,[zf]:s.ONE_MINUS_SRC_COLOR,[Da]:s.ONE_MINUS_SRC_ALPHA,[Wf]:s.ONE_MINUS_DST_COLOR,[Gf]:s.ONE_MINUS_DST_ALPHA,[Yf]:s.CONSTANT_COLOR,[qf]:s.ONE_MINUS_CONSTANT_COLOR,[Kf]:s.CONSTANT_ALPHA,[Qf]:s.ONE_MINUS_CONSTANT_ALPHA};function ft(F,ae,ue,Ce,te,Z,Ee,He,et,rt){if(F===fi){g===!0&&(oe(s.BLEND),g=!1);return}if(g===!1&&($(s.BLEND),g=!0),F!==If){if(F!==p||rt!==x){if((m!==Ii||y!==Ii)&&(s.blendEquation(s.FUNC_ADD),m=Ii,y=Ii),rt)switch(F){case gs:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case vs:s.blendFunc(s.ONE,s.ONE);break;case mc:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case gc:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case gs:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case vs:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case mc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case gc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}M=null,S=null,D=null,v=null,E.set(0,0,0),R=0,p=F,x=rt}return}te=te||ae,Z=Z||ue,Ee=Ee||Ce,(ae!==m||te!==y)&&(s.blendEquationSeparate(mt[ae],mt[te]),m=ae,y=te),(ue!==M||Ce!==S||Z!==D||Ee!==v)&&(s.blendFuncSeparate(U[ue],U[Ce],U[Z],U[Ee]),M=ue,S=Ce,D=Z,v=Ee),(He.equals(E)===!1||et!==R)&&(s.blendColor(He.r,He.g,He.b,et),E.copy(He),R=et),p=F,x=!1}function We(F,ae){F.side===ln?oe(s.CULL_FACE):$(s.CULL_FACE);let ue=F.side===tn;ae&&(ue=!ue),Le(ue),F.blending===gs&&F.transparent===!1?ft(fi):ft(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),o.setFunc(F.depthFunc),o.setTest(F.depthTest),o.setMask(F.depthWrite),r.setMask(F.colorWrite);const Ce=F.stencilWrite;a.setTest(Ce),Ce&&(a.setMask(F.stencilWriteMask),a.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),a.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Te(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?$(s.SAMPLE_ALPHA_TO_COVERAGE):oe(s.SAMPLE_ALPHA_TO_COVERAGE)}function Le(F){b!==F&&(F?s.frontFace(s.CW):s.frontFace(s.CCW),b=F)}function ve(F){F!==Rf?($(s.CULL_FACE),F!==I&&(F===pc?s.cullFace(s.BACK):F===Df?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):oe(s.CULL_FACE),I=F}function Qe(F){F!==P&&(B&&s.lineWidth(F),P=F)}function Te(F,ae,ue){F?($(s.POLYGON_OFFSET_FILL),(k!==ae||G!==ue)&&(s.polygonOffset(ae,ue),k=ae,G=ue)):oe(s.POLYGON_OFFSET_FILL)}function ze(F){F?$(s.SCISSOR_TEST):oe(s.SCISSOR_TEST)}function yt(F){F===void 0&&(F=s.TEXTURE0+W-1),ie!==F&&(s.activeTexture(F),ie=F)}function Ct(F,ae,ue){ue===void 0&&(ie===null?ue=s.TEXTURE0+W-1:ue=ie);let Ce=re[ue];Ce===void 0&&(Ce={type:void 0,texture:void 0},re[ue]=Ce),(Ce.type!==F||Ce.texture!==ae)&&(ie!==ue&&(s.activeTexture(ue),ie=ue),s.bindTexture(F,ae||q[F]),Ce.type=F,Ce.texture=ae)}function L(){const F=re[ie];F!==void 0&&F.type!==void 0&&(s.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function w(){try{s.compressedTexImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function T(){try{s.compressedTexImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function j(){try{s.texSubImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ne(){try{s.texSubImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function J(){try{s.compressedTexSubImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function xe(){try{s.compressedTexSubImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function de(){try{s.texStorage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ie(){try{s.texStorage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Se(){try{s.texImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function se(){try{s.texImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ye(F){Me.equals(F)===!1&&(s.scissor(F.x,F.y,F.z,F.w),Me.copy(F))}function Ge(F){Q.equals(F)===!1&&(s.viewport(F.x,F.y,F.z,F.w),Q.copy(F))}function Pe(F,ae){let ue=h.get(ae);ue===void 0&&(ue=new WeakMap,h.set(ae,ue));let Ce=ue.get(F);Ce===void 0&&(Ce=s.getUniformBlockIndex(ae,F.name),ue.set(F,Ce))}function ge(F,ae){const Ce=h.get(ae).get(F);c.get(ae)!==Ce&&(s.uniformBlockBinding(ae,Ce,F.__bindingPointIndex),c.set(ae,Ce))}function Ye(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),u={},ie=null,re={},l={},d=new WeakMap,f=[],A=null,g=!1,p=null,m=null,M=null,S=null,y=null,D=null,v=null,E=new $e(0,0,0),R=0,x=!1,b=null,I=null,P=null,k=null,G=null,Me.set(0,0,s.canvas.width,s.canvas.height),Q.set(0,0,s.canvas.width,s.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:$,disable:oe,bindFramebuffer:fe,drawBuffers:he,useProgram:Ue,setBlending:ft,setMaterial:We,setFlipSided:Le,setCullFace:ve,setLineWidth:Qe,setPolygonOffset:Te,setScissorTest:ze,activeTexture:yt,bindTexture:Ct,unbindTexture:L,compressedTexImage2D:w,compressedTexImage3D:T,texImage2D:Se,texImage3D:se,updateUBOMapping:Pe,uniformBlockBinding:ge,texStorage2D:de,texStorage3D:Ie,texSubImage2D:j,texSubImage3D:ne,compressedTexSubImage2D:J,compressedTexSubImage3D:xe,scissor:ye,viewport:Ge,reset:Ye}}function Gv(s,e,t,n,i,r,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new tt,u=new WeakMap;let l;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function A(L,w){return f?new OffscreenCanvas(L,w):vo("canvas")}function g(L,w,T){let j=1;const ne=Ct(L);if((ne.width>T||ne.height>T)&&(j=T/Math.max(ne.width,ne.height)),j<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){const J=Math.floor(j*ne.width),xe=Math.floor(j*ne.height);l===void 0&&(l=A(J,xe));const de=w?A(J,xe):l;return de.width=J,de.height=xe,de.getContext("2d").drawImage(L,0,0,J,xe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+J+"x"+xe+")."),de}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),L;return L}function p(L){return L.generateMipmaps}function m(L){s.generateMipmap(L)}function M(L){return L.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?s.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function S(L,w,T,j,ne=!1){if(L!==null){if(s[L]!==void 0)return s[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let J=w;if(w===s.RED&&(T===s.FLOAT&&(J=s.R32F),T===s.HALF_FLOAT&&(J=s.R16F),T===s.UNSIGNED_BYTE&&(J=s.R8)),w===s.RED_INTEGER&&(T===s.UNSIGNED_BYTE&&(J=s.R8UI),T===s.UNSIGNED_SHORT&&(J=s.R16UI),T===s.UNSIGNED_INT&&(J=s.R32UI),T===s.BYTE&&(J=s.R8I),T===s.SHORT&&(J=s.R16I),T===s.INT&&(J=s.R32I)),w===s.RG&&(T===s.FLOAT&&(J=s.RG32F),T===s.HALF_FLOAT&&(J=s.RG16F),T===s.UNSIGNED_BYTE&&(J=s.RG8)),w===s.RG_INTEGER&&(T===s.UNSIGNED_BYTE&&(J=s.RG8UI),T===s.UNSIGNED_SHORT&&(J=s.RG16UI),T===s.UNSIGNED_INT&&(J=s.RG32UI),T===s.BYTE&&(J=s.RG8I),T===s.SHORT&&(J=s.RG16I),T===s.INT&&(J=s.RG32I)),w===s.RGB_INTEGER&&(T===s.UNSIGNED_BYTE&&(J=s.RGB8UI),T===s.UNSIGNED_SHORT&&(J=s.RGB16UI),T===s.UNSIGNED_INT&&(J=s.RGB32UI),T===s.BYTE&&(J=s.RGB8I),T===s.SHORT&&(J=s.RGB16I),T===s.INT&&(J=s.RGB32I)),w===s.RGBA_INTEGER&&(T===s.UNSIGNED_BYTE&&(J=s.RGBA8UI),T===s.UNSIGNED_SHORT&&(J=s.RGBA16UI),T===s.UNSIGNED_INT&&(J=s.RGBA32UI),T===s.BYTE&&(J=s.RGBA8I),T===s.SHORT&&(J=s.RGBA16I),T===s.INT&&(J=s.RGBA32I)),w===s.RGB&&(T===s.UNSIGNED_INT_5_9_9_9_REV&&(J=s.RGB9_E5),T===s.UNSIGNED_INT_10F_11F_11F_REV&&(J=s.R11F_G11F_B10F)),w===s.RGBA){const xe=ne?mo:dt.getTransfer(j);T===s.FLOAT&&(J=s.RGBA32F),T===s.HALF_FLOAT&&(J=s.RGBA16F),T===s.UNSIGNED_BYTE&&(J=xe===xt?s.SRGB8_ALPHA8:s.RGBA8),T===s.UNSIGNED_SHORT_4_4_4_4&&(J=s.RGBA4),T===s.UNSIGNED_SHORT_5_5_5_1&&(J=s.RGB5_A1)}return(J===s.R16F||J===s.R32F||J===s.RG16F||J===s.RG32F||J===s.RGBA16F||J===s.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function y(L,w){let T;return L?w===null||w===Bi||w===sr?T=s.DEPTH24_STENCIL8:w===$n?T=s.DEPTH32F_STENCIL8:w===ir&&(T=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===Bi||w===sr?T=s.DEPTH_COMPONENT24:w===$n?T=s.DEPTH_COMPONENT32F:w===ir&&(T=s.DEPTH_COMPONENT16),T}function D(L,w){return p(L)===!0||L.isFramebufferTexture&&L.minFilter!==nn&&L.minFilter!==An?Math.log2(Math.max(w.width,w.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?w.mipmaps.length:1}function v(L){const w=L.target;w.removeEventListener("dispose",v),R(w),w.isVideoTexture&&u.delete(w)}function E(L){const w=L.target;w.removeEventListener("dispose",E),b(w)}function R(L){const w=n.get(L);if(w.__webglInit===void 0)return;const T=L.source,j=d.get(T);if(j){const ne=j[w.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&x(L),Object.keys(j).length===0&&d.delete(T)}n.remove(L)}function x(L){const w=n.get(L);s.deleteTexture(w.__webglTexture);const T=L.source,j=d.get(T);delete j[w.__cacheKey],o.memory.textures--}function b(L){const w=n.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),n.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(w.__webglFramebuffer[j]))for(let ne=0;ne<w.__webglFramebuffer[j].length;ne++)s.deleteFramebuffer(w.__webglFramebuffer[j][ne]);else s.deleteFramebuffer(w.__webglFramebuffer[j]);w.__webglDepthbuffer&&s.deleteRenderbuffer(w.__webglDepthbuffer[j])}else{if(Array.isArray(w.__webglFramebuffer))for(let j=0;j<w.__webglFramebuffer.length;j++)s.deleteFramebuffer(w.__webglFramebuffer[j]);else s.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&s.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&s.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let j=0;j<w.__webglColorRenderbuffer.length;j++)w.__webglColorRenderbuffer[j]&&s.deleteRenderbuffer(w.__webglColorRenderbuffer[j]);w.__webglDepthRenderbuffer&&s.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const T=L.textures;for(let j=0,ne=T.length;j<ne;j++){const J=n.get(T[j]);J.__webglTexture&&(s.deleteTexture(J.__webglTexture),o.memory.textures--),n.remove(T[j])}n.remove(L)}let I=0;function P(){I=0}function k(){const L=I;return L>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+i.maxTextures),I+=1,L}function G(L){const w=[];return w.push(L.wrapS),w.push(L.wrapT),w.push(L.wrapR||0),w.push(L.magFilter),w.push(L.minFilter),w.push(L.anisotropy),w.push(L.internalFormat),w.push(L.format),w.push(L.type),w.push(L.generateMipmaps),w.push(L.premultiplyAlpha),w.push(L.flipY),w.push(L.unpackAlignment),w.push(L.colorSpace),w.join()}function W(L,w){const T=n.get(L);if(L.isVideoTexture&&ze(L),L.isRenderTargetTexture===!1&&L.isExternalTexture!==!0&&L.version>0&&T.__version!==L.version){const j=L.image;if(j===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{q(T,L,w);return}}else L.isExternalTexture&&(T.__webglTexture=L.sourceTexture?L.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,T.__webglTexture,s.TEXTURE0+w)}function B(L,w){const T=n.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&T.__version!==L.version){q(T,L,w);return}t.bindTexture(s.TEXTURE_2D_ARRAY,T.__webglTexture,s.TEXTURE0+w)}function Y(L,w){const T=n.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&T.__version!==L.version){q(T,L,w);return}t.bindTexture(s.TEXTURE_3D,T.__webglTexture,s.TEXTURE0+w)}function O(L,w){const T=n.get(L);if(L.version>0&&T.__version!==L.version){$(T,L,w);return}t.bindTexture(s.TEXTURE_CUBE_MAP,T.__webglTexture,s.TEXTURE0+w)}const ie={[nr]:s.REPEAT,[Ui]:s.CLAMP_TO_EDGE,[za]:s.MIRRORED_REPEAT},re={[nn]:s.NEAREST,[rp]:s.NEAREST_MIPMAP_NEAREST,[Ks]:s.NEAREST_MIPMAP_LINEAR,[An]:s.LINEAR,[Go]:s.LINEAR_MIPMAP_NEAREST,[Ni]:s.LINEAR_MIPMAP_LINEAR},Ae={[hp]:s.NEVER,[gp]:s.ALWAYS,[dp]:s.LESS,[Md]:s.LEQUAL,[up]:s.EQUAL,[mp]:s.GEQUAL,[fp]:s.GREATER,[pp]:s.NOTEQUAL};function Ve(L,w){if(w.type===$n&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===An||w.magFilter===Go||w.magFilter===Ks||w.magFilter===Ni||w.minFilter===An||w.minFilter===Go||w.minFilter===Ks||w.minFilter===Ni)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(L,s.TEXTURE_WRAP_S,ie[w.wrapS]),s.texParameteri(L,s.TEXTURE_WRAP_T,ie[w.wrapT]),(L===s.TEXTURE_3D||L===s.TEXTURE_2D_ARRAY)&&s.texParameteri(L,s.TEXTURE_WRAP_R,ie[w.wrapR]),s.texParameteri(L,s.TEXTURE_MAG_FILTER,re[w.magFilter]),s.texParameteri(L,s.TEXTURE_MIN_FILTER,re[w.minFilter]),w.compareFunction&&(s.texParameteri(L,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(L,s.TEXTURE_COMPARE_FUNC,Ae[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===nn||w.minFilter!==Ks&&w.minFilter!==Ni||w.type===$n&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||n.get(w).__currentAnisotropy){const T=e.get("EXT_texture_filter_anisotropic");s.texParameterf(L,T.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,i.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy}}}function Me(L,w){let T=!1;L.__webglInit===void 0&&(L.__webglInit=!0,w.addEventListener("dispose",v));const j=w.source;let ne=d.get(j);ne===void 0&&(ne={},d.set(j,ne));const J=G(w);if(J!==L.__cacheKey){ne[J]===void 0&&(ne[J]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,T=!0),ne[J].usedTimes++;const xe=ne[L.__cacheKey];xe!==void 0&&(ne[L.__cacheKey].usedTimes--,xe.usedTimes===0&&x(w)),L.__cacheKey=J,L.__webglTexture=ne[J].texture}return T}function Q(L,w,T){return Math.floor(Math.floor(L/T)/w)}function De(L,w,T,j){const J=L.updateRanges;if(J.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,w.width,w.height,T,j,w.data);else{J.sort((se,ye)=>se.start-ye.start);let xe=0;for(let se=1;se<J.length;se++){const ye=J[xe],Ge=J[se],Pe=ye.start+ye.count,ge=Q(Ge.start,w.width,4),Ye=Q(ye.start,w.width,4);Ge.start<=Pe+1&&ge===Ye&&Q(Ge.start+Ge.count-1,w.width,4)===ge?ye.count=Math.max(ye.count,Ge.start+Ge.count-ye.start):(++xe,J[xe]=Ge)}J.length=xe+1;const de=s.getParameter(s.UNPACK_ROW_LENGTH),Ie=s.getParameter(s.UNPACK_SKIP_PIXELS),Se=s.getParameter(s.UNPACK_SKIP_ROWS);s.pixelStorei(s.UNPACK_ROW_LENGTH,w.width);for(let se=0,ye=J.length;se<ye;se++){const Ge=J[se],Pe=Math.floor(Ge.start/4),ge=Math.ceil(Ge.count/4),Ye=Pe%w.width,F=Math.floor(Pe/w.width),ae=ge,ue=1;s.pixelStorei(s.UNPACK_SKIP_PIXELS,Ye),s.pixelStorei(s.UNPACK_SKIP_ROWS,F),t.texSubImage2D(s.TEXTURE_2D,0,Ye,F,ae,ue,T,j,w.data)}L.clearUpdateRanges(),s.pixelStorei(s.UNPACK_ROW_LENGTH,de),s.pixelStorei(s.UNPACK_SKIP_PIXELS,Ie),s.pixelStorei(s.UNPACK_SKIP_ROWS,Se)}}function q(L,w,T){let j=s.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(j=s.TEXTURE_2D_ARRAY),w.isData3DTexture&&(j=s.TEXTURE_3D);const ne=Me(L,w),J=w.source;t.bindTexture(j,L.__webglTexture,s.TEXTURE0+T);const xe=n.get(J);if(J.version!==xe.__version||ne===!0){t.activeTexture(s.TEXTURE0+T);const de=dt.getPrimaries(dt.workingColorSpace),Ie=w.colorSpace===Zn?null:dt.getPrimaries(w.colorSpace),Se=w.colorSpace===Zn||de===Ie?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,w.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,w.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Se);let se=g(w.image,!1,i.maxTextureSize);se=yt(w,se);const ye=r.convert(w.format,w.colorSpace),Ge=r.convert(w.type);let Pe=S(w.internalFormat,ye,Ge,w.colorSpace,w.isVideoTexture);Ve(j,w);let ge;const Ye=w.mipmaps,F=w.isVideoTexture!==!0,ae=xe.__version===void 0||ne===!0,ue=J.dataReady,Ce=D(w,se);if(w.isDepthTexture)Pe=y(w.format===or,w.type),ae&&(F?t.texStorage2D(s.TEXTURE_2D,1,Pe,se.width,se.height):t.texImage2D(s.TEXTURE_2D,0,Pe,se.width,se.height,0,ye,Ge,null));else if(w.isDataTexture)if(Ye.length>0){F&&ae&&t.texStorage2D(s.TEXTURE_2D,Ce,Pe,Ye[0].width,Ye[0].height);for(let te=0,Z=Ye.length;te<Z;te++)ge=Ye[te],F?ue&&t.texSubImage2D(s.TEXTURE_2D,te,0,0,ge.width,ge.height,ye,Ge,ge.data):t.texImage2D(s.TEXTURE_2D,te,Pe,ge.width,ge.height,0,ye,Ge,ge.data);w.generateMipmaps=!1}else F?(ae&&t.texStorage2D(s.TEXTURE_2D,Ce,Pe,se.width,se.height),ue&&De(w,se,ye,Ge)):t.texImage2D(s.TEXTURE_2D,0,Pe,se.width,se.height,0,ye,Ge,se.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){F&&ae&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ce,Pe,Ye[0].width,Ye[0].height,se.depth);for(let te=0,Z=Ye.length;te<Z;te++)if(ge=Ye[te],w.format!==Cn)if(ye!==null)if(F){if(ue)if(w.layerUpdates.size>0){const Ee=kc(ge.width,ge.height,w.format,w.type);for(const He of w.layerUpdates){const et=ge.data.subarray(He*Ee/ge.data.BYTES_PER_ELEMENT,(He+1)*Ee/ge.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,te,0,0,He,ge.width,ge.height,1,ye,et)}w.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,te,0,0,0,ge.width,ge.height,se.depth,ye,ge.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,te,Pe,ge.width,ge.height,se.depth,0,ge.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else F?ue&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,te,0,0,0,ge.width,ge.height,se.depth,ye,Ge,ge.data):t.texImage3D(s.TEXTURE_2D_ARRAY,te,Pe,ge.width,ge.height,se.depth,0,ye,Ge,ge.data)}else{F&&ae&&t.texStorage2D(s.TEXTURE_2D,Ce,Pe,Ye[0].width,Ye[0].height);for(let te=0,Z=Ye.length;te<Z;te++)ge=Ye[te],w.format!==Cn?ye!==null?F?ue&&t.compressedTexSubImage2D(s.TEXTURE_2D,te,0,0,ge.width,ge.height,ye,ge.data):t.compressedTexImage2D(s.TEXTURE_2D,te,Pe,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):F?ue&&t.texSubImage2D(s.TEXTURE_2D,te,0,0,ge.width,ge.height,ye,Ge,ge.data):t.texImage2D(s.TEXTURE_2D,te,Pe,ge.width,ge.height,0,ye,Ge,ge.data)}else if(w.isDataArrayTexture)if(F){if(ae&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ce,Pe,se.width,se.height,se.depth),ue)if(w.layerUpdates.size>0){const te=kc(se.width,se.height,w.format,w.type);for(const Z of w.layerUpdates){const Ee=se.data.subarray(Z*te/se.data.BYTES_PER_ELEMENT,(Z+1)*te/se.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,Z,se.width,se.height,1,ye,Ge,Ee)}w.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,se.width,se.height,se.depth,ye,Ge,se.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,Pe,se.width,se.height,se.depth,0,ye,Ge,se.data);else if(w.isData3DTexture)F?(ae&&t.texStorage3D(s.TEXTURE_3D,Ce,Pe,se.width,se.height,se.depth),ue&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,se.width,se.height,se.depth,ye,Ge,se.data)):t.texImage3D(s.TEXTURE_3D,0,Pe,se.width,se.height,se.depth,0,ye,Ge,se.data);else if(w.isFramebufferTexture){if(ae)if(F)t.texStorage2D(s.TEXTURE_2D,Ce,Pe,se.width,se.height);else{let te=se.width,Z=se.height;for(let Ee=0;Ee<Ce;Ee++)t.texImage2D(s.TEXTURE_2D,Ee,Pe,te,Z,0,ye,Ge,null),te>>=1,Z>>=1}}else if(Ye.length>0){if(F&&ae){const te=Ct(Ye[0]);t.texStorage2D(s.TEXTURE_2D,Ce,Pe,te.width,te.height)}for(let te=0,Z=Ye.length;te<Z;te++)ge=Ye[te],F?ue&&t.texSubImage2D(s.TEXTURE_2D,te,0,0,ye,Ge,ge):t.texImage2D(s.TEXTURE_2D,te,Pe,ye,Ge,ge);w.generateMipmaps=!1}else if(F){if(ae){const te=Ct(se);t.texStorage2D(s.TEXTURE_2D,Ce,Pe,te.width,te.height)}ue&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,ye,Ge,se)}else t.texImage2D(s.TEXTURE_2D,0,Pe,ye,Ge,se);p(w)&&m(j),xe.__version=J.version,w.onUpdate&&w.onUpdate(w)}L.__version=w.version}function $(L,w,T){if(w.image.length!==6)return;const j=Me(L,w),ne=w.source;t.bindTexture(s.TEXTURE_CUBE_MAP,L.__webglTexture,s.TEXTURE0+T);const J=n.get(ne);if(ne.version!==J.__version||j===!0){t.activeTexture(s.TEXTURE0+T);const xe=dt.getPrimaries(dt.workingColorSpace),de=w.colorSpace===Zn?null:dt.getPrimaries(w.colorSpace),Ie=w.colorSpace===Zn||xe===de?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,w.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,w.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ie);const Se=w.isCompressedTexture||w.image[0].isCompressedTexture,se=w.image[0]&&w.image[0].isDataTexture,ye=[];for(let Z=0;Z<6;Z++)!Se&&!se?ye[Z]=g(w.image[Z],!0,i.maxCubemapSize):ye[Z]=se?w.image[Z].image:w.image[Z],ye[Z]=yt(w,ye[Z]);const Ge=ye[0],Pe=r.convert(w.format,w.colorSpace),ge=r.convert(w.type),Ye=S(w.internalFormat,Pe,ge,w.colorSpace),F=w.isVideoTexture!==!0,ae=J.__version===void 0||j===!0,ue=ne.dataReady;let Ce=D(w,Ge);Ve(s.TEXTURE_CUBE_MAP,w);let te;if(Se){F&&ae&&t.texStorage2D(s.TEXTURE_CUBE_MAP,Ce,Ye,Ge.width,Ge.height);for(let Z=0;Z<6;Z++){te=ye[Z].mipmaps;for(let Ee=0;Ee<te.length;Ee++){const He=te[Ee];w.format!==Cn?Pe!==null?F?ue&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Ee,0,0,He.width,He.height,Pe,He.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Ee,Ye,He.width,He.height,0,He.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?ue&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Ee,0,0,He.width,He.height,Pe,ge,He.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Ee,Ye,He.width,He.height,0,Pe,ge,He.data)}}}else{if(te=w.mipmaps,F&&ae){te.length>0&&Ce++;const Z=Ct(ye[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,Ce,Ye,Z.width,Z.height)}for(let Z=0;Z<6;Z++)if(se){F?ue&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,ye[Z].width,ye[Z].height,Pe,ge,ye[Z].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Ye,ye[Z].width,ye[Z].height,0,Pe,ge,ye[Z].data);for(let Ee=0;Ee<te.length;Ee++){const et=te[Ee].image[Z].image;F?ue&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Ee+1,0,0,et.width,et.height,Pe,ge,et.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Ee+1,Ye,et.width,et.height,0,Pe,ge,et.data)}}else{F?ue&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,Pe,ge,ye[Z]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Ye,Pe,ge,ye[Z]);for(let Ee=0;Ee<te.length;Ee++){const He=te[Ee];F?ue&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Ee+1,0,0,Pe,ge,He.image[Z]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Ee+1,Ye,Pe,ge,He.image[Z])}}}p(w)&&m(s.TEXTURE_CUBE_MAP),J.__version=ne.version,w.onUpdate&&w.onUpdate(w)}L.__version=w.version}function oe(L,w,T,j,ne,J){const xe=r.convert(T.format,T.colorSpace),de=r.convert(T.type),Ie=S(T.internalFormat,xe,de,T.colorSpace),Se=n.get(w),se=n.get(T);if(se.__renderTarget=w,!Se.__hasExternalTextures){const ye=Math.max(1,w.width>>J),Ge=Math.max(1,w.height>>J);ne===s.TEXTURE_3D||ne===s.TEXTURE_2D_ARRAY?t.texImage3D(ne,J,Ie,ye,Ge,w.depth,0,xe,de,null):t.texImage2D(ne,J,Ie,ye,Ge,0,xe,de,null)}t.bindFramebuffer(s.FRAMEBUFFER,L),Te(w)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,j,ne,se.__webglTexture,0,Qe(w)):(ne===s.TEXTURE_2D||ne>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,j,ne,se.__webglTexture,J),t.bindFramebuffer(s.FRAMEBUFFER,null)}function fe(L,w,T){if(s.bindRenderbuffer(s.RENDERBUFFER,L),w.depthBuffer){const j=w.depthTexture,ne=j&&j.isDepthTexture?j.type:null,J=y(w.stencilBuffer,ne),xe=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,de=Qe(w);Te(w)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,de,J,w.width,w.height):T?s.renderbufferStorageMultisample(s.RENDERBUFFER,de,J,w.width,w.height):s.renderbufferStorage(s.RENDERBUFFER,J,w.width,w.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,xe,s.RENDERBUFFER,L)}else{const j=w.textures;for(let ne=0;ne<j.length;ne++){const J=j[ne],xe=r.convert(J.format,J.colorSpace),de=r.convert(J.type),Ie=S(J.internalFormat,xe,de,J.colorSpace),Se=Qe(w);T&&Te(w)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Se,Ie,w.width,w.height):Te(w)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Se,Ie,w.width,w.height):s.renderbufferStorage(s.RENDERBUFFER,Ie,w.width,w.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function he(L,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,L),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const j=n.get(w.depthTexture);j.__renderTarget=w,(!j.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),W(w.depthTexture,0);const ne=j.__webglTexture,J=Qe(w);if(w.depthTexture.format===rr)Te(w)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ne,0,J):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ne,0);else if(w.depthTexture.format===or)Te(w)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ne,0,J):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ne,0);else throw new Error("Unknown depthTexture format")}function Ue(L){const w=n.get(L),T=L.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==L.depthTexture){const j=L.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),j){const ne=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,j.removeEventListener("dispose",ne)};j.addEventListener("dispose",ne),w.__depthDisposeCallback=ne}w.__boundDepthTexture=j}if(L.depthTexture&&!w.__autoAllocateDepthBuffer){if(T)throw new Error("target.depthTexture not supported in Cube render targets");const j=L.texture.mipmaps;j&&j.length>0?he(w.__webglFramebuffer[0],L):he(w.__webglFramebuffer,L)}else if(T){w.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(t.bindFramebuffer(s.FRAMEBUFFER,w.__webglFramebuffer[j]),w.__webglDepthbuffer[j]===void 0)w.__webglDepthbuffer[j]=s.createRenderbuffer(),fe(w.__webglDepthbuffer[j],L,!1);else{const ne=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,J=w.__webglDepthbuffer[j];s.bindRenderbuffer(s.RENDERBUFFER,J),s.framebufferRenderbuffer(s.FRAMEBUFFER,ne,s.RENDERBUFFER,J)}}else{const j=L.texture.mipmaps;if(j&&j.length>0?t.bindFramebuffer(s.FRAMEBUFFER,w.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=s.createRenderbuffer(),fe(w.__webglDepthbuffer,L,!1);else{const ne=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,J=w.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,J),s.framebufferRenderbuffer(s.FRAMEBUFFER,ne,s.RENDERBUFFER,J)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function mt(L,w,T){const j=n.get(L);w!==void 0&&oe(j.__webglFramebuffer,L,L.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),T!==void 0&&Ue(L)}function U(L){const w=L.texture,T=n.get(L),j=n.get(w);L.addEventListener("dispose",E);const ne=L.textures,J=L.isWebGLCubeRenderTarget===!0,xe=ne.length>1;if(xe||(j.__webglTexture===void 0&&(j.__webglTexture=s.createTexture()),j.__version=w.version,o.memory.textures++),J){T.__webglFramebuffer=[];for(let de=0;de<6;de++)if(w.mipmaps&&w.mipmaps.length>0){T.__webglFramebuffer[de]=[];for(let Ie=0;Ie<w.mipmaps.length;Ie++)T.__webglFramebuffer[de][Ie]=s.createFramebuffer()}else T.__webglFramebuffer[de]=s.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){T.__webglFramebuffer=[];for(let de=0;de<w.mipmaps.length;de++)T.__webglFramebuffer[de]=s.createFramebuffer()}else T.__webglFramebuffer=s.createFramebuffer();if(xe)for(let de=0,Ie=ne.length;de<Ie;de++){const Se=n.get(ne[de]);Se.__webglTexture===void 0&&(Se.__webglTexture=s.createTexture(),o.memory.textures++)}if(L.samples>0&&Te(L)===!1){T.__webglMultisampledFramebuffer=s.createFramebuffer(),T.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,T.__webglMultisampledFramebuffer);for(let de=0;de<ne.length;de++){const Ie=ne[de];T.__webglColorRenderbuffer[de]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,T.__webglColorRenderbuffer[de]);const Se=r.convert(Ie.format,Ie.colorSpace),se=r.convert(Ie.type),ye=S(Ie.internalFormat,Se,se,Ie.colorSpace,L.isXRRenderTarget===!0),Ge=Qe(L);s.renderbufferStorageMultisample(s.RENDERBUFFER,Ge,ye,L.width,L.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+de,s.RENDERBUFFER,T.__webglColorRenderbuffer[de])}s.bindRenderbuffer(s.RENDERBUFFER,null),L.depthBuffer&&(T.__webglDepthRenderbuffer=s.createRenderbuffer(),fe(T.__webglDepthRenderbuffer,L,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(J){t.bindTexture(s.TEXTURE_CUBE_MAP,j.__webglTexture),Ve(s.TEXTURE_CUBE_MAP,w);for(let de=0;de<6;de++)if(w.mipmaps&&w.mipmaps.length>0)for(let Ie=0;Ie<w.mipmaps.length;Ie++)oe(T.__webglFramebuffer[de][Ie],L,w,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+de,Ie);else oe(T.__webglFramebuffer[de],L,w,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+de,0);p(w)&&m(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(xe){for(let de=0,Ie=ne.length;de<Ie;de++){const Se=ne[de],se=n.get(Se);let ye=s.TEXTURE_2D;(L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(ye=L.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ye,se.__webglTexture),Ve(ye,Se),oe(T.__webglFramebuffer,L,Se,s.COLOR_ATTACHMENT0+de,ye,0),p(Se)&&m(ye)}t.unbindTexture()}else{let de=s.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(de=L.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(de,j.__webglTexture),Ve(de,w),w.mipmaps&&w.mipmaps.length>0)for(let Ie=0;Ie<w.mipmaps.length;Ie++)oe(T.__webglFramebuffer[Ie],L,w,s.COLOR_ATTACHMENT0,de,Ie);else oe(T.__webglFramebuffer,L,w,s.COLOR_ATTACHMENT0,de,0);p(w)&&m(de),t.unbindTexture()}L.depthBuffer&&Ue(L)}function ft(L){const w=L.textures;for(let T=0,j=w.length;T<j;T++){const ne=w[T];if(p(ne)){const J=M(L),xe=n.get(ne).__webglTexture;t.bindTexture(J,xe),m(J),t.unbindTexture()}}}const We=[],Le=[];function ve(L){if(L.samples>0){if(Te(L)===!1){const w=L.textures,T=L.width,j=L.height;let ne=s.COLOR_BUFFER_BIT;const J=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,xe=n.get(L),de=w.length>1;if(de)for(let Se=0;Se<w.length;Se++)t.bindFramebuffer(s.FRAMEBUFFER,xe.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Se,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,xe.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Se,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,xe.__webglMultisampledFramebuffer);const Ie=L.texture.mipmaps;Ie&&Ie.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,xe.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,xe.__webglFramebuffer);for(let Se=0;Se<w.length;Se++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(ne|=s.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(ne|=s.STENCIL_BUFFER_BIT)),de){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,xe.__webglColorRenderbuffer[Se]);const se=n.get(w[Se]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,se,0)}s.blitFramebuffer(0,0,T,j,0,0,T,j,ne,s.NEAREST),c===!0&&(We.length=0,Le.length=0,We.push(s.COLOR_ATTACHMENT0+Se),L.depthBuffer&&L.resolveDepthBuffer===!1&&(We.push(J),Le.push(J),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Le)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,We))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),de)for(let Se=0;Se<w.length;Se++){t.bindFramebuffer(s.FRAMEBUFFER,xe.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Se,s.RENDERBUFFER,xe.__webglColorRenderbuffer[Se]);const se=n.get(w[Se]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,xe.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Se,s.TEXTURE_2D,se,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,xe.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&c){const w=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[w])}}}function Qe(L){return Math.min(i.maxSamples,L.samples)}function Te(L){const w=n.get(L);return L.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function ze(L){const w=o.render.frame;u.get(L)!==w&&(u.set(L,w),L.update())}function yt(L,w){const T=L.colorSpace,j=L.format,ne=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||T!==ys&&T!==Zn&&(dt.getTransfer(T)===xt?(j!==Cn||ne!==Vn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",T)),w}function Ct(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(h.width=L.naturalWidth||L.width,h.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(h.width=L.displayWidth,h.height=L.displayHeight):(h.width=L.width,h.height=L.height),h}this.allocateTextureUnit=k,this.resetTextureUnits=P,this.setTexture2D=W,this.setTexture2DArray=B,this.setTexture3D=Y,this.setTextureCube=O,this.rebindTextures=mt,this.setupRenderTarget=U,this.updateRenderTargetMipmap=ft,this.updateMultisampleRenderTarget=ve,this.setupDepthRenderbuffer=Ue,this.setupFrameBufferTexture=oe,this.useMultisampledRTT=Te}function Hv(s,e){function t(n,i=Zn){let r;const o=dt.getTransfer(i);if(n===Vn)return s.UNSIGNED_BYTE;if(n===yl)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Ml)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Ad)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===vd)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===md)return s.BYTE;if(n===gd)return s.SHORT;if(n===ir)return s.UNSIGNED_SHORT;if(n===bl)return s.INT;if(n===Bi)return s.UNSIGNED_INT;if(n===$n)return s.FLOAT;if(n===dr)return s.HALF_FLOAT;if(n===_d)return s.ALPHA;if(n===xd)return s.RGB;if(n===Cn)return s.RGBA;if(n===rr)return s.DEPTH_COMPONENT;if(n===or)return s.DEPTH_STENCIL;if(n===bd)return s.RED;if(n===El)return s.RED_INTEGER;if(n===yd)return s.RG;if(n===Sl)return s.RG_INTEGER;if(n===wl)return s.RGBA_INTEGER;if(n===ao||n===lo||n===co||n===ho)if(o===xt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===ao)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===lo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===co)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ho)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===ao)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===lo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===co)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ho)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Va||n===Ga||n===Ha||n===Wa)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Va)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ga)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ha)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Wa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Xa||n===Ya||n===qa)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Xa||n===Ya)return o===xt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===qa)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Ka||n===Qa||n===ja||n===Ja||n===Za||n===$a||n===el||n===tl||n===nl||n===il||n===sl||n===rl||n===ol||n===al)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ka)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Qa)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ja)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ja)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Za)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===$a)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===el)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===tl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===nl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===il)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===sl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===rl)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ol)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===al)return o===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ll||n===cl||n===hl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===ll)return o===xt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===cl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===hl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===dl||n===ul||n===fl||n===pl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===dl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ul)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===fl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===pl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===sr?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}const Wv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Xv=`
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

}`;class Yv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Fd(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Gn({vertexShader:Wv,fragmentShader:Xv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new lt(new ws(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class qv extends Ss{constructor(e,t){super();const n=this;let i=null,r=1,o=null,a="local-floor",c=1,h=null,u=null,l=null,d=null,f=null,A=null;const g=typeof XRWebGLBinding<"u",p=new Yv,m={},M=t.getContextAttributes();let S=null,y=null;const D=[],v=[],E=new tt;let R=null;const x=new Sn;x.viewport=new Ut;const b=new Sn;b.viewport=new Ut;const I=[x,b],P=new pm;let k=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let $=D[q];return $===void 0&&($=new ca,D[q]=$),$.getTargetRaySpace()},this.getControllerGrip=function(q){let $=D[q];return $===void 0&&($=new ca,D[q]=$),$.getGripSpace()},this.getHand=function(q){let $=D[q];return $===void 0&&($=new ca,D[q]=$),$.getHandSpace()};function W(q){const $=v.indexOf(q.inputSource);if($===-1)return;const oe=D[$];oe!==void 0&&(oe.update(q.inputSource,q.frame,h||o),oe.dispatchEvent({type:q.type,data:q.inputSource}))}function B(){i.removeEventListener("select",W),i.removeEventListener("selectstart",W),i.removeEventListener("selectend",W),i.removeEventListener("squeeze",W),i.removeEventListener("squeezestart",W),i.removeEventListener("squeezeend",W),i.removeEventListener("end",B),i.removeEventListener("inputsourceschange",Y);for(let q=0;q<D.length;q++){const $=v[q];$!==null&&(v[q]=null,D[q].disconnect($))}k=null,G=null,p.reset();for(const q in m)delete m[q];e.setRenderTarget(S),f=null,d=null,l=null,i=null,y=null,De.stop(),n.isPresenting=!1,e.setPixelRatio(R),e.setSize(E.width,E.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){r=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){a=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||o},this.setReferenceSpace=function(q){h=q},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return l===null&&g&&(l=new XRWebGLBinding(i,t)),l},this.getFrame=function(){return A},this.getSession=function(){return i},this.setSession=async function(q){if(i=q,i!==null){if(S=e.getRenderTarget(),i.addEventListener("select",W),i.addEventListener("selectstart",W),i.addEventListener("selectend",W),i.addEventListener("squeeze",W),i.addEventListener("squeezestart",W),i.addEventListener("squeezeend",W),i.addEventListener("end",B),i.addEventListener("inputsourceschange",Y),M.xrCompatible!==!0&&await t.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(E),g&&"createProjectionLayer"in XRWebGLBinding.prototype){let oe=null,fe=null,he=null;M.depth&&(he=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,oe=M.stencil?or:rr,fe=M.stencil?sr:Bi);const Ue={colorFormat:t.RGBA8,depthFormat:he,scaleFactor:r};l=this.getBinding(),d=l.createProjectionLayer(Ue),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new ki(d.textureWidth,d.textureHeight,{format:Cn,type:Vn,depthTexture:new Nd(d.textureWidth,d.textureHeight,fe,void 0,void 0,void 0,void 0,void 0,void 0,oe),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const oe={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,t,oe),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new ki(f.framebufferWidth,f.framebufferHeight,{format:Cn,type:Vn,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),h=null,o=await i.requestReferenceSpace(a),De.setContext(i),De.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function Y(q){for(let $=0;$<q.removed.length;$++){const oe=q.removed[$],fe=v.indexOf(oe);fe>=0&&(v[fe]=null,D[fe].disconnect(oe))}for(let $=0;$<q.added.length;$++){const oe=q.added[$];let fe=v.indexOf(oe);if(fe===-1){for(let Ue=0;Ue<D.length;Ue++)if(Ue>=v.length){v.push(oe),fe=Ue;break}else if(v[Ue]===null){v[Ue]=oe,fe=Ue;break}if(fe===-1)break}const he=D[fe];he&&he.connect(oe)}}const O=new H,ie=new H;function re(q,$,oe){O.setFromMatrixPosition($.matrixWorld),ie.setFromMatrixPosition(oe.matrixWorld);const fe=O.distanceTo(ie),he=$.projectionMatrix.elements,Ue=oe.projectionMatrix.elements,mt=he[14]/(he[10]-1),U=he[14]/(he[10]+1),ft=(he[9]+1)/he[5],We=(he[9]-1)/he[5],Le=(he[8]-1)/he[0],ve=(Ue[8]+1)/Ue[0],Qe=mt*Le,Te=mt*ve,ze=fe/(-Le+ve),yt=ze*-Le;if($.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(yt),q.translateZ(ze),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),he[10]===-1)q.projectionMatrix.copy($.projectionMatrix),q.projectionMatrixInverse.copy($.projectionMatrixInverse);else{const Ct=mt+ze,L=U+ze,w=Qe-yt,T=Te+(fe-yt),j=ft*U/L*Ct,ne=We*U/L*Ct;q.projectionMatrix.makePerspective(w,T,j,ne,Ct,L),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function Ae(q,$){$===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices($.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(i===null)return;let $=q.near,oe=q.far;p.texture!==null&&(p.depthNear>0&&($=p.depthNear),p.depthFar>0&&(oe=p.depthFar)),P.near=b.near=x.near=$,P.far=b.far=x.far=oe,(k!==P.near||G!==P.far)&&(i.updateRenderState({depthNear:P.near,depthFar:P.far}),k=P.near,G=P.far),P.layers.mask=q.layers.mask|6,x.layers.mask=P.layers.mask&3,b.layers.mask=P.layers.mask&5;const fe=q.parent,he=P.cameras;Ae(P,fe);for(let Ue=0;Ue<he.length;Ue++)Ae(he[Ue],fe);he.length===2?re(P,x,b):P.projectionMatrix.copy(x.projectionMatrix),Ve(q,P,fe)};function Ve(q,$,oe){oe===null?q.matrix.copy($.matrixWorld):(q.matrix.copy(oe.matrixWorld),q.matrix.invert(),q.matrix.multiply($.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy($.projectionMatrix),q.projectionMatrixInverse.copy($.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=ar*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return P},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(q){c=q,d!==null&&(d.fixedFoveation=q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=q)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(P)},this.getCameraTexture=function(q){return m[q]};let Me=null;function Q(q,$){if(u=$.getViewerPose(h||o),A=$,u!==null){const oe=u.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let fe=!1;oe.length!==P.cameras.length&&(P.cameras.length=0,fe=!0);for(let U=0;U<oe.length;U++){const ft=oe[U];let We=null;if(f!==null)We=f.getViewport(ft);else{const ve=l.getViewSubImage(d,ft);We=ve.viewport,U===0&&(e.setRenderTargetTextures(y,ve.colorTexture,ve.depthStencilTexture),e.setRenderTarget(y))}let Le=I[U];Le===void 0&&(Le=new Sn,Le.layers.enable(U),Le.viewport=new Ut,I[U]=Le),Le.matrix.fromArray(ft.transform.matrix),Le.matrix.decompose(Le.position,Le.quaternion,Le.scale),Le.projectionMatrix.fromArray(ft.projectionMatrix),Le.projectionMatrixInverse.copy(Le.projectionMatrix).invert(),Le.viewport.set(We.x,We.y,We.width,We.height),U===0&&(P.matrix.copy(Le.matrix),P.matrix.decompose(P.position,P.quaternion,P.scale)),fe===!0&&P.cameras.push(Le)}const he=i.enabledFeatures;if(he&&he.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&g){l=n.getBinding();const U=l.getDepthInformation(oe[0]);U&&U.isValid&&U.texture&&p.init(U,i.renderState)}if(he&&he.includes("camera-access")&&g){e.state.unbindTexture(),l=n.getBinding();for(let U=0;U<oe.length;U++){const ft=oe[U].camera;if(ft){let We=m[ft];We||(We=new Fd,m[ft]=We);const Le=l.getCameraImage(ft);We.sourceTexture=Le}}}}for(let oe=0;oe<D.length;oe++){const fe=v[oe],he=D[oe];fe!==null&&he!==void 0&&he.update(fe,$,h||o)}Me&&Me(q,$),$.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:$}),A=null}const De=new Bd;De.setAnimationLoop(Q),this.setAnimationLoop=function(q){Me=q},this.dispose=function(){}}}const Si=new ii,Kv=new Bt;function Qv(s,e){function t(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,Rd(s)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function i(p,m,M,S,y){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(p,m):m.isMeshToonMaterial?(r(p,m),l(p,m)):m.isMeshPhongMaterial?(r(p,m),u(p,m)):m.isMeshStandardMaterial?(r(p,m),d(p,m),m.isMeshPhysicalMaterial&&f(p,m,y)):m.isMeshMatcapMaterial?(r(p,m),A(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),g(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(o(p,m),m.isLineDashedMaterial&&a(p,m)):m.isPointsMaterial?c(p,m,M,S):m.isSpriteMaterial?h(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,t(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===tn&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,t(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===tn&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,t(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,t(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const M=e.get(m),S=M.envMap,y=M.envMapRotation;S&&(p.envMap.value=S,Si.copy(y),Si.x*=-1,Si.y*=-1,Si.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(Si.y*=-1,Si.z*=-1),p.envMapRotation.value.setFromMatrix4(Kv.makeRotationFromEuler(Si)),p.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,p.aoMapTransform))}function o(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform))}function a(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function c(p,m,M,S){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*M,p.scale.value=S*.5,m.map&&(p.map.value=m.map,t(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function u(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function l(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function d(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,M){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===tn&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=M.texture,p.transmissionSamplerSize.value.set(M.width,M.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,p.specularIntensityMapTransform))}function A(p,m){m.matcap&&(p.matcap.value=m.matcap)}function g(p,m){const M=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(M.matrixWorld),p.nearDistance.value=M.shadow.camera.near,p.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function jv(s,e,t,n){let i={},r={},o=[];const a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function c(M,S){const y=S.program;n.uniformBlockBinding(M,y)}function h(M,S){let y=i[M.id];y===void 0&&(A(M),y=u(M),i[M.id]=y,M.addEventListener("dispose",p));const D=S.program;n.updateUBOMapping(M,D);const v=e.render.frame;r[M.id]!==v&&(d(M),r[M.id]=v)}function u(M){const S=l();M.__bindingPointIndex=S;const y=s.createBuffer(),D=M.__size,v=M.usage;return s.bindBuffer(s.UNIFORM_BUFFER,y),s.bufferData(s.UNIFORM_BUFFER,D,v),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,S,y),y}function l(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){const S=i[M.id],y=M.uniforms,D=M.__cache;s.bindBuffer(s.UNIFORM_BUFFER,S);for(let v=0,E=y.length;v<E;v++){const R=Array.isArray(y[v])?y[v]:[y[v]];for(let x=0,b=R.length;x<b;x++){const I=R[x];if(f(I,v,x,D)===!0){const P=I.__offset,k=Array.isArray(I.value)?I.value:[I.value];let G=0;for(let W=0;W<k.length;W++){const B=k[W],Y=g(B);typeof B=="number"||typeof B=="boolean"?(I.__data[0]=B,s.bufferSubData(s.UNIFORM_BUFFER,P+G,I.__data)):B.isMatrix3?(I.__data[0]=B.elements[0],I.__data[1]=B.elements[1],I.__data[2]=B.elements[2],I.__data[3]=0,I.__data[4]=B.elements[3],I.__data[5]=B.elements[4],I.__data[6]=B.elements[5],I.__data[7]=0,I.__data[8]=B.elements[6],I.__data[9]=B.elements[7],I.__data[10]=B.elements[8],I.__data[11]=0):(B.toArray(I.__data,G),G+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,P,I.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(M,S,y,D){const v=M.value,E=S+"_"+y;if(D[E]===void 0)return typeof v=="number"||typeof v=="boolean"?D[E]=v:D[E]=v.clone(),!0;{const R=D[E];if(typeof v=="number"||typeof v=="boolean"){if(R!==v)return D[E]=v,!0}else if(R.equals(v)===!1)return R.copy(v),!0}return!1}function A(M){const S=M.uniforms;let y=0;const D=16;for(let E=0,R=S.length;E<R;E++){const x=Array.isArray(S[E])?S[E]:[S[E]];for(let b=0,I=x.length;b<I;b++){const P=x[b],k=Array.isArray(P.value)?P.value:[P.value];for(let G=0,W=k.length;G<W;G++){const B=k[G],Y=g(B),O=y%D,ie=O%Y.boundary,re=O+ie;y+=ie,re!==0&&D-re<Y.storage&&(y+=D-re),P.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=y,y+=Y.storage}}}const v=y%D;return v>0&&(y+=D-v),M.__size=y,M.__cache={},this}function g(M){const S={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(S.boundary=4,S.storage=4):M.isVector2?(S.boundary=8,S.storage=8):M.isVector3||M.isColor?(S.boundary=16,S.storage=12):M.isVector4?(S.boundary=16,S.storage=16):M.isMatrix3?(S.boundary=48,S.storage=48):M.isMatrix4?(S.boundary=64,S.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),S}function p(M){const S=M.target;S.removeEventListener("dispose",p);const y=o.indexOf(S.__bindingPointIndex);o.splice(y,1),s.deleteBuffer(i[S.id]),delete i[S.id],delete r[S.id]}function m(){for(const M in i)s.deleteBuffer(i[M]);o=[],i={},r={}}return{bind:c,update:h,dispose:m}}class Jv{constructor(e={}){const{canvas:t=Up(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:l=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;const A=new Uint32Array(4),g=new Int32Array(4);let p=null,m=null;const M=[],S=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=pi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const y=this;let D=!1;this._outputColorSpace=gn;let v=0,E=0,R=null,x=-1,b=null;const I=new Ut,P=new Ut;let k=null;const G=new $e(0);let W=0,B=t.width,Y=t.height,O=1,ie=null,re=null;const Ae=new Ut(0,0,B,Y),Ve=new Ut(0,0,B,Y);let Me=!1;const Q=new Ud;let De=!1,q=!1;const $=new Bt,oe=new H,fe=new Ut,he={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ue=!1;function mt(){return R===null?O:1}let U=n;function ft(C,V){return t.getContext(C,V)}try{const C={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:u,failIfMajorPerformanceCaveat:l};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${xl}`),t.addEventListener("webglcontextlost",ue,!1),t.addEventListener("webglcontextrestored",Ce,!1),t.addEventListener("webglcontextcreationerror",te,!1),U===null){const V="webgl2";if(U=ft(V,C),U===null)throw ft(V)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let We,Le,ve,Qe,Te,ze,yt,Ct,L,w,T,j,ne,J,xe,de,Ie,Se,se,ye,Ge,Pe,ge,Ye;function F(){We=new aA(U),We.init(),Pe=new Hv(U,We),Le=new eA(U,We,e,Pe),ve=new Vv(U,We),Le.reversedDepthBuffer&&d&&ve.buffers.depth.setReversed(!0),Qe=new hA(U),Te=new Cv,ze=new Gv(U,We,ve,Te,Le,Pe,Qe),yt=new nA(y),Ct=new oA(y),L=new gm(U),ge=new Z0(U,L),w=new lA(U,L,Qe,ge),T=new uA(U,w,L,Qe),se=new dA(U,Le,ze),de=new tA(Te),j=new Tv(y,yt,Ct,We,Le,ge,de),ne=new Qv(y,Te),J=new Dv,xe=new Fv(We),Se=new J0(y,yt,Ct,ve,T,f,c),Ie=new Ov(y,T,Le),Ye=new jv(U,Qe,Le,ve),ye=new $0(U,We,Qe),Ge=new cA(U,We,Qe),Qe.programs=j.programs,y.capabilities=Le,y.extensions=We,y.properties=Te,y.renderLists=J,y.shadowMap=Ie,y.state=ve,y.info=Qe}F();const ae=new qv(y,U);this.xr=ae,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const C=We.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=We.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return O},this.setPixelRatio=function(C){C!==void 0&&(O=C,this.setSize(B,Y,!1))},this.getSize=function(C){return C.set(B,Y)},this.setSize=function(C,V,X=!0){if(ae.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}B=C,Y=V,t.width=Math.floor(C*O),t.height=Math.floor(V*O),X===!0&&(t.style.width=C+"px",t.style.height=V+"px"),this.setViewport(0,0,C,V)},this.getDrawingBufferSize=function(C){return C.set(B*O,Y*O).floor()},this.setDrawingBufferSize=function(C,V,X){B=C,Y=V,O=X,t.width=Math.floor(C*X),t.height=Math.floor(V*X),this.setViewport(0,0,C,V)},this.getCurrentViewport=function(C){return C.copy(I)},this.getViewport=function(C){return C.copy(Ae)},this.setViewport=function(C,V,X,K){C.isVector4?Ae.set(C.x,C.y,C.z,C.w):Ae.set(C,V,X,K),ve.viewport(I.copy(Ae).multiplyScalar(O).round())},this.getScissor=function(C){return C.copy(Ve)},this.setScissor=function(C,V,X,K){C.isVector4?Ve.set(C.x,C.y,C.z,C.w):Ve.set(C,V,X,K),ve.scissor(P.copy(Ve).multiplyScalar(O).round())},this.getScissorTest=function(){return Me},this.setScissorTest=function(C){ve.setScissorTest(Me=C)},this.setOpaqueSort=function(C){ie=C},this.setTransparentSort=function(C){re=C},this.getClearColor=function(C){return C.copy(Se.getClearColor())},this.setClearColor=function(){Se.setClearColor(...arguments)},this.getClearAlpha=function(){return Se.getClearAlpha()},this.setClearAlpha=function(){Se.setClearAlpha(...arguments)},this.clear=function(C=!0,V=!0,X=!0){let K=0;if(C){let z=!1;if(R!==null){const le=R.texture.format;z=le===wl||le===Sl||le===El}if(z){const le=R.texture.type,_e=le===Vn||le===Bi||le===ir||le===sr||le===yl||le===Ml,Re=Se.getClearColor(),we=Se.getClearAlpha(),ke=Re.r,Be=Re.g,Ne=Re.b;_e?(A[0]=ke,A[1]=Be,A[2]=Ne,A[3]=we,U.clearBufferuiv(U.COLOR,0,A)):(g[0]=ke,g[1]=Be,g[2]=Ne,g[3]=we,U.clearBufferiv(U.COLOR,0,g))}else K|=U.COLOR_BUFFER_BIT}V&&(K|=U.DEPTH_BUFFER_BIT),X&&(K|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(K)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ue,!1),t.removeEventListener("webglcontextrestored",Ce,!1),t.removeEventListener("webglcontextcreationerror",te,!1),Se.dispose(),J.dispose(),xe.dispose(),Te.dispose(),yt.dispose(),Ct.dispose(),T.dispose(),ge.dispose(),Ye.dispose(),j.dispose(),ae.dispose(),ae.removeEventListener("sessionstart",gt),ae.removeEventListener("sessionend",St),Rn.stop()};function ue(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),D=!0}function Ce(){console.log("THREE.WebGLRenderer: Context Restored."),D=!1;const C=Qe.autoReset,V=Ie.enabled,X=Ie.autoUpdate,K=Ie.needsUpdate,z=Ie.type;F(),Qe.autoReset=C,Ie.enabled=V,Ie.autoUpdate=X,Ie.needsUpdate=K,Ie.type=z}function te(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function Z(C){const V=C.target;V.removeEventListener("dispose",Z),Ee(V)}function Ee(C){He(C),Te.remove(C)}function He(C){const V=Te.get(C).programs;V!==void 0&&(V.forEach(function(X){j.releaseProgram(X)}),C.isShaderMaterial&&j.releaseShaderCache(C))}this.renderBufferDirect=function(C,V,X,K,z,le){V===null&&(V=he);const _e=z.isMesh&&z.matrixWorld.determinant()<0,Re=Vi(C,V,X,K,z);ve.setMaterial(K,_e);let we=X.index,ke=1;if(K.wireframe===!0){if(we=w.getWireframeAttribute(X),we===void 0)return;ke=2}const Be=X.drawRange,Ne=X.attributes.position;let qe=Be.start*ke,ct=(Be.start+Be.count)*ke;le!==null&&(qe=Math.max(qe,le.start*ke),ct=Math.min(ct,(le.start+le.count)*ke)),we!==null?(qe=Math.max(qe,0),ct=Math.min(ct,we.count)):Ne!=null&&(qe=Math.max(qe,0),ct=Math.min(ct,Ne.count));const vt=ct-qe;if(vt<0||vt===1/0)return;ge.setup(z,K,Re,X,we);let _t,pt=ye;if(we!==null&&(_t=L.get(we),pt=Ge,pt.setIndex(_t)),z.isMesh)K.wireframe===!0?(ve.setLineWidth(K.wireframeLinewidth*mt()),pt.setMode(U.LINES)):pt.setMode(U.TRIANGLES);else if(z.isLine){let Oe=K.linewidth;Oe===void 0&&(Oe=1),ve.setLineWidth(Oe*mt()),z.isLineSegments?pt.setMode(U.LINES):z.isLineLoop?pt.setMode(U.LINE_LOOP):pt.setMode(U.LINE_STRIP)}else z.isPoints?pt.setMode(U.POINTS):z.isSprite&&pt.setMode(U.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)lr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),pt.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(We.get("WEBGL_multi_draw"))pt.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{const Oe=z._multiDrawStarts,wt=z._multiDrawCounts,Fe=z._multiDrawCount,qt=we?L.get(we).bytesPerElement:1,si=Te.get(K).currentProgram.getUniforms();for(let Et=0;Et<Fe;Et++)si.setValue(U,"_gl_DrawID",Et),pt.render(Oe[Et]/qt,wt[Et])}else if(z.isInstancedMesh)pt.renderInstances(qe,vt,z.count);else if(X.isInstancedBufferGeometry){const Oe=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,wt=Math.min(X.instanceCount,Oe);pt.renderInstances(qe,vt,wt)}else pt.render(qe,vt)};function et(C,V,X){C.transparent===!0&&C.side===ln&&C.forceSinglePass===!1?(C.side=tn,C.needsUpdate=!0,gi(C,V,X),C.side=ni,C.needsUpdate=!0,gi(C,V,X),C.side=ln):gi(C,V,X)}this.compile=function(C,V,X=null){X===null&&(X=C),m=xe.get(X),m.init(V),S.push(m),X.traverseVisible(function(z){z.isLight&&z.layers.test(V.layers)&&(m.pushLight(z),z.castShadow&&m.pushShadow(z))}),C!==X&&C.traverseVisible(function(z){z.isLight&&z.layers.test(V.layers)&&(m.pushLight(z),z.castShadow&&m.pushShadow(z))}),m.setupLights();const K=new Set;return C.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;const le=z.material;if(le)if(Array.isArray(le))for(let _e=0;_e<le.length;_e++){const Re=le[_e];et(Re,X,z),K.add(Re)}else et(le,X,z),K.add(le)}),m=S.pop(),K},this.compileAsync=function(C,V,X=null){const K=this.compile(C,V,X);return new Promise(z=>{function le(){if(K.forEach(function(_e){Te.get(_e).currentProgram.isReady()&&K.delete(_e)}),K.size===0){z(C);return}setTimeout(le,10)}We.get("KHR_parallel_shader_compile")!==null?le():setTimeout(le,10)})};let rt=null;function vn(C){rt&&rt(C)}function gt(){Rn.stop()}function St(){Rn.start()}const Rn=new Bd;Rn.setAnimationLoop(vn),typeof self<"u"&&Rn.setContext(self),this.setAnimationLoop=function(C){rt=C,ae.setAnimationLoop(C),C===null?Rn.stop():Rn.start()},ae.addEventListener("sessionstart",gt),ae.addEventListener("sessionend",St),this.render=function(C,V){if(V!==void 0&&V.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),V.parent===null&&V.matrixWorldAutoUpdate===!0&&V.updateMatrixWorld(),ae.enabled===!0&&ae.isPresenting===!0&&(ae.cameraAutoUpdate===!0&&ae.updateCamera(V),V=ae.getCamera()),C.isScene===!0&&C.onBeforeRender(y,C,V,R),m=xe.get(C,S.length),m.init(V),S.push(m),$.multiplyMatrices(V.projectionMatrix,V.matrixWorldInverse),Q.setFromProjectionMatrix($,zn,V.reversedDepth),q=this.localClippingEnabled,De=de.init(this.clippingPlanes,q),p=J.get(C,M.length),p.init(),M.push(p),ae.enabled===!0&&ae.isPresenting===!0){const le=y.xr.getDepthSensingMesh();le!==null&&rn(le,V,-1/0,y.sortObjects)}rn(C,V,0,y.sortObjects),p.finish(),y.sortObjects===!0&&p.sort(ie,re),Ue=ae.enabled===!1||ae.isPresenting===!1||ae.hasDepthSensing()===!1,Ue&&Se.addToRenderList(p,C),this.info.render.frame++,De===!0&&de.beginShadows();const X=m.state.shadowsArray;Ie.render(X,C,V),De===!0&&de.endShadows(),this.info.autoReset===!0&&this.info.reset();const K=p.opaque,z=p.transmissive;if(m.setupLights(),V.isArrayCamera){const le=V.cameras;if(z.length>0)for(let _e=0,Re=le.length;_e<Re;_e++){const we=le[_e];Cs(K,z,C,we)}Ue&&Se.render(C);for(let _e=0,Re=le.length;_e<Re;_e++){const we=le[_e];mi(p,C,we,we.viewport)}}else z.length>0&&Cs(K,z,C,V),Ue&&Se.render(C),mi(p,C,V);R!==null&&E===0&&(ze.updateMultisampleRenderTarget(R),ze.updateRenderTargetMipmap(R)),C.isScene===!0&&C.onAfterRender(y,C,V),ge.resetDefaultState(),x=-1,b=null,S.pop(),S.length>0?(m=S[S.length-1],De===!0&&de.setGlobalState(y.clippingPlanes,m.state.camera)):m=null,M.pop(),M.length>0?p=M[M.length-1]:p=null};function rn(C,V,X,K){if(C.visible===!1)return;if(C.layers.test(V.layers)){if(C.isGroup)X=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(V);else if(C.isLight)m.pushLight(C),C.castShadow&&m.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||Q.intersectsSprite(C)){K&&fe.setFromMatrixPosition(C.matrixWorld).applyMatrix4($);const _e=T.update(C),Re=C.material;Re.visible&&p.push(C,_e,Re,X,fe.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||Q.intersectsObject(C))){const _e=T.update(C),Re=C.material;if(K&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),fe.copy(C.boundingSphere.center)):(_e.boundingSphere===null&&_e.computeBoundingSphere(),fe.copy(_e.boundingSphere.center)),fe.applyMatrix4(C.matrixWorld).applyMatrix4($)),Array.isArray(Re)){const we=_e.groups;for(let ke=0,Be=we.length;ke<Be;ke++){const Ne=we[ke],qe=Re[Ne.materialIndex];qe&&qe.visible&&p.push(C,_e,qe,X,fe.z,Ne)}}else Re.visible&&p.push(C,_e,Re,X,fe.z,null)}}const le=C.children;for(let _e=0,Re=le.length;_e<Re;_e++)rn(le[_e],V,X,K)}function mi(C,V,X,K){const z=C.opaque,le=C.transmissive,_e=C.transparent;m.setupLightsView(X),De===!0&&de.setGlobalState(y.clippingPlanes,X),K&&ve.viewport(I.copy(K)),z.length>0&&zi(z,V,X),le.length>0&&zi(le,V,X),_e.length>0&&zi(_e,V,X),ve.buffers.depth.setTest(!0),ve.buffers.depth.setMask(!0),ve.buffers.color.setMask(!0),ve.setPolygonOffset(!1)}function Cs(C,V,X,K){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[K.id]===void 0&&(m.state.transmissionRenderTarget[K.id]=new ki(1,1,{generateMipmaps:!0,type:We.has("EXT_color_buffer_half_float")||We.has("EXT_color_buffer_float")?dr:Vn,minFilter:Ni,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:dt.workingColorSpace}));const le=m.state.transmissionRenderTarget[K.id],_e=K.viewport||I;le.setSize(_e.z*y.transmissionResolutionScale,_e.w*y.transmissionResolutionScale);const Re=y.getRenderTarget(),we=y.getActiveCubeFace(),ke=y.getActiveMipmapLevel();y.setRenderTarget(le),y.getClearColor(G),W=y.getClearAlpha(),W<1&&y.setClearColor(16777215,.5),y.clear(),Ue&&Se.render(X);const Be=y.toneMapping;y.toneMapping=pi;const Ne=K.viewport;if(K.viewport!==void 0&&(K.viewport=void 0),m.setupLightsView(K),De===!0&&de.setGlobalState(y.clippingPlanes,K),zi(C,X,K),ze.updateMultisampleRenderTarget(le),ze.updateRenderTargetMipmap(le),We.has("WEBGL_multisampled_render_to_texture")===!1){let qe=!1;for(let ct=0,vt=V.length;ct<vt;ct++){const _t=V[ct],pt=_t.object,Oe=_t.geometry,wt=_t.material,Fe=_t.group;if(wt.side===ln&&pt.layers.test(K.layers)){const qt=wt.side;wt.side=tn,wt.needsUpdate=!0,pe(pt,X,K,Oe,wt,Fe),wt.side=qt,wt.needsUpdate=!0,qe=!0}}qe===!0&&(ze.updateMultisampleRenderTarget(le),ze.updateRenderTargetMipmap(le))}y.setRenderTarget(Re,we,ke),y.setClearColor(G,W),Ne!==void 0&&(K.viewport=Ne),y.toneMapping=Be}function zi(C,V,X){const K=V.isScene===!0?V.overrideMaterial:null;for(let z=0,le=C.length;z<le;z++){const _e=C[z],Re=_e.object,we=_e.geometry,ke=_e.group;let Be=_e.material;Be.allowOverride===!0&&K!==null&&(Be=K),Re.layers.test(X.layers)&&pe(Re,V,X,we,Be,ke)}}function pe(C,V,X,K,z,le){C.onBeforeRender(y,V,X,K,z,le),C.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),z.onBeforeRender(y,V,X,K,C,le),z.transparent===!0&&z.side===ln&&z.forceSinglePass===!1?(z.side=tn,z.needsUpdate=!0,y.renderBufferDirect(X,V,K,z,C,le),z.side=ni,z.needsUpdate=!0,y.renderBufferDirect(X,V,K,z,C,le),z.side=ln):y.renderBufferDirect(X,V,K,z,C,le),C.onAfterRender(y,V,X,K,z,le)}function gi(C,V,X){V.isScene!==!0&&(V=he);const K=Te.get(C),z=m.state.lights,le=m.state.shadowsArray,_e=z.state.version,Re=j.getParameters(C,z.state,le,V,X),we=j.getProgramCacheKey(Re);let ke=K.programs;K.environment=C.isMeshStandardMaterial?V.environment:null,K.fog=V.fog,K.envMap=(C.isMeshStandardMaterial?Ct:yt).get(C.envMap||K.environment),K.envMapRotation=K.environment!==null&&C.envMap===null?V.environmentRotation:C.envMapRotation,ke===void 0&&(C.addEventListener("dispose",Z),ke=new Map,K.programs=ke);let Be=ke.get(we);if(Be!==void 0){if(K.currentProgram===Be&&K.lightsStateVersion===_e)return Ds(C,Re),Be}else Re.uniforms=j.getUniforms(C),C.onBeforeCompile(Re,y),Be=j.acquireProgram(Re,we),ke.set(we,Be),K.uniforms=Re.uniforms;const Ne=K.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Ne.clippingPlanes=de.uniform),Ds(C,Re),K.needsLights=Ls(C),K.lightsStateVersion=_e,K.needsLights&&(Ne.ambientLightColor.value=z.state.ambient,Ne.lightProbe.value=z.state.probe,Ne.directionalLights.value=z.state.directional,Ne.directionalLightShadows.value=z.state.directionalShadow,Ne.spotLights.value=z.state.spot,Ne.spotLightShadows.value=z.state.spotShadow,Ne.rectAreaLights.value=z.state.rectArea,Ne.ltc_1.value=z.state.rectAreaLTC1,Ne.ltc_2.value=z.state.rectAreaLTC2,Ne.pointLights.value=z.state.point,Ne.pointLightShadows.value=z.state.pointShadow,Ne.hemisphereLights.value=z.state.hemi,Ne.directionalShadowMap.value=z.state.directionalShadowMap,Ne.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Ne.spotShadowMap.value=z.state.spotShadowMap,Ne.spotLightMatrix.value=z.state.spotLightMatrix,Ne.spotLightMap.value=z.state.spotLightMap,Ne.pointShadowMap.value=z.state.pointShadowMap,Ne.pointShadowMatrix.value=z.state.pointShadowMatrix),K.currentProgram=Be,K.uniformsList=null,Be}function Rs(C){if(C.uniformsList===null){const V=C.currentProgram.getUniforms();C.uniformsList=uo.seqWithValue(V.seq,C.uniforms)}return C.uniformsList}function Ds(C,V){const X=Te.get(C);X.outputColorSpace=V.outputColorSpace,X.batching=V.batching,X.batchingColor=V.batchingColor,X.instancing=V.instancing,X.instancingColor=V.instancingColor,X.instancingMorph=V.instancingMorph,X.skinning=V.skinning,X.morphTargets=V.morphTargets,X.morphNormals=V.morphNormals,X.morphColors=V.morphColors,X.morphTargetsCount=V.morphTargetsCount,X.numClippingPlanes=V.numClippingPlanes,X.numIntersection=V.numClipIntersection,X.vertexAlphas=V.vertexAlphas,X.vertexTangents=V.vertexTangents,X.toneMapping=V.toneMapping}function Vi(C,V,X,K,z){V.isScene!==!0&&(V=he),ze.resetTextureUnits();const le=V.fog,_e=K.isMeshStandardMaterial?V.environment:null,Re=R===null?y.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:ys,we=(K.isMeshStandardMaterial?Ct:yt).get(K.envMap||_e),ke=K.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Be=!!X.attributes.tangent&&(!!K.normalMap||K.anisotropy>0),Ne=!!X.morphAttributes.position,qe=!!X.morphAttributes.normal,ct=!!X.morphAttributes.color;let vt=pi;K.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(vt=y.toneMapping);const _t=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,pt=_t!==void 0?_t.length:0,Oe=Te.get(K),wt=m.state.lights;if(De===!0&&(q===!0||C!==b)){const Vt=C===b&&K.id===x;de.setState(K,C,Vt)}let Fe=!1;K.version===Oe.__version?(Oe.needsLights&&Oe.lightsStateVersion!==wt.state.version||Oe.outputColorSpace!==Re||z.isBatchedMesh&&Oe.batching===!1||!z.isBatchedMesh&&Oe.batching===!0||z.isBatchedMesh&&Oe.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&Oe.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&Oe.instancing===!1||!z.isInstancedMesh&&Oe.instancing===!0||z.isSkinnedMesh&&Oe.skinning===!1||!z.isSkinnedMesh&&Oe.skinning===!0||z.isInstancedMesh&&Oe.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&Oe.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&Oe.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&Oe.instancingMorph===!1&&z.morphTexture!==null||Oe.envMap!==we||K.fog===!0&&Oe.fog!==le||Oe.numClippingPlanes!==void 0&&(Oe.numClippingPlanes!==de.numPlanes||Oe.numIntersection!==de.numIntersection)||Oe.vertexAlphas!==ke||Oe.vertexTangents!==Be||Oe.morphTargets!==Ne||Oe.morphNormals!==qe||Oe.morphColors!==ct||Oe.toneMapping!==vt||Oe.morphTargetsCount!==pt)&&(Fe=!0):(Fe=!0,Oe.__version=K.version);let qt=Oe.currentProgram;Fe===!0&&(qt=gi(K,V,z));let si=!1,Et=!1,Lt=!1;const Mt=qt.getUniforms(),on=Oe.uniforms;if(ve.useProgram(qt.program)&&(si=!0,Et=!0,Lt=!0),K.id!==x&&(x=K.id,Et=!0),si||b!==C){ve.buffers.depth.getReversed()&&C.reversedDepth!==!0&&(C._reversedDepth=!0,C.updateProjectionMatrix()),Mt.setValue(U,"projectionMatrix",C.projectionMatrix),Mt.setValue(U,"viewMatrix",C.matrixWorldInverse);const kt=Mt.map.cameraPosition;kt!==void 0&&kt.setValue(U,oe.setFromMatrixPosition(C.matrixWorld)),Le.logarithmicDepthBuffer&&Mt.setValue(U,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(K.isMeshPhongMaterial||K.isMeshToonMaterial||K.isMeshLambertMaterial||K.isMeshBasicMaterial||K.isMeshStandardMaterial||K.isShaderMaterial)&&Mt.setValue(U,"isOrthographic",C.isOrthographicCamera===!0),b!==C&&(b=C,Et=!0,Lt=!0)}if(z.isSkinnedMesh){Mt.setOptional(U,z,"bindMatrix"),Mt.setOptional(U,z,"bindMatrixInverse");const Vt=z.skeleton;Vt&&(Vt.boneTexture===null&&Vt.computeBoneTexture(),Mt.setValue(U,"boneTexture",Vt.boneTexture,ze))}z.isBatchedMesh&&(Mt.setOptional(U,z,"batchingTexture"),Mt.setValue(U,"batchingTexture",z._matricesTexture,ze),Mt.setOptional(U,z,"batchingIdTexture"),Mt.setValue(U,"batchingIdTexture",z._indirectTexture,ze),Mt.setOptional(U,z,"batchingColorTexture"),z._colorsTexture!==null&&Mt.setValue(U,"batchingColorTexture",z._colorsTexture,ze));const an=X.morphAttributes;if((an.position!==void 0||an.normal!==void 0||an.color!==void 0)&&se.update(z,X,qt),(Et||Oe.receiveShadow!==z.receiveShadow)&&(Oe.receiveShadow=z.receiveShadow,Mt.setValue(U,"receiveShadow",z.receiveShadow)),K.isMeshGouraudMaterial&&K.envMap!==null&&(on.envMap.value=we,on.flipEnvMap.value=we.isCubeTexture&&we.isRenderTargetTexture===!1?-1:1),K.isMeshStandardMaterial&&K.envMap===null&&V.environment!==null&&(on.envMapIntensity.value=V.environmentIntensity),Et&&(Mt.setValue(U,"toneMappingExposure",y.toneMappingExposure),Oe.needsLights&&mr(on,Lt),le&&K.fog===!0&&ne.refreshFogUniforms(on,le),ne.refreshMaterialUniforms(on,K,O,Y,m.state.transmissionRenderTarget[C.id]),uo.upload(U,Rs(Oe),on,ze)),K.isShaderMaterial&&K.uniformsNeedUpdate===!0&&(uo.upload(U,Rs(Oe),on,ze),K.uniformsNeedUpdate=!1),K.isSpriteMaterial&&Mt.setValue(U,"center",z.center),Mt.setValue(U,"modelViewMatrix",z.modelViewMatrix),Mt.setValue(U,"normalMatrix",z.normalMatrix),Mt.setValue(U,"modelMatrix",z.matrixWorld),K.isShaderMaterial||K.isRawShaderMaterial){const Vt=K.uniformsGroups;for(let kt=0,Gi=Vt.length;kt<Gi;kt++){const Wn=Vt[kt];Ye.update(Wn,qt),Ye.bind(Wn,qt)}}return qt}function mr(C,V){C.ambientLightColor.needsUpdate=V,C.lightProbe.needsUpdate=V,C.directionalLights.needsUpdate=V,C.directionalLightShadows.needsUpdate=V,C.pointLights.needsUpdate=V,C.pointLightShadows.needsUpdate=V,C.spotLights.needsUpdate=V,C.spotLightShadows.needsUpdate=V,C.rectAreaLights.needsUpdate=V,C.hemisphereLights.needsUpdate=V}function Ls(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return v},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(C,V,X){const K=Te.get(C);K.__autoAllocateDepthBuffer=C.resolveDepthBuffer===!1,K.__autoAllocateDepthBuffer===!1&&(K.__useRenderToTexture=!1),Te.get(C.texture).__webglTexture=V,Te.get(C.depthTexture).__webglTexture=K.__autoAllocateDepthBuffer?void 0:X,K.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(C,V){const X=Te.get(C);X.__webglFramebuffer=V,X.__useDefaultFramebuffer=V===void 0};const Is=U.createFramebuffer();this.setRenderTarget=function(C,V=0,X=0){R=C,v=V,E=X;let K=!0,z=null,le=!1,_e=!1;if(C){const we=Te.get(C);if(we.__useDefaultFramebuffer!==void 0)ve.bindFramebuffer(U.FRAMEBUFFER,null),K=!1;else if(we.__webglFramebuffer===void 0)ze.setupRenderTarget(C);else if(we.__hasExternalTextures)ze.rebindTextures(C,Te.get(C.texture).__webglTexture,Te.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const Ne=C.depthTexture;if(we.__boundDepthTexture!==Ne){if(Ne!==null&&Te.has(Ne)&&(C.width!==Ne.image.width||C.height!==Ne.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ze.setupDepthRenderbuffer(C)}}const ke=C.texture;(ke.isData3DTexture||ke.isDataArrayTexture||ke.isCompressedArrayTexture)&&(_e=!0);const Be=Te.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(Be[V])?z=Be[V][X]:z=Be[V],le=!0):C.samples>0&&ze.useMultisampledRTT(C)===!1?z=Te.get(C).__webglMultisampledFramebuffer:Array.isArray(Be)?z=Be[X]:z=Be,I.copy(C.viewport),P.copy(C.scissor),k=C.scissorTest}else I.copy(Ae).multiplyScalar(O).floor(),P.copy(Ve).multiplyScalar(O).floor(),k=Me;if(X!==0&&(z=Is),ve.bindFramebuffer(U.FRAMEBUFFER,z)&&K&&ve.drawBuffers(C,z),ve.viewport(I),ve.scissor(P),ve.setScissorTest(k),le){const we=Te.get(C.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+V,we.__webglTexture,X)}else if(_e){const we=V;for(let ke=0;ke<C.textures.length;ke++){const Be=Te.get(C.textures[ke]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+ke,Be.__webglTexture,X,we)}}else if(C!==null&&X!==0){const we=Te.get(C.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,we.__webglTexture,X)}x=-1},this.readRenderTargetPixels=function(C,V,X,K,z,le,_e,Re=0){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let we=Te.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&_e!==void 0&&(we=we[_e]),we){ve.bindFramebuffer(U.FRAMEBUFFER,we);try{const ke=C.textures[Re],Be=ke.format,Ne=ke.type;if(!Le.textureFormatReadable(Be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Le.textureTypeReadable(Ne)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}V>=0&&V<=C.width-K&&X>=0&&X<=C.height-z&&(C.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+Re),U.readPixels(V,X,K,z,Pe.convert(Be),Pe.convert(Ne),le))}finally{const ke=R!==null?Te.get(R).__webglFramebuffer:null;ve.bindFramebuffer(U.FRAMEBUFFER,ke)}}},this.readRenderTargetPixelsAsync=async function(C,V,X,K,z,le,_e,Re=0){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let we=Te.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&_e!==void 0&&(we=we[_e]),we)if(V>=0&&V<=C.width-K&&X>=0&&X<=C.height-z){ve.bindFramebuffer(U.FRAMEBUFFER,we);const ke=C.textures[Re],Be=ke.format,Ne=ke.type;if(!Le.textureFormatReadable(Be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Le.textureTypeReadable(Ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const qe=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,qe),U.bufferData(U.PIXEL_PACK_BUFFER,le.byteLength,U.STREAM_READ),C.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+Re),U.readPixels(V,X,K,z,Pe.convert(Be),Pe.convert(Ne),0);const ct=R!==null?Te.get(R).__webglFramebuffer:null;ve.bindFramebuffer(U.FRAMEBUFFER,ct);const vt=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await Np(U,vt,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,qe),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,le),U.deleteBuffer(qe),U.deleteSync(vt),le}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(C,V=null,X=0){const K=Math.pow(2,-X),z=Math.floor(C.image.width*K),le=Math.floor(C.image.height*K),_e=V!==null?V.x:0,Re=V!==null?V.y:0;ze.setTexture2D(C,0),U.copyTexSubImage2D(U.TEXTURE_2D,X,0,0,_e,Re,z,le),ve.unbindTexture()};const To=U.createFramebuffer(),Co=U.createFramebuffer();this.copyTextureToTexture=function(C,V,X=null,K=null,z=0,le=null){le===null&&(z!==0?(lr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),le=z,z=0):le=0);let _e,Re,we,ke,Be,Ne,qe,ct,vt;const _t=C.isCompressedTexture?C.mipmaps[le]:C.image;if(X!==null)_e=X.max.x-X.min.x,Re=X.max.y-X.min.y,we=X.isBox3?X.max.z-X.min.z:1,ke=X.min.x,Be=X.min.y,Ne=X.isBox3?X.min.z:0;else{const an=Math.pow(2,-z);_e=Math.floor(_t.width*an),Re=Math.floor(_t.height*an),C.isDataArrayTexture?we=_t.depth:C.isData3DTexture?we=Math.floor(_t.depth*an):we=1,ke=0,Be=0,Ne=0}K!==null?(qe=K.x,ct=K.y,vt=K.z):(qe=0,ct=0,vt=0);const pt=Pe.convert(V.format),Oe=Pe.convert(V.type);let wt;V.isData3DTexture?(ze.setTexture3D(V,0),wt=U.TEXTURE_3D):V.isDataArrayTexture||V.isCompressedArrayTexture?(ze.setTexture2DArray(V,0),wt=U.TEXTURE_2D_ARRAY):(ze.setTexture2D(V,0),wt=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,V.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,V.unpackAlignment);const Fe=U.getParameter(U.UNPACK_ROW_LENGTH),qt=U.getParameter(U.UNPACK_IMAGE_HEIGHT),si=U.getParameter(U.UNPACK_SKIP_PIXELS),Et=U.getParameter(U.UNPACK_SKIP_ROWS),Lt=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,_t.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,_t.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,ke),U.pixelStorei(U.UNPACK_SKIP_ROWS,Be),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Ne);const Mt=C.isDataArrayTexture||C.isData3DTexture,on=V.isDataArrayTexture||V.isData3DTexture;if(C.isDepthTexture){const an=Te.get(C),Vt=Te.get(V),kt=Te.get(an.__renderTarget),Gi=Te.get(Vt.__renderTarget);ve.bindFramebuffer(U.READ_FRAMEBUFFER,kt.__webglFramebuffer),ve.bindFramebuffer(U.DRAW_FRAMEBUFFER,Gi.__webglFramebuffer);for(let Wn=0;Wn<we;Wn++)Mt&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Te.get(C).__webglTexture,z,Ne+Wn),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Te.get(V).__webglTexture,le,vt+Wn)),U.blitFramebuffer(ke,Be,_e,Re,qe,ct,_e,Re,U.DEPTH_BUFFER_BIT,U.NEAREST);ve.bindFramebuffer(U.READ_FRAMEBUFFER,null),ve.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(z!==0||C.isRenderTargetTexture||Te.has(C)){const an=Te.get(C),Vt=Te.get(V);ve.bindFramebuffer(U.READ_FRAMEBUFFER,To),ve.bindFramebuffer(U.DRAW_FRAMEBUFFER,Co);for(let kt=0;kt<we;kt++)Mt?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,an.__webglTexture,z,Ne+kt):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,an.__webglTexture,z),on?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Vt.__webglTexture,le,vt+kt):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Vt.__webglTexture,le),z!==0?U.blitFramebuffer(ke,Be,_e,Re,qe,ct,_e,Re,U.COLOR_BUFFER_BIT,U.NEAREST):on?U.copyTexSubImage3D(wt,le,qe,ct,vt+kt,ke,Be,_e,Re):U.copyTexSubImage2D(wt,le,qe,ct,ke,Be,_e,Re);ve.bindFramebuffer(U.READ_FRAMEBUFFER,null),ve.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else on?C.isDataTexture||C.isData3DTexture?U.texSubImage3D(wt,le,qe,ct,vt,_e,Re,we,pt,Oe,_t.data):V.isCompressedArrayTexture?U.compressedTexSubImage3D(wt,le,qe,ct,vt,_e,Re,we,pt,_t.data):U.texSubImage3D(wt,le,qe,ct,vt,_e,Re,we,pt,Oe,_t):C.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,le,qe,ct,_e,Re,pt,Oe,_t.data):C.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,le,qe,ct,_t.width,_t.height,pt,_t.data):U.texSubImage2D(U.TEXTURE_2D,le,qe,ct,_e,Re,pt,Oe,_t);U.pixelStorei(U.UNPACK_ROW_LENGTH,Fe),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,qt),U.pixelStorei(U.UNPACK_SKIP_PIXELS,si),U.pixelStorei(U.UNPACK_SKIP_ROWS,Et),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Lt),le===0&&V.generateMipmaps&&U.generateMipmap(wt),ve.unbindTexture()},this.initRenderTarget=function(C){Te.get(C).__webglFramebuffer===void 0&&ze.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?ze.setTextureCube(C,0):C.isData3DTexture?ze.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?ze.setTexture2DArray(C,0):ze.setTexture2D(C,0),ve.unbindTexture()},this.resetState=function(){v=0,E=0,R=null,ve.reset(),ge.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return zn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=dt._getDrawingBufferColorSpace(e),t.unpackColorSpace=dt._getUnpackColorSpace()}}let Ws=null,wi=2654435769;function Bl(){return wi^=wi<<13,wi^=wi>>>17,wi^=wi<<5,(wi>>>0)/4294967296}function Hn(){try{return Ws||(Ws=new(window.AudioContext||window.webkitAudioContext)),Ws.state==="suspended"&&Ws.resume(),Ws}catch{return null}}function Xt(s,e,t,n=.12,i="sine"){const r=Hn();if(!r)return;const o=r.createOscillator(),a=r.createGain();o.type=i,o.frequency.setValueAtTime(s,e),a.gain.setValueAtTime(0,e),a.gain.linearRampToValueAtTime(n,e+.01),a.gain.exponentialRampToValueAtTime(5e-4,e+t),o.connect(a).connect(r.destination),o.start(e),o.stop(e+t+.02)}function qr(s=.25){const e=Hn();if(!e)return;const t=1200*(1+(Bl()*2-1)*s);Xt(t,e.currentTime,.14,.08),Xt(t*2,e.currentTime,.08,.03)}function Kr(){const s=Hn();if(!s)return;const e=s.currentTime;for(const[t,n]of[523.25,659.25,783.99,1046.5].entries())Xt(n,e+t*.09,.22,.1,"triangle")}function Zv(s=1){const e=Hn();if(!e)return;const t=e.currentTime,n=Math.max(1,Math.min(5,s)),i=e.createOscillator(),r=e.createGain();i.type="sawtooth",i.frequency.setValueAtTime(90+20*n,t),i.frequency.exponentialRampToValueAtTime(400+160*n,t+.25),i.frequency.exponentialRampToValueAtTime(140+30*n,t+.9+.1*n),r.gain.setValueAtTime(0,t),r.gain.linearRampToValueAtTime(.05+.015*n,t+.05),r.gain.exponentialRampToValueAtTime(5e-4,t+1+.1*n),i.connect(r).connect(e.destination),i.start(t),i.stop(t+1.2+.1*n),Xt(1600+200*n,t,.12,.03)}function $v(){const s=Hn();if(!s)return;const e=s.currentTime;Xt(140,e,.12,.12,"square"),Xt(90,e+.02,.18,.1,"triangle")}function e_(){const s=Hn();if(!s)return;const e=s.currentTime;Xt(520+Bl()*80,e,.05,.1,"square"),Xt(250,e+.01,.08,.08,"triangle")}function va(){const s=Hn();if(!s)return;const e=s.currentTime;Xt(70,e,.45,.18,"sawtooth"),Xt(95,e+.08,.4,.12,"square"),Xt(55,e+.2,.5,.14,"triangle")}function t_(){const s=Hn();if(!s)return;const e=s.currentTime;for(let t=0;t<3;t++)Xt(880,e+t*.55,.5,.12,"sine"),Xt(1320,e+t*.55,.35,.05,"triangle")}function ch(){const s=Hn();if(!s)return;const e=s.currentTime;Xt(392,e,.3,.12,"square"),Xt(330,e+.3,.3,.12,"square"),Xt(262,e+.6,.6,.12,"square")}function n_(){const s=Hn();if(!s)return;const e=s.currentTime;Xt(60,e,.5,.2,"sawtooth"),Xt(38,e+.02,.7,.16,"square");const t=s.createBuffer(1,Math.floor(s.sampleRate*.35),s.sampleRate),n=t.getChannelData(0);for(let o=0;o<n.length;o++)n[o]=(Bl()*2-1)*(1-o/n.length);const i=s.createBufferSource(),r=s.createGain();i.buffer=t,r.gain.setValueAtTime(.18,e),r.gain.exponentialRampToValueAtTime(5e-4,e+.35),i.connect(r).connect(s.destination),i.start(e)}const _a=.18,hh=3.2;class i_{prevButtons=[];lastActive=0;axis(e){const t=Math.abs(e);return t<_a?0:Math.sign(e)*((t-_a)/(1-_a))}poll(e,t){const n=typeof navigator.getGamepads=="function"?navigator.getGamepads():[],i=Array.from(n).find(l=>!!l&&l.connected);if(!i)return;const r=i.buttons.map(l=>l.pressed),o=l=>r[l]&&!this.prevButtons[l],a=this.axis(i.axes[0]??0),c=-this.axis(i.axes[1]??0),h=this.axis(i.axes[2]??0),u=this.axis(i.axes[3]??0);(a||c||h||u||r.some(Boolean))&&(this.lastActive=performance.now()),e.moveX+=a,e.moveZ+=c,e.lookDX+=h*hh*t,e.lookDY+=u*hh*t,r[0]&&(e.jump=!0),r[1]&&(e.sneak=!0),r[10]&&(e.sprint=!0),r[2]&&(e.guard=!0),r[7]&&(e.primary=!0),r[6]&&(e.secondaryHold=!0),o(6)&&(e.secondaryTap=!0),o(5)&&(e.slotDelta+=1),o(4)&&(e.slotDelta-=1),o(9)&&(e.toggleDebug=!0),this.prevButtons=r}dispose(){}}function Gd(s){s.moveX=0,s.moveZ=0,s.lookDX=0,s.lookDY=0,s.jump=!1,s.sneak=!1,s.sprint=!1,s.primary=!1,s.secondaryTap=!1,s.secondaryHold=!1,s.guard=!1,s.slotDelta=0,s.slotSelect=-1,s.toggleDebug=!1}function dh(){const s={};return Gd(s),s}class s_{state=dh();sources=[];paused=!1;add(e){this.sources.push(e)}frame(e){const t=this.state;if(Gd(t),this.paused){const i=dh();for(const r of this.sources)r.poll(i,e);return t}for(const i of this.sources)i.poll(t,e);const n=Math.hypot(t.moveX,t.moveZ);return n>1&&(t.moveX/=n,t.moveZ/=n),t}dispose(){for(const e of this.sources)e.dispose();this.sources.length=0}}const uh=.0022;class r_{constructor(e){this.element=e,document.addEventListener("pointerlockerror",this.onLockError),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp),window.addEventListener("blur",this.onBlur),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("mousedown",this.onMouseDown),document.addEventListener("mouseup",this.onMouseUp),document.addEventListener("wheel",this.onWheel,{passive:!0}),document.addEventListener("contextmenu",this.onContextMenu)}element;keys=new Set;lookDX=0;lookDY=0;primary=!1;secondaryHold=!1;secondaryTap=!1;slotDelta=0;slotSelect=-1;toggleDebug=!1;lastActive=0;lockFailed=!1;enabled=!1;onKeyDown=e=>{if(!e.repeat){if(this.lastActive=performance.now(),this.keys.add(e.code),e.code.startsWith("Digit")){const t=Number(e.code.slice(5));t>=1&&t<=9?this.slotSelect=t-1:t===0&&(this.slotSelect=9)}e.code==="F3"&&(this.toggleDebug=!0,e.preventDefault()),(e.code==="Space"||e.code==="Tab")&&e.preventDefault()}};onKeyUp=e=>{this.keys.delete(e.code)};onBlur=()=>{this.keys.clear(),this.primary=!1,this.secondaryHold=!1};onMouseMove=e=>{this.active&&(this.lookDX+=e.movementX*uh,this.lookDY+=e.movementY*uh)};onMouseDown=e=>{this.active&&(this.lastActive=performance.now(),e.button===0&&(this.primary=!0),e.button===2&&(this.secondaryHold=!0,this.secondaryTap=!0))};onMouseUp=e=>{e.button===0&&(this.primary=!1),e.button===2&&(this.secondaryHold=!1)};onWheel=e=>{this.active&&(e.deltaY>0?this.slotDelta++:e.deltaY<0&&this.slotDelta--)};onContextMenu=e=>e.preventDefault();onLockError=()=>{this.lockFailed=!0};get locked(){return document.pointerLockElement===this.element}get active(){return this.locked||this.lockFailed&&this.enabled}async requestLock(){if(this.locked)return!0;if(!this.element.requestPointerLock)return this.lockFailed=!0,!1;const e=this.element.requestPointerLock;try{await e.call(this.element,{unadjustedMovement:!0})}catch{try{await e.call(this.element)}catch{return this.lockFailed=!0,!1}}return await new Promise(t=>setTimeout(t,50)),this.locked?(this.lockFailed=!1,!0):(this.lockFailed=!0,!1)}down(...e){for(const t of e)if(this.keys.has(t))return!0;return!1}poll(e){this.down("KeyW","ArrowUp")&&(e.moveZ+=1),this.down("KeyS","ArrowDown")&&(e.moveZ-=1),this.down("KeyD","ArrowRight")&&(e.moveX+=1),this.down("KeyA","ArrowLeft")&&(e.moveX-=1),this.down("Space")&&(e.jump=!0),this.down("ShiftLeft","ShiftRight")&&(e.sneak=!0),this.down("ControlLeft","ControlRight")&&(e.sprint=!0),this.down("KeyX")&&(e.guard=!0),e.lookDX+=this.lookDX,e.lookDY+=this.lookDY,this.lookDX=0,this.lookDY=0,this.primary&&(e.primary=!0),this.secondaryHold&&(e.secondaryHold=!0),this.secondaryTap&&(e.secondaryTap=!0),this.secondaryTap=!1,e.slotDelta+=this.slotDelta,this.slotDelta=0,this.slotSelect>=0&&(e.slotSelect=this.slotSelect),this.slotSelect=-1,this.toggleDebug&&(e.toggleDebug=!0),this.toggleDebug=!1}dispose(){document.removeEventListener("pointerlockerror",this.onLockError),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),window.removeEventListener("blur",this.onBlur),document.removeEventListener("mousemove",this.onMouseMove),document.removeEventListener("mousedown",this.onMouseDown),document.removeEventListener("mouseup",this.onMouseUp),document.removeEventListener("wheel",this.onWheel),document.removeEventListener("contextmenu",this.onContextMenu)}}const o_=.0082,a_=.0056,Xs=56,l_=28,xa=.12,fh=220,c_=320,h_=14;class ba{constructor(e,t){this.el=e,this.onChange=t}el;onChange;held=!1;locked=!1;lockPending=!1;lastUp=0;get on(){return this.held||this.locked}press(e){if(this.locked){this.locked=!1,this.held=!1,this.lockPending=!1,this.lastUp=e,this.paint();return}this.lockPending=e-this.lastUp<=c_,this.held=!0,this.paint()}release(e){this.lastUp=e,this.lockPending&&(this.locked=!0,this.lockPending=!1),this.held=!1,this.paint()}clear(){this.held=this.locked=this.lockPending=!1,this.paint()}paint(){this.el.classList.toggle("active",this.on),this.el.classList.toggle("locked",this.locked),this.onChange?.(this.on)}}class d_{constructor(e){this.ui=e,this.jump=new ba(e.jumpButton),this.sneak=new ba(e.sneakButton,n=>e.onSneakToggle?.(n)),this.guard=new ba(e.guardButton);const t={passive:!1};e.surface.addEventListener("touchstart",this.onStart,t),e.surface.addEventListener("touchmove",this.onMove,t),e.surface.addEventListener("touchend",this.onEnd,t),e.surface.addEventListener("touchcancel",this.onEnd,t),e.jumpButton.addEventListener("touchstart",this.onJumpStart,t),e.jumpButton.addEventListener("touchend",this.onJumpEnd,t),e.jumpButton.addEventListener("touchcancel",this.onJumpEnd,t),e.sneakButton.addEventListener("touchstart",this.onSneakStart,t),e.sneakButton.addEventListener("touchend",this.onSneakEnd,t),e.sneakButton.addEventListener("touchcancel",this.onSneakEnd,t),e.guardButton.addEventListener("touchstart",this.onGuardStart,t),e.guardButton.addEventListener("touchend",this.onGuardEnd,t),e.guardButton.addEventListener("touchcancel",this.onGuardEnd,t),e.stickBase.hidden=!1}ui;stick=null;look=null;lookDX=0;lookDY=0;secondaryTap=!1;jump;sneak;guard;lastActive=0;stickCenter(){const e=this.ui.stickBase.getBoundingClientRect();return{cx:e.left+e.width/2,cy:e.top+e.height/2}}onStickArea(e,t){const n=this.ui.stickBase.getBoundingClientRect(),i=l_;return e>=n.left-i&&e<=n.right+i&&t>=n.top-i&&t<=n.bottom+i}onStart=e=>{let t=!1;for(const n of Array.from(e.changedTouches))if(!n.target?.closest?.(".hotbar, .tbtn, .sbtn, .topbar, .overlay, .help-panel, .action-card, .result-panel, .bag-panel, .chat-panel, .side-btns, .time-chip, .today-panel, .approval-card, .nest-panel, .chest-panel, .follow-bar, .plain-btn, .big-btn"))if(t=!0,this.stick===null&&this.onStickArea(n.clientX,n.clientY)){const{cx:i,cy:r}=this.stickCenter();this.stick={id:n.identifier,ox:i,oy:r,dx:0,dy:0},this.moveStick(n.clientX,n.clientY)}else this.look===null&&(this.look={id:n.identifier,startX:n.clientX,startY:n.clientY,lastX:n.clientX,lastY:n.clientY,startTime:performance.now(),mode:"undecided"});t&&(this.lastActive=performance.now(),e.preventDefault())};onMove=e=>{(this.stick||this.look)&&e.preventDefault();for(const t of Array.from(e.changedTouches))if(this.stick&&t.identifier===this.stick.id)this.moveStick(t.clientX,t.clientY);else if(this.look&&t.identifier===this.look.id){const n=this.look,i=t.clientX-n.lastX,r=t.clientY-n.lastY;n.lastX=t.clientX,n.lastY=t.clientY,n.mode==="undecided"&&Math.hypot(t.clientX-n.startX,t.clientY-n.startY)>h_&&(n.mode="look"),n.mode!=="undecided"&&(this.lookDX+=i*o_,this.lookDY+=r*a_)}};moveStick(e,t){if(!this.stick)return;let n=e-this.stick.ox,i=t-this.stick.oy;const r=Math.hypot(n,i);r>Xs&&(n*=Xs/r,i*=Xs/r),this.stick.dx=n,this.stick.dy=i,this.ui.stickKnob.style.transform=`translate(${n}px, ${i}px)`,this.ui.stickBase.classList.add("active")}onEnd=e=>{let t=!1;for(const n of Array.from(e.changedTouches))this.stick&&n.identifier===this.stick.id?(this.stick=null,this.ui.stickKnob.style.transform="translate(0px, 0px)",this.ui.stickBase.classList.remove("active"),t=!0):this.look&&n.identifier===this.look.id&&(this.look.mode==="undecided"&&performance.now()-this.look.startTime<fh&&(this.secondaryTap=!0),this.look=null,t=!0);t&&e.preventDefault()};onJumpStart=e=>{e.preventDefault(),this.lastActive=performance.now(),this.jump.press(this.lastActive)};onJumpEnd=e=>{e.preventDefault(),this.jump.release(performance.now())};onSneakStart=e=>{e.preventDefault(),this.lastActive=performance.now(),this.sneak.press(this.lastActive)};onSneakEnd=e=>{e.preventDefault(),this.sneak.release(performance.now())};onGuardStart=e=>{e.preventDefault(),this.lastActive=performance.now(),this.guard.press(this.lastActive)};onGuardEnd=e=>{e.preventDefault(),this.guard.release(performance.now())};clearHolds(){this.jump.clear(),this.sneak.clear(),this.guard.clear()}poll(e){if(this.stick){let t=this.stick.dx/Xs,n=-this.stick.dy/Xs;const i=Math.hypot(t,n);if(i<xa)t=n=0;else{const r=(i-xa)/(1-xa)/i;t*=r,n*=r}e.moveX+=t,e.moveZ+=n,n>.97&&(e.sprint=!0)}if(this.look){const t=this.look;t.mode==="undecided"&&performance.now()-t.startTime>=fh&&(t.mode="break"),t.mode==="break"&&(e.primary=!0)}e.lookDX+=this.lookDX,e.lookDY+=this.lookDY,this.lookDX=0,this.lookDY=0,this.secondaryTap&&(e.secondaryTap=!0),this.secondaryTap=!1,this.jump.on&&(e.jump=!0),this.sneak.on&&(e.sneak=!0),this.guard.on&&(e.guard=!0)}dispose(){const e=this.ui.surface;e.removeEventListener("touchstart",this.onStart),e.removeEventListener("touchmove",this.onMove),e.removeEventListener("touchend",this.onEnd),e.removeEventListener("touchcancel",this.onEnd),this.ui.jumpButton.removeEventListener("touchstart",this.onJumpStart),this.ui.jumpButton.removeEventListener("touchend",this.onJumpEnd),this.ui.jumpButton.removeEventListener("touchcancel",this.onJumpEnd),this.ui.sneakButton.removeEventListener("touchstart",this.onSneakStart),this.ui.sneakButton.removeEventListener("touchend",this.onSneakEnd),this.ui.sneakButton.removeEventListener("touchcancel",this.onSneakEnd),this.ui.guardButton.removeEventListener("touchstart",this.onGuardStart),this.ui.guardButton.removeEventListener("touchend",this.onGuardEnd),this.ui.guardButton.removeEventListener("touchcancel",this.onGuardEnd)}}const Hd=0,u_=1,f_=2,js=3;function p_(s,e){const t=e.get("missing")??0,n=i=>e.get(i)??t;return s.defs.map(i=>{if(i.id==="air"||!i.textures)return{layer:Hd,opaque:!1,castAO:!1,sameCull:!1,tex:[0,0,0,0,0,0],fluidKind:0,fluidHeight:0,panel:null,torch:null,egg:!1};const r=i.fluid==="water"||i.id==="ice",o=i.solid&&!i.transparent||i.fluid==="lava",a=r?js:o?u_:f_,[c,h,u]=i.textures,l=n(h);let d=null;if(i.door){const[f,A]=Jh[i.door.facing];if(!i.door.open)d=[f!==0?0:2,f<0||A<0?1:0];else{const g=i.door.hinge?-A:A,p=i.door.hinge?f:-f;d=[g!==0?0:2,g<0||p<0?0:1]}}return{panel:d,torch:i.torch?i.torch.wall:null,egg:i.shape==="egg",layer:a,opaque:o,castAO:o&&!i.fluid||i.id==="leaves",sameCull:i.transparent,tex:[l,l,n(c),n(u),l,l],fluidKind:i.fluid==="water"?1:i.fluid==="lava"?2:0,fluidHeight:i.fluid?(8-i.fluidLevel)/9:0}})}function ph(s){return`#${s.toString(16).padStart(6,"0")}`}function wn(s,e){const t=n=>Math.max(0,Math.min(255,Math.round(n*e)));return t(s>>16)<<16|t(s>>8&255)<<8|t(s&255)}function ui(s,e,t,n,i=.12){const r=s*73856093^e*19349663^t*83492791,o=1-i/2+(r>>>0)%100/100*i;return wn(n,o*(.9+.006*e))}const ps=s=>()=>s,Pt=(s,e=.12)=>(t,n,i)=>ui(t,n,i,s,e);function m_(s){let e=s*2654435761>>>0;return e^=e>>>15,e=e*2246822519>>>0,e^=e>>>13,e%1e4/1e4}class Nt{cells=new Map;get out(){return[...this.cells.values()]}box(e,t,n,i,r,o,a){for(let c=n;c<=i;c++)for(let h=r;h<=o;h++)for(let u=e;u<=t;u++)this.cells.set(`${u},${c},${h}`,{x:u,y:c,z:h,c:ph(a(u,c,h))});return this}dot(e,t,n,i){return this.cells.set(`${e},${t},${n}`,{x:e,y:t,z:n,c:ph(i)}),this}}function hn(s,e){return{v:s.out,pivot:e}}function Es(s,e,t,n,i,r,o){return[[-t,n],[t-s,n],[-t,i],[t-s,i]].map(([c,h])=>{const u=new Nt;return u.box(c,c+s-1,0,e-1,h,h+s-1,(l,d,f)=>o&&d>=e-o.rows?o.color(l,d,f):r(l,d,f)),hn(u,[c+s/2,e,h+s/2])})}function g_(s){const e=s<.34?"temperate":s<.67?"cold":"warm",t=e==="temperate"?4862752:e==="cold"?3877406:11569756,n=e==="temperate"?15658734:e==="cold"?5915698:15128511,i=(l,d,f)=>e==="warm"?d<=13?ui(l,d,f,n,.06):ui(l,d,f,t):e==="cold"?ui(l,d,f,(l*5+d*3+f*7>>>0)%9<2?n:t,.16):(l*7+d*3+f*5>>>0)%11<3?ui(l,d,f,n,.06):ui(l,d,f,t),r=new Nt().box(-6,5,12,21,-9,8,i).box(-2,1,11,11,2,7,Pt(15251881,.06)),o=Es(4,12,6,-7,4,Pt(e==="warm"?9071173:3811352)),a=new Nt().box(-4,3,16,23,-15,-10,i),c=e==="cold"?7230785:14202784;a.box(-4,3,16,18,-15,-15,Pt(c,.05)),a.dot(-2,17,-15,5913132).dot(1,17,-15,5913132),e==="cold"?a.box(-4,3,21,23,-15,-14,Pt(9071178,.14)):(a.dot(-3,21,-15,16777215).dot(-2,21,-15,1710618).dot(1,21,-15,1710618).dot(2,21,-15,16777215),e==="temperate"&&a.box(-1,0,19,23,-15,-15,Pt(15658734,.04)));const h=e==="cold"?3:2;a.box(-5-(e==="cold"?1:0),-5,22,21+h,-12,-11,ps(13684944)).box(4,4+(e==="cold"?1:0),22,21+h,-12,-11,ps(13684944));const u=new Nt().box(-1,0,15,21,9,9,Pt(t,.08)).dot(-1,15,9,2760212).dot(0,15,9,2760212);return{body:r.out,head:hn(a,[0,19,-10]),legs:o,tail:hn(u,[0,22,9]),wings:[],babyHead:1.5}}function A_(s){const e=s<.6?"temperate":s<.8?"cold":"warm",t=e==="temperate"?15770536:e==="cold"?15327958:12880506,n=e==="cold"?14984616:e==="warm"?11037278:14252672,i=(h,u,l)=>e==="warm"&&(h*3+u*7+l*5>>>0)%13<2?ui(h,u,l,9067080,.1):ui(h,u,l,t,.08),r=new Nt().box(-5,4,6,13,-8,7,i),o=Es(4,6,5,-6,3,i),a=new Nt().box(-4,3,8,15,-16,-9,i);a.box(-2,1,9,11,-17,-17,Pt(n,.04)),a.dot(-2,10,-17,wn(n,.7)).dot(1,10,-17,wn(n,.7)),a.dot(-4,13,-16,16777215).dot(-3,13,-16,1710618).dot(2,13,-16,1710618).dot(3,13,-16,16777215),a.box(-4,-4,16,16,-13,-12,i).box(3,3,16,16,-13,-12,i);const c=new Nt().box(0,0,11,13,8,8,Pt(t,.05)).dot(0,11,9,wn(t,.9));return{body:r.out,head:hn(a,[0,12,-9]),legs:o,tail:hn(c,[0,14,8]),wings:[],babyHead:1.5}}function v_(s,e=!1){const t=s<.55?15921906:s<.7?13224393:s<.8?9079434:s<.9?3092271:s<.97?7031339:15769792,n=t===3092271,i=n?7234649:14272688,r=Pt(t,n?.2:.1),o=Pt(i,.06),a=e?new Nt().box(-4,3,11,16,-8,7,o):new Nt().box(-5,4,10,17,-9,8,r),c=e?Es(4,11,5,-7,4,o):Es(4,10,5,-7,4,o,{rows:2,color:r}),h=new Nt().box(-3,2,12,17,-15,-10,o);e||h.box(-3,2,15,18,-13,-10,r),h.box(-3,2,12,13,-15,-15,Pt(wn(i,.85),.04)),h.dot(-2,15,-15,1710618).dot(1,15,-15,1710618),h.dot(-3,15,-15,n?13684944:16777215).dot(2,15,-15,n?13684944:16777215);const u=new Nt().box(-1,0,15,17,e?8:9,e?8:9,e?o:r);return{body:a.out,head:hn(h,[0,15,-10]),legs:c,tail:hn(u,[0,18,9]),wings:[],babyHead:1.5}}function __(s){const e=s<.5?"temperate":s<.75?"cold":"warm",n=Pt(e==="temperate"?16185078:e==="cold"?12569042:10119740,.08),i=e==="warm"?4862752:e==="cold"?9082787:14606046,r=new Nt().box(-3,2,5,10,-4,3,n);r.box(-2,1,9,11,4,5,Pt(i,.1)).box(-1,0,11,12,5,6,Pt(i,.1));const o=ps(15114812),a=[-2,1].map(u=>{const l=new Nt().box(u,u,0,4,0,0,o).box(u-1,u+1,0,0,-2,0,o);return hn(l,[u+.5,5,.5])}),c=new Nt().box(-2,1,9,14,-7,-5,n);c.box(-2,1,10,11,-9,-8,ps(15114812)),c.box(-1,0,8,9,-9,-8,ps(15022389)),c.dot(-2,13,-7,1710618).dot(1,13,-7,1710618),e!=="cold"&&c.box(-1,0,15,15,-6,-5,ps(15022389));const h=[-4,3].map(u=>{const l=new Nt().box(u,u,7,10,-3,2,n);return hn(l,[u+.5,10,0])});return{body:r.out,head:hn(c,[0,9,-4]),legs:a,tail:null,wings:h,babyHead:1.4}}function x_(s){const e=s<.7?13158600:9136714,t=Pt(e,.14),n=new Nt().box(-3,2,8,13,-3,6,t);n.box(-4,3,8,14,-7,-1,Pt(wn(e,.93),.16)),n.box(-2,1,11,14,-8,-8,t);const i=Es(2,8,3,-5,4,t),r=new Nt().box(-3,2,10,15,-12,-9,t);r.box(-1,1,10,12,-16,-13,Pt(wn(e,.96),.06)),r.dot(-1,12,-16,1710618).dot(0,12,-16,1710618).dot(1,12,-16,1710618),r.dot(-3,14,-12,16777215).dot(-2,14,-12,1710618).dot(1,14,-12,1710618).dot(2,14,-12,16777215),r.box(-3,-2,16,17,-11,-11,t).box(1,2,16,17,-11,-11,t),r.dot(-2,16,-11,wn(e,.7)).dot(1,16,-11,wn(e,.7));const o=new Nt().box(-1,0,6,13,7,8,t).dot(-1,6,7,wn(e,.85)).dot(0,6,8,wn(e,.85));return{body:n.out,head:hn(r,[0,13,-9]),legs:i,tail:hn(o,[0,14,7]),wings:[],babyHead:1.5}}function b_(s,e,t={}){switch(s){case"cow":return g_(e);case"pig":return A_(e);case"sheep":return v_(e,t.sheared===!0);case"chicken":return __(e);case"horse":return Wd(e);default:return x_(e)}}function Wd(s){const e=s<.3?7031339:s<.5?2761760:s<.65?15262940:s<.85?9060130:9276813,t=s<.5?1840658:s<.65?13617856:2759184,n=Pt(e,.1),i=new Nt().box(-5,4,11,20,-10,11,n);i.box(-2,1,19,28,-14,-9,n),i.box(-1,0,25,30,-14,-9,Pt(t,.12));const r=Es(4,11,5,-8,7,n),o=new Nt().box(-3,2,24,31,-21,-13,n);o.box(-2,1,24,27,-23,-21,Pt(wn(e,.9),.06)),o.dot(-3,29,-17,1710618).dot(2,29,-17,1710618),o.box(-3,-2,31,33,-16,-15,n).box(1,2,31,33,-16,-15,n);const a=new Nt().box(-1,0,10,19,11,12,Pt(t,.12));return{body:i.out,head:hn(o,[0,27,-13]),legs:r,tail:hn(a,[0,19,11]),wings:[],babyHead:1.4}}function y_(s){const e=Wd(s);return[...e.body,...e.head.v,...e.legs.flatMap(t=>t.v),...e.tail?e.tail.v:[]]}function M_(){const s=[];for(let e=-3;e<=2;e++)for(let t=10;t<=15;t++)(e===-3||e===2||t===10||t===15)&&s.push({x:e,y:t,z:-8,c:"#e53935"});return s.push({x:-1,y:9,z:-8,c:"#ffd54f"},{x:0,y:9,z:-8,c:"#ffd54f"}),s}(function(s,e){typeof module=="object"&&module.exports?module.exports=e():s.DragonVoxels=e()})(typeof self<"u"?self:void 0,function(){function s(u,l,d,f){let A=u*374761393+l*668265263+d*2147483647+f*97|0;return A=(A^A>>>13)*1274126177,A=A^A>>>16,(A>>>0)%1e3/1e3}class e{constructor(){this.map=new Map}key(l,d,f){return l+","+d+","+f}set(l,d,f,A){d<0||this.map.set(this.key(l,d,f),{x:l,y:d,z:f,c:A})}get(l,d,f){return this.map.get(this.key(l,d,f))}box(l,d,f,A,g,p,m){for(let M=Math.min(l,A);M<=Math.max(l,A);M++)for(let S=Math.min(d,g);S<=Math.max(d,g);S++)for(let y=Math.min(f,p);y<=Math.max(f,p);y++)this.set(M,S,y,m)}mirror(){for(const l of Array.from(this.map.values()))l.x<0&&this.set(-l.x,l.y,l.z,l.c)}list(){return Array.from(this.map.values())}}function t(u){const l=new e,d=u.colors,f=u.seed;for(let v=-5;v<=5;v++){const E=Math.abs(v)>=5?1:2,R=7+(Math.abs(v)>=4?-1:0);for(let x=-E;x<=E;x++)for(let b=4;b<=R;b++){let I=d.body;b===4?I=d.belly:b===R&&s(x,b,v,f)<u.scaleNoise&&(I=d.dark),l.set(x,b,v,I)}}for(let v=-5;v<=4;v+=2)l.set(0,8,v,u.spineStyle==="blade"?d.accent:d.dark);if(u.spineStyle==="blade")for(let v=-4;v<=3;v+=2)l.set(0,9,v,d.accent);const A=[[6,6],[7,7],[8,8],[8,9]];for(const[v,E]of A)l.box(-1,E,v,1,E+1,v,d.body),l.set(0,E,v,d.belly);const g=9,p=9;l.box(-1,p,g,1,p+2,g+3,d.body),l.box(-1,p,g+4,1,p+1,g+5,d.body),l.box(-1,p,g+4,1,p,g+5,d.belly),l.set(-1,p+2,g+2,d.eye),l.set(1,p+2,g+2,d.eye),l.set(-1,p+2,g+3,d.eyeDark),l.set(1,p+2,g+3,d.eyeDark),l.set(-1,p,g+5,d.dark),l.set(1,p,g+5,d.dark),l.set(-1,p-1,g+5,d.tooth),l.set(1,p-1,g+5,d.tooth),u.horn==="spiky"?(l.box(-1,p+3,g,-1,p+4,g,d.accent),l.set(-2,p+5,g-1,d.accent),l.set(-1,p+5,g+1,d.accent),l.set(0,p+3,g+1,d.accent),l.set(0,p+4,g+1,d.accent)):u.horn==="ears"?(l.box(-2,p+2,g,-2,p+4,g+1,d.dark),l.set(-2,p+5,g+1,d.dark),l.set(0,p+3,g+2,d.accent)):u.horn==="blade"&&(l.set(0,p+3,g,d.accent),l.set(0,p+4,g-1,d.accent),l.set(0,p+5,g-2,d.accent),l.set(0,p+6,g-3,d.accent),l.set(-2,p+2,g+1,d.accent),l.set(-2,p+3,g,d.accent));for(const[v,E]of[[-2,3],[-2,-4]])l.box(v,1,E,v,4,E+1,d.body),l.box(v,0,E-1,v,0,E+1,d.dark),l.set(v,0,E+2,d.tooth),u.bulky&&l.box(v-1,3,E,v-1,4,E+1,d.body);[[-6,5],[-7,5],[-8,5],[-9,6],[-10,6],[-11,7],[-12,8]].forEach(([v,E],R)=>{const x=R<3?1:0;l.box(-x,E,v,x,E+(R<4?1:0),v,d.body),R%2===0&&R<5&&l.set(0,E+2,v,d.dark)}),u.tailTip==="leaf"?(l.box(-1,8,-13,1,9,-13,d.wing),l.set(0,10,-13,d.wing),l.set(0,8,-14,d.wing)):u.tailTip==="club"?l.box(-1,7,-13,1,9,-14,d.dark):u.tailTip==="blade"&&(l.set(0,9,-13,d.accent),l.set(0,10,-13,d.accent),l.set(0,8,-14,d.accent),l.set(0,9,-14,d.accent));const M=-2,S=7,y=1;function D(v,E,R,x){for(let P=1;P<=v;P++){const k=S+Math.round(P*E),G=y-Math.round(P*R),W=y+1-(P>v-2?1:0);for(let B=G;B<=W;B++){let Y=d.wing;B===W?Y=d.dark:(B-G)%3===0&&P>1&&(Y=d.wingVein),l.set(M-P,k,B,Y)}P===1&&l.set(M-P,k-1,y,d.dark)}const b=M-v-1,I=S+Math.round(v*E);x==="claw"&&(l.set(b,I,y+1,d.tooth),l.set(b,I+1,y+1,d.dark)),x==="spike"&&(l.set(b,I+1,y,d.accent),l.set(b-1,I+2,y,d.accent))}return u.wing==="leaf"&&D(8,.7,.9,"claw"),u.wing==="stub"&&D(4,.5,.6,"claw"),u.wing==="plate"&&D(6,.8,.7,"spike"),l.mirror(),l.list()}function n(u,l){const d=parseInt(u.slice(1),16),f=Math.min(255,Math.round((d>>16&255)*l)),A=Math.min(255,Math.round((d>>8&255)*l)),g=Math.min(255,Math.round((d&255)*l));return"#"+(f<<16|A<<8|g).toString(16).padStart(6,"0")}function i(u){const l=new e,d=Object.assign({},u.colors,{body:n(u.colors.body,.88),dark:n(u.colors.dark,.85),eye:u.colors.eye,glow:n(u.colors.eye,1.15)}),f=u.seed+7;for(let v=-8;v<=8;v++){const E=Math.abs(v)>=8?1:Math.abs(v)>=6?2:3,R=11-(Math.abs(v)>=6?1:0)-(Math.abs(v)>=8?1:0);for(let x=-E;x<=E;x++)for(let b=5;b<=R;b++){let I=d.body;b<=6&&Math.abs(x)<=1?I=d.belly:b===R&&s(x,b,v,f)<u.scaleNoise+.15&&(I=d.dark),u.armor&&b>=9&&Math.abs(x)===E&&(v+8)%3===0&&(I=d.dark),u.plates&&b===R&&(v+8)%2===0&&(I=d.accent),l.set(x,b,v,I)}}for(let v=-8;v<=6;v++){const E=(v+8)%2===0?2:1;for(let R=1;R<=E;R++)l.set(0,11+R,v,u.spineStyle==="blade"?d.accent:d.dark)}l.box(-4,9,1,-4,10,3,d.dark),l.box(-4,11,2,-4,11,2,d.accent);const A=[[9,8],[10,9],[11,10],[12,11],[13,12]];for(const[v,E]of A)l.box(-2,E,v,2,E+2,v,d.body),l.box(-1,E,v,1,E,v,d.belly),l.set(0,E+3,v,d.dark);const g=14,p=12;l.box(-2,p,g,2,p+3,g+4,d.body),l.box(-2,p+4,g+1,2,p+4,g+3,d.dark),l.box(-2,p,g+5,2,p+2,g+8,d.body),l.box(-2,p-1,g+5,2,p-1,g+8,d.belly);for(const v of[-2,2])l.set(v,p+3,g+3,d.glow),l.set(v,p+3,g+4,d.eyeDark),l.set(v,p+2,g+3,d.eye);l.set(-2,p+2,g+8,d.dark),l.set(2,p+2,g+8,d.dark);for(let v=g+5;v<=g+8;v++){const E=v%2===0?-2:2;l.set(E,p-2,v,d.tooth),l.set(-E,p-1,v,d.tooth)}if(l.set(-2,p-2,g+8,d.tooth),l.set(2,p-2,g+8,d.tooth),l.set(0,p-3,g+8,d.dark),u.horn==="spiky")for(const v of[-2,2])[[0,0],[1,-1],[2,-2],[3,-3],[4,-4]].forEach(([E,R],x)=>l.set(v+(v<0?-Math.floor(x/2):Math.floor(x/2)),p+4+E,g+R,d.accent)),l.set(v+(v<0?-2:2),p+9,g-4,d.wing),l.set(v+(v<0?-1:1),p+7,g-1,d.wing);else if(u.horn==="ears"){for(const v of[-3,3])l.box(v,p+2,g-1,v,p+6,g+2,d.dark),l.set(v,p+7,g+1,d.dark);l.box(-1,p+4,g+3,1,p+6,g+3,d.accent),l.set(0,p+7,g+3,d.accent)}else if(u.horn==="blade"){for(const v of[-1,1])[[0,0],[1,-1],[2,-2],[3,-3],[4,-4],[5,-5],[5,-6]].forEach(([E,R])=>l.set(v,p+4+E,g+R,d.accent));for(const v of[-3,3])l.set(v,p+3,g+1,d.accent),l.set(v,p+4,g,d.accent),l.set(v,p+5,g-1,d.accent)}for(const[v,E]of[[-3,5],[-3,-6]]){l.box(v,1,E,v+1,5,E+1,d.body),u.bulky,l.box(v-1,4,E,v-1,6,E+1,d.body),l.box(v,0,E-1,v+1,0,E+2,d.dark);for(const R of[E-1,E+1,E+3])l.set(v,0,R+(R===E+3,0),d.tooth);l.set(v+1,0,E+3,d.tooth)}if([[-9,6,2],[-10,6,2],[-11,6,1],[-12,7,1],[-13,7,1],[-14,8,1],[-15,9,0],[-16,10,0],[-17,11,0],[-18,12,0]].forEach(([v,E,R],x)=>{l.box(-R,E,v,R,E+(R?1:0),v,d.body),x%2===0&&l.set(0,E+(R?2:1),v,d.dark)}),u.tailTip==="leaf")l.box(-2,12,-19,2,14,-19,d.wing),l.box(-1,15,-19,1,15,-19,d.wing),l.set(0,13,-20,d.wingVein),l.set(0,16,-19,d.wing);else if(u.tailTip==="club")l.box(-2,11,-19,2,14,-21,d.dark),l.set(0,15,-20,d.dark),l.set(-2,12,-22,d.tooth),l.set(2,12,-22,d.tooth);else if(u.tailTip==="blade"){for(let v=0;v<=4;v++)l.set(0,12+v,-19-Math.floor(v/2),d.accent);l.set(0,11,-19,d.accent),l.set(0,13,-21,d.accent)}const M=-3,S=10,y=1;function D(v,E,R,x){for(let P=1;P<=v;P++){const k=S+Math.round(P*E),G=y-Math.round(P*R)-1,W=y+2-(P>v-3?Math.ceil((P-(v-3))/2):0);for(let B=G;B<=W;B++){let Y=d.wing;B===W||B===W-1&&P<=2?Y=d.dark:(B-G)%4===0&&P>1?Y=d.wingVein:P===v&&B===G&&(Y=d.dark),l.set(M-P,k,B,Y)}P<=2&&l.box(M-P,k-1,y,M-P,k-1,y+1,d.dark),P%4===0&&(l.set(M-P,k,G-1,d.dark),l.set(M-P,k-1,G-1,d.tooth))}const b=M-v-1,I=S+Math.round(v*E);x==="claw"&&(l.set(b,I,y+2,d.dark),l.set(b-1,I,y+2,d.tooth),l.set(b,I+1,y+1,d.dark)),x==="spike"&&(l.set(b,I+1,y+1,d.accent),l.set(b-1,I+2,y+1,d.accent),l.set(b-2,I+3,y+1,d.accent))}return u.wing==="leaf"&&D(14,.6,1,"claw"),u.wing==="stub"&&D(9,.5,.8,"claw"),u.wing==="plate"&&D(12,.8,.8,"spike"),l.mirror(),l.list()}function r(u,l){return l==="adult"?i(u):t(u)}const o={wood:{id:"wood",name:"나무 드래곤",tier:1,colorName:"갈색",recipe:"나무 원목 5, 나무 묘목 1~2, 나뭇잎 2",signature:"나무 세우기",beam:"약한 녹색 빔",seed:11,scaleNoise:.25,horn:"spiky",wing:"leaf",tailTip:"leaf",spineStyle:"thorn",bulky:!1,colors:{body:"#8B5A2B",belly:"#C9A066",dark:"#5C3A1A",accent:"#3E2A14",wing:"#5CA83A",wingVein:"#3F7F28",eye:"#D9F25A",eyeDark:"#1F2A0F",tooth:"#F4EFE1"}},earth:{id:"earth",name:"대지 드래곤",tier:2,colorName:"회색",recipe:"흙 2, 돌 2",signature:"흙과 돌 떨어뜨리기",beam:"약한 회색 빔",seed:22,scaleNoise:.4,horn:"ears",wing:"stub",tailTip:"club",spineStyle:"thorn",bulky:!0,armor:!0,colors:{body:"#7F7F7F",belly:"#B0B0B0",dark:"#555555",accent:"#6B4A2B",wing:"#8E8E8E",wingVein:"#6A6A6A",eye:"#F2B84B",eyeDark:"#2A1E0A",tooth:"#F4EFE1"}},iron:{id:"iron",name:"철 드래곤",tier:3,colorName:"은색",recipe:"철 2",signature:"철 블록 날리기",beam:"약간 센 은색 빔",seed:33,scaleNoise:.15,horn:"blade",wing:"plate",tailTip:"blade",spineStyle:"blade",bulky:!1,plates:!0,colors:{body:"#9AA4AD",belly:"#CDD5DB",dark:"#5F6A73",accent:"#3F4A53",wing:"#B7C1C9",wingVein:"#7F8B94",eye:"#57D3F5",eyeDark:"#0D2B36",tooth:"#F7FAFC"}},cake:{id:"cake",name:"케이크 드래곤",tier:4,colorName:"분홍·크림",recipe:"케이크 2",signature:"케이크 던지기",beam:"달콤한 분홍 빔",seed:44,scaleNoise:.2,horn:"ears",wing:"stub",tailTip:"club",spineStyle:"thorn",bulky:!0,colors:{body:"#F4A7C3",belly:"#FFF3E0",dark:"#C9789A",accent:"#8B2E52",wing:"#FFE08A",wingVein:"#D9A93E",eye:"#FF4F79",eyeDark:"#4A1020",tooth:"#FFFFFF"}},gold:{id:"gold",name:"금 드래곤",tier:5,colorName:"금색",recipe:"금 2",signature:"금 블록 소환",beam:"눈부신 금빛 빔",seed:55,scaleNoise:.15,horn:"blade",wing:"plate",tailTip:"blade",spineStyle:"blade",bulky:!1,plates:!0,colors:{body:"#E2B32B",belly:"#FFE27A",dark:"#B8860B",accent:"#8A6508",wing:"#F5D66B",wingVein:"#B8860B",eye:"#FF6F3C",eyeDark:"#3A1A00",tooth:"#FFF8E1"}},diamond:{id:"diamond",name:"다이아몬드 드래곤",tier:6,colorName:"하늘·청록",recipe:"다이아몬드 2",signature:"다이아몬드 창",beam:"반짝이는 청록 빔",seed:77,scaleNoise:.15,horn:"blade",wing:"plate",tailTip:"blade",spineStyle:"blade",bulky:!1,plates:!0,colors:{body:"#5FD3E6",belly:"#C8F7FF",dark:"#2FA3B8",accent:"#1B6C7D",wing:"#9FE9F5",wingVein:"#3FB6CC",eye:"#FFFFFF",eyeDark:"#0B3A44",tooth:"#FFFFFF"}},netherite:{id:"netherite",name:"네더라이트 드래곤",tier:7,colorName:"어두운 갈색·금",recipe:"네더라이트 2",signature:"네더라이트 갑옷",beam:"무거운 검붉은 빔",seed:88,scaleNoise:.3,horn:"blade",wing:"plate",tailTip:"blade",spineStyle:"blade",bulky:!0,armor:!0,plates:!0,colors:{body:"#4A3B3F",belly:"#6B5A5F",dark:"#2C2124",accent:"#B58B5A",wing:"#5A484D",wingVein:"#8A6B4A",eye:"#FF9A3C",eyeDark:"#2A0F00",tooth:"#E8E0DA"}},fire:{id:"fire",name:"화염 드래곤",tier:8,colorName:"빨강·주황",recipe:"용암 양동이 1, 블레이즈 막대기 2, 가스트의 눈물 1",signature:"불 뿜기",beam:"뜨거운 주황 빔",seed:99,scaleNoise:.3,horn:"spiky",wing:"leaf",tailTip:"blade",spineStyle:"thorn",bulky:!1,colors:{body:"#E0562A",belly:"#FFB347",dark:"#A83415",accent:"#FFE04D",wing:"#FF7A2A",wingVein:"#B53A0C",eye:"#FFF176",eyeDark:"#4A1500",tooth:"#FFF3E0"}},ice:{id:"ice",name:"아이스 드래곤",tier:9,colorName:"하늘·하양",recipe:"얼음 2, 눈 블록 2",signature:"얼리기",beam:"차가운 하늘색 빔",seed:111,scaleNoise:.2,horn:"spiky",wing:"plate",tailTip:"blade",spineStyle:"blade",bulky:!1,colors:{body:"#8FD3F4",belly:"#E6F9FF",dark:"#5AA9D6",accent:"#FFFFFF",wing:"#BFEAFF",wingVein:"#7FC4E8",eye:"#1F5FBF",eyeDark:"#0A2A5C",tooth:"#FFFFFF"}},water:{id:"water",name:"워터 드래곤",tier:10,colorName:"파랑",recipe:"물 양동이 1",signature:"물살",beam:"푸른 물 빔",seed:122,scaleNoise:.25,horn:"ears",wing:"leaf",tailTip:"club",spineStyle:"thorn",bulky:!1,colors:{body:"#2F80D6",belly:"#8CC8FF",dark:"#1F5AA0",accent:"#1B3F73",wing:"#5CA9F0",wingVein:"#2F6FB8",eye:"#B3FFF7",eyeDark:"#062B4A",tooth:"#EAF6FF"}},time:{id:"time",name:"타임 드래곤",tier:11,colorName:"청동",recipe:"시계 4",signature:"시간 멈추기",beam:"반짝이는 청동 빔",seed:133,scaleNoise:.2,horn:"ears",wing:"stub",tailTip:"club",spineStyle:"thorn",bulky:!1,colors:{body:"#B08D57",belly:"#E6D3A3",dark:"#7A5C2E",accent:"#3F2E12",wing:"#D4B36A",wingVein:"#8C6D35",eye:"#37E0FF",eyeDark:"#0B2A33",tooth:"#F4EFE1"}},teleport:{id:"teleport",name:"텔레포트 드래곤",tier:12,colorName:"검정·연보라",recipe:"엔더 진주 2",signature:"순간이동",beam:"보라 빔",seed:144,scaleNoise:.3,horn:"spiky",wing:"leaf",tailTip:"blade",spineStyle:"thorn",bulky:!1,colors:{body:"#1A1A22",belly:"#3D2B4F",dark:"#0D0D12",accent:"#9B59FF",wing:"#2B1F3D",wingVein:"#B47CFF",eye:"#D65CFF",eyeDark:"#2A0A4A",tooth:"#EDE7F6"}},healing:{id:"healing",name:"치유 드래곤",tier:13,colorName:"분홍·빨강",recipe:"치유의 물약 6",signature:"치유",beam:"따뜻한 분홍 빔",seed:155,scaleNoise:.15,horn:"ears",wing:"leaf",tailTip:"club",spineStyle:"thorn",bulky:!1,colors:{body:"#F06292",belly:"#FFD6E3",dark:"#C2185B",accent:"#FFFFFF",wing:"#FF9EBE",wingVein:"#D8467A",eye:"#7CFFB2",eyeDark:"#0D3D22",tooth:"#FFFFFF"}},earthquake:{id:"earthquake",name:"어스퀘이크 드래곤",tier:14,colorName:"갈색·주황",recipe:"곡괭이 6종",signature:"지진",beam:"땅을 흔드는 갈색 빔",seed:166,scaleNoise:.4,horn:"ears",wing:"stub",tailTip:"club",spineStyle:"thorn",bulky:!0,armor:!0,colors:{body:"#8D6E4A",belly:"#C9A97A",dark:"#5A4229",accent:"#E08A2E",wing:"#A67C52",wingVein:"#6E4E2E",eye:"#FFB300",eyeDark:"#3A2000",tooth:"#F4EFE1"}},explosion:{id:"explosion",name:"폭발 드래곤",tier:15,colorName:"빨강·검정",recipe:"TNT 2, 위더 스켈레톤 머리 3",signature:"폭발",beam:"터지는 빨간 빔",seed:177,scaleNoise:.35,horn:"spiky",wing:"leaf",tailTip:"blade",spineStyle:"thorn",bulky:!0,colors:{body:"#B71C1C",belly:"#E57373",dark:"#7F0000",accent:"#212121",wing:"#D32F2F",wingVein:"#7F0000",eye:"#FFEB3B",eyeDark:"#3A2A00",tooth:"#F4EFE1"}},ender:{id:"ender",name:"엔더 드래곤",tier:16,colorName:"검정·보라",recipe:"드래곤의 숨결 4, 엔더 드래곤의 알 1",signature:"드래곤의 숨결 뿌리기",beam:"가장 강력한 보라·검정 빔",seed:66,scaleNoise:.35,horn:"blade",wing:"plate",tailTip:"blade",spineStyle:"blade",bulky:!0,armor:!0,plates:!0,colors:{body:"#1E1B24",belly:"#3A2F4A",dark:"#0F0D14",accent:"#5B2E91",wing:"#2A2136",wingVein:"#6D3FB3",eye:"#E040FB",eyeDark:"#3A0F5C",tooth:"#EDE7F6"},_note:"우리 게임의 엔더 드래곤 — 아들 설계(티어 16, 검정·보라 빔, 엔더맨 군대)를 우리 생성기 골격으로 만든 자체 디자인"}};function a(u,l){const d=o[u];return l=l||"baby",{...h(d),stage:l,voxels:r(d,l)}}function c(u){const l=o[u];return{...h(l),baby:r(l,"baby"),adult:r(l,"adult")}}function h(u){const{seed:l,scaleNoise:d,horn:f,wing:A,tailTip:g,spineStyle:p,bulky:m,armor:M,plates:S,colors:y,...D}=u;return{...D,colors:y}}return{DRAGONS:o,build:r,model:a,modelBoth:c,stages:["baby","adult"],ids:Object.keys(o)}});const Qr=globalThis.DragonVoxels,mh=new Map;function E_(s,e){const t=`${s}/${e}`;let n=mh.get(t);if(!n){const i=Qr?.DRAGONS[s]??Qr?.DRAGONS.wood;n=Qr&&i?Qr.build(i,e):[],mh.set(t,n)}return n}const gh=[{n:[1,0,0],shade:.78,corners:[[1,0,0],[1,1,0],[1,1,1],[1,0,1]]},{n:[-1,0,0],shade:.72,corners:[[0,0,1],[0,1,1],[0,1,0],[0,0,0]]},{n:[0,1,0],shade:1,corners:[[0,1,0],[0,1,1],[1,1,1],[1,1,0]]},{n:[0,-1,0],shade:.5,corners:[[0,0,1],[0,0,0],[1,0,0],[1,0,1]]},{n:[0,0,1],shade:.88,corners:[[0,0,1],[1,0,1],[1,1,1],[0,1,1]]},{n:[0,0,-1],shade:.84,corners:[[1,0,0],[0,0,0],[0,1,0],[1,1,0]]}];function Oi(s,e,t){const n=new Set(s.map(h=>`${h.x},${h.y},${h.z}`)),i=[],r=[],o=[],a=new $e;for(const h of s){a.set(h.c);for(let u=0;u<gh.length;u++){const l=gh[u];if(n.has(`${h.x+l.n[0]},${h.y+l.n[1]},${h.z+l.n[2]}`))continue;const d=t?.[u]??l.shade,f=i.length/3;for(const[A,g,p]of l.corners)i.push((h.x+A)*e,(h.y+g)*e,(h.z+p)*e),r.push(a.r*d,a.g*d,a.b*d);o.push(f,f+1,f+2,f,f+2,f+3)}}const c=new dn;return c.setAttribute("position",new Wt(i,3)),c.setAttribute("color",new Wt(r,3)),c.setIndex(o),c.translate(-.5*e,0,-.5*e),c.computeBoundingBox(),c}const S_=1/16,jr=.55,Ah=new Map;function Xd(s,e){const t=`${s}/${e}`;let n=Ah.get(t);return n||(n=Oi(E_(s,e),S_),Ah.set(t,n)),n}const kl=new Ht({vertexColors:!0});function Yd(s,e){return new lt(Xd(s,e),kl)}let vh=null;function qd(s){return s!=="horse"?Yd(s,"adult"):(vh??=Oi(y_(.1),bt,hr),new lt(vh,kl))}function Kd(s){return s==="horse"?{seatY:bf,turn:0}:{seatY:Zh,turn:Math.PI}}class w_{group=new Dt;mesh=null;t=0;constructor(e){this.group.visible=!1,e.add(this.group)}get active(){return this.mesh!==null}seat={seatY:Zh,turn:Math.PI};set(e){this.mesh&&(this.group.remove(this.mesh),this.mesh=null),e&&(this.mesh=qd(e),this.seat=Kd(e),this.group.add(this.mesh)),this.group.visible=e!==null}update(e,t){this.mesh&&(this.t+=t,this.group.position.set(e.pos.x,e.pos.y-this.seat.seatY,e.pos.z),this.group.rotation.y=e.yaw+this.seat.turn,this.mesh.scale.set(1,1+.015*Math.sin(this.t*2.5),1))}}class T_{group=new Dt;entries=new Map;t=0;constructor(e){e.add(this.group)}get visible(){return this.group.visible}set visible(e){this.group.visible=e}get count(){return this.entries.size}sync(e){const t=new Set;for(const n of e){t.add(n.id);const i=this.entries.get(n.id);if(i&&i.info.stage===n.stage&&i.info.perch.x===n.perch.x&&i.info.perch.z===n.perch.z&&i.info.owner===n.owner){i.info=n;continue}i&&this.dispose(i),this.entries.set(n.id,this.make(n))}for(const[n,i]of this.entries)t.has(n)||(this.dispose(i),this.entries.delete(n))}make(e){const t=Xd(e.dragon,e.stage),n=new lt(t,kl),i=t.boundingBox?t.boundingBox.max.y:1,r=new Dt;r.add(n);const o=cr(e.owner,e.mine?"rgba(40,120,40,0.55)":"rgba(0,0,0,0.45)",.28);o.position.y=i+.25,r.add(o);const a=cr("💤","rgba(0,0,0,0)",.4);return a.position.y=i*jr+.35,a.visible=!1,r.add(a),r.position.set(e.perch.x+.5,e.perch.y,e.perch.z+.5),r.rotation.y=e.yaw,this.group.add(r),{info:e,group:r,mesh:n,label:o,zz:a,phase:e.id*1.7%(Math.PI*2),height:i}}dispose(e){this.group.remove(e.group);for(const t of[e.label,e.zz])t.material.map?.dispose(),t.material.dispose()}update(e,t){if(!(!this.group.visible||this.entries.size===0)){this.t+=e;for(const n of this.entries.values()){const i=this.t+n.phase,r=(n.info.restingUntil??0)>t;if(r){const o=1+.02*Math.sin(i*.7);n.mesh.scale.set(1.06,jr*o,1.06),n.mesh.rotation.z=.1,n.group.position.y=n.info.perch.y,n.group.rotation.y=n.info.yaw,n.zz.position.y=n.height*jr+.35+.06*Math.sin(i*1.2),n.label.position.y=n.height*jr+.7}else{const o=1+.025*Math.sin(i*1.6);n.mesh.scale.set(1,o,1),n.mesh.rotation.z=0;const a=Math.max(0,Math.sin(i*.9))**8;n.group.position.y=n.info.perch.y+a*(n.info.stage==="adult"?.12:.08),n.group.rotation.y=n.info.yaw+.18*Math.sin(i*.35),n.label.position.y=n.height+.25}n.zz.visible=r}}}}const _h=.05,C_=new $e(1,.86,.68),xh=new $e;function R_(s,e,t){const n=cd(s)/15*e,i=hd(s)/15,r=_h+(1-_h)*Math.pow(Math.max(n,i),1.5);return t.set(16777215).lerp(C_,Math.max(0,Math.min(1,i-n))),r}const Jr=32*bt;function Ti(s,e){const t=Oi(s,bt,hr);return t.translate(bt/2,0,bt/2),new lt(t,e)}function cr(s,e="rgba(0,0,0,0.45)",t=.55){const n=document.createElement("canvas"),i=n.getContext("2d");i.font="bold 40px system-ui, sans-serif";const r=Math.ceil(i.measureText(s).width)+32;n.width=r,n.height=56,i.font="bold 40px system-ui, sans-serif",i.fillStyle=e,i.fillRect(0,0,r,56),i.fillStyle="#fff",i.textBaseline="middle",i.fillText(s,16,30);const o=new So(n);o.minFilter=An;const a=new Ll(new Dl({map:o,depthTest:!0,transparent:!0}));return a.scale.set(r/56*t,t,1),a}class D_{group=new Dt;figures=new Map;iconOf=null;constructor(e){e.add(this.group)}get count(){return this.figures.size}upsert(e){this.remove(e.idx);const t=$h(vu(e.color)),n=new Ht({vertexColors:!0}),i=new Dt,r=new Dt,o=(A,g)=>(A.position.set(g[0]*bt,g[1]*bt,0),A),a=o(Ti(t.torso,n),Xi.torso),c=o(Ti(t.head,n),Xi.head),h=o(Ti(t.leg,n),Xi.legL),u=o(Ti(t.leg,n),Xi.legR),l=o(Ti(t.arm,n),Xi.armL),d=o(Ti(t.arm,n),Xi.armR);r.add(a,c,h,u,l,d),i.add(r);const f=cr(e.nick);f.position.y=Jr+.3,i.add(f),i.position.set(e.x,e.y,e.z),r.rotation.y=e.yaw,this.group.add(i),this.figures.set(e.idx,{info:e,group:i,body:r,label:f,torso:a,head:c,legL:h,legR:u,armL:l,armR:d,held:null,armor:[],target:{x:e.x,y:e.y,z:e.z,yaw:e.yaw,pitch:e.pitch,flags:0},cur:{x:e.x,y:e.y,z:e.z,yaw:e.yaw},walk:0,guarding:!1,lastMove:0,bubble:null,mount:null,material:n,lum:1}),e.riding&&this.setMount(e.idx,e.riding),e.held&&this.setHeld(e.idx,e.held),e.equip&&this.setEquip(e.idx,e.equip)}positionOf(e){const t=this.figures.get(e);return t?{x:t.cur.x,y:t.cur.y,z:t.cur.z}:null}setGuarding(e,t){const n=this.figures.get(e);n&&(n.guarding=t)}setEquip(e,t){const n=this.figures.get(e);if(!n)return;for(const c of n.armor)c.parent?.remove(c),c.geometry.dispose();n.armor=[];const i=Ca(di,t);n.info.equip=i;const r=hf(i),o=n.torso,a=(c,h)=>{if(!c||h.length===0)return;const u=Ti(h,n.material);c.add(u),n.armor.push(u)};a(n.head,r.head),a(o,r.torso),a(n.armL,r.armL),a(n.armR,r.armR),a(n.legL,r.legL),a(n.legR,r.legR),i.shield&&a(n.armL,df())}setHeld(e,t){const n=this.figures.get(e);if(!n)return;if(n.held){n.armR.remove(n.held),n.held.geometry.dispose();const a=n.held.material;a.map?.dispose(),a.dispose(),n.held=null}if(n.info.held=t,!t||!this.iconOf)return;const i=this.iconOf(t);if(!i)return;const r=new So(i);r.minFilter=An,r.magFilter=nn;const o=new lt(new ws(.42,.42),new Ht({map:r,transparent:!0,alphaTest:.2,side:ln}));o.position.set(1.5*bt,-11*bt,-3*bt),o.rotation.set(-.35,.45,0),n.armR.add(o),n.held=o}setMount(e,t){const n=this.figures.get(e);if(n&&(n.mount&&(n.body.remove(n.mount),n.mount=null),t)){const i=qd(t.dragon),r=Kd(t.dragon);i.material=n.material,i.position.y=-r.seatY,i.rotation.y=r.turn,n.body.add(i),n.mount=i}}say(e,t,n=3){const i=this.figures.get(e);if(!i)return;this.clearBubble(i);const r=cr(t,"rgba(255,255,255,0.92)");r.material.color.setHex(2236979),r.position.y=Jr+.8,i.group.add(r),i.bubble={sprite:r,until:performance.now()+n*1e3}}clearBubble(e){e.bubble&&(e.group.remove(e.bubble.sprite),e.bubble.sprite.material.map?.dispose(),e.bubble.sprite.material.dispose(),e.bubble=null)}remove(e){const t=this.figures.get(e);t&&(this.clearBubble(t),this.setMount(e,null),this.group.remove(t.group),t.material.dispose(),t.group.traverse(n=>{n instanceof lt&&n.geometry.dispose(),n instanceof Ll&&(n.material.map?.dispose(),n.material.dispose())}),this.figures.delete(e))}indices(){return[...this.figures.keys()]}nickOf(e){return this.figures.get(e)?.info.nick}setState(e,t){for(const n of e){if(n.idx===t)continue;const i=this.figures.get(n.idx);i&&(i.target.x=n.x,i.target.y=n.y,i.target.z=n.z,i.target.yaw=n.yaw,i.target.pitch=n.pitch,i.target.flags=n.flags)}}update(e,t,n=1){const i=1-Math.exp(-e*14);for(const r of this.figures.values()){const o=r.cur,a=r.target,c=a.x-o.x,h=a.z-o.z;o.x+=c*i,o.y+=(a.y-o.y)*i,o.z+=h*i;let u=a.yaw-o.yaw;u=Math.atan2(Math.sin(u),Math.cos(u)),o.yaw+=u*i,r.group.position.set(o.x,o.y,o.z),r.body.rotation.y=o.yaw,r.head.rotation.x=-a.pitch*.6;const l=Math.hypot(c,h)*14;l>.3&&(r.walk+=e*Math.min(12,l*2.2));const d=(a.flags&ed)!==0,f=l>.3&&!d?Math.sin(r.walk)*.55:0;r.legL.rotation.x=f,r.legR.rotation.x=-f,r.armL.rotation.x=r.guarding?-1.3:-f,r.armL.rotation.y=r.guarding?.35:0,r.armR.rotation.x=f;const A=(a.flags&td)!==0;if(r.body.scale.y=A?.85:1,r.label.position.y=(A?Jr*.85:Jr)+.3,t){const g=R_(t.get(Math.floor(o.x),Math.floor(o.y+1),Math.floor(o.z)),n,xh);r.lum+=(g-r.lum)*i,r.material.color.copy(xh).multiplyScalar(r.lum)}r.bubble&&performance.now()>r.bubble.until&&this.clearBubble(r)}}dispose(){for(const e of[...this.figures.keys()])this.remove(e)}}const Nn={w:.6,h:1.8},bh=1.62,L_=1.27,yh=4.317,I_=5.612,P_=1.31,U_=2.2,N_=32,ya=9,Mh=9,F_=9.5,Eh=6,Sh=.15,B_=.75,Zr=1/60,k_=1,O_=1.3,z_=14,wh=89.5*Math.PI/180;class V_{constructor(e,t,n,i=0){this.world=e,this.registry=t,this.pos={...n},this.spawn={...n},this.yaw=i}world;registry;pos;vel={x:0,y:0,z:0};yaw=0;pitch=0;onGround=!1;sneaking=!1;guarding=!1;guardSlow=.5;sprinting=!1;inWater=!1;riding=!1;horse=!1;eyeHeight=bh;walkCycle=0;horizontalSpeed=0;stepCamOffset=0;accumulator=0;moveOut={onGround:!1,hitX:!1,hitY:!1,hitZ:!1,hitCeiling:!1};spawn;isSolid=(e,t,n)=>this.registry.isSolid(this.world.getBlock(e,t,n));isWaterAt(e,t,n){return this.registry.get(this.world.getBlock(Math.floor(e),Math.floor(t),Math.floor(n))).fluid!==null}respawn(){this.pos.x=this.spawn.x,this.pos.y=this.spawn.y,this.pos.z=this.spawn.z,this.vel.x=this.vel.y=this.vel.z=0}applyLook(e,t){this.yaw-=e,this.pitch=Math.max(-wh,Math.min(wh,this.pitch-t)),this.yaw>Math.PI?this.yaw-=Math.PI*2:this.yaw<-Math.PI&&(this.yaw+=Math.PI*2)}get eye(){return{x:this.pos.x,y:this.pos.y+this.eyeHeight,z:this.pos.z}}get lookDir(){const e=Math.cos(this.pitch);return{x:-e*Math.sin(this.yaw),y:Math.sin(this.pitch),z:-e*Math.cos(this.yaw)}}update(e,t){for(this.applyLook(e.lookDX,e.lookDY),this.accumulator=Math.min(this.accumulator+t,Zr*8);this.accumulator>=Zr;)this.step(e,Zr),this.accumulator-=Zr}step(e,t){const n=this.pos,i=this.vel;this.inWater=this.isWaterAt(n.x,n.y+.2,n.z)||this.isWaterAt(n.x,n.y+this.eyeHeight-.1,n.z),this.sneaking=e.sneak&&!this.inWater&&!this.riding,this.guarding=e.guard&&!this.riding,this.sprinting=e.sprint&&e.moveZ>.5&&!this.sneaking;const r=Math.sin(this.yaw),o=Math.cos(this.yaw);let a=o*e.moveX-r*e.moveZ,c=-r*e.moveX-o*e.moveZ;const h=Math.hypot(a,c);h>1&&(a/=h,c/=h);const u=this.riding&&!this.horse,l=(this.horse?F_:this.riding?Mh:this.inWater?U_:this.sneaking?P_:this.sprinting?I_:yh)*(this.guarding?this.guardSlow:1),d=u?8:this.inWater?6:this.onGround?this.horse?10:18:3.5,f=Math.min(1,d*t);let A=0;u&&e.moveZ!==0&&(A=Math.max(0,Math.min(1,(Math.abs(this.pitch)-Sh)/(B_-Sh)))*Math.sign(this.pitch));const g=1-Math.abs(A)*.6;if(i.x+=(a*l*g-i.x)*f,i.z+=(c*l*g-i.z)*f,u){const b=A*Math.sign(e.moveZ)*Mh*.8+(e.jump?Eh:e.sneak?-Eh:0);i.y+=(b-i.y)*Math.min(1,8*t)}else if(this.inWater)if(e.jump&&this.onGround&&!this.isWaterAt(n.x,n.y+1,n.z))i.y=ya,this.onGround=!1;else{const x=(this.moveOut.hitX||this.moveOut.hitZ)&&(e.moveX!==0||e.moveZ!==0),b=e.jump||x?4:-2.2;i.y+=(b-i.y)*Math.min(1,6*t)}else i.y-=N_*t,i.y<-78&&(i.y=-78),e.jump&&this.onGround&&(i.y=this.horse?ya*1.15:ya,this.onGround=!1);const p=this.onGround,m=n.x,M=n.y,S=n.z,y=i.x,D=i.z;if(oo(this.isSolid,n,Nn,i,t,this.moveOut),this.onGround=this.moveOut.onGround,!u&&!this.sneaking&&(p||this.inWater)&&(this.moveOut.hitX||this.moveOut.hitZ)){const x=Sf(this.isSolid,{x:m,y:M,z:S},n,Nn,y,D,t,this.inWater?O_:k_);x&&(i.x=x.vx,i.z=x.vz,i.y=0,this.onGround=!0,this.stepCamOffset-=x.dy)}if(this.stepCamOffset+=(0-this.stepCamOffset)*Math.min(1,z_*t),Math.abs(this.stepCamOffset)<.002&&(this.stepCamOffset=0),this.sneaking&&p&&!Vo(this.isSolid,n,Nn)){const x=n.x;n.x=m,Vo(this.isSolid,n,Nn)||(n.x=x,n.z=S,Vo(this.isSolid,n,Nn)||(n.x=m)),i.x=i.z=0,this.onGround=!0}const v=Nn.w/2+.001;n.x<v?(n.x=v,i.x=0):n.x>this.world.sizeX-v&&(n.x=this.world.sizeX-v,i.x=0),n.z<v?(n.z=v,i.z=0):n.z>this.world.sizeZ-v&&(n.z=this.world.sizeZ-v,i.z=0),n.y<-24&&this.respawn();const E=this.sneaking?L_:bh;this.eyeHeight+=(E-this.eyeHeight)*Math.min(1,22*t);const R=Math.hypot(i.x,i.z);this.horizontalSpeed=R,this.onGround&&R>.4&&(this.walkCycle+=R*t*1.9)}applyToCamera(e,t){const n=this.eye,r=(this.onGround&&this.horizontalSpeed>.4?Math.min(1,this.horizontalSpeed/yh):0)*t;e.position.set(n.x,n.y+this.stepCamOffset-Math.abs(Math.cos(this.walkCycle))*.045*r,n.z),e.rotation.order="YXZ",e.rotation.set(this.pitch,this.yaw,Math.sin(this.walkCycle)*.006*r)}}const xo=new $e(8103167),Al=new $e(12638463),Th=.05,G_=`
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
  float lum = ${Th.toFixed(2)} + ${(1-Th).toFixed(2)} * pow(l, 1.5);
  vec3 warm = mix(vec3(1.0), vec3(1.0, 0.86, 0.68), clamp(blk - sky, 0.0, 1.0));
  vLight = lum * warm;

  vUvw = vec3(uv, meta.x);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`,H_=`
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
`;function W_(s){const e=(o,a={})=>new Gn({glslVersion:go,vertexShader:G_,fragmentShader:H_,uniforms:{uTex:{value:s},uFogColor:{value:Al.clone()},uFogNear:{value:60},uFogFar:{value:120},uSkyLight:{value:1},uCutout:{value:o},uTime:{value:0}},...a}),t=e(1,{side:ni}),n=e(0,{transparent:!0,depthWrite:!1,side:ln}),i=e(1);i.uniforms.uFogNear.value=1e5,i.uniforms.uFogFar.value=1e6;const r=[t,n,i];return{opaque:t,translucent:n,hand:i,setFog(o,a){t.uniforms.uFogNear.value=o,t.uniforms.uFogFar.value=a,n.uniforms.uFogNear.value=o,n.uniforms.uFogFar.value=a},setTime(o){for(const a of r)a.uniforms.uTime.value=o},setSkyLight(o){for(const a of r)a.uniforms.uSkyLight.value=o},dispose(){for(const o of r)o.dispose()}}}function Qd(s,e,t){const n=new dn;return n.setAttribute("position",new Jt(s.positions,3)),n.setAttribute("uv",new Jt(s.uvs,2)),n.setAttribute("meta",new Jt(s.meta,4)),n.setIndex(new Jt(s.indices,1)),n.boundingSphere=new Eo(t,e),n}class X_{constructor(e,t,n,i,r){this.world=e,this.lights=t,this.materials=n,this.pool=i,r.add(this.group)}world;lights;materials;pool;group=new Dt;stats={meshed:0,lastMs:0,avgMs:0,maxMs:0,visibleChunks:0};renderDistance=8;maxPerFrame=2;burst=!0;entries=new Map;dirty=new Map;boundingRadius=Math.sqrt(3)*It/2+.5;paddedScratch=null;get queued(){return this.dirty.size}get inflight(){return this.pool.inflight}markDirty(e,t,n){this.world.chunkInBounds(e,t,n)&&this.dirty.set(so(e,t,n),{cx:e,cy:t,cz:n})}markDirtyAll(e){for(const t of e)this.markDirty(t.cx,t.cy,t.cz)}markAll(){this.world.forEachChunk(e=>this.markDirty(e.cx,e.cy,e.cz))}update(e,t,n){const i=Math.floor(e/It),r=Math.floor(t/It),o=Math.floor(n/It);if(this.dirty.size>0){const c=this.burst?24:this.maxPerFrame,h=[...this.dirty.values()];h.length>1&&h.sort((l,d)=>{const f=(l.cx-i)**2+(l.cz-o)**2+(l.cy-r)**2,A=(d.cx-i)**2+(d.cz-o)**2+(d.cy-r)**2;return f-A});let u=0;for(const l of h){if(u>=c||this.pool.inflight>=this.pool.size*3)break;this.dirty.delete(so(l.cx,l.cy,l.cz)),this.dispatch(l)&&u++}}else this.burst&&this.pool.inflight===0&&(this.burst=!1);let a=0;for(const c of this.entries.values()){const h=Math.abs(c.cx-i),u=Math.abs(c.cz-o),l=Math.max(h,u)<=this.renderDistance;c.opaque&&(c.opaque.visible=l),c.translucent&&(c.translucent.visible=l),l&&(c.opaque||c.translucent)&&a++}this.stats.visibleChunks=a}entry(e){const t=so(e.cx,e.cy,e.cz);let n=this.entries.get(t);return n||(n={cx:e.cx,cy:e.cy,cz:e.cz,opaque:null,translucent:null,inflight:!1,redo:!1},this.entries.set(t,n)),n}dispatch(e){const t=this.entry(e),n=this.world.getChunk(e.cx,e.cy,e.cz);if(!n||n.isEmpty())return this.removeMesh(t,"opaque"),this.removeMesh(t,"translucent"),!1;if(t.inflight)return t.redo=!0,!1;t.inflight=!0;const i=n.version,r=this.world.buildPadded(e.cx,e.cy,e.cz,this.paddedScratch??void 0);this.paddedScratch=null;const o=this.lights.buildPaddedLight(e.cx,e.cy,e.cz);return this.pool.mesh(e.cx,e.cy,e.cz,r,o).then(a=>{t.inflight=!1,this.apply(t,a),(t.redo||n.version!==i)&&(t.redo=!1,this.markDirty(e.cx,e.cy,e.cz))},a=>{t.inflight=!1,console.error("메싱 실패",e,a)}),!0}apply(e,t){const n=this.stats;n.meshed++,n.lastMs=t.ms,n.avgMs=n.avgMs===0?t.ms:n.avgMs*.9+t.ms*.1,n.maxMs=Math.max(n.maxMs,t.ms);const i=new H(It/2,It/2,It/2);for(const r of["opaque","translucent"]){const o=t.result[r];if(!o){this.removeMesh(e,r);continue}const a=Qd(o,this.boundingRadius,i);let c=e[r];c?(c.geometry.dispose(),c.geometry=a):(c=new lt(a,r==="opaque"?this.materials.opaque:this.materials.translucent),c.position.set(e.cx*It,e.cy*It,e.cz*It),c.matrixAutoUpdate=!1,c.updateMatrix(),c.renderOrder=r==="opaque"?0:10,e[r]=c,this.group.add(c))}}removeMesh(e,t){const n=e[t];n&&(this.group.remove(n),n.geometry.dispose(),e[t]=null)}dispose(){for(const e of this.entries.values())this.removeMesh(e,"opaque"),this.removeMesh(e,"translucent");this.entries.clear(),this.dirty.clear()}}const at=It,Ch=3/16,ds=1/16,Rh=10/16,Dh=25*Math.PI/180,Y_=7/16,Lh=7/16,q_=3/16,$r=[[3,0,1],[2,1,8],[3,8,12],[4,12,14],[5,14,15],[6,15,16]],Ih=[[0,0,-1],[0,0,1],[1,0,0],[1,0,0],[1,0,0],[-1,0,0]],Ph=[[0,1,0],[0,1,0],[0,0,1],[0,0,1],[0,1,0],[0,1,0]],K_=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],Q_=[[0,1,0],[1,-1,0],[4,0,1],[5,0,-1]];class Uh{positions;uvs;meta;indices;vc=0;ic=0;constructor(e=512){this.positions=new Float32Array(e*4*3),this.uvs=new Float32Array(e*4*2),this.meta=new Uint8Array(e*4*4),this.indices=new Uint32Array(e*6)}ensure(){if((this.vc+4)*3<=this.positions.length)return;const e=t=>{const n=new t.constructor(t.length*2);return n.set(t),n};this.positions=e(this.positions),this.uvs=e(this.uvs),this.meta=e(this.meta),this.indices=e(this.indices)}quad(e,t,n){this.ensure();const i=this.vc;for(let a=0;a<4;a++){const c=e[a],h=(i+a)*3;this.positions[h]=c[0],this.positions[h+1]=c[1],this.positions[h+2]=c[2];const u=(i+a)*2;this.uvs[u]=c[3],this.uvs[u+1]=c[4];const l=(i+a)*4;this.meta[l]=t,this.meta[l+1]=c[5],this.meta[l+2]=n,this.meta[l+3]=c[6]??ms}const r=e[0][5]+e[2][5]>e[1][5]+e[3][5],o=this.ic;r?(this.indices[o]=i+1,this.indices[o+1]=i+2,this.indices[o+2]=i+3,this.indices[o+3]=i+1,this.indices[o+4]=i+3,this.indices[o+5]=i):(this.indices[o]=i,this.indices[o+1]=i+1,this.indices[o+2]=i+2,this.indices[o+3]=i,this.indices[o+4]=i+2,this.indices[o+5]=i+3),this.vc+=4,this.ic+=6}build(){return this.vc===0?null:{positions:this.positions.slice(0,this.vc*3),uvs:this.uvs.slice(0,this.vc*2),meta:this.meta.slice(0,this.vc*4),indices:this.indices.slice(0,this.ic),vertexCount:this.vc,indexCount:this.ic}}}function j_(s,e,t){const n=new Uh,i=new Uh,r=new Int32Array(at*at),o=new Int32Array(at*at),a=new Int32Array(at*at),c=new Int32Array(at*at),h=[0,0,0],u=[0,0,0];let l=ms;const d=(v,E,R,x,b,I)=>{u[0]=h[0],u[1]=h[1],u[2]=h[2],u[v]+=E,mn(u[0],u[1],u[2]);const P=u[R],k=u[b];u[R]=P+x;const G=mn(u[0],u[1],u[2]);u[R]=P,u[b]=k+I;const W=mn(u[0],u[1],u[2]);u[R]=P+x;const B=mn(u[0],u[1],u[2]),Y=e[s[G]],O=e[s[W]],ie=e[s[B]],re=Y!==void 0&&Y.castAO,Ae=O!==void 0&&O.castAO,Ve=ie!==void 0&&ie.castAO;return l=ms,re&&Ae?0:3-((re?1:0)+(Ae?1:0)+(Ve?1:0))},f=(v,E,R)=>ms,A=(v,E,R)=>{const x=e[R];return x?!(x.opaque||E===R&&v.sameCull||v.layer===js&&x.layer===js&&x.fluidKind===0):!0},g=(v,E,R,x,b,I)=>{const[P,k,G]=R,[W,B,Y]=x;let O;switch(E){case 0:O=[[W,k,G],[W,k,Y],[W,B,Y],[W,B,G]];break;case 1:O=[[P,k,G],[P,k,Y],[P,B,Y],[P,B,G]];break;case 2:O=[[P,B,G],[W,B,G],[W,B,Y],[P,B,Y]];break;case 3:O=[[P,k,G],[W,k,G],[W,k,Y],[P,k,Y]];break;case 4:O=[[P,k,Y],[W,k,Y],[W,B,Y],[P,B,Y]];break;default:O=[[P,k,G],[W,k,G],[W,B,G],[P,B,G]]}const ie=K_[E],re=[O[1][0]-O[0][0],O[1][1]-O[0][1],O[1][2]-O[0][2]],Ae=[O[3][0]-O[0][0],O[3][1]-O[0][1],O[3][2]-O[0][2]],Ve=[re[1]*Ae[2]-re[2]*Ae[1],re[2]*Ae[0]-re[0]*Ae[2],re[0]*Ae[1]-re[1]*Ae[0]];Ve[0]*ie[0]+Ve[1]*ie[1]+Ve[2]*ie[2]<0&&(O=[O[0],O[3],O[2],O[1]]);const Me=Ih[E],Q=Ph[E],De=O.map(q=>[q[0],q[1],q[2],q[0]*Me[0]+q[1]*Me[1]+q[2]*Me[2],q[0]*Q[0]+q[1]*Q[1]+q[2]*Q[2],3,I]);v.quad(De,b,E)},p=(v,E,R,x,b,I,P,k)=>g(v,E,[R,x+I,b],[R+1,x+P,b+1],k,f()),m=()=>{for(let v=0;v<at;v++)for(let E=0;E<at;E++)for(let R=0;R<at;R++){const x=e[s[mn(R,v,E)]];if(x===void 0||x.panel===null)continue;const[b,I]=x.panel,P=[R,v,E],k=[R+1,v+1,E+1];I===0?k[b]=P[b]+Ch:P[b]=k[b]-Ch;const G=f();for(let W=0;W<6;W++)g(n,W,P,k,x.tex[W],G)}},M=()=>{for(let v=0;v<at;v++)for(let E=0;E<at;E++)for(let R=0;R<at;R++){const x=e[s[mn(R,v,E)]];if(x===void 0||x.torch===null)continue;const b=f(),I=x.tex[0];if(x.torch<0){const $=[R+.5-ds,v,E+.5-ds],oe=[R+.5+ds,v+Rh,E+.5+ds];for(let fe=0;fe<6;fe++)g(n,fe,$,oe,I,b);continue}const[P,k]=Jh[x.torch],G=Math.sin(Dh),W=Math.cos(Dh),B=[-P*G,W,-k*G],Y=[k,0,-P],O=[P*W,G,k*W],ie=R+.5+P*Lh,re=v+q_,Ae=E+.5+k*Lh,Ve=($,oe,fe)=>[ie+Y[0]*$+B[0]*oe+O[0]*fe,re+Y[1]*$+B[1]*oe+O[1]*fe,Ae+Y[2]*$+B[2]*oe+O[2]*fe],Me=$=>Y_+($+ds),Q=ds,De=Rh,q=($,oe,fe)=>{let he=$.map((Le,ve)=>{const Qe=Ve(Le[0],Le[1],Le[2]);return[Qe[0],Qe[1],Qe[2],oe[ve][0],oe[ve][1]]});const Ue=[he[1][0]-he[0][0],he[1][1]-he[0][1],he[1][2]-he[0][2]],mt=[he[3][0]-he[0][0],he[3][1]-he[0][1],he[3][2]-he[0][2]],U=[Ue[1]*mt[2]-Ue[2]*mt[1],Ue[2]*mt[0]-Ue[0]*mt[2],Ue[0]*mt[1]-Ue[1]*mt[0]];U[0]*fe[0]+U[1]*fe[1]+U[2]*fe[2]<0&&(he=[he[0],he[3],he[2],he[1]]);const ft=Math.abs(fe[0])>=Math.abs(fe[1])&&Math.abs(fe[0])>=Math.abs(fe[2])?0:Math.abs(fe[1])>=Math.abs(fe[2])?1:2,We=ft===0?fe[0]>0?0:1:ft===1?fe[1]>0?2:3:fe[2]>0?4:5;n.quad(he.map(Le=>[Le[0],Le[1],Le[2],Le[3],Le[4],3,b]),I,We)};q([[Q,0,-Q],[Q,0,Q],[Q,De,Q],[Q,De,-Q]],[[Me(-Q),0],[Me(Q),0],[Me(Q),De],[Me(-Q),De]],Y),q([[-Q,0,-Q],[-Q,0,Q],[-Q,De,Q],[-Q,De,-Q]],[[Me(-Q),0],[Me(Q),0],[Me(Q),De],[Me(-Q),De]],[-Y[0],-0,-Y[2]]),q([[-Q,0,Q],[Q,0,Q],[Q,De,Q],[-Q,De,Q]],[[Me(-Q),0],[Me(Q),0],[Me(Q),De],[Me(-Q),De]],O),q([[-Q,0,-Q],[Q,0,-Q],[Q,De,-Q],[-Q,De,-Q]],[[Me(-Q),0],[Me(Q),0],[Me(Q),De],[Me(-Q),De]],[-O[0],-O[1],-O[2]]),q([[-Q,De,-Q],[Q,De,-Q],[Q,De,Q],[-Q,De,Q]],[[Me(-Q),Me(-Q)],[Me(Q),Me(-Q)],[Me(Q),Me(Q)],[Me(-Q),Me(Q)]],B),q([[-Q,0,-Q],[Q,0,-Q],[Q,0,Q],[-Q,0,Q]],[[Me(-Q),Me(-Q)],[Me(Q),Me(-Q)],[Me(Q),Me(Q)],[Me(-Q),Me(Q)]],[-B[0],-B[1],-B[2]])}},S=()=>{for(let v=0;v<at;v++)for(let E=0;E<at;E++)for(let R=0;R<at;R++){const x=e[s[mn(R,v,E)]];if(x===void 0||!x.egg)continue;const b=f();for(let I=0;I<$r.length;I++){const[P,k,G]=$r[I],W=$r[I-1],B=$r[I+1],Y=[R+P/16,v+k/16,E+P/16],O=[R+1-P/16,v+G/16,E+1-P/16];for(const ie of[0,1,4,5])g(n,ie,Y,O,x.tex[ie],b);(!B||B[0]>P)&&g(n,2,Y,O,x.tex[2],b),(!W||W[0]>P)&&g(n,3,Y,O,x.tex[3],b)}}},y=()=>{for(let v=0;v<at;v++)for(let E=0;E<at;E++)for(let R=0;R<at;R++){const x=e[s[mn(R,v,E)]];if(x===void 0||x.fluidKind===0)continue;const b=x.fluidHeight,I=x.fluidKind,P=x.layer===js?i:n,k=(B,Y,O)=>e[s[mn(R+B,v+Y,E+O)]],G=k(0,1,0);(G===void 0||G.fluidKind!==I)&&p(P,2,R,v,E,0,b,x.tex[2]);const W=k(0,-1,0);(W===void 0||!(W.opaque||W.fluidKind===I))&&p(P,3,R,v,E,0,b,x.tex[3]);for(const[B,Y,O]of Q_){const ie=k(Y,0,O);let re=0;if(ie!==void 0){if(ie.opaque)continue;if(ie.fluidKind===I){if(ie.fluidHeight>=b-1e-6)continue;re=ie.fluidHeight}}p(P,B,R,v,E,re,b,x.tex[B])}}},D=(v,E,R,x,b,I,P,k)=>{const G=Ih[I],W=Ph[I];for(let B=0;B<at;B++)for(let Y=0;Y<at;){const O=v[B*at+Y];if(O===0){Y++;continue}const ie=E[B*at+Y];let re=1;for(;Y+re<at&&v[B*at+Y+re]===O&&E[B*at+Y+re]===ie;)re++;let Ae=1;e:for(;B+Ae<at;Ae++)for(let oe=0;oe<re;oe++){const fe=(B+Ae)*at+Y+oe;if(v[fe]!==O||E[fe]!==ie)break e}const Ve=O>>>8,Me=O&255,Q=e[Ve],De=Q.tex[I],q=[];for(let oe=0;oe<4;oe++){const fe=oe===1||oe===2?1:0,he=oe===2||oe===3?1:0,Ue=[0,0,0];Ue[R]=P,Ue[x]=B+fe*Ae,Ue[b]=Y+he*re;const mt=Ue[0]*G[0]+Ue[1]*G[1]+Ue[2]*G[2],U=Ue[0]*W[0]+Ue[1]*W[1]+Ue[2]*W[2];q.push([Ue[0],Ue[1],Ue[2],mt,U,Me>>oe*2&3,ie>>>oe*8&255])}const $=k?q:[q[0],q[3],q[2],q[1]];(Q.layer===js?i:n).quad($,De,I);for(let oe=0;oe<Ae;oe++)for(let fe=0;fe<re;fe++){const he=(B+oe)*at+Y+fe;v[he]=0,E[he]=0}Y+=re}};for(let v=0;v<3;v++){const E=(v+1)%3,R=(v+2)%3,x=v*2,b=v*2+1;for(let I=0;I<at;I++){let P=0;for(let k=0;k<at;k++)for(let G=0;G<at;G++,P++){h[v]=I,h[E]=k,h[R]=G;const W=s[mn(h[0],h[1],h[2])],B=e[W];let Y=0,O=0,ie=0,re=0;if(B!==void 0&&B.layer!==Hd&&B.fluidKind===0&&B.panel===null&&B.torch===null&&!B.egg){h[v]=I+1;const Ae=s[mn(h[0],h[1],h[2])];if(h[v]=I,A(B,W,Ae)){const Me=d(v,1,E,-1,R,-1),Q=l,De=d(v,1,E,1,R,-1),q=l,$=d(v,1,E,1,R,1),oe=l,fe=d(v,1,E,-1,R,1),he=l;Y=W<<8|Me|De<<2|$<<4|fe<<6,ie=Q|q<<8|oe<<16|he<<24}h[v]=I-1;const Ve=s[mn(h[0],h[1],h[2])];if(h[v]=I,A(B,W,Ve)){const Me=d(v,-1,E,-1,R,-1),Q=l,De=d(v,-1,E,1,R,-1),q=l,$=d(v,-1,E,1,R,1),oe=l,fe=d(v,-1,E,-1,R,1),he=l;O=W<<8|Me|De<<2|$<<4|fe<<6,re=Q|q<<8|oe<<16|he<<24}}r[P]=Y,o[P]=O,a[P]=ie,c[P]=re}D(r,a,v,E,R,x,I+1,!0),D(o,c,v,E,R,b,I,!1)}}return y(),m(),M(),S(),{opaque:n.build(),translucent:i.build()}}const J_=.24,Z_=.85,$_=-.7,Ma=-1.25,ex=.34,Nh=.3,Fh=.6,eo=.9/16,tx=[.78,.7,1,.5,.86,.94];function nx(s){const e=s.getContext("2d");if(!e)return[];const t=s.width,n=s.height,i=e.getImageData(0,0,t,n).data,r=[];for(let o=0;o<16;o++)for(let a=0;a<16;a++){const c=Math.min(t-1,Math.floor((a+.5)*t/16)),u=(Math.min(n-1,Math.floor((o+.5)*n/16))*t+c)*4;i[u+3]<128||r.push({x:a,y:15-o,z:0,c:`#${(i[u]<<16|i[u+1]<<8|i[u+2]).toString(16).padStart(6,"0")}`})}return r}class ix{constructor(e,t){this.materials=e,this.blockInfo=t,this.scene.add(this.anchor),this.anchor.add(this.pivot),this.pivot.position.set(0,0,Ma),this.pivot.rotation.set(Nh,Fh,0)}materials;blockInfo;scene=new Id;anchor=new Dt;pivot=new Dt;mesh=null;swingT=1;draw=0;currentBlock=-1;currentItem=null;clearMesh(){this.mesh&&(this.pivot.remove(this.mesh),this.mesh.geometry.dispose(),this.currentItem&&this.mesh.material.dispose(),this.mesh=null)}setItem(e,t){if(e===this.currentItem&&this.currentBlock<=0||(this.clearMesh(),this.currentBlock=0,this.currentItem=e,!e||!t))return;const n=nx(t);if(n.length===0)return;const i=Oi(n,eo,tx);i.translate(-8*eo,-8*eo,-.5*eo),this.mesh=new lt(i,new Ht({vertexColors:!0}));const r=/_sword$/.test(e),o=!r&&(/_(pickaxe|axe|shovel|hoe)$/.test(e)||e==="shears"||e==="flint_and_steel");r?(this.mesh.rotation.set(-.3,-.6,.35),this.mesh.position.set(-.55,.3,.1),this.mesh.scale.setScalar(1.3)):o?(this.mesh.rotation.set(.25,-.45,2.35),this.mesh.position.set(-.45,.4,.12),this.mesh.scale.setScalar(1.5)):(this.mesh.rotation.set(0,-Fh*.7,.15),this.mesh.position.set(-.05,.05,0)),this.mesh.frustumCulled=!1,this.pivot.add(this.mesh)}setBlock(e){if(e===this.currentBlock&&!this.currentItem||(this.clearMesh(),this.currentItem=null,this.currentBlock=e,e<=0))return;const t=new Uint16Array(jh);t[mn(0,0,0)]=e;const n=j_(t,this.blockInfo),i=n.opaque??n.translucent;if(!i)return;const r=Qd(i,1,new H(.5,.5,.5));r.translate(-.5,-.5,-.5),this.mesh=new lt(r,n.opaque?this.materials.hand:this.materials.translucent),this.mesh.scale.setScalar(ex),this.mesh.frustumCulled=!1,this.pivot.add(this.mesh)}setDraw(e){this.draw=Math.max(0,Math.min(1,e))}swing(){(this.swingT>=1||this.swingT>.5)&&(this.swingT=0)}update(e,t,n,i){this.anchor.position.copy(t.position),this.anchor.quaternion.copy(t.quaternion);const r=Math.tan(Pp.degToRad(t.fov/2))*-Ma,o=r*t.aspect,a=Z_*o,c=$_*r;let h=0,u=0,l=0;if(h+=Math.sin(n)*.02*i,u+=-Math.abs(Math.cos(n))*.025*i,this.swingT<1){this.swingT=Math.min(1,this.swingT+e/J_);const d=Math.sin(this.swingT*Math.PI);u-=d*.28,h-=d*.12,l-=d*1.1}h-=this.draw*.08,u+=this.draw*.05,l+=this.draw*.35,this.pivot.position.set(a+h,c+u,Ma+this.draw*.12),this.pivot.rotation.x=Nh+l}render(e,t){this.mesh&&(e.clearDepth(),e.render(this.scene,t))}dispose(){this.clearMesh()}}function sx(s,e=!1){const t=s[0].index!==null,n=new Set(Object.keys(s[0].attributes)),i=new Set(Object.keys(s[0].morphAttributes)),r={},o={},a=s[0].morphTargetsRelative,c=new dn;let h=0;for(let u=0;u<s.length;++u){const l=s[u];let d=0;if(t!==(l.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in l.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(l.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(a!==l.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in l.morphAttributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(l.morphAttributes[f])}if(e){let f;if(t)f=l.index.count;else if(l.attributes.position!==void 0)f=l.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;c.addGroup(h,f,u),h+=f}}if(t){let u=0;const l=[];for(let d=0;d<s.length;++d){const f=s[d].index;for(let A=0;A<f.count;++A)l.push(f.getX(A)+u);u+=s[d].attributes.position.count}c.setIndex(l)}for(const u in r){const l=Bh(r[u]);if(!l)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;c.setAttribute(u,l)}for(const u in o){const l=o[u][0].length;if(l===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[u]=[];for(let d=0;d<l;++d){const f=[];for(let g=0;g<o[u].length;++g)f.push(o[u][g][d]);const A=Bh(f);if(!A)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;c.morphAttributes[u].push(A)}}return c}function Bh(s){let e,t,n,i=-1,r=0;for(let h=0;h<s.length;++h){const u=s[h];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=u.gpuType),i!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.count*t}const o=new e(r),a=new Jt(o,t,n);let c=0;for(let h=0;h<s.length;++h){const u=s[h];if(u.isInterleavedBufferAttribute){const l=c/t;for(let d=0,f=u.count;d<f;d++)for(let A=0;A<t;A++){const g=u.getComponent(d,A);a.setComponent(d+l,A,g)}}else o.set(u.array,c);c+=u.count*t}return i!==void 0&&(a.gpuType=i),a}const bo=10,rx=.02;function ox(){const s=_u(51116),e=[],t=new Set,n=(o,a)=>{o=Math.max(0,Math.min(15,o)),a=Math.max(0,Math.min(15,a));const c=a*16+o;t.has(c)||(t.add(c),e.push([o,a]))};for(let o=0;o<14;o++){let a=6+Math.floor(s()*4),c=6+Math.floor(s()*4);const h=s()<.5?-1:1,u=s()<.5?-1:1;for(let l=0;l<12;l++)n(a,c),s()<.55?a+=h:c+=u,s()<.15&&n(a+(s()<.5?1:-1),c)}const i=e.length,r=[];for(let o=0;o<bo;o++){const a=document.createElement("canvas");a.width=a.height=16;const c=a.getContext("2d");c.clearRect(0,0,16,16);const h=Math.floor(i*(o+1)/bo);for(let l=0;l<h;l++){const[d,f]=e[l],A=.55+.35*(l/i);c.fillStyle=`rgba(15,15,15,${A.toFixed(2)})`,c.fillRect(d,f,1,1)}const u=new So(a);u.magFilter=nn,u.minFilter=nn,u.colorSpace=gn,r.push(u)}return r}function ax(s,e){const t=s/2,n=[],i=(a,c,h,u,l,d)=>{const f=new Bn(a,c,h);f.translate(u,l,d),n.push(f)},r=s+e;for(const a of[-t,t])for(const c of[-t,t])i(r,e,e,0,a,c),i(e,r,e,a,0,c),i(e,e,r,a,c,0);const o=sx(n,!1);for(const a of n)a.dispose();return o}class lx{outline;crack;crackMat;crackTextures;stage=-1;constructor(e){this.outline=new lt(ax(1.004,rx),new Ht({color:0,transparent:!0,opacity:.45,depthWrite:!1})),this.outline.renderOrder=5,this.outline.visible=!1,e.add(this.outline),this.crackTextures=ox(),this.crackMat=new Ht({map:this.crackTextures[0],transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),this.crack=new lt(new Bn(1.002,1.002,1.002),this.crackMat),this.crack.renderOrder=4,this.crack.visible=!1,e.add(this.crack)}setTarget(e,t,n){this.outline.visible=!0,this.outline.position.set(e+.5,t+.5,n+.5),this.crack.position.copy(this.outline.position)}clearTarget(){this.outline.visible=!1,this.crack.visible=!1}setProgress(e){if(e<=0||!this.outline.visible){this.crack.visible=!1,this.stage=-1;return}const t=Math.min(bo-1,Math.floor(e*bo));t!==this.stage&&(this.stage=t,this.crackMat.map=this.crackTextures[t],this.crackMat.needsUpdate=!0),this.crack.visible=!0}dispose(){this.outline.geometry.dispose(),this.outline.material.dispose(),this.crack.geometry.dispose(),this.crackMat.dispose();for(const e of this.crackTextures)e.dispose()}}class cx{constructor(e,t,n=9060348){this.scene=e,this.material=new Ht({color:n,transparent:!0,opacity:.55,side:ln,depthWrite:!1}),this.mesh=new lt(new ws(2,3),this.material),this.mesh.position.set(t.x,t.y+2.5,t.z+.5),this.mesh.renderOrder=5,e.add(this.mesh)}scene;mesh;material;update(e){this.material.opacity=.45+.15*Math.sin(e*2.2);const t=.72+.03*Math.sin(e*.9);this.material.color.setHSL(t,.85,.6)}dispose(){this.scene.remove(this.mesh),this.mesh.geometry.dispose(),this.material.dispose()}}class hx{mesh;material;constructor(e){this.material=new Gn({glslVersion:go,side:tn,depthWrite:!1,depthTest:!1,uniforms:{uZenith:{value:new $e(5210088)},uHorizon:{value:xo.clone()},uFog:{value:Al.clone()},uVoid:{value:new $e(2832988)},uSunDir:{value:new H(.45,.72,.3).normalize()}},vertexShader:`
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
      `}),this.mesh=new lt(new Nl(1,24,12),this.material),this.mesh.scale.setScalar(400),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-100,e.add(this.mesh)}update(e){this.mesh.position.copy(e)}setBrightness(e){const t=this.material.uniforms,n=1-e;t.uZenith.value.setHex(5210088).multiplyScalar(e).lerp(new $e(660016),n*.6),t.uHorizon.value.copy(xo).multiplyScalar(e).lerp(new $e(1317946),n*.6),t.uFog.value.copy(Al).multiplyScalar(Math.max(.35,e)),t.uVoid.value.setHex(2832988).multiplyScalar(e),this.material.uniforms.uSunDir.value.set(.45,.72*(.3+.7*e)-.2*n,.3).normalize()}dispose(){this.mesh.geometry.dispose(),this.material.dispose()}}const dx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAChUlEQVR42kWSV3PaUBCF9VvyEjuxKSqoXXUkkGihdwMGgxuBics4zo8/mV2G5OHM3pHmfFul53qIiV3AY+bjxlMxEgqmXglDIbOOrQjvvRSHZoiPYQ11+RJZ4StqxQv0zCKkw48YIzMHAj3VAjatEoF5aLKeUhdLV2EQvRexgLj4wqL/0m1k4r7q4thOsG9GGNhFrCsu5oHBb8q6r/l47VRwFxloqd9xE1mY+DpXI5HxLraxTQR2FQdjR+UWJq6GtnaFt26VWyAAtdG3ZC5/Gpxg0ibUsQ40bMsmx9d2gk1QwueogX3moW/m0dWvMRIyJo6Kh6qDG0fGS6fCko7NiEs8NELOdutrbPw9rOHYDLGKBQZWAT0jx4D7isDS13BoRgySVq6CP+MGmz+Hdaw8hUWQQyPAXephWbYx80rolK6wiQzM7ALH53oA6aUd42c94AF9DGr4GGR471axjQyuoqV8wyKyuIWpq2GX2NzGXBRPLWyS/2sZGDke2K9WmWE0H5r4yFHRt4qYeDpuHAVzgtkFPKQupGVoYCJk7DIfff2ajQR4rArsYusffOrraOs5LFwVm7KJ21A/AdaxjbFdxNDMM4jaocwkqoYyD4WCZSzQ0XOcmYZIcR0ZkBaBjlVkYuaq2KYeD5Mg58yzwEDXyGPsagw6f3/pVrGvh5CmroqJo6CnX2Ob+nwPtCLS0lPZTKWfjW3tO29mZMvYZj6kTcXFfS3AWMgcH1OXIeeDaWlXGAgFDfmS30OriEVoYJ0ILCMT0i4LQBAC9I0cA54yD2+9FO/9jE00QBJvITAwFgo2VZff0jzQMbQKDFgnDpsoM+15Heqo0937Ojp6/gRyNb5IilTJXzsd2hofgxXhAAAAAElFTkSuQmCC",ux="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAxUlEQVR42u1SyQ3CQAx0JbynCkpIAZRDKfwh6+xuQqAlHnRgZGksWTzZL49RLB8zHmelAXYFbAPsCVgBbGf8AKwDtgJ2A2xJ8B6fFS+836+f4CTSBwh8S9HRDZR+fJM7ve706QpzyjuUX79ZdYLGps5kT4eKWFlrJK2M/eBSqRgq69efWCgwp+sXwntlTcwLk4EYji03ipRkSXY2bywoBytzGYWbFr6ROd6BpiOG78a4sjlqYVOZk9PxYCOQy3myEfwJJvsAjIFrcP/cvEwAAAAASUVORK5CYII=",fx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACKUlEQVR42jWT51JqUQxG9/sAShGkSBPpTXovglSpMo6AgwxPnjsrd/zB5JzNzpeVLzkmHo+L0+mUfr+v8f7+Xp6ensRms4nP55Nisaj/BYNBeX19lcFgIIVCQcLhsHg8HjHtdltCoZAQ+XH57e1NvF6vRCIRCQQCkkqlpNPpyHK5lPF4rO+xWEx6vZ6Y4XCohyRzmYvlclnq9boKNBoNeX5+VqpcLqfn+/1eFouFHA6H/wKPj4+afHd3p7FSqcjLy4v4/X5JJBL6fDwelaBUKsnHx4e43W4VMev1Wr6/v6XVamlvoCGSz+el2WzqpXQ6LbVaTVwulxJQAEHaNJlMRjG/vr4UkWokUpmYTCa1RapyRtJ0OhXyIDIoYUa1WpXz+SwQORwOFYIIMvqH5OHhQSNnp9NJaUw2m1XnV6uVTgOHwe12u2K32zV5MpkoHUS0s9lsZDQaCf4Z1BgbeNvtVj3AdYQxETLmjzgG8sxuQPP+/i6GRUKd0eAD7bBAiCFssVh0if4WDfe5QwEEDcm73U6u16uaAwGYs9lM24EMCnxBhMiUGD0Gq4kkg/b7+yvRaFR7phI+QMBFDLVarZpMUVpi3Q3o7DVzJxkzaQEaNhIa5g7JHx2C5ECpAjyQfLvd1GlWlBkza6gul4vi8x+FECAPcgPSz8+PKrIszB8hnObC5+enbh2jg4JECBHBI0MvLBCfKYjz+Vxd56NinLxDwz5Aw1YiwsdH/AcfgvkbkXGX1AAAAABJRU5ErkJggg==",px="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB20lEQVR42o3SzU4aURQH8Ps4bBprmVoXdNNUJTpfDPOBjaum1CqWNm1apTYjHyOC4KpBLRGpOqCMYF+jT8Jr/JtzEhqmsGBxknvvOf/fvcmMCKpJdD0Vg5oFNx3DQ92GX5TRO0rg/tjEXVnH7xMHfklGv2ah4yl8dk+5QxWCGr1KggMEdEoKgxSmAcKCioHbss77Qd3idf/Y5JwIqgbrJHqZF3g4sTn8J4jxIAX8ksL9Qd3G3vIpX0YvpVeLzxvPEEQiXMPhkAdoTQDtqUb73Ovn3B+df1yXIH4V1JmBdl4JATdeAuLGM2YGropaCGjuxyF+5lZmBigwDrTcNYiMLc0M7DhSCMimFiC6ZR13RwZ6lSQirwKujqehX7PRPdS5rosyaM4vqSE0qJoQV/m1fy8YAVTXBRmxeoxr1Pe9KQDdNg2g4f8BCowDt+UExHsnOhXIpqQJ4ENKCgGfNhYhznPxqcBZLj4BtAtaCPjx5SXE2dhnHAcaX5cmgJarhIB2XoNo7C7h8kDlQPP7Kk73VnCZ17haByouXBkXrgL65c+/xXm2ub/K68buMsSWFcVb4zF2nAW8M59g25bwRnuEzeQ8Ms5TZNcXsWnMY8uMIq3Pgea3LQnpxByf/wVkjXV/2HuxXAAAAABJRU5ErkJggg==",mx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA5ElEQVR42u2Pu4qDYBCF/zdTUKKoRSxE8Q0sveP9ihfIg+UhUqfeepuzzIBbLCwLS1IEMnBg+OfMd+YX4pn1efNB+jfgdLJAeiHA9XbHX4Cfnu+6n8849BvAv3zg0BvwSEBRFJjnGeu6ous6eJ4HSZKQZRmCIIBhGDBNE6qqgrx933MvyzL7RVmWqKqKB9u2oa5ruK4LRVGgaRrP2rZlM/VpmrLXtm0sywJBjweEtO87p9IltERqmgZxHLOSJEEURbAsiy8XZKTFcRw5fZomHui6zsZhGBCGIScTjL6R5zmHOo6DL77IJcHVaQZsAAAAAElFTkSuQmCC",gx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABQklEQVR42qXSR1IDQQyFYZ+EJZick8k5noCTkHOGOzf1TdVrmCp2Xshya6Rfr6XudM8GSj/W8bP1MFlWr0fK3stsWbsZLcefS+XwfaHsPE03tnI1XE6+lht/+t0rG3fjZf127BegSGD7caocfSw2Z0mAYL3LbgP0f/91rhy8zTfACkCmIh2YghgYCDUAu88zbQXkL18MNUmb9xNVIs8o0pGnUEyzFmDpfLAxhc7ppChwZzmuAFIB6BLSRTElYjrqxsB5swCqAB2YQklmwAdAka6GCmAWrSFKlsiy0hRmjWDZjMH69u8ao0IsCpyzQuoyhwqQhOoaWRtPpgKqMlSds40K8DGPBSSK/r5M8bxG1lLgnhKZbhIzB4kpBlJMoetWQJL4vPs8JjEKxRRlS9bcesquYDgSsxFQMclyMrycK6Af+wF7td4ljUgE9gAAAABJRU5ErkJggg==",Ax="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAATUlEQVR42mNgGAUEwYcqqf9kKwbxYZigobgU63fpE2UoVsUgvsdiy//YxLFqhmFChmJTh9NkYsVI8gJIbGC9gNUFpNhGdBhQHIjEiAEA7MFu+yk8qX8AAAAASUVORK5CYII=",vx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMklEQVR42mNgGAWjYEiAiO0u/0nSYD/P6j8yG4axyWPVjE8DNnmCTkZXjFczMRqobgAAB5cuXQJz4ncAAAAASUVORK5CYII=",_x="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABtUlEQVR42l2TZ1ICURCE3wn8AQUIywLmU2GRQW5gznoWKYFlSYcxZz3F6DcwYPHj1b7d6enuCeta+Yjc76Xk9SQnX5cb8na6Ip1iQu/vZ6v6fNj3pF2Iyc/1lnxfbcrjQVqeDn0JKklxYdVTgo/zNSV5PspIWPPk5TirZBAAHtR9TSQOIdhWPiquX/MUaMkk3hZiSsrd1FrbUfm8WNfvd7tJxbaLcXG9SlJt8REwT0i5c3BGKRBACBZBngi54c7cEoFMfElLoF7rA6qAiYFDhG/0RR0YGIAdFCA2gsWYOdUe8EKd1nUcoASQWjk4pQTErLywmhI3amZnSiRAwHhIshHiYDQl4J2+IKglDBvzAKwkDRr+zKZ1vl9Pqyuw9q1bXhYX/JsCqgSZr4GIcUcNcpsC95t8RBzM2McSDSIwbubUkTWNBGaOdWsiuG4pIS4oT5RtkRa7vTgdwyHKFrthw1ertgs4GTezM2WbjhGC5VAW/dNFMgd8hIgeACYR27joFOP6bqMGq3tAE1GBlSkQGE1JIbH17ZQmfyh7wKHpAVOwP88WhiCurOM2GUaLO+64Iqf3t0i/euJVJP6LFFwAAAAASUVORK5CYII=",xx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACM0lEQVR42qWRW1NSURTH+QQ9NNNLPWTOUKgczjlyh/DyCXrSZhomKxE1UeIeIMhlKJ1xJjIyMx3KG4hCXBRiqnenL/Vv1mo89FQPPux91v7vtX7/tddR9d+8jqssFW1Frx7b8zq8nxnAh9khHIVs2F2U8fmFAVtzWtaLS3osT6ix65Gx45FYVwDhB7dRmNZgz2/GUdiGTfcgJ33xGVGK2LHjkbEfMKMUtqPg0iD3WMSnBbEHOAxaUfQacBC0sGtuSuSY9O3nOi4iGGkE+zgvsP5XB31YfSqzAyVlnQL2/CZcXPxCKpXhtumZpFFMOQrg1o1rWH8ygA23iNjkIDbcOryblbA+pUGlcsqAN8+0WHOqseUxYtWpRt4lID8tgGpV/5rwJeC/f6EeNaCbcaAZN6GdtPG5k7IrgEbMyPqP3BjOE1a+o1gBnAYlnCUsqIZkfM+OMuCtS1AAJwER7RUbCnMyumkHjn0CapHhHqARNeLnq3GeQytuZuCa8y67UWE1JHFBM2ZkZwKQmQLIu0R00qMo+yWcpxz8PQ7IOPQKqL004bXzHuvfMmMoByQ+Zx/29wDNZdufS7+ERtyKr1Ezzlcc2FwwoZ0aQTc7jvTkHb6rhIZxlrzPsQK4JFPh/uIQ6nELDpa0DExN9KHsF1GLmrgrMmsl7TgJ6XsASqRWya0eszCombBxTG70ROog90jNha2EnUEKgJJoBiWfyDEVdtIjyhxo5WeoQxPHBKpGjD3AVdZv/A4FcAD3pJwAAAAASUVORK5CYII=",bx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACP0lEQVR42qWQ61MSYRTG/Rv62McmuwjpcluX20Jo9S/oOFMzOU2TUJqmAgISsMCidJk+OFOT2Sg65cgkIhqBgIDd/6anOcfa7bsfzr7vnPOc3/O823Ph/DmcpXro83FOxPa8iPVH/SjFZKz5DXj/8BrX1owFOyEJ7/x9KIbtfK5O9GEtYNQB6h0DsrcNKEwJPNwJkdCArWkzNiYHkBy9hGLIjtWJq1DGrvByfnxAB5w6GJAc7cVu1IUPszZsz4mchGCfIk5sPjadpgsYeZYYuagD8uMCR12+24/ESC+KYQdKMTenodipscvYnDZxjyCk3ZgSdEAtLuJrzovfL2/hMGLm8zjtQv3pIH48G8b6jMRVjVrxbdmHbtaDasyqA0jUTDl4SLDv+SH8fH6D6yTnRUtxopG0s6aretDNynzXAMeKk5dOVA8DjhISPkct6GRl/HpxE+2MmwGtlIOdCUqmGoCE/8QEIgCB6Dm0TK5fFm2chFLRnXQaoJGQuLly38iLhVkHJyBXciQxGRSe2LlPRgTTAKWgCZ2cD6WggN15AYexQZTDFu5VFqzY5/sQDqIiqosSXt0zoqHIOmB/wYJKxIpqXOKlVsaLo5QbzbSM134zWhkP6kknzzqqD+WwmU00AIkbihvdpWFeqiWc2AuZ0Fav8xLNqnE73k6KaKs+TasByiEzukt/I8YlvtcSDoZR7yBiQyVi4xRUe0ETmmnPfz9RkTk2PYXotFxPurDyQGAnWn4TsHCfiuJTQg1wlvoD59QmUQMoblEAAAAASUVORK5CYII=",yx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABsElEQVR42k3TWVKCQQwE4DmGBSqcTwFZRfZdcUG4cawvVVPlQ8iQpdPpmb+MRqOYTCbB93q9+Pz8jNVqFe/v7/Hx8RHn8znP/PV6jcPhkPHL5ZLnonE6ncbr62u8vLzEer2Or6+vjNXC39/fjG+32/Tip9MpActsNot+v58Aw+EwNptNsjgejzGfz+P7+zsNENvtdgmwWCwSsDw/P0en08nmwWCQCSDoVSCMrABQrtlsxsPDQ9zd3UWxL7oaNKNIk8fHx2i323F/fx/L5TJB2M/PTzQajcwBLX4ENEBUDEAjIyANsNnv97lCq9XKdQwvilBiGBCy6oGNhtvtlgDANdmdWaOYWpEJajoAuyrSUAGc6UAXOayLRsVAmClidSJQgFZlVYuqS6lXpRCqZp5YvLUqO03EJrqh+ooHIWk6wXgUFWNhqjM9NDmrA5wivr29JRV//j8QoM48IM1MTI9ag0p99zyqGChUZD1mutsx/enpKVeoN1b+06wT62sUAwSg3lS328282wJe0KBypalQsl4hgLqvOt8N4MooASSJWa9UzH9+PB5nzHcCGAMxwED+AE3kZHy1bKoMAAAAAElFTkSuQmCC",Mx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB4UlEQVR42jWTZRLCQAyF92a4uw9XQIq3uDuHfsyXmf1RCrvJswS33+/1er10v991OByUy+WUz+eVyWQ0m800nU5VKBRUrVaVTqftrlQqqd1u63w+y3FZLBZVq9XU7XaVTCYVi8UMgMJsNmvvZrOpSqVijdRDVC6X5Y7Hoz6fjwHE43GFYaj5fK4oijQYDKzJg/R6PVPT6XQMEEL3fr+FDYpoXiwWWi6XJn+1WhlYKpXSer3WZrMxu5Ciol6vy7VaLfNHM42j0ciYJ5OJAWCJYjKiebfb6fl82sOZ2263Jg8GQGD2IcKMBZoajYYej4exn04n3W43XS4XOVDwjz+K8EdQqAIIC9iCCN+AYIWJAeSQRRMj+X6/FijfUUWQKKKBcTJGpKPWK3GMAik08uaBBVXkgHzYYeQMa4THb9sDQvr9fnaAHQAYD6w0AsCDFSaFKkh98I4Pwur3+yYLiaTOOVOgAQCYAUQ+WfCG1BbJB8TDWPHvpTIFCAAFDGVYoZmxOz5g4BIALpGYSCQsNHKAgA30S8Ya45+AHVtImrByQSFex+OxhsOhvYMgMBWQwIx/QFFvfyZksgN+tpyBTiM5IJ8mGlBLPWOF3OGJ5Anver3aulJMIwBePupQwTTIhxoW7g+s+zDX4AYuzgAAAABJRU5ErkJggg==",Ex="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACa0lEQVR42lVTWU8aYRSdX2PamFSl0gqiabGxlJ0ZsOBSmxqLKIhbfRFhNoai777YIrtV+5OaPvSPnOZcHBIfbr6ZL3PPPcsdRf+6gMoXH+y9ILTgBPT8IpziEqzCG6SDE7AKizB3FuTMLj/H5cEynOJb1LbnsRqahFLbDsApLeF8y4+18AtUtvyP5RPARjEIIx8QkFxoEs3yOzRKQbn/FJ2C0qqG0TXj6Bhx7KZn8LMaxtBR0TZiKKRn0NEjuG2kcPddw9H6HG6dFHpWDF0jisO111CuKyFpbusxrAafoWsl0LOSuKlFsJvxoG/F0TNj6BgR7GdnBejhIiMA5dwslI4Zx/XZe/yofBAAMpA6D+N4wy8N/Pjq6upJ/b5cwenm/IhBW4/i+iyEv//+SA0dDZRGSZz+q6HCNM0ndd9Mo5ydhdKzEuLBoK6OATqPnhS0aaFLAOreVz24v0hjYCfEC3qisLlfT4kHYwYNTUB31CkBuGtq0kAAvhOAdfo5AIVmdYyYaHYBumYCN7WoSKDWh4u0SHEBeCeAH19CGdRTQpfRuQA3ehStagSlrFdiFMqNEQMayua+HUdpxQNl4KgynVPZTDMph/fl3CsM60lpcj2QvXBSEuvJhg8K42MD03AZtGoRYZFXpyRGUuY+EMDdg4fLDIpkwAj7dkqiO1r3yTP1U9JexoO2HhYGTIIA7VpYWPBOUuCknp0U6vtZr0gZSCrR8R5wKpu+bfqFCcGG9QQOcl53kWJCmwwIwHee+ccYOY1GFldGgPSF93uZaSh9OymOs0iZQGzmP3G4NjfeRJ7HGz50jYhsIQGYwn/FrmC+c8IzXAAAAABJRU5ErkJggg==",Sx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACNUlEQVR42pWSyVJTURCGz1P4CC5VUONNABcuVMhwb+7NnFSMhaJSJSZQEQOZyERGyBYlEEPmUfABf6s7Q7kMi670f/r8X5/uXNHJyuidWjEs2dFMm9HPq+jlrRhXnKybKRNGJTui2wa0sxbOb1ImDIs2DkHmQdGGccXBoFbajMmZk4F03i9oGBQ1JHY20MqYZ2cqn7czFohJxclJM21iQDsrc+dx2cGGTk5GN6cg/nGdXzcoaHy3k1MwKtshDgNr2HM9xVfnKgwPHywVh4F17Ht12Pe+gKB5iExEKlL37mws0rSjUXk63hwwr0cCEsRwthRaGhWp0MpY+NmsadaszHfmAMqp4dF7PUQvr3IHMlGRNM1OYNK0XOrYODEuAGSmfye9+woi5HmOA5+EsF+/9A7C7wwIup+xR0wqDgyLGm7PpyOMyzYMClZ0c9MXTcp29PNWjEq2BaB3St+OgruqC+Jv1c2Gu6qbi7fnLoxKGv6cORZA0v8DqEbmYUGFICOZ6CVzej+vYFhUWY+KGno5mUFzADWcVOwMFkfbGzj+8BJhv3SP72ANBz4dh6ifWHAZ28JV3Lg0oBbbwmV0E420AkFGSm7SCi4ibxhWT1pwlTDhV3QTF5HXaKQU1r9TMn4EDGhlVVwnzaxFPWkGRS1mxHXCxJcJSAbqUosbORopmYHf/RLnzayKn8dvIYJeCV9sKwh59Qh6JLDWVvDNIyHk02PPrcNn9Qnf2bE+4vqubZV/P6mP8Q/a0iedKWTMOAAAAABJRU5ErkJggg==",wx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABD0lEQVR42qXRV1KDMQwE4ByRY9D7+XKQ0NMgELiCmc8za2z+xzzIRdKuVtLsaD4vh9jMcb59Lnffm3L58Vqudm/l5mtV7/59un4sJ6uHmsN38f7yRwB8/7Otd0AAZ5un6gf0B2b8chsBh0BA2BFJYv7sdr9uKqkeWuireCMCYPyxqBgIUjlzSN+RG0XIkKfY0ML157JJ9JYAdLxc1DcSN/IongxRABhJBsoXNf2WJltgkqmRkOFlC1HpRjIoiOTIRpTKvR8hoJgijUCfkZf1RXYfM6MMdNiChKwLc/6SJXpHNvOnuhEA6e2/SUrlEOQWnwwxew8gJNpQxED5+YYWAAQzTEH/tJE4EhZljeAQ+wU3pxxrczn9YAAAAABJRU5ErkJggg==",Tx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABzElEQVR42k2SuUoEQRCG+x3FjdRARRCc2fs+Zu/7eigDZUE01EAFQRYUEQMx2l++ghKDZrqr6j+qakK73Vaz2VShUFCSJMrn80qn0yKeyWQ0Ho8t3mq1NJlM7M0XzHq9VqhWq8rlclbU7/eVzWYNHMexyuWy3S+009HLo4bDoZbLpXq9nlarleWMABDKEKAEWaPRMAK+57sf7V1farFYmCoxwNPpVAErlUrFijudjhFQAAnx0Wik+XxulgE5uNvtGmHgUqvVrA0c0HepVDJCXAEEBLGT0AKkfK0FHxIgyCjEdupuo9TtxggQohbbg8HADnMIgEiijiLzYIAnH1udfX/adiBFDSLqcIF9Wg71et2YUYWAIlooFovWDmCPIUYd6rimjcCD9ZDgkADIv+BrhAwRxGiVO87IB6wBclbUKOQwWAdBzp167k4eSGKTL05IsD6S2KZP8ihyfJi44gQUfbfsnCJa8J27ZV8rBLjgTW1gqlgDTDGsURQZiRfxjiTt31z9tUccQiNAyYfEIQGYdR4+P+jg6V6nX29GRA4Rhkxr4f+AfGVOSPHx+6tiyebBUPlPAPtaw2w2s+FxAKFKkhYgAoAycYYLiduH6BfsHX2OvyqTWAAAAABJRU5ErkJggg==",Cx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABvklEQVR42k3TWVNVQQwE4Pk58ARFlYjsLmyyXRBREREui+zPgAIKKG6oKP93rC9WLB5ScybT6e5k5pSfWxP15HlP/fCyP8L+0/LD+n6hrx4/6474ujZSr948jvNf25P1/NVg3ZzorB9fP6jlemcqCmwOn3TWg9k79d38vYizxYEoVugb2ZfV4SC/XHlUf+9O1wKgWOH+bG8cUvi+MVaP5u7Wb+ujoYqEmD2hz82hfw4wsY0NiYNckclzQ1mOE/uLpftBViSoifXRjiDDTPXH5ngUaRER7G6jOxyYCfcFANvN/kzYTHt7jZ4gVfz2aVcQK4KFaw63R0uFEiv6trKaASivJfMwRE7cWroq2G3M4s9eI0IB+0iAiMCcvugNHFJtchMOWGHRoaAkb835AGc4IxwtsGaqWBUblG/K5gHEjSv2rZAzRP8J2APO9+D6APIqEZiH7+ZQWwzcudp4B6aLLZ9tPmGEivMdwNkT1Aa3xeQxAyvihP3bgzUfOATak8srLpKuRYILe9aR5BUiQpDPmqA24hqxKRLbk10BRqRnBfokgCxxSFI4ZuDV5d+XKoiRWBf6WwJMWYvOFwdag/wvxBgmgSkewCoAAAAASUVORK5CYII=",Rx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABdUlEQVR42qWTyVICMRCGeRAfwyMnTx4wiLKN+/IquBBUoLTc1yqpYQaEGS9a7utztfU36TDgHKzy0KTDn3zp9J9JjI+O0MvxHMfnxTLd7+Xp63KFvq9WKagWqFFK8f+PBw6vwfh8NEtvpwuEvQn8POwXeTIc7kaawroTqwFiATgVo68VdbTiEfP2VpYaaxO9XCtqaUVNoymV7QNQsgDcCCCsObYCgAOtGIR5Mjn2+wpdrSg0VWDe3JykbrXAeWDAoknVDLjbzfU2mBO6ZpGvp7iKKCCIA8hkONADr5yJ1Z4OZwYBryfzXAm6ixzW3Wzn+Aro0cf5El8VuuQWIJ4OBxxw19OxGg6xADyQaA/EhetSygI8rThEez9b7AOEJk3yzCKUH7XRi2gDL1Ga6JrHIl63K1nq7ORtBZ2INuCClBOahyRWYbO8xKbRBIAmWwA+nLhG+eUMtSrTf7MRFuJeEEBHVUGtSLd1h79A6OgVcmiw0gL+Ez92GiA6laiT0wAAAABJRU5ErkJggg==",Dx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVR42mPwMJH5TwlmABF7ZkSRrPHQvASEATunhoM5X3/9+f/ozSc4hinGJg6zlAHZNGRFyAZgEz+6MBnTC6QYsG9WDMKAvTOjSTYAxQvkBCLMUrIDcceUMIQBB+bEkeyFw/MTEQbAQpQUA2CWgg04ODeeZANgelDCgOyUCApRUEyA/HVkQdL/3dMjwfG8oiPg/+quYLDi/bNjwQG3a1oEmA2iUQIRpAGkEGQYKExATlzXG/p/XV8Y2FCQK0EGgywBYZRYACkGaQQpACkEmQ4ybGVHwP9VXUFg14EMBVkEkocZBjdgWpkDWRikFwBh6nG6mkGYKgAAAABJRU5ErkJggg==",Lx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACzUlEQVR42iWS2XbiVhBF9Zi2kQQaEMZ4aLtNY2wMiEFIQmKWAQO2PLs76X7JS5J/zGfkd3aWqh9qnVq36p46p+5Vlqc/GdqPhGYq2FbndPNLhqUHOvot6dnfjI0PiSzvF9aMD19ITr8R2Pcoy88/iOxHRs4zs8oHk+NnXG1B11jSt9ZEhRf+e/+Xx+o/JKUfDJ0HolKKb22Zn7yjzI4+6OkrFiffpbGlTokPH+iZS0aVlEX5D9LqX0yL34iNV8aVJ4bllLB0z+zkFSVyUqZHbyJbpJd3NHIjQeu3YybFd4mx/cb27E86hURUZrXw4B5lVH4hLj0zqbwxMHbEzjOr85/0tDXJ6e+4akJcfsIz7ohKj3j2mvgoFYWD4h1KdPBIN79ifvqBb+/wjA1DJxU7yefvjI+eZbGZ5Kic0tTGdK1brvdjQcW3t7haQt9YSwxLqUwdmBsy8rY2x7PWuPqCm9xEiMPDDf7BmoYao0SHKYGzpZmb0dyfiLeWOmd2+ipnPWtJS5/JTrK8oUUMDlb0igk3eoxS1wI6xTm13IArPcQvbnD1hG5hSSd/K959a8Oo/CTk85M3ecbMaldfolxqPh1nKtKa1oigtMXNL/CdDYNiZmuF72wFA2cnakNnx/T4Rf6L0jBC6rrPVd7nq9rHNRZ0zYTh4U7yjDjb+o06EcwGZNt38wlxJUWpqj2ujYCrgk/DDOmYc8LKlrYx5Wo/ol9cSXjOmqB0J3+krc8YOHcySLnWhrTNKS1zIljLebTsEdf5gJYV0zRjWtaIGzMSq1k9U3WpetKjfN3zZDnZAutqQDXX/dWge3zZ68jFlh2LvZrm0SzG1PMDrgoBZ5/a2Sv4MsV1JmR5TetRL3ic77k0rJCLXIea1hfSi1yXqtqlWYy4yLmSK9nES/0X4/knlxs7pJbvcb7XomEHou7a9OU8i7rh8SXXlvrZXpP/Aai/mcmoOHeuAAAAAElFTkSuQmCC",Ix="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABwUlEQVR42k2T2XbiQAxE+9vykD+eTBJCvIGN990GDMkkP6I5VyAfHnTUW5WqS93O27xIsH2VyHuXMo2kLRMpDqE0RazzuS/lNNaaf6+z7Px3icMPSfeeZLEvLom2epDJzt/oeGgynUN0PfXSVYkscyt9fVAgGCNyAPbBRvIkWIOKkBAAxzZbVXibP0oCeCU47D61GgGozvcydYUChiZVkq/zoJnqwfavFHecMxB5bHOV3lUHZa+ynaoD1JSJxuXY6v55qtUnh2QWOAwB8hijDCXsP5q2zI18L6Pm01iJQwZAu9Pz07OGVUYuZLbe16lMbS5jk8n11N0UmGyIAKHAVJlHdRGr86wf+3IlcoAwi4MG4m4QcwXGZjDX+D4Paiw42qsm5omvD8h8gJ31y9zKcahWcsggoEN05HLsxJ2nRgk4aBWtlbc23h4V+4whoPK/ZZSfyyQONqpaRgkkZtqjeUb6+zVrJhz3QiLZTKRi5L2paVQ1+agIP1816E7KX4AZICS0EbBlSJa7D6YMEAR5Et4IqGz3fHw4vAMqQzDf28Z/yOJA/I8X3edfOA4DpAP2KiFDkT1zSDBbVUbb++cLtdB/a9NSJwf7IrIAAAAASUVORK5CYII=",Px="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABJUlEQVR42qXSSVZCMRCFYZbjClQUFR2wDEEBuwW5IMEGRLcUzpdzbjRjBvWSl9z6q0kNjl4n5RAb+FxsluX657kM3+/K6XpWzj/ndXV2uX0oo69F3Tv3P9491X0HuPp+rJfs+O22igBZgPa0VvoGQD/7uK9GLGIysDJgdwl2spr+ATigAhAQ2hMy9/5vfl/qnjNoA7jgKAoH6YuevjjPGp3/BkhtHAD0QCSZMAFElEV605XgkEWUdFM7mACcwJ37b4B0naN9nNKsPG+eNdk2ABFLE0VPzYTg/+eBtpuDpJZmphd5Mqt7ugwSbQOgpTGZOE7STv2ZFYDoOkCeL+lG6C59sGYSu2fMm3MGykSyQJ0Hkgy7HqgpNRICZhYynRkw+66EQ2wPLItP+i1ConcAAAAASUVORK5CYII=",Ux="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABx0lEQVR42j2TuU4DQRBE5zPAyMYfhQROSMBIIK/vY33f9/E/ZAgJYmICLJEgESHxAY1eod5gNDtd3VXVPbOh0WhYv9+3brdrfC+XS63tdmuDwUDf8/ncptOptdtt5c1mM2GdTsdCrVZTwmQyUYAkEnq9npLARqORCDjX63Vhw+HQFouFBVQphpkgOwtlCkiCmPNqtdI3ZLiWA5JhZI/jWCCqFHCGHBKceYwzC4EAEyCtALJwghrWOaME3mw2rVQqWavVsmKxaOVy2QIB751kQBz4NyrsuGQVCgWrVCqqIScAUkwARp/weDxOWqINYtVqVcrkUsc5MFW35KpYhYA+aYM20+83dv79YNnff+tRFCk3+NBY3jdq9Ay5z+H06dLSH7dyhACuucHgKpvNxg6Hg5Jpg2J2VFip15yc+M2AswcmvtvtbL1eK8Cg6NGTUeT6OLOD4RaH5IoAy07CtyuAsfwVEvdXCqEIAGgBVoI+debBIHlgZ2/Xlvm6V9/gfkPMIiEgiD3mgKorqf/nK0u95JK5+KvVDAjASgAFivxGwBwHQyT7E1n6mLeTxwsRBQpxwQEn+/1exez+YHy4XFvmmLfM513yi/8Ba651cdcejQwAAAAASUVORK5CYII=",Nx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACH0lEQVR42k1RSXLbMBDEzZa4LwIILiBFSZZkyXaqcuB38qIkjpM4juw8Lqf8olM9hqp0mBoOgF6mqV7chJOb8MVNeHITfrkJP/38x014vTh7unjH899ugnpzEz79+ysDD5/9xXffXzzo5O/4/egxnNWTHz5fAM6Pv7pJzt88Ie++eQfEUFCdLmz+8I9P/uHrBdGjX+Ncz55U5dGAobmHLbdIQ4ci6dGYHfLYSe+bOyTzFmnQYeU+QOcrjO4BbbVHVayhWnMLVx+FgN0Ua2RRJwQ6H9GaPcbuAba8QRY6AeVxjzTsUCQDFIGsRu+FgCAqk6RMB5hi44k3qBdbIaCDeN6IG1Umo1zGsxadPSCe1VIk6pujKHf2FkN7L0VlVx+k816VaY8kqJGGNVq7FWaTr8TF0N5BZ2vJgUIUWWQD8rhDGjUgVsVzi+BKI4tbIcoiJ0CGRBWuxgyyqJeqzQY6H1AkTjDqXdXCFON7z1dirUyXQkR1y90ZYtQjvDawei09DiwUrdB+kTpxQgLuyISX3T266iAkBLNHMyNrtNVWSFRjbgTIgS5qvUaRdqjNGnFQYdk9wNmjD9DB1Xv07UFIwusKKg0bCYXgqlxhkfUIrhbQeY9obrAZPiKPB+lcJQ1bUU+CRn61IiMdMEBdLBHONMrMSc/iRlSpTgL+EdfcSoDnNVRnd+IgmlVij0BWtRgRXmsJT4D2iFrvRJkYgrnKf4SBd1yXkk+ZAAAAAElFTkSuQmCC",Fx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkElEQVR42kVTaVMaURDcH6+JotwqoGhEkcMziYjIcu3FtbCLUblvVwSp/IZOzRCTD6/YKl739HT3ExTVBa3kRbm6i4q+B1lxo9s/xXPzEP3hGZ6bR8gVHEimNmA+7uNB3IJadKNmBKBoLggElhQn6uYBytU9/pZVNx7ETciqBz8TazDMAKq1PdRNP+4fNjEcn+H1LY73xTWEyWsMo8kZKroP6YwNpfIuFM2NYnkXg1EYiuZBIvkFj0/BfwR0nwiG4zCE0SQCve5HWtyEmCV5HowmUf7tDU7R7h4z2X1qAzXDh9vEGvR6AFMrhvE0AkGv+5ggm7fz/rLiQrcfgjW7RK5gZxVEaM0uUNH9ELN21Ix9FMs70Gt+CNYsvjJE9UDM2pCXHJhacSbJS3Z0eiE+BcmB27s1tDonMBoBiNlt1I0AhPnHNbSSB/mCA63OMSsh6bQagSTFxdPIbPLGMP1Mks5sYf5xRSZGQCQ0uTcIs/sEHo4jTESyFdWN/vCUiRLJdTbTfAxiakUhkJuz+SXykhOjSQyZ3DZUzYOpdc5xSbITk9c4H1KQzmwjcbfOBIvlzcoDUlGq7GA4jkLVvLw7mUl9oAQ+1dAaqbSNy1St+fD2frFSsPz9A2bjgPenLlCZKAEqEilTizscq6y6WEUy9RVG44CVC8RE0ylOml6Q6ZIXBcmJwSjChyrd7YfZI/pvPI2i9D/GcyyW3znKldNefgudHp0TBrU6ob/v4pCHUMzURsIJ9DFf3nCzaB0xY2NQu3vCoF/PQfam2f7GhKSYKkzy2YNVZGGQEmodxUiAp5cgE5GaZvuYX+VL64gJ3hdXPJDfAkVBYGKbza/YA5Lf7oaYgKYSIXmRzdm59nT3U8UfqCw72Pj57lEAAAAASUVORK5CYII=",Bx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACBUlEQVR42jWT51bbQBBG9w0SkhBkuVvIBVww7rZMT3KMjUOIA6ak9/d/gC/nDtkfc6Zs0dxvVu7rYUW3g7x+v2ro75uW2Z/XTbMfJzvmWX8Yl/Qp2Ta7HxX1eRrr+3FNblB6rpNG7tHqOZEnlUBnrYLZKNo0f9rM67ieVTf/VMPohSbxlo52M3KrQUmz+pbmzVCLVqirXkGrQaRZPdBqGOmyk9P7fkmXnbyW7YyW7aytsx/vfp7uWpt3w4K1DBJt0iKtUgePfeS/zuoWUwPLwcEhPIVvR1XLuQDz2nCINf8xLiN3ndwT4/LMB7VQ4/iluvkNjbY31S8+M49GaAP3tJoyrQ530nJ305rmzZRuxrHxz1uhzpsp4ztvBP8tpetRLPQiZg1tOGsItLju5/RxEpkOjA1W2qRGy3gQiT0iWrkvB2UrYH7u1LjU6+ENHfBcjNkFMCblwHjgJGfGeGY/KT/OG11gZx8xe9jvmPe7bsFYb5OqxTfjspb7WS1aaau93c/qehxrsZfWRTujD8PI1meNQI424IUJjybwggAKrcIOntfJj5TcIRgFjENs5jLqHOID/uGQc4H/GHo4mHgHGKzM2vMya3sb1dA8tV5hw96KP+Pg5K0zU2LexDqpWIw+6EG8nlTsP7jqFe2fudhL27/hPCPjgwk22oQfPfwbIKdtr4vH/geZ9KljEaVWjQAAAABJRU5ErkJggg==",kx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAO0lEQVR42mNgGL7gjpHNfxgmS/OvO25wTLIhA28AxWEAAzY9Rv8piomBNQCkmWwDYBqp4gWKvUHzQAQAlSpNE3D8AIoAAAAASUVORK5CYII=",Ox="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB3ElEQVR42oWTSW4CQQxF6xCs+x5sEBLzPA9bQMAKwQIQ8zxzgCiR2GWRG+RafQNHz63KtEgWlqvL/t/fdrXZ7XayWq0kEonIYrGQVColoVBIisWibLdbuVwuaqVSSRKJhGSzWclkMhoDZzabjR4Ilstl6ff70ul0pFqtyu12U1IMwOFw0DyKzmYzGY1GYjiQUKlUpN1uK0G325V6vS73+13J8RAcj0cl5g6S6XTqKYAkHA5Lo9HQ6s1mU2q1miat12utvN/v1VMIjykBzMjy+/3SarUUjAoIrterJuJph96tQYxyw7ACgYAEg0GJxWLqe72exONxlU1iOp3Wyslk8lM+cVXAB/IwGEkgCDEgtkLv3GPkAaRtlBsrhSD+dDppAiAqk8iclsulgieTicYLhYIq0i2QDJCzz+f70wDzFlDG2o1dB8Pi/B+BbYs28YZDLpfTAfLavie7b47nn5wfCmhnPp9rUQMISRBhCnhxxH3+ArmvjrgP7/t8PmshlOTzeW+N9M5ueUy/JbvvjhLYbyYPhv5RbqLRqE6fCbMJ1AwGAxkOh/rWaW08HqtkYvxoTJ8NsQlVwPAA2BVBCtDOhpfJPZItkBiExl5CghKqQco9laxxT3VAFKBtCn4AuTYZj0NdJJ4AAAAASUVORK5CYII=",zx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAARElEQVR42mN4+OHrM0owA4j4//8/Azl41ICBNODDr/8nyDYAppmgAcgKcYnhNIAYzTgNIFYzVgNI0YxhAKmaqZsOKMEAk/kuojV/pp8AAAAASUVORK5CYII=",Vx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACEklEQVR42k2SWU/TURDF78cSF9xYXEBR/AxYtBQrdBFaaw0xgrKIC6JAQRbjA8/qs/BmCDyQkDQ1jVvaoMQg2NLUHPMbcg0Pk/ufe+d/zpkz42ZSl/Ssu0Glwpy+bYzr1Z3Lmr7dotl0qx6HT9s53HFc1A0Fa/XkZp0eXjuq4lqnSp+icvzQf7VG2ZVRSe9VLs5rK58xEICnEhfsfe7uFcsJQFTu03jsrNyL+DljGrx+TNtfZlT58doKRm+c0kDgsLE9aD9iysgB39tc0O73WVPlVL1n6C9vnTdWCgF9Hj1j3wADBtvTrnpJHyS9ldQvFRNyPAAAGgWwowgAbSYFwdePQVNi0vXOyPQrpZ1st5wv5qSAR4yDXdtpZZcC0u+0sssBTfQ0mRrAHnWeNFMdrD4AoA3UUIjMSj6mn+thA+SeAAgzzcSR0An7kcv7bYfsxCyCfLK32QrxhXEChAJvrnkAAMFPtAD7WKTR7igih4hxYipnJnnRAB2P9OIL2QWW6u/WGyvybxjNCcDBe8eiII+ESwC0s/hflQ9qaId6TnLzgBGB7leWYr8LsNEKU4KVn6mhHUb4JxfZbwFDMI8JkAPCmLgHhBH7YAp4Vf0ct9HaGGEDAAORByMstAUrKgBnKh6klIuaUpuC7x93aYWWkAy73w9O3mGHjADYaa/PHmFFsmfgJ4D8HkDgDQSY7SyshvQPMjiB12kpDZcAAAAASUVORK5CYII=",Gx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABIklEQVR42qWSSXLCQAxFOVOOAQmQAZ+Uk7AOZA4+QCATIOqp8hyrWLKQuy19fam/NFjML+IcG/CJ9Sx+X67j+2kSu9eb2K4u09c/f56nsVmO4utxHPu327wXAgIa4GibBGEf98OOgAKckPwTtE06AHqHCCDVOemQOP/EwHUEtE4XAEjGqHR4v+uqS8yJEe8I+MFJFezz4SoJIYYkCdaz7AQcHeAvGhAgMdv7E05BISIGAXeKFAKSrAaQu4IqHKTEwJwQ+E6MZNWnOkDNCTneIiJOmAEppkI6Qk6FLGP0rTjtIKu0TfFDrtBlCiSovC2ShI9/38ydxBMNcNoaAQh8v63nCHtCllWG0XUm6A7Ytk9QK+NljCoPgfsu0Kr9rsoqn2NHAE8QOxtBUK8AAAAASUVORK5CYII=",Hx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAByElEQVR42k2TuU6DQQyE/XJQIoiCQPAGuZT7vu87eSsK6CmgpAEJaJKKSIM+S0YUm931zozH/h3T6UbPD2c6fVypUqmoVqupXq+rWq2q2+1Kx6ReHs/9XiwW1Ww2lc1m/Z7JZGTSnRCByOr3+2q1Wn5GAFKn09FgMPB7u932N0RIaDokHTCZTDSdTv3c6/X8DBgiBEQRIDMOWeCMHwCAS6WSRqORZrOZhsOhZ2AVCgW/hxjWSUQ5tt/vxSIAcbvdOni1Wmk+n2uxWDiR0hAHt9vttF6vtVwuZQTIvtlsHMCOXWLj8dhFiQNGhEUpETdqJxMXnKAOgDh7gCmVGJnBEgdv/+2EbVyQCXdRAk2lcZAjKcIWRC7YBoB1FkQahRBlNRqNvy8SrgxVmsZONh4RgRx9IBtgXEUcUcowLrggEwBEcEQZ+k5IupWO146J5rLAc/cSyIg9ssX3ZvcpPSTdAQQykoRz9MEYknK57CRsMjiQEQREguPbhaR7F2SEEYAD11CFRIBJjMeYD0Rfn86lz4SXRiydTiuXyymfz8tiZCFRExYpBSKNRUhfCXfDW4xyOLeYdx4JRqdj1vmn/rxfuv34WizIqVRKv2Fqi4/rqCKfAAAAAElFTkSuQmCC",Wx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB9klEQVR42k2S504bQBCE730oogQDxgVMSyA0Y5tebFNCFSKJRO+E3olC7+856Ft0KD9Od7e7szOzd274tUptJ3nq+lei3psyjbzFlH4Ma+il0s4D9xV2ZqcueVGovttyDT6E1HqcKwew/y5ol8R5gTr+FlsjCrqvApajUeYpIshokLosskXe9VyXKh3Lsa7x03xNNgc0mwhrrKFY5H6lIrbTJFubbyoAQpx9jsrNxINa6w7rdypqUk/Gvmuzr1IXU60ab/yi88kWA6DsdLzJCDLVH2pR6ghu9Vdpvj2gn8mILqfbtJet05/Bah3/aNRuptYAEHCfi5doMVmm2faQxdxOukYsgssdQWMHvNoV0uHIt8+GS6ly7Q/Va70nYkogRLkDRCH7SmeFJQ+Gv5oV2BcSpXanhjvx7YHY59nBxgUbSIQZ0NFog8U3eqN254wSmtGAOmIOichjJ4EVOqOIHTByAVCHRWJetYOZrhThD5/MBABxAN4eMZShBGXU2xCxATtJ7jChhCJmwo49VNKIvFdlz+i9wkgT/gCsHsTCDuqInU002/8Aaw3oii8SNMCffwksUAwQZs6ooxaMA4AXLlgBQKG34ocGiMXMIMQCipxn88/m3544BcyGoRFjxxrs2KK5+z/BGWZ+GDF2WP3Q/D8gjhXm9g6tYSS0EsY1RAAAAABJRU5ErkJggg==",Xx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABiElEQVR42k3TZ05YQQwE4L0PHRJqgAAHCL2FXk8TOqGGzjkdfZYs8eNpd+3xzHjXrx2+T8XB28/Yf52MrcfR2LgfzvX33VDGNx9GYuG8J7b/jcX67WAcfUxnbvmqP3aefkQrkKRiQfuV64GYPenMHPK50648E1S8eNGbsQZMQaJAALvP4+kAkbyVsnXpsi+J126+RxOgyppiewWl7KyAgLwiOXttNUqSwHsvEwlGRn3177e0auVK/Nefjowdf87E/Fl3NLa1gQCRe5CwR46QUl2yVSucIGrFXgH2kPiQFDkMscLJI2p60TP7X1dFyLUC6JPzIVWHJO+ANWBJKoqAtOIMWGu15HLVtGJ1OUCU7FkFQkIEGCmsnJa02NysQ1llvd5cjNW6QAUc1JzkJLLFEnXsgDW+lKiKFSkSbtTJ5SUCIMHOco2zmByimgvtcYRALAlsALVjQGqsuWC1Rhk5+85qcpDYAkKkiH1nZAD1P3DFURESzJ+pnrCGpZ6z3rrIFMtps/5ERP8Bnh4qEBy90cgAAAAASUVORK5CYII=",Yx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACq0lEQVR42i1TZ3PaQBDV78rE44KxqRKqFAECBAjRezXVNBtwcJk4ZfJbX2Y3+XBzN3e7b9++fSfMhl2oYgh5K4njZolIOIBmxYEqhXHarrAc97GZT2CZMSQMFXFNgS6LWD0MMR12IUTVCOK6gpgmIxU3kDHjDBK482Ax7mE9G0EM+DDptxHTFOQzKWTMGCIhP+cJdtpEQlfw0G/zImRDlqBFRMTUCKjAoF1Hu+ryezpu4P24x345ZcbC8+McFScP20oyVVpmVEe/WUPIf4fpoINWpYTFuI9xt4lSPovjdgnKO+1WEAjNUCLQZYn7VqUQHgYdDFp1dBsVbqtRLmLYbmA+6rEOb4cdPs9H1kioODY69TIH06IzgQ07DbRrLkI+L5plB4vxgN+pb2o7k4whm4xDyKUSHEAVKGDca2HSa0MRg4jrKu+kBzGrlQqc1K6Vcdws8LJ7hPDr/QV+7w2qjo1es4qoJkMK+iGLQRbMc3nBiW+HLc5Pa2STMbRqLj5Oe/z5/grhx+uRL+OGikiIxncLx7ZAzKpOHpYZRbNSYtrU8++PbwzweT7ghUQkFDr4vR5YiX/BGTPKVelMbBplh81FoES9mE3j59sJxF4gBxqKBM/VBVeh4FbVRTGXRiGbgvfmCnY6ATef5d6DPi/ubq7g5jN8J+xXM6bdqVfgu72Gk7NQLuTY2qQBeYGEq7sFfiOmUsjPxWicwmG9gBYJY9Rt8viojeC9l6tSC1Sl7hYZkBgQYMnOgPLYSIQ66jRRyllMjYySjGq491zzmXzfqpb+szJx+fULzs8bHLcrnGiMJEi1aENXJBZpO59wsCaLrE0xZ2E9HSEV01kXAjWjGt/TxxLkcIB/G3n8aTWDaajsAbK1IYtciQzjFnJIJ6L80QatGtazMXbLKf4C7Skyh5I8TO0AAAAASUVORK5CYII=",qx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB+UlEQVR42j2T6VJTQRCF51UEI8GAstyouCKrr8ISExIslKRKIBINO+Efsm+Cig+ggAu4srzSsb6uan50zUz36e5z+vYNRyt3dLB0S9/W7up8v1s/tx/p97vH5vPzZOuhGZivqy36vn7P/BefnihQ4HjzgSWffui0AL6zj106XL6tv3vtlvxnt80SiIEl9nkxUiAJEJUxgIDoQqI3wL68TVoizDBjUOyPqVJIqpSp1Vh/TPP5SC97rqiSjzQ9dNNstK9a5VxCU89uyPD5yN7EAlTpCosfG/fN0Pprp9U6cocltGEIA3zkgA0A0Q2AO4WgC338vJ2uz4rCYClsQwQMiCAgunD3wiRwwpZEnxW4MDFYr0oh0uzzxkttI71VprWUjmuhkNRob7XG03Gb0cxQg8hhHuVcncK/9x2mhZNO/t3pRBf0shswcN18IZjzDgTR6Z8HCQR8iNAGg4+47wN+4oFEqhJ0fb4kDAkw3elIAs184PjCSE+VaWMXJnJ1evW0RuVsQqVMXLMvGjU33GQzYBaTg/V6PVBrPptRJq6ARirDAqq8mQE6oYv57tOdWWH4wQecTgtdnMihCHdOZFAEo5n/gCbB9963Df2+JMyB4s7Q/0hfOOYV0FZMxWwX+A/Yh/nhZtM91nfVduFN9rrNpZi6ZvuAdvaFvP9j6YXjKJEr0QAAAABJRU5ErkJggg==",Kx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACcUlEQVR42jVSaVfaQBTNb2/dWEM2wK1qv1Sr7JCQBGjrUm1/w/3coxZRthBQnJ77cvphzpvJ5C7vzdXynSWObxVYD64VrO4Ktv+KYrhGujZGpjaC7c9gejNsnj3ACtZIN2bItiKUBgpasa+Qa8fYv1KwQyUggjP1CUxvCb01Qb45xsbpvayDK4VPNwrlbwrEarq7gtF9kw8kMNwY5f5awNnGVJQ/fPkjNVUZIt+JkWnORZ17bfe7gumvYQXvUku9RJ0kqeqLqGfrz9IG96b/hr0fSki4NNuPUOjMwJpvTaG7S7FGm1xOEMmd3Y2Qrb9g/1KBrp2+SmZguHPsVJ5QCpMfj36ylXe5pNrW+aN811tTmG4EK1Qyh4L3BrunoFndCKYXgUR0wJbogjM5vFYotGdIVZ+EiCR0YLDVgcLJnYKWqb/g4+k9ts7/YuPsQVR5yTacnhLVdG0ka6cyFFK2wDmwRc3wlkjVxmDVOwvJA1+FP7Ie3yV2mZGjW4Vyfwm9PYfVjbF1PoTmhGtkmzMUe+/IteYCYo9U57MSyHY+/1Y4vFEohkvsVEYw3AV2B0tolv+K8kAJON+OJFR0UfBehSjXWeHkVzJxho0OqJyqPsP0FtBomyQFBog/XSZWaZ1kBO5dKlhBMhcS5JpTIaELreBGyLWmyDQmMLsxigHzMJGBbn59lPzb/gJWdwHDTbKSqo7g+LGcNTtYwQlX2L54EoLtiyH09hR8HWZDb8+Qa06EIF17FiDPvOdZHJCg1F+Be4KyjbGkkwHj3gkW4oLqBDtBLA5Jrol6ZSTL8BZim+x0wmxwTyKq/W/D8mIUw1ha+QcfOBvm79E87QAAAABJRU5ErkJggg==",Qx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA5klEQVR42qWTQRKEMAgE/f+jfIgaE/1ItjpVnQLdmwcWMpJhIOyyrmv/Ygs/x3H08zyHv66rt9aGgWFi+lLKsEkgsO/7SNi2bSTjJeI7BcDIwycCwPu+Z1XOGt8hFK+1ZgJAW/gnPaojhoBik4ADjBix/RKrjIuQGkOSFAB4yYpcgNThEoOpchLYU2wDTBLMAhFLLVjB/jxzQVI86mzxReCgiFXlHHxq5YNNAidupdiC5GLkgKVXMNkEzNhqxqhwwRJBXJI4MKv71C5VmoGyXOHnEllZYp/59V/QHKBtxMt4VUyCL/YDPqSC2MwXqD4AAAAASUVORK5CYII=",jx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB1klEQVR42j2TyUqDQRCE54Gz7/vyZ1/+JCBoUDwZDHgQRPFkEHMWvHgRRBCvIuoLlHwN7WHomenu6urqmTAYDNRut9VqtTSbzdTtdlUqlZTP521FUaRer6dGo6HFYqFms6lMJmMxhUJBASfJy+VSq9VK5XLZkgDCktTpdAycPUD4AAco9Pt9CxiPx+bI5XIGWK/XVa1WNZ/PrSp+7lkUwZ/NZhVIgsVkMjEgp0YFgkjAB8PhcGjJlUrFkok1BlDDiRZxHOvt+li7dWQMoAwLGNBGsVi0RRGsaUAyYjr116u17o4i1Wo1jUYjS4YFC10ohCU2kAwDKLpgBBLEnuqwmk6n+rg91efuzHSCPjY8bZf6ut/o+eLgf0w+WioARpusl8tD/ey35kMLWgzfD+d63MR2kU6nzSKQ9wkLAmFAi5yhzwhNA6ZAgPfPJb3DBAD2iIfytEN1CnCmWOCCXgAimKREImE9EgR1wH/3W73fnFh1zuSYBj4Wf1mAOH0YAQJ9poIeVMUPa3sHBMKCC/qDOhX8HstbYJEIU48xAHf4bAEiAMsZYaHqT9s/G8Dsg9Pm0tGxUPWfl0wmLcanhB9A+42uNiz8s1AJpf3bplIpS/DRsWfxiv8AVLh/8HhF7HkAAAAASUVORK5CYII=",Jx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABuElEQVR42l2TV3ICQQxE5wwGTFiS86kIJqwNJ3DO4S7kzGGcE7ZPIdcTpa0tf0ztbE+rJbVm3Nj35OU0I4ubTfm63pDnk7RMG9kA+77d0v2wltTv61lWsc+rdemUouK65VV5O88p+HiUkqdjTwa1pP7/3u8EAv1KXIPeL/LKIQae65ZjCoaroAL2BPAl66yZk5+7bRWFz9monhLXq8Tl43JNQVQRoC1aAScb5PFeWvdUaa2AuU45plkIeDhMiiwOpFWMaLDhiE72M3oGTiJw2nLzZl6zQ4Zgi2wmgA/hMzDO582cOLJRomWEPPbTgamWkXIJpHTD8c/NGlk1hkVvGAUZkvmAAF5xTmYwzkd1T1yrEAkMNHdpi77NRIQYNxVaMNwhUyCbKRPEahejSgSnMjDMJpDW+NeLRAvcJnMag6gEZTAzTUfmLy8P/3ZvJuExkskItszY/xNAEO7I98T1q4ngDbBQbhVWlMyeUq06BI1HFXjlBtVE0AIEptDbXb4PgrlcfLlIcPCBCqiYK+/o11qAjIg9JoQRohLICMAhOyLaQrsU1WB7PEyD+YbvPKJcOHsrNolhLSV/b3F+vBmIIJwAAAAASUVORK5CYII=",Zx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB0ElEQVR42j2TSUsDURCE329Rg2ggv0ZE8eDFg5GQzGTfM9nXSZiLCIInr97E3PWHtXwFncPjTfpVVVcvCev12gaDgfX7fWu1WjadTm02mxnxbrert9FoZOPx2CaTiWLVatWSJLFarWZhtVrZYrEQGXCaprZcLiW03+9FQIw4v8EgBr7RaFhAlewAPeNms9HZ7XbKCpkb0WazKXyn07F6vW6BbJ4dqzwCns/n1uv1dA6Hg2JkhhTHsQ2HQ4kEyHwgQG0AXSDLMgFxRmYwlEvZ9EkOUANAJm5s8wiYQ7xSqegmGQ4RRbDdblsgKwAa4j0ATGnb7VZACLjizt2/W774IzHwIYoilcCjN9AbhxO3T38gFaJfxb1vgVrJ7jViC0f8Pr99tfzL0S7u3oQplUqKU/ZpjHywFBzG5L3A1dlNZrmHD4lyIOK4XC5LjO8AifGwLJCwygNCZKdHvidkRAgyW6gp+PwhUL+vKiKAIPOGOCVdP3+rDMi4Dyh6EyFdPX1Zvng8uQGICLYvHz9PO0KTGbnGyIFAJhpWiP9UFqII+EYixBK5OJhAkK4TwD5B+kIm3wkXxwWO+eaNPQkEqQkyYkyDrAh6WYCJ4RT7rLP/S/8BOjhvX8hCe+kAAAAASUVORK5CYII=",$x="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADP0lEQVR42h2P608TVhyGD3bl0pbWXugKFQpF2Vi2Txtj02zK1VooUC69UKF0wJSRGJclu/xTS5jhJihQoFjaUsqtBVIETWRsTl2MMS7LnqXnw5Pz5by/93lFtNdA9vYHHN66xFSDYMFZyO5QOXGPiaPpz4h0aYn26Fnp1Mh3p0tJ1qflqF/HizEbYjNQytx1JX8s1cP+12SGK+XHiFvLXqiCZL9FHkn4zByM2En3FHHg0cjwobcYEXapifvMvEtcYaYpj/Q3Nla7imUw1mdkw/8+24NWYh4T2ds17LrzpcXbHz5kwykQS+0qOWGt+zwxb4k0SHhLpEXObn+4Ss6av66U5IK55hxno1bEyWwd/FRLukPw14iZRGch+/1GSapHw6bPRNhZQKRDzapLxZRDzX2XjokmJacPP0f8Ga7n3V07/3xfzds7lUQceSTdKjJ+g+RBSx5zTYJEn575ZkE0UE48WMWyx8LxTB3iiV/Ny28t0uBN9DJni/U8uV8nDU7H7PJAyl/C7kAp8d7zrHrLpMVSTwmJoB2R0z4LGthtExzP1snw09FyzsYv8uJuLXuDZXJGdrSKk7Eafm1QkBq+xPQNNZMOFWK6NZ85p4p7jQr+3bzCaoeaDa+R47Ea1nt0bISq5d4HnXpmnBommxSkRy4y1fweE1cFYitkJ8dks5LlbgPRbi0n39Ww4lIx33KOZKia+GAl6zcrSASr2BqysXHzApON55h3FiFy7Q9dWiauCcJuvQwuOJSyPROq4LfmfFa9pZLZtmJmWvMlix1alt16xGKnjmTQxs5wNbH+MvYGrcT79CR9JhIeA+FeM4vdJjljxWOR2pFeI4mAlUeeEsTxaCUpj54tr4G19gKyfUU89qpJdyn478ePiPpLmbiWR2qoioVOHZH2AhZahORoxIZ4PGLj7E4t2z4jewEzz0ctPBvUw88f8/fYBdb7y2T494V63qxf5vWjL9n2mwg7FMTcGkS0o4jFFsGyQ0GyV8dp0Ai/fMKOS0D6K3jawKvIF/C8GY6usuYqlO0nt+xkBkoRh0NWno3XkBmwsNSaJye8HrdJg4N7n8JpI6mQnfk2DbGAVU44DJWz6dGzGzDzP8aiSHpbdiwFAAAAAElFTkSuQmCC",eb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB3ElEQVR42k2ThVIDQQyG9xGwwZ1iLbQ4tMXd/Smwwd2dwd151TBfOrlpZ667t5vkl+TcxHeHlC6liXPOVe8USN2+TwJrWRI9C+h5wWyi3vGr3SuSksVUfa/azpfQVl7srvGoVDdNx2VCEEktF5VSOJfkJdsPkMmfTqlYz47dl69kyMh7i3RcV2syQVTm6b6r03f/aqZM/3XLwHNY3/seG3Xtua+PAYAc3MzVqrDhQQaJAERO/TL81qwg9QfFMvgSUTDkqhaqD71Gpeu2VormkxUZmqz5MwmeDGQZq7arUOycgN6HBhn7bBOYYFLnTY20XgalciNHg1h9CymazLkVLFtOF4dhUOQAL0Y/WtWc/qcmQSvMrBAJdMeM147QKiQQBC1W9DUclnhIgIRPyrWteIIXHgOM4GDqt8urbl7gMrphxR5UCsGOOIrpH8HjX+2Kjn4ucRqD8YUi8bPQfF6hYN6c0HMSzQuQaCl7itMR9siyJG8KcZUgCkANSTa+UOcMebwDQCzzwVzA0GEgVfFBB8M5ZygEG22+GViZT0ijQ3qJMaxGFbfxo2a3UF2nXXQIRBt3QDBbk0gwzTbj0KcAK0Nm5hkb+0acDQmH1l/Q6Eo8Kz4kaKMdafjEBP8DKnZwzOo3JTUAAAAASUVORK5CYII=",tb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACj0lEQVR42j2T6VbaUBSF8x6t2qItViAzYRIcUBkTAiSBMAgIxEAooLZ9/d11DuqvrCTrfvfs4QjTRgr1wg+suiqK8ldEXgbTpohlW0PkpvHYVPAyzOPJkrHtZ/Hb0zExFfwZF3ClHEEIOhofCjsKrtUTrF0DC1s9QFoinNs4XkcFjKsXCDsqXgZZ+JUEA+YtDcLcklDNnWLnZ/DYkBC0FSxtlW98bitwbuKIHB1PpsTvNMHM0rD3M7jWTiA8d3TU8meIHA0l5QiLloRJPYlxLYmdn8OwJrK8cS3BkraejnFD4ucnIPIMhB0ZV+oxItdg/ZNGCtt+Bu7tOcK2gtAxGLjtpTGoJPE2yqMkf4WwaMloFH7ibVRA2YhhbokIOjoWtsaa/UoSz235E0AHvbtz9mBYTUAInTSaxTj2fpYBS1tBwBOI7DqlQJPMmiID/02KGFZT2Lga7jOnECaNJCq5GDaujkvpC1ZOGjNT4hQCW0bv/gI7P8uywq7KN49qIk9yZ8QgBG2Ve0ASSuoxSwi7afZg2ZIwqkt4HRYYuHI07PoGpqbKXkxN+QBoXsax7qqcwtKWOcYPgHsbx8Y7ABeWyACKm+K8oRSoiZVsjI36AJBhM1PGxjPYRJIwbykMoCKRBPLiIXt2KNK98Q2vwzyu1BNseocqUwrkgVf+xT0gYwm4fy/c3jcwtzUI1DDygKpclI/Yg7kls5GBLbGJ9I+KtHZ0RI4KrxxnM8vpGIRpM8VN3PYNjpGqTHpJwgeAnvSNJiIJM0tlEDfxyRR5FyJX52Xa9A56qUz7QY6Xae1oLGs3yOPv4yX8hwSbyD1YuxlUMjGsOgpKyjEDqFy0TKR5UE1xjDQBLRPvQl16l/Ad/wHpztuqEpuNnAAAAABJRU5ErkJggg==",nb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABuklEQVR42lWTZ3LCQAyF90Lp7RAxGJuQfyn0lAvQCblCAgYMwzHS28k2871EnuTHjtaS3nuS1nJXpX3fiLZ9vbDlq/kN3Zvxji8Ha7L4Loq7vhZu+sujPeXZneNIIsEARoBN2jkdQPgQMyG+IRLB9fGBDqBZN/TTTt5/pHX/PDnXebw/9fNewaf9SKoAEQXrcACEfdw6FPBr2dR5Gp/pvCTljBAiwAhWcuveAaakaTdU0sPdiUBJJ+fn/UiA1agk/+u0ohyEaBkiZ6WQiALKtIHq26wqMmvhfV5TPB1EqlgEtEAFBGGftHOyn4uGfBBZG+NWoBjfDFMEMC2GRQVQmrQDlct9OSyqFQCQzXqh/LSSdPI/Q2QYPBVOVFe3JZGhCNmkFQik2KiUtbYYxGrDWS+oQEKvJNErFh/qkPC85DGr7D8AzEswcQKwUzpgQLRDRUYMAXFegdk5WGBb3hSlRgLl8lSLYaz2UP77KrwCBAg7+++ZKomATZ2KTNWqg9T2Q7tABcyBYULC0NJB/A9ICwzN9oI/kPxsmSDBCTNO29D0F0SMY9uItd1RBVxsZW2FbfOwtn1Yy7EV+Aab+kevh+NElQAAAABJRU5ErkJggg==",ib="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAaUlEQVR42mOImmb0H4bNouT+I/OxYXQ1DMgC6JIgPj55DAOIdQWyWgwXkGwAqU7GawAxgYYRBqQYgC28GEixHZsXSY5GjHRASRgQFYgUxQKhdIERBsQ4GW9eINUArCmRkI14o5HUGAHxAcRDCDOV7zHzAAAAAElFTkSuQmCC",sb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAI0lEQVR42mP4wfDjPz7MwMCAH48aMCwMIKSACAtGDRj6BgAA9VT3EP8L2v4AAAAASUVORK5CYII=",rb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAo0lEQVR42q1SMQqAMBDLGwRHF5eC+A5HZ///kcoJkRivONThpHrpJeaCfS7Va5vmepS1LsN4f4t3x0UfvBDFswI4zHskgDM7Q6aAuGtAPHoKOpWSW7JVEVW9BrhMlc6+egYFBSDObpb2naDfA3eerPwl37/6cw3IAqJryvKhBPhKWmbmQ8FvOWi5rCtTT7gdaHA8KB4qzQExyEzL/FCCx4BeD06qoX2CzD4JxgAAAABJRU5ErkJggg==",ob="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAYUlEQVR42mNgGAWjgAiwWUHrP1mKXxQk/AfxkTFMHKtGbBik+IqVAxhjk0cxAKQIpgFmO0wzOh9mIIpTsRmAy0BkF6G4AFkxMV7CGwbIclFSclgNwxkLIA3INAzADEIWAwA5WrNG//c3mwAAAABJRU5ErkJggg==",ab="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABEklEQVR42qXTSVLDQAwF0ByIYsECMnjOAPe/UFPPVV/YZJmFLLWGr99q+fDx9t5ekYPPcDy38XRp93Fe7encrWf2bZjaY1rK33+d2tIN7We5/QFwCFz7cU2iu89jFQAA5KzJ93xd/TsGSZQ0X/r1jEXssFDMRxdAEjFhB4iNje7i6Q6IFECoJ6ijZH46HTOTsCoAQSJIMNkycBZnB0y8AExUcqYLPUCuk3vnemGyGyJEwlZIK+LLWXEYPA0xiTT0DCySeQCigRUA1ExWkOT+rgSU/r8LBZDlAbTtrogvzyqHPy+0Y2Bw2xkoso1A4hPnZ5MCyLvnuWgdsnnZjQw1/83TDATyxgCSyJf/ISuOXQG8Ir94H6/lUHiUYQAAAABJRU5ErkJggg==",lb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACsUlEQVR42j2Te1faaBDG81HqsSbkQkIgt0ISLgbQL7C7p65UuYoCBbFStVVru9t+69/uvKftH3NmwuF95nmemdFuWy1GjsNVGLKIIoa2zTbLOLdtVnHMY56zKJdZui63ccxtnnOyv8+5aXJZraIJwKlhKJBtmjL1PN4nCXedDjdZxsc3b5hbFh+iiJswZO77bBsNzkollbXLIEBAhMEfr16xa7VYRpECkfin1+PH0ZF6LPVA17nvdBg7DkPLQpM/jctlBXJuWUrChe+zaTT4a2/vd/fv/T4b31edr+t1lmGoam0Rx6zTlIsgYOS6bPOcgWlyWioxdl2ei4Knw0O24keno/Ku0WDp+3xqtdBOTZNZrcbY81jV62zSlHkQ8LdhcBVFfO33mVoWC99X9ZeiYB0EfO31WFQqaNL5xDCYVqtssowzy2JULnOi64rBzLYZGQY3SaLyJgy5z3Neul0+pinaW13nnW0zsCyEjWiXEU4qFVZJwtnr14q2MJBaHl66rpIl35o4+9hsKodVHB1xl6Z8aja5cl1Wnsddvc7nPGddrbJNEp7lTVGwyzK0pefx/fiYl8ND/hWng4Bv/T7yu8SP42MVE8NQAMtqlYd2m6FhMHMcNJnvLkkUwDYIeMhzxeI6DBXQhzhWAJJlI8emyWB/n3UY8tTtoj21WnzrdrkwTVaVCpflMsODA9a1Go/tNtsw5KUoFMBNFKnuAvI+CBQb7bndZlYqMdF1pBb9F3IPcczccdhEEV96PaaOw32zycTz1K0MSiX+3NtDkwOZGoaSIFs3/jmy+yxjaprs0pSJbTO2LB5kW21b3c60UmH4ywORIPqFgZg40nWlX3wQ16/jWHWXuG02OTk4YOb76noVAwERL8QHoS6zXvm+kiLdn4pC7YHontdqaj+E/tv/9+A/PqbZa63/AUIAAAAASUVORK5CYII=",cb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACMUlEQVR42j2T2ZKlIBBEfev2KiougALud9+6Z/7/23Kisif6oYIIIU8mRZnoIqDMB8jalCOm4YE1vjGYM7pqRacnuG5F/mnQmw2zf/yWa49IXLehNzvaaiJg9k8UB4+2XFDlEXlqYNsFWvkfWHtEmXkaBHdFUmQ9xZXyUKnlhlYTN5fworNpZqiDRfbRUVykA0FNOf8AJIFtFth2pXPs72iKmUlE7O2RAFlFKIC+O7GSOTzRlBN0HmGbDXN4YZ/+YBu/4M0FtRLADdv4jaG7oswGeHuG63aMwxWJiIO7QKUDqiz8AqRce8LYP1jT8ITOJ1S5Z69MvSD/tEgm/8ASXzD1SkBdzLD1EeUhoqs2VNmI6O5MImtwZ8T+wiQEiHOtRgzmhHG4U2j0jmBv7Ic4S/SmWLDEL6jUsSS+bTfpwYt37dsT2mph9CW8cZz/osxG9O2ZSby5Yhwe8O6MvtuZQKU9klpNvPfknygPgWIRuuaETu8UinuRBgKKQ4/QX1hOEohz7G8swvyLkODuFApAUph65/fBnuheF5FrolLPgdinb0IEIE2Uw1IyE2UWmWCNX3SVF5BVrpJwoooZOv/5D8qD5zxIQ729wNQbtBqxjm/2aDBHdHpGXf5PIEKBRHfjYZku9dnDtTtBsjeHB0tA8ozinn0YwhLb7HwuiSkwuYb8B3UxckKjuxJaFxNTiKs0UlJwDuSjXKHTKweq0wvFMlhaRfZHxAKSM62eGL+pRsL+AZT8TCB+Q24BAAAAAElFTkSuQmCC",hb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACf0lEQVR42kVQWVPaYBTNL3JDFpUu04dqIYQkQJRtqljrRsuijooKBMLi2r612iq7gGi1/YOncy+mfbhzvnvuWTIR9pemUc+70SkpaBsymgUJ7aIXDV1ELedi7FZUtA0vGnkRvaoP3bKKjiEzL2RiM6jl3GgVJDR0D26yLg5r6h7G27KKOt2LEhuJ71Z8z6XyMKBf9XMDzTBIxC2bFbSKXm6l4FrWhV7Vz831vMihQjJkR1ybQCJoxYZ/HMmQDZ8XrLyv+8YQ1yzYDIwjFXYwR/pEyIZ0ZAqJoA3C3bEPHUPC4MSPdtHD2KsoaBVE6Guv0a+qzJu6li7y3quozAkkoOmWZTYRUgBhfu0VOkUJtyXvP83gJID70wCHtQseCA9nGi+Eppl2Sj/64OR3U3ezibBj/A+jEXYXZ/Bpnv7BJNJhO3beT2Mr6kA6YsdWxMG3VMiG3UUnkvwPrGCPNsGc8OPQhZuciJahoK5LaBRk1PIStqN21PIe3uu6F6S7OniHn0duXGdFRhrh6mCOzc2ijKvMHBoFL89+zMmB11k3z7e9t1z0fX8Wl5lZtAwVzaICgQhKvszMsYCC6LATtTNSgWnikgNTpzAvrKpjSIQcWFVGsRGwYEUewbpvHPF5K8+qOopUZAoflVEkw4QjSIYc+LRgw6ZmgfB0MY9+RUav7MWfr0HkVpyMNMTRjTTmu18Z6n6d+fF4HoBwf+LD7y8LeDrXmDyMTWFwrKJb8uDhdCgaHCusuasOA54uNL6RTjCbH881binF37CQTN2SBCowhwyPz0XmVwuZ5ZdIh63YitiGGLYhs/wCe0tOpJ/fu4vT2I46kAxakApNIhOj+wzjX3dKVZPw0/wfAAAAAElFTkSuQmCC",db="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABuElEQVR42k2TZ1JCQRCE9wxKBnmYT6USBARPYM56F5VQIHgYc9ZTjPUN1a/48djZ2emenkAYtyJ73i/Yy8Gcn19ni9arZezzdMGe9vL2cTJvj7s5G7WK9nYU2c/Fsr0fl+xhJ2vX67MWupW0gwAQ8HpYtEE974F/V6t+h/i+Hfn9+3zJfbx3q2kL/VrGs5OJj6yjrTkPhpg75ONWMVbFiYphs2BhUM85gRQgbdyO7PdyxbPwBlmnkvKTcoiDwBXcNQuxLNgB9TezbqOAQD4SAVSvXFU7migAjIMSVBsEqCAj9vXajAMh445Smh0rAMhHFvqCrSkAui0nnYBYqWIygVFwQQHyAN1uJGL5EKBk0JhkxcYHERMMnXLSwQBwQkJ38UkRgF417WD8EBHPaAONoE6CcdLpXjXjclGjuoeNvJMTy52+0ewAixRoPOyB+kIgQJZLmygl/RoE26VYAdl5pCxsZYf8ZiPhtvyQdcopC9r76WxsnTYTctRQFidg+WlsYOYQSAVBlCWp2hE2ESUC+8ozRn40GjVHfSFQGWki78RqD9iNMGxM6iF4euum/6GQsLGaFHdsyv8HSmltC4Nie4cAAAAASUVORK5CYII=",ub="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABAUlEQVR42l3TWZICQQgEUO5/SPddZ/QGGknE60A/sIGChMos63k/vv+u+7brcb34ySf+vx36yy6HVefu523XVYLbabMAxFcUkNjjsus8Myh+mRTEFAJJbGJqAmibNCf/epzeBTVBkmmMJTYlPlAgiTOw8hNL8+TBVvKTCxxks4IakCRMMtnqeMBJgANWJpliNRzMZjzNAYXpJCZRps2mnJEYV0W2FOUwqN6GBtLZFEjLiBBfUiok46+UapsDTYCQl6/7zzfCbwAruwLpvIUUWtfdEdocKMA4ELJ6E/NsXqfmfwBhSFM4a2zyRSL2Xcd6AMk48wuJiJsMzwdl2pQ2PnU+npq1EOyYkt8AAAAASUVORK5CYII=",fb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB7ElEQVR42j3TR09QURAF4Ptb6L333n+FCij2LtgL/C9d6UZcCBuCkRiNLExk44IYF5ox35jr4uW9O/fMOWfKKxE/Y62lJZ7MzcXt4eF4Oj8fNwYG8lltbo5LXV2xNTERd0ZG4mpvb1xob4/zbW35vfv6ZZTt5eV4PDsbzxcX42xjY+ysrMTFzs4EnWtqipuDg3GlpyfWW1vzXuzu6GgSEiwSKTxbWMgLjwtEj2ZmUune2Fhc7++P+5OT6RBGHtfFgV2qt4aG8vJaX1+6kvRwejpLREqdG+qICJcKUi+gMzeAm+PjSfZgaiqJOUHivNHRkS4KdYnVemXnQP1ArMMhg9NIZETL5e7utA/kUs2SKFBSp0T9IIRYXPPlZA/Ypg7Itm9ESJRTGylBCaYR8Ss+Hbz/54A9QSDf6n/35lUc7r2NH98+/5+COAcvlpbi+9ePcbi/G8WisKwul+ZP9eT4KOLPaTaYK33hCJ4LCyhejMKSeLhRG/CXD/tZ95mGhiSvo4WB1ezsAXtUsbmU5E3NXpiEsuCc9UNjLZq8glltAqyzzIWyvMW8PaYlTl1POMp/AQF2yeyZr5iEatvZxJTMFeF0oPuSHDxAEs0aCKmua1zdSjFY8WKWdZ0FapeVpPb651G1SEqqi/T79CT+ApA28gZA+69hAAAAAElFTkSuQmCC",pb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAtElEQVR42oWS7Q3CMAxEsxC7MAmTlJZ+vZZCC5saBbVSFPAlkn9EFzm+5wshOVewBiw4pwNr/+mX88lizWAPsOOe1wi2JfpPoxdYLSaYwCahh9j9KR4ANqgG9T6ip/feB4enO9gqGLz3CVwGERJigq2gh7ngkcKavx7VFhawTjHosz3nFYNWKQab90Oir8pC5UU1gdyWGIziQeNBTHNQCQbD3sBlEHO+FBj0JQsqKDGJt0z/ABez/Li/+XLPAAAAAElFTkSuQmCC",mb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABvElEQVR42j2TSU7EQAxF6wapDOdstXpMp+d5TPdtQALEAZBYskCIDVwAIfaG95F74VTKZT9/O5VQVZWtVisbDoc2GAxsvV5rHY1GNp1ObT6fW6/X0/l4PJa/2+1au922yWRigQ0BBANbLpe2WCyuEE8EzMoeKNZsNi3MZjNtUEEiIMhUwMcZMZ1OR9ZqtQTH+v2+BYJQ4BCCUVWWpdbNZqNAwLdJYs9pam9ZJoBaIMArkgSg0WjoHYlAkc/6UxT2XRSCAscXcLgc+mMOJGP0fDgcBKUI76z472K0mySxsN1uFQyVGdAOhiKAVEE+yafTSXOg4EOM9pHnFgiiOiAgPjRWgo/Ho76Mg1ixxxj/W0AOxgZ5/iUA7nY7O5/POr9cLpoFhho/Dz4k790vEmpYSd7v9/I73HNoKUAhmUuDcUCCXxbkk+Sq6roWCCNWLVCNAIKZCUoA+/fHzywAUAQF5KkFqiCFHp3K8PxOUNGH9vk3dXwU8X9FVxkyxnBIZJhUB4YfwGuWCfaUpvZVFPae5yoUkIYKqMB8eEB495/IW7iP0V6yTIVQEXjQCwAkeVUUuAo+JUBa5QoT63/wL8Pic44jF1AkAAAAAElFTkSuQmCC",gb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACJklEQVR42j2TZ3LiUBCE3/1PsBiDkEgCge3dK6wNBoNyFkhkHPYOvdVD+DE1VD36m9AjdUgsJB8ajukIp2yMtdfBym1L3kYmgmkd0ayB0u8hW+qI5xr8SV3y2utBrb0uCCFgG5pIFxr2yVDEhFCYLlp3ULY0sHK7SBc6olkT6kYvnDZWbgebsI9dPEDpdyUoZod8Y7EqMKVy8tG6dMAHBgHxvCntE1AFPckUsTqjCvoCCN8bkjmGSpe6kPxpHTErOQZKr4N9MkDld1E4xnWULj6LJ+R2S8AckaGieVPEud0W6k/1G9/lC77WzzikQ5yyEXJbx9fqWWAEZEsNx2yEQ2pBJYsWSr+PwukgeH/EMbOwi00BrESgC4QAjkUR98RRCZQOGJtwICNQyA44RmHrAjjnY2n/e/0iAMLoFEdRrE5bgumjLOVcPIlwE/SQLy+blu6u7/vEwiEdiaW7eEgbmwKgvwzOxuq7aCAQ9+1BdnTLdOVm/SY0oegnhQSxEqtz+wx2w6q0zXmtCYRVb7bntgHFzbuvNXHB+ftLqvIiOSODF0eIN6lfD0gTCG+CR6bWXhufBb+BNv5Vf+SU5ZzjgSzvZnM4a8iSCaULvItk3oTahD3xm2JmCmnbMbXkNztjZXaa2cb9Y6OFBKlzzq/QkthGfewi894F/8TKFPJevMkDTvlYrM2WLcnq4i0XY6D0OyKi53SCI9Ah960mC75crC5dXPaj4T92a1FHsT/T1wAAAABJRU5ErkJggg==",Ab="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAo0lEQVR42pVSsQoCUQzL/+PocAiCi7c4u4ogDificDroIk5+h4VALLFPEcIjba69vPbhPi4vw1ynyPO2ykmGAVyPC+K068QNWYJpj3PfqqeEcT87bKYltuuJkQA+v1MLEuuIlu8WYHaDh1eedUEWykExKembJf7KilGORaFl6imVI1Ll/1MKWzKq+wnFpn8+HnsvoDmettQcvu/AZnkbWpxJJC8MsTbGXrMUYAAAAABJRU5ErkJggg==",vb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAl0lEQVR42u2STQrCMBCFexJv4KZLD+By8Ag9gWvXc46a39Z4yycDTyhNFlpcFQcej2HC9yYkXbefug0nfKMKMKvAqWBSQVTBQwVeBVkFNhvZm+4qNSAScO4PKCv39ImA1AI8Sc7cwLxQ8yK9cLsKEDi0pLxINA+EBIaMLYDjocQkR73vH7iZp//+FVp1vRxh2vw3/oDPAC9hB9T0l8HLxwAAAABJRU5ErkJggg==",_b="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABJ0lEQVR42l3TWU5DMRBEUe9/qRAg8ywZHaMbRXz42S5XV49vnB6PuT2fp/3rcJifu9382G7n9/G4zrDeD7fbWu4/p9M8P59zIOyv15cxkMDuclki3hLo3Xmz3/8JUERKJEHkPBKzEz7e70sw0eFTuEACyDBeLAJwXOIJLoG8Ae0MnQuzVCx5wxgnPoQE4AFQCnD3UmEsBbslWuLDBzGAYV1IwBvRhJxLZyBYDGtb+eaxVhLAI+7uPAonT8DSqi7uBHErKPFVRIRyd67v1SKv8RogHCLjvYWlgFRnCDCA1d6mF3dUvPIt3OpQStWgtler0bRV3YraHDQ4hV6Ejft4H5LmoTAb8dILqxavSezy/x94T4WICGohbEVQYfLWvxHGCNHqria18xdmWdtSHY2e5AAAAABJRU5ErkJggg==",xb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABoUlEQVR42lXT11IcUQwE0PsVpPXa+0JYYDE5L9EmZ7DB8f//Qq6jsih4uDUzUnerJd1pv89243ytH1Od0VjodeJ253N8O1yLi/XZ+HW6E/fDpXj5shlXm/NxtjoTTwer8bC3nDG59v1oPcEzH8ai3x3PJBDAn/Nh/DzZjuutQZLlTpan4sfXreQo3HyoxAnSzfZCPp+PNxKkMky58P64vxKnK9PJaxKCBJA8Lzfm4m53MUFclBCCdy0SgW/ArLGjf0QkZNZZJqpfWDEHRrwhCVB09F8DU424g6BizYQbzhsVQSDVCZa69sSIik3/35ScY15Nkj0tsKg6EQ5quOJzHyfyDHqdd600QNatkyKSBOGah5g1T06MvG6n3x1LNw1ZC+Xg7SbKUV0aQn8v9jJPzDaaanV5PAUNhyCwbwTkytmMkwJsqoKgjRoimzU81a0V1vtsdzxbyjUiOgBINTxEhLof2oFRbPCpk8W8Nz2zbg6AEqrUSqtncyjbTv0rrarorXqvuRAgXP8B4brysDkDQYFaoa14slu/LWDdSESzIeT7H04PvEDmpaTbAAAAAElFTkSuQmCC",bb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABpElEQVR42k3TWW4bQQwE0L6ErG1GtkeA90W77cSJfawcMbdi8DgikI+GeqqLxeKi9vBwiL5fx/PzW9zf72MyWcZu9xl3d7tYLC7j5eX9fL9K/PX1I6bTPnGnzWarmM8vYzJZRNcN0XXXMZ12ibl7h19cdCkynxd/mXij2PdD7Pe/0oXgw+F33N5uUwDum8vt9ufZ5SKzc982mx+pSMgdkeWnp1PiiMUhhMfNzc0mBZssrC2XVxnssKdOQX5hSpnN+gzmEl9cYxVBJuqIMh2PX4k/Ph7zrZwp0/10+s57U9Nqtc4gp2wLrH6wKjMBdWukspTRjIri2PUh7Tt//3wmxqY7Z3BcZXsj1GQSWJ03EVnYK2e+9aKaKLDKaf+PS93EalwyOwJxBBCrcnBadbsWx/fY+SE3sZaJfVNwJKlla6P6kNbGpVpnFuoIGsUlEbgGE+EyS7DfsngEUvaLqIFwAnBcgkqQLEvQKIAMLNc0auctjGBveKP9/vzfuY5mIQSzUwtjxjIjwznSAxnH0lbZcOW3Ggti/ZkIuMtSQbV9xDgjYBL/AKWRdCNhqY20AAAAAElFTkSuQmCC",yb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABkElEQVR42jXTV3IDQQgE0D2vrCxZOeds3RjXo4oPanYYumnCNrPZLHa7XUyn0/j9/Y3H4xHP5zO+32+sVqs4nU5xu91is9mk/+fnJ3q9XiyXy3xvjsdjBiFh+/0++C6XS9zv9zw/n0+Ct9ttAjudTiwWi2i329FQMB6P43A4xHq9TsD1es1APqDz+ZwqJKjMSHw3JRMYEYK/v794vV7xfr8TjEhp7kDD4TDLQNIAkUy6h/l8noQkehuNRtHv92MymSSYXyw14pqqSxNlclZfGMIqkwEjqaQNJuyyIysFzlIFoFRN4/dtKrCN7NgGg0E+IhPAB6g37kw5kvAhyCZWx7FxkousxunUWFPQWOrcS0XjonYXJqsgRKyym4DsRVb3LMGSAAkkj4KSD8CM0UJJRhmSbKISmEstiT4AI5UJGQCfrLUfucpkdrvdnDUzRgDftfP+kdpUo4SpuCyhnIgE164boUwUivFWi1RnU7V6RNBqtbIERgFizS3JlNRk+PJfKEklC5Hsmln9QQJEiZEjYv/MknbK6xSXvQAAAABJRU5ErkJggg==",Mb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA5ElEQVR42oVSSQoCQQzsb6l4UfAF7ruoeNG7L1Dx4rjvv/AF7rtPipQwjUqSKejLVKaSqsSYL4xPKVo9i2QYzK5ZcrZRlrPo72K0fBQ+Rc1N5Kd4eEgQeFUA3ee3HP3/DOA7plAFRsekaGFyTtNgH9cFKm0/4XFcwwlTrRvUBRCim4EL1w4mAK8KTC8Z1idEFve8twCSlnxiA+oW0AXdpRBxA55rrHYChLA4rt4LiZwFxkdYUj543I1YrF8l0QJCxJ2oE6A7CqUQcY2qAEKULOA+sCVVoNzyqZfoGSI8IgcpRI57Aw/Htn+kY38BAAAAAElFTkSuQmCC",Eb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAQUlEQVR42mNgGAWDHPyfJPX/f4PQf/INuGbz//8RAwoM+Lbv//8XTeQbkOar89/TVI58A7oybP4ne2gOoAEjxAsAleMswpFhqRMAAAAASUVORK5CYII=",Sb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACBElEQVR42q2SW08aURSF/Tl9aowGKcWaxgflOjPMDBfRtkhiakhbbWsjl6HIcGe09omogFRA7tDaP7iavY1D+2wf1uxz1ln72yczsxBef4LHaIEeN7qIH1kBl8lNXCQ20Drx4iKxiauUA528jLrmZO+hUrZ1IswBl0kHi0xqan714DrjwVXKibrmMitBG2kXQ2iYCXgfsmBPeorDbRs+bFlxEH6Gd0EL3sqLiKlLiPmXcBC2Yl9ZvPf8y9xjAkYVBR3dg35RYo2rKnu1Wo1F3uwsiG7Oi+SuDRPDz54JuM0LDCBRcFxR0cm60dU9GJUVDEo+tLNuTI0A4hErhiUfZ03A9DTAEApS7RVE9Asipoaf13QjOuvlBaSizzEsy+yZgEd/xmFJwqSq4OdZAKOyD+OKD7NTFTNDxe/vW7g7D2JQFHF3HuKcvr+GqaHMAWT2CwIDqHFSlU0gwX99CzJ0VJa4ZvZW+Xz+DgyVG2nCoCjwNFK/4P0HRpVumIu9xLgizwGJ6Co+76wgvmvHYWgZX17beB2P2PFpewVHr6xIRF/gOHLvfQxbeG8CunkJrYwbDc2JTl5CM+1idXIibrJe9EsKbgs+3tc1B5JRO64z7jmAmijU1kUOUW2mnWhoDq5tXWAQDSEdv7HxmQn4O/wQaudE9qiRAARmXxdxtGNBryj/n//gD7hEMxHp4e3zAAAAAElFTkSuQmCC",wb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAP0lEQVR42mNgGAVYgcaJLf9B+EOFzX8YG4SJ1oyukSRDsGlCNpAsA5ANISkMSHY+OnCb1vMfhMmOjVED6GQAALcOgI9WvP2/AAAAAElFTkSuQmCC",Tb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC10lEQVR42j2S11IiYRCF52EWHGbIEgQMCK63KgxhAMkmQEB9qfMkuiaigCQluIjIurrhfutvq/aiq6em6nx9/u7DfT39gPN4jo2Td7gKb7Ckp3AVf0O3O4AY6kMllWBN9rB6NIZjf4DVzBQauQV9pANz4hGcLtLD5tkvKDxVWNJjCHIP+ugQqmAXi4knAii2r7ByOIIt/UCA9eNXGHa7WMu+gFN6azAlhjAnRxCDLdiP5tg4/Yu1/AeWDmZYz00g+MrQhe7IgSs/hxhoQB1sQuW/A6cJdSAEmnAXf9ITjPExzKkJ3Cd/sJx9o6nKnWu4889YSvXJujM3g21vDKW3As5d+AFLckA/VL46TNEGbKkOrIl7fNk6hznRgzHaxoK3DEuyj7XsBAueWxgiLSqOl2pQeCpE3ii+wRJvkXAp2aZvXipD8FexGOtAsfMpVO7cQPBVoA83wVlTQ9qmff+JrDkzQ2gCJYIseL7BFO9io/hKnQF4bwkqqQxzvIv14yk4Znsx1qftMje85xI6uQJBuoZjv/8pksrkwJp6oKkM4sw9U+e0kR5MyTFchXeIwTbMsTsYwhUqfucCmmCNiuVAHahCHajBuHsP0V+lXXBKqYGl/We4ix/URekKq4d9mKJ1LO916Qr6cIPELBPMgW1vQLsgwObZH+ijj+B9Taxk59DJJSxsnxPAGKnCmf1OWdDKdcoBEzHI/ysYYgMSs2IwNl3wXhJAG7wl+yyFlsSnG2afQXShxucOnLkJ7JTxJ7r3WpZFdQbeV4MYbJA7694ExvgQ7LmCdANdqAZ9uA7RXwLHaOyu7DSOgyHchTlc+VesHE2g8texmBhBE+piOfNK3RRrEsCZGUGxdQGOTWWbZQD2zaazyZbUgEDsOraDKdRyB/bDF6wcPMKe7kHlvQbvuQJn2L2nVC0fjqALNwmglpvkwJoekpjtiZXjaEZPsCbbMETq0MpV/AMIQhUoMjIUHAAAAABJRU5ErkJggg==",Cb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAPUlEQVR42mNgGL7g2TGv/yTJIwuA2DBMlDzJGujigpPLrPAaiCyPVeDRfpf/pMhjKCCVP2oALQwgFI0wPgBztLmlXb3LWwAAAABJRU5ErkJggg==",Rb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAI0lEQVR42mNgGAWjYNCD+A02/ynSUHHS7T9JhqML4uMPIwMAILQuBffpg0gAAAAASUVORK5CYII=",Db="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABYUlEQVR42k3SRw5DMQgEUN//iuk9P72uHT2kif7CAsMwDNjteDz2x+PRz+dzv1wu/X6/1/l+v/3z+fTdbtdh5K7Xa9ntdls1bDscDv/CYRiqyJ0vB8QuFouKIUYkxrZxsQAA//V69efz+S90brdbHTh5JA2IfJKcJMSRLZfLHpWbzaYUwkRtMx9GswLzESoCok5XeXa1WhURDL92kC5ZVhYXciSn06m/3++6i6/X64o3LAKKFPN12O/3Nb8Cd3kF8Ky8kVsWCCCoYD6fFxmZ7qTbieNVxCiAbxzFEtiBSUWc7plXTNfxf2jmzycyZ2xeAmi8aA0Qacxv5JKiKHIVI0UgFzWZPWPUK2DKZu1CYb6x90Y8XpoG2U2NkL8fqVgnk0lZMQ0cRfmRWWApINNsErpJGkEy6nQWg/O00+m08vUKtqyTJAKAqJBzxsSWDu8gahygbF3QKOKz2axsCDIiP7kfk3S5iRcXcFYAAAAASUVORK5CYII=",Rt=16,Lb=Object.assign({"../../../../textures/ancient_debris.png":dx,"../../../../textures/bed.png":ux,"../../../../textures/bedrock.png":fx,"../../../../textures/bookshelf.png":px,"../../../../textures/brewing_stand.png":mx,"../../../../textures/cactus.png":gx,"../../../../textures/carrot_ripe.png":Ax,"../../../../textures/carrot_young.png":vx,"../../../../textures/carved_pumpkin.png":_x,"../../../../textures/chest_side.png":xx,"../../../../textures/chest_top.png":bx,"../../../../textures/coal_ore.png":yx,"../../../../textures/cobblestone.png":Mx,"../../../../textures/crafting_table_side.png":Ex,"../../../../textures/crafting_table_top.png":Sx,"../../../../textures/diamond_block.png":wx,"../../../../textures/diamond_ore.png":Tx,"../../../../textures/dirt.png":Cx,"../../../../textures/door_bottom.png":Rx,"../../../../textures/door_top.png":Dx,"../../../../textures/dragon_egg.png":Lx,"../../../../textures/dried_ghast.png":Ix,"../../../../textures/emerald_block.png":Px,"../../../../textures/emerald_ore.png":Ux,"../../../../textures/enchanting_table.png":Nx,"../../../../textures/end_stone.png":Fx,"../../../../textures/farmland.png":Bx,"../../../../textures/flower.png":kx,"../../../../textures/furnace.png":Ox,"../../../../textures/glass.png":zx,"../../../../textures/glowstone.png":Vx,"../../../../textures/gold_block.png":Gx,"../../../../textures/gold_ore.png":Hx,"../../../../textures/grass_side.png":Wx,"../../../../textures/grass_top.png":Xx,"../../../../textures/gravel.png":Yx,"../../../../textures/hay_bale.png":qx,"../../../../textures/ice.png":Kx,"../../../../textures/iron_block.png":Qx,"../../../../textures/iron_ore.png":jx,"../../../../textures/jack_o_lantern.png":Jx,"../../../../textures/lapis_ore.png":Zx,"../../../../textures/lava.png":$x,"../../../../textures/leaves.png":eb,"../../../../textures/log_side.png":tb,"../../../../textures/log_top.png":nb,"../../../../textures/melon.png":ib,"../../../../textures/missing.png":sb,"../../../../textures/nether_bricks.png":rb,"../../../../textures/nether_wart.png":ob,"../../../../textures/netherite_block.png":ab,"../../../../textures/netherrack.png":lb,"../../../../textures/obsidian.png":cb,"../../../../textures/planks.png":hb,"../../../../textures/pumpkin.png":db,"../../../../textures/quartz_block.png":ub,"../../../../textures/quartz_ore.png":fb,"../../../../textures/rail.png":pb,"../../../../textures/redstone_ore.png":mb,"../../../../textures/sand.png":gb,"../../../../textures/sandstone.png":Ab,"../../../../textures/sign.png":vb,"../../../../textures/snow.png":_b,"../../../../textures/soul_sand.png":xb,"../../../../textures/spawner.png":bb,"../../../../textures/stone.png":yb,"../../../../textures/sugar_cane.png":Mb,"../../../../textures/torch.png":Eb,"../../../../textures/trapdoor.png":Sb,"../../../../textures/warped_fungus.png":wb,"../../../../textures/water.png":Tb,"../../../../textures/wheat_ripe.png":Cb,"../../../../textures/wheat_young.png":Rb,"../../../../textures/wool.png":Db});function Ib(s){return s.slice(s.lastIndexOf("/")+1).replace(/\.png$/,"")}function Pb(s){return new Promise((e,t)=>{const n=new Image;n.onload=()=>e(n),n.onerror=()=>t(new Error(`그림을 못 읽었어요: ${s}`)),n.src=s})}function Ub(){const s=new ImageData(Rt,Rt);for(let e=0;e<Rt;e++)for(let t=0;t<Rt;t++){const n=(e*Rt+t)*4,i=(t>>3)+(e>>3)&1;s.data[n]=i?0:248,s.data[n+1]=0,s.data[n+2]=i?0:248,s.data[n+3]=255}return s}async function Nb(){const s=document.createElement("canvas");s.width=Rt,s.height=Rt;const e=s.getContext("2d",{willReadFrequently:!0});if(!e)throw new Error("2D 캔버스를 만들 수 없어요");e.imageSmoothingEnabled=!1;const t=Object.entries(Lb).map(([l,d])=>({name:Ib(l),url:d})).filter(l=>l.name!=="missing").sort((l,d)=>l.name.localeCompare(d.name)),n=new Map;n.set("missing",Ub());const i=await Promise.all(t.map(async l=>{try{const d=await Pb(l.url);return(d.width!==Rt||d.height!==Rt)&&console.warn(`textures/${l.name}.png 는 ${d.width}×${d.height} 예요. 16×16 으로 줄여서 써요.`),e.clearRect(0,0,Rt,Rt),e.drawImage(d,0,0,Rt,Rt),{name:l.name,data:e.getImageData(0,0,Rt,Rt)}}catch(d){return console.warn(d),null}}));for(const l of i)l&&n.set(l.name,l.data);const r=["missing",...[...n.keys()].filter(l=>l!=="missing")],o=r.length,a=new Uint8Array(Rt*Rt*4*o),c=new Map,h=Rt*4;r.forEach((l,d)=>{c.set(l,d);const f=n.get(l).data,A=d*Rt*h;for(let g=0;g<Rt;g++)a.set(f.subarray(g*h,(g+1)*h),A+(Rt-1-g)*h)});const u=new Rl(a,Rt,Rt,o);return u.format=Cn,u.type=Vn,u.magFilter=nn,u.minFilter=Ks,u.generateMipmaps=!0,u.wrapS=nr,u.wrapT=nr,u.colorSpace=Zn,u.needsUpdate=!0,{texture:u,index:c,images:n}}const kh={helmet:"투구",chestplate:"흉갑",leggings:"레깅스",boots:"부츠",shield:"방패"},Oh=[["inventory","🎒 가방에서 (2×2) — 언제나"],["crafting_table","🔨 제작대 옆에서 (3×3)"],["forge","⚒️ 대장간 옆에서"],["furnace","🔥 화로 옆에서"],["world","🌍 놓아서 생기는 것 (만들기 아님)"]];class Fb{constructor(e,t){this.deps=t,this.el=document.createElement("div"),this.el.className="bag-panel",this.el.hidden=!0,this.el.innerHTML=`
      <div class="bag-card">
        <div class="bag-head">
          <div class="bag-tabs"></div>
          <button class="plain-btn bag-close" aria-label="닫기">✕</button>
        </div>
        <div class="bag-body">
          <div class="bag-grid"></div>
          <div class="bag-side"></div>
        </div>
      </div>`,e.appendChild(this.el),this.grid=this.el.querySelector(".bag-grid"),this.side=this.el.querySelector(".bag-side"),this.tabs=this.el.querySelector(".bag-tabs"),this.el.querySelector(".bag-close").addEventListener("click",()=>t.onClose()),this.el.addEventListener("click",n=>{n.target===this.el&&t.onClose()});for(let n=0;n<Js;n++){const i=document.createElement("button");i.className="bag-cell"+(n<fo?" hot":""),i.dataset.slot=String(n),i.addEventListener("click",()=>this.tapCell(n)),this.cells.push(i)}this.renderTabs(),this.renderGrid(),this.renderSide()}deps;el;inv=new Array(Js).fill(null);stations={};tab="bag";drawnTab=null;selected=-1;half=!1;confirmDrop=!1;bottles=[];ingredient=-1;bookOpen=null;craftCells=new Array(9).fill(null);craftGhost=new Array(9).fill(null);craftWidth=0;grid;side;tabs;cells=[];get visible(){return!this.el.hidden}show(e="bag"){this.tab=e,this.selected=-1,this.confirmDrop=!1,this.drawnTab=null,this.clearCraftGrid(),this.el.hidden=!1,this.renderAll()}hide(){this.el.hidden=!0,this.clearCraftGrid()}setInventory(e){this.inv=e,this.clampCraftGrid(),this.visible&&this.renderAll()}craftW(){return this.stations.crafting_table||this.stations.forge?3:2}clearCraftGrid(){this.craftCells.fill(null),this.craftGhost.fill(null)}craftAvailable(e){let t=0;for(const n of this.inv)n&&n.item===e&&(t+=n.count);for(const n of this.craftCells)n&&n.item===e&&(t-=n.count);return t}clampCraftGrid(){const e={};for(const t of this.inv)t&&(e[t.item]=(e[t.item]??0)+t.count);for(let t=0;t<this.craftCells.length;t++){const n=this.craftCells[t];if(!n)continue;const i=e[n.item]??0,r=Math.min(n.count,i);e[n.item]=i-r,this.craftCells[t]=r>0?{item:n.item,count:r}:null}}fillCraftGrid(e){const t=this.craftW(),n=Ql(e,t);if(this.clearCraftGrid(),!!n)for(let i=0;i<n.length;i++){const r=n[i];r&&(this.craftAvailable(r)>0?this.craftCells[i]={item:r,count:1}:this.craftGhost[i]=r)}}tapCraftCell(e){const t=this.selected>=0?this.inv[this.selected]:null,n=this.craftCells[e];t&&(!n||n.item===t.item)?this.craftAvailable(t.item)>0&&(this.craftCells[e]={item:t.item,count:(n?.count??0)+1},this.craftGhost[e]=null):n?this.craftCells[e]=null:this.craftGhost[e]&&this.craftAvailable(this.craftGhost[e])>0&&(this.craftCells[e]={item:this.craftGhost[e],count:1},this.craftGhost[e]=null),this.renderGrid(),this.renderSide()}craftMatch(e){const t=this.craftW();return xu(e,this.craftCells.slice(0,t*t),t)}refresh(){this.visible&&this.renderAll()}setStations(e){const t=JSON.stringify(e)!==JSON.stringify(this.stations);this.stations=e,this.tab==="brew"&&!e.brewing_stand&&(this.tab="bag"),t&&this.visible&&this.renderAll()}renderAll(){this.renderTabs(),this.renderGrid(),this.renderSide()}renderTabs(){const e=[["bag","🎒 가방"],["craft","🔨 만들기"]];this.stations.brewing_stand&&e.push(["brew","⚗️ 양조"]),e.push(["book","📜 조합법"]),e.push(["codex","📖 도감"]),this.tabs.innerHTML="";for(const[t,n]of e){const i=document.createElement("button");i.className="bag-tab"+(this.tab===t?" on":""),i.textContent=n,i.addEventListener("click",()=>{this.tab=t,this.selected=-1,this.renderAll()}),this.tabs.appendChild(i)}}renderGrid(){this.grid.innerHTML="";const e=document.createElement("div");e.className="bag-row hotrow";const t=document.createElement("div");t.className="bag-row bagrow";for(let i=0;i<Js;i++){const r=this.cells[i],o=this.inv[i];if(r.innerHTML="",r.classList.toggle("selected",i===this.selected),r.classList.toggle("bottle",this.tab==="brew"&&this.bottles.includes(i)),r.classList.toggle("ingredient",this.tab==="brew"&&this.ingredient===i),r.title=o?`${this.deps.nameOf(o.item)} ×${o.count}`:"",o){const a=this.deps.icon(o.item,36);if(a&&r.appendChild(a),o.count>1){const c=document.createElement("span");c.className="bag-count",c.textContent=String(o.count),r.appendChild(c)}}(i<fo?e:t).appendChild(r)}const n=document.createElement("div");n.className="bag-label",n.textContent="아래 10칸이 게임 화면의 핫바예요",this.grid.append(t,n,e)}tapCell(e){const t=this.inv[e];if(this.tab==="brew"){if(!t)return;if(nd(t.item)){const n=this.bottles.indexOf(e);n>=0?this.bottles.splice(n,1):this.bottles.length<this.deps.potions.stand.bottles&&this.bottles.push(e)}else this.ingredient=this.ingredient===e?-1:e;this.renderGrid(),this.renderSide();return}if(this.confirmDrop=!1,this.tab==="craft"){this.selected=this.selected===e?-1:t?e:this.selected,this.renderGrid(),this.renderSide();return}if(this.selected<0)t&&(this.selected=e);else if(this.selected===e)this.selected=-1;else{const n=this.inv[this.selected];if(n){const i=this.half?Math.max(1,Math.floor(n.count/2)):n.count;this.deps.onMove(this.selected,e,i)}this.selected=-1}this.renderGrid(),this.renderSide()}renderSide(){const e=this.el.querySelector(".bag-card"),t=this.drawnTab===this.tab,n=t?e?.scrollTop??0:0,i=t?this.side.querySelector(".craft-list, .codex-grid, .book-list")?.scrollTop??0:0;this.side.innerHTML="",this.grid.hidden=this.tab==="codex"||this.tab==="book",this.tab==="bag"?this.renderBagSide():this.tab==="craft"?this.renderCraftSide():this.tab==="book"?this.renderBook():this.tab==="codex"?this.renderCodex():this.renderBrewSide(),this.drawnTab=this.tab;const r=this.side.querySelector(".craft-list, .codex-grid, .book-list");r&&i>0&&(r.scrollTop=i),e&&n>0&&(e.scrollTop=n)}stationNear(e){return e==="inventory"||e==="crafting_table"&&!!this.stations.crafting_table||e==="forge"&&!!this.stations.forge||e==="furnace"&&!!this.stations.furnace}patternThumb(e){const t=e.station==="inventory"?2:3,n=Ql(e,t);if(!n)return null;const i=document.createElement("div");i.className="pattern-thumb",i.style.gridTemplateColumns=`repeat(${t}, 18px)`;for(const r of n){const o=document.createElement("span");if(r){const a=this.deps.icon(r,16);a&&o.appendChild(a),o.title=this.deps.nameOf(r)}i.appendChild(o)}return i}renderBook(){const e=this.deps.recipes.craftable().concat(this.deps.recipes.forStation("world")),t=document.createElement("div");t.className="bag-title",t.textContent=`📜 조합법 ${e.length}개`,this.side.appendChild(t);const n=document.createElement("div");n.className="bag-tip",n.textContent="초록 줄은 지금 만들 수 있는 것. 작업대 옆에서 줄을 탭하면 🔨 격자에 모양대로 채워져요",this.side.appendChild(n);const i=document.createElement("div");i.className="book-list";const r=c=>sd(Object.keys(c.out)[0]);if(this.bookOpen===null){this.bookOpen=new Set;for(const[c]of Oh)this.stationNear(c)&&this.bookOpen.add(c)}const o=this.bookOpen,a=(c,h,u)=>{if(u.length===0)return;const l=document.createElement("button");l.className="book-head"+(o.has(c)?" open":"");const d=u.filter(f=>f.station!=="world"&&this.stationNear(f.station)&&Ps(this.inv,f)).length;if(l.innerHTML=`<span class="book-caret">${o.has(c)?"▾":"▸"}</span> ${h} · ${u.length}${d?` <span class="book-now">지금 ${d}</span>`:""}`,l.addEventListener("click",()=>{o.has(c)?o.delete(c):o.add(c),this.renderSide()}),i.appendChild(l),o.has(c))for(const f of u)i.appendChild(this.bookRow(f))};for(const[c,h]of Oh)a(c,h,e.filter(u=>u.station===c&&!r(u))),c==="crafting_table"&&a("egg","🥚 드래곤 알 (제작대 옆에서)",e.filter(r));this.side.appendChild(i)}bookRow(e){const t=this.stationNear(e.station),n=e.station!=="world"&&t&&Ps(this.inv,e),i=document.createElement("div");i.className="craft-row book-row"+(n?" ok":t||e.station==="world"?"":" far");const r=Object.keys(e.out)[0],o=this.deps.icon(r,32);o&&i.appendChild(o);const a=document.createElement("div");a.className="craft-text";const c=e.out[r],h=Object.entries(e.in).map(([l,d])=>`${this.deps.nameOf(l)} ${d}`).join(" + ");a.innerHTML=`<b>${e.name}${c>1?` ×${c}`:""}</b><br><span class="craft-need">${h}</span>`,i.appendChild(a);const u=this.patternThumb(e);if(u&&i.appendChild(u),e.station!=="world")if(t)i.title="탭하면 🔨 격자에 모양대로 채워요",i.addEventListener("click",l=>{l.target.closest("button")||(this.tab="craft",this.selected=-1,this.fillCraftGrid(e),this.renderAll())}),n&&i.appendChild(this.button("만들기","big-btn small",()=>{this.deps.onCraft(e.id),this.tab="craft",this.selected=-1,this.fillCraftGrid(e),this.renderAll()}));else{const l=document.createElement("span");l.className="craft-station",l.textContent=`${this.deps.nameOf(e.station)} 옆에서`,i.appendChild(l)}return i}renderCodex(){const e=this.deps.owned(),t=document.createElement("div");t.className="bag-title",t.textContent=`드래곤 도감 ${[...e].length}/${this.deps.dragons.count}`,this.side.appendChild(t);const n=document.createElement("div");n.className="codex-grid";for(const c of this.deps.dragons.list){const h=document.createElement("div"),u=e.has(c.id);h.className="codex-cell"+(u?" on":"");const l=document.createElement("span");l.className="nest-chip",l.style.background=u?c.color:"#444";const d=document.createElement("span");d.className="codex-name",d.textContent=`${c.tier}. ${c.name}`;const f=document.createElement("span");f.className="codex-sub",f.textContent=u?"얻었어요!":c.recipe.map(A=>`${this.deps.nameOf(A.material)} ${A.count}`).join(" · "),h.append(l,d,f),n.appendChild(h)}this.side.appendChild(n);const i=this.deps.codexBlocks(),r=this.deps.codexCandidates(),o=document.createElement("div");o.className="bag-title",o.textContent=`블록 도감 ${i.size}/${r.length} (마을 공용 · 10종마다 마을 레벨 +1)`,this.side.appendChild(o);const a=document.createElement("div");a.className="codex-blocks";for(const[c,h]of r){const u=i.has(c),l=document.createElement("div");l.className="codex-block"+(u?" on":"");const d=this.deps.icon(c,24);d&&l.appendChild(d);const f=document.createElement("span");f.textContent=u?h:"???",l.appendChild(f),a.appendChild(l)}this.side.appendChild(a)}button(e,t,n,i=!1){const r=document.createElement("button");return r.className=t,r.textContent=e,r.disabled=i,r.addEventListener("click",n),r}renderBagSide(){const e=this.selected>=0?this.inv[this.selected]:null,t=document.createElement("div");t.className="bag-info",t.textContent=e?`${this.deps.nameOf(e.item)} ×${e.count}`:"칸을 탭해서 고르고, 다른 칸을 탭하면 옮겨요",this.side.appendChild(t);const n=this.button(this.half?"반만 옮기기: 켜짐":"반만 옮기기: 꺼짐","plain-btn"+(this.half?" on":""),()=>{this.half=!this.half,this.renderSide()});if(this.side.appendChild(n),e){const u=this.button(this.confirmDrop?"정말 버릴까요? (사라져요)":"버리기","plain-btn danger",()=>{if(!this.confirmDrop){this.confirmDrop=!0,this.renderSide();return}this.deps.onDrop(this.selected,e.count),this.selected=-1,this.confirmDrop=!1,this.renderGrid(),this.renderSide()});this.side.appendChild(u);const l=this.deps.equipSlotOf(e.item);if(l){const d=this.button(l==="shield"?"🛡️ 방패 들기":`🛡️ 입기 (${kh[l]})`,"big-btn small",()=>{this.deps.onEquip(this.selected),this.selected=-1,this.renderGrid(),this.renderSide()});this.side.appendChild(d)}}const i=this.deps.equipment(),r=document.createElement("div");r.className="equip-box";const o=document.createElement("div");o.className="bag-title";const a=this.deps.armorDefense();o.textContent=`🛡️ 장비${a>0?` · 방어 ${a}`:""}`,r.appendChild(o);for(const u of["helmet","chestplate","leggings","boots","shield"]){const l=document.createElement("div");l.className="equip-row";const d=document.createElement("span");d.className="equip-label",d.textContent=kh[u]??u,l.appendChild(d);const f=i[u]??null;if(f){const g=this.deps.icon(f,24);g&&l.appendChild(g)}const A=document.createElement("span");A.className="equip-name"+(f?"":" none"),A.textContent=f?this.deps.nameOf(f):"비었어요",l.appendChild(A),f&&l.appendChild(this.button("벗기","plain-btn",()=>this.deps.onUnequip(u))),r.appendChild(l)}this.side.appendChild(r);const c=["crafting_table","furnace","brewing_stand","forge"].filter(u=>this.stations[u]),h=document.createElement("div");h.className="bag-tip",h.textContent=c.length?`가까이에: ${c.map(u=>this.deps.nameOf(u)).join(", ")}`:"제작대·화로·양조기 가까이 가면 더 만들 수 있어요",this.side.appendChild(h)}renderCraftSide(){const e=["inventory"];this.stations.crafting_table&&e.push("crafting_table"),this.stations.furnace&&e.push("furnace"),this.stations.forge&&e.push("forge");const t=e.flatMap(i=>this.deps.recipes.forStation(i));this.renderCraftGrid(t);const n=document.createElement("div");n.className="craft-list",t.sort((i,r)=>Number(Ps(this.inv,r))-Number(Ps(this.inv,i)));for(const i of t){const r=Ps(this.inv,i),o=document.createElement("div");o.className="craft-row"+(r?"":" no"),o.title="탭하면 격자에 모양대로 채워요",o.addEventListener("click",A=>{A.target.closest("button")||(this.fillCraftGrid(i),this.renderGrid(),this.renderSide())});const a=Object.keys(i.out)[0],c=this.deps.icon(a,32);c&&o.appendChild(c);const h=document.createElement("div");h.className="craft-text";const u=i.out[a],l=Object.entries(i.in).map(([A,g])=>{const p=this.inv.reduce((m,M)=>M&&M.item===A?m+M.count:m,0);return`${this.deps.nameOf(A)} ${Math.min(p,g)}/${g}`}).join(" · "),d=(r||Object.keys(bu(this.inv,i.in)).length,"");h.innerHTML=`<b>${i.name}${u>1?` ×${u}`:""}</b>${i.station!=="inventory"?` <span class="craft-station">${this.deps.nameOf(i.station)}</span>`:""}<br><span class="craft-need">${l}${d}</span>`,o.appendChild(h);const f=yu(this.inv,i);o.appendChild(this.button(r?`만들기${f>1?` (${f}번 가능)`:""}`:"재료 부족","big-btn small",()=>this.deps.onCraft(i.id),!r)),n.appendChild(o)}t.length===0&&(n.textContent="만들 수 있는 것이 없어요"),this.side.appendChild(n)}renderCraftGrid(e){const t=this.craftW();t!==this.craftWidth&&(this.craftWidth=t,this.clearCraftGrid());const n=document.createElement("div");n.className="craft-area";const i=document.createElement("div");i.className="craft-grid",i.style.gridTemplateColumns=`repeat(${t}, 42px)`;for(let u=0;u<t*t;u++){const l=document.createElement("button"),d=this.craftCells[u],f=d?null:this.craftGhost[u];l.className="bag-cell craft-cell"+(f?" ghost":""),l.title=d?`${this.deps.nameOf(d.item)} ×${d.count}`:f?`${this.deps.nameOf(f)} (가방에 없어요)`:"";const A=d?.item??f;if(A){const g=this.deps.icon(A,36);if(g&&l.appendChild(g),d&&d.count>1){const p=document.createElement("span");p.className="bag-count",p.textContent=String(d.count),l.appendChild(p)}}l.addEventListener("click",()=>this.tapCraftCell(u)),i.appendChild(l)}n.appendChild(i);const r=document.createElement("div");r.className="craft-arrow",r.textContent="➜",n.appendChild(r);const o=this.craftMatch(e),a=document.createElement("button");if(a.className="bag-cell craft-result"+(o?" ok":""),o){const u=Object.keys(o.out)[0],l=this.deps.icon(u,36);l&&a.appendChild(l);const d=o.out[u];if(d>1){const f=document.createElement("span");f.className="bag-count",f.textContent=String(d),a.appendChild(f)}a.title=`${o.name} 만들기`,a.addEventListener("click",()=>{this.deps.onCraft(o.id);for(let f=0;f<this.craftCells.length;f++){const A=this.craftCells[f];A&&(this.craftCells[f]=A.count>1?{item:A.item,count:A.count-1}:null)}this.renderGrid(),this.renderSide()})}else a.disabled=!0,a.title="격자에 재료를 모양대로 놓으면 여기에 결과가 나와요";n.appendChild(a);const c=document.createElement("div");c.className="craft-result-name",c.textContent=o?`${o.name} — 탭해서 만들기`:this.craftCells.some(Boolean)?"이 모양으로는 아무것도 안 돼요":t===3?"제작대 3×3":"가방 2×2 (제작대 옆에서는 3×3)",n.appendChild(c),(this.craftCells.some(Boolean)||this.craftGhost.some(Boolean))&&n.appendChild(this.button("비우기","plain-btn craft-clear",()=>{this.clearCraftGrid(),this.renderGrid(),this.renderSide()})),this.side.appendChild(n);const h=document.createElement("div");h.className="bag-tip",h.textContent=this.selected>=0&&this.inv[this.selected]?`${this.deps.nameOf(this.inv[this.selected].item)} 을(를) 골랐어요 — 격자 칸을 탭하면 하나씩 놓여요`:"가방 칸을 탭해 고르고 격자에 놓거나, 아래 조합법을 탭하면 모양대로 채워져요",this.side.appendChild(h)}renderBrewSide(){const e=document.createElement("div");e.className="brew-box";const t=this.deps.potions.stand,n=document.createElement("div");n.className="bag-info",n.textContent=`병 ${this.bottles.length}/${t.bottles} · 재료 ${this.ingredient>=0?this.deps.nameOf(this.inv[this.ingredient].item):"없음"}`,e.appendChild(n);const i=document.createElement("div");i.className="bag-tip",i.textContent=`가방에서 물병·물약을 탭하면 병 칸(최대 ${t.bottles}개), 다른 것을 탭하면 재료. 연료: ${this.deps.nameOf(t.fuel)} 1개 = ${t.brewsPerFuel}번`,e.appendChild(i);const r=this.ingredient>=0?this.inv[this.ingredient]:null,o=document.createElement("ul");o.className="brew-preview";let a=!1;for(const c of this.bottles){const h=this.inv[c];if(!h)continue;const u=id(h.item),l=r?this.deps.potions.brew(u,r.item):null,d=document.createElement("li");d.textContent=`${this.deps.potions.displayName(u)} → ${l?this.deps.potions.displayName(l):r?"(아무 일 없음)":"?"}`,l&&(a=!0),o.appendChild(d)}e.appendChild(o),e.appendChild(this.button("양조하기","big-btn small",()=>this.deps.onBrew([...this.bottles],this.ingredient),!(a&&r&&this.bottles.length>0))),this.side.appendChild(e)}clearBrewSelection(){this.bottles=[],this.ingredient=-1,this.visible&&this.renderAll()}}class Bb{constructor(e,t,n,i){this.onSend=n,this.onClose=i,this.sheet=document.createElement("div"),this.sheet.className="chat-panel",this.sheet.hidden=!0;const r=document.createElement("div");r.className="chat-card";const o=document.createElement("div");o.className="chat-emojis",t.emojis.forEach((h,u)=>{const l=document.createElement("button");l.className="chat-emoji",l.textContent=h,l.addEventListener("click",()=>this.send(rd,u)),o.appendChild(l)});const a=document.createElement("div");a.className="chat-phrases";for(const h of t.phrases){const u=document.createElement("button");u.className="chat-phrase",u.textContent=h.text,u.addEventListener("click",()=>this.send(Mu,h.id)),a.appendChild(u)}const c=document.createElement("button");c.className="plain-btn chat-close",c.textContent="닫기",c.addEventListener("click",()=>i()),r.append(o,a,c),this.sheet.appendChild(r),this.sheet.addEventListener("click",h=>{h.target===this.sheet&&i()}),e.appendChild(this.sheet),this.log=document.createElement("div"),this.log.className="chat-log",this.log.hidden=!0,e.appendChild(this.log)}onSend;onClose;sheet;log;lines=[];hideTimer=null;send(e,t){this.onSend(e,t),this.onClose()}get visible(){return!this.sheet.hidden}show(){this.sheet.hidden=!1}hide(){this.sheet.hidden=!0}add(e,t){this.lines.push(`${e}: ${t}`),this.lines.length>5&&this.lines.shift(),this.log.innerHTML="";for(const n of this.lines){const i=document.createElement("div");i.textContent=n,this.log.appendChild(i)}this.log.hidden=!1,this.hideTimer&&window.clearTimeout(this.hideTimer),this.hideTimer=window.setTimeout(()=>{this.log.hidden=!0,this.lines.length=0},8e3)}}class kb{constructor(e,t,n,i=()=>{}){this.onPick=n,this.onClose=i,this.sheet=document.createElement("div"),this.sheet.className="chat-panel pet-names",this.sheet.hidden=!0;const r=document.createElement("div");r.className="chat-card",this.title=document.createElement("div"),this.title.className="bag-title",this.title.textContent="🐾 이름 고르기";const o=document.createElement("div");o.className="chat-phrases";for(const c of t){const h=document.createElement("button");h.className="chat-phrase",h.textContent=c,h.addEventListener("click",()=>{this.mobId!==null&&this.onPick(this.mobId,c),this.hide()}),o.appendChild(h)}const a=document.createElement("button");a.className="plain-btn chat-close",a.textContent="닫기",a.addEventListener("click",()=>this.hide()),r.append(this.title,o,a),this.sheet.appendChild(r),this.sheet.addEventListener("click",c=>{c.target===this.sheet&&this.hide()}),e.appendChild(this.sheet)}onPick;onClose;sheet;title;mobId=null;get visible(){return!this.sheet.hidden}show(e,t){this.mobId=e,this.title.textContent=t?`🐾 ${t} — 다른 이름으로 바꾸기`:"🐾 이름 고르기",this.sheet.hidden=!1}hide(){this.sheet.hidden||(this.sheet.hidden=!0,this.mobId=null,this.onClose())}}class Ob{constructor(e,t){this.deps=t,this.el=document.createElement("div"),this.el.className="bag-panel chest-panel",this.el.hidden=!0,this.el.innerHTML=`
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
      </div>`,e.appendChild(this.el),this.title=this.el.querySelector(".chest-title"),this.chestGrid=this.el.querySelector(".chest-grid"),this.bagGrid=this.el.querySelector(".chest-bag"),this.halfBtn=this.el.querySelector(".chest-half"),this.el.querySelector(".chest-close").addEventListener("click",()=>t.onClose()),this.el.addEventListener("click",n=>{n.target===this.el&&t.onClose()}),this.halfBtn.addEventListener("click",()=>{this.half=!this.half,this.halfBtn.textContent=`반만 옮기기: ${this.half?"켜짐":"꺼짐"}`,this.halfBtn.classList.toggle("on",this.half)})}deps;el;at=null;chest=[];bag=new Array(Js).fill(null);selected=-1;half=!1;title;chestGrid;bagGrid;halfBtn;get visible(){return!this.el.hidden}get position(){return this.at}setChest(e,t,n,i){const r=!this.at||this.at.x!==e||this.at.y!==t||this.at.z!==n;this.at={x:e,y:t,z:n},this.chest=i,r&&(this.selected=-1),this.el.hidden=!1,this.render()}setInventory(e){this.bag=e,this.visible&&this.render()}hide(){this.el.hidden=!0,this.at=null,this.selected=-1}cell(e,t,n){const i=document.createElement("button");if(i.className="bag-cell"+(n?" hot":"")+(e===this.selected?" selected":""),i.title=t?`${this.deps.nameOf(t.item)} ×${t.count}`:"",t){const r=this.deps.icon(t.item,36);if(r&&i.appendChild(r),t.count>1){const o=document.createElement("span");o.className="bag-count",o.textContent=String(t.count),i.appendChild(o)}}return i.addEventListener("click",()=>this.tap(e)),i}render(){const e=this.chest.length===ff;this.title.textContent=`${e?"큰 상자":"상자"} (${this.chest.filter(Boolean).length}/${this.chest.length}칸 참)`,this.chestGrid.innerHTML="",this.chestGrid.classList.toggle("big",e);for(let n=0;n<this.chest.length;n++)this.chestGrid.appendChild(this.cell(n,this.chest[n],!1));this.bagGrid.innerHTML="";const t=this.chest.length;for(let n=0;n<Js;n++)this.bagGrid.appendChild(this.cell(t+n,this.bag[n],n<fo))}slotAt(e){const t=this.chest.length;return e<t?this.chest[e]:this.bag[e-t]??null}tap(e){if(this.selected<0)this.slotAt(e)&&(this.selected=e);else if(this.selected===e)this.selected=-1;else{const t=this.slotAt(this.selected);if(t){const n=this.half?Math.max(1,Math.floor(t.count/2)):t.count;this.deps.onMove(this.selected,e,n)}this.selected=-1}this.render()}}let Ci=625341585;function Ea(){return Ci^=Ci<<13,Ci^=Ci>>>17,Ci^=Ci<<5,(Ci>>>0)/4294967296}const vl=15,Sa=2*Math.PI*vl,zb=["북","북동","동","남동","남","남서","서","북서"];class Vb{el;touchUI;gaugeFg;hotbar;xpBar;xpFill;xpLevel;orbLayer;effects=[];slotEls=[];slotName;toastEl;debugEl;overlay;overlayTitle;overlaySub;overlayBtn;fullscreenBtn;debugBtn;bagBtn;rideBtn;skillBtn;heartsEl;armorEl;vignette;vignetteTimer=null;skillBox;staminaFill;staminaText;skillLabel="✨ 빔";familyBtn;familyText;timeChip;timeChipMin;timeChipSub;todayEl;todayTime;todayList;todayNote;approvalEl;approvalText;today=null;approveChip;approveChipText;pending=[];currentAsk=null;onCheckTodo=null;onApprove=null;chatBtn;helpEl;compassRose;compassLabels;compassText;lastBearing=NaN;onHelpToggle=null;villageEl;slots=[];selected=0;nameTimer=null;toastTimer=null;onSelect=null;onOverlayClick=null;timerEl;timerPhase;timerTime;actionEl;actionTitle;actionSub;actionBtn;actionAlt;onAction=null;onActionAlt=null;resultEl;onResultAgain=null;onResultClose=null;constructor(e,t){const n=document.createElement("div");n.className=`hud${t?" touch":""}`,n.innerHTML=`
      <div class="crosshair"></div>
      <svg class="gauge" viewBox="0 0 40 40" aria-hidden="true">
        <circle class="gauge-bg" cx="20" cy="20" r="${vl}"></circle>
        <circle class="gauge-fg" cx="20" cy="20" r="${vl}"></circle>
      </svg>
      <div class="slot-name"></div>
      <div class="armor" aria-label="방어" hidden></div>
      <div class="hearts" aria-label="체력" hidden></div>
      <div class="raid-bar" hidden></div>
      <div class="follow-bar" hidden><span class="follow-text"></span><button class="plain-btn follow-btn">🧭 따라가기</button></div>
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
      </div>`,e.appendChild(n),this.el=n;const i=a=>n.querySelector(a);this.gaugeFg=i(".gauge-fg"),this.gaugeFg.style.strokeDasharray=`${Sa}`,this.gaugeFg.style.strokeDashoffset=`${Sa}`,this.hotbar=i(".hotbar"),this.heartsEl=i(".hearts"),this.armorEl=i(".armor"),this.vignette=i(".hurt-vignette"),this.xpBar=i(".xp-bar"),this.xpFill=i(".xp-fill"),this.xpLevel=i(".xp-level"),this.orbLayer=i(".xp-orbs"),this.slotName=i(".slot-name"),this.toastEl=i(".toast"),this.debugEl=i(".debug-text"),this.overlay=i(".overlay"),this.overlayTitle=i(".overlay-title"),this.overlaySub=i(".overlay-sub"),this.overlayBtn=i(".overlay .overlay-btn"),this.fullscreenBtn=i(".fullscreen"),this.debugBtn=i(".debug"),this.bagBtn=i(".bag-btn"),this.rideBtn=i(".ride-btn"),this.skillBtn=i(".skill-btn"),this.skillBox=i(".skill-box"),this.staminaFill=i(".stamina-fill"),this.staminaText=i(".stamina-text"),this.familyBtn=i(".help-family-btn"),this.familyText=i(".help-family-text"),this.timeChip=i(".time-chip"),this.timeChipMin=i(".time-chip-min"),this.timeChipSub=i(".time-chip-sub"),this.todayEl=i(".today-panel"),this.todayTime=i(".today-time"),this.todayList=i(".today-list"),this.todayNote=i(".today-note"),this.approvalEl=i(".approval-card"),this.approvalText=i(".approval-text"),this.approveChip=i(".approve-chip"),this.approveChipText=i(".approve-chip-text"),this.approveChip.addEventListener("click",a=>{a.preventDefault();const c=this.pending[0];c&&this.showApproval(c)}),this.timeChip.addEventListener("click",a=>{a.preventDefault(),this.todayEl.hidden?this.showToday():this.hideToday()}),i(".today-close").addEventListener("click",()=>this.hideToday()),this.todayEl.addEventListener("click",a=>{a.target===this.todayEl&&this.hideToday()}),i(".approval-ok").addEventListener("click",()=>this.decideApproval(!0)),i(".approval-no").addEventListener("click",()=>this.decideApproval(!1)),i(".approval-later").addEventListener("click",()=>this.decideApproval(null)),this.chatBtn=i(".chat-btn"),this.helpEl=i(".help-panel"),this.compassRose=i(".compass-rose"),this.compassLabels=Array.from(n.querySelectorAll(".compass-label")),this.compassText=i(".compass-text"),i(".help-body").innerHTML=Gb(t);const r=a=>{a.preventDefault(),this.showHelp()},o=a=>{a.preventDefault(),this.hideHelp()};this.helpEl.addEventListener("click",a=>{a.target===this.helpEl&&this.hideHelp()}),i(".sbtn.help").addEventListener("click",r),i(".overlay .overlay-help").addEventListener("click",r),i(".help-panel .help-close").addEventListener("click",o),i(".help-ok").addEventListener("click",o),this.villageEl=i(".help-village"),this.timerEl=i(".exp-timer"),this.timerPhase=i(".exp-phase"),this.timerTime=i(".exp-time"),this.actionEl=i(".action-card"),this.actionTitle=i(".action-title"),this.actionSub=i(".action-sub"),this.actionBtn=i(".action-btn"),this.actionBtn.addEventListener("click",a=>{a.preventDefault(),this.onAction?.()}),this.actionAlt=i(".action-alt"),this.actionAlt.addEventListener("click",a=>{a.preventDefault(),this.onActionAlt?.()}),this.resultEl=i(".result-panel"),i(".result-again").addEventListener("click",()=>{this.hideResult(),this.onResultAgain?.()}),i(".result-close").addEventListener("click",()=>{this.hideResult(),this.onResultClose?.()}),this.touchUI={surface:n,stickBase:i(".stick-base"),stickKnob:i(".stick-knob"),jumpButton:i(".jump"),sneakButton:i(".sneak"),guardButton:i(".guard")},this.overlayBtn.addEventListener("click",()=>this.onOverlayClick?.()),this.overlay.addEventListener("click",a=>{a.target===this.overlay&&this.onOverlayClick?.()})}setFullscreen(e){const t=this.fullscreenBtn;t.hidden=e==="hidden",t.classList.toggle("active",e==="on"),t.textContent=e==="on"?"⛶ 전체화면 끄기":"⛶ 전체화면",t.setAttribute("aria-label",e==="on"?"전체화면 끄기":"전체화면")}setSlots(e){const t=this.slotEls.length!==e.length;this.slots=e,t&&(this.hotbar.innerHTML="",this.slotEls.length=0,e.forEach((n,i)=>{const r=document.createElement("div");r.className="slot",r.dataset.index=String(i);const o=document.createElement("span");o.className="slot-key",o.textContent=String((i+1)%10),r.appendChild(o),r.addEventListener("pointerdown",a=>{a.preventDefault(),a.stopPropagation(),this.select(i),this.onSelect?.(i)}),this.hotbar.appendChild(r),this.slotEls.push(r)})),e.forEach((n,i)=>this.paintSlot(i,n)),t?this.select(0,!1):this.select(this.selected,!1)}paintSlot(e,t){const n=this.slotEls[e];if(n&&(n.querySelectorAll("canvas, .slot-count").forEach(i=>i.remove()),n.classList.toggle("empty",t.item===null),t.icon&&n.appendChild(t.icon),t.count>1)){const i=document.createElement("span");i.className="slot-count",i.textContent=String(t.count),n.appendChild(i)}}select(e,t=!0){this.slots.length!==0&&(e=(e%this.slots.length+this.slots.length)%this.slots.length,this.selected=e,this.slotEls.forEach((n,i)=>n.classList.toggle("selected",i===e)),t&&this.showSlotName(this.slots[e].item?this.slots[e].name:"빈 칸"))}selectDelta(e){this.select(this.selected+e)}get selectedIndex(){return this.selected}get selectedItem(){return this.slots[this.selected]?.item??null}showSlotName(e){this.slotName.textContent=e,this.slotName.classList.add("show"),this.nameTimer&&window.clearTimeout(this.nameTimer),this.nameTimer=window.setTimeout(()=>this.slotName.classList.remove("show"),1200)}setCompassTarget(e,t){const n=this.el.querySelector(".compass-home");if(e===null){n.hidden||(n.hidden=!0),this.compassTargetLabel!==null&&(this.compassTargetLabel=null,this.lastBearing=-999);return}n.hidden=!1,n.style.transform=`rotate(${e}deg) translateY(-23px)`,this.compassTargetLabel!==t&&(this.compassTargetLabel=t,this.lastBearing=-999)}compassTargetLabel=null;setHeading(e){const t=(-e*180/Math.PI%360+360)%360;if(!(Math.abs(t-this.lastBearing)<.3)){this.lastBearing=t,this.compassRose.style.transform=`rotate(${-t}deg)`;for(const n of this.compassLabels)n.style.transform=`rotate(${t}deg)`;this.compassText.textContent=zb[Math.round(t/45)%8]+(this.compassTargetLabel?` · ${this.compassTargetLabel}`:"")}}get todayVisible(){return!this.todayEl.hidden}setToday(e){if(this.today=e,!e){this.timeChip.hidden=!0,this.todayEl.hidden=!0;return}this.timeChip.hidden=!1;const t=e.todos.filter(n=>n.status==="approved").length;this.timeChipMin.textContent=`⏱ ${e.remainingMin}분`,this.timeChipSub.textContent=e.todos.length?`할 일 ${t}/${e.todos.length}`:"",this.timeChip.classList.toggle("warn",e.remainingMin>0&&e.remainingMin<=5),this.timeChip.classList.toggle("danger",e.remainingMin<=0),this.renderToday()}renderToday(){const e=this.today;if(!e)return;const t=e.manualAdj?` ${e.manualAdj>0?"+":"−"}${Math.abs(e.manualAdj)}분 조정`:"";this.todayTime.innerHTML="";const n=document.createElement("div");n.className="today-remaining",n.textContent=`남은 시간 ${e.remainingMin}분`;const i=document.createElement("div");if(i.className="today-detail",i.textContent=`기본 ${e.baseMin}분 + 보너스 ${e.bonusMin}/${e.bonusCap}분${t} − 쓴 ${e.usedMin}분`,this.todayTime.append(n,i),this.todayList.innerHTML="",e.todos.length===0){const o=document.createElement("li");o.className="today-empty",o.textContent="오늘 할 일이 없어요. 아빠·엄마가 /family 에서 만들어요",this.todayList.appendChild(o)}for(const o of e.todos){const a=document.createElement("li"),c=document.createElement("span");if(c.className="todo-title",c.textContent=o.title,a.appendChild(c),o.status==="pending"||o.status==="rejected"){if(o.status==="rejected"){const u=document.createElement("span");u.className="todo-state",u.textContent="다시 해 봐요",a.appendChild(u)}const h=document.createElement("button");h.className="todo-btn",h.textContent="했어요",h.addEventListener("click",()=>{h.disabled=!0,this.onCheckTodo?.(o.id)}),a.appendChild(h)}else{const h=document.createElement("span");h.className="todo-state",h.textContent=o.status==="approved"?"✅ 했어요":"⏳ 확인 기다리는 중",a.appendChild(h)}this.todayList.appendChild(a)}for(const o of e.adjustments){const a=document.createElement("li");a.className="today-adjust";const c=document.createElement("span");c.className="todo-title",c.textContent=`아빠·엄마 조정 ${o.min>0?"+":"−"}${Math.abs(o.min)}분${o.reason?` — ${o.reason}`:""}`,a.appendChild(c),this.todayList.appendChild(a)}const r=[];e.weekMessage?r.push(e.weekMessage):r.push("처음이니까 믿고 시작할게. 이번 주 할 일을 잘하면 다음 주 보너스가 정해져요."),e.noPlayToday&&r.push("오늘은 게임 없는 날이에요."),e.todos.some(o=>o.needsApproval)&&r.push("아빠·엄마가 확인해 주면 시간이 더 생겨요."),e.blocked?r.push(e.nextOpen?`지금은 게임 시간이 아니에요. ${e.nextOpen} 에 열려요.`:"지금은 게임 시간이 아니에요."):e.minutesUntilBlocked<1440&&r.push(`게임 시간은 ${e.minutesUntilBlocked}분 뒤에 끝나요.`),r.push(e.enforced?"남은 시간이 0 이 되면 마을에서 나가요. 5분 동안 가만히 있어도 나가요.":"지금은 시간을 재기만 해요. 0 이 돼도 게임은 계속돼요."),this.todayNote.textContent=r.join(" ")}showToday(){this.today&&(this.renderToday(),this.todayEl.hidden=!1)}hideToday(){this.todayEl.hidden=!0}setPending(e){this.pending=e,this.approveChip.hidden=e.length===0,this.approveChipText.textContent=`✅ 승인 ${e.length}`,this.currentAsk&&!e.some(t=>t.id===this.currentAsk.id&&t.date===this.currentAsk.date)&&(this.currentAsk=null,this.approvalEl.hidden=!0)}showApproval(e){this.currentAsk=e;const t=this.pending.filter(n=>!(n.id===e.id&&n.date===e.date)).length;this.approvalText.textContent=`${e.child}: "${e.title}" 했대요. 확인해 주세요${t>0?` (${t}개 더 기다려요)`:""}`,this.approvalEl.hidden=!1}decideApproval(e){const t=this.currentAsk;this.currentAsk=null,this.approvalEl.hidden=!0,!(!t||e===null)&&(this.onApprove?.(t,e),this.setPending(this.pending.filter(n=>!(n.id===t.id&&n.date===t.date))))}setHealth(e,t){this.heartsEl.hidden=!1;const n=Math.ceil(t/2);let i="";for(let r=0;r<n;r++){const o=Math.max(0,Math.min(2,e-r*2));i+=`<span class="heart ${o===2?"full":o===1?"half":"empty"}"></span>`}this.heartsEl.innerHTML=i,this.heartsEl.classList.toggle("low",e<=6)}setGuardAvailable(e){const t=this.el.querySelector(".tbtn.guard");t.hidden!==!e&&(t.hidden=!e)}setGuarding(e){this.el.querySelector(".tbtn.guard").classList.toggle("active",e)}setDragonHp(e,t){const n=this.el.querySelector(".dragon-hp-fill"),i=this.el.querySelector(".dragon-hp-text");n.style.width=`${Math.round(Math.max(0,e)/Math.max(1,t)*100)}%`,n.classList.toggle("low",e<=t*.3),i.textContent=`🐉 ${Math.max(0,e)} / ${t}`}setGuide(e){const t=this.el.querySelector(".guide");if(!e){t.hidden=!0;return}t.hidden=!1,t.textContent=e}setArmor(e){if(e<=0){this.armorEl.hidden=!0;return}this.armorEl.hidden=!1;let t="";for(let n=0;n<10;n++){const i=Math.max(0,Math.min(2,e-n*2));t+=`<span class="armor-pt ${i===2?"full":i===1?"half":"empty"}"></span>`}this.armorEl.innerHTML=t}hurtFlash(){this.vignette.classList.add("on"),this.vignetteTimer&&clearTimeout(this.vignetteTimer),this.vignetteTimer=setTimeout(()=>this.vignette.classList.remove("on"),350)}setXp(e){const t=po(e);this.xpBar.hidden=!1,this.xpFill.style.width=`${Math.round(t.progress*100)}%`,this.xpLevel.textContent=String(t.level),this.xpLevel.classList.toggle("zero",t.level===0)}xpOrbs(e,t,n,i=0){const r=this.xpBar.getBoundingClientRect(),o=this.el.getBoundingClientRect(),a=r.left+r.width/2-o.left,c=r.top+r.height/2-o.top;if(i>0){const h=document.createElement("div");h.className="xp-float",h.textContent=`+${i}`,h.style.left=`${a}px`,h.style.top=`${c-28}px`,h.style.opacity="0",this.orbLayer.appendChild(h),this.effects.push({el:h,kind:"label",t:0,delay:0,dur:1.6,sx:a,sy:c-28,mx:a,my:c-68,tx:a,ty:c-68})}for(let h=0;h<n;h++){const u=document.createElement("div");u.className="xp-orb",u.style.left=`${e}px`,u.style.top=`${t}px`,u.style.opacity="0",this.orbLayer.appendChild(u);const l=Ea()*Math.PI*2,d=24+Ea()*56;this.effects.push({el:u,kind:"orb",t:0,delay:h*.07,dur:1.1+Ea()*.5,sx:e,sy:t,mx:e+Math.cos(l)*d,my:t+Math.sin(l)*d-40,tx:a,ty:c})}}tickEffects(e){if(this.effects.length===0)return;const t=n=>1-(1-n)*(1-n);for(let n=this.effects.length-1;n>=0;n--){const i=this.effects[n];i.t+=e;const r=Math.max(0,Math.min(1,(i.t-i.delay)/i.dur));if(i.t<i.delay)continue;let o,a,c,h;if(i.kind==="label")o=i.sx,a=i.sy+(i.ty-i.sy)*r,c=r<.2?.8+r/.2*.35:1.15-(r-.2)/.8*.15,h=r<.2?r/.2:1-(r-.2)/.8;else if(r<.3){const u=t(r/.3);o=i.sx+(i.mx-i.sx)*u,a=i.sy+(i.my-i.sy)*u,c=.6+.5*u,h=.9+.1*u}else{const u=(r-.3)/.7,l=u*u;o=i.mx+(i.tx-i.mx)*l,a=i.my+(i.ty-i.my)*l,c=1.1-.6*u,h=1-.8*u}i.el.style.left=`${o}px`,i.el.style.top=`${a}px`,i.el.style.opacity=String(h),i.el.style.transform=`translate(-50%, -50%) scale(${c.toFixed(3)})`,r>=1&&(i.el.remove(),this.effects.splice(n,1))}}setRiding(e,t="빔",n=!0){this.rideBtn.hidden=!e,this.skillBox.hidden=!e||!n,this.skillLabel=`✨ ${t}`,this.skillBtn.textContent=this.skillLabel}setStamina(e,t,n,i){const r=t>0?Math.max(0,Math.min(1,e/t)):0;this.staminaFill.style.width=`${Math.round(r*100)}%`,this.staminaFill.classList.toggle("low",e<n),this.staminaText.textContent=`${Math.floor(e)} / ${t}`,this.skillBtn.disabled=i>0||e<n,this.skillBtn.classList.toggle("cooling",i>0);const o=i>0?`⏳ ${Math.ceil(i)}`:this.skillLabel;this.skillBtn.textContent!==o&&(this.skillBtn.textContent=o)}setFamily(e,t=null){if(t){this.familyText.textContent=`부모로 연결됨 (가족 코드 ${t}) — 아이가 할 일을 체크하면 승인 카드가 떠요`,this.familyBtn.hidden=!0;return}this.familyBtn.hidden=!1,this.familyText.textContent=e?`가족 연결됨 (코드 ${e}) — 위의 ⏱ 에서 오늘 할 일과 남은 시간을 봐요`:"아빠·엄마 화면(/family)의 가족 코드로 내 계정을 연결해요 (아이만)",this.familyBtn.textContent=e?"다시 연결":"가족 연결"}setVillageInfo(e){this.villageEl.textContent=e}setFollow(e,t){const n=this.el.querySelector(".follow-bar");if(e===null){n.hidden=!0;return}n.hidden=!1;const i=n.querySelector(".follow-text");i.textContent!==e&&(i.textContent=e);const r=n.querySelector(".follow-btn");r.onclick=t?()=>t():null}setProgress(e){const t=e>0;this.gaugeFg.parentElement.classList.toggle("show",t),t&&(this.gaugeFg.style.strokeDashoffset=`${Sa*(1-Math.min(1,e))}`)}toast(e,t=4e3){this.toastEl.textContent=e,this.toastEl.hidden=!1,this.toastTimer&&window.clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>this.toastEl.hidden=!0,t)}setDebug(e){this.debugEl.hidden=e===null,e!==null&&(this.debugEl.textContent=e)}setTimer(e,t){if(e===null){this.timerEl.hidden=!0;return}this.timerEl.hidden=!1;const n=Math.floor(e/60),i=Math.floor(e%60);this.timerTime.textContent=n+":"+String(i).padStart(2,"0"),this.timerPhase.textContent=t==="night"?"🌙 밤":t==="evening"?"🌇 저녁":"☀️ 낮",this.timerEl.classList.toggle("warn",e<=180),this.timerEl.classList.toggle("danger",e<=60),this.timerEl.classList.toggle("night",t==="night")}showAction(e,t,n,i,r){this.onAction=i,this.onActionAlt=r?.onClick??null,this.actionTitle.textContent!==e&&(this.actionTitle.textContent=e),this.actionSub.textContent!==t&&(this.actionSub.textContent=t),this.actionBtn.textContent!==n&&(this.actionBtn.textContent=n),r&&this.actionAlt.textContent!==r.label&&(this.actionAlt.textContent=r.label),this.actionAlt.hidden=!r,this.actionEl.hidden=!1}setBoss(e,t,n){const i=this.el.querySelector(".boss-bar");i.hidden=!1;const r=i.querySelector(".boss-name");r.textContent!==e&&(r.textContent=e),i.querySelector(".boss-fill").style.width=`${Math.max(0,Math.min(100,t/Math.max(1,n)*100))}%`;const o=`${t} / ${n}`,a=i.querySelector(".boss-text");a.textContent!==o&&(a.textContent=o)}setRaid(e,t=!1){const n=this.el.querySelector(".raid-bar");n.hidden=!1,n.textContent!==e&&(n.textContent=e),n.classList.toggle("danger",t)}hideRaid(){const e=this.el.querySelector(".raid-bar");e&&(e.hidden=!0)}hideBoss(){const e=this.el.querySelector(".boss-bar");e&&(e.hidden=!0)}hideAction(){this.actionEl.hidden=!0,this.onAction=null,this.onActionAlt=null}triggerAction(){this.actionEl.hidden||this.onAction?.()}get actionVisible(){return!this.actionEl.hidden}showResult(e,t,n,i,r,o){this.onResultAgain=r,this.onResultClose=o;const a=h=>this.resultEl.querySelector(h);a(".result-title").textContent=e,a(".result-sub").textContent=t;const c=a(".result-items");if(c.innerHTML="",n.length===0){const h=document.createElement("li");h.className="result-empty",h.textContent="이번엔 빈손이에요. 블록을 부수면 가져올 수 있어요",c.appendChild(h)}for(const h of n){const u=document.createElement("li");h.icon&&u.appendChild(h.icon);const l=document.createElement("span");l.className="result-name",l.textContent=h.name;const d=document.createElement("span");d.className="result-count",d.textContent="×"+h.count,u.append(l,d),c.appendChild(u)}a(".result-again").textContent=i,this.resultEl.hidden=!1}hideResult(){this.resultEl.hidden=!0}get resultVisible(){return!this.resultEl.hidden}showOverlay(e,t,n){this.overlayTitle.textContent=e,this.overlaySub.textContent=t,this.overlayBtn.textContent=n??"",this.overlayBtn.hidden=n===null,this.overlay.classList.add("show")}hideOverlay(){this.overlay.classList.remove("show")}get overlayVisible(){return this.overlay.classList.contains("show")}showHelp(){this.helpEl.hidden&&(this.helpEl.hidden=!1,this.helpEl.querySelector(".help-card").scrollTop=0,this.onHelpToggle?.(!0))}hideHelp(){this.helpEl.hidden||(this.helpEl.hidden=!0,this.onHelpToggle?.(!1))}get helpVisible(){return!this.helpEl.hidden}}function Gb(s){const e=s?[["걷기","왼쪽 아래 <b>스틱</b>을 누른 채 밀기. 끝까지 앞으로 밀면 달리기"],["둘러보기","스틱이 아닌 곳을 <b>드래그</b>"],["블록 놓기","놓을 자리를 <b>짧게 탭</b>"],["블록 부수기","블록을 <b>꾹 누르기</b>. 게이지가 차고 금이 가면 부서져요"],["점프","오른쪽 아래 <b>▲</b> (꾹 누르면 그동안, <b>두 번 톡톡</b> 치면 손을 떼도 계속 눌린 채. 다시 한 번 누르면 풀려요)"],["웅크리기","<b>▼</b> (▲ 와 같아요 — 꾹 누르면 그동안, 두 번 톡톡 치면 계속). 웅크리면 모서리에서 안 떨어져요"],["블록 고르기","아래 칸(핫바)을 탭"],["가방 · 만들기","핫바 옆 <b>🎒</b>. 칸을 탭해 고르고 다른 칸을 탭하면 옮겨요"],["공격 · 막기","검·도끼·곡괭이를 들고 <b>화면을 탭</b>하면 휘둘러요 — 앞에 있는 몹은 맞고, 블록은 톡톡 치면 캐져요(꾹 눌러도 돼요). 활·쇠뇌는 <b>꾹 누르면 시위를 당기고</b> 놓으면 쏴요(가득 당기면 세요). 방패를 끼면 <b>🛡️</b> 버튼이 생겨요 — <b>한 번</b> 누르면 잠깐, <b>누르고 있으면</b> 그동안, <b>두 번 톡톡</b> 치면 계속 막아요(조금 천천히 걸어요)"],["채팅","<b>💬</b> → 이모지나 문구를 골라요"],["FPS 보기","오른쪽 위 <b>i</b>"]]:[["걷기 / 달리기","<b>W A S D</b> / Ctrl 누른 채 W"],["둘러보기","마우스. 클릭하면 마우스가 잠기고, <b>ESC</b>로 풀려요"],["블록 놓기","<b>오른쪽 클릭</b> (누르고 있으면 연속)"],["블록 부수기","<b>왼쪽 클릭 꾹</b>. 금이 가면 부서져요"],["점프 / 웅크리기","<b>Space</b> / <b>Shift</b>"],["블록 고르기","<b>1~9, 0</b> 또는 마우스 휠"],["가방 · 만들기","<b>E</b> (또는 핫바 옆 🎒)"],["공격 · 막기","몹을 노리고 <b>클릭</b>(검). 활·쇠뇌는 <b>왼쪽 클릭을 누르고 있으면 당기고</b> 놓으면 쏴요. 방패를 끼고 <b>X</b> 를 한 번 누르면 잠깐, 누르고 있으면 그동안 몹 공격을 다 막아요(조금 천천히 걸어요)"],["채팅","<b>T</b> (또는 💬) → 이모지·문구 고르기"],["정보","<b>F3</b>"]],t=s?"PC 에서는: WASD 이동 · 마우스 둘러보기 · 왼쪽 클릭 꾹 부수기 · 오른쪽 클릭 놓기 · 1~9 블록":"폰에서는: 왼쪽 아래 스틱 · 드래그로 둘러보기 · 짧게 탭 놓기 · 꾹 눌러 부수기 · ▲ 점프",n=["왼쪽 위 <b>나침반</b>: 맨 위 글자가 지금 내가 보는 방향이에요(북은 빨강). 광장에서 북쪽에 포탈 자리와 강, 서쪽·동쪽에 큰 밭, 남쪽에 집 뼈대, 둘레는 참나무 숲과 언덕.","<b>블록은 유한</b>해요. 부수면 가방에 들어오고, 놓으면 가방에서 나가요. <b>친구가 놓은 블록은 그 친구만</b> 부술 수 있어요(마을에서). 처음엔 시작 키트(판자·흙·조약돌·횃불·유리·제작대·양동이)를 받아요. 물은 빈 양동이로 떠서 옮겨요.","<b>만들기</b>: 가방 화면의 🔨 탭. 마인크래프트처럼 <b>격자에 재료를 모양대로</b> 놓으면 결과가 나와요 — 가방 칸을 탭해 고르고 격자 칸을 탭하면 하나씩, 아래 조합법을 탭하면 자동으로 채워져요. 가방에선 2×2, <b>제작대</b>를 놓고 그 옆(5칸)에선 3×3. 양조기 옆에서는 ⚗️ 탭이 생겨요. <b>📜 조합법</b> 탭에 만들 수 있는 것 전부가 모양과 함께 있어요. 레시피는 아빠·아들이 recipes.json 에 적어요.","한 칸 높은 턱은 그냥 걸어가면 올라가요. 두 칸부터는 점프.","손에 든 블록이 오른쪽 아래에 보이고, 조준한 블록엔 검은 테두리가 생겨요. 닿는 거리는 5블록.","블록마다 부수는 시간이 달라요. 흙·모래 0.5초, 돌 1.5초, 원목·판자 2초. 맨 아래 기반암과 물은 못 부숴요.","내 몸이 있는 자리에는 블록을 놓을 수 없어요.","물에 들어가면 천천히 가라앉고, 점프를 누르면 위로 헤엄쳐요.","빈 <b>양동이</b>를 들고 물이나 용암을 <b>꾹 누르면</b> 떠요(물 양동이·용암 양동이). 들고 탭하면 다시 부어요. 양동이 하나엔 물 하나 — 찬 양동이는 한 칸에 하나씩이고 빈 양동이는 16개까지 겹쳐요.","아이폰은 사파리 공유(⬆️) → <b>홈 화면에 추가</b> → 그 아이콘으로 열면 전체화면 앱처럼 돼요. 갤럭시 크롬은 ⛶ 전체화면 버튼이면 돼요.","내가 놓은 물·용암은 양동이 하나만큼이에요. 사방으로 퍼지면서 낮아지고, 양만큼만 퍼지고 멈춰요(위로는 안 차요). 강·연못 같은 원래 있던 물은 마르지 않아요. 물이나 용암을 꾹 누르면(PC: 왼쪽 클릭) 떠내거나 닦아낼 수 있어요. 물이 용암을 만나면 돌이 돼요.","광장 남쪽에 뼈대만 있는 집이 있어요. 문·창문·지붕을 채워 봐요. 동남쪽 언덕엔 동굴 입구가 있고 땅속엔 광물과 동굴이 있어요.",'<b>원정</b>: 광장 북쪽 보라색 포탈 안에 서면 "원정 출발" 버튼이 나와요. 초원 섬에 10분 동안 다녀오는데, 6분이 지나면 밤이 돼요. 섬 가운데 포탈로 돌아오면 부순 블록을 마을 창고에 가져와요. 시간이 다 되면 저절로 돌아오지만 절반만 가져와요. 친구가 먼저 갔으면 같은 포탈에서 "따라가기".',"세계 끝은 보이지 않는 벽. 떨어지면 광장으로 돌아와요.","만든 것은 서버에 저장돼요. 같은 마을 코드로 들어오면 어느 폰·PC 에서도 같은 마을이에요. 친구에게 마을 코드 6자리를 알려 주면 함께 지을 수 있어요(6명까지).",'다른 사람이 놓거나 부순 블록도 바로 보여요. 서버가 "너무 멀어요" 같은 말을 하면 그 블록은 되돌아가요.',"<b>체력</b>: 하트 10개. 4칸 넘게 떨어지면 아프고, 원정 밤엔 좀비·크리퍼·거미·스켈레톤이 와요. 몹을 노리고 탭하면 때려요(검이 세요). 하트가 다 떨어지면 경험치를 초록 구슬로 떨어뜨리고 포탈 앞(마을은 광장)에서 다시 — 구슬을 밟으면 되찾아요.","<b>경험치·드래곤</b>: 원정 귀환·블록 발견·몹 잡기로 경험치. 레벨을 써서 광장 남쪽 둥지에서 드래곤 알을 부화시키고, 어른이 되면 안장(가죽 5 + 철 2)을 얹어 타고 날아요. 타고 ✨ 를 누르면 빔!",'<b>갑옷·방패·활</b>: 가죽(제작대)이나 철·황금·다이아몬드(대장간)로 투구·흉갑·레깅스·부츠를 만들어 가방에서 "🛡️ 입기". 방패를 끼우면 몹 피해가 반으로. 활(막대기 3 + 실 3)과 화살(부싯돌·막대기·깃털)을 들면 멀리 있는 몹도 쏴요.',"<b>동물</b>: 광장에서 50칸쯤 바깥 숲에 소·돼지·양·닭·강아지가 무리로 살아요. 먹이(밀·당근·씨앗)를 들면 따라오고, 둘에게 먹이면 아기가 태어나요. 강아지는 뼈로 길들여 펫으로 — 이름도 지어 줄 수 있어요. 가위로 양털, 빈손으로 닭을 탭하면 달걀.","<b>마을 창고·건물</b>: 광장 동쪽 창고에 재료를 모아 대장간·농장·등대·포탈 2단계를 지어요. 건물이 늘면 마을 레벨이 오르고 깃발이 늘어요. 마을 레벨 2부터 깃대 옆에서 우민 방어전을 열 수 있어요(주 2회)."];return`<table class="help-table">${e.map(([i,r])=>`<tr><th>${i}</th><td>${r}</td></tr>`).join("")}</table><p class="help-other">${t}</p><h3>알아두면 좋아요</h3><ul class="help-tips">${n.map(i=>`<li>${i}</li>`).join("")}</ul>`}function Hb(s,e){if(s===null)return"어른";const t=s-e;if(t<=0)return"곧 어른이 돼요";const n=Math.ceil(t/6e4);return n>=60?`어른까지 ${Math.floor(n/60)}시간 ${n%60}분`:`어른까지 ${n}분`}class Wb{constructor(e,t){this.deps=t,this.el=document.createElement("div"),this.el.className="nest-panel",this.el.hidden=!0,this.el.innerHTML=`
      <div class="help-card nest-card">
        <div class="help-head">
          <h2>🥚 드래곤 둥지</h2>
          <button class="help-close nest-close" aria-label="닫기">✕</button>
        </div>
        <div class="nest-body"></div>
      </div>`,e.appendChild(this.el),this.body=this.el.querySelector(".nest-body"),this.el.querySelector(".nest-close").addEventListener("click",()=>t.onClose()),this.el.addEventListener("click",n=>{n.target===this.el&&t.onClose()})}deps;el;inv=[];mine=[];slots=[];nestDragons=[];xpTotal=0;body;get visible(){return!this.el.hidden}show(){this.el.hidden=!1,this.render()}hide(){this.el.hidden=!0}setInventory(e){this.inv=e,this.visible&&this.render()}setDragons(e){this.mine=e,this.visible&&this.render()}setNest(e,t){this.slots=e,t&&(this.nestDragons=t),this.visible&&this.render()}setXp(e){this.xpTotal=e,this.visible&&this.render()}eggsInBag(){const e=new Map;for(const t of this.inv)t&&sd(t.item)&&e.set(t.item,(e.get(t.item)??0)+t.count);return[...e].map(([t,n])=>({item:t,count:n}))}countOf(e){let t=0;for(const n of this.inv)n&&n.item===e&&(t+=n.count);return t}chip(e){const t=document.createElement("span");return t.className="nest-chip",t.style.background=e??"#999",t}render(){const e=this.body;e.innerHTML="";const t=po(this.xpTotal).level,n=this.eggsInBag(),i=this.deps.now?this.deps.now():Date.now(),r=document.createElement("p");r.className="nest-note",r.textContent=`내 레벨 ${t} · 가방에 알 ${n.reduce((d,f)=>d+f.count,0)}개 · 내 드래곤 ${this.mine.filter(d=>d.stage!=="egg").length}마리`,e.appendChild(r);const o=document.createElement("div");o.className="nest-slots";const a=this.deps.eggSlots();for(let d=0;d<a;d++){const f=document.createElement("div");f.className="nest-slot";const A=this.slots.find(p=>p.slot===d),g=document.createElement("div");if(g.className="nest-slot-title",A){const p=this.deps.dragons.find(A.dragon);if(g.append(this.chip(p?.color),document.createTextNode(` ${p?.name??A.dragon} 알 — ${A.mine?"내 것":`${A.owner} 것`}`)),f.appendChild(g),A.mine&&p){const m=Eu(this.deps.xp,p.tier),M=t>=m,S=document.createElement("button");S.className="big-btn nest-btn",S.textContent=M?`부화하기 (레벨 ${m} 씀)`:`부화하려면 레벨 ${m} (지금 ${t})`,S.disabled=!M,S.addEventListener("click",()=>this.deps.onHatch(A.id)),f.appendChild(S)}}else{g.textContent=`${d+1}번 자리 — 비었어요`,f.appendChild(g);for(const p of n){const m=document.createElement("button");m.className="plain-btn nest-btn",m.textContent=`${this.deps.nameOf(p.item)} 놓기${p.count>1?` (${p.count})`:""}`,m.addEventListener("click",()=>this.deps.onPlace(d,p.item)),f.appendChild(m)}if(n.length===0){const p=document.createElement("div");p.className="nest-hint",p.textContent="제작대에서 재료로 알을 만들어 와요",f.appendChild(p)}}o.appendChild(f)}if(a<Su){const d=document.createElement("div");d.className="nest-hint",d.textContent=`알 자리 ${a}개 · 창고에서 ${a<6?"큰 둥지를":"드래곤 성을"} 지으면 2개 더 열려요`,o.appendChild(d)}e.appendChild(o);const c=document.createElement("h3");c.textContent=`둥지의 드래곤 ${this.nestDragons.length}마리`,e.appendChild(c);const h=document.createElement("ul");if(h.className="nest-list",this.nestDragons.length===0){const d=document.createElement("li");d.className="nest-hint",d.textContent="아직 없어요. 알을 놓고 부화시켜요!",h.appendChild(d)}const u=[...this.nestDragons].sort((d,f)=>Number(f.mine)-Number(d.mine)||d.id-f.id);for(const d of u){const f=this.deps.dragons.find(d.dragon),A=document.createElement("li"),g=document.createElement("div");if(g.append(this.chip(f?.color),document.createTextNode(` ${f?.name??d.dragon} · ${d.stage==="baby"?"아기":"어른"} · ${d.mine?"내 것":`${d.owner} 것`}`)),A.appendChild(g),d.stage==="adult"&&d.mine){const p=document.createElement("div");if(p.className="nest-feed",d.restingUntil&&d.restingUntil>Date.now()){const m=document.createElement("span");if(m.className="nest-hint",m.textContent=`😵 쓰러져서 쉬는 중 — ${Math.max(1,Math.ceil((d.restingUntil-Date.now())/6e4))}분 뒤에 탈 수 있어요 · 먹이 하나에 2분 빨라져요`,p.appendChild(m),f)for(const M of jl(f)){const S=this.countOf(M);if(S<=0)continue;const y=document.createElement("button");y.className="plain-btn nest-btn",y.textContent=`${this.deps.nameOf(M)} 먹이기 (${S})`,y.addEventListener("click",()=>this.deps.onFeed(d.id,M)),p.appendChild(y)}}else if(this.countOf(od)>0){const m=document.createElement("button");m.className="big-btn nest-btn",m.textContent="🐉 타기",m.addEventListener("click",()=>this.deps.onRide(d.id)),p.appendChild(m)}else{const m=document.createElement("span");m.className="nest-hint",m.textContent="안장이 있으면 탈 수 있어요 (제작대: 가죽 5 + 철 2, 가죽은 소에서)",p.appendChild(m)}A.appendChild(p)}if(d.stage==="baby"){const p=document.createElement("div");if(p.className="nest-hint",p.textContent=Hb(d.growAt,i)+(d.mine?` · 먹이 ${d.fed}개 줬어요`:""),A.appendChild(p),d.mine&&f){const m=document.createElement("div");m.className="nest-feed";const M=jl(f);let S=!1;for(const y of M){const D=this.countOf(y);if(D<=0)continue;S=!0;const v=document.createElement("button");v.className="plain-btn nest-btn",v.textContent=`${this.deps.nameOf(y)} 먹이기 (${D})`,v.addEventListener("click",()=>this.deps.onFeed(d.id,y)),m.appendChild(v)}if(!S){const y=document.createElement("span");y.className="nest-hint",y.textContent=`먹이: ${M.map(D=>this.deps.nameOf(D)).join("·")} (1개 = 10분 빨리 자라요)`,m.appendChild(y)}A.appendChild(m)}}h.appendChild(A)}e.appendChild(h);const l=document.createElement("p");l.className="nest-note",l.textContent="아기는 1시간이면 어른이 돼요(먹이로 더 빨리). 어른은 안장을 만들어 탈 수 있어요. 빔은 다음 단계에서.",e.appendChild(l)}}const Xb=150,zh=400,yo=new Il(1,1,1,10,1,!0);yo.rotateX(Math.PI/2);yo.translate(0,0,.5);class Yb{group=new Dt;beams=[];constructor(e){e.add(this.group)}get count(){return this.beams.length}fire(e,t,n,i,r=gf,o=performance.now()){const a=Math.max(1,Math.min(5,i)),c=.12+.07*a,h=new $e(n),u=new lt(yo,new Ht({color:h.clone().lerp(new $e(16777215),.4),transparent:!0,opacity:.95,blending:vs,depthWrite:!1,side:ln})),l=new lt(yo,new Ht({color:h,transparent:!0,opacity:.35+.08*a,blending:vs,depthWrite:!1,side:ln}));u.scale.set(c*.45,c*.45,.01),l.scale.set(c,c,.01);const d=new Dt;d.add(l,u),d.position.set(e.x,e.y,e.z);const f=Math.hypot(t.x,t.y,t.z)||1;d.lookAt(e.x+t.x/f,e.y+t.y/f,e.z+t.z/f),this.group.add(d),this.beams.push({group:d,core:u,glow:l,born:o,range:r})}update(e=performance.now()){for(let t=this.beams.length-1;t>=0;t--){const n=this.beams[t],i=e-n.born;if(i>=Zs){this.group.remove(n.group),n.core.material.dispose(),n.glow.material.dispose(),this.beams.splice(t,1);continue}const r=n.range*Math.min(1,i/Xb);n.core.scale.z=r,n.glow.scale.z=r;const o=i>Zs-zh?(Zs-i)/zh:1,a=1+.12*Math.sin(i*.03);n.core.material.opacity=.95*o,n.glow.material.opacity=(.35+.08*(n.glow.scale.x-.12)/.07)*o*a}}dispose(){for(const e of this.beams)this.group.remove(e.group),e.core.material.dispose(),e.glow.material.dispose();this.beams.length=0}}class qb{constructor(e,t){this.deps=t,this.el=document.createElement("div"),this.el.className="bag-panel storage-panel",this.el.hidden=!0,this.el.innerHTML=`
      <div class="bag-card storage-card">
        <div class="bag-head">
          <div class="bag-tabs storage-tabs"></div>
          <button class="plain-btn storage-close" aria-label="닫기">✕</button>
        </div>
        <div class="storage-title"></div>
        <div class="storage-body"></div>
      </div>`,e.appendChild(this.el),this.title=this.el.querySelector(".storage-title"),this.tabs=this.el.querySelector(".storage-tabs"),this.body=this.el.querySelector(".storage-body"),this.el.querySelector(".storage-close").addEventListener("click",()=>t.onClose()),this.el.addEventListener("click",n=>{n.target===this.el&&t.onClose()})}deps;el;inv=[];stock=new Map;built=new Set;level=1;codexCount=0;tab="stock";title;tabs;body;get visible(){return!this.el.hidden}show(e="stock"){this.tab=e,this.el.hidden=!1,this.render()}hide(){this.el.hidden=!0}setInventory(e){this.inv=e,this.visible&&this.render()}setStorage(e){this.stock=new Map(e.map(t=>[t.item,t.count])),this.visible&&this.render()}setVillage(e,t,n){this.built=new Set(e),this.level=t,this.codexCount=n,this.visible&&this.render()}mine(e){let t=0;for(const n of this.inv)n&&n.item===e&&(t+=n.count);return t}render(){const e=this.body.querySelector(".storage-list")?.scrollTop??0;this.tabs.innerHTML="";const t=[["stock","📦 창고"],["build","🏗️ 건물"]];for(const[i,r]of t){const o=document.createElement("button");o.className="bag-tab"+(this.tab===i?" on":""),o.textContent=r,o.addEventListener("click",()=>{this.tab=i,this.render()}),this.tabs.appendChild(o)}this.title.textContent=`🏘️ 마을 레벨 ${this.level} · 건물 ${this.built.size}개 · 도감 ${this.codexCount}종`,this.body.innerHTML="",this.tab==="stock"?this.renderStock():this.renderBuild();const n=this.body.querySelector(".storage-list");n&&e>0&&(n.scrollTop=e)}btn(e,t,n,i=!1){const r=document.createElement("button");return r.className=t,r.textContent=e,r.disabled=i,r.addEventListener("click",n),r}renderStock(){const e=document.createElement("p");e.className="bag-tip",e.textContent="마을 모두가 같이 쓰는 창고예요. 넣은 재료로 건물을 지어요. 누가 얼마나 넣었는지는 세지 않아요.",this.body.appendChild(e);const t=new Set([...this.stock.keys()]);for(const r of this.inv)r&&t.add(r.item);const n=document.createElement("div");n.className="storage-list";const i=[...t].sort((r,o)=>(this.stock.get(o)??0)-(this.stock.get(r)??0)||r.localeCompare(o));for(const r of i){const o=this.stock.get(r)??0,a=this.mine(r),c=document.createElement("div");c.className="storage-row";const h=this.deps.icon(r,28);h&&c.appendChild(h);const u=document.createElement("div");u.className="storage-text",u.innerHTML=`<b>${this.deps.nameOf(r)}</b><br><span class="storage-sub">창고 ${o} · 내 가방 ${a}</span>`,c.appendChild(u);const l=document.createElement("div");l.className="storage-acts",a>=1&&l.append(this.btn("넣기 1","plain-btn small",()=>this.deps.onMove(r,1,"in"))),a>16&&l.append(this.btn("넣기 16","plain-btn small",()=>this.deps.onMove(r,16,"in"))),a>=2&&l.append(this.btn(`전부 넣기 ${a}`,"plain-btn small",()=>this.deps.onMove(r,Math.min(a,999),"in"))),o>=1&&l.append(this.btn("꺼내기 1","plain-btn small",()=>this.deps.onMove(r,1,"out"))),o>16&&l.append(this.btn("꺼내기 16","plain-btn small",()=>this.deps.onMove(r,16,"out"))),o>=2&&l.append(this.btn(o>999?"꺼내기 999":`전부 꺼내기 ${o}`,"plain-btn small",()=>this.deps.onMove(r,Math.min(o,999),"out"))),c.appendChild(l),n.appendChild(c)}i.length===0&&(n.textContent="창고도 가방도 비어 있어요. 원정에서 모아 와요!"),this.body.appendChild(n)}renderBuild(){const e=document.createElement("div");e.className="storage-list";const t=[...this.deps.buildings.list].sort((r,o)=>r.level-o.level),n=r=>this.built.has(r)||Tu.includes(r)||r==="dragon_nest_1"||r===Cu;for(const r of t){const o=Ys(r.id);if(!o)continue;const a=n(r.id),c=document.createElement("div");c.className="storage-row"+(a?" built":"");const h=document.createElement("div");h.className="storage-text";const u=Object.entries(r.cost).map(([A,g])=>`${this.deps.nameOf(A)} ${Math.min(this.stock.get(A)??0,g)}/${g}`).join(" · "),l=wu(this.stock,r.cost),d=r.requires&&!n(r.requires)?this.deps.buildings.find(r.requires)?.name:null;let f;if(a?f="✅ 지어졌어요":this.level<r.level?f=`마을 레벨 ${r.level} 필요 (지금 ${this.level})`:d?f=`${d}를 먼저 지어요`:Object.keys(l).length?f=`모자라요: ${Object.entries(l).map(([A,g])=>`${this.deps.nameOf(A)} ${g}`).join(", ")}`:f="지을 수 있어요!",h.innerHTML=`<b>${r.name}</b> <span class="craft-station">레벨 ${r.level}</span><br><span class="storage-sub">${u||"비용 없음"}</span><br><span class="storage-sub">${f}</span>`,c.appendChild(h),!a&&o){const A=this.level>=r.level&&!d&&Object.keys(l).length===0;c.appendChild(this.btn("짓기","big-btn small",()=>this.deps.onBuild(r.id),!A))}e.appendChild(c)}this.body.appendChild(e);const i=document.createElement("p");i.className="nest-note",i.textContent="건물은 광장 둘레 정해진 자리에 서고, 아무도 부술 수 없어요. 마을 레벨은 건물 수와 도감(처음 손에 넣은 블록 종류 10개마다)으로 올라가고, 광장 북쪽 깃대에 레벨만큼 깃발이 걸려요.",this.body.appendChild(i)}}const Vh=new Ul(.16,0),Kb=new Ht({color:14679984,transparent:!0,opacity:.95,blending:vs,depthWrite:!1}),Qb=new Ht({color:8388352,transparent:!0,opacity:.45,blending:vs,depthWrite:!1});class jb{group=new Dt;orbs=new Map;t=0;constructor(e){e.add(this.group)}get count(){return this.orbs.size}set(e){const t=new Set;for(const n of e)t.add(n.id),this.orbs.has(n.id)||this.add(n);for(const n of[...this.orbs.keys()])t.has(n)||this.remove(n)}add(e){if(this.orbs.has(e.id))return;const t=new Dt,n=new lt(Vh,Kb),i=new lt(Vh,Qb);i.scale.setScalar(1.8+Math.min(1.5,e.amount/40)),t.add(i,n),t.position.set(e.x,e.y+.3,e.z),this.group.add(t),this.orbs.set(e.id,{group:t,info:e,phase:e.id*.7%(Math.PI*2)})}remove(e){const t=this.orbs.get(e);t&&(this.group.remove(t.group),this.orbs.delete(e))}clear(){for(const e of[...this.orbs.keys()])this.remove(e)}update(e){this.t+=e;for(const t of this.orbs.values())t.group.rotation.y=this.t*2+t.phase,t.group.position.y=t.info.y+.3+.08*Math.sin(this.t*3+t.phase)}}const Jb=new Bn(.1,.1,.1),Zb=new Bn(.06,.06,.06);let Ri=625341585;function jt(){return Ri^=Ri<<13,Ri^=Ri>>>17,Ri^=Ri<<5,(Ri>>>0)/4294967296}function $b(s){if(!s)return 10395294;const e=s.getContext("2d");if(!e)return 10395294;const{width:t,height:n}=s,i=e.getImageData(0,0,t,n).data;let r=0,o=0,a=0,c=0;for(let h=0;h<i.length;h+=4)i[h+3]<128||(r+=i[h],o+=i[h+1],a+=i[h+2],c++);return c===0?10395294:Math.round(r/c)<<16|Math.round(o/c)<<8|Math.round(a/c)}class ey{group=new Dt;parts=[];materials=new Map;constructor(e){e.add(this.group)}material(e){let t=this.materials.get(e);return t||(t=new Ht({color:e}),this.materials.set(e,t)),t}add(e,t,n,i,r,o,a,c){const h=new lt(e,this.material(t));h.position.set(n,i,r),h.rotation.set(jt()*3,jt()*3,0),this.group.add(h),this.parts.push({mesh:h,vel:o,born:c,life:a}),this.parts.length>400&&this.drop(0)}burst(e,t,n,i,r=16,o=performance.now()){for(let a=0;a<r;a++){const c=e+.15+jt()*.7,h=t+.15+jt()*.7,u=n+.15+jt()*.7,l=new H((c-e-.5)*4+(jt()-.5)*1.5,2+jt()*2.5,(u-n-.5)*4+(jt()-.5)*1.5);this.add(Jb,i,c,h,u,l,.7+jt()*.4,o)}}crumb(e,t,n,i,r,o=performance.now()){const a=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]][i]??[0,1,0],c=e+.5+a[0]*.52+(a[0]?0:(jt()-.5)*.8),h=t+.5+a[1]*.52+(a[1]?0:(jt()-.5)*.8),u=n+.5+a[2]*.52+(a[2]?0:(jt()-.5)*.8),l=new H(a[0]*1.2+(jt()-.5),1.5+jt()+a[1]*1.2,a[2]*1.2+(jt()-.5));this.add(Zb,r,c,h,u,l,.45+jt()*.2,o)}drop(e){const t=this.parts[e];this.group.remove(t.mesh),this.parts.splice(e,1)}update(e,t=performance.now()){for(let n=this.parts.length-1;n>=0;n--){const i=this.parts[n],r=(t-i.born)/1e3;if(r>i.life){this.drop(n);continue}i.vel.y-=12*e,i.mesh.position.addScaledVector(i.vel,e),i.mesh.rotation.x+=e*4;const o=r>i.life-.2?Math.max(.1,(i.life-r)/.2):1;i.mesh.scale.setScalar(o)}}get count(){return this.parts.length}}const ty={shirt:3107450,skin:6130506,hair:2899499,pants:3814752,shoes:2433311},ny={zombie:ty,vindicator:{shirt:3096402,skin:10134441,hair:2763306,pants:1976886,shoes:1710618},pillager:{shirt:5916210,skin:10134441,hair:2763306,pants:3813156,shoes:1710618},evoker:{shirt:1842210,skin:10134441,hair:1118481,pants:1842210,shoes:1118481},skeleton:{shirt:14474460,skin:14211288,hair:12434877,pants:13619151,shoes:10395294},husk:{shirt:8022853,skin:11049570,hair:6181427,pants:6970428,shoes:4142628},enderman:{shirt:1315860,skin:1447446,hair:1052688,pants:1315860,shoes:921102,eyes:13855999},stray:{shirt:12175055,skin:13161434,hair:15660280,pants:11188418,shoes:9083042},zombified_piglin:{shirt:7047754,skin:15771808,hair:14254208,pants:4864890,shoes:3811882},wither_skeleton:{shirt:2500134,skin:2829099,hair:1842204,pants:2236962,shoes:1513239,eyes:9079434},villager:{shirt:7032618,skin:13214332,hair:4862752,pants:5915172,shoes:3811866,eyes:4029002},iron_golem:{shirt:13225935,skin:14081244,hair:12108984,pants:13225935,shoes:10134426,eyes:11546672}},iy=5025616,jd=2761504,Gh=new Set(["cow","pig","sheep","chicken","dog","horse"]),sy=3810116,ry=4860494,_l=16766287;function Fi(s){return"#"+s.toString(16).padStart(6,"0")}function oy(){const s=[],e=(i,r,o,a,c,h,u)=>{for(let l=o;l<=a;l++)for(let d=c;d<=h;d++)for(let f=i;f<=r;f++)s.push({x:f,y:l,z:d,c:Fi(u(f,l,d))})},t=(i,r,o)=>{const c=.9+((i*73856093^r*19349663^o*83492791)>>>0)%100/100*.1,h=Math.min(255,Math.round(226*c));return h<<16|h<<8|Math.min(255,h+6)},n=["                ","                ","                ","                ","    xx    xx    ","     xx  xx     ","                ","                ","                ","     xxxxxx     ","    xx    xx    ","                ","                ","                ","                ","                "];e(-8,7,9,24,-8,7,(i,r,o)=>o===-8&&n[24-r][i+8]==="x"?2105376:t(i,r,o));for(let i=0;i<9;i++){const r=-6+i%3*5,o=-6+Math.floor(i/3)*5,a=5+i*7%4;e(r,r+1,9-a,8,o,o+1,t)}return s}function ay(){const s=[],e=(t,n,i,r,o,a,c)=>{for(let h=i;h<=r;h++)for(let u=o;u<=a;u++)for(let l=t;l<=n;l++)s.push({x:l,y:h,z:u,c:Fi(c(l,h,u))})};e(-4,3,18,25,-4,3,(t,n,i)=>i===-4&&n===22&&(t===-3||t===-2||t===1||t===2)?16773792:5915152);for(let t=0;t<8;t++){const n=t/8*Math.PI*2,i=Math.round(Math.cos(n)*5),r=Math.round(Math.sin(n)*5),o=t%2===0?10:4;e(i-1,i,o,o+5,r-1,r,(a,c)=>c%3===0?16766287:15901210)}return s}function ly(){const s=[],e=(i,r,o,a,c,h,u)=>{for(let l=o;l<=a;l++)for(let d=c;d<=h;d++)for(let f=i;f<=r;f++)s.push({x:f,y:l,z:d,c:Fi(u(f,l,d))})},t=(i,r,o)=>{const c=.85+((i*73856093^r*19349663^o*83492791)>>>0)%100/100*.3,h=Math.min(255,Math.round(76*c)),u=Math.min(255,Math.round(175*c)),l=Math.min(255,Math.round(80*c));return h<<16|u<<8|l};for(const[i,r]of[[-4,-4],[0,-4],[-4,1],[0,1]])e(i,i+3,0,5,r,r+3,t);e(-2,1,6,17,-2,1,t);const n=["        ","        "," xx  xx "," xx  xx ","   xx   ","  xxxx  ","  x  x  ","  x  x  "];return e(-4,3,18,25,-4,3,(i,r,o)=>o===-4&&n[25-r][i+4]==="x"?1053712:t(i,r,o)),s}function cy(s=!1){const e=s?sy:jd,t=s?ry:3813162,n=[],i=(a,c,h,u)=>{const d=.85+((a*73856093^c*19349663^h*83492791)>>>0)%100/100*.3,f=Math.min(255,Math.round((u>>16&255)*d)),A=Math.min(255,Math.round((u>>8&255)*d)),g=Math.min(255,Math.round((u&255)*d));return f<<16|A<<8|g},r=(a,c,h,u,l,d,f)=>{for(let A=h;A<=u;A++)for(let g=l;g<=d;g++)for(let p=a;p<=c;p++)n.push({x:p,y:A,z:g,c:Fi(f(p,A,g))})};r(-5,4,5,12,1,12,(a,c,h)=>i(a,c,h,t)),r(-3,2,6,11,-5,0,(a,c,h)=>i(a,c,h,e));const o=["        "," r    r ","r r  r r"," r    r ","  r  r  ","        ","        ","        "];if(r(-4,3,5,12,-11,-6,(a,c,h)=>h===-11&&o[12-c][a+4]==="r"?s?16724016:13639712:i(a,c,h,e)),s){const a={g:4444474,c:2745343,b:1981695,r:15022389},c={13:{[-4]:"b",0:"r",3:"b"},14:{[-3]:"g",0:"c"},15:{3:"g"}},h=(l,d,f)=>f===-11?c[d]?.[l]:void 0;for(let l=-11;l<=-6;l++)for(let d=-4;d<=3;d++){if(!(l===-11||l===-6||d===-4||d===3))continue;const A=h(d,13,l);n.push({x:d,y:13,z:l,c:Fi(A?a[A]:_l)})}const u=[[-4,-3,15],[-1,0,15],[2,3,16]];for(const[l,d,f]of u)for(let A=l;A<=d;A++)for(let g=14;g<=f;g++)for(let p=-11;p<=-10;p++){const m=h(A,g,p);n.push({x:A,y:g,z:p,c:Fi(m?a[m]:_l)})}}return n}function hy(){const s=[];for(let e=0;e<14;e++)for(let t=0;t<2;t++)for(let n=0;n<2;n++)s.push({x:e,y:t,z:n,c:Fi(e>9?1709588:2367003)});return s}function wa(s,e,t,n){const i=document.createElement("canvas");i.width=s,i.height=e;const r=i.getContext("2d"),o=new So(i);o.minFilter=An;const a=new Ll(new Dl({map:o,depthTest:!0,transparent:!0}));return a.scale.set(t,n,1),{sprite:a,ctx:r,tex:o}}function Ta(s,e,t,n){const i=s.canvas.width,r=s.canvas.height;s.clearRect(0,0,i,r),s.fillStyle="rgba(0,0,0,0.6)",s.fillRect(0,6,i,r-12);const o=Math.max(0,Math.min(1,t/Math.max(1,n)));s.fillStyle=o>.5?"#e53935":o>.25?"#fb8c00":"#ffd600",s.fillRect(3,9,(i-6)*o,r-18),s.font="bold 15px system-ui, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillStyle="#fff",s.strokeStyle="rgba(0,0,0,0.8)",s.lineWidth=3,s.strokeText(`${t} / ${n}`,i/2,r/2),s.fillText(`${t} / ${n}`,i/2,r/2),e.needsUpdate=!0}function Mn(s,e){const t=Oi(s,bt,hr);return t.translate(bt/2,0,bt/2),new lt(t,e)}function to(s,e){const t=Oi(s.v,bt,hr);t.translate((.5-s.pivot[0])*bt,-s.pivot[1]*bt,(.5-s.pivot[2])*bt);const n=new lt(t,e);return n.position.set(s.pivot[0]*bt,s.pivot[1]*bt,s.pivot[2]*bt),n}const dy=new Bn(.16,.16,.16),uy=new Bn(.06,.06,.7),fy=new Ht({color:14272672});class py{group=new Dt;figures=new Map;bursts=[];pops=[];shots=[];constructor(e){e.add(this.group)}get count(){return this.figures.size}petNames=new Map;setPetNames(e){this.petNames.clear();for(const t of e)t.name&&this.petNames.set(t.id,t.name);for(const[t,n]of this.figures)this.applyName(t,n)}applyName(e,t){const n=this.petNames.get(e)??null;if(t.nameLabel&&t.nameLabel.text===n||(t.nameLabel&&(t.group.remove(t.nameLabel.sprite),t.nameLabel.sprite.material.map?.dispose(),t.nameLabel.sprite.material.dispose(),t.nameLabel=null),!n))return;const i=cr(`🐾 ${n}`,"rgba(60,30,10,0.55)",.4);i.position.set(0,Zt(t.kind).h+.55,0),t.group.add(i),t.nameLabel={sprite:i,text:n}}positionOf(e){const t=this.figures.get(e);return t?{x:t.cur.x,y:t.cur.y+Zt(t.kind).h*.5*(t.state&En.baby?.5:1),z:t.cur.z}:null}shot(e,t){const n=new lt(uy,fy),i=new H(e.x,e.y,e.z),r=new H(t.x,t.y,t.z);n.position.copy(i),n.lookAt(r),this.group.add(n),this.shots.push({mesh:n,from:i,to:r,born:-1})}figureOf(e){const t=this.figures.get(e);return t?{kind:t.kind,state:t.state}:void 0}make(e){const t=new Ht({vertexColors:!0}),n=new Dt,i=new Dt;let r=null,o=null,a=null,c=null;const h=[],u=[],l=[];let d=null,f=null,A=1;const g=Un[e.kind]??"zombie",p=ny[g];if(p){const v=$h(p),E=(b,I)=>(b.position.set(I[0]*bt,I[1]*bt,0),b),R=E(Mn(v.torso,t),[0,12]),x=E(Mn(v.head,t),[0,24]);a=E(Mn(v.leg,t),[-2,12]),c=E(Mn(v.leg,t),[2,12]),r=E(Mn(v.arm,t),[-6,24]),o=E(Mn(v.arm,t),[6,24]),g==="zombie"||g==="husk"||g==="zombified_piglin"?r.rotation.x=o.rotation.x=-Math.PI/2+.15:g==="evoker"&&(r.rotation.x=o.rotation.x=-Math.PI/2+.6),i.add(R,x,a,c,r,o)}else if(Un[e.kind]==="spider"||Un[e.kind]==="spider_king"){i.add(Mn(cy(Un[e.kind]==="spider_king"),t));const v=Oi(hy(),bt,hr);v.translate(0,-bt,-bt);for(let E=0;E<8;E++){const R=E>=4,x=E%4,b=new lt(v,t);b.position.set((R?3:-3)*bt,9*bt,(-4+x*3)*bt),b.rotation.set(0,(R?0:Math.PI)+(R?1:-1)*(.55-x*.37),R?-.75:.75),b.userData.baseY=b.rotation.y,h.push(b),i.add(b)}}else if(Gh.has(g)){const v=b_(g,m_(e.id),{sheared:(e.state&En.sheared)!==0});i.add(Mn(v.body,t)),d=to(v.head,t),i.add(d);for(const E of v.legs){const R=to(E,t);u.push(R),i.add(R)}v.tail&&(f=to(v.tail,t),i.add(f));for(const E of v.wings){const R=to(E,t);l.push(R),i.add(R)}A=v.babyHead}else if(g==="ender_dragon"){const v=Yd("ender","adult");v.scale.setScalar(2.5),i.add(v)}else g==="ghast"?i.add(Mn(oy(),t)):g==="blaze"?i.add(Mn(ay(),t)):i.add(Mn(ly(),t));n.add(i);const m=ro.get(g).hp,M=Un[e.kind]==="spider_king",S=M||g==="ender_dragon"||g==="ghast",y=M?2.2:1;i.scale.setScalar(y),g==="enderman"?i.scale.set(.8,1.5,.8):g==="wither_skeleton"?i.scale.set(1.1,1.3,1.1):g==="iron_golem"?i.scale.set(1.5,1.45,1.5):g==="ghast"&&i.scale.setScalar(4.4);const D=wa(128,28,S?2.2:1.1,S?.4:.24);return D.sprite.position.set(0,Zt(e.kind).h+(S?.7:.35),0),Ta(D.ctx,D.tex,e.hp,m),n.add(D.sprite),this.group.add(n),{group:n,body:i,material:t,kind:e.kind,cur:{x:e.x,y:e.y,z:e.z,yaw:e.yaw},target:{x:e.x,y:e.y,z:e.z,yaw:e.yaw},state:e.state,hp:e.hp,flashUntil:0,fuseT:0,armL:r,armR:o,legL:a,legR:c,spiderLegs:h,walk:0,bar:D,maxHp:m,shownHp:e.hp,baseScale:y,summonT:0,animal:Gh.has(g),collar:null,nextHeart:0,legs:u,head:d,tail:f,wings:l,babyHead:A,id:e.id,sheared:(e.state&En.sheared)!==0,nameLabel:null}}setState(e){const t=new Set;for(const n of e){t.add(n.id);let i=this.figures.get(n.id);if(i&&i.animal&&i.sheared!==((n.state&En.sheared)!==0)){const r=i.cur;this.remove(n.id),i=this.make(n),i.cur={...r},i.group.position.set(r.x,r.y,r.z),this.figures.set(n.id,i)}i||(i=this.make(n),i.group.position.set(n.x,n.y,n.z),this.figures.set(n.id,i)),i.animal&&(this.petNames.has(n.id)||i.nameLabel)&&this.applyName(n.id,i),i.target={x:n.x,y:n.y,z:n.z,yaw:n.yaw},i.state=n.state,i.hp=n.hp,i.shownHp!==n.hp&&(i.shownHp=n.hp,Ta(i.bar.ctx,i.bar.tex,n.hp,i.maxHp)),i.animal&&(i.bar.sprite.visible=n.hp<i.maxHp,(n.state&En.tamed)!==0&&!i.collar&&(i.collar=Mn(M_(),new Ht({vertexColors:!0})),i.body.add(i.collar)))}for(const n of[...this.figures.keys()])t.has(n)||this.remove(n)}event(e,t,n,i,r,o=performance.now(),a){const c=this.figures.get(t);if(e==="hit")c&&(c.flashUntil=o+160,c.target={...c.target,x:n,y:i,z:r},c.hp>0&&a&&(c.hp=Math.max(0,c.hp-a),c.shownHp=c.hp,Ta(c.bar.ctx,c.bar.tex,c.hp,c.maxHp))),a&&this.pop(n,i+Zt(c?.kind??0).h+.7,r,a,o);else if(e==="wake"&&c)c.flashUntil=o+400;else if(e==="love"||e==="tame"||e==="eat"||e==="grow"||e==="sit"||e==="shear"||e==="egg"||e==="milk")e==="eat"?this.popText(n,i+Zt(c?.kind??0).h+.5,r,"냠","#ffffff",o):e==="love"?this.popText(n,i+Zt(c?.kind??0).h+.5,r,"♥","#ff5c8a",o):e==="tame"?this.popText(n,i+Zt(c?.kind??0).h+.5,r,"♥♥","#ff5c8a",o):e==="grow"?this.popText(n,i+Zt(c?.kind??0).h+.5,r,"어른!","#ffeb3b",o):e==="shear"?this.popText(n,i+Zt(c?.kind??0).h+.5,r,"✂️","#ffffff",o):e==="egg"?this.popText(n,i+Zt(c?.kind??0).h+.5,r,"🥚","#ffffff",o):e==="milk"&&this.popText(n,i+Zt(c?.kind??0).h+.5,r,"🥛","#ffffff",o);else if(e==="summon"&&c)c.summonT=.8,this.burst(n,i+.6,r,11766015,16,o);else if(e==="die"||e==="explode"){const h=e==="explode"?16765562:c?c.kind===0?6130506:c.kind===2?jd:c.kind===3?_l:c.kind>=4?10134441:iy:16777215;this.burst(n,i+Zt(c?.kind??0).h*.5,r,h,e==="explode"?28:c?.kind===3?40:12,o),this.remove(t)}}animateAnimal(e,t,n,i){const r=Un[e.kind]??"cow",o=i/1e3+e.id%97*.37,a=(e.state&En.sitting)!==0,c=(e.state&En.baby)!==0,h=(e.state&En.tamed)!==0;if(e.legs.forEach((u,l)=>{let d=l===0||l===3?n:-n;a&&l>=2&&(d=-1.35),u.rotation.x=d}),e.head){let u=t?Math.sin(e.walk*2)*.06:0;if(!t&&!a&&r!=="dog"){const l=o%7;l<1.8&&(u-=(r==="chicken"?.5:.75)*Math.sin(l/1.8*Math.PI))}e.head.rotation.x=u,e.head.scale.setScalar(c?e.babyHead:1)}e.tail&&(r==="dog"?(e.tail.rotation.x=a?-.35:h?-2.2:-.9,e.tail.rotation.z=h||t?Math.sin(o*9)*.45:0):(e.tail.rotation.x=.15,e.tail.rotation.z=Math.sin(o*2.2)*.25)),e.wings.forEach((u,l)=>{u.rotation.z=(l===0?-1:1)*(t?Math.abs(Math.sin(e.walk*3))*.9:0)}),e.body.position.y=a?-.14:0}popText(e,t,n,i,r,o){const a=wa(96,48,.9,.45);a.ctx.font="bold 30px system-ui, sans-serif",a.ctx.textAlign="center",a.ctx.textBaseline="middle",a.ctx.strokeStyle="rgba(0,0,0,0.85)",a.ctx.lineWidth=6,a.ctx.fillStyle=r,a.ctx.strokeText(i,48,26),a.ctx.fillText(i,48,26),a.tex.needsUpdate=!0,a.sprite.position.set(e,t,n),this.group.add(a.sprite),this.pops.push({sprite:a.sprite,born:o})}pop(e,t,n,i,r){const o=wa(96,48,.9,.45);o.ctx.font="bold 34px system-ui, sans-serif",o.ctx.textAlign="center",o.ctx.textBaseline="middle",o.ctx.strokeStyle="rgba(0,0,0,0.85)",o.ctx.lineWidth=6,o.ctx.fillStyle="#ffeb3b",o.ctx.strokeText(`-${i}`,48,26),o.ctx.fillText(`-${i}`,48,26),o.tex.needsUpdate=!0,o.sprite.position.set(e,t,n),this.group.add(o.sprite),this.pops.push({sprite:o.sprite,born:r})}burst(e,t,n,i,r,o){const a=new Dt,c=new Ht({color:i,transparent:!0,opacity:.95}),h=[];for(let u=0;u<r;u++){const l=new lt(dy,c),d=u/r*Math.PI*2,f=u*7%r/r-.5,A=new H(Math.cos(d)*(2+f),2.5+f*2,Math.sin(d)*(2+f));l.position.set(e,t,n),h.push({m:l,v:A}),a.add(l)}this.group.add(a),this.bursts.push({group:a,born:o,parts:h})}remove(e){const t=this.figures.get(e);t&&(this.group.remove(t.group),t.material.dispose(),t.bar.tex.dispose(),t.bar.sprite.material.dispose(),t.group.traverse(n=>{n instanceof lt&&n.geometry.dispose()}),this.figures.delete(e))}clear(){for(const e of[...this.figures.keys()])this.remove(e);for(const e of this.bursts)this.group.remove(e.group);this.bursts.length=0;for(const e of this.pops)this.group.remove(e.sprite);this.pops.length=0}nearestInCone(e,t,n,i,r){let o=null,a=n;for(const[c,h]of this.figures){if(r&&c>=qs)continue;const u=h.cur,l=Zt(h.kind),d=u.x-e.x,f=u.y+l.h*.5-e.y,A=u.z-e.z,g=Math.hypot(d,f,A);g<=1e-6||g-l.w*.5>a||(d*t.x+f*t.y+A*t.z)/g<i||(a=Math.max(0,g-l.w*.5),o=c)}return o}moveFigure(e,t,n,i,r){const o=this.figures.get(e);o&&(o.target={x:t,y:n,z:i,yaw:r})}aim(e,t,n){let i=null,r=n;for(const[o,a]of this.figures){const c=a.cur,h=Zt(a.kind),u=h.w/2,l=[c.x-u,c.y,c.z-u],d=[c.x+u,c.y+h.h,c.z+u],f=[e.x,e.y,e.z],A=[t.x,t.y,t.z];let g=0,p=r,m=!0;for(let M=0;M<3&&m;M++){if(Math.abs(A[M])<1e-9){(f[M]<l[M]||f[M]>d[M])&&(m=!1);continue}let S=(l[M]-f[M])/A[M],y=(d[M]-f[M])/A[M];S>y&&([S,y]=[y,S]),g=Math.max(g,S),p=Math.min(p,y),g>p&&(m=!1)}m&&g<r&&(r=g,i=o)}return i}update(e,t=performance.now()){const n=1-Math.exp(-e*12);for(const i of this.figures.values()){const r=i.cur,o=i.target,a=o.x-r.x,c=o.z-r.z;r.x+=a*n,r.y+=(o.y-r.y)*n,r.z+=c*n;let h=o.yaw-r.yaw;h=Math.atan2(Math.sin(h),Math.cos(h)),r.yaw+=h*n,i.group.position.set(r.x,r.y,r.z),i.body.rotation.y=r.yaw;const u=Math.hypot(a,c)*12;u>.3&&(i.walk+=e*Math.min(10,u*2));const l=u>.3?Math.sin(i.walk)*.5:0;if(i.legL&&i.legR&&(i.legL.rotation.x=l,i.legR.rotation.x=-l),i.spiderLegs.forEach((d,f)=>{const A=d.userData.baseY;d.rotation.y=A+(f%2===0?l:-l)*.5}),i.animal&&this.animateAnimal(i,u>.3,l,t),i.state===Jl.fuse){i.fuseT+=e;const d=1+.25*Math.min(1,i.fuseT/1.5)+.06*Math.sin(i.fuseT*30);i.body.scale.set(d,d,d),i.material.color.setRGB(1+i.fuseT,1+i.fuseT,1+i.fuseT)}else{i.fuseT=0;let d=i.baseScale;i.state===Jl.sleep&&(d*=.85),(i.animal||Un[i.kind]==="villager")&&(i.state&En.baby&&(d*=.5),i.state&En.love&&t>=i.nextHeart&&(i.nextHeart=t+900,this.popText(r.x,r.y+Zt(i.kind).h*d+.4,r.z,"♥","#ff5c8a",t))),i.summonT>0&&(i.summonT=Math.max(0,i.summonT-e),d*=1+.12*Math.sin(i.summonT/.8*Math.PI)),i.body.scale.set(d,d,d),i.material.color.setRGB(1,1,1)}t<i.flashUntil&&i.material.color.setRGB(2.2,.6,.6)}for(let i=this.bursts.length-1;i>=0;i--){const r=this.bursts[i],o=(t-r.born)/1e3;if(o>.9){this.group.remove(r.group),this.bursts.splice(i,1);continue}for(const a of r.parts)a.m.position.addScaledVector(a.v,e),a.v.y-=9.8*e;r.parts[0].m.material.opacity=Math.max(0,1-o/.9)}for(let i=this.shots.length-1;i>=0;i--){const r=this.shots[i];r.born<0&&(r.born=t);const o=(t-r.born)/250;if(o>=1){this.group.remove(r.mesh),this.shots.splice(i,1);continue}r.mesh.position.lerpVectors(r.from,r.to,o)}for(let i=this.pops.length-1;i>=0;i--){const r=this.pops[i],o=(t-r.born)/1e3;if(o>.8){this.group.remove(r.sprite),r.sprite.material.map?.dispose(),r.sprite.material.dispose(),this.pops.splice(i,1);continue}r.sprite.position.y+=e*.9,r.sprite.material.opacity=o<.5?1:1-(o-.5)/.3}}}const Hh=new WeakMap;function Wh(s){let e=Hh.get(s);return e||(e=document.createElement("canvas"),e.width=s.width,e.height=s.height,e.getContext("2d").putImageData(s,0,0),Hh.set(s,e)),e}function my(s,e,t=40){const n=Math.min(2,window.devicePixelRatio||1),i=document.createElement("canvas");i.width=i.height=Math.round(t*n),i.style.width=i.style.height=`${t}px`;const r=i.getContext("2d");r.imageSmoothingEnabled=!1;const o=t*n/32,a=Wh(s),c=Wh(e),h=u=>{r.globalCompositeOperation="source-atop",r.fillStyle=`rgba(0,0,0,${u})`,r.fillRect(0,0,16,16),r.globalCompositeOperation="source-over"};return r.setTransform(o,.5*o,-o,.5*o,16*o,0),r.drawImage(a,0,0,16,16),r.setTransform(o,.5*o,0,o,0,8*o),r.drawImage(c,0,0,16,16),h(.22),r.setTransform(o,-.5*o,0,o,16*o,16*o),r.drawImage(c,0,0,16,16),h(.42),r.setTransform(1,0,0,1,0,0),i}const Xh=new Map;function gy(s){let e=0;for(let t=0;t<s.length;t++)e=e*31+s.charCodeAt(t)>>>0;return e%360}const Yh={wooden:"#a0703a",stone:"#8a8a8a",iron:"#d8d8d8",golden:"#f2c94c",gold:"#f2c94c",diamond:"#5fd8e8",netherite:"#4a3f4a",leather:"#8a5a3c",turtle:"#4f8a3a"},Ay=[".............bb.","............bbo.","...........bbo..","..........bbo...",".........bbo....","........bbo.....",".......bbo......","......bbo.......","..g..bbo........","..gg.bo.........","...ggo..........","..hggg..........",".hh.ggg.........","hh..............","kh..............","................"];function tr(s,e){const t=parseInt(s.slice(1),16),n=i=>Math.max(0,Math.min(255,Math.round(i*e)));return`#${(n(t>>16)<<16|n(t>>8&255)<<8|n(t&255)).toString(16).padStart(6,"0")}`}const vy=["................","................",".....llllll.....","....lmmmmmml....","...lmmmmmmmml...","...mmmmmmmmmm...","...mmmmmmmmmm...","...MmmmmmmmmM...","...MM......MM...","...MM......MM...","...MMM....MMM...","................","................","................","................","................"],_y=["................","..lll......lll..","..lmml....lmml..","..lmmm....mmml..","..mmmmmmmmmmmm..","..mmmmmmmmmmmm..","..MmmmmmmmmmmM..","...mmmmmmmmmm...","...mmmmmmmmmm...","...mmmmmmmmmm...","...MmmmmmmmmM...","...MMmmmmmmMM...","...MMMMMMMMMM...","................","................","................"],xy=["................","...llllllllll...","...mmmmmmmmmm...","...mmmmmmmmmm...","...mmmm..mmmm...","...mmmm..mmmm...","...mmm....mmm...","...mmm....mmm...","...mmm....mmm...","...MmM....MmM...","...MmM....MmM...","...MMM....MMM...","................","................","................","................"],by=["................","................","................","................","...lll....lll...","...mmm....mmm...","...mmm....mmm...","...mmm....mmm...","...mmmm...mmmm..","..mmmmm..mmmmm..","..MMMMM..MMMMM..","................","................","................","................","................"],yy=["....iiiiiiii....","...iwwwwwwwwi...","...iwwwWWwwwi...","...iwwWiiWwwi...","...iwwWiiWwwi...","...iwwwWWwwwi...","...iwwwwwwwwi...","...iwwwwwwwwi...","....iwwwwwwi....","....iwwwwwwi....",".....iwwwwi.....","......iwwi......",".......ii.......","................","................","................"],My=["........HHHHH...","......HHhhhhhH..",".....Hhh.....h..","....Hh......s...","...Hg......s....","..Hg......s.....",".Hg......s......",".Hh.....s.......","Hh.....s........","Hh....s.........","Hh...s..........","Hh..s...........","Hh.s............",".Hh.............","..H.............","................"],Ey=[".......Hhh......","........s.hhh...",".........s...h..","..........s..h..","..........ii..h.","..........wws.h.",".........wW..s.H","........wW....sH",".......wW......H","......wW........",".....wW.........","....wW..........","...wW...........","..wW............",".wW.............","................"],Sy=[".............ii.","............iii.","...........iii..","..........iii...",".........iii....","........iii.....",".......iii......","......iii.......",".....iki........","....hh.hh.......","...hh...hh......","..hh.....hh.....",".hh.......hh....","hh.........hh...","................","................"],wy=[".............Ff.","............FffF","...........hffF.","..........hFF...",".........h......","........h.......",".......h........","......h.........",".....h..........","....h...........","..Eeh...........",".EeeE...........","Eee.E...........","eE..............","................","................"];function us(s,e,t,n){for(let i=0;i<16;i++)for(let r=0;r<16;r++){const o=e[i][r];o!=="."&&(s.fillStyle=n[o]??"#ff00ff",s.fillRect(r*t,i*t,t+.5,t+.5))}}function Ty(s){return{m:s,M:tr(s,.72),l:tr(s,1.22)}}function Cy(s,e,t){const n={b:tr(e,1.12),o:tr(e,.5),g:tr(e,.72),h:"#6b4a2b",k:"#3d2a17"};for(let i=0;i<16;i++)for(let r=0;r<16;r++){const o=Ay[i][r];o!=="."&&(s.fillStyle=n[o]??e,s.fillRect(r*t,i*t,t+.5,t+.5))}}function no(s){for(const e of Object.keys(Yh))if(s.startsWith(e+"_")||s===e)return Yh[e];return"#b0b0b0"}function io(s,e,t,n,i,r){r=Math.min(r,n/2,i/2),s.beginPath(),s.moveTo(e+r,t),s.lineTo(e+n-r,t),s.quadraticCurveTo(e+n,t,e+n,t+r),s.lineTo(e+n,t+i-r),s.quadraticCurveTo(e+n,t+i,e+n-r,t+i),s.lineTo(e+r,t+i),s.quadraticCurveTo(e,t+i,e,t+i-r),s.lineTo(e,t+r),s.quadraticCurveTo(e,t,e+r,t),s.closePath()}function Ry(s,e,t,n){const i=n/16;s.lineWidth=Math.max(1,i*.8),s.strokeStyle="rgba(0,0,0,0.55)";const r=e==="water_bottle"||e==="glass_bottle"||e.startsWith("potion.")||e.startsWith("splash_potion.")||e.startsWith("lingering_potion."),o=/_(pickaxe|axe|sword|shovel|hoe)$/.test(e),a=e==="bucket"||e.endsWith("_bucket"),c=e.endsWith("_dust")||e==="redstone"||e==="sugar"||e==="gunpowder"||e==="glowstone_dust",h=e.endsWith("_ingot")||e==="netherite"||e==="gold_nugget",u=e==="stick"||e==="blaze_rod"||e==="breeze_rod"||e==="bone",l=e==="string";if(e.endsWith("_sword")){Cy(s,no(e),i);return}const d=/_(helmet|chestplate|leggings|boots)$/.exec(e)?.[1];if(d){us(s,d==="helmet"?vy:d==="chestplate"?_y:d==="leggings"?xy:by,i,Ty(no(e)));return}if(e==="shield"){us(s,yy,i,{i:"#d8d8d8",w:"#a0703a",W:"#5a3a1b"});return}if(e==="bow"){us(s,My,i,{H:"#4a3118",h:"#8a5a2b",g:"#5e3d1d",s:"#e8e8e8"});return}if(e==="crossbow"){us(s,Ey,i,{H:"#4a3118",h:"#8a5a2b",s:"#e8e8e8",i:"#c8c8c8",w:"#a0703a",W:"#5a3a1b"});return}if(e==="shears"){us(s,Sy,i,{i:"#d8d8d8",k:"#555555",h:"#8a5a2b"});return}if(e==="egg"){s.fillStyle="#f3e7c9",s.beginPath(),s.ellipse(8*i,8.5*i,4.2*i,5.4*i,0,0,Math.PI*2),s.fill(),s.stroke(),s.fillStyle="rgba(255,255,255,0.6)",s.fillRect(6*i,5*i,i,2*i);return}if(e==="arrow"){us(s,wy,i,{f:"#cfcfcf",F:"#5c5c5c",h:"#8a5a2b",e:"#f2f2f2",E:"#9a9a9a"});return}const f=Ru(e);if(f){const A=Pn.find(f)?.color??"#9a9a9a";s.fillStyle=A,s.beginPath(),s.ellipse(8*i,9*i,4.6*i,6*i,0,0,Math.PI*2),s.fill(),s.stroke(),s.fillStyle="rgba(0,0,0,0.25)",s.beginPath(),s.ellipse(8*i,12*i,4*i,2.6*i,0,0,Math.PI),s.fill(),s.fillStyle="rgba(255,255,255,0.55)";for(const[g,p]of[[6.2,6.5],[9.5,8],[7,10.5]])s.fillRect(g*i,p*i,i,i);return}if(r){const A=e==="glass_bottle"?null:e==="water_bottle"?"#3d7be6":e.includes("healing")?"#e64a4a":e.includes("speed")?"#7fd3ff":e.includes("awkward")?"#6b6ba8":"#a24ae6";s.fillStyle="rgba(200,225,255,0.55)",io(s,4*i,6*i,8*i,9*i,3*i),s.fill(),s.stroke(),s.fillRect(6.5*i,2*i,3*i,4.5*i),s.strokeRect(6.5*i,2*i,3*i,4.5*i),s.fillStyle="#b07a3a",s.fillRect(6*i,1*i,4*i,1.6*i),A&&(s.fillStyle=A,io(s,5*i,9*i,6*i,5*i,2.4*i),s.fill());return}if(a){const A=e==="water_bucket"?["#2f5fd6","#4d86ff"]:e==="lava_bucket"?["#e0561a","#ffa030"]:e==="milk_bucket"?["#e8e8e8","#ffffff"]:null,g=(y,D,v,E,R)=>{s.fillStyle=R,s.fillRect(y*i,D*i,v*i,E*i)},p="#2a2a2a",m="#5c5c5c",M="#9a9a9a",S="#d9d9d9";g(6,1,4,1,p),g(5,2,1,1,p),g(10,2,1,1,p),g(4,3,1,1,p),g(11,3,1,1,p),g(3,4,10,1,p),g(2,5,12,1,p),g(3,5,10,1,A?A[0]:m),g(4,5,4,1,A?A[1]:M),g(2,6,12,4,p),g(3,6,10,4,M),g(3,6,2,4,S),g(11,6,1,4,m),g(3,10,10,3,p),g(4,10,8,3,M),g(4,10,2,3,S),g(10,10,1,3,m),g(4,13,8,1,p),g(5,13,6,1,m),g(5,14,6,1,p);return}if(o){const A=no(e);s.strokeStyle="#8a5a2b",s.lineWidth=2*i,s.beginPath(),s.moveTo(3*i,13*i),s.lineTo(10.5*i,5.5*i),s.stroke(),s.fillStyle=A,s.strokeStyle="rgba(0,0,0,0.55)",s.lineWidth=Math.max(1,i*.8),e.endsWith("pickaxe")?(s.beginPath(),s.moveTo(6*i,2.5*i),s.quadraticCurveTo(11*i,1.5*i,14*i,6*i),s.lineTo(12*i,7.5*i),s.quadraticCurveTo(10.5*i,4.5*i,7*i,4.5*i),s.closePath()):e.endsWith("axe")?(s.beginPath(),s.moveTo(9*i,2*i),s.lineTo(14*i,4*i),s.lineTo(13*i,8*i),s.lineTo(9.5*i,6.5*i),s.closePath()):e.endsWith("sword")?(s.beginPath(),s.moveTo(9*i,7*i),s.lineTo(13.5*i,2.5*i),s.lineTo(15*i,4*i),s.lineTo(10.5*i,8.5*i),s.closePath()):e.endsWith("shovel")?io(s,9.5*i,1.5*i,5*i,6*i,2*i):(s.beginPath(),s.moveTo(9*i,3*i),s.lineTo(14.5*i,3*i),s.lineTo(14.5*i,5.5*i),s.lineTo(11*i,5.5*i),s.closePath()),s.fill(),s.stroke();return}if(c){const A=e==="glowstone_dust"?"#ffd75e":e==="redstone"?"#e03030":e==="sugar"?"#f4f4f4":e==="gunpowder"?"#666":"#c8c8c8";s.fillStyle=A;const g=[[8,11,4.5],[5,12.5,3],[11.5,12.5,3],[7,8,2],[10.5,8.5,1.6],[8.5,5.5,1.2]];for(const[p,m,M]of g)s.beginPath(),s.arc(p*i,m*i,M*i,0,Math.PI*2),s.fill();return}if(h){s.fillStyle=no(e.replace("_ingot","").replace("gold_nugget","gold")),s.beginPath(),s.moveTo(2*i,11*i),s.lineTo(5*i,6*i),s.lineTo(14*i,6*i),s.lineTo(11*i,11*i),s.closePath(),s.fill(),s.stroke(),s.fillStyle="rgba(0,0,0,0.18)",s.fillRect(2*i,11*i,9*i,2*i);return}if(u){s.strokeStyle=e==="blaze_rod"?"#ffb02e":e==="bone"?"#eee":e==="breeze_rod"?"#9fd7ff":"#8a5a2b",s.lineWidth=2.2*i,s.beginPath(),s.moveTo(4*i,12.5*i),s.lineTo(12*i,3.5*i),s.stroke();return}if(l){s.strokeStyle="#f0f0f0",s.lineWidth=1.4*i,s.beginPath(),s.moveTo(3*i,4*i),s.bezierCurveTo(12*i,2*i,2*i,12*i,13*i,12*i),s.stroke();return}s.fillStyle=`hsl(${gy(e)} 45% 38%)`,io(s,2*i,2*i,12*i,12*i,3*i),s.fill(),s.strokeStyle="rgba(255,255,255,0.35)",s.stroke(),s.fillStyle="#fff",s.font=`bold ${Math.round(n*.34)}px system-ui, sans-serif`,s.textAlign="center",s.textBaseline="middle",s.fillText(Array.from(t.replace(/\s/g,"")).slice(0,2).join(""),n/2,n/2)}function Dy(s,e,t,n,i){const r=`${s}@${e}`,o=Xh.get(r);if(o)return qh(o);const a=t.find(s);let c;if(a&&a.textures){const h=n.images.get("missing");c=my(n.images.get(a.textures[0])??h,n.images.get(a.textures[1])??h,e)}else{const h=Math.min(3,window.devicePixelRatio||1);c=document.createElement("canvas"),c.width=c.height=Math.round(e*h),c.style.width=c.style.height=`${e}px`;const u=c.getContext("2d");Ry(u,s,i,e*h)}return Xh.set(r,c),qh(c)}function qh(s){const e=document.createElement("canvas");return e.width=s.width,e.height=s.height,e.style.width=s.style.width,e.style.height=s.style.height,e.getContext("2d").drawImage(s,0,0),e}class Ol{workers=[];busy=[];pending=new Map;nextJob=1;constructor(e,t=Ol.defaultCount()){for(let n=0;n<t;n++){const i=new Worker(new URL("/DragonVillage/assets/mesher.worker-Bfo9gVUk.js",import.meta.url),{type:"module",name:`mesher-${n}`});i.onmessage=o=>this.onMessage(o.data),i.onerror=o=>console.error("메싱 워커 오류",o);const r={type:"init",blockInfo:e};i.postMessage(r),this.workers.push(i),this.busy.push(0)}}static defaultCount(){const e=typeof navigator<"u"&&navigator.hardwareConcurrency||2;return Math.max(1,Math.min(4,e-1))}get size(){return this.workers.length}get inflight(){return this.pending.size}mesh(e,t,n,i,r){let o=0;for(let c=1;c<this.busy.length;c++)this.busy[c]<this.busy[o]&&(o=c);const a=this.nextJob++;return this.busy[o]++,new Promise((c,h)=>{this.pending.set(a,{resolve:c,reject:h,worker:o});const u={type:"mesh",jobId:a,cx:e,cy:t,cz:n,padded:i,light:r};this.workers[o].postMessage(u,[i.buffer,r.buffer])})}onMessage(e){const t=this.pending.get(e.jobId);t&&(this.pending.delete(e.jobId),this.busy[t.worker]--,t.resolve(e))}dispose(){for(const e of this.workers)e.terminate();this.workers.length=0;for(const e of this.pending.values())e.reject(new Error("워커 풀 종료"));this.pending.clear()}}class Ly{constructor(e,t){this.renderer=e;const n=window.devicePixelRatio||1;this.maxPixelRatio=Math.min(n,t?1.5:2),this.pixelRatio=t?Math.min(n,1):this.maxPixelRatio,this.apply()}renderer;ema=16;pixelRatio;maxPixelRatio;minPixelRatio=.5;timer=0;goodStreak=0;onChange=null;apply(){this.renderer.setPixelRatio(this.pixelRatio),this.onChange?.(this.pixelRatio)}frame(e){this.ema=this.ema*.94+e*1e3*.06,this.timer+=e,!(this.timer<2)&&(this.timer=0,this.ema>36&&this.pixelRatio>this.minPixelRatio?(this.pixelRatio=Math.max(this.minPixelRatio,this.pixelRatio-.25),this.goodStreak=0,this.apply()):this.ema<14&&this.pixelRatio<this.maxPixelRatio?++this.goodStreak>=3&&(this.pixelRatio=Math.min(this.maxPixelRatio,this.pixelRatio+.25),this.goodStreak=0,this.apply()):this.goodStreak=0)}resize(){this.apply()}}const Iy=.8,Py=5,Kh=.3,Qh=.25;class Uy{constructor(e,t,n,i){this.world=e,this.registry=t,this.player=n,this.events=i}world;registry;player;events;target=null;progress=0;suppressPrimary=!1;suppressSecondary=!1;breakingKey=-1;burst=0;graceLeft=0;cooldown=0;placeTimer=0;swingTimer=0;selectedBlock=0;heldItem=null;hintTimer=0;getBlock=(e,t,n)=>this.world.getBlock(e,t,n);placeDoor(e,t,n,i,r){if(!this.world.inBounds(e,t+1,n)||this.world.getBlock(e,t+1,n)!==kn||Ns(this.player.pos,Nn,e,t,n)||Ns(this.player.pos,Nn,e,t+1,n))return;const o=this.player.lookDir,a=Zl(o.x,o.z),h=Du((A,g,p)=>{if(!this.world.inBounds(A,g,p))return!1;const m=this.registry.get(this.world.getBlock(A,g,p));return m.solid&&m.door===null},e,t,n,a),u=this.registry.doorVariant(i.num,a,!1,!1,h),l=this.registry.doorVariant(i.num,a,!0,!1,h),d=this.world.setBlock(e,t,n,u),f=this.world.setBlock(e,t+1,n,l);(d.changed||f.changed)&&(this.events.onBlocksChanged([...d.dirty,...f.dirty]),this.events.onPlaced?.(e,t,n,u,r),this.events.onSwing())}toggleDoor(e,t){const n=t.door,i=n.upper?e.y-1:e.y;if(n.open&&(Ns(this.player.pos,Nn,e.x,i,e.z)||Ns(this.player.pos,Nn,e.x,i+1,e.z)))return;const r=this.registry.doorVariant(n.base,n.facing,!1,!n.open,n.hinge),o=this.registry.doorVariant(n.base,n.facing,!0,!n.open,n.hinge),a=this.world.setBlock(e.x,i,e.z,r),c=this.world.setBlock(e.x,i+1,e.z,o);(a.changed||c.changed)&&(this.events.onBlocksChanged([...a.dirty,...c.dirty]),this.events.onPlaced?.(e.x,e.y,e.z,n.upper?o:r,e.id),this.events.onSwing())}targetable=e=>e!==kn&&(this.bucketMode||!this.registry.isFluid(e));hintKey=-1;swingBurst(e){this.burst=Math.max(this.burst,e)}get bucketMode(){return this.heldItem===ac?!0:this.selectedBlock>0&&this.registry.get(this.selectedBlock).fluid!==null}update(e,t){const n=this.player.eye,i=this.player.lookDir;if(this.target=Ef(this.getBlock,this.targetable,n.x,n.y,n.z,i.x,i.y,i.z,Py),this.cooldown=Math.max(0,this.cooldown-t),this.burst=Math.max(0,this.burst-t),this.suppressPrimary&&(this.breakingKey=-1,this.progress=0,this.burst=0),(e.primary||this.burst>0)&&this.target&&!this.suppressPrimary){const r=this.target,o=(r.x*1024+r.y)*1024+r.z|0;o!==this.breakingKey&&(this.breakingKey=o,this.progress=0),this.graceLeft=Iy,this.swingTimer-=t,this.swingTimer<=0&&(this.events.onSwing(),this.swingTimer=.25);const a=this.registry.get(r.id);if(a.fluid){this.progress=0;const c=a.fluidLevel===0?this.heldItem===ac:a.fluidVolume>0;if(!c&&this.hintKey!==o){this.hintKey=o;const h=a.fluid==="lava"?"용암":"물";this.events.onHint?.(a.fluidLevel!==0?`흐르는 ${h}은 못 떠요 — 고인 원천(평평한 곳)을 겨냥해요`:`빈 양동이를 들고 꾹 누르면 ${h}을 떠요`)}if(this.cooldown<=0&&c){const h=this.world.setBlock(r.x,r.y,r.z,kn);h.changed&&(this.events.onBlocksChanged(h.dirty),this.events.onBroken?.(r.x,r.y,r.z,r.id)),this.breakingKey=-1,this.cooldown=Kh}}else if(a.hardness===null)this.progress=0;else if(this.cooldown<=0){const c=Lu(a,ad(ld,this.heldItem));if(c===null){this.progress=0,this.hintTimer-=t,this.hintTimer<=0&&(this.events.onHint?.(Iu(a)),this.hintTimer=2);return}if(this.progress+=c<=0?1:t/c,this.progress>=1){const h=this.world.setBlock(r.x,r.y,r.z,kn);if(h.changed&&(this.events.onBlocksChanged(h.dirty),this.events.onBroken?.(r.x,r.y,r.z,r.id),a.door)){const u=this.world.setBlock(r.x,a.door.upper?r.y-1:r.y+1,r.z,kn);u.changed&&this.events.onBlocksChanged(u.dirty)}this.progress=0,this.breakingKey=-1,this.cooldown=Kh}}}else this.graceLeft>0&&this.progress>0?(this.graceLeft-=t,this.swingTimer=0):(this.progress=0,this.breakingKey=-1,this.swingTimer=0);this.suppressSecondary?this.placeTimer=0:e.secondaryTap?(this.place(),this.placeTimer=Qh):e.secondaryHold?(this.placeTimer-=t,this.placeTimer<=0&&(this.place(),this.placeTimer=Qh)):this.placeTimer=0}place(){const e=this.target;if(!e)return;const t=this.registry.get(e.id);if(t.door){this.toggleDoor(e,t);return}if(t.chest){this.events.onOpenChest?.(e.x,e.y,e.z),this.events.onSwing();return}if(this.selectedBlock<=0)return;const n=e.x+e.nx,i=e.y+e.ny,r=e.z+e.nz;if(!this.world.inBounds(n,i,r))return;const o=this.world.getBlock(n,i,r);if(o!==kn&&!this.registry.isFluid(o))return;const a=this.registry.get(this.selectedBlock);if(a.shape==="door"&&this.registry.isDoor(a.num)){this.placeDoor(n,i,r,a,o);return}if(a.torch){if(e.ny<0)return;const u=e.ny>0?-1:Zl(-e.nx,-e.nz),l=u<0?a.num:this.registry.torchVariant(a.num,u),d=this.world.setBlock(n,i,r,l);d.changed&&(this.events.onBlocksChanged(d.dirty),this.events.onPlaced?.(n,i,r,l,o),this.events.onSwing());return}if(a.solid&&Ns(this.player.pos,Nn,n,i,r))return;const c=a.fluid?this.registry.fluidFinite(a.fluidSource,Pu):this.selectedBlock,h=this.world.setBlock(n,i,r,c);h.changed&&(this.events.onBlocksChanged(h.dirty),this.events.onPlaced?.(n,i,r,c,o),this.events.onSwing())}}const Ny=500,Fy=50,By="grass_island";function ky(s){const e=s.charCodeAt(s.length-1)-44032;if(e<0||e>11171)return"로";const t=e%28;return t===0||t===8?"로":"으로"}const Oy=["북","북서","서","남서","남","남동","동","북동"];async function Yy(s,e){const{isTouch:t,net:n,welcome:i}=e,r=af,o=await Nb(),a=p_(r,o.index),c=i.playerIdx,h=new Jv({antialias:!1,alpha:!1,powerPreference:"high-performance",stencil:!1});h.domElement.className="game",h.domElement.tabIndex=0,h.autoClear=!1,h.setClearColor(xo,1),s.appendChild(h.domElement);const u=new Id,l=new Sn(70,1,.05,600);l.rotation.order="YXZ";const d=W_(o.texture),f=new Ol(a),A=t?5:8;(()=>{const _=A*It;d.setFog(_*.55,_*.98),l.far=_*1.3+50,l.updateProjectionMatrix()})();const p=new hx(u),m=new lx(u),M=new ix(d,a),S=new D_(u),y=new T_(u);y.sync(i.nestDragons);let D=i.nestDragons,v=i.spawn.riding??null,E=null;const R=["안녕! 오늘도 좋은 날이야","밀이 잘 자라고 있어","드래곤 봤어? 멋지더라","빵 있으면 하나만…","밤엔 집에 있는 게 좋아","포탈 너머는 무섭대"],x="dv.guide",b={1:"① 나침반의 금색 점을 따라 북쪽 포탈로 가요",2:'② 포탈 안에 서서 "원정 출발" 을 눌러요',3:"③ 블록을 꾹 눌러 모아요 · 6분 뒤엔 밤! 가운데 포탈로 돌아와요",4:"④ 나침반을 따라 광장 동쪽 창고로 — 모은 걸 넣고 🏗️ 탭에서 건물을 지어요",5:"⑤ 📜 조합법에서 드래곤 알을 만들고, 광장 남쪽 둥지에 놓아요",6:"⑥ 숲의 동물을 보면 안내가 떠요 — 밀·당근으로 먹이고, 강아지는 뼈로 길들여요"},I=Us(Ys("storage")),P=Us(Ys("dragon_nest_2"));let k=(()=>{try{const _=localStorage.getItem(x);if(_==="done")return 0;if(_)return Number(_)||0}catch{}return i.first?1:0})();const G=_=>{k=_;try{localStorage.setItem(x,_===0?"done":String(_))}catch{}T.setGuide(b[_]??null)},W=new Map,B=new Map,Y=()=>Qe.setPetNames([...[...W.entries()].map(([_,N])=>({id:_,name:N.name,mine:N.mine})),...[...B.entries()].map(([_,N])=>({id:_,name:N.name,mine:N.owner===c}))]);let O=null;const ie=new kb(s,rf.names,(_,N)=>n.sendNameMob(_,N),()=>{Fe&&!T.overlayVisible&&!T.resultVisible&&!Lt()&&Et()});let re=Ca(di,i.spawn.equip??null);const Ae=()=>{try{localStorage.setItem(`dv.equip:${i.spawn.nick}`,JSON.stringify(re))}catch{}};Ae();let Ve=!1,Me=0,Q=!1,De=0,q=!1,$=null,oe=0;const fe=new w_(u),he=new Yb(u),Ue=new jb(u),mt=new ey(u),U=new Map,ft=_=>{let N=U.get(_);return N===void 0&&(N=$b(ne(r.get(_).id,16)),U.set(_,N)),N};let We=0,Le=i.hp,ve=null;const Qe=new py(u);let Te=0,ze=null,yt=0;const Ct=()=>v&&v.dragon!=="horse"?_f(Pn.require(v.dragon)).stamina:0,L=()=>{if(!ze||!v)return;const _=Date.now()+yt,N=xf({value:ze.value,at:ze.at},ze.max,_);T.setStamina(N,ze.max,Ct(),Math.max(0,ze.readyAt-_)/1e3)},w=()=>{!v||v.dragon==="horse"||!Fe||C||n.sendSkill("beam")},T=new Vb(s,t),j=_=>_ in $l?$l[_]:nd(_)?lc.displayName(id(_)):hc(_,r,dc),ne=(_,N)=>Dy(_,N,r,o,j(_));S.iconOf=_=>ne(_,32);let J;const xe=Uu(i.inventory),de=()=>{const _=[];for(let N=0;N<fo;N++){const ee=xe[N];_.push(ee?{item:ee.item,count:ee.count,name:j(ee.item),icon:ne(ee.item,40)}:{item:null,count:0,name:"빈 칸",icon:null})}T.setSlots(_)};de();const Ie=()=>{const _=T.selectedItem;return _?cf(_,r)??0:0};let Se=i.expedition,se=i.village_state??{built:[],level:1,codex:0,codexIds:[],eggSlots:4},ye=null,Ge=null,Pe=null,ge=0;const Ye=()=>Oo.v1().filter(_=>Tf(_.generator)&&nf(_.unlockedBy,se.built));let F=new Set(se.codexIds);const ae=()=>{const _=Se?` · 원정 중: ${Se.name} ${Se.players}명`:"";T.setVillageInfo(`마을 "${i.village.name}" 레벨 ${se.level} · 코드 ${i.village.code} · 지금 ${S.count+1}명${_} (친구에게 코드를 알려 주면 같은 마을에 들어와요)`);const N=Se;pe.kind==="village"&&N&&N.players>0&&N.remainingSec>60?T.setFollow(`${N.name} 원정 중 · ${N.players}명 · 약 ${Math.max(1,Math.round(N.remainingSec/60))}분 남음`,()=>n.sendStartExpedition(N.id)):T.setFollow(null)};let ue=i.dragons,Ce=i.nest;const te=new Fb(s,{recipes:of,potions:lc,dragons:Pn,owned:()=>new Set(ue.filter(_=>_.stage!=="egg").map(_=>_.dragon)),codexBlocks:()=>F,codexCandidates:()=>r.defs.filter(_=>!_.internal&&_.id!=="air"&&_.textures).map(_=>[_.id,_.name]),icon:ne,nameOf:j,onMove:(_,N,ee)=>n.sendInvMove(_,N,ee),onDrop:(_,N)=>n.sendInvDrop(_,N),onCraft:_=>n.sendCraft(_),equipment:()=>re,equipSlotOf:_=>Nu(di,_),armorDefense:()=>ec(di,re).defense,onEquip:_=>n.sendEquip(_),onUnequip:_=>n.sendUnequip(_),onBrew:(_,N)=>{n.sendBrew(_,N),te.clearBrewSelection()},onClose:()=>kt()});te.setInventory(xe);const Z=new Wb(s,{dragons:Pn,xp:ko,nameOf:j,onPlace:(_,N)=>n.sendPlaceEgg(_,N),onHatch:_=>n.sendHatch(_),onFeed:(_,N)=>n.sendFeed(_,N),onRide:_=>{n.sendRide(_),zl()},onClose:()=>zl(),eggSlots:()=>se.eggSlots});Z.setInventory(xe),Z.setDragons(ue),Z.setNest(Ce,i.nestDragons),Z.setXp(i.xp);const Ee=new qb(s,{buildings:lf,icon:ne,nameOf:j,onMove:(_,N,ee)=>n.sendStorageMove(_,N,ee),onBuild:_=>n.sendBuild(_),onClose:()=>an()});Ee.setInventory(xe),Ee.setStorage(i.storage??[]),Ee.setVillage(se.built,se.level,se.codex);const He=new Ob(s,{icon:ne,nameOf:j,onMove:(_,N,ee)=>{const ce=He.position;ce&&n.sendChestMove(ce.x,ce.y,ce.z,_,N,ee)},onClose:()=>Jd()}),et=new Bb(s,cc,(_,N)=>n.sendEmote(_,N),()=>gr());let rt=0;const vn=()=>{const _={},N=pe.world,ee=pe.player.pos,ce=Math.floor(ee.x),me=Math.floor(ee.y+1),Ke=Math.floor(ee.z),st=new Map;for(const ot of["crafting_table","furnace","brewing_stand"]){const je=r.find(ot);je&&st.set(je.num,ot)}for(let ot=me-5;ot<=me+5&&st.size;ot++)for(let je=Ke-5;je<=Ke+5&&st.size;je++)for(let _n=ce-5;_n<=ce+5&&st.size;_n++){if(!N.inBounds(_n,ot,je))continue;const Ai=st.get(N.getBlock(_n,ot,je));Ai&&(_[Ai]=!0,st.delete(N.getBlock(_n,ot,je)))}const it=Ys("forge");if(pe.kind==="village"&&it&&se.built.includes("forge")){const ot=Us(it);Math.hypot(ee.x-ot.x,ee.z-ot.z)<=nc&&(_.forge=!0)}return _},gt=new s_,St=new r_(h.domElement);gt.add(St);const Rn=new d_(T.touchUI);gt.add(Rn),gt.add(new i_),gt.paused=!0;const rn=new Map;let mi=0;const Cs=(_,N,ee,ce,me)=>{mi=mi+1&65535,rn.set(mi,{x:_,y:N,z:ee,prev:me,id:ce}),n.sendBlockChange({seq:mi,x:_,y:N,z:ee,id:r.get(ce).id,slot:T.selectedIndex}),rn.size>200&&rn.delete(rn.keys().next().value)},zi=(_,N,ee)=>{for(const[ce,me]of rn)me.x===_&&me.y===N&&me.z===ee&&rn.delete(ce)};let pe;const gi=(_,N,ee,ce)=>{const me=_==="expedition"&&N?Cf(Oo.require(N.id),r,N.seed):Hu(r,i.village.seed),{world:Ke}=me;for(const Tt of ce)Ke.chunkInBounds(Tt.cx,Tt.cy,Tt.cz)&&fc(Tt.bytes,r,Ke.getOrCreateChunk(Tt.cx,Tt.cy,Tt.cz));const st=new wf(Ke,r);st.computeAll();const it=new X_(Ke,st,d,f,u);it.renderDistance=A,it.markAll();const ot=new V_(Ke,r,ee,ee.yaw);ot.pitch=ee.pitch,ot.riding=v!==null;const je=(Tt,Xe,ht,Yt)=>{const xn=r.find(Yt),vi=xn?xn.num:kn,Wi=Ke.setBlock(Tt,Xe,ht,vi);Wi.changed&&(it.markDirtyAll(Wi.dirty),st.markChanged(Tt,Xe,ht))},_n=new Uy(Ke,r,ot,{onBlocksChanged:Tt=>it.markDirtyAll(Tt),onSwing:()=>M.swing(),onPlaced:(Tt,Xe,ht,Yt,xn)=>{st.markChanged(Tt,Xe,ht),Cs(Tt,Xe,ht,Yt,xn)},onBroken:(Tt,Xe,ht,Yt)=>{st.markChanged(Tt,Xe,ht),Cs(Tt,Xe,ht,kn,Yt),mt.burst(Tt,Xe,ht,ft(Yt))},onHint:Tt=>T.toast(Tt,2e3),onOpenChest:(Tt,Xe,ht)=>{te.visible||Z.visible||et.visible||n.sendOpenChest(Tt,Xe,ht)}}),Ai="layout"in me?me.layout.portal:me.portal,Hi=new cx(u,Ai,_==="expedition"?4177148:9060348);return{kind:_,world:Ke,light:st,chunks:it,player:ot,interaction:_n,portal:Hi,portalPos:Ai,genMs:me.ms,expedition:N,localStart:N?performance.now()-(N.serverNow-N.startedAt):0,applyServerBlock:je}},Rs=(_,N,ee,ce)=>pe.applyServerBlock(_,N,ee,ce),Ds=_=>{_.chunks.dispose(),u.remove(_.chunks.group),_.portal.dispose()};let Vi=1;const mr=_=>{Math.abs(_-Vi)<.002||(Vi=_,d.setSkyLight(_),p.setBrightness(_),h.setClearColor(xo.clone().multiplyScalar(_),1))};pe=gi("village",null,{...i.spawn},i.chunks);for(const _ of i.players)S.upsert(_);ae();let Ls=!1,Is=!1;const To=_=>{E=null,Ds(pe),rn.clear(),B.clear(),pe=gi(_.kind,_.expedition,{..._.spawn},_.chunks);for(const N of S.indices())S.remove(N);for(const N of _.players)S.upsert(N);y.visible=_.kind==="village",Rn.clearHolds(),Ls=Is=!1,T.hideAction(),Ue.clear(),Qe.clear(),_.kind==="expedition"&&_.expedition?T.toast(`${_.expedition.name}에 도착했어요! 가운데 포탈로 돌아오면 모은 것을 가져가요`,5e3):(mr(1),T.setTimer(null,null),T.toast("마을로 돌아왔어요",3e3)),ae(),vr()},Co=_=>{const N=_.items.map(st=>({name:hc(st.id,r,dc),count:st.count,icon:ne(st.id,28)})),ee=_.items.reduce((st,it)=>st+it.count,0),ce=Math.floor(_.elapsedSec/60),me=_.elapsedSec%60,Ke=_.ending?`엔더 드래곤을 물리치고 다른 차원 포탈을 지났어요! 드래곤 알·숨결은 마을 창고에. ${ce}분 ${me}초, 모은 것 ${ee}개`:_.late?`시간이 다 되어 저절로 돌아왔어요. 절반만 가져왔어요 (${Math.round(_.keepRatio*100)}%)`:`${ce}분 ${me}초 만에 돌아왔어요. 모은 것 ${ee}개를 마을 창고에 넣었어요`;gt.paused=!0,St.enabled=!1,T.showResult(_.ending?"🏆 드래곤 크래프트 클리어! 🐲":`${_.name} 원정 끝!`,Ke,N,"한 번 더 갈까?",()=>{n.sendStartExpedition(_.expedition),Et()},()=>Et())};let C=!1,V=!1,X=i.xp;T.setXp(X);const K=(_,N,ee)=>{const ce=po(X).level;if(X=_,T.setXp(X),Z.setXp(X),N){const Ke=new H(N.x,N.y,N.z).project(l),st=h.domElement.clientWidth,it=h.domElement.clientHeight,ot=Ke.z<1&&Math.abs(Ke.x)<=1.1&&Math.abs(Ke.y)<=1.1,je=ot?(Ke.x+1)/2*st:st/2,_n=ot?(1-Ke.y)/2*it:it*.55;window.setTimeout(()=>{T.xpOrbs(je,_n,Math.min(10,3+Math.ceil(ee/2)),ee),qr()},350)}const me=po(X).level;if(me>ce){Kr();const Ke=Wu(ko,ce,me);T.toast(Ke.length?`레벨 ${me}! ${Ke.map(st=>Xu[st.id]??st.id).join("·")} 열렸어요`:`레벨 ${me}!`,4e3)}};let z=i.today;const le=_=>{const N=z;z=_,T.setToday(_),N&&_.bonusMin>N.bonusMin&&T.toast(`+${_.bonusMin-N.bonusMin}분! 할 일이 확인됐어요`,5e3),!(!_.enforced||!N)&&(N.remainingMin>5&&_.remainingMin<=5&&_.remainingMin>1?T.toast(`오늘 게임 시간이 ${_.remainingMin}분 남았어요`,6e3):N.remainingMin>1&&_.remainingMin===1&&T.toast("1분 남았어요 — 곧 마을에서 나가요. 내일 다시!",8e3),N.minutesUntilBlocked>5&&_.minutesUntilBlocked<=5&&_.minutesUntilBlocked>0&&T.toast(`${_.minutesUntilBlocked}분 뒤에 게임 시간이 끝나요`,6e3))};n.attach({onChunk:_=>{if(pe.world.chunkInBounds(_.cx,_.cy,_.cz)){fc(_.bytes,r,pe.world.getOrCreateChunk(_.cx,_.cy,_.cz)),pe.chunks.markDirty(_.cx,_.cy,_.cz);for(let N=0;N<It;N++)for(let ee=0;ee<It;ee++)for(let ce=0;ce<It;ce++)pe.light.markChanged(_.cx*16+ce,_.cy*16+N,_.cz*16+ee)}},onBlockChanged:_=>{zi(_.x,_.y,_.z),Rs(_.x,_.y,_.z,_.id)},onBlockBatch:_=>{for(const N of _.blocks)Rs(N.x,N.y,N.z,N.id)},onRejected:_=>{const N=rn.get(_.seq);if(rn.delete(_.seq),N){const ee=pe.world.setBlock(N.x,N.y,N.z,N.prev);ee.changed&&(pe.chunks.markDirtyAll(ee.dirty),pe.light.markChanged(N.x,N.y,N.z));const ce=r.get(N.prev).door,me=r.get(N.id).door??ce;if(me){const Ke=me.upper?N.y-1:N.y+1,st=ce?r.doorVariant(ce.base,ce.facing,!ce.upper,ce.open,ce.hinge):kn,it=pe.world.setBlock(N.x,Ke,N.z,st);it.changed&&(pe.chunks.markDirtyAll(it.dirty),pe.light.markChanged(N.x,Ke,N.z))}}T.toast(Bu[_.reason]??"서버가 거절했어요",2500)},onPlayers:_=>S.setState(_,c),onPlayerJoined:_=>{S.upsert(_),T.toast(pe.kind==="expedition"?`${_.nick} 님이 원정에 왔어요`:`${_.nick} 님이 들어왔어요`,3e3),ae()},onPlayerLeft:_=>{const N=S.nickOf(_);S.remove(_),N&&T.toast(pe.kind==="expedition"?`${N} 님이 마을로 갔어요`:`${N} 님이 나갔어요`,3e3),ae()},onError:(_,N)=>T.toast(N,4e3),onToday:_=>le(_),onDragons:_=>{const N=ue.filter(me=>me.stage!=="egg").length,ee=new Map(ue.map(me=>[me.id,me.stage]));if(ue=_,Z.setDragons(_),_.filter(me=>me.stage!=="egg").length>N){const me=_.filter(Ke=>Ke.stage!=="egg").at(-1);T.toast(`🐉 ${Pn.find(me.dragon)?.name??me.dragon}이 태어났어요! 도감에 등록됐어요`,6e3)}for(const me of _)me.stage==="adult"&&ee.get(me.id)==="baby"&&T.toast(`🐲 ${Pn.find(me.dragon)?.name??me.dragon}이 어른이 됐어요! 더 크고 무서워졌어요`,6e3)},onNest:(_,N)=>{Ce=_,D=N,Z.setNest(_,N),y.sync(N)},onChest:(_,N,ee,ce)=>{He.setInventory(xe),He.setChest(_,N,ee,ce),gt.paused=!0,St.enabled=!1,St.locked&&document.exitPointerLock()},onHeld:(_,N)=>{_!==c&&S.setHeld(_,N)},onEquip:_=>{if(_.idx!==c){S.setEquip(_.idx,_.parts);return}re=Ca(di,_.parts),Ae(),T.setArmor(_.defense),T.setGuardAvailable(re.shield!==null),te.refresh()},onArrow:_=>Qe.shot(_.from,_.to),onDragonHp:_=>T.setDragonHp(_.hp,_.max),onDragonDown:_=>{const N=Pn.find(_.dragon)?.name??_.dragon;T.toast(`😵 ${N}이(가) 쓰러졌어요 — 둥지에서 ${Math.round((_.restUntil-(Date.now()+yt))/6e4)}분 쉬면 다시 탈 수 있어요`,7e3),ch()},onPets:_=>{W.clear();for(const N of _)W.set(N.id,{name:N.name,mine:N.mine});Y()},onEnding:_=>{E=_,Kr()},onCompanions:_=>{const N=new Set;for(const ee of _)N.add(ee.id),!B.has(ee.id)&&ee.owner===c&&T.toast(`🐾 ${ee.name??"강아지"}이(가) 따라왔어요 — 가까운 몹을 물어요`,3e3),B.set(ee.id,{name:ee.name,owner:ee.owner});for(const ee of[...B.keys()])N.has(ee)||B.delete(ee);Y()},onGuard:_=>{_.idx!==c&&S.setGuarding(_.idx,_.on)},onShot:_=>{const N=Qe.positionOf(_.id);if(!N)return;const ee=pe.player,ce=_.idx===c?{x:ee.eye.x+ee.lookDir.x*.6,y:ee.eye.y-.25,z:ee.eye.z+ee.lookDir.z*.6}:_.from;Qe.shot(ce,N)},onRaid:_=>{if(ye=_,!_){T.hideRaid(),Pe=null;return}_.phase!==Pe&&(Pe=_.phase,_.phase==="warning"?t_():_.phase==="wave"?va():_.phase==="won"?Kr():_.phase==="lost"&&ch());const N=`${Math.floor(_.secLeft/60)}:${String(_.secLeft%60).padStart(2,"0")}`;_.phase==="warning"?T.setRaid(`🔔 우민이 온다! ${_.warnLeft}초 · 깃대를 지켜요`):_.phase==="wave"?T.setRaid(`⚔️ 파도 ${_.wave}/${_.waves} · 우민 ${_.remaining} · ${N}${_.capture>0?` · 🚩 깃대 ${_.capture}/${Fu}`:""}`,_.capture>0):_.phase==="won"?T.setRaid("🏆 마을을 지켰다!"):T.setRaid("💀 우민이 깃대를 차지했어요…",!0)},onMount:(_,N)=>{if(_!==c){S.setMount(_,N);return}if(v=N,pe.player.riding=!0,pe.player.horse=N.dragon==="horse",fe.set(N.dragon),T.hideAction(),N.dragon==="horse"){T.setRiding(!0,"빔",!1),ze=null,T.toast(`🐴 말을 탔어요! 앞으로 밀면 달려요 · ${t?"▲":"Space"} 점프 · 내리기는 🐉 버튼`,6e3);return}T.setRiding(!0,Pn.find(N.dragon)?.skills.find(ee=>ee.type==="beam")?.name??"빔"),ze={value:br("adult"),max:br("adult"),at:Date.now()+yt,readyAt:0},L(),T.toast(`🐉 ${Pn.find(N.dragon)?.name??N.dragon}을 탔어요! ${t?"▲ 위로 · ▼ 아래로":"Space 위로 · Shift 아래로"} · 내리기는 🐉 버튼`,6e3)},onDismount:_=>{if(_!==c){S.setMount(_,null);return}v=null,pe.player.riding=!1,pe.player.horse=!1,fe.set(null),T.setRiding(!1),ze=null,Rn.clearHolds()},onStorage:_=>{Ee.setStorage(_),!Ee.visible&&Mt&&(Mt=!1,Ee.show(),gt.paused=!0,St.enabled=!1,St.locked&&document.exitPointerLock())},onVillage:_=>{const N=se.level;se={...se,built:_.built,level:_.level,codex:_.codex,eggSlots:_.eggSlots},Ee.setVillage(_.built,_.level,_.codex),Z.setInventory(xe),ae(),_.level>N&&T.toast(`🏘️ 마을 레벨 ${_.level}! 광장 깃대에 깃발이 늘었어요`,5e3)},onCodex:_=>{F=new Set([...F,_.id]),te.setInventory(xe),T.toast(`📖 새로 발견! ${j(_.id)} — 마을 도감 ${_.total}종 (+${ko.ours.codexNewEntry})`,4500)},onHealth:_=>{_.hp<Le&&(T.hurtFlash(),$v(),_.cause==="poison"&&T.toast("🕷️ 독에 물렸어요 — 잠깐 아파요",1500)),_.cause==="blocked"&&T.toast("🛡️ 방패로 막았어요",1200),Le=_.hp,T.setHealth(_.hp,_.max)},onRespawn:_=>{const N=pe.player;N.pos.x=_.x,N.pos.y=_.y,N.pos.z=_.z,N.vel.x=N.vel.y=N.vel.z=0,vr(),T.toast(_.dropped>0?`💀 쓰러졌어요… 경험치 구슬 ${_.dropped}개가 그 자리에 남았어요. 가서 되찾아요!`:"💀 쓰러졌어요… 다시 일어났어요",6e3)},onMobs:_=>{Qe.setState(_);const N=_.find(ee=>tc.includes(Un[ee.kind]??"zombie"));ve=N?{x:N.x,z:N.z,hp:N.hp,kind:Un[N.kind]??"spider_king"}:null,N||T.hideBoss()},onMobEvent:_=>{Qe.event(_.ev,_.id,_.x,_.y,_.z,performance.now(),_.dmg),_.ev==="explode"?(T.hurtFlash(),n_()):_.ev==="die"?(qr(),tc.includes(_.mob)&&(T.hideBoss(),Kr())):_.ev==="hit"?e_():_.ev==="love"||_.ev==="tame"||_.ev==="grow"||_.ev==="milk"?qr():_.ev==="wake"?(va(),T.hurtFlash()):_.ev==="summon"&&va()},onOrbs:_=>Ue.set(_),onOrbGone:(_,N)=>{Ue.remove(_),N===c&&qr()},onBeam:_=>{he.fire(_.from,_.dir,_.color,_.power,_.range),Zv(_.power)},onStamina:_=>{yt=_.now-Date.now(),ze={value:_.value,max:_.max,at:_.now,readyAt:_.readyAt},L()},onXpGained:_=>K(X+_.amount,{x:_.x,y:_.y,z:_.z},_.amount),onXpState:_=>K(_.total,null,0),onTimeUp:(_,N)=>{V=!0,C=!0,gt.paused=!0,St.enabled=!1,T.hideToday(),T.hideAction(),T.showOverlay("오늘은 여기까지!",N+`
확인을 누르면 마을에서 나가요.`,"확인")},onApprovalAsk:_=>T.showApproval(_),onPending:_=>T.setPending(_),onClose:_=>{if(C=!0,gt.paused=!0,St.enabled=!1,V)return;if(/^[A-Z_]+$/.test(_)&&_!=="SERVER_SHUTDOWN"){T.showOverlay("서버와 연결이 끊어졌어요",_+`
다시 들어가려면 아래를 눌러요.`,"다시 연결");return}T.showOverlay("연결이 끊어졌어요","서버가 다시 보이면 저절로 이어요… (바로 하려면 아래를 눌러요)","다시 연결"),$d()},onWorldEnter:To,onExpeditionResult:_=>{Co(_),k===3&&(G(4),setTimeout(()=>T.toast("🎉 첫 원정 끝! 가져온 걸로 마을을 꾸며 봐요",6e3),1500))},onExpeditionState:_=>{const N=!!Se;Se=_,!N&&_&&pe.kind==="village"&&T.toast(`${_.name} 원정이 시작됐어요! 위의 🧭 따라가기를 누르면 바로 같이 가요`,5e3),ae()},onTimer:_=>{pe.expedition&&(pe.localStart=performance.now()-_.elapsedSec*1e3)},onInvSlots:_=>{for(const N of _.slots)N.slot>=0&&N.slot<xe.length&&(xe[N.slot]=N.count>0?{item:N.item,count:N.count}:null);de(),te.setInventory(xe),Z.setInventory(xe),He.setInventory(xe),Ee.setInventory(xe)},onEmote:_=>{const N=cc.text(_.kind,_.id);if(!N)return;const ee=_.idx===c?"나":S.nickOf(_.idx)??"누군가";et.add(ee,N),_.idx!==c?S.say(_.idx,N,_.kind===rd?2.5:3.5):T.toast(N,2500)}});const _e=new Ly(h,t);let Re=0,we=0;const ke=(_=!1)=>{const N=s.clientWidth||window.innerWidth,ee=s.clientHeight||window.innerHeight;N<=0||ee<=0||!_&&N===Re&&ee===we||(Re=N,we=ee,l.aspect=N/ee,l.updateProjectionMatrix(),h.setSize(N,ee,!1))};_e.onChange=()=>ke(!0),ke(!0);const Be=()=>ke();window.addEventListener("resize",Be),window.addEventListener("orientationchange",()=>setTimeout(Be,200)),document.addEventListener("fullscreenchange",()=>{Be(),setTimeout(Be,300)}),window.visualViewport?.addEventListener("resize",Be);const Ne=typeof ResizeObserver<"u"?new ResizeObserver(Be):null;Ne?.observe(s);let qe=!1;T.debugBtn.addEventListener("click",()=>qe=!qe);const ct=window.matchMedia("(display-mode: standalone), (display-mode: fullscreen)").matches||navigator.standalone===!0,vt=!!document.fullscreenEnabled&&typeof document.documentElement.requestFullscreen=="function",_t=`아이폰 사파리는 전체화면이 안 돼요.
아래 가운데 공유(⬆️) 버튼 → "홈 화면에 추가" → 홈 화면의 드래곤 크래프트 아이콘으로 열면 전체화면이 돼요.`,pt=()=>{ct?T.setFullscreen("hidden"):vt?T.setFullscreen(document.fullscreenElement?"on":"off"):T.setFullscreen("unavailable")};pt(),document.addEventListener("fullscreenchange",pt);async function Oe(){if(!vt)return!1;try{document.fullscreenElement||await document.documentElement.requestFullscreen({navigationUI:"hide"});const _=screen.orientation;return _.lock&&await _.lock("landscape").catch(()=>{}),!0}catch{return!1}}async function wt(){try{document.fullscreenElement&&await document.exitFullscreen()}catch{}}T.fullscreenBtn.addEventListener("click",()=>{if(!vt){T.toast(_t,7e3);return}document.fullscreenElement?wt():Oe().then(_=>{_||T.toast("전체화면을 켤 수 없었어요. 다시 한 번 눌러 보세요.",4e3)})});let Fe=!1,qt=!1;const si=()=>{gt.paused=!0,St.enabled=!1,T.showOverlay("잠깐 멈춤","ESC 로 나왔어요. 다시 들어가려면 아래를 눌러요.","계속하기")},Et=()=>{C||(T.hideOverlay(),gt.paused=!1,St.enabled=!0,h.domElement.focus(),t||St.requestLock().then(_=>{!_&&!qt&&(qt=!0,T.toast("이 브라우저는 마우스 잠금이 안 돼요. 마우스를 움직여 둘러보세요.",5e3))}))},Lt=()=>te.visible||et.visible||Z.visible||He.visible||Ee.visible||ie.visible;let Mt=!1;const on=()=>{Lt()||!Fe||C||(k===4&&G(5),Mt=!0,n.sendOpenStorage())},an=()=>{Ee.visible&&(Ee.hide(),Fe&&!T.overlayVisible&&!T.resultVisible&&!Lt()&&Et())},Vt=()=>{!Fe||C||T.resultVisible||(gt.paused=!0,St.enabled=!1,St.locked&&document.exitPointerLock(),te.setStations(vn()),te.setInventory(xe),te.show())},kt=()=>{te.visible&&(te.hide(),Fe&&!T.overlayVisible&&!T.resultVisible&&!Lt()&&Et())},Gi=()=>{!Fe||C||T.resultVisible||(gt.paused=!0,St.enabled=!1,St.locked&&document.exitPointerLock(),et.show())},Wn=(_,N)=>{!Fe||C||T.resultVisible||Lt()||(T.hideAction(),gt.paused=!0,St.enabled=!1,St.locked&&document.exitPointerLock(),ie.show(_,N))},Jd=()=>{He.visible&&(He.hide(),Fe&&!T.overlayVisible&&!T.resultVisible&&!Lt()&&Et())},gr=()=>{et.visible&&(et.hide(),Fe&&!T.overlayVisible&&!T.resultVisible&&!Lt()&&Et())},Zd=()=>{Lt()||(k===5&&G(6),Z.setXp(X),Z.setInventory(xe),Z.show(),gt.paused=!0,St.enabled=!1)},zl=()=>{Z.visible&&(Z.hide(),Fe&&!T.overlayVisible&&!T.resultVisible&&!Lt()&&Et())};T.bagBtn.addEventListener("click",()=>te.visible?kt():Vt()),T.rideBtn.addEventListener("click",()=>n.sendDismount()),T.skillBtn.addEventListener("click",w),T.setToday(i.today),T.setHealth(Le,20),T.setArmor(ec(di,re).defense),T.setGuide(b[k]??null),T.setGuardAvailable(re.shield!==null),pe.player.guardSlow=di.shield.guardSlow,v&&(pe.player.horse=v.dragon==="horse",fe.set(v.dragon),T.setRiding(!0,Pn.find(v.dragon)?.skills.find(_=>_.type==="beam")?.name??"빔"),ze={value:br("adult"),max:br("adult"),at:Date.now()+yt,readyAt:0},L()),T.onCheckTodo=_=>n.sendCheckTodo(_),T.onApprove=(_,N)=>n.sendApproveTodo(_.id,_.date,N),T.setPending(i.pending),i.pending.length&&T.toast(`승인 기다리는 할 일이 ${i.pending.length}개 있어요 — 위의 ✅ 를 눌러 보세요`,6e3),i.today&&T.toast(`오늘 남은 시간 ${i.today.remainingMin}분 · 할 일 ${i.today.todos.length}개 — 위의 ⏱ 를 누르면 보여요`,6e3),T.setFamily(i.family,i.parentOf),T.familyBtn.addEventListener("click",async()=>{const _=await ku(s,{title:"가족 연결",sub:"아빠·엄마 화면(/family)에 있는 가족 코드 6자리를 넣어요",pattern:/^\d{6}$/,invalid:"숫자 6자리예요",placeholder:"가족 코드 6자리",maxLength:6,okLabel:"다음"});if(!_)return;const N=await Ou(s,"내 PIN","내 계정이 맞는지 PIN 4자리로 확인해요","연결","취소");if(N)try{const ee=await n.linkFamily(_,N);T.setFamily(ee),T.toast("가족에 연결됐어요! 아빠·엄마 화면에 내 이름이 보여요",5e3)}catch(ee){T.toast(ee.message||"연결할 수 없어요",5e3)}}),T.chatBtn.addEventListener("click",()=>et.visible?gr():Gi()),window.addEventListener("keydown",_=>{!Fe||C||(_.code==="KeyE"?(te.visible?kt():!et.visible&&!T.overlayVisible&&!T.helpVisible&&!T.resultVisible&&Vt(),_.preventDefault()):_.code==="KeyF"&&v&&!Lt()&&!T.overlayVisible?(w(),_.preventDefault()):_.code==="KeyT"?(et.visible?gr():!te.visible&&!T.overlayVisible&&!T.helpVisible&&!T.resultVisible&&Gi(),_.preventDefault()):_.code==="Escape"&&(te.visible||et.visible)&&(kt(),gr()))});let Vl=!1;const $d=()=>{if(Vl)return;Vl=!0;let _=0;const N=async()=>{_++;try{if((await fetch("/health",{cache:"no-store"})).ok){try{sessionStorage.setItem("dv.autojoin","1")}catch{}window.location.reload();return}}catch{}setTimeout(N,Math.min(1e4,1500+_*500))};setTimeout(N,1500)};T.onOverlayClick=()=>{if(C){try{sessionStorage.setItem("dv.autojoin","1")}catch{}window.location.reload();return}Fe&&Et()},T.onHelpToggle=_=>{_?(gt.paused=!0,St.enabled=!1):Fe&&!T.overlayVisible&&!T.resultVisible&&!Lt()&&Et()},document.addEventListener("pointerlockchange",()=>{t||!Fe||St.lockFailed||C||!St.locked&&!T.overlayVisible&&!T.helpVisible&&!T.resultVisible&&!T.actionVisible&&!Lt()&&si()}),s.addEventListener("click",_=>{_.target?.closest(".action-card, .result-panel, .bag-panel, .chat-panel, .nest-panel, .side-btns")||Fe&&!t&&!St.locked&&!T.overlayVisible&&!T.resultVisible&&!Lt()&&Et()});let Ro=!1,Do=performance.now(),Lo=0,Ar=0,Gl=0,Io=0,Hl=0,Wl=0,Xl=0,Po=0;const eu=t?.6:1;function vr(){if(!n.connected)return;const _=pe.player,N=(_.sneaking?td:0)|(_.sprinting?zu:0)|(_.onGround?Vu:0)|(_.inWater?Gu:0)|(_.riding?ed:0);n.sendMove({x:_.pos.x,y:_.pos.y,z:_.pos.z,yaw:_.yaw,pitch:_.pitch,flags:N})}const Yl=()=>pe.expedition?(performance.now()-pe.localStart)/1e3:0,Xn=t?"":"  (Enter)",ql=_=>{_.code!=="Enter"&&_.code!=="NumpadEnter"||!Fe||!T.actionVisible||T.resultVisible||T.overlayVisible||T.helpVisible||(_.preventDefault(),T.triggerAction())};window.addEventListener("keydown",ql);const tu=()=>{const _=pe.player.eye,N=pe.player.lookDir;let ee=null,ce=5;for(const me of D){if(!me.mine)continue;const Ke=me.perch.x+.5-_.x,st=me.perch.y+.6-_.y,it=me.perch.z+.5-_.z,ot=Math.hypot(Ke,st,it);ot>ce||ot<.01||(Ke*N.x+st*N.y+it*N.z)/ot<.8||(ee=me,ce=ot)}return ee},nu=()=>xe.some(_=>_!==null&&_.item===od);let Uo=null;const iu=()=>{const _=pe.player.pos;if(O!==null&&W.get(O)?.mine&&!ie.visible){const ee=W.get(O),ce=O;T.showAction(`🐾 ${ee.name??"내 강아지"}`,ee.name?"빈손 탭 → 앉기/일어나기 · 이름을 바꿀 수도 있어요":"이름을 지어 줘요 (목록에서 골라요) · 빈손 탭 → 앉기/일어나기",(ee.name?"이름 바꾸기":"이름 짓기")+Xn,()=>Wn(ce,ee.name));return}if(!$u(pe.portalPos,_.x,_.y,_.z)){if(pe.kind==="village"&&!v){const ce=tu();if(ce||(Uo=null),ce&&ce.id!==Uo){const me=Pn.find(ce.dragon)?.name??ce.dragon,Ke=()=>{Uo=ce.id,T.hideAction()};ce.stage!=="adult"?T.showAction(`${me} (아기)`,"어른이 되면 탈 수 있어요 — 둥지 창에서 먹이를 주면 빨리 자라요","알겠어요",Ke):ce.restingUntil&&ce.restingUntil>Date.now()+yt?T.showAction(`${me} 쉬는 중`,`쓰러져서 ${Math.max(1,Math.ceil((ce.restingUntil-(Date.now()+yt))/6e4))}분 더 쉬어야 탈 수 있어요 · 둥지 창에서 먹이면 2분 빨라져요`,"알겠어요",Ke):nu()?T.showAction(`🐉 ${me} 타기`,t?"앞으로 밀면 보는 쪽으로 날아요 · ▲ 위로 · ▼ 아래로 · 🐉 버튼으로 내려요":"W 로 보는 쪽으로 날아요 · Space 위로 · Shift 아래로 · 🐉 버튼으로 내려요","타기"+Xn,()=>n.sendRide(ce.id)):T.showAction(`${me} 타기`,"안장이 있어야 해요 — 제작대: 가죽 5 + 철 2 (가죽은 원정 보물 상자)","알겠어요",Ke);return}}const ee=Ys("storage");if(pe.kind==="village"&&ee&&Math.hypot(_.x-Us(ee).x,_.z-Us(ee).z)<=nc){T.showAction("마을 창고",`마을 레벨 ${se.level} · 재료를 모아 건물을 지어요`,"창고 열기"+Xn,on);return}if(pe.kind==="village"&&ef(tf,_.x,_.y,_.z)){T.showAction("드래곤 둥지","알을 놓고, 레벨을 써서 부화시켜요","둥지 열기"+Xn,Zd);return}if(pe.kind==="village"&&!ye&&Math.hypot(_.x-(sc.x+.5),_.z-(sc.z+.5))<=4){const ce=rc(Math.ceil(_i.durationSec/60),xr);if(z?.enforced&&!oc(z,Math.ceil(_i.durationSec/60),xr)){T.showAction("오늘은 방어전은 쉬어요",`방어전은 ${ce}분 필요해요`,"알겠어요",()=>T.hideAction());return}se.level<_i.minVillageLevel?T.showAction("🔔 우민 방어전",`마을 레벨 ${_i.minVillageLevel}부터 우민이 쳐들어와요 (지금 ${se.level})`,"알겠어요",()=>T.hideAction()):T.showAction("🔔 우민 방어전",`${Math.round(_i.durationSec/60)}분 · 파도 ${_i.waves}번 · 우민이 북쪽에서 깃대로 와요
마을은 부서지지 않아요 · 일주일에 ${_i.maxPerWeek}번`,"방어 시작"+Xn,()=>n.sendStartRaid());return}T.actionVisible&&T.hideAction();return}if(pe.kind==="village"){const ee=Ye(),ce=ee[ge%Math.max(1,ee.length)]??Oo.require(By);if(z?.enforced&&!oc(z,Math.ceil(ce.durationSec/60),xr)){const me=rc(Math.ceil(ce.durationSec/60),xr),Ke=z.noPlayToday?"오늘은 게임 없는 날이에요":z.minutesUntilBlocked<z.remainingMin?`게임 시간이 ${z.minutesUntilBlocked}분 뒤에 끝나요`:`남은 시간 ${z.remainingMin}분`;T.showAction("오늘은 마을에서 놀자",`${Ke} · 원정은 ${me}분 필요해요`,"알겠어요",()=>T.hideAction());return}if(Se){const me=Math.floor(Se.remainingSec/60);T.showAction(`${Se.name} 원정 중`,`${Se.players}명이 나가 있어요 · 약 ${me}분 남음`,"따라가기"+Xn,()=>n.sendStartExpedition(Se.id))}else{const me=ce.nightStartsAt>0?`${Math.round(ce.nightStartsAt/60)}분 뒤 밤`:"처음부터 어두워요 · 몹이 바로 나와요",Ke=ee.length>1?{label:`다른 곳 ▸ ${ee[(ge+1)%ee.length].name}`,onClick:()=>{ge=(ge+1)%ee.length}}:void 0;T.showAction(`${ce.name}${ky(ce.name)} 원정`,`${Math.round(ce.durationSec/60)}분 · ${me} · 보물 상자 ${ce.treasures}개
포탈로 돌아오면 모은 것을 가져와요`,"원정 출발"+Xn,()=>n.sendStartExpedition(ce.id),Ke)}}else E&&Math.hypot(pe.player.pos.x-(E.x+.5),pe.player.pos.z-(E.z+.5))<=1.6&&Math.abs(pe.player.pos.y-E.y)<=3?T.showAction("🏆 다른 차원 포탈","엔더 드래곤을 물리쳤어요! 들어가면 엔딩","엔딩 보기"+Xn,()=>n.sendReturnHome()):T.showAction("마을로 돌아가기","지금까지 모은 것을 마을 창고에 넣어요","돌아가기"+Xn,()=>n.sendReturnHome())},su=()=>{const _=pe.player,N=_.pos,ee=(_.yaw*180/Math.PI+360)%360,ce=Oy[Math.round(ee/45)%8],me=pe.interaction.target,Ke=me?`${r.get(me.id).name} (${me.x}, ${me.y}, ${me.z}) 면 ${["+X","-X","+Y","-Y","+Z","-Z"][me.face]}`:"없음",st=pe.expedition?`원정 ${pe.expedition.name} 시드 ${pe.expedition.seed} 경과 ${Yl().toFixed(0)}s 하늘 ${Vi.toFixed(2)}`:`마을 ${i.village.code} 시드 ${i.village.seed}`;return[`FPS ${Gl}  프레임 ${_e.ema.toFixed(1)}ms  해상도 ×${_e.pixelRatio.toFixed(2)}  렌더거리 ${pe.chunks.renderDistance}  화면 ${Re}×${we} 버퍼 ${h.domElement.width}×${h.domElement.height} 비율 ${l.aspect.toFixed(2)}`,`드로우 ${Hl}  삼각형 ${(Wl/1e3).toFixed(1)}k`,`청크 보임 ${pe.chunks.stats.visibleChunks}  큐 ${pe.chunks.queued}  진행 ${pe.chunks.inflight}  워커 ${f.size}`,`메싱 최근 ${pe.chunks.stats.lastMs.toFixed(1)}ms  평균 ${pe.chunks.stats.avgMs.toFixed(1)}ms  최대 ${pe.chunks.stats.maxMs.toFixed(1)}ms  총 ${pe.chunks.stats.meshed}`,`위치 ${N.x.toFixed(2)} ${N.y.toFixed(2)} ${N.z.toFixed(2)}  yaw ${ee.toFixed(0)}°  pitch ${(_.pitch*180/Math.PI).toFixed(0)}°  ${ce}`,`조준 ${Ke}`,`바닥 ${_.onGround?"O":"X"}  물 ${_.inWater?"O":"X"}  웅크림 ${_.sneaking?"O":"X"}  달리기 ${_.sprinting?"O":"X"}`,`빛 여기 하늘 ${pe.light.skyAt(Math.floor(N.x),Math.floor(N.y+1),Math.floor(N.z))} 블록 ${pe.light.blockAt(Math.floor(N.x),Math.floor(N.y+1),Math.floor(N.z))}  조명 처음 ${pe.light.stats.initialMs.toFixed(0)}ms  최근 ${pe.light.stats.lastFlushMs.toFixed(1)}ms/${pe.light.stats.lastFlushCells}칸  지형 생성 ${pe.genMs.toFixed(0)}ms  청크 ${pe.world.chunkCount}`,`${t?"터치":"PC"}  ${navigator.hardwareConcurrency??"?"}코어  ${window.innerWidth}×${window.innerHeight}@${(window.devicePixelRatio||1).toFixed(1)}`,`서버 ${n.connected?`연결됨 왕복 ${n.rtt}ms`:"끊김"}  나 #${c}  같이 ${S.count}명  블록 대기 ${rn.size}  ${st}`,`가방 ${xe.filter(Boolean).length}/${xe.length}칸  손 ${T.selectedItem??"빈 손"}`].join(`
`)},Kl=_=>{Ro&&(requestAnimationFrame(Kl),ru(_))},ru=(_,N)=>{const ee=Math.max(0,Math.min(.1,(_-Do)/1e3));Do=Math.max(Do,_);const{player:ce,interaction:me,chunks:Ke,light:st}=pe;(Xl=(Xl+1)%15)===0&&ke();const it=gt.frame(ee);T.tickEffects(ee),it.toggleDebug&&(qe=!qe),it.slotDelta!==0&&T.selectDelta(it.slotDelta),it.slotSelect>=0&&T.select(it.slotSelect),me.selectedBlock=Ie(),me.heldItem=T.selectedItem,ce.update(it,ee),Te=Math.max(0,Te-ee);const ot=Yu(di,T.selectedItem),je=Qe.count>0?Qe.aim(ce.eye,ce.lookDir,ot?ot.range:ic+1):null;O=je,me.suppressPrimary=je!==null||ot!==null,me.suppressSecondary=je!==null,it.guard&&!q&&(De=_+sf),q=it.guard;const _n=(it.guard||_<De)&&re.shield!==null&&!v&&!Lt();_n!==Q&&(Q=_n,T.setGuarding(Q)),Fe&&(Q!==Ve||Q&&_-Me>=qu)&&(Ve=Q,Me=_,n.sendGuard(Q));const Ai=ad(ld,T.selectedItem);let Hi=null;if(it.secondaryTap&&Ai!==null&&!ot&&!Q&&!Lt()&&(Hi=je!==null&&je<qs?je:je===null?Qe.nearestInCone(ce.eye,ce.lookDir,ic,zy,!0):null,Hi===null&&je===null)){const Xe=me.target?r.get(me.target.id):null;Xe&&!Xe.door&&!Xe.chest&&me.swingBurst(Vy),M.swing()}const No=it.secondaryTap&&(je!==null&&je<qs||Hi!==null);if(ot&&!Q){if(it.primary)$===null&&($=_);else if($!==null){const Xe=_-$;$=null,je!==null&&Te<=0?(Te=ot.cooldownMs/1e3,n.sendShoot(je,T.selectedIndex,Xe),M.swing()):Xe>300&&T.toast("몹을 노린 채 놓아야 화살이 나가요",1200)}No&&$===null&&Te<=0&&(Te=ot.cooldownMs/1e3,n.sendShoot(je,T.selectedIndex,0),M.swing()),oe=$===null?0:Math.min(1,(_-$)/ot.drawMs)}else{$=null,oe=0;const Xe=No?Hi??je:it.primary?je:null;Xe!==null&&Te<=0&&!Q&&(Te=Ku/1e3,n.sendHit(Xe,T.selectedIndex),M.swing())}if(M.setDraw(oe),je!==null&&it.secondaryTap&&je>=qs&&pe.kind==="village"){const Xe=Qe.figureOf(je);Xe&&Un[Xe.kind]==="villager"&&!T.selectedItem?T.toast(`🧑‍🌾 ${R[(je+Math.floor(Date.now()/6e4))%R.length]}`,3e3):(n.sendUseMob(je,T.selectedIndex),M.swing())}if(je!==Ge){Ge=je;const Xe=je!==null?Qe.figureOf(je):void 0;if(Xe&&je!==null&&je>=qs){k===6&&(G(0),setTimeout(()=>T.toast("🎉 첫 걸음을 다 뗐어요! 더 많은 건 게임 방법(?)에 있어요",7e3),3200));const ht=ro.get(Un[Xe.kind]??"cow"),Yt=(Xe.state&En.baby)!==0,xn=(Xe.state&En.tamed)!==0,vi=ht.food.map(Fo=>j(Fo)).join("·"),Wi=ht.id==="iron_golem"?"🗿 마을을 지키는 철 골렘 — 우민을 때려요":xn?ht.id==="horse"?W.get(je)?.mine?"빈손 탭 → 🐴 타기 · 카드에서 이름 짓기":"남의 말이에요":W.get(je)?.mine?"빈손 탭 → 앉기/일어나기 · 카드에서 이름 짓기":"남이 길들인 강아지예요":ht.id==="horse"?"🏇 안장을 들고 탭 → 내 말로":ht.tameWith.length?`${ht.tameWith.map(Fo=>j(Fo)).join("·")}을(를) 들고 탭 → 길들이기`:`${vi}을(를) 들고 탭 → 먹이기`,_r=ht.id==="sheep"?" · ✂️ 가위 들고 탭 → 양털":ht.id==="chicken"?" · 빈손 탭 → 🥚 달걀":ht.id==="cow"&&!Yt?" · 🪣 빈 양동이 들고 탭 → 우유":ht.id==="villager"?" · 빈손 탭 → 인사":"";T.toast(`${ht.name}${Yt?" (아기)":""}${xn?" 🐾":""} · ${Wi}${_r}`,3e3)}}if(me.update(it,ee),ce.applyToCamera(l,eu),Po+=ee*1e3,Fe&&Po>=Fy&&(Po=0,vr()),S.update(ee,pe.light,Vi),y.update(ee,Date.now()+yt),fe.update(ce,ee),he.update(),Ue.update(ee),Qe.update(ee),ze&&L(),Ke.markDirtyAll(st.flush()),me.target){if(m.setTarget(me.target.x,me.target.y,me.target.z),m.setProgress(me.progress),me.progress>0&&(We+=ee)>=.11){We=0;const Xe=me.target;mt.crumb(Xe.x,Xe.y,Xe.z,Xe.face,ft(Xe.id))}}else m.clearTarget();mt.update(ee),T.setProgress(oe>0?oe:me.progress);{const Xe=ve?`${Qu[ve.kind]??""} ${ro.get(ve.kind).name}`:"",ht=pe.kind==="village"?k===1?{x:pe.portalPos.x+.5,z:pe.portalPos.z+.5,name:"포탈",near:3}:k===4?{x:I.x,z:I.z,name:"창고",near:4}:k===5?{x:P.x,z:P.z,name:"둥지",near:5}:{x:64.5,z:64.5,name:"광장",near:24}:ve?{x:ve.x,z:ve.z,name:Xe,near:5}:{x:pe.portalPos.x,z:pe.portalPos.z+.5,name:"포탈",near:12},Yt=ht.x-ce.pos.x,xn=ht.z-ce.pos.z,vi=Math.hypot(Yt,xn);if(ve&&pe.kind==="expedition"){const Wi=(Math.atan2(ve.x-ce.pos.x,-(ve.z-ce.pos.z))*180/Math.PI+360)%360,_r=Math.hypot(ve.x-ce.pos.x,ve.z-ce.pos.z);T.setBoss(_r>5?`${Xe} · ${Gy(Wi)} ${Math.round(_r)}칸`:`${Xe} · 바로 앞!`,ve.hp,ro.get(ve.kind).hp)}k===1&&pe.kind==="village"&&vi<=7?G(2):k===2&&pe.kind==="expedition"&&G(3),vi>ht.near?T.setCompassTarget((Math.atan2(Yt,-xn)*180/Math.PI+360)%360,`${ht.name} ${Math.round(vi)}칸`):T.setCompassTarget(null,null)}if(T.setHeading(ce.yaw),Fe&&iu(),te.visible&&(rt+=ee*1e3)>=Ny&&(rt=0,te.setStations(vn())),pe.expedition){const Xe=pe.expedition,ht=Yl(),Yt=Math.max(0,Xe.durationSec-ht),xn=ju(Xe,ht);T.setTimer(Yt,xn),mr(Math.max(Ju,Zu(Xe,ht))),!Ls&&Yt<=180&&Yt>60&&(Ls=!0,T.toast("3분 남았어요! 포탈로 돌아가요",5e3)),!Is&&Yt<=60&&(Is=!0,T.toast("1분! 지금 돌아가지 않으면 절반만 가져가요",6e3))}Ke.update(ce.pos.x,ce.pos.y,ce.pos.z),d.setTime(_/1e3),p.update(l.position),pe.portal.update(_/1e3);{const Xe=Ie();Q?M.setItem("shield",ne("shield",16)):Xe>0?M.setBlock(Xe):M.setItem(T.selectedItem,T.selectedItem?ne(T.selectedItem,16):null)}Fe&&T.selectedItem!==J&&(J=T.selectedItem,n.sendHeld(J));const Tt=ce.onGround&&ce.horizontalSpeed>.4?Math.min(1,ce.horizontalSpeed/4.3):0;M.update(ee,l,ce.walkCycle,Tt),h.clear(),h.render(u,l),Hl=h.info.render.calls,Wl=h.info.render.triangles,M.render(h,l),_e.frame(ee),Lo++,Ar+=ee,Ar>=.5&&(Gl=Math.round(Lo/Ar),Lo=0,Ar=0),Io+=ee,qe&&Io>=.25?(Io=0,T.setDebug(su())):qe||T.setDebug(null)};return Ro=!0,requestAnimationFrame(Kl),T.showOverlay(`${i.village.name}`,(t?`왼쪽 아래 스틱: 움직이기  ·  드래그: 둘러보기
짧게 탭: 놓기  ·  꾹: 부수기`:`WASD 이동  ·  마우스 둘러보기
좌클릭 꾹: 부수기  ·  우클릭: 놓기`)+`
마을 코드 ${i.village.code}`,t?"탭해서 시작":"클릭해서 시작"),{start(){if(Fe)return;Fe=!0;const _=S.count;T.toast(_>0?`마을에 들어왔어요. 지금 ${_}명이 함께 있어요`:"마을에 들어왔어요. 친구에게 마을 코드를 알려 주세요",4e3),t&&(vt?Oe():ct||T.toast(_t,7e3),window.innerHeight>window.innerWidth&&(vt||ct)&&T.toast("폰을 가로로 돌리면 더 편해요",3500)),i.gifts.forEach((N,ee)=>setTimeout(()=>T.toast(`🎁 ${N.message}`,8e3),2500+ee*1500)),vr(),Et()},dispose(){Ro=!1,n.close(),gt.dispose(),Ds(pe),f.dispose(),p.dispose(),m.dispose(),M.dispose(),S.dispose(),d.dispose(),o.texture.dispose(),h.dispose(),window.removeEventListener("resize",Be),window.removeEventListener("keydown",ql),te.el.remove(),et.sheet.remove(),et.log.remove(),Ne?.disconnect(),s.innerHTML=""}}}const zy=Math.cos(.75),Vy=.4;function Gy(s){return["북","북동","동","남동","남","남서","서","북서"][Math.round((s%360+360)%360/45)%8]}export{Yy as createGame};
//# sourceMappingURL=Game-BOhqpbFw.js.map
