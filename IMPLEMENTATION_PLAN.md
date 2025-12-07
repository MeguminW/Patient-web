# Patient Web - Implementation Plan

## 1. Project Overview

**Component Name:** Fountain Patient Web
**Purpose:** Mobile browser interface for queue tracking and intake form completion
**Target Platform:** Mobile browsers (iOS Safari, Chrome), PWA-enabled
**Target Users:** Patients who checked in via kiosk or remote queue

**Key User Goals:**
- Track real-time queue position and wait time
- Complete intake form to save time at clinic
- Receive notifications when it's almost their turn
- Access clinic information (address, hours, directions)
- Know exactly when to head back to clinic

**Success Metrics:**
- Real-time queue updates (simulated: 30s intervals)
- < 5 minute intake form completion time
- Clear status communication (waiting → almost → ready)
- 100% mobile responsiveness
- Accessible clinic information

---

## 2. Technical Stack

**Framework:** Next.js 14+ (App Router)

**UI Library:** shadcn/ui components
- Button (default, outline, ghost variants)
- Card
- Input, Textarea, Select
- Form (react-hook-form integration)
- Progress (queue progress bar)
- Badge (status indicators)
- Accordion (expandable clinic info)
- Sheet/Dialog (modals)
- Toast (notifications)

**Styling:** Tailwind CSS
- Mobile-first approach
- max-w-md container (448px)
- 8px grid system
- Design system color tokens

**PWA Configuration:**
- next-pwa plugin
- Installable to home screen
- Push notification support (browser notifications)
- Offline queue status caching

**State Management:**
- React Context API for queue state
- Local Storage for form persistence
- Server-Sent Events (SSE) or polling for real-time updates

**API Integrations:**
- Queue status API (polling every 30s)
- Intake form submission API
- Mock notification API

**Deployment:** Netlify
- Custom domain/subdomain
- Environment variables
- Automatic HTTPS

**Additional Dependencies:**
- react-hook-form (form management)
- zod (validation)
- lucide-react (icons)
- date-fns (date formatting)
- framer-motion (animations)

---

## 3. Design System Implementation

### Color Palette
```typescript
// tailwind.config.ts - Same as Kiosk
colors: {
  black: '#000000',
  white: '#FFFFFF',
  neutral: {
    100: '#F5F5F5',
    200: '#E5E5E5',
    500: '#737373',
    700: '#404040',
  },
  success: '#22C55E',  // Green - open, short wait
  warning: '#F59E0B',  // Amber - called, moderate wait
  error: '#EF4444',    // Red - very busy
  info: '#3B82F6',     // Blue
}
```

### Typography System
```typescript
// Mobile-optimized (standard sizes)
- H1: 32px (text-3xl font-semibold tracking-tight)
- H2: 24px (text-2xl font-semibold)
- H3: 18px (text-lg font-semibold)
- Body: 16px (text-base)
- Body Small: 14px (text-sm)
- Caption: 12px (text-xs)
- Overline: 11px (text-xs font-medium uppercase tracking-wider)

// Numbers: tabular-nums for queue number consistency
```

### Spacing (8px Grid)
```typescript
- space-4: 16px (default spacing)
- space-6: 24px (card padding)
- space-8: 32px (section gaps)
- space-12: 48px (page spacing)
```

### Border Radius
```typescript
- rounded-md: 6px (badges)
- rounded-lg: 8px (buttons, inputs)
- rounded-xl: 12px (cards)
- rounded-full: 9999px (status indicators)
```

### Mobile Touch Targets
- Minimum: 48x48px
- Buttons: 44-48px height
- Inputs: 48px height
- Tap area padding: 16px minimum

### Animations
```typescript
// Live indicator pulse
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

// Fade in up (page transitions)
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

// Progress bar fill
transition: width 0.3s ease-in-out;
```

### Logo Usage
- **Header:** Wordmark Only (small, horizontal space)
- **Favicon:** Icon Only

---

## 4. File Structure

