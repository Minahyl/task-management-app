import type {
  LoginResponse,
  RegisterResponse,
  User,
} from "@/types/user";

import type {
  Task,
  TaskPayload,
  TaskStatus,
} from "@/types/task";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = "Something went wrong.";

    try {
      const errorData = await response.json();

      if (typeof errorData.detail === "string") {
        message = errorData.detail;
      }
    } catch {
      // Keep default message
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// ==============================
// AUTH
// ==============================

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<RegisterResponse> {
  return request<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ==============================
// TASKS
// ==============================

export async function getTasks(
  search?: string,
  status?: TaskStatus | ""
): Promise<Task[]> {
  const params = new URLSearchParams();

  if (search?.trim()) {
    params.set("search", search.trim());
  }

  if (status) {
    params.set("status", status);
  }

  const queryString = params.toString();

  return request<Task[]>(
    `/tasks${queryString ? `?${queryString}` : ""}`
  );
}

export async function createTask(
  data: TaskPayload
): Promise<Task> {
  return request<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTask(
  taskId: number,
  data: TaskPayload
): Promise<Task> {
  return request<Task>(`/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteTask(
  taskId: number
): Promise<void> {
  return request<void>(`/tasks/${taskId}`, {
    method: "DELETE",
  });
}