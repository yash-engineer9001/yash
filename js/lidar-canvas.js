/**
 * Yash Santosh Prasad - Autonomous Systems & Robotics Simulator
 * Interactive LiDAR 360° & Dual-Stream Perception Visualizer
 */

class PerceptionSimulator {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.mode = 'lidar'; // 'lidar', 'yolo', 'thermal'
    this.angle = 0;
    this.sweepSpeed = 0.04;
    this.obstacles = [
      { x: 0.35, y: -0.4, radius: 24, label: 'Obstacle #1', class: 'Static Barrier', distance: 2.1 },
      { x: -0.45, y: -0.3, radius: 20, label: 'Drone #2', class: 'UAV Dynamic', distance: 1.8 },
      { x: 0.5, y: 0.35, radius: 28, label: 'Operator', class: 'Human Hazard', distance: 2.7 },
      { x: -0.25, y: 0.5, radius: 18, label: 'Landing Pad', class: 'Target Beacon', distance: 1.5 }
    ];

    this.points = [];
    this.maxPoints = 400;
    this.animationFrame = null;
    this.telemetryInterval = null;

    this.setupCanvas();
    this.initEvents();
    this.animate();
    this.startTelemetryStream();
  }

  setupCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = Math.min(rect.width * 0.75, 420);
    
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.maxRadius = Math.min(this.centerX, this.centerY) * 0.88;
  }

  initEvents() {
    window.addEventListener('resize', () => {
      this.setupCanvas();
    });

    // Interactive obstacle placement
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left - this.centerX;
      const clickY = e.clientY - rect.top - this.centerY;
      
      const normX = clickX / this.maxRadius;
      const normY = clickY / this.maxRadius;

      if (Math.hypot(normX, normY) <= 1) {
        this.obstacles.push({
          x: normX,
          y: normY,
          radius: 20,
          label: `Waypoint #${this.obstacles.length + 1}`,
          class: 'Manual Target',
          distance: (Math.hypot(normX, normY) * 3).toFixed(2)
        });

        if (this.obstacles.length > 7) {
          this.obstacles.shift(); // keep list clean
        }
      }
    });
  }

  setMode(newMode) {
    this.mode = newMode;
    const modeBadge = document.getElementById('sim-mode-badge');
    if (modeBadge) {
      modeBadge.textContent = `MODE: ${newMode.toUpperCase()}`;
    }
  }

  drawGrid() {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 1;

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(this.centerX, 0);
    ctx.lineTo(this.centerX, this.height);
    ctx.moveTo(0, this.centerY);
    ctx.lineTo(this.width, this.centerY);
    ctx.stroke();

    // Range rings
    const rings = 4;
    for (let i = 1; i <= rings; i++) {
      const r = (this.maxRadius / rings) * i;
      ctx.beginPath();
      ctx.arc(this.centerX, this.centerY, r, 0, Math.PI * 2);
      ctx.strokeStyle = i === rings ? 'rgba(56, 189, 248, 0.25)' : 'rgba(56, 189, 248, 0.08)';
      ctx.stroke();

      // Range text
      ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`${(i * 1.0).toFixed(1)}m`, this.centerX + r + 4, this.centerY - 4);
    }
    ctx.restore();
  }

  drawLiDAR() {
    const ctx = this.ctx;
    this.drawGrid();

    // Rotate beam
    this.angle += this.sweepSpeed;
    if (this.angle >= Math.PI * 2) this.angle = 0;

    // Draw Sweep Beam Cone
    ctx.save();
    const gradient = ctx.createRadialGradient(
      this.centerX, this.centerY, 10,
      this.centerX, this.centerY, this.maxRadius
    );
    gradient.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
    gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

    ctx.beginPath();
    ctx.moveTo(this.centerX, this.centerY);
    ctx.arc(this.centerX, this.centerY, this.maxRadius, this.angle - 0.35, this.angle);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Sweep Line
    ctx.beginPath();
    ctx.moveTo(this.centerX, this.centerY);
    ctx.lineTo(
      this.centerX + Math.cos(this.angle) * this.maxRadius,
      this.centerY + Math.sin(this.angle) * this.maxRadius
    );
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.restore();

    // Check Ray Intersection with Obstacles
    this.obstacles.forEach(obs => {
      const ox = this.centerX + obs.x * this.maxRadius;
      const oy = this.centerY + obs.y * this.maxRadius;
      const obsAngle = Math.atan2(oy - this.centerY, ox - this.centerX);
      const normalizedObsAngle = obsAngle < 0 ? obsAngle + Math.PI * 2 : obsAngle;

      // When laser hits obstacle
      const angleDiff = Math.abs(normalizedObsAngle - this.angle);
      if (angleDiff < 0.05 || Math.abs(angleDiff - Math.PI * 2) < 0.05) {
        for (let p = 0; p < 3; p++) {
          this.points.push({
            x: ox + (Math.random() - 0.5) * obs.radius,
            y: oy + (Math.random() - 0.5) * obs.radius,
            alpha: 1.0,
            color: '#10b981'
          });
        }
      }

      // Draw obstacle body
      ctx.save();
      ctx.beginPath();
      ctx.arc(ox, oy, obs.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fill();

      // Label
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(obs.label, ox - 24, oy - obs.radius - 6);
      ctx.restore();
    });

    // Render Point Cloud buffer
    ctx.save();
    for (let i = this.points.length - 1; i >= 0; i--) {
      const pt = this.points[i];
      pt.alpha -= 0.012;
      if (pt.alpha <= 0) {
        this.points.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(16, 185, 129, ${pt.alpha})`;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 4;
      ctx.fill();
    }
    ctx.restore();

    // Center Core (Pi 5 + LiDAR Sensor)
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#06b6d4';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.restore();
  }

  drawYOLO() {
    const ctx = this.ctx;
    // Draw synthetic camera frame
    ctx.fillStyle = 'rgba(10, 15, 28, 0.95)';
    ctx.fillRect(0, 0, this.width, this.height);

    // Draw synthetic horizon / edge features
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 30, this.width - 60, this.height - 60);

    // Grid ticks
    ctx.fillStyle = '#06b6d4';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText('CAM_FEED: STEREO_RGB [YOLOv8 + ByteTrack]', 40, 24);
    ctx.fillText('FPS: 58.4 | RES: 640x480 | CONF: >0.70', this.width - 240, 24);

    this.obstacles.forEach((obs, idx) => {
      const ox = this.centerX + obs.x * (this.width * 0.4);
      const oy = this.centerY + obs.y * (this.height * 0.35);
      const boxW = obs.radius * 2.8;
      const boxH = obs.radius * 3.4;

      // Bounding Box
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(ox - boxW/2, oy - boxH/2, boxW, boxH);

      // Tracking ID & Class Tag
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(ox - boxW/2, oy - boxH/2 - 16, boxW, 16);
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`ID:${idx+1} ${obs.class}`, ox - boxW/2 + 4, oy - boxH/2 - 4);

      // Center crosshair
      ctx.beginPath();
      ctx.arc(ox, oy, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#f43f5e';
      ctx.fill();

      // Confidence & Distance
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(`Dist: ${obs.distance}m | Conf: 94%`, ox - boxW/2, oy + boxH/2 + 12);
      ctx.restore();
    });
  }

  drawThermal() {
    const ctx = this.ctx;
    ctx.fillStyle = '#0f051d';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = '#c084fc';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText('SENSOR: INFRARED_LWIR THERMAL MATRIX', 40, 24);

    this.obstacles.forEach(obs => {
      const ox = this.centerX + obs.x * (this.width * 0.4);
      const oy = this.centerY + obs.y * (this.height * 0.35);

      const radGrad = ctx.createRadialGradient(ox, oy, 4, ox, oy, obs.radius * 2.2);
      radGrad.addColorStop(0, '#ffffff'); // peak hot core
      radGrad.addColorStop(0.2, '#fde047');
      radGrad.addColorStop(0.5, '#e11d48');
      radGrad.addColorStop(0.8, '#4c1d95');
      radGrad.addColorStop(1, 'rgba(15, 5, 29, 0)');

      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(ox, oy, obs.radius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f87171';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`${(36.5 + Math.random() * 0.4).toFixed(1)}°C`, ox - 14, oy + obs.radius + 14);
    });
  }

  startTelemetryStream() {
    const telemetrySpeed = document.getElementById('telemetry-speed');
    const telemetryYaw = document.getElementById('telemetry-yaw');
    const telemetryObstacles = document.getElementById('telemetry-obs-count');
    const telemetryLatency = document.getElementById('telemetry-latency');

    let yaw = 184.2;

    this.telemetryInterval = setInterval(() => {
      yaw = (yaw + 0.6) % 360;
      if (telemetryYaw) telemetryYaw.textContent = `${yaw.toFixed(1)}°`;
      if (telemetrySpeed) telemetrySpeed.textContent = `${(2.4 + Math.sin(Date.now() / 1500) * 0.4).toFixed(1)} m/s`;
      if (telemetryObstacles) telemetryObstacles.textContent = `${this.obstacles.length} TRACKED`;
      if (telemetryLatency) telemetryLatency.textContent = `${Math.floor(14 + Math.random() * 5)} ms`;
    }, 400);
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.mode === 'lidar') {
      this.drawLiDAR();
    } else if (this.mode === 'yolo') {
      this.drawYOLO();
    } else if (this.mode === 'thermal') {
      this.drawThermal();
    }

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    if (this.telemetryInterval) clearInterval(this.telemetryInterval);
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  const simulator = new PerceptionSimulator('lidarCanvas');

  // Control button listeners
  const btnLidar = document.getElementById('btn-mode-lidar');
  const btnYolo = document.getElementById('btn-mode-yolo');
  const btnThermal = document.getElementById('btn-mode-thermal');

  const modeButtons = [btnLidar, btnYolo, btnThermal];

  function setActiveModeButton(activeBtn) {
    modeButtons.forEach(btn => {
      if (!btn) return;
      if (btn === activeBtn) {
        btn.classList.add('bg-cyan-500/20', 'text-cyan-400', 'border-cyan-500/50');
        btn.classList.remove('text-slate-400', 'border-slate-800');
      } else {
        btn.classList.remove('bg-cyan-500/20', 'text-cyan-400', 'border-cyan-500/50');
        btn.classList.add('text-slate-400', 'border-slate-800');
      }
    });
  }

  if (btnLidar) {
    btnLidar.addEventListener('click', () => {
      simulator.setMode('lidar');
      setActiveModeButton(btnLidar);
    });
  }
  if (btnYolo) {
    btnYolo.addEventListener('click', () => {
      simulator.setMode('yolo');
      setActiveModeButton(btnYolo);
    });
  }
  if (btnThermal) {
    btnThermal.addEventListener('click', () => {
      simulator.setMode('thermal');
      setActiveModeButton(btnThermal);
    });
  }
});
