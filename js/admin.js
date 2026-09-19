/**
 * ==========================================================
 * ADMIN STUDIO CONTROLLER (FULL CMS)
 * ==========================================================
 * Manages Bio, Skills, Learning Roadmap, Resources Hub,
 * Projects, Channels, VIP Club, AI Rules, Gemini API,
 * Messages, and Security PIN.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initNavigation();
  loadAllAdminData();
  initModals();
  initMasterCopilot();
  initSettings();
  initExportTools();
  initAdminThemeToggle();
});

/* Theme Switcher Controller in Admin Studio */
function initAdminThemeToggle() {
  const toggleBtn = document.getElementById('admin-theme-toggle');
  const icon = document.getElementById('admin-theme-icon');

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

/* ==========================================================
   AUTHENTICATION / PIN LOCK
   ========================================================== */
function initAuth() {
  const pinOverlay = document.getElementById('pin-lock-overlay');
  const pinInput = document.getElementById('pin-input');
  const pinBtn = document.getElementById('pin-submit-btn');
  const lockBtn = document.getElementById('btn-lock-session');

  if (sessionStorage.getItem('admin_authenticated') === 'true') {
    pinOverlay.classList.add('hidden');
  }

  function handleUnlock() {
    const entered = pinInput.value.trim();
    const storedPin = getAdminPasscode();

    if (entered === storedPin) {
      sessionStorage.setItem('admin_authenticated', 'true');
      pinOverlay.classList.add('hidden');
      pinInput.value = '';
      showToast('Welcome back, Admin!', 'success');
      loadAllAdminData();
    } else {
      showToast('Incorrect PIN!', 'danger');
      pinInput.value = '';
      pinInput.focus();
    }
  }

  if (pinBtn) pinBtn.addEventListener('click', handleUnlock);
  if (pinInput) {
    pinInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleUnlock();
    });
  }

  if (lockBtn) {
    lockBtn.addEventListener('click', () => {
      sessionStorage.removeItem('admin_authenticated');
      pinOverlay.classList.remove('hidden');
      showToast('Session locked', 'info');
    });
  }
}

/* ==========================================================
   NAVIGATION & TABS
   ========================================================== */
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item[data-view]');
  const views = document.querySelectorAll('.admin-view');
  const viewTitle = document.getElementById('current-view-title');
  const viewDesc = document.getElementById('current-view-desc');

  const descriptions = {
    'view-dashboard': 'Overview of platform statistics and quick shortcuts',
    'view-bio': 'Customize personal bio narrative, titles, stats, and socials',
    'view-skills': 'Manage technical competencies, categories, and proficiency levels',
    'view-learning': 'Manage technologies and topics you are currently learning',
    'view-resources': 'Upload and manage downloadable guides, roadmaps, and cheat sheets',
    'view-projects': 'Showcase software projects, repository links, and demos',
    'view-channels-vip': 'Configure public community channels and exclusive VIP Club',
    'view-copilot': 'Your private executive assistant for drafting content, code, and managing the platform',
    'view-ai': 'Train the AI clone with custom triggers and responses',
    'view-messages': 'View inquiries received through the portfolio contact form',
    'view-settings': 'Configure Google Gemini API key and update Admin Security PIN',
    'view-export': 'Export updated configuration or reset data back to defaults'
  };

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetView = item.getAttribute('data-view');

      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      views.forEach(v => v.classList.remove('active'));
      const activeView = document.getElementById(targetView);
      if (activeView) activeView.classList.add('active');

      const label = item.querySelector('.nav-item-left span')?.textContent || 'Dashboard';
      if (viewTitle) viewTitle.textContent = label;
      if (viewDesc) viewDesc.textContent = descriptions[targetView] || '';
    });
  });
}

/* ==========================================================
   LOAD DATA & REFRESH DASHBOARD
   ========================================================== */
function loadAllAdminData() {
  const data = getProfileData();
  const messages = getMessages();

  // Metrics
  document.getElementById('metric-skills-count').textContent = data.skills ? data.skills.length : 0;
  document.getElementById('metric-learning-count').textContent = data.learningRoadmap ? data.learningRoadmap.length : 0;
  document.getElementById('metric-resources-count').textContent = data.resources ? data.resources.length : 0;
  document.getElementById('metric-messages-count').textContent = messages.length;

  const unreadCount = messages.filter(m => !m.read).length;
  const msgBadge = document.getElementById('nav-msg-badge');
  if (msgBadge) {
    msgBadge.textContent = unreadCount;
    msgBadge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
  }

  renderBioForm(data);
  renderSkillsTable(data);
  renderLearningList(data);
  renderResourcesTable(data);
  renderProjectsList(data);
  renderVIPForm(data);
  renderChannelsList(data);
  renderAIRules(data);
  renderMessagesInbox(messages);
}

/* ==========================================================
   BIO & PROFILE MANAGER
   ========================================================== */
