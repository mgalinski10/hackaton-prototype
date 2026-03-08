import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Animal Helper – Mapa Schronisk w Polsce",
  description: "Znajdź schronisko dla zwierząt w Polsce. Sprawdzaj opinie, adoptuj zwierzęta.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
