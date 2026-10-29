"use client";

import * as React from "react";
import {
  Sun,
  Moon,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Search,
  Mail,
  Copy,
  Trash2,
  Plus,
  Share2,
  GitBranch,
  Award,
  BookOpen,
} from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import {
  Typography,
  Button,
  Input,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  Checkbox,
  Switch,
  Card,
  Avatar,
  AvatarFallback,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  useToast,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Navbar,
  Breadcrumbs,
  Spinner,
  ProgressBar,
  SkeletonCard,
  EmptyState,
  ErrorState,
  ErrorBanner,
  ConfirmationDialog,
} from "@/components/ui";

export default function DesignSystemShowcase() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { toast } = useToast();

  // Dialog & state simulations
  const [modalOpen, setModalOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [progressVal, setProgressVal] = React.useState(68);
  const [checkboxChecked, setCheckboxChecked] = React.useState(true);
  const [switchChecked, setSwitchChecked] = React.useState(true);
  const [selectValue, setSelectValue] = React.useState("cs");

  const handleSimulateAction = () => {
    setButtonLoading(true);
    setTimeout(() => {
      setButtonLoading(false);
      toast({
        title: "Action completed",
        description: "Your student profile tokens were recalculated.",
        variant: "success",
      });
    }, 1200);
  };

  const handleConfirmDelete = async () => {
    setConfirmLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setConfirmLoading(false);
    setConfirmOpen(false);
    toast({
      title: "Item removed",
      description: "Showcase artifact was successfully deleted.",
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        brandName="CollegeCentre"
        brandTag="Design System"
        items={[
          { label: "Overview", href: "#overview", active: true },
          { label: "Typography", href: "#typography" },
          { label: "Tokens", href: "#tokens" },
          { label: "Components", href: "#components" },
          { label: "States", href: "#states" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() =>
                    setTheme(
                      theme === "dark"
                        ? "light"
                        : theme === "light"
                        ? "system"
                        : "dark"
                    )
                  }
                  aria-label="Toggle theme"
                >
                  {resolvedTheme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Theme: {theme} (Click to cycle)
              </TooltipContent>
            </Tooltip>

            <Button
              size="sm"
              variant="brand"
              onClick={() =>
                toast({
                  title: "Design System Tokens",
                  description: "Radix primitives and design tokens are active.",
                  variant: "info",
                })
              }
            >
              Component Spec
            </Button>
          </div>
        }
      />

      <main className="container py-8 sm:py-12 max-w-5xl space-y-16 flex-1">
        {/* Breadcrumb sample */}
        <Breadcrumbs
          items={[
            { label: "CollegeCentre", href: "/" },
            { label: "Design System", href: "#" },
            { label: "Design Tokens & Primitives" },
          ]}
        />

        {/* Hero / Thesis Header */}
        <section id="overview" className="space-y-4 pt-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/5 px-3 py-1 text-xs font-mono font-medium text-brand">
            <Sparkles className="h-3.5 w-3.5" />
            Design System &amp; Project Foundation
          </div>

          <Typography variant="display" as="h1">
            One link for everything you&apos;ve built, achieved, and are.
          </Typography>

          <Typography variant="lead" className="max-w-3xl">
            A restrained, modern design system built for the CollegeCentre student identity platform.
            Crafted with typographic restraint, accessible Radix primitives, and resilient design tokens.
          </Typography>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Badge variant="brand" dot>Student-First Architecture</Badge>
            <Badge variant="outline">Next.js App Router</Badge>
            <Badge variant="outline">Tailwind CSS</Badge>
            <Badge variant="outline">TypeScript Strict</Badge>
            <Badge variant="success" dot>Design System Active</Badge>
          </div>
        </section>

        {/* 1. Typography System */}
        <section id="typography" className="space-y-6 pt-6 border-t border-border">
          <div className="space-y-1">
            <Typography variant="eyebrow">01 / Foundation</Typography>
            <Typography variant="h2">Typography System</Typography>
            <Typography variant="bodySm">
              High-legibility sans-serif paired with precision monospace accents. Clear hierarchical contrast without exaggerated sizes.
            </Typography>
          </div>

          <div className="space-y-4 rounded-lg border border-border p-6 bg-card">
            <div className="space-y-1 pb-4 border-b border-border/60">
              <span className="text-[10px] font-mono uppercase text-muted-foreground">Display</span>
              <Typography variant="display">Alex Rivera, CS & AI</Typography>
            </div>

            <div className="space-y-1 pb-4 border-b border-border/60">
              <span className="text-[10px] font-mono uppercase text-muted-foreground">Heading 1</span>
              <Typography variant="h1">Published Research & Open Source Projects</Typography>
            </div>

            <div className="space-y-1 pb-4 border-b border-border/60">
              <span className="text-[10px] font-mono uppercase text-muted-foreground">Heading 2</span>
              <Typography variant="h2">National Hackathon Winner — 2026</Typography>
            </div>

            <div className="space-y-1 pb-4 border-b border-border/60">
              <span className="text-[10px] font-mono uppercase text-muted-foreground">Heading 3</span>
              <Typography variant="h3">Autonomous Drone Navigation Firmware</Typography>
            </div>

            <div className="space-y-1 pb-4 border-b border-border/60">
              <span className="text-[10px] font-mono uppercase text-muted-foreground">Heading 4</span>
              <Typography variant="h4">Stanford AI Summer Fellowship Fellow</Typography>
            </div>

            <div className="space-y-1 pb-4 border-b border-border/60">
              <span className="text-[10px] font-mono uppercase text-muted-foreground">Lead</span>
              <Typography variant="lead">
                Building distributed systems and real-time inference kernels. Undergraduate researcher at ACM SIGKDD.
              </Typography>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-muted-foreground">Body Regular</span>
                <Typography variant="body">
                  CollegeCentre enables builders to showcase verified repositories, hackathon awards, and research papers with zero fluff.
                </Typography>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-muted-foreground">Monospace / Code</span>
                <p>
                  <Typography variant="code">collegecentre.in/alex-rivera</Typography>
                </p>
                <Typography variant="bodySm">
                  Deterministic vanity links for student portfolios.
                </Typography>
              </div>
            </div>
          </div>
        </section>

        {/* 2-6. Color Tokens, Radius, Shadows & Breakpoints */}
        <section id="tokens" className="space-y-6 pt-6 border-t border-border">
          <div className="space-y-1">
            <Typography variant="eyebrow">02-06 / Visual Tokens</Typography>
            <Typography variant="h2">Colors, Radii & Shadows</Typography>
            <Typography variant="bodySm">
              Calibrated semantic tokens reacting cleanly across light and dark modes.
            </Typography>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-md border border-border bg-card space-y-1.5">
              <div className="h-6 w-full rounded bg-foreground" />
              <div className="text-xs font-semibold">Foreground / Primary</div>
              <div className="text-[11px] font-mono text-muted-foreground">hsl(var(--primary))</div>
            </div>

            <div className="p-3.5 rounded-md border border-border bg-card space-y-1.5">
              <div className="h-6 w-full rounded bg-brand" />
              <div className="text-xs font-semibold">Student Cobalt</div>
              <div className="text-[11px] font-mono text-muted-foreground">hsl(var(--brand))</div>
            </div>

            <div className="p-3.5 rounded-md border border-border bg-card space-y-1.5">
              <div className="h-6 w-full rounded bg-emerald-500" />
              <div className="text-xs font-semibold">Achievement Emerald</div>
              <div className="text-[11px] font-mono text-muted-foreground">hsl(var(--success))</div>
            </div>

            <div className="p-3.5 rounded-md border border-border bg-card space-y-1.5">
              <div className="h-6 w-full rounded bg-muted border border-border/80" />
              <div className="text-xs font-semibold">Muted Surface</div>
              <div className="text-[11px] font-mono text-muted-foreground">hsl(var(--muted))</div>
            </div>
          </div>

          {/* Radii & Shadows Demo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-sm border border-border bg-card text-center shadow-subtle">
              <span className="text-xs font-mono font-medium">rounded-sm (4px)</span>
              <p className="text-[11px] text-muted-foreground mt-1">Tags, checkboxes, badges</p>
            </div>
            <div className="p-4 rounded-md border border-border bg-card text-center shadow-card">
              <span className="text-xs font-mono font-medium">rounded-md (6px)</span>
              <p className="text-[11px] text-muted-foreground mt-1">Buttons, inputs, dropdowns</p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card text-center shadow-hover">
              <span className="text-xs font-mono font-medium">rounded-lg (8px)</span>
              <p className="text-[11px] text-muted-foreground mt-1">Cards, dialogs, showcases</p>
            </div>
          </div>
        </section>

        {/* 7. Buttons */}
        <section id="components" className="space-y-6 pt-6 border-t border-border">
          <div className="space-y-1">
            <Typography variant="eyebrow">07 / Actions</Typography>
            <Typography variant="h2">Buttons</Typography>
            <Typography variant="bodySm">
              Restrained variants with tactile active-compression feedback, loading spinners, and icon alignment.
            </Typography>
          </div>

          <div className="space-y-4 rounded-lg border border-border p-6 bg-card">
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primary Button</Button>
              <Button variant="brand">Cobalt Brand</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Inline Link</Button>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button size="xs">Extra Small</Button>
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large Hero</Button>
              <Button
                variant="outline"
                isLoading={buttonLoading}
                onClick={handleSimulateAction}
              >
                Simulate Loading
              </Button>
              <Button
                variant="default"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                View Profile
              </Button>
            </div>
          </div>
        </section>

        {/* 8-12. Form Controls (Input, Textarea, Select, Checkbox, Switch) */}
        <section className="space-y-6 pt-6 border-t border-border">
          <div className="space-y-1">
            <Typography variant="eyebrow">08-12 / Form Primitives</Typography>
            <Typography variant="h2">Inputs, Selects & Toggles</Typography>
            <Typography variant="bodySm">
              Accessible, keyboard-navigable form inputs with precision error states and helper notes.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-lg border border-border p-6 bg-card">
            {/* Input with prefix */}
            <div className="space-y-4">
              <Input
                label="Student Handle"
                prefixElement={<span className="text-xs font-mono text-muted-foreground">collegecentre.in/</span>}
                placeholder="sreehari"
                helperText="This will be your universal student showcase URL."
              />

              <Input
                prefixElement={<Search className="h-4 w-4 text-muted-foreground" />}
                placeholder="Search achievements, research, or projects..."
              />

              <Input
                type="email"
                prefixElement={<Mail className="h-4 w-4 text-muted-foreground" />}
                defaultValue="invalid-email-address"
                error="Please enter a valid email address."
              />
            </div>

            {/* Select & Textarea */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Field of Study</label>
                <Select value={selectValue} onValueChange={setSelectValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select discipline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Engineering & Science</SelectLabel>
                      <SelectItem value="cs">Computer Science & Engineering</SelectItem>
                      <SelectItem value="ai">Artificial Intelligence & Robotics</SelectItem>
                      <SelectItem value="ee">Electrical & Embedded Systems</SelectItem>
                      <SelectItem value="design">Human-Computer Interaction / Product</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <Textarea
                placeholder="Write a brief student bio (e.g., interests, research thesis, what you love to build)..."
                showCount
                maxLength={180}
                defaultValue="Undergraduate researcher working on distributed consensus and high-throughput streaming systems."
                helperText="Visible on your showcase card."
              />
            </div>

            {/* Checkbox and Switch */}
            <div className="space-y-3 pt-2">
              <Checkbox
                checked={checkboxChecked}
                onCheckedChange={(val) => setCheckboxChecked(Boolean(val))}
                label="Display verified GitHub repositories"
                description="Showcase public commits and starred work on your profile."
              />
              <Checkbox
                indeterminate
                label="Academic honors and fellowships"
                description="Partially verified credentials."
              />
            </div>

            <div className="space-y-3 pt-2">
              <Switch
                checked={switchChecked}
                onCheckedChange={setSwitchChecked}
                label="Public student showcase"
                description="Make your identity discoverable via your CC link."
              />
              <Switch
                label="Open for collaboration / research"
                description="Display active builder badge on your header."
              />
            </div>
          </div>
        </section>

        {/* 13-16. Cards, Avatar, Badges & Tabs */}
        <section className="space-y-6 pt-6 border-t border-border">
          <div className="space-y-1">
            <Typography variant="eyebrow">13-16 / Identity Cards & Micro-UI</Typography>
            <Typography variant="h2">Cards, Avatars, Badges & Tabs</Typography>
            <Typography variant="bodySm">
              Foundational building blocks for student showcase profiles and achievement blocks.
            </Typography>
          </div>

          {/* Interactive Showcase Card Mockup */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="interactive" className="p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <Avatar size="lg" status="verified">
                    <AvatarFallback>AR</AvatarFallback>
                  </Avatar>
                  <Badge variant="brand" size="sm" dot>Verified Builder</Badge>
                </div>
                <div>
                  <Typography variant="h4">Alex Rivera</Typography>
                  <Typography variant="bodySm">MIT • Class of 2026</Typography>
                </div>
                <Typography variant="caption" className="block text-muted-foreground line-clamp-2">
                  Building next-gen distributed file systems and LLM eval pipelines.
                </Typography>
              </div>
              <div className="pt-4 mt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground font-mono">
                <span>12 Projects</span>
                <span className="flex items-center gap-1 text-foreground font-medium">
                  View <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Card>

            <Card variant="default" className="p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="success" dot size="sm">National Award</Badge>
                  <span className="text-[11px] font-mono text-muted-foreground">HackMIT &apos;26</span>
                </div>
                <div>
                  <Typography variant="h4">1st Place — AI & Robotics</Typography>
                  <Typography variant="bodySm">Autonomous drone visual SLAM in GPS-denied tunnels.</Typography>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Badge variant="outline" size="sm">PyTorch</Badge>
                  <Badge variant="outline" size="sm">ROS2</Badge>
                  <Badge variant="outline" size="sm">C++</Badge>
                </div>
              </div>
              <div className="pt-4 mt-2 border-t border-border/60 flex items-center justify-between">
                <Button variant="ghost" size="xs" leftIcon={<GitBranch className="h-3.5 w-3.5" />}>
                  Repo
                </Button>
                <Button variant="ghost" size="xs" leftIcon={<ExternalLink className="h-3.5 w-3.5" />}>
                  Paper
                </Button>
              </div>
            </Card>

            <Card variant="flat" className="p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-brand" />
                  <span className="text-xs font-semibold text-foreground">Academic Publication</span>
                </div>
                <Typography variant="h4">IEEE Transactions &apos;26</Typography>
                <Typography variant="bodySm">
                  Low-latency consensus mechanisms for edge robotics networks.
                </Typography>
              </div>
              <div className="pt-4 border-t border-border/60">
                <Badge variant="outline" size="sm">DOI: 10.1109/TMC.2026</Badge>
              </div>
            </Card>
          </div>

          {/* Tabs variants: Segmented & Underline */}
          <div className="rounded-lg border border-border p-6 bg-card space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-muted-foreground">Underline Tabs</span>
              <Tabs defaultValue="projects" className="w-full">
                <TabsList variant="underline">
                  <TabsTrigger variant="underline" value="projects">Projects (8)</TabsTrigger>
                  <TabsTrigger variant="underline" value="achievements">Achievements (4)</TabsTrigger>
                  <TabsTrigger variant="underline" value="research">Papers & Writing (3)</TabsTrigger>
                  <TabsTrigger variant="underline" value="skills">Toolstack</TabsTrigger>
                </TabsList>
                <TabsContent value="projects" className="pt-2">
                  <p className="text-xs text-muted-foreground">
                    Selected repositories, live web apps, and embedded firmware artifacts.
                  </p>
                </TabsContent>
                <TabsContent value="achievements" className="pt-2">
                  <p className="text-xs text-muted-foreground">
                    Hackathons, scholarships, dean&apos;s list, and contest records.
                  </p>
                </TabsContent>
                <TabsContent value="research" className="pt-2">
                  <p className="text-xs text-muted-foreground">
                    Peer-reviewed publications, preprints, and technical essays.
                  </p>
                </TabsContent>
                <TabsContent value="skills" className="pt-2">
                  <p className="text-xs text-muted-foreground">
                    Languages, frameworks, developer tooling, and specialized hardware.
                  </p>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/60">
              <span className="text-xs font-mono uppercase text-muted-foreground">Segmented Pill Tabs</span>
              <Tabs defaultValue="all">
                <TabsList variant="default">
                  <TabsTrigger variant="default" value="all">All Showcase</TabsTrigger>
                  <TabsTrigger variant="default" value="code">Software</TabsTrigger>
                  <TabsTrigger variant="default" value="hardware">Hardware</TabsTrigger>
                  <TabsTrigger variant="default" value="design">Design</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </section>

        {/* 17-20. Dropdowns, Dialogs, Toasts & Tooltips */}
        <section className="space-y-6 pt-6 border-t border-border">
          <div className="space-y-1">
            <Typography variant="eyebrow">17-20 / Overlays & Feedback</Typography>
            <Typography variant="h2">Dropdowns, Dialogs, Toasts & Tooltips</Typography>
            <Typography variant="bodySm">
              Smooth popovers with backdrop blurs, instant notifications, and keyboard trap protection.
            </Typography>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-6 bg-card">
            {/* Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Showcase Menu
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Student Profile</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => toast({ title: "Copied profile URL", variant: "default" })}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Share Link
                  <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast({ title: "Showcase shared", variant: "info" })}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share to LinkedIn
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  destructive
                  onClick={() => setConfirmOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Showcase
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Modal Dialog */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Open Modal Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Verified Achievement</DialogTitle>
                  <DialogDescription>
                    Add a hackathon win, scholarship, or published paper to your student identity page.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <Input placeholder="Achievement Title (e.g. HackMIT Finalist)" />
                  <Input placeholder="Issuing Organization (e.g. MIT IEEE)" />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setModalOpen(false);
                      toast({
                        title: "Achievement recorded",
                        description: "It has been queued for verification.",
                        variant: "success",
                      });
                    }}
                  >
                    Save Achievement
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Toast Triggers */}
            <Button
              variant="secondary"
              onClick={() =>
                toast({
                  title: "Profile link active",
                  description: "collegecentre.in/alex-rivera is now live.",
                  variant: "success",
                })
              }
            >
              Trigger Success Toast
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                toast({
                  title: "Sync warning",
                  description: "GitHub API rate limit approaching threshold.",
                  variant: "warning",
                })
              }
            >
              Trigger Warning Toast
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                toast({
                  title: "Action failed",
                  description: "Could not fetch verification proofs.",
                  variant: "error",
                  action: {
                    label: "Retry",
                    onClick: () => toast({ title: "Retrying verification...", variant: "info" }),
                  },
                })
              }
            >
              Trigger Error Toast
            </Button>

            {/* Tooltip trigger */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <BookOpen className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                View Academic Portfolio Guide
              </TooltipContent>
            </Tooltip>
          </div>
        </section>

        {/* 22-26. Loading, Skeleton, Empty, Error & Confirmation States */}
        <section id="states" className="space-y-6 pt-6 border-t border-border">
          <div className="space-y-1">
            <Typography variant="eyebrow">22-26 / System States</Typography>
            <Typography variant="h2">Loading, Skeleton, Empty & Error States</Typography>
            <Typography variant="bodySm">
              First-class system states so the application never feels broken or unresponsive.
            </Typography>
          </div>

          {/* Loading & Progress States */}
          <div className="rounded-lg border border-border p-6 bg-card space-y-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                <span className="text-xs text-muted-foreground">Syncing repos...</span>
              </div>
              <div className="flex items-center gap-2">
                <Spinner size="default" color="brand" />
                <span className="text-xs text-muted-foreground">Verifying credentials</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Profile completion</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium text-foreground">{progressVal}%</span>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setProgressVal((prev) => (prev >= 100 ? 20 : prev + 15))}
                  >
                    + Boost
                  </Button>
                </div>
              </div>
              <ProgressBar value={progressVal} />
            </div>
          </div>

          {/* Skeleton State Example */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase text-muted-foreground">Skeleton Placeholder</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>

          {/* Empty State Component */}
          <EmptyState
            title="No projects published yet"
            description="Connect your GitHub, Behance, or add custom showcase cards to complete your profile."
            action={{
              label: "Add First Project",
              onClick: () => setModalOpen(true),
              icon: <Plus className="h-4 w-4" />,
            }}
            secondaryAction={{
              label: "Import from GitHub",
              onClick: () =>
                toast({
                  title: "GitHub Import Initiated",
                  description: "Repository list simulated.",
                  variant: "info",
                }),
            }}
          />

          {/* Error Banner & Error State */}
          <div className="space-y-4">
            <ErrorBanner
              message="Failed to connect to student verification service. Verification is pending."
              onDismiss={() => toast({ title: "Error banner dismissed", variant: "default" })}
            />

            <ErrorState
              title="Failed to load student repositories"
              message="Unable to communicate with the GitHub GraphQL endpoint. Your offline cache is being displayed."
              errorDetails="Error 429: Rate limit exceeded for token cc_dev_pat. Retry-After: 60s."
              onRetry={() =>
                toast({
                  title: "Retrying connection",
                  description: "Endpoint responded with status 200 OK.",
                  variant: "success",
                })
              }
            />
          </div>

          {/* Confirmation Dialog Component */}
          <div className="pt-2">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(true)}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              Test Confirmation Dialog (Destructive)
            </Button>

            <ConfirmationDialog
              open={confirmOpen}
              onOpenChange={setConfirmOpen}
              title="Delete Project Showcase?"
              description="Are you sure you want to delete this project? This will permanently remove its live link and analytics from your public CollegeCentre URL."
              variant="destructive"
              confirmLabel="Delete Forever"
              cancelLabel="Keep Project"
              isLoading={confirmLoading}
              onConfirm={handleConfirmDelete}
            />
          </div>
        </section>

        {/* Design System Footer */}
        <footer className="border-t border-border pt-8 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-foreground flex items-center justify-center text-[9px] font-bold text-background">
              CC
            </div>
            <span>CollegeCentre • Design System &amp; Project Foundation</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px]">Next.js • Tailwind • shadcn/ui • Supabase</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
