"use client";
import { useLogin } from "@/features/auth/use-login";
import { LoginBody } from "@/features/auth/types";
import { checkNullOrEmpty } from "@/features/auth/validate";
import { useState } from "react";
import { useAuthMiddleware } from "./auth-middleware";
import Link from "next/link";
import { PasswordInput } from "../ui/hide-password-btn";

function LoginForm() {
  useAuthMiddleware({
    guestOnly: true,
  });
  const { login, loading, error } = useLogin();
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  } | null>(null);
  const [form, setForm] = useState<LoginBody>({
    email: "",
    password: "",
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checkNullOrEmpty(form.email)) {
      setErrors((pre) => ({ ...pre, email: "Yêu cầu nhập email" }));
    }
    if (checkNullOrEmpty(form.password)) {
      setErrors((pre) => ({ ...pre, password: "Yêu cầu nhập mật khẩu" }));
    }
    if (errors) {
      return;
    }
    await login(form);
  };
  const onChangeValue = (field: keyof LoginBody, value: string) => {
    setForm((pre) => ({ ...pre, [field]: value }));
    setErrors(null);
  };
  return (
    <form onSubmit={onSubmit}>
      {error && (
        <div className="text-red-500 text-sm">
          <p className="text-center">{error}</p>
        </div>
      )}
      <fieldset className="fieldset w-xs border shadow-2xl p-4 rounded-box bg-base-300">
        <legend className="fieldset-legend text-3xl text-cyan-700 text-center">
          ĐĂNG NHẬP
        </legend>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Email</legend>
          <input
            type="text"
            className="input validator input-ghost"
            placeholder="Nhập email"
            name="email"
            value={form.email}
            onChange={(e) => onChangeValue("email", e.target.value)}
            title="Vui lòng nhập email"
          />
        </fieldset>
        {errors?.email && (
          <p className="mt-1 text-sm text-red-600">{errors?.email}</p>
        )}
        <PasswordInput
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          ghost
          value={form.password}
          onChange={(e) => onChangeValue("password", e.target.value)}
        />
        <p className="validator-hint">Vui lòng nhập mật khẩu</p>
        {errors?.password && (
          <p className="mt-1 text-sm text-red-600">{errors?.password}</p>
        )}
        <button
          className="btn btn-neutral mt-4"
          disabled={loading}
          type="submit"
        >
          {loading ? <span className="loading"></span> : "Đăng nhập"}
        </button>
        <div className="flex">
          Chưa có tài khoản{" "}
          <Link href={"/register"} className="text-blue-500 underline">
            Đăng kí ngay!
          </Link>
        </div>
      </fieldset>
    </form>
  );
}

export default LoginForm;
