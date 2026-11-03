import { describe, it, expect } from 'vitest';
import { 
  getISTDateParts, 
  getRolling10DayWindowStartIST, 
  isWithinRolling10DaysIST, 
  formatInIST,
  formatRelativeIST
} from '@/features/newsletter/dateUtils';

describe('Newsletter Date & Rolling 10-Day Window (Asia/Kolkata)', () => {
  it('correctly calculates IST date parts from UTC timestamp', () => {
    // 2026-11-03 04:00:00 UTC = 2026-11-03 09:30:00 IST
    const utcDate = new Date('2026-11-03T04:00:00Z');
    const parts = getISTDateParts(utcDate);

    expect(parts.year).toBe(2026);
    expect(parts.month).toBe(11);
    expect(parts.day).toBe(3);
    expect(parts.hours).toBe(9);
    expect(parts.minutes).toBe(30);
    expect(parts.dateKey).toBe('2026-11-03');
  });

  it('correctly handles day-rollover across UTC and IST', () => {
    // 2026-11-02 20:00:00 UTC = 2026-11-03 01:30:00 IST (Next calendar day in IST!)
    const lateUtcDate = new Date('2026-11-02T20:00:00Z');
    const parts = getISTDateParts(lateUtcDate);

    expect(parts.year).toBe(2026);
    expect(parts.month).toBe(11);
    expect(parts.day).toBe(3);
    expect(parts.hours).toBe(1);
    expect(parts.minutes).toBe(30);
    expect(parts.dateKey).toBe('2026-11-03');
  });

  it('defines rolling 10-calendar-day window as today + previous 9 calendar days', () => {
    // Reference date: 2026-11-03 12:00:00 IST
    const reference = new Date('2026-11-03T06:30:00Z'); // 12:00 IST
    const windowStart = getRolling10DayWindowStartIST(reference);

    // 9 days before 2026-11-03 is 2026-10-25
    const windowStartParts = getISTDateParts(windowStart);
    expect(windowStartParts.dateKey).toBe('2026-10-25');
  });

  it('validates articles published within rolling 10 calendar days', () => {
    const reference = new Date('2026-11-03T06:30:00Z'); // Today 2026-11-03 IST

    // 1. Published today in IST -> in window
    expect(isWithinRolling10DaysIST('2026-11-03T05:00:00+05:30', reference)).toBe(true);

    // 2. Published 1 day ago (2026-11-02) -> in window
    expect(isWithinRolling10DaysIST('2026-11-02T10:00:00+05:30', reference)).toBe(true);

    // 3. Published 8 days ago (2026-10-26) -> in window
    expect(isWithinRolling10DaysIST('2026-10-26T14:00:00+05:30', reference)).toBe(true);

    // 4. Published 9 days ago at 10:00 IST (2026-10-25) -> in window (at boundary)
    expect(isWithinRolling10DaysIST('2026-10-25T10:00:00+05:30', reference)).toBe(true);
  });

  it('identifies older articles that belong in the archive (> 10 calendar days ago)', () => {
    const reference = new Date('2026-11-03T06:30:00Z'); // Today 2026-11-03 IST

    // 10 days before 2026-11-03 is 2026-10-24
    expect(isWithinRolling10DaysIST('2026-10-24T23:00:00+05:30', reference)).toBe(false);

    // 20 days ago (2026-10-14) -> false (archived)
    expect(isWithinRolling10DaysIST('2026-10-14T09:00:00+05:30', reference)).toBe(false);

    // Empty date -> false
    expect(isWithinRolling10DaysIST(undefined, reference)).toBe(false);
  });

  it('formats dates in Indian Standard Time format', () => {
    const date = new Date('2026-11-03T04:00:00Z'); // 09:30 AM IST
    const formatted = formatInIST(date);
    expect(formatted).toContain('03 Nov 2026');
    expect(formatted).toContain('IST');
  });

  it('computes relative calendar descriptions', () => {
    const reference = new Date('2026-11-03T06:30:00Z');
    expect(formatRelativeIST('2026-11-03T05:00:00+05:30', reference)).toBe('Today');
    expect(formatRelativeIST('2026-11-02T10:00:00+05:30', reference)).toBe('Yesterday');
    expect(formatRelativeIST('2026-10-31T10:00:00+05:30', reference)).toBe('3 days ago');
  });
});
