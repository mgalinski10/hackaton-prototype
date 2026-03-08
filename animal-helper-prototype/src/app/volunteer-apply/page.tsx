"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  PawPrint, Upload, CheckCircle2, ArrowLeft, FileText,
  User, Mail, Heart, AlertCircle, X,
} from "lucide-react";

type Step = "form" | "submitted";

export default function VolunteerApplyPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: user?.name ?? "",
    surname: user?.surname ?? "",
    email: user?.email ?? "",
    motivation: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Imię jest wymagane";
    if (!form.surname.trim()) e.surname = "Nazwisko jest wymagane";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Podaj poprawny adres e-mail";
    if (form.motivation.trim().length < 50) e.motivation = "Opisz swoją motywację (min. 50 znaków)";
    if (!file) e.file = "Dołącz skan dokumentu tożsamości";
    return e;
  };

  const handleFileChange = (f: File | null) => {
    if (!f) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowed.includes(f.type)) {
      setErrors((prev) => ({ ...prev, file: "Dozwolone formaty: JPG, PNG, WEBP, PDF" }));
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, file: "Plik nie może przekraczać 10 MB" }));
      return;
    }
    setFile(f);
    setErrors((prev) => { const n = { ...prev }; delete n.file; return n; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("surname", form.surname);
      fd.append("email", form.email);
      fd.append("motivation", form.motivation);
      if (file) fd.append("document", file);
      const res = await fetch("/api/applications", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      setStep("submitted");
    } catch {
      setErrors({ form: "Wystąpił błąd. Spróbuj ponownie." });
    } finally {
      setLoading(false);
    }
  };

  if (step === "submitted") {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%",
            background: "rgba(34,197,94,0.15)", border: "2px solid rgba(34,197,94,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
          }}>
            <CheckCircle2 size={36} style={{ color: "var(--green)" }} />
          </div>
          <h1 style={{ fontWeight: 800, fontSize: "1.6rem", color: "var(--text)", marginBottom: "12px" }}>
            Aplikacja wysłana!
          </h1>
          <p style={{ color: "var(--text-muted)", lineHeight: "1.7", marginBottom: "8px" }}>
            Twoja aplikacja na wolontariusza została przekazana do weryfikacji.
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: "1.7", marginBottom: "32px" }}>
            Sprawdzimy przesłany dokument i skontaktujemy się z Tobą na adres{" "}
            <strong style={{ color: "var(--yellow)" }}>{form.email}</strong> w ciągu 3–5 dni roboczych.
          </p>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "16px", marginBottom: "28px", textAlign: "left" }}>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Przesłane dane
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <p style={{ fontSize: "0.875rem", color: "var(--text)" }}><span style={{ color: "var(--text-muted)" }}>Imię i nazwisko: </span>{form.name} {form.surname}</p>
              <p style={{ fontSize: "0.875rem", color: "var(--text)" }}><span style={{ color: "var(--text-muted)" }}>E-mail: </span>{form.email}</p>
              <p style={{ fontSize: "0.875rem", color: "var(--text)" }}><span style={{ color: "var(--text-muted)" }}>Dokument: </span>{file?.name}</p>
            </div>
          </div>
          <Link href="/">
            <button style={{
              background: "var(--yellow)", color: "#000", border: "none",
              borderRadius: "14px", padding: "13px 32px",
              fontWeight: 700, fontSize: "0.95rem", cursor: "pointer",
            }}>
              Wróć do mapy
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Top bar */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "14px 24px", display: "flex", alignItems: "center", gap: "16px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem" }}>
          <ArrowLeft size={16} /> Powrót
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <PawPrint size={20} style={{ color: "var(--yellow)" }} />
          <span style={{ color: "var(--yellow)", fontWeight: 700, fontSize: "1rem" }}>Animal Helper</span>
        </div>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            background: "rgba(250,204,21,0.12)", border: "2px solid rgba(250,204,21,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <Heart size={28} style={{ color: "var(--yellow)" }} />
          </div>
          <h1 style={{ fontWeight: 800, fontSize: "1.8rem", color: "var(--text)", marginBottom: "10px" }}>
            Zostań wolontariuszem
          </h1>
          <p style={{ color: "var(--text-muted)", lineHeight: "1.7", maxWidth: "440px", margin: "0 auto" }}>
            Dołącz do społeczności wolontariuszy Animal Helper. Po weryfikacji otrzymasz dostęp do specjalnych funkcji i możliwości oceniania schronisk jako wolontariusz.
          </p>
        </div>

        {/* Info box */}
        <div style={{
          background: "rgba(6,182,212,0.07)", border: "1px solid rgba(6,182,212,0.2)",
          borderRadius: "16px", padding: "16px 20px", marginBottom: "32px",
          display: "flex", gap: "12px", alignItems: "flex-start",
        }}>
          <AlertCircle size={18} style={{ color: "#06B6D4", flexShrink: 0, marginTop: "2px" }} />
          <div>
            <p style={{ fontSize: "0.875rem", color: "#06B6D4", fontWeight: 600, marginBottom: "4px" }}>Jak działa weryfikacja?</p>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: "1.6" }}>
              Prześlij skan dowodu osobistego lub paszportu. Nasz zespół zweryfikuje Twoją tożsamość i nada status wolontariusza w ciągu 3–5 dni roboczych.
              Dane dokumentu są przechowywane zaszyfrowane i usuwane po weryfikacji.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Name row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  <User size={12} /> Imię
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jan"
                  style={{
                    width: "100%", padding: "11px 14px",
                    background: "var(--surface-2)", border: `1px solid ${errors.name ? "var(--red)" : "var(--border)"}`,
                    borderRadius: "12px", color: "var(--text)", fontSize: "0.9rem", outline: "none",
                  }}
                />
                {errors.name && <p style={{ color: "var(--red)", fontSize: "0.75rem", marginTop: "4px" }}>{errors.name}</p>}
              </div>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Nazwisko
                </label>
                <input
                  type="text"
                  value={form.surname}
                  onChange={(e) => setForm({ ...form, surname: e.target.value })}
                  placeholder="Kowalski"
                  style={{
                    width: "100%", padding: "11px 14px",
                    background: "var(--surface-2)", border: `1px solid ${errors.surname ? "var(--red)" : "var(--border)"}`,
                    borderRadius: "12px", color: "var(--text)", fontSize: "0.9rem", outline: "none",
                  }}
                />
                {errors.surname && <p style={{ color: "var(--red)", fontSize: "0.75rem", marginTop: "4px" }}>{errors.surname}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                <Mail size={12} /> Adres e-mail
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jan@example.com"
                style={{
                  width: "100%", padding: "11px 14px",
                  background: "var(--surface-2)", border: `1px solid ${errors.email ? "var(--red)" : "var(--border)"}`,
                  borderRadius: "12px", color: "var(--text)", fontSize: "0.9rem", outline: "none",
                }}
              />
              {errors.email && <p style={{ color: "var(--red)", fontSize: "0.75rem", marginTop: "4px" }}>{errors.email}</p>}
            </div>

            {/* Motivation */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                <Heart size={12} /> Dlaczego chcesz zostać wolontariuszem?
              </label>
              <textarea
                value={form.motivation}
                onChange={(e) => setForm({ ...form, motivation: e.target.value })}
                placeholder="Opisz swoją motywację, doświadczenie z zwierzętami i jak chcesz pomagać..."
                rows={5}
                style={{
                  width: "100%", padding: "11px 14px",
                  background: "var(--surface-2)", border: `1px solid ${errors.motivation ? "var(--red)" : "var(--border)"}`,
                  borderRadius: "12px", color: "var(--text)", fontSize: "0.875rem",
                  outline: "none", resize: "vertical", lineHeight: "1.6", fontFamily: "inherit",
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                {errors.motivation
                  ? <p style={{ color: "var(--red)", fontSize: "0.75rem" }}>{errors.motivation}</p>
                  : <span />
                }
                <p style={{ fontSize: "0.72rem", color: form.motivation.length < 50 ? "var(--text-muted)" : "var(--green)" }}>
                  {form.motivation.length} / min. 50 znaków
                </p>
              </div>
            </div>

            {/* File upload */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                <FileText size={12} /> Skan dokumentu tożsamości
              </label>

              {file ? (
                <div style={{
                  background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)",
                  borderRadius: "14px", padding: "14px 16px",
                  display: "flex", alignItems: "center", gap: "10px",
                }}>
                  <FileText size={20} style={{ color: "var(--green)", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {file.name}
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    handleFileChange(e.dataTransfer.files[0] ?? null);
                  }}
                  style={{
                    border: `2px dashed ${errors.file ? "var(--red)" : dragOver ? "var(--yellow)" : "var(--border)"}`,
                    borderRadius: "14px",
                    padding: "32px 20px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: dragOver ? "rgba(250,204,21,0.05)" : "var(--surface-2)",
                    transition: "all 0.2s",
                  }}
                >
                  <Upload size={28} style={{ color: dragOver ? "var(--yellow)" : "var(--text-muted)", margin: "0 auto 10px" }} />
                  <p style={{ fontSize: "0.9rem", color: "var(--text)", fontWeight: 600, marginBottom: "4px" }}>
                    Kliknij lub przeciągnij plik
                  </p>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    JPG, PNG, WEBP lub PDF · maks. 10 MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              />
              {errors.file && <p style={{ color: "var(--red)", fontSize: "0.75rem", marginTop: "6px" }}>{errors.file}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? "rgba(250,204,21,0.5)" : "var(--yellow)",
                color: "#000", border: "none", borderRadius: "14px",
                padding: "14px 24px", fontWeight: 700, fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "opacity 0.2s",
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: "18px", height: "18px", border: "2px solid #000", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  Wysyłanie...
                </>
              ) : (
                <>
                  <Heart size={18} />
                  Wyślij aplikację
                </>
              )}
            </button>
          </div>
        </form>

        <p style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "20px", lineHeight: "1.6" }}>
          Przesyłając aplikację akceptujesz warunki przetwarzania danych osobowych.<br />
          Dokument zostanie usunięty po zakończeniu weryfikacji.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
