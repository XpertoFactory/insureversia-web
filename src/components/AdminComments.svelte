<script lang="ts">
  let {
    labels = {} as Record<string, string>,
  }: {
    labels: Record<string, string>;
  } = $props();

  type CommentItem = {
    id: string;
    contentType: string;
    contentId: string;
    authorUid: string;
    authorName: string;
    text: string;
    status: 'pending' | 'approved' | 'rejected';
    locale: string;
    createdAt: Date;
  };

  let state = $state<'loading' | 'denied' | 'ready'>('loading');
  let activeTab = $state<'pending' | 'approved' | 'rejected'>('pending');
  let comments = $state<Record<string, CommentItem[]>>({
    pending: [],
    approved: [],
    rejected: [],
  });
  let acting = $state<string | null>(null);

  let currentComments = $derived(comments[activeTab]);

  function countFor(tab: string): number {
    return comments[tab as keyof typeof comments]?.length ?? 0;
  }

  async function init() {
    try {
      const { onAuthChange } = await import('@/lib/auth');
      onAuthChange(async (user) => {
        if (!user || user.tier === 'anonymous') {
          state = 'denied';
          return;
        }

        const { checkIsAdmin } = await import('@/lib/admin');
        const isAdmin = await checkIsAdmin(user.uid);
        if (!isAdmin) {
          state = 'denied';
          return;
        }

        await loadAll();
        state = 'ready';
      });
    } catch (err) {
      console.error('[AdminComments] init failed:', err);
      state = 'denied';
    }
  }

  async function loadAll() {
    const { getAllComments } = await import('@/lib/admin');
    const [pending, approved, rejected] = await Promise.all([
      getAllComments('pending'),
      getAllComments('approved'),
      getAllComments('rejected'),
    ]);
    comments = { pending, approved, rejected };
  }

  async function handleApprove(id: string) {
    acting = id;
    try {
      const { updateCommentStatus } = await import('@/lib/admin');
      await updateCommentStatus(id, 'approved');
      // Move locally
      const item = findAndRemove(id);
      if (item) {
        item.status = 'approved';
        comments.approved = [item, ...comments.approved];
      }
    } catch (err) {
      console.error('[AdminComments] approve failed:', err);
    } finally {
      acting = null;
    }
  }

  async function handleReject(id: string) {
    acting = id;
    try {
      const { updateCommentStatus } = await import('@/lib/admin');
      await updateCommentStatus(id, 'rejected');
      const item = findAndRemove(id);
      if (item) {
        item.status = 'rejected';
        comments.rejected = [item, ...comments.rejected];
      }
    } catch (err) {
      console.error('[AdminComments] reject failed:', err);
    } finally {
      acting = null;
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(labels.confirmDelete || 'Are you sure you want to permanently delete this comment?')) return;
    acting = id;
    try {
      const { deleteComment } = await import('@/lib/admin');
      await deleteComment(id);
      findAndRemove(id);
    } catch (err) {
      console.error('[AdminComments] delete failed:', err);
    } finally {
      acting = null;
    }
  }

  function findAndRemove(id: string): CommentItem | null {
    for (const tab of ['pending', 'approved', 'rejected'] as const) {
      const idx = comments[tab].findIndex((c) => c.id === id);
      if (idx !== -1) {
        const [item] = comments[tab].splice(idx, 1);
        comments[tab] = [...comments[tab]];
        return item;
      }
    }
    return null;
  }

  function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  $effect(() => {
    init();
  });
</script>

