"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useState, useEffect } from "react";

const Map = ({ properties }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Default position (e.g., center of a relevant city) if no properties are available
  const defaultPosition = [5.3454, -4.0245]; // Abidjan

  // Calculate center of map based on properties
  const getCenter = () => {
    if (properties && properties.length > 0) {
      const latitudes = properties.map(p => parseFloat(p.latitude)).filter(lat => !isNaN(lat));
      const longitudes = properties.map(p => parseFloat(p.longitude)).filter(lon => !isNaN(lon));
      
      if(latitudes.length === 0 || longitudes.length === 0) return defaultPosition;

      const avgLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
      const avgLon = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;
      return [avgLat, avgLon];
    }
    return defaultPosition;
  };
  
  const mapCenter = getCenter();

  if (!isMounted) {
    return null; // Or a placeholder/spinner
  }

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={properties && properties.length > 0 ? 12 : 8} 
      scrollWheelZoom={true} 
      style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {properties && properties.map((property) => {
        const lat = parseFloat(property.latitude);
        const lon = parseFloat(property.longitude);

        if (isNaN(lat) || isNaN(lon)) {
            return null; // Don't render marker if coordinates are invalid
        }
          
        return (
            <Marker key={property.accommodation_id || property.hotel_id} position={[lat, lon]}>
                <Popup>
                    <div>
                        <h3 className="font-bold">{property.name}</h3>
                        <p>{property.address}</p>
                        <p className="font-semibold">{property.price_per_night} XOF / nuit</p>
                    </div>
                </Popup>
            </Marker>
        )
       })}
    </MapContainer>
  );
};

export default Map;