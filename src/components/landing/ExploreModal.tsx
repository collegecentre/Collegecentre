"use client";

import * as React from "react";
import { ArrowRight, Search, Award } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const sampleProfiles = [
  {
    handle: "sreehari",
    name: "Sreehari Nair",
    college: "National Institute of Technology '26",
    major: "Computer Science & Systems",
    avatar: "SN",
    tagline: "Building CollegeCentre 2.0. Distributed systems, web platform architecture, and developer productivity tools.",
    highlight: "Core Architect • CollegeCentre",
    linkCount: 15,
    badge: "Verified Student",
  },
  {
    handle: "alexrivera",
    name: "Alex Rivera",
    college: "UC Berkeley '26",
    major: "CS & Distributed Systems",
    avatar: "AR",
    tagline: "Autonomous drone firmware, Rust, and high-throughput streaming systems.",
    highlight: "1st Place • HackMIT 2026",
    linkCount: 14,
    badge: "Verified Builder",
  },
  {
    handle: "priyasharma",
    name: "Priya Sharma",
    college: "Stanford University '25",
    major: "AI & Computational Neuroscience",
    avatar: "PS",
    tagline: "Brain-computer interfaces and real-time EEG feature extraction in PyTorch.",
    highlight: "NeurIPS Workshop Author",
    linkCount: 11,
    badge: "Researcher",
  },
  {
    handle: "kavyapatel",
    name: "Kavya Patel",
    college: "Georgia Tech '27",
    major: "Computer Science & Systems",
    avatar: "KP",
    tagline: "Kernel hacker, eBPF observer, and rustaceans lead at GT Systems Lab.",
    highlight: "Systems Lab Lead",
    linkCount: 12,
    badge: "Systems Hacker",
  },
  {
    handle: "marcus-chen",
    name: "Marcus Chen",
    college: "UC Berkeley '26",
    major: "EECS & Hardware",
    avatar: "MC",
    tagline: "RISC-V tapeouts, FPGA accelerated vision pipelines, and PCB design.",
    highlight: "Apple Engineering Scholar",
    linkCount: 9,
    badge: "Hardware Lead",
  },
  {
    handle: "elena-rostova",
    name: "Elena Rostova",
    college: "ETH Zürich '26",
    major: "Robotics & Perception",
    avatar: "ER",
    tagline: "Visual SLAM in subterranean environments. Open source ROS2 contributor.",
    highlight: "RoboCup Champion",
    linkCount: 16,
    badge: "Verified Builder",
  },
];

export interface ExploreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectProfile?: (handle: string) => void;
}

export function ExploreModal({
  open,
  onOpenChange,
  onSelectProfile,
}: ExploreModalProps) {
  const [search, setSearch] = React.useState("");

  const filtered = sampleProfiles.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.college.toLowerCase().includes(search.toLowerCase()) ||
      p.major.toLowerCase().includes(search.toLowerCase()) ||
      p.tagline.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="brand" dot size="sm">
              Student Directory
            </Badge>
          </div>
          <DialogTitle className="text-xl">Explore student showcases</DialogTitle>
          <DialogDescription>
            Discover verified portfolios, hardware builds, and research from top universities.
          </DialogDescription>
        </DialogHeader>

        <div className="pt-2">
          <Input
            placeholder="Search by student, university, or discipline..."
            prefixElement={<Search className="h-4 w-4 text-muted-foreground" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
          {filtered.map((profile) => (
            <div
              key={profile.handle}
              onClick={() => {
                if (onSelectProfile) onSelectProfile(profile.handle);
                onOpenChange(false);
              }}
              className="group p-4 rounded-lg border border-border bg-card hover:border-foreground/30 hover:shadow-subtle transition-all cursor-pointer space-y-2.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar size="default" status="verified">
                    <AvatarFallback>{profile.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                        {profile.name}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        @{profile.handle}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {profile.college} • {profile.major}
                    </p>
                  </div>
                </div>

                <Badge variant="secondary" size="sm" dot>
                  {profile.badge}
                </Badge>
              </div>

              <p className="text-xs text-foreground/80 leading-relaxed">
                {profile.tagline}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium text-brand">
                  <Award className="h-3.5 w-3.5" /> {profile.highlight}
                </span>
                <span className="flex items-center gap-1 group-hover:text-foreground font-mono font-medium">
                  {profile.linkCount} items <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-8 text-xs text-muted-foreground">
              No student profiles matching &ldquo;{search}&rdquo;.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
