import { AlertCircle, AlertTriangle, ExternalLink, Code } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { AccessibilityIssue, IssueType, Severity } from "@shared/schema";
import { issueTypeInfo } from "@shared/schema";

interface IssueCategoryProps {
  type: IssueType;
  issues: AccessibilityIssue[];
}

const getSeverityConfig = (severity: Severity) => {
  return severity === "error"
    ? {
        icon: AlertCircle,
        accentColor: "bg-error",
        badgeVariant: "destructive" as const,
        iconColor: "text-error",
      }
    : {
        icon: AlertTriangle,
        accentColor: "bg-warning",
        badgeVariant: "secondary" as const,
        iconColor: "text-warning",
      };
};

const getElementBadge = (element: string) => {
  const tagMatch = element.match(/^<(\w+)/);
  return tagMatch ? tagMatch[1].toUpperCase() : "ELEMENT";
};

export function IssueCategory({ type, issues }: IssueCategoryProps) {
  if (issues.length === 0) return null;

  const info = issueTypeInfo[type];
  const severity = issues[0].severity;
  const config = getSeverityConfig(severity);
  const SeverityIcon = config.icon;

  return (
    <Card 
      className="relative overflow-visible"
      data-testid={`card-category-${type}`}
    >
      <div className={`absolute top-4 left-4 w-1 h-8 ${config.accentColor} rounded-full`} aria-hidden="true" />
      <Accordion type="single" collapsible defaultValue={type}>
        <AccordionItem value={type} className="border-none">
          <AccordionTrigger 
            className="px-5 py-4 hover:no-underline hover-elevate rounded-t-md group pl-8"
            data-testid={`trigger-category-${type}`}
          >
            <div className="flex items-center gap-3 flex-1 text-left">
              <SeverityIcon className={`h-5 w-5 ${config.iconColor} shrink-0`} aria-hidden="true" />
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-base">{info.label}</span>
                  <Badge 
                    variant={config.badgeVariant}
                    className="text-xs font-medium"
                    data-testid={`badge-count-${type}`}
                  >
                    {issues.length} {issues.length === 1 ? "issue" : "issues"}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">{info.description}</span>
              </div>
            </div>
          </AccordionTrigger>
          
          <AccordionContent className="px-5 pb-4 pl-8">
            <div className="flex flex-col gap-3 pt-2">
              {issues.map((issue, index) => (
                <div
                  key={issue.id}
                  className="bg-muted/50 rounded-md p-4 flex flex-col gap-3"
                  data-testid={`issue-item-${type}-${index}`}
                >
                  <div className="flex flex-wrap items-start gap-2">
                    <Badge variant="outline" className="font-mono text-xs shrink-0">
                      {getElementBadge(issue.element)}
                    </Badge>
                    <p className="text-sm flex-1 min-w-0">{issue.description}</p>
                  </div>
                  
                  <div className="bg-card border rounded-md p-3 font-mono text-xs overflow-x-auto">
                    <div className="flex items-start gap-2">
                      <Code className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
                      <code className="text-foreground whitespace-pre-wrap break-all">
                        {issue.codeSnippet}
                      </code>
                    </div>
                  </div>
                  
                  <a
                   href="https://www.w3.org/TR/WCAG22/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded w-fit"
                    data-testid={`link-wcag-${type}-${index}`}
                  >
                    <span>WCAG: {issue.wcagReference}</span>
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    <span className="sr-only">(opens in new tab)</span>
                  </a>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
