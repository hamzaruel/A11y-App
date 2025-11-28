import { Loader2, Search, FileSearch, CheckSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

const scanSteps = [
  { icon: Search, label: "Fetching website content..." },
  { icon: FileSearch, label: "Analyzing page structure..." },
  { icon: CheckSquare, label: "Checking accessibility issues..." },
];

export function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < scanSteps.length - 1 ? prev + 1 : prev));
    }, 1500);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 400);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const CurrentIcon = scanSteps[currentStep].icon;

  return (
    <Card className="p-8 w-full max-w-2xl mx-auto" data-testid="card-loading">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
          <div className="relative p-4 bg-primary/10 rounded-full">
            <Loader2 className="h-10 w-10 text-primary animate-spin" aria-hidden="true" />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-xl font-semibold">Scanning Website</h2>
          <p className="text-muted-foreground" aria-live="polite">
            {scanSteps[currentStep].label}
          </p>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-2">
          <Progress value={progress} className="h-2" aria-label="Scan progress" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{Math.round(progress)}%</span>
            <span>Please wait...</span>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          {scanSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div
                key={index}
                className={`flex items-center gap-2 transition-opacity duration-300 ${
                  isActive ? "opacity-100" : isCompleted ? "opacity-60" : "opacity-30"
                }`}
              >
                <div className={`p-2 rounded-full ${
                  isActive ? "bg-primary/10" : isCompleted ? "bg-success/10" : "bg-muted"
                }`}>
                  <StepIcon 
                    className={`h-4 w-4 ${
                      isActive ? "text-primary" : isCompleted ? "text-success" : "text-muted-foreground"
                    }`} 
                    aria-hidden="true"
                  />
                </div>
                {index < scanSteps.length - 1 && (
                  <div className={`w-8 h-0.5 ${
                    isCompleted ? "bg-success" : "bg-muted"
                  }`} aria-hidden="true" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