```
patient-web/
├── public/
│   ├── icons/
│   │   ├── icon-192x192.png
│   │   ├── icon-512x512.png
│   │   └── favicon.ico
│   ├── logos/
│   │   ├── fountain-icon.svg
│   │   └── fountain-wordmark.svg
│   └── manifest.json
│
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Queue status page
│   │   ├── intake/
│   │   │   ├── page.tsx            # Multi-step intake form
│   │   │   ├── personal/page.tsx   # Step 1
│   │   │   ├── medical/page.tsx    # Step 2
│   │   │   └── confirm/page.tsx    # Step 3
│   │   └── error/
│   │       └── page.tsx            # Error/invalid queue page
│   │
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── select.tsx
│   │   │   ├── form.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── accordion.tsx
│   │   │   ├── sheet.tsx
│   │   │   └── toast.tsx
│   │   │
│   │   ├── queue/                  # Queue-specific components
│   │   │   ├── QueueHeader.tsx
│   │   │   ├── QueueNumberCard.tsx
│   │   │   ├── WaitTimeDisplay.tsx
│   │   │   ├── ProgressIndicator.tsx
│   │   │   ├── StatusBanner.tsx    # Waiting/Almost/Ready variants
│   │   │   ├── IntakePromptCard.tsx
│   │   │   └── ClinicInfoAccordion.tsx
│   │   │
│   │   ├── intake/                 # Intake form components
│   │   │   ├── FormProgress.tsx
│   │   │   ├── PersonalInfoForm.tsx
│   │   │   ├── MedicalInfoForm.tsx
│   │   │   ├── ConfirmationSummary.tsx
│   │   │   └── FormNavigation.tsx
│   │   │
│   │   └── shared/
│   │       ├── Logo.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── LiveIndicator.tsx
│   │
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── validations.ts          # Zod schemas
│   │   ├── api/
│   │   │   ├── queue.ts            # Queue API calls
│   │   │   └── intake.ts           # Intake form API
│   │   ├── hooks/
│   │   │   ├── useQueueStatus.ts   # Real-time queue updates
│   │   │   ├── useNotifications.ts # Browser notifications
│   │   │   └── useFormPersist.ts   # Local storage persistence
│   │   └── constants.ts
│   │
│   ├── context/
│   │   ├── QueueContext.tsx        # Queue state
│   │   └── IntakeContext.tsx       # Intake form state
│   │
│   └── types/
│       ├── queue.ts
│       └── intake.ts
│
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 5. Component Architecture

### UI Components Hierarchy

```
Layout (Root)
├── QueueHeader (Logo + Clinic Name)
├── Toaster (notifications)
└── Page Components
    ├── QueueStatusPage (Main)
    │   ├── LiveIndicator
    │   ├── StatusBanner (conditional: waiting/almost/ready)
    │   ├── QueueNumberCard
    │   │   ├── Badge (queue number)
    │   │   ├── WaitTimeDisplay
    │   │   └── ProgressIndicator
    │   ├── IntakePromptCard
    │   │   └── Button (Fill Intake Form)
    │   └── ClinicInfoAccordion
    │       ├── Address (with map link)
    │       ├── Phone (with tel: link)
    │       └── Hours
    │
    └── IntakeFormPage
        ├── FormProgress (step indicator)
        ├── MultiStepForm
        │   ├── PersonalInfoForm (Step 1)
        │   ├── MedicalInfoForm (Step 2)
        │   └── ConfirmationSummary (Step 3)
        └── FormNavigation (Back/Next buttons)
```

### Component Props & State

```typescript
// QueueNumberCard.tsx
interface QueueNumberCardProps {
  queueNumber: number;
  estimatedWait: number;
  patientsAhead: number;
  status: 'waiting' | 'almost' | 'ready';
  progress: number; // 0-100
}

// StatusBanner.tsx
interface StatusBannerProps {
  status: 'waiting' | 'almost' | 'ready';
  queuePosition?: number;
  clinicAddress?: string;
}

// FormProgress.tsx
interface FormProgressProps {
  currentStep: 1 | 2 | 3;
  completedSteps: number[];
}

