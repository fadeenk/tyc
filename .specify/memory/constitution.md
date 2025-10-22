# TYC Constitution

<!-- Sync Impact Report: Version 1.0.0 | Initial constitution creation | Added: Clean Code, Simple UX, Responsive Design, Minimal Dependencies, No Testing, Nuxt + Nuxt UI v4 principles -->

## Core Principles

### I. Clean Code (NON-NEGOTIABLE)

Code MUST be readable, maintainable, and self-documenting. Functions and components MUST be small, focused, and follow DRY principles. Use meaningful names, avoid deep nesting, and maintain consistent formatting. Helper methods and utility functions MUST be extracted for reusability.

### II. Simple User Experience

User interfaces MUST prioritize simplicity and intuitive navigation. Every interaction MUST have a clear purpose and minimal cognitive load. Avoid feature bloat and unnecessary complexity. User flows MUST be streamlined with minimal steps to complete tasks.

### III. Responsive Design

All interfaces MUST be fully responsive across desktop, tablet, and mobile devices. Use mobile-first approach with progressive enhancement. Layouts MUST adapt gracefully to different screen sizes without horizontal scrolling or content cutoff.

### IV. Sleek UI with Minimal Dependencies

User interfaces MUST be visually appealing with modern, clean aesthetics. Dependencies MUST be kept to an absolute minimum - only essential packages are permitted. Each dependency MUST be justified and regularly audited for necessity.

### V. No Testing Policy (NON-NEGOTIABLE)

Absolutely NO testing frameworks, unit tests, integration tests, or end-to-end tests are permitted. Code quality MUST be maintained through clean code principles, code reviews, and manual verification. This policy is non-negotiable and applies to all project phases.

### VI. Nuxt Framework with Nuxt UI v4

All development MUST use Nuxt 4+ as the primary framework. UI components MUST be built using Nuxt UI v4 exclusively. Leverage Nuxt's built-in features for routing, SSR, and performance optimization. Follow Nuxt best practices and conventions.

## Technology Stack Requirements

- **Framework**: Nuxt 4+ (latest stable)
- **UI Library**: Nuxt UI v4 exclusively
- **Styling**: Tailwind CSS (via Nuxt UI)
- **TypeScript**: Required for type safety
- **Package Manager**: npm or pnpm
- **Deployment**: Static generation preferred

## Development Workflow

- All code MUST follow the clean code principles
- Components MUST be reusable and composable
- Use TypeScript for all new code
- Implement responsive design from the start
- Dependancies MUST be approved before installation
- Code reviews MUST verify constitution compliance

## Governance

This constitution supersedes all other development practices. Amendments require:

- Documentation of rationale
- Migration plan for existing code
- Version increment following semantic versioning

All development MUST comply with these principles. Non-compliance is not acceptable. Use this constitution as the primary guidance for all development decisions.

**Version**: 1.0.0 | **Ratified**: 2025-01-27 | **Last Amended**: 2025-01-27
