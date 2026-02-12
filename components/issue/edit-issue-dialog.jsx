"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Loader2, Pencil, CheckCircle2 } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import IssueService from "@/services/issue_service"
import { ISSUE_CATEGORIES } from "./constants"
import { cn } from "@/lib/utils"

export function EditIssueDialog({ issue, trigger, onUpdateSuccess }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      title: issue.title ?? "",
      description: issue.description ?? "",
      address: issue.address ?? "",
      category_name: issue.category?.toLowerCase() ?? "",
      is_resolved: issue.is_resolved ?? false
    }
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await IssueService.updateIssue(issue.id, data)

      if (response.success || response.id) {
        toast.success("Identity updated successfully")
        setOpen(false)
        if (onUpdateSuccess) onUpdateSuccess(response.response || response)
      } else {
        toast.error("Failed to update report")
      }
    } catch (error) {
      console.error(error)
      toast.error("Could not sync changes")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-0 bg-background/60 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl">
        <div className="bg-gradient-to-br from-primary/10 via-background to-transparent p-8">
          <DialogHeader className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <Pencil className="w-5 h-5" />
              </div>
              <DialogTitle className="text-3xl font-black tracking-tight">Refine Report</DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground font-medium">
              Maintain the accuracy of your community contribution by updating the details below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest ml-1 opacity-50">Problem Headline</Label>
                <Input
                  id="title"
                  {...register("title", { required: "Headline is required" })}
                  className="h-12 rounded-2xl bg-background/50 border-muted-foreground/10 focus-visible:ring-primary/20 font-bold text-lg px-4"
                  placeholder="Summarize the core problem..."
                />
                {errors.title && <p className="text-[10px] font-black text-destructive uppercase tracking-wider ml-2">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest ml-1 opacity-50">Detailed Breakdown</Label>
                <Textarea
                  id="description"
                  rows={4}
                  {...register("description", { required: "Description is required" })}
                  className="rounded-2xl bg-background/50 border-muted-foreground/10 focus-visible:ring-primary/20 font-medium text-base resize-none px-4 py-3"
                  placeholder="Describe the situation in detail..."
                />
                {errors.description && <p className="text-[10px] font-black text-destructive uppercase tracking-wider ml-2">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-xs font-black uppercase tracking-widest ml-1 opacity-50">Category</Label>
                  <Controller
                    name="category_name"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="h-12 rounded-2xl bg-background/50 border-muted-foreground/10 focus-visible:ring-primary/20 font-bold">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-0 shadow-2xl bg-background/95 backdrop-blur-xl">
                          {ISSUE_CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value} className="rounded-xl font-bold py-3 transition-colors">
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-xs font-black uppercase tracking-widest ml-1 opacity-50">Location / Landmark</Label>
                  <Input
                    id="address"
                    {...register("address")}
                    className="h-12 rounded-2xl bg-background/50 border-muted-foreground/10 focus-visible:ring-primary/20 font-bold px-4"
                    placeholder="Where is this occurring?"
                  />
                </div>
              </div>

              <div className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 transition-all hover:bg-emerald-500/10">
                <Controller
                  name="is_resolved"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="is_resolved" className="text-sm font-black cursor-pointer flex items-center gap-2">
                          <CheckCircle2 className={cn("w-4 h-4", field.value ? "text-emerald-500" : "text-muted-foreground/50")} />
                          Problem Solved?
                        </Label>
                        <p className="text-[10px] font-bold text-muted-foreground max-w-[200px]">Mark this as finished and inform the community.</p>
                      </div>
                      <Checkbox
                        id="is_resolved"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="w-8 h-8 rounded-xl border-2 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-transparent"
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
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-2xl font-black h-12 px-10 shadow-lg shadow-primary/20 group hover:scale-105 active:scale-95 transition-all"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                )}
                Save Sync
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
