"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PawPrint, Eye, EyeOff, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", surname: "", email: "", password: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Hasła nie są identyczne.");
      return;
    }
    if (form.password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków.");
      return;
    }
    setLoading(true);
    await register(form.name, form.surname, form.email, form.password);
    setLoading(false);
    router.push("/");
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", background: "var(--surface-2)",
    border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)",
    fontSize: "0.9rem", outline: "none",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <PawPrint size={32} style={{ color: "var(--yellow)" }} />
            <span style={{ color: "var(--yellow)", fontWeight: 800, fontSize: "1.4rem" }}>Animal Helper</span>
          </Link>
          <p style={{ color: "var(--text-muted)", marginTop: "8px", fontSize: "0.9rem" }}>Dołącz do społeczności ochrony zwierząt</p>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px" }}>
          <h1 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: "6px" }}>Utwórz konto</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "24px" }}>
            Po rejestracji możesz ubiegać się o status <span style={{ color: "var(--yellow)", fontWeight: 600 }}>Wolontariusza Animal Helper</span>
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "5px" }}>Imię</label>
                <input type="text" placeholder="Jan" required value={form.name} onChange={set("name")} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "5px" }}>Nazwisko</label>
                <input type="text" placeholder="Kowalski" required value={form.surname} onChange={set("surname")} style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "6px" }}>Email</label>
              <input type="email" placeholder="twoj@email.pl" required value={form.email} onChange={set("email")} style={inputStyle} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "6px" }}>Hasło</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Min. 6 znaków"
                  required
                  value={form.password}
                  onChange={set("password")}
                  style={{ ...inputStyle, paddingRight: "40px" }}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "6px" }}>Potwierdź hasło</label>
              <input type="password" placeholder="Powtórz hasło" required value={form.confirm} onChange={set("confirm")} style={inputStyle} />
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
                marginTop: "4px",
              }}
            >
              <UserPlus size={16} />
              {loading ? "Tworzenie konta..." : "Zarejestruj się"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.875rem", color: "var(--text-muted)" }}>
            Masz już konto?{" "}
            <Link href="/login" style={{ color: "var(--yellow)", fontWeight: 600, textDecoration: "none" }}>
              Zaloguj się
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
