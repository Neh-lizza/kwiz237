import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kwiz237",
  description: "Live, host-controlled quiz competitions for in-person events.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&family=JetBrains+Mono:wght@600;700&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
