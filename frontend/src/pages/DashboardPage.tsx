import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  ChevronRight,
  PieChart,
  ArrowUpRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ApplicationRecord } from '../types'
import { loanApi } from '../api/loanApi'
import StatsCard from '../components/StatsCard'
import DecisionCard from '../components/DecisionCard'
import { 
  pageVariants, 
  staggerContainer, 
  cardVariants, 
  hoverScale 
} from '../animations/variants'

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null)
  const [recentApps, setRecentApps] = useState<ApplicationRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, appsData] = await Promise.all([
          loanApi.getStats(),
          loanApi.getAllApplications()
        ])
        setStats(statsData)
        setRecentApps(appsData.slice(0, 5))
      } catch (error) {
        console.error("Dashboard fetch error:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 pt-32 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-40 bg-gray-900 animate-pulse rounded-[2rem]" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 h-96 bg-gray-900 animate-pulse rounded-[2.5rem]" />
            <div className="h-96 bg-gray-900 animate-pulse rounded-[2.5rem]" />
          </div>
        </div>
      </div>
    )
  }

  // Handle snake_case from backend
  const totalApps = stats?.total_applications || 0
  const approvalRate = stats?.approval_rate || 0
  const avgCredit = stats?.avg_credit_score || 0
  const avgLoan = stats?.avg_loan_amount || 0
  const rejectionReasons = stats?.rejection_reasons || []

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-gray-950 pt-32 pb-20 px-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">System Dashboard</h1>
            <p className="text-gray-500 font-medium">Real-time loan decision intelligence</p>
          </div>
          <Link to="/history">
            <motion.button
              {...hoverScale}
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 border border-gray-800 text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors"
            >
              <Calendar size={18} /> View History
            </motion.button>
          </Link>
        </div>

        {/* Stats Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <StatsCard 
            label="Total Applications" 
            value={totalApps} 
            icon={Users} 
            delay={0.1}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard 
            label="Approval Rate" 
            value={Math.round(approvalRate)} 
            suffix="%" 
            icon={TrendingUp} 
            delay={0.2}
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard 
            label="Avg. Credit Score" 
            value={Math.round(avgCredit)} 
            icon={BarChart3} 
            delay={0.3}
          />
          <StatsCard 
            label="Avg. Loan Amount" 
            value={avgLoan} 
            prefix="PKR " 
            icon={DollarSign} 
            delay={0.4}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Applications */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-[2.5rem] p-8 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Users className="text-blue-500" />
                Recent Applications
              </h3>
              <Link to="/history" className="text-blue-500 text-sm font-bold flex items-center gap-1 hover:underline">
                View All <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="space-y-4">
              {recentApps.map((app) => (
                <Link key={app.id} to={`/decision/${app.id}`}>
                  <motion.div
                    whileHover={{ x: 10, backgroundColor: '#1f2937' }}
                    className="flex items-center justify-between p-5 rounded-2xl bg-gray-800/30 border border-gray-800/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 font-black">
                        {app.applicantName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-white font-bold">{app.applicantName}</h4>
                        <p className="text-xs text-gray-500">PKR {app.loanAmount?.toLocaleString()} • {app.loanPurpose}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <DecisionCard status={app.decision || 'REVIEW'} size="sm" showIcon={false} />
                      <ChevronRight className="text-gray-600 group-hover:text-white transition-colors" size={20} />
                    </div>
                  </motion.div>
                </Link>
              ))}
              {recentApps.length === 0 && (
                <div className="text-center py-12 text-gray-500 italic">No applications found.</div>
              )}
            </div>
          </motion.div>

          {/* Decision Breakdown (CSS Chart) */}
          <motion.div
            variants={cardVariants}
            className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-8 shadow-2xl flex flex-col"
          >
            <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-10">
              <PieChart className="text-blue-500" />
              Rejection Reasons
            </h3>

            <div className="flex-1 space-y-6">
              {rejectionReasons.map((reason: any, idx: number) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                    <span>{reason.reason}</span>
                    <span className="text-white">{reason.count}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(reason.count / (totalApps || 1)) * 100}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
                    />
                  </div>
                </div>
              ))}
              {rejectionReasons.length === 0 && (
                <div className="h-full flex items-center justify-center text-gray-600 italic text-sm text-center">
                  All systems green. No rejection data recorded.
                </div>
              )}
            </div>

            <div className="mt-10 p-6 bg-blue-600/5 rounded-2xl border border-blue-600/10">
              <p className="text-xs text-blue-500 font-bold uppercase tracking-widest mb-2">System Health</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-white font-bold text-sm">Rules Engine Active</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default DashboardPage
