"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PawPrint, Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) router.push("/");
    else setError("Nieprawidłowy email lub hasło.");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <PawPrint size={32} style={{ color: "var(--yellow)" }} />
            <span style={{ color: "var(--yellow)", fontWeight: 800, fontSize: "1.4rem" }}>Animal Helper</span>
          </Link>
          <p style={{ color: "var(--text-muted)", marginTop: "8px", fontSize: "0.9rem" }}>Mapa schronisk dla zwierząt w Polsce</p>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px" }}>
          <h1 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: "6px" }}>Zaloguj się</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "24px" }}>aby dodawać opinie o schroniskach</p>

          {/* Demo accounts */}
          <div style={{ background: "rgba(250,204,21,0.07)", border: "1px solid rgba(250,204,21,0.2)", borderRadius: "8px", padding: "12px", marginBottom: "20px", fontSize: "0.78rem" }}>
            <p style={{ fontWeight: 600, color: "var(--yellow)", marginBottom: "6px" }}>Konta demonstracyjne:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", color: "var(--text-muted)" }}>
              <span>jan@example.com / haslo123 (użytkownik)</span>
              <span>anna@example.com / haslo123 (wolontariusz)</span>
              <span>admin@animalhelper.pl / admin123 (admin)</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "6px" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="twoj@email.pl"
                required
                style={{
                  width: "100%", padding: "10px 14px", background: "var(--surface-2)",
                  border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)",
                  fontSize: "0.9rem", outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "6px" }}>Hasło</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: "100%", padding: "10px 40px 10px 14px", background: "var(--surface-2)",
                    border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)",
                    fontSize: "0.9rem", outline: "none",
                  }}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "10px 14px", color: "#ef4444", fontSize: "0.85rem" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2"
              style={{
                background: "var(--yellow)", color: "#000", border: "none",
                borderRadius: "8px", padding: "12px", fontWeight: 700,
                fontSize: "0.95rem", cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              <LogIn size={16} />
              {loading ? "Logowanie..." : "Zaloguj się"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.875rem", color: "var(--text-muted)" }}>
            Nie masz konta?{" "}
            <Link href="/register" style={{ color: "var(--yellow)", fontWeight: 600, textDecoration: "none" }}>
              Zarejestruj się
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
