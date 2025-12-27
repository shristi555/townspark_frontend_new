"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Upload,
	X,
	MapPin,
	Navigation,
	AlertCircle,
	Image as ImageIcon,
	Send,
	ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import LocationPicker from "./location-picker";

const ISSUE_CATEGORIES = [
	{ value: "pothole", label: "Pothole" },
	{ value: "streetlight", label: "Street Light" },
	{ value: "garbage", label: "Garbage" },
	{ value: "water", label: "Water Supply" },
	{ value: "drainage", label: "Drainage" },
	{ value: "road", label: "Road Damage" },
	{ value: "other", label: "Other" },
];

function ErrorMessage({ message }) {
	if (!message) return null;
	return (
		<div className='flex items-center gap-2 text-destructive text-sm mt-1'>
			<AlertCircle className='w-4 h-4' />
			<span>{message}</span>
		</div>
	);
}

function ImagePreview({ file, onRemove }) {
	const [preview, setPreview] = useState(null);

	useState(() => {
		const reader = new FileReader();
		reader.onloadend = () => setPreview(reader.result);
		reader.readAsDataURL(file);
	}, [file]);

	return (
		<div className='relative group'>
			<div className='relative w-24 h-24 rounded-lg overflow-hidden border-2 border-border bg-muted'>
				{preview ? (
					<Image
						src={preview}
						alt='Preview'
						fill
						className='object-cover'
					/>
				) : (
					<div className='w-full h-full flex items-center justify-center'>
						<ImageIcon className='w-8 h-8 text-muted-foreground' />
					</div>
				)}
			</div>
			<button
				type='button'
				onClick={onRemove}
				className='absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg'
			>
				<X className='w-4 h-4' />
			</button>
		</div>
	);
}

