"use client";

import { useRef, useSyncExternalStore } from "react";
import { shouldUseWebGLShader, useWebGLProgram } from "./use-webgl-program";

function subscribe() {
  return () => {};
}

function getWebGLSnapshot() {
  return shouldUseWebGLShader();
}

function getWebGLServerSnapshot() {
  return false;
}

export function NetworkMeshCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const enabled = useSyncExternalStore(subscribe, getWebGLSnapshot, getWebGLServerSnapshot);

  useWebGLProgram(canvasRef, enabled);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
