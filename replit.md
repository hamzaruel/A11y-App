# AccessiScan - Web Accessibility Checker

## Overview

AccessiScan is a web-based accessibility scanning tool that analyzes websites for common WCAG (Web Content Accessibility Guidelines) compliance issues. The application allows users to enter a URL and receive a detailed report of accessibility violations including missing alt text, empty links, improper ARIA labels, heading hierarchy problems, and keyboard accessibility issues.

The tool follows a utility-focused design approach inspired by Google Lighthouse and WAVE Web Accessibility Evaluation Tool, providing clean, professional reporting interfaces with excellent information hierarchy.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**Routing**: wouter (lightweight React router)

**State Management**: 
- TanStack React Query for server state management
- Local React state for UI state management

**UI Component Library**: 
- Radix UI primitives for accessible, unstyled components
- shadcn/ui component system (New York style variant)
- Tailwind CSS for styling with custom design tokens

**Design System**:
- Custom color palette focused on accessibility (Primary: #0066CC, Success: #28A745, Warning: #FFC107, Error: #DC3545)
- Typography using Source Sans Pro and Open Sans font families
- Single-column, centered layout with 900px maximum width
- Consistent spacing system using 8px base unit multiples
- HSL-based CSS variables for theme customization supporting both light and dark modes

**Key UI Patterns**:
- Progressive disclosure through accordion components for issue details
- Loading states with simulated scan progress
- Empty states with feature highlights
- Error states with troubleshooting tips
- Toast notifications for user feedback

### Backend Architecture

**Framework**: Express.js with TypeScript

**Server Setup**:
- HTTP server created with Node's built-in `http` module
- Custom middleware for JSON parsing with raw body preservation
- Request/response logging middleware with timestamp formatting
- Static file serving for production builds

**API Structure**:
- RESTful endpoint: POST `/api/scan` for website accessibility scanning
- Request validation using Zod schemas
- Comprehensive error handling with user-friendly error messages for various failure scenarios (CORS blocks, timeouts, DNS errors, SSL issues)

**Accessibility Scanning Engine**:
- Custom HTML parser that extracts images, links, buttons, headings, forms, and inputs
- Rule-based accessibility checks including:
  - Missing alt text on images
  - Empty links without accessible text
  - Missing ARIA labels on interactive elements
  - Heading hierarchy validation
  - Keyboard accessibility issues
  - Broken link detection
- Each issue categorized by type and severity (error vs warning)
- WCAG reference links provided for each issue type

**Development vs Production**:
- Vite development server integration with HMR support
- Separate build process bundling server code with esbuild
- Static asset serving for production builds

### Data Storage Solutions

**Current Implementation**: In-memory storage using Map-based data structures

**Storage Interface**: Defined `IStorage` interface with methods for user CRUD operations (getUser, getUserByUsername, createUser)

**Database Configuration**: 
- Drizzle ORM configured with PostgreSQL dialect
- Connection configured via `DATABASE_URL` environment variable
- Neon Database serverless driver (@neondatabase/serverless)
- Migration files managed in `./migrations` directory
- Schema defined in `./shared/schema.ts`

**Note**: The database setup is configured but not actively used in the current scan functionality. User management infrastructure exists but authentication is not implemented in the scanning workflow.

### External Dependencies

**Core Frontend Libraries**:
- React 18+ with TypeScript
- TanStack React Query for data fetching
- Radix UI component primitives (accordion, dialog, toast, etc.)
- Tailwind CSS with custom configuration
- wouter for client-side routing
- React Hook Form with Zod resolvers for form validation

**Core Backend Libraries**:
- Express.js for HTTP server
- Zod for runtime type validation and schema definition
- Drizzle ORM for database operations
- @neondatabase/serverless for PostgreSQL connectivity

**Build Tools**:
- Vite for frontend development and building
- esbuild for server-side bundling
- tsx for TypeScript execution
- PostCSS with Tailwind CSS and Autoprefixer

**Development Dependencies**:
- @replit/vite-plugin-runtime-error-modal for error overlay
- @replit/vite-plugin-cartographer for Replit integration
- @replit/vite-plugin-dev-banner for development environment indicator

**Font Resources**: 
- Google Fonts (Source Sans 3, Open Sans, Source Code Pro)

**Third-Party Services**:
- None currently integrated (scanning is performed server-side without external API calls)

**Potential Integrations** (based on dependencies but not actively used):
- Stripe for payments
- OpenAI API
- Google Generative AI
- Nodemailer for email
- Passport.js for authentication
- WebSocket support via `ws` package