"use client";

import * as React from "react";
import { Calendar, Clock, MapPin, Users, Bell, Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { CollegeEventPlaceholder } from "@/types";
import { cn } from "@/lib/utils";

interface CollegeEventsSectionProps {
  events: CollegeEventPlaceholder[];
  collegeName: string;
}

export function CollegeEventsSection({ events, collegeName }: CollegeEventsSectionProps) {
  const { toast } = useToast();
  const [rsvpedEvents, setRsvpedEvents] = React.useState<Record<string, boolean>>({});

  const handleToggleRsvp = (eventId: string, title: string) => {
    const isCurrentlyRsvped = rsvpedEvents[eventId];
    setRsvpedEvents((prev) => ({ ...prev, [eventId]: !isCurrentlyRsvped }));

    if (!isCurrentlyRsvped) {
      toast({
        title: "Reminder Set!",
        description: `You'll be notified before "${title}" kicks off.`,
        variant: "default",
      });
    } else {
      toast({
        title: "Reminder Cancelled",
        description: `Notification removed for "${title}".`,
        variant: "default",
      });
    }
  };

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-border/80 rounded-2xl p-8 space-y-3">
        <Calendar className="h-8 w-8 mx-auto text-muted-foreground/60" />
        <h3 className="text-base font-semibold text-foreground">No Upcoming Campus Events</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Campus organizers haven't scheduled any public hackathons or symposiums yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Sub-header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-foreground">Campus Events & Demo Days</h2>
          <p className="text-xs text-muted-foreground">
            Flagship hackathons, builder demo days, and research forums hosted at {collegeName}.
          </p>
        </div>
        <Badge variant="outline" size="sm" className="font-mono text-[11px] self-start sm:self-auto">
          Curated Campus Calendar
        </Badge>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((evt) => {
          const isRsvped = !!rsvpedEvents[evt.id];
          const count = isRsvped ? evt.rsvp_count + 1 : evt.rsvp_count;

          return (
            <div
              key={evt.id}
              className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-card hover:border-primary/40 transition-all duration-200"
            >
              <div className="space-y-3">
                {/* Header row: Category & Date */}
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant={evt.category === "hackathon" ? "brand" : "secondary"}
                    size="sm"
                    className="capitalize font-mono text-[10px]"
                  >
                    {evt.category.replace("_", " ")}
                  </Badge>

                  <span className="flex items-center gap-1.5 text-xs font-mono font-medium text-primary">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{evt.date}</span>
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                {/* Logistics */}
                <div className="space-y-1.5 pt-1 text-xs text-muted-foreground font-mono">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 shrink-0 text-muted-foreground/80" />
                    <span>{evt.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 shrink-0 text-muted-foreground/80" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/60">
                <span className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  <span>{count} interested</span>
                </span>

                <Button
                  size="xs"
                  variant={isRsvped ? "default" : "secondary"}
                  onClick={() => handleToggleRsvp(evt.id, evt.title)}
                  className={cn(
                    "font-mono text-xs h-7 gap-1.5",
                    isRsvped && "bg-emerald-600 hover:bg-emerald-500 text-white"
                  )}
                >
                  {isRsvped ? (
                    <>
                      <Check className="h-3 w-3" />
                      <span>Subscribed</span>
                    </>
                  ) : (
                    <>
                      <Bell className="h-3 w-3" />
                      <span>Notify Me</span>
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
