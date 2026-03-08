"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Shelter } from "@/types";

const fixLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
};

// Color scheme:
// Primary (gminne) shelter  → cyan/teal  #06B6D4
// Verified non-primary      → yellow     #FACC15
// Unverified                → gray       #555555
function getShelterColor(shelter: Shelter) {
  if (shelter.isPrimaryShelter) return "#06B6D4";
  if (shelter.verificationStatus === "VERIFIED") return "#FACC15";
  return "#555555";
}

function createShelterIcon(shelter: Shelter, isSelected: boolean) {
  const avgRating =
    shelter.reviews.length > 0
      ? shelter.reviews.reduce((s, r) => s + r.rating, 0) / shelter.reviews.length
      : 0;

  const size = isSelected ? 54 : 44;
  const color = getShelterColor(shelter);
  const textColor = shelter.verificationStatus === "UNVERIFIED" ? "#ccc" : "#000";
  const border = isSelected ? "3px solid #fff" : "2px solid rgba(255,255,255,0.2)";

  let shadow: string;
  if (isSelected) {
    shadow = `0 0 0 3px ${color}, 0 4px 24px ${color}88`;
  } else if (shelter.isPrimaryShelter) {
    shadow = `0 2px 12px ${color}99`;
  } else {
    shadow = "0 2px 10px rgba(0,0,0,0.5)";
  }

  const ratingText = avgRating > 0 ? avgRating.toFixed(1) : "–";
  const stars = avgRating > 0 ? "★".repeat(Math.round(avgRating)) : "";

  // Crown icon for primary shelter
  const crownHtml = shelter.isPrimaryShelter
    ? `<div style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);font-size:12px;line-height:1;">👑</div>`
    : "";

  const html = `
    <div style="position:relative;">
      ${crownHtml}
      <div style="
        width:${size}px; height:${size}px;
        background:${color};
        border-radius:50%;
        border:${border};
        box-shadow:${shadow};
        display:flex; flex-direction:column;
        align-items:center; justify-content:center;
        cursor:pointer;
        transition: all 0.2s ease;
      ">
        <span style="font-size:${isSelected ? 13 : 11}px; font-weight:700; color:${textColor}; line-height:1;">${ratingText}</span>
        ${avgRating > 0
          ? `<span style="font-size:8px; color:${textColor}80; line-height:1;">${stars.slice(0, 5)}</span>`
          : `<span style="font-size:9px; color:${textColor}; line-height:1;">•••</span>`
        }
      </div>
      <div style="
        width:0; height:0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 8px solid ${color};
        margin: 0 auto;
        margin-top: -1px;
      "></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "",
    iconSize: [size, size + 8 + (shelter.isPrimaryShelter ? 10 : 0)],
    iconAnchor: [size / 2, size + 8 + (shelter.isPrimaryShelter ? 10 : 0)],
    popupAnchor: [0, -(size + 8)],
  });
}

function FlyToSelected({ shelter }: { shelter: Shelter | null }) {
  const map = useMap();
  useEffect(() => {
    if (shelter) {
      map.flyTo([shelter.lat, shelter.lon], 14, { duration: 0.8 });
    }
  }, [shelter, map]);
  return null;
}

interface Props {
  shelters: Shelter[];
  selectedId: string | null;
  onSelect: (shelter: Shelter) => void;
}

export default function ShelterMap({ shelters, selectedId, onSelect }: Props) {
  useEffect(() => { fixLeafletIcons(); }, []);

  const selected = shelters.find((s) => s.id === selectedId) ?? null;

  return (
    <MapContainer
      center={[54.45, 18.55]}
      zoom={11}
      style={{ width: "100%", height: "100%" }}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />

      <FlyToSelected shelter={selected} />

      {shelters.map((shelter) => (
        <Marker
          key={shelter.id}
          position={[shelter.lat, shelter.lon]}
          icon={createShelterIcon(shelter, shelter.id === selectedId)}
          eventHandlers={{ click: () => onSelect(shelter) }}
        >
          <Tooltip
            direction="top"
            offset={[0, -44]}
            opacity={1}
            className="shelter-tooltip"
          >
            <div style={{
              background: "#111",
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              padding: "10px 14px",
              minWidth: "180px",
              fontFamily: "sans-serif",
            }}>
              <p style={{ fontWeight: 700, fontSize: "0.82rem", color: "#f5f5f5", marginBottom: "4px", lineHeight: "1.3" }}>
                {shelter.name}
              </p>
              {shelter.isPrimaryShelter && (
                <p style={{ fontSize: "0.7rem", color: "#06B6D4", fontWeight: 600, marginBottom: "6px" }}>
                  👑 Schronisko Gminne
                </p>
              )}
              {shelter.documentPath && (
                <a
                  href={shelter.documentPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "0.72rem",
                    color: "#FACC15",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  📄 Pobierz umowę z gminą (PDF)
                </a>
              )}
            </div>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
