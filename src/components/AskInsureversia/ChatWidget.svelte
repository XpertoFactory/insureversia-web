<script>
  /** @type {{ locale: string; i18n: Record<string, string>; pageContext: string; pageTitle: string; suggestions: string[] }} */
  let { locale, i18n, pageContext, pageTitle, suggestions } = $props();

  // ─── State ──────────────────────────────────────────────────────
  let isOpen = $state(false);
  let isMinimized = $state(false);
  let messages = $state([]);
  let inputText = $state('');
  let isStreaming = $state(false);
  let streamedText = $state('');
  let error = $state('');
  let rateLimited = $state(false);
  let messagesUsed = $state(0);
  let initialized = $state(false);
  let copiedIdx = $state(-1);

  // Phase 2: persona, auth, history state
  let currentPersona = $state('insureversia');
  let userProfile = $state(null);
  let showAuth = $state(false);
  let authMode = $state('signin'); // 'signin' | 'signup'
  let authEmail = $state('');
  let authPassword = $state('');
  let authName = $state('');
  let authError = $state('');
  let authLoading = $state(false);
  let showHistory = $state(false);
  let conversations = $state([]);
  let currentConversationId = $state(null);
  let historyLoading = $state(false);

  let tier = $derived(userProfile?.tier ?? 'anonymous');
  let dailyLimit = $derived(tier === 'registered' ? 25 : 5);

  // ─── DOM refs ───────────────────────────────────────────────────
  let messagesEl = $state(null);
  let inputEl = $state(null);
  let panelEl = $state(null);

  const SESSION_KEY = 'insureversia-chat-messages';

  // Persona definitions for the chip selector
  const personaChips = [
    { id: 'insureversia', label: () => i18n.personaInsureversia, avatar: '/assets/logos/insureversia-just-logo-white-circle.png', color: '#0F2B46', tier: 'anonymous' },
    { id: 'vera', label: () => i18n.personaVera, avatar: '/assets/images/personas/vera/vera-profile-photo.png', color: '#C9A84C', tier: 'registered' },
    { id: 'bruno', label: () => i18n.personaBruno, avatar: '/assets/images/personas/bruno/bruno-profile-photo.png', color: '#5B8DB8', tier: 'registered' },
    { id: 'zaira', label: () => i18n.personaZaira, avatar: '/assets/images/personas/zaira/zaira-profile-photo.png', color: '#00B4D8', tier: 'registered' },
  ];

  // ─── Init on mount ──────────────────────────────────────────────
  $effect(() => {
    if (!initialized) {
      initialized = true;
      // Restore messages from sessionStorage
      try {
        const saved = sessionStorage.getItem(SESSION_KEY);
        if (saved) messages = JSON.parse(saved);
      } catch {}
      // Read usage
      updateUsage();
      // Listen for auth state
      initAuth();
    }
  });

  async function initAuth() {
    const { onAuthChange } = await import('../../lib/auth');
    onAuthChange((profile) => {
      userProfile = profile;
      updateUsage();
    });
  }

  // ─── Persist messages to sessionStorage ─────────────────────────
  $effect(() => {
    if (initialized && messages.length > 0) {
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages));
      } catch {}
    }
  });

  // ─── Scroll to bottom when messages change ──────────────────────
  $effect(() => {
    // Track dependencies
    messages.length;
    streamedText;
    // Scroll after DOM update
    requestAnimationFrame(() => {
      if (messagesEl) {
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }
    });
  });

  // ─── Detect sources-float for FAB positioning ───────────────────
  let hasSourcesFloat = $state(false);
  $effect(() => {
    if (typeof document !== 'undefined') {
      hasSourcesFloat = !!document.getElementById('sources-float');
    }
  });

  // ─── Usage helpers ──────────────────────────────────────────────
  async function updateUsage() {
    const tiersMod = await import('../../lib/tiers');
    const uid = userProfile?.uid;
    const t = tier;
    const used = await tiersMod.getUsedMessages(t, uid);
    const can = await tiersMod.canSendMessage(t, uid);
    messagesUsed = used;
    rateLimited = !can;
  }

  // ─── Open / Close ───────────────────────────────────────────────
  function openChat() {
    isOpen = true;
    isMinimized = false;
    showHistory = false;
    requestAnimationFrame(() => inputEl?.focus());
  }

  function closeChat() {
    isOpen = false;
    isMinimized = false;
    showHistory = false;
    showAuth = false;
  }

  function minimizeChat() {
    isMinimized = true;
  }

  function toggleChat() {
    if (isOpen && !isMinimized) {
      closeChat();
    } else {
      openChat();
    }
  }

  // ─── Keyboard ───────────────────────────────────────────────────
  function handleKeydown(e) {
    if (e.key === 'Escape' && isOpen) {
      e.stopPropagation();
      if (showHistory) {
        showHistory = false;
      } else if (showAuth) {
        showAuth = false;
      } else {
        closeChat();
      }
    }
  }

  function handleInputKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // ─── Persona switching ──────────────────────────────────────────
  async function selectPersona(personaId) {
    const chip = personaChips.find(p => p.id === personaId);
    if (!chip) return;

    // If locked (registered-only) and user is anonymous, show auth
    if (chip.tier === 'registered' && tier === 'anonymous') {
      showAuth = true;
      authError = '';
      return;
    }

    if (currentPersona === personaId) return;

    currentPersona = personaId;
    // Reset chat for new persona
    const { resetSession } = await import('../../lib/chat');
    resetSession();
    messages = [];
    streamedText = '';
    error = '';
    currentConversationId = null;
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
  }

  function getPersonaGreeting(personaId) {
    switch(personaId) {
      case 'vera': return i18n.greetingVera;
      case 'bruno': return i18n.greetingBruno;
      case 'zaira': return i18n.greetingZaira;
      default: return i18n.greeting;
    }
  }

  // ─── Auth ───────────────────────────────────────────────────────
  async function handleGoogleSignIn() {
    authLoading = true;
    authError = '';
    try {
      const authMod = await import('../../lib/auth');
      let profile;
      if (userProfile && tier === 'anonymous') {
        profile = await authMod.upgradeAnonymous('google');
      } else {
        profile = await authMod.signInWithGoogle();
      }
      userProfile = profile;
      showAuth = false;
      await updateUsage();
    } catch (err) {
      console.error('Google sign-in error:', err);
      authError = i18n.authError;
    } finally {
      authLoading = false;
    }
  }

  async function handleEmailAuth() {
    if (!authEmail || !authPassword) return;
    authLoading = true;
    authError = '';
    try {
      const authMod = await import('../../lib/auth');
      let profile;
      if (authMode === 'signup') {
        if (userProfile && tier === 'anonymous') {
          profile = await authMod.upgradeAnonymous('email', authEmail, authPassword, authName);
        } else {
          profile = await authMod.signUpWithEmail(authEmail, authPassword, authName);
        }
      } else {
        profile = await authMod.signInWithEmail(authEmail, authPassword);
      }
      userProfile = profile;
      showAuth = false;
      authEmail = '';
      authPassword = '';
      authName = '';
      await updateUsage();
    } catch (err) {
      console.error('Email auth error:', err);
      authError = i18n.authError;
    } finally {
      authLoading = false;
    }
  }

  async function handleSignOut() {
    const authMod = await import('../../lib/auth');
    await authMod.signOut();
    currentPersona = 'insureversia';
    currentConversationId = null;
    const { resetSession } = await import('../../lib/chat');
    resetSession();
    messages = [];
    streamedText = '';
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
    await updateUsage();
  }

  // ─── History ────────────────────────────────────────────────────
  async function toggleHistory() {
    if (showHistory) {
      showHistory = false;
      return;
    }
    if (tier !== 'registered' || !userProfile) return;
    showHistory = true;
    historyLoading = true;
    try {
      const { listConversations } = await import('../../lib/conversations');
      conversations = await listConversations(userProfile.uid);
    } catch (err) {
      console.error('History load error:', err);
      conversations = [];
    } finally {
      historyLoading = false;
    }
  }

  async function resumeConversation(conv) {
    showHistory = false;
    currentPersona = conv.personaId || 'insureversia';
    currentConversationId = conv.id;

    // Load messages
    try {
      const { loadMessages } = await import('../../lib/conversations');
      const msgs = await loadMessages(conv.id);
      messages = msgs.map(m => ({ role: m.role, text: m.text }));
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages)); } catch {}
    } catch (err) {
      console.error('Load conversation error:', err);
    }

    // Reset Gemini session so it picks up new history
    const { resetSession } = await import('../../lib/chat');
    resetSession();
  }

  async function deleteConv(convId) {
    try {
      const { deleteConversation } = await import('../../lib/conversations');
      await deleteConversation(convId);
      conversations = conversations.filter(c => c.id !== convId);
      if (currentConversationId === convId) {
        currentConversationId = null;
      }
    } catch (err) {
      console.error('Delete conversation error:', err);
    }
  }

  // ─── Send message ───────────────────────────────────────────────
  async function sendMessage(text) {
    const msg = text || inputText.trim();
    if (!msg || isStreaming) return;

    // Check rate limit
    const tiersMod = await import('../../lib/tiers');
    const uid = userProfile?.uid;
    const can = await tiersMod.canSendMessage(tier, uid);
    if (!can) {
      rateLimited = true;
      return;
    }

    // Push user message
    messages = [...messages, { role: 'user', text: msg }];
    inputText = '';
    error = '';
    isStreaming = true;
    streamedText = '';

    try {
      // Create conversation in Firestore for registered users (first message)
      if (tier === 'registered' && userProfile && !currentConversationId) {
        const { createConversation } = await import('../../lib/conversations');
        currentConversationId = await createConversation(
          userProfile.uid, currentPersona, locale, msg,
        );
      }

      // Build history (exclude last user message, that's sent separately)
      const history = messages.slice(0, -1);
      const chatMod = await import('../../lib/chat');
      const stream = chatMod.sendMessageStream(
        msg, locale, pageContext, pageTitle, history,
        currentPersona, tier, currentConversationId,
      );

      for await (const chunk of stream) {
        streamedText += chunk;
      }

      // Push model message
      messages = [...messages, { role: 'model', text: streamedText }];
      streamedText = '';

      // Increment usage
      await tiersMod.incrementUsage(tier, uid);
      await updateUsage();
    } catch (err) {
      console.error('Ask Insureversia error:', err);
      const isNetwork = err?.message?.includes('fetch') || err?.message?.includes('network') || err?.name === 'TypeError';
      error = isNetwork ? i18n.errorNetwork : i18n.errorGeneric;
      // Remove the user message if we got no response at all
      if (streamedText === '') {
        messages = messages.slice(0, -1);
      } else {
        // Partial response — keep it
        messages = [...messages, { role: 'model', text: streamedText }];
        streamedText = '';
      }
    } finally {
      isStreaming = false;
    }
  }

  // ─── Suggestion click ──────────────────────────────────────────
  function handleSuggestion(text) {
    sendMessage(text);
  }

  // ─── New chat ───────────────────────────────────────────────────
  async function newChat() {
    const { resetSession } = await import('../../lib/chat');
    resetSession();
    messages = [];
    streamedText = '';
    error = '';
    currentConversationId = null;
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
  }

  // ─── Copy message ──────────────────────────────────────────────
  async function copyMessage(text, idx) {
    try {
      await navigator.clipboard.writeText(text);
      copiedIdx = idx;
      setTimeout(() => { copiedIdx = -1; }, 2000);
    } catch {}
  }

  // ─── Simple markdown rendering ─────────────────────────────────
  function renderMarkdown(text) {
    return text
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Inline code
      .replace(/`(.+?)`/g, '<code>$1</code>')
      // Line breaks
      .replace(/\n/g, '<br>');
  }

  // ─── Usage display ─────────────────────────────────────────────
  function usageText() {
    return i18n.usageCount
      .replace('{used}', String(messagesUsed))
      .replace('{limit}', String(dailyLimit));
  }

  function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
  }

  const showSuggestions = $derived(messages.length === 0 && !isStreaming && !showAuth);
  const activeChip = $derived(personaChips.find(p => p.id === currentPersona));
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="ask-insureversia" class:ask-insureversia--open={isOpen && !isMinimized}>
  <!-- FAB -->
  <button
    class="ask-insureversia__fab"
    class:ask-insureversia__fab--shifted={hasSourcesFloat}
    class:ask-insureversia__fab--hidden={isOpen && !isMinimized}
    onclick={toggleChat}
    aria-label={i18n.title}
    title={i18n.title}
  >
    <img
      src="/assets/logos/insureversia-just-logo-white-circle.png"
      alt="Insureversia"
      width="32"
      height="32"
      class="ask-insureversia__fab-icon"
    />
    <span class="ask-insureversia__fab-pulse"></span>
  </button>

  <!-- Chat Panel -->
  {#if isOpen && !isMinimized}
    <div
      class="ask-insureversia__panel"
      role="dialog"
      aria-modal="true"
      aria-label={i18n.title}
      bind:this={panelEl}
    >
      <!-- Header -->
      <div class="ask-insureversia__header" style="background: {activeChip?.color || '#0F2B46'}">
        <div class="ask-insureversia__header-left">
          <img
            src={activeChip?.avatar || '/assets/logos/insureversia-just-logo-white-circle.png'}
            alt=""
            width="24"
            height="24"
            class="ask-insureversia__header-avatar"
          />
          <span class="ask-insureversia__header-title">{i18n.title}</span>
        </div>
        <div class="ask-insureversia__header-actions">
          {#if tier === 'registered'}
            <button
              class="ask-insureversia__header-btn"
              onclick={toggleHistory}
              aria-label={i18n.history}
              title={i18n.history}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </button>
          {/if}
          <button
            class="ask-insureversia__header-btn"
            onclick={newChat}
            aria-label={i18n.newChat}
            title={i18n.newChat}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
          <button
            class="ask-insureversia__header-btn"
            onclick={minimizeChat}
            aria-label={i18n.minimize}
            title={i18n.minimize}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/>
            </svg>
          </button>
          <button
            class="ask-insureversia__header-btn"
            onclick={closeChat}
            aria-label={i18n.close}
            title={i18n.close}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Persona selector -->
      <div class="ask-insureversia__personas">
        {#each personaChips as chip}
          <button
            class="ask-insureversia__persona-chip"
            class:ask-insureversia__persona-chip--active={currentPersona === chip.id}
            class:ask-insureversia__persona-chip--locked={chip.tier === 'registered' && tier === 'anonymous'}
            style={currentPersona === chip.id ? `border-color: ${chip.color}; background: ${chip.color}15` : ''}
            onclick={() => selectPersona(chip.id)}
            aria-label={chip.tier === 'registered' && tier === 'anonymous' ? i18n.personaLocked : chip.label()}
            title={chip.tier === 'registered' && tier === 'anonymous' ? i18n.personaLocked : i18n.switchPersona}
          >
            <img src={chip.avatar} alt="" width="18" height="18" class="ask-insureversia__persona-chip-avatar" />
            <span class="ask-insureversia__persona-chip-name">{chip.label()}</span>
            {#if chip.tier === 'registered' && tier === 'anonymous'}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" class="ask-insureversia__persona-lock">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            {/if}
          </button>
        {/each}
      </div>

      <!-- History panel overlay -->
      {#if showHistory}
        <div class="ask-insureversia__history">
          <div class="ask-insureversia__history-header">
            <span class="ask-insureversia__history-title">{i18n.conversationsTitle}</span>
            <button class="ask-insureversia__header-btn" onclick={() => showHistory = false} style="color: var(--text-primary, #1a1a1a)" aria-label="Close history">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          {#if historyLoading}
            <div class="ask-insureversia__history-empty">{i18n.typing}</div>
          {:else if conversations.length === 0}
            <div class="ask-insureversia__history-empty">{i18n.noHistory}</div>
          {:else}
            <div class="ask-insureversia__history-list">
              {#each conversations as conv}
                <div class="ask-insureversia__history-item">
                  <button class="ask-insureversia__history-resume" onclick={() => resumeConversation(conv)}>
                    <span class="ask-insureversia__history-item-title">{conv.title}</span>
                    <span class="ask-insureversia__history-item-meta">
                      {conv.personaId || 'insureversia'} · {formatDate(conv.updatedAt)}
                    </span>
                  </button>
                  <button
                    class="ask-insureversia__history-delete"
                    onclick={() => deleteConv(conv.id)}
                    aria-label={i18n.deleteChat}
                    title={i18n.deleteChat}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {:else}
        <!-- Messages -->
        <div
          class="ask-insureversia__messages"
          role="log"
          aria-live="polite"
          bind:this={messagesEl}
        >
          <!-- Greeting -->
          <div class="ask-insureversia__msg ask-insureversia__msg--model">
            <div class="ask-insureversia__msg-bubble ask-insureversia__msg-bubble--model">
              {getPersonaGreeting(currentPersona)}
            </div>
          </div>

          <!-- Conversation -->
          {#each messages as msg, idx}
            <div class="ask-insureversia__msg ask-insureversia__msg--{msg.role}">
              <div class="ask-insureversia__msg-bubble ask-insureversia__msg-bubble--{msg.role}">
                {#if msg.role === 'model'}
                  {@html renderMarkdown(msg.text)}
                {:else}
                  {msg.text}
                {/if}
              </div>
              {#if msg.role === 'model'}
                <button
                  class="ask-insureversia__copy-btn"
                  onclick={() => copyMessage(msg.text, idx)}
                  aria-label={i18n.copyMessage}
                  title={copiedIdx === idx ? i18n.copied : i18n.copyMessage}
                >
                  {#if copiedIdx === idx}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
                  {:else}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                  {/if}
                </button>
              {/if}
            </div>
          {/each}

          <!-- Streaming indicator -->
          {#if isStreaming}
            <div class="ask-insureversia__msg ask-insureversia__msg--model">
              <div class="ask-insureversia__msg-bubble ask-insureversia__msg-bubble--model">
                {#if streamedText}
                  {@html renderMarkdown(streamedText)}
                {:else}
                  <span class="ask-insureversia__typing">
                    <span></span><span></span><span></span>
                  </span>
                {/if}
              </div>
            </div>
          {/if}

          <!-- Error -->
          {#if error}
            <div class="ask-insureversia__error">{error}</div>
          {/if}
        </div>

        <!-- Inline auth form -->
        {#if showAuth}
          <div class="ask-insureversia__auth">
            <p class="ask-insureversia__auth-desc">{i18n.upgradeForPersonas}</p>

            <button
              class="ask-insureversia__auth-google"
              onclick={handleGoogleSignIn}
              disabled={authLoading}
            >
              <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              {i18n.signInGoogle}
            </button>

            <div class="ask-insureversia__auth-divider">
              <span>or</span>
            </div>

            <div class="ask-insureversia__auth-tabs">
              <button
                class="ask-insureversia__auth-tab"
                class:ask-insureversia__auth-tab--active={authMode === 'signin'}
                onclick={() => { authMode = 'signin'; authError = ''; }}
              >{i18n.signIn}</button>
              <button
                class="ask-insureversia__auth-tab"
                class:ask-insureversia__auth-tab--active={authMode === 'signup'}
                onclick={() => { authMode = 'signup'; authError = ''; }}
              >{i18n.signUp}</button>
            </div>

            <form class="ask-insureversia__auth-form" onsubmit={(e) => { e.preventDefault(); handleEmailAuth(); }}>
              {#if authMode === 'signup'}
                <input
                  type="text"
                  class="ask-insureversia__auth-input"
                  placeholder={i18n.nameLabel}
                  bind:value={authName}
                  autocomplete="name"
                />
              {/if}
              <input
                type="email"
                class="ask-insureversia__auth-input"
                placeholder={i18n.emailLabel}
                bind:value={authEmail}
                required
                autocomplete="email"
              />
              <input
                type="password"
                class="ask-insureversia__auth-input"
                placeholder={i18n.passwordLabel}
                bind:value={authPassword}
                required
                autocomplete={authMode === 'signup' ? 'new-password' : 'current-password'}
              />
              <button
                type="submit"
                class="ask-insureversia__auth-submit"
                disabled={authLoading || !authEmail || !authPassword}
              >
                {authLoading ? '...' : (authMode === 'signup' ? i18n.signUpEmail : i18n.signInEmail)}
              </button>
            </form>

            {#if authError}
              <div class="ask-insureversia__auth-error">{authError}</div>
            {/if}

            <button class="ask-insureversia__auth-cancel" onclick={() => showAuth = false}>
              {i18n.close}
            </button>
          </div>
        {/if}

        <!-- Suggestions -->
        {#if showSuggestions}
          <div class="ask-insureversia__suggestions">
            <span class="ask-insureversia__suggestions-label">{i18n.suggestedLabel}</span>
            <div class="ask-insureversia__suggestions-list">
              {#each suggestions as suggestion}
                <button
                  class="ask-insureversia__suggestion-chip"
                  onclick={() => handleSuggestion(suggestion)}
                  disabled={rateLimited}
                >
                  {suggestion}
                </button>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Rate limit message -->
        {#if rateLimited}
          <div class="ask-insureversia__limit">
            <strong>{i18n.limitReached}</strong>
            {#if tier === 'anonymous'}
              <p>{i18n.upgradeForMore}</p>
              <button class="ask-insureversia__limit-upgrade" onclick={() => showAuth = true}>
                {i18n.signUp}
              </button>
            {:else}
              <p>{i18n.limitReachedSub}</p>
            {/if}
          </div>
        {/if}
      {/if}

      <!-- Input bar -->
      <div class="ask-insureversia__input-bar">
        <input
          type="text"
          class="ask-insureversia__input"
          placeholder={i18n.placeholder}
          bind:value={inputText}
          bind:this={inputEl}
          onkeydown={handleInputKeydown}
          disabled={isStreaming || rateLimited || showHistory}
          aria-label={i18n.placeholder}
        />
        <button
          class="ask-insureversia__send-btn"
          onclick={() => sendMessage()}
          disabled={!inputText.trim() || isStreaming || rateLimited || showHistory}
          aria-label={i18n.send}
          title={i18n.send}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>

      <!-- Footer -->
      <div class="ask-insureversia__footer">
        <span class="ask-insureversia__usage">{usageText()}</span>
        {#if tier === 'registered' && userProfile}
          <button class="ask-insureversia__signout-btn" onclick={handleSignOut} title={i18n.signOut}>
            {userProfile.displayName || userProfile.email || ''} · {i18n.signOut}
          </button>
        {:else}
          <span class="ask-insureversia__disclaimer">{i18n.disclaimer}</span>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  /* ─── Root ────────────────────────────────────────────────────── */
  .ask-insureversia {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: var(--z-overlay, 300);
    font-family: var(--font-body, 'Inter', sans-serif);
  }

  /* ─── FAB ─────────────────────────────────────────────────────── */
  .ask-insureversia__fab {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    background: var(--color-primary, #0F2B46);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    transition: transform 0.2s ease, opacity 0.2s ease, bottom 0.3s ease;
    z-index: var(--z-overlay, 300);
  }

  .ask-insureversia__fab:hover {
    transform: scale(1.08);
  }

  .ask-insureversia__fab--shifted {
    bottom: 6rem;
  }

  .ask-insureversia__fab--hidden {
    opacity: 0;
    pointer-events: none;
    transform: scale(0.8);
  }

  .ask-insureversia__fab-icon {
    border-radius: 50%;
    object-fit: cover;
  }

  .ask-insureversia__fab-pulse {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 2px solid var(--color-primary, #0F2B46);
    animation: insureversia-pulse 2s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes insureversia-pulse {
    0%, 100% { opacity: 0; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(1.15); }
  }

  /* ─── Panel ───────────────────────────────────────────────────── */
  .ask-insureversia__panel {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    width: 400px;
    max-height: 650px;
    background: var(--surface-white, #fff);
    border: 1px solid var(--border-light, #e5e7eb);
    border-radius: var(--radius-xl, 16px);
    box-shadow: 0 8px 40px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: insureversia-panel-in 0.25s ease-out;
    z-index: var(--z-overlay, 300);
  }

  @keyframes insureversia-panel-in {
    from { opacity: 0; transform: translateY(16px) scale(0.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ─── Header ──────────────────────────────────────────────────── */
  .ask-insureversia__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background: var(--color-primary, #0F2B46);
    color: white;
    flex-shrink: 0;
    transition: background 0.3s ease;
  }

  .ask-insureversia__header-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .ask-insureversia__header-avatar {
    border-radius: 50%;
    object-fit: cover;
  }

  .ask-insureversia__header-title {
    font-weight: 600;
    font-size: 0.95rem;
  }

  .ask-insureversia__header-actions {
    display: flex;
    gap: 0.25rem;
  }

  .ask-insureversia__header-btn {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.35rem;
    border-radius: var(--radius-sm, 6px);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.8;
    transition: opacity 0.15s ease, background 0.15s ease;
  }

  .ask-insureversia__header-btn:hover {
    opacity: 1;
    background: rgba(255,255,255,0.15);
  }

  /* ─── Persona Selector ──────────────────────────────────────── */
  .ask-insureversia__personas {
    display: flex;
    gap: 0.35rem;
    padding: 0.5rem 0.75rem;
    overflow-x: auto;
    flex-shrink: 0;
    border-bottom: 1px solid var(--border-light, #e5e7eb);
    scrollbar-width: none;
  }

  .ask-insureversia__personas::-webkit-scrollbar {
    display: none;
  }

  .ask-insureversia__persona-chip {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.3rem 0.55rem;
    border: 1.5px solid var(--border-light, #e5e7eb);
    border-radius: var(--radius-full, 9999px);
    background: transparent;
    font-size: 0.72rem;
    font-family: inherit;
    color: var(--text-primary, #1a1a1a);
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  .ask-insureversia__persona-chip:hover {
    background: var(--surface-parchment, #f5f0e8);
  }

  .ask-insureversia__persona-chip--active {
    font-weight: 600;
  }

  .ask-insureversia__persona-chip--locked {
    opacity: 0.6;
  }

  .ask-insureversia__persona-chip-avatar {
    border-radius: 50%;
    object-fit: cover;
    width: 18px;
    height: 18px;
  }

  .ask-insureversia__persona-chip-name {
    line-height: 1;
  }

  .ask-insureversia__persona-lock {
    opacity: 0.5;
    margin-left: -0.1rem;
  }

  /* ─── Messages ────────────────────────────────────────────────── */
  .ask-insureversia__messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-height: 180px;
    max-height: 320px;
  }

  .ask-insureversia__msg {
    display: flex;
    flex-direction: column;
    max-width: 85%;
  }

  .ask-insureversia__msg--user {
    align-self: flex-end;
  }

  .ask-insureversia__msg--model {
    align-self: flex-start;
  }

  .ask-insureversia__msg-bubble {
    padding: 0.6rem 0.85rem;
    border-radius: var(--radius-lg, 12px);
    font-size: 0.875rem;
    line-height: 1.5;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .ask-insureversia__msg-bubble--user {
    background: var(--color-primary, #0F2B46);
    color: white;
    border-bottom-right-radius: 4px;
  }

  .ask-insureversia__msg-bubble--model {
    background: var(--surface-parchment, #f5f0e8);
    color: var(--text-primary, #1a1a1a);
    border-bottom-left-radius: 4px;
  }

  .ask-insureversia__msg-bubble--model :global(strong) {
    font-weight: 600;
  }

  .ask-insureversia__msg-bubble--model :global(code) {
    background: rgba(0,0,0,0.06);
    padding: 0.1em 0.3em;
    border-radius: 3px;
    font-family: var(--font-mono, monospace);
    font-size: 0.85em;
  }

  .ask-insureversia__copy-btn {
    align-self: flex-start;
    background: transparent;
    border: none;
    color: var(--text-muted, #6b7280);
    cursor: pointer;
    padding: 0.2rem;
    margin-top: 0.15rem;
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  .ask-insureversia__msg:hover .ask-insureversia__copy-btn {
    opacity: 0.7;
  }

  .ask-insureversia__copy-btn:hover {
    opacity: 1 !important;
    color: var(--color-primary, #0F2B46);
  }

  /* ─── Typing indicator ────────────────────────────────────────── */
  .ask-insureversia__typing {
    display: inline-flex;
    gap: 4px;
    padding: 0.2rem 0;
  }

  .ask-insureversia__typing span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--text-muted, #6b7280);
    animation: insureversia-dot 1.2s ease-in-out infinite;
  }

  .ask-insureversia__typing span:nth-child(2) { animation-delay: 0.2s; }
  .ask-insureversia__typing span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes insureversia-dot {
    0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
    30% { opacity: 1; transform: translateY(-4px); }
  }

  /* ─── Error ───────────────────────────────────────────────────── */
  .ask-insureversia__error {
    background: #fef2f2;
    color: #dc2626;
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius-md, 8px);
    font-size: 0.8rem;
    text-align: center;
  }

  /* ─── Auth Form ──────────────────────────────────────────────── */
  .ask-insureversia__auth {
    padding: 0.75rem 1rem;
    flex-shrink: 0;
    border-bottom: 1px solid var(--border-light, #e5e7eb);
  }

  .ask-insureversia__auth-desc {
    font-size: 0.8rem;
    color: var(--text-primary, #1a1a1a);
    margin: 0 0 0.6rem;
    text-align: center;
  }

  .ask-insureversia__auth-google {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.55rem;
    border: 1px solid var(--border-light, #e5e7eb);
    border-radius: var(--radius-md, 8px);
    background: white;
    color: var(--text-primary, #1a1a1a);
    font-size: 0.8rem;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .ask-insureversia__auth-google:hover:not(:disabled) {
    background: var(--surface-parchment, #f5f0e8);
  }

  .ask-insureversia__auth-google:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .ask-insureversia__auth-divider {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.6rem 0;
    font-size: 0.7rem;
    color: var(--text-muted, #6b7280);
  }

  .ask-insureversia__auth-divider::before,
  .ask-insureversia__auth-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border-light, #e5e7eb);
  }

  .ask-insureversia__auth-tabs {
    display: flex;
    gap: 0;
    margin-bottom: 0.5rem;
    border: 1px solid var(--border-light, #e5e7eb);
    border-radius: var(--radius-md, 8px);
    overflow: hidden;
  }

  .ask-insureversia__auth-tab {
    flex: 1;
    padding: 0.4rem;
    border: none;
    background: transparent;
    font-size: 0.75rem;
    font-family: inherit;
    color: var(--text-muted, #6b7280);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .ask-insureversia__auth-tab--active {
    background: var(--color-primary, #0F2B46);
    color: white;
  }

  .ask-insureversia__auth-form {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .ask-insureversia__auth-input {
    width: 100%;
    padding: 0.45rem 0.65rem;
    border: 1px solid var(--border-light, #e5e7eb);
    border-radius: var(--radius-sm, 6px);
    font-size: 0.8rem;
    font-family: inherit;
    background: var(--surface-white, #fff);
    color: var(--text-primary, #1a1a1a);
    outline: none;
    box-sizing: border-box;
  }

  .ask-insureversia__auth-input:focus {
    border-color: var(--color-primary, #0F2B46);
  }

  .ask-insureversia__auth-submit {
    padding: 0.5rem;
    border: none;
    border-radius: var(--radius-sm, 6px);
    background: var(--color-primary, #0F2B46);
    color: white;
    font-size: 0.8rem;
    font-family: inherit;
    cursor: pointer;
    transition: opacity 0.15s ease;
  }

  .ask-insureversia__auth-submit:hover:not(:disabled) {
    opacity: 0.9;
  }

  .ask-insureversia__auth-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .ask-insureversia__auth-error {
    margin-top: 0.4rem;
    font-size: 0.75rem;
    color: #dc2626;
    text-align: center;
  }

  .ask-insureversia__auth-cancel {
    display: block;
    width: 100%;
    margin-top: 0.4rem;
    padding: 0.3rem;
    border: none;
    background: transparent;
    font-size: 0.75rem;
    color: var(--text-muted, #6b7280);
    cursor: pointer;
    font-family: inherit;
    text-decoration: underline;
  }

  /* ─── History Panel ──────────────────────────────────────────── */
  .ask-insureversia__history {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    min-height: 200px;
    max-height: 400px;
  }

  .ask-insureversia__history-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 1rem;
    border-bottom: 1px solid var(--border-light, #e5e7eb);
    flex-shrink: 0;
  }

  .ask-insureversia__history-title {
    font-weight: 600;
    font-size: 0.85rem;
    color: var(--text-primary, #1a1a1a);
  }

  .ask-insureversia__history-empty {
    padding: 2rem 1rem;
    text-align: center;
    font-size: 0.8rem;
    color: var(--text-muted, #6b7280);
  }

  .ask-insureversia__history-list {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem;
  }

  .ask-insureversia__history-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.1rem;
    border-bottom: 1px solid var(--border-light, #e5e7eb);
  }

  .ask-insureversia__history-item:last-child {
    border-bottom: none;
  }

  .ask-insureversia__history-resume {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    padding: 0.5rem;
    border: none;
    background: transparent;
    cursor: pointer;
    text-align: left;
    border-radius: var(--radius-sm, 6px);
    transition: background 0.15s ease;
    font-family: inherit;
  }

  .ask-insureversia__history-resume:hover {
    background: var(--surface-parchment, #f5f0e8);
  }

  .ask-insureversia__history-item-title {
    font-size: 0.8rem;
    color: var(--text-primary, #1a1a1a);
    font-weight: 500;
    line-height: 1.3;
  }

  .ask-insureversia__history-item-meta {
    font-size: 0.7rem;
    color: var(--text-muted, #6b7280);
  }

  .ask-insureversia__history-delete {
    flex-shrink: 0;
    padding: 0.35rem;
    border: none;
    background: transparent;
    color: var(--text-muted, #6b7280);
    cursor: pointer;
    border-radius: var(--radius-sm, 6px);
    opacity: 0.5;
    transition: opacity 0.15s ease, color 0.15s ease;
  }

  .ask-insureversia__history-delete:hover {
    opacity: 1;
    color: #dc2626;
  }

  /* ─── Suggestions ─────────────────────────────────────────────── */
  .ask-insureversia__suggestions {
    padding: 0 1rem 0.5rem;
    flex-shrink: 0;
  }

  .ask-insureversia__suggestions-label {
    font-size: 0.75rem;
    color: var(--text-muted, #6b7280);
    display: block;
    margin-bottom: 0.4rem;
  }

  .ask-insureversia__suggestions-list {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .ask-insureversia__suggestion-chip {
    background: var(--surface-parchment, #f5f0e8);
    border: 1px solid var(--border-light, #e5e7eb);
    border-radius: var(--radius-full, 9999px);
    padding: 0.4rem 0.75rem;
    font-size: 0.8rem;
    color: var(--text-primary, #1a1a1a);
    cursor: pointer;
    text-align: left;
    transition: background 0.15s ease, border-color 0.15s ease;
    font-family: inherit;
  }

  .ask-insureversia__suggestion-chip:hover:not(:disabled) {
    background: var(--color-primary, #0F2B46);
    color: white;
    border-color: var(--color-primary, #0F2B46);
  }

  .ask-insureversia__suggestion-chip:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* ─── Rate limit message ──────────────────────────────────────── */
  .ask-insureversia__limit {
    padding: 0.75rem 1rem;
    background: #fffbeb;
    border-top: 1px solid #fde68a;
    text-align: center;
    font-size: 0.8rem;
    color: #92400e;
    flex-shrink: 0;
  }

  .ask-insureversia__limit p {
    margin: 0.25rem 0 0;
    font-size: 0.75rem;
  }

  .ask-insureversia__limit-upgrade {
    margin-top: 0.5rem;
    padding: 0.4rem 1rem;
    border: none;
    border-radius: var(--radius-full, 9999px);
    background: var(--color-primary, #0F2B46);
    color: white;
    font-size: 0.75rem;
    font-family: inherit;
    cursor: pointer;
    transition: opacity 0.15s ease;
  }

  .ask-insureversia__limit-upgrade:hover {
    opacity: 0.9;
  }

  /* ─── Input bar ───────────────────────────────────────────────── */
  .ask-insureversia__input-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-top: 1px solid var(--border-light, #e5e7eb);
    flex-shrink: 0;
  }

  .ask-insureversia__input {
    flex: 1;
    border: 1px solid var(--border-light, #e5e7eb);
    border-radius: var(--radius-full, 9999px);
    padding: 0.5rem 0.85rem;
    font-size: 0.85rem;
    font-family: inherit;
    background: var(--surface-white, #fff);
    color: var(--text-primary, #1a1a1a);
    outline: none;
    transition: border-color 0.15s ease;
  }

  .ask-insureversia__input:focus {
    border-color: var(--color-primary, #0F2B46);
  }

  .ask-insureversia__input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .ask-insureversia__send-btn {
    background: var(--color-primary, #0F2B46);
    border: none;
    color: white;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: opacity 0.15s ease, transform 0.15s ease;
    flex-shrink: 0;
  }

  .ask-insureversia__send-btn:hover:not(:disabled) {
    transform: scale(1.05);
  }

  .ask-insureversia__send-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* ─── Footer ──────────────────────────────────────────────────── */
  .ask-insureversia__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.35rem 0.75rem;
    font-size: 0.7rem;
    color: var(--text-muted, #6b7280);
    border-top: 1px solid var(--border-light, #e5e7eb);
    flex-shrink: 0;
  }

  .ask-insureversia__signout-btn {
    background: transparent;
    border: none;
    color: var(--text-muted, #6b7280);
    font-size: 0.65rem;
    cursor: pointer;
    font-family: inherit;
    padding: 0;
    text-decoration: underline;
    text-decoration-color: transparent;
    transition: text-decoration-color 0.15s ease;
  }

  .ask-insureversia__signout-btn:hover {
    text-decoration-color: currentColor;
  }

  /* ─── Mobile: full-screen ─────────────────────────────────────── */
  @media (max-width: 768px) {
    .ask-insureversia__panel {
      inset: 0;
      width: 100%;
      max-height: 100%;
      border-radius: 0;
      bottom: 0;
      right: 0;
    }

    .ask-insureversia__messages {
      max-height: none;
      flex: 1;
    }

    .ask-insureversia__history {
      max-height: none;
    }
  }

  /* ─── Dark mode ───────────────────────────────────────────────── */
  :global([data-mode="dark"]) .ask-insureversia__panel {
    background: var(--surface-white, #1e1e2e);
    border-color: var(--border-light, #374151);
  }

  :global([data-mode="dark"]) .ask-insureversia__msg-bubble--model {
    background: var(--surface-parchment, #2a2a3e);
    color: var(--text-primary, #e5e5e5);
  }

  :global([data-mode="dark"]) .ask-insureversia__suggestion-chip {
    background: var(--surface-parchment, #2a2a3e);
    border-color: var(--border-light, #374151);
    color: var(--text-primary, #e5e5e5);
  }

  :global([data-mode="dark"]) .ask-insureversia__input {
    background: var(--surface-parchment, #2a2a3e);
    border-color: var(--border-light, #374151);
    color: var(--text-primary, #e5e5e5);
  }

  :global([data-mode="dark"]) .ask-insureversia__footer {
    border-color: var(--border-light, #374151);
  }

  :global([data-mode="dark"]) .ask-insureversia__input-bar {
    border-color: var(--border-light, #374151);
  }

  :global([data-mode="dark"]) .ask-insureversia__error {
    background: #451a1a;
    color: #fca5a5;
  }

  :global([data-mode="dark"]) .ask-insureversia__limit {
    background: #451a00;
    border-color: #78350f;
    color: #fde68a;
  }

  :global([data-mode="dark"]) .ask-insureversia__msg-bubble--model :global(code) {
    background: rgba(255,255,255,0.1);
  }

  :global([data-mode="dark"]) .ask-insureversia__personas {
    border-color: var(--border-light, #374151);
  }

  :global([data-mode="dark"]) .ask-insureversia__persona-chip {
    border-color: var(--border-light, #374151);
    color: var(--text-primary, #e5e5e5);
  }

  :global([data-mode="dark"]) .ask-insureversia__persona-chip:hover {
    background: var(--surface-parchment, #2a2a3e);
  }

  :global([data-mode="dark"]) .ask-insureversia__auth {
    border-color: var(--border-light, #374151);
  }

  :global([data-mode="dark"]) .ask-insureversia__auth-desc {
    color: var(--text-primary, #e5e5e5);
  }

  :global([data-mode="dark"]) .ask-insureversia__auth-google {
    background: var(--surface-parchment, #2a2a3e);
    border-color: var(--border-light, #374151);
    color: var(--text-primary, #e5e5e5);
  }

  :global([data-mode="dark"]) .ask-insureversia__auth-divider {
    color: var(--text-muted, #9ca3af);
  }

  :global([data-mode="dark"]) .ask-insureversia__auth-divider::before,
  :global([data-mode="dark"]) .ask-insureversia__auth-divider::after {
    background: var(--border-light, #374151);
  }

  :global([data-mode="dark"]) .ask-insureversia__auth-tabs {
    border-color: var(--border-light, #374151);
  }

  :global([data-mode="dark"]) .ask-insureversia__auth-tab {
    color: var(--text-muted, #9ca3af);
  }

  :global([data-mode="dark"]) .ask-insureversia__auth-input {
    background: var(--surface-parchment, #2a2a3e);
    border-color: var(--border-light, #374151);
    color: var(--text-primary, #e5e5e5);
  }

  :global([data-mode="dark"]) .ask-insureversia__history-header {
    border-color: var(--border-light, #374151);
  }

  :global([data-mode="dark"]) .ask-insureversia__history-title {
    color: var(--text-primary, #e5e5e5);
  }

  :global([data-mode="dark"]) .ask-insureversia__history-item {
    border-color: var(--border-light, #374151);
  }

  :global([data-mode="dark"]) .ask-insureversia__history-item-title {
    color: var(--text-primary, #e5e5e5);
  }

  :global([data-mode="dark"]) .ask-insureversia__history-resume:hover {
    background: var(--surface-parchment, #2a2a3e);
  }

  :global([data-mode="dark"]) .ask-insureversia__limit-upgrade {
    background: var(--color-accent, #C9A84C);
  }
</style>