function renderBioForm(data) {
  const p = data.personal;
  if (!p) return;

  document.getElementById('bio-name').value = p.name || '';
  document.getElementById('bio-title').value = p.title || '';
  document.getElementById('bio-roles').value = (p.roles || []).join(', ');
  document.getElementById('bio-avatar').value = p.avatarUrl || '';
  document.getElementById('bio-status').value = p.status?.text || '';
  document.getElementById('bio-email').value = p.email || '';
  document.getElementById('bio-location').value = p.location || '';
  document.getElementById('bio-short').value = p.shortBio || '';
  document.getElementById('bio-story').value = p.aboutStory || '';

  const socialsMap = {};
  (p.socials || []).forEach(s => { socialsMap[s.name] = s.url; });
  document.getElementById('social-github').value = socialsMap['GitHub'] || '';
  document.getElementById('social-linkedin').value = socialsMap['LinkedIn'] || '';
  document.getElementById('social-telegram').value = socialsMap['Telegram'] || '';
  document.getElementById('social-youtube').value = socialsMap['YouTube'] || '';

  const form = document.getElementById('bio-form');
  form.onsubmit = (e) => {
    e.preventDefault();
    const currentData = getProfileData();

    currentData.personal.name = document.getElementById('bio-name').value.trim();
    currentData.personal.title = document.getElementById('bio-title').value.trim();
    currentData.personal.roles = document.getElementById('bio-roles').value.split(',').map(r => r.trim()).filter(Boolean);
    currentData.personal.avatarUrl = document.getElementById('bio-avatar').value.trim();
    currentData.personal.status.text = document.getElementById('bio-status').value.trim();
    currentData.personal.email = document.getElementById('bio-email').value.trim();
    currentData.personal.location = document.getElementById('bio-location').value.trim();
    currentData.personal.shortBio = document.getElementById('bio-short').value.trim();
    currentData.personal.aboutStory = document.getElementById('bio-story').value.trim();

    currentData.personal.socials = [
      { name: "GitHub", url: document.getElementById('social-github').value.trim(), icon: "fab fa-github" },
      { name: "LinkedIn", url: document.getElementById('social-linkedin').value.trim(), icon: "fab fa-linkedin-in" },
      { name: "Email", url: `mailto:${document.getElementById('bio-email').value.trim()}`, icon: "fas fa-envelope" },
      { name: "Telegram", url: document.getElementById('social-telegram').value.trim(), icon: "fab fa-telegram-plane" },
      { name: "YouTube", url: document.getElementById('social-youtube').value.trim(), icon: "fab fa-youtube" }
    ];

    saveProfileData(currentData);
    showToast('Bio & Profile updated successfully!', 'success');
  };
}

/* ==========================================================
   SKILLS MATRIX
   ========================================================== */
