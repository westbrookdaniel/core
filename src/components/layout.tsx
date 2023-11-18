import { include, Child } from "~/core";

include("https://unpkg.com/htmx.org@1.9.8", { type: "module" });

export function Layout({ children }: { children: Child }) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Document</title>
        <style>{`
          * {
            background: #111;
            color: #999;
          }
          .red {
            color: red;
          }
        `}</style>
      </head>
      <body hx-boost="true">
        <header>
          <a href="/">Contacts</a>
          <a href="/counter">Counter</a>
        </header>
        {children}
      </body>
    </html>
  );
}
