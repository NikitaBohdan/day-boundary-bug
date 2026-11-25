export interface Event {
  at: string;
  [key: string]: unknown;
}

export function groupByDay<T extends Event>(events: T[]): Record<string, T[]> {
  const out: Record<string, T[]> = {};
  for (const e of events) {
    const day = new Date(e.at).toISOString().slice(0, 10);
    (out[day] ||= []).push(e);
  }
  return out;
}