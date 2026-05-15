import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const loadingSteps = [
  "Analyzing application...",
  "Firing rules...",
  "Computing decision...",
  "Finalizing verdict..."
]

interface LoadingScreenProps {
  isVisible: boolean
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isVisible }) => {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % loadingSteps.length)
    }, 1200)

    return () => clearInterval(interval)
  }, [isVisible])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-xl"
        >
          <div className="text-center space-y-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <Loader2 className="w-16 h-16 text-blue-500 stroke-[3px]" />
            </motion.div>

            <div className="h-8 relative overflow-hidden w-64 mx-auto">
              <AnimatePresence mode="wait">
                <motion.p
                  key={stepIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-white text-xl font-bold tracking-tight"
                >
                  {loadingSteps[stepIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            <motion.div 
              className="w-48 h-1 bg-white/10 rounded-full mx-auto overflow-hidden"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 4.8, ease: "linear" }}
            >
              <motion.div 
                className="h-full bg-blue-500"
                animate={{ width: "100%" }}
                transition={{ duration: 4.8, ease: "linear" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoadingScreen
