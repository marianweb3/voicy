import React, { forwardRef, useState } from "react";
import { clsx } from "clsx";
import { LuEye } from "react-icons/lu";
import { FiEyeOff } from "react-icons/fi";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: "default" | "filled";
  showPasswordToggle?: boolean;
  icon?: React.ReactNode;
  containerClassName?: string;
  iconPosition?: "left" | "right";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      variant = "default",
      showPasswordToggle = false,
      icon,
      iconPosition = "left",
      containerClassName,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const hasValue = props.value && props.value.toString().length > 0;

    const inputType = showPasswordToggle
      ? showPassword
        ? "text"
        : "password"
      : props.type;

    return (
      <div className={clsx("w-full", containerClassName)}>
        {label && (
          <label className="block text-[14px]  leading-[100%] text-[#9A9A9A]">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && iconPosition === "left" && (
            <div
              className={clsx(
                "absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none",
                error ? "text-[#B24545]" : "text-[#739C9C]"
              )}
            >
              {icon}
            </div>
          )}

          <input
            type={inputType}
            className={clsx(
              "w-full px-4 py-3 rounded-[12px] border transition-all duration-200 text-[14px] leading-[100%]",
              "outline-none ring-0",
              icon && iconPosition === "left" && "pl-12",
              icon && iconPosition === "right" && "pr-12",
              showPasswordToggle && "pr-12",
              showPasswordToggle && icon && iconPosition === "right" && "pr-20",
              // Default state
              !isFocused &&
                !hasValue &&
                !error &&
                !props.disabled &&
                variant === "default" && [
                  "border-[#EAEAEA] bg-[#F7F7F7] text-[#9A9A9A] placeholder:text-[#9A9A9A]",
                  "hover:border-[#9A9A9A]",
                ],
              // Active/Focused state
              isFocused &&
                !error &&
                !props.disabled && [
                  "border-[#739C9C] bg-white text-[#22272F] shadow-sm",
                ],
              // Filled state
              hasValue &&
                !isFocused &&
                !error &&
                !props.disabled &&
                variant === "default" && [
                  "border-[#EAEAEA] bg-white text-[#22272F]",
                ],
              // Filled variant (always has background)
              variant === "filled" &&
                !error &&
                !props.disabled && [
                  "border-[#EAEAEA] bg-[#F7F7F7] text-[#22272F]",
                  !isFocused && "hover:bg-gray-100",
                ],
              // Error state
              error &&
                !props.disabled && [
                  "border-[#B24545] bg-white text-[#22272F]",
                  "focus:border-[#B24545]",
                ],
              // Disabled state
              props.disabled && [
                "border-[#EAEAEA] bg-[#EAEAEA] text-[#22272F] cursor-not-allowed",
              ],
              className
            )}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />

          {icon && iconPosition === "right" && !showPasswordToggle && (
            <div
              className={clsx(
                "absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none",
                error ? "text-[#B24545]" : "text-[#9A9A9A]"
              )}
            >
              {icon}
            </div>
          )}

          {icon && iconPosition === "right" && showPasswordToggle && (
            <div
              className={clsx(
                "absolute right-12 top-1/2 transform -translate-y-1/2 pointer-events-none",
                error ? "text-[#B24545]" : "text-[#9A9A9A]"
              )}
            >
              {icon}
            </div>
          )}

          {showPasswordToggle && (
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#9A9A9A] hover:text-[#22272F] transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {!showPassword ? <LuEye size={24} /> : <FiEyeOff size={24} />}
            </button>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-[#B24545] font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
