import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  User, 
  Wallet, 
  Briefcase, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Info,
  DollarSign,
  ShieldCheck,
  Building2,
  Car,
  Home,
  GraduationCap,
  Globe
} from 'lucide-react'
import { LoanApplication, LoanPurpose } from '../types'
import { loanApi } from '../api/loanApi'
import LoadingScreen from '../components/LoadingScreen'
import { useToast } from '../context/ToastContext'
import { 
  pageVariants, 
  staggerContainer, 
  hoverScale,
  formFieldVariants
} from '../animations/variants'

// Step Transition Variants
const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
}

// Credit Score Gauge Component
const CreditGauge = ({ score }: { score: number }) => {
  const getScoreInfo = (s: number) => {
    if (s < 580) return { label: 'Poor', color: '#ef4444' }
    if (s < 670) return { label: 'Fair', color: '#f97316' }
    if (s < 740) return { label: 'Good', color: '#eab308' }
    return { label: 'Excellent', color: '#22c55e' }
  }

  const { label, color } = getScoreInfo(score)
  const arcLength = 251.3 // Circumference of circle with r=40
  const percentage = (score - 300) / (850 - 300)
  const offset = arcLength - percentage * arcLength

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90">
          {/* Background circle */}
          <circle
            cx="80" cy="80" r="40"
            stroke="#1f2937"
            strokeWidth="8"
            fill="transparent"
            className="opacity-20"
          />
          {/* Foreground arc */}
          <motion.circle
            cx="80" cy="80" r="40"
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={arcLength}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span 
            key={score}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-black text-white"
          >
            {score}
          </motion.span>
          <motion.span 
            animate={{ color }}
            className="text-xs font-bold uppercase tracking-widest"
          >
            {label}
          </motion.span>
        </div>
      </div>
    </div>
  )
}

