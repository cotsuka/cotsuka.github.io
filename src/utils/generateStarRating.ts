export const RATINGS = [1, 2, 3, 4, 5] as const;

export default function generateStarRating(rating: number): string {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}
