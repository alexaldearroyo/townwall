'use client';

import React, { useState, useEffect } from 'react';
import SearchComponent from './SearchComponent';
import NearbyUsersMap from './NearbyUsersMap';

export default function SearchClient() {
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
    <div className="w-full min-h-screen p-8 flex flex-col md:flex-row items-center md:items-start bg-gray-100 dark:bg-gray-900 space-y-8 md:space-y-0 md:space-x-8">
      <div className="w-full bg-white rounded-lg shadow dark:bg-gray-800 p-8 flex justify-center">
        <SearchComponent />
      </div>
      {location && nearbyUsers.length > 0 && (
        <div className="w-full bg-white rounded-lg shadow dark:bg-gray-800 p-8 flex justify-center">
          <NearbyUsersMap
            latitude={location.latitude}
            longitude={location.longitude}
            markers={nearbyUsers}
          />
        </div>
      )}
    </div>
  );
}
