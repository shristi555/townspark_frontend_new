"use client";

import { useEffect, useState } from "react";
import AdminService from "@/services/admin_service";
import { AdminDataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
    User, 
    Shield, 
    ShieldCheck, 
    UserX, 
    UserCheck,
    Mail,
    Calendar,
    ArrowUpDown
} from "lucide-react";
import { toast } from "sonner";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await AdminService.getUsers();
            setUsers(data);
        } catch (error) {
            toast.error("Failed to load users");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleStatus = async (user) => {
        try {
            await AdminService.updateUser(user.id, { is_active: !user.is_active });
            toast.success(`User ${user.is_active ? 'deactivated' : 'activated'} successfully`);
            fetchUsers();
        } catch (error) {
            toast.error("Failed to update user status");
        }
    };

    const columns = [
        {
            key: "full_name",
            label: "Resident Info",
            render: (val, row) => (
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/10">
                        <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold uppercase">
                            {row.first_name?.[0]}{row.last_name?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-bold text-foreground">{val}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Mail className="w-2 h-2" /> {row.email}
                        </span>
                    </div>
                </div>
            )
        },
        {
            key: "is_staff",
            label: "Access Level",
            render: (val, row) => (
                <div className="flex flex-col gap-1">
                    {row.is_superuser ? (
                        <Badge className="w-fit bg-red-500/10 text-red-500 border-none shadow-none text-[10px] font-black uppercase tracking-widest px-2">
                             <ShieldCheck className="w-3 h-3 mr-1" /> Super Admin
                        </Badge>
                    ) : row.is_staff ? (
                        <Badge className="w-fit bg-blue-500/10 text-blue-500 border-none shadow-none text-[10px] font-black uppercase tracking-widest px-2">
                             <Shield className="w-3 h-3 mr-1" /> Staff
                        </Badge>
                    ) : (
                        <Badge className="w-fit bg-muted text-muted-foreground border-none shadow-none text-[10px] font-black uppercase tracking-widest px-2">
                             <User className="w-3 h-3 mr-1" /> Resident
                        </Badge>
                    )}
                </div>
            )
        },
        {
            key: "created_at",
            label: "Joined Date",
            render: (val) => (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs font-medium">{new Date(val).toLocaleDateString()}</span>
                </div>
            )
        },
        {
            key: "is_active",
            label: "Account Status",
            render: (val) => (
                <Badge 
                    className={`border-none shadow-none text-[10px] font-black uppercase tracking-widest px-3 py-1 ${
                        val ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                    }`}
                >
                    {val ? "Active" : "Banned"}
                </Badge>
            )
        }
    ];

    const actions = [
        {
            label: "View Profile",
            icon: User,
            onClick: (row) => {
                setSelectedUser(row);
                setShowModal(true);
            }
        },
        {
            label: "Toggle Status",
            icon: (row) => row.is_active ? UserX : UserCheck,
            onClick: (row) => toggleStatus(row),
            variant: "destructive"
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                         Resident Management
                    </h2>
                    <p className="text-muted-foreground font-medium">Manage user accounts and community access levels.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button className="h-11 px-6 rounded-xl font-bold shadow-lg shadow-primary/20">
                         Create Admin Account
                    </Button>
                </div>
            </div>

            <AdminDataTable 
                columns={columns} 
                data={users} 
                isLoading={isLoading}
                onSearch={(term) => console.log("Searching for:", term)}
                actions={actions}
            />

            {/* Quick View Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                    <div className="bg-primary p-8 text-primary-foreground">
                        <DialogHeader>
                            <div className="w-20 h-20 rounded-full border-4 border-white/20 overflow-hidden mb-4 shadow-xl">
                                <Avatar className="h-full w-full">
                                    <AvatarFallback className="bg-white/20 text-white text-3xl font-black">
                                        {selectedUser?.first_name?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <DialogTitle className="text-3xl font-black uppercase tracking-tight">{selectedUser?.full_name}</DialogTitle>
                            <DialogDescription className="text-primary-foreground/70 font-medium">
                                Resident Profile Information
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">Status</p>
                                <p className="font-bold flex items-center gap-2">
                                    {selectedUser?.is_active ? <UserCheck className="w-4 h-4 text-green-500" /> : <UserX className="w-4 h-4 text-red-500" />}
                                    {selectedUser?.is_active ? "Active" : "Inactive"}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">Staff</p>
                                <p className="font-bold flex items-center gap-2">
                                    {selectedUser?.is_staff ? <ShieldCheck className="w-4 h-4 text-primary" /> : <User className="w-4 h-4" />}
                                    {selectedUser?.is_staff ? "Yes" : "No"}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-1 pt-4 border-t border-primary/5">
                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-2">Email Address</p>
                            <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-xl border border-primary/5">
                                <Mail className="w-4 h-4 text-primary" />
                                <p className="font-bold text-sm">{selectedUser?.email}</p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-8 bg-muted/20">
                        <Button variant="outline" className="rounded-xl font-bold" onClick={() => setShowModal(false)}>Close Overview</Button>
                        <Button className="rounded-xl font-bold">Edit Details</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
