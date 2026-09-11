export interface ResumePersonal {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
}

export interface ResumeEducation {
  institution: string;
  degree: string;
  field_of_study: string;
  start_year: number | null;
  graduation_year: number | null;
  gpa_or_percentage: string | null;
}

export interface ResumeSkills {
  programming_languages: string[];
  frameworks: string[];
  libraries: string[];
  databases: string[];
  tools: string[];
  cloud: string[];
  other: string[];
  normalized: string[];
}

export interface ResumeExperience {
  company: string;
  role: string;
  location?: string | null;
  employment_type?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  current?: boolean;
  description?: string | null;
  technologies?: string[];
}

export interface ResumeInternship {
  company: string;
  role: string;
  duration?: string | null;
  technologies?: string[];
  skills_used?: string[];
  description?: string | null;
}

export interface ResumeProject {
  name: string;
  title?: string;
  description: string | null;
  technologies: string[];
  url?: string | null;
  link?: string | null;
}

export interface ResumeCertification {
  name: string;
  issuer: string | null;
  date?: string | null;
}

export interface ResumeAchievement {
  achievement: string;
  organization?: string | null;
  date?: string | null;
}

export interface ResumeLanguage {
  language: string;
  proficiency?: string | null;
}

export interface ResumeCareer {
  experience_level: string | null;
  job_categories: string[];
}

export interface ResumeExtractedProfile {
  personal: ResumePersonal;
  education: ResumeEducation[];
  skills: ResumeSkills;
  experience: ResumeExperience[];
  internships: ResumeInternship[];
  projects: ResumeProject[];
  certifications: ResumeCertification[];
  achievements: ResumeAchievement[];
  languages: ResumeLanguage[];
  career: ResumeCareer;
}

export interface ProfileMergeSummary {
  newSkillsCount?: number;
  newProjectsCount?: number;
  newInternshipsCount?: number;
  newCertificationsCount?: number;
  addedSkills?: string[];
  skillsAdded?: number;
  skillsRetained?: number;
  projectsAdded?: number;
  internshipsAdded?: number;
  academicsUpdated?: boolean;
}
