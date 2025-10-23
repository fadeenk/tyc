import type { FormSubmitEvent } from "@nuxt/ui";

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
        data?: any;
        error?: any;
      }>("/api/intake", {
        method: "POST",
        body: event.data,
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to submit form");
      }

      toast.add({
        title: "Case Submitted Successfully!",
        description:
          "We'll review your case and get back to you within 24 hours.",
        color: "success",
      });

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Form submission error:", error);

      toast.add({
        title: "Submission Failed",
        description:
          error.message || "Please try again or contact us directly.",
        color: "error",
      });

      return { success: false, error: error.message };
    }
  };

  return {
    submitIntakeForm,
  };
};
