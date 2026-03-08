"use client";
import Link from "next/link";
import { ArrowLeft, PawPrint } from "lucide-react";

export default function AdoptMatchPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
      <PawPrint size={48} style={{ color: "var(--text-muted)" }} />
      <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>Ta funkcja jest tymczasowo niedostępna.</p>
      <Link
        href="/"
        style={{
          display: "flex", alignItems: "center", gap: "8px",
          color: "var(--yellow)", textDecoration: "none",
          fontSize: "0.9rem", fontWeight: 600,
        }}
      >
        <ArrowLeft size={15} /> Powrót do mapy
      </Link>
    </div>
  );
}
