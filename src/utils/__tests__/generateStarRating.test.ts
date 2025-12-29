import { describe, it, expect } from 'bun:test';
import generateStarRating from '../generateStarRating';

describe('generateStarRating', () => {
  it('returns 5 filled stars for rating 5', () => {
    expect(generateStarRating(5)).toBe('★★★★★');
  });

  it('returns 1 filled and 4 empty stars for rating 1', () => {
    expect(generateStarRating(1)).toBe('★☆☆☆☆');
  });

  it('returns 3 filled and 2 empty stars for rating 3', () => {
    expect(generateStarRating(3)).toBe('★★★☆☆');
  });

  it('throws for rating 0', () => {
    expect(() => generateStarRating(0)).toThrow(
      'Invalid rating: 0. Must be an integer between 1 and 5.',
    );
  });

  it('throws for rating 6', () => {
    expect(() => generateStarRating(6)).toThrow(
      'Invalid rating: 6. Must be an integer between 1 and 5.',
    );
  });

  it('throws for non-integer rating', () => {
    expect(() => generateStarRating(3.5)).toThrow(
      'Invalid rating: 3.5. Must be an integer between 1 and 5.',
    );
  });

  it('throws for negative rating', () => {
    expect(() => generateStarRating(-1)).toThrow(
      'Invalid rating: -1. Must be an integer between 1 and 5.',
    );
  });
});
