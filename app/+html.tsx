import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * Root HTML shell for web.
 * Uses dvh + viewport-fit=cover so the tab bar and Home scroll padding
 * respect the real mobile visible viewport / home-indicator safe area.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en" style={{ height: '100%' }}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
html, body, #root {
  height: 100%;
  min-height: 100%;
  min-height: 100dvh;
  width: 100%;
}
body {
  overflow: hidden;
  margin: 0;
}
#root {
  display: flex;
  flex: 1;
}
`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
