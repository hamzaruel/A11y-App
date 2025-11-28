import { useState } from "react";
import { Search, Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UrlInputProps {
  onScan: (url: string) => void;
  isLoading: boolean;
}

export function UrlInput({ onScan, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const validateUrl = (input: string): boolean => {
    try {
      let urlToTest = input.trim();
      if (!urlToTest.startsWith("http://") && !urlToTest.startsWith("https://")) {
        urlToTest = "https://" + urlToTest;
      }
      new URL(urlToTest);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!url.trim()) {
      setError("Please enter a website URL");
      return;
    }
    
    if (!validateUrl(url)) {
      setError("Please enter a valid URL (e.g., example.com or https://example.com)");
      return;
    }
    
    let finalUrl = url.trim();
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = "https://" + finalUrl;
    }
    
    onScan(finalUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-3">
        <div className="relative flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter website URL (e.g., example.com)"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError("");
              }}
              className="pl-12 h-14 text-base border-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
              disabled={isLoading}
              aria-label="Website URL to scan"
              aria-invalid={!!error}
              aria-describedby={error ? "url-error" : undefined}
              data-testid="input-url"
            />
          </div>
          <Button 
            type="submit" 
            size="lg"
            className="h-14 px-8 text-base font-semibold gap-2"
            disabled={isLoading}
            data-testid="button-scan"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                Scan Website
              </>
            )}
          </Button>
        </div>
        
        {error && (
          <p 
            id="url-error" 
            className="text-sm text-destructive flex items-center gap-2"
            role="alert"
            data-testid="text-url-error"
          >
            <span className="inline-block w-1 h-1 rounded-full bg-destructive" aria-hidden="true" />
            {error}
          </p>
        )}
        
        <p className="text-sm text-muted-foreground text-center">
          Try scanning any website to check for accessibility issues
        </p>
      </div>
    </form>
  );
}
