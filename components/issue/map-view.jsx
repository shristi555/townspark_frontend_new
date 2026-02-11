"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView({ latitude, longitude }) {
	const mapRef = useRef(null);
	const mapInstanceRef = useRef(null);

	useEffect(() => {
		if (!mapRef.current || mapInstanceRef.current) return;
		if (!latitude || !longitude) return;

		// Initialize map
		const map = L.map(mapRef.current).setView([latitude, longitude], 15);
		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			maxZoom: 19,
		}).addTo(map);

		// Add marker
		L.marker([latitude, longitude]).addTo(map);

		mapInstanceRef.current = map;

		return () => {
			map.remove();
			mapInstanceRef.current = null;
		};
	}, [latitude, longitude]);

	return <div ref={mapRef} className='w-full h-[300px] rounded-lg' />;
}
