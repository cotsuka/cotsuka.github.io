import { describe, it, expect } from 'bun:test';
import sortByDate from '../sortByDate';

// Mock type for testing - matches the HasDate interface expected by sortByDate
interface MockEntry {
  data: { date: Date };
}

describe('sortByDate', () => {
  it('sorts items by date in descending order (newest first)', () => {
    const items: MockEntry[] = [
      { data: { date: new Date('2024-01-15') } },
      { data: { date: new Date('2024-03-20') } },
      { data: { date: new Date('2024-02-10') } },
    ];

    const sorted = sortByDate(items);

    expect(sorted[0].data.date.getTime()).toBe(
      new Date('2024-03-20').getTime(),
    );
    expect(sorted[1].data.date.getTime()).toBe(
      new Date('2024-02-10').getTime(),
    );
    expect(sorted[2].data.date.getTime()).toBe(
      new Date('2024-01-15').getTime(),
    );
  });

  it('handles items with same date', () => {
    const items: MockEntry[] = [
      { data: { date: new Date('2024-01-15') } },
      { data: { date: new Date('2024-01-15') } },
    ];

    const sorted = sortByDate(items);

    expect(sorted).toHaveLength(2);
  });

  it('returns empty array for empty input', () => {
    const sorted = sortByDate([]);
    expect(sorted).toEqual([]);
  });

  it('handles single item array', () => {
    const items: MockEntry[] = [{ data: { date: new Date('2024-01-15') } }];

    const sorted = sortByDate(items);

    expect(sorted).toHaveLength(1);
  });

  it('does not mutate original array', () => {
    const items: MockEntry[] = [
      { data: { date: new Date('2024-01-01') } },
      { data: { date: new Date('2024-03-01') } },
    ];
    const originalFirst = items[0];

    sortByDate(items);

    expect(items[0]).toBe(originalFirst);
  });
});
