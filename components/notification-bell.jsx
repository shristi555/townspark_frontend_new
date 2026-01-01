"use client"

import { useEffect, useState } from "react"
import { Bell, Check, Trash2, MailOpen } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { usePathname, useRouter } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarMenuButton } from "@/components/ui/sidebar"

import useAuthStore from "@/store/auth_store"
import { cn } from "@/lib/utils"

export function NotificationBell({ isSidebar = false }) {
  const router = useRouter()
  const pathname = usePathname()
  const { 
      notifications, 
      fetchNotifications, 
      markNotificationRead, 
      markAllNotificationsRead, 
      deleteAllNotifications,
      getUnreadCount 
  } = useAuthStore()

  const unreadCount = getUnreadCount()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
     fetchNotifications()
     const interval = setInterval(fetchNotifications, 30000)
     return () => clearInterval(interval)
  }, [pathname])

  const handleClick = (notification) => {
      if (!notification.is_read) {
          markNotificationRead(notification.id)
      }
      
      const { event, related_id } = notification
      if (event === "user_updated" || event === "user_created") {
          router.push("/profile")
      } else if (event.startsWith("issue_")) {
          if (related_id) {
              router.push(`/issues/${related_id}`)
          }
      }
      setIsOpen(false)
  }

  const handleMarkAllRead = (e) => {
      e.preventDefault()
      e.stopPropagation()
      markAllNotificationsRead()
  }

  const handleDeleteAll = (e) => {
      e.preventDefault()
      e.stopPropagation()
      deleteAllNotifications()
  }

  const Trigger = isSidebar ? (
      <SidebarMenuButton tooltip="Notifications" className="group">
          <Bell />
          <span>Notifications</span>
          {unreadCount > 0 && (
             <Badge variant="destructive" className="ml-auto text-xs px-1.5 py-0.5 h-5 min-w-5 flex items-center justify-center animate-in zoom-in">
               {unreadCount}
             </Badge>
          )}
      </SidebarMenuButton>
  ) : (
      <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
             <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 animate-pulse ring-2 ring-background" />
          )}
      </Button>
  )

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        {Trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 max-h-[500px] flex flex-col p-0" align="end" side="right" sideOffset={8}>
        <div className="flex items-center justify-between p-3 border-b">
            <h4 className="font-semibold text-sm">Notifications</h4>
            <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleMarkAllRead} title="Mark all read">
                    <Check className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={handleDeleteAll} title="Delete all">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
        
        <div className="overflow-y-auto max-h-[400px]">
            {notifications.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground flex flex-col items-center gap-3">
                    <div className="p-3 bg-muted rounded-full">
                        <MailOpen className="h-6 w-6 opacity-50" />
                    </div>
                    <p>No new notifications</p>
                </div>
            ) : (
                <DropdownMenuGroup className="p-1">
                    {notifications.map((n) => (
                        <DropdownMenuItem 
                            key={n.id} 
                            onClick={() => handleClick(n)}
                            className={cn(
                                "flex flex-col items-start gap-1 p-3 cursor-pointer rounded-md mb-1 last:mb-0 focus:bg-muted/50",
                                !n.is_read ? "bg-muted/40 border-l-[3px] border-l-primary" : "border-l-[3px] border-l-transparent"
                            )}
                        >
                            <div className="flex items-center justify-between w-full gap-2">
                                <span className={cn("font-medium text-sm truncate flex-1", !n.is_read && "text-foreground")}>
                                    {n.title}
                                </span>
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                {n.description}
                            </p>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
