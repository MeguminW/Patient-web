'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from '@/components/shared/Logo'
import { Button } from '@/components/ui/button'
import { ChevronDown, MapPin, Clock, Phone, Check } from 'lucide-react'

function QueueStatusContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Fixed demo data - always #5 with 4 people ahead, 45min wait
  const [queueData, setQueueData] = useState({
    queueNumber: 5,
    estimatedWait: 45,
    patientsAhead: 4,
    status: 'waiting' as 'waiting' | 'almost' | 'ready',
    intakeCompleted: false,
  })

  // Check if intake form was just completed via URL param
  useEffect(() => {
    const completed = searchParams.get('intakeCompleted') === 'true'
    if (completed) {
      setQueueData(prev => ({ ...prev, intakeCompleted: true }))
    }
  }, [searchParams])

  const [showClinicInfo, setShowClinicInfo] = useState(false)

  // Status-based styling
  const getStatusConfig = () => {
    switch (queueData.status) {
      case 'almost':
        return {
          banner: 'Almost your turn!',
          bannerDetail: "You're #2 in line. Please head back to the clinic.",
          bannerColor: 'bg-blue-50 border-l-4 border-blue-500',
          textColor: 'text-blue-900',
        }
      case 'ready':
        return {
          banner: "It's Your Turn!",
          bannerDetail: 'Please proceed to the front desk',
          bannerColor: 'bg-green-50 border-l-4 border-green-500',
          textColor: 'text-green-900',
        }
      default:
        return {
          banner: "We'll notify you when it's almost your turn",
          bannerDetail: null,
          bannerColor: 'bg-blue-50 border-l-4 border-blue-500',
          textColor: 'text-blue-900',
        }
    }
  }

  const statusConfig = getStatusConfig()
  // Progress: if you're #3 with 2 ahead, that's 1/3 done. If #2 with 1 ahead, that's 2/3 done. If #1 with 0 ahead, that's 3/3 done.
  const progressPercentage = ((queueData.queueNumber - queueData.patientsAhead) / queueData.queueNumber) * 100

  return (
    <motion.main
      className="min-h-screen bg-neutral-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* HEADER - Simple with just logo and border */}
      <motion.header
        className="sticky top-0 z-50 bg-white border-b border-neutral-200"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {/* Logo - CENTERED */}
        <div className="flex items-center justify-center py-3">
          <Logo variant="wordmark" />
        </div>
      </motion.header>

      {/* MAIN CONTENT */}
      <div className="flex-1">
        <div className="max-w-md mx-auto px-4 py-5 space-y-4">

          {/* LIVE QUEUE STATUS BADGE */}
          <motion.div
            className="flex items-center justify-center gap-2 -mt-1"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-blue-500"
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
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">
              Live Queue Status
            </span>
          </motion.div>

          {/* QUEUE NUMBER CARD - WHITE background */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {/* Queue Position */}
            <div className="text-center mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-400 mb-3">
                Your Position
              </p>
              <div className="text-8xl font-bold text-black tabular-nums tracking-tighter leading-none mb-2">
                #{queueData.queueNumber}
              </div>
              <p className="text-sm font-medium text-neutral-500">
                Bundle Medical & Sportsworld
              </p>
            </div>

            {/* Estimated Wait */}
            <div className="border-t border-neutral-200 pt-8 pb-6">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-400 text-center mb-4">
                Estimated Wait
              </p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-7xl font-bold text-black tabular-nums tracking-tighter leading-none">
                  ~{queueData.estimatedWait}
                </span>
                <span className="text-3xl text-neutral-400 font-normal">
                  min
                </span>
              </div>
            </div>

            {/* Patients Ahead + Progress Bar */}
            <div className="border-t border-neutral-200 pt-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-base font-bold text-neutral-700">
                  Patients ahead
                </p>
                <p className="text-3xl font-bold text-black tabular-nums">
                  {queueData.patientsAhead}
                </p>
              </div>

              {/* Progress Bar - THICKER and more visible */}
              <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  className="h-full bg-black rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>

          {/* STATUS BANNER - BLUE left border */}
          <motion.div
            className={`rounded-xl p-4 ${statusConfig.bannerColor}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <p className={`text-sm font-bold text-center ${statusConfig.textColor}`}>
              {statusConfig.banner}
            </p>
            {statusConfig.bannerDetail && (
              <p className={`text-xs font-medium text-center mt-1 ${statusConfig.textColor} opacity-80`}>
                {statusConfig.bannerDetail}
              </p>
            )}
          </motion.div>

          {/* INTAKE FORM PROMPT OR CONFIRMATION */}
          {!queueData.intakeCompleted ? (
            <motion.div
              className="bg-white rounded-2xl p-5 border border-neutral-200"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">
                  !
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-black mb-1">
                    Complete Your Intake Form
                  </h3>
                  <p className="text-sm text-neutral-600 mb-3">
                    Speed up your visit by filling out your medical information now
                  </p>
                  <Button
                    onClick={() => router.push('/intake')}
                    className="w-full h-11 text-sm font-bold rounded-lg bg-black hover:bg-neutral-800 transition-colors"
                  >
                    Start Intake Form
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="bg-green-50 rounded-2xl p-5 border border-green-200"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-green-900 mb-1">
                    Intake Form Completed
                  </h3>
                  <p className="text-sm font-medium text-green-700">
                    Thank you! Your medical information has been submitted.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* CLINIC INFO ACCORDION */}
          <motion.div
            className="bg-white rounded-2xl border border-neutral-200 overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            {/* Accordion Header */}
            <button
              onClick={() => setShowClinicInfo(!showClinicInfo)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
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
                  <div className="px-5 pb-5 pt-2 space-y-4 border-t border-neutral-100">
                    {/* Address */}
                    <a
                      href="https://maps.google.com/?q=50+Sportsworld+Crossing+Road+E1-03+Kitchener+ON"
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      <MapPin className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-black mb-0.5">
                          Address
                        </p>
                        <p className="text-sm text-neutral-700">
                          50 Sportsworld Crossing Road E1-03<br />
                          Kitchener, ON N2P 0A4
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          Floor 1 · Sportsworld Crossing
                        </p>
                      </div>
                    </a>

                    {/* Hours */}
                    <div className="flex items-start gap-3 p-3">
                      <Clock className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-black mb-2">
                          Hours
                        </p>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Monday</span>
                            <span className="text-neutral-900 font-medium">9 AM – 4 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Tuesday</span>
                            <span className="text-neutral-900 font-medium">9 AM – 5 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Wednesday</span>
                            <span className="text-neutral-900 font-medium">9 AM – 5 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Thursday</span>
                            <span className="text-neutral-900 font-medium">9 AM – 5 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Friday</span>
                            <span className="text-neutral-900 font-medium">9 AM – 4 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Saturday</span>
                            <span className="text-red-600 font-medium">Closed</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Sunday</span>
                            <span className="text-red-600 font-medium">Closed</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Phone */}
                    <a
                      href="tel:+15199572057"
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      <Phone className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-black mb-0.5">
                          Phone
                        </p>
                        <p className="text-sm text-neutral-700 tabular-nums">
                          (519) 957-2057
                        </p>
                      </div>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="max-w-md mx-auto px-4 py-6 text-center">
          <p className="text-xs text-neutral-500">
            Powered by Fountain Health Technologies Inc.
          </p>
        </div>
      </footer>
    </motion.main>
  )
}

export default function QueueStatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-neutral-400 text-sm">Loading...</div>
        </div>
      </div>
    }>
      <QueueStatusContent />
    </Suspense>
  )
}
