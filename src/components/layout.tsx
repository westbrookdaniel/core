import { Child } from "~/core";

export function Layout({ children }: { children: Child }) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Core App</title>
        <link rel="stylesheet" href="/_static/styles.css" />
        <script src="/_public/count.js" type="module" />
        <script src="https://unpkg.com/htmx.org@1.9.8" type="module"></script>
      </head>
      <body hx-boost="true">{children}</body>
    </html>
  );
}
