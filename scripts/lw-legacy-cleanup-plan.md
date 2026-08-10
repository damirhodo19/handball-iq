# LW Legacy Cleanup Plan

**Status: READY_TO_DELETE**

Gold IDs (41): scn_bank_941, scn_bank_942, scn_bank_943, scn_bank_944, scn_bank_945, scn_bank_946, scn_bank_947, scn_bank_948, scn_bank_949, scn_bank_950, scn_bank_951, scn_bank_952, scn_bank_953, scn_bank_954, scn_bank_955, scn_bank_956, scn_bank_957, scn_bank_958, scn_bank_959, scn_bank_960, scn_bank_961, scn_bank_962, scn_bank_963, scn_bank_964, scn_bank_965, scn_bank_966, scn_bank_967, scn_bank_968, scn_bank_969, scn_bank_970, scn_bank_971, scn_bank_972, scn_bank_973, scn_bank_974, scn_bank_975, scn_bank_976, scn_bank_977, scn_bank_978, scn_bank_979, scn_bank_980, scn_bank_981

Legacy IDs (40): scn_bank_074, scn_bank_075, scn_bank_076, scn_bank_077, scn_bank_078, scn_bank_079, scn_bank_080, scn_bank_081, scn_bank_082, scn_bank_083, scn_bank_084, scn_bank_085, scn_bank_086, scn_bank_087, scn_bank_088, scn_bank_089, scn_bank_090, scn_bank_091, scn_bank_092, scn_bank_093, scn_bank_094, scn_bank_095, scn_bank_096, scn_bank_097, scn_bank_098, scn_bank_099, scn_bank_100, scn_bank_101, scn_bank_102, scn_bank_103, scn_bank_104, scn_bank_105, scn_bank_106, scn_bank_107, scn_bank_108, scn_bank_109, scn_bank_110, scn_bank_111, scn_bank_112, scn_bank_114

## Reference audit

- All legacy ID hits: MIGRATION / HISTORICAL (scripts reports)
- Runtime dependencies on specific legacy IDs: NONE
- UNKNOWN: NONE
- Generator `Left Wing: 40`: HISTORICAL — will be disabled from overwriting production

## Pre-cleanup hashes
```json
{
  "LB": "057e027a506ff707abc80db346d06409b0f8696c6fcf90c857b515b17548d522",
  "RB": "502abe41fdb03b499038291edb9ba0133b12a37cdd57bc316178b5062e9212e0",
  "CB": "8a0e250a1e9c5ea30c3d699c644c7d72ef80427c4046bcc42f1fcf45f4aa5c97",
  "RW": "28da60b5fd9d03268d8268fd824cf4ea2eeb68f982efa38eca56f40f2af07c21",
  "LW": "e22fe6cb3e429e98e392a6b7c2ca6bb2b6f73874c27e9f0a09af03dfa912002b"
}
```

## Files expected to change
- content/scenario-bank/scenarios.json
- scripts/generate-scenario-bank.mjs
- lib/development/daily-challenge.ts
- context/SessionContext.tsx
- scripts/lw-legacy-cleanup-*
- scripts/lw-runtime-cutover-*
- scripts/gold-bank-post-cleanup-manifest.json
- scripts/test-lw-runtime-selection.mjs
- package.json (optional script)
