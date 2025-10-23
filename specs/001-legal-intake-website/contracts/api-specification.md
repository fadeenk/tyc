# Supabase Integration: Legal Intake Website

**Date**: 2025-01-27  
**Feature**: Legal Intake Website  
**Backend**: Direct Supabase integration (no custom API layer)

## Supabase Client Integration

### Intake Form Submission

**Method**: Direct Supabase client insert  
**Table**: `intake_submissions`

```typescript
// Client-side implementation
const { supabase } = useSupabase();

const submitIntakeForm = async (formData: IntakeSubmission) => {
  const { data, error } = await supabase
    .from("intake_submissions")
    .insert([formData])
    .select();

  if (error) {
    throw new Error(`Submission failed: ${error.message}`);
  }

  return data[0];
};
```

**Validation**: Handled by Supabase RLS policies and client-side validation

### Content Retrieval

**Method**: Direct Supabase client queries

#### Case Types

```typescript
const getCaseTypes = async () => {
  const { data, error } = await supabase
    .from("case_types")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  return data;
};
```

#### FAQ Items

```typescript
const getFAQItems = async (category?: string) => {
  let query = supabase
    .from("faq_items")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  return data;
};
```

#### Lawyers

```typescript
const getLawyers = async () => {
  const { data, error } = await supabase
    .from("lawyers")
    .select("*")
    .eq("is_active", true);

  return data;
};
```

## Supabase Database Schema

### Database Tables

#### intake_submissions

```sql
CREATE TABLE intake_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'assigned', 'rejected')),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  case_type VARCHAR(50) CHECK (case_type IN ('personal_injury', 'consumer_protection', 'other')),
  case_description TEXT NOT NULL,
  incident_date DATE,
  location VARCHAR(200),
  urgency TEXT CHECK (urgency IN ('low', 'medium', 'high')),
  lawyer_notes TEXT,
  assigned_lawyer_id UUID REFERENCES lawyers(id)
);
```

#### case_types

```sql
CREATE TABLE case_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);
```

#### faq_items

```sql
CREATE TABLE faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  question VARCHAR(500) NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(50) CHECK (category IN ('general', 'process', 'costs', 'legal')),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);
```

#### lawyers

```sql
CREATE TABLE lawyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  firm_name VARCHAR(200),
  specialties TEXT[],
  license_number VARCHAR(50) UNIQUE,
  state VARCHAR(2),
  is_active BOOLEAN DEFAULT true,
  max_cases INTEGER DEFAULT 10
);
```

### Row Level Security (RLS) Policies

#### Intake Submissions

```sql
-- Allow public to insert new submissions
CREATE POLICY "Allow public insert" ON intake_submissions
  FOR INSERT WITH CHECK (true);

-- Allow lawyers to view submissions assigned to them
CREATE POLICY "Lawyers can view assigned submissions" ON intake_submissions
  FOR SELECT USING (assigned_lawyer_id = auth.uid());

-- Allow lawyers to update submissions assigned to them
CREATE POLICY "Lawyers can update assigned submissions" ON intake_submissions
  FOR UPDATE USING (assigned_lawyer_id = auth.uid());
```

#### Case Types

```sql
-- Allow public to view active case types
CREATE POLICY "Public can view active case types" ON case_types
  FOR SELECT USING (is_active = true);
```

#### FAQ Items

```sql
-- Allow public to view active FAQ items
CREATE POLICY "Public can view active FAQ items" ON faq_items
  FOR SELECT USING (is_active = true);
```

#### Lawyers

```sql
-- Allow public to view active lawyers
CREATE POLICY "Public can view active lawyers" ON lawyers
  FOR SELECT USING (is_active = true);
```

## Client-Side Implementation

### Supabase Client Setup

```typescript
// composables/useSupabase.ts
import { createClient } from "@supabase/supabase-js";

export const useSupabase = () => {
  const config = useRuntimeConfig();

  const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey
  );

  return { supabase };
};
```

### Form Submission Composable

```typescript
// composables/useIntakeForm.ts
export const useIntakeForm = () => {
  const { supabase } = useSupabase();
  const isSubmitting = ref(false);
  const error = ref<string | null>(null);

  const submitForm = async (formData: IntakeSubmission) => {
    isSubmitting.value = true;
    error.value = null;

    try {
      const { data, error: supabaseError } = await supabase
        .from("intake_submissions")
        .insert([formData])
        .select();

      if (supabaseError) {
        throw supabaseError;
      }

      return data[0];
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    submitForm,
    isSubmitting: readonly(isSubmitting),
    error: readonly(error),
  };
};
```

### Content Composables

```typescript
// composables/useContent.ts
export const useContent = () => {
  const { supabase } = useSupabase();

  const getCaseTypes = async () => {
    const { data, error } = await supabase
      .from("case_types")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (error) throw error;
    return data;
  };

  const getFAQItems = async (category?: string) => {
    let query = supabase
      .from("faq_items")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  };

  const getLawyers = async () => {
    const { data, error } = await supabase
      .from("lawyers")
      .select("*")
      .eq("is_active", true);

    if (error) throw error;
    return data;
  };

  return {
    getCaseTypes,
    getFAQItems,
    getLawyers,
  };
};
```

## Error Handling

### Supabase Error Handling

```typescript
// utils/supabaseErrorHandler.ts
export const handleSupabaseError = (error: any) => {
  if (error.code === "23505") {
    return "A record with this information already exists";
  }

  if (error.code === "23503") {
    return "Referenced record does not exist";
  }

  if (error.code === "42501") {
    return "Insufficient permissions";
  }

  return error.message || "An unexpected error occurred";
};
```

### Client-Side Error Handling

```typescript
// In Vue components
const handleFormSubmit = async (formData: IntakeSubmission) => {
  try {
    await submitForm(formData);
    // Show success message
    await navigateTo("/success");
  } catch (error) {
    // Show error message to user
    console.error("Form submission failed:", error);
  }
};
```

## Security Considerations

### Data Validation

- Client-side validation before submission
- Supabase RLS policies enforce server-side security
- Input sanitization to prevent XSS

### Rate Limiting

- Supabase handles rate limiting automatically
- Client-side debouncing for form submissions
- Retry logic with exponential backoff

### Data Privacy

- All data encrypted at rest and in transit (Supabase handles this)
- RLS policies control data access
- GDPR compliance through Supabase features

## Performance Considerations

### Caching Strategy

- Use Nuxt's built-in caching for static content
- Implement client-side caching for frequently accessed data
- Leverage Supabase's CDN for database queries

### Query Optimization

- Use Supabase's query optimization features
- Implement proper indexing on frequently queried fields
- Use Supabase's real-time features for live updates (if needed)

### Monitoring

- Supabase dashboard for database performance
- Client-side error tracking
- User interaction analytics
