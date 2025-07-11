'use client';

import { fetchUserTools } from '@/app/actions/tools';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppKitAccount } from '@reown/appkit/react'; // ✅ Reown hook
import { Info, Search, SortAsc } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ToolCard } from './tool-card';

export interface Tool {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  parameters: {
    params: {
      name: string;
      type: string;
      required: boolean;
      description: string;
    }[];
  };
  published: boolean;
  createdAt: string;
  creator: {
    id: string;
    name: string;
    walletAddress: string;
  };
  hasExecutionCode: boolean;
  isDefault?: boolean;
  enabled?: boolean;
}

type SortOption = 'name-asc' | 'name-desc' | 'recent' | 'oldest' | 'enabled';

/**
 * Liste des outils de l’agent (version Reown)
 */
export default function AgentTools({ walletAddress }: { walletAddress: string }) {
  const [tools, setTools]           = useState<Tool[]>([]);
  const [loading, setLoading]       = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy]         = useState<SortOption>('name-asc');

  /* ------------------------------------------------------------------ */
  /*  Reown : status de connexion (facultatif mais pratique)             */
  /* ------------------------------------------------------------------ */
  const { isConnected } = useAppKitAccount();

  /* ------------------------------------------------------------------ */
  /*  Récupération des outils                                           */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!walletAddress) return;

    const loadTools = async () => {
      setLoading(true);
      try {
        const userTools = await fetchUserTools(walletAddress);

        // supprime les doublons
        const uniqueTools = Array.from(
          new Map(userTools.map((t) => [t.id, t])).values()
        );

        setTools(uniqueTools);
      } catch (err) {
        console.error('Error loading tools:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTools();
  }, [walletAddress]);

  /* ------------------------------------------------------------------ */
  /*  Filtre + tri                                                      */
  /* ------------------------------------------------------------------ */
  const filteredAndSortedTools = useMemo(() => {
    let result = [...tools];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'recent':
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'oldest':
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case 'enabled':
        result.sort((a, b) => {
          if (a.enabled === b.enabled) return a.name.localeCompare(b.name);
          return a.enabled ? -1 : 1;
        });
        break;
    }

    return result;
  }, [tools, searchQuery, sortBy]);

  /* ------------------------------------------------------------------ */
  /*  UI                                                                */
  /* ------------------------------------------------------------------ */
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Tools ({filteredAndSortedTools.length})
        </h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Info className="h-4 w-4" />
              What is a tool?
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Understanding Tools</DialogTitle>
              <DialogDescription>
                Tools extend your agent&apos;s capabilities to perform specific
                tasks.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <p>
                Tools are specialized functions that allow your AI agent to
                perform actions such as:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Retrieving real-time data (weather, prices, etc.)</li>
                <li>Interacting with blockchain networks</li>
                <li>Performing calculations or transformations</li>
                <li>Calling external APIs &amp; services</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Enable or disable tools according to your needs.
              </p>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Close</Button>
              </DialogClose>
              <Link href="/agent">
                <Button>Start Chatting</Button>
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search / Sort */}
      <Card className="mb-6 bg-background border-none px-0">
        <CardContent className="pt-2 px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tools…"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sort */}
            <div>
              <Select
                value={sortBy}
                onValueChange={(v) => setSortBy(v as SortOption)}
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <SortAsc className="h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A → Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z → A)</SelectItem>
                  <SelectItem value="recent">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="enabled">Enabled first</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Body */}
      <div className="space-y-4">
        {filteredAndSortedTools.length !== tools.length && (
          <p className="text-sm text-muted-foreground">
            Showing {filteredAndSortedTools.length} of {tools.length} tools
          </p>
        )}

        {loading ? (
          <ToolsLoadingSkeleton />
        ) : filteredAndSortedTools.length === 0 ? (
          searchQuery ? (
            <div className="text-center py-10 border rounded-lg">
              <h3 className="text-lg font-medium mb-2">No Matching Tools</h3>
              <p className="text-muted-foreground mb-6">
                No tools match your current filters.
              </p>
              <Button
                variant="outline"
                onClick={() => setSearchQuery('')}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <EmptyToolsState />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isCreator={
                  tool.creator.walletAddress === walletAddress && !tool.isDefault
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Skeleton & Empty-state components ---------- */

function ToolsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg p-4">
          <Skeleton className="h-32 w-full rounded-md mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-4" />
          <div className="flex justify-between">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyToolsState() {
  return (
    <div className="text-center py-10 border rounded-lg">
      <h3 className="text-lg font-medium mb-2">No Tools Available</h3>
      <p className="text-muted-foreground mb-6">
        You don&apos;t have any tools yet. Get started by browsing the
        marketplace.
      </p>
      <Link href="/shop">
        <Button>Explore Marketplace</Button>
      </Link>
    </div>
  );
}
