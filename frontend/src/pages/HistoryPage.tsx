import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Calendar,
  DollarSign,
  Briefcase,
  History,
  FileText
} from 'lucide-react'
import { ApplicationRecord, DecisionStatus } from '../types'
import { loanApi } from '../api/loanApi'
import DecisionCard from '../components/DecisionCard'
import { 
  pageVariants, 
  staggerContainer, 
  slideInFromLeft,
  hoverScale 
} from '../animations/variants'

const HistoryPage: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationRecord[]>([])
  const [filteredApps, setFilteredApps] = useState<ApplicationRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<DecisionStatus | 'ALL'>('ALL')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await loanApi.getAllApplications()
        setApplications(data)
        setFilteredApps(data)
      } catch (error) {
        console.error("History fetch error:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchHistory()
  }, [])

  useEffect(() => {
    let result = applications
    if (filter !== 'ALL') {
      result = result.filter(app => app.decision === filter)
    }
    if (search) {
      result = result.filter(app => 
        app.applicantName.toLowerCase().includes(search.toLowerCase()) ||
        app.id.toString().includes(search)
      )
    }
    setFilteredApps(result)
  }, [filter, search, applications])

  const filterOptions: (DecisionStatus | 'ALL')[] = ['ALL', 'APPROVED', 'REJECTED', 'CONDITIONAL_APPROVAL', 'REVIEW']

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-gray-950 pt-32 pb-20 px-6"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
            <History className="text-blue-500" size={36} />
            Application History
          </h1>
          <p className="text-gray-500 font-medium mt-2">Browse and analyze past loan decisions</p>
        </div>

        {/* Filter Bar */}
        <div className="bg-gray-900 border border-gray-800 p-4 rounded-3xl mb-12 flex flex-col md:flex-row gap-6 items-center shadow-xl">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text"
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-800/50 border border-transparent focus:border-blue-500/50 rounded-2xl py-3 pl-12 pr-4 text-white outline-none transition-all"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            {filterOptions.map((opt) => (
              <motion.button
                key={opt}
                {...hoverScale}
                onClick={() => setFilter(opt)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  filter === opt 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'bg-gray-800 text-gray-500 hover:text-white'
                }`}
              >
                {opt}
              </motion.button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="space-y-6">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-900 animate-pulse rounded-2xl" />
            ))
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredApps.map((app) => (
                  <motion.div
                    key={app.id}
                    layout
                    variants={slideInFromLeft}
                    initial="initial"
                    animate="animate"
                    exit={{ opacity: 0, x: -20 }}
                    className="group"
                  >
                    <Link to={`/decision/${app.id}`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-gray-700 hover:bg-gray-800/40 transition-all shadow-lg group-hover:shadow-blue-900/5">
                        <div className="flex items-center gap-6 mb-4 md:mb-0">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center border border-gray-700 shadow-inner">
                            <span className="text-[10px] text-gray-500 font-bold uppercase">ID</span>
                            <span className="text-white font-black">#{app.id}</span>
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-white group-hover:text-blue-500 transition-colors">
                              {app.applicantName}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <DollarSign size={12} /> PKR {app.loanAmount.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Briefcase size={12} /> {app.loanPurpose}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Calendar size={12} /> {new Date(app.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-gray-800">
                          <div className={app.decision === 'REVIEW' ? 'animate-pulse' : ''}>
                            <DecisionCard status={app.decision || 'REVIEW'} showIcon={false} />
                          </div>
                          <ChevronRight className="text-gray-700 group-hover:text-white transition-all transform group-hover:translate-x-1" size={24} />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredApps.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center space-y-6"
                >
                  <div className="w-24 h-24 rounded-full bg-gray-900 flex items-center justify-center text-gray-700 border border-gray-800 border-dashed">
                    <FileText size={40} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">No applications found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your filters or search terms.</p>
                  </div>
                  <Link to="/apply">
                    <motion.button
                      {...hoverScale}
                      className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20"
                    >
                      Apply Now
                    </motion.button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default HistoryPage
