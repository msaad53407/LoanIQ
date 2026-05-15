import React, { useEffect, useRef } from 'react'
import { motion, useInView, useAnimation, useMotionValue, useTransform, animate } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Zap, 
  ShieldCheck, 
  Eye, 
  FormInput, 
  Cpu, 
  Flame, 
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Users,
  Timer,
  Landmark
} from 'lucide-react'
import { 
  pageVariants, 
  staggerContainer, 
  staggerItem, 
  cardVariants, 
  floatingVariants, 
  hoverScale,
  fadeInUp 
} from '../animations/variants'

// Counter Helper Component
const Counter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => `${Math.round(latest)}${suffix}`)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) {
      animate(count, value, { duration: 2, ease: "easeOut" })
    }
  }, [inView, value])

  return <motion.span ref={ref}>{rounded}</motion.span>
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  
  const heroWords = "Smart Loan Decisions".split(" ")

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-16 overflow-hidden"
    >
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gray-900 px-4 overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/30 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-indigo-500/30 rounded-full blur-[120px]"
          />
        </div>

        <div className="container mx-auto text-center relative">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight text-white">
              {heroWords.map((word, i) => (
                <motion.span
                  key={i}
                  variants={staggerItem}
                  className="inline-block mr-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400"
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto"
            >
              Experience the future of lending with our AI-driven expert system. 
              Instant decisions, full transparency, and personalized rates.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.button
                {...hoverScale}
                onClick={() => navigate('/apply')}
                className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg shadow-xl shadow-blue-200 flex items-center gap-2 group"
              >
                Apply for Loan
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                {...hoverScale}
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-white text-gray-800 border-2 border-gray-100 rounded-full font-bold text-lg hover:bg-gray-50"
              >
                View Dashboard
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="absolute -top-10 -right-10 hidden lg:block"
          >
            <div className="w-32 h-32 bg-yellow-400/20 rounded-full blur-xl" />
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, 20, 0],
              x: [0, -10, 0]
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute bottom-20 -left-10 hidden lg:block"
          >
            <div className="w-48 h-48 bg-blue-400/10 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 bg-white px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose LoanIQ?</h2>
            <p className="text-gray-500">Engineered for speed, accuracy, and fairness.</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { 
                title: "AI-Powered Rules", 
                desc: "Complex forward-chaining inference engine ensures every applicant is treated fairly based on cold hard data.",
                icon: Zap,
                color: "bg-blue-500"
              },
              { 
                title: "Instant Decision", 
                desc: "No more waiting days. Our expert system processes hundreds of variables in under 2 seconds for a final verdict.",
                icon: ShieldCheck,
                color: "bg-green-500"
              },
              { 
                title: "Full Transparency", 
                desc: "Understand exactly why your loan was approved or rejected with our detailed rule-firing explanation chain.",
                icon: Eye,
                color: "bg-purple-500"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                className="p-8 rounded-3xl border border-gray-100 bg-white group cursor-default"
              >
                <motion.div 
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className={`${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}
                >
                  <feature.icon size={28} />
                </motion.div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-24 bg-gray-900 text-white px-4 overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-4"
            >
              The Automated Workflow
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-400"
            >
              From application to approval in four steps.
            </motion.p>
          </div>

          <div className="relative">
            {/* Connecting Line Base (White/Muted) */}
            <div className="absolute top-10 left-0 w-full h-1 bg-gray-800 -translate-y-1/2 hidden lg:block" />
            
            {/* Active Connecting Line (Blue) */}
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute top-10 left-0 h-1 bg-blue-500 -translate-y-1/2 hidden lg:block"
              viewport={{ once: true }}
            />

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid lg:grid-cols-4 gap-12 relative z-10"
            >
              {[
                { name: "Fill Form", icon: FormInput },
                { name: "AI Analysis", icon: Cpu },
                { name: "Rule Firing", icon: Flame },
                { name: "Get Decision", icon: CheckCircle2 }
              ].map((step, idx) => (
                <motion.div key={idx} variants={staggerItem} className="flex flex-col items-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-20 h-20 rounded-full bg-gray-800 border-2 border-gray-700 shadow-2xl flex items-center justify-center text-white mb-6 relative group"
                  >
                    {/* Background Glow */}
                    <motion.div 
                      className="absolute inset-0 bg-blue-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    
                    <step.icon size={32} className="relative z-10" />
                    
                    {/* Animated Circle Border */}
                    <svg 
                      className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] -rotate-90 pointer-events-none overflow-visible"
                      viewBox="0 0 112 112"
                    >
                      <motion.circle
                        cx="56" cy="56" r="42"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray="264"
                        initial={{ strokeDashoffset: 264 }}
                        whileInView={{ strokeDashoffset: 0 }}
                        transition={{ duration: 1, delay: idx * 0.4 + 0.5, ease: "easeInOut" }}
                        viewport={{ once: true }}
                      />
                    </svg>
                  </motion.div>
                  <motion.span 
                    initial={{ opacity: 0.5 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: idx * 0.4 + 1 }}
                    className="text-xl font-bold tracking-tight"
                  >
                    {step.name}
                  </motion.span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS TICKER */}
      <section className="py-20 bg-blue-600 text-white px-4">
        <div className="container mx-auto grid md:grid-cols-3 gap-12 text-center">
          <div className="space-y-2">
            <div className="text-5xl font-black flex items-center justify-center gap-2">
              <Users size={40} className="text-blue-300" />
              <Counter value={10000} suffix="+" />
            </div>
            <p className="text-blue-100 uppercase tracking-widest font-semibold text-sm">Applications Processed</p>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-black flex items-center justify-center gap-2">
              <ShieldCheck size={40} className="text-blue-300" />
              <Counter value={98} suffix="%" />
            </div>
            <p className="text-blue-100 uppercase tracking-widest font-semibold text-sm">Decision Accuracy</p>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-black flex items-center justify-center gap-2">
              <Timer size={40} className="text-blue-300" />
              <Counter value={2} suffix="s" />
            </div>
            <p className="text-blue-100 uppercase tracking-widest font-semibold text-sm">Avg. Decision Time</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-gray-900 text-white px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex items-center gap-2 text-2xl font-bold">
              <Landmark /> LoanIQ Expert
            </div>
            <p className="text-gray-400 max-w-md">
              The world's first fully automated loan approval system powered by transparent expert rules.
            </p>
            <div className="h-px w-full max-w-sm bg-gray-800" />
            <p className="text-sm text-gray-500">
              © 2026 LoanIQ Expert Systems Inc. All rights reserved.
            </p>
          </motion.div>
        </div>
      </footer>
    </motion.div>
  )
}

export default LandingPage