// Input Component with Float Effect and Error State
const FormInput = ({ label, icon, value, onChange, placeholder, type = "text", error }: any) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <motion.div 
      variants={formFieldVariants}
      className="space-y-2"
    >
      <label className={`text-sm font-bold uppercase tracking-widest ml-1 transition-colors ${isFocused ? 'text-blue-500' : 'text-gray-400'}`}>
        {label}
      </label>
      <motion.div 
        animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="relative group"
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:scale-110 transition-transform">
          {icon}
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full bg-gray-800/50 border-2 rounded-2xl py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-gray-600 ${
            error ? 'border-red-500' : isFocused ? 'border-blue-500 bg-gray-800' : 'border-transparent'
          }`}
        />
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-500 text-xs font-bold ml-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const LoanFormPage: React.FC = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const submitTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const [formData, setFormData] = useState<LoanApplication>({
    applicantName: '',
    age: 25,
    annualIncome: 500000,
    monthlyDebt: 20000,
    loanAmount: 100000,
    loanPurpose: LoanPurpose.PERSONAL,
    employmentYears: 2,
    creditScore: 700,
    hasCollateral: false,
    collateralValue: 0
  })

  const updateFormData = (updates: Partial<LoanApplication>) => {
    setFormData(prev => ({ ...prev, ...updates }))
    // Clear error for field being updated
    const fields = Object.keys(updates)
    if (fields.length > 0) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[fields[0]]
        return next
      })
    }
  }

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {}
    if (currentStep === 1) {
      if (!formData.applicantName) newErrors.applicantName = "Name is required"
      if (formData.age < 18) newErrors.age = "Must be 18+"
      if (formData.annualIncome <= 0) newErrors.annualIncome = "Invalid income"
    }
    if (currentStep === 2) {
      if (formData.loanAmount <= 0) newErrors.loanAmount = "Invalid amount"
      if (formData.employmentYears < 0) newErrors.employmentYears = "Invalid years"
    }
    if (currentStep === 3) {
      if (formData.hasCollateral && formData.collateralValue <= 0) {
        newErrors.collateralValue = "Collateral value must be greater than 0"
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setDirection(1)
      setStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    setDirection(-1)
    setStep(prev => prev - 1)
  }

  React.useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current)
      }
    }
  }, [])

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    setIsSubmitting(true)
    try {
      const decision = await loanApi.submitLoanApplication(formData)
      showToast("Application submitted successfully!", "success")
      // Wait a bit to show the loading screen states
      submitTimeoutRef.current = setTimeout(() => {
        navigate(`/decision/${decision.applicationId}`, { state: { decision } })
      }, 5000)
    } catch (error) {
      console.error("Submission failed:", error)
      setIsSubmitting(false)
      showToast("Failed to submit application. Please try again.", "error")
    }
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-gray-950 pt-24 pb-12 px-4"
    >
      <LoadingScreen isVisible={isSubmitting} />

      <div className="max-w-2xl mx-auto">
        {/* Progress Header */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-white tracking-tight">Loan Application</h2>
            <span className="text-gray-500 font-medium">Step {step} of 3</span>
          </div>
          
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-600"
              initial={{ width: "33%" }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            />
          </div>

          <div className="flex justify-between mt-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <motion.div
                  animate={{ 
                    scale: step === s ? 1.2 : 1,
                    backgroundColor: step >= s ? '#2563eb' : '#1f2937'
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg"
                >
                  {step > s ? <CheckCircle2 size={20} /> : s}
                </motion.div>
                <span className={`text-xs font-bold uppercase tracking-wider ${step >= s ? 'text-blue-500' : 'text-gray-600'}`}>
                  {s === 1 ? 'Personal' : s === 2 ? 'Loan' : 'Credit'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="space-y-6"
              >
                <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
                  <FormInput
                    label="Full Name"
                    icon={<User className="text-gray-400" size={20} />}
                    value={formData.applicantName}
                    onChange={(v: string) => updateFormData({ applicantName: v })}
                    placeholder="Enter your legal name"
                    error={errors.applicantName}
                  />
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormInput
                      label="Age"
                      type="number"
                      icon={<Info className="text-gray-400" size={20} />}
                      value={formData.age}
                      onChange={(v: string) => updateFormData({ age: parseInt(v) || 0 })}
                      placeholder="Min 18"
                      error={errors.age}
                    />
                    <FormInput
                      label="Annual Income (PKR)"
                      type="number"
                      icon={<Wallet className="text-gray-400" size={20} />}
                      value={formData.annualIncome}
                      onChange={(v: string) => updateFormData({ annualIncome: parseFloat(v) || 0 })}
                      placeholder="e.g. 1,200,000"
                      error={errors.annualIncome}
                    />
                  </div>
                  <FormInput
                    label="Monthly Debt Obligations (PKR)"
                    type="number"
                    icon={<DollarSign className="text-gray-400" size={20} />}
                    value={formData.monthlyDebt}
                      onChange={(v: string) => updateFormData({ monthlyDebt: parseFloat(v) || 0 })}
                    placeholder="Include rent, EMI, etc."
                  />
                </motion.div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="space-y-6"
              >
                <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
                  <FormInput
                    label="Desired Loan Amount (PKR)"
                    type="number"
                    icon={<DollarSign className="text-gray-400" size={20} />}
                    value={formData.loanAmount}
                      onChange={(v: string) => updateFormData({ loanAmount: parseFloat(v) || 0 })}
                    placeholder="Enter amount"
                    error={errors.loanAmount}
                  />
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Loan Purpose</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { id: LoanPurpose.HOME, label: 'Home', icon: Home },
                        { id: LoanPurpose.CAR, label: 'Car', icon: Car },
                        { id: LoanPurpose.BUSINESS, label: 'Business', icon: Building2 },
                        { id: LoanPurpose.EDUCATION, label: 'Education', icon: GraduationCap },
                        { id: LoanPurpose.PERSONAL, label: 'Personal', icon: User }
                      ].map((purpose) => (
                        <button
                          key={purpose.id}
                          onClick={() => updateFormData({ loanPurpose: purpose.id })}
                          className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                            formData.loanPurpose === purpose.id 
                            ? 'bg-blue-600/10 border-blue-600 text-white shadow-lg shadow-blue-900/20' 
                            : 'bg-gray-800/50 border-transparent text-gray-500 hover:bg-gray-800'
                          }`}
                        >
                          <purpose.icon size={24} className="mb-2" />
                          <span className="text-xs font-bold">{purpose.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <FormInput
                    label="Years of Employment"
                    type="number"
                    icon={<Briefcase className="text-gray-400" size={20} />}
                    value={formData.employmentYears}
                      onChange={(v: string) => updateFormData({ employmentYears: parseFloat(v) || 0 })}
                    placeholder="e.g. 3"
                    error={errors.employmentYears}
                  />
                </motion.div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-end px-1">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Credit Score</label>
                    <ShieldCheck className="text-blue-500" />
                  </div>
                  
                  <CreditGauge score={formData.creditScore} />

                  <input
                    type="range"
                    min="300"
                    max="850"
                    value={formData.creditScore}
                    onChange={(e) => updateFormData({ creditScore: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="p-6 bg-gray-800/50 rounded-3xl border border-gray-700/50 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-bold">Have Collateral?</h4>
                      <p className="text-xs text-gray-500">Assets like property or gold</p>
                    </div>
                    <button
                      onClick={() => updateFormData({ hasCollateral: !formData.hasCollateral })}
                      className={`w-14 h-8 rounded-full p-1 transition-colors relative ${formData.hasCollateral ? 'bg-blue-600' : 'bg-gray-700'}`}
                    >
                      <motion.div 
                        animate={{ x: formData.hasCollateral ? 24 : 0 }}
                        className="w-6 h-6 bg-white rounded-full shadow-md"
                      />
                    </button>
                  </div>

                  <AnimatePresence>
                    {formData.hasCollateral && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <FormInput
                          label="Estimated Collateral Value (PKR)"
                          type="number"
                          icon={<Globe className="text-gray-400" size={20} />}
                          value={formData.collateralValue}
                          onChange={(v: string) => updateFormData({ collateralValue: parseFloat(v) || 0 })}
                          placeholder="e.g. 2,000,000"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Buttons */}
          <div className="flex gap-4 mt-12">
            {step > 1 && (
              <motion.button
                {...hoverScale}
                onClick={prevStep}
                className="flex-1 py-4 bg-gray-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft size={20} /> Back
              </motion.button>
            )}
            <motion.button
              {...hoverScale}
              onClick={step === 3 ? handleSubmit : nextStep}
              className={`flex-[2] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl ${
                step === 3 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-900/20' 
                : 'bg-white text-gray-900'
              }`}
            >
              {step === 3 ? 'Final Submit' : 'Next Step'}
              {step < 3 && <ChevronRight size={20} />}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default LoanFormPage
