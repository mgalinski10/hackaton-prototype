"use client";
import { useState } from "react";
import { Shelter } from "@/types";
import { X, Heart, CreditCard, CheckCircle2, Zap } from "lucide-react";

interface Props {
  shelter: Shelter;
  onClose: () => void;
}

const PRESET_AMOUNTS = [10, 25, 50, 100, 200];

const IMPACT: Record<number, string> = {
  10: "karma dla 5 psów przez tydzień 🐶",
  25: "szczepienie 1 zwierzęcia 💉",
  50: "sterylizacja 1 kota lub psa ✂️",
  100: "tydzień opieki weterynaryjnej 🏥",
  200: "pełna rehabilitacja 1 zwierzęcia 🌟",
};

export default function DonationModal({ shelter, onClose }: Props) {
  const [amount, setAmount] = useState(25);
  const [custom, setCustom] = useState("");
  const [step, setStep] = useState<"amount" | "payment" | "success">("amount");
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const finalAmount = custom ? parseInt(custom) || 0 : amount;

  const impactText = IMPACT[finalAmount] ?? `wsparcie ${finalAmount} zwierząt przez 1 dzień 🐾`;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setStep("success");
  };

  const formatCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "24px", width: "100%", maxWidth: "420px", overflow: "hidden" }}>
        {step === "success" ? (
          <div style={{ padding: "40px 32px", textAlign: "center" }}>
            <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(34,197,94,0.12)", border: "2px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <CheckCircle2 size={32} style={{ color: "#22c55e" }} />
            </div>
            <h2 style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--text)", marginBottom: "8px" }}>Dziękujemy! 🎉</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "8px", lineHeight: "1.6" }}>
              Twoja darowizna <strong style={{ color: "var(--yellow)" }}>{finalAmount} zł</strong> trafi do
            </p>
            <p style={{ fontWeight: 700, color: "var(--text)", marginBottom: "20px", fontSize: "0.9rem" }}>{shelter.name}</p>
            <div style={{ background: "rgba(250,204,21,0.08)", border: "1px solid rgba(250,204,21,0.2)", borderRadius: "14px", padding: "14px", marginBottom: "24px" }}>
              <p style={{ fontSize: "0.85rem", color: "var(--yellow)", fontWeight: 600 }}>Twój wkład to: {impactText}</p>
            </div>
            <button onClick={onClose} style={{ background: "var(--yellow)", color: "#000", border: "none", borderRadius: "12px", padding: "12px 32px", fontWeight: 700, cursor: "pointer", fontSize: "0.95rem" }}>
              Zamknij
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(250,204,21,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Heart size={18} style={{ color: "var(--yellow)" }} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>Wesprzyj schronisko</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{shelter.name}</p>
                </div>
              </div>
              <button onClick={onClose} style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={15} />
              </button>
            </div>

            {step === "amount" && (
              <div style={{ padding: "24px" }}>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "20px", lineHeight: "1.6" }}>
                  Każda złotówka pomaga nam zapewnić zwierzętom opiekę, jedzenie i leczenie.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px", marginBottom: "16px" }}>
                  {PRESET_AMOUNTS.map((a) => (
                    <button
                      key={a}
                      onClick={() => { setAmount(a); setCustom(""); }}
                      style={{
                        padding: "10px 4px", borderRadius: "12px", fontWeight: 700,
                        fontSize: "0.9rem", cursor: "pointer",
                        background: amount === a && !custom ? "var(--yellow)" : "var(--surface-2)",
                        color: amount === a && !custom ? "#000" : "var(--text)",
                        border: `1px solid ${amount === a && !custom ? "var(--yellow)" : "var(--border)"}`,
                        transition: "all 0.15s",
                      }}
                    >
                      {a} zł
                    </button>
                  ))}
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <input
                    type="number"
                    placeholder="Inna kwota (zł)"
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    style={{ width: "100%", padding: "11px 14px", background: "var(--surface-2)", border: `1px solid ${custom ? "var(--yellow)" : "var(--border)"}`, borderRadius: "12px", color: "var(--text)", fontSize: "0.9rem", outline: "none" }}
                  />
                </div>

                {finalAmount > 0 && (
                  <div style={{ background: "rgba(250,204,21,0.06)", border: "1px solid rgba(250,204,21,0.15)", borderRadius: "12px", padding: "12px 14px", marginBottom: "20px" }}>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      <Zap size={12} style={{ display: "inline", marginRight: "4px", color: "var(--yellow)" }} />
                      <strong style={{ color: "var(--yellow)" }}>{finalAmount} zł</strong> to {impactText}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setStep("payment")}
                  disabled={finalAmount <= 0}
                  style={{ width: "100%", background: finalAmount > 0 ? "var(--yellow)" : "var(--border)", color: finalAmount > 0 ? "#000" : "var(--text-muted)", border: "none", borderRadius: "14px", padding: "13px", fontWeight: 700, fontSize: "0.95rem", cursor: finalAmount > 0 ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  <CreditCard size={18} />
                  Dalej — {finalAmount} zł
                </button>
              </div>
            )}

            {step === "payment" && (
              <form onSubmit={handlePay} style={{ padding: "24px" }}>
                <div style={{ background: "rgba(250,204,21,0.06)", borderRadius: "12px", padding: "12px 14px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Kwota darowizny</span>
                  <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--yellow)" }}>{finalAmount} zł</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Numer karty</label>
                    <input
                      required value={cardNumber}
                      onChange={(e) => setCardNumber(formatCard(e.target.value))}
                      placeholder="0000 0000 0000 0000"
                      style={{ width: "100%", padding: "11px 14px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "12px", color: "var(--text)", fontSize: "0.9rem", outline: "none", letterSpacing: "0.08em" }}
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Ważność</label>
                      <input
                        required value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/RR"
                        style={{ width: "100%", padding: "11px 14px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "12px", color: "var(--text)", fontSize: "0.9rem", outline: "none" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.04em" }}>CVC</label>
                      <input
                        required value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 3))}
                        placeholder="123"
                        style={{ width: "100%", padding: "11px 14px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "12px", color: "var(--text)", fontSize: "0.9rem", outline: "none" }}
                      />
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "16px", textAlign: "center" }}>
                  🔒 Płatność jest zaszyfrowana i bezpieczna (demo)
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: "100%", background: loading ? "rgba(250,204,21,0.5)" : "var(--yellow)", color: "#000", border: "none", borderRadius: "14px", padding: "13px", fontWeight: 700, fontSize: "0.95rem", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  {loading ? <><div style={{ width: "16px", height: "16px", border: "2px solid #000", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Przetwarzanie...</> : <><Heart size={16} /> Zapłać {finalAmount} zł</>}
                </button>

                <button type="button" onClick={() => setStep("amount")} style={{ width: "100%", background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "10px", cursor: "pointer", padding: "6px" }}>
                  ← Zmień kwotę
                </button>
              </form>
            )}
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
