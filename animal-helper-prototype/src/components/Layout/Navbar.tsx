"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { PawPrint, LogIn, LogOut, UserCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        position: "relative",
        zIndex: 1000,
      }}
      className="flex items-center justify-between px-6 h-14 flex-shrink-0"
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 no-underline">
        <PawPrint size={24} style={{ color: "var(--yellow)" }} />
        <span style={{ color: "var(--yellow)", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>
          Animal Helper
        </span>
      </Link>

      {/* Right */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", cursor: "pointer" }}
            >
              <UserCircle size={16} style={{ color: "var(--yellow)" }} />
              <span>{user.name}</span>
              {user.role === "VOLUNTEER" && (
                <span
                  style={{ background: "var(--yellow)", color: "#000", fontSize: "0.65rem", fontWeight: 700, padding: "1px 6px", borderRadius: "4px" }}
                >
                  WOLONTARIUSZ
                </span>
              )}
              {user.role === "ADMIN" && (
                <ShieldCheck size={14} style={{ color: "var(--yellow)" }} />
              )}
            </button>

            {menuOpen && (
              <div
                style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", minWidth: "160px", zIndex: 9999 }}
                onMouseLeave={() => setMenuOpen(false)}
              >
                <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  {user.email}
                </div>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm"
                  style={{ background: "transparent", border: "none", color: "var(--text)", cursor: "pointer" }}
                >
                  <LogOut size={14} />
                  Wyloguj
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/login">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm"
                style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text)", cursor: "pointer" }}
              >
                <LogIn size={14} />
                Zaloguj
              </button>
            </Link>
            <Link href="/register">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold"
                style={{ background: "var(--yellow)", color: "#000", border: "none", cursor: "pointer" }}
              >
                Zarejestruj
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
