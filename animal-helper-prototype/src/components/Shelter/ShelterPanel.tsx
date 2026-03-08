"use client";
import { useEffect, useState } from "react";
import { Shelter, Review } from "@/types";
import { useAuth } from "@/context/AuthContext";
import StarRating from "./StarRating";
import ReviewForm from "@/components/Review/ReviewForm";
import {
  X, MapPin, Phone, Mail, CheckCircle2, AlertCircle,
  MessageSquarePlus, ChevronDown, ChevronUp,
  Crown, FileText, Shield, TrendingUp, Skull, Clock, ImageIcon,
} from "lucide-react";

interface Props {
  shelter: Shelter;
  onClose: () => void;
}

function getAdoptionColor(rate: number): string {
  if (rate > 75) return "#22c55e";
  if (rate >= 50) return "#f59e0b";
  return "#ef4444";
}

function getMortalityColor(rate: number): string {
  if (rate < 3) return "#22c55e";
  if (rate <= 6) return "#f59e0b";
  return "#ef4444";
}

function getStayColor(days: number): string {
  if (days < 20) return "#22c55e";
  if (days <= 35) return "#f59e0b";
  return "#ef4444";
}

export default function ShelterPanel({ shelter, onClose }: Props) {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [toast, setToast] = useState("");
  const [expandedReviews, setExpandedReviews] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [dynamicReviews, setDynamicReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch(`/api/reviews?shelterId=${shelter.id}`)
      .then((r) => r.json())
      .then((data: Review[]) => setDynamicReviews(data))
      .catch(() => {});
  }, [shelter.id]);

  const allReviews = [...dynamicReviews, ...shelter.reviews];

  const avgRating =
    allReviews.length > 0
      ? allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
      : 0;

  const volunteerReviews = allReviews.filter((r) => r.isVolunteerReview);
  const regularReviews = allReviews.filter((r) => !r.isVolunteerReview);

  const shownRegular = expandedReviews ? regularReviews : regularReviews.slice(0, 2);

  const isVerified = shelter.verificationStatus === "VERIFIED";

  const handleSubmitted = (review: Review) => {
    setDynamicReviews((prev) => [review, ...prev]);
    setShowReviewForm(false);
    setToast("Opinia została dodana! Dziękujemy.");
    setTimeout(() => setToast(""), 3000);
  };

  const adoptionColor = getAdoptionColor(shelter.adoptionRate);
  const mortalityColor = getMortalityColor(shelter.mortalityRate);
  const stayColor = getStayColor(shelter.avgStayDays);

  return (
    <>
      <div
        style={{
          position: "absolute", right: 0, top: 0, bottom: 0,
          width: "100%", maxWidth: "440px",
          background: "var(--surface)",
          borderLeft: "1px solid var(--border)",
          borderTopLeftRadius: "16px",
          borderBottomLeftRadius: "16px",
          zIndex: 500,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          animation: "slideInRight 0.25s ease",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.5)",
        }}
      >
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .review-card:hover { border-color: rgba(250,204,21,0.3) !important; }
          .vol-review-card:hover { border-color: rgba(6,182,212,0.5) !important; }
          .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #22c55e; color: #fff; padding: 12px 24px; border-radius: 12px; font-weight: 600; font-size: 0.875rem; z-index: 9999; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
        `}</style>

        {/* Shelter image */}
        {shelter.imageUrl && !imgError ? (
          <div style={{ position: "relative", width: "100%", height: "180px", flexShrink: 0, overflow: "hidden" }}>
            <img
              src={shelter.imageUrl}
              alt={shelter.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={() => setImgError(true)}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(17,17,17,0.95) 100%)",
            }} />
            <button
              onClick={onClose}
              style={{
                position: "absolute", top: "12px", right: "12px",
                background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.15)", borderRadius: "50%",
                width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", cursor: "pointer",
              }}
            >
              <X size={16} />
            </button>
          </div>
        ) : null}

        {/* Header */}
        <div style={{
          padding: "20px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
          marginTop: shelter.imageUrl && !imgError ? "-20px" : 0,
          position: "relative", zIndex: 1,
        }}>
          {(!shelter.imageUrl || imgError) && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
              <button
                onClick={onClose}
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "6px", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Badges */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
            {shelter.isPrimaryShelter && (
              <span style={{
                display: "flex", alignItems: "center", gap: "4px",
                background: "rgba(6,182,212,0.15)", color: "#06B6D4",
                fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: "20px",
                border: "1px solid rgba(6,182,212,0.3)",
              }}>
                <Crown size={10} /> SCHRONISKO GMINNE
              </span>
            )}
            {isVerified ? (
              <span style={{
                display: "flex", alignItems: "center", gap: "4px",
                background: "rgba(250,204,21,0.12)", color: "var(--yellow)",
                fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: "20px",
                border: "1px solid rgba(250,204,21,0.25)",
              }}>
                <CheckCircle2 size={10} /> ZWERYFIKOWANE
              </span>
            ) : (
              <span style={{
                display: "flex", alignItems: "center", gap: "4px",
                background: "rgba(255,255,255,0.04)", color: "var(--text-muted)",
                fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: "20px",
                border: "1px solid var(--border)",
              }}>
                <AlertCircle size={10} /> NIEZWERYFIKOWANE
              </span>
            )}
            {volunteerReviews.length > 0 && (
              <span style={{
                display: "flex", alignItems: "center", gap: "4px",
                background: "rgba(6,182,212,0.12)", color: "#06B6D4",
                fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: "20px",
                border: "1px solid rgba(6,182,212,0.25)",
              }}>
                <Shield size={10} /> WOLONTARIUSZE ANIMAL HELPER
              </span>
            )}
          </div>

          <h2 style={{ fontWeight: 700, fontSize: "1.05rem", lineHeight: "1.3", color: "var(--text)" }}>
            {shelter.name}
          </h2>

          {/* Rating */}
          {avgRating > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "12px" }}>
              <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--yellow)" }}>
                {avgRating.toFixed(1)}
              </span>
              <div>
                <StarRating rating={avgRating} size={18} />
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  {allReviews.length} {allReviews.length === 1 ? "opinia" : allReviews.length < 5 ? "opinie" : "opinii"}
                  {volunteerReviews.length > 0 && ` · ${volunteerReviews.length} od wolontariuszy`}
                </p>
              </div>
            </div>
          )}

          {allReviews.length === 0 && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "10px" }}>Brak opinii – bądź pierwszym!</p>
          )}
        </div>

        {/* Stats grid */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "12px" }}>
            {/* Adoption rate */}
            <div style={{ background: "var(--surface-2)", borderRadius: "14px", padding: "14px 10px", textAlign: "center", border: `1px solid ${adoptionColor}33` }}>
              <TrendingUp size={16} style={{ color: adoptionColor, margin: "0 auto 6px" }} />
              <p style={{ fontWeight: 800, fontSize: "1.3rem", color: adoptionColor, lineHeight: 1 }}>
                {shelter.adoptionRate}%
              </p>
              <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "4px", lineHeight: 1.3 }}>skuteczność adopcji</p>
            </div>

            {/* Mortality rate */}
            <div style={{ background: "var(--surface-2)", borderRadius: "14px", padding: "14px 10px", textAlign: "center", border: `1px solid ${mortalityColor}33` }}>
              <Skull size={16} style={{ color: mortalityColor, margin: "0 auto 6px" }} />
              <p style={{ fontWeight: 800, fontSize: "1.3rem", color: mortalityColor, lineHeight: 1 }}>
                {shelter.mortalityRate}%
              </p>
              <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "4px", lineHeight: 1.3 }}>wskaźnik śmiertelności</p>
            </div>

            {/* Avg stay */}
            <div style={{ background: "var(--surface-2)", borderRadius: "14px", padding: "14px 10px", textAlign: "center", border: `1px solid ${stayColor}33` }}>
              <Clock size={16} style={{ color: stayColor, margin: "0 auto 6px" }} />
              <p style={{ fontWeight: 800, fontSize: "1.3rem", color: stayColor, lineHeight: 1 }}>
                {shelter.avgStayDays}
              </p>
              <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "4px", lineHeight: 1.3 }}>śr. czas do adopcji (dni)</p>
            </div>
          </div>

          {/* Annual summary bar */}
          <div style={{
            background: "var(--surface-2)",
            borderRadius: "10px",
            padding: "9px 14px",
            fontSize: "0.78rem",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}>
            <span>W tym roku:</span>
            <strong style={{ color: "#22c55e" }}>{shelter.animalsAdoptedThisYear} adoptowanych</strong>
            <span>z</span>
            <strong style={{ color: "var(--text)" }}>{shelter.animalsIncomingThisYear} przyjętych</strong>
          </div>
        </div>

        {/* Info section */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          {shelter.description && (
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: "1.65", marginBottom: "16px" }}>
              {shelter.description}
            </p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <MapPin size={15} style={{ color: "var(--yellow)", flexShrink: 0, marginTop: "2px" }} />
              <span style={{ fontSize: "0.875rem", color: "var(--text)" }}>
                {shelter.address.street} {shelter.address.streetNumber}, {shelter.address.postalCode} {shelter.address.city}
              </span>
            </div>
            {shelter.phone && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Phone size={15} style={{ color: "var(--yellow)", flexShrink: 0 }} />
                <a href={`tel:${shelter.phone}`} style={{ fontSize: "0.875rem", color: "var(--text)", textDecoration: "none" }}>{shelter.phone}</a>
              </div>
            )}
            {shelter.email && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Mail size={15} style={{ color: "var(--yellow)", flexShrink: 0 }} />
                <a href={`mailto:${shelter.email}`} style={{ fontSize: "0.875rem", color: "var(--text)", textDecoration: "none" }}>{shelter.email}</a>
              </div>
            )}
          </div>
        </div>

        {/* PDF / Contract button */}
        {shelter.documentPath && (
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <a
              href={shelter.documentPath}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "rgba(250,204,21,0.08)",
                border: "1px solid rgba(250,204,21,0.3)",
                borderRadius: "14px",
                padding: "14px 18px",
                color: "var(--yellow)",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(250,204,21,0.15)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(250,204,21,0.08)")}
            >
              <FileText size={20} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.2 }}>Umowa z gminą</p>
                <p style={{ fontSize: "0.75rem", color: "rgba(250,204,21,0.7)", marginTop: "2px" }}>Otwórz dokument prawny schroniska</p>
              </div>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, whiteSpace: "nowrap" }}>Otwórz →</span>
            </a>
          </div>
        )}

        {/* Volunteer banner */}
        {volunteerReviews.length > 0 && (
          <div style={{
            margin: "0 20px",
            marginTop: "16px",
            background: "rgba(6,182,212,0.08)",
            border: "1px solid rgba(6,182,212,0.3)",
            borderRadius: "12px",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            <Shield size={16} style={{ color: "#06B6D4", flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#06B6D4" }}>
                Zweryfikowane przez wolontariuszy
              </p>
              <p style={{ fontSize: "0.7rem", color: "rgba(6,182,212,0.7)", marginTop: "1px" }}>
                {volunteerReviews.length} {volunteerReviews.length === 1 ? "wolontariusz ocenił" : "wolontariuszy oceniło"} to schronisko
              </p>
            </div>
          </div>
        )}

        {/* Add review CTA */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          {user && user.role !== "ADMIN" ? (
            <button
              onClick={() => setShowReviewForm(true)}
              style={{
                background: "var(--yellow)", color: "#000", border: "none",
                borderRadius: "14px", padding: "13px 16px",
                fontWeight: 700, fontSize: "0.95rem", cursor: "pointer",
                transition: "opacity 0.2s",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <MessageSquarePlus size={18} />
              Dodaj opinię
              {user.role === "VOLUNTEER" && (
                <span style={{ background: "#000", color: "var(--yellow)", fontSize: "0.65rem", padding: "2px 8px", borderRadius: "20px" }}>
                  WOLONTARIUSZ ANIMAL HELPER
                </span>
              )}
            </button>
          ) : (
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "12px" }}>
                Zaloguj się, aby dodać opinię
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <a href="/login" style={{ flex: 1, padding: "10px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "12px", textAlign: "center", color: "var(--text)", textDecoration: "none", fontSize: "0.875rem" }}>
                  Zaloguj
                </a>
                <a href="/register" style={{ flex: 1, padding: "10px", background: "var(--yellow)", borderRadius: "12px", textAlign: "center", color: "#000", textDecoration: "none", fontSize: "0.875rem", fontWeight: 700 }}>
                  Zarejestruj
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Reviews section */}
        <div style={{ padding: "16px 20px", flex: 1 }}>

          {/* Volunteer reviews */}
          {volunteerReviews.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <Shield size={15} style={{ color: "#06B6D4" }} />
                <h3 style={{ fontWeight: 700, fontSize: "0.9rem", color: "#06B6D4" }}>
                  Opinie wolontariuszy ({volunteerReviews.length})
                </h3>
              </div>
              <p style={{ fontSize: "0.72rem", color: "rgba(6,182,212,0.6)", marginBottom: "10px", fontStyle: "italic" }}>
                Opinie wolontariuszy są weryfikowane — wolontariusze fizycznie odwiedzają schroniska.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {volunteerReviews.map((review) => (
                  <div
                    key={review.id}
                    className="vol-review-card"
                    style={{
                      background: "rgba(6,182,212,0.06)",
                      borderRadius: "14px",
                      padding: "16px",
                      border: "1px solid rgba(6,182,212,0.25)",
                      transition: "border-color 0.2s",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Shield size={11} style={{ color: "#06B6D4" }} />
                          <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>
                            {review.name} {review.surname}
                          </span>
                          <span style={{ background: "rgba(6,182,212,0.2)", color: "#06B6D4", fontSize: "0.6rem", fontWeight: 700, padding: "2px 7px", borderRadius: "20px" }}>
                            WOLONTARIUSZ ANIMAL HELPER
                          </span>
                        </div>
                        <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>
                          {new Date(review.createdAt).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <StarRating rating={review.rating} size={14} />
                    </div>
                    {review.comment && (
                      <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: "1.6" }}>{review.comment}</p>
                    )}
                    {review.photoUrl && (
                      <div style={{ marginTop: "10px", borderRadius: "10px", overflow: "hidden" }}>
                        <img
                          src={review.photoUrl}
                          alt="Zdjęcie z opinii"
                          style={{ width: "100%", maxHeight: "220px", objectFit: "cover", display: "block" }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular reviews */}
          {regularReviews.length > 0 && (
            <div>
              <h3 style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)", marginBottom: "12px" }}>
                Opinie użytkowników ({regularReviews.length})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {shownRegular.map((review) => (
                  <div
                    key={review.id}
                    className="review-card"
                    style={{
                      background: "var(--surface-2)",
                      borderRadius: "14px",
                      padding: "14px",
                      border: "1px solid var(--border)",
                      transition: "border-color 0.2s",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text)" }}>
                          {review.name} {review.surname}
                        </span>
                        <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>
                          {new Date(review.createdAt).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <StarRating rating={review.rating} size={14} />
                    </div>
                    {review.comment && (
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.55" }}>{review.comment}</p>
                    )}
                    {review.photoUrl && (
                      <div style={{ marginTop: "10px", borderRadius: "10px", overflow: "hidden" }}>
                        <img
                          src={review.photoUrl}
                          alt="Zdjęcie z opinii"
                          style={{ width: "100%", maxHeight: "220px", objectFit: "cover", display: "block" }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {regularReviews.length > 2 && (
                <button
                  onClick={() => setExpandedReviews(!expandedReviews)}
                  style={{
                    marginTop: "12px", background: "none", border: "1px solid var(--border)",
                    borderRadius: "12px", padding: "10px", color: "var(--text-muted)",
                    fontSize: "0.85rem", cursor: "pointer", width: "100%",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  }}
                >
                  {expandedReviews
                    ? <><ChevronUp size={14} /> Pokaż mniej</>
                    : <><ChevronDown size={14} /> Pokaż wszystkie ({regularReviews.length})</>
                  }
                </button>
              )}
            </div>
          )}

          {allReviews.length === 0 && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", textAlign: "center", padding: "24px 0" }}>
              Brak opinii. Podziel się swoim doświadczeniem!
            </p>
          )}
        </div>
      </div>

      {showReviewForm && (
        <ReviewForm shelter={shelter} onClose={() => setShowReviewForm(false)} onSubmitted={handleSubmitted} />
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
