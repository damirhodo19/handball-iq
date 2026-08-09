/**
 * Expo `web.output: 'single'` does not apply app/+html.tsx to dist/index.html.
 * Patch the exported shell so mobile web uses viewport-fit + dvh correctly.
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const indexPath = resolve(process.cwd(), 'dist/index.html');
let html = readFileSync(indexPath, 'utf8');

html = html.replace(
  /content="width=device-width, initial-scale=1, shrink-to-fit=no"/,
  'content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"',
);

if (!html.includes('100dvh')) {
  html = html.replace(
    '</style>',
    `html, body, #root {
        min-height: 100%;
        min-height: 100dvh;
      }
    </style>`,
  );
}

writeFileSync(indexPath, html);
console.log('[patch-web-index] applied viewport-fit=cover + 100dvh to dist/index.html');
