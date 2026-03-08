"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { mockShelters } from "@/data/mockData";
import {
  PawPrint, ArrowLeft, ShieldCheck, Users, Building2,
  CheckCircle2, AlertCircle, TrendingUp, Heart,
  BarChart3, FileText, Bell, X, ExternalLink, MessageSquare,
} from "lucide-react";

interface Application {
  id: string;
  name: string;
  surname: string;
  email: string;
  motivation: string;
  documentName: string;
  documentPath: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  rejectionNote: string | null;
}

const statusColors = {
  pending:  { bg: "rgba(245,158,11,0.12)", color: "#f59e0b", label: "Oczekuje" },
  approved: { bg: "rgba(34,197,94,0.12)",  color: "#22c55e", label: "Zatwierdzono" },
  rejected: { bg: "rgba(239,68,68,0.12)",  color: "#ef4444", label: "Odrzucono" },
};

// ─── Application detail modal ──────────────────────────────────────────────────

function ApplicationModal({
  app,
  onClose,
  onApprove,
  onReject,
}: {
  app: Application;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, note: string) => void;
}) {
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState("");

  const handleReject = () => {
    if (!note.trim()) { setNoteError("Notatka jest wymagana przy odrzuceniu."); return; }
    onReject(app.id, note.trim());
  };

  const st = statusColors[app.status];

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px", width: "100%", maxWidth: "560px", maxHeight: "90vh", overflow: "auto" }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text)" }}>Wniosek wolontariusza</h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Złożony {new Date(app.submittedAt).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Status */}
          <span style={{ alignSelf: "flex-start", background: st.bg, color: st.color, fontSize: "0.75rem", fontWeight: 700, padding: "4px 12px", borderRadius: "20px" }}>
            {st.label}
          </span>

          {/* Person */}
          <div style={{ background: "var(--surface-2)", borderRadius: "14px", padding: "16px", display: "flex", gap: "14px", alignItems: "center" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(250,204,21,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "var(--yellow)", fontSize: "1.1rem", flexShrink: 0 }}>
              {app.name[0]}{app.surname[0]}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>{app.name} {app.surname}</p>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{app.email}</p>
            </div>
          </div>

          {/* Motivation */}
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
              Motywacja
            </p>
            <div style={{ background: "var(--surface-2)", borderRadius: "12px", padding: "14px 16px", fontSize: "0.9rem", color: "var(--text)", lineHeight: "1.65", whiteSpace: "pre-wrap" }}>
              {app.motivation || <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Brak treści</span>}
            </div>
          </div>

          {/* Document */}
          {app.documentName && (
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                Dokument tożsamości
              </p>
              <a
                href={app.documentPath}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(250,204,21,0.08)", border: "1px solid rgba(250,204,21,0.25)", borderRadius: "12px", padding: "12px 16px", color: "var(--yellow)", textDecoration: "none" }}
              >
                <FileText size={18} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: "0.875rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{app.documentName}</span>
                <ExternalLink size={14} style={{ flexShrink: 0 }} />
              </a>
            </div>
          )}

          {/* Rejection note (readonly for already rejected) */}
          {app.status === "rejected" && app.rejectionNote && (
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                <MessageSquare size={12} /> Powód odrzucenia
              </p>
              <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "14px 16px", fontSize: "0.875rem", color: "var(--text)", lineHeight: "1.6" }}>
                {app.rejectionNote}
              </div>
            </div>
          )}

          {/* Actions for pending */}
          {app.status === "pending" && (
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {!rejecting ? (
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => onApprove(app.id)}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.35)", borderRadius: "12px", padding: "11px", color: "#22c55e", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}
                  >
                    <CheckCircle2 size={16} /> Zatwierdź
                  </button>
                  <button
                    onClick={() => setRejecting(true)}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "11px", color: "#ef4444", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}
                  >
                    <AlertCircle size={16} /> Odrzuć
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444" }}>Podaj powód odrzucenia *</p>
                  <textarea
                    value={note}
                    onChange={(e) => { setNote(e.target.value); if (e.target.value.trim()) setNoteError(""); }}
                    placeholder="Opisz powód odrzucenia wniosku (np. niekompletny dokument, brak wystarczającej motywacji)..."
                    rows={4}
                    style={{
                      width: "100%", background: "var(--surface-2)",
                      border: `1px solid ${noteError ? "#ef4444" : "var(--border)"}`,
                      borderRadius: "10px", padding: "10px 12px", color: "var(--text)",
                      fontSize: "0.875rem", resize: "vertical", outline: "none", fontFamily: "inherit",
                    }}
                  />
                  {noteError && <p style={{ fontSize: "0.78rem", color: "#ef4444" }}>{noteError}</p>}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => { setRejecting(false); setNote(""); setNoteError(""); }}
                      style={{ flex: 1, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "10px", color: "var(--text-muted)", fontSize: "0.875rem", cursor: "pointer", fontWeight: 600 }}
                    >
                      Anuluj
                    </button>
                    <button
                      onClick={handleReject}
                      style={{ flex: 1, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", borderRadius: "10px", padding: "10px", color: "#ef4444", fontSize: "0.875rem", cursor: "pointer", fontWeight: 700 }}
                    >
                      Potwierdź odrzucenie
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeSection, setActiveSection] = useState<"overview" | "applications" | "shelters">("overview");
  const [toast, setToast] = useState("");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") router.push("/login");
  }, [user, router]);

  useEffect(() => {
    fetch("/api/applications")
      .then((r) => r.json())
      .then((data: Application[]) => setApplications(data))
      .catch(() => {});
  }, []);

  if (!user || user.role !== "ADMIN") return null;

  const totalAnimals = mockShelters.reduce((acc, s) => acc + (s.currentAnimals ?? 0), 0);
  const totalCapacity = mockShelters.reduce((acc, s) => acc + (s.capacity ?? 0), 0);
  const verifiedCount = mockShelters.filter((s) => s.verificationStatus === "VERIFIED").length;
  const totalAdoptedThisYear = mockShelters.reduce((acc, s) => acc + s.animalsAdoptedThisYear, 0);
  const pendingApps = applications.filter((a) => a.status === "pending").length;

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleApprove = async (id: string) => {
    const res = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    });
    if (!res.ok) return;
    const updated: Application = await res.json();
    setApplications((prev) => prev.map((a) => a.id === id ? updated : a));
    setSelectedApp(updated);
    showToast("Wolontariusz zatwierdzony. Rola zostanie zaktualizowana przy następnym logowaniu.");
  };

  const handleReject = async (id: string, rejectionNote: string) => {
    const res = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected", rejectionNote }),
    });
    if (!res.ok) return;
    const updated: Application = await res.json();
    setApplications((prev) => prev.map((a) => a.id === id ? updated : a));
    setSelectedApp(updated);
    showToast("Aplikacja odrzucona.");
  };

  const navItems = [
    { key: "overview",      label: "Przegląd",    icon: <BarChart3 size={16} /> },
    { key: "applications",  label: `Aplikacje${pendingApps > 0 ? ` (${pendingApps})` : ""}`, icon: <FileText size={16} /> },
    { key: "shelters",      label: "Schroniska",  icon: <Building2 size={16} /> },
  ] as const;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <style>{`.toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #22c55e; color: #fff; padding: 12px 24px; border-radius: 12px; font-weight: 600; font-size: 0.875rem; z-index: 9999; box-shadow: 0 4px 20px rgba(0,0,0,0.3); max-width: 90vw; text-align: center; }`}</style>

      {/* Header */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem" }}>
            <ArrowLeft size={16} /> Mapa
          </Link>
          <div style={{ width: "1px", height: "16px", background: "var(--border)" }} />
          <PawPrint size={20} style={{ color: "var(--yellow)" }} />
          <span style={{ color: "var(--yellow)", fontWeight: 700 }}>Animal Helper</span>
          <span style={{ background: "rgba(250,204,21,0.1)", color: "var(--yellow)", fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", border: "1px solid rgba(250,204,21,0.25)", display: "flex", alignItems: "center", gap: "4px" }}>
            <ShieldCheck size={11} /> ADMIN
          </span>
        </div>
        {pendingApps > 0 && (
          <button
            onClick={() => setActiveSection("applications")}
            style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "10px", padding: "6px 12px", fontSize: "0.8rem", color: "#f59e0b", fontWeight: 600, cursor: "pointer" }}
          >
            <Bell size={14} /> {pendingApps} {pendingApps === 1 ? "nowa aplikacja" : "nowe aplikacje"}
          </button>
        )}
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <div style={{ width: "220px", background: "var(--surface)", borderRight: "1px solid var(--border)", padding: "20px 12px", flexShrink: 0 }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px", padding: "0 8px" }}>Menu</p>
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 12px", borderRadius: "10px", marginBottom: "4px",
                background: activeSection === item.key ? "rgba(250,204,21,0.1)" : "transparent",
                border: `1px solid ${activeSection === item.key ? "rgba(250,204,21,0.25)" : "transparent"}`,
                color: activeSection === item.key ? "var(--yellow)" : "var(--text-muted)",
                fontWeight: activeSection === item.key ? 700 : 500,
                fontSize: "0.875rem", cursor: "pointer", textAlign: "left",
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: "28px", overflowY: "auto" }}>

          {/* OVERVIEW */}
          {activeSection === "overview" && (
            <div>
              <h1 style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--text)", marginBottom: "24px" }}>Przegląd systemu</h1>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "28px" }}>
                {[
                  { icon: <Building2 size={20} style={{ color: "#06B6D4" }} />, value: mockShelters.length, label: "Schronisk", sub: `${verifiedCount} zweryfikowanych`, color: "#06B6D4" },
                  { icon: <PawPrint size={20} style={{ color: "var(--yellow)" }} />, value: totalAnimals, label: "Zwierząt łącznie", sub: `z ${totalCapacity} miejsc (${Math.round(totalAnimals / totalCapacity * 100)}%)`, color: "var(--yellow)" },
                  { icon: <Heart size={20} style={{ color: "#22c55e" }} />, value: totalAdoptedThisYear, label: "Adoptowanych w roku", sub: "skuteczne adopcje", color: "#22c55e" },
                  { icon: <Users size={20} style={{ color: "#f59e0b" }} />, value: pendingApps, label: "Aplikacji", sub: "czeka na weryfikację", color: "#f59e0b" },
                ].map((stat, i) => (
                  <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px" }}>
                    <div style={{ marginBottom: "10px" }}>{stat.icon}</div>
                    <p style={{ fontWeight: 800, fontSize: "1.8rem", color: stat.color, lineHeight: 1, marginBottom: "4px" }}>{stat.value}</p>
                    <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text)", marginBottom: "2px" }}>{stat.label}</p>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{stat.sub}</p>
                  </div>
                ))}
              </div>

              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px", padding: "20px" }}>
                <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <TrendingUp size={18} style={{ color: "var(--yellow)" }} /> Zapełnienie schronisk
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {mockShelters.filter(s => s.capacity).sort((a, b) => (b.currentAnimals ?? 0) / (b.capacity ?? 1) - (a.currentAnimals ?? 0) / (a.capacity ?? 1)).map((shelter) => {
                    const pct = Math.round(((shelter.currentAnimals ?? 0) / (shelter.capacity ?? 1)) * 100);
                    return (
                      <div key={shelter.id}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontSize: "0.8rem", color: "var(--text)" }}>{shelter.name.split(" – ")[1] ?? shelter.name}</span>
                          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: pct > 80 ? "var(--red)" : "var(--text-muted)" }}>{pct}%</span>
                        </div>
                        <div style={{ height: "6px", background: "var(--border)", borderRadius: "99px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: pct > 80 ? "var(--red)" : pct > 60 ? "var(--yellow)" : "#22c55e", borderRadius: "99px", transition: "width 0.6s" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* APPLICATIONS */}
          {activeSection === "applications" && (
            <div>
              <h1 style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--text)", marginBottom: "8px" }}>Aplikacje wolontariuszy</h1>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "24px" }}>
                {applications.length === 0 ? "Brak złożonych wniosków." : `${applications.length} ${applications.length === 1 ? "wniosek" : "wnioski/ów"} łącznie · ${pendingApps} oczekujących`}
              </p>

              {applications.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  <FileText size={40} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
                  Żaden wniosek nie został jeszcze złożony.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {applications.map((app) => {
                    const st = statusColors[app.status];
                    return (
                      <div
                        key={app.id}
                        onClick={() => setSelectedApp(app)}
                        style={{ background: "var(--surface)", border: `1px solid ${app.status === "pending" ? "rgba(245,158,11,0.25)" : "var(--border)"}`, borderRadius: "16px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px", cursor: "pointer", transition: "border-color 0.2s" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(250,204,21,0.4)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = app.status === "pending" ? "rgba(245,158,11,0.25)" : "var(--border)"; }}
                      >
                        <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 800, color: "var(--yellow)", fontSize: "1rem" }}>
                          {app.name[0]}{app.surname[0]}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>{app.name} {app.surname}</p>
                          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{app.email}</p>
                          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
                            {app.documentName && <span>📎 {app.documentName} · </span>}
                            {new Date(app.submittedAt).toLocaleDateString("pl-PL")}
                          </p>
                        </div>
                        <span style={{ background: st.bg, color: st.color, fontSize: "0.72rem", fontWeight: 700, padding: "4px 10px", borderRadius: "20px", flexShrink: 0 }}>
                          {st.label}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Szczegóły →</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SHELTERS */}
          {activeSection === "shelters" && (
            <div>
              <h1 style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--text)", marginBottom: "24px" }}>Schroniska</h1>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                {mockShelters.map((shelter) => {
                  const pct = shelter.capacity ? Math.round(((shelter.currentAnimals ?? 0) / shelter.capacity) * 100) : null;
                  return (
                    <div key={shelter.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden" }}>
                      {shelter.imageUrl && <img src={shelter.imageUrl} alt={shelter.name} style={{ width: "100%", height: "100px", objectFit: "cover" }} />}
                      <div style={{ padding: "14px" }}>
                        <div style={{ display: "flex", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
                          {shelter.isPrimaryShelter && <span style={{ background: "rgba(6,182,212,0.12)", color: "#06B6D4", fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: "20px" }}>GMINNE</span>}
                          <span style={{ background: shelter.verificationStatus === "VERIFIED" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.08)", color: shelter.verificationStatus === "VERIFIED" ? "#22c55e" : "#ef4444", fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: "20px" }}>
                            {shelter.verificationStatus === "VERIFIED" ? "ZWERYFIKOWANE" : "NIEZWERYFIKOWANE"}
                          </span>
                        </div>
                        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text)", marginBottom: "4px" }}>{shelter.name}</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "10px" }}>{shelter.address.city}</p>
                        {pct !== null && (
                          <>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                              <span>{shelter.currentAnimals}/{shelter.capacity} miejsc</span>
                              <span style={{ color: pct > 80 ? "var(--red)" : "var(--text-muted)", fontWeight: pct > 80 ? 700 : 400 }}>{pct}%</span>
                            </div>
                            <div style={{ height: "5px", background: "var(--border)", borderRadius: "99px", overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${pct}%`, background: pct > 80 ? "var(--red)" : "var(--yellow)", borderRadius: "99px" }} />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedApp && (
        <ApplicationModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
