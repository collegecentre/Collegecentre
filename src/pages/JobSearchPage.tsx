import React, { useState, useMemo } from 'react'
import { useApp, JobWithMatch } from '@/context/AppContext'
import { JobCard } from '@/components/JobCard'
import { ExpiredAccessScreen } from '@/components/ExpiredAccessScreen'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Briefcase,
  X,
  Sparkles,
  Filter,
} from 'lucide-react'

interface JobSearchPageProps {
  onSelectJob: (job: JobWithMatch) => void
}

export const JobSearchPage: React.FC<JobSearchPageProps> = ({ onSelectJob }) => {
  const { jobs, isPassActive } = useApp()

  // If pass is not active or expired, enforce access restriction
  if (!isPassActive) {
    return <ExpiredAccessScreen />
  }

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
      if (j.location.includes('Bengaluru')) set.add('Bengaluru')
      if (j.location.includes('Hyderabad')) set.add('Hyderabad')
      if (j.location.includes('Pune')) set.add('Pune')
      if (j.location.includes('Remote')) set.add('Remote')
      if (j.location.includes('Chennai')) set.add('Chennai')
    })
    return ['All', ...Array.from(set)]
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
          if (!matchesTitle && !matchesCompany && !matchesSkills && !matchesCategory) return false
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              Discover Fresher Jobs
            </h1>
            <Badge variant="matchMid" className="text-xs">
              {filteredJobs.length} Results
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            24-hour pass active. AI match percentages calculated in real-time.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-muted-foreground">Sort by:</span>
          <div className="inline-flex rounded-lg border bg-card p-0.5">
            <button
              onClick={() => setSortBy('match')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                sortBy === 'match'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Highest Match
            </button>
            <button
              onClick={() => setSortBy('newest')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                sortBy === 'newest'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Newest First
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar and Quick Mobile Filter Toggle */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <label htmlFor="search-jobs-input" className="sr-only">Search jobs by title, skill, or company</label>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <Input
            id="search-jobs-input"
            type="text"
            placeholder="Search by job title, skill (e.g. React, Python), or company..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-9 h-11 text-base sm:text-sm bg-card border-border/80 shadow-xs"
          />
          {keyword && (
            <button
              type="button"
              onClick={() => setKeyword('')}
              aria-label="Clear search input"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle */}
        <Button
          variant="outline"
          className="md:hidden h-11 px-3 gap-1.5"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <Filter className="w-4 h-4" />
          <span className="text-xs">Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          )}
        </Button>
      </div>

      {/* Filter Row (Desktop & Expanded Mobile) */}
      <div
        className={`${
          showMobileFilters ? 'block' : 'hidden'
        } md:block p-4 rounded-xl border bg-card/60 backdrop-blur-sm space-y-4`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Work Mode */}
          <div className="space-y-1">
            <label htmlFor="filter-work-mode" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Work Mode
            </label>
            <select
              id="filter-work-mode"
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="w-full h-9 rounded-lg border border-input bg-background px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">All Modes</option>
              <option value="Remote">Remote Only</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label htmlFor="filter-location" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Location
            </label>
            <select
              id="filter-location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full h-9 rounded-lg border border-input bg-background px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === 'All' ? 'All Locations' : loc}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label htmlFor="filter-category" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Job Category
            </label>
            <select
              id="filter-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-9 rounded-lg border border-input bg-background px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Fresher toggle & Reset */}
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => setFresherOnly(!fresherOnly)}
              className={`flex-1 h-9 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                fresherOnly
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'border-border text-muted-foreground hover:bg-accent'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fresher Only</span>
            </button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground"
                title="Reset filters"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Jobs Results List */}
      {filteredJobs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed bg-muted/20 space-y-3">
          <Briefcase className="w-10 h-10 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-foreground">No jobs match your active filters</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search terms, location, or work mode filters to view more opportunities.
          </p>
          <Button variant="outline" size="sm" onClick={resetFilters} className="text-xs">
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} onSelect={onSelectJob} />
          ))}
        </div>
      )}
    </div>
  )
}
