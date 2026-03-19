"use client";

import type { ComponentType, JSX } from "react";
import { useAuthMiddleware } from "./auth-middleware";

type WithAuthOptions = {
  requireAuth?: boolean;
  guestOnly?: boolean;
  redirectTo?: string;
};

export function withAuth<P extends JSX.IntrinsicAttributes>(
  WrappedComponent: ComponentType<P>,
  options?: WithAuthOptions,
) {
  return function AuthenticatedComponent(props: P) {
    useAuthMiddleware(options);
    return <WrappedComponent {...props} />;
  };
}
