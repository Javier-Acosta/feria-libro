import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Feria del Libro",
  description: "Programación, invitados y novedades de la Feria del Libro.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
