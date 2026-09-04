"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const SIGNAL_LABELS = ["DEVICE", "IP", "BEHAVIOR", "PAYMENT", "GEO"];

export default function RiskOrb() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // Outer orb — off-white sphere
    const outerGeo = new THREE.SphereGeometry(1.3, 64, 64);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0xf0f0e8,
      roughness: 0.35,
      metalness: 0.1,
      transparent: true,
      opacity: 0.15,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outerMesh);

    // Wire ring
    const ringGeo = new THREE.TorusGeometry(1.3, 0.008, 12, 120);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x0ed39a, transparent: true, opacity: 0.4 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.5;
    scene.add(ring);

    // Inner green core — pulsing
    const innerGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x0ed39a,
      roughness: 0.1,
      metalness: 0.8,
      emissive: 0x0ed39a,
      emissiveIntensity: 0.6,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // Glow
    const glowGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x0ed39a, transparent: true, opacity: 0.12,
    });
    scene.add(new THREE.Mesh(glowGeo, glowMat));

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const pt = new THREE.PointLight(0x0ed39a, 30, 10);
    pt.position.set(0, 0, 2);
    scene.add(pt);
    const pt2 = new THREE.DirectionalLight(0xffffff, 0.5);
    pt2.position.set(3, 3, 3);
    scene.add(pt2);

    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const pulse = 1 + Math.sin(t * 1.2) * 0.06;
      innerMesh.scale.setScalar(pulse);
      outerMesh.rotation.y += 0.003;
      ring.rotation.z += 0.004;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section
      style={{
        background: "#f7f7f2",
        padding: "8rem 2.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="label" style={{ color: "#a1a1a1", textAlign: "center", marginBottom: "1rem" }}>
        Decision Intelligence
      </div>
      <h2 style={{
        textAlign: "center",
        fontSize: "clamp(2rem, 4vw, 3.5rem)",
        fontWeight: 900,
        textTransform: "uppercase",
        color: "#050505",
        letterSpacing: "-0.03em",
        marginBottom: "3rem",
      }}>
        FRAUD DECISION ORB
      </h2>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "4rem", flexWrap: "wrap" }}>
        {/* Orb */}
        <div
          ref={mountRef}
          style={{ width: "320px", height: "320px", position: "relative" }}
        />

        {/* Signal labels */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {SIGNAL_LABELS.map((label, i) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: "#0ed39a",
                opacity: 0.5 + i * 0.1,
              }} />
              <span style={{
                fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", color: "#050505",
              }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
