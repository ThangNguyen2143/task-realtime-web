import { tokenStorage } from "./token-storage";

type RefreshResponse = {
  code?: number;
  status?: boolean;
  message?: string;
  value?: {
    accessToken?: string;
    refreshToken?: string;
  };
};

let refreshPromise: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        tokenStorage.clear();
        return null;
      }

      const data = (await response.json()) as RefreshResponse;
      const newAccessToken = data?.value?.accessToken ?? null;

      if (!newAccessToken) {
        tokenStorage.clear();
        return null;
      }

      tokenStorage.setAccessToken(newAccessToken);
      return newAccessToken;
    } catch {
      tokenStorage.clear();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
