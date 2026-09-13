import * as THREE from 'three';

/** 하늘색·안개 — 낮 기준. 낮밤은 M3 에서 uSkyLight 로 */
export const SKY_COLOR = new THREE.Color(0x7ba4ff);
export const FOG_COLOR = new THREE.Color(0xc0d8ff);

/** 완전히 어두운 곳의 최소 밝기. 0 이면 동굴이 새까맣다 — 초5가 답답하지 않게 아주 조금 보이게 */
const MIN_LUM = 0.05;

const VERT = /* glsl */ `
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
  float lum = ${MIN_LUM.toFixed(2)} + ${(1 - MIN_LUM).toFixed(2)} * pow(l, 1.5);
  vec3 warm = mix(vec3(1.0), vec3(1.0, 0.86, 0.68), clamp(blk - sky, 0.0, 1.0));
  vLight = lum * warm;

  vUvw = vec3(uv, meta.x);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

const FRAG = /* glsl */ `
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
`;

export interface ChunkMaterials {
  opaque: THREE.ShaderMaterial;
  translucent: THREE.ShaderMaterial;
  /** 손에 든 블록용 — 안개 없음 */
  hand: THREE.ShaderMaterial;
  setFog(near: number, far: number): void;
  setTime(t: number): void;
  setSkyLight(v: number): void;
  dispose(): void;
}

export function createChunkMaterials(texture: THREE.DataArrayTexture): ChunkMaterials {
  const make = (cutout: number, extra: Partial<THREE.ShaderMaterialParameters> = {}) =>
    new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uTex: { value: texture },
        uFogColor: { value: FOG_COLOR.clone() },
        uFogNear: { value: 60 },
        uFogFar: { value: 120 },
        uSkyLight: { value: 1 },
        uCutout: { value: cutout },
        uTime: { value: 0 },
      },
      ...extra,
    });

  const opaque = make(1, { side: THREE.FrontSide });
  const translucent = make(0, { transparent: true, depthWrite: false, side: THREE.DoubleSide });
  const hand = make(1);
  hand.uniforms.uFogNear.value = 1e5;
  hand.uniforms.uFogFar.value = 1e6;

  const all = [opaque, translucent, hand];
  return {
    opaque,
    translucent,
    hand,
    setFog(near, far) {
      opaque.uniforms.uFogNear.value = near;
      opaque.uniforms.uFogFar.value = far;
      translucent.uniforms.uFogNear.value = near;
      translucent.uniforms.uFogFar.value = far;
    },
    setTime(t) {
      for (const m of all) m.uniforms.uTime.value = t;
    },
    setSkyLight(v) {
      for (const m of all) m.uniforms.uSkyLight.value = v;
    },
    dispose() {
      for (const m of all) m.dispose();
    },
  };
}
