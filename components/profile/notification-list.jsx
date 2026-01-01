"use client"

import { useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { Bell, MailOpen, Check } from "lucide-react"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import useAuthStore from "@/store/auth_store"
import { cn } from "@/lib/utils"

export function NotificationList() {
    const { 
        notifications, 
        fetchNotifications, 
        markNotificationRead, 
        markAllNotificationsRead 
    } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        fetchNotifications()
    }, [])

    const handleClick = (notification) => {
        if (!notification.is_read) {
            markNotificationRead(notification.id)
        }
        
        const { event, related_id } = notification
        if (event.startsWith("issue_")) {
            if (related_id) {
                router.push(`/issues/${related_id}`)
            }
        }
    }

    return (
        <Card className="h-full border-none shadow-none">
            <CardHeader className="px-0 pt-0 pb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications 
                    <span className="text-sm font-normal text-muted-foreground ml-2">({notifications.filter(n => !n.is_read).length} unread)</span>
                </CardTitle>
                {notifications.length > 0 && (
                    <Button variant="outline" size="sm" onClick={() => markAllNotificationsRead()} className="text-xs">
                        <Check className="w-3 h-3 mr-1" />
                        Mark all read
                    </Button>
                )}
            </CardHeader>
            <CardContent className="px-0">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <div className="p-4 bg-muted rounded-full mb-4">
                            <MailOpen className="h-8 w-8 opacity-50" />
                        </div>
                        <p>No notifications yet</p>
                    </div>
                ) : (
                    <ScrollArea className="h-[500px] pr-4">
                         <div className="space-y-3">
                            {notifications.map((n) => (
                                <div 
                                    key={n.id} 
                                    onClick={() => handleClick(n)}
                                    className={cn(
                                        "flex flex-col gap-1 p-4 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50",
                                        !n.is_read ? "bg-muted/30 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
                                    )}
                                >
                                    <div className="flex items-center justify-between w-full gap-2">
                                        <span className={cn("font-medium text-base", !n.is_read && "text-foreground")}>
                                            {n.title}
                                        </span>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {n.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    )
}
