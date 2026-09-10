import React, { useRef, useEffect, useCallback } from 'react';

/**
 * ParticleConstellation — Ultra-premium animated background
 * Draws drifting luminous particles that form geometric connections.
 * Mouse interaction creates a gravitational pull effect.
 * Inspired by particles.casberry.in aesthetic.
 */
export default function ParticleConstellation({ particleCount = 90, connectionDistance = 140, interactive = true }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef([]);
  const dimensionsRef = useRef({ w: 0, h: 0 });

  const COLORS = [
    'rgba(16, 185, 129, ',   // emerald
    'rgba(249, 115, 22, ',   // saffron
    'rgba(14, 165, 233, ',   // sky
    'rgba(139, 92, 246, ',   // violet
    'rgba(236, 72, 153, ',   // pink
  ];

  const initParticles = useCallback((w, h) => {
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      const colorBase = COLORS[Math.floor(Math.random() * COLORS.length)];
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 0.8,
        colorBase,
        alpha: Math.random() * 0.5 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }
    return particles;
  }, [particleCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      dimensionsRef.current = { w: rect.width, h: rect.height };
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particlesRef.current = initParticles(rect.width, rect.height);
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    const draw = (time) => {
      const { w, h } = dimensionsRef.current;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      ctx.clearRect(0, 0, w, h);

      // Update particles
      for (const p of particles) {
        // Mouse gravitational pull
        if (interactive) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200 && dist > 1) {
            const force = (200 - dist) / 200 * 0.015;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Damping
        p.vx *= 0.998;
        p.vy *= 0.998;

        // Wrap around edges
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Pulsing alpha
        const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.15 + 0.85;
        const alpha = p.alpha * pulse;

        // Glow
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
        gradient.addColorStop(0, p.colorBase + (alpha * 0.6) + ')');
        gradient.addColorStop(1, p.colorBase + '0)');
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.fillStyle = p.colorBase + alpha + ')';
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            const opacity = (1 - dist / connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(148, 163, 184, ${opacity})`;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Mouse connection halo
      if (interactive && mouse.x > 0 && mouse.y > 0) {
        for (const p of particles) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const opacity = (1 - dist / 180) * 0.25;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(249, 115, 22, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [interactive, connectionDistance, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: interactive ? 'auto' : 'none',
      }}
    />
  );
}
