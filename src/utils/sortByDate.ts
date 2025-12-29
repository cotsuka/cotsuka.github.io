interface HasDate {
  data: { date: Date };
}

export default function sortByDate<T extends HasDate>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}
