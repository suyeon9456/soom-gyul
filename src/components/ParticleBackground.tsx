"use client";

import { useMemo } from "react";

interface Props {
  count?: number;
  color?: string;
}

export default function ParticleBackground({ count = 20, color = "rgba(255,255,255,0.3)" }: Props) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        size:     Math.random() * 4 + 2,
        duration: Math.random() * 15 + 10,
        delay:    Math.random() * 10,
        left:     Math.random() * 100,
      })),
    [count]
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-particle gpu"
          style={{
            width:             `${p.size}px`,
            height:            `${p.size}px`,
            backgroundColor:   color,
            left:              `${p.left}%`,
            bottom:            "-20px",
            animationDuration: `${p.duration}s`,
            animationDelay:    `${-p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
