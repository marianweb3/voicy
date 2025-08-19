import React, { forwardRef } from "react";
import { clsx } from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", children, ...props },
    ref
  ) => {
    return (
      <button
        className={clsx(
          "inline-flex items-center justify-center rounded-[12px] font-medium transition-all duration-200",
          "outline-none ring-0",
          "active:scale-[0.98]",
          "w-80", // 320px default width

          // Size variants
          {
            "px-4 py-2 text-sm": size === "sm",
            "px-6 py-3 text-sm": size === "md",
            "px-8 py-4 text-base": size === "lg",
          },

          // Primary variant
          variant === "primary" && [
            "text-white",
            // Normal state
            !props.disabled && "bg-[#739C9C]",
            // Hover state
            !props.disabled && "hover:bg-[#87B0B0]",
            // Pressed/Active state
            !props.disabled && "active:bg-[#5F8888]",
            // Disabled state
            props.disabled && "bg-[#739C9C] opacity-30 cursor-not-allowed",
          ],

          // Secondary variant
          variant === "secondary" && [
            "text-gray-700 bg-gray-100",
            !props.disabled && "hover:bg-gray-200",
            !props.disabled && "active:bg-gray-300",
            props.disabled && "text-gray-400 cursor-not-allowed",
          ],

          // Outline variant
          variant === "outline" && [
            "text-[#739C9C] border border-[#739C9C] bg-transparent",
            !props.disabled && "hover:bg-[#739C9C] hover:text-white",
            !props.disabled && "active:bg-[#5F8888] active:border-[#5F8888]",
            props.disabled &&
              "text-[#9A9A9A] border-[#9A9A9A] cursor-not-allowed",
          ],

          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
