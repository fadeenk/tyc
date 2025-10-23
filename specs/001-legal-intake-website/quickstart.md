# Quickstart Guide: Legal Intake Website

**Date**: 2025-01-27  
**Feature**: Legal Intake Website  
**Tech Stack**: Nuxt 4, Nuxt UI v4, Supabase, TypeScript

## Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account
- Git

## Architecture Note

This implementation uses **direct Supabase integration** - no custom API layer. The Nuxt application communicates directly with Supabase using the Supabase client library. This approach provides:

- Simplified architecture with fewer moving parts
- Built-in real-time capabilities
- Automatic API generation from database schema
- Row Level Security (RLS) for data protection
- Type-safe database operations

## Project Setup

### 1. Initialize Nuxt 4 Project

```bash
# Create new Nuxt project
npx nuxi@latest init takeyourcase-website
cd takeyourcase-website

# Install dependencies
npm install @nuxt/ui@latest @supabase/supabase-js
```

### 2. Configure Nuxt 4

Update `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ["@nuxt/ui"],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },
  ssr: false, // Disable SSR for static generation
  nitro: {
    prerender: {
      routes: ["/", "/faq", "/benefits", "/cases", "/success"],
    },
  },
  // Custom domain configuration
  app: {
    baseURL: "/", // Use root path for custom domain
  },
});
```

### 3. Environment Configuration

Create `.env` file:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Supabase Setup

#### Create Database Tables

Run these SQL commands in your Supabase SQL editor:

```sql
-- Create intake_submissions table
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
  assigned_lawyer_id UUID
);

-- Create case_types table
CREATE TABLE case_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- Create faq_items table
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

-- Create lawyers table
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

#### Enable Row Level Security

```sql
-- Enable RLS on all tables
ALTER TABLE intake_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow public insert" ON intake_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view active case types" ON case_types FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active FAQ items" ON faq_items FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active lawyers" ON lawyers FOR SELECT USING (is_active = true);
```

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Nuxt UI v4 components
│   ├── forms/             # Intake form components
│   ├── layout/            # Layout components
│   └── common/            # Shared components
├── pages/
│   ├── index.vue          # Landing page
│   ├── faq.vue            # FAQ page
│   ├── benefits.vue       # Benefits page
│   ├── cases.vue          # Cases page
│   └── success.vue        # Form submission success
├── composables/
│   ├── useSupabase.ts     # Supabase client
│   ├── useForm.ts         # Form handling
│   └── useValidation.ts   # Form validation
├── types/
│   ├── intake.ts          # Intake form types
│   └── database.ts        # Supabase types
├── utils/
│   ├── validation.ts      # Form validation helpers
│   └── constants.ts       # App constants
└── middleware/
    └── auth.ts            # Authentication middleware (if needed)
```

## Key Implementation Files

### 1. Supabase Client (`composables/useSupabase.ts`)

```typescript
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

### 2. Intake Form Composable (`composables/useIntakeForm.ts`)

```typescript
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

### 3. Content Composables (`composables/useContent.ts`)

