import type { FormSubmitEvent } from "@nuxt/ui";
// Use the generated database types for better type safety
// import type { Database } from "../types/database.types";
// type IntakeSubmission = Database['public']['Tables']['intake_submissions']['Insert'];

export interface IntakeFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  case_type: "personal_injury" | "consumer_protection" | "other";
  case_description: string;
  incident_date?: string;
  location?: string;
  urgency: "low" | "medium" | "high";
}

export const useIntakeForm = () => {
  const toast = useToast();

  const submitIntakeForm = async (event: FormSubmitEvent<IntakeFormData>) => {
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        data?: unknown;
        error?: unknown;
      }>("/api/intake", {
        method: "POST",
        body: event.data,
      });

      if (response.error) {
        throw new Error("Failed to submit form");
      }

      toast.add({
        title: "Case Submitted Successfully!",
        description:
          "We'll review your case and get back to you within 24 hours.",
        color: "success",
      });

      return { success: true, data: response.data };
    } catch (error: unknown) {
      console.error("Form submission error:", error);

      toast.add({
        title: "Submission Failed",
        description:
          error instanceof Error
            ? error.message
            : "Please try again or contact us directly.",
        color: "error",
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  return {
    submitIntakeForm,
  };
};
