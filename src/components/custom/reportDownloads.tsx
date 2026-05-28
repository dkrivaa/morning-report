"use client";

import { useState } from "react";
import OtherExpenses from "@/components/custom/otherExpenses";

interface Props {
  date: string;
}

type ReportType = "expenses" | "income";

export interface OtherExpensesData {
  [supplier: string]: number;
}

const REPORTS: Record<ReportType, { path: string; filename: string; label: string }> = {
  expenses: {
    path: "/api/report/expenses-pdf",
    filename: "expenses.pdf",
    label: "Download Expenses PDF",
  },
  income: {
    path: "/api/report/income-pdf",
    filename: "income.pdf",
    label: "Download Income PDF",
  },
};

export default function ReportDownloads({ date }: Props) {
  const [loading, setLoading] = useState<ReportType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [otherExpenses, setOtherExpenses] = useState<OtherExpensesData | null>(null);

  async function handleDownload(type: ReportType) {
    setError(null);
    setLoading(type);
    try {
      const { path, filename } = REPORTS[type];
      const res = await fetch(`${path}?date=${date}`);

        if (!res.ok) {
            const body = await res.json();
            const message = body?.detail?.message ?? `Failed to download ${type} report`;
            const error = body?.detail?.error;
            throw new Error(error ? `${message}: ${error}` : message);
        }

      // Capture X-Other-Expenses before consuming the body
      if (type === "expenses") {
        const encoded = res.headers.get('X-Other-Expenses') ?? '';
        
        if (encoded) {
          try {
            const bytes = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
            const decoded = new TextDecoder('utf-8').decode(bytes);
            setOtherExpenses(JSON.parse(decoded));
          } catch (e) {
            console.log("Parse error:", e);  // make catch visible
            // malformed header — ignore
          }
        }
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {(Object.keys(REPORTS) as ReportType[]).map((type) => (
          <button
            key={type}
            onClick={() => handleDownload(type)}
            disabled={!!loading}
            className="text-sm"
          >
            {loading === type ? "Generating…" : REPORTS[type].label}
          </button>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {otherExpenses && <OtherExpenses data={otherExpenses} />}
    </div>
  );
}