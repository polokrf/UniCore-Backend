export const parseBkashDate = (dateStr?: string): Date => {
  if (!dateStr) return new Date();

  const match = dateStr.match(
    /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}):(\d{3})\s*GMT([+-]\d{2})(\d{2})$/,
  );

  if (!match) {
    const fallback = new Date(dateStr);
    return isNaN(fallback.getTime()) ? new Date() : fallback;
  }

  const [, base, ms, tzHour, tzMin] = match;
  const parsed = new Date(`${base}.${ms}${tzHour}:${tzMin}`);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};