// ProgressIndicator.tsx
interface ProgressIndicatorProps {
  current: number;
  total: number;
  variant?: 'bar' | 'circle';
}
```

---

## 6. Page-by-Page Implementation Details

### 6.1 Queue Status Page (`/?q={queueNumber}`)

**Purpose:** Real-time queue tracking and intake form access

**URL Structure:**
```
/?q=5                    # Queue number from SMS link
/?q=5&clinic=bundle      # With clinic ID
```

**Layout Structure:**
```tsx
<main className="min-h-screen bg-white">
  {/* Header */}
  <header className="sticky top-0 bg-white border-b border-neutral-200 z-10">
    <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
      <Logo variant="wordmark" className="h-8" />
      <LiveIndicator />
    </div>
    <div className="max-w-md mx-auto px-4 pb-4">
      <h2 className="text-lg font-semibold">
        Bundle Medical & Sportsworld Walk-In Clinic
      </h2>
    </div>
  </header>

  {/* Status Banner (conditional) */}
  {status !== 'waiting' && (
    <StatusBanner status={status} />
  )}

  {/* Main Content */}
  <div className="max-w-md mx-auto px-4 py-8 space-y-6">
    {/* Queue Number Card */}
    <QueueNumberCard
      queueNumber={5}
      estimatedWait={35}
      patientsAhead={4}
      status="waiting"
      progress={20}
    />

    {/* Intake Prompt */}
    {!intakeCompleted && (
      <IntakePromptCard onStartIntake={handleStartIntake} />
    )}

    {intakeCompleted && (
      <Card className="p-4 bg-success/10 border-success/20">
        <div className="flex items-center gap-2 text-success">
          <CheckCircle2 className="w-5 h-5" />
          <p className="font-medium">Intake form completed</p>
        </div>
      </Card>
    )}

    {/* Clinic Information */}
    <ClinicInfoAccordion clinic={clinicData} />
  </div>
</main>
```

**State Management:**
```typescript
interface QueueStatus {
  queueNumber: number;
  status: 'waiting' | 'almost' | 'ready';
  estimatedWait: number;
  patientsAhead: number;
  intakeCompleted: boolean;
  lastUpdated: Date;
}

const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

**Real-Time Updates (Polling):**
```typescript
// hooks/useQueueStatus.ts
export function useQueueStatus(queueNumber: string) {
  const [status, setStatus] = useState<QueueStatus | null>(null);

  useEffect(() => {
    // Initial fetch
    fetchQueueStatus(queueNumber).then(setStatus);

    // Poll every 30 seconds
    const interval = setInterval(() => {
      fetchQueueStatus(queueNumber).then(data => {
        setStatus(prev => {
          // Trigger notification if status changed
          if (prev && prev.status !== data.status) {
            showNotification(data.status);
          }
          return data;
        });
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [queueNumber]);

  return status;
}
```

**Simulated Queue Advancement:**
```typescript
// lib/api/queue.ts (mock)
export async function fetchQueueStatus(queueNumber: string): Promise<QueueStatus> {
  // Simulate queue advancement
  const now = Date.now();
  const startTime = parseInt(sessionStorage.getItem('queueStartTime') || now.toString());
  const elapsed = Math.floor((now - startTime) / 30000); // 30s intervals

  const initialPosition = 5;
  const currentPosition = Math.max(1, initialPosition - elapsed);

  return {
    queueNumber: parseInt(queueNumber),
    status: currentPosition === 1 ? 'ready' : currentPosition === 2 ? 'almost' : 'waiting',
    estimatedWait: currentPosition * 10,
    patientsAhead: currentPosition - 1,
    intakeCompleted: false, // Check from backend
    lastUpdated: new Date(),
  };
}
```

**API Calls:**
- `GET /api/queue/{queueNumber}` - Fetch current status
- `GET /api/intake/status/{queueNumber}` - Check if intake completed

**Interactions:**
- Tap "Fill Intake Form" → Navigate to /intake
- Tap address → Open in Maps app
- Tap phone → Initiate phone call
- Pull to refresh → Manual status update

**Error Handling:**
- Invalid queue number: Redirect to error page
- Network error: Show toast, use cached data
- Queue expired (> 4 hours): Show "Queue expired" message

**Edge Cases:**
- Queue number not found
- Status changes while on page (notification)
- Multiple status changes during background (show catch-up notification)
- Intake completed on another device (sync)

