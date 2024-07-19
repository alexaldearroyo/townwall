'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../../components/Map'), { ssr: false });

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
    <div className="w-full h-full p-8 bg-white rounded-lg shadow dark:bg-gray-800">
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        Nearby Users
      </h1>
      <div className="w-full h-96 mt-4">
        <Map latitude={latitude} longitude={longitude} markers={markers} />
      </div>
    </div>
  );
};

export default NearbyUsersMap;
