import { z } from "zod";
import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "../../types/database.types";

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

    // Get typed Supabase client
    const client = await serverSupabaseClient<Database>(event);

    // Insert data into Supabase with proper typing
    const { data, error } = await client
      .from("intake_submissions")
      .insert([validatedData])
      .select();

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Database error",
        data: error,
      });
    }

    return {
      success: true,
      message: "Case submitted successfully",
      data: data[0],
    };
  } catch (error: unknown) {
    console.error("Intake API error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      throw createError({
        statusCode: 400,
        statusMessage: "Validation failed",
        data:
          error instanceof Error && "errors" in error
            ? (error as { errors: unknown }).errors
            : error,
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