export default function IssueCreateForm({
	onSubmit,
	validationError,
	isSubmitting,
}) {
	const [images, setImages] = useState([]);
	const [showLocationPicker, setShowLocationPicker] = useState(false);
	const [selectedLocation, setSelectedLocation] = useState(null);
	const [category, setCategory] = useState("");

	const handleImageUpload = useCallback(
		(e) => {
			const files = Array.from(e.target.files || []);
			if (images.length + files.length > 10) {
				alert("Maximum 10 images allowed");
				return;
			}
			setImages((prev) => [...prev, ...files]);
		},
		[images.length]
	);

	const removeImage = useCallback((index) => {
		setImages((prev) => prev.filter((_, i) => i !== index));
	}, []);

	const handleFormSubmit = useCallback(
		(e) => {
			e.preventDefault();

			// Create a new FormData from the form
			const formData = new FormData(e.target);

			// Remove any existing uploaded_images entries (if any)
			formData.delete("uploaded_images");

			// Add all images to formData
			images.forEach((image) => {
				formData.append("uploaded_images", image);
			});

			// Add location if selected
			if (selectedLocation) {
				formData.append("latitude", selectedLocation.lat.toString());
				formData.append("longitude", selectedLocation.lng.toString());
				if (selectedLocation.address) {
					formData.append("address", selectedLocation.address);
				}
			}

			console.log("FormData keys after adding images:", [
				...formData.keys(),
			]);
			console.log("FormData images:", formData.getAll("uploaded_images"));
			console.log("Total images count:", images.length);

			// Create a synthetic event object to pass to parent
			const syntheticEvent = {
				...e,
				target: {
					...e.target,
					// Override the FormData getter to return our modified formData
					elements: e.target.elements,
				},
				preventDefault: () => {},
			};

			// Call parent's onSubmit with modified FormData
			// We need to create a custom event that includes our modified FormData
			Object.defineProperty(syntheticEvent, "target", {
				get: function () {
					const formElement = e.target;
					// Intercept FormData creation
					const originalFormData = FormData;
					return new Proxy(formElement, {
						get(target, prop) {
							if (
								prop === "constructor" &&
								target[prop] === HTMLFormElement
							) {
								return {
									...target[prop],
									prototype: {
										...target[prop].prototype,
									},
								};
							}
							return target[prop];
						},
					});
				},
			});

			// Instead, let's just call a modified version
			onSubmit(e, formData);
		},
		[images, selectedLocation, onSubmit]
	);

	return (
		<form onSubmit={handleFormSubmit} className='space-y-6'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<Link href='/'>
						<Button
							type='button'
							variant='ghost'
							size='icon'
							className='rounded-full'
						>
							<ArrowLeft className='w-5 h-5' />
						</Button>
					</Link>
					<div>
						<h1 className='text-3xl font-bold tracking-tight'>
							New Report
						</h1>
						<p className='text-muted-foreground'>
							Help improve your community
						</p>
					</div>
				</div>
			</div>

			{/* General Error */}
			{validationError?.general && (
				<Card className='border-destructive/50 bg-destructive/5'>
					<CardContent className='pt-6'>
						<ErrorMessage message={validationError.general} />
					</CardContent>
				</Card>
			)}

			{/* Image Upload Section */}
			<Card className='shadow-lg'>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<ImageIcon className='w-5 h-5' />
						Evidence Photos
						<span className='text-sm font-normal text-muted-foreground'>
							({images.length}/10)
						</span>
					</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors'>
						<input
							type='file'
							id='image-upload'
							multiple
							accept='image/jpeg,image/jpg,image/png,image/webp'
							onChange={handleImageUpload}
							className='hidden'
						/>
						<label
							htmlFor='image-upload'
							className='cursor-pointer flex flex-col items-center gap-3'
						>
							<div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center'>
								<Upload className='w-8 h-8 text-primary' />
							</div>
							<div>
								<p className='text-sm font-medium'>
									Tap to upload photos
								</p>
								<p className='text-xs text-muted-foreground mt-1'>
									JPEG, PNG, WebP (max 5MB each)
								</p>
							</div>
						</label>
					</div>

					{/* Image Previews */}
					{images.length > 0 && (
						<div className='grid grid-cols-4 gap-3'>
							{images.map((file, index) => (
								<ImagePreview
									key={index}
									file={file}
									onRemove={() => removeImage(index)}
								/>
							))}
						</div>
					)}

					<ErrorMessage message={validationError?.uploaded_images} />
				</CardContent>
			</Card>

			{/* Issue Details Section */}
			<Card className='shadow-lg'>
				<CardHeader>
					<CardTitle>Issue Details</CardTitle>
				</CardHeader>
				<CardContent className='space-y-6'>
					{/* Category */}
					<div className='space-y-2'>
						<Label htmlFor='category'>Category *</Label>
						<Select
							name='category'
							value={category}
							onValueChange={setCategory}
						>
							<SelectTrigger
								className={
									validationError?.category
										? "border-destructive"
										: ""
								}
							>
								<SelectValue placeholder='Select issue type' />
							</SelectTrigger>
							<SelectContent>
								{ISSUE_CATEGORIES.map((cat) => (
									<SelectItem
										key={cat.value}
										value={cat.value}
									>
										{cat.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{/* Hidden input to ensure category is in FormData */}
						<input type='hidden' name='category' value={category} />
						<ErrorMessage message={validationError?.category} />
					</div>

					{/* Title */}
					<div className='space-y-2'>
						<Label htmlFor='title'>Issue Title *</Label>
						<Input
							id='title'
							name='title'
							placeholder='e.g., Deep pothole on Main St.'
							className={
								validationError?.title
									? "border-destructive"
									: ""
							}
						/>
						<ErrorMessage message={validationError?.title} />
					</div>

					{/* Description */}
					<div className='space-y-2'>
						<Label htmlFor='description'>Description *</Label>
						<Textarea
							id='description'
							name='description'
							rows={5}
							placeholder='Please provide more details about the issue...'
							className={
								validationError?.description
									? "border-destructive"
									: ""
							}
						/>
						<ErrorMessage message={validationError?.description} />
					</div>
				</CardContent>
			</Card>

			{/* Location Section */}
			<Card className='shadow-lg'>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<MapPin className='w-5 h-5' />
						Location
						<span className='text-sm font-normal text-muted-foreground'>
							(Optional)
						</span>
					</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					{!showLocationPicker ? (
						<div className='space-y-3'>
							<Button
								type='button'
								variant='outline'
								className='w-full'
								onClick={() => setShowLocationPicker(true)}
							>
								<MapPin className='w-4 h-4 mr-2' />
								Select Location
							</Button>
							<p className='text-xs text-center text-muted-foreground'>
								Or skip to submit without location
							</p>
						</div>
					) : (
						<div className='space-y-4'>
							<LocationPicker
								onLocationSelect={setSelectedLocation}
								selectedLocation={selectedLocation}
							/>
							<Button
								type='button'
								variant='ghost'
								size='sm'
								onClick={() => {
									setShowLocationPicker(false);
									setSelectedLocation(null);
								}}
							>
								Clear Location
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Submit Button */}
			<Card className='shadow-lg'>
				<CardContent className='pt-6'>
					<Button
						type='submit'
						className='w-full h-12 text-base'
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							"Submitting..."
						) : (
							<>
								<Send className='w-4 h-4 mr-2' />
								Submit Report
							</>
						)}
					</Button>
				</CardContent>
			</Card>
		</form>
	);
}
