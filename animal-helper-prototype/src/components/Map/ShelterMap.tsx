"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Shelter } from "@/types";

// Fix leaflet icons for Next.js
const fixLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
};

function createShelterIcon(shelter: Shelter, isSelected: boolean) {
  const isVerified = shelter.verificationStatus === "VERIFIED";
  const avgRating =
    shelter.reviews.length > 0
      ? shelter.reviews.reduce((s, r) => s + r.rating, 0) / shelter.reviews.length
      : 0;

  const size = isSelected ? 52 : 44;
  const color = isVerified ? "#FACC15" : "#555555";
  const textColor = isVerified ? "#000" : "#ccc";
  const border = isSelected ? "3px solid #fff" : "2px solid rgba(255,255,255,0.2)";
  const shadow = isSelected
    ? "0 0 0 3px #FACC15, 0 4px 20px rgba(250,204,21,0.5)"
    : "0 2px 10px rgba(0,0,0,0.5)";

  const ratingText = avgRating > 0 ? avgRating.toFixed(1) : "–";
  const stars = avgRating > 0 ? "★".repeat(Math.round(avgRating)) : "";

  const html = `
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
      position: relative;
    ">
      <span style="font-size:${isSelected ? 13 : 11}px; font-weight:700; color:${textColor}; line-height:1;">${ratingText}</span>
      ${avgRating > 0 ? `<span style="font-size:8px; color:${textColor}80; line-height:1;">${stars.slice(0, 5)}</span>` : `<span style="font-size:9px; color:${textColor}; line-height:1;">•••</span>`}
    </div>
    <div style="
      width:0; height:0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 8px solid ${color};
      margin: 0 auto;
      margin-top: -1px;
    "></div>
  `;

  return L.divIcon({
    html,
    className: "",
    iconSize: [size, size + 8],
    iconAnchor: [size / 2, size + 8],
    popupAnchor: [0, -(size + 8)],
  });
}

function FlyToSelected({ shelter }: { shelter: Shelter | null }) {
  const map = useMap();
  useEffect(() => {
    if (shelter) {
      map.flyTo([shelter.lat, shelter.lon], 13, { duration: 0.8 });
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
      center={[52.0, 19.5]}
      zoom={6}
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
        />
      ))}
    </MapContainer>
  );
}
