import{u as E,a as _,T as L,r as h,b as H,V as m,D as ne,R as ie,S as w,N as re,c as $,C as J,M as O,P as G,W as b,d as A,e as I,f as Y,U as ae,g as Q,L as k,h as oe,i as z,H as le,j as y,k as se,l as ue,m as V,n as j,o as ce,p as fe,q as me,s as q}from"./index-BPYzhepa.js";const B=a=>a===Object(a)&&!Array.isArray(a)&&typeof a!="function";function W(a,e){const t=E(o=>o.gl),n=_(L,B(a)?Object.values(a):a);return h.useLayoutEffect(()=>{e?.(n)},[e]),h.useEffect(()=>{if("initTexture"in t){let o=[];Array.isArray(n)?o=n:n instanceof H?o=[n]:B(n)&&(o=Object.values(n)),o.forEach(r=>{r instanceof H&&t.initTexture(r)})}},[t,n]),h.useMemo(()=>{if(B(a)){const o={};let r=0;for(const l in a)o[l]=n[r++];return o}else return n},[a,n])}W.preload=a=>_.preload(L,a);W.clear=a=>_.clear(L,a);const X=JSON.parse('["precision mediump float;\\nprecision mediump int;\\n\\nvarying vec2 vUv;\\n\\nvoid main() {\\n  vUv = uv;\\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\\n}","precision mediump float;\\nprecision mediump int;\\nvarying vec2 vUv;\\nuniform float uRadius;\\nuniform float uFalloff;\\nuniform float uMix;\\nuniform float uDisplace;\\nuniform float uSkew;\\nuniform float uAngle;\\nuniform vec3 uVignetteColor;\\nuniform vec2 uPos; // 动态中心（跟随指针，如原始实现）\\nuniform vec2 uResolution;\\nuniform vec3 uClearColor;\\n// 边缘明暗强度：[-1,1]，负值加深暗角，正值提亮边缘\\nuniform float uEdgeIntensity;\\n\\nmat2 rot(float a) {\\n  return mat2(cos(a),-sin(a),sin(a),cos(a));\\n}\\nvoid main() {\\n  vec2 uv = vUv;\\n  vec4 color = vec4(vec3(1.), 0.);\\n  float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));\\n  float displacement = (luma - 0.5) * uDisplace * 0.5;\\n  vec2 aspectRatio = vec2(uResolution.x/uResolution.y, 1.0);\\n  vec2 skew = vec2(uSkew, 1.0 - uSkew);\\n  float halfRadius = uRadius * 0.5;\\n  float innerEdge = halfRadius - uFalloff * halfRadius * 0.5;\\n  float outerEdge = halfRadius + uFalloff * halfRadius * 0.5;\\n  // 使用动态指针位置作为暗角中心（原始方案）\\n  vec2 pos = uPos;\\n  vec2 scaledUV = uv * aspectRatio * rot(uAngle * 6.28318530718) * skew;\\n  vec2 scaledPos = pos * aspectRatio * rot(uAngle * 6.28318530718) * skew;\\n  float radius = distance(scaledUV, scaledPos);\\n  float falloff = smoothstep(innerEdge + displacement, outerEdge + displacement, radius);\\n  // 原始实现不额外乘 uMix（保留 uniform 以兼容但不使用）\\n\\n  // 根据 uEdgeIntensity 调整边缘亮暗：\\n  // uEdgeIntensity > 0 推向 0（提亮边缘），< 0 推向 1（加深暗角）\\n  float brighten = max(uEdgeIntensity, 0.0);\\n  float darken = max(-uEdgeIntensity, 0.0);\\n  falloff = mix(falloff, 0.0, brighten);\\n  falloff = mix(falloff, 1.0, darken);\\n\\n  vec3 mixed = mix(uClearColor, uVignetteColor, falloff);\\n  gl_FragColor = vec4(mixed, falloff);\\n}\\n","precision mediump float;\\nprecision mediump int;\\nvarying vec2 vUv;\\nuniform vec2 uResolution;\\nuniform sampler2D tInput;\\nuniform float uRadius;\\nuniform float uAngle;\\nuniform float uPhase;\\nuniform float uTime;\\nuniform float uMix;\\nuniform vec2 uPos;\\n\\nvoid main() {\\n  vec2 uv = vUv;\\n  float angle = uAngle * 10.;\\n  vec2 originalUV = uv;\\n  vec2 pos = uPos;\\n  uv -= pos;\\n  vec2 R = vec2(uv.x * uResolution.x / uResolution.y, uv.y);\\n  float distanceToCenter = length(R);\\n  if (distanceToCenter <= uRadius) {\\n    float rot = atan(R.y, R.x) + angle * smoothstep(uRadius, 0., distanceToCenter);\\n    uv = vec2(cos(rot + uTime / 20. + uPhase * 6.28318530718), sin(rot + uTime / 20. + uPhase * 6.28318530718));\\n    uv = distanceToCenter * uv + pos;\\n  }\\n  float t = smoothstep(0., uRadius, distanceToCenter);\\n  vec2 mixedUV = mix(uv, originalUV, t);\\n  gl_FragColor = texture2D(tInput, mix(vUv, mixedUV, uMix));\\n}\\n","precision mediump float;\\nprecision mediump int;\\nvarying vec2 vUv;\\nuniform sampler2D tInput;\\nuniform float uMixRadius;\\nuniform vec2 uPos;\\nuniform float uFrequency;\\nuniform float uAmplitude;\\nuniform float uRotation;\\nuniform float uTime;\\nuniform vec2 uResolution;\\nuniform vec2 uMousePos;\\nuniform float uTrackMouse;\\n\\nvoid main() {\\n  vec2 uv = vUv;\\n  vec2 waveCoord = vUv.xy * 2.0 - 1.0;\\n  float time = uTime * 0.25;\\n  float frequency = 20.0 * uFrequency;\\n  float amp = uAmplitude * 0.2;\\n  float waveX = sin((waveCoord.y + uPos.y) * frequency + (time)) * amp;\\n  float waveY = sin((waveCoord.x - uPos.x) * frequency + (time)) * amp;\\n  waveCoord.xy += vec2(mix(waveX, 0., uRotation), mix(0., waveY, uRotation));\\n  vec2 finalUV = waveCoord * 0.5 + 0.5;\\n  float aspectRatio = uResolution.x/uResolution.y;\\n  vec2 mPos = uPos + mix(vec2(0.), (uMousePos-0.5), uTrackMouse);\\n  float dist = (max(0.,1.-distance(uv * vec2(aspectRatio, 1.), mPos * vec2(aspectRatio, 1.)) * 4. * (1. - uMixRadius)));\\n  uv = mix(uv, finalUV, dist);\\n  gl_FragColor = texture2D(tInput, uv);\\n}\\n","precision mediump float;\\nprecision mediump int;\\nvarying vec2 vUv;\\nuniform sampler2D tInput;\\nuniform float uAmount;\\nuniform float uSpread;\\nuniform float uAngle;\\nuniform float uTime;\\nuniform float uSkew;\\nuniform float uCellScale;\\nuniform vec2 uPos;\\nuniform vec2 uResolution;\\nuniform float uMixRadius;\\nuniform int uMixRadiusInvert;\\nuniform int uEasing;\\nuniform vec2 uMousePos;\\nuniform float uTrackMouse;\\nuniform float uRoundness;\\n\\nvec2 random2( vec2 p ) {\\n  return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);\\n}\\nmat2 rot(float a) { return mat2(cos(a),-sin(a),sin(a),cos(a)); }\\n\\nfloat ease(int mode, float t){\\n  if(mode==1){ return 1.0 - (1.0 - t)*(1.0 - t); }\\n  if(mode==2){ return t < 0.5 ? 4.0*t*t*t : 1.0 - pow(-2.0*t + 2.0, 3.0)/2.0; }\\n  return t;\\n}\\n\\nvoid main(){\\n  vec2 uv = vUv;\\n  float aspectRatio = uResolution.x / uResolution.y;\\n  vec2 skew = mix(vec2(1.0), vec2(1.0, 0.0), uSkew);\\n  vec2 st = (uv - uPos) * vec2(aspectRatio, 1.0) * uCellScale * uAmount;\\n  st = st * rot(uAngle * 2.0 * 3.14159265359) * skew;\\n  vec2 i_st = floor(st);\\n  vec2 f_st = fract(st);\\n\\n  float m_dist = 15.0;\\n  float m_dist2 = 15.0;\\n  vec2 m_point = vec2(0.0);\\n  vec2 diffBest = vec2(0.0);\\n  for(int j=-1;j<=1;j++){\\n    for(int i=-1;i<=1;i++){\\n      vec2 neighbor = vec2(float(i), float(j));\\n      vec2 point = random2(i_st + neighbor);\\n      point = 0.5 + 0.5 * sin(5.0 + uTime * 0.2 + 6.2831 * point);\\n      vec2 diff = neighbor + point - f_st;\\n      float dist = length(diff);\\n      if(dist < m_dist){\\n        m_dist2 = m_dist;\\n        m_dist = dist;\\n        m_point = point;\\n        diffBest = diff;\\n      } else if (dist < m_dist2) {\\n        m_dist2 = dist;\\n      }\\n    }\\n  }\\n\\n  vec2 offset = (m_point * 0.2 * uSpread * 2.0) - (uSpread * 0.2);\\n  // soften offsets near cell edges to get rounder pieces\\n  // Use F2-F1 (second nearest minus nearest) to detect corners and soften further\\n  float cornerSoft = smoothstep(0.0, max(0.0001, uRoundness) * 2.0, m_dist2 - m_dist);\\n  float edgeSoft = smoothstep(0.0, max(0.0001, uRoundness), m_dist) * cornerSoft;\\n  offset *= edgeSoft;\\n\\n  vec2 mPos = uPos + mix(vec2(0.0), (uMousePos - 0.5), uTrackMouse);\\n  vec2 pos = mix(uPos, mPos, floor(uMixRadius));\\n\\n  float rawDist = max(0.0, 1.0 - distance(uv * vec2(aspectRatio,1.0), mPos * vec2(aspectRatio,1.0)) * 4.0 * (1.0 - uMixRadius));\\n  if(uMixRadiusInvert == 1){ rawDist = 1.0 - rawDist; }\\n  float dist = ease(uEasing, rawDist);\\n\\n  vec4 color = texture2D(tInput, uv + offset * dist);\\n  gl_FragColor = color;\\n}\\n","precision mediump float;\\nprecision mediump int;\\nvarying vec2 vUv;\\nuniform sampler2D tInput;\\nuniform sampler2D tBlueNoise;\\nuniform float uAmount;\\nuniform float uTilt;\\nuniform float uTime;\\nuniform vec2 uPos;\\nuniform vec2 uResolution;\\nuniform vec2 uBlueNoiseResolution;\\nuniform vec2 uMousePos;\\nuniform float uTrackMouse;\\n\\n#define PI 3.14159265\\n#define PI2 6.28318530718\\n// 优化：降低采样迭代次数 (原 50.0 -> 24.0) 以大幅提升性能\\n#define ITERATIONS 32.0\\n#define GOLDEN_ANGLE 2.39996323\\n\\nvec2 Sample(in float theta, inout float r) {\\n  r += 1.0 / r;\\n  return (r - 1.0) * vec2(cos(theta), sin(theta));\\n}\\n\\nfloat getBlueNoiseOffset(vec2 st) {\\n  vec2 texSize = uBlueNoiseResolution;\\n  vec2 uv = fract(st * (uResolution/texSize) * vec2(texSize.x/texSize.y, 1.0));\\n  vec4 blueNoise = texture2D(tBlueNoise, uv);\\n  return mod((blueNoise.r - 0.5) * PI2, PI2);\\n}\\n\\nvec4 Bokeh(sampler2D tex, vec2 uv, float blurRadius) {\\n  vec3 accumulatedColor = vec3(0.0);\\n  vec3 accumulatedWeights = vec3(0.0);\\n  float accumulatedAlpha = 0.0;\\n  float aspectRatio = uResolution.x / uResolution.y;\\n  vec2 basePixelSize = vec2(1.0 / aspectRatio, 1.0) * 0.04 * 0.075;\\n  float r = 1.0;\\n  float noiseOffset = (getBlueNoiseOffset(uv) - 0.5) * 0.01;\\n  float noiseAngle = noiseOffset * PI2;\\n  mat2 rotationMatrix = mat2(\\n    cos(noiseAngle), -sin(noiseAngle),\\n    sin(noiseAngle),  cos(noiseAngle)\\n  );\\n  for (float j = 0.0; j < GOLDEN_ANGLE * ITERATIONS; j += GOLDEN_ANGLE) {\\n    vec2 offset = Sample(j, r) * basePixelSize * blurRadius;\\n    float jitterAmount = 0.05 * (sin(j * 0.1) * 0.5 + 0.5);\\n    offset *= 1.0 + jitterAmount * sin(j * 0.7 + noiseOffset);\\n    vec2 sampleOffset = rotationMatrix * offset;\\n    vec4 colorSample = texture2D(tex, uv + sampleOffset);\\n    // Render targets are in Three.js working space (linear) by default.\\n    vec3 linearSample = colorSample.rgb;\\n    vec3 bokehWeight = vec3(5.0) + pow(linearSample, vec3(9.0)) * 150.0;\\n    accumulatedAlpha += colorSample.a;\\n    accumulatedColor += linearSample * bokehWeight;\\n    accumulatedWeights += bokehWeight;\\n  }\\n  vec3 linearOut = accumulatedColor / accumulatedWeights;\\n  return vec4(linearOut, accumulatedAlpha / ITERATIONS);\\n}\\n\\nvoid main() {\\n  vec2 uv = vUv;\\n  if(uAmount == 0.0) { gl_FragColor = vec4(0.0); return; }\\n  vec2 pos = uPos + mix(vec2(0.0), (uMousePos - 0.5), uTrackMouse);\\n  float dis = distance(uv, pos) * 1000.0;\\n  float tilt = mix(1.0 - dis * 0.001, dis * 0.001, uTilt);\\n  float blurRadius = uAmount * tilt;\\n  gl_FragColor = Bokeh(tInput, uv, blurRadius);\\n}\\n","precision mediump float;\\nprecision mediump int;\\nvarying vec2 vUv;\\nuniform sampler2D tInput;\\nuniform vec3 uBgColor;\\nuniform vec3 uOutputColor;\\nuniform int uLoaded;\\n// 可调输出混合权重（0.0~1.0），用于替代固定 0.6\\nuniform float uOutputMix;\\n// 方案A：更接近 before.js 的合成逻辑 (base * mix(1, blend, 0.26))\\n\\nvec3 overlay(vec3 base, vec3 blend){\\n  return mix(2.0 * base * blend, 1.0 - 2.0 * (1.0 - base) * (1.0 - blend), step(0.5, base));\\n}\\n\\nvoid main(){\\n  if(uLoaded!=1){\\n    gl_FragColor = vec4(197./255.,136./255.,122./255.,1.);\\n    return;\\n  }\\n\\n  // uBgColor/uOutputColor are provided in Three.js working space (linear).\\n  vec3 bgTex = vec3(1.0); // 无背景贴图时近似常量\\n  vec3 base = mix(uBgColor, overlay(uBgColor, bgTex), 0.61);\\n\\n  vec4 inTex = texture2D(tInput, vUv);\\n  // 作为 tint 加色，不依赖 alpha，保证 OUTPUT_COLOR 可见\\n  vec3 tint = uOutputColor * 0.35;\\n  vec3 blend = clamp(inTex.rgb + tint, 0.0, 1.0);\\n  vec3 finalColor = base * mix(vec3(1.0), blend, clamp(uOutputMix, 0.0, 1.0));\\n  \\n  gl_FragColor = vec4(finalColor, 1.0);\\n  \\n  #include <colorspace_fragment>\\n}","precision mediump float;\\nprecision mediump int;\\n\\nvarying vec2 vUv;\\n\\nvoid main() {\\n  vUv = uv;\\n  // Render in clip-space to fill the screen, ignoring camera transforms\\n  gl_Position = vec4(position, 1.0);\\n}\\n"]'),D=a=>new A(a),ve=a=>Object.fromEntries(Object.entries(a).map(([e,t])=>[e,{value:t}]));class de{constructor(){this.resolution=new m(1,1),this.position=new m(.5,.5),this.time={value:0},this.noise=new ne(Uint8Array.from({length:16384*4},(t,n)=>n%4===3?255:Math.floor(Math.random()*256)),128,128),this.noise.wrapS=this.noise.wrapT=ie,this.noise.needsUpdate=!0;const e=[{uRadius:.354,uFalloff:1,uMix:1,uDisplace:0,uSkew:.54,uAngle:0,uEdgeIntensity:-.82,uVignetteColor:D("#00000d"),uClearColor:D("#2c4bd5")},{uRadius:.25,uAngle:.1,uPhase:0,uMix:.5},{uMixRadius:1,uFrequency:.35,uAmplitude:1.18,uRotation:0},{uAmount:1,uSpread:.9,uAngle:-.125,uSkew:.9,uCellScale:16,uMixRadius:1,uMixRadiusInvert:0,uEasing:1,uTrackMouse:0,uPos:new m(.5,.5),uRoundness:.02},{tBlueNoise:this.noise,uBlueNoiseResolution:new m(128,128),uAmount:3.125*.754,uTilt:.5,uPos:new m(.5,.5),uTrackMouse:0},{uBgColor:D("#2c4bd5"),uOutputColor:D("#00344C"),uLoaded:1,uOutputMix:.95}];this.materials=e.map((t,n)=>new w({vertexShader:X[7],fragmentShader:X[n+1],uniforms:{...ve({tInput:null,uResolution:this.resolution,uPos:this.position,uMousePos:this.position,uTrackMouse:1,...t}),uTime:this.time},depthTest:!1,depthWrite:!1,toneMapped:!1,blending:re})),this.scene=new $,this.camera=new J,this.quad=new O(new G(2,2)),this.quad.frustumCulled=!1,this.scene.add(this.quad),this.targets=[0,1].map(()=>new b(1,1,{depthBuffer:!1})),this.output=this.materials[5],this.light=null}resize(e,t){this.resolution.set(Math.max(1,Math.floor(e*.3)),Math.max(1,Math.floor(t*.3))),this.targets.forEach(n=>n.setSize(this.resolution.x,this.resolution.y))}render(e,t,n,s,o){if(this.time.value=o?0:t,this.position.lerp(n,.1),s!==this.light){this.light=s;const i=this.materials[0].uniforms;i.uClearColor.value.set(s?"#ffead6":"#2c4bd5"),i.uVignetteColor.value.set(s?"#6196ff":"#00000d"),i.uEdgeIntensity.value=s?-.16:-.82,this.output.uniforms.uBgColor.value.copy(i.uClearColor.value),this.output.uniforms.uOutputColor.value.set(s?"#acffb9":"#00344C"),this.output.uniforms.uOutputMix.value=s?.65:.95}let r=this.targets[0],l=this.targets[1];const u=e.getRenderTarget();for(const i of this.materials.slice(0,5))i.uniforms.tInput.value=r.texture,this.quad.material=i,e.setRenderTarget(l),e.render(this.scene,this.camera),[r,l]=[l,r];this.output.uniforms.tInput.value=r.texture,e.setRenderTarget(u)}dispose(){this.materials.forEach(e=>e.dispose()),this.targets.forEach(e=>e.dispose()),this.noise.dispose(),this.quad.geometry.dispose()}}const he=`varying vec3 worldNormal;
varying vec3 eyeVector;
varying float modelLocalY;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vec4 mvPosition = viewMatrix * worldPos;

  gl_Position = projectionMatrix * mvPosition;

  // vec3 transformedNormal = modelMatrix * normal;
  worldNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
  eyeVector = normalize(worldPos.xyz - cameraPosition);
  modelLocalY = position.y;
}`,pe=`uniform float uIorR;
uniform float uIorY;
uniform float uIorG;
uniform float uIorC;
uniform float uIorB;
uniform float uIorP;

uniform float uSaturation;
uniform float uChromaticAberration;
uniform float uRefractPower;
uniform float uFresnelPower;
uniform float uShininess;
uniform float uDiffuseness;
uniform vec3 uLight;
// New tone controls
uniform float uBrightness;      // scales base refracted color
uniform float uContrast;        // adjusts contrast around 0.5
uniform float uGamma;           // gamma correction (1.0 = neutral)
uniform float uSpecularStrength;// scales specular contribution
uniform float uFresnelStrength; // scales fresnel contribution
uniform vec3 uFresnelSideDir;   // fresnel side direction (world space)

// Tint controls for colored glass effect
uniform vec4 uTintColorA;      // gradient color A (rgb) + alpha
uniform vec4 uTintColorB;      // gradient color B (rgb) + alpha
uniform vec2 uTintLocalYRange; // model local y min/max for vertical gradient normalization
uniform float uTintEnabled;   // 0.0 = off, 1.0 = on
uniform float uTintMix;       // blend amount [0,1]
uniform float uTintThicknessMinAlpha; // min alpha at grazing angles [0,1]
uniform float uTintThicknessMaxAlpha; // max alpha at facing angles [0,1]

uniform vec2 uScreenResolutionPx;
uniform sampler2D uTexture;
// 1.0：多采样折射；0.0：单次采样（FBO skip 时省算力，遮罩全屏时几乎不可见）
uniform float uSceneRefractionEnabled;
// 1.0：每 loop 三次 texture2D（RGB）；0.0：六通道光谱路径
uniform float uRgbRefraction;

// 0.0 = Beer-Lambert transmission, 1.0 = Hard Light duotone mix
uniform float uDark;

varying vec3 worldNormal;
varying vec3 eyeVector;
varying float modelLocalY;

float random(vec2 p){
  return fract(sin(dot(p.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec3 sat(vec3 rgb, float adjustment) {
  const vec3 W = vec3(0.2125, 0.7154, 0.0721);
  vec3 intensity = vec3(dot(rgb, W));
  return mix(intensity, rgb, adjustment);
}

float fresnel(vec3 eyeDir, vec3 normal, float power) {
  float fresnelFactor = abs(dot(eyeDir, normal));
  float inversefresnelFactor = 1.0 - fresnelFactor;
  return pow(inversefresnelFactor, power);
}

float specular(vec3 light, vec3 normal, vec3 eyeDir, float shininess, float diffuseness) {
  vec3 lightVector = normalize(-light);
  vec3 halfVector = normalize(eyeDir + lightVector);

  float NdotL = dot(normal, lightVector);
  float NdotH = abs(dot(normal, halfVector));
  float kDiffuse = max(0.0, NdotL);

  float kSpecular = pow(NdotH, shininess);
  // 可选：使用 smoothstep 进一步柔化高光边缘
  // kSpecular = smoothstep(0.0, 1.0, kSpecular);
  return kSpecular + kDiffuse * diffuseness;
}

uniform int uLoop;

void main() {
  vec2 uv = gl_FragCoord.xy / uScreenResolutionPx.xy;
  // 确保法线归一化，这对平滑高光至关重要
  vec3 normal = normalize(worldNormal);
  vec3 eyeDir = normalize(eyeVector);
  vec3 color;

  if (uSceneRefractionEnabled > 0.5) {
    color = vec3(0.0);

    float noiseIntensity = 0.025;
    float noise = random(uv) * noiseIntensity;

    if (uRgbRefraction > 0.5) {
      vec3 refractVecR = refract(eyeDir, normal, (1.0 / uIorR));
      vec3 refractVecG = refract(eyeDir, normal, (1.0 / uIorG));
      vec3 refractVecB = refract(eyeDir, normal, (1.0 / uIorB));

      for (int i = 0; i < uLoop; i++) {
        float slide = float(i) / float(uLoop) * 0.1 + noise;
        float offset = (uRefractPower + slide) * uChromaticAberration;

        color.r += texture2D(uTexture, uv + refractVecR.xy * offset).r;
        color.g += texture2D(uTexture, uv + refractVecG.xy * offset).g;
        color.b += texture2D(uTexture, uv + refractVecB.xy * offset).b;
      }
    } else {
      vec3 refractVecR = refract(eyeDir, normal, (1.0 / uIorR));
      vec3 refractVecY = refract(eyeDir, normal, (1.0 / uIorY));
      vec3 refractVecG = refract(eyeDir, normal, (1.0 / uIorG));
      vec3 refractVecC = refract(eyeDir, normal, (1.0 / uIorC));
      vec3 refractVecB = refract(eyeDir, normal, (1.0 / uIorB));
      vec3 refractVecP = refract(eyeDir, normal, (1.0 / uIorP));

      for (int i = 0; i < uLoop; i++) {
        float slide = float(i) / float(uLoop) * 0.1 + noise;

        float offsetR = (uRefractPower + slide * 1.0) * uChromaticAberration;
        float offsetY = (uRefractPower + slide * 1.0) * uChromaticAberration;
        float offsetG = (uRefractPower + slide * 2.0) * uChromaticAberration;
        float offsetC = (uRefractPower + slide * 2.5) * uChromaticAberration;
        float offsetB = (uRefractPower + slide * 3.0) * uChromaticAberration;
        float offsetP = (uRefractPower + slide * 1.0) * uChromaticAberration;

        float r = texture2D(uTexture, uv + refractVecR.xy * offsetR).x * 0.5;

        vec3 ySample = texture2D(uTexture, uv + refractVecY.xy * offsetY).xyz;
        float y = (ySample.x * 2.0 + ySample.y * 2.0 - ySample.z) / 6.0;

        float g = texture2D(uTexture, uv + refractVecG.xy * offsetG).y * 0.5;

        vec3 cSample = texture2D(uTexture, uv + refractVecC.xy * offsetC).xyz;
        float c = (cSample.y * 2.0 + cSample.z * 2.0 - cSample.x) / 6.0;

        float b = texture2D(uTexture, uv + refractVecB.xy * offsetB).z * 0.5;

        vec3 pSample = texture2D(uTexture, uv + refractVecP.xy * offsetP).xyz;
        float p = (pSample.z * 2.0 + pSample.x * 2.0 - pSample.y) / 6.0;

        float R = r + (2.0 * p + 2.0 * y - c) / 3.0;
        float G = g + (2.0 * y + 2.0 * c - p) / 3.0;
        float B = b + (2.0 * c + 2.0 * p - y) / 3.0;

        color.r += R;
        color.g += G;
        color.b += B;
      }
    }

    color /= float(uLoop);
  } else {
    color = texture2D(uTexture, uv).rgb;
  }

  color = sat(color, uSaturation);

  // Tone adjustments to counter light/dark inversion
  color *= uBrightness;
  color = (color - 0.5) * uContrast + 0.5;
  // prevent division by zero; apply gamma correction
  float invGamma = 1.0 / max(uGamma, 0.0001);
  color = pow(max(color, 0.0), vec3(invGamma));

  // 有色玻璃透射/混合：保持原计算逻辑不变
  // uDark = 0 -> Beer-Lambert
  // uDark = 1 -> Hard Light
  float mode = clamp(uDark, 0.0, 1.0);

  // --- Beer-Lambert (原逻辑) ---
  float localYMin = uTintLocalYRange.x;
  float localYMax = uTintLocalYRange.y;
  float localYDenominator = max(localYMax - localYMin, 1e-5);
  float tintGradientFactor = clamp((modelLocalY - localYMin) / localYDenominator, 0.0, 1.0);
  vec4 tintColorGradient = mix(uTintColorB, uTintColorA, tintGradientFactor);

  float ndotv = abs(dot(normal, eyeDir));
  float thicknessMask = clamp(1.0 - ndotv, 0.0, 1.0);
  float tintAlpha = clamp(tintColorGradient.a, 0.0, 1.0);
  float minAlpha = clamp(uTintThicknessMinAlpha, 0.0, 1.0);
  float maxAlpha = clamp(uTintThicknessMaxAlpha, 0.0, 1.0);
  tintAlpha *= mix(maxAlpha, minAlpha, thicknessMask);

  float tintK_beer = clamp(uTintEnabled, 0.0, 1.0) * tintAlpha;
  vec3 tintColorClamped = clamp(tintColorGradient.rgb, 0.001, 1.0);
  float thickness = clamp(uTintMix, 0.01, 3.0);
  vec3 transmittance = pow(tintColorClamped, vec3(thickness));
  vec3 beerColor = mix(color, color * transmittance, tintK_beer);

  // --- Hard Light (原逻辑) ---
  float tintK_hard = clamp(uTintEnabled, 0.0, 1.0) * clamp(uTintMix, 0.0, 1.0) * tintAlpha;
  vec3 baseClamped = clamp(color, 0.0, 1.0);
  vec3 blendClamped = clamp(tintColorGradient.rgb, 0.0, 1.0);
  vec3 h = step(vec3(0.5), blendClamped);
  vec3 hard = mix(2.0 * baseClamped * blendClamped,
                  1.0 - 2.0 * (1.0 - blendClamped) * (1.0 - baseClamped),
                  h);
  vec3 hardColor = mix(color, hard, tintK_hard);

  color = mix(beerColor, hardColor, mode);

  // Specular
  float specularLight = specular(uLight, normal, eyeDir, uShininess, uDiffuseness);
  color += specularLight * uSpecularStrength;

  // Fresnel
  float f = fresnel(eyeDir, normal, uFresnelPower);
  float sideDot = dot(normal, normalize(uFresnelSideDir));
  float sideMask = smoothstep(-0.5, 0.5, sideDot);
  color.rgb += f * sideMask * vec3(uFresnelStrength);

  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;function ge(a,e){const t={uTexture:null,uIorR:1.15,uIorY:1.16,uIorG:1.18,uIorC:1.22,uIorB:1.22,uIorP:1.22,uRefractPower:.72,uChromaticAberration:.14,uSaturation:1.2,uGamma:1,uSpecularStrength:1.2,uFresnelSideDir:new I(-1,1,-1),uTintMix:1,uTintEnabled:1,uTintThicknessMinAlpha:1,uLoop:3,uRgbRefraction:1,uSceneRefractionEnabled:1,uLight:new I(4,9,.5),uScreenResolutionPx:new m,uTintLocalYRange:new m(a.boundingBox.min.y,a.boundingBox.max.y),uTintColorA:new Y,uTintColorB:new Y,uDark:1,uShininess:100,uDiffuseness:.05,uFresnelPower:3,uFresnelStrength:.72,uBrightness:.6,uContrast:.98,uTintThicknessMaxAlpha:.4},n=new w({vertexShader:he,fragmentShader:pe,uniforms:Object.fromEntries(Object.entries(t).map(([s,o])=>[s,{value:o}]))});return n.userData.kind=e,n}function xe(a,e){const t=a.uniforms;t.uDark.value=e?0:1,t.uShininess.value=e?120:100,t.uDiffuseness.value=e?.1:.05,t.uFresnelPower.value=e?1:3,t.uFresnelStrength.value=e?.24:.72,t.uBrightness.value=e?.78:.6,t.uContrast.value=e?.9:.98,t.uTintThicknessMaxAlpha.value=e?.92:.4;let n=e?"#009dff":"#64c3ff",s=e?"#ffffff":"#8e9dc4";a.userData.kind==="cursor"&&(s=n),a.userData.kind==="footer"&&([n,s]=[s,n]);for(const[o,r]of[["uTintColorA",n],["uTintColorB",s]]){const l=new A(r);t[o].value.set(l.r,l.g,l.b,1)}}class Z{constructor(){this.scene=new $,this.camera=new J,this.quad=new O(new G(2,2)),this.quad.frustumCulled=!1,this.scene.add(this.quad),this.renderToScreen=!1}set fullscreenMaterial(e){this.quad.material=e}get fullscreenMaterial(){return this.quad.material}}let ye="#c0fe04";class Me{cssResolution=new m(1,1);devicePixelRatio=1;trail=Array.from({length:16},()=>new m(.5,.5));trailStrength=Array.from({length:16},()=>0);lastPointerCell=new m(-1,-1);pixelSize=16;uniforms={uTrail:{value:this.trail},uTrailStrength:{value:this.trailStrength},uTrailCount:{value:14},uPointerColor:{value:new A(ye)},uPointerOpacity:{value:1},uPointerDotRadius:{value:.8},uPointerPixelSize:{value:this.pixelSize},uResolution:{value:new m(1,1)},uDevicePixelRatio:{value:this.devicePixelRatio}};setColor(e){this.uniforms.uPointerColor.value.set(e)}setPixelSize(e){this.pixelSize=e,this.uniforms.uPointerPixelSize.value=e}setDisplayMetrics(e,t,n){this.cssResolution.set(Math.max(1,e),Math.max(1,t)),this.devicePixelRatio=Math.max(1,n),this.uniforms.uDevicePixelRatio.value=this.devicePixelRatio}setResolution(e,t){this.uniforms.uResolution.value.set(Math.max(1,e),Math.max(1,t))}updatePointer(e,t,n){let s=Math.max(this.pixelSize/Math.max(this.cssResolution.x,1),1e-6),o=Math.max(this.pixelSize/Math.max(this.cssResolution.y,1),1e-6);for(let r=+!!t;r<14;r+=1)this.trailStrength[r]=z.damp(this.trailStrength[r],0,2,n);if(t){let r=Math.floor(e.x/s),l=Math.floor(e.y/o);if(r!==this.lastPointerCell.x||l!==this.lastPointerCell.y){for(let u=13;u>0;u-=1)this.trail[u].copy(this.trail[u-1]),this.trailStrength[u]=this.trailStrength[u-1];this.lastPointerCell.set(r,l)}this.trail[0].set(e.x,e.y),this.trailStrength[0]=1;return}this.lastPointerCell.set(-1,-1)}}function T(a,e){return new b(a,e,{depthBuffer:!1,stencilBuffer:!1,minFilter:k,magFilter:k,format:Q,type:le})}function R(a,e){return new w({uniforms:e,vertexShader:`varying vec2 vUv;

