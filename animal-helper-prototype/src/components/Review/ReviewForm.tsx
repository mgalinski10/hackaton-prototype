"use client";
import { useRef, useState } from "react";
import { Shelter, Review } from "@/types";
import { mockQuestions } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import StarRating from "@/components/Shelter/StarRating";
import { X, Upload, Send, ImageIcon } from "lucide-react";

interface Props {
  shelter: Shelter;
  onClose: () => void;
  onSubmitted: (review: Review) => void;
}

export default function ReviewForm({ shelter, onClose, onSubmitted }: Props) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVolunteer = user?.role === "VOLUNTEER" || user?.role === "ADMIN";
  const questions = mockQuestions.filter((q) => !q.isVolunteerQuestion || isVolunteer);

  const sliderLabels = ["Bardzo źle", "Źle", "Średnio", "Dobrze", "Świetnie"];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setPhoto(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !user) return;
    setLoading(true);

    const fd = new FormData();
    fd.append("shelterId", shelter.id);
    fd.append("name", user.name);
    fd.append("surname", user.surname);
    fd.append("rating", String(rating));
    fd.append("comment", comment);
    fd.append("isVolunteerReview", String(isVolunteer));
    if (photo) fd.append("photo", photo);

    try {
      const res = await fetch("/api/reviews", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Błąd zapisu");
      const saved: Review = await res.json();
      onSubmitted(saved);
    } catch {
      alert("Nie udało się zapisać opinii.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 10000,
        display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px",
          width: "100%", maxWidth: "540px", maxHeight: "90vh", overflow: "auto",
        }}
      >
        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text)" }}>Dodaj opinię</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "2px" }}>{shelter.name}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "20px 24px" }}>
          {/* Overall rating */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: "12px", fontSize: "0.9rem" }}>
              Ogólna ocena *
            </label>
            <div className="flex gap-2" style={{ justifyContent: "center" }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    fontSize: "2.5rem", background: "none", border: "none", cursor: "pointer",
                    color: n <= (hoverRating || rating) ? "var(--yellow)" : "var(--border)",
                    transition: "all 0.1s",
                    transform: n <= (hoverRating || rating) ? "scale(1.15)" : "scale(1)",
                    lineHeight: 1,
                  }}
                >
                  ★
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p style={{ textAlign: "center", color: "var(--yellow)", fontWeight: 600, marginTop: "8px", fontSize: "0.9rem" }}>
                {["", "Bardzo źle", "Źle", "Średnio", "Dobrze", "Znakomicie!"][rating]}
              </p>
            )}
          </div>

          {/* Survey questions */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: "16px", fontSize: "0.9rem" }}>
              Szczegółowa ocena
              {isVolunteer && (
                <span style={{ marginLeft: "8px", background: "var(--yellow)", color: "#000", fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: "4px" }}>
                  + PYTANIA WOLONTARIUSZA
                </span>
              )}
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {questions.map((q) => (
                <div key={q.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <p style={{ fontSize: "0.85rem", color: "var(--text)", flex: 1, paddingRight: "8px" }}>{q.questionText}</p>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--yellow)", minWidth: "24px", textAlign: "right" }}>
                      {answers[q.id] ?? "–"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1} max={5}
                    value={answers[q.id] ?? 3}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: Number(e.target.value) }))}
                    onMouseDown={() => !answers[q.id] && setAnswers((prev) => ({ ...prev, [q.id]: 3 }))}
                    style={{ width: "100%", accentColor: "var(--yellow)" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    {sliderLabels.map((l) => <span key={l}>{l}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: "8px", fontSize: "0.9rem" }}>
              Komentarz
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Podziel się swoimi spostrzeżeniami na temat schroniska..."
              rows={4}
              style={{
                width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)",
                borderRadius: "8px", padding: "10px 12px", color: "var(--text)",
                fontSize: "0.9rem", resize: "vertical", outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Photo */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: "8px", fontSize: "0.9rem" }}>
              Zdjęcie (opcjonalnie)
            </label>
            {photoPreview ? (
              <div style={{ position: "relative", borderRadius: "10px", overflow: "hidden", marginBottom: "8px" }}>
                <img
                  src={photoPreview}
                  alt="Podgląd"
                  style={{ width: "100%", maxHeight: "200px", objectFit: "cover", display: "block" }}
                />
                <button
                  type="button"
                  onClick={() => { setPhoto(null); setPhotoPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  style={{
                    position: "absolute", top: "8px", right: "8px",
                    background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%",
                    width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", cursor: "pointer",
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label
                style={{
                  display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px",
                  border: "2px dashed var(--border)", borderRadius: "8px", cursor: "pointer",
                  color: "var(--text-muted)", fontSize: "0.9rem",
                }}
              >
                <Upload size={16} />
                Dodaj zdjęcie
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handlePhotoChange}
                />
              </label>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={rating === 0 || loading}
            className="flex items-center justify-center gap-2 w-full"
            style={{
              background: rating === 0 ? "var(--surface-2)" : "var(--yellow)",
              color: rating === 0 ? "var(--text-muted)" : "#000",
              border: "none", borderRadius: "8px", padding: "12px",
              fontWeight: 700, fontSize: "0.95rem",
              cursor: rating === 0 ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {loading ? (
              <span>Wysyłanie...</span>
            ) : (
              <>
                <Send size={16} />
                Wyślij opinię
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
