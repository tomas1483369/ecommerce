import { describe, expect, it } from 'vitest';
import { carouselReducer } from './carousel';

const opts = { count: 3, duration: 1000 };
const start = { index: 0, elapsed: 0 };

describe('carouselReducer', () => {
  it('accumulates elapsed time on tick', () => {
    expect(carouselReducer(start, { type: 'tick', ms: 100 }, opts)).toEqual({
      index: 0,
      elapsed: 100,
    });
  });

  it('advances to the next slide and resets progress when the duration is reached', () => {
    expect(carouselReducer({ index: 0, elapsed: 900 }, { type: 'tick', ms: 100 }, opts)).toEqual({
      index: 1,
      elapsed: 0,
    });
  });

  it('wraps around in both directions', () => {
    expect(carouselReducer({ index: 2, elapsed: 500 }, { type: 'next' }, opts)).toEqual(start);
    expect(carouselReducer(start, { type: 'prev' }, opts)).toEqual({ index: 2, elapsed: 0 });
  });

  it('jumps to a slide and restarts its progress', () => {
    expect(carouselReducer({ index: 0, elapsed: 700 }, { type: 'go', index: 2 }, opts)).toEqual({
      index: 2,
      elapsed: 0,
    });
  });

  it('progress is a percentage of the duration', async () => {
    const { progressPercent } = await import('./carousel');
    expect(progressPercent({ index: 0, elapsed: 250 }, opts)).toBe(25);
    expect(progressPercent({ index: 0, elapsed: 5000 }, opts)).toBe(100);
  });
});