```typescript
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

### 4. Intake Form Types (`types/intake.ts`)

```typescript
export interface IntakeSubmission {
  id?: string;
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

export interface CaseType {
  id: string;
  name: string;
  slug: string;
  description: string;
  sort_order: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
}
```

### 5. Form Validation (`utils/validation.ts`)

```typescript
export const validateIntakeForm = (data: IntakeSubmission) => {
  const errors: Record<string, string> = {};

  if (!data.first_name?.trim()) {
    errors.first_name = "First name is required";
  }

  if (!data.last_name?.trim()) {
    errors.last_name = "Last name is required";
  }

  if (!data.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!data.phone?.trim()) {
    errors.phone = "Phone number is required";
  }

  if (!data.case_description?.trim()) {
    errors.case_description = "Case description is required";
  } else if (data.case_description.length < 50) {
    errors.case_description =
      "Please provide more details (at least 50 characters)";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
```

### 4. Landing Page (`pages/index.vue`)

```vue
<template>
  <div>
    <UContainer>
      <!-- Hero Section -->
      <div class="py-12">
        <h1 class="text-4xl font-bold text-center mb-8">
          Get the Legal Help You Deserve
        </h1>
        <p class="text-xl text-center text-gray-600 mb-12">
          No cost to you until we win your case
        </p>
      </div>

      <!-- Process Explanation -->
      <div class="grid md:grid-cols-4 gap-8 mb-12">
        <div class="text-center">
          <div class="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4"></div>
          <h3 class="font-semibold mb-2">Submit Your Case</h3>
          <p class="text-sm text-gray-600">Tell us about your legal issue</p>
        </div>
        <!-- Repeat for other steps -->
      </div>

      <!-- Intake Form -->
      <IntakeForm />
    </UContainer>
  </div>
</template>
```

## Development Commands

```bash
# Start development server
npm run dev

# Generate static site for GitHub Pages
npm run generate

# Preview static build locally
npm run preview

# Build for production (if using SSR)
npm run build
```

**Note**: For GitHub Pages deployment, use `npm run generate` to create static files in the `dist` directory.

## Deployment to GitHub Pages with Custom Domain

### 1. Configure Nuxt for Static Generation

Update `nuxt.config.ts` for GitHub Pages deployment with custom domain:

```typescript
export default defineNuxtConfig({
  modules: ["@nuxt/ui"],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },
  ssr: false, // Disable SSR for static generation
  nitro: {
    prerender: {
      routes: ["/", "/faq", "/benefits", "/cases", "/success"],
    },
  },
  // Custom domain configuration
  app: {
    baseURL: "/", // Use root path for custom domain
  },
});
```

### 2. Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run generate
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        if: github.ref == 'refs/heads/main'
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 3. Configure GitHub Repository

1. **Enable GitHub Pages**:

   - Go to repository Settings → Pages
   - Source: "GitHub Actions"

2. **Add Repository Secrets**:

   - Go to repository Settings → Secrets and variables → Actions
   - Add `SUPABASE_URL` with your Supabase project URL
   - Add `SUPABASE_ANON_KEY` with your Supabase anon key

3. **Update package.json**:
   ```json
   {
     "scripts": {
       "generate": "nuxt generate",
       "preview": "nuxt preview"
     }
   }
   ```

### 4. Build and Deploy

```bash
# Test local build
npm run generate

# Preview static build
npm run preview

# Push to main branch to trigger deployment
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### 5. Custom Domain (Optional)

To use a custom domain:

1. **Add CNAME file**:

   ```bash
   echo "takeyourcase.com" > public/CNAME
   ```

2. **Configure DNS**:

   - Point your domain to GitHub Pages
   - Add CNAME record: `takeyourcase.com` → `username.github.io`

3. **Update nuxt.config.ts**:
   ```typescript
   export default defineNuxtConfig({
     // ... other config
     app: {
       baseURL: "/", // Remove baseURL for custom domain
     },
   });
   ```

### 6. Environment Variables for GitHub Pages

Since GitHub Pages serves static files, environment variables are embedded at build time:

- **Development**: Uses `.env` file
- **Production**: Uses GitHub Secrets in Actions workflow
- **Runtime**: No server-side environment variables needed

### 7. Supabase Configuration for Static Sites

Update your Supabase project settings:

1. **CORS Configuration**:

   - Add your custom domain to allowed origins
   - Add `https://takeyourcase.com` to CORS settings

2. **RLS Policies**:
   - Ensure RLS policies work with anonymous access
   - Test policies with your custom domain URL

### 8. Monitoring and Maintenance

- **Build Status**: Check Actions tab for deployment status
- **Performance**: Monitor GitHub Pages analytics
- **Supabase**: Monitor database usage and performance
- **Updates**: Push to main branch to trigger new deployments

## Content Management

### Adding Case Types

Insert into `case_types` table:

```sql
INSERT INTO case_types (name, slug, description, sort_order) VALUES
('Personal Injury', 'personal-injury', 'Car accidents, slip and fall, workplace injuries', 1),
('Consumer Protection', 'consumer-protection', 'Debt collection, fraud, product liability', 2);
```

### Adding FAQ Items

Insert into `faq_items` table:

```sql
INSERT INTO faq_items (question, answer, category, sort_order) VALUES
('How much does it cost?', 'Nothing upfront. We only get paid if we win your case.', 'costs', 1),
('How long does the process take?', 'Most cases are resolved within 6-12 months.', 'process', 2);
```

### Adding Lawyers

Insert into `lawyers` table:

```sql
INSERT INTO lawyers (first_name, last_name, email, phone, firm_name, specialties, state, is_active) VALUES
('John', 'Smith', 'john@lawfirm.com', '555-0123', 'Smith & Associates', ARRAY['Personal Injury', 'Consumer Protection'], 'CA', true);
```

## Monitoring and Maintenance

### Database Monitoring

- Monitor Supabase dashboard for performance
- Set up alerts for high error rates
- Track form submission success rates

### Content Updates

- Update FAQ items as needed
- Add new case types as services expand
- Maintain lawyer information accuracy

### Security

- Regularly review RLS policies
- Monitor for suspicious activity
- Keep dependencies updated
- Review access logs

## Troubleshooting

### Common Issues

1. **Form submission fails**: Check Supabase RLS policies
2. **Styling issues**: Ensure Nuxt UI v4 is properly installed
3. **Build errors**: Check TypeScript types and imports
4. **Performance issues**: Optimize images and enable caching

### Debug Mode

Enable debug mode in development:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  debug: true,
  // ... other config
});
```

## Next Steps

1. Set up content management system for lawyers
2. Implement email notifications for form submissions
3. Add analytics tracking
4. Implement A/B testing for conversion optimization
5. Add multi-language support if needed
