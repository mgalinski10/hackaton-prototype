"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  PawPrint, LogIn, LogOut, UserCircle, ShieldCheck,
  Heart, LayoutDashboard, Map,
} from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside
      style={{
        width: "220px",
        flexShrink: 0,
        height: "100vh",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 no-underline"
        style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border)" }}
      >
        <PawPrint size={22} style={{ color: "var(--yellow)", flexShrink: 0 }} />
        <span
          style={{
            color: "var(--yellow)",
            fontWeight: 700,
            fontSize: "1rem",
            letterSpacing: "-0.02em",
          }}
        >
          Animal Helper
        </span>
      </Link>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "12px 12px 0", display: "flex", flexDirection: "column", gap: "4px" }}>
        <NavItem href="/" icon={<Map size={16} />} label="Mapa schronisk" />

        {user && (
          <NavItem href="/dashboard" icon={<LayoutDashboard size={16} />} label="Dashboard" />
        )}

        {user?.role === "USER" && (
          <NavItem
            href="/volunteer-apply"
            icon={<Heart size={16} />}
            label="Zostań wolontariuszem"
            highlight
          />
        )}

        {user?.role === "ADMIN" && (
          <NavItem href="/admin" icon={<ShieldCheck size={16} />} label="Panel Admina" highlight />
        )}
      </nav>

      {/* User section */}
      <div style={{ padding: "12px", borderTop: "1px solid var(--border)" }}>
        {user ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 10px",
                borderRadius: "10px",
                background: "var(--surface-2)",
                marginBottom: "6px",
              }}
            >
              <UserCircle size={18} style={{ color: "var(--yellow)", flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--text)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.name}
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-muted)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.email}
                </div>
              </div>
              {user.role === "VOLUNTEER" && (
                <span
                  style={{
                    background: "var(--yellow)",
                    color: "#000",
                    fontSize: "0.55rem",
                    fontWeight: 700,
                    padding: "1px 5px",
                    borderRadius: "20px",
                    flexShrink: 0,
                  }}
                >
                  AH
                </span>
              )}
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 w-full"
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                color: "var(--text-muted)",
                cursor: "pointer",
                width: "100%",
                padding: "8px 10px",
                fontSize: "0.8rem",
                textAlign: "left",
              }}
            >
              <LogOut size={14} />
              Wyloguj
            </button>
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <Link href="/login" style={{ textDecoration: "none" }}>
              <button
                className="flex items-center gap-1.5 w-full"
                style={{
                  background: "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  color: "var(--text)",
                  cursor: "pointer",
                  width: "100%",
                  padding: "8px 12px",
                  fontSize: "0.85rem",
                }}
              >
                <LogIn size={14} />
                Zaloguj
              </button>
            </Link>
            <Link href="/register" style={{ textDecoration: "none" }}>
              <button
                className="flex items-center gap-1.5 w-full"
                style={{
                  background: "var(--yellow)",
                  color: "#000",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  width: "100%",
                  padding: "8px 12px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                Zarejestruj
              </button>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}

function NavItem({
  href,
  icon,
  label,
  highlight,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  highlight?: boolean;
}) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div
        className="flex items-center gap-2"
        style={{
          padding: "9px 12px",
          borderRadius: "10px",
          fontSize: "0.875rem",
          fontWeight: highlight ? 600 : 400,
          color: highlight ? "var(--yellow)" : "var(--text)",
          cursor: "pointer",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = "var(--surface-2)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = "transparent";
        }}
      >
        <span style={{ color: highlight ? "var(--yellow)" : "var(--text-muted)", flexShrink: 0 }}>
          {icon}
        </span>
        {label}
      </div>
    </Link>
  );
}
