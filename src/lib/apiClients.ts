import type { HttpMethod } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiClientOptions<TBody = unknown> {
  method: HttpMethod;
  endpoint: string;
  body?: TBody;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  isPublic?: boolean; // To bypass token for public routes like login/signup
}

export async function apiClient<TResponse, TBody = unknown>(
  options: ApiClientOptions<TBody>
): Promise<TResponse> {
  const {
    method,
    endpoint,
    body,
    params,
    headers: customHeaders,
    isPublic = false,
  } = options;

  let url = `${API_BASE_URL}${endpoint}`;

  if (params) {
    // Filter out undefined or null params
    const definedParams: Record<string, string> = {};
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const value = params[key];
        if (value !== undefined && value !== null) {
          definedParams[key] = String(value);
        }
      }
    }
    if (Object.keys(definedParams).length > 0) {
      const queryParams = new URLSearchParams(definedParams);
      url = `${url}?${queryParams.toString()}`;
    }
  }

  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  if (!isPublic) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    } else if (method !== "GET" && method !== "HEAD") {
      // For non-public, non-GET requests, a token is generally expected.
      // Depending on app strategy, could throw error or let backend handle missing token.
      console.warn(
        `API call to ${endpoint} without token for a non-public, non-GET request.`
      );
    }
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (
    body &&
    (method === "POST" ||
      method === "PUT" ||
      method === "PATCH" ||
      method === "DELETE")
  ) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  if (response.status === 204) {
    // No Content
    return null as unknown as TResponse;
  }

  // Try to parse JSON, but handle cases where response might not be JSON (e.g., unexpected errors)
  let data;
  try {
    data = await response.json();
  } catch (e) {
    // If parsing fails and response is not ok, throw an error with status text
    if (!response.ok) {
      throw new Error(
        response.statusText ||
          `Request failed with status ${response.status} and non-JSON response`
      );
    }
    // If parsing fails but response is ok (e.g. 200 with non-JSON body unexpectedly), might be an issue
    // Or it might be an expected non-JSON success response (e.g. text/plain)
    // For this client, we assume JSON or 204.
    console.error("API response was not valid JSON", e);
    throw new Error("Invalid JSON response from server.");
  }

  if (!response.ok) {
    const errorMessage =
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }
  return data as TResponse;
}
