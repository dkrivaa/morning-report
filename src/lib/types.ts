export type ExpenseStats = {
    expected: number | null
    actual: number
    missing: number
}

export type ExpenseStatusResponse = Record<string, ExpenseStats>


// FastAPI error shape
export type ApiError = {
  detail: {
    message: string;
    upstream_status?: number;
    upstream_body?: string;
    error?: string;
  }
}