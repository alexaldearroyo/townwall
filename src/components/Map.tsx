'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

type MapProps = {
  latitude: number;
  longitude: number;
};

const Map: React.FC<MapProps> = ({ latitude, longitude }) => {
  useEffect(() => {
    import('leaflet-defaulticon-compatibility');
  }, []);

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution={`&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors`}
      />
      <Marker position={[latitude, longitude]}>
        <Popup>User's Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
