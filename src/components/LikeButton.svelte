<script lang="ts">
  let {
    contentType = '',
    contentId = '',
    likeLabel = 'Like',
    likedLabel = 'Liked',
  }: {
    contentType: string;
    contentId: string;
    likeLabel?: string;
    likedLabel?: string;
  } = $props();

  let count = $state(0);
  let liked = $state(false);
  let loading = $state(false);
  let initialized = $state(false);

  async function init() {
    if (initialized) return;
    initialized = true;
    try {
      const { getLikeStatus } = await import('@/lib/likes');
      const status = await getLikeStatus(contentType, contentId);
      count = status.count;
      liked = status.liked;
    } catch (err) {
      console.error('[LikeButton] init failed:', err);
    }
  }

  async function toggle() {
    if (loading) return;
    loading = true;

    // Optimistic update
    const prevCount = count;
    const prevLiked = liked;
    liked = !liked;
    count = liked ? count + 1 : Math.max(0, count - 1);

    try {
      const { toggleLike } = await import('@/lib/likes');
      const result = await toggleLike(contentType, contentId);
      count = result.count;
      liked = result.liked;
    } catch (err) {
      console.error('[LikeButton] toggle failed:', err);
      count = prevCount;
      liked = prevLiked;
    } finally {
      loading = false;
    }
  }

  function handleClick() {
    if (!initialized) {
      init().then(toggle);
    } else {
      toggle();
    }
  }

  // Lazy-load status when visible (after hydration)
  $effect(() => {
    init();
  });
</script>

<button
  class="like-btn"
  class:is-liked={liked}
  onclick={handleClick}
  disabled={loading}
  aria-label={liked ? likedLabel : likeLabel}
  aria-pressed={liked}
>
  <svg class="like-btn__icon" width="18" height="18" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
  {#if count > 0}
    <span class="like-btn__count">{count}</span>
  {/if}
</button>

<style>
  .like-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem 0.65rem;
    font-family: var(--font-body, sans-serif);
    font-size: var(--text-xs, 0.75rem);
    font-weight: 600;
    color: var(--text-muted, #888);
    background: transparent;
    border: 1px solid var(--border-light, #e5e5e5);
    border-radius: var(--radius-full, 9999px);
    cursor: pointer;
    transition: all 150ms ease;
    user-select: none;
    line-height: 1;
  }

  .like-btn:hover {
    color: #e53e3e;
    border-color: #e53e3e;
    background: rgba(229, 62, 62, 0.05);
  }

  .like-btn.is-liked {
    color: #e53e3e;
    border-color: #e53e3e;
    background: rgba(229, 62, 62, 0.08);
  }

  .like-btn:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  .like-btn__icon {
    flex-shrink: 0;
    transition: transform 200ms ease;
  }

  .like-btn.is-liked .like-btn__icon {
    transform: scale(1.15);
  }

  .like-btn__count {
    font-variant-numeric: tabular-nums;
  }
</style>
