import { describe, it, expect } from 'vitest';
import { groupByDay as impl } from '../src/groupByDay';


const days = (ats: string[]) =>
  Object.fromEntries(
    Object.entries(impl(ats.map((at) => ({ at })))).map(([d, es]) => [d, es.map((e) => e.at)]),
  );

describe('groupByDay - day boundary in Europe/Kyiv', () => {
  it('event just after midnight in Kyiv lands on the correct day (reported case)', () => {
    expect(days(['2026-03-10T01:30:00+02:00'])).toEqual({
      '2026-03-10': ['2026-03-10T01:30:00+02:00'],
    });
  });

  it('event given in UTC (Z) is converted to Kyiv time', () => {
    expect(Object.keys(days(['2026-03-09T22:30:00Z']))).toEqual(['2026-03-10']);
  });

  it('spring DST transition (2026-03-29, UTC+2 -> UTC+3)', () => {
    const r = days([
      '2026-03-29T02:59:00+02:00', 
      '2026-03-29T04:00:00+03:00', 
      '2026-03-30T00:30:00+03:00', 
    ]);
    expect(r).toEqual({
      '2026-03-29': ['2026-03-29T02:59:00+02:00', '2026-03-29T04:00:00+03:00'],
      '2026-03-30': ['2026-03-30T00:30:00+03:00'],
    });
  });

  it('autumn DST transition (2026-10-25, UTC+3 -> UTC+2)', () => {
    const r = days([
      '2026-10-25T00:30:00+03:00', 
      '2026-10-25T23:30:00+02:00', 
      '2026-10-26T00:10:00+02:00',
    ]);
    expect(r).toEqual({
      '2026-10-25': ['2026-10-25T00:30:00+03:00', '2026-10-25T23:30:00+02:00'],
      '2026-10-26': ['2026-10-26T00:10:00+02:00'],
    });
  });

  it('day boundary: 23:59:59 and 00:00:00 are different days', () => {
    expect(Object.keys(days(['2026-07-01T23:59:59+03:00', '2026-07-02T00:00:00+03:00']))).toEqual([
      '2026-07-01',
      '2026-07-02',
    ]);
  });
});
