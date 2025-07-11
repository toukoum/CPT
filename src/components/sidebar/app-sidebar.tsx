"use client";

import useChatStore from "@/app/hooks/useChatStore";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Moon,
  MoreHorizontal,
  Plus,
  Sun,
  Trash2
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { cn, generateUUID } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  const chats = useChatStore((state) => state.chats);
  const handleDelete = useChatStore((state) => state.handleDelete);
  const userName = useChatStore((state) => state.userName);
  const saveMessages = useChatStore((state) => state.saveMessages);
  const setCurrentChatId = useChatStore((state) => state.setCurrentChatId);
  const isMobile = useIsMobile();

  // Function to create a new chat
  const handleNewChat = (e) => {
    e.stopPropagation(); // Prevent sidebar toggle when clicking the new chat button
    const newChatId = generateUUID();
    saveMessages(newChatId, []);
    setCurrentChatId(newChatId);
    router.push(`/agent/c/${newChatId}`);
  };

  const [showAllChats, setShowAllChats] = useState(false);
  const MAX_CHATS_TO_SHOW = 15;

  // Get chat entries sorted by most recent
  const sortedChats = Object.entries(chats || {})
    .sort(([, a], [, b]) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  // Get chats to display based on showAllChats flag
  const visibleChats = showAllChats
    ? sortedChats
    : sortedChats.slice(0, MAX_CHATS_TO_SHOW);

  return (
    <>
      {/* Mobile sidebar toggle button - Only visible on mobile */}
      {/*{isMobile && (
        <button
          className="fixed z-50 bottom-4 rounded-lg right-6 p-3 bg-primary text-primary-foreground shadow-lg md:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <MessageSquare className="h-5 w-5" />
        </button>
      )}*/}

      <Sidebar
        collapsible="icon"
        onClick={state === "collapsed" ? toggleSidebar : undefined}
      >
        <SidebarHeader className={cn(
          state === "collapsed" ? "flex flex-col items-center py-6" : "py-6"
        )}>
          <div className={cn(
            "flex items-center",
            state === "expanded" ? "justify-between px-4" : "justify-center"
          )}>
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // Prevent sidebar toggle
                router.push('/');
              }}
            >
              <Image
                src="/synto/logo-white-synto.svg"
                alt="Synto"
                width={state === "collapsed" ? 10 : 10}
                height={state === "collapsed" ? 10 : 10}
                className={`${state === "collapsed" ? "h-6 w-6" : "h-4 w-4"}`}
              />
              {state === "expanded" && (
                <span className="font-semibold text-lg">Synto</span>
              )}
            </div>

            {/* Toggle button - only visible when expanded */}
            {state === "expanded" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Only show separator in expanded state */}
          {state === "expanded" && <SidebarSeparator className="mt-6" />}
        </SidebarHeader>

        <SidebarContent className="hide-scrollbar px-2">
          {/* New Chat button - shown in both states */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size={state === "collapsed" ? "icon" : "sm"}
                  className={
                    state === "collapsed" ? "mb-4 w-10 h-10 self-center" : "w-full p-4 py-5"
                  }
                  onClick={handleNewChat}
                >
                  <Plus className="h-5 w-5" strokeWidth={2} />
                  {state === "expanded" && <span className="ml-2">New Chat</span>}
                </Button>
              </TooltipTrigger>
              {state === "collapsed" && (
                <TooltipContent side="right">
                  New Chat
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild className="flex justify-center w-full cursor-pointer">
                <ChevronRight className="h-5 w-5" strokeWidth={2} />
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>

          {/* Previous Chats - Hide completely when sidebar is collapsed */}
          {state === "expanded" && (
            <SidebarGroup className="flex-1 flex flex-col px-0">
              <div className="flex items-center justify-between">
                <SidebarGroupLabel>Recent Conversations</SidebarGroupLabel>
              </div>

              <SidebarGroupContent
                className={cn(
                  "hide-scrollbar flex-1",
                  showAllChats ? "overflow-y-auto flex-grow min-h-0" : ""
                )}
              >
                <SidebarMenu className="space-y-1">
                  {visibleChats.map(([id, chat]) => (
                    <SidebarMenuItem key={id} className="group/menu-item">
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/agent/c/${id}`}
                        className="px-3 py-2.5 text-sm rounded-lg"
                      >
                        <Link
                          href={`/agent/c/${id}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span className="truncate">{chat.messages.length > 0
                            ? (chat.messages[0].content.length > 25
                              ? chat.messages[0].content.substring(0, 25) + '...'
                              : chat.messages[0].content)
                            : "New Chat"}
                          </span>
                        </Link>
                      </SidebarMenuButton>

                      {/* Delete chat dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 absolute right-2 opacity-0 group-hover/menu-item:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                className="w-full flex gap-2 text-red-500 justify-start items-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete chat
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete chat?</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this chat? This
                                  action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(id);
                                  }}
                                >
                                  Delete
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>

                {/* Show more/less button */}
                {sortedChats.length > MAX_CHATS_TO_SHOW && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-3 text-xs text-muted-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAllChats(!showAllChats);
                    }}
                  >
                    {showAllChats ? (
                      <>Show less <ChevronDown className="h-3 w-3 ml-1 rotate-180" /></>
                    ) : (
                      <>Show all ({sortedChats.length}) <ChevronDown className="h-3 w-3 ml-1" /></>
                    )}
                  </Button>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        {/* Footer with user profile shown in both states */}
        <SidebarFooter className={cn(
          "p-4 mt-auto border-t border-border/50",
          state === "collapsed" ? "flex justify-center" : ""
        )}>
          {state === "collapsed" ? (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar
                    className="cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <AvatarImage src="/synto/agentProfilePbw.png" alt={userName} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg font-medium">
                      {userName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {userName}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="cursor-pointer">
                  <AvatarImage src="/synto/agentProfilePbw.png" alt={userName} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg font-medium">
                    {userName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{userName}</span>
              </div>

              {/* Theme toggle button - only in expanded state */}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setTheme(theme === "dark" ? "light" : "dark");
                }}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
    </>
  );
}