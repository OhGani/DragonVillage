import{F as yo,A as vn,C as Ir,h as yt,i as hr,j as xc,R as yd,p as Ed,k as Md,l as Sd,m as wd,n as Td,o as Cd,q as Rd,r as Dd,s as Pd,t as kd,u as Ld,v as Id,w as Ud,x as Fd,y as Nd,z as Bd,D as bc,B as yc,E as Ec,G as Od,H as Mc,I as Sc,V as pn,J as mi,K as wc,L as Qt,N as zd,O as fs,Q as Ar,S as Vd,T as Ur,U as Gd,W as Hd,X as Wd,Y as Tc,Z as Xd,_ as xr,$ as Yd,a0 as qd,a1 as Kd,a2 as Cc,a3 as Qd,a4 as Rc,a5 as jd,a6 as Jd,a7 as Zd,a8 as Fr,a9 as $d,aa as eh,ab as Ia,ac as th,ad as nh,ae as ih,af as sh,ag as rh,ah as Ua,ai as oh,aj as ah,ak as lh,al as ch,am as dh,an as hh,ao as uh,ap as fh,aq as ph,ar as mh,as as gh,at as _h,au as vh,av as Ah,aw as xh,ax as bh,ay as Fa,az as yh,aA as Eh,aB as Mh,aC as Sh,aD as wh}from"./index-CbzcjdyT.js";const Th={coal:"석탄",glowstone_dust:"발광석 가루",emerald:"에메랄드",lapis:"청금석",quartz:"석영",apple:"사과",redstone:"레드스톤 가루",leather:"가죽",wheat:"밀",milk_bucket:"우유 양동이",egg:"달걀",carrot:"당근",snowball:"눈덩이",feather:"깃털",string:"실",flint:"부싯돌",pumpkin_seeds:"호박 씨",name_tag_blank:"빈 이름표",white_wool:"흰 양털",ink_sac:"먹물",brown_mushroom:"갈색 버섯",melon_slice:"수박 조각",slime_ball:"슬라임 볼",scute:"인갑",bucket:"양동이",water_bucket:"물 양동이",lava_source_block:"용암(원천)",water_source_block:"물"};function Ch(s,e){if(Array.isArray(e))for(const t of e){if(!t||typeof t!="object")continue;const{id:n,name:i}=t;typeof n=="string"&&typeof i=="string"&&!s.has(n)&&s.set(n,i)}}function Rh(s){const e=new Map,t=s.recipes?.recipes;if(Array.isArray(t))for(const i of t){if(!i||typeof i!="object")continue;const{out:r,name:o}=i;if(!r||typeof o!="string")continue;const a=Object.keys(r);a.length===1&&!e.has(a[0])&&e.set(a[0],o)}Ch(e,s.dragons?.materials);const n=s.potions;for(const i of[n?.ingredients,n?.modifiers])if(i)for(const[r,o]of Object.entries(i)){if(r.startsWith("_")||e.has(r))continue;const a=o?.name;typeof a=="string"&&e.set(r,a)}for(const[i,r]of Object.entries(Th))e.has(i)||e.set(i,r);return e}function Na(s,e,t){return e.find(s)?.name??t.get(s)??s}const Dh="water_bucket",Ph="lava_bucket";function kh(s,e){if(s===Dh){const n=e.find("water");return n?e.fluidFinite(n.num,yo):null}if(s===Ph){const n=e.find("lava");return n?e.fluidFinite(n.num,yo):null}const t=e.find(s);return!t||t.internal||t.fluid||t.num===0?null:t.num}const Lh=27,Ih=Lh*2,Ba=100,Uh=5,Fh=1.5,Nh=24,ps=1500,Bh=ps,Oh={color:"#bdbdbd",power:1,stamina:25,cooldownSec:ps/1e3};function zh(s){const e=s.skills.find(n=>n.type==="beam");if(!e)return Oh;const t=(n,i,r,o)=>typeof n=="number"&&Number.isFinite(n)?Math.min(o,Math.max(r,n)):i;return{color:typeof e.color=="string"&&/^#[0-9a-fA-F]{6}$/.test(e.color)?e.color:s.color,power:Math.round(t(e.powerLevel,1,1,5)),stamina:t(e.stamina,25,0,1e3),cooldownSec:Bh/1e3}}function Oa(s){return s==="adult"?Math.round(Ba*Fh):Ba}function Vh(s,e,t){const n=Math.max(0,t-s.at)/1e3;return Math.min(e,s.value+n*Uh)}const Gh=1;function za(s,e,t){let n=0;const i=s[n++];if(i!==Gh)throw new Error(`모르는 청크 저장 형식: ${i}`);const r=s[n]|s[n+1]<<8;n+=2;const o=[],a=[];for(let l=0;l<r;l++){const c=s[n++];let f="";for(let _=0;_<c;_++)f+=String.fromCharCode(s[n++]);const g=e.find(f);g?o.push(g.num):(o.push(vn),a.push(f))}const u=s[n]|s[n+1]<<8;n+=2;const d=new Uint16Array(Ir);let h=0;for(let l=0;l<u;l++){const c=s[n]|s[n+1]<<8,f=s[n+2]|s[n+3]<<8;if(n+=4,f>=o.length)throw new Error(`팔레트 번호가 범위를 벗어났어요: ${f}`);const g=o[f];if(h+c>Ir)throw new Error("청크 데이터가 4096 을 넘어요");d.fill(g,h,h+c),h+=c}if(h!==Ir)throw new Error(`청크 데이터가 ${h}개 — 4096 이어야 해요`);return t.loadBlockIds(d),{unknownIds:a}}const Hh=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];function Wh(s,e,t,n,i,r,o,a,u){const d=Math.hypot(r,o,a);if(d===0)return null;r/=d,o/=d,a/=d;let h=Math.floor(t),l=Math.floor(n),c=Math.floor(i);const f=r>0?1:r<0?-1:0,g=o>0?1:o<0?-1:0,_=a>0?1:a<0?-1:0,m=f?Math.abs(1/r):1/0,p=g?Math.abs(1/o):1/0,w=_?Math.abs(1/a):1/0;let E=f>0?(h+1-t)/r:f<0?(t-h)/-r:1/0,y=g>0?(l+1-n)/o:g<0?(n-l)/-o:1/0,k=_>0?(c+1-i)/a:_<0?(i-c)/-a:1/0,v=-1,S=0;for(let R=0;R<256;R++){if(v>=0){const x=s(h,l,c);if(e(x)){const b=Hh[v];return{x:h,y:l,z:c,face:v,nx:b[0],ny:b[1],nz:b[2],distance:S,id:x}}}if(E<y&&E<k){if(S=E,S>u)return null;h+=f,E+=m,v=f>0?1:0}else if(y<k){if(S=y,S>u)return null;l+=g,y+=p,v=g>0?3:2}else{if(S=k,S>u)return null;c+=_,k+=w,v=_>0?5:4}}return null}const at=1e-4;function $i(s,e,t,n,i){const r=e.w/2;return t+1>s.x-r+at&&t<s.x+r-at&&n+1>s.y+at&&n<s.y+e.h-at&&i+1>s.z-r+at&&i<s.z+r-at}function Nr(s,e,t,n,i,r,o,a,u){const d=h=>{for(let l=r;l<=o;l++)for(let c=a;c<=u;c++)if(e===0?s(h,l,c):e===1?s(l,h,c):s(l,c,h))return!0;return!1};if(i>0){const h=Math.floor(n-at)+1,l=Math.floor(n+i-at);for(let c=h;c<=l;c++)if(d(c))return c}else{const h=Math.floor(t+at)-1,l=Math.floor(t+i+at);for(let c=h;c>=l;c--)if(d(c))return c}return null}function ur(s,e,t,n,i,r){r.onGround=!1,r.hitX=r.hitY=r.hitZ=r.hitCeiling=!1;const o=t.w/2;let a=n.y*i;if(a!==0){const u=Math.floor(e.x-o+at),d=Math.floor(e.x+o-at),h=Math.floor(e.z-o+at),l=Math.floor(e.z+o-at),c=Nr(s,1,e.y,e.y+t.h,a,u,d,h,l);c===null?e.y+=a:a>0?(e.y=c-t.h-at,n.y=0,r.hitY=r.hitCeiling=!0):(e.y=c+1,n.y=0,r.hitY=r.onGround=!0)}if(a=n.x*i,a!==0){const u=Math.floor(e.y+at),d=Math.floor(e.y+t.h-at),h=Math.floor(e.z-o+at),l=Math.floor(e.z+o-at),c=Nr(s,0,e.x-o,e.x+o,a,u,d,h,l);c===null?e.x+=a:(e.x=a>0?c-o-at:c+1+o+at,n.x=0,r.hitX=!0)}if(a=n.z*i,a!==0){const u=Math.floor(e.y+at),d=Math.floor(e.y+t.h-at),h=Math.floor(e.x-o+at),l=Math.floor(e.x+o-at),c=Nr(s,2,e.z-o,e.z+o,a,h,l,u,d);c===null?e.z+=a:(e.z=a>0?c-o-at:c+1+o+at,n.z=0,r.hitZ=!0)}}const Us={onGround:!1,hitX:!1,hitY:!1,hitZ:!1,hitCeiling:!1};function Xh(s,e,t,n,i,r,o,a=1){if(o<=0||i===0&&r===0)return null;const u={x:e.x,y:e.y,z:e.z},d={x:0,y:a/o,z:0};if(ur(s,u,n,d,o,Us),u.y-e.y<a-.05)return null;d.x=i,d.y=0,d.z=r,ur(s,u,n,d,o,Us);const h=(u.x-e.x)**2+(u.z-e.z)**2,l=(t.x-e.x)**2+(t.z-e.z)**2;if(h<=l+1e-9)return null;const c=d.x,f=d.z;if(d.x=0,d.y=-(a+.05)/o,d.z=0,ur(s,u,n,d,o,Us),!Us.onGround||u.y<=e.y+1e-4)return null;const g=u.y-e.y;return t.x=u.x,t.y=u.y,t.z=u.z,{dy:g,vx:c,vz:f}}function Br(s,e,t,n=.05){const i=t.w/2,r=Math.floor(e.y-n),o=Math.floor(e.x-i+at),a=Math.floor(e.x+i-at),u=Math.floor(e.z-i+at),d=Math.floor(e.z+i-at);for(let h=u;h<=d;h++)for(let l=o;l<=a;l++)if(s(l,r,h))return!0;return!1}const Yt=15,Bi=240;function Dc(s){return s>>4}function Pc(s){return s&15}const tn=0,gi=1,Fs=3,es=()=>performance.now();class Yh{constructor(e,t){this.world=e,this.sx=e.sizeX,this.sy=e.sizeY,this.sz=e.sizeZ,this.strideY=this.sx*this.sz;const n=this.sx*this.sy*this.sz;this.light=new Uint8Array(n),this.cells=new Uint8Array(n),this.table=new Uint8Array(t.count);for(const i of t.defs)this.table[i.num]=Math.min(Yt,i.lightEmit)<<4|Math.min(Yt,i.lightFilter)}world;light;cells;table;sx;sy;sz;strideY;pending=new Set;changedChunks=new Map;tracking=!1;changedCells=0;buckets=Array.from({length:Yt+1},()=>[]);stats={initialMs:0,lastFlushMs:0,lastFlushCells:0};index(e,t,n){return t*this.strideY+n*this.sx+e}get(e,t,n){return this.world.inBounds(e,t,n)?this.light[this.index(e,t,n)]:Bi}skyAt(e,t,n){return Dc(this.get(e,t,n))}blockAt(e,t,n){return Pc(this.get(e,t,n))}computeAll(e=!1){const t=es();this.light.fill(0),this.fillCells(),this.tracking=!1,this.pending.clear();const{sx:n,sy:i,sz:r,cells:o,light:a,buckets:u,strideY:d}=this;if(e){const h=(i-1)*d;for(let l=0;l<r;l++)for(let c=0;c<n;c++){const f=h+l*n+c,g=this.fromSkyAbove(o[f]&15);g>0&&(a[f]=g<<4,u[g].push(f))}}else{const h=new Int32Array(n*r);for(let l=0;l<r;l++)for(let c=0;c<n;c++){let f=i-1,g=f*d+l*n+c;for(;f>=0&&(o[g]&15)===0;)a[g]=Yt<<4,f--,g-=d;h[l*n+c]=f}for(let l=0;l<r;l++)for(let c=0;c<n;c++){const f=h[l*n+c],g=l*n+c;if(f===i-1){const m=this.fromSkyAbove(o[f*d+g]&15);m>0&&(a[f*d+g]=a[f*d+g]&15|m<<4,u[m].push(f*d+g));continue}u[Yt].push((f+1)*d+g);const _=m=>{for(let p=f+2;p<=m;p++)u[Yt].push(p*d+g)};c>0&&_(h[g-1]),c<n-1&&_(h[g+1]),l>0&&_(h[g-n]),l<r-1&&_(h[g+n])}}this.propagate(tn);for(let h=0;h<o.length;h++){const l=o[h]>>4;l!==0&&(a[h]=a[h]&240|l,u[l].push(h))}this.propagate(gi),this.stats.initialMs=es()-t}fromSkyAbove(e){return e===0?Yt:Yt-Math.max(1,e)}fillCells(){const{cells:e,table:t}=this;e.fill(0),this.world.forEachChunk(n=>{const i=n.cx<<4,r=n.cy<<4,o=n.cz<<4,{data:a,palette:u}=n;let d=0;for(let h=0;h<yt;h++)for(let l=0;l<yt;l++){let c=this.index(i,r+h,o+l);for(let f=0;f<yt;f++,c++,d++)e[c]=t[u[a[d]]]}})}markChanged(e,t,n){this.world.inBounds(e,t,n)&&this.pending.add(this.index(e,t,n))}get pendingCount(){return this.pending.size}flush(){if(this.pending.size===0)return[];const e=es(),{cells:t,table:n,light:i,buckets:r}=this,o=[],a=[];for(const g of this.pending){const _=g%this.sx,m=(g-_)/this.sx,p=m%this.sz,w=(m-p)/this.sz,E=n[this.world.getBlock(_,w,p)]??0;E!==t[g]&&(o.push(g),a.push(E))}if(this.pending.clear(),o.length===0)return this.stats.lastFlushMs=es()-e,this.stats.lastFlushCells=0,[];this.tracking=!0,this.changedChunks.clear(),this.changedCells=0;const u=[],d=[];for(let g=0;g<o.length;g++){const _=o[g],m=t[_],p=a[g],w=(p&15)>(m&15);w&&u.push(_),(w||p>>4<m>>4)&&d.push(_)}const h=this.remove(tn,u),l=this.remove(gi,d);for(let g=0;g<o.length;g++)t[o[g]]=a[g];const c=(g,_)=>{const m=g===tn?i[_]>>4:i[_]&15;m>0&&r[m].push(_)},f=(g,_,m,p,w)=>{c(g,_),m>0&&c(g,_-1),m<this.sx-1&&c(g,_+1),w>0&&c(g,_-this.sx),w<this.sz-1&&c(g,_+this.sx),p>0&&c(g,_-this.strideY),p<this.sy-1&&c(g,_+this.strideY)};for(const g of h)c(tn,g);for(let g=0;g<o.length;g++){const _=o[g],m=_%this.sx,p=(_-m)/this.sx,w=p%this.sz,E=(p-w)/this.sz;if(E===this.sy-1){const y=this.fromSkyAbove(a[g]&15);y>i[_]>>4&&(i[_]=i[_]&15|y<<4,this.mark(m,E,w))}f(tn,_,m,E,w)}this.propagate(tn);for(const g of l)c(gi,g);for(let g=0;g<o.length;g++){const _=o[g],m=_%this.sx,p=(_-m)/this.sx,w=p%this.sz,E=(p-w)/this.sz,y=a[g]>>4;y>(i[_]&15)&&(i[_]=i[_]&240|y,this.mark(m,E,w)),f(gi,_,m,E,w)}return this.propagate(gi),this.tracking=!1,this.stats.lastFlushMs=es()-e,this.stats.lastFlushCells=this.changedCells,[...this.changedChunks.values()]}remove(e,t){const n=[];if(t.length===0)return n;const{light:i,cells:r,sx:o,sy:a,sz:u,strideY:d}=this,h=[],l=_=>e===tn?i[_]>>4:i[_]&15,c=_=>{i[_]=e===tn?i[_]&15:i[_]&240},f=[];for(const _ of t){const m=l(_);if(m===0)continue;c(_),h.push(_,m);const p=_%o,w=(_-p)/o,E=w%u;this.mark(p,(w-E)/u,E)}const g=(_,m,p,w,E,y)=>{const k=l(_);k!==0&&(k<m||e===tn&&p===Fs&&m===Yt&&k===Yt?(c(_),this.mark(w,E,y),h.push(_,k),e===gi&&r[_]>>4>0&&f.push(_)):n.push(_))};for(;h.length;){const _=h.pop(),m=h.pop(),p=m%o,w=(m-p)/o,E=w%u,y=(w-E)/u;p>0&&g(m-1,_,0,p-1,y,E),p<o-1&&g(m+1,_,1,p+1,y,E),y<a-1&&g(m+d,_,2,p,y+1,E),y>0&&g(m-d,_,Fs,p,y-1,E),E>0&&g(m-o,_,4,p,y,E-1),E<u-1&&g(m+o,_,5,p,y,E+1)}for(const _ of f){const m=r[_]>>4;m>(i[_]&15)&&(i[_]=i[_]&240|m),n.push(_)}return n}propagate(e){const{light:t,cells:n,sx:i,sy:r,sz:o,strideY:a,buckets:u}=this,d=h=>e===tn?t[h]>>4:t[h]&15;for(let h=Yt;h>=1;h--){const l=u[h];for(;l.length;){const c=l.pop();if(d(c)!==h)continue;const f=c%i,g=(c-f)/i,_=g%o,m=(g-_)/o,p=(w,E,y,k,v)=>{const S=n[w]&15;let R;e===tn&&E===Fs&&h===Yt&&S===0?R=Yt:R=h-(S>1?S:1),!(R<=0||R<=d(w))&&(t[w]=e===tn?t[w]&15|R<<4:t[w]&240|R,this.tracking&&this.mark(y,k,v),u[R].push(w))};f>0&&p(c-1,0,f-1,m,_),f<i-1&&p(c+1,1,f+1,m,_),m<r-1&&p(c+a,2,f,m+1,_),m>0&&p(c-a,Fs,f,m-1,_),_>0&&p(c-i,4,f,m,_-1),_<o-1&&p(c+i,5,f,m,_+1)}}}mark(e,t,n){if(!this.tracking)return;this.changedCells++;const i=e>>4,r=t>>4,o=n>>4,a=e&15,u=t&15,d=n&15,h=a===0?-1:0,l=a===15?1:0,c=u===0?-1:0,f=u===15?1:0,g=d===0?-1:0,_=d===15?1:0;for(let m=h;m<=l;m++)for(let p=c;p<=f;p++)for(let w=g;w<=_;w++){const E=i+m,y=r+p,k=o+w;if(!this.world.chunkInBounds(E,y,k))continue;const v=hr(E,y,k);this.changedChunks.has(v)||this.changedChunks.set(v,{cx:E,cy:y,cz:k})}}buildPaddedLight(e,t,n,i){const r=i??new Uint8Array(xc),{sx:o,sy:a,sz:u,light:d}=this,h=e<<4,l=t<<4,c=n<<4;let f=0;for(let g=-1;g<=yt;g++){const _=l+g,m=_>=0&&_<a;for(let p=-1;p<=yt;p++){const w=c+p,E=m&&w>=0&&w<u,y=_*this.strideY+w*o;for(let k=-1;k<=yt;k++,f++){const v=h+k;r[f]=E&&v>=0&&v<o?d[y+v]:Bi}}}return r}}const qh="블록 목록. 아들이 숫자를 바꿔도 돼. hardness = 부수는 데 걸리는 초(맨손). tool = 필요한 도구 종류(없으면 null). drops = 부수면 나오는 아이템(없으면 자기 자신). lightEmit = 빛 세기 0~15 (횃불 14, 발광석·용암 15). lightFilter = 빛을 얼마나 막는지 0~15 (안 적으면 자동: 불투명 블록 15, 물 1, 유리·공기 0. 나뭇잎·얼음은 1로 적어 둠). texture = textures/ 폴더의 파일 이름(확장자 없이). 면마다 다르면 textureTop/textureSide/textureBottom. 광물(에메랄드·청금석·석영·레드스톤·고대 잔해), 흑요석 규칙, 장식·건축 블록은 아들 3차 디테일(2026-09-12) 반영. shape = 특수 형태 블록(계단·문·울타리 등, 모델은 M4에서). fluid = 액체 종류(water 또는 lava): 벽이 없으면 옆으로 퍼지고 아래로 흐른다.",Kh=[{id:"air",name:"공기",solid:!1,transparent:!0},{id:"bedrock",name:"기반암",tool:null,lightEmit:0,texture:"bedrock",_note:"세계 맨 아래 한 겹. hardness 가 없으면 부술 수 없는 블록이야"},{id:"stone",name:"돌",hardness:1.5,tool:"pickaxe",drops:"cobblestone",lightEmit:0,texture:"stone"},{id:"cobblestone",name:"조약돌",hardness:2,tool:"pickaxe",lightEmit:0,texture:"cobblestone"},{id:"dirt",name:"흙",hardness:.5,tool:null,lightEmit:0,texture:"dirt"},{id:"farmland",name:"농지",hardness:.6,tool:null,drops:"dirt",lightEmit:0,texture:"farmland",_note:"밭의 갈아 놓은 흙. 마을 터 생성기(M1)가 큰 밭에 깐다. 씨앗 심기·작물은 M4"},{id:"grass",name:"잔디",hardness:.6,tool:null,drops:"dirt",lightEmit:0,textureTop:"grass_top",textureSide:"grass_side",textureBottom:"dirt"},{id:"sand",name:"모래",hardness:.5,tool:null,lightEmit:0,texture:"sand"},{id:"gravel",name:"자갈",hardness:.6,tool:null,lightEmit:0,texture:"gravel"},{id:"log",name:"원목",hardness:2,tool:"axe",lightEmit:0,textureTop:"log_top",textureSide:"log_side",textureBottom:"log_top"},{id:"planks",name:"판자",hardness:2,tool:"axe",lightEmit:0,texture:"planks"},{id:"leaves",name:"나뭇잎",bonusDrops:"sapling",bonusCount:[0,1],_saplingNote:"나뭇잎을 부수면 묘목이 덤으로 0~1개 (아들: 확률 드롭). 나무 드래곤 알 재료",hardness:.2,tool:null,transparent:!0,lightEmit:0,lightFilter:1,texture:"leaves",shearDrops:["stick","sapling","apple"],_note:"아들 7차: 가위로 자르면 막대기나 그 나무 묘목이 나오고, 참나무에서는 사과도. 맨손으로 부수면 사라짐 (M4 아이템 드롭)"},{id:"glass",name:"유리",hardness:.3,tool:null,transparent:!0,_note:"마인크래프트는 유리를 깨면 사라지지만 여기서는 유리로 돌아온다(아빠 2026-09-19, 결정 #70 — 실크 터치 없음)",lightEmit:0,texture:"glass"},{id:"water",name:"물",solid:!1,transparent:!0,fluid:"water",lightEmit:0,texture:"water"},{id:"torch",name:"횃불",hardness:0,tool:null,solid:!1,lightEmit:14,shape:"torch",texture:"torch",_note:"shape torch: 네모 덩어리가 아니라 2/16 굵기 막대로 그린다. 벽에 붙이면 기울어진다 (결정 #82). 벽 변형 torch@n/e/s/w 는 코드가 만든다"},{id:"coal_ore",name:"석탄 광석",hardness:3,tool:"pickaxe",toolTier:1,drops:"coal",lightEmit:0,texture:"coal_ore"},{id:"iron_ore",name:"철 광석",hardness:3,tool:"pickaxe",toolTier:1,lightEmit:0,texture:"iron_ore"},{id:"gold_ore",name:"금 광석",hardness:3,tool:"pickaxe",toolTier:2,lightEmit:0,texture:"gold_ore"},{id:"diamond_ore",name:"다이아몬드 광석",hardness:3,tool:"pickaxe",toolTier:2,drops:"diamond",lightEmit:0,texture:"diamond_ore"},{id:"netherrack",name:"네더랙",hardness:.4,tool:"pickaxe",lightEmit:0,texture:"netherrack"},{id:"lava",name:"용암",solid:!1,transparent:!1,fluid:"lava",lightEmit:15,damage:4,texture:"lava"},{id:"glowstone",name:"발광석",hardness:.3,tool:null,bonusDrops:"glowstone_dust",bonusCount:[0,3],_note:"캐면 발광석 블록 1개가 들어오고, 덤으로 발광석 가루 0~3개(bonusCount, 아빠 2026-09-19 — 아들 9차 '가루 2~4개'를 블록 + 덤으로 바꿈). 가루는 물약 단계 올리기 재료(potions.json). 개수 뽑기는 서버가 시드 PRNG 로",lightEmit:15,texture:"glowstone"},{id:"snow",name:"눈",hardness:.2,tool:null,lightEmit:0,texture:"snow"},{id:"ice",name:"얼음",hardness:.5,tool:"pickaxe",transparent:!0,lightEmit:0,lightFilter:1,texture:"ice",_note:"아들 7차: 물은 눈 바이옴(설원)에서 얼음으로 언다. 설원 원정지 생성기(M3)에서 물 표면을 얼음으로"},{id:"end_stone",name:"엔드 돌",hardness:3,tool:"pickaxe",toolTier:1,lightEmit:0,texture:"end_stone"},{id:"emerald_ore",name:"에메랄드 광석",hardness:3,tool:"pickaxe",toolTier:2,drops:"emerald",lightEmit:0,texture:"emerald_ore"},{id:"lapis_ore",name:"청금석 광석",hardness:3,tool:"pickaxe",toolTier:1,drops:"lapis",lightEmit:0,texture:"lapis_ore",_note:"인챈트에 필요 (아들)"},{id:"nether_quartz_ore",name:"석영 광석",hardness:3,tool:"pickaxe",toolTier:1,drops:"quartz",lightEmit:0,texture:"quartz_ore"},{id:"redstone_ore",name:"레드스톤 광석",hardness:3,tool:"pickaxe",toolTier:2,drops:"redstone",lightEmit:0,texture:"redstone_ore"},{id:"ancient_debris",name:"고대 잔해",hardness:30,tool:"pickaxe",toolTier:2,lightEmit:0,texture:"ancient_debris"},{id:"obsidian",name:"흑요석",hardness:50,tool:"pickaxe",toolTier:3,lightEmit:0,texture:"obsidian",_note:"용암 블록에 물 양동이를 부으면 생성. 다이아 곡괭이(티어3)로만 캔다 (아들)"},{id:"dragon_egg",name:"드래곤 알",tool:null,lightEmit:4,transparent:!0,shape:"egg",texture:"dragon_egg",_note:"둥지 자리에 놓인 알 (M6-2). hardness 가 없어 못 부순다. 부화하면 사라진다. 아이템은 dragon_egg.<드래곤 id>(제작대에서 재료로 만든다)"},{id:"hay_bale",name:"건초 더미",hardness:.5,tool:null,lightEmit:0,texture:"hay_bale"},{id:"bookshelf",name:"책장",hardness:1.5,tool:"axe",_note:"캐면 책장 그대로(결정 #70). 마인크래프트의 책 3개 드롭은 안 씀",lightEmit:0,texture:"bookshelf"},{id:"enchanting_table",name:"인챈트 테이블",hardness:5,tool:"pickaxe",lightEmit:7,texture:"enchanting_table",release:"v1.1"},{id:"cactus",name:"선인장",hardness:.4,tool:null,damage:1,lightEmit:0,texture:"cactus"},{id:"sugar_cane",name:"사탕수수",hardness:0,tool:null,solid:!1,lightEmit:0,texture:"sugar_cane",_note:"물가에서 자란다"},{id:"pumpkin",name:"호박",hardness:1,tool:"axe",lightEmit:0,texture:"pumpkin"},{id:"carved_pumpkin",name:"조각된 호박",hardness:1,tool:"axe",lightEmit:0,texture:"carved_pumpkin"},{id:"jack_o_lantern",name:"잭오랜턴",hardness:1,tool:"axe",lightEmit:15,texture:"jack_o_lantern"},{id:"melon",name:"수박",hardness:1,tool:"axe",lightEmit:0,texture:"melon"},{id:"iron_block",name:"철 블록",hardness:5,tool:"pickaxe",toolTier:1,lightEmit:0,texture:"iron_block"},{id:"gold_block",name:"금 블록",hardness:3,tool:"pickaxe",toolTier:2,lightEmit:0,texture:"gold_block"},{id:"quartz_block",name:"석영 블록",hardness:.8,tool:"pickaxe",lightEmit:0,texture:"quartz_block"},{id:"netherite_block",name:"네더라이트 블록",hardness:50,tool:"pickaxe",toolTier:3,lightEmit:0,texture:"netherite_block"},{id:"emerald_block",name:"에메랄드 블록",hardness:5,tool:"pickaxe",toolTier:2,lightEmit:0,texture:"emerald_block"},{id:"diamond_block",name:"다이아몬드 블록",hardness:5,tool:"pickaxe",toolTier:2,lightEmit:0,texture:"diamond_block"},{id:"oak_stairs",name:"계단",hardness:2,tool:"axe",lightEmit:0,texture:"planks",shape:"stairs"},{id:"oak_door",name:"문",hardness:3,tool:"axe",lightEmit:0,transparent:!0,textureTop:"door_top",textureSide:"door_bottom",textureBottom:"door_bottom",shape:"door",_note:"문은 두 칸(아래·위). textureTop = 윗칸 그림(창문), textureBottom = 아랫칸 그림(판·손잡이). 탭하면 열리고 닫힌다(결정 #71). 그림은 아빠가 보낸 참나무 문(2026-09-19)"},{id:"oak_trapdoor",name:"다락문",hardness:3,tool:"axe",lightEmit:0,texture:"trapdoor",shape:"trapdoor"},{id:"oak_fence",name:"울타리",hardness:2,tool:"axe",lightEmit:0,texture:"planks",shape:"fence"},{id:"sign",name:"표지판",hardness:1,tool:"axe",solid:!1,lightEmit:0,texture:"sign",shape:"sign"},{id:"bed",name:"침대",hardness:.2,tool:null,lightEmit:0,texture:"bed",shape:"bed",_note:"네더·엔드에서 클릭 시 폭발"},{id:"chest",name:"상자",hardness:2.5,tool:"axe",lightEmit:0,textureTop:"chest_top",textureSide:"chest_side",textureBottom:"chest_top",shape:"chest"},{id:"furnace",name:"화로",hardness:3.5,tool:"pickaxe",lightEmit:0,texture:"furnace"},{id:"crafting_table",name:"제작대",hardness:2.5,tool:"axe",textureTop:"crafting_table_top",textureSide:"crafting_table_side",textureBottom:"planks",_note:"M4: 판자 4개로 만들어 놓는다. 5칸 안에 있으면 레시피를 만들 수 있다. 그림은 아들 스케치(2026-09-19, 위 3×3 격자·옆 세로 판자 + 도구)를 코드로 옮긴 것 — 아들이 직접 그린 PNG 로 덮어써도 된다"},{id:"brewing_stand",name:"양조기",hardness:.5,tool:null,lightEmit:1,texture:"brewing_stand"},{id:"soul_sand",name:"영혼 모래",hardness:.5,tool:null,lightEmit:0,texture:"soul_sand"},{id:"warped_fungus",name:"뒤틀린 균",hardness:0,tool:null,solid:!1,lightEmit:0,texture:"warped_fungus"},{id:"wool",name:"양털",hardness:.8,tool:null,lightEmit:0,texture:"wool",dyeable:!0,_note:"16색 염색 가능. 텍스처는 wool_<color>"},{id:"flower",name:"꽃",hardness:0,tool:null,solid:!1,lightEmit:0,texture:"flower",variants:["poppy","dandelion","cornflower","allium","tulip_pink","oxeye_daisy"],_note:"부수면 색 염료 3개"},{id:"rail",name:"철도",hardness:.7,tool:null,solid:!1,lightEmit:0,texture:"rail",release:"v1.1"},{id:"mob_spawner",name:"몹 스포너",hardness:5,tool:"pickaxe",drops:null,lightEmit:0,texture:"spawner",release:"v1.1",_note:"캐면 경험치 15–43"},{id:"water_deep",name:"깊은 물",solid:!1,transparent:!0,fluid:"water",lightEmit:0,texture:"water",_note:"심해 — 발광 오징어 서식"},{id:"dried_ghast",name:"마른 가스트",hardness:.5,tool:null,lightEmit:0,texture:"dried_ghast",release:"v1.2",_note:"네더 바닥에 있다. 캐서 물에 불리면 해피 가스트가 된다 (아들 6차). 해피 가스트 탑승은 v1.2"}],Qh={_comment:qh,blocks:Kh},jh="마을 건물. cost = 공유 창고에서 빠지는 재료. unlocks = 이 건물이 열어주는 것. footprint = 마을에 실제 블록 구조물로 서는 크기(가로×세로×높이). 아빠 임시안 — 아들 답변(질문 14: 드래곤 둥지)과 M6에서 확정.",Jh=[{id:"crafting_table",name:"제작대",level:1,cost:{planks:8},footprint:[3,3,3],unlocks:["recipes:basic"]},{id:"storage",name:"창고",level:1,cost:{planks:24,cobblestone:16},footprint:[5,5,4],unlocks:["storage:+200"]},{id:"forge",name:"대장간",level:2,cost:{cobblestone:40,coal:10,iron_ore:5},footprint:[5,5,4],unlocks:["tools:stone","tools:iron"]},{id:"farm",name:"농장",level:2,cost:{planks:16,dirt:32},footprint:[7,7,2],unlocks:["food"]},{id:"lighthouse",name:"등대",level:3,cost:{cobblestone:60,glass:12,glowstone:4},footprint:[3,3,12],unlocks:["village:flag_2"]},{id:"dragon_nest_1",name:"드래곤 둥지",level:1,cost:{cobblestone:30,log:20},footprint:[7,7,6],unlocks:["dragons:hold_4"],_note:"마을이 커지면 둥지도 커진다 (아들 답변 14). 단계별로 수용 드래곤 수와 크기 증가"},{id:"dragon_nest_2",name:"큰 둥지",level:3,cost:{cobblestone:80,log:40,iron_ingot:10},footprint:[11,11,8],unlocks:["dragons:hold_10"],requires:"dragon_nest_1"},{id:"dragon_nest_3",name:"드래곤 성",level:5,cost:{stone:200,gold_ingot:20,diamond:4},footprint:[15,15,12],unlocks:["dragons:hold_16"],requires:"dragon_nest_2"},{id:"brewing_stand",name:"양조기",level:3,cost:{cobblestone:3,blaze_rod:1},footprint:[3,3,3],unlocks:["recipes:brewing"],_note:"치유의 물약 제작"},{id:"portal_1",name:"포탈 1단계",level:1,cost:{},footprint:[5,1,5],unlocks:["expedition:grass_island"],_comment:"마을 생성 시 기본 제공"},{id:"portal_2",name:"포탈 2단계",level:2,cost:{cobblestone:50,iron_ore:10},footprint:[5,1,5],unlocks:["expedition:desert","expedition:cave"]},{id:"portal_3",name:"포탈 3단계",level:3,cost:{cobblestone:80,gold_ore:10,diamond:2},footprint:[5,1,5],unlocks:["expedition:snowfield"]},{id:"portal_4",name:"포탈 4단계",level:4,cost:{diamond:5,gold_ore:20,glowstone:8},footprint:[5,1,5],unlocks:["expedition:nether"]},{id:"portal_5",name:"포탈 5단계",level:5,cost:{diamond:10,blaze_powder:6,ghast_tear:2},footprint:[5,1,5],unlocks:["expedition:the_end"]},{id:"portal_6",name:"포탈 6단계 — 고대성",level:6,cost:{dragon_breath:1,netherite:2,echo_shard:4},footprint:[5,1,5],unlocks:["expedition:ancient_castle"],release:"v1.2",_note:"네 왕의 고대성. 엔딩 원정"}],Zh={_comment:jh,buildings:Jh},$h="몹과 처치 보상 — 아들 4차 디테일(2026-09-12), 6·7차(2026-09-13). drops = [아이템, 개수 범위, 확률]. xp는 xp.json과 동일값 유지. 보스는 bosses.json. breedWith = 교배 먹이, followsWhenHolding = 이 아이템을 들고 있으면 야생·사육 동물이 쫓아온다(아들 7차, 모든 동물 공통).",eu=[{id:"piglin",name:"피글린",release:"v1.1",habitat:"nether",home:"bastion",drops:[["gold_nugget",[0,1],.5]],xp:5,weapons:["golden_axe","golden_sword","crossbow"],enemy:"zombified_piglin",rides:"hoglin",friendlyIfWearing:"any_gold_armor",barter:{pay:"gold_ingot",gets:["obsidian","fire_resistance_potion","ender_pearl","misc"],_note:"금으로 거래. 흑요석·화염 저항 포션·엔더 진주 외에 잡다한 것들 (아들 6차)"},_note:"아들 6차(2026-09-13): 좀비 피글린과 전쟁하는 사이라 만날 때마다 금 도끼·금 칼·석궁으로 싸운다. 피글린 요새에 살고 호글린을 탄다(타거나 상자를 올리는 용도). 금 갑옷 4종 중 하나만 입어도 친구"},{id:"zombified_piglin",name:"좀비 피글린",release:"v1.1",habitat:"nether",drops:[["rotten_flesh",[0,1],1],["gold_nugget",[0,1],.3]],xp:5,weapons:["golden_axe","golden_sword","crossbow"],enemy:"piglin",rides:"zoglin",friendlyIfWearing:"any_gold_armor",_note:"아들 6차: 조글린을 타고 다닌다(용도는 호글린과 비슷). 금 갑옷 하나면 친구"},{id:"hoglin",name:"호글린",release:"v1.1",habitat:"nether",drops:[["porkchop",[2,4],1]],xp:5,riddenBy:"piglin",canCarryChest:!0,_note:"피글린이 타거나 상자를 올려 짐을 나른다 (아들 6차)"},{id:"zoglin",name:"조글린",release:"v1.1",habitat:"nether",drops:[["rotten_flesh",[1,3],1]],xp:5,riddenBy:"zombified_piglin",canCarryChest:!0},{id:"creeper",name:"크리퍼",drops:[["gunpowder",[0,2],1]],xp:5,_note:"TNT 재료"},{id:"zombie",name:"좀비",drops:[["rotten_flesh",[0,2],1],["iron_ingot",[1,1],.025],["carrot",[1,1],.025],["potato",[1,1],.025]],xp:5,_note:"아들: 썩은 살점, 확률적으로 철·당근·감자"},{id:"skeleton",name:"스켈레톤",drops:[["bone",[0,2],1],["arrow",[0,2],.5],["bow",[1,1],.085]],xp:5,_note:"아들: 뼈, 아주 낮은 확률로 활, 그보다 조금 높은 확률로 화살"},{id:"enderman",name:"엔더맨",drops:[["ender_pearl",[0,1],.5]],xp:5,_note:"확률적으로 엔더 진주 (텔레포트 드래곤 재료)"},{id:"spider",name:"거미",drops:[["string",[0,2],1],["spider_eye",[0,1],.33]],xp:5,_note:"거미줄 4개 = 양털 1개 가치 (아들)"},{id:"witch",name:"마녀",drops:[["glass_bottle",[0,2],.5],["redstone",[0,2],.3],["gunpowder",[0,2],.3]],xp:5,release:"v1.1"},{id:"blaze",name:"블레이즈",drops:[["blaze_rod",[0,1],.5]],xp:10},{id:"ghast",name:"가스트",drops:[["ghast_tear",[1,1],1],["gunpowder",[0,2],1]],xp:5},{id:"wither_skeleton",name:"위더 스켈레톤",drops:[["bone",[0,2],1],["coal",[0,1],.5],["wither_skeleton_skull",[1,1],.05]],xp:5}],tu=[{id:"happy_ghast",name:"해피 가스트",release:"v1.2",habitat:"nether",madeFrom:{block:"dried_ghast",soakIn:"water"},rideable:!0,fireBreathOnCommand:!0,drops:[],xp:0,_note:"아들 6차(2026-09-13): 네더 바닥의 마른 가스트를 캐서 물에 불리면 해피 가스트가 되고, 타고 다니며 불을 뿜게 할 수 있다. 날아다니는 탈것이라 드래곤 탑승(v1) 다음인 v1.2"},{id:"horse",name:"말",release:"v1.1",rideWith:"saddle",drops:[["leather",[0,2],1]],xp:1,_note:"아들 7차: 말에 안장을 씌우면 탈 수 있다. 탈것 시스템(v1.1)과 함께"},{id:"cow",name:"소",breedWith:"wheat",followsWhenHolding:"wheat",drops:[["leather",[0,2],1],["beef",[1,3],1]],interact:"milk_bucket"},{id:"sheep",name:"양",breedWith:"wheat",followsWhenHolding:"wheat",drops:[["wool",[1,1],1],["mutton",[1,2],1]],interact:"shears→wool 1–3",dyeable:!0},{id:"chicken",name:"닭",breedWith:"wheat_seeds",followsWhenHolding:"wheat_seeds",eggHatchesChickChance:.125,_eggNote:"아들 7차: 달걀에서는 확률적으로 병아리가 나온다. 1/8 은 아빠 임시값",drops:[["feather",[0,2],1],["chicken",[1,1],1]],lays:"egg"},{id:"pig",name:"돼지",breedWith:"carrot",followsWhenHolding:"carrot",drops:[["porkchop",[1,3],1]],rideable:"v1.1"},{id:"rabbit",name:"토끼",drops:[["rabbit_hide",[0,1],1]]},{id:"squid",name:"오징어",habitat:"shallow_sea",drops:[["ink_sac",[1,3],1]],_note:"얕은 바다. 먹물로 검은 염색 (아들)"},{id:"glow_squid",name:"발광 오징어",habitat:"deep_sea",drops:[["glow_ink_sac",[1,3],1]],_note:"심해. 빛나는 먹물 (아들)",release:"v1.1"},{id:"salmon",name:"연어",habitat:"river",drops:[["salmon",[1,1],1]]},{id:"dog",name:"강아지",tameable:!0,tameWith:"bone"},{id:"cat",name:"고양이",tameable:!0,tameWith:["salmon","cod"]},{id:"goat",name:"염소",habitat:"high_snow_mountain",release:"v1.1"},{id:"strider",name:"스트라이더",habitat:"nether_lava",rideable:"v1.1",release:"v1.1"},{id:"snow_golem",name:"눈 골렘",habitat:"snowfield"}],nu={_comment:"폐광의 몹 스포너 — 몹이 계속 생성되는 위험 지역. 스포너를 캐면 많은 경험치 (아들)",block:"mob_spawner",location:"abandoned_mineshaft",spawns:["zombie","skeleton","spider"],intervalSec:[10,40],maxNearby:6,breakXp:[15,43],_xpNote:"마인크래프트 값(15–43). 폐광은 동굴 원정지 구조물, v1.1"},iu={_comment:$h,hostile:eu,passive:tu,spawner:nu},su="드래곤 목록 — 이 게임의 핵심. 아들이 2026-09-12에 정한 16종. tier = 아들이 줄 세운 순서(1 가장 약함 → 16 가장 셈). recipe = 알을 만드는 데 필요한 재료와 개수(아들이 정한 그대로). targetExpeditions = 이 드래곤을 얻는 데 걸리길 바라는 원정 횟수(아들: 약한 것 1~2, 중간 3~5, 최강 6~8) — 밸런스 조정 기준값. abilities = 드래곤이 하는 일. 모든 드래곤은 안장을 만들면 탈 수 있다. color/texture는 아들이 그림 그린 뒤 채운다. skills = 아들이 정한 고유 스킬(2026-09-12 2차 답변). 공통 기본 공격은 combat.commonSkills. 숫자(damage/stamina/cooldown)는 아빠 임시값.",ru={obtainMethod:"egg",_obtainNote:"재료를 다 모으면 알이 나오고, 알에서 아기 드래곤이 나온다 (아들 답변 2)",growth:{startsAsBaby:!0,feedWithRecipeMaterials:!0,_note:"아기로 태어나고, 만들 때 쓴 재료를 먹이면 더 빨리 자란다 (아들 답변 4). 기본 성장 시간과 먹이당 단축량은 M6에서 정한다",baseGrowMinutes:60,feedShortcutMinutes:10,stages:["baby","adult"],_stageNote:"아기: 작고 둥글게(models/*.baby). 어른: 약 2배 크기, 긴 뿔·척추 가시·이빨 줄·큰 날개·긴 꼬리·빛나는 눈(models/*.adult). 어른이 되면 스킬 위력·기력 최대치 증가(값은 M6에서). 아빠 요청(2026-09-12): '컸을 때는 더 무섭고 크게'",adultMultipliers:{skillDamage:1.5,staminaMax:1.5,hp:2,hitbox:2,_note:"임시값"}},canDie:!0,flees:!1,permanent:!0,_deathNote:"죽을 수는 있지만 도망치지 않고, 얻으면 영원히 내 것 (아들 답변 5). → 구현: 죽으면 사라지지 않고 둥지로 돌아가 회복(원정 1회 동안 출전 불가). 아들 확정(2026-09-13, 결정 #25)",rideRequires:"saddle",rideControls:{_note:"아들 답변 13: 조이스틱으로 이동, 점프 버튼으로 상승, 웅크리기(▼) 버튼으로 하강. 타고 걸을 수도 있지만 몸집이 커서 장애물에 잘 걸린다",up:"jump",down:"sneak",walkable:!0,bigHitbox:!0},hatch:{_note:"알 부화에는 경험치 레벨을 소모한다(마인크래프트 인챈트 방식). 티어별 비용은 data/xp.json hatchLevelCostByTier. 레벨이 모자라면 알은 둥지에 보관된다",costsLevels:!0},completionReward:{_note:"전부 모으면 300 경험치 (아들 답변 15) + '드래곤 마스터' 칭호 + 마을 깃발. 경험치 시스템은 docs/XP-SYSTEM.md (마인크래프트 방식, 2026-09-12 도입 확정)",xp:300,title:"드래곤 마스터"},multiplayer:{_note:"아들 답변 12: 힘 합쳐 재료 모으기, 드래곤 대결, 드래곤 경주 전부. v1은 협동 재료 모으기, 대결·경주는 v1.1",coop:"v1",battle:"v1.1",race:"v1.1"}},ou=[{id:"log",name:"나무 원목",from:["grass_island"],how:"나무 캐기",rarity:1},{id:"sapling",name:"나무 묘목",from:["grass_island"],how:"나뭇잎 부수면 확률 드롭",rarity:1},{id:"leaves",name:"나뭇잎",from:["grass_island"],how:"나뭇잎 캐기(가위 또는 맨손)",rarity:1},{id:"dirt",name:"흙",from:["grass_island"],how:"캐기",rarity:1},{id:"stone",name:"돌",from:["grass_island","cave"],how:"캐기(곡괭이)",rarity:1},{id:"iron_ingot",name:"철",from:["cave","grass_island"],how:"철 광석 캐서 제련",rarity:2},{id:"cake",name:"케이크",from:["craft"],how:"제작: 밀 3 + 설탕 2 + 우유 3 + 달걀 1 (초원 섬 농장·소·닭, 마을 농장)",rarity:2},{id:"gold_ingot",name:"금",from:["cave","desert","nether"],how:"금 광석 캐서 제련, 사막 보물 상자",rarity:2},{id:"diamond",name:"다이아몬드",from:["cave"],how:"동굴 깊은 곳 캐기(철 곡괭이 이상)",rarity:3},{id:"netherite",name:"네더라이트",from:["nether"],how:"네더에만 있음. 고대 잔해 캐기(다이아 곡괭이)",rarity:4},{id:"lava_bucket",name:"용암 양동이",from:["nether","cave"],how:"양동이로 용암 채취",rarity:2},{id:"blaze_rod",name:"블레이즈 막대기",from:["nether"],how:"블레이즈 처치 시 확률 드롭",rarity:3},{id:"ghast_tear",name:"가스트의 눈물",from:["nether","boss:giant_ghast"],how:"가스트를 죽여야만 나옴 / 초거대 가스트 처치 시 3개 확정 (v1.1)",rarity:3},{id:"ice",name:"얼음",from:["snowfield"],how:"눈 바이옴에서 캐기(실크터치 또는 그냥 드롭 허용)",rarity:2},{id:"snow_block",name:"눈 블록",from:["snowfield"],how:"눈 바이옴에서 눈덩이 4개로 제작 또는 캐기",rarity:2},{id:"water_bucket",name:"물 양동이",from:["grass_island","snowfield"],how:"양동이(철 3)로 물 채취",rarity:1},{id:"clock",name:"시계",from:["craft"],how:"제작: 금 4 + 레드스톤 1 (동굴)",rarity:3},{id:"ender_pearl",name:"엔더 진주",from:["grass_island","desert","the_end","boss:enderman_king"],how:"밤에 나오는 엔더맨 처치 시 확률 드롭",rarity:3},{id:"healing_potion",name:"치유의 물약",from:["the_end","craft"],how:"엔드 시티 상자, 또는 양조(네더 와트 + 반짝이는 수박)",rarity:3},{id:"wooden_pickaxe",name:"나무 곡괭이",from:["craft"],how:"제작",rarity:1},{id:"stone_pickaxe",name:"돌 곡괭이",from:["craft"],how:"제작",rarity:1},{id:"iron_pickaxe",name:"철 곡괭이",from:["craft"],how:"제작",rarity:2},{id:"golden_pickaxe",name:"금 곡괭이",from:["craft"],how:"제작",rarity:2},{id:"diamond_pickaxe",name:"다이아몬드 곡괭이",from:["craft"],how:"제작",rarity:3},{id:"netherite_pickaxe",name:"네더라이트 곡괭이",from:["craft"],how:"제작(대장간)",rarity:4},{id:"tnt",name:"TNT",from:["craft"],how:"제작: 화약 5(밤 크리퍼) + 모래 4(사막) / 크리퍼 왕 처치 시 2개 확정 (v1.2)",rarity:3},{id:"wither_skeleton_skull",name:"위더 스켈레톤 머리",from:["nether","boss:skeleton_king"],how:"네더 요새 위더 스켈레톤 처치 시 매우 낮은 확률 / 스켈레톤 왕 처치 시 3개 확정 (v1.2)",rarity:5},{id:"dragon_breath",name:"드래곤의 숨결",from:["the_end"],how:"엔더 드래곤이 바닥에 뿌리는 보라색 먼지 공격(닿으면 HP 감소)을 유리병으로 담는다",rarity:5},{id:"dragon_egg",name:"엔더 드래곤의 알",from:["the_end"],how:"엔더 드래곤을 잡아야만 나옴",rarity:5},{id:"totem_of_undying",name:"불사의 토템",from:["boss:evoker"],how:"소환사 처치. 소지 시 1회 사망 방지 + HP 4 회복 (아들 설명)",rarity:4,_note:"드래곤 재료는 아님 — 생존 아이템"},{id:"spider_crown",name:"거미 왕관",from:["boss:spider_king"],how:"거미 왕 처치. 꾸미기(모자)",rarity:3,_note:"드래곤 재료는 아님"}],au=JSON.parse(`[{"id":"wood","name":"나무 드래곤","tier":1,"targetExpeditions":[1,2],"recipe":[{"material":"log","count":5},{"material":"sapling","count":1},{"material":"leaves","count":2}],"texture":"dragon_wood","color":"#8B5A2B","skills":[{"id":"plant_tree","name":"나무 세우기","type":"utility","effect":"조준 지점에 나무 1그루 생성","stamina":20,"cooldownSec":8,"signature":true},{"id":"beam","name":"녹색 빔","type":"beam","color":"#4CAF50","power":"약한","powerLevel":1,"stamina":25,"cooldownSec":6}],"ride":true,"model":"models/dragon_wood.json","sketch":"아들 그림 2026-09-12","_recipeNote":"아들 확정(2026-09-19): 나무 묘목 1개 (그림대로). 1차 답변의 2개는 정정"},{"id":"earth","name":"대지 드래곤","tier":2,"targetExpeditions":[1,2],"recipe":[{"material":"dirt","count":2},{"material":"stone","count":2}],"texture":"dragon_earth","color":"#7F7F7F","skills":[{"id":"drop_dirt_stone","name":"흙과 돌 떨어뜨리기","type":"falling_blocks","blocks":["dirt","stone"],"damage":4,"stamina":25,"cooldownSec":6,"signature":true},{"id":"beam","name":"회색 빔","type":"beam","color":"#9E9E9E","power":"약한","powerLevel":1,"stamina":25,"cooldownSec":6}],"ride":true,"model":"models/dragon_earth.json","sketch":"아들 그림 2026-09-12"},{"id":"iron","name":"철 드래곤","tier":3,"targetExpeditions":[1,2],"recipe":[{"material":"iron_ingot","count":2}],"texture":"dragon_iron","color":"#9AA4AD","skills":[{"id":"throw_iron_block","name":"철 블록 날리기","type":"projectile","block":"iron_block","damage":7,"stamina":20,"cooldownSec":4,"signature":true},{"id":"drop_anvil","name":"모루 떨어뜨리기","type":"falling_blocks","blocks":["anvil"],"damage":10,"stamina":30,"cooldownSec":10},{"id":"beam","name":"은색 빔","type":"beam","color":"#CFD8DC","power":"약간 센","powerLevel":2,"stamina":25,"cooldownSec":6}],"ride":true,"model":"models/dragon_iron.json","sketch":"아들 그림 2026-09-12"},{"id":"cake","name":"케이크 드래곤","tier":4,"targetExpeditions":[2,3],"recipe":[{"material":"cake","count":2}],"texture":"dragon_cake","color":"#F4A7C3","skills":[{"id":"throw_cake","name":"케이크 날리기","type":"projectile","block":"cake","damage":3,"stamina":15,"cooldownSec":3},{"id":"heal_cake_beam","name":"힐 케이크 빔","type":"beam","target":"allies","heal":6,"color":"#F8BBD0","stamina":35,"cooldownSec":12,"signature":true,"_note":"주인과 동료들에게 힐"}],"ride":true},{"id":"gold","name":"금 드래곤","tier":5,"targetExpeditions":[3,5],"recipe":[{"material":"gold_ingot","count":2}],"texture":"dragon_gold","color":"#E2B32B","skills":[{"id":"throw_gold_block","name":"금 블록 날리기","type":"projectile","block":"gold_block","damage":7,"stamina":20,"cooldownSec":4,"signature":true},{"id":"scatter_gold","name":"금 뿌리기","type":"aoe","effect":"주변 적 눈부심 + 금 조각 드롭(장식)","stamina":25,"cooldownSec":10},{"id":"beam","name":"금빛 빔","type":"beam","color":"#FFD54F","power":"약간 센","powerLevel":2,"stamina":25,"cooldownSec":6}],"ride":true},{"id":"diamond","name":"다이아몬드 드래곤","tier":6,"targetExpeditions":[3,5],"recipe":[{"material":"diamond","count":2}],"texture":"dragon_diamond","color":"#5FD3E6","skills":[{"id":"throw_diamond_block","name":"다이아 블록 날리기","type":"projectile","block":"diamond_block","damage":9,"stamina":20,"cooldownSec":4},{"id":"diamond_tornado","name":"다이아 회오리","type":"aoe_spin","effect":"몸을 마구 돌리며 바람을 일으킴. 몸에 닿는 모든 것에 상당한 피해","damage":12,"radius":4,"durationSec":3,"stamina":45,"cooldownSec":15,"signature":true},{"id":"beam","name":"밝은 민트색 빔","type":"beam","color":"#A7FFEB","power":"강력한","powerLevel":3,"stamina":25,"cooldownSec":6}],"ride":true},{"id":"netherite","name":"네더라이트 드래곤","tier":7,"targetExpeditions":[3,5],"recipe":[{"material":"netherite","count":2}],"texture":"dragon_netherite","color":"#4A3B3F","skills":[{"id":"throw_netherite_block","name":"네더라이트 블록 날리기","type":"projectile","block":"netherite_block","damage":12,"stamina":25,"cooldownSec":5},{"id":"netherite_wall","name":"네더라이트 벽 세우기","type":"utility","effect":"전방 5×3 네더라이트 임시 벽 20초","stamina":35,"cooldownSec":20,"signature":true},{"id":"netherite_rain","name":"네더라이트 블록 비","type":"falling_blocks","blocks":["netherite_block"],"damage":14,"radius":6,"stamina":50,"cooldownSec":25},{"id":"beam","name":"아주 진한 보라빛 빔","type":"beam","color":"#4A148C","power":"강력한","powerLevel":3,"stamina":25,"cooldownSec":6}],"ride":true},{"id":"fire","name":"화염 드래곤","tier":8,"targetExpeditions":[3,5],"recipe":[{"material":"lava_bucket","count":1},{"material":"blaze_rod","count":2},{"material":"ghast_tear","count":1}],"_note":"불로 블록을 녹일 수 있다. 베드락·흑요석 제외 (아들 답변 3)","texture":"dragon_fire","color":"#E0562A","skills":[{"id":"breathe_fire","name":"불 뿜기","type":"cone","damage":6,"burnSec":4,"stamina":15,"cooldownSec":2,"signature":true},{"id":"shoot_lava","name":"용암 쏘기","type":"projectile","block":"lava","damage":8,"burnSec":6,"stamina":25,"cooldownSec":6},{"id":"fire_rain","name":"하늘에서 불 떨어지기","type":"aoe_rain","damage":5,"radius":6,"durationSec":5,"stamina":45,"cooldownSec":20},{"id":"fire_aura","name":"몸에 불 두르기","type":"aura","damage":3,"durationSec":10,"stamina":30,"cooldownSec":25},{"id":"melt_blocks","name":"블록 녹이기","type":"utility","except":["bedrock","obsidian"],"stamina":10,"cooldownSec":1}],"ride":true},{"id":"ice","name":"아이스 드래곤","tier":9,"targetExpeditions":[3,5],"recipe":[{"material":"ice","count":2},{"material":"snow_block","count":2}],"_note":"블록을 얼릴 수 있다 (아들 답변 3)","texture":"dragon_ice","color":"#8FD3F4","skills":[{"id":"shoot_ice","name":"얼음 쏘기","type":"projectile","damage":6,"slowSec":3,"stamina":15,"cooldownSec":3,"signature":true},{"id":"freeze_hostiles","name":"나쁜 몹 얼리기","type":"aoe","effect":"반경 안 적대 몹 5초 동결","radius":6,"durationSec":5,"stamina":40,"cooldownSec":18},{"id":"freeze_blocks","name":"블록을 얼음으로","type":"utility","effect":"조준 블록(물·용암 포함)을 얼음으로 변환","stamina":10,"cooldownSec":1}],"ride":true},{"id":"water","name":"워터 드래곤","tier":10,"targetExpeditions":[3,5],"recipe":[{"material":"water_bucket","count":1}],"texture":"dragon_water","color":"#2F80D6","skills":[{"id":"shoot_water","name":"물 쏘기","type":"projectile","damage":5,"knockback":4,"stamina":15,"cooldownSec":3,"signature":true},{"id":"tsunami","name":"쓰나미","type":"wave","damage":10,"knockback":8,"width":9,"stamina":50,"cooldownSec":25},{"id":"water_tornado","name":"물 회오리 소환","type":"summon_aoe","damage":6,"radius":3,"durationSec":6,"stamina":40,"cooldownSec":20},{"id":"water_breathing","name":"수중호흡 주기","type":"buff","target":"self_owner_allies","durationSec":1200,"stamina":40,"cooldownSec":300,"release":"v1.1","_note":"아들: 워터 드래곤에게 20분간 수중호흡을 받을 수 있다('디버프'라 썼지만 좋은 효과 → 버프)"}],"ride":true},{"id":"time","name":"타임 드래곤","tier":11,"targetExpeditions":[3,5],"recipe":[{"material":"clock","count":4}],"texture":"dragon_time","color":"#B08D57","skills":[{"id":"rewind_time","name":"시간 되돌리기","type":"world_rewind","effect":"플레이어들과 이 드래곤을 제외한 모든 것(적·몹·투사체·적이 부순 블록)을 10초 전 상태로 되돌린다. 위치 포함. 원정 타이머는 되돌리지 않는다","stamina":60,"cooldownSec":60,"rewindSec":10,"excludes":["players","self","allyDragons"],"affects":["hostileMobs","bosses","projectiles","enemyBlockChanges"],"timerAffected":false,"_note":"아들 확정(2026-09-12): 플레이어와 자신 제외, 위치 포함, 원정 타이머 제외. 동료 드래곤 제외는 아빠 해석. 플레이어가 놓은 블록은 그대로 둔다(플레이어 제외의 연장)","_serverNote":"서버가 최근 10초 적 상태·적 블록 변경 링버퍼 보관(1초 간격). 발동 시 되감기 후 전원에게 스냅샷 브로드캐스트"},{"id":"stop_time","name":"시간 멈추기","type":"global_freeze","effect":"30초 동안 적 전부 정지. 자신·플레이어·동료는 움직임","durationSec":30,"stamina":80,"cooldownSec":120,"signature":true,"timerAffected":false,"_note":"아들 확정: 원정 타이머는 멈추지 않는다"},{"id":"beam","name":"진한 초록색 빔","type":"beam","color":"#1B5E20","power":"강력한","powerLevel":3,"stamina":25,"cooldownSec":6}],"ride":true},{"id":"teleport","name":"텔레포트 드래곤","tier":12,"targetExpeditions":[6,8],"recipe":[{"material":"ender_pearl","count":2}],"texture":"dragon_teleport","color":"#1A1A22","skills":[{"id":"teleport_self","name":"텔레포트","type":"utility","range":32,"stamina":20,"cooldownSec":5,"signature":true},{"id":"banish","name":"상대를 다른 곳으로","type":"target_utility","effect":"조준한 적을 무작위 원거리로 이동","range":24,"stamina":35,"cooldownSec":12},{"id":"beam","name":"청녹색 빔","type":"beam","color":"#00897B","power":"강한","powerLevel":3,"stamina":25,"cooldownSec":6}],"ride":true},{"id":"healing","name":"치유 드래곤","tier":13,"targetExpeditions":[6,8],"recipe":[{"material":"healing_potion","count":6}],"texture":"dragon_healing","color":"#F06292","skills":[{"id":"heal_allies","name":"HP 회복","type":"heal","target":"self_owner_allies","heal":8,"radius":8,"stamina":30,"cooldownSec":10,"signature":true},{"id":"shield","name":"뚫리지 않는 방어막","type":"shield","durationSec":10,"radius":5,"stamina":60,"cooldownSec":45},{"id":"beam","name":"붉은색 빔","type":"beam","color":"#C62828","power":"강한","powerLevel":3,"stamina":25,"cooldownSec":6}],"ride":true},{"id":"earthquake","name":"어스퀘이크 드래곤","tier":14,"targetExpeditions":[6,8],"recipe":[{"material":"wooden_pickaxe","count":1},{"material":"stone_pickaxe","count":1},{"material":"iron_pickaxe","count":1},{"material":"golden_pickaxe","count":1},{"material":"diamond_pickaxe","count":1},{"material":"netherite_pickaxe","count":1}],"texture":"dragon_earthquake","color":"#8D6E4A","skills":[{"id":"dig_5x5","name":"주변 지형 5×5 캐기","type":"utility","effect":"조준 지점 중심 5×5×1 채굴, 드롭은 주인 가방으로","stamina":30,"cooldownSec":8,"signature":true,"_serverNote":"서버 블록 변경 검증에서 드래곤 스킬 예외(도달 거리 무시). 보호 구역은 여전히 불가"},{"id":"throw_pickaxes","name":"곡괭이 날리기","type":"projectile_burst","count":6,"damage":4,"stamina":25,"cooldownSec":6},{"id":"beam","name":"갈색 빔","type":"beam","color":"#6D4C41","power":"강한","powerLevel":3,"stamina":25,"cooldownSec":6}],"ride":true},{"id":"explosion","name":"폭발 드래곤","tier":15,"targetExpeditions":[6,8],"recipe":[{"material":"tnt","count":2},{"material":"wither_skeleton_skull","count":3}],"texture":"dragon_explosion","color":"#B71C1C","skills":[{"id":"self_detonate","name":"자기 몸 폭파","type":"self_aoe","damage":20,"radius":6,"selfHpCost":0.5,"effect":"부서지지 않지만 HP가 절반 깎임","stamina":50,"cooldownSec":30},{"id":"detonate_target","name":"원하는 곳 폭파","type":"target_aoe","damage":15,"radius":4,"range":24,"stamina":35,"cooldownSec":10,"signature":true},{"id":"beam","name":"흰색 빔","type":"beam","color":"#FFFFFF","power":"매우 강력한","powerLevel":4,"stamina":25,"cooldownSec":6}],"ride":true},{"id":"ender","name":"엔더 드래곤","tier":16,"targetExpeditions":[6,8],"recipe":[{"material":"dragon_breath","count":4},{"material":"dragon_egg","count":1}],"texture":"dragon_ender","color":"#1E1B24","skills":[{"id":"beam","name":"가장 강력한 보라·검정 빔","type":"beam","color":"#6A1B9A","power":"가장 강력한","powerLevel":5,"stamina":25,"cooldownSec":6},{"id":"dragon_breath_pool","name":"드래곤의 숨결 뿌리기","type":"ground_aoe","damage":4,"radius":3,"durationSec":8,"stamina":30,"cooldownSec":10,"signature":true},{"id":"purple_energy_balls","name":"하늘에서 보라색 에너지 볼","type":"aoe_rain","damage":8,"radius":6,"durationSec":5,"stamina":45,"cooldownSec":20},{"id":"purple_tornado","name":"보라색 회오리","type":"aoe_spin","damage":10,"radius":5,"durationSec":4,"stamina":45,"cooldownSec":20},{"id":"summon_enderman_army","name":"엔더맨 군대 소환","type":"summon","count":6,"durationSec":30,"friendly":true,"stamina":70,"cooldownSec":60},{"id":"teleport_far","name":"1~60블록 텔레포트","type":"utility","rangeMin":1,"rangeMax":60,"stamina":20,"cooldownSec":4},{"id":"eye_lasers","name":"눈에서 보라색 레이저","type":"beam","color":"#B39DDB","power":"강한","stamina":20,"cooldownSec":5,"powerLevel":3}],"ride":true,"model":"models/dragon_ender.json","_modelNote":"자체 디자인 — 참고 이미지(마인크래프트 엔더 드래곤 모델)는 복제하지 않고, 아들 설계(검정·보라, 티어 16)를 우리 생성기 골격으로 만든 것"}]`),lu={_comment:"드래곤 전투 규칙 — 아들 설계(2026-09-12 스킬 답변). 모든 드래곤 공통 기본 공격 5종 + 드래곤별 고유 스킬. 빔은 색과 세기만 다른 공통 시스템.",commonSkills:[{id:"tail_whip",name:"꼬리치기",type:"melee",damage:3,knockback:2},{id:"bite",name:"깨물기",type:"melee",damage:4},{id:"headbutt",name:"머리 박치기",type:"melee",damage:4,knockback:3},{id:"claw_slam",name:"앞다리·뒷다리 내리치기",type:"melee",damage:5,aoeRadius:2},{id:"body_slam",name:"몸통 박치기",type:"melee",damage:6,knockback:4,selfStagger:!0}],friendlyFire:!1,_friendlyFireNote:"아들이 스킬마다 '자신이나 주인, 동료들은 피해가 없음'을 반복해서 적음 → 전역 규칙으로: 드래곤 스킬은 자신·주인·같은 마을 파티원에게 절대 피해를 주지 않는다. 회오리·쓰나미·낙하물 전부 포함",beamPower:{_comment:"아들이 쓴 세기 표현 → 숫자. 피해 = baseDamagePerPower × powerLevel",약한:1,"약간 센":2,강한:3,강력한:3,"매우 강력한":4,"가장 강력한":5,baseDamagePerPower:4,rangeBlocks:24,durationSec:1.5},stamina:{_comment:"드래곤 기력. 스킬마다 소모, 초당 회복. 폰에서 스킬 버튼 옆 작은 바. 아빠 임시안",max:100,regenPerSec:5},activeSkillSlots:4,_slotsNote:"폰 탑승 UI에 스킬 버튼 최대 4개. 기본 공격(꼬리·깨물기 등)은 탭 공격으로 자동 선택, 버튼을 차지하지 않는다",releasePlan:{v1:"기본 공격 5종 + 빔 + 드래곤별 대표 스킬 1개(signature: true)","v1.1":"나머지 스킬(시간 멈추기·되돌리기, 쓰나미, 엔더맨 군대, 방어막 등 복잡한 것)"}},kc={_comment:su,rules:ru,materials:ou,dragons:au,combat:lu},cu="원정지 목록. 아들 답변(질문 7·11)의 재료 출처에서 역산해 6곳으로 확정. durationSec = 원정 시간(초). nightStartsAt = 밤 시작 초(0이면 항상 어두움). treasures = 재료가 들어있는 보물 상자 수(아들: 상자엔 재료만 들어있으면 됨). unlockedBy = 여는 포탈 단계. materials = 여기서 나오는 드래곤 재료(dragons.json materials id). nightMobs = 밤에만 나오는 몹. bossOrRareMobs = 특정 재료를 위해 잡아야 하는 몹. 원정지 6곳은 v1, release 필드가 있는 4곳(어두운 숲·정글·깊은 어둠·고대성)은 보스 설계에서 추가된 v1.1/v1.2. boss = 이 원정지의 보스(bosses.json). sonDetails = 아들 3차 디테일(2026-09-12). release가 붙은 것은 v1.1.",du=60,hu=.5,uu=3,fu={leather:2},pu="보물 상자를 열면(부수면) 안에서 나오는 것. 지금은 가죽 2개 — 소가 아직 없어서(M7) 안장(가죽 5 + 철 2)을 만들 길로 임시로 넣었다. 소가 생기면 아들이 정한다.",mu=[{id:"grass_island",name:"초원 섬",generator:"island",durationSec:600,nightStartsAt:360,treasures:3,unlockedBy:"portal_1",danger:1,materials:["log","sapling","leaves","dirt","stone","iron_ingot","water_bucket","ender_pearl"],animals:["cow","chicken","sheep"],crops:["wheat","sugar_cane","melon"],nightMobs:["zombie","creeper","enderman"],_note:"나무·대지·철·케이크(농장 재료)·워터 드래곤의 재료. 밤 크리퍼(화약→TNT), 엔더맨(엔더 진주 확률)",sonDetails:{details:["물가 사탕수수","호박·수박·감자 밭","동물: 양·소·토끼·닭·돼지","얕은 바다: 오징어(먹물 염료)","심해: 발광 오징어(v1.1)","꽃밭(염료), 양(양털)"],structuresAdd:[{id:"shipwreck",name:"난파선",release:"v1.1",loot:["heart_of_the_sea","chest","furnace"],_note:"해안. 상자와 화로, 바다의 심장 (아들)"}],nightMobsAdd:[{id:"witch",release:"v1.1"}],waterMobs:[{id:"squid",depth:"shallow",release:"v1"},{id:"glow_squid",depth:"deep",release:"v1.1"}]}},{id:"cave",name:"동굴",generator:"cave",durationSec:600,nightStartsAt:0,treasures:4,unlockedBy:"portal_2",danger:2,materials:["stone","iron_ingot","gold_ingot","diamond","redstone","lava_bucket"],nightMobs:["zombie","skeleton","spider"],depthBonus:{diamond:"y < 16",redstone:"y < 32"},_note:"철·금·다이아·시계(레드스톤) 재료. 깊을수록 다이아",boss:{id:"spider_king",structure:"spider_king_den",spawnChance:.35,_note:"거미 왕의 굴 — 35% 확률로 생성. v1"},sonDetails:{details:["폐광: 몹 스포너(좀비·스켈레톤·거미 계속 생성), 스포너 캐면 경험치 15–43 (v1.1)"],structuresAdd:[{id:"abandoned_mineshaft",name:"폐광",release:"v1.1",hasSpawner:!0,loot:["rail","minecart","iron_ingot","gold_ingot","lapis"]}]}},{id:"desert",name:"사막",generator:"desert",durationSec:600,nightStartsAt:360,treasures:4,unlockedBy:"portal_2",danger:2,materials:["sand","gold_ingot","ender_pearl"],nightMobs:["husk","creeper","enderman"],structures:["desert_pyramid"],_note:"TNT용 모래, 피라미드 상자 금, 밤 엔더맨",sonDetails:{details:["작은 사막 마을","선인장"],structuresAdd:[{id:"desert_village_small",name:"작은 사막 마을",release:"v1"}]}},{id:"snowfield",name:"설원",generator:"snow",durationSec:600,nightStartsAt:300,treasures:3,unlockedBy:"portal_3",danger:3,materials:["ice","snow_block","water_bucket"],nightMobs:["stray","zombie"],_note:"아이스 드래곤 재료. 눈 바이옴에 가야만 있음 (아들 답변 7)",sonDetails:{details:["눈 골렘(v1)","높은 눈 산의 염소(v1.1)"],mobsAdd:[{id:"snow_golem",release:"v1"},{id:"goat",release:"v1.1",where:"high_snow_mountain"}]}},{id:"nether",name:"네더",generator:"nether",durationSec:600,nightStartsAt:0,treasures:3,unlockedBy:"portal_4",danger:4,materials:["lava_bucket","blaze_rod","ghast_tear","netherite","gold_ingot","wither_skeleton_skull","nether_wart"],bossOrRareMobs:[{mob:"ghast",drops:"ghast_tear",chance:1,_note:"가스트를 죽여야만 나옴"},{mob:"blaze",drops:"blaze_rod",chance:.5,_note:"확률 드롭"},{mob:"wither_skeleton",drops:"wither_skeleton_skull",chance:.05,_note:"매우 낮은 확률 (아들 답변 11)"}],structures:["nether_fortress","bastion"],groundBlocks:["dried_ghast"],_note:"화염·네더라이트·폭발 드래곤 재료. 네더라이트는 네더에만",_note6:"아들 6차(2026-09-13): 피글린 요새(bastion)에 상자가 많고 잡다한 것이 들어 있다(v1.1). 바닥에 마른 가스트가 있어 캐서 물에 불리면 해피 가스트(v1.2). 피글린 vs 좀비 피글린 전쟁은 mobs.json",boss:{id:"giant_ghast",structure:"giant_nether_fortress",spawnChance:.3,release:"v1.1"},sonDetails:{details:["용암 위 스트라이더 — 안장 + 뒤틀린 균 낚싯대로 탑승(v1.1)","침대 설치 후 클릭 → 폭발(v1)","석영 광석, 고대 잔해"],mobsAdd:[{id:"strider",release:"v1.1",rideable:!0}],rules:["bed_explodes"]}},{id:"the_end",name:"엔드",generator:"end",durationSec:900,nightStartsAt:0,treasures:2,unlockedBy:"portal_5",danger:5,materials:["dragon_breath","dragon_egg","healing_potion","ender_pearl"],bossOrRareMobs:[{mob:"ender_dragon",drops:"dragon_egg",chance:1,_note:"엔더 드래곤을 잡아야만 나옴"},{mob:"ender_dragon",drops:"dragon_breath",chance:null,_note:"드래곤이 바닥에 뿌리는 보라색 먼지 공격을 유리병으로 담는다 — 처치 없이도 채집 가능"},{mob:"enderman",drops:"ender_pearl",chance:.5}],structures:["end_city"],_note:"마지막 원정. 15분. 엔드 시티 상자에 치유의 물약. 엔더 드래곤 전투는 협동 전제(6명)",boss:{id:"ender_dragon",structure:"end_island",spawnChance:1,_note:"항상 있음. 협동 최종 보스. v1"},sonDetails:{details:["엔드 시티: 공중에 떠 있음. 입구 양조기(치유의 물약), 내부 상자 2 + 가운데 셜커 + 그 위 겉날개","셜커 공격 → 부양 디버프, 떨어지면 낙하 피해(v1.1)","침대 폭발(v1)"],mobsAdd:[{id:"shulker",release:"v1.1",effect:"levitation"}],lootAdd:[{id:"elytra",release:"v1.1"}],rules:["bed_explodes"]}},{id:"dark_forest",name:"어두운 숲",generator:"dark_forest",durationSec:600,nightStartsAt:240,treasures:3,unlockedBy:"portal_3",danger:3,materials:["log","emerald","totem_of_undying"],structures:["woodland_mansion"],boss:{id:"evoker",structure:"woodland_mansion",spawnChance:1},release:"v1.1",_note:"삼림 대저택 — 소환사의 본거지 (아들 보스 설계)",sonDetails:{}},{id:"jungle",name:"정글",generator:"jungle",durationSec:600,nightStartsAt:360,treasures:4,unlockedBy:"portal_3",danger:3,materials:["gold_ingot","emerald","banana","melon"],structures:["jungle_palace"],boss:{id:"giant_gorilla",structure:"jungle_palace",spawnChance:1},release:"v1.2",_note:"사치스러운 정글 궁궐 — 거대 고릴라 (아들 보스 설계)",sonDetails:{}},{id:"deep_dark",name:"깊은 어둠",generator:"deep_dark",durationSec:600,nightStartsAt:0,treasures:3,unlockedBy:"portal_4",danger:4,materials:["echo_shard","sculk","diamond"],structures:["ancient_city"],boss:{id:"giant_warden",structure:"ancient_city",spawnChance:1},release:"v1.2",_note:"고대 도시 — 거대 워든 (아들 보스 설계)",sonDetails:{}},{id:"ancient_castle",name:"고대성",generator:"ancient_castle",durationSec:900,nightStartsAt:0,treasures:0,unlockedBy:"portal_6",danger:6,materials:["wither_skeleton_skull","gunpowder","ender_pearl"],structures:["ancient_castle"],boss:{id:"four_kings",structure:"ancient_castle",spawnChance:1},release:"v1.2",_note:"네 왕의 성 — 첫 번째 왕들의 머리가 걸려 있다. 엔딩 원정. 15분. 포탈 6단계(엔드 이후)",sonDetails:{}}],gu={_comment:cu,returnGraceSec:du,failedReturnKeepRatio:hu,minStartMarginMin:uu,treasureChestGives:fu,_treasureNote:pu,expeditions:mu},_u="가족 연결 기본값. 부모 화면에서 가족별로 덮어쓸 수 있다. 시간은 분 단위, 시각은 서울 시간 HH:MM. weekday: 0=일 1=월 ... 6=토. baseMinutes는 아들이 2026-09-13에 정한 숫자(평일 20분 — +5분 보너스까지 고려해 넉넉하게, 주말 30분). 할 일 다 하면 +5분은 그대로.",vu="2026-09-12의 평일 10분 안은 원정 출발 조건(원정 10분 + 여유 3분 = 13분)과 충돌했는데, 아들이 평일 20분으로 올려 해결(결정 #50). 이제 기본 시간만으로 하루 한 번 원정이 가능하고, 할 일 보너스로 한 판 더.",Au=10,xu=5,bu={0:30,1:20,2:20,3:20,4:20,5:20,6:30},yu={0:[["00:00","09:00"],["21:00","24:00"]],1:[["00:00","16:00"],["21:00","24:00"]],2:[["00:00","16:00"],["21:00","24:00"]],3:[["00:00","16:00"],["21:00","24:00"]],4:[["00:00","16:00"],["21:00","24:00"]],5:[["00:00","16:00"],["21:00","24:00"]],6:[["00:00","09:00"],["21:00","24:00"]]},Eu={runAt:"MON 00:00",timezone:"Asia/Seoul",_note:"bonusCap은 아들이 정한 +5분 기준. 아빠 원안(+10분)으로 가면 10/7/4/0으로.",firstWeekBonusCap:5,tiers:[{minRate:.9,bonusCap:5,message:"지난주 대단했어. 이번 주는 매일 5분 더 열 수 있어."},{minRate:.75,bonusCap:4,message:"거의 다 했어. 이번 주 조금만 더."},{minRate:.5,bonusCap:2,message:"절반은 넘었어. 이번 주는 2분까지."},{minRate:0,bonusCap:0,message:"이번 주는 기본 시간만. 다음 주에 다시 열려."}]},Mu=5,Su=[5,1],wu=3,Tu=!1,Cu=[{title:"이 닦기",repeat:"daily",needsApproval:!1},{title:"수학 숙제",repeat:["1","2","3","4","5"],needsApproval:!0},{title:"책 20분 읽기",repeat:"daily",needsApproval:!1}],Ru={_comment:_u,_resolved:vu,maxBonusMinutesPerDay:Au,bonusMinutesFullCompletion:xu,baseMinutes:bu,blockedRanges:yu,weeklySettlement:Eu,idleLogoutMinutes:Mu,warnBeforeEndMinutes:Su,expeditionStartMarginMinutes:wu,parentSelfLimitEnabled:Tu,exampleTodos:Cu},Du="채팅은 여기 있는 것만 보낼 수 있다. 자유 입력 없음. 아들이 2026-09-12에 고른 문구 20개와 이모지 13개(12개 요청했는데 13개를 골라서 그대로 둠 — 아빠가 하나 빼도 됨).",Pu=["🥰","😄","😛","🤩","🥳","🤬","🤯","😣","😭","😱","😢","❤️","🥇"],ku=[{id:1,text:"돌아가자"},{id:2,text:"나이스"},{id:3,text:"계속 가자"},{id:4,text:"찾았다"},{id:5,text:"공격!"},{id:6,text:"후퇴하자"},{id:7,text:"방어하자"},{id:8,text:"잘했어!"},{id:9,text:"좋았어!"},{id:10,text:"조심해"},{id:11,text:"일단 숨자"},{id:12,text:"미안해"},{id:13,text:"ㅋㅋㅋ"},{id:14,text:"기습공격!"},{id:15,text:"흩어지자"},{id:16,text:"다시 모이자"},{id:17,text:"뭐지"},{id:18,text:"으악!"},{id:19,text:"헉…!"},{id:20,text:"이게무슨???"}],Lu={_comment:Du,emojis:Pu,phrases:ku},Iu="물약 양조 (마인크래프트 1.21 규칙, 아들 8차 디테일 2026-09-18). 양조기(brewing_stand)에서 만든다. 순서: 유리병에 물 → 물병(water_bottle) → 네더 사마귀 → 어색한 물약(awkward, 효과 없음) → 재료 하나 → 물약. from = 무엇에 재료를 넣나(water_bottle / awkward / 다른 물약 id). corruptsTo = 발효된 거미 눈을 넣으면 바뀌는 물약. seconds = 마시면 몇 초 가는지(0 = 즉시 한 번). 레드스톤은 시간 ×8/3, 발광석은 단계 +1 이고 시간 반, 화약은 던지는 물약, 던지는 물약 + 드래곤의 숨결 = 바닥에 남는 잔류형(시간 1/4). 이 배율은 코드(shared/rules/potions.ts)가 정한다. canExtend / canAmplify 가 false 면 그 보조 재료는 안 먹힌다. release 없는 것은 v1 — 양조 자체는 M4, 체력이 필요한 효과(치유·고통·독·재생·화염 저항·힘·나약함)는 체력이 생기는 M7 부터 실제로 듣는다. 개수·초는 아빠 임시값, 아들이 바꿔도 됨.",Uu={water_bottle:{name:"물병",_note:"유리병(glass_bottle)을 물에 대면 물병. 레시피는 recipes.json water_bottle"},awkward:{name:"어색한 물약",from:"water_bottle",ingredient:"nether_wart",_note:"효과 없음. 모든 물약의 시작"}},Fu={_comment:"물약에 넣는 보조 재료. 아들이 고칠 건 name 정도. 무엇을 하는지는 코드가 정한다.",redstone:{name:"레드스톤 가루",does:"extend",_note:"지속 시간 늘리기 (3분 → 8분)"},glowstone_dust:{name:"발광석 가루",does:"amplify",_note:"단계 올리기 (I → II), 시간은 반으로"},gunpowder:{name:"화약",does:"splash",_note:"던지는(투척용) 물약"},dragon_breath:{name:"드래곤의 숨결",does:"lingering",_note:"던지는 물약에 넣으면 바닥에 구름이 남는 잔류형. 엔더 드래곤 재료와 같은 아이템"},fermented_spider_eye:{name:"발효된 거미 눈",does:"corrupt",_note:"물약을 반대로 뒤집는다 (corruptsTo). 물병에 바로 넣으면 나약함"}},Nu={fuel:"blaze_powder",brewsPerFuel:20,bottles:3,brewSeconds:20,_note:"아빠 9차: 양조기 = 블레이즈 막대기 1 + 조약돌 3 (recipes.json brewing_stand). 왼쪽 연료 칸에 블레이즈 가루(막대기 1 → 가루 2), 가루 1개로 20번. 아래 병 자리 3개에 물병을 놓고 위에 재료 하나 → 세 병이 함께 바뀐다. 한 번 20초"},Bu=[{id:"speed",name:"신속의 물약",from:"awkward",ingredient:"sugar",effect:"speed",seconds:180,corruptsTo:"slowness",_note:"더 빨리 달린다. 설탕은 사탕수수"},{id:"slowness",name:"감속의 물약",from:"speed",ingredient:"fermented_spider_eye",effect:"slowness",seconds:90,_note:"신속 또는 도약의 물약에 발효된 거미 눈. 던져서 상대를 느리게. (가이드의 '어색한 물약 + 거미 눈 + 발효된 거미 눈'은 마인크래프트에 없는 조합이라 뺐다)"},{id:"leaping",name:"도약의 물약",from:"awkward",ingredient:"rabbit_foot",effect:"jump_boost",seconds:180,corruptsTo:"slowness",_note:"더 높이 뛴다. 토끼발은 초원 섬 토끼"},{id:"strength",name:"힘의 물약",from:"awkward",ingredient:"blaze_powder",effect:"strength",seconds:180,_note:"공격이 세진다. 블레이즈 가루는 블레이즈 막대기를 가방에서 부순 것"},{id:"healing",name:"치유의 물약",from:"awkward",ingredient:"glistering_melon",effect:"instant_health",seconds:0,canExtend:!1,corruptsTo:"harming",_note:"마시면 바로 체력 회복. 치유 드래곤 재료 6개(dragons.json). 엔드 시티 상자·양조기에서도 나옴. 반짝이는 수박 = 수박 조각 + 금 조각 8 (recipes.json)"},{id:"harming",name:"고통의 물약",from:"healing",ingredient:"fermented_spider_eye",effect:"instant_damage",seconds:0,canExtend:!1,_note:"치유 또는 독의 물약에 발효된 거미 눈. 던져서 상대에게 피해. 친구에게 던지면? → 아들에게 질문"},{id:"poison",name:"독 물약",from:"awkward",ingredient:"spider_eye",effect:"poison",seconds:45,corruptsTo:"harming",_note:"천천히 체력이 깎인다(1칸 남기고 멈춤). 거미 눈은 동굴 거미"},{id:"regeneration",name:"재생의 물약",from:"awkward",ingredient:"ghast_tear",effect:"regeneration",seconds:45,_note:"천천히 체력이 찬다. 가스트의 눈물은 네더 가스트 (화염 드래곤 재료와 같은 아이템)"},{id:"fire_resistance",name:"화염 저항의 물약",from:"awkward",ingredient:"magma_cream",effect:"fire_resistance",seconds:180,canAmplify:!1,_note:"불·용암에 안 다친다. 네더 원정 필수. 마그마 크림 = 슬라임 볼 + 블레이즈 가루 (recipes.json). 피글린 거래에서도 나옴(아들 6차)"},{id:"water_breathing",name:"수중 호흡의 물약",from:"awkward",ingredient:"pufferfish",effect:"water_breathing",seconds:180,canAmplify:!1,_note:"물속에서 숨을 쉰다. 워터 드래곤 능력과 같음. 복어는 초원 섬 바다 낚시"},{id:"night_vision",name:"야간 투시의 물약",from:"awkward",ingredient:"golden_carrot",effect:"night_vision",seconds:180,canAmplify:!1,corruptsTo:"invisibility",_note:"밤·동굴이 환하게 보인다. 황금 당근 = 당근 + 금 8 (아들 7차)"},{id:"invisibility",name:"투명화 물약",from:"night_vision",ingredient:"fermented_spider_eye",effect:"invisibility",seconds:180,canAmplify:!1,_note:"다른 플레이어·몹에게 안 보인다(들고 있는 것·갑옷은 보임). 친구들에게 안 보이는 건 서버가 처리",release:"v1.1"},{id:"turtle_master",name:"거북 도사의 물약",from:"awkward",ingredient:"turtle_shell",effect:"turtle_master",seconds:20,_note:"느려지지만(감속 IV) 튼튼해진다(저항 III). 거북 등딱지 = 인갑 5개. 거북이가 아직 게임에 없다 → 거북이(mobs.json)와 함께",release:"v1.1"},{id:"slow_falling",name:"느린 낙하의 물약",from:"awkward",ingredient:"phantom_membrane",effect:"slow_falling",seconds:90,canAmplify:!1,_note:"천천히 떨어지고 낙하 피해 없음. 팬텀 막대는 팬텀(3일 못 자면 밤에 나옴). 팬텀이 아직 게임에 없다 → 팬텀(mobs.json)과 함께",release:"v1.1"},{id:"wind_charged",name:"돌풍의 물약",from:"awkward",ingredient:"breeze_rod",effect:"wind_charged",seconds:180,_note:"1.21 새 물약. 맞은 몹이 죽으면 돌풍이 터져 주변을 밀어낸다. 브리즈 막대기는 시련의 방 브리즈 → 시련의 방 구조물이 생길 때",release:"v2"},{id:"weaving",name:"방직의 물약",from:"awkward",ingredient:"cobweb",effect:"weaving",seconds:180,_note:"1.21 새 물약. 맞은 몹이 죽으면 거미줄이 생기고, 거미줄 안에서 빨리 움직인다. 거미줄은 폐광·거미 왕 굴",release:"v2"},{id:"oozing",name:"장역화 물약",from:"awkward",ingredient:"slime_block",effect:"oozing",seconds:180,_note:"1.21 새 물약. 맞은 몹이 죽으면 슬라임 2마리가 나온다. 슬라임 블록 = 슬라임 볼 9",release:"v2"},{id:"infested",name:"벌레 먹음의 물약",from:"awkward",ingredient:"stone",effect:"infested",seconds:180,_note:"1.21 새 물약. 맞은 몹이 다치면 좀벌레가 튀어나온다. 재료가 그냥 돌이라 가장 싼 물약",release:"v2"},{id:"weakness",name:"나약함의 물약",from:"water_bottle",ingredient:"fermented_spider_eye",effect:"weakness",seconds:90,canAmplify:!1,_note:"어색한 물약을 거치지 않고 물병에 바로. 공격이 약해진다. 좀비 주민 치료 = 나약함 + 황금 사과 (아들 7차와 이어짐)"}],Ou={_comment:"재료 어디서 얻나 (아들 참고용, 코드는 안 읽음). '아직 없음' = 그 몹·구조물이 게임에 들어올 때 같이",nether_wart:{name:"네더 사마귀",source:"네더 요새 (영혼 모래에서 자람)"},sugar:{name:"설탕",source:"사탕수수 1 → 설탕 2 (recipes.json)"},rabbit_foot:{name:"토끼발",source:"초원 섬 토끼 (드물게)"},blaze_powder:{name:"블레이즈 가루",source:"블레이즈 막대기 1 → 가루 2 (recipes.json)"},glistering_melon:{name:"반짝이는 수박 조각",source:"수박 조각 + 금 조각 8 (recipes.json). 가이드에 있던 '수박 조각 + 발광석 가루'는 마인크래프트에 없는 식이라 뺐다"},spider_eye:{name:"거미 눈",source:"동굴 거미 (mobs.json)"},fermented_spider_eye:{name:"발효된 거미 눈",source:"거미 눈 + 설탕 + 갈색 버섯 (recipes.json)"},ghast_tear:{name:"가스트의 눈물",source:"네더 가스트"},magma_cream:{name:"마그마 크림",source:"슬라임 볼 + 블레이즈 가루 (recipes.json), 또는 네더 마그마 큐브 (아직 없음)"},pufferfish:{name:"복어",source:"바다 낚시 (초원 섬)"},golden_carrot:{name:"황금 당근",source:"당근 + 금 8 (recipes.json)"},turtle_shell:{name:"거북 등딱지",source:"인갑 5 (아기 거북이가 자라며 떨어뜨림) — 거북이 아직 없음"},phantom_membrane:{name:"팬텀 막대",source:"팬텀 — 아직 없음"},breeze_rod:{name:"브리즈 막대기",source:"시련의 방 브리즈 — 아직 없음"},cobweb:{name:"거미줄",source:"폐광·거미 왕 굴 (칼로 캔다)"},slime_block:{name:"슬라임 블록",source:"슬라임 볼 9 — 슬라임 아직 없음"},stone:{name:"돌",source:"어디든 (blocks.json)"},redstone:{name:"레드스톤 가루",source:"레드스톤 광석 (blocks.json)"},glowstone_dust:{name:"발광석 가루",source:"발광석 블록 1 → 가루 2~4 (네더 천장)"},gunpowder:{name:"화약",source:"크리퍼·가스트·마녀"},dragon_breath:{name:"드래곤의 숨결",source:"엔더 드래곤 숨결 바닥을 유리병으로 (bosses.json)"}},Lc={_comment:Iu,base:Uu,modifiers:Fu,stand:Nu,potions:Bu,ingredients:Ou},zu="제작 레시피. 드래곤 재료 중 '제작'으로 얻는 것들과 안장·도구. station = 어디서 만드나(inventory 가방 안 2×2 칸 / crafting_table 제작대 3×3 / forge 대장간 / brewing 양조기 / furnace 화로). 개수는 아빠 임시값, 아들이 바꿔도 됨. 아들 3차 디테일(2026-09-12)의 제작 사슬(종이→책→책장→인챈트 테이블)과 도구·장식 레시피 추가. 6차(2026-09-13): 가방 2×2 칸 레시피(판자·제작대·양털·염료·염색). release 없는 것은 v1. 도끼 6종(2026-09-21, 아빠 — 마인크래프트 값): 핵심 재료 3 + 막대기 2, 네더라이트만 다이아몬드 도끼 + 네더라이트(대장간). 곡괭이와 같게 나무·돌은 제작대, 쇠붙이는 대장간(M6-6). 8차(2026-09-18): 양조 물약은 data/potions.json 으로 옮겼다(양조 규칙이 따로 있어서). 여기에는 양조기와 물약 재료 만드는 법만 — water_bottle·brewing_stand·blaze_powder·fermented_spider_eye·glistering_melon·gold_nugget·magma_cream·turtle_shell(v1.1)·slime_block(v2).",Vu=JSON.parse(`[{"id":"saddle","name":"안장","station":"crafting_table","in":{"leather":5,"iron_ingot":2},"out":{"saddle":1},"_note":"안장을 만들면 드래곤을 탈 수 있다 (아들 답변 3). 가죽은 초원 섬 소"},{"id":"bucket","name":"양동이","station":"crafting_table","in":{"iron_ingot":3},"out":{"bucket":1}},{"id":"glass_bottle","name":"유리병","station":"crafting_table","in":{"glass":3},"out":{"glass_bottle":3},"_note":"드래곤의 숨결을 담는다"},{"id":"cake","name":"케이크","station":"crafting_table","in":{"wheat":3,"sugar":2,"milk_bucket":3,"egg":1},"out":{"cake":1}},{"id":"sugar","name":"설탕","station":"inventory","in":{"sugar_cane":1},"out":{"sugar":2},"_note":"아들 7차: 사탕수수 1개당 설탕 2개. 사탕수수는 물가에서 자란다"},{"id":"golden_apple","name":"황금 사과","station":"crafting_table","in":{"apple":1,"gold_ingot":8},"out":{"golden_apple":1},"_note":"아들 7차: 사과 주위로 금 8개를 두른다. 좀비 주민을 되돌린다"},{"id":"golden_carrot","name":"황금 당근","station":"crafting_table","in":{"carrot":1,"gold_ingot":8},"out":{"golden_carrot":1},"_note":"아들 7차: 당근 주위로 금 8개"},{"id":"clock","name":"시계","station":"crafting_table","in":{"gold_ingot":4,"redstone":1},"out":{"clock":1}},{"id":"tnt","name":"TNT","station":"crafting_table","in":{"gunpowder":5,"sand":4},"out":{"tnt":1}},{"id":"snow_block","name":"눈 블록","station":"crafting_table","in":{"snowball":4},"out":{"snow_block":1}},{"id":"iron_ingot","name":"철","station":"furnace","in":{"iron_ore":1,"coal":1},"out":{"iron_ingot":1}},{"id":"gold_ingot","name":"금","station":"furnace","in":{"gold_ore":1,"coal":1},"out":{"gold_ingot":1}},{"id":"netherite","name":"네더라이트","station":"forge","in":{"ancient_debris":4,"gold_ingot":4},"out":{"netherite":1}},{"id":"wooden_pickaxe","name":"나무 곡괭이","station":"crafting_table","in":{"planks":3,"stick":2},"out":{"wooden_pickaxe":1},"toolTier":0},{"id":"stone_pickaxe","name":"돌 곡괭이","station":"crafting_table","in":{"cobblestone":3,"stick":2},"out":{"stone_pickaxe":1},"toolTier":1},{"id":"iron_pickaxe","name":"철 곡괭이","station":"forge","in":{"iron_ingot":3,"stick":2},"out":{"iron_pickaxe":1},"toolTier":2},{"id":"golden_pickaxe","name":"금 곡괭이","station":"forge","in":{"gold_ingot":3,"stick":2},"out":{"golden_pickaxe":1},"toolTier":1},{"id":"diamond_pickaxe","name":"다이아몬드 곡괭이","station":"forge","in":{"diamond":3,"stick":2},"out":{"diamond_pickaxe":1},"toolTier":3},{"id":"netherite_pickaxe","name":"네더라이트 곡괭이","station":"forge","in":{"diamond_pickaxe":1,"netherite":1},"out":{"netherite_pickaxe":1},"toolTier":4},{"id":"wooden_axe","name":"나무 도끼","station":"crafting_table","in":{"planks":3,"stick":2},"out":{"wooden_axe":1},"_note":"아빠 2026-09-21 (마인크래프트 값). 나무 캐는 속도는 data/tools.json axes"},{"id":"stone_axe","name":"돌 도끼","station":"crafting_table","in":{"cobblestone":3,"stick":2},"out":{"stone_axe":1},"_note":"아빠 2026-09-21 (마인크래프트 값). 나무 캐는 속도는 data/tools.json axes"},{"id":"iron_axe","name":"철 도끼","station":"forge","in":{"iron_ingot":3,"stick":2},"out":{"iron_axe":1},"_note":"아빠 2026-09-21 (마인크래프트 값). 나무 캐는 속도는 data/tools.json axes"},{"id":"golden_axe","name":"황금 도끼","station":"forge","in":{"gold_ingot":3,"stick":2},"out":{"golden_axe":1},"_note":"아빠 2026-09-21 (마인크래프트 값). 나무 캐는 속도는 data/tools.json axes"},{"id":"diamond_axe","name":"다이아몬드 도끼","station":"forge","in":{"diamond":3,"stick":2},"out":{"diamond_axe":1},"_note":"아빠 2026-09-21 (마인크래프트 값). 나무 캐는 속도는 data/tools.json axes"},{"id":"netherite_axe","name":"네더라이트 도끼","station":"forge","in":{"diamond_axe":1,"netherite":1},"out":{"netherite_axe":1},"_note":"아빠 2026-09-21 (마인크래프트 값). 대장간에서 다이아몬드 도끼에 네더라이트를 붙인다"},{"id":"planks","name":"판자","station":"inventory","in":{"log":1},"out":{"planks":4},"_note":"아들 6차: 가방 오른쪽 2×2 칸에 원목을 두면 판자 4개"},{"id":"crafting_table","name":"제작대","station":"inventory","in":{"planks":4},"out":{"crafting_table":1},"_note":"아들 6차: 판자 4개로 제작대 1개. 제작대는 9칸(3×3)이라 여러 가지를 만들 수 있다"},{"id":"stick","name":"막대기","station":"crafting_table","in":{"planks":2},"out":{"stick":4}},{"id":"paper","name":"종이","station":"crafting_table","in":{"sugar_cane":3},"out":{"paper":3},"_note":"아들: 사탕수수 3개 → 종이"},{"id":"book","name":"책","station":"crafting_table","in":{"leather":1,"paper":3},"out":{"book":1}},{"id":"writable_book","name":"깃펜과 책","station":"crafting_table","in":{"book":1,"feather":1},"out":{"writable_book":1},"release":"v1.1","_note":"적을 수 있게 됨. 자유 채팅 없음 규칙과 충돌 → 개인 일기(남에게 안 보임) 또는 정해진 문구만. 아빠 결정"},{"id":"bookshelf","name":"책장","station":"crafting_table","in":{"planks":6,"book":3},"out":{"bookshelf":1}},{"id":"enchanting_table","name":"인챈트 테이블","station":"crafting_table","in":{"obsidian":4,"diamond":2,"book":1},"out":{"enchanting_table":1},"release":"v1.1","_note":"책장 15개를 주위 1칸 띄워 두면 최고 30레벨 인챈트 (아들). 경험치 소비처 2번"},{"id":"obsidian_from_lava","name":"흑요석 만들기","station":"world","in":{"water_bucket":1,"lava_source_block":1},"out":{"obsidian":1},"_note":"용암 블록에 물을 부으면 흑요석. 유체 흐름 없이 규칙 하나로"},{"id":"oak_stairs","name":"계단","station":"crafting_table","in":{"planks":6},"out":{"oak_stairs":4}},{"id":"oak_door","name":"문","station":"crafting_table","in":{"planks":6},"out":{"oak_door":3},"_note":"아빠 9차 확인: 판자 6개 → 문 3개 (마인크래프트와 같음)"},{"id":"oak_trapdoor","name":"다락문","station":"crafting_table","in":{"planks":6},"out":{"oak_trapdoor":2}},{"id":"oak_fence","name":"울타리","station":"crafting_table","in":{"planks":4,"stick":2},"out":{"oak_fence":3}},{"id":"sign","name":"표지판","station":"crafting_table","in":{"planks":6,"stick":1},"out":{"sign":3}},{"id":"glass","name":"유리","station":"furnace","in":{"sand":1,"coal":1},"out":{"glass":1}},{"id":"bed","name":"침대","station":"crafting_table","in":{"wool":3,"planks":3},"out":{"bed":1}},{"id":"torch","name":"횃불","station":"crafting_table","in":{"coal":1,"stick":1},"out":{"torch":4}},{"id":"chest","name":"상자","station":"crafting_table","in":{"planks":8},"out":{"chest":1}},{"id":"furnace","name":"화로","station":"crafting_table","in":{"cobblestone":8},"out":{"furnace":1}},{"id":"bow","name":"활","station":"crafting_table","in":{"stick":3,"string":3},"out":{"bow":1}},{"id":"arrow","name":"화살","station":"crafting_table","in":{"flint":1,"stick":1,"feather":1},"out":{"arrow":4}},{"id":"iron_sword","name":"철 칼","station":"forge","in":{"iron_ingot":2,"stick":1},"out":{"iron_sword":1}},{"id":"iron_chestplate","name":"철 흉갑","station":"forge","in":{"iron_ingot":8},"out":{"iron_chestplate":1}},{"id":"iron_hoe","name":"철 괭이","station":"forge","in":{"iron_ingot":2,"stick":2},"out":{"iron_hoe":1}},{"id":"iron_shovel","name":"철 삽","station":"forge","in":{"iron_ingot":1,"stick":2},"out":{"iron_shovel":1}},{"id":"flint_and_steel","name":"라이터","station":"crafting_table","in":{"iron_ingot":1,"flint":1},"out":{"flint_and_steel":1}},{"id":"fishing_rod","name":"낚싯대","station":"crafting_table","in":{"stick":3,"string":2},"out":{"fishing_rod":1}},{"id":"compass","name":"나침반","station":"crafting_table","in":{"iron_ingot":4,"redstone":1},"out":{"compass":1},"_note":"마을 포탈 방향을 가리킨다 — 원정 귀환에 유용"},{"id":"shears","name":"가위","station":"crafting_table","in":{"iron_ingot":2},"out":{"shears":1}},{"id":"carved_pumpkin","name":"조각된 호박","station":"world","in":{"pumpkin":1,"shears":1},"out":{"carved_pumpkin":1,"pumpkin_seeds":4}},{"id":"jack_o_lantern","name":"잭오랜턴","station":"crafting_table","in":{"carved_pumpkin":1,"torch":1},"out":{"jack_o_lantern":1}},{"id":"iron_block","name":"철 블록","station":"crafting_table","in":{"iron_ingot":9},"out":{"iron_block":1}},{"id":"gold_block","name":"금 블록","station":"crafting_table","in":{"gold_ingot":9},"out":{"gold_block":1}},{"id":"quartz_block","name":"석영 블록","station":"crafting_table","in":{"quartz":4},"out":{"quartz_block":1}},{"id":"netherite_block","name":"네더라이트 블록","station":"forge","in":{"netherite":9},"out":{"netherite_block":1}},{"id":"emerald_block","name":"에메랄드 블록","station":"crafting_table","in":{"emerald":9},"out":{"emerald_block":1}},{"id":"diamond_block","name":"다이아몬드 블록","station":"crafting_table","in":{"diamond":9},"out":{"diamond_block":1}},{"id":"hay_bale","name":"건초 더미","station":"crafting_table","in":{"wheat":9},"out":{"hay_bale":1}},{"id":"carrot_on_a_stick","name":"당근 낚싯대","station":"crafting_table","in":{"fishing_rod":1,"carrot":1},"out":{"carrot_on_a_stick":1},"release":"v1.1","_note":"돼지 타기"},{"id":"warped_fungus_on_a_stick","name":"뒤틀린 균 낚싯대","station":"crafting_table","in":{"fishing_rod":1,"warped_fungus":1},"out":{"warped_fungus_on_a_stick":1},"release":"v1.1","_note":"스트라이더 타기"},{"id":"firework","name":"폭죽","station":"crafting_table","in":{"paper":1,"gunpowder":1},"out":{"firework":3},"release":"v1.1","_note":"겉날개 추진"},{"id":"name_tag","name":"이름표","station":"anvil","in":{"name_tag_blank":1},"out":{"name_tag":1},"release":"v2","_note":"드래곤·동물에 이름 붙이기. 자유 입력이라 닉네임 필터 필요"},{"id":"redstone_dust","name":"레드스톤 가루","station":"world","in":{"redstone_ore":1},"out":{"redstone":4},"_note":"회로는 없음(결정 7). 시계·나침반 재료로만"},{"id":"wool_from_string","name":"양털 (거미줄)","station":"inventory","in":{"string":4},"out":{"wool":1},"_note":"아들: 거미줄(실) 4개 = 양털 1개. 6차: 가방 2×2 칸에서"},{"id":"dye_from_flower","name":"염료","station":"inventory","in":{"flower":1},"out":{"dye":3},"_note":"가방 2×2 칸에 꽃을 두면 꽃 색깔에 맞는 염료 3개 (아들 6차). 4차에선 '꽃을 부수면'이었는데 6차 방식으로"},{"id":"dye_wool","name":"양털 물들이기","station":"inventory","in":{"white_wool":1,"dye":1},"out":{"colored_wool":1},"_note":"흰 양털만 염색할 수 있다. 흰 양털 1 + 원하는 염료 1 → 그 색 양털 1 (아들 6차). 침대·깃발 색"},{"id":"ink_dye","name":"검은 염료 (먹물)","station":"crafting_table","in":{"ink_sac":1},"out":{"black_dye":1}},{"id":"shield","name":"방패","station":"crafting_table","in":{"planks":6,"iron_ingot":1},"out":{"shield":1},"_note":"막기 — 폰에서는 웅크리기 길게 누르기"},{"id":"boat","name":"보트","station":"crafting_table","in":{"planks":5},"out":{"boat":1},"release":"v1.1","_note":"몹을 태울 수 있음 (아들). 강·바다"},{"id":"minecart","name":"수레","station":"forge","in":{"iron_ingot":5},"out":{"minecart":1},"release":"v1.1"},{"id":"rail","name":"철도","station":"forge","in":{"iron_ingot":6,"stick":1},"out":{"rail":16},"release":"v1.1","_note":"수레+철도 이동. 마을 안 순환선 아이디어"},{"id":"spear","name":"창","station":"forge","in":{"iron_ingot":1,"stick":2},"out":{"spear":1},"_note":"아들: 창이 있다. 칼보다 사거리 길고 느림. 던지기 가능 여부는 아들에게"},{"id":"water_bottle","name":"물병","station":"world","in":{"glass_bottle":1,"water_source_block":1},"out":{"water_bottle":1},"_note":"유리병을 들고 물을 누르면 물병. 물은 없어지지 않음. 양조의 시작 (potions.json)"},{"id":"brewing_stand","name":"양조기","station":"crafting_table","in":{"blaze_rod":1,"cobblestone":3},"out":{"brewing_stand":1},"_note":"아빠 9차: 제작대 가운데 줄에 블레이즈 막대기 1, 그 아래 줄에 조약돌 3 (흑암·조잡한 심층암 같은 돌 계열도 됨). 연료는 블레이즈 가루, 병 자리 3개 — potions.json stand. 엔드 시티 입구에도 있음(아들 3차)"},{"id":"blaze_powder","name":"블레이즈 가루","station":"inventory","in":{"blaze_rod":1},"out":{"blaze_powder":2},"_note":"양조기 연료이자 힘의 물약 재료. 블레이즈 막대기는 네더 블레이즈 (화염 드래곤 재료와 같은 아이템)"},{"id":"fermented_spider_eye","name":"발효된 거미 눈","station":"crafting_table","in":{"spider_eye":1,"sugar":1,"brown_mushroom":1},"out":{"fermented_spider_eye":1},"_note":"물약을 반대로 뒤집는 재료 (신속→감속, 치유→고통, 야간 투시→투명화, 물병→나약함)"},{"id":"glistering_melon","name":"반짝이는 수박 조각","station":"crafting_table","in":{"melon_slice":1,"gold_nugget":8},"out":{"glistering_melon":1},"_note":"치유의 물약 재료. 수박 조각 주위로 금 조각 8개. (가이드의 \\"수박 조각 + 발광석 가루\\"는 마인크래프트에 없는 식)"},{"id":"gold_nugget","name":"금 조각","station":"inventory","in":{"gold_ingot":1},"out":{"gold_nugget":9},"_note":"금 주괴 1 → 금 조각 9. 반대로 조각 9 → 주괴 1 도 됨"},{"id":"magma_cream","name":"마그마 크림","station":"inventory","in":{"slime_ball":1,"blaze_powder":1},"out":{"magma_cream":1},"_note":"화염 저항의 물약 재료. 네더 마그마 큐브가 생기면 거기서도 나옴"},{"id":"turtle_shell","name":"거북 등딱지","station":"crafting_table","in":{"scute":5},"out":{"turtle_shell":1},"release":"v1.1","_note":"거북 도사의 물약 재료. 인갑은 아기 거북이가 자라며 떨어뜨림 — 거북이가 게임에 들어올 때"},{"id":"slime_block","name":"슬라임 블록","station":"crafting_table","in":{"slime_ball":9},"out":{"slime_block":1},"release":"v2","_note":"장역화 물약 재료 (1.21). 슬라임이 게임에 들어올 때"}]`),Ic={_comment:zu,recipes:Vu},Gu="레드스톤 부품 (마인크래프트 규칙, 아빠 9차 디테일 2026-09-19). 네 가지로 나눈다: power 전원(신호를 만든다) / wire 전송·제어(신호를 옮기고 바꾼다) / input 입력·감지(플레이어·환경이 신호를 켠다) / machine 기계(신호를 받아 움직인다). signal = 내보내는 신호 세기(0~15, 없으면 안 냄). does = 뭘 하는지 한 줄(아들이 고쳐도 됨). release 없는 것은 v1.1(문·레버·버튼·압력판·조명·TNT·레일처럼 신호 하나로 켜고 끄는 것), v2 는 회로(중계기·비교기·관측기·피스톤·호퍼처럼 틱 단위 시뮬이 필요한 것). 신호는 가루 1칸마다 1씩 줄어 15칸까지. 블록은 그 버전에 blocks.json 에 그림과 함께 넣는다.",Hu={maxSignal:15,wireLossPerBlock:1,tickMs:100,_note:"레드스톤 틱 = 0.1초(게임 틱 2개). 중계기 지연 1~4 틱"},Wu=[{id:"redstone_block",name:"레드스톤 블록",category:"power",signal:15,does:"놓아두면 항상 주변에 최대 신호를 준다",release:"v2"},{id:"redstone_torch",name:"레드스톤 횃불",category:"power",signal:15,does:"항상 켜져 있다가, 붙어 있는 블록에 신호가 들어오면 꺼진다 (NOT 게이트)",release:"v2"},{id:"redstone_wire",name:"레드스톤 가루",category:"wire",does:"전선. 1칸마다 신호가 1씩 줄어 15칸까지 간다",release:"v2",_note:"재료 자체(레드스톤 광석 → 가루 4)는 v1 (recipes.json redstone_dust). 바닥에 놓아 전선으로 쓰는 것이 v2"},{id:"repeater",name:"레드스톤 중계기",category:"wire",signal:15,does:"약해진 신호를 다시 15로. 지연 1~4틱. 옆에서 신호를 주면 잠긴다",release:"v2"},{id:"comparator",name:"레드스톤 비교기",category:"wire",does:"신호 세기를 비교하거나 뺀다. 상자·호퍼 안 아이템 양을 신호 세기로 바꾼다",release:"v2"},{id:"observer",name:"관측기",category:"wire",signal:15,does:"앞 블록이 바뀌면 뒤로 1틱짜리 짧은 신호를 낸다",release:"v2"},{id:"lever",name:"레버",category:"input",signal:15,does:"누르면 켜지고 다시 누르면 꺼진다. 신호를 유지할 때"},{id:"button",name:"버튼",category:"input",signal:15,does:"누르면 잠깐(나무 1.5초, 돌 1초)만 신호를 내고 꺼진다",variants:["wood","stone"]},{id:"pressure_plate",name:"압력판",category:"input",signal:15,does:"플레이어·몹·아이템이 올라가면 신호. 나무는 아이템도, 돌은 플레이어·몹만",variants:["wood","stone"]},{id:"weighted_pressure_plate",name:"무게 압력판",category:"input",does:"올라간 것의 수에 따라 신호 세기가 달라진다 (금은 조금만 올라가도 세고, 철은 많이 올라가야)",variants:["gold","iron"],release:"v2"},{id:"daylight_sensor",name:"햇빛 감지기",category:"input",does:"해 높이에 따라 신호 세기가 바뀐다. 뒤집으면 밤에 켜진다 (밤에 자동 가로등)",_note:"원정지는 낮→밤이 흐르므로(ARCHITECTURE 지형) 원정에서 쓸모. 마을은 밤이 없으면 항상 낮"},{id:"tripwire_hook",name:"철사 덫 갈고리",category:"input",signal:15,does:"실로 둘을 이으면 누가 실을 건널 때 신호",_note:'아들 9차 1순위 "침입자 경보기" 재료라 v1.1 로 앞당김'},{id:"target",name:"과녁",category:"input",does:"화살이 가운데에 가까이 맞을수록 센 신호",release:"v2"},{id:"piston",name:"피스톤",category:"machine",does:"신호를 받으면 앞으로 나가 블록을 12개까지 민다",release:"v2"},{id:"sticky_piston",name:"끈끈이 피스톤",category:"machine",does:"피스톤 + 슬라임 볼. 돌아올 때 앞 블록을 같이 당겨온다",release:"v2"},{id:"dispenser",name:"발사기",category:"machine",does:"안에 든 것을 쏘거나 쓴다 (화살은 발사, 물 양동이는 물을 놓음, 물약은 던짐)",release:"v2"},{id:"dropper",name:"공급기",category:"machine",does:"안에 든 것을 그냥 앞으로 떨어뜨리거나 앞 상자에 넣는다",release:"v2"},{id:"hopper",name:"호퍼",category:"machine",does:"위에 떨어진 아이템을 모아 아래·앞 상자로 옮기는 관. 신호를 받으면 멈춘다",release:"v2"},{id:"powered_rail",name:"전동 레일",category:"machine",does:"신호를 받으면 지나가는 수레를 빨라지게 밀어준다",_note:"아들 3차 수레·철도(v1.1)와 함께"},{id:"detector_rail",name:"탐지 레일",category:"machine",signal:15,does:"수레가 지나갈 때 신호를 낸다"},{id:"activator_rail",name:"활성화 레일",category:"machine",does:"TNT 수레를 터뜨리고, 호퍼 수레를 켜고 끈다",release:"v2"},{id:"redstone_lamp",name:"레드스톤 조명",category:"machine",does:"신호를 받으면 불이 켜진다 (발광석 1 + 레드스톤 4)"},{id:"copper_bulb",name:"구리 전구",category:"machine",does:"신호가 올 때마다 켜짐↔꺼짐이 바뀐다 (1.21). 오래되면 색이 변함",release:"v2"},{id:"note_block",name:"소리 블록",category:"machine",does:"신호를 받을 때마다 정해진 음높이로 소리. 아래 블록에 따라 악기가 다르다"},{id:"tnt",name:"TNT",category:"machine",does:"신호를 받거나 불이 붙으면 4초 뒤 폭발",_note:"폭발 드래곤 재료 (recipes.json tnt). 아들 9차: 마을에서는 몹이 공격할 때(방어전) TNT 를 쏘고 싶다 → 마을 안 TNT 는 몹만 다치고 블록은 안 부순다(보호 구역, 아빠 확인 필요). 결정 #64"},{id:"iron_door",name:"철문",category:"machine",does:"손으로는 안 열리고 레드스톤 신호로만 열린다. 나무 문·다락문·울타리 문도 신호로 열 수 있다"}],Xu={_comment:"아들 9차(2026-09-19) — 레드스톤으로 제일 먼저 만들고 싶은 것, 순서대로. version = 재료가 다 들어오는 가장 이른 버전",list:[{rank:1,name:"침입자 경보기",parts:["tripwire_hook","pressure_plate","note_block","redstone_lamp"],version:"v1.1",_note:"실을 건너거나 압력판을 밟으면 소리 블록 + 조명. 회로 없이 신호 하나로 됨"},{rank:2,name:"용암 함정",parts:["pressure_plate","iron_door","dispenser"],version:"v1.1 (다락문식) / v2 (발사기식)",_note:"압력판 → 철 다락문이 열려 용암 구덩이로(v1.1). 발사기가 용암 양동이를 쏘는 식은 v2"},{rank:3,name:"아이템 분류기",parts:["hopper","comparator","repeater","redstone_torch"],version:"v2",_note:"호퍼 + 비교기 회로. 상자 시스템(M4)과 회로 시뮬(v2)이 둘 다 필요"}]},Yu={_comment:Gu,rules:Hu,parts:Wu,sonWishlist:Xu},qu="아빠가 마을 사람 모두에게 한 번씩 주는 선물. 다음에 게임에 들어올 때 가방에 들어온다. 한 사람이 같은 선물을 두 번 받지는 않는다(id 로 기억). 새 선물을 주려면 아래 목록에 새 id 로 한 덩어리를 더한다. 이미 준 선물의 id 를 바꾸면 그 선물을 다시 준다.",Ku=[{id:"iron_axe_2026_09_21",name:"철 도끼",message:"아빠가 철 도끼를 하나 줬어요! 가방을 열어 보세요",items:{iron_axe:1}}],Qu={_comment:qu,gifts:Ku},ju="처음 마을에 들어올 때 한 번 받는 시작 키트 (아빠 결정 2026-09-19, 서바이벌 전환 #66·#67). 아이템 id: 개수. 아들이 바꿔도 됨. 가방 한 칸은 64개까지, 칸은 37개.",Ju={planks:32,log:8,dirt:32,cobblestone:32,torch:8,glass:8,crafting_table:1,bucket:1},Zu={_comment:ju,items:Ju},$u='곡괭이·도끼 — 곡괭이는 아들 설계(2026-09-20), 도끼는 아빠가 준 마인크래프트 값(2026-09-21). speed = 맨손으로 돌을 캘 때보다 몇 배 빠른가(곡괭이가 필요한 블록에만). tier = 캘 수 있는 등급: blocks.json 의 toolTier 가 이 값 이하인 블록만 캘 수 있다(맨손은 toolTier 0 만). obsidianSpeed = 흑요석을 캘 때 속도(맨손으로 돌 캐는 속도 기준 배수) — 없으면 흑요석을 못 캔다. durability = 내구도(쓸 수 있는 횟수, 대장간·수리와 함께 M6-6 에서 적용 예정). enchantSpeedPerLevel = 인챈트 한 단계마다 곱하는 속도(인챈트는 v1.1). 네더라이트 광석(ancient_debris)은 네더에만 있다(네더 원정지는 v1.1). 도끼(axes)는 나무 계열 블록(blocks.json tool: "axe" — 원목·판자·문·상자·제작대·호박 등)을 speed 배 빨리 캔다. 도끼는 등급 제한이 없다(나무는 맨손으로도 캔다). 금 도끼가 가장 빠르고 네더라이트·다이아몬드 순이다.',ef=1.5,tf=[{id:"wooden_axe",name:"나무 도끼",tier:0,speed:2,durability:59,_note:"판자 3 + 막대기 2. 맨손의 2배"},{id:"stone_axe",name:"돌 도끼",tier:1,speed:4,durability:131,_note:"조약돌 3 + 막대기 2"},{id:"iron_axe",name:"철 도끼",tier:2,speed:6,durability:250,_note:"철 주괴 3 + 막대기 2"},{id:"golden_axe",name:"황금 도끼",tier:2,speed:12,durability:32,_note:"금 주괴 3 + 막대기 2. 가장 빠르지만 금방 닳는다"},{id:"diamond_axe",name:"다이아몬드 도끼",tier:3,speed:8,durability:1561,_note:"다이아몬드 3 + 막대기 2"},{id:"netherite_axe",name:"네더라이트 도끼",tier:4,speed:9,durability:2031,_note:"다이아몬드 도끼 1 + 네더라이트 주괴 1 (대장간)"}],nf=[{id:"wooden_pickaxe",name:"나무 곡괭이",tier:0,speed:1.5,durability:59,_note:"돌 캐는 속도 1.5배. 광석은 못 캔다"},{id:"stone_pickaxe",name:"돌 곡괭이",tier:1,speed:3,durability:131,_note:"나무의 2배. 석탄·철·청금석·석영 광석까지"},{id:"iron_pickaxe",name:"철 곡괭이",tier:2,speed:7.5,durability:250,_note:"돌의 2.5배. 모든 광석"},{id:"golden_pickaxe",name:"금 곡괭이",tier:2,speed:7,durability:32,_note:"철보다 살짝 느리고 내구도는 매우 약함. 모든 광석"},{id:"diamond_pickaxe",name:"다이아몬드 곡괭이",tier:3,speed:18.75,obsidianSpeed:1.5,durability:1561,_note:"철의 2.5배. 흑요석은 나무 곡괭이로 돌 캐는 속도"},{id:"netherite_pickaxe",name:"네더라이트 곡괭이",tier:4,speed:37.5,obsidianSpeed:3,durability:2031,_note:"다이아몬드의 2배. 흑요석은 돌 곡괭이로 돌 캐는 속도"}],sf={_comment:$u,enchantSpeedPerLevel:ef,axes:tf,pickaxes:nf},rf="경험치 시스템 — 마인크래프트 Java 수치 기반. 레벨 공식은 코드(shared/rules/xp.ts)에 있고 여기엔 '얻는 양'과 '쓰는 양'만. 범위값은 [최소, 최대]에서 무작위(서버 시드 PRNG). 아들이 숫자를 바꿔도 된다. 설명은 docs/XP-SYSTEM.md.",of="minecraft-java",af={_comment:"블록을 캐면 바로 나오는 경험치 (마인크래프트 값)",coal_ore:[0,2],redstone_ore:[1,5],diamond_ore:[3,7],nether_quartz_ore:[2,5],iron_ore:[0,0],gold_ore:[0,0],ancient_debris:[0,0],lapis_ore:[2,5],emerald_ore:[3,7]},lf={_comment:"화로에서 꺼낼 때 개당 경험치 (소수는 누적 후 버림)",iron_ingot:.7,gold_ingot:1,netherite_scrap:2},cf={_comment:"처치 시 경험치 (마인크래프트 값). ender_dragon은 6명 협동 보스라 마인크래프트 첫 처치 12000 대신 각자 500",zombie:5,skeleton:5,creeper:5,spider:5,enderman:5,husk:5,stray:5,wither_skeleton:5,blaze:10,ghast:5,cow:[1,3],chicken:[1,3],sheep:[1,3],ender_dragon:500},df={breeding:[1,7],fishing:[1,6],trading:[3,6]},hf={_comment:"이 게임 고유 항목 (마인크래프트에 없음)",expeditionReturn:10,treasureChestOpen:5,codexNewEntry:5,dragonHatchedPerTier:5,dragonGrownPerTier:3,allDragonsCollected:300,allDragonsTitle:"드래곤 마스터",fourKingsDefeated:300,fourKingsTitle:"마을의 수호자",spawnerBreak:[15,43],_spawnerNote:"폐광 몹 스포너를 캐면 (마인크래프트 값). v1.1"},uf={1:1,2:1,3:1,4:2,5:3,6:3,7:3,8:5,9:5,10:5,11:5,12:8,13:8,14:8,15:10,16:15,_comment:"알을 부화시킬 때 소모하는 레벨 (마인크래프트 인챈트처럼 레벨 단위 차감). 티어는 dragons.json"},ff={5:"hat_basic",10:"cape_basic",20:"particle_trail",30:"title_veteran"},pf={_comment:"마인크래프트 규칙: 7×레벨(최대 100)을 구슬로 드롭, 레벨 0. 구슬은 회수 가능. 아들이 가혹하다고 하면 dropsXp를 false로",dropsXp:!0,dropPerLevel:7,dropMax:100,orbsRecoverable:!0,orbsExpireWithExpedition:!0},mf={_comment:"연출용. 서버는 수치만, 클라이언트가 구슬을 그린다",color:"#7FFF00",pickupSound:"orb_pickup",pitchJitter:.25,levelUpSound:"levelup"},gf={_comment:"보스 처치 경험치 (bosses.json과 동일값 유지). 협동이라 참가자 전원 각각",spider_king:80,evoker:100,giant_ghast:100,giant_gorilla:150,giant_warden:200,ender_dragon:500,skeleton_king:300,creeper_king:300,enderman_king:300,zombie_king:300,raidWinEach:50},_f={_comment:rf,levelFormula:of,mining:af,smelting:lf,mobs:cf,misc:df,ours:hf,hatchLevelCostByTier:uf,cosmeticUnlocksByLevel:ff,death:pf,orbs:mf,bosses:gf},vf=Td(Qh),Af=Rd(Zh),xf=Md(Lc);Id(Yu);const bf=kd(gu),dn=Ed(kc),yf=new yd([...Sd(Ic).defs,...wd(dn)]),Va=Dd(Lu),Ga=Ld(Ru),Ef=Pd(sf),fr=Cd(_f);Ud(iu,fr.mobs);Fd(Zu);Nd(Qu);const Eo=Rh({recipes:Ic,dragons:kc,potions:Lc});for(const s of dn.list)Eo.set(Bd(s.id),`${s.name} 알`);const ma="180",Mf=0,Ha=1,Sf=2,Uc=1,wf=2,Dn=3,Un=0,Ot=1,Jt=2,Wn=0,Oi=1,Vi=2,Wa=3,Xa=4,Tf=5,ri=100,Cf=101,Rf=102,Df=103,Pf=104,kf=200,Lf=201,If=202,Uf=203,Mo=204,So=205,Ff=206,Nf=207,Bf=208,Of=209,zf=210,Vf=211,Gf=212,Hf=213,Wf=214,wo=0,To=1,Co=2,Gi=3,Ro=4,Do=5,Po=6,ko=7,Fc=0,Xf=1,Yf=2,Xn=0,qf=1,Kf=2,Qf=3,jf=4,Jf=5,Zf=6,$f=7,Nc=300,Hi=301,Wi=302,Lo=303,Io=304,Rr=306,_s=1e3,ai=1001,Uo=1002,Gt=1003,ep=1004,ds=1005,fn=1006,Or=1007,li=1008,bn=1009,Bc=1010,Oc=1011,vs=1012,ga=1013,ci=1014,kn=1015,Ms=1016,_a=1017,va=1018,As=1020,zc=35902,Vc=35899,Gc=1021,Hc=1022,on=1023,xs=1026,bs=1027,Wc=1028,Aa=1029,Xc=1030,xa=1031,ba=1033,pr=33776,mr=33777,gr=33778,_r=33779,Fo=35840,No=35841,Bo=35842,Oo=35843,zo=36196,Vo=37492,Go=37496,Ho=37808,Wo=37809,Xo=37810,Yo=37811,qo=37812,Ko=37813,Qo=37814,jo=37815,Jo=37816,Zo=37817,$o=37818,ea=37819,ta=37820,na=37821,ia=36492,sa=36494,ra=36495,oa=36283,aa=36284,la=36285,ca=36286,tp=3200,np=3201,ip=0,sp=1,Pn="",jt="srgb",Xi="srgb-linear",br="linear",ft="srgb",_i=7680,Ya=519,rp=512,op=513,ap=514,Yc=515,lp=516,cp=517,dp=518,hp=519,da=35044,yr="300 es",xn=2e3,Er=2001;class qi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,e);e.target=null}}}const kt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let qa=1234567;const ms=Math.PI/180,ys=180/Math.PI;function Ln(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(kt[s&255]+kt[s>>8&255]+kt[s>>16&255]+kt[s>>24&255]+"-"+kt[e&255]+kt[e>>8&255]+"-"+kt[e>>16&15|64]+kt[e>>24&255]+"-"+kt[t&63|128]+kt[t>>8&255]+"-"+kt[t>>16&255]+kt[t>>24&255]+kt[n&255]+kt[n>>8&255]+kt[n>>16&255]+kt[n>>24&255]).toLowerCase()}function nt(s,e,t){return Math.max(e,Math.min(t,s))}function ya(s,e){return(s%e+e)%e}function up(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function fp(s,e,t){return s!==e?(t-s)/(e-s):0}function gs(s,e,t){return(1-t)*s+t*e}function pp(s,e,t,n){return gs(s,e,1-Math.exp(-t*n))}function mp(s,e=1){return e-Math.abs(ya(s,e*2)-e)}function gp(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function _p(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function vp(s,e){return s+Math.floor(Math.random()*(e-s+1))}function Ap(s,e){return s+Math.random()*(e-s)}function xp(s){return s*(.5-Math.random())}function bp(s){s!==void 0&&(qa=s);let e=qa+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function yp(s){return s*ms}function Ep(s){return s*ys}function Mp(s){return(s&s-1)===0&&s!==0}function Sp(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function wp(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Tp(s,e,t,n,i){const r=Math.cos,o=Math.sin,a=r(t/2),u=o(t/2),d=r((e+n)/2),h=o((e+n)/2),l=r((e-n)/2),c=o((e-n)/2),f=r((n-e)/2),g=o((n-e)/2);switch(i){case"XYX":s.set(a*h,u*l,u*c,a*d);break;case"YZY":s.set(u*c,a*h,u*l,a*d);break;case"ZXZ":s.set(u*l,u*c,a*h,a*d);break;case"XZX":s.set(a*h,u*g,u*f,a*d);break;case"YXY":s.set(u*f,a*h,u*g,a*d);break;case"ZYZ":s.set(u*g,u*f,a*h,a*d);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function un(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function ht(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Cp={DEG2RAD:ms,RAD2DEG:ys,generateUUID:Ln,clamp:nt,euclideanModulo:ya,mapLinear:up,inverseLerp:fp,lerp:gs,damp:pp,pingpong:mp,smoothstep:gp,smootherstep:_p,randInt:vp,randFloat:Ap,randFloatSpread:xp,seededRandom:bp,degToRad:yp,radToDeg:Ep,isPowerOfTwo:Mp,ceilPowerOfTwo:Sp,floorPowerOfTwo:wp,setQuaternionFromProperEuler:Tp,normalize:ht,denormalize:un};class Ze{constructor(e=0,t=0){Ze.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(nt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*i+e.x,this.y=r*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ss{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,o,a){let u=n[i+0],d=n[i+1],h=n[i+2],l=n[i+3];const c=r[o+0],f=r[o+1],g=r[o+2],_=r[o+3];if(a===0){e[t+0]=u,e[t+1]=d,e[t+2]=h,e[t+3]=l;return}if(a===1){e[t+0]=c,e[t+1]=f,e[t+2]=g,e[t+3]=_;return}if(l!==_||u!==c||d!==f||h!==g){let m=1-a;const p=u*c+d*f+h*g+l*_,w=p>=0?1:-1,E=1-p*p;if(E>Number.EPSILON){const k=Math.sqrt(E),v=Math.atan2(k,p*w);m=Math.sin(m*v)/k,a=Math.sin(a*v)/k}const y=a*w;if(u=u*m+c*y,d=d*m+f*y,h=h*m+g*y,l=l*m+_*y,m===1-a){const k=1/Math.sqrt(u*u+d*d+h*h+l*l);u*=k,d*=k,h*=k,l*=k}}e[t]=u,e[t+1]=d,e[t+2]=h,e[t+3]=l}static multiplyQuaternionsFlat(e,t,n,i,r,o){const a=n[i],u=n[i+1],d=n[i+2],h=n[i+3],l=r[o],c=r[o+1],f=r[o+2],g=r[o+3];return e[t]=a*g+h*l+u*f-d*c,e[t+1]=u*g+h*c+d*l-a*f,e[t+2]=d*g+h*f+a*c-u*l,e[t+3]=h*g-a*l-u*c-d*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,o=e._order,a=Math.cos,u=Math.sin,d=a(n/2),h=a(i/2),l=a(r/2),c=u(n/2),f=u(i/2),g=u(r/2);switch(o){case"XYZ":this._x=c*h*l+d*f*g,this._y=d*f*l-c*h*g,this._z=d*h*g+c*f*l,this._w=d*h*l-c*f*g;break;case"YXZ":this._x=c*h*l+d*f*g,this._y=d*f*l-c*h*g,this._z=d*h*g-c*f*l,this._w=d*h*l+c*f*g;break;case"ZXY":this._x=c*h*l-d*f*g,this._y=d*f*l+c*h*g,this._z=d*h*g+c*f*l,this._w=d*h*l-c*f*g;break;case"ZYX":this._x=c*h*l-d*f*g,this._y=d*f*l+c*h*g,this._z=d*h*g-c*f*l,this._w=d*h*l+c*f*g;break;case"YZX":this._x=c*h*l+d*f*g,this._y=d*f*l+c*h*g,this._z=d*h*g-c*f*l,this._w=d*h*l-c*f*g;break;case"XZY":this._x=c*h*l-d*f*g,this._y=d*f*l-c*h*g,this._z=d*h*g+c*f*l,this._w=d*h*l+c*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],o=t[1],a=t[5],u=t[9],d=t[2],h=t[6],l=t[10],c=n+a+l;if(c>0){const f=.5/Math.sqrt(c+1);this._w=.25/f,this._x=(h-u)*f,this._y=(r-d)*f,this._z=(o-i)*f}else if(n>a&&n>l){const f=2*Math.sqrt(1+n-a-l);this._w=(h-u)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+d)/f}else if(a>l){const f=2*Math.sqrt(1+a-n-l);this._w=(r-d)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(u+h)/f}else{const f=2*Math.sqrt(1+l-n-a);this._w=(o-i)/f,this._x=(r+d)/f,this._y=(u+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(nt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,o=e._w,a=t._x,u=t._y,d=t._z,h=t._w;return this._x=n*h+o*a+i*d-r*u,this._y=i*h+o*u+r*a-n*d,this._z=r*h+o*d+n*u-i*a,this._w=o*h-n*a-i*u-r*d,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,r=this._z,o=this._w;let a=o*e._w+n*e._x+i*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;const u=1-a*a;if(u<=Number.EPSILON){const f=1-t;return this._w=f*o+t*this._w,this._x=f*n+t*this._x,this._y=f*i+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}const d=Math.sqrt(u),h=Math.atan2(d,a),l=Math.sin((1-t)*h)/d,c=Math.sin(t*h)/d;return this._w=o*l+this._w*c,this._x=n*l+this._x*c,this._y=i*l+this._y*c,this._z=r*l+this._z*c,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class G{constructor(e=0,t=0,n=0){G.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ka.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ka.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,o=e.y,a=e.z,u=e.w,d=2*(o*i-a*n),h=2*(a*t-r*i),l=2*(r*n-o*t);return this.x=t+u*d+o*l-a*h,this.y=n+u*h+a*d-r*l,this.z=i+u*l+r*h-o*d,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this.z=nt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this.z=nt(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,o=t.x,a=t.y,u=t.z;return this.x=i*u-r*a,this.y=r*o-n*u,this.z=n*a-i*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return zr.copy(this).projectOnVector(e),this.sub(zr)}reflect(e){return this.sub(zr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(nt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const zr=new G,Ka=new Ss;class Ke{constructor(e,t,n,i,r,o,a,u,d){Ke.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,u,d)}set(e,t,n,i,r,o,a,u,d){const h=this.elements;return h[0]=e,h[1]=i,h[2]=a,h[3]=t,h[4]=r,h[5]=u,h[6]=n,h[7]=o,h[8]=d,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[3],u=n[6],d=n[1],h=n[4],l=n[7],c=n[2],f=n[5],g=n[8],_=i[0],m=i[3],p=i[6],w=i[1],E=i[4],y=i[7],k=i[2],v=i[5],S=i[8];return r[0]=o*_+a*w+u*k,r[3]=o*m+a*E+u*v,r[6]=o*p+a*y+u*S,r[1]=d*_+h*w+l*k,r[4]=d*m+h*E+l*v,r[7]=d*p+h*y+l*S,r[2]=c*_+f*w+g*k,r[5]=c*m+f*E+g*v,r[8]=c*p+f*y+g*S,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],u=e[6],d=e[7],h=e[8];return t*o*h-t*a*d-n*r*h+n*a*u+i*r*d-i*o*u}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],u=e[6],d=e[7],h=e[8],l=h*o-a*d,c=a*u-h*r,f=d*r-o*u,g=t*l+n*c+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=l*_,e[1]=(i*d-h*n)*_,e[2]=(a*n-i*o)*_,e[3]=c*_,e[4]=(h*t-i*u)*_,e[5]=(i*r-a*t)*_,e[6]=f*_,e[7]=(n*u-d*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,o,a){const u=Math.cos(r),d=Math.sin(r);return this.set(n*u,n*d,-n*(u*o+d*a)+o+e,-i*d,i*u,-i*(-d*o+u*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Vr.makeScale(e,t)),this}rotate(e){return this.premultiply(Vr.makeRotation(-e)),this}translate(e,t){return this.premultiply(Vr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Vr=new Ke;function qc(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Mr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Rp(){const s=Mr("canvas");return s.style.display="block",s}const Qa={};function Es(s){s in Qa||(Qa[s]=!0,console.warn(s))}function Dp(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const ja=new Ke().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ja=new Ke().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Pp(){const s={enabled:!0,workingColorSpace:Xi,spaces:{},convert:function(i,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===ft&&(i.r=In(i.r),i.g=In(i.g),i.b=In(i.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ft&&(i.r=zi(i.r),i.g=zi(i.g),i.b=zi(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Pn?br:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,o){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return Es("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return Es("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[Xi]:{primaries:e,whitePoint:n,transfer:br,toXYZ:ja,fromXYZ:Ja,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:jt},outputColorSpaceConfig:{drawingBufferColorSpace:jt}},[jt]:{primaries:e,whitePoint:n,transfer:ft,toXYZ:ja,fromXYZ:Ja,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:jt}}}),s}const rt=Pp();function In(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function zi(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let vi;class kp{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{vi===void 0&&(vi=Mr("canvas")),vi.width=e.width,vi.height=e.height;const i=vi.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=vi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Mr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=In(r[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(In(t[n]/255)*255):t[n]=In(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Lp=0;class Ea{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Lp++}),this.uuid=Ln(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(Gr(i[o].image)):r.push(Gr(i[o]))}else r=Gr(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function Gr(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?kp.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Ip=0;const Hr=new G;class zt extends qi{constructor(e=zt.DEFAULT_IMAGE,t=zt.DEFAULT_MAPPING,n=ai,i=ai,r=fn,o=li,a=on,u=bn,d=zt.DEFAULT_ANISOTROPY,h=Pn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ip++}),this.uuid=Ln(),this.name="",this.source=new Ea(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=d,this.format=a,this.internalFormat=null,this.type=u,this.offset=new Ze(0,0),this.repeat=new Ze(1,1),this.center=new Ze(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Hr).x}get height(){return this.source.getSize(Hr).y}get depth(){return this.source.getSize(Hr).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Nc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case _s:e.x=e.x-Math.floor(e.x);break;case ai:e.x=e.x<0?0:1;break;case Uo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case _s:e.y=e.y-Math.floor(e.y);break;case ai:e.y=e.y<0?0:1;break;case Uo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}zt.DEFAULT_IMAGE=null;zt.DEFAULT_MAPPING=Nc;zt.DEFAULT_ANISOTROPY=1;class Et{constructor(e=0,t=0,n=0,i=1){Et.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const u=e.elements,d=u[0],h=u[4],l=u[8],c=u[1],f=u[5],g=u[9],_=u[2],m=u[6],p=u[10];if(Math.abs(h-c)<.01&&Math.abs(l-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+c)<.1&&Math.abs(l+_)<.1&&Math.abs(g+m)<.1&&Math.abs(d+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const E=(d+1)/2,y=(f+1)/2,k=(p+1)/2,v=(h+c)/4,S=(l+_)/4,R=(g+m)/4;return E>y&&E>k?E<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(E),i=v/n,r=S/n):y>k?y<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(y),n=v/i,r=R/i):k<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(k),n=S/r,i=R/r),this.set(n,i,r,t),this}let w=Math.sqrt((m-g)*(m-g)+(l-_)*(l-_)+(c-h)*(c-h));return Math.abs(w)<.001&&(w=1),this.x=(m-g)/w,this.y=(l-_)/w,this.z=(c-h)/w,this.w=Math.acos((d+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=nt(this.x,e.x,t.x),this.y=nt(this.y,e.y,t.y),this.z=nt(this.z,e.z,t.z),this.w=nt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=nt(this.x,e,t),this.y=nt(this.y,e,t),this.z=nt(this.z,e,t),this.w=nt(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(nt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Up extends qi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:fn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Et(0,0,e,t),this.scissorTest=!1,this.viewport=new Et(0,0,e,t);const i={width:e,height:t,depth:n.depth},r=new zt(i);this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:fn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isArrayTexture=this.textures[i].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new Ea(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class di extends Up{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Ma extends zt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Gt,this.minFilter=Gt,this.wrapR=ai,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Fp extends zt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Gt,this.minFilter=Gt,this.wrapR=ai,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ws{constructor(e=new G(1/0,1/0,1/0),t=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(an.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(an.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=an.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,an):an.fromBufferAttribute(r,o),an.applyMatrix4(e.matrixWorld),this.expandByPoint(an);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ns.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ns.copy(n.boundingBox)),Ns.applyMatrix4(e.matrixWorld),this.union(Ns)}const i=e.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,an),an.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ts),Bs.subVectors(this.max,ts),Ai.subVectors(e.a,ts),xi.subVectors(e.b,ts),bi.subVectors(e.c,ts),Bn.subVectors(xi,Ai),On.subVectors(bi,xi),Kn.subVectors(Ai,bi);let t=[0,-Bn.z,Bn.y,0,-On.z,On.y,0,-Kn.z,Kn.y,Bn.z,0,-Bn.x,On.z,0,-On.x,Kn.z,0,-Kn.x,-Bn.y,Bn.x,0,-On.y,On.x,0,-Kn.y,Kn.x,0];return!Wr(t,Ai,xi,bi,Bs)||(t=[1,0,0,0,1,0,0,0,1],!Wr(t,Ai,xi,bi,Bs))?!1:(Os.crossVectors(Bn,On),t=[Os.x,Os.y,Os.z],Wr(t,Ai,xi,bi,Bs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,an).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(an).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Sn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Sn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Sn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Sn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Sn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Sn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Sn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Sn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Sn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Sn=[new G,new G,new G,new G,new G,new G,new G,new G],an=new G,Ns=new ws,Ai=new G,xi=new G,bi=new G,Bn=new G,On=new G,Kn=new G,ts=new G,Bs=new G,Os=new G,Qn=new G;function Wr(s,e,t,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Qn.fromArray(s,r);const a=i.x*Math.abs(Qn.x)+i.y*Math.abs(Qn.y)+i.z*Math.abs(Qn.z),u=e.dot(Qn),d=t.dot(Qn),h=n.dot(Qn);if(Math.max(-Math.max(u,d,h),Math.min(u,d,h))>a)return!1}return!0}const Np=new ws,ns=new G,Xr=new G;class Dr{constructor(e=new G,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Np.setFromPoints(e).getCenter(n);let i=0;for(let r=0,o=e.length;r<o;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ns.subVectors(e,this.center);const t=ns.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(ns,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Xr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ns.copy(e.center).add(Xr)),this.expandByPoint(ns.copy(e.center).sub(Xr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const wn=new G,Yr=new G,zs=new G,zn=new G,qr=new G,Vs=new G,Kr=new G;class Bp{constructor(e=new G,t=new G(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,wn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=wn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(wn.copy(this.origin).addScaledVector(this.direction,t),wn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Yr.copy(e).add(t).multiplyScalar(.5),zs.copy(t).sub(e).normalize(),zn.copy(this.origin).sub(Yr);const r=e.distanceTo(t)*.5,o=-this.direction.dot(zs),a=zn.dot(this.direction),u=-zn.dot(zs),d=zn.lengthSq(),h=Math.abs(1-o*o);let l,c,f,g;if(h>0)if(l=o*u-a,c=o*a-u,g=r*h,l>=0)if(c>=-g)if(c<=g){const _=1/h;l*=_,c*=_,f=l*(l+o*c+2*a)+c*(o*l+c+2*u)+d}else c=r,l=Math.max(0,-(o*c+a)),f=-l*l+c*(c+2*u)+d;else c=-r,l=Math.max(0,-(o*c+a)),f=-l*l+c*(c+2*u)+d;else c<=-g?(l=Math.max(0,-(-o*r+a)),c=l>0?-r:Math.min(Math.max(-r,-u),r),f=-l*l+c*(c+2*u)+d):c<=g?(l=0,c=Math.min(Math.max(-r,-u),r),f=c*(c+2*u)+d):(l=Math.max(0,-(o*r+a)),c=l>0?r:Math.min(Math.max(-r,-u),r),f=-l*l+c*(c+2*u)+d);else c=o>0?-r:r,l=Math.max(0,-(o*c+a)),f=-l*l+c*(c+2*u)+d;return n&&n.copy(this.origin).addScaledVector(this.direction,l),i&&i.copy(Yr).addScaledVector(zs,c),f}intersectSphere(e,t){wn.subVectors(e.center,this.origin);const n=wn.dot(this.direction),i=wn.dot(wn)-n*n,r=e.radius*e.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,u=n+o;return u<0?null:a<0?this.at(u,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,o,a,u;const d=1/this.direction.x,h=1/this.direction.y,l=1/this.direction.z,c=this.origin;return d>=0?(n=(e.min.x-c.x)*d,i=(e.max.x-c.x)*d):(n=(e.max.x-c.x)*d,i=(e.min.x-c.x)*d),h>=0?(r=(e.min.y-c.y)*h,o=(e.max.y-c.y)*h):(r=(e.max.y-c.y)*h,o=(e.min.y-c.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),l>=0?(a=(e.min.z-c.z)*l,u=(e.max.z-c.z)*l):(a=(e.max.z-c.z)*l,u=(e.min.z-c.z)*l),n>u||a>i)||((a>n||n!==n)&&(n=a),(u<i||i!==i)&&(i=u),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,wn)!==null}intersectTriangle(e,t,n,i,r){qr.subVectors(t,e),Vs.subVectors(n,e),Kr.crossVectors(qr,Vs);let o=this.direction.dot(Kr),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;zn.subVectors(this.origin,e);const u=a*this.direction.dot(Vs.crossVectors(zn,Vs));if(u<0)return null;const d=a*this.direction.dot(qr.cross(zn));if(d<0||u+d>o)return null;const h=-a*zn.dot(Kr);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class wt{constructor(e,t,n,i,r,o,a,u,d,h,l,c,f,g,_,m){wt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,u,d,h,l,c,f,g,_,m)}set(e,t,n,i,r,o,a,u,d,h,l,c,f,g,_,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=i,p[1]=r,p[5]=o,p[9]=a,p[13]=u,p[2]=d,p[6]=h,p[10]=l,p[14]=c,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new wt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/yi.setFromMatrixColumn(e,0).length(),r=1/yi.setFromMatrixColumn(e,1).length(),o=1/yi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),u=Math.cos(i),d=Math.sin(i),h=Math.cos(r),l=Math.sin(r);if(e.order==="XYZ"){const c=o*h,f=o*l,g=a*h,_=a*l;t[0]=u*h,t[4]=-u*l,t[8]=d,t[1]=f+g*d,t[5]=c-_*d,t[9]=-a*u,t[2]=_-c*d,t[6]=g+f*d,t[10]=o*u}else if(e.order==="YXZ"){const c=u*h,f=u*l,g=d*h,_=d*l;t[0]=c+_*a,t[4]=g*a-f,t[8]=o*d,t[1]=o*l,t[5]=o*h,t[9]=-a,t[2]=f*a-g,t[6]=_+c*a,t[10]=o*u}else if(e.order==="ZXY"){const c=u*h,f=u*l,g=d*h,_=d*l;t[0]=c-_*a,t[4]=-o*l,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*h,t[9]=_-c*a,t[2]=-o*d,t[6]=a,t[10]=o*u}else if(e.order==="ZYX"){const c=o*h,f=o*l,g=a*h,_=a*l;t[0]=u*h,t[4]=g*d-f,t[8]=c*d+_,t[1]=u*l,t[5]=_*d+c,t[9]=f*d-g,t[2]=-d,t[6]=a*u,t[10]=o*u}else if(e.order==="YZX"){const c=o*u,f=o*d,g=a*u,_=a*d;t[0]=u*h,t[4]=_-c*l,t[8]=g*l+f,t[1]=l,t[5]=o*h,t[9]=-a*h,t[2]=-d*h,t[6]=f*l+g,t[10]=c-_*l}else if(e.order==="XZY"){const c=o*u,f=o*d,g=a*u,_=a*d;t[0]=u*h,t[4]=-l,t[8]=d*h,t[1]=c*l+_,t[5]=o*h,t[9]=f*l-g,t[2]=g*l-f,t[6]=a*h,t[10]=_*l+c}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Op,e,zp)}lookAt(e,t,n){const i=this.elements;return qt.subVectors(e,t),qt.lengthSq()===0&&(qt.z=1),qt.normalize(),Vn.crossVectors(n,qt),Vn.lengthSq()===0&&(Math.abs(n.z)===1?qt.x+=1e-4:qt.z+=1e-4,qt.normalize(),Vn.crossVectors(n,qt)),Vn.normalize(),Gs.crossVectors(qt,Vn),i[0]=Vn.x,i[4]=Gs.x,i[8]=qt.x,i[1]=Vn.y,i[5]=Gs.y,i[9]=qt.y,i[2]=Vn.z,i[6]=Gs.z,i[10]=qt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[4],u=n[8],d=n[12],h=n[1],l=n[5],c=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],w=n[3],E=n[7],y=n[11],k=n[15],v=i[0],S=i[4],R=i[8],x=i[12],b=i[1],D=i[5],L=i[9],B=i[13],V=i[2],H=i[6],N=i[10],q=i[14],C=i[3],ee=i[7],se=i[11],ae=i[15];return r[0]=o*v+a*b+u*V+d*C,r[4]=o*S+a*D+u*H+d*ee,r[8]=o*R+a*L+u*N+d*se,r[12]=o*x+a*B+u*q+d*ae,r[1]=h*v+l*b+c*V+f*C,r[5]=h*S+l*D+c*H+f*ee,r[9]=h*R+l*L+c*N+f*se,r[13]=h*x+l*B+c*q+f*ae,r[2]=g*v+_*b+m*V+p*C,r[6]=g*S+_*D+m*H+p*ee,r[10]=g*R+_*L+m*N+p*se,r[14]=g*x+_*B+m*q+p*ae,r[3]=w*v+E*b+y*V+k*C,r[7]=w*S+E*D+y*H+k*ee,r[11]=w*R+E*L+y*N+k*se,r[15]=w*x+E*B+y*q+k*ae,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],o=e[1],a=e[5],u=e[9],d=e[13],h=e[2],l=e[6],c=e[10],f=e[14],g=e[3],_=e[7],m=e[11],p=e[15];return g*(+r*u*l-i*d*l-r*a*c+n*d*c+i*a*f-n*u*f)+_*(+t*u*f-t*d*c+r*o*c-i*o*f+i*d*h-r*u*h)+m*(+t*d*l-t*a*f-r*o*l+n*o*f+r*a*h-n*d*h)+p*(-i*a*h-t*u*l+t*a*c+i*o*l-n*o*c+n*u*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],u=e[6],d=e[7],h=e[8],l=e[9],c=e[10],f=e[11],g=e[12],_=e[13],m=e[14],p=e[15],w=l*m*d-_*c*d+_*u*f-a*m*f-l*u*p+a*c*p,E=g*c*d-h*m*d-g*u*f+o*m*f+h*u*p-o*c*p,y=h*_*d-g*l*d+g*a*f-o*_*f-h*a*p+o*l*p,k=g*l*u-h*_*u-g*a*c+o*_*c+h*a*m-o*l*m,v=t*w+n*E+i*y+r*k;if(v===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const S=1/v;return e[0]=w*S,e[1]=(_*c*r-l*m*r-_*i*f+n*m*f+l*i*p-n*c*p)*S,e[2]=(a*m*r-_*u*r+_*i*d-n*m*d-a*i*p+n*u*p)*S,e[3]=(l*u*r-a*c*r-l*i*d+n*c*d+a*i*f-n*u*f)*S,e[4]=E*S,e[5]=(h*m*r-g*c*r+g*i*f-t*m*f-h*i*p+t*c*p)*S,e[6]=(g*u*r-o*m*r-g*i*d+t*m*d+o*i*p-t*u*p)*S,e[7]=(o*c*r-h*u*r+h*i*d-t*c*d-o*i*f+t*u*f)*S,e[8]=y*S,e[9]=(g*l*r-h*_*r-g*n*f+t*_*f+h*n*p-t*l*p)*S,e[10]=(o*_*r-g*a*r+g*n*d-t*_*d-o*n*p+t*a*p)*S,e[11]=(h*a*r-o*l*r-h*n*d+t*l*d+o*n*f-t*a*f)*S,e[12]=k*S,e[13]=(h*_*i-g*l*i+g*n*c-t*_*c-h*n*m+t*l*m)*S,e[14]=(g*a*i-o*_*i-g*n*u+t*_*u+o*n*m-t*a*m)*S,e[15]=(o*l*i-h*a*i+h*n*u-t*l*u-o*n*c+t*a*c)*S,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,o=e.x,a=e.y,u=e.z,d=r*o,h=r*a;return this.set(d*o+n,d*a-i*u,d*u+i*a,0,d*a+i*u,h*a+n,h*u-i*o,0,d*u-i*a,h*u+i*o,r*u*u+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,o){return this.set(1,n,r,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,o=t._y,a=t._z,u=t._w,d=r+r,h=o+o,l=a+a,c=r*d,f=r*h,g=r*l,_=o*h,m=o*l,p=a*l,w=u*d,E=u*h,y=u*l,k=n.x,v=n.y,S=n.z;return i[0]=(1-(_+p))*k,i[1]=(f+y)*k,i[2]=(g-E)*k,i[3]=0,i[4]=(f-y)*v,i[5]=(1-(c+p))*v,i[6]=(m+w)*v,i[7]=0,i[8]=(g+E)*S,i[9]=(m-w)*S,i[10]=(1-(c+_))*S,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let r=yi.set(i[0],i[1],i[2]).length();const o=yi.set(i[4],i[5],i[6]).length(),a=yi.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],ln.copy(this);const d=1/r,h=1/o,l=1/a;return ln.elements[0]*=d,ln.elements[1]*=d,ln.elements[2]*=d,ln.elements[4]*=h,ln.elements[5]*=h,ln.elements[6]*=h,ln.elements[8]*=l,ln.elements[9]*=l,ln.elements[10]*=l,t.setFromRotationMatrix(ln),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,i,r,o,a=xn,u=!1){const d=this.elements,h=2*r/(t-e),l=2*r/(n-i),c=(t+e)/(t-e),f=(n+i)/(n-i);let g,_;if(u)g=r/(o-r),_=o*r/(o-r);else if(a===xn)g=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===Er)g=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return d[0]=h,d[4]=0,d[8]=c,d[12]=0,d[1]=0,d[5]=l,d[9]=f,d[13]=0,d[2]=0,d[6]=0,d[10]=g,d[14]=_,d[3]=0,d[7]=0,d[11]=-1,d[15]=0,this}makeOrthographic(e,t,n,i,r,o,a=xn,u=!1){const d=this.elements,h=2/(t-e),l=2/(n-i),c=-(t+e)/(t-e),f=-(n+i)/(n-i);let g,_;if(u)g=1/(o-r),_=o/(o-r);else if(a===xn)g=-2/(o-r),_=-(o+r)/(o-r);else if(a===Er)g=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return d[0]=h,d[4]=0,d[8]=0,d[12]=c,d[1]=0,d[5]=l,d[9]=0,d[13]=f,d[2]=0,d[6]=0,d[10]=g,d[14]=_,d[3]=0,d[7]=0,d[11]=0,d[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const yi=new G,ln=new wt,Op=new G(0,0,0),zp=new G(1,1,1),Vn=new G,Gs=new G,qt=new G,Za=new wt,$a=new Ss;class Fn{constructor(e=0,t=0,n=0,i=Fn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],o=i[4],a=i[8],u=i[1],d=i[5],h=i[9],l=i[2],c=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(nt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(c,d),this._z=0);break;case"YXZ":this._x=Math.asin(-nt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(u,d)):(this._y=Math.atan2(-l,r),this._z=0);break;case"ZXY":this._x=Math.asin(nt(c,-1,1)),Math.abs(c)<.9999999?(this._y=Math.atan2(-l,f),this._z=Math.atan2(-o,d)):(this._y=0,this._z=Math.atan2(u,r));break;case"ZYX":this._y=Math.asin(-nt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(c,f),this._z=Math.atan2(u,r)):(this._x=0,this._z=Math.atan2(-o,d));break;case"YZX":this._z=Math.asin(nt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(-h,d),this._y=Math.atan2(-l,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-nt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(c,d),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Za.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Za,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return $a.setFromEuler(this),this.setFromQuaternion($a,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Fn.DEFAULT_ORDER="XYZ";class Kc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Vp=0;const el=new G,Ei=new Ss,Tn=new wt,Hs=new G,is=new G,Gp=new G,Hp=new Ss,tl=new G(1,0,0),nl=new G(0,1,0),il=new G(0,0,1),sl={type:"added"},Wp={type:"removed"},Mi={type:"childadded",child:null},Qr={type:"childremoved",child:null};class Ht extends qi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Vp++}),this.uuid=Ln(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ht.DEFAULT_UP.clone();const e=new G,t=new Fn,n=new Ss,i=new G(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new wt},normalMatrix:{value:new Ke}}),this.matrix=new wt,this.matrixWorld=new wt,this.matrixAutoUpdate=Ht.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ht.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Kc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ei.setFromAxisAngle(e,t),this.quaternion.multiply(Ei),this}rotateOnWorldAxis(e,t){return Ei.setFromAxisAngle(e,t),this.quaternion.premultiply(Ei),this}rotateX(e){return this.rotateOnAxis(tl,e)}rotateY(e){return this.rotateOnAxis(nl,e)}rotateZ(e){return this.rotateOnAxis(il,e)}translateOnAxis(e,t){return el.copy(e).applyQuaternion(this.quaternion),this.position.add(el.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(tl,e)}translateY(e){return this.translateOnAxis(nl,e)}translateZ(e){return this.translateOnAxis(il,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Tn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Hs.copy(e):Hs.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),is.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Tn.lookAt(is,Hs,this.up):Tn.lookAt(Hs,is,this.up),this.quaternion.setFromRotationMatrix(Tn),i&&(Tn.extractRotation(i.matrixWorld),Ei.setFromRotationMatrix(Tn),this.quaternion.premultiply(Ei.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(sl),Mi.child=e,this.dispatchEvent(Mi),Mi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Wp),Qr.child=e,this.dispatchEvent(Qr),Qr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Tn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Tn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Tn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(sl),Mi.child=e,this.dispatchEvent(Mi),Mi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(is,e,Gp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(is,Hp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(a,u){return a[u.uuid]===void 0&&(a[u.uuid]=u.toJSON(e)),u.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const u=a.shapes;if(Array.isArray(u))for(let d=0,h=u.length;d<h;d++){const l=u[d];r(e.shapes,l)}else r(e.shapes,u)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let u=0,d=this.material.length;u<d;u++)a.push(r(e.materials,this.material[u]));i.material=a}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const u=this.animations[a];i.animations.push(r(e.animations,u))}}if(t){const a=o(e.geometries),u=o(e.materials),d=o(e.textures),h=o(e.images),l=o(e.shapes),c=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),u.length>0&&(n.materials=u),d.length>0&&(n.textures=d),h.length>0&&(n.images=h),l.length>0&&(n.shapes=l),c.length>0&&(n.skeletons=c),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){const u=[];for(const d in a){const h=a[d];delete h.metadata,u.push(h)}return u}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}Ht.DEFAULT_UP=new G(0,1,0);Ht.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ht.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const cn=new G,Cn=new G,jr=new G,Rn=new G,Si=new G,wi=new G,rl=new G,Jr=new G,Zr=new G,$r=new G,eo=new Et,to=new Et,no=new Et;class rn{constructor(e=new G,t=new G,n=new G){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),cn.subVectors(e,t),i.cross(cn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){cn.subVectors(i,t),Cn.subVectors(n,t),jr.subVectors(e,t);const o=cn.dot(cn),a=cn.dot(Cn),u=cn.dot(jr),d=Cn.dot(Cn),h=Cn.dot(jr),l=o*d-a*a;if(l===0)return r.set(0,0,0),null;const c=1/l,f=(d*u-a*h)*c,g=(o*h-a*u)*c;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Rn)===null?!1:Rn.x>=0&&Rn.y>=0&&Rn.x+Rn.y<=1}static getInterpolation(e,t,n,i,r,o,a,u){return this.getBarycoord(e,t,n,i,Rn)===null?(u.x=0,u.y=0,"z"in u&&(u.z=0),"w"in u&&(u.w=0),null):(u.setScalar(0),u.addScaledVector(r,Rn.x),u.addScaledVector(o,Rn.y),u.addScaledVector(a,Rn.z),u)}static getInterpolatedAttribute(e,t,n,i,r,o){return eo.setScalar(0),to.setScalar(0),no.setScalar(0),eo.fromBufferAttribute(e,t),to.fromBufferAttribute(e,n),no.fromBufferAttribute(e,i),o.setScalar(0),o.addScaledVector(eo,r.x),o.addScaledVector(to,r.y),o.addScaledVector(no,r.z),o}static isFrontFacing(e,t,n,i){return cn.subVectors(n,t),Cn.subVectors(e,t),cn.cross(Cn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return cn.subVectors(this.c,this.b),Cn.subVectors(this.a,this.b),cn.cross(Cn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return rn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return rn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return rn.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return rn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return rn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let o,a;Si.subVectors(i,n),wi.subVectors(r,n),Jr.subVectors(e,n);const u=Si.dot(Jr),d=wi.dot(Jr);if(u<=0&&d<=0)return t.copy(n);Zr.subVectors(e,i);const h=Si.dot(Zr),l=wi.dot(Zr);if(h>=0&&l<=h)return t.copy(i);const c=u*l-h*d;if(c<=0&&u>=0&&h<=0)return o=u/(u-h),t.copy(n).addScaledVector(Si,o);$r.subVectors(e,r);const f=Si.dot($r),g=wi.dot($r);if(g>=0&&f<=g)return t.copy(r);const _=f*d-u*g;if(_<=0&&d>=0&&g<=0)return a=d/(d-g),t.copy(n).addScaledVector(wi,a);const m=h*g-f*l;if(m<=0&&l-h>=0&&f-g>=0)return rl.subVectors(r,i),a=(l-h)/(l-h+(f-g)),t.copy(i).addScaledVector(rl,a);const p=1/(m+_+c);return o=_*p,a=c*p,t.copy(n).addScaledVector(Si,o).addScaledVector(wi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Qc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Gn={h:0,s:0,l:0},Ws={h:0,s:0,l:0};function io(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class Je{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=jt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,rt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=rt.workingColorSpace){return this.r=e,this.g=t,this.b=n,rt.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=rt.workingColorSpace){if(e=ya(e,1),t=nt(t,0,1),n=nt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=io(o,r,e+1/3),this.g=io(o,r,e),this.b=io(o,r,e-1/3)}return rt.colorSpaceToWorking(this,i),this}setStyle(e,t=jt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=jt){const n=Qc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=In(e.r),this.g=In(e.g),this.b=In(e.b),this}copyLinearToSRGB(e){return this.r=zi(e.r),this.g=zi(e.g),this.b=zi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=jt){return rt.workingToColorSpace(Lt.copy(this),e),Math.round(nt(Lt.r*255,0,255))*65536+Math.round(nt(Lt.g*255,0,255))*256+Math.round(nt(Lt.b*255,0,255))}getHexString(e=jt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=rt.workingColorSpace){rt.workingToColorSpace(Lt.copy(this),t);const n=Lt.r,i=Lt.g,r=Lt.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let u,d;const h=(a+o)/2;if(a===o)u=0,d=0;else{const l=o-a;switch(d=h<=.5?l/(o+a):l/(2-o-a),o){case n:u=(i-r)/l+(i<r?6:0);break;case i:u=(r-n)/l+2;break;case r:u=(n-i)/l+4;break}u/=6}return e.h=u,e.s=d,e.l=h,e}getRGB(e,t=rt.workingColorSpace){return rt.workingToColorSpace(Lt.copy(this),t),e.r=Lt.r,e.g=Lt.g,e.b=Lt.b,e}getStyle(e=jt){rt.workingToColorSpace(Lt.copy(this),e);const t=Lt.r,n=Lt.g,i=Lt.b;return e!==jt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Gn),this.setHSL(Gn.h+e,Gn.s+t,Gn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Gn),e.getHSL(Ws);const n=gs(Gn.h,Ws.h,t),i=gs(Gn.s,Ws.s,t),r=gs(Gn.l,Ws.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Lt=new Je;Je.NAMES=Qc;let Xp=0;class Ts extends qi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Xp++}),this.uuid=Ln(),this.name="",this.type="Material",this.blending=Oi,this.side=Un,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Mo,this.blendDst=So,this.blendEquation=ri,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Je(0,0,0),this.blendAlpha=0,this.depthFunc=Gi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ya,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=_i,this.stencilZFail=_i,this.stencilZPass=_i,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Oi&&(n.blending=this.blending),this.side!==Un&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Mo&&(n.blendSrc=this.blendSrc),this.blendDst!==So&&(n.blendDst=this.blendDst),this.blendEquation!==ri&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Gi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ya&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==_i&&(n.stencilFail=this.stencilFail),this.stencilZFail!==_i&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==_i&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const u=r[a];delete u.metadata,o.push(u)}return o}if(t){const r=i(e.textures),o=i(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Zt extends Ts{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Je(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fn,this.combine=Fc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const St=new G,Xs=new Ze;let Yp=0;class It{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Yp++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=da,this.updateRanges=[],this.gpuType=kn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Xs.fromBufferAttribute(this,t),Xs.applyMatrix3(e),this.setXY(t,Xs.x,Xs.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)St.fromBufferAttribute(this,t),St.applyMatrix3(e),this.setXYZ(t,St.x,St.y,St.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)St.fromBufferAttribute(this,t),St.applyMatrix4(e),this.setXYZ(t,St.x,St.y,St.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)St.fromBufferAttribute(this,t),St.applyNormalMatrix(e),this.setXYZ(t,St.x,St.y,St.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)St.fromBufferAttribute(this,t),St.transformDirection(e),this.setXYZ(t,St.x,St.y,St.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=un(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ht(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=un(t,this.array)),t}setX(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=un(t,this.array)),t}setY(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=un(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=un(t,this.array)),t}setW(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array),i=ht(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array),i=ht(i,this.array),r=ht(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==da&&(e.usage=this.usage),e}}class jc extends It{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Jc extends It{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Dt extends It{constructor(e,t,n){super(new Float32Array(e),t,n)}}let qp=0;const nn=new wt,so=new Ht,Ti=new G,Kt=new ws,ss=new ws,Rt=new G;class Wt extends qi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:qp++}),this.uuid=Ln(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(qc(e)?Jc:jc)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ke().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return nn.makeRotationFromQuaternion(e),this.applyMatrix4(nn),this}rotateX(e){return nn.makeRotationX(e),this.applyMatrix4(nn),this}rotateY(e){return nn.makeRotationY(e),this.applyMatrix4(nn),this}rotateZ(e){return nn.makeRotationZ(e),this.applyMatrix4(nn),this}translate(e,t,n){return nn.makeTranslation(e,t,n),this.applyMatrix4(nn),this}scale(e,t,n){return nn.makeScale(e,t,n),this.applyMatrix4(nn),this}lookAt(e){return so.lookAt(e),so.updateMatrix(),this.applyMatrix4(so.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ti).negate(),this.translate(Ti.x,Ti.y,Ti.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,r=e.length;i<r;i++){const o=e[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Dt(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ws);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];Kt.setFromBufferAttribute(r),this.morphTargetsRelative?(Rt.addVectors(this.boundingBox.min,Kt.min),this.boundingBox.expandByPoint(Rt),Rt.addVectors(this.boundingBox.max,Kt.max),this.boundingBox.expandByPoint(Rt)):(this.boundingBox.expandByPoint(Kt.min),this.boundingBox.expandByPoint(Kt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Dr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new G,1/0);return}if(e){const n=this.boundingSphere.center;if(Kt.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];ss.setFromBufferAttribute(a),this.morphTargetsRelative?(Rt.addVectors(Kt.min,ss.min),Kt.expandByPoint(Rt),Rt.addVectors(Kt.max,ss.max),Kt.expandByPoint(Rt)):(Kt.expandByPoint(ss.min),Kt.expandByPoint(ss.max))}Kt.getCenter(n);let i=0;for(let r=0,o=e.count;r<o;r++)Rt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(Rt));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],u=this.morphTargetsRelative;for(let d=0,h=a.count;d<h;d++)Rt.fromBufferAttribute(a,d),u&&(Ti.fromBufferAttribute(e,d),Rt.add(Ti)),i=Math.max(i,n.distanceToSquared(Rt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new It(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],u=[];for(let R=0;R<n.count;R++)a[R]=new G,u[R]=new G;const d=new G,h=new G,l=new G,c=new Ze,f=new Ze,g=new Ze,_=new G,m=new G;function p(R,x,b){d.fromBufferAttribute(n,R),h.fromBufferAttribute(n,x),l.fromBufferAttribute(n,b),c.fromBufferAttribute(r,R),f.fromBufferAttribute(r,x),g.fromBufferAttribute(r,b),h.sub(d),l.sub(d),f.sub(c),g.sub(c);const D=1/(f.x*g.y-g.x*f.y);isFinite(D)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(l,-f.y).multiplyScalar(D),m.copy(l).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(D),a[R].add(_),a[x].add(_),a[b].add(_),u[R].add(m),u[x].add(m),u[b].add(m))}let w=this.groups;w.length===0&&(w=[{start:0,count:e.count}]);for(let R=0,x=w.length;R<x;++R){const b=w[R],D=b.start,L=b.count;for(let B=D,V=D+L;B<V;B+=3)p(e.getX(B+0),e.getX(B+1),e.getX(B+2))}const E=new G,y=new G,k=new G,v=new G;function S(R){k.fromBufferAttribute(i,R),v.copy(k);const x=a[R];E.copy(x),E.sub(k.multiplyScalar(k.dot(x))).normalize(),y.crossVectors(v,x);const D=y.dot(u[R])<0?-1:1;o.setXYZW(R,E.x,E.y,E.z,D)}for(let R=0,x=w.length;R<x;++R){const b=w[R],D=b.start,L=b.count;for(let B=D,V=D+L;B<V;B+=3)S(e.getX(B+0)),S(e.getX(B+1)),S(e.getX(B+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new It(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let c=0,f=n.count;c<f;c++)n.setXYZ(c,0,0,0);const i=new G,r=new G,o=new G,a=new G,u=new G,d=new G,h=new G,l=new G;if(e)for(let c=0,f=e.count;c<f;c+=3){const g=e.getX(c+0),_=e.getX(c+1),m=e.getX(c+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),h.subVectors(o,r),l.subVectors(i,r),h.cross(l),a.fromBufferAttribute(n,g),u.fromBufferAttribute(n,_),d.fromBufferAttribute(n,m),a.add(h),u.add(h),d.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,u.x,u.y,u.z),n.setXYZ(m,d.x,d.y,d.z)}else for(let c=0,f=t.count;c<f;c+=3)i.fromBufferAttribute(t,c+0),r.fromBufferAttribute(t,c+1),o.fromBufferAttribute(t,c+2),h.subVectors(o,r),l.subVectors(i,r),h.cross(l),n.setXYZ(c+0,h.x,h.y,h.z),n.setXYZ(c+1,h.x,h.y,h.z),n.setXYZ(c+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Rt.fromBufferAttribute(e,t),Rt.normalize(),e.setXYZ(t,Rt.x,Rt.y,Rt.z)}toNonIndexed(){function e(a,u){const d=a.array,h=a.itemSize,l=a.normalized,c=new d.constructor(u.length*h);let f=0,g=0;for(let _=0,m=u.length;_<m;_++){a.isInterleavedBufferAttribute?f=u[_]*a.data.stride+a.offset:f=u[_]*h;for(let p=0;p<h;p++)c[g++]=d[f++]}return new It(c,h,l)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Wt,n=this.index.array,i=this.attributes;for(const a in i){const u=i[a],d=e(u,n);t.setAttribute(a,d)}const r=this.morphAttributes;for(const a in r){const u=[],d=r[a];for(let h=0,l=d.length;h<l;h++){const c=d[h],f=e(c,n);u.push(f)}t.morphAttributes[a]=u}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,u=o.length;a<u;a++){const d=o[a];t.addGroup(d.start,d.count,d.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const u=this.parameters;for(const d in u)u[d]!==void 0&&(e[d]=u[d]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const u in n){const d=n[u];e.data.attributes[u]=d.toJSON(e.data)}const i={};let r=!1;for(const u in this.morphAttributes){const d=this.morphAttributes[u],h=[];for(let l=0,c=d.length;l<c;l++){const f=d[l];h.push(f.toJSON(e.data))}h.length>0&&(i[u]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const d in i){const h=i[d];this.setAttribute(d,h.clone(t))}const r=e.morphAttributes;for(const d in r){const h=[],l=r[d];for(let c=0,f=l.length;c<f;c++)h.push(l[c].clone(t));this.morphAttributes[d]=h}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let d=0,h=o.length;d<h;d++){const l=o[d];this.addGroup(l.start,l.count,l.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const u=e.boundingSphere;return u!==null&&(this.boundingSphere=u.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ol=new wt,jn=new Bp,Ys=new Dr,al=new G,qs=new G,Ks=new G,Qs=new G,ro=new G,js=new G,ll=new G,Js=new G;class mt extends Ht{constructor(e=new Wt,t=new Zt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const a=this.morphTargetInfluences;if(r&&a){js.set(0,0,0);for(let u=0,d=r.length;u<d;u++){const h=a[u],l=r[u];h!==0&&(ro.fromBufferAttribute(l,e),o?js.addScaledVector(ro,h):js.addScaledVector(ro.sub(t),h))}t.add(js)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ys.copy(n.boundingSphere),Ys.applyMatrix4(r),jn.copy(e.ray).recast(e.near),!(Ys.containsPoint(jn.origin)===!1&&(jn.intersectSphere(Ys,al)===null||jn.origin.distanceToSquared(al)>(e.far-e.near)**2))&&(ol.copy(r).invert(),jn.copy(e.ray).applyMatrix4(ol),!(n.boundingBox!==null&&jn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,jn)))}_computeIntersections(e,t,n){let i;const r=this.geometry,o=this.material,a=r.index,u=r.attributes.position,d=r.attributes.uv,h=r.attributes.uv1,l=r.attributes.normal,c=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=c.length;g<_;g++){const m=c[g],p=o[m.materialIndex],w=Math.max(m.start,f.start),E=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let y=w,k=E;y<k;y+=3){const v=a.getX(y),S=a.getX(y+1),R=a.getX(y+2);i=Zs(this,p,e,n,d,h,l,v,S,R),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const w=a.getX(m),E=a.getX(m+1),y=a.getX(m+2);i=Zs(this,o,e,n,d,h,l,w,E,y),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(u!==void 0)if(Array.isArray(o))for(let g=0,_=c.length;g<_;g++){const m=c[g],p=o[m.materialIndex],w=Math.max(m.start,f.start),E=Math.min(u.count,Math.min(m.start+m.count,f.start+f.count));for(let y=w,k=E;y<k;y+=3){const v=y,S=y+1,R=y+2;i=Zs(this,p,e,n,d,h,l,v,S,R),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),_=Math.min(u.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const w=m,E=m+1,y=m+2;i=Zs(this,o,e,n,d,h,l,w,E,y),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}}function Kp(s,e,t,n,i,r,o,a){let u;if(e.side===Ot?u=n.intersectTriangle(o,r,i,!0,a):u=n.intersectTriangle(i,r,o,e.side===Un,a),u===null)return null;Js.copy(a),Js.applyMatrix4(s.matrixWorld);const d=t.ray.origin.distanceTo(Js);return d<t.near||d>t.far?null:{distance:d,point:Js.clone(),object:s}}function Zs(s,e,t,n,i,r,o,a,u,d){s.getVertexPosition(a,qs),s.getVertexPosition(u,Ks),s.getVertexPosition(d,Qs);const h=Kp(s,e,t,n,qs,Ks,Qs,ll);if(h){const l=new G;rn.getBarycoord(ll,qs,Ks,Qs,l),i&&(h.uv=rn.getInterpolatedAttribute(i,a,u,d,l,new Ze)),r&&(h.uv1=rn.getInterpolatedAttribute(r,a,u,d,l,new Ze)),o&&(h.normal=rn.getInterpolatedAttribute(o,a,u,d,l,new G),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const c={a,b:u,c:d,normal:new G,materialIndex:0};rn.getNormal(qs,Ks,Qs,c.normal),h.face=c,h.barycoord=l}return h}class qn extends Wt{constructor(e=1,t=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const u=[],d=[],h=[],l=[];let c=0,f=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,i,o,2),g("x","z","y",1,-1,e,n,-t,i,o,3),g("x","y","z",1,-1,e,t,n,i,r,4),g("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(u),this.setAttribute("position",new Dt(d,3)),this.setAttribute("normal",new Dt(h,3)),this.setAttribute("uv",new Dt(l,2));function g(_,m,p,w,E,y,k,v,S,R,x){const b=y/S,D=k/R,L=y/2,B=k/2,V=v/2,H=S+1,N=R+1;let q=0,C=0;const ee=new G;for(let se=0;se<N;se++){const ae=se*D-B;for(let Ne=0;Ne<H;Ne++){const be=Ne*b-L;ee[_]=be*w,ee[m]=ae*E,ee[p]=V,d.push(ee.x,ee.y,ee.z),ee[_]=0,ee[m]=0,ee[p]=v>0?1:-1,h.push(ee.x,ee.y,ee.z),l.push(Ne/S),l.push(1-se/R),q+=1}}for(let se=0;se<R;se++)for(let ae=0;ae<S;ae++){const Ne=c+ae+H*se,be=c+ae+H*(se+1),j=c+(ae+1)+H*(se+1),Ee=c+(ae+1)+H*se;u.push(Ne,be,Ee),u.push(be,j,Ee),C+=6}a.addGroup(f,C,x),f+=C,c+=q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Yi(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Bt(s){const e={};for(let t=0;t<s.length;t++){const n=Yi(s[t]);for(const i in n)e[i]=n[i]}return e}function Qp(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Zc(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:rt.workingColorSpace}const jp={clone:Yi,merge:Bt};var Jp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Zp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class yn extends Ts{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Jp,this.fragmentShader=Zp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Yi(e.uniforms),this.uniformsGroups=Qp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class $c extends Ht{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new wt,this.projectionMatrix=new wt,this.projectionMatrixInverse=new wt,this.coordinateSystem=xn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Hn=new G,cl=new Ze,dl=new Ze;class sn extends $c{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ys*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ms*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ys*2*Math.atan(Math.tan(ms*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Hn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Hn.x,Hn.y).multiplyScalar(-e/Hn.z),Hn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Hn.x,Hn.y).multiplyScalar(-e/Hn.z)}getViewSize(e,t){return this.getViewBounds(e,cl,dl),t.subVectors(dl,cl)}setViewOffset(e,t,n,i,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ms*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const u=o.fullWidth,d=o.fullHeight;r+=o.offsetX*i/u,t-=o.offsetY*n/d,i*=o.width/u,n*=o.height/d}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ci=-90,Ri=1;class $p extends Ht{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new sn(Ci,Ri,e,t);i.layers=this.layers,this.add(i);const r=new sn(Ci,Ri,e,t);r.layers=this.layers,this.add(r);const o=new sn(Ci,Ri,e,t);o.layers=this.layers,this.add(o);const a=new sn(Ci,Ri,e,t);a.layers=this.layers,this.add(a);const u=new sn(Ci,Ri,e,t);u.layers=this.layers,this.add(u);const d=new sn(Ci,Ri,e,t);d.layers=this.layers,this.add(d)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,o,a,u]=t;for(const d of t)this.remove(d);if(e===xn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),u.up.set(0,1,0),u.lookAt(0,0,-1);else if(e===Er)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),u.up.set(0,-1,0),u.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const d of t)this.add(d),d.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,u,d,h]=this.children,l=e.getRenderTarget(),c=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,o),e.setRenderTarget(n,2,i),e.render(t,a),e.setRenderTarget(n,3,i),e.render(t,u),e.setRenderTarget(n,4,i),e.render(t,d),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(l,c,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class ed extends zt{constructor(e=[],t=Hi,n,i,r,o,a,u,d,h){super(e,t,n,i,r,o,a,u,d,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class em extends di{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new ed(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new qn(5,5,5),r=new yn({name:"CubemapFromEquirect",uniforms:Yi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ot,blending:Wn});r.uniforms.tEquirect.value=t;const o=new mt(i,r),a=t.minFilter;return t.minFilter===li&&(t.minFilter=fn),new $p(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(r)}}class Mt extends Ht{constructor(){super(),this.isGroup=!0,this.type="Group"}}const tm={type:"move"};class oo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Mt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Mt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Mt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,o=null;const a=this._targetRay,u=this._grip,d=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(d&&e.hand){o=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,n),p=this._getHandJoint(d,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=d.joints["index-finger-tip"],l=d.joints["thumb-tip"],c=h.position.distanceTo(l.position),f=.02,g=.005;d.inputState.pinching&&c>f+g?(d.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!d.inputState.pinching&&c<=f-g&&(d.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else u!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(u.matrix.fromArray(r.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,r.linearVelocity?(u.hasLinearVelocity=!0,u.linearVelocity.copy(r.linearVelocity)):u.hasLinearVelocity=!1,r.angularVelocity?(u.hasAngularVelocity=!0,u.angularVelocity.copy(r.angularVelocity)):u.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(tm)))}return a!==null&&(a.visible=i!==null),u!==null&&(u.visible=r!==null),d!==null&&(d.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Mt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class td extends Ht{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Fn,this.environmentIntensity=1,this.environmentRotation=new Fn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class nm{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=da,this.updateRanges=[],this.version=0,this.uuid=Ln()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ln()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ln()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Nt=new G;class Sr{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Nt.fromBufferAttribute(this,t),Nt.applyMatrix4(e),this.setXYZ(t,Nt.x,Nt.y,Nt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Nt.fromBufferAttribute(this,t),Nt.applyNormalMatrix(e),this.setXYZ(t,Nt.x,Nt.y,Nt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Nt.fromBufferAttribute(this,t),Nt.transformDirection(e),this.setXYZ(t,Nt.x,Nt.y,Nt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=un(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ht(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=un(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=un(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=un(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=un(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array),i=ht(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array),i=ht(i,this.array),r=ht(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new It(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Sr(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class nd extends Ts{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Je(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Di;const rs=new G,Pi=new G,ki=new G,Li=new Ze,os=new Ze,id=new wt,$s=new G,as=new G,er=new G,hl=new Ze,ao=new Ze,ul=new Ze;class sd extends Ht{constructor(e=new nd){if(super(),this.isSprite=!0,this.type="Sprite",Di===void 0){Di=new Wt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new nm(t,5);Di.setIndex([0,1,2,0,2,3]),Di.setAttribute("position",new Sr(n,3,0,!1)),Di.setAttribute("uv",new Sr(n,2,3,!1))}this.geometry=Di,this.material=e,this.center=new Ze(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Pi.setFromMatrixScale(this.matrixWorld),id.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),ki.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Pi.multiplyScalar(-ki.z);const n=this.material.rotation;let i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));const o=this.center;tr($s.set(-.5,-.5,0),ki,o,Pi,i,r),tr(as.set(.5,-.5,0),ki,o,Pi,i,r),tr(er.set(.5,.5,0),ki,o,Pi,i,r),hl.set(0,0),ao.set(1,0),ul.set(1,1);let a=e.ray.intersectTriangle($s,as,er,!1,rs);if(a===null&&(tr(as.set(-.5,.5,0),ki,o,Pi,i,r),ao.set(0,1),a=e.ray.intersectTriangle($s,er,as,!1,rs),a===null))return;const u=e.ray.origin.distanceTo(rs);u<e.near||u>e.far||t.push({distance:u,point:rs.clone(),uv:rn.getInterpolation(rs,$s,as,er,hl,ao,ul,new Ze),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function tr(s,e,t,n,i,r){Li.subVectors(s,t).addScalar(.5).multiply(n),i!==void 0?(os.x=r*Li.x-i*Li.y,os.y=i*Li.x+r*Li.y):os.copy(Li),s.copy(e),s.x+=os.x,s.y+=os.y,s.applyMatrix4(id)}const lo=new G,im=new G,sm=new Ke;class ii{constructor(e=new G(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=lo.subVectors(n,t).cross(im.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(lo),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||sm.getNormalMatrix(e),i=this.coplanarPoint(lo).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Jn=new Dr,rm=new Ze(.5,.5),nr=new G;class rd{constructor(e=new ii,t=new ii,n=new ii,i=new ii,r=new ii,o=new ii){this.planes=[e,t,n,i,r,o]}set(e,t,n,i,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=xn,n=!1){const i=this.planes,r=e.elements,o=r[0],a=r[1],u=r[2],d=r[3],h=r[4],l=r[5],c=r[6],f=r[7],g=r[8],_=r[9],m=r[10],p=r[11],w=r[12],E=r[13],y=r[14],k=r[15];if(i[0].setComponents(d-o,f-h,p-g,k-w).normalize(),i[1].setComponents(d+o,f+h,p+g,k+w).normalize(),i[2].setComponents(d+a,f+l,p+_,k+E).normalize(),i[3].setComponents(d-a,f-l,p-_,k-E).normalize(),n)i[4].setComponents(u,c,m,y).normalize(),i[5].setComponents(d-u,f-c,p-m,k-y).normalize();else if(i[4].setComponents(d-u,f-c,p-m,k-y).normalize(),t===xn)i[5].setComponents(d+u,f+c,p+m,k+y).normalize();else if(t===Er)i[5].setComponents(u,c,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Jn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Jn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Jn)}intersectsSprite(e){Jn.center.set(0,0,0);const t=rm.distanceTo(e.center);return Jn.radius=.7071067811865476+t,Jn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Jn)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(nr.x=i.normal.x>0?e.max.x:e.min.x,nr.y=i.normal.y>0?e.max.y:e.min.y,nr.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(nr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class od extends zt{constructor(e,t,n,i,r,o,a,u,d){super(e,t,n,i,r,o,a,u,d),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ad extends zt{constructor(e,t,n=ci,i,r,o,a=Gt,u=Gt,d,h=xs,l=1){if(h!==xs&&h!==bs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const c={width:e,height:t,depth:l};super(c,i,r,o,a,u,h,n,d),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ea(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class ld extends zt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Sa extends Wt{constructor(e=1,t=1,n=1,i=32,r=1,o=!1,a=0,u=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:u};const d=this;i=Math.floor(i),r=Math.floor(r);const h=[],l=[],c=[],f=[];let g=0;const _=[],m=n/2;let p=0;w(),o===!1&&(e>0&&E(!0),t>0&&E(!1)),this.setIndex(h),this.setAttribute("position",new Dt(l,3)),this.setAttribute("normal",new Dt(c,3)),this.setAttribute("uv",new Dt(f,2));function w(){const y=new G,k=new G;let v=0;const S=(t-e)/n;for(let R=0;R<=r;R++){const x=[],b=R/r,D=b*(t-e)+e;for(let L=0;L<=i;L++){const B=L/i,V=B*u+a,H=Math.sin(V),N=Math.cos(V);k.x=D*H,k.y=-b*n+m,k.z=D*N,l.push(k.x,k.y,k.z),y.set(H,S,N).normalize(),c.push(y.x,y.y,y.z),f.push(B,1-b),x.push(g++)}_.push(x)}for(let R=0;R<i;R++)for(let x=0;x<r;x++){const b=_[x][R],D=_[x+1][R],L=_[x+1][R+1],B=_[x][R+1];(e>0||x!==0)&&(h.push(b,D,B),v+=3),(t>0||x!==r-1)&&(h.push(D,L,B),v+=3)}d.addGroup(p,v,0),p+=v}function E(y){const k=g,v=new Ze,S=new G;let R=0;const x=y===!0?e:t,b=y===!0?1:-1;for(let L=1;L<=i;L++)l.push(0,m*b,0),c.push(0,b,0),f.push(.5,.5),g++;const D=g;for(let L=0;L<=i;L++){const V=L/i*u+a,H=Math.cos(V),N=Math.sin(V);S.x=x*N,S.y=m*b,S.z=x*H,l.push(S.x,S.y,S.z),c.push(0,b,0),v.x=H*.5+.5,v.y=N*.5*b+.5,f.push(v.x,v.y),g++}for(let L=0;L<i;L++){const B=k+L,V=D+L;y===!0?h.push(V,V+1,B):h.push(V+1,V,B),R+=3}d.addGroup(p,R,y===!0?1:2),p+=R}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Sa(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class wa extends Wt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const r=[],o=[];a(i),d(n),h(),this.setAttribute("position",new Dt(r,3)),this.setAttribute("normal",new Dt(r.slice(),3)),this.setAttribute("uv",new Dt(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(w){const E=new G,y=new G,k=new G;for(let v=0;v<t.length;v+=3)f(t[v+0],E),f(t[v+1],y),f(t[v+2],k),u(E,y,k,w)}function u(w,E,y,k){const v=k+1,S=[];for(let R=0;R<=v;R++){S[R]=[];const x=w.clone().lerp(y,R/v),b=E.clone().lerp(y,R/v),D=v-R;for(let L=0;L<=D;L++)L===0&&R===v?S[R][L]=x:S[R][L]=x.clone().lerp(b,L/D)}for(let R=0;R<v;R++)for(let x=0;x<2*(v-R)-1;x++){const b=Math.floor(x/2);x%2===0?(c(S[R][b+1]),c(S[R+1][b]),c(S[R][b])):(c(S[R][b+1]),c(S[R+1][b+1]),c(S[R+1][b]))}}function d(w){const E=new G;for(let y=0;y<r.length;y+=3)E.x=r[y+0],E.y=r[y+1],E.z=r[y+2],E.normalize().multiplyScalar(w),r[y+0]=E.x,r[y+1]=E.y,r[y+2]=E.z}function h(){const w=new G;for(let E=0;E<r.length;E+=3){w.x=r[E+0],w.y=r[E+1],w.z=r[E+2];const y=m(w)/2/Math.PI+.5,k=p(w)/Math.PI+.5;o.push(y,1-k)}g(),l()}function l(){for(let w=0;w<o.length;w+=6){const E=o[w+0],y=o[w+2],k=o[w+4],v=Math.max(E,y,k),S=Math.min(E,y,k);v>.9&&S<.1&&(E<.2&&(o[w+0]+=1),y<.2&&(o[w+2]+=1),k<.2&&(o[w+4]+=1))}}function c(w){r.push(w.x,w.y,w.z)}function f(w,E){const y=w*3;E.x=e[y+0],E.y=e[y+1],E.z=e[y+2]}function g(){const w=new G,E=new G,y=new G,k=new G,v=new Ze,S=new Ze,R=new Ze;for(let x=0,b=0;x<r.length;x+=9,b+=6){w.set(r[x+0],r[x+1],r[x+2]),E.set(r[x+3],r[x+4],r[x+5]),y.set(r[x+6],r[x+7],r[x+8]),v.set(o[b+0],o[b+1]),S.set(o[b+2],o[b+3]),R.set(o[b+4],o[b+5]),k.copy(w).add(E).add(y).divideScalar(3);const D=m(k);_(v,b+0,w,D),_(S,b+2,E,D),_(R,b+4,y,D)}}function _(w,E,y,k){k<0&&w.x===1&&(o[E]=w.x-1),y.x===0&&y.z===0&&(o[E]=k/2/Math.PI+.5)}function m(w){return Math.atan2(w.z,-w.x)}function p(w){return Math.atan2(-w.y,Math.sqrt(w.x*w.x+w.z*w.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new wa(e.vertices,e.indices,e.radius,e.details)}}class Ta extends wa{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ta(e.radius,e.detail)}}class Cs extends Wt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,o=t/2,a=Math.floor(n),u=Math.floor(i),d=a+1,h=u+1,l=e/a,c=t/u,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const w=p*c-o;for(let E=0;E<d;E++){const y=E*l-r;g.push(y,-w,0),_.push(0,0,1),m.push(E/a),m.push(1-p/u)}}for(let p=0;p<u;p++)for(let w=0;w<a;w++){const E=w+d*p,y=w+d*(p+1),k=w+1+d*(p+1),v=w+1+d*p;f.push(E,y,v),f.push(y,k,v)}this.setIndex(f),this.setAttribute("position",new Dt(g,3)),this.setAttribute("normal",new Dt(_,3)),this.setAttribute("uv",new Dt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Cs(e.width,e.height,e.widthSegments,e.heightSegments)}}class Ca extends Wt{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const u=Math.min(o+a,Math.PI);let d=0;const h=[],l=new G,c=new G,f=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){const w=[],E=p/n;let y=0;p===0&&o===0?y=.5/t:p===n&&u===Math.PI&&(y=-.5/t);for(let k=0;k<=t;k++){const v=k/t;l.x=-e*Math.cos(i+v*r)*Math.sin(o+E*a),l.y=e*Math.cos(o+E*a),l.z=e*Math.sin(i+v*r)*Math.sin(o+E*a),g.push(l.x,l.y,l.z),c.copy(l).normalize(),_.push(c.x,c.y,c.z),m.push(v+y,1-E),w.push(d++)}h.push(w)}for(let p=0;p<n;p++)for(let w=0;w<t;w++){const E=h[p][w+1],y=h[p][w],k=h[p+1][w],v=h[p+1][w+1];(p!==0||o>0)&&f.push(E,y,v),(p!==n-1||u<Math.PI)&&f.push(y,k,v)}this.setIndex(f),this.setAttribute("position",new Dt(g,3)),this.setAttribute("normal",new Dt(_,3)),this.setAttribute("uv",new Dt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ca(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class om extends Ts{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=tp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class am extends Ts{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class lm extends $c{constructor(e=-1,t=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=i+t,u=i-t;if(this.view!==null&&this.view.enabled){const d=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=d*this.view.offsetX,o=r+d*this.view.width,a-=h*this.view.offsetY,u=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,u,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class cm extends sn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}function fl(s,e,t,n){const i=dm(n);switch(t){case Gc:return s*e;case Wc:return s*e/i.components*i.byteLength;case Aa:return s*e/i.components*i.byteLength;case Xc:return s*e*2/i.components*i.byteLength;case xa:return s*e*2/i.components*i.byteLength;case Hc:return s*e*3/i.components*i.byteLength;case on:return s*e*4/i.components*i.byteLength;case ba:return s*e*4/i.components*i.byteLength;case pr:case mr:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case gr:case _r:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case No:case Oo:return Math.max(s,16)*Math.max(e,8)/4;case Fo:case Bo:return Math.max(s,8)*Math.max(e,8)/2;case zo:case Vo:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Go:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Ho:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Wo:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case Xo:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case Yo:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case qo:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case Ko:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case Qo:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case jo:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case Jo:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case Zo:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case $o:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case ea:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case ta:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case na:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case ia:case sa:case ra:return Math.ceil(s/4)*Math.ceil(e/4)*16;case oa:case aa:return Math.ceil(s/4)*Math.ceil(e/4)*8;case la:case ca:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function dm(s){switch(s){case bn:case Bc:return{byteLength:1,components:1};case vs:case Oc:case Ms:return{byteLength:2,components:1};case _a:case va:return{byteLength:2,components:4};case ci:case ga:case kn:return{byteLength:4,components:1};case zc:case Vc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ma}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ma);function cd(){let s=null,e=!1,t=null,n=null;function i(r,o){t(r,o),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function hm(s){const e=new WeakMap;function t(a,u){const d=a.array,h=a.usage,l=d.byteLength,c=s.createBuffer();s.bindBuffer(u,c),s.bufferData(u,d,h),a.onUploadCallback();let f;if(d instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&d instanceof Float16Array)f=s.HALF_FLOAT;else if(d instanceof Uint16Array)a.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(d instanceof Int16Array)f=s.SHORT;else if(d instanceof Uint32Array)f=s.UNSIGNED_INT;else if(d instanceof Int32Array)f=s.INT;else if(d instanceof Int8Array)f=s.BYTE;else if(d instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:c,type:f,bytesPerElement:d.BYTES_PER_ELEMENT,version:a.version,size:l}}function n(a,u,d){const h=u.array,l=u.updateRanges;if(s.bindBuffer(d,a),l.length===0)s.bufferSubData(d,0,h);else{l.sort((f,g)=>f.start-g.start);let c=0;for(let f=1;f<l.length;f++){const g=l[c],_=l[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++c,l[c]=_)}l.length=c+1;for(let f=0,g=l.length;f<g;f++){const _=l[f];s.bufferSubData(d,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}u.clearUpdateRanges()}u.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const u=e.get(a);u&&(s.deleteBuffer(u.buffer),e.delete(a))}function o(a,u){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const d=e.get(a);if(d===void 0)e.set(a,t(a,u));else if(d.version<a.version){if(d.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(d.buffer,a,u),d.version=a.version}}return{get:i,remove:r,update:o}}var um=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,fm=`#ifdef USE_ALPHAHASH
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
#endif`,pm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,mm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,gm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,_m=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,vm=`#ifdef USE_AOMAP
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
#endif`,Am=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,xm=`#ifdef USE_BATCHING
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
#endif`,bm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,ym=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Em=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Mm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Sm=`#ifdef USE_IRIDESCENCE
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
#endif`,wm=`#ifdef USE_BUMPMAP
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
#endif`,Tm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Cm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Rm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Dm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Pm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,km=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Lm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Im=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Um=`#define PI 3.141592653589793
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
} // validated`,Fm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Nm=`vec3 transformedNormal = objectNormal;
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
#endif`,Bm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Om=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,zm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Vm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Gm="gl_FragColor = linearToOutputTexel( gl_FragColor );",Hm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Wm=`#ifdef USE_ENVMAP
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
#endif`,Xm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ym=`#ifdef USE_ENVMAP
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
#endif`,qm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Km=`#ifdef USE_ENVMAP
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
#endif`,Qm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,jm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Jm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Zm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,$m=`#ifdef USE_GRADIENTMAP
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
}`,eg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,tg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ng=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ig=`uniform bool receiveShadow;
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
#endif`,sg=`#ifdef USE_ENVMAP
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
#endif`,rg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,og=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ag=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,cg=`PhysicalMaterial material;
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
#endif`,dg=`struct PhysicalMaterial {
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
}`,hg=`
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
#endif`,ug=`#if defined( RE_IndirectDiffuse )
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
#endif`,fg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,pg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,mg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,gg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,_g=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,vg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ag=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,xg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,bg=`#if defined( USE_POINTS_UV )
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
#endif`,yg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Eg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Mg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Sg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,wg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Tg=`#ifdef USE_MORPHTARGETS
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
#endif`,Cg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Rg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Dg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Pg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,kg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Lg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Ig=`#ifdef USE_NORMALMAP
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
#endif`,Ug=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Fg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ng=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Bg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Og=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,zg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Vg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Gg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Hg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Wg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Xg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Yg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,qg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Kg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Qg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,jg=`float getShadowMask() {
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
}`,Jg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Zg=`#ifdef USE_SKINNING
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
#endif`,$g=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,e0=`#ifdef USE_SKINNING
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
#endif`,t0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,n0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,i0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,s0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,r0=`#ifdef USE_TRANSMISSION
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
#endif`,o0=`#ifdef USE_TRANSMISSION
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
#endif`,a0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,l0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,c0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,d0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const h0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,u0=`uniform sampler2D t2D;
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
}`,f0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,p0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,m0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,g0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_0=`#include <common>
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
}`,v0=`#if DEPTH_PACKING == 3200
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
}`,A0=`#define DISTANCE
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
}`,x0=`#define DISTANCE
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
}`,b0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,y0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,E0=`uniform float scale;
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
}`,M0=`uniform vec3 diffuse;
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
}`,S0=`#include <common>
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
}`,w0=`uniform vec3 diffuse;
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
}`,T0=`#define LAMBERT
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
}`,C0=`#define LAMBERT
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
}`,R0=`#define MATCAP
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
}`,D0=`#define MATCAP
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
}`,P0=`#define NORMAL
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
}`,k0=`#define NORMAL
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
}`,L0=`#define PHONG
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
}`,I0=`#define PHONG
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
}`,U0=`#define STANDARD
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
}`,F0=`#define STANDARD
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
}`,N0=`#define TOON
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
}`,B0=`#define TOON
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
}`,O0=`uniform float size;
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
}`,z0=`uniform vec3 diffuse;
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
}`,V0=`#include <common>
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
}`,G0=`uniform vec3 color;
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
}`,H0=`uniform float rotation;
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
}`,W0=`uniform vec3 diffuse;
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
}`,je={alphahash_fragment:um,alphahash_pars_fragment:fm,alphamap_fragment:pm,alphamap_pars_fragment:mm,alphatest_fragment:gm,alphatest_pars_fragment:_m,aomap_fragment:vm,aomap_pars_fragment:Am,batching_pars_vertex:xm,batching_vertex:bm,begin_vertex:ym,beginnormal_vertex:Em,bsdfs:Mm,iridescence_fragment:Sm,bumpmap_pars_fragment:wm,clipping_planes_fragment:Tm,clipping_planes_pars_fragment:Cm,clipping_planes_pars_vertex:Rm,clipping_planes_vertex:Dm,color_fragment:Pm,color_pars_fragment:km,color_pars_vertex:Lm,color_vertex:Im,common:Um,cube_uv_reflection_fragment:Fm,defaultnormal_vertex:Nm,displacementmap_pars_vertex:Bm,displacementmap_vertex:Om,emissivemap_fragment:zm,emissivemap_pars_fragment:Vm,colorspace_fragment:Gm,colorspace_pars_fragment:Hm,envmap_fragment:Wm,envmap_common_pars_fragment:Xm,envmap_pars_fragment:Ym,envmap_pars_vertex:qm,envmap_physical_pars_fragment:sg,envmap_vertex:Km,fog_vertex:Qm,fog_pars_vertex:jm,fog_fragment:Jm,fog_pars_fragment:Zm,gradientmap_pars_fragment:$m,lightmap_pars_fragment:eg,lights_lambert_fragment:tg,lights_lambert_pars_fragment:ng,lights_pars_begin:ig,lights_toon_fragment:rg,lights_toon_pars_fragment:og,lights_phong_fragment:ag,lights_phong_pars_fragment:lg,lights_physical_fragment:cg,lights_physical_pars_fragment:dg,lights_fragment_begin:hg,lights_fragment_maps:ug,lights_fragment_end:fg,logdepthbuf_fragment:pg,logdepthbuf_pars_fragment:mg,logdepthbuf_pars_vertex:gg,logdepthbuf_vertex:_g,map_fragment:vg,map_pars_fragment:Ag,map_particle_fragment:xg,map_particle_pars_fragment:bg,metalnessmap_fragment:yg,metalnessmap_pars_fragment:Eg,morphinstance_vertex:Mg,morphcolor_vertex:Sg,morphnormal_vertex:wg,morphtarget_pars_vertex:Tg,morphtarget_vertex:Cg,normal_fragment_begin:Rg,normal_fragment_maps:Dg,normal_pars_fragment:Pg,normal_pars_vertex:kg,normal_vertex:Lg,normalmap_pars_fragment:Ig,clearcoat_normal_fragment_begin:Ug,clearcoat_normal_fragment_maps:Fg,clearcoat_pars_fragment:Ng,iridescence_pars_fragment:Bg,opaque_fragment:Og,packing:zg,premultiplied_alpha_fragment:Vg,project_vertex:Gg,dithering_fragment:Hg,dithering_pars_fragment:Wg,roughnessmap_fragment:Xg,roughnessmap_pars_fragment:Yg,shadowmap_pars_fragment:qg,shadowmap_pars_vertex:Kg,shadowmap_vertex:Qg,shadowmask_pars_fragment:jg,skinbase_vertex:Jg,skinning_pars_vertex:Zg,skinning_vertex:$g,skinnormal_vertex:e0,specularmap_fragment:t0,specularmap_pars_fragment:n0,tonemapping_fragment:i0,tonemapping_pars_fragment:s0,transmission_fragment:r0,transmission_pars_fragment:o0,uv_pars_fragment:a0,uv_pars_vertex:l0,uv_vertex:c0,worldpos_vertex:d0,background_vert:h0,background_frag:u0,backgroundCube_vert:f0,backgroundCube_frag:p0,cube_vert:m0,cube_frag:g0,depth_vert:_0,depth_frag:v0,distanceRGBA_vert:A0,distanceRGBA_frag:x0,equirect_vert:b0,equirect_frag:y0,linedashed_vert:E0,linedashed_frag:M0,meshbasic_vert:S0,meshbasic_frag:w0,meshlambert_vert:T0,meshlambert_frag:C0,meshmatcap_vert:R0,meshmatcap_frag:D0,meshnormal_vert:P0,meshnormal_frag:k0,meshphong_vert:L0,meshphong_frag:I0,meshphysical_vert:U0,meshphysical_frag:F0,meshtoon_vert:N0,meshtoon_frag:B0,points_vert:O0,points_frag:z0,shadow_vert:V0,shadow_frag:G0,sprite_vert:H0,sprite_frag:W0},xe={common:{diffuse:{value:new Je(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ke}},envmap:{envMap:{value:null},envMapRotation:{value:new Ke},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ke},normalScale:{value:new Ze(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Je(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Je(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0},uvTransform:{value:new Ke}},sprite:{diffuse:{value:new Je(16777215)},opacity:{value:1},center:{value:new Ze(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}}},An={basic:{uniforms:Bt([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.fog]),vertexShader:je.meshbasic_vert,fragmentShader:je.meshbasic_frag},lambert:{uniforms:Bt([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new Je(0)}}]),vertexShader:je.meshlambert_vert,fragmentShader:je.meshlambert_frag},phong:{uniforms:Bt([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new Je(0)},specular:{value:new Je(1118481)},shininess:{value:30}}]),vertexShader:je.meshphong_vert,fragmentShader:je.meshphong_frag},standard:{uniforms:Bt([xe.common,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.roughnessmap,xe.metalnessmap,xe.fog,xe.lights,{emissive:{value:new Je(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag},toon:{uniforms:Bt([xe.common,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.gradientmap,xe.fog,xe.lights,{emissive:{value:new Je(0)}}]),vertexShader:je.meshtoon_vert,fragmentShader:je.meshtoon_frag},matcap:{uniforms:Bt([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,{matcap:{value:null}}]),vertexShader:je.meshmatcap_vert,fragmentShader:je.meshmatcap_frag},points:{uniforms:Bt([xe.points,xe.fog]),vertexShader:je.points_vert,fragmentShader:je.points_frag},dashed:{uniforms:Bt([xe.common,xe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:je.linedashed_vert,fragmentShader:je.linedashed_frag},depth:{uniforms:Bt([xe.common,xe.displacementmap]),vertexShader:je.depth_vert,fragmentShader:je.depth_frag},normal:{uniforms:Bt([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,{opacity:{value:1}}]),vertexShader:je.meshnormal_vert,fragmentShader:je.meshnormal_frag},sprite:{uniforms:Bt([xe.sprite,xe.fog]),vertexShader:je.sprite_vert,fragmentShader:je.sprite_frag},background:{uniforms:{uvTransform:{value:new Ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:je.background_vert,fragmentShader:je.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ke}},vertexShader:je.backgroundCube_vert,fragmentShader:je.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:je.cube_vert,fragmentShader:je.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:je.equirect_vert,fragmentShader:je.equirect_frag},distanceRGBA:{uniforms:Bt([xe.common,xe.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:je.distanceRGBA_vert,fragmentShader:je.distanceRGBA_frag},shadow:{uniforms:Bt([xe.lights,xe.fog,{color:{value:new Je(0)},opacity:{value:1}}]),vertexShader:je.shadow_vert,fragmentShader:je.shadow_frag}};An.physical={uniforms:Bt([An.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ke},clearcoatNormalScale:{value:new Ze(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ke},sheen:{value:0},sheenColor:{value:new Je(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ke},transmissionSamplerSize:{value:new Ze},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ke},attenuationDistance:{value:0},attenuationColor:{value:new Je(0)},specularColor:{value:new Je(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ke},anisotropyVector:{value:new Ze},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ke}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag};const ir={r:0,b:0,g:0},Zn=new Fn,X0=new wt;function Y0(s,e,t,n,i,r,o){const a=new Je(0);let u=r===!0?0:1,d,h,l=null,c=0,f=null;function g(E){let y=E.isScene===!0?E.background:null;return y&&y.isTexture&&(y=(E.backgroundBlurriness>0?t:e).get(y)),y}function _(E){let y=!1;const k=g(E);k===null?p(a,u):k&&k.isColor&&(p(k,1),y=!0);const v=s.xr.getEnvironmentBlendMode();v==="additive"?n.buffers.color.setClear(0,0,0,1,o):v==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function m(E,y){const k=g(y);k&&(k.isCubeTexture||k.mapping===Rr)?(h===void 0&&(h=new mt(new qn(1,1,1),new yn({name:"BackgroundCubeMaterial",uniforms:Yi(An.backgroundCube.uniforms),vertexShader:An.backgroundCube.vertexShader,fragmentShader:An.backgroundCube.fragmentShader,side:Ot,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(v,S,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),Zn.copy(y.backgroundRotation),Zn.x*=-1,Zn.y*=-1,Zn.z*=-1,k.isCubeTexture&&k.isRenderTargetTexture===!1&&(Zn.y*=-1,Zn.z*=-1),h.material.uniforms.envMap.value=k,h.material.uniforms.flipEnvMap.value=k.isCubeTexture&&k.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(X0.makeRotationFromEuler(Zn)),h.material.toneMapped=rt.getTransfer(k.colorSpace)!==ft,(l!==k||c!==k.version||f!==s.toneMapping)&&(h.material.needsUpdate=!0,l=k,c=k.version,f=s.toneMapping),h.layers.enableAll(),E.unshift(h,h.geometry,h.material,0,0,null)):k&&k.isTexture&&(d===void 0&&(d=new mt(new Cs(2,2),new yn({name:"BackgroundMaterial",uniforms:Yi(An.background.uniforms),vertexShader:An.background.vertexShader,fragmentShader:An.background.fragmentShader,side:Un,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),Object.defineProperty(d.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(d)),d.material.uniforms.t2D.value=k,d.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,d.material.toneMapped=rt.getTransfer(k.colorSpace)!==ft,k.matrixAutoUpdate===!0&&k.updateMatrix(),d.material.uniforms.uvTransform.value.copy(k.matrix),(l!==k||c!==k.version||f!==s.toneMapping)&&(d.material.needsUpdate=!0,l=k,c=k.version,f=s.toneMapping),d.layers.enableAll(),E.unshift(d,d.geometry,d.material,0,0,null))}function p(E,y){E.getRGB(ir,Zc(s)),n.buffers.color.setClear(ir.r,ir.g,ir.b,y,o)}function w(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0)}return{getClearColor:function(){return a},setClearColor:function(E,y=1){a.set(E),u=y,p(a,u)},getClearAlpha:function(){return u},setClearAlpha:function(E){u=E,p(a,u)},render:_,addToRenderList:m,dispose:w}}function q0(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=c(null);let r=i,o=!1;function a(b,D,L,B,V){let H=!1;const N=l(B,L,D);r!==N&&(r=N,d(r.object)),H=f(b,B,L,V),H&&g(b,B,L,V),V!==null&&e.update(V,s.ELEMENT_ARRAY_BUFFER),(H||o)&&(o=!1,y(b,D,L,B),V!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function u(){return s.createVertexArray()}function d(b){return s.bindVertexArray(b)}function h(b){return s.deleteVertexArray(b)}function l(b,D,L){const B=L.wireframe===!0;let V=n[b.id];V===void 0&&(V={},n[b.id]=V);let H=V[D.id];H===void 0&&(H={},V[D.id]=H);let N=H[B];return N===void 0&&(N=c(u()),H[B]=N),N}function c(b){const D=[],L=[],B=[];for(let V=0;V<t;V++)D[V]=0,L[V]=0,B[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:L,attributeDivisors:B,object:b,attributes:{},index:null}}function f(b,D,L,B){const V=r.attributes,H=D.attributes;let N=0;const q=L.getAttributes();for(const C in q)if(q[C].location>=0){const se=V[C];let ae=H[C];if(ae===void 0&&(C==="instanceMatrix"&&b.instanceMatrix&&(ae=b.instanceMatrix),C==="instanceColor"&&b.instanceColor&&(ae=b.instanceColor)),se===void 0||se.attribute!==ae||ae&&se.data!==ae.data)return!0;N++}return r.attributesNum!==N||r.index!==B}function g(b,D,L,B){const V={},H=D.attributes;let N=0;const q=L.getAttributes();for(const C in q)if(q[C].location>=0){let se=H[C];se===void 0&&(C==="instanceMatrix"&&b.instanceMatrix&&(se=b.instanceMatrix),C==="instanceColor"&&b.instanceColor&&(se=b.instanceColor));const ae={};ae.attribute=se,se&&se.data&&(ae.data=se.data),V[C]=ae,N++}r.attributes=V,r.attributesNum=N,r.index=B}function _(){const b=r.newAttributes;for(let D=0,L=b.length;D<L;D++)b[D]=0}function m(b){p(b,0)}function p(b,D){const L=r.newAttributes,B=r.enabledAttributes,V=r.attributeDivisors;L[b]=1,B[b]===0&&(s.enableVertexAttribArray(b),B[b]=1),V[b]!==D&&(s.vertexAttribDivisor(b,D),V[b]=D)}function w(){const b=r.newAttributes,D=r.enabledAttributes;for(let L=0,B=D.length;L<B;L++)D[L]!==b[L]&&(s.disableVertexAttribArray(L),D[L]=0)}function E(b,D,L,B,V,H,N){N===!0?s.vertexAttribIPointer(b,D,L,V,H):s.vertexAttribPointer(b,D,L,B,V,H)}function y(b,D,L,B){_();const V=B.attributes,H=L.getAttributes(),N=D.defaultAttributeValues;for(const q in H){const C=H[q];if(C.location>=0){let ee=V[q];if(ee===void 0&&(q==="instanceMatrix"&&b.instanceMatrix&&(ee=b.instanceMatrix),q==="instanceColor"&&b.instanceColor&&(ee=b.instanceColor)),ee!==void 0){const se=ee.normalized,ae=ee.itemSize,Ne=e.get(ee);if(Ne===void 0)continue;const be=Ne.buffer,j=Ne.type,Ee=Ne.bytesPerElement,Y=j===s.INT||j===s.UNSIGNED_INT||ee.gpuType===ga;if(ee.isInterleavedBufferAttribute){const Z=ee.data,re=Z.stride,pe=ee.offset;if(Z.isInstancedInterleavedBuffer){for(let ne=0;ne<C.locationSize;ne++)p(C.location+ne,Z.meshPerAttribute);b.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let ne=0;ne<C.locationSize;ne++)m(C.location+ne);s.bindBuffer(s.ARRAY_BUFFER,be);for(let ne=0;ne<C.locationSize;ne++)E(C.location+ne,ae/C.locationSize,j,se,re*Ee,(pe+ae/C.locationSize*ne)*Ee,Y)}else{if(ee.isInstancedBufferAttribute){for(let Z=0;Z<C.locationSize;Z++)p(C.location+Z,ee.meshPerAttribute);b.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let Z=0;Z<C.locationSize;Z++)m(C.location+Z);s.bindBuffer(s.ARRAY_BUFFER,be);for(let Z=0;Z<C.locationSize;Z++)E(C.location+Z,ae/C.locationSize,j,se,ae*Ee,ae/C.locationSize*Z*Ee,Y)}}else if(N!==void 0){const se=N[q];if(se!==void 0)switch(se.length){case 2:s.vertexAttrib2fv(C.location,se);break;case 3:s.vertexAttrib3fv(C.location,se);break;case 4:s.vertexAttrib4fv(C.location,se);break;default:s.vertexAttrib1fv(C.location,se)}}}}w()}function k(){R();for(const b in n){const D=n[b];for(const L in D){const B=D[L];for(const V in B)h(B[V].object),delete B[V];delete D[L]}delete n[b]}}function v(b){if(n[b.id]===void 0)return;const D=n[b.id];for(const L in D){const B=D[L];for(const V in B)h(B[V].object),delete B[V];delete D[L]}delete n[b.id]}function S(b){for(const D in n){const L=n[D];if(L[b.id]===void 0)continue;const B=L[b.id];for(const V in B)h(B[V].object),delete B[V];delete L[b.id]}}function R(){x(),o=!0,r!==i&&(r=i,d(r.object))}function x(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:R,resetDefaultState:x,dispose:k,releaseStatesOfGeometry:v,releaseStatesOfProgram:S,initAttributes:_,enableAttribute:m,disableUnusedAttributes:w}}function K0(s,e,t){let n;function i(d){n=d}function r(d,h){s.drawArrays(n,d,h),t.update(h,n,1)}function o(d,h,l){l!==0&&(s.drawArraysInstanced(n,d,h,l),t.update(h,n,l))}function a(d,h,l){if(l===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,d,0,h,0,l);let f=0;for(let g=0;g<l;g++)f+=h[g];t.update(f,n,1)}function u(d,h,l,c){if(l===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<d.length;g++)o(d[g],h[g],c[g]);else{f.multiDrawArraysInstancedWEBGL(n,d,0,h,0,c,0,l);let g=0;for(let _=0;_<l;_++)g+=h[_]*c[_];t.update(g,n,1)}}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=u}function Q0(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const S=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(S.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(S){return!(S!==on&&n.convert(S)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(S){const R=S===Ms&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(S!==bn&&n.convert(S)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&S!==kn&&!R)}function u(S){if(S==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";S="mediump"}return S==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let d=t.precision!==void 0?t.precision:"highp";const h=u(d);h!==d&&(console.warn("THREE.WebGLRenderer:",d,"not supported, using",h,"instead."),d=h);const l=t.logarithmicDepthBuffer===!0,c=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),w=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),E=s.getParameter(s.MAX_VARYING_VECTORS),y=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),k=g>0,v=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:u,textureFormatReadable:o,textureTypeReadable:a,precision:d,logarithmicDepthBuffer:l,reversedDepthBuffer:c,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:w,maxVaryings:E,maxFragmentUniforms:y,vertexTextures:k,maxSamples:v}}function j0(s){const e=this;let t=null,n=0,i=!1,r=!1;const o=new ii,a=new Ke,u={value:null,needsUpdate:!1};this.uniform=u,this.numPlanes=0,this.numIntersection=0,this.init=function(l,c){const f=l.length!==0||c||n!==0||i;return i=c,n=l.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(l,c){t=h(l,c,0)},this.setState=function(l,c,f){const g=l.clippingPlanes,_=l.clipIntersection,m=l.clipShadows,p=s.get(l);if(!i||g===null||g.length===0||r&&!m)r?h(null):d();else{const w=r?0:n,E=w*4;let y=p.clippingState||null;u.value=y,y=h(g,c,E,f);for(let k=0;k!==E;++k)y[k]=t[k];p.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=w}};function d(){u.value!==t&&(u.value=t,u.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(l,c,f,g){const _=l!==null?l.length:0;let m=null;if(_!==0){if(m=u.value,g!==!0||m===null){const p=f+_*4,w=c.matrixWorldInverse;a.getNormalMatrix(w),(m===null||m.length<p)&&(m=new Float32Array(p));for(let E=0,y=f;E!==_;++E,y+=4)o.copy(l[E]).applyMatrix4(w,a),o.normal.toArray(m,y),m[y+3]=o.constant}u.value=m,u.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function J0(s){let e=new WeakMap;function t(o,a){return a===Lo?o.mapping=Hi:a===Io&&(o.mapping=Wi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Lo||a===Io)if(e.has(o)){const u=e.get(o).texture;return t(u,o.mapping)}else{const u=o.image;if(u&&u.height>0){const d=new em(u.height);return d.fromEquirectangularTexture(s,o),e.set(o,d),o.addEventListener("dispose",i),t(d.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const u=e.get(a);u!==void 0&&(e.delete(a),u.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const Ni=4,pl=[.125,.215,.35,.446,.526,.582],oi=20,co=new lm,ml=new Je;let ho=null,uo=0,fo=0,po=!1;const si=(1+Math.sqrt(5))/2,Ii=1/si,gl=[new G(-si,Ii,0),new G(si,Ii,0),new G(-Ii,0,si),new G(Ii,0,si),new G(0,si,-Ii),new G(0,si,Ii),new G(-1,1,-1),new G(1,1,-1),new G(-1,1,1),new G(1,1,1)],Z0=new G;class _l{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100,r={}){const{size:o=256,position:a=Z0}=r;ho=this._renderer.getRenderTarget(),uo=this._renderer.getActiveCubeFace(),fo=this._renderer.getActiveMipmapLevel(),po=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const u=this._allocateTargets();return u.depthBuffer=!0,this._sceneToCubeUV(e,n,i,u,a),t>0&&this._blur(u,0,0,t),this._applyPMREM(u),this._cleanup(u),u}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=xl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Al(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(ho,uo,fo),this._renderer.xr.enabled=po,e.scissorTest=!1,sr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Hi||e.mapping===Wi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ho=this._renderer.getRenderTarget(),uo=this._renderer.getActiveCubeFace(),fo=this._renderer.getActiveMipmapLevel(),po=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:fn,minFilter:fn,generateMipmaps:!1,type:Ms,format:on,colorSpace:Xi,depthBuffer:!1},i=vl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=vl(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=$0(r)),this._blurMaterial=e_(r,e,t)}return i}_compileMaterial(e){const t=new mt(this._lodPlanes[0],e);this._renderer.compile(t,co)}_sceneToCubeUV(e,t,n,i,r){const u=new sn(90,1,t,n),d=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],l=this._renderer,c=l.autoClear,f=l.toneMapping;l.getClearColor(ml),l.toneMapping=Xn,l.autoClear=!1,l.state.buffers.depth.getReversed()&&(l.setRenderTarget(i),l.clearDepth(),l.setRenderTarget(null));const _=new Zt({name:"PMREM.Background",side:Ot,depthWrite:!1,depthTest:!1}),m=new mt(new qn,_);let p=!1;const w=e.background;w?w.isColor&&(_.color.copy(w),e.background=null,p=!0):(_.color.copy(ml),p=!0);for(let E=0;E<6;E++){const y=E%3;y===0?(u.up.set(0,d[E],0),u.position.set(r.x,r.y,r.z),u.lookAt(r.x+h[E],r.y,r.z)):y===1?(u.up.set(0,0,d[E]),u.position.set(r.x,r.y,r.z),u.lookAt(r.x,r.y+h[E],r.z)):(u.up.set(0,d[E],0),u.position.set(r.x,r.y,r.z),u.lookAt(r.x,r.y,r.z+h[E]));const k=this._cubeSize;sr(i,y*k,E>2?k:0,k,k),l.setRenderTarget(i),p&&l.render(m,u),l.render(e,u)}m.geometry.dispose(),m.material.dispose(),l.toneMapping=f,l.autoClear=c,e.background=w}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===Hi||e.mapping===Wi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=xl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Al());const r=i?this._cubemapMaterial:this._equirectMaterial,o=new mt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const u=this._cubeSize;sr(t,0,0,3*u,2*u),n.setRenderTarget(t),n.render(o,co)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=gl[(i-r-1)%gl.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",r),this._halfBlur(o,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,o,a){const u=this._renderer,d=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,l=new mt(this._lodPlanes[i],d),c=d.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*oi-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):oi;m>oi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${oi}`);const p=[];let w=0;for(let S=0;S<oi;++S){const R=S/_,x=Math.exp(-R*R/2);p.push(x),S===0?w+=x:S<m&&(w+=2*x)}for(let S=0;S<p.length;S++)p[S]=p[S]/w;c.envMap.value=e.texture,c.samples.value=m,c.weights.value=p,c.latitudinal.value=o==="latitudinal",a&&(c.poleAxis.value=a);const{_lodMax:E}=this;c.dTheta.value=g,c.mipInt.value=E-n;const y=this._sizeLods[i],k=3*y*(i>E-Ni?i-E+Ni:0),v=4*(this._cubeSize-y);sr(t,k,v,3*y,2*y),u.setRenderTarget(t),u.render(l,co)}}function $0(s){const e=[],t=[],n=[];let i=s;const r=s-Ni+1+pl.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);t.push(a);let u=1/a;o>s-Ni?u=pl[o-s+Ni-1]:o===0&&(u=0),n.push(u);const d=1/(a-2),h=-d,l=1+d,c=[h,h,l,h,l,l,h,h,l,l,h,l],f=6,g=6,_=3,m=2,p=1,w=new Float32Array(_*g*f),E=new Float32Array(m*g*f),y=new Float32Array(p*g*f);for(let v=0;v<f;v++){const S=v%3*2/3-1,R=v>2?0:-1,x=[S,R,0,S+2/3,R,0,S+2/3,R+1,0,S,R,0,S+2/3,R+1,0,S,R+1,0];w.set(x,_*g*v),E.set(c,m*g*v);const b=[v,v,v,v,v,v];y.set(b,p*g*v)}const k=new Wt;k.setAttribute("position",new It(w,_)),k.setAttribute("uv",new It(E,m)),k.setAttribute("faceIndex",new It(y,p)),e.push(k),i>Ni&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function vl(s,e,t){const n=new di(s,e,t);return n.texture.mapping=Rr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function sr(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function e_(s,e,t){const n=new Float32Array(oi),i=new G(0,1,0);return new yn({name:"SphericalGaussianBlur",defines:{n:oi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Ra(),fragmentShader:`

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
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function Al(){return new yn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ra(),fragmentShader:`

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
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function xl(){return new yn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ra(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function Ra(){return`

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
	`}function t_(s){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const u=a.mapping,d=u===Lo||u===Io,h=u===Hi||u===Wi;if(d||h){let l=e.get(a);const c=l!==void 0?l.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==c)return t===null&&(t=new _l(s)),l=d?t.fromEquirectangular(a,l):t.fromCubemap(a,l),l.texture.pmremVersion=a.pmremVersion,e.set(a,l),l.texture;if(l!==void 0)return l.texture;{const f=a.image;return d&&f&&f.height>0||h&&f&&i(f)?(t===null&&(t=new _l(s)),l=d?t.fromEquirectangular(a):t.fromCubemap(a),l.texture.pmremVersion=a.pmremVersion,e.set(a,l),a.addEventListener("dispose",r),l.texture):null}}}return a}function i(a){let u=0;const d=6;for(let h=0;h<d;h++)a[h]!==void 0&&u++;return u===d}function r(a){const u=a.target;u.removeEventListener("dispose",r);const d=e.get(u);d!==void 0&&(e.delete(u),d.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function n_(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&Es("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function i_(s,e,t,n){const i={},r=new WeakMap;function o(l){const c=l.target;c.index!==null&&e.remove(c.index);for(const g in c.attributes)e.remove(c.attributes[g]);c.removeEventListener("dispose",o),delete i[c.id];const f=r.get(c);f&&(e.remove(f),r.delete(c)),n.releaseStatesOfGeometry(c),c.isInstancedBufferGeometry===!0&&delete c._maxInstanceCount,t.memory.geometries--}function a(l,c){return i[c.id]===!0||(c.addEventListener("dispose",o),i[c.id]=!0,t.memory.geometries++),c}function u(l){const c=l.attributes;for(const f in c)e.update(c[f],s.ARRAY_BUFFER)}function d(l){const c=[],f=l.index,g=l.attributes.position;let _=0;if(f!==null){const w=f.array;_=f.version;for(let E=0,y=w.length;E<y;E+=3){const k=w[E+0],v=w[E+1],S=w[E+2];c.push(k,v,v,S,S,k)}}else if(g!==void 0){const w=g.array;_=g.version;for(let E=0,y=w.length/3-1;E<y;E+=3){const k=E+0,v=E+1,S=E+2;c.push(k,v,v,S,S,k)}}else return;const m=new(qc(c)?Jc:jc)(c,1);m.version=_;const p=r.get(l);p&&e.remove(p),r.set(l,m)}function h(l){const c=r.get(l);if(c){const f=l.index;f!==null&&c.version<f.version&&d(l)}else d(l);return r.get(l)}return{get:a,update:u,getWireframeAttribute:h}}function s_(s,e,t){let n;function i(c){n=c}let r,o;function a(c){r=c.type,o=c.bytesPerElement}function u(c,f){s.drawElements(n,f,r,c*o),t.update(f,n,1)}function d(c,f,g){g!==0&&(s.drawElementsInstanced(n,f,r,c*o,g),t.update(f,n,g))}function h(c,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,c,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];t.update(m,n,1)}function l(c,f,g,_){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<c.length;p++)d(c[p]/o,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,c,0,_,0,g);let p=0;for(let w=0;w<g;w++)p+=f[w]*_[w];t.update(p,n,1)}}this.setMode=i,this.setIndex=a,this.render=u,this.renderInstances=d,this.renderMultiDraw=h,this.renderMultiDrawInstances=l}function r_(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case s.TRIANGLES:t.triangles+=a*(r/3);break;case s.LINES:t.lines+=a*(r/2);break;case s.LINE_STRIP:t.lines+=a*(r-1);break;case s.LINE_LOOP:t.lines+=a*r;break;case s.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function o_(s,e,t){const n=new WeakMap,i=new Et;function r(o,a,u){const d=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,l=h!==void 0?h.length:0;let c=n.get(a);if(c===void 0||c.count!==l){let x=function(){S.dispose(),n.delete(a),a.removeEventListener("dispose",x)};c!==void 0&&c.texture.dispose();const f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],w=a.morphAttributes.color||[];let E=0;f===!0&&(E=1),g===!0&&(E=2),_===!0&&(E=3);let y=a.attributes.position.count*E,k=1;y>e.maxTextureSize&&(k=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);const v=new Float32Array(y*k*4*l),S=new Ma(v,y,k,l);S.type=kn,S.needsUpdate=!0;const R=E*4;for(let b=0;b<l;b++){const D=m[b],L=p[b],B=w[b],V=y*k*4*b;for(let H=0;H<D.count;H++){const N=H*R;f===!0&&(i.fromBufferAttribute(D,H),v[V+N+0]=i.x,v[V+N+1]=i.y,v[V+N+2]=i.z,v[V+N+3]=0),g===!0&&(i.fromBufferAttribute(L,H),v[V+N+4]=i.x,v[V+N+5]=i.y,v[V+N+6]=i.z,v[V+N+7]=0),_===!0&&(i.fromBufferAttribute(B,H),v[V+N+8]=i.x,v[V+N+9]=i.y,v[V+N+10]=i.z,v[V+N+11]=B.itemSize===4?i.w:1)}}c={count:l,texture:S,size:new Ze(y,k)},n.set(a,c),a.addEventListener("dispose",x)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)u.getUniforms().setValue(s,"morphTexture",o.morphTexture,t);else{let f=0;for(let _=0;_<d.length;_++)f+=d[_];const g=a.morphTargetsRelative?1:1-f;u.getUniforms().setValue(s,"morphTargetBaseInfluence",g),u.getUniforms().setValue(s,"morphTargetInfluences",d)}u.getUniforms().setValue(s,"morphTargetsTexture",c.texture,t),u.getUniforms().setValue(s,"morphTargetsTextureSize",c.size)}return{update:r}}function a_(s,e,t,n){let i=new WeakMap;function r(u){const d=n.render.frame,h=u.geometry,l=e.get(u,h);if(i.get(l)!==d&&(e.update(l),i.set(l,d)),u.isInstancedMesh&&(u.hasEventListener("dispose",a)===!1&&u.addEventListener("dispose",a),i.get(u)!==d&&(t.update(u.instanceMatrix,s.ARRAY_BUFFER),u.instanceColor!==null&&t.update(u.instanceColor,s.ARRAY_BUFFER),i.set(u,d))),u.isSkinnedMesh){const c=u.skeleton;i.get(c)!==d&&(c.update(),i.set(c,d))}return l}function o(){i=new WeakMap}function a(u){const d=u.target;d.removeEventListener("dispose",a),t.remove(d.instanceMatrix),d.instanceColor!==null&&t.remove(d.instanceColor)}return{update:r,dispose:o}}const dd=new zt,bl=new ad(1,1),hd=new Ma,ud=new Fp,fd=new ed,yl=[],El=[],Ml=new Float32Array(16),Sl=new Float32Array(9),wl=new Float32Array(4);function Ki(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=yl[i];if(r===void 0&&(r=new Float32Array(i),yl[i]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,s[o].toArray(r,a)}return r}function Tt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function Ct(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function Pr(s,e){let t=El[e];t===void 0&&(t=new Int32Array(e),El[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function l_(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function c_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;s.uniform2fv(this.addr,e),Ct(t,e)}}function d_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Tt(t,e))return;s.uniform3fv(this.addr,e),Ct(t,e)}}function h_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;s.uniform4fv(this.addr,e),Ct(t,e)}}function u_(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Ct(t,e)}else{if(Tt(t,n))return;wl.set(n),s.uniformMatrix2fv(this.addr,!1,wl),Ct(t,n)}}function f_(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Ct(t,e)}else{if(Tt(t,n))return;Sl.set(n),s.uniformMatrix3fv(this.addr,!1,Sl),Ct(t,n)}}function p_(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Ct(t,e)}else{if(Tt(t,n))return;Ml.set(n),s.uniformMatrix4fv(this.addr,!1,Ml),Ct(t,n)}}function m_(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function g_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;s.uniform2iv(this.addr,e),Ct(t,e)}}function __(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;s.uniform3iv(this.addr,e),Ct(t,e)}}function v_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;s.uniform4iv(this.addr,e),Ct(t,e)}}function A_(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function x_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;s.uniform2uiv(this.addr,e),Ct(t,e)}}function b_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;s.uniform3uiv(this.addr,e),Ct(t,e)}}function y_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;s.uniform4uiv(this.addr,e),Ct(t,e)}}function E_(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(bl.compareFunction=Yc,r=bl):r=dd,t.setTexture2D(e||r,i)}function M_(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||ud,i)}function S_(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||fd,i)}function w_(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||hd,i)}function T_(s){switch(s){case 5126:return l_;case 35664:return c_;case 35665:return d_;case 35666:return h_;case 35674:return u_;case 35675:return f_;case 35676:return p_;case 5124:case 35670:return m_;case 35667:case 35671:return g_;case 35668:case 35672:return __;case 35669:case 35673:return v_;case 5125:return A_;case 36294:return x_;case 36295:return b_;case 36296:return y_;case 35678:case 36198:case 36298:case 36306:case 35682:return E_;case 35679:case 36299:case 36307:return M_;case 35680:case 36300:case 36308:case 36293:return S_;case 36289:case 36303:case 36311:case 36292:return w_}}function C_(s,e){s.uniform1fv(this.addr,e)}function R_(s,e){const t=Ki(e,this.size,2);s.uniform2fv(this.addr,t)}function D_(s,e){const t=Ki(e,this.size,3);s.uniform3fv(this.addr,t)}function P_(s,e){const t=Ki(e,this.size,4);s.uniform4fv(this.addr,t)}function k_(s,e){const t=Ki(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function L_(s,e){const t=Ki(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function I_(s,e){const t=Ki(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function U_(s,e){s.uniform1iv(this.addr,e)}function F_(s,e){s.uniform2iv(this.addr,e)}function N_(s,e){s.uniform3iv(this.addr,e)}function B_(s,e){s.uniform4iv(this.addr,e)}function O_(s,e){s.uniform1uiv(this.addr,e)}function z_(s,e){s.uniform2uiv(this.addr,e)}function V_(s,e){s.uniform3uiv(this.addr,e)}function G_(s,e){s.uniform4uiv(this.addr,e)}function H_(s,e,t){const n=this.cache,i=e.length,r=Pr(t,i);Tt(n,r)||(s.uniform1iv(this.addr,r),Ct(n,r));for(let o=0;o!==i;++o)t.setTexture2D(e[o]||dd,r[o])}function W_(s,e,t){const n=this.cache,i=e.length,r=Pr(t,i);Tt(n,r)||(s.uniform1iv(this.addr,r),Ct(n,r));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||ud,r[o])}function X_(s,e,t){const n=this.cache,i=e.length,r=Pr(t,i);Tt(n,r)||(s.uniform1iv(this.addr,r),Ct(n,r));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||fd,r[o])}function Y_(s,e,t){const n=this.cache,i=e.length,r=Pr(t,i);Tt(n,r)||(s.uniform1iv(this.addr,r),Ct(n,r));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||hd,r[o])}function q_(s){switch(s){case 5126:return C_;case 35664:return R_;case 35665:return D_;case 35666:return P_;case 35674:return k_;case 35675:return L_;case 35676:return I_;case 5124:case 35670:return U_;case 35667:case 35671:return F_;case 35668:case 35672:return N_;case 35669:case 35673:return B_;case 5125:return O_;case 36294:return z_;case 36295:return V_;case 36296:return G_;case 35678:case 36198:case 36298:case 36306:case 35682:return H_;case 35679:case 36299:case 36307:return W_;case 35680:case 36300:case 36308:case 36293:return X_;case 36289:case 36303:case 36311:case 36292:return Y_}}class K_{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=T_(t.type)}}class Q_{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=q_(t.type)}}class j_{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(e,t[a.id],n)}}}const mo=/(\w+)(\])?(\[|\.)?/g;function Tl(s,e){s.seq.push(e),s.map[e.id]=e}function J_(s,e,t){const n=s.name,i=n.length;for(mo.lastIndex=0;;){const r=mo.exec(n),o=mo.lastIndex;let a=r[1];const u=r[2]==="]",d=r[3];if(u&&(a=a|0),d===void 0||d==="["&&o+2===i){Tl(t,d===void 0?new K_(a,s,e):new Q_(a,s,e));break}else{let l=t.map[a];l===void 0&&(l=new j_(a),Tl(t,l)),t=l}}}class vr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=e.getActiveUniform(t,i),o=e.getUniformLocation(t,r.name);J_(r,o,this)}}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,o=t.length;r!==o;++r){const a=t[r],u=n[a.id];u.needsUpdate!==!1&&a.setValue(e,u.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const o=e[i];o.id in t&&n.push(o)}return n}}function Cl(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const Z_=37297;let $_=0;function ev(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}const Rl=new Ke;function tv(s){rt._getMatrix(Rl,rt.workingColorSpace,s);const e=`mat3( ${Rl.elements.map(t=>t.toFixed(4))} )`;switch(rt.getTransfer(s)){case br:return[e,"LinearTransferOETF"];case ft:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function Dl(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),r=(s.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+ev(s.getShaderSource(e),a)}else return r}function nv(s,e){const t=tv(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function iv(s,e){let t;switch(e){case qf:t="Linear";break;case Kf:t="Reinhard";break;case Qf:t="Cineon";break;case jf:t="ACESFilmic";break;case Zf:t="AgX";break;case $f:t="Neutral";break;case Jf:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const rr=new G;function sv(){rt.getLuminanceCoefficients(rr);const s=rr.x.toFixed(4),e=rr.y.toFixed(4),t=rr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function rv(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(hs).join(`
`)}function ov(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function av(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:s.getAttribLocation(e,o),locationSize:a}}return t}function hs(s){return s!==""}function Pl(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function kl(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const lv=/^[ \t]*#include +<([\w\d./]+)>/gm;function ha(s){return s.replace(lv,dv)}const cv=new Map;function dv(s,e){let t=je[e];if(t===void 0){const n=cv.get(e);if(n!==void 0)t=je[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return ha(t)}const hv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ll(s){return s.replace(hv,uv)}function uv(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Il(s){let e=`precision ${s.precision} float;
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
#define LOW_PRECISION`),e}function fv(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Uc?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===wf?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Dn&&(e="SHADOWMAP_TYPE_VSM"),e}function pv(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Hi:case Wi:e="ENVMAP_TYPE_CUBE";break;case Rr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function mv(s){let e="ENVMAP_MODE_REFLECTION";return s.envMap&&s.envMapMode===Wi&&(e="ENVMAP_MODE_REFRACTION"),e}function gv(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Fc:e="ENVMAP_BLENDING_MULTIPLY";break;case Xf:e="ENVMAP_BLENDING_MIX";break;case Yf:e="ENVMAP_BLENDING_ADD";break}return e}function _v(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function vv(s,e,t,n){const i=s.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const u=fv(t),d=pv(t),h=mv(t),l=gv(t),c=_v(t),f=rv(t),g=ov(r),_=i.createProgram();let m,p,w=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(hs).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(hs).join(`
`),p.length>0&&(p+=`
`)):(m=[Il(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+u:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(hs).join(`
`),p=[Il(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.envMap?"#define "+h:"",t.envMap?"#define "+l:"",c?"#define CUBEUV_TEXEL_WIDTH "+c.texelWidth:"",c?"#define CUBEUV_TEXEL_HEIGHT "+c.texelHeight:"",c?"#define CUBEUV_MAX_MIP "+c.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+u:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Xn?"#define TONE_MAPPING":"",t.toneMapping!==Xn?je.tonemapping_pars_fragment:"",t.toneMapping!==Xn?iv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",je.colorspace_pars_fragment,nv("linearToOutputTexel",t.outputColorSpace),sv(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(hs).join(`
`)),o=ha(o),o=Pl(o,t),o=kl(o,t),a=ha(a),a=Pl(a,t),a=kl(a,t),o=Ll(o),a=Ll(a),t.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===yr?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===yr?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const E=w+m+o,y=w+p+a,k=Cl(i,i.VERTEX_SHADER,E),v=Cl(i,i.FRAGMENT_SHADER,y);i.attachShader(_,k),i.attachShader(_,v),t.index0AttributeName!==void 0?i.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function S(D){if(s.debug.checkShaderErrors){const L=i.getProgramInfoLog(_)||"",B=i.getShaderInfoLog(k)||"",V=i.getShaderInfoLog(v)||"",H=L.trim(),N=B.trim(),q=V.trim();let C=!0,ee=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(C=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,_,k,v);else{const se=Dl(i,k,"vertex"),ae=Dl(i,v,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+H+`
`+se+`
`+ae)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):(N===""||q==="")&&(ee=!1);ee&&(D.diagnostics={runnable:C,programLog:H,vertexShader:{log:N,prefix:m},fragmentShader:{log:q,prefix:p}})}i.deleteShader(k),i.deleteShader(v),R=new vr(i,_),x=av(i,_)}let R;this.getUniforms=function(){return R===void 0&&S(this),R};let x;this.getAttributes=function(){return x===void 0&&S(this),x};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=i.getProgramParameter(_,Z_)),b},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=$_++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=k,this.fragmentShader=v,this}let Av=0;class xv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new bv(e),t.set(e,n)),n}}class bv{constructor(e){this.id=Av++,this.code=e,this.usedTimes=0}}function yv(s,e,t,n,i,r,o){const a=new Kc,u=new xv,d=new Set,h=[],l=i.logarithmicDepthBuffer,c=i.vertexTextures;let f=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(x){return d.add(x),x===0?"uv":`uv${x}`}function m(x,b,D,L,B){const V=L.fog,H=B.geometry,N=x.isMeshStandardMaterial?L.environment:null,q=(x.isMeshStandardMaterial?t:e).get(x.envMap||N),C=q&&q.mapping===Rr?q.image.height:null,ee=g[x.type];x.precision!==null&&(f=i.getMaxPrecision(x.precision),f!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",f,"instead."));const se=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,ae=se!==void 0?se.length:0;let Ne=0;H.morphAttributes.position!==void 0&&(Ne=1),H.morphAttributes.normal!==void 0&&(Ne=2),H.morphAttributes.color!==void 0&&(Ne=3);let be,j,Ee,Y;if(ee){const tt=An[ee];be=tt.vertexShader,j=tt.fragmentShader}else be=x.vertexShader,j=x.fragmentShader,u.update(x),Ee=u.getVertexShaderID(x),Y=u.getFragmentShaderID(x);const Z=s.getRenderTarget(),re=s.state.buffers.depth.getReversed(),pe=B.isInstancedMesh===!0,ne=B.isBatchedMesh===!0,ye=!!x.map,et=!!x.matcap,I=!!q,Qe=!!x.aoMap,Xe=!!x.lightMap,Pe=!!x.bumpMap,_e=!!x.normalMap,We=!!x.displacementMap,Ce=!!x.emissiveMap,Oe=!!x.metalnessMap,vt=!!x.roughnessMap,_t=x.anisotropy>0,P=x.clearcoat>0,A=x.dispersion>0,W=x.iridescence>0,J=x.sheen>0,ie=x.transmission>0,Q=_t&&!!x.anisotropyMap,ke=P&&!!x.clearcoatMap,he=P&&!!x.clearcoatNormalMap,De=P&&!!x.clearcoatRoughnessMap,Le=W&&!!x.iridescenceMap,de=W&&!!x.iridescenceThicknessMap,me=J&&!!x.sheenColorMap,ze=J&&!!x.sheenRoughnessMap,we=!!x.specularMap,ve=!!x.specularColorMap,Ve=!!x.specularIntensityMap,U=ie&&!!x.transmissionMap,le=ie&&!!x.thicknessMap,ue=!!x.gradientMap,Se=!!x.alphaMap,oe=x.alphaTest>0,$=!!x.alphaHash,Re=!!x.extensions;let He=Xn;x.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(He=s.toneMapping);const lt={shaderID:ee,shaderType:x.type,shaderName:x.name,vertexShader:be,fragmentShader:j,defines:x.defines,customVertexShaderID:Ee,customFragmentShaderID:Y,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:f,batching:ne,batchingColor:ne&&B._colorsTexture!==null,instancing:pe,instancingColor:pe&&B.instanceColor!==null,instancingMorph:pe&&B.morphTexture!==null,supportsVertexTextures:c,outputColorSpace:Z===null?s.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:Xi,alphaToCoverage:!!x.alphaToCoverage,map:ye,matcap:et,envMap:I,envMapMode:I&&q.mapping,envMapCubeUVHeight:C,aoMap:Qe,lightMap:Xe,bumpMap:Pe,normalMap:_e,displacementMap:c&&We,emissiveMap:Ce,normalMapObjectSpace:_e&&x.normalMapType===sp,normalMapTangentSpace:_e&&x.normalMapType===ip,metalnessMap:Oe,roughnessMap:vt,anisotropy:_t,anisotropyMap:Q,clearcoat:P,clearcoatMap:ke,clearcoatNormalMap:he,clearcoatRoughnessMap:De,dispersion:A,iridescence:W,iridescenceMap:Le,iridescenceThicknessMap:de,sheen:J,sheenColorMap:me,sheenRoughnessMap:ze,specularMap:we,specularColorMap:ve,specularIntensityMap:Ve,transmission:ie,transmissionMap:U,thicknessMap:le,gradientMap:ue,opaque:x.transparent===!1&&x.blending===Oi&&x.alphaToCoverage===!1,alphaMap:Se,alphaTest:oe,alphaHash:$,combine:x.combine,mapUv:ye&&_(x.map.channel),aoMapUv:Qe&&_(x.aoMap.channel),lightMapUv:Xe&&_(x.lightMap.channel),bumpMapUv:Pe&&_(x.bumpMap.channel),normalMapUv:_e&&_(x.normalMap.channel),displacementMapUv:We&&_(x.displacementMap.channel),emissiveMapUv:Ce&&_(x.emissiveMap.channel),metalnessMapUv:Oe&&_(x.metalnessMap.channel),roughnessMapUv:vt&&_(x.roughnessMap.channel),anisotropyMapUv:Q&&_(x.anisotropyMap.channel),clearcoatMapUv:ke&&_(x.clearcoatMap.channel),clearcoatNormalMapUv:he&&_(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:De&&_(x.clearcoatRoughnessMap.channel),iridescenceMapUv:Le&&_(x.iridescenceMap.channel),iridescenceThicknessMapUv:de&&_(x.iridescenceThicknessMap.channel),sheenColorMapUv:me&&_(x.sheenColorMap.channel),sheenRoughnessMapUv:ze&&_(x.sheenRoughnessMap.channel),specularMapUv:we&&_(x.specularMap.channel),specularColorMapUv:ve&&_(x.specularColorMap.channel),specularIntensityMapUv:Ve&&_(x.specularIntensityMap.channel),transmissionMapUv:U&&_(x.transmissionMap.channel),thicknessMapUv:le&&_(x.thicknessMap.channel),alphaMapUv:Se&&_(x.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(_e||_t),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!H.attributes.uv&&(ye||Se),fog:!!V,useFog:x.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:x.flatShading===!0&&x.wireframe===!1,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:l,reversedDepthBuffer:re,skinning:B.isSkinnedMesh===!0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:ae,morphTextureStride:Ne,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:x.dithering,shadowMapEnabled:s.shadowMap.enabled&&D.length>0,shadowMapType:s.shadowMap.type,toneMapping:He,decodeVideoTexture:ye&&x.map.isVideoTexture===!0&&rt.getTransfer(x.map.colorSpace)===ft,decodeVideoTextureEmissive:Ce&&x.emissiveMap.isVideoTexture===!0&&rt.getTransfer(x.emissiveMap.colorSpace)===ft,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Jt,flipSided:x.side===Ot,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:Re&&x.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Re&&x.extensions.multiDraw===!0||ne)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return lt.vertexUv1s=d.has(1),lt.vertexUv2s=d.has(2),lt.vertexUv3s=d.has(3),d.clear(),lt}function p(x){const b=[];if(x.shaderID?b.push(x.shaderID):(b.push(x.customVertexShaderID),b.push(x.customFragmentShaderID)),x.defines!==void 0)for(const D in x.defines)b.push(D),b.push(x.defines[D]);return x.isRawShaderMaterial===!1&&(w(b,x),E(b,x),b.push(s.outputColorSpace)),b.push(x.customProgramCacheKey),b.join()}function w(x,b){x.push(b.precision),x.push(b.outputColorSpace),x.push(b.envMapMode),x.push(b.envMapCubeUVHeight),x.push(b.mapUv),x.push(b.alphaMapUv),x.push(b.lightMapUv),x.push(b.aoMapUv),x.push(b.bumpMapUv),x.push(b.normalMapUv),x.push(b.displacementMapUv),x.push(b.emissiveMapUv),x.push(b.metalnessMapUv),x.push(b.roughnessMapUv),x.push(b.anisotropyMapUv),x.push(b.clearcoatMapUv),x.push(b.clearcoatNormalMapUv),x.push(b.clearcoatRoughnessMapUv),x.push(b.iridescenceMapUv),x.push(b.iridescenceThicknessMapUv),x.push(b.sheenColorMapUv),x.push(b.sheenRoughnessMapUv),x.push(b.specularMapUv),x.push(b.specularColorMapUv),x.push(b.specularIntensityMapUv),x.push(b.transmissionMapUv),x.push(b.thicknessMapUv),x.push(b.combine),x.push(b.fogExp2),x.push(b.sizeAttenuation),x.push(b.morphTargetsCount),x.push(b.morphAttributeCount),x.push(b.numDirLights),x.push(b.numPointLights),x.push(b.numSpotLights),x.push(b.numSpotLightMaps),x.push(b.numHemiLights),x.push(b.numRectAreaLights),x.push(b.numDirLightShadows),x.push(b.numPointLightShadows),x.push(b.numSpotLightShadows),x.push(b.numSpotLightShadowsWithMaps),x.push(b.numLightProbes),x.push(b.shadowMapType),x.push(b.toneMapping),x.push(b.numClippingPlanes),x.push(b.numClipIntersection),x.push(b.depthPacking)}function E(x,b){a.disableAll(),b.supportsVertexTextures&&a.enable(0),b.instancing&&a.enable(1),b.instancingColor&&a.enable(2),b.instancingMorph&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),b.dispersion&&a.enable(20),b.batchingColor&&a.enable(21),b.gradientMap&&a.enable(22),x.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.reversedDepthBuffer&&a.enable(4),b.skinning&&a.enable(5),b.morphTargets&&a.enable(6),b.morphNormals&&a.enable(7),b.morphColors&&a.enable(8),b.premultipliedAlpha&&a.enable(9),b.shadowMapEnabled&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.decodeVideoTextureEmissive&&a.enable(20),b.alphaToCoverage&&a.enable(21),x.push(a.mask)}function y(x){const b=g[x.type];let D;if(b){const L=An[b];D=jp.clone(L.uniforms)}else D=x.uniforms;return D}function k(x,b){let D;for(let L=0,B=h.length;L<B;L++){const V=h[L];if(V.cacheKey===b){D=V,++D.usedTimes;break}}return D===void 0&&(D=new vv(s,b,x,r),h.push(D)),D}function v(x){if(--x.usedTimes===0){const b=h.indexOf(x);h[b]=h[h.length-1],h.pop(),x.destroy()}}function S(x){u.remove(x)}function R(){u.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:y,acquireProgram:k,releaseProgram:v,releaseShaderCache:S,programs:h,dispose:R}}function Ev(){let s=new WeakMap;function e(o){return s.has(o)}function t(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,u){s.get(o)[a]=u}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function Mv(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function Ul(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Fl(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function o(l,c,f,g,_,m){let p=s[e];return p===void 0?(p={id:l.id,object:l,geometry:c,material:f,groupOrder:g,renderOrder:l.renderOrder,z:_,group:m},s[e]=p):(p.id=l.id,p.object=l,p.geometry=c,p.material=f,p.groupOrder=g,p.renderOrder=l.renderOrder,p.z=_,p.group=m),e++,p}function a(l,c,f,g,_,m){const p=o(l,c,f,g,_,m);f.transmission>0?n.push(p):f.transparent===!0?i.push(p):t.push(p)}function u(l,c,f,g,_,m){const p=o(l,c,f,g,_,m);f.transmission>0?n.unshift(p):f.transparent===!0?i.unshift(p):t.unshift(p)}function d(l,c){t.length>1&&t.sort(l||Mv),n.length>1&&n.sort(c||Ul),i.length>1&&i.sort(c||Ul)}function h(){for(let l=e,c=s.length;l<c;l++){const f=s[l];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:a,unshift:u,finish:h,sort:d}}function Sv(){let s=new WeakMap;function e(n,i){const r=s.get(n);let o;return r===void 0?(o=new Fl,s.set(n,[o])):i>=r.length?(o=new Fl,r.push(o)):o=r[i],o}function t(){s=new WeakMap}return{get:e,dispose:t}}function wv(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new G,color:new Je};break;case"SpotLight":t={position:new G,direction:new G,color:new Je,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new G,color:new Je,distance:0,decay:0};break;case"HemisphereLight":t={direction:new G,skyColor:new Je,groundColor:new Je};break;case"RectAreaLight":t={color:new Je,position:new G,halfWidth:new G,halfHeight:new G};break}return s[e.id]=t,t}}}function Tv(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let Cv=0;function Rv(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function Dv(s){const e=new wv,t=Tv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let d=0;d<9;d++)n.probe.push(new G);const i=new G,r=new wt,o=new wt;function a(d){let h=0,l=0,c=0;for(let x=0;x<9;x++)n.probe[x].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,w=0,E=0,y=0,k=0,v=0,S=0;d.sort(Rv);for(let x=0,b=d.length;x<b;x++){const D=d[x],L=D.color,B=D.intensity,V=D.distance,H=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)h+=L.r*B,l+=L.g*B,c+=L.b*B;else if(D.isLightProbe){for(let N=0;N<9;N++)n.probe[N].addScaledVector(D.sh.coefficients[N],B);S++}else if(D.isDirectionalLight){const N=e.get(D);if(N.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const q=D.shadow,C=t.get(D);C.shadowIntensity=q.intensity,C.shadowBias=q.bias,C.shadowNormalBias=q.normalBias,C.shadowRadius=q.radius,C.shadowMapSize=q.mapSize,n.directionalShadow[f]=C,n.directionalShadowMap[f]=H,n.directionalShadowMatrix[f]=D.shadow.matrix,w++}n.directional[f]=N,f++}else if(D.isSpotLight){const N=e.get(D);N.position.setFromMatrixPosition(D.matrixWorld),N.color.copy(L).multiplyScalar(B),N.distance=V,N.coneCos=Math.cos(D.angle),N.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),N.decay=D.decay,n.spot[_]=N;const q=D.shadow;if(D.map&&(n.spotLightMap[k]=D.map,k++,q.updateMatrices(D),D.castShadow&&v++),n.spotLightMatrix[_]=q.matrix,D.castShadow){const C=t.get(D);C.shadowIntensity=q.intensity,C.shadowBias=q.bias,C.shadowNormalBias=q.normalBias,C.shadowRadius=q.radius,C.shadowMapSize=q.mapSize,n.spotShadow[_]=C,n.spotShadowMap[_]=H,y++}_++}else if(D.isRectAreaLight){const N=e.get(D);N.color.copy(L).multiplyScalar(B),N.halfWidth.set(D.width*.5,0,0),N.halfHeight.set(0,D.height*.5,0),n.rectArea[m]=N,m++}else if(D.isPointLight){const N=e.get(D);if(N.color.copy(D.color).multiplyScalar(D.intensity),N.distance=D.distance,N.decay=D.decay,D.castShadow){const q=D.shadow,C=t.get(D);C.shadowIntensity=q.intensity,C.shadowBias=q.bias,C.shadowNormalBias=q.normalBias,C.shadowRadius=q.radius,C.shadowMapSize=q.mapSize,C.shadowCameraNear=q.camera.near,C.shadowCameraFar=q.camera.far,n.pointShadow[g]=C,n.pointShadowMap[g]=H,n.pointShadowMatrix[g]=D.shadow.matrix,E++}n.point[g]=N,g++}else if(D.isHemisphereLight){const N=e.get(D);N.skyColor.copy(D.color).multiplyScalar(B),N.groundColor.copy(D.groundColor).multiplyScalar(B),n.hemi[p]=N,p++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=xe.LTC_FLOAT_1,n.rectAreaLTC2=xe.LTC_FLOAT_2):(n.rectAreaLTC1=xe.LTC_HALF_1,n.rectAreaLTC2=xe.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=l,n.ambient[2]=c;const R=n.hash;(R.directionalLength!==f||R.pointLength!==g||R.spotLength!==_||R.rectAreaLength!==m||R.hemiLength!==p||R.numDirectionalShadows!==w||R.numPointShadows!==E||R.numSpotShadows!==y||R.numSpotMaps!==k||R.numLightProbes!==S)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.pointShadow.length=E,n.pointShadowMap.length=E,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=w,n.pointShadowMatrix.length=E,n.spotLightMatrix.length=y+k-v,n.spotLightMap.length=k,n.numSpotLightShadowsWithMaps=v,n.numLightProbes=S,R.directionalLength=f,R.pointLength=g,R.spotLength=_,R.rectAreaLength=m,R.hemiLength=p,R.numDirectionalShadows=w,R.numPointShadows=E,R.numSpotShadows=y,R.numSpotMaps=k,R.numLightProbes=S,n.version=Cv++)}function u(d,h){let l=0,c=0,f=0,g=0,_=0;const m=h.matrixWorldInverse;for(let p=0,w=d.length;p<w;p++){const E=d[p];if(E.isDirectionalLight){const y=n.directional[l];y.direction.setFromMatrixPosition(E.matrixWorld),i.setFromMatrixPosition(E.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(m),l++}else if(E.isSpotLight){const y=n.spot[f];y.position.setFromMatrixPosition(E.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(E.matrixWorld),i.setFromMatrixPosition(E.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(m),f++}else if(E.isRectAreaLight){const y=n.rectArea[g];y.position.setFromMatrixPosition(E.matrixWorld),y.position.applyMatrix4(m),o.identity(),r.copy(E.matrixWorld),r.premultiply(m),o.extractRotation(r),y.halfWidth.set(E.width*.5,0,0),y.halfHeight.set(0,E.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),g++}else if(E.isPointLight){const y=n.point[c];y.position.setFromMatrixPosition(E.matrixWorld),y.position.applyMatrix4(m),c++}else if(E.isHemisphereLight){const y=n.hemi[_];y.direction.setFromMatrixPosition(E.matrixWorld),y.direction.transformDirection(m),_++}}}return{setup:a,setupView:u,state:n}}function Nl(s){const e=new Dv(s),t=[],n=[];function i(h){d.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function u(h){e.setupView(t,h)}const d={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:d,setupLights:a,setupLightsView:u,pushLight:r,pushShadow:o}}function Pv(s){let e=new WeakMap;function t(i,r=0){const o=e.get(i);let a;return o===void 0?(a=new Nl(s),e.set(i,[a])):r>=o.length?(a=new Nl(s),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}const kv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Lv=`uniform sampler2D shadow_pass;
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
}`;function Iv(s,e,t){let n=new rd;const i=new Ze,r=new Ze,o=new Et,a=new om({depthPacking:np}),u=new am,d={},h=t.maxTextureSize,l={[Un]:Ot,[Ot]:Un,[Jt]:Jt},c=new yn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ze},radius:{value:4}},vertexShader:kv,fragmentShader:Lv}),f=c.clone();f.defines.HORIZONTAL_PASS=1;const g=new Wt;g.setAttribute("position",new It(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new mt(g,c),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Uc;let p=this.type;this.render=function(v,S,R){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||v.length===0)return;const x=s.getRenderTarget(),b=s.getActiveCubeFace(),D=s.getActiveMipmapLevel(),L=s.state;L.setBlending(Wn),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);const B=p!==Dn&&this.type===Dn,V=p===Dn&&this.type!==Dn;for(let H=0,N=v.length;H<N;H++){const q=v[H],C=q.shadow;if(C===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(C.autoUpdate===!1&&C.needsUpdate===!1)continue;i.copy(C.mapSize);const ee=C.getFrameExtents();if(i.multiply(ee),r.copy(C.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/ee.x),i.x=r.x*ee.x,C.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/ee.y),i.y=r.y*ee.y,C.mapSize.y=r.y)),C.map===null||B===!0||V===!0){const ae=this.type!==Dn?{minFilter:Gt,magFilter:Gt}:{};C.map!==null&&C.map.dispose(),C.map=new di(i.x,i.y,ae),C.map.texture.name=q.name+".shadowMap",C.camera.updateProjectionMatrix()}s.setRenderTarget(C.map),s.clear();const se=C.getViewportCount();for(let ae=0;ae<se;ae++){const Ne=C.getViewport(ae);o.set(r.x*Ne.x,r.y*Ne.y,r.x*Ne.z,r.y*Ne.w),L.viewport(o),C.updateMatrices(q,ae),n=C.getFrustum(),y(S,R,C.camera,q,this.type)}C.isPointLightShadow!==!0&&this.type===Dn&&w(C,R),C.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(x,b,D)};function w(v,S){const R=e.update(_);c.defines.VSM_SAMPLES!==v.blurSamples&&(c.defines.VSM_SAMPLES=v.blurSamples,f.defines.VSM_SAMPLES=v.blurSamples,c.needsUpdate=!0,f.needsUpdate=!0),v.mapPass===null&&(v.mapPass=new di(i.x,i.y)),c.uniforms.shadow_pass.value=v.map.texture,c.uniforms.resolution.value=v.mapSize,c.uniforms.radius.value=v.radius,s.setRenderTarget(v.mapPass),s.clear(),s.renderBufferDirect(S,null,R,c,_,null),f.uniforms.shadow_pass.value=v.mapPass.texture,f.uniforms.resolution.value=v.mapSize,f.uniforms.radius.value=v.radius,s.setRenderTarget(v.map),s.clear(),s.renderBufferDirect(S,null,R,f,_,null)}function E(v,S,R,x){let b=null;const D=R.isPointLight===!0?v.customDistanceMaterial:v.customDepthMaterial;if(D!==void 0)b=D;else if(b=R.isPointLight===!0?u:a,s.localClippingEnabled&&S.clipShadows===!0&&Array.isArray(S.clippingPlanes)&&S.clippingPlanes.length!==0||S.displacementMap&&S.displacementScale!==0||S.alphaMap&&S.alphaTest>0||S.map&&S.alphaTest>0||S.alphaToCoverage===!0){const L=b.uuid,B=S.uuid;let V=d[L];V===void 0&&(V={},d[L]=V);let H=V[B];H===void 0&&(H=b.clone(),V[B]=H,S.addEventListener("dispose",k)),b=H}if(b.visible=S.visible,b.wireframe=S.wireframe,x===Dn?b.side=S.shadowSide!==null?S.shadowSide:S.side:b.side=S.shadowSide!==null?S.shadowSide:l[S.side],b.alphaMap=S.alphaMap,b.alphaTest=S.alphaToCoverage===!0?.5:S.alphaTest,b.map=S.map,b.clipShadows=S.clipShadows,b.clippingPlanes=S.clippingPlanes,b.clipIntersection=S.clipIntersection,b.displacementMap=S.displacementMap,b.displacementScale=S.displacementScale,b.displacementBias=S.displacementBias,b.wireframeLinewidth=S.wireframeLinewidth,b.linewidth=S.linewidth,R.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const L=s.properties.get(b);L.light=R}return b}function y(v,S,R,x,b){if(v.visible===!1)return;if(v.layers.test(S.layers)&&(v.isMesh||v.isLine||v.isPoints)&&(v.castShadow||v.receiveShadow&&b===Dn)&&(!v.frustumCulled||n.intersectsObject(v))){v.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,v.matrixWorld);const B=e.update(v),V=v.material;if(Array.isArray(V)){const H=B.groups;for(let N=0,q=H.length;N<q;N++){const C=H[N],ee=V[C.materialIndex];if(ee&&ee.visible){const se=E(v,ee,x,b);v.onBeforeShadow(s,v,S,R,B,se,C),s.renderBufferDirect(R,null,B,se,v,C),v.onAfterShadow(s,v,S,R,B,se,C)}}}else if(V.visible){const H=E(v,V,x,b);v.onBeforeShadow(s,v,S,R,B,H,null),s.renderBufferDirect(R,null,B,H,v,null),v.onAfterShadow(s,v,S,R,B,H,null)}}const L=v.children;for(let B=0,V=L.length;B<V;B++)y(L[B],S,R,x,b)}function k(v){v.target.removeEventListener("dispose",k);for(const R in d){const x=d[R],b=v.target.uuid;b in x&&(x[b].dispose(),delete x[b])}}}const Uv={[wo]:To,[Co]:Po,[Ro]:ko,[Gi]:Do,[To]:wo,[Po]:Co,[ko]:Ro,[Do]:Gi};function Fv(s,e){function t(){let U=!1;const le=new Et;let ue=null;const Se=new Et(0,0,0,0);return{setMask:function(oe){ue!==oe&&!U&&(s.colorMask(oe,oe,oe,oe),ue=oe)},setLocked:function(oe){U=oe},setClear:function(oe,$,Re,He,lt){lt===!0&&(oe*=He,$*=He,Re*=He),le.set(oe,$,Re,He),Se.equals(le)===!1&&(s.clearColor(oe,$,Re,He),Se.copy(le))},reset:function(){U=!1,ue=null,Se.set(-1,0,0,0)}}}function n(){let U=!1,le=!1,ue=null,Se=null,oe=null;return{setReversed:function($){if(le!==$){const Re=e.get("EXT_clip_control");$?Re.clipControlEXT(Re.LOWER_LEFT_EXT,Re.ZERO_TO_ONE_EXT):Re.clipControlEXT(Re.LOWER_LEFT_EXT,Re.NEGATIVE_ONE_TO_ONE_EXT),le=$;const He=oe;oe=null,this.setClear(He)}},getReversed:function(){return le},setTest:function($){$?Z(s.DEPTH_TEST):re(s.DEPTH_TEST)},setMask:function($){ue!==$&&!U&&(s.depthMask($),ue=$)},setFunc:function($){if(le&&($=Uv[$]),Se!==$){switch($){case wo:s.depthFunc(s.NEVER);break;case To:s.depthFunc(s.ALWAYS);break;case Co:s.depthFunc(s.LESS);break;case Gi:s.depthFunc(s.LEQUAL);break;case Ro:s.depthFunc(s.EQUAL);break;case Do:s.depthFunc(s.GEQUAL);break;case Po:s.depthFunc(s.GREATER);break;case ko:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}Se=$}},setLocked:function($){U=$},setClear:function($){oe!==$&&(le&&($=1-$),s.clearDepth($),oe=$)},reset:function(){U=!1,ue=null,Se=null,oe=null,le=!1}}}function i(){let U=!1,le=null,ue=null,Se=null,oe=null,$=null,Re=null,He=null,lt=null;return{setTest:function(tt){U||(tt?Z(s.STENCIL_TEST):re(s.STENCIL_TEST))},setMask:function(tt){le!==tt&&!U&&(s.stencilMask(tt),le=tt)},setFunc:function(tt,$t,Xt){(ue!==tt||Se!==$t||oe!==Xt)&&(s.stencilFunc(tt,$t,Xt),ue=tt,Se=$t,oe=Xt)},setOp:function(tt,$t,Xt){($!==tt||Re!==$t||He!==Xt)&&(s.stencilOp(tt,$t,Xt),$=tt,Re=$t,He=Xt)},setLocked:function(tt){U=tt},setClear:function(tt){lt!==tt&&(s.clearStencil(tt),lt=tt)},reset:function(){U=!1,le=null,ue=null,Se=null,oe=null,$=null,Re=null,He=null,lt=null}}}const r=new t,o=new n,a=new i,u=new WeakMap,d=new WeakMap;let h={},l={},c=new WeakMap,f=[],g=null,_=!1,m=null,p=null,w=null,E=null,y=null,k=null,v=null,S=new Je(0,0,0),R=0,x=!1,b=null,D=null,L=null,B=null,V=null;const H=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let N=!1,q=0;const C=s.getParameter(s.VERSION);C.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(C)[1]),N=q>=1):C.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(C)[1]),N=q>=2);let ee=null,se={};const ae=s.getParameter(s.SCISSOR_BOX),Ne=s.getParameter(s.VIEWPORT),be=new Et().fromArray(ae),j=new Et().fromArray(Ne);function Ee(U,le,ue,Se){const oe=new Uint8Array(4),$=s.createTexture();s.bindTexture(U,$),s.texParameteri(U,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(U,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Re=0;Re<ue;Re++)U===s.TEXTURE_3D||U===s.TEXTURE_2D_ARRAY?s.texImage3D(le,0,s.RGBA,1,1,Se,0,s.RGBA,s.UNSIGNED_BYTE,oe):s.texImage2D(le+Re,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,oe);return $}const Y={};Y[s.TEXTURE_2D]=Ee(s.TEXTURE_2D,s.TEXTURE_2D,1),Y[s.TEXTURE_CUBE_MAP]=Ee(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[s.TEXTURE_2D_ARRAY]=Ee(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Y[s.TEXTURE_3D]=Ee(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),Z(s.DEPTH_TEST),o.setFunc(Gi),Pe(!1),_e(Ha),Z(s.CULL_FACE),Qe(Wn);function Z(U){h[U]!==!0&&(s.enable(U),h[U]=!0)}function re(U){h[U]!==!1&&(s.disable(U),h[U]=!1)}function pe(U,le){return l[U]!==le?(s.bindFramebuffer(U,le),l[U]=le,U===s.DRAW_FRAMEBUFFER&&(l[s.FRAMEBUFFER]=le),U===s.FRAMEBUFFER&&(l[s.DRAW_FRAMEBUFFER]=le),!0):!1}function ne(U,le){let ue=f,Se=!1;if(U){ue=c.get(le),ue===void 0&&(ue=[],c.set(le,ue));const oe=U.textures;if(ue.length!==oe.length||ue[0]!==s.COLOR_ATTACHMENT0){for(let $=0,Re=oe.length;$<Re;$++)ue[$]=s.COLOR_ATTACHMENT0+$;ue.length=oe.length,Se=!0}}else ue[0]!==s.BACK&&(ue[0]=s.BACK,Se=!0);Se&&s.drawBuffers(ue)}function ye(U){return g!==U?(s.useProgram(U),g=U,!0):!1}const et={[ri]:s.FUNC_ADD,[Cf]:s.FUNC_SUBTRACT,[Rf]:s.FUNC_REVERSE_SUBTRACT};et[Df]=s.MIN,et[Pf]=s.MAX;const I={[kf]:s.ZERO,[Lf]:s.ONE,[If]:s.SRC_COLOR,[Mo]:s.SRC_ALPHA,[zf]:s.SRC_ALPHA_SATURATE,[Bf]:s.DST_COLOR,[Ff]:s.DST_ALPHA,[Uf]:s.ONE_MINUS_SRC_COLOR,[So]:s.ONE_MINUS_SRC_ALPHA,[Of]:s.ONE_MINUS_DST_COLOR,[Nf]:s.ONE_MINUS_DST_ALPHA,[Vf]:s.CONSTANT_COLOR,[Gf]:s.ONE_MINUS_CONSTANT_COLOR,[Hf]:s.CONSTANT_ALPHA,[Wf]:s.ONE_MINUS_CONSTANT_ALPHA};function Qe(U,le,ue,Se,oe,$,Re,He,lt,tt){if(U===Wn){_===!0&&(re(s.BLEND),_=!1);return}if(_===!1&&(Z(s.BLEND),_=!0),U!==Tf){if(U!==m||tt!==x){if((p!==ri||y!==ri)&&(s.blendEquation(s.FUNC_ADD),p=ri,y=ri),tt)switch(U){case Oi:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Vi:s.blendFunc(s.ONE,s.ONE);break;case Wa:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Xa:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case Oi:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Vi:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case Wa:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Xa:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}w=null,E=null,k=null,v=null,S.set(0,0,0),R=0,m=U,x=tt}return}oe=oe||le,$=$||ue,Re=Re||Se,(le!==p||oe!==y)&&(s.blendEquationSeparate(et[le],et[oe]),p=le,y=oe),(ue!==w||Se!==E||$!==k||Re!==v)&&(s.blendFuncSeparate(I[ue],I[Se],I[$],I[Re]),w=ue,E=Se,k=$,v=Re),(He.equals(S)===!1||lt!==R)&&(s.blendColor(He.r,He.g,He.b,lt),S.copy(He),R=lt),m=U,x=!1}function Xe(U,le){U.side===Jt?re(s.CULL_FACE):Z(s.CULL_FACE);let ue=U.side===Ot;le&&(ue=!ue),Pe(ue),U.blending===Oi&&U.transparent===!1?Qe(Wn):Qe(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),r.setMask(U.colorWrite);const Se=U.stencilWrite;a.setTest(Se),Se&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),Ce(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?Z(s.SAMPLE_ALPHA_TO_COVERAGE):re(s.SAMPLE_ALPHA_TO_COVERAGE)}function Pe(U){b!==U&&(U?s.frontFace(s.CW):s.frontFace(s.CCW),b=U)}function _e(U){U!==Mf?(Z(s.CULL_FACE),U!==D&&(U===Ha?s.cullFace(s.BACK):U===Sf?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):re(s.CULL_FACE),D=U}function We(U){U!==L&&(N&&s.lineWidth(U),L=U)}function Ce(U,le,ue){U?(Z(s.POLYGON_OFFSET_FILL),(B!==le||V!==ue)&&(s.polygonOffset(le,ue),B=le,V=ue)):re(s.POLYGON_OFFSET_FILL)}function Oe(U){U?Z(s.SCISSOR_TEST):re(s.SCISSOR_TEST)}function vt(U){U===void 0&&(U=s.TEXTURE0+H-1),ee!==U&&(s.activeTexture(U),ee=U)}function _t(U,le,ue){ue===void 0&&(ee===null?ue=s.TEXTURE0+H-1:ue=ee);let Se=se[ue];Se===void 0&&(Se={type:void 0,texture:void 0},se[ue]=Se),(Se.type!==U||Se.texture!==le)&&(ee!==ue&&(s.activeTexture(ue),ee=ue),s.bindTexture(U,le||Y[U]),Se.type=U,Se.texture=le)}function P(){const U=se[ee];U!==void 0&&U.type!==void 0&&(s.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function A(){try{s.compressedTexImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function W(){try{s.compressedTexImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function J(){try{s.texSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ie(){try{s.texSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Q(){try{s.compressedTexSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ke(){try{s.compressedTexSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function he(){try{s.texStorage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function De(){try{s.texStorage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Le(){try{s.texImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function de(){try{s.texImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function me(U){be.equals(U)===!1&&(s.scissor(U.x,U.y,U.z,U.w),be.copy(U))}function ze(U){j.equals(U)===!1&&(s.viewport(U.x,U.y,U.z,U.w),j.copy(U))}function we(U,le){let ue=d.get(le);ue===void 0&&(ue=new WeakMap,d.set(le,ue));let Se=ue.get(U);Se===void 0&&(Se=s.getUniformBlockIndex(le,U.name),ue.set(U,Se))}function ve(U,le){const Se=d.get(le).get(U);u.get(le)!==Se&&(s.uniformBlockBinding(le,Se,U.__bindingPointIndex),u.set(le,Se))}function Ve(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),h={},ee=null,se={},l={},c=new WeakMap,f=[],g=null,_=!1,m=null,p=null,w=null,E=null,y=null,k=null,v=null,S=new Je(0,0,0),R=0,x=!1,b=null,D=null,L=null,B=null,V=null,be.set(0,0,s.canvas.width,s.canvas.height),j.set(0,0,s.canvas.width,s.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:Z,disable:re,bindFramebuffer:pe,drawBuffers:ne,useProgram:ye,setBlending:Qe,setMaterial:Xe,setFlipSided:Pe,setCullFace:_e,setLineWidth:We,setPolygonOffset:Ce,setScissorTest:Oe,activeTexture:vt,bindTexture:_t,unbindTexture:P,compressedTexImage2D:A,compressedTexImage3D:W,texImage2D:Le,texImage3D:de,updateUBOMapping:we,uniformBlockBinding:ve,texStorage2D:he,texStorage3D:De,texSubImage2D:J,texSubImage3D:ie,compressedTexSubImage2D:Q,compressedTexSubImage3D:ke,scissor:me,viewport:ze,reset:Ve}}function Nv(s,e,t,n,i,r,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,u=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),d=new Ze,h=new WeakMap;let l;const c=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(P,A){return f?new OffscreenCanvas(P,A):Mr("canvas")}function _(P,A,W){let J=1;const ie=_t(P);if((ie.width>W||ie.height>W)&&(J=W/Math.max(ie.width,ie.height)),J<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const Q=Math.floor(J*ie.width),ke=Math.floor(J*ie.height);l===void 0&&(l=g(Q,ke));const he=A?g(Q,ke):l;return he.width=Q,he.height=ke,he.getContext("2d").drawImage(P,0,0,Q,ke),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ie.width+"x"+ie.height+") to ("+Q+"x"+ke+")."),he}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ie.width+"x"+ie.height+")."),P;return P}function m(P){return P.generateMipmaps}function p(P){s.generateMipmap(P)}function w(P){return P.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?s.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function E(P,A,W,J,ie=!1){if(P!==null){if(s[P]!==void 0)return s[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let Q=A;if(A===s.RED&&(W===s.FLOAT&&(Q=s.R32F),W===s.HALF_FLOAT&&(Q=s.R16F),W===s.UNSIGNED_BYTE&&(Q=s.R8)),A===s.RED_INTEGER&&(W===s.UNSIGNED_BYTE&&(Q=s.R8UI),W===s.UNSIGNED_SHORT&&(Q=s.R16UI),W===s.UNSIGNED_INT&&(Q=s.R32UI),W===s.BYTE&&(Q=s.R8I),W===s.SHORT&&(Q=s.R16I),W===s.INT&&(Q=s.R32I)),A===s.RG&&(W===s.FLOAT&&(Q=s.RG32F),W===s.HALF_FLOAT&&(Q=s.RG16F),W===s.UNSIGNED_BYTE&&(Q=s.RG8)),A===s.RG_INTEGER&&(W===s.UNSIGNED_BYTE&&(Q=s.RG8UI),W===s.UNSIGNED_SHORT&&(Q=s.RG16UI),W===s.UNSIGNED_INT&&(Q=s.RG32UI),W===s.BYTE&&(Q=s.RG8I),W===s.SHORT&&(Q=s.RG16I),W===s.INT&&(Q=s.RG32I)),A===s.RGB_INTEGER&&(W===s.UNSIGNED_BYTE&&(Q=s.RGB8UI),W===s.UNSIGNED_SHORT&&(Q=s.RGB16UI),W===s.UNSIGNED_INT&&(Q=s.RGB32UI),W===s.BYTE&&(Q=s.RGB8I),W===s.SHORT&&(Q=s.RGB16I),W===s.INT&&(Q=s.RGB32I)),A===s.RGBA_INTEGER&&(W===s.UNSIGNED_BYTE&&(Q=s.RGBA8UI),W===s.UNSIGNED_SHORT&&(Q=s.RGBA16UI),W===s.UNSIGNED_INT&&(Q=s.RGBA32UI),W===s.BYTE&&(Q=s.RGBA8I),W===s.SHORT&&(Q=s.RGBA16I),W===s.INT&&(Q=s.RGBA32I)),A===s.RGB&&(W===s.UNSIGNED_INT_5_9_9_9_REV&&(Q=s.RGB9_E5),W===s.UNSIGNED_INT_10F_11F_11F_REV&&(Q=s.R11F_G11F_B10F)),A===s.RGBA){const ke=ie?br:rt.getTransfer(J);W===s.FLOAT&&(Q=s.RGBA32F),W===s.HALF_FLOAT&&(Q=s.RGBA16F),W===s.UNSIGNED_BYTE&&(Q=ke===ft?s.SRGB8_ALPHA8:s.RGBA8),W===s.UNSIGNED_SHORT_4_4_4_4&&(Q=s.RGBA4),W===s.UNSIGNED_SHORT_5_5_5_1&&(Q=s.RGB5_A1)}return(Q===s.R16F||Q===s.R32F||Q===s.RG16F||Q===s.RG32F||Q===s.RGBA16F||Q===s.RGBA32F)&&e.get("EXT_color_buffer_float"),Q}function y(P,A){let W;return P?A===null||A===ci||A===As?W=s.DEPTH24_STENCIL8:A===kn?W=s.DEPTH32F_STENCIL8:A===vs&&(W=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===ci||A===As?W=s.DEPTH_COMPONENT24:A===kn?W=s.DEPTH_COMPONENT32F:A===vs&&(W=s.DEPTH_COMPONENT16),W}function k(P,A){return m(P)===!0||P.isFramebufferTexture&&P.minFilter!==Gt&&P.minFilter!==fn?Math.log2(Math.max(A.width,A.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?A.mipmaps.length:1}function v(P){const A=P.target;A.removeEventListener("dispose",v),R(A),A.isVideoTexture&&h.delete(A)}function S(P){const A=P.target;A.removeEventListener("dispose",S),b(A)}function R(P){const A=n.get(P);if(A.__webglInit===void 0)return;const W=P.source,J=c.get(W);if(J){const ie=J[A.__cacheKey];ie.usedTimes--,ie.usedTimes===0&&x(P),Object.keys(J).length===0&&c.delete(W)}n.remove(P)}function x(P){const A=n.get(P);s.deleteTexture(A.__webglTexture);const W=P.source,J=c.get(W);delete J[A.__cacheKey],o.memory.textures--}function b(P){const A=n.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),n.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(A.__webglFramebuffer[J]))for(let ie=0;ie<A.__webglFramebuffer[J].length;ie++)s.deleteFramebuffer(A.__webglFramebuffer[J][ie]);else s.deleteFramebuffer(A.__webglFramebuffer[J]);A.__webglDepthbuffer&&s.deleteRenderbuffer(A.__webglDepthbuffer[J])}else{if(Array.isArray(A.__webglFramebuffer))for(let J=0;J<A.__webglFramebuffer.length;J++)s.deleteFramebuffer(A.__webglFramebuffer[J]);else s.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&s.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&s.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let J=0;J<A.__webglColorRenderbuffer.length;J++)A.__webglColorRenderbuffer[J]&&s.deleteRenderbuffer(A.__webglColorRenderbuffer[J]);A.__webglDepthRenderbuffer&&s.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const W=P.textures;for(let J=0,ie=W.length;J<ie;J++){const Q=n.get(W[J]);Q.__webglTexture&&(s.deleteTexture(Q.__webglTexture),o.memory.textures--),n.remove(W[J])}n.remove(P)}let D=0;function L(){D=0}function B(){const P=D;return P>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+i.maxTextures),D+=1,P}function V(P){const A=[];return A.push(P.wrapS),A.push(P.wrapT),A.push(P.wrapR||0),A.push(P.magFilter),A.push(P.minFilter),A.push(P.anisotropy),A.push(P.internalFormat),A.push(P.format),A.push(P.type),A.push(P.generateMipmaps),A.push(P.premultiplyAlpha),A.push(P.flipY),A.push(P.unpackAlignment),A.push(P.colorSpace),A.join()}function H(P,A){const W=n.get(P);if(P.isVideoTexture&&Oe(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&W.__version!==P.version){const J=P.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(W,P,A);return}}else P.isExternalTexture&&(W.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,W.__webglTexture,s.TEXTURE0+A)}function N(P,A){const W=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&W.__version!==P.version){Y(W,P,A);return}t.bindTexture(s.TEXTURE_2D_ARRAY,W.__webglTexture,s.TEXTURE0+A)}function q(P,A){const W=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&W.__version!==P.version){Y(W,P,A);return}t.bindTexture(s.TEXTURE_3D,W.__webglTexture,s.TEXTURE0+A)}function C(P,A){const W=n.get(P);if(P.version>0&&W.__version!==P.version){Z(W,P,A);return}t.bindTexture(s.TEXTURE_CUBE_MAP,W.__webglTexture,s.TEXTURE0+A)}const ee={[_s]:s.REPEAT,[ai]:s.CLAMP_TO_EDGE,[Uo]:s.MIRRORED_REPEAT},se={[Gt]:s.NEAREST,[ep]:s.NEAREST_MIPMAP_NEAREST,[ds]:s.NEAREST_MIPMAP_LINEAR,[fn]:s.LINEAR,[Or]:s.LINEAR_MIPMAP_NEAREST,[li]:s.LINEAR_MIPMAP_LINEAR},ae={[rp]:s.NEVER,[hp]:s.ALWAYS,[op]:s.LESS,[Yc]:s.LEQUAL,[ap]:s.EQUAL,[dp]:s.GEQUAL,[lp]:s.GREATER,[cp]:s.NOTEQUAL};function Ne(P,A){if(A.type===kn&&e.has("OES_texture_float_linear")===!1&&(A.magFilter===fn||A.magFilter===Or||A.magFilter===ds||A.magFilter===li||A.minFilter===fn||A.minFilter===Or||A.minFilter===ds||A.minFilter===li)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(P,s.TEXTURE_WRAP_S,ee[A.wrapS]),s.texParameteri(P,s.TEXTURE_WRAP_T,ee[A.wrapT]),(P===s.TEXTURE_3D||P===s.TEXTURE_2D_ARRAY)&&s.texParameteri(P,s.TEXTURE_WRAP_R,ee[A.wrapR]),s.texParameteri(P,s.TEXTURE_MAG_FILTER,se[A.magFilter]),s.texParameteri(P,s.TEXTURE_MIN_FILTER,se[A.minFilter]),A.compareFunction&&(s.texParameteri(P,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(P,s.TEXTURE_COMPARE_FUNC,ae[A.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===Gt||A.minFilter!==ds&&A.minFilter!==li||A.type===kn&&e.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||n.get(A).__currentAnisotropy){const W=e.get("EXT_texture_filter_anisotropic");s.texParameterf(P,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,i.getMaxAnisotropy())),n.get(A).__currentAnisotropy=A.anisotropy}}}function be(P,A){let W=!1;P.__webglInit===void 0&&(P.__webglInit=!0,A.addEventListener("dispose",v));const J=A.source;let ie=c.get(J);ie===void 0&&(ie={},c.set(J,ie));const Q=V(A);if(Q!==P.__cacheKey){ie[Q]===void 0&&(ie[Q]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,W=!0),ie[Q].usedTimes++;const ke=ie[P.__cacheKey];ke!==void 0&&(ie[P.__cacheKey].usedTimes--,ke.usedTimes===0&&x(A)),P.__cacheKey=Q,P.__webglTexture=ie[Q].texture}return W}function j(P,A,W){return Math.floor(Math.floor(P/W)/A)}function Ee(P,A,W,J){const Q=P.updateRanges;if(Q.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,A.width,A.height,W,J,A.data);else{Q.sort((de,me)=>de.start-me.start);let ke=0;for(let de=1;de<Q.length;de++){const me=Q[ke],ze=Q[de],we=me.start+me.count,ve=j(ze.start,A.width,4),Ve=j(me.start,A.width,4);ze.start<=we+1&&ve===Ve&&j(ze.start+ze.count-1,A.width,4)===ve?me.count=Math.max(me.count,ze.start+ze.count-me.start):(++ke,Q[ke]=ze)}Q.length=ke+1;const he=s.getParameter(s.UNPACK_ROW_LENGTH),De=s.getParameter(s.UNPACK_SKIP_PIXELS),Le=s.getParameter(s.UNPACK_SKIP_ROWS);s.pixelStorei(s.UNPACK_ROW_LENGTH,A.width);for(let de=0,me=Q.length;de<me;de++){const ze=Q[de],we=Math.floor(ze.start/4),ve=Math.ceil(ze.count/4),Ve=we%A.width,U=Math.floor(we/A.width),le=ve,ue=1;s.pixelStorei(s.UNPACK_SKIP_PIXELS,Ve),s.pixelStorei(s.UNPACK_SKIP_ROWS,U),t.texSubImage2D(s.TEXTURE_2D,0,Ve,U,le,ue,W,J,A.data)}P.clearUpdateRanges(),s.pixelStorei(s.UNPACK_ROW_LENGTH,he),s.pixelStorei(s.UNPACK_SKIP_PIXELS,De),s.pixelStorei(s.UNPACK_SKIP_ROWS,Le)}}function Y(P,A,W){let J=s.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(J=s.TEXTURE_2D_ARRAY),A.isData3DTexture&&(J=s.TEXTURE_3D);const ie=be(P,A),Q=A.source;t.bindTexture(J,P.__webglTexture,s.TEXTURE0+W);const ke=n.get(Q);if(Q.version!==ke.__version||ie===!0){t.activeTexture(s.TEXTURE0+W);const he=rt.getPrimaries(rt.workingColorSpace),De=A.colorSpace===Pn?null:rt.getPrimaries(A.colorSpace),Le=A.colorSpace===Pn||he===De?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,A.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,A.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Le);let de=_(A.image,!1,i.maxTextureSize);de=vt(A,de);const me=r.convert(A.format,A.colorSpace),ze=r.convert(A.type);let we=E(A.internalFormat,me,ze,A.colorSpace,A.isVideoTexture);Ne(J,A);let ve;const Ve=A.mipmaps,U=A.isVideoTexture!==!0,le=ke.__version===void 0||ie===!0,ue=Q.dataReady,Se=k(A,de);if(A.isDepthTexture)we=y(A.format===bs,A.type),le&&(U?t.texStorage2D(s.TEXTURE_2D,1,we,de.width,de.height):t.texImage2D(s.TEXTURE_2D,0,we,de.width,de.height,0,me,ze,null));else if(A.isDataTexture)if(Ve.length>0){U&&le&&t.texStorage2D(s.TEXTURE_2D,Se,we,Ve[0].width,Ve[0].height);for(let oe=0,$=Ve.length;oe<$;oe++)ve=Ve[oe],U?ue&&t.texSubImage2D(s.TEXTURE_2D,oe,0,0,ve.width,ve.height,me,ze,ve.data):t.texImage2D(s.TEXTURE_2D,oe,we,ve.width,ve.height,0,me,ze,ve.data);A.generateMipmaps=!1}else U?(le&&t.texStorage2D(s.TEXTURE_2D,Se,we,de.width,de.height),ue&&Ee(A,de,me,ze)):t.texImage2D(s.TEXTURE_2D,0,we,de.width,de.height,0,me,ze,de.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){U&&le&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Se,we,Ve[0].width,Ve[0].height,de.depth);for(let oe=0,$=Ve.length;oe<$;oe++)if(ve=Ve[oe],A.format!==on)if(me!==null)if(U){if(ue)if(A.layerUpdates.size>0){const Re=fl(ve.width,ve.height,A.format,A.type);for(const He of A.layerUpdates){const lt=ve.data.subarray(He*Re/ve.data.BYTES_PER_ELEMENT,(He+1)*Re/ve.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,oe,0,0,He,ve.width,ve.height,1,me,lt)}A.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,oe,0,0,0,ve.width,ve.height,de.depth,me,ve.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,oe,we,ve.width,ve.height,de.depth,0,ve.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else U?ue&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,oe,0,0,0,ve.width,ve.height,de.depth,me,ze,ve.data):t.texImage3D(s.TEXTURE_2D_ARRAY,oe,we,ve.width,ve.height,de.depth,0,me,ze,ve.data)}else{U&&le&&t.texStorage2D(s.TEXTURE_2D,Se,we,Ve[0].width,Ve[0].height);for(let oe=0,$=Ve.length;oe<$;oe++)ve=Ve[oe],A.format!==on?me!==null?U?ue&&t.compressedTexSubImage2D(s.TEXTURE_2D,oe,0,0,ve.width,ve.height,me,ve.data):t.compressedTexImage2D(s.TEXTURE_2D,oe,we,ve.width,ve.height,0,ve.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):U?ue&&t.texSubImage2D(s.TEXTURE_2D,oe,0,0,ve.width,ve.height,me,ze,ve.data):t.texImage2D(s.TEXTURE_2D,oe,we,ve.width,ve.height,0,me,ze,ve.data)}else if(A.isDataArrayTexture)if(U){if(le&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Se,we,de.width,de.height,de.depth),ue)if(A.layerUpdates.size>0){const oe=fl(de.width,de.height,A.format,A.type);for(const $ of A.layerUpdates){const Re=de.data.subarray($*oe/de.data.BYTES_PER_ELEMENT,($+1)*oe/de.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,$,de.width,de.height,1,me,ze,Re)}A.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,de.width,de.height,de.depth,me,ze,de.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,we,de.width,de.height,de.depth,0,me,ze,de.data);else if(A.isData3DTexture)U?(le&&t.texStorage3D(s.TEXTURE_3D,Se,we,de.width,de.height,de.depth),ue&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,de.width,de.height,de.depth,me,ze,de.data)):t.texImage3D(s.TEXTURE_3D,0,we,de.width,de.height,de.depth,0,me,ze,de.data);else if(A.isFramebufferTexture){if(le)if(U)t.texStorage2D(s.TEXTURE_2D,Se,we,de.width,de.height);else{let oe=de.width,$=de.height;for(let Re=0;Re<Se;Re++)t.texImage2D(s.TEXTURE_2D,Re,we,oe,$,0,me,ze,null),oe>>=1,$>>=1}}else if(Ve.length>0){if(U&&le){const oe=_t(Ve[0]);t.texStorage2D(s.TEXTURE_2D,Se,we,oe.width,oe.height)}for(let oe=0,$=Ve.length;oe<$;oe++)ve=Ve[oe],U?ue&&t.texSubImage2D(s.TEXTURE_2D,oe,0,0,me,ze,ve):t.texImage2D(s.TEXTURE_2D,oe,we,me,ze,ve);A.generateMipmaps=!1}else if(U){if(le){const oe=_t(de);t.texStorage2D(s.TEXTURE_2D,Se,we,oe.width,oe.height)}ue&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,me,ze,de)}else t.texImage2D(s.TEXTURE_2D,0,we,me,ze,de);m(A)&&p(J),ke.__version=Q.version,A.onUpdate&&A.onUpdate(A)}P.__version=A.version}function Z(P,A,W){if(A.image.length!==6)return;const J=be(P,A),ie=A.source;t.bindTexture(s.TEXTURE_CUBE_MAP,P.__webglTexture,s.TEXTURE0+W);const Q=n.get(ie);if(ie.version!==Q.__version||J===!0){t.activeTexture(s.TEXTURE0+W);const ke=rt.getPrimaries(rt.workingColorSpace),he=A.colorSpace===Pn?null:rt.getPrimaries(A.colorSpace),De=A.colorSpace===Pn||ke===he?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,A.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,A.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,De);const Le=A.isCompressedTexture||A.image[0].isCompressedTexture,de=A.image[0]&&A.image[0].isDataTexture,me=[];for(let $=0;$<6;$++)!Le&&!de?me[$]=_(A.image[$],!0,i.maxCubemapSize):me[$]=de?A.image[$].image:A.image[$],me[$]=vt(A,me[$]);const ze=me[0],we=r.convert(A.format,A.colorSpace),ve=r.convert(A.type),Ve=E(A.internalFormat,we,ve,A.colorSpace),U=A.isVideoTexture!==!0,le=Q.__version===void 0||J===!0,ue=ie.dataReady;let Se=k(A,ze);Ne(s.TEXTURE_CUBE_MAP,A);let oe;if(Le){U&&le&&t.texStorage2D(s.TEXTURE_CUBE_MAP,Se,Ve,ze.width,ze.height);for(let $=0;$<6;$++){oe=me[$].mipmaps;for(let Re=0;Re<oe.length;Re++){const He=oe[Re];A.format!==on?we!==null?U?ue&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,Re,0,0,He.width,He.height,we,He.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,Re,Ve,He.width,He.height,0,He.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?ue&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,Re,0,0,He.width,He.height,we,ve,He.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,Re,Ve,He.width,He.height,0,we,ve,He.data)}}}else{if(oe=A.mipmaps,U&&le){oe.length>0&&Se++;const $=_t(me[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,Se,Ve,$.width,$.height)}for(let $=0;$<6;$++)if(de){U?ue&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,me[$].width,me[$].height,we,ve,me[$].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Ve,me[$].width,me[$].height,0,we,ve,me[$].data);for(let Re=0;Re<oe.length;Re++){const lt=oe[Re].image[$].image;U?ue&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,Re+1,0,0,lt.width,lt.height,we,ve,lt.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,Re+1,Ve,lt.width,lt.height,0,we,ve,lt.data)}}else{U?ue&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,we,ve,me[$]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Ve,we,ve,me[$]);for(let Re=0;Re<oe.length;Re++){const He=oe[Re];U?ue&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,Re+1,0,0,we,ve,He.image[$]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+$,Re+1,Ve,we,ve,He.image[$])}}}m(A)&&p(s.TEXTURE_CUBE_MAP),Q.__version=ie.version,A.onUpdate&&A.onUpdate(A)}P.__version=A.version}function re(P,A,W,J,ie,Q){const ke=r.convert(W.format,W.colorSpace),he=r.convert(W.type),De=E(W.internalFormat,ke,he,W.colorSpace),Le=n.get(A),de=n.get(W);if(de.__renderTarget=A,!Le.__hasExternalTextures){const me=Math.max(1,A.width>>Q),ze=Math.max(1,A.height>>Q);ie===s.TEXTURE_3D||ie===s.TEXTURE_2D_ARRAY?t.texImage3D(ie,Q,De,me,ze,A.depth,0,ke,he,null):t.texImage2D(ie,Q,De,me,ze,0,ke,he,null)}t.bindFramebuffer(s.FRAMEBUFFER,P),Ce(A)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,J,ie,de.__webglTexture,0,We(A)):(ie===s.TEXTURE_2D||ie>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&ie<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,J,ie,de.__webglTexture,Q),t.bindFramebuffer(s.FRAMEBUFFER,null)}function pe(P,A,W){if(s.bindRenderbuffer(s.RENDERBUFFER,P),A.depthBuffer){const J=A.depthTexture,ie=J&&J.isDepthTexture?J.type:null,Q=y(A.stencilBuffer,ie),ke=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,he=We(A);Ce(A)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,he,Q,A.width,A.height):W?s.renderbufferStorageMultisample(s.RENDERBUFFER,he,Q,A.width,A.height):s.renderbufferStorage(s.RENDERBUFFER,Q,A.width,A.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,ke,s.RENDERBUFFER,P)}else{const J=A.textures;for(let ie=0;ie<J.length;ie++){const Q=J[ie],ke=r.convert(Q.format,Q.colorSpace),he=r.convert(Q.type),De=E(Q.internalFormat,ke,he,Q.colorSpace),Le=We(A);W&&Ce(A)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Le,De,A.width,A.height):Ce(A)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Le,De,A.width,A.height):s.renderbufferStorage(s.RENDERBUFFER,De,A.width,A.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function ne(P,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,P),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const J=n.get(A.depthTexture);J.__renderTarget=A,(!J.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),H(A.depthTexture,0);const ie=J.__webglTexture,Q=We(A);if(A.depthTexture.format===xs)Ce(A)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ie,0,Q):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ie,0);else if(A.depthTexture.format===bs)Ce(A)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ie,0,Q):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ie,0);else throw new Error("Unknown depthTexture format")}function ye(P){const A=n.get(P),W=P.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==P.depthTexture){const J=P.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),J){const ie=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,J.removeEventListener("dispose",ie)};J.addEventListener("dispose",ie),A.__depthDisposeCallback=ie}A.__boundDepthTexture=J}if(P.depthTexture&&!A.__autoAllocateDepthBuffer){if(W)throw new Error("target.depthTexture not supported in Cube render targets");const J=P.texture.mipmaps;J&&J.length>0?ne(A.__webglFramebuffer[0],P):ne(A.__webglFramebuffer,P)}else if(W){A.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(t.bindFramebuffer(s.FRAMEBUFFER,A.__webglFramebuffer[J]),A.__webglDepthbuffer[J]===void 0)A.__webglDepthbuffer[J]=s.createRenderbuffer(),pe(A.__webglDepthbuffer[J],P,!1);else{const ie=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Q=A.__webglDepthbuffer[J];s.bindRenderbuffer(s.RENDERBUFFER,Q),s.framebufferRenderbuffer(s.FRAMEBUFFER,ie,s.RENDERBUFFER,Q)}}else{const J=P.texture.mipmaps;if(J&&J.length>0?t.bindFramebuffer(s.FRAMEBUFFER,A.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=s.createRenderbuffer(),pe(A.__webglDepthbuffer,P,!1);else{const ie=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Q=A.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,Q),s.framebufferRenderbuffer(s.FRAMEBUFFER,ie,s.RENDERBUFFER,Q)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function et(P,A,W){const J=n.get(P);A!==void 0&&re(J.__webglFramebuffer,P,P.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),W!==void 0&&ye(P)}function I(P){const A=P.texture,W=n.get(P),J=n.get(A);P.addEventListener("dispose",S);const ie=P.textures,Q=P.isWebGLCubeRenderTarget===!0,ke=ie.length>1;if(ke||(J.__webglTexture===void 0&&(J.__webglTexture=s.createTexture()),J.__version=A.version,o.memory.textures++),Q){W.__webglFramebuffer=[];for(let he=0;he<6;he++)if(A.mipmaps&&A.mipmaps.length>0){W.__webglFramebuffer[he]=[];for(let De=0;De<A.mipmaps.length;De++)W.__webglFramebuffer[he][De]=s.createFramebuffer()}else W.__webglFramebuffer[he]=s.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){W.__webglFramebuffer=[];for(let he=0;he<A.mipmaps.length;he++)W.__webglFramebuffer[he]=s.createFramebuffer()}else W.__webglFramebuffer=s.createFramebuffer();if(ke)for(let he=0,De=ie.length;he<De;he++){const Le=n.get(ie[he]);Le.__webglTexture===void 0&&(Le.__webglTexture=s.createTexture(),o.memory.textures++)}if(P.samples>0&&Ce(P)===!1){W.__webglMultisampledFramebuffer=s.createFramebuffer(),W.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let he=0;he<ie.length;he++){const De=ie[he];W.__webglColorRenderbuffer[he]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,W.__webglColorRenderbuffer[he]);const Le=r.convert(De.format,De.colorSpace),de=r.convert(De.type),me=E(De.internalFormat,Le,de,De.colorSpace,P.isXRRenderTarget===!0),ze=We(P);s.renderbufferStorageMultisample(s.RENDERBUFFER,ze,me,P.width,P.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+he,s.RENDERBUFFER,W.__webglColorRenderbuffer[he])}s.bindRenderbuffer(s.RENDERBUFFER,null),P.depthBuffer&&(W.__webglDepthRenderbuffer=s.createRenderbuffer(),pe(W.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Q){t.bindTexture(s.TEXTURE_CUBE_MAP,J.__webglTexture),Ne(s.TEXTURE_CUBE_MAP,A);for(let he=0;he<6;he++)if(A.mipmaps&&A.mipmaps.length>0)for(let De=0;De<A.mipmaps.length;De++)re(W.__webglFramebuffer[he][De],P,A,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+he,De);else re(W.__webglFramebuffer[he],P,A,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+he,0);m(A)&&p(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ke){for(let he=0,De=ie.length;he<De;he++){const Le=ie[he],de=n.get(Le);let me=s.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(me=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(me,de.__webglTexture),Ne(me,Le),re(W.__webglFramebuffer,P,Le,s.COLOR_ATTACHMENT0+he,me,0),m(Le)&&p(me)}t.unbindTexture()}else{let he=s.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(he=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(he,J.__webglTexture),Ne(he,A),A.mipmaps&&A.mipmaps.length>0)for(let De=0;De<A.mipmaps.length;De++)re(W.__webglFramebuffer[De],P,A,s.COLOR_ATTACHMENT0,he,De);else re(W.__webglFramebuffer,P,A,s.COLOR_ATTACHMENT0,he,0);m(A)&&p(he),t.unbindTexture()}P.depthBuffer&&ye(P)}function Qe(P){const A=P.textures;for(let W=0,J=A.length;W<J;W++){const ie=A[W];if(m(ie)){const Q=w(P),ke=n.get(ie).__webglTexture;t.bindTexture(Q,ke),p(Q),t.unbindTexture()}}}const Xe=[],Pe=[];function _e(P){if(P.samples>0){if(Ce(P)===!1){const A=P.textures,W=P.width,J=P.height;let ie=s.COLOR_BUFFER_BIT;const Q=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ke=n.get(P),he=A.length>1;if(he)for(let Le=0;Le<A.length;Le++)t.bindFramebuffer(s.FRAMEBUFFER,ke.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Le,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,ke.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Le,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,ke.__webglMultisampledFramebuffer);const De=P.texture.mipmaps;De&&De.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ke.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ke.__webglFramebuffer);for(let Le=0;Le<A.length;Le++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(ie|=s.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(ie|=s.STENCIL_BUFFER_BIT)),he){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,ke.__webglColorRenderbuffer[Le]);const de=n.get(A[Le]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,de,0)}s.blitFramebuffer(0,0,W,J,0,0,W,J,ie,s.NEAREST),u===!0&&(Xe.length=0,Pe.length=0,Xe.push(s.COLOR_ATTACHMENT0+Le),P.depthBuffer&&P.resolveDepthBuffer===!1&&(Xe.push(Q),Pe.push(Q),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Pe)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Xe))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),he)for(let Le=0;Le<A.length;Le++){t.bindFramebuffer(s.FRAMEBUFFER,ke.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Le,s.RENDERBUFFER,ke.__webglColorRenderbuffer[Le]);const de=n.get(A[Le]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,ke.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Le,s.TEXTURE_2D,de,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ke.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&u){const A=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[A])}}}function We(P){return Math.min(i.maxSamples,P.samples)}function Ce(P){const A=n.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function Oe(P){const A=o.render.frame;h.get(P)!==A&&(h.set(P,A),P.update())}function vt(P,A){const W=P.colorSpace,J=P.format,ie=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||W!==Xi&&W!==Pn&&(rt.getTransfer(W)===ft?(J!==on||ie!==bn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",W)),A}function _t(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(d.width=P.naturalWidth||P.width,d.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(d.width=P.displayWidth,d.height=P.displayHeight):(d.width=P.width,d.height=P.height),d}this.allocateTextureUnit=B,this.resetTextureUnits=L,this.setTexture2D=H,this.setTexture2DArray=N,this.setTexture3D=q,this.setTextureCube=C,this.rebindTextures=et,this.setupRenderTarget=I,this.updateRenderTargetMipmap=Qe,this.updateMultisampleRenderTarget=_e,this.setupDepthRenderbuffer=ye,this.setupFrameBufferTexture=re,this.useMultisampledRTT=Ce}function Bv(s,e){function t(n,i=Pn){let r;const o=rt.getTransfer(i);if(n===bn)return s.UNSIGNED_BYTE;if(n===_a)return s.UNSIGNED_SHORT_4_4_4_4;if(n===va)return s.UNSIGNED_SHORT_5_5_5_1;if(n===zc)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Vc)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===Bc)return s.BYTE;if(n===Oc)return s.SHORT;if(n===vs)return s.UNSIGNED_SHORT;if(n===ga)return s.INT;if(n===ci)return s.UNSIGNED_INT;if(n===kn)return s.FLOAT;if(n===Ms)return s.HALF_FLOAT;if(n===Gc)return s.ALPHA;if(n===Hc)return s.RGB;if(n===on)return s.RGBA;if(n===xs)return s.DEPTH_COMPONENT;if(n===bs)return s.DEPTH_STENCIL;if(n===Wc)return s.RED;if(n===Aa)return s.RED_INTEGER;if(n===Xc)return s.RG;if(n===xa)return s.RG_INTEGER;if(n===ba)return s.RGBA_INTEGER;if(n===pr||n===mr||n===gr||n===_r)if(o===ft)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===pr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===mr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===gr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===_r)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===pr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===mr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===gr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===_r)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Fo||n===No||n===Bo||n===Oo)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Fo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===No)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Bo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Oo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===zo||n===Vo||n===Go)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===zo||n===Vo)return o===ft?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Go)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Ho||n===Wo||n===Xo||n===Yo||n===qo||n===Ko||n===Qo||n===jo||n===Jo||n===Zo||n===$o||n===ea||n===ta||n===na)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ho)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Wo)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Xo)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Yo)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===qo)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ko)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Qo)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===jo)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Jo)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Zo)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===$o)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ea)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ta)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===na)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ia||n===sa||n===ra)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===ia)return o===ft?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===sa)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ra)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===oa||n===aa||n===la||n===ca)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===oa)return r.COMPRESSED_RED_RGTC1_EXT;if(n===aa)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===la)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ca)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===As?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}const Ov=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,zv=`
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

}`;class Vv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new ld(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new yn({vertexShader:Ov,fragmentShader:zv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new mt(new Cs(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Gv extends qi{constructor(e,t){super();const n=this;let i=null,r=1,o=null,a="local-floor",u=1,d=null,h=null,l=null,c=null,f=null,g=null;const _=typeof XRWebGLBinding<"u",m=new Vv,p={},w=t.getContextAttributes();let E=null,y=null;const k=[],v=[],S=new Ze;let R=null;const x=new sn;x.viewport=new Et;const b=new sn;b.viewport=new Et;const D=[x,b],L=new cm;let B=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let Z=k[Y];return Z===void 0&&(Z=new oo,k[Y]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(Y){let Z=k[Y];return Z===void 0&&(Z=new oo,k[Y]=Z),Z.getGripSpace()},this.getHand=function(Y){let Z=k[Y];return Z===void 0&&(Z=new oo,k[Y]=Z),Z.getHandSpace()};function H(Y){const Z=v.indexOf(Y.inputSource);if(Z===-1)return;const re=k[Z];re!==void 0&&(re.update(Y.inputSource,Y.frame,d||o),re.dispatchEvent({type:Y.type,data:Y.inputSource}))}function N(){i.removeEventListener("select",H),i.removeEventListener("selectstart",H),i.removeEventListener("selectend",H),i.removeEventListener("squeeze",H),i.removeEventListener("squeezestart",H),i.removeEventListener("squeezeend",H),i.removeEventListener("end",N),i.removeEventListener("inputsourceschange",q);for(let Y=0;Y<k.length;Y++){const Z=v[Y];Z!==null&&(v[Y]=null,k[Y].disconnect(Z))}B=null,V=null,m.reset();for(const Y in p)delete p[Y];e.setRenderTarget(E),f=null,c=null,l=null,i=null,y=null,Ee.stop(),n.isPresenting=!1,e.setPixelRatio(R),e.setSize(S.width,S.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return d||o},this.setReferenceSpace=function(Y){d=Y},this.getBaseLayer=function(){return c!==null?c:f},this.getBinding=function(){return l===null&&_&&(l=new XRWebGLBinding(i,t)),l},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(Y){if(i=Y,i!==null){if(E=e.getRenderTarget(),i.addEventListener("select",H),i.addEventListener("selectstart",H),i.addEventListener("selectend",H),i.addEventListener("squeeze",H),i.addEventListener("squeezestart",H),i.addEventListener("squeezeend",H),i.addEventListener("end",N),i.addEventListener("inputsourceschange",q),w.xrCompatible!==!0&&await t.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(S),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let re=null,pe=null,ne=null;w.depth&&(ne=w.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,re=w.stencil?bs:xs,pe=w.stencil?As:ci);const ye={colorFormat:t.RGBA8,depthFormat:ne,scaleFactor:r};l=this.getBinding(),c=l.createProjectionLayer(ye),i.updateRenderState({layers:[c]}),e.setPixelRatio(1),e.setSize(c.textureWidth,c.textureHeight,!1),y=new di(c.textureWidth,c.textureHeight,{format:on,type:bn,depthTexture:new ad(c.textureWidth,c.textureHeight,pe,void 0,void 0,void 0,void 0,void 0,void 0,re),stencilBuffer:w.stencil,colorSpace:e.outputColorSpace,samples:w.antialias?4:0,resolveDepthBuffer:c.ignoreDepthValues===!1,resolveStencilBuffer:c.ignoreDepthValues===!1})}else{const re={antialias:w.antialias,alpha:!0,depth:w.depth,stencil:w.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,t,re),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new di(f.framebufferWidth,f.framebufferHeight,{format:on,type:bn,colorSpace:e.outputColorSpace,stencilBuffer:w.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(u),d=null,o=await i.requestReferenceSpace(a),Ee.setContext(i),Ee.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function q(Y){for(let Z=0;Z<Y.removed.length;Z++){const re=Y.removed[Z],pe=v.indexOf(re);pe>=0&&(v[pe]=null,k[pe].disconnect(re))}for(let Z=0;Z<Y.added.length;Z++){const re=Y.added[Z];let pe=v.indexOf(re);if(pe===-1){for(let ye=0;ye<k.length;ye++)if(ye>=v.length){v.push(re),pe=ye;break}else if(v[ye]===null){v[ye]=re,pe=ye;break}if(pe===-1)break}const ne=k[pe];ne&&ne.connect(re)}}const C=new G,ee=new G;function se(Y,Z,re){C.setFromMatrixPosition(Z.matrixWorld),ee.setFromMatrixPosition(re.matrixWorld);const pe=C.distanceTo(ee),ne=Z.projectionMatrix.elements,ye=re.projectionMatrix.elements,et=ne[14]/(ne[10]-1),I=ne[14]/(ne[10]+1),Qe=(ne[9]+1)/ne[5],Xe=(ne[9]-1)/ne[5],Pe=(ne[8]-1)/ne[0],_e=(ye[8]+1)/ye[0],We=et*Pe,Ce=et*_e,Oe=pe/(-Pe+_e),vt=Oe*-Pe;if(Z.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(vt),Y.translateZ(Oe),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),ne[10]===-1)Y.projectionMatrix.copy(Z.projectionMatrix),Y.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{const _t=et+Oe,P=I+Oe,A=We-vt,W=Ce+(pe-vt),J=Qe*I/P*_t,ie=Xe*I/P*_t;Y.projectionMatrix.makePerspective(A,W,J,ie,_t,P),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function ae(Y,Z){Z===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(Z.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(i===null)return;let Z=Y.near,re=Y.far;m.texture!==null&&(m.depthNear>0&&(Z=m.depthNear),m.depthFar>0&&(re=m.depthFar)),L.near=b.near=x.near=Z,L.far=b.far=x.far=re,(B!==L.near||V!==L.far)&&(i.updateRenderState({depthNear:L.near,depthFar:L.far}),B=L.near,V=L.far),L.layers.mask=Y.layers.mask|6,x.layers.mask=L.layers.mask&3,b.layers.mask=L.layers.mask&5;const pe=Y.parent,ne=L.cameras;ae(L,pe);for(let ye=0;ye<ne.length;ye++)ae(ne[ye],pe);ne.length===2?se(L,x,b):L.projectionMatrix.copy(x.projectionMatrix),Ne(Y,L,pe)};function Ne(Y,Z,re){re===null?Y.matrix.copy(Z.matrixWorld):(Y.matrix.copy(re.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(Z.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(Z.projectionMatrix),Y.projectionMatrixInverse.copy(Z.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=ys*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(c===null&&f===null))return u},this.setFoveation=function(Y){u=Y,c!==null&&(c.fixedFoveation=Y),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Y)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(L)},this.getCameraTexture=function(Y){return p[Y]};let be=null;function j(Y,Z){if(h=Z.getViewerPose(d||o),g=Z,h!==null){const re=h.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let pe=!1;re.length!==L.cameras.length&&(L.cameras.length=0,pe=!0);for(let I=0;I<re.length;I++){const Qe=re[I];let Xe=null;if(f!==null)Xe=f.getViewport(Qe);else{const _e=l.getViewSubImage(c,Qe);Xe=_e.viewport,I===0&&(e.setRenderTargetTextures(y,_e.colorTexture,_e.depthStencilTexture),e.setRenderTarget(y))}let Pe=D[I];Pe===void 0&&(Pe=new sn,Pe.layers.enable(I),Pe.viewport=new Et,D[I]=Pe),Pe.matrix.fromArray(Qe.transform.matrix),Pe.matrix.decompose(Pe.position,Pe.quaternion,Pe.scale),Pe.projectionMatrix.fromArray(Qe.projectionMatrix),Pe.projectionMatrixInverse.copy(Pe.projectionMatrix).invert(),Pe.viewport.set(Xe.x,Xe.y,Xe.width,Xe.height),I===0&&(L.matrix.copy(Pe.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),pe===!0&&L.cameras.push(Pe)}const ne=i.enabledFeatures;if(ne&&ne.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&_){l=n.getBinding();const I=l.getDepthInformation(re[0]);I&&I.isValid&&I.texture&&m.init(I,i.renderState)}if(ne&&ne.includes("camera-access")&&_){e.state.unbindTexture(),l=n.getBinding();for(let I=0;I<re.length;I++){const Qe=re[I].camera;if(Qe){let Xe=p[Qe];Xe||(Xe=new ld,p[Qe]=Xe);const Pe=l.getCameraImage(Qe);Xe.sourceTexture=Pe}}}}for(let re=0;re<k.length;re++){const pe=v[re],ne=k[re];pe!==null&&ne!==void 0&&ne.update(pe,Z,d||o)}be&&be(Y,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),g=null}const Ee=new cd;Ee.setAnimationLoop(j),this.setAnimationLoop=function(Y){be=Y},this.dispose=function(){}}}const $n=new Fn,Hv=new wt;function Wv(s,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Zc(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,w,E,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),l(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),c(m,p),p.isMeshPhysicalMaterial&&f(m,p,y)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?u(m,p,w,E):p.isSpriteMaterial?d(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ot&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ot&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const w=e.get(p),E=w.envMap,y=w.envMapRotation;E&&(m.envMap.value=E,$n.copy(y),$n.x*=-1,$n.y*=-1,$n.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&($n.y*=-1,$n.z*=-1),m.envMapRotation.value.setFromMatrix4(Hv.makeRotationFromEuler($n)),m.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function u(m,p,w,E){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*w,m.scale.value=E*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function d(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function l(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function c(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,w){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ot&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=w.texture,m.transmissionSamplerSize.value.set(w.width,w.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const w=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(w.matrixWorld),m.nearDistance.value=w.shadow.camera.near,m.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Xv(s,e,t,n){let i={},r={},o=[];const a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function u(w,E){const y=E.program;n.uniformBlockBinding(w,y)}function d(w,E){let y=i[w.id];y===void 0&&(g(w),y=h(w),i[w.id]=y,w.addEventListener("dispose",m));const k=E.program;n.updateUBOMapping(w,k);const v=e.render.frame;r[w.id]!==v&&(c(w),r[w.id]=v)}function h(w){const E=l();w.__bindingPointIndex=E;const y=s.createBuffer(),k=w.__size,v=w.usage;return s.bindBuffer(s.UNIFORM_BUFFER,y),s.bufferData(s.UNIFORM_BUFFER,k,v),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,E,y),y}function l(){for(let w=0;w<a;w++)if(o.indexOf(w)===-1)return o.push(w),w;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function c(w){const E=i[w.id],y=w.uniforms,k=w.__cache;s.bindBuffer(s.UNIFORM_BUFFER,E);for(let v=0,S=y.length;v<S;v++){const R=Array.isArray(y[v])?y[v]:[y[v]];for(let x=0,b=R.length;x<b;x++){const D=R[x];if(f(D,v,x,k)===!0){const L=D.__offset,B=Array.isArray(D.value)?D.value:[D.value];let V=0;for(let H=0;H<B.length;H++){const N=B[H],q=_(N);typeof N=="number"||typeof N=="boolean"?(D.__data[0]=N,s.bufferSubData(s.UNIFORM_BUFFER,L+V,D.__data)):N.isMatrix3?(D.__data[0]=N.elements[0],D.__data[1]=N.elements[1],D.__data[2]=N.elements[2],D.__data[3]=0,D.__data[4]=N.elements[3],D.__data[5]=N.elements[4],D.__data[6]=N.elements[5],D.__data[7]=0,D.__data[8]=N.elements[6],D.__data[9]=N.elements[7],D.__data[10]=N.elements[8],D.__data[11]=0):(N.toArray(D.__data,V),V+=q.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,L,D.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(w,E,y,k){const v=w.value,S=E+"_"+y;if(k[S]===void 0)return typeof v=="number"||typeof v=="boolean"?k[S]=v:k[S]=v.clone(),!0;{const R=k[S];if(typeof v=="number"||typeof v=="boolean"){if(R!==v)return k[S]=v,!0}else if(R.equals(v)===!1)return R.copy(v),!0}return!1}function g(w){const E=w.uniforms;let y=0;const k=16;for(let S=0,R=E.length;S<R;S++){const x=Array.isArray(E[S])?E[S]:[E[S]];for(let b=0,D=x.length;b<D;b++){const L=x[b],B=Array.isArray(L.value)?L.value:[L.value];for(let V=0,H=B.length;V<H;V++){const N=B[V],q=_(N),C=y%k,ee=C%q.boundary,se=C+ee;y+=ee,se!==0&&k-se<q.storage&&(y+=k-se),L.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=y,y+=q.storage}}}const v=y%k;return v>0&&(y+=k-v),w.__size=y,w.__cache={},this}function _(w){const E={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(E.boundary=4,E.storage=4):w.isVector2?(E.boundary=8,E.storage=8):w.isVector3||w.isColor?(E.boundary=16,E.storage=12):w.isVector4?(E.boundary=16,E.storage=16):w.isMatrix3?(E.boundary=48,E.storage=48):w.isMatrix4?(E.boundary=64,E.storage=64):w.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",w),E}function m(w){const E=w.target;E.removeEventListener("dispose",m);const y=o.indexOf(E.__bindingPointIndex);o.splice(y,1),s.deleteBuffer(i[E.id]),delete i[E.id],delete r[E.id]}function p(){for(const w in i)s.deleteBuffer(i[w]);o=[],i={},r={}}return{bind:u,update:d,dispose:p}}class Yv{constructor(e={}){const{canvas:t=Rp(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:u=!0,preserveDrawingBuffer:d=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:l=!1,reversedDepthBuffer:c=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const w=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Xn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const y=this;let k=!1;this._outputColorSpace=jt;let v=0,S=0,R=null,x=-1,b=null;const D=new Et,L=new Et;let B=null;const V=new Je(0);let H=0,N=t.width,q=t.height,C=1,ee=null,se=null;const ae=new Et(0,0,N,q),Ne=new Et(0,0,N,q);let be=!1;const j=new rd;let Ee=!1,Y=!1;const Z=new wt,re=new G,pe=new Et,ne={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ye=!1;function et(){return R===null?C:1}let I=n;function Qe(T,O){return t.getContext(T,O)}try{const T={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:u,preserveDrawingBuffer:d,powerPreference:h,failIfMajorPerformanceCaveat:l};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ma}`),t.addEventListener("webglcontextlost",ue,!1),t.addEventListener("webglcontextrestored",Se,!1),t.addEventListener("webglcontextcreationerror",oe,!1),I===null){const O="webgl2";if(I=Qe(O,T),I===null)throw Qe(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let Xe,Pe,_e,We,Ce,Oe,vt,_t,P,A,W,J,ie,Q,ke,he,De,Le,de,me,ze,we,ve,Ve;function U(){Xe=new n_(I),Xe.init(),we=new Bv(I,Xe),Pe=new Q0(I,Xe,e,we),_e=new Fv(I,Xe),Pe.reversedDepthBuffer&&c&&_e.buffers.depth.setReversed(!0),We=new r_(I),Ce=new Ev,Oe=new Nv(I,Xe,_e,Ce,Pe,we,We),vt=new J0(y),_t=new t_(y),P=new hm(I),ve=new q0(I,P),A=new i_(I,P,We,ve),W=new a_(I,A,P,We),de=new o_(I,Pe,Oe),he=new j0(Ce),J=new yv(y,vt,_t,Xe,Pe,ve,he),ie=new Wv(y,Ce),Q=new Sv,ke=new Pv(Xe),Le=new Y0(y,vt,_t,_e,W,f,u),De=new Iv(y,W,Pe),Ve=new Xv(I,We,Pe,_e),me=new K0(I,Xe,We),ze=new s_(I,Xe,We),We.programs=J.programs,y.capabilities=Pe,y.extensions=Xe,y.properties=Ce,y.renderLists=Q,y.shadowMap=De,y.state=_e,y.info=We}U();const le=new Gv(y,I);this.xr=le,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const T=Xe.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=Xe.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return C},this.setPixelRatio=function(T){T!==void 0&&(C=T,this.setSize(N,q,!1))},this.getSize=function(T){return T.set(N,q)},this.setSize=function(T,O,X=!0){if(le.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}N=T,q=O,t.width=Math.floor(T*C),t.height=Math.floor(O*C),X===!0&&(t.style.width=T+"px",t.style.height=O+"px"),this.setViewport(0,0,T,O)},this.getDrawingBufferSize=function(T){return T.set(N*C,q*C).floor()},this.setDrawingBufferSize=function(T,O,X){N=T,q=O,C=X,t.width=Math.floor(T*X),t.height=Math.floor(O*X),this.setViewport(0,0,T,O)},this.getCurrentViewport=function(T){return T.copy(D)},this.getViewport=function(T){return T.copy(ae)},this.setViewport=function(T,O,X,K){T.isVector4?ae.set(T.x,T.y,T.z,T.w):ae.set(T,O,X,K),_e.viewport(D.copy(ae).multiplyScalar(C).round())},this.getScissor=function(T){return T.copy(Ne)},this.setScissor=function(T,O,X,K){T.isVector4?Ne.set(T.x,T.y,T.z,T.w):Ne.set(T,O,X,K),_e.scissor(L.copy(Ne).multiplyScalar(C).round())},this.getScissorTest=function(){return be},this.setScissorTest=function(T){_e.setScissorTest(be=T)},this.setOpaqueSort=function(T){ee=T},this.setTransparentSort=function(T){se=T},this.getClearColor=function(T){return T.copy(Le.getClearColor())},this.setClearColor=function(){Le.setClearColor(...arguments)},this.getClearAlpha=function(){return Le.getClearAlpha()},this.setClearAlpha=function(){Le.setClearAlpha(...arguments)},this.clear=function(T=!0,O=!0,X=!0){let K=0;if(T){let z=!1;if(R!==null){const ce=R.texture.format;z=ce===ba||ce===xa||ce===Aa}if(z){const ce=R.texture.type,Ae=ce===bn||ce===ci||ce===vs||ce===As||ce===_a||ce===va,Te=Le.getClearColor(),Me=Le.getClearAlpha(),Be=Te.r,Ge=Te.g,Ie=Te.b;Ae?(g[0]=Be,g[1]=Ge,g[2]=Ie,g[3]=Me,I.clearBufferuiv(I.COLOR,0,g)):(_[0]=Be,_[1]=Ge,_[2]=Ie,_[3]=Me,I.clearBufferiv(I.COLOR,0,_))}else K|=I.COLOR_BUFFER_BIT}O&&(K|=I.DEPTH_BUFFER_BIT),X&&(K|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(K)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ue,!1),t.removeEventListener("webglcontextrestored",Se,!1),t.removeEventListener("webglcontextcreationerror",oe,!1),Le.dispose(),Q.dispose(),ke.dispose(),Ce.dispose(),vt.dispose(),_t.dispose(),W.dispose(),ve.dispose(),Ve.dispose(),J.dispose(),le.dispose(),le.removeEventListener("sessionstart",Xt),le.removeEventListener("sessionend",ji),En.stop()};function ue(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),k=!0}function Se(){console.log("THREE.WebGLRenderer: Context Restored."),k=!1;const T=We.autoReset,O=De.enabled,X=De.autoUpdate,K=De.needsUpdate,z=De.type;U(),We.autoReset=T,De.enabled=O,De.autoUpdate=X,De.needsUpdate=K,De.type=z}function oe(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function $(T){const O=T.target;O.removeEventListener("dispose",$),Re(O)}function Re(T){He(T),Ce.remove(T)}function He(T){const O=Ce.get(T).programs;O!==void 0&&(O.forEach(function(X){J.releaseProgram(X)}),T.isShaderMaterial&&J.releaseShaderCache(T))}this.renderBufferDirect=function(T,O,X,K,z,ce){O===null&&(O=ne);const Ae=z.isMesh&&z.matrixWorld.determinant()<0,Te=ks(T,O,X,K,z);_e.setMaterial(K,Ae);let Me=X.index,Be=1;if(K.wireframe===!0){if(Me=A.getWireframeAttribute(X),Me===void 0)return;Be=2}const Ge=X.drawRange,Ie=X.attributes.position;let qe=Ge.start*Be,ot=(Ge.start+Ge.count)*Be;ce!==null&&(qe=Math.max(qe,ce.start*Be),ot=Math.min(ot,(ce.start+ce.count)*Be)),Me!==null?(qe=Math.max(qe,0),ot=Math.min(ot,Me.count)):Ie!=null&&(qe=Math.max(qe,0),ot=Math.min(ot,Ie.count));const ct=ot-qe;if(ct<0||ct===1/0)return;ve.setup(z,K,Te,X,Me);let ut,dt=me;if(Me!==null&&(ut=P.get(Me),dt=ze,dt.setIndex(ut)),z.isMesh)K.wireframe===!0?(_e.setLineWidth(K.wireframeLinewidth*et()),dt.setMode(I.LINES)):dt.setMode(I.TRIANGLES);else if(z.isLine){let Ue=K.linewidth;Ue===void 0&&(Ue=1),_e.setLineWidth(Ue*et()),z.isLineSegments?dt.setMode(I.LINES):z.isLineLoop?dt.setMode(I.LINE_LOOP):dt.setMode(I.LINE_STRIP)}else z.isPoints?dt.setMode(I.POINTS):z.isSprite&&dt.setMode(I.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)Es("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),dt.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(Xe.get("WEBGL_multi_draw"))dt.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{const Ue=z._multiDrawStarts,pt=z._multiDrawCounts,it=z._multiDrawCount,Ut=Me?P.get(Me).bytesPerElement:1,Mn=Ce.get(K).currentProgram.getUniforms();for(let Ft=0;Ft<it;Ft++)Mn.setValue(I,"_gl_DrawID",Ft),dt.render(Ue[Ft]/Ut,pt[Ft])}else if(z.isInstancedMesh)dt.renderInstances(qe,ct,z.count);else if(X.isInstancedBufferGeometry){const Ue=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,pt=Math.min(X.instanceCount,Ue);dt.renderInstances(qe,ct,pt)}else dt.render(qe,ct)};function lt(T,O,X){T.transparent===!0&&T.side===Jt&&T.forceSinglePass===!1?(T.side=Ot,T.needsUpdate=!0,Nn(T,O,X),T.side=Un,T.needsUpdate=!0,Nn(T,O,X),T.side=Jt):Nn(T,O,X)}this.compile=function(T,O,X=null){X===null&&(X=T),p=ke.get(X),p.init(O),E.push(p),X.traverseVisible(function(z){z.isLight&&z.layers.test(O.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),T!==X&&T.traverseVisible(function(z){z.isLight&&z.layers.test(O.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),p.setupLights();const K=new Set;return T.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;const ce=z.material;if(ce)if(Array.isArray(ce))for(let Ae=0;Ae<ce.length;Ae++){const Te=ce[Ae];lt(Te,X,z),K.add(Te)}else lt(ce,X,z),K.add(ce)}),p=E.pop(),K},this.compileAsync=function(T,O,X=null){const K=this.compile(T,O,X);return new Promise(z=>{function ce(){if(K.forEach(function(Ae){Ce.get(Ae).currentProgram.isReady()&&K.delete(Ae)}),K.size===0){z(T);return}setTimeout(ce,10)}Xe.get("KHR_parallel_shader_compile")!==null?ce():setTimeout(ce,10)})};let tt=null;function $t(T){tt&&tt(T)}function Xt(){En.stop()}function ji(){En.start()}const En=new cd;En.setAnimationLoop($t),typeof self<"u"&&En.setContext(self),this.setAnimationLoop=function(T){tt=T,le.setAnimationLoop(T),T===null?En.stop():En.start()},le.addEventListener("sessionstart",Xt),le.addEventListener("sessionend",ji),this.render=function(T,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(k===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),le.enabled===!0&&le.isPresenting===!0&&(le.cameraAutoUpdate===!0&&le.updateCamera(O),O=le.getCamera()),T.isScene===!0&&T.onBeforeRender(y,T,O,R),p=ke.get(T,E.length),p.init(O),E.push(p),Z.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),j.setFromProjectionMatrix(Z,xn,O.reversedDepth),Y=this.localClippingEnabled,Ee=he.init(this.clippingPlanes,Y),m=Q.get(T,w.length),m.init(),w.push(m),le.enabled===!0&&le.isPresenting===!0){const ce=y.xr.getDepthSensingMesh();ce!==null&&At(ce,O,-1/0,y.sortObjects)}At(T,O,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(ee,se),ye=le.enabled===!1||le.isPresenting===!1||le.hasDepthSensing()===!1,ye&&Le.addToRenderList(m,T),this.info.render.frame++,Ee===!0&&he.beginShadows();const X=p.state.shadowsArray;De.render(X,T,O),Ee===!0&&he.endShadows(),this.info.autoReset===!0&&this.info.reset();const K=m.opaque,z=m.transmissive;if(p.setupLights(),O.isArrayCamera){const ce=O.cameras;if(z.length>0)for(let Ae=0,Te=ce.length;Ae<Te;Ae++){const Me=ce[Ae];Rs(K,z,T,Me)}ye&&Le.render(T);for(let Ae=0,Te=ce.length;Ae<Te;Ae++){const Me=ce[Ae];Ji(m,T,Me,Me.viewport)}}else z.length>0&&Rs(K,z,T,O),ye&&Le.render(T),Ji(m,T,O);R!==null&&S===0&&(Oe.updateMultisampleRenderTarget(R),Oe.updateRenderTargetMipmap(R)),T.isScene===!0&&T.onAfterRender(y,T,O),ve.resetDefaultState(),x=-1,b=null,E.pop(),E.length>0?(p=E[E.length-1],Ee===!0&&he.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,w.pop(),w.length>0?m=w[w.length-1]:m=null};function At(T,O,X,K){if(T.visible===!1)return;if(T.layers.test(O.layers)){if(T.isGroup)X=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(O);else if(T.isLight)p.pushLight(T),T.castShadow&&p.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||j.intersectsSprite(T)){K&&pe.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Z);const Ae=W.update(T),Te=T.material;Te.visible&&m.push(T,Ae,Te,X,pe.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||j.intersectsObject(T))){const Ae=W.update(T),Te=T.material;if(K&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),pe.copy(T.boundingSphere.center)):(Ae.boundingSphere===null&&Ae.computeBoundingSphere(),pe.copy(Ae.boundingSphere.center)),pe.applyMatrix4(T.matrixWorld).applyMatrix4(Z)),Array.isArray(Te)){const Me=Ae.groups;for(let Be=0,Ge=Me.length;Be<Ge;Be++){const Ie=Me[Be],qe=Te[Ie.materialIndex];qe&&qe.visible&&m.push(T,Ae,qe,X,pe.z,Ie)}}else Te.visible&&m.push(T,Ae,Te,X,pe.z,null)}}const ce=T.children;for(let Ae=0,Te=ce.length;Ae<Te;Ae++)At(ce[Ae],O,X,K)}function Ji(T,O,X,K){const z=T.opaque,ce=T.transmissive,Ae=T.transparent;p.setupLightsView(X),Ee===!0&&he.setGlobalState(y.clippingPlanes,X),K&&_e.viewport(D.copy(K)),z.length>0&&Pt(z,O,X),ce.length>0&&Pt(ce,O,X),Ae.length>0&&Pt(Ae,O,X),_e.buffers.depth.setTest(!0),_e.buffers.depth.setMask(!0),_e.buffers.color.setMask(!0),_e.setPolygonOffset(!1)}function Rs(T,O,X,K){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[K.id]===void 0&&(p.state.transmissionRenderTarget[K.id]=new di(1,1,{generateMipmaps:!0,type:Xe.has("EXT_color_buffer_half_float")||Xe.has("EXT_color_buffer_float")?Ms:bn,minFilter:li,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:rt.workingColorSpace}));const ce=p.state.transmissionRenderTarget[K.id],Ae=K.viewport||D;ce.setSize(Ae.z*y.transmissionResolutionScale,Ae.w*y.transmissionResolutionScale);const Te=y.getRenderTarget(),Me=y.getActiveCubeFace(),Be=y.getActiveMipmapLevel();y.setRenderTarget(ce),y.getClearColor(V),H=y.getClearAlpha(),H<1&&y.setClearColor(16777215,.5),y.clear(),ye&&Le.render(X);const Ge=y.toneMapping;y.toneMapping=Xn;const Ie=K.viewport;if(K.viewport!==void 0&&(K.viewport=void 0),p.setupLightsView(K),Ee===!0&&he.setGlobalState(y.clippingPlanes,K),Pt(T,X,K),Oe.updateMultisampleRenderTarget(ce),Oe.updateRenderTargetMipmap(ce),Xe.has("WEBGL_multisampled_render_to_texture")===!1){let qe=!1;for(let ot=0,ct=O.length;ot<ct;ot++){const ut=O[ot],dt=ut.object,Ue=ut.geometry,pt=ut.material,it=ut.group;if(pt.side===Jt&&dt.layers.test(K.layers)){const Ut=pt.side;pt.side=Ot,pt.needsUpdate=!0,Vt(dt,X,K,Ue,pt,it),pt.side=Ut,pt.needsUpdate=!0,qe=!0}}qe===!0&&(Oe.updateMultisampleRenderTarget(ce),Oe.updateRenderTargetMipmap(ce))}y.setRenderTarget(Te,Me,Be),y.setClearColor(V,H),Ie!==void 0&&(K.viewport=Ie),y.toneMapping=Ge}function Pt(T,O,X){const K=O.isScene===!0?O.overrideMaterial:null;for(let z=0,ce=T.length;z<ce;z++){const Ae=T[z],Te=Ae.object,Me=Ae.geometry,Be=Ae.group;let Ge=Ae.material;Ge.allowOverride===!0&&K!==null&&(Ge=K),Te.layers.test(X.layers)&&Vt(Te,O,X,Me,Ge,Be)}}function Vt(T,O,X,K,z,ce){T.onBeforeRender(y,O,X,K,z,ce),T.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),z.onBeforeRender(y,O,X,K,T,ce),z.transparent===!0&&z.side===Jt&&z.forceSinglePass===!1?(z.side=Ot,z.needsUpdate=!0,y.renderBufferDirect(X,O,K,z,T,ce),z.side=Un,z.needsUpdate=!0,y.renderBufferDirect(X,O,K,z,T,ce),z.side=Jt):y.renderBufferDirect(X,O,K,z,T,ce),T.onAfterRender(y,O,X,K,z,ce)}function Nn(T,O,X){O.isScene!==!0&&(O=ne);const K=Ce.get(T),z=p.state.lights,ce=p.state.shadowsArray,Ae=z.state.version,Te=J.getParameters(T,z.state,ce,O,X),Me=J.getProgramCacheKey(Te);let Be=K.programs;K.environment=T.isMeshStandardMaterial?O.environment:null,K.fog=O.fog,K.envMap=(T.isMeshStandardMaterial?_t:vt).get(T.envMap||K.environment),K.envMapRotation=K.environment!==null&&T.envMap===null?O.environmentRotation:T.envMapRotation,Be===void 0&&(T.addEventListener("dispose",$),Be=new Map,K.programs=Be);let Ge=Be.get(Me);if(Ge!==void 0){if(K.currentProgram===Ge&&K.lightsStateVersion===Ae)return Ps(T,Te),Ge}else Te.uniforms=J.getUniforms(T),T.onBeforeCompile(Te,y),Ge=J.acquireProgram(Te,Me),Be.set(Me,Ge),K.uniforms=Te.uniforms;const Ie=K.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Ie.clippingPlanes=he.uniform),Ps(T,Te),K.needsLights=Ls(T),K.lightsStateVersion=Ae,K.needsLights&&(Ie.ambientLightColor.value=z.state.ambient,Ie.lightProbe.value=z.state.probe,Ie.directionalLights.value=z.state.directional,Ie.directionalLightShadows.value=z.state.directionalShadow,Ie.spotLights.value=z.state.spot,Ie.spotLightShadows.value=z.state.spotShadow,Ie.rectAreaLights.value=z.state.rectArea,Ie.ltc_1.value=z.state.rectAreaLTC1,Ie.ltc_2.value=z.state.rectAreaLTC2,Ie.pointLights.value=z.state.point,Ie.pointLightShadows.value=z.state.pointShadow,Ie.hemisphereLights.value=z.state.hemi,Ie.directionalShadowMap.value=z.state.directionalShadowMap,Ie.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Ie.spotShadowMap.value=z.state.spotShadowMap,Ie.spotLightMatrix.value=z.state.spotLightMatrix,Ie.spotLightMap.value=z.state.spotLightMap,Ie.pointShadowMap.value=z.state.pointShadowMap,Ie.pointShadowMatrix.value=z.state.pointShadowMatrix),K.currentProgram=Ge,K.uniformsList=null,Ge}function Ds(T){if(T.uniformsList===null){const O=T.currentProgram.getUniforms();T.uniformsList=vr.seqWithValue(O.seq,T.uniforms)}return T.uniformsList}function Ps(T,O){const X=Ce.get(T);X.outputColorSpace=O.outputColorSpace,X.batching=O.batching,X.batchingColor=O.batchingColor,X.instancing=O.instancing,X.instancingColor=O.instancingColor,X.instancingMorph=O.instancingMorph,X.skinning=O.skinning,X.morphTargets=O.morphTargets,X.morphNormals=O.morphNormals,X.morphColors=O.morphColors,X.morphTargetsCount=O.morphTargetsCount,X.numClippingPlanes=O.numClippingPlanes,X.numIntersection=O.numClipIntersection,X.vertexAlphas=O.vertexAlphas,X.vertexTangents=O.vertexTangents,X.toneMapping=O.toneMapping}function ks(T,O,X,K,z){O.isScene!==!0&&(O=ne),Oe.resetTextureUnits();const ce=O.fog,Ae=K.isMeshStandardMaterial?O.environment:null,Te=R===null?y.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Xi,Me=(K.isMeshStandardMaterial?_t:vt).get(K.envMap||Ae),Be=K.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Ge=!!X.attributes.tangent&&(!!K.normalMap||K.anisotropy>0),Ie=!!X.morphAttributes.position,qe=!!X.morphAttributes.normal,ot=!!X.morphAttributes.color;let ct=Xn;K.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(ct=y.toneMapping);const ut=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,dt=ut!==void 0?ut.length:0,Ue=Ce.get(K),pt=p.state.lights;if(Ee===!0&&(Y===!0||T!==b)){const fe=T===b&&K.id===x;he.setState(K,T,fe)}let it=!1;K.version===Ue.__version?(Ue.needsLights&&Ue.lightsStateVersion!==pt.state.version||Ue.outputColorSpace!==Te||z.isBatchedMesh&&Ue.batching===!1||!z.isBatchedMesh&&Ue.batching===!0||z.isBatchedMesh&&Ue.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&Ue.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&Ue.instancing===!1||!z.isInstancedMesh&&Ue.instancing===!0||z.isSkinnedMesh&&Ue.skinning===!1||!z.isSkinnedMesh&&Ue.skinning===!0||z.isInstancedMesh&&Ue.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&Ue.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&Ue.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&Ue.instancingMorph===!1&&z.morphTexture!==null||Ue.envMap!==Me||K.fog===!0&&Ue.fog!==ce||Ue.numClippingPlanes!==void 0&&(Ue.numClippingPlanes!==he.numPlanes||Ue.numIntersection!==he.numIntersection)||Ue.vertexAlphas!==Be||Ue.vertexTangents!==Ge||Ue.morphTargets!==Ie||Ue.morphNormals!==qe||Ue.morphColors!==ot||Ue.toneMapping!==ct||Ue.morphTargetsCount!==dt)&&(it=!0):(it=!0,Ue.__version=K.version);let Ut=Ue.currentProgram;it===!0&&(Ut=Nn(K,O,z));let Mn=!1,Ft=!1,M=!1;const F=Ut.getUniforms(),te=Ue.uniforms;if(_e.useProgram(Ut.program)&&(Mn=!0,Ft=!0,M=!0),K.id!==x&&(x=K.id,Ft=!0),Mn||b!==T){_e.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),F.setValue(I,"projectionMatrix",T.projectionMatrix),F.setValue(I,"viewMatrix",T.matrixWorldInverse);const Fe=F.map.cameraPosition;Fe!==void 0&&Fe.setValue(I,re.setFromMatrixPosition(T.matrixWorld)),Pe.logarithmicDepthBuffer&&F.setValue(I,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(K.isMeshPhongMaterial||K.isMeshToonMaterial||K.isMeshLambertMaterial||K.isMeshBasicMaterial||K.isMeshStandardMaterial||K.isShaderMaterial)&&F.setValue(I,"isOrthographic",T.isOrthographicCamera===!0),b!==T&&(b=T,Ft=!0,M=!0)}if(z.isSkinnedMesh){F.setOptional(I,z,"bindMatrix"),F.setOptional(I,z,"bindMatrixInverse");const fe=z.skeleton;fe&&(fe.boneTexture===null&&fe.computeBoneTexture(),F.setValue(I,"boneTexture",fe.boneTexture,Oe))}z.isBatchedMesh&&(F.setOptional(I,z,"batchingTexture"),F.setValue(I,"batchingTexture",z._matricesTexture,Oe),F.setOptional(I,z,"batchingIdTexture"),F.setValue(I,"batchingIdTexture",z._indirectTexture,Oe),F.setOptional(I,z,"batchingColorTexture"),z._colorsTexture!==null&&F.setValue(I,"batchingColorTexture",z._colorsTexture,Oe));const ge=X.morphAttributes;if((ge.position!==void 0||ge.normal!==void 0||ge.color!==void 0)&&de.update(z,X,Ut),(Ft||Ue.receiveShadow!==z.receiveShadow)&&(Ue.receiveShadow=z.receiveShadow,F.setValue(I,"receiveShadow",z.receiveShadow)),K.isMeshGouraudMaterial&&K.envMap!==null&&(te.envMap.value=Me,te.flipEnvMap.value=Me.isCubeTexture&&Me.isRenderTargetTexture===!1?-1:1),K.isMeshStandardMaterial&&K.envMap===null&&O.environment!==null&&(te.envMapIntensity.value=O.environmentIntensity),Ft&&(F.setValue(I,"toneMappingExposure",y.toneMappingExposure),Ue.needsLights&&hi(te,M),ce&&K.fog===!0&&ie.refreshFogUniforms(te,ce),ie.refreshMaterialUniforms(te,K,C,q,p.state.transmissionRenderTarget[T.id]),vr.upload(I,Ds(Ue),te,Oe)),K.isShaderMaterial&&K.uniformsNeedUpdate===!0&&(vr.upload(I,Ds(Ue),te,Oe),K.uniformsNeedUpdate=!1),K.isSpriteMaterial&&F.setValue(I,"center",z.center),F.setValue(I,"modelViewMatrix",z.modelViewMatrix),F.setValue(I,"normalMatrix",z.normalMatrix),F.setValue(I,"modelMatrix",z.matrixWorld),K.isShaderMaterial||K.isRawShaderMaterial){const fe=K.uniformsGroups;for(let Fe=0,$e=fe.length;Fe<$e;Fe++){const Ye=fe[Fe];Ve.update(Ye,Ut),Ve.bind(Ye,Ut)}}return Ut}function hi(T,O){T.ambientLightColor.needsUpdate=O,T.lightProbe.needsUpdate=O,T.directionalLights.needsUpdate=O,T.directionalLightShadows.needsUpdate=O,T.pointLights.needsUpdate=O,T.pointLightShadows.needsUpdate=O,T.spotLights.needsUpdate=O,T.spotLightShadows.needsUpdate=O,T.rectAreaLights.needsUpdate=O,T.hemisphereLights.needsUpdate=O}function Ls(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return v},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(T,O,X){const K=Ce.get(T);K.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,K.__autoAllocateDepthBuffer===!1&&(K.__useRenderToTexture=!1),Ce.get(T.texture).__webglTexture=O,Ce.get(T.depthTexture).__webglTexture=K.__autoAllocateDepthBuffer?void 0:X,K.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,O){const X=Ce.get(T);X.__webglFramebuffer=O,X.__useDefaultFramebuffer=O===void 0};const kr=I.createFramebuffer();this.setRenderTarget=function(T,O=0,X=0){R=T,v=O,S=X;let K=!0,z=null,ce=!1,Ae=!1;if(T){const Me=Ce.get(T);if(Me.__useDefaultFramebuffer!==void 0)_e.bindFramebuffer(I.FRAMEBUFFER,null),K=!1;else if(Me.__webglFramebuffer===void 0)Oe.setupRenderTarget(T);else if(Me.__hasExternalTextures)Oe.rebindTextures(T,Ce.get(T.texture).__webglTexture,Ce.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const Ie=T.depthTexture;if(Me.__boundDepthTexture!==Ie){if(Ie!==null&&Ce.has(Ie)&&(T.width!==Ie.image.width||T.height!==Ie.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Oe.setupDepthRenderbuffer(T)}}const Be=T.texture;(Be.isData3DTexture||Be.isDataArrayTexture||Be.isCompressedArrayTexture)&&(Ae=!0);const Ge=Ce.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Ge[O])?z=Ge[O][X]:z=Ge[O],ce=!0):T.samples>0&&Oe.useMultisampledRTT(T)===!1?z=Ce.get(T).__webglMultisampledFramebuffer:Array.isArray(Ge)?z=Ge[X]:z=Ge,D.copy(T.viewport),L.copy(T.scissor),B=T.scissorTest}else D.copy(ae).multiplyScalar(C).floor(),L.copy(Ne).multiplyScalar(C).floor(),B=be;if(X!==0&&(z=kr),_e.bindFramebuffer(I.FRAMEBUFFER,z)&&K&&_e.drawBuffers(T,z),_e.viewport(D),_e.scissor(L),_e.setScissorTest(B),ce){const Me=Ce.get(T.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+O,Me.__webglTexture,X)}else if(Ae){const Me=O;for(let Be=0;Be<T.textures.length;Be++){const Ge=Ce.get(T.textures[Be]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+Be,Ge.__webglTexture,X,Me)}}else if(T!==null&&X!==0){const Me=Ce.get(T.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Me.__webglTexture,X)}x=-1},this.readRenderTargetPixels=function(T,O,X,K,z,ce,Ae,Te=0){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Me=Ce.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ae!==void 0&&(Me=Me[Ae]),Me){_e.bindFramebuffer(I.FRAMEBUFFER,Me);try{const Be=T.textures[Te],Ge=Be.format,Ie=Be.type;if(!Pe.textureFormatReadable(Ge)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Pe.textureTypeReadable(Ie)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=T.width-K&&X>=0&&X<=T.height-z&&(T.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Te),I.readPixels(O,X,K,z,we.convert(Ge),we.convert(Ie),ce))}finally{const Be=R!==null?Ce.get(R).__webglFramebuffer:null;_e.bindFramebuffer(I.FRAMEBUFFER,Be)}}},this.readRenderTargetPixelsAsync=async function(T,O,X,K,z,ce,Ae,Te=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Me=Ce.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ae!==void 0&&(Me=Me[Ae]),Me)if(O>=0&&O<=T.width-K&&X>=0&&X<=T.height-z){_e.bindFramebuffer(I.FRAMEBUFFER,Me);const Be=T.textures[Te],Ge=Be.format,Ie=Be.type;if(!Pe.textureFormatReadable(Ge))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Pe.textureTypeReadable(Ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const qe=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,qe),I.bufferData(I.PIXEL_PACK_BUFFER,ce.byteLength,I.STREAM_READ),T.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Te),I.readPixels(O,X,K,z,we.convert(Ge),we.convert(Ie),0);const ot=R!==null?Ce.get(R).__webglFramebuffer:null;_e.bindFramebuffer(I.FRAMEBUFFER,ot);const ct=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await Dp(I,ct,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,qe),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,ce),I.deleteBuffer(qe),I.deleteSync(ct),ce}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,O=null,X=0){const K=Math.pow(2,-X),z=Math.floor(T.image.width*K),ce=Math.floor(T.image.height*K),Ae=O!==null?O.x:0,Te=O!==null?O.y:0;Oe.setTexture2D(T,0),I.copyTexSubImage2D(I.TEXTURE_2D,X,0,0,Ae,Te,z,ce),_e.unbindTexture()};const ui=I.createFramebuffer(),Lr=I.createFramebuffer();this.copyTextureToTexture=function(T,O,X=null,K=null,z=0,ce=null){ce===null&&(z!==0?(Es("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ce=z,z=0):ce=0);let Ae,Te,Me,Be,Ge,Ie,qe,ot,ct;const ut=T.isCompressedTexture?T.mipmaps[ce]:T.image;if(X!==null)Ae=X.max.x-X.min.x,Te=X.max.y-X.min.y,Me=X.isBox3?X.max.z-X.min.z:1,Be=X.min.x,Ge=X.min.y,Ie=X.isBox3?X.min.z:0;else{const ge=Math.pow(2,-z);Ae=Math.floor(ut.width*ge),Te=Math.floor(ut.height*ge),T.isDataArrayTexture?Me=ut.depth:T.isData3DTexture?Me=Math.floor(ut.depth*ge):Me=1,Be=0,Ge=0,Ie=0}K!==null?(qe=K.x,ot=K.y,ct=K.z):(qe=0,ot=0,ct=0);const dt=we.convert(O.format),Ue=we.convert(O.type);let pt;O.isData3DTexture?(Oe.setTexture3D(O,0),pt=I.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(Oe.setTexture2DArray(O,0),pt=I.TEXTURE_2D_ARRAY):(Oe.setTexture2D(O,0),pt=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,O.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,O.unpackAlignment);const it=I.getParameter(I.UNPACK_ROW_LENGTH),Ut=I.getParameter(I.UNPACK_IMAGE_HEIGHT),Mn=I.getParameter(I.UNPACK_SKIP_PIXELS),Ft=I.getParameter(I.UNPACK_SKIP_ROWS),M=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,ut.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,ut.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Be),I.pixelStorei(I.UNPACK_SKIP_ROWS,Ge),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Ie);const F=T.isDataArrayTexture||T.isData3DTexture,te=O.isDataArrayTexture||O.isData3DTexture;if(T.isDepthTexture){const ge=Ce.get(T),fe=Ce.get(O),Fe=Ce.get(ge.__renderTarget),$e=Ce.get(fe.__renderTarget);_e.bindFramebuffer(I.READ_FRAMEBUFFER,Fe.__webglFramebuffer),_e.bindFramebuffer(I.DRAW_FRAMEBUFFER,$e.__webglFramebuffer);for(let Ye=0;Ye<Me;Ye++)F&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Ce.get(T).__webglTexture,z,Ie+Ye),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Ce.get(O).__webglTexture,ce,ct+Ye)),I.blitFramebuffer(Be,Ge,Ae,Te,qe,ot,Ae,Te,I.DEPTH_BUFFER_BIT,I.NEAREST);_e.bindFramebuffer(I.READ_FRAMEBUFFER,null),_e.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(z!==0||T.isRenderTargetTexture||Ce.has(T)){const ge=Ce.get(T),fe=Ce.get(O);_e.bindFramebuffer(I.READ_FRAMEBUFFER,ui),_e.bindFramebuffer(I.DRAW_FRAMEBUFFER,Lr);for(let Fe=0;Fe<Me;Fe++)F?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,ge.__webglTexture,z,Ie+Fe):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,ge.__webglTexture,z),te?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,fe.__webglTexture,ce,ct+Fe):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,fe.__webglTexture,ce),z!==0?I.blitFramebuffer(Be,Ge,Ae,Te,qe,ot,Ae,Te,I.COLOR_BUFFER_BIT,I.NEAREST):te?I.copyTexSubImage3D(pt,ce,qe,ot,ct+Fe,Be,Ge,Ae,Te):I.copyTexSubImage2D(pt,ce,qe,ot,Be,Ge,Ae,Te);_e.bindFramebuffer(I.READ_FRAMEBUFFER,null),_e.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else te?T.isDataTexture||T.isData3DTexture?I.texSubImage3D(pt,ce,qe,ot,ct,Ae,Te,Me,dt,Ue,ut.data):O.isCompressedArrayTexture?I.compressedTexSubImage3D(pt,ce,qe,ot,ct,Ae,Te,Me,dt,ut.data):I.texSubImage3D(pt,ce,qe,ot,ct,Ae,Te,Me,dt,Ue,ut):T.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,ce,qe,ot,Ae,Te,dt,Ue,ut.data):T.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,ce,qe,ot,ut.width,ut.height,dt,ut.data):I.texSubImage2D(I.TEXTURE_2D,ce,qe,ot,Ae,Te,dt,Ue,ut);I.pixelStorei(I.UNPACK_ROW_LENGTH,it),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Ut),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Mn),I.pixelStorei(I.UNPACK_SKIP_ROWS,Ft),I.pixelStorei(I.UNPACK_SKIP_IMAGES,M),ce===0&&O.generateMipmaps&&I.generateMipmap(pt),_e.unbindTexture()},this.initRenderTarget=function(T){Ce.get(T).__webglFramebuffer===void 0&&Oe.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?Oe.setTextureCube(T,0):T.isData3DTexture?Oe.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?Oe.setTexture2DArray(T,0):Oe.setTexture2D(T,0),_e.unbindTexture()},this.resetState=function(){v=0,S=0,R=null,_e.reset(),ve.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return xn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=rt._getDrawingBufferColorSpace(e),t.unpackColorSpace=rt._getUnpackColorSpace()}}let ls=null,ei=2654435769;function pd(){return ei^=ei<<13,ei^=ei>>>17,ei^=ei<<5,(ei>>>0)/4294967296}function Qi(){try{return ls||(ls=new(window.AudioContext||window.webkitAudioContext)),ls.state==="suspended"&&ls.resume(),ls}catch{return null}}function Yn(s,e,t,n=.12,i="sine"){const r=Qi();if(!r)return;const o=r.createOscillator(),a=r.createGain();o.type=i,o.frequency.setValueAtTime(s,e),a.gain.setValueAtTime(0,e),a.gain.linearRampToValueAtTime(n,e+.01),a.gain.exponentialRampToValueAtTime(5e-4,e+t),o.connect(a).connect(r.destination),o.start(e),o.stop(e+t+.02)}function go(s=.25){const e=Qi();if(!e)return;const t=1200*(1+(pd()*2-1)*s);Yn(t,e.currentTime,.14,.08),Yn(t*2,e.currentTime,.08,.03)}function qv(){const s=Qi();if(!s)return;const e=s.currentTime;for(const[t,n]of[523.25,659.25,783.99,1046.5].entries())Yn(n,e+t*.09,.22,.1,"triangle")}function Kv(s=1){const e=Qi();if(!e)return;const t=e.currentTime,n=Math.max(1,Math.min(5,s)),i=e.createOscillator(),r=e.createGain();i.type="sawtooth",i.frequency.setValueAtTime(90+20*n,t),i.frequency.exponentialRampToValueAtTime(400+160*n,t+.25),i.frequency.exponentialRampToValueAtTime(140+30*n,t+.9+.1*n),r.gain.setValueAtTime(0,t),r.gain.linearRampToValueAtTime(.05+.015*n,t+.05),r.gain.exponentialRampToValueAtTime(5e-4,t+1+.1*n),i.connect(r).connect(e.destination),i.start(t),i.stop(t+1.2+.1*n),Yn(1600+200*n,t,.12,.03)}function Qv(){const s=Qi();if(!s)return;const e=s.currentTime;Yn(140,e,.12,.12,"square"),Yn(90,e+.02,.18,.1,"triangle")}function jv(){const s=Qi();if(!s)return;const e=s.currentTime;Yn(60,e,.5,.2,"sawtooth"),Yn(38,e+.02,.7,.16,"square");const t=s.createBuffer(1,Math.floor(s.sampleRate*.35),s.sampleRate),n=t.getChannelData(0);for(let o=0;o<n.length;o++)n[o]=(pd()*2-1)*(1-o/n.length);const i=s.createBufferSource(),r=s.createGain();i.buffer=t,r.gain.setValueAtTime(.18,e),r.gain.exponentialRampToValueAtTime(5e-4,e+.35),i.connect(r).connect(s.destination),i.start(e)}const _o=.18,Bl=3.2;class Jv{prevButtons=[];lastActive=0;axis(e){const t=Math.abs(e);return t<_o?0:Math.sign(e)*((t-_o)/(1-_o))}poll(e,t){const n=typeof navigator.getGamepads=="function"?navigator.getGamepads():[],i=Array.from(n).find(l=>!!l&&l.connected);if(!i)return;const r=i.buttons.map(l=>l.pressed),o=l=>r[l]&&!this.prevButtons[l],a=this.axis(i.axes[0]??0),u=-this.axis(i.axes[1]??0),d=this.axis(i.axes[2]??0),h=this.axis(i.axes[3]??0);(a||u||d||h||r.some(Boolean))&&(this.lastActive=performance.now()),e.moveX+=a,e.moveZ+=u,e.lookDX+=d*Bl*t,e.lookDY+=h*Bl*t,r[0]&&(e.jump=!0),r[1]&&(e.sneak=!0),r[10]&&(e.sprint=!0),r[7]&&(e.primary=!0),r[6]&&(e.secondaryHold=!0),o(6)&&(e.secondaryTap=!0),o(5)&&(e.slotDelta+=1),o(4)&&(e.slotDelta-=1),o(9)&&(e.toggleDebug=!0),this.prevButtons=r}dispose(){}}function md(s){s.moveX=0,s.moveZ=0,s.lookDX=0,s.lookDY=0,s.jump=!1,s.sneak=!1,s.sprint=!1,s.primary=!1,s.secondaryTap=!1,s.secondaryHold=!1,s.slotDelta=0,s.slotSelect=-1,s.toggleDebug=!1}function Ol(){const s={};return md(s),s}class Zv{state=Ol();sources=[];paused=!1;add(e){this.sources.push(e)}frame(e){const t=this.state;if(md(t),this.paused){const i=Ol();for(const r of this.sources)r.poll(i,e);return t}for(const i of this.sources)i.poll(t,e);const n=Math.hypot(t.moveX,t.moveZ);return n>1&&(t.moveX/=n,t.moveZ/=n),t}dispose(){for(const e of this.sources)e.dispose();this.sources.length=0}}const zl=.0022;class $v{constructor(e){this.element=e,document.addEventListener("pointerlockerror",this.onLockError),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp),window.addEventListener("blur",this.onBlur),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("mousedown",this.onMouseDown),document.addEventListener("mouseup",this.onMouseUp),document.addEventListener("wheel",this.onWheel,{passive:!0}),document.addEventListener("contextmenu",this.onContextMenu)}element;keys=new Set;lookDX=0;lookDY=0;primary=!1;secondaryHold=!1;secondaryTap=!1;slotDelta=0;slotSelect=-1;toggleDebug=!1;lastActive=0;lockFailed=!1;enabled=!1;onKeyDown=e=>{if(!e.repeat){if(this.lastActive=performance.now(),this.keys.add(e.code),e.code.startsWith("Digit")){const t=Number(e.code.slice(5));t>=1&&t<=9?this.slotSelect=t-1:t===0&&(this.slotSelect=9)}e.code==="F3"&&(this.toggleDebug=!0,e.preventDefault()),(e.code==="Space"||e.code==="Tab")&&e.preventDefault()}};onKeyUp=e=>{this.keys.delete(e.code)};onBlur=()=>{this.keys.clear(),this.primary=!1,this.secondaryHold=!1};onMouseMove=e=>{this.active&&(this.lookDX+=e.movementX*zl,this.lookDY+=e.movementY*zl)};onMouseDown=e=>{this.active&&(this.lastActive=performance.now(),e.button===0&&(this.primary=!0),e.button===2&&(this.secondaryHold=!0,this.secondaryTap=!0))};onMouseUp=e=>{e.button===0&&(this.primary=!1),e.button===2&&(this.secondaryHold=!1)};onWheel=e=>{this.active&&(e.deltaY>0?this.slotDelta++:e.deltaY<0&&this.slotDelta--)};onContextMenu=e=>e.preventDefault();onLockError=()=>{this.lockFailed=!0};get locked(){return document.pointerLockElement===this.element}get active(){return this.locked||this.lockFailed&&this.enabled}async requestLock(){if(this.locked)return!0;if(!this.element.requestPointerLock)return this.lockFailed=!0,!1;const e=this.element.requestPointerLock;try{await e.call(this.element,{unadjustedMovement:!0})}catch{try{await e.call(this.element)}catch{return this.lockFailed=!0,!1}}return await new Promise(t=>setTimeout(t,50)),this.locked?(this.lockFailed=!1,!0):(this.lockFailed=!0,!1)}down(...e){for(const t of e)if(this.keys.has(t))return!0;return!1}poll(e){this.down("KeyW","ArrowUp")&&(e.moveZ+=1),this.down("KeyS","ArrowDown")&&(e.moveZ-=1),this.down("KeyD","ArrowRight")&&(e.moveX+=1),this.down("KeyA","ArrowLeft")&&(e.moveX-=1),this.down("Space")&&(e.jump=!0),this.down("ShiftLeft","ShiftRight")&&(e.sneak=!0),this.down("ControlLeft","ControlRight")&&(e.sprint=!0),e.lookDX+=this.lookDX,e.lookDY+=this.lookDY,this.lookDX=0,this.lookDY=0,this.primary&&(e.primary=!0),this.secondaryHold&&(e.secondaryHold=!0),this.secondaryTap&&(e.secondaryTap=!0),this.secondaryTap=!1,e.slotDelta+=this.slotDelta,this.slotDelta=0,this.slotSelect>=0&&(e.slotSelect=this.slotSelect),this.slotSelect=-1,this.toggleDebug&&(e.toggleDebug=!0),this.toggleDebug=!1}dispose(){document.removeEventListener("pointerlockerror",this.onLockError),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),window.removeEventListener("blur",this.onBlur),document.removeEventListener("mousemove",this.onMouseMove),document.removeEventListener("mousedown",this.onMouseDown),document.removeEventListener("mouseup",this.onMouseUp),document.removeEventListener("wheel",this.onWheel),document.removeEventListener("contextmenu",this.onContextMenu)}}const eA=.0082,tA=.0056,cs=56,nA=28,vo=.12,Vl=220,iA=320,sA=14;class Gl{constructor(e,t){this.el=e,this.onChange=t}el;onChange;held=!1;locked=!1;lockPending=!1;lastUp=0;get on(){return this.held||this.locked}press(e){if(this.locked){this.locked=!1,this.held=!1,this.lockPending=!1,this.lastUp=e,this.paint();return}this.lockPending=e-this.lastUp<=iA,this.held=!0,this.paint()}release(e){this.lastUp=e,this.lockPending&&(this.locked=!0,this.lockPending=!1),this.held=!1,this.paint()}clear(){this.held=this.locked=this.lockPending=!1,this.paint()}paint(){this.el.classList.toggle("active",this.on),this.el.classList.toggle("locked",this.locked),this.onChange?.(this.on)}}class rA{constructor(e){this.ui=e,this.jump=new Gl(e.jumpButton),this.sneak=new Gl(e.sneakButton,n=>e.onSneakToggle?.(n));const t={passive:!1};e.surface.addEventListener("touchstart",this.onStart,t),e.surface.addEventListener("touchmove",this.onMove,t),e.surface.addEventListener("touchend",this.onEnd,t),e.surface.addEventListener("touchcancel",this.onEnd,t),e.jumpButton.addEventListener("touchstart",this.onJumpStart,t),e.jumpButton.addEventListener("touchend",this.onJumpEnd,t),e.jumpButton.addEventListener("touchcancel",this.onJumpEnd,t),e.sneakButton.addEventListener("touchstart",this.onSneakStart,t),e.sneakButton.addEventListener("touchend",this.onSneakEnd,t),e.sneakButton.addEventListener("touchcancel",this.onSneakEnd,t),e.stickBase.hidden=!1}ui;stick=null;look=null;lookDX=0;lookDY=0;secondaryTap=!1;jump;sneak;lastActive=0;stickCenter(){const e=this.ui.stickBase.getBoundingClientRect();return{cx:e.left+e.width/2,cy:e.top+e.height/2}}onStickArea(e,t){const n=this.ui.stickBase.getBoundingClientRect(),i=nA;return e>=n.left-i&&e<=n.right+i&&t>=n.top-i&&t<=n.bottom+i}onStart=e=>{let t=!1;for(const n of Array.from(e.changedTouches))if(!n.target?.closest?.(".hotbar, .tbtn, .sbtn, .topbar, .overlay, .help-panel, .action-card, .result-panel, .bag-panel, .chat-panel, .side-btns, .time-chip, .today-panel, .approval-card, .nest-panel, .chest-panel"))if(t=!0,this.stick===null&&this.onStickArea(n.clientX,n.clientY)){const{cx:i,cy:r}=this.stickCenter();this.stick={id:n.identifier,ox:i,oy:r,dx:0,dy:0},this.moveStick(n.clientX,n.clientY)}else this.look===null&&(this.look={id:n.identifier,startX:n.clientX,startY:n.clientY,lastX:n.clientX,lastY:n.clientY,startTime:performance.now(),mode:"undecided"});t&&(this.lastActive=performance.now(),e.preventDefault())};onMove=e=>{(this.stick||this.look)&&e.preventDefault();for(const t of Array.from(e.changedTouches))if(this.stick&&t.identifier===this.stick.id)this.moveStick(t.clientX,t.clientY);else if(this.look&&t.identifier===this.look.id){const n=this.look,i=t.clientX-n.lastX,r=t.clientY-n.lastY;n.lastX=t.clientX,n.lastY=t.clientY,n.mode==="undecided"&&Math.hypot(t.clientX-n.startX,t.clientY-n.startY)>sA&&(n.mode="look"),n.mode!=="undecided"&&(this.lookDX+=i*eA,this.lookDY+=r*tA)}};moveStick(e,t){if(!this.stick)return;let n=e-this.stick.ox,i=t-this.stick.oy;const r=Math.hypot(n,i);r>cs&&(n*=cs/r,i*=cs/r),this.stick.dx=n,this.stick.dy=i,this.ui.stickKnob.style.transform=`translate(${n}px, ${i}px)`,this.ui.stickBase.classList.add("active")}onEnd=e=>{let t=!1;for(const n of Array.from(e.changedTouches))this.stick&&n.identifier===this.stick.id?(this.stick=null,this.ui.stickKnob.style.transform="translate(0px, 0px)",this.ui.stickBase.classList.remove("active"),t=!0):this.look&&n.identifier===this.look.id&&(this.look.mode==="undecided"&&performance.now()-this.look.startTime<Vl&&(this.secondaryTap=!0),this.look=null,t=!0);t&&e.preventDefault()};onJumpStart=e=>{e.preventDefault(),this.lastActive=performance.now(),this.jump.press(this.lastActive)};onJumpEnd=e=>{e.preventDefault(),this.jump.release(performance.now())};onSneakStart=e=>{e.preventDefault(),this.lastActive=performance.now(),this.sneak.press(this.lastActive)};onSneakEnd=e=>{e.preventDefault(),this.sneak.release(performance.now())};clearHolds(){this.jump.clear(),this.sneak.clear()}poll(e){if(this.stick){let t=this.stick.dx/cs,n=-this.stick.dy/cs;const i=Math.hypot(t,n);if(i<vo)t=n=0;else{const r=(i-vo)/(1-vo)/i;t*=r,n*=r}e.moveX+=t,e.moveZ+=n,n>.97&&(e.sprint=!0)}if(this.look){const t=this.look;t.mode==="undecided"&&performance.now()-t.startTime>=Vl&&(t.mode="break"),t.mode==="break"&&(e.primary=!0)}e.lookDX+=this.lookDX,e.lookDY+=this.lookDY,this.lookDX=0,this.lookDY=0,this.secondaryTap&&(e.secondaryTap=!0),this.secondaryTap=!1,this.jump.on&&(e.jump=!0),this.sneak.on&&(e.sneak=!0)}dispose(){const e=this.ui.surface;e.removeEventListener("touchstart",this.onStart),e.removeEventListener("touchmove",this.onMove),e.removeEventListener("touchend",this.onEnd),e.removeEventListener("touchcancel",this.onEnd),this.ui.jumpButton.removeEventListener("touchstart",this.onJumpStart),this.ui.jumpButton.removeEventListener("touchend",this.onJumpEnd),this.ui.jumpButton.removeEventListener("touchcancel",this.onJumpEnd),this.ui.sneakButton.removeEventListener("touchstart",this.onSneakStart),this.ui.sneakButton.removeEventListener("touchend",this.onSneakEnd),this.ui.sneakButton.removeEventListener("touchcancel",this.onSneakEnd)}}const gd=0,oA=1,aA=2,us=3;function lA(s,e){const t=e.get("missing")??0,n=i=>e.get(i)??t;return s.defs.map(i=>{if(i.id==="air"||!i.textures)return{layer:gd,opaque:!1,castAO:!1,sameCull:!1,tex:[0,0,0,0,0,0],fluidKind:0,fluidHeight:0,panel:null,torch:null,egg:!1};const r=i.fluid==="water"||i.id==="ice",o=i.solid&&!i.transparent||i.fluid==="lava",a=r?us:o?oA:aA,[u,d,h]=i.textures,l=n(d);let c=null;if(i.door){const[f,g]=bc[i.door.facing];if(!i.door.open)c=[f!==0?0:2,f<0||g<0?1:0];else{const _=i.door.hinge?-g:g,m=i.door.hinge?f:-f;c=[_!==0?0:2,_<0||m<0?0:1]}}return{panel:c,torch:i.torch?i.torch.wall:null,egg:i.shape==="egg",layer:a,opaque:o,castAO:o&&!i.fluid||i.id==="leaves",sameCull:i.transparent,tex:[l,l,n(u),n(h),l,l],fluidKind:i.fluid==="water"?1:i.fluid==="lava"?2:0,fluidHeight:i.fluid?(8-i.fluidLevel)/9:0}})}(function(s,e){typeof module=="object"&&module.exports?module.exports=e():s.DragonVoxels=e()})(typeof self<"u"?self:void 0,function(){function s(h,l,c,f){let g=h*374761393+l*668265263+c*2147483647+f*97|0;return g=(g^g>>>13)*1274126177,g=g^g>>>16,(g>>>0)%1e3/1e3}class e{constructor(){this.map=new Map}key(l,c,f){return l+","+c+","+f}set(l,c,f,g){c<0||this.map.set(this.key(l,c,f),{x:l,y:c,z:f,c:g})}get(l,c,f){return this.map.get(this.key(l,c,f))}box(l,c,f,g,_,m,p){for(let w=Math.min(l,g);w<=Math.max(l,g);w++)for(let E=Math.min(c,_);E<=Math.max(c,_);E++)for(let y=Math.min(f,m);y<=Math.max(f,m);y++)this.set(w,E,y,p)}mirror(){for(const l of Array.from(this.map.values()))l.x<0&&this.set(-l.x,l.y,l.z,l.c)}list(){return Array.from(this.map.values())}}function t(h){const l=new e,c=h.colors,f=h.seed;for(let v=-5;v<=5;v++){const S=Math.abs(v)>=5?1:2,R=7+(Math.abs(v)>=4?-1:0);for(let x=-S;x<=S;x++)for(let b=4;b<=R;b++){let D=c.body;b===4?D=c.belly:b===R&&s(x,b,v,f)<h.scaleNoise&&(D=c.dark),l.set(x,b,v,D)}}for(let v=-5;v<=4;v+=2)l.set(0,8,v,h.spineStyle==="blade"?c.accent:c.dark);if(h.spineStyle==="blade")for(let v=-4;v<=3;v+=2)l.set(0,9,v,c.accent);const g=[[6,6],[7,7],[8,8],[8,9]];for(const[v,S]of g)l.box(-1,S,v,1,S+1,v,c.body),l.set(0,S,v,c.belly);const _=9,m=9;l.box(-1,m,_,1,m+2,_+3,c.body),l.box(-1,m,_+4,1,m+1,_+5,c.body),l.box(-1,m,_+4,1,m,_+5,c.belly),l.set(-1,m+2,_+2,c.eye),l.set(1,m+2,_+2,c.eye),l.set(-1,m+2,_+3,c.eyeDark),l.set(1,m+2,_+3,c.eyeDark),l.set(-1,m,_+5,c.dark),l.set(1,m,_+5,c.dark),l.set(-1,m-1,_+5,c.tooth),l.set(1,m-1,_+5,c.tooth),h.horn==="spiky"?(l.box(-1,m+3,_,-1,m+4,_,c.accent),l.set(-2,m+5,_-1,c.accent),l.set(-1,m+5,_+1,c.accent),l.set(0,m+3,_+1,c.accent),l.set(0,m+4,_+1,c.accent)):h.horn==="ears"?(l.box(-2,m+2,_,-2,m+4,_+1,c.dark),l.set(-2,m+5,_+1,c.dark),l.set(0,m+3,_+2,c.accent)):h.horn==="blade"&&(l.set(0,m+3,_,c.accent),l.set(0,m+4,_-1,c.accent),l.set(0,m+5,_-2,c.accent),l.set(0,m+6,_-3,c.accent),l.set(-2,m+2,_+1,c.accent),l.set(-2,m+3,_,c.accent));for(const[v,S]of[[-2,3],[-2,-4]])l.box(v,1,S,v,4,S+1,c.body),l.box(v,0,S-1,v,0,S+1,c.dark),l.set(v,0,S+2,c.tooth),h.bulky&&l.box(v-1,3,S,v-1,4,S+1,c.body);[[-6,5],[-7,5],[-8,5],[-9,6],[-10,6],[-11,7],[-12,8]].forEach(([v,S],R)=>{const x=R<3?1:0;l.box(-x,S,v,x,S+(R<4?1:0),v,c.body),R%2===0&&R<5&&l.set(0,S+2,v,c.dark)}),h.tailTip==="leaf"?(l.box(-1,8,-13,1,9,-13,c.wing),l.set(0,10,-13,c.wing),l.set(0,8,-14,c.wing)):h.tailTip==="club"?l.box(-1,7,-13,1,9,-14,c.dark):h.tailTip==="blade"&&(l.set(0,9,-13,c.accent),l.set(0,10,-13,c.accent),l.set(0,8,-14,c.accent),l.set(0,9,-14,c.accent));const w=-2,E=7,y=1;function k(v,S,R,x){for(let L=1;L<=v;L++){const B=E+Math.round(L*S),V=y-Math.round(L*R),H=y+1-(L>v-2?1:0);for(let N=V;N<=H;N++){let q=c.wing;N===H?q=c.dark:(N-V)%3===0&&L>1&&(q=c.wingVein),l.set(w-L,B,N,q)}L===1&&l.set(w-L,B-1,y,c.dark)}const b=w-v-1,D=E+Math.round(v*S);x==="claw"&&(l.set(b,D,y+1,c.tooth),l.set(b,D+1,y+1,c.dark)),x==="spike"&&(l.set(b,D+1,y,c.accent),l.set(b-1,D+2,y,c.accent))}return h.wing==="leaf"&&k(8,.7,.9,"claw"),h.wing==="stub"&&k(4,.5,.6,"claw"),h.wing==="plate"&&k(6,.8,.7,"spike"),l.mirror(),l.list()}function n(h,l){const c=parseInt(h.slice(1),16),f=Math.min(255,Math.round((c>>16&255)*l)),g=Math.min(255,Math.round((c>>8&255)*l)),_=Math.min(255,Math.round((c&255)*l));return"#"+(f<<16|g<<8|_).toString(16).padStart(6,"0")}function i(h){const l=new e,c=Object.assign({},h.colors,{body:n(h.colors.body,.88),dark:n(h.colors.dark,.85),eye:h.colors.eye,glow:n(h.colors.eye,1.15)}),f=h.seed+7;for(let v=-8;v<=8;v++){const S=Math.abs(v)>=8?1:Math.abs(v)>=6?2:3,R=11-(Math.abs(v)>=6?1:0)-(Math.abs(v)>=8?1:0);for(let x=-S;x<=S;x++)for(let b=5;b<=R;b++){let D=c.body;b<=6&&Math.abs(x)<=1?D=c.belly:b===R&&s(x,b,v,f)<h.scaleNoise+.15&&(D=c.dark),h.armor&&b>=9&&Math.abs(x)===S&&(v+8)%3===0&&(D=c.dark),h.plates&&b===R&&(v+8)%2===0&&(D=c.accent),l.set(x,b,v,D)}}for(let v=-8;v<=6;v++){const S=(v+8)%2===0?2:1;for(let R=1;R<=S;R++)l.set(0,11+R,v,h.spineStyle==="blade"?c.accent:c.dark)}l.box(-4,9,1,-4,10,3,c.dark),l.box(-4,11,2,-4,11,2,c.accent);const g=[[9,8],[10,9],[11,10],[12,11],[13,12]];for(const[v,S]of g)l.box(-2,S,v,2,S+2,v,c.body),l.box(-1,S,v,1,S,v,c.belly),l.set(0,S+3,v,c.dark);const _=14,m=12;l.box(-2,m,_,2,m+3,_+4,c.body),l.box(-2,m+4,_+1,2,m+4,_+3,c.dark),l.box(-2,m,_+5,2,m+2,_+8,c.body),l.box(-2,m-1,_+5,2,m-1,_+8,c.belly);for(const v of[-2,2])l.set(v,m+3,_+3,c.glow),l.set(v,m+3,_+4,c.eyeDark),l.set(v,m+2,_+3,c.eye);l.set(-2,m+2,_+8,c.dark),l.set(2,m+2,_+8,c.dark);for(let v=_+5;v<=_+8;v++){const S=v%2===0?-2:2;l.set(S,m-2,v,c.tooth),l.set(-S,m-1,v,c.tooth)}if(l.set(-2,m-2,_+8,c.tooth),l.set(2,m-2,_+8,c.tooth),l.set(0,m-3,_+8,c.dark),h.horn==="spiky")for(const v of[-2,2])[[0,0],[1,-1],[2,-2],[3,-3],[4,-4]].forEach(([S,R],x)=>l.set(v+(v<0?-Math.floor(x/2):Math.floor(x/2)),m+4+S,_+R,c.accent)),l.set(v+(v<0?-2:2),m+9,_-4,c.wing),l.set(v+(v<0?-1:1),m+7,_-1,c.wing);else if(h.horn==="ears"){for(const v of[-3,3])l.box(v,m+2,_-1,v,m+6,_+2,c.dark),l.set(v,m+7,_+1,c.dark);l.box(-1,m+4,_+3,1,m+6,_+3,c.accent),l.set(0,m+7,_+3,c.accent)}else if(h.horn==="blade"){for(const v of[-1,1])[[0,0],[1,-1],[2,-2],[3,-3],[4,-4],[5,-5],[5,-6]].forEach(([S,R])=>l.set(v,m+4+S,_+R,c.accent));for(const v of[-3,3])l.set(v,m+3,_+1,c.accent),l.set(v,m+4,_,c.accent),l.set(v,m+5,_-1,c.accent)}for(const[v,S]of[[-3,5],[-3,-6]]){l.box(v,1,S,v+1,5,S+1,c.body),h.bulky,l.box(v-1,4,S,v-1,6,S+1,c.body),l.box(v,0,S-1,v+1,0,S+2,c.dark);for(const R of[S-1,S+1,S+3])l.set(v,0,R+(R===S+3,0),c.tooth);l.set(v+1,0,S+3,c.tooth)}if([[-9,6,2],[-10,6,2],[-11,6,1],[-12,7,1],[-13,7,1],[-14,8,1],[-15,9,0],[-16,10,0],[-17,11,0],[-18,12,0]].forEach(([v,S,R],x)=>{l.box(-R,S,v,R,S+(R?1:0),v,c.body),x%2===0&&l.set(0,S+(R?2:1),v,c.dark)}),h.tailTip==="leaf")l.box(-2,12,-19,2,14,-19,c.wing),l.box(-1,15,-19,1,15,-19,c.wing),l.set(0,13,-20,c.wingVein),l.set(0,16,-19,c.wing);else if(h.tailTip==="club")l.box(-2,11,-19,2,14,-21,c.dark),l.set(0,15,-20,c.dark),l.set(-2,12,-22,c.tooth),l.set(2,12,-22,c.tooth);else if(h.tailTip==="blade"){for(let v=0;v<=4;v++)l.set(0,12+v,-19-Math.floor(v/2),c.accent);l.set(0,11,-19,c.accent),l.set(0,13,-21,c.accent)}const w=-3,E=10,y=1;function k(v,S,R,x){for(let L=1;L<=v;L++){const B=E+Math.round(L*S),V=y-Math.round(L*R)-1,H=y+2-(L>v-3?Math.ceil((L-(v-3))/2):0);for(let N=V;N<=H;N++){let q=c.wing;N===H||N===H-1&&L<=2?q=c.dark:(N-V)%4===0&&L>1?q=c.wingVein:L===v&&N===V&&(q=c.dark),l.set(w-L,B,N,q)}L<=2&&l.box(w-L,B-1,y,w-L,B-1,y+1,c.dark),L%4===0&&(l.set(w-L,B,V-1,c.dark),l.set(w-L,B-1,V-1,c.tooth))}const b=w-v-1,D=E+Math.round(v*S);x==="claw"&&(l.set(b,D,y+2,c.dark),l.set(b-1,D,y+2,c.tooth),l.set(b,D+1,y+1,c.dark)),x==="spike"&&(l.set(b,D+1,y+1,c.accent),l.set(b-1,D+2,y+1,c.accent),l.set(b-2,D+3,y+1,c.accent))}return h.wing==="leaf"&&k(14,.6,1,"claw"),h.wing==="stub"&&k(9,.5,.8,"claw"),h.wing==="plate"&&k(12,.8,.8,"spike"),l.mirror(),l.list()}function r(h,l){return l==="adult"?i(h):t(h)}const o={wood:{id:"wood",name:"나무 드래곤",tier:1,colorName:"갈색",recipe:"나무 원목 5, 나무 묘목 1~2, 나뭇잎 2",signature:"나무 세우기",beam:"약한 녹색 빔",seed:11,scaleNoise:.25,horn:"spiky",wing:"leaf",tailTip:"leaf",spineStyle:"thorn",bulky:!1,colors:{body:"#8B5A2B",belly:"#C9A066",dark:"#5C3A1A",accent:"#3E2A14",wing:"#5CA83A",wingVein:"#3F7F28",eye:"#D9F25A",eyeDark:"#1F2A0F",tooth:"#F4EFE1"}},earth:{id:"earth",name:"대지 드래곤",tier:2,colorName:"회색",recipe:"흙 2, 돌 2",signature:"흙과 돌 떨어뜨리기",beam:"약한 회색 빔",seed:22,scaleNoise:.4,horn:"ears",wing:"stub",tailTip:"club",spineStyle:"thorn",bulky:!0,armor:!0,colors:{body:"#7F7F7F",belly:"#B0B0B0",dark:"#555555",accent:"#6B4A2B",wing:"#8E8E8E",wingVein:"#6A6A6A",eye:"#F2B84B",eyeDark:"#2A1E0A",tooth:"#F4EFE1"}},iron:{id:"iron",name:"철 드래곤",tier:3,colorName:"은색",recipe:"철 2",signature:"철 블록 날리기",beam:"약간 센 은색 빔",seed:33,scaleNoise:.15,horn:"blade",wing:"plate",tailTip:"blade",spineStyle:"blade",bulky:!1,plates:!0,colors:{body:"#9AA4AD",belly:"#CDD5DB",dark:"#5F6A73",accent:"#3F4A53",wing:"#B7C1C9",wingVein:"#7F8B94",eye:"#57D3F5",eyeDark:"#0D2B36",tooth:"#F7FAFC"}},cake:{id:"cake",name:"케이크 드래곤",tier:4,colorName:"분홍·크림",recipe:"케이크 2",signature:"케이크 던지기",beam:"달콤한 분홍 빔",seed:44,scaleNoise:.2,horn:"ears",wing:"stub",tailTip:"club",spineStyle:"thorn",bulky:!0,colors:{body:"#F4A7C3",belly:"#FFF3E0",dark:"#C9789A",accent:"#8B2E52",wing:"#FFE08A",wingVein:"#D9A93E",eye:"#FF4F79",eyeDark:"#4A1020",tooth:"#FFFFFF"}},gold:{id:"gold",name:"금 드래곤",tier:5,colorName:"금색",recipe:"금 2",signature:"금 블록 소환",beam:"눈부신 금빛 빔",seed:55,scaleNoise:.15,horn:"blade",wing:"plate",tailTip:"blade",spineStyle:"blade",bulky:!1,plates:!0,colors:{body:"#E2B32B",belly:"#FFE27A",dark:"#B8860B",accent:"#8A6508",wing:"#F5D66B",wingVein:"#B8860B",eye:"#FF6F3C",eyeDark:"#3A1A00",tooth:"#FFF8E1"}},diamond:{id:"diamond",name:"다이아몬드 드래곤",tier:6,colorName:"하늘·청록",recipe:"다이아몬드 2",signature:"다이아몬드 창",beam:"반짝이는 청록 빔",seed:77,scaleNoise:.15,horn:"blade",wing:"plate",tailTip:"blade",spineStyle:"blade",bulky:!1,plates:!0,colors:{body:"#5FD3E6",belly:"#C8F7FF",dark:"#2FA3B8",accent:"#1B6C7D",wing:"#9FE9F5",wingVein:"#3FB6CC",eye:"#FFFFFF",eyeDark:"#0B3A44",tooth:"#FFFFFF"}},netherite:{id:"netherite",name:"네더라이트 드래곤",tier:7,colorName:"어두운 갈색·금",recipe:"네더라이트 2",signature:"네더라이트 갑옷",beam:"무거운 검붉은 빔",seed:88,scaleNoise:.3,horn:"blade",wing:"plate",tailTip:"blade",spineStyle:"blade",bulky:!0,armor:!0,plates:!0,colors:{body:"#4A3B3F",belly:"#6B5A5F",dark:"#2C2124",accent:"#B58B5A",wing:"#5A484D",wingVein:"#8A6B4A",eye:"#FF9A3C",eyeDark:"#2A0F00",tooth:"#E8E0DA"}},fire:{id:"fire",name:"화염 드래곤",tier:8,colorName:"빨강·주황",recipe:"용암 양동이 1, 블레이즈 막대기 2, 가스트의 눈물 1",signature:"불 뿜기",beam:"뜨거운 주황 빔",seed:99,scaleNoise:.3,horn:"spiky",wing:"leaf",tailTip:"blade",spineStyle:"thorn",bulky:!1,colors:{body:"#E0562A",belly:"#FFB347",dark:"#A83415",accent:"#FFE04D",wing:"#FF7A2A",wingVein:"#B53A0C",eye:"#FFF176",eyeDark:"#4A1500",tooth:"#FFF3E0"}},ice:{id:"ice",name:"아이스 드래곤",tier:9,colorName:"하늘·하양",recipe:"얼음 2, 눈 블록 2",signature:"얼리기",beam:"차가운 하늘색 빔",seed:111,scaleNoise:.2,horn:"spiky",wing:"plate",tailTip:"blade",spineStyle:"blade",bulky:!1,colors:{body:"#8FD3F4",belly:"#E6F9FF",dark:"#5AA9D6",accent:"#FFFFFF",wing:"#BFEAFF",wingVein:"#7FC4E8",eye:"#1F5FBF",eyeDark:"#0A2A5C",tooth:"#FFFFFF"}},water:{id:"water",name:"워터 드래곤",tier:10,colorName:"파랑",recipe:"물 양동이 1",signature:"물살",beam:"푸른 물 빔",seed:122,scaleNoise:.25,horn:"ears",wing:"leaf",tailTip:"club",spineStyle:"thorn",bulky:!1,colors:{body:"#2F80D6",belly:"#8CC8FF",dark:"#1F5AA0",accent:"#1B3F73",wing:"#5CA9F0",wingVein:"#2F6FB8",eye:"#B3FFF7",eyeDark:"#062B4A",tooth:"#EAF6FF"}},time:{id:"time",name:"타임 드래곤",tier:11,colorName:"청동",recipe:"시계 4",signature:"시간 멈추기",beam:"반짝이는 청동 빔",seed:133,scaleNoise:.2,horn:"ears",wing:"stub",tailTip:"club",spineStyle:"thorn",bulky:!1,colors:{body:"#B08D57",belly:"#E6D3A3",dark:"#7A5C2E",accent:"#3F2E12",wing:"#D4B36A",wingVein:"#8C6D35",eye:"#37E0FF",eyeDark:"#0B2A33",tooth:"#F4EFE1"}},teleport:{id:"teleport",name:"텔레포트 드래곤",tier:12,colorName:"검정·연보라",recipe:"엔더 진주 2",signature:"순간이동",beam:"보라 빔",seed:144,scaleNoise:.3,horn:"spiky",wing:"leaf",tailTip:"blade",spineStyle:"thorn",bulky:!1,colors:{body:"#1A1A22",belly:"#3D2B4F",dark:"#0D0D12",accent:"#9B59FF",wing:"#2B1F3D",wingVein:"#B47CFF",eye:"#D65CFF",eyeDark:"#2A0A4A",tooth:"#EDE7F6"}},healing:{id:"healing",name:"치유 드래곤",tier:13,colorName:"분홍·빨강",recipe:"치유의 물약 6",signature:"치유",beam:"따뜻한 분홍 빔",seed:155,scaleNoise:.15,horn:"ears",wing:"leaf",tailTip:"club",spineStyle:"thorn",bulky:!1,colors:{body:"#F06292",belly:"#FFD6E3",dark:"#C2185B",accent:"#FFFFFF",wing:"#FF9EBE",wingVein:"#D8467A",eye:"#7CFFB2",eyeDark:"#0D3D22",tooth:"#FFFFFF"}},earthquake:{id:"earthquake",name:"어스퀘이크 드래곤",tier:14,colorName:"갈색·주황",recipe:"곡괭이 6종",signature:"지진",beam:"땅을 흔드는 갈색 빔",seed:166,scaleNoise:.4,horn:"ears",wing:"stub",tailTip:"club",spineStyle:"thorn",bulky:!0,armor:!0,colors:{body:"#8D6E4A",belly:"#C9A97A",dark:"#5A4229",accent:"#E08A2E",wing:"#A67C52",wingVein:"#6E4E2E",eye:"#FFB300",eyeDark:"#3A2000",tooth:"#F4EFE1"}},explosion:{id:"explosion",name:"폭발 드래곤",tier:15,colorName:"빨강·검정",recipe:"TNT 2, 위더 스켈레톤 머리 3",signature:"폭발",beam:"터지는 빨간 빔",seed:177,scaleNoise:.35,horn:"spiky",wing:"leaf",tailTip:"blade",spineStyle:"thorn",bulky:!0,colors:{body:"#B71C1C",belly:"#E57373",dark:"#7F0000",accent:"#212121",wing:"#D32F2F",wingVein:"#7F0000",eye:"#FFEB3B",eyeDark:"#3A2A00",tooth:"#F4EFE1"}},ender:{id:"ender",name:"엔더 드래곤",tier:16,colorName:"검정·보라",recipe:"드래곤의 숨결 4, 엔더 드래곤의 알 1",signature:"드래곤의 숨결 뿌리기",beam:"가장 강력한 보라·검정 빔",seed:66,scaleNoise:.35,horn:"blade",wing:"plate",tailTip:"blade",spineStyle:"blade",bulky:!0,armor:!0,plates:!0,colors:{body:"#1E1B24",belly:"#3A2F4A",dark:"#0F0D14",accent:"#5B2E91",wing:"#2A2136",wingVein:"#6D3FB3",eye:"#E040FB",eyeDark:"#3A0F5C",tooth:"#EDE7F6"},_note:"우리 게임의 엔더 드래곤 — 아들 설계(티어 16, 검정·보라 빔, 엔더맨 군대)를 우리 생성기 골격으로 만든 자체 디자인"}};function a(h,l){const c=o[h];return l=l||"baby",{...d(c),stage:l,voxels:r(c,l)}}function u(h){const l=o[h];return{...d(l),baby:r(l,"baby"),adult:r(l,"adult")}}function d(h){const{seed:l,scaleNoise:c,horn:f,wing:g,tailTip:_,spineStyle:m,bulky:p,armor:w,plates:E,colors:y,...k}=h;return{...k,colors:y}}return{DRAGONS:o,build:r,model:a,modelBoth:u,stages:["baby","adult"],ids:Object.keys(o)}});const or=globalThis.DragonVoxels,Hl=new Map;function cA(s,e){const t=`${s}/${e}`;let n=Hl.get(t);if(!n){const i=or?.DRAGONS[s]??or?.DRAGONS.wood;n=or&&i?or.build(i,e):[],Hl.set(t,n)}return n}const Wl=[{n:[1,0,0],shade:.78,corners:[[1,0,0],[1,1,0],[1,1,1],[1,0,1]]},{n:[-1,0,0],shade:.72,corners:[[0,0,1],[0,1,1],[0,1,0],[0,0,0]]},{n:[0,1,0],shade:1,corners:[[0,1,0],[0,1,1],[1,1,1],[1,1,0]]},{n:[0,-1,0],shade:.5,corners:[[0,0,1],[0,0,0],[1,0,0],[1,0,1]]},{n:[0,0,1],shade:.88,corners:[[0,0,1],[1,0,1],[1,1,1],[0,1,1]]},{n:[0,0,-1],shade:.84,corners:[[1,0,0],[0,0,0],[0,1,0],[1,1,0]]}];function Da(s,e,t){const n=new Set(s.map(d=>`${d.x},${d.y},${d.z}`)),i=[],r=[],o=[],a=new Je;for(const d of s){a.set(d.c);for(let h=0;h<Wl.length;h++){const l=Wl[h];if(n.has(`${d.x+l.n[0]},${d.y+l.n[1]},${d.z+l.n[2]}`))continue;const c=t?.[h]??l.shade,f=i.length/3;for(const[g,_,m]of l.corners)i.push((d.x+g)*e,(d.y+_)*e,(d.z+m)*e),r.push(a.r*c,a.g*c,a.b*c);o.push(f,f+1,f+2,f,f+2,f+3)}}const u=new Wt;return u.setAttribute("position",new Dt(i,3)),u.setAttribute("color",new Dt(r,3)),u.setIndex(o),u.translate(-.5*e,0,-.5*e),u.computeBoundingBox(),u}const dA=1/16,Xl=new Map;function _d(s,e){const t=`${s}/${e}`;let n=Xl.get(t);return n||(n=Da(cA(s,e),dA),Xl.set(t,n)),n}const vd=new Zt({vertexColors:!0});function Ad(s,e){return new mt(_d(s,e),vd)}class hA{group=new Mt;mesh=null;t=0;constructor(e){this.group.visible=!1,e.add(this.group)}get active(){return this.mesh!==null}set(e){this.mesh&&(this.group.remove(this.mesh),this.mesh=null),e&&(this.mesh=Ad(e,"adult"),this.group.add(this.mesh)),this.group.visible=e!==null}update(e,t){this.mesh&&(this.t+=t,this.group.position.set(e.pos.x,e.pos.y-yc,e.pos.z),this.group.rotation.y=e.yaw+Math.PI,this.mesh.scale.set(1,1+.015*Math.sin(this.t*2.5),1))}}class uA{group=new Mt;entries=new Map;t=0;constructor(e){e.add(this.group)}get visible(){return this.group.visible}set visible(e){this.group.visible=e}get count(){return this.entries.size}sync(e){const t=new Set;for(const n of e){t.add(n.id);const i=this.entries.get(n.id);if(i&&i.info.stage===n.stage&&i.info.perch.x===n.perch.x&&i.info.perch.z===n.perch.z&&i.info.owner===n.owner){i.info=n;continue}i&&this.dispose(i),this.entries.set(n.id,this.make(n))}for(const[n,i]of this.entries)t.has(n)||(this.dispose(i),this.entries.delete(n))}make(e){const t=_d(e.dragon,e.stage),n=new mt(t,vd),i=t.boundingBox?t.boundingBox.max.y:1,r=new Mt;r.add(n);const o=ua(e.owner,e.mine?"rgba(40,120,40,0.55)":"rgba(0,0,0,0.45)",.28);return o.position.y=i+.25,r.add(o),r.position.set(e.perch.x+.5,e.perch.y,e.perch.z+.5),r.rotation.y=e.yaw,this.group.add(r),{info:e,group:r,mesh:n,label:o,phase:e.id*1.7%(Math.PI*2),height:i}}dispose(e){this.group.remove(e.group),e.label.material.map?.dispose(),e.label.material.dispose()}update(e){if(!(!this.group.visible||this.entries.size===0)){this.t+=e;for(const t of this.entries.values()){const n=this.t+t.phase,i=1+.025*Math.sin(n*1.6);t.mesh.scale.set(1,i,1);const r=Math.max(0,Math.sin(n*.9))**8;t.group.position.y=t.info.perch.y+r*(t.info.stage==="adult"?.12:.08),t.group.rotation.y=t.info.yaw+.18*Math.sin(n*.35)}}}}const Yl=.05,fA=new Je(1,.86,.68),ql=new Je;function pA(s,e,t){const n=Dc(s)/15*e,i=Pc(s)/15,r=Yl+(1-Yl)*Math.pow(Math.max(n,i),1.5);return t.set(16777215).lerp(fA,Math.max(0,Math.min(1,i-n))),r}const ar=32*pn;function Ui(s,e){const t=Da(s,pn,wc);return t.translate(pn/2,0,pn/2),new mt(t,e)}function ua(s,e="rgba(0,0,0,0.45)",t=.55){const n=document.createElement("canvas"),i=n.getContext("2d");i.font="bold 40px system-ui, sans-serif";const r=Math.ceil(i.measureText(s).width)+32;n.width=r,n.height=56,i.font="bold 40px system-ui, sans-serif",i.fillStyle=e,i.fillRect(0,0,r,56),i.fillStyle="#fff",i.textBaseline="middle",i.fillText(s,16,30);const o=new od(n);o.minFilter=fn;const a=new sd(new nd({map:o,depthTest:!0,transparent:!0}));return a.scale.set(r/56*t,t,1),a}class mA{group=new Mt;figures=new Map;constructor(e){e.add(this.group)}get count(){return this.figures.size}upsert(e){this.remove(e.idx);const t=Ec(Od(e.color)),n=new Zt({vertexColors:!0}),i=new Mt,r=new Mt,o=(g,_)=>(g.position.set(_[0]*pn,_[1]*pn,0),g),a=o(Ui(t.torso,n),mi.torso),u=o(Ui(t.head,n),mi.head),d=o(Ui(t.leg,n),mi.legL),h=o(Ui(t.leg,n),mi.legR),l=o(Ui(t.arm,n),mi.armL),c=o(Ui(t.arm,n),mi.armR);r.add(a,u,d,h,l,c),i.add(r);const f=ua(e.nick);f.position.y=ar+.3,i.add(f),i.position.set(e.x,e.y,e.z),r.rotation.y=e.yaw,this.group.add(i),this.figures.set(e.idx,{info:e,group:i,body:r,label:f,head:u,legL:d,legR:h,armL:l,armR:c,target:{x:e.x,y:e.y,z:e.z,yaw:e.yaw,pitch:e.pitch,flags:0},cur:{x:e.x,y:e.y,z:e.z,yaw:e.yaw},walk:0,lastMove:0,bubble:null,mount:null,material:n,lum:1}),e.riding&&this.setMount(e.idx,e.riding)}setMount(e,t){const n=this.figures.get(e);if(n&&(n.mount&&(n.body.remove(n.mount),n.mount=null),t)){const i=Ad(t.dragon,"adult");i.material=n.material,i.position.y=-yc,i.rotation.y=Math.PI,n.body.add(i),n.mount=i}}say(e,t,n=3){const i=this.figures.get(e);if(!i)return;this.clearBubble(i);const r=ua(t,"rgba(255,255,255,0.92)");r.material.color.setHex(2236979),r.position.y=ar+.8,i.group.add(r),i.bubble={sprite:r,until:performance.now()+n*1e3}}clearBubble(e){e.bubble&&(e.group.remove(e.bubble.sprite),e.bubble.sprite.material.map?.dispose(),e.bubble.sprite.material.dispose(),e.bubble=null)}remove(e){const t=this.figures.get(e);t&&(this.clearBubble(t),this.setMount(e,null),this.group.remove(t.group),t.material.dispose(),t.group.traverse(n=>{n instanceof mt&&n.geometry.dispose(),n instanceof sd&&(n.material.map?.dispose(),n.material.dispose())}),this.figures.delete(e))}indices(){return[...this.figures.keys()]}nickOf(e){return this.figures.get(e)?.info.nick}setState(e,t){for(const n of e){if(n.idx===t)continue;const i=this.figures.get(n.idx);i&&(i.target.x=n.x,i.target.y=n.y,i.target.z=n.z,i.target.yaw=n.yaw,i.target.pitch=n.pitch,i.target.flags=n.flags)}}update(e,t,n=1){const i=1-Math.exp(-e*14);for(const r of this.figures.values()){const o=r.cur,a=r.target,u=a.x-o.x,d=a.z-o.z;o.x+=u*i,o.y+=(a.y-o.y)*i,o.z+=d*i;let h=a.yaw-o.yaw;h=Math.atan2(Math.sin(h),Math.cos(h)),o.yaw+=h*i,r.group.position.set(o.x,o.y,o.z),r.body.rotation.y=o.yaw,r.head.rotation.x=-a.pitch*.6;const l=Math.hypot(u,d)*14;l>.3&&(r.walk+=e*Math.min(12,l*2.2));const c=(a.flags&Mc)!==0,f=l>.3&&!c?Math.sin(r.walk)*.55:0;r.legL.rotation.x=f,r.legR.rotation.x=-f,r.armL.rotation.x=-f,r.armR.rotation.x=f;const g=(a.flags&Sc)!==0;if(r.body.scale.y=g?.85:1,r.label.position.y=(g?ar*.85:ar)+.3,t){const _=pA(t.get(Math.floor(o.x),Math.floor(o.y+1),Math.floor(o.z)),n,ql);r.lum+=(_-r.lum)*i,r.material.color.copy(ql).multiplyScalar(r.lum)}r.bubble&&performance.now()>r.bubble.until&&this.clearBubble(r)}}dispose(){for(const e of[...this.figures.keys()])this.remove(e)}}const hn={w:.6,h:1.8},Kl=1.62,gA=1.27,Ql=4.317,_A=5.612,vA=1.31,AA=2.2,xA=32,jl=9,bA=9,Jl=6,lr=1/60,yA=1,EA=1.3,MA=14,Zl=89.5*Math.PI/180;class SA{constructor(e,t,n,i=0){this.world=e,this.registry=t,this.pos={...n},this.spawn={...n},this.yaw=i}world;registry;pos;vel={x:0,y:0,z:0};yaw=0;pitch=0;onGround=!1;sneaking=!1;sprinting=!1;inWater=!1;riding=!1;eyeHeight=Kl;walkCycle=0;horizontalSpeed=0;stepCamOffset=0;accumulator=0;moveOut={onGround:!1,hitX:!1,hitY:!1,hitZ:!1,hitCeiling:!1};spawn;isSolid=(e,t,n)=>this.registry.isSolid(this.world.getBlock(e,t,n));isWaterAt(e,t,n){return this.registry.get(this.world.getBlock(Math.floor(e),Math.floor(t),Math.floor(n))).fluid!==null}respawn(){this.pos.x=this.spawn.x,this.pos.y=this.spawn.y,this.pos.z=this.spawn.z,this.vel.x=this.vel.y=this.vel.z=0}applyLook(e,t){this.yaw-=e,this.pitch=Math.max(-Zl,Math.min(Zl,this.pitch-t)),this.yaw>Math.PI?this.yaw-=Math.PI*2:this.yaw<-Math.PI&&(this.yaw+=Math.PI*2)}get eye(){return{x:this.pos.x,y:this.pos.y+this.eyeHeight,z:this.pos.z}}get lookDir(){const e=Math.cos(this.pitch);return{x:-e*Math.sin(this.yaw),y:Math.sin(this.pitch),z:-e*Math.cos(this.yaw)}}update(e,t){for(this.applyLook(e.lookDX,e.lookDY),this.accumulator=Math.min(this.accumulator+t,lr*8);this.accumulator>=lr;)this.step(e,lr),this.accumulator-=lr}step(e,t){const n=this.pos,i=this.vel;this.inWater=this.isWaterAt(n.x,n.y+.2,n.z)||this.isWaterAt(n.x,n.y+this.eyeHeight-.1,n.z),this.sneaking=e.sneak&&!this.inWater&&!this.riding,this.sprinting=e.sprint&&e.moveZ>.5&&!this.sneaking;const r=Math.sin(this.yaw),o=Math.cos(this.yaw);let a=o*e.moveX-r*e.moveZ,u=-r*e.moveX-o*e.moveZ;const d=Math.hypot(a,u);d>1&&(a/=d,u/=d);const h=this.riding?bA:this.inWater?AA:this.sneaking?vA:this.sprinting?_A:Ql,l=this.riding?8:this.inWater?6:this.onGround?18:3.5,c=Math.min(1,l*t);if(i.x+=(a*h-i.x)*c,i.z+=(u*h-i.z)*c,this.riding){const v=e.jump?Jl:e.sneak?-Jl:0;i.y+=(v-i.y)*Math.min(1,8*t)}else if(this.inWater)if(e.jump&&this.onGround&&!this.isWaterAt(n.x,n.y+1,n.z))i.y=jl,this.onGround=!1;else{const v=(this.moveOut.hitX||this.moveOut.hitZ)&&(e.moveX!==0||e.moveZ!==0),S=e.jump||v?4:-2.2;i.y+=(S-i.y)*Math.min(1,6*t)}else i.y-=xA*t,i.y<-78&&(i.y=-78),e.jump&&this.onGround&&(i.y=jl,this.onGround=!1);const f=this.onGround,g=n.x,_=n.y,m=n.z,p=i.x,w=i.z;if(ur(this.isSolid,n,hn,i,t,this.moveOut),this.onGround=this.moveOut.onGround,!this.riding&&!this.sneaking&&(f||this.inWater)&&(this.moveOut.hitX||this.moveOut.hitZ)){const v=Xh(this.isSolid,{x:g,y:_,z:m},n,hn,p,w,t,this.inWater?EA:yA);v&&(i.x=v.vx,i.z=v.vz,i.y=0,this.onGround=!0,this.stepCamOffset-=v.dy)}if(this.stepCamOffset+=(0-this.stepCamOffset)*Math.min(1,MA*t),Math.abs(this.stepCamOffset)<.002&&(this.stepCamOffset=0),this.sneaking&&f&&!Br(this.isSolid,n,hn)){const v=n.x;n.x=g,Br(this.isSolid,n,hn)||(n.x=v,n.z=m,Br(this.isSolid,n,hn)||(n.x=g)),i.x=i.z=0,this.onGround=!0}const E=hn.w/2+.001;n.x<E?(n.x=E,i.x=0):n.x>this.world.sizeX-E&&(n.x=this.world.sizeX-E,i.x=0),n.z<E?(n.z=E,i.z=0):n.z>this.world.sizeZ-E&&(n.z=this.world.sizeZ-E,i.z=0),n.y<-24&&this.respawn();const y=this.sneaking?gA:Kl;this.eyeHeight+=(y-this.eyeHeight)*Math.min(1,22*t);const k=Math.hypot(i.x,i.z);this.horizontalSpeed=k,this.onGround&&k>.4&&(this.walkCycle+=k*t*1.9)}applyToCamera(e,t){const n=this.eye,r=(this.onGround&&this.horizontalSpeed>.4?Math.min(1,this.horizontalSpeed/Ql):0)*t;e.position.set(n.x,n.y+this.stepCamOffset-Math.abs(Math.cos(this.walkCycle))*.045*r,n.z),e.rotation.order="YXZ",e.rotation.set(this.pitch,this.yaw,Math.sin(this.walkCycle)*.006*r)}}const wr=new Je(8103167),fa=new Je(12638463),$l=.05,wA=`
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
  float lum = ${$l.toFixed(2)} + ${(1-$l).toFixed(2)} * pow(l, 1.5);
  vec3 warm = mix(vec3(1.0), vec3(1.0, 0.86, 0.68), clamp(blk - sky, 0.0, 1.0));
  vLight = lum * warm;

  vUvw = vec3(uv, meta.x);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`,TA=`
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
`;function CA(s){const e=(o,a={})=>new yn({glslVersion:yr,vertexShader:wA,fragmentShader:TA,uniforms:{uTex:{value:s},uFogColor:{value:fa.clone()},uFogNear:{value:60},uFogFar:{value:120},uSkyLight:{value:1},uCutout:{value:o},uTime:{value:0}},...a}),t=e(1,{side:Un}),n=e(0,{transparent:!0,depthWrite:!1,side:Jt}),i=e(1);i.uniforms.uFogNear.value=1e5,i.uniforms.uFogFar.value=1e6;const r=[t,n,i];return{opaque:t,translucent:n,hand:i,setFog(o,a){t.uniforms.uFogNear.value=o,t.uniforms.uFogFar.value=a,n.uniforms.uFogNear.value=o,n.uniforms.uFogFar.value=a},setTime(o){for(const a of r)a.uniforms.uTime.value=o},setSkyLight(o){for(const a of r)a.uniforms.uSkyLight.value=o},dispose(){for(const o of r)o.dispose()}}}function xd(s,e,t){const n=new Wt;return n.setAttribute("position",new It(s.positions,3)),n.setAttribute("uv",new It(s.uvs,2)),n.setAttribute("meta",new It(s.meta,4)),n.setIndex(new It(s.indices,1)),n.boundingSphere=new Dr(t,e),n}class RA{constructor(e,t,n,i,r){this.world=e,this.lights=t,this.materials=n,this.pool=i,r.add(this.group)}world;lights;materials;pool;group=new Mt;stats={meshed:0,lastMs:0,avgMs:0,maxMs:0,visibleChunks:0};renderDistance=8;maxPerFrame=2;burst=!0;entries=new Map;dirty=new Map;boundingRadius=Math.sqrt(3)*yt/2+.5;paddedScratch=null;get queued(){return this.dirty.size}get inflight(){return this.pool.inflight}markDirty(e,t,n){this.world.chunkInBounds(e,t,n)&&this.dirty.set(hr(e,t,n),{cx:e,cy:t,cz:n})}markDirtyAll(e){for(const t of e)this.markDirty(t.cx,t.cy,t.cz)}markAll(){this.world.forEachChunk(e=>this.markDirty(e.cx,e.cy,e.cz))}update(e,t,n){const i=Math.floor(e/yt),r=Math.floor(t/yt),o=Math.floor(n/yt);if(this.dirty.size>0){const u=this.burst?24:this.maxPerFrame,d=[...this.dirty.values()];d.length>1&&d.sort((l,c)=>{const f=(l.cx-i)**2+(l.cz-o)**2+(l.cy-r)**2,g=(c.cx-i)**2+(c.cz-o)**2+(c.cy-r)**2;return f-g});let h=0;for(const l of d){if(h>=u||this.pool.inflight>=this.pool.size*3)break;this.dirty.delete(hr(l.cx,l.cy,l.cz)),this.dispatch(l)&&h++}}else this.burst&&this.pool.inflight===0&&(this.burst=!1);let a=0;for(const u of this.entries.values()){const d=Math.abs(u.cx-i),h=Math.abs(u.cz-o),l=Math.max(d,h)<=this.renderDistance;u.opaque&&(u.opaque.visible=l),u.translucent&&(u.translucent.visible=l),l&&(u.opaque||u.translucent)&&a++}this.stats.visibleChunks=a}entry(e){const t=hr(e.cx,e.cy,e.cz);let n=this.entries.get(t);return n||(n={cx:e.cx,cy:e.cy,cz:e.cz,opaque:null,translucent:null,inflight:!1,redo:!1},this.entries.set(t,n)),n}dispatch(e){const t=this.entry(e),n=this.world.getChunk(e.cx,e.cy,e.cz);if(!n||n.isEmpty())return this.removeMesh(t,"opaque"),this.removeMesh(t,"translucent"),!1;if(t.inflight)return t.redo=!0,!1;t.inflight=!0;const i=n.version,r=this.world.buildPadded(e.cx,e.cy,e.cz,this.paddedScratch??void 0);this.paddedScratch=null;const o=this.lights.buildPaddedLight(e.cx,e.cy,e.cz);return this.pool.mesh(e.cx,e.cy,e.cz,r,o).then(a=>{t.inflight=!1,this.apply(t,a),(t.redo||n.version!==i)&&(t.redo=!1,this.markDirty(e.cx,e.cy,e.cz))},a=>{t.inflight=!1,console.error("메싱 실패",e,a)}),!0}apply(e,t){const n=this.stats;n.meshed++,n.lastMs=t.ms,n.avgMs=n.avgMs===0?t.ms:n.avgMs*.9+t.ms*.1,n.maxMs=Math.max(n.maxMs,t.ms);const i=new G(yt/2,yt/2,yt/2);for(const r of["opaque","translucent"]){const o=t.result[r];if(!o){this.removeMesh(e,r);continue}const a=xd(o,this.boundingRadius,i);let u=e[r];u?(u.geometry.dispose(),u.geometry=a):(u=new mt(a,r==="opaque"?this.materials.opaque:this.materials.translucent),u.position.set(e.cx*yt,e.cy*yt,e.cz*yt),u.matrixAutoUpdate=!1,u.updateMatrix(),u.renderOrder=r==="opaque"?0:10,e[r]=u,this.group.add(u))}}removeMesh(e,t){const n=e[t];n&&(this.group.remove(n),n.geometry.dispose(),e[t]=null)}dispose(){for(const e of this.entries.values())this.removeMesh(e,"opaque"),this.removeMesh(e,"translucent");this.entries.clear(),this.dirty.clear()}}const st=yt,ec=3/16,Fi=1/16,tc=10/16,nc=25*Math.PI/180,DA=7/16,ic=7/16,PA=3/16,cr=[[3,0,1],[2,1,8],[3,8,12],[4,12,14],[5,14,15],[6,15,16]],sc=[[0,0,-1],[0,0,1],[1,0,0],[1,0,0],[1,0,0],[-1,0,0]],rc=[[0,1,0],[0,1,0],[0,0,1],[0,0,1],[0,1,0],[0,1,0]],kA=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],LA=[[0,1,0],[1,-1,0],[4,0,1],[5,0,-1]];class oc{positions;uvs;meta;indices;vc=0;ic=0;constructor(e=512){this.positions=new Float32Array(e*4*3),this.uvs=new Float32Array(e*4*2),this.meta=new Uint8Array(e*4*4),this.indices=new Uint32Array(e*6)}ensure(){if((this.vc+4)*3<=this.positions.length)return;const e=t=>{const n=new t.constructor(t.length*2);return n.set(t),n};this.positions=e(this.positions),this.uvs=e(this.uvs),this.meta=e(this.meta),this.indices=e(this.indices)}quad(e,t,n){this.ensure();const i=this.vc;for(let a=0;a<4;a++){const u=e[a],d=(i+a)*3;this.positions[d]=u[0],this.positions[d+1]=u[1],this.positions[d+2]=u[2];const h=(i+a)*2;this.uvs[h]=u[3],this.uvs[h+1]=u[4];const l=(i+a)*4;this.meta[l]=t,this.meta[l+1]=u[5],this.meta[l+2]=n,this.meta[l+3]=u[6]??Bi}const r=e[0][5]+e[2][5]>e[1][5]+e[3][5],o=this.ic;r?(this.indices[o]=i+1,this.indices[o+1]=i+2,this.indices[o+2]=i+3,this.indices[o+3]=i+1,this.indices[o+4]=i+3,this.indices[o+5]=i):(this.indices[o]=i,this.indices[o+1]=i+1,this.indices[o+2]=i+2,this.indices[o+3]=i,this.indices[o+4]=i+2,this.indices[o+5]=i+3),this.vc+=4,this.ic+=6}build(){return this.vc===0?null:{positions:this.positions.slice(0,this.vc*3),uvs:this.uvs.slice(0,this.vc*2),meta:this.meta.slice(0,this.vc*4),indices:this.indices.slice(0,this.ic),vertexCount:this.vc,indexCount:this.ic}}}function IA(s,e,t){const n=new oc,i=new oc,r=new Int32Array(st*st),o=new Int32Array(st*st),a=new Int32Array(st*st),u=new Int32Array(st*st),d=[0,0,0],h=[0,0,0];let l=Bi;const c=(v,S,R,x,b,D)=>{h[0]=d[0],h[1]=d[1],h[2]=d[2],h[v]+=S,Qt(h[0],h[1],h[2]);const L=h[R],B=h[b];h[R]=L+x;const V=Qt(h[0],h[1],h[2]);h[R]=L,h[b]=B+D;const H=Qt(h[0],h[1],h[2]);h[R]=L+x;const N=Qt(h[0],h[1],h[2]),q=e[s[V]],C=e[s[H]],ee=e[s[N]],se=q!==void 0&&q.castAO,ae=C!==void 0&&C.castAO,Ne=ee!==void 0&&ee.castAO;return l=Bi,se&&ae?0:3-((se?1:0)+(ae?1:0)+(Ne?1:0))},f=(v,S,R)=>Bi,g=(v,S,R)=>{const x=e[R];return x?!(x.opaque||S===R&&v.sameCull||v.layer===us&&x.layer===us&&x.fluidKind===0):!0},_=(v,S,R,x,b,D)=>{const[L,B,V]=R,[H,N,q]=x;let C;switch(S){case 0:C=[[H,B,V],[H,B,q],[H,N,q],[H,N,V]];break;case 1:C=[[L,B,V],[L,B,q],[L,N,q],[L,N,V]];break;case 2:C=[[L,N,V],[H,N,V],[H,N,q],[L,N,q]];break;case 3:C=[[L,B,V],[H,B,V],[H,B,q],[L,B,q]];break;case 4:C=[[L,B,q],[H,B,q],[H,N,q],[L,N,q]];break;default:C=[[L,B,V],[H,B,V],[H,N,V],[L,N,V]]}const ee=kA[S],se=[C[1][0]-C[0][0],C[1][1]-C[0][1],C[1][2]-C[0][2]],ae=[C[3][0]-C[0][0],C[3][1]-C[0][1],C[3][2]-C[0][2]],Ne=[se[1]*ae[2]-se[2]*ae[1],se[2]*ae[0]-se[0]*ae[2],se[0]*ae[1]-se[1]*ae[0]];Ne[0]*ee[0]+Ne[1]*ee[1]+Ne[2]*ee[2]<0&&(C=[C[0],C[3],C[2],C[1]]);const be=sc[S],j=rc[S],Ee=C.map(Y=>[Y[0],Y[1],Y[2],Y[0]*be[0]+Y[1]*be[1]+Y[2]*be[2],Y[0]*j[0]+Y[1]*j[1]+Y[2]*j[2],3,D]);v.quad(Ee,b,S)},m=(v,S,R,x,b,D,L,B)=>_(v,S,[R,x+D,b],[R+1,x+L,b+1],B,f()),p=()=>{for(let v=0;v<st;v++)for(let S=0;S<st;S++)for(let R=0;R<st;R++){const x=e[s[Qt(R,v,S)]];if(x===void 0||x.panel===null)continue;const[b,D]=x.panel,L=[R,v,S],B=[R+1,v+1,S+1];D===0?B[b]=L[b]+ec:L[b]=B[b]-ec;const V=f();for(let H=0;H<6;H++)_(n,H,L,B,x.tex[H],V)}},w=()=>{for(let v=0;v<st;v++)for(let S=0;S<st;S++)for(let R=0;R<st;R++){const x=e[s[Qt(R,v,S)]];if(x===void 0||x.torch===null)continue;const b=f(),D=x.tex[0];if(x.torch<0){const Z=[R+.5-Fi,v,S+.5-Fi],re=[R+.5+Fi,v+tc,S+.5+Fi];for(let pe=0;pe<6;pe++)_(n,pe,Z,re,D,b);continue}const[L,B]=bc[x.torch],V=Math.sin(nc),H=Math.cos(nc),N=[-L*V,H,-B*V],q=[B,0,-L],C=[L*H,V,B*H],ee=R+.5+L*ic,se=v+PA,ae=S+.5+B*ic,Ne=(Z,re,pe)=>[ee+q[0]*Z+N[0]*re+C[0]*pe,se+q[1]*Z+N[1]*re+C[1]*pe,ae+q[2]*Z+N[2]*re+C[2]*pe],be=Z=>DA+(Z+Fi),j=Fi,Ee=tc,Y=(Z,re,pe)=>{let ne=Z.map((Pe,_e)=>{const We=Ne(Pe[0],Pe[1],Pe[2]);return[We[0],We[1],We[2],re[_e][0],re[_e][1]]});const ye=[ne[1][0]-ne[0][0],ne[1][1]-ne[0][1],ne[1][2]-ne[0][2]],et=[ne[3][0]-ne[0][0],ne[3][1]-ne[0][1],ne[3][2]-ne[0][2]],I=[ye[1]*et[2]-ye[2]*et[1],ye[2]*et[0]-ye[0]*et[2],ye[0]*et[1]-ye[1]*et[0]];I[0]*pe[0]+I[1]*pe[1]+I[2]*pe[2]<0&&(ne=[ne[0],ne[3],ne[2],ne[1]]);const Qe=Math.abs(pe[0])>=Math.abs(pe[1])&&Math.abs(pe[0])>=Math.abs(pe[2])?0:Math.abs(pe[1])>=Math.abs(pe[2])?1:2,Xe=Qe===0?pe[0]>0?0:1:Qe===1?pe[1]>0?2:3:pe[2]>0?4:5;n.quad(ne.map(Pe=>[Pe[0],Pe[1],Pe[2],Pe[3],Pe[4],3,b]),D,Xe)};Y([[j,0,-j],[j,0,j],[j,Ee,j],[j,Ee,-j]],[[be(-j),0],[be(j),0],[be(j),Ee],[be(-j),Ee]],q),Y([[-j,0,-j],[-j,0,j],[-j,Ee,j],[-j,Ee,-j]],[[be(-j),0],[be(j),0],[be(j),Ee],[be(-j),Ee]],[-q[0],-0,-q[2]]),Y([[-j,0,j],[j,0,j],[j,Ee,j],[-j,Ee,j]],[[be(-j),0],[be(j),0],[be(j),Ee],[be(-j),Ee]],C),Y([[-j,0,-j],[j,0,-j],[j,Ee,-j],[-j,Ee,-j]],[[be(-j),0],[be(j),0],[be(j),Ee],[be(-j),Ee]],[-C[0],-C[1],-C[2]]),Y([[-j,Ee,-j],[j,Ee,-j],[j,Ee,j],[-j,Ee,j]],[[be(-j),be(-j)],[be(j),be(-j)],[be(j),be(j)],[be(-j),be(j)]],N),Y([[-j,0,-j],[j,0,-j],[j,0,j],[-j,0,j]],[[be(-j),be(-j)],[be(j),be(-j)],[be(j),be(j)],[be(-j),be(j)]],[-N[0],-N[1],-N[2]])}},E=()=>{for(let v=0;v<st;v++)for(let S=0;S<st;S++)for(let R=0;R<st;R++){const x=e[s[Qt(R,v,S)]];if(x===void 0||!x.egg)continue;const b=f();for(let D=0;D<cr.length;D++){const[L,B,V]=cr[D],H=cr[D-1],N=cr[D+1],q=[R+L/16,v+B/16,S+L/16],C=[R+1-L/16,v+V/16,S+1-L/16];for(const ee of[0,1,4,5])_(n,ee,q,C,x.tex[ee],b);(!N||N[0]>L)&&_(n,2,q,C,x.tex[2],b),(!H||H[0]>L)&&_(n,3,q,C,x.tex[3],b)}}},y=()=>{for(let v=0;v<st;v++)for(let S=0;S<st;S++)for(let R=0;R<st;R++){const x=e[s[Qt(R,v,S)]];if(x===void 0||x.fluidKind===0)continue;const b=x.fluidHeight,D=x.fluidKind,L=x.layer===us?i:n,B=(N,q,C)=>e[s[Qt(R+N,v+q,S+C)]],V=B(0,1,0);(V===void 0||V.fluidKind!==D)&&m(L,2,R,v,S,0,b,x.tex[2]);const H=B(0,-1,0);(H===void 0||!(H.opaque||H.fluidKind===D))&&m(L,3,R,v,S,0,b,x.tex[3]);for(const[N,q,C]of LA){const ee=B(q,0,C);let se=0;if(ee!==void 0){if(ee.opaque)continue;if(ee.fluidKind===D){if(ee.fluidHeight>=b-1e-6)continue;se=ee.fluidHeight}}m(L,N,R,v,S,se,b,x.tex[N])}}},k=(v,S,R,x,b,D,L,B)=>{const V=sc[D],H=rc[D];for(let N=0;N<st;N++)for(let q=0;q<st;){const C=v[N*st+q];if(C===0){q++;continue}const ee=S[N*st+q];let se=1;for(;q+se<st&&v[N*st+q+se]===C&&S[N*st+q+se]===ee;)se++;let ae=1;e:for(;N+ae<st;ae++)for(let re=0;re<se;re++){const pe=(N+ae)*st+q+re;if(v[pe]!==C||S[pe]!==ee)break e}const Ne=C>>>8,be=C&255,j=e[Ne],Ee=j.tex[D],Y=[];for(let re=0;re<4;re++){const pe=re===1||re===2?1:0,ne=re===2||re===3?1:0,ye=[0,0,0];ye[R]=L,ye[x]=N+pe*ae,ye[b]=q+ne*se;const et=ye[0]*V[0]+ye[1]*V[1]+ye[2]*V[2],I=ye[0]*H[0]+ye[1]*H[1]+ye[2]*H[2];Y.push([ye[0],ye[1],ye[2],et,I,be>>re*2&3,ee>>>re*8&255])}const Z=B?Y:[Y[0],Y[3],Y[2],Y[1]];(j.layer===us?i:n).quad(Z,Ee,D);for(let re=0;re<ae;re++)for(let pe=0;pe<se;pe++){const ne=(N+re)*st+q+pe;v[ne]=0,S[ne]=0}q+=se}};for(let v=0;v<3;v++){const S=(v+1)%3,R=(v+2)%3,x=v*2,b=v*2+1;for(let D=0;D<st;D++){let L=0;for(let B=0;B<st;B++)for(let V=0;V<st;V++,L++){d[v]=D,d[S]=B,d[R]=V;const H=s[Qt(d[0],d[1],d[2])],N=e[H];let q=0,C=0,ee=0,se=0;if(N!==void 0&&N.layer!==gd&&N.fluidKind===0&&N.panel===null&&N.torch===null&&!N.egg){d[v]=D+1;const ae=s[Qt(d[0],d[1],d[2])];if(d[v]=D,g(N,H,ae)){const be=c(v,1,S,-1,R,-1),j=l,Ee=c(v,1,S,1,R,-1),Y=l,Z=c(v,1,S,1,R,1),re=l,pe=c(v,1,S,-1,R,1),ne=l;q=H<<8|be|Ee<<2|Z<<4|pe<<6,ee=j|Y<<8|re<<16|ne<<24}d[v]=D-1;const Ne=s[Qt(d[0],d[1],d[2])];if(d[v]=D,g(N,H,Ne)){const be=c(v,-1,S,-1,R,-1),j=l,Ee=c(v,-1,S,1,R,-1),Y=l,Z=c(v,-1,S,1,R,1),re=l,pe=c(v,-1,S,-1,R,1),ne=l;C=H<<8|be|Ee<<2|Z<<4|pe<<6,se=j|Y<<8|re<<16|ne<<24}}r[L]=q,o[L]=C,a[L]=ee,u[L]=se}k(r,a,v,S,R,x,D+1,!0),k(o,u,v,S,R,b,D,!1)}}return y(),p(),w(),E(),{opaque:n.build(),translucent:i.build()}}const UA=.24,FA=.85,NA=-.7,Ao=-1.25,BA=.34,ac=.3,OA=.6;class zA{constructor(e,t){this.materials=e,this.blockInfo=t,this.scene.add(this.anchor),this.anchor.add(this.pivot),this.pivot.position.set(0,0,Ao),this.pivot.rotation.set(ac,OA,0)}materials;blockInfo;scene=new td;anchor=new Mt;pivot=new Mt;mesh=null;swingT=1;currentBlock=-1;setBlock(e){if(e===this.currentBlock||(this.currentBlock=e,this.mesh&&(this.pivot.remove(this.mesh),this.mesh.geometry.dispose(),this.mesh=null),e<=0))return;const t=new Uint16Array(xc);t[Qt(0,0,0)]=e;const n=IA(t,this.blockInfo),i=n.opaque??n.translucent;if(!i)return;const r=xd(i,1,new G(.5,.5,.5));r.translate(-.5,-.5,-.5),this.mesh=new mt(r,n.opaque?this.materials.hand:this.materials.translucent),this.mesh.scale.setScalar(BA),this.mesh.frustumCulled=!1,this.pivot.add(this.mesh)}swing(){(this.swingT>=1||this.swingT>.5)&&(this.swingT=0)}update(e,t,n,i){this.anchor.position.copy(t.position),this.anchor.quaternion.copy(t.quaternion);const r=Math.tan(Cp.degToRad(t.fov/2))*-Ao,o=r*t.aspect,a=FA*o,u=NA*r;let d=0,h=0,l=0;if(d+=Math.sin(n)*.02*i,h+=-Math.abs(Math.cos(n))*.025*i,this.swingT<1){this.swingT=Math.min(1,this.swingT+e/UA);const c=Math.sin(this.swingT*Math.PI);h-=c*.28,d-=c*.12,l-=c*1.1}this.pivot.position.set(a+d,u+h,Ao),this.pivot.rotation.x=ac+l}render(e,t){this.mesh&&(e.clearDepth(),e.render(this.scene,t))}dispose(){this.mesh&&this.mesh.geometry.dispose()}}function VA(s,e=!1){const t=s[0].index!==null,n=new Set(Object.keys(s[0].attributes)),i=new Set(Object.keys(s[0].morphAttributes)),r={},o={},a=s[0].morphTargetsRelative,u=new Wt;let d=0;for(let h=0;h<s.length;++h){const l=s[h];let c=0;if(t!==(l.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in l.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(l.attributes[f]),c++}if(c!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==l.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in l.morphAttributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(l.morphAttributes[f])}if(e){let f;if(t)f=l.index.count;else if(l.attributes.position!==void 0)f=l.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;u.addGroup(d,f,h),d+=f}}if(t){let h=0;const l=[];for(let c=0;c<s.length;++c){const f=s[c].index;for(let g=0;g<f.count;++g)l.push(f.getX(g)+h);h+=s[c].attributes.position.count}u.setIndex(l)}for(const h in r){const l=lc(r[h]);if(!l)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;u.setAttribute(h,l)}for(const h in o){const l=o[h][0].length;if(l===0)break;u.morphAttributes=u.morphAttributes||{},u.morphAttributes[h]=[];for(let c=0;c<l;++c){const f=[];for(let _=0;_<o[h].length;++_)f.push(o[h][_][c]);const g=lc(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;u.morphAttributes[h].push(g)}}return u}function lc(s){let e,t,n,i=-1,r=0;for(let d=0;d<s.length;++d){const h=s[d];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=h.gpuType),i!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}const o=new e(r),a=new It(o,t,n);let u=0;for(let d=0;d<s.length;++d){const h=s[d];if(h.isInterleavedBufferAttribute){const l=u/t;for(let c=0,f=h.count;c<f;c++)for(let g=0;g<t;g++){const _=h.getComponent(c,g);a.setComponent(c+l,g,_)}}else o.set(h.array,u);u+=h.count*t}return i!==void 0&&(a.gpuType=i),a}const Tr=10,GA=.02;function HA(){const s=zd(51116),e=[],t=new Set,n=(o,a)=>{o=Math.max(0,Math.min(15,o)),a=Math.max(0,Math.min(15,a));const u=a*16+o;t.has(u)||(t.add(u),e.push([o,a]))};for(let o=0;o<14;o++){let a=6+Math.floor(s()*4),u=6+Math.floor(s()*4);const d=s()<.5?-1:1,h=s()<.5?-1:1;for(let l=0;l<12;l++)n(a,u),s()<.55?a+=d:u+=h,s()<.15&&n(a+(s()<.5?1:-1),u)}const i=e.length,r=[];for(let o=0;o<Tr;o++){const a=document.createElement("canvas");a.width=a.height=16;const u=a.getContext("2d");u.clearRect(0,0,16,16);const d=Math.floor(i*(o+1)/Tr);for(let l=0;l<d;l++){const[c,f]=e[l],g=.55+.35*(l/i);u.fillStyle=`rgba(15,15,15,${g.toFixed(2)})`,u.fillRect(c,f,1,1)}const h=new od(a);h.magFilter=Gt,h.minFilter=Gt,h.colorSpace=jt,r.push(h)}return r}function WA(s,e){const t=s/2,n=[],i=(a,u,d,h,l,c)=>{const f=new qn(a,u,d);f.translate(h,l,c),n.push(f)},r=s+e;for(const a of[-t,t])for(const u of[-t,t])i(r,e,e,0,a,u),i(e,r,e,a,0,u),i(e,e,r,a,u,0);const o=VA(n,!1);for(const a of n)a.dispose();return o}class XA{outline;crack;crackMat;crackTextures;stage=-1;constructor(e){this.outline=new mt(WA(1.004,GA),new Zt({color:0,transparent:!0,opacity:.45,depthWrite:!1})),this.outline.renderOrder=5,this.outline.visible=!1,e.add(this.outline),this.crackTextures=HA(),this.crackMat=new Zt({map:this.crackTextures[0],transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),this.crack=new mt(new qn(1.002,1.002,1.002),this.crackMat),this.crack.renderOrder=4,this.crack.visible=!1,e.add(this.crack)}setTarget(e,t,n){this.outline.visible=!0,this.outline.position.set(e+.5,t+.5,n+.5),this.crack.position.copy(this.outline.position)}clearTarget(){this.outline.visible=!1,this.crack.visible=!1}setProgress(e){if(e<=0||!this.outline.visible){this.crack.visible=!1,this.stage=-1;return}const t=Math.min(Tr-1,Math.floor(e*Tr));t!==this.stage&&(this.stage=t,this.crackMat.map=this.crackTextures[t],this.crackMat.needsUpdate=!0),this.crack.visible=!0}dispose(){this.outline.geometry.dispose(),this.outline.material.dispose(),this.crack.geometry.dispose(),this.crackMat.dispose();for(const e of this.crackTextures)e.dispose()}}class YA{constructor(e,t,n=9060348){this.scene=e,this.material=new Zt({color:n,transparent:!0,opacity:.55,side:Jt,depthWrite:!1}),this.mesh=new mt(new Cs(2,3),this.material),this.mesh.position.set(t.x,t.y+2.5,t.z+.5),this.mesh.renderOrder=5,e.add(this.mesh)}scene;mesh;material;update(e){this.material.opacity=.45+.15*Math.sin(e*2.2);const t=.72+.03*Math.sin(e*.9);this.material.color.setHSL(t,.85,.6)}dispose(){this.scene.remove(this.mesh),this.mesh.geometry.dispose(),this.material.dispose()}}class qA{mesh;material;constructor(e){this.material=new yn({glslVersion:yr,side:Ot,depthWrite:!1,depthTest:!1,uniforms:{uZenith:{value:new Je(5210088)},uHorizon:{value:wr.clone()},uFog:{value:fa.clone()},uVoid:{value:new Je(2832988)},uSunDir:{value:new G(.45,.72,.3).normalize()}},vertexShader:`
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
      `}),this.mesh=new mt(new Ca(1,24,12),this.material),this.mesh.scale.setScalar(400),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-100,e.add(this.mesh)}update(e){this.mesh.position.copy(e)}setBrightness(e){const t=this.material.uniforms,n=1-e;t.uZenith.value.setHex(5210088).multiplyScalar(e).lerp(new Je(660016),n*.6),t.uHorizon.value.copy(wr).multiplyScalar(e).lerp(new Je(1317946),n*.6),t.uFog.value.copy(fa).multiplyScalar(Math.max(.35,e)),t.uVoid.value.setHex(2832988).multiplyScalar(e),this.material.uniforms.uSunDir.value.set(.45,.72*(.3+.7*e)-.2*n,.3).normalize()}dispose(){this.mesh.geometry.dispose(),this.material.dispose()}}const KA="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAChUlEQVR42kWSV3PaUBCF9VvyEjuxKSqoXXUkkGihdwMGgxuBics4zo8/mV2G5OHM3pHmfFul53qIiV3AY+bjxlMxEgqmXglDIbOOrQjvvRSHZoiPYQ11+RJZ4StqxQv0zCKkw48YIzMHAj3VAjatEoF5aLKeUhdLV2EQvRexgLj4wqL/0m1k4r7q4thOsG9GGNhFrCsu5oHBb8q6r/l47VRwFxloqd9xE1mY+DpXI5HxLraxTQR2FQdjR+UWJq6GtnaFt26VWyAAtdG3ZC5/Gpxg0ibUsQ40bMsmx9d2gk1QwueogX3moW/m0dWvMRIyJo6Kh6qDG0fGS6fCko7NiEs8NELOdutrbPw9rOHYDLGKBQZWAT0jx4D7isDS13BoRgySVq6CP+MGmz+Hdaw8hUWQQyPAXephWbYx80rolK6wiQzM7ALH53oA6aUd42c94AF9DGr4GGR471axjQyuoqV8wyKyuIWpq2GX2NzGXBRPLWyS/2sZGDke2K9WmWE0H5r4yFHRt4qYeDpuHAVzgtkFPKQupGVoYCJk7DIfff2ajQR4rArsYusffOrraOs5LFwVm7KJ21A/AdaxjbFdxNDMM4jaocwkqoYyD4WCZSzQ0XOcmYZIcR0ZkBaBjlVkYuaq2KYeD5Mg58yzwEDXyGPsagw6f3/pVrGvh5CmroqJo6CnX2Ob+nwPtCLS0lPZTKWfjW3tO29mZMvYZj6kTcXFfS3AWMgcH1OXIeeDaWlXGAgFDfmS30OriEVoYJ0ILCMT0i4LQBAC9I0cA54yD2+9FO/9jE00QBJvITAwFgo2VZff0jzQMbQKDFgnDpsoM+15Heqo0937Ojp6/gRyNb5IilTJXzsd2hofgxXhAAAAAElFTkSuQmCC",QA="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAxUlEQVR42u1SyQ3CQAx0JbynCkpIAZRDKfwh6+xuQqAlHnRgZGksWTzZL49RLB8zHmelAXYFbAPsCVgBbGf8AKwDtgJ2A2xJ8B6fFS+836+f4CTSBwh8S9HRDZR+fJM7ve706QpzyjuUX79ZdYLGps5kT4eKWFlrJK2M/eBSqRgq69efWCgwp+sXwntlTcwLk4EYji03ipRkSXY2bywoBytzGYWbFr6ROd6BpiOG78a4sjlqYVOZk9PxYCOQy3myEfwJJvsAjIFrcP/cvEwAAAAASUVORK5CYII=",jA="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACKUlEQVR42jWT51JqUQxG9/sAShGkSBPpTXovglSpMo6AgwxPnjsrd/zB5JzNzpeVLzkmHo+L0+mUfr+v8f7+Xp6ensRms4nP55Nisaj/BYNBeX19lcFgIIVCQcLhsHg8HjHtdltCoZAQ+XH57e1NvF6vRCIRCQQCkkqlpNPpyHK5lPF4rO+xWEx6vZ6Y4XCohyRzmYvlclnq9boKNBoNeX5+VqpcLqfn+/1eFouFHA6H/wKPj4+afHd3p7FSqcjLy4v4/X5JJBL6fDwelaBUKsnHx4e43W4VMev1Wr6/v6XVamlvoCGSz+el2WzqpXQ6LbVaTVwulxJQAEHaNJlMRjG/vr4UkWokUpmYTCa1RapyRtJ0OhXyIDIoYUa1WpXz+SwQORwOFYIIMvqH5OHhQSNnp9NJaUw2m1XnV6uVTgOHwe12u2K32zV5MpkoHUS0s9lsZDQaCf4Z1BgbeNvtVj3AdYQxETLmjzgG8sxuQPP+/i6GRUKd0eAD7bBAiCFssVh0if4WDfe5QwEEDcm73U6u16uaAwGYs9lM24EMCnxBhMiUGD0Gq4kkg/b7+yvRaFR7phI+QMBFDLVarZpMUVpi3Q3o7DVzJxkzaQEaNhIa5g7JHx2C5ECpAjyQfLvd1GlWlBkza6gul4vi8x+FECAPcgPSz8+PKrIszB8hnObC5+enbh2jg4JECBHBI0MvLBCfKYjz+Vxd56NinLxDwz5Aw1YiwsdH/AcfgvkbkXGX1AAAAABJRU5ErkJggg==",JA="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB20lEQVR42o3SzU4aURQH8Ps4bBprmVoXdNNUJTpfDPOBjaum1CqWNm1apTYjHyOC4KpBLRGpOqCMYF+jT8Jr/JtzEhqmsGBxknvvOf/fvcmMCKpJdD0Vg5oFNx3DQ92GX5TRO0rg/tjEXVnH7xMHfklGv2ah4yl8dk+5QxWCGr1KggMEdEoKgxSmAcKCioHbss77Qd3idf/Y5JwIqgbrJHqZF3g4sTn8J4jxIAX8ksL9Qd3G3vIpX0YvpVeLzxvPEEQiXMPhkAdoTQDtqUb73Ovn3B+df1yXIH4V1JmBdl4JATdeAuLGM2YGropaCGjuxyF+5lZmBigwDrTcNYiMLc0M7DhSCMimFiC6ZR13RwZ6lSQirwKujqehX7PRPdS5rosyaM4vqSE0qJoQV/m1fy8YAVTXBRmxeoxr1Pe9KQDdNg2g4f8BCowDt+UExHsnOhXIpqQJ4ENKCgGfNhYhznPxqcBZLj4BtAtaCPjx5SXE2dhnHAcaX5cmgJarhIB2XoNo7C7h8kDlQPP7Kk73VnCZ17haByouXBkXrgL65c+/xXm2ub/K68buMsSWFcVb4zF2nAW8M59g25bwRnuEzeQ8Ms5TZNcXsWnMY8uMIq3Pgea3LQnpxByf/wVkjXV/2HuxXAAAAABJRU5ErkJggg==",ZA="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA5ElEQVR42u2Pu4qDYBCF/zdTUKKoRSxE8Q0sveP9ihfIg+UhUqfeepuzzIBbLCwLS1IEMnBg+OfMd+YX4pn1efNB+jfgdLJAeiHA9XbHX4Cfnu+6n8849BvAv3zg0BvwSEBRFJjnGeu6ous6eJ4HSZKQZRmCIIBhGDBNE6qqgrx933MvyzL7RVmWqKqKB9u2oa5ruK4LRVGgaRrP2rZlM/VpmrLXtm0sywJBjweEtO87p9IltERqmgZxHLOSJEEURbAsiy8XZKTFcRw5fZomHui6zsZhGBCGIScTjL6R5zmHOo6DL77IJcHVaQZsAAAAAElFTkSuQmCC",$A="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABQklEQVR42qXSR1IDQQyFYZ+EJZick8k5noCTkHOGOzf1TdVrmCp2Xshya6Rfr6XudM8GSj/W8bP1MFlWr0fK3stsWbsZLcefS+XwfaHsPE03tnI1XE6+lht/+t0rG3fjZf127BegSGD7caocfSw2Z0mAYL3LbgP0f/91rhy8zTfACkCmIh2YghgYCDUAu88zbQXkL18MNUmb9xNVIs8o0pGnUEyzFmDpfLAxhc7ppChwZzmuAFIB6BLSRTElYjrqxsB5swCqAB2YQklmwAdAka6GCmAWrSFKlsiy0hRmjWDZjMH69u8ao0IsCpyzQuoyhwqQhOoaWRtPpgKqMlSds40K8DGPBSSK/r5M8bxG1lLgnhKZbhIzB4kpBlJMoetWQJL4vPs8JjEKxRRlS9bcesquYDgSsxFQMclyMrycK6Af+wF7td4ljUgE9gAAAABJRU5ErkJggg==",ex="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABtUlEQVR42l2TZ1ICURCE3wn8AQUIywLmU2GRQW5gznoWKYFlSYcxZz3F6DcwYPHj1b7d6enuCeta+Yjc76Xk9SQnX5cb8na6Ip1iQu/vZ6v6fNj3pF2Iyc/1lnxfbcrjQVqeDn0JKklxYdVTgo/zNSV5PspIWPPk5TirZBAAHtR9TSQOIdhWPiquX/MUaMkk3hZiSsrd1FrbUfm8WNfvd7tJxbaLcXG9SlJt8REwT0i5c3BGKRBACBZBngi54c7cEoFMfElLoF7rA6qAiYFDhG/0RR0YGIAdFCA2gsWYOdUe8EKd1nUcoASQWjk4pQTErLywmhI3amZnSiRAwHhIshHiYDQl4J2+IKglDBvzAKwkDRr+zKZ1vl9Pqyuw9q1bXhYX/JsCqgSZr4GIcUcNcpsC95t8RBzM2McSDSIwbubUkTWNBGaOdWsiuG4pIS4oT5RtkRa7vTgdwyHKFrthw1ertgs4GTezM2WbjhGC5VAW/dNFMgd8hIgeACYR27joFOP6bqMGq3tAE1GBlSkQGE1JIbH17ZQmfyh7wKHpAVOwP88WhiCurOM2GUaLO+64Iqf3t0i/euJVJP6LFFwAAAAASUVORK5CYII=",tx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACM0lEQVR42qWRW1NSURTH+QQ9NNNLPWTOUKgczjlyh/DyCXrSZhomKxE1UeIeIMhlKJ1xJjIyMx3KG4hCXBRiqnenL/Vv1mo89FQPPux91v7vtX7/tddR9d+8jqssFW1Frx7b8zq8nxnAh9khHIVs2F2U8fmFAVtzWtaLS3osT6ix65Gx45FYVwDhB7dRmNZgz2/GUdiGTfcgJ33xGVGK2LHjkbEfMKMUtqPg0iD3WMSnBbEHOAxaUfQacBC0sGtuSuSY9O3nOi4iGGkE+zgvsP5XB31YfSqzAyVlnQL2/CZcXPxCKpXhtumZpFFMOQrg1o1rWH8ygA23iNjkIDbcOryblbA+pUGlcsqAN8+0WHOqseUxYtWpRt4lID8tgGpV/5rwJeC/f6EeNaCbcaAZN6GdtPG5k7IrgEbMyPqP3BjOE1a+o1gBnAYlnCUsqIZkfM+OMuCtS1AAJwER7RUbCnMyumkHjn0CapHhHqARNeLnq3GeQytuZuCa8y67UWE1JHFBM2ZkZwKQmQLIu0R00qMo+yWcpxz8PQ7IOPQKqL004bXzHuvfMmMoByQ+Zx/29wDNZdufS7+ERtyKr1Ezzlcc2FwwoZ0aQTc7jvTkHb6rhIZxlrzPsQK4JFPh/uIQ6nELDpa0DExN9KHsF1GLmrgrMmsl7TgJ6XsASqRWya0eszCombBxTG70ROog90jNha2EnUEKgJJoBiWfyDEVdtIjyhxo5WeoQxPHBKpGjD3AVdZv/A4FcAD3pJwAAAAASUVORK5CYII=",nx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACP0lEQVR42qWQ61MSYRTG/Rv62McmuwjpcluX20Jo9S/oOFMzOU2TUJqmAgISsMCidJk+OFOT2Sg65cgkIhqBgIDd/6anOcfa7bsfzr7vnPOc3/O823Ph/DmcpXro83FOxPa8iPVH/SjFZKz5DXj/8BrX1owFOyEJ7/x9KIbtfK5O9GEtYNQB6h0DsrcNKEwJPNwJkdCArWkzNiYHkBy9hGLIjtWJq1DGrvByfnxAB5w6GJAc7cVu1IUPszZsz4mchGCfIk5sPjadpgsYeZYYuagD8uMCR12+24/ESC+KYQdKMTenodipscvYnDZxjyCk3ZgSdEAtLuJrzovfL2/hMGLm8zjtQv3pIH48G8b6jMRVjVrxbdmHbtaDasyqA0jUTDl4SLDv+SH8fH6D6yTnRUtxopG0s6aretDNynzXAMeKk5dOVA8DjhISPkct6GRl/HpxE+2MmwGtlIOdCUqmGoCE/8QEIgCB6Dm0TK5fFm2chFLRnXQaoJGQuLly38iLhVkHJyBXciQxGRSe2LlPRgTTAKWgCZ2cD6WggN15AYexQZTDFu5VFqzY5/sQDqIiqosSXt0zoqHIOmB/wYJKxIpqXOKlVsaLo5QbzbSM134zWhkP6kknzzqqD+WwmU00AIkbihvdpWFeqiWc2AuZ0Fav8xLNqnE73k6KaKs+TasByiEzukt/I8YlvtcSDoZR7yBiQyVi4xRUe0ETmmnPfz9RkTk2PYXotFxPurDyQGAnWn4TsHCfiuJTQg1wlvoD59QmUQMoblEAAAAASUVORK5CYII=",ix="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABsElEQVR42k3TWVKCQQwE4DmGBSqcTwFZRfZdcUG4cawvVVPlQ8iQpdPpmb+MRqOYTCbB93q9+Pz8jNVqFe/v7/Hx8RHn8znP/PV6jcPhkPHL5ZLnonE6ncbr62u8vLzEer2Or6+vjNXC39/fjG+32/Tip9MpActsNot+v58Aw+EwNptNsjgejzGfz+P7+zsNENvtdgmwWCwSsDw/P0en08nmwWCQCSDoVSCMrABQrtlsxsPDQ9zd3UWxL7oaNKNIk8fHx2i323F/fx/L5TJB2M/PTzQajcwBLX4ENEBUDEAjIyANsNnv97lCq9XKdQwvilBiGBCy6oGNhtvtlgDANdmdWaOYWpEJajoAuyrSUAGc6UAXOayLRsVAmClidSJQgFZlVYuqS6lXpRCqZp5YvLUqO03EJrqh+ooHIWk6wXgUFWNhqjM9NDmrA5wivr29JRV//j8QoM48IM1MTI9ag0p99zyqGChUZD1mutsx/enpKVeoN1b+06wT62sUAwSg3lS328282wJe0KBypalQsl4hgLqvOt8N4MooASSJWa9UzH9+PB5nzHcCGAMxwED+AE3kZHy1bKoMAAAAAElFTkSuQmCC",sx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB4UlEQVR42jWTZRLCQAyF92a4uw9XQIq3uDuHfsyXmf1RCrvJswS33+/1er10v991OByUy+WUz+eVyWQ0m800nU5VKBRUrVaVTqftrlQqqd1u63w+y3FZLBZVq9XU7XaVTCYVi8UMgMJsNmvvZrOpSqVijdRDVC6X5Y7Hoz6fjwHE43GFYaj5fK4oijQYDKzJg/R6PVPT6XQMEEL3fr+FDYpoXiwWWi6XJn+1WhlYKpXSer3WZrMxu5Ciol6vy7VaLfNHM42j0ciYJ5OJAWCJYjKiebfb6fl82sOZ2263Jg8GQGD2IcKMBZoajYYej4exn04n3W43XS4XOVDwjz+K8EdQqAIIC9iCCN+AYIWJAeSQRRMj+X6/FijfUUWQKKKBcTJGpKPWK3GMAik08uaBBVXkgHzYYeQMa4THb9sDQvr9fnaAHQAYD6w0AsCDFSaFKkh98I4Pwur3+yYLiaTOOVOgAQCYAUQ+WfCG1BbJB8TDWPHvpTIFCAAFDGVYoZmxOz5g4BIALpGYSCQsNHKAgA30S8Ya45+AHVtImrByQSFex+OxhsOhvYMgMBWQwIx/QFFvfyZksgN+tpyBTiM5IJ8mGlBLPWOF3OGJ5Anver3aulJMIwBePupQwTTIhxoW7g+s+zDX4AYuzgAAAABJRU5ErkJggg==",rx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACa0lEQVR42lVTWU8aYRSdX2PamFSl0gqiabGxlJ0ZsOBSmxqLKIhbfRFhNoai777YIrtV+5OaPvSPnOZcHBIfbr6ZL3PPPcsdRf+6gMoXH+y9ILTgBPT8IpziEqzCG6SDE7AKizB3FuTMLj/H5cEynOJb1LbnsRqahFLbDsApLeF8y4+18AtUtvyP5RPARjEIIx8QkFxoEs3yOzRKQbn/FJ2C0qqG0TXj6Bhx7KZn8LMaxtBR0TZiKKRn0NEjuG2kcPddw9H6HG6dFHpWDF0jisO111CuKyFpbusxrAafoWsl0LOSuKlFsJvxoG/F0TNj6BgR7GdnBejhIiMA5dwslI4Zx/XZe/yofBAAMpA6D+N4wy8N/Pjq6upJ/b5cwenm/IhBW4/i+iyEv//+SA0dDZRGSZz+q6HCNM0ndd9Mo5ydhdKzEuLBoK6OATqPnhS0aaFLAOreVz24v0hjYCfEC3qisLlfT4kHYwYNTUB31CkBuGtq0kAAvhOAdfo5AIVmdYyYaHYBumYCN7WoSKDWh4u0SHEBeCeAH19CGdRTQpfRuQA3ehStagSlrFdiFMqNEQMayua+HUdpxQNl4KgynVPZTDMph/fl3CsM60lpcj2QvXBSEuvJhg8K42MD03AZtGoRYZFXpyRGUuY+EMDdg4fLDIpkwAj7dkqiO1r3yTP1U9JexoO2HhYGTIIA7VpYWPBOUuCknp0U6vtZr0gZSCrR8R5wKpu+bfqFCcGG9QQOcl53kWJCmwwIwHee+ccYOY1GFldGgPSF93uZaSh9OymOs0iZQGzmP3G4NjfeRJ7HGz50jYhsIQGYwn/FrmC+c8IzXAAAAABJRU5ErkJggg==",ox="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACNUlEQVR42pWSyVJTURCGz1P4CC5VUONNABcuVMhwb+7NnFSMhaJSJSZQEQOZyERGyBYlEEPmUfABf6s7Q7kMi670f/r8X5/uXNHJyuidWjEs2dFMm9HPq+jlrRhXnKybKRNGJTui2wa0sxbOb1ImDIs2DkHmQdGGccXBoFbajMmZk4F03i9oGBQ1JHY20MqYZ2cqn7czFohJxclJM21iQDsrc+dx2cGGTk5GN6cg/nGdXzcoaHy3k1MwKtshDgNr2HM9xVfnKgwPHywVh4F17Ht12Pe+gKB5iExEKlL37mws0rSjUXk63hwwr0cCEsRwthRaGhWp0MpY+NmsadaszHfmAMqp4dF7PUQvr3IHMlGRNM1OYNK0XOrYODEuAGSmfye9+woi5HmOA5+EsF+/9A7C7wwIup+xR0wqDgyLGm7PpyOMyzYMClZ0c9MXTcp29PNWjEq2BaB3St+OgruqC+Jv1c2Gu6qbi7fnLoxKGv6cORZA0v8DqEbmYUGFICOZ6CVzej+vYFhUWY+KGno5mUFzADWcVOwMFkfbGzj+8BJhv3SP72ANBz4dh6ifWHAZ28JV3Lg0oBbbwmV0E420AkFGSm7SCi4ibxhWT1pwlTDhV3QTF5HXaKQU1r9TMn4EDGhlVVwnzaxFPWkGRS1mxHXCxJcJSAbqUosbORopmYHf/RLnzayKn8dvIYJeCV9sKwh59Qh6JLDWVvDNIyHk02PPrcNn9Qnf2bE+4vqubZV/P6mP8Q/a0iedKWTMOAAAAABJRU5ErkJggg==",ax="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABD0lEQVR42qXRV1KDMQwE4ByRY9D7+XKQ0NMgELiCmc8za2z+xzzIRdKuVtLsaD4vh9jMcb59Lnffm3L58Vqudm/l5mtV7/59un4sJ6uHmsN38f7yRwB8/7Otd0AAZ5un6gf0B2b8chsBh0BA2BFJYv7sdr9uKqkeWuireCMCYPyxqBgIUjlzSN+RG0XIkKfY0ML157JJ9JYAdLxc1DcSN/IongxRABhJBsoXNf2WJltgkqmRkOFlC1HpRjIoiOTIRpTKvR8hoJgijUCfkZf1RXYfM6MMdNiChKwLc/6SJXpHNvOnuhEA6e2/SUrlEOQWnwwxew8gJNpQxED5+YYWAAQzTEH/tJE4EhZljeAQ+wU3pxxrczn9YAAAAABJRU5ErkJggg==",lx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABzElEQVR42k2SuUoEQRCG+x3FjdRARRCc2fs+Zu/7eigDZUE01EAFQRYUEQMx2l++ghKDZrqr6j+qakK73Vaz2VShUFCSJMrn80qn0yKeyWQ0Ho8t3mq1NJlM7M0XzHq9VqhWq8rlclbU7/eVzWYNHMexyuWy3S+009HLo4bDoZbLpXq9nlarleWMABDKEKAEWaPRMAK+57sf7V1farFYmCoxwNPpVAErlUrFijudjhFQAAnx0Wik+XxulgE5uNvtGmHgUqvVrA0c0HepVDJCXAEEBLGT0AKkfK0FHxIgyCjEdupuo9TtxggQohbbg8HADnMIgEiijiLzYIAnH1udfX/adiBFDSLqcIF9Wg71et2YUYWAIlooFovWDmCPIUYd6rimjcCD9ZDgkADIv+BrhAwRxGiVO87IB6wBclbUKOQwWAdBzp167k4eSGKTL05IsD6S2KZP8ihyfJi44gQUfbfsnCJa8J27ZV8rBLjgTW1gqlgDTDGsURQZiRfxjiTt31z9tUccQiNAyYfEIQGYdR4+P+jg6V6nX29GRA4Rhkxr4f+AfGVOSPHx+6tiyebBUPlPAPtaw2w2s+FxAKFKkhYgAoAycYYLiduH6BfsHX2OvyqTWAAAAABJRU5ErkJggg==",cx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABvklEQVR42k3TWVNVQQwE4Pk58ARFlYjsLmyyXRBREREui+zPgAIKKG6oKP93rC9WLB5ScybT6e5k5pSfWxP15HlP/fCyP8L+0/LD+n6hrx4/6474ujZSr948jvNf25P1/NVg3ZzorB9fP6jlemcqCmwOn3TWg9k79d38vYizxYEoVugb2ZfV4SC/XHlUf+9O1wKgWOH+bG8cUvi+MVaP5u7Wb+ujoYqEmD2hz82hfw4wsY0NiYNckclzQ1mOE/uLpftBViSoifXRjiDDTPXH5ngUaRER7G6jOxyYCfcFANvN/kzYTHt7jZ4gVfz2aVcQK4KFaw63R0uFEiv6trKaASivJfMwRE7cWroq2G3M4s9eI0IB+0iAiMCcvugNHFJtchMOWGHRoaAkb835AGc4IxwtsGaqWBUblG/K5gHEjSv2rZAzRP8J2APO9+D6APIqEZiH7+ZQWwzcudp4B6aLLZ9tPmGEivMdwNkT1Aa3xeQxAyvihP3bgzUfOATak8srLpKuRYILe9aR5BUiQpDPmqA24hqxKRLbk10BRqRnBfokgCxxSFI4ZuDV5d+XKoiRWBf6WwJMWYvOFwdag/wvxBgmgSkewCoAAAAASUVORK5CYII=",dx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABdUlEQVR42qWTyVICMRCGeRAfwyMnTx4wiLKN+/IquBBUoLTc1yqpYQaEGS9a7utztfU36TDgHKzy0KTDn3zp9J9JjI+O0MvxHMfnxTLd7+Xp63KFvq9WKagWqFFK8f+PBw6vwfh8NEtvpwuEvQn8POwXeTIc7kaawroTqwFiATgVo68VdbTiEfP2VpYaaxO9XCtqaUVNoymV7QNQsgDcCCCsObYCgAOtGIR5Mjn2+wpdrSg0VWDe3JykbrXAeWDAoknVDLjbzfU2mBO6ZpGvp7iKKCCIA8hkONADr5yJ1Z4OZwYBryfzXAm6ixzW3Wzn+Aro0cf5El8VuuQWIJ4OBxxw19OxGg6xADyQaA/EhetSygI8rThEez9b7AOEJk3yzCKUH7XRi2gDL1Ga6JrHIl63K1nq7ORtBZ2INuCClBOahyRWYbO8xKbRBIAmWwA+nLhG+eUMtSrTf7MRFuJeEEBHVUGtSLd1h79A6OgVcmiw0gL+Ez92GiA6laiT0wAAAABJRU5ErkJggg==",hx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVR42mPwMJH5TwlmABF7ZkSRrPHQvASEATunhoM5X3/9+f/ozSc4hinGJg6zlAHZNGRFyAZgEz+6MBnTC6QYsG9WDMKAvTOjSTYAxQvkBCLMUrIDcceUMIQBB+bEkeyFw/MTEQbAQpQUA2CWgg04ODeeZANgelDCgOyUCApRUEyA/HVkQdL/3dMjwfG8oiPg/+quYLDi/bNjwQG3a1oEmA2iUQIRpAGkEGQYKExATlzXG/p/XV8Y2FCQK0EGgywBYZRYACkGaQQpACkEmQ4ybGVHwP9VXUFg14EMBVkEkocZBjdgWpkDWRikFwBh6nG6mkGYKgAAAABJRU5ErkJggg==",ux="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACzUlEQVR42iWS2XbiVhBF9Zi2kQQaEMZ4aLtNY2wMiEFIQmKWAQO2PLs76X7JS5J/zGfkd3aWqh9qnVq36p46p+5Vlqc/GdqPhGYq2FbndPNLhqUHOvot6dnfjI0PiSzvF9aMD19ITr8R2Pcoy88/iOxHRs4zs8oHk+NnXG1B11jSt9ZEhRf+e/+Xx+o/JKUfDJ0HolKKb22Zn7yjzI4+6OkrFiffpbGlTokPH+iZS0aVlEX5D9LqX0yL34iNV8aVJ4bllLB0z+zkFSVyUqZHbyJbpJd3NHIjQeu3YybFd4mx/cb27E86hURUZrXw4B5lVH4hLj0zqbwxMHbEzjOr85/0tDXJ6e+4akJcfsIz7ohKj3j2mvgoFYWD4h1KdPBIN79ifvqBb+/wjA1DJxU7yefvjI+eZbGZ5Kic0tTGdK1brvdjQcW3t7haQt9YSwxLqUwdmBsy8rY2x7PWuPqCm9xEiMPDDf7BmoYao0SHKYGzpZmb0dyfiLeWOmd2+ipnPWtJS5/JTrK8oUUMDlb0igk3eoxS1wI6xTm13IArPcQvbnD1hG5hSSd/K959a8Oo/CTk85M3ecbMaldfolxqPh1nKtKa1oigtMXNL/CdDYNiZmuF72wFA2cnakNnx/T4Rf6L0jBC6rrPVd7nq9rHNRZ0zYTh4U7yjDjb+o06EcwGZNt38wlxJUWpqj2ujYCrgk/DDOmYc8LKlrYx5Wo/ol9cSXjOmqB0J3+krc8YOHcySLnWhrTNKS1zIljLebTsEdf5gJYV0zRjWtaIGzMSq1k9U3WpetKjfN3zZDnZAutqQDXX/dWge3zZ68jFlh2LvZrm0SzG1PMDrgoBZ5/a2Sv4MsV1JmR5TetRL3ic77k0rJCLXIea1hfSi1yXqtqlWYy4yLmSK9nES/0X4/knlxs7pJbvcb7XomEHou7a9OU8i7rh8SXXlvrZXpP/Aai/mcmoOHeuAAAAAElFTkSuQmCC",fx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABwUlEQVR42k2T2XbiQAxE+9vykD+eTBJCvIGN990GDMkkP6I5VyAfHnTUW5WqS93O27xIsH2VyHuXMo2kLRMpDqE0RazzuS/lNNaaf6+z7Px3icMPSfeeZLEvLom2epDJzt/oeGgynUN0PfXSVYkscyt9fVAgGCNyAPbBRvIkWIOKkBAAxzZbVXibP0oCeCU47D61GgGozvcydYUChiZVkq/zoJnqwfavFHecMxB5bHOV3lUHZa+ynaoD1JSJxuXY6v55qtUnh2QWOAwB8hijDCXsP5q2zI18L6Pm01iJQwZAu9Pz07OGVUYuZLbe16lMbS5jk8n11N0UmGyIAKHAVJlHdRGr86wf+3IlcoAwi4MG4m4QcwXGZjDX+D4Paiw42qsm5omvD8h8gJ31y9zKcahWcsggoEN05HLsxJ2nRgk4aBWtlbc23h4V+4whoPK/ZZSfyyQONqpaRgkkZtqjeUb6+zVrJhz3QiLZTKRi5L2paVQ1+agIP1816E7KX4AZICS0EbBlSJa7D6YMEAR5Et4IqGz3fHw4vAMqQzDf28Z/yOJA/I8X3edfOA4DpAP2KiFDkT1zSDBbVUbb++cLtdB/a9NSJwf7IrIAAAAASUVORK5CYII=",px="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABJUlEQVR42qXSSVZCMRCFYZbjClQUFR2wDEEBuwW5IMEGRLcUzpdzbjRjBvWSl9z6q0kNjl4n5RAb+FxsluX657kM3+/K6XpWzj/ndXV2uX0oo69F3Tv3P9491X0HuPp+rJfs+O22igBZgPa0VvoGQD/7uK9GLGIysDJgdwl2spr+ATigAhAQ2hMy9/5vfl/qnjNoA7jgKAoH6YuevjjPGp3/BkhtHAD0QCSZMAFElEV605XgkEWUdFM7mACcwJ37b4B0naN9nNKsPG+eNdk2ABFLE0VPzYTg/+eBtpuDpJZmphd5Mqt7ugwSbQOgpTGZOE7STv2ZFYDoOkCeL+lG6C59sGYSu2fMm3MGykSyQJ0Hkgy7HqgpNRICZhYynRkw+66EQ2wPLItP+i1ConcAAAAASUVORK5CYII=",mx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABx0lEQVR42j2TuU4DQRBE5zPAyMYfhQROSMBIIK/vY33f9/E/ZAgJYmICLJEgESHxAY1eod5gNDtd3VXVPbOh0WhYv9+3brdrfC+XS63tdmuDwUDf8/ncptOptdtt5c1mM2GdTsdCrVZTwmQyUYAkEnq9npLARqORCDjX63Vhw+HQFouFBVQphpkgOwtlCkiCmPNqtdI3ZLiWA5JhZI/jWCCqFHCGHBKceYwzC4EAEyCtALJwghrWOaME3mw2rVQqWavVsmKxaOVy2QIB751kQBz4NyrsuGQVCgWrVCqqIScAUkwARp/weDxOWqINYtVqVcrkUsc5MFW35KpYhYA+aYM20+83dv79YNnff+tRFCk3+NBY3jdq9Ay5z+H06dLSH7dyhACuucHgKpvNxg6Hg5Jpg2J2VFip15yc+M2AswcmvtvtbL1eK8Cg6NGTUeT6OLOD4RaH5IoAy07CtyuAsfwVEvdXCqEIAGgBVoI+debBIHlgZ2/Xlvm6V9/gfkPMIiEgiD3mgKorqf/nK0u95JK5+KvVDAjASgAFivxGwBwHQyT7E1n6mLeTxwsRBQpxwQEn+/1exez+YHy4XFvmmLfM513yi/8Ba651cdcejQwAAAAASUVORK5CYII=",gx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACH0lEQVR42k1RSXLbMBDEzZa4LwIILiBFSZZkyXaqcuB38qIkjpM4juw8Lqf8olM9hqp0mBoOgF6mqV7chJOb8MVNeHITfrkJP/38x014vTh7unjH899ugnpzEz79+ysDD5/9xXffXzzo5O/4/egxnNWTHz5fAM6Pv7pJzt88Ie++eQfEUFCdLmz+8I9P/uHrBdGjX+Ncz55U5dGAobmHLbdIQ4ci6dGYHfLYSe+bOyTzFmnQYeU+QOcrjO4BbbVHVayhWnMLVx+FgN0Ua2RRJwQ6H9GaPcbuAba8QRY6AeVxjzTsUCQDFIGsRu+FgCAqk6RMB5hi44k3qBdbIaCDeN6IG1Umo1zGsxadPSCe1VIk6pujKHf2FkN7L0VlVx+k816VaY8kqJGGNVq7FWaTr8TF0N5BZ2vJgUIUWWQD8rhDGjUgVsVzi+BKI4tbIcoiJ0CGRBWuxgyyqJeqzQY6H1AkTjDqXdXCFON7z1dirUyXQkR1y90ZYtQjvDawei09DiwUrdB+kTpxQgLuyISX3T266iAkBLNHMyNrtNVWSFRjbgTIgS5qvUaRdqjNGnFQYdk9wNmjD9DB1Xv07UFIwusKKg0bCYXgqlxhkfUIrhbQeY9obrAZPiKPB+lcJQ1bUU+CRn61IiMdMEBdLBHONMrMSc/iRlSpTgL+EdfcSoDnNVRnd+IgmlVij0BWtRgRXmsJT4D2iFrvRJkYgrnKf4SBd1yXkk+ZAAAAAElFTkSuQmCC",_x="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkElEQVR42kVTaVMaURDcH6+JotwqoGhEkcMziYjIcu3FtbCLUblvVwSp/IZOzRCTD6/YKl739HT3ExTVBa3kRbm6i4q+B1lxo9s/xXPzEP3hGZ6bR8gVHEimNmA+7uNB3IJadKNmBKBoLggElhQn6uYBytU9/pZVNx7ETciqBz8TazDMAKq1PdRNP+4fNjEcn+H1LY73xTWEyWsMo8kZKroP6YwNpfIuFM2NYnkXg1EYiuZBIvkFj0/BfwR0nwiG4zCE0SQCve5HWtyEmCV5HowmUf7tDU7R7h4z2X1qAzXDh9vEGvR6AFMrhvE0AkGv+5ggm7fz/rLiQrcfgjW7RK5gZxVEaM0uUNH9ELN21Ix9FMs70Gt+CNYsvjJE9UDM2pCXHJhacSbJS3Z0eiE+BcmB27s1tDonMBoBiNlt1I0AhPnHNbSSB/mCA63OMSsh6bQagSTFxdPIbPLGMP1Mks5sYf5xRSZGQCQ0uTcIs/sEHo4jTESyFdWN/vCUiRLJdTbTfAxiakUhkJuz+SXykhOjSQyZ3DZUzYOpdc5xSbITk9c4H1KQzmwjcbfOBIvlzcoDUlGq7GA4jkLVvLw7mUl9oAQ+1dAaqbSNy1St+fD2frFSsPz9A2bjgPenLlCZKAEqEilTizscq6y6WEUy9RVG44CVC8RE0ylOml6Q6ZIXBcmJwSjChyrd7YfZI/pvPI2i9D/GcyyW3znKldNefgudHp0TBrU6ob/v4pCHUMzURsIJ9DFf3nCzaB0xY2NQu3vCoF/PQfam2f7GhKSYKkzy2YNVZGGQEmodxUiAp5cgE5GaZvuYX+VL64gJ3hdXPJDfAkVBYGKbza/YA5Lf7oaYgKYSIXmRzdm59nT3U8UfqCw72Pj57lEAAAAASUVORK5CYII=",vx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACBUlEQVR42jWT51bbQBBG9w0SkhBkuVvIBVww7rZMT3KMjUOIA6ak9/d/gC/nDtkfc6Zs0dxvVu7rYUW3g7x+v2ro75uW2Z/XTbMfJzvmWX8Yl/Qp2Ta7HxX1eRrr+3FNblB6rpNG7tHqOZEnlUBnrYLZKNo0f9rM67ieVTf/VMPohSbxlo52M3KrQUmz+pbmzVCLVqirXkGrQaRZPdBqGOmyk9P7fkmXnbyW7YyW7aytsx/vfp7uWpt3w4K1DBJt0iKtUgePfeS/zuoWUwPLwcEhPIVvR1XLuQDz2nCINf8xLiN3ndwT4/LMB7VQ4/iluvkNjbY31S8+M49GaAP3tJoyrQ530nJ305rmzZRuxrHxz1uhzpsp4ztvBP8tpetRLPQiZg1tOGsItLju5/RxEpkOjA1W2qRGy3gQiT0iWrkvB2UrYH7u1LjU6+ENHfBcjNkFMCblwHjgJGfGeGY/KT/OG11gZx8xe9jvmPe7bsFYb5OqxTfjspb7WS1aaau93c/qehxrsZfWRTujD8PI1meNQI424IUJjybwggAKrcIOntfJj5TcIRgFjENs5jLqHOID/uGQc4H/GHo4mHgHGKzM2vMya3sb1dA8tV5hw96KP+Pg5K0zU2LexDqpWIw+6EG8nlTsP7jqFe2fudhL27/hPCPjgwk22oQfPfwbIKdtr4vH/geZ9KljEaVWjQAAAABJRU5ErkJggg==",Ax="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAO0lEQVR42mNgGL7gjpHNfxgmS/OvO25wTLIhA28AxWEAAzY9Rv8piomBNQCkmWwDYBqp4gWKvUHzQAQAlSpNE3D8AIoAAAAASUVORK5CYII=",xx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB3ElEQVR42oWTSW4CQQxF6xCs+x5sEBLzPA9bQMAKwQIQ8zxzgCiR2GWRG+RafQNHz63KtEgWlqvL/t/fdrXZ7XayWq0kEonIYrGQVColoVBIisWibLdbuVwuaqVSSRKJhGSzWclkMhoDZzabjR4Ilstl6ff70ul0pFqtyu12U1IMwOFw0DyKzmYzGY1GYjiQUKlUpN1uK0G325V6vS73+13J8RAcj0cl5g6S6XTqKYAkHA5Lo9HQ6s1mU2q1miat12utvN/v1VMIjykBzMjy+/3SarUUjAoIrterJuJph96tQYxyw7ACgYAEg0GJxWLqe72exONxlU1iOp3Wyslk8lM+cVXAB/IwGEkgCDEgtkLv3GPkAaRtlBsrhSD+dDppAiAqk8iclsulgieTicYLhYIq0i2QDJCzz+f70wDzFlDG2o1dB8Pi/B+BbYs28YZDLpfTAfLavie7b47nn5wfCmhnPp9rUQMISRBhCnhxxH3+ArmvjrgP7/t8PmshlOTzeW+N9M5ueUy/JbvvjhLYbyYPhv5RbqLRqE6fCbMJ1AwGAxkOh/rWaW08HqtkYvxoTJ8NsQlVwPAA2BVBCtDOhpfJPZItkBiExl5CghKqQco9laxxT3VAFKBtCn4AuTYZj0NdJJ4AAAAASUVORK5CYII=",bx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAARElEQVR42mN4+OHrM0owA4j4//8/Azl41ICBNODDr/8nyDYAppmgAcgKcYnhNIAYzTgNIFYzVgNI0YxhAKmaqZsOKMEAk/kuojV/pp8AAAAASUVORK5CYII=",yx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACEklEQVR42k2SWU/TURDF78cSF9xYXEBR/AxYtBQrdBFaaw0xgrKIC6JAQRbjA8/qs/BmCDyQkDQ1jVvaoMQg2NLUHPMbcg0Pk/ufe+d/zpkz42ZSl/Ssu0Glwpy+bYzr1Z3Lmr7dotl0qx6HT9s53HFc1A0Fa/XkZp0eXjuq4lqnSp+icvzQf7VG2ZVRSe9VLs5rK58xEICnEhfsfe7uFcsJQFTu03jsrNyL+DljGrx+TNtfZlT58doKRm+c0kDgsLE9aD9iysgB39tc0O73WVPlVL1n6C9vnTdWCgF9Hj1j3wADBtvTrnpJHyS9ldQvFRNyPAAAGgWwowgAbSYFwdePQVNi0vXOyPQrpZ1st5wv5qSAR4yDXdtpZZcC0u+0sssBTfQ0mRrAHnWeNFMdrD4AoA3UUIjMSj6mn+thA+SeAAgzzcSR0An7kcv7bYfsxCyCfLK32QrxhXEChAJvrnkAAMFPtAD7WKTR7igih4hxYipnJnnRAB2P9OIL2QWW6u/WGyvybxjNCcDBe8eiII+ESwC0s/hflQ9qaId6TnLzgBGB7leWYr8LsNEKU4KVn6mhHUb4JxfZbwFDMI8JkAPCmLgHhBH7YAp4Vf0ct9HaGGEDAAORByMstAUrKgBnKh6klIuaUpuC7x93aYWWkAy73w9O3mGHjADYaa/PHmFFsmfgJ4D8HkDgDQSY7SyshvQPMjiB12kpDZcAAAAASUVORK5CYII=",Ex="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABIklEQVR42qWSSXLCQAxFOVOOAQmQAZ+Uk7AOZA4+QCATIOqp8hyrWLKQuy19fam/NFjML+IcG/CJ9Sx+X67j+2kSu9eb2K4u09c/f56nsVmO4utxHPu327wXAgIa4GibBGEf98OOgAKckPwTtE06AHqHCCDVOemQOP/EwHUEtE4XAEjGqHR4v+uqS8yJEe8I+MFJFezz4SoJIYYkCdaz7AQcHeAvGhAgMdv7E05BISIGAXeKFAKSrAaQu4IqHKTEwJwQ+E6MZNWnOkDNCTneIiJOmAEppkI6Qk6FLGP0rTjtIKu0TfFDrtBlCiSovC2ShI9/38ydxBMNcNoaAQh8v63nCHtCllWG0XUm6A7Ytk9QK+NljCoPgfsu0Kr9rsoqn2NHAE8QOxtBUK8AAAAASUVORK5CYII=",Mx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAByElEQVR42k2TuU6DQQyE/XJQIoiCQPAGuZT7vu87eSsK6CmgpAEJaJKKSIM+S0YUm931zozH/h3T6UbPD2c6fVypUqmoVqupXq+rWq2q2+1Kx6ReHs/9XiwW1Ww2lc1m/Z7JZGTSnRCByOr3+2q1Wn5GAFKn09FgMPB7u932N0RIaDokHTCZTDSdTv3c6/X8DBgiBEQRIDMOWeCMHwCAS6WSRqORZrOZhsOhZ2AVCgW/hxjWSUQ5tt/vxSIAcbvdOni1Wmk+n2uxWDiR0hAHt9vttF6vtVwuZQTIvtlsHMCOXWLj8dhFiQNGhEUpETdqJxMXnKAOgDh7gCmVGJnBEgdv/+2EbVyQCXdRAk2lcZAjKcIWRC7YBoB1FkQahRBlNRqNvy8SrgxVmsZONh4RgRx9IBtgXEUcUcowLrggEwBEcEQZ+k5IupWO146J5rLAc/cSyIg9ssX3ZvcpPSTdAQQykoRz9MEYknK57CRsMjiQEQREguPbhaR7F2SEEYAD11CFRIBJjMeYD0Rfn86lz4SXRiydTiuXyymfz8tiZCFRExYpBSKNRUhfCXfDW4xyOLeYdx4JRqdj1vmn/rxfuv34WizIqVRKv2Fqi4/rqCKfAAAAAElFTkSuQmCC",Sx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB9klEQVR42k2S504bQBCE730oogQDxgVMSyA0Y5tebFNCFSKJRO+E3olC7+856Ft0KD9Od7e7szOzd274tUptJ3nq+lei3psyjbzFlH4Ma+il0s4D9xV2ZqcueVGovttyDT6E1HqcKwew/y5ol8R5gTr+FlsjCrqvApajUeYpIshokLosskXe9VyXKh3Lsa7x03xNNgc0mwhrrKFY5H6lIrbTJFubbyoAQpx9jsrNxINa6w7rdypqUk/Gvmuzr1IXU60ab/yi88kWA6DsdLzJCDLVH2pR6ghu9Vdpvj2gn8mILqfbtJet05/Bah3/aNRuptYAEHCfi5doMVmm2faQxdxOukYsgssdQWMHvNoV0uHIt8+GS6ly7Q/Va70nYkogRLkDRCH7SmeFJQ+Gv5oV2BcSpXanhjvx7YHY59nBxgUbSIQZ0NFog8U3eqN254wSmtGAOmIOichjJ4EVOqOIHTByAVCHRWJetYOZrhThD5/MBABxAN4eMZShBGXU2xCxATtJ7jChhCJmwo49VNKIvFdlz+i9wkgT/gCsHsTCDuqInU002/8Aaw3oii8SNMCffwksUAwQZs6ooxaMA4AXLlgBQKG34ocGiMXMIMQCipxn88/m3544BcyGoRFjxxrs2KK5+z/BGWZ+GDF2WP3Q/D8gjhXm9g6tYSS0EsY1RAAAAABJRU5ErkJggg==",wx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABiElEQVR42k3TZ05YQQwE4L0PHRJqgAAHCL2FXk8TOqGGzjkdfZYs8eNpd+3xzHjXrx2+T8XB28/Yf52MrcfR2LgfzvX33VDGNx9GYuG8J7b/jcX67WAcfUxnbvmqP3aefkQrkKRiQfuV64GYPenMHPK50648E1S8eNGbsQZMQaJAALvP4+kAkbyVsnXpsi+J126+RxOgyppiewWl7KyAgLwiOXttNUqSwHsvEwlGRn3177e0auVK/Nefjowdf87E/Fl3NLa1gQCRe5CwR46QUl2yVSucIGrFXgH2kPiQFDkMscLJI2p60TP7X1dFyLUC6JPzIVWHJO+ANWBJKoqAtOIMWGu15HLVtGJ1OUCU7FkFQkIEGCmsnJa02NysQ1llvd5cjNW6QAUc1JzkJLLFEnXsgDW+lKiKFSkSbtTJ5SUCIMHOco2zmByimgvtcYRALAlsALVjQGqsuWC1Rhk5+85qcpDYAkKkiH1nZAD1P3DFURESzJ+pnrCGpZ6z3rrIFMtps/5ERP8Bnh4qEBy90cgAAAAASUVORK5CYII=",Tx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACq0lEQVR42i1TZ3PaQBDV78rE44KxqRKqFAECBAjRezXVNBtwcJk4ZfJbX2Y3+XBzN3e7b9++fSfMhl2oYgh5K4njZolIOIBmxYEqhXHarrAc97GZT2CZMSQMFXFNgS6LWD0MMR12IUTVCOK6gpgmIxU3kDHjDBK482Ax7mE9G0EM+DDptxHTFOQzKWTMGCIhP+cJdtpEQlfw0G/zImRDlqBFRMTUCKjAoF1Hu+ryezpu4P24x345ZcbC8+McFScP20oyVVpmVEe/WUPIf4fpoINWpYTFuI9xt4lSPovjdgnKO+1WEAjNUCLQZYn7VqUQHgYdDFp1dBsVbqtRLmLYbmA+6rEOb4cdPs9H1kioODY69TIH06IzgQ07DbRrLkI+L5plB4vxgN+pb2o7k4whm4xDyKUSHEAVKGDca2HSa0MRg4jrKu+kBzGrlQqc1K6Vcdws8LJ7hPDr/QV+7w2qjo1es4qoJkMK+iGLQRbMc3nBiW+HLc5Pa2STMbRqLj5Oe/z5/grhx+uRL+OGikiIxncLx7ZAzKpOHpYZRbNSYtrU8++PbwzweT7ghUQkFDr4vR5YiX/BGTPKVelMbBplh81FoES9mE3j59sJxF4gBxqKBM/VBVeh4FbVRTGXRiGbgvfmCnY6ATef5d6DPi/ubq7g5jN8J+xXM6bdqVfgu72Gk7NQLuTY2qQBeYGEq7sFfiOmUsjPxWicwmG9gBYJY9Rt8viojeC9l6tSC1Sl7hYZkBgQYMnOgPLYSIQ66jRRyllMjYySjGq491zzmXzfqpb+szJx+fULzs8bHLcrnGiMJEi1aENXJBZpO59wsCaLrE0xZ2E9HSEV01kXAjWjGt/TxxLkcIB/G3n8aTWDaajsAbK1IYtciQzjFnJIJ6L80QatGtazMXbLKf4C7Skyh5I8TO0AAAAASUVORK5CYII=",Cx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB+UlEQVR42j2T6VJTQRCF51UEI8GAstyouCKrr8ISExIslKRKIBINO+Efsm+Cig+ggAu4srzSsb6uan50zUz36e5z+vYNRyt3dLB0S9/W7up8v1s/tx/p97vH5vPzZOuhGZivqy36vn7P/BefnihQ4HjzgSWffui0AL6zj106XL6tv3vtlvxnt80SiIEl9nkxUiAJEJUxgIDoQqI3wL68TVoizDBjUOyPqVJIqpSp1Vh/TPP5SC97rqiSjzQ9dNNstK9a5VxCU89uyPD5yN7EAlTpCosfG/fN0Pprp9U6cocltGEIA3zkgA0A0Q2AO4WgC338vJ2uz4rCYClsQwQMiCAgunD3wiRwwpZEnxW4MDFYr0oh0uzzxkttI71VprWUjmuhkNRob7XG03Gb0cxQg8hhHuVcncK/9x2mhZNO/t3pRBf0shswcN18IZjzDgTR6Z8HCQR8iNAGg4+47wN+4oFEqhJ0fb4kDAkw3elIAs184PjCSE+VaWMXJnJ1evW0RuVsQqVMXLMvGjU33GQzYBaTg/V6PVBrPptRJq6ARirDAqq8mQE6oYv57tOdWWH4wQecTgtdnMihCHdOZFAEo5n/gCbB9963Df2+JMyB4s7Q/0hfOOYV0FZMxWwX+A/Yh/nhZtM91nfVduFN9rrNpZi6ZvuAdvaFvP9j6YXjKJEr0QAAAABJRU5ErkJggg==",Rx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACcUlEQVR42jVSaVfaQBTNb2/dWEM2wK1qv1Sr7JCQBGjrUm1/w/3coxZRthBQnJ77cvphzpvJ5C7vzdXynSWObxVYD64VrO4Ktv+KYrhGujZGpjaC7c9gejNsnj3ACtZIN2bItiKUBgpasa+Qa8fYv1KwQyUggjP1CUxvCb01Qb45xsbpvayDK4VPNwrlbwrEarq7gtF9kw8kMNwY5f5awNnGVJQ/fPkjNVUZIt+JkWnORZ17bfe7gumvYQXvUku9RJ0kqeqLqGfrz9IG96b/hr0fSki4NNuPUOjMwJpvTaG7S7FGm1xOEMmd3Y2Qrb9g/1KBrp2+SmZguHPsVJ5QCpMfj36ylXe5pNrW+aN811tTmG4EK1Qyh4L3BrunoFndCKYXgUR0wJbogjM5vFYotGdIVZ+EiCR0YLDVgcLJnYKWqb/g4+k9ts7/YuPsQVR5yTacnhLVdG0ka6cyFFK2wDmwRc3wlkjVxmDVOwvJA1+FP7Ie3yV2mZGjW4Vyfwm9PYfVjbF1PoTmhGtkmzMUe+/IteYCYo9U57MSyHY+/1Y4vFEohkvsVEYw3AV2B0tolv+K8kAJON+OJFR0UfBehSjXWeHkVzJxho0OqJyqPsP0FtBomyQFBog/XSZWaZ1kBO5dKlhBMhcS5JpTIaELreBGyLWmyDQmMLsxigHzMJGBbn59lPzb/gJWdwHDTbKSqo7g+LGcNTtYwQlX2L54EoLtiyH09hR8HWZDb8+Qa06EIF17FiDPvOdZHJCg1F+Be4KyjbGkkwHj3gkW4oLqBDtBLA5Jrol6ZSTL8BZim+x0wmxwTyKq/W/D8mIUw1ha+QcfOBvm79E87QAAAABJRU5ErkJggg==",Dx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA5klEQVR42qWTQRKEMAgE/f+jfIgaE/1ItjpVnQLdmwcWMpJhIOyyrmv/Ygs/x3H08zyHv66rt9aGgWFi+lLKsEkgsO/7SNi2bSTjJeI7BcDIwycCwPu+Z1XOGt8hFK+1ZgJAW/gnPaojhoBik4ADjBix/RKrjIuQGkOSFAB4yYpcgNThEoOpchLYU2wDTBLMAhFLLVjB/jxzQVI86mzxReCgiFXlHHxq5YNNAidupdiC5GLkgKVXMNkEzNhqxqhwwRJBXJI4MKv71C5VmoGyXOHnEllZYp/59V/QHKBtxMt4VUyCL/YDPqSC2MwXqD4AAAAASUVORK5CYII=",Px="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB1klEQVR42j2TyUqDQRCE54Gz7/vyZ1/+JCBoUDwZDHgQRPFkEHMWvHgRRBCvIuoLlHwN7WHomenu6urqmTAYDNRut9VqtTSbzdTtdlUqlZTP521FUaRer6dGo6HFYqFms6lMJmMxhUJBASfJy+VSq9VK5XLZkgDCktTpdAycPUD4AAco9Pt9CxiPx+bI5XIGWK/XVa1WNZ/PrSp+7lkUwZ/NZhVIgsVkMjEgp0YFgkjAB8PhcGjJlUrFkok1BlDDiRZxHOvt+li7dWQMoAwLGNBGsVi0RRGsaUAyYjr116u17o4i1Wo1jUYjS4YFC10ohCU2kAwDKLpgBBLEnuqwmk6n+rg91efuzHSCPjY8bZf6ut/o+eLgf0w+WioARpusl8tD/ey35kMLWgzfD+d63MR2kU6nzSKQ9wkLAmFAi5yhzwhNA6ZAgPfPJb3DBAD2iIfytEN1CnCmWOCCXgAimKREImE9EgR1wH/3W73fnFh1zuSYBj4Wf1mAOH0YAQJ9poIeVMUPa3sHBMKCC/qDOhX8HstbYJEIU48xAHf4bAEiAMsZYaHqT9s/G8Dsg9Pm0tGxUPWfl0wmLcanhB9A+42uNiz8s1AJpf3bplIpS/DRsWfxiv8AVLh/8HhF7HkAAAAASUVORK5CYII=",kx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABuElEQVR42l2TV3ICQQxE5wwGTFiS86kIJqwNJ3DO4S7kzGGcE7ZPIdcTpa0tf0ztbE+rJbVm3Nj35OU0I4ubTfm63pDnk7RMG9kA+77d0v2wltTv61lWsc+rdemUouK65VV5O88p+HiUkqdjTwa1pP7/3u8EAv1KXIPeL/LKIQae65ZjCoaroAL2BPAl66yZk5+7bRWFz9monhLXq8Tl43JNQVQRoC1aAScb5PFeWvdUaa2AuU45plkIeDhMiiwOpFWMaLDhiE72M3oGTiJw2nLzZl6zQ4Zgi2wmgA/hMzDO582cOLJRomWEPPbTgamWkXIJpHTD8c/NGlk1hkVvGAUZkvmAAF5xTmYwzkd1T1yrEAkMNHdpi77NRIQYNxVaMNwhUyCbKRPEahejSgSnMjDMJpDW+NeLRAvcJnMag6gEZTAzTUfmLy8P/3ZvJuExkskItszY/xNAEO7I98T1q4ngDbBQbhVWlMyeUq06BI1HFXjlBtVE0AIEptDbXb4PgrlcfLlIcPCBCqiYK+/o11qAjIg9JoQRohLICMAhOyLaQrsU1WB7PEyD+YbvPKJcOHsrNolhLSV/b3F+vBmIIJwAAAAASUVORK5CYII=",Lx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB0ElEQVR42j2TSUsDURCE329Rg2ggv0ZE8eDFg5GQzGTfM9nXSZiLCIInr97E3PWHtXwFncPjTfpVVVcvCev12gaDgfX7fWu1WjadTm02mxnxbrert9FoZOPx2CaTiWLVatWSJLFarWZhtVrZYrEQGXCaprZcLiW03+9FQIw4v8EgBr7RaFhAlewAPeNms9HZ7XbKCpkb0WazKXyn07F6vW6BbJ4dqzwCns/n1uv1dA6Hg2JkhhTHsQ2HQ4kEyHwgQG0AXSDLMgFxRmYwlEvZ9EkOUANAJm5s8wiYQ7xSqegmGQ4RRbDdblsgKwAa4j0ATGnb7VZACLjizt2/W774IzHwIYoilcCjN9AbhxO3T38gFaJfxb1vgVrJ7jViC0f8Pr99tfzL0S7u3oQplUqKU/ZpjHywFBzG5L3A1dlNZrmHD4lyIOK4XC5LjO8AifGwLJCwygNCZKdHvidkRAgyW6gp+PwhUL+vKiKAIPOGOCVdP3+rDMi4Dyh6EyFdPX1Zvng8uQGICLYvHz9PO0KTGbnGyIFAJhpWiP9UFqII+EYixBK5OJhAkK4TwD5B+kIm3wkXxwWO+eaNPQkEqQkyYkyDrAh6WYCJ4RT7rLP/S/8BOjhvX8hCe+kAAAAASUVORK5CYII=",Ix="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADP0lEQVR42h2P608TVhyGD3bl0pbWXugKFQpF2Vi2Txtj02zK1VooUC69UKF0wJSRGJclu/xTS5jhJihQoFjaUsqtBVIETWRsTl2MMS7LnqXnw5Pz5by/93lFtNdA9vYHHN66xFSDYMFZyO5QOXGPiaPpz4h0aYn26Fnp1Mh3p0tJ1qflqF/HizEbYjNQytx1JX8s1cP+12SGK+XHiFvLXqiCZL9FHkn4zByM2En3FHHg0cjwobcYEXapifvMvEtcYaYpj/Q3Nla7imUw1mdkw/8+24NWYh4T2ds17LrzpcXbHz5kwykQS+0qOWGt+zwxb4k0SHhLpEXObn+4Ss6av66U5IK55hxno1bEyWwd/FRLukPw14iZRGch+/1GSapHw6bPRNhZQKRDzapLxZRDzX2XjokmJacPP0f8Ga7n3V07/3xfzds7lUQceSTdKjJ+g+RBSx5zTYJEn575ZkE0UE48WMWyx8LxTB3iiV/Ny28t0uBN9DJni/U8uV8nDU7H7PJAyl/C7kAp8d7zrHrLpMVSTwmJoB2R0z4LGthtExzP1snw09FyzsYv8uJuLXuDZXJGdrSKk7Eafm1QkBq+xPQNNZMOFWK6NZ85p4p7jQr+3bzCaoeaDa+R47Ea1nt0bISq5d4HnXpmnBommxSkRy4y1fweE1cFYitkJ8dks5LlbgPRbi0n39Ww4lIx33KOZKia+GAl6zcrSASr2BqysXHzApON55h3FiFy7Q9dWiauCcJuvQwuOJSyPROq4LfmfFa9pZLZtmJmWvMlix1alt16xGKnjmTQxs5wNbH+MvYGrcT79CR9JhIeA+FeM4vdJjljxWOR2pFeI4mAlUeeEsTxaCUpj54tr4G19gKyfUU89qpJdyn478ePiPpLmbiWR2qoioVOHZH2AhZahORoxIZ4PGLj7E4t2z4jewEzz0ctPBvUw88f8/fYBdb7y2T494V63qxf5vWjL9n2mwg7FMTcGkS0o4jFFsGyQ0GyV8dp0Ai/fMKOS0D6K3jawKvIF/C8GY6usuYqlO0nt+xkBkoRh0NWno3XkBmwsNSaJye8HrdJg4N7n8JpI6mQnfk2DbGAVU44DJWz6dGzGzDzP8aiSHpbdiwFAAAAAElFTkSuQmCC",Ux="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB3ElEQVR42k2ThVIDQQyG9xGwwZ1iLbQ4tMXd/Smwwd2dwd151TBfOrlpZ667t5vkl+TcxHeHlC6liXPOVe8USN2+TwJrWRI9C+h5wWyi3vGr3SuSksVUfa/azpfQVl7srvGoVDdNx2VCEEktF5VSOJfkJdsPkMmfTqlYz47dl69kyMh7i3RcV2syQVTm6b6r03f/aqZM/3XLwHNY3/seG3Xtua+PAYAc3MzVqrDhQQaJAERO/TL81qwg9QfFMvgSUTDkqhaqD71Gpeu2VormkxUZmqz5MwmeDGQZq7arUOycgN6HBhn7bBOYYFLnTY20XgalciNHg1h9CymazLkVLFtOF4dhUOQAL0Y/WtWc/qcmQSvMrBAJdMeM147QKiQQBC1W9DUclnhIgIRPyrWteIIXHgOM4GDqt8urbl7gMrphxR5UCsGOOIrpH8HjX+2Kjn4ucRqD8YUi8bPQfF6hYN6c0HMSzQuQaCl7itMR9siyJG8KcZUgCkANSTa+UOcMebwDQCzzwVzA0GEgVfFBB8M5ZygEG22+GViZT0ijQ3qJMaxGFbfxo2a3UF2nXXQIRBt3QDBbk0gwzTbj0KcAK0Nm5hkb+0acDQmH1l/Q6Eo8Kz4kaKMdafjEBP8DKnZwzOo3JTUAAAAASUVORK5CYII=",Fx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACj0lEQVR42j2T6VbaUBSF8x6t2qItViAzYRIcUBkTAiSBMAgIxEAooLZ9/d11DuqvrCTrfvfs4QjTRgr1wg+suiqK8ldEXgbTpohlW0PkpvHYVPAyzOPJkrHtZ/Hb0zExFfwZF3ClHEEIOhofCjsKrtUTrF0DC1s9QFoinNs4XkcFjKsXCDsqXgZZ+JUEA+YtDcLcklDNnWLnZ/DYkBC0FSxtlW98bitwbuKIHB1PpsTvNMHM0rD3M7jWTiA8d3TU8meIHA0l5QiLloRJPYlxLYmdn8OwJrK8cS3BkraejnFD4ucnIPIMhB0ZV+oxItdg/ZNGCtt+Bu7tOcK2gtAxGLjtpTGoJPE2yqMkf4WwaMloFH7ibVRA2YhhbokIOjoWtsaa/UoSz235E0AHvbtz9mBYTUAInTSaxTj2fpYBS1tBwBOI7DqlQJPMmiID/02KGFZT2Lga7jOnECaNJCq5GDaujkvpC1ZOGjNT4hQCW0bv/gI7P8uywq7KN49qIk9yZ8QgBG2Ve0ASSuoxSwi7afZg2ZIwqkt4HRYYuHI07PoGpqbKXkxN+QBoXsax7qqcwtKWOcYPgHsbx8Y7ABeWyACKm+K8oRSoiZVsjI36AJBhM1PGxjPYRJIwbykMoCKRBPLiIXt2KNK98Q2vwzyu1BNseocqUwrkgVf+xT0gYwm4fy/c3jcwtzUI1DDygKpclI/Yg7kls5GBLbGJ9I+KtHZ0RI4KrxxnM8vpGIRpM8VN3PYNjpGqTHpJwgeAnvSNJiIJM0tlEDfxyRR5FyJX52Xa9A56qUz7QY6Xae1oLGs3yOPv4yX8hwSbyD1YuxlUMjGsOgpKyjEDqFy0TKR5UE1xjDQBLRPvQl16l/Ad/wHpztuqEpuNnAAAAABJRU5ErkJggg==",Nx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABuklEQVR42lWTZ3LCQAyF90Lp7RAxGJuQfyn0lAvQCblCAgYMwzHS28k2871EnuTHjtaS3nuS1nJXpX3fiLZ9vbDlq/kN3Zvxji8Ha7L4Loq7vhZu+sujPeXZneNIIsEARoBN2jkdQPgQMyG+IRLB9fGBDqBZN/TTTt5/pHX/PDnXebw/9fNewaf9SKoAEQXrcACEfdw6FPBr2dR5Gp/pvCTljBAiwAhWcuveAaakaTdU0sPdiUBJJ+fn/UiA1agk/+u0ohyEaBkiZ6WQiALKtIHq26wqMmvhfV5TPB1EqlgEtEAFBGGftHOyn4uGfBBZG+NWoBjfDFMEMC2GRQVQmrQDlct9OSyqFQCQzXqh/LSSdPI/Q2QYPBVOVFe3JZGhCNmkFQik2KiUtbYYxGrDWS+oQEKvJNErFh/qkPC85DGr7D8AzEswcQKwUzpgQLRDRUYMAXFegdk5WGBb3hSlRgLl8lSLYaz2UP77KrwCBAg7+++ZKomATZ2KTNWqg9T2Q7tABcyBYULC0NJB/A9ICwzN9oI/kPxsmSDBCTNO29D0F0SMY9uItd1RBVxsZW2FbfOwtn1Yy7EV+Aab+kevh+NElQAAAABJRU5ErkJggg==",Bx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAaUlEQVR42mOImmb0H4bNouT+I/OxYXQ1DMgC6JIgPj55DAOIdQWyWgwXkGwAqU7GawAxgYYRBqQYgC28GEixHZsXSY5GjHRASRgQFYgUxQKhdIERBsQ4GW9eINUArCmRkI14o5HUGAHxAcRDCDOV7zHzAAAAAElFTkSuQmCC",Ox="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAI0lEQVR42mP4wfDjPz7MwMCAH48aMCwMIKSACAtGDRj6BgAA9VT3EP8L2v4AAAAASUVORK5CYII=",zx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABEklEQVR42qXTSVLDQAwF0ByIYsECMnjOAPe/UFPPVV/YZJmFLLWGr99q+fDx9t5ekYPPcDy38XRp93Fe7encrWf2bZjaY1rK33+d2tIN7We5/QFwCFz7cU2iu89jFQAA5KzJ93xd/TsGSZQ0X/r1jEXssFDMRxdAEjFhB4iNje7i6Q6IFECoJ6ijZH46HTOTsCoAQSJIMNkycBZnB0y8AExUcqYLPUCuk3vnemGyGyJEwlZIK+LLWXEYPA0xiTT0DCySeQCigRUA1ExWkOT+rgSU/r8LBZDlAbTtrogvzyqHPy+0Y2Bw2xkoso1A4hPnZ5MCyLvnuWgdsnnZjQw1/83TDATyxgCSyJf/ISuOXQG8Ir94H6/lUHiUYQAAAABJRU5ErkJggg==",Vx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACsUlEQVR42j2Te1faaBDG81HqsSbkQkIgt0ISLgbQL7C7p65UuYoCBbFStVVru9t+69/uvKftH3NmwuF95nmemdFuWy1GjsNVGLKIIoa2zTbLOLdtVnHMY56zKJdZui63ccxtnnOyv8+5aXJZraIJwKlhKJBtmjL1PN4nCXedDjdZxsc3b5hbFh+iiJswZO77bBsNzkollbXLIEBAhMEfr16xa7VYRpECkfin1+PH0ZF6LPVA17nvdBg7DkPLQpM/jctlBXJuWUrChe+zaTT4a2/vd/fv/T4b31edr+t1lmGoam0Rx6zTlIsgYOS6bPOcgWlyWioxdl2ei4Knw0O24keno/Ku0WDp+3xqtdBOTZNZrcbY81jV62zSlHkQ8LdhcBVFfO33mVoWC99X9ZeiYB0EfO31WFQqaNL5xDCYVqtssowzy2JULnOi64rBzLYZGQY3SaLyJgy5z3Neul0+pinaW13nnW0zsCyEjWiXEU4qFVZJwtnr14q2MJBaHl66rpIl35o4+9hsKodVHB1xl6Z8aja5cl1Wnsddvc7nPGddrbJNEp7lTVGwyzK0pefx/fiYl8ND/hWng4Bv/T7yu8SP42MVE8NQAMtqlYd2m6FhMHMcNJnvLkkUwDYIeMhzxeI6DBXQhzhWAJJlI8emyWB/n3UY8tTtoj21WnzrdrkwTVaVCpflMsODA9a1Go/tNtsw5KUoFMBNFKnuAvI+CBQb7bndZlYqMdF1pBb9F3IPcczccdhEEV96PaaOw32zycTz1K0MSiX+3NtDkwOZGoaSIFs3/jmy+yxjaprs0pSJbTO2LB5kW21b3c60UmH4ywORIPqFgZg40nWlX3wQ16/jWHWXuG02OTk4YOb76noVAwERL8QHoS6zXvm+kiLdn4pC7YHontdqaj+E/tv/9+A/PqbZa63/AUIAAAAASUVORK5CYII=",Gx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACMUlEQVR42j2T2ZKlIBBEfev2KiougALud9+6Z/7/23Kisif6oYIIIU8mRZnoIqDMB8jalCOm4YE1vjGYM7pqRacnuG5F/mnQmw2zf/yWa49IXLehNzvaaiJg9k8UB4+2XFDlEXlqYNsFWvkfWHtEmXkaBHdFUmQ9xZXyUKnlhlYTN5fworNpZqiDRfbRUVykA0FNOf8AJIFtFth2pXPs72iKmUlE7O2RAFlFKIC+O7GSOTzRlBN0HmGbDXN4YZ/+YBu/4M0FtRLADdv4jaG7oswGeHuG63aMwxWJiIO7QKUDqiz8AqRce8LYP1jT8ITOJ1S5Z69MvSD/tEgm/8ASXzD1SkBdzLD1EeUhoqs2VNmI6O5MImtwZ8T+wiQEiHOtRgzmhHG4U2j0jmBv7Ic4S/SmWLDEL6jUsSS+bTfpwYt37dsT2mph9CW8cZz/osxG9O2ZSby5Yhwe8O6MvtuZQKU9klpNvPfknygPgWIRuuaETu8UinuRBgKKQ4/QX1hOEohz7G8swvyLkODuFApAUph65/fBnuheF5FrolLPgdinb0IEIE2Uw1IyE2UWmWCNX3SVF5BVrpJwoooZOv/5D8qD5zxIQ729wNQbtBqxjm/2aDBHdHpGXf5PIEKBRHfjYZku9dnDtTtBsjeHB0tA8ozinn0YwhLb7HwuiSkwuYb8B3UxckKjuxJaFxNTiKs0UlJwDuSjXKHTKweq0wvFMlhaRfZHxAKSM62eGL+pRsL+AZT8TCB+Q24BAAAAAElFTkSuQmCC",Hx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACf0lEQVR42kVQWVPaYBTNL3JDFpUu04dqIYQkQJRtqljrRsuijooKBMLi2r612iq7gGi1/YOncy+mfbhzvnvuWTIR9pemUc+70SkpaBsymgUJ7aIXDV1ELedi7FZUtA0vGnkRvaoP3bKKjiEzL2RiM6jl3GgVJDR0D26yLg5r6h7G27KKOt2LEhuJ71Z8z6XyMKBf9XMDzTBIxC2bFbSKXm6l4FrWhV7Vz831vMihQjJkR1ybQCJoxYZ/HMmQDZ8XrLyv+8YQ1yzYDIwjFXYwR/pEyIZ0ZAqJoA3C3bEPHUPC4MSPdtHD2KsoaBVE6Guv0a+qzJu6li7y3quozAkkoOmWZTYRUgBhfu0VOkUJtyXvP83gJID70wCHtQseCA9nGi+Eppl2Sj/64OR3U3ezibBj/A+jEXYXZ/Bpnv7BJNJhO3beT2Mr6kA6YsdWxMG3VMiG3UUnkvwPrGCPNsGc8OPQhZuciJahoK5LaBRk1PIStqN21PIe3uu6F6S7OniHn0duXGdFRhrh6mCOzc2ijKvMHBoFL89+zMmB11k3z7e9t1z0fX8Wl5lZtAwVzaICgQhKvszMsYCC6LATtTNSgWnikgNTpzAvrKpjSIQcWFVGsRGwYEUewbpvHPF5K8+qOopUZAoflVEkw4QjSIYc+LRgw6ZmgfB0MY9+RUav7MWfr0HkVpyMNMTRjTTmu18Z6n6d+fF4HoBwf+LD7y8LeDrXmDyMTWFwrKJb8uDhdCgaHCusuasOA54uNL6RTjCbH881binF37CQTN2SBCowhwyPz0XmVwuZ5ZdIh63YitiGGLYhs/wCe0tOpJ/fu4vT2I46kAxakApNIhOj+wzjX3dKVZPw0/wfAAAAAElFTkSuQmCC",Wx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABuElEQVR42k2TZ1JCQRCE9wxKBnmYT6USBARPYM56F5VQIHgYc9ZTjPUN1a/48djZ2emenkAYtyJ73i/Yy8Gcn19ni9arZezzdMGe9vL2cTJvj7s5G7WK9nYU2c/Fsr0fl+xhJ2vX67MWupW0gwAQ8HpYtEE974F/V6t+h/i+Hfn9+3zJfbx3q2kL/VrGs5OJj6yjrTkPhpg75ONWMVbFiYphs2BhUM85gRQgbdyO7PdyxbPwBlmnkvKTcoiDwBXcNQuxLNgB9TezbqOAQD4SAVSvXFU7migAjIMSVBsEqCAj9vXajAMh445Smh0rAMhHFvqCrSkAui0nnYBYqWIygVFwQQHyAN1uJGL5EKBk0JhkxcYHERMMnXLSwQBwQkJ38UkRgF417WD8EBHPaAONoE6CcdLpXjXjclGjuoeNvJMTy52+0ewAixRoPOyB+kIgQJZLmygl/RoE26VYAdl5pCxsZYf8ZiPhtvyQdcopC9r76WxsnTYTctRQFidg+WlsYOYQSAVBlCWp2hE2ESUC+8ozRn40GjVHfSFQGWki78RqD9iNMGxM6iF4euum/6GQsLGaFHdsyv8HSmltC4Nie4cAAAAASUVORK5CYII=",Xx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABAUlEQVR42l3TWZICQQgEUO5/SPddZ/QGGknE60A/sIGChMos63k/vv+u+7brcb34ySf+vx36yy6HVefu523XVYLbabMAxFcUkNjjsus8Myh+mRTEFAJJbGJqAmibNCf/epzeBTVBkmmMJTYlPlAgiTOw8hNL8+TBVvKTCxxks4IakCRMMtnqeMBJgANWJpliNRzMZjzNAYXpJCZRps2mnJEYV0W2FOUwqN6GBtLZFEjLiBBfUiok46+UapsDTYCQl6/7zzfCbwAruwLpvIUUWtfdEdocKMA4ELJ6E/NsXqfmfwBhSFM4a2zyRSL2Xcd6AMk48wuJiJsMzwdl2pQ2PnU+npq1EOyYkt8AAAAASUVORK5CYII=",Yx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB7ElEQVR42j3TR09QURAF4Ptb6L333n+FCij2LtgL/C9d6UZcCBuCkRiNLExk44IYF5ox35jr4uW9O/fMOWfKKxE/Y62lJZ7MzcXt4eF4Oj8fNwYG8lltbo5LXV2xNTERd0ZG4mpvb1xob4/zbW35vfv6ZZTt5eV4PDsbzxcX42xjY+ysrMTFzs4EnWtqipuDg3GlpyfWW1vzXuzu6GgSEiwSKTxbWMgLjwtEj2ZmUune2Fhc7++P+5OT6RBGHtfFgV2qt4aG8vJaX1+6kvRwejpLREqdG+qICJcKUi+gMzeAm+PjSfZgaiqJOUHivNHRkS4KdYnVemXnQP1ArMMhg9NIZETL5e7utA/kUs2SKFBSp0T9IIRYXPPlZA/Ypg7Itm9ESJRTGylBCaYR8Ss+Hbz/54A9QSDf6n/35lUc7r2NH98+/5+COAcvlpbi+9ePcbi/G8WisKwul+ZP9eT4KOLPaTaYK33hCJ4LCyhejMKSeLhRG/CXD/tZ95mGhiSvo4WB1ezsAXtUsbmU5E3NXpiEsuCc9UNjLZq8glltAqyzzIWyvMW8PaYlTl1POMp/AQF2yeyZr5iEatvZxJTMFeF0oPuSHDxAEs0aCKmua1zdSjFY8WKWdZ0FapeVpPb651G1SEqqi/T79CT+ApA28gZA+69hAAAAAElFTkSuQmCC",qx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAtElEQVR42oWS7Q3CMAxEsxC7MAmTlJZ+vZZCC5saBbVSFPAlkn9EFzm+5wshOVewBiw4pwNr/+mX88lizWAPsOOe1wi2JfpPoxdYLSaYwCahh9j9KR4ANqgG9T6ip/feB4enO9gqGLz3CVwGERJigq2gh7ngkcKavx7VFhawTjHosz3nFYNWKQab90Oir8pC5UU1gdyWGIziQeNBTHNQCQbD3sBlEHO+FBj0JQsqKDGJt0z/ABez/Li/+XLPAAAAAElFTkSuQmCC",Kx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABvElEQVR42j2TSU7EQAxF6wapDOdstXpMp+d5TPdtQALEAZBYskCIDVwAIfaG95F74VTKZT9/O5VQVZWtVisbDoc2GAxsvV5rHY1GNp1ObT6fW6/X0/l4PJa/2+1au922yWRigQ0BBANbLpe2WCyuEE8EzMoeKNZsNi3MZjNtUEEiIMhUwMcZMZ1OR9ZqtQTH+v2+BYJQ4BCCUVWWpdbNZqNAwLdJYs9pam9ZJoBaIMArkgSg0WjoHYlAkc/6UxT2XRSCAscXcLgc+mMOJGP0fDgcBKUI76z472K0mySxsN1uFQyVGdAOhiKAVEE+yafTSXOg4EOM9pHnFgiiOiAgPjRWgo/Ho76Mg1ixxxj/W0AOxgZ5/iUA7nY7O5/POr9cLpoFhho/Dz4k790vEmpYSd7v9/I73HNoKUAhmUuDcUCCXxbkk+Sq6roWCCNWLVCNAIKZCUoA+/fHzywAUAQF5KkFqiCFHp3K8PxOUNGH9vk3dXwU8X9FVxkyxnBIZJhUB4YfwGuWCfaUpvZVFPae5yoUkIYKqMB8eEB495/IW7iP0V6yTIVQEXjQCwAkeVUUuAo+JUBa5QoT63/wL8Pic44jF1AkAAAAAElFTkSuQmCC",Qx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACJklEQVR42j2TZ3LiUBCE3/1PsBiDkEgCge3dK6wNBoNyFkhkHPYOvdVD+DE1VD36m9AjdUgsJB8ajukIp2yMtdfBym1L3kYmgmkd0ayB0u8hW+qI5xr8SV3y2utBrb0uCCFgG5pIFxr2yVDEhFCYLlp3ULY0sHK7SBc6olkT6kYvnDZWbgebsI9dPEDpdyUoZod8Y7EqMKVy8tG6dMAHBgHxvCntE1AFPckUsTqjCvoCCN8bkjmGSpe6kPxpHTErOQZKr4N9MkDld1E4xnWULj6LJ+R2S8AckaGieVPEud0W6k/1G9/lC77WzzikQ5yyEXJbx9fqWWAEZEsNx2yEQ2pBJYsWSr+PwukgeH/EMbOwi00BrESgC4QAjkUR98RRCZQOGJtwICNQyA44RmHrAjjnY2n/e/0iAMLoFEdRrE5bgumjLOVcPIlwE/SQLy+blu6u7/vEwiEdiaW7eEgbmwKgvwzOxuq7aCAQ9+1BdnTLdOVm/SY0oegnhQSxEqtz+wx2w6q0zXmtCYRVb7bntgHFzbuvNXHB+ftLqvIiOSODF0eIN6lfD0gTCG+CR6bWXhufBb+BNv5Vf+SU5ZzjgSzvZnM4a8iSCaULvItk3oTahD3xm2JmCmnbMbXkNztjZXaa2cb9Y6OFBKlzzq/QkthGfewi894F/8TKFPJevMkDTvlYrM2WLcnq4i0XY6D0OyKi53SCI9Ah960mC75crC5dXPaj4T92a1FHsT/T1wAAAABJRU5ErkJggg==",jx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAl0lEQVR42u2STQrCMBCFexJv4KZLD+By8Ag9gWvXc46a39Z4yycDTyhNFlpcFQcej2HC9yYkXbefug0nfKMKMKvAqWBSQVTBQwVeBVkFNhvZm+4qNSAScO4PKCv39ImA1AI8Sc7cwLxQ8yK9cLsKEDi0pLxINA+EBIaMLYDjocQkR73vH7iZp//+FVp1vRxh2vw3/oDPAC9hB9T0l8HLxwAAAABJRU5ErkJggg==",Jx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABJ0lEQVR42l3TWU5DMRBEUe9/qRAg8ywZHaMbRXz42S5XV49vnB6PuT2fp/3rcJifu9382G7n9/G4zrDeD7fbWu4/p9M8P59zIOyv15cxkMDuclki3hLo3Xmz3/8JUERKJEHkPBKzEz7e70sw0eFTuEACyDBeLAJwXOIJLoG8Ae0MnQuzVCx5wxgnPoQE4AFQCnD3UmEsBbslWuLDBzGAYV1IwBvRhJxLZyBYDGtb+eaxVhLAI+7uPAonT8DSqi7uBHErKPFVRIRyd67v1SKv8RogHCLjvYWlgFRnCDCA1d6mF3dUvPIt3OpQStWgtler0bRV3YraHDQ4hV6Ejft4H5LmoTAb8dILqxavSezy/x94T4WICGohbEVQYfLWvxHGCNHqria18xdmWdtSHY2e5AAAAABJRU5ErkJggg==",Zx="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABoUlEQVR42lXT11IcUQwE0PsVpPXa+0JYYDE5L9EmZ7DB8f//Qq6jsih4uDUzUnerJd1pv89243ytH1Od0VjodeJ253N8O1yLi/XZ+HW6E/fDpXj5shlXm/NxtjoTTwer8bC3nDG59v1oPcEzH8ai3x3PJBDAn/Nh/DzZjuutQZLlTpan4sfXreQo3HyoxAnSzfZCPp+PNxKkMky58P64vxKnK9PJaxKCBJA8Lzfm4m53MUFclBCCdy0SgW/ArLGjf0QkZNZZJqpfWDEHRrwhCVB09F8DU424g6BizYQbzhsVQSDVCZa69sSIik3/35ScY15Nkj0tsKg6EQ5quOJzHyfyDHqdd600QNatkyKSBOGah5g1T06MvG6n3x1LNw1ZC+Xg7SbKUV0aQn8v9jJPzDaaanV5PAUNhyCwbwTkytmMkwJsqoKgjRoimzU81a0V1vtsdzxbyjUiOgBINTxEhLof2oFRbPCpk8W8Nz2zbg6AEqrUSqtncyjbTv0rrarorXqvuRAgXP8B4brysDkDQYFaoa14slu/LWDdSESzIeT7H04PvEDmpaTbAAAAAElFTkSuQmCC",$x="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABpElEQVR42k3TWW4bQQwE0L6ErG1GtkeA90W77cSJfawcMbdi8DgikI+GeqqLxeKi9vBwiL5fx/PzW9zf72MyWcZu9xl3d7tYLC7j5eX9fL9K/PX1I6bTPnGnzWarmM8vYzJZRNcN0XXXMZ12ibl7h19cdCkynxd/mXij2PdD7Pe/0oXgw+F33N5uUwDum8vt9ufZ5SKzc982mx+pSMgdkeWnp1PiiMUhhMfNzc0mBZssrC2XVxnssKdOQX5hSpnN+gzmEl9cYxVBJuqIMh2PX4k/Ph7zrZwp0/10+s57U9Nqtc4gp2wLrH6wKjMBdWukspTRjIri2PUh7Tt//3wmxqY7Z3BcZXsj1GQSWJ03EVnYK2e+9aKaKLDKaf+PS93EalwyOwJxBBCrcnBadbsWx/fY+SE3sZaJfVNwJKlla6P6kNbGpVpnFuoIGsUlEbgGE+EyS7DfsngEUvaLqIFwAnBcgkqQLEvQKIAMLNc0auctjGBveKP9/vzfuY5mIQSzUwtjxjIjwznSAxnH0lbZcOW3Ggti/ZkIuMtSQbV9xDgjYBL/AKWRdCNhqY20AAAAAElFTkSuQmCC",eb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABkElEQVR42jXTV3IDQQgE0D2vrCxZOeds3RjXo4oPanYYumnCNrPZLHa7XUyn0/j9/Y3H4xHP5zO+32+sVqs4nU5xu91is9mk/+fnJ3q9XiyXy3xvjsdjBiFh+/0++C6XS9zv9zw/n0+Ct9ttAjudTiwWi2i329FQMB6P43A4xHq9TsD1es1APqDz+ZwqJKjMSHw3JRMYEYK/v794vV7xfr8TjEhp7kDD4TDLQNIAkUy6h/l8noQkehuNRtHv92MymSSYXyw14pqqSxNlclZfGMIqkwEjqaQNJuyyIysFzlIFoFRN4/dtKrCN7NgGg0E+IhPAB6g37kw5kvAhyCZWx7FxkousxunUWFPQWOrcS0XjonYXJqsgRKyym4DsRVb3LMGSAAkkj4KSD8CM0UJJRhmSbKISmEstiT4AI5UJGQCfrLUfucpkdrvdnDUzRgDftfP+kdpUo4SpuCyhnIgE164boUwUivFWi1RnU7V6RNBqtbIERgFizS3JlNRk+PJfKEklC5Hsmln9QQJEiZEjYv/MknbK6xSXvQAAAABJRU5ErkJggg==",tb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA5ElEQVR42oVSSQoCQQzsb6l4UfAF7ruoeNG7L1Dx4rjvv/AF7rtPipQwjUqSKejLVKaSqsSYL4xPKVo9i2QYzK5ZcrZRlrPo72K0fBQ+Rc1N5Kd4eEgQeFUA3ee3HP3/DOA7plAFRsekaGFyTtNgH9cFKm0/4XFcwwlTrRvUBRCim4EL1w4mAK8KTC8Z1idEFve8twCSlnxiA+oW0AXdpRBxA55rrHYChLA4rt4LiZwFxkdYUj543I1YrF8l0QJCxJ2oE6A7CqUQcY2qAEKULOA+sCVVoNzyqZfoGSI8IgcpRI57Aw/Htn+kY38BAAAAAElFTkSuQmCC",nb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAQUlEQVR42mNgGAWDHPyfJPX/f4PQf/INuGbz//8RAwoM+Lbv//8XTeQbkOar89/TVI58A7oybP4ne2gOoAEjxAsAleMswpFhqRMAAAAASUVORK5CYII=",ib="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACBElEQVR42q2SW08aURSF/Tl9aowGKcWaxgflOjPMDBfRtkhiakhbbWsjl6HIcGe09omogFRA7tDaP7iavY1D+2wf1uxz1ln72yczsxBef4LHaIEeN7qIH1kBl8lNXCQ20Drx4iKxiauUA528jLrmZO+hUrZ1IswBl0kHi0xqan714DrjwVXKibrmMitBG2kXQ2iYCXgfsmBPeorDbRs+bFlxEH6Gd0EL3sqLiKlLiPmXcBC2Yl9ZvPf8y9xjAkYVBR3dg35RYo2rKnu1Wo1F3uwsiG7Oi+SuDRPDz54JuM0LDCBRcFxR0cm60dU9GJUVDEo+tLNuTI0A4hErhiUfZ03A9DTAEApS7RVE9Asipoaf13QjOuvlBaSizzEsy+yZgEd/xmFJwqSq4OdZAKOyD+OKD7NTFTNDxe/vW7g7D2JQFHF3HuKcvr+GqaHMAWT2CwIDqHFSlU0gwX99CzJ0VJa4ZvZW+Xz+DgyVG2nCoCjwNFK/4P0HRpVumIu9xLgizwGJ6Co+76wgvmvHYWgZX17beB2P2PFpewVHr6xIRF/gOHLvfQxbeG8CunkJrYwbDc2JTl5CM+1idXIibrJe9EsKbgs+3tc1B5JRO64z7jmAmijU1kUOUW2mnWhoDq5tXWAQDSEdv7HxmQn4O/wQaudE9qiRAARmXxdxtGNBryj/n//gD7hEMxHp4e3zAAAAAElFTkSuQmCC",sb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAP0lEQVR42mNgGAVYgcaJLf9B+EOFzX8YG4SJ1oyukSRDsGlCNpAsA5ANISkMSHY+OnCb1vMfhMmOjVED6GQAALcOgI9WvP2/AAAAAElFTkSuQmCC",rb="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC10lEQVR42j2S11IiYRCF52EWHGbIEgQMCK63KgxhAMkmQEB9qfMkuiaigCQluIjIurrhfutvq/aiq6em6nx9/u7DfT39gPN4jo2Td7gKb7Ckp3AVf0O3O4AY6kMllWBN9rB6NIZjf4DVzBQauQV9pANz4hGcLtLD5tkvKDxVWNJjCHIP+ugQqmAXi4knAii2r7ByOIIt/UCA9eNXGHa7WMu+gFN6azAlhjAnRxCDLdiP5tg4/Yu1/AeWDmZYz00g+MrQhe7IgSs/hxhoQB1sQuW/A6cJdSAEmnAXf9ITjPExzKkJ3Cd/sJx9o6nKnWu4889YSvXJujM3g21vDKW3As5d+AFLckA/VL46TNEGbKkOrIl7fNk6hznRgzHaxoK3DEuyj7XsBAueWxgiLSqOl2pQeCpE3ii+wRJvkXAp2aZvXipD8FexGOtAsfMpVO7cQPBVoA83wVlTQ9qmff+JrDkzQ2gCJYIseL7BFO9io/hKnQF4bwkqqQxzvIv14yk4Znsx1qftMje85xI6uQJBuoZjv/8pksrkwJp6oKkM4sw9U+e0kR5MyTFchXeIwTbMsTsYwhUqfucCmmCNiuVAHahCHajBuHsP0V+lXXBKqYGl/We4ix/URekKq4d9mKJ1LO916Qr6cIPELBPMgW1vQLsgwObZH+ijj+B9Taxk59DJJSxsnxPAGKnCmf1OWdDKdcoBEzHI/ysYYgMSs2IwNl3wXhJAG7wl+yyFlsSnG2afQXShxucOnLkJ7JTxJ7r3WpZFdQbeV4MYbJA7694ExvgQ7LmCdANdqAZ9uA7RXwLHaOyu7DSOgyHchTlc+VesHE2g8texmBhBE+piOfNK3RRrEsCZGUGxdQGOTWWbZQD2zaazyZbUgEDsOraDKdRyB/bDF6wcPMKe7kHlvQbvuQJn2L2nVC0fjqALNwmglpvkwJoekpjtiZXjaEZPsCbbMETq0MpV/AMIQhUoMjIUHAAAAABJRU5ErkJggg==",ob="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABYUlEQVR42k3SRw5DMQgEUN//iuk9P72uHT2kif7CAsMwDNjteDz2x+PRz+dzv1wu/X6/1/l+v/3z+fTdbtdh5K7Xa9ntdls1bDscDv/CYRiqyJ0vB8QuFouKIUYkxrZxsQAA//V69efz+S90brdbHTh5JA2IfJKcJMSRLZfLHpWbzaYUwkRtMx9GswLzESoCok5XeXa1WhURDL92kC5ZVhYXciSn06m/3++6i6/X64o3LAKKFPN12O/3Nb8Cd3kF8Ky8kVsWCCCoYD6fFxmZ7qTbieNVxCiAbxzFEtiBSUWc7plXTNfxf2jmzycyZ2xeAmi8aA0Qacxv5JKiKHIVI0UgFzWZPWPUK2DKZu1CYb6x90Y8XpoG2U2NkL8fqVgnk0lZMQ0cRfmRWWApINNsErpJGkEy6nQWg/O00+m08vUKtqyTJAKAqJBzxsSWDu8gahygbF3QKOKz2axsCDIiP7kfk3S5iRcXcFYAAAAASUVORK5CYII=",xt=16,ab=Object.assign({"../../../../textures/ancient_debris.png":KA,"../../../../textures/bed.png":QA,"../../../../textures/bedrock.png":jA,"../../../../textures/bookshelf.png":JA,"../../../../textures/brewing_stand.png":ZA,"../../../../textures/cactus.png":$A,"../../../../textures/carved_pumpkin.png":ex,"../../../../textures/chest_side.png":tx,"../../../../textures/chest_top.png":nx,"../../../../textures/coal_ore.png":ix,"../../../../textures/cobblestone.png":sx,"../../../../textures/crafting_table_side.png":rx,"../../../../textures/crafting_table_top.png":ox,"../../../../textures/diamond_block.png":ax,"../../../../textures/diamond_ore.png":lx,"../../../../textures/dirt.png":cx,"../../../../textures/door_bottom.png":dx,"../../../../textures/door_top.png":hx,"../../../../textures/dragon_egg.png":ux,"../../../../textures/dried_ghast.png":fx,"../../../../textures/emerald_block.png":px,"../../../../textures/emerald_ore.png":mx,"../../../../textures/enchanting_table.png":gx,"../../../../textures/end_stone.png":_x,"../../../../textures/farmland.png":vx,"../../../../textures/flower.png":Ax,"../../../../textures/furnace.png":xx,"../../../../textures/glass.png":bx,"../../../../textures/glowstone.png":yx,"../../../../textures/gold_block.png":Ex,"../../../../textures/gold_ore.png":Mx,"../../../../textures/grass_side.png":Sx,"../../../../textures/grass_top.png":wx,"../../../../textures/gravel.png":Tx,"../../../../textures/hay_bale.png":Cx,"../../../../textures/ice.png":Rx,"../../../../textures/iron_block.png":Dx,"../../../../textures/iron_ore.png":Px,"../../../../textures/jack_o_lantern.png":kx,"../../../../textures/lapis_ore.png":Lx,"../../../../textures/lava.png":Ix,"../../../../textures/leaves.png":Ux,"../../../../textures/log_side.png":Fx,"../../../../textures/log_top.png":Nx,"../../../../textures/melon.png":Bx,"../../../../textures/missing.png":Ox,"../../../../textures/netherite_block.png":zx,"../../../../textures/netherrack.png":Vx,"../../../../textures/obsidian.png":Gx,"../../../../textures/planks.png":Hx,"../../../../textures/pumpkin.png":Wx,"../../../../textures/quartz_block.png":Xx,"../../../../textures/quartz_ore.png":Yx,"../../../../textures/rail.png":qx,"../../../../textures/redstone_ore.png":Kx,"../../../../textures/sand.png":Qx,"../../../../textures/sign.png":jx,"../../../../textures/snow.png":Jx,"../../../../textures/soul_sand.png":Zx,"../../../../textures/spawner.png":$x,"../../../../textures/stone.png":eb,"../../../../textures/sugar_cane.png":tb,"../../../../textures/torch.png":nb,"../../../../textures/trapdoor.png":ib,"../../../../textures/warped_fungus.png":sb,"../../../../textures/water.png":rb,"../../../../textures/wool.png":ob});function lb(s){return s.slice(s.lastIndexOf("/")+1).replace(/\.png$/,"")}function cb(s){return new Promise((e,t)=>{const n=new Image;n.onload=()=>e(n),n.onerror=()=>t(new Error(`그림을 못 읽었어요: ${s}`)),n.src=s})}function db(){const s=new ImageData(xt,xt);for(let e=0;e<xt;e++)for(let t=0;t<xt;t++){const n=(e*xt+t)*4,i=(t>>3)+(e>>3)&1;s.data[n]=i?0:248,s.data[n+1]=0,s.data[n+2]=i?0:248,s.data[n+3]=255}return s}async function hb(){const s=document.createElement("canvas");s.width=xt,s.height=xt;const e=s.getContext("2d",{willReadFrequently:!0});if(!e)throw new Error("2D 캔버스를 만들 수 없어요");e.imageSmoothingEnabled=!1;const t=Object.entries(ab).map(([l,c])=>({name:lb(l),url:c})).filter(l=>l.name!=="missing").sort((l,c)=>l.name.localeCompare(c.name)),n=new Map;n.set("missing",db());const i=await Promise.all(t.map(async l=>{try{const c=await cb(l.url);return(c.width!==xt||c.height!==xt)&&console.warn(`textures/${l.name}.png 는 ${c.width}×${c.height} 예요. 16×16 으로 줄여서 써요.`),e.clearRect(0,0,xt,xt),e.drawImage(c,0,0,xt,xt),{name:l.name,data:e.getImageData(0,0,xt,xt)}}catch(c){return console.warn(c),null}}));for(const l of i)l&&n.set(l.name,l.data);const r=["missing",...[...n.keys()].filter(l=>l!=="missing")],o=r.length,a=new Uint8Array(xt*xt*4*o),u=new Map,d=xt*4;r.forEach((l,c)=>{u.set(l,c);const f=n.get(l).data,g=c*xt*d;for(let _=0;_<xt;_++)a.set(f.subarray(_*d,(_+1)*d),g+(xt-1-_)*d)});const h=new Ma(a,xt,xt,o);return h.format=on,h.type=bn,h.magFilter=Gt,h.minFilter=ds,h.generateMipmaps=!0,h.wrapS=_s,h.wrapT=_s,h.colorSpace=Pn,h.needsUpdate=!0,{texture:h,index:u,images:n}}class ub{constructor(e,t){this.deps=t,this.el=document.createElement("div"),this.el.className="bag-panel",this.el.hidden=!0,this.el.innerHTML=`
      <div class="bag-card">
        <div class="bag-head">
          <div class="bag-tabs"></div>
          <button class="plain-btn bag-close" aria-label="닫기">✕</button>
        </div>
        <div class="bag-body">
          <div class="bag-grid"></div>
          <div class="bag-side"></div>
        </div>
      </div>`,e.appendChild(this.el),this.grid=this.el.querySelector(".bag-grid"),this.side=this.el.querySelector(".bag-side"),this.tabs=this.el.querySelector(".bag-tabs"),this.el.querySelector(".bag-close").addEventListener("click",()=>t.onClose()),this.el.addEventListener("click",n=>{n.target===this.el&&t.onClose()});for(let n=0;n<fs;n++){const i=document.createElement("button");i.className="bag-cell"+(n<Ar?" hot":""),i.dataset.slot=String(n),i.addEventListener("click",()=>this.tapCell(n)),this.cells.push(i)}this.renderTabs(),this.renderGrid(),this.renderSide()}deps;el;inv=new Array(fs).fill(null);stations={};tab="bag";drawnTab=null;selected=-1;half=!1;confirmDrop=!1;bottles=[];ingredient=-1;grid;side;tabs;cells=[];get visible(){return!this.el.hidden}show(e="bag"){this.tab=e,this.selected=-1,this.confirmDrop=!1,this.drawnTab=null,this.el.hidden=!1,this.renderAll()}hide(){this.el.hidden=!0}setInventory(e){this.inv=e,this.visible&&this.renderAll()}setStations(e){const t=JSON.stringify(e)!==JSON.stringify(this.stations);this.stations=e,this.tab==="brew"&&!e.brewing_stand&&(this.tab="bag"),t&&this.visible&&this.renderAll()}renderAll(){this.renderTabs(),this.renderGrid(),this.renderSide()}renderTabs(){const e=[["bag","🎒 가방"],["craft","🔨 만들기"]];this.stations.brewing_stand&&e.push(["brew","⚗️ 양조"]),e.push(["codex","📖 도감"]),this.tabs.innerHTML="";for(const[t,n]of e){const i=document.createElement("button");i.className="bag-tab"+(this.tab===t?" on":""),i.textContent=n,i.addEventListener("click",()=>{this.tab=t,this.selected=-1,this.renderAll()}),this.tabs.appendChild(i)}}renderGrid(){this.grid.innerHTML="";const e=document.createElement("div");e.className="bag-row hotrow";const t=document.createElement("div");t.className="bag-row bagrow";for(let i=0;i<fs;i++){const r=this.cells[i],o=this.inv[i];if(r.innerHTML="",r.classList.toggle("selected",i===this.selected),r.classList.toggle("bottle",this.tab==="brew"&&this.bottles.includes(i)),r.classList.toggle("ingredient",this.tab==="brew"&&this.ingredient===i),r.title=o?`${this.deps.nameOf(o.item)} ×${o.count}`:"",o){const a=this.deps.icon(o.item,36);if(a&&r.appendChild(a),o.count>1){const u=document.createElement("span");u.className="bag-count",u.textContent=String(o.count),r.appendChild(u)}}(i<Ar?e:t).appendChild(r)}const n=document.createElement("div");n.className="bag-label",n.textContent="아래 10칸이 게임 화면의 핫바예요",this.grid.append(t,n,e)}tapCell(e){const t=this.inv[e];if(this.tab==="brew"){if(!t)return;if(Vd(t.item)){const n=this.bottles.indexOf(e);n>=0?this.bottles.splice(n,1):this.bottles.length<this.deps.potions.stand.bottles&&this.bottles.push(e)}else this.ingredient=this.ingredient===e?-1:e;this.renderGrid(),this.renderSide();return}if(this.confirmDrop=!1,this.selected<0)t&&(this.selected=e);else if(this.selected===e)this.selected=-1;else{const n=this.inv[this.selected];if(n){const i=this.half?Math.max(1,Math.floor(n.count/2)):n.count;this.deps.onMove(this.selected,e,i)}this.selected=-1}this.renderGrid(),this.renderSide()}renderSide(){const e=this.el.querySelector(".bag-card"),t=this.drawnTab===this.tab,n=t?e?.scrollTop??0:0,i=t?this.side.querySelector(".craft-list, .codex-grid")?.scrollTop??0:0;this.side.innerHTML="",this.grid.hidden=this.tab==="codex",this.tab==="bag"?this.renderBagSide():this.tab==="craft"?this.renderCraftSide():this.tab==="codex"?this.renderCodex():this.renderBrewSide(),this.drawnTab=this.tab;const r=this.side.querySelector(".craft-list, .codex-grid");r&&i>0&&(r.scrollTop=i),e&&n>0&&(e.scrollTop=n)}renderCodex(){const e=this.deps.owned(),t=document.createElement("div");t.className="bag-title",t.textContent=`드래곤 도감 ${[...e].length}/${this.deps.dragons.count}`,this.side.appendChild(t);const n=document.createElement("div");n.className="codex-grid";for(const u of this.deps.dragons.list){const d=document.createElement("div"),h=e.has(u.id);d.className="codex-cell"+(h?" on":"");const l=document.createElement("span");l.className="nest-chip",l.style.background=h?u.color:"#444";const c=document.createElement("span");c.className="codex-name",c.textContent=`${u.tier}. ${u.name}`;const f=document.createElement("span");f.className="codex-sub",f.textContent=h?"얻었어요!":u.recipe.map(g=>`${this.deps.nameOf(g.material)} ${g.count}`).join(" · "),d.append(l,c,f),n.appendChild(d)}this.side.appendChild(n);const i=this.deps.codexBlocks(),r=this.deps.codexCandidates(),o=document.createElement("div");o.className="bag-title",o.textContent=`블록 도감 ${i.size}/${r.length} (마을 공용 · 10종마다 마을 레벨 +1)`,this.side.appendChild(o);const a=document.createElement("div");a.className="codex-blocks";for(const[u,d]of r){const h=i.has(u),l=document.createElement("div");l.className="codex-block"+(h?" on":"");const c=this.deps.icon(u,24);c&&l.appendChild(c);const f=document.createElement("span");f.textContent=h?d:"???",l.appendChild(f),a.appendChild(l)}this.side.appendChild(a)}button(e,t,n,i=!1){const r=document.createElement("button");return r.className=t,r.textContent=e,r.disabled=i,r.addEventListener("click",n),r}renderBagSide(){const e=this.selected>=0?this.inv[this.selected]:null,t=document.createElement("div");t.className="bag-info",t.textContent=e?`${this.deps.nameOf(e.item)} ×${e.count}`:"칸을 탭해서 고르고, 다른 칸을 탭하면 옮겨요",this.side.appendChild(t);const n=this.button(this.half?"반만 옮기기: 켜짐":"반만 옮기기: 꺼짐","plain-btn"+(this.half?" on":""),()=>{this.half=!this.half,this.renderSide()});if(this.side.appendChild(n),e){const o=this.button(this.confirmDrop?"정말 버릴까요? (사라져요)":"버리기","plain-btn danger",()=>{if(!this.confirmDrop){this.confirmDrop=!0,this.renderSide();return}this.deps.onDrop(this.selected,e.count),this.selected=-1,this.confirmDrop=!1,this.renderGrid(),this.renderSide()});this.side.appendChild(o)}const i=["crafting_table","furnace","brewing_stand"].filter(o=>this.stations[o]),r=document.createElement("div");r.className="bag-tip",r.textContent=i.length?`가까이에: ${i.map(o=>this.deps.nameOf(o)).join(", ")}`:"제작대·화로·양조기 가까이 가면 더 만들 수 있어요",this.side.appendChild(r)}renderCraftSide(){const e=document.createElement("div");e.className="craft-list";const t=["inventory"];this.stations.crafting_table&&t.push("crafting_table"),this.stations.furnace&&t.push("furnace");const n=t.flatMap(i=>this.deps.recipes.forStation(i));n.sort((i,r)=>Number(Ur(this.inv,r))-Number(Ur(this.inv,i)));for(const i of n){const r=Ur(this.inv,i),o=document.createElement("div");o.className="craft-row"+(r?"":" no");const a=Object.keys(i.out)[0],u=this.deps.icon(a,32);u&&o.appendChild(u);const d=document.createElement("div");d.className="craft-text";const h=i.out[a],l=Object.entries(i.in).map(([g,_])=>{const m=this.inv.reduce((p,w)=>w&&w.item===g?p+w.count:p,0);return`${this.deps.nameOf(g)} ${Math.min(m,_)}/${_}`}).join(" · "),c=(r||Object.keys(Gd(this.inv,i.in)).length,"");d.innerHTML=`<b>${i.name}${h>1?` ×${h}`:""}</b>${i.station!=="inventory"?` <span class="craft-station">${this.deps.nameOf(i.station)}</span>`:""}<br><span class="craft-need">${l}${c}</span>`,o.appendChild(d);const f=Hd(this.inv,i);o.appendChild(this.button(r?`만들기${f>1?` (${f}번 가능)`:""}`:"재료 부족","big-btn small",()=>this.deps.onCraft(i.id),!r)),e.appendChild(o)}n.length===0&&(e.textContent="만들 수 있는 것이 없어요"),this.side.appendChild(e)}renderBrewSide(){const e=document.createElement("div");e.className="brew-box";const t=this.deps.potions.stand,n=document.createElement("div");n.className="bag-info",n.textContent=`병 ${this.bottles.length}/${t.bottles} · 재료 ${this.ingredient>=0?this.deps.nameOf(this.inv[this.ingredient].item):"없음"}`,e.appendChild(n);const i=document.createElement("div");i.className="bag-tip",i.textContent=`가방에서 물병·물약을 탭하면 병 칸(최대 ${t.bottles}개), 다른 것을 탭하면 재료. 연료: ${this.deps.nameOf(t.fuel)} 1개 = ${t.brewsPerFuel}번`,e.appendChild(i);const r=this.ingredient>=0?this.inv[this.ingredient]:null,o=document.createElement("ul");o.className="brew-preview";let a=!1;for(const u of this.bottles){const d=this.inv[u];if(!d)continue;const h=Wd(d.item),l=r?this.deps.potions.brew(h,r.item):null,c=document.createElement("li");c.textContent=`${this.deps.potions.displayName(h)} → ${l?this.deps.potions.displayName(l):r?"(아무 일 없음)":"?"}`,l&&(a=!0),o.appendChild(c)}e.appendChild(o),e.appendChild(this.button("양조하기","big-btn small",()=>this.deps.onBrew([...this.bottles],this.ingredient),!(a&&r&&this.bottles.length>0))),this.side.appendChild(e)}clearBrewSelection(){this.bottles=[],this.ingredient=-1,this.visible&&this.renderAll()}}class fb{constructor(e,t,n,i){this.onSend=n,this.onClose=i,this.sheet=document.createElement("div"),this.sheet.className="chat-panel",this.sheet.hidden=!0;const r=document.createElement("div");r.className="chat-card";const o=document.createElement("div");o.className="chat-emojis",t.emojis.forEach((d,h)=>{const l=document.createElement("button");l.className="chat-emoji",l.textContent=d,l.addEventListener("click",()=>this.send(Tc,h)),o.appendChild(l)});const a=document.createElement("div");a.className="chat-phrases";for(const d of t.phrases){const h=document.createElement("button");h.className="chat-phrase",h.textContent=d.text,h.addEventListener("click",()=>this.send(Xd,d.id)),a.appendChild(h)}const u=document.createElement("button");u.className="plain-btn chat-close",u.textContent="닫기",u.addEventListener("click",()=>i()),r.append(o,a,u),this.sheet.appendChild(r),this.sheet.addEventListener("click",d=>{d.target===this.sheet&&i()}),e.appendChild(this.sheet),this.log=document.createElement("div"),this.log.className="chat-log",this.log.hidden=!0,e.appendChild(this.log)}onSend;onClose;sheet;log;lines=[];hideTimer=null;send(e,t){this.onSend(e,t),this.onClose()}get visible(){return!this.sheet.hidden}show(){this.sheet.hidden=!1}hide(){this.sheet.hidden=!0}add(e,t){this.lines.push(`${e}: ${t}`),this.lines.length>5&&this.lines.shift(),this.log.innerHTML="";for(const n of this.lines){const i=document.createElement("div");i.textContent=n,this.log.appendChild(i)}this.log.hidden=!1,this.hideTimer&&window.clearTimeout(this.hideTimer),this.hideTimer=window.setTimeout(()=>{this.log.hidden=!0,this.lines.length=0},8e3)}}class pb{constructor(e,t){this.deps=t,this.el=document.createElement("div"),this.el.className="bag-panel chest-panel",this.el.hidden=!0,this.el.innerHTML=`
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
      </div>`,e.appendChild(this.el),this.title=this.el.querySelector(".chest-title"),this.chestGrid=this.el.querySelector(".chest-grid"),this.bagGrid=this.el.querySelector(".chest-bag"),this.halfBtn=this.el.querySelector(".chest-half"),this.el.querySelector(".chest-close").addEventListener("click",()=>t.onClose()),this.el.addEventListener("click",n=>{n.target===this.el&&t.onClose()}),this.halfBtn.addEventListener("click",()=>{this.half=!this.half,this.halfBtn.textContent=`반만 옮기기: ${this.half?"켜짐":"꺼짐"}`,this.halfBtn.classList.toggle("on",this.half)})}deps;el;at=null;chest=[];bag=new Array(fs).fill(null);selected=-1;half=!1;title;chestGrid;bagGrid;halfBtn;get visible(){return!this.el.hidden}get position(){return this.at}setChest(e,t,n,i){const r=!this.at||this.at.x!==e||this.at.y!==t||this.at.z!==n;this.at={x:e,y:t,z:n},this.chest=i,r&&(this.selected=-1),this.el.hidden=!1,this.render()}setInventory(e){this.bag=e,this.visible&&this.render()}hide(){this.el.hidden=!0,this.at=null,this.selected=-1}cell(e,t,n){const i=document.createElement("button");if(i.className="bag-cell"+(n?" hot":"")+(e===this.selected?" selected":""),i.title=t?`${this.deps.nameOf(t.item)} ×${t.count}`:"",t){const r=this.deps.icon(t.item,36);if(r&&i.appendChild(r),t.count>1){const o=document.createElement("span");o.className="bag-count",o.textContent=String(t.count),i.appendChild(o)}}return i.addEventListener("click",()=>this.tap(e)),i}render(){const e=this.chest.length===Ih;this.title.textContent=`${e?"큰 상자":"상자"} (${this.chest.filter(Boolean).length}/${this.chest.length}칸 참)`,this.chestGrid.innerHTML="",this.chestGrid.classList.toggle("big",e);for(let n=0;n<this.chest.length;n++)this.chestGrid.appendChild(this.cell(n,this.chest[n],!1));this.bagGrid.innerHTML="";const t=this.chest.length;for(let n=0;n<fs;n++)this.bagGrid.appendChild(this.cell(t+n,this.bag[n],n<Ar))}slotAt(e){const t=this.chest.length;return e<t?this.chest[e]:this.bag[e-t]??null}tap(e){if(this.selected<0)this.slotAt(e)&&(this.selected=e);else if(this.selected===e)this.selected=-1;else{const t=this.slotAt(this.selected);if(t){const n=this.half?Math.max(1,Math.floor(t.count/2)):t.count;this.deps.onMove(this.selected,e,n)}this.selected=-1}this.render()}}let ti=625341585;function xo(){return ti^=ti<<13,ti^=ti>>>17,ti^=ti<<5,(ti>>>0)/4294967296}const pa=15,bo=2*Math.PI*pa,mb=["북","북동","동","남동","남","남서","서","북서"];class gb{el;touchUI;gaugeFg;hotbar;xpBar;xpFill;xpLevel;orbLayer;effects=[];slotEls=[];slotName;toastEl;debugEl;overlay;overlayTitle;overlaySub;overlayBtn;fullscreenBtn;debugBtn;bagBtn;rideBtn;skillBtn;heartsEl;vignette;vignetteTimer=null;skillBox;staminaFill;staminaText;skillLabel="✨ 빔";familyBtn;familyText;timeChip;timeChipMin;timeChipSub;todayEl;todayTime;todayList;todayNote;approvalEl;approvalText;today=null;approveChip;approveChipText;pending=[];currentAsk=null;onCheckTodo=null;onApprove=null;chatBtn;helpEl;compassRose;compassLabels;compassText;lastBearing=NaN;onHelpToggle=null;villageEl;slots=[];selected=0;nameTimer=null;toastTimer=null;onSelect=null;onOverlayClick=null;timerEl;timerPhase;timerTime;actionEl;actionTitle;actionSub;actionBtn;onAction=null;resultEl;onResultAgain=null;onResultClose=null;constructor(e,t){const n=document.createElement("div");n.className=`hud${t?" touch":""}`,n.innerHTML=`
      <div class="crosshair"></div>
      <svg class="gauge" viewBox="0 0 40 40" aria-hidden="true">
        <circle class="gauge-bg" cx="20" cy="20" r="${pa}"></circle>
        <circle class="gauge-fg" cx="20" cy="20" r="${pa}"></circle>
      </svg>
      <div class="slot-name"></div>
      <div class="hearts" aria-label="체력" hidden></div>
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
      </div>
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
      <div class="action-card" hidden>
        <div class="action-title"></div>
        <div class="action-sub"></div>
        <button class="big-btn action-btn"></button>
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
      </div>`,e.appendChild(n),this.el=n;const i=a=>n.querySelector(a);this.gaugeFg=i(".gauge-fg"),this.gaugeFg.style.strokeDasharray=`${bo}`,this.gaugeFg.style.strokeDashoffset=`${bo}`,this.hotbar=i(".hotbar"),this.heartsEl=i(".hearts"),this.vignette=i(".hurt-vignette"),this.xpBar=i(".xp-bar"),this.xpFill=i(".xp-fill"),this.xpLevel=i(".xp-level"),this.orbLayer=i(".xp-orbs"),this.slotName=i(".slot-name"),this.toastEl=i(".toast"),this.debugEl=i(".debug-text"),this.overlay=i(".overlay"),this.overlayTitle=i(".overlay-title"),this.overlaySub=i(".overlay-sub"),this.overlayBtn=i(".overlay .overlay-btn"),this.fullscreenBtn=i(".fullscreen"),this.debugBtn=i(".debug"),this.bagBtn=i(".bag-btn"),this.rideBtn=i(".ride-btn"),this.skillBtn=i(".skill-btn"),this.skillBox=i(".skill-box"),this.staminaFill=i(".stamina-fill"),this.staminaText=i(".stamina-text"),this.familyBtn=i(".help-family-btn"),this.familyText=i(".help-family-text"),this.timeChip=i(".time-chip"),this.timeChipMin=i(".time-chip-min"),this.timeChipSub=i(".time-chip-sub"),this.todayEl=i(".today-panel"),this.todayTime=i(".today-time"),this.todayList=i(".today-list"),this.todayNote=i(".today-note"),this.approvalEl=i(".approval-card"),this.approvalText=i(".approval-text"),this.approveChip=i(".approve-chip"),this.approveChipText=i(".approve-chip-text"),this.approveChip.addEventListener("click",a=>{a.preventDefault();const u=this.pending[0];u&&this.showApproval(u)}),this.timeChip.addEventListener("click",a=>{a.preventDefault(),this.todayEl.hidden?this.showToday():this.hideToday()}),i(".today-close").addEventListener("click",()=>this.hideToday()),this.todayEl.addEventListener("click",a=>{a.target===this.todayEl&&this.hideToday()}),i(".approval-ok").addEventListener("click",()=>this.decideApproval(!0)),i(".approval-no").addEventListener("click",()=>this.decideApproval(!1)),i(".approval-later").addEventListener("click",()=>this.decideApproval(null)),this.chatBtn=i(".chat-btn"),this.helpEl=i(".help-panel"),this.compassRose=i(".compass-rose"),this.compassLabels=Array.from(n.querySelectorAll(".compass-label")),this.compassText=i(".compass-text"),i(".help-body").innerHTML=_b(t);const r=a=>{a.preventDefault(),this.showHelp()},o=a=>{a.preventDefault(),this.hideHelp()};this.helpEl.addEventListener("click",a=>{a.target===this.helpEl&&this.hideHelp()}),i(".sbtn.help").addEventListener("click",r),i(".overlay .overlay-help").addEventListener("click",r),i(".help-panel .help-close").addEventListener("click",o),i(".help-ok").addEventListener("click",o),this.villageEl=i(".help-village"),this.timerEl=i(".exp-timer"),this.timerPhase=i(".exp-phase"),this.timerTime=i(".exp-time"),this.actionEl=i(".action-card"),this.actionTitle=i(".action-title"),this.actionSub=i(".action-sub"),this.actionBtn=i(".action-btn"),this.actionBtn.addEventListener("click",a=>{a.preventDefault(),this.onAction?.()}),this.resultEl=i(".result-panel"),i(".result-again").addEventListener("click",()=>{this.hideResult(),this.onResultAgain?.()}),i(".result-close").addEventListener("click",()=>{this.hideResult(),this.onResultClose?.()}),this.touchUI={surface:n,stickBase:i(".stick-base"),stickKnob:i(".stick-knob"),jumpButton:i(".jump"),sneakButton:i(".sneak")},this.overlayBtn.addEventListener("click",()=>this.onOverlayClick?.()),this.overlay.addEventListener("click",a=>{a.target===this.overlay&&this.onOverlayClick?.()})}setFullscreen(e){const t=this.fullscreenBtn;t.hidden=e==="hidden",t.classList.toggle("active",e==="on"),t.textContent=e==="on"?"⛶ 전체화면 끄기":"⛶ 전체화면",t.setAttribute("aria-label",e==="on"?"전체화면 끄기":"전체화면")}setSlots(e){const t=this.slotEls.length!==e.length;this.slots=e,t&&(this.hotbar.innerHTML="",this.slotEls.length=0,e.forEach((n,i)=>{const r=document.createElement("div");r.className="slot",r.dataset.index=String(i);const o=document.createElement("span");o.className="slot-key",o.textContent=String((i+1)%10),r.appendChild(o),r.addEventListener("pointerdown",a=>{a.preventDefault(),a.stopPropagation(),this.select(i),this.onSelect?.(i)}),this.hotbar.appendChild(r),this.slotEls.push(r)})),e.forEach((n,i)=>this.paintSlot(i,n)),t?this.select(0,!1):this.select(this.selected,!1)}paintSlot(e,t){const n=this.slotEls[e];if(n&&(n.querySelectorAll("canvas, .slot-count").forEach(i=>i.remove()),n.classList.toggle("empty",t.item===null),t.icon&&n.appendChild(t.icon),t.count>1)){const i=document.createElement("span");i.className="slot-count",i.textContent=String(t.count),n.appendChild(i)}}select(e,t=!0){this.slots.length!==0&&(e=(e%this.slots.length+this.slots.length)%this.slots.length,this.selected=e,this.slotEls.forEach((n,i)=>n.classList.toggle("selected",i===e)),t&&this.showSlotName(this.slots[e].item?this.slots[e].name:"빈 칸"))}selectDelta(e){this.select(this.selected+e)}get selectedIndex(){return this.selected}get selectedItem(){return this.slots[this.selected]?.item??null}showSlotName(e){this.slotName.textContent=e,this.slotName.classList.add("show"),this.nameTimer&&window.clearTimeout(this.nameTimer),this.nameTimer=window.setTimeout(()=>this.slotName.classList.remove("show"),1200)}setHeading(e){const t=(-e*180/Math.PI%360+360)%360;if(!(Math.abs(t-this.lastBearing)<.3)){this.lastBearing=t,this.compassRose.style.transform=`rotate(${-t}deg)`;for(const n of this.compassLabels)n.style.transform=`rotate(${t}deg)`;this.compassText.textContent=mb[Math.round(t/45)%8]}}get todayVisible(){return!this.todayEl.hidden}setToday(e){if(this.today=e,!e){this.timeChip.hidden=!0,this.todayEl.hidden=!0;return}this.timeChip.hidden=!1;const t=e.todos.filter(n=>n.status==="approved").length;this.timeChipMin.textContent=`⏱ ${e.remainingMin}분`,this.timeChipSub.textContent=e.todos.length?`할 일 ${t}/${e.todos.length}`:"",this.timeChip.classList.toggle("warn",e.remainingMin>0&&e.remainingMin<=5),this.timeChip.classList.toggle("danger",e.remainingMin<=0),this.renderToday()}renderToday(){const e=this.today;if(!e)return;const t=e.manualAdj?` ${e.manualAdj>0?"+":"−"}${Math.abs(e.manualAdj)}분 조정`:"";this.todayTime.innerHTML="";const n=document.createElement("div");n.className="today-remaining",n.textContent=`남은 시간 ${e.remainingMin}분`;const i=document.createElement("div");if(i.className="today-detail",i.textContent=`기본 ${e.baseMin}분 + 보너스 ${e.bonusMin}/${e.bonusCap}분${t} − 쓴 ${e.usedMin}분`,this.todayTime.append(n,i),this.todayList.innerHTML="",e.todos.length===0){const o=document.createElement("li");o.className="today-empty",o.textContent="오늘 할 일이 없어요. 아빠·엄마가 /family 에서 만들어요",this.todayList.appendChild(o)}for(const o of e.todos){const a=document.createElement("li"),u=document.createElement("span");if(u.className="todo-title",u.textContent=o.title,a.appendChild(u),o.status==="pending"||o.status==="rejected"){if(o.status==="rejected"){const h=document.createElement("span");h.className="todo-state",h.textContent="다시 해 봐요",a.appendChild(h)}const d=document.createElement("button");d.className="todo-btn",d.textContent="했어요",d.addEventListener("click",()=>{d.disabled=!0,this.onCheckTodo?.(o.id)}),a.appendChild(d)}else{const d=document.createElement("span");d.className="todo-state",d.textContent=o.status==="approved"?"✅ 했어요":"⏳ 확인 기다리는 중",a.appendChild(d)}this.todayList.appendChild(a)}for(const o of e.adjustments){const a=document.createElement("li");a.className="today-adjust";const u=document.createElement("span");u.className="todo-title",u.textContent=`아빠·엄마 조정 ${o.min>0?"+":"−"}${Math.abs(o.min)}분${o.reason?` — ${o.reason}`:""}`,a.appendChild(u),this.todayList.appendChild(a)}const r=[];e.weekMessage?r.push(e.weekMessage):r.push("처음이니까 믿고 시작할게. 이번 주 할 일을 잘하면 다음 주 보너스가 정해져요."),e.noPlayToday&&r.push("오늘은 게임 없는 날이에요."),e.todos.some(o=>o.needsApproval)&&r.push("아빠·엄마가 확인해 주면 시간이 더 생겨요."),e.blocked?r.push(e.nextOpen?`지금은 게임 시간이 아니에요. ${e.nextOpen} 에 열려요.`:"지금은 게임 시간이 아니에요."):e.minutesUntilBlocked<1440&&r.push(`게임 시간은 ${e.minutesUntilBlocked}분 뒤에 끝나요.`),r.push(e.enforced?"남은 시간이 0 이 되면 마을에서 나가요. 5분 동안 가만히 있어도 나가요.":"지금은 시간을 재기만 해요. 0 이 돼도 게임은 계속돼요."),this.todayNote.textContent=r.join(" ")}showToday(){this.today&&(this.renderToday(),this.todayEl.hidden=!1)}hideToday(){this.todayEl.hidden=!0}setPending(e){this.pending=e,this.approveChip.hidden=e.length===0,this.approveChipText.textContent=`✅ 승인 ${e.length}`,this.currentAsk&&!e.some(t=>t.id===this.currentAsk.id&&t.date===this.currentAsk.date)&&(this.currentAsk=null,this.approvalEl.hidden=!0)}showApproval(e){this.currentAsk=e;const t=this.pending.filter(n=>!(n.id===e.id&&n.date===e.date)).length;this.approvalText.textContent=`${e.child}: "${e.title}" 했대요. 확인해 주세요${t>0?` (${t}개 더 기다려요)`:""}`,this.approvalEl.hidden=!1}decideApproval(e){const t=this.currentAsk;this.currentAsk=null,this.approvalEl.hidden=!0,!(!t||e===null)&&(this.onApprove?.(t,e),this.setPending(this.pending.filter(n=>!(n.id===t.id&&n.date===t.date))))}setHealth(e,t){this.heartsEl.hidden=!1;const n=Math.ceil(t/2);let i="";for(let r=0;r<n;r++){const o=Math.max(0,Math.min(2,e-r*2));i+=`<span class="heart ${o===2?"full":o===1?"half":"empty"}"></span>`}this.heartsEl.innerHTML=i,this.heartsEl.classList.toggle("low",e<=6)}hurtFlash(){this.vignette.classList.add("on"),this.vignetteTimer&&clearTimeout(this.vignetteTimer),this.vignetteTimer=setTimeout(()=>this.vignette.classList.remove("on"),350)}setXp(e){const t=xr(e);this.xpBar.hidden=!1,this.xpFill.style.width=`${Math.round(t.progress*100)}%`,this.xpLevel.textContent=String(t.level),this.xpLevel.classList.toggle("zero",t.level===0)}xpOrbs(e,t,n,i=0){const r=this.xpBar.getBoundingClientRect(),o=this.el.getBoundingClientRect(),a=r.left+r.width/2-o.left,u=r.top+r.height/2-o.top;if(i>0){const d=document.createElement("div");d.className="xp-float",d.textContent=`+${i}`,d.style.left=`${a}px`,d.style.top=`${u-28}px`,d.style.opacity="0",this.orbLayer.appendChild(d),this.effects.push({el:d,kind:"label",t:0,delay:0,dur:1.6,sx:a,sy:u-28,mx:a,my:u-68,tx:a,ty:u-68})}for(let d=0;d<n;d++){const h=document.createElement("div");h.className="xp-orb",h.style.left=`${e}px`,h.style.top=`${t}px`,h.style.opacity="0",this.orbLayer.appendChild(h);const l=xo()*Math.PI*2,c=24+xo()*56;this.effects.push({el:h,kind:"orb",t:0,delay:d*.07,dur:1.1+xo()*.5,sx:e,sy:t,mx:e+Math.cos(l)*c,my:t+Math.sin(l)*c-40,tx:a,ty:u})}}tickEffects(e){if(this.effects.length===0)return;const t=n=>1-(1-n)*(1-n);for(let n=this.effects.length-1;n>=0;n--){const i=this.effects[n];i.t+=e;const r=Math.max(0,Math.min(1,(i.t-i.delay)/i.dur));if(i.t<i.delay)continue;let o,a,u,d;if(i.kind==="label")o=i.sx,a=i.sy+(i.ty-i.sy)*r,u=r<.2?.8+r/.2*.35:1.15-(r-.2)/.8*.15,d=r<.2?r/.2:1-(r-.2)/.8;else if(r<.3){const h=t(r/.3);o=i.sx+(i.mx-i.sx)*h,a=i.sy+(i.my-i.sy)*h,u=.6+.5*h,d=.9+.1*h}else{const h=(r-.3)/.7,l=h*h;o=i.mx+(i.tx-i.mx)*l,a=i.my+(i.ty-i.my)*l,u=1.1-.6*h,d=1-.8*h}i.el.style.left=`${o}px`,i.el.style.top=`${a}px`,i.el.style.opacity=String(d),i.el.style.transform=`translate(-50%, -50%) scale(${u.toFixed(3)})`,r>=1&&(i.el.remove(),this.effects.splice(n,1))}}setRiding(e,t="빔"){this.rideBtn.hidden=!e,this.skillBox.hidden=!e,this.skillLabel=`✨ ${t}`,this.skillBtn.textContent=this.skillLabel}setStamina(e,t,n,i){const r=t>0?Math.max(0,Math.min(1,e/t)):0;this.staminaFill.style.width=`${Math.round(r*100)}%`,this.staminaFill.classList.toggle("low",e<n),this.staminaText.textContent=`${Math.floor(e)} / ${t}`,this.skillBtn.disabled=i>0||e<n,this.skillBtn.classList.toggle("cooling",i>0);const o=i>0?`⏳ ${Math.ceil(i)}`:this.skillLabel;this.skillBtn.textContent!==o&&(this.skillBtn.textContent=o)}setFamily(e,t=null){if(t){this.familyText.textContent=`부모로 연결됨 (가족 코드 ${t}) — 아이가 할 일을 체크하면 승인 카드가 떠요`,this.familyBtn.hidden=!0;return}this.familyBtn.hidden=!1,this.familyText.textContent=e?`가족 연결됨 (코드 ${e}) — 위의 ⏱ 에서 오늘 할 일과 남은 시간을 봐요`:"아빠·엄마 화면(/family)의 가족 코드로 내 계정을 연결해요 (아이만)",this.familyBtn.textContent=e?"다시 연결":"가족 연결"}setVillageInfo(e){this.villageEl.textContent=e}setProgress(e){const t=e>0;this.gaugeFg.parentElement.classList.toggle("show",t),t&&(this.gaugeFg.style.strokeDashoffset=`${bo*(1-Math.min(1,e))}`)}toast(e,t=4e3){this.toastEl.textContent=e,this.toastEl.hidden=!1,this.toastTimer&&window.clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>this.toastEl.hidden=!0,t)}setDebug(e){this.debugEl.hidden=e===null,e!==null&&(this.debugEl.textContent=e)}setTimer(e,t){if(e===null){this.timerEl.hidden=!0;return}this.timerEl.hidden=!1;const n=Math.floor(e/60),i=Math.floor(e%60);this.timerTime.textContent=n+":"+String(i).padStart(2,"0"),this.timerPhase.textContent=t==="night"?"🌙 밤":t==="evening"?"🌇 저녁":"☀️ 낮",this.timerEl.classList.toggle("warn",e<=180),this.timerEl.classList.toggle("danger",e<=60),this.timerEl.classList.toggle("night",t==="night")}showAction(e,t,n,i){this.onAction=i,this.actionTitle.textContent!==e&&(this.actionTitle.textContent=e),this.actionSub.textContent!==t&&(this.actionSub.textContent=t),this.actionBtn.textContent!==n&&(this.actionBtn.textContent=n),this.actionEl.hidden=!1}hideAction(){this.actionEl.hidden=!0,this.onAction=null}triggerAction(){this.actionEl.hidden||this.onAction?.()}get actionVisible(){return!this.actionEl.hidden}showResult(e,t,n,i,r,o){this.onResultAgain=r,this.onResultClose=o;const a=d=>this.resultEl.querySelector(d);a(".result-title").textContent=e,a(".result-sub").textContent=t;const u=a(".result-items");if(u.innerHTML="",n.length===0){const d=document.createElement("li");d.className="result-empty",d.textContent="이번엔 빈손이에요. 블록을 부수면 가져올 수 있어요",u.appendChild(d)}for(const d of n){const h=document.createElement("li");d.icon&&h.appendChild(d.icon);const l=document.createElement("span");l.className="result-name",l.textContent=d.name;const c=document.createElement("span");c.className="result-count",c.textContent="×"+d.count,h.append(l,c),u.appendChild(h)}a(".result-again").textContent=i,this.resultEl.hidden=!1}hideResult(){this.resultEl.hidden=!0}get resultVisible(){return!this.resultEl.hidden}showOverlay(e,t,n){this.overlayTitle.textContent=e,this.overlaySub.textContent=t,this.overlayBtn.textContent=n??"",this.overlayBtn.hidden=n===null,this.overlay.classList.add("show")}hideOverlay(){this.overlay.classList.remove("show")}get overlayVisible(){return this.overlay.classList.contains("show")}showHelp(){this.helpEl.hidden&&(this.helpEl.hidden=!1,this.helpEl.querySelector(".help-card").scrollTop=0,this.onHelpToggle?.(!0))}hideHelp(){this.helpEl.hidden||(this.helpEl.hidden=!0,this.onHelpToggle?.(!1))}get helpVisible(){return!this.helpEl.hidden}}function _b(s){const e=s?[["걷기","왼쪽 아래 <b>스틱</b>을 누른 채 밀기. 끝까지 앞으로 밀면 달리기"],["둘러보기","스틱이 아닌 곳을 <b>드래그</b>"],["블록 놓기","놓을 자리를 <b>짧게 탭</b>"],["블록 부수기","블록을 <b>꾹 누르기</b>. 게이지가 차고 금이 가면 부서져요"],["점프","오른쪽 아래 <b>▲</b> (꾹 누르면 그동안, <b>두 번 톡톡</b> 치면 손을 떼도 계속 눌린 채. 다시 한 번 누르면 풀려요)"],["웅크리기","<b>▼</b> (▲ 와 같아요 — 꾹 누르면 그동안, 두 번 톡톡 치면 계속). 웅크리면 모서리에서 안 떨어져요"],["블록 고르기","아래 칸(핫바)을 탭"],["가방 · 만들기","핫바 옆 <b>🎒</b>. 칸을 탭해 고르고 다른 칸을 탭하면 옮겨요"],["채팅","<b>💬</b> → 이모지나 문구를 골라요"],["FPS 보기","오른콽 위 <b>i</b>"]]:[["걷기 / 달리기","<b>W A S D</b> / Ctrl 누른 채 W"],["둘러보기","마우스. 클릭하면 마우스가 잠기고, <b>ESC</b>로 풀려요"],["블록 놓기","<b>오른쪽 클릭</b> (누르고 있으면 연속)"],["블록 부수기","<b>왼쪽 클릭 꾹</b>. 금이 가면 부서져요"],["점프 / 웅크리기","<b>Space</b> / <b>Shift</b>"],["블록 고르기","<b>1~9, 0</b> 또는 마우스 휠"],["가방 · 만들기","<b>E</b> (또는 핫바 옆 🎒)"],["채팅","<b>T</b> (또는 💬) → 이모지·문구 고르기"],["정보","<b>F3</b>"]],t=s?"PC 에서는: WASD 이동 · 마우스 둘러보기 · 왼쪽 클릭 꾹 부수기 · 오른쪽 클릭 놓기 · 1~9 블록":"폰에서는: 왼쪽 아래 스틱 · 드래그로 둘러보기 · 짧게 탭 놓기 · 꾹 눌러 부수기 · ▲ 점프",n=["왼쪽 위 <b>나침반</b>: 맨 위 글자가 지금 내가 보는 방향이에요(북은 빨강). 광장에서 북쪽에 포탈 자리와 강, 서쪽·동쪽에 큰 밭, 남쪽에 집 뼈대, 둘레는 참나무 숲과 언덕.","<b>블록은 유한</b>해요. 부수면 가방에 들어오고, 놓으면 가방에서 나가요. 처음엔 시작 키트(판자·흙·조약돌·횃불·유리·제작대·양동이)를 받아요. 물은 빈 양동이로 떠서 옮겨요.","<b>만들기</b>: 가방 화면의 🔨 탭. 판자·제작대 같은 건 어디서나, 문·계단 같은 건 <b>제작대</b>를 놓고 그 옆(5칸)에서. 양조기 옆에서는 ⚗️ 탭이 생겨요. 레시피는 아빠·아들이 recipes.json 에 적어요.","한 칸 높은 턱은 그냥 걸어가면 올라가요. 두 칸부터는 점프.","손에 든 블록이 오른쪽 아래에 보이고, 조준한 블록엔 검은 테두리가 생겨요. 닿는 거리는 5블록.","블록마다 부수는 시간이 달라요. 흙·모래 0.5초, 돌 1.5초, 원목·판자 2초. 맨 아래 기반암과 물은 못 부숴요.","내 몸이 있는 자리에는 블록을 놓을 수 없어요.","물에 들어가면 천천히 가라앉고, 점프를 누르면 위로 헤엄쳐요.","내가 놓은 물·용암은 양동이 하나만큼이에요. 사방으로 퍼지면서 낮아지고, 양만큼만 퍼지고 멈춰요(위로는 안 차요). 강·연못 같은 원래 있던 물은 마르지 않아요. 물이나 용암을 꾹 누르면(PC: 왼쪽 클릭) 떠내거나 닦아낼 수 있어요. 물이 용암을 만나면 돌이 돼요.","광장 남쪽에 뼈대만 있는 집이 있어요. 문·창문·지붕을 채워 봐요. 동남쪽 언덕엔 동굴 입구가 있고 땅속엔 광물과 동굴이 있어요.",'<b>원정</b>: 광장 북쪽 보라색 포탈 안에 서면 "원정 출발" 버튼이 나와요. 초원 섬에 10분 동안 다녀오는데, 6분이 지나면 밤이 돼요. 섬 가운데 포탈로 돌아오면 부순 블록을 마을 창고에 가져와요. 시간이 다 되면 저절로 돌아오지만 절반만 가져와요. 친구가 먼저 갔으면 같은 포탈에서 "따라가기".',"세계 끝은 보이지 않는 벽. 떨어지면 광장으로 돌아와요.","만든 것은 서버에 저장돼요. 같은 마을 코드로 들어오면 어느 폰·PC 에서도 같은 마을이에요. 친구에게 마을 코드 6자리를 알려 주면 함께 지을 수 있어요(6명까지).",'다른 사람이 놓거나 부순 블록도 바로 보여요. 서버가 "너무 멀어요" 같은 말을 하면 그 블록은 되돌아가요.'];return`<table class="help-table">${e.map(([i,r])=>`<tr><th>${i}</th><td>${r}</td></tr>`).join("")}</table><p class="help-other">${t}</p><h3>알아두면 좋아요</h3><ul class="help-tips">${n.map(i=>`<li>${i}</li>`).join("")}</ul>`}function vb(s,e){if(s===null)return"어른";const t=s-e;if(t<=0)return"곧 어른이 돼요";const n=Math.ceil(t/6e4);return n>=60?`어른까지 ${Math.floor(n/60)}시간 ${n%60}분`:`어른까지 ${n}분`}class Ab{constructor(e,t){this.deps=t,this.el=document.createElement("div"),this.el.className="nest-panel",this.el.hidden=!0,this.el.innerHTML=`
      <div class="help-card nest-card">
        <div class="help-head">
          <h2>🥚 드래곤 둥지</h2>
          <button class="help-close nest-close" aria-label="닫기">✕</button>
        </div>
        <div class="nest-body"></div>
      </div>`,e.appendChild(this.el),this.body=this.el.querySelector(".nest-body"),this.el.querySelector(".nest-close").addEventListener("click",()=>t.onClose()),this.el.addEventListener("click",n=>{n.target===this.el&&t.onClose()})}deps;el;inv=[];mine=[];slots=[];nestDragons=[];xpTotal=0;body;get visible(){return!this.el.hidden}show(){this.el.hidden=!1,this.render()}hide(){this.el.hidden=!0}setInventory(e){this.inv=e,this.visible&&this.render()}setDragons(e){this.mine=e,this.visible&&this.render()}setNest(e,t){this.slots=e,t&&(this.nestDragons=t),this.visible&&this.render()}setXp(e){this.xpTotal=e,this.visible&&this.render()}eggsInBag(){const e=new Map;for(const t of this.inv)t&&Yd(t.item)&&e.set(t.item,(e.get(t.item)??0)+t.count);return[...e].map(([t,n])=>({item:t,count:n}))}countOf(e){let t=0;for(const n of this.inv)n&&n.item===e&&(t+=n.count);return t}chip(e){const t=document.createElement("span");return t.className="nest-chip",t.style.background=e??"#999",t}render(){const e=this.body;e.innerHTML="";const t=xr(this.xpTotal).level,n=this.eggsInBag(),i=this.deps.now?this.deps.now():Date.now(),r=document.createElement("p");r.className="nest-note",r.textContent=`내 레벨 ${t} · 가방에 알 ${n.reduce((c,f)=>c+f.count,0)}개 · 내 드래곤 ${this.mine.filter(c=>c.stage!=="egg").length}마리`,e.appendChild(r);const o=document.createElement("div");o.className="nest-slots";const a=this.deps.eggSlots();for(let c=0;c<a;c++){const f=document.createElement("div");f.className="nest-slot";const g=this.slots.find(m=>m.slot===c),_=document.createElement("div");if(_.className="nest-slot-title",g){const m=this.deps.dragons.find(g.dragon);if(_.append(this.chip(m?.color),document.createTextNode(` ${m?.name??g.dragon} 알 — ${g.mine?"내 것":`${g.owner} 것`}`)),f.appendChild(_),g.mine&&m){const p=qd(this.deps.xp,m.tier),w=t>=p,E=document.createElement("button");E.className="big-btn nest-btn",E.textContent=w?`부화하기 (레벨 ${p} 씀)`:`부화하려면 레벨 ${p} (지금 ${t})`,E.disabled=!w,E.addEventListener("click",()=>this.deps.onHatch(g.id)),f.appendChild(E)}}else{_.textContent=`${c+1}번 자리 — 비었어요`,f.appendChild(_);for(const m of n){const p=document.createElement("button");p.className="plain-btn nest-btn",p.textContent=`${this.deps.nameOf(m.item)} 놓기${m.count>1?` (${m.count})`:""}`,p.addEventListener("click",()=>this.deps.onPlace(c,m.item)),f.appendChild(p)}if(n.length===0){const m=document.createElement("div");m.className="nest-hint",m.textContent="제작대에서 재료로 알을 만들어 와요",f.appendChild(m)}}o.appendChild(f)}if(a<Kd){const c=document.createElement("div");c.className="nest-hint",c.textContent=`알 자리 ${a}개 · 창고에서 ${a<6?"큰 둥지를":"드래곤 성을"} 지으면 2개 더 열려요`,o.appendChild(c)}e.appendChild(o);const u=document.createElement("h3");u.textContent=`둥지의 드래곤 ${this.nestDragons.length}마리`,e.appendChild(u);const d=document.createElement("ul");if(d.className="nest-list",this.nestDragons.length===0){const c=document.createElement("li");c.className="nest-hint",c.textContent="아직 없어요. 알을 놓고 부화시켜요!",d.appendChild(c)}const h=[...this.nestDragons].sort((c,f)=>Number(f.mine)-Number(c.mine)||c.id-f.id);for(const c of h){const f=this.deps.dragons.find(c.dragon),g=document.createElement("li"),_=document.createElement("div");if(_.append(this.chip(f?.color),document.createTextNode(` ${f?.name??c.dragon} · ${c.stage==="baby"?"아기":"어른"} · ${c.mine?"내 것":`${c.owner} 것`}`)),g.appendChild(_),c.stage==="adult"&&c.mine){const m=document.createElement("div");if(m.className="nest-feed",this.countOf(Cc)>0){const p=document.createElement("button");p.className="big-btn nest-btn",p.textContent="🐉 타기",p.addEventListener("click",()=>this.deps.onRide(c.id)),m.appendChild(p)}else{const p=document.createElement("span");p.className="nest-hint",p.textContent="안장이 있으면 탈 수 있어요 (제작대: 가죽 5 + 철 2, 가죽은 원정 보물 상자)",m.appendChild(p)}g.appendChild(m)}if(c.stage==="baby"){const m=document.createElement("div");if(m.className="nest-hint",m.textContent=vb(c.growAt,i)+(c.mine?` · 먹이 ${c.fed}개 줬어요`:""),g.appendChild(m),c.mine&&f){const p=document.createElement("div");p.className="nest-feed";const w=Qd(f);let E=!1;for(const y of w){const k=this.countOf(y);if(k<=0)continue;E=!0;const v=document.createElement("button");v.className="plain-btn nest-btn",v.textContent=`${this.deps.nameOf(y)} 먹이기 (${k})`,v.addEventListener("click",()=>this.deps.onFeed(c.id,y)),p.appendChild(v)}if(!E){const y=document.createElement("span");y.className="nest-hint",y.textContent=`먹이: ${w.map(k=>this.deps.nameOf(k)).join("·")} (1개 = 10분 빨리 자라요)`,p.appendChild(y)}g.appendChild(p)}}d.appendChild(g)}e.appendChild(d);const l=document.createElement("p");l.className="nest-note",l.textContent="아기는 1시간이면 어른이 돼요(먹이로 더 빨리). 어른은 안장을 만들어 탈 수 있어요. 빔은 다음 단계에서.",e.appendChild(l)}}const xb=150,cc=400,Cr=new Sa(1,1,1,10,1,!0);Cr.rotateX(Math.PI/2);Cr.translate(0,0,.5);class bb{group=new Mt;beams=[];constructor(e){e.add(this.group)}get count(){return this.beams.length}fire(e,t,n,i,r=Nh,o=performance.now()){const a=Math.max(1,Math.min(5,i)),u=.12+.07*a,d=new Je(n),h=new mt(Cr,new Zt({color:d.clone().lerp(new Je(16777215),.4),transparent:!0,opacity:.95,blending:Vi,depthWrite:!1,side:Jt})),l=new mt(Cr,new Zt({color:d,transparent:!0,opacity:.35+.08*a,blending:Vi,depthWrite:!1,side:Jt}));h.scale.set(u*.45,u*.45,.01),l.scale.set(u,u,.01);const c=new Mt;c.add(l,h),c.position.set(e.x,e.y,e.z);const f=Math.hypot(t.x,t.y,t.z)||1;c.lookAt(e.x+t.x/f,e.y+t.y/f,e.z+t.z/f),this.group.add(c),this.beams.push({group:c,core:h,glow:l,born:o,range:r})}update(e=performance.now()){for(let t=this.beams.length-1;t>=0;t--){const n=this.beams[t],i=e-n.born;if(i>=ps){this.group.remove(n.group),n.core.material.dispose(),n.glow.material.dispose(),this.beams.splice(t,1);continue}const r=n.range*Math.min(1,i/xb);n.core.scale.z=r,n.glow.scale.z=r;const o=i>ps-cc?(ps-i)/cc:1,a=1+.12*Math.sin(i*.03);n.core.material.opacity=.95*o,n.glow.material.opacity=(.35+.08*(n.glow.scale.x-.12)/.07)*o*a}}dispose(){for(const e of this.beams)this.group.remove(e.group),e.core.material.dispose(),e.glow.material.dispose();this.beams.length=0}}class yb{constructor(e,t){this.deps=t,this.el=document.createElement("div"),this.el.className="bag-panel storage-panel",this.el.hidden=!0,this.el.innerHTML=`
      <div class="bag-card storage-card">
        <div class="bag-head">
          <div class="bag-tabs storage-tabs"></div>
          <button class="plain-btn storage-close" aria-label="닫기">✕</button>
        </div>
        <div class="storage-title"></div>
        <div class="storage-body"></div>
      </div>`,e.appendChild(this.el),this.title=this.el.querySelector(".storage-title"),this.tabs=this.el.querySelector(".storage-tabs"),this.body=this.el.querySelector(".storage-body"),this.el.querySelector(".storage-close").addEventListener("click",()=>t.onClose()),this.el.addEventListener("click",n=>{n.target===this.el&&t.onClose()})}deps;el;inv=[];stock=new Map;built=new Set;level=1;codexCount=0;tab="stock";title;tabs;body;get visible(){return!this.el.hidden}show(e="stock"){this.tab=e,this.el.hidden=!1,this.render()}hide(){this.el.hidden=!0}setInventory(e){this.inv=e,this.visible&&this.render()}setStorage(e){this.stock=new Map(e.map(t=>[t.item,t.count])),this.visible&&this.render()}setVillage(e,t,n){this.built=new Set(e),this.level=t,this.codexCount=n,this.visible&&this.render()}mine(e){let t=0;for(const n of this.inv)n&&n.item===e&&(t+=n.count);return t}render(){const e=this.body.querySelector(".storage-list")?.scrollTop??0;this.tabs.innerHTML="";const t=[["stock","📦 창고"],["build","🏗️ 건물"]];for(const[i,r]of t){const o=document.createElement("button");o.className="bag-tab"+(this.tab===i?" on":""),o.textContent=r,o.addEventListener("click",()=>{this.tab=i,this.render()}),this.tabs.appendChild(o)}this.title.textContent=`🏘️ 마을 레벨 ${this.level} · 건물 ${this.built.size}개 · 도감 ${this.codexCount}종`,this.body.innerHTML="",this.tab==="stock"?this.renderStock():this.renderBuild();const n=this.body.querySelector(".storage-list");n&&e>0&&(n.scrollTop=e)}btn(e,t,n,i=!1){const r=document.createElement("button");return r.className=t,r.textContent=e,r.disabled=i,r.addEventListener("click",n),r}renderStock(){const e=document.createElement("p");e.className="bag-tip",e.textContent="마을 모두가 같이 쓰는 창고예요. 넣은 재료로 건물을 지어요. 누가 얼마나 넣었는지는 세지 않아요.",this.body.appendChild(e);const t=new Set([...this.stock.keys()]);for(const r of this.inv)r&&t.add(r.item);const n=document.createElement("div");n.className="storage-list";const i=[...t].sort((r,o)=>(this.stock.get(o)??0)-(this.stock.get(r)??0)||r.localeCompare(o));for(const r of i){const o=this.stock.get(r)??0,a=this.mine(r),u=document.createElement("div");u.className="storage-row";const d=this.deps.icon(r,28);d&&u.appendChild(d);const h=document.createElement("div");h.className="storage-text",h.innerHTML=`<b>${this.deps.nameOf(r)}</b><br><span class="storage-sub">창고 ${o} · 내 가방 ${a}</span>`,u.appendChild(h);const l=document.createElement("div");l.className="storage-acts",l.append(this.btn("넣기 1","plain-btn small",()=>this.deps.onMove(r,1,"in"),a<1),this.btn("전부 넣기","plain-btn small",()=>this.deps.onMove(r,a,"in"),a<1),this.btn("꺼내기 1","plain-btn small",()=>this.deps.onMove(r,1,"out"),o<1),this.btn("꺼내기 16","plain-btn small",()=>this.deps.onMove(r,Math.min(16,o),"out"),o<1)),u.appendChild(l),n.appendChild(u)}i.length===0&&(n.textContent="창고도 가방도 비어 있어요. 원정에서 모아 와요!"),this.body.appendChild(n)}renderBuild(){const e=document.createElement("div");e.className="storage-list";const t=[...this.deps.buildings.list].sort((r,o)=>r.level-o.level),n=r=>this.built.has(r)||Jd.includes(r)||r==="dragon_nest_1";for(const r of t){const o=Rc(r.id),a=n(r.id),u=document.createElement("div");u.className="storage-row"+(a?" built":"");const d=document.createElement("div");d.className="storage-text";const h=Object.entries(r.cost).map(([g,_])=>`${this.deps.nameOf(g)} ${Math.min(this.stock.get(g)??0,_)}/${_}`).join(" · "),l=jd(this.stock,r.cost),c=r.requires&&!n(r.requires)?this.deps.buildings.find(r.requires)?.name:null;let f;if(a?f="✅ 지어졌어요":o?this.level<r.level?f=`마을 레벨 ${r.level} 필요 (지금 ${this.level})`:c?f=`${c}를 먼저 지어요`:Object.keys(l).length?f=`모자라요: ${Object.entries(l).map(([g,_])=>`${this.deps.nameOf(g)} ${_}`).join(", ")}`:f="지을 수 있어요!":f="🔒 다음 단계에서",d.innerHTML=`<b>${r.name}</b> <span class="craft-station">레벨 ${r.level}</span><br><span class="storage-sub">${h||"비용 없음"}</span><br><span class="storage-sub">${f}</span>`,u.appendChild(d),!a&&o){const g=this.level>=r.level&&!c&&Object.keys(l).length===0;u.appendChild(this.btn("짓기","big-btn small",()=>this.deps.onBuild(r.id),!g))}e.appendChild(u)}this.body.appendChild(e);const i=document.createElement("p");i.className="nest-note",i.textContent="건물은 광장 둘레 정해진 자리에 서고, 아무도 부술 수 없어요. 마을 레벨은 건물 수와 도감(처음 손에 넣은 블록 종류 10개마다)으로 올라가고, 광장 북쪽 깃대에 레벨만큼 깃발이 걸려요.",this.body.appendChild(i)}}const dc=new Ta(.16,0),Eb=new Zt({color:14679984,transparent:!0,opacity:.95,blending:Vi,depthWrite:!1}),Mb=new Zt({color:8388352,transparent:!0,opacity:.45,blending:Vi,depthWrite:!1});class Sb{group=new Mt;orbs=new Map;t=0;constructor(e){e.add(this.group)}get count(){return this.orbs.size}set(e){const t=new Set;for(const n of e)t.add(n.id),this.orbs.has(n.id)||this.add(n);for(const n of[...this.orbs.keys()])t.has(n)||this.remove(n)}add(e){if(this.orbs.has(e.id))return;const t=new Mt,n=new mt(dc,Eb),i=new mt(dc,Mb);i.scale.setScalar(1.8+Math.min(1.5,e.amount/40)),t.add(i,n),t.position.set(e.x,e.y+.3,e.z),this.group.add(t),this.orbs.set(e.id,{group:t,info:e,phase:e.id*.7%(Math.PI*2)})}remove(e){const t=this.orbs.get(e);t&&(this.group.remove(t.group),this.orbs.delete(e))}clear(){for(const e of[...this.orbs.keys()])this.remove(e)}update(e){this.t+=e;for(const t of this.orbs.values())t.group.rotation.y=this.t*2+t.phase,t.group.position.y=t.info.y+.3+.08*Math.sin(this.t*3+t.phase)}}const wb={shirt:3107450,skin:6130506,hair:2899499,pants:3814752,shoes:2433311},Tb=5025616;function Cb(s){return"#"+s.toString(16).padStart(6,"0")}function Rb(){const s=[],e=(i,r,o,a,u,d,h)=>{for(let l=o;l<=a;l++)for(let c=u;c<=d;c++)for(let f=i;f<=r;f++)s.push({x:f,y:l,z:c,c:Cb(h(f,l,c))})},t=(i,r,o)=>{const u=.85+((i*73856093^r*19349663^o*83492791)>>>0)%100/100*.3,d=Math.min(255,Math.round(76*u)),h=Math.min(255,Math.round(175*u)),l=Math.min(255,Math.round(80*u));return d<<16|h<<8|l};for(const[i,r]of[[-4,-4],[0,-4],[-4,1],[0,1]])e(i,i+3,0,5,r,r+3,t);e(-2,1,6,17,-2,1,t);const n=["        ","        "," xx  xx "," xx  xx ","   xx   ","  xxxx  ","  x  x  ","  x  x  "];return e(-4,3,18,25,-4,3,(i,r,o)=>o===-4&&n[25-r][i+4]==="x"?1053712:t(i,r,o)),s}function ni(s,e){const t=Da(s,pn,wc);return t.translate(pn/2,0,pn/2),new mt(t,e)}const Db=new qn(.16,.16,.16);class Pb{group=new Mt;figures=new Map;bursts=[];constructor(e){e.add(this.group)}get count(){return this.figures.size}make(e){const t=new Zt({vertexColors:!0}),n=new Mt,i=new Mt;let r=null,o=null,a=null,u=null;if(Zd[e.kind]==="zombie"){const d=Ec(wb),h=(f,g)=>(f.position.set(g[0]*pn,g[1]*pn,0),f),l=h(ni(d.torso,t),[0,12]),c=h(ni(d.head,t),[0,24]);a=h(ni(d.leg,t),[-2,12]),u=h(ni(d.leg,t),[2,12]),r=h(ni(d.arm,t),[-6,24]),o=h(ni(d.arm,t),[6,24]),r.rotation.x=o.rotation.x=-Math.PI/2+.15,i.add(l,c,a,u,r,o)}else i.add(ni(Rb(),t));return n.add(i),this.group.add(n),{group:n,body:i,material:t,kind:e.kind,cur:{x:e.x,y:e.y,z:e.z,yaw:e.yaw},target:{x:e.x,y:e.y,z:e.z,yaw:e.yaw},state:e.state,hp:e.hp,flashUntil:0,fuseT:0,armL:r,armR:o,legL:a,legR:u,walk:0}}setState(e){const t=new Set;for(const n of e){t.add(n.id);let i=this.figures.get(n.id);i||(i=this.make(n),i.group.position.set(n.x,n.y,n.z),this.figures.set(n.id,i)),i.target={x:n.x,y:n.y,z:n.z,yaw:n.yaw},i.state=n.state,i.hp=n.hp}for(const n of[...this.figures.keys()])t.has(n)||this.remove(n)}event(e,t,n,i,r,o=performance.now()){const a=this.figures.get(t);e==="hit"&&a?a.flashUntil=o+160:(e==="die"||e==="explode")&&(this.burst(n,i+Fr.h*.5,r,e==="explode"?16765562:a?a.kind===0?6130506:Tb:16777215,e==="explode"?28:12,o),this.remove(t))}burst(e,t,n,i,r,o){const a=new Mt,u=new Zt({color:i,transparent:!0,opacity:.95}),d=[];for(let h=0;h<r;h++){const l=new mt(Db,u),c=h/r*Math.PI*2,f=h*7%r/r-.5,g=new G(Math.cos(c)*(2+f),2.5+f*2,Math.sin(c)*(2+f));l.position.set(e,t,n),d.push({m:l,v:g}),a.add(l)}this.group.add(a),this.bursts.push({group:a,born:o,parts:d})}remove(e){const t=this.figures.get(e);t&&(this.group.remove(t.group),t.material.dispose(),t.group.traverse(n=>{n instanceof mt&&n.geometry.dispose()}),this.figures.delete(e))}clear(){for(const e of[...this.figures.keys()])this.remove(e);for(const e of this.bursts)this.group.remove(e.group);this.bursts.length=0}aim(e,t,n){let i=null,r=n;const o=Fr.w/2;for(const[a,u]of this.figures){const d=u.cur,h=[d.x-o,d.y,d.z-o],l=[d.x+o,d.y+Fr.h,d.z+o],c=[e.x,e.y,e.z],f=[t.x,t.y,t.z];let g=0,_=r,m=!0;for(let p=0;p<3&&m;p++){if(Math.abs(f[p])<1e-9){(c[p]<h[p]||c[p]>l[p])&&(m=!1);continue}let w=(h[p]-c[p])/f[p],E=(l[p]-c[p])/f[p];w>E&&([w,E]=[E,w]),g=Math.max(g,w),_=Math.min(_,E),g>_&&(m=!1)}m&&g<r&&(r=g,i=a)}return i}update(e,t=performance.now()){const n=1-Math.exp(-e*12);for(const i of this.figures.values()){const r=i.cur,o=i.target,a=o.x-r.x,u=o.z-r.z;r.x+=a*n,r.y+=(o.y-r.y)*n,r.z+=u*n;let d=o.yaw-r.yaw;d=Math.atan2(Math.sin(d),Math.cos(d)),r.yaw+=d*n,i.group.position.set(r.x,r.y,r.z),i.body.rotation.y=r.yaw;const h=Math.hypot(a,u)*12;h>.3&&(i.walk+=e*Math.min(10,h*2));const l=h>.3?Math.sin(i.walk)*.5:0;if(i.legL&&i.legR&&(i.legL.rotation.x=l,i.legR.rotation.x=-l),i.state===$d.fuse){i.fuseT+=e;const c=1+.25*Math.min(1,i.fuseT/1.5)+.06*Math.sin(i.fuseT*30);i.body.scale.set(c,c,c),i.material.color.setRGB(1+i.fuseT,1+i.fuseT,1+i.fuseT)}else i.fuseT=0,i.body.scale.set(1,1,1),i.material.color.setRGB(1,1,1);t<i.flashUntil&&i.material.color.setRGB(2.2,.6,.6)}for(let i=this.bursts.length-1;i>=0;i--){const r=this.bursts[i],o=(t-r.born)/1e3;if(o>.9){this.group.remove(r.group),this.bursts.splice(i,1);continue}for(const a of r.parts)a.m.position.addScaledVector(a.v,e),a.v.y-=9.8*e;r.parts[0].m.material.opacity=Math.max(0,1-o/.9)}}}const hc=new WeakMap;function uc(s){let e=hc.get(s);return e||(e=document.createElement("canvas"),e.width=s.width,e.height=s.height,e.getContext("2d").putImageData(s,0,0),hc.set(s,e)),e}function kb(s,e,t=40){const n=Math.min(2,window.devicePixelRatio||1),i=document.createElement("canvas");i.width=i.height=Math.round(t*n),i.style.width=i.style.height=`${t}px`;const r=i.getContext("2d");r.imageSmoothingEnabled=!1;const o=t*n/32,a=uc(s),u=uc(e),d=h=>{r.globalCompositeOperation="source-atop",r.fillStyle=`rgba(0,0,0,${h})`,r.fillRect(0,0,16,16),r.globalCompositeOperation="source-over"};return r.setTransform(o,.5*o,-o,.5*o,16*o,0),r.drawImage(a,0,0,16,16),r.setTransform(o,.5*o,0,o,0,8*o),r.drawImage(u,0,0,16,16),d(.22),r.setTransform(o,-.5*o,0,o,16*o,16*o),r.drawImage(u,0,0,16,16),d(.42),r.setTransform(1,0,0,1,0,0),i}const fc=new Map;function Lb(s){let e=0;for(let t=0;t<s.length;t++)e=e*31+s.charCodeAt(t)>>>0;return e%360}const pc={wooden:"#a0703a",stone:"#8a8a8a",iron:"#d8d8d8",golden:"#f2c94c",gold:"#f2c94c",diamond:"#5fd8e8",netherite:"#4a3f4a"};function mc(s){for(const e of Object.keys(pc))if(s.startsWith(e+"_")||s===e)return pc[e];return"#b0b0b0"}function dr(s,e,t,n,i,r){r=Math.min(r,n/2,i/2),s.beginPath(),s.moveTo(e+r,t),s.lineTo(e+n-r,t),s.quadraticCurveTo(e+n,t,e+n,t+r),s.lineTo(e+n,t+i-r),s.quadraticCurveTo(e+n,t+i,e+n-r,t+i),s.lineTo(e+r,t+i),s.quadraticCurveTo(e,t+i,e,t+i-r),s.lineTo(e,t+r),s.quadraticCurveTo(e,t,e+r,t),s.closePath()}function Ib(s,e,t,n){const i=n/16;s.lineWidth=Math.max(1,i*.8),s.strokeStyle="rgba(0,0,0,0.55)";const r=e==="water_bottle"||e==="glass_bottle"||e.startsWith("potion.")||e.startsWith("splash_potion.")||e.startsWith("lingering_potion."),o=/_(pickaxe|axe|sword|shovel|hoe)$/.test(e),a=e==="bucket"||e.endsWith("_bucket"),u=e.endsWith("_dust")||e==="redstone"||e==="sugar"||e==="gunpowder"||e==="glowstone_dust",d=e.endsWith("_ingot")||e==="netherite"||e==="gold_nugget",h=e==="stick"||e==="blaze_rod"||e==="breeze_rod"||e==="bone",l=e==="string",c=eh(e);if(c){const f=dn.find(c)?.color??"#9a9a9a";s.fillStyle=f,s.beginPath(),s.ellipse(8*i,9*i,4.6*i,6*i,0,0,Math.PI*2),s.fill(),s.stroke(),s.fillStyle="rgba(0,0,0,0.25)",s.beginPath(),s.ellipse(8*i,12*i,4*i,2.6*i,0,0,Math.PI),s.fill(),s.fillStyle="rgba(255,255,255,0.55)";for(const[g,_]of[[6.2,6.5],[9.5,8],[7,10.5]])s.fillRect(g*i,_*i,i,i);return}if(r){const f=e==="glass_bottle"?null:e==="water_bottle"?"#3d7be6":e.includes("healing")?"#e64a4a":e.includes("speed")?"#7fd3ff":e.includes("awkward")?"#6b6ba8":"#a24ae6";s.fillStyle="rgba(200,225,255,0.55)",dr(s,4*i,6*i,8*i,9*i,3*i),s.fill(),s.stroke(),s.fillRect(6.5*i,2*i,3*i,4.5*i),s.strokeRect(6.5*i,2*i,3*i,4.5*i),s.fillStyle="#b07a3a",s.fillRect(6*i,1*i,4*i,1.6*i),f&&(s.fillStyle=f,dr(s,5*i,9*i,6*i,5*i,2.4*i),s.fill());return}if(a){const f=e==="water_bucket"?["#2f5fd6","#4d86ff"]:e==="lava_bucket"?["#e0561a","#ffa030"]:e==="milk_bucket"?["#e8e8e8","#ffffff"]:null,g=(E,y,k,v,S)=>{s.fillStyle=S,s.fillRect(E*i,y*i,k*i,v*i)},_="#2a2a2a",m="#5c5c5c",p="#9a9a9a",w="#d9d9d9";g(6,1,4,1,_),g(5,2,1,1,_),g(10,2,1,1,_),g(4,3,1,1,_),g(11,3,1,1,_),g(3,4,10,1,_),g(2,5,12,1,_),g(3,5,10,1,f?f[0]:m),g(4,5,4,1,f?f[1]:p),g(2,6,12,4,_),g(3,6,10,4,p),g(3,6,2,4,w),g(11,6,1,4,m),g(3,10,10,3,_),g(4,10,8,3,p),g(4,10,2,3,w),g(10,10,1,3,m),g(4,13,8,1,_),g(5,13,6,1,m),g(5,14,6,1,_);return}if(o){const f=mc(e);s.strokeStyle="#8a5a2b",s.lineWidth=2*i,s.beginPath(),s.moveTo(3*i,13*i),s.lineTo(10.5*i,5.5*i),s.stroke(),s.fillStyle=f,s.strokeStyle="rgba(0,0,0,0.55)",s.lineWidth=Math.max(1,i*.8),e.endsWith("pickaxe")?(s.beginPath(),s.moveTo(6*i,2.5*i),s.quadraticCurveTo(11*i,1.5*i,14*i,6*i),s.lineTo(12*i,7.5*i),s.quadraticCurveTo(10.5*i,4.5*i,7*i,4.5*i),s.closePath()):e.endsWith("axe")?(s.beginPath(),s.moveTo(9*i,2*i),s.lineTo(14*i,4*i),s.lineTo(13*i,8*i),s.lineTo(9.5*i,6.5*i),s.closePath()):e.endsWith("sword")?(s.beginPath(),s.moveTo(9*i,7*i),s.lineTo(13.5*i,2.5*i),s.lineTo(15*i,4*i),s.lineTo(10.5*i,8.5*i),s.closePath()):e.endsWith("shovel")?dr(s,9.5*i,1.5*i,5*i,6*i,2*i):(s.beginPath(),s.moveTo(9*i,3*i),s.lineTo(14.5*i,3*i),s.lineTo(14.5*i,5.5*i),s.lineTo(11*i,5.5*i),s.closePath()),s.fill(),s.stroke();return}if(u){const f=e==="glowstone_dust"?"#ffd75e":e==="redstone"?"#e03030":e==="sugar"?"#f4f4f4":e==="gunpowder"?"#666":"#c8c8c8";s.fillStyle=f;const g=[[8,11,4.5],[5,12.5,3],[11.5,12.5,3],[7,8,2],[10.5,8.5,1.6],[8.5,5.5,1.2]];for(const[_,m,p]of g)s.beginPath(),s.arc(_*i,m*i,p*i,0,Math.PI*2),s.fill();return}if(d){s.fillStyle=mc(e.replace("_ingot","").replace("gold_nugget","gold")),s.beginPath(),s.moveTo(2*i,11*i),s.lineTo(5*i,6*i),s.lineTo(14*i,6*i),s.lineTo(11*i,11*i),s.closePath(),s.fill(),s.stroke(),s.fillStyle="rgba(0,0,0,0.18)",s.fillRect(2*i,11*i,9*i,2*i);return}if(h){s.strokeStyle=e==="blaze_rod"?"#ffb02e":e==="bone"?"#eee":e==="breeze_rod"?"#9fd7ff":"#8a5a2b",s.lineWidth=2.2*i,s.beginPath(),s.moveTo(4*i,12.5*i),s.lineTo(12*i,3.5*i),s.stroke();return}if(l){s.strokeStyle="#f0f0f0",s.lineWidth=1.4*i,s.beginPath(),s.moveTo(3*i,4*i),s.bezierCurveTo(12*i,2*i,2*i,12*i,13*i,12*i),s.stroke();return}s.fillStyle=`hsl(${Lb(e)} 45% 38%)`,dr(s,2*i,2*i,12*i,12*i,3*i),s.fill(),s.strokeStyle="rgba(255,255,255,0.35)",s.stroke(),s.fillStyle="#fff",s.font=`bold ${Math.round(n*.34)}px system-ui, sans-serif`,s.textAlign="center",s.textBaseline="middle",s.fillText(Array.from(t.replace(/\s/g,"")).slice(0,2).join(""),n/2,n/2)}function Ub(s,e,t,n,i){const r=`${s}@${e}`,o=fc.get(r);if(o)return gc(o);const a=t.find(s);let u;if(a&&a.textures){const d=n.images.get("missing");u=kb(n.images.get(a.textures[0])??d,n.images.get(a.textures[1])??d,e)}else{const d=Math.min(3,window.devicePixelRatio||1);u=document.createElement("canvas"),u.width=u.height=Math.round(e*d),u.style.width=u.style.height=`${e}px`;const h=u.getContext("2d");Ib(h,s,i,e*d)}return fc.set(r,u),gc(u)}function gc(s){const e=document.createElement("canvas");return e.width=s.width,e.height=s.height,e.style.width=s.style.width,e.style.height=s.style.height,e.getContext("2d").drawImage(s,0,0),e}class Pa{workers=[];busy=[];pending=new Map;nextJob=1;constructor(e,t=Pa.defaultCount()){for(let n=0;n<t;n++){const i=new Worker(new URL("/DragonVillage/assets/mesher.worker-BUTvubZ3.js",import.meta.url),{type:"module",name:`mesher-${n}`});i.onmessage=o=>this.onMessage(o.data),i.onerror=o=>console.error("메싱 워커 오류",o);const r={type:"init",blockInfo:e};i.postMessage(r),this.workers.push(i),this.busy.push(0)}}static defaultCount(){const e=typeof navigator<"u"&&navigator.hardwareConcurrency||2;return Math.max(1,Math.min(4,e-1))}get size(){return this.workers.length}get inflight(){return this.pending.size}mesh(e,t,n,i,r){let o=0;for(let u=1;u<this.busy.length;u++)this.busy[u]<this.busy[o]&&(o=u);const a=this.nextJob++;return this.busy[o]++,new Promise((u,d)=>{this.pending.set(a,{resolve:u,reject:d,worker:o});const h={type:"mesh",jobId:a,cx:e,cy:t,cz:n,padded:i,light:r};this.workers[o].postMessage(h,[i.buffer,r.buffer])})}onMessage(e){const t=this.pending.get(e.jobId);t&&(this.pending.delete(e.jobId),this.busy[t.worker]--,t.resolve(e))}dispose(){for(const e of this.workers)e.terminate();this.workers.length=0;for(const e of this.pending.values())e.reject(new Error("워커 풀 종료"));this.pending.clear()}}class Fb{constructor(e,t){this.renderer=e;const n=window.devicePixelRatio||1;this.maxPixelRatio=Math.min(n,t?1.5:2),this.pixelRatio=t?Math.min(n,1):this.maxPixelRatio,this.apply()}renderer;ema=16;pixelRatio;maxPixelRatio;minPixelRatio=.5;timer=0;goodStreak=0;onChange=null;apply(){this.renderer.setPixelRatio(this.pixelRatio),this.onChange?.(this.pixelRatio)}frame(e){this.ema=this.ema*.94+e*1e3*.06,this.timer+=e,!(this.timer<2)&&(this.timer=0,this.ema>36&&this.pixelRatio>this.minPixelRatio?(this.pixelRatio=Math.max(this.minPixelRatio,this.pixelRatio-.25),this.goodStreak=0,this.apply()):this.ema<14&&this.pixelRatio<this.maxPixelRatio?++this.goodStreak>=3&&(this.pixelRatio=Math.min(this.maxPixelRatio,this.pixelRatio+.25),this.goodStreak=0,this.apply()):this.goodStreak=0)}resize(){this.apply()}}const Nb=5,_c=.3,vc=.25;class Bb{constructor(e,t,n,i){this.world=e,this.registry=t,this.player=n,this.events=i}world;registry;player;events;target=null;progress=0;suppressPrimary=!1;breakingKey=-1;cooldown=0;placeTimer=0;swingTimer=0;selectedBlock=0;heldItem=null;hintTimer=0;getBlock=(e,t,n)=>this.world.getBlock(e,t,n);placeDoor(e,t,n,i,r){if(!this.world.inBounds(e,t+1,n)||this.world.getBlock(e,t+1,n)!==vn||$i(this.player.pos,hn,e,t,n)||$i(this.player.pos,hn,e,t+1,n))return;const o=this.player.lookDir,a=Ia(o.x,o.z),d=th((g,_,m)=>{if(!this.world.inBounds(g,_,m))return!1;const p=this.registry.get(this.world.getBlock(g,_,m));return p.solid&&p.door===null},e,t,n,a),h=this.registry.doorVariant(i.num,a,!1,!1,d),l=this.registry.doorVariant(i.num,a,!0,!1,d),c=this.world.setBlock(e,t,n,h),f=this.world.setBlock(e,t+1,n,l);(c.changed||f.changed)&&(this.events.onBlocksChanged([...c.dirty,...f.dirty]),this.events.onPlaced?.(e,t,n,h,r),this.events.onSwing())}toggleDoor(e,t){const n=t.door,i=n.upper?e.y-1:e.y;if(n.open&&($i(this.player.pos,hn,e.x,i,e.z)||$i(this.player.pos,hn,e.x,i+1,e.z)))return;const r=this.registry.doorVariant(n.base,n.facing,!1,!n.open,n.hinge),o=this.registry.doorVariant(n.base,n.facing,!0,!n.open,n.hinge),a=this.world.setBlock(e.x,i,e.z,r),u=this.world.setBlock(e.x,i+1,e.z,o);(a.changed||u.changed)&&(this.events.onBlocksChanged([...a.dirty,...u.dirty]),this.events.onPlaced?.(e.x,e.y,e.z,n.upper?o:r,e.id),this.events.onSwing())}targetable=e=>e!==vn&&(this.bucketMode||!this.registry.isFluid(e));get bucketMode(){return this.selectedBlock>0&&this.registry.get(this.selectedBlock).fluid!==null}update(e,t){const n=this.player.eye,i=this.player.lookDir;if(this.target=Wh(this.getBlock,this.targetable,n.x,n.y,n.z,i.x,i.y,i.z,Nb),this.cooldown=Math.max(0,this.cooldown-t),this.suppressPrimary&&(this.breakingKey=-1,this.progress=0),e.primary&&this.target&&!this.suppressPrimary){const r=this.target,o=(r.x*1024+r.y)*1024+r.z|0;o!==this.breakingKey&&(this.breakingKey=o,this.progress=0),this.swingTimer-=t,this.swingTimer<=0&&(this.events.onSwing(),this.swingTimer=.25);const a=this.registry.get(r.id);if(a.fluid){if(this.progress=0,this.cooldown<=0&&(a.fluidLevel===0||a.fluidVolume>0)){const u=this.world.setBlock(r.x,r.y,r.z,vn);u.changed&&(this.events.onBlocksChanged(u.dirty),this.events.onBroken?.(r.x,r.y,r.z,r.id)),this.breakingKey=-1,this.cooldown=_c}}else if(a.hardness===null)this.progress=0;else if(this.cooldown<=0){const u=nh(a,ih(Ef,this.heldItem));if(u===null){this.progress=0,this.hintTimer-=t,this.hintTimer<=0&&(this.events.onHint?.(sh(a)),this.hintTimer=2);return}if(this.progress+=u<=0?1:t/u,this.progress>=1){const d=this.world.setBlock(r.x,r.y,r.z,vn);if(d.changed&&(this.events.onBlocksChanged(d.dirty),this.events.onBroken?.(r.x,r.y,r.z,r.id),a.door)){const h=this.world.setBlock(r.x,a.door.upper?r.y-1:r.y+1,r.z,vn);h.changed&&this.events.onBlocksChanged(h.dirty)}this.progress=0,this.breakingKey=-1,this.cooldown=_c}}}else this.progress=0,this.breakingKey=-1,this.swingTimer=0;e.secondaryTap?(this.place(),this.placeTimer=vc):e.secondaryHold?(this.placeTimer-=t,this.placeTimer<=0&&(this.place(),this.placeTimer=vc)):this.placeTimer=0}place(){const e=this.target;if(!e)return;const t=this.registry.get(e.id);if(t.door){this.toggleDoor(e,t);return}if(t.chest){this.events.onOpenChest?.(e.x,e.y,e.z),this.events.onSwing();return}if(this.selectedBlock<=0)return;const n=e.x+e.nx,i=e.y+e.ny,r=e.z+e.nz;if(!this.world.inBounds(n,i,r))return;const o=this.world.getBlock(n,i,r);if(o!==vn&&!this.registry.isFluid(o))return;const a=this.registry.get(this.selectedBlock);if(a.shape==="door"&&this.registry.isDoor(a.num)){this.placeDoor(n,i,r,a,o);return}if(a.torch){if(e.ny<0)return;const h=e.ny>0?-1:Ia(-e.nx,-e.nz),l=h<0?a.num:this.registry.torchVariant(a.num,h),c=this.world.setBlock(n,i,r,l);c.changed&&(this.events.onBlocksChanged(c.dirty),this.events.onPlaced?.(n,i,r,l,o),this.events.onSwing());return}if(a.solid&&$i(this.player.pos,hn,n,i,r))return;const u=a.fluid?this.registry.fluidFinite(a.fluidSource,yo):this.selectedBlock,d=this.world.setBlock(n,i,r,u);d.changed&&(this.events.onBlocksChanged(d.dirty),this.events.onPlaced?.(n,i,r,u,o),this.events.onSwing())}}const Ob=500,zb=50,Ac="grass_island",Vb=["북","북서","서","남서","남","남동","동","북동"];async function Hb(s,e){const{isTouch:t,net:n,welcome:i}=e,r=vf,o=await hb(),a=lA(r,o.index),u=i.playerIdx,d=new Yv({antialias:!1,alpha:!1,powerPreference:"high-performance",stencil:!1});d.domElement.className="game",d.domElement.tabIndex=0,d.autoClear=!1,d.setClearColor(wr,1),s.appendChild(d.domElement);const h=new td,l=new sn(70,1,.05,600);l.rotation.order="YXZ";const c=CA(o.texture),f=new Pa(a),g=t?5:8;(()=>{const M=g*yt;c.setFog(M*.55,M*.98),l.far=M*1.3+50,l.updateProjectionMatrix()})();const m=new qA(h),p=new XA(h),w=new zA(c,a),E=new mA(h),y=new uA(h);y.sync(i.nestDragons);let k=i.nestDragons,v=null;const S=new hA(h),R=new bb(h),x=new Sb(h);let b=i.hp;const D=new Pb(h);let L=0,B=null,V=0;const H=()=>v?zh(dn.require(v.dragon)).stamina:0,N=()=>{if(!B||!v)return;const M=Date.now()+V,F=Vh({value:B.value,at:B.at},B.max,M);C.setStamina(F,B.max,H(),Math.max(0,B.readyAt-M)/1e3)},q=()=>{!v||!At||me||n.sendSkill("beam")},C=new gb(s,t),ee=M=>M in Ua?Ua[M]:Na(M,r,Eo),se=(M,F)=>Ub(M,F,r,o,ee(M)),ae=rh(i.inventory),Ne=()=>{const M=[];for(let F=0;F<Ar;F++){const te=ae[F];M.push(te?{item:te.item,count:te.count,name:ee(te.item),icon:se(te.item,40)}:{item:null,count:0,name:"빈 칸",icon:null})}C.setSlots(M)};Ne();const be=()=>{const M=C.selectedItem;return M?kh(M,r)??0:0};let j=i.expedition,Ee=i.village_state??{built:[],level:1,codex:0,codexIds:[],eggSlots:4},Y=new Set(Ee.codexIds);const Z=()=>{const M=j?` · 원정 중: ${j.name} ${j.players}명`:"";C.setVillageInfo(`마을 "${i.village.name}" 레벨 ${Ee.level} · 코드 ${i.village.code} · 지금 ${E.count+1}명${M} (친구에게 코드를 알려 주면 같은 마을에 들어와요)`)};let re=i.dragons,pe=i.nest;const ne=new ub(s,{recipes:yf,potions:xf,dragons:dn,owned:()=>new Set(re.filter(M=>M.stage!=="egg").map(M=>M.dragon)),codexBlocks:()=>Y,codexCandidates:()=>r.defs.filter(M=>!M.internal&&M.id!=="air"&&M.textures).map(M=>[M.id,M.name]),icon:se,nameOf:ee,onMove:(M,F,te)=>n.sendInvMove(M,F,te),onDrop:(M,F)=>n.sendInvDrop(M,F),onCraft:M=>n.sendCraft(M),onBrew:(M,F)=>{n.sendBrew(M,F),ne.clearBrewSelection()},onClose:()=>hi()});ne.setInventory(ae);const ye=new Ab(s,{dragons:dn,xp:fr,nameOf:ee,onPlace:(M,F)=>n.sendPlaceEgg(M,F),onHatch:M=>n.sendHatch(M),onFeed:(M,F)=>n.sendFeed(M,F),onRide:M=>{n.sendRide(M),T()},onClose:()=>T(),eggSlots:()=>Ee.eggSlots});ye.setInventory(ae),ye.setDragons(re),ye.setNest(pe,i.nestDragons),ye.setXp(i.xp);const et=new yb(s,{buildings:Af,icon:se,nameOf:ee,onMove:(M,F,te)=>n.sendStorageMove(M,F,te),onBuild:M=>n.sendBuild(M),onClose:()=>Ps()});et.setInventory(ae),et.setStorage(i.storage??[]),et.setVillage(Ee.built,Ee.level,Ee.codex);const I=new pb(s,{icon:se,nameOf:ee,onMove:(M,F,te)=>{const ge=I.position;ge&&n.sendChestMove(ge.x,ge.y,ge.z,M,F,te)},onClose:()=>kr()}),Qe=new fb(s,Va,(M,F)=>n.sendEmote(M,F),()=>ui());let Xe=0;const Pe=()=>{const M={},F=A.world,te=A.player.pos,ge=Math.floor(te.x),fe=Math.floor(te.y+1),Fe=Math.floor(te.z),$e=new Map;for(const Ye of["crafting_table","furnace","brewing_stand"]){const gt=r.find(Ye);gt&&$e.set(gt.num,Ye)}for(let Ye=fe-5;Ye<=fe+5&&$e.size;Ye++)for(let gt=Fe-5;gt<=Fe+5&&$e.size;gt++)for(let en=ge-5;en<=ge+5&&$e.size;en++){if(!F.inBounds(en,Ye,gt))continue;const mn=$e.get(F.getBlock(en,Ye,gt));mn&&(M[mn]=!0,$e.delete(F.getBlock(en,Ye,gt)))}return M},_e=new Zv,We=new $v(d.domElement);_e.add(We);const Ce=new rA(C.touchUI);_e.add(Ce),_e.add(new Jv),_e.paused=!0;const Oe=new Map;let vt=0;const _t=(M,F,te,ge,fe)=>{vt=vt+1&65535,Oe.set(vt,{x:M,y:F,z:te,prev:fe,id:ge}),n.sendBlockChange({seq:vt,x:M,y:F,z:te,id:r.get(ge).id,slot:C.selectedIndex}),Oe.size>200&&Oe.delete(Oe.keys().next().value)},P=(M,F,te)=>{for(const[ge,fe]of Oe)fe.x===M&&fe.y===F&&fe.z===te&&Oe.delete(ge)};let A;const W=(M,F,te,ge)=>{const fe=M==="expedition"&&F?uh(r,F.seed,F.treasures):fh(r,i.village.seed),{world:Fe}=fe;for(const bt of ge)Fe.chunkInBounds(bt.cx,bt.cy,bt.cz)&&za(bt.bytes,r,Fe.getOrCreateChunk(bt.cx,bt.cy,bt.cz));const $e=new Yh(Fe,r);$e.computeAll();const Ye=new RA(Fe,$e,c,f,h);Ye.renderDistance=g,Ye.markAll();const gt=new SA(Fe,r,te,te.yaw);gt.pitch=te.pitch,gt.riding=v!==null;const en=(bt,gn,_n,Zi)=>{const Is=r.find(Zi),bd=Is?Is.num:vn,La=Fe.setBlock(bt,gn,_n,bd);La.changed&&(Ye.markDirtyAll(La.dirty),$e.markChanged(bt,gn,_n))},mn=new Bb(Fe,r,gt,{onBlocksChanged:bt=>Ye.markDirtyAll(bt),onSwing:()=>w.swing(),onPlaced:(bt,gn,_n,Zi,Is)=>{$e.markChanged(bt,gn,_n),_t(bt,gn,_n,Zi,Is)},onBroken:(bt,gn,_n,Zi)=>{$e.markChanged(bt,gn,_n),_t(bt,gn,_n,vn,Zi)},onHint:bt=>C.toast(bt,2e3),onOpenChest:(bt,gn,_n)=>{ne.visible||ye.visible||Qe.visible||n.sendOpenChest(bt,gn,_n)}}),fi=fe.layout.portal,pi=new YA(h,fi,M==="expedition"?4177148:9060348);return{kind:M,world:Fe,light:$e,chunks:Ye,player:gt,interaction:mn,portal:pi,portalPos:fi,genMs:fe.ms,expedition:F,localStart:F?performance.now()-(F.serverNow-F.startedAt):0,applyServerBlock:en}},J=(M,F,te,ge)=>A.applyServerBlock(M,F,te,ge),ie=M=>{M.chunks.dispose(),h.remove(M.chunks.group),M.portal.dispose()};let Q=1;const ke=M=>{Math.abs(M-Q)<.002||(Q=M,c.setSkyLight(M),m.setBrightness(M),d.setClearColor(wr.clone().multiplyScalar(M),1))};A=W("village",null,{...i.spawn},i.chunks);for(const M of i.players)E.upsert(M);Z();let he=!1,De=!1;const Le=M=>{ie(A),Oe.clear(),A=W(M.kind,M.expedition,{...M.spawn},M.chunks);for(const F of E.indices())E.remove(F);for(const F of M.players)E.upsert(F);y.visible=M.kind==="village",Ce.clearHolds(),he=De=!1,C.hideAction(),x.clear(),D.clear(),M.kind==="expedition"&&M.expedition?C.toast(`${M.expedition.name}에 도착했어요! 가운데 포탈로 돌아오면 모은 것을 가져가요`,5e3):(ke(1),C.setTimer(null,null),C.toast("마을로 돌아왔어요",3e3)),Z(),qe()},de=M=>{const F=M.items.map($e=>({name:Na($e.id,r,Eo),count:$e.count,icon:se($e.id,28)})),te=M.items.reduce(($e,Ye)=>$e+Ye.count,0),ge=Math.floor(M.elapsedSec/60),fe=M.elapsedSec%60,Fe=M.late?`시간이 다 되어 저절로 돌아왔어요. 절반만 가져왔어요 (${Math.round(M.keepRatio*100)}%)`:`${ge}분 ${fe}초 만에 돌아왔어요. 모은 것 ${te}개를 마을 창고에 넣었어요`;_e.paused=!0,We.enabled=!1,C.showResult(`${M.name} 원정 끝!`,Fe,F,"한 번 더 갈까?",()=>{n.sendStartExpedition(M.expedition),Pt()},()=>Pt())};let me=!1,ze=!1,we=i.xp;C.setXp(we);const ve=(M,F,te)=>{const ge=xr(we).level;if(we=M,C.setXp(we),ye.setXp(we),F){const Fe=new G(F.x,F.y,F.z).project(l),$e=d.domElement.clientWidth,Ye=d.domElement.clientHeight,gt=Fe.z<1&&Math.abs(Fe.x)<=1.1&&Math.abs(Fe.y)<=1.1,en=gt?(Fe.x+1)/2*$e:$e/2,mn=gt?(1-Fe.y)/2*Ye:Ye*.55;window.setTimeout(()=>{C.xpOrbs(en,mn,Math.min(10,3+Math.ceil(te/2)),te),go()},350)}const fe=xr(we).level;if(fe>ge){qv();const Fe=ph(fr,ge,fe);C.toast(Fe.length?`레벨 ${fe}! ${Fe.map($e=>mh[$e.id]??$e.id).join("·")} 열렸어요`:`레벨 ${fe}!`,4e3)}};let Ve=i.today;const U=M=>{const F=Ve;Ve=M,C.setToday(M),F&&M.bonusMin>F.bonusMin&&C.toast(`+${M.bonusMin-F.bonusMin}분! 할 일이 확인됐어요`,5e3),!(!M.enforced||!F)&&(F.remainingMin>5&&M.remainingMin<=5&&M.remainingMin>1?C.toast(`오늘 게임 시간이 ${M.remainingMin}분 남았어요`,6e3):F.remainingMin>1&&M.remainingMin===1&&C.toast("1분 남았어요 — 곧 마을에서 나가요. 내일 다시!",8e3),F.minutesUntilBlocked>5&&M.minutesUntilBlocked<=5&&M.minutesUntilBlocked>0&&C.toast(`${M.minutesUntilBlocked}분 뒤에 게임 시간이 끝나요`,6e3))};n.attach({onChunk:M=>{if(A.world.chunkInBounds(M.cx,M.cy,M.cz)){za(M.bytes,r,A.world.getOrCreateChunk(M.cx,M.cy,M.cz)),A.chunks.markDirty(M.cx,M.cy,M.cz);for(let F=0;F<yt;F++)for(let te=0;te<yt;te++)for(let ge=0;ge<yt;ge++)A.light.markChanged(M.cx*16+ge,M.cy*16+F,M.cz*16+te)}},onBlockChanged:M=>{P(M.x,M.y,M.z),J(M.x,M.y,M.z,M.id)},onBlockBatch:M=>{for(const F of M.blocks)J(F.x,F.y,F.z,F.id)},onRejected:M=>{const F=Oe.get(M.seq);if(Oe.delete(M.seq),F){const te=A.world.setBlock(F.x,F.y,F.z,F.prev);te.changed&&(A.chunks.markDirtyAll(te.dirty),A.light.markChanged(F.x,F.y,F.z));const ge=r.get(F.prev).door,fe=r.get(F.id).door??ge;if(fe){const Fe=fe.upper?F.y-1:F.y+1,$e=ge?r.doorVariant(ge.base,ge.facing,!ge.upper,ge.open,ge.hinge):vn,Ye=A.world.setBlock(F.x,Fe,F.z,$e);Ye.changed&&(A.chunks.markDirtyAll(Ye.dirty),A.light.markChanged(F.x,Fe,F.z))}}C.toast(oh[M.reason]??"서버가 거절했어요",2500)},onPlayers:M=>E.setState(M,u),onPlayerJoined:M=>{E.upsert(M),C.toast(A.kind==="expedition"?`${M.nick} 님이 원정에 왔어요`:`${M.nick} 님이 들어왔어요`,3e3),Z()},onPlayerLeft:M=>{const F=E.nickOf(M);E.remove(M),F&&C.toast(A.kind==="expedition"?`${F} 님이 마을로 갔어요`:`${F} 님이 나갔어요`,3e3),Z()},onError:(M,F)=>C.toast(F,4e3),onToday:M=>U(M),onDragons:M=>{const F=re.filter(fe=>fe.stage!=="egg").length,te=new Map(re.map(fe=>[fe.id,fe.stage]));if(re=M,ye.setDragons(M),M.filter(fe=>fe.stage!=="egg").length>F){const fe=M.filter(Fe=>Fe.stage!=="egg").at(-1);C.toast(`🐉 ${dn.find(fe.dragon)?.name??fe.dragon}이 태어났어요! 도감에 등록됐어요`,6e3)}for(const fe of M)fe.stage==="adult"&&te.get(fe.id)==="baby"&&C.toast(`🐲 ${dn.find(fe.dragon)?.name??fe.dragon}이 어른이 됐어요! 더 크고 무서워졌어요`,6e3)},onNest:(M,F)=>{pe=M,k=F,ye.setNest(M,F),y.sync(F)},onChest:(M,F,te,ge)=>{I.setInventory(ae),I.setChest(M,F,te,ge),_e.paused=!0,We.enabled=!1,We.locked&&document.exitPointerLock()},onMount:(M,F)=>{if(M!==u){E.setMount(M,F);return}v=F,A.player.riding=!0,S.set(F.dragon),C.setRiding(!0,dn.find(F.dragon)?.skills.find(te=>te.type==="beam")?.name??"빔"),B={value:Oa("adult"),max:Oa("adult"),at:Date.now()+V,readyAt:0},N(),C.hideAction(),C.toast(`🐉 ${dn.find(F.dragon)?.name??F.dragon}을 탔어요! ${t?"▲ 위로 · ▼ 아래로":"Space 위로 · Shift 아래로"} · 내리기는 🐉 버튼`,6e3)},onDismount:M=>{if(M!==u){E.setMount(M,null);return}v=null,A.player.riding=!1,S.set(null),C.setRiding(!1),B=null,Ce.clearHolds()},onStorage:M=>{et.setStorage(M),!et.visible&&Nn&&(Nn=!1,et.show(),_e.paused=!0,We.enabled=!1,We.locked&&document.exitPointerLock())},onVillage:M=>{const F=Ee.level;Ee={...Ee,built:M.built,level:M.level,codex:M.codex,eggSlots:M.eggSlots},et.setVillage(M.built,M.level,M.codex),ye.setInventory(ae),Z(),M.level>F&&C.toast(`🏘️ 마을 레벨 ${M.level}! 광장 깃대에 깃발이 늘었어요`,5e3)},onCodex:M=>{Y=new Set([...Y,M.id]),ne.setInventory(ae),C.toast(`📖 새로 발견! ${ee(M.id)} — 마을 도감 ${M.total}종 (+${fr.ours.codexNewEntry})`,4500)},onHealth:M=>{M.hp<b&&(C.hurtFlash(),Qv()),b=M.hp,C.setHealth(M.hp,M.max)},onRespawn:M=>{const F=A.player;F.pos.x=M.x,F.pos.y=M.y,F.pos.z=M.z,F.vel.x=F.vel.y=F.vel.z=0,qe(),C.toast(M.dropped>0?`💀 쓰러졌어요… 경험치 구슬 ${M.dropped}개가 그 자리에 남았어요. 가서 되찾아요!`:"💀 쓰러졌어요… 다시 일어났어요",6e3)},onMobs:M=>D.setState(M),onMobEvent:M=>{D.event(M.ev,M.id,M.x,M.y,M.z),M.ev==="explode"?(C.hurtFlash(),jv()):M.ev==="die"&&go()},onOrbs:M=>x.set(M),onOrbGone:(M,F)=>{x.remove(M),F===u&&go()},onBeam:M=>{R.fire(M.from,M.dir,M.color,M.power,M.range),Kv(M.power)},onStamina:M=>{V=M.now-Date.now(),B={value:M.value,max:M.max,at:M.now,readyAt:M.readyAt},N()},onXpGained:M=>ve(we+M.amount,{x:M.x,y:M.y,z:M.z},M.amount),onXpState:M=>ve(M.total,null,0),onTimeUp:(M,F)=>{ze=!0,me=!0,_e.paused=!0,We.enabled=!1,C.hideToday(),C.hideAction(),C.showOverlay("오늘은 여기까지!",F+`
확인을 누르면 마을에서 나가요.`,"확인")},onApprovalAsk:M=>C.showApproval(M),onPending:M=>C.setPending(M),onClose:M=>{me=!0,_e.paused=!0,We.enabled=!1,!ze&&C.showOverlay("서버와 연결이 끊어졐어요",M+`
다시 들어가려면 아래를 눌러요.`,"다시 연결")},onWorldEnter:Le,onExpeditionResult:de,onExpeditionState:M=>{const F=!!j;j=M,!F&&M&&A.kind==="village"&&C.toast(`${M.name} 원정이 시작됐어요! 포탈에서 따라갈 수 있어요`,5e3),Z()},onTimer:M=>{A.expedition&&(A.localStart=performance.now()-M.elapsedSec*1e3)},onInvSlots:M=>{for(const F of M.slots)F.slot>=0&&F.slot<ae.length&&(ae[F.slot]=F.count>0?{item:F.item,count:F.count}:null);Ne(),ne.setInventory(ae),ye.setInventory(ae),I.setInventory(ae),et.setInventory(ae)},onEmote:M=>{const F=Va.text(M.kind,M.id);if(!F)return;const te=M.idx===u?"나":E.nickOf(M.idx)??"누군가";Qe.add(te,F),M.idx!==u?E.say(M.idx,F,M.kind===Tc?2.5:3.5):C.toast(F,2500)}});const le=new Fb(d,t);let ue=0,Se=0;const oe=(M=!1)=>{const F=s.clientWidth||window.innerWidth,te=s.clientHeight||window.innerHeight;F<=0||te<=0||!M&&F===ue&&te===Se||(ue=F,Se=te,l.aspect=F/te,l.updateProjectionMatrix(),d.setSize(F,te,!1))};le.onChange=()=>oe(!0),oe(!0);const $=()=>oe();window.addEventListener("resize",$),window.addEventListener("orientationchange",()=>setTimeout($,200)),document.addEventListener("fullscreenchange",()=>{$(),setTimeout($,300)}),window.visualViewport?.addEventListener("resize",$);const Re=typeof ResizeObserver<"u"?new ResizeObserver($):null;Re?.observe(s);let He=!1;C.debugBtn.addEventListener("click",()=>He=!He);const lt=window.matchMedia("(display-mode: standalone), (display-mode: fullscreen)").matches||navigator.standalone===!0,tt=!!document.fullscreenEnabled&&typeof document.documentElement.requestFullscreen=="function",$t=`이 브라우저는 전체화면이 안 돼요.
공유 버튼 → "홈 화면에 추가" 로 열면 전체화면이 돼요.`,Xt=()=>{lt?C.setFullscreen("hidden"):tt?C.setFullscreen(document.fullscreenElement?"on":"off"):C.setFullscreen("unavailable")};Xt(),document.addEventListener("fullscreenchange",Xt);async function ji(){if(!tt)return!1;try{document.fullscreenElement||await document.documentElement.requestFullscreen({navigationUI:"hide"});const M=screen.orientation;return M.lock&&await M.lock("landscape").catch(()=>{}),!0}catch{return!1}}async function En(){try{document.fullscreenElement&&await document.exitFullscreen()}catch{}}C.fullscreenBtn.addEventListener("click",()=>{if(!tt){C.toast($t,7e3);return}document.fullscreenElement?En():ji().then(M=>{M||C.toast("전체화면을 켤 수 없었어요. 다시 한 번 눌러 보세요.",4e3)})});let At=!1,Ji=!1;const Rs=()=>{_e.paused=!0,We.enabled=!1,C.showOverlay("잠깐 멈춤","ESC 로 나왔어요. 다시 들어가려면 아래를 눌러요.","계속하기")},Pt=()=>{me||(C.hideOverlay(),_e.paused=!1,We.enabled=!0,d.domElement.focus(),t||We.requestLock().then(M=>{!M&&!Ji&&(Ji=!0,C.toast("이 브라우저는 마우스 잠금이 안 돼요. 마우스를 움직여 둘러보세요.",5e3))}))},Vt=()=>ne.visible||Qe.visible||ye.visible||I.visible||et.visible;let Nn=!1;const Ds=()=>{Vt()||!At||me||(Nn=!0,n.sendOpenStorage())},Ps=()=>{et.visible&&(et.hide(),At&&!C.overlayVisible&&!C.resultVisible&&!Vt()&&Pt())},ks=()=>{!At||me||C.resultVisible||(_e.paused=!0,We.enabled=!1,We.locked&&document.exitPointerLock(),ne.setStations(Pe()),ne.setInventory(ae),ne.show())},hi=()=>{ne.visible&&(ne.hide(),At&&!C.overlayVisible&&!C.resultVisible&&!Vt()&&Pt())},Ls=()=>{!At||me||C.resultVisible||(_e.paused=!0,We.enabled=!1,We.locked&&document.exitPointerLock(),Qe.show())},kr=()=>{I.visible&&(I.hide(),At&&!C.overlayVisible&&!C.resultVisible&&!Vt()&&Pt())},ui=()=>{Qe.visible&&(Qe.hide(),At&&!C.overlayVisible&&!C.resultVisible&&!Vt()&&Pt())},Lr=()=>{Vt()||(ye.setXp(we),ye.setInventory(ae),ye.show(),_e.paused=!0,We.enabled=!1)},T=()=>{ye.visible&&(ye.hide(),At&&!C.overlayVisible&&!C.resultVisible&&!Vt()&&Pt())};C.bagBtn.addEventListener("click",()=>ne.visible?hi():ks()),C.rideBtn.addEventListener("click",()=>n.sendDismount()),C.skillBtn.addEventListener("click",q),C.setToday(i.today),C.setHealth(b,20),C.onCheckTodo=M=>n.sendCheckTodo(M),C.onApprove=(M,F)=>n.sendApproveTodo(M.id,M.date,F),C.setPending(i.pending),i.pending.length&&C.toast(`승인 기다리는 할 일이 ${i.pending.length}개 있어요 — 위의 ✅ 를 눌러 보세요`,6e3),i.today&&C.toast(`오늘 남은 시간 ${i.today.remainingMin}분 · 할 일 ${i.today.todos.length}개 — 위의 ⏱ 를 누르면 보여요`,6e3),C.setFamily(i.family,i.parentOf),C.familyBtn.addEventListener("click",async()=>{const M=await ah(s,{title:"가족 연결",sub:"아빠·엄마 화면(/family)에 있는 가족 코드 6자리를 넣어요",pattern:/^\d{6}$/,invalid:"숫자 6자리예요",placeholder:"가족 코드 6자리",maxLength:6,okLabel:"다음"});if(!M)return;const F=await lh(s,"내 PIN","내 계정이 맞는지 PIN 4자리로 확인해요","연결","취소");if(F)try{const te=await n.linkFamily(M,F);C.setFamily(te),C.toast("가족에 연결됐어요! 아빠·엄마 화면에 내 이름이 보여요",5e3)}catch(te){C.toast(te.message||"연결할 수 없어요",5e3)}}),C.chatBtn.addEventListener("click",()=>Qe.visible?ui():Ls()),window.addEventListener("keydown",M=>{!At||me||(M.code==="KeyE"?(ne.visible?hi():!Qe.visible&&!C.overlayVisible&&!C.helpVisible&&!C.resultVisible&&ks(),M.preventDefault()):M.code==="KeyF"&&v&&!Vt()&&!C.overlayVisible?(q(),M.preventDefault()):M.code==="KeyT"?(Qe.visible?ui():!ne.visible&&!C.overlayVisible&&!C.helpVisible&&!C.resultVisible&&Ls(),M.preventDefault()):M.code==="Escape"&&(ne.visible||Qe.visible)&&(hi(),ui()))}),C.onOverlayClick=()=>{if(me){window.location.reload();return}At&&Pt()},C.onHelpToggle=M=>{M?(_e.paused=!0,We.enabled=!1):At&&!C.overlayVisible&&!C.resultVisible&&!Vt()&&Pt()},document.addEventListener("pointerlockchange",()=>{t||!At||We.lockFailed||me||!We.locked&&!C.overlayVisible&&!C.helpVisible&&!C.resultVisible&&!C.actionVisible&&!Vt()&&Rs()}),s.addEventListener("click",M=>{M.target?.closest(".action-card, .result-panel, .bag-panel, .chat-panel, .nest-panel, .side-btns")||At&&!t&&!We.locked&&!C.overlayVisible&&!C.resultVisible&&!Vt()&&Pt()});let O=!1,X=performance.now(),K=0,z=0,ce=0,Ae=0,Te=0,Me=0,Be=0,Ge=0;const Ie=t?.6:1;function qe(){if(!n.connected)return;const M=A.player,F=(M.sneaking?Sc:0)|(M.sprinting?ch:0)|(M.onGround?dh:0)|(M.inWater?hh:0)|(M.riding?Mc:0);n.sendMove({x:M.pos.x,y:M.pos.y,z:M.pos.z,yaw:M.yaw,pitch:M.pitch,flags:F})}const ot=()=>A.expedition?(performance.now()-A.localStart)/1e3:0,ct=t?"":"  (Enter)",ut=M=>{M.code!=="Enter"&&M.code!=="NumpadEnter"||!At||!C.actionVisible||C.resultVisible||C.overlayVisible||C.helpVisible||(M.preventDefault(),C.triggerAction())};window.addEventListener("keydown",ut);const dt=()=>{const M=A.player.eye,F=A.player.lookDir;let te=null,ge=5;for(const fe of k){if(!fe.mine)continue;const Fe=fe.perch.x+.5-M.x,$e=fe.perch.y+.6-M.y,Ye=fe.perch.z+.5-M.z,gt=Math.hypot(Fe,$e,Ye);gt>ge||gt<.01||(Fe*F.x+$e*F.y+Ye*F.z)/gt<.8||(te=fe,ge=gt)}return te},Ue=()=>ae.some(M=>M!==null&&M.item===Cc);let pt=null;const it=()=>{const M=A.player.pos;if(!bh(A.portalPos,M.x,M.y,M.z)){if(A.kind==="village"&&!v){const ge=dt();if(ge||(pt=null),ge&&ge.id!==pt){const fe=dn.find(ge.dragon)?.name??ge.dragon,Fe=()=>{pt=ge.id,C.hideAction()};ge.stage!=="adult"?C.showAction(`${fe} (아기)`,"어른이 되면 탈 수 있어요 — 둥지 창에서 먹이를 주면 빨리 자라요","알겠어요",Fe):Ue()?C.showAction(`🐉 ${fe} 타기`,t?"▲ 위로 · ▼ 아래로 · 🐉 버튼으로 내려요":"Space 위로 · Shift 아래로 · 🐉 버튼으로 내려요","타기"+ct,()=>n.sendRide(ge.id)):C.showAction(`${fe} 타기`,"안장이 있어야 해요 — 제작대: 가죽 5 + 철 2 (가죽은 원정 보물 상자)","알겠어요",Fe);return}}const te=Rc("storage");if(A.kind==="village"&&te&&Math.hypot(M.x-Fa(te).x,M.z-Fa(te).z)<=yh){C.showAction("마을 창고",`마을 레벨 ${Ee.level} · 재료를 모아 건물을 지어요`,"창고 열기"+ct,Ds);return}if(A.kind==="village"&&Eh(Mh,M.x,M.y,M.z)){C.showAction("드래곤 둥지","알을 놓고, 레벨을 써서 부화시켜요","둥지 열기"+ct,Lr);return}C.actionVisible&&C.hideAction();return}if(A.kind==="village"){const te=bf.require(Ac);if(Ve?.enforced&&!Sh(Ve,Math.ceil(te.durationSec/60),Ga)){const ge=wh(Math.ceil(te.durationSec/60),Ga),fe=Ve.noPlayToday?"오늘은 게임 없는 날이에요":Ve.minutesUntilBlocked<Ve.remainingMin?`게임 시간이 ${Ve.minutesUntilBlocked}분 뒤에 끝나요`:`남은 시간 ${Ve.remainingMin}분`;C.showAction("오늘은 마을에서 놀자",`${fe} · 원정은 ${ge}분 필요해요`,"알겠어요",()=>C.hideAction());return}if(j){const ge=Math.floor(j.remainingSec/60);C.showAction(`${j.name} 원정 중`,`${j.players}명이 나가 있어요 · 약 ${ge}분 남음`,"따라가기"+ct,()=>n.sendStartExpedition(j.id))}else C.showAction(`${te.name}으로 원정`,`${Math.round(te.durationSec/60)}분 · ${Math.round(te.nightStartsAt/60)}분 뒤 밤 · 보물 상자 ${te.treasures}개
포탈로 돌아오면 모은 것을 가져와요`,"원정 출발"+ct,()=>n.sendStartExpedition(Ac))}else C.showAction("마을로 돌아가기","지금까지 모은 것을 마을 창고에 넣어요","돌아가기"+ct,()=>n.sendReturnHome())},Ut=()=>{const M=A.player,F=M.pos,te=(M.yaw*180/Math.PI+360)%360,ge=Vb[Math.round(te/45)%8],fe=A.interaction.target,Fe=fe?`${r.get(fe.id).name} (${fe.x}, ${fe.y}, ${fe.z}) 면 ${["+X","-X","+Y","-Y","+Z","-Z"][fe.face]}`:"없음",$e=A.expedition?`원정 ${A.expedition.name} 시드 ${A.expedition.seed} 경과 ${ot().toFixed(0)}s 하늘 ${Q.toFixed(2)}`:`마을 ${i.village.code} 시드 ${i.village.seed}`;return[`FPS ${ce}  프레임 ${le.ema.toFixed(1)}ms  해상도 ×${le.pixelRatio.toFixed(2)}  렌더거리 ${A.chunks.renderDistance}  화면 ${ue}×${Se} 버퍼 ${d.domElement.width}×${d.domElement.height} 비율 ${l.aspect.toFixed(2)}`,`드로우 ${Te}  삼각형 ${(Me/1e3).toFixed(1)}k`,`청크 보임 ${A.chunks.stats.visibleChunks}  큐 ${A.chunks.queued}  진행 ${A.chunks.inflight}  워커 ${f.size}`,`메싱 최근 ${A.chunks.stats.lastMs.toFixed(1)}ms  평균 ${A.chunks.stats.avgMs.toFixed(1)}ms  최대 ${A.chunks.stats.maxMs.toFixed(1)}ms  총 ${A.chunks.stats.meshed}`,`위치 ${F.x.toFixed(2)} ${F.y.toFixed(2)} ${F.z.toFixed(2)}  yaw ${te.toFixed(0)}°  pitch ${(M.pitch*180/Math.PI).toFixed(0)}°  ${ge}`,`조준 ${Fe}`,`바닥 ${M.onGround?"O":"X"}  물 ${M.inWater?"O":"X"}  웅크림 ${M.sneaking?"O":"X"}  달리기 ${M.sprinting?"O":"X"}`,`빛 여기 하늘 ${A.light.skyAt(Math.floor(F.x),Math.floor(F.y+1),Math.floor(F.z))} 블록 ${A.light.blockAt(Math.floor(F.x),Math.floor(F.y+1),Math.floor(F.z))}  조명 처음 ${A.light.stats.initialMs.toFixed(0)}ms  최근 ${A.light.stats.lastFlushMs.toFixed(1)}ms/${A.light.stats.lastFlushCells}칸  지형 생성 ${A.genMs.toFixed(0)}ms  청크 ${A.world.chunkCount}`,`${t?"터치":"PC"}  ${navigator.hardwareConcurrency??"?"}코어  ${window.innerWidth}×${window.innerHeight}@${(window.devicePixelRatio||1).toFixed(1)}`,`서버 ${n.connected?`연결됨 왕복 ${n.rtt}ms`:"끊김"}  나 #${u}  같이 ${E.count}명  블록 대기 ${Oe.size}  ${$e}`,`가방 ${ae.filter(Boolean).length}/${ae.length}칸  손 ${C.selectedItem??"빈 손"}`].join(`
`)},Mn=M=>{O&&(requestAnimationFrame(Mn),Ft(M))},Ft=(M,F)=>{const te=Math.max(0,Math.min(.1,(M-X)/1e3));X=Math.max(X,M);const{player:ge,interaction:fe,chunks:Fe,light:$e}=A;(Be=(Be+1)%15)===0&&oe();const Ye=_e.frame(te);C.tickEffects(te),Ye.toggleDebug&&(He=!He),Ye.slotDelta!==0&&C.selectDelta(Ye.slotDelta),Ye.slotSelect>=0&&C.select(Ye.slotSelect),fe.selectedBlock=be(),fe.heldItem=C.selectedItem,ge.update(Ye,te),L=Math.max(0,L-te);const gt=D.count>0?D.aim(ge.eye,ge.lookDir,gh):null;if(fe.suppressPrimary=gt!==null,gt!==null&&Ye.primary&&L<=0&&(L=_h/1e3,n.sendHit(gt,C.selectedIndex),w.swing()),fe.update(Ye,te),ge.applyToCamera(l,Ie),Ge+=te*1e3,At&&Ge>=zb&&(Ge=0,qe()),E.update(te,A.light,Q),y.update(te),S.update(ge,te),R.update(),x.update(te),D.update(te),B&&N(),Fe.markDirtyAll($e.flush()),fe.target?(p.setTarget(fe.target.x,fe.target.y,fe.target.z),p.setProgress(fe.progress)):p.clearTarget(),C.setProgress(fe.progress),C.setHeading(ge.yaw),At&&it(),ne.visible&&(Xe+=te*1e3)>=Ob&&(Xe=0,ne.setStations(Pe())),A.expedition){const mn=A.expedition,fi=ot(),pi=Math.max(0,mn.durationSec-fi),ka=vh(mn,fi);C.setTimer(pi,ka),ke(Math.max(Ah,xh(mn,fi))),!he&&pi<=180&&pi>60&&(he=!0,C.toast("3분 남았어요! 포탈로 돌아가요",5e3)),!De&&pi<=60&&(De=!0,C.toast("1분! 지금 돌아가지 않으면 절반만 가져가요",6e3))}Fe.update(ge.pos.x,ge.pos.y,ge.pos.z),c.setTime(M/1e3),m.update(l.position),A.portal.update(M/1e3),w.setBlock(be());const en=ge.onGround&&ge.horizontalSpeed>.4?Math.min(1,ge.horizontalSpeed/4.3):0;w.update(te,l,ge.walkCycle,en),d.clear(),d.render(h,l),Te=d.info.render.calls,Me=d.info.render.triangles,w.render(d,l),le.frame(te),K++,z+=te,z>=.5&&(ce=Math.round(K/z),K=0,z=0),Ae+=te,He&&Ae>=.25?(Ae=0,C.setDebug(Ut())):He||C.setDebug(null)};return O=!0,requestAnimationFrame(Mn),C.showOverlay(`${i.village.name}`,(t?`왼쪽 아래 스틱: 움직이기  ·  드래그: 둘러보기
짧게 탭: 놓기  ·  꾹: 부수기`:`WASD 이동  ·  마우스 둘러보기
좌클릭 꾹: 부수기  ·  우클릭: 놓기`)+`
마을 코드 ${i.village.code}`,t?"탭해서 시작":"클릭해서 시작"),{start(){if(At)return;At=!0;const M=E.count;C.toast(M>0?`마을에 들어왔어요. 지금 ${M}명이 함께 있어요`:"마을에 들어왔어요. 친구에게 마을 코드를 알려 주세요",4e3),t&&(tt?ji():lt||C.toast($t,7e3),window.innerHeight>window.innerWidth&&(tt||lt)&&C.toast("폰을 가로로 돌리면 더 편해요",3500)),i.gifts.forEach((F,te)=>setTimeout(()=>C.toast(`🎁 ${F.message}`,8e3),2500+te*1500)),qe(),Pt()},dispose(){O=!1,n.close(),_e.dispose(),ie(A),f.dispose(),m.dispose(),p.dispose(),w.dispose(),E.dispose(),c.dispose(),o.texture.dispose(),d.dispose(),window.removeEventListener("resize",$),window.removeEventListener("keydown",ut),ne.el.remove(),Qe.sheet.remove(),Qe.log.remove(),Re?.disconnect(),s.innerHTML=""}}}export{Hb as createGame};
//# sourceMappingURL=Game-Ds6jcY7_.js.map
