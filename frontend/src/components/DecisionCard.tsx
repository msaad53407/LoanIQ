import React from 'react'
import { motion } from 'framer-motion'
import { DecisionStatus } from '../types'
import { CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react'

interface DecisionCardProps {
  status: DecisionStatus
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

const DecisionCard: React.FC<DecisionCardProps> = ({ status, size = 'md', showIcon = true }) => {
  const config = {
    APPROVED: {
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      icon: CheckCircle2,
      label: 'Approved'
    },
    REJECTED: {
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      icon: XCircle,
      label: 'Rejected'
    },
    CONDITIONAL_APPROVAL: {
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      icon: AlertCircle,
      label: 'Conditional'
    },
    REVIEW: {
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      icon: Clock,
      label: 'Review'
    }
  }[status]

  const sizeClasses = {
    sm: 'px-3 py-1 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-8 py-4 text-xl gap-4 font-black uppercase tracking-widest'
  }[size]

  const Icon = config.icon

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.border} ${config.color} ${sizeClasses} font-bold shadow-lg`}
    >
      {showIcon && (
        <motion.div
          animate={status === 'REVIEW' ? { rotate: 360 } : {}}
          transition={status === 'REVIEW' ? { repeat: Infinity, duration: 2, ease: "linear" } : {}}
        >
          <Icon size={size === 'lg' ? 32 : size === 'md' ? 18 : 14} />
        </motion.div>
      )}
      {config.label}
    </motion.div>
  )
}

export default DecisionCard
