"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useEffect, useState } from "react";

interface UserData {
  id: string;
  walletAddress: string;
  name: string;
  avatar: string;
  createdAt: string;
  stats: {
    ownedToolsCount: number;
    createdToolsCount: number;
  };
}

export default function AgentProfile({ walletAddress }: { walletAddress: string }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/${walletAddress}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUserData(data);
        console.log('User data:', data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (walletAddress) {
      fetchUserData();
    }
  }, [walletAddress]);

  return (
    <Card className="mb-8 overflow-hidden bg-black/20 border border-primary/20">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row items-center gap-6 p-6">
          <div className="relative flex-shrink-0">
            <div className="rounded-full overflow-hidden w-32 h-32 flex items-center justify-center bg-black">
              {loading ? (
                <Skeleton className="w-32 h-32 rounded-full" />
              ) : (
                <Image
                  src="/synto/agentProfilePbw.png"
                  alt="Agent Avatar"
                  width={128}
                  height={128}
                  className="object-cover"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col text-center md:text-left">
            <h1 className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-48" /> : "Synto"}
            </h1>

            <div className="text-muted-foreground mt-2 max-w-md">
              {loading ? (
                <>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </>
              ) : (
                "Your personal AI assistant powered by blockchain tools. Use the tools you've acquired to enhance its capabilities."
              )}
            </div>

            <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Owned Tools</span>
                <span className="font-bold">
                  {loading ? <Skeleton className="h-6 w-8" /> : userData?.stats.createdToolsCount || 0}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Address</span>
                <span className="font-mono text-xs truncate max-w-32">
                  {loading ? (
                    <Skeleton className="h-6 w-32" />
                  ) : (
                    walletAddress.substring(0, 6) + '...' + walletAddress.substring(walletAddress.length - 4)
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}