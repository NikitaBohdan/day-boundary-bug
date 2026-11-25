export interface Event {
  at: string; 
  [key: string]: unknown;
}

export const REPORT_TZ = 'Europe/Kyiv';

const dayFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: REPORT_TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

// Returns the calendar date (YYYY-MM-DD) of the moment `at` in Kyiv time.
// The offset and DST transitions come from tzdata, no manual shifting.
export function kyivDay(at: string): string {
  const d = new Date(at);
  if (Number.isNaN(d.getTime())) {
    throw new RangeError(`Invalid date: ${at}`);
  }
  return dayFormatter.format(d);
}

export function groupByDay<T extends Event>(events: T[]): Record<string, T[]> {
  const out: Record<string, T[]> = {};
  for (const e of events) {
    (out[kyivDay(e.at)] ||= []).push(e);
  }
  return out;
}
