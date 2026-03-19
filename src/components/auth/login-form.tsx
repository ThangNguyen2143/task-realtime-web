"use client";
import { useLogin } from "@/features/auth/use-login";
import { LoginBody } from "@/features/auth/types";
import { checkNullOrEmpty } from "@/features/auth/validate";
import { useState } from "react";
import { useAuthMiddleware } from "./auth-middleware";
import Link from "next/link";

function LoginForm() {
  useAuthMiddleware({
    guestOnly: true,
    redirectTo: "/workspace",
  });
  const { login, loading, error, data } = useLogin();
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
    const result = await login(form);
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
      <fieldset className="fieldset w-xs border border-base-300 p-4 rounded-box">
        <legend className="fieldset-legend text-3xl text-cyan-700 text-center">
          ĐĂNG NHẬP
        </legend>

        <label className="fieldset-label text-cyan-500" htmlFor="email">
          Email
        </label>
        <input
          type="text"
          className="input validator input-ghost"
          placeholder="Nhập email"
          name="email"
          value={form.email}
          onChange={(e) => onChangeValue("email", e.target.value)}
          title="Vui lòng nhập email"
        />
        {errors?.email && (
          <p className="mt-1 text-sm text-red-600">{errors?.email}</p>
        )}
        <label className="fieldset-label text-cyan-500" htmlFor="password">
          Mật khẩu
        </label>
        <input
          type="password"
          className="input input-ghost validator"
          name="password"
          placeholder="Nhập mật khẩu"
          value={form.password}
          onChange={(e) => onChangeValue("password", e.target.value)}
          title="Vui lòng nhập mật khẩu"
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
