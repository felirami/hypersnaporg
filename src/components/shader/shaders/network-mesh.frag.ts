export const networkMeshFrag = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

#define NUM_NODES 10

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

vec2 nodePos(int i) {
  float fi = float(i);
  vec2 base = vec2(hash(fi * 1.7 + 0.3), hash(fi * 2.3 + 1.1));
  base = base * 0.68 + 0.16;
  float drift = sin(u_time * 0.1 + fi * 1.3) * 0.008;
  return base + vec2(drift, cos(u_time * 0.08 + fi * 0.9) * 0.008);
}

float nodePulse(int i) {
  return 0.5 + 0.5 * sin(u_time * 1.2 + float(i) * 0.55);
}

float distToSegment(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float t = clamp(dot(p - a, ab) / dot(ab, ab), 0.0, 1.0);
  return length(p - a - ab * t);
}

float signalPacket(vec2 p, vec2 a, vec2 b, float phase) {
  vec2 ab = b - a;
  float len = length(ab);
  if (len < 0.001) return 0.0;
  vec2 dir = ab / len;
  float t = dot(p - a, dir) / len;
  float packet = fract(u_time * 0.22 + phase);
  float d = abs(t - packet);
  d = min(d, 1.0 - d);
  float along = smoothstep(0.06, 0.0, d);
  float perp = distToSegment(p, a, b);
  return along * smoothstep(0.005, 0.0, perp);
}

void main() {
  vec2 uv = v_uv;
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
  vec2 p = uv * aspect + (u_mouse - 0.5) * 0.025;

  vec3 bg = vec3(0.004, 0.008, 0.04);
  vec3 col = bg;

  float edgeGlow = 0.0;
  float nodeGlow = 0.0;
  float packetGlow = 0.0;

  for (int i = 0; i < NUM_NODES; i++) {
    vec2 ni = nodePos(i) * aspect;
    float pulse = nodePulse(i);
    float nd = length(p - ni);
    float nodeR = 0.006 + pulse * 0.003;
    nodeGlow += smoothstep(nodeR + 0.02, nodeR, nd) * (0.45 + pulse * 0.3);
    nodeGlow += smoothstep(nodeR + 0.05, nodeR, nd) * 0.08;

    for (int j = i + 1; j < NUM_NODES; j++) {
      vec2 nj = nodePos(j) * aspect;
      float d = distToSegment(p, ni, nj);
      float linkDist = length(ni - nj);
      if (linkDist > 0.5) continue;

      float edgeWidth = 0.0015 + (1.0 - linkDist / 0.5) * 0.0008;
      float e = smoothstep(edgeWidth + 0.002, edgeWidth, d);
      edgeGlow += e * (1.0 - linkDist / 0.5);

      float phase = hash(float(i * NUM_NODES + j)) * 6.28;
      packetGlow += signalPacket(p, ni, nj, phase) * 0.55;
    }
  }

  vec3 cyan = vec3(0.35, 0.82, 0.98);
  vec3 violet = vec3(0.55, 0.45, 0.98);
  vec3 emerald = vec3(0.38, 0.88, 0.72);

  col += mix(cyan, violet, 0.35) * edgeGlow * 0.22;
  col += mix(cyan, emerald, 0.5) * nodeGlow * 0.38;
  col += mix(cyan, violet, 0.25) * packetGlow * 0.45;

  float aurora = sin(p.x * 3.0 + u_time * 0.15) * cos(p.y * 2.5 - u_time * 0.12);
  col += mix(violet, cyan, 0.5) * aurora * 0.012;

  float vig = smoothstep(0.0, 0.9, length(uv - 0.5) * 1.35);
  col = mix(col, bg, vig * 0.72);

  fragColor = vec4(col, 1.0);
}
`;