function renderSkillsTable(data) {
  const tbody = document.getElementById('skills-table-body');
  if (!tbody || !data.skills) return;

  tbody.innerHTML = data.skills.map((skill, idx) => `
    <tr>
      <td>
        <i class="${skill.icon}" style="margin-right: 8px; color: var(--secondary); font-size: 1.1rem;"></i>
        <strong>${skill.name}</strong>
      </td>
      <td>
        <span class="badge-tag badge-${skill.category}">${skill.category.toUpperCase()}</span>
      </td>
      <td>
        <div style="display: flex; align-items: center; gap: 10px; width: 140px;">
          <div style="flex: 1; height: 6px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden;">
            <div style="width: ${skill.level}%; height: 100%; background: var(--secondary);"></div>
          </div>
          <span style="font-family: var(--font-code); font-size: 0.8rem;">${skill.level}%</span>
        </div>
      </td>
      <td>
        <span style="font-size: 0.8rem; font-family: var(--font-code); color: #a5b4fc;">${skill.badge}</span>
      </td>
      <td>
        <div class="table-actions">
          <button class="btn-icon-action" onclick="openEditSkillModal(${idx})" title="Edit Skill"><i class="fas fa-edit"></i></button>
          <button class="btn-icon-action delete" onclick="deleteSkill(${idx})" title="Delete Skill"><i class="fas fa-trash-alt"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

let editingSkillIndex = -1;

window.openAddSkillModal = function() {
  editingSkillIndex = -1;
  document.getElementById('skill-modal-title').textContent = 'Add New Skill';
  document.getElementById('skill-name').value = '';
  document.getElementById('skill-category').value = 'frontend';
  document.getElementById('skill-level').value = 85;
  document.getElementById('skill-level-val').textContent = '85%';
  document.getElementById('skill-badge').value = 'Proficient';
  document.getElementById('skill-icon').value = 'fas fa-code';
  openModal('skill-modal');
};

window.openEditSkillModal = function(idx) {
  editingSkillIndex = idx;
  const data = getProfileData();
  const s = data.skills[idx];
  if (!s) return;

  document.getElementById('skill-modal-title').textContent = 'Edit Skill';
  document.getElementById('skill-name').value = s.name;
  document.getElementById('skill-category').value = s.category;
  document.getElementById('skill-level').value = s.level;
  document.getElementById('skill-level-val').textContent = s.level + '%';
  document.getElementById('skill-badge').value = s.badge;
  document.getElementById('skill-icon').value = s.icon;
  openModal('skill-modal');
};

window.deleteSkill = function(idx) {
  if (confirm('Delete this skill?')) {
    const data = getProfileData();
    data.skills.splice(idx, 1);
    saveProfileData(data);
    loadAllAdminData();
    showToast('Skill removed', 'success');
  }
};

/* ==========================================================
   LEARNING ROADMAP (KI KI SIKI)
   ========================================================== */
function renderLearningList(data) {
  const container = document.getElementById('learning-admin-list');
  if (!container || !data.learningRoadmap) return;

  container.innerHTML = data.learningRoadmap.map((item, idx) => `
    <div class="admin-item-card">
      <div>
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
          <h4 class="admin-item-title">${item.title}</h4>
          <span class="badge-tag badge-tools">${item.badge}</span>
          <span style="font-family: var(--font-code); color: var(--secondary); font-size: 0.85rem;">${item.progress}%</span>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 8px;">${item.description}</p>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          ${(item.tags || []).map(t => `<span class="admin-tag-pill">${t}</span>`).join('')}
        </div>
      </div>
      <div class="table-actions">
        <button class="btn-icon-action" onclick="openEditLearningModal(${idx})" title="Edit Goal"><i class="fas fa-edit"></i></button>
        <button class="btn-icon-action delete" onclick="deleteLearning(${idx})" title="Delete Goal"><i class="fas fa-trash-alt"></i></button>
      </div>
    </div>
  `).join('');
}

let editingLearningIndex = -1;

window.openAddLearningModal = function() {
  editingLearningIndex = -1;
  document.getElementById('learning-modal-title').textContent = 'Add Learning Goal';
  document.getElementById('learn-title').value = '';
  document.getElementById('learn-desc').value = '';
  document.getElementById('learn-badge').value = 'Actively Exploring';
  document.getElementById('learn-progress').value = 75;
  document.getElementById('learn-progress-val').textContent = '75%';
  document.getElementById('learn-tags').value = '';
  openModal('learning-modal');
};

window.openEditLearningModal = function(idx) {
  editingLearningIndex = idx;
  const data = getProfileData();
  const item = data.learningRoadmap[idx];
  if (!item) return;

  document.getElementById('learning-modal-title').textContent = 'Edit Learning Goal';
  document.getElementById('learn-title').value = item.title;
  document.getElementById('learn-desc').value = item.description;
  document.getElementById('learn-badge').value = item.badge;
  document.getElementById('learn-progress').value = item.progress;
  document.getElementById('learn-progress-val').textContent = item.progress + '%';
  document.getElementById('learn-tags').value = (item.tags || []).join(', ');
  openModal('learning-modal');
};

window.deleteLearning = function(idx) {
  if (confirm('Delete this learning goal?')) {
    const data = getProfileData();
    data.learningRoadmap.splice(idx, 1);
    saveProfileData(data);
    loadAllAdminData();
    showToast('Learning goal deleted', 'success');
  }
};

/* ==========================================================
   RESOURCES HUB
   ========================================================== */
function renderResourcesTable(data) {
  const tbody = document.getElementById('resources-table-body');
  if (!tbody || !data.resources) return;

  tbody.innerHTML = data.resources.map((res, idx) => `
    <tr>
      <td>
        <i class="${res.icon || 'fas fa-file-alt'}" style="margin-right: 8px; color: var(--primary);"></i>
        <strong>${res.title}</strong>
      </td>
      <td><span class="badge-tag badge-backend">${res.category}</span></td>
      <td><span style="font-size: 0.8rem; font-family: var(--font-code); color: #cbd5e1;">${res.type}</span></td>
      <td><span style="font-size: 0.8rem; font-family: var(--font-code); color: var(--text-dim);">${res.size}</span></td>
      <td>
        <a href="${res.downloadUrl}" target="_blank" style="color: var(--secondary); font-size: 0.85rem; text-decoration: none;">
          ${res.downloadUrl === '#' ? 'Placeholder' : 'Download Link'}
        </a>
      </td>
      <td>
        <div class="table-actions">
          <button class="btn-icon-action" onclick="openEditResourceModal(${idx})" title="Edit Resource"><i class="fas fa-edit"></i></button>
          <button class="btn-icon-action delete" onclick="deleteResource(${idx})" title="Delete Resource"><i class="fas fa-trash-alt"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

let editingResourceIndex = -1;

window.openAddResourceModal = function() {
  editingResourceIndex = -1;
  document.getElementById('resource-modal-title').textContent = 'Add Public Resource';
  document.getElementById('res-title').value = '';
  document.getElementById('res-desc').value = '';
  document.getElementById('res-category').value = 'Roadmaps';
  document.getElementById('res-type').value = 'PDF Guide';
  document.getElementById('res-size').value = '2.5 MB';
  document.getElementById('res-icon').value = 'fas fa-file-pdf';
  document.getElementById('res-url').value = '#';
  openModal('resource-modal');
};

window.openEditResourceModal = function(idx) {
  editingResourceIndex = idx;
  const data = getProfileData();
  const res = data.resources[idx];
  if (!res) return;

  document.getElementById('resource-modal-title').textContent = 'Edit Public Resource';
  document.getElementById('res-title').value = res.title;
  document.getElementById('res-desc').value = res.description;
  document.getElementById('res-category').value = res.category;
  document.getElementById('res-type').value = res.type;
  document.getElementById('res-size').value = res.size;
  document.getElementById('res-icon').value = res.icon || 'fas fa-file-alt';
  document.getElementById('res-url').value = res.downloadUrl || '#';
  openModal('resource-modal');
};

window.deleteResource = function(idx) {
  if (confirm('Delete this resource?')) {
    const data = getProfileData();
    data.resources.splice(idx, 1);
    saveProfileData(data);
    loadAllAdminData();
    showToast('Resource deleted', 'success');
  }
};

/* ==========================================================
   CHANNELS & VIP CLUB
   ========================================================== */
function renderVIPForm(data) {
  const vip = data.vipCommunity;
  if (!vip) return;

  document.getElementById('vip-title-input').value = vip.title || '';
  document.getElementById('vip-price-input').value = vip.priceTag || '';
  document.getElementById('vip-tagline-input').value = vip.tagline || '';
  document.getElementById('vip-desc-input').value = vip.description || '';
  document.getElementById('vip-url-input').value = vip.joinUrl || '';
  document.getElementById('vip-perks-input').value = (vip.perks || []).join('\n');

  const form = document.getElementById('vip-form');
  form.onsubmit = (e) => {
    e.preventDefault();
    const current = getProfileData();
    current.vipCommunity = {
      title: document.getElementById('vip-title-input').value.trim(),
      badge: "Exclusive Access",
      priceTag: document.getElementById('vip-price-input').value.trim(),
      tagline: document.getElementById('vip-tagline-input').value.trim(),
      description: document.getElementById('vip-desc-input').value.trim(),
      joinUrl: document.getElementById('vip-url-input').value.trim(),
      perks: document.getElementById('vip-perks-input').value.split('\n').map(p => p.trim()).filter(Boolean)
    };
    saveProfileData(current);
    showToast('VIP Club settings saved!', 'success');
  };
}

function renderChannelsList(data) {
  const container = document.getElementById('channels-admin-list');
  if (!container || !data.channels) return;

  container.innerHTML = data.channels.map((chan, idx) => `
    <div class="admin-item-card align-center">
      <div style="display: flex; align-items: center; gap: 14px;">
        <i class="${chan.icon}" style="font-size: 1.6rem; color: ${chan.color || 'var(--secondary)'};"></i>
        <div>
          <h4 class="admin-item-title" style="font-size: 1rem;">${chan.name} (${chan.handle})</h4>
          <span class="admin-member-count">${chan.members}</span> &bull;
          <a href="${chan.url}" target="_blank" style="font-size: 0.8rem; color: var(--secondary); text-decoration: none;">Visit Link</a>
        </div>
      </div>
      <div class="table-actions">
        <button class="btn-icon-action" onclick="openEditChannelModal(${idx})" title="Edit Channel"><i class="fas fa-edit"></i></button>
        <button class="btn-icon-action delete" onclick="deleteChannel(${idx})" title="Delete Channel"><i class="fas fa-trash-alt"></i></button>
      </div>
    </div>
  `).join('');
}

let editingChannelIndex = -1;

window.openAddChannelModal = function() {
  editingChannelIndex = -1;
  document.getElementById('channel-modal-title').textContent = 'Add Channel / Community';
  document.getElementById('chan-name').value = '';
  document.getElementById('chan-handle').value = '';
  document.getElementById('chan-members').value = '';
  document.getElementById('chan-desc').value = '';
  document.getElementById('chan-url').value = '';
  document.getElementById('chan-icon').value = 'fab fa-telegram-plane';
  openModal('channel-modal');
};

window.openEditChannelModal = function(idx) {
  editingChannelIndex = idx;
  const data = getProfileData();
  const c = data.channels[idx];
  if (!c) return;

  document.getElementById('channel-modal-title').textContent = 'Edit Channel';
  document.getElementById('chan-name').value = c.name;
  document.getElementById('chan-handle').value = c.handle;
  document.getElementById('chan-members').value = c.members;
  document.getElementById('chan-desc').value = c.description;
  document.getElementById('chan-url').value = c.url;
  document.getElementById('chan-icon').value = c.icon;
  openModal('channel-modal');
};

window.deleteChannel = function(idx) {
  if (confirm('Delete this channel?')) {
    const data = getProfileData();
    data.channels.splice(idx, 1);
    saveProfileData(data);
    loadAllAdminData();
    showToast('Channel removed', 'success');
  }
};

/* ==========================================================
   PROJECTS MANAGER
   ========================================================== */
function renderProjectsList(data) {
  const container = document.getElementById('projects-admin-list');
  if (!container || !data.projects) return;

  container.innerHTML = data.projects.map((proj, idx) => `
    <div class="admin-item-card">
      <div>
        <h4 class="admin-item-title" style="margin-bottom: 4px;">${proj.title}</h4>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 10px;">${proj.description}</p>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          ${(proj.tags || []).map(t => `<span class="admin-tag-pill" style="color: var(--secondary);">${t}</span>`).join('')}
        </div>
      </div>
      <div class="table-actions">
        <button class="btn-icon-action" onclick="openEditProjectModal(${idx})" title="Edit Project"><i class="fas fa-edit"></i></button>
        <button class="btn-icon-action delete" onclick="deleteProject(${idx})" title="Delete Project"><i class="fas fa-trash-alt"></i></button>
      </div>
    </div>
  `).join('');
}

let editingProjectIndex = -1;

window.openAddProjectModal = function() {
  editingProjectIndex = -1;
  document.getElementById('project-modal-title').textContent = 'Add New Project';
  document.getElementById('project-title').value = '';
  document.getElementById('project-desc').value = '';
  document.getElementById('project-tags').value = '';
  document.getElementById('project-github').value = '';
  document.getElementById('project-demo').value = '';
  openModal('project-modal');
};

window.openEditProjectModal = function(idx) {
  editingProjectIndex = idx;
  const data = getProfileData();
  const p = data.projects[idx];
  if (!p) return;

  document.getElementById('project-modal-title').textContent = 'Edit Project';
  document.getElementById('project-title').value = p.title;
  document.getElementById('project-desc').value = p.description;
  document.getElementById('project-tags').value = (p.tags || []).join(', ');
  document.getElementById('project-github').value = p.github || '';
  document.getElementById('project-demo').value = p.demo || '';
  openModal('project-modal');
};

window.deleteProject = function(idx) {
  if (confirm('Delete this project?')) {
    const data = getProfileData();
    data.projects.splice(idx, 1);
    saveProfileData(data);
    loadAllAdminData();
    showToast('Project deleted', 'success');
  }
};

/* ==========================================================
   AI ASSISTANT TRAINER
   ========================================================== */
function renderAIRules(data) {
  const container = document.getElementById('ai-rules-list');
  if (!container || !data.aiAssistant?.knowledgeRules) return;

  container.innerHTML = data.aiAssistant.knowledgeRules.map((rule, idx) => `
    <div class="admin-item-card">
      <div style="flex: 1; padding-right: 20px;">
        <div style="margin-bottom: 8px;">
          <span style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; font-weight: 600;">Keywords / Triggers:</span>
          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px;">
            ${rule.keywords.map(k => `<span class="admin-rule-keyword">${k}</span>`).join('')}
          </div>
        </div>
        <div>
          <span style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; font-weight: 600;">Bot Answer:</span>
          <p class="admin-rule-answer">${rule.response}</p>
        </div>
      </div>
      <div class="table-actions">
        <button class="btn-icon-action" onclick="openEditRuleModal(${idx})" title="Edit Rule"><i class="fas fa-edit"></i></button>
        <button class="btn-icon-action delete" onclick="deleteRule(${idx})" title="Delete Rule"><i class="fas fa-trash-alt"></i></button>
      </div>
    </div>
  `).join('');

  initAITestSandbox(data);
}

let editingRuleIndex = -1;

window.openAddRuleModal = function() {
  editingRuleIndex = -1;
  document.getElementById('rule-modal-title').textContent = 'Add AI Knowledge Rule';
  document.getElementById('rule-keywords').value = '';
  document.getElementById('rule-response').value = '';
  openModal('rule-modal');
};

window.openEditRuleModal = function(idx) {
  editingRuleIndex = idx;
  const data = getProfileData();
  const r = data.aiAssistant.knowledgeRules[idx];
  if (!r) return;

  document.getElementById('rule-modal-title').textContent = 'Edit AI Knowledge Rule';
  document.getElementById('rule-keywords').value = r.keywords.join(', ');
  document.getElementById('rule-response').value = r.response;
  openModal('rule-modal');
};

window.deleteRule = function(idx) {
  if (confirm('Delete this AI knowledge rule?')) {
    const data = getProfileData();
    data.aiAssistant.knowledgeRules.splice(idx, 1);
    saveProfileData(data);
    loadAllAdminData();
    showToast('AI Rule deleted', 'success');
  }
};

function initAITestSandbox(data) {
  const testInput = document.getElementById('ai-test-input');
  const testBtn = document.getElementById('ai-test-btn');
  const testOutput = document.getElementById('ai-test-output');
  if (!testBtn || !testInput || !testOutput) return;

  testBtn.onclick = () => {
    const q = testInput.value.trim().toLowerCase();
    if (!q) return;

    let matched = null;
    for (const rule of data.aiAssistant.knowledgeRules) {
      if (rule.keywords.some(k => q.includes(k.toLowerCase()))) {
        matched = rule.response;
        break;
      }
    }

    testOutput.style.display = 'block';
    if (matched) {
      testOutput.innerHTML = `<strong>Matched Response:</strong><br>${matched}`;
      testOutput.style.borderColor = 'var(--success)';
    } else {
      testOutput.innerHTML = `<strong>Default Response:</strong><br>${data.aiAssistant.defaultResponse}`;
      testOutput.style.borderColor = 'var(--warning)';
    }
  };
}

/* ==========================================================
   CONTACT MESSAGES INBOX
   ========================================================== */
function renderMessagesInbox(messages) {
  const tbody = document.getElementById('messages-table-body');
  if (!tbody) return;

  if (messages.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 30px; color: var(--text-dim);">
          No messages received yet. Form inquiries submitted on the portfolio will appear here!
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = messages.map(msg => `
    <tr style="${!msg.read ? 'background: rgba(99,102,241,0.06); font-weight: 600;' : ''}">
      <td><span style="font-size: 0.8rem; color: var(--text-dim); font-family: var(--font-code);">${new Date(msg.date).toLocaleDateString()}</span></td>
      <td>${msg.name}</td>
      <td><a href="mailto:${msg.email}" style="color: var(--secondary); text-decoration: none;">${msg.email}</a></td>
      <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${msg.message}</td>
      <td>
        <div class="table-actions">
          <button class="btn-icon-action" onclick="viewMessage('${msg.id}')" title="Read Message"><i class="fas fa-eye"></i></button>
          <button class="btn-icon-action delete" onclick="removeMessage('${msg.id}')" title="Delete"><i class="fas fa-trash-alt"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.viewMessage = function(id) {
  const msgs = getMessages();
  const m = msgs.find(item => item.id === id);
  if (!m) return;

  markMessageRead(id, true);
  loadAllAdminData();
  alert(`Message from: ${m.name} (${m.email})\nDate: ${new Date(m.date).toLocaleString()}\n\n${m.message}`);
};

window.removeMessage = function(id) {
  if (confirm('Delete this message?')) {
    deleteMessage(id);
    loadAllAdminData();
    showToast('Message deleted', 'success');
  }
};

/* ==========================================================
   GEMINI API & SECURITY SETTINGS
   ========================================================== */
/* ==========================================================
   MASTER COPILOT (BOT 3 - PRIVATE ADMIN AI)
   ========================================================== */
function initMasterCopilot() {
  const chatBox = document.getElementById('copilot-chat-box');
  const inputField = document.getElementById('copilot-input');
  const sendBtn = document.getElementById('copilot-send-btn');
  if (!chatBox || !inputField || !sendBtn) return;

  let isThinking = false;

  function appendCopilotMessage(sender, text) {
    const bubble = document.createElement('div');
    if (sender === 'user') {
      bubble.className = 'copilot-bubble-user';
    } else {
      bubble.className = 'copilot-bubble-bot';
    }
    bubble.innerHTML = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  async function handleCopilotQuery(query) {
    if (!query || isThinking) return;
    appendCopilotMessage('user', query);
    inputField.value = '';

    isThinking = true;
    const thinkingBubble = document.createElement('div');
    thinkingBubble.style.cssText = 'align-self: flex-start; color: var(--text-muted); font-style: italic; font-size: 0.85rem;';
    thinkingBubble.innerHTML = `<i class="fas fa-terminal fa-spin"></i> Copilot is computing...`;
    chatBox.appendChild(thinkingBubble);
    chatBox.scrollTop = chatBox.scrollHeight;

    const tripleCfg = getTripleBotConfig();
    const botCfg = tripleCfg.bot3Private;
    const data = getProfileData();
    const messages = getMessages();

    let replyText = "";

    if (botCfg.apiKey && botCfg.apiKey.trim().length > 10) {
      const systemPrompt = `You are Master Copilot, an elite AI administrative assistant and software engineering copilot for Agent 47, the creator of this platform.
Platform Context:
- Operative: ${data.personal.name} (${data.personal.title})
- Skills: ${data.skills.map(s => s.name).join(', ')}
- Learning Roadmap: ${data.learningRoadmap.map(l => `${l.title} (${l.progress}%)`).join(', ')}
- Classified Resources: ${data.resources.map(r => r.title).join(', ')}
- Unread Messages: ${messages.filter(m => !m.read).length} messages.

Help Agent 47 by drafting high-grade technical resources, summarizing classified messages, generating clean code, planning syndicate content, and proposing platform improvements. Speak like a senior tech lead copilot. Be concise, direct, and actionable.`;

      const candidateModels = [
        (botCfg.model || 'gemini-1.5-flash').replace(/^models\//, ''),
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-2.0-flash'
      ];
      const uniqueCandidates = [...new Set(candidateModels)];

      for (const modelName of uniqueCandidates) {
        try {
          const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${botCfg.apiKey.trim()}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nAgent 47 says: "${query}"\nCopilot response:` }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 400 }
            })
          });

          if (resp.ok) {
            const res = await resp.json();
            replyText = res.candidates?.[0]?.content?.parts?.[0]?.text;
            if (replyText) break;
          }
        } catch (e) {}
      }
    }

    thinkingBubble.remove();

    if (!replyText) {
      // Local fallback for Copilot
      if (query.toLowerCase().includes('resource')) {
        replyText = `**[Resource Blueprint Suggestion]**\nTitle: "Next-Gen AI Agent Architecture Checklist (2026)"\n- Cover LangChain vs AutoGen swarms\n- State management with Redis & Vector DBs\n- Production deployment with Docker & FastAPI\n\nWould you like me to generate the full markdown guide for your Resources Hub?`;
      } else if (query.toLowerCase().includes('message')) {
        const unread = messages.filter(m => !m.read);
        replyText = `You currently have **${messages.length} total inquiries** (${unread.length} unread). Most messages are inquiries from visitors requesting collaboration or resume reviews. Check the Messages tab to reply!`;
      } else {
        replyText = `**[Master Copilot Ready]**\nI am configured and ready to assist you. To unleash my full Gemini AI capabilities, please add API Key #3 under the **Gemini & Security** settings tab!`;
      }
    }

    appendCopilotMessage('bot', replyText);
    isThinking = false;
  }

  sendBtn.onclick = () => handleCopilotQuery(inputField.value.trim());
  inputField.onkeydown = (e) => {
    if (e.key === 'Enter') handleCopilotQuery(inputField.value.trim());
  };

  window.sendCopilotQuickPrompt = function(promptText) {
    handleCopilotQuery(promptText);
  };
}

