import { spawnSync } from 'child_process';

const steps = [
  ['node', ['scripts/verify-rls.mjs']],
  ['node', ['scripts/e2e-registration.mjs']],
  ['node', ['scripts/e2e-flow.mjs']],
];

for (const [cmd, args] of steps) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', cwd: process.cwd() });
  if (r.status !== 0) {
    console.log('FAIL');
    process.exit(1);
  }
}
console.log('PASS');
process.exit(0);
