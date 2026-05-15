import { Variants } from 'framer-motion';

// 1. pageVariants
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeInOut" }
  },
  exit: { 
    opacity: 0, 
    y: -30,
    transition: { duration: 0.4, ease: "easeInOut" }
  }
};

// 2. cardVariants
export const cardVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 }
  }
};

// 3. staggerContainer
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

// 4. staggerItem
export const staggerItem: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 }
};

// 5. decisionVariants
export const decisionVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: (decision: any) => ({
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
    boxShadow: decision === 'APPROVED' 
      ? ["0px 0px 0px rgba(34,197,94,0)", "0px 0px 20px rgba(34,197,94,0.4)", "0px 0px 0px rgba(34,197,94,0)"]
      : decision === 'REJECTED'
      ? ["0px 0px 0px rgba(239,68,68,0)", "0px 0px 20px rgba(239,68,68,0.4)", "0px 0px 0px rgba(239,68,68,0)"]
      : decision === 'CONDITIONAL_APPROVAL'
      ? ["0px 0px 0px rgba(234,179,8,0)", "0px 0px 20px rgba(234,179,8,0.4)", "0px 0px 0px rgba(234,179,8,0)"]
      : ["0px 0px 0px rgba(59,130,246,0)", "0px 0px 20px rgba(59,130,246,0.4)", "0px 0px 0px rgba(59,130,246,0)"],
  })
};

// 6. formFieldVariants
export const formFieldVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 }
};

// 7. progressBarVariants
export const progressBarVariants: Variants = {
  initial: { width: 0 },
  animate: (value: any) => ({
    width: `${value}%`,
    transition: { duration: 1, ease: "easeOut" }
  })
};

// 8. floatingVariants
export const floatingVariants: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// 9. hoverScale
export const hoverScale = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.97 }
};

// 10. slideInFromRight
export const slideInFromRight: Variants = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 }
};

// 11. slideInFromLeft
export const slideInFromLeft: Variants = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 }
};

// 12. fadeInUp
export const fadeInUp: Variants = {
  initial: { y: 40, opacity: 0 },
  animate: { y: 0, opacity: 1 }
};

// 13. rulesFireVariants
export const rulesFireVariants: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  }
};

// 14. counterVariants
export const counterVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
};

// Helper: getDecisionColor
export const getDecisionColor = (decision: string) => {
  switch (decision) {
    case 'APPROVED':
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        accent: 'bg-green-500',
        shadow: 'shadow-green-100'
      };
    case 'REJECTED':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        accent: 'bg-red-500',
        shadow: 'shadow-red-100'
      };
    case 'CONDITIONAL_APPROVAL':
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        accent: 'bg-yellow-500',
        shadow: 'shadow-yellow-100'
      };
    case 'REVIEW':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        accent: 'bg-blue-500',
        shadow: 'shadow-blue-100'
      };
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
        accent: 'bg-gray-500',
        shadow: 'shadow-gray-100'
      };
  }
};