/* ==========================================================
   TRI-BOT GEMINI & SECURITY SETTINGS
   ========================================================== */
function initSettings() {
  const tripleCfg = getTripleBotConfig();

  // Populate inputs for all 3 bots
  const key1 = document.getElementById('key-bot-1');
  const model1 = document.getElementById('model-bot-1');
  const key2 = document.getElementById('key-bot-2');
  const model2 = document.getElementById('model-bot-2');
  const key3 = document.getElementById('key-bot-3');
  const model3 = document.getElementById('model-bot-3');

  if (key1) key1.value = tripleCfg.bot1Persona?.apiKey || '';
  if (model1 && tripleCfg.bot1Persona?.model) model1.value = tripleCfg.bot1Persona.model;

  if (key2) key2.value = tripleCfg.bot2Public?.apiKey || '';
  if (model2 && tripleCfg.bot2Public?.model) model2.value = tripleCfg.bot2Public.model;

  if (key3) key3.value = tripleCfg.bot3Private?.apiKey || '';
  if (model3 && tripleCfg.bot3Private?.model) model3.value = tripleCfg.bot3Private.model;

  // Form Submit
  const tripleForm = document.getElementById('triple-bot-form');
  if (tripleForm) {
    tripleForm.onsubmit = (e) => {
      e.preventDefault();
      const updatedCfg = {
        bot1Persona: {
          name: "BioBot (Personal Clone)",
          apiKey: key1.value.trim(),
          model: model1.value.replace(/^models\//, ''),
          enabled: true
        },
        bot2Public: {
          name: "Omni AI (Public Voice Bot)",
          apiKey: key2.value.trim(),
          model: model2.value.replace(/^models\//, ''),
          enabled: true
        },
        bot3Private: {
          name: "Master Copilot (Admin Only)",
          apiKey: key3.value.trim(),
          model: model3.value.replace(/^models\//, ''),
          enabled: true
        }
      };

      saveTripleBotConfig(updatedCfg);
      showToast('All 3 Bot configurations saved successfully!', 'success');
    };
  }

  // Sync Key 1 to All
  window.syncKeyToAll = function() {
    const k1 = key1.value.trim();
    if (!k1) {
      alert('Please enter a key in Bot 1 first.');
      return;
    }
    key2.value = k1;
    key3.value = k1;
    showToast('Key #1 copied to Bot 2 and Bot 3!', 'info');
  };

  // Test Specific Key
  window.testSpecificKey = async function(botType) {
    let keyInput, modelSelect, botName;
    if (botType === 'bot1') {
      keyInput = key1;
      modelSelect = model1;
      botName = "Bot 1 (BioBot Persona)";
    } else if (botType === 'bot2') {
      keyInput = key2;
      modelSelect = model2;
      botName = "Bot 2 (Omni AI Public Voice)";
    } else {
      keyInput = key3;
      modelSelect = model3;
      botName = "Bot 3 (Private Master Copilot)";
    }

    const key = keyInput.value.trim();
    if (!key) {
      alert(`Please enter an API key for ${botName} first.`);
      return;
    }

    showToast(`Verifying ${botName}...`, 'info');

    try {
      const listResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
      if (!listResp.ok) {
        const err = await listResp.json();
        throw new Error(err.error?.message || `API key rejected (Status ${listResp.status})`);
      }

      const listData = await listResp.json();
      const availableModels = (listData.models || []).filter(m => 
        m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')
      );

      if (availableModels.length === 0) {
        throw new Error('No generateContent models found for this key.');
      }

      // Populate dropdown
      modelSelect.innerHTML = availableModels.map(m => {
        const id = m.name.replace(/^models\//, '');
        return `<option value="${id}">${m.displayName || id} (${id})</option>`;
      }).join('');

      // Auto probe models until a working one is found
      const candidateList = availableModels.map(m => m.name.replace(/^models\//, ''));
      candidateList.sort((a, b) => {
        if (a.includes('flash') && !b.includes('flash')) return -1;
        if (!a.includes('flash') && b.includes('flash')) return 1;
        return 0;
      });

      let workingModel = null;
      let replyText = "";

      for (const cand of candidateList) {
        try {
          const testResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${cand}:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: "Hello! Confirm in 1 word that this API key works." }] }]
            })
          });

          if (testResp.ok) {
            const resData = await testResp.json();
            replyText = resData.candidates?.[0]?.content?.parts?.[0]?.text || "OK";
            workingModel = cand;
            break;
          }
        } catch (e) {}
      }

      if (!workingModel) {
        throw new Error('Could not find an active model on this key.');
      }

      modelSelect.value = workingModel;

      // Save this bot's working configuration
      const currentTriple = getTripleBotConfig();
      if (botType === 'bot1') currentTriple.bot1Persona = { ...currentTriple.bot1Persona, apiKey: key, model: workingModel };
      if (botType === 'bot2') currentTriple.bot2Public = { ...currentTriple.bot2Public, apiKey: key, model: workingModel };
      if (botType === 'bot3') currentTriple.bot3Private = { ...currentTriple.bot3Private, apiKey: key, model: workingModel };
      saveTripleBotConfig(currentTriple);

      alert(`🎉 Success! ${botName} verified!\n\nActive Working Model: ${workingModel}\nGemini Response: "${replyText.trim()}"\n\nConfiguration has been saved!`);
      showToast(`${botName} Verified & Active!`, 'success');

    } catch (err) {
      alert(`❌ Verification Failed for ${botName}:\n${err.message}`);
      showToast(`Test failed for ${botName}`, 'danger');
    }
  };

  // Change PIN Form
  const pinForm = document.getElementById('pin-change-form');
  if (pinForm) {
    pinForm.onsubmit = (e) => {
      e.preventDefault();
      const current = document.getElementById('pin-current').value.trim();
      const newPin = document.getElementById('pin-new').value.trim();
      const stored = getAdminPasscode();

      if (current !== stored) {
        showToast('Current PIN is incorrect!', 'danger');
        return;
      }

      if (newPin.length < 4) {
        showToast('New PIN must be at least 4 characters!', 'danger');
        return;
      }

      setAdminPasscode(newPin);
      pinForm.reset();
      showToast('Admin PIN updated successfully!', 'success');
    };
  }
}

