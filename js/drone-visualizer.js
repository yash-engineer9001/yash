/**
 * Advanced Multirotor Kinematics, Battery Configuration & 6-DOF IMU Oscilloscope
 * Supports: 3S, 4S, 6S, 12S configurations, Quadcopter & Hexacopter dynamic geometries
 */

class MultirotorVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.batteryType = '6s'; // '3s', '4s', '6s', '12s'
    this.throttle = 0.55;
    this.roll = 0;
    this.pitch = 0;
    this.yaw = 0;
    this.rotorAngle = 0;
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    this.initGeometry();
    this.setupCanvas();
    this.initEvents();
    this.animate();
  }

  initGeometry() {
    if (this.batteryType === '3s' || this.batteryType === '4s') {
      // Quadcopter X-configuration (4 rotors)
      this.rotors = [
        { id: 1, angle: -Math.PI / 4, dir: 1, label: 'M1 (CCW)' },
        { id: 2, angle: Math.PI / 4, dir: -1, label: 'M2 (CW)' },
        { id: 3, angle: (3 * Math.PI) / 4, dir: 1, label: 'M3 (CCW)' },
        { id: 4, angle: (-3 * Math.PI) / 4, dir: -1, label: 'M4 (CW)' }
      ];
    } else {
      // Hexacopter (6 rotors, standard for 6S & 12S heavy-lift)
      this.rotors = [
        { id: 1, angle: -Math.PI / 6, dir: 1, label: 'M1 (CCW)' },
        { id: 2, angle: Math.PI / 6, dir: -1, label: 'M2 (CW)' },
        { id: 3, angle: Math.PI / 2, dir: 1, label: 'M3 (CCW)' },
        { id: 4, angle: (5 * Math.PI) / 6, dir: -1, label: 'M4 (CW)' },
        { id: 5, angle: (-5 * Math.PI) / 6, dir: 1, label: 'M5 (CCW)' },
        { id: 6, angle: -Math.PI / 2, dir: -1, label: 'M6 (CW)' }
      ];
    }
  }

  setBatteryType(type) {
    this.batteryType = type;
    this.initGeometry();
  }

  setThrottle(val) {
    this.throttle = Math.max(0.2, Math.min(1.0, val));
  }

  setupCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = Math.min(rect.width * 0.65, 340);

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.armLength = Math.min(this.width, this.height) * 0.33;
  }

  initEvents() {
    window.addEventListener('resize', () => this.setupCanvas());

    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.lastMouseX;
      const dy = e.clientY - this.lastMouseY;
      this.yaw += dx * 0.01;
      this.pitch = Math.max(-0.4, Math.min(0.4, this.pitch + dy * 0.008));
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });
  }

  draw() {
    const ctx = this.ctx;
    const isDark = document.documentElement.classList.contains('dark');
    ctx.clearRect(0, 0, this.width, this.height);

    this.rotorAngle += 0.28 * this.throttle;

    const cx = this.centerX;
    const cy = this.centerY;

    // Crosshairs
    ctx.save();
    ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 110, cy);
    ctx.lineTo(cx + 110, cy);
    ctx.moveTo(cx, cy - 110);
    ctx.lineTo(cx, cy + 110);
    ctx.stroke();
    ctx.restore();

    // Drone Body Matrix
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.yaw);

    // Arms
    this.rotors.forEach((rotor) => {
      const rx = Math.cos(rotor.angle) * this.armLength;
      const ry = Math.sin(rotor.angle) * this.armLength;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(rx, ry);
      ctx.strokeStyle = isDark ? '#334155' : '#475569';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Motor Mount
      ctx.beginPath();
      ctx.arc(rx, ry, 12, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#0f172a' : '#1e293b';
      ctx.fill();
      ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Spinning Propellers
      ctx.save();
      ctx.translate(rx, ry);
      ctx.rotate(this.rotorAngle * rotor.dir);

      ctx.beginPath();
      ctx.ellipse(0, 0, 27, 4.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(2, 132, 199, 0.35)';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-27, 0);
      ctx.lineTo(27, 0);
      ctx.strokeStyle = isDark ? '#7dd3fc' : '#0369a1';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dynamic Thrust Vector Arrow
      const thrustLen = 14 + this.throttle * 32;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -thrustLen);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Arrow head
      ctx.beginPath();
      ctx.moveTo(-4, -thrustLen + 6);
      ctx.lineTo(0, -thrustLen);
      ctx.lineTo(4, -thrustLen + 6);
      ctx.strokeStyle = '#10b981';
      ctx.stroke();

      ctx.restore();

      // Motor Label
      ctx.fillStyle = isDark ? '#94a3b8' : '#0f172a';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillText(`M${rotor.id}`, rx + 13, ry + 4);
    });

    // Central Core
    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
    ctx.fill();
    ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Directional Nose Arrow
    ctx.beginPath();
    ctx.moveTo(0, -23);
    ctx.lineTo(7, -11);
    ctx.lineTo(-7, -11);
    ctx.closePath();
    ctx.fillStyle = '#ef4444';
    ctx.fill();

    // Hub Text
    ctx.fillStyle = isDark ? '#f8fafc' : '#020617';
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.batteryType.toUpperCase() + ' UAV', 0, 4);

    ctx.restore();

    // Attitude HUD Overlay
    ctx.save();
    ctx.fillStyle = isDark ? '#38bdf8' : '#0369a1';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.fillText(`YAW: ${(this.yaw * (180 / Math.PI)).toFixed(1)}°`, 16, 22);
    ctx.fillText(`CONFIG: ${this.batteryType.toUpperCase()} (${this.rotors.length} ROTORS)`, 16, 38);
    ctx.fillText(`THROTTLE: ${Math.round(this.throttle * 100)}% HOVER`, 16, 54);
    ctx.restore();
  }

  animate() {
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

// 6-DOF IMU Oscilloscope Canvas
class IMUOscilloscope {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.points = [];
    this.maxPoints = 120;
    this.time = 0;

    this.setupCanvas();
    this.animate();
  }

  setupCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = Math.min(rect.width * 0.45, 180);

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.centerY = this.height / 2;
  }

  animate() {
    const ctx = this.ctx;
    const isDark = document.documentElement.classList.contains('dark');
    this.time += 0.05;

    const rawSignal = Math.sin(this.time * 2) * 24 + (Math.random() - 0.5) * 8;
    const kalmanFiltered = Math.sin(this.time * 2) * 24;

    this.points.push({ raw: rawSignal, filtered: kalmanFiltered });
    if (this.points.length > this.maxPoints) {
      this.points.shift();
    }

    ctx.clearRect(0, 0, this.width, this.height);

    ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(15, 23, 42, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, this.centerY);
    ctx.lineTo(this.width, this.centerY);
    ctx.stroke();

    const stepX = this.width / this.maxPoints;

    // Raw Noise Trace
    ctx.beginPath();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    this.points.forEach((pt, i) => {
      const x = i * stepX;
      const y = this.centerY + pt.raw;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Kalman Filtered Trace
    ctx.beginPath();
    ctx.strokeStyle = isDark ? '#22d3ee' : '#0284c7';
    ctx.lineWidth = 2;
    this.points.forEach((pt, i) => {
      const x = i * stepX;
      const y = this.centerY + pt.filtered;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#b45309';
    ctx.fillText('RAW NOISE', 12, 16);
    ctx.fillStyle = isDark ? '#22d3ee' : '#0284c7';
    ctx.fillText('KALMAN STATE', 95, 16);

    requestAnimationFrame(() => this.animate());
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.droneVis = new MultirotorVisualizer('droneCanvas');
  window.imuScope = new IMUOscilloscope('imuCanvas');
});
