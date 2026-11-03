/**
 * Date and timezone utilities for CampusPilot AI.
 * Canonical timezone: Asia/Kolkata (IST: UTC+5:30)
 */

export const IST_TIMEZONE = 'Asia/Kolkata';
export const IST_OFFSET_MINUTES = 330; // +5 hours 30 mins

/**
 * Returns current Date in Asia/Kolkata representation or formats date in IST
 */
export function getISTDateParts(date: Date | string = new Date()): {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
  dateKey: string; // YYYY-MM-DD
} {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Format using Intl.DateTimeFormat in Asia/Kolkata
  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: IST_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(d);
  const partMap: Record<string, string> = {};
  for (const part of parts) {
    partMap[part.type] = part.value;
  }

  const year = parseInt(partMap.year, 10);
  const month = parseInt(partMap.month, 10);
  const day = parseInt(partMap.day, 10);
  const hours = parseInt(partMap.hour, 10);
  const minutes = parseInt(partMap.minute, 10);
  const seconds = parseInt(partMap.second, 10);

  const monthStr = month < 10 ? `0${month}` : `${month}`;
  const dayStr = day < 10 ? `0${day}` : `${day}`;
  const dateKey = `${year}-${monthStr}-${dayStr}`;

  return { year, month, day, hours, minutes, seconds, dateKey };
}

/**
 * Calculates start of the rolling 10-calendar-day window in Asia/Kolkata.
 * Today (Day 1) + previous 9 calendar days = 10 calendar days total.
 * Returns ISO string representing 00:00:00 IST on (today - 9 days).
 */
export function getRolling10DayWindowStartIST(currentDate: Date = new Date()): Date {
  const { year, month, day } = getISTDateParts(currentDate);

  // UTC midnight for today in IST:
  // e.g. IST 00:00:00 is (UTC previous day 18:30:00)
  // Let's create date representing the calendar day in IST:
  const istDateMidnightUtc = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0) - (IST_OFFSET_MINUTES * 60 * 1000));
  
  // 9 days before today in IST (giving 10 calendar days including today):
  const windowStartDate = new Date(istDateMidnightUtc.getTime() - (9 * 24 * 60 * 60 * 1000));
  return windowStartDate;
}

/**
 * Determines whether a publication date falls within the latest 10 calendar days in Asia/Kolkata.
 */
export function isWithinRolling10DaysIST(publishedAt: string | Date | undefined, referenceDate: Date = new Date()): boolean {
  if (!publishedAt) return false;
  const pubDate = typeof publishedAt === 'string' ? new Date(publishedAt) : publishedAt;
  if (isNaN(pubDate.getTime())) return false;

  const windowStart = getRolling10DayWindowStartIST(referenceDate);
  // Also cannot be in future beyond end of reference day + 1
  return pubDate.getTime() >= windowStart.getTime();
}

/**
 * Format date for display in Indian Standard Time (IST)
 * Example: "03 Nov 2026, 11:30 AM IST"
 */
export function formatInIST(date: string | Date | undefined, includeTime: boolean = true): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Invalid Date';

  const options: Intl.DateTimeFormatOptions = {
    timeZone: IST_TIMEZONE,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(includeTime ? {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    } : {})
  };

  const formatted = new Intl.DateTimeFormat('en-IN', options).format(d);
  return includeTime ? `${formatted} IST` : formatted;
}

/**
 * Format relative calendar day in IST (e.g., "Today", "Yesterday", "3 days ago")
 */
export function formatRelativeIST(date: string | Date | undefined, referenceDate: Date = new Date()): string {
  if (!date) return '';
  const target = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(target.getTime())) return '';

  const targetParts = getISTDateParts(target);
  const refParts = getISTDateParts(referenceDate);

  // Compare calendar date difference
  const targetUtcDate = Date.UTC(targetParts.year, targetParts.month - 1, targetParts.day);
  const refUtcDate = Date.UTC(refParts.year, refParts.month - 1, refParts.day);
  const diffDays = Math.round((refUtcDate - targetUtcDate) / (24 * 60 * 60 * 1000));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays > 1 && diffDays < 10) return `${diffDays} days ago`;
  if (diffDays < 0) return 'Upcoming';
  return formatInIST(target, false);
}
