'use client';

import React, { useState, useEffect } from 'react';
import SearchComponent from './SearchComponent';
import NearbyUsersMap from './NearbyUsersMap';

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
            <NearbyUsersMap
              latitude={location.latitude}
              longitude={location.longitude}
              markers={nearbyUsers}
            />
          </div>
        )}
      </div>
    </div>
  );
}
