"use client";

import { useState } from "react";
import { useRegister } from "@/features/auth/use-register";
import { useAuthMiddleware } from "./auth-middleware";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { PasswordInput } from "../ui/hide-password-btn";

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

    await register({
      name_display: form.name_display,
      email: form.email,
      password: form.password,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <fieldset className="fieldset w-xs border shadow-2xl p-4 rounded-box bg-base-300">
        <legend className="fieldset-legend text-3xl text-cyan-700 text-center">
          ĐĂNG KÝ
        </legend>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Tên hiển thị</legend>
          <input
            type="text"
            placeholder="Tên hiển thị"
            className="input w-full"
            value={form.name_display}
            onChange={(e) => handleChange("name_display", e.target.value)}
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Email</legend>
          <input
            type="email"
            className="input w-full"
            placeholder="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </fieldset>

        <PasswordInput
          label="Mật khẩu"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
        />
        <PasswordInput
          label="Nhập lại mật khẩu"
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
      </fieldset>
    </form>
  );
}

export default RegisterForm;
