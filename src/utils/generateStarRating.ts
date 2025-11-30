export default function (rating: number): string {
    const filledStars = '★'.repeat(rating);
    const unfilledStars = '☆'.repeat(5 - rating);
    return filledStars + unfilledStars;
}