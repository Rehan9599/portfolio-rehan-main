import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const particleVertex = `
  attribute float scale;
  uniform float uTime;
  void main() {
    vec3 p = position;
    float s = scale;
    p.y += (sin(p.x + uTime) * 0.5) + (cos(p.y + uTime) * 0.1) * 2.0;
    p.x += (sin(p.y + uTime) * 0.5);
    s += (sin(p.x + uTime) * 0.5) + (cos(p.y + uTime) * 0.1) * 2.0;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = s * 15.0 * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragment = `
  uniform vec3 uColor;
  void main() {
    gl_FragColor = vec4(uColor, 0.5);
  }
`;

function isDarkTheme() {
  return document.documentElement.classList.contains('dark')
    || !document.documentElement.hasAttribute('data-theme');
}

export function ParticleWave({ className = '', enabled = false }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.set(0, 6, 5);

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const amountX = 200;
    const amountY = 200;
    const gap = 0.3;
    const positions = new Float32Array(amountX * amountY * 3);
    const scales = new Float32Array(amountX * amountY);

    let positionIndex = 0;
    let scaleIndex = 0;
    for (let ix = 0; ix < amountX; ix += 1) {
      for (let iy = 0; iy < amountY; iy += 1) {
        positions[positionIndex] = ix * gap - (amountX * gap) / 2;
        positions[positionIndex + 1] = 0;
        positions[positionIndex + 2] = iy * gap - (amountY * gap) / 2;
        scales[scaleIndex] = 1;
        positionIndex += 3;
        scaleIndex += 1;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Vector3(1, 1, 1) },
      },
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    sceneRef.current = { camera, geometry, material, particles, renderer, scene, animationId: null };

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      material.uniforms.uTime.value += 0.05;
      material.uniforms.uColor.value.set(isDarkTheme() ? 1 : 0.08, isDarkTheme() ? 1 : 0.08, isDarkTheme() ? 1 : 0.08);
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
      sceneRef.current.animationId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (sceneRef.current?.animationId) cancelAnimationFrame(sceneRef.current.animationId);
      scene.remove(particles);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      sceneRef.current = null;
    };
  }, [enabled]);

  return (
    <canvas
      ref={canvasRef}
      className={`particle-wave ${enabled ? 'is-active' : ''} ${className}`}
      aria-hidden="true"
    />
  );
}