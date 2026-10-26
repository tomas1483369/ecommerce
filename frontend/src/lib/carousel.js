// Pure state logic for auto-advancing carousels: progress and slide change can never drift apart.
export function carouselReducer(state, action, { count, duration }) {
  switch (action.type) {
    case 'tick': {
      const elapsed = state.elapsed + action.ms;
      if (elapsed >= duration) return { index: (state.index + 1) % count, elapsed: 0 };
      return { ...state, elapsed };
    }
    case 'next':
      return { index: (state.index + 1) % count, elapsed: 0 };
    case 'prev':
      return { index: (state.index - 1 + count) % count, elapsed: 0 };
    case 'go':
      return { index: action.index, elapsed: 0 };
    default:
      return state;
  }
}

export function progressPercent(state, { duration }) {
  return Math.min(100, (state.elapsed / duration) * 100);
}
