/** Apply the update-date fallback once, when content is loaded. */
export default function normalizeEntryDates<
  T extends { publishedAt: Date; updatedAt?: Date },
>(data: T): T & { updatedAt: Date } {
  return { ...data, updatedAt: data.updatedAt ?? data.publishedAt };
}
