"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
    ChevronLeft, 
    ChevronRight, 
    Search,
    Filter,
    MoreHorizontal
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AdminDataTable({ 
    columns, 
    data, 
    isLoading, 
    onSearch, 
    searchPlaceholder = "Search...",
    onRowClick,
    actions = []
}) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        if (onSearch) onSearch(e.target.value);
    };

    if (isLoading) {
        return (
            <div className="w-full space-y-4">
                <div className="h-10 w-64 bg-muted animate-pulse rounded-xl" />
                <div className="h-[400px] w-full bg-muted animate-pulse rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={handleSearch}
                        className="pl-10 h-11 rounded-xl bg-background border-none shadow-inner"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="rounded-xl h-11 border-none shadow-sm bg-background">
                        <Filter className="w-4 h-4 mr-2" /> Filter
                    </Button>
                </div>
            </div>

            <div className="rounded-2xl border bg-background shadow-xl overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead key={column.key} className="font-bold py-5 text-muted-foreground uppercase text-[11px] tracking-widest leading-none">
                                    {column.label}
                                </TableHead>
                            ))}
                            {actions.length > 0 && <TableHead className="w-[80px]"></TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="h-32 text-center text-muted-foreground">
                                    No records found matching your search.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.map((row, rowIndex) => (
                                <TableRow 
                                    key={row.id || rowIndex} 
                                    onClick={() => onRowClick && onRowClick(row)}
                                    className={onRowClick ? "cursor-pointer hover:bg-muted/20" : ""}
                                >
                                    {columns.map((column) => (
                                        <TableCell key={column.key} className="py-4 font-medium">
                                            {column.render ? column.render(row[column.key], row) : row[column.key]}
                                        </TableCell>
                                    ))}
                                    {actions.length > 0 && (
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl shadow-xl border-none">
                                                    <DropdownMenuLabel className="text-xs text-muted-foreground uppercase font-bold tracking-widest px-4 py-2">Row Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    {actions.map((action, i) => (
                                                        <DropdownMenuItem 
                                                            key={i} 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                action.onClick(row);
                                                            }}
                                                            className={`px-4 py-2 font-medium cursor-pointer ${action.variant === 'destructive' ? 'text-red-500' : ''}`}
                                                        >
                                                            {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                                                            {action.label}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between px-2 py-4 border-t border-primary/5">
                <div className="text-sm text-muted-foreground font-medium">
                    Showing <span className="font-bold text-foreground">{data?.length}</span> entries
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="rounded-lg h-9 w-9 p-0" disabled>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                        <Button size="sm" className="h-9 w-9 rounded-lg bg-primary font-bold">1</Button>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-lg h-9 w-9 p-0" disabled>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