<div class="admin-comments">
  {#if state === 'loading'}
    <div class="admin-comments__loading">
      <p>{labels.loading || 'Loading...'}</p>
    </div>
  {:else if state === 'denied'}
    <div class="admin-comments__denied">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
      <h2>{labels.accessDenied || 'Access Denied'}</h2>
      <p>{labels.accessDeniedMessage || 'You do not have permission to access this page.'}</p>
    </div>
  {:else}
    <!-- Tab bar -->
    <div class="admin-comments__tabs">
      {#each ['pending', 'approved', 'rejected'] as tab}
        <button
          class="admin-comments__tab"
          class:active={activeTab === tab}
          onclick={() => activeTab = tab as any}
          type="button"
        >
          {labels[`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`] || tab}
          <span class="admin-comments__badge">{countFor(tab)}</span>
        </button>
      {/each}
    </div>

    <!-- Comment list -->
    <div class="admin-comments__list">
      {#if currentComments.length === 0}
        <p class="admin-comments__empty">{labels.noComments || 'No comments in this category.'}</p>
      {:else}
        {#each currentComments as comment (comment.id)}
          <div class="admin-comments__card" class:is-acting={acting === comment.id}>
            <div class="admin-comments__card-header">
              <span class="admin-comments__author">{comment.authorName}</span>
              <span class="admin-comments__date">{formatDate(comment.createdAt)}</span>
            </div>
            <div class="admin-comments__meta">
              <span class="admin-comments__tag">{comment.contentType}/{comment.contentId}</span>
              <span class="admin-comments__locale">{comment.locale.toUpperCase()}</span>
            </div>
            <p class="admin-comments__text">{comment.text}</p>
            <div class="admin-comments__actions">
              {#if activeTab !== 'approved'}
                <button
                  class="admin-comments__btn admin-comments__btn--approve"
                  onclick={() => handleApprove(comment.id)}
                  disabled={acting === comment.id}
                  type="button"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {labels.approve || 'Approve'}
                </button>
              {/if}
              {#if activeTab !== 'rejected'}
                <button
                  class="admin-comments__btn admin-comments__btn--reject"
                  onclick={() => handleReject(comment.id)}
                  disabled={acting === comment.id}
                  type="button"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  {labels.reject || 'Reject'}
                </button>
              {/if}
              <button
                class="admin-comments__btn admin-comments__btn--delete"
                onclick={() => handleDelete(comment.id)}
                disabled={acting === comment.id}
                type="button"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                {labels.delete || 'Delete'}
              </button>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  {/if}
</div>

<style>
  .admin-comments {
    max-width: 900px;
    margin: 0 auto;
  }

  /* Loading / Denied states */
  .admin-comments__loading,
  .admin-comments__denied {
    text-align: center;
    padding: var(--space-12, 3rem) var(--space-4, 1rem);
    color: var(--text-muted, #888);
  }

  .admin-comments__denied svg {
    color: var(--text-muted, #888);
    margin-bottom: var(--space-4, 1rem);
  }

  .admin-comments__denied h2 {
    font-size: var(--text-2xl, 1.5rem);
    color: var(--text-primary, #1a1a1a);
    margin-bottom: var(--space-2, 0.5rem);
  }

  .admin-comments__denied p {
    color: var(--text-secondary, #555);
  }

  /* Tab bar */
  .admin-comments__tabs {
    display: flex;
    gap: var(--space-2, 0.5rem);
    margin-bottom: var(--space-6, 1.5rem);
    border-bottom: 2px solid var(--border-light, #e5e5e5);
    padding-bottom: var(--space-2, 0.5rem);
  }

  .admin-comments__tab {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 1rem;
    font-family: var(--font-body, sans-serif);
    font-size: var(--text-sm, 0.875rem);
    font-weight: 600;
    color: var(--text-muted, #888);
    background: none;
    border: none;
    border-radius: var(--radius-full, 9999px);
    cursor: pointer;
    transition: color 150ms ease, background 150ms ease;
  }

  .admin-comments__tab:hover {
    color: var(--text-primary, #1a1a1a);
    background: var(--surface-parchment, #faf8f4);
  }

  .admin-comments__tab.active {
    color: white;
    background: var(--color-primary, #0F2B46);
  }

  .admin-comments__badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.4rem;
    height: 1.4rem;
    padding: 0 0.35rem;
    font-size: var(--text-xs, 0.75rem);
    font-weight: 700;
    border-radius: var(--radius-full, 9999px);
    background: rgba(15, 43, 70, 0.1);
    color: var(--color-primary, #0F2B46);
  }

  .admin-comments__tab.active .admin-comments__badge {
    background: rgba(255, 255, 255, 0.25);
    color: white;
  }

  /* Comment list */
  .admin-comments__empty {
    text-align: center;
    color: var(--text-muted, #888);
    font-size: var(--text-sm, 0.875rem);
    font-style: italic;
    padding: var(--space-8, 2rem) 0;
  }

  /* Comment card */
  .admin-comments__card {
    padding: var(--space-4, 1rem);
    margin-bottom: var(--space-3, 0.75rem);
    background: var(--surface-parchment, #faf8f4);
    border-radius: var(--radius-md, 0.5rem);
    border: 1px solid var(--border-light, #e5e5e5);
    transition: opacity 150ms ease;
  }

  .admin-comments__card.is-acting {
    opacity: 0.5;
    pointer-events: none;
  }

  .admin-comments__card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: var(--space-2, 0.5rem);
    flex-wrap: wrap;
  }

  .admin-comments__author {
    font-weight: 600;
    font-size: var(--text-sm, 0.875rem);
    color: var(--text-primary, #1a1a1a);
  }

  .admin-comments__date {
    font-size: var(--text-xs, 0.75rem);
    color: var(--text-muted, #888);
  }

  .admin-comments__meta {
    display: flex;
    gap: 0.5rem;
    margin-bottom: var(--space-3, 0.75rem);
    flex-wrap: wrap;
  }

  .admin-comments__tag {
    font-size: var(--text-xs, 0.75rem);
    padding: 0.15rem 0.5rem;
    background: rgba(15, 43, 70, 0.08);
    color: var(--color-primary, #0F2B46);
    border-radius: var(--radius-full, 9999px);
    font-weight: 500;
  }

  .admin-comments__locale {
    font-size: var(--text-xs, 0.75rem);
    padding: 0.15rem 0.5rem;
    background: rgba(0, 180, 216, 0.12);
    color: var(--color-accent, #00B4D8);
    border-radius: var(--radius-full, 9999px);
    font-weight: 600;
  }

  .admin-comments__text {
    font-size: var(--text-sm, 0.875rem);
    color: var(--text-secondary, #555);
    line-height: var(--leading-relaxed, 1.65);
    margin: 0 0 var(--space-3, 0.75rem);
    white-space: pre-wrap;
    word-break: break-word;
  }

  /* Action buttons */
  .admin-comments__actions {
    display: flex;
    gap: var(--space-2, 0.5rem);
    flex-wrap: wrap;
  }

  .admin-comments__btn {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.35rem 0.75rem;
    font-family: var(--font-body, sans-serif);
    font-size: var(--text-xs, 0.75rem);
    font-weight: 600;
    border: 1px solid;
    border-radius: var(--radius-md, 0.5rem);
    cursor: pointer;
    transition: opacity 150ms ease;
  }

  .admin-comments__btn:hover { opacity: 0.85; }
  .admin-comments__btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .admin-comments__btn--approve {
    color: #276749;
    background: rgba(72, 187, 120, 0.1);
    border-color: rgba(72, 187, 120, 0.3);
  }

  .admin-comments__btn--reject {
    color: #975a16;
    background: rgba(237, 187, 51, 0.1);
    border-color: rgba(237, 187, 51, 0.3);
  }

  .admin-comments__btn--delete {
    color: #c53030;
    background: rgba(245, 101, 101, 0.1);
    border-color: rgba(245, 101, 101, 0.3);
  }
</style>
