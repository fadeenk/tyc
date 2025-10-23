import { z } from "zod";

const intakeSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  case_type: z.enum(["personal_injury", "consumer_protection", "other"]),
  case_description: z
    .string()
    .min(10, "Case description must be at least 10 characters"),
  incident_date: z.string().optional(),
  location: z.string().optional(),
  urgency: z.enum(["low", "medium", "high"]),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validate the request body
    const validatedData = intakeSchema.parse(body);

    // Add timestamp and status
    const intakeData = {
      ...validatedData,
      created_at: new Date().toISOString(),
      status: "pending",
    };

    // Save to Supabase if configured, otherwise log for development
    if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
      const { data, error } = await $supabase
        .from("intake_submissions")
        .insert([intakeData]);

      if (error) {
        throw createError({
          statusCode: 500,
          statusMessage: "Database error",
          data: error,
        });
      }
    } else {
      // Development mode - just log the data
      console.log("Intake form submission (development mode):", intakeData);
    }

    return {
      success: true,
      message: "Case submitted successfully",
      data: intakeData,
    };
  } catch (error: any) {
    console.error("Intake API error:", error);

    if (error.name === "ZodError") {
      throw createError({
        statusCode: 400,
        statusMessage: "Validation failed",
        data: error.errors,
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
