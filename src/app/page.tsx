"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Header,
  Hero,
  ProfilePreview,
  WhyCollegeCentre,
  ShowcaseGrid,
  HowItWorks,
  ThemesSection,
  FinalCTA,
  Footer,
  ClaimHandleModal,
  LoginModal,
  ExploreModal,
} from "@/components/landing";

export default function LandingPage() {
  const router = useRouter();
  const [claimModalOpen, setClaimModalOpen] = React.useState(false);
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);
  const [exploreModalOpen, setExploreModalOpen] = React.useState(false);
  const [targetHandle, setTargetHandle] = React.useState("yourname");

  const handleOpenClaim = (handle?: string) => {
    if (handle) {
      setTargetHandle(handle);
    }
    setClaimModalOpen(true);
  };

  const handleOpenLogin = () => {
    setLoginModalOpen(true);
  };

  const handleOpenExplore = () => {
    setExploreModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground transition-colors duration-200">
      {/* 1. Header */}
      <Header
        onOpenClaim={() => handleOpenClaim()}
        onOpenLogin={handleOpenLogin}
        onOpenExplore={handleOpenExplore}
      />

      <main className="flex-1 space-y-12 sm:space-y-16">
        {/* 2. Hero Section */}
        <Hero
          onOpenClaim={handleOpenClaim}
          onOpenExplore={handleOpenExplore}
        />

        {/* 3. Product Preview (Interactive realistic student showcase) */}
        <ProfilePreview />

        {/* 4. Why CollegeCentre (Generic link vs Student Showcase) */}
        <WhyCollegeCentre />

        {/* 5. Showcase Sections (6 Core modules) */}
        <ShowcaseGrid />

        {/* 6. How it works (Create → Customize → Share) */}
        <HowItWorks onOpenClaim={() => handleOpenClaim()} />

        {/* 7. Themes (Visual profile theme previews) */}
        <ThemesSection />

        {/* 8. Final CTA (High conversion claimer) */}
        <FinalCTA onOpenClaim={handleOpenClaim} />
      </main>

      {/* 9. Footer */}
      <Footer />

      {/* Interactive Modals */}
      <ClaimHandleModal
        open={claimModalOpen}
        onOpenChange={setClaimModalOpen}
        initialHandle={targetHandle}
      />

      <LoginModal
        open={loginModalOpen}
        onOpenChange={setLoginModalOpen}
        onOpenClaim={() => handleOpenClaim()}
      />

      <ExploreModal
        open={exploreModalOpen}
        onOpenChange={setExploreModalOpen}
        onSelectProfile={(handle) => {
          router.push(`/${handle}`);
        }}
      />
    </div>
  );
}
