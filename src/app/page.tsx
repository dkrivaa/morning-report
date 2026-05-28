import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

import { apiFetch, ApiException } from "@/lib/api";
import type { ExpenseStatusResponse } from "@/lib/types";
import ExpenseDrawer from "@/components/custom/expenseDrawer"
import DatePicker from "@/components/custom/datePicker"
import ReportDownloads from "@/components/custom/reportDownloads";
import { format } from "date-fns";

interface PageProps {
  searchParams: Promise<{ date?: string }>;
}


export default async function HomePage({ searchParams }: PageProps) {
  // Verify internal JWT
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  const valid = token ? await verifyToken(token) : null;
  if (!valid) redirect("/login");

  const { date: dateParam } = await searchParams; 
  const date = dateParam ?? format(new Date(), "yyyy-MM-dd");
  
  let data: ExpenseStatusResponse = {};
  let error: string | null = null;

  try {
    data = await apiFetch<ExpenseStatusResponse>(`/api/expenses-count?date=${date}`);
  } catch (e) {
    if (e instanceof ApiException) {
      error = e.detail.message;
    } else {
      error = "Unexpected error";
    }
  }


  return (
    <main className="min-h-screen flex flex-col items-center mx-4 mt-12 gap-12">
      <h1 className="text-2xl font-bold mb-4">
        Accountant Reports
      </h1>
      
      <DatePicker 
        paramName="date"/> 

      <ReportDownloads 
        date={date} />
      
      <ExpenseDrawer 
        data={data}
        date={date}/>
    </main>
  )
}
