// src/app/search/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import SearchComponent from './SearchComponent';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../../components/Map'), { ssr: false });

export default function SearchPage() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [nearbyUsers, setNearbyUsers] = useState<any[]>([]); // Use appropriate type for users

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error obtaining geolocation', error);
      },
    );
  }, []);

  useEffect(() => {
    if (location) {
      fetch(
        `/api/search/nearby?latitude=${location.latitude}&longitude=${location.longitude}&radius=10`,
      )
        .then((response) => response.json())
        .then((data) => setNearbyUsers(data))
        .catch((error) => console.error('Error fetching nearby users', error));
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 pt-16">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row lg:space-x-8">
        <div className="flex-1 h-full">
          <SearchComponent />
        </div>
        {location && nearbyUsers.length > 0 && (
          <div className="flex-1 h-full">
            <div className="w-full h-full p-8 bg-white rounded-lg shadow dark:bg-gray-800">
              <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                Nearby Users
              </h1>
              <div className="w-full h-96 mt-4">
                <Map
                  latitude={location.latitude}
                  longitude={location.longitude}
                  markers={nearbyUsers}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
