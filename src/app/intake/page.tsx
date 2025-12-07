'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

type Step = 1 | 2 | 3

interface FormData {
  // Step 1: Personal Information
  fullName: string
  dateOfBirth: string
  healthCard: string
  phone: string
  email: string

  // Step 2: Medical Information
  reasonForVisit: string
  symptoms: string
  medications: string
  allergies: string
  familyDoctor: string

  // Step 3: Consent
  privacyConsent: boolean
}

export default function IntakePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>(1)

  const [formData, setFormData] = useState<FormData>({
    fullName: 'Shiba Wang',
    dateOfBirth: '',
    healthCard: '',
    phone: '(519) 123-4567',
    email: '',
    reasonForVisit: '',
    symptoms: '',
    medications: '',
    allergies: '',
    familyDoctor: '',
    privacyConsent: false,
  })

  // Format Ontario health card number
  const formatHealthCard = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '')

    // Format as XXXX-XXX-XXX (Ontario format)
    if (digits.length <= 4) {
      return digits
    } else if (digits.length <= 7) {
      return `${digits.slice(0, 4)}-${digits.slice(4)}`
    } else {
      return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7, 10)}`
    }
  }

  const handleHealthCardChange = (value: string) => {
    const formatted = formatHealthCard(value)
    updateField('healthCard', formatted)
  }

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((currentStep + 1) as Step)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
    }
  }

  const handleSubmit = () => {
    // In real app: submit to API
    console.log('Form submitted:', formData)

    // Navigate back with completion flag
    router.push('/?intakeCompleted=true')
  }

  const canProceed = () => {
    if (currentStep === 1) {
      return formData.fullName && formData.dateOfBirth && formData.healthCard && formData.phone
    }
    if (currentStep === 2) {
      return formData.reasonForVisit
    }
    if (currentStep === 3) {
      return formData.privacyConsent
    }
    return false
  }

  return (
    <motion.main
      className="min-h-screen bg-neutral-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => currentStep === 1 ? router.push('/') : prevStep()}
            className="text-sm font-medium text-neutral-700 hover:text-black -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 1 ? 'Back to Queue Status' : 'Previous Step'}
          </Button>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-black">
              Step {currentStep} of 3
            </p>
            <p className="text-sm text-neutral-500">
              {currentStep === 1 && 'Personal Information'}
              {currentStep === 2 && 'Medical Information'}
              {currentStep === 3 && 'Review & Submit'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-black rounded-full"
              initial={{ width: `${(currentStep - 1) * 33.33}%` }}
              animate={{ width: `${currentStep * 33.33}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1">
        <div className="max-w-md mx-auto px-4 py-6">
          <AnimatePresence mode="wait">
            {/* STEP 1: Personal Information */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-bold text-black mb-2">
                    Personal Information
                  </h2>
                  <p className="text-sm text-neutral-600">
                    Please provide your personal details for our records
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName" className="text-sm font-semibold text-black mb-1.5 block">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      className="h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dateOfBirth" className="text-sm font-semibold text-black mb-1.5 block">
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateField('dateOfBirth', e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="healthCard" className="text-sm font-semibold text-black mb-1.5 block">
                      Ontario Health Card Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="healthCard"
                      value={formData.healthCard}
                      onChange={(e) => handleHealthCardChange(e.target.value)}
                      placeholder="1234-567-890"
                      maxLength={12}
                      className="h-12"
                    />
                    <p className="text-xs text-neutral-500 mt-1.5">Format: XXXX-XXX-XXX</p>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-semibold text-black mb-1.5 block">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="(519) 123-4567"
                      className="h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold text-black mb-1.5 block">
                      Email (Optional)
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="your.email@example.com"
                      className="h-12"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Medical Information */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-bold text-black mb-2">
                    Medical Information
                  </h2>
                  <p className="text-sm text-neutral-600">
                    Help us understand your visit better
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reasonForVisit" className="text-sm font-semibold text-black mb-1.5 block">
                      Reason for Visit <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="reasonForVisit"
                      value={formData.reasonForVisit}
                      onChange={(e) => updateField('reasonForVisit', e.target.value)}
                      placeholder="e.g., Cold, Flu, Injury, Check-up"
                      className="h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="symptoms" className="text-sm font-semibold text-black mb-1.5 block">
                      Symptoms Description (Optional)
                    </Label>
                    <Textarea
                      id="symptoms"
                      value={formData.symptoms}
                      onChange={(e) => updateField('symptoms', e.target.value)}
                      placeholder="Describe your symptoms..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <div>
                    <Label htmlFor="medications" className="text-sm font-semibold text-black mb-1.5 block">
                      Current Medications (Optional)
                    </Label>
                    <Textarea
                      id="medications"
                      value={formData.medications}
                      onChange={(e) => updateField('medications', e.target.value)}
                      placeholder="List any medications you're currently taking..."
                      rows={3}
                      className="resize-none"
                    />
                  </div>

                  <div>
                    <Label htmlFor="allergies" className="text-sm font-semibold text-black mb-1.5 block">
                      Allergies (Optional)
                    </Label>
                    <Textarea
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) => updateField('allergies', e.target.value)}
                      placeholder="List any known allergies..."
                      rows={3}
                      className="resize-none"
                    />
                  </div>

                  <div>
                    <Label htmlFor="familyDoctor" className="text-sm font-semibold text-black mb-1.5 block">
                      Family Doctor (Optional)
                    </Label>
                    <Input
                      id="familyDoctor"
                      value={formData.familyDoctor}
                      onChange={(e) => updateField('familyDoctor', e.target.value)}
                      placeholder="Dr. Smith"
                      className="h-12"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Review & Submit */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-bold text-black mb-2">
                    Review & Confirm
                  </h2>
                  <p className="text-sm text-neutral-600">
                    Please review your information before submitting
                  </p>
                </div>

                {/* Summary Cards */}
                <div className="space-y-4">
                  {/* Personal Information Summary */}
                  <div className="bg-white rounded-xl p-5 border border-neutral-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-black uppercase tracking-wider">
                        Personal Information
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentStep(1)}
                        className="text-xs h-7"
                      >
                        Edit
                      </Button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-neutral-500">Name:</span>{' '}
                        <span className="text-black font-medium">{formData.fullName}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500">DOB:</span>{' '}
                        <span className="text-black font-medium">{formData.dateOfBirth}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500">Health Card:</span>{' '}
                        <span className="text-black font-medium">{formData.healthCard}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500">Phone:</span>{' '}
                        <span className="text-black font-medium">{formData.phone}</span>
                      </div>
                      {formData.email && (
                        <div>
                          <span className="text-neutral-500">Email:</span>{' '}
                          <span className="text-black font-medium">{formData.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Medical Information Summary */}
                  <div className="bg-white rounded-xl p-5 border border-neutral-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-black uppercase tracking-wider">
                        Medical Information
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentStep(2)}
                        className="text-xs h-7"
                      >
                        Edit
                      </Button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-neutral-500">Reason for Visit:</span>{' '}
                        <span className="text-black font-medium">{formData.reasonForVisit}</span>
                      </div>
                      {formData.symptoms && (
                        <div>
                          <span className="text-neutral-500">Symptoms:</span>{' '}
                          <span className="text-black font-medium">{formData.symptoms}</span>
                        </div>
                      )}
                      {formData.medications && (
                        <div>
                          <span className="text-neutral-500">Medications:</span>{' '}
                          <span className="text-black font-medium">{formData.medications}</span>
                        </div>
                      )}
                      {formData.allergies && (
                        <div>
                          <span className="text-neutral-500">Allergies:</span>{' '}
                          <span className="text-black font-medium">{formData.allergies}</span>
                        </div>
                      )}
                      {formData.familyDoctor && (
                        <div>
                          <span className="text-neutral-500">Family Doctor:</span>{' '}
                          <span className="text-black font-medium">{formData.familyDoctor}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Privacy Consent */}
                  <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-200">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="privacyConsent"
                        checked={formData.privacyConsent}
                        onCheckedChange={(checked) => updateField('privacyConsent', checked as boolean)}
                        className="mt-0.5"
                      />
                      <label
                        htmlFor="privacyConsent"
                        className="text-sm text-neutral-700 leading-relaxed cursor-pointer"
                      >
                        I consent to the collection and use of my personal health information for the purpose of receiving medical care at this clinic. <span className="text-red-500">*</span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="border-t border-neutral-200 bg-white sticky bottom-0">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={prevStep}
                className="flex-1 h-12 text-sm font-semibold"
              >
                Previous
              </Button>
            )}
            {currentStep < 3 ? (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex-1 h-12 text-sm font-semibold bg-black hover:bg-neutral-800"
              >
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="flex-1 h-12 text-sm font-semibold bg-black hover:bg-neutral-800"
              >
                <Check className="w-4 h-4 mr-2" />
                Submit Intake Form
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.main>
  )
}
