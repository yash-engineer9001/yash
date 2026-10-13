/**
 * Yash Santosh Prasad - Portfolio Engine
 * Themes (Dark/Light), Interactive Drone Physics Calculator, System Architecture Inspector, Modals
 */

// Project database with exhaustive engineering details & tradeoffs
const PROJECTS_DATA = {
  aeromind: {
    title: "AeroMind: AI-Driven Multipurpose Autonomous UAV Platform",
    subtitle: "Bachelor's Thesis Project | National Conference Defense (CVR 2026)",
    period: "Aug 2025 – Dec 2025",
    supervisor: "Dr. Sagar V. Wankhede",
    tags: ["Autonomous UAV", "Edge AI", "YOLOv8", "ByteTrack", "Raspberry Pi 5", "LiDAR 360°", "Thermal Vision"],
    status: "Published at CVR 2026 & Patent Application Filed",
    overview: "Designed an edge-native multi-sensor perception stack enabling an autonomous UAV to achieve 360° obstacle avoidance, multi-object tracking, and hazard mapping in GPS-denied environments.",
    challenge: "Autonomous drones face severe memory bandwidth bottlenecks and compute throttling when executing multi-modal neural networks in real time on small, lightweight onboard microcomputers without active cooling overhead.",
    action: "Engineered a dual-stream synchronized vision pipeline coupling YOLOv8-nano with ByteTrack Kalman filter tracking on an embedded Raspberry Pi 5 (8GB). Integrated synchronized RGB and LWIR thermal camera streams alongside a 360° triangulation LiDAR array for real-time spatial occupancy grids and dynamic potential-field obstacle avoidance.",
    result: "Attained sub-20ms deterministic inference latency on edge hardware with zero frame dropping. Delivered autonomous collision-free waypoint tracking under turbulent GPS-denied flight tests. Led to an accepted paper at CVR 2026 (NIT Goa) and an Indian Patent Application under secrecy direction.",
    tradeoffs: "Selected quantized YOLOv8-nano over YOLOv8-medium to preserve 45% CPU headroom for flight telemetry and LiDAR point clustering. Chose 360° triangulation LiDAR over Time-of-Flight (ToF) for superior indoor optical contrast and lower power draw.",
    hardwareStack: ["Raspberry Pi 5 Core (8GB LPDDR4X)", "Triangulation 360° LiDAR Array (10Hz)", "Synchronized RGB + LWIR Thermal Camera", "Pixhawk 4 Flight Controller", "Telemetry Radio (433 MHz)"],
    softwareStack: ["Python 3.11", "OpenCV 4.x", "Ultralytics YOLOv8", "ByteTrack Tracker", "NumPy & SciPy", "MAVLink / pymavlink", "Linux ARM64 (Debian Bookworm)"]
  },
  stm32mp1: {
    title: "STM32MP1-Based Robot Communication System",
    subtitle: "Industrial R&D Project | iTech Robotics & Automation",
    period: "Jun 2025 – Sep 2025",
    tags: ["STM32MP1", "Heterogeneous ARM", "USB-over-IP", "Bash Automation", "Network Protocols", "Robotics"],
    status: "Production Deployed",
    overview: "Engineered a ruggedized, low-latency communication and onboard provisioning pipeline for industrial robot teleoperation, telemetric surveillance, and cross-platform control.",
    challenge: "Industrial robot initialization previously lacked a resilient, automated startup framework for sequential network onboarding across Wi-Fi and Ethernet interfaces, leading to frequent packet collisions and handshake drops with Android control consoles.",
    action: "Built and flashed a custom Linux distribution on an ARM-based STM32MP157 microprocessor (dual Cortex-A7 cores + real-time Cortex-M4). Authored robust Bash automation daemons to sequentially provision network interfaces, establish fail-safe socket listeners, and handle bi-directional handshakes with Android applications over USB-over-IP.",
    result: "Constructed a deterministic, ultra-lightweight control pipeline running over USB-over-IP, increasing system telemetry throughput by 30% and eliminating initialization pairing errors entirely.",
    tradeoffs: "Leveraged the dual-core Cortex-A7 for Linux networking and USB-over-IP daemon while reserving the Cortex-M4 co-processor for hard real-time PWM motor generation, preventing any Linux kernel scheduling jitter from affecting actuator safety.",
    hardwareStack: ["STM32MP157C Microprocessor (Dual Cortex-A7 @ 650MHz + Cortex-M4 @ 209MHz)", "Industrial Gigabit Ethernet PHY", "High-Gain 2.4/5GHz Wi-Fi Transceiver", "Optoisolated GPIO Interfaces"],
    softwareStack: ["Embedded C", "Linux Shell / Bash Daemons", "USB-over-IP Protocol Stack", "POSIX Socket Programming", "Android Communication API"]
  },
  assistive: {
    title: "Integrated Navigational Support Device for the Visually Impaired",
    subtitle: "Granted Indian Patent #436426-001 | Registered Copyright LD-20250169851",
    period: "Nov 2023 – Apr 2024",
    tags: ["Assistive Technology", "Embedded Computer Vision", "Patent Granted", "Edge AI", "SOS Telemetry"],
    status: "Granted National Patent & Official Copyright",
    overview: "Created a patented smart wearable mobility device integrating localized computer vision with safety beacons to empower visually impaired individuals with independent spatial navigation and emergency telemetry.",
    challenge: "Conventional assistive white canes lack dynamic spatial awareness and cannot proactively alert users to elevated hazards (e.g. overhanging branches, fast-approaching bicycles, or crosswalk misalignments).",
    action: "Trained and quantized lightweight computer vision models specialized in surface level transitions, pedestrian zebra crossings, and dynamic human safety hazard tracking. Designed ergonomic haptic and acoustic directional feedback arrays with an RF emergency SOS transmitter.",
    result: "Awarded a national Design Patent from the Intellectual Property of India (Design No: 436426-001) and an official registered Copyright (LD-20250169851). Validated through controlled indoor and outdoor pedestrian navigational trials.",
    tradeoffs: "Designed for tactile haptic vibrations rather than continuous synthetic speech to prevent masking critical environmental sound cues for visually impaired pedestrians.",
    hardwareStack: ["Microcontroller Unit Core", "Time-of-Flight (ToF) Distance Array", "Wide-Angle Optical Camera Sensor", "Dual Haptic ERM Actuators", "Long-Range RF SOS Transceiver"],
    softwareStack: ["Embedded C", "Quantized TensorFlow Lite for Microcontrollers", "OpenCV", "I2C / SPI Sensor Drivers", "Python Validation Pipeline"]
  },
  drone3kg: {
    title: "Heavy-Lift Autonomous Educational Drone (3 kg Payload)",
    subtitle: "R&D Prototype & Training Platform | iTech Robotics",
    period: "Jun 2025 – Jul 2025",
    tags: ["UAV Hardware", "Payload Engineering", "Flight Control", "Object Detection", "Mentorship"],
    status: "Field Tested & Workshop Delivered",
    overview: "Engineered a custom multirotor airframe configured to lift modular 3 kg logistical and sensory payloads while hosting onboard real-time visual target recognition.",
    challenge: "Heavy-lift educational multirotors frequently suffer from excessive frame vibration that destabilizes flight control IMUs and causes motion blur in onboard optical cameras.",
    action: "Designed custom CNC-cut carbon fiber motor plates, silicone vibration dampening gimbal mounts in Autodesk Fusion 360, tuned dual-loop PID flight stabilization, and integrated an onboard visual detection model.",
    result: "Achieved 72% live detection accuracy in turbulent outdoor field tests while carrying full 3 kg payload. Successfully organized and delivered an intensive 3-day drone technology workshop at MIT-WPU Pune, training over 10 engineering students.",
    tradeoffs: "Selected 15-inch carbon fiber folding propellers for maximum hover efficiency (g/W) over aggressive agility, maximizing battery flight duration under heavy payload constraints.",
    hardwareStack: ["Custom Carbon Fiber Hexacopter Airframe", "High-Torque 380KV BLDC Motors", "6S 10,000mAh LiPo Battery Pack", "Pixhawk 2.1 Cube Autopilot", "Onboard Embedded Vision Board"],
    softwareStack: ["ArduPilot / Mission Planner", "Python Computer Vision", "Autodesk Fusion 360", "Telemetry Log Analysis Tools"]
  }
};

