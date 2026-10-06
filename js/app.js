/**
 * ==========================================================
 * MAIN APPLICATION CONTROLLER (AGENT 47 PLATFORM)
 * ==========================================================
 * Dynamically renders Bio, Skills, Learning Roadmap,
 * Resources Hub, Projects Showcase, Channels, VIP Club,
 * Contact, HUD Toast notifications, Web Audio Cyber SFX,
 * Scroll Progress, and Mobile Responsive Navigation.
 */

/* ==========================================================
   WEB AUDIO CYBER SFX ENGINE (ZERO ASSETS / ZERO 404s)
   ========================================================== */
const CyberSFX = (() => {
  let audioCtx = null;
  let isMuted = localStorage.getItem('app_sfx_enabled') !== 'true'; // Default muted for clean UX

  function getContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, type = 'sine', duration = 0.05, gainValue = 0.08) {
    if (isMuted) return;
    try {
      const ctx = getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(gainValue, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  return {
    click() {
      playTone(880, 'sine', 0.04, 0.05);
    },
    switch() {
      playTone(520, 'triangle', 0.06, 0.06);
      setTimeout(() => playTone(680, 'sine', 0.08, 0.06), 40);
    },
    success() {
      playTone(523.25, 'sine', 0.08, 0.07);
      setTimeout(() => playTone(659.25, 'sine', 0.08, 0.07), 70);
      setTimeout(() => playTone(783.99, 'sine', 0.14, 0.08), 140);
    },
    telemetry() {
      playTone(1050, 'sine', 0.03, 0.04);
    },
    toggle() {
      isMuted = !isMuted;
      localStorage.setItem('app_sfx_enabled', (!isMuted).toString());
      if (!isMuted) {
        this.success();
      }
      return !isMuted;
    },
    isEnabled() {
      return !isMuted;
    }
  };
})();

/* ==========================================================
   GLOBAL HUD TOAST NOTIFICATION SYSTEM
   ========================================================== */
function showPublicToast(msg, type = 'info') {
  let container = document.getElementById('hud-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'hud-toast-container';
    container.className = 'hud-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `hud-toast ${type}`;

  const iconName = type === 'success' 
    ? 'check-circle' 
    : type === 'warning' 
      ? 'exclamation-triangle' 
      : type === 'danger' 
        ? 'times-circle' 
        : 'info-circle';

  toast.innerHTML = `
    <i class="fas fa-${iconName}"></i>
    <span>${msg}</span>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  if (type === 'success') {
    CyberSFX.success();
  } else {
    CyberSFX.telemetry();
  }

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 3500);
}
window.showPublicToast = showPublicToast;

/* ==========================================================
   INITIALIZATION LIFECYCLE
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  renderAllPortfolioData();
  initTypewriter();
  initServicesInteractions();
  initSkillsInteractions();
  initLearningInteractions();
  initDiaryInteractions();
  initResourcesInteractions();
  initProjectsInteractions();
  initContactForm();
  initScrollSpy();
  initScrollProgressBar();
  initBackToTop();
  initMobileNavigation();
  initSecretAdminShortcut();
  initThemeToggle();
  initSFXToggle();
  initNavDotsMenu();
  initCopyEmail();

  // Storage listener for live updates from Admin Panel
  window.addEventListener('profileDataUpdated', () => {
    renderAllPortfolioData();
  });

  window.addEventListener('storage', (e) => {
    if (e.key === 'app_user_profile_data') {
      renderAllPortfolioData();
    }
  });
});

/* ==========================================================
   AUDIO SFX TOGGLE CONTROLLER
   ========================================================== */
function initSFXToggle() {
  const sfxBtn = document.getElementById('sfx-toggle-btn');
  const sfxIcon = document.getElementById('sfx-toggle-icon');
  const statusText = document.getElementById('sfx-status-text');
  const pillBadge = document.getElementById('sfx-pill-badge');

  function updateIcon(enabled) {
    if (sfxIcon) {
      sfxIcon.className = enabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    }
    if (sfxBtn) {
      if (enabled) {
        sfxBtn.classList.add('active');
        sfxBtn.title = 'Cyber SFX Audio: ACTIVE (Click to mute)';
      } else {
        sfxBtn.classList.remove('active');
        sfxBtn.title = 'Cyber SFX Audio: MUTED (Click to activate)';
      }
    }
    if (statusText) statusText.textContent = enabled ? 'Active Audio' : 'Muted';
    if (pillBadge) {
      pillBadge.textContent = enabled ? 'ON' : 'OFF';
      pillBadge.classList.toggle('active', enabled);
    }
  }

  updateIcon(CyberSFX.isEnabled());

  if (sfxBtn) {
    sfxBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const active = CyberSFX.toggle();
      updateIcon(active);
      showPublicToast(active ? 'Cyber Audio SFX Activated 🔊' : 'Audio SFX Muted 🔇', 'info');
    });
  }
}

/* ==========================================================
   THEME SWITCHER CONTROLLER (LIGHT / DARK)
   ========================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const icon = document.getElementById('theme-toggle-icon');
  const statusText = document.getElementById('theme-status-text');
  const pillBadge = document.getElementById('theme-pill-badge');

  function updateIcon(theme) {
    if (icon) {
      if (theme === 'light') {
        icon.className = 'fas fa-sun';
        icon.style.color = '#d97706';
      } else {
        icon.className = 'fas fa-moon';
        icon.style.color = '#00f0ff';
      }
    }
    if (statusText) statusText.textContent = theme === 'light' ? 'Light Studio' : 'Dark Cyber';
    if (pillBadge) {
      pillBadge.textContent = theme === 'light' ? 'LIGHT' : 'DARK';
      pillBadge.classList.toggle('active', theme === 'light');
    }
  }

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  updateIcon(currentTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      CyberSFX.switch();
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = activeTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('app_theme', newTheme);
      updateIcon(newTheme);
      showPublicToast(`Theme switched to ${newTheme.toUpperCase()} mode`, 'info');
    });
  }
}

/* ==========================================================
   3-DOT QUICK MENU & PREFERENCES CONTROLLER
   ========================================================== */
function initNavDotsMenu() {
  const dotsBtn = document.getElementById('nav-dots-btn');
  const dropdown = document.getElementById('nav-dots-dropdown');
  if (!dotsBtn || !dropdown) return;

  dotsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    CyberSFX.click();
    const isOpen = dropdown.classList.toggle('open');
    dotsBtn.classList.toggle('active', isOpen);
  });

  // Close when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && !dotsBtn.contains(e.target)) {
      dropdown.classList.remove('open');
      dotsBtn.classList.remove('active');
    }
  });

  // Close when clicking any nav link row inside the dropdown
  const links = dropdown.querySelectorAll('.dropdown-nav-row, .dropdown-admin-link');
  links.forEach(l => {
    l.addEventListener('click', () => {
      CyberSFX.click();
      dropdown.classList.remove('open');
      dotsBtn.classList.remove('active');
    });
  });
}

/* ==========================================================
   MOBILE NAVIGATION CONTROLLER
   ========================================================== */
function initMobileNavigation() {
  const hamburger = document.getElementById('nav-hamburger');
  const drawer = document.getElementById('mobile-nav-drawer');
  const backdrop = document.getElementById('mobile-nav-backdrop');
  const closeBtn = document.getElementById('mobile-nav-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const mobileAiTrigger = document.getElementById('mobile-ai-trigger');

  function openDrawer() {
    CyberSFX.click();
    if (drawer) drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    if (hamburger) hamburger.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    if (hamburger) hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      CyberSFX.click();
      closeDrawer();
    });
  });

  if (mobileAiTrigger) {
    mobileAiTrigger.addEventListener('click', () => {
      closeDrawer();
      const chatToggleBtn = document.getElementById('floating-assistant-btn');
      if (chatToggleBtn) chatToggleBtn.click();
    });
  }
}

/* ==========================================================
   SCROLL READING PROGRESS BAR & BACK TO TOP
   ========================================================== */
function initScrollProgressBar() {
  const progressBar = document.getElementById('scroll-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }, { passive: true });
}

function initBackToTop() {
  const btn = document.getElementById('back-to-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    CyberSFX.click();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================
   COPY EMAIL TO CLIPBOARD
   ========================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('btn-copy-email');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const data = getProfileData();
    const email = data.personal?.email || 'agent47@agency.net';

    navigator.clipboard.writeText(email).then(() => {
      const origHtml = copyBtn.innerHTML;
      copyBtn.innerHTML = `<i class="fas fa-check"></i> <span>Copied!</span>`;
      copyBtn.style.borderColor = 'var(--success)';
      copyBtn.style.color = '#00ff88';

      showPublicToast(`Copied ${email} to clipboard!`, 'success');

      setTimeout(() => {
        copyBtn.innerHTML = origHtml;
        copyBtn.style.borderColor = '';
        copyBtn.style.color = '';
      }, 2500);
    }).catch(() => {
      showPublicToast(`Email: ${email}`, 'info');
    });
  });
}

/* ==========================================================
   PORTFOLIO DATA RENDERING PIPELINE
   ========================================================== */
function renderAllPortfolioData() {
  const data = getProfileData();
  initHeroAndBio(data);
  renderServicesGrid(data);
  renderSkillsGrid(data);
  renderTrackerMetrics(data);
  renderLearningRoadmap(data);
  renderWorkLogs(data);
  renderDiaryGrid(data);
  renderResourcesGrid(data);
  renderProjects(data);
  renderChannels(data);
  renderVIPCommunity(data);
}

/* ==========================================================
   HERO & BIO POPULATION
   ========================================================== */
function initHeroAndBio(data) {
  const p = data.personal;
  if (!p) return;

  const heroNameEl = document.getElementById('hero-name');
  if (heroNameEl) heroNameEl.textContent = p.name;

  const brandNameEl = document.getElementById('brand-name');
  if (brandNameEl) brandNameEl.textContent = p.name;

  const heroDescEl = document.getElementById('hero-description');
  if (heroDescEl) heroDescEl.textContent = p.shortBio;

  const statusTextEl = document.getElementById('status-text');
  if (statusTextEl && p.status) statusTextEl.textContent = p.status.text;

  const cardNameEl = document.getElementById('card-name');
  if (cardNameEl) cardNameEl.textContent = p.name;

  const cardTitleEl = document.getElementById('card-title');
  if (cardTitleEl) cardTitleEl.textContent = p.title;

  const cardAvatarEl = document.getElementById('card-avatar');
  if (cardAvatarEl && p.avatarUrl) cardAvatarEl.src = p.avatarUrl;

  // Stats Grid in Hero Card
  const statsContainer = document.getElementById('profile-stats-grid');
  if (statsContainer && p.stats) {
    statsContainer.innerHTML = p.stats.map(stat => `
      <div class="metric-item">
        <div class="metric-number">${stat.value}</div>
        <div class="metric-label">${stat.label}</div>
      </div>
    `).join('');
  }

  // Social Links in Hero
  const heroSocialsEl = document.getElementById('hero-socials');
  if (heroSocialsEl && p.socials) {
    heroSocialsEl.innerHTML = p.socials.map(s => `
      <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="social-icon-btn" title="${s.name}" onclick="CyberSFX.click()">
        <i class="${s.icon}"></i>
      </a>
    `).join('');
  }

  // About Story
  const aboutStoryEl = document.getElementById('about-story-content');
  if (aboutStoryEl && p.aboutStory) {
    const paragraphs = p.aboutStory.trim().split('\n\n');
    aboutStoryEl.innerHTML = paragraphs.map(para => `<p>${para.trim()}</p>`).join('');
  }

  // Contact Info Column
  const contactEmailEl = document.getElementById('contact-email-val');
  if (contactEmailEl) {
    contactEmailEl.textContent = p.email;
    contactEmailEl.href = `mailto:${p.email}`;
  }

  const contactLocationEl = document.getElementById('contact-location-val');
  if (contactLocationEl) contactLocationEl.textContent = p.location;
}

/* ==========================================================
   DYNAMIC TYPEWRITER
   ========================================================== */
let typewriterTimeout = null;

function initTypewriter() {
  const typingEl = document.getElementById('typing-role');
  if (!typingEl) return;

  const data = getProfileData();
  const roles = (data.personal && data.personal.roles && data.personal.roles.length) 
    ? data.personal.roles 
    : ["Full Stack Developer", "AI Systems Architect", "Security Operative"];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  if (typewriterTimeout) clearTimeout(typewriterTimeout);

  function type() {
    const currentData = getProfileData();
    const currentRoles = (currentData.personal && currentData.personal.roles && currentData.personal.roles.length) 
      ? currentData.personal.roles 
      : roles;

    if (roleIdx >= currentRoles.length) roleIdx = 0;
    const currentRole = currentRoles[roleIdx];

    if (isDeleting) {
      typingEl.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 50;
    } else {
      typingEl.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 110;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      typingSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % currentRoles.length;
      typingSpeed = 400;
    }

    typewriterTimeout = setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================
   SKILLS MATRIX
   ========================================================== */
let activeSkillCategory = 'all';
let skillSearchQuery = '';

function renderSkillsGrid(data) {
  const skillsContainer = document.getElementById('skills-grid');
  if (!skillsContainer) return;

  const skillsList = data.skills || [];
  let filtered = skillsList.filter(skill => {
    let matchesCat = false;
    if (activeSkillCategory === 'all') matchesCat = true;
    else if (activeSkillCategory === 'core') matchesCat = (skill.importance === 'core');
    else if (activeSkillCategory === 'secondary') matchesCat = (skill.importance === 'secondary');
    else if (activeSkillCategory === 'optional') matchesCat = (skill.importance === 'optional');
    else matchesCat = (skill.category === activeSkillCategory);

    const matchesSearch = skill.name.toLowerCase().includes(skillSearchQuery.toLowerCase()) ||
                          skill.badge.toLowerCase().includes(skillSearchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    skillsContainer.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-dim);">
        <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 12px; display: block;"></i>
        No skills found matching "${skillSearchQuery}".
      </div>
    `;
    return;
  }

  skillsContainer.innerHTML = filtered.map(skill => {
    const isCore = skill.importance === 'core';
    const isOptional = skill.importance === 'optional';

    return `
      <div class="skill-card ${isCore ? 'skill-card-core' : ''}">
        <div class="skill-card-top">
          <div class="skill-icon-name">
            <div class="skill-icon-wrap" style="${isCore ? 'background: rgba(245, 158, 11, 0.15); border-color: rgba(245, 158, 11, 0.4); color: #fbbf24;' : ''}">
              <i class="${skill.icon}"></i>
            </div>
            <div>
              <span class="skill-title">${skill.name}</span>
              ${isCore ? `<span style="display: block; font-size: 0.68rem; font-weight: 700; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fas fa-star"></i> Core Stack</span>` : ''}
              ${isOptional ? `<span style="display: block; font-size: 0.68rem; color: var(--text-dim); text-transform: uppercase;">Optional</span>` : ''}
            </div>
          </div>
          <span class="skill-badge">${skill.badge}</span>
        </div>
        <div class="skill-progress-wrap">
          <div class="skill-progress-bar">
            <div class="skill-progress-fill" style="width: ${skill.level}%; ${isCore ? 'background: linear-gradient(135deg, #fbbf24, #f59e0b);' : ''}"></div>
          </div>
          <div class="skill-percent-text">
            <span>Proficiency: ${skill.level}%</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function initSkillsInteractions() {
  const tabs = document.querySelectorAll('.skills-filter-tabs .filter-tab');
  const searchInput = document.getElementById('skills-search');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      CyberSFX.click();
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeSkillCategory = tab.getAttribute('data-category');
      renderSkillsGrid(getProfileData());
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      skillSearchQuery = e.target.value.trim();
      renderSkillsGrid(getProfileData());
    });
  }
}

/* ==========================================================
   SERVICES & BUSINESS SOLUTIONS (FOR CLIENTS & COMPANIES)
   ========================================================== */
function renderServicesGrid(data) {
  const container = document.getElementById('services-grid');
  if (!container) return;

  const services = data.services || [];
  if (services.length === 0) {
    container.innerHTML = `<p style="color: var(--text-dim); text-align: center; grid-column: 1/-1;">No business services configured yet.</p>`;
    return;
  }

  container.innerHTML = services.map(s => `
    <div class="service-card">
      <div class="service-card-header">
        <div class="service-icon-wrap">
          <i class="${s.icon || 'fas fa-briefcase'}"></i>
        </div>
        <span class="service-badge">${s.badge || 'Available'}</span>
      </div>
      <h3 class="service-title">${s.title}</h3>
      <p class="service-desc">${s.description}</p>
      
      ${(s.deliverables && s.deliverables.length) ? `
        <div class="service-deliverables">
          <div class="service-deliverables-title"><i class="fas fa-check-double"></i> Core Deliverables:</div>
          <ul class="service-deliverables-list">
            ${s.deliverables.map(d => `<li><i class="fas fa-arrow-right"></i> <span>${d}</span></li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <div class="service-footer">
        <span class="service-turnaround"><i class="fas fa-bolt"></i> Est: ${s.turnaround || '1 - 2 Weeks'}</span>
        <a href="#contact" class="btn-service-inquire" onclick="handleServiceInquire('${s.title.replace(/'/g, "\\'")}')">
          <span>Inquire</span> <i class="fas fa-chevron-right"></i>
        </a>
      </div>
    </div>
  `).join('');
}

window.handleServiceInquire = function(serviceTitle) {
  CyberSFX.click();
  const subjectInput = document.getElementById('contact-subject');
  if (subjectInput) {
    subjectInput.value = `Project Inquiry: ${serviceTitle}`;
  }
  const msgInput = document.getElementById('contact-message');
  if (msgInput && !msgInput.value) {
    msgInput.value = `Hello! I would like to discuss a project regarding "${serviceTitle}". Let's connect on scope, timeline, and deliverables.`;
  }
};

function initServicesInteractions() {
  const consultBtn = document.getElementById('services-ai-consult-btn');
  if (consultBtn) {
    consultBtn.addEventListener('click', () => {
      const chatTrigger = document.getElementById('floating-assistant-btn');
      if (chatTrigger) chatTrigger.click();
      const chatInput = document.getElementById('chat-input-field');
      if (chatInput) {
        chatInput.value = "Tell me about your available services and how we can work together on a project.";
      }
    });
  }
}

/* ==========================================================
   WORK TRACKER & LEARNING ROADMAP
   ========================================================== */
let activeLearningCategory = 'all';

function renderTrackerMetrics(data) {
  const container = document.getElementById('tracker-metrics-ribbon');
  if (!container) return;

  const roadmaps = data.learningRoadmap || [];
  const logs = data.workLogs || [];
  
  let totalHours = logs.reduce((acc, l) => {
    const num = parseFloat(l.hours) || 0;
    return acc + num;
  }, 0);
  
  roadmaps.forEach(r => {
    if (r.hoursLogged) totalHours += (parseFloat(r.hoursLogged) || 0);
  });

  let totalMilestones = 0;
  let doneMilestones = 0;
  roadmaps.forEach(r => {
    if (r.milestones && r.milestones.length) {
      totalMilestones += r.milestones.length;
      doneMilestones += r.milestones.filter(m => m.done).length;
    }
  });

  const activeGoalsCount = roadmaps.filter(r => (r.progress || 0) < 100).length;

  container.innerHTML = `
    <div class="tracker-metric-chip">
      <div class="metric-chip-icon icon-hours"><i class="fas fa-stopwatch"></i></div>
      <div class="metric-chip-info">
        <span class="chip-val">${totalHours > 0 ? totalHours.toFixed(1) + ' hrs' : '150+ hrs'}</span>
        <span class="chip-lbl">Execution Time Tracked</span>
      </div>
    </div>

    <div class="tracker-metric-chip">
      <div class="metric-chip-icon icon-milestones"><i class="fas fa-tasks"></i></div>
      <div class="metric-chip-info">
        <span class="chip-val">${doneMilestones > 0 ? doneMilestones + '/' + totalMilestones : '12+ Done'}</span>
        <span class="chip-lbl">Verified Milestones</span>
      </div>
    </div>

    <div class="tracker-metric-chip">
      <div class="metric-chip-icon icon-velocity"><i class="fas fa-fire"></i></div>
      <div class="metric-chip-info">
        <span class="chip-val">${activeGoalsCount} Active</span>
        <span class="chip-lbl">In-Flight Roadmaps</span>
      </div>
    </div>

    <div class="tracker-metric-chip">
      <div class="metric-chip-icon icon-streak"><i class="fas fa-calendar-check"></i></div>
      <div class="metric-chip-info">
        <span class="chip-val">${logs.length > 0 ? logs.length + ' Logs' : 'Daily'}</span>
        <span class="chip-lbl">Work Activity Stream</span>
      </div>
    </div>
  `;
}

function renderLearningRoadmap(data) {
  const container = document.getElementById('learning-grid');
  if (!container) return;

  const items = data.learningRoadmap || [];
  let filtered = items.filter(item => {
    if (activeLearningCategory === 'all') return true;
    if (activeLearningCategory === 'exploring') return (item.badge || '').toLowerCase().includes('exploring') || (item.badge || '').toLowerCase().includes('started');
    if (activeLearningCategory === 'progress') return (item.badge || '').toLowerCase().includes('progress');
    if (activeLearningCategory === 'near') return (item.badge || '').toLowerCase().includes('near') || (item.progress >= 85);
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<p style="color: var(--text-dim); text-align: center; grid-column: 1/-1;">No learning roadmap items found for this category.</p>`;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="learning-card">
      <div>
        <div class="learning-card-top">
          <span class="learning-badge">${item.badge}</span>
          ${item.hoursLogged ? `<span class="learning-hours-badge"><i class="fas fa-clock"></i> ${item.hoursLogged}h</span>` : ''}
        </div>
        <h3 class="learning-title">${item.title}</h3>
        <p class="learning-desc">${item.description}</p>
      </div>

      ${(item.milestones && item.milestones.length) ? `
        <div class="learning-milestones-box">
          <div class="milestones-header-label">
            <span><i class="fas fa-list-check"></i> Key Milestones:</span>
            <span>${item.milestones.filter(m => m.done).length}/${item.milestones.length} Done</span>
          </div>
          <ul class="milestones-list">
            ${item.milestones.map(m => `
              <li class="milestone-item ${m.done ? 'completed' : 'pending'}">
                <i class="${m.done ? 'fas fa-check-circle' : 'far fa-circle'}"></i>
                <span>${m.title}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      <div>
        <div class="learning-progress-wrap">
          <div class="learning-progress-label">
            <span>Roadmap Mastery</span>
            <span>${item.progress}%</span>
          </div>
          <div class="skill-progress-bar">
            <div class="skill-progress-fill" style="width: ${item.progress}%; background: var(--grad-cyan);"></div>
          </div>
        </div>

        <div class="learning-tags">
          ${(item.tags || []).map(t => `<span class="learning-tag-pill">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function initLearningInteractions() {
  const tabs = document.querySelectorAll('#learning-filter-tabs .filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      CyberSFX.click();
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeLearningCategory = tab.getAttribute('data-learn-cat');
      renderLearningRoadmap(getProfileData());
    });
  });
}

function renderWorkLogs(data) {
  const container = document.getElementById('work-logs-timeline');
  if (!container) return;

  const logs = data.workLogs || [];
  if (logs.length === 0) {
    container.innerHTML = `<p style="color: var(--text-dim); text-align: center;">No activity logs recorded yet. Add your first study log in Admin Studio!</p>`;
    return;
  }

  container.innerHTML = logs.map((log, idx) => `
    <div class="work-log-item">
      <div class="log-indicator">
        <div class="log-dot"></div>
        ${idx < logs.length - 1 ? `<div class="log-line"></div>` : ''}
      </div>
      <div class="work-log-card">
        <div class="work-log-card-header">
          <div class="log-meta">
            <span class="log-date"><i class="far fa-calendar-alt"></i> ${log.date}</span>
            <span class="log-category-pill">${log.category || 'General'}</span>
            ${log.hours ? `<span class="log-hours-pill"><i class="fas fa-hourglass-half"></i> ${log.hours}</span>` : ''}
          </div>
          <span class="log-status-badge ${log.status === 'Completed' ? 'status-completed' : 'status-wip'}">
            <i class="${log.status === 'Completed' ? 'fas fa-check' : 'fas fa-sync-alt fa-spin'}"></i>
            ${log.status || 'Completed'}
          </span>
        </div>
        <h4 class="work-log-title">${log.title}</h4>
        <p class="work-log-desc">${log.description}</p>
        ${log.proofUrl && log.proofUrl !== '#' ? `
          <div class="work-log-proof">
            <a href="${log.proofUrl}" target="_blank" rel="noopener noreferrer" class="btn-proof-link" onclick="CyberSFX.click()">
              <i class="fab fa-github"></i> <span>View Code / Proof</span> <i class="fas fa-external-link-alt"></i>
            </a>
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');
}

/* ==========================================================
   MY DIARY & PERSONAL REFLECTIONS (মনের কথা)
   ========================================================== */
let activeDiaryTag = 'all';
let diarySearchTerm = '';

function escapeDiaryHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderDiaryGrid(data) {
  const container = document.getElementById('diary-grid');
  if (!container) return;

  const rawEntries = data.diaryEntries || [];
  // STRICT PRIVACY PROTOCOL: ONLY render entries where isPublic === true
  const publicEntries = rawEntries.filter(entry => entry.isPublic === true);

  if (publicEntries.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; background: rgba(255,255,255,0.02); border: 1px dashed var(--bg-card-border); border-radius: 16px;">
        <i class="fas fa-book-open" style="font-size: 2.2rem; color: #a855f7; margin-bottom: 14px;"></i>
        <h4 style="font-size: 1.15rem; margin-bottom: 8px;">No Public Diary Entries Yet</h4>
        <p style="color: var(--text-muted); font-size: 0.9rem; max-width: 480px; margin: 0 auto 18px;">
          Personal thoughts written in Admin Studio with the "🌐 Public" tag will appear here. All private thoughts remain confidential.
        </p>
        <a href="admin.html" class="btn-primary btn-sm" target="_blank" style="display: inline-flex; align-items: center; gap: 8px;">
          <i class="fas fa-pen-nib"></i> <span>Write First Entry</span>
        </a>
      </div>
    `;
    return;
  }

  // Filter by tag and search term
  const filtered = publicEntries.filter(entry => {
    const matchesTag = activeDiaryTag === 'all' || 
      (entry.tags && entry.tags.some(t => t.toLowerCase() === activeDiaryTag.toLowerCase())) ||
      (entry.mood && entry.mood.toLowerCase().includes(activeDiaryTag.toLowerCase()));

    const matchesSearch = !diarySearchTerm || 
      (entry.title && entry.title.toLowerCase().includes(diarySearchTerm)) ||
      (entry.content && entry.content.toLowerCase().includes(diarySearchTerm)) ||
      (entry.mood && entry.mood.toLowerCase().includes(diarySearchTerm)) ||
      (entry.tags && entry.tags.some(t => t.toLowerCase().includes(diarySearchTerm)));

    return matchesTag && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px;">
        <p style="color: var(--text-muted); font-size: 0.95rem;">No reflections match your search or filter.</p>
      </div>
    `;
    return;
  }

  // Sort descending by date (newest first)
  filtered.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  container.innerHTML = filtered.map(entry => {
    const tagsHtml = (entry.tags || []).map(t => `<span class="diary-tag-pill">#${escapeDiaryHtml(t)}</span>`).join('');
    const moodBadge = entry.mood ? `<span class="diary-mood-badge">${escapeDiaryHtml(entry.mood)}</span>` : '';
    
    return `
      <article class="diary-card" data-diary-id="${escapeDiaryHtml(entry.id)}" tabindex="0" role="button" aria-label="Read reflection: ${escapeDiaryHtml(entry.title)}">
        <div class="diary-card-header">
          <div class="diary-date">
            <i class="fas fa-calendar-day"></i>
            <span>${escapeDiaryHtml(entry.date || 'Undated')}</span>
          </div>
          ${moodBadge}
        </div>
        <h3 class="diary-title">${escapeDiaryHtml(entry.title)}</h3>
        <p class="diary-snippet">${escapeDiaryHtml(entry.content)}</p>
        <div class="diary-footer">
          <div class="diary-tags">${tagsHtml}</div>
          <div class="diary-read-more">
            <span>Read Note</span>
            <i class="fas fa-arrow-right"></i>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Attach card click handlers for the reader modal
  container.querySelectorAll('.diary-card').forEach(card => {
    const id = card.getAttribute('data-diary-id');
    const entry = publicEntries.find(e => e.id === id);
    if (!entry) return;

    function openModal() {
      CyberSFX.click();
      openDiaryReaderModal(entry);
    }

    card.addEventListener('click', openModal);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal();
      }
    });
  });
}

function openDiaryReaderModal(entry) {
  const backdrop = document.getElementById('diary-reader-backdrop');
  const dateEl = document.getElementById('diary-modal-date');
  const moodEl = document.getElementById('diary-modal-mood');
  const titleEl = document.getElementById('diary-modal-title');
  const tagsEl = document.getElementById('diary-modal-tags');
  const bodyEl = document.getElementById('diary-modal-body');

  if (!backdrop) return;

  if (dateEl) dateEl.innerHTML = `<i class="fas fa-calendar-alt"></i> ${escapeDiaryHtml(entry.date || 'Undated')}`;
  if (moodEl) moodEl.textContent = entry.mood || 'Reflection';
  if (titleEl) titleEl.textContent = entry.title || 'Untitled Entry';
  if (tagsEl) {
    tagsEl.innerHTML = (entry.tags || []).map(t => `<span class="diary-tag-pill">#${escapeDiaryHtml(t)}</span>`).join('');
  }
  if (bodyEl) bodyEl.textContent = entry.content || '';

  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function initDiaryInteractions() {
  const filterTabs = document.querySelectorAll('#diary-filter-tabs .filter-tab');
  const searchInput = document.getElementById('diary-search');
  const backdrop = document.getElementById('diary-reader-backdrop');
  const closeBtn = document.getElementById('diary-modal-close');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      CyberSFX.switch();
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeDiaryTag = tab.getAttribute('data-diary-tag') || 'all';
      renderDiaryGrid(getProfileData());
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      diarySearchTerm = e.target.value.trim().toLowerCase();
      renderDiaryGrid(getProfileData());
    });
  }

  function closeModal() {
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop && backdrop.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================
   RESOURCES & DOWNLOADS HUB
   ========================================================== */
let activeResourceCategory = 'all';
let resourceSearchQuery = '';

function renderResourcesGrid(data) {
  const container = document.getElementById('resources-grid');
  if (!container) return;

  const resources = data.resources || [];
  let filtered = resources.filter(res => {
    const matchesCat = (activeResourceCategory === 'all') || (res.category === activeResourceCategory);
    const matchesSearch = res.title.toLowerCase().includes(resourceSearchQuery.toLowerCase()) ||
                          res.description.toLowerCase().includes(resourceSearchQuery.toLowerCase()) ||
                          res.type.toLowerCase().includes(resourceSearchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-dim);">
        <i class="fas fa-file-alt" style="font-size: 2rem; margin-bottom: 12px; display: block;"></i>
        No resources found matching "${resourceSearchQuery}".
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(res => `
    <div class="resource-card">
      <div>
        <div class="resource-header">
          <div class="resource-icon-wrap">
            <i class="${res.icon || 'fas fa-file-alt'}"></i>
          </div>
          <span class="resource-type-badge">${res.type}</span>
        </div>
        <h3 class="resource-title">${res.title}</h3>
        <p class="resource-desc">${res.description}</p>
      </div>

      <div class="resource-footer">
        <span class="resource-size"><i class="fas fa-hdd"></i> ${res.size}</span>
        <button type="button" class="btn-download-resource" onclick="handleResourceDownload('${res.title.replace(/'/g, "\\'")}', '${res.downloadUrl || ''}')">
          <i class="fas fa-download"></i> Get File
        </button>
      </div>
    </div>
  `).join('');
}

window.handleResourceDownload = function(title, url) {
  CyberSFX.click();
  if (!url || url === '#' || url.trim() === '') {
    showPublicToast(`Resource "${title}": Download link pending in Admin Settings.`, 'warning');
  } else {
    showPublicToast(`Opening resource: "${title}"...`, 'success');
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

function initResourcesInteractions() {
  const tabs = document.querySelectorAll('#resources-filter-tabs .filter-tab');
  const searchInput = document.getElementById('resources-search');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      CyberSFX.click();
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeResourceCategory = tab.getAttribute('data-res-cat');
      renderResourcesGrid(getProfileData());
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      resourceSearchQuery = e.target.value.trim();
      renderResourcesGrid(getProfileData());
    });
  }
}

/* ==========================================================
   FEATURED PROJECTS (WITH FILTERS & SEARCH)
   ========================================================== */
let activeProjectCategory = 'all';
let projectSearchQuery = '';

function renderProjects(data) {
  const projectsContainer = document.getElementById('projects-grid');
  if (!projectsContainer) return;

  const projectsList = data.projects || [];
  let filtered = projectsList.filter(proj => {
    const tagsString = (proj.tags || []).join(' ').toLowerCase();
    const titleString = proj.title.toLowerCase();
    const descString = proj.description.toLowerCase();

    let matchesCat = true;
    if (activeProjectCategory === 'AI') {
      matchesCat = tagsString.includes('ai') || tagsString.includes('gemini') || tagsString.includes('model') || titleString.includes('ai');
    } else if (activeProjectCategory === 'Web') {
      matchesCat = tagsString.includes('react') || tagsString.includes('javascript') || tagsString.includes('css') || tagsString.includes('web');
    } else if (activeProjectCategory === 'Backend') {
      matchesCat = tagsString.includes('python') || tagsString.includes('fastapi') || tagsString.includes('docker') || tagsString.includes('api') || tagsString.includes('postgres');
    }

    const matchesSearch = titleString.includes(projectSearchQuery.toLowerCase()) ||
                          descString.includes(projectSearchQuery.toLowerCase()) ||
                          tagsString.includes(projectSearchQuery.toLowerCase());

    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    projectsContainer.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-dim);">
        <i class="fas fa-code-branch" style="font-size: 2rem; margin-bottom: 12px; display: block;"></i>
        No projects found matching "${projectSearchQuery}".
      </div>
    `;
    return;
  }

  projectsContainer.innerHTML = filtered.map(proj => `
    <div class="project-card">
      <div>
        <div class="project-header">
          <i class="far fa-folder project-folder-icon"></i>
          <div class="project-links">
            ${proj.github ? `<a href="${proj.github}" target="_blank" rel="noopener noreferrer" class="project-link-btn" title="View Source" onclick="CyberSFX.click()"><i class="fab fa-github"></i></a>` : ''}
            ${proj.demo && proj.demo !== '#' ? `<a href="${proj.demo}" target="_blank" rel="noopener noreferrer" class="project-link-btn" title="Live Preview" onclick="CyberSFX.click()"><i class="fas fa-external-link-alt"></i></a>` : ''}
          </div>
        </div>
        <h3 class="project-title">${proj.title}</h3>
        <p class="project-desc">${proj.description}</p>
      </div>
      <div class="project-tags">
        ${(proj.tags || []).map(t => `<span class="project-tag">${t}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

function initProjectsInteractions() {
  const tabs = document.querySelectorAll('#projects-filter-tabs .filter-tab');
  const searchInput = document.getElementById('projects-search');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      CyberSFX.click();
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeProjectCategory = tab.getAttribute('data-proj-cat');
      renderProjects(getProfileData());
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      projectSearchQuery = e.target.value.trim();
      renderProjects(getProfileData());
    });
  }
}

/* ==========================================================
   PUBLIC CHANNELS & COMMUNITIES (KON CHANNEL ACE)
   ========================================================== */
function renderChannels(data) {
  const container = document.getElementById('channels-grid');
  if (!container) return;

  const channels = data.channels || [];
  container.innerHTML = channels.map(chan => `
    <a href="${chan.url}" target="_blank" rel="noopener noreferrer" class="channel-card" onclick="CyberSFX.click()">
      <div>
        <div class="channel-top">
          <div class="channel-icon-wrap" style="color: ${chan.color || 'var(--secondary)'};">
            <i class="${chan.icon}"></i>
          </div>
          <div class="channel-meta">
            <h3>${chan.name}</h3>
            <span>${chan.handle}</span>
          </div>
        </div>
        <p class="channel-desc">${chan.description}</p>
      </div>

      <div class="channel-footer">
        <span class="channel-members"><i class="fas fa-user-check"></i> ${chan.members}</span>
        <span class="btn-join-channel">Join Now <i class="fas fa-arrow-right"></i></span>
      </div>
    </a>
  `).join('');
}

/* ==========================================================
   VIP EXCLUSIVE CLUB (KON VIP ACE)
   ========================================================== */
function renderVIPCommunity(data) {
  const vip = data.vipCommunity;
  if (!vip) return;

  const badgeEl = document.getElementById('vip-badge');
  if (badgeEl) badgeEl.innerHTML = `<i class="fas fa-crown"></i> ${vip.badge || 'Exclusive Access'}`;

  const titleEl = document.getElementById('vip-title');
  if (titleEl) titleEl.textContent = vip.title;

  const taglineEl = document.getElementById('vip-tagline');
  if (taglineEl) taglineEl.textContent = vip.tagline;

  const descEl = document.getElementById('vip-description');
  if (descEl) descEl.textContent = vip.description;

  const priceEl = document.getElementById('vip-price');
  if (priceEl) priceEl.textContent = vip.priceTag || 'Private / Invite Only';

  const joinBtn = document.getElementById('vip-join-btn');
  if (joinBtn) joinBtn.href = vip.joinUrl || '#';

  const perksContainer = document.getElementById('vip-perks-list');
  if (perksContainer && vip.perks) {
    perksContainer.innerHTML = vip.perks.map(p => `
      <div class="vip-perk-item">
        <i class="fas fa-check-circle"></i>
        <span>${p}</span>
      </div>
    `).join('');
  }
}

/* ==========================================================
   CONTACT FORM & ENCRYPTED INBOX TRANSMISSION
   ========================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    CyberSFX.click();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    const submitBtn = form.querySelector('.form-submit-btn');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Encrypting & Transmitting...`;
    submitBtn.disabled = true;

    saveMessage({ name, email, message });

    setTimeout(() => {
      submitBtn.innerHTML = `<i class="fas fa-check"></i> Transmitted Successfully!`;
      submitBtn.style.background = 'var(--success)';

      showPublicToast(`Thank you, ${name}! Encrypted message delivered to Agent 47.`, 'success');
      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3000);
    }, 700);
  });
}

/* ==========================================================
   SECRET ADMIN SHORTCUT (CTRL + SHIFT + A)
   ========================================================== */
function initSecretAdminShortcut() {
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      CyberSFX.telemetry();
      window.location.href = 'admin.html';
    }
  });
}

/* ==========================================================
   SCROLL SPY
   ========================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });

        mobileNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });
}
