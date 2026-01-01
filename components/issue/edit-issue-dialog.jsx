"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Loader2 } from "lucide-react"
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

export function EditIssueDialog({ issue, trigger, onUpdateSuccess }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      title: issue.title,
      description: issue.description,
      address: issue.address,
      category_name: issue.category,
      is_resolved: issue.is_resolved
    }
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await IssueService.updateIssue(issue.id, data)
      
      if (response.success || response.id) { 
        toast.success("Issue updated successfully")
        setOpen(false)
        if (onUpdateSuccess) onUpdateSuccess(response.response || response)
      } else {
        toast.error("Failed to update issue")
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Issue</DialogTitle>
          <DialogDescription>
            Update the details of your report.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title", { required: "Title is required" })} />
            {errors.title && <span className="text-xs text-destructive">{errors.title.message}</span>}
          </div>

          <div className="space-y-2">
             <Label htmlFor="description">Description</Label>
             <Textarea id="description" rows={4} {...register("description", { required: "Description is required" })} />
             {errors.description && <span className="text-xs text-destructive">{errors.description.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" {...register("category_name")} placeholder="e.g. Road, Water" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...register("address")} />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Controller
                name="is_resolved"
                control={control}
                render={({ field }) => (
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="is_resolved" 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        <Label htmlFor="is_resolved" className="cursor-pointer">Mark as Resolved</Label>
                    </div>
                )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
