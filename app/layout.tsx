import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { getSiteSettings, safeColor, defaultSettings } from "@/lib/settings";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return { title: settings.site_name, description: settings.description };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();
  const theme = {
    "--accent": safeColor(settings.accent_color, defaultSettings.accent_color),
    "--paper": safeColor(settings.background_color, defaultSettings.background_color),
    "--surface": safeColor(settings.surface_color, defaultSettings.surface_color),
    "--news-surface": safeColor(settings.news_color, defaultSettings.news_color),
    "--ink": safeColor(settings.text_color, defaultSettings.text_color),
  } as CSSProperties;
  return (
    <html lang="es" style={theme}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
