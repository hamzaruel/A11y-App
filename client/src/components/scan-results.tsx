import { useState } from "react";
import { CheckCircle2, Clock, Globe, FileText, Layers, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SummaryCards } from "./summary-cards";
import { IssueCategory } from "./issue-category";
import type { ScanResult, IssueType, AccessibilityIssue, PageResult } from "@shared/schema";

interface ScanResultsProps {
  result: ScanResult;
}

function getPathFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.pathname || "/";
  } catch {
    return url;
  }
}

function PageResultCard({ pageResult, index }: { pageResult: PageResult; index: number }) {
  const groupedIssues = pageResult.issues.reduce<Record<IssueType, AccessibilityIssue[]>>(
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

  const pathname = getPathFromUrl(pageResult.url);

  return (
    <AccordionItem value={`page-${index}`}>
      <AccordionTrigger 
        className="hover:no-underline px-4 py-3"
        data-testid={`trigger-page-${index}`}
      >
        <div className="flex items-center justify-between w-full pr-4 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="font-medium truncate" title={pageResult.url}>
              {pathname}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {pageResult.errorCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {pageResult.errorCount} {pageResult.errorCount === 1 ? "error" : "errors"}
              </Badge>
            )}
            {pageResult.warningCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {pageResult.warningCount} {pageResult.warningCount === 1 ? "warning" : "warnings"}
              </Badge>
            )}
            {pageResult.totalIssues === 0 && (
              <Badge className="bg-success text-success-foreground text-xs">
                No issues
              </Badge>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <a 
              href={pageResult.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary hover:underline"
            >
              <span className="truncate max-w-md">{pageResult.url}</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          </div>
          
          {pageResult.totalIssues > 0 ? (
            <div className="flex flex-col gap-3">
              {issueTypes.map((type) => {
                const issues = groupedIssues[type] || [];
                if (issues.length === 0) return null;
                return (
                  <IssueCategory
                    key={type}
                    type={type}
                    issues={issues}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-success p-3 bg-success/5 rounded-md">
              <CheckCircle2 className="h-5 w-5" />
              <span>No accessibility issues found on this page</span>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function ScanResults({ result }: ScanResultsProps) {
  const [activeTab, setActiveTab] = useState("all");
  
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
  const hasMultiplePages = result.scanMode === "full" && 
    result.pageResults && 
    result.pageResults.length > 1;

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
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
            {result.pagesScanned && result.pagesScanned > 1 && (
              <Badge variant="outline" className="gap-1" data-testid="badge-pages-scanned">
                <Layers className="h-3 w-3" />
                {result.pagesScanned} pages scanned
              </Badge>
            )}
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
        hasMultiplePages && result.pageResults ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md" data-testid="tabs-view-mode">
              <TabsTrigger value="all" className="gap-2" data-testid="tab-all-issues">
                <Layers className="h-4 w-4" />
                All Issues
              </TabsTrigger>
              <TabsTrigger value="pages" className="gap-2" data-testid="tab-by-page">
                <FileText className="h-4 w-4" />
                By Page
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold" data-testid="text-issues-heading">
                  All Issues ({result.totalIssues})
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
            </TabsContent>
            
            <TabsContent value="pages" className="mt-6">
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold" data-testid="text-pages-heading">
                  Issues by Page ({result.pagesScanned} pages)
                </h2>
                <Card>
                  <Accordion type="single" collapsible className="w-full">
                    {result.pageResults.map((pageResult, index) => (
                      <PageResultCard
                        key={pageResult.url}
                        pageResult={pageResult}
                        index={index}
                      />
                    ))}
                  </Accordion>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
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
        )
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
                No accessibility issues were detected{result.pagesScanned && result.pagesScanned > 1 ? ` across ${result.pagesScanned} pages` : " on this page"}. 
                Your website follows the accessibility best practices we checked for.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
