<script setup lang="ts">
import { reactive } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import {
  useIntakeForm,
  type IntakeFormData
} from '../composables/useIntakeForm'
import { vMaska } from 'maska/vue'

// Data cleanup helper functions
const cleanText = (text: string) => {
  return text.trim().replace(/\s+/g, ' ')
}

const cleanPhone = (phone: string) => {
  return phone.replace(/\D/g, '') // Remove all non-digits
}

const validatePhone = (phone: string) => {
  const cleaned = cleanPhone(phone)
  return cleaned.length === 10 || cleaned.length === 11
}

// Form validation schema with enhanced validation
const schema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(255, 'First name is too long')
    .transform(cleanText),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(255, 'Last name is too long')
    .transform(cleanText),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255, 'Email is too long')
    .transform(email => email.toLowerCase().trim()),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine(validatePhone, 'Please enter a valid 10-digit phone number')
    .transform(cleanPhone),
  case_type: z.enum(['personal_injury', 'consumer_protection', 'other'], {
    errorMap: () => ({ message: 'Please select a case type' })
  }),
  case_description: z
    .string()
    .min(10, 'Case description must be at least 10 characters')
    .max(5000, 'Case description is too long')
    .transform(cleanText),
  incident_date: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true
      const parsedDate = new Date(date)
      const today = new Date()
      return parsedDate <= today
    }, 'Incident date cannot be in the future'),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(255, 'Location is too long')
    .transform(cleanText),
  urgency: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Please select urgency level' })
  })
})

type Schema = z.output<typeof schema>

// Form state
const state = reactive<Partial<Schema>>({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  case_type: undefined,
  case_description: '',
  incident_date: '',
  location: '',
  urgency: undefined
})

// Case type options
const caseTypeOptions = [
  { label: 'Personal Injury', value: 'personal_injury' },
  { label: 'Consumer Protection', value: 'consumer_protection' },
  { label: 'Other', value: 'other' }
]

// Urgency options
const urgencyOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' }
]

// Form submission
const { submitIntakeForm } = useIntakeForm()

// Data cleanup function that runs before submission
const cleanupFormData = (data: Schema): IntakeFormData => {
  return {
    first_name: cleanText(data.first_name),
    last_name: cleanText(data.last_name),
    email: data.email.toLowerCase().trim(),
    phone: cleanPhone(data.phone),
    case_type: data.case_type,
    case_description: cleanText(data.case_description),
    incident_date: data.incident_date || undefined,
    location: data.location,
    urgency: data.urgency
  }
}

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  // Clean and validate data before submission
  const cleanedData = cleanupFormData(event.data)

  // Create a new event with cleaned data
  const cleanedEvent = {
    ...event,
    data: cleanedData
  } as FormSubmitEvent<IntakeFormData>

  await submitIntakeForm(cleanedEvent)
}
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <UForm
      :schema="schema"
      :state="state"
      class="space-y-6"
      @submit="onSubmit"
    >
      <!-- Personal Information -->
      <div class="form-grid">
        <UFormField
          label="First Name"
          name="first_name"
          required
        >
          <UInput
            v-model="state.first_name"
            placeholder="Enter your first name"
            icon="i-lucide-user"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Last Name"
          name="last_name"
          required
        >
          <UInput
            v-model="state.last_name"
            placeholder="Enter your last name"
            icon="i-lucide-user"
            class="w-full"
          />
        </UFormField>
      </div>

      <div class="form-grid">
        <UFormField
          label="Email Address"
          name="email"
          required
        >
          <UInput
            v-model="state.email"
            type="email"
            placeholder="your.email@example.com"
            icon="i-lucide-mail"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Phone Number"
          name="phone"
          required
        >
          <UInput
            v-model="state.phone"
            v-maska="'(###) ###-####'"
            type="tel"
            placeholder="(555) 123-4567"
            icon="i-lucide-phone"
            :ui="{
              input: {
                base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:focus:ring-primary-400'
              }
            }"
            class="w-full"
          />
        </UFormField>
      </div>

      <!-- Case Information -->
      <div class="form-grid">
        <UFormField
          label="Case Type"
          name="case_type"
          required
        >
          <USelect
            v-model="state.case_type"
            :items="caseTypeOptions"
            placeholder="Select your case type"
            icon="i-lucide-scale"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Urgency Level"
          name="urgency"
          required
        >
          <USelect
            v-model="state.urgency"
            :items="urgencyOptions"
            placeholder="How urgent is your case?"
            icon="i-lucide-clock"
            class="w-full"
          />
        </UFormField>
      </div>

      <UFormField
        label="Case Description"
        name="case_description"
        required
        class="col-span-full"
      >
        <UTextarea
          v-model="state.case_description"
          placeholder="Please describe your legal situation in detail..."
          :rows="4"
          autoresize
          icon="i-lucide-file-text"
          :maxlength="5000"
          class="w-full"
        />
        <template #help>
          <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ state.case_description?.length || 0 }}/5000 characters
          </div>
        </template>
      </UFormField>

      <!-- Optional Information -->
      <div class="form-grid">
        <UFormField
          label="Incident Date"
          name="incident_date"
        >
          <UInput
            v-model="state.incident_date"
            type="date"
            icon="i-lucide-calendar"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Location"
          name="location"
          required
        >
          <UInput
            v-model="state.location"
            placeholder="City, State"
            icon="i-lucide-map-pin"
            class="w-full"
          />
        </UFormField>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center pt-4">
        <UButton
          type="submit"
          size="xl"
          color="primary"
          class="w-full md:w-auto px-8 animate-pulse justify-center flex items-center"
          :ui="{
            rounded: 'rounded-lg'
          }"
        >
          <span class="w-full text-center flex items-center justify-center">
            <UIcon
              name="i-lucide-send"
              class="mr-2 w-4 h-4"
            />
            <span class="text-sm"> Submit Your Case Now</span>
          </span>
        </UButton>
      </div>

      <!-- Privacy Notice -->
      <div class="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          By submitting this form, you agree to our
          <UButton
            variant="link"
            size="sm"
            to="/privacy"
          >
            Privacy Policy
          </UButton>
          and
          <UButton
            variant="link"
            size="sm"
            to="/terms"
          >
            Terms of Service
          </UButton>.
        </p>
        <p class="mt-2">
          <UIcon
            name="i-lucide-shield-check"
            class="inline mr-1"
          />
          Your information is secure and confidential.
        </p>
        <div
          class="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400"
        >
          <UIcon
            name="i-lucide-lock"
            class="w-3 h-3"
          />
          <span>256-bit SSL Encrypted</span>
        </div>
      </div>
    </UForm>
  </div>
</template>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Ensure full-width elements span both columns */
.col-span-full {
  grid-column: 1 / -1;
  width: 100%;
}

/* Ensure textarea takes full width */
.col-span-full textarea {
  width: 100% !important;
}
</style>
