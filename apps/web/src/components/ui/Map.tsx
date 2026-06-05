'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Venue } from '../../types/api-types';

const fixLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
};

interface MapProps {
  venues: Venue[];
}

export default function Map({ venues }: MapProps) {
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  const defaultCenter: [number, number] = [-15.7801, -47.9292];
  const defaultZoom = 4;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      scrollWheelZoom={false}
      className="w-full h-125 rounded-2xl shadow-sm border border-gray-100 z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {venues.map((venue) => {
        if (!venue.latitude || !venue.longitude) return null;

        return (
          <Marker key={venue.id} position={[venue.latitude, venue.longitude]}>
            <Popup>
              <div className="font-bold text-gray-800">{venue.name}</div>
              {/* Renderiza a cidade apenas se a propriedade existir no objeto */}
              {venue.city && (
                <div className="text-sm text-gray-500">{venue.city}</div>
              )}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
