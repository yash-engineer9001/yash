/**
 * Yash Santosh Prasad - Portfolio JavaScript
 * Mechatronics & Robotics Engineering Portfolio
 * Background: Engineering / Autonomous Systems / Robotics themed canvas
 */

document.addEventListener('DOMContentLoaded', () => {
  initEngineeringBackground();
  initStatsCounter();
  initIPFilter();
  initCopyButtons();
  initMobileNav();
  initResumeModal();
  initContactForm();
  initScrollTop();
});

/* --------------------------------------------------------------------------
   2. Engineering-Themed Animated Background Canvas
   Inspired by: circuit boards, drone flight paths, robotic arm joints,
                neural networks, autonomous system data flows, gear meshes
   -------------------------------------------------------------------------- */
function initEngineeringBackground() {
  const canvas = document.getElementById('mesh-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W = (canvas.width = window.innerWidth);
  let H = (canvas.height = window.innerHeight);
  let mouse = { x: W / 2, y: H / 2, active: false };
  let animFrame;
  let tick = 0;
  let isDark = true;

  function getIsDark() {
    const meta = document.querySelector('meta[name="color-scheme"]')?.content;
    if (meta === 'dark') return true;
    if (meta === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  triggerCanvasColorUpdate = () => { isDark = true; };
  isDark = true;

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    build();
  });
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
  });
  window.addEventListener('mouseleave', () => { mouse.active = false; });

  /* ---- Colour helpers ---- */
  function col(r, g, b, a) { return `rgba(${r},${g},${b},${a})`; }
  function brandA(a) { return isDark ? col(56, 189, 248, a) : col(2, 132, 199, a); }
  function accentA(a) { return isDark ? col(251, 191, 36, a) : col(217, 119, 6, a); }
  function greenA(a)  { return isDark ? col(52, 211, 153, a) : col(5, 150, 105, a); }

  /* ================================================================
     A) CIRCUIT NODES (small dots at grid intersections with traces)
     ================================================================ */
  const GRID = 90;
  let circuitNodes = [];

  function buildCircuit() {
    circuitNodes = [];
    const cols = Math.ceil(W / GRID) + 1;
    const rows = Math.ceil(H / GRID) + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() > 0.55) continue;      // sparse
        circuitNodes.push({
          x: c * GRID + (Math.random() - 0.5) * 20,
          y: r * GRID + (Math.random() - 0.5) * 20,
          r: Math.random() * 2.5 + 1,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.025,
          connected: []
        });
      }
    }
    // Connect nearby nodes to simulate traces
    for (let i = 0; i < circuitNodes.length; i++) {
      for (let j = i + 1; j < circuitNodes.length; j++) {
        const dx = circuitNodes[i].x - circuitNodes[j].x;
        const dy = circuitNodes[i].y - circuitNodes[j].y;
        if (Math.hypot(dx, dy) < GRID * 1.3 && Math.random() > 0.6) {
          circuitNodes[i].connected.push(j);
        }
      }
    }
  }

  function drawCircuit() {
    for (let i = 0; i < circuitNodes.length; i++) {
      const n = circuitNodes[i];
      n.pulse += n.pulseSpeed;
      const alpha = 0.08 + Math.sin(n.pulse) * 0.06;

      // Traces
      for (const j of n.connected) {
        const m = circuitNodes[j];
        ctx.beginPath();
        // Orthogonal traces (manhattan-style)
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(m.x, n.y);   // horizontal segment
        ctx.lineTo(m.x, m.y);   // vertical segment
        ctx.strokeStyle = brandA(alpha);
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Via / pad dot
      const dist = mouse.active ? Math.hypot(mouse.x - n.x, mouse.y - n.y) : 999;
      const highlight = dist < 120;
      ctx.beginPath();
      ctx.arc(n.x, n.y, highlight ? n.r + 1.5 : n.r, 0, Math.PI * 2);
      ctx.fillStyle = highlight ? brandA(0.9) : brandA(0.25 + Math.sin(n.pulse) * 0.15);
      ctx.fill();

      // Highlight ring on hover
      if (highlight) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 5, 0, Math.PI * 2);
        ctx.strokeStyle = brandA(0.3);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  /* ================================================================
     B) DRONE FLIGHT PATHS (Bezier curves with animated dot)
     ================================================================ */
  let drones = [];

  function buildDrones() {
    drones = [];
    const count = Math.min(4, Math.floor(W / 350));
    for (let i = 0; i < count; i++) {
      const p0 = { x: Math.random() * W, y: Math.random() * H };
      const p1 = { x: Math.random() * W, y: Math.random() * H };
      const cp0 = { x: Math.random() * W, y: Math.random() * H * 0.6 };
      const cp1 = { x: Math.random() * W, y: Math.random() * H * 0.6 + H * 0.3 };
      drones.push({
        p0, p1, cp0, cp1,
        t: Math.random(),
        speed: 0.0008 + Math.random() * 0.0006,
        trail: [],
        maxTrail: 60,
        wingAngle: 0,
        wingSpeed: 0.18 + Math.random() * 0.1,
        size: 7 + Math.random() * 4
      });
    }
  }

  function bezier(p0, cp0, cp1, p1, t) {
    const mt = 1 - t;
    return {
      x: mt*mt*mt*p0.x + 3*mt*mt*t*cp0.x + 3*mt*t*t*cp1.x + t*t*t*p1.x,
      y: mt*mt*mt*p0.y + 3*mt*mt*t*cp0.y + 3*mt*t*t*cp1.y + t*t*t*p1.y
    };
  }

  function drawDrones() {
    for (const d of drones) {
      d.t += d.speed;
      if (d.t > 1) {
        d.t = 0;
        d.trail = [];
        // Regenerate path
        d.p0 = { ...d.p1 };
        d.p1 = { x: Math.random() * W, y: Math.random() * H };
        d.cp0 = { x: Math.random() * W, y: Math.random() * H };
        d.cp1 = { x: Math.random() * W, y: Math.random() * H };
      }

      const pos = bezier(d.p0, d.cp0, d.cp1, d.p1, d.t);
      d.trail.push({ ...pos });
      if (d.trail.length > d.maxTrail) d.trail.shift();

      // Draw trail (fading)
      for (let i = 1; i < d.trail.length; i++) {
        const alpha = (i / d.trail.length) * 0.25;
        ctx.beginPath();
        ctx.moveTo(d.trail[i - 1].x, d.trail[i - 1].y);
        ctx.lineTo(d.trail[i].x, d.trail[i].y);
        ctx.strokeStyle = accentA(alpha);
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw drone body (simple quadcopter icon)
      d.wingAngle += d.wingSpeed;
      const { x, y, size } = { x: pos.x, y: pos.y, size: d.size };
      ctx.save();
      ctx.translate(x, y);

      // Arms
      ctx.strokeStyle = accentA(0.65);
      ctx.lineWidth = 1.5;
      for (let arm = 0; arm < 4; arm++) {
        const angle = (Math.PI / 4) + (arm * Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
        ctx.stroke();

        // Spinning propeller discs
        const px = Math.cos(angle) * size;
        const py = Math.sin(angle) * size;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(d.wingAngle + arm * Math.PI / 2);
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.65, size * 0.18, 0, 0, Math.PI * 2);
        ctx.strokeStyle = accentA(0.3);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      // Centre body
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fillStyle = accentA(0.85);
      ctx.fill();

      // LED blink
      if (Math.sin(tick * 0.08) > 0.5) {
        ctx.beginPath();
        ctx.arc(0, -2, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = greenA(0.9);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  /* ================================================================
     C) ROBOTIC ARM JOINTS (animated 2-link arm)
     ================================================================ */
  let robotArms = [];

  function buildRobotArms() {
    robotArms = [];
    const count = Math.min(3, Math.floor(W / 450));
    for (let i = 0; i < count; i++) {
      robotArms.push({
        x: (i + 1) * (W / (count + 1)),
        y: H * (0.6 + Math.random() * 0.3),
        l1: 55 + Math.random() * 25,
        l2: 40 + Math.random() * 20,
        theta1: Math.random() * Math.PI,
        theta2: Math.random() * Math.PI,
        omega1: (Math.random() - 0.5) * 0.008,
        omega2: (Math.random() - 0.5) * 0.012,
        toolAngle: 0
      });
    }
  }

  function drawRobotArms() {
    for (const arm of robotArms) {
      arm.theta1 += arm.omega1;
      arm.theta2 += arm.omega2;
      arm.toolAngle += 0.03;

      const j1x = arm.x + Math.cos(arm.theta1) * arm.l1;
      const j1y = arm.y + Math.sin(arm.theta1) * arm.l1;
      const j2x = j1x + Math.cos(arm.theta1 + arm.theta2) * arm.l2;
      const j2y = j1y + Math.sin(arm.theta1 + arm.theta2) * arm.l2;

      // Arm links
      ctx.strokeStyle = brandA(0.3);
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';

      ctx.beginPath(); ctx.moveTo(arm.x, arm.y); ctx.lineTo(j1x, j1y); ctx.stroke();
      ctx.strokeStyle = greenA(0.25);
      ctx.beginPath(); ctx.moveTo(j1x, j1y); ctx.lineTo(j2x, j2y); ctx.stroke();

      // Joint circles
      for (const [jx, jy, cr, col] of [
        [arm.x, arm.y, 6, brandA(0.5)],
        [j1x, j1y, 5, brandA(0.6)],
        [j2x, j2y, 4, greenA(0.7)]
      ]) {
        ctx.beginPath(); ctx.arc(jx, jy, cr, 0, Math.PI * 2);
        ctx.fillStyle = col; ctx.fill();
        ctx.strokeStyle = isDark ? col(10,16,30,0.5) : col(240,248,255,0.5);
        ctx.lineWidth = 1; ctx.stroke();
      }

      // End-effector gripper
      ctx.save();
      ctx.translate(j2x, j2y);
      ctx.rotate(arm.theta1 + arm.theta2 + arm.toolAngle * 0.1);
      ctx.strokeStyle = greenA(0.55);
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(-6, -8); ctx.lineTo(0, 0); ctx.lineTo(6, -8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-4, -6); ctx.lineTo(-4, 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(4, -6); ctx.lineTo(4, 2); ctx.stroke();
      ctx.restore();

      // Base mount
      ctx.fillStyle = brandA(0.3);
      ctx.fillRect(arm.x - 10, arm.y, 20, 8);
    }
  }

  /* ================================================================
     D) NEURAL NETWORK LAYER VISUALIZATION
     ================================================================ */
  let neuralNet = null;

  function buildNeuralNet() {
    const layers = [3, 5, 5, 3];
    const startX = W * 0.72;
    const layerGap = Math.min(80, W * 0.065);
    const nodes = [];
    const edges = [];

    for (let l = 0; l < layers.length; l++) {
      const count = layers[l];
      const totalH = (count - 1) * 55;
      const startY = H * 0.1 - totalH / 2;
      for (let n = 0; n < count; n++) {
        nodes.push({
          x: startX + l * layerGap,
          y: startY + n * 55,
          layer: l,
          idx: n,
          activation: Math.random(),
          phase: Math.random() * Math.PI * 2,
          speed: 0.015 + Math.random() * 0.01
        });
      }
    }

    // Connect consecutive layers
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[j].layer === nodes[i].layer + 1) {
          edges.push({ from: i, to: j, weight: Math.random() });
        }
      }
    }

    neuralNet = { nodes, edges, signalT: 0, signalSpeed: 0.004 };
  }

  function drawNeuralNet() {
    if (!neuralNet) return;
    const { nodes, edges } = neuralNet;
    neuralNet.signalT = (neuralNet.signalT + neuralNet.signalSpeed) % 1;

    // Edges
    for (const e of edges) {
      const a = nodes[e.from], b = nodes[e.to];
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = brandA(0.07 + e.weight * 0.08);
      ctx.lineWidth = e.weight * 1.2;
      ctx.stroke();

      // Animated signal dot
      const st = (neuralNet.signalT + e.from * 0.07) % 1;
      const sx = a.x + (b.x - a.x) * st;
      const sy = a.y + (b.y - a.y) * st;
      ctx.beginPath();
      ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = brandA(0.6 * Math.sin(st * Math.PI));
      ctx.fill();
    }

    // Nodes
    for (const n of nodes) {
      n.phase += n.speed;
      n.activation = 0.4 + Math.sin(n.phase) * 0.4;
      const r = 7 + n.activation * 4;
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = n.layer === 0 ? greenA(n.activation * 0.7) :
                      n.layer === 3 ? accentA(n.activation * 0.7) :
                      brandA(n.activation * 0.55);
      ctx.fill();
      ctx.strokeStyle = brandA(0.4);
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  /* ================================================================
     E) GEAR MESHES (rotating gears bottom-left)
     ================================================================ */
  let gears = [];

  function buildGears() {
    gears = [
      { x: W * 0.08, y: H * 0.85, r: 38, teeth: 12, angle: 0, speed: 0.006, dir: 1 },
      { x: W * 0.08 + 65, y: H * 0.85, r: 24, teeth: 8, angle: Math.PI / 8, speed: -0.009, dir: -1 },
      { x: W * 0.08 + 103, y: H * 0.85 - 10, r: 18, teeth: 6, angle: 0, speed: 0.012, dir: 1 }
    ];
  }

  function drawGear(cx, cy, outerR, innerR, teeth, angle) {
    ctx.beginPath();
    for (let i = 0; i < teeth * 2; i++) {
      const a = (i / (teeth * 2)) * Math.PI * 2 + angle;
      const r = i % 2 === 0 ? outerR : innerR;
      if (i === 0) ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      else ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.strokeStyle = brandA(0.3);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = brandA(0.07);
    ctx.fill();
    // Centre hub
    ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = brandA(0.5); ctx.fill();
    // Spokes
    for (let s = 0; s < 3; s++) {
      const sa = angle + (s / 3) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(sa) * 6, cy + Math.sin(sa) * 6);
      ctx.lineTo(cx + Math.cos(sa) * (outerR - 6), cy + Math.sin(sa) * (outerR - 6));
      ctx.strokeStyle = brandA(0.2);
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  function drawGears() {
    for (const g of gears) {
      g.angle += g.speed * g.dir;
      drawGear(g.x, g.y, g.r, g.r * 0.78, g.teeth, g.angle);
    }
  }

  /* ================================================================
     F) DATA STREAMS (vertical scan lines / sensor beams)
     ================================================================ */
  let beams = [];

  function buildBeams() {
    beams = [];
    const count = Math.min(5, Math.floor(W / 300));
    for (let i = 0; i < count; i++) {
      beams.push({
        x: Math.random() * W,
        y: 0,
        length: 60 + Math.random() * 100,
        speed: 1.2 + Math.random() * 1.5,
        alpha: 0.12 + Math.random() * 0.1,
        color: Math.random() > 0.5 ? 'brand' : 'green'
      });
    }
  }

  function drawBeams() {
    for (const b of beams) {
      b.y += b.speed;
      if (b.y > H + b.length) {
        b.y = -b.length;
        b.x = Math.random() * W;
      }
      const grad = ctx.createLinearGradient(b.x, b.y - b.length, b.x, b.y);
      const c = b.color === 'brand' ? brandA : greenA;
      grad.addColorStop(0, c(0));
      grad.addColorStop(1, c(b.alpha));
      ctx.fillStyle = grad;
      ctx.fillRect(b.x - 0.5, b.y - b.length, 1, b.length);
    }
  }

  /* ================================================================
     G) FLOATING ENGINEERING SYMBOLS / LABELS
     ================================================================ */
  const SYMBOLS = ['PID', 'ROS', 'IMU', 'CAD', 'PLC', 'AI', 'RL', '5G', 'PWM', 'CAN', 'I2C', 'SPI'];

  let floatSymbols = [];

  function buildFloatSymbols() {
    floatSymbols = SYMBOLS.map((s, i) => ({
      text: s,
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: 0.04 + Math.random() * 0.06,
      size: 11 + Math.random() * 7,
      phase: Math.random() * Math.PI * 2,
      speed: 0.008 + Math.random() * 0.006
    }));
  }

  function drawFloatSymbols() {
    ctx.font = `600 var(--size) 'JetBrains Mono', monospace`;
    for (const s of floatSymbols) {
      s.x += s.vx; s.y += s.vy; s.phase += s.speed;
      if (s.x < -40) s.x = W + 20;
      if (s.x > W + 40) s.x = -20;
      if (s.y < -20) s.y = H + 10;
      if (s.y > H + 20) s.y = -10;
      const a = s.alpha * (0.7 + Math.sin(s.phase) * 0.3);
      ctx.font = `600 ${s.size}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = brandA(a);
      ctx.fillText(s.text, s.x, s.y);
    }
  }

  /* ================================================================
     BUILD + ANIMATE
     ================================================================ */
  function build() {
    buildCircuit();
    buildDrones();
    buildRobotArms();
    buildNeuralNet();
    buildGears();
    buildBeams();
    buildFloatSymbols();
  }

  build();

  function animate() {
    tick++;
    isDark = true;

    ctx.clearRect(0, 0, W, H);

    // Background fill
    ctx.fillStyle = isDark ? 'rgba(10,14,23,0.92)' : 'rgba(248,250,252,0.90)';
    ctx.fillRect(0, 0, W, H);

    // Drawing layers (back to front)
    drawBeams();
    drawCircuit();
    drawFloatSymbols();
    drawNeuralNet();
    drawGears();
    drawRobotArms();
    drawDrones();

    animFrame = requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   3. Stats Counter Animation
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  function runCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    const unit = el.querySelector('.unit');
    const unitHTML = unit ? unit.outerHTML : '';
    const duration = 1400;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.innerHTML = current + unitHTML;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Use IntersectionObserver with threshold:0 so it fires immediately
  // if already visible; also add a 300ms timeout fallback for all
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      runCounter(entry.target);
    });
  }, { threshold: 0 });

  counters.forEach(c => {
    observer.observe(c);
    // Safety fallback: if observer never fires within 600ms, run anyway
    setTimeout(() => {
      if (c.dataset.target && c.textContent.trim() === c.dataset.target) return; // already ran
      if (c.innerHTML.includes('data-target') || parseInt(c.textContent) === 0) {
        observer.unobserve(c);
        runCounter(c);
      }
    }, 600);
  });
}

/* --------------------------------------------------------------------------
   4. IP / Patent Filter
   -------------------------------------------------------------------------- */
function initIPFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.ip-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.type === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Copy-to-Clipboard Buttons
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  document.querySelectorAll('[data-email]').forEach(btn => {
    btn.addEventListener('click', () => {
      fallbackCopy(btn.dataset.email, 'Email copied to clipboard!');
    });
  });
  document.querySelectorAll('[data-phone]').forEach(btn => {
    btn.addEventListener('click', () => {
      fallbackCopy(btn.dataset.phone, 'Phone number copied!');
    });
  });
}

function fallbackCopy(text, message) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showToast(message)).catch(() => legacyCopy(text, message));
  } else {
    legacyCopy(text, message);
  }
}

function legacyCopy(text, message) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.cssText = 'position:fixed;top:-9999px;opacity:0';
  document.body.appendChild(textArea);
  textArea.select();
  try { document.execCommand('copy'); showToast(message); }
  catch (err) { showToast('Failed to copy'); }
  document.body.removeChild(textArea);
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
  }, 2600);
}

/* --------------------------------------------------------------------------
   6. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const links = document.querySelectorAll('.mobile-link');

  if (!menuBtn || !drawer) return;

  function toggleMenu(isOpen) {
    menuBtn.setAttribute('aria-expanded', isOpen);
    drawer.setAttribute('aria-hidden', !isOpen);
    drawer.classList.toggle('active', isOpen);
  }

  menuBtn.addEventListener('click', () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    toggleMenu(!isExpanded);
  });

  links.forEach(link => { link.addEventListener('click', () => toggleMenu(false)); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') toggleMenu(false);
  });
}

/* --------------------------------------------------------------------------
   7. Resume Modal (Native <dialog> - fixed & working)
   -------------------------------------------------------------------------- */
function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  if (!modal) return;

  // Open modal on all trigger buttons
  document.querySelectorAll('.open-resume-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof modal.showModal === 'function') {
        // Reload the PDF source each time to prevent blank iframes
        const obj = modal.querySelector('object');
        if (obj) {
          const src = obj.getAttribute('data');
          obj.setAttribute('data', '');
          requestAnimationFrame(() => { obj.setAttribute('data', src); });
        }
        modal.showModal();
      } else {
        // Fallback: open PDF directly
        window.open('Yash_Prasad_Resume.pdf', '_blank');
      }
    });
  });

  // Light-dismiss: click outside the modal box closes it
  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    const isInsideBox = (
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top  && e.clientY <= rect.bottom
    );
    if (!isInsideBox) modal.close();
  });

  // ESC key is handled natively by <dialog>
}

/* --------------------------------------------------------------------------
   8. Contact Form
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('sender-name')?.value.trim();
    const email   = document.getElementById('sender-email')?.value.trim();
    const subject = document.getElementById('message-subject')?.value.trim() || 'Inquiry for Yash Santosh Prasad';
    const body    = document.getElementById('message-body')?.value.trim();

    if (!name || !email || !body) { showToast('Please fill in required fields.'); return; }

    const fullBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${body}`;
    const mailtoUrl = `mailto:yashprasad2704@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullBody)}`;
    showToast('Opening default email client...');
    window.location.href = mailtoUrl;
  });
}

/* --------------------------------------------------------------------------
   9. Scroll To Top
   -------------------------------------------------------------------------- */
function initScrollTop() {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
