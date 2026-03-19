"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      const next =
        redirectTo ?? `/login?callbackUrl=${encodeURIComponent(pathname)}`;
      router.replace(next);
      return;
    }

    if (guestOnly && isAuthenticated) {
      router.replace(redirectTo ?? "/workspace");
    }
  }, [guestOnly, isAuthenticated, pathname, redirectTo, requireAuth, router]);
}