void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 1.0, 1.0);
}`,fragmentShader:a,depthTest:!1,depthWrite:!1,transparent:!1,toneMapped:!1})}class Se extends Z{simResolution;simWidth=1;simHeight=1;viewportWidth=1;viewportHeight=1;pressureIterations;effectEnabled=!0;pointerOverlayEnabled=!0;resolution=new m(1,1);pointerOverlay=new Me;pointer=new m(-1,-1);pointerDelta=new m(0,0);velocityRead=T(1,1);velocityWrite=T(1,1);curlTarget=T(1,1);vortTarget=T(1,1);divergenceTarget=T(1,1);pressureA=T(1,1);pressureB=T(1,1);projectedVelocityTarget=T(1,1);curlMaterial;vorticityMaterial;divergenceMaterial;clearMaterial;pressureMaterial;gradientMaterial;advectMaterial;displayMaterial;constructor({strength:e=.3,radius:t=1.5,velocityScale:n=1,chromaticStrength:s=.002,pressureIterations:o=4,curlStrength:r=0,velocityDissipation:l=3,simResolution:u=160}){super("FluidPushPass"),this.simResolution=u,this.pressureIterations=o;const i=new m(1,1),c=new m(1,1);this.curlMaterial=R(`uniform sampler2D uVelocity;
uniform vec2 uTexelSize;
varying vec2 vUv;

