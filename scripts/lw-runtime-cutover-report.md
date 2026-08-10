# LW Runtime Cutover Report

**Status: LW GOLD RUNTIME CUTOVER READY**

## Canonical definition

After cleanup, `primaryPosition === 'Left Wing'` is exactly the approved Gold set **941–981** (41). Same model as LB/RB/CB/RW.

## Runtime selection

- Eligible primary LW = 41
- Min ID = 941 · Max ID = 981
- 50 randomized session trials: 0 legacy IDs
- Stale offline IDs skipped; session regenerates

## Persisted / offline / admin

- Persisted: HISTORICAL SAFE (skip missing IDs; regenerate)
- Offline: SAFE
- Admin: SAFE (no hard legacy bank IDs)

## Generator

`generate-scenario-bank.mjs` refuses overwrite unless `--force-historical-regen`. Left Wing target set to 0.

## Code cutover

- scripts/generate-scenario-bank.mjs — refuse overwrite; LW target 0
- lib/development/daily-challenge.ts — regenerate when stale IDs do not resolve
- context/SessionContext.tsx — clear active session when restored bankIds missing
- scripts/scenario-bank/data/wings.mjs — historical note

## STOP

No commit. No tag. No push. No deploy.
