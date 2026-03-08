"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { mockShelters } from "@/data/mockData";
import {
  PawPrint, ArrowLeft, ShieldCheck, Users, Building2,
  CheckCircle2, AlertCircle, TrendingUp, Heart,
  BarChart3, FileText, Bell,
} from "lucide-react";

interface Application {
  id: string;
  name: string;
  email: string;
  submitted: string;
  status: "pending" | "approved" | "rejected";
  document: string;
}

const MOCK_APPLICATIONS: Application[] = [
  { id: "app1", name: "Karol Wiśniewski", email: "karol@example.com", submitted: "2026-03-05", status: "pending", document: "dowod_karol.pdf" },
  { id: "app2", name: "Marta Kowalczyk", email: "marta@example.com", submitted: "2026-03-04", status: "pending", document: "paszport_marta.pdf" },
  { id: "app3", name: "Paweł Nowicki", email: "pawel@example.com", submitted: "2026-03-01", status: "approved", document: "dowod_pawel.pdf" },
  { id: "app4", name: "Ola Dąbrowska", email: "ola@example.com", submitted: "2026-02-28", status: "rejected", document: "dowod_ola.pdf" },
  { id: "app5", name: "Tomasz Lewandowski", email: "tomasz@example.com", submitted: "2026-02-25", status: "approved", document: "dowod_tomasz.pdf" },
];

const statusColors = {
  pending:  { bg: "rgba(245,158,11,0.12)", color: "#f59e0b", label: "Oczekuje" },
  approved: { bg: "rgba(34,197,94,0.12)",  color: "#22c55e", label: "Zatwierdzono" },
  rejected: { bg: "rgba(239,68,68,0.12)",  color: "#ef4444", label: "Odrzucono" },
};

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);
  const [activeSection, setActiveSection] = useState<"overview" | "applications" | "shelters">("overview");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!user || user.role !== "ADMIN") router.push("/login");
  }, [user, router]);

  if (!user || user.role !== "ADMIN") return null;

  const totalAnimals = mockShelters.reduce((acc, s) => acc + (s.currentAnimals ?? 0), 0);
  const totalCapacity = mockShelters.reduce((acc, s) => acc + (s.capacity ?? 0), 0);
  const verifiedCount = mockShelters.filter((s) => s.verificationStatus === "VERIFIED").length;
  const totalAdoptedThisYear = mockShelters.reduce((acc, s) => acc + s.animalsAdoptedThisYear, 0);
  const pendingApps = applications.filter((a) => a.status === "pending").length;

  const handleAppAction = (id: string, action: "approved" | "rejected") => {
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status: action } : a));
    setToast(action === "approved" ? "Wolontariusz zatwierdzony ✓" : "Aplikacja odrzucona");
    setTimeout(() => setToast(""), 3000);
  };

  const navItems = [
    { key: "overview", label: "Przegląd", icon: <BarChart3 size={16} /> },
    { key: "applications", label: `Aplikacje ${pendingApps > 0 ? `(${pendingApps})` : ""}`, icon: <FileText size={16} /> },
    { key: "shelters", label: "Schroniska", icon: <Building2 size={16} /> },
  ] as const;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
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
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "10px", padding: "6px 12px", fontSize: "0.8rem", color: "#f59e0b", fontWeight: 600 }}>
            <Bell size={14} /> {pendingApps} nowych aplikacji
          </div>
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

              {/* Shelter capacity bars */}
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
              <h1 style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--text)", marginBottom: "24px" }}>Aplikacje wolontariuszy</h1>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {applications.map((app) => {
                  const st = statusColors[app.status];
                  return (
                    <div key={app.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px", display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 800, color: "var(--yellow)", fontSize: "1rem" }}>
                        {app.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>{app.name}</p>
                        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{app.email}</p>
                        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
                          📎 {app.document} · {new Date(app.submitted).toLocaleDateString("pl-PL")}
                        </p>
                      </div>
                      <span style={{ background: st.bg, color: st.color, fontSize: "0.72rem", fontWeight: 700, padding: "4px 10px", borderRadius: "20px", flexShrink: 0 }}>
                        {st.label}
                      </span>
                      {app.status === "pending" && (
                        <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                          <button
                            onClick={() => handleAppAction(app.id, "approved")}
                            style={{ display: "flex", alignItems: "center", gap: "4px", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "8px", padding: "6px 12px", color: "#22c55e", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}
                          >
                            <CheckCircle2 size={13} /> Zatwierdź
                          </button>
                          <button
                            onClick={() => handleAppAction(app.id, "rejected")}
                            style={{ display: "flex", alignItems: "center", gap: "4px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "8px", padding: "6px 12px", color: "#ef4444", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}
                          >
                            <AlertCircle size={13} /> Odrzuć
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
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

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
