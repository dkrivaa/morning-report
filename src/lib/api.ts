import type { ApiError } from './types';

const BASE_URL = process.env.BACKEND_URL;
const API_SECRET = process.env.API_SECRET;

if (!BASE_URL) throw new Error("Missing env variable: BACKEND_URL");
if (!API_SECRET) throw new Error("Missing env variable: API_SECRET");

const defaultHeaders = {
  'Content-Type': 'application/json',
  'x-api-secret': API_SECRET,
};

export class ApiException extends Error {
  status: number;
  detail: ApiError['detail'];

  constructor(status: number, detail: ApiError['detail']) {
    super(detail.message);
    this.status = status;
    this.detail = detail;
  }
}

async function handleError(res: Response): Promise<never> {
  try {
    const body: ApiError = await res.json();
    throw new ApiException(res.status, body.detail);
  } catch (e) {
    if (e instanceof ApiException) throw e;
    throw new ApiException(res.status, { message: `HTTP error ${res.status}` });
  }
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...defaultHeaders, ...options?.headers },
    cache: 'no-store',
  });
  if (!res.ok) await handleError(res);
  return res.json() as Promise<T>;
}

export async function apiStream(path: string): Promise<Response> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: defaultHeaders,
    cache: 'no-store',
  });
  if (!res.ok) await handleError(res);
  return res;
}