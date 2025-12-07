'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from '@/components/shared/Logo'
import { Button } from '@/components/ui/button'
import { ChevronDown, MapPin, Clock, Phone } from 'lucide-react'

export default function QueueStatusPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Demo data - consistent with kiosk
  const [queueData] = useState({
    queueNumber: 5,
    estimatedWait: 45,
    patientsAhead: 4,
    status: 'waiting', // waiting | almost | ready
    intakeCompleted: false,
  })

  const [showClinicInfo, setShowClinicInfo] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Pull to refresh simulation
  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  // Status-based styling and messaging
  const getStatusConfig = () => {
    switch (queueData.status) {
      case 'almost':
        return {
          banner: 'Almost your turn!',
          bannerColor: 'bg-amber-50 border-amber-200 text-amber-900',
          indicator: 'bg-amber-400',
        }
      case 'ready':
        return {
          banner: 'You\'re next! Please return to the clinic',
          bannerColor: 'bg-green-50 border-green-200 text-green-900',
          indicator: 'bg-green-400',
        }
      default:
        return {
          banner: 'We\'ll notify you when it\'s almost your turn',
          bannerColor: 'bg-blue-50 border-blue-200 text-blue-900',
          indicator: 'bg-blue-400',
        }
    }
  }

  const statusConfig = getStatusConfig()

  // Calculate progress percentage
  const progressPercentage = ((5 - queueData.patientsAhead) / 5) * 100

  return (
    <motion.main
      className="min-h-screen bg-neutral-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Sticky Header with Logo */}
      <motion.header
        className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="flex justify-center py-4">
          <Logo variant="wordmark" />
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 px-4 py-6 max-w-md mx-auto w-full space-y-6">
        {/* Live Indicator */}
        <motion.div
          className="flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <motion.div
            className={`w-2.5 h-2.5 rounded-full ${statusConfig.indicator}`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <span className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
            Live Queue Status
          </span>
        </motion.div>

        {/* Queue Number Card */}
        <motion.div
          className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-neutral-100"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {/* Your Position */}
          <div className="text-center mb-8">
            <p className="text-sm font-bold tracking-[0.2em] uppercase text-neutral-400 mb-3">
              Your Position
            </p>
            <div className="text-8xl font-bold text-black tabular-nums tracking-tighter leading-none mb-1">
              #{queueData.queueNumber}
            </div>
            <p className="text-lg text-neutral-500 mt-2">
              Bundle Medical & Sportsworld
            </p>
          </div>

          {/* Wait Time - Massive display */}
          <div className="border-t border-neutral-200 pt-8 pb-6">
            <p className="text-sm font-bold tracking-[0.2em] uppercase text-neutral-400 text-center mb-4">
              Estimated Wait
            </p>
            <div className="flex items-baseline justify-center gap-3">
              <span className="text-7xl font-bold text-black tabular-nums tracking-tighter leading-none font-mono">
                ~{queueData.estimatedWait}
              </span>
              <span className="text-3xl text-neutral-300 font-light pb-1">
                min
              </span>
            </div>
          </div>

          {/* Patients Ahead + Progress */}
          <div className="border-t border-neutral-200 pt-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-base font-semibold text-neutral-700">
                Patients ahead
              </p>
              <p className="text-2xl font-bold text-black tabular-nums">
                {queueData.patientsAhead}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-black rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Status Banner */}
        <motion.div
          className={`rounded-2xl p-5 border ${statusConfig.bannerColor}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <p className="text-base font-semibold text-center">
            {statusConfig.banner}
          </p>
        </motion.div>

        {/* Intake Form Prompt */}
        {!queueData.intakeCompleted && (
          <motion.div
            className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                !
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-black mb-1">
                  Complete Your Intake Form
                </h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Speed up your visit by filling out your medical information now
                </p>
                <Button
                  onClick={() => router.push('/intake')}
                  className="w-full h-12 text-base font-semibold rounded-xl bg-black hover:bg-neutral-800 shadow-sm hover:shadow-md transition-all"
                >
                  Start Intake Form
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Clinic Info Accordion */}
        <motion.div
          className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          {/* Accordion Header */}
          <button
            onClick={() => setShowClinicInfo(!showClinicInfo)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
          >
            <span className="text-base font-semibold text-black">
              Clinic Information
            </span>
            <motion.div
              animate={{ rotate: showClinicInfo ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5 text-neutral-400" />
            </motion.div>
          </button>

          {/* Accordion Content */}
          <AnimatePresence>
            {showClinicInfo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 pt-2 space-y-4 border-t border-neutral-100">
                  {/* Address */}
                  <a
                    href="https://maps.google.com/?q=Bundle+Medical+Sportsworld"
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors"
                  >
                    <MapPin className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-black mb-1">
                        Address
                      </p>
                      <p className="text-sm text-neutral-600">
                        123 Medical Centre Dr<br />
                        Kitchener, ON N2N 2N2
                      </p>
                    </div>
                  </a>

                  {/* Hours */}
                  <div className="flex items-start gap-3 p-3">
                    <Clock className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-black mb-1">
                        Hours Today
                      </p>
                      <p className="text-sm text-neutral-600">
                        8:00 AM - 8:00 PM
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <a
                    href="tel:+15195551234"
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-black mb-1">
                        Phone
                      </p>
                      <p className="text-sm text-neutral-600 font-mono">
                        (519) 555-1234
                      </p>
                    </div>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Refresh Button */}
        <motion.div
          className="flex justify-center pt-2 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="ghost"
            className="text-sm text-neutral-500 hover:text-neutral-700 font-medium"
          >
            {isRefreshing ? 'Refreshing...' : 'Pull to refresh status'}
          </Button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-neutral-200 bg-white">
        <p className="text-neutral-500 text-xs font-medium">
          Powered by Fountain Health Technologies Inc.
        </p>
      </footer>
    </motion.main>
  )
}
