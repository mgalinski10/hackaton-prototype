"use client";
import { useState } from "react";
import { Shelter } from "@/types";
import { Search, CheckCircle2, X, Filter } from "lucide-react";
import StarRating from "@/components/Shelter/StarRating";

interface Props {
  shelters: Shelter[];
  onSelect: (shelter: Shelter) => void;
  selectedId: string | null;
}

export default function MapSearch({ shelters, onSelect, selectedId }: Props) {
  const [query, setQuery] = useState("");
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterMinRating, setFilterMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = shelters.filter((s) => {
    const matchQuery =
      query.length < 2 ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.address.city.toLowerCase().includes(query.toLowerCase());
    const matchVerified = !filterVerified || s.verificationStatus === "VERIFIED";
    const avgRating = s.reviews.length > 0 ? s.reviews.reduce((a, r) => a + r.rating, 0) / s.reviews.length : 0;
    const matchRating = avgRating >= filterMinRating;
    return matchQuery && matchVerified && matchRating;
  });

  const hasFilters = filterVerified || filterMinRating > 0;

  return (
    <div
      style={{
        position: "absolute", left: "12px", top: "12px", zIndex: 500,
        width: "300px",
        display: "flex", flexDirection: "column", gap: "8px",
      }}
    >
      {/* Search input */}
      <div style={{ position: "relative" }}>
        <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
        <input
          type="text"
          placeholder="Szukaj schroniska lub miasta..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%", paddingLeft: "36px", paddingRight: query ? "36px" : "12px",
            height: "44px", background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "10px", color: "var(--text)", fontSize: "0.875rem",
            outline: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
          }}
        />
        {query && (
          <button onClick={() => setQuery("")} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: "8px 12px", background: "var(--surface)",
          border: `1px solid ${hasFilters ? "var(--yellow)" : "var(--border)"}`,
          borderRadius: "8px", color: hasFilters ? "var(--yellow)" : "var(--text-muted)",
          fontSize: "0.8rem", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          width: "fit-content",
        }}
      >
        <Filter size={13} />
        Filtry
        {hasFilters && <span style={{ background: "var(--yellow)", color: "#000", borderRadius: "50%", width: "16px", height: "16px", fontSize: "0.65rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>!</span>}
      </button>

      {/* Filters panel */}
      {showFilters && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px", boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={filterVerified}
              onChange={(e) => setFilterVerified(e.target.checked)}
              style={{ accentColor: "var(--yellow)", width: "16px", height: "16px" }}
            />
            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.875rem" }}>
              <CheckCircle2 size={14} style={{ color: "var(--yellow)" }} />
              Tylko zweryfikowane
            </span>
          </label>

          <div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "8px" }}>Minimalna ocena:</p>
            <div style={{ display: "flex", gap: "6px" }}>
              {[0, 1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setFilterMinRating(n)}
                  style={{
                    padding: "4px 10px", borderRadius: "6px", fontSize: "0.8rem",
                    background: filterMinRating === n ? "var(--yellow)" : "var(--surface-2)",
                    color: filterMinRating === n ? "#000" : "var(--text-muted)",
                    border: "1px solid var(--border)", cursor: "pointer", fontWeight: filterMinRating === n ? 700 : 400,
                  }}
                >
                  {n === 0 ? "Wszystkie" : `${n}+★`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {query.length >= 2 && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.4)", maxHeight: "300px", overflowY: "auto" }}>
          {filtered.length === 0 ? (
            <p style={{ padding: "16px", color: "var(--text-muted)", fontSize: "0.875rem", textAlign: "center" }}>Brak wyników</p>
          ) : (
            filtered.map((s) => {
              const avg = s.reviews.length > 0 ? s.reviews.reduce((a, r) => a + r.rating, 0) / s.reviews.length : 0;
              return (
                <button
                  key={s.id}
                  onClick={() => { onSelect(s); setQuery(""); }}
                  style={{
                    width: "100%", padding: "12px 14px", background: s.id === selectedId ? "rgba(250,204,21,0.08)" : "transparent",
                    border: "none", borderBottom: "1px solid var(--border)", textAlign: "left", cursor: "pointer",
                    display: "flex", flexDirection: "column", gap: "4px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)" }}>{s.name}</span>
                    {s.verificationStatus === "VERIFIED" && <CheckCircle2 size={12} style={{ color: "var(--yellow)", flexShrink: 0 }} />}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{s.address.city}</span>
                    {avg > 0 && <StarRating rating={avg} size={11} />}
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
