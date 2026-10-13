# Yash Santosh Prasad — Mechatronics & Autonomous Systems Portfolio

A portfolio website for **Yash Santosh Prasad**, Mechatronics Engineering Undergraduate graduating in July 2026. Specializing in **Autonomous UAV Systems, Edge Computer Vision, Embedded Linux (STM32MP1 / Raspberry Pi 5), and Industry 4.0 Shop-Floor Automation**.

---

## 🌟 Key Engineering Features & Graphics

1. **Embedded Official Resume PDF ("VIEW CV")**:
   - Integrates the 3-page resume PDF (`assets/Yash_Prasad_Resume.pdf`).
   - Built-in **Download PDF**, **Fullscreen (New Tab)**, and native browser viewer.

2. **De-Congested Layout & High-Contrast Light Theme**:
   - Streamlined, spacious navigation bar with generous padding to prevent text collision or overflow.
   - High-contrast typography (`#020617` and `#0f172a`) in Light Mode for sharp readability on all displays.
   - Dual-theme toggle (☀️ / 🌙) with persistent `localStorage` preference.

3. **Interactive Multi-Battery Drone Sizing Lab**:
   - Select between **3S (11.1V)**, **4S (14.8V)**, **6S (22.2V)**, and **12S (44.4V)** battery architectures.
   - Dynamically adapts:
     - Voltage & capacity sliders
     - Airframe geometry (quadcopter vs. hexacopter)
     - AUW (All-Up Weight), Thrust-to-Weight margin (TWR), hover power draw, and estimated hover flight endurance.
   - Real-time 3D/2D airframe kinematics with interactive mouse drag for Roll, Pitch, and Yaw.

4. **Multi-Depth Interactive Sensor Constellation (Hero Background)**:
   - High-fidelity particle mesh modeling SLAM landmarks and wireless sensor nodes with depth parallax.
   - Pulsing anchor beacons and interactive **sonar wave click ripples** that expand across the canvas.
   - Animated laser scanline sweep across the blueprint grid.

5. **AeroMind 360° LiDAR & 6-DOF IMU Oscilloscope**:
   - Interactive 2D Canvas simulator with **LiDAR 360° point cloud**, **YOLOv8 + ByteTrack object tracking**, and **LWIR Thermal Matrix**.
   - Real-time IMU waveform oscilloscope rendering raw accelerometer sensor noise against an Extended Kalman Filter (EKF) state estimate at 400 Hz.

6. **Verified Profiles**:
   - **LinkedIn:** [linkedin.com/in/yash-santosh-prasad](https://www.linkedin.com/in/yash-santosh-prasad)
   - **Google Scholar:** [citations?user=fC_KskgAAAAJ](https://scholar.google.com/citations?user=fC_KskgAAAAJ&hl=en)
   - **Email:** `yashprasad2704@gmail.com`
   - **Phone:** `+91 7276377359`

---

## 🚀 How to Run Locally

### Direct Browser Opening:
Double-click `index.html` to open it in Chrome, Edge, Safari, or Firefox.

### Using Node.js:
```bash
npm start
# or
npx serve . -p 3000
```
Open `http://localhost:3000` in your browser.
