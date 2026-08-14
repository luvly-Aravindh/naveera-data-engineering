import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import LeadForm from './LeadForm'

export default function FormPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [formKey, setFormKey] = useState(0) // Reset form instance

  // Auto-show popup 2 seconds after page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const closePopup = useCallback(() => {
    setIsOpen(false)
    // Reset form for next use
    setFormKey(prev => prev + 1)
  }, [])
  
  const openPopup = useCallback(() => setIsOpen(true), [])

  // Expose openPopup globally so CTA buttons can trigger it
  useEffect(() => {
    window.openFormPopup = openPopup
  }, [openPopup])

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closePopup}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              aria-hidden="true"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.target === e.currentTarget && closePopup()}
            >
              <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  onClick={closePopup}
                  className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                  aria-label="Close form"
                >
                  <X size={24} className="text-gray-600" />
                </motion.button>

                {/* Form Content */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="pt-16 px-8 pb-8 sm:px-10"
                >
                  <LeadForm key={formKey} isPopup={true} onSubmitSuccess={closePopup} />
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
