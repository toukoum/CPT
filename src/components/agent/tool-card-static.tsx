// app/agent/tool-card-static.tsx
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, ScanSearch, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Tool {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  parameters: {
    params: {
      name: string;
      type: string;
      required: boolean;
      description: string;
    }[];
  };
  enabled: boolean;
  createdAt: string;
  isDefault?: boolean;
}

interface ToolCardProps {
  tool: Tool;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  newChatId: string;
}

export function ToolCard({ tool, isEnabled, onToggle, newChatId }: ToolCardProps) {
  return (
    <div
      className={`border rounded-lg overflow-hidden hover:shadow-sm transition-all duration-200 ${
        isEnabled ? 'bg-card' : 'bg-muted/30 border-muted'
      }`}
    >
      {/* Tool image */}
      <div className="relative h-24 w-full overflow-hidden bg-gradient-to-br from-[#FF004A]/10 to-[#FF004A]/5">
        <div className={`absolute inset-0 z-10 ${!isEnabled ? 'bg-muted/40' : ''}`}></div>
        <Image
          src={tool.image || "/tools/default.png"}
          alt={tool.name}
          fill
          className={`object-cover ${!isEnabled ? 'filter grayscale' : ''}`}
        />
        <div className="absolute top-2 left-2 items-center justify-start flex flex-col gap-2 z-20">
          <Badge
            variant="outline"
            className="bg-[#FF004A]/10 border-[#FF004A]/20 text-[#FF004A]"
          >
            {tool.category}
          </Badge>

          {/*{tool.isDefault && (
            <Badge
              variant="outline"
              className="bg-[#FF004A]/10 border-[#FF004A]/20 text-[#FF004A]"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Default
            </Badge>
          )}*/}
        </div>
      </div>

      {/* Tool content */}
      <div className="p-4 pt-3">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`font-semibold text-lg ${!isEnabled ? 'text-muted-foreground' : ''}`}>
            {tool.name}
          </h3>
          <Switch
            id={`enable-${tool.id}`}
            checked={isEnabled}
            onCheckedChange={onToggle}
            aria-label={`Enable ${tool.name}`}
          />
        </div>

        <p className={`text-sm mb-3 ${!isEnabled ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
          {tool.description}
        </p>

        <div className="flex items-center text-xs text-muted-foreground mb-4">
          <span>Added {formatDistanceToNow(new Date(tool.createdAt))} ago</span>
          <span className="ml-auto font-medium">System Tool</span>
        </div>

        {/* Details button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`w-full ${!isEnabled ? 'opacity-70' : ''}`}
              disabled={!isEnabled}
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
                    className="ml-2 bg-[#FF004A]/10 border-[#FF004A]/20 text-[#FF004A]"
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
                      {tool.parameters.params?.length > 0 ? (
                        tool.parameters.params.map((param, idx) => (
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
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No parameters required</p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="default" size="sm" asChild>
                <Link href={`/agent/c/${newChatId}`} className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Test in Chat
                </Link>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}