/* ==========================================================
   MODAL CONTROLLER (SUBMIT HANDLERS)
   ========================================================== */
function initModals() {
  // Skill Submit
  const skillForm = document.getElementById('skill-modal-form');
  if (skillForm) {
    skillForm.onsubmit = (e) => {
      e.preventDefault();
      const data = getProfileData();
      const obj = {
        id: editingSkillIndex >= 0 ? data.skills[editingSkillIndex].id : 'sk_' + Date.now(),
        name: document.getElementById('skill-name').value.trim(),
        category: document.getElementById('skill-category').value,
        level: parseInt(document.getElementById('skill-level').value, 10),
        badge: document.getElementById('skill-badge').value.trim(),
        icon: document.getElementById('skill-icon').value.trim() || 'fas fa-code'
      };
      if (editingSkillIndex >= 0) data.skills[editingSkillIndex] = obj;
      else data.skills.push(obj);

      saveProfileData(data);
      closeModal('skill-modal');
      loadAllAdminData();
      showToast('Skill saved successfully!', 'success');
    };
  }

  // Learning Submit
  const learningForm = document.getElementById('learning-modal-form');
  if (learningForm) {
    learningForm.onsubmit = (e) => {
      e.preventDefault();
      const data = getProfileData();
      if (!data.learningRoadmap) data.learningRoadmap = [];

      const obj = {
        id: editingLearningIndex >= 0 ? data.learningRoadmap[editingLearningIndex].id : 'learn_' + Date.now(),
        title: document.getElementById('learn-title').value.trim(),
        description: document.getElementById('learn-desc').value.trim(),
        badge: document.getElementById('learn-badge').value.trim(),
        progress: parseInt(document.getElementById('learn-progress').value, 10),
        tags: document.getElementById('learn-tags').value.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (editingLearningIndex >= 0) data.learningRoadmap[editingLearningIndex] = obj;
      else data.learningRoadmap.push(obj);

      saveProfileData(data);
      closeModal('learning-modal');
      loadAllAdminData();
      showToast('Learning roadmap goal saved!', 'success');
    };
  }

  // Resource Submit
  const resourceForm = document.getElementById('resource-modal-form');
  if (resourceForm) {
    resourceForm.onsubmit = (e) => {
      e.preventDefault();
      const data = getProfileData();
      if (!data.resources) data.resources = [];

      const obj = {
        id: editingResourceIndex >= 0 ? data.resources[editingResourceIndex].id : 'res_' + Date.now(),
        title: document.getElementById('res-title').value.trim(),
        description: document.getElementById('res-desc').value.trim(),
        category: document.getElementById('res-category').value,
        type: document.getElementById('res-type').value.trim(),
        size: document.getElementById('res-size').value.trim(),
        icon: document.getElementById('res-icon').value.trim() || 'fas fa-file-alt',
        downloadUrl: document.getElementById('res-url').value.trim(),
        featured: true
      };

      if (editingResourceIndex >= 0) data.resources[editingResourceIndex] = obj;
      else data.resources.push(obj);

      saveProfileData(data);
      closeModal('resource-modal');
      loadAllAdminData();
      showToast('Resource saved successfully!', 'success');
    };
  }

  // Channel Submit
  const channelForm = document.getElementById('channel-modal-form');
  if (channelForm) {
    channelForm.onsubmit = (e) => {
      e.preventDefault();
      const data = getProfileData();
      if (!data.channels) data.channels = [];

      const obj = {
        id: editingChannelIndex >= 0 ? data.channels[editingChannelIndex].id : 'chan_' + Date.now(),
        name: document.getElementById('chan-name').value.trim(),
        handle: document.getElementById('chan-handle').value.trim(),
        members: document.getElementById('chan-members').value.trim(),
        description: document.getElementById('chan-desc').value.trim(),
        url: document.getElementById('chan-url').value.trim(),
        icon: document.getElementById('chan-icon').value.trim() || 'fab fa-telegram-plane',
        color: 'var(--secondary)'
      };

      if (editingChannelIndex >= 0) data.channels[editingChannelIndex] = obj;
      else data.channels.push(obj);

      saveProfileData(data);
      closeModal('channel-modal');
      loadAllAdminData();
      showToast('Channel saved successfully!', 'success');
    };
  }

  // Project Submit
  const projectForm = document.getElementById('project-modal-form');
  if (projectForm) {
    projectForm.onsubmit = (e) => {
      e.preventDefault();
      const data = getProfileData();
      const obj = {
        id: editingProjectIndex >= 0 ? data.projects[editingProjectIndex].id : 'proj_' + Date.now(),
        title: document.getElementById('project-title').value.trim(),
        description: document.getElementById('project-desc').value.trim(),
        tags: document.getElementById('project-tags').value.split(',').map(t => t.trim()).filter(Boolean),
        github: document.getElementById('project-github').value.trim(),
        demo: document.getElementById('project-demo').value.trim(),
        featured: true
      };

      if (editingProjectIndex >= 0) data.projects[editingProjectIndex] = obj;
      else data.projects.push(obj);

      saveProfileData(data);
      closeModal('project-modal');
      loadAllAdminData();
      showToast('Project saved successfully!', 'success');
    };
  }

  // Rule Submit
  const ruleForm = document.getElementById('rule-modal-form');
  if (ruleForm) {
    ruleForm.onsubmit = (e) => {
      e.preventDefault();
      const data = getProfileData();
      const obj = {
        id: editingRuleIndex >= 0 ? data.aiAssistant.knowledgeRules[editingRuleIndex].id : 'rule_' + Date.now(),
        keywords: document.getElementById('rule-keywords').value.split(',').map(k => k.trim().toLowerCase()).filter(Boolean),
        response: document.getElementById('rule-response').value.trim()
      };

      if (editingRuleIndex >= 0) data.aiAssistant.knowledgeRules[editingRuleIndex] = obj;
      else data.aiAssistant.knowledgeRules.push(obj);

      saveProfileData(data);
      closeModal('rule-modal');
      loadAllAdminData();
      showToast('AI Rule saved successfully!', 'success');
    };
  }

  // Sliders
  const skillSlider = document.getElementById('skill-level');
  const skillSliderVal = document.getElementById('skill-level-val');
  if (skillSlider && skillSliderVal) {
    skillSlider.addEventListener('input', () => { skillSliderVal.textContent = skillSlider.value + '%'; });
  }

  const learnSlider = document.getElementById('learn-progress');
  const learnSliderVal = document.getElementById('learn-progress-val');
  if (learnSlider && learnSliderVal) {
    learnSlider.addEventListener('input', () => { learnSliderVal.textContent = learnSlider.value + '%'; });
  }
}

window.openModal = function(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('open');
};

window.closeModal = function(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
};

/* ==========================================================
   EXPORT & BACKUP TOOLS
   ========================================================== */
function initExportTools() {
  const btnDownloadJs = document.getElementById('btn-download-js');
  if (btnDownloadJs) {
    btnDownloadJs.addEventListener('click', () => {
      const data = getProfileData();
      const fileContent = `/**
 * ==========================================================
 * EXPORTED PROFILE DATA
 * Export Date: ${new Date().toISOString()}
 * ==========================================================
 */
const DEFAULT_PROFILE_DATA = ${JSON.stringify(data, null, 2)};
`;
      const blob = new Blob([fileContent], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'profile-data.js';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Downloaded profile-data.js!', 'success');
    });
  }

  const btnCopyJson = document.getElementById('btn-copy-json');
  if (btnCopyJson) {
    btnCopyJson.addEventListener('click', () => {
      const data = getProfileData();
      navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
        showToast('JSON copied to clipboard!', 'success');
      });
    });
  }

  const btnReset = document.getElementById('btn-reset-data');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('WARNING: Reset all data back to factory defaults?')) {
        resetProfileData();
        loadAllAdminData();
        showToast('Reset to factory defaults successfully!', 'success');
      }
    });
  }
}

/* ==========================================================
   TOAST HELPER
   ========================================================== */
function showToast(msg, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : 'info-circle'}"></i>
    <span>${msg}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
