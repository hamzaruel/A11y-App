import { ScanSearch, CheckCircle2, AlertTriangle, Accessibility } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: ScanSearch,
    title: "Missing Alt Text",
    description: "Detect images without alternative text",
  },
  {
    icon: AlertTriangle,
    title: "Empty Links",
    description: "Find links without accessible text",
  },
  {
    icon: CheckCircle2,
    title: "ARIA Labels",
    description: "Check for missing ARIA attributes",
  },
  {
    icon: Accessibility,
    title: "Heading Order",
    description: "Validate heading hierarchy",
  },
];

export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto" data-testid="container-empty-state">
      <Card className="p-8 text-center w-full">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-primary/10">
            <ScanSearch className="h-12 w-12 text-primary" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">
              Enter a URL to get started
            </h2>
            <p className="text-muted-foreground">
              Scan any website to check for common accessibility issues and WCAG compliance
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4 w-full">
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className="p-4 hover-elevate"
            data-testid={`card-feature-${index}`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-md bg-primary/10 shrink-0">
                <feature.icon className="h-4 w-4 text-primary" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <h3 className="font-medium text-sm">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground max-w-md">
        <p>
          This tool checks for common WCAG 2.1 accessibility issues. For a comprehensive 
          audit, consider professional accessibility testing services.
        </p>
      </div>
    </div>
  );
}