---

### 6.2 Intake Form - Step 1: Personal Information (`/intake/personal`)

**Purpose:** Collect patient personal details

**Layout Structure:**
```tsx
<main className="min-h-screen bg-white">
  {/* Progress Header */}
  <header className="sticky top-0 bg-white border-b border-neutral-200 z-10">
    <div className="max-w-md mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={handleBack}>← Back</Button>
        <p className="text-sm text-neutral-500">Step 1 of 3</p>
      </div>
      <FormProgress currentStep={1} />
    </div>
  </header>

  {/* Form Content */}
  <div className="max-w-md mx-auto px-4 py-8">
    <h1 className="text-2xl font-semibold mb-2">Personal Information</h1>
    <p className="text-sm text-neutral-500 mb-8">
      Please verify and complete your information
    </p>

    <PersonalInfoForm
      defaultValues={savedData}
      onSubmit={handleSubmitStep1}
    />
  </div>

  {/* Fixed Bottom Navigation */}
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4">
    <div className="max-w-md mx-auto">
      <Button
        type="submit"
        className="w-full"
        form="personal-info-form"
      >
        Next: Medical Information →
      </Button>
    </div>
  </div>
</main>
```

**Form Fields:**
```tsx
<Form {...form}>
  <form id="personal-info-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    {/* Full Name (pre-filled from kiosk) */}
    <FormField
      control={form.control}
      name="fullName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Full Name *</FormLabel>
          <FormControl>
            <Input {...field} placeholder="John Smith" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    {/* Date of Birth */}
    <FormField
      control={form.control}
      name="dateOfBirth"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Date of Birth *</FormLabel>
          <FormControl>
            <Input {...field} type="date" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    {/* Health Card Number */}
    <FormField
      control={form.control}
      name="healthCardNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Health Card Number *</FormLabel>
          <FormControl>
            <Input {...field} placeholder="1234-567-890-AB" />
          </FormControl>
          <FormDescription>
            Enter your Ontario health card number
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />

    {/* Phone Number (pre-filled) */}
    <FormField
      control={form.control}
      name="phoneNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Phone Number *</FormLabel>
          <FormControl>
            <Input {...field} type="tel" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    {/* Email (optional) */}
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email (optional)</FormLabel>
          <FormControl>
            <Input {...field} type="email" placeholder="john@example.com" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

**Validation Schema:**
```typescript
const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Name required'),
  dateOfBirth: z.string().refine(val => {
    const date = new Date(val);
    const age = (Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    return age >= 0 && age < 120;
  }, 'Invalid date of birth'),
  healthCardNumber: z.string()
    .regex(/^\d{4}-\d{3}-\d{3}-[A-Z]{2}$/, 'Format: 1234-567-890-AB'),
  phoneNumber: z.string().regex(/^\d{10}$/, '10 digits required'),
  email: z.string().email().optional().or(z.literal('')),
});
```

**State Management:**
- Form data persisted to localStorage on change
- Pre-fill name/phone from kiosk check-in
- Auto-save every 2 seconds

---

### 6.3 Intake Form - Step 2: Medical Information (`/intake/medical`)

**Purpose:** Collect medical history and reason for visit

**Layout:** Similar header/footer to Step 1

**Form Fields:**
```tsx
{/* Reason for Visit (required, multiple choice) */}
<FormField
  control={form.control}
  name="reasonForVisit"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Reason for Visit *</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a reason" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="cold-flu">Cold / Flu Symptoms</SelectItem>
          <SelectItem value="injury">Minor Injury</SelectItem>
          <SelectItem value="prescription">Prescription Renewal</SelectItem>
          <SelectItem value="checkup">General Check-up</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>

{/* Symptoms Description (optional) */}
<FormField
  control={form.control}
  name="symptoms"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Symptoms (optional)</FormLabel>
      <FormControl>
        <Textarea
          {...field}
          placeholder="Describe your symptoms..."
          className="min-h-[100px]"
        />
      </FormControl>
      <FormDescription>
        Providing details helps us prepare for your visit
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>

