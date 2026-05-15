import React from 'react'
import { motion } from 'framer-motion'
import { Info, ShieldAlert, ShieldCheck } from 'lucide-react'
import { rulesFireVariants } from '../animations/variants'

interface RuleExplanationProps {
  rule: string
  index: number
}

const RuleExplanation: React.FC<RuleExplanationProps> = ({ rule, index }) => {
  const isPositive = rule.toLowerCase().includes('good') || rule.toLowerCase().includes('approved') || rule.toLowerCase().includes('high')
  const isCritical = rule.toLowerCase().includes('low') || rule.toLowerCase().includes('rejected') || rule.toLowerCase().includes('debt')

  return (
    <motion.div
      variants={rulesFireVariants}
      className={`relative p-5 rounded-2xl border-l-4 bg-gray-800/30 backdrop-blur-sm border-gray-700 hover:bg-gray-800/50 transition-all ${
        isPositive ? 'border-l-green-500' : isCritical ? 'border-l-red-500' : 'border-l-blue-500'
      }`}
    >
      <div className="flex gap-4 items-start">
        <div className={`p-2 rounded-xl mt-1 ${
          isPositive ? 'bg-green-500/10 text-green-500' : isCritical ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
        }`}>
          {isPositive ? <ShieldCheck size={18} /> : isCritical ? <ShieldAlert size={18} /> : <Info size={18} />}
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            Rule Inference #{index + 1}
          </span>
          <p className="text-white font-medium text-sm leading-relaxed">
            {rule}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default RuleExplanation
