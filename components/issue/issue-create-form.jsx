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
	Image as ImageIcon,
	Send,
	ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import LocationPicker from "./location-picker";
import { ISSUE_CATEGORIES, MAX_IMAGES } from "./constants";
import { ErrorMessage } from "./shared-components";

//  Utility Components

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

//  Section Components

function FormHeader() {
	return (
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
	);
}

function ImageUploadSection({ images, onImageUpload, onImageRemove, error }) {
	return (
		<Card className='shadow-lg'>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<ImageIcon className='w-5 h-5' />
					Evidence Photos
					<span className='text-sm font-normal text-muted-foreground'>
						({images.length}/{MAX_IMAGES})
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
						onChange={onImageUpload}
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

				{images.length > 0 && (
					<div className='grid grid-cols-4 gap-3'>
						{images.map((file, index) => (
							<ImagePreview
								key={index}
								file={file}
								onRemove={() => onImageRemove(index)}
							/>
						))}
					</div>
				)}

				<ErrorMessage message={error} />
			</CardContent>
		</Card>
	);
}

function IssueDetailsSection({ category, onCategoryChange, errors }) {
	return (
		<Card className='shadow-lg'>
			<CardHeader>
				<CardTitle>Issue Details</CardTitle>
			</CardHeader>
			<CardContent className='space-y-6'>
				<div className='space-y-2'>
					<Label htmlFor='category'>Category *</Label>
					<Select
						name='category'
						value={category}
						onValueChange={onCategoryChange}
					>
						<SelectTrigger
							className={
								errors?.category ? "border-destructive" : ""
							}
						>
							<SelectValue placeholder='Select issue type' />
						</SelectTrigger>
						<SelectContent>
							{ISSUE_CATEGORIES.map((cat) => (
								<SelectItem key={cat.value} value={cat.value}>
									{cat.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<input type='hidden' name='category' value={category} />
					<ErrorMessage message={errors?.category} />
				</div>

				<div className='space-y-2'>
					<Label htmlFor='title'>Issue Title *</Label>
					<Input
						id='title'
						name='title'
						placeholder='e.g., Deep pothole on Main St.'
						className={errors?.title ? "border-destructive" : ""}
					/>
					<ErrorMessage message={errors?.title} />
				</div>

				<div className='space-y-2'>
					<Label htmlFor='description'>Description *</Label>
					<Textarea
						id='description'
						name='description'
						rows={5}
						placeholder='Please provide more details about the issue...'
						className={
							errors?.description ? "border-destructive" : ""
						}
					/>
					<ErrorMessage message={errors?.description} />
				</div>
			</CardContent>
		</Card>
	);
}

function LocationSection({
	showPicker,
	selectedLocation,
	onTogglePicker,
	onLocationSelect,
	onClearLocation,
}) {
	return (
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
				{!showPicker ? (
					<div className='space-y-3'>
						<Button
							type='button'
							variant='outline'
							className='w-full'
							onClick={onTogglePicker}
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
							onLocationSelect={onLocationSelect}
							selectedLocation={selectedLocation}
						/>
						<Button
							type='button'
							variant='ghost'
							size='sm'
							onClick={onClearLocation}
						>
							Clear Location
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

//  Helper Functions

function buildFormData(formElement, images, location) {
	const formData = new FormData(formElement);

	formData.delete("uploaded_images");
	images.forEach((image) => formData.append("uploaded_images", image));

	if (location) {
		formData.append("latitude", location.lat.toString());
		formData.append("longitude", location.lng.toString());
		if (location.address) {
			formData.append("address", location.address);
		}
	}

	return formData;
}

//  Main Component

export default function IssueCreateForm({
	onSubmit,
	validationError,
	isSubmitting,
}) {
	const [images, setImages] = useState([]);
	const [category, setCategory] = useState("");
	const [showLocationPicker, setShowLocationPicker] = useState(false);
	const [selectedLocation, setSelectedLocation] = useState(null);

	const handleImageUpload = useCallback(
		(e) => {
			const files = Array.from(e.target.files || []);
			if (images.length + files.length > MAX_IMAGES) {
				alert(`Maximum ${MAX_IMAGES} images allowed`);
				return;
			}
			setImages((prev) => [...prev, ...files]);
		},
		[images.length]
	);

	const removeImage = useCallback((index) => {
		setImages((prev) => prev.filter((_, i) => i !== index));
	}, []);

	const handleLocationClear = useCallback(() => {
		setShowLocationPicker(false);
		setSelectedLocation(null);
	}, []);

	const handleFormSubmit = useCallback(
		(e) => {
			e.preventDefault();
			const formData = buildFormData(e.target, images, selectedLocation);
			onSubmit(e, formData);
		},
		[images, selectedLocation, onSubmit]
	);

	return (
		<form onSubmit={handleFormSubmit} className='space-y-6'>
			<FormHeader />

			{validationError?.general && (
				<Card className='border-destructive/50 bg-destructive/5'>
					<CardContent className='pt-6'>
						<ErrorMessage message={validationError.general} />
					</CardContent>
				</Card>
			)}

			<ImageUploadSection
				images={images}
				onImageUpload={handleImageUpload}
				onImageRemove={removeImage}
				error={validationError?.uploaded_images}
			/>

			<IssueDetailsSection
				category={category}
				onCategoryChange={setCategory}
				errors={validationError}
			/>

			<LocationSection
				showPicker={showLocationPicker}
				selectedLocation={selectedLocation}
				onTogglePicker={() => setShowLocationPicker(true)}
				onLocationSelect={setSelectedLocation}
				onClearLocation={handleLocationClear}
			/>

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
