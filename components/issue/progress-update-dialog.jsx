"use client"

import { useState, useRef } from "react"
import { useForm, Controller } from "react-hook-form"
import { Loader2, Plus, Image as ImageIcon, Trash2, CheckCircle, History } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

import IssueService from "@/services/issue_service"
import { cn } from "@/lib/utils"

export function ProgressUpdateDialog({ issue, trigger, onSuccess, isFinalDefault = false, open: externalOpen, setOpen: setExternalOpen }) {
    const [internalOpen, setInternalOpen] = useState(false)
    const open = externalOpen !== undefined ? externalOpen : internalOpen;
    const setOpen = setExternalOpen !== undefined ? setExternalOpen : setInternalOpen;

    const [isLoading, setIsLoading] = useState(false)
    const [selectedImages, setSelectedImages] = useState([])
    const fileInputRef = useRef(null)

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: "",
            description: "",
            is_final: isFinalDefault
        }
    })

    const onSubmit = async (data) => {
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append("issue_id", issue.id)
            formData.append("title", data.title)
            formData.append("description", data.description)

            selectedImages.forEach(file => {
                formData.append("uploaded_images", file)
            })

            const response = await IssueService.createIssueProgress(formData)

            if (response.success || Array.isArray(response)) {
                toast.success("Progress logged in the vault")

                if (data.is_final) {
                    await IssueService.updateIssue(issue.id, { is_resolved: true })
                }

                setOpen(false)
                reset()
                setSelectedImages([])

                if (onSuccess) {
                    const updatedIssue = await IssueService.getIssueDetails(issue.id)
                    onSuccess(updatedIssue.response || updatedIssue)
                }
            } else {
                toast.error("Failed to post progress")
            }
        } catch (error) {
            console.error(error)
            toast.error("Could not log progress")
        } finally {
            setIsLoading(false)
        }
    }

    const handleImageChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files)
            setSelectedImages(prev => [...prev, ...filesArray].slice(0, 10))
        }
    }

    const removeImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-0 bg-background/60 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl">
                <div className="bg-gradient-to-br from-blue-500/10 via-background to-transparent p-8">
                    <DialogHeader className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
                                <History className="w-5 h-5" />
                            </div>
                            <DialogTitle className="text-3xl font-black tracking-tight">Track Progress</DialogTitle>
                        </div>
                        <DialogDescription className="text-muted-foreground font-medium">
                            Share updates on how the resolution is progressing with the community.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="progress_title" className="text-xs font-black uppercase tracking-widest ml-1 opacity-50">Update Headline</Label>
                                <Input
                                    id="progress_title"
                                    {...register("title", { required: "Headline is required" })}
                                    className="h-12 rounded-2xl bg-background/50 border-muted-foreground/10 focus-visible:ring-blue-500/20 font-bold text-lg px-4"
                                    placeholder="What changed?"
                                />
                                {errors.title && <p className="text-[10px] font-black text-destructive uppercase tracking-wider ml-2">{errors.title.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="progress_description" className="text-xs font-black uppercase tracking-widest ml-1 opacity-50">Narrative Details</Label>
                                <Textarea
                                    id="progress_description"
                                    rows={3}
                                    {...register("description", { required: "Details are required" })}
                                    className="rounded-2xl bg-background/50 border-muted-foreground/10 focus-visible:ring-blue-500/20 font-medium text-base resize-none px-4 py-3"
                                    placeholder="Provide the community with context..."
                                />
                                {errors.description && <p className="text-[10px] font-black text-destructive uppercase tracking-wider ml-2">{errors.description.message}</p>}
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-black uppercase tracking-widest ml-1 opacity-50">Evidence Vault</Label>
                                <div className="grid grid-cols-4 gap-3">
                                    {selectedImages.map((file, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group/img">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute inset-0 bg-destructive/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-6 h-6 text-white" />
                                            </button>
                                        </div>
                                    ))}
                                    {selectedImages.length < 10 && (
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current.click()}
                                            className="aspect-square rounded-2xl border-2 border-dashed border-muted-foreground/10 flex flex-col items-center justify-center gap-2 hover:bg-blue-500/5 transition-colors group"
                                        >
                                            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 group-hover:scale-110 transition-transform">
                                                <Plus className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Add Media</span>
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                />
                            </div>

                            <div className="p-6 rounded-[2rem] bg-blue-500/5 border border-blue-500/10 transition-all hover:bg-blue-500/10">
                                <Controller
                                    name="is_final"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <Label htmlFor="is_final" className="text-sm font-black cursor-pointer flex items-center gap-2">
                                                    <CheckCircle className={cn("w-4 h-4", field.value ? "text-emerald-500" : "text-muted-foreground/50")} />
                                                    Resolve on Success?
                                                </Label>
                                                <p className="text-[10px] font-bold text-muted-foreground max-w-[200px]">Mark this as a final progress update and resolve issue.</p>
                                            </div>
                                            <Checkbox
                                                id="is_final"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="w-8 h-8 rounded-xl border-2 data-[state=checked]:bg-blue-500 data-[state=checked]:border-transparent"
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-6 border-t border-muted-foreground/5 gap-3">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setOpen(false)}
                                className="rounded-2xl font-black h-12 px-8"
                            >
                                Discard
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="rounded-2xl font-black h-12 px-10 shadow-lg shadow-blue-500/20 group hover:scale-105 active:scale-95 transition-all bg-blue-500 text-white hover:bg-blue-600"
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ) : (
                                    <ImageIcon className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                                )}
                                Manifest Progress
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
