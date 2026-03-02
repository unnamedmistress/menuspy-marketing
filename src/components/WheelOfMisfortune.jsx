import React, { useState, useRef, useEffect } from 'react';
import { capabilities } from '../data/capabilities';

export default function WheelOfMisfortune() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const canvasRef = useRef();

  const categories = [...new Set(capabilities.map(cap => cap.category))];
  const wheelSegments = categories.length;
  const segmentAngle = (2 * Math.PI) / wheelSegments;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;

    // Draw the wheel
    const drawWheel = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw segments
      categories.forEach((category, i) => {
        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 200, i * segmentAngle, (i + 1) * segmentAngle);
        ctx.closePath();
        ctx.fillStyle = `hsl(${(i * 360) / wheelSegments}, 80%, 60%)`;
        ctx.fill();

        // Draw text
        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(i * segmentAngle + segmentAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = 'black';
        ctx.font = '16px pixelated';
        ctx.fillText(category, 180, 5);
        ctx.restore();
      });
    };

    drawWheel();
  }, []);

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    const spinDuration = 3000; // 3 seconds
    const startTime = Date.now();
    const spinInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= spinDuration) {
        clearInterval(spinInterval);
        setSpinning(false);

        // Select a random category
        const randomIndex = Math.floor(Math.random() * categories.length);
        const selectedCategory = categories[randomIndex];
        setResult(selectedCategory);

        // Select a random capability from the category
        const categoryCapabilities = capabilities.filter(cap => cap.category === selectedCategory);
        const randomCapability = categoryCapabilities[Math.floor(Math.random() * categoryCapabilities.length)];
        alert(`You unlocked: ${randomCapability.name}`);
      }
    }, 16); // ~60fps
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-pink-300 mb-6">Wheel of Misfortune</h2>
      <div className="flex flex-col items-center">
        <canvas
          ref={canvasRef}
          className="bg-purple-900 rounded-full mb-6"
          style={{ width: '500px', height: '500px' }}
        ></canvas>
        <button
          onClick={spinWheel}
          disabled={spinning}
          className="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-lg transition-colors"
        >
          {spinning ? 'Spinning...' : 'Spin the Wheel'}
        </button>
        {result && <p className="mt-4 text-xl text-pink-200">Category: {result}</p>}
      </div>
    </div>
  );
}