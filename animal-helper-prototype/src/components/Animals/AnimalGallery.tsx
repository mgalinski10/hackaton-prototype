"use client";
import { useState } from "react";
import { Animal } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Heart, X, PawPrint, CheckCircle2, Calendar } from "lucide-react";

interface Props {
  animals: Animal[];
}

const statusLabel: Record<Animal["status"], { label: string; color: string; bg: string }> = {
  available: { label: "Do adopcji", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  reserved:  { label: "Zarezerwowane", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  adopted:   { label: "Adoptowane", color: "#888", bg: "rgba(136,136,136,0.12)" },
};

const speciesEmoji: Record<Animal["species"], string> = {
  dog: "🐕",
  cat: "🐈",
  other: "🐾",
};

function ageLabel(months: number): string {
  if (months < 12) return `${months} mies.`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return m > 0 ? `${y} l. ${m} mies.` : `${y} ${y === 1 ? "rok" : y < 5 ? "lata" : "lat"}`;
}

export default function AnimalGallery({ animals }: Props) {
  const { user } = useAuth();
  const [selected, setSelected] = useState<Animal | null>(null);
  const [adoptForm, setAdoptForm] = useState({ name: "", email: "", message: "" });
  const [adoptSent, setAdoptSent] = useState(false);
  const [adoptLoading, setAdoptLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "dog" | "cat">("all");

  const visible = animals.filter((a) => filter === "all" || a.species === filter);
  const available = animals.filter((a) => a.status === "available").length;

  const handleAdopt = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdoptLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setAdoptLoading(false);
    setAdoptSent(true);
  };

  if (animals.length === 0) {
    return (
      <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center", padding: "20px 0" }}>
        Brak zwierząt w bazie tego schroniska.
      </p>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <h3 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", display: "flex", alignItems: "center", gap: "6px" }}>
          <PawPrint size={16} style={{ color: "var(--yellow)" }} />
          Zwierzęta do adopcji
          <span style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "20px" }}>
            {available} dostępnych
          </span>
        </h3>
        <div style={{ display: "flex", gap: "4px" }}>
          {(["all", "dog", "cat"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? "var(--yellow)" : "var(--surface-2)",
                color: filter === f ? "#000" : "var(--text-muted)",
                border: "1px solid var(--border)",
                borderRadius: "8px", padding: "3px 10px",
                fontSize: "0.72rem", fontWeight: 600, cursor: "pointer",
              }}
            >
              {f === "all" ? "Wszystkie" : f === "dog" ? "🐕 Psy" : "🐈 Koty"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {visible.map((animal) => {
          const st = statusLabel[animal.status];
          return (
            <div
              key={animal.id}
              onClick={() => { setSelected(animal); setAdoptSent(false); setAdoptForm({ name: user?.name + " " + (user?.surname ?? "") || "", email: user?.email || "", message: "" }); }}
              style={{
                background: "var(--surface-2)", borderRadius: "14px",
                border: "1px solid var(--border)", overflow: "hidden",
                cursor: "pointer", transition: "transform 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "rgba(250,204,21,0.3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              <div style={{ position: "relative", width: "100%", paddingTop: "70%", overflow: "hidden" }}>
                <img
                  src={animal.imageUrl}
                  alt={animal.name}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", top: "6px", right: "6px", background: st.bg, color: st.color, fontSize: "0.62rem", fontWeight: 700, padding: "2px 7px", borderRadius: "20px", backdropFilter: "blur(4px)" }}>
                  {st.label}
                </div>
              </div>
              <div style={{ padding: "8px 10px" }}>
                <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text)" }}>
                  {speciesEmoji[animal.species]} {animal.name}
                </p>
                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  {animal.breed} · {ageLabel(animal.age)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Animal detail modal */}
      {selected && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflow: "auto" }}>
            {/* Image */}
            <div style={{ position: "relative", width: "100%", paddingTop: "55%", overflow: "hidden", borderRadius: "20px 20px 0 0" }}>
              <img src={selected.imageUrl} alt={selected.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              <button
                onClick={() => setSelected(null)}
                style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%", width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer" }}
              >
                <X size={15} />
              </button>
              <div style={{ position: "absolute", bottom: "10px", left: "12px" }}>
                <span style={{ background: statusLabel[selected.status].bg, color: statusLabel[selected.status].color, fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: "20px" }}>
                  {statusLabel[selected.status].label}
                </span>
              </div>
            </div>

            <div style={{ padding: "20px" }}>
              <h2 style={{ fontWeight: 800, fontSize: "1.4rem", color: "var(--text)", marginBottom: "4px" }}>
                {speciesEmoji[selected.species]} {selected.name}
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "16px" }}>{selected.breed}</p>

              {/* Stats row */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                {[
                  { label: "Wiek", value: ageLabel(selected.age) },
                  { label: "Płeć", value: selected.gender === "male" ? "♂ Samiec" : "♀ Samica" },
                  { label: "Szczepiony", value: selected.vaccinated ? "✓ Tak" : "✗ Nie" },
                  { label: "Sterylizowany", value: selected.sterilized ? "✓ Tak" : "✗ Nie" },
                ].map((item) => (
                  <div key={item.label} style={{ flex: 1, background: "var(--surface-2)", borderRadius: "10px", padding: "8px 10px", textAlign: "center" }}>
                    <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{item.label}</p>
                    <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text)" }}>{item.value}</p>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: "1.65", marginBottom: "20px" }}>
                {selected.description}
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "20px" }}>
                <Calendar size={12} />
                W schronisku od: {new Date(selected.arrivedAt).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })}
              </div>

              {/* Adoption form or success */}
              {selected.status === "available" ? (
                adoptSent ? (
                  <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "14px", padding: "20px", textAlign: "center" }}>
                    <CheckCircle2 size={32} style={{ color: "#22c55e", margin: "0 auto 10px" }} />
                    <p style={{ fontWeight: 700, color: "#22c55e", marginBottom: "6px" }}>Wniosek wysłany!</p>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: "1.6" }}>
                      Skontaktujemy się z Tobą wkrótce. Tymczasem {selected.name} został{selected.gender === "female" ? "a" : ""} oznaczon{selected.gender === "female" ? "a" : "y"} jako zarezerwowan{selected.gender === "female" ? "a" : "y"}.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleAdopt}>
                    <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Heart size={16} style={{ color: "var(--yellow)" }} /> Chcę adoptować {selected.name}
                    </p>
                    {!user && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "8px" }}>
                        <input
                          required
                          placeholder="Imię i nazwisko"
                          value={adoptForm.name}
                          onChange={(e) => setAdoptForm({ ...adoptForm, name: e.target.value })}
                          style={{ padding: "10px 12px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text)", fontSize: "0.875rem", outline: "none" }}
                        />
                        <input
                          required type="email"
                          placeholder="E-mail"
                          value={adoptForm.email}
                          onChange={(e) => setAdoptForm({ ...adoptForm, email: e.target.value })}
                          style={{ padding: "10px 12px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text)", fontSize: "0.875rem", outline: "none" }}
                        />
                      </div>
                    )}
                    <textarea
                      placeholder="Opowiedz nam o sobie i swoim domu (opcjonalnie)..."
                      value={adoptForm.message}
                      onChange={(e) => setAdoptForm({ ...adoptForm, message: e.target.value })}
                      rows={3}
                      style={{ width: "100%", padding: "10px 12px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text)", fontSize: "0.875rem", outline: "none", resize: "none", fontFamily: "inherit", marginBottom: "10px" }}
                    />
                    <button
                      type="submit"
                      disabled={adoptLoading}
                      style={{ width: "100%", background: adoptLoading ? "rgba(250,204,21,0.5)" : "var(--yellow)", color: "#000", border: "none", borderRadius: "12px", padding: "12px", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                    >
                      {adoptLoading ? (
                        <><div style={{ width: "16px", height: "16px", border: "2px solid #000", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Wysyłanie...</>
                      ) : (
                        <><Heart size={16} /> Wyślij wniosek o adopcję</>
                      )}
                    </button>
                  </form>
                )
              ) : (
                <div style={{ background: "var(--surface-2)", borderRadius: "12px", padding: "14px", textAlign: "center" }}>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                    {selected.status === "reserved" ? "To zwierzę jest aktualnie zarezerwowane." : "To zwierzę znalazło już swój dom 🎉"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
