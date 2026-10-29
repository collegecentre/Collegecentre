"use client";

import * as React from "react";
import { Users, Code2, Sparkles, Check, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { CollegeClubPlaceholder } from "@/types";
import { cn } from "@/lib/utils";

interface CollegeClubsSectionProps {
  clubs: CollegeClubPlaceholder[];
  collegeName: string;
}

export function CollegeClubsSection({ clubs, collegeName }: CollegeClubsSectionProps) {
  const { toast } = useToast();
  const [joinedClubs, setJoinedClubs] = React.useState<Record<string, boolean>>({});

  const handleToggleJoin = (clubId: string, name: string) => {
    const isJoined = joinedClubs[clubId];
    setJoinedClubs((prev) => ({ ...prev, [clubId]: !isJoined }));

    if (!isJoined) {
      toast({
        title: "Interest Registered!",
        description: `Your interest in "${name}" has been recorded. The campus leads will reach out via CollegeCentre.`,
        variant: "default",
      });
    } else {
      toast({
        title: "Membership Cancelled",
        description: `Left "${name}".`,
        variant: "default",
      });
    }
  };

  if (!clubs || clubs.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-border/80 rounded-2xl p-8 space-y-3">
        <Users className="h-8 w-8 mx-auto text-muted-foreground/60" />
        <h3 className="text-base font-semibold text-foreground">No Student Guilds Listed Yet</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Student technical societies and organizations for this campus will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Sub-header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-foreground">Student Societies & Technical Guilds</h2>
          <p className="text-xs text-muted-foreground">
            Active developer guilds, research collectives, and hardware labs at {collegeName}.
          </p>
        </div>
        <Badge variant="outline" size="sm" className="font-mono text-[11px] self-start sm:self-auto">
          Campus Communities
        </Badge>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {clubs.map((club) => {
          const isJoined = !!joinedClubs[club.id];
          const members = isJoined ? club.member_count + 1 : club.member_count;

          return (
            <div
              key={club.id}
              className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-card hover:border-primary/40 transition-all duration-200"
            >
              <div className="space-y-3">
                {/* Category & Members */}
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" size="sm" className="capitalize font-mono text-[10px]">
                    {club.category.replace("_", " ")}
                  </Badge>

                  <span className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                    <Users className="h-3 w-3 text-primary" />
                    <span>{members} members</span>
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-foreground">{club.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-3">
                    {club.description}
                  </p>
                </div>

                {/* Lead Credit */}
                <div className="pt-1 text-[11px] font-mono text-muted-foreground">
                  <span className="opacity-70">Lead: </span>
                  <span className="text-foreground font-medium">{club.lead}</span>
                </div>
              </div>

              {/* Bottom Join / Connect Action */}
              <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between">
                <span className="text-[11px] font-mono text-primary flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Open Cohort</span>
                </span>

                <Button
                  size="xs"
                  variant={isJoined ? "default" : "secondary"}
                  onClick={() => handleToggleJoin(club.id, club.name)}
                  className={cn(
                    "font-mono text-xs h-7 gap-1",
                    isJoined && "bg-emerald-600 hover:bg-emerald-500 text-white"
                  )}
                >
                  {isJoined ? (
                    <>
                      <Check className="h-3 w-3" />
                      <span>Connected</span>
                    </>
                  ) : (
                    <>
                      <span>Join Guild</span>
                      <ArrowUpRight className="h-3 w-3 opacity-70" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
