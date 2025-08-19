import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { HiOutlineCalendar } from "react-icons/hi2";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const DatePicker = ({
  value,
  onChange,
  placeholder = "Оберіть дату",
  className,
  disabled = false,
  size = "md",
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDatePicker = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const formatDate = (date: Date) => {
    return date
      .toLocaleDateString("uk-UA", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\./g, "-");
  };

  const parseDate = (dateString: string) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split("-");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  const selectedDate = value ? parseDate(value) : null;

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to be last (6)
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const formattedDate = formatDate(newDate);
    onChange(formattedDate);
    setIsOpen(false);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    "Січень",
    "Лютий",
    "Березень",
    "Квітень",
    "Травень",
    "Червень",
    "Липень",
    "Серпень",
    "Вересень",
    "Жовтень",
    "Листопад",
    "Грудень",
  ];

  const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);

  const calendarDays = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div
      className={clsx("relative inline-block", className)}
      ref={datePickerRef}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={toggleDatePicker}
        className={clsx(
          "flex items-center justify-between w-full transition-all duration-200 font-medium",
          "outline-none ring-0 rounded-[12px] border",
          "focus:border-[#739C9C] hover:border-[#9A9A9A]",

          // Size variants
          {
            "px-3 py-2 text-sm": size === "sm",
            "px-4 py-3 text-[14px]": size === "md",
            "px-6 py-4 text-base": size === "lg",
          },

          // States
          !disabled && [
            "border-[#EAEAEA] bg-[#F7F7F7] text-[#00101F]",
            !value && "text-[#9A9A9A]",
          ],
          disabled && [
            "border-[#EAEAEA] bg-[#EAEAEA] text-[#9A9A9A] cursor-not-allowed",
          ],
          isOpen && !disabled && "border-[#739C9C] bg-white shadow-sm"
        )}
        disabled={disabled}
      >
        <span className="truncate">{value || placeholder}</span>

        <HiOutlineCalendar
          size={20}
          className={clsx(
            "ml-2 flex-shrink-0",
            disabled ? "text-[#9A9A9A]" : "text-[#739C9C]"
          )}
        />
      </button>

      {/* Date Picker Calendar */}
      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="absolute top-full left-0 mt-1 bg-white border border-[#EAEAEA] rounded-[12px] shadow-lg z-50 overflow-hidden w-80"
          >
            <div className="p-4">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigateMonth("prev")}
                  className="p-1 hover:bg-[#F7F7F7] rounded-md transition-colors"
                >
                  <MdKeyboardArrowLeft size={20} className="text-[#739C9C]" />
                </button>

                <span className="text-[#00101F] font-medium">
                  {monthNames[currentDate.getMonth()]}{" "}
                  {currentDate.getFullYear()}
                </span>

                <button
                  onClick={() => navigateMonth("next")}
                  className="p-1 hover:bg-[#F7F7F7] rounded-md transition-colors"
                >
                  <MdKeyboardArrowRight size={20} className="text-[#739C9C]" />
                </button>
              </div>

              {/* Day Names */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="text-center text-[#9A9A9A] text-xs font-medium py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return <div key={index} className="py-2" />;
                  }

                  const isSelected =
                    selectedDate &&
                    selectedDate.getDate() === day &&
                    selectedDate.getMonth() === currentDate.getMonth() &&
                    selectedDate.getFullYear() === currentDate.getFullYear();

                  const isToday =
                    new Date().toDateString() ===
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      day
                    ).toDateString();

                  return (
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={clsx(
                        "py-2 text-sm rounded-md transition-colors",
                        "hover:bg-[#F7F7F7] focus:outline-none",
                        isSelected &&
                          "bg-[#739C9C] text-white hover:bg-[#5F8888]",
                        isToday &&
                          !isSelected &&
                          "bg-[#EBF0F0] text-[#739C9C] font-medium",
                        !isSelected && !isToday && "text-[#00101F]"
                      )}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { DatePicker };
export type { DatePickerProps };
