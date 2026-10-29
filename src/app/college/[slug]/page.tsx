import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollegeBySlug, getCollegeProfileData } from "@/lib/college-service";
import { CollegeViewClient } from "./CollegeViewClient";

interface CollegePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CollegePageProps): Promise<Metadata> {
  const { slug } = await params;
  const college = await getCollegeBySlug(slug);

  if (!college) {
    return {
      title: "College Not Found | CollegeCentre",
      description: "The requested college campus profile could not be found.",
    };
  }

  const title = `${college.name} | Campus Hub & Student Directory`;
  const description =
    college.description ||
    `Explore public student builders, open-source projects, and research from ${college.name} on CollegeCentre.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: college.banner_url ? [{ url: college.banner_url }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CollegePage({ params }: CollegePageProps) {
  const { slug } = await params;
  const initialData = await getCollegeProfileData(slug);

  if (!initialData || !initialData.college) {
    notFound();
  }

  return <CollegeViewClient slug={slug} initialData={initialData} />;
}
