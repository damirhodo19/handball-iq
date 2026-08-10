# Final Gold Bank Integration Audit

**Verdict: ALL GOLD BANKS INTEGRATION LOCK READY**

Generated: 2026-08-10T15:04:46.619Z

## Position status

| Pos | Expected | Actual | Hash stable | Identity tactical | Status |
|---|---:|---:|---|---:|---|
| LB | 62 | 62 | true | 0 | LOCK_READY |
| RB | 63 | 63 | true | 0 | LOCK_READY |
| CB | 70 | 70 | true | 0 | LOCK_READY |
| RW | 65 | 65 | true | 0 | LOCK_READY |
| LW | 41 | 41 | true | 0 | LOCK_READY |

Total Gold: **301** (expected 301)

## Cross-bank duplicates

Pairs above threshold: 1
SEMANTIC DUPLICATE: 0
QUESTIONABLE DUPLICATE: 0

## Language

Meaningful findings: 0

## Metadata

Errors: 0 · Warnings: 29

## Distributions

```json
{
  "LB": {
    "count": 62,
    "attack": 51,
    "defence": 11,
    "difficulty": {
      "Beginner": 9,
      "Intermediate": 14,
      "Advanced": 22,
      "Expert": 17
    },
    "perception": {
      "true": 7,
      "false": 55
    },
    "handedness": {
      "unknown": 62
    },
    "systems": {
      "6-0": 42,
      "unknown": 10,
      "5-1": 2,
      "3-2-1": 2,
      "Mixed": 5,
      "Man-to-Man": 1
    },
    "numerical": {
      "unknown": 62
    }
  },
  "RB": {
    "count": 63,
    "attack": 53,
    "defence": 10,
    "difficulty": {
      "Beginner": 7,
      "Intermediate": 10,
      "Advanced": 30,
      "Expert": 16
    },
    "perception": {
      "true": 5,
      "false": 58
    },
    "handedness": {
      "unknown": 63
    },
    "systems": {
      "6-0": 37,
      "5-1": 8,
      "3-2-1": 4,
      "Mixed": 5,
      "4-2": 1,
      "Man-to-Man": 1,
      "unknown": 7
    },
    "numerical": {
      "unknown": 63
    }
  },
  "CB": {
    "count": 70,
    "attack": 59,
    "defence": 11,
    "difficulty": {
      "Beginner": 11,
      "Intermediate": 21,
      "Advanced": 27,
      "Expert": 11
    },
    "perception": {
      "true": 24,
      "false": 46
    },
    "handedness": {
      "unknown": 70
    },
    "systems": {
      "6-0": 45,
      "5-1": 5,
      "3-2-1": 3,
      "Mixed": 12,
      "4-2": 3,
      "Man-to-Man": 2
    },
    "numerical": {
      "unknown": 70
    }
  },
  "RW": {
    "count": 65,
    "attack": 54,
    "defence": 11,
    "difficulty": {
      "Beginner": 6,
      "Intermediate": 22,
      "Advanced": 26,
      "Expert": 11
    },
    "perception": {
      "true": 41,
      "false": 24
    },
    "handedness": {
      "unknown": 65
    },
    "systems": {
      "6-0": 45,
      "Mixed": 7,
      "5-1": 4,
      "unknown": 4,
      "3-3": 1,
      "4-2": 1,
      "Open": 1,
      "3-2-1": 1,
      "1-5": 1
    },
    "numerical": {
      "unknown": 65
    }
  },
  "LW": {
    "count": 41,
    "attack": 29,
    "defence": 12,
    "difficulty": {
      "Beginner": 6,
      "Intermediate": 18,
      "Advanced": 14,
      "Expert": 3
    },
    "perception": {
      "true": 31,
      "false": 10
    },
    "handedness": {
      "none": 41
    },
    "systems": {
      "6-0": 26,
      "5-1": 2,
      "3-2-1": 1,
      "Mixed": 8,
      "5+1": 1,
      "Open": 2,
      "4+2": 1
    },
    "numerical": {
      "6v6": 32,
      "transition": 4,
      "6v5": 1,
      "7v6": 1,
      "2v1": 1,
      "5v6": 2
    }
  }
}
```

### Totals
```json
{
  "count": 301,
  "attack": 246,
  "defence": 55,
  "difficulty": {
    "Beginner": 39,
    "Intermediate": 85,
    "Advanced": 119,
    "Expert": 58
  },
  "perception": {
    "true": 108,
    "false": 193
  },
  "systems": {
    "6-0": 195,
    "unknown": 21,
    "5-1": 21,
    "3-2-1": 11,
    "Mixed": 37,
    "Man-to-Man": 4,
    "4-2": 5,
    "3-3": 1,
    "Open": 3,
    "1-5": 1,
    "5+1": 1,
    "4+2": 1
  },
  "numerical": {
    "unknown": 260,
    "6v6": 32,
    "transition": 4,
    "6v5": 1,
    "7v6": 1,
    "2v1": 1,
    "5v6": 2
  }
}
```

## Validators

| Validator | Status |
|---|---|
| typecheck | PASS |
| terminology | PASS |
| uniqueSession | PASS |
| personalization | PASS |
| matchDayTactics | PASS |
| tacticalSystems | PASS |
| noPositionFallback | PASS |
| archetypes | PASS |
| leftBackGold | PASS |
| rightBackGold | PASS |
| centreBackGold | PASS |
| rightWingGold | PASS |
| leftWingGold | PASS |
| mutatingScenarioQuality | NOT_RUN |

## Legacy separation

| Pos | Gold | Primary total | Legacy | Safe later? |
|---|---:|---:|---:|---|
| LB | 62 | 62 | 0 | N/A — entire primaryPosition set is approved Gold |
| RB | 63 | 63 | 0 | N/A — entire primaryPosition set is approved Gold |
| CB | 70 | 70 | 0 | N/A — entire primaryPosition set is approved Gold |
| RW | 65 | 65 | 0 | N/A — entire primaryPosition set is approved Gold |
| LW | 41 | 41 | 0 | N/A |

## Runtime dependency

Findings: 1 · Blockers: 0
- [INFO]  Scenario selection touchpoints sampled: 28 lines (see runtimeDependencySamples)

## Statements

- Unequal positional counts are intentional
- LW curriculum is complete at 41
- Legacy cleanup has NOT yet occurred
- No deployment occurred
- No Gold scenario was modified during this pass

## GOLD BANKS LOCKED FOR CONTENT CHANGES

Content lock only. Legacy cleanup / commit / tag / push / deploy NOT authorized by this audit.

## STOP

No scenario edits. No cleanup. No commit. No tag. No push. No deploy.
