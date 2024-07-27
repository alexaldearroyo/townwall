'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('../../components/MapComponent'), {
  ssr: false,
});

type NearbyUsersMapProps = {
  latitude: number;
  longitude: number;
  markers: { id: number; username: string; location: string }[];
};

const NearbyUsersMap: React.FC<NearbyUsersMapProps> = ({
  latitude,
  longitude,
  markers,
}) => {
  return (
    <div className="w-full space-y-6">
      <h1 className="text-xl font-bold text-center text-gray-800 dark:text-white">
        Nearby Users
      </h1>
      <div className="w-full h-96 mt-4 rounded-lg overflow-hidden">
        <MapComponent
          latitude={latitude}
          longitude={longitude}
          markers={markers}
          zoom={12}
        />
      </div>
    </div>
  );
};

export default NearbyUsersMap;
