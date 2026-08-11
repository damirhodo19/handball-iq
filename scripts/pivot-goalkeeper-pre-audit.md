# Pivot + Goalkeeper Gold Pre-Audit

**Status: PIVOT_GK_PRE_AUDIT_READY**

Generated: 2026-08-10T19:48:35.348Z

## Baseline

- Pivot: 50 rows / 10 unique English title families / hash `777a81c3af3dea64aa5130798ca6750e1c6795ed7de968b20ad2a118114f24a1`
- Goalkeeper: 84 rows / 21 unique English title families / hash `e06abb4dd22739074bf1dd04dc8f6b063d61c80799cee2d1ebf61c1cf1821af4`
- Existing Gold: LB 62 / RB 63 / CB 70 / RW 65 / LW 41 — immutable

## Decision

- Rebuild Pivot first using unique tactical families and a 10-scenario pilot.
- Rebuild Goalkeeper only after Pivot Gold lock and runtime cutover.
- Never promote legacy variations merely to hit a count.
- Preserve all five existing Gold position hashes at every gate.

## Findings

- Pivot has 50 rows but only 10 title families.
- Goalkeeper has 84 rows but only 21 title families.
- Both legacy banks are variation-heavy and need one-decision-per-family Gold rebuilds.
- Pivot rebuild starts first; Goalkeeper remains untouched until Pivot Gold approval.
- Existing LB/RB/CB/RW/LW Gold content remains immutable throughout both rebuilds.
