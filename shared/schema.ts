import { z } from "zod";

export const issueTypeSchema = z.enum([
  "missing_alt_text",
  "empty_link",
  "missing_aria_label",
  "heading_hierarchy",
  "keyboard_inaccessible",
  "broken_link",
]);

export type IssueType = z.infer<typeof issueTypeSchema>;

export const severitySchema = z.enum(["error", "warning"]);
export type Severity = z.infer<typeof severitySchema>;

export const accessibilityIssueSchema = z.object({
  id: z.string(),
  type: issueTypeSchema,
  severity: severitySchema,
  element: z.string(),
  description: z.string(),
  wcagReference: z.string(),
  codeSnippet: z.string(),
});

export type AccessibilityIssue = z.infer<typeof accessibilityIssueSchema>;

export const scanResultSchema = z.object({
  url: z.string().url(),
  scannedAt: z.string(),
  totalIssues: z.number(),
  errorCount: z.number(),
  warningCount: z.number(),
  passedChecks: z.number(),
  issues: z.array(accessibilityIssueSchema),
});

export type ScanResult = z.infer<typeof scanResultSchema>;

export const scanRequestSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

export type ScanRequest = z.infer<typeof scanRequestSchema>;

export const issueTypeInfo: Record<IssueType, { label: string; description: string }> = {
  missing_alt_text: {
    label: "Missing Alt Text",
    description: "Images without alternative text are inaccessible to screen reader users",
  },
  empty_link: {
    label: "Empty Links",
    description: "Links without text content make navigation difficult for screen readers",
  },
  missing_aria_label: {
    label: "Missing ARIA Labels",
    description: "Interactive elements without accessible names are hard to identify",
  },
  heading_hierarchy: {
    label: "Heading Hierarchy",
    description: "Incorrect heading order makes page structure confusing for assistive technologies",
  },
  keyboard_inaccessible: {
    label: "Keyboard Navigation",
    description: "Elements that cannot receive focus block keyboard-only users",
  },
  broken_link: {
    label: "Broken Links",
    description: "Links that lead nowhere create a poor user experience",
  },
};