void main() {
  float left = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).y;
  float right = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).y;
  float top = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).x;
  float bottom = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).x;
  float value = 0.5 * (right - left - top + bottom);
  gl_FragColor = vec4(value, 0.0, 0.0, 1.0);
}`,{uVelocity:{value:null},uTexelSize:{value:i.clone()}}),this.vorticityMaterial=R(`uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform vec2 uTexelSize;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform vec2 uPointerDelta;
uniform float uCurlStrength;
uniform float uSplatRadius;
uniform float uSplatForce;
varying vec2 vUv;

void main() {
  float left = abs(texture2D(uCurl, vUv - vec2(uTexelSize.x, 0.0)).x);
  float right = abs(texture2D(uCurl, vUv + vec2(uTexelSize.x, 0.0)).x);
  float top = abs(texture2D(uCurl, vUv + vec2(0.0, uTexelSize.y)).x);
  float bottom = abs(texture2D(uCurl, vUv - vec2(0.0, uTexelSize.y)).x);
  float center = texture2D(uCurl, vUv).x;

  vec2 force = vec2(top - bottom, right - left);
  float forceLength = length(force);
  if (forceLength > 0.0001) {
    force /= forceLength;
  } else {
    force = vec2(0.0);
  }

  force *= uCurlStrength * center;
  force.y *= -1.0;

  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity += force * 0.016;
  velocity = clamp(velocity, vec2(-1000.0), vec2(1000.0));

  vec2 mouseUv = uPointer / max(uResolution, vec2(0.0001));
  vec2 diff = vUv - mouseUv;
  diff.x *= uResolution.x / max(uResolution.y, 0.0001);
  float pointerMask = exp(-dot(diff, diff) / max(uSplatRadius, 0.0001));
  velocity += (uPointerDelta / max(uResolution, vec2(0.0001))) * pointerMask * uSplatForce;

  gl_FragColor = vec4(velocity, 0.0, 1.0);
}`,{uVelocity:{value:null},uCurl:{value:null},uTexelSize:{value:i.clone()},uResolution:{value:c.clone()},uPointer:{value:this.pointer},uPointerDelta:{value:this.pointerDelta},uCurlStrength:{value:r},uSplatRadius:{value:Math.max(.002*t,5e-4)},uSplatForce:{value:Math.max(3e3*n,0)}}),this.divergenceMaterial=R(`uniform sampler2D uVelocity;
uniform vec2 uTexelSize;
varying vec2 vUv;

