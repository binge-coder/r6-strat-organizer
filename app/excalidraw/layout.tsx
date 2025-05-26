import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Excalidraw Editor - R6 Strat Organizer",
};

export default function ExcalidrawLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="m-0 dark">
        <div className="h-screen w-screen flex flex-col">{children}</div>
      </body>
    </html>
  );
}
