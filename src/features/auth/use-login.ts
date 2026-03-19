"use client";
import { useCallback, useState } from "react";
import { loginApi } from "./api";
import { useAuthContext } from "@/components/auth/context";
import {
  ApiErrorShape,
  LoginBody,
  LoginHookState,
  mapLoginUserToUser,
  User,
} from "./types";
import { useRouter } from "next/navigation";

function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;

  if (error && typeof error === "object") {
    const err = error as {
      message?: string;
      response?: {
        data?: ApiErrorShape;
      };
    };

    if (err.response?.data?.message) {
      return err.response.data.message;
    }

    if (err.message) {
      return err.message;
    }
  }
  return "Đăng nhập thất bại. Vui lòng thử lại.";
}
type UseLoginOptions = {
  redirectTo?: string;
  onSuccess?: (user: User) => void;
  onError?: (message: string) => void;
};
export function useLogin(options?: UseLoginOptions) {
  const router = useRouter();
  const { setAuth } = useAuthContext();

  const [state, setState] = useState<LoginHookState>({
    data: null,
    loading: false,
    error: null,
  });

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  const login = useCallback(
    async (payload: LoginBody) => {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const response = await loginApi(payload);
        const user = mapLoginUserToUser(response.value.user);

        setAuth({
          user,
          accessToken: response.value.accessToken,
        });

        setState({
          data: user,
          loading: false,
          error: null,
        });

        options?.onSuccess?.(user);

        if (options?.redirectTo) {
          router.replace(options.redirectTo);
        }

        return {
          ok: true as const,
          user,
        };
      } catch (error) {
        const message = getErrorMessage(error);

        setState({
          data: null,
          loading: false,
          error: message,
        });

        options?.onError?.(message);

        return {
          ok: false as const,
          error: message,
        };
      }
    },
    [options, router, setAuth],
  );

  return {
    data: state.data,
    error: state.error,
    loading: state.loading,
    login,
    reset,
  };
}

export function useLogout() {
  const { clearAuth } = useAuthContext();

  const logout = () => {
    clearAuth();
    // thêm logic disconnect socket ở đây nếu cần
    // socketManager.disconnect();
  };

  return { logout };
}
