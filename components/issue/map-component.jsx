"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
	iconUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function MapComponent({ selectedLocation, onLocationSelect }) {
	const mapRef = useRef(null);
	const mapInstanceRef = useRef(null);
	const markerRef = useRef(null);

	useEffect(() => {
		if (!mapRef.current || mapInstanceRef.current) return;

		// Initialize map
		const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5); // Default to India center

		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			maxZoom: 19,
		}).addTo(map);

		mapInstanceRef.current = map;

		// Add click handler
		map.on("click", (e) => {
			const { lat, lng } = e.latlng;
			onLocationSelect({ lat, lng });
		});

		return () => {
			map.remove();
			mapInstanceRef.current = null;
		};
	}, [onLocationSelect]);

	// Update marker when location changes
	useEffect(() => {
		if (!mapInstanceRef.current) return;

		const map = mapInstanceRef.current;

		// Remove existing marker
		if (markerRef.current) {
			map.removeLayer(markerRef.current);
		}

		// Add new marker if location exists
		if (selectedLocation) {
			const marker = L.marker([
				selectedLocation.lat,
				selectedLocation.lng,
			]).addTo(map);
			markerRef.current = marker;
			map.setView([selectedLocation.lat, selectedLocation.lng], 15);
		}
	}, [selectedLocation]);

	return <div ref={mapRef} className='w-full h-[400px]' />;
}
