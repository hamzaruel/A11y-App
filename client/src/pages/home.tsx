import { useState } from "react";
import { Accessibility } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UrlInput } from "@/components/url-input";
import { ScanResults } from "@/components/scan-results";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { useToast } from "@/hooks/use-toast";
import type { ScanResult, ScanMode } from "@shared/schema";

type ScanState = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [lastUrl, setLastUrl] = useState("");
  const [lastMode, setLastMode] = useState<ScanMode>("single");
  const { toast } = useToast();

  const handleScan = async (url: string, mode: ScanMode) => {
    setScanState("loading");
    setErrorMessage("");
    setLastUrl(url);
    setLastMode(mode);

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, mode }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to scan website");
      }

      const result: ScanResult = await response.json();
      setScanResult(result);
      setScanState("success");

      const pagesText = result.pagesScanned && result.pagesScanned > 1 
        ? ` across ${result.pagesScanned} pages` 
        : "";
      
      toast({
        title: "Scan Complete",
        description: result.totalIssues > 0
          ? `Found ${result.totalIssues} accessibility ${result.totalIssues === 1 ? "issue" : "issues"}${pagesText}`
          : `No accessibility issues found${pagesText}!`,
      });
    } catch (error) {
      setScanState("error");
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      setErrorMessage(message);
    }
  };

  const handleRetry = () => {
    if (lastUrl) {
      handleScan(lastUrl, lastMode);
    } else {
      setScanState("idle");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-md" aria-hidden="true">
              <Accessibility className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold leading-tight">AccessiScan</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Web Accessibility Checker</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <section className="text-center flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Check Your Website's Accessibility
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Scan any website for common accessibility issues. Detect missing alt text, 
                empty links, ARIA labels, heading hierarchy problems, and more.
              </p>
            </div>
            
            <div className="pt-4">
              <UrlInput onScan={handleScan} isLoading={scanState === "loading"} />
            </div>
          </section>

          <section aria-live="polite" aria-atomic="true">
            {scanState === "idle" && <EmptyState />}
            {scanState === "loading" && <LoadingState />}
            {scanState === "success" && scanResult && <ScanResults result={scanResult} />}
            {scanState === "error" && <ErrorState message={errorMessage} onRetry={handleRetry} />}
          </section>
        </div>
      </main>

      <footer className="border-t bg-muted/30">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              AccessiScan checks for common WCAG 2.1 accessibility issues.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.w3.org/WAI/WCAG21/quickref/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
                data-testid="link-wcag-reference"
              >
                WCAG 2.1 Reference
              </a>
              <a 
                href="https://www.w3.org/WAI/fundamentals/accessibility-intro/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
                data-testid="link-learn-more"
              >
                Learn About Accessibility
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
