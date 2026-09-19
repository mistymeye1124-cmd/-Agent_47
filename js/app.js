/**
 * ==========================================================
 * MAIN APPLICATION CONTROLLER
 * ==========================================================
 * Dynamically renders Bio, Skills, Learning Roadmap,
 * Resources Hub, Projects, Channels, VIP Club, and Contact.
 * Also hooks up secret admin shortcut (Ctrl + Shift + A).
 */

document.addEventListener('DOMContentLoaded', () => {
  renderAllPortfolioData();
  initTypewriter();
  initSkillsInteractions();
  initResourcesInteractions();
  initContactForm();
  initScrollSpy();
  initSecretAdminShortcut();
  initThemeToggle();

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

/* Theme Switcher Controller (Light / Dark) */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const icon = document.getElementById('theme-toggle-icon');

  function updateIcon(theme) {
    if (!icon) return;
    if (theme === 'light') {
      icon.className = 'fas fa-sun';
      icon.style.color = '#d97706';
    } else {
      icon.className = 'fas fa-moon';
      icon.style.color = '#00f0ff';
    }
  }

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  updateIcon(currentTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = activeTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('app_theme', newTheme);
      updateIcon(newTheme);
    });
  }
}

function renderAllPortfolioData() {
  const data = getProfileData();
  initHeroAndBio(data);
  renderSkillsGrid(data);
  renderLearningRoadmap(data);
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
      <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="social-icon-btn" title="${s.name}">
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
    : ["Full Stack Developer", "AI Enthusiast", "Community Builder"];

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
    const matchesCat = (activeSkillCategory === 'all') || (skill.category === activeSkillCategory);
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

  skillsContainer.innerHTML = filtered.map(skill => `
    <div class="skill-card">
      <div class="skill-card-top">
        <div class="skill-icon-name">
          <div class="skill-icon-wrap">
            <i class="${skill.icon}"></i>
          </div>
          <span class="skill-title">${skill.name}</span>
        </div>
        <span class="skill-badge">${skill.badge}</span>
      </div>
      <div class="skill-progress-wrap">
        <div class="skill-progress-bar">
          <div class="skill-progress-fill" style="width: ${skill.level}%;"></div>
        </div>
        <div class="skill-percent-text">
          <span>Proficiency: ${skill.level}%</span>
        </div>
      </div>
    </div>
  `).join('');
}

function initSkillsInteractions() {
  const tabs = document.querySelectorAll('.skills-filter-tabs .filter-tab');
  const searchInput = document.getElementById('skills-search');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
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
   CURRENTLY LEARNING ROADMAP (KI KI SIKI)
   ========================================================== */
function renderLearningRoadmap(data) {
  const container = document.getElementById('learning-grid');
  if (!container) return;

  const items = data.learningRoadmap || [];
  if (items.length === 0) {
    container.innerHTML = `<p style="color: var(--text-dim); text-align: center; grid-column: 1/-1;">No learning roadmap items added yet.</p>`;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="learning-card">
      <div>
        <div class="learning-card-top">
          <span class="learning-badge">${item.badge}</span>
        </div>
        <h3 class="learning-title">${item.title}</h3>
        <p class="learning-desc">${item.description}</p>
      </div>

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
        <a href="${res.downloadUrl || '#'}" ${res.downloadUrl?.startsWith('http') ? 'target="_blank"' : ''} class="btn-download-resource" onclick="handleResourceDownload('${res.title}', '${res.downloadUrl}')">
          <i class="fas fa-download"></i> Get File
        </a>
      </div>
    </div>
  `).join('');
}

window.handleResourceDownload = function(title, url) {
  if (!url || url === '#') {
    alert(`Resource: "${title}"\nTo link your actual PDF/Drive link, update this resource from the Admin Panel!`);
  }
};

function initResourcesInteractions() {
  const tabs = document.querySelectorAll('#resources-filter-tabs .filter-tab');
  const searchInput = document.getElementById('resources-search');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
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
   FEATURED PROJECTS
   ========================================================== */
function renderProjects(data) {
  const projectsContainer = document.getElementById('projects-grid');
  if (!projectsContainer) return;

  const projectsList = data.projects || [];
  projectsContainer.innerHTML = projectsList.map(proj => `
    <div class="project-card">
      <div>
        <div class="project-header">
          <i class="far fa-folder project-folder-icon"></i>
          <div class="project-links">
            ${proj.github ? `<a href="${proj.github}" target="_blank" rel="noopener noreferrer" class="project-link-btn" title="View Source"><i class="fab fa-github"></i></a>` : ''}
            ${proj.demo ? `<a href="${proj.demo}" class="project-link-btn" title="Live Preview"><i class="fas fa-external-link-alt"></i></a>` : ''}
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

/* ==========================================================
   PUBLIC CHANNELS & COMMUNITIES (KON CHANNEL ACE)
   ========================================================== */
function renderChannels(data) {
  const container = document.getElementById('channels-grid');
  if (!container) return;

  const channels = data.channels || [];
  container.innerHTML = channels.map(chan => `
    <a href="${chan.url}" target="_blank" rel="noopener noreferrer" class="channel-card">
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
   VIP COMMUNITY / EXCLUSIVE CLUB (KON VIP ACE)
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
   CONTACT FORM & INBOX SYNC
   ========================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    const submitBtn = form.querySelector('.form-submit-btn');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending message...`;
    submitBtn.disabled = true;

    saveMessage({ name, email, message });

    setTimeout(() => {
      submitBtn.innerHTML = `<i class="fas fa-check"></i> Sent Successfully!`;
      submitBtn.style.background = 'var(--success)';

      alert(`Thank you, ${name}! Your message has been safely delivered to Agent 47's encrypted inbox.`);
      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3000);
    }, 800);
  });
}

/* ==========================================================
   SECRET ADMIN SHORTCUT (CTRL + SHIFT + A)
   ========================================================== */
function initSecretAdminShortcut() {
  window.addEventListener('keydown', (e) => {
    // Ctrl + Shift + A
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
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
      }
    });
  });
}
