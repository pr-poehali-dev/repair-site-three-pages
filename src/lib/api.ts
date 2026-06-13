import func2url from "../../backend/func2url.json";

export const AUTH_URL = func2url.auth;
export const OBJECTS_URL = func2url.objects;
export const REQUESTS_URL = func2url.requests;
export const CHAT_URL = func2url.chat;

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: "client" | "foreman" | "admin";
}

export interface BuildObject {
  id: number;
  title: string;
  address: string;
  description: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  foreman_id: number | null;
  client_id: number | null;
  foreman_name: string | null;
  client_name: string | null;
  client_email: string | null;
}

export interface ObjectDoc {
  id: number;
  doc_type: string;
  title: string;
  comment: string;
  file_url: string;
  created_at: string;
  uploaded_by: string | null;
}

export const STATUS_LABELS: Record<string, string> = {
  in_progress: "В работе",
  planned: "Запланирован",
  done: "Завершён",
  paused: "Приостановлен",
};

export function formatDate(d: string | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("ru-RU");
}

export function getToken(): string {
  return localStorage.getItem("auth_token") || "";
}

export function setToken(token: string) {
  localStorage.setItem("auth_token", token);
}

export function clearToken() {
  localStorage.removeItem("auth_token");
}

function authHeaders(extra?: Record<string, string>): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "X-Auth-Token": getToken(),
    ...extra,
  };
}

export function getManagerPwd(): string {
  return sessionStorage.getItem("admin_pwd") || "";
}

export function getManagerLogin(): string {
  return sessionStorage.getItem("admin_login") || "";
}

export function managerHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "X-Manager-Login": getManagerLogin(),
    "X-Manager-Password": getManagerPwd(),
  };
}

export async function api<T = Record<string, unknown>>(
  url: string,
  action: string,
  method: "GET" | "POST" = "GET",
  body?: Record<string, unknown>,
  extraQuery?: Record<string, string>,
  extraHeaders?: Record<string, string>
): Promise<{ ok: boolean; status: number; data: T }> {
  const qs = new URLSearchParams({ action, ...(extraQuery || {}) }).toString();
  const res = await fetch(`${url}?${qs}`, {
    method,
    headers: authHeaders(extraHeaders),
    body: method === "POST" ? JSON.stringify(body || {}) : undefined,
  });
  let data: T = {} as T;
  try {
    data = (await res.json()) as T;
  } catch {
    /* noop */
  }
  return { ok: res.ok, status: res.status, data };
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}