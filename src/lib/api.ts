/**
 * Global API Service
 * Works with Vite (import.meta.env)
 * Handles:
 * - GET, POST, PUT, PATCH, DELETE
 * - JSON parsing
 * - Error handling
 * - Timeout
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

/* ---------------------------------- */
/* Types */
/* ---------------------------------- */

export type ApiError = {
  message: string;
  status?: number;
  details?: unknown;
};

type RequestOptions = RequestInit & {
  timeout?: number;
};

/* ---------------------------------- */
/* Core Request Function */
/* ---------------------------------- */

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const controller = new AbortController();
  const timeout = options.timeout ?? 10000; // default 10s

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const contentType = response.headers.get("content-type");
    let data: any = null;

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const error: ApiError = {
        message: data?.message || "Something went wrong",
        status: response.status,
        details: data,
      };
      throw error;
    }

    return data as T;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw {
        message: "Request timeout. Please try again.",
      } as ApiError;
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/* ---------------------------------- */
/* Public API Methods */
/* ---------------------------------- */

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, {
      method: "GET",
      ...options,
    }),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    }),

  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    }),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...options,
    }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, {
      method: "DELETE",
      ...options,
    }),
};
