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
				toast.error(`Maximum ${MAX_IMAGES} images allowed`);
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
		<form onSubmit={handleFormSubmit} className='space-y-10 pb-20'>
			<FormHeader />

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
				<div className="lg:col-span-12">
					{validationError?.general && (
						<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
							<Card className='border-destructive/20 bg-destructive/5 rounded-[2rem] overflow-hidden'>
								<CardContent className='p-6 flex items-center gap-4'>
									<div className="p-3 rounded-xl bg-destructive/10 text-destructive">
										<AlertCircle className="w-6 h-6" />
									</div>
									<div className="flex-1">
										<p className="text-xs font-black uppercase tracking-widest text-destructive/70">Submission Error</p>
										<ErrorMessage message={validationError.general} />
									</div>
								</CardContent>
							</Card>
						</motion.div>
					)}
				</div>

				{/* Primary Info */}
				<div className="lg:col-span-7 space-y-8">
					<Card className='shadow-2xl border-0 bg-card/60 backdrop-blur-xl rounded-[2.5rem] overflow-hidden'>
						<CardHeader className="bg-primary/5 border-b border-primary/10 py-10 px-8">
							<CardTitle className="text-2xl font-black flex items-center gap-3">
								<Send className="w-6 h-6 text-primary" />
								Report Context
							</CardTitle>
							<p className="text-sm font-medium text-muted-foreground">Define what needs attention in your local area.</p>
						</CardHeader>
						<CardContent className='p-8 space-y-8'>
							<div className='space-y-3'>
								<Label htmlFor='category' className="text-[10px] font-black uppercase tracking-[0.2em] ml-2 opacity-50">Problem Type</Label>
								<Select
									name='category'
									value={category}
									onValueChange={setCategory}
								>
									<SelectTrigger
										className={cn(
											"h-14 rounded-2xl bg-background/50 border-muted-foreground/10 text-base font-bold transition-all hover:bg-background/80",
											validationError?.category ? "border-destructive ring-2 ring-destructive/10" : ""
										)}
									>
										<SelectValue placeholder='Select issue type' />
									</SelectTrigger>
									<SelectContent className="rounded-2xl border-border/50">
										{ISSUE_CATEGORIES.map((cat) => (
											<SelectItem key={cat.value} value={cat.value} className="rounded-xl font-bold py-3">
												{cat.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<input type='hidden' name='category' value={category} />
								<ErrorMessage message={validationError?.category} />
							</div>

							<div className='space-y-3'>
								<Label htmlFor='title' className="text-[10px] font-black uppercase tracking-[0.2em] ml-2 opacity-50">Short Headline</Label>
								<Input
									id='title'
									name='title'
									placeholder='Summarize the problem briefly...'
									className={cn(
										"h-14 rounded-2xl bg-background/50 border-muted-foreground/10 text-lg font-black tracking-tight transition-all hover:bg-background/80",
										validationError?.title ? "border-destructive ring-2 ring-destructive/10" : ""
									)}
								/>
								<ErrorMessage message={validationError?.title} />
							</div>

							<div className='space-y-3'>
								<Label htmlFor='description' className="text-[10px] font-black uppercase tracking-[0.2em] ml-2 opacity-50">Detailed Narrative</Label>
								<Textarea
									id='description'
									name='description'
									rows={6}
									placeholder='Explain exactly what is happening, where, and what impact it has...'
									className={cn(
										"rounded-3xl bg-background/50 border-muted-foreground/10 text-base font-medium leading-relaxed transition-all hover:bg-background/80 resize-none p-5",
										validationError?.description ? "border-destructive ring-2 ring-destructive/10" : ""
									)}
								/>
								<ErrorMessage message={validationError?.description} />
							</div>
						</CardContent>
					</Card>

					{/* Location Logic */}
					<Card className='shadow-2xl border-0 bg-card/60 backdrop-blur-xl rounded-[2.5rem] overflow-hidden'>
						<CardHeader className="py-8 px-8 border-b border-border/50">
							<CardTitle className='flex items-center gap-3 text-xl font-black'>
								<MapPin className='w-5 h-5 text-red-500' />
								Precise Location
							</CardTitle>
						</CardHeader>
						<CardContent className='p-8'>
							{!showLocationPicker ? (
								<div className="flex flex-col items-center justify-center py-10 text-center space-y-6 md:px-10">
									<div className="p-8 rounded-full bg-red-500/10 text-red-500 animate-pulse">
										<MapPin className="h-10 w-10" />
									</div>
									<div className="space-y-2">
										<h4 className="text-lg font-black">Where is this happening?</h4>
										<p className="text-sm font-medium text-muted-foreground opacity-70">Adding a precise location helps authorities respond faster by identifying the exact spot on our community map.</p>
									</div>
									<Button
										type='button'
										variant='outline'
										className='h-12 px-8 rounded-2xl border-2 font-black shadow-lg shadow-red-500/5 hover:-translate-y-1 transition-all'
										onClick={() => setShowLocationPicker(true)}
									>
										Tap to pick on map
									</Button>
								</div>
							) : (
								<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-6'>
									<div className="rounded-[2.5rem] overflow-hidden border-2 border-border shadow-2xl bg-muted h-[400px]">
										<LocationPicker
											onLocationSelect={setSelectedLocation}
											selectedLocation={selectedLocation}
										/>
									</div>
									<div className="flex items-center justify-between px-2">
										<div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
											<div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
											GPS Coordinates Integrated
										</div>
										<Button
											type='button'
											variant='ghost'
											size='sm'
											className="font-black text-[10px] uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors"
											onClick={handleLocationClear}
										>
											Clear Mapping
										</Button>
									</div>
								</motion.div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Evidence Side */}
				<div className="lg:col-span-5 space-y-8">
					<Card className='shadow-2xl border-0 bg-card/60 backdrop-blur-xl rounded-[2.5rem] overflow-hidden sticky top-24'>
						<CardHeader className="bg-zinc-900 dark:bg-zinc-800 text-white p-8">
							<CardTitle className='flex items-center justify-between text-xl font-black'>
								<div className="flex items-center gap-3">
									<ImageIcon className='w-5 h-5 text-primary' />
									Evidence Vault
								</div>
								<span className='text-[10px] font-black bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest'>
									{images.length} / {MAX_IMAGES}
								</span>
							</CardTitle>
						</CardHeader>
						<CardContent className='p-8 space-y-8'>
							<div className={cn(
								'relative border-4 border-dashed rounded-[2.5rem] p-10 text-center transition-all group overflow-hidden',
								'hover:bg-primary/5 hover:border-primary/50',
								images.length > 0 ? "border-emerald-500/30" : "border-border"
							)}>
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
									className='cursor-pointer flex flex-col items-center gap-4 relative z-10'
								>
									<div className='w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner'>
										<Upload className='w-10 h-10 text-primary' />
									</div>
									<div className="space-y-1">
										<p className='text-lg font-black tracking-tight'>
											Upload visuals
										</p>
										<p className='text-[11px] font-bold text-muted-foreground opacity-60 uppercase tracking-widest'>
											Sync up to {MAX_IMAGES} images
										</p>
									</div>
								</label>
							</div>

							<AnimatePresence>
								{images.length > 0 && (
									<motion.div
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										className='grid grid-cols-3 gap-4 pb-4'
									>
										{images.map((file, index) => (
											<ImagePreview
												key={index}
												file={file}
												onRemove={() => removeImage(index)}
											/>
										))}
									</motion.div>
								)}
							</AnimatePresence>

							<ErrorMessage message={validationError?.uploaded_images} />

							<div className="pt-6 border-t border-border/50">
								<Button
									type='submit'
									className='w-full h-16 rounded-[1.5rem] text-lg font-black shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95'
									disabled={isSubmitting}
								>
									{isSubmitting ? (
										<Loader2 className="w-6 h-6 animate-spin" />
									) : (
										<>
											<Send className='w-5 h-5 mr-3' />
											Broadcasting Sync
										</>
									)}
								</Button>
								<p className="text-[10px] text-center text-muted-foreground font-bold mt-4 opacity-50 uppercase tracking-widest">
									By submitting, you agree to local reporting guidelines
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</form>
	);
}
