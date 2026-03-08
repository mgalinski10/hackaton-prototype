"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { PawPrint, LogIn, LogOut, UserCircle, ShieldCheck, Heart, LayoutDashboard } from "lucide-react";
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
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        flexShrink: 0,
      }}
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
          <>
            {user.role === "USER" && (
              <Link href="/volunteer-apply" style={{ textDecoration: "none" }}>
                <button
                  className="flex items-center gap-1.5 text-sm font-semibold"
                  style={{
                    background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.3)",
                    color: "var(--yellow)", cursor: "pointer", borderRadius: "10px",
                    padding: "8px 14px",
                  }}
                >
                  <Heart size={14} />
                  Zostań wolontariuszem
                </button>
              </Link>
            )}

            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <button
                className="flex items-center gap-1.5 text-sm"
                style={{
                  background: "var(--surface-2)", border: "1px solid var(--border)",
                  borderRadius: "10px", color: "var(--text)", cursor: "pointer",
                  padding: "8px 14px",
                }}
              >
                <LayoutDashboard size={14} style={{ color: "var(--yellow)" }} />
                Dashboard
              </button>
            </Link>

            <div style={{ position: "relative" }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 text-sm"
                style={{
                  background: "var(--surface-2)", border: "1px solid var(--border)",
                  borderRadius: "10px", color: "var(--text)", cursor: "pointer",
                  padding: "8px 14px",
                }}
              >
                <UserCircle size={16} style={{ color: "var(--yellow)" }} />
                <span>{user.name}</span>
                {user.role === "VOLUNTEER" && (
                  <span style={{ background: "var(--yellow)", color: "#000", fontSize: "0.65rem", fontWeight: 700, padding: "1px 6px", borderRadius: "20px" }}>
                    WOLONTARIUSZ
                  </span>
                )}
                {user.role === "ADMIN" && (
                  <ShieldCheck size={14} style={{ color: "var(--yellow)" }} />
                )}
              </button>

              {menuOpen && (
                <div
                  style={{
                    position: "absolute", right: 0, top: "calc(100% + 8px)",
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderRadius: "14px", minWidth: "200px", zIndex: 9999, overflow: "hidden",
                  }}
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {user.email}
                  </div>
                  {user.role === "USER" && (
                    <Link href="/volunteer-apply" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none" }}>
                      <div
                        className="flex items-center gap-2"
                        style={{ color: "var(--yellow)", cursor: "pointer", padding: "10px 14px", borderBottom: "1px solid var(--border)", fontSize: "0.875rem", fontWeight: 600 }}
                      >
                        <Heart size={14} />
                        Zostań wolontariuszem
                      </div>
                    </Link>
                  )}
                  {user.role === "ADMIN" && (
                    <Link href="/admin" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none" }}>
                      <div
                        className="flex items-center gap-2"
                        style={{ color: "var(--yellow)", cursor: "pointer", padding: "10px 14px", borderBottom: "1px solid var(--border)", fontSize: "0.875rem", fontWeight: 600 }}
                      >
                        <ShieldCheck size={14} /> Panel Admina
                      </div>
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="flex items-center gap-2 w-full"
                    style={{
                      background: "transparent", border: "none", color: "var(--text)",
                      cursor: "pointer", width: "100%", textAlign: "left",
                      padding: "10px 14px", fontSize: "0.875rem",
                    }}
                  >
                    <LogOut size={14} />
                    Wyloguj
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link href="/login" style={{ textDecoration: "none" }}>
              <button
                className="flex items-center gap-1.5 text-sm"
                style={{
                  background: "transparent", border: "1px solid var(--border)",
                  borderRadius: "10px", color: "var(--text)", cursor: "pointer",
                  padding: "8px 14px",
                }}
              >
                <LogIn size={14} />
                Zaloguj
              </button>
            </Link>
            <Link href="/register" style={{ textDecoration: "none" }}>
              <button
                className="flex items-center gap-1.5 text-sm font-semibold"
                style={{
                  background: "var(--yellow)", color: "#000", border: "none",
                  borderRadius: "10px", cursor: "pointer",
                  padding: "8px 14px",
                }}
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
