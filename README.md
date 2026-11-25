# Day boundary bug - groupByDay

Groups events by calendar day in Kyiv (`Europe/Kyiv`), including DST transitions.

```bash
npm i
npm test              # fixed version: all 5 tests pass
npm run test:legacy   # original code: all 5 tests fail
```

## Cause

`toISOString()` always returns the date in UTC. The event `2026-03-10T01:30:00+02:00` is `2026-03-09T23:30Z`, so `slice(0, 10)` gives `2026-03-09`. Every event between 00:00 and 02:00 (winter) or 03:00 (summer) Kyiv time ended up in the previous day.

## Fix

The day is computed with `Intl.DateTimeFormat` and `timeZone: 'Europe/Kyiv'`. The offset (+2 or +3) comes from tzdata for each specific moment, so DST transitions (last Sundays of March and October) are handled automatically. The result does not depend on the server's time zone (checked with `TZ=America/New_York` and `TZ=Asia/Tokyo`).
