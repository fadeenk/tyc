import type { FormSubmitEvent } from "@nuxt/ui";
// Use the generated database types for better type safety
import type { Database } from "~/types/database.types";

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
  const client = useSupabaseClient<Database>();

  const submitIntakeForm = async (event: FormSubmitEvent<IntakeFormData>) => {
    try {
      const { data, error } = await client
        .from("intake_submissions")
        .insert([event.data])
        .select();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      toast.add({
        title: "Case Submitted Successfully!",
        description:
          "We'll review your case and get back to you within 24 hours.",
        color: "success",
      });

      return { success: true, data: data[0] };
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
