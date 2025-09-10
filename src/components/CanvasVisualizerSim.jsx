import React, { useRef, useEffect, useState } from 'react';

// AudioVisualizer (simulated, symmetric)
// - Renders a canvas-based bar visualizer that extends both up and down from the center.
// - Simulates audio input (no audio ref needed)
// - Props allow simple configuration
// - Uses high-DPI scaling and smooth animations

export default function CanvasVisualizerSim({
  width = 400,
  height = 120,
  barCount = 18,
  barWidth = 8,
  gap = 4,
  centerGap = 0, // The gap in the middle between the top and bottom bars
  minBarHeight = 0,
  maxBarHeight, // if not provided, will be derived from height
  sensitivity = 0.8, // multiplier for amplitude
  style = {},
  className = '',
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const [isRunning, setIsRunning] = useState(true);

  // The max height for a single bar is half the canvas height, minus padding and center gap
  const effectiveMaxBarHeight = maxBarHeight ?? Math.max(2, height / 2 - centerGap / 2 - 4);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let dpr = window.devicePixelRatio || 1;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // make drawing high-dpi aware
    }

    resize();
    window.addEventListener('resize', resize);

    // animation function: simulate audio data using multiple sin waves + noise
    function sampleAmplitudes(time) {
      const amps = new Array(barCount);
      const t = time / 1000; // convert ms to s
      const envelope = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(t * 0.25));

      for (let i = 0; i < barCount; i++) {
        const x = i / Math.max(1, barCount - 1);
        const a = Math.sin((t * 2.0 + x * 2.0) * (1.2 + 0.3 * Math.cos(x * 6.0)) + x * 3.1);
        const b = 0.5 * Math.sin((t * 3.6 + x * 5.0) * 0.9 + Math.sin(x * 2.9));
        const c = 0.25 * Math.sin((t * 1.2 + x * 1.6) * 2.4 + Math.cos(x * 1.2));
        const jitter = 0.15 * Math.sin(t * (0.5 + x * 2.0) + i);
        let value = (a + b + c + jitter) * 0.5 + 0.5;
        const spatialFalloff = 0.8 + 0.2 * Math.cos(x * Math.PI);
        value = value * envelope * spatialFalloff;
        value = Math.max(0, Math.min(1, value + (Math.random() - 0.5) * 0.02));
        amps[i] = value;
      }
      return amps;
    }

    // Helper to draw a rounded rectangle
    function drawRoundedRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();
    }

    function draw(timeMs) {
      if (!isRunning) return;
      if (!startTimeRef.current) startTimeRef.current = timeMs;
      const elapsed = timeMs - startTimeRef.current;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, 0, width, height);

      const amps = sampleAmplitudes(timeMs);
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#f7f8f9ff'); // light blue (top)
      grad.addColorStop(0.5, '#aaaaaaff'); // mid blue (center)
      grad.addColorStop(1, '#e7e7e7ff'); // deep indigo (bottom)

      const totalBarSpace = barWidth * barCount + gap * (barCount - 1);
      const startX = (width - totalBarSpace) / 2;
      const centerY = height / 2;

      for (let i = 0; i < barCount; i++) {
        const amp = amps[i] * sensitivity;
        const barHalfHeight = Math.max(minBarHeight, amp * effectiveMaxBarHeight);

        const x = startX + i * (barWidth + gap);
        const radius = Math.min(6, barWidth / 2);

        // --- Top Bar ---
        const topY = centerY - barHalfHeight - centerGap / 2;

        // Shadow
        ctx.fillStyle = 'rgba(15,23,42,0.18)';
        ctx.fillRect(x - 1, topY - 2, barWidth + 2, barHalfHeight + 4);

        // Main bar
        ctx.fillStyle = grad;
        drawRoundedRect(x, topY, barWidth, barHalfHeight, radius);

        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fillRect(x, topY, barWidth, Math.min(6, barHalfHeight));

        // --- Bottom Bar ---
        const bottomY = centerY + centerGap / 2;

        // Shadow
        ctx.fillStyle = 'rgba(15,23,42,0.18)';
        ctx.fillRect(x - 1, bottomY - 2, barWidth + 2, barHalfHeight + 4);

        // Main bar
        ctx.fillStyle = grad;
        drawRoundedRect(x, bottomY, barWidth, barHalfHeight, radius);

        // "Lowlight"
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(x, bottomY + barHalfHeight - Math.min(6, barHalfHeight), barWidth, Math.min(6, barHalfHeight));
      }

      // Wave overlay remains centered and works perfectly here
      ctx.beginPath();
      const waveAmp = 8;
      for (let i = 0; i < barCount; i++) {
        const x = startX + i * (barWidth + gap) + barWidth / 2;
        const phase = (elapsed / 1200) + i * 0.25;
        const y = centerY + Math.sin(phase) * waveAmp;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(96,165,250,0.12)';
      ctx.stroke();

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [width, height, barCount, barWidth, gap, centerGap, minBarHeight, effectiveMaxBarHeight, sensitivity, isRunning]);

  return (
    <div className={`w-[${width}px] ${className}`} style={{ backgroundColor: 'transparent', width: width, ...style }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height, backgroundColor: 'transparent' }} />
    </div>
  );
}