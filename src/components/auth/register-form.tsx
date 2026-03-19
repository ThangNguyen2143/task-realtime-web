"use client";

import { useState } from "react";
import { useRegister } from "@/features/auth/use-register";
import { useAuthMiddleware } from "./auth-middleware";

function RegisterForm() {
  useAuthMiddleware({
    guestOnly: true,
    redirectTo: "/workspace",
  });
  const { register, loading, error } = useRegister();

  const [form, setForm] = useState({
    name_display: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validate = () => {
    if (!form.name_display) return "Tên không được để trống";
    if (!form.email) return "Email không được để trống";
    if (!form.password) return "Mật khẩu không được để trống";
    if (form.password.length < 6) return "Mật khẩu tối thiểu 6 ký tự";
    if (form.password !== form.confirmPassword)
      return "Mật khẩu xác nhận không khớp";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      setFormError(err);
      return;
    }

    setFormError(null);

    const result = await register({
      name_display: form.name_display,
      email: form.email,
      password: form.password,
    });

    if (!result.ok) {
      console.log(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Đăng ký</h2>

      <input
        type="text"
        placeholder="Tên hiển thị"
        className="input input-bordered w-full"
        value={form.name_display}
        onChange={(e) => handleChange("name_display", e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        className="input input-bordered w-full"
        value={form.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />

      <input
        type="password"
        placeholder="Mật khẩu"
        className="input input-bordered w-full"
        value={form.password}
        onChange={(e) => handleChange("password", e.target.value)}
      />

      <input
        type="password"
        placeholder="Xác nhận mật khẩu"
        className="input input-bordered w-full"
        value={form.confirmPassword}
        onChange={(e) => handleChange("confirmPassword", e.target.value)}
      />

      {(formError || error) && (
        <p className="text-error text-sm">{formError || error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn btn-neutral w-full"
      >
        {loading ? "Đang đăng ký..." : "Đăng ký"}
      </button>

      <p className="text-sm text-center">
        Đã có tài khoản?{" "}
        <a href="/login" className="link link-primary">
          Đăng nhập
        </a>
      </p>
    </form>
  );
}

export default RegisterForm;
