import React, { useEffect, useState } from 'react'
import { motion, useSpring, useTransform, animate } from 'framer-motion'
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cardVariants, hoverScale } from '../animations/variants'

interface StatsCardProps {
  label: string
  value: number
  prefix?: string
  suffix?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  delay?: number
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  label, 
  value, 
  prefix = '', 
  suffix = '', 
  icon: Icon,
  trend,
  delay = 0
}) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      delay: delay + 0.5,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.floor(latest))
    })
    return () => controls.stop()
  }, [value, delay])

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      transition={{ delay }}
      {...hoverScale}
      className="bg-gray-900 border border-gray-800 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group"
    >
      {/* Background Glow */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-colors" />

      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-gray-800 rounded-2xl text-blue-500 group-hover:scale-110 transition-transform">
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
            trend.isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
          }`}>
            {trend.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trend.value}%
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">{label}</p>
        <h3 className="text-3xl font-black text-white tabular-nums">
          {prefix}{displayValue.toLocaleString()}{suffix}
        </h3>
      </div>

      {/* Decorative Line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-600/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </motion.div>
  )
}

export default StatsCard