{/* Current Medications (optional) */}
<FormField
  control={form.control}
  name="currentMedications"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Current Medications (optional)</FormLabel>
      <FormControl>
        <Textarea
          {...field}
          placeholder="List any medications you're taking..."
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

{/* Allergies (optional) */}
<FormField
  control={form.control}
  name="allergies"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Allergies (optional)</FormLabel>
      <FormControl>
        <Textarea
          {...field}
          placeholder="List any known allergies..."
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

{/* Family Doctor (optional) */}
<FormField
  control={form.control}
  name="familyDoctor"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Family Doctor (optional)</FormLabel>
      <FormControl>
        <Input {...field} placeholder="Dr. Smith" />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

**Navigation:**
```tsx
<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4">
  <div className="max-w-md mx-auto flex gap-4">
    <Button
      variant="outline"
      onClick={() => router.push('/intake/personal')}
      className="flex-1"
    >
      ← Back
    </Button>
    <Button
      type="submit"
      form="medical-info-form"
      className="flex-1"
    >
      Next: Review →
    </Button>
  </div>
</div>
```

---

### 6.4 Intake Form - Step 3: Confirmation (`/intake/confirm`)

**Purpose:** Review and submit intake form

**Layout Structure:**
```tsx
<div className="max-w-md mx-auto px-4 py-8">
  <h1 className="text-2xl font-semibold mb-2">Review Your Information</h1>
  <p className="text-sm text-neutral-500 mb-8">
    Please review your information before submitting
  </p>

  {/* Personal Info Summary */}
  <Card className="p-6 mb-4">
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-semibold">Personal Information</h2>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push('/intake/personal')}
      >
        Edit
      </Button>
    </div>
    <dl className="space-y-2 text-sm">
      <div>
        <dt className="text-neutral-500">Name</dt>
        <dd className="font-medium">{formData.fullName}</dd>
      </div>
      <div>
        <dt className="text-neutral-500">Date of Birth</dt>
        <dd className="font-medium">{formatDate(formData.dateOfBirth)}</dd>
      </div>
      <div>
        <dt className="text-neutral-500">Health Card</dt>
        <dd className="font-medium">{formData.healthCardNumber}</dd>
      </div>
      <div>
        <dt className="text-neutral-500">Phone</dt>
        <dd className="font-medium">{formatPhone(formData.phoneNumber)}</dd>
      </div>
      {formData.email && (
        <div>
          <dt className="text-neutral-500">Email</dt>
          <dd className="font-medium">{formData.email}</dd>
        </div>
      )}
    </dl>
  </Card>

  {/* Medical Info Summary */}
  <Card className="p-6 mb-8">
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-semibold">Medical Information</h2>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push('/intake/medical')}
      >
        Edit
      </Button>
    </div>
    <dl className="space-y-2 text-sm">
      <div>
        <dt className="text-neutral-500">Reason for Visit</dt>
        <dd className="font-medium">{formatReasonForVisit(formData.reasonForVisit)}</dd>
      </div>
      {formData.symptoms && (
        <div>
          <dt className="text-neutral-500">Symptoms</dt>
          <dd className="font-medium">{formData.symptoms}</dd>
        </div>
      )}
      {/* ... other optional fields */}
    </dl>
  </Card>

  {/* Privacy Consent */}
  <div className="mb-8">
    <label className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={consentGiven}
        onChange={(e) => setConsentGiven(e.target.checked)}
        className="mt-1"
      />
      <span className="text-sm">
        I consent to the collection and use of my personal health information
        for the purpose of medical treatment at this clinic.
      </span>
    </label>
  </div>

  {/* Submit Button */}
  <Button
    onClick={handleSubmit}
    disabled={!consentGiven || isSubmitting}
    className="w-full"
  >
    {isSubmitting ? 'Submitting...' : 'Submit Intake Form'}
  </Button>
</div>
```

**Submission Flow:**
```typescript
const handleSubmit = async () => {
  setIsSubmitting(true);
  try {
    const response = await submitIntakeForm({
      queueNumber,
      ...formData,
      consentGiven,
    });

    // Clear local storage
    localStorage.removeItem('intakeFormData');

    // Show success toast
    toast({
      title: "Intake form submitted!",
      description: "Your information has been received.",
    });

    // Navigate back to queue status
    router.push(`/?q=${queueNumber}`);

  } catch (error) {
    toast({
      title: "Submission failed",
      description: "Please try again or submit at the clinic.",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};
```

