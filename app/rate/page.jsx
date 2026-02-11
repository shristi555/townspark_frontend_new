"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
    Star, 
    MessageSquare, 
    Send, 
    Edit, 
    CheckCircle2, 
    Sparkles, 
    User, 
    ChevronLeft,
    Heart
} from "lucide-react";
import { toast } from "sonner";
import LandingService from "@/services/landing_service";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 🎨 UI Component: Rating State Indicator (Infographic Style)
 */
const RatingInfographic = ({ rating, label }) => {
    return (
        <div className="flex flex-col items-center gap-4 py-8">
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                <div className="relative flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                            key={star}
                            className={`w-12 h-12 transition-all duration-300 ${
                                star <= rating 
                                ? "fill-yellow-400 text-yellow-500 scale-110 drop-shadow-md" 
                                : "text-muted border-dashed opacity-30"
                            }`}
                        />
                    ))}
                </div>
            </div>
            <p className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {label || "How was your experience?"}
            </p>
        </div>
    );
};

export default function RatingPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [myRating, setMyRating] = useState(null);
    const [view, setView] = useState("loading"); // loading, form, detail, edit

    // Form states
    const [rating, setRating] = useState(5);
    const [feedback, setFeedback] = useState("");
    const [designation, setDesignation] = useState("");

    useEffect(() => {
        fetchRating();
    }, []);

    const fetchRating = async () => {
        setIsLoading(true);
        try {
            const data = await LandingService.getMyRate();
            if (data) {
                setMyRating(data);
                setView("detail");
                // Pre-fill for edit
                setRating(data.rating);
                setFeedback(data.feedback);
                setDesignation(data.designation || "");
            } else {
                setView("form");
            }
        } catch (error) {
            toast.error("Failed to load your rating info");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!feedback.trim()) return toast.error("Please provide some feedback text");
        
        setIsSubmitting(true);
        try {
            if (view === "edit") {
                await LandingService.patchRate({ rating, feedback, designation });
                toast.success("Feedback updated successfully!");
            } else {
                await LandingService.postRate({ rating, feedback, designation });
                toast.success("Thank you for your feedback!");
            }
            await fetchRating();
        } catch (error) {
            toast.error(error.message || "Failed to submit rating");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto py-12 space-y-6">
                <Skeleton className="h-12 w-3/4 mx-auto" />
                <Card className="border-none shadow-none bg-transparent">
                    <CardHeader>
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                
                <AnimatePresence mode="wait">
                    {/* --- DETAILS VIEW --- */}
                    {view === "detail" && (
                        <motion.div 
                            key="detail"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <Card className="border-t-4 border-t-primary shadow-xl overflow-hidden">
                                <CardHeader className="text-center relative pb-0">
                                    <div className="absolute top-4 right-4">
                                        <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                                            <CheckCircle2 className="w-3 h-3 mr-1" /> Verified Feedback
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
                                        <Heart className="w-8 h-8 text-primary fill-current" />
                                        Your Contribution
                                    </CardTitle>
                                    <CardDescription className="text-lg">
                                        Here is what you shared with our community.
                                    </CardDescription>
                                </CardHeader>
                                
                                <CardContent className="space-y-8 pt-6">
                                    <RatingInfographic rating={myRating.rating} label="Community Impact Score" />
                                    
                                    <div className="bg-muted/50 p-6 rounded-2xl relative italic text-muted-foreground text-lg text-center font-medium leading-relaxed">
                                        <div className="absolute -top-3 left-6 text-4xl text-primary/20 font-serif">"</div>
                                        {myRating.feedback}
                                        <div className="absolute -bottom-6 right-6 text-4xl text-primary/20 font-serif">"</div>
                                    </div>

                                    <div className="flex items-center justify-between border-t pt-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                {myRating.user_initials}
                                            </div>
                                            <div>
                                                <p className="font-bold">{myRating.user_name}</p>
                                                <p className="text-sm text-muted-foreground">{myRating.designation || "Active Resident"}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">SUBMITTED ON</p>
                                            <p className="font-medium">{new Date(myRating.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </CardContent>
                                
                                <CardFooter className="bg-primary/5 p-6 flex justify-center gap-4">
                                    <Button 
                                        onClick={() => setView("edit")} 
                                        className="rounded-full px-8 shadow-lg transition-transform hover:scale-105"
                                    >
                                        <Edit className="w-4 h-4 mr-2" /> Edit My Rating
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    )}

                    {/* --- FORM VIEW (CREATE/EDIT) --- */}
                    {(view === "form" || view === "edit") && (
                        <motion.div 
                            key="form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card className="shadow-2xl border-none outline-none overflow-hidden">
                                <CardHeader className="bg-primary text-primary-foreground p-8">
                                    <div className="flex items-center gap-4 mb-4">
                                        {view === "edit" && (
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="hover:bg-white/20 text-white rounded-full"
                                                onClick={() => setView("detail")}
                                            >
                                                <ChevronLeft className="w-6 h-6" />
                                            </Button>
                                        )}
                                        <Sparkles className="w-10 h-10" />
                                    </div>
                                    <CardTitle className="text-4xl font-black">
                                        {view === "edit" ? "Modify Your Story" : "Join the Wall of Love"}
                                    </CardTitle>
                                    <CardDescription className="text-primary-foreground/80 text-lg">
                                        Your voice helps us build a better Townspark.
                                    </CardDescription>
                                </CardHeader>

                                <form onSubmit={handleSubmit}>
                                    <CardContent className="p-8 space-y-8">
                                        <div className="space-y-4">
                                            <Label className="text-lg font-bold">How would you rate Townspark?</Label>
                                            <div className="flex justify-center flex-wrap gap-4 py-4">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setRating(star)}
                                                        className="group relative"
                                                    >
                                                        <Star 
                                                            className={`w-14 h-14 transition-all duration-300 transform ${
                                                                star <= rating 
                                                                ? "fill-yellow-400 text-yellow-500 scale-110 drop-shadow-md rotate-12" 
                                                                : "text-muted hover:text-yellow-200"
                                                            }`}
                                                        />
                                                        {star <= rating && (
                                                            <motion.div 
                                                                layoutId="star-glow"
                                                                className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full"
                                                            />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="text-center text-muted-foreground font-medium">
                                                {rating === 5 ? "Life-changing! 🌟" : 
                                                 rating === 4 ? "Loved it! ❤️" : 
                                                 rating === 3 ? "It's good. 👍" : 
                                                 rating === 2 ? "Needs work. 🔧" : "Poor experience. ⚠️"}
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <Label htmlFor="feedback" className="text-lg font-bold flex items-center gap-2">
                                                <MessageSquare className="w-5 h-5" /> Your Feedback
                                            </Label>
                                            <Textarea 
                                                id="feedback"
                                                placeholder="Tell us what you love or what we can improve..."
                                                className="min-h-[150px] text-lg p-4 rounded-2xl focus:ring-4 focus:ring-primary/10"
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <Label htmlFor="designation" className="text-lg font-bold flex items-center gap-2">
                                                <User className="w-5 h-5" /> Your Identity (Optional)
                                            </Label>
                                            <Input 
                                                id="designation"
                                                placeholder="e.g. Resident of Downtown, City Official..."
                                                className="h-14 text-lg p-4 rounded-xl"
                                                value={designation}
                                                onChange={(e) => setDesignation(e.target.value)}
                                            />
                                            <p className="text-sm text-muted-foreground px-1">
                                                Giving yourself a role makes your feedback more impactful for others!
                                            </p>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="p-8 bg-muted/20">
                                        <Button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="w-full h-16 text-xl font-bold rounded-2xl shadow-xl transition-all active:scale-95"
                                        >
                                            {isSubmitting ? (
                                                "Sharing your story..."
                                            ) : (
                                                <>
                                                    {view === "edit" ? "Update My Feedback" : "Share My Experience"}
                                                    <Send className="w-6 h-6 ml-3" />
                                                </>
                                            )}
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-12 text-center text-muted-foreground italic text-sm">
                    "Great communities are built on constructive feedback."
                </div>
            </div>
        </div>
    );
}
