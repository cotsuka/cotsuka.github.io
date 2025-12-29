import { describe, it, expect } from 'bun:test';
import formatDate from '../formatDate';

describe('formatDate', () => {
  it('formats date as YYYY-MM-DD', () => {
    const date = new Date(Date.UTC(2024, 2, 15)); // March 15, 2024
    expect(formatDate(date)).toBe('2024-03-15');
  });

  it('pads single-digit months with zero', () => {
    const date = new Date(Date.UTC(2024, 0, 1)); // January 1, 2024
    expect(formatDate(date)).toBe('2024-01-01');
  });

  it('pads single-digit days with zero', () => {
    const date = new Date(Date.UTC(2024, 11, 5)); // December 5, 2024
    expect(formatDate(date)).toBe('2024-12-05');
  });

  it('handles year boundaries correctly', () => {
    const date = new Date(Date.UTC(2023, 11, 31)); // December 31, 2023
    expect(formatDate(date)).toBe('2023-12-31');
  });
});