---

### 6.5 Status Banner Variants

**Waiting State (Default):**
```tsx
// No banner shown, just regular queue display
```

**Almost Your Turn:**
```tsx
<div className="bg-warning/10 border-b-4 border-warning">
  <div className="max-w-md mx-auto px-4 py-6 text-center">
    <h2 className="text-2xl font-semibold mb-2">Almost your turn!</h2>
    <p className="text-lg mb-4">You're #2 in line</p>
    <p className="text-sm text-neutral-700">
      Please head back to the clinic
    </p>
  </div>
</div>
```

**Your Turn:**
```tsx
<div className="bg-success/10 border-b-4 border-success animate-pulse">
  <div className="max-w-md mx-auto px-4 py-6 text-center">
    <div className="flex items-center justify-center gap-2 mb-2">
      <Bell className="w-6 h-6 animate-bounce" />
      <h2 className="text-2xl font-semibold">It's Your Turn!</h2>
    </div>
    <p className="text-lg mb-4">Please proceed to the front desk</p>

    {/* Clinic Address + Directions */}
    <div className="flex flex-col gap-2">
      <p className="text-sm text-neutral-700">
        50 Sportsworld Crossing Rd, Kitchener ON
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={openMaps}
        className="mx-auto"
      >
        Get Directions →
      </Button>
    </div>
  </div>
</div>
```

---

## 7. Data Flow & State Management

### Global State (Context)

**QueueContext:**
```typescript
interface QueueContextType {
  queueNumber: string | null;
  status: QueueStatus | null;
  isLoading: boolean;
  error: string | null;
  refreshQueue: () => Promise<void>;
  clearQueue: () => void;
}

export const QueueProvider: React.FC = ({ children }) => {
  const [queueNumber, setQueueNumber] = useState<string | null>(null);
  const [status, setStatus] = useState<QueueStatus | null>(null);

  // Real-time polling
  useEffect(() => {
    if (!queueNumber) return;

    const fetchStatus = async () => {
      const data = await getQueueStatus(queueNumber);
      setStatus(data);
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);

    return () => clearInterval(interval);
  }, [queueNumber]);

  return (
    <QueueContext.Provider value={{ queueNumber, status, ... }}>
      {children}
    </QueueContext.Provider>
  );
};
```

**IntakeContext:**
```typescript
interface IntakeContextType {
  formData: IntakeFormData | null;
  currentStep: 1 | 2 | 3;
  updateFormData: (step: number, data: Partial<IntakeFormData>) => void;
  goToStep: (step: 1 | 2 | 3) => void;
  submitForm: () => Promise<void>;
  reset: () => void;
}

export const IntakeProvider: React.FC = ({ children }) => {
  const [formData, setFormData] = useState<IntakeFormData | null>(() => {
    // Load from localStorage
    const saved = localStorage.getItem('intakeFormData');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Auto-save to localStorage
  useEffect(() => {
    if (formData) {
      localStorage.setItem('intakeFormData', JSON.stringify(formData));
    }
  }, [formData]);

  const updateFormData = (step: number, data: Partial<IntakeFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  return (
    <IntakeContext.Provider value={{ formData, currentStep, updateFormData, ... }}>
      {children}
    </IntakeContext.Provider>
  );
};
```

### Local Storage Persistence

**What to Persist:**
- Intake form data (auto-save)
- Queue number (for easy return)
- Last queue status (offline fallback)

**What NOT to Persist:**
- Sensitive health data (clear after submission)
- Auth tokens (N/A for this demo)

---

## 8. API Integration Plan

### API Routes

**1. Queue Status (`/api/queue/[queueNumber]`)**
```typescript
export async function GET(
  request: Request,
  { params }: { params: { queueNumber: string } }
) {
  const { queueNumber } = params;

  // Mock: Simulate queue advancement
  const mockData = simulateQueueAdvancement(queueNumber);

  return Response.json(mockData);
}
```

