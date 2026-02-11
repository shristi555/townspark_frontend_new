"use client";

import { useEffect, useState } from "react";
import AdminService from "@/services/admin_service";
import { AdminDataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { 
    Star, 
    MessageSquare, 
    Eye, 
    EyeOff, 
    Trash2, 
    User,
    CheckCircle2,
    Clock
} from "lucide-react";
import { toast } from "sonner";
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription 
} from "@/components/ui/card";

export default function AdminTestimonialsPage() {
    const [testimonials, setTestimonials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTestimonials = async () => {
        setIsLoading(true);
        try {
            const data = await AdminService.getTestimonials();
            setTestimonials(data);
        } catch (error) {
            toast.error("Failed to load testimonials");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const toggleDisplay = async (testimonial) => {
        try {
            await AdminService.updateTestimonial(testimonial.id, { 
                is_displayed: !testimonial.is_displayed 
            });
            toast.success(`Visibility ${testimonial.is_displayed ? 'hidden' : 'enabled'} successfully`);
            fetchTestimonials();
        } catch (error) {
            toast.error("Failed to update visibility");
        }
    };

    const deleteTestimonial = async (id) => {
        if (!window.confirm("Are you sure you want to delete this feedback? This action is permanent.")) return;
        try {
            await AdminService.deleteTestimonial(id);
            toast.success("Feedback deleted successfully");
            fetchTestimonials();
        } catch (error) {
            toast.error("Failed to delete feedback");
        }
    };

    const columns = [
        {
            key: "user_name",
            label: "Reviewer",
            render: (val, row) => (
                <div className="flex flex-col">
                    <span className="font-black text-foreground">{val}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-none mt-1">
                        {row.designation || "Community Member"}
                    </span>
                    <span className="text-[10px] text-primary font-medium mt-0.5">{row.user_email}</span>
                </div>
            )
        },
        {
            key: "rating",
            label: "Quality",
            render: (val) => (
                <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                            key={star} 
                            className={`w-3 h-3 ${star <= val ? "fill-yellow-400 text-yellow-500" : "text-muted"}`} 
                        />
                    ))}
                    <span className="ml-2 text-xs font-black">{val}.0</span>
                </div>
            )
        },
        {
            key: "feedback",
            label: "Testimonial Context",
            render: (val) => (
                <div className="max-w-md">
                    <p className="text-xs font-medium italic text-muted-foreground line-clamp-2 leading-relaxed">
                        "{val}"
                    </p>
                </div>
            )
        },
        {
            key: "is_displayed",
            label: "Frontend",
            render: (val) => (
                <Badge 
                    className={`border-none shadow-none text-[10px] font-black uppercase tracking-widest px-3 py-1 flex items-center w-fit ${
                        val ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                >
                    {val ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                    {val ? "Public" : "Hidden"}
                </Badge>
            )
        }
    ];

    const actions = [
        {
            label: "Toggle Visibility",
            icon: (row) => row.is_displayed ? EyeOff : Eye,
            onClick: (row) => toggleDisplay(row)
        },
        {
            label: "Delete Feedback",
            icon: Trash2,
            variant: "destructive",
            onClick: (row) => deleteTestimonial(row.id)
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:items-start justify-between gap-4">
                <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                     Testimonial Moderation
                </h2>
                <p className="text-muted-foreground font-medium max-w-2xl">
                    Control which citizen stories appear on the homepage. High ratings (4-5 stars) are automatically prioritized for new visitors.
                </p>
            </div>

            <AdminDataTable 
                columns={columns} 
                data={testimonials} 
                isLoading={isLoading}
                searchPlaceholder="Search reviewer or content..."
                actions={actions}
            />

            <div className="grid md:grid-cols-2 gap-8 mt-12">
                 <Card className="border-none shadow-xl bg-primary text-primary-foreground overflow-hidden">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" /> Moderation Policy
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="opacity-90 space-y-4">
                        <p className="text-sm font-medium">Verify that the user designation is appropriate before making a testimonial public. We aim for diverse feedback from residents, business owners, and city officials.</p>
                        <div className="flex items-center gap-4 pt-4">
                            <div className="flex flex-col">
                                <span className="text-2xl font-black">{testimonials.filter(t => t.is_displayed).length}</span>
                                <span className="text-[10px] uppercase font-bold tracking-widest">Public</span>
                            </div>
                            <div className="w-px h-8 bg-white/20" />
                            <div className="flex flex-col">
                                <span className="text-2xl font-black">{testimonials.filter(t => !t.is_displayed).length}</span>
                                <span className="text-[10px] uppercase font-bold tracking-widest">Pending</span>
                            </div>
                        </div>
                    </CardContent>
                 </Card>

                 <Card className="border-none shadow-xl bg-orange-500 text-white flex items-center justify-center p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-20 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
                    <div className="relative space-y-2">
                        <Star className="w-12 h-12 mx-auto fill-current" />
                        <h3 className="text-2xl font-black">Feature Quality</h3>
                        <p className="text-sm font-medium opacity-80">Only display high-quality feedback to maintain professional brand image.</p>
                    </div>
                 </Card>
            </div>
        </div>
    );
}
