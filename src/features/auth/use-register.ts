"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { registerApi } from "./api";
import type { CreateUserDto } from "./types";

function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;

  if (error && typeof error === "object") {
    const err = error as {
      message?: string;
      response?: {
        data?: { message?: string };
      };
    };

    if (err.response?.data?.message) {
      return err.response.data.message;
    }

    if (err.message) return err.message;
  }

  return "Đăng ký thất bại";
}

export function useRegister() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(
    async (payload: CreateUserDto) => {
      setLoading(true);
      setError(null);

      try {
        await registerApi(payload);

        router.replace("/login");

        return { ok: true as const };
      } catch (err) {
        const message = getErrorMessage(err);

        setError(message);

        return { ok: false as const, error: message };
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  return {
    register,
    loading,
    error,
  };
}
