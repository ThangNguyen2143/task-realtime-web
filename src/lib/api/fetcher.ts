import { parseErrorResponse, normalizeUnknownError } from "./error-handler";
import { onRequest, onResponse } from "./interceptors";
import { refreshAccessToken } from "./refresh-token";

export type ResponseData<T> = {
  code: number;
  status: boolean;
  message: string;
  value: T;
};

type FetcherOptions = RequestInit & {
  retry?: boolean;
  auth?: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function rawFetch<T>(
  endpoint: string,
  options: FetcherOptions = {},
): Promise<ResponseData<T>> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

  const { retry = true, auth = true, ...init } = options;

  let request = await onRequest(url, init);

  if (!auth) {
    const headers = new Headers(request.init.headers || {});
    headers.delete("Authorization");

    request = {
      ...request,
      init: {
        ...request.init,
        headers,
      },
    };
  }

  console.log("url fetch: ", request.url);
  const response = await fetch(request.url, request.init);
  await onResponse(response, request);

  if (response.status === 401 && auth && retry) {
    const newToken = await refreshAccessToken();

    if (newToken) {
      const retryHeaders = new Headers(request.init.headers || {});
      retryHeaders.set("Authorization", `Bearer ${newToken}`);

      const retryResponse = await fetch(request.url, {
        ...request.init,
        headers: retryHeaders,
      });

      if (!retryResponse.ok) {
        throw await parseErrorResponse(retryResponse);
      }
      const result = (await retryResponse.json()) as ResponseData<T>;
      console.log(result);
      return result;
    }
  }

  if (!response.ok) {
    console.log("Response raw:", response);
    throw await parseErrorResponse(response);
  }
  const result = (await response.json()) as ResponseData<T>;
  console.log(result);
  return result;
}

export async function fetcher<T>(
  endpoint: string,
  options: FetcherOptions = {},
): Promise<ResponseData<T>> {
  try {
    return await rawFetch<T>(endpoint, options);
  } catch (error) {
    throw normalizeUnknownError(error);
  }
}

export const api = {
  get<T>(endpoint: string, options?: Omit<FetcherOptions, "method">) {
    return fetcher<T>(endpoint, {
      ...options,
      method: "GET",
    });
  },

  post<T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: Omit<FetcherOptions, "method" | "body">,
  ) {
    return fetcher<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    });
  },

  put<T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: Omit<FetcherOptions, "method" | "body">,
  ) {
    return fetcher<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    });
  },

  patch<T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: Omit<FetcherOptions, "method" | "body">,
  ) {
    return fetcher<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    });
  },

  delete<T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: Omit<FetcherOptions, "method" | "body">,
  ) {
    return fetcher<T>(endpoint, {
      ...options,
      method: "DELETE",
      body:
        body === undefined
          ? undefined
          : body instanceof FormData
            ? body
            : JSON.stringify(body),
    });
  },
};