**2. Intake Form Submission (`/api/intake/submit`)**
```typescript
export async function POST(request: Request) {
  const body = await request.json();

  // Validate
  const validated = intakeFormSchema.safeParse(body);
  if (!validated.success) {
    return Response.json({ error: 'Invalid data' }, { status: 400 });
  }

  // Mock: Save to database
  console.log('Intake submitted:', validated.data);

  return Response.json({
    success: true,
    message: 'Intake form submitted successfully',
  });
}
```

**3. Intake Status Check (`/api/intake/status/[queueNumber]`)**
```typescript
export async function GET(
  request: Request,
  { params }: { params: { queueNumber: string } }
) {
  // Check if intake completed for this queue number
  const completed = checkIntakeCompleted(params.queueNumber);

  return Response.json({ completed });
}
```

### Mock Data

```typescript
// lib/constants.ts
export const CLINIC_DATA = {
  name: 'Bundle Medical & Sportsworld Walk-In Clinic',
  address: '50 Sportsworld Crossing Rd Unit E1-03, Kitchener ON N2P 0A4',
  phone: '519-957-2057',
  hours: {
    monday: '9:00 AM - 5:00 PM',
    tuesday: '9:00 AM - 5:00 PM',
    wednesday: '9:00 AM - 5:00 PM',
    thursday: '9:00 AM - 5:00 PM',
    friday: 'Varies',
    saturday: 'Closed',
    sunday: 'Closed',
  },
  mapsUrl: 'https://maps.google.com/?q=50+Sportsworld+Crossing+Rd+Kitchener+ON',
};
```

---

## 9. PWA Configuration

### manifest.json

```json
{
  "name": "Fountain Queue Tracker",
  "short_name": "Fountain",
  "description": "Track your clinic queue status in real-time",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#FFFFFF",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Browser Notifications

```typescript
// lib/hooks/useNotifications.ts
export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }
    return 'denied';
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        ...options,
      });
    }
  };

  return { permission, requestPermission, showNotification };
}

// Usage when status changes to "almost"
if (newStatus === 'almost') {
  showNotification('Almost your turn!', {
    body: "You're #2 in line. Please head back to the clinic.",
    tag: 'queue-status',
  });
}
```

---

## 10. Routing & Navigation

### Route Structure

```
/ (Queue Status)
  → Query param: ?q={queueNumber}
  ↓ [Fill Intake Form button]
/intake/personal (Step 1)
  ↓ [Next button]
/intake/medical (Step 2)
  ↓ [Next button]
/intake/confirm (Step 3)
  ↓ [Submit button]
/ (Back to Queue Status)
```

### Route Guards

```typescript
// /intake pages
useEffect(() => {
  if (!queueNumber) {
    router.push('/error');
  }
}, [queueNumber, router]);

// Prevent navigation away with unsaved changes
useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [hasUnsavedChanges]);
```

---

## 11. Testing Strategy

### Key User Flows

**Happy Path:**
1. ✅ Receive SMS → Click link → View queue status
2. ✅ Queue advances every 30s (simulated)
3. ✅ Fill intake form (3 steps) → Submit successfully
4. ✅ Status changes: waiting → almost → ready
5. ✅ Receive browser notification when almost ready

**Error Cases:**
1. ❌ Invalid queue number in URL
2. ❌ Network failure during form submission
3. ❌ Form validation errors
4. ❌ Queue expired (> 4 hours old)

**Edge Cases:**
1. ⚠️ Form partially filled → Close browser → Return → Data persisted
2. ⚠️ Status changes while on intake form page
3. ⚠️ Multiple tabs open (localStorage sync)
4. ⚠️ Offline mode → Show cached status
5. ⚠️ Browser notification permission denied

### Cross-Browser/Device Testing

**Browsers:**
- iOS Safari (primary)
- Chrome Mobile (Android)
- Samsung Internet

**Devices:**
- iPhone 12/13/14 (various sizes)
- Android (Pixel, Samsung)

**Features:**
- PWA installation
- Browser notifications
- Tel/Maps links
- LocalStorage persistence

### Accessibility Checklist

- [ ] All form labels associated
- [ ] Error messages descriptive
- [ ] Focus management in multi-step form
- [ ] Color contrast WCAG AA
- [ ] Touch targets ≥ 48px
- [ ] Screen reader friendly

---

## 12. Performance Optimization

### Code Splitting

```typescript
// Lazy load intake form
const IntakeForm = dynamic(() => import('@/components/intake/IntakeForm'), {
  loading: () => <LoadingSpinner />,
});

