import { AlertCircle, RefreshCw, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const troubleshootingTips = [
    {
      icon: Globe,
      tip: "Make sure the URL is correct and the website is accessible",
    },
    {
      icon: Shield,
      tip: "Some websites block automated scanning for security reasons",
    },
    {
      icon: RefreshCw,
      tip: "Try again in a few moments if the site is temporarily unavailable",
    },
  ];

  return (
    <Card className="relative p-8 w-full max-w-2xl mx-auto" data-testid="card-error">
      <div className="absolute top-4 left-4 w-1 h-10 bg-destructive rounded-full" aria-hidden="true" />
      <div className="flex flex-col items-center gap-6 text-center pl-3">
        <div className="p-4 rounded-full bg-destructive/10">
          <AlertCircle className="h-10 w-10 text-destructive" aria-hidden="true" />
        </div>
        
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Unable to Scan Website</h2>
          <p className="text-muted-foreground" data-testid="text-error-message">
            {message}
          </p>
        </div>

        <div className="w-full bg-muted/50 rounded-md p-4">
          <h3 className="text-sm font-medium mb-3 text-left">Troubleshooting Tips:</h3>
          <ul className="flex flex-col gap-2">
            {troubleshootingTips.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-left">
                <item.icon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-muted-foreground">{item.tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button onClick={onRetry} className="gap-2" data-testid="button-retry">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Try Again
        </Button>
      </div>
    </Card>
  );
}
