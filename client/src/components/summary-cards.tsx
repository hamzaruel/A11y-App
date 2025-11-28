import { AlertCircle, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SummaryCardsProps {
  errorCount: number;
  warningCount: number;
  passedCount: number;
  totalIssues: number;
}

export function SummaryCards({ errorCount, warningCount, passedCount, totalIssues }: SummaryCardsProps) {
  const cards = [
    {
      id: "errors",
      label: "Errors",
      count: errorCount,
      icon: AlertCircle,
      accentColor: "bg-error",
      iconColor: "text-error",
      bgColor: "bg-error/5 dark:bg-error/10",
    },
    {
      id: "warnings",
      label: "Warnings",
      count: warningCount,
      icon: AlertTriangle,
      accentColor: "bg-warning",
      iconColor: "text-warning",
      bgColor: "bg-warning/5 dark:bg-warning/10",
    },
    {
      id: "passed",
      label: "Passed",
      count: passedCount,
      icon: CheckCircle,
      accentColor: "bg-success",
      iconColor: "text-success",
      bgColor: "bg-success/5 dark:bg-success/10",
    },
    {
      id: "total",
      label: "Total Checks",
      count: totalIssues + passedCount,
      icon: BarChart3,
      accentColor: "bg-primary",
      iconColor: "text-primary",
      bgColor: "bg-primary/5 dark:bg-primary/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards.map((card) => (
        <Card
          key={card.id}
          className={`relative ${card.bgColor} p-4 hover-elevate`}
          data-testid={`card-summary-${card.id}`}
        >
          <div className={`absolute top-3 left-3 w-1 h-8 ${card.accentColor} rounded-full`} aria-hidden="true" />
          <div className="flex items-start justify-between gap-2 pl-3">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
              <p className="text-3xl font-bold tabular-nums" data-testid={`text-count-${card.id}`}>
                {card.count}
              </p>
            </div>
            <div className={`p-2 rounded-md ${card.bgColor}`}>
              <card.icon className={`h-5 w-5 ${card.iconColor}`} aria-hidden="true" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