// BibTeX Citations Database
const CITATIONS = {
  crc2026: `@incollection{wankhede2026logistics,
  author    = {Wankhede, Sagar and Choudhari, Shree and Prasad, Yash},
  title     = {An Extensive Exploration in Integration of Robotics to Amplify Efficiency within Logistics through Automated Storage and Retrieval Systems},
  booktitle = {Advances in Thermal System, Materials and Design Engineering},
  publisher = {CRC Press},
  pages     = {419--425},
  year      = {2026},
  doi       = {10.1201/9781003725022-73}
}`,
  cvr2026: `@inproceedings{wankhede2026aeromind,
  author    = {Wankhede, Sagar and Prasad, Yash and Choudhari, Shree and Mantri, Soham and Joshi, Ayush and Kadam, Prasad},
  title     = {Autonomous Modular Multi-Payload Aerial System with Adaptive AI Control Architecture},
  booktitle = {Proceedings of the 6th International Conference on Computer Vision and Robotics (CVR 2026)},
  series    = {Springer Scopus-Indexed Series},
  publisher = {Springer},
  year      = {2026},
  organization = {National Institute of Technology (NIT) Goa}
}`
};

// Architecture Nodes Deep-Dive Specs
const ARCH_SPECS = {
  lidar: {
    title: "360° Triangulation LiDAR Array",
    bus: "UART @ 115200 baud | 10 Hz Scan Rate",
    specs: "Triangulation laser ranging • 12m effective radius • Real-time 2D polar distance array • Direct serial ingestion into obstacle potential field buffer."
  },
  cameras: {
    title: "Synchronized Dual Camera Feeds (RGB + LWIR)",
    bus: "MIPI-CSI2 + USB 3.0 UVC | 30 FPS",
    specs: "Dual-stream synchronization: Optical 1080p RGB sensor for daytime detection + Long-Wave Infrared (LWIR) thermal sensor for night and foliage penetration."
  },
  rpi5: {
    title: "Raspberry Pi 5 Core (8GB) Edge Computer",
    bus: "Broadcom BCM2712 Quad-Core Cortex-A76 @ 2.4 GHz",
    specs: "Perception compute hub: Runs ONNX-quantized YOLOv8-nano + ByteTrack Kalman tracking. Maintains 18ms latency with under 45% CPU utilization."
  },
  pixhawk: {
    title: "Pixhawk Autopilot & MAVLink Controller",
    bus: "UART TELEM1 @ 921600 baud (MAVLink v2.0)",
    specs: "Receives dynamic obstacle velocity vectors from RPi 5 • Translates potential field trajectories into roll/pitch/yaw motor commands via high-rate PID loops."
  },
  cortex_a7: {
    title: "STM32MP1 Dual Cortex-A7 Linux Core",
    bus: "ARM Cortex-A7 Dual-Core @ 650 MHz",
    specs: "Executes embedded Linux OS, USB-over-IP daemon, network provisioning scripts, and secure Android socket endpoints."
  },
  cortex_m4: {
    title: "STM32MP1 Real-Time Cortex-M4 Co-Processor",
    bus: "ARM Cortex-M4 @ 209 MHz (RPMsg IPC)",
    specs: "Hard real-time deterministic subsystem: Generates high-frequency motor PWM waveforms, processes optical quadrature encoders, and executes fail-safe hardware watchdogs."
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initClock();
  initMobileMenu();
  initProjectFilters();
  initModalListeners();
  initCitationButtons();
  initCopyEmail();
  initContactForm();
  initDroneCalculator();
  initArchInspector();
  initResumeModal();
});

