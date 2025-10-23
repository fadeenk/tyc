<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { IntakeFormData } from "~/composables/useIntakeForm";

// Form validation schema
const schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  case_type: z.enum(["personal_injury", "consumer_protection", "other"], {
    errorMap: () => ({ message: "Please select a case type" }),
  }),
  case_description: z
    .string()
    .min(10, "Case description must be at least 10 characters"),
  incident_date: z.string().optional(),
  location: z.string().optional(),
  urgency: z.enum(["low", "medium", "high"], {
    errorMap: () => ({ message: "Please select urgency level" }),
  }),
});

type Schema = z.output<typeof schema>;

// Form state
const state = reactive<Partial<Schema>>({
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  case_type: undefined,
  case_description: "",
  incident_date: "",
  location: "",
  urgency: undefined,
});

// Case type options
const caseTypeOptions = [
  { label: "Personal Injury", value: "personal_injury" },
  { label: "Consumer Protection", value: "consumer_protection" },
  { label: "Other", value: "other" },
];

// Urgency options
const urgencyOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

// Form submission
const { submitIntakeForm } = useIntakeForm();

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  await submitIntakeForm(event as FormSubmitEvent<IntakeFormData>);
};
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Submit Your Case
      </h2>
      <p class="text-lg text-gray-600 dark:text-gray-300">
        Get connected with a qualified lawyer. No cost until we win.
      </p>
    </div>

    <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
      <!-- Personal Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormField label="First Name" name="first_name" required>
          <UInput
            v-model="state.first_name"
            placeholder="Enter your first name"
            icon="i-lucide-user"
          />
        </UFormField>

        <UFormField label="Last Name" name="last_name" required>
          <UInput
            v-model="state.last_name"
            placeholder="Enter your last name"
            icon="i-lucide-user"
          />
        </UFormField>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormField label="Email Address" name="email" required>
          <UInput
            v-model="state.email"
            type="email"
            placeholder="your.email@example.com"
            icon="i-lucide-mail"
          />
        </UFormField>

        <UFormField label="Phone Number" name="phone" required>
          <UInput
            v-model="state.phone"
            type="tel"
            placeholder="(555) 123-4567"
            icon="i-lucide-phone"
          />
        </UFormField>
      </div>

      <!-- Case Information -->
      <UFormField label="Case Type" name="case_type" required>
        <USelect
          v-model="state.case_type"
          :items="caseTypeOptions"
          placeholder="Select your case type"
          icon="i-lucide-scale"
        />
      </UFormField>

      <UFormField label="Case Description" name="case_description" required>
        <UTextarea
          v-model="state.case_description"
          placeholder="Please describe your legal situation in detail..."
          :rows="4"
          autoresize
          icon="i-lucide-file-text"
        />
      </UFormField>

      <!-- Optional Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormField label="Incident Date" name="incident_date">
          <UInput
            v-model="state.incident_date"
            type="date"
            icon="i-lucide-calendar"
          />
        </UFormField>

        <UFormField label="Location" name="location">
          <UInput
            v-model="state.location"
            placeholder="City, State"
            icon="i-lucide-map-pin"
          />
        </UFormField>
      </div>

      <UFormField label="Urgency Level" name="urgency" required>
        <USelect
          v-model="state.urgency"
          :items="urgencyOptions"
          placeholder="How urgent is your case?"
          icon="i-lucide-clock"
        />
      </UFormField>

      <!-- Submit Button -->
      <div class="flex justify-center pt-4">
        <UButton
          type="submit"
          size="xl"
          color="primary"
          class="w-full md:w-auto px-8"
        >
          <template #leading>
            <UIcon name="i-lucide-send" />
          </template>
          Submit Your Case
        </UButton>
      </div>

      <!-- Privacy Notice -->
      <div class="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          By submitting this form, you agree to our
          <UButton variant="link" size="sm" to="/privacy"
            >Privacy Policy</UButton
          >
          and
          <UButton variant="link" size="sm" to="/terms"
            >Terms of Service</UButton
          >.
        </p>
        <p class="mt-2">
          <UIcon name="i-lucide-shield-check" class="inline mr-1" />
          Your information is secure and confidential.
        </p>
      </div>
    </UForm>
  </div>
</template>
