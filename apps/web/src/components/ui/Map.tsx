"use client";

import L from "leaflet";
import Link from "next/link";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { Venue } from "../../types/api-types";

const fixLeafletIcons = () => {
  // biome-ignore lint/suspicious/noExplicitAny: necessário para Leaflet
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
};

interface MapProps {
  venues: Venue[];
}

export default function MapView({ venues }: MapProps) {
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
      className="w-full h-full rounded-2xl shadow-sm border border-gray-100 z-0"
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
              <div className="flex flex-col gap-2 min-w-37.5">
                <div>
                  <div className="font-bold text-gray-800 text-base leading-tight">
                    {venue.name}
                  </div>
                  {venue.city && <div className="text-sm text-gray-500 mt-1">{venue.city}</div>}
                </div>

                <div className="border-t border-gray-100 pt-2 mt-1">
                  <Link
                    href={`/venues/${venue.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors inline-flex items-center gap-1"
                  >
                    Ver detalhes do estádio &rarr;
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
