import { describe, it, expect } from 'vitest';
import { getTrafficSource } from './traffic-source';

describe('getTrafficSource', () => {
  it('joins the UTM params that are present', () => {
    expect(getTrafficSource('?utm_source=linkedin&utm_medium=post&utm_campaign=launch', '')).toBe(
      'linkedin / post / launch',
    );
    expect(getTrafficSource('?lang=de&utm_source=website', 'https://www.google.com/')).toBe('website');
  });

  it('falls back to the referrer host, then "direct"', () => {
    expect(getTrafficSource('', 'https://www.linkedin.com/feed/')).toBe('linkedin.com');
    expect(getTrafficSource('', '')).toBe('direct');
  });
});
