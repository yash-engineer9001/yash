/**
 * High-Fidelity Autonomous Sensor Constellation & SLAM Landmark Mesh
 * Features: Multi-depth 3D parallax, pulsed beacon anchors, interactive sonar wave click ripples
 */

class AdvancedSensorConstellation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.nodes = [];
    this.numNodes = 60;
    this.maxDistance = 125;
    this.mouseX = -1000;
    this.mouseY = -1000;
    this.ripples = []; // interactive sonar waves on click

    this.setupCanvas();
    this.initNodes();
    this.initEvents();
    this.animate();
  }

  setupCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  initNodes() {
    this.nodes = [];
    for (let i = 0; i < this.numNodes; i++) {
      const isAnchor = i < 8; // 8 primary SLAM landmark anchors with halos
      const depth = Math.random() * 0.7 + 0.3; // 0.3 to 1.0 (parallax depth)

      this.nodes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.35 * depth,
        vy: (Math.random() - 0.5) * 0.35 * depth,
        radius: isAnchor ? 3.5 : (Math.random() * 2 + 1.2) * depth,
        depth: depth,
        isAnchor: isAnchor,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }
  }

  initEvents() {
    window.addEventListener('resize', () => {
      this.setupCanvas();
      this.initNodes();
    });

    const parent = this.canvas.parentElement;
    parent.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });

    parent.addEventListener('mouseleave', () => {
      this.mouseX = -1000;
      this.mouseY = -1000;
    });

    // Sonar Wave Ripple on Click
    parent.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      this.ripples.push({
        x: clickX,
        y: clickY,
        radius: 10,
        maxRadius: Math.min(this.width, this.height) * 0.75,
        alpha: 1.0
      });
    });
  }

  animate() {
    const ctx = this.ctx;
    const isDark = document.documentElement.classList.contains('dark');
    ctx.clearRect(0, 0, this.width, this.height);

    const edgeColorBase = isDark ? '56, 189, 248' : '2, 132, 199';
    const primaryNodeColor = isDark ? '#38bdf8' : '#0284c7';
    const anchorColor = isDark ? '#34d399' : '#059669';

    // Draw and expand sonar ripples
    for (let r = this.ripples.length - 1; r >= 0; r--) {
      const rip = this.ripples[r];
      rip.radius += 4;
      rip.alpha -= 0.015;

      if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
        this.ripples.splice(r, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${edgeColorBase}, ${rip.alpha * 0.6})`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.restore();
    }

    // Update and draw nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      node.x += node.vx;
      node.y += node.vy;

      // Bounce boundaries
      if (node.x < 0 || node.x > this.width) node.vx *= -1;
      if (node.y < 0 || node.y > this.height) node.vy *= -1;

      node.pulsePhase += 0.03;

      // Anchor node pulsing halo
      if (node.isAnchor) {
        const haloSize = node.radius + Math.sin(node.pulsePhase) * 4 + 4;
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, haloSize, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(52, 211, 153, 0.15)' : 'rgba(5, 150, 105, 0.15)';
        ctx.fill();
        ctx.restore();
      }

      // Draw node body
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.isAnchor ? anchorColor : primaryNodeColor;
      ctx.fill();

      // Mouse interactivity with distance readouts
      const distMouse = Math.hypot(node.x - this.mouseX, node.y - this.mouseY);
      if (distMouse < 150) {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(this.mouseX, this.mouseY);
        ctx.strokeStyle = `rgba(${edgeColorBase}, ${0.5 * (1 - distMouse / 150)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Subtle distance beacon label
        if (node.isAnchor) {
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.8)' : 'rgba(2, 132, 199, 0.9)';
          ctx.fillText(`${(distMouse / 35).toFixed(1)}m`, (node.x + this.mouseX) / 2 + 6, (node.y + this.mouseY) / 2);
        }
      }

      // Connect neighboring nodes
      for (let j = i + 1; j < this.nodes.length; j++) {
        const nodeB = this.nodes[j];
        const dist = Math.hypot(node.x - nodeB.x, node.y - nodeB.y);
        if (dist < this.maxDistance) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(nodeB.x, nodeB.y);
          const opacity = (1 - dist / this.maxDistance) * 0.22 * node.depth;
          ctx.strokeStyle = `rgba(${edgeColorBase}, ${opacity})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new AdvancedSensorConstellation('heroCanvas');
});
