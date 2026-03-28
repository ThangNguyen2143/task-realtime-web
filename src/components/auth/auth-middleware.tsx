"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "./context";

type AuthMiddlewareOptions = {
  requireAuth?: boolean;
  guestOnly?: boolean;
  redirectTo?: string;
};

export function useAuthMiddleware(options?: AuthMiddlewareOptions) {
  const { requireAuth = false, guestOnly = false, redirectTo } = options || {};

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, isHydrating } = useAuthContext();

  useEffect(() => {
    if (isHydrating) return;
    if (requireAuth && !isAuthenticated) {
      const next =
        redirectTo ?? `/login?callbackUrl=${encodeURIComponent(pathname)}`;
      router.replace(next);
      return;
    }

    if (guestOnly && isAuthenticated) {
      const callbackUrl = searchParams.get("callbackUrl");
      router.replace(callbackUrl || redirectTo || "/workspace");
    }
  }, [
    guestOnly,
    isHydrating,
    isAuthenticated,
    pathname,
    redirectTo,
    requireAuth,
    router,
  ]);
}
