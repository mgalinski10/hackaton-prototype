"use client";
import { useState } from "react";
import { Shelter } from "@/types";
import { useAuth } from "@/context/AuthContext";
import StarRating from "./StarRating";
import ReviewForm from "@/components/Review/ReviewForm";
import {
  X, MapPin, Phone, Mail, CheckCircle2, AlertCircle,
  Building2, MessageSquarePlus, ChevronDown, ChevronUp,
  PawPrint, Users, ExternalLink
} from "lucide-react";

interface Props {
  shelter: Shelter;
  onClose: () => void;
}

export default function ShelterPanel({ shelter, onClose }: Props) {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [toast, setToast] = useState("");
  const [expandedReviews, setExpandedReviews] = useState(false);

  const avgRating =
    shelter.reviews.length > 0
      ? shelter.reviews.reduce((s, r) => s + r.rating, 0) / shelter.reviews.length
      : 0;

  const volunteerReviews = shelter.reviews.filter((r) => r.isVolunteerReview);
  const regularReviews = shelter.reviews.filter((r) => !r.isVolunteerReview);
  const shownReviews = expandedReviews
    ? [...volunteerReviews, ...regularReviews]
    : [...volunteerReviews, ...regularReviews].slice(0, 3);

  const isVerified = shelter.verificationStatus === "VERIFIED";
  const occupancy = shelter.capacity ? Math.round(((shelter.currentAnimals ?? 0) / shelter.capacity) * 100) : null;

  const handleSubmitted = () => {
    setShowReviewForm(false);
    setToast("Opinia została dodana! Dziękujemy.");
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <>
      <div
        style={{
          position: "absolute", right: 0, top: 0, bottom: 0,
          width: "100%", maxWidth: "420px",
          background: "var(--surface)",
          borderLeft: "1px solid var(--border)",
          zIndex: 500,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          animation: "slideInRight 0.25s ease",
        }}
      >
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}</style>

        {/* Header */}
        <div style={{ padding: "20px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1, paddingRight: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                {isVerified ? (
                  <span
                    style={{
                      display: "flex", alignItems: "center", gap: "4px",
                      background: "rgba(250,204,21,0.15)", color: "var(--yellow)",
                      fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "4px",
                      border: "1px solid rgba(250,204,21,0.3)",
                    }}
                  >
                    <CheckCircle2 size={10} /> ZWERYFIKOWANE
                  </span>
                ) : (
                  <span
                    style={{
                      display: "flex", alignItems: "center", gap: "4px",
                      background: "rgba(255,255,255,0.05)", color: "var(--text-muted)",
                      fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "4px",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <AlertCircle size={10} /> NIEZWERYFIKOWANE
                  </span>
                )}
                {shelter.isPrimaryShelter && (
                  <span style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "4px" }}>
                    GMINNE
                  </span>
                )}
              </div>
              <h2 style={{ fontWeight: 700, fontSize: "1.05rem", lineHeight: "1.3", color: "var(--text)" }}>
                {shelter.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "8px", padding: "6px", color: "var(--text-muted)", cursor: "pointer", flexShrink: 0 }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Rating */}
          {avgRating > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "12px" }}>
              <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--yellow)" }}>
                {avgRating.toFixed(1)}
              </span>
              <div>
                <StarRating rating={avgRating} size={18} />
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  {shelter.reviews.length} {shelter.reviews.length === 1 ? "opinia" : shelter.reviews.length < 5 ? "opinie" : "opinii"}
                  {volunteerReviews.length > 0 && ` · ${volunteerReviews.length} od wolontariuszy`}
                </p>
              </div>
            </div>
          )}

          {shelter.reviews.length === 0 && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "10px" }}>Brak opinii – bądź pierwszym!</p>
          )}
        </div>

        {/* Stats */}
        {(shelter.capacity || shelter.currentAnimals) && (
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", gap: "16px" }}>
            <div style={{ flex: 1, background: "var(--surface-2)", borderRadius: "10px", padding: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <PawPrint size={14} style={{ color: "var(--yellow)" }} />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Zwierząt</span>
              </div>
              <p style={{ fontWeight: 700, fontSize: "1.2rem", color: "var(--text)" }}>{shelter.currentAnimals}</p>
              {shelter.capacity && <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>z {shelter.capacity} miejsc</p>}
            </div>
            {occupancy !== null && (
              <div style={{ flex: 1, background: "var(--surface-2)", borderRadius: "10px", padding: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <Users size={14} style={{ color: occupancy > 80 ? "var(--red)" : "var(--yellow)" }} />
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Zapełnienie</span>
                </div>
                <p style={{ fontWeight: 700, fontSize: "1.2rem", color: occupancy > 80 ? "var(--red)" : "var(--text)" }}>{occupancy}%</p>
                <div style={{ marginTop: "6px", height: "4px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${occupancy}%`, background: occupancy > 80 ? "var(--red)" : "var(--yellow)", borderRadius: "2px" }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          {shelter.description && (
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "16px" }}>
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
            {shelter.documentPath && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Building2 size={15} style={{ color: "var(--yellow)", flexShrink: 0 }} />
                <a href="#" style={{ fontSize: "0.875rem", color: "var(--yellow)", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
                  Umowa z gminą <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Add Review CTA */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          {user ? (
            <button
              onClick={() => setShowReviewForm(true)}
              className="flex items-center justify-center gap-2 w-full"
              style={{
                background: "var(--yellow)", color: "#000", border: "none",
                borderRadius: "10px", padding: "12px 16px",
                fontWeight: 700, fontSize: "0.95rem", cursor: "pointer",
              }}
            >
              <MessageSquarePlus size={18} />
              Dodaj opinię
              {user.role === "VOLUNTEER" && (
                <span style={{ background: "#000", color: "var(--yellow)", fontSize: "0.65rem", padding: "2px 6px", borderRadius: "4px" }}>
                  WOLONTARIUSZ
                </span>
              )}
            </button>
          ) : (
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "10px" }}>
                Zaloguj się, aby dodać opinię
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <a href="/login" style={{ flex: 1, padding: "10px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "8px", textAlign: "center", color: "var(--text)", textDecoration: "none", fontSize: "0.875rem" }}>
                  Zaloguj
                </a>
                <a href="/register" style={{ flex: 1, padding: "10px", background: "var(--yellow)", borderRadius: "8px", textAlign: "center", color: "#000", textDecoration: "none", fontSize: "0.875rem", fontWeight: 700 }}>
                  Zarejestruj
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Reviews */}
        <div style={{ padding: "16px 20px", flex: 1 }}>
          <h3 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "14px", color: "var(--text)" }}>
            Opinie ({shelter.reviews.length})
          </h3>

          {shownReviews.length === 0 && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", textAlign: "center", padding: "20px 0" }}>
              Brak opinii. Podziel się swoim doświadczeniem!
            </p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {shownReviews.map((review) => (
              <div
                key={review.id}
                style={{
                  background: "var(--surface-2)",
                  borderRadius: "10px",
                  padding: "14px",
                  border: review.isVolunteerReview ? "1px solid rgba(250,204,21,0.2)" : "1px solid var(--border)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{review.name} {review.surname}</span>
                      {review.isVolunteerReview && (
                        <span style={{ background: "rgba(250,204,21,0.15)", color: "var(--yellow)", fontSize: "0.6rem", fontWeight: 700, padding: "1px 5px", borderRadius: "3px" }}>
                          WOLONTARIUSZ
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      {new Date(review.createdAt).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <StarRating rating={review.rating} size={14} />
                </div>
                {review.comment && (
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.5" }}>{review.comment}</p>
                )}
              </div>
            ))}
          </div>

          {shelter.reviews.length > 3 && (
            <button
              onClick={() => setExpandedReviews(!expandedReviews)}
              className="flex items-center justify-center gap-1 w-full"
              style={{
                marginTop: "12px", background: "none", border: "1px solid var(--border)",
                borderRadius: "8px", padding: "8px", color: "var(--text-muted)",
                fontSize: "0.85rem", cursor: "pointer",
              }}
            >
              {expandedReviews ? <><ChevronUp size={14} /> Pokaż mniej</> : <><ChevronDown size={14} /> Pokaż wszystkie ({shelter.reviews.length})</>}
            </button>
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
