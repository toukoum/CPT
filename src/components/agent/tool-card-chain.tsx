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
import { NFTAsset } from "@/types/nft";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  MessageSquare,
  Settings,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Tool } from "./agent-tools";

interface ToolCardProps {
  tool: Tool | NFTAsset;
  isCreator: boolean;
}

export function ToolCardChain({ tool, isCreator }: ToolCardProps) {
  const [enabled, setEnabled] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Check if the tool is an NFTAsset
  const isNFTAsset = 'uriResult' in tool;

  const handleEnabledChange = (checked: boolean) => {
    setEnabled(checked);
    // Here you would update the tool's enabled status in your database
    console.log(`Tool ${isNFTAsset ? tool.publicKey : (tool as Tool).id} enabled status changed to ${checked}`);
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow duration-200">
      {/* Tool image */}
      <div className="relative h-24 w-full overflow-hidden">
        <Image
          src={isNFTAsset ? tool.uriResult.image || "/tool-avatars/default.jpeg" : (tool as Tool).image || "/tool-avatars/default.jpeg"}
          alt={tool.name}
          fill
          className="object-cover"
        />
        <Badge
          variant="secondary"
          className="absolute top-2 right-2"
        >
          {isNFTAsset ? 'NFT' : (tool as Tool).category}
        </Badge>
      </div>

      {/* Tool content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{isNFTAsset ? tool.uriResult.name || tool.name : tool.name}</h3>
          <div className="flex items-center">
            <Switch
              id={`enable-${isNFTAsset ? tool.publicKey : (tool as Tool).id}`}
              checked={enabled}
              onCheckedChange={handleEnabledChange}
              aria-label={`Enable ${tool.name}`}
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {isNFTAsset ? tool.uriResult.description : (tool as Tool).description}
        </p>

        <div className="flex items-center text-xs text-muted-foreground mb-4">
          {/* <span>Added {formatDistanceToNow(new Date(tool.createdAt))} ago</span> */}
          {!isCreator && !isNFTAsset && (
            <span className="ml-auto">
              By {(tool as Tool).creator?.name || "Unknown"}
            </span>
          )}
          {isNFTAsset && (
            <span className="ml-auto">
              Owner: {tool.owner.slice(0, 6)}...{tool.owner.slice(-4)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDetailsOpen(!detailsOpen)}
            className="gap-1"
          >
            {detailsOpen ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Details
              </>
            )}
          </Button>

          <div className="flex gap-2">
            {isCreator && !isNFTAsset && (
              <Link href={`/build?edit=${(tool as Tool).id}`}>
                <Button variant="outline" size="sm" className="gap-1">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </Link>
            )}

            <ToolDetailsDialog tool={tool} isCreator={isCreator} />
          </div>
        </div>
      </div>

      {/* Expandable details */}
      {detailsOpen && (
        <div className="px-4 pb-4 border-t pt-4 mt-2">
          {isNFTAsset ? (
            <>
              <h4 className="text-sm font-medium mb-2">Attributes</h4>
              <ul className="space-y-2">
                {tool.uriResult.attributes?.map((attr, index) => (
                  <li key={index} className="text-xs border rounded-md p-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{attr.traitType}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {attr.value}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
              {tool.uriResult.parameters && tool.uriResult.parameters.length > 0 && (
                <>
                  <h4 className="text-sm font-medium mb-2 mt-4">Parameters</h4>
                  <ul className="space-y-2">
                    {tool.uriResult.parameters.map((param, index) => (
                      <li key={index} className="text-xs border rounded-md p-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{param.name}</span>
                          <Badge variant="outline" className="text-[10px]">
                            {param.type}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1">
                          {param.description}
                        </p>
                        {param.required && (
                          <Badge variant="secondary" className="mt-1 text-[10px]">
                            Required
                          </Badge>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          ) : (
            <>
              <h4 className="text-sm font-medium mb-2">Parameters</h4>
              <ul className="space-y-2">
                {!isNFTAsset && 'parameters' in tool && tool.parameters && tool.parameters.params ?
                  tool.parameters.params.map((param, index) => (
                    <li key={index} className="text-xs border rounded-md p-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{param.name}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {param.type}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mt-1">
                        {param.description}
                      </p>
                      {param.required && (
                        <Badge variant="secondary" className="mt-1 text-[10px]">
                          Required
                        </Badge>
                      )}
                    </li>
                  )) :
                  <p className="text-sm text-muted-foreground">No parameters available</p>
                }
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ToolDetailsDialog({ tool, isCreator }: { tool: Tool | NFTAsset; isCreator: boolean }) {
  // Check if the tool is an NFTAsset
  const isNFTAsset = 'uriResult' in tool;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Settings className="h-4 w-4" />
          Config
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isNFTAsset ? tool.uriResult.name || tool.name : tool.name}</DialogTitle>
          <DialogDescription>
            Configure and test this tool
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="parameters">
              <AccordionTrigger>Parameters</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {isNFTAsset && tool.uriResult && tool.uriResult.parameters ?
                    tool.uriResult.parameters.map((param, idx) => (
                      <div key={idx} className="rounded-md border p-3">
                        <div className="flex justify-between">
                          <Label className="font-medium">{param.name}</Label>
                          <Badge variant="outline">{param.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {param.description}
                        </p>
                      </div>
                    )) :
                    !isNFTAsset && 'parameters' in tool && tool.parameters && tool.parameters.params ?
                      tool.parameters.params.map((param, idx) => (
                        <div key={idx} className="rounded-md border p-3">
                          <div className="flex justify-between">
                            <Label className="font-medium">{param.name}</Label>
                            <Badge variant="outline">{param.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {param.description}
                          </p>
                        </div>
                      )) :
                      <p className="text-sm text-muted-foreground">No parameters available</p>
                  }
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
                    <Switch defaultChecked />
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
          <Button variant="outline" size="sm">
            {isCreator && !isNFTAsset && (
              <Link href={`/build?edit=${(tool as Tool).id}`} className="flex items-center gap-1">
                <Edit className="h-4 w-4" />
                Edit Tool
              </Link>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
