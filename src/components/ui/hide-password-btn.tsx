"use client";

import React, { forwardRef, useMemo, useState } from "react";

type InputSize = "xs" | "sm" | "md" | "lg" | "xl";
type InputColor =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

export interface PasswordInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "value" | "onChange"
> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  size?: InputSize;
  color?: InputColor;
  ghost?: boolean;
  validator?: boolean;

  label?: string;
  hint?: string;

  startIcon?: React.ReactNode;
  endLabel?: React.ReactNode;

  wrapperClassName?: string;
  inputClassName?: string;
  toggleClassName?: string;

  showToggleText?: boolean;
}

const sizeClassMap: Record<InputSize, string> = {
  xs: "input-xs",
  sm: "input-sm",
  md: "input-md",
  lg: "input-lg",
  xl: "input-xl",
};

const colorClassMap: Record<InputColor, string> = {
  neutral: "input-neutral",
  primary: "input-primary",
  secondary: "input-secondary",
  accent: "input-accent",
  info: "input-info",
  success: "input-success",
  warning: "input-warning",
  error: "input-error",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const DefaultLockIcon = () => (
  <svg
    className="h-[1em] opacity-50"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" stroke="none" />
  </svg>
);

const EyeOpenIcon = () => (
  <svg
    className="h-[1em] opacity-70"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2.062 12.348a1 1 0 0 1 0-.696C3.413 7.59 7.523 5 12 5s8.587 2.59 9.938 6.652a1 1 0 0 1 0 .696C20.587 16.41 16.477 19 12 19s-8.587-2.59-9.938-6.652Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    className="h-[1em] opacity-70"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10.733 5.076A10.744 10.744 0 0 1 12 5c4.478 0 8.588 2.59 9.938 6.652a1 1 0 0 1 0 .696 10.75 10.75 0 0 1-4.274 5.168" />
    <path d="M14.084 14.158A3 3 0 0 1 9.842 9.916" />
    <path d="M17.479 17.499A10.75 10.75 0 0 1 12 19c-4.478 0-8.588-2.59-9.938-6.652a1 1 0 0 1 0-.696A10.75 10.75 0 0 1 6.521 6.5" />
    <path d="m2 2 20 20" />
  </svg>
);

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      value,
      onChange,
      size = "md",
      color,
      ghost = false,
      validator = false,
      label,
      hint,
      startIcon,
      endLabel,
      wrapperClassName,
      inputClassName,
      toggleClassName,
      showToggleText = false,
      placeholder = "Nhập mật khẩu",
      disabled,
      required,
      ...rest
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const wrapperClass = useMemo(
      () =>
        cn(
          "input w-full",
          sizeClassMap[size],
          color ? colorClassMap[color] : "",
          ghost && "input-ghost",
          validator && "validator",
          disabled && "input-disabled",
          wrapperClassName,
        ),
      [size, color, ghost, validator, disabled, wrapperClassName],
    );

    return (
      <fieldset className="fieldset w-full">
        {label ? <legend className="fieldset-legend">{label}</legend> : null}

        <label className={wrapperClass}>
          {startIcon ?? <DefaultLockIcon />}

          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={cn("grow", inputClassName)}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            {...rest}
          />

          {endLabel ? endLabel : null}

          <button
            type="button"
            className={cn(
              "btn btn-ghost btn-xs sm:btn-sm",
              "px-2 min-h-0 h-auto",
              toggleClassName,
            )}
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showToggleText ? (
              <span>{showPassword ? "Ẩn" : "Hiện"}</span>
            ) : showPassword ? (
              <EyeOffIcon />
            ) : (
              <EyeOpenIcon />
            )}
          </button>
        </label>

        {hint ? (
          <p className={validator ? "validator-hint" : "label"}>{hint}</p>
        ) : null}
      </fieldset>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
