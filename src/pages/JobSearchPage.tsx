import React, { useState, useMemo } from 'react'
import { useApp, JobWithMatch } from '@/context/AppContext'
import { JobCard } from '@/components/JobCard'
import { ExpiredAccessScreen } from '@/components/ExpiredAccessScreen'
import { Input } from '@/components/ui/input'
import {
  Search,
  Briefcase,
  X,
  Filter,
} from 'lucide-react'

interface JobSearchPageProps {
  onSelectJob: (job: JobWithMatch) => void
}

export const JobSearchPage: React.FC<JobSearchPageProps> = ({ onSelectJob }) => {
  const { jobs, isPassActive } = useApp()

  // Filter States
  const [keyword, setKeyword] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useState<string>('All')
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [fresherOnly, setFresherOnly] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<'match' | 'newest'>('match')
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)

  // Unique categories and locations
  const categories = useMemo(() => {
    const set = new Set<string>()
    jobs.forEach((j) => set.add(j.category))
    return ['All', ...Array.from(set)]
  }, [jobs])

  const locations = useMemo(() => {
    const set = new Set<string>()
    jobs.forEach((j) => {
      const parts = j.location.split(/[/,•]/).map((p) => p.trim())
      parts.forEach((p) => {
        if (p) set.add(p)
      })
    })
    return ['All', ...Array.from(set).sort()]
  }, [jobs])

  // Filtered and sorted jobs
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        // Keyword search across title, company, skills, and description
        if (keyword.trim()) {
          const q = keyword.toLowerCase()
          const matchesTitle = job.title.toLowerCase().includes(q)
          const matchesCompany = job.company.toLowerCase().includes(q)
          const matchesSkills = job.skills.some((s) => s.toLowerCase().includes(q))
          const matchesCategory = job.category.toLowerCase().includes(q)
          const matchesDescription = job.description?.toLowerCase().includes(q)
          if (!matchesTitle && !matchesCompany && !matchesSkills && !matchesCategory && !matchesDescription) return false
        }

        // Location filter
        if (selectedLocation !== 'All') {
          if (!job.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false
        }

        // Work mode filter
        if (selectedWorkMode !== 'All') {
          if (job.work_mode !== selectedWorkMode) return false
        }

        // Category filter
        if (selectedCategory !== 'All') {
          if (job.category !== selectedCategory) return false
        }

        // Fresher only filter
        if (fresherOnly && !job.fresher_eligibility) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'match') {
          return b.match.score - a.match.score
        } else {
          return new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime()
        }
      })
  }, [jobs, keyword, selectedLocation, selectedWorkMode, selectedCategory, fresherOnly, sortBy])

  const resetFilters = () => {
    setKeyword('')
    setSelectedLocation('All')
    setSelectedWorkMode('All')
    setSelectedCategory('All')
    setFresherOnly(false)
    setSortBy('match')
  }

  const hasActiveFilters =
    keyword !== '' ||
    selectedLocation !== 'All' ||
    selectedWorkMode !== 'All' ||
    selectedCategory !== 'All' ||
    fresherOnly

  // If pass is not active or expired, enforce access restriction
  if (!isPassActive) {
    return <ExpiredAccessScreen />
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/10 dark:border-white/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#fe7141] font-bold">Discovery Feed</span>
            <span className="font-mono text-xs text-muted-foreground">/</span>
            <span className="font-mono text-xs text-foreground font-bold">{filteredJobs.length} RESULTS</span>
          </div>
          <h1 className="text-2xl font-black text-foreground tracking-tight mt-1 uppercase">
            Discover Fresher Jobs
          </h1>
          <p className="font-mono text-xs text-muted-foreground mt-0.5">
            24-hour pass active. AI match percentages calculated in real-time.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
          <span className="text-muted-foreground uppercase text-[10px]">SORT:</span>
          <div className="inline-flex rounded-sm border border-black/15 dark:border-white/20 bg-card p-0.5">
            <button
              onClick={() => setSortBy('match')}
              className={`px-2.5 py-1 text-xs rounded-xs font-mono font-bold transition-colors ${
                sortBy === 'match'
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              HIGHEST MATCH
            </button>
            <button
              onClick={() => setSortBy('newest')}
              className={`px-2.5 py-1 text-xs rounded-xs font-mono font-bold transition-colors ${
                sortBy === 'newest'
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              NEWEST
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar and Quick Mobile Filter Toggle */}
      <div className="flex items-center gap-2 font-mono">
        <div className="relative flex-1">
          <label htmlFor="search-jobs-input" className="sr-only">Search jobs by title, skill, or company</label>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <Input
            id="search-jobs-input"
            type="text"
            placeholder="FILTER BY ROLE, SKILL (REACT, PYTHON, SQL), OR FIRM..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-10 h-11 text-xs font-mono bg-card border-black/15 dark:border-white/20 rounded-none uppercase placeholder:text-muted-foreground/60"
          />
          {keyword && (
            <button
              type="button"
              onClick={() => setKeyword('')}
              aria-label="Clear search input"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle */}
        <button
          className="md:hidden h-11 px-3 border border-black/15 dark:border-white/20 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>FILTERS</span>
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 bg-vermilion" />
          )}
        </button>
      </div>

      {/* Filter Row (Desktop & Expanded Mobile) */}
      <div
        className={`${
          showMobileFilters ? 'block' : 'hidden'
        } md:block p-4 border border-black/10 dark:border-white/15 bg-muted/10 font-mono space-y-4`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Work Mode */}
          <div className="space-y-1">
            <label htmlFor="filter-work-mode" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Work Mode
            </label>
            <select
              id="filter-work-mode"
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="w-full h-9 rounded-none border border-black/15 dark:border-white/20 bg-background px-2.5 py-1 text-xs font-mono text-foreground focus:outline-none uppercase"
            >
              <option value="All">ALL MODES</option>
              <option value="Remote">REMOTE ONLY</option>
              <option value="Hybrid">HYBRID</option>
              <option value="Onsite">ONSITE</option>
            </select>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label htmlFor="filter-location" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Metro Region
            </label>
            <select
              id="filter-location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full h-9 rounded-none border border-black/15 dark:border-white/20 bg-background px-2.5 py-1 text-xs font-mono text-foreground focus:outline-none uppercase"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === 'All' ? 'ALL REGIONS' : loc.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label htmlFor="filter-category" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Job Category
            </label>
            <select
              id="filter-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-9 rounded-none border border-black/15 dark:border-white/20 bg-background px-2.5 py-1 text-xs font-mono text-foreground focus:outline-none uppercase"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'ALL DISCIPLINES' : cat.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Fresher toggle & Reset */}
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => setFresherOnly(!fresherOnly)}
              className={`flex-1 h-9 px-3 border text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                fresherOnly
                  ? 'border-black dark:border-white bg-foreground text-background font-bold'
                  : 'border-black/15 dark:border-white/20 text-muted-foreground hover:bg-muted/40'
              }`}
            >
              <span>{fresherOnly ? '✓ Fresher Eligible' : '+ Fresher Only'}</span>
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="h-9 px-2.5 border border-black/15 dark:border-white/20 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted/40 uppercase tracking-wider"
                title="Reset filters"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Jobs Results List */}
      {filteredJobs.length === 0 ? (
        <div className="p-16 text-center border border-black/10 dark:border-white/15 bg-muted/10 space-y-4">
          <div className="w-12 h-12 border border-black/15 dark:border-white/20 mx-auto flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
              NO ROLES MATCH ACTIVE PARAMETERS
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto font-mono">
              Adjust keywords, location, or mode filters to broaden your search results.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 border border-black dark:border-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-muted/40 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10 dark:bg-white/15 border border-black/10 dark:border-white/15">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-background">
              <JobCard job={job} onSelect={onSelectJob} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