void main() {
  float left = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).x;
  float right = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).x;
  float top = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).y;
  float bottom = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).y;
  float divergence = 0.5 * (right - left + top - bottom);
  gl_FragColor = vec4(divergence, 0.0, 0.0, 1.0);
}`,{uVelocity:{value:null},uTexelSize:{value:i.clone()}}),this.clearMaterial=R(`void main() {
  gl_FragColor = vec4(0.0);
}`,{}),this.pressureMaterial=R(`uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexelSize;
varying vec2 vUv;

void main() {
  float left = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
  float right = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
  float top = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
  float bottom = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
  float divergence = texture2D(uDivergence, vUv).x;
  float pressure = (left + right + top + bottom - divergence) * 0.25;
  gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
}`,{uPressure:{value:null},uDivergence:{value:null},uTexelSize:{value:i.clone()}}),this.gradientMaterial=R(`uniform sampler2D uVelocity;
uniform sampler2D uPressure;
uniform vec2 uTexelSize;
varying vec2 vUv;

void main() {
  float left = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
  float right = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
  float top = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
  float bottom = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity -= vec2(right - left, top - bottom);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}`,{uVelocity:{value:null},uPressure:{value:null},uTexelSize:{value:i.clone()}}),this.advectMaterial=R(`uniform sampler2D uVelocity;
