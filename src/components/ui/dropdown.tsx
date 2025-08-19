import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { MdKeyboardArrowDown } from "react-icons/md";

interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal";
  dropDirection?: "down" | "up";
}

const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select option",
  className,
  disabled = false,
  size = "md",
  variant = "default",
  dropDirection = "down",
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue: string) => {
    if (!disabled) {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // Animation and positioning based on drop direction
  const getAnimationProps = () => {
    if (dropDirection === "up") {
      return {
        initial: { opacity: 0, y: 10, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 10, scale: 0.95 },
      };
    }
    return {
      initial: { opacity: 0, y: -10, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -10, scale: 0.95 },
    };
  };

  const getPositionClasses = () => {
    if (dropDirection === "up") {
      return "absolute bottom-full left-0 right-0 mb-1";
    }
    return "absolute top-full left-0 right-0 mt-1";
  };

  return (
    <div className={clsx("relative inline-block", className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className={clsx(
          "flex items-center justify-between w-full transition-all duration-200 font-medium",
          "outline-none ring-0",

          // Size variants
          {
            "px-3 py-2 text-sm": size === "sm",
            "px-4 py-3 text-[14px]": size === "md",
            "px-6 py-4 text-base": size === "lg",
          },

          // Variant styles
          variant === "default" && [
            "rounded-[12px] border",
            "focus:border-[#739C9C] hover:border-[#9A9A9A]",

            // Default variant states
            !disabled && [
              "border-[#EAEAEA] bg-[#F7F7F7] text-[#00101F]",
              !selectedOption && "text-[#9A9A9A]",
            ],
            disabled && [
              "border-[#EAEAEA] bg-[#EAEAEA] text-[#9A9A9A] cursor-not-allowed",
            ],
            isOpen && !disabled && "border-[#739C9C] bg-white shadow-sm",
          ],

          variant === "minimal" && [
            "rounded-md bg-transparent border-none",

            // Minimal variant states
            !disabled && [
              "text-[#00101F] hover:bg-[#F7F7F7]",
              !selectedOption && "text-[#9A9A9A]",
              isOpen && "bg-[#F7F7F7]",
            ],
            disabled && ["text-[#9A9A9A] cursor-not-allowed"],
          ]
        )}
        disabled={disabled}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="ml-2 flex-shrink-0"
        >
          <MdKeyboardArrowDown
            size={20}
            className={clsx(disabled ? "text-[#000000]" : "text-[#000000]")}
          />
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            {...getAnimationProps()}
            transition={{
              duration: 0.2,
              ease: [0.4, 0.0, 0.2, 1], // Custom easing for smooth feel
            }}
            className={clsx(
              getPositionClasses(),
              "bg-white border border-[#EAEAEA] rounded-[12px] shadow-lg z-50 overflow-hidden"
            )}
          >
            <div className="py-1">
              {options.map((option, index) => (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.15,
                  }}
                  onClick={() => handleOptionClick(option.value)}
                  disabled={option.disabled}
                  className={clsx(
                    "w-full text-left transition-colors duration-150",
                    {
                      "px-3 py-2 text-sm": size === "sm",
                      "px-4 py-3 text-[14px]": size === "md",
                      "px-6 py-4 text-base": size === "lg",
                    },

                    // Option states
                    !option.disabled && [
                      "text-[#00101F] hover:bg-[#F7F7F7] hover:text-[#739C9C]",
                      option.value === value &&
                        "bg-[#F7F7F7] text-[#739C9C] font-medium",
                    ],

                    option.disabled && [
                      "text-[#9A9A9A] cursor-not-allowed opacity-50",
                    ]
                  )}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { Dropdown };
export type { DropdownProps, DropdownOption };
