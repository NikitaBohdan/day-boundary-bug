// Original buggy version - kept only to show that the tests catch the bug.
import type { Event } from './groupByDay';

export function groupByDay<T extends Event>(events: T[]): Record<string, T[]> {
  const out: Record<string, T[]> = {};
  for (const e of events) {
    const day = new Date(e.at).toISOString().slice(0, 10);
    (out[day] ||= []).push(e);
  }
  return out;
}
