import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom SVG marker icon
const customIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32px" height="32px">
      <circle cx="12" cy="12" r="10" fill="#000" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="6" fill="#FFD700"/>
    </svg>
  `),
  iconSize: [32, 32], // size of the icon
  iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -32], // point from which the popup should open relative to the iconAnchor
});

interface MapProps {
  center?: [number, number]; // Center of the map as [latitude, longitude]
  zoom?: number; // Zoom level of the map
}

const Map: React.FC<MapProps> = ({ center = [43.2220, 76.8512], zoom = 13 }) => {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: "400px", width: "100%", borderRadius: "8px", zIndex: "10" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={center} icon={customIcon}>
        <Popup>
          You are here!
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
