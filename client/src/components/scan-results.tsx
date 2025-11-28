import { CheckCircle2, Clock, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SummaryCards } from "./summary-cards";
import { IssueCategory } from "./issue-category";
import type { ScanResult, IssueType, AccessibilityIssue } from "@shared/schema";

interface ScanResultsProps {
  result: ScanResult;
}

export function ScanResults({ result }: ScanResultsProps) {
  const groupedIssues = result.issues.reduce<Record<IssueType, AccessibilityIssue[]>>(
    (acc, issue) => {
      if (!acc[issue.type]) {
        acc[issue.type] = [];
      }
      acc[issue.type].push(issue);
      return acc;
    },
    {} as Record<IssueType, AccessibilityIssue[]>
  );

  const issueTypes: IssueType[] = [
    "missing_alt_text",
    "empty_link",
    "missing_aria_label",
    "heading_hierarchy",
    "keyboard_inaccessible",
    "broken_link",
  ];

  const hasIssues = result.totalIssues > 0;

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="h-4 w-4" aria-hidden="true" />
            <a 
              href={result.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded truncate max-w-xs sm:max-w-md"
              data-testid="link-scanned-url"
            >
              {result.url}
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <time dateTime={result.scannedAt} data-testid="text-scan-time">
              Scanned {new Date(result.scannedAt).toLocaleString()}
            </time>
          </div>
        </div>
        
        <SummaryCards
          errorCount={result.errorCount}
          warningCount={result.warningCount}
          passedCount={result.passedChecks}
          totalIssues={result.totalIssues}
        />
      </div>

      {hasIssues ? (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold" data-testid="text-issues-heading">
            Issues Found
          </h2>
          <div className="flex flex-col gap-4">
            {issueTypes.map((type) => (
              <IssueCategory
                key={type}
                type={type}
                issues={groupedIssues[type] || []}
              />
            ))}
          </div>
        </div>
      ) : (
        <Card className="p-8 text-center" data-testid="card-no-issues">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-success/10">
              <CheckCircle2 className="h-12 w-12 text-success" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold text-success">
                Great job!
              </h2>
              <p className="text-muted-foreground max-w-md">
                No accessibility issues were detected on this page. Your website follows 
                the accessibility best practices we checked for.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
