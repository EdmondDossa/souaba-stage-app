import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-icon.png";
import { useMapEvents } from "react-leaflet";

//this component can't be used outside MapContainer
function LocationMarkerManager({
  setPosition,
  position = [],
}) {
  const map = useMapEvents({
    click(e) {
      map.locate();
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  if (position[0] !== null) {
    map.flyTo(position, map.getZoom());
  } 
  return <></>;
}

const MapDisplayContainer = ({ position, setPosition }) => {

  return (
    <MapContainer
      className="h-[450px] w-full md:w-[650px]"
      center={position}
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position}>
        <Popup className="text-center">Votre propriété est ici? Cliquer sur le carré à côté de la barre de recherche pour valider</Popup>
      </Marker>

      <LocationMarkerManager
        position={position}
        setPosition={setPosition}
      />
    </MapContainer>
  );
};

export default React.memo(MapDisplayContainer);
