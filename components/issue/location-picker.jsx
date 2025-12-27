"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigation, MapPin, AlertTriangle } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import("./map-component"), {
	ssr: false,
	loading: () => (
		<div className='w-full h-[400px] bg-muted rounded-lg flex items-center justify-center'>
			<p className='text-muted-foreground'>Loading map...</p>
		</div>
	),
});

export default function LocationPicker({ onLocationSelect, selectedLocation }) {
	const [address, setAddress] = useState("");
	const [locationError, setLocationError] = useState(null);
	const [isGettingLocation, setIsGettingLocation] = useState(false);

	const handleGetCurrentLocation = useCallback(() => {
		setIsGettingLocation(true);
		setLocationError(null);

		// Check if geolocation is supported
		if (!navigator.geolocation) {
			setLocationError("Geolocation is not supported by your browser");
			setIsGettingLocation(false);
			return;
		}

		// Check if we're on HTTPS or localhost
		const isSecureContext = window.isSecureContext;
		if (!isSecureContext && window.location.hostname !== "localhost") {
			setLocationError(
				"Location access requires HTTPS. Please use a secure connection."
			);
			setIsGettingLocation(false);
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const location = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				};
				onLocationSelect(location);
				setIsGettingLocation(false);

				// Reverse geocode to get address
				reverseGeocode(location);
			},
			(error) => {
				let errorMessage = "Unable to get your location";
				switch (error.code) {
					case error.PERMISSION_DENIED:
						errorMessage =
							"Location permission denied. Please enable location access.";
						break;
					case error.POSITION_UNAVAILABLE:
						errorMessage = "Location information unavailable.";
						break;
					case error.TIMEOUT:
						errorMessage = "Location request timed out.";
						break;
				}
				setLocationError(errorMessage);
				setIsGettingLocation(false);
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0,
			}
		);
	}, [onLocationSelect]);

	const reverseGeocode = async (location) => {
		try {
			// Using OpenStreetMap Nominatim for reverse geocoding
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json`
			);
			const data = await response.json();
			if (data.display_name) {
				setAddress(data.display_name);
				onLocationSelect({ ...location, address: data.display_name });
			}
		} catch (error) {
			console.error("Reverse geocoding error:", error);
		}
	};

	const handleMapClick = useCallback(
		(location) => {
			onLocationSelect(location);
			reverseGeocode(location);
		},
		[onLocationSelect]
	);

	return (
		<div className='space-y-4'>
			{/* Location Error Warning */}
			{locationError && (
				<div className='flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg'>
					<AlertTriangle className='w-5 h-5 text-destructive mt-0.5' />
					<div className='flex-1'>
						<p className='text-sm font-medium text-destructive'>
							Location Access Issue
						</p>
						<p className='text-xs text-destructive/80 mt-1'>
							{locationError}
						</p>
					</div>
				</div>
			)}

			{/* Get Current Location Button */}
			<Button
				type='button'
				variant='outline'
				className='w-full'
				onClick={handleGetCurrentLocation}
				disabled={isGettingLocation}
			>
				<Navigation className='w-4 h-4 mr-2' />
				{isGettingLocation
					? "Getting location..."
					: "Use Current Location"}
			</Button>

			{/* Address Display */}
			{selectedLocation && address && (
				<div className='flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg'>
					<MapPin className='w-5 h-5 text-primary mt-0.5' />
					<div className='flex-1'>
						<p className='text-sm font-medium'>Selected Location</p>
						<p className='text-xs text-muted-foreground mt-1'>
							{address}
						</p>
						<p className='text-xs text-muted-foreground mt-1'>
							Lat: {selectedLocation.lat.toFixed(6)}, Lng:{" "}
							{selectedLocation.lng.toFixed(6)}
						</p>
					</div>
				</div>
			)}

			{/* Map Component */}
			<div className='rounded-lg overflow-hidden border-2 border-border shadow-md'>
				<MapComponent
					selectedLocation={selectedLocation}
					onLocationSelect={handleMapClick}
				/>
			</div>
		</div>
	);
}
