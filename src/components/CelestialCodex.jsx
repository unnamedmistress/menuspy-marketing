import React, { useEffect, useRef } from 'react';

export default function CelestialCodex() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    // Draw stars (nodes)
    const stars = Array.from({ length: 12 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 5 + Math.random() * 5,
      color: `hsl(${Math.random() * 60 + 270}, 100%, 70%)`,
    }));

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();
        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = star.color;
      });
    };

    drawStars();

    // Handle drawing lines between stars
    let isDrawing = false;
    let startStar = null;

    canvas.addEventListener('mousedown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      stars.forEach(star => {
        const distance = Math.sqrt((x - star.x) ** 2 + (y - star.y) ** 2);
        if (distance < star.radius + 10) {
          isDrawing = true;
          startStar = star;
        }
      });
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!isDrawing || !startStar) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      drawStars();
      ctx.beginPath();
      ctx.moveTo(startStar.x, startStar.y);
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#FBB6CE';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    canvas.addEventListener('mouseup', () => {
      isDrawing = false;
      startStar = null;
    });
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-pink-300 mb-6">Celestial Codex</h2>
      <canvas
        ref={canvasRef}
        className="bg-purple-900 rounded-lg"
        style={{ width: '800px', height: '600px' }}
      ></canvas>
    </div>
  );
}