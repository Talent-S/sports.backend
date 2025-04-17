import { addMinutes, format, parse, parseISO, startOfDay } from 'date-fns';
/*
 Combines a date string ("YYYY-MM-DD") and time string ("HH:mm")
 into a full Date object in UTC.
*/
export function toUTCDateTime(date: string, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const dt = new Date(date);
  dt.setUTCHours(hours, minutes, 0, 0);
  return dt;
}

/*
  Extracts the "HH:mm" portion from a Date object (UTC-safe).
*/
export function formatTime(dateTime: Date): string {
  return format(dateTime, 'HH:mm');
}

/*
 Extracts the "YYYY-MM-DD" portion from a Date object.
*/
export function formatDate(dateTime: Date): string {
  return format(dateTime, 'yyyy-MM-dd');
}

/*
  Returns the day of week (0 for Sunday to 6 for Saturday) from a date string.
*/
export function getDayOfWeek(date: string): number {
  return new Date(date).getDay();
}

/**
 * Generate 30-minute time slots between two Date objects.
 * Returns an array of strings in "HH:mm" format.
 */
export function generateTimeSlots(
  start: Date,
  end: Date,
  slotSizeMinutes = 30
): string[] {
  const slots: string[] = [];
  let current = new Date(start);

  while (current < end) {
    slots.push(format(current, 'HH:mm'));
    current = addMinutes(current, slotSizeMinutes);
  }

  return slots;
}

/**
 * Checks if a given time (string "HH:mm") falls within a given range.
 */
export function isTimeInRange(
  time: string,
  rangeStart: string,
  rangeEnd: string
): boolean {
  const t = parse(time, 'HH:mm', new Date());
  const s = parse(rangeStart, 'HH:mm', new Date());
  const e = parse(rangeEnd, 'HH:mm', new Date());
  return t >= s && t < e;
}

/**
 * Converts a Date object to "HH:mm" local time string.
 */
export function toLocalTimeString(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Converts a Date object to "YYYY-MM-DD" local date string.
 */
export function toLocalDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}
