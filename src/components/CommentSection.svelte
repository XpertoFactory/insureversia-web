<script lang="ts">
  let {
    contentType = '',
    contentId = '',
    locale = 'en',
    labels = {} as Record<string, string>,
  }: {
    contentType: string;
    contentId: string;
    locale: string;
    labels: Record<string, string>;
  } = $props();

  let comments = $state<any[]>([]);
  let pendingComments = $state<any[]>([]);
  let loading = $state(true);
  let submitting = $state(false);
  let submitted = $state(false);
  let user = $state<any>(null);
  let text = $state('');
  let displayName = $state('');
  let initialized = $state(false);

  const MAX_CHARS = 1000;
  let remaining = $derived(MAX_CHARS - text.length);

  async function init() {
    if (initialized) return;
    initialized = true;

    try {
      // Listen to auth state
      const { onAuthChange } = await import('@/lib/auth');
      onAuthChange((u) => {
        user = u;
        if (u?.displayName) displayName = u.displayName;
        if (u && u.tier !== 'anonymous') {
          loadPending(u.uid);
        } else {
          pendingComments = [];
        }
      });

      // Load approved comments
      const { getComments } = await import('@/lib/comments');
      comments = await getComments(contentType, contentId);
    } catch (err) {
      console.error('[CommentSection] init failed:', err);
    } finally {
      loading = false;
    }
  }

  async function loadPending(uid: string) {
    try {
      const { getMyPendingComments } = await import('@/lib/comments');
      pendingComments = await getMyPendingComments(contentType, contentId, uid);
    } catch {
      pendingComments = [];
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!user || user.tier === 'anonymous' || !text.trim() || submitting) return;

    submitting = true;
    submitted = false;
    try {
      const { submitComment } = await import('@/lib/comments');
      await submitComment(
        contentType,
        contentId,
        user.uid,
        displayName || user.displayName || user.email || 'Anonymous',
        text.trim(),
        locale,
      );

      // Add to pending list locally
      pendingComments = [
        {
          id: 'local-' + Date.now(),
          authorName: displayName || user.displayName || 'Anonymous',
          text: text.trim(),
          status: 'pending',
          createdAt: new Date(),
        },
        ...pendingComments,
      ];

      text = '';
      submitted = true;
      setTimeout(() => { submitted = false; }, 5000);
    } catch (err) {
      console.error('[CommentSection] submit failed:', err);
    } finally {
      submitting = false;
    }
  }

  async function handleSignIn() {
    try {
      const { signInWithGoogle } = await import('@/lib/auth');
      await signInWithGoogle();
    } catch (err) {
      console.error('[CommentSection] sign in failed:', err);
    }
  }

  function formatDate(date: Date): string {
    return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  $effect(() => {
    init();
  });
</script>

<section class="comment-section">
  <h3 class="comment-section__title">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    {labels.title || 'Comments'}
  </h3>

  {#if loading}
    <p class="comment-section__loading">{labels.loadingComments || 'Loading comments...'}</p>
  {:else}
    <!-- Pending comments (author only) -->
    {#each pendingComments as comment}
      <div class="comment comment--pending">
        <div class="comment__header">
          <span class="comment__author">{comment.authorName}</span>
          <span class="comment__badge">{labels.pendingMessage || 'Awaiting review'}</span>
        </div>
        <p class="comment__text">{comment.text}</p>
        <span class="comment__date">{formatDate(comment.createdAt)}</span>
      </div>
    {/each}

    <!-- Approved comments -->
    {#each comments as comment}
      <div class="comment">
        <div class="comment__header">
          <span class="comment__author">{comment.authorName}</span>
          <span class="comment__date">{formatDate(comment.createdAt)}</span>
        </div>
        <p class="comment__text">{comment.text}</p>
      </div>
    {/each}

    {#if comments.length === 0 && pendingComments.length === 0}
      <p class="comment-section__empty">{labels.noComments || 'No comments yet.'}</p>
    {/if}

    <!-- Comment form or sign-in prompt -->
    {#if user && user.tier !== 'anonymous'}
      {#if submitted}
        <div class="comment-section__success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          {labels.commentSubmitted || 'Your comment has been submitted and is awaiting review.'}
        </div>
      {/if}

      <form class="comment-form" onsubmit={handleSubmit}>
        <div class="comment-form__field">
          <label class="comment-form__label" for="comment-name-{contentId}">
            {labels.displayNameLabel || 'Display name'}
          </label>
          <input
            id="comment-name-{contentId}"
            type="text"
            class="comment-form__input"
            bind:value={displayName}
            maxlength="50"
            required
          />
        </div>
        <div class="comment-form__field">
          <textarea
            class="comment-form__textarea"
            bind:value={text}
            placeholder={labels.placeholder || 'Share your thoughts...'}
            maxlength={MAX_CHARS}
            rows="3"
            required
          ></textarea>
          <span class="comment-form__count">{remaining} {labels.characterCount || 'characters remaining'}</span>
        </div>
        <div class="comment-form__actions">
          <button
            type="submit"
            class="comment-form__submit"
            disabled={submitting || !text.trim() || !displayName.trim()}
          >
            {submitting ? (labels.submitting || 'Posting...') : (labels.submit || 'Post Comment')}
          </button>
          <span class="comment-form__note">{labels.moderationNote || 'Comments are moderated.'}</span>
        </div>
      </form>
    {:else}
      <div class="comment-section__auth">
        <p>{labels.loginRequired || 'Sign in to join the conversation'}</p>
        <button class="comment-section__signin" onclick={handleSignIn} type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
          {labels.loginButton || 'Sign In to Comment'}
        </button>
      </div>
    {/if}
  {/if}
</section>

<style>
  .comment-section {
    margin-top: var(--space-8, 2rem);
    padding-top: var(--space-6, 1.5rem);
    border-top: 1px solid var(--border-light, #e5e5e5);
  }

  .comment-section__title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: var(--text-lg, 1.125rem);
    font-family: var(--font-heading, serif);
    color: var(--text-primary, #1a1a1a);
    margin-bottom: var(--space-5, 1.25rem);
  }

  .comment-section__loading,
  .comment-section__empty {
    color: var(--text-muted, #888);
    font-size: var(--text-sm, 0.875rem);
    font-style: italic;
    padding: var(--space-4, 1rem) 0;
  }

  /* Individual comment */
  .comment {
    padding: var(--space-4, 1rem);
    margin-bottom: var(--space-3, 0.75rem);
    background: var(--surface-parchment, #faf8f4);
    border-radius: var(--radius-md, 0.5rem);
    border: 1px solid var(--border-light, #e5e5e5);
  }

  .comment--pending {
    border-left: 3px solid var(--color-secondary, #C9A84C);
    opacity: 0.85;
  }

  .comment__header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: var(--space-2, 0.5rem);
    flex-wrap: wrap;
  }

  .comment__author {
    font-weight: 600;
    font-size: var(--text-sm, 0.875rem);
    color: var(--text-primary, #1a1a1a);
  }

  .comment__date {
    font-size: var(--text-xs, 0.75rem);
    color: var(--text-muted, #888);
  }

  .comment__badge {
    font-size: var(--text-xs, 0.75rem);
    padding: 0.15rem 0.5rem;
    background: rgba(201, 168, 76, 0.15);
    color: var(--color-secondary, #C9A84C);
    border-radius: var(--radius-full, 9999px);
    font-weight: 600;
  }

  .comment__text {
    font-size: var(--text-sm, 0.875rem);
    color: var(--text-secondary, #555);
    line-height: var(--leading-relaxed, 1.65);
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
  }

  /* Comment form */
  .comment-form {
    margin-top: var(--space-5, 1.25rem);
  }

  .comment-form__field {
    margin-bottom: var(--space-3, 0.75rem);
  }

  .comment-form__label {
    display: block;
    font-size: var(--text-sm, 0.875rem);
    font-weight: 600;
    color: var(--text-primary, #1a1a1a);
    margin-bottom: var(--space-1, 0.25rem);
  }

  .comment-form__input,
  .comment-form__textarea {
    width: 100%;
    padding: var(--space-3, 0.75rem);
    font-family: var(--font-body, sans-serif);
    font-size: var(--text-sm, 0.875rem);
    color: var(--text-primary, #1a1a1a);
    background: var(--surface-parchment, #faf8f4);
    border: 1px solid var(--border-light, #e5e5e5);
    border-radius: var(--radius-md, 0.5rem);
    transition: border-color 150ms ease;
    box-sizing: border-box;
  }

  .comment-form__input:focus,
  .comment-form__textarea:focus {
    outline: none;
    border-color: var(--color-primary, #0F2B46);
  }

  .comment-form__textarea {
    resize: vertical;
    min-height: 80px;
  }

  .comment-form__count {
    display: block;
    text-align: right;
    font-size: var(--text-xs, 0.75rem);
    color: var(--text-muted, #888);
    margin-top: var(--space-1, 0.25rem);
  }

  .comment-form__actions {
    display: flex;
    align-items: center;
    gap: var(--space-3, 0.75rem);
    flex-wrap: wrap;
  }

  .comment-form__submit {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1.25rem;
    font-family: var(--font-body, sans-serif);
    font-size: var(--text-sm, 0.875rem);
    font-weight: 600;
    color: white;
    background: var(--color-primary, #0F2B46);
    border: none;
    border-radius: var(--radius-md, 0.5rem);
    cursor: pointer;
    transition: opacity 150ms ease;
  }

  .comment-form__submit:hover {
    opacity: 0.9;
  }

  .comment-form__submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .comment-form__note {
    font-size: var(--text-xs, 0.75rem);
    color: var(--text-muted, #888);
    font-style: italic;
  }

  /* Auth prompt */
  .comment-section__auth {
    text-align: center;
    padding: var(--space-6, 1.5rem);
    background: var(--surface-parchment, #faf8f4);
    border-radius: var(--radius-md, 0.5rem);
    border: 1px dashed var(--border-light, #e5e5e5);
    margin-top: var(--space-4, 1rem);
  }

  .comment-section__auth p {
    color: var(--text-muted, #888);
    font-size: var(--text-sm, 0.875rem);
    margin-bottom: var(--space-3, 0.75rem);
  }

  .comment-section__signin {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1.25rem;
    font-family: var(--font-body, sans-serif);
    font-size: var(--text-sm, 0.875rem);
    font-weight: 600;
    color: white;
    background: var(--color-primary, #0F2B46);
    border: none;
    border-radius: var(--radius-md, 0.5rem);
    cursor: pointer;
    transition: opacity 150ms ease;
  }

  .comment-section__signin:hover {
    opacity: 0.9;
  }

  /* Success message */
  .comment-section__success {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: var(--space-3, 0.75rem) var(--space-4, 1rem);
    background: rgba(72, 187, 120, 0.1);
    color: var(--color-success, #48BB78);
    border-radius: var(--radius-md, 0.5rem);
    font-size: var(--text-sm, 0.875rem);
    font-weight: 600;
    margin-bottom: var(--space-4, 1rem);
  }
</style>
