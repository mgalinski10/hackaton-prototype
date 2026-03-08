"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { mockShelters, mockAnimals } from "@/data/mockData";
import { Shelter } from "@/types";
import Navbar from "@/components/Layout/Navbar";
import ShelterPanel from "@/components/Shelter/ShelterPanel";
import MapSearch from "@/components/Map/MapSearch";
import { Navigation, PawPrint } from "lucide-react";

const ShelterMap = dynamic(() => import("@/components/Map/ShelterMap"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: "100%", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid var(--border)", borderTop: "3px solid var(--yellow)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Ładowanie mapy...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  ),
});

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const totalAvailable = mockAnimals.filter((a) => a.status === "available").length;

export default function HomePage() {
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");

  const findNearest = () => {
    if (!navigator.geolocation) { setGpsError("Geolokalizacja niedostępna"); return; }
    setGpsLoading(true);
    setGpsError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let nearest = mockShelters[0];
        let minDist = Infinity;
        mockShelters.forEach((s) => {
          const d = getDistance(latitude, longitude, s.lat, s.lon);
          if (d < minDist) { minDist = d; nearest = s; }
        });
        setSelectedShelter(nearest);
        setGpsLoading(false);
      },
      () => {
        setGpsError("Brak zgody na lokalizację");
        setGpsLoading(false);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Navbar />

      {/* Hero strip */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "8px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
          <span style={{ color: "var(--yellow)", fontWeight: 700 }}>{mockShelters.length}</span> schronisk ·{" "}
          <span style={{ color: "#22c55e", fontWeight: 700 }}>{totalAvailable}</span> zwierząt szuka domu
        </p>
        <div style={{ display: "flex", gap: "16px", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#06B6D4", display: "inline-block" }} />
            Gminne
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--yellow)", display: "inline-block" }} />
            Zweryfikowane
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#555", display: "inline-block" }} />
            Niezweryfikowane
          </span>
        </div>
      </div>

      {/* Map container */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <ShelterMap
          shelters={mockShelters}
          selectedId={selectedShelter?.id ?? null}
          onSelect={setSelectedShelter}
        />

        <MapSearch
          shelters={mockShelters}
          selectedId={selectedShelter?.id ?? null}
          onSelect={setSelectedShelter}
        />

        {/* Bottom-left controls */}
        <div style={{ position: "absolute", bottom: "24px", left: "12px", zIndex: 500, display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* GPS button */}
          <button
            onClick={findNearest}
            disabled={gpsLoading}
            title="Znajdź najbliższe schronisko"
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "12px", padding: "9px 14px",
              fontSize: "0.8rem", color: gpsLoading ? "var(--text-muted)" : "var(--yellow)",
              fontWeight: 600, cursor: gpsLoading ? "not-allowed" : "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => { if (!gpsLoading) e.currentTarget.style.borderColor = "rgba(250,204,21,0.4)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            {gpsLoading
              ? <div style={{ width: "14px", height: "14px", border: "2px solid var(--border)", borderTop: "2px solid var(--yellow)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              : <Navigation size={14} />
            }
            {gpsLoading ? "Szukam..." : "Najbliższe schronisko"}
          </button>

          {/* Adopt match link */}
          <a
            href="/adopt-match"
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "var(--surface)", border: "1px solid rgba(250,204,21,0.3)",
              borderRadius: "12px", padding: "9px 14px",
              fontSize: "0.8rem", color: "var(--yellow)", fontWeight: 600,
              textDecoration: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
              transition: "border-color 0.2s, background 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(250,204,21,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--surface)"; }}
          >
            <PawPrint size={14} /> Dopasuj zwierzę AI
          </a>

          {gpsError && (
            <p style={{ fontSize: "0.75rem", color: "var(--red)", background: "var(--surface)", padding: "6px 10px", borderRadius: "8px", border: "1px solid var(--border)" }}>
              {gpsError}
            </p>
          )}
        </div>

        {/* Side panel */}
        {selectedShelter && (
          <ShelterPanel
            key={selectedShelter.id}
            shelter={selectedShelter}
            onClose={() => setSelectedShelter(null)}
          />
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
