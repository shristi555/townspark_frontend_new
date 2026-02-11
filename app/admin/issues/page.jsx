"use client";

import { useEffect, useState } from "react";
import AdminService from "@/services/admin_service";
import { AdminDataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { 
    AlertCircle, 
    CheckCircle2, 
    Clock, 
    MapPin, 
    MessageSquare, 
    ExternalLink,
    Trash2,
    Calendar,
    Tag
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function AdminIssuesPage() {
    const [issues, setIssues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchIssues = async () => {
        setIsLoading(true);
        try {
            const data = await AdminService.getIssues();
            setIssues(data);
        } catch (error) {
            toast.error("Failed to load issues");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    const toggleStatus = async (issue) => {
        const nextStatus = issue.status === 'Resolved' ? 'Pending' : 'Resolved';
        const isResolved = nextStatus === 'Resolved';
        
        try {
            await AdminService.updateIssue(issue.id, { 
                status: nextStatus,
                is_resolved: isResolved,
                resolved_at: isResolved ? new Date().toISOString() : null
            });
            toast.success(`Issue marked as ${nextStatus}`);
            fetchIssues();
        } catch (error) {
            toast.error("Failed to update issue status");
        }
    };

    const columns = [
        {
            key: "title",
            label: "Report Content",
            render: (val, row) => (
                <div className="flex flex-col max-w-md">
                    <span className="font-black text-foreground truncate">{val}</span>
                    <span className="text-[11px] text-muted-foreground line-clamp-1 mt-1 leading-none">{row.description}</span>
                    <div className="flex items-center gap-3 mt-2">
                        <Badge className="bg-primary/5 text-primary border-none shadow-none text-[9px] font-black uppercase tracking-widest px-2 leading-none h-5 flex items-center">
                            <Tag className="w-2.5 h-2.5 mr-1" /> {row.category_name}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5" /> {row.city || "Unknown City"}
                        </span>
                    </div>
                </div>
            )
        },
        {
            key: "reporter_name",
            label: "Reporter",
            render: (val, row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-sm tracking-tight">{val}</span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest leading-none mt-0.5">{row.reporter_email}</span>
                </div>
            )
        },
        {
            key: "created_at",
            label: "Reported Date",
            render: (val) => (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs font-bold leading-none">{new Date(val).toLocaleDateString()}</span>
                </div>
            )
        },
        {
            key: "status",
            label: "Status",
            render: (val) => {
                const colors = {
                    'Resolved': "bg-green-500/10 text-green-600",
                    'Pending': "bg-amber-500/10 text-amber-600",
                    'In Progress': "bg-blue-500/10 text-blue-600"
                };
                const icon = {
                    'Resolved': <CheckCircle2 className="w-3 h-3 mr-1" />,
                    'Pending': <Clock className="w-3 h-3 mr-1" />,
                    'In Progress': <Activity className="w-3 h-3 mr-1" />
                };
                return (
                    <Badge className={`border-none shadow-none text-[10px] font-black uppercase tracking-widest px-3 py-1 flex items-center w-fit ${colors[val] || "bg-muted text-muted-foreground"}`}>
                        {icon[val]} {val}
                    </Badge>
                );
            }
        }
    ];

    const actions = [
        {
            label: "See Live Details",
            icon: ExternalLink,
            onClick: (row) => window.open(`/issue/mine`, '_blank')
        },
        {
            label: "Toggle Resolution",
            icon: CheckCircle2,
            onClick: (row) => toggleStatus(row)
        },
        {
            label: "Delete Permanent",
            icon: Trash2,
            variant: "destructive",
            onClick: (row) => toast.info("Delete requires manual confirmation logic")
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:items-start justify-between gap-4">
                <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                     Issue Triage Control
                </h2>
                <p className="text-muted-foreground font-medium max-w-xl">
                    Full visibility into every community report. Mark as resolved, track progress, or moderate content to keep Townspark accurate.
                </p>
            </div>

            <AdminDataTable 
                columns={columns} 
                data={issues} 
                isLoading={isLoading}
                searchPlaceholder="Search title, city or reporter..."
                actions={actions}
            />
        </div>
    );
}
