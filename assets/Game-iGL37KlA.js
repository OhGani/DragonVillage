import{F as Hr,A as fn,C as sr,h as vt,i as zs,j as El,p as lc,k as cc,l as uc,m as dc,n as hc,o as fc,q as pc,D as mc,r as gc,s as Sl,t as rn,u as _c,I as rr,H as Wr,v as vc,w as or,x as Ac,y as xc,z as Ec,E as Ml,B as Sc,G as Mc,J as yc,S as Ko,R as bc,K as wc,L as Tc,N as Cc,O as Rc,Q as Dc,T as Pc,U as Uc,V as Ic,W as Lc,X as kc,Y as Nc}from"./index-BIF2cc-i.js";const Bc={coal:"석탄",glowstone_dust:"발광석 가루",emerald:"에메랄드",lapis:"청금석",quartz:"석영",apple:"사과",redstone:"레드스톤 가루",leather:"가죽",wheat:"밀",milk_bucket:"우유 양동이",egg:"달걀",carrot:"당근",snowball:"눈덩이",feather:"깃털",string:"실",flint:"부싯돌",pumpkin_seeds:"호박 씨",name_tag_blank:"빈 이름표",white_wool:"흰 양털",ink_sac:"먹물",brown_mushroom:"갈색 버섯",melon_slice:"수박 조각",slime_ball:"슬라임 볼",scute:"인갑",bucket:"양동이",water_bucket:"물 양동이",lava_source_block:"용암(원천)",water_source_block:"물"};function Fc(i,e){if(Array.isArray(e))for(const t of e){if(!t||typeof t!="object")continue;const{id:n,name:s}=t;typeof n=="string"&&typeof s=="string"&&!i.has(n)&&i.set(n,s)}}function Oc(i){const e=new Map,t=i.recipes?.recipes;if(Array.isArray(t))for(const s of t){if(!s||typeof s!="object")continue;const{out:r,name:o}=s;if(!r||typeof o!="string")continue;const a=Object.keys(r);a.length===1&&!e.has(a[0])&&e.set(a[0],o)}Fc(e,i.dragons?.materials);const n=i.potions;for(const s of[n?.ingredients,n?.modifiers])if(s)for(const[r,o]of Object.entries(s)){if(r.startsWith("_")||e.has(r))continue;const a=o?.name;typeof a=="string"&&e.set(r,a)}for(const[s,r]of Object.entries(Bc))e.has(s)||e.set(s,r);return e}function jo(i,e,t){return e.find(i)?.name??t.get(i)??i}const zc="water_bucket",Vc="lava_bucket";function Gc(i,e){if(i===zc){const n=e.find("water");return n?e.fluidFinite(n.num,Hr):null}if(i===Vc){const n=e.find("lava");return n?e.fluidFinite(n.num,Hr):null}const t=e.find(i);return!t||t.internal||t.fluid||t.num===0?null:t.num}const Hc=1;function Jo(i,e,t){let n=0;const s=i[n++];if(s!==Hc)throw new Error(`모르는 청크 저장 형식: ${s}`);const r=i[n]|i[n+1]<<8;n+=2;const o=[],a=[];for(let d=0;d<r;d++){const h=i[n++];let p="";for(let v=0;v<h;v++)p+=String.fromCharCode(i[n++]);const g=e.find(p);g?o.push(g.num):(o.push(fn),a.push(p))}const c=i[n]|i[n+1]<<8;n+=2;const l=new Uint16Array(sr);let u=0;for(let d=0;d<c;d++){const h=i[n]|i[n+1]<<8,p=i[n+2]|i[n+3]<<8;if(n+=4,p>=o.length)throw new Error(`팔레트 번호가 범위를 벗어났어요: ${p}`);const g=o[p];if(u+h>sr)throw new Error("청크 데이터가 4096 을 넘어요");l.fill(g,u,u+h),u+=h}if(u!==sr)throw new Error(`청크 데이터가 ${u}개 — 4096 이어야 해요`);return t.loadBlockIds(l),{unknownIds:a}}const Wc=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];function Xc(i,e,t,n,s,r,o,a,c){const l=Math.hypot(r,o,a);if(l===0)return null;r/=l,o/=l,a/=l;let u=Math.floor(t),d=Math.floor(n),h=Math.floor(s);const p=r>0?1:r<0?-1:0,g=o>0?1:o<0?-1:0,v=a>0?1:a<0?-1:0,m=p?Math.abs(1/r):1/0,f=g?Math.abs(1/o):1/0,b=v?Math.abs(1/a):1/0;let M=p>0?(u+1-t)/r:p<0?(t-u)/-r:1/0,_=g>0?(d+1-n)/o:g<0?(n-d)/-o:1/0,T=v>0?(h+1-s)/a:v<0?(s-h)/-a:1/0,y=-1,C=0;for(let L=0;L<256;L++){if(y>=0){const S=i(u,d,h);if(e(S)){const x=Wc[y];return{x:u,y:d,z:h,face:y,nx:x[0],ny:x[1],nz:x[2],distance:C,id:S}}}if(M<_&&M<T){if(C=M,C>c)return null;u+=p,M+=m,y=p>0?1:0}else if(_<T){if(C=_,C>c)return null;d+=g,_+=f,y=g>0?3:2}else{if(C=T,C>c)return null;h+=v,T+=b,y=v>0?5:4}}return null}const et=1e-4;function Oi(i,e,t,n,s){const r=e.w/2;return t+1>i.x-r+et&&t<i.x+r-et&&n+1>i.y+et&&n<i.y+e.h-et&&s+1>i.z-r+et&&s<i.z+r-et}function ar(i,e,t,n,s,r,o,a,c){const l=u=>{for(let d=r;d<=o;d++)for(let h=a;h<=c;h++)if(e===0?i(u,d,h):e===1?i(d,u,h):i(d,h,u))return!0;return!1};if(s>0){const u=Math.floor(n-et)+1,d=Math.floor(n+s-et);for(let h=u;h<=d;h++)if(l(h))return h}else{const u=Math.floor(t+et)-1,d=Math.floor(t+s+et);for(let h=u;h>=d;h--)if(l(h))return h}return null}function Vs(i,e,t,n,s,r){r.onGround=!1,r.hitX=r.hitY=r.hitZ=r.hitCeiling=!1;const o=t.w/2;let a=n.y*s;if(a!==0){const c=Math.floor(e.x-o+et),l=Math.floor(e.x+o-et),u=Math.floor(e.z-o+et),d=Math.floor(e.z+o-et),h=ar(i,1,e.y,e.y+t.h,a,c,l,u,d);h===null?e.y+=a:a>0?(e.y=h-t.h-et,n.y=0,r.hitY=r.hitCeiling=!0):(e.y=h+1,n.y=0,r.hitY=r.onGround=!0)}if(a=n.x*s,a!==0){const c=Math.floor(e.y+et),l=Math.floor(e.y+t.h-et),u=Math.floor(e.z-o+et),d=Math.floor(e.z+o-et),h=ar(i,0,e.x-o,e.x+o,a,c,l,u,d);h===null?e.x+=a:(e.x=a>0?h-o-et:h+1+o+et,n.x=0,r.hitX=!0)}if(a=n.z*s,a!==0){const c=Math.floor(e.y+et),l=Math.floor(e.y+t.h-et),u=Math.floor(e.x-o+et),d=Math.floor(e.x+o-et),h=ar(i,2,e.z-o,e.z+o,a,u,d,c,l);h===null?e.z+=a:(e.z=a>0?h-o-et:h+1+o+et,n.z=0,r.hitZ=!0)}}const fs={onGround:!1,hitX:!1,hitY:!1,hitZ:!1,hitCeiling:!1};function Yc(i,e,t,n,s,r,o,a=1){if(o<=0||s===0&&r===0)return null;const c={x:e.x,y:e.y,z:e.z},l={x:0,y:a/o,z:0};if(Vs(i,c,n,l,o,fs),c.y-e.y<a-.05)return null;l.x=s,l.y=0,l.z=r,Vs(i,c,n,l,o,fs);const u=(c.x-e.x)**2+(c.z-e.z)**2,d=(t.x-e.x)**2+(t.z-e.z)**2;if(u<=d+1e-9)return null;const h=l.x,p=l.z;if(l.x=0,l.y=-(a+.05)/o,l.z=0,Vs(i,c,n,l,o,fs),!fs.onGround||c.y<=e.y+1e-4)return null;const g=c.y-e.y;return t.x=c.x,t.y=c.y,t.z=c.z,{dy:g,vx:h,vz:p}}function lr(i,e,t,n=.05){const s=t.w/2,r=Math.floor(e.y-n),o=Math.floor(e.x-s+et),a=Math.floor(e.x+s-et),c=Math.floor(e.z-s+et),l=Math.floor(e.z+s-et);for(let u=c;u<=l;u++)for(let d=o;d<=a;d++)if(i(d,r,u))return!0;return!1}const Gt=15,wi=240;function Qc(i){return i>>4}function qc(i){return i&15}const jt=0,ri=1,ps=3,zi=()=>performance.now();class Kc{constructor(e,t){this.world=e,this.sx=e.sizeX,this.sy=e.sizeY,this.sz=e.sizeZ,this.strideY=this.sx*this.sz;const n=this.sx*this.sy*this.sz;this.light=new Uint8Array(n),this.cells=new Uint8Array(n),this.table=new Uint8Array(t.count);for(const s of t.defs)this.table[s.num]=Math.min(Gt,s.lightEmit)<<4|Math.min(Gt,s.lightFilter)}world;light;cells;table;sx;sy;sz;strideY;pending=new Set;changedChunks=new Map;tracking=!1;changedCells=0;buckets=Array.from({length:Gt+1},()=>[]);stats={initialMs:0,lastFlushMs:0,lastFlushCells:0};index(e,t,n){return t*this.strideY+n*this.sx+e}get(e,t,n){return this.world.inBounds(e,t,n)?this.light[this.index(e,t,n)]:wi}skyAt(e,t,n){return Qc(this.get(e,t,n))}blockAt(e,t,n){return qc(this.get(e,t,n))}computeAll(e=!1){const t=zi();this.light.fill(0),this.fillCells(),this.tracking=!1,this.pending.clear();const{sx:n,sy:s,sz:r,cells:o,light:a,buckets:c,strideY:l}=this;if(e){const u=(s-1)*l;for(let d=0;d<r;d++)for(let h=0;h<n;h++){const p=u+d*n+h,g=this.fromSkyAbove(o[p]&15);g>0&&(a[p]=g<<4,c[g].push(p))}}else{const u=new Int32Array(n*r);for(let d=0;d<r;d++)for(let h=0;h<n;h++){let p=s-1,g=p*l+d*n+h;for(;p>=0&&(o[g]&15)===0;)a[g]=Gt<<4,p--,g-=l;u[d*n+h]=p}for(let d=0;d<r;d++)for(let h=0;h<n;h++){const p=u[d*n+h],g=d*n+h;if(p===s-1){const m=this.fromSkyAbove(o[p*l+g]&15);m>0&&(a[p*l+g]=a[p*l+g]&15|m<<4,c[m].push(p*l+g));continue}c[Gt].push((p+1)*l+g);const v=m=>{for(let f=p+2;f<=m;f++)c[Gt].push(f*l+g)};h>0&&v(u[g-1]),h<n-1&&v(u[g+1]),d>0&&v(u[g-n]),d<r-1&&v(u[g+n])}}this.propagate(jt);for(let u=0;u<o.length;u++){const d=o[u]>>4;d!==0&&(a[u]=a[u]&240|d,c[d].push(u))}this.propagate(ri),this.stats.initialMs=zi()-t}fromSkyAbove(e){return e===0?Gt:Gt-Math.max(1,e)}fillCells(){const{cells:e,table:t}=this;e.fill(0),this.world.forEachChunk(n=>{const s=n.cx<<4,r=n.cy<<4,o=n.cz<<4,{data:a,palette:c}=n;let l=0;for(let u=0;u<vt;u++)for(let d=0;d<vt;d++){let h=this.index(s,r+u,o+d);for(let p=0;p<vt;p++,h++,l++)e[h]=t[c[a[l]]]}})}markChanged(e,t,n){this.world.inBounds(e,t,n)&&this.pending.add(this.index(e,t,n))}get pendingCount(){return this.pending.size}flush(){if(this.pending.size===0)return[];const e=zi(),{cells:t,table:n,light:s,buckets:r}=this,o=[],a=[];for(const g of this.pending){const v=g%this.sx,m=(g-v)/this.sx,f=m%this.sz,b=(m-f)/this.sz,M=n[this.world.getBlock(v,b,f)]??0;M!==t[g]&&(o.push(g),a.push(M))}if(this.pending.clear(),o.length===0)return this.stats.lastFlushMs=zi()-e,this.stats.lastFlushCells=0,[];this.tracking=!0,this.changedChunks.clear(),this.changedCells=0;const c=[],l=[];for(let g=0;g<o.length;g++){const v=o[g],m=t[v],f=a[g],b=(f&15)>(m&15);b&&c.push(v),(b||f>>4<m>>4)&&l.push(v)}const u=this.remove(jt,c),d=this.remove(ri,l);for(let g=0;g<o.length;g++)t[o[g]]=a[g];const h=(g,v)=>{const m=g===jt?s[v]>>4:s[v]&15;m>0&&r[m].push(v)},p=(g,v,m,f,b)=>{h(g,v),m>0&&h(g,v-1),m<this.sx-1&&h(g,v+1),b>0&&h(g,v-this.sx),b<this.sz-1&&h(g,v+this.sx),f>0&&h(g,v-this.strideY),f<this.sy-1&&h(g,v+this.strideY)};for(const g of u)h(jt,g);for(let g=0;g<o.length;g++){const v=o[g],m=v%this.sx,f=(v-m)/this.sx,b=f%this.sz,M=(f-b)/this.sz;if(M===this.sy-1){const _=this.fromSkyAbove(a[g]&15);_>s[v]>>4&&(s[v]=s[v]&15|_<<4,this.mark(m,M,b))}p(jt,v,m,M,b)}this.propagate(jt);for(const g of d)h(ri,g);for(let g=0;g<o.length;g++){const v=o[g],m=v%this.sx,f=(v-m)/this.sx,b=f%this.sz,M=(f-b)/this.sz,_=a[g]>>4;_>(s[v]&15)&&(s[v]=s[v]&240|_,this.mark(m,M,b)),p(ri,v,m,M,b)}return this.propagate(ri),this.tracking=!1,this.stats.lastFlushMs=zi()-e,this.stats.lastFlushCells=this.changedCells,[...this.changedChunks.values()]}remove(e,t){const n=[];if(t.length===0)return n;const{light:s,cells:r,sx:o,sy:a,sz:c,strideY:l}=this,u=[],d=v=>e===jt?s[v]>>4:s[v]&15,h=v=>{s[v]=e===jt?s[v]&15:s[v]&240},p=[];for(const v of t){const m=d(v);if(m===0)continue;h(v),u.push(v,m);const f=v%o,b=(v-f)/o,M=b%c;this.mark(f,(b-M)/c,M)}const g=(v,m,f,b,M,_)=>{const T=d(v);T!==0&&(T<m||e===jt&&f===ps&&m===Gt&&T===Gt?(h(v),this.mark(b,M,_),u.push(v,T),e===ri&&r[v]>>4>0&&p.push(v)):n.push(v))};for(;u.length;){const v=u.pop(),m=u.pop(),f=m%o,b=(m-f)/o,M=b%c,_=(b-M)/c;f>0&&g(m-1,v,0,f-1,_,M),f<o-1&&g(m+1,v,1,f+1,_,M),_<a-1&&g(m+l,v,2,f,_+1,M),_>0&&g(m-l,v,ps,f,_-1,M),M>0&&g(m-o,v,4,f,_,M-1),M<c-1&&g(m+o,v,5,f,_,M+1)}for(const v of p){const m=r[v]>>4;m>(s[v]&15)&&(s[v]=s[v]&240|m),n.push(v)}return n}propagate(e){const{light:t,cells:n,sx:s,sy:r,sz:o,strideY:a,buckets:c}=this,l=u=>e===jt?t[u]>>4:t[u]&15;for(let u=Gt;u>=1;u--){const d=c[u];for(;d.length;){const h=d.pop();if(l(h)!==u)continue;const p=h%s,g=(h-p)/s,v=g%o,m=(g-v)/o,f=(b,M,_,T,y)=>{const C=n[b]&15;let L;e===jt&&M===ps&&u===Gt&&C===0?L=Gt:L=u-(C>1?C:1),!(L<=0||L<=l(b))&&(t[b]=e===jt?t[b]&15|L<<4:t[b]&240|L,this.tracking&&this.mark(_,T,y),c[L].push(b))};p>0&&f(h-1,0,p-1,m,v),p<s-1&&f(h+1,1,p+1,m,v),m<r-1&&f(h+a,2,p,m+1,v),m>0&&f(h-a,ps,p,m-1,v),v>0&&f(h-s,4,p,m,v-1),v<o-1&&f(h+s,5,p,m,v+1)}}}mark(e,t,n){if(!this.tracking)return;this.changedCells++;const s=e>>4,r=t>>4,o=n>>4,a=e&15,c=t&15,l=n&15,u=a===0?-1:0,d=a===15?1:0,h=c===0?-1:0,p=c===15?1:0,g=l===0?-1:0,v=l===15?1:0;for(let m=u;m<=d;m++)for(let f=h;f<=p;f++)for(let b=g;b<=v;b++){const M=s+m,_=r+f,T=o+b;if(!this.world.chunkInBounds(M,_,T))continue;const y=zs(M,_,T);this.changedChunks.has(y)||this.changedChunks.set(y,{cx:M,cy:_,cz:T})}}buildPaddedLight(e,t,n,s){const r=s??new Uint8Array(El),{sx:o,sy:a,sz:c,light:l}=this,u=e<<4,d=t<<4,h=n<<4;let p=0;for(let g=-1;g<=vt;g++){const v=d+g,m=v>=0&&v<a;for(let f=-1;f<=vt;f++){const b=h+f,M=m&&b>=0&&b<c,_=v*this.strideY+b*o;for(let T=-1;T<=vt;T++,p++){const y=u+T;r[p]=M&&y>=0&&y<o?l[_+y]:wi}}}return r}}const jc="블록 목록. 아들이 숫자를 바꿔도 돼. hardness = 부수는 데 걸리는 초(맨손). tool = 필요한 도구 종류(없으면 null). drops = 부수면 나오는 아이템(없으면 자기 자신). lightEmit = 빛 세기 0~15 (횃불 14, 발광석·용암 15). lightFilter = 빛을 얼마나 막는지 0~15 (안 적으면 자동: 불투명 블록 15, 물 1, 유리·공기 0. 나뭇잎·얼음은 1로 적어 둠). texture = textures/ 폴더의 파일 이름(확장자 없이). 면마다 다르면 textureTop/textureSide/textureBottom. 광물(에메랄드·청금석·석영·레드스톤·고대 잔해), 흑요석 규칙, 장식·건축 블록은 아들 3차 디테일(2026-09-12) 반영. shape = 특수 형태 블록(계단·문·울타리 등, 모델은 M4에서). fluid = 액체 종류(water 또는 lava): 벽이 없으면 옆으로 퍼지고 아래로 흐른다.",Jc=[{id:"air",name:"공기",solid:!1,transparent:!0},{id:"bedrock",name:"기반암",tool:null,lightEmit:0,texture:"bedrock",_note:"세계 맨 아래 한 겹. hardness 가 없으면 부술 수 없는 블록이야"},{id:"stone",name:"돌",hardness:1.5,tool:"pickaxe",drops:"cobblestone",lightEmit:0,texture:"stone"},{id:"cobblestone",name:"조약돌",hardness:2,tool:"pickaxe",lightEmit:0,texture:"cobblestone"},{id:"dirt",name:"흙",hardness:.5,tool:null,lightEmit:0,texture:"dirt"},{id:"farmland",name:"농지",hardness:.6,tool:null,drops:"dirt",lightEmit:0,texture:"farmland",_note:"밭의 갈아 놓은 흙. 마을 터 생성기(M1)가 큰 밭에 깐다. 씨앗 심기·작물은 M4"},{id:"grass",name:"잔디",hardness:.6,tool:null,drops:"dirt",lightEmit:0,textureTop:"grass_top",textureSide:"grass_side",textureBottom:"dirt"},{id:"sand",name:"모래",hardness:.5,tool:null,lightEmit:0,texture:"sand"},{id:"gravel",name:"자갈",hardness:.6,tool:null,lightEmit:0,texture:"gravel"},{id:"log",name:"원목",hardness:2,tool:null,lightEmit:0,textureTop:"log_top",textureSide:"log_side",textureBottom:"log_top"},{id:"planks",name:"판자",hardness:2,tool:null,lightEmit:0,texture:"planks"},{id:"leaves",name:"나뭇잎",hardness:.2,tool:null,transparent:!0,lightEmit:0,lightFilter:1,texture:"leaves",shearDrops:["stick","sapling","apple"],_note:"아들 7차: 가위로 자르면 막대기나 그 나무 묘목이 나오고, 참나무에서는 사과도. 맨손으로 부수면 사라짐 (M4 아이템 드롭)"},{id:"glass",name:"유리",hardness:.3,tool:null,transparent:!0,_note:"마인크래프트는 유리를 깨면 사라지지만 여기서는 유리로 돌아온다(아빠 2026-09-19, 결정 #70 — 실크 터치 없음)",lightEmit:0,texture:"glass"},{id:"water",name:"물",solid:!1,transparent:!0,fluid:"water",lightEmit:0,texture:"water"},{id:"torch",name:"횃불",hardness:0,tool:null,solid:!1,lightEmit:14,texture:"torch"},{id:"coal_ore",name:"석탄 광석",hardness:3,tool:"pickaxe",toolTier:1,drops:"coal",lightEmit:0,texture:"coal_ore"},{id:"iron_ore",name:"철 광석",hardness:3,tool:"pickaxe",toolTier:2,lightEmit:0,texture:"iron_ore"},{id:"gold_ore",name:"금 광석",hardness:3,tool:"pickaxe",toolTier:3,lightEmit:0,texture:"gold_ore"},{id:"diamond_ore",name:"다이아몬드 광석",hardness:3,tool:"pickaxe",toolTier:3,drops:"diamond",lightEmit:0,texture:"diamond_ore"},{id:"netherrack",name:"네더랙",hardness:.4,tool:"pickaxe",lightEmit:0,texture:"netherrack"},{id:"lava",name:"용암",solid:!1,transparent:!1,fluid:"lava",lightEmit:15,damage:4,texture:"lava"},{id:"glowstone",name:"발광석",hardness:.3,tool:null,bonusDrops:"glowstone_dust",bonusCount:[0,3],_note:"캐면 발광석 블록 1개가 들어오고, 덤으로 발광석 가루 0~3개(bonusCount, 아빠 2026-09-19 — 아들 9차 '가루 2~4개'를 블록 + 덤으로 바꿈). 가루는 물약 단계 올리기 재료(potions.json). 개수 뽑기는 서버가 시드 PRNG 로",lightEmit:15,texture:"glowstone"},{id:"snow",name:"눈",hardness:.2,tool:null,lightEmit:0,texture:"snow"},{id:"ice",name:"얼음",hardness:.5,tool:"pickaxe",transparent:!0,lightEmit:0,lightFilter:1,texture:"ice",_note:"아들 7차: 물은 눈 바이옴(설원)에서 얼음으로 언다. 설원 원정지 생성기(M3)에서 물 표면을 얼음으로"},{id:"end_stone",name:"엔드 돌",hardness:3,tool:"pickaxe",toolTier:2,lightEmit:0,texture:"end_stone"},{id:"emerald_ore",name:"에메랄드 광석",hardness:3,tool:"pickaxe",toolTier:2,drops:"emerald",lightEmit:0,texture:"emerald_ore"},{id:"lapis_ore",name:"청금석 광석",hardness:3,tool:"pickaxe",toolTier:1,drops:"lapis",lightEmit:0,texture:"lapis_ore",_note:"인챈트에 필요 (아들)"},{id:"nether_quartz_ore",name:"석영 광석",hardness:3,tool:"pickaxe",toolTier:1,drops:"quartz",lightEmit:0,texture:"quartz_ore"},{id:"redstone_ore",name:"레드스톤 광석",hardness:3,tool:"pickaxe",toolTier:2,drops:"redstone",lightEmit:0,texture:"redstone_ore"},{id:"ancient_debris",name:"고대 잔해",hardness:30,tool:"pickaxe",toolTier:3,lightEmit:0,texture:"ancient_debris"},{id:"obsidian",name:"흑요석",hardness:50,tool:"pickaxe",toolTier:3,lightEmit:0,texture:"obsidian",_note:"용암 블록에 물 양동이를 부으면 생성. 다이아 곡괭이(티어3)로만 캔다 (아들)"},{id:"hay_bale",name:"건초 더미",hardness:.5,tool:null,lightEmit:0,texture:"hay_bale"},{id:"bookshelf",name:"책장",hardness:1.5,tool:null,_note:"캐면 책장 그대로(결정 #70). 마인크래프트의 책 3개 드롭은 안 씀",lightEmit:0,texture:"bookshelf"},{id:"enchanting_table",name:"인챈트 테이블",hardness:5,tool:"pickaxe",lightEmit:7,texture:"enchanting_table",release:"v1.1"},{id:"cactus",name:"선인장",hardness:.4,tool:null,damage:1,lightEmit:0,texture:"cactus"},{id:"sugar_cane",name:"사탕수수",hardness:0,tool:null,solid:!1,lightEmit:0,texture:"sugar_cane",_note:"물가에서 자란다"},{id:"pumpkin",name:"호박",hardness:1,tool:null,lightEmit:0,texture:"pumpkin"},{id:"carved_pumpkin",name:"조각된 호박",hardness:1,tool:null,lightEmit:0,texture:"carved_pumpkin"},{id:"jack_o_lantern",name:"잭오랜턴",hardness:1,tool:null,lightEmit:15,texture:"jack_o_lantern"},{id:"melon",name:"수박",hardness:1,tool:null,lightEmit:0,texture:"melon"},{id:"iron_block",name:"철 블록",hardness:5,tool:"pickaxe",toolTier:1,lightEmit:0,texture:"iron_block"},{id:"gold_block",name:"금 블록",hardness:3,tool:"pickaxe",toolTier:2,lightEmit:0,texture:"gold_block"},{id:"quartz_block",name:"석영 블록",hardness:.8,tool:"pickaxe",lightEmit:0,texture:"quartz_block"},{id:"netherite_block",name:"네더라이트 블록",hardness:50,tool:"pickaxe",toolTier:3,lightEmit:0,texture:"netherite_block"},{id:"emerald_block",name:"에메랄드 블록",hardness:5,tool:"pickaxe",toolTier:2,lightEmit:0,texture:"emerald_block"},{id:"diamond_block",name:"다이아몬드 블록",hardness:5,tool:"pickaxe",toolTier:2,lightEmit:0,texture:"diamond_block"},{id:"oak_stairs",name:"계단",hardness:2,tool:null,lightEmit:0,texture:"planks",shape:"stairs"},{id:"oak_door",name:"문",hardness:3,tool:null,lightEmit:0,transparent:!0,textureTop:"door_top",textureSide:"door_bottom",textureBottom:"door_bottom",shape:"door",_note:"문은 두 칸(아래·위). textureTop = 윗칸 그림(창문), textureBottom = 아랫칸 그림(판·손잡이). 탭하면 열리고 닫힌다(결정 #71). 그림은 아빠가 보낸 참나무 문(2026-09-19)"},{id:"oak_trapdoor",name:"다락문",hardness:3,tool:null,lightEmit:0,texture:"trapdoor",shape:"trapdoor"},{id:"oak_fence",name:"울타리",hardness:2,tool:null,lightEmit:0,texture:"planks",shape:"fence"},{id:"sign",name:"표지판",hardness:1,tool:null,solid:!1,lightEmit:0,texture:"sign",shape:"sign"},{id:"bed",name:"침대",hardness:.2,tool:null,lightEmit:0,texture:"bed",shape:"bed",_note:"네더·엔드에서 클릭 시 폭발"},{id:"chest",name:"상자",hardness:2.5,tool:null,lightEmit:0,textureTop:"chest_top",textureSide:"chest_side",textureBottom:"chest_top",shape:"chest"},{id:"furnace",name:"화로",hardness:3.5,tool:"pickaxe",lightEmit:0,texture:"furnace"},{id:"crafting_table",name:"제작대",hardness:2.5,tool:"axe",textureTop:"crafting_table_top",textureSide:"crafting_table_side",textureBottom:"planks",_note:"M4: 판자 4개로 만들어 놓는다. 5칸 안에 있으면 레시피를 만들 수 있다. 그림은 아들 스케치(2026-09-19, 위 3×3 격자·옆 세로 판자 + 도구)를 코드로 옮긴 것 — 아들이 직접 그린 PNG 로 덮어써도 된다"},{id:"brewing_stand",name:"양조기",hardness:.5,tool:null,lightEmit:1,texture:"brewing_stand"},{id:"soul_sand",name:"영혼 모래",hardness:.5,tool:null,lightEmit:0,texture:"soul_sand"},{id:"warped_fungus",name:"뒤틀린 균",hardness:0,tool:null,solid:!1,lightEmit:0,texture:"warped_fungus"},{id:"wool",name:"양털",hardness:.8,tool:null,lightEmit:0,texture:"wool",dyeable:!0,_note:"16색 염색 가능. 텍스처는 wool_<color>"},{id:"flower",name:"꽃",hardness:0,tool:null,solid:!1,lightEmit:0,texture:"flower",variants:["poppy","dandelion","cornflower","allium","tulip_pink","oxeye_daisy"],_note:"부수면 색 염료 3개"},{id:"rail",name:"철도",hardness:.7,tool:null,solid:!1,lightEmit:0,texture:"rail",release:"v1.1"},{id:"mob_spawner",name:"몹 스포너",hardness:5,tool:"pickaxe",drops:null,lightEmit:0,texture:"spawner",release:"v1.1",_note:"캐면 경험치 15–43"},{id:"water_deep",name:"깊은 물",solid:!1,transparent:!0,fluid:"water",lightEmit:0,texture:"water",_note:"심해 — 발광 오징어 서식"},{id:"dried_ghast",name:"마른 가스트",hardness:.5,tool:null,lightEmit:0,texture:"dried_ghast",release:"v1.2",_note:"네더 바닥에 있다. 캐서 물에 불리면 해피 가스트가 된다 (아들 6차). 해피 가스트 탑승은 v1.2"}],Zc={_comment:jc,blocks:Jc},$c="드래곤 목록 — 이 게임의 핵심. 아들이 2026-09-12에 정한 16종. tier = 아들이 줄 세운 순서(1 가장 약함 → 16 가장 셈). recipe = 알을 만드는 데 필요한 재료와 개수(아들이 정한 그대로). targetExpeditions = 이 드래곤을 얻는 데 걸리길 바라는 원정 횟수(아들: 약한 것 1~2, 중간 3~5, 최강 6~8) — 밸런스 조정 기준값. abilities = 드래곤이 하는 일. 모든 드래곤은 안장을 만들면 탈 수 있다. color/texture는 아들이 그림 그린 뒤 채운다. skills = 아들이 정한 고유 스킬(2026-09-12 2차 답변). 공통 기본 공격은 combat.commonSkills. 숫자(damage/stamina/cooldown)는 아빠 임시값.",eu={obtainMethod:"egg",_obtainNote:"재료를 다 모으면 알이 나오고, 알에서 아기 드래곤이 나온다 (아들 답변 2)",growth:{startsAsBaby:!0,feedWithRecipeMaterials:!0,_note:"아기로 태어나고, 만들 때 쓴 재료를 먹이면 더 빨리 자란다 (아들 답변 4). 기본 성장 시간과 먹이당 단축량은 M6에서 정한다",baseGrowMinutes:60,feedShortcutMinutes:10,stages:["baby","adult"],_stageNote:"아기: 작고 둥글게(models/*.baby). 어른: 약 2배 크기, 긴 뿔·척추 가시·이빨 줄·큰 날개·긴 꼬리·빛나는 눈(models/*.adult). 어른이 되면 스킬 위력·기력 최대치 증가(값은 M6에서). 아빠 요청(2026-09-12): '컸을 때는 더 무섭고 크게'",adultMultipliers:{skillDamage:1.5,staminaMax:1.5,hp:2,hitbox:2,_note:"임시값"}},canDie:!0,flees:!1,permanent:!0,_deathNote:"죽을 수는 있지만 도망치지 않고, 얻으면 영원히 내 것 (아들 답변 5). → 구현: 죽으면 사라지지 않고 둥지로 돌아가 회복(원정 1회 동안 출전 불가). 아들 확정(2026-09-13, 결정 #25)",rideRequires:"saddle",rideControls:{_note:"아들 답변 13: 조이스틱으로 이동, 점프 버튼으로 상승, 웅크리기(▼) 버튼으로 하강. 타고 걸을 수도 있지만 몸집이 커서 장애물에 잘 걸린다",up:"jump",down:"sneak",walkable:!0,bigHitbox:!0},hatch:{_note:"알 부화에는 경험치 레벨을 소모한다(마인크래프트 인챈트 방식). 티어별 비용은 data/xp.json hatchLevelCostByTier. 레벨이 모자라면 알은 둥지에 보관된다",costsLevels:!0},completionReward:{_note:"전부 모으면 300 경험치 (아들 답변 15) + '드래곤 마스터' 칭호 + 마을 깃발. 경험치 시스템은 docs/XP-SYSTEM.md (마인크래프트 방식, 2026-09-12 도입 확정)",xp:300,title:"드래곤 마스터"},multiplayer:{_note:"아들 답변 12: 힘 합쳐 재료 모으기, 드래곤 대결, 드래곤 경주 전부. v1은 협동 재료 모으기, 대결·경주는 v1.1",coop:"v1",battle:"v1.1",race:"v1.1"}},tu=[{id:"log",name:"나무 원목",from:["grass_island"],how:"나무 캐기",rarity:1},{id:"sapling",name:"나무 묘목",from:["grass_island"],how:"나뭇잎 부수면 확률 드롭",rarity:1},{id:"leaves",name:"나뭇잎",from:["grass_island"],how:"나뭇잎 캐기(가위 또는 맨손)",rarity:1},{id:"dirt",name:"흙",from:["grass_island"],how:"캐기",rarity:1},{id:"stone",name:"돌",from:["grass_island","cave"],how:"캐기(곡괭이)",rarity:1},{id:"iron_ingot",name:"철",from:["cave","grass_island"],how:"철 광석 캐서 제련",rarity:2},{id:"cake",name:"케이크",from:["craft"],how:"제작: 밀 3 + 설탕 2 + 우유 3 + 달걀 1 (초원 섬 농장·소·닭, 마을 농장)",rarity:2},{id:"gold_ingot",name:"금",from:["cave","desert","nether"],how:"금 광석 캐서 제련, 사막 보물 상자",rarity:2},{id:"diamond",name:"다이아몬드",from:["cave"],how:"동굴 깊은 곳 캐기(철 곡괭이 이상)",rarity:3},{id:"netherite",name:"네더라이트",from:["nether"],how:"네더에만 있음. 고대 잔해 캐기(다이아 곡괭이)",rarity:4},{id:"lava_bucket",name:"용암 양동이",from:["nether","cave"],how:"양동이로 용암 채취",rarity:2},{id:"blaze_rod",name:"블레이즈 막대기",from:["nether"],how:"블레이즈 처치 시 확률 드롭",rarity:3},{id:"ghast_tear",name:"가스트의 눈물",from:["nether","boss:giant_ghast"],how:"가스트를 죽여야만 나옴 / 초거대 가스트 처치 시 3개 확정 (v1.1)",rarity:3},{id:"ice",name:"얼음",from:["snowfield"],how:"눈 바이옴에서 캐기(실크터치 또는 그냥 드롭 허용)",rarity:2},{id:"snow_block",name:"눈 블록",from:["snowfield"],how:"눈 바이옴에서 눈덩이 4개로 제작 또는 캐기",rarity:2},{id:"water_bucket",name:"물 양동이",from:["grass_island","snowfield"],how:"양동이(철 3)로 물 채취",rarity:1},{id:"clock",name:"시계",from:["craft"],how:"제작: 금 4 + 레드스톤 1 (동굴)",rarity:3},{id:"ender_pearl",name:"엔더 진주",from:["grass_island","desert","the_end","boss:enderman_king"],how:"밤에 나오는 엔더맨 처치 시 확률 드롭",rarity:3},{id:"healing_potion",name:"치유의 물약",from:["the_end","craft"],how:"엔드 시티 상자, 또는 양조(네더 와트 + 반짝이는 수박)",rarity:3},{id:"wooden_pickaxe",name:"나무 곡괭이",from:["craft"],how:"제작",rarity:1},{id:"stone_pickaxe",name:"돌 곡괭이",from:["craft"],how:"제작",rarity:1},{id:"iron_pickaxe",name:"철 곡괭이",from:["craft"],how:"제작",rarity:2},{id:"golden_pickaxe",name:"금 곡괭이",from:["craft"],how:"제작",rarity:2},{id:"diamond_pickaxe",name:"다이아몬드 곡괭이",from:["craft"],how:"제작",rarity:3},{id:"netherite_pickaxe",name:"네더라이트 곡괭이",from:["craft"],how:"제작(대장간)",rarity:4},{id:"tnt",name:"TNT",from:["craft"],how:"제작: 화약 5(밤 크리퍼) + 모래 4(사막) / 크리퍼 왕 처치 시 2개 확정 (v1.2)",rarity:3},{id:"wither_skeleton_skull",name:"위더 스켈레톤 머리",from:["nether","boss:skeleton_king"],how:"네더 요새 위더 스켈레톤 처치 시 매우 낮은 확률 / 스켈레톤 왕 처치 시 3개 확정 (v1.2)",rarity:5},{id:"dragon_breath",name:"드래곤의 숨결",from:["the_end"],how:"엔더 드래곤이 바닥에 뿌리는 보라색 먼지 공격(닿으면 HP 감소)을 유리병으로 담는다",rarity:5},{id:"dragon_egg",name:"엔더 드래곤의 알",from:["the_end"],how:"엔더 드래곤을 잡아야만 나옴",rarity:5},{id:"totem_of_undying",name:"불사의 토템",from:["boss:evoker"],how:"소환사 처치. 소지 시 1회 사망 방지 + HP 4 회복 (아들 설명)",rarity:4,_note:"드래곤 재료는 아님 — 생존 아이템"},{id:"spider_crown",name:"거미 왕관",from:["boss:spider_king"],how:"거미 왕 처치. 꾸미기(모자)",rarity:3,_note:"드래곤 재료는 아님"}],nu=JSON.parse(`[{"id":"wood","name":"나무 드래곤","tier":1,"targetExpeditions":[1,2],"recipe":[{"material":"log","count":5},{"material":"sapling","count":1},{"material":"leaves","count":2}],"texture":"dragon_wood","color":"#8B5A2B","skills":[{"id":"plant_tree","name":"나무 세우기","type":"utility","effect":"조준 지점에 나무 1그루 생성","stamina":20,"cooldownSec":8,"signature":true},{"id":"beam","name":"녹색 빔","type":"beam","color":"#4CAF50","power":"약한","powerLevel":1,"stamina":25,"cooldownSec":6}],"ride":true,"model":"models/dragon_wood.json","sketch":"아들 그림 2026-09-12","_recipeNote":"아들 확정(2026-09-19): 나무 묘목 1개 (그림대로). 1차 답변의 2개는 정정"},{"id":"earth","name":"대지 드래곤","tier":2,"targetExpeditions":[1,2],"recipe":[{"material":"dirt","count":2},{"material":"stone","count":2}],"texture":"dragon_earth","color":"#7F7F7F","skills":[{"id":"drop_dirt_stone","name":"흙과 돌 떨어뜨리기","type":"falling_blocks","blocks":["dirt","stone"],"damage":4,"stamina":25,"cooldownSec":6,"signature":true},{"id":"beam","name":"회색 빔","type":"beam","color":"#9E9E9E","power":"약한","powerLevel":1,"stamina":25,"cooldownSec":6}],"ride":true,"model":"models/dragon_earth.json","sketch":"아들 그림 2026-09-12"},{"id":"iron","name":"철 드래곤","tier":3,"targetExpeditions":[1,2],"recipe":[{"material":"iron_ingot","count":2}],"texture":"dragon_iron","color":"#9AA4AD","skills":[{"id":"throw_iron_block","name":"철 블록 날리기","type":"projectile","block":"iron_block","damage":7,"stamina":20,"cooldownSec":4,"signature":true},{"id":"drop_anvil","name":"모루 떨어뜨리기","type":"falling_blocks","blocks":["anvil"],"damage":10,"stamina":30,"cooldownSec":10},{"id":"beam","name":"은색 빔","type":"beam","color":"#CFD8DC","power":"약간 센","powerLevel":2,"stamina":25,"cooldownSec":6}],"ride":true,"model":"models/dragon_iron.json","sketch":"아들 그림 2026-09-12"},{"id":"cake","name":"케이크 드래곤","tier":4,"targetExpeditions":[2,3],"recipe":[{"material":"cake","count":2}],"texture":"dragon_cake","color":null,"skills":[{"id":"throw_cake","name":"케이크 날리기","type":"projectile","block":"cake","damage":3,"stamina":15,"cooldownSec":3},{"id":"heal_cake_beam","name":"힐 케이크 빔","type":"beam","target":"allies","heal":6,"color":"#F8BBD0","stamina":35,"cooldownSec":12,"signature":true,"_note":"주인과 동료들에게 힐"}],"ride":true},{"id":"gold","name":"금 드래곤","tier":5,"targetExpeditions":[3,5],"recipe":[{"material":"gold_ingot","count":2}],"texture":"dragon_gold","color":null,"skills":[{"id":"throw_gold_block","name":"금 블록 날리기","type":"projectile","block":"gold_block","damage":7,"stamina":20,"cooldownSec":4,"signature":true},{"id":"scatter_gold","name":"금 뿌리기","type":"aoe","effect":"주변 적 눈부심 + 금 조각 드롭(장식)","stamina":25,"cooldownSec":10},{"id":"beam","name":"금빛 빔","type":"beam","color":"#FFD54F","power":"약간 센","powerLevel":2,"stamina":25,"cooldownSec":6}],"ride":true},{"id":"diamond","name":"다이아몬드 드래곤","tier":6,"targetExpeditions":[3,5],"recipe":[{"material":"diamond","count":2}],"texture":"dragon_diamond","color":null,"skills":[{"id":"throw_diamond_block","name":"다이아 블록 날리기","type":"projectile","block":"diamond_block","damage":9,"stamina":20,"cooldownSec":4},{"id":"diamond_tornado","name":"다이아 회오리","type":"aoe_spin","effect":"몸을 마구 돌리며 바람을 일으킴. 몸에 닿는 모든 것에 상당한 피해","damage":12,"radius":4,"durationSec":3,"stamina":45,"cooldownSec":15,"signature":true},{"id":"beam","name":"밝은 민트색 빔","type":"beam","color":"#A7FFEB","power":"강력한","powerLevel":3,"stamina":25,"cooldownSec":6}],"ride":true},{"id":"netherite","name":"네더라이트 드래곤","tier":7,"targetExpeditions":[3,5],"recipe":[{"material":"netherite","count":2}],"texture":"dragon_netherite","color":null,"skills":[{"id":"throw_netherite_block","name":"네더라이트 블록 날리기","type":"projectile","block":"netherite_block","damage":12,"stamina":25,"cooldownSec":5},{"id":"netherite_wall","name":"네더라이트 벽 세우기","type":"utility","effect":"전방 5×3 네더라이트 임시 벽 20초","stamina":35,"cooldownSec":20,"signature":true},{"id":"netherite_rain","name":"네더라이트 블록 비","type":"falling_blocks","blocks":["netherite_block"],"damage":14,"radius":6,"stamina":50,"cooldownSec":25},{"id":"beam","name":"아주 진한 보라빛 빔","type":"beam","color":"#4A148C","power":"강력한","powerLevel":3,"stamina":25,"cooldownSec":6}],"ride":true},{"id":"fire","name":"화염 드래곤","tier":8,"targetExpeditions":[3,5],"recipe":[{"material":"lava_bucket","count":1},{"material":"blaze_rod","count":2},{"material":"ghast_tear","count":1}],"_note":"불로 블록을 녹일 수 있다. 베드락·흑요석 제외 (아들 답변 3)","texture":"dragon_fire","color":"#E0562A","skills":[{"id":"breathe_fire","name":"불 뿜기","type":"cone","damage":6,"burnSec":4,"stamina":15,"cooldownSec":2,"signature":true},{"id":"shoot_lava","name":"용암 쏘기","type":"projectile","block":"lava","damage":8,"burnSec":6,"stamina":25,"cooldownSec":6},{"id":"fire_rain","name":"하늘에서 불 떨어지기","type":"aoe_rain","damage":5,"radius":6,"durationSec":5,"stamina":45,"cooldownSec":20},{"id":"fire_aura","name":"몸에 불 두르기","type":"aura","damage":3,"durationSec":10,"stamina":30,"cooldownSec":25},{"id":"melt_blocks","name":"블록 녹이기","type":"utility","except":["bedrock","obsidian"],"stamina":10,"cooldownSec":1}],"ride":true},{"id":"ice","name":"아이스 드래곤","tier":9,"targetExpeditions":[3,5],"recipe":[{"material":"ice","count":2},{"material":"snow_block","count":2}],"_note":"블록을 얼릴 수 있다 (아들 답변 3)","texture":"dragon_ice","color":"#8FD3F4","skills":[{"id":"shoot_ice","name":"얼음 쏘기","type":"projectile","damage":6,"slowSec":3,"stamina":15,"cooldownSec":3,"signature":true},{"id":"freeze_hostiles","name":"나쁜 몹 얼리기","type":"aoe","effect":"반경 안 적대 몹 5초 동결","radius":6,"durationSec":5,"stamina":40,"cooldownSec":18},{"id":"freeze_blocks","name":"블록을 얼음으로","type":"utility","effect":"조준 블록(물·용암 포함)을 얼음으로 변환","stamina":10,"cooldownSec":1}],"ride":true},{"id":"water","name":"워터 드래곤","tier":10,"targetExpeditions":[3,5],"recipe":[{"material":"water_bucket","count":1}],"texture":"dragon_water","color":null,"skills":[{"id":"shoot_water","name":"물 쏘기","type":"projectile","damage":5,"knockback":4,"stamina":15,"cooldownSec":3,"signature":true},{"id":"tsunami","name":"쓰나미","type":"wave","damage":10,"knockback":8,"width":9,"stamina":50,"cooldownSec":25},{"id":"water_tornado","name":"물 회오리 소환","type":"summon_aoe","damage":6,"radius":3,"durationSec":6,"stamina":40,"cooldownSec":20},{"id":"water_breathing","name":"수중호흡 주기","type":"buff","target":"self_owner_allies","durationSec":1200,"stamina":40,"cooldownSec":300,"release":"v1.1","_note":"아들: 워터 드래곤에게 20분간 수중호흡을 받을 수 있다('디버프'라 썼지만 좋은 효과 → 버프)"}],"ride":true},{"id":"time","name":"타임 드래곤","tier":11,"targetExpeditions":[3,5],"recipe":[{"material":"clock","count":4}],"texture":"dragon_time","color":null,"skills":[{"id":"rewind_time","name":"시간 되돌리기","type":"world_rewind","effect":"플레이어들과 이 드래곤을 제외한 모든 것(적·몹·투사체·적이 부순 블록)을 10초 전 상태로 되돌린다. 위치 포함. 원정 타이머는 되돌리지 않는다","stamina":60,"cooldownSec":60,"rewindSec":10,"excludes":["players","self","allyDragons"],"affects":["hostileMobs","bosses","projectiles","enemyBlockChanges"],"timerAffected":false,"_note":"아들 확정(2026-09-12): 플레이어와 자신 제외, 위치 포함, 원정 타이머 제외. 동료 드래곤 제외는 아빠 해석. 플레이어가 놓은 블록은 그대로 둔다(플레이어 제외의 연장)","_serverNote":"서버가 최근 10초 적 상태·적 블록 변경 링버퍼 보관(1초 간격). 발동 시 되감기 후 전원에게 스냅샷 브로드캐스트"},{"id":"stop_time","name":"시간 멈추기","type":"global_freeze","effect":"30초 동안 적 전부 정지. 자신·플레이어·동료는 움직임","durationSec":30,"stamina":80,"cooldownSec":120,"signature":true,"timerAffected":false,"_note":"아들 확정: 원정 타이머는 멈추지 않는다"},{"id":"beam","name":"진한 초록색 빔","type":"beam","color":"#1B5E20","power":"강력한","powerLevel":3,"stamina":25,"cooldownSec":6}],"ride":true},{"id":"teleport","name":"텔레포트 드래곤","tier":12,"targetExpeditions":[6,8],"recipe":[{"material":"ender_pearl","count":2}],"texture":"dragon_teleport","color":null,"skills":[{"id":"teleport_self","name":"텔레포트","type":"utility","range":32,"stamina":20,"cooldownSec":5,"signature":true},{"id":"banish","name":"상대를 다른 곳으로","type":"target_utility","effect":"조준한 적을 무작위 원거리로 이동","range":24,"stamina":35,"cooldownSec":12},{"id":"beam","name":"청녹색 빔","type":"beam","color":"#00897B","power":"강한","powerLevel":3,"stamina":25,"cooldownSec":6}],"ride":true},{"id":"healing","name":"치유 드래곤","tier":13,"targetExpeditions":[6,8],"recipe":[{"material":"healing_potion","count":6}],"texture":"dragon_healing","color":null,"skills":[{"id":"heal_allies","name":"HP 회복","type":"heal","target":"self_owner_allies","heal":8,"radius":8,"stamina":30,"cooldownSec":10,"signature":true},{"id":"shield","name":"뚫리지 않는 방어막","type":"shield","durationSec":10,"radius":5,"stamina":60,"cooldownSec":45},{"id":"beam","name":"붉은색 빔","type":"beam","color":"#C62828","power":"강한","powerLevel":3,"stamina":25,"cooldownSec":6}],"ride":true},{"id":"earthquake","name":"어스퀘이크 드래곤","tier":14,"targetExpeditions":[6,8],"recipe":[{"material":"wooden_pickaxe","count":1},{"material":"stone_pickaxe","count":1},{"material":"iron_pickaxe","count":1},{"material":"golden_pickaxe","count":1},{"material":"diamond_pickaxe","count":1},{"material":"netherite_pickaxe","count":1}],"texture":"dragon_earthquake","color":null,"skills":[{"id":"dig_5x5","name":"주변 지형 5×5 캐기","type":"utility","effect":"조준 지점 중심 5×5×1 채굴, 드롭은 주인 가방으로","stamina":30,"cooldownSec":8,"signature":true,"_serverNote":"서버 블록 변경 검증에서 드래곤 스킬 예외(도달 거리 무시). 보호 구역은 여전히 불가"},{"id":"throw_pickaxes","name":"곡괭이 날리기","type":"projectile_burst","count":6,"damage":4,"stamina":25,"cooldownSec":6},{"id":"beam","name":"갈색 빔","type":"beam","color":"#6D4C41","power":"강한","powerLevel":3,"stamina":25,"cooldownSec":6}],"ride":true},{"id":"explosion","name":"폭발 드래곤","tier":15,"targetExpeditions":[6,8],"recipe":[{"material":"tnt","count":2},{"material":"wither_skeleton_skull","count":3}],"texture":"dragon_explosion","color":null,"skills":[{"id":"self_detonate","name":"자기 몸 폭파","type":"self_aoe","damage":20,"radius":6,"selfHpCost":0.5,"effect":"부서지지 않지만 HP가 절반 깎임","stamina":50,"cooldownSec":30},{"id":"detonate_target","name":"원하는 곳 폭파","type":"target_aoe","damage":15,"radius":4,"range":24,"stamina":35,"cooldownSec":10,"signature":true},{"id":"beam","name":"흰색 빔","type":"beam","color":"#FFFFFF","power":"매우 강력한","powerLevel":4,"stamina":25,"cooldownSec":6}],"ride":true},{"id":"ender","name":"엔더 드래곤","tier":16,"targetExpeditions":[6,8],"recipe":[{"material":"dragon_breath","count":4},{"material":"dragon_egg","count":1}],"texture":"dragon_ender","color":"#1E1B24","skills":[{"id":"beam","name":"가장 강력한 보라·검정 빔","type":"beam","color":"#6A1B9A","power":"가장 강력한","powerLevel":5,"stamina":25,"cooldownSec":6},{"id":"dragon_breath_pool","name":"드래곤의 숨결 뿌리기","type":"ground_aoe","damage":4,"radius":3,"durationSec":8,"stamina":30,"cooldownSec":10,"signature":true},{"id":"purple_energy_balls","name":"하늘에서 보라색 에너지 볼","type":"aoe_rain","damage":8,"radius":6,"durationSec":5,"stamina":45,"cooldownSec":20},{"id":"purple_tornado","name":"보라색 회오리","type":"aoe_spin","damage":10,"radius":5,"durationSec":4,"stamina":45,"cooldownSec":20},{"id":"summon_enderman_army","name":"엔더맨 군대 소환","type":"summon","count":6,"durationSec":30,"friendly":true,"stamina":70,"cooldownSec":60},{"id":"teleport_far","name":"1~60블록 텔레포트","type":"utility","rangeMin":1,"rangeMax":60,"stamina":20,"cooldownSec":4},{"id":"eye_lasers","name":"눈에서 보라색 레이저","type":"beam","color":"#B39DDB","power":"강한","stamina":20,"cooldownSec":5,"powerLevel":3}],"ride":true,"model":"models/dragon_ender.json","_modelNote":"자체 디자인 — 참고 이미지(마인크래프트 엔더 드래곤 모델)는 복제하지 않고, 아들 설계(검정·보라, 티어 16)를 우리 생성기 골격으로 만든 것"}]`),iu={_comment:"드래곤 전투 규칙 — 아들 설계(2026-09-12 스킬 답변). 모든 드래곤 공통 기본 공격 5종 + 드래곤별 고유 스킬. 빔은 색과 세기만 다른 공통 시스템.",commonSkills:[{id:"tail_whip",name:"꼬리치기",type:"melee",damage:3,knockback:2},{id:"bite",name:"깨물기",type:"melee",damage:4},{id:"headbutt",name:"머리 박치기",type:"melee",damage:4,knockback:3},{id:"claw_slam",name:"앞다리·뒷다리 내리치기",type:"melee",damage:5,aoeRadius:2},{id:"body_slam",name:"몸통 박치기",type:"melee",damage:6,knockback:4,selfStagger:!0}],friendlyFire:!1,_friendlyFireNote:"아들이 스킬마다 '자신이나 주인, 동료들은 피해가 없음'을 반복해서 적음 → 전역 규칙으로: 드래곤 스킬은 자신·주인·같은 마을 파티원에게 절대 피해를 주지 않는다. 회오리·쓰나미·낙하물 전부 포함",beamPower:{_comment:"아들이 쓴 세기 표현 → 숫자. 피해 = baseDamagePerPower × powerLevel",약한:1,"약간 센":2,강한:3,강력한:3,"매우 강력한":4,"가장 강력한":5,baseDamagePerPower:4,rangeBlocks:24,durationSec:1.5},stamina:{_comment:"드래곤 기력. 스킬마다 소모, 초당 회복. 폰에서 스킬 버튼 옆 작은 바. 아빠 임시안",max:100,regenPerSec:5},activeSkillSlots:4,_slotsNote:"폰 탑승 UI에 스킬 버튼 최대 4개. 기본 공격(꼬리·깨물기 등)은 탭 공격으로 자동 선택, 버튼을 차지하지 않는다",releasePlan:{v1:"기본 공격 5종 + 빔 + 드래곤별 대표 스킬 1개(signature: true)","v1.1":"나머지 스킬(시간 멈추기·되돌리기, 쓰나미, 엔더맨 군대, 방어막 등 복잡한 것)"}},su={_comment:$c,rules:eu,materials:tu,dragons:nu,combat:iu},ru="원정지 목록. 아들 답변(질문 7·11)의 재료 출처에서 역산해 6곳으로 확정. durationSec = 원정 시간(초). nightStartsAt = 밤 시작 초(0이면 항상 어두움). treasures = 재료가 들어있는 보물 상자 수(아들: 상자엔 재료만 들어있으면 됨). unlockedBy = 여는 포탈 단계. materials = 여기서 나오는 드래곤 재료(dragons.json materials id). nightMobs = 밤에만 나오는 몹. bossOrRareMobs = 특정 재료를 위해 잡아야 하는 몹. 원정지 6곳은 v1, release 필드가 있는 4곳(어두운 숲·정글·깊은 어둠·고대성)은 보스 설계에서 추가된 v1.1/v1.2. boss = 이 원정지의 보스(bosses.json). sonDetails = 아들 3차 디테일(2026-09-12). release가 붙은 것은 v1.1.",ou=60,au=.5,lu=3,cu=[{id:"grass_island",name:"초원 섬",generator:"island",durationSec:600,nightStartsAt:360,treasures:3,unlockedBy:"portal_1",danger:1,materials:["log","sapling","leaves","dirt","stone","iron_ingot","water_bucket","ender_pearl"],animals:["cow","chicken","sheep"],crops:["wheat","sugar_cane","melon"],nightMobs:["zombie","creeper","enderman"],_note:"나무·대지·철·케이크(농장 재료)·워터 드래곤의 재료. 밤 크리퍼(화약→TNT), 엔더맨(엔더 진주 확률)",sonDetails:{details:["물가 사탕수수","호박·수박·감자 밭","동물: 양·소·토끼·닭·돼지","얕은 바다: 오징어(먹물 염료)","심해: 발광 오징어(v1.1)","꽃밭(염료), 양(양털)"],structuresAdd:[{id:"shipwreck",name:"난파선",release:"v1.1",loot:["heart_of_the_sea","chest","furnace"],_note:"해안. 상자와 화로, 바다의 심장 (아들)"}],nightMobsAdd:[{id:"witch",release:"v1.1"}],waterMobs:[{id:"squid",depth:"shallow",release:"v1"},{id:"glow_squid",depth:"deep",release:"v1.1"}]}},{id:"cave",name:"동굴",generator:"cave",durationSec:600,nightStartsAt:0,treasures:4,unlockedBy:"portal_2",danger:2,materials:["stone","iron_ingot","gold_ingot","diamond","redstone","lava_bucket"],nightMobs:["zombie","skeleton","spider"],depthBonus:{diamond:"y < 16",redstone:"y < 32"},_note:"철·금·다이아·시계(레드스톤) 재료. 깊을수록 다이아",boss:{id:"spider_king",structure:"spider_king_den",spawnChance:.35,_note:"거미 왕의 굴 — 35% 확률로 생성. v1"},sonDetails:{details:["폐광: 몹 스포너(좀비·스켈레톤·거미 계속 생성), 스포너 캐면 경험치 15–43 (v1.1)"],structuresAdd:[{id:"abandoned_mineshaft",name:"폐광",release:"v1.1",hasSpawner:!0,loot:["rail","minecart","iron_ingot","gold_ingot","lapis"]}]}},{id:"desert",name:"사막",generator:"desert",durationSec:600,nightStartsAt:360,treasures:4,unlockedBy:"portal_2",danger:2,materials:["sand","gold_ingot","ender_pearl"],nightMobs:["husk","creeper","enderman"],structures:["desert_pyramid"],_note:"TNT용 모래, 피라미드 상자 금, 밤 엔더맨",sonDetails:{details:["작은 사막 마을","선인장"],structuresAdd:[{id:"desert_village_small",name:"작은 사막 마을",release:"v1"}]}},{id:"snowfield",name:"설원",generator:"snow",durationSec:600,nightStartsAt:300,treasures:3,unlockedBy:"portal_3",danger:3,materials:["ice","snow_block","water_bucket"],nightMobs:["stray","zombie"],_note:"아이스 드래곤 재료. 눈 바이옴에 가야만 있음 (아들 답변 7)",sonDetails:{details:["눈 골렘(v1)","높은 눈 산의 염소(v1.1)"],mobsAdd:[{id:"snow_golem",release:"v1"},{id:"goat",release:"v1.1",where:"high_snow_mountain"}]}},{id:"nether",name:"네더",generator:"nether",durationSec:600,nightStartsAt:0,treasures:3,unlockedBy:"portal_4",danger:4,materials:["lava_bucket","blaze_rod","ghast_tear","netherite","gold_ingot","wither_skeleton_skull","nether_wart"],bossOrRareMobs:[{mob:"ghast",drops:"ghast_tear",chance:1,_note:"가스트를 죽여야만 나옴"},{mob:"blaze",drops:"blaze_rod",chance:.5,_note:"확률 드롭"},{mob:"wither_skeleton",drops:"wither_skeleton_skull",chance:.05,_note:"매우 낮은 확률 (아들 답변 11)"}],structures:["nether_fortress","bastion"],groundBlocks:["dried_ghast"],_note:"화염·네더라이트·폭발 드래곤 재료. 네더라이트는 네더에만",_note6:"아들 6차(2026-09-13): 피글린 요새(bastion)에 상자가 많고 잡다한 것이 들어 있다(v1.1). 바닥에 마른 가스트가 있어 캐서 물에 불리면 해피 가스트(v1.2). 피글린 vs 좀비 피글린 전쟁은 mobs.json",boss:{id:"giant_ghast",structure:"giant_nether_fortress",spawnChance:.3,release:"v1.1"},sonDetails:{details:["용암 위 스트라이더 — 안장 + 뒤틀린 균 낚싯대로 탑승(v1.1)","침대 설치 후 클릭 → 폭발(v1)","석영 광석, 고대 잔해"],mobsAdd:[{id:"strider",release:"v1.1",rideable:!0}],rules:["bed_explodes"]}},{id:"the_end",name:"엔드",generator:"end",durationSec:900,nightStartsAt:0,treasures:2,unlockedBy:"portal_5",danger:5,materials:["dragon_breath","dragon_egg","healing_potion","ender_pearl"],bossOrRareMobs:[{mob:"ender_dragon",drops:"dragon_egg",chance:1,_note:"엔더 드래곤을 잡아야만 나옴"},{mob:"ender_dragon",drops:"dragon_breath",chance:null,_note:"드래곤이 바닥에 뿌리는 보라색 먼지 공격을 유리병으로 담는다 — 처치 없이도 채집 가능"},{mob:"enderman",drops:"ender_pearl",chance:.5}],structures:["end_city"],_note:"마지막 원정. 15분. 엔드 시티 상자에 치유의 물약. 엔더 드래곤 전투는 협동 전제(6명)",boss:{id:"ender_dragon",structure:"end_island",spawnChance:1,_note:"항상 있음. 협동 최종 보스. v1"},sonDetails:{details:["엔드 시티: 공중에 떠 있음. 입구 양조기(치유의 물약), 내부 상자 2 + 가운데 셜커 + 그 위 겉날개","셜커 공격 → 부양 디버프, 떨어지면 낙하 피해(v1.1)","침대 폭발(v1)"],mobsAdd:[{id:"shulker",release:"v1.1",effect:"levitation"}],lootAdd:[{id:"elytra",release:"v1.1"}],rules:["bed_explodes"]}},{id:"dark_forest",name:"어두운 숲",generator:"dark_forest",durationSec:600,nightStartsAt:240,treasures:3,unlockedBy:"portal_3",danger:3,materials:["log","emerald","totem_of_undying"],structures:["woodland_mansion"],boss:{id:"evoker",structure:"woodland_mansion",spawnChance:1},release:"v1.1",_note:"삼림 대저택 — 소환사의 본거지 (아들 보스 설계)",sonDetails:{}},{id:"jungle",name:"정글",generator:"jungle",durationSec:600,nightStartsAt:360,treasures:4,unlockedBy:"portal_3",danger:3,materials:["gold_ingot","emerald","banana","melon"],structures:["jungle_palace"],boss:{id:"giant_gorilla",structure:"jungle_palace",spawnChance:1},release:"v1.2",_note:"사치스러운 정글 궁궐 — 거대 고릴라 (아들 보스 설계)",sonDetails:{}},{id:"deep_dark",name:"깊은 어둠",generator:"deep_dark",durationSec:600,nightStartsAt:0,treasures:3,unlockedBy:"portal_4",danger:4,materials:["echo_shard","sculk","diamond"],structures:["ancient_city"],boss:{id:"giant_warden",structure:"ancient_city",spawnChance:1},release:"v1.2",_note:"고대 도시 — 거대 워든 (아들 보스 설계)",sonDetails:{}},{id:"ancient_castle",name:"고대성",generator:"ancient_castle",durationSec:900,nightStartsAt:0,treasures:0,unlockedBy:"portal_6",danger:6,materials:["wither_skeleton_skull","gunpowder","ender_pearl"],structures:["ancient_castle"],boss:{id:"four_kings",structure:"ancient_castle",spawnChance:1},release:"v1.2",_note:"네 왕의 성 — 첫 번째 왕들의 머리가 걸려 있다. 엔딩 원정. 15분. 포탈 6단계(엔드 이후)",sonDetails:{}}],uu={_comment:ru,returnGraceSec:ou,failedReturnKeepRatio:au,minStartMarginMin:lu,expeditions:cu},du="채팅은 여기 있는 것만 보낼 수 있다. 자유 입력 없음. 아들이 2026-09-12에 고른 문구 20개와 이모지 13개(12개 요청했는데 13개를 골라서 그대로 둠 — 아빠가 하나 빼도 됨).",hu=["🥰","😄","😛","🤩","🥳","🤬","🤯","😣","😭","😱","😢","❤️","🥇"],fu=[{id:1,text:"돌아가자"},{id:2,text:"나이스"},{id:3,text:"계속 가자"},{id:4,text:"찾았다"},{id:5,text:"공격!"},{id:6,text:"후퇴하자"},{id:7,text:"방어하자"},{id:8,text:"잘했어!"},{id:9,text:"좋았어!"},{id:10,text:"조심해"},{id:11,text:"일단 숨자"},{id:12,text:"미안해"},{id:13,text:"ㅋㅋㅋ"},{id:14,text:"기습공격!"},{id:15,text:"흩어지자"},{id:16,text:"다시 모이자"},{id:17,text:"뭐지"},{id:18,text:"으악!"},{id:19,text:"헉…!"},{id:20,text:"이게무슨???"}],pu={_comment:du,emojis:hu,phrases:fu},mu="물약 양조 (마인크래프트 1.21 규칙, 아들 8차 디테일 2026-09-18). 양조기(brewing_stand)에서 만든다. 순서: 유리병에 물 → 물병(water_bottle) → 네더 사마귀 → 어색한 물약(awkward, 효과 없음) → 재료 하나 → 물약. from = 무엇에 재료를 넣나(water_bottle / awkward / 다른 물약 id). corruptsTo = 발효된 거미 눈을 넣으면 바뀌는 물약. seconds = 마시면 몇 초 가는지(0 = 즉시 한 번). 레드스톤은 시간 ×8/3, 발광석은 단계 +1 이고 시간 반, 화약은 던지는 물약, 던지는 물약 + 드래곤의 숨결 = 바닥에 남는 잔류형(시간 1/4). 이 배율은 코드(shared/rules/potions.ts)가 정한다. canExtend / canAmplify 가 false 면 그 보조 재료는 안 먹힌다. release 없는 것은 v1 — 양조 자체는 M4, 체력이 필요한 효과(치유·고통·독·재생·화염 저항·힘·나약함)는 체력이 생기는 M7 부터 실제로 듣는다. 개수·초는 아빠 임시값, 아들이 바꿔도 됨.",gu={water_bottle:{name:"물병",_note:"유리병(glass_bottle)을 물에 대면 물병. 레시피는 recipes.json water_bottle"},awkward:{name:"어색한 물약",from:"water_bottle",ingredient:"nether_wart",_note:"효과 없음. 모든 물약의 시작"}},_u={_comment:"물약에 넣는 보조 재료. 아들이 고칠 건 name 정도. 무엇을 하는지는 코드가 정한다.",redstone:{name:"레드스톤 가루",does:"extend",_note:"지속 시간 늘리기 (3분 → 8분)"},glowstone_dust:{name:"발광석 가루",does:"amplify",_note:"단계 올리기 (I → II), 시간은 반으로"},gunpowder:{name:"화약",does:"splash",_note:"던지는(투척용) 물약"},dragon_breath:{name:"드래곤의 숨결",does:"lingering",_note:"던지는 물약에 넣으면 바닥에 구름이 남는 잔류형. 엔더 드래곤 재료와 같은 아이템"},fermented_spider_eye:{name:"발효된 거미 눈",does:"corrupt",_note:"물약을 반대로 뒤집는다 (corruptsTo). 물병에 바로 넣으면 나약함"}},vu={fuel:"blaze_powder",brewsPerFuel:20,bottles:3,brewSeconds:20,_note:"아빠 9차: 양조기 = 블레이즈 막대기 1 + 조약돌 3 (recipes.json brewing_stand). 왼쪽 연료 칸에 블레이즈 가루(막대기 1 → 가루 2), 가루 1개로 20번. 아래 병 자리 3개에 물병을 놓고 위에 재료 하나 → 세 병이 함께 바뀐다. 한 번 20초"},Au=[{id:"speed",name:"신속의 물약",from:"awkward",ingredient:"sugar",effect:"speed",seconds:180,corruptsTo:"slowness",_note:"더 빨리 달린다. 설탕은 사탕수수"},{id:"slowness",name:"감속의 물약",from:"speed",ingredient:"fermented_spider_eye",effect:"slowness",seconds:90,_note:"신속 또는 도약의 물약에 발효된 거미 눈. 던져서 상대를 느리게. (가이드의 '어색한 물약 + 거미 눈 + 발효된 거미 눈'은 마인크래프트에 없는 조합이라 뺐다)"},{id:"leaping",name:"도약의 물약",from:"awkward",ingredient:"rabbit_foot",effect:"jump_boost",seconds:180,corruptsTo:"slowness",_note:"더 높이 뛴다. 토끼발은 초원 섬 토끼"},{id:"strength",name:"힘의 물약",from:"awkward",ingredient:"blaze_powder",effect:"strength",seconds:180,_note:"공격이 세진다. 블레이즈 가루는 블레이즈 막대기를 가방에서 부순 것"},{id:"healing",name:"치유의 물약",from:"awkward",ingredient:"glistering_melon",effect:"instant_health",seconds:0,canExtend:!1,corruptsTo:"harming",_note:"마시면 바로 체력 회복. 치유 드래곤 재료 6개(dragons.json). 엔드 시티 상자·양조기에서도 나옴. 반짝이는 수박 = 수박 조각 + 금 조각 8 (recipes.json)"},{id:"harming",name:"고통의 물약",from:"healing",ingredient:"fermented_spider_eye",effect:"instant_damage",seconds:0,canExtend:!1,_note:"치유 또는 독의 물약에 발효된 거미 눈. 던져서 상대에게 피해. 친구에게 던지면? → 아들에게 질문"},{id:"poison",name:"독 물약",from:"awkward",ingredient:"spider_eye",effect:"poison",seconds:45,corruptsTo:"harming",_note:"천천히 체력이 깎인다(1칸 남기고 멈춤). 거미 눈은 동굴 거미"},{id:"regeneration",name:"재생의 물약",from:"awkward",ingredient:"ghast_tear",effect:"regeneration",seconds:45,_note:"천천히 체력이 찬다. 가스트의 눈물은 네더 가스트 (화염 드래곤 재료와 같은 아이템)"},{id:"fire_resistance",name:"화염 저항의 물약",from:"awkward",ingredient:"magma_cream",effect:"fire_resistance",seconds:180,canAmplify:!1,_note:"불·용암에 안 다친다. 네더 원정 필수. 마그마 크림 = 슬라임 볼 + 블레이즈 가루 (recipes.json). 피글린 거래에서도 나옴(아들 6차)"},{id:"water_breathing",name:"수중 호흡의 물약",from:"awkward",ingredient:"pufferfish",effect:"water_breathing",seconds:180,canAmplify:!1,_note:"물속에서 숨을 쉰다. 워터 드래곤 능력과 같음. 복어는 초원 섬 바다 낚시"},{id:"night_vision",name:"야간 투시의 물약",from:"awkward",ingredient:"golden_carrot",effect:"night_vision",seconds:180,canAmplify:!1,corruptsTo:"invisibility",_note:"밤·동굴이 환하게 보인다. 황금 당근 = 당근 + 금 8 (아들 7차)"},{id:"invisibility",name:"투명화 물약",from:"night_vision",ingredient:"fermented_spider_eye",effect:"invisibility",seconds:180,canAmplify:!1,_note:"다른 플레이어·몹에게 안 보인다(들고 있는 것·갑옷은 보임). 친구들에게 안 보이는 건 서버가 처리",release:"v1.1"},{id:"turtle_master",name:"거북 도사의 물약",from:"awkward",ingredient:"turtle_shell",effect:"turtle_master",seconds:20,_note:"느려지지만(감속 IV) 튼튼해진다(저항 III). 거북 등딱지 = 인갑 5개. 거북이가 아직 게임에 없다 → 거북이(mobs.json)와 함께",release:"v1.1"},{id:"slow_falling",name:"느린 낙하의 물약",from:"awkward",ingredient:"phantom_membrane",effect:"slow_falling",seconds:90,canAmplify:!1,_note:"천천히 떨어지고 낙하 피해 없음. 팬텀 막대는 팬텀(3일 못 자면 밤에 나옴). 팬텀이 아직 게임에 없다 → 팬텀(mobs.json)과 함께",release:"v1.1"},{id:"wind_charged",name:"돌풍의 물약",from:"awkward",ingredient:"breeze_rod",effect:"wind_charged",seconds:180,_note:"1.21 새 물약. 맞은 몹이 죽으면 돌풍이 터져 주변을 밀어낸다. 브리즈 막대기는 시련의 방 브리즈 → 시련의 방 구조물이 생길 때",release:"v2"},{id:"weaving",name:"방직의 물약",from:"awkward",ingredient:"cobweb",effect:"weaving",seconds:180,_note:"1.21 새 물약. 맞은 몹이 죽으면 거미줄이 생기고, 거미줄 안에서 빨리 움직인다. 거미줄은 폐광·거미 왕 굴",release:"v2"},{id:"oozing",name:"장역화 물약",from:"awkward",ingredient:"slime_block",effect:"oozing",seconds:180,_note:"1.21 새 물약. 맞은 몹이 죽으면 슬라임 2마리가 나온다. 슬라임 블록 = 슬라임 볼 9",release:"v2"},{id:"infested",name:"벌레 먹음의 물약",from:"awkward",ingredient:"stone",effect:"infested",seconds:180,_note:"1.21 새 물약. 맞은 몹이 다치면 좀벌레가 튀어나온다. 재료가 그냥 돌이라 가장 싼 물약",release:"v2"},{id:"weakness",name:"나약함의 물약",from:"water_bottle",ingredient:"fermented_spider_eye",effect:"weakness",seconds:90,canAmplify:!1,_note:"어색한 물약을 거치지 않고 물병에 바로. 공격이 약해진다. 좀비 주민 치료 = 나약함 + 황금 사과 (아들 7차와 이어짐)"}],xu={_comment:"재료 어디서 얻나 (아들 참고용, 코드는 안 읽음). '아직 없음' = 그 몹·구조물이 게임에 들어올 때 같이",nether_wart:{name:"네더 사마귀",source:"네더 요새 (영혼 모래에서 자람)"},sugar:{name:"설탕",source:"사탕수수 1 → 설탕 2 (recipes.json)"},rabbit_foot:{name:"토끼발",source:"초원 섬 토끼 (드물게)"},blaze_powder:{name:"블레이즈 가루",source:"블레이즈 막대기 1 → 가루 2 (recipes.json)"},glistering_melon:{name:"반짝이는 수박 조각",source:"수박 조각 + 금 조각 8 (recipes.json). 가이드에 있던 '수박 조각 + 발광석 가루'는 마인크래프트에 없는 식이라 뺐다"},spider_eye:{name:"거미 눈",source:"동굴 거미 (mobs.json)"},fermented_spider_eye:{name:"발효된 거미 눈",source:"거미 눈 + 설탕 + 갈색 버섯 (recipes.json)"},ghast_tear:{name:"가스트의 눈물",source:"네더 가스트"},magma_cream:{name:"마그마 크림",source:"슬라임 볼 + 블레이즈 가루 (recipes.json), 또는 네더 마그마 큐브 (아직 없음)"},pufferfish:{name:"복어",source:"바다 낚시 (초원 섬)"},golden_carrot:{name:"황금 당근",source:"당근 + 금 8 (recipes.json)"},turtle_shell:{name:"거북 등딱지",source:"인갑 5 (아기 거북이가 자라며 떨어뜨림) — 거북이 아직 없음"},phantom_membrane:{name:"팬텀 막대",source:"팬텀 — 아직 없음"},breeze_rod:{name:"브리즈 막대기",source:"시련의 방 브리즈 — 아직 없음"},cobweb:{name:"거미줄",source:"폐광·거미 왕 굴 (칼로 캔다)"},slime_block:{name:"슬라임 블록",source:"슬라임 볼 9 — 슬라임 아직 없음"},stone:{name:"돌",source:"어디든 (blocks.json)"},redstone:{name:"레드스톤 가루",source:"레드스톤 광석 (blocks.json)"},glowstone_dust:{name:"발광석 가루",source:"발광석 블록 1 → 가루 2~4 (네더 천장)"},gunpowder:{name:"화약",source:"크리퍼·가스트·마녀"},dragon_breath:{name:"드래곤의 숨결",source:"엔더 드래곤 숨결 바닥을 유리병으로 (bosses.json)"}},yl={_comment:mu,base:gu,modifiers:_u,stand:vu,potions:Au,ingredients:xu},Eu="제작 레시피. 드래곤 재료 중 '제작'으로 얻는 것들과 안장·도구. station = 어디서 만드나(inventory 가방 안 2×2 칸 / crafting_table 제작대 3×3 / forge 대장간 / brewing 양조기 / furnace 화로). 개수는 아빠 임시값, 아들이 바꿔도 됨. 아들 3차 디테일(2026-09-12)의 제작 사슬(종이→책→책장→인챈트 테이블)과 도구·장식 레시피 추가. 6차(2026-09-13): 가방 2×2 칸 레시피(판자·제작대·양털·염료·염색). release 없는 것은 v1. 8차(2026-09-18): 양조 물약은 data/potions.json 으로 옮겼다(양조 규칙이 따로 있어서). 여기에는 양조기와 물약 재료 만드는 법만 — water_bottle·brewing_stand·blaze_powder·fermented_spider_eye·glistering_melon·gold_nugget·magma_cream·turtle_shell(v1.1)·slime_block(v2).",Su=JSON.parse(`[{"id":"saddle","name":"안장","station":"crafting_table","in":{"leather":5,"iron_ingot":2},"out":{"saddle":1},"_note":"안장을 만들면 드래곤을 탈 수 있다 (아들 답변 3). 가죽은 초원 섬 소"},{"id":"bucket","name":"양동이","station":"crafting_table","in":{"iron_ingot":3},"out":{"bucket":1}},{"id":"glass_bottle","name":"유리병","station":"crafting_table","in":{"glass":3},"out":{"glass_bottle":3},"_note":"드래곤의 숨결을 담는다"},{"id":"cake","name":"케이크","station":"crafting_table","in":{"wheat":3,"sugar":2,"milk_bucket":3,"egg":1},"out":{"cake":1}},{"id":"sugar","name":"설탕","station":"inventory","in":{"sugar_cane":1},"out":{"sugar":2},"_note":"아들 7차: 사탕수수 1개당 설탕 2개. 사탕수수는 물가에서 자란다"},{"id":"golden_apple","name":"황금 사과","station":"crafting_table","in":{"apple":1,"gold_ingot":8},"out":{"golden_apple":1},"_note":"아들 7차: 사과 주위로 금 8개를 두른다. 좀비 주민을 되돌린다"},{"id":"golden_carrot","name":"황금 당근","station":"crafting_table","in":{"carrot":1,"gold_ingot":8},"out":{"golden_carrot":1},"_note":"아들 7차: 당근 주위로 금 8개"},{"id":"clock","name":"시계","station":"crafting_table","in":{"gold_ingot":4,"redstone":1},"out":{"clock":1}},{"id":"tnt","name":"TNT","station":"crafting_table","in":{"gunpowder":5,"sand":4},"out":{"tnt":1}},{"id":"snow_block","name":"눈 블록","station":"crafting_table","in":{"snowball":4},"out":{"snow_block":1}},{"id":"iron_ingot","name":"철","station":"furnace","in":{"iron_ore":1,"coal":1},"out":{"iron_ingot":1}},{"id":"gold_ingot","name":"금","station":"furnace","in":{"gold_ore":1,"coal":1},"out":{"gold_ingot":1}},{"id":"netherite","name":"네더라이트","station":"forge","in":{"ancient_debris":4,"gold_ingot":4},"out":{"netherite":1}},{"id":"wooden_pickaxe","name":"나무 곡괭이","station":"crafting_table","in":{"planks":3,"stick":2},"out":{"wooden_pickaxe":1},"toolTier":0},{"id":"stone_pickaxe","name":"돌 곡괭이","station":"crafting_table","in":{"cobblestone":3,"stick":2},"out":{"stone_pickaxe":1},"toolTier":1},{"id":"iron_pickaxe","name":"철 곡괭이","station":"forge","in":{"iron_ingot":3,"stick":2},"out":{"iron_pickaxe":1},"toolTier":2},{"id":"golden_pickaxe","name":"금 곡괭이","station":"forge","in":{"gold_ingot":3,"stick":2},"out":{"golden_pickaxe":1},"toolTier":1},{"id":"diamond_pickaxe","name":"다이아몬드 곡괭이","station":"forge","in":{"diamond":3,"stick":2},"out":{"diamond_pickaxe":1},"toolTier":3},{"id":"netherite_pickaxe","name":"네더라이트 곡괭이","station":"forge","in":{"diamond_pickaxe":1,"netherite":1},"out":{"netherite_pickaxe":1},"toolTier":4},{"id":"planks","name":"판자","station":"inventory","in":{"log":1},"out":{"planks":4},"_note":"아들 6차: 가방 오른쪽 2×2 칸에 원목을 두면 판자 4개"},{"id":"crafting_table","name":"제작대","station":"inventory","in":{"planks":4},"out":{"crafting_table":1},"_note":"아들 6차: 판자 4개로 제작대 1개. 제작대는 9칸(3×3)이라 여러 가지를 만들 수 있다"},{"id":"stick","name":"막대기","station":"crafting_table","in":{"planks":2},"out":{"stick":4}},{"id":"paper","name":"종이","station":"crafting_table","in":{"sugar_cane":3},"out":{"paper":3},"_note":"아들: 사탕수수 3개 → 종이"},{"id":"book","name":"책","station":"crafting_table","in":{"leather":1,"paper":3},"out":{"book":1}},{"id":"writable_book","name":"깃펜과 책","station":"crafting_table","in":{"book":1,"feather":1},"out":{"writable_book":1},"release":"v1.1","_note":"적을 수 있게 됨. 자유 채팅 없음 규칙과 충돌 → 개인 일기(남에게 안 보임) 또는 정해진 문구만. 아빠 결정"},{"id":"bookshelf","name":"책장","station":"crafting_table","in":{"planks":6,"book":3},"out":{"bookshelf":1}},{"id":"enchanting_table","name":"인챈트 테이블","station":"crafting_table","in":{"obsidian":4,"diamond":2,"book":1},"out":{"enchanting_table":1},"release":"v1.1","_note":"책장 15개를 주위 1칸 띄워 두면 최고 30레벨 인챈트 (아들). 경험치 소비처 2번"},{"id":"obsidian_from_lava","name":"흑요석 만들기","station":"world","in":{"water_bucket":1,"lava_source_block":1},"out":{"obsidian":1},"_note":"용암 블록에 물을 부으면 흑요석. 유체 흐름 없이 규칙 하나로"},{"id":"oak_stairs","name":"계단","station":"crafting_table","in":{"planks":6},"out":{"oak_stairs":4}},{"id":"oak_door","name":"문","station":"crafting_table","in":{"planks":6},"out":{"oak_door":3},"_note":"아빠 9차 확인: 판자 6개 → 문 3개 (마인크래프트와 같음)"},{"id":"oak_trapdoor","name":"다락문","station":"crafting_table","in":{"planks":6},"out":{"oak_trapdoor":2}},{"id":"oak_fence","name":"울타리","station":"crafting_table","in":{"planks":4,"stick":2},"out":{"oak_fence":3}},{"id":"sign","name":"표지판","station":"crafting_table","in":{"planks":6,"stick":1},"out":{"sign":3}},{"id":"glass","name":"유리","station":"furnace","in":{"sand":1,"coal":1},"out":{"glass":1}},{"id":"bed","name":"침대","station":"crafting_table","in":{"wool":3,"planks":3},"out":{"bed":1}},{"id":"torch","name":"횃불","station":"crafting_table","in":{"coal":1,"stick":1},"out":{"torch":4}},{"id":"chest","name":"상자","station":"crafting_table","in":{"planks":8},"out":{"chest":1}},{"id":"furnace","name":"화로","station":"crafting_table","in":{"cobblestone":8},"out":{"furnace":1}},{"id":"bow","name":"활","station":"crafting_table","in":{"stick":3,"string":3},"out":{"bow":1}},{"id":"arrow","name":"화살","station":"crafting_table","in":{"flint":1,"stick":1,"feather":1},"out":{"arrow":4}},{"id":"iron_sword","name":"철 칼","station":"forge","in":{"iron_ingot":2,"stick":1},"out":{"iron_sword":1}},{"id":"iron_chestplate","name":"철 흉갑","station":"forge","in":{"iron_ingot":8},"out":{"iron_chestplate":1}},{"id":"iron_axe","name":"철 도끼","station":"forge","in":{"iron_ingot":3,"stick":2},"out":{"iron_axe":1}},{"id":"iron_hoe","name":"철 괭이","station":"forge","in":{"iron_ingot":2,"stick":2},"out":{"iron_hoe":1}},{"id":"iron_shovel","name":"철 삽","station":"forge","in":{"iron_ingot":1,"stick":2},"out":{"iron_shovel":1}},{"id":"flint_and_steel","name":"라이터","station":"crafting_table","in":{"iron_ingot":1,"flint":1},"out":{"flint_and_steel":1}},{"id":"fishing_rod","name":"낚싯대","station":"crafting_table","in":{"stick":3,"string":2},"out":{"fishing_rod":1}},{"id":"compass","name":"나침반","station":"crafting_table","in":{"iron_ingot":4,"redstone":1},"out":{"compass":1},"_note":"마을 포탈 방향을 가리킨다 — 원정 귀환에 유용"},{"id":"shears","name":"가위","station":"crafting_table","in":{"iron_ingot":2},"out":{"shears":1}},{"id":"carved_pumpkin","name":"조각된 호박","station":"world","in":{"pumpkin":1,"shears":1},"out":{"carved_pumpkin":1,"pumpkin_seeds":4}},{"id":"jack_o_lantern","name":"잭오랜턴","station":"crafting_table","in":{"carved_pumpkin":1,"torch":1},"out":{"jack_o_lantern":1}},{"id":"iron_block","name":"철 블록","station":"crafting_table","in":{"iron_ingot":9},"out":{"iron_block":1}},{"id":"gold_block","name":"금 블록","station":"crafting_table","in":{"gold_ingot":9},"out":{"gold_block":1}},{"id":"quartz_block","name":"석영 블록","station":"crafting_table","in":{"quartz":4},"out":{"quartz_block":1}},{"id":"netherite_block","name":"네더라이트 블록","station":"forge","in":{"netherite":9},"out":{"netherite_block":1}},{"id":"emerald_block","name":"에메랄드 블록","station":"crafting_table","in":{"emerald":9},"out":{"emerald_block":1}},{"id":"diamond_block","name":"다이아몬드 블록","station":"crafting_table","in":{"diamond":9},"out":{"diamond_block":1}},{"id":"hay_bale","name":"건초 더미","station":"crafting_table","in":{"wheat":9},"out":{"hay_bale":1}},{"id":"carrot_on_a_stick","name":"당근 낚싯대","station":"crafting_table","in":{"fishing_rod":1,"carrot":1},"out":{"carrot_on_a_stick":1},"release":"v1.1","_note":"돼지 타기"},{"id":"warped_fungus_on_a_stick","name":"뒤틀린 균 낚싯대","station":"crafting_table","in":{"fishing_rod":1,"warped_fungus":1},"out":{"warped_fungus_on_a_stick":1},"release":"v1.1","_note":"스트라이더 타기"},{"id":"firework","name":"폭죽","station":"crafting_table","in":{"paper":1,"gunpowder":1},"out":{"firework":3},"release":"v1.1","_note":"겉날개 추진"},{"id":"name_tag","name":"이름표","station":"anvil","in":{"name_tag_blank":1},"out":{"name_tag":1},"release":"v2","_note":"드래곤·동물에 이름 붙이기. 자유 입력이라 닉네임 필터 필요"},{"id":"redstone_dust","name":"레드스톤 가루","station":"world","in":{"redstone_ore":1},"out":{"redstone":4},"_note":"회로는 없음(결정 7). 시계·나침반 재료로만"},{"id":"wool_from_string","name":"양털 (거미줄)","station":"inventory","in":{"string":4},"out":{"wool":1},"_note":"아들: 거미줄(실) 4개 = 양털 1개. 6차: 가방 2×2 칸에서"},{"id":"dye_from_flower","name":"염료","station":"inventory","in":{"flower":1},"out":{"dye":3},"_note":"가방 2×2 칸에 꽃을 두면 꽃 색깔에 맞는 염료 3개 (아들 6차). 4차에선 '꽃을 부수면'이었는데 6차 방식으로"},{"id":"dye_wool","name":"양털 물들이기","station":"inventory","in":{"white_wool":1,"dye":1},"out":{"colored_wool":1},"_note":"흰 양털만 염색할 수 있다. 흰 양털 1 + 원하는 염료 1 → 그 색 양털 1 (아들 6차). 침대·깃발 색"},{"id":"ink_dye","name":"검은 염료 (먹물)","station":"crafting_table","in":{"ink_sac":1},"out":{"black_dye":1}},{"id":"shield","name":"방패","station":"crafting_table","in":{"planks":6,"iron_ingot":1},"out":{"shield":1},"_note":"막기 — 폰에서는 웅크리기 길게 누르기"},{"id":"boat","name":"보트","station":"crafting_table","in":{"planks":5},"out":{"boat":1},"release":"v1.1","_note":"몹을 태울 수 있음 (아들). 강·바다"},{"id":"minecart","name":"수레","station":"forge","in":{"iron_ingot":5},"out":{"minecart":1},"release":"v1.1"},{"id":"rail","name":"철도","station":"forge","in":{"iron_ingot":6,"stick":1},"out":{"rail":16},"release":"v1.1","_note":"수레+철도 이동. 마을 안 순환선 아이디어"},{"id":"spear","name":"창","station":"forge","in":{"iron_ingot":1,"stick":2},"out":{"spear":1},"_note":"아들: 창이 있다. 칼보다 사거리 길고 느림. 던지기 가능 여부는 아들에게"},{"id":"water_bottle","name":"물병","station":"world","in":{"glass_bottle":1,"water_source_block":1},"out":{"water_bottle":1},"_note":"유리병을 들고 물을 누르면 물병. 물은 없어지지 않음. 양조의 시작 (potions.json)"},{"id":"brewing_stand","name":"양조기","station":"crafting_table","in":{"blaze_rod":1,"cobblestone":3},"out":{"brewing_stand":1},"_note":"아빠 9차: 제작대 가운데 줄에 블레이즈 막대기 1, 그 아래 줄에 조약돌 3 (흑암·조잡한 심층암 같은 돌 계열도 됨). 연료는 블레이즈 가루, 병 자리 3개 — potions.json stand. 엔드 시티 입구에도 있음(아들 3차)"},{"id":"blaze_powder","name":"블레이즈 가루","station":"inventory","in":{"blaze_rod":1},"out":{"blaze_powder":2},"_note":"양조기 연료이자 힘의 물약 재료. 블레이즈 막대기는 네더 블레이즈 (화염 드래곤 재료와 같은 아이템)"},{"id":"fermented_spider_eye","name":"발효된 거미 눈","station":"crafting_table","in":{"spider_eye":1,"sugar":1,"brown_mushroom":1},"out":{"fermented_spider_eye":1},"_note":"물약을 반대로 뒤집는 재료 (신속→감속, 치유→고통, 야간 투시→투명화, 물병→나약함)"},{"id":"glistering_melon","name":"반짝이는 수박 조각","station":"crafting_table","in":{"melon_slice":1,"gold_nugget":8},"out":{"glistering_melon":1},"_note":"치유의 물약 재료. 수박 조각 주위로 금 조각 8개. (가이드의 \\"수박 조각 + 발광석 가루\\"는 마인크래프트에 없는 식)"},{"id":"gold_nugget","name":"금 조각","station":"inventory","in":{"gold_ingot":1},"out":{"gold_nugget":9},"_note":"금 주괴 1 → 금 조각 9. 반대로 조각 9 → 주괴 1 도 됨"},{"id":"magma_cream","name":"마그마 크림","station":"inventory","in":{"slime_ball":1,"blaze_powder":1},"out":{"magma_cream":1},"_note":"화염 저항의 물약 재료. 네더 마그마 큐브가 생기면 거기서도 나옴"},{"id":"turtle_shell","name":"거북 등딱지","station":"crafting_table","in":{"scute":5},"out":{"turtle_shell":1},"release":"v1.1","_note":"거북 도사의 물약 재료. 인갑은 아기 거북이가 자라며 떨어뜨림 — 거북이가 게임에 들어올 때"},{"id":"slime_block","name":"슬라임 블록","station":"crafting_table","in":{"slime_ball":9},"out":{"slime_block":1},"release":"v2","_note":"장역화 물약 재료 (1.21). 슬라임이 게임에 들어올 때"}]`),bl={_comment:Eu,recipes:Su},Mu="레드스톤 부품 (마인크래프트 규칙, 아빠 9차 디테일 2026-09-19). 네 가지로 나눈다: power 전원(신호를 만든다) / wire 전송·제어(신호를 옮기고 바꾼다) / input 입력·감지(플레이어·환경이 신호를 켠다) / machine 기계(신호를 받아 움직인다). signal = 내보내는 신호 세기(0~15, 없으면 안 냄). does = 뭘 하는지 한 줄(아들이 고쳐도 됨). release 없는 것은 v1.1(문·레버·버튼·압력판·조명·TNT·레일처럼 신호 하나로 켜고 끄는 것), v2 는 회로(중계기·비교기·관측기·피스톤·호퍼처럼 틱 단위 시뮬이 필요한 것). 신호는 가루 1칸마다 1씩 줄어 15칸까지. 블록은 그 버전에 blocks.json 에 그림과 함께 넣는다.",yu={maxSignal:15,wireLossPerBlock:1,tickMs:100,_note:"레드스톤 틱 = 0.1초(게임 틱 2개). 중계기 지연 1~4 틱"},bu=[{id:"redstone_block",name:"레드스톤 블록",category:"power",signal:15,does:"놓아두면 항상 주변에 최대 신호를 준다",release:"v2"},{id:"redstone_torch",name:"레드스톤 횃불",category:"power",signal:15,does:"항상 켜져 있다가, 붙어 있는 블록에 신호가 들어오면 꺼진다 (NOT 게이트)",release:"v2"},{id:"redstone_wire",name:"레드스톤 가루",category:"wire",does:"전선. 1칸마다 신호가 1씩 줄어 15칸까지 간다",release:"v2",_note:"재료 자체(레드스톤 광석 → 가루 4)는 v1 (recipes.json redstone_dust). 바닥에 놓아 전선으로 쓰는 것이 v2"},{id:"repeater",name:"레드스톤 중계기",category:"wire",signal:15,does:"약해진 신호를 다시 15로. 지연 1~4틱. 옆에서 신호를 주면 잠긴다",release:"v2"},{id:"comparator",name:"레드스톤 비교기",category:"wire",does:"신호 세기를 비교하거나 뺀다. 상자·호퍼 안 아이템 양을 신호 세기로 바꾼다",release:"v2"},{id:"observer",name:"관측기",category:"wire",signal:15,does:"앞 블록이 바뀌면 뒤로 1틱짜리 짧은 신호를 낸다",release:"v2"},{id:"lever",name:"레버",category:"input",signal:15,does:"누르면 켜지고 다시 누르면 꺼진다. 신호를 유지할 때"},{id:"button",name:"버튼",category:"input",signal:15,does:"누르면 잠깐(나무 1.5초, 돌 1초)만 신호를 내고 꺼진다",variants:["wood","stone"]},{id:"pressure_plate",name:"압력판",category:"input",signal:15,does:"플레이어·몹·아이템이 올라가면 신호. 나무는 아이템도, 돌은 플레이어·몹만",variants:["wood","stone"]},{id:"weighted_pressure_plate",name:"무게 압력판",category:"input",does:"올라간 것의 수에 따라 신호 세기가 달라진다 (금은 조금만 올라가도 세고, 철은 많이 올라가야)",variants:["gold","iron"],release:"v2"},{id:"daylight_sensor",name:"햇빛 감지기",category:"input",does:"해 높이에 따라 신호 세기가 바뀐다. 뒤집으면 밤에 켜진다 (밤에 자동 가로등)",_note:"원정지는 낮→밤이 흐르므로(ARCHITECTURE 지형) 원정에서 쓸모. 마을은 밤이 없으면 항상 낮"},{id:"tripwire_hook",name:"철사 덫 갈고리",category:"input",signal:15,does:"실로 둘을 이으면 누가 실을 건널 때 신호",_note:'아들 9차 1순위 "침입자 경보기" 재료라 v1.1 로 앞당김'},{id:"target",name:"과녁",category:"input",does:"화살이 가운데에 가까이 맞을수록 센 신호",release:"v2"},{id:"piston",name:"피스톤",category:"machine",does:"신호를 받으면 앞으로 나가 블록을 12개까지 민다",release:"v2"},{id:"sticky_piston",name:"끈끈이 피스톤",category:"machine",does:"피스톤 + 슬라임 볼. 돌아올 때 앞 블록을 같이 당겨온다",release:"v2"},{id:"dispenser",name:"발사기",category:"machine",does:"안에 든 것을 쏘거나 쓴다 (화살은 발사, 물 양동이는 물을 놓음, 물약은 던짐)",release:"v2"},{id:"dropper",name:"공급기",category:"machine",does:"안에 든 것을 그냥 앞으로 떨어뜨리거나 앞 상자에 넣는다",release:"v2"},{id:"hopper",name:"호퍼",category:"machine",does:"위에 떨어진 아이템을 모아 아래·앞 상자로 옮기는 관. 신호를 받으면 멈춘다",release:"v2"},{id:"powered_rail",name:"전동 레일",category:"machine",does:"신호를 받으면 지나가는 수레를 빨라지게 밀어준다",_note:"아들 3차 수레·철도(v1.1)와 함께"},{id:"detector_rail",name:"탐지 레일",category:"machine",signal:15,does:"수레가 지나갈 때 신호를 낸다"},{id:"activator_rail",name:"활성화 레일",category:"machine",does:"TNT 수레를 터뜨리고, 호퍼 수레를 켜고 끈다",release:"v2"},{id:"redstone_lamp",name:"레드스톤 조명",category:"machine",does:"신호를 받으면 불이 켜진다 (발광석 1 + 레드스톤 4)"},{id:"copper_bulb",name:"구리 전구",category:"machine",does:"신호가 올 때마다 켜짐↔꺼짐이 바뀐다 (1.21). 오래되면 색이 변함",release:"v2"},{id:"note_block",name:"소리 블록",category:"machine",does:"신호를 받을 때마다 정해진 음높이로 소리. 아래 블록에 따라 악기가 다르다"},{id:"tnt",name:"TNT",category:"machine",does:"신호를 받거나 불이 붙으면 4초 뒤 폭발",_note:"폭발 드래곤 재료 (recipes.json tnt). 아들 9차: 마을에서는 몹이 공격할 때(방어전) TNT 를 쏘고 싶다 → 마을 안 TNT 는 몹만 다치고 블록은 안 부순다(보호 구역, 아빠 확인 필요). 결정 #64"},{id:"iron_door",name:"철문",category:"machine",does:"손으로는 안 열리고 레드스톤 신호로만 열린다. 나무 문·다락문·울타리 문도 신호로 열 수 있다"}],wu={_comment:"아들 9차(2026-09-19) — 레드스톤으로 제일 먼저 만들고 싶은 것, 순서대로. version = 재료가 다 들어오는 가장 이른 버전",list:[{rank:1,name:"침입자 경보기",parts:["tripwire_hook","pressure_plate","note_block","redstone_lamp"],version:"v1.1",_note:"실을 건너거나 압력판을 밟으면 소리 블록 + 조명. 회로 없이 신호 하나로 됨"},{rank:2,name:"용암 함정",parts:["pressure_plate","iron_door","dispenser"],version:"v1.1 (다락문식) / v2 (발사기식)",_note:"압력판 → 철 다락문이 열려 용암 구덩이로(v1.1). 발사기가 용암 양동이를 쏘는 식은 v2"},{rank:3,name:"아이템 분류기",parts:["hopper","comparator","repeater","redstone_torch"],version:"v2",_note:"호퍼 + 비교기 회로. 상자 시스템(M4)과 회로 시뮬(v2)이 둘 다 필요"}]},Tu={_comment:Mu,rules:yu,parts:bu,sonWishlist:wu},Cu="처음 마을에 들어올 때 한 번 받는 시작 키트 (아빠 결정 2026-09-19, 서바이벌 전환 #66·#67). 아이템 id: 개수. 아들이 바꿔도 됨. 가방 한 칸은 64개까지, 칸은 37개.",Ru={planks:32,log:8,dirt:32,cobblestone:32,torch:8,glass:8,crafting_table:1,bucket:1},Du={_comment:Cu,items:Ru},Pu=dc(Zc),Uu=lc(yl);fc(Tu);const Iu=hc(uu),Lu=cc(bl),Zo=uc(pu);pc(Du);const $o=Oc({recipes:bl,dragons:su,potions:yl});const No="180",ku=0,ea=1,Nu=2,wl=1,Bu=2,wn=3,Pn=0,Lt=1,an=2,zn=0,Ti=1,ta=2,na=3,ia=4,Fu=5,Jn=100,Ou=101,zu=102,Vu=103,Gu=104,Hu=200,Wu=201,Xu=202,Yu=203,Xr=204,Yr=205,Qu=206,qu=207,Ku=208,ju=209,Ju=210,Zu=211,$u=212,ed=213,td=214,Qr=0,qr=1,Kr=2,Ri=3,jr=4,Jr=5,Zr=6,$r=7,Tl=0,nd=1,id=2,Vn=0,sd=1,rd=2,od=3,ad=4,ld=5,cd=6,ud=7,Cl=300,Di=301,Pi=302,eo=303,to=304,er=306,es=1e3,$n=1001,no=1002,Bt=1003,dd=1004,Ki=1005,cn=1006,cr=1007,ei=1008,vn=1009,Rl=1010,Dl=1011,ts=1012,Bo=1013,ti=1014,Cn=1015,as=1016,Fo=1017,Oo=1018,ns=1020,Pl=35902,Ul=35899,Il=1021,Ll=1022,en=1023,is=1026,ss=1027,kl=1028,zo=1029,Nl=1030,Vo=1031,Go=1033,Gs=33776,Hs=33777,Ws=33778,Xs=33779,io=35840,so=35841,ro=35842,oo=35843,ao=36196,lo=37492,co=37496,uo=37808,ho=37809,fo=37810,po=37811,mo=37812,go=37813,_o=37814,vo=37815,Ao=37816,xo=37817,Eo=37818,So=37819,Mo=37820,yo=37821,bo=36492,wo=36494,To=36495,Co=36283,Ro=36284,Do=36285,Po=36286,hd=3200,fd=3201,pd=0,md=1,Tn="",Xt="srgb",Ui="srgb-linear",Qs="linear",at="srgb",oi=7680,sa=519,gd=512,_d=513,vd=514,Bl=515,Ad=516,xd=517,Ed=518,Sd=519,Uo=35044,qs="300 es",mn=2e3,Ks=2001;class Li{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}}const Rt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ra=1234567;const Zi=Math.PI/180,rs=180/Math.PI;function Rn(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Rt[i&255]+Rt[i>>8&255]+Rt[i>>16&255]+Rt[i>>24&255]+"-"+Rt[e&255]+Rt[e>>8&255]+"-"+Rt[e>>16&15|64]+Rt[e>>24&255]+"-"+Rt[t&63|128]+Rt[t>>8&255]+"-"+Rt[t>>16&255]+Rt[t>>24&255]+Rt[n&255]+Rt[n>>8&255]+Rt[n>>16&255]+Rt[n>>24&255]).toLowerCase()}function qe(i,e,t){return Math.max(e,Math.min(t,i))}function Ho(i,e){return(i%e+e)%e}function Md(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function yd(i,e,t){return i!==e?(t-i)/(e-i):0}function $i(i,e,t){return(1-t)*i+t*e}function bd(i,e,t,n){return $i(i,e,1-Math.exp(-t*n))}function wd(i,e=1){return e-Math.abs(Ho(i,e*2)-e)}function Td(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Cd(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Rd(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Dd(i,e){return i+Math.random()*(e-i)}function Pd(i){return i*(.5-Math.random())}function Ud(i){i!==void 0&&(ra=i);let e=ra+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Id(i){return i*Zi}function Ld(i){return i*rs}function kd(i){return(i&i-1)===0&&i!==0}function Nd(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Bd(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Fd(i,e,t,n,s){const r=Math.cos,o=Math.sin,a=r(t/2),c=o(t/2),l=r((e+n)/2),u=o((e+n)/2),d=r((e-n)/2),h=o((e-n)/2),p=r((n-e)/2),g=o((n-e)/2);switch(s){case"XYX":i.set(a*u,c*d,c*h,a*l);break;case"YZY":i.set(c*h,a*u,c*d,a*l);break;case"ZXZ":i.set(c*d,c*h,a*u,a*l);break;case"XZX":i.set(a*u,c*g,c*p,a*l);break;case"YXY":i.set(c*p,a*u,c*g,a*l);break;case"ZYZ":i.set(c*g,c*p,a*u,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function ln(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function st(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Od={DEG2RAD:Zi,RAD2DEG:rs,generateUUID:Rn,clamp:qe,euclideanModulo:Ho,mapLinear:Md,inverseLerp:yd,lerp:$i,damp:bd,pingpong:wd,smoothstep:Td,smootherstep:Cd,randInt:Rd,randFloat:Dd,randFloatSpread:Pd,seededRandom:Ud,degToRad:Id,radToDeg:Ld,isPowerOfTwo:kd,ceilPowerOfTwo:Nd,floorPowerOfTwo:Bd,setQuaternionFromProperEuler:Fd,normalize:st,denormalize:ln};class Ke{constructor(e=0,t=0){Ke.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ls{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let c=n[s+0],l=n[s+1],u=n[s+2],d=n[s+3];const h=r[o+0],p=r[o+1],g=r[o+2],v=r[o+3];if(a===0){e[t+0]=c,e[t+1]=l,e[t+2]=u,e[t+3]=d;return}if(a===1){e[t+0]=h,e[t+1]=p,e[t+2]=g,e[t+3]=v;return}if(d!==v||c!==h||l!==p||u!==g){let m=1-a;const f=c*h+l*p+u*g+d*v,b=f>=0?1:-1,M=1-f*f;if(M>Number.EPSILON){const T=Math.sqrt(M),y=Math.atan2(T,f*b);m=Math.sin(m*y)/T,a=Math.sin(a*y)/T}const _=a*b;if(c=c*m+h*_,l=l*m+p*_,u=u*m+g*_,d=d*m+v*_,m===1-a){const T=1/Math.sqrt(c*c+l*l+u*u+d*d);c*=T,l*=T,u*=T,d*=T}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,o){const a=n[s],c=n[s+1],l=n[s+2],u=n[s+3],d=r[o],h=r[o+1],p=r[o+2],g=r[o+3];return e[t]=a*g+u*d+c*p-l*h,e[t+1]=c*g+u*h+l*d-a*p,e[t+2]=l*g+u*p+a*h-c*d,e[t+3]=u*g-a*d-c*h-l*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(n/2),u=a(s/2),d=a(r/2),h=c(n/2),p=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=h*u*d+l*p*g,this._y=l*p*d-h*u*g,this._z=l*u*g+h*p*d,this._w=l*u*d-h*p*g;break;case"YXZ":this._x=h*u*d+l*p*g,this._y=l*p*d-h*u*g,this._z=l*u*g-h*p*d,this._w=l*u*d+h*p*g;break;case"ZXY":this._x=h*u*d-l*p*g,this._y=l*p*d+h*u*g,this._z=l*u*g+h*p*d,this._w=l*u*d-h*p*g;break;case"ZYX":this._x=h*u*d-l*p*g,this._y=l*p*d+h*u*g,this._z=l*u*g-h*p*d,this._w=l*u*d+h*p*g;break;case"YZX":this._x=h*u*d+l*p*g,this._y=l*p*d+h*u*g,this._z=l*u*g-h*p*d,this._w=l*u*d-h*p*g;break;case"XZY":this._x=h*u*d-l*p*g,this._y=l*p*d-h*u*g,this._z=l*u*g+h*p*d,this._w=l*u*d+h*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],u=t[6],d=t[10],h=n+a+d;if(h>0){const p=.5/Math.sqrt(h+1);this._w=.25/p,this._x=(u-c)*p,this._y=(r-l)*p,this._z=(o-s)*p}else if(n>a&&n>d){const p=2*Math.sqrt(1+n-a-d);this._w=(u-c)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+l)/p}else if(a>d){const p=2*Math.sqrt(1+a-n-d);this._w=(r-l)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(c+u)/p}else{const p=2*Math.sqrt(1+d-n-a);this._w=(o-s)/p,this._x=(r+l)/p,this._y=(c+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(qe(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,u=t._w;return this._x=n*u+o*a+s*l-r*c,this._y=s*u+o*c+r*a-n*l,this._z=r*u+o*l+n*c-s*a,this._w=o*u-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const p=1-t;return this._w=p*o+t*this._w,this._x=p*n+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}const l=Math.sqrt(c),u=Math.atan2(l,a),d=Math.sin((1-t)*u)/l,h=Math.sin(t*u)/l;return this._w=o*d+this._w*h,this._x=n*d+this._x*h,this._y=s*d+this._y*h,this._z=r*d+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class G{constructor(e=0,t=0,n=0){G.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(oa.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(oa.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*s-a*n),u=2*(a*t-r*s),d=2*(r*n-o*t);return this.x=t+c*l+o*d-a*u,this.y=n+c*u+a*l-r*d,this.z=s+c*d+r*u-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this.z=qe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this.z=qe(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return ur.copy(this).projectOnVector(e),this.sub(ur)}reflect(e){return this.sub(ur.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ur=new G,oa=new ls;class Ve{constructor(e,t,n,s,r,o,a,c,l){Ve.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l)}set(e,t,n,s,r,o,a,c,l){const u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=t,u[4]=r,u[5]=c,u[6]=n,u[7]=o,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],u=n[4],d=n[7],h=n[2],p=n[5],g=n[8],v=s[0],m=s[3],f=s[6],b=s[1],M=s[4],_=s[7],T=s[2],y=s[5],C=s[8];return r[0]=o*v+a*b+c*T,r[3]=o*m+a*M+c*y,r[6]=o*f+a*_+c*C,r[1]=l*v+u*b+d*T,r[4]=l*m+u*M+d*y,r[7]=l*f+u*_+d*C,r[2]=h*v+p*b+g*T,r[5]=h*m+p*M+g*y,r[8]=h*f+p*_+g*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8];return t*o*u-t*a*l-n*r*u+n*a*c+s*r*l-s*o*c}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],d=u*o-a*l,h=a*c-u*r,p=l*r-o*c,g=t*d+n*h+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=d*v,e[1]=(s*l-u*n)*v,e[2]=(a*n-s*o)*v,e[3]=h*v,e[4]=(u*t-s*c)*v,e[5]=(s*r-a*t)*v,e[6]=p*v,e[7]=(n*c-l*t)*v,e[8]=(o*t-n*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+e,-s*l,s*c,-s*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(dr.makeScale(e,t)),this}rotate(e){return this.premultiply(dr.makeRotation(-e)),this}translate(e,t){return this.premultiply(dr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const dr=new Ve;function Fl(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function js(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function zd(){const i=js("canvas");return i.style.display="block",i}const aa={};function os(i){i in aa||(aa[i]=!0,console.warn(i))}function Vd(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const la=new Ve().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ca=new Ve().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Gd(){const i={enabled:!0,workingColorSpace:Ui,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===at&&(s.r=Dn(s.r),s.g=Dn(s.g),s.b=Dn(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===at&&(s.r=Ci(s.r),s.g=Ci(s.g),s.b=Ci(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Tn?Qs:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return os("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return os("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Ui]:{primaries:e,whitePoint:n,transfer:Qs,toXYZ:la,fromXYZ:ca,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Xt},outputColorSpaceConfig:{drawingBufferColorSpace:Xt}},[Xt]:{primaries:e,whitePoint:n,transfer:at,toXYZ:la,fromXYZ:ca,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Xt}}}),i}const $e=Gd();function Dn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ci(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let ai;class Hd{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{ai===void 0&&(ai=js("canvas")),ai.width=e.width,ai.height=e.height;const s=ai.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=ai}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=js("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Dn(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Dn(t[n]/255)*255):t[n]=Dn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Wd=0;class Wo{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Wd++}),this.uuid=Rn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(hr(s[o].image)):r.push(hr(s[o]))}else r=hr(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function hr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Hd.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Xd=0;const fr=new G;class kt extends Li{constructor(e=kt.DEFAULT_IMAGE,t=kt.DEFAULT_MAPPING,n=$n,s=$n,r=cn,o=ei,a=en,c=vn,l=kt.DEFAULT_ANISOTROPY,u=Tn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Xd++}),this.uuid=Rn(),this.name="",this.source=new Wo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Ke(0,0),this.repeat=new Ke(1,1),this.center=new Ke(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ve,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(fr).x}get height(){return this.source.getSize(fr).y}get depth(){return this.source.getSize(fr).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Cl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case es:e.x=e.x-Math.floor(e.x);break;case $n:e.x=e.x<0?0:1;break;case no:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case es:e.y=e.y-Math.floor(e.y);break;case $n:e.y=e.y<0?0:1;break;case no:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}kt.DEFAULT_IMAGE=null;kt.DEFAULT_MAPPING=Cl;kt.DEFAULT_ANISOTROPY=1;class At{constructor(e=0,t=0,n=0,s=1){At.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const c=e.elements,l=c[0],u=c[4],d=c[8],h=c[1],p=c[5],g=c[9],v=c[2],m=c[6],f=c[10];if(Math.abs(u-h)<.01&&Math.abs(d-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+v)<.1&&Math.abs(g+m)<.1&&Math.abs(l+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const M=(l+1)/2,_=(p+1)/2,T=(f+1)/2,y=(u+h)/4,C=(d+v)/4,L=(g+m)/4;return M>_&&M>T?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=y/n,r=C/n):_>T?_<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),n=y/s,r=L/s):T<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),n=C/r,s=L/r),this.set(n,s,r,t),this}let b=Math.sqrt((m-g)*(m-g)+(d-v)*(d-v)+(h-u)*(h-u));return Math.abs(b)<.001&&(b=1),this.x=(m-g)/b,this.y=(d-v)/b,this.z=(h-u)/b,this.w=Math.acos((l+p+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this.z=qe(this.z,e.z,t.z),this.w=qe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this.z=qe(this.z,e,t),this.w=qe(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Yd extends Li{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:cn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new At(0,0,e,t),this.scissorTest=!1,this.viewport=new At(0,0,e,t);const s={width:e,height:t,depth:n.depth},r=new kt(s);this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:cn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Wo(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ni extends Yd{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Xo extends kt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Bt,this.minFilter=Bt,this.wrapR=$n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Qd extends kt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Bt,this.minFilter=Bt,this.wrapR=$n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class cs{constructor(e=new G(1/0,1/0,1/0),t=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(tn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(tn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=tn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,tn):tn.fromBufferAttribute(r,o),tn.applyMatrix4(e.matrixWorld),this.expandByPoint(tn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ms.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ms.copy(n.boundingBox)),ms.applyMatrix4(e.matrixWorld),this.union(ms)}const s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,tn),tn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Vi),gs.subVectors(this.max,Vi),li.subVectors(e.a,Vi),ci.subVectors(e.b,Vi),ui.subVectors(e.c,Vi),Ln.subVectors(ci,li),kn.subVectors(ui,ci),Hn.subVectors(li,ui);let t=[0,-Ln.z,Ln.y,0,-kn.z,kn.y,0,-Hn.z,Hn.y,Ln.z,0,-Ln.x,kn.z,0,-kn.x,Hn.z,0,-Hn.x,-Ln.y,Ln.x,0,-kn.y,kn.x,0,-Hn.y,Hn.x,0];return!pr(t,li,ci,ui,gs)||(t=[1,0,0,0,1,0,0,0,1],!pr(t,li,ci,ui,gs))?!1:(_s.crossVectors(Ln,kn),t=[_s.x,_s.y,_s.z],pr(t,li,ci,ui,gs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,tn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(tn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(En[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),En[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),En[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),En[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),En[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),En[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),En[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),En[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(En),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const En=[new G,new G,new G,new G,new G,new G,new G,new G],tn=new G,ms=new cs,li=new G,ci=new G,ui=new G,Ln=new G,kn=new G,Hn=new G,Vi=new G,gs=new G,_s=new G,Wn=new G;function pr(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Wn.fromArray(i,r);const a=s.x*Math.abs(Wn.x)+s.y*Math.abs(Wn.y)+s.z*Math.abs(Wn.z),c=e.dot(Wn),l=t.dot(Wn),u=n.dot(Wn);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return!1}return!0}const qd=new cs,Gi=new G,mr=new G;class tr{constructor(e=new G,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):qd.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Gi.subVectors(e,this.center);const t=Gi.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Gi,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(mr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Gi.copy(e.center).add(mr)),this.expandByPoint(Gi.copy(e.center).sub(mr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Sn=new G,gr=new G,vs=new G,Nn=new G,_r=new G,As=new G,vr=new G;class Kd{constructor(e=new G,t=new G(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Sn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Sn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Sn.copy(this.origin).addScaledVector(this.direction,t),Sn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){gr.copy(e).add(t).multiplyScalar(.5),vs.copy(t).sub(e).normalize(),Nn.copy(this.origin).sub(gr);const r=e.distanceTo(t)*.5,o=-this.direction.dot(vs),a=Nn.dot(this.direction),c=-Nn.dot(vs),l=Nn.lengthSq(),u=Math.abs(1-o*o);let d,h,p,g;if(u>0)if(d=o*c-a,h=o*a-c,g=r*u,d>=0)if(h>=-g)if(h<=g){const v=1/u;d*=v,h*=v,p=d*(d+o*h+2*a)+h*(o*d+h+2*c)+l}else h=r,d=Math.max(0,-(o*h+a)),p=-d*d+h*(h+2*c)+l;else h=-r,d=Math.max(0,-(o*h+a)),p=-d*d+h*(h+2*c)+l;else h<=-g?(d=Math.max(0,-(-o*r+a)),h=d>0?-r:Math.min(Math.max(-r,-c),r),p=-d*d+h*(h+2*c)+l):h<=g?(d=0,h=Math.min(Math.max(-r,-c),r),p=h*(h+2*c)+l):(d=Math.max(0,-(o*r+a)),h=d>0?r:Math.min(Math.max(-r,-c),r),p=-d*d+h*(h+2*c)+l);else h=o>0?-r:r,d=Math.max(0,-(o*h+a)),p=-d*d+h*(h+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(gr).addScaledVector(vs,h),p}intersectSphere(e,t){Sn.subVectors(e.center,this.origin);const n=Sn.dot(this.direction),s=Sn.dot(Sn)-n*n,r=e.radius*e.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,c;const l=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return l>=0?(n=(e.min.x-h.x)*l,s=(e.max.x-h.x)*l):(n=(e.max.x-h.x)*l,s=(e.min.x-h.x)*l),u>=0?(r=(e.min.y-h.y)*u,o=(e.max.y-h.y)*u):(r=(e.max.y-h.y)*u,o=(e.min.y-h.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(e.min.z-h.z)*d,c=(e.max.z-h.z)*d):(a=(e.max.z-h.z)*d,c=(e.min.z-h.z)*d),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Sn)!==null}intersectTriangle(e,t,n,s,r){_r.subVectors(t,e),As.subVectors(n,e),vr.crossVectors(_r,As);let o=this.direction.dot(vr),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Nn.subVectors(this.origin,e);const c=a*this.direction.dot(As.crossVectors(Nn,As));if(c<0)return null;const l=a*this.direction.dot(_r.cross(Nn));if(l<0||c+l>o)return null;const u=-a*Nn.dot(vr);return u<0?null:this.at(u/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Et{constructor(e,t,n,s,r,o,a,c,l,u,d,h,p,g,v,m){Et.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l,u,d,h,p,g,v,m)}set(e,t,n,s,r,o,a,c,l,u,d,h,p,g,v,m){const f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=s,f[1]=r,f[5]=o,f[9]=a,f[13]=c,f[2]=l,f[6]=u,f[10]=d,f[14]=h,f[3]=p,f[7]=g,f[11]=v,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Et().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/di.setFromMatrixColumn(e,0).length(),r=1/di.setFromMatrixColumn(e,1).length(),o=1/di.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const h=o*u,p=o*d,g=a*u,v=a*d;t[0]=c*u,t[4]=-c*d,t[8]=l,t[1]=p+g*l,t[5]=h-v*l,t[9]=-a*c,t[2]=v-h*l,t[6]=g+p*l,t[10]=o*c}else if(e.order==="YXZ"){const h=c*u,p=c*d,g=l*u,v=l*d;t[0]=h+v*a,t[4]=g*a-p,t[8]=o*l,t[1]=o*d,t[5]=o*u,t[9]=-a,t[2]=p*a-g,t[6]=v+h*a,t[10]=o*c}else if(e.order==="ZXY"){const h=c*u,p=c*d,g=l*u,v=l*d;t[0]=h-v*a,t[4]=-o*d,t[8]=g+p*a,t[1]=p+g*a,t[5]=o*u,t[9]=v-h*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){const h=o*u,p=o*d,g=a*u,v=a*d;t[0]=c*u,t[4]=g*l-p,t[8]=h*l+v,t[1]=c*d,t[5]=v*l+h,t[9]=p*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){const h=o*c,p=o*l,g=a*c,v=a*l;t[0]=c*u,t[4]=v-h*d,t[8]=g*d+p,t[1]=d,t[5]=o*u,t[9]=-a*u,t[2]=-l*u,t[6]=p*d+g,t[10]=h-v*d}else if(e.order==="XZY"){const h=o*c,p=o*l,g=a*c,v=a*l;t[0]=c*u,t[4]=-d,t[8]=l*u,t[1]=h*d+v,t[5]=o*u,t[9]=p*d-g,t[2]=g*d-p,t[6]=a*u,t[10]=v*d+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(jd,e,Jd)}lookAt(e,t,n){const s=this.elements;return Ht.subVectors(e,t),Ht.lengthSq()===0&&(Ht.z=1),Ht.normalize(),Bn.crossVectors(n,Ht),Bn.lengthSq()===0&&(Math.abs(n.z)===1?Ht.x+=1e-4:Ht.z+=1e-4,Ht.normalize(),Bn.crossVectors(n,Ht)),Bn.normalize(),xs.crossVectors(Ht,Bn),s[0]=Bn.x,s[4]=xs.x,s[8]=Ht.x,s[1]=Bn.y,s[5]=xs.y,s[9]=Ht.y,s[2]=Bn.z,s[6]=xs.z,s[10]=Ht.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],u=n[1],d=n[5],h=n[9],p=n[13],g=n[2],v=n[6],m=n[10],f=n[14],b=n[3],M=n[7],_=n[11],T=n[15],y=s[0],C=s[4],L=s[8],S=s[12],x=s[1],D=s[5],k=s[9],F=s[13],V=s[2],X=s[6],B=s[10],K=s[14],z=s[3],ee=s[7],le=s[11],pe=s[15];return r[0]=o*y+a*x+c*V+l*z,r[4]=o*C+a*D+c*X+l*ee,r[8]=o*L+a*k+c*B+l*le,r[12]=o*S+a*F+c*K+l*pe,r[1]=u*y+d*x+h*V+p*z,r[5]=u*C+d*D+h*X+p*ee,r[9]=u*L+d*k+h*B+p*le,r[13]=u*S+d*F+h*K+p*pe,r[2]=g*y+v*x+m*V+f*z,r[6]=g*C+v*D+m*X+f*ee,r[10]=g*L+v*k+m*B+f*le,r[14]=g*S+v*F+m*K+f*pe,r[3]=b*y+M*x+_*V+T*z,r[7]=b*C+M*D+_*X+T*ee,r[11]=b*L+M*k+_*B+T*le,r[15]=b*S+M*F+_*K+T*pe,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],u=e[2],d=e[6],h=e[10],p=e[14],g=e[3],v=e[7],m=e[11],f=e[15];return g*(+r*c*d-s*l*d-r*a*h+n*l*h+s*a*p-n*c*p)+v*(+t*c*p-t*l*h+r*o*h-s*o*p+s*l*u-r*c*u)+m*(+t*l*d-t*a*p-r*o*d+n*o*p+r*a*u-n*l*u)+f*(-s*a*u-t*c*d+t*a*h+s*o*d-n*o*h+n*c*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],d=e[9],h=e[10],p=e[11],g=e[12],v=e[13],m=e[14],f=e[15],b=d*m*l-v*h*l+v*c*p-a*m*p-d*c*f+a*h*f,M=g*h*l-u*m*l-g*c*p+o*m*p+u*c*f-o*h*f,_=u*v*l-g*d*l+g*a*p-o*v*p-u*a*f+o*d*f,T=g*d*c-u*v*c-g*a*h+o*v*h+u*a*m-o*d*m,y=t*b+n*M+s*_+r*T;if(y===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/y;return e[0]=b*C,e[1]=(v*h*r-d*m*r-v*s*p+n*m*p+d*s*f-n*h*f)*C,e[2]=(a*m*r-v*c*r+v*s*l-n*m*l-a*s*f+n*c*f)*C,e[3]=(d*c*r-a*h*r-d*s*l+n*h*l+a*s*p-n*c*p)*C,e[4]=M*C,e[5]=(u*m*r-g*h*r+g*s*p-t*m*p-u*s*f+t*h*f)*C,e[6]=(g*c*r-o*m*r-g*s*l+t*m*l+o*s*f-t*c*f)*C,e[7]=(o*h*r-u*c*r+u*s*l-t*h*l-o*s*p+t*c*p)*C,e[8]=_*C,e[9]=(g*d*r-u*v*r-g*n*p+t*v*p+u*n*f-t*d*f)*C,e[10]=(o*v*r-g*a*r+g*n*l-t*v*l-o*n*f+t*a*f)*C,e[11]=(u*a*r-o*d*r-u*n*l+t*d*l+o*n*p-t*a*p)*C,e[12]=T*C,e[13]=(u*v*s-g*d*s+g*n*h-t*v*h-u*n*m+t*d*m)*C,e[14]=(g*a*s-o*v*s-g*n*c+t*v*c+o*n*m-t*a*m)*C,e[15]=(o*d*s-u*a*s+u*n*c-t*d*c-o*n*h+t*a*h)*C,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,c=e.z,l=r*o,u=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,u*a+n,u*c-s*o,0,l*c-s*a,u*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,u=o+o,d=a+a,h=r*l,p=r*u,g=r*d,v=o*u,m=o*d,f=a*d,b=c*l,M=c*u,_=c*d,T=n.x,y=n.y,C=n.z;return s[0]=(1-(v+f))*T,s[1]=(p+_)*T,s[2]=(g-M)*T,s[3]=0,s[4]=(p-_)*y,s[5]=(1-(h+f))*y,s[6]=(m+b)*y,s[7]=0,s[8]=(g+M)*C,s[9]=(m-b)*C,s[10]=(1-(h+v))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=di.set(s[0],s[1],s[2]).length();const o=di.set(s[4],s[5],s[6]).length(),a=di.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],nn.copy(this);const l=1/r,u=1/o,d=1/a;return nn.elements[0]*=l,nn.elements[1]*=l,nn.elements[2]*=l,nn.elements[4]*=u,nn.elements[5]*=u,nn.elements[6]*=u,nn.elements[8]*=d,nn.elements[9]*=d,nn.elements[10]*=d,t.setFromRotationMatrix(nn),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=mn,c=!1){const l=this.elements,u=2*r/(t-e),d=2*r/(n-s),h=(t+e)/(t-e),p=(n+s)/(n-s);let g,v;if(c)g=r/(o-r),v=o*r/(o-r);else if(a===mn)g=-(o+r)/(o-r),v=-2*o*r/(o-r);else if(a===Ks)g=-o/(o-r),v=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=d,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=mn,c=!1){const l=this.elements,u=2/(t-e),d=2/(n-s),h=-(t+e)/(t-e),p=-(n+s)/(n-s);let g,v;if(c)g=1/(o-r),v=o/(o-r);else if(a===mn)g=-2/(o-r),v=-(o+r)/(o-r);else if(a===Ks)g=-1/(o-r),v=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=0,l[12]=h,l[1]=0,l[5]=d,l[9]=0,l[13]=p,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const di=new G,nn=new Et,jd=new G(0,0,0),Jd=new G(1,1,1),Bn=new G,xs=new G,Ht=new G,ua=new Et,da=new ls;class Un{constructor(e=0,t=0,n=0,s=Un.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],u=s[9],d=s[2],h=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(qe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-qe(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(qe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-qe(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(qe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-qe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ua.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ua,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return da.setFromEuler(this),this.setFromQuaternion(da,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Un.DEFAULT_ORDER="XYZ";class Ol{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Zd=0;const ha=new G,hi=new ls,Mn=new Et,Es=new G,Hi=new G,$d=new G,eh=new ls,fa=new G(1,0,0),pa=new G(0,1,0),ma=new G(0,0,1),ga={type:"added"},th={type:"removed"},fi={type:"childadded",child:null},Ar={type:"childremoved",child:null};class Ft extends Li{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Zd++}),this.uuid=Rn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ft.DEFAULT_UP.clone();const e=new G,t=new Un,n=new ls,s=new G(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Et},normalMatrix:{value:new Ve}}),this.matrix=new Et,this.matrixWorld=new Et,this.matrixAutoUpdate=Ft.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ol,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return hi.setFromAxisAngle(e,t),this.quaternion.multiply(hi),this}rotateOnWorldAxis(e,t){return hi.setFromAxisAngle(e,t),this.quaternion.premultiply(hi),this}rotateX(e){return this.rotateOnAxis(fa,e)}rotateY(e){return this.rotateOnAxis(pa,e)}rotateZ(e){return this.rotateOnAxis(ma,e)}translateOnAxis(e,t){return ha.copy(e).applyQuaternion(this.quaternion),this.position.add(ha.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(fa,e)}translateY(e){return this.translateOnAxis(pa,e)}translateZ(e){return this.translateOnAxis(ma,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Mn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Es.copy(e):Es.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Hi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Mn.lookAt(Hi,Es,this.up):Mn.lookAt(Es,Hi,this.up),this.quaternion.setFromRotationMatrix(Mn),s&&(Mn.extractRotation(s.matrixWorld),hi.setFromRotationMatrix(Mn),this.quaternion.premultiply(hi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ga),fi.child=e,this.dispatchEvent(fi),fi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(th),Ar.child=e,this.dispatchEvent(Ar),Ar.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Mn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Mn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Mn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ga),fi.child=e,this.dispatchEvent(fi),fi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Hi,e,$d),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Hi,eh,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const d=c[l];r(e.shapes,d)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){const a=o(e.geometries),c=o(e.materials),l=o(e.textures),u=o(e.images),d=o(e.shapes),h=o(e.skeletons),p=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),h.length>0&&(n.skeletons=h),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const c=[];for(const l in a){const u=a[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}Ft.DEFAULT_UP=new G(0,1,0);Ft.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const sn=new G,yn=new G,xr=new G,bn=new G,pi=new G,mi=new G,_a=new G,Er=new G,Sr=new G,Mr=new G,yr=new At,br=new At,wr=new At;class $t{constructor(e=new G,t=new G,n=new G){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),sn.subVectors(e,t),s.cross(sn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){sn.subVectors(s,t),yn.subVectors(n,t),xr.subVectors(e,t);const o=sn.dot(sn),a=sn.dot(yn),c=sn.dot(xr),l=yn.dot(yn),u=yn.dot(xr),d=o*l-a*a;if(d===0)return r.set(0,0,0),null;const h=1/d,p=(l*c-a*u)*h,g=(o*u-a*c)*h;return r.set(1-p-g,g,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,bn)===null?!1:bn.x>=0&&bn.y>=0&&bn.x+bn.y<=1}static getInterpolation(e,t,n,s,r,o,a,c){return this.getBarycoord(e,t,n,s,bn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,bn.x),c.addScaledVector(o,bn.y),c.addScaledVector(a,bn.z),c)}static getInterpolatedAttribute(e,t,n,s,r,o){return yr.setScalar(0),br.setScalar(0),wr.setScalar(0),yr.fromBufferAttribute(e,t),br.fromBufferAttribute(e,n),wr.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(yr,r.x),o.addScaledVector(br,r.y),o.addScaledVector(wr,r.z),o}static isFrontFacing(e,t,n,s){return sn.subVectors(n,t),yn.subVectors(e,t),sn.cross(yn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return sn.subVectors(this.c,this.b),yn.subVectors(this.a,this.b),sn.cross(yn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return $t.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return $t.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return $t.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return $t.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return $t.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let o,a;pi.subVectors(s,n),mi.subVectors(r,n),Er.subVectors(e,n);const c=pi.dot(Er),l=mi.dot(Er);if(c<=0&&l<=0)return t.copy(n);Sr.subVectors(e,s);const u=pi.dot(Sr),d=mi.dot(Sr);if(u>=0&&d<=u)return t.copy(s);const h=c*d-u*l;if(h<=0&&c>=0&&u<=0)return o=c/(c-u),t.copy(n).addScaledVector(pi,o);Mr.subVectors(e,r);const p=pi.dot(Mr),g=mi.dot(Mr);if(g>=0&&p<=g)return t.copy(r);const v=p*l-c*g;if(v<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(n).addScaledVector(mi,a);const m=u*g-p*d;if(m<=0&&d-u>=0&&p-g>=0)return _a.subVectors(r,s),a=(d-u)/(d-u+(p-g)),t.copy(s).addScaledVector(_a,a);const f=1/(m+v+h);return o=v*f,a=h*f,t.copy(n).addScaledVector(pi,o).addScaledVector(mi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const zl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Fn={h:0,s:0,l:0},Ss={h:0,s:0,l:0};function Tr(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Ye{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Xt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,$e.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=$e.workingColorSpace){return this.r=e,this.g=t,this.b=n,$e.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=$e.workingColorSpace){if(e=Ho(e,1),t=qe(t,0,1),n=qe(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=Tr(o,r,e+1/3),this.g=Tr(o,r,e),this.b=Tr(o,r,e-1/3)}return $e.colorSpaceToWorking(this,s),this}setStyle(e,t=Xt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Xt){const n=zl[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Dn(e.r),this.g=Dn(e.g),this.b=Dn(e.b),this}copyLinearToSRGB(e){return this.r=Ci(e.r),this.g=Ci(e.g),this.b=Ci(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Xt){return $e.workingToColorSpace(Dt.copy(this),e),Math.round(qe(Dt.r*255,0,255))*65536+Math.round(qe(Dt.g*255,0,255))*256+Math.round(qe(Dt.b*255,0,255))}getHexString(e=Xt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=$e.workingColorSpace){$e.workingToColorSpace(Dt.copy(this),t);const n=Dt.r,s=Dt.g,r=Dt.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,l;const u=(a+o)/2;if(a===o)c=0,l=0;else{const d=o-a;switch(l=u<=.5?d/(o+a):d/(2-o-a),o){case n:c=(s-r)/d+(s<r?6:0);break;case s:c=(r-n)/d+2;break;case r:c=(n-s)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=$e.workingColorSpace){return $e.workingToColorSpace(Dt.copy(this),t),e.r=Dt.r,e.g=Dt.g,e.b=Dt.b,e}getStyle(e=Xt){$e.workingToColorSpace(Dt.copy(this),e);const t=Dt.r,n=Dt.g,s=Dt.b;return e!==Xt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Fn),this.setHSL(Fn.h+e,Fn.s+t,Fn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Fn),e.getHSL(Ss);const n=$i(Fn.h,Ss.h,t),s=$i(Fn.s,Ss.s,t),r=$i(Fn.l,Ss.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Dt=new Ye;Ye.NAMES=zl;let nh=0;class us extends Li{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:nh++}),this.uuid=Rn(),this.name="",this.type="Material",this.blending=Ti,this.side=Pn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Xr,this.blendDst=Yr,this.blendEquation=Jn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ye(0,0,0),this.blendAlpha=0,this.depthFunc=Ri,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=sa,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=oi,this.stencilZFail=oi,this.stencilZPass=oi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ti&&(n.blending=this.blending),this.side!==Pn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Xr&&(n.blendSrc=this.blendSrc),this.blendDst!==Yr&&(n.blendDst=this.blendDst),this.blendEquation!==Jn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ri&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==sa&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==oi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==oi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==oi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(t){const r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class ii extends us{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ye(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Un,this.combine=Tl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const xt=new G,Ms=new Ke;let ih=0;class Tt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:ih++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Uo,this.updateRanges=[],this.gpuType=Cn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ms.fromBufferAttribute(this,t),Ms.applyMatrix3(e),this.setXY(t,Ms.x,Ms.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)xt.fromBufferAttribute(this,t),xt.applyMatrix3(e),this.setXYZ(t,xt.x,xt.y,xt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)xt.fromBufferAttribute(this,t),xt.applyMatrix4(e),this.setXYZ(t,xt.x,xt.y,xt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)xt.fromBufferAttribute(this,t),xt.applyNormalMatrix(e),this.setXYZ(t,xt.x,xt.y,xt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)xt.fromBufferAttribute(this,t),xt.transformDirection(e),this.setXYZ(t,xt.x,xt.y,xt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=ln(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=st(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ln(t,this.array)),t}setX(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ln(t,this.array)),t}setY(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ln(t,this.array)),t}setZ(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ln(t,this.array)),t}setW(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),n=st(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),n=st(n,this.array),s=st(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),n=st(n,this.array),s=st(s,this.array),r=st(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Uo&&(e.usage=this.usage),e}}class Vl extends Tt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Gl extends Tt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class _n extends Tt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let sh=0;const Jt=new Et,Cr=new Ft,gi=new G,Wt=new cs,Wi=new cs,bt=new G;class un extends Li{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:sh++}),this.uuid=Rn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Fl(e)?Gl:Vl)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ve().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Jt.makeRotationFromQuaternion(e),this.applyMatrix4(Jt),this}rotateX(e){return Jt.makeRotationX(e),this.applyMatrix4(Jt),this}rotateY(e){return Jt.makeRotationY(e),this.applyMatrix4(Jt),this}rotateZ(e){return Jt.makeRotationZ(e),this.applyMatrix4(Jt),this}translate(e,t,n){return Jt.makeTranslation(e,t,n),this.applyMatrix4(Jt),this}scale(e,t,n){return Jt.makeScale(e,t,n),this.applyMatrix4(Jt),this}lookAt(e){return Cr.lookAt(e),Cr.updateMatrix(),this.applyMatrix4(Cr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(gi).negate(),this.translate(gi.x,gi.y,gi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new _n(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new cs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Wt.setFromBufferAttribute(r),this.morphTargetsRelative?(bt.addVectors(this.boundingBox.min,Wt.min),this.boundingBox.expandByPoint(bt),bt.addVectors(this.boundingBox.max,Wt.max),this.boundingBox.expandByPoint(bt)):(this.boundingBox.expandByPoint(Wt.min),this.boundingBox.expandByPoint(Wt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new tr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new G,1/0);return}if(e){const n=this.boundingSphere.center;if(Wt.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];Wi.setFromBufferAttribute(a),this.morphTargetsRelative?(bt.addVectors(Wt.min,Wi.min),Wt.expandByPoint(bt),bt.addVectors(Wt.max,Wi.max),Wt.expandByPoint(bt)):(Wt.expandByPoint(Wi.min),Wt.expandByPoint(Wi.max))}Wt.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)bt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(bt));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)bt.fromBufferAttribute(a,l),c&&(gi.fromBufferAttribute(e,l),bt.add(gi)),s=Math.max(s,n.distanceToSquared(bt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Tt(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let L=0;L<n.count;L++)a[L]=new G,c[L]=new G;const l=new G,u=new G,d=new G,h=new Ke,p=new Ke,g=new Ke,v=new G,m=new G;function f(L,S,x){l.fromBufferAttribute(n,L),u.fromBufferAttribute(n,S),d.fromBufferAttribute(n,x),h.fromBufferAttribute(r,L),p.fromBufferAttribute(r,S),g.fromBufferAttribute(r,x),u.sub(l),d.sub(l),p.sub(h),g.sub(h);const D=1/(p.x*g.y-g.x*p.y);isFinite(D)&&(v.copy(u).multiplyScalar(g.y).addScaledVector(d,-p.y).multiplyScalar(D),m.copy(d).multiplyScalar(p.x).addScaledVector(u,-g.x).multiplyScalar(D),a[L].add(v),a[S].add(v),a[x].add(v),c[L].add(m),c[S].add(m),c[x].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let L=0,S=b.length;L<S;++L){const x=b[L],D=x.start,k=x.count;for(let F=D,V=D+k;F<V;F+=3)f(e.getX(F+0),e.getX(F+1),e.getX(F+2))}const M=new G,_=new G,T=new G,y=new G;function C(L){T.fromBufferAttribute(s,L),y.copy(T);const S=a[L];M.copy(S),M.sub(T.multiplyScalar(T.dot(S))).normalize(),_.crossVectors(y,S);const D=_.dot(c[L])<0?-1:1;o.setXYZW(L,M.x,M.y,M.z,D)}for(let L=0,S=b.length;L<S;++L){const x=b[L],D=x.start,k=x.count;for(let F=D,V=D+k;F<V;F+=3)C(e.getX(F+0)),C(e.getX(F+1)),C(e.getX(F+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Tt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,p=n.count;h<p;h++)n.setXYZ(h,0,0,0);const s=new G,r=new G,o=new G,a=new G,c=new G,l=new G,u=new G,d=new G;if(e)for(let h=0,p=e.count;h<p;h+=3){const g=e.getX(h+0),v=e.getX(h+1),m=e.getX(h+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,v),o.fromBufferAttribute(t,m),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,m),a.add(u),c.add(u),l.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let h=0,p=t.count;h<p;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),o.fromBufferAttribute(t,h+2),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)bt.fromBufferAttribute(e,t),bt.normalize(),e.setXYZ(t,bt.x,bt.y,bt.z)}toNonIndexed(){function e(a,c){const l=a.array,u=a.itemSize,d=a.normalized,h=new l.constructor(c.length*u);let p=0,g=0;for(let v=0,m=c.length;v<m;v++){a.isInterleavedBufferAttribute?p=c[v]*a.data.stride+a.offset:p=c[v]*u;for(let f=0;f<u;f++)h[g++]=l[p++]}return new Tt(h,u,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new un,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=e(c,n);t.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let u=0,d=l.length;u<d;u++){const h=l[u],p=e(h,n);c.push(p)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let d=0,h=l.length;d<h;d++){const p=l[d];u.push(p.toJSON(e.data))}u.length>0&&(s[c]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const l in s){const u=s[l];this.setAttribute(l,u.clone(t))}const r=e.morphAttributes;for(const l in r){const u=[],d=r[l];for(let h=0,p=d.length;h<p;h++)u.push(d[h].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let l=0,u=o.length;l<u;l++){const d=o[l];this.addGroup(d.start,d.count,d.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const va=new Et,Xn=new Kd,ys=new tr,Aa=new G,bs=new G,ws=new G,Ts=new G,Rr=new G,Cs=new G,xa=new G,Rs=new G;class wt extends Ft{constructor(e=new un,t=new ii){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const a=this.morphTargetInfluences;if(r&&a){Cs.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const u=a[c],d=r[c];u!==0&&(Rr.fromBufferAttribute(d,e),o?Cs.addScaledVector(Rr,u):Cs.addScaledVector(Rr.sub(t),u))}t.add(Cs)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ys.copy(n.boundingSphere),ys.applyMatrix4(r),Xn.copy(e.ray).recast(e.near),!(ys.containsPoint(Xn.origin)===!1&&(Xn.intersectSphere(ys,Aa)===null||Xn.origin.distanceToSquared(Aa)>(e.far-e.near)**2))&&(va.copy(r).invert(),Xn.copy(e.ray).applyMatrix4(va),!(n.boundingBox!==null&&Xn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Xn)))}_computeIntersections(e,t,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,h=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=h.length;g<v;g++){const m=h[g],f=o[m.materialIndex],b=Math.max(m.start,p.start),M=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let _=b,T=M;_<T;_+=3){const y=a.getX(_),C=a.getX(_+1),L=a.getX(_+2);s=Ds(this,f,e,n,l,u,d,y,C,L),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,p.start),v=Math.min(a.count,p.start+p.count);for(let m=g,f=v;m<f;m+=3){const b=a.getX(m),M=a.getX(m+1),_=a.getX(m+2);s=Ds(this,o,e,n,l,u,d,b,M,_),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,v=h.length;g<v;g++){const m=h[g],f=o[m.materialIndex],b=Math.max(m.start,p.start),M=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let _=b,T=M;_<T;_+=3){const y=_,C=_+1,L=_+2;s=Ds(this,f,e,n,l,u,d,y,C,L),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,p.start),v=Math.min(c.count,p.start+p.count);for(let m=g,f=v;m<f;m+=3){const b=m,M=m+1,_=m+2;s=Ds(this,o,e,n,l,u,d,b,M,_),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function rh(i,e,t,n,s,r,o,a){let c;if(e.side===Lt?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,e.side===Pn,a),c===null)return null;Rs.copy(a),Rs.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(Rs);return l<t.near||l>t.far?null:{distance:l,point:Rs.clone(),object:i}}function Ds(i,e,t,n,s,r,o,a,c,l){i.getVertexPosition(a,bs),i.getVertexPosition(c,ws),i.getVertexPosition(l,Ts);const u=rh(i,e,t,n,bs,ws,Ts,xa);if(u){const d=new G;$t.getBarycoord(xa,bs,ws,Ts,d),s&&(u.uv=$t.getInterpolatedAttribute(s,a,c,l,d,new Ke)),r&&(u.uv1=$t.getInterpolatedAttribute(r,a,c,l,d,new Ke)),o&&(u.normal=$t.getInterpolatedAttribute(o,a,c,l,d,new G),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const h={a,b:c,c:l,normal:new G,materialIndex:0};$t.getNormal(bs,ws,Ts,h.normal),u.face=h,u.barycoord=d}return u}class In extends un{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],u=[],d=[];let h=0,p=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new _n(l,3)),this.setAttribute("normal",new _n(u,3)),this.setAttribute("uv",new _n(d,2));function g(v,m,f,b,M,_,T,y,C,L,S){const x=_/C,D=T/L,k=_/2,F=T/2,V=y/2,X=C+1,B=L+1;let K=0,z=0;const ee=new G;for(let le=0;le<B;le++){const pe=le*D-F;for(let Ue=0;Ue<X;Ue++){const oe=Ue*x-k;ee[v]=oe*b,ee[m]=pe*M,ee[f]=V,l.push(ee.x,ee.y,ee.z),ee[v]=0,ee[m]=0,ee[f]=y>0?1:-1,u.push(ee.x,ee.y,ee.z),d.push(Ue/C),d.push(1-le/L),K+=1}}for(let le=0;le<L;le++)for(let pe=0;pe<C;pe++){const Ue=h+pe+X*le,oe=h+pe+X*(le+1),Le=h+(pe+1)+X*(le+1),He=h+(pe+1)+X*le;c.push(Ue,oe,He),c.push(oe,Le,He),z+=6}a.addGroup(p,z,S),p+=z,h+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new In(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ii(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function It(i){const e={};for(let t=0;t<i.length;t++){const n=Ii(i[t]);for(const s in n)e[s]=n[s]}return e}function oh(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Hl(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:$e.workingColorSpace}const ah={clone:Ii,merge:It};var lh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ch=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class An extends us{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=lh,this.fragmentShader=ch,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ii(e.uniforms),this.uniformsGroups=oh(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Wl extends Ft{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Et,this.projectionMatrix=new Et,this.projectionMatrixInverse=new Et,this.coordinateSystem=mn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const On=new G,Ea=new Ke,Sa=new Ke;class Zt extends Wl{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=rs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Zi*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return rs*2*Math.atan(Math.tan(Zi*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){On.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(On.x,On.y).multiplyScalar(-e/On.z),On.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(On.x,On.y).multiplyScalar(-e/On.z)}getViewSize(e,t){return this.getViewBounds(e,Ea,Sa),t.subVectors(Sa,Ea)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Zi*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const _i=-90,vi=1;class uh extends Ft{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Zt(_i,vi,e,t);s.layers=this.layers,this.add(s);const r=new Zt(_i,vi,e,t);r.layers=this.layers,this.add(r);const o=new Zt(_i,vi,e,t);o.layers=this.layers,this.add(o);const a=new Zt(_i,vi,e,t);a.layers=this.layers,this.add(a);const c=new Zt(_i,vi,e,t);c.layers=this.layers,this.add(c);const l=new Zt(_i,vi,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,c]=t;for(const l of t)this.remove(l);if(e===mn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Ks)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,u]=this.children,d=e.getRenderTarget(),h=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,s),e.render(t,u),e.setRenderTarget(d,h,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Xl extends kt{constructor(e=[],t=Di,n,s,r,o,a,c,l,u){super(e,t,n,s,r,o,a,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class dh extends ni{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Xl(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new In(5,5,5),r=new An({name:"CubemapFromEquirect",uniforms:Ii(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Lt,blending:zn});r.uniforms.tEquirect.value=t;const o=new wt(s,r),a=t.minFilter;return t.minFilter===ei&&(t.minFilter=cn),new uh(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}}class gn extends Ft{constructor(){super(),this.isGroup=!0,this.type="Group"}}const hh={type:"move"};class Dr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new gn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new gn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new gn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(const v of e.hand.values()){const m=t.getJointPose(v,n),f=this._getHandJoint(l,v);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const u=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],h=u.position.distanceTo(d.position),p=.02,g=.005;l.inputState.pinching&&h>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&h<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(hh)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new gn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Yl extends Ft{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Un,this.environmentIntensity=1,this.environmentRotation=new Un,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class fh{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Uo,this.updateRanges=[],this.version=0,this.uuid=Rn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Rn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Rn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ut=new G;class Js{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Ut.fromBufferAttribute(this,t),Ut.applyMatrix4(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ut.fromBufferAttribute(this,t),Ut.applyNormalMatrix(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ut.fromBufferAttribute(this,t),Ut.transformDirection(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=ln(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=st(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=ln(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=ln(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=ln(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=ln(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),n=st(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),n=st(n,this.array),s=st(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),n=st(n,this.array),s=st(s,this.array),r=st(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Tt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Js(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Ql extends us{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ye(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Ai;const Xi=new G,xi=new G,Ei=new G,Si=new Ke,Yi=new Ke,ql=new Et,Ps=new G,Qi=new G,Us=new G,Ma=new Ke,Pr=new Ke,ya=new Ke;class Kl extends Ft{constructor(e=new Ql){if(super(),this.isSprite=!0,this.type="Sprite",Ai===void 0){Ai=new un;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new fh(t,5);Ai.setIndex([0,1,2,0,2,3]),Ai.setAttribute("position",new Js(n,3,0,!1)),Ai.setAttribute("uv",new Js(n,2,3,!1))}this.geometry=Ai,this.material=e,this.center=new Ke(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),xi.setFromMatrixScale(this.matrixWorld),ql.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ei.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&xi.multiplyScalar(-Ei.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const o=this.center;Is(Ps.set(-.5,-.5,0),Ei,o,xi,s,r),Is(Qi.set(.5,-.5,0),Ei,o,xi,s,r),Is(Us.set(.5,.5,0),Ei,o,xi,s,r),Ma.set(0,0),Pr.set(1,0),ya.set(1,1);let a=e.ray.intersectTriangle(Ps,Qi,Us,!1,Xi);if(a===null&&(Is(Qi.set(-.5,.5,0),Ei,o,xi,s,r),Pr.set(0,1),a=e.ray.intersectTriangle(Ps,Us,Qi,!1,Xi),a===null))return;const c=e.ray.origin.distanceTo(Xi);c<e.near||c>e.far||t.push({distance:c,point:Xi.clone(),uv:$t.getInterpolation(Xi,Ps,Qi,Us,Ma,Pr,ya,new Ke),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Is(i,e,t,n,s,r){Si.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(Yi.x=r*Si.x-s*Si.y,Yi.y=s*Si.x+r*Si.y):Yi.copy(Si),i.copy(e),i.x+=Yi.x,i.y+=Yi.y,i.applyMatrix4(ql)}const Ur=new G,ph=new G,mh=new Ve;class Kn{constructor(e=new G(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=Ur.subVectors(n,t).cross(ph.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Ur),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||mh.getNormalMatrix(e),s=this.coplanarPoint(Ur).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Yn=new tr,gh=new Ke(.5,.5),Ls=new G;class jl{constructor(e=new Kn,t=new Kn,n=new Kn,s=new Kn,r=new Kn,o=new Kn){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=mn,n=!1){const s=this.planes,r=e.elements,o=r[0],a=r[1],c=r[2],l=r[3],u=r[4],d=r[5],h=r[6],p=r[7],g=r[8],v=r[9],m=r[10],f=r[11],b=r[12],M=r[13],_=r[14],T=r[15];if(s[0].setComponents(l-o,p-u,f-g,T-b).normalize(),s[1].setComponents(l+o,p+u,f+g,T+b).normalize(),s[2].setComponents(l+a,p+d,f+v,T+M).normalize(),s[3].setComponents(l-a,p-d,f-v,T-M).normalize(),n)s[4].setComponents(c,h,m,_).normalize(),s[5].setComponents(l-c,p-h,f-m,T-_).normalize();else if(s[4].setComponents(l-c,p-h,f-m,T-_).normalize(),t===mn)s[5].setComponents(l+c,p+h,f+m,T+_).normalize();else if(t===Ks)s[5].setComponents(c,h,m,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Yn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Yn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Yn)}intersectsSprite(e){Yn.center.set(0,0,0);const t=gh.distanceTo(e.center);return Yn.radius=.7071067811865476+t,Yn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Yn)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(Ls.x=s.normal.x>0?e.max.x:e.min.x,Ls.y=s.normal.y>0?e.max.y:e.min.y,Ls.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Ls)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Jl extends kt{constructor(e,t,n,s,r,o,a,c,l){super(e,t,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Zl extends kt{constructor(e,t,n=ti,s,r,o,a=Bt,c=Bt,l,u=is,d=1){if(u!==is&&u!==ss)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:e,height:t,depth:d};super(h,s,r,o,a,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Wo(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class $l extends kt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class ds extends un{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,o=t/2,a=Math.floor(n),c=Math.floor(s),l=a+1,u=c+1,d=e/a,h=t/c,p=[],g=[],v=[],m=[];for(let f=0;f<u;f++){const b=f*h-o;for(let M=0;M<l;M++){const _=M*d-r;g.push(_,-b,0),v.push(0,0,1),m.push(M/a),m.push(1-f/c)}}for(let f=0;f<c;f++)for(let b=0;b<a;b++){const M=b+l*f,_=b+l*(f+1),T=b+1+l*(f+1),y=b+1+l*f;p.push(M,_,y),p.push(_,T,y)}this.setIndex(p),this.setAttribute("position",new _n(g,3)),this.setAttribute("normal",new _n(v,3)),this.setAttribute("uv",new _n(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ds(e.width,e.height,e.widthSegments,e.heightSegments)}}class Yo extends un{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const u=[],d=new G,h=new G,p=[],g=[],v=[],m=[];for(let f=0;f<=n;f++){const b=[],M=f/n;let _=0;f===0&&o===0?_=.5/t:f===n&&c===Math.PI&&(_=-.5/t);for(let T=0;T<=t;T++){const y=T/t;d.x=-e*Math.cos(s+y*r)*Math.sin(o+M*a),d.y=e*Math.cos(o+M*a),d.z=e*Math.sin(s+y*r)*Math.sin(o+M*a),g.push(d.x,d.y,d.z),h.copy(d).normalize(),v.push(h.x,h.y,h.z),m.push(y+_,1-M),b.push(l++)}u.push(b)}for(let f=0;f<n;f++)for(let b=0;b<t;b++){const M=u[f][b+1],_=u[f][b],T=u[f+1][b],y=u[f+1][b+1];(f!==0||o>0)&&p.push(M,_,y),(f!==n-1||c<Math.PI)&&p.push(_,T,y)}this.setIndex(p),this.setAttribute("position",new _n(g,3)),this.setAttribute("normal",new _n(v,3)),this.setAttribute("uv",new _n(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Yo(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class _h extends us{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=hd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class vh extends us{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Ah extends Wl{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class xh extends Zt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}function ba(i,e,t,n){const s=Eh(n);switch(t){case Il:return i*e;case kl:return i*e/s.components*s.byteLength;case zo:return i*e/s.components*s.byteLength;case Nl:return i*e*2/s.components*s.byteLength;case Vo:return i*e*2/s.components*s.byteLength;case Ll:return i*e*3/s.components*s.byteLength;case en:return i*e*4/s.components*s.byteLength;case Go:return i*e*4/s.components*s.byteLength;case Gs:case Hs:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ws:case Xs:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case so:case oo:return Math.max(i,16)*Math.max(e,8)/4;case io:case ro:return Math.max(i,8)*Math.max(e,8)/2;case ao:case lo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case co:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case uo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ho:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case fo:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case po:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case mo:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case go:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case _o:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case vo:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ao:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case xo:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Eo:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case So:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Mo:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case yo:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case bo:case wo:case To:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Co:case Ro:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Do:case Po:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Eh(i){switch(i){case vn:case Rl:return{byteLength:1,components:1};case ts:case Dl:case as:return{byteLength:2,components:1};case Fo:case Oo:return{byteLength:2,components:4};case ti:case Bo:case Cn:return{byteLength:4,components:1};case Pl:case Ul:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:No}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=No);function ec(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Sh(i){const e=new WeakMap;function t(a,c){const l=a.array,u=a.usage,d=l.byteLength,h=i.createBuffer();i.bindBuffer(c,h),i.bufferData(c,l,u),a.onUploadCallback();let p;if(l instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)p=i.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=i.SHORT;else if(l instanceof Uint32Array)p=i.UNSIGNED_INT;else if(l instanceof Int32Array)p=i.INT;else if(l instanceof Int8Array)p=i.BYTE;else if(l instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,c,l){const u=c.array,d=c.updateRanges;if(i.bindBuffer(l,a),d.length===0)i.bufferSubData(l,0,u);else{d.sort((p,g)=>p.start-g.start);let h=0;for(let p=1;p<d.length;p++){const g=d[h],v=d[p];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++h,d[h]=v)}d.length=h+1;for(let p=0,g=d.length;p<g;p++){const v=d[p];i.bufferSubData(l,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=e.get(a);c&&(i.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var Mh=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,yh=`#ifdef USE_ALPHAHASH
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
#endif`,bh=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,wh=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Th=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ch=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Rh=`#ifdef USE_AOMAP
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
#endif`,Dh=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ph=`#ifdef USE_BATCHING
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
#endif`,Uh=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Ih=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Lh=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,kh=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Nh=`#ifdef USE_IRIDESCENCE
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
#endif`,Bh=`#ifdef USE_BUMPMAP
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
#endif`,Fh=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Oh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,zh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Vh=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Gh=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Hh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Wh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Xh=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Yh=`#define PI 3.141592653589793
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
} // validated`,Qh=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,qh=`vec3 transformedNormal = objectNormal;
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
#endif`,Kh=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,jh=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Jh=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Zh=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,$h="gl_FragColor = linearToOutputTexel( gl_FragColor );",ef=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,tf=`#ifdef USE_ENVMAP
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
#endif`,nf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,sf=`#ifdef USE_ENVMAP
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
#endif`,rf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,of=`#ifdef USE_ENVMAP
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
#endif`,af=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,lf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,cf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,uf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,df=`#ifdef USE_GRADIENTMAP
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
}`,hf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ff=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,pf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,mf=`uniform bool receiveShadow;
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
#endif`,gf=`#ifdef USE_ENVMAP
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
#endif`,_f=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,vf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Af=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,xf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ef=`PhysicalMaterial material;
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
#endif`,Sf=`struct PhysicalMaterial {
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
}`,Mf=`
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
#endif`,yf=`#if defined( RE_IndirectDiffuse )
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
#endif`,bf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,wf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Tf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Cf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Rf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Df=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Pf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Uf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,If=`#if defined( USE_POINTS_UV )
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
#endif`,Lf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,kf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Nf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Bf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ff=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Of=`#ifdef USE_MORPHTARGETS
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
#endif`,zf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Vf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Gf=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Hf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Wf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Xf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Yf=`#ifdef USE_NORMALMAP
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
#endif`,Qf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,qf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Kf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,jf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Jf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Zf=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,$f=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ep=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,tp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,np=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ip=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,sp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,rp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,op=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ap=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,lp=`float getShadowMask() {
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
}`,cp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,up=`#ifdef USE_SKINNING
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
#endif`,dp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,hp=`#ifdef USE_SKINNING
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
#endif`,fp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,pp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,mp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,gp=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,_p=`#ifdef USE_TRANSMISSION
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
#endif`,vp=`#ifdef USE_TRANSMISSION
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
#endif`,Ap=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ep=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Sp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Mp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,yp=`uniform sampler2D t2D;
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
}`,bp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,wp=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Tp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Cp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Rp=`#include <common>
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
}`,Dp=`#if DEPTH_PACKING == 3200
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
}`,Pp=`#define DISTANCE
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
}`,Up=`#define DISTANCE
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
}`,Ip=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Lp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kp=`uniform float scale;
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
}`,Np=`uniform vec3 diffuse;
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
}`,Bp=`#include <common>
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
}`,Fp=`uniform vec3 diffuse;
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
}`,Op=`#define LAMBERT
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
}`,zp=`#define LAMBERT
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
}`,Vp=`#define MATCAP
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
}`,Gp=`#define MATCAP
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
}`,Hp=`#define NORMAL
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
}`,Wp=`#define NORMAL
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
}`,Xp=`#define PHONG
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
}`,Yp=`#define PHONG
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
}`,Qp=`#define STANDARD
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
}`,qp=`#define STANDARD
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
}`,Kp=`#define TOON
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
}`,jp=`#define TOON
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
}`,Jp=`uniform float size;
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
}`,Zp=`uniform vec3 diffuse;
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
}`,$p=`#include <common>
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
}`,em=`uniform vec3 color;
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
}`,tm=`uniform float rotation;
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
}`,nm=`uniform vec3 diffuse;
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
}`,Ge={alphahash_fragment:Mh,alphahash_pars_fragment:yh,alphamap_fragment:bh,alphamap_pars_fragment:wh,alphatest_fragment:Th,alphatest_pars_fragment:Ch,aomap_fragment:Rh,aomap_pars_fragment:Dh,batching_pars_vertex:Ph,batching_vertex:Uh,begin_vertex:Ih,beginnormal_vertex:Lh,bsdfs:kh,iridescence_fragment:Nh,bumpmap_pars_fragment:Bh,clipping_planes_fragment:Fh,clipping_planes_pars_fragment:Oh,clipping_planes_pars_vertex:zh,clipping_planes_vertex:Vh,color_fragment:Gh,color_pars_fragment:Hh,color_pars_vertex:Wh,color_vertex:Xh,common:Yh,cube_uv_reflection_fragment:Qh,defaultnormal_vertex:qh,displacementmap_pars_vertex:Kh,displacementmap_vertex:jh,emissivemap_fragment:Jh,emissivemap_pars_fragment:Zh,colorspace_fragment:$h,colorspace_pars_fragment:ef,envmap_fragment:tf,envmap_common_pars_fragment:nf,envmap_pars_fragment:sf,envmap_pars_vertex:rf,envmap_physical_pars_fragment:gf,envmap_vertex:of,fog_vertex:af,fog_pars_vertex:lf,fog_fragment:cf,fog_pars_fragment:uf,gradientmap_pars_fragment:df,lightmap_pars_fragment:hf,lights_lambert_fragment:ff,lights_lambert_pars_fragment:pf,lights_pars_begin:mf,lights_toon_fragment:_f,lights_toon_pars_fragment:vf,lights_phong_fragment:Af,lights_phong_pars_fragment:xf,lights_physical_fragment:Ef,lights_physical_pars_fragment:Sf,lights_fragment_begin:Mf,lights_fragment_maps:yf,lights_fragment_end:bf,logdepthbuf_fragment:wf,logdepthbuf_pars_fragment:Tf,logdepthbuf_pars_vertex:Cf,logdepthbuf_vertex:Rf,map_fragment:Df,map_pars_fragment:Pf,map_particle_fragment:Uf,map_particle_pars_fragment:If,metalnessmap_fragment:Lf,metalnessmap_pars_fragment:kf,morphinstance_vertex:Nf,morphcolor_vertex:Bf,morphnormal_vertex:Ff,morphtarget_pars_vertex:Of,morphtarget_vertex:zf,normal_fragment_begin:Vf,normal_fragment_maps:Gf,normal_pars_fragment:Hf,normal_pars_vertex:Wf,normal_vertex:Xf,normalmap_pars_fragment:Yf,clearcoat_normal_fragment_begin:Qf,clearcoat_normal_fragment_maps:qf,clearcoat_pars_fragment:Kf,iridescence_pars_fragment:jf,opaque_fragment:Jf,packing:Zf,premultiplied_alpha_fragment:$f,project_vertex:ep,dithering_fragment:tp,dithering_pars_fragment:np,roughnessmap_fragment:ip,roughnessmap_pars_fragment:sp,shadowmap_pars_fragment:rp,shadowmap_pars_vertex:op,shadowmap_vertex:ap,shadowmask_pars_fragment:lp,skinbase_vertex:cp,skinning_pars_vertex:up,skinning_vertex:dp,skinnormal_vertex:hp,specularmap_fragment:fp,specularmap_pars_fragment:pp,tonemapping_fragment:mp,tonemapping_pars_fragment:gp,transmission_fragment:_p,transmission_pars_fragment:vp,uv_pars_fragment:Ap,uv_pars_vertex:xp,uv_vertex:Ep,worldpos_vertex:Sp,background_vert:Mp,background_frag:yp,backgroundCube_vert:bp,backgroundCube_frag:wp,cube_vert:Tp,cube_frag:Cp,depth_vert:Rp,depth_frag:Dp,distanceRGBA_vert:Pp,distanceRGBA_frag:Up,equirect_vert:Ip,equirect_frag:Lp,linedashed_vert:kp,linedashed_frag:Np,meshbasic_vert:Bp,meshbasic_frag:Fp,meshlambert_vert:Op,meshlambert_frag:zp,meshmatcap_vert:Vp,meshmatcap_frag:Gp,meshnormal_vert:Hp,meshnormal_frag:Wp,meshphong_vert:Xp,meshphong_frag:Yp,meshphysical_vert:Qp,meshphysical_frag:qp,meshtoon_vert:Kp,meshtoon_frag:jp,points_vert:Jp,points_frag:Zp,shadow_vert:$p,shadow_frag:em,sprite_vert:tm,sprite_frag:nm},de={common:{diffuse:{value:new Ye(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ve}},envmap:{envMap:{value:null},envMapRotation:{value:new Ve},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ve}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ve}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ve},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ve},normalScale:{value:new Ke(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ve},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ve}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ve}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ve}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ye(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ye(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0},uvTransform:{value:new Ve}},sprite:{diffuse:{value:new Ye(16777215)},opacity:{value:1},center:{value:new Ke(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}}},pn={basic:{uniforms:It([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.fog]),vertexShader:Ge.meshbasic_vert,fragmentShader:Ge.meshbasic_frag},lambert:{uniforms:It([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new Ye(0)}}]),vertexShader:Ge.meshlambert_vert,fragmentShader:Ge.meshlambert_frag},phong:{uniforms:It([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new Ye(0)},specular:{value:new Ye(1118481)},shininess:{value:30}}]),vertexShader:Ge.meshphong_vert,fragmentShader:Ge.meshphong_frag},standard:{uniforms:It([de.common,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.roughnessmap,de.metalnessmap,de.fog,de.lights,{emissive:{value:new Ye(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag},toon:{uniforms:It([de.common,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.gradientmap,de.fog,de.lights,{emissive:{value:new Ye(0)}}]),vertexShader:Ge.meshtoon_vert,fragmentShader:Ge.meshtoon_frag},matcap:{uniforms:It([de.common,de.bumpmap,de.normalmap,de.displacementmap,de.fog,{matcap:{value:null}}]),vertexShader:Ge.meshmatcap_vert,fragmentShader:Ge.meshmatcap_frag},points:{uniforms:It([de.points,de.fog]),vertexShader:Ge.points_vert,fragmentShader:Ge.points_frag},dashed:{uniforms:It([de.common,de.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ge.linedashed_vert,fragmentShader:Ge.linedashed_frag},depth:{uniforms:It([de.common,de.displacementmap]),vertexShader:Ge.depth_vert,fragmentShader:Ge.depth_frag},normal:{uniforms:It([de.common,de.bumpmap,de.normalmap,de.displacementmap,{opacity:{value:1}}]),vertexShader:Ge.meshnormal_vert,fragmentShader:Ge.meshnormal_frag},sprite:{uniforms:It([de.sprite,de.fog]),vertexShader:Ge.sprite_vert,fragmentShader:Ge.sprite_frag},background:{uniforms:{uvTransform:{value:new Ve},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ge.background_vert,fragmentShader:Ge.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ve}},vertexShader:Ge.backgroundCube_vert,fragmentShader:Ge.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ge.cube_vert,fragmentShader:Ge.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ge.equirect_vert,fragmentShader:Ge.equirect_frag},distanceRGBA:{uniforms:It([de.common,de.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ge.distanceRGBA_vert,fragmentShader:Ge.distanceRGBA_frag},shadow:{uniforms:It([de.lights,de.fog,{color:{value:new Ye(0)},opacity:{value:1}}]),vertexShader:Ge.shadow_vert,fragmentShader:Ge.shadow_frag}};pn.physical={uniforms:It([pn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ve},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ve},clearcoatNormalScale:{value:new Ke(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ve},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ve},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ve},sheen:{value:0},sheenColor:{value:new Ye(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ve},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ve},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ve},transmissionSamplerSize:{value:new Ke},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ve},attenuationDistance:{value:0},attenuationColor:{value:new Ye(0)},specularColor:{value:new Ye(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ve},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ve},anisotropyVector:{value:new Ke},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ve}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag};const ks={r:0,b:0,g:0},Qn=new Un,im=new Et;function sm(i,e,t,n,s,r,o){const a=new Ye(0);let c=r===!0?0:1,l,u,d=null,h=0,p=null;function g(M){let _=M.isScene===!0?M.background:null;return _&&_.isTexture&&(_=(M.backgroundBlurriness>0?t:e).get(_)),_}function v(M){let _=!1;const T=g(M);T===null?f(a,c):T&&T.isColor&&(f(T,1),_=!0);const y=i.xr.getEnvironmentBlendMode();y==="additive"?n.buffers.color.setClear(0,0,0,1,o):y==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(M,_){const T=g(_);T&&(T.isCubeTexture||T.mapping===er)?(u===void 0&&(u=new wt(new In(1,1,1),new An({name:"BackgroundCubeMaterial",uniforms:Ii(pn.backgroundCube.uniforms),vertexShader:pn.backgroundCube.vertexShader,fragmentShader:pn.backgroundCube.fragmentShader,side:Lt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(y,C,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),Qn.copy(_.backgroundRotation),Qn.x*=-1,Qn.y*=-1,Qn.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(Qn.y*=-1,Qn.z*=-1),u.material.uniforms.envMap.value=T,u.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(im.makeRotationFromEuler(Qn)),u.material.toneMapped=$e.getTransfer(T.colorSpace)!==at,(d!==T||h!==T.version||p!==i.toneMapping)&&(u.material.needsUpdate=!0,d=T,h=T.version,p=i.toneMapping),u.layers.enableAll(),M.unshift(u,u.geometry,u.material,0,0,null)):T&&T.isTexture&&(l===void 0&&(l=new wt(new ds(2,2),new An({name:"BackgroundMaterial",uniforms:Ii(pn.background.uniforms),vertexShader:pn.background.vertexShader,fragmentShader:pn.background.fragmentShader,side:Pn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=T,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=$e.getTransfer(T.colorSpace)!==at,T.matrixAutoUpdate===!0&&T.updateMatrix(),l.material.uniforms.uvTransform.value.copy(T.matrix),(d!==T||h!==T.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,d=T,h=T.version,p=i.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function f(M,_){M.getRGB(ks,Hl(i)),n.buffers.color.setClear(ks.r,ks.g,ks.b,_,o)}function b(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,_=1){a.set(M),c=_,f(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(M){c=M,f(a,c)},render:v,addToRenderList:m,dispose:b}}function rm(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=h(null);let r=s,o=!1;function a(x,D,k,F,V){let X=!1;const B=d(F,k,D);r!==B&&(r=B,l(r.object)),X=p(x,F,k,V),X&&g(x,F,k,V),V!==null&&e.update(V,i.ELEMENT_ARRAY_BUFFER),(X||o)&&(o=!1,_(x,D,k,F),V!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function c(){return i.createVertexArray()}function l(x){return i.bindVertexArray(x)}function u(x){return i.deleteVertexArray(x)}function d(x,D,k){const F=k.wireframe===!0;let V=n[x.id];V===void 0&&(V={},n[x.id]=V);let X=V[D.id];X===void 0&&(X={},V[D.id]=X);let B=X[F];return B===void 0&&(B=h(c()),X[F]=B),B}function h(x){const D=[],k=[],F=[];for(let V=0;V<t;V++)D[V]=0,k[V]=0,F[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:k,attributeDivisors:F,object:x,attributes:{},index:null}}function p(x,D,k,F){const V=r.attributes,X=D.attributes;let B=0;const K=k.getAttributes();for(const z in K)if(K[z].location>=0){const le=V[z];let pe=X[z];if(pe===void 0&&(z==="instanceMatrix"&&x.instanceMatrix&&(pe=x.instanceMatrix),z==="instanceColor"&&x.instanceColor&&(pe=x.instanceColor)),le===void 0||le.attribute!==pe||pe&&le.data!==pe.data)return!0;B++}return r.attributesNum!==B||r.index!==F}function g(x,D,k,F){const V={},X=D.attributes;let B=0;const K=k.getAttributes();for(const z in K)if(K[z].location>=0){let le=X[z];le===void 0&&(z==="instanceMatrix"&&x.instanceMatrix&&(le=x.instanceMatrix),z==="instanceColor"&&x.instanceColor&&(le=x.instanceColor));const pe={};pe.attribute=le,le&&le.data&&(pe.data=le.data),V[z]=pe,B++}r.attributes=V,r.attributesNum=B,r.index=F}function v(){const x=r.newAttributes;for(let D=0,k=x.length;D<k;D++)x[D]=0}function m(x){f(x,0)}function f(x,D){const k=r.newAttributes,F=r.enabledAttributes,V=r.attributeDivisors;k[x]=1,F[x]===0&&(i.enableVertexAttribArray(x),F[x]=1),V[x]!==D&&(i.vertexAttribDivisor(x,D),V[x]=D)}function b(){const x=r.newAttributes,D=r.enabledAttributes;for(let k=0,F=D.length;k<F;k++)D[k]!==x[k]&&(i.disableVertexAttribArray(k),D[k]=0)}function M(x,D,k,F,V,X,B){B===!0?i.vertexAttribIPointer(x,D,k,V,X):i.vertexAttribPointer(x,D,k,F,V,X)}function _(x,D,k,F){v();const V=F.attributes,X=k.getAttributes(),B=D.defaultAttributeValues;for(const K in X){const z=X[K];if(z.location>=0){let ee=V[K];if(ee===void 0&&(K==="instanceMatrix"&&x.instanceMatrix&&(ee=x.instanceMatrix),K==="instanceColor"&&x.instanceColor&&(ee=x.instanceColor)),ee!==void 0){const le=ee.normalized,pe=ee.itemSize,Ue=e.get(ee);if(Ue===void 0)continue;const oe=Ue.buffer,Le=Ue.type,He=Ue.bytesPerElement,Y=Le===i.INT||Le===i.UNSIGNED_INT||ee.gpuType===Bo;if(ee.isInterleavedBufferAttribute){const j=ee.data,fe=j.stride,xe=ee.offset;if(j.isInstancedInterleavedBuffer){for(let ye=0;ye<z.locationSize;ye++)f(z.location+ye,j.meshPerAttribute);x.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let ye=0;ye<z.locationSize;ye++)m(z.location+ye);i.bindBuffer(i.ARRAY_BUFFER,oe);for(let ye=0;ye<z.locationSize;ye++)M(z.location+ye,pe/z.locationSize,Le,le,fe*He,(xe+pe/z.locationSize*ye)*He,Y)}else{if(ee.isInstancedBufferAttribute){for(let j=0;j<z.locationSize;j++)f(z.location+j,ee.meshPerAttribute);x.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let j=0;j<z.locationSize;j++)m(z.location+j);i.bindBuffer(i.ARRAY_BUFFER,oe);for(let j=0;j<z.locationSize;j++)M(z.location+j,pe/z.locationSize,Le,le,pe*He,pe/z.locationSize*j*He,Y)}}else if(B!==void 0){const le=B[K];if(le!==void 0)switch(le.length){case 2:i.vertexAttrib2fv(z.location,le);break;case 3:i.vertexAttrib3fv(z.location,le);break;case 4:i.vertexAttrib4fv(z.location,le);break;default:i.vertexAttrib1fv(z.location,le)}}}}b()}function T(){L();for(const x in n){const D=n[x];for(const k in D){const F=D[k];for(const V in F)u(F[V].object),delete F[V];delete D[k]}delete n[x]}}function y(x){if(n[x.id]===void 0)return;const D=n[x.id];for(const k in D){const F=D[k];for(const V in F)u(F[V].object),delete F[V];delete D[k]}delete n[x.id]}function C(x){for(const D in n){const k=n[D];if(k[x.id]===void 0)continue;const F=k[x.id];for(const V in F)u(F[V].object),delete F[V];delete k[x.id]}}function L(){S(),o=!0,r!==s&&(r=s,l(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:L,resetDefaultState:S,dispose:T,releaseStatesOfGeometry:y,releaseStatesOfProgram:C,initAttributes:v,enableAttribute:m,disableUnusedAttributes:b}}function om(i,e,t){let n;function s(l){n=l}function r(l,u){i.drawArrays(n,l,u),t.update(u,n,1)}function o(l,u,d){d!==0&&(i.drawArraysInstanced(n,l,u,d),t.update(u,n,d))}function a(l,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,u,0,d);let p=0;for(let g=0;g<d;g++)p+=u[g];t.update(p,n,1)}function c(l,u,d,h){if(d===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<l.length;g++)o(l[g],u[g],h[g]);else{p.multiDrawArraysInstancedWEBGL(n,l,0,u,0,h,0,d);let g=0;for(let v=0;v<d;v++)g+=u[v]*h[v];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function am(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(C){return!(C!==en&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){const L=C===as&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==vn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==Cn&&!L)}function c(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const u=c(l);u!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const d=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),b=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),T=g>0,y=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:h,maxTextures:p,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:b,maxVaryings:M,maxFragmentUniforms:_,vertexTextures:T,maxSamples:y}}function lm(i){const e=this;let t=null,n=0,s=!1,r=!1;const o=new Kn,a=new Ve,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){const p=d.length!==0||h||n!==0||s;return s=h,n=d.length,p},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,h){t=u(d,h,0)},this.setState=function(d,h,p){const g=d.clippingPlanes,v=d.clipIntersection,m=d.clipShadows,f=i.get(d);if(!s||g===null||g.length===0||r&&!m)r?u(null):l();else{const b=r?0:n,M=b*4;let _=f.clippingState||null;c.value=_,_=u(g,h,M,p);for(let T=0;T!==M;++T)_[T]=t[T];f.clippingState=_,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=b}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(d,h,p,g){const v=d!==null?d.length:0;let m=null;if(v!==0){if(m=c.value,g!==!0||m===null){const f=p+v*4,b=h.matrixWorldInverse;a.getNormalMatrix(b),(m===null||m.length<f)&&(m=new Float32Array(f));for(let M=0,_=p;M!==v;++M,_+=4)o.copy(d[M]).applyMatrix4(b,a),o.normal.toArray(m,_),m[_+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function cm(i){let e=new WeakMap;function t(o,a){return a===eo?o.mapping=Di:a===to&&(o.mapping=Pi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===eo||a===to)if(e.has(o)){const c=e.get(o).texture;return t(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new dh(c.height);return l.fromEquirectangularTexture(i,o),e.set(o,l),o.addEventListener("dispose",s),t(l.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const bi=4,wa=[.125,.215,.35,.446,.526,.582],Zn=20,Ir=new Ah,Ta=new Ye;let Lr=null,kr=0,Nr=0,Br=!1;const jn=(1+Math.sqrt(5))/2,Mi=1/jn,Ca=[new G(-jn,Mi,0),new G(jn,Mi,0),new G(-Mi,0,jn),new G(Mi,0,jn),new G(0,jn,-Mi),new G(0,jn,Mi),new G(-1,1,-1),new G(1,1,-1),new G(-1,1,1),new G(1,1,1)],um=new G;class Ra{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){const{size:o=256,position:a=um}=r;Lr=this._renderer.getRenderTarget(),kr=this._renderer.getActiveCubeFace(),Nr=this._renderer.getActiveMipmapLevel(),Br=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,a),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ua(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Pa(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Lr,kr,Nr),this._renderer.xr.enabled=Br,e.scissorTest=!1,Ns(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Di||e.mapping===Pi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Lr=this._renderer.getRenderTarget(),kr=this._renderer.getActiveCubeFace(),Nr=this._renderer.getActiveMipmapLevel(),Br=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:cn,minFilter:cn,generateMipmaps:!1,type:as,format:en,colorSpace:Ui,depthBuffer:!1},s=Da(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Da(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=dm(r)),this._blurMaterial=hm(r,e,t)}return s}_compileMaterial(e){const t=new wt(this._lodPlanes[0],e);this._renderer.compile(t,Ir)}_sceneToCubeUV(e,t,n,s,r){const c=new Zt(90,1,t,n),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,p=d.toneMapping;d.getClearColor(Ta),d.toneMapping=Vn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null));const v=new ii({name:"PMREM.Background",side:Lt,depthWrite:!1,depthTest:!1}),m=new wt(new In,v);let f=!1;const b=e.background;b?b.isColor&&(v.color.copy(b),e.background=null,f=!0):(v.color.copy(Ta),f=!0);for(let M=0;M<6;M++){const _=M%3;_===0?(c.up.set(0,l[M],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+u[M],r.y,r.z)):_===1?(c.up.set(0,0,l[M]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+u[M],r.z)):(c.up.set(0,l[M],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+u[M]));const T=this._cubeSize;Ns(s,_*T,M>2?T:0,T,T),d.setRenderTarget(s),f&&d.render(m,c),d.render(e,c)}m.geometry.dispose(),m.material.dispose(),d.toneMapping=p,d.autoClear=h,e.background=b}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Di||e.mapping===Pi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ua()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Pa());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new wt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const c=this._cubeSize;Ns(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,Ir)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Ca[(s-r-1)%Ca.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,d=new wt(this._lodPlanes[s],l),h=l.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Zn-1),v=r/g,m=isFinite(r)?1+Math.floor(u*v):Zn;m>Zn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Zn}`);const f=[];let b=0;for(let C=0;C<Zn;++C){const L=C/v,S=Math.exp(-L*L/2);f.push(S),C===0?b+=S:C<m&&(b+=2*S)}for(let C=0;C<f.length;C++)f[C]=f[C]/b;h.envMap.value=e.texture,h.samples.value=m,h.weights.value=f,h.latitudinal.value=o==="latitudinal",a&&(h.poleAxis.value=a);const{_lodMax:M}=this;h.dTheta.value=g,h.mipInt.value=M-n;const _=this._sizeLods[s],T=3*_*(s>M-bi?s-M+bi:0),y=4*(this._cubeSize-_);Ns(t,T,y,3*_,2*_),c.setRenderTarget(t),c.render(d,Ir)}}function dm(i){const e=[],t=[],n=[];let s=i;const r=i-bi+1+wa.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);t.push(a);let c=1/a;o>i-bi?c=wa[o-i+bi-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),u=-l,d=1+l,h=[u,u,d,u,d,d,u,u,d,d,u,d],p=6,g=6,v=3,m=2,f=1,b=new Float32Array(v*g*p),M=new Float32Array(m*g*p),_=new Float32Array(f*g*p);for(let y=0;y<p;y++){const C=y%3*2/3-1,L=y>2?0:-1,S=[C,L,0,C+2/3,L,0,C+2/3,L+1,0,C,L,0,C+2/3,L+1,0,C,L+1,0];b.set(S,v*g*y),M.set(h,m*g*y);const x=[y,y,y,y,y,y];_.set(x,f*g*y)}const T=new un;T.setAttribute("position",new Tt(b,v)),T.setAttribute("uv",new Tt(M,m)),T.setAttribute("faceIndex",new Tt(_,f)),e.push(T),s>bi&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Da(i,e,t){const n=new ni(i,e,t);return n.texture.mapping=er,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ns(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function hm(i,e,t){const n=new Float32Array(Zn),s=new G(0,1,0);return new An({name:"SphericalGaussianBlur",defines:{n:Zn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Qo(),fragmentShader:`

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
		`,blending:zn,depthTest:!1,depthWrite:!1})}function Pa(){return new An({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Qo(),fragmentShader:`

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
		`,blending:zn,depthTest:!1,depthWrite:!1})}function Ua(){return new An({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Qo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:zn,depthTest:!1,depthWrite:!1})}function Qo(){return`

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
	`}function fm(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===eo||c===to,u=c===Di||c===Pi;if(l||u){let d=e.get(a);const h=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==h)return t===null&&(t=new Ra(i)),d=l?t.fromEquirectangular(a,d):t.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),d.texture;if(d!==void 0)return d.texture;{const p=a.image;return l&&p&&p.height>0||u&&p&&s(p)?(t===null&&(t=new Ra(i)),d=l?t.fromEquirectangular(a):t.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),a.addEventListener("dispose",r),d.texture):null}}}return a}function s(a){let c=0;const l=6;for(let u=0;u<l;u++)a[u]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function pm(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&os("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function mm(i,e,t,n){const s={},r=new WeakMap;function o(d){const h=d.target;h.index!==null&&e.remove(h.index);for(const g in h.attributes)e.remove(h.attributes[g]);h.removeEventListener("dispose",o),delete s[h.id];const p=r.get(h);p&&(e.remove(p),r.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function a(d,h){return s[h.id]===!0||(h.addEventListener("dispose",o),s[h.id]=!0,t.memory.geometries++),h}function c(d){const h=d.attributes;for(const p in h)e.update(h[p],i.ARRAY_BUFFER)}function l(d){const h=[],p=d.index,g=d.attributes.position;let v=0;if(p!==null){const b=p.array;v=p.version;for(let M=0,_=b.length;M<_;M+=3){const T=b[M+0],y=b[M+1],C=b[M+2];h.push(T,y,y,C,C,T)}}else if(g!==void 0){const b=g.array;v=g.version;for(let M=0,_=b.length/3-1;M<_;M+=3){const T=M+0,y=M+1,C=M+2;h.push(T,y,y,C,C,T)}}else return;const m=new(Fl(h)?Gl:Vl)(h,1);m.version=v;const f=r.get(d);f&&e.remove(f),r.set(d,m)}function u(d){const h=r.get(d);if(h){const p=d.index;p!==null&&h.version<p.version&&l(d)}else l(d);return r.get(d)}return{get:a,update:c,getWireframeAttribute:u}}function gm(i,e,t){let n;function s(h){n=h}let r,o;function a(h){r=h.type,o=h.bytesPerElement}function c(h,p){i.drawElements(n,p,r,h*o),t.update(p,n,1)}function l(h,p,g){g!==0&&(i.drawElementsInstanced(n,p,r,h*o,g),t.update(p,n,g))}function u(h,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,h,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];t.update(m,n,1)}function d(h,p,g,v){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<h.length;f++)l(h[f]/o,p[f],v[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,h,0,v,0,g);let f=0;for(let b=0;b<g;b++)f+=p[b]*v[b];t.update(f,n,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function _m(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function vm(i,e,t){const n=new WeakMap,s=new At;function r(o,a,c){const l=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=u!==void 0?u.length:0;let h=n.get(a);if(h===void 0||h.count!==d){let S=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",S)};h!==void 0&&h.texture.dispose();const p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],b=a.morphAttributes.color||[];let M=0;p===!0&&(M=1),g===!0&&(M=2),v===!0&&(M=3);let _=a.attributes.position.count*M,T=1;_>e.maxTextureSize&&(T=Math.ceil(_/e.maxTextureSize),_=e.maxTextureSize);const y=new Float32Array(_*T*4*d),C=new Xo(y,_,T,d);C.type=Cn,C.needsUpdate=!0;const L=M*4;for(let x=0;x<d;x++){const D=m[x],k=f[x],F=b[x],V=_*T*4*x;for(let X=0;X<D.count;X++){const B=X*L;p===!0&&(s.fromBufferAttribute(D,X),y[V+B+0]=s.x,y[V+B+1]=s.y,y[V+B+2]=s.z,y[V+B+3]=0),g===!0&&(s.fromBufferAttribute(k,X),y[V+B+4]=s.x,y[V+B+5]=s.y,y[V+B+6]=s.z,y[V+B+7]=0),v===!0&&(s.fromBufferAttribute(F,X),y[V+B+8]=s.x,y[V+B+9]=s.y,y[V+B+10]=s.z,y[V+B+11]=F.itemSize===4?s.w:1)}}h={count:d,texture:C,size:new Ke(_,T)},n.set(a,h),a.addEventListener("dispose",S)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let p=0;for(let v=0;v<l.length;v++)p+=l[v];const g=a.morphTargetsRelative?1:1-p;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:r}}function Am(i,e,t,n){let s=new WeakMap;function r(c){const l=n.render.frame,u=c.geometry,d=e.get(c,u);if(s.get(d)!==l&&(e.update(d),s.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const h=c.skeleton;s.get(h)!==l&&(h.update(),s.set(h,l))}return d}function o(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:o}}const tc=new kt,Ia=new Zl(1,1),nc=new Xo,ic=new Qd,sc=new Xl,La=[],ka=[],Na=new Float32Array(16),Ba=new Float32Array(9),Fa=new Float32Array(4);function ki(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=La[s];if(r===void 0&&(r=new Float32Array(s),La[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function St(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Mt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function nr(i,e){let t=ka[e];t===void 0&&(t=new Int32Array(e),ka[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function xm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Em(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(St(t,e))return;i.uniform2fv(this.addr,e),Mt(t,e)}}function Sm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(St(t,e))return;i.uniform3fv(this.addr,e),Mt(t,e)}}function Mm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(St(t,e))return;i.uniform4fv(this.addr,e),Mt(t,e)}}function ym(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(St(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Mt(t,e)}else{if(St(t,n))return;Fa.set(n),i.uniformMatrix2fv(this.addr,!1,Fa),Mt(t,n)}}function bm(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(St(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Mt(t,e)}else{if(St(t,n))return;Ba.set(n),i.uniformMatrix3fv(this.addr,!1,Ba),Mt(t,n)}}function wm(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(St(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Mt(t,e)}else{if(St(t,n))return;Na.set(n),i.uniformMatrix4fv(this.addr,!1,Na),Mt(t,n)}}function Tm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Cm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(St(t,e))return;i.uniform2iv(this.addr,e),Mt(t,e)}}function Rm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(St(t,e))return;i.uniform3iv(this.addr,e),Mt(t,e)}}function Dm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(St(t,e))return;i.uniform4iv(this.addr,e),Mt(t,e)}}function Pm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Um(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(St(t,e))return;i.uniform2uiv(this.addr,e),Mt(t,e)}}function Im(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(St(t,e))return;i.uniform3uiv(this.addr,e),Mt(t,e)}}function Lm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(St(t,e))return;i.uniform4uiv(this.addr,e),Mt(t,e)}}function km(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Ia.compareFunction=Bl,r=Ia):r=tc,t.setTexture2D(e||r,s)}function Nm(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||ic,s)}function Bm(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||sc,s)}function Fm(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||nc,s)}function Om(i){switch(i){case 5126:return xm;case 35664:return Em;case 35665:return Sm;case 35666:return Mm;case 35674:return ym;case 35675:return bm;case 35676:return wm;case 5124:case 35670:return Tm;case 35667:case 35671:return Cm;case 35668:case 35672:return Rm;case 35669:case 35673:return Dm;case 5125:return Pm;case 36294:return Um;case 36295:return Im;case 36296:return Lm;case 35678:case 36198:case 36298:case 36306:case 35682:return km;case 35679:case 36299:case 36307:return Nm;case 35680:case 36300:case 36308:case 36293:return Bm;case 36289:case 36303:case 36311:case 36292:return Fm}}function zm(i,e){i.uniform1fv(this.addr,e)}function Vm(i,e){const t=ki(e,this.size,2);i.uniform2fv(this.addr,t)}function Gm(i,e){const t=ki(e,this.size,3);i.uniform3fv(this.addr,t)}function Hm(i,e){const t=ki(e,this.size,4);i.uniform4fv(this.addr,t)}function Wm(i,e){const t=ki(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Xm(i,e){const t=ki(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Ym(i,e){const t=ki(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Qm(i,e){i.uniform1iv(this.addr,e)}function qm(i,e){i.uniform2iv(this.addr,e)}function Km(i,e){i.uniform3iv(this.addr,e)}function jm(i,e){i.uniform4iv(this.addr,e)}function Jm(i,e){i.uniform1uiv(this.addr,e)}function Zm(i,e){i.uniform2uiv(this.addr,e)}function $m(i,e){i.uniform3uiv(this.addr,e)}function eg(i,e){i.uniform4uiv(this.addr,e)}function tg(i,e,t){const n=this.cache,s=e.length,r=nr(t,s);St(n,r)||(i.uniform1iv(this.addr,r),Mt(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||tc,r[o])}function ng(i,e,t){const n=this.cache,s=e.length,r=nr(t,s);St(n,r)||(i.uniform1iv(this.addr,r),Mt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||ic,r[o])}function ig(i,e,t){const n=this.cache,s=e.length,r=nr(t,s);St(n,r)||(i.uniform1iv(this.addr,r),Mt(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||sc,r[o])}function sg(i,e,t){const n=this.cache,s=e.length,r=nr(t,s);St(n,r)||(i.uniform1iv(this.addr,r),Mt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||nc,r[o])}function rg(i){switch(i){case 5126:return zm;case 35664:return Vm;case 35665:return Gm;case 35666:return Hm;case 35674:return Wm;case 35675:return Xm;case 35676:return Ym;case 5124:case 35670:return Qm;case 35667:case 35671:return qm;case 35668:case 35672:return Km;case 35669:case 35673:return jm;case 5125:return Jm;case 36294:return Zm;case 36295:return $m;case 36296:return eg;case 35678:case 36198:case 36298:case 36306:case 35682:return tg;case 35679:case 36299:case 36307:return ng;case 35680:case 36300:case 36308:case 36293:return ig;case 36289:case 36303:case 36311:case 36292:return sg}}class og{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Om(t.type)}}class ag{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=rg(t.type)}}class lg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(e,t[a.id],n)}}}const Fr=/(\w+)(\])?(\[|\.)?/g;function Oa(i,e){i.seq.push(e),i.map[e.id]=e}function cg(i,e,t){const n=i.name,s=n.length;for(Fr.lastIndex=0;;){const r=Fr.exec(n),o=Fr.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){Oa(t,l===void 0?new og(a,i,e):new ag(a,i,e));break}else{let d=t.map[a];d===void 0&&(d=new lg(a),Oa(t,d)),t=d}}}class Ys{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);cg(r,o,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){const a=t[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const o=e[s];o.id in t&&n.push(o)}return n}}function za(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const ug=37297;let dg=0;function hg(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}const Va=new Ve;function fg(i){$e._getMatrix(Va,$e.workingColorSpace,i);const e=`mat3( ${Va.elements.map(t=>t.toFixed(4))} )`;switch($e.getTransfer(i)){case Qs:return[e,"LinearTransferOETF"];case at:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Ga(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+hg(i.getShaderSource(e),a)}else return r}function pg(i,e){const t=fg(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function mg(i,e){let t;switch(e){case sd:t="Linear";break;case rd:t="Reinhard";break;case od:t="Cineon";break;case ad:t="ACESFilmic";break;case cd:t="AgX";break;case ud:t="Neutral";break;case ld:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Bs=new G;function gg(){$e.getLuminanceCoefficients(Bs);const i=Bs.x.toFixed(4),e=Bs.y.toFixed(4),t=Bs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function _g(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ji).join(`
`)}function vg(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Ag(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function ji(i){return i!==""}function Ha(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Wa(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const xg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Io(i){return i.replace(xg,Sg)}const Eg=new Map;function Sg(i,e){let t=Ge[e];if(t===void 0){const n=Eg.get(e);if(n!==void 0)t=Ge[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Io(t)}const Mg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Xa(i){return i.replace(Mg,yg)}function yg(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Ya(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function bg(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===wl?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Bu?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===wn&&(e="SHADOWMAP_TYPE_VSM"),e}function wg(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Di:case Pi:e="ENVMAP_TYPE_CUBE";break;case er:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Tg(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Pi&&(e="ENVMAP_MODE_REFRACTION"),e}function Cg(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Tl:e="ENVMAP_BLENDING_MULTIPLY";break;case nd:e="ENVMAP_BLENDING_MIX";break;case id:e="ENVMAP_BLENDING_ADD";break}return e}function Rg(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Dg(i,e,t,n){const s=i.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const c=bg(t),l=wg(t),u=Tg(t),d=Cg(t),h=Rg(t),p=_g(t),g=vg(r),v=s.createProgram();let m,f,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ji).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ji).join(`
`),f.length>0&&(f+=`
`)):(m=[Ya(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ji).join(`
`),f=[Ya(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Vn?"#define TONE_MAPPING":"",t.toneMapping!==Vn?Ge.tonemapping_pars_fragment:"",t.toneMapping!==Vn?mg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ge.colorspace_pars_fragment,pg("linearToOutputTexel",t.outputColorSpace),gg(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ji).join(`
`)),o=Io(o),o=Ha(o,t),o=Wa(o,t),a=Io(a),a=Ha(a,t),a=Wa(a,t),o=Xa(o),a=Xa(a),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===qs?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===qs?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const M=b+m+o,_=b+f+a,T=za(s,s.VERTEX_SHADER,M),y=za(s,s.FRAGMENT_SHADER,_);s.attachShader(v,T),s.attachShader(v,y),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function C(D){if(i.debug.checkShaderErrors){const k=s.getProgramInfoLog(v)||"",F=s.getShaderInfoLog(T)||"",V=s.getShaderInfoLog(y)||"",X=k.trim(),B=F.trim(),K=V.trim();let z=!0,ee=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(z=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,T,y);else{const le=Ga(s,T,"vertex"),pe=Ga(s,y,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+X+`
`+le+`
`+pe)}else X!==""?console.warn("THREE.WebGLProgram: Program Info Log:",X):(B===""||K==="")&&(ee=!1);ee&&(D.diagnostics={runnable:z,programLog:X,vertexShader:{log:B,prefix:m},fragmentShader:{log:K,prefix:f}})}s.deleteShader(T),s.deleteShader(y),L=new Ys(s,v),S=Ag(s,v)}let L;this.getUniforms=function(){return L===void 0&&C(this),L};let S;this.getAttributes=function(){return S===void 0&&C(this),S};let x=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=s.getProgramParameter(v,ug)),x},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=dg++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=T,this.fragmentShader=y,this}let Pg=0;class Ug{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Ig(e),t.set(e,n)),n}}class Ig{constructor(e){this.id=Pg++,this.code=e,this.usedTimes=0}}function Lg(i,e,t,n,s,r,o){const a=new Ol,c=new Ug,l=new Set,u=[],d=s.logarithmicDepthBuffer,h=s.vertexTextures;let p=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(S){return l.add(S),S===0?"uv":`uv${S}`}function m(S,x,D,k,F){const V=k.fog,X=F.geometry,B=S.isMeshStandardMaterial?k.environment:null,K=(S.isMeshStandardMaterial?t:e).get(S.envMap||B),z=K&&K.mapping===er?K.image.height:null,ee=g[S.type];S.precision!==null&&(p=s.getMaxPrecision(S.precision),p!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",p,"instead."));const le=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,pe=le!==void 0?le.length:0;let Ue=0;X.morphAttributes.position!==void 0&&(Ue=1),X.morphAttributes.normal!==void 0&&(Ue=2),X.morphAttributes.color!==void 0&&(Ue=3);let oe,Le,He,Y;if(ee){const je=pn[ee];oe=je.vertexShader,Le=je.fragmentShader}else oe=S.vertexShader,Le=S.fragmentShader,c.update(S),He=c.getVertexShaderID(S),Y=c.getFragmentShaderID(S);const j=i.getRenderTarget(),fe=i.state.buffers.depth.getReversed(),xe=F.isInstancedMesh===!0,ye=F.isBatchedMesh===!0,We=!!S.map,yt=!!S.matcap,R=!!K,tt=!!S.aoMap,Fe=!!S.lightMap,De=!!S.bumpMap,ve=!!S.normalMap,Je=!!S.displacementMap,Ee=!!S.emissiveMap,ke=!!S.metalnessMap,gt=!!S.roughnessMap,lt=S.anisotropy>0,w=S.clearcoat>0,A=S.dispersion>0,O=S.iridescence>0,q=S.sheen>0,J=S.transmission>0,Q=lt&&!!S.anisotropyMap,Te=w&&!!S.clearcoatMap,se=w&&!!S.clearcoatNormalMap,be=w&&!!S.clearcoatRoughnessMap,Se=O&&!!S.iridescenceMap,re=O&&!!S.iridescenceThicknessMap,ue=q&&!!S.sheenColorMap,Re=q&&!!S.sheenRoughnessMap,we=!!S.specularMap,ce=!!S.specularColorMap,Oe=!!S.specularIntensityMap,P=J&&!!S.transmissionMap,ie=J&&!!S.thicknessMap,ae=!!S.gradientMap,ge=!!S.alphaMap,ne=S.alphaTest>0,Z=!!S.alphaHash,Me=!!S.extensions;let Ne=Vn;S.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(Ne=i.toneMapping);const nt={shaderID:ee,shaderType:S.type,shaderName:S.name,vertexShader:oe,fragmentShader:Le,defines:S.defines,customVertexShaderID:He,customFragmentShaderID:Y,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:p,batching:ye,batchingColor:ye&&F._colorsTexture!==null,instancing:xe,instancingColor:xe&&F.instanceColor!==null,instancingMorph:xe&&F.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:j===null?i.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:Ui,alphaToCoverage:!!S.alphaToCoverage,map:We,matcap:yt,envMap:R,envMapMode:R&&K.mapping,envMapCubeUVHeight:z,aoMap:tt,lightMap:Fe,bumpMap:De,normalMap:ve,displacementMap:h&&Je,emissiveMap:Ee,normalMapObjectSpace:ve&&S.normalMapType===md,normalMapTangentSpace:ve&&S.normalMapType===pd,metalnessMap:ke,roughnessMap:gt,anisotropy:lt,anisotropyMap:Q,clearcoat:w,clearcoatMap:Te,clearcoatNormalMap:se,clearcoatRoughnessMap:be,dispersion:A,iridescence:O,iridescenceMap:Se,iridescenceThicknessMap:re,sheen:q,sheenColorMap:ue,sheenRoughnessMap:Re,specularMap:we,specularColorMap:ce,specularIntensityMap:Oe,transmission:J,transmissionMap:P,thicknessMap:ie,gradientMap:ae,opaque:S.transparent===!1&&S.blending===Ti&&S.alphaToCoverage===!1,alphaMap:ge,alphaTest:ne,alphaHash:Z,combine:S.combine,mapUv:We&&v(S.map.channel),aoMapUv:tt&&v(S.aoMap.channel),lightMapUv:Fe&&v(S.lightMap.channel),bumpMapUv:De&&v(S.bumpMap.channel),normalMapUv:ve&&v(S.normalMap.channel),displacementMapUv:Je&&v(S.displacementMap.channel),emissiveMapUv:Ee&&v(S.emissiveMap.channel),metalnessMapUv:ke&&v(S.metalnessMap.channel),roughnessMapUv:gt&&v(S.roughnessMap.channel),anisotropyMapUv:Q&&v(S.anisotropyMap.channel),clearcoatMapUv:Te&&v(S.clearcoatMap.channel),clearcoatNormalMapUv:se&&v(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:be&&v(S.clearcoatRoughnessMap.channel),iridescenceMapUv:Se&&v(S.iridescenceMap.channel),iridescenceThicknessMapUv:re&&v(S.iridescenceThicknessMap.channel),sheenColorMapUv:ue&&v(S.sheenColorMap.channel),sheenRoughnessMapUv:Re&&v(S.sheenRoughnessMap.channel),specularMapUv:we&&v(S.specularMap.channel),specularColorMapUv:ce&&v(S.specularColorMap.channel),specularIntensityMapUv:Oe&&v(S.specularIntensityMap.channel),transmissionMapUv:P&&v(S.transmissionMap.channel),thicknessMapUv:ie&&v(S.thicknessMap.channel),alphaMapUv:ge&&v(S.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(ve||lt),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!X.attributes.uv&&(We||ge),fog:!!V,useFog:S.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:fe,skinning:F.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:pe,morphTextureStride:Ue,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&D.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ne,decodeVideoTexture:We&&S.map.isVideoTexture===!0&&$e.getTransfer(S.map.colorSpace)===at,decodeVideoTextureEmissive:Ee&&S.emissiveMap.isVideoTexture===!0&&$e.getTransfer(S.emissiveMap.colorSpace)===at,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===an,flipSided:S.side===Lt,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Me&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Me&&S.extensions.multiDraw===!0||ye)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return nt.vertexUv1s=l.has(1),nt.vertexUv2s=l.has(2),nt.vertexUv3s=l.has(3),l.clear(),nt}function f(S){const x=[];if(S.shaderID?x.push(S.shaderID):(x.push(S.customVertexShaderID),x.push(S.customFragmentShaderID)),S.defines!==void 0)for(const D in S.defines)x.push(D),x.push(S.defines[D]);return S.isRawShaderMaterial===!1&&(b(x,S),M(x,S),x.push(i.outputColorSpace)),x.push(S.customProgramCacheKey),x.join()}function b(S,x){S.push(x.precision),S.push(x.outputColorSpace),S.push(x.envMapMode),S.push(x.envMapCubeUVHeight),S.push(x.mapUv),S.push(x.alphaMapUv),S.push(x.lightMapUv),S.push(x.aoMapUv),S.push(x.bumpMapUv),S.push(x.normalMapUv),S.push(x.displacementMapUv),S.push(x.emissiveMapUv),S.push(x.metalnessMapUv),S.push(x.roughnessMapUv),S.push(x.anisotropyMapUv),S.push(x.clearcoatMapUv),S.push(x.clearcoatNormalMapUv),S.push(x.clearcoatRoughnessMapUv),S.push(x.iridescenceMapUv),S.push(x.iridescenceThicknessMapUv),S.push(x.sheenColorMapUv),S.push(x.sheenRoughnessMapUv),S.push(x.specularMapUv),S.push(x.specularColorMapUv),S.push(x.specularIntensityMapUv),S.push(x.transmissionMapUv),S.push(x.thicknessMapUv),S.push(x.combine),S.push(x.fogExp2),S.push(x.sizeAttenuation),S.push(x.morphTargetsCount),S.push(x.morphAttributeCount),S.push(x.numDirLights),S.push(x.numPointLights),S.push(x.numSpotLights),S.push(x.numSpotLightMaps),S.push(x.numHemiLights),S.push(x.numRectAreaLights),S.push(x.numDirLightShadows),S.push(x.numPointLightShadows),S.push(x.numSpotLightShadows),S.push(x.numSpotLightShadowsWithMaps),S.push(x.numLightProbes),S.push(x.shadowMapType),S.push(x.toneMapping),S.push(x.numClippingPlanes),S.push(x.numClipIntersection),S.push(x.depthPacking)}function M(S,x){a.disableAll(),x.supportsVertexTextures&&a.enable(0),x.instancing&&a.enable(1),x.instancingColor&&a.enable(2),x.instancingMorph&&a.enable(3),x.matcap&&a.enable(4),x.envMap&&a.enable(5),x.normalMapObjectSpace&&a.enable(6),x.normalMapTangentSpace&&a.enable(7),x.clearcoat&&a.enable(8),x.iridescence&&a.enable(9),x.alphaTest&&a.enable(10),x.vertexColors&&a.enable(11),x.vertexAlphas&&a.enable(12),x.vertexUv1s&&a.enable(13),x.vertexUv2s&&a.enable(14),x.vertexUv3s&&a.enable(15),x.vertexTangents&&a.enable(16),x.anisotropy&&a.enable(17),x.alphaHash&&a.enable(18),x.batching&&a.enable(19),x.dispersion&&a.enable(20),x.batchingColor&&a.enable(21),x.gradientMap&&a.enable(22),S.push(a.mask),a.disableAll(),x.fog&&a.enable(0),x.useFog&&a.enable(1),x.flatShading&&a.enable(2),x.logarithmicDepthBuffer&&a.enable(3),x.reversedDepthBuffer&&a.enable(4),x.skinning&&a.enable(5),x.morphTargets&&a.enable(6),x.morphNormals&&a.enable(7),x.morphColors&&a.enable(8),x.premultipliedAlpha&&a.enable(9),x.shadowMapEnabled&&a.enable(10),x.doubleSided&&a.enable(11),x.flipSided&&a.enable(12),x.useDepthPacking&&a.enable(13),x.dithering&&a.enable(14),x.transmission&&a.enable(15),x.sheen&&a.enable(16),x.opaque&&a.enable(17),x.pointsUvs&&a.enable(18),x.decodeVideoTexture&&a.enable(19),x.decodeVideoTextureEmissive&&a.enable(20),x.alphaToCoverage&&a.enable(21),S.push(a.mask)}function _(S){const x=g[S.type];let D;if(x){const k=pn[x];D=ah.clone(k.uniforms)}else D=S.uniforms;return D}function T(S,x){let D;for(let k=0,F=u.length;k<F;k++){const V=u[k];if(V.cacheKey===x){D=V,++D.usedTimes;break}}return D===void 0&&(D=new Dg(i,x,S,r),u.push(D)),D}function y(S){if(--S.usedTimes===0){const x=u.indexOf(S);u[x]=u[u.length-1],u.pop(),S.destroy()}}function C(S){c.remove(S)}function L(){c.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:_,acquireProgram:T,releaseProgram:y,releaseShaderCache:C,programs:u,dispose:L}}function kg(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Ng(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Qa(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function qa(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(d,h,p,g,v,m){let f=i[e];return f===void 0?(f={id:d.id,object:d,geometry:h,material:p,groupOrder:g,renderOrder:d.renderOrder,z:v,group:m},i[e]=f):(f.id=d.id,f.object=d,f.geometry=h,f.material=p,f.groupOrder=g,f.renderOrder=d.renderOrder,f.z=v,f.group=m),e++,f}function a(d,h,p,g,v,m){const f=o(d,h,p,g,v,m);p.transmission>0?n.push(f):p.transparent===!0?s.push(f):t.push(f)}function c(d,h,p,g,v,m){const f=o(d,h,p,g,v,m);p.transmission>0?n.unshift(f):p.transparent===!0?s.unshift(f):t.unshift(f)}function l(d,h){t.length>1&&t.sort(d||Ng),n.length>1&&n.sort(h||Qa),s.length>1&&s.sort(h||Qa)}function u(){for(let d=e,h=i.length;d<h;d++){const p=i[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:u,sort:l}}function Bg(){let i=new WeakMap;function e(n,s){const r=i.get(n);let o;return r===void 0?(o=new qa,i.set(n,[o])):s>=r.length?(o=new qa,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function Fg(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new G,color:new Ye};break;case"SpotLight":t={position:new G,direction:new G,color:new Ye,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new G,color:new Ye,distance:0,decay:0};break;case"HemisphereLight":t={direction:new G,skyColor:new Ye,groundColor:new Ye};break;case"RectAreaLight":t={color:new Ye,position:new G,halfWidth:new G,halfHeight:new G};break}return i[e.id]=t,t}}}function Og(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ke};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ke};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ke,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let zg=0;function Vg(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Gg(i){const e=new Fg,t=Og(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new G);const s=new G,r=new Et,o=new Et;function a(l){let u=0,d=0,h=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let p=0,g=0,v=0,m=0,f=0,b=0,M=0,_=0,T=0,y=0,C=0;l.sort(Vg);for(let S=0,x=l.length;S<x;S++){const D=l[S],k=D.color,F=D.intensity,V=D.distance,X=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)u+=k.r*F,d+=k.g*F,h+=k.b*F;else if(D.isLightProbe){for(let B=0;B<9;B++)n.probe[B].addScaledVector(D.sh.coefficients[B],F);C++}else if(D.isDirectionalLight){const B=e.get(D);if(B.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const K=D.shadow,z=t.get(D);z.shadowIntensity=K.intensity,z.shadowBias=K.bias,z.shadowNormalBias=K.normalBias,z.shadowRadius=K.radius,z.shadowMapSize=K.mapSize,n.directionalShadow[p]=z,n.directionalShadowMap[p]=X,n.directionalShadowMatrix[p]=D.shadow.matrix,b++}n.directional[p]=B,p++}else if(D.isSpotLight){const B=e.get(D);B.position.setFromMatrixPosition(D.matrixWorld),B.color.copy(k).multiplyScalar(F),B.distance=V,B.coneCos=Math.cos(D.angle),B.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),B.decay=D.decay,n.spot[v]=B;const K=D.shadow;if(D.map&&(n.spotLightMap[T]=D.map,T++,K.updateMatrices(D),D.castShadow&&y++),n.spotLightMatrix[v]=K.matrix,D.castShadow){const z=t.get(D);z.shadowIntensity=K.intensity,z.shadowBias=K.bias,z.shadowNormalBias=K.normalBias,z.shadowRadius=K.radius,z.shadowMapSize=K.mapSize,n.spotShadow[v]=z,n.spotShadowMap[v]=X,_++}v++}else if(D.isRectAreaLight){const B=e.get(D);B.color.copy(k).multiplyScalar(F),B.halfWidth.set(D.width*.5,0,0),B.halfHeight.set(0,D.height*.5,0),n.rectArea[m]=B,m++}else if(D.isPointLight){const B=e.get(D);if(B.color.copy(D.color).multiplyScalar(D.intensity),B.distance=D.distance,B.decay=D.decay,D.castShadow){const K=D.shadow,z=t.get(D);z.shadowIntensity=K.intensity,z.shadowBias=K.bias,z.shadowNormalBias=K.normalBias,z.shadowRadius=K.radius,z.shadowMapSize=K.mapSize,z.shadowCameraNear=K.camera.near,z.shadowCameraFar=K.camera.far,n.pointShadow[g]=z,n.pointShadowMap[g]=X,n.pointShadowMatrix[g]=D.shadow.matrix,M++}n.point[g]=B,g++}else if(D.isHemisphereLight){const B=e.get(D);B.skyColor.copy(D.color).multiplyScalar(F),B.groundColor.copy(D.groundColor).multiplyScalar(F),n.hemi[f]=B,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=de.LTC_FLOAT_1,n.rectAreaLTC2=de.LTC_FLOAT_2):(n.rectAreaLTC1=de.LTC_HALF_1,n.rectAreaLTC2=de.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=h;const L=n.hash;(L.directionalLength!==p||L.pointLength!==g||L.spotLength!==v||L.rectAreaLength!==m||L.hemiLength!==f||L.numDirectionalShadows!==b||L.numPointShadows!==M||L.numSpotShadows!==_||L.numSpotMaps!==T||L.numLightProbes!==C)&&(n.directional.length=p,n.spot.length=v,n.rectArea.length=m,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=_+T-y,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=y,n.numLightProbes=C,L.directionalLength=p,L.pointLength=g,L.spotLength=v,L.rectAreaLength=m,L.hemiLength=f,L.numDirectionalShadows=b,L.numPointShadows=M,L.numSpotShadows=_,L.numSpotMaps=T,L.numLightProbes=C,n.version=zg++)}function c(l,u){let d=0,h=0,p=0,g=0,v=0;const m=u.matrixWorldInverse;for(let f=0,b=l.length;f<b;f++){const M=l[f];if(M.isDirectionalLight){const _=n.directional[d];_.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(m),d++}else if(M.isSpotLight){const _=n.spot[p];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(m),_.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(m),p++}else if(M.isRectAreaLight){const _=n.rectArea[g];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(m),o.identity(),r.copy(M.matrixWorld),r.premultiply(m),o.extractRotation(r),_.halfWidth.set(M.width*.5,0,0),_.halfHeight.set(0,M.height*.5,0),_.halfWidth.applyMatrix4(o),_.halfHeight.applyMatrix4(o),g++}else if(M.isPointLight){const _=n.point[h];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(m),h++}else if(M.isHemisphereLight){const _=n.hemi[v];_.direction.setFromMatrixPosition(M.matrixWorld),_.direction.transformDirection(m),v++}}}return{setup:a,setupView:c,state:n}}function Ka(i){const e=new Gg(i),t=[],n=[];function s(u){l.camera=u,t.length=0,n.length=0}function r(u){t.push(u)}function o(u){n.push(u)}function a(){e.setup(t)}function c(u){e.setupView(t,u)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function Hg(i){let e=new WeakMap;function t(s,r=0){const o=e.get(s);let a;return o===void 0?(a=new Ka(i),e.set(s,[a])):r>=o.length?(a=new Ka(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}const Wg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Xg=`uniform sampler2D shadow_pass;
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
}`;function Yg(i,e,t){let n=new jl;const s=new Ke,r=new Ke,o=new At,a=new _h({depthPacking:fd}),c=new vh,l={},u=t.maxTextureSize,d={[Pn]:Lt,[Lt]:Pn,[an]:an},h=new An({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ke},radius:{value:4}},vertexShader:Wg,fragmentShader:Xg}),p=h.clone();p.defines.HORIZONTAL_PASS=1;const g=new un;g.setAttribute("position",new Tt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new wt(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=wl;let f=this.type;this.render=function(y,C,L){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||y.length===0)return;const S=i.getRenderTarget(),x=i.getActiveCubeFace(),D=i.getActiveMipmapLevel(),k=i.state;k.setBlending(zn),k.buffers.depth.getReversed()===!0?k.buffers.color.setClear(0,0,0,0):k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const F=f!==wn&&this.type===wn,V=f===wn&&this.type!==wn;for(let X=0,B=y.length;X<B;X++){const K=y[X],z=K.shadow;if(z===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;s.copy(z.mapSize);const ee=z.getFrameExtents();if(s.multiply(ee),r.copy(z.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/ee.x),s.x=r.x*ee.x,z.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/ee.y),s.y=r.y*ee.y,z.mapSize.y=r.y)),z.map===null||F===!0||V===!0){const pe=this.type!==wn?{minFilter:Bt,magFilter:Bt}:{};z.map!==null&&z.map.dispose(),z.map=new ni(s.x,s.y,pe),z.map.texture.name=K.name+".shadowMap",z.camera.updateProjectionMatrix()}i.setRenderTarget(z.map),i.clear();const le=z.getViewportCount();for(let pe=0;pe<le;pe++){const Ue=z.getViewport(pe);o.set(r.x*Ue.x,r.y*Ue.y,r.x*Ue.z,r.y*Ue.w),k.viewport(o),z.updateMatrices(K,pe),n=z.getFrustum(),_(C,L,z.camera,K,this.type)}z.isPointLightShadow!==!0&&this.type===wn&&b(z,L),z.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(S,x,D)};function b(y,C){const L=e.update(v);h.defines.VSM_SAMPLES!==y.blurSamples&&(h.defines.VSM_SAMPLES=y.blurSamples,p.defines.VSM_SAMPLES=y.blurSamples,h.needsUpdate=!0,p.needsUpdate=!0),y.mapPass===null&&(y.mapPass=new ni(s.x,s.y)),h.uniforms.shadow_pass.value=y.map.texture,h.uniforms.resolution.value=y.mapSize,h.uniforms.radius.value=y.radius,i.setRenderTarget(y.mapPass),i.clear(),i.renderBufferDirect(C,null,L,h,v,null),p.uniforms.shadow_pass.value=y.mapPass.texture,p.uniforms.resolution.value=y.mapSize,p.uniforms.radius.value=y.radius,i.setRenderTarget(y.map),i.clear(),i.renderBufferDirect(C,null,L,p,v,null)}function M(y,C,L,S){let x=null;const D=L.isPointLight===!0?y.customDistanceMaterial:y.customDepthMaterial;if(D!==void 0)x=D;else if(x=L.isPointLight===!0?c:a,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const k=x.uuid,F=C.uuid;let V=l[k];V===void 0&&(V={},l[k]=V);let X=V[F];X===void 0&&(X=x.clone(),V[F]=X,C.addEventListener("dispose",T)),x=X}if(x.visible=C.visible,x.wireframe=C.wireframe,S===wn?x.side=C.shadowSide!==null?C.shadowSide:C.side:x.side=C.shadowSide!==null?C.shadowSide:d[C.side],x.alphaMap=C.alphaMap,x.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,x.map=C.map,x.clipShadows=C.clipShadows,x.clippingPlanes=C.clippingPlanes,x.clipIntersection=C.clipIntersection,x.displacementMap=C.displacementMap,x.displacementScale=C.displacementScale,x.displacementBias=C.displacementBias,x.wireframeLinewidth=C.wireframeLinewidth,x.linewidth=C.linewidth,L.isPointLight===!0&&x.isMeshDistanceMaterial===!0){const k=i.properties.get(x);k.light=L}return x}function _(y,C,L,S,x){if(y.visible===!1)return;if(y.layers.test(C.layers)&&(y.isMesh||y.isLine||y.isPoints)&&(y.castShadow||y.receiveShadow&&x===wn)&&(!y.frustumCulled||n.intersectsObject(y))){y.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,y.matrixWorld);const F=e.update(y),V=y.material;if(Array.isArray(V)){const X=F.groups;for(let B=0,K=X.length;B<K;B++){const z=X[B],ee=V[z.materialIndex];if(ee&&ee.visible){const le=M(y,ee,S,x);y.onBeforeShadow(i,y,C,L,F,le,z),i.renderBufferDirect(L,null,F,le,y,z),y.onAfterShadow(i,y,C,L,F,le,z)}}}else if(V.visible){const X=M(y,V,S,x);y.onBeforeShadow(i,y,C,L,F,X,null),i.renderBufferDirect(L,null,F,X,y,null),y.onAfterShadow(i,y,C,L,F,X,null)}}const k=y.children;for(let F=0,V=k.length;F<V;F++)_(k[F],C,L,S,x)}function T(y){y.target.removeEventListener("dispose",T);for(const L in l){const S=l[L],x=y.target.uuid;x in S&&(S[x].dispose(),delete S[x])}}}const Qg={[Qr]:qr,[Kr]:Zr,[jr]:$r,[Ri]:Jr,[qr]:Qr,[Zr]:Kr,[$r]:jr,[Jr]:Ri};function qg(i,e){function t(){let P=!1;const ie=new At;let ae=null;const ge=new At(0,0,0,0);return{setMask:function(ne){ae!==ne&&!P&&(i.colorMask(ne,ne,ne,ne),ae=ne)},setLocked:function(ne){P=ne},setClear:function(ne,Z,Me,Ne,nt){nt===!0&&(ne*=Ne,Z*=Ne,Me*=Ne),ie.set(ne,Z,Me,Ne),ge.equals(ie)===!1&&(i.clearColor(ne,Z,Me,Ne),ge.copy(ie))},reset:function(){P=!1,ae=null,ge.set(-1,0,0,0)}}}function n(){let P=!1,ie=!1,ae=null,ge=null,ne=null;return{setReversed:function(Z){if(ie!==Z){const Me=e.get("EXT_clip_control");Z?Me.clipControlEXT(Me.LOWER_LEFT_EXT,Me.ZERO_TO_ONE_EXT):Me.clipControlEXT(Me.LOWER_LEFT_EXT,Me.NEGATIVE_ONE_TO_ONE_EXT),ie=Z;const Ne=ne;ne=null,this.setClear(Ne)}},getReversed:function(){return ie},setTest:function(Z){Z?j(i.DEPTH_TEST):fe(i.DEPTH_TEST)},setMask:function(Z){ae!==Z&&!P&&(i.depthMask(Z),ae=Z)},setFunc:function(Z){if(ie&&(Z=Qg[Z]),ge!==Z){switch(Z){case Qr:i.depthFunc(i.NEVER);break;case qr:i.depthFunc(i.ALWAYS);break;case Kr:i.depthFunc(i.LESS);break;case Ri:i.depthFunc(i.LEQUAL);break;case jr:i.depthFunc(i.EQUAL);break;case Jr:i.depthFunc(i.GEQUAL);break;case Zr:i.depthFunc(i.GREATER);break;case $r:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ge=Z}},setLocked:function(Z){P=Z},setClear:function(Z){ne!==Z&&(ie&&(Z=1-Z),i.clearDepth(Z),ne=Z)},reset:function(){P=!1,ae=null,ge=null,ne=null,ie=!1}}}function s(){let P=!1,ie=null,ae=null,ge=null,ne=null,Z=null,Me=null,Ne=null,nt=null;return{setTest:function(je){P||(je?j(i.STENCIL_TEST):fe(i.STENCIL_TEST))},setMask:function(je){ie!==je&&!P&&(i.stencilMask(je),ie=je)},setFunc:function(je,Yt,Qt){(ae!==je||ge!==Yt||ne!==Qt)&&(i.stencilFunc(je,Yt,Qt),ae=je,ge=Yt,ne=Qt)},setOp:function(je,Yt,Qt){(Z!==je||Me!==Yt||Ne!==Qt)&&(i.stencilOp(je,Yt,Qt),Z=je,Me=Yt,Ne=Qt)},setLocked:function(je){P=je},setClear:function(je){nt!==je&&(i.clearStencil(je),nt=je)},reset:function(){P=!1,ie=null,ae=null,ge=null,ne=null,Z=null,Me=null,Ne=null,nt=null}}}const r=new t,o=new n,a=new s,c=new WeakMap,l=new WeakMap;let u={},d={},h=new WeakMap,p=[],g=null,v=!1,m=null,f=null,b=null,M=null,_=null,T=null,y=null,C=new Ye(0,0,0),L=0,S=!1,x=null,D=null,k=null,F=null,V=null;const X=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,K=0;const z=i.getParameter(i.VERSION);z.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(z)[1]),B=K>=1):z.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),B=K>=2);let ee=null,le={};const pe=i.getParameter(i.SCISSOR_BOX),Ue=i.getParameter(i.VIEWPORT),oe=new At().fromArray(pe),Le=new At().fromArray(Ue);function He(P,ie,ae,ge){const ne=new Uint8Array(4),Z=i.createTexture();i.bindTexture(P,Z),i.texParameteri(P,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(P,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Me=0;Me<ae;Me++)P===i.TEXTURE_3D||P===i.TEXTURE_2D_ARRAY?i.texImage3D(ie,0,i.RGBA,1,1,ge,0,i.RGBA,i.UNSIGNED_BYTE,ne):i.texImage2D(ie+Me,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ne);return Z}const Y={};Y[i.TEXTURE_2D]=He(i.TEXTURE_2D,i.TEXTURE_2D,1),Y[i.TEXTURE_CUBE_MAP]=He(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[i.TEXTURE_2D_ARRAY]=He(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Y[i.TEXTURE_3D]=He(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),j(i.DEPTH_TEST),o.setFunc(Ri),De(!1),ve(ea),j(i.CULL_FACE),tt(zn);function j(P){u[P]!==!0&&(i.enable(P),u[P]=!0)}function fe(P){u[P]!==!1&&(i.disable(P),u[P]=!1)}function xe(P,ie){return d[P]!==ie?(i.bindFramebuffer(P,ie),d[P]=ie,P===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=ie),P===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=ie),!0):!1}function ye(P,ie){let ae=p,ge=!1;if(P){ae=h.get(ie),ae===void 0&&(ae=[],h.set(ie,ae));const ne=P.textures;if(ae.length!==ne.length||ae[0]!==i.COLOR_ATTACHMENT0){for(let Z=0,Me=ne.length;Z<Me;Z++)ae[Z]=i.COLOR_ATTACHMENT0+Z;ae.length=ne.length,ge=!0}}else ae[0]!==i.BACK&&(ae[0]=i.BACK,ge=!0);ge&&i.drawBuffers(ae)}function We(P){return g!==P?(i.useProgram(P),g=P,!0):!1}const yt={[Jn]:i.FUNC_ADD,[Ou]:i.FUNC_SUBTRACT,[zu]:i.FUNC_REVERSE_SUBTRACT};yt[Vu]=i.MIN,yt[Gu]=i.MAX;const R={[Hu]:i.ZERO,[Wu]:i.ONE,[Xu]:i.SRC_COLOR,[Xr]:i.SRC_ALPHA,[Ju]:i.SRC_ALPHA_SATURATE,[Ku]:i.DST_COLOR,[Qu]:i.DST_ALPHA,[Yu]:i.ONE_MINUS_SRC_COLOR,[Yr]:i.ONE_MINUS_SRC_ALPHA,[ju]:i.ONE_MINUS_DST_COLOR,[qu]:i.ONE_MINUS_DST_ALPHA,[Zu]:i.CONSTANT_COLOR,[$u]:i.ONE_MINUS_CONSTANT_COLOR,[ed]:i.CONSTANT_ALPHA,[td]:i.ONE_MINUS_CONSTANT_ALPHA};function tt(P,ie,ae,ge,ne,Z,Me,Ne,nt,je){if(P===zn){v===!0&&(fe(i.BLEND),v=!1);return}if(v===!1&&(j(i.BLEND),v=!0),P!==Fu){if(P!==m||je!==S){if((f!==Jn||_!==Jn)&&(i.blendEquation(i.FUNC_ADD),f=Jn,_=Jn),je)switch(P){case Ti:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ta:i.blendFunc(i.ONE,i.ONE);break;case na:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ia:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",P);break}else switch(P){case Ti:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ta:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case na:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ia:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",P);break}b=null,M=null,T=null,y=null,C.set(0,0,0),L=0,m=P,S=je}return}ne=ne||ie,Z=Z||ae,Me=Me||ge,(ie!==f||ne!==_)&&(i.blendEquationSeparate(yt[ie],yt[ne]),f=ie,_=ne),(ae!==b||ge!==M||Z!==T||Me!==y)&&(i.blendFuncSeparate(R[ae],R[ge],R[Z],R[Me]),b=ae,M=ge,T=Z,y=Me),(Ne.equals(C)===!1||nt!==L)&&(i.blendColor(Ne.r,Ne.g,Ne.b,nt),C.copy(Ne),L=nt),m=P,S=!1}function Fe(P,ie){P.side===an?fe(i.CULL_FACE):j(i.CULL_FACE);let ae=P.side===Lt;ie&&(ae=!ae),De(ae),P.blending===Ti&&P.transparent===!1?tt(zn):tt(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.blendColor,P.blendAlpha,P.premultipliedAlpha),o.setFunc(P.depthFunc),o.setTest(P.depthTest),o.setMask(P.depthWrite),r.setMask(P.colorWrite);const ge=P.stencilWrite;a.setTest(ge),ge&&(a.setMask(P.stencilWriteMask),a.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),a.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),Ee(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?j(i.SAMPLE_ALPHA_TO_COVERAGE):fe(i.SAMPLE_ALPHA_TO_COVERAGE)}function De(P){x!==P&&(P?i.frontFace(i.CW):i.frontFace(i.CCW),x=P)}function ve(P){P!==ku?(j(i.CULL_FACE),P!==D&&(P===ea?i.cullFace(i.BACK):P===Nu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):fe(i.CULL_FACE),D=P}function Je(P){P!==k&&(B&&i.lineWidth(P),k=P)}function Ee(P,ie,ae){P?(j(i.POLYGON_OFFSET_FILL),(F!==ie||V!==ae)&&(i.polygonOffset(ie,ae),F=ie,V=ae)):fe(i.POLYGON_OFFSET_FILL)}function ke(P){P?j(i.SCISSOR_TEST):fe(i.SCISSOR_TEST)}function gt(P){P===void 0&&(P=i.TEXTURE0+X-1),ee!==P&&(i.activeTexture(P),ee=P)}function lt(P,ie,ae){ae===void 0&&(ee===null?ae=i.TEXTURE0+X-1:ae=ee);let ge=le[ae];ge===void 0&&(ge={type:void 0,texture:void 0},le[ae]=ge),(ge.type!==P||ge.texture!==ie)&&(ee!==ae&&(i.activeTexture(ae),ee=ae),i.bindTexture(P,ie||Y[P]),ge.type=P,ge.texture=ie)}function w(){const P=le[ee];P!==void 0&&P.type!==void 0&&(i.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function A(){try{i.compressedTexImage2D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function O(){try{i.compressedTexImage3D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function q(){try{i.texSubImage2D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function J(){try{i.texSubImage3D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Q(){try{i.compressedTexSubImage2D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Te(){try{i.compressedTexSubImage3D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function se(){try{i.texStorage2D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function be(){try{i.texStorage3D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Se(){try{i.texImage2D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function re(){try{i.texImage3D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function ue(P){oe.equals(P)===!1&&(i.scissor(P.x,P.y,P.z,P.w),oe.copy(P))}function Re(P){Le.equals(P)===!1&&(i.viewport(P.x,P.y,P.z,P.w),Le.copy(P))}function we(P,ie){let ae=l.get(ie);ae===void 0&&(ae=new WeakMap,l.set(ie,ae));let ge=ae.get(P);ge===void 0&&(ge=i.getUniformBlockIndex(ie,P.name),ae.set(P,ge))}function ce(P,ie){const ge=l.get(ie).get(P);c.get(ie)!==ge&&(i.uniformBlockBinding(ie,ge,P.__bindingPointIndex),c.set(ie,ge))}function Oe(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},ee=null,le={},d={},h=new WeakMap,p=[],g=null,v=!1,m=null,f=null,b=null,M=null,_=null,T=null,y=null,C=new Ye(0,0,0),L=0,S=!1,x=null,D=null,k=null,F=null,V=null,oe.set(0,0,i.canvas.width,i.canvas.height),Le.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:j,disable:fe,bindFramebuffer:xe,drawBuffers:ye,useProgram:We,setBlending:tt,setMaterial:Fe,setFlipSided:De,setCullFace:ve,setLineWidth:Je,setPolygonOffset:Ee,setScissorTest:ke,activeTexture:gt,bindTexture:lt,unbindTexture:w,compressedTexImage2D:A,compressedTexImage3D:O,texImage2D:Se,texImage3D:re,updateUBOMapping:we,uniformBlockBinding:ce,texStorage2D:se,texStorage3D:be,texSubImage2D:q,texSubImage3D:J,compressedTexSubImage2D:Q,compressedTexSubImage3D:Te,scissor:ue,viewport:Re,reset:Oe}}function Kg(i,e,t,n,s,r,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Ke,u=new WeakMap;let d;const h=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(w,A){return p?new OffscreenCanvas(w,A):js("canvas")}function v(w,A,O){let q=1;const J=lt(w);if((J.width>O||J.height>O)&&(q=O/Math.max(J.width,J.height)),q<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const Q=Math.floor(q*J.width),Te=Math.floor(q*J.height);d===void 0&&(d=g(Q,Te));const se=A?g(Q,Te):d;return se.width=Q,se.height=Te,se.getContext("2d").drawImage(w,0,0,Q,Te),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+Q+"x"+Te+")."),se}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),w;return w}function m(w){return w.generateMipmaps}function f(w){i.generateMipmap(w)}function b(w){return w.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?i.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(w,A,O,q,J=!1){if(w!==null){if(i[w]!==void 0)return i[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let Q=A;if(A===i.RED&&(O===i.FLOAT&&(Q=i.R32F),O===i.HALF_FLOAT&&(Q=i.R16F),O===i.UNSIGNED_BYTE&&(Q=i.R8)),A===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(Q=i.R8UI),O===i.UNSIGNED_SHORT&&(Q=i.R16UI),O===i.UNSIGNED_INT&&(Q=i.R32UI),O===i.BYTE&&(Q=i.R8I),O===i.SHORT&&(Q=i.R16I),O===i.INT&&(Q=i.R32I)),A===i.RG&&(O===i.FLOAT&&(Q=i.RG32F),O===i.HALF_FLOAT&&(Q=i.RG16F),O===i.UNSIGNED_BYTE&&(Q=i.RG8)),A===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(Q=i.RG8UI),O===i.UNSIGNED_SHORT&&(Q=i.RG16UI),O===i.UNSIGNED_INT&&(Q=i.RG32UI),O===i.BYTE&&(Q=i.RG8I),O===i.SHORT&&(Q=i.RG16I),O===i.INT&&(Q=i.RG32I)),A===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(Q=i.RGB8UI),O===i.UNSIGNED_SHORT&&(Q=i.RGB16UI),O===i.UNSIGNED_INT&&(Q=i.RGB32UI),O===i.BYTE&&(Q=i.RGB8I),O===i.SHORT&&(Q=i.RGB16I),O===i.INT&&(Q=i.RGB32I)),A===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(Q=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(Q=i.RGBA16UI),O===i.UNSIGNED_INT&&(Q=i.RGBA32UI),O===i.BYTE&&(Q=i.RGBA8I),O===i.SHORT&&(Q=i.RGBA16I),O===i.INT&&(Q=i.RGBA32I)),A===i.RGB&&(O===i.UNSIGNED_INT_5_9_9_9_REV&&(Q=i.RGB9_E5),O===i.UNSIGNED_INT_10F_11F_11F_REV&&(Q=i.R11F_G11F_B10F)),A===i.RGBA){const Te=J?Qs:$e.getTransfer(q);O===i.FLOAT&&(Q=i.RGBA32F),O===i.HALF_FLOAT&&(Q=i.RGBA16F),O===i.UNSIGNED_BYTE&&(Q=Te===at?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(Q=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(Q=i.RGB5_A1)}return(Q===i.R16F||Q===i.R32F||Q===i.RG16F||Q===i.RG32F||Q===i.RGBA16F||Q===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Q}function _(w,A){let O;return w?A===null||A===ti||A===ns?O=i.DEPTH24_STENCIL8:A===Cn?O=i.DEPTH32F_STENCIL8:A===ts&&(O=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===ti||A===ns?O=i.DEPTH_COMPONENT24:A===Cn?O=i.DEPTH_COMPONENT32F:A===ts&&(O=i.DEPTH_COMPONENT16),O}function T(w,A){return m(w)===!0||w.isFramebufferTexture&&w.minFilter!==Bt&&w.minFilter!==cn?Math.log2(Math.max(A.width,A.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?A.mipmaps.length:1}function y(w){const A=w.target;A.removeEventListener("dispose",y),L(A),A.isVideoTexture&&u.delete(A)}function C(w){const A=w.target;A.removeEventListener("dispose",C),x(A)}function L(w){const A=n.get(w);if(A.__webglInit===void 0)return;const O=w.source,q=h.get(O);if(q){const J=q[A.__cacheKey];J.usedTimes--,J.usedTimes===0&&S(w),Object.keys(q).length===0&&h.delete(O)}n.remove(w)}function S(w){const A=n.get(w);i.deleteTexture(A.__webglTexture);const O=w.source,q=h.get(O);delete q[A.__cacheKey],o.memory.textures--}function x(w){const A=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(A.__webglFramebuffer[q]))for(let J=0;J<A.__webglFramebuffer[q].length;J++)i.deleteFramebuffer(A.__webglFramebuffer[q][J]);else i.deleteFramebuffer(A.__webglFramebuffer[q]);A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer[q])}else{if(Array.isArray(A.__webglFramebuffer))for(let q=0;q<A.__webglFramebuffer.length;q++)i.deleteFramebuffer(A.__webglFramebuffer[q]);else i.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&i.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let q=0;q<A.__webglColorRenderbuffer.length;q++)A.__webglColorRenderbuffer[q]&&i.deleteRenderbuffer(A.__webglColorRenderbuffer[q]);A.__webglDepthRenderbuffer&&i.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const O=w.textures;for(let q=0,J=O.length;q<J;q++){const Q=n.get(O[q]);Q.__webglTexture&&(i.deleteTexture(Q.__webglTexture),o.memory.textures--),n.remove(O[q])}n.remove(w)}let D=0;function k(){D=0}function F(){const w=D;return w>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+s.maxTextures),D+=1,w}function V(w){const A=[];return A.push(w.wrapS),A.push(w.wrapT),A.push(w.wrapR||0),A.push(w.magFilter),A.push(w.minFilter),A.push(w.anisotropy),A.push(w.internalFormat),A.push(w.format),A.push(w.type),A.push(w.generateMipmaps),A.push(w.premultiplyAlpha),A.push(w.flipY),A.push(w.unpackAlignment),A.push(w.colorSpace),A.join()}function X(w,A){const O=n.get(w);if(w.isVideoTexture&&ke(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&O.__version!==w.version){const q=w.image;if(q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(O,w,A);return}}else w.isExternalTexture&&(O.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+A)}function B(w,A){const O=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&O.__version!==w.version){Y(O,w,A);return}t.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+A)}function K(w,A){const O=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&O.__version!==w.version){Y(O,w,A);return}t.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+A)}function z(w,A){const O=n.get(w);if(w.version>0&&O.__version!==w.version){j(O,w,A);return}t.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+A)}const ee={[es]:i.REPEAT,[$n]:i.CLAMP_TO_EDGE,[no]:i.MIRRORED_REPEAT},le={[Bt]:i.NEAREST,[dd]:i.NEAREST_MIPMAP_NEAREST,[Ki]:i.NEAREST_MIPMAP_LINEAR,[cn]:i.LINEAR,[cr]:i.LINEAR_MIPMAP_NEAREST,[ei]:i.LINEAR_MIPMAP_LINEAR},pe={[gd]:i.NEVER,[Sd]:i.ALWAYS,[_d]:i.LESS,[Bl]:i.LEQUAL,[vd]:i.EQUAL,[Ed]:i.GEQUAL,[Ad]:i.GREATER,[xd]:i.NOTEQUAL};function Ue(w,A){if(A.type===Cn&&e.has("OES_texture_float_linear")===!1&&(A.magFilter===cn||A.magFilter===cr||A.magFilter===Ki||A.magFilter===ei||A.minFilter===cn||A.minFilter===cr||A.minFilter===Ki||A.minFilter===ei)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(w,i.TEXTURE_WRAP_S,ee[A.wrapS]),i.texParameteri(w,i.TEXTURE_WRAP_T,ee[A.wrapT]),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,ee[A.wrapR]),i.texParameteri(w,i.TEXTURE_MAG_FILTER,le[A.magFilter]),i.texParameteri(w,i.TEXTURE_MIN_FILTER,le[A.minFilter]),A.compareFunction&&(i.texParameteri(w,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(w,i.TEXTURE_COMPARE_FUNC,pe[A.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===Bt||A.minFilter!==Ki&&A.minFilter!==ei||A.type===Cn&&e.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||n.get(A).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");i.texParameterf(w,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,s.getMaxAnisotropy())),n.get(A).__currentAnisotropy=A.anisotropy}}}function oe(w,A){let O=!1;w.__webglInit===void 0&&(w.__webglInit=!0,A.addEventListener("dispose",y));const q=A.source;let J=h.get(q);J===void 0&&(J={},h.set(q,J));const Q=V(A);if(Q!==w.__cacheKey){J[Q]===void 0&&(J[Q]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,O=!0),J[Q].usedTimes++;const Te=J[w.__cacheKey];Te!==void 0&&(J[w.__cacheKey].usedTimes--,Te.usedTimes===0&&S(A)),w.__cacheKey=Q,w.__webglTexture=J[Q].texture}return O}function Le(w,A,O){return Math.floor(Math.floor(w/O)/A)}function He(w,A,O,q){const Q=w.updateRanges;if(Q.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,A.width,A.height,O,q,A.data);else{Q.sort((re,ue)=>re.start-ue.start);let Te=0;for(let re=1;re<Q.length;re++){const ue=Q[Te],Re=Q[re],we=ue.start+ue.count,ce=Le(Re.start,A.width,4),Oe=Le(ue.start,A.width,4);Re.start<=we+1&&ce===Oe&&Le(Re.start+Re.count-1,A.width,4)===ce?ue.count=Math.max(ue.count,Re.start+Re.count-ue.start):(++Te,Q[Te]=Re)}Q.length=Te+1;const se=i.getParameter(i.UNPACK_ROW_LENGTH),be=i.getParameter(i.UNPACK_SKIP_PIXELS),Se=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,A.width);for(let re=0,ue=Q.length;re<ue;re++){const Re=Q[re],we=Math.floor(Re.start/4),ce=Math.ceil(Re.count/4),Oe=we%A.width,P=Math.floor(we/A.width),ie=ce,ae=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Oe),i.pixelStorei(i.UNPACK_SKIP_ROWS,P),t.texSubImage2D(i.TEXTURE_2D,0,Oe,P,ie,ae,O,q,A.data)}w.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,se),i.pixelStorei(i.UNPACK_SKIP_PIXELS,be),i.pixelStorei(i.UNPACK_SKIP_ROWS,Se)}}function Y(w,A,O){let q=i.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(q=i.TEXTURE_2D_ARRAY),A.isData3DTexture&&(q=i.TEXTURE_3D);const J=oe(w,A),Q=A.source;t.bindTexture(q,w.__webglTexture,i.TEXTURE0+O);const Te=n.get(Q);if(Q.version!==Te.__version||J===!0){t.activeTexture(i.TEXTURE0+O);const se=$e.getPrimaries($e.workingColorSpace),be=A.colorSpace===Tn?null:$e.getPrimaries(A.colorSpace),Se=A.colorSpace===Tn||se===be?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Se);let re=v(A.image,!1,s.maxTextureSize);re=gt(A,re);const ue=r.convert(A.format,A.colorSpace),Re=r.convert(A.type);let we=M(A.internalFormat,ue,Re,A.colorSpace,A.isVideoTexture);Ue(q,A);let ce;const Oe=A.mipmaps,P=A.isVideoTexture!==!0,ie=Te.__version===void 0||J===!0,ae=Q.dataReady,ge=T(A,re);if(A.isDepthTexture)we=_(A.format===ss,A.type),ie&&(P?t.texStorage2D(i.TEXTURE_2D,1,we,re.width,re.height):t.texImage2D(i.TEXTURE_2D,0,we,re.width,re.height,0,ue,Re,null));else if(A.isDataTexture)if(Oe.length>0){P&&ie&&t.texStorage2D(i.TEXTURE_2D,ge,we,Oe[0].width,Oe[0].height);for(let ne=0,Z=Oe.length;ne<Z;ne++)ce=Oe[ne],P?ae&&t.texSubImage2D(i.TEXTURE_2D,ne,0,0,ce.width,ce.height,ue,Re,ce.data):t.texImage2D(i.TEXTURE_2D,ne,we,ce.width,ce.height,0,ue,Re,ce.data);A.generateMipmaps=!1}else P?(ie&&t.texStorage2D(i.TEXTURE_2D,ge,we,re.width,re.height),ae&&He(A,re,ue,Re)):t.texImage2D(i.TEXTURE_2D,0,we,re.width,re.height,0,ue,Re,re.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){P&&ie&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ge,we,Oe[0].width,Oe[0].height,re.depth);for(let ne=0,Z=Oe.length;ne<Z;ne++)if(ce=Oe[ne],A.format!==en)if(ue!==null)if(P){if(ae)if(A.layerUpdates.size>0){const Me=ba(ce.width,ce.height,A.format,A.type);for(const Ne of A.layerUpdates){const nt=ce.data.subarray(Ne*Me/ce.data.BYTES_PER_ELEMENT,(Ne+1)*Me/ce.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ne,0,0,Ne,ce.width,ce.height,1,ue,nt)}A.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ne,0,0,0,ce.width,ce.height,re.depth,ue,ce.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ne,we,ce.width,ce.height,re.depth,0,ce.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else P?ae&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ne,0,0,0,ce.width,ce.height,re.depth,ue,Re,ce.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ne,we,ce.width,ce.height,re.depth,0,ue,Re,ce.data)}else{P&&ie&&t.texStorage2D(i.TEXTURE_2D,ge,we,Oe[0].width,Oe[0].height);for(let ne=0,Z=Oe.length;ne<Z;ne++)ce=Oe[ne],A.format!==en?ue!==null?P?ae&&t.compressedTexSubImage2D(i.TEXTURE_2D,ne,0,0,ce.width,ce.height,ue,ce.data):t.compressedTexImage2D(i.TEXTURE_2D,ne,we,ce.width,ce.height,0,ce.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):P?ae&&t.texSubImage2D(i.TEXTURE_2D,ne,0,0,ce.width,ce.height,ue,Re,ce.data):t.texImage2D(i.TEXTURE_2D,ne,we,ce.width,ce.height,0,ue,Re,ce.data)}else if(A.isDataArrayTexture)if(P){if(ie&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ge,we,re.width,re.height,re.depth),ae)if(A.layerUpdates.size>0){const ne=ba(re.width,re.height,A.format,A.type);for(const Z of A.layerUpdates){const Me=re.data.subarray(Z*ne/re.data.BYTES_PER_ELEMENT,(Z+1)*ne/re.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Z,re.width,re.height,1,ue,Re,Me)}A.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,ue,Re,re.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,we,re.width,re.height,re.depth,0,ue,Re,re.data);else if(A.isData3DTexture)P?(ie&&t.texStorage3D(i.TEXTURE_3D,ge,we,re.width,re.height,re.depth),ae&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,ue,Re,re.data)):t.texImage3D(i.TEXTURE_3D,0,we,re.width,re.height,re.depth,0,ue,Re,re.data);else if(A.isFramebufferTexture){if(ie)if(P)t.texStorage2D(i.TEXTURE_2D,ge,we,re.width,re.height);else{let ne=re.width,Z=re.height;for(let Me=0;Me<ge;Me++)t.texImage2D(i.TEXTURE_2D,Me,we,ne,Z,0,ue,Re,null),ne>>=1,Z>>=1}}else if(Oe.length>0){if(P&&ie){const ne=lt(Oe[0]);t.texStorage2D(i.TEXTURE_2D,ge,we,ne.width,ne.height)}for(let ne=0,Z=Oe.length;ne<Z;ne++)ce=Oe[ne],P?ae&&t.texSubImage2D(i.TEXTURE_2D,ne,0,0,ue,Re,ce):t.texImage2D(i.TEXTURE_2D,ne,we,ue,Re,ce);A.generateMipmaps=!1}else if(P){if(ie){const ne=lt(re);t.texStorage2D(i.TEXTURE_2D,ge,we,ne.width,ne.height)}ae&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ue,Re,re)}else t.texImage2D(i.TEXTURE_2D,0,we,ue,Re,re);m(A)&&f(q),Te.__version=Q.version,A.onUpdate&&A.onUpdate(A)}w.__version=A.version}function j(w,A,O){if(A.image.length!==6)return;const q=oe(w,A),J=A.source;t.bindTexture(i.TEXTURE_CUBE_MAP,w.__webglTexture,i.TEXTURE0+O);const Q=n.get(J);if(J.version!==Q.__version||q===!0){t.activeTexture(i.TEXTURE0+O);const Te=$e.getPrimaries($e.workingColorSpace),se=A.colorSpace===Tn?null:$e.getPrimaries(A.colorSpace),be=A.colorSpace===Tn||Te===se?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,be);const Se=A.isCompressedTexture||A.image[0].isCompressedTexture,re=A.image[0]&&A.image[0].isDataTexture,ue=[];for(let Z=0;Z<6;Z++)!Se&&!re?ue[Z]=v(A.image[Z],!0,s.maxCubemapSize):ue[Z]=re?A.image[Z].image:A.image[Z],ue[Z]=gt(A,ue[Z]);const Re=ue[0],we=r.convert(A.format,A.colorSpace),ce=r.convert(A.type),Oe=M(A.internalFormat,we,ce,A.colorSpace),P=A.isVideoTexture!==!0,ie=Q.__version===void 0||q===!0,ae=J.dataReady;let ge=T(A,Re);Ue(i.TEXTURE_CUBE_MAP,A);let ne;if(Se){P&&ie&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ge,Oe,Re.width,Re.height);for(let Z=0;Z<6;Z++){ne=ue[Z].mipmaps;for(let Me=0;Me<ne.length;Me++){const Ne=ne[Me];A.format!==en?we!==null?P?ae&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Me,0,0,Ne.width,Ne.height,we,Ne.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Me,Oe,Ne.width,Ne.height,0,Ne.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):P?ae&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Me,0,0,Ne.width,Ne.height,we,ce,Ne.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Me,Oe,Ne.width,Ne.height,0,we,ce,Ne.data)}}}else{if(ne=A.mipmaps,P&&ie){ne.length>0&&ge++;const Z=lt(ue[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ge,Oe,Z.width,Z.height)}for(let Z=0;Z<6;Z++)if(re){P?ae&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,ue[Z].width,ue[Z].height,we,ce,ue[Z].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Oe,ue[Z].width,ue[Z].height,0,we,ce,ue[Z].data);for(let Me=0;Me<ne.length;Me++){const nt=ne[Me].image[Z].image;P?ae&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Me+1,0,0,nt.width,nt.height,we,ce,nt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Me+1,Oe,nt.width,nt.height,0,we,ce,nt.data)}}else{P?ae&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,we,ce,ue[Z]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Oe,we,ce,ue[Z]);for(let Me=0;Me<ne.length;Me++){const Ne=ne[Me];P?ae&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Me+1,0,0,we,ce,Ne.image[Z]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Me+1,Oe,we,ce,Ne.image[Z])}}}m(A)&&f(i.TEXTURE_CUBE_MAP),Q.__version=J.version,A.onUpdate&&A.onUpdate(A)}w.__version=A.version}function fe(w,A,O,q,J,Q){const Te=r.convert(O.format,O.colorSpace),se=r.convert(O.type),be=M(O.internalFormat,Te,se,O.colorSpace),Se=n.get(A),re=n.get(O);if(re.__renderTarget=A,!Se.__hasExternalTextures){const ue=Math.max(1,A.width>>Q),Re=Math.max(1,A.height>>Q);J===i.TEXTURE_3D||J===i.TEXTURE_2D_ARRAY?t.texImage3D(J,Q,be,ue,Re,A.depth,0,Te,se,null):t.texImage2D(J,Q,be,ue,Re,0,Te,se,null)}t.bindFramebuffer(i.FRAMEBUFFER,w),Ee(A)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,q,J,re.__webglTexture,0,Je(A)):(J===i.TEXTURE_2D||J>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,q,J,re.__webglTexture,Q),t.bindFramebuffer(i.FRAMEBUFFER,null)}function xe(w,A,O){if(i.bindRenderbuffer(i.RENDERBUFFER,w),A.depthBuffer){const q=A.depthTexture,J=q&&q.isDepthTexture?q.type:null,Q=_(A.stencilBuffer,J),Te=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,se=Je(A);Ee(A)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,se,Q,A.width,A.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,se,Q,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,Q,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Te,i.RENDERBUFFER,w)}else{const q=A.textures;for(let J=0;J<q.length;J++){const Q=q[J],Te=r.convert(Q.format,Q.colorSpace),se=r.convert(Q.type),be=M(Q.internalFormat,Te,se,Q.colorSpace),Se=Je(A);O&&Ee(A)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Se,be,A.width,A.height):Ee(A)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Se,be,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,be,A.width,A.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ye(w,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,w),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const q=n.get(A.depthTexture);q.__renderTarget=A,(!q.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),X(A.depthTexture,0);const J=q.__webglTexture,Q=Je(A);if(A.depthTexture.format===is)Ee(A)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0,Q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0);else if(A.depthTexture.format===ss)Ee(A)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0,Q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function We(w){const A=n.get(w),O=w.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==w.depthTexture){const q=w.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),q){const J=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,q.removeEventListener("dispose",J)};q.addEventListener("dispose",J),A.__depthDisposeCallback=J}A.__boundDepthTexture=q}if(w.depthTexture&&!A.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");const q=w.texture.mipmaps;q&&q.length>0?ye(A.__webglFramebuffer[0],w):ye(A.__webglFramebuffer,w)}else if(O){A.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(t.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[q]),A.__webglDepthbuffer[q]===void 0)A.__webglDepthbuffer[q]=i.createRenderbuffer(),xe(A.__webglDepthbuffer[q],w,!1);else{const J=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Q=A.__webglDepthbuffer[q];i.bindRenderbuffer(i.RENDERBUFFER,Q),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,Q)}}else{const q=w.texture.mipmaps;if(q&&q.length>0?t.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=i.createRenderbuffer(),xe(A.__webglDepthbuffer,w,!1);else{const J=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Q=A.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Q),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,Q)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function yt(w,A,O){const q=n.get(w);A!==void 0&&fe(q.__webglFramebuffer,w,w.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&We(w)}function R(w){const A=w.texture,O=n.get(w),q=n.get(A);w.addEventListener("dispose",C);const J=w.textures,Q=w.isWebGLCubeRenderTarget===!0,Te=J.length>1;if(Te||(q.__webglTexture===void 0&&(q.__webglTexture=i.createTexture()),q.__version=A.version,o.memory.textures++),Q){O.__webglFramebuffer=[];for(let se=0;se<6;se++)if(A.mipmaps&&A.mipmaps.length>0){O.__webglFramebuffer[se]=[];for(let be=0;be<A.mipmaps.length;be++)O.__webglFramebuffer[se][be]=i.createFramebuffer()}else O.__webglFramebuffer[se]=i.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){O.__webglFramebuffer=[];for(let se=0;se<A.mipmaps.length;se++)O.__webglFramebuffer[se]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(Te)for(let se=0,be=J.length;se<be;se++){const Se=n.get(J[se]);Se.__webglTexture===void 0&&(Se.__webglTexture=i.createTexture(),o.memory.textures++)}if(w.samples>0&&Ee(w)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let se=0;se<J.length;se++){const be=J[se];O.__webglColorRenderbuffer[se]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[se]);const Se=r.convert(be.format,be.colorSpace),re=r.convert(be.type),ue=M(be.internalFormat,Se,re,be.colorSpace,w.isXRRenderTarget===!0),Re=Je(w);i.renderbufferStorageMultisample(i.RENDERBUFFER,Re,ue,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+se,i.RENDERBUFFER,O.__webglColorRenderbuffer[se])}i.bindRenderbuffer(i.RENDERBUFFER,null),w.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),xe(O.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Q){t.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture),Ue(i.TEXTURE_CUBE_MAP,A);for(let se=0;se<6;se++)if(A.mipmaps&&A.mipmaps.length>0)for(let be=0;be<A.mipmaps.length;be++)fe(O.__webglFramebuffer[se][be],w,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+se,be);else fe(O.__webglFramebuffer[se],w,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0);m(A)&&f(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Te){for(let se=0,be=J.length;se<be;se++){const Se=J[se],re=n.get(Se);let ue=i.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ue=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ue,re.__webglTexture),Ue(ue,Se),fe(O.__webglFramebuffer,w,Se,i.COLOR_ATTACHMENT0+se,ue,0),m(Se)&&f(ue)}t.unbindTexture()}else{let se=i.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(se=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(se,q.__webglTexture),Ue(se,A),A.mipmaps&&A.mipmaps.length>0)for(let be=0;be<A.mipmaps.length;be++)fe(O.__webglFramebuffer[be],w,A,i.COLOR_ATTACHMENT0,se,be);else fe(O.__webglFramebuffer,w,A,i.COLOR_ATTACHMENT0,se,0);m(A)&&f(se),t.unbindTexture()}w.depthBuffer&&We(w)}function tt(w){const A=w.textures;for(let O=0,q=A.length;O<q;O++){const J=A[O];if(m(J)){const Q=b(w),Te=n.get(J).__webglTexture;t.bindTexture(Q,Te),f(Q),t.unbindTexture()}}}const Fe=[],De=[];function ve(w){if(w.samples>0){if(Ee(w)===!1){const A=w.textures,O=w.width,q=w.height;let J=i.COLOR_BUFFER_BIT;const Q=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Te=n.get(w),se=A.length>1;if(se)for(let Se=0;Se<A.length;Se++)t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Se,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Se,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Te.__webglMultisampledFramebuffer);const be=w.texture.mipmaps;be&&be.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Te.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Te.__webglFramebuffer);for(let Se=0;Se<A.length;Se++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(J|=i.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(J|=i.STENCIL_BUFFER_BIT)),se){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Te.__webglColorRenderbuffer[Se]);const re=n.get(A[Se]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,re,0)}i.blitFramebuffer(0,0,O,q,0,0,O,q,J,i.NEAREST),c===!0&&(Fe.length=0,De.length=0,Fe.push(i.COLOR_ATTACHMENT0+Se),w.depthBuffer&&w.resolveDepthBuffer===!1&&(Fe.push(Q),De.push(Q),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,De)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Fe))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),se)for(let Se=0;Se<A.length;Se++){t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Se,i.RENDERBUFFER,Te.__webglColorRenderbuffer[Se]);const re=n.get(A[Se]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Se,i.TEXTURE_2D,re,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Te.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&c){const A=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[A])}}}function Je(w){return Math.min(s.maxSamples,w.samples)}function Ee(w){const A=n.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function ke(w){const A=o.render.frame;u.get(w)!==A&&(u.set(w,A),w.update())}function gt(w,A){const O=w.colorSpace,q=w.format,J=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||O!==Ui&&O!==Tn&&($e.getTransfer(O)===at?(q!==en||J!==vn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),A}function lt(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(l.width=w.naturalWidth||w.width,l.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(l.width=w.displayWidth,l.height=w.displayHeight):(l.width=w.width,l.height=w.height),l}this.allocateTextureUnit=F,this.resetTextureUnits=k,this.setTexture2D=X,this.setTexture2DArray=B,this.setTexture3D=K,this.setTextureCube=z,this.rebindTextures=yt,this.setupRenderTarget=R,this.updateRenderTargetMipmap=tt,this.updateMultisampleRenderTarget=ve,this.setupDepthRenderbuffer=We,this.setupFrameBufferTexture=fe,this.useMultisampledRTT=Ee}function jg(i,e){function t(n,s=Tn){let r;const o=$e.getTransfer(s);if(n===vn)return i.UNSIGNED_BYTE;if(n===Fo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Oo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Pl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ul)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Rl)return i.BYTE;if(n===Dl)return i.SHORT;if(n===ts)return i.UNSIGNED_SHORT;if(n===Bo)return i.INT;if(n===ti)return i.UNSIGNED_INT;if(n===Cn)return i.FLOAT;if(n===as)return i.HALF_FLOAT;if(n===Il)return i.ALPHA;if(n===Ll)return i.RGB;if(n===en)return i.RGBA;if(n===is)return i.DEPTH_COMPONENT;if(n===ss)return i.DEPTH_STENCIL;if(n===kl)return i.RED;if(n===zo)return i.RED_INTEGER;if(n===Nl)return i.RG;if(n===Vo)return i.RG_INTEGER;if(n===Go)return i.RGBA_INTEGER;if(n===Gs||n===Hs||n===Ws||n===Xs)if(o===at)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Gs)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Hs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ws)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Xs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Gs)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Hs)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ws)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Xs)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===io||n===so||n===ro||n===oo)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===io)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===so)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ro)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===oo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ao||n===lo||n===co)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ao||n===lo)return o===at?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===co)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===uo||n===ho||n===fo||n===po||n===mo||n===go||n===_o||n===vo||n===Ao||n===xo||n===Eo||n===So||n===Mo||n===yo)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===uo)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ho)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===fo)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===po)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===mo)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===go)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===_o)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===vo)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ao)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===xo)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Eo)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===So)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Mo)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===yo)return o===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===bo||n===wo||n===To)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===bo)return o===at?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===wo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===To)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Co||n===Ro||n===Do||n===Po)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Co)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ro)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Do)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Po)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ns?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const Jg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Zg=`
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

}`;class $g{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new $l(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new An({vertexShader:Jg,fragmentShader:Zg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new wt(new ds(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class e_ extends Li{constructor(e,t){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,u=null,d=null,h=null,p=null,g=null;const v=typeof XRWebGLBinding<"u",m=new $g,f={},b=t.getContextAttributes();let M=null,_=null;const T=[],y=[],C=new Ke;let L=null;const S=new Zt;S.viewport=new At;const x=new Zt;x.viewport=new At;const D=[S,x],k=new xh;let F=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let j=T[Y];return j===void 0&&(j=new Dr,T[Y]=j),j.getTargetRaySpace()},this.getControllerGrip=function(Y){let j=T[Y];return j===void 0&&(j=new Dr,T[Y]=j),j.getGripSpace()},this.getHand=function(Y){let j=T[Y];return j===void 0&&(j=new Dr,T[Y]=j),j.getHandSpace()};function X(Y){const j=y.indexOf(Y.inputSource);if(j===-1)return;const fe=T[j];fe!==void 0&&(fe.update(Y.inputSource,Y.frame,l||o),fe.dispatchEvent({type:Y.type,data:Y.inputSource}))}function B(){s.removeEventListener("select",X),s.removeEventListener("selectstart",X),s.removeEventListener("selectend",X),s.removeEventListener("squeeze",X),s.removeEventListener("squeezestart",X),s.removeEventListener("squeezeend",X),s.removeEventListener("end",B),s.removeEventListener("inputsourceschange",K);for(let Y=0;Y<T.length;Y++){const j=y[Y];j!==null&&(y[Y]=null,T[Y].disconnect(j))}F=null,V=null,m.reset();for(const Y in f)delete f[Y];e.setRenderTarget(M),p=null,h=null,d=null,s=null,_=null,He.stop(),n.isPresenting=!1,e.setPixelRatio(L),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return h!==null?h:p},this.getBinding=function(){return d===null&&v&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(M=e.getRenderTarget(),s.addEventListener("select",X),s.addEventListener("selectstart",X),s.addEventListener("selectend",X),s.addEventListener("squeeze",X),s.addEventListener("squeezestart",X),s.addEventListener("squeezeend",X),s.addEventListener("end",B),s.addEventListener("inputsourceschange",K),b.xrCompatible!==!0&&await t.makeXRCompatible(),L=e.getPixelRatio(),e.getSize(C),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let fe=null,xe=null,ye=null;b.depth&&(ye=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,fe=b.stencil?ss:is,xe=b.stencil?ns:ti);const We={colorFormat:t.RGBA8,depthFormat:ye,scaleFactor:r};d=this.getBinding(),h=d.createProjectionLayer(We),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),_=new ni(h.textureWidth,h.textureHeight,{format:en,type:vn,depthTexture:new Zl(h.textureWidth,h.textureHeight,xe,void 0,void 0,void 0,void 0,void 0,void 0,fe),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{const fe={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,fe),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),_=new ni(p.framebufferWidth,p.framebufferHeight,{format:en,type:vn,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),He.setContext(s),He.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function K(Y){for(let j=0;j<Y.removed.length;j++){const fe=Y.removed[j],xe=y.indexOf(fe);xe>=0&&(y[xe]=null,T[xe].disconnect(fe))}for(let j=0;j<Y.added.length;j++){const fe=Y.added[j];let xe=y.indexOf(fe);if(xe===-1){for(let We=0;We<T.length;We++)if(We>=y.length){y.push(fe),xe=We;break}else if(y[We]===null){y[We]=fe,xe=We;break}if(xe===-1)break}const ye=T[xe];ye&&ye.connect(fe)}}const z=new G,ee=new G;function le(Y,j,fe){z.setFromMatrixPosition(j.matrixWorld),ee.setFromMatrixPosition(fe.matrixWorld);const xe=z.distanceTo(ee),ye=j.projectionMatrix.elements,We=fe.projectionMatrix.elements,yt=ye[14]/(ye[10]-1),R=ye[14]/(ye[10]+1),tt=(ye[9]+1)/ye[5],Fe=(ye[9]-1)/ye[5],De=(ye[8]-1)/ye[0],ve=(We[8]+1)/We[0],Je=yt*De,Ee=yt*ve,ke=xe/(-De+ve),gt=ke*-De;if(j.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(gt),Y.translateZ(ke),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),ye[10]===-1)Y.projectionMatrix.copy(j.projectionMatrix),Y.projectionMatrixInverse.copy(j.projectionMatrixInverse);else{const lt=yt+ke,w=R+ke,A=Je-gt,O=Ee+(xe-gt),q=tt*R/w*lt,J=Fe*R/w*lt;Y.projectionMatrix.makePerspective(A,O,q,J,lt,w),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function pe(Y,j){j===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(j.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let j=Y.near,fe=Y.far;m.texture!==null&&(m.depthNear>0&&(j=m.depthNear),m.depthFar>0&&(fe=m.depthFar)),k.near=x.near=S.near=j,k.far=x.far=S.far=fe,(F!==k.near||V!==k.far)&&(s.updateRenderState({depthNear:k.near,depthFar:k.far}),F=k.near,V=k.far),k.layers.mask=Y.layers.mask|6,S.layers.mask=k.layers.mask&3,x.layers.mask=k.layers.mask&5;const xe=Y.parent,ye=k.cameras;pe(k,xe);for(let We=0;We<ye.length;We++)pe(ye[We],xe);ye.length===2?le(k,S,x):k.projectionMatrix.copy(S.projectionMatrix),Ue(Y,k,xe)};function Ue(Y,j,fe){fe===null?Y.matrix.copy(j.matrixWorld):(Y.matrix.copy(fe.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(j.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(j.projectionMatrix),Y.projectionMatrixInverse.copy(j.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=rs*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return k},this.getFoveation=function(){if(!(h===null&&p===null))return c},this.setFoveation=function(Y){c=Y,h!==null&&(h.fixedFoveation=Y),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Y)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(k)},this.getCameraTexture=function(Y){return f[Y]};let oe=null;function Le(Y,j){if(u=j.getViewerPose(l||o),g=j,u!==null){const fe=u.views;p!==null&&(e.setRenderTargetFramebuffer(_,p.framebuffer),e.setRenderTarget(_));let xe=!1;fe.length!==k.cameras.length&&(k.cameras.length=0,xe=!0);for(let R=0;R<fe.length;R++){const tt=fe[R];let Fe=null;if(p!==null)Fe=p.getViewport(tt);else{const ve=d.getViewSubImage(h,tt);Fe=ve.viewport,R===0&&(e.setRenderTargetTextures(_,ve.colorTexture,ve.depthStencilTexture),e.setRenderTarget(_))}let De=D[R];De===void 0&&(De=new Zt,De.layers.enable(R),De.viewport=new At,D[R]=De),De.matrix.fromArray(tt.transform.matrix),De.matrix.decompose(De.position,De.quaternion,De.scale),De.projectionMatrix.fromArray(tt.projectionMatrix),De.projectionMatrixInverse.copy(De.projectionMatrix).invert(),De.viewport.set(Fe.x,Fe.y,Fe.width,Fe.height),R===0&&(k.matrix.copy(De.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale)),xe===!0&&k.cameras.push(De)}const ye=s.enabledFeatures;if(ye&&ye.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){d=n.getBinding();const R=d.getDepthInformation(fe[0]);R&&R.isValid&&R.texture&&m.init(R,s.renderState)}if(ye&&ye.includes("camera-access")&&v){e.state.unbindTexture(),d=n.getBinding();for(let R=0;R<fe.length;R++){const tt=fe[R].camera;if(tt){let Fe=f[tt];Fe||(Fe=new $l,f[tt]=Fe);const De=d.getCameraImage(tt);Fe.sourceTexture=De}}}}for(let fe=0;fe<T.length;fe++){const xe=y[fe],ye=T[fe];xe!==null&&ye!==void 0&&ye.update(xe,j,l||o)}oe&&oe(Y,j),j.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:j}),g=null}const He=new ec;He.setAnimationLoop(Le),this.setAnimationLoop=function(Y){oe=Y},this.dispose=function(){}}}const qn=new Un,t_=new Et;function n_(i,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,Hl(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,b,M,_){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),d(m,f)):f.isMeshPhongMaterial?(r(m,f),u(m,f)):f.isMeshStandardMaterial?(r(m,f),h(m,f),f.isMeshPhysicalMaterial&&p(m,f,_)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),v(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?c(m,f,b,M):f.isSpriteMaterial?l(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Lt&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Lt&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const b=e.get(f),M=b.envMap,_=b.envMapRotation;M&&(m.envMap.value=M,qn.copy(_),qn.x*=-1,qn.y*=-1,qn.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(qn.y*=-1,qn.z*=-1),m.envMapRotation.value.setFromMatrix4(t_.makeRotationFromEuler(qn)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function c(m,f,b,M){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*b,m.scale.value=M*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function l(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function u(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function d(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function h(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,b){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Lt&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function v(m,f){const b=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function i_(i,e,t,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(b,M){const _=M.program;n.uniformBlockBinding(b,_)}function l(b,M){let _=s[b.id];_===void 0&&(g(b),_=u(b),s[b.id]=_,b.addEventListener("dispose",m));const T=M.program;n.updateUBOMapping(b,T);const y=e.render.frame;r[b.id]!==y&&(h(b),r[b.id]=y)}function u(b){const M=d();b.__bindingPointIndex=M;const _=i.createBuffer(),T=b.__size,y=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,T,y),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,_),_}function d(){for(let b=0;b<a;b++)if(o.indexOf(b)===-1)return o.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(b){const M=s[b.id],_=b.uniforms,T=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let y=0,C=_.length;y<C;y++){const L=Array.isArray(_[y])?_[y]:[_[y]];for(let S=0,x=L.length;S<x;S++){const D=L[S];if(p(D,y,S,T)===!0){const k=D.__offset,F=Array.isArray(D.value)?D.value:[D.value];let V=0;for(let X=0;X<F.length;X++){const B=F[X],K=v(B);typeof B=="number"||typeof B=="boolean"?(D.__data[0]=B,i.bufferSubData(i.UNIFORM_BUFFER,k+V,D.__data)):B.isMatrix3?(D.__data[0]=B.elements[0],D.__data[1]=B.elements[1],D.__data[2]=B.elements[2],D.__data[3]=0,D.__data[4]=B.elements[3],D.__data[5]=B.elements[4],D.__data[6]=B.elements[5],D.__data[7]=0,D.__data[8]=B.elements[6],D.__data[9]=B.elements[7],D.__data[10]=B.elements[8],D.__data[11]=0):(B.toArray(D.__data,V),V+=K.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,k,D.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(b,M,_,T){const y=b.value,C=M+"_"+_;if(T[C]===void 0)return typeof y=="number"||typeof y=="boolean"?T[C]=y:T[C]=y.clone(),!0;{const L=T[C];if(typeof y=="number"||typeof y=="boolean"){if(L!==y)return T[C]=y,!0}else if(L.equals(y)===!1)return L.copy(y),!0}return!1}function g(b){const M=b.uniforms;let _=0;const T=16;for(let C=0,L=M.length;C<L;C++){const S=Array.isArray(M[C])?M[C]:[M[C]];for(let x=0,D=S.length;x<D;x++){const k=S[x],F=Array.isArray(k.value)?k.value:[k.value];for(let V=0,X=F.length;V<X;V++){const B=F[V],K=v(B),z=_%T,ee=z%K.boundary,le=z+ee;_+=ee,le!==0&&T-le<K.storage&&(_+=T-le),k.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=_,_+=K.storage}}}const y=_%T;return y>0&&(_+=T-y),b.__size=_,b.__cache={},this}function v(b){const M={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(M.boundary=4,M.storage=4):b.isVector2?(M.boundary=8,M.storage=8):b.isVector3||b.isColor?(M.boundary=16,M.storage=12):b.isVector4?(M.boundary=16,M.storage=16):b.isMatrix3?(M.boundary=48,M.storage=48):b.isMatrix4?(M.boundary=64,M.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),M}function m(b){const M=b.target;M.removeEventListener("dispose",m);const _=o.indexOf(M.__bindingPointIndex);o.splice(_,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function f(){for(const b in s)i.deleteBuffer(s[b]);o=[],s={},r={}}return{bind:c,update:l,dispose:f}}class s_{constructor(e={}){const{canvas:t=zd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:h=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,f=null;const b=[],M=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Vn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const _=this;let T=!1;this._outputColorSpace=Xt;let y=0,C=0,L=null,S=-1,x=null;const D=new At,k=new At;let F=null;const V=new Ye(0);let X=0,B=t.width,K=t.height,z=1,ee=null,le=null;const pe=new At(0,0,B,K),Ue=new At(0,0,B,K);let oe=!1;const Le=new jl;let He=!1,Y=!1;const j=new Et,fe=new G,xe=new At,ye={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let We=!1;function yt(){return L===null?z:1}let R=n;function tt(E,U){return t.getContext(E,U)}try{const E={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${No}`),t.addEventListener("webglcontextlost",ae,!1),t.addEventListener("webglcontextrestored",ge,!1),t.addEventListener("webglcontextcreationerror",ne,!1),R===null){const U="webgl2";if(R=tt(U,E),R===null)throw tt(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Fe,De,ve,Je,Ee,ke,gt,lt,w,A,O,q,J,Q,Te,se,be,Se,re,ue,Re,we,ce,Oe;function P(){Fe=new pm(R),Fe.init(),we=new jg(R,Fe),De=new am(R,Fe,e,we),ve=new qg(R,Fe),De.reversedDepthBuffer&&h&&ve.buffers.depth.setReversed(!0),Je=new _m(R),Ee=new kg,ke=new Kg(R,Fe,ve,Ee,De,we,Je),gt=new cm(_),lt=new fm(_),w=new Sh(R),ce=new rm(R,w),A=new mm(R,w,Je,ce),O=new Am(R,A,w,Je),re=new vm(R,De,ke),se=new lm(Ee),q=new Lg(_,gt,lt,Fe,De,ce,se),J=new n_(_,Ee),Q=new Bg,Te=new Hg(Fe),Se=new sm(_,gt,lt,ve,O,p,c),be=new Yg(_,O,De),Oe=new i_(R,Je,De,ve),ue=new om(R,Fe,Je),Re=new gm(R,Fe,Je),Je.programs=q.programs,_.capabilities=De,_.extensions=Fe,_.properties=Ee,_.renderLists=Q,_.shadowMap=be,_.state=ve,_.info=Je}P();const ie=new e_(_,R);this.xr=ie,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){const E=Fe.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Fe.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return z},this.setPixelRatio=function(E){E!==void 0&&(z=E,this.setSize(B,K,!1))},this.getSize=function(E){return E.set(B,K)},this.setSize=function(E,U,H=!0){if(ie.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}B=E,K=U,t.width=Math.floor(E*z),t.height=Math.floor(U*z),H===!0&&(t.style.width=E+"px",t.style.height=U+"px"),this.setViewport(0,0,E,U)},this.getDrawingBufferSize=function(E){return E.set(B*z,K*z).floor()},this.setDrawingBufferSize=function(E,U,H){B=E,K=U,z=H,t.width=Math.floor(E*H),t.height=Math.floor(U*H),this.setViewport(0,0,E,U)},this.getCurrentViewport=function(E){return E.copy(D)},this.getViewport=function(E){return E.copy(pe)},this.setViewport=function(E,U,H,W){E.isVector4?pe.set(E.x,E.y,E.z,E.w):pe.set(E,U,H,W),ve.viewport(D.copy(pe).multiplyScalar(z).round())},this.getScissor=function(E){return E.copy(Ue)},this.setScissor=function(E,U,H,W){E.isVector4?Ue.set(E.x,E.y,E.z,E.w):Ue.set(E,U,H,W),ve.scissor(k.copy(Ue).multiplyScalar(z).round())},this.getScissorTest=function(){return oe},this.setScissorTest=function(E){ve.setScissorTest(oe=E)},this.setOpaqueSort=function(E){ee=E},this.setTransparentSort=function(E){le=E},this.getClearColor=function(E){return E.copy(Se.getClearColor())},this.setClearColor=function(){Se.setClearColor(...arguments)},this.getClearAlpha=function(){return Se.getClearAlpha()},this.setClearAlpha=function(){Se.setClearAlpha(...arguments)},this.clear=function(E=!0,U=!0,H=!0){let W=0;if(E){let N=!1;if(L!==null){const te=L.texture.format;N=te===Go||te===Vo||te===zo}if(N){const te=L.texture.type,he=te===vn||te===ti||te===ts||te===ns||te===Fo||te===Oo,Ae=Se.getClearColor(),_e=Se.getClearAlpha(),Ie=Ae.r,Be=Ae.g,Ce=Ae.b;he?(g[0]=Ie,g[1]=Be,g[2]=Ce,g[3]=_e,R.clearBufferuiv(R.COLOR,0,g)):(v[0]=Ie,v[1]=Be,v[2]=Ce,v[3]=_e,R.clearBufferiv(R.COLOR,0,v))}else W|=R.COLOR_BUFFER_BIT}U&&(W|=R.DEPTH_BUFFER_BIT),H&&(W|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),R.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ae,!1),t.removeEventListener("webglcontextrestored",ge,!1),t.removeEventListener("webglcontextcreationerror",ne,!1),Se.dispose(),Q.dispose(),Te.dispose(),Ee.dispose(),gt.dispose(),lt.dispose(),O.dispose(),ce.dispose(),Oe.dispose(),q.dispose(),ie.dispose(),ie.removeEventListener("sessionstart",Qt),ie.removeEventListener("sessionend",hs),dn.stop()};function ae(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function ge(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;const E=Je.autoReset,U=be.enabled,H=be.autoUpdate,W=be.needsUpdate,N=be.type;P(),Je.autoReset=E,be.enabled=U,be.autoUpdate=H,be.needsUpdate=W,be.type=N}function ne(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Z(E){const U=E.target;U.removeEventListener("dispose",Z),Me(U)}function Me(E){Ne(E),Ee.remove(E)}function Ne(E){const U=Ee.get(E).programs;U!==void 0&&(U.forEach(function(H){q.releaseProgram(H)}),E.isShaderMaterial&&q.releaseShaderCache(E))}this.renderBufferDirect=function(E,U,H,W,N,te){U===null&&(U=ye);const he=N.isMesh&&N.matrixWorld.determinant()<0,Ae=it(E,U,H,W,N);ve.setMaterial(W,he);let _e=H.index,Ie=1;if(W.wireframe===!0){if(_e=A.getWireframeAttribute(H),_e===void 0)return;Ie=2}const Be=H.drawRange,Ce=H.attributes.position;let Qe=Be.start*Ie,ot=(Be.start+Be.count)*Ie;te!==null&&(Qe=Math.max(Qe,te.start*Ie),ot=Math.min(ot,(te.start+te.count)*Ie)),_e!==null?(Qe=Math.max(Qe,0),ot=Math.min(ot,_e.count)):Ce!=null&&(Qe=Math.max(Qe,0),ot=Math.min(ot,Ce.count));const _t=ot-Qe;if(_t<0||_t===1/0)return;ce.setup(N,W,Ae,H,_e);let dt,ct=ue;if(_e!==null&&(dt=w.get(_e),ct=Re,ct.setIndex(dt)),N.isMesh)W.wireframe===!0?(ve.setLineWidth(W.wireframeLinewidth*yt()),ct.setMode(R.LINES)):ct.setMode(R.TRIANGLES);else if(N.isLine){let Pe=W.linewidth;Pe===void 0&&(Pe=1),ve.setLineWidth(Pe*yt()),N.isLineSegments?ct.setMode(R.LINES):N.isLineLoop?ct.setMode(R.LINE_LOOP):ct.setMode(R.LINE_STRIP)}else N.isPoints?ct.setMode(R.POINTS):N.isSprite&&ct.setMode(R.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)os("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ct.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(Fe.get("WEBGL_multi_draw"))ct.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const Pe=N._multiDrawStarts,ft=N._multiDrawCounts,Ze=N._multiDrawCount,zt=_e?w.get(_e).bytesPerElement:1,si=Ee.get(W).currentProgram.getUniforms();for(let Vt=0;Vt<Ze;Vt++)si.setValue(R,"_gl_DrawID",Vt),ct.render(Pe[Vt]/zt,ft[Vt])}else if(N.isInstancedMesh)ct.renderInstances(Qe,_t,N.count);else if(H.isInstancedBufferGeometry){const Pe=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,ft=Math.min(H.instanceCount,Pe);ct.renderInstances(Qe,_t,ft)}else ct.render(Qe,_t)};function nt(E,U,H){E.transparent===!0&&E.side===an&&E.forceSinglePass===!1?(E.side=Lt,E.needsUpdate=!0,Xe(E,U,H),E.side=Pn,E.needsUpdate=!0,Xe(E,U,H),E.side=an):Xe(E,U,H)}this.compile=function(E,U,H=null){H===null&&(H=E),f=Te.get(H),f.init(U),M.push(f),H.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),E!==H&&E.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),f.setupLights();const W=new Set;return E.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const te=N.material;if(te)if(Array.isArray(te))for(let he=0;he<te.length;he++){const Ae=te[he];nt(Ae,H,N),W.add(Ae)}else nt(te,H,N),W.add(te)}),f=M.pop(),W},this.compileAsync=function(E,U,H=null){const W=this.compile(E,U,H);return new Promise(N=>{function te(){if(W.forEach(function(he){Ee.get(he).currentProgram.isReady()&&W.delete(he)}),W.size===0){N(E);return}setTimeout(te,10)}Fe.get("KHR_parallel_shader_compile")!==null?te():setTimeout(te,10)})};let je=null;function Yt(E){je&&je(E)}function Qt(){dn.stop()}function hs(){dn.start()}const dn=new ec;dn.setAnimationLoop(Yt),typeof self<"u"&&dn.setContext(self),this.setAnimationLoop=function(E){je=E,ie.setAnimationLoop(E),E===null?dn.stop():dn.start()},ie.addEventListener("sessionstart",Qt),ie.addEventListener("sessionend",hs),this.render=function(E,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),ie.enabled===!0&&ie.isPresenting===!0&&(ie.cameraAutoUpdate===!0&&ie.updateCamera(U),U=ie.getCamera()),E.isScene===!0&&E.onBeforeRender(_,E,U,L),f=Te.get(E,M.length),f.init(U),M.push(f),j.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Le.setFromProjectionMatrix(j,mn,U.reversedDepth),Y=this.localClippingEnabled,He=se.init(this.clippingPlanes,Y),m=Q.get(E,b.length),m.init(),b.push(m),ie.enabled===!0&&ie.isPresenting===!0){const te=_.xr.getDepthSensingMesh();te!==null&&Ni(te,U,-1/0,_.sortObjects)}Ni(E,U,0,_.sortObjects),m.finish(),_.sortObjects===!0&&m.sort(ee,le),We=ie.enabled===!1||ie.isPresenting===!1||ie.hasDepthSensing()===!1,We&&Se.addToRenderList(m,E),this.info.render.frame++,He===!0&&se.beginShadows();const H=f.state.shadowsArray;be.render(H,E,U),He===!0&&se.endShadows(),this.info.autoReset===!0&&this.info.reset();const W=m.opaque,N=m.transmissive;if(f.setupLights(),U.isArrayCamera){const te=U.cameras;if(N.length>0)for(let he=0,Ae=te.length;he<Ae;he++){const _e=te[he];$(W,N,E,_e)}We&&Se.render(E);for(let he=0,Ae=te.length;he<Ae;he++){const _e=te[he];I(m,E,_e,_e.viewport)}}else N.length>0&&$(W,N,E,U),We&&Se.render(E),I(m,E,U);L!==null&&C===0&&(ke.updateMultisampleRenderTarget(L),ke.updateRenderTargetMipmap(L)),E.isScene===!0&&E.onAfterRender(_,E,U),ce.resetDefaultState(),S=-1,x=null,M.pop(),M.length>0?(f=M[M.length-1],He===!0&&se.setGlobalState(_.clippingPlanes,f.state.camera)):f=null,b.pop(),b.length>0?m=b[b.length-1]:m=null};function Ni(E,U,H,W){if(E.visible===!1)return;if(E.layers.test(U.layers)){if(E.isGroup)H=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(U);else if(E.isLight)f.pushLight(E),E.castShadow&&f.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||Le.intersectsSprite(E)){W&&xe.setFromMatrixPosition(E.matrixWorld).applyMatrix4(j);const he=O.update(E),Ae=E.material;Ae.visible&&m.push(E,he,Ae,H,xe.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||Le.intersectsObject(E))){const he=O.update(E),Ae=E.material;if(W&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),xe.copy(E.boundingSphere.center)):(he.boundingSphere===null&&he.computeBoundingSphere(),xe.copy(he.boundingSphere.center)),xe.applyMatrix4(E.matrixWorld).applyMatrix4(j)),Array.isArray(Ae)){const _e=he.groups;for(let Ie=0,Be=_e.length;Ie<Be;Ie++){const Ce=_e[Ie],Qe=Ae[Ce.materialIndex];Qe&&Qe.visible&&m.push(E,he,Qe,H,xe.z,Ce)}}else Ae.visible&&m.push(E,he,Ae,H,xe.z,null)}}const te=E.children;for(let he=0,Ae=te.length;he<Ae;he++)Ni(te[he],U,H,W)}function I(E,U,H,W){const N=E.opaque,te=E.transmissive,he=E.transparent;f.setupLightsView(H),He===!0&&se.setGlobalState(_.clippingPlanes,H),W&&ve.viewport(D.copy(W)),N.length>0&&me(N,U,H),te.length>0&&me(te,U,H),he.length>0&&me(he,U,H),ve.buffers.depth.setTest(!0),ve.buffers.depth.setMask(!0),ve.buffers.color.setMask(!0),ve.setPolygonOffset(!1)}function $(E,U,H,W){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[W.id]===void 0&&(f.state.transmissionRenderTarget[W.id]=new ni(1,1,{generateMipmaps:!0,type:Fe.has("EXT_color_buffer_half_float")||Fe.has("EXT_color_buffer_float")?as:vn,minFilter:ei,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:$e.workingColorSpace}));const te=f.state.transmissionRenderTarget[W.id],he=W.viewport||D;te.setSize(he.z*_.transmissionResolutionScale,he.w*_.transmissionResolutionScale);const Ae=_.getRenderTarget(),_e=_.getActiveCubeFace(),Ie=_.getActiveMipmapLevel();_.setRenderTarget(te),_.getClearColor(V),X=_.getClearAlpha(),X<1&&_.setClearColor(16777215,.5),_.clear(),We&&Se.render(H);const Be=_.toneMapping;_.toneMapping=Vn;const Ce=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),f.setupLightsView(W),He===!0&&se.setGlobalState(_.clippingPlanes,W),me(E,H,W),ke.updateMultisampleRenderTarget(te),ke.updateRenderTargetMipmap(te),Fe.has("WEBGL_multisampled_render_to_texture")===!1){let Qe=!1;for(let ot=0,_t=U.length;ot<_t;ot++){const dt=U[ot],ct=dt.object,Pe=dt.geometry,ft=dt.material,Ze=dt.group;if(ft.side===an&&ct.layers.test(W.layers)){const zt=ft.side;ft.side=Lt,ft.needsUpdate=!0,ze(ct,H,W,Pe,ft,Ze),ft.side=zt,ft.needsUpdate=!0,Qe=!0}}Qe===!0&&(ke.updateMultisampleRenderTarget(te),ke.updateRenderTargetMipmap(te))}_.setRenderTarget(Ae,_e,Ie),_.setClearColor(V,X),Ce!==void 0&&(W.viewport=Ce),_.toneMapping=Be}function me(E,U,H){const W=U.isScene===!0?U.overrideMaterial:null;for(let N=0,te=E.length;N<te;N++){const he=E[N],Ae=he.object,_e=he.geometry,Ie=he.group;let Be=he.material;Be.allowOverride===!0&&W!==null&&(Be=W),Ae.layers.test(H.layers)&&ze(Ae,U,H,_e,Be,Ie)}}function ze(E,U,H,W,N,te){E.onBeforeRender(_,U,H,W,N,te),E.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),N.onBeforeRender(_,U,H,W,E,te),N.transparent===!0&&N.side===an&&N.forceSinglePass===!1?(N.side=Lt,N.needsUpdate=!0,_.renderBufferDirect(H,U,W,N,E,te),N.side=Pn,N.needsUpdate=!0,_.renderBufferDirect(H,U,W,N,E,te),N.side=an):_.renderBufferDirect(H,U,W,N,E,te),E.onAfterRender(_,U,H,W,N,te)}function Xe(E,U,H){U.isScene!==!0&&(U=ye);const W=Ee.get(E),N=f.state.lights,te=f.state.shadowsArray,he=N.state.version,Ae=q.getParameters(E,N.state,te,U,H),_e=q.getProgramCacheKey(Ae);let Ie=W.programs;W.environment=E.isMeshStandardMaterial?U.environment:null,W.fog=U.fog,W.envMap=(E.isMeshStandardMaterial?lt:gt).get(E.envMap||W.environment),W.envMapRotation=W.environment!==null&&E.envMap===null?U.environmentRotation:E.envMapRotation,Ie===void 0&&(E.addEventListener("dispose",Z),Ie=new Map,W.programs=Ie);let Be=Ie.get(_e);if(Be!==void 0){if(W.currentProgram===Be&&W.lightsStateVersion===he)return rt(E,Ae),Be}else Ae.uniforms=q.getUniforms(E),E.onBeforeCompile(Ae,_),Be=q.acquireProgram(Ae,_e),Ie.set(_e,Be),W.uniforms=Ae.uniforms;const Ce=W.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ce.clippingPlanes=se.uniform),rt(E,Ae),W.needsLights=Ot(E),W.lightsStateVersion=he,W.needsLights&&(Ce.ambientLightColor.value=N.state.ambient,Ce.lightProbe.value=N.state.probe,Ce.directionalLights.value=N.state.directional,Ce.directionalLightShadows.value=N.state.directionalShadow,Ce.spotLights.value=N.state.spot,Ce.spotLightShadows.value=N.state.spotShadow,Ce.rectAreaLights.value=N.state.rectArea,Ce.ltc_1.value=N.state.rectAreaLTC1,Ce.ltc_2.value=N.state.rectAreaLTC2,Ce.pointLights.value=N.state.point,Ce.pointLightShadows.value=N.state.pointShadow,Ce.hemisphereLights.value=N.state.hemi,Ce.directionalShadowMap.value=N.state.directionalShadowMap,Ce.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Ce.spotShadowMap.value=N.state.spotShadowMap,Ce.spotLightMatrix.value=N.state.spotLightMatrix,Ce.spotLightMap.value=N.state.spotLightMap,Ce.pointShadowMap.value=N.state.pointShadowMap,Ce.pointShadowMatrix.value=N.state.pointShadowMatrix),W.currentProgram=Be,W.uniformsList=null,Be}function ht(E){if(E.uniformsList===null){const U=E.currentProgram.getUniforms();E.uniformsList=Ys.seqWithValue(U.seq,E.uniforms)}return E.uniformsList}function rt(E,U){const H=Ee.get(E);H.outputColorSpace=U.outputColorSpace,H.batching=U.batching,H.batchingColor=U.batchingColor,H.instancing=U.instancing,H.instancingColor=U.instancingColor,H.instancingMorph=U.instancingMorph,H.skinning=U.skinning,H.morphTargets=U.morphTargets,H.morphNormals=U.morphNormals,H.morphColors=U.morphColors,H.morphTargetsCount=U.morphTargetsCount,H.numClippingPlanes=U.numClippingPlanes,H.numIntersection=U.numClipIntersection,H.vertexAlphas=U.vertexAlphas,H.vertexTangents=U.vertexTangents,H.toneMapping=U.toneMapping}function it(E,U,H,W,N){U.isScene!==!0&&(U=ye),ke.resetTextureUnits();const te=U.fog,he=W.isMeshStandardMaterial?U.environment:null,Ae=L===null?_.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:Ui,_e=(W.isMeshStandardMaterial?lt:gt).get(W.envMap||he),Ie=W.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,Be=!!H.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Ce=!!H.morphAttributes.position,Qe=!!H.morphAttributes.normal,ot=!!H.morphAttributes.color;let _t=Vn;W.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(_t=_.toneMapping);const dt=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,ct=dt!==void 0?dt.length:0,Pe=Ee.get(W),ft=f.state.lights;if(He===!0&&(Y===!0||E!==x)){const Pt=E===x&&W.id===S;se.setState(W,E,Pt)}let Ze=!1;W.version===Pe.__version?(Pe.needsLights&&Pe.lightsStateVersion!==ft.state.version||Pe.outputColorSpace!==Ae||N.isBatchedMesh&&Pe.batching===!1||!N.isBatchedMesh&&Pe.batching===!0||N.isBatchedMesh&&Pe.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&Pe.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&Pe.instancing===!1||!N.isInstancedMesh&&Pe.instancing===!0||N.isSkinnedMesh&&Pe.skinning===!1||!N.isSkinnedMesh&&Pe.skinning===!0||N.isInstancedMesh&&Pe.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&Pe.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&Pe.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&Pe.instancingMorph===!1&&N.morphTexture!==null||Pe.envMap!==_e||W.fog===!0&&Pe.fog!==te||Pe.numClippingPlanes!==void 0&&(Pe.numClippingPlanes!==se.numPlanes||Pe.numIntersection!==se.numIntersection)||Pe.vertexAlphas!==Ie||Pe.vertexTangents!==Be||Pe.morphTargets!==Ce||Pe.morphNormals!==Qe||Pe.morphColors!==ot||Pe.toneMapping!==_t||Pe.morphTargetsCount!==ct)&&(Ze=!0):(Ze=!0,Pe.__version=W.version);let zt=Pe.currentProgram;Ze===!0&&(zt=Xe(W,U,N));let si=!1,Vt=!1,Fi=!1;const pt=zt.getUniforms(),qt=Pe.uniforms;if(ve.useProgram(zt.program)&&(si=!0,Vt=!0,Fi=!0),W.id!==S&&(S=W.id,Vt=!0),si||x!==E){ve.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),pt.setValue(R,"projectionMatrix",E.projectionMatrix),pt.setValue(R,"viewMatrix",E.matrixWorldInverse);const Nt=pt.map.cameraPosition;Nt!==void 0&&Nt.setValue(R,fe.setFromMatrixPosition(E.matrixWorld)),De.logarithmicDepthBuffer&&pt.setValue(R,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&pt.setValue(R,"isOrthographic",E.isOrthographicCamera===!0),x!==E&&(x=E,Vt=!0,Fi=!0)}if(N.isSkinnedMesh){pt.setOptional(R,N,"bindMatrix"),pt.setOptional(R,N,"bindMatrixInverse");const Pt=N.skeleton;Pt&&(Pt.boneTexture===null&&Pt.computeBoneTexture(),pt.setValue(R,"boneTexture",Pt.boneTexture,ke))}N.isBatchedMesh&&(pt.setOptional(R,N,"batchingTexture"),pt.setValue(R,"batchingTexture",N._matricesTexture,ke),pt.setOptional(R,N,"batchingIdTexture"),pt.setValue(R,"batchingIdTexture",N._indirectTexture,ke),pt.setOptional(R,N,"batchingColorTexture"),N._colorsTexture!==null&&pt.setValue(R,"batchingColorTexture",N._colorsTexture,ke));const Kt=H.morphAttributes;if((Kt.position!==void 0||Kt.normal!==void 0||Kt.color!==void 0)&&re.update(N,H,zt),(Vt||Pe.receiveShadow!==N.receiveShadow)&&(Pe.receiveShadow=N.receiveShadow,pt.setValue(R,"receiveShadow",N.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(qt.envMap.value=_e,qt.flipEnvMap.value=_e.isCubeTexture&&_e.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&U.environment!==null&&(qt.envMapIntensity.value=U.environmentIntensity),Vt&&(pt.setValue(R,"toneMappingExposure",_.toneMappingExposure),Pe.needsLights&&Ct(qt,Fi),te&&W.fog===!0&&J.refreshFogUniforms(qt,te),J.refreshMaterialUniforms(qt,W,z,K,f.state.transmissionRenderTarget[E.id]),Ys.upload(R,ht(Pe),qt,ke)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(Ys.upload(R,ht(Pe),qt,ke),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&pt.setValue(R,"center",N.center),pt.setValue(R,"modelViewMatrix",N.modelViewMatrix),pt.setValue(R,"normalMatrix",N.normalMatrix),pt.setValue(R,"modelMatrix",N.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const Pt=W.uniformsGroups;for(let Nt=0,ir=Pt.length;Nt<ir;Nt++){const Gn=Pt[Nt];Oe.update(Gn,zt),Oe.bind(Gn,zt)}}return zt}function Ct(E,U){E.ambientLightColor.needsUpdate=U,E.lightProbe.needsUpdate=U,E.directionalLights.needsUpdate=U,E.directionalLightShadows.needsUpdate=U,E.pointLights.needsUpdate=U,E.pointLightShadows.needsUpdate=U,E.spotLights.needsUpdate=U,E.spotLightShadows.needsUpdate=U,E.rectAreaLights.needsUpdate=U,E.hemisphereLights.needsUpdate=U}function Ot(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return y},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(E,U,H){const W=Ee.get(E);W.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),Ee.get(E.texture).__webglTexture=U,Ee.get(E.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:H,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,U){const H=Ee.get(E);H.__webglFramebuffer=U,H.__useDefaultFramebuffer=U===void 0};const hn=R.createFramebuffer();this.setRenderTarget=function(E,U=0,H=0){L=E,y=U,C=H;let W=!0,N=null,te=!1,he=!1;if(E){const _e=Ee.get(E);if(_e.__useDefaultFramebuffer!==void 0)ve.bindFramebuffer(R.FRAMEBUFFER,null),W=!1;else if(_e.__webglFramebuffer===void 0)ke.setupRenderTarget(E);else if(_e.__hasExternalTextures)ke.rebindTextures(E,Ee.get(E.texture).__webglTexture,Ee.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Ce=E.depthTexture;if(_e.__boundDepthTexture!==Ce){if(Ce!==null&&Ee.has(Ce)&&(E.width!==Ce.image.width||E.height!==Ce.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ke.setupDepthRenderbuffer(E)}}const Ie=E.texture;(Ie.isData3DTexture||Ie.isDataArrayTexture||Ie.isCompressedArrayTexture)&&(he=!0);const Be=Ee.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Be[U])?N=Be[U][H]:N=Be[U],te=!0):E.samples>0&&ke.useMultisampledRTT(E)===!1?N=Ee.get(E).__webglMultisampledFramebuffer:Array.isArray(Be)?N=Be[H]:N=Be,D.copy(E.viewport),k.copy(E.scissor),F=E.scissorTest}else D.copy(pe).multiplyScalar(z).floor(),k.copy(Ue).multiplyScalar(z).floor(),F=oe;if(H!==0&&(N=hn),ve.bindFramebuffer(R.FRAMEBUFFER,N)&&W&&ve.drawBuffers(E,N),ve.viewport(D),ve.scissor(k),ve.setScissorTest(F),te){const _e=Ee.get(E.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+U,_e.__webglTexture,H)}else if(he){const _e=U;for(let Ie=0;Ie<E.textures.length;Ie++){const Be=Ee.get(E.textures[Ie]);R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0+Ie,Be.__webglTexture,H,_e)}}else if(E!==null&&H!==0){const _e=Ee.get(E.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,_e.__webglTexture,H)}S=-1},this.readRenderTargetPixels=function(E,U,H,W,N,te,he,Ae=0){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let _e=Ee.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&he!==void 0&&(_e=_e[he]),_e){ve.bindFramebuffer(R.FRAMEBUFFER,_e);try{const Ie=E.textures[Ae],Be=Ie.format,Ce=Ie.type;if(!De.textureFormatReadable(Be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!De.textureTypeReadable(Ce)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=E.width-W&&H>=0&&H<=E.height-N&&(E.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+Ae),R.readPixels(U,H,W,N,we.convert(Be),we.convert(Ce),te))}finally{const Ie=L!==null?Ee.get(L).__webglFramebuffer:null;ve.bindFramebuffer(R.FRAMEBUFFER,Ie)}}},this.readRenderTargetPixelsAsync=async function(E,U,H,W,N,te,he,Ae=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let _e=Ee.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&he!==void 0&&(_e=_e[he]),_e)if(U>=0&&U<=E.width-W&&H>=0&&H<=E.height-N){ve.bindFramebuffer(R.FRAMEBUFFER,_e);const Ie=E.textures[Ae],Be=Ie.format,Ce=Ie.type;if(!De.textureFormatReadable(Be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!De.textureTypeReadable(Ce))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Qe=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,Qe),R.bufferData(R.PIXEL_PACK_BUFFER,te.byteLength,R.STREAM_READ),E.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+Ae),R.readPixels(U,H,W,N,we.convert(Be),we.convert(Ce),0);const ot=L!==null?Ee.get(L).__webglFramebuffer:null;ve.bindFramebuffer(R.FRAMEBUFFER,ot);const _t=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await Vd(R,_t,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,Qe),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,te),R.deleteBuffer(Qe),R.deleteSync(_t),te}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,U=null,H=0){const W=Math.pow(2,-H),N=Math.floor(E.image.width*W),te=Math.floor(E.image.height*W),he=U!==null?U.x:0,Ae=U!==null?U.y:0;ke.setTexture2D(E,0),R.copyTexSubImage2D(R.TEXTURE_2D,H,0,0,he,Ae,N,te),ve.unbindTexture()};const xn=R.createFramebuffer(),Bi=R.createFramebuffer();this.copyTextureToTexture=function(E,U,H=null,W=null,N=0,te=null){te===null&&(N!==0?(os("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),te=N,N=0):te=0);let he,Ae,_e,Ie,Be,Ce,Qe,ot,_t;const dt=E.isCompressedTexture?E.mipmaps[te]:E.image;if(H!==null)he=H.max.x-H.min.x,Ae=H.max.y-H.min.y,_e=H.isBox3?H.max.z-H.min.z:1,Ie=H.min.x,Be=H.min.y,Ce=H.isBox3?H.min.z:0;else{const Kt=Math.pow(2,-N);he=Math.floor(dt.width*Kt),Ae=Math.floor(dt.height*Kt),E.isDataArrayTexture?_e=dt.depth:E.isData3DTexture?_e=Math.floor(dt.depth*Kt):_e=1,Ie=0,Be=0,Ce=0}W!==null?(Qe=W.x,ot=W.y,_t=W.z):(Qe=0,ot=0,_t=0);const ct=we.convert(U.format),Pe=we.convert(U.type);let ft;U.isData3DTexture?(ke.setTexture3D(U,0),ft=R.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(ke.setTexture2DArray(U,0),ft=R.TEXTURE_2D_ARRAY):(ke.setTexture2D(U,0),ft=R.TEXTURE_2D),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,U.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,U.unpackAlignment);const Ze=R.getParameter(R.UNPACK_ROW_LENGTH),zt=R.getParameter(R.UNPACK_IMAGE_HEIGHT),si=R.getParameter(R.UNPACK_SKIP_PIXELS),Vt=R.getParameter(R.UNPACK_SKIP_ROWS),Fi=R.getParameter(R.UNPACK_SKIP_IMAGES);R.pixelStorei(R.UNPACK_ROW_LENGTH,dt.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,dt.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Ie),R.pixelStorei(R.UNPACK_SKIP_ROWS,Be),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Ce);const pt=E.isDataArrayTexture||E.isData3DTexture,qt=U.isDataArrayTexture||U.isData3DTexture;if(E.isDepthTexture){const Kt=Ee.get(E),Pt=Ee.get(U),Nt=Ee.get(Kt.__renderTarget),ir=Ee.get(Pt.__renderTarget);ve.bindFramebuffer(R.READ_FRAMEBUFFER,Nt.__webglFramebuffer),ve.bindFramebuffer(R.DRAW_FRAMEBUFFER,ir.__webglFramebuffer);for(let Gn=0;Gn<_e;Gn++)pt&&(R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Ee.get(E).__webglTexture,N,Ce+Gn),R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Ee.get(U).__webglTexture,te,_t+Gn)),R.blitFramebuffer(Ie,Be,he,Ae,Qe,ot,he,Ae,R.DEPTH_BUFFER_BIT,R.NEAREST);ve.bindFramebuffer(R.READ_FRAMEBUFFER,null),ve.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else if(N!==0||E.isRenderTargetTexture||Ee.has(E)){const Kt=Ee.get(E),Pt=Ee.get(U);ve.bindFramebuffer(R.READ_FRAMEBUFFER,xn),ve.bindFramebuffer(R.DRAW_FRAMEBUFFER,Bi);for(let Nt=0;Nt<_e;Nt++)pt?R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Kt.__webglTexture,N,Ce+Nt):R.framebufferTexture2D(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Kt.__webglTexture,N),qt?R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Pt.__webglTexture,te,_t+Nt):R.framebufferTexture2D(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Pt.__webglTexture,te),N!==0?R.blitFramebuffer(Ie,Be,he,Ae,Qe,ot,he,Ae,R.COLOR_BUFFER_BIT,R.NEAREST):qt?R.copyTexSubImage3D(ft,te,Qe,ot,_t+Nt,Ie,Be,he,Ae):R.copyTexSubImage2D(ft,te,Qe,ot,Ie,Be,he,Ae);ve.bindFramebuffer(R.READ_FRAMEBUFFER,null),ve.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else qt?E.isDataTexture||E.isData3DTexture?R.texSubImage3D(ft,te,Qe,ot,_t,he,Ae,_e,ct,Pe,dt.data):U.isCompressedArrayTexture?R.compressedTexSubImage3D(ft,te,Qe,ot,_t,he,Ae,_e,ct,dt.data):R.texSubImage3D(ft,te,Qe,ot,_t,he,Ae,_e,ct,Pe,dt):E.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,te,Qe,ot,he,Ae,ct,Pe,dt.data):E.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,te,Qe,ot,dt.width,dt.height,ct,dt.data):R.texSubImage2D(R.TEXTURE_2D,te,Qe,ot,he,Ae,ct,Pe,dt);R.pixelStorei(R.UNPACK_ROW_LENGTH,Ze),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,zt),R.pixelStorei(R.UNPACK_SKIP_PIXELS,si),R.pixelStorei(R.UNPACK_SKIP_ROWS,Vt),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Fi),te===0&&U.generateMipmaps&&R.generateMipmap(ft),ve.unbindTexture()},this.initRenderTarget=function(E){Ee.get(E).__webglFramebuffer===void 0&&ke.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?ke.setTextureCube(E,0):E.isData3DTexture?ke.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?ke.setTexture2DArray(E,0):ke.setTexture2D(E,0),ve.unbindTexture()},this.resetState=function(){y=0,C=0,L=null,ve.reset(),ce.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return mn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=$e._getDrawingBufferColorSpace(e),t.unpackColorSpace=$e._getUnpackColorSpace()}}const Or=.18,ja=3.2;class r_{prevButtons=[];lastActive=0;axis(e){const t=Math.abs(e);return t<Or?0:Math.sign(e)*((t-Or)/(1-Or))}poll(e,t){const n=typeof navigator.getGamepads=="function"?navigator.getGamepads():[],s=Array.from(n).find(d=>!!d&&d.connected);if(!s)return;const r=s.buttons.map(d=>d.pressed),o=d=>r[d]&&!this.prevButtons[d],a=this.axis(s.axes[0]??0),c=-this.axis(s.axes[1]??0),l=this.axis(s.axes[2]??0),u=this.axis(s.axes[3]??0);(a||c||l||u||r.some(Boolean))&&(this.lastActive=performance.now()),e.moveX+=a,e.moveZ+=c,e.lookDX+=l*ja*t,e.lookDY+=u*ja*t,r[0]&&(e.jump=!0),r[1]&&(e.sneak=!0),r[10]&&(e.sprint=!0),r[7]&&(e.primary=!0),r[6]&&(e.secondaryHold=!0),o(6)&&(e.secondaryTap=!0),o(5)&&(e.slotDelta+=1),o(4)&&(e.slotDelta-=1),o(9)&&(e.toggleDebug=!0),this.prevButtons=r}dispose(){}}function rc(i){i.moveX=0,i.moveZ=0,i.lookDX=0,i.lookDY=0,i.jump=!1,i.sneak=!1,i.sprint=!1,i.primary=!1,i.secondaryTap=!1,i.secondaryHold=!1,i.slotDelta=0,i.slotSelect=-1,i.toggleDebug=!1}function Ja(){const i={};return rc(i),i}class o_{state=Ja();sources=[];paused=!1;add(e){this.sources.push(e)}frame(e){const t=this.state;if(rc(t),this.paused){const s=Ja();for(const r of this.sources)r.poll(s,e);return t}for(const s of this.sources)s.poll(t,e);const n=Math.hypot(t.moveX,t.moveZ);return n>1&&(t.moveX/=n,t.moveZ/=n),t}dispose(){for(const e of this.sources)e.dispose();this.sources.length=0}}const Za=.0022;class a_{constructor(e){this.element=e,document.addEventListener("pointerlockerror",this.onLockError),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp),window.addEventListener("blur",this.onBlur),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("mousedown",this.onMouseDown),document.addEventListener("mouseup",this.onMouseUp),document.addEventListener("wheel",this.onWheel,{passive:!0}),document.addEventListener("contextmenu",this.onContextMenu)}element;keys=new Set;lookDX=0;lookDY=0;primary=!1;secondaryHold=!1;secondaryTap=!1;slotDelta=0;slotSelect=-1;toggleDebug=!1;lastActive=0;lockFailed=!1;enabled=!1;onKeyDown=e=>{if(!e.repeat){if(this.lastActive=performance.now(),this.keys.add(e.code),e.code.startsWith("Digit")){const t=Number(e.code.slice(5));t>=1&&t<=9?this.slotSelect=t-1:t===0&&(this.slotSelect=9)}e.code==="F3"&&(this.toggleDebug=!0,e.preventDefault()),(e.code==="Space"||e.code==="Tab")&&e.preventDefault()}};onKeyUp=e=>{this.keys.delete(e.code)};onBlur=()=>{this.keys.clear(),this.primary=!1,this.secondaryHold=!1};onMouseMove=e=>{this.active&&(this.lookDX+=e.movementX*Za,this.lookDY+=e.movementY*Za)};onMouseDown=e=>{this.active&&(this.lastActive=performance.now(),e.button===0&&(this.primary=!0),e.button===2&&(this.secondaryHold=!0,this.secondaryTap=!0))};onMouseUp=e=>{e.button===0&&(this.primary=!1),e.button===2&&(this.secondaryHold=!1)};onWheel=e=>{this.active&&(e.deltaY>0?this.slotDelta++:e.deltaY<0&&this.slotDelta--)};onContextMenu=e=>e.preventDefault();onLockError=()=>{this.lockFailed=!0};get locked(){return document.pointerLockElement===this.element}get active(){return this.locked||this.lockFailed&&this.enabled}async requestLock(){if(this.locked)return!0;if(!this.element.requestPointerLock)return this.lockFailed=!0,!1;const e=this.element.requestPointerLock;try{await e.call(this.element,{unadjustedMovement:!0})}catch{try{await e.call(this.element)}catch{return this.lockFailed=!0,!1}}return await new Promise(t=>setTimeout(t,50)),this.locked?(this.lockFailed=!1,!0):(this.lockFailed=!0,!1)}down(...e){for(const t of e)if(this.keys.has(t))return!0;return!1}poll(e){this.down("KeyW","ArrowUp")&&(e.moveZ+=1),this.down("KeyS","ArrowDown")&&(e.moveZ-=1),this.down("KeyD","ArrowRight")&&(e.moveX+=1),this.down("KeyA","ArrowLeft")&&(e.moveX-=1),this.down("Space")&&(e.jump=!0),this.down("ShiftLeft","ShiftRight")&&(e.sneak=!0),this.down("ControlLeft","ControlRight")&&(e.sprint=!0),e.lookDX+=this.lookDX,e.lookDY+=this.lookDY,this.lookDX=0,this.lookDY=0,this.primary&&(e.primary=!0),this.secondaryHold&&(e.secondaryHold=!0),this.secondaryTap&&(e.secondaryTap=!0),this.secondaryTap=!1,e.slotDelta+=this.slotDelta,this.slotDelta=0,this.slotSelect>=0&&(e.slotSelect=this.slotSelect),this.slotSelect=-1,this.toggleDebug&&(e.toggleDebug=!0),this.toggleDebug=!1}dispose(){document.removeEventListener("pointerlockerror",this.onLockError),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),window.removeEventListener("blur",this.onBlur),document.removeEventListener("mousemove",this.onMouseMove),document.removeEventListener("mousedown",this.onMouseDown),document.removeEventListener("mouseup",this.onMouseUp),document.removeEventListener("wheel",this.onWheel),document.removeEventListener("contextmenu",this.onContextMenu)}}const l_=.0082,c_=.0056,qi=56,u_=28,zr=.12,$a=220,d_=14;class h_{constructor(e){this.ui=e;const t={passive:!1};e.surface.addEventListener("touchstart",this.onStart,t),e.surface.addEventListener("touchmove",this.onMove,t),e.surface.addEventListener("touchend",this.onEnd,t),e.surface.addEventListener("touchcancel",this.onEnd,t),e.jumpButton.addEventListener("touchstart",this.onJumpStart,t),e.jumpButton.addEventListener("touchend",this.onJumpEnd,t),e.jumpButton.addEventListener("touchcancel",this.onJumpEnd,t),e.sneakButton.addEventListener("touchstart",this.onSneak,t),e.stickBase.hidden=!1}ui;stick=null;look=null;lookDX=0;lookDY=0;secondaryTap=!1;jumpHeld=!1;sneakOn=!1;lastActive=0;stickCenter(){const e=this.ui.stickBase.getBoundingClientRect();return{cx:e.left+e.width/2,cy:e.top+e.height/2}}onStickArea(e,t){const n=this.ui.stickBase.getBoundingClientRect(),s=u_;return e>=n.left-s&&e<=n.right+s&&t>=n.top-s&&t<=n.bottom+s}onStart=e=>{let t=!1;for(const n of Array.from(e.changedTouches))if(!n.target?.closest?.(".hotbar, .tbtn, .sbtn, .topbar, .overlay, .help-panel, .action-card, .result-panel, .bag-panel, .chat-panel, .side-btns"))if(t=!0,this.stick===null&&this.onStickArea(n.clientX,n.clientY)){const{cx:s,cy:r}=this.stickCenter();this.stick={id:n.identifier,ox:s,oy:r,dx:0,dy:0},this.moveStick(n.clientX,n.clientY)}else this.look===null&&(this.look={id:n.identifier,startX:n.clientX,startY:n.clientY,lastX:n.clientX,lastY:n.clientY,startTime:performance.now(),mode:"undecided"});t&&(this.lastActive=performance.now(),e.preventDefault())};onMove=e=>{(this.stick||this.look)&&e.preventDefault();for(const t of Array.from(e.changedTouches))if(this.stick&&t.identifier===this.stick.id)this.moveStick(t.clientX,t.clientY);else if(this.look&&t.identifier===this.look.id){const n=this.look,s=t.clientX-n.lastX,r=t.clientY-n.lastY;n.lastX=t.clientX,n.lastY=t.clientY,n.mode==="undecided"&&Math.hypot(t.clientX-n.startX,t.clientY-n.startY)>d_&&(n.mode="look"),n.mode!=="undecided"&&(this.lookDX+=s*l_,this.lookDY+=r*c_)}};moveStick(e,t){if(!this.stick)return;let n=e-this.stick.ox,s=t-this.stick.oy;const r=Math.hypot(n,s);r>qi&&(n*=qi/r,s*=qi/r),this.stick.dx=n,this.stick.dy=s,this.ui.stickKnob.style.transform=`translate(${n}px, ${s}px)`,this.ui.stickBase.classList.add("active")}onEnd=e=>{let t=!1;for(const n of Array.from(e.changedTouches))this.stick&&n.identifier===this.stick.id?(this.stick=null,this.ui.stickKnob.style.transform="translate(0px, 0px)",this.ui.stickBase.classList.remove("active"),t=!0):this.look&&n.identifier===this.look.id&&(this.look.mode==="undecided"&&performance.now()-this.look.startTime<$a&&(this.secondaryTap=!0),this.look=null,t=!0);t&&e.preventDefault()};onJumpStart=e=>{e.preventDefault(),this.jumpHeld=!0,this.ui.jumpButton.classList.add("active")};onJumpEnd=e=>{e.preventDefault(),this.jumpHeld=!1,this.ui.jumpButton.classList.remove("active")};onSneak=e=>{e.preventDefault(),this.sneakOn=!this.sneakOn,this.ui.sneakButton.classList.toggle("active",this.sneakOn),this.ui.onSneakToggle?.(this.sneakOn)};poll(e){if(this.stick){let t=this.stick.dx/qi,n=-this.stick.dy/qi;const s=Math.hypot(t,n);if(s<zr)t=n=0;else{const r=(s-zr)/(1-zr)/s;t*=r,n*=r}e.moveX+=t,e.moveZ+=n,n>.97&&(e.sprint=!0)}if(this.look){const t=this.look;t.mode==="undecided"&&performance.now()-t.startTime>=$a&&(t.mode="break"),t.mode==="break"&&(e.primary=!0)}e.lookDX+=this.lookDX,e.lookDY+=this.lookDY,this.lookDX=0,this.lookDY=0,this.secondaryTap&&(e.secondaryTap=!0),this.secondaryTap=!1,this.jumpHeld&&(e.jump=!0),this.sneakOn&&(e.sneak=!0)}dispose(){const e=this.ui.surface;e.removeEventListener("touchstart",this.onStart),e.removeEventListener("touchmove",this.onMove),e.removeEventListener("touchend",this.onEnd),e.removeEventListener("touchcancel",this.onEnd),this.ui.jumpButton.removeEventListener("touchstart",this.onJumpStart),this.ui.jumpButton.removeEventListener("touchend",this.onJumpEnd),this.ui.jumpButton.removeEventListener("touchcancel",this.onJumpEnd),this.ui.sneakButton.removeEventListener("touchstart",this.onSneak)}}const oc=0,f_=1,p_=2,Ji=3;function m_(i,e){const t=e.get("missing")??0,n=s=>e.get(s)??t;return i.defs.map(s=>{if(s.id==="air"||!s.textures)return{layer:oc,opaque:!1,castAO:!1,sameCull:!1,tex:[0,0,0,0,0,0],fluidKind:0,fluidHeight:0,panel:null};const r=s.fluid==="water"||s.id==="ice",o=s.solid&&!s.transparent||s.fluid==="lava",a=r?Ji:o?f_:p_,[c,l,u]=s.textures,d=n(l);let h=null;if(s.door){const[p,g]=mc[s.door.facing];if(!s.door.open)h=[p!==0?0:2,p<0||g<0?1:0];else{const v=g,m=-p;h=[v!==0?0:2,v<0||m<0?0:1]}}return{panel:h,layer:a,opaque:o,castAO:o&&!s.fluid||s.id==="leaves",sameCull:s.transparent,tex:[d,d,n(c),n(u),d,d],fluidKind:s.fluid==="water"?1:s.fluid==="lava"?2:0,fluidHeight:s.fluid?(8-s.fluidLevel)/9:0}})}const g_=15251610,__=.55;function yi(i,e,t,n){const s=new In(i,e,t),r=new Float32Array(s.attributes.position.count*3),o=new Ye(n),a=[.75,.75,1,.5,.85,.85];for(let c=0;c<6;c++)for(let l=0;l<4;l++){const u=(c*4+l)*3;r[u]=o.r*a[c],r[u+1]=o.g*a[c],r[u+2]=o.b*a[c]}return s.setAttribute("color",new Tt(r,3)),new wt(s,new ii({vertexColors:!0}))}function el(i,e="rgba(0,0,0,0.45)"){const t=document.createElement("canvas"),n=t.getContext("2d");n.font="bold 40px system-ui, sans-serif";const s=Math.ceil(n.measureText(i).width)+32;t.width=s,t.height=56,n.font="bold 40px system-ui, sans-serif",n.fillStyle=e,n.fillRect(0,0,s,56),n.fillStyle="#fff",n.textBaseline="middle",n.fillText(i,16,30);const r=new Jl(t);r.minFilter=cn;const o=new Kl(new Ql({map:r,depthTest:!0,transparent:!0})),a=.55;return o.scale.set(s/56*a,a,1),o}class v_{group=new gn;figures=new Map;constructor(e){e.add(this.group)}get count(){return this.figures.size}upsert(e){this.remove(e.idx);const t=gc(e.color),n=new Ye(t).multiplyScalar(__).getHex(),s=new gn,r=new gn,o=yi(.5,.7,.28,t);o.position.y=.75+.35;const a=yi(.48,.48,.48,g_);a.position.y=1.45+.24;const c=yi(.22,.75,.24,n);c.position.set(-.13,.375,0);const l=yi(.22,.75,.24,n);l.position.set(.13,.375,0);const u=yi(.18,.66,.2,t);u.position.set(-.36,.78+.33,0);const d=yi(.18,.66,.2,t);d.position.set(.36,.78+.33,0);const h=new In(.08,.08,.02),p=new ii({color:2236979});for(const v of[-.11,.11]){const m=new wt(h,p);m.position.set(v,.06,-.245),a.add(m)}r.add(o,a,c,l,u,d),s.add(r);const g=el(e.nick);g.position.y=2.25,s.add(g),s.position.set(e.x,e.y,e.z),r.rotation.y=e.yaw,this.group.add(s),this.figures.set(e.idx,{info:e,group:s,body:r,label:g,head:a,legL:c,legR:l,armL:u,armR:d,target:{x:e.x,y:e.y,z:e.z,yaw:e.yaw,pitch:e.pitch,flags:0},cur:{x:e.x,y:e.y,z:e.z,yaw:e.yaw},walk:0,lastMove:0,bubble:null})}say(e,t,n=3){const s=this.figures.get(e);if(!s)return;this.clearBubble(s);const r=el(t,"rgba(255,255,255,0.92)");r.material.color.setHex(2236979),r.position.y=2.75,s.group.add(r),s.bubble={sprite:r,until:performance.now()+n*1e3}}clearBubble(e){e.bubble&&(e.group.remove(e.bubble.sprite),e.bubble.sprite.material.map?.dispose(),e.bubble.sprite.material.dispose(),e.bubble=null)}remove(e){const t=this.figures.get(e);t&&(this.clearBubble(t),this.group.remove(t.group),t.group.traverse(n=>{n instanceof wt&&(n.geometry.dispose(),n.material.dispose()),n instanceof Kl&&(n.material.map?.dispose(),n.material.dispose())}),this.figures.delete(e))}indices(){return[...this.figures.keys()]}nickOf(e){return this.figures.get(e)?.info.nick}setState(e,t){for(const n of e){if(n.idx===t)continue;const s=this.figures.get(n.idx);s&&(s.target.x=n.x,s.target.y=n.y,s.target.z=n.z,s.target.yaw=n.yaw,s.target.pitch=n.pitch,s.target.flags=n.flags)}}update(e){const t=1-Math.exp(-e*14);for(const n of this.figures.values()){const s=n.cur,r=n.target,o=r.x-s.x,a=r.z-s.z;s.x+=o*t,s.y+=(r.y-s.y)*t,s.z+=a*t;let c=r.yaw-s.yaw;c=Math.atan2(Math.sin(c),Math.cos(c)),s.yaw+=c*t,n.group.position.set(s.x,s.y,s.z),n.body.rotation.y=s.yaw,n.head.rotation.x=-r.pitch*.6;const l=Math.hypot(o,a)*14;l>.3&&(n.walk+=e*Math.min(12,l*2.2));const u=l>.3?Math.sin(n.walk)*.7:0;n.legL.rotation.x=u,n.legR.rotation.x=-u,n.armL.rotation.x=-u,n.armR.rotation.x=u;const d=(r.flags&Sl)!==0;n.body.scale.y=d?.85:1,n.label.position.y=d?2:2.25,n.bubble&&performance.now()>n.bubble.until&&this.clearBubble(n)}}dispose(){for(const e of[...this.figures.keys()])this.remove(e)}}const on={w:.6,h:1.8},tl=1.62,A_=1.27,nl=4.317,x_=5.612,E_=1.31,S_=2.2,M_=32,il=9,Fs=1/60,y_=1,b_=1.3,w_=14,sl=89.5*Math.PI/180;class T_{constructor(e,t,n,s=0){this.world=e,this.registry=t,this.pos={...n},this.spawn={...n},this.yaw=s}world;registry;pos;vel={x:0,y:0,z:0};yaw=0;pitch=0;onGround=!1;sneaking=!1;sprinting=!1;inWater=!1;eyeHeight=tl;walkCycle=0;horizontalSpeed=0;stepCamOffset=0;accumulator=0;moveOut={onGround:!1,hitX:!1,hitY:!1,hitZ:!1,hitCeiling:!1};spawn;isSolid=(e,t,n)=>this.registry.isSolid(this.world.getBlock(e,t,n));isWaterAt(e,t,n){return this.registry.get(this.world.getBlock(Math.floor(e),Math.floor(t),Math.floor(n))).fluid!==null}respawn(){this.pos.x=this.spawn.x,this.pos.y=this.spawn.y,this.pos.z=this.spawn.z,this.vel.x=this.vel.y=this.vel.z=0}applyLook(e,t){this.yaw-=e,this.pitch=Math.max(-sl,Math.min(sl,this.pitch-t)),this.yaw>Math.PI?this.yaw-=Math.PI*2:this.yaw<-Math.PI&&(this.yaw+=Math.PI*2)}get eye(){return{x:this.pos.x,y:this.pos.y+this.eyeHeight,z:this.pos.z}}get lookDir(){const e=Math.cos(this.pitch);return{x:-e*Math.sin(this.yaw),y:Math.sin(this.pitch),z:-e*Math.cos(this.yaw)}}update(e,t){for(this.applyLook(e.lookDX,e.lookDY),this.accumulator=Math.min(this.accumulator+t,Fs*8);this.accumulator>=Fs;)this.step(e,Fs),this.accumulator-=Fs}step(e,t){const n=this.pos,s=this.vel;this.inWater=this.isWaterAt(n.x,n.y+.2,n.z)||this.isWaterAt(n.x,n.y+this.eyeHeight-.1,n.z),this.sneaking=e.sneak&&!this.inWater,this.sprinting=e.sprint&&e.moveZ>.5&&!this.sneaking;const r=Math.sin(this.yaw),o=Math.cos(this.yaw);let a=o*e.moveX-r*e.moveZ,c=-r*e.moveX-o*e.moveZ;const l=Math.hypot(a,c);l>1&&(a/=l,c/=l);const u=this.inWater?S_:this.sneaking?E_:this.sprinting?x_:nl,d=this.inWater?6:this.onGround?18:3.5,h=Math.min(1,d*t);if(s.x+=(a*u-s.x)*h,s.z+=(c*u-s.z)*h,this.inWater)if(e.jump&&this.onGround&&!this.isWaterAt(n.x,n.y+1,n.z))s.y=il,this.onGround=!1;else{const y=(this.moveOut.hitX||this.moveOut.hitZ)&&(e.moveX!==0||e.moveZ!==0),C=e.jump||y?4:-2.2;s.y+=(C-s.y)*Math.min(1,6*t)}else s.y-=M_*t,s.y<-78&&(s.y=-78),e.jump&&this.onGround&&(s.y=il,this.onGround=!1);const p=this.onGround,g=n.x,v=n.y,m=n.z,f=s.x,b=s.z;if(Vs(this.isSolid,n,on,s,t,this.moveOut),this.onGround=this.moveOut.onGround,!this.sneaking&&(p||this.inWater)&&(this.moveOut.hitX||this.moveOut.hitZ)){const y=Yc(this.isSolid,{x:g,y:v,z:m},n,on,f,b,t,this.inWater?b_:y_);y&&(s.x=y.vx,s.z=y.vz,s.y=0,this.onGround=!0,this.stepCamOffset-=y.dy)}if(this.stepCamOffset+=(0-this.stepCamOffset)*Math.min(1,w_*t),Math.abs(this.stepCamOffset)<.002&&(this.stepCamOffset=0),this.sneaking&&p&&!lr(this.isSolid,n,on)){const y=n.x;n.x=g,lr(this.isSolid,n,on)||(n.x=y,n.z=m,lr(this.isSolid,n,on)||(n.x=g)),s.x=s.z=0,this.onGround=!0}const M=on.w/2+.001;n.x<M?(n.x=M,s.x=0):n.x>this.world.sizeX-M&&(n.x=this.world.sizeX-M,s.x=0),n.z<M?(n.z=M,s.z=0):n.z>this.world.sizeZ-M&&(n.z=this.world.sizeZ-M,s.z=0),n.y<-24&&this.respawn();const _=this.sneaking?A_:tl;this.eyeHeight+=(_-this.eyeHeight)*Math.min(1,22*t);const T=Math.hypot(s.x,s.z);this.horizontalSpeed=T,this.onGround&&T>.4&&(this.walkCycle+=T*t*1.9)}applyToCamera(e,t){const n=this.eye,r=(this.onGround&&this.horizontalSpeed>.4?Math.min(1,this.horizontalSpeed/nl):0)*t;e.position.set(n.x,n.y+this.stepCamOffset-Math.abs(Math.cos(this.walkCycle))*.045*r,n.z),e.rotation.order="YXZ",e.rotation.set(this.pitch,this.yaw,Math.sin(this.walkCycle)*.006*r)}}const Zs=new Ye(8103167),Lo=new Ye(12638463),rl=.05,C_=`
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
  float lum = ${rl.toFixed(2)} + ${(1-rl).toFixed(2)} * pow(l, 1.5);
  vec3 warm = mix(vec3(1.0), vec3(1.0, 0.86, 0.68), clamp(blk - sky, 0.0, 1.0));
  vLight = lum * warm;

  vUvw = vec3(uv, meta.x);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`,R_=`
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
`;function D_(i){const e=(o,a={})=>new An({glslVersion:qs,vertexShader:C_,fragmentShader:R_,uniforms:{uTex:{value:i},uFogColor:{value:Lo.clone()},uFogNear:{value:60},uFogFar:{value:120},uSkyLight:{value:1},uCutout:{value:o},uTime:{value:0}},...a}),t=e(1,{side:Pn}),n=e(0,{transparent:!0,depthWrite:!1,side:an}),s=e(1);s.uniforms.uFogNear.value=1e5,s.uniforms.uFogFar.value=1e6;const r=[t,n,s];return{opaque:t,translucent:n,hand:s,setFog(o,a){t.uniforms.uFogNear.value=o,t.uniforms.uFogFar.value=a,n.uniforms.uFogNear.value=o,n.uniforms.uFogFar.value=a},setTime(o){for(const a of r)a.uniforms.uTime.value=o},setSkyLight(o){for(const a of r)a.uniforms.uSkyLight.value=o},dispose(){for(const o of r)o.dispose()}}}function ac(i,e,t){const n=new un;return n.setAttribute("position",new Tt(i.positions,3)),n.setAttribute("uv",new Tt(i.uvs,2)),n.setAttribute("meta",new Tt(i.meta,4)),n.setIndex(new Tt(i.indices,1)),n.boundingSphere=new tr(t,e),n}class P_{constructor(e,t,n,s,r){this.world=e,this.lights=t,this.materials=n,this.pool=s,r.add(this.group)}world;lights;materials;pool;group=new gn;stats={meshed:0,lastMs:0,avgMs:0,maxMs:0,visibleChunks:0};renderDistance=8;maxPerFrame=2;burst=!0;entries=new Map;dirty=new Map;boundingRadius=Math.sqrt(3)*vt/2+.5;paddedScratch=null;get queued(){return this.dirty.size}get inflight(){return this.pool.inflight}markDirty(e,t,n){this.world.chunkInBounds(e,t,n)&&this.dirty.set(zs(e,t,n),{cx:e,cy:t,cz:n})}markDirtyAll(e){for(const t of e)this.markDirty(t.cx,t.cy,t.cz)}markAll(){this.world.forEachChunk(e=>this.markDirty(e.cx,e.cy,e.cz))}update(e,t,n){const s=Math.floor(e/vt),r=Math.floor(t/vt),o=Math.floor(n/vt);if(this.dirty.size>0){const c=this.burst?24:this.maxPerFrame,l=[...this.dirty.values()];l.length>1&&l.sort((d,h)=>{const p=(d.cx-s)**2+(d.cz-o)**2+(d.cy-r)**2,g=(h.cx-s)**2+(h.cz-o)**2+(h.cy-r)**2;return p-g});let u=0;for(const d of l){if(u>=c||this.pool.inflight>=this.pool.size*3)break;this.dirty.delete(zs(d.cx,d.cy,d.cz)),this.dispatch(d)&&u++}}else this.burst&&this.pool.inflight===0&&(this.burst=!1);let a=0;for(const c of this.entries.values()){const l=Math.abs(c.cx-s),u=Math.abs(c.cz-o),d=Math.max(l,u)<=this.renderDistance;c.opaque&&(c.opaque.visible=d),c.translucent&&(c.translucent.visible=d),d&&(c.opaque||c.translucent)&&a++}this.stats.visibleChunks=a}entry(e){const t=zs(e.cx,e.cy,e.cz);let n=this.entries.get(t);return n||(n={cx:e.cx,cy:e.cy,cz:e.cz,opaque:null,translucent:null,inflight:!1,redo:!1},this.entries.set(t,n)),n}dispatch(e){const t=this.entry(e),n=this.world.getChunk(e.cx,e.cy,e.cz);if(!n||n.isEmpty())return this.removeMesh(t,"opaque"),this.removeMesh(t,"translucent"),!1;if(t.inflight)return t.redo=!0,!1;t.inflight=!0;const s=n.version,r=this.world.buildPadded(e.cx,e.cy,e.cz,this.paddedScratch??void 0);this.paddedScratch=null;const o=this.lights.buildPaddedLight(e.cx,e.cy,e.cz);return this.pool.mesh(e.cx,e.cy,e.cz,r,o).then(a=>{t.inflight=!1,this.apply(t,a),(t.redo||n.version!==s)&&(t.redo=!1,this.markDirty(e.cx,e.cy,e.cz))},a=>{t.inflight=!1,console.error("메싱 실패",e,a)}),!0}apply(e,t){const n=this.stats;n.meshed++,n.lastMs=t.ms,n.avgMs=n.avgMs===0?t.ms:n.avgMs*.9+t.ms*.1,n.maxMs=Math.max(n.maxMs,t.ms);const s=new G(vt/2,vt/2,vt/2);for(const r of["opaque","translucent"]){const o=t.result[r];if(!o){this.removeMesh(e,r);continue}const a=ac(o,this.boundingRadius,s);let c=e[r];c?(c.geometry.dispose(),c.geometry=a):(c=new wt(a,r==="opaque"?this.materials.opaque:this.materials.translucent),c.position.set(e.cx*vt,e.cy*vt,e.cz*vt),c.matrixAutoUpdate=!1,c.updateMatrix(),c.renderOrder=r==="opaque"?0:10,e[r]=c,this.group.add(c))}}removeMesh(e,t){const n=e[t];n&&(this.group.remove(n),n.geometry.dispose(),e[t]=null)}dispose(){for(const e of this.entries.values())this.removeMesh(e,"opaque"),this.removeMesh(e,"translucent");this.entries.clear(),this.dirty.clear()}}const ut=vt,ol=3/16,al=[[0,0,-1],[0,0,1],[1,0,0],[1,0,0],[1,0,0],[-1,0,0]],ll=[[0,1,0],[0,1,0],[0,0,1],[0,0,1],[0,1,0],[0,1,0]],U_=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],I_=[[0,1,0],[1,-1,0],[4,0,1],[5,0,-1]];class cl{positions;uvs;meta;indices;vc=0;ic=0;constructor(e=512){this.positions=new Float32Array(e*4*3),this.uvs=new Float32Array(e*4*2),this.meta=new Uint8Array(e*4*4),this.indices=new Uint32Array(e*6)}ensure(){if((this.vc+4)*3<=this.positions.length)return;const e=t=>{const n=new t.constructor(t.length*2);return n.set(t),n};this.positions=e(this.positions),this.uvs=e(this.uvs),this.meta=e(this.meta),this.indices=e(this.indices)}quad(e,t,n){this.ensure();const s=this.vc;for(let a=0;a<4;a++){const c=e[a],l=(s+a)*3;this.positions[l]=c[0],this.positions[l+1]=c[1],this.positions[l+2]=c[2];const u=(s+a)*2;this.uvs[u]=c[3],this.uvs[u+1]=c[4];const d=(s+a)*4;this.meta[d]=t,this.meta[d+1]=c[5],this.meta[d+2]=n,this.meta[d+3]=c[6]??wi}const r=e[0][5]+e[2][5]>e[1][5]+e[3][5],o=this.ic;r?(this.indices[o]=s+1,this.indices[o+1]=s+2,this.indices[o+2]=s+3,this.indices[o+3]=s+1,this.indices[o+4]=s+3,this.indices[o+5]=s):(this.indices[o]=s,this.indices[o+1]=s+1,this.indices[o+2]=s+2,this.indices[o+3]=s,this.indices[o+4]=s+2,this.indices[o+5]=s+3),this.vc+=4,this.ic+=6}build(){return this.vc===0?null:{positions:this.positions.slice(0,this.vc*3),uvs:this.uvs.slice(0,this.vc*2),meta:this.meta.slice(0,this.vc*4),indices:this.indices.slice(0,this.ic),vertexCount:this.vc,indexCount:this.ic}}}function L_(i,e,t){const n=new cl,s=new cl,r=new Int32Array(ut*ut),o=new Int32Array(ut*ut),a=new Int32Array(ut*ut),c=new Int32Array(ut*ut),l=[0,0,0],u=[0,0,0];let d=wi;const h=(_,T,y,C,L,S)=>{u[0]=l[0],u[1]=l[1],u[2]=l[2],u[_]+=T,rn(u[0],u[1],u[2]);const x=u[y],D=u[L];u[y]=x+C;const k=rn(u[0],u[1],u[2]);u[y]=x,u[L]=D+S;const F=rn(u[0],u[1],u[2]);u[y]=x+C;const V=rn(u[0],u[1],u[2]),X=e[i[k]],B=e[i[F]],K=e[i[V]],z=X!==void 0&&X.castAO,ee=B!==void 0&&B.castAO,le=K!==void 0&&K.castAO;return d=wi,z&&ee?0:3-((z?1:0)+(ee?1:0)+(le?1:0))},p=(_,T,y)=>wi,g=(_,T,y)=>{const C=e[y];return C?!(C.opaque||T===y&&_.sameCull||_.layer===Ji&&C.layer===Ji&&C.fluidKind===0):!0},v=(_,T,y,C,L,S)=>{const[x,D,k]=y,[F,V,X]=C;let B;switch(T){case 0:B=[[F,D,k],[F,D,X],[F,V,X],[F,V,k]];break;case 1:B=[[x,D,k],[x,D,X],[x,V,X],[x,V,k]];break;case 2:B=[[x,V,k],[F,V,k],[F,V,X],[x,V,X]];break;case 3:B=[[x,D,k],[F,D,k],[F,D,X],[x,D,X]];break;case 4:B=[[x,D,X],[F,D,X],[F,V,X],[x,V,X]];break;default:B=[[x,D,k],[F,D,k],[F,V,k],[x,V,k]]}const K=U_[T],z=[B[1][0]-B[0][0],B[1][1]-B[0][1],B[1][2]-B[0][2]],ee=[B[3][0]-B[0][0],B[3][1]-B[0][1],B[3][2]-B[0][2]],le=[z[1]*ee[2]-z[2]*ee[1],z[2]*ee[0]-z[0]*ee[2],z[0]*ee[1]-z[1]*ee[0]];le[0]*K[0]+le[1]*K[1]+le[2]*K[2]<0&&(B=[B[0],B[3],B[2],B[1]]);const pe=al[T],Ue=ll[T],oe=B.map(Le=>[Le[0],Le[1],Le[2],Le[0]*pe[0]+Le[1]*pe[1]+Le[2]*pe[2],Le[0]*Ue[0]+Le[1]*Ue[1]+Le[2]*Ue[2],3,S]);_.quad(oe,L,T)},m=(_,T,y,C,L,S,x,D)=>v(_,T,[y,C+S,L],[y+1,C+x,L+1],D,p()),f=()=>{for(let _=0;_<ut;_++)for(let T=0;T<ut;T++)for(let y=0;y<ut;y++){const C=e[i[rn(y,_,T)]];if(C===void 0||C.panel===null)continue;const[L,S]=C.panel,x=[y,_,T],D=[y+1,_+1,T+1];S===0?D[L]=x[L]+ol:x[L]=D[L]-ol;const k=p();for(let F=0;F<6;F++)v(n,F,x,D,C.tex[F],k)}},b=()=>{for(let _=0;_<ut;_++)for(let T=0;T<ut;T++)for(let y=0;y<ut;y++){const C=e[i[rn(y,_,T)]];if(C===void 0||C.fluidKind===0)continue;const L=C.fluidHeight,S=C.fluidKind,x=C.layer===Ji?s:n,D=(V,X,B)=>e[i[rn(y+V,_+X,T+B)]],k=D(0,1,0);(k===void 0||k.fluidKind!==S)&&m(x,2,y,_,T,0,L,C.tex[2]);const F=D(0,-1,0);(F===void 0||!(F.opaque||F.fluidKind===S))&&m(x,3,y,_,T,0,L,C.tex[3]);for(const[V,X,B]of I_){const K=D(X,0,B);let z=0;if(K!==void 0){if(K.opaque)continue;if(K.fluidKind===S){if(K.fluidHeight>=L-1e-6)continue;z=K.fluidHeight}}m(x,V,y,_,T,z,L,C.tex[V])}}},M=(_,T,y,C,L,S,x,D)=>{const k=al[S],F=ll[S];for(let V=0;V<ut;V++)for(let X=0;X<ut;){const B=_[V*ut+X];if(B===0){X++;continue}const K=T[V*ut+X];let z=1;for(;X+z<ut&&_[V*ut+X+z]===B&&T[V*ut+X+z]===K;)z++;let ee=1;e:for(;V+ee<ut;ee++)for(let Y=0;Y<z;Y++){const j=(V+ee)*ut+X+Y;if(_[j]!==B||T[j]!==K)break e}const le=B>>>8,pe=B&255,Ue=e[le],oe=Ue.tex[S],Le=[];for(let Y=0;Y<4;Y++){const j=Y===1||Y===2?1:0,fe=Y===2||Y===3?1:0,xe=[0,0,0];xe[y]=x,xe[C]=V+j*ee,xe[L]=X+fe*z;const ye=xe[0]*k[0]+xe[1]*k[1]+xe[2]*k[2],We=xe[0]*F[0]+xe[1]*F[1]+xe[2]*F[2];Le.push([xe[0],xe[1],xe[2],ye,We,pe>>Y*2&3,K>>>Y*8&255])}const He=D?Le:[Le[0],Le[3],Le[2],Le[1]];(Ue.layer===Ji?s:n).quad(He,oe,S);for(let Y=0;Y<ee;Y++)for(let j=0;j<z;j++){const fe=(V+Y)*ut+X+j;_[fe]=0,T[fe]=0}X+=z}};for(let _=0;_<3;_++){const T=(_+1)%3,y=(_+2)%3,C=_*2,L=_*2+1;for(let S=0;S<ut;S++){let x=0;for(let D=0;D<ut;D++)for(let k=0;k<ut;k++,x++){l[_]=S,l[T]=D,l[y]=k;const F=i[rn(l[0],l[1],l[2])],V=e[F];let X=0,B=0,K=0,z=0;if(V!==void 0&&V.layer!==oc&&V.fluidKind===0&&V.panel===null){l[_]=S+1;const ee=i[rn(l[0],l[1],l[2])];if(l[_]=S,g(V,F,ee)){const pe=h(_,1,T,-1,y,-1),Ue=d,oe=h(_,1,T,1,y,-1),Le=d,He=h(_,1,T,1,y,1),Y=d,j=h(_,1,T,-1,y,1),fe=d;X=F<<8|pe|oe<<2|He<<4|j<<6,K=Ue|Le<<8|Y<<16|fe<<24}l[_]=S-1;const le=i[rn(l[0],l[1],l[2])];if(l[_]=S,g(V,F,le)){const pe=h(_,-1,T,-1,y,-1),Ue=d,oe=h(_,-1,T,1,y,-1),Le=d,He=h(_,-1,T,1,y,1),Y=d,j=h(_,-1,T,-1,y,1),fe=d;B=F<<8|pe|oe<<2|He<<4|j<<6,z=Ue|Le<<8|Y<<16|fe<<24}}r[x]=X,o[x]=B,a[x]=K,c[x]=z}M(r,a,_,T,y,C,S+1,!0),M(o,c,_,T,y,L,S,!1)}}return b(),f(),{opaque:n.build(),translucent:s.build()}}const k_=.24,N_=.85,B_=-.7,Vr=-1.25,F_=.34,ul=.3,O_=.6;class z_{constructor(e,t){this.materials=e,this.blockInfo=t,this.scene.add(this.anchor),this.anchor.add(this.pivot),this.pivot.position.set(0,0,Vr),this.pivot.rotation.set(ul,O_,0)}materials;blockInfo;scene=new Yl;anchor=new gn;pivot=new gn;mesh=null;swingT=1;currentBlock=-1;setBlock(e){if(e===this.currentBlock||(this.currentBlock=e,this.mesh&&(this.pivot.remove(this.mesh),this.mesh.geometry.dispose(),this.mesh=null),e<=0))return;const t=new Uint16Array(El);t[rn(0,0,0)]=e;const n=L_(t,this.blockInfo),s=n.opaque??n.translucent;if(!s)return;const r=ac(s,1,new G(.5,.5,.5));r.translate(-.5,-.5,-.5),this.mesh=new wt(r,n.opaque?this.materials.hand:this.materials.translucent),this.mesh.scale.setScalar(F_),this.mesh.frustumCulled=!1,this.pivot.add(this.mesh)}swing(){(this.swingT>=1||this.swingT>.5)&&(this.swingT=0)}update(e,t,n,s){this.anchor.position.copy(t.position),this.anchor.quaternion.copy(t.quaternion);const r=Math.tan(Od.degToRad(t.fov/2))*-Vr,o=r*t.aspect,a=N_*o,c=B_*r;let l=0,u=0,d=0;if(l+=Math.sin(n)*.02*s,u+=-Math.abs(Math.cos(n))*.025*s,this.swingT<1){this.swingT=Math.min(1,this.swingT+e/k_);const h=Math.sin(this.swingT*Math.PI);u-=h*.28,l-=h*.12,d-=h*1.1}this.pivot.position.set(a+l,c+u,Vr),this.pivot.rotation.x=ul+d}render(e,t){this.mesh&&(e.clearDepth(),e.render(this.scene,t))}dispose(){this.mesh&&this.mesh.geometry.dispose()}}function V_(i,e=!1){const t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,c=new un;let l=0;for(let u=0;u<i.length;++u){const d=i[u];let h=0;if(t!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const p in d.attributes){if(!n.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(d.attributes[p]),h++}if(h!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(a!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const p in d.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;o[p]===void 0&&(o[p]=[]),o[p].push(d.morphAttributes[p])}if(e){let p;if(t)p=d.index.count;else if(d.attributes.position!==void 0)p=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,p,u),l+=p}}if(t){let u=0;const d=[];for(let h=0;h<i.length;++h){const p=i[h].index;for(let g=0;g<p.count;++g)d.push(p.getX(g)+u);u+=i[h].attributes.position.count}c.setIndex(d)}for(const u in r){const d=dl(r[u]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;c.setAttribute(u,d)}for(const u in o){const d=o[u][0].length;if(d===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[u]=[];for(let h=0;h<d;++h){const p=[];for(let v=0;v<o[u].length;++v)p.push(o[u][v][h]);const g=dl(p);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;c.morphAttributes[u].push(g)}}return c}function dl(i){let e,t,n,s=-1,r=0;for(let l=0;l<i.length;++l){const u=i[l];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=u.gpuType),s!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.count*t}const o=new e(r),a=new Tt(o,t,n);let c=0;for(let l=0;l<i.length;++l){const u=i[l];if(u.isInterleavedBufferAttribute){const d=c/t;for(let h=0,p=u.count;h<p;h++)for(let g=0;g<t;g++){const v=u.getComponent(h,g);a.setComponent(h+d,g,v)}}else o.set(u.array,c);c+=u.count*t}return s!==void 0&&(a.gpuType=s),a}const $s=10,G_=.02;function H_(){const i=_c(51116),e=[],t=new Set,n=(o,a)=>{o=Math.max(0,Math.min(15,o)),a=Math.max(0,Math.min(15,a));const c=a*16+o;t.has(c)||(t.add(c),e.push([o,a]))};for(let o=0;o<14;o++){let a=6+Math.floor(i()*4),c=6+Math.floor(i()*4);const l=i()<.5?-1:1,u=i()<.5?-1:1;for(let d=0;d<12;d++)n(a,c),i()<.55?a+=l:c+=u,i()<.15&&n(a+(i()<.5?1:-1),c)}const s=e.length,r=[];for(let o=0;o<$s;o++){const a=document.createElement("canvas");a.width=a.height=16;const c=a.getContext("2d");c.clearRect(0,0,16,16);const l=Math.floor(s*(o+1)/$s);for(let d=0;d<l;d++){const[h,p]=e[d],g=.55+.35*(d/s);c.fillStyle=`rgba(15,15,15,${g.toFixed(2)})`,c.fillRect(h,p,1,1)}const u=new Jl(a);u.magFilter=Bt,u.minFilter=Bt,u.colorSpace=Xt,r.push(u)}return r}function W_(i,e){const t=i/2,n=[],s=(a,c,l,u,d,h)=>{const p=new In(a,c,l);p.translate(u,d,h),n.push(p)},r=i+e;for(const a of[-t,t])for(const c of[-t,t])s(r,e,e,0,a,c),s(e,r,e,a,0,c),s(e,e,r,a,c,0);const o=V_(n,!1);for(const a of n)a.dispose();return o}class X_{outline;crack;crackMat;crackTextures;stage=-1;constructor(e){this.outline=new wt(W_(1.004,G_),new ii({color:0,transparent:!0,opacity:.45,depthWrite:!1})),this.outline.renderOrder=5,this.outline.visible=!1,e.add(this.outline),this.crackTextures=H_(),this.crackMat=new ii({map:this.crackTextures[0],transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),this.crack=new wt(new In(1.002,1.002,1.002),this.crackMat),this.crack.renderOrder=4,this.crack.visible=!1,e.add(this.crack)}setTarget(e,t,n){this.outline.visible=!0,this.outline.position.set(e+.5,t+.5,n+.5),this.crack.position.copy(this.outline.position)}clearTarget(){this.outline.visible=!1,this.crack.visible=!1}setProgress(e){if(e<=0||!this.outline.visible){this.crack.visible=!1,this.stage=-1;return}const t=Math.min($s-1,Math.floor(e*$s));t!==this.stage&&(this.stage=t,this.crackMat.map=this.crackTextures[t],this.crackMat.needsUpdate=!0),this.crack.visible=!0}dispose(){this.outline.geometry.dispose(),this.outline.material.dispose(),this.crack.geometry.dispose(),this.crackMat.dispose();for(const e of this.crackTextures)e.dispose()}}class Y_{constructor(e,t,n=9060348){this.scene=e,this.material=new ii({color:n,transparent:!0,opacity:.55,side:an,depthWrite:!1}),this.mesh=new wt(new ds(2,3),this.material),this.mesh.position.set(t.x,t.y+2.5,t.z+.5),this.mesh.renderOrder=5,e.add(this.mesh)}scene;mesh;material;update(e){this.material.opacity=.45+.15*Math.sin(e*2.2);const t=.72+.03*Math.sin(e*.9);this.material.color.setHSL(t,.85,.6)}dispose(){this.scene.remove(this.mesh),this.mesh.geometry.dispose(),this.material.dispose()}}class Q_{mesh;material;constructor(e){this.material=new An({glslVersion:qs,side:Lt,depthWrite:!1,depthTest:!1,uniforms:{uZenith:{value:new Ye(5210088)},uHorizon:{value:Zs.clone()},uFog:{value:Lo.clone()},uVoid:{value:new Ye(2832988)},uSunDir:{value:new G(.45,.72,.3).normalize()}},vertexShader:`
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
      `}),this.mesh=new wt(new Yo(1,24,12),this.material),this.mesh.scale.setScalar(400),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-100,e.add(this.mesh)}update(e){this.mesh.position.copy(e)}setBrightness(e){const t=this.material.uniforms,n=1-e;t.uZenith.value.setHex(5210088).multiplyScalar(e).lerp(new Ye(660016),n*.6),t.uHorizon.value.copy(Zs).multiplyScalar(e).lerp(new Ye(1317946),n*.6),t.uFog.value.copy(Lo).multiplyScalar(Math.max(.35,e)),t.uVoid.value.setHex(2832988).multiplyScalar(e),this.material.uniforms.uSunDir.value.set(.45,.72*(.3+.7*e)-.2*n,.3).normalize()}dispose(){this.mesh.geometry.dispose(),this.material.dispose()}}const q_="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAChUlEQVR42kWSV3PaUBCF9VvyEjuxKSqoXXUkkGihdwMGgxuBics4zo8/mV2G5OHM3pHmfFul53qIiV3AY+bjxlMxEgqmXglDIbOOrQjvvRSHZoiPYQ11+RJZ4StqxQv0zCKkw48YIzMHAj3VAjatEoF5aLKeUhdLV2EQvRexgLj4wqL/0m1k4r7q4thOsG9GGNhFrCsu5oHBb8q6r/l47VRwFxloqd9xE1mY+DpXI5HxLraxTQR2FQdjR+UWJq6GtnaFt26VWyAAtdG3ZC5/Gpxg0ibUsQ40bMsmx9d2gk1QwueogX3moW/m0dWvMRIyJo6Kh6qDG0fGS6fCko7NiEs8NELOdutrbPw9rOHYDLGKBQZWAT0jx4D7isDS13BoRgySVq6CP+MGmz+Hdaw8hUWQQyPAXephWbYx80rolK6wiQzM7ALH53oA6aUd42c94AF9DGr4GGR471axjQyuoqV8wyKyuIWpq2GX2NzGXBRPLWyS/2sZGDke2K9WmWE0H5r4yFHRt4qYeDpuHAVzgtkFPKQupGVoYCJk7DIfff2ajQR4rArsYusffOrraOs5LFwVm7KJ21A/AdaxjbFdxNDMM4jaocwkqoYyD4WCZSzQ0XOcmYZIcR0ZkBaBjlVkYuaq2KYeD5Mg58yzwEDXyGPsagw6f3/pVrGvh5CmroqJo6CnX2Ob+nwPtCLS0lPZTKWfjW3tO29mZMvYZj6kTcXFfS3AWMgcH1OXIeeDaWlXGAgFDfmS30OriEVoYJ0ILCMT0i4LQBAC9I0cA54yD2+9FO/9jE00QBJvITAwFgo2VZff0jzQMbQKDFgnDpsoM+15Heqo0937Ojp6/gRyNb5IilTJXzsd2hofgxXhAAAAAElFTkSuQmCC",K_="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAxUlEQVR42u1SyQ3CQAx0JbynCkpIAZRDKfwh6+xuQqAlHnRgZGksWTzZL49RLB8zHmelAXYFbAPsCVgBbGf8AKwDtgJ2A2xJ8B6fFS+836+f4CTSBwh8S9HRDZR+fJM7ve706QpzyjuUX79ZdYLGps5kT4eKWFlrJK2M/eBSqRgq69efWCgwp+sXwntlTcwLk4EYji03ipRkSXY2bywoBytzGYWbFr6ROd6BpiOG78a4sjlqYVOZk9PxYCOQy3myEfwJJvsAjIFrcP/cvEwAAAAASUVORK5CYII=",j_="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACKUlEQVR42jWT51JqUQxG9/sAShGkSBPpTXovglSpMo6AgwxPnjsrd/zB5JzNzpeVLzkmHo+L0+mUfr+v8f7+Xp6ensRms4nP55Nisaj/BYNBeX19lcFgIIVCQcLhsHg8HjHtdltCoZAQ+XH57e1NvF6vRCIRCQQCkkqlpNPpyHK5lPF4rO+xWEx6vZ6Y4XCohyRzmYvlclnq9boKNBoNeX5+VqpcLqfn+/1eFouFHA6H/wKPj4+afHd3p7FSqcjLy4v4/X5JJBL6fDwelaBUKsnHx4e43W4VMev1Wr6/v6XVamlvoCGSz+el2WzqpXQ6LbVaTVwulxJQAEHaNJlMRjG/vr4UkWokUpmYTCa1RapyRtJ0OhXyIDIoYUa1WpXz+SwQORwOFYIIMvqH5OHhQSNnp9NJaUw2m1XnV6uVTgOHwe12u2K32zV5MpkoHUS0s9lsZDQaCf4Z1BgbeNvtVj3AdYQxETLmjzgG8sxuQPP+/i6GRUKd0eAD7bBAiCFssVh0if4WDfe5QwEEDcm73U6u16uaAwGYs9lM24EMCnxBhMiUGD0Gq4kkg/b7+yvRaFR7phI+QMBFDLVarZpMUVpi3Q3o7DVzJxkzaQEaNhIa5g7JHx2C5ECpAjyQfLvd1GlWlBkza6gul4vi8x+FECAPcgPSz8+PKrIszB8hnObC5+enbh2jg4JECBHBI0MvLBCfKYjz+Vxd56NinLxDwz5Aw1YiwsdH/AcfgvkbkXGX1AAAAABJRU5ErkJggg==",J_="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB20lEQVR42o3SzU4aURQH8Ps4bBprmVoXdNNUJTpfDPOBjaum1CqWNm1apTYjHyOC4KpBLRGpOqCMYF+jT8Jr/JtzEhqmsGBxknvvOf/fvcmMCKpJdD0Vg5oFNx3DQ92GX5TRO0rg/tjEXVnH7xMHfklGv2ah4yl8dk+5QxWCGr1KggMEdEoKgxSmAcKCioHbss77Qd3idf/Y5JwIqgbrJHqZF3g4sTn8J4jxIAX8ksL9Qd3G3vIpX0YvpVeLzxvPEEQiXMPhkAdoTQDtqUb73Ovn3B+df1yXIH4V1JmBdl4JATdeAuLGM2YGropaCGjuxyF+5lZmBigwDrTcNYiMLc0M7DhSCMimFiC6ZR13RwZ6lSQirwKujqehX7PRPdS5rosyaM4vqSE0qJoQV/m1fy8YAVTXBRmxeoxr1Pe9KQDdNg2g4f8BCowDt+UExHsnOhXIpqQJ4ENKCgGfNhYhznPxqcBZLj4BtAtaCPjx5SXE2dhnHAcaX5cmgJarhIB2XoNo7C7h8kDlQPP7Kk73VnCZ17haByouXBkXrgL65c+/xXm2ub/K68buMsSWFcVb4zF2nAW8M59g25bwRnuEzeQ8Ms5TZNcXsWnMY8uMIq3Pgea3LQnpxByf/wVkjXV/2HuxXAAAAABJRU5ErkJggg==",Z_="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA5ElEQVR42u2Pu4qDYBCF/zdTUKKoRSxE8Q0sveP9ihfIg+UhUqfeepuzzIBbLCwLS1IEMnBg+OfMd+YX4pn1efNB+jfgdLJAeiHA9XbHX4Cfnu+6n8849BvAv3zg0BvwSEBRFJjnGeu6ous6eJ4HSZKQZRmCIIBhGDBNE6qqgrx933MvyzL7RVmWqKqKB9u2oa5ruK4LRVGgaRrP2rZlM/VpmrLXtm0sywJBjweEtO87p9IltERqmgZxHLOSJEEURbAsiy8XZKTFcRw5fZomHui6zsZhGBCGIScTjL6R5zmHOo6DL77IJcHVaQZsAAAAAElFTkSuQmCC",$_="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABQklEQVR42qXSR1IDQQyFYZ+EJZick8k5noCTkHOGOzf1TdVrmCp2Xshya6Rfr6XudM8GSj/W8bP1MFlWr0fK3stsWbsZLcefS+XwfaHsPE03tnI1XE6+lht/+t0rG3fjZf127BegSGD7caocfSw2Z0mAYL3LbgP0f/91rhy8zTfACkCmIh2YghgYCDUAu88zbQXkL18MNUmb9xNVIs8o0pGnUEyzFmDpfLAxhc7ppChwZzmuAFIB6BLSRTElYjrqxsB5swCqAB2YQklmwAdAka6GCmAWrSFKlsiy0hRmjWDZjMH69u8ao0IsCpyzQuoyhwqQhOoaWRtPpgKqMlSds40K8DGPBSSK/r5M8bxG1lLgnhKZbhIzB4kpBlJMoetWQJL4vPs8JjEKxRRlS9bcesquYDgSsxFQMclyMrycK6Af+wF7td4ljUgE9gAAAABJRU5ErkJggg==",e0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABtUlEQVR42l2TZ1ICURCE3wn8AQUIywLmU2GRQW5gznoWKYFlSYcxZz3F6DcwYPHj1b7d6enuCeta+Yjc76Xk9SQnX5cb8na6Ip1iQu/vZ6v6fNj3pF2Iyc/1lnxfbcrjQVqeDn0JKklxYdVTgo/zNSV5PspIWPPk5TirZBAAHtR9TSQOIdhWPiquX/MUaMkk3hZiSsrd1FrbUfm8WNfvd7tJxbaLcXG9SlJt8REwT0i5c3BGKRBACBZBngi54c7cEoFMfElLoF7rA6qAiYFDhG/0RR0YGIAdFCA2gsWYOdUe8EKd1nUcoASQWjk4pQTErLywmhI3amZnSiRAwHhIshHiYDQl4J2+IKglDBvzAKwkDRr+zKZ1vl9Pqyuw9q1bXhYX/JsCqgSZr4GIcUcNcpsC95t8RBzM2McSDSIwbubUkTWNBGaOdWsiuG4pIS4oT5RtkRa7vTgdwyHKFrthw1ertgs4GTezM2WbjhGC5VAW/dNFMgd8hIgeACYR27joFOP6bqMGq3tAE1GBlSkQGE1JIbH17ZQmfyh7wKHpAVOwP88WhiCurOM2GUaLO+64Iqf3t0i/euJVJP6LFFwAAAAASUVORK5CYII=",t0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACM0lEQVR42qWRW1NSURTH+QQ9NNNLPWTOUKgczjlyh/DyCXrSZhomKxE1UeIeIMhlKJ1xJjIyMx3KG4hCXBRiqnenL/Vv1mo89FQPPux91v7vtX7/tddR9d+8jqssFW1Frx7b8zq8nxnAh9khHIVs2F2U8fmFAVtzWtaLS3osT6ix65Gx45FYVwDhB7dRmNZgz2/GUdiGTfcgJ33xGVGK2LHjkbEfMKMUtqPg0iD3WMSnBbEHOAxaUfQacBC0sGtuSuSY9O3nOi4iGGkE+zgvsP5XB31YfSqzAyVlnQL2/CZcXPxCKpXhtumZpFFMOQrg1o1rWH8ygA23iNjkIDbcOryblbA+pUGlcsqAN8+0WHOqseUxYtWpRt4lID8tgGpV/5rwJeC/f6EeNaCbcaAZN6GdtPG5k7IrgEbMyPqP3BjOE1a+o1gBnAYlnCUsqIZkfM+OMuCtS1AAJwER7RUbCnMyumkHjn0CapHhHqARNeLnq3GeQytuZuCa8y67UWE1JHFBM2ZkZwKQmQLIu0R00qMo+yWcpxz8PQ7IOPQKqL004bXzHuvfMmMoByQ+Zx/29wDNZdufS7+ERtyKr1Ezzlcc2FwwoZ0aQTc7jvTkHb6rhIZxlrzPsQK4JFPh/uIQ6nELDpa0DExN9KHsF1GLmrgrMmsl7TgJ6XsASqRWya0eszCombBxTG70ROog90jNha2EnUEKgJJoBiWfyDEVdtIjyhxo5WeoQxPHBKpGjD3AVdZv/A4FcAD3pJwAAAAASUVORK5CYII=",n0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACP0lEQVR42qWQ61MSYRTG/Rv62McmuwjpcluX20Jo9S/oOFMzOU2TUJqmAgISsMCidJk+OFOT2Sg65cgkIhqBgIDd/6anOcfa7bsfzr7vnPOc3/O823Ph/DmcpXro83FOxPa8iPVH/SjFZKz5DXj/8BrX1owFOyEJ7/x9KIbtfK5O9GEtYNQB6h0DsrcNKEwJPNwJkdCArWkzNiYHkBy9hGLIjtWJq1DGrvByfnxAB5w6GJAc7cVu1IUPszZsz4mchGCfIk5sPjadpgsYeZYYuagD8uMCR12+24/ESC+KYQdKMTenodipscvYnDZxjyCk3ZgSdEAtLuJrzovfL2/hMGLm8zjtQv3pIH48G8b6jMRVjVrxbdmHbtaDasyqA0jUTDl4SLDv+SH8fH6D6yTnRUtxopG0s6aretDNynzXAMeKk5dOVA8DjhISPkct6GRl/HpxE+2MmwGtlIOdCUqmGoCE/8QEIgCB6Dm0TK5fFm2chFLRnXQaoJGQuLly38iLhVkHJyBXciQxGRSe2LlPRgTTAKWgCZ2cD6WggN15AYexQZTDFu5VFqzY5/sQDqIiqosSXt0zoqHIOmB/wYJKxIpqXOKlVsaLo5QbzbSM134zWhkP6kknzzqqD+WwmU00AIkbihvdpWFeqiWc2AuZ0Fav8xLNqnE73k6KaKs+TasByiEzukt/I8YlvtcSDoZR7yBiQyVi4xRUe0ETmmnPfz9RkTk2PYXotFxPurDyQGAnWn4TsHCfiuJTQg1wlvoD59QmUQMoblEAAAAASUVORK5CYII=",i0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABsElEQVR42k3TWVKCQQwE4DmGBSqcTwFZRfZdcUG4cawvVVPlQ8iQpdPpmb+MRqOYTCbB93q9+Pz8jNVqFe/v7/Hx8RHn8znP/PV6jcPhkPHL5ZLnonE6ncbr62u8vLzEer2Or6+vjNXC39/fjG+32/Tip9MpActsNot+v58Aw+EwNptNsjgejzGfz+P7+zsNENvtdgmwWCwSsDw/P0en08nmwWCQCSDoVSCMrABQrtlsxsPDQ9zd3UWxL7oaNKNIk8fHx2i323F/fx/L5TJB2M/PTzQajcwBLX4ENEBUDEAjIyANsNnv97lCq9XKdQwvilBiGBCy6oGNhtvtlgDANdmdWaOYWpEJajoAuyrSUAGc6UAXOayLRsVAmClidSJQgFZlVYuqS6lXpRCqZp5YvLUqO03EJrqh+ooHIWk6wXgUFWNhqjM9NDmrA5wivr29JRV//j8QoM48IM1MTI9ag0p99zyqGChUZD1mutsx/enpKVeoN1b+06wT62sUAwSg3lS328282wJe0KBypalQsl4hgLqvOt8N4MooASSJWa9UzH9+PB5nzHcCGAMxwED+AE3kZHy1bKoMAAAAAElFTkSuQmCC",s0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB4UlEQVR42jWTZRLCQAyF92a4uw9XQIq3uDuHfsyXmf1RCrvJswS33+/1er10v991OByUy+WUz+eVyWQ0m800nU5VKBRUrVaVTqftrlQqqd1u63w+y3FZLBZVq9XU7XaVTCYVi8UMgMJsNmvvZrOpSqVijdRDVC6X5Y7Hoz6fjwHE43GFYaj5fK4oijQYDKzJg/R6PVPT6XQMEEL3fr+FDYpoXiwWWi6XJn+1WhlYKpXSer3WZrMxu5Ciol6vy7VaLfNHM42j0ciYJ5OJAWCJYjKiebfb6fl82sOZ2263Jg8GQGD2IcKMBZoajYYej4exn04n3W43XS4XOVDwjz+K8EdQqAIIC9iCCN+AYIWJAeSQRRMj+X6/FijfUUWQKKKBcTJGpKPWK3GMAik08uaBBVXkgHzYYeQMa4THb9sDQvr9fnaAHQAYD6w0AsCDFSaFKkh98I4Pwur3+yYLiaTOOVOgAQCYAUQ+WfCG1BbJB8TDWPHvpTIFCAAFDGVYoZmxOz5g4BIALpGYSCQsNHKAgA30S8Ya45+AHVtImrByQSFex+OxhsOhvYMgMBWQwIx/QFFvfyZksgN+tpyBTiM5IJ8mGlBLPWOF3OGJ5Anver3aulJMIwBePupQwTTIhxoW7g+s+zDX4AYuzgAAAABJRU5ErkJggg==",r0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACa0lEQVR42lVTWU8aYRSdX2PamFSl0gqiabGxlJ0ZsOBSmxqLKIhbfRFhNoai777YIrtV+5OaPvSPnOZcHBIfbr6ZL3PPPcsdRf+6gMoXH+y9ILTgBPT8IpziEqzCG6SDE7AKizB3FuTMLj/H5cEynOJb1LbnsRqahFLbDsApLeF8y4+18AtUtvyP5RPARjEIIx8QkFxoEs3yOzRKQbn/FJ2C0qqG0TXj6Bhx7KZn8LMaxtBR0TZiKKRn0NEjuG2kcPddw9H6HG6dFHpWDF0jisO111CuKyFpbusxrAafoWsl0LOSuKlFsJvxoG/F0TNj6BgR7GdnBejhIiMA5dwslI4Zx/XZe/yofBAAMpA6D+N4wy8N/Pjq6upJ/b5cwenm/IhBW4/i+iyEv//+SA0dDZRGSZz+q6HCNM0ndd9Mo5ydhdKzEuLBoK6OATqPnhS0aaFLAOreVz24v0hjYCfEC3qisLlfT4kHYwYNTUB31CkBuGtq0kAAvhOAdfo5AIVmdYyYaHYBumYCN7WoSKDWh4u0SHEBeCeAH19CGdRTQpfRuQA3ehStagSlrFdiFMqNEQMayua+HUdpxQNl4KgynVPZTDMph/fl3CsM60lpcj2QvXBSEuvJhg8K42MD03AZtGoRYZFXpyRGUuY+EMDdg4fLDIpkwAj7dkqiO1r3yTP1U9JexoO2HhYGTIIA7VpYWPBOUuCknp0U6vtZr0gZSCrR8R5wKpu+bfqFCcGG9QQOcl53kWJCmwwIwHee+ccYOY1GFldGgPSF93uZaSh9OymOs0iZQGzmP3G4NjfeRJ7HGz50jYhsIQGYwn/FrmC+c8IzXAAAAABJRU5ErkJggg==",o0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACNUlEQVR42pWSyVJTURCGz1P4CC5VUONNABcuVMhwb+7NnFSMhaJSJSZQEQOZyERGyBYlEEPmUfABf6s7Q7kMi670f/r8X5/uXNHJyuidWjEs2dFMm9HPq+jlrRhXnKybKRNGJTui2wa0sxbOb1ImDIs2DkHmQdGGccXBoFbajMmZk4F03i9oGBQ1JHY20MqYZ2cqn7czFohJxclJM21iQDsrc+dx2cGGTk5GN6cg/nGdXzcoaHy3k1MwKtshDgNr2HM9xVfnKgwPHywVh4F17Ht12Pe+gKB5iExEKlL37mws0rSjUXk63hwwr0cCEsRwthRaGhWp0MpY+NmsadaszHfmAMqp4dF7PUQvr3IHMlGRNM1OYNK0XOrYODEuAGSmfye9+woi5HmOA5+EsF+/9A7C7wwIup+xR0wqDgyLGm7PpyOMyzYMClZ0c9MXTcp29PNWjEq2BaB3St+OgruqC+Jv1c2Gu6qbi7fnLoxKGv6cORZA0v8DqEbmYUGFICOZ6CVzej+vYFhUWY+KGno5mUFzADWcVOwMFkfbGzj+8BJhv3SP72ANBz4dh6ifWHAZ28JV3Lg0oBbbwmV0E420AkFGSm7SCi4ibxhWT1pwlTDhV3QTF5HXaKQU1r9TMn4EDGhlVVwnzaxFPWkGRS1mxHXCxJcJSAbqUosbORopmYHf/RLnzayKn8dvIYJeCV9sKwh59Qh6JLDWVvDNIyHk02PPrcNn9Qnf2bE+4vqubZV/P6mP8Q/a0iedKWTMOAAAAABJRU5ErkJggg==",a0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABD0lEQVR42qXRV1KDMQwE4ByRY9D7+XKQ0NMgELiCmc8za2z+xzzIRdKuVtLsaD4vh9jMcb59Lnffm3L58Vqudm/l5mtV7/59un4sJ6uHmsN38f7yRwB8/7Otd0AAZ5un6gf0B2b8chsBh0BA2BFJYv7sdr9uKqkeWuireCMCYPyxqBgIUjlzSN+RG0XIkKfY0ML157JJ9JYAdLxc1DcSN/IongxRABhJBsoXNf2WJltgkqmRkOFlC1HpRjIoiOTIRpTKvR8hoJgijUCfkZf1RXYfM6MMdNiChKwLc/6SJXpHNvOnuhEA6e2/SUrlEOQWnwwxew8gJNpQxED5+YYWAAQzTEH/tJE4EhZljeAQ+wU3pxxrczn9YAAAAABJRU5ErkJggg==",l0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABzElEQVR42k2SuUoEQRCG+x3FjdRARRCc2fs+Zu/7eigDZUE01EAFQRYUEQMx2l++ghKDZrqr6j+qakK73Vaz2VShUFCSJMrn80qn0yKeyWQ0Ho8t3mq1NJlM7M0XzHq9VqhWq8rlclbU7/eVzWYNHMexyuWy3S+009HLo4bDoZbLpXq9nlarleWMABDKEKAEWaPRMAK+57sf7V1farFYmCoxwNPpVAErlUrFijudjhFQAAnx0Wik+XxulgE5uNvtGmHgUqvVrA0c0HepVDJCXAEEBLGT0AKkfK0FHxIgyCjEdupuo9TtxggQohbbg8HADnMIgEiijiLzYIAnH1udfX/adiBFDSLqcIF9Wg71et2YUYWAIlooFovWDmCPIUYd6rimjcCD9ZDgkADIv+BrhAwRxGiVO87IB6wBclbUKOQwWAdBzp167k4eSGKTL05IsD6S2KZP8ihyfJi44gQUfbfsnCJa8J27ZV8rBLjgTW1gqlgDTDGsURQZiRfxjiTt31z9tUccQiNAyYfEIQGYdR4+P+jg6V6nX29GRA4Rhkxr4f+AfGVOSPHx+6tiyebBUPlPAPtaw2w2s+FxAKFKkhYgAoAycYYLiduH6BfsHX2OvyqTWAAAAABJRU5ErkJggg==",c0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABvklEQVR42k3TWVNVQQwE4Pk58ARFlYjsLmyyXRBREREui+zPgAIKKG6oKP93rC9WLB5ScybT6e5k5pSfWxP15HlP/fCyP8L+0/LD+n6hrx4/6474ujZSr948jvNf25P1/NVg3ZzorB9fP6jlemcqCmwOn3TWg9k79d38vYizxYEoVugb2ZfV4SC/XHlUf+9O1wKgWOH+bG8cUvi+MVaP5u7Wb+ujoYqEmD2hz82hfw4wsY0NiYNckclzQ1mOE/uLpftBViSoifXRjiDDTPXH5ngUaRER7G6jOxyYCfcFANvN/kzYTHt7jZ4gVfz2aVcQK4KFaw63R0uFEiv6trKaASivJfMwRE7cWroq2G3M4s9eI0IB+0iAiMCcvugNHFJtchMOWGHRoaAkb835AGc4IxwtsGaqWBUblG/K5gHEjSv2rZAzRP8J2APO9+D6APIqEZiH7+ZQWwzcudp4B6aLLZ9tPmGEivMdwNkT1Aa3xeQxAyvihP3bgzUfOATak8srLpKuRYILe9aR5BUiQpDPmqA24hqxKRLbk10BRqRnBfokgCxxSFI4ZuDV5d+XKoiRWBf6WwJMWYvOFwdag/wvxBgmgSkewCoAAAAASUVORK5CYII=",u0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABdUlEQVR42qWTyVICMRCGeRAfwyMnTx4wiLKN+/IquBBUoLTc1yqpYQaEGS9a7utztfU36TDgHKzy0KTDn3zp9J9JjI+O0MvxHMfnxTLd7+Xp63KFvq9WKagWqFFK8f+PBw6vwfh8NEtvpwuEvQn8POwXeTIc7kaawroTqwFiATgVo68VdbTiEfP2VpYaaxO9XCtqaUVNoymV7QNQsgDcCCCsObYCgAOtGIR5Mjn2+wpdrSg0VWDe3JykbrXAeWDAoknVDLjbzfU2mBO6ZpGvp7iKKCCIA8hkONADr5yJ1Z4OZwYBryfzXAm6ixzW3Wzn+Aro0cf5El8VuuQWIJ4OBxxw19OxGg6xADyQaA/EhetSygI8rThEez9b7AOEJk3yzCKUH7XRi2gDL1Ga6JrHIl63K1nq7ORtBZ2INuCClBOahyRWYbO8xKbRBIAmWwA+nLhG+eUMtSrTf7MRFuJeEEBHVUGtSLd1h79A6OgVcmiw0gL+Ez92GiA6laiT0wAAAABJRU5ErkJggg==",d0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVR42mPwMJH5TwlmABF7ZkSRrPHQvASEATunhoM5X3/9+f/ozSc4hinGJg6zlAHZNGRFyAZgEz+6MBnTC6QYsG9WDMKAvTOjSTYAxQvkBCLMUrIDcceUMIQBB+bEkeyFw/MTEQbAQpQUA2CWgg04ODeeZANgelDCgOyUCApRUEyA/HVkQdL/3dMjwfG8oiPg/+quYLDi/bNjwQG3a1oEmA2iUQIRpAGkEGQYKExATlzXG/p/XV8Y2FCQK0EGgywBYZRYACkGaQQpACkEmQ4ybGVHwP9VXUFg14EMBVkEkocZBjdgWpkDWRikFwBh6nG6mkGYKgAAAABJRU5ErkJggg==",h0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABwUlEQVR42k2T2XbiQAxE+9vykD+eTBJCvIGN990GDMkkP6I5VyAfHnTUW5WqS93O27xIsH2VyHuXMo2kLRMpDqE0RazzuS/lNNaaf6+z7Px3icMPSfeeZLEvLom2epDJzt/oeGgynUN0PfXSVYkscyt9fVAgGCNyAPbBRvIkWIOKkBAAxzZbVXibP0oCeCU47D61GgGozvcydYUChiZVkq/zoJnqwfavFHecMxB5bHOV3lUHZa+ynaoD1JSJxuXY6v55qtUnh2QWOAwB8hijDCXsP5q2zI18L6Pm01iJQwZAu9Pz07OGVUYuZLbe16lMbS5jk8n11N0UmGyIAKHAVJlHdRGr86wf+3IlcoAwi4MG4m4QcwXGZjDX+D4Paiw42qsm5omvD8h8gJ31y9zKcahWcsggoEN05HLsxJ2nRgk4aBWtlbc23h4V+4whoPK/ZZSfyyQONqpaRgkkZtqjeUb6+zVrJhz3QiLZTKRi5L2paVQ1+agIP1816E7KX4AZICS0EbBlSJa7D6YMEAR5Et4IqGz3fHw4vAMqQzDf28Z/yOJA/I8X3edfOA4DpAP2KiFDkT1zSDBbVUbb++cLtdB/a9NSJwf7IrIAAAAASUVORK5CYII=",f0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABJUlEQVR42qXSSVZCMRCFYZbjClQUFR2wDEEBuwW5IMEGRLcUzpdzbjRjBvWSl9z6q0kNjl4n5RAb+FxsluX657kM3+/K6XpWzj/ndXV2uX0oo69F3Tv3P9491X0HuPp+rJfs+O22igBZgPa0VvoGQD/7uK9GLGIysDJgdwl2spr+ATigAhAQ2hMy9/5vfl/qnjNoA7jgKAoH6YuevjjPGp3/BkhtHAD0QCSZMAFElEV605XgkEWUdFM7mACcwJ37b4B0naN9nNKsPG+eNdk2ABFLE0VPzYTg/+eBtpuDpJZmphd5Mqt7ugwSbQOgpTGZOE7STv2ZFYDoOkCeL+lG6C59sGYSu2fMm3MGykSyQJ0Hkgy7HqgpNRICZhYynRkw+66EQ2wPLItP+i1ConcAAAAASUVORK5CYII=",p0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABx0lEQVR42j2TuU4DQRBE5zPAyMYfhQROSMBIIK/vY33f9/E/ZAgJYmICLJEgESHxAY1eod5gNDtd3VXVPbOh0WhYv9+3brdrfC+XS63tdmuDwUDf8/ncptOptdtt5c1mM2GdTsdCrVZTwmQyUYAkEnq9npLARqORCDjX63Vhw+HQFouFBVQphpkgOwtlCkiCmPNqtdI3ZLiWA5JhZI/jWCCqFHCGHBKceYwzC4EAEyCtALJwghrWOaME3mw2rVQqWavVsmKxaOVy2QIB751kQBz4NyrsuGQVCgWrVCqqIScAUkwARp/weDxOWqINYtVqVcrkUsc5MFW35KpYhYA+aYM20+83dv79YNnff+tRFCk3+NBY3jdq9Ay5z+H06dLSH7dyhACuucHgKpvNxg6Hg5Jpg2J2VFip15yc+M2AswcmvtvtbL1eK8Cg6NGTUeT6OLOD4RaH5IoAy07CtyuAsfwVEvdXCqEIAGgBVoI+debBIHlgZ2/Xlvm6V9/gfkPMIiEgiD3mgKorqf/nK0u95JK5+KvVDAjASgAFivxGwBwHQyT7E1n6mLeTxwsRBQpxwQEn+/1exez+YHy4XFvmmLfM513yi/8Ba651cdcejQwAAAAASUVORK5CYII=",m0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACH0lEQVR42k1RSXLbMBDEzZa4LwIILiBFSZZkyXaqcuB38qIkjpM4juw8Lqf8olM9hqp0mBoOgF6mqV7chJOb8MVNeHITfrkJP/38x014vTh7unjH899ugnpzEz79+ysDD5/9xXffXzzo5O/4/egxnNWTHz5fAM6Pv7pJzt88Ie++eQfEUFCdLmz+8I9P/uHrBdGjX+Ncz55U5dGAobmHLbdIQ4ci6dGYHfLYSe+bOyTzFmnQYeU+QOcrjO4BbbVHVayhWnMLVx+FgN0Ua2RRJwQ6H9GaPcbuAba8QRY6AeVxjzTsUCQDFIGsRu+FgCAqk6RMB5hi44k3qBdbIaCDeN6IG1Umo1zGsxadPSCe1VIk6pujKHf2FkN7L0VlVx+k816VaY8kqJGGNVq7FWaTr8TF0N5BZ2vJgUIUWWQD8rhDGjUgVsVzi+BKI4tbIcoiJ0CGRBWuxgyyqJeqzQY6H1AkTjDqXdXCFON7z1dirUyXQkR1y90ZYtQjvDawei09DiwUrdB+kTpxQgLuyISX3T266iAkBLNHMyNrtNVWSFRjbgTIgS5qvUaRdqjNGnFQYdk9wNmjD9DB1Xv07UFIwusKKg0bCYXgqlxhkfUIrhbQeY9obrAZPiKPB+lcJQ1bUU+CRn61IiMdMEBdLBHONMrMSc/iRlSpTgL+EdfcSoDnNVRnd+IgmlVij0BWtRgRXmsJT4D2iFrvRJkYgrnKf4SBd1yXkk+ZAAAAAElFTkSuQmCC",g0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkElEQVR42kVTaVMaURDcH6+JotwqoGhEkcMziYjIcu3FtbCLUblvVwSp/IZOzRCTD6/YKl739HT3ExTVBa3kRbm6i4q+B1lxo9s/xXPzEP3hGZ6bR8gVHEimNmA+7uNB3IJadKNmBKBoLggElhQn6uYBytU9/pZVNx7ETciqBz8TazDMAKq1PdRNP+4fNjEcn+H1LY73xTWEyWsMo8kZKroP6YwNpfIuFM2NYnkXg1EYiuZBIvkFj0/BfwR0nwiG4zCE0SQCve5HWtyEmCV5HowmUf7tDU7R7h4z2X1qAzXDh9vEGvR6AFMrhvE0AkGv+5ggm7fz/rLiQrcfgjW7RK5gZxVEaM0uUNH9ELN21Ix9FMs70Gt+CNYsvjJE9UDM2pCXHJhacSbJS3Z0eiE+BcmB27s1tDonMBoBiNlt1I0AhPnHNbSSB/mCA63OMSsh6bQagSTFxdPIbPLGMP1Mks5sYf5xRSZGQCQ0uTcIs/sEHo4jTESyFdWN/vCUiRLJdTbTfAxiakUhkJuz+SXykhOjSQyZ3DZUzYOpdc5xSbITk9c4H1KQzmwjcbfOBIvlzcoDUlGq7GA4jkLVvLw7mUl9oAQ+1dAaqbSNy1St+fD2frFSsPz9A2bjgPenLlCZKAEqEilTizscq6y6WEUy9RVG44CVC8RE0ylOml6Q6ZIXBcmJwSjChyrd7YfZI/pvPI2i9D/GcyyW3znKldNefgudHp0TBrU6ob/v4pCHUMzURsIJ9DFf3nCzaB0xY2NQu3vCoF/PQfam2f7GhKSYKkzy2YNVZGGQEmodxUiAp5cgE5GaZvuYX+VL64gJ3hdXPJDfAkVBYGKbza/YA5Lf7oaYgKYSIXmRzdm59nT3U8UfqCw72Pj57lEAAAAASUVORK5CYII=",_0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACBUlEQVR42jWT51bbQBBG9w0SkhBkuVvIBVww7rZMT3KMjUOIA6ak9/d/gC/nDtkfc6Zs0dxvVu7rYUW3g7x+v2ro75uW2Z/XTbMfJzvmWX8Yl/Qp2Ta7HxX1eRrr+3FNblB6rpNG7tHqOZEnlUBnrYLZKNo0f9rM67ieVTf/VMPohSbxlo52M3KrQUmz+pbmzVCLVqirXkGrQaRZPdBqGOmyk9P7fkmXnbyW7YyW7aytsx/vfp7uWpt3w4K1DBJt0iKtUgePfeS/zuoWUwPLwcEhPIVvR1XLuQDz2nCINf8xLiN3ndwT4/LMB7VQ4/iluvkNjbY31S8+M49GaAP3tJoyrQ530nJ305rmzZRuxrHxz1uhzpsp4ztvBP8tpetRLPQiZg1tOGsItLju5/RxEpkOjA1W2qRGy3gQiT0iWrkvB2UrYH7u1LjU6+ENHfBcjNkFMCblwHjgJGfGeGY/KT/OG11gZx8xe9jvmPe7bsFYb5OqxTfjspb7WS1aaau93c/qehxrsZfWRTujD8PI1meNQI424IUJjybwggAKrcIOntfJj5TcIRgFjENs5jLqHOID/uGQc4H/GHo4mHgHGKzM2vMya3sb1dA8tV5hw96KP+Pg5K0zU2LexDqpWIw+6EG8nlTsP7jqFe2fudhL27/hPCPjgwk22oQfPfwbIKdtr4vH/geZ9KljEaVWjQAAAABJRU5ErkJggg==",v0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAO0lEQVR42mNgGL7gjpHNfxgmS/OvO25wTLIhA28AxWEAAzY9Rv8piomBNQCkmWwDYBqp4gWKvUHzQAQAlSpNE3D8AIoAAAAASUVORK5CYII=",A0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB3ElEQVR42oWTSW4CQQxF6xCs+x5sEBLzPA9bQMAKwQIQ8zxzgCiR2GWRG+RafQNHz63KtEgWlqvL/t/fdrXZ7XayWq0kEonIYrGQVColoVBIisWibLdbuVwuaqVSSRKJhGSzWclkMhoDZzabjR4Ilstl6ff70ul0pFqtyu12U1IMwOFw0DyKzmYzGY1GYjiQUKlUpN1uK0G325V6vS73+13J8RAcj0cl5g6S6XTqKYAkHA5Lo9HQ6s1mU2q1miat12utvN/v1VMIjykBzMjy+/3SarUUjAoIrterJuJph96tQYxyw7ACgYAEg0GJxWLqe72exONxlU1iOp3Wyslk8lM+cVXAB/IwGEkgCDEgtkLv3GPkAaRtlBsrhSD+dDppAiAqk8iclsulgieTicYLhYIq0i2QDJCzz+f70wDzFlDG2o1dB8Pi/B+BbYs28YZDLpfTAfLavie7b47nn5wfCmhnPp9rUQMISRBhCnhxxH3+ArmvjrgP7/t8PmshlOTzeW+N9M5ueUy/JbvvjhLYbyYPhv5RbqLRqE6fCbMJ1AwGAxkOh/rWaW08HqtkYvxoTJ8NsQlVwPAA2BVBCtDOhpfJPZItkBiExl5CghKqQco9laxxT3VAFKBtCn4AuTYZj0NdJJ4AAAAASUVORK5CYII=",x0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAARElEQVR42mN4+OHrM0owA4j4//8/Azl41ICBNODDr/8nyDYAppmgAcgKcYnhNIAYzTgNIFYzVgNI0YxhAKmaqZsOKMEAk/kuojV/pp8AAAAASUVORK5CYII=",E0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACEklEQVR42k2SWU/TURDF78cSF9xYXEBR/AxYtBQrdBFaaw0xgrKIC6JAQRbjA8/qs/BmCDyQkDQ1jVvaoMQg2NLUHPMbcg0Pk/ufe+d/zpkz42ZSl/Ssu0Glwpy+bYzr1Z3Lmr7dotl0qx6HT9s53HFc1A0Fa/XkZp0eXjuq4lqnSp+icvzQf7VG2ZVRSe9VLs5rK58xEICnEhfsfe7uFcsJQFTu03jsrNyL+DljGrx+TNtfZlT58doKRm+c0kDgsLE9aD9iysgB39tc0O73WVPlVL1n6C9vnTdWCgF9Hj1j3wADBtvTrnpJHyS9ldQvFRNyPAAAGgWwowgAbSYFwdePQVNi0vXOyPQrpZ1st5wv5qSAR4yDXdtpZZcC0u+0sssBTfQ0mRrAHnWeNFMdrD4AoA3UUIjMSj6mn+thA+SeAAgzzcSR0An7kcv7bYfsxCyCfLK32QrxhXEChAJvrnkAAMFPtAD7WKTR7igih4hxYipnJnnRAB2P9OIL2QWW6u/WGyvybxjNCcDBe8eiII+ESwC0s/hflQ9qaId6TnLzgBGB7leWYr8LsNEKU4KVn6mhHUb4JxfZbwFDMI8JkAPCmLgHhBH7YAp4Vf0ct9HaGGEDAAORByMstAUrKgBnKh6klIuaUpuC7x93aYWWkAy73w9O3mGHjADYaa/PHmFFsmfgJ4D8HkDgDQSY7SyshvQPMjiB12kpDZcAAAAASUVORK5CYII=",S0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABIklEQVR42qWSSXLCQAxFOVOOAQmQAZ+Uk7AOZA4+QCATIOqp8hyrWLKQuy19fam/NFjML+IcG/CJ9Sx+X67j+2kSu9eb2K4u09c/f56nsVmO4utxHPu327wXAgIa4GibBGEf98OOgAKckPwTtE06AHqHCCDVOemQOP/EwHUEtE4XAEjGqHR4v+uqS8yJEe8I+MFJFezz4SoJIYYkCdaz7AQcHeAvGhAgMdv7E05BISIGAXeKFAKSrAaQu4IqHKTEwJwQ+E6MZNWnOkDNCTneIiJOmAEppkI6Qk6FLGP0rTjtIKu0TfFDrtBlCiSovC2ShI9/38ydxBMNcNoaAQh8v63nCHtCllWG0XUm6A7Ytk9QK+NljCoPgfsu0Kr9rsoqn2NHAE8QOxtBUK8AAAAASUVORK5CYII=",M0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAByElEQVR42k2TuU6DQQyE/XJQIoiCQPAGuZT7vu87eSsK6CmgpAEJaJKKSIM+S0YUm931zozH/h3T6UbPD2c6fVypUqmoVqupXq+rWq2q2+1Kx6ReHs/9XiwW1Ww2lc1m/Z7JZGTSnRCByOr3+2q1Wn5GAFKn09FgMPB7u932N0RIaDokHTCZTDSdTv3c6/X8DBgiBEQRIDMOWeCMHwCAS6WSRqORZrOZhsOhZ2AVCgW/hxjWSUQ5tt/vxSIAcbvdOni1Wmk+n2uxWDiR0hAHt9vttF6vtVwuZQTIvtlsHMCOXWLj8dhFiQNGhEUpETdqJxMXnKAOgDh7gCmVGJnBEgdv/+2EbVyQCXdRAk2lcZAjKcIWRC7YBoB1FkQahRBlNRqNvy8SrgxVmsZONh4RgRx9IBtgXEUcUcowLrggEwBEcEQZ+k5IupWO146J5rLAc/cSyIg9ssX3ZvcpPSTdAQQykoRz9MEYknK57CRsMjiQEQREguPbhaR7F2SEEYAD11CFRIBJjMeYD0Rfn86lz4SXRiydTiuXyymfz8tiZCFRExYpBSKNRUhfCXfDW4xyOLeYdx4JRqdj1vmn/rxfuv34WizIqVRKv2Fqi4/rqCKfAAAAAElFTkSuQmCC",y0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB9klEQVR42k2S504bQBCE730oogQDxgVMSyA0Y5tebFNCFSKJRO+E3olC7+856Ft0KD9Od7e7szOzd274tUptJ3nq+lei3psyjbzFlH4Ma+il0s4D9xV2ZqcueVGovttyDT6E1HqcKwew/y5ol8R5gTr+FlsjCrqvApajUeYpIshokLosskXe9VyXKh3Lsa7x03xNNgc0mwhrrKFY5H6lIrbTJFubbyoAQpx9jsrNxINa6w7rdypqUk/Gvmuzr1IXU60ab/yi88kWA6DsdLzJCDLVH2pR6ghu9Vdpvj2gn8mILqfbtJet05/Bah3/aNRuptYAEHCfi5doMVmm2faQxdxOukYsgssdQWMHvNoV0uHIt8+GS6ly7Q/Va70nYkogRLkDRCH7SmeFJQ+Gv5oV2BcSpXanhjvx7YHY59nBxgUbSIQZ0NFog8U3eqN254wSmtGAOmIOichjJ4EVOqOIHTByAVCHRWJetYOZrhThD5/MBABxAN4eMZShBGXU2xCxATtJ7jChhCJmwo49VNKIvFdlz+i9wkgT/gCsHsTCDuqInU002/8Aaw3oii8SNMCffwksUAwQZs6ooxaMA4AXLlgBQKG34ocGiMXMIMQCipxn88/m3544BcyGoRFjxxrs2KK5+z/BGWZ+GDF2WP3Q/D8gjhXm9g6tYSS0EsY1RAAAAABJRU5ErkJggg==",b0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABiElEQVR42k3TZ05YQQwE4L0PHRJqgAAHCL2FXk8TOqGGzjkdfZYs8eNpd+3xzHjXrx2+T8XB28/Yf52MrcfR2LgfzvX33VDGNx9GYuG8J7b/jcX67WAcfUxnbvmqP3aefkQrkKRiQfuV64GYPenMHPK50648E1S8eNGbsQZMQaJAALvP4+kAkbyVsnXpsi+J126+RxOgyppiewWl7KyAgLwiOXttNUqSwHsvEwlGRn3177e0auVK/Nefjowdf87E/Fl3NLa1gQCRe5CwR46QUl2yVSucIGrFXgH2kPiQFDkMscLJI2p60TP7X1dFyLUC6JPzIVWHJO+ANWBJKoqAtOIMWGu15HLVtGJ1OUCU7FkFQkIEGCmsnJa02NysQ1llvd5cjNW6QAUc1JzkJLLFEnXsgDW+lKiKFSkSbtTJ5SUCIMHOco2zmByimgvtcYRALAlsALVjQGqsuWC1Rhk5+85qcpDYAkKkiH1nZAD1P3DFURESzJ+pnrCGpZ6z3rrIFMtps/5ERP8Bnh4qEBy90cgAAAAASUVORK5CYII=",w0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACq0lEQVR42i1TZ3PaQBDV78rE44KxqRKqFAECBAjRezXVNBtwcJk4ZfJbX2Y3+XBzN3e7b9++fSfMhl2oYgh5K4njZolIOIBmxYEqhXHarrAc97GZT2CZMSQMFXFNgS6LWD0MMR12IUTVCOK6gpgmIxU3kDHjDBK482Ax7mE9G0EM+DDptxHTFOQzKWTMGCIhP+cJdtpEQlfw0G/zImRDlqBFRMTUCKjAoF1Hu+ryezpu4P24x345ZcbC8+McFScP20oyVVpmVEe/WUPIf4fpoINWpYTFuI9xt4lSPovjdgnKO+1WEAjNUCLQZYn7VqUQHgYdDFp1dBsVbqtRLmLYbmA+6rEOb4cdPs9H1kioODY69TIH06IzgQ07DbRrLkI+L5plB4vxgN+pb2o7k4whm4xDyKUSHEAVKGDca2HSa0MRg4jrKu+kBzGrlQqc1K6Vcdws8LJ7hPDr/QV+7w2qjo1es4qoJkMK+iGLQRbMc3nBiW+HLc5Pa2STMbRqLj5Oe/z5/grhx+uRL+OGikiIxncLx7ZAzKpOHpYZRbNSYtrU8++PbwzweT7ghUQkFDr4vR5YiX/BGTPKVelMbBplh81FoES9mE3j59sJxF4gBxqKBM/VBVeh4FbVRTGXRiGbgvfmCnY6ATef5d6DPi/ubq7g5jN8J+xXM6bdqVfgu72Gk7NQLuTY2qQBeYGEq7sFfiOmUsjPxWicwmG9gBYJY9Rt8viojeC9l6tSC1Sl7hYZkBgQYMnOgPLYSIQ66jRRyllMjYySjGq491zzmXzfqpb+szJx+fULzs8bHLcrnGiMJEi1aENXJBZpO59wsCaLrE0xZ2E9HSEV01kXAjWjGt/TxxLkcIB/G3n8aTWDaajsAbK1IYtciQzjFnJIJ6L80QatGtazMXbLKf4C7Skyh5I8TO0AAAAASUVORK5CYII=",T0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB+UlEQVR42j2T6VJTQRCF51UEI8GAstyouCKrr8ISExIslKRKIBINO+Efsm+Cig+ggAu4srzSsb6uan50zUz36e5z+vYNRyt3dLB0S9/W7up8v1s/tx/p97vH5vPzZOuhGZivqy36vn7P/BefnihQ4HjzgSWffui0AL6zj106XL6tv3vtlvxnt80SiIEl9nkxUiAJEJUxgIDoQqI3wL68TVoizDBjUOyPqVJIqpSp1Vh/TPP5SC97rqiSjzQ9dNNstK9a5VxCU89uyPD5yN7EAlTpCosfG/fN0Pprp9U6cocltGEIA3zkgA0A0Q2AO4WgC338vJ2uz4rCYClsQwQMiCAgunD3wiRwwpZEnxW4MDFYr0oh0uzzxkttI71VprWUjmuhkNRob7XG03Gb0cxQg8hhHuVcncK/9x2mhZNO/t3pRBf0shswcN18IZjzDgTR6Z8HCQR8iNAGg4+47wN+4oFEqhJ0fb4kDAkw3elIAs184PjCSE+VaWMXJnJ1evW0RuVsQqVMXLMvGjU33GQzYBaTg/V6PVBrPptRJq6ARirDAqq8mQE6oYv57tOdWWH4wQecTgtdnMihCHdOZFAEo5n/gCbB9963Df2+JMyB4s7Q/0hfOOYV0FZMxWwX+A/Yh/nhZtM91nfVduFN9rrNpZi6ZvuAdvaFvP9j6YXjKJEr0QAAAABJRU5ErkJggg==",C0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACcUlEQVR42jVSaVfaQBTNb2/dWEM2wK1qv1Sr7JCQBGjrUm1/w/3coxZRthBQnJ77cvphzpvJ5C7vzdXynSWObxVYD64VrO4Ktv+KYrhGujZGpjaC7c9gejNsnj3ACtZIN2bItiKUBgpasa+Qa8fYv1KwQyUggjP1CUxvCb01Qb45xsbpvayDK4VPNwrlbwrEarq7gtF9kw8kMNwY5f5awNnGVJQ/fPkjNVUZIt+JkWnORZ17bfe7gumvYQXvUku9RJ0kqeqLqGfrz9IG96b/hr0fSki4NNuPUOjMwJpvTaG7S7FGm1xOEMmd3Y2Qrb9g/1KBrp2+SmZguHPsVJ5QCpMfj36ylXe5pNrW+aN811tTmG4EK1Qyh4L3BrunoFndCKYXgUR0wJbogjM5vFYotGdIVZ+EiCR0YLDVgcLJnYKWqb/g4+k9ts7/YuPsQVR5yTacnhLVdG0ka6cyFFK2wDmwRc3wlkjVxmDVOwvJA1+FP7Ie3yV2mZGjW4Vyfwm9PYfVjbF1PoTmhGtkmzMUe+/IteYCYo9U57MSyHY+/1Y4vFEohkvsVEYw3AV2B0tolv+K8kAJON+OJFR0UfBehSjXWeHkVzJxho0OqJyqPsP0FtBomyQFBog/XSZWaZ1kBO5dKlhBMhcS5JpTIaELreBGyLWmyDQmMLsxigHzMJGBbn59lPzb/gJWdwHDTbKSqo7g+LGcNTtYwQlX2L54EoLtiyH09hR8HWZDb8+Qa06EIF17FiDPvOdZHJCg1F+Be4KyjbGkkwHj3gkW4oLqBDtBLA5Jrol6ZSTL8BZim+x0wmxwTyKq/W/D8mIUw1ha+QcfOBvm79E87QAAAABJRU5ErkJggg==",R0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA5klEQVR42qWTQRKEMAgE/f+jfIgaE/1ItjpVnQLdmwcWMpJhIOyyrmv/Ygs/x3H08zyHv66rt9aGgWFi+lLKsEkgsO/7SNi2bSTjJeI7BcDIwycCwPu+Z1XOGt8hFK+1ZgJAW/gnPaojhoBik4ADjBix/RKrjIuQGkOSFAB4yYpcgNThEoOpchLYU2wDTBLMAhFLLVjB/jxzQVI86mzxReCgiFXlHHxq5YNNAidupdiC5GLkgKVXMNkEzNhqxqhwwRJBXJI4MKv71C5VmoGyXOHnEllZYp/59V/QHKBtxMt4VUyCL/YDPqSC2MwXqD4AAAAASUVORK5CYII=",D0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB1klEQVR42j2TyUqDQRCE54Gz7/vyZ1/+JCBoUDwZDHgQRPFkEHMWvHgRRBCvIuoLlHwN7WHomenu6urqmTAYDNRut9VqtTSbzdTtdlUqlZTP521FUaRer6dGo6HFYqFms6lMJmMxhUJBASfJy+VSq9VK5XLZkgDCktTpdAycPUD4AAco9Pt9CxiPx+bI5XIGWK/XVa1WNZ/PrSp+7lkUwZ/NZhVIgsVkMjEgp0YFgkjAB8PhcGjJlUrFkok1BlDDiRZxHOvt+li7dWQMoAwLGNBGsVi0RRGsaUAyYjr116u17o4i1Wo1jUYjS4YFC10ohCU2kAwDKLpgBBLEnuqwmk6n+rg91efuzHSCPjY8bZf6ut/o+eLgf0w+WioARpusl8tD/ey35kMLWgzfD+d63MR2kU6nzSKQ9wkLAmFAi5yhzwhNA6ZAgPfPJb3DBAD2iIfytEN1CnCmWOCCXgAimKREImE9EgR1wH/3W73fnFh1zuSYBj4Wf1mAOH0YAQJ9poIeVMUPa3sHBMKCC/qDOhX8HstbYJEIU48xAHf4bAEiAMsZYaHqT9s/G8Dsg9Pm0tGxUPWfl0wmLcanhB9A+42uNiz8s1AJpf3bplIpS/DRsWfxiv8AVLh/8HhF7HkAAAAASUVORK5CYII=",P0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABuElEQVR42l2TV3ICQQxE5wwGTFiS86kIJqwNJ3DO4S7kzGGcE7ZPIdcTpa0tf0ztbE+rJbVm3Nj35OU0I4ubTfm63pDnk7RMG9kA+77d0v2wltTv61lWsc+rdemUouK65VV5O88p+HiUkqdjTwa1pP7/3u8EAv1KXIPeL/LKIQae65ZjCoaroAL2BPAl66yZk5+7bRWFz9monhLXq8Tl43JNQVQRoC1aAScb5PFeWvdUaa2AuU45plkIeDhMiiwOpFWMaLDhiE72M3oGTiJw2nLzZl6zQ4Zgi2wmgA/hMzDO582cOLJRomWEPPbTgamWkXIJpHTD8c/NGlk1hkVvGAUZkvmAAF5xTmYwzkd1T1yrEAkMNHdpi77NRIQYNxVaMNwhUyCbKRPEahejSgSnMjDMJpDW+NeLRAvcJnMag6gEZTAzTUfmLy8P/3ZvJuExkskItszY/xNAEO7I98T1q4ngDbBQbhVWlMyeUq06BI1HFXjlBtVE0AIEptDbXb4PgrlcfLlIcPCBCqiYK+/o11qAjIg9JoQRohLICMAhOyLaQrsU1WB7PEyD+YbvPKJcOHsrNolhLSV/b3F+vBmIIJwAAAAASUVORK5CYII=",U0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB0ElEQVR42j2TSUsDURCE329Rg2ggv0ZE8eDFg5GQzGTfM9nXSZiLCIInr97E3PWHtXwFncPjTfpVVVcvCev12gaDgfX7fWu1WjadTm02mxnxbrert9FoZOPx2CaTiWLVatWSJLFarWZhtVrZYrEQGXCaprZcLiW03+9FQIw4v8EgBr7RaFhAlewAPeNms9HZ7XbKCpkb0WazKXyn07F6vW6BbJ4dqzwCns/n1uv1dA6Hg2JkhhTHsQ2HQ4kEyHwgQG0AXSDLMgFxRmYwlEvZ9EkOUANAJm5s8wiYQ7xSqegmGQ4RRbDdblsgKwAa4j0ATGnb7VZACLjizt2/W774IzHwIYoilcCjN9AbhxO3T38gFaJfxb1vgVrJ7jViC0f8Pr99tfzL0S7u3oQplUqKU/ZpjHywFBzG5L3A1dlNZrmHD4lyIOK4XC5LjO8AifGwLJCwygNCZKdHvidkRAgyW6gp+PwhUL+vKiKAIPOGOCVdP3+rDMi4Dyh6EyFdPX1Zvng8uQGICLYvHz9PO0KTGbnGyIFAJhpWiP9UFqII+EYixBK5OJhAkK4TwD5B+kIm3wkXxwWO+eaNPQkEqQkyYkyDrAh6WYCJ4RT7rLP/S/8BOjhvX8hCe+kAAAAASUVORK5CYII=",I0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADP0lEQVR42h2P608TVhyGD3bl0pbWXugKFQpF2Vi2Txtj02zK1VooUC69UKF0wJSRGJclu/xTS5jhJihQoFjaUsqtBVIETWRsTl2MMS7LnqXnw5Pz5by/93lFtNdA9vYHHN66xFSDYMFZyO5QOXGPiaPpz4h0aYn26Fnp1Mh3p0tJ1qflqF/HizEbYjNQytx1JX8s1cP+12SGK+XHiFvLXqiCZL9FHkn4zByM2En3FHHg0cjwobcYEXapifvMvEtcYaYpj/Q3Nla7imUw1mdkw/8+24NWYh4T2ds17LrzpcXbHz5kwykQS+0qOWGt+zwxb4k0SHhLpEXObn+4Ss6av66U5IK55hxno1bEyWwd/FRLukPw14iZRGch+/1GSapHw6bPRNhZQKRDzapLxZRDzX2XjokmJacPP0f8Ga7n3V07/3xfzds7lUQceSTdKjJ+g+RBSx5zTYJEn575ZkE0UE48WMWyx8LxTB3iiV/Ny28t0uBN9DJni/U8uV8nDU7H7PJAyl/C7kAp8d7zrHrLpMVSTwmJoB2R0z4LGthtExzP1snw09FyzsYv8uJuLXuDZXJGdrSKk7Eafm1QkBq+xPQNNZMOFWK6NZ85p4p7jQr+3bzCaoeaDa+R47Ea1nt0bISq5d4HnXpmnBommxSkRy4y1fweE1cFYitkJ8dks5LlbgPRbi0n39Ww4lIx33KOZKia+GAl6zcrSASr2BqysXHzApON55h3FiFy7Q9dWiauCcJuvQwuOJSyPROq4LfmfFa9pZLZtmJmWvMlix1alt16xGKnjmTQxs5wNbH+MvYGrcT79CR9JhIeA+FeM4vdJjljxWOR2pFeI4mAlUeeEsTxaCUpj54tr4G19gKyfUU89qpJdyn478ePiPpLmbiWR2qoioVOHZH2AhZahORoxIZ4PGLj7E4t2z4jewEzz0ctPBvUw88f8/fYBdb7y2T494V63qxf5vWjL9n2mwg7FMTcGkS0o4jFFsGyQ0GyV8dp0Ai/fMKOS0D6K3jawKvIF/C8GY6usuYqlO0nt+xkBkoRh0NWno3XkBmwsNSaJye8HrdJg4N7n8JpI6mQnfk2DbGAVU44DJWz6dGzGzDzP8aiSHpbdiwFAAAAAElFTkSuQmCC",L0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB3ElEQVR42k2ThVIDQQyG9xGwwZ1iLbQ4tMXd/Smwwd2dwd151TBfOrlpZ667t5vkl+TcxHeHlC6liXPOVe8USN2+TwJrWRI9C+h5wWyi3vGr3SuSksVUfa/azpfQVl7srvGoVDdNx2VCEEktF5VSOJfkJdsPkMmfTqlYz47dl69kyMh7i3RcV2syQVTm6b6r03f/aqZM/3XLwHNY3/seG3Xtua+PAYAc3MzVqrDhQQaJAERO/TL81qwg9QfFMvgSUTDkqhaqD71Gpeu2VormkxUZmqz5MwmeDGQZq7arUOycgN6HBhn7bBOYYFLnTY20XgalciNHg1h9CymazLkVLFtOF4dhUOQAL0Y/WtWc/qcmQSvMrBAJdMeM147QKiQQBC1W9DUclnhIgIRPyrWteIIXHgOM4GDqt8urbl7gMrphxR5UCsGOOIrpH8HjX+2Kjn4ucRqD8YUi8bPQfF6hYN6c0HMSzQuQaCl7itMR9siyJG8KcZUgCkANSTa+UOcMebwDQCzzwVzA0GEgVfFBB8M5ZygEG22+GViZT0ijQ3qJMaxGFbfxo2a3UF2nXXQIRBt3QDBbk0gwzTbj0KcAK0Nm5hkb+0acDQmH1l/Q6Eo8Kz4kaKMdafjEBP8DKnZwzOo3JTUAAAAASUVORK5CYII=",k0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACj0lEQVR42j2T6VbaUBSF8x6t2qItViAzYRIcUBkTAiSBMAgIxEAooLZ9/d11DuqvrCTrfvfs4QjTRgr1wg+suiqK8ldEXgbTpohlW0PkpvHYVPAyzOPJkrHtZ/Hb0zExFfwZF3ClHEEIOhofCjsKrtUTrF0DC1s9QFoinNs4XkcFjKsXCDsqXgZZ+JUEA+YtDcLcklDNnWLnZ/DYkBC0FSxtlW98bitwbuKIHB1PpsTvNMHM0rD3M7jWTiA8d3TU8meIHA0l5QiLloRJPYlxLYmdn8OwJrK8cS3BkraejnFD4ucnIPIMhB0ZV+oxItdg/ZNGCtt+Bu7tOcK2gtAxGLjtpTGoJPE2yqMkf4WwaMloFH7ibVRA2YhhbokIOjoWtsaa/UoSz235E0AHvbtz9mBYTUAInTSaxTj2fpYBS1tBwBOI7DqlQJPMmiID/02KGFZT2Lga7jOnECaNJCq5GDaujkvpC1ZOGjNT4hQCW0bv/gI7P8uywq7KN49qIk9yZ8QgBG2Ve0ASSuoxSwi7afZg2ZIwqkt4HRYYuHI07PoGpqbKXkxN+QBoXsax7qqcwtKWOcYPgHsbx8Y7ABeWyACKm+K8oRSoiZVsjI36AJBhM1PGxjPYRJIwbykMoCKRBPLiIXt2KNK98Q2vwzyu1BNseocqUwrkgVf+xT0gYwm4fy/c3jcwtzUI1DDygKpclI/Yg7kls5GBLbGJ9I+KtHZ0RI4KrxxnM8vpGIRpM8VN3PYNjpGqTHpJwgeAnvSNJiIJM0tlEDfxyRR5FyJX52Xa9A56qUz7QY6Xae1oLGs3yOPv4yX8hwSbyD1YuxlUMjGsOgpKyjEDqFy0TKR5UE1xjDQBLRPvQl16l/Ad/wHpztuqEpuNnAAAAABJRU5ErkJggg==",N0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABuklEQVR42lWTZ3LCQAyF90Lp7RAxGJuQfyn0lAvQCblCAgYMwzHS28k2871EnuTHjtaS3nuS1nJXpX3fiLZ9vbDlq/kN3Zvxji8Ha7L4Loq7vhZu+sujPeXZneNIIsEARoBN2jkdQPgQMyG+IRLB9fGBDqBZN/TTTt5/pHX/PDnXebw/9fNewaf9SKoAEQXrcACEfdw6FPBr2dR5Gp/pvCTljBAiwAhWcuveAaakaTdU0sPdiUBJJ+fn/UiA1agk/+u0ohyEaBkiZ6WQiALKtIHq26wqMmvhfV5TPB1EqlgEtEAFBGGftHOyn4uGfBBZG+NWoBjfDFMEMC2GRQVQmrQDlct9OSyqFQCQzXqh/LSSdPI/Q2QYPBVOVFe3JZGhCNmkFQik2KiUtbYYxGrDWS+oQEKvJNErFh/qkPC85DGr7D8AzEswcQKwUzpgQLRDRUYMAXFegdk5WGBb3hSlRgLl8lSLYaz2UP77KrwCBAg7+++ZKomATZ2KTNWqg9T2Q7tABcyBYULC0NJB/A9ICwzN9oI/kPxsmSDBCTNO29D0F0SMY9uItd1RBVxsZW2FbfOwtn1Yy7EV+Aab+kevh+NElQAAAABJRU5ErkJggg==",B0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAaUlEQVR42mOImmb0H4bNouT+I/OxYXQ1DMgC6JIgPj55DAOIdQWyWgwXkGwAqU7GawAxgYYRBqQYgC28GEixHZsXSY5GjHRASRgQFYgUxQKhdIERBsQ4GW9eINUArCmRkI14o5HUGAHxAcRDCDOV7zHzAAAAAElFTkSuQmCC",F0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAI0lEQVR42mP4wfDjPz7MwMCAH48aMCwMIKSACAtGDRj6BgAA9VT3EP8L2v4AAAAASUVORK5CYII=",O0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABEklEQVR42qXTSVLDQAwF0ByIYsECMnjOAPe/UFPPVV/YZJmFLLWGr99q+fDx9t5ekYPPcDy38XRp93Fe7encrWf2bZjaY1rK33+d2tIN7We5/QFwCFz7cU2iu89jFQAA5KzJ93xd/TsGSZQ0X/r1jEXssFDMRxdAEjFhB4iNje7i6Q6IFECoJ6ijZH46HTOTsCoAQSJIMNkycBZnB0y8AExUcqYLPUCuk3vnemGyGyJEwlZIK+LLWXEYPA0xiTT0DCySeQCigRUA1ExWkOT+rgSU/r8LBZDlAbTtrogvzyqHPy+0Y2Bw2xkoso1A4hPnZ5MCyLvnuWgdsnnZjQw1/83TDATyxgCSyJf/ISuOXQG8Ir94H6/lUHiUYQAAAABJRU5ErkJggg==",z0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACsUlEQVR42j2Te1faaBDG81HqsSbkQkIgt0ISLgbQL7C7p65UuYoCBbFStVVru9t+69/uvKftH3NmwuF95nmemdFuWy1GjsNVGLKIIoa2zTbLOLdtVnHMY56zKJdZui63ccxtnnOyv8+5aXJZraIJwKlhKJBtmjL1PN4nCXedDjdZxsc3b5hbFh+iiJswZO77bBsNzkollbXLIEBAhMEfr16xa7VYRpECkfin1+PH0ZF6LPVA17nvdBg7DkPLQpM/jctlBXJuWUrChe+zaTT4a2/vd/fv/T4b31edr+t1lmGoam0Rx6zTlIsgYOS6bPOcgWlyWioxdl2ei4Knw0O24keno/Ku0WDp+3xqtdBOTZNZrcbY81jV62zSlHkQ8LdhcBVFfO33mVoWC99X9ZeiYB0EfO31WFQqaNL5xDCYVqtssowzy2JULnOi64rBzLYZGQY3SaLyJgy5z3Neul0+pinaW13nnW0zsCyEjWiXEU4qFVZJwtnr14q2MJBaHl66rpIl35o4+9hsKodVHB1xl6Z8aja5cl1Wnsddvc7nPGddrbJNEp7lTVGwyzK0pefx/fiYl8ND/hWng4Bv/T7yu8SP42MVE8NQAMtqlYd2m6FhMHMcNJnvLkkUwDYIeMhzxeI6DBXQhzhWAJJlI8emyWB/n3UY8tTtoj21WnzrdrkwTVaVCpflMsODA9a1Go/tNtsw5KUoFMBNFKnuAvI+CBQb7bndZlYqMdF1pBb9F3IPcczccdhEEV96PaaOw32zycTz1K0MSiX+3NtDkwOZGoaSIFs3/jmy+yxjaprs0pSJbTO2LB5kW21b3c60UmH4ywORIPqFgZg40nWlX3wQ16/jWHWXuG02OTk4YOb76noVAwERL8QHoS6zXvm+kiLdn4pC7YHontdqaj+E/tv/9+A/PqbZa63/AUIAAAAASUVORK5CYII=",V0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACMUlEQVR42j2T2ZKlIBBEfev2KiougALud9+6Z/7/23Kisif6oYIIIU8mRZnoIqDMB8jalCOm4YE1vjGYM7pqRacnuG5F/mnQmw2zf/yWa49IXLehNzvaaiJg9k8UB4+2XFDlEXlqYNsFWvkfWHtEmXkaBHdFUmQ9xZXyUKnlhlYTN5fworNpZqiDRfbRUVykA0FNOf8AJIFtFth2pXPs72iKmUlE7O2RAFlFKIC+O7GSOTzRlBN0HmGbDXN4YZ/+YBu/4M0FtRLADdv4jaG7oswGeHuG63aMwxWJiIO7QKUDqiz8AqRce8LYP1jT8ITOJ1S5Z69MvSD/tEgm/8ASXzD1SkBdzLD1EeUhoqs2VNmI6O5MImtwZ8T+wiQEiHOtRgzmhHG4U2j0jmBv7Ic4S/SmWLDEL6jUsSS+bTfpwYt37dsT2mph9CW8cZz/osxG9O2ZSby5Yhwe8O6MvtuZQKU9klpNvPfknygPgWIRuuaETu8UinuRBgKKQ4/QX1hOEohz7G8swvyLkODuFApAUph65/fBnuheF5FrolLPgdinb0IEIE2Uw1IyE2UWmWCNX3SVF5BVrpJwoooZOv/5D8qD5zxIQ729wNQbtBqxjm/2aDBHdHpGXf5PIEKBRHfjYZku9dnDtTtBsjeHB0tA8ozinn0YwhLb7HwuiSkwuYb8B3UxckKjuxJaFxNTiKs0UlJwDuSjXKHTKweq0wvFMlhaRfZHxAKSM62eGL+pRsL+AZT8TCB+Q24BAAAAAElFTkSuQmCC",G0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACf0lEQVR42kVQWVPaYBTNL3JDFpUu04dqIYQkQJRtqljrRsuijooKBMLi2r612iq7gGi1/YOncy+mfbhzvnvuWTIR9pemUc+70SkpaBsymgUJ7aIXDV1ELedi7FZUtA0vGnkRvaoP3bKKjiEzL2RiM6jl3GgVJDR0D26yLg5r6h7G27KKOt2LEhuJ71Z8z6XyMKBf9XMDzTBIxC2bFbSKXm6l4FrWhV7Vz831vMihQjJkR1ybQCJoxYZ/HMmQDZ8XrLyv+8YQ1yzYDIwjFXYwR/pEyIZ0ZAqJoA3C3bEPHUPC4MSPdtHD2KsoaBVE6Guv0a+qzJu6li7y3quozAkkoOmWZTYRUgBhfu0VOkUJtyXvP83gJID70wCHtQseCA9nGi+Eppl2Sj/64OR3U3ezibBj/A+jEXYXZ/Bpnv7BJNJhO3beT2Mr6kA6YsdWxMG3VMiG3UUnkvwPrGCPNsGc8OPQhZuciJahoK5LaBRk1PIStqN21PIe3uu6F6S7OniHn0duXGdFRhrh6mCOzc2ijKvMHBoFL89+zMmB11k3z7e9t1z0fX8Wl5lZtAwVzaICgQhKvszMsYCC6LATtTNSgWnikgNTpzAvrKpjSIQcWFVGsRGwYEUewbpvHPF5K8+qOopUZAoflVEkw4QjSIYc+LRgw6ZmgfB0MY9+RUav7MWfr0HkVpyMNMTRjTTmu18Z6n6d+fF4HoBwf+LD7y8LeDrXmDyMTWFwrKJb8uDhdCgaHCusuasOA54uNL6RTjCbH881binF37CQTN2SBCowhwyPz0XmVwuZ5ZdIh63YitiGGLYhs/wCe0tOpJ/fu4vT2I46kAxakApNIhOj+wzjX3dKVZPw0/wfAAAAAElFTkSuQmCC",H0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABuElEQVR42k2TZ1JCQRCE9wxKBnmYT6USBARPYM56F5VQIHgYc9ZTjPUN1a/48djZ2emenkAYtyJ73i/Yy8Gcn19ni9arZezzdMGe9vL2cTJvj7s5G7WK9nYU2c/Fsr0fl+xhJ2vX67MWupW0gwAQ8HpYtEE974F/V6t+h/i+Hfn9+3zJfbx3q2kL/VrGs5OJj6yjrTkPhpg75ONWMVbFiYphs2BhUM85gRQgbdyO7PdyxbPwBlmnkvKTcoiDwBXcNQuxLNgB9TezbqOAQD4SAVSvXFU7migAjIMSVBsEqCAj9vXajAMh445Smh0rAMhHFvqCrSkAui0nnYBYqWIygVFwQQHyAN1uJGL5EKBk0JhkxcYHERMMnXLSwQBwQkJ38UkRgF417WD8EBHPaAONoE6CcdLpXjXjclGjuoeNvJMTy52+0ewAixRoPOyB+kIgQJZLmygl/RoE26VYAdl5pCxsZYf8ZiPhtvyQdcopC9r76WxsnTYTctRQFidg+WlsYOYQSAVBlCWp2hE2ESUC+8ozRn40GjVHfSFQGWki78RqD9iNMGxM6iF4euum/6GQsLGaFHdsyv8HSmltC4Nie4cAAAAASUVORK5CYII=",W0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABAUlEQVR42l3TWZICQQgEUO5/SPddZ/QGGknE60A/sIGChMos63k/vv+u+7brcb34ySf+vx36yy6HVefu523XVYLbabMAxFcUkNjjsus8Myh+mRTEFAJJbGJqAmibNCf/epzeBTVBkmmMJTYlPlAgiTOw8hNL8+TBVvKTCxxks4IakCRMMtnqeMBJgANWJpliNRzMZjzNAYXpJCZRps2mnJEYV0W2FOUwqN6GBtLZFEjLiBBfUiok46+UapsDTYCQl6/7zzfCbwAruwLpvIUUWtfdEdocKMA4ELJ6E/NsXqfmfwBhSFM4a2zyRSL2Xcd6AMk48wuJiJsMzwdl2pQ2PnU+npq1EOyYkt8AAAAASUVORK5CYII=",X0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB7ElEQVR42j3TR09QURAF4Ptb6L333n+FCij2LtgL/C9d6UZcCBuCkRiNLExk44IYF5ox35jr4uW9O/fMOWfKKxE/Y62lJZ7MzcXt4eF4Oj8fNwYG8lltbo5LXV2xNTERd0ZG4mpvb1xob4/zbW35vfv6ZZTt5eV4PDsbzxcX42xjY+ysrMTFzs4EnWtqipuDg3GlpyfWW1vzXuzu6GgSEiwSKTxbWMgLjwtEj2ZmUune2Fhc7++P+5OT6RBGHtfFgV2qt4aG8vJaX1+6kvRwejpLREqdG+qICJcKUi+gMzeAm+PjSfZgaiqJOUHivNHRkS4KdYnVemXnQP1ArMMhg9NIZETL5e7utA/kUs2SKFBSp0T9IIRYXPPlZA/Ypg7Itm9ESJRTGylBCaYR8Ss+Hbz/54A9QSDf6n/35lUc7r2NH98+/5+COAcvlpbi+9ePcbi/G8WisKwul+ZP9eT4KOLPaTaYK33hCJ4LCyhejMKSeLhRG/CXD/tZ95mGhiSvo4WB1ezsAXtUsbmU5E3NXpiEsuCc9UNjLZq8glltAqyzzIWyvMW8PaYlTl1POMp/AQF2yeyZr5iEatvZxJTMFeF0oPuSHDxAEs0aCKmua1zdSjFY8WKWdZ0FapeVpPb651G1SEqqi/T79CT+ApA28gZA+69hAAAAAElFTkSuQmCC",Y0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAtElEQVR42oWS7Q3CMAxEsxC7MAmTlJZ+vZZCC5saBbVSFPAlkn9EFzm+5wshOVewBiw4pwNr/+mX88lizWAPsOOe1wi2JfpPoxdYLSaYwCahh9j9KR4ANqgG9T6ip/feB4enO9gqGLz3CVwGERJigq2gh7ngkcKavx7VFhawTjHosz3nFYNWKQab90Oir8pC5UU1gdyWGIziQeNBTHNQCQbD3sBlEHO+FBj0JQsqKDGJt0z/ABez/Li/+XLPAAAAAElFTkSuQmCC",Q0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABvElEQVR42j2TSU7EQAxF6wapDOdstXpMp+d5TPdtQALEAZBYskCIDVwAIfaG95F74VTKZT9/O5VQVZWtVisbDoc2GAxsvV5rHY1GNp1ObT6fW6/X0/l4PJa/2+1au922yWRigQ0BBANbLpe2WCyuEE8EzMoeKNZsNi3MZjNtUEEiIMhUwMcZMZ1OR9ZqtQTH+v2+BYJQ4BCCUVWWpdbNZqNAwLdJYs9pam9ZJoBaIMArkgSg0WjoHYlAkc/6UxT2XRSCAscXcLgc+mMOJGP0fDgcBKUI76z472K0mySxsN1uFQyVGdAOhiKAVEE+yafTSXOg4EOM9pHnFgiiOiAgPjRWgo/Ho76Mg1ixxxj/W0AOxgZ5/iUA7nY7O5/POr9cLpoFhho/Dz4k790vEmpYSd7v9/I73HNoKUAhmUuDcUCCXxbkk+Sq6roWCCNWLVCNAIKZCUoA+/fHzywAUAQF5KkFqiCFHp3K8PxOUNGH9vk3dXwU8X9FVxkyxnBIZJhUB4YfwGuWCfaUpvZVFPae5yoUkIYKqMB8eEB495/IW7iP0V6yTIVQEXjQCwAkeVUUuAo+JUBa5QoT63/wL8Pic44jF1AkAAAAAElFTkSuQmCC",q0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACJklEQVR42j2TZ3LiUBCE3/1PsBiDkEgCge3dK6wNBoNyFkhkHPYOvdVD+DE1VD36m9AjdUgsJB8ajukIp2yMtdfBym1L3kYmgmkd0ayB0u8hW+qI5xr8SV3y2utBrb0uCCFgG5pIFxr2yVDEhFCYLlp3ULY0sHK7SBc6olkT6kYvnDZWbgebsI9dPEDpdyUoZod8Y7EqMKVy8tG6dMAHBgHxvCntE1AFPckUsTqjCvoCCN8bkjmGSpe6kPxpHTErOQZKr4N9MkDld1E4xnWULj6LJ+R2S8AckaGieVPEud0W6k/1G9/lC77WzzikQ5yyEXJbx9fqWWAEZEsNx2yEQ2pBJYsWSr+PwukgeH/EMbOwi00BrESgC4QAjkUR98RRCZQOGJtwICNQyA44RmHrAjjnY2n/e/0iAMLoFEdRrE5bgumjLOVcPIlwE/SQLy+blu6u7/vEwiEdiaW7eEgbmwKgvwzOxuq7aCAQ9+1BdnTLdOVm/SY0oegnhQSxEqtz+wx2w6q0zXmtCYRVb7bntgHFzbuvNXHB+ftLqvIiOSODF0eIN6lfD0gTCG+CR6bWXhufBb+BNv5Vf+SU5ZzjgSzvZnM4a8iSCaULvItk3oTahD3xm2JmCmnbMbXkNztjZXaa2cb9Y6OFBKlzzq/QkthGfewi894F/8TKFPJevMkDTvlYrM2WLcnq4i0XY6D0OyKi53SCI9Ah960mC75crC5dXPaj4T92a1FHsT/T1wAAAABJRU5ErkJggg==",K0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAl0lEQVR42u2STQrCMBCFexJv4KZLD+By8Ag9gWvXc46a39Z4yycDTyhNFlpcFQcej2HC9yYkXbefug0nfKMKMKvAqWBSQVTBQwVeBVkFNhvZm+4qNSAScO4PKCv39ImA1AI8Sc7cwLxQ8yK9cLsKEDi0pLxINA+EBIaMLYDjocQkR73vH7iZp//+FVp1vRxh2vw3/oDPAC9hB9T0l8HLxwAAAABJRU5ErkJggg==",j0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABJ0lEQVR42l3TWU5DMRBEUe9/qRAg8ywZHaMbRXz42S5XV49vnB6PuT2fp/3rcJifu9382G7n9/G4zrDeD7fbWu4/p9M8P59zIOyv15cxkMDuclki3hLo3Xmz3/8JUERKJEHkPBKzEz7e70sw0eFTuEACyDBeLAJwXOIJLoG8Ae0MnQuzVCx5wxgnPoQE4AFQCnD3UmEsBbslWuLDBzGAYV1IwBvRhJxLZyBYDGtb+eaxVhLAI+7uPAonT8DSqi7uBHErKPFVRIRyd67v1SKv8RogHCLjvYWlgFRnCDCA1d6mF3dUvPIt3OpQStWgtler0bRV3YraHDQ4hV6Ejft4H5LmoTAb8dILqxavSezy/x94T4WICGohbEVQYfLWvxHGCNHqria18xdmWdtSHY2e5AAAAABJRU5ErkJggg==",J0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABoUlEQVR42lXT11IcUQwE0PsVpPXa+0JYYDE5L9EmZ7DB8f//Qq6jsih4uDUzUnerJd1pv89243ytH1Od0VjodeJ253N8O1yLi/XZ+HW6E/fDpXj5shlXm/NxtjoTTwer8bC3nDG59v1oPcEzH8ai3x3PJBDAn/Nh/DzZjuutQZLlTpan4sfXreQo3HyoxAnSzfZCPp+PNxKkMky58P64vxKnK9PJaxKCBJA8Lzfm4m53MUFclBCCdy0SgW/ArLGjf0QkZNZZJqpfWDEHRrwhCVB09F8DU424g6BizYQbzhsVQSDVCZa69sSIik3/35ScY15Nkj0tsKg6EQ5quOJzHyfyDHqdd600QNatkyKSBOGah5g1T06MvG6n3x1LNw1ZC+Xg7SbKUV0aQn8v9jJPzDaaanV5PAUNhyCwbwTkytmMkwJsqoKgjRoimzU81a0V1vtsdzxbyjUiOgBINTxEhLof2oFRbPCpk8W8Nz2zbg6AEqrUSqtncyjbTv0rrarorXqvuRAgXP8B4brysDkDQYFaoa14slu/LWDdSESzIeT7H04PvEDmpaTbAAAAAElFTkSuQmCC",Z0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABpElEQVR42k3TWW4bQQwE0L6ErG1GtkeA90W77cSJfawcMbdi8DgikI+GeqqLxeKi9vBwiL5fx/PzW9zf72MyWcZu9xl3d7tYLC7j5eX9fL9K/PX1I6bTPnGnzWarmM8vYzJZRNcN0XXXMZ12ibl7h19cdCkynxd/mXij2PdD7Pe/0oXgw+F33N5uUwDum8vt9ufZ5SKzc982mx+pSMgdkeWnp1PiiMUhhMfNzc0mBZssrC2XVxnssKdOQX5hSpnN+gzmEl9cYxVBJuqIMh2PX4k/Ph7zrZwp0/10+s57U9Nqtc4gp2wLrH6wKjMBdWukspTRjIri2PUh7Tt//3wmxqY7Z3BcZXsj1GQSWJ03EVnYK2e+9aKaKLDKaf+PS93EalwyOwJxBBCrcnBadbsWx/fY+SE3sZaJfVNwJKlla6P6kNbGpVpnFuoIGsUlEbgGE+EyS7DfsngEUvaLqIFwAnBcgkqQLEvQKIAMLNc0auctjGBveKP9/vzfuY5mIQSzUwtjxjIjwznSAxnH0lbZcOW3Ggti/ZkIuMtSQbV9xDgjYBL/AKWRdCNhqY20AAAAAElFTkSuQmCC",$0="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABkElEQVR42jXTV3IDQQgE0D2vrCxZOeds3RjXo4oPanYYumnCNrPZLHa7XUyn0/j9/Y3H4xHP5zO+32+sVqs4nU5xu91is9mk/+fnJ3q9XiyXy3xvjsdjBiFh+/0++C6XS9zv9zw/n0+Ct9ttAjudTiwWi2i329FQMB6P43A4xHq9TsD1es1APqDz+ZwqJKjMSHw3JRMYEYK/v794vV7xfr8TjEhp7kDD4TDLQNIAkUy6h/l8noQkehuNRtHv92MymSSYXyw14pqqSxNlclZfGMIqkwEjqaQNJuyyIysFzlIFoFRN4/dtKrCN7NgGg0E+IhPAB6g37kw5kvAhyCZWx7FxkousxunUWFPQWOrcS0XjonYXJqsgRKyym4DsRVb3LMGSAAkkj4KSD8CM0UJJRhmSbKISmEstiT4AI5UJGQCfrLUfucpkdrvdnDUzRgDftfP+kdpUo4SpuCyhnIgE164boUwUivFWi1RnU7V6RNBqtbIERgFizS3JlNRk+PJfKEklC5Hsmln9QQJEiZEjYv/MknbK6xSXvQAAAABJRU5ErkJggg==",ev="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA5ElEQVR42oVSSQoCQQzsb6l4UfAF7ruoeNG7L1Dx4rjvv/AF7rtPipQwjUqSKejLVKaSqsSYL4xPKVo9i2QYzK5ZcrZRlrPo72K0fBQ+Rc1N5Kd4eEgQeFUA3ee3HP3/DOA7plAFRsekaGFyTtNgH9cFKm0/4XFcwwlTrRvUBRCim4EL1w4mAK8KTC8Z1idEFve8twCSlnxiA+oW0AXdpRBxA55rrHYChLA4rt4LiZwFxkdYUj543I1YrF8l0QJCxJ2oE6A7CqUQcY2qAEKULOA+sCVVoNzyqZfoGSI8IgcpRI57Aw/Htn+kY38BAAAAAElFTkSuQmCC",tv="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAARklEQVR42mNgGNTg/zS5/yBMvuZfJ/7/v2NDniFgA0CayTZglQbCgFUa5HmjJcXqf4IbmZoHhwHxHlr/XY1kh7IXRkgYAAAtx08xGSdEtAAAAABJRU5ErkJggg==",nv="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACBElEQVR42q2SW08aURSF/Tl9aowGKcWaxgflOjPMDBfRtkhiakhbbWsjl6HIcGe09omogFRA7tDaP7iavY1D+2wf1uxz1ln72yczsxBef4LHaIEeN7qIH1kBl8lNXCQ20Drx4iKxiauUA528jLrmZO+hUrZ1IswBl0kHi0xqan714DrjwVXKibrmMitBG2kXQ2iYCXgfsmBPeorDbRs+bFlxEH6Gd0EL3sqLiKlLiPmXcBC2Yl9ZvPf8y9xjAkYVBR3dg35RYo2rKnu1Wo1F3uwsiG7Oi+SuDRPDz54JuM0LDCBRcFxR0cm60dU9GJUVDEo+tLNuTI0A4hErhiUfZ03A9DTAEApS7RVE9Asipoaf13QjOuvlBaSizzEsy+yZgEd/xmFJwqSq4OdZAKOyD+OKD7NTFTNDxe/vW7g7D2JQFHF3HuKcvr+GqaHMAWT2CwIDqHFSlU0gwX99CzJ0VJa4ZvZW+Xz+DgyVG2nCoCjwNFK/4P0HRpVumIu9xLgizwGJ6Co+76wgvmvHYWgZX17beB2P2PFpewVHr6xIRF/gOHLvfQxbeG8CunkJrYwbDc2JTl5CM+1idXIibrJe9EsKbgs+3tc1B5JRO64z7jmAmijU1kUOUW2mnWhoDq5tXWAQDSEdv7HxmQn4O/wQaudE9qiRAARmXxdxtGNBryj/n//gD7hEMxHp4e3zAAAAAElFTkSuQmCC",iv="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAP0lEQVR42mNgGAVYgcaJLf9B+EOFzX8YG4SJ1oyukSRDsGlCNpAsA5ANISkMSHY+OnCb1vMfhMmOjVED6GQAALcOgI9WvP2/AAAAAElFTkSuQmCC",sv="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC10lEQVR42j2S11IiYRCF52EWHGbIEgQMCK63KgxhAMkmQEB9qfMkuiaigCQluIjIurrhfutvq/aiq6em6nx9/u7DfT39gPN4jo2Td7gKb7Ckp3AVf0O3O4AY6kMllWBN9rB6NIZjf4DVzBQauQV9pANz4hGcLtLD5tkvKDxVWNJjCHIP+ugQqmAXi4knAii2r7ByOIIt/UCA9eNXGHa7WMu+gFN6azAlhjAnRxCDLdiP5tg4/Yu1/AeWDmZYz00g+MrQhe7IgSs/hxhoQB1sQuW/A6cJdSAEmnAXf9ITjPExzKkJ3Cd/sJx9o6nKnWu4889YSvXJujM3g21vDKW3As5d+AFLckA/VL46TNEGbKkOrIl7fNk6hznRgzHaxoK3DEuyj7XsBAueWxgiLSqOl2pQeCpE3ii+wRJvkXAp2aZvXipD8FexGOtAsfMpVO7cQPBVoA83wVlTQ9qmff+JrDkzQ2gCJYIseL7BFO9io/hKnQF4bwkqqQxzvIv14yk4Znsx1qftMje85xI6uQJBuoZjv/8pksrkwJp6oKkM4sw9U+e0kR5MyTFchXeIwTbMsTsYwhUqfucCmmCNiuVAHahCHajBuHsP0V+lXXBKqYGl/We4ix/URekKq4d9mKJ1LO916Qr6cIPELBPMgW1vQLsgwObZH+ijj+B9Taxk59DJJSxsnxPAGKnCmf1OWdDKdcoBEzHI/ysYYgMSs2IwNl3wXhJAG7wl+yyFlsSnG2afQXShxucOnLkJ7JTxJ7r3WpZFdQbeV4MYbJA7694ExvgQ7LmCdANdqAZ9uA7RXwLHaOyu7DSOgyHchTlc+VesHE2g8texmBhBE+piOfNK3RRrEsCZGUGxdQGOTWWbZQD2zaazyZbUgEDsOraDKdRyB/bDF6wcPMKe7kHlvQbvuQJn2L2nVC0fjqALNwmglpvkwJoekpjtiZXjaEZPsCbbMETq0MpV/AMIQhUoMjIUHAAAAABJRU5ErkJggg==",rv="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABYUlEQVR42k3SRw5DMQgEUN//iuk9P72uHT2kif7CAsMwDNjteDz2x+PRz+dzv1wu/X6/1/l+v/3z+fTdbtdh5K7Xa9ntdls1bDscDv/CYRiqyJ0vB8QuFouKIUYkxrZxsQAA//V69efz+S90brdbHTh5JA2IfJKcJMSRLZfLHpWbzaYUwkRtMx9GswLzESoCok5XeXa1WhURDL92kC5ZVhYXciSn06m/3++6i6/X64o3LAKKFPN12O/3Nb8Cd3kF8Ky8kVsWCCCoYD6fFxmZ7qTbieNVxCiAbxzFEtiBSUWc7plXTNfxf2jmzycyZ2xeAmi8aA0Qacxv5JKiKHIVI0UgFzWZPWPUK2DKZu1CYb6x90Y8XpoG2U2NkL8fqVgnk0lZMQ0cRfmRWWApINNsErpJGkEy6nQWg/O00+m08vUKtqyTJAKAqJBzxsSWDu8gahygbF3QKOKz2axsCDIiP7kfk3S5iRcXcFYAAAAASUVORK5CYII=",mt=16,ov=Object.assign({"../../../../textures/ancient_debris.png":q_,"../../../../textures/bed.png":K_,"../../../../textures/bedrock.png":j_,"../../../../textures/bookshelf.png":J_,"../../../../textures/brewing_stand.png":Z_,"../../../../textures/cactus.png":$_,"../../../../textures/carved_pumpkin.png":e0,"../../../../textures/chest_side.png":t0,"../../../../textures/chest_top.png":n0,"../../../../textures/coal_ore.png":i0,"../../../../textures/cobblestone.png":s0,"../../../../textures/crafting_table_side.png":r0,"../../../../textures/crafting_table_top.png":o0,"../../../../textures/diamond_block.png":a0,"../../../../textures/diamond_ore.png":l0,"../../../../textures/dirt.png":c0,"../../../../textures/door_bottom.png":u0,"../../../../textures/door_top.png":d0,"../../../../textures/dried_ghast.png":h0,"../../../../textures/emerald_block.png":f0,"../../../../textures/emerald_ore.png":p0,"../../../../textures/enchanting_table.png":m0,"../../../../textures/end_stone.png":g0,"../../../../textures/farmland.png":_0,"../../../../textures/flower.png":v0,"../../../../textures/furnace.png":A0,"../../../../textures/glass.png":x0,"../../../../textures/glowstone.png":E0,"../../../../textures/gold_block.png":S0,"../../../../textures/gold_ore.png":M0,"../../../../textures/grass_side.png":y0,"../../../../textures/grass_top.png":b0,"../../../../textures/gravel.png":w0,"../../../../textures/hay_bale.png":T0,"../../../../textures/ice.png":C0,"../../../../textures/iron_block.png":R0,"../../../../textures/iron_ore.png":D0,"../../../../textures/jack_o_lantern.png":P0,"../../../../textures/lapis_ore.png":U0,"../../../../textures/lava.png":I0,"../../../../textures/leaves.png":L0,"../../../../textures/log_side.png":k0,"../../../../textures/log_top.png":N0,"../../../../textures/melon.png":B0,"../../../../textures/missing.png":F0,"../../../../textures/netherite_block.png":O0,"../../../../textures/netherrack.png":z0,"../../../../textures/obsidian.png":V0,"../../../../textures/planks.png":G0,"../../../../textures/pumpkin.png":H0,"../../../../textures/quartz_block.png":W0,"../../../../textures/quartz_ore.png":X0,"../../../../textures/rail.png":Y0,"../../../../textures/redstone_ore.png":Q0,"../../../../textures/sand.png":q0,"../../../../textures/sign.png":K0,"../../../../textures/snow.png":j0,"../../../../textures/soul_sand.png":J0,"../../../../textures/spawner.png":Z0,"../../../../textures/stone.png":$0,"../../../../textures/sugar_cane.png":ev,"../../../../textures/torch.png":tv,"../../../../textures/trapdoor.png":nv,"../../../../textures/warped_fungus.png":iv,"../../../../textures/water.png":sv,"../../../../textures/wool.png":rv});function av(i){return i.slice(i.lastIndexOf("/")+1).replace(/\.png$/,"")}function lv(i){return new Promise((e,t)=>{const n=new Image;n.onload=()=>e(n),n.onerror=()=>t(new Error(`그림을 못 읽었어요: ${i}`)),n.src=i})}function cv(){const i=new ImageData(mt,mt);for(let e=0;e<mt;e++)for(let t=0;t<mt;t++){const n=(e*mt+t)*4,s=(t>>3)+(e>>3)&1;i.data[n]=s?0:248,i.data[n+1]=0,i.data[n+2]=s?0:248,i.data[n+3]=255}return i}async function uv(){const i=document.createElement("canvas");i.width=mt,i.height=mt;const e=i.getContext("2d",{willReadFrequently:!0});if(!e)throw new Error("2D 캔버스를 만들 수 없어요");e.imageSmoothingEnabled=!1;const t=Object.entries(ov).map(([d,h])=>({name:av(d),url:h})).filter(d=>d.name!=="missing").sort((d,h)=>d.name.localeCompare(h.name)),n=new Map;n.set("missing",cv());const s=await Promise.all(t.map(async d=>{try{const h=await lv(d.url);return(h.width!==mt||h.height!==mt)&&console.warn(`textures/${d.name}.png 는 ${h.width}×${h.height} 예요. 16×16 으로 줄여서 써요.`),e.clearRect(0,0,mt,mt),e.drawImage(h,0,0,mt,mt),{name:d.name,data:e.getImageData(0,0,mt,mt)}}catch(h){return console.warn(h),null}}));for(const d of s)d&&n.set(d.name,d.data);const r=["missing",...[...n.keys()].filter(d=>d!=="missing")],o=r.length,a=new Uint8Array(mt*mt*4*o),c=new Map,l=mt*4;r.forEach((d,h)=>{c.set(d,h);const p=n.get(d).data,g=h*mt*l;for(let v=0;v<mt;v++)a.set(p.subarray(v*l,(v+1)*l),g+(mt-1-v)*l)});const u=new Xo(a,mt,mt,o);return u.format=en,u.type=vn,u.magFilter=Bt,u.minFilter=Ki,u.generateMipmaps=!0,u.wrapS=es,u.wrapT=es,u.colorSpace=Tn,u.needsUpdate=!0,{texture:u,index:c,images:n}}class dv{constructor(e,t){this.deps=t,this.el=document.createElement("div"),this.el.className="bag-panel",this.el.hidden=!0,this.el.innerHTML=`
      <div class="bag-card">
        <div class="bag-head">
          <div class="bag-tabs"></div>
          <button class="plain-btn bag-close" aria-label="닫기">✕</button>
        </div>
        <div class="bag-body">
          <div class="bag-grid"></div>
          <div class="bag-side"></div>
        </div>
      </div>`,e.appendChild(this.el),this.grid=this.el.querySelector(".bag-grid"),this.side=this.el.querySelector(".bag-side"),this.tabs=this.el.querySelector(".bag-tabs"),this.el.querySelector(".bag-close").addEventListener("click",()=>t.onClose()),this.el.addEventListener("click",n=>{n.target===this.el&&t.onClose()});for(let n=0;n<rr;n++){const s=document.createElement("button");s.className="bag-cell"+(n<Wr?" hot":""),s.dataset.slot=String(n),s.addEventListener("click",()=>this.tapCell(n)),this.cells.push(s)}this.renderTabs(),this.renderGrid(),this.renderSide()}deps;el;inv=new Array(rr).fill(null);stations={};tab="bag";selected=-1;half=!1;confirmDrop=!1;bottles=[];ingredient=-1;grid;side;tabs;cells=[];get visible(){return!this.el.hidden}show(e="bag"){this.tab=e,this.selected=-1,this.confirmDrop=!1,this.el.hidden=!1,this.renderAll()}hide(){this.el.hidden=!0}setInventory(e){this.inv=e,this.visible&&this.renderAll()}setStations(e){const t=JSON.stringify(e)!==JSON.stringify(this.stations);this.stations=e,this.tab==="brew"&&!e.brewing_stand&&(this.tab="bag"),t&&this.visible&&this.renderAll()}renderAll(){this.renderTabs(),this.renderGrid(),this.renderSide()}renderTabs(){const e=[["bag","🎒 가방"],["craft","🔨 만들기"]];this.stations.brewing_stand&&e.push(["brew","⚗️ 양조"]),this.tabs.innerHTML="";for(const[t,n]of e){const s=document.createElement("button");s.className="bag-tab"+(this.tab===t?" on":""),s.textContent=n,s.addEventListener("click",()=>{this.tab=t,this.selected=-1,this.renderAll()}),this.tabs.appendChild(s)}}renderGrid(){this.grid.innerHTML="";const e=document.createElement("div");e.className="bag-row hotrow";const t=document.createElement("div");t.className="bag-row bagrow";for(let s=0;s<rr;s++){const r=this.cells[s],o=this.inv[s];if(r.innerHTML="",r.classList.toggle("selected",s===this.selected),r.classList.toggle("bottle",this.tab==="brew"&&this.bottles.includes(s)),r.classList.toggle("ingredient",this.tab==="brew"&&this.ingredient===s),r.title=o?`${this.deps.nameOf(o.item)} ×${o.count}`:"",o){const a=this.deps.icon(o.item,36);if(a&&r.appendChild(a),o.count>1){const c=document.createElement("span");c.className="bag-count",c.textContent=String(o.count),r.appendChild(c)}}(s<Wr?e:t).appendChild(r)}const n=document.createElement("div");n.className="bag-label",n.textContent="아래 10칸이 게임 화면의 핫바예요",this.grid.append(t,n,e)}tapCell(e){const t=this.inv[e];if(this.tab==="brew"){if(!t)return;if(vc(t.item)){const n=this.bottles.indexOf(e);n>=0?this.bottles.splice(n,1):this.bottles.length<this.deps.potions.stand.bottles&&this.bottles.push(e)}else this.ingredient=this.ingredient===e?-1:e;this.renderGrid(),this.renderSide();return}if(this.confirmDrop=!1,this.selected<0)t&&(this.selected=e);else if(this.selected===e)this.selected=-1;else{const n=this.inv[this.selected];if(n){const s=this.half?Math.max(1,Math.floor(n.count/2)):n.count;this.deps.onMove(this.selected,e,s)}this.selected=-1}this.renderGrid(),this.renderSide()}renderSide(){this.side.innerHTML="",this.tab==="bag"?this.renderBagSide():this.tab==="craft"?this.renderCraftSide():this.renderBrewSide()}button(e,t,n,s=!1){const r=document.createElement("button");return r.className=t,r.textContent=e,r.disabled=s,r.addEventListener("click",n),r}renderBagSide(){const e=this.selected>=0?this.inv[this.selected]:null,t=document.createElement("div");t.className="bag-info",t.textContent=e?`${this.deps.nameOf(e.item)} ×${e.count}`:"칸을 탭해서 고르고, 다른 칸을 탭하면 옮겨요",this.side.appendChild(t);const n=this.button(this.half?"반만 옮기기: 켜짐":"반만 옮기기: 꺼짐","plain-btn"+(this.half?" on":""),()=>{this.half=!this.half,this.renderSide()});if(this.side.appendChild(n),e){const o=this.button(this.confirmDrop?"정말 버릴까요? (사라져요)":"버리기","plain-btn danger",()=>{if(!this.confirmDrop){this.confirmDrop=!0,this.renderSide();return}this.deps.onDrop(this.selected,e.count),this.selected=-1,this.confirmDrop=!1,this.renderGrid(),this.renderSide()});this.side.appendChild(o)}const s=["crafting_table","furnace","brewing_stand"].filter(o=>this.stations[o]),r=document.createElement("div");r.className="bag-tip",r.textContent=s.length?`가까이에: ${s.map(o=>this.deps.nameOf(o)).join(", ")}`:"제작대·화로·양조기 가까이 가면 더 만들 수 있어요",this.side.appendChild(r)}renderCraftSide(){const e=document.createElement("div");e.className="craft-list";const t=["inventory"];this.stations.crafting_table&&t.push("crafting_table"),this.stations.furnace&&t.push("furnace");const n=t.flatMap(s=>this.deps.recipes.forStation(s));n.sort((s,r)=>Number(or(this.inv,r))-Number(or(this.inv,s)));for(const s of n){const r=or(this.inv,s),o=document.createElement("div");o.className="craft-row"+(r?"":" no");const a=Object.keys(s.out)[0],c=this.deps.icon(a,32);c&&o.appendChild(c);const l=document.createElement("div");l.className="craft-text";const u=s.out[a],d=Object.entries(s.in).map(([g,v])=>{const m=this.inv.reduce((f,b)=>b&&b.item===g?f+b.count:f,0);return`${this.deps.nameOf(g)} ${Math.min(m,v)}/${v}`}).join(" · "),h=(r||Object.keys(Ac(this.inv,s.in)).length,"");l.innerHTML=`<b>${s.name}${u>1?` ×${u}`:""}</b>${s.station!=="inventory"?` <span class="craft-station">${this.deps.nameOf(s.station)}</span>`:""}<br><span class="craft-need">${d}${h}</span>`,o.appendChild(l);const p=xc(this.inv,s);o.appendChild(this.button(r?`만들기${p>1?` (${p}번 가능)`:""}`:"재료 부족","big-btn small",()=>this.deps.onCraft(s.id),!r)),e.appendChild(o)}n.length===0&&(e.textContent="만들 수 있는 것이 없어요"),this.side.appendChild(e)}renderBrewSide(){const e=document.createElement("div");e.className="brew-box";const t=this.deps.potions.stand,n=document.createElement("div");n.className="bag-info",n.textContent=`병 ${this.bottles.length}/${t.bottles} · 재료 ${this.ingredient>=0?this.deps.nameOf(this.inv[this.ingredient].item):"없음"}`,e.appendChild(n);const s=document.createElement("div");s.className="bag-tip",s.textContent=`가방에서 물병·물약을 탭하면 병 칸(최대 ${t.bottles}개), 다른 것을 탭하면 재료. 연료: ${this.deps.nameOf(t.fuel)} 1개 = ${t.brewsPerFuel}번`,e.appendChild(s);const r=this.ingredient>=0?this.inv[this.ingredient]:null,o=document.createElement("ul");o.className="brew-preview";let a=!1;for(const c of this.bottles){const l=this.inv[c];if(!l)continue;const u=Ec(l.item),d=r?this.deps.potions.brew(u,r.item):null,h=document.createElement("li");h.textContent=`${this.deps.potions.displayName(u)} → ${d?this.deps.potions.displayName(d):r?"(아무 일 없음)":"?"}`,d&&(a=!0),o.appendChild(h)}e.appendChild(o),e.appendChild(this.button("양조하기","big-btn small",()=>this.deps.onBrew([...this.bottles],this.ingredient),!(a&&r&&this.bottles.length>0))),this.side.appendChild(e)}clearBrewSelection(){this.bottles=[],this.ingredient=-1,this.visible&&this.renderAll()}}class hv{constructor(e,t,n,s){this.onSend=n,this.onClose=s,this.sheet=document.createElement("div"),this.sheet.className="chat-panel",this.sheet.hidden=!0;const r=document.createElement("div");r.className="chat-card";const o=document.createElement("div");o.className="chat-emojis",t.emojis.forEach((l,u)=>{const d=document.createElement("button");d.className="chat-emoji",d.textContent=l,d.addEventListener("click",()=>this.send(Ml,u)),o.appendChild(d)});const a=document.createElement("div");a.className="chat-phrases";for(const l of t.phrases){const u=document.createElement("button");u.className="chat-phrase",u.textContent=l.text,u.addEventListener("click",()=>this.send(Sc,l.id)),a.appendChild(u)}const c=document.createElement("button");c.className="plain-btn chat-close",c.textContent="닫기",c.addEventListener("click",()=>s()),r.append(o,a,c),this.sheet.appendChild(r),this.sheet.addEventListener("click",l=>{l.target===this.sheet&&s()}),e.appendChild(this.sheet),this.log=document.createElement("div"),this.log.className="chat-log",this.log.hidden=!0,e.appendChild(this.log)}onSend;onClose;sheet;log;lines=[];hideTimer=null;send(e,t){this.onSend(e,t),this.onClose()}get visible(){return!this.sheet.hidden}show(){this.sheet.hidden=!1}hide(){this.sheet.hidden=!0}add(e,t){this.lines.push(`${e}: ${t}`),this.lines.length>5&&this.lines.shift(),this.log.innerHTML="";for(const n of this.lines){const s=document.createElement("div");s.textContent=n,this.log.appendChild(s)}this.log.hidden=!1,this.hideTimer&&window.clearTimeout(this.hideTimer),this.hideTimer=window.setTimeout(()=>{this.log.hidden=!0,this.lines.length=0},8e3)}}const ko=15,Gr=2*Math.PI*ko,fv=["북","북동","동","남동","남","남서","서","북서"];class pv{el;touchUI;gaugeFg;hotbar;slotEls=[];slotName;toastEl;debugEl;overlay;overlayTitle;overlaySub;overlayBtn;fullscreenBtn;debugBtn;bagBtn;familyBtn;familyText;chatBtn;helpEl;compassRose;compassLabels;compassText;lastBearing=NaN;onHelpToggle=null;villageEl;slots=[];selected=0;nameTimer=null;toastTimer=null;onSelect=null;onOverlayClick=null;timerEl;timerPhase;timerTime;actionEl;actionTitle;actionSub;actionBtn;onAction=null;resultEl;onResultAgain=null;onResultClose=null;constructor(e,t){const n=document.createElement("div");n.className=`hud${t?" touch":""}`,n.innerHTML=`
      <div class="crosshair"></div>
      <svg class="gauge" viewBox="0 0 40 40" aria-hidden="true">
        <circle class="gauge-bg" cx="20" cy="20" r="${ko}"></circle>
        <circle class="gauge-fg" cx="20" cy="20" r="${ko}"></circle>
      </svg>
      <div class="slot-name"></div>
      <div class="hotbar"></div>
      <div class="side-btns">
        <button class="sbtn bag-btn" aria-label="가방">🎒</button>
        <button class="sbtn chat-btn" aria-label="채팅">💬</button>
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
      </div>`,e.appendChild(n),this.el=n;const s=a=>n.querySelector(a);this.gaugeFg=s(".gauge-fg"),this.gaugeFg.style.strokeDasharray=`${Gr}`,this.gaugeFg.style.strokeDashoffset=`${Gr}`,this.hotbar=s(".hotbar"),this.slotName=s(".slot-name"),this.toastEl=s(".toast"),this.debugEl=s(".debug-text"),this.overlay=s(".overlay"),this.overlayTitle=s(".overlay-title"),this.overlaySub=s(".overlay-sub"),this.overlayBtn=s(".overlay .overlay-btn"),this.fullscreenBtn=s(".fullscreen"),this.debugBtn=s(".debug"),this.bagBtn=s(".bag-btn"),this.familyBtn=s(".help-family-btn"),this.familyText=s(".help-family-text"),this.chatBtn=s(".chat-btn"),this.helpEl=s(".help-panel"),this.compassRose=s(".compass-rose"),this.compassLabels=Array.from(n.querySelectorAll(".compass-label")),this.compassText=s(".compass-text"),s(".help-body").innerHTML=mv(t);const r=a=>{a.preventDefault(),this.showHelp()},o=a=>{a.preventDefault(),this.hideHelp()};this.helpEl.addEventListener("click",a=>{a.target===this.helpEl&&this.hideHelp()}),s(".sbtn.help").addEventListener("click",r),s(".overlay .overlay-help").addEventListener("click",r),s(".help-close").addEventListener("click",o),s(".help-ok").addEventListener("click",o),this.villageEl=s(".help-village"),this.timerEl=s(".exp-timer"),this.timerPhase=s(".exp-phase"),this.timerTime=s(".exp-time"),this.actionEl=s(".action-card"),this.actionTitle=s(".action-title"),this.actionSub=s(".action-sub"),this.actionBtn=s(".action-btn"),this.actionBtn.addEventListener("click",a=>{a.preventDefault(),this.onAction?.()}),this.resultEl=s(".result-panel"),s(".result-again").addEventListener("click",()=>{this.hideResult(),this.onResultAgain?.()}),s(".result-close").addEventListener("click",()=>{this.hideResult(),this.onResultClose?.()}),this.touchUI={surface:n,stickBase:s(".stick-base"),stickKnob:s(".stick-knob"),jumpButton:s(".jump"),sneakButton:s(".sneak")},this.overlayBtn.addEventListener("click",()=>this.onOverlayClick?.()),this.overlay.addEventListener("click",a=>{a.target===this.overlay&&this.onOverlayClick?.()})}setFullscreen(e){const t=this.fullscreenBtn;t.hidden=e==="hidden",t.classList.toggle("active",e==="on"),t.textContent=e==="on"?"⛶ 전체화면 끄기":"⛶ 전체화면",t.setAttribute("aria-label",e==="on"?"전체화면 끄기":"전체화면")}setSlots(e){const t=this.slotEls.length!==e.length;this.slots=e,t&&(this.hotbar.innerHTML="",this.slotEls.length=0,e.forEach((n,s)=>{const r=document.createElement("div");r.className="slot",r.dataset.index=String(s);const o=document.createElement("span");o.className="slot-key",o.textContent=String((s+1)%10),r.appendChild(o),r.addEventListener("pointerdown",a=>{a.preventDefault(),a.stopPropagation(),this.select(s),this.onSelect?.(s)}),this.hotbar.appendChild(r),this.slotEls.push(r)})),e.forEach((n,s)=>this.paintSlot(s,n)),t?this.select(0,!1):this.select(this.selected,!1)}paintSlot(e,t){const n=this.slotEls[e];if(n&&(n.querySelectorAll("canvas, .slot-count").forEach(s=>s.remove()),n.classList.toggle("empty",t.item===null),t.icon&&n.appendChild(t.icon),t.count>1)){const s=document.createElement("span");s.className="slot-count",s.textContent=String(t.count),n.appendChild(s)}}select(e,t=!0){this.slots.length!==0&&(e=(e%this.slots.length+this.slots.length)%this.slots.length,this.selected=e,this.slotEls.forEach((n,s)=>n.classList.toggle("selected",s===e)),t&&this.showSlotName(this.slots[e].item?this.slots[e].name:"빈 칸"))}selectDelta(e){this.select(this.selected+e)}get selectedIndex(){return this.selected}get selectedItem(){return this.slots[this.selected]?.item??null}showSlotName(e){this.slotName.textContent=e,this.slotName.classList.add("show"),this.nameTimer&&window.clearTimeout(this.nameTimer),this.nameTimer=window.setTimeout(()=>this.slotName.classList.remove("show"),1200)}setHeading(e){const t=(-e*180/Math.PI%360+360)%360;if(!(Math.abs(t-this.lastBearing)<.3)){this.lastBearing=t,this.compassRose.style.transform=`rotate(${-t}deg)`;for(const n of this.compassLabels)n.style.transform=`rotate(${t}deg)`;this.compassText.textContent=fv[Math.round(t/45)%8]}}setFamily(e){this.familyText.textContent=e?`가족 연결됨 (코드 ${e}) — 할 일·시간은 다음 단계에서`:"아빠·엄마 화면(/family)의 가족 코드로 내 계정을 연결해요",this.familyBtn.textContent=e?"다시 연결":"가족 연결"}setVillageInfo(e){this.villageEl.textContent=e}setProgress(e){const t=e>0;this.gaugeFg.parentElement.classList.toggle("show",t),t&&(this.gaugeFg.style.strokeDashoffset=`${Gr*(1-Math.min(1,e))}`)}toast(e,t=4e3){this.toastEl.textContent=e,this.toastEl.hidden=!1,this.toastTimer&&window.clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>this.toastEl.hidden=!0,t)}setDebug(e){this.debugEl.hidden=e===null,e!==null&&(this.debugEl.textContent=e)}setTimer(e,t){if(e===null){this.timerEl.hidden=!0;return}this.timerEl.hidden=!1;const n=Math.floor(e/60),s=Math.floor(e%60);this.timerTime.textContent=n+":"+String(s).padStart(2,"0"),this.timerPhase.textContent=t==="night"?"🌙 밤":t==="evening"?"🌇 저녁":"☀️ 낮",this.timerEl.classList.toggle("warn",e<=180),this.timerEl.classList.toggle("danger",e<=60),this.timerEl.classList.toggle("night",t==="night")}showAction(e,t,n,s){this.onAction=s,this.actionTitle.textContent!==e&&(this.actionTitle.textContent=e),this.actionSub.textContent!==t&&(this.actionSub.textContent=t),this.actionBtn.textContent!==n&&(this.actionBtn.textContent=n),this.actionEl.hidden=!1}hideAction(){this.actionEl.hidden=!0,this.onAction=null}triggerAction(){this.actionEl.hidden||this.onAction?.()}get actionVisible(){return!this.actionEl.hidden}showResult(e,t,n,s,r,o){this.onResultAgain=r,this.onResultClose=o;const a=l=>this.resultEl.querySelector(l);a(".result-title").textContent=e,a(".result-sub").textContent=t;const c=a(".result-items");if(c.innerHTML="",n.length===0){const l=document.createElement("li");l.className="result-empty",l.textContent="이번엔 빈손이에요. 블록을 부수면 가져올 수 있어요",c.appendChild(l)}for(const l of n){const u=document.createElement("li");l.icon&&u.appendChild(l.icon);const d=document.createElement("span");d.className="result-name",d.textContent=l.name;const h=document.createElement("span");h.className="result-count",h.textContent="×"+l.count,u.append(d,h),c.appendChild(u)}a(".result-again").textContent=s,this.resultEl.hidden=!1}hideResult(){this.resultEl.hidden=!0}get resultVisible(){return!this.resultEl.hidden}showOverlay(e,t,n){this.overlayTitle.textContent=e,this.overlaySub.textContent=t,this.overlayBtn.textContent=n??"",this.overlayBtn.hidden=n===null,this.overlay.classList.add("show")}hideOverlay(){this.overlay.classList.remove("show")}get overlayVisible(){return this.overlay.classList.contains("show")}showHelp(){this.helpEl.hidden&&(this.helpEl.hidden=!1,this.helpEl.querySelector(".help-card").scrollTop=0,this.onHelpToggle?.(!0))}hideHelp(){this.helpEl.hidden||(this.helpEl.hidden=!0,this.onHelpToggle?.(!1))}get helpVisible(){return!this.helpEl.hidden}}function mv(i){const e=i?[["걷기","왼쪽 아래 <b>스틱</b>을 누른 채 밀기. 끝까지 앞으로 밀면 달리기"],["둘러보기","스틱이 아닌 곳을 <b>드래그</b>"],["블록 놓기","놓을 자리를 <b>짧게 탭</b>"],["블록 부수기","블록을 <b>꾹 누르기</b>. 게이지가 차고 금이 가면 부서져요"],["점프","오른쪽 아래 <b>▲</b>"],["웅크리기","<b>▼</b> (한 번 누르면 켜짐, 다시 누르면 꺼짐). 웅크리면 모서리에서 안 떨어져요"],["블록 고르기","아래 칸(핫바)을 탭"],["가방 · 만들기","핫바 옆 <b>🎒</b>. 칸을 탭해 고르고 다른 칸을 탭하면 옮겨요"],["채팅","<b>💬</b> → 이모지나 문구를 골라요"],["FPS 보기","오른콽 위 <b>i</b>"]]:[["걷기 / 달리기","<b>W A S D</b> / Ctrl 누른 채 W"],["둘러보기","마우스. 클릭하면 마우스가 잠기고, <b>ESC</b>로 풀려요"],["블록 놓기","<b>오른쪽 클릭</b> (누르고 있으면 연속)"],["블록 부수기","<b>왼쪽 클릭 꾹</b>. 금이 가면 부서져요"],["점프 / 웅크리기","<b>Space</b> / <b>Shift</b>"],["블록 고르기","<b>1~9, 0</b> 또는 마우스 휠"],["가방 · 만들기","<b>E</b> (또는 핫바 옆 🎒)"],["채팅","<b>T</b> (또는 💬) → 이모지·문구 고르기"],["정보","<b>F3</b>"]],t=i?"PC 에서는: WASD 이동 · 마우스 둘러보기 · 왼쪽 클릭 꾹 부수기 · 오른쪽 클릭 놓기 · 1~9 블록":"폰에서는: 왼쪽 아래 스틱 · 드래그로 둘러보기 · 짧게 탭 놓기 · 꾹 눌러 부수기 · ▲ 점프",n=["왼쪽 위 <b>나침반</b>: 맨 위 글자가 지금 내가 보는 방향이에요(북은 빨강). 광장에서 북쪽에 포탈 자리와 강, 서쪽·동쪽에 큰 밭, 남쪽에 집 뼈대, 둘레는 참나무 숲과 언덕.","<b>블록은 유한</b>해요. 부수면 가방에 들어오고, 놓으면 가방에서 나가요. 처음엔 시작 키트(판자·흙·조약돌·횃불·유리·제작대·양동이)를 받아요. 물은 빈 양동이로 떠서 옮겨요.","<b>만들기</b>: 가방 화면의 🔨 탭. 판자·제작대 같은 건 어디서나, 문·계단 같은 건 <b>제작대</b>를 놓고 그 옆(5칸)에서. 양조기 옆에서는 ⚗️ 탭이 생겨요. 레시피는 아빠·아들이 recipes.json 에 적어요.","한 칸 높은 턱은 그냥 걸어가면 올라가요. 두 칸부터는 점프.","손에 든 블록이 오른쪽 아래에 보이고, 조준한 블록엔 검은 테두리가 생겨요. 닿는 거리는 5블록.","블록마다 부수는 시간이 달라요. 흙·모래 0.5초, 돌 1.5초, 원목·판자 2초. 맨 아래 기반암과 물은 못 부숴요.","내 몸이 있는 자리에는 블록을 놓을 수 없어요.","물에 들어가면 천천히 가라앉고, 점프를 누르면 위로 헤엄쳐요.","내가 놓은 물·용암은 양동이 하나만큼이에요. 사방으로 퍼지면서 낮아지고, 양만큼만 퍼지고 멈춰요(위로는 안 차요). 강·연못 같은 원래 있던 물은 마르지 않아요. 물이나 용암을 꾹 누르면(PC: 왼쪽 클릭) 떠내거나 닦아낼 수 있어요. 물이 용암을 만나면 돌이 돼요.","광장 남쪽에 뼈대만 있는 집이 있어요. 문·창문·지붕을 채워 봐요. 동남쪽 언덕엔 동굴 입구가 있고 땅속엔 광물과 동굴이 있어요.",'<b>원정</b>: 광장 북쪽 보라색 포탈 안에 서면 "원정 출발" 버튼이 나와요. 초원 섬에 10분 동안 다녀오는데, 6분이 지나면 밤이 돼요. 섬 가운데 포탈로 돌아오면 부순 블록을 마을 창고에 가져와요. 시간이 다 되면 저절로 돌아오지만 절반만 가져와요. 친구가 먼저 갔으면 같은 포탈에서 "따라가기".',"세계 끝은 보이지 않는 벽. 떨어지면 광장으로 돌아와요.","만든 것은 서버에 저장돼요. 같은 마을 코드로 들어오면 어느 폰·PC 에서도 같은 마을이에요. 친구에게 마을 코드 6자리를 알려 주면 함께 지을 수 있어요(6명까지).",'다른 사람이 놓거나 부순 블록도 바로 보여요. 서버가 "너무 멀어요" 같은 말을 하면 그 블록은 되돌아가요.'];return`<table class="help-table">${e.map(([s,r])=>`<tr><th>${s}</th><td>${r}</td></tr>`).join("")}</table><p class="help-other">${t}</p><h3>알아두면 좋아요</h3><ul class="help-tips">${n.map(s=>`<li>${s}</li>`).join("")}</ul>`}const hl=new WeakMap;function fl(i){let e=hl.get(i);return e||(e=document.createElement("canvas"),e.width=i.width,e.height=i.height,e.getContext("2d").putImageData(i,0,0),hl.set(i,e)),e}function gv(i,e,t=40){const n=Math.min(2,window.devicePixelRatio||1),s=document.createElement("canvas");s.width=s.height=Math.round(t*n),s.style.width=s.style.height=`${t}px`;const r=s.getContext("2d");r.imageSmoothingEnabled=!1;const o=t*n/32,a=fl(i),c=fl(e),l=u=>{r.globalCompositeOperation="source-atop",r.fillStyle=`rgba(0,0,0,${u})`,r.fillRect(0,0,16,16),r.globalCompositeOperation="source-over"};return r.setTransform(o,.5*o,-o,.5*o,16*o,0),r.drawImage(a,0,0,16,16),r.setTransform(o,.5*o,0,o,0,8*o),r.drawImage(c,0,0,16,16),l(.22),r.setTransform(o,-.5*o,0,o,16*o,16*o),r.drawImage(c,0,0,16,16),l(.42),r.setTransform(1,0,0,1,0,0),s}const pl=new Map;function _v(i){let e=0;for(let t=0;t<i.length;t++)e=e*31+i.charCodeAt(t)>>>0;return e%360}const ml={wooden:"#a0703a",stone:"#8a8a8a",iron:"#d8d8d8",golden:"#f2c94c",gold:"#f2c94c",diamond:"#5fd8e8",netherite:"#4a3f4a"};function gl(i){for(const e of Object.keys(ml))if(i.startsWith(e+"_")||i===e)return ml[e];return"#b0b0b0"}function Os(i,e,t,n,s,r){r=Math.min(r,n/2,s/2),i.beginPath(),i.moveTo(e+r,t),i.lineTo(e+n-r,t),i.quadraticCurveTo(e+n,t,e+n,t+r),i.lineTo(e+n,t+s-r),i.quadraticCurveTo(e+n,t+s,e+n-r,t+s),i.lineTo(e+r,t+s),i.quadraticCurveTo(e,t+s,e,t+s-r),i.lineTo(e,t+r),i.quadraticCurveTo(e,t,e+r,t),i.closePath()}function vv(i,e,t,n){const s=n/16;i.lineWidth=Math.max(1,s*.8),i.strokeStyle="rgba(0,0,0,0.55)";const r=e==="water_bottle"||e==="glass_bottle"||e.startsWith("potion.")||e.startsWith("splash_potion.")||e.startsWith("lingering_potion."),o=/_(pickaxe|axe|sword|shovel|hoe)$/.test(e),a=e==="bucket"||e.endsWith("_bucket"),c=e.endsWith("_dust")||e==="redstone"||e==="sugar"||e==="gunpowder"||e==="glowstone_dust",l=e.endsWith("_ingot")||e==="netherite"||e==="gold_nugget",u=e==="stick"||e==="blaze_rod"||e==="breeze_rod"||e==="bone",d=e==="string";if(r){const h=e==="glass_bottle"?null:e==="water_bottle"?"#3d7be6":e.includes("healing")?"#e64a4a":e.includes("speed")?"#7fd3ff":e.includes("awkward")?"#6b6ba8":"#a24ae6";i.fillStyle="rgba(200,225,255,0.55)",Os(i,4*s,6*s,8*s,9*s,3*s),i.fill(),i.stroke(),i.fillRect(6.5*s,2*s,3*s,4.5*s),i.strokeRect(6.5*s,2*s,3*s,4.5*s),i.fillStyle="#b07a3a",i.fillRect(6*s,1*s,4*s,1.6*s),h&&(i.fillStyle=h,Os(i,5*s,9*s,6*s,5*s,2.4*s),i.fill());return}if(a){const h=e==="water_bucket"?["#2f5fd6","#4d86ff"]:e==="lava_bucket"?["#e0561a","#ffa030"]:e==="milk_bucket"?["#e8e8e8","#ffffff"]:null,p=(b,M,_,T,y)=>{i.fillStyle=y,i.fillRect(b*s,M*s,_*s,T*s)},g="#2a2a2a",v="#5c5c5c",m="#9a9a9a",f="#d9d9d9";p(6,1,4,1,g),p(5,2,1,1,g),p(10,2,1,1,g),p(4,3,1,1,g),p(11,3,1,1,g),p(3,4,10,1,g),p(2,5,12,1,g),p(3,5,10,1,h?h[0]:v),p(4,5,4,1,h?h[1]:m),p(2,6,12,4,g),p(3,6,10,4,m),p(3,6,2,4,f),p(11,6,1,4,v),p(3,10,10,3,g),p(4,10,8,3,m),p(4,10,2,3,f),p(10,10,1,3,v),p(4,13,8,1,g),p(5,13,6,1,v),p(5,14,6,1,g);return}if(o){const h=gl(e);i.strokeStyle="#8a5a2b",i.lineWidth=2*s,i.beginPath(),i.moveTo(3*s,13*s),i.lineTo(10.5*s,5.5*s),i.stroke(),i.fillStyle=h,i.strokeStyle="rgba(0,0,0,0.55)",i.lineWidth=Math.max(1,s*.8),e.endsWith("pickaxe")?(i.beginPath(),i.moveTo(6*s,2.5*s),i.quadraticCurveTo(11*s,1.5*s,14*s,6*s),i.lineTo(12*s,7.5*s),i.quadraticCurveTo(10.5*s,4.5*s,7*s,4.5*s),i.closePath()):e.endsWith("axe")?(i.beginPath(),i.moveTo(9*s,2*s),i.lineTo(14*s,4*s),i.lineTo(13*s,8*s),i.lineTo(9.5*s,6.5*s),i.closePath()):e.endsWith("sword")?(i.beginPath(),i.moveTo(9*s,7*s),i.lineTo(13.5*s,2.5*s),i.lineTo(15*s,4*s),i.lineTo(10.5*s,8.5*s),i.closePath()):e.endsWith("shovel")?Os(i,9.5*s,1.5*s,5*s,6*s,2*s):(i.beginPath(),i.moveTo(9*s,3*s),i.lineTo(14.5*s,3*s),i.lineTo(14.5*s,5.5*s),i.lineTo(11*s,5.5*s),i.closePath()),i.fill(),i.stroke();return}if(c){const h=e==="glowstone_dust"?"#ffd75e":e==="redstone"?"#e03030":e==="sugar"?"#f4f4f4":e==="gunpowder"?"#666":"#c8c8c8";i.fillStyle=h;const p=[[8,11,4.5],[5,12.5,3],[11.5,12.5,3],[7,8,2],[10.5,8.5,1.6],[8.5,5.5,1.2]];for(const[g,v,m]of p)i.beginPath(),i.arc(g*s,v*s,m*s,0,Math.PI*2),i.fill();return}if(l){i.fillStyle=gl(e.replace("_ingot","").replace("gold_nugget","gold")),i.beginPath(),i.moveTo(2*s,11*s),i.lineTo(5*s,6*s),i.lineTo(14*s,6*s),i.lineTo(11*s,11*s),i.closePath(),i.fill(),i.stroke(),i.fillStyle="rgba(0,0,0,0.18)",i.fillRect(2*s,11*s,9*s,2*s);return}if(u){i.strokeStyle=e==="blaze_rod"?"#ffb02e":e==="bone"?"#eee":e==="breeze_rod"?"#9fd7ff":"#8a5a2b",i.lineWidth=2.2*s,i.beginPath(),i.moveTo(4*s,12.5*s),i.lineTo(12*s,3.5*s),i.stroke();return}if(d){i.strokeStyle="#f0f0f0",i.lineWidth=1.4*s,i.beginPath(),i.moveTo(3*s,4*s),i.bezierCurveTo(12*s,2*s,2*s,12*s,13*s,12*s),i.stroke();return}i.fillStyle=`hsl(${_v(e)} 45% 38%)`,Os(i,2*s,2*s,12*s,12*s,3*s),i.fill(),i.strokeStyle="rgba(255,255,255,0.35)",i.stroke(),i.fillStyle="#fff",i.font=`bold ${Math.round(n*.34)}px system-ui, sans-serif`,i.textAlign="center",i.textBaseline="middle",i.fillText(Array.from(t.replace(/\s/g,"")).slice(0,2).join(""),n/2,n/2)}function Av(i,e,t,n,s){const r=`${i}@${e}`,o=pl.get(r);if(o)return _l(o);const a=t.find(i);let c;if(a&&a.textures){const l=n.images.get("missing");c=gv(n.images.get(a.textures[0])??l,n.images.get(a.textures[1])??l,e)}else{const l=Math.min(3,window.devicePixelRatio||1);c=document.createElement("canvas"),c.width=c.height=Math.round(e*l),c.style.width=c.style.height=`${e}px`;const u=c.getContext("2d");vv(u,i,s,e*l)}return pl.set(r,c),_l(c)}function _l(i){const e=document.createElement("canvas");return e.width=i.width,e.height=i.height,e.style.width=i.style.width,e.style.height=i.style.height,e.getContext("2d").drawImage(i,0,0),e}class qo{workers=[];busy=[];pending=new Map;nextJob=1;constructor(e,t=qo.defaultCount()){for(let n=0;n<t;n++){const s=new Worker(new URL("/DragonVillage/assets/mesher.worker-BuyJxeUA.js",import.meta.url),{type:"module",name:`mesher-${n}`});s.onmessage=o=>this.onMessage(o.data),s.onerror=o=>console.error("메싱 워커 오류",o);const r={type:"init",blockInfo:e};s.postMessage(r),this.workers.push(s),this.busy.push(0)}}static defaultCount(){const e=typeof navigator<"u"&&navigator.hardwareConcurrency||2;return Math.max(1,Math.min(4,e-1))}get size(){return this.workers.length}get inflight(){return this.pending.size}mesh(e,t,n,s,r){let o=0;for(let c=1;c<this.busy.length;c++)this.busy[c]<this.busy[o]&&(o=c);const a=this.nextJob++;return this.busy[o]++,new Promise((c,l)=>{this.pending.set(a,{resolve:c,reject:l,worker:o});const u={type:"mesh",jobId:a,cx:e,cy:t,cz:n,padded:s,light:r};this.workers[o].postMessage(u,[s.buffer,r.buffer])})}onMessage(e){const t=this.pending.get(e.jobId);t&&(this.pending.delete(e.jobId),this.busy[t.worker]--,t.resolve(e))}dispose(){for(const e of this.workers)e.terminate();this.workers.length=0;for(const e of this.pending.values())e.reject(new Error("워커 풀 종료"));this.pending.clear()}}class xv{constructor(e,t){this.renderer=e;const n=window.devicePixelRatio||1;this.maxPixelRatio=Math.min(n,t?1.5:2),this.pixelRatio=t?Math.min(n,1):this.maxPixelRatio,this.apply()}renderer;ema=16;pixelRatio;maxPixelRatio;minPixelRatio=.5;timer=0;goodStreak=0;onChange=null;apply(){this.renderer.setPixelRatio(this.pixelRatio),this.onChange?.(this.pixelRatio)}frame(e){this.ema=this.ema*.94+e*1e3*.06,this.timer+=e,!(this.timer<2)&&(this.timer=0,this.ema>36&&this.pixelRatio>this.minPixelRatio?(this.pixelRatio=Math.max(this.minPixelRatio,this.pixelRatio-.25),this.goodStreak=0,this.apply()):this.ema<14&&this.pixelRatio<this.maxPixelRatio?++this.goodStreak>=3&&(this.pixelRatio=Math.min(this.maxPixelRatio,this.pixelRatio+.25),this.goodStreak=0,this.apply()):this.goodStreak=0)}resize(){this.apply()}}const Ev=5,vl=.3,Al=.25;class Sv{constructor(e,t,n,s){this.world=e,this.registry=t,this.player=n,this.events=s}world;registry;player;events;target=null;progress=0;breakingKey=-1;cooldown=0;placeTimer=0;swingTimer=0;selectedBlock=0;getBlock=(e,t,n)=>this.world.getBlock(e,t,n);placeDoor(e,t,n,s,r){if(!this.world.inBounds(e,t+1,n)||this.world.getBlock(e,t+1,n)!==fn||Oi(this.player.pos,on,e,t,n)||Oi(this.player.pos,on,e,t+1,n))return;const o=this.player.lookDir,a=Mc(o.x,o.z),c=this.registry.doorVariant(s.num,a,!1,!1),l=this.registry.doorVariant(s.num,a,!0,!1),u=this.world.setBlock(e,t,n,c),d=this.world.setBlock(e,t+1,n,l);(u.changed||d.changed)&&(this.events.onBlocksChanged([...u.dirty,...d.dirty]),this.events.onPlaced?.(e,t,n,c,r),this.events.onSwing())}toggleDoor(e,t){const n=t.door,s=n.upper?e.y-1:e.y;if(n.open&&(Oi(this.player.pos,on,e.x,s,e.z)||Oi(this.player.pos,on,e.x,s+1,e.z)))return;const r=this.registry.doorVariant(n.base,n.facing,!1,!n.open),o=this.registry.doorVariant(n.base,n.facing,!0,!n.open),a=this.world.setBlock(e.x,s,e.z,r),c=this.world.setBlock(e.x,s+1,e.z,o);(a.changed||c.changed)&&(this.events.onBlocksChanged([...a.dirty,...c.dirty]),this.events.onPlaced?.(e.x,e.y,e.z,n.upper?o:r,e.id),this.events.onSwing())}targetable=e=>e!==fn&&(this.bucketMode||!this.registry.isFluid(e));get bucketMode(){return this.selectedBlock>0&&this.registry.get(this.selectedBlock).fluid!==null}update(e,t){const n=this.player.eye,s=this.player.lookDir;if(this.target=Xc(this.getBlock,this.targetable,n.x,n.y,n.z,s.x,s.y,s.z,Ev),this.cooldown=Math.max(0,this.cooldown-t),e.primary&&this.target){const r=this.target,o=(r.x*1024+r.y)*1024+r.z|0;o!==this.breakingKey&&(this.breakingKey=o,this.progress=0),this.swingTimer-=t,this.swingTimer<=0&&(this.events.onSwing(),this.swingTimer=.25);const a=this.registry.get(r.id);if(a.fluid){if(this.progress=0,this.cooldown<=0&&(a.fluidLevel===0||a.fluidVolume>0)){const c=this.world.setBlock(r.x,r.y,r.z,fn);c.changed&&(this.events.onBlocksChanged(c.dirty),this.events.onBroken?.(r.x,r.y,r.z,r.id)),this.breakingKey=-1,this.cooldown=vl}}else if(a.hardness===null)this.progress=0;else if(this.cooldown<=0&&(this.progress+=a.hardness<=0?1:t/a.hardness,this.progress>=1)){const c=this.world.setBlock(r.x,r.y,r.z,fn);if(c.changed&&(this.events.onBlocksChanged(c.dirty),this.events.onBroken?.(r.x,r.y,r.z,r.id),a.door)){const l=this.world.setBlock(r.x,a.door.upper?r.y-1:r.y+1,r.z,fn);l.changed&&this.events.onBlocksChanged(l.dirty)}this.progress=0,this.breakingKey=-1,this.cooldown=vl}}else this.progress=0,this.breakingKey=-1,this.swingTimer=0;e.secondaryTap?(this.place(),this.placeTimer=Al):e.secondaryHold?(this.placeTimer-=t,this.placeTimer<=0&&(this.place(),this.placeTimer=Al)):this.placeTimer=0}place(){const e=this.target;if(!e)return;const t=this.registry.get(e.id);if(t.door){this.toggleDoor(e,t);return}if(this.selectedBlock<=0)return;const n=e.x+e.nx,s=e.y+e.ny,r=e.z+e.nz;if(!this.world.inBounds(n,s,r))return;const o=this.world.getBlock(n,s,r);if(o!==fn&&!this.registry.isFluid(o))return;const a=this.registry.get(this.selectedBlock);if(a.shape==="door"&&this.registry.isDoor(a.num)){this.placeDoor(n,s,r,a,o);return}if(a.solid&&Oi(this.player.pos,on,n,s,r))return;const c=a.fluid?this.registry.fluidFinite(a.fluidSource,Hr):this.selectedBlock,l=this.world.setBlock(n,s,r,c);l.changed&&(this.events.onBlocksChanged(l.dirty),this.events.onPlaced?.(n,s,r,c,o),this.events.onSwing())}}const Mv=500,yv=50,xl="grass_island",bv=["북","북서","서","남서","남","남동","동","북동"];async function Tv(i,e){const{isTouch:t,net:n,welcome:s}=e,r=Pu,o=await uv(),a=m_(r,o.index),c=s.playerIdx,l=new s_({antialias:!1,alpha:!1,powerPreference:"high-performance",stencil:!1});l.domElement.className="game",l.domElement.tabIndex=0,l.autoClear=!1,l.setClearColor(Zs,1),i.appendChild(l.domElement);const u=new Yl,d=new Zt(70,1,.05,600);d.rotation.order="YXZ";const h=D_(o.texture),p=new qo(a),g=t?5:8;(()=>{const I=g*vt;h.setFog(I*.55,I*.98),d.far=I*1.3+50,d.updateProjectionMatrix()})();const m=new Q_(u),f=new X_(u),b=new z_(h,a),M=new v_(u),_=new pv(i,t),T=I=>I in Ko?Ko[I]:jo(I,r,$o),y=(I,$)=>Av(I,$,r,o,T(I)),C=yc(s.inventory),L=()=>{const I=[];for(let $=0;$<Wr;$++){const me=C[$];I.push(me?{item:me.item,count:me.count,name:T(me.item),icon:y(me.item,40)}:{item:null,count:0,name:"빈 칸",icon:null})}_.setSlots(I)};L();const S=()=>{const I=_.selectedItem;return I?Gc(I,r)??0:0};let x=s.expedition;const D=()=>{const I=x?` · 원정 중: ${x.name} ${x.players}명`:"";_.setVillageInfo(`마을 "${s.village.name}" · 코드 ${s.village.code} · 지금 ${M.count+1}명${I} (친구에게 코드를 알려 주면 같은 마을에 들어와요)`)},k=new dv(i,{recipes:Lu,potions:Uu,icon:y,nameOf:T,onMove:(I,$,me)=>n.sendInvMove(I,$,me),onDrop:(I,$)=>n.sendInvDrop(I,$),onCraft:I=>n.sendCraft(I),onBrew:(I,$)=>{n.sendBrew(I,$),k.clearBrewSelection()},onClose:()=>Se()});k.setInventory(C);const F=new hv(i,Zo,(I,$)=>n.sendEmote(I,$),()=>ue());let V=0;const X=()=>{const I={},$=oe.world,me=oe.player.pos,ze=Math.floor(me.x),Xe=Math.floor(me.y+1),ht=Math.floor(me.z),rt=new Map;for(const it of["crafting_table","furnace","brewing_stand"]){const Ct=r.find(it);Ct&&rt.set(Ct.num,it)}for(let it=Xe-5;it<=Xe+5&&rt.size;it++)for(let Ct=ht-5;Ct<=ht+5&&rt.size;Ct++)for(let Ot=ze-5;Ot<=ze+5&&rt.size;Ot++){if(!$.inBounds(Ot,it,Ct))continue;const hn=rt.get($.getBlock(Ot,it,Ct));hn&&(I[hn]=!0,rt.delete($.getBlock(Ot,it,Ct)))}return I},B=new o_,K=new a_(l.domElement);B.add(K);const z=new h_(_.touchUI);B.add(z),B.add(new r_),B.paused=!0;const ee=new Map;let le=0;const pe=(I,$,me,ze,Xe)=>{le=le+1&65535,ee.set(le,{x:I,y:$,z:me,prev:Xe,id:ze}),n.sendBlockChange({seq:le,x:I,y:$,z:me,id:r.get(ze).id}),ee.size>200&&ee.delete(ee.keys().next().value)},Ue=(I,$,me)=>{for(const[ze,Xe]of ee)Xe.x===I&&Xe.y===$&&Xe.z===me&&ee.delete(ze)};let oe;const Le=(I,$,me,ze)=>{const Xe=I==="expedition"&&$?Cc(r,$.seed,$.treasures):Rc(r,s.village.seed),{world:ht}=Xe;for(const U of ze)ht.chunkInBounds(U.cx,U.cy,U.cz)&&Jo(U.bytes,r,ht.getOrCreateChunk(U.cx,U.cy,U.cz));const rt=new Kc(ht,r);rt.computeAll();const it=new P_(ht,rt,h,p,u);it.renderDistance=g,it.markAll();const Ct=new T_(ht,r,me,me.yaw);Ct.pitch=me.pitch;const Ot=(U,H,W,N)=>{const te=r.find(N),he=te?te.num:fn,Ae=ht.setBlock(U,H,W,he);Ae.changed&&(it.markDirtyAll(Ae.dirty),rt.markChanged(U,H,W))},hn=new Sv(ht,r,Ct,{onBlocksChanged:U=>it.markDirtyAll(U),onSwing:()=>b.swing(),onPlaced:(U,H,W,N,te)=>{rt.markChanged(U,H,W),pe(U,H,W,N,te)},onBroken:(U,H,W,N)=>{rt.markChanged(U,H,W),pe(U,H,W,fn,N)}}),xn=Xe.layout.portal,Bi=new Y_(u,xn,I==="expedition"?4177148:9060348);return{kind:I,world:ht,light:rt,chunks:it,player:Ct,interaction:hn,portal:Bi,portalPos:xn,genMs:Xe.ms,expedition:$,localStart:$?performance.now()-($.serverNow-$.startedAt):0,applyServerBlock:Ot}},He=(I,$,me,ze)=>oe.applyServerBlock(I,$,me,ze),Y=I=>{I.chunks.dispose(),u.remove(I.chunks.group),I.portal.dispose()};let j=1;const fe=I=>{Math.abs(I-j)<.002||(j=I,h.setSkyLight(I),m.setBrightness(I),l.setClearColor(Zs.clone().multiplyScalar(I),1))};oe=Le("village",null,{...s.spawn},s.chunks);for(const I of s.players)M.upsert(I);D();let xe=!1,ye=!1;const We=I=>{Y(oe),ee.clear(),oe=Le(I.kind,I.expedition,{...I.spawn},I.chunks);for(const $ of M.indices())M.remove($);for(const $ of I.players)M.upsert($);xe=ye=!1,_.hideAction(),I.kind==="expedition"&&I.expedition?_.toast(`${I.expedition.name}에 도착했어요! 가운데 포탈로 돌아오면 모은 것을 가져가요`,5e3):(fe(1),_.setTimer(null,null),_.toast("마을로 돌아왔어요",3e3)),D(),Ne()},yt=I=>{const $=I.items.map(rt=>({name:jo(rt.id,r,$o),count:rt.count,icon:y(rt.id,28)})),me=I.items.reduce((rt,it)=>rt+it.count,0),ze=Math.floor(I.elapsedSec/60),Xe=I.elapsedSec%60,ht=I.late?`시간이 다 되어 저절로 돌아왔어요. 절반만 가져왔어요 (${Math.round(I.keepRatio*100)}%)`:`${ze}분 ${Xe}초 만에 돌아왔어요. 모은 것 ${me}개를 마을 창고에 넣었어요`;B.paused=!0,K.enabled=!1,_.showResult(`${I.name} 원정 끝!`,ht,$,"한 번 더 갈까?",()=>{n.sendStartExpedition(I.expedition),se()},()=>se())};let R=!1;n.attach({onChunk:I=>{if(oe.world.chunkInBounds(I.cx,I.cy,I.cz)){Jo(I.bytes,r,oe.world.getOrCreateChunk(I.cx,I.cy,I.cz)),oe.chunks.markDirty(I.cx,I.cy,I.cz);for(let $=0;$<vt;$++)for(let me=0;me<vt;me++)for(let ze=0;ze<vt;ze++)oe.light.markChanged(I.cx*16+ze,I.cy*16+$,I.cz*16+me)}},onBlockChanged:I=>{Ue(I.x,I.y,I.z),He(I.x,I.y,I.z,I.id)},onBlockBatch:I=>{for(const $ of I.blocks)He($.x,$.y,$.z,$.id)},onRejected:I=>{const $=ee.get(I.seq);if(ee.delete(I.seq),$){const me=oe.world.setBlock($.x,$.y,$.z,$.prev);me.changed&&(oe.chunks.markDirtyAll(me.dirty),oe.light.markChanged($.x,$.y,$.z));const ze=r.get($.prev).door,Xe=r.get($.id).door??ze;if(Xe){const ht=Xe.upper?$.y-1:$.y+1,rt=ze?r.doorVariant(ze.base,ze.facing,!ze.upper,ze.open):fn,it=oe.world.setBlock($.x,ht,$.z,rt);it.changed&&(oe.chunks.markDirtyAll(it.dirty),oe.light.markChanged($.x,ht,$.z))}}_.toast(bc[I.reason]??"서버가 거절했어요",2500)},onPlayers:I=>M.setState(I,c),onPlayerJoined:I=>{M.upsert(I),_.toast(oe.kind==="expedition"?`${I.nick} 님이 원정에 왔어요`:`${I.nick} 님이 들어왔어요`,3e3),D()},onPlayerLeft:I=>{const $=M.nickOf(I);M.remove(I),$&&_.toast(oe.kind==="expedition"?`${$} 님이 마을로 갔어요`:`${$} 님이 나갔어요`,3e3),D()},onError:(I,$)=>_.toast($,4e3),onClose:I=>{R=!0,B.paused=!0,K.enabled=!1,_.showOverlay("서버와 연결이 끊어졐어요",I+`
다시 들어가려면 아래를 눌러요.`,"다시 연결")},onWorldEnter:We,onExpeditionResult:yt,onExpeditionState:I=>{const $=!!x;x=I,!$&&I&&oe.kind==="village"&&_.toast(`${I.name} 원정이 시작됐어요! 포탈에서 따라갈 수 있어요`,5e3),D()},onTimer:I=>{oe.expedition&&(oe.localStart=performance.now()-I.elapsedSec*1e3)},onInvSlots:I=>{for(const $ of I.slots)$.slot>=0&&$.slot<C.length&&(C[$.slot]=$.count>0?{item:$.item,count:$.count}:null);L(),k.setInventory(C)},onEmote:I=>{const $=Zo.text(I.kind,I.id);if(!$)return;const me=I.idx===c?"나":M.nickOf(I.idx)??"누군가";F.add(me,$),I.idx!==c?M.say(I.idx,$,I.kind===Ml?2.5:3.5):_.toast($,2500)}});const tt=new xv(l,t);let Fe=0,De=0;const ve=(I=!1)=>{const $=i.clientWidth||window.innerWidth,me=i.clientHeight||window.innerHeight;$<=0||me<=0||!I&&$===Fe&&me===De||(Fe=$,De=me,d.aspect=$/me,d.updateProjectionMatrix(),l.setSize($,me,!1))};tt.onChange=()=>ve(!0),ve(!0);const Je=()=>ve();window.addEventListener("resize",Je),window.addEventListener("orientationchange",()=>setTimeout(Je,200)),document.addEventListener("fullscreenchange",()=>{Je(),setTimeout(Je,300)}),window.visualViewport?.addEventListener("resize",Je);const Ee=typeof ResizeObserver<"u"?new ResizeObserver(Je):null;Ee?.observe(i);let ke=!1;_.debugBtn.addEventListener("click",()=>ke=!ke);const gt=window.matchMedia("(display-mode: standalone), (display-mode: fullscreen)").matches||navigator.standalone===!0,lt=!!document.fullscreenEnabled&&typeof document.documentElement.requestFullscreen=="function",w=`이 브라우저는 전체화면이 안 돼요.
공유 버튼 → "홈 화면에 추가" 로 열면 전체화면이 돼요.`,A=()=>{gt?_.setFullscreen("hidden"):lt?_.setFullscreen(document.fullscreenElement?"on":"off"):_.setFullscreen("unavailable")};A(),document.addEventListener("fullscreenchange",A);async function O(){if(!lt)return!1;try{document.fullscreenElement||await document.documentElement.requestFullscreen({navigationUI:"hide"});const I=screen.orientation;return I.lock&&await I.lock("landscape").catch(()=>{}),!0}catch{return!1}}async function q(){try{document.fullscreenElement&&await document.exitFullscreen()}catch{}}_.fullscreenBtn.addEventListener("click",()=>{if(!lt){_.toast(w,7e3);return}document.fullscreenElement?q():O().then(I=>{I||_.toast("전체화면을 켤 수 없었어요. 다시 한 번 눌러 보세요.",4e3)})});let J=!1,Q=!1;const Te=()=>{B.paused=!0,K.enabled=!1,_.showOverlay("잠깐 멈춤","ESC 로 나왔어요. 다시 들어가려면 아래를 눌러요.","계속하기")},se=()=>{R||(_.hideOverlay(),B.paused=!1,K.enabled=!0,l.domElement.focus(),t||K.requestLock().then(I=>{!I&&!Q&&(Q=!0,_.toast("이 브라우저는 마우스 잠금이 안 돼요. 마우스를 움직여 둘러보세요.",5e3))}))},be=()=>{!J||R||_.resultVisible||(B.paused=!0,K.enabled=!1,K.locked&&document.exitPointerLock(),k.setStations(X()),k.setInventory(C),k.show())},Se=()=>{k.visible&&(k.hide(),J&&!_.overlayVisible&&!_.resultVisible&&!F.visible&&se())},re=()=>{!J||R||_.resultVisible||(B.paused=!0,K.enabled=!1,K.locked&&document.exitPointerLock(),F.show())},ue=()=>{F.visible&&(F.hide(),J&&!_.overlayVisible&&!_.resultVisible&&!k.visible&&se())};_.bagBtn.addEventListener("click",()=>k.visible?Se():be()),_.setFamily(s.family),_.familyBtn.addEventListener("click",async()=>{const I=await wc(i,{title:"가족 연결",sub:"아빠·엄마 화면(/family)에 있는 가족 코드 6자리를 넣어요",pattern:/^\d{6}$/,invalid:"숫자 6자리예요",placeholder:"가족 코드 6자리",maxLength:6,okLabel:"다음"});if(!I)return;const $=await Tc(i,"내 PIN","내 계정이 맞는지 PIN 4자리로 확인해요","연결","취소");if($)try{const me=await n.linkFamily(I,$);_.setFamily(me),_.toast("가족에 연결됐어요! 아빠·엄마 화면에 내 이름이 보여요",5e3)}catch(me){_.toast(me.message||"연결할 수 없어요",5e3)}}),_.chatBtn.addEventListener("click",()=>F.visible?ue():re()),window.addEventListener("keydown",I=>{!J||R||(I.code==="KeyE"?(k.visible?Se():!F.visible&&!_.overlayVisible&&!_.helpVisible&&!_.resultVisible&&be(),I.preventDefault()):I.code==="KeyT"?(F.visible?ue():!k.visible&&!_.overlayVisible&&!_.helpVisible&&!_.resultVisible&&re(),I.preventDefault()):I.code==="Escape"&&(k.visible||F.visible)&&(Se(),ue()))}),_.onOverlayClick=()=>{if(R){window.location.reload();return}J&&se()},_.onHelpToggle=I=>{I?(B.paused=!0,K.enabled=!1):J&&!_.overlayVisible&&!_.resultVisible&&se()},document.addEventListener("pointerlockchange",()=>{t||!J||K.lockFailed||R||!K.locked&&!_.overlayVisible&&!_.helpVisible&&!_.resultVisible&&!_.actionVisible&&!k.visible&&!F.visible&&Te()}),i.addEventListener("click",I=>{I.target?.closest(".action-card, .result-panel, .bag-panel, .chat-panel, .side-btns")||J&&!t&&!K.locked&&!_.overlayVisible&&!_.resultVisible&&!k.visible&&!F.visible&&se()});let Re=!1,we=performance.now(),ce=0,Oe=0,P=0,ie=0,ae=0,ge=0,ne=0,Z=0;const Me=t?.6:1;function Ne(){if(!n.connected)return;const I=oe.player,$=(I.sneaking?Sl:0)|(I.sprinting?Dc:0)|(I.onGround?Pc:0)|(I.inWater?Uc:0);n.sendMove({x:I.pos.x,y:I.pos.y,z:I.pos.z,yaw:I.yaw,pitch:I.pitch,flags:$})}const nt=()=>oe.expedition?(performance.now()-oe.localStart)/1e3:0,je=t?"":"  (Enter)",Yt=I=>{I.code!=="Enter"&&I.code!=="NumpadEnter"||!J||!_.actionVisible||_.resultVisible||_.overlayVisible||_.helpVisible||(I.preventDefault(),_.triggerAction())};window.addEventListener("keydown",Yt);const Qt=()=>{const I=oe.player.pos;if(!Nc(oe.portalPos,I.x,I.y,I.z)){_.actionVisible&&_.hideAction();return}if(oe.kind==="village"){const me=Iu.require(xl);if(x){const ze=Math.floor(x.remainingSec/60);_.showAction(`${x.name} 원정 중`,`${x.players}명이 나가 있어요 · 약 ${ze}분 남음`,"따라가기"+je,()=>n.sendStartExpedition(x.id))}else _.showAction(`${me.name}으로 원정`,`${Math.round(me.durationSec/60)}분 · ${Math.round(me.nightStartsAt/60)}분 뒤 밤 · 보물 상자 ${me.treasures}개
포탈로 돌아오면 모은 것을 가져와요`,"원정 출발"+je,()=>n.sendStartExpedition(xl))}else _.showAction("마을로 돌아가기","지금까지 모은 것을 마을 창고에 넣어요","돌아가기"+je,()=>n.sendReturnHome())},hs=()=>{const I=oe.player,$=I.pos,me=(I.yaw*180/Math.PI+360)%360,ze=bv[Math.round(me/45)%8],Xe=oe.interaction.target,ht=Xe?`${r.get(Xe.id).name} (${Xe.x}, ${Xe.y}, ${Xe.z}) 면 ${["+X","-X","+Y","-Y","+Z","-Z"][Xe.face]}`:"없음",rt=oe.expedition?`원정 ${oe.expedition.name} 시드 ${oe.expedition.seed} 경과 ${nt().toFixed(0)}s 하늘 ${j.toFixed(2)}`:`마을 ${s.village.code} 시드 ${s.village.seed}`;return[`FPS ${P}  프레임 ${tt.ema.toFixed(1)}ms  해상도 ×${tt.pixelRatio.toFixed(2)}  렌더거리 ${oe.chunks.renderDistance}  화면 ${Fe}×${De} 버퍼 ${l.domElement.width}×${l.domElement.height} 비율 ${d.aspect.toFixed(2)}`,`드로우 ${ae}  삼각형 ${(ge/1e3).toFixed(1)}k`,`청크 보임 ${oe.chunks.stats.visibleChunks}  큐 ${oe.chunks.queued}  진행 ${oe.chunks.inflight}  워커 ${p.size}`,`메싱 최근 ${oe.chunks.stats.lastMs.toFixed(1)}ms  평균 ${oe.chunks.stats.avgMs.toFixed(1)}ms  최대 ${oe.chunks.stats.maxMs.toFixed(1)}ms  총 ${oe.chunks.stats.meshed}`,`위치 ${$.x.toFixed(2)} ${$.y.toFixed(2)} ${$.z.toFixed(2)}  yaw ${me.toFixed(0)}°  pitch ${(I.pitch*180/Math.PI).toFixed(0)}°  ${ze}`,`조준 ${ht}`,`바닥 ${I.onGround?"O":"X"}  물 ${I.inWater?"O":"X"}  웅크림 ${I.sneaking?"O":"X"}  달리기 ${I.sprinting?"O":"X"}`,`빛 여기 하늘 ${oe.light.skyAt(Math.floor($.x),Math.floor($.y+1),Math.floor($.z))} 블록 ${oe.light.blockAt(Math.floor($.x),Math.floor($.y+1),Math.floor($.z))}  조명 처음 ${oe.light.stats.initialMs.toFixed(0)}ms  최근 ${oe.light.stats.lastFlushMs.toFixed(1)}ms/${oe.light.stats.lastFlushCells}칸  지형 생성 ${oe.genMs.toFixed(0)}ms  청크 ${oe.world.chunkCount}`,`${t?"터치":"PC"}  ${navigator.hardwareConcurrency??"?"}코어  ${window.innerWidth}×${window.innerHeight}@${(window.devicePixelRatio||1).toFixed(1)}`,`서버 ${n.connected?`연결됨 왕복 ${n.rtt}ms`:"끊김"}  나 #${c}  같이 ${M.count}명  블록 대기 ${ee.size}  ${rt}`,`가방 ${C.filter(Boolean).length}/${C.length}칸  손 ${_.selectedItem??"빈 손"}`].join(`
`)},dn=I=>{Re&&(requestAnimationFrame(dn),Ni(I))},Ni=(I,$)=>{const me=Math.max(0,Math.min(.1,(I-we)/1e3));we=Math.max(we,I);const{player:ze,interaction:Xe,chunks:ht,light:rt}=oe;(ne=(ne+1)%15)===0&&ve();const it=B.frame(me);if(it.toggleDebug&&(ke=!ke),it.slotDelta!==0&&_.selectDelta(it.slotDelta),it.slotSelect>=0&&_.select(it.slotSelect),Xe.selectedBlock=S(),ze.update(it,me),Xe.update(it,me),ze.applyToCamera(d,Me),Z+=me*1e3,J&&Z>=yv&&(Z=0,Ne()),M.update(me),ht.markDirtyAll(rt.flush()),Xe.target?(f.setTarget(Xe.target.x,Xe.target.y,Xe.target.z),f.setProgress(Xe.progress)):f.clearTarget(),_.setProgress(Xe.progress),_.setHeading(ze.yaw),J&&Qt(),k.visible&&(V+=me*1e3)>=Mv&&(V=0,k.setStations(X())),oe.expedition){const Ot=oe.expedition,hn=nt(),xn=Math.max(0,Ot.durationSec-hn),Bi=Ic(Ot,hn);_.setTimer(xn,Bi),fe(Math.max(Lc,kc(Ot,hn))),!xe&&xn<=180&&xn>60&&(xe=!0,_.toast("3분 남았어요! 포탈로 돌아가요",5e3)),!ye&&xn<=60&&(ye=!0,_.toast("1분! 지금 돌아가지 않으면 절반만 가져가요",6e3))}ht.update(ze.pos.x,ze.pos.y,ze.pos.z),h.setTime(I/1e3),m.update(d.position),oe.portal.update(I/1e3),b.setBlock(S());const Ct=ze.onGround&&ze.horizontalSpeed>.4?Math.min(1,ze.horizontalSpeed/4.3):0;b.update(me,d,ze.walkCycle,Ct),l.clear(),l.render(u,d),ae=l.info.render.calls,ge=l.info.render.triangles,b.render(l,d),tt.frame(me),ce++,Oe+=me,Oe>=.5&&(P=Math.round(ce/Oe),ce=0,Oe=0),ie+=me,ke&&ie>=.25?(ie=0,_.setDebug(hs())):ke||_.setDebug(null)};return Re=!0,requestAnimationFrame(dn),_.showOverlay(`${s.village.name}`,(t?`왼쪽 아래 스틱: 움직이기  ·  드래그: 둘러보기
짧게 탭: 놓기  ·  꾹: 부수기`:`WASD 이동  ·  마우스 둘러보기
좌클릭 꾹: 부수기  ·  우클릭: 놓기`)+`
마을 코드 ${s.village.code}`,t?"탭해서 시작":"클릭해서 시작"),{start(){if(J)return;J=!0;const I=M.count;_.toast(I>0?`마을에 들어왔어요. 지금 ${I}명이 함께 있어요`:"마을에 들어왔어요. 친구에게 마을 코드를 알려 주세요",4e3),t&&(lt?O():gt||_.toast(w,7e3),window.innerHeight>window.innerWidth&&(lt||gt)&&_.toast("폰을 가로로 돌리면 더 편해요",3500)),Ne(),se()},dispose(){Re=!1,n.close(),B.dispose(),Y(oe),p.dispose(),m.dispose(),f.dispose(),b.dispose(),M.dispose(),h.dispose(),o.texture.dispose(),l.dispose(),window.removeEventListener("resize",Je),window.removeEventListener("keydown",Yt),k.el.remove(),F.sheet.remove(),F.log.remove(),Ee?.disconnect(),i.innerHTML=""}}}export{Tv as createGame};
//# sourceMappingURL=Game-iGL37KlA.js.map
