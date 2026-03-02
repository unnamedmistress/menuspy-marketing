import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { capabilities } from '../data/capabilities';

export default function Labyrinth() {
  const svgRef = useRef();

  useEffect(() => {
    // Create a hierarchical structure from capabilities
    const root = d3.hierarchy({ id: 'root', children: capabilities });
    const treeLayout = d3.tree().size([800, 500]);
    treeLayout(root);

    // Draw the tree
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous renders

    // Draw links
    svg
      .selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('stroke', '#9F7AEA')
      .attr('fill', 'none')
      .attr('d', d3.linkVertical().x(d => d.x).y(d => d.y));

    // Draw nodes
    const nodes = svg
      .selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    nodes
      .append('circle')
      .attr('r', 10)
      .attr('fill', '#D53F8C')
      .on('click', (event, d) => {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        // Re-render the tree
        treeLayout(root);
        // Update the visualization
        // (This is a simplified version; in practice, you'd need to update the links and nodes)
      });

    nodes
      .append('text')
      .attr('dy', '0.31em')
      .attr('x', d => (d.children ? -15 : 15))
      .attr('text-anchor', d => (d.children ? 'end' : 'start'))
      .text(d => (d.data.id === 'root' ? 'Capabilities' : d.data.name))
      .attr('fill', '#FBB6CE');
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-pink-300 mb-6">Labyrinth</h2>
      <svg ref={svgRef} width="800" height="500" className="bg-purple-900 rounded-lg"></svg>
    </div>
  );
}