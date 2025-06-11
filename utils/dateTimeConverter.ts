/**
 * Converts an ISO date string to a local date string in the given format.
 * @param isoString ISO date string, e.g. "2025-06-11T11:00:00Z"
 * @param options Intl.DateTimeFormatOptions for formatting
 */
export function formatLocalDate(
  isoString: string,
  options: Intl.DateTimeFormatOptions
): string {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, options);
}


export function toMonthYear(isoString: string): string {
  return formatLocalDate(isoString, { month: "long", year: "numeric" });
}

export function toDayMonthYear(isoString: string): string {
  return formatLocalDate(isoString, { day: "numeric", month: "long", year: "numeric" });
}

export function toTime(isoString: string): string {
  return formatLocalDate(isoString, { hour: "2-digit", minute: "2-digit" });
}

export function toDateTime(isoString: string): string {
  return formatLocalDate(isoString, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}