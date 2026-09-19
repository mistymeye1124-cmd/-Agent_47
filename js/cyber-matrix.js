/**
 * ==========================================================
 * CYBERNETIC MATRIX & NEURAL NET CANVAS (CALM & PROFESSIONAL)
 * ==========================================================
 * High-performance, serene cyber terminal atmosphere.
 * Designed to look like an elite cybersecurity operative workstation:
 * - Subtle, slow digital telemetry rain (non-distracting, calm flow)
 * - Faint cybernetic network grid nodes with gentle connection threads
 * - Low contrast & zero dizzying motion
 */

document.addEventListener('DOMContentLoaded', () => {
  initCyberMatrix();
});

function initCyberMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initDrops();
    initNodes();
  });

  // Calm, sparse digital rain setup
  const chars = '01λπΩ<>{}/*$#!?+-=01';
  const fontSize = 14;
  let columns = Math.floor(width / (fontSize * 1.8)); // Spaced out columns
  let drops = [];
  let dropSpeeds = [];

  function initDrops() {
    columns = Math.floor(width / (fontSize * 1.8));
    drops = [];
    dropSpeeds = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -(height / fontSize);
      dropSpeeds[i] = 0.35 + Math.random() * 0.45; // Very slow, gentle drift
    }
  }
  initDrops();

  // Gentle Cyber Nodes (Constellation / Neural Grid)
  const nodeCount = Math.min(38, Math.floor((width * height) / 38000));
  let nodes = [];

  function initNodes() {
    nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3, // Gentle, slow floating
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.8 + 1,
        alpha: Math.random() * 0.35 + 0.15
      });
    }
  }
  initNodes();

  // Mouse interaction coordinates
  let mouse = { x: -1000, y: -1000, active: false };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });
  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  let lastTime = 0;

  function render(time) {
    const delta = time - lastTime;
    lastTime = time;

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    // Translucent background fade (Light vs Dark)
    ctx.fillStyle = isLight ? 'rgba(248, 250, 252, 0.35)' : 'rgba(4, 7, 17, 0.28)';
    ctx.fillRect(0, 0, width, height);

    // 1. Draw subtle connecting threads between close cyber nodes
    for (let i = 0; i < nodes.length; i++) {
      const n1 = nodes[i];
      n1.x += n1.vx;
      n1.y += n1.vy;

      if (n1.x < 0 || n1.x > width) n1.vx *= -1;
      if (n1.y < 0 || n1.y > height) n1.vy *= -1;

      // Draw node dot
      ctx.beginPath();
      ctx.arc(n1.x, n1.y, n1.radius, 0, Math.PI * 2);
      ctx.fillStyle = isLight ? `rgba(79, 70, 229, ${n1.alpha * 0.7})` : `rgba(0, 240, 255, ${n1.alpha * 0.7})`;
      ctx.fill();

      // Connect with neighbor nodes if close
      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          const linkAlpha = (1 - dist / 130) * (isLight ? 0.18 : 0.12);
          ctx.strokeStyle = isLight ? `rgba(79, 70, 229, ${linkAlpha})` : `rgba(0, 240, 255, ${linkAlpha})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }

      // Gentle mouse interaction
      if (mouse.active) {
        const mDist = Math.hypot(n1.x - mouse.x, n1.y - mouse.y);
        if (mDist < 160) {
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(mouse.x, mouse.y);
          const mAlpha = (1 - mDist / 160) * (isLight ? 0.3 : 0.22);
          ctx.strokeStyle = isLight ? `rgba(2, 132, 199, ${mAlpha})` : `rgba(0, 255, 136, ${mAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // 2. Draw Calm, Slow Digital Glyphs (sparse columns)
    ctx.font = `${fontSize}px 'Fira Code', monospace`;

    for (let i = 0; i < drops.length; i++) {
      const colX = i * (fontSize * 1.8);
      const colY = drops[i] * fontSize;

      if (colY > 0 && colY < height) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        if (isLight) {
          ctx.fillStyle = (i % 3 === 0) 
            ? 'rgba(2, 132, 199, 0.35)' 
            : 'rgba(71, 85, 105, 0.28)';
        } else {
          ctx.fillStyle = (i % 3 === 0) 
            ? 'rgba(0, 240, 255, 0.28)' 
            : 'rgba(0, 255, 136, 0.22)';
        }
        
        ctx.fillText(char, colX, colY);
      }

      drops[i] += dropSpeeds[i] * 0.6; // Controlled, slow descent

      if (drops[i] * fontSize > height) {
        if (Math.random() > 0.94) {
          drops[i] = -Math.random() * 20;
        }
      }
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
