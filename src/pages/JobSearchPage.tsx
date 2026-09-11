import React, { useState, useMemo } from 'react'
import { useApp, JobWithMatch } from '@/context/AppContext'
import { JobCard } from '@/components/JobCard'
import { Input } from '@/components/ui/input'
import {
  Search,
  Briefcase,
  X,
  Filter,
  Zap,
  Clock,
  Lock,
  Sparkles,
  GraduationCap,
  ArrowRight,
} from 'lucide-react'

interface JobSearchPageProps {
  onSelectJob: (job: JobWithMatch) => void
}

export const JobSearchPage: React.FC<JobSearchPageProps> = ({ onSelectJob }) => {
  const {
    jobs,
    isPassActive,
    isPassScheduled,
    scheduledStartTime,
    startSprintNow,
    setIsPaymentModalOpen,
  } = useApp()

  // Filter States
  const [keyword, setKeyword] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useState<string>('All')
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedBatch, setSelectedBatch] = useState<string>('All')
  const [selectedDegree, setSelectedDegree] = useState<string>('All')
  const [fresherOnly, setFresherOnly] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<'match' | 'newest'>('match')
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)

  const batches = ['All', '2024', '2025', '2026', '2027']
  const degrees = ['All', 'B.Tech / B.E.', 'BCA / MCA', 'B.Sc / M.Sc', 'Any Graduate']

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

        // Batch filter
        if (selectedBatch !== 'All') {
          const searchIn = `${job.title} ${job.description || ''} ${job.education || ''}`.toLowerCase()
          const hasBatchMention = /(2023|2024|2025|2026|2027)/.test(searchIn)
          if (hasBatchMention && !searchIn.includes(selectedBatch)) {
            return false
          }
        }

        // Degree filter
        if (selectedDegree !== 'All') {
          const eduLower = (job.education || '').toLowerCase()
          if (selectedDegree === 'B.Tech / B.E.') {
            if (
              !eduLower.includes('b.tech') &&
              !eduLower.includes('b.e') &&
              !eduLower.includes('engineering') &&
              !eduLower.includes('any graduate')
            ) {
              return false
            }
          } else if (selectedDegree === 'BCA / MCA') {
            if (
              !eduLower.includes('bca') &&
              !eduLower.includes('mca') &&
              !eduLower.includes('computer') &&
              !eduLower.includes('any graduate')
            ) {
              return false
            }
          } else if (selectedDegree === 'B.Sc / M.Sc') {
            if (
              !eduLower.includes('b.sc') &&
              !eduLower.includes('m.sc') &&
              !eduLower.includes('science') &&
              !eduLower.includes('any graduate')
            ) {
              return false
            }
          }
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
  }, [
    jobs,
    keyword,
    selectedLocation,
    selectedWorkMode,
    selectedCategory,
    selectedBatch,
    selectedDegree,
    fresherOnly,
    sortBy,
  ])

  const resetFilters = () => {
    setKeyword('')
    setSelectedLocation('All')
    setSelectedWorkMode('All')
    setSelectedCategory('All')
    setSelectedBatch('All')
    setSelectedDegree('All')
    setFresherOnly(false)
    setSortBy('match')
  }

  const hasActiveFilters =
    keyword !== '' ||
    selectedLocation !== 'All' ||
    selectedWorkMode !== 'All' ||
    selectedCategory !== 'All' ||
    selectedBatch !== 'All' ||
    selectedDegree !== 'All' ||
    fresherOnly

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Scheduled Pass Notice Banner */}
      {isPassScheduled && (
        <div className="border border-blue-500/40 bg-blue-50/50 dark:bg-blue-950/20 p-4 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500 shrink-0" />
            <div>
              <span className="font-bold text-foreground">Sprint Scheduled: </span>
              <span className="text-muted-foreground">
                Your 24-hour pass is scheduled to start at{' '}
                {scheduledStartTime
                  ? new Date(scheduledStartTime).toLocaleString([], {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })
                  : 'your chosen time'}
                . You can browse preview jobs now or launch early:
              </span>
            </div>
          </div>
          <button
            onClick={() => startSprintNow()}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] uppercase tracking-wider rounded-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>Start Sprint Early Now</span>
          </button>
        </div>
      )}

      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/10 dark:border-white/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#fe7141] font-bold">Discovery Feed</span>
            <span className="font-mono text-xs text-muted-foreground">/</span>
            <span className="font-mono text-xs text-foreground font-bold">{filteredJobs.length} RESULTS</span>
            {!isPassActive && (
              <span className="px-1.5 py-0.2 border border-vermilion/40 bg-vermilion/10 text-vermilion text-[10px] font-mono font-bold uppercase">
                3 Free Previews
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black text-foreground tracking-tight mt-1 uppercase">
            Discover Fresher Jobs
          </h1>
          <p className="font-mono text-xs text-muted-foreground mt-0.5">
            {isPassActive
              ? '24-hour sprint active. Direct employer apply links enabled.'
              : isPassScheduled
              ? 'Pass scheduled. Top 3 roles available to preview right now.'
              : 'Free preview: Top 3 fresher roles unlocked. Start 24h sprint to unlock all 40+.'}
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

      {/* Batch & Degree Calibration Bar */}
      <div className="p-3.5 border border-black/15 dark:border-white/20 bg-muted/20 space-y-2.5 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-vermilion" /> Calibrate Profile Eligibility:
          </span>
          {(selectedBatch !== 'All' || selectedDegree !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSelectedBatch('All')
                setSelectedDegree('All')
              }}
              className="text-[10px] text-vermilion hover:underline uppercase"
            >
              Clear Calibration
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Batch Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground uppercase shrink-0 font-bold">Grad Batch:</span>
            <div className="flex flex-wrap gap-1 flex-1">
              {batches.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setSelectedBatch(b)}
                  className={`px-2 py-0.5 text-[11px] border transition-colors ${
                    selectedBatch === b
                      ? 'border-black dark:border-white bg-foreground text-background font-bold'
                      : 'border-black/10 dark:border-white/15 bg-background text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {b === 'All' ? 'All' : b}
                </button>
              ))}
            </div>
          </div>

          {/* Degree Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground uppercase shrink-0 font-bold">Degree:</span>
            <select
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value)}
              className="h-7 border border-black/15 dark:border-white/20 bg-background px-2 text-[11px] font-mono text-foreground focus:outline-none flex-1 uppercase"
            >
              {degrees.map((deg) => (
                <option key={deg} value={deg}>
                  {deg.toUpperCase()}
                </option>
              ))}
            </select>
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
              Adjust keywords, batch year, or location filters to broaden your search results.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 border border-black dark:border-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-muted/40 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : isPassActive ? (
        /* Full Sprint Active: All jobs unlocked with standard grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} onSelect={onSelectJob} isLocked={false} />
          ))}
        </div>
      ) : (
        /* Free Teaser Architecture: 3 Unlocked + Sprint Gate + Locked Roles */
        <div className="space-y-6">
          {/* Top 3 Unlocked Fresher Jobs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground border-b border-black/10 dark:border-white/10 pb-1.5">
              <span className="uppercase tracking-wider font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-vermilion" /> Free Unlocked Preview (Top {Math.min(3, filteredJobs.length)} Openings)
              </span>
              <span className="text-emerald-600 font-bold">100% Free to View & Apply</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJobs.slice(0, 3).map((job) => (
                <JobCard key={job.id} job={job} onSelect={onSelectJob} isLocked={false} />
              ))}
            </div>
          </div>

          {/* Sprint Access Gate Banner (Shown if there are more roles) */}
          {filteredJobs.length > 3 && (
            <div className="border-2 border-vermilion bg-gradient-to-br from-vermilion/5 via-background to-vermilion/10 p-6 md:p-8 shadow-md space-y-4 font-mono">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-vermilion text-white text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> Sprint Access Gate • 3 Free Previews Shown
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight uppercase font-sans">
                    Unlock All {filteredJobs.length - 3}+ More Verified Fresher Openings
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Activate your 24-hour application sprint for flat ₹199. Get unmasked company portals, verified CTC breakdowns, direct HR apply links, and save every role permanently to your desk.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2.5 shrink-0">
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="w-full sm:w-auto px-6 py-3.5 bg-vermilion hover:bg-vermilion-hover text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Start 24-Hour Sprint (₹199)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] text-muted-foreground">
                    ⚡ Instant or Scheduled Start • No Auto-Renewal
                  </span>
                </div>
              </div>

              {/* Sprint Inclusions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-black/10 dark:border-white/10 text-[11px] text-foreground/85">
                <div className="flex items-center gap-1.5">
                  <span className="text-vermilion font-bold">✓</span> 40+ Fresh Jobs
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-vermilion font-bold">✓</span> Direct HR Links
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-vermilion font-bold">✓</span> Schedule Anytime
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-vermilion font-bold">✓</span> Keep Interviews Forever
                </div>
              </div>
            </div>
          )}

          {/* Locked Roles Teaser List */}
          {filteredJobs.length > 3 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground border-b border-black/10 dark:border-white/10 pb-2">
                <span className="uppercase tracking-wider font-bold text-foreground flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-vermilion" /> Locked Roles ({filteredJobs.length - 3} Openings)
                </span>
                <span className="text-vermilion font-bold flex items-center gap-1 text-[11px]">
                  Pass Required to View Company & Apply
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredJobs.slice(3).map((job) => (
                  <JobCard key={job.id} job={job} onSelect={onSelectJob} isLocked={true} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
