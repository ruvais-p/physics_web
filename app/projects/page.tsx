'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import ProjectsTable, { ProjectData } from '@/components/ProjectsTable';
import { Search, RefreshCw } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/public/projects');
        if (!res.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error('Error loading projects:', err);
        setError(err.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const effectiveQuery = (submittedQuery || searchQuery).toLowerCase();

  // Filtered projects list based on search query
  const filteredProjects = projects.filter((proj) => {
    if (!effectiveQuery) return true;
    return (
      proj.title.toLowerCase().includes(effectiveQuery) ||
      (proj.description && proj.description.toLowerCase().includes(effectiveQuery)) ||
      (proj.agency && proj.agency.toLowerCase().includes(effectiveQuery)) ||
      (proj.funding && proj.funding.toLowerCase().includes(effectiveQuery)) ||
      (proj.faculty?.name && proj.faculty.name.toLowerCase().includes(effectiveQuery)) ||
      (proj.otherFaculty && proj.otherFaculty.toLowerCase().includes(effectiveQuery)) ||
      (proj.status && proj.status.toLowerCase().includes(effectiveQuery))
    );
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSubmittedQuery('');
  };

  return (
    <div className="space-y-12 pb-20 font-sans">
      {/* Hero Header matching main website design */}
      <Hero
        title="RESEARCH PROJECTS"
        badge="HOME > RESEARCH > PROJECTS"
        subtitle="Funded research initiatives, national and international grants from DST-SERB, ISRO, CSIR, BRNS, and UGC driving advanced physical science discoveries."
        bgImage="/physics.png"
      />

      {/* Tab Selector Bar - Glassmorphic Pill Tab */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center pt-2">
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-xl border border-cyan-accent/30 shadow-lg rounded-2xl sm:rounded-3xl">
          <Link
            href="/research"
            className="px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 text-oxford hover:text-cyan-accent hover:bg-slate-50 cursor-pointer"
          >
            Research Laboratories
          </Link>
          <button
            className="px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 bg-cyan-accent text-white shadow-md cursor-default"
          >
            Projects &amp; Grants
          </button>
          <Link
            href="/journals"
            className="px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 text-oxford hover:text-cyan-accent hover:bg-slate-50 cursor-pointer"
          >
            Publications
          </Link>
          <Link
            href="/facilities"
            className="px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 text-oxford hover:text-cyan-accent hover:bg-slate-50 cursor-pointer"
          >
            Central Facilities
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Search Bar matching Publications page */}
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-sm focus-within:border-cyan-accent focus-within:ring-2 focus-within:ring-cyan-accent/20 transition-all"
          >
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="projects-search-input"
                type="text"
                placeholder="Search by title, investigator, funding agency, or keyword..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSubmittedQuery(e.target.value);
                }}
                className="w-full pl-11 pr-4 py-2 text-sm sm:text-base bg-transparent border-none focus:outline-none text-slate-800 placeholder:text-slate-400 font-sans"
              />
            </div>

            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-2 py-1 cursor-pointer transition-colors shrink-0"
              >
                Clear
              </button>
            )}

            <button
              id="projects-search-button"
              type="submit"
              className="px-5 py-2.5 bg-oxford hover:bg-cyan-900 text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5 shrink-0 hover:shadow-md"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>
        </div>

        {/* Projects Section Header & Table */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-oxford">
              Department Research Projects
            </h2>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {filteredProjects.length} Projects
            </span>
          </div>

          {/* Main Display: Loading, Error, or Table View */}
          {loading ? (
            <div className="py-20 text-center space-y-3 text-slate-500 font-sans bg-white rounded-2xl border border-slate-200">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-cyan-accent" />
              <p className="text-sm font-semibold text-slate-800">Fetching research projects from database...</p>
            </div>
          ) : error ? (
            <div className="py-16 text-center space-y-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 p-6">
              <p className="font-bold text-base">Unable to load projects</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : (
            <ProjectsTable
              projects={filteredProjects}
              emptyMessage="No research projects found matching your query."
            />
          )}
        </div>
      </section>
    </div>
  );
}
