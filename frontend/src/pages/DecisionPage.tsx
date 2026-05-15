import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Download, 
  RefreshCcw, 
  LayoutDashboard,
  Target,
  Percent,
  Coins,
  History
} from 'lucide-react'
import { LoanDecision } from '../types'
import { loanApi } from '../api/loanApi'
import DecisionCard from '../components/DecisionCard'
import RuleExplanation from '../components/RuleExplanation'
import { 
  pageVariants, 
  staggerContainer, 
  decisionVariants,
  progressBarVariants,
  hoverScale 
} from '../animations/variants'

const Confetti = () => {
  const [particles] = useState(() => 
    Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 400 - 200,
      y: Math.random() * -400 - 100,
      r: Math.random() * 360,
      color: ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#a855f7'][Math.floor(Math.random() * 5)]
    }))
  )

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{ 
            x: p.x, 
            y: p.y, 
            opacity: 0, 
            scale: [0, 1, 0.5],
            rotate: p.r 
          }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="w-3 h-3 rounded-sm absolute"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  )
}

const DecisionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const [decision, setDecision] = useState<LoanDecision | null>(location.state?.decision || null)
  const [isLoading, setIsLoading] = useState(!decision)

  useEffect(() => {
    if (!decision && id) {
      const fetchDecision = async () => {
        try {
          const data = await loanApi.getApplicationById(id)
          setDecision(data)
        } catch (error) {
          console.error("Failed to fetch decision:", error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchDecision()
    }
  }, [id, decision])

  if (isLoading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
      />
    </div>
  )

  if (!decision) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-6">
      <h2 className="text-2xl text-white font-bold">Decision Not Found</h2>
      <Link to="/apply" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold">Try Applying</Link>
    </div>
  )

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-gray-950 pt-32 pb-20 px-4 overflow-x-hidden"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header Reveal */}
        <div className="relative mb-16 text-center">
          {decision.decision === 'APPROVED' && <Confetti />}
          
          <motion.div
            custom={decision.decision}
            variants={decisionVariants}
            className="inline-block relative z-10"
          >
            <DecisionCard status={decision.decision} size="lg" />
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-gray-400 font-medium max-w-lg mx-auto leading-relaxed"
          >
            {decision.explanation}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Details Section */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-8"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-8 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
                <Target className="text-blue-500" size={20} />
                Decision Metrics
              </h3>

              <div className="space-y-8">
                {/* Confidence Score */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-500">Model Confidence</span>
                    <span className="text-2xl font-black text-white">{decision.confidenceScore.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      variants={progressBarVariants}
                      custom={decision.confidenceScore}
                      className="h-full bg-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Percent size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Interest Rate</span>
                    </div>
                    <p className="text-2xl font-black text-white">{(decision.interestRate * 100).toFixed(2)}%</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Coins size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Max Limit</span>
                    </div>
                    <p className="text-2xl font-black text-white">PKR {(decision.maxEligible / 1000).toFixed(0)}k</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <motion.button
                {...hoverScale}
                className="flex-1 py-4 bg-gray-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors"
              >
                <Download size={18} /> Report
              </motion.button>
              <Link to="/apply" className="flex-[2]">
                <motion.button
                  {...hoverScale}
                  className="w-full py-4 bg-white text-gray-950 rounded-2xl font-bold flex items-center justify-center gap-2"
                >
                  <RefreshCcw size={18} /> Apply Again
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Rules Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Target className="text-blue-500" size={20} />
                How the AI decided:
              </h3>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-4"
            >
              {decision.explanationChain.map((explanation, idx) => (
                <RuleExplanation key={idx} rule={explanation} index={idx} />
              ))}

              {decision.explanationChain.length === 0 && (
                <div className="p-8 text-center bg-gray-900/50 rounded-[2.5rem] border border-gray-800 border-dashed">
                  <p className="text-gray-500 text-sm italic">Standard evaluation applied.</p>
                </div>
              )}
            </motion.div>

            <div className="pt-6">
              <Link to="/dashboard">
                <motion.button
                  {...hoverScale}
                  className="w-full py-4 border-2 border-gray-800 text-gray-400 rounded-2xl font-bold flex items-center justify-center gap-2 hover:border-gray-700 hover:text-white transition-all"
                >
                  <LayoutDashboard size={18} /> Go to Dashboard
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default DecisionPage
