"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";
import {
  ChevronDown,
  ChevronsUp,
  Edit,
  MessageSquare,
  ScanSearch,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Tool } from "./agent-tools";

interface ToolCardProps {
  tool: Tool;
  isCreator: boolean;
}

export function ToolCard({ tool, isCreator }: ToolCardProps) {
  const [enabled, setEnabled] = useState(tool.enabled ?? true);
  const [expandDescription, setExpandDescription] = useState(false);
  const isDefaultTool = tool.isDefault ?? false;

  // Description handling
  const descriptionIsTruncated = tool.description.length > 100;
  const displayDescription = expandDescription
    ? tool.description
    : descriptionIsTruncated
      ? `${tool.description.substring(0, 100)}...`
      : tool.description;

  const handleEnabledChange = (checked: boolean) => {
    setEnabled(checked);
    // Here you would update the tool's enabled status in your database
    console.log(`Tool ${tool.id} enabled status changed to ${checked}`);
  };

  return (
    <div
      className={`border rounded-lg overflow-hidden hover:shadow-sm transition-all duration-200 ${enabled
        ? 'bg-card'
        : 'bg-muted/30 border-muted'
        }`}
    >
      {/* Tool image with desaturated filter for disabled tools */}
      <div className="relative h-24 w-full overflow-hidden">
        <div className={`absolute inset-0 z-10 ${!enabled ? 'bg-muted/40' : ''}`}></div>
        <Image
          src={tool.image || "/tool-avatars/default.jpeg"}
          alt={tool.name}
          fill
          className={`object-cover ${!enabled ? 'filter grayscale' : ''}`}
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2 z-20">
          <Badge
            variant="secondary"
            className="mb-1 font-medium"
            style={{ backgroundColor: "#f4f4f5", color: "#18181b" }}
          >
            {tool.category}
          </Badge>

          {isDefaultTool && (
            <Badge
              variant="outline"
              className="bg-background/80 border-primary/20 font-medium"
              style={{ backgroundColor: "#f0f9ff", color: "#0c4a6e", borderColor: "#bae6fd" }}
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Default
            </Badge>
          )}
        </div>
      </div>

      {/* Tool content */}
      <div className="p-4 pt-3">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`font-semibold text-lg ${!enabled ? 'text-muted-foreground' : ''}`}>{tool.name}</h3>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`flex items-center p-1 rounded-md ${!enabled ? 'bg-secondary/50 ring-1 ring-muted-foreground/10' : ''}`}>
                    <Switch
                      id={`enable-${tool.id}`}
                      checked={enabled}
                      onCheckedChange={handleEnabledChange}
                      aria-label={`Enable ${tool.name}`}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p className="text-xs">
                    {enabled ? "Disable tool" : "Enable tool"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="mb-3">
          <p className={`text-sm ${!enabled ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
            {displayDescription}
          </p>
          {descriptionIsTruncated && (
            <button
              onClick={() => setExpandDescription(!expandDescription)}
              className="text-xs mt-1 text-primary hover:underline flex items-center"
            >
              {expandDescription ? (
                <>
                  <ChevronsUp className="h-3 w-3 mr-1" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Read more
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex items-center text-xs text-muted-foreground mb-4">
          <span>Added {formatDistanceToNow(new Date(tool.createdAt))} ago</span>
          {!isCreator && !isDefaultTool && (
            <span className="ml-auto">
              By {tool.creator?.name || "Unknown"}
            </span>
          )}
          {isDefaultTool && (
            <span className="ml-auto font-medium">System Tool</span>
          )}
        </div>

        {/* Details button at the bottom with margins */}
        <div className="px-1 pb-1">
          <ToolDetailsButton tool={tool} isCreator={isCreator} enabled={enabled} />
        </div>
      </div>
    </div>
  );
}

function ToolDetailsButton({
  tool,
  isCreator,
  enabled
}: {
  tool: Tool;
  isCreator: boolean;
  enabled: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`w-full ${!enabled ? 'opacity-70' : ''}`}
          disabled={!enabled}
        >
          <ScanSearch className="h-4 w-4 mr-2" />
          Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {tool.name}
            {tool.isDefault && (
              <Badge
                variant="outline"
                className="ml-2"
                style={{ backgroundColor: "#f0f9ff", color: "#0c4a6e", borderColor: "#bae6fd" }}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Default
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Configure and test this tool
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 text-sm">
          <p>{tool.description}</p>
        </div>

        <div className="py-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="parameters">
              <AccordionTrigger>Parameters</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {tool.parameters && tool.parameters.params?.length > 0 ? tool.parameters.params.map((param, idx) => (
                    <div key={idx} className="rounded-md border p-3">
                      <div className="flex justify-between">
                        <Label className="font-medium">{param.name}</Label>
                        <Badge variant="outline">{param.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {param.description}
                      </p>
                      {param.required && (
                        <Badge variant="secondary" className="mt-1 text-[10px]">
                          Required
                        </Badge>
                      )}
                    </div>
                  )) : <p className="text-sm text-muted-foreground">No parameters required</p>}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="settings">
              <AccordionTrigger>Settings</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Tool</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow the agent to use this tool
                      </p>
                    </div>
                    <Switch defaultChecked={tool.enabled ?? true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-Prompt</Label>
                      <p className="text-xs text-muted-foreground">
                        Suggest this tool when relevant
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="secondary" size="sm">
            <Link href="/agent" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              Test in Chat
            </Link>
          </Button>

          {isCreator && !tool.isDefault && (
            <Button variant="outline" size="sm">
              <Link href={`/build?edit=${tool.id}`} className="flex items-center gap-1">
                <Edit className="h-4 w-4" />
                Edit Tool
              </Link>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}