// Lazy load map component (if added)
const ClinicMap = dynamic(() => import('@/components/queue/ClinicMap'), {
  ssr: false,
});
```

### Image Optimization

```typescript
// Logo
<Image
  src="/logos/fountain-wordmark.svg"
  alt="Fountain"
  width={120}
  height={32}
  priority
/>
```

### Bundle Size Targets

- First Load JS: < 150 KB
- Route bundles: < 40 KB each
- Total: < 250 KB

---

## 13. Professional Enhancements

### Loading Skeletons

```tsx
// Queue status loading
<Card className="p-6 space-y-4">
  <Skeleton className="h-8 w-32" />
  <Skeleton className="h-24 w-24 rounded-full mx-auto" />
  <Skeleton className="h-6 w-40 mx-auto" />
  <Skeleton className="h-4 w-48 mx-auto" />
</Card>
```

### Micro-Interactions

```tsx
// Live indicator pulse
<div className="flex items-center gap-2">
  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
  <span className="text-sm text-neutral-500">Live</span>
</div>
```

### Success States

```tsx
// Form submission success
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  className="text-center"
>
  <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
  <h2 className="text-xl font-semibold">Intake Submitted!</h2>
</motion.div>
```

### Empty States

```tsx
// No queue found
<div className="text-center py-12">
  <AlertCircle className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
  <h2 className="text-xl font-semibold mb-2">Queue Not Found</h2>
  <p className="text-neutral-500 mb-6">
    This queue number is invalid or has expired.
  </p>
  <Button onClick={() => router.push('/find-clinic')}>
    Find a Clinic
  </Button>
</div>
```

### Progressive Enhancement

**Pull to Refresh:**
```typescript
// Simple pull-to-refresh
let startY = 0;
const handleTouchStart = (e: TouchEvent) => {
  startY = e.touches[0].pageY;
};

const handleTouchEnd = (e: TouchEvent) => {
  const endY = e.changedTouches[0].pageY;
  if (endY - startY > 100 && window.scrollY === 0) {
    refreshQueue();
  }
};
```

---

## 14. Known Challenges & Solutions

### Challenge 1: Real-Time Updates Without WebSocket

**Solution:** Polling with exponential backoff
```typescript
const pollInterval = status === 'almost' ? 15000 : 30000; // Poll faster when close
```

### Challenge 2: Form Data Persistence

**Solution:** Auto-save to localStorage every 2 seconds
```typescript
const debouncedSave = useMemo(
  () => debounce((data) => {
    localStorage.setItem('intakeFormData', JSON.stringify(data));
  }, 2000),
  []
);
```

### Challenge 3: Mobile Safari PWA Quirks

**Solutions:**
- Use `standalone` display mode
- Test "Add to Home Screen" flow
- Handle viewport-fit for notched devices

### Challenge 4: Notification Reliability

**Solutions:**
- Request permission early (with context)
- Graceful degradation if denied
- Show in-app alerts as backup

---

## 15. Deployment Checklist

### Environment Variables

```bash
# API Endpoints
NEXT_PUBLIC_API_URL=https://api.fountain-demo.com

# Feature Flags
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_POLLING_INTERVAL=30000
```

### Netlify Configuration

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/manifest.json"
  [headers.values]
    Content-Type = "application/manifest+json"
```

### Post-Deployment Tests

- [ ] Queue status loads from SMS link
- [ ] Real-time polling works
- [ ] Intake form submits successfully
- [ ] Browser notifications work
- [ ] PWA installable
- [ ] Offline mode functional
- [ ] Tel/Maps links work on mobile

---

This Patient Web implementation plan is complete and production-ready. Proceeding to Patient App plan next.
