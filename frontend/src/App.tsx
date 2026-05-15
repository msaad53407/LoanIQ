import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import LandingPage from './pages/LandingPage'
import LoanFormPage from './pages/LoanFormPage'
import DecisionPage from './pages/DecisionPage'
import DashboardPage from './pages/DashboardPage'
import HistoryPage from './pages/HistoryPage'
import Navbar from './components/Navbar'
import { pageVariants } from './animations/variants'
import { FileQuestion } from 'lucide-react'

// Scroll to Top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const NotFound = () => (
  <motion.div 
    variants={pageVariants}
    initial="initial"
    animate="animate"
    className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
  >
    <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center text-blue-500 mb-6 border border-gray-800">
      <FileQuestion size={48} />
    </div>
    <h1 className="text-4xl font-black text-white mb-4">404 - Page Not Found</h1>
    <p className="text-gray-500 max-w-md mb-8 font-medium">
      The page you're looking for doesn't exist or has been moved to another location.
    </p>
    <Link to="/" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-all">
      Return Home
    </Link>
  </motion.div>
)

const AnimatedRoutes = () => {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/apply" element={<LoanFormPage />} />
        <Route path="/decision/:id" element={<DecisionPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
        <Navbar />
        <main>
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  )
}

export default App
