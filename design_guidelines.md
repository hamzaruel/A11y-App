# Accessibility Checker Design Guidelines

## Design Approach
**Utility-Focused Tool Design** - Drawing from Google Lighthouse and WAVE Web Accessibility Evaluation Tool for clean, professional reporting interfaces with excellent information hierarchy and scannable results.

## Color System (User-Specified)
```
Primary: #0066CC (Accessibility Blue)
Success: #28A745 (Green)
Warning: #FFC107 (Amber)
Error: #DC3545 (Red)
Background: #F8F9FA (Light Grey)
Text: #212529 (Dark Grey)
Neutral Grey: #6C757D (for secondary text)
White: #FFFFFF (for cards and containers)
```

**Color Application:**
- Primary (#0066CC): Scan button, active states, links, focus indicators
- Success: Pass indicators, resolved issues badge
- Warning: Moderate severity issues, attention needed
- Error: Critical accessibility violations
- Background: Page background, subtle separators
- Cards: White backgrounds with subtle shadows

## Typography
**Font Stack:** Source Sans Pro (primary), Open Sans (fallback), system sans-serif

**Hierarchy:**
- Page Title: 32px, font-weight 600
- Section Headers: 24px, font-weight 600
- Card Titles: 18px, font-weight 600
- Body Text: 16px, font-weight 400, line-height 1.6
- Helper Text: 14px, font-weight 400, color #6C757D
- Issue Counts: 20px, font-weight 700

## Layout System
**Single-Column, Centered Layout**
- Maximum width: 900px centered
- Base spacing unit: 16px (1rem)
- Use multiples: 8px, 16px, 24px, 32px, 48px

**Sections:**
1. Header with tool branding and description
2. URL Input Section (prominent, centered)
3. Results Summary Cards (horizontal grid when issues found)
4. Detailed Issues List (expandable cards by category)

## Component Library

### URL Input Section
- Large, prominent input field (min 60px height)
- "Scan Website" button (primary color, high contrast)
- Input width: 100% on mobile, 600px on desktop
- Validation states: neutral, loading, error with inline messages

### Summary Cards
- Horizontal grid: 4 cards (Errors, Warnings, Passed, Total Issues)
- Each card: White background, 16px padding, subtle shadow, 8px border-radius
- Large number display (28px) with icon and label
- Color-coded left border (4px): Error/Warning/Success/Neutral

### Issue Category Cards
- Collapsible accordion-style cards
- Header: Issue type, count badge, severity indicator
- Background: White with hover state (#F8F9FA)
- Border-left: 4px colored based on severity
- Padding: 20px
- Border-radius: 8px
- Shadow: 0 2px 4px rgba(0,0,0,0.1)

### Individual Issue Items
- List items within category cards
- Element type badge (e.g., "IMG", "BUTTON")
- Issue description with specific element details
- WCAG guideline reference link
- Code snippet (monospace font, light grey background)

### Status Indicators
- Icons from Heroicons (via CDN)
- Error: X-circle (red)
- Warning: Exclamation-triangle (amber)
- Success: Check-circle (green)
- Info: Information-circle (blue)

### Loading State
- Animated spinner (primary color)
- "Scanning website..." text
- Progress indication if possible

## Spacing & Rhythm
- Section gaps: 48px vertical spacing
- Card gaps: 24px between cards
- Internal card padding: 20px
- Button padding: 12px 24px
- Input padding: 16px

## Accessibility Features (Critical for this tool)
- All interactive elements must have visible focus indicators (2px solid #0066CC outline with 2px offset)
- Color is never the only indicator (use icons + text)
- Minimum touch target: 44x44px
- ARIA labels on all icon-only buttons
- Keyboard navigation: Tab through all interactive elements, Enter to expand/collapse
- Screen reader announcements for scan results

## Interactive States
**Buttons:**
- Default: Primary color background, white text
- Hover: Darken by 10%
- Active: Darken by 20%
- Disabled: 50% opacity, cursor not-allowed

**Cards:**
- Default: White background, subtle shadow
- Hover: Background #F8F9FA, slightly elevated shadow
- Focus: 2px #0066CC outline

**Input:**
- Default: Border #CED4DA
- Focus: Border #0066CC, box-shadow 0 0 0 3px rgba(0,102,204,0.25)
- Error: Border #DC3545, red helper text

## Responsive Behavior
- Mobile (<768px): Single column, full-width cards, stacked summary cards
- Tablet (768px-1024px): 2-column summary grid
- Desktop (>1024px): 4-column summary grid, centered 900px container

## Empty/Error States
- No scan yet: Display helpful instructions with example URL
- No issues found: Large success checkmark, congratulatory message
- Scan error: Clear error message with troubleshooting tips (CORS, invalid URL, etc.)
- Zero results in category: "No [category] found" with subtle grey text

## Key Principles
- Information density balanced with whitespace
- Scannable results with clear visual hierarchy
- Professional, trustworthy appearance (this is a diagnostic tool)
- Every issue clearly actionable with specific details
- High contrast throughout (practicing what we're testing)