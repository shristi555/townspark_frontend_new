"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Loader2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import useAuthStore from "@/store/auth_store"

export function DeleteAccountDialog({ trigger }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [confirmation, setConfirmation] = useState("")
  
  const { deleteAccount, logout } = useAuthStore()
  const router = useRouter()

  const handleDelete = async () => {
    if (confirmation !== "CONFIRM") return
    
    setIsLoading(true)
    try {
      const result = await deleteAccount()
      if (result.success) {
        toast.success("Account deleted successfully")
        setOpen(false)
        await logout()
        router.push("/")
      } else {
        toast.error(result.error || "Failed to delete account")
      }
    } catch (error) {
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
      <DialogContent className="sm:max-w-[425px] border-destructive">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Delete Account
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        
        <Alert variant="destructive" className="my-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
                All your reported issues, comments, and likes will be permanently removed.
            </AlertDescription>
        </Alert>

        <div className="space-y-4 py-2">
            <div className="space-y-2">
                <Label htmlFor="confirm">Type "CONFIRM" to proceed</Label>
                <Input 
                    id="confirm" 
                    value={confirmation}
                    onChange={(e) => setConfirmation(e.target.value)}
                    placeholder="CONFIRM"
                    className="border-destructive/50 focus-visible:ring-destructive" 
                />
            </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={confirmation !== "CONFIRM" || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
