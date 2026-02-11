"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
    Search,
    User,
    FileText,
    Calendar,
    Tag,
    X,
    History,
    ArrowRight,
    Loader2,
    Filter,
    ChevronDown,
    Clock,
    UserCircle,
    MapPin,
    AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import DiscoveryService from "@/services/discovery_service";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";
import { ISSUE_CATEGORIES } from "@/components/issue/constants";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const SEARCH_HISTORY_KEY = "townspark_search_history";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [suggestions, setSuggestions] = useState([]);
    const [results, setResults] = useState({ issues: [], people: [] });
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Filters
    const [type, setType] = useState("all");
    const [category, setCategory] = useState("all");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");

    const debouncedQuery = useDebounce(query, 300);
    const searchRef = useRef(null);

    // Initial load history
    useEffect(() => {
        const history = localStorage.getItem(SEARCH_HISTORY_KEY);
        if (history) {
            setSearchHistory(JSON.parse(history));
        }
    }, []);

    const addToHistory = (q) => {
        if (!q || q.trim() === "") return;
        const newHistory = [q, ...searchHistory.filter(item => item !== q)].slice(0, 5);
        setSearchHistory(newHistory);
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    };

    const removeFromHistory = (e, q) => {
        e.stopPropagation();
        const newHistory = searchHistory.filter(item => item !== q);
        setSearchHistory(newHistory);
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    };

    const fetchSuggestions = useCallback(async (q) => {
        if (q.length < 2) {
            setSuggestions([]);
            return;
        }
        try {
            const response = await DiscoveryService.getSuggestions(q);
            if (response.success) {
                setSuggestions(response.response || []);
            }
        } catch (error) {
            console.error("Suggestion error:", error);
        }
    }, []);

    const performSearch = useCallback(async (isExplicit = false) => {
        if (!query && type === "all" && category === "all" && !startDate && !endDate) return;

        setSearching(true);
        try {
            const params = {
                q: query,
                type,
                category,
                start_date: startDate ? format(startDate, "yyyy-MM-dd") : null,
                end_date: endDate ? format(endDate, "yyyy-MM-dd") : null,
                status: statusFilter !== "all" ? statusFilter : null
            };
            const response = await DiscoveryService.search(params);
            if (response.success) {
                setResults(response.response);
                // Only store in history if user explicitly clicked search or pressed Enter
                if (isExplicit && query.trim()) {
                    addToHistory(query.trim());
                    setShowSuggestions(false);
                }
            }
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setSearching(false);
        }
    }, [query, type, category, startDate, endDate, statusFilter, searchHistory]);

    // Close suggestions on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (debouncedQuery) {
            fetchSuggestions(debouncedQuery);
        } else {
            setSuggestions([]);
        }
    }, [debouncedQuery, fetchSuggestions]);

    useEffect(() => {
        // Automatic search on debounce/filter change, but NOT explicit (don't save to history yet)
        performSearch(false);
    }, [debouncedQuery, category, type, startDate, endDate, statusFilter]);

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.text);
        // Explicitly search after selecting a suggestion
        setTimeout(() => {
            performSearch(true);
        }, 50);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            performSearch(true);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-20">
            <div className="container max-w-5xl mx-auto px-4 pt-12">

                {/* Header Section */}
                <div className="text-center mb-12 space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black tracking-tight"
                    >
                        Explore <span className="text-primary">Townspark</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg max-w-2xl mx-auto"
                    >
                        Search for issues, community members, and track neighborhood progress in real-time.
                    </motion.p>
                </div>

                {/* Search Bar & Filters */}
                <Card className="shadow-2xl border-0 overflow-visible z-50 mb-8 rounded-3xl">
                    <CardContent className="p-4 md:p-6 space-y-6">

                        {/* Main Search Input */}
                        <div className="relative group" ref={searchRef}>
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            </div>
                            <Input
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search by problem, name, city, address or email..."
                                className="h-16 pl-14 pr-32 text-xl rounded-2xl border-2 border-muted hover:border-primary/50 focus-visible:ring-primary/20 transition-all shadow-sm"
                            />
                            <div className="absolute inset-y-0 right-4 flex items-center gap-2">
                                {query && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setQuery("");
                                            setSuggestions([]);
                                        }}
                                        className="rounded-full h-8 w-8"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                                <Button
                                    onClick={() => performSearch(true)}
                                    className="h-10 px-6 rounded-xl font-bold transition-transform active:scale-95"
                                >
                                    Search
                                </Button>
                            </div>

                            {/* Suggestions / History Dropdown */}
                            <AnimatePresence>
                                {showSuggestions && (query.length > 0 || searchHistory.length > 0) && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        className="absolute top-full left-0 right-0 mt-3 bg-card border shadow-2xl overflow-hidden z-[100] rounded-3xl"
                                    >
                                        {/* Suggestions */}
                                        {suggestions.length > 0 && (
                                            <div className="p-3">
                                                <p className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Top Matches</p>
                                                {suggestions.map((s, idx) => (
                                                    <button
                                                        key={`${s.type}-${s.id || idx}`}
                                                        onClick={() => handleSuggestionClick(s)}
                                                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-muted/50 transition-all rounded-2xl text-left group"
                                                    >
                                                        <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                                            {s.type === 'issue' ? <FileText className="w-4 h-4" /> : s.type === 'person' ? <User className="w-4 h-4" /> : <Tag className="w-4 h-4" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-black text-sm group-hover:text-primary transition-colors truncate">{s.text}</p>
                                                                <Badge variant="outline" className="text-[8px] h-4 rounded-full font-black uppercase px-2">{s.type}</Badge>
                                                            </div>
                                                            {s.extra && (
                                                                <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 mt-0.5">
                                                                    <MapPin className="w-2.5 h-2.5" /> {s.extra}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Recent Searches */}
                                        {searchHistory.length > 0 && (
                                            <div className="p-2 border-t bg-muted/20">
                                                <div className="px-4 py-2 flex justify-between items-center">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recent</p>
                                                    <Button variant="ghost" size="sm" className="h-6 text-[10px] font-bold" onClick={() => {
                                                        setSearchHistory([]);
                                                        localStorage.removeItem(SEARCH_HISTORY_KEY);
                                                    }}>Clear All</Button>
                                                </div>
                                                {searchHistory.map((h, idx) => (
                                                    <button
                                                        key={`history-${idx}`}
                                                        onClick={() => {
                                                            setQuery(h);
                                                            performSearch();
                                                        }}
                                                        className="w-full flex items-center gap-4 px-4 py-2.5 hover:bg-card transition-colors rounded-xl text-left group"
                                                    >
                                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                                        <span className="flex-1 text-sm font-medium">{h}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                                                            onClick={(e) => removeFromHistory(e, h)}
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </Button>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Filter Row */}
                        <div className="flex flex-wrap items-center gap-4">

                            {/* Type Filter */}
                            <div className="flex bg-muted/50 p-1 rounded-xl">
                                {[
                                    { id: 'all', label: 'All', icon: Filter },
                                    { id: 'issue', label: 'Issues', icon: FileText },
                                    { id: 'person', label: 'People', icon: User }
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setType(t.id)}
                                        className={cn(
                                            "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all",
                                            type === t.id
                                                ? "bg-background shadow-md text-primary"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <t.icon className="w-4 h-4" />
                                        {t.label}
                                    </button>
                                ))}
                            </div>

                            <div className="h-6 w-px bg-border hidden md:block" />

                            {/* Category Select */}
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="w-[180px] h-11 rounded-xl font-bold border-muted">
                                    <div className="flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-muted-foreground" />
                                        <SelectValue placeholder="Category" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {ISSUE_CATEGORIES.map(cat => (
                                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Date Range Popover */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="h-11 rounded-xl font-bold border-muted gap-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        {startDate ? (
                                            endDate ? (
                                                <span className="text-xs">
                                                    {format(startDate, "MMM d")} - {format(endDate, "MMM d")}
                                                </span>
                                            ) : (
                                                <span className="text-xs">{format(startDate, "MMM d")}</span>
                                            )
                                        ) : "Date Range"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
                                    <div className="p-4 border-b bg-muted/20">
                                        <h4 className="font-bold text-sm">Select Date Range</h4>
                                    </div>
                                    <CalendarComponent
                                        initialFocus
                                        mode="range"
                                        selected={{ from: startDate, to: endDate }}
                                        onSelect={(range) => {
                                            setStartDate(range?.from);
                                            setEndDate(range?.to);
                                        }}
                                        className="rounded-b-2xl"
                                    />
                                    {(startDate || endDate) && (
                                        <div className="p-2 border-t">
                                            <Button
                                                variant="ghost"
                                                className="w-full text-xs font-bold text-destructive"
                                                onClick={() => { setStartDate(null); setEndDate(null); }}
                                            >
                                                Reset Dates
                                            </Button>
                                        </div>
                                    )}
                                </PopoverContent>
                            </Popover>

                            {/* Status Filter */}
                            {type !== 'person' && (
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[150px] h-11 rounded-xl font-bold border-muted">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="resolved">Resolved</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Results Section */}
                <div className="relative min-h-[400px]">
                    {searching && (
                        <div className="absolute inset-x-0 top-0 flex flex-col items-center justify-center py-20 bg-background/50 backdrop-blur-sm z-10 rounded-3xl">
                            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                            <p className="text-lg font-black tracking-widest uppercase opacity-50">Searching Planet...</p>
                        </div>
                    )}

                    {!searching && !results.issues.length && !results.people.length && (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto">
                                <Search className="w-10 h-10 text-muted-foreground/50" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black">No results found</h3>
                                <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                        {/* Issues Results (Main) */}
                        <div className={cn(
                            "space-y-6",
                            type === 'issue' ? "md:col-span-12" : "md:col-span-8"
                        )}>
                            {results.issues.length > 0 && (
                                <>
                                    <div className="flex items-center justify-between px-2">
                                        <h2 className="text-xl font-black flex items-center gap-2">
                                            Issues <Badge variant="secondary" className="rounded-full">{results.issues.length}</Badge>
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {results.issues.map((issue) => (
                                            <Link key={issue.id} href={`/issue/details/${issue.id}`}>
                                                <Card className="rounded-3xl hover:shadow-xl transition-all border-0 bg-card/60 backdrop-blur-sm group">
                                                    <CardContent className="p-5 flex gap-5">
                                                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-muted flex-shrink-0 border-2 border-background shadow-inner">
                                                            {issue.images?.[0] ? (
                                                                <Image
                                                                    src={`${process.env.NEXT_PUBLIC_API_URL}${issue.images[0].image}`}
                                                                    alt={issue.title}
                                                                    fill
                                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                                    unoptimized
                                                                />
                                                            ) : (
                                                                <AlertCircle className="w-8 h-8 m-auto text-muted-foreground/30" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 space-y-2">
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <Badge className="mb-2 bg-primary/10 text-primary border-0 rounded-full text-[10px] font-black uppercase">{issue.category}</Badge>
                                                                    <h3 className="font-black text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">{issue.title}</h3>
                                                                </div>
                                                                <Badge variant={issue.is_resolved ? "success" : "outline"} className="rounded-full">
                                                                    {issue.is_resolved ? 'Fixed' : 'Open'}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{issue.description}</p>
                                                            <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pt-2">
                                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {issue.address?.split(',')[0]}</span>
                                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {format(new Date(issue.created_at), "MMM d")}</span>
                                                                <span className="flex items-center gap-1"><UserCircle className="w-3 h-3" /> {issue.reported_by_name?.split(' ')[0]}</span>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* People Results (Sidebar or List) */}
                        <div className={cn(
                            "space-y-6",
                            type === 'person' ? "md:col-span-12" : "md:col-span-4"
                        )}>
                            {results.people.length > 0 && (
                                <>
                                    <div className="flex items-center justify-between px-2">
                                        <h2 className="text-xl font-black flex items-center gap-2">
                                            Community <Badge variant="secondary" className="rounded-full">{results.people.length}</Badge>
                                        </h2>
                                    </div>
                                    <div className={cn(
                                        "grid gap-4",
                                        type === 'person' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                                    )}>
                                        {results.people.map((person) => (
                                            <Card key={person.id} className="rounded-2xl border-0 bg-card/40 backdrop-blur-sm hover:bg-card/80 transition-all">
                                                <CardContent className="p-4 flex items-center gap-4">
                                                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary/5 border-2 border-background">
                                                        {person.profile_pic ? (
                                                            <Image
                                                                src={person.profile_pic}
                                                                alt={person.full_name}
                                                                fill
                                                                className="object-cover"
                                                                unoptimized
                                                            />
                                                        ) : (
                                                            <UserCircle className="w-full h-full text-primary/20" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-black text-sm truncate">{person.full_name || person.email.split('@')[0]}</h4>
                                                        <p className="text-[10px] text-muted-foreground font-bold truncate opacity-60">{person.email}</p>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="ml-auto rounded-full group">
                                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </div>

            </div>

            {/* Background elements */}
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
        </div>
    );
}

