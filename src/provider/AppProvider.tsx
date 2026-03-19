"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/components/auth/context";

type Props = {
  children: ReactNode;
};

export function AppProvider({ children }: Props) {
  return <AuthProvider>{children}</AuthProvider>;
}