uniform sampler2D uProjectedVelocity;
uniform vec2 uTexelSize;
uniform float uDissipation;
varying vec2 vUv;

void main() {
  vec2 velocity = texture2D(uProjectedVelocity, vUv).xy;
  vec2 coord = clamp(vUv - velocity * uTexelSize * 0.016, 0.0, 1.0);
  vec2 advected = texture2D(uProjectedVelocity, coord).xy;
  advected /= 1.0 + uDissipation * 0.016;
  gl_FragColor = vec4(advected, 0.0, 1.0);
}`,{uVelocity:{value:null},uProjectedVelocity:{value:null},uTexelSize:{value:i.clone()},uDissipation:{value:l}}),this.displayMaterial=R(`uniform sampler2D tDiffuse;
uniform sampler2D uVelocity;
uniform vec2 uSimSize;
uniform float uDisplacementStrength;
uniform float uChromaticBoost;
uniform float uEffectEnabled;

vec3 spectrum(float x) {
  return cos((x - vec3(0.0, 0.5, 1.0)) * vec3(0.6, 1.0, 0.5) * 3.14);
}

vec4 getFluidDisplayColor(vec2 uv) {
  vec2 velocity = texture2D(uVelocity, uv).xy;
  float effectEnabled = step(0.5, uEffectEnabled);
  vec2 displacement = velocity / max(uSimSize, vec2(1.0)) * uDisplacementStrength * effectEnabled;
  float velocityMagnitude = length(displacement);

  const int samples = 4; // 采样次数
  vec4 color = vec4(0.0);
  vec3 weightSum = vec3(0.0);

  for (int index = 0; index < samples; index++) {
    float t = float(index) / float(samples - 1);
    vec3 weight = max(vec3(0.0), cos((t - vec3(0.0, 0.5, 1.0)) * 3.14159 * 0.5));
    vec4 sampleColor = texture2D(tDiffuse, clamp(uv - displacement * 0.3 * (t + 0.3) * velocityMagnitude, 0.0, 1.0));
    color.rgb += sampleColor.rgb * weight;
    color.a += sampleColor.a * (weight.r + weight.g + weight.b) / 3.0;
    weightSum += weight;
  }

  color.rgb /= max(weightSum, vec3(0.0001));
  color.a /= max((weightSum.r + weightSum.g + weightSum.b) / 3.0, 0.0001);

  vec3 spectralHighlight = spectrum(sin(velocityMagnitude * 2.0) * 0.4 + 0.6);
  color.rgb += spectralHighlight * smoothstep(0.2, 0.8, velocityMagnitude) * 0.5 * uChromaticBoost * effectEnabled;

  return color;
}

uniform vec2 uTrail[16];
uniform float uTrailStrength[16];
uniform float uTrailCount;
uniform vec3 uPointerColor;
uniform float uPointerOpacity;
uniform float uPointerDotRadius;
uniform float uPointerPixelSize;
uniform vec2 uResolution;
uniform float uDevicePixelRatio;

float cellEquals(vec2 a, vec2 b) {
  vec2 d = abs(a - b);
  return 1.0 - step(0.5, max(d.x, d.y));
}

