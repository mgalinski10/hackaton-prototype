"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { mockShelters } from "@/data/mockData";
import { Shelter } from "@/types";
import Navbar from "@/components/Layout/Navbar";
import ShelterPanel from "@/components/Shelter/ShelterPanel";
import MapSearch from "@/components/Map/MapSearch";

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

export default function HomePage() {
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Navbar />

      {/* Hero strip */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "8px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
          <span style={{ color: "var(--yellow)", fontWeight: 700 }}>{mockShelters.length}</span> schronisk na mapie ·{" "}
          <span style={{ color: "var(--yellow)", fontWeight: 700 }}>{mockShelters.filter((s) => s.verificationStatus === "VERIFIED").length}</span> zweryfikowanych
        </p>
        <div style={{ display: "flex", gap: "16px", fontSize: "0.75rem", color: "var(--text-muted)" }}>
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

        {/* Shelter count badge */}
        <div style={{ position: "absolute", bottom: "24px", left: "12px", zIndex: 500 }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "8px 14px", fontSize: "0.8rem", color: "var(--text-muted)", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
            Kliknij marker, aby zobaczyć szczegóły
          </div>
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
    </div>
  );
}
