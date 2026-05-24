"use client";

import { useEffect, useRef } from "react";
import { fullscreenVert } from "./shaders/fullscreen.vert";
import { networkMeshFrag } from "./shaders/network-mesh.frag";

type WebGLState = {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  uTime: WebGLUniformLocation;
  uResolution: WebGLUniformLocation;
  uMouse: WebGLUniformLocation;
};

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
  vertSource: string,
  fragSource: string,
): WebGLProgram | null {
  const vert = compileShader(gl, gl.VERTEX_SHADER, vertSource);
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSource);
  if (!vert || !frag) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);

  gl.deleteShader(vert);
  gl.deleteShader(frag);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

export function useWebGLProgram(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  enabled: boolean,
) {
  const stateRef = useRef<WebGLState | null>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", { alpha: false, antialias: false });
    if (!gl) return;

    const program = createProgram(gl, fullscreenVert, networkMeshFrag);
    if (!program) return;

    const positionLoc = gl.getAttribLocation(program, "a_position");
    const uTime = gl.getUniformLocation(program, "u_time")!;
    const uResolution = gl.getUniformLocation(program, "u_resolution")!;
    const uMouse = gl.getUniformLocation(program, "u_mouse")!;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    stateRef.current = { gl, program, uTime, uResolution, uMouse };
    startTimeRef.current = performance.now();

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    // The field drifts slowly, so ~30fps is indistinguishable from 60/120Hz
    // while roughly halving (or quartering, on ProMotion) the GPU work.
    const frameInterval = 1000 / 30;
    let lastDraw = 0;
    let running = false;
    let visible = !document.hidden;
    let inView = true;

    const render = (now: number) => {
      if (!stateRef.current) return;
      rafRef.current = requestAnimationFrame(render);
      if (now - lastDraw < frameInterval) return;
      lastDraw = now;

      const { gl: g, program: prog, uTime: tLoc, uResolution: rLoc, uMouse: mLoc } =
        stateRef.current;
      const elapsed = (now - startTimeRef.current) / 1000;

      g.useProgram(prog);
      g.uniform1f(tLoc, elapsed);
      g.uniform2f(rLoc, canvas.width, canvas.height);
      g.uniform2f(mLoc, 0.5, 0.5);
      g.drawArrays(g.TRIANGLE_STRIP, 0, 4);
    };

    const start = () => {
      if (running) return;
      running = true;
      lastDraw = 0;
      rafRef.current = requestAnimationFrame(render);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(rafRef.current);
    };

    const sync = () => {
      if (visible && inView) start();
      else stop();
    };

    const onVisibility = () => {
      visible = !document.hidden;
      sync();
    };

    // Pause rendering whenever the hero is scrolled out of view.
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? false;
        sync();
      },
      { threshold: 0 },
    );

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    io.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);
    sync();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      stateRef.current = null;
    };
  }, [canvasRef, enabled]);
}

export function shouldUseWebGLShader(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.matchMedia("(max-width: 768px)").matches) return false;
  try {
    const canvas = document.createElement("canvas");
    return !!canvas.getContext("webgl2");
  } catch {
    return false;
  }
}