// Dual Theme Switcher (Dark & Light)
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-toggle-icon');

  // Check saved theme or default to 'dark'
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      if (themeIcon) {
        themeIcon.setAttribute('data-lucide', 'sun');
      }
    } else {
      document.documentElement.classList.remove('dark');
      if (themeIcon) {
        themeIcon.setAttribute('data-lucide', 'moon');
      }
    }
    localStorage.setItem('portfolio-theme', theme);
    if (window.lucide) lucide.createIcons();
  }

  applyTheme(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      const newTheme = isDark ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Theme switched to ${newTheme.toUpperCase()} mode`);
    });
  }
}

// Real-time IST Pune Clock
function initClock() {
  const clockEl = document.getElementById('ist-clock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const options = { timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const istTime = now.toLocaleTimeString('en-GB', options);
    clockEl.textContent = `${istTime} IST`;
  }
  update();
  setInterval(update, 1000);
}

// Mobile Menu
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');

  if (toggleBtn && menu) {
    toggleBtn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });

    const mobileLinks = menu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => menu.classList.add('hidden'));
    });
  }
}

// Project Category Filters
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category.includes(filter)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Project Modal Engine
function initModalListeners() {
  const modal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const detailButtons = document.querySelectorAll('[data-project-key]');

  function openProjectModal(key) {
    const data = PROJECTS_DATA[key];
    if (!data || !modal) return;

    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-subtitle').textContent = data.subtitle;
    document.getElementById('modal-period').textContent = data.period;
    document.getElementById('modal-status').textContent = data.status;
    document.getElementById('modal-overview').textContent = data.overview;
    document.getElementById('modal-challenge').textContent = data.challenge;
    document.getElementById('modal-action').textContent = data.action;
    document.getElementById('modal-result').textContent = data.result;
    document.getElementById('modal-tradeoffs').textContent = data.tradeoffs || "Optimized for latency and deterministic cycle times.";

    const hwList = document.getElementById('modal-hw-stack');
    hwList.innerHTML = '';
    data.hardwareStack.forEach(item => {
      const li = document.createElement('li');
      li.className = 'flex items-center gap-2 text-sm';
      li.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>${item}`;
      hwList.appendChild(li);
    });

    const swList = document.getElementById('modal-sw-stack');
    swList.innerHTML = '';
    data.softwareStack.forEach(item => {
      const li = document.createElement('li');
      li.className = 'flex items-center gap-2 text-sm';
      li.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>${item}`;
      swList.appendChild(li);
    });

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }

  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.dataset.projectKey;
      openProjectModal(key);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      closeProjectModal();
    }
  });
}

// Interactive Drone Physics & Multi-Battery Flight Sizing Calculator
function initDroneCalculator() {
  const payloadSlider = document.getElementById('calc-payload');
  const batterySlider = document.getElementById('calc-battery');
  const batteryButtons = document.querySelectorAll('.battery-select-btn');

  const valPayload = document.getElementById('calc-payload-val');
  const valBattery = document.getElementById('calc-battery-val');
  const resAuw = document.getElementById('calc-res-auw');
  const resTwr = document.getElementById('calc-res-twr');
  const resFlightTime = document.getElementById('calc-res-flight-time');
  const resPower = document.getElementById('calc-res-power');
  const batterySpecsDesc = document.getElementById('calc-battery-desc');

  if (!payloadSlider || !batterySlider) return;

  // Battery Profiles (3S, 4S, 6S, 12S)
  const BATTERY_PROFILES = {
    '3s': {
      voltage: 11.1,
      minMah: 1500,
      maxMah: 5000,
      defaultMah: 3000,
      maxPayload: 1.2,
      defaultPayload: 0.5,
      dryWeight: 0.85,
      maxThrust: 3.6, // 4x 900g
      weightPerAh: 0.08,
      desc: "3S LiPo (11.1V Nominal) • Light Trainer Quadcopter • 4x 920KV Motors (3.6 kg Total Thrust)"
    },
    '4s': {
      voltage: 14.8,
      minMah: 3000,
      maxMah: 8000,
      defaultMah: 5000,
      maxPayload: 2.0,
      defaultPayload: 1.0,
      dryWeight: 1.30,
      maxThrust: 6.4, // 4x 1600g
      weightPerAh: 0.105,
      desc: "4S LiPo (14.8V Nominal) • Aerial Survey Quadcopter • 4x 650KV Motors (6.4 kg Total Thrust)"
    },
    '6s': {
      voltage: 22.2,
      minMah: 5000,
      maxMah: 16000,
      defaultMah: 10000,
      maxPayload: 3.5,
      defaultPayload: 3.0,
      dryWeight: 2.40,
      maxThrust: 13.2, // 6x 2200g (Yash's R&D Hexacopter)
      weightPerAh: 0.135,
      desc: "6S LiPo (22.2V Nominal) • Heavy-Lift Hexacopter • 6x 380KV Motors (13.2 kg Total Thrust)"
    },
    '12s': {
      voltage: 44.4,
      minMah: 10000,
      maxMah: 25000,
      defaultMah: 16000,
      maxPayload: 8.0,
      defaultPayload: 5.0,
      dryWeight: 4.80,
      maxThrust: 27.0, // 6x 4500g
      weightPerAh: 0.260,
      desc: "12S LiPo (44.4V Nominal) • Industrial Heavy Payload UAV • 6x 170KV Motors (27.0 kg Total Thrust)"
    }
  };

  let currentBattery = '6s';

  function applyBatteryProfile(type) {
    currentBattery = type;
    const prof = BATTERY_PROFILES[type];
    if (!prof) return;

    // Update battery slider attributes
    batterySlider.min = prof.minMah;
    batterySlider.max = prof.maxMah;
    batterySlider.step = type === '3s' ? 250 : (type === '4s' ? 500 : 1000);
    batterySlider.value = prof.defaultMah;

    // Update payload slider attributes
    payloadSlider.max = prof.maxPayload;
    payloadSlider.value = Math.min(parseFloat(payloadSlider.value), prof.maxPayload);

    if (batterySpecsDesc) {
      batterySpecsDesc.textContent = prof.desc;
    }

    // Update buttons state
    batteryButtons.forEach(btn => {
      if (btn.dataset.battery === type) {
        btn.classList.add('active-battery');
        btn.classList.remove('text-slate-600', 'dark:text-slate-400');
      } else {
        btn.classList.remove('active-battery');
        btn.classList.add('text-slate-600', 'dark:text-slate-400');
      }
    });

    if (window.droneVis) {
      window.droneVis.setBatteryType(type);
    }

    calculate();
  }

  function calculate() {
    const prof = BATTERY_PROFILES[currentBattery];
    if (!prof) return;

    const payloadKg = parseFloat(payloadSlider.value);
    const batteryMah = parseFloat(batterySlider.value);

    valPayload.textContent = `${payloadKg.toFixed(1)} kg`;
    valBattery.textContent = `${batteryMah.toLocaleString()} mAh (${currentBattery.toUpperCase()})`;

    // Physics calculations
    const batteryWeightKg = (batteryMah / 1000) * prof.weightPerAh;
    const auwKg = prof.dryWeight + batteryWeightKg + payloadKg;
    const twr = prof.maxThrust / auwKg;

    // Hover power: ~165 W/kg for efficient low-KV carbon props
    const hoverPowerWatts = auwKg * 165;

    // Usable energy (Wh) with 80% Depth of Discharge
    const usableEnergyWh = (batteryMah / 1000) * prof.voltage * 0.80;
    const flightTimeMinutes = (usableEnergyWh / hoverPowerWatts) * 60;

    resAuw.textContent = `${auwKg.toFixed(2)} kg`;
    resTwr.textContent = `${twr.toFixed(2)}:1`;
    resPower.textContent = `${Math.round(hoverPowerWatts)} W`;
    resFlightTime.textContent = `${flightTimeMinutes.toFixed(1)} min`;

    if (twr < 1.45) {
      resTwr.classList.add('text-amber-500');
      resTwr.classList.remove('text-emerald-500', 'text-emerald-700');
    } else {
      resTwr.classList.add('text-emerald-600');
      resTwr.classList.remove('text-amber-500');
    }

    // Scale thrust in visualizer
    if (window.droneVis) {
      const hoverThrottle = Math.max(0.3, Math.min(0.9, 1.0 / twr));
      window.droneVis.setThrottle(hoverThrottle);
    }
  }

  batteryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      applyBatteryProfile(btn.dataset.battery);
    });
  });

  payloadSlider.addEventListener('input', calculate);
  batterySlider.addEventListener('input', calculate);

  applyBatteryProfile('6s');
}

// System Architecture Diagram Interactive Inspector
function initArchInspector() {
  const nodes = document.querySelectorAll('[data-arch-node]');
  const titleEl = document.getElementById('arch-inspector-title');
  const busEl = document.getElementById('arch-inspector-bus');
  const specsEl = document.getElementById('arch-inspector-specs');

  if (!nodes.length || !titleEl) return;

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      nodes.forEach(n => n.classList.remove('ring-2', 'ring-cyan-400'));
      node.classList.add('ring-2', 'ring-cyan-400');

      const key = node.dataset.archNode;
      const data = ARCH_SPECS[key];
      if (data) {
        titleEl.textContent = data.title;
        busEl.textContent = data.bus;
        specsEl.textContent = data.specs;
      }
    });
  });
}

// Resume Viewer Modal with Embedded Attached PDF
function initResumeModal() {
  const openBtns = document.querySelectorAll('.open-resume-btn');
  const modal = document.getElementById('resume-modal');
  const closeBtn = document.getElementById('resume-modal-close');
  const backdrop = document.getElementById('resume-modal-backdrop');

  if (!modal) return;

  function open() {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }

  openBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    open();
  }));

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (backdrop) backdrop.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      close();
    }
  });
}

// BibTeX Copy
function initCitationButtons() {
  const bibtexButtons = document.querySelectorAll('[data-citation-key]');
  bibtexButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.citationKey;
      const citationText = CITATIONS[key];
      if (citationText) {
        navigator.clipboard.writeText(citationText).then(() => {
          showToast('BibTeX citation copied to clipboard!');
        });
      }
    });
  });
}

// Copy Email
function initCopyEmail() {
  const copyButtons = document.querySelectorAll('.copy-email-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText('yashprasad2704@gmail.com').then(() => {
        showToast('Email copied: yashprasad2704@gmail.com');
      });
    });
  });
}

// Toast
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// Contact Form Trigger
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;

    const mailtoLink = `mailto:yashprasad2704@gmail.com?subject=${encodeURIComponent('[Engineering Inquiry] ' + subject)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;
    window.location.href = mailtoLink;
    showToast('Redirecting to your email client to send message...');
  });
}