vec4 applyPointerOverlay(vec2 uv, vec4 baseColor) {
  float cssPixelSize = uPointerPixelSize * max(uDevicePixelRatio, 1.0);
  vec2 normalizedPixelSize = vec2(
    cssPixelSize / max(uResolution.x, 1.0),
    cssPixelSize / max(uResolution.y, 1.0)
  );

  vec2 safePixelSize = max(normalizedPixelSize, vec2(1e-6));
  vec2 cellId = floor(uv / safePixelSize);
  vec2 cellUV = fract(uv / safePixelSize);

  float highlight = 0.0;
  for (int i = 0; i < 16; i++) {
    float enabled = step(float(i), uTrailCount - 1.0);
    vec2 pointerCell = floor(uTrail[i] / safePixelSize);
    float isSame = cellEquals(cellId, pointerCell);
    float weight = clamp(uTrailStrength[i], 0.0, 1.0);
    highlight = max(highlight, enabled * isSame * weight);
  }

  float distToCenter = distance(cellUV, vec2(0.5));
  float aa = fwidth(distToCenter) * 1.5;
  float radius = clamp(uPointerDotRadius, 0.0, 1.0);
  float circleMask = smoothstep(radius, radius - aa, distToCenter);
  float overlayAlpha = circleMask * highlight * clamp(uPointerOpacity, 0.0, 1.0);
  baseColor.rgb = mix(baseColor.rgb, uPointerColor, overlayAlpha);

  return baseColor;
}

varying vec2 vUv;

void main() {
  vec4 color = getFluidDisplayColor(vUv);
  gl_FragColor = applyPointerOverlay(vUv, color);
  #include <colorspace_fragment>
}`,{tDiffuse:{value:null},uVelocity:{value:null},uSimSize:{value:new m(u,u)},uDisplacementStrength:{value:Math.max(e/.3,0)},uChromaticBoost:{value:Math.max(s/.004,0)},uEffectEnabled:{value:1},...this.pointerOverlay.uniforms}),this.fullscreenMaterial=this.displayMaterial}setEffectEnabled(e){this.effectEnabled=e,this.displayMaterial.uniforms.uEffectEnabled.value=+!!e}setPointerOverlayEnabled(e){this.pointerOverlayEnabled=e,this.displayMaterial.uniforms.uPointerOpacity.value=1*!!e}setPointerColor(e){this.pointerOverlay.setColor(e)}setPointerPixelSize(e){this.pointerOverlay.setPixelSize(e),this.pointerOverlayEnabled&&(this.displayMaterial.uniforms.uPointerOpacity.value=1)}setDisplayMetrics(e,t,n){this.pointerOverlay.setDisplayMetrics(e,t,n)}updatePointer(e,t,n){this.pointerOverlay.updatePointer(e,t,n)}setPointer(e){this.pointer.copy(e)}setPointerDelta(e){this.pointerDelta.copy(e)}setSize(e,t){this.viewportWidth=Math.max(1,e),this.viewportHeight=Math.max(1,t);let n=this.simResolution,s=this.viewportWidth/this.viewportHeight;s>1?(this.simWidth=Math.round(n*s),this.simHeight=n):(this.simWidth=n,this.simHeight=Math.round(n/Math.max(s,1e-4))),this.resizeRenderTarget(this.velocityRead),this.resizeRenderTarget(this.velocityWrite),this.resizeRenderTarget(this.curlTarget),this.resizeRenderTarget(this.vortTarget),this.resizeRenderTarget(this.divergenceTarget),this.resizeRenderTarget(this.pressureA),this.resizeRenderTarget(this.pressureB),this.resizeRenderTarget(this.projectedVelocityTarget);let o=1/this.simWidth,r=1/this.simHeight,l=new m(this.viewportWidth,this.viewportHeight),u=new m(this.simWidth,this.simHeight);for(let i of(this.resolution.copy(l),this.pointerOverlay.setResolution(this.viewportWidth,this.viewportHeight),[this.curlMaterial,this.vorticityMaterial,this.divergenceMaterial,this.pressureMaterial,this.gradientMaterial,this.advectMaterial]))i.uniforms.uTexelSize&&i.uniforms.uTexelSize.value.set(o,r);this.vorticityMaterial.uniforms.uResolution.value.copy(l),this.displayMaterial.uniforms.uSimSize.value.copy(u)}render(e,t,n){if(!t)return;let s=e.getRenderTarget();if(this.effectEnabled){this.curlMaterial.uniforms.uVelocity.value=this.velocityRead.texture,this.renderMaterial(e,this.curlMaterial,this.curlTarget),this.vorticityMaterial.uniforms.uVelocity.value=this.velocityRead.texture,this.vorticityMaterial.uniforms.uCurl.value=this.curlTarget.texture,this.renderMaterial(e,this.vorticityMaterial,this.vortTarget),this.divergenceMaterial.uniforms.uVelocity.value=this.vortTarget.texture,this.renderMaterial(e,this.divergenceMaterial,this.divergenceTarget),this.renderMaterial(e,this.clearMaterial,this.pressureA);let o=this.pressureA,r=this.pressureB;for(let l=0;l<this.pressureIterations;l+=1){this.pressureMaterial.uniforms.uPressure.value=o.texture,this.pressureMaterial.uniforms.uDivergence.value=this.divergenceTarget.texture,this.renderMaterial(e,this.pressureMaterial,r);let u=o;o=r,r=u}this.gradientMaterial.uniforms.uVelocity.value=this.vortTarget.texture,this.gradientMaterial.uniforms.uPressure.value=o.texture,this.renderMaterial(e,this.gradientMaterial,this.projectedVelocityTarget),this.advectMaterial.uniforms.uVelocity.value=this.velocityRead.texture,this.advectMaterial.uniforms.uProjectedVelocity.value=this.projectedVelocityTarget.texture,this.renderMaterial(e,this.advectMaterial,this.velocityWrite),this.swapVelocityTargets()}this.displayMaterial.uniforms.tDiffuse.value=t.texture,this.displayMaterial.uniforms.uVelocity.value=this.velocityRead.texture,this.fullscreenMaterial=this.displayMaterial,e.setRenderTarget(this.renderToScreen?null:n),e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(s)}dispose(){this.quad.geometry.dispose(),this.velocityRead.dispose(),this.velocityWrite.dispose(),this.curlTarget.dispose(),this.vortTarget.dispose(),this.divergenceTarget.dispose(),this.pressureA.dispose(),this.pressureB.dispose(),this.projectedVelocityTarget.dispose(),this.curlMaterial.dispose(),this.vorticityMaterial.dispose(),this.divergenceMaterial.dispose(),this.clearMaterial.dispose(),this.pressureMaterial.dispose(),this.gradientMaterial.dispose(),this.advectMaterial.dispose(),this.displayMaterial.dispose()}renderMaterial(e,t,n){this.fullscreenMaterial=t,e.setRenderTarget(n),e.clear(),e.render(this.scene,this.camera)}resizeRenderTarget(e){e.setSize(this.simWidth,this.simHeight)}swapVelocityTargets(){let e=this.velocityRead;this.velocityRead=this.velocityWrite,this.velocityWrite=e}}const K="varying vec2 vUv;void main(){vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,1.0,1.0);}";class Te extends Z{flareScale;flareStride;flareFrame=0;width=1;height=1;flareTarget;flareMaterial;compositeMaterial;constructor({flareDownsample:e=.5,flareStride:t=2,starRays:n,intensity:s,threshold:o,streakScale:r,hotspotPower:l,gate:u,tailColor:i,flareFragmentShader:c,compositeFragmentShader:p}){super("LensFlarePass"),this.flareScale=Math.min(1,Math.max(.2,e)),this.flareStride=Math.max(1,Math.floor(t)),this.flareTarget=new b(1,1,{minFilter:k,magFilter:k,format:Q,type:ae,depthBuffer:!1,stencilBuffer:!1,generateMipmaps:!1}),this.flareTarget.texture.colorSpace=oe,this.flareTarget.texture.generateMipmaps=!1,this.flareTarget.texture.name="LensFlarePass.Target",this.flareMaterial=new w({uniforms:{tDiffuse:{value:null},uResolution:{value:new m(1,1)},uEnabled:{value:1},uStarRays:{value:n},uIntensity:{value:s},uThreshold:{value:o},uStreakScale:{value:r},uHotspotPower:{value:l},uGate:{value:u},uTailColor:{value:new A(i)}},vertexShader:K,fragmentShader:(M=>M.replace(/#include\s+<colorspace_fragment>\s*/g,""))(c),depthTest:!1,depthWrite:!1,transparent:!1,toneMapped:!1}),this.compositeMaterial=new w({uniforms:{tBase:{value:null},tFlare:{value:null}},vertexShader:K,fragmentShader:p,depthTest:!1,depthWrite:!1,transparent:!1,toneMapped:!1}),this.fullscreenMaterial=this.compositeMaterial}setParams({starRays:e,intensity:t,threshold:n,streakScale:s,hotspotPower:o,gate:r,tailColor:l}){this.flareMaterial.uniforms.uStarRays.value=e,this.flareMaterial.uniforms.uIntensity.value=t,this.flareMaterial.uniforms.uThreshold.value=n,this.flareMaterial.uniforms.uStreakScale.value=s,this.flareMaterial.uniforms.uHotspotPower.value=o,this.flareMaterial.uniforms.uGate.value=r,this.flareMaterial.uniforms.uTailColor.value.set(l)}setFlareDownsample(e){this.flareScale=Math.min(1,Math.max(.2,e)),this.resizeFlareTarget()}setFlareStride(e){this.flareStride=Math.max(1,Math.floor(e))}resetFlareCadence(){this.flareFrame=0}setSize(e,t){this.width=Math.max(1,Math.floor(e)),this.height=Math.max(1,Math.floor(t)),this.flareMaterial.uniforms.uResolution.value.set(this.width,this.height),this.resizeFlareTarget()}resizeFlareTarget(){let e=Math.max(1,Math.floor(this.width*this.flareScale)),t=Math.max(1,Math.floor(this.height*this.flareScale));this.flareTarget.setSize(e,t),this.resetFlareCadence()}render(e,t,n){t&&(this.flareFrame%this.flareStride==0&&(this.flareMaterial.uniforms.tDiffuse.value=t.texture,this.fullscreenMaterial=this.flareMaterial,e.setRenderTarget(this.flareTarget),e.clear(),e.render(this.scene,this.camera)),this.flareFrame+=1,this.compositeMaterial.uniforms.tBase.value=t.texture,this.compositeMaterial.uniforms.tFlare.value=this.flareTarget.texture,this.fullscreenMaterial=this.compositeMaterial,e.setRenderTarget(this.renderToScreen?null:n),e.clear(),e.render(this.scene,this.camera))}dispose(){this.quad.geometry.dispose(),this.flareTarget.dispose(),this.flareMaterial.dispose(),this.compositeMaterial.dispose()}}const Re=`uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform float uEnabled;
uniform float uIntensity;
uniform float uThreshold;
uniform float uStreakScale;
uniform float uHotspotPower;
uniform float uGate;
uniform float uStarRays;

