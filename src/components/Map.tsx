'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

type MapProps = {
  latitude: number;
  longitude: number;
  markers?: { id: number; username: string; location: string }[]; // Ajusta el tipo según tus datos
};

const parseLocation = (location: string) => {
  const match = location.match(/POINT\(([^ ]+) ([^ ]+)\)/);
  if (match && match[1] && match[2]) {
    return { longitude: parseFloat(match[1]), latitude: parseFloat(match[2]) };
  }
  return null;
};

const Map: React.FC<MapProps> = ({ latitude, longitude, markers = [] }) => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        style={{ width: '100%', height: '100%' }} // Ajusta el ancho y la altura según sea necesario
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[latitude, longitude] as [number, number]}>
          <Popup>Your Location</Popup>
        </Marker>
        {markers.map((marker) => {
          const loc = parseLocation(marker.location);
          if (loc) {
            return (
              <Marker
                key={marker.id}
                position={[loc.latitude, loc.longitude] as [number, number]}
              >
                <Popup>{marker.username}</Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
};

export default Map;
