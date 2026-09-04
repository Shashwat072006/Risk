"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // Geometry — layered torus knot as "ribbon"
    const geometry = new THREE.TorusKnotGeometry(1.1, 0.38, 180, 24, 2, 3);
    const material = new THREE.MeshStandardMaterial({
      color: 0x0ed39a,
      roughness: 0.25,
      metalness: 0.7,
      wireframe: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Secondary wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x066c54,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireMesh = new THREE.Mesh(geometry, wireMat);
    scene.add(wireMesh);

    // Lighting
    const ambient = new THREE.AmbientLight(0x050505, 1);
    scene.add(ambient);
    const point1 = new THREE.PointLight(0x0ed39a, 60, 20);
    point1.position.set(3, 3, 3);
    scene.add(point1);
    const point2 = new THREE.PointLight(0x066c54, 40, 20);
    point2.position.set(-3, -2, 2);
    scene.add(point2);
    const point3 = new THREE.DirectionalLight(0xffffff, 0.4);
    point3.position.set(0, 5, 5);
    scene.add(point3);

    // Mouse parallax
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Resize
    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // Animation loop
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Breathing + cursor parallax
      mesh.rotation.x += 0.003;
      mesh.rotation.y += 0.005;
      mesh.rotation.x += (mouseY * 0.15 - mesh.rotation.x) * 0.03;
      mesh.rotation.y += (mouseX * 0.15 - mesh.rotation.y) * 0.03;

      const breathe = 1 + Math.sin(t * 0.8) * 0.02;
      mesh.scale.setScalar(breathe);
      wireMesh.rotation.copy(mesh.rotation);
      wireMesh.scale.copy(mesh.scale);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      wireMat.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: "none",
      }}
    />
  );
}
