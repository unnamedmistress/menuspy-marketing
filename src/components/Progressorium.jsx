import React, { useEffect, useRef } from 'react';
import { capabilities } from '../data/capabilities';

export default function Progressorium() {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous renders

    // Draw gears (nodes)
    const gears = capabilities.map((cap, index) => ({
      id: cap.id,
      x: 100 + (index % 5) * 150,
      y: 100 + Math.floor(index / 5) * 150,
      radius: 30,
      color: '#D53F8C',
    }));

    // Draw gears
    gears.forEach(gear => {
      svg
        .append('circle')
        .attr('cx', gear.x)
        .attr('cy', gear.y)
        .attr('r', gear.radius)
        .attr('fill', gear.color)
        .on('click', () => {
          alert(`Capability: ${capabilities.find(c => c.id === gear.id).name}`);
        });

      // Add gear teeth (simplified)
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const x1 = gear.x + Math.cos(angle) * gear.radius;
        const y1 = gear.y + Math.sin(angle) * gear.radius;
        const x2 = gear.x + Math.cos(angle) * (gear.radius + 10);
        const y2 = gear.y + Math.sin(angle) * (gear.radius + 10);

        svg
          .append('line')
          .attr('x1', x1)
          .attr('y1', y1)
          .attr('x2', x2)
          .attr('y2', y2)
          .attr('stroke', '#FBB6CE')
          .attr('stroke-width', 2);
      }
    });

    // Draw connecting lines (simplified)
    for (let i = 0; i < gears.length - 1; i++) {
      svg
        .append('line')
        .attr('x1', gears[i].x)
        .attr('y1', gears[i].y)
        .attr('x2', gears[i + 1].x)
        .attr('y2', gears[i + 1].y)
        .attr('stroke', '#9F7AEA')
        .attr('stroke-width', 2);
    }
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-pink-300 mb-6">Progressorium</h2>
      <svg ref={svgRef} width="800" height="600" className="bg-purple-900 rounded-lg"></svg>
    </div>
  );
}