# Data Model: Legal Intake Website

**Date**: 2025-01-27  
**Feature**: Legal Intake Website  
**Database**: Supabase (PostgreSQL)

## Entity Definitions

### Intake Submissions

**Purpose**: Store potential client information and case details submitted through the intake form

**Fields**:

- `id` (uuid, primary key) - Unique identifier for each submission
- `created_at` (timestamp) - When the submission was created
- `updated_at` (timestamp) - When the submission was last updated
- `status` (enum) - Submission status: 'pending', 'reviewed', 'assigned', 'rejected'
- `first_name` (varchar) - Client's first name (required)
- `last_name` (varchar) - Client's last name (required)
- `email` (varchar) - Client's email address (required, validated)
- `phone` (varchar) - Client's phone number (required)
- `case_type` (varchar) - Type of legal case (personal_injury, consumer_protection, other)
- `case_description` (text) - Detailed description of the legal case (required)
- `incident_date` (date) - When the incident occurred (optional)
- `location` (varchar) - Where the incident occurred (optional)
- `urgency` (enum) - Case urgency: 'low', 'medium', 'high'
- `lawyer_notes` (text) - Internal notes from lawyer review (optional)
- `assigned_lawyer_id` (uuid, foreign key) - ID of assigned lawyer (optional)

**Validation Rules**:

- `first_name`, `last_name`, `email`, `phone`, `case_description` are required
- `email` must be valid email format
- `phone` must be valid phone number format
- `case_type` must be one of: 'personal_injury', 'consumer_protection', 'other'
- `urgency` must be one of: 'low', 'medium', 'high'

**Relationships**:

- Belongs to Lawyer (optional, via assigned_lawyer_id)
- Has many Case Documents (future enhancement)

### Lawyers

**Purpose**: Store information about lawyers in the network

**Fields**:

- `id` (uuid, primary key) - Unique identifier for each lawyer
- `created_at` (timestamp) - When the lawyer was added to the system
- `updated_at` (timestamp) - When the lawyer information was last updated
- `first_name` (varchar) - Lawyer's first name
- `last_name` (varchar) - Lawyer's last name
- `email` (varchar) - Lawyer's email address
- `phone` (varchar) - Lawyer's phone number
- `firm_name` (varchar) - Name of the law firm
- `specialties` (text[]) - Array of legal specialties
- `license_number` (varchar) - Bar license number
- `state` (varchar) - State where licensed to practice
- `is_active` (boolean) - Whether the lawyer is currently accepting cases
- `max_cases` (integer) - Maximum number of cases the lawyer can handle

**Validation Rules**:

- `first_name`, `last_name`, `email`, `phone` are required
- `email` must be valid email format
- `phone` must be valid phone number format
- `license_number` must be unique
- `max_cases` must be positive integer

**Relationships**:

- Has many Intake Submissions (via assigned_lawyer_id)

### Case Types

**Purpose**: Store information about different types of legal cases supported

**Fields**:

- `id` (uuid, primary key) - Unique identifier for each case type
- `created_at` (timestamp) - When the case type was created
- `name` (varchar) - Display name for the case type
- `slug` (varchar) - URL-friendly identifier
- `description` (text) - Description of the case type
- `is_active` (boolean) - Whether this case type is currently supported
- `sort_order` (integer) - Display order on the cases page

**Validation Rules**:

- `name`, `slug` are required
- `slug` must be unique and URL-friendly
- `sort_order` must be non-negative integer

**Relationships**:

- None (reference data)

### FAQ Items

**Purpose**: Store frequently asked questions and answers

**Fields**:

- `id` (uuid, primary key) - Unique identifier for each FAQ item
- `created_at` (timestamp) - When the FAQ item was created
- `updated_at` (timestamp) - When the FAQ item was last updated
- `question` (varchar) - The question text
- `answer` (text) - The answer text
- `category` (varchar) - FAQ category (general, process, costs, etc.)
- `is_active` (boolean) - Whether this FAQ item is currently displayed
- `sort_order` (integer) - Display order within category

**Validation Rules**:

- `question`, `answer` are required
- `category` must be one of: 'general', 'process', 'costs', 'legal'
- `sort_order` must be non-negative integer

**Relationships**:

- None (content data)

## Database Schema (Supabase)

### Row Level Security (RLS) Policies

**Intake Submissions Table**:

- Users can INSERT new submissions (public access for form submission)
- Admin users can SELECT/UPDATE all submissions

**Lawyers Table**:

- Public SELECT for active lawyers (for display purposes)
- Admin users can INSERT/UPDATE/DELETE lawyers

**Case Types Table**:

- Public SELECT for active case types
- Admin users can INSERT/UPDATE/DELETE case types

**FAQ Items Table**:

- Public SELECT for active FAQ items
- Admin users can INSERT/UPDATE/DELETE FAQ items

### Indexes

**Performance Indexes**:

- `intake_submissions_created_at_idx` - For sorting by submission date
- `intake_submissions_status_idx` - For filtering by status
- `intake_submissions_case_type_idx` - For filtering by case type
- `lawyers_specialties_idx` - For searching by legal specialties
- `faq_items_category_idx` - For filtering FAQ by category

### Triggers

**Audit Trail**:

- `update_updated_at()` - Automatically update updated_at timestamp on any row change
- `log_submission_changes()` - Log changes to intake submissions for audit purposes

## Data Flow

### Intake Form Submission

1. User fills out form on landing page
2. Client-side validation ensures required fields are present
3. Form data is sent to Supabase via API
4. New record created in `intake_submissions` table
5. User receives confirmation message
6. Admin review process begins (manual workflow)

### Lawyer Assignment

1. Admin reviews pending submissions
2. Admin updates submission status to 'reviewed'
3. If accepted, Admin updates status to 'assigned' and sets assigned_lawyer_id
4. Client is contacted by assigned lawyer

### Content Management

1. FAQ items are managed through admin interface
2. Case types are configured through admin interface
3. Lawyer information is maintained through admin interface
4. All content changes are tracked with timestamps

## Security Considerations

### Data Encryption

- All data encrypted at rest (Supabase handles this)
- All data encrypted in transit (HTTPS/TLS)
- Sensitive fields can be encrypted at application level if needed

### Access Control

- RLS policies enforce data access rules
- API keys are environment-specific
- Database access is restricted to application only

### Privacy Compliance

- Personal data is stored securely
- Data retention policies can be implemented
- Right to deletion can be implemented
- Audit trails for data access and changes
