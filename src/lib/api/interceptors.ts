import { tokenStorage } from "./token-storage";

export type RequestInterceptorContext = {
  url: string;
  init: RequestInit;
};

export type ResponseInterceptorContext = {
  response: Response;
  request: RequestInterceptorContext;
};

export async function onRequest(
  url: string,
  init: RequestInit = {},
): Promise<RequestInterceptorContext> {
  const headers = new Headers(init.headers || {});
  const token = tokenStorage.getAccessToken();

  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  headers.set("Accept", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return {
    url,
    init: {
      ...init,
      headers,
      credentials: init.credentials ?? "include",
    },
  };
}

export async function onResponse(
  response: Response,
  request: RequestInterceptorContext,
): Promise<ResponseInterceptorContext> {
  return { response, request };
}
