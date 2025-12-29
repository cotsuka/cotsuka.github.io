export default function generateStarRating(rating: number): string {
  if (Number.isInteger(rating) && rating >= 1 && rating <= 5) {
    const filledStars = '★'.repeat(rating);
    const unfilledStars = '☆'.repeat(5 - rating);
    return filledStars + unfilledStars;
  } else {
    throw new Error(
      `Invalid rating: ${rating}. Must be an integer between 1 and 5.`,
    );
  }
}