uniform vec3 uTailColor;

const float TAIL_MIX = 1.0;
const float TAIL_START = 0.0;
const float TAIL_FALLOFF = 0.5;

varying vec2 vUv;

float luma(vec3 c) {
  return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

float brightMask(float lum) {
  // 适配 LDR/sRGB：阈值一般在 0.8~0.95
  float x = max(lum - uThreshold, 0.0);
  float m = x / max(1.0 - uThreshold, 1e-5);
  // smoothstep(0,1,m) 的多项式形式（避免多余 clamp；smoothstep 本身会夹紧）
  m = clamp(m, 0.0, 1.0);
  m = m * m * (3.0 - 2.0 * m);

  float hp = max(uHotspotPower, 1.0);
  if (hp > 1.01) {
    m = pow(m, hp);
  }

  // 线性软门控：减少断裂感且便宜
  float gate = clamp(uGate, 0.0, 1.0);
  float gm = (m - gate) / max(1.0 - gate, 1e-5);
  gm = clamp(gm, 0.0, 1.0);
  return m * gm;
}

vec3 sampleBright(vec2 uv) {
  vec3 c = texture2D(tDiffuse, uv).rgb;
  return c * brightMask(luma(c));
}

vec3 streak(vec2 dirPx) {
  vec3 acc = vec3(0.0);
  // 固定 8 次采样：用“半步相位”打散离散采样间隙（更像连续直线），且不引入 sin/exp
  vec2 pixel = floor(vUv * uResolution);
  float h = fract(52.9829189 * fract(dot(pixel, vec2(0.06711056, 0.00583715))));
  float phase = step(0.5, h) * 0.5; // 0 或 0.5（半步）
  for (int i = 1; i <= 8; i++) {
    float fi = float(i);
    // 增加步长以维持拖尾长度 (原 1 -> 1.5)
    float dist = fi * 1.5 + phase;
    // 放缓衰减：视觉上更“长”，同时保持成本低
    float w = 1.0 / (1.0 + dist * 0.22);
    w *= w;

    // 末端颜色：中心偏白，越靠近末端越靠近 uTailColor
    float t = clamp(dist / 8.0, 0.0, 1.0);
    float start = clamp(TAIL_START, 0.0, 0.95);
    float tt = clamp((t - start) / max(1.0 - start, 1e-5), 0.0, 1.0);
    tt = pow(tt, max(TAIL_FALLOFF, 0.001));
    vec3 ramp = mix(vec3(1.0), uTailColor, clamp(TAIL_MIX, 0.0, 1.0) * tt);

    vec2 o = dirPx * dist;
    acc += sampleBright(vUv + o) * (w * ramp);
    acc += sampleBright(vUv - o) * (w * ramp);
  }
  return acc;
}

void main() {
  vec3 flare = vec3(0.0);
  if (uEnabled >= 0.5 && uIntensity > 0.0001) {
    vec3 base = texture2D(tDiffuse, vUv).rgb;
    vec2 px = (1.0 / max(uResolution, vec2(1.0))) * uStreakScale;

    // 中心热点（让亮点像“星芒”有核心）
    flare += base * brightMask(luma(base)) * 1.2;
    // 4/6/8 芒：每条 streak 是“一条线”（包含正反两个方向）
    // 4 芒：0° + 90°（十字）
    // 6 芒：0° + (+60°) + (-60°)（三条线）
    // 8 芒：0° + 90° + (+45°) + (-45°)
    if (uStarRays >= 7.5) {
      // 8 rays
      flare += streak(vec2(px.x, 0.0));
      flare += streak(vec2(0.0, px.y));
      const float c45 = 0.70710678;
      flare += streak(vec2(px.x * c45, px.y * c45));
      flare += streak(vec2(px.x * c45, -px.y * c45));
    } else if (uStarRays >= 5.5) {
      // 6 rays（整体旋转 30°，保证有一根竖线）：90° + (+30°) + (-30°)
      flare += streak(vec2(0.0, px.y));
      const float c30 = 0.8660254;
      const float s30 = 0.5;
      flare += streak(vec2(px.x * c30, px.y * s30));
      flare += streak(vec2(px.x * c30, -px.y * s30));
    } else {
      // 4 rays
      flare += streak(vec2(px.x, 0.0));
      flare += streak(vec2(0.0, px.y));
    }

    // 保持核心尽量中性（末端颜色由 streak 内的 ramp 控制）
  }

  flare *= (uIntensity * 0.75);
  gl_FragColor = vec4(flare, 1.0);
  #include <colorspace_fragment>
}`,be=`uniform sampler2D tBase;
uniform sampler2D tFlare;

varying vec2 vUv;

void main() {
  vec3 base = texture2D(tBase, vUv).rgb;
  vec3 flare = texture2D(tFlare, vUv).rgb;

  gl_FragColor = vec4(base + flare, 1.0);
  #include <colorspace_fragment>
}
`,we={flareFragmentShader:Re,compositeFragmentShader:be},x={uv:new m(.5,.5),inside:!1,clicks:0};function U({path:a,target:e,kind:t,light:n,reduced:s}){const o=ce(a,!1,!1),r=h.useRef(),{viewport:l,size:u,gl:i}=E(),c=h.useMemo(()=>{o.scene.updateMatrixWorld(!0);const M=[];o.scene.traverse(g=>{if(g.isMesh){let f=g.geometry.clone().applyMatrix4(g.matrixWorld);f.index&&(f=f.toNonIndexed());for(const d of Object.keys(f.attributes))["position","normal"].includes(d)||f.deleteAttribute(d);M.push(f)}});const v=fe(M);return M.forEach(g=>g.dispose()),v.center(),v.computeBoundingBox(),v},[o]),p=h.useMemo(()=>ge(c,t),[c,t]);return h.useEffect(()=>{xe(p,n)},[p,n]),h.useEffect(()=>(r.current.layers.set(10),()=>{c.dispose(),p.dispose()}),[c,p]),j(({clock:M},v)=>{const g=document.getElementById(e),f=r.current;if(!g||!f)return;const d=g.getBoundingClientRect();if(f.visible=d.bottom>0&&d.top<u.height,!f.visible)return;const S=u.width<1024,P=z.clamp(-d.top/u.height,-1,1.5),F=c.boundingBox.max.x-c.boundingBox.min.x,C=t==="cursor"?.085:t==="footer"?S?.84:.52:S?.9:.61;f.scale.setScalar(l.width*C/F);const ee=d.top+d.height*(t==="cursor"?.68:t==="footer"?.47:S?.51:.5);f.position.set(t==="cursor"?l.width*.37:0,l.height*(.5-ee/u.height),0),s?f.rotation.set(0,t==="hero"?.07:0,0):(f.position.y+=Math.sin(M.elapsedTime*1.2)*.035,f.rotation.y=z.damp(f.rotation.y,(t==="hero"?.07:0)+(t==="cursor"?P*12.56:P*1.57)+(x.uv.x-.5)*.06,6,v),f.rotation.x=z.damp(f.rotation.x,t==="footer"?Math.max(0,d.top/u.height)*-Math.PI:(x.uv.y-.5)*.02,6,v),f.rotation.z=0);const N=x.inside?Math.atan2(x.uv.y-.5,x.uv.x-.5):1.15,te=new I(Math.cos(N)*9.85,Math.sin(N)*9.85,.5);p.uniforms.uLight.value.lerp(te,1-Math.exp(-6*Math.min(v,.05))),p.uniforms.uScreenResolutionPx.value.set(u.width*i.getPixelRatio(),u.height*i.getPixelRatio())},-1),y.createElement("mesh",{ref:r,geometry:c,material:p})}const Pe=Array.from({length:12},(a,e)=>`/assets/reference/stickers/s_${String(e+1).padStart(2,"0")}.png`);function Ce({reduced:a}){const e=q.stickers.length?q.stickers:Pe,t=W(e),n=h.useRef(),{viewport:s,size:o}=E(),r=h.useMemo(()=>Array.from({length:24},(i,c)=>({x:(c*.618%1-.5)*1.02,y:c*.381%1*2,rotation:c*2.4,speed:.086+c%5*.012,phase:c*1.6})),[]),l=h.useRef(0),u=h.useRef(0);return j((i,c)=>{const p=document.getElementById("intro")?.getBoundingClientRect(),M=document.getElementById("contact")?.getBoundingClientRect();if(!n.current)return;const v=p?.bottom>0?p:M;if(n.current.visible=!!v&&v.top<o.height&&v.bottom>0,!n.current.visible)return;l.current+=a?0:Math.min(c,.05);const g=l.current;x.clicks!==u.current&&(u.current=x.clicks,r.forEach((f,d)=>{f.y=-g*f.speed-d/r.length*.6,f.x=x.uv.x-.5+(d%5-2)*.1})),n.current.children.forEach((f,d)=>{const S=r[d],P=a?d*.2%2:((S.y+g*S.speed)%2+2)%2;f.position.set((S.x+Math.sin(g*.3+S.phase)*.025)*s.width,s.height*(1-P-v.top/o.height),-2-d%4*.3),f.rotation.set(0,Math.sin(g*.35+S.phase)*.3,S.rotation+g*(d%2?-.15:.15));const F=t[d%t.length].image.width/t[d%t.length].image.height,C=s.height*(o.width<640?.08:.1);f.scale.set(C*F,C,1)})},-1),y.createElement("group",{ref:n},r.map((i,c)=>y.createElement("mesh",{key:c},y.createElement("planeGeometry",{args:[1,1]}),y.createElement("meshBasicMaterial",{map:t[c%t.length],transparent:!0,depthWrite:!1,side:me,toneMapped:!1}))))}function De({light:a,reduced:e}){const{gl:t,size:n,scene:s,camera:o}=E(),r=h.useMemo(()=>{const l=new de,u=new b(1,1,{depthBuffer:!0}),i=new b(1,1,{depthBuffer:!0}),c=new b(1,1,{depthBuffer:!1}),p=new Se({}),M=new Te({flareDownsample:.5,starRays:6,intensity:.7,threshold:.99,streakScale:8,hotspotPower:32,gate:.88,tailColor:"#1600ff",...we}),v=new O(new G(2,2),l.output);return v.frustumCulled=!1,v.renderOrder=-10,s.add(v),{bg:l,refraction:u,input:i,lit:c,fluid:p,flare:M,mesh:v,previous:new m(-1,-1),pixel:new m,delta:new m,lastMove:0}},[s]);return h.useEffect(()=>{const l=c=>{x.uv.set(c.clientX/innerWidth,1-c.clientY/innerHeight),x.inside=!0},u=()=>x.inside=!1,i=c=>{!c.target.closest("a,button")&&c.target.closest(".blue-section")&&x.clicks++};return window.addEventListener("pointermove",l,{passive:!0}),document.addEventListener("pointerleave",u),window.addEventListener("pointerdown",i),()=>{window.removeEventListener("pointermove",l),document.removeEventListener("pointerleave",u),window.removeEventListener("pointerdown",i)}},[]),h.useEffect(()=>{const l=t.getPixelRatio(),u=Math.floor(n.width*l),i=Math.floor(n.height*l);r.bg.resize(n.width,n.height),r.refraction.setSize(Math.floor(u*.5),Math.floor(i*.5)),r.input.setSize(u,i),r.lit.setSize(u,i),r.fluid.setSize(u,i),r.fluid.setDisplayMetrics(n.width,n.height,l),r.fluid.setPointerOverlayEnabled(!1),r.flare.setSize(u,i),r.flare.flareMaterial.uniforms.uStreakScale.value=8*n.width/1920},[r,n,t]),h.useEffect(()=>{r.flare.flareMaterial.uniforms.uTailColor.value.set(a?"#ffa300":"#1600ff")},[r,a]),h.useEffect(()=>()=>{s.remove(r.mesh),r.mesh.geometry.dispose(),r.bg.dispose(),r.refraction.dispose(),r.input.dispose(),r.lit.dispose(),r.fluid.dispose(),r.flare.dispose()},[r,s]),j(({clock:l},u)=>{const i=r,c=document.getElementById("intro")?.getBoundingClientRect(),p=document.getElementById("contact")?.getBoundingClientRect();if(!(c&&c.bottom>0||p&&p.top<n.height)){i.wasVisible&&(t.setRenderTarget(null),t.clear()),i.wasVisible=!1;return}i.wasVisible=!0,i.bg.render(t,l.elapsedTime,x.uv,a,e);const v=o.layers.mask;o.layers.set(0),t.setRenderTarget(i.refraction),t.clear(),t.render(s,o),s.traverse(g=>{g.material?.uniforms?.uTexture&&(g.material.uniforms.uTexture.value=i.refraction.texture)}),o.layers.enable(10),t.setRenderTarget(i.input),t.clear(),t.render(s,o),o.layers.mask=v,i.flare.renderToScreen=!1,i.flare.render(t,i.input,i.lit),i.pixel.set(x.uv.x*n.width*t.getPixelRatio(),x.uv.y*n.height*t.getPixelRatio()),i.previous.x>=0&&i.delta.subVectors(i.pixel,i.previous),i.previous.copy(i.pixel),i.delta.lengthSq()>1&&(i.lastMove=l.elapsedTime),i.fluid.setEffectEnabled(!e&&n.width>=1024&&l.elapsedTime-i.lastMove<.6),i.fluid.setPointer(i.pixel),i.fluid.setPointerDelta(i.delta),i.fluid.renderToScreen=!0,i.fluid.render(t,i.lit,null),t.setRenderTarget(null)},1),null}class ze extends h.Component{state={failed:!1};static getDerivedStateFromError(){return{failed:!0}}render(){return this.state.failed?null:this.props.children}}function Ee({light:a,reduced:e}){return y.createElement(ze,null,y.createElement("div",{className:"scene","aria-hidden":"true"},y.createElement(se,{camera:{position:[0,0,22],fov:45},dpr:[1,1.5],gl:{alpha:!0,antialias:!1,powerPreference:"high-performance",toneMapping:ue}},y.createElement(De,{light:a,reduced:e}),y.createElement(h.Suspense,{fallback:null},y.createElement(U,{path:V.hero,target:"intro",kind:"hero",light:a,reduced:e}),y.createElement(U,{path:V.cursor,target:"intro",kind:"cursor",light:a,reduced:e}),y.createElement(U,{path:V.footer,target:"contact",kind:"footer",light:a,reduced:e}),y.createElement(Ce,{reduced:e})))))}export{Ee as default};
