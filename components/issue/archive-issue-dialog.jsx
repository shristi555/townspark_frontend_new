"use client"

import { useState } from "react"
import { Archive, CheckCircle2, EyeOff, Loader2, ArrowRight } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ProgressUpdateDialog } from "./progress-update-dialog"
import IssueService from "@/services/issue_service"
import { cn } from "@/lib/utils"

export function ArchiveIssueDialog({ issue, trigger, onArchiveSuccess }) {
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState("reason") // 'reason' | 'confirm'
    const [reason, setReason] = useState(null) // 'resolved' | 'hide'
    const [isLoading, setIsLoading] = useState(false)

    const handleArchive = async () => {
        setIsLoading(true)
        try {
            const response = await IssueService.archiveIssue(issue.id)
            if (response.success || response.id) {
                toast.success("Issue moved to the shadows (archived)")
                setOpen(false)
                if (onArchiveSuccess) onArchiveSuccess()
            } else {
                toast.error("Failed to archive report")
            }
        } catch (error) {
            console.error(error)
            toast.error("Could not sync changes")
        } finally {
            setIsLoading(false)
        }
    }

    const onReasonSelect = (selectedReason) => {
        setReason(selectedReason)
        if (selectedReason === "resolved") {
            setStep("confirm_resolved")
        } else {
            handleArchive()
        }
    }

    return (
        <>
            <div onClick={() => setOpen(true)} className="cursor-pointer">
                {trigger}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 bg-background/60 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl">
                    <div className="bg-gradient-to-br from-amber-500/10 via-background to-transparent p-8">
                        <DialogHeader className="mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
                                    <Archive className="w-5 h-5" />
                                </div>
                                <DialogTitle className="text-3xl font-black tracking-tight">Archive Report</DialogTitle>
                            </div>
                            <DialogDescription className="text-muted-foreground font-medium">
                                {step === "reason"
                                    ? "Why are you choosing to archive this community report?"
                                    : "Would you like to document the success before archiving?"}
                            </DialogDescription>
                        </DialogHeader>

                        {step === "reason" ? (
                            <div className="space-y-4">
                                <button
                                    onClick={() => onReasonSelect("resolved")}
                                    className="w-full p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 transition-all flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition-transform">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-black text-lg">It's Resolved</p>
                                            <p className="text-xs text-muted-foreground font-bold italic">The problem has been fixed!</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-emerald-500/50 group-hover:translate-x-1 transition-transform" />
                                </button>

                                <button
                                    onClick={() => onReasonSelect("hide")}
                                    className="w-full p-6 rounded-[2rem] bg-zinc-500/5 border border-zinc-500/10 hover:bg-zinc-500/10 transition-all flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-zinc-500/10 text-zinc-600 group-hover:scale-110 transition-transform">
                                            <EyeOff className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-black text-lg">Just Hide It</p>
                                            <p className="text-xs text-muted-foreground font-bold italic">Remove it from public view for now.</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-zinc-500/50 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="p-6 rounded-[2rem] bg-blue-500/5 border border-blue-500/10 text-center space-y-2">
                                    <p className="font-black text-lg">Add Resolution Proof?</p>
                                    <p className="text-sm text-muted-foreground font-medium">Adding a final progress report helps build trust and points for your profile.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        variant="ghost"
                                        className="rounded-2xl h-14 font-black"
                                        onClick={handleArchive}
                                        disabled={isLoading}
                                    >
                                        Skip & Archive
                                    </Button>

                                    {/* We need to trigger the ProgressUpdateDialog from here */}
                                    <ProgressUpdateDialog
                                        issue={issue}
                                        isFinalDefault={true}
                                        onSuccess={() => handleArchive()}
                                        trigger={
                                            <Button className="rounded-2xl h-14 font-black bg-blue-600 hover:bg-blue-700 w-full">
                                                Add Report
                                            </Button>
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        <DialogFooter className="mt-8 pt-6 border-t border-border/50">
                            {isLoading && (
                                <div className="flex items-center gap-2 text-amber-600 font-black animate-pulse">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Processing Archival...
                                </div>
                            )}
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
