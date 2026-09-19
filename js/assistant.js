/**
 * ==========================================================
 * AI ASSISTANT ECOSYSTEM CONTROLLER (MULTI-BOT & VOICE)
 * ==========================================================
 * Powers Bot 1 (Persona Clone) & Bot 2 (Public Omni Gemini)
 * with real-time Web Speech Voice Recognition & TTS.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAIAssistant();
});

function initAIAssistant() {
  const chatDrawer = document.getElementById('chat-drawer');
  const chatToggleBtn = document.getElementById('floating-assistant-btn');
  const closeChatBtn = document.getElementById('chat-close-btn');
  const navAITrigger = document.getElementById('nav-ai-trigger');
  const heroAITrigger = document.getElementById('hero-ai-trigger');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input-field');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const suggestionsContainer = document.getElementById('chat-suggestions');
  const botStatusIndicator = document.getElementById('bot-status-indicator');
  const botTitleText = document.getElementById('chat-bot-title-text');
  const botAvatarIcon = document.getElementById('chat-bot-avatar-icon');

  // Mode tabs & Voice buttons
  const tabPersona = document.getElementById('tab-bot-persona');
  const tabOmni = document.getElementById('tab-bot-omni');
  const micBtn = document.getElementById('chat-mic-btn');
  const ttsBtn = document.getElementById('chat-tts-btn');

  let currentMode = 'persona'; // 'persona' (Bot 1) or 'omni' (Bot 2)
  let isOpen = false;
  let isThinking = false;
  let isListening = false;
  let ttsEnabled = false;
  let recognition = null;

  // Initialize Speech Recognition if supported
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US'; // Or auto/Bengali fallback

    recognition.onstart = () => {
      isListening = true;
      if (micBtn) micBtn.classList.add('listening');
      if (chatInput) chatInput.placeholder = 'Listening to your voice... Speak now!';
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript && chatInput) {
        chatInput.value = transcript;
        handleUserMessage(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      stopListening();
    };

    recognition.onend = () => {
      stopListening();
    };
  }

  function startListening() {
    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (e) {
        console.warn('Speech start error:', e);
      }
    } else if (!recognition) {
      alert('Speech Recognition is not supported by your browser. Please use Chrome or Edge.');
    }
  }

  function stopListening() {
    isListening = false;
    if (micBtn) micBtn.classList.remove('listening');
    if (chatInput) {
      chatInput.placeholder = currentMode === 'persona' 
        ? 'Ask anything about Agent 47...' 
        : 'Ask Omni Gemini (or click mic to speak)...';
    }
  }

  if (micBtn) {
    micBtn.onclick = () => {
      if (isListening) {
        recognition.stop();
      } else {
        startListening();
      }
    };
  }

  // TTS Toggle Button
  if (ttsBtn) {
    ttsBtn.onclick = () => {
      ttsEnabled = !ttsEnabled;
      if (ttsEnabled) {
        ttsBtn.style.color = '#00ff88';
        ttsBtn.title = 'Voice Output ON (Bot will speak replies)';
        speakVoice("Voice response enabled!");
      } else {
        ttsBtn.style.color = '#00f0ff';
        ttsBtn.title = 'Voice Output OFF';
        if (window.speechSynthesis) window.speechSynthesis.cancel();
      }
    };
  }

  function speakVoice(text) {
    if (!ttsEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop prior speech
    const cleanText = text.replace(/<[^>]*>?/gm, '').replace(/[*_#]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }

  // Switch between Bot 1 and Bot 2
  function setBotMode(mode) {
    currentMode = mode;
    const tripleCfg = getTripleBotConfig();

    if (mode === 'persona') {
      if (tabPersona) tabPersona.classList.add('active');
      if (tabOmni) tabOmni.classList.remove('active');
      if (botTitleText) botTitleText.innerHTML = `BioBot &bull; Agent 47 Clone`;
      if (botAvatarIcon) botAvatarIcon.innerHTML = `<i class="fas fa-user-astronaut"></i>`;
      if (chatInput) chatInput.placeholder = 'Ask anything about Agent 47...';

      const key = tripleCfg.bot1Persona.apiKey;
      if (botStatusIndicator) {
        botStatusIndicator.innerHTML = key ? `✨ Gemini 1.5 Active` : `Online &bull; Local Persona`;
        botStatusIndicator.style.color = key ? '#38bdf8' : 'var(--success)';
      }
      renderSuggestions();
    } else {
      if (tabPersona) tabPersona.classList.remove('active');
      if (tabOmni) tabOmni.classList.add('active');
      if (botTitleText) botTitleText.innerHTML = `Omni AI &bull; General Companion`;
      if (botAvatarIcon) botAvatarIcon.innerHTML = `<i class="fas fa-brain"></i>`;
      if (chatInput) chatInput.placeholder = 'Ask anything (coding, math, questions, or voice speak)...';

      const key = tripleCfg.bot2Public.apiKey;
      if (botStatusIndicator) {
        botStatusIndicator.innerHTML = key ? `✨ Gemini Public AI Active` : `Online &bull; Voice Ready`;
        botStatusIndicator.style.color = key ? '#a855f7' : 'var(--secondary)';
      }

      // Render general question suggestions
      if (suggestionsContainer) {
        const generalPrompts = [
          "Explain System Design basics",
          "Write a Python script for file download",
          "How to optimize React performance?",
          "Tell me a short programming joke"
        ];
        suggestionsContainer.innerHTML = generalPrompts.map(p => `
          <button class="suggestion-chip" data-query="${p}">${p}</button>
        `).join('');
        attachChipListeners();
      }
    }
  }

  if (tabPersona) tabPersona.onclick = () => setBotMode('persona');
  if (tabOmni) tabOmni.onclick = () => setBotMode('omni');

  const chatBackdrop = document.getElementById('chat-backdrop');
  const floatingBtnIcon = document.getElementById('floating-btn-icon');

  // Toggle Drawer
  function toggleChat(forceOpen = null) {
    isOpen = (forceOpen !== null) ? forceOpen : !isOpen;
    if (isOpen) {
      chatDrawer.classList.add('open');
      if (chatBackdrop) chatBackdrop.classList.add('open');
      if (chatToggleBtn) chatToggleBtn.classList.add('active');
      if (floatingBtnIcon) floatingBtnIcon.className = 'fas fa-times';
      setBotMode(currentMode);
      setTimeout(() => {
        if (chatInput) chatInput.focus();
      }, 100);
    } else {
      chatDrawer.classList.remove('open');
      if (chatBackdrop) chatBackdrop.classList.remove('open');
      if (chatToggleBtn) chatToggleBtn.classList.remove('active');
      if (floatingBtnIcon) floatingBtnIcon.className = 'fas fa-robot';
      stopListening();
    }
  }

  if (chatToggleBtn) {
    chatToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleChat();
    });
  }

  if (closeChatBtn) {
    closeChatBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleChat(false);
    });
  }

  if (chatBackdrop) {
    chatBackdrop.addEventListener('click', () => toggleChat(false));
  }

  if (navAITrigger) {
    navAITrigger.addEventListener('click', (e) => {
      e.preventDefault();
      toggleChat(true);
    });
  }

  if (heroAITrigger) {
    heroAITrigger.addEventListener('click', (e) => {
      e.preventDefault();
      toggleChat(true);
    });
  }

  // Close with Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      toggleChat(false);
    }
  });

  // Render Prompt Suggestions
  function renderSuggestions() {
    const config = getProfileData().aiAssistant;
    if (!suggestionsContainer || !config?.quickPrompts) return;
    suggestionsContainer.innerHTML = config.quickPrompts.map(prompt => `
      <button class="suggestion-chip" data-query="${prompt}">${prompt}</button>
    `).join('');
    attachChipListeners();
  }

  function attachChipListeners() {
    if (!suggestionsContainer) return;
    suggestionsContainer.querySelectorAll('.suggestion-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        handleUserMessage(query);
      });
    });
  }

  // Add Message Bubble
  function appendMessage(text, sender = 'bot') {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble bubble-${sender}`;
    bubble.innerHTML = formatChatText(text);
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (sender === 'bot') {
      speakVoice(text);
    }
  }

  function formatChatText(raw) {
    return raw
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }

  // Show Typing Indicator
  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'chat-bubble bubble-bot typing-bubble';
    indicator.id = 'bot-typing-indicator';
    indicator.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('bot-typing-indicator');
    if (indicator) indicator.remove();
  }

  // Local persona fallback
  function getLocalPersonaResponse(userText) {
    const config = getProfileData().aiAssistant;
    const lower = userText.toLowerCase().trim();

    if (config?.knowledgeRules) {
      for (const rule of config.knowledgeRules) {
        const match = rule.keywords.some(keyword => lower.includes(keyword.toLowerCase()));
        if (match) return rule.response;
      }
    }

    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('salam')) {
      return `Hello! How can I help you learn more about Agent 47 today? You can ask about his capabilities, learning roadmap, tactical channels, VIP syndicate, or classified resources!`;
    }

    if (lower.includes('thanks') || lower.includes('thank you') || lower.includes('dhonnobad')) {
      return `Protocol acknowledged. Feel free to explore the terminal or join Agent 47's syndicate channels anytime!`;
    }

    return config?.defaultResponse || "That is a valid inquiry. Feel free to explore the sections or reach out to Agent 47 directly via the Contact terminal.";
  }

  // Call Google Gemini API (routes to Bot 1 or Bot 2 based on mode)
  async function queryGemini(userText, mode) {
    const tripleCfg = getTripleBotConfig();
    const botCfg = mode === 'persona' ? tripleCfg.bot1Persona : tripleCfg.bot2Public;

    if (!botCfg.apiKey || !botCfg.apiKey.trim()) {
      return null; // Fallback to local logic
    }

    const data = getProfileData();

    let systemPrompt = "";
    if (mode === 'persona') {
      systemPrompt = `You are the official AI Persona & Digital Twin of Agent 47, an elite Software Operative & Security Architect.
Here is your complete profile:
- Bio: ${data.personal.name}, ${data.personal.title}. Story: ${data.personal.aboutStory}
- Skills: ${data.skills.map(s => `${s.name} (${s.badge}, ${s.level}%)`).join(', ')}
- Currently Learning (Roadmap): ${data.learningRoadmap.map(l => `${l.title} [Progress: ${l.progress}%]`).join('; ')}
- Tactical Channels: ${data.channels.map(c => `${c.name} (${c.handle}, ${c.members}) - ${c.description}`).join('; ')}
- VIP Syndicate: ${data.vipCommunity.title}. Perks: ${data.vipCommunity.perks.join(', ')}. Access: ${data.vipCommunity.priceTag}
- Classified Resources: ${data.resources.map(r => `${r.title} (${r.category}, ${r.size})`).join('; ')}

Instructions:
1. Speak sharply and confidently in first-person as Agent 47's AI clone.
2. If visitor asks in Bengali or Banglish, reply warmly in conversational Bangla/Banglish! If in English, reply in crisp English.
3. Be concise and direct them to relevant sections (Capabilities, Roadmap, Channels, VIP Syndicate, Resources).`;
    } else {
      systemPrompt = `You are Omni AI, an intelligent, versatile Google Gemini-powered public conversational AI assistant embedded on Agent 47's software platform.
You can help visitors with general coding, technical problem solving, algorithm design, system architecture, or casual questions.
Speak warmly, intelligently, and clearly. Match the user's language (English or Bangla/Banglish). Keep answers concise and helpful.`;
    }

    const candidateModels = [
      (botCfg.model || 'gemini-1.5-flash').replace(/^models\//, ''),
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-2.0-flash'
    ];
    const uniqueCandidates = [...new Set(candidateModels)];

    for (const modelName of uniqueCandidates) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${botCfg.apiKey.trim()}`;

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nVisitor says: "${userText}"\nYour response:` }]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 350
            }
          })
        });

        if (response.ok) {
          const res = await response.json();
          const generatedText = res.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) return generatedText;
        }
      } catch (err) {
        console.warn(`Error querying model ${modelName}:`, err);
      }
    }

    return null;
  }

  // Process User Message
  async function handleUserMessage(message) {
    if (!message || isThinking) return;

    appendMessage(message, 'user');
    if (chatInput) chatInput.value = '';

    isThinking = true;
    showTypingIndicator();

    let botReply = await queryGemini(message, currentMode);

    if (!botReply) {
      if (currentMode === 'persona') {
        botReply = getLocalPersonaResponse(message);
      } else {
        botReply = `Hello! I am ready to help you with general questions and coding. To activate my full live Gemini AI responses, please add API Key #2 in the Admin Studio Settings!`;
      }
    }

    removeTypingIndicator();
    appendMessage(botReply, 'bot');
    isThinking = false;
  }

  // Input Send Listeners
  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', () => {
      const val = chatInput.value.trim();
      if (val) handleUserMessage(val);
    });
  }

  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = chatInput.value.trim();
        if (val) handleUserMessage(val);
      }
    });
  }

  // Initial welcome message & default mode
  setBotMode('persona');
  const initialConfig = getProfileData().aiAssistant;
  appendMessage(initialConfig?.greeting || 'Hello! How can I assist you?', 'bot');
}
