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

  // ─── DOM refs ───────────────────────────────────────────────────
  let messagesEl;
  let inputEl;
  let panelEl;

  const DAILY_LIMIT = 5;
  const SESSION_KEY = 'insureversia-chat-messages';

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
    }
  });

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
  function updateUsage() {
    import('../../lib/chat').then(({ getUsedMessages, canSendMessage }) => {
      messagesUsed = getUsedMessages();
      rateLimited = !canSendMessage();
    });
  }

  // ─── Open / Close ───────────────────────────────────────────────
  function openChat() {
    isOpen = true;
    isMinimized = false;
    requestAnimationFrame(() => inputEl?.focus());
  }

  function closeChat() {
    isOpen = false;
    isMinimized = false;
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
      closeChat();
    }
  }

  function handleInputKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // ─── Send message ───────────────────────────────────────────────
  async function sendMessage(text) {
    const msg = text || inputText.trim();
    if (!msg || isStreaming) return;

    // Check rate limit
    const chatMod = await import('../../lib/chat');
    if (!chatMod.canSendMessage()) {
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
      // Build history (exclude last user message, that's sent separately)
      const history = messages.slice(0, -1);
      const stream = chatMod.sendMessageStream(msg, locale, pageContext, pageTitle, history);

      for await (const chunk of stream) {
        streamedText += chunk;
      }

      // Push model message
      messages = [...messages, { role: 'model', text: streamedText }];
      streamedText = '';

      // Increment usage
      chatMod.incrementUsage();
      updateUsage();
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
      .replace('{limit}', String(DAILY_LIMIT));
  }

  const showSuggestions = $derived(messages.length === 0 && !isStreaming);
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
      <div class="ask-insureversia__header">
        <div class="ask-insureversia__header-left">
          <img
            src="/assets/logos/insureversia-just-logo-white-circle.png"
            alt=""
            width="24"
            height="24"
            class="ask-insureversia__header-avatar"
          />
          <span class="ask-insureversia__header-title">{i18n.title}</span>
        </div>
        <div class="ask-insureversia__header-actions">
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
            {i18n.greeting}
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
          <p>{i18n.limitReachedSub}</p>
        </div>
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
          disabled={isStreaming || rateLimited}
          aria-label={i18n.placeholder}
        />
        <button
          class="ask-insureversia__send-btn"
          onclick={() => sendMessage()}
          disabled={!inputText.trim() || isStreaming || rateLimited}
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
        <span class="ask-insureversia__disclaimer">{i18n.disclaimer}</span>
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
    max-height: 600px;
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
  }

  .ask-insureversia__header-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .ask-insureversia__header-avatar {
    border-radius: 50%;
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

  /* ─── Messages ────────────────────────────────────────────────── */
  .ask-insureversia__messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-height: 200px;
    max-height: 380px;
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
</style>
