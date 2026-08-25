export const RATINGS = [1, 2, 3, 4, 5] as const;

const MIN_RATING = Math.min(...RATINGS);
const MAX_RATING = Math.max(...RATINGS);

export default function generateStarRating(rating: number): string {
  if (
    Number.isInteger(rating) &&
    rating >= MIN_RATING &&
    rating <= MAX_RATING
  ) {
    const filledStars = '★'.repeat(rating);
    const unfilledStars = '☆'.repeat(5 - rating);
    return filledStars + unfilledStars;
  } else {
    throw new Error(
      `Invalid rating: ${rating}. Must be an integer between 1 and 5.`,
    );
  }
}
