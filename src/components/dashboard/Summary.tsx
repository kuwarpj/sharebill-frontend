import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAPI } from "@/lib/apiClient";
import Routes from "@/config/apiConstants";
import { ArrowRightLeft, IndianRupee } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const SUMMARY_LABELS = {
  totalGroups: { label: "Total Groups", color: "text-neutral-700" },
  totalOwed: { label: "You Owe", color: "text-red-600" },
  totalLent: { label: "You Lent", color: "text-green-600" },
  netBalance: { label: "Net Balance", color: "text-blue-600" },
  status: {
    label: "Status",
    labelMap: {
      fully_settled: "Fully Settled",
      owes_you: "Owes You",
      you_owe: "You Owe",
    },
    colorMap: {
      fully_settled: "text-green-600",
      owes_you: "text-yellow-600",
      you_owe: "text-red-600",
    },
  },
};

const Summary = () => {
  const [summaryData, setSummaryData] = useState<any>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const data = await fetchAPI(Routes.DASHBOARD_SUMMARY, "GET");
      if (data?.success) {
        setSummaryData(data?.data?.overallSummary || {});
      }
    };
    fetchSummary();
  }, []);

  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight mb-4">
        Your Overview
      </h2>
      <div className="grid gap-4 md:grid-cols-5">
        {Object.entries(summaryData || {}).map(([key, value]) => {
          const config = SUMMARY_LABELS[key as keyof typeof SUMMARY_LABELS];
          const displayValue =
            key === "status"
              ? (config as any)?.labelMap?.[value as string] || value
              : key === "totalGroups"
              ? value
              : `${formatCurrency(value as number)}`;

          const colorClass =
            key === "status"
              ? (config as any)?.colorMap?.[value as string] ||
                "text-muted-foreground"
              : (config as any)?.color || "text-muted-foreground";

          return (
            <Card key={key} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {config?.label || key}
                </CardTitle>
                {key === "netBalance" && (
                  <ArrowRightLeft className="h-5 w-5 text-primary" />
                )}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${colorClass}`}>
                  {displayValue}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default Summary;
