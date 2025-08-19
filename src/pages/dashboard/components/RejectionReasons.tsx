import { useState } from "react";
import { Dropdown } from "../../../components/ui/dropdown";
import RejectionReasonsChart from "./RejectionReasonsChart";

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface TimeOption {
  value: string;
  label: string;
}

interface RejectionReasonsProps {
  title?: string;
  chartData?: ChartDataItem[];
  totalRejections?: number;
  timeOptions?: TimeOption[];
  defaultTimeFilter?: string;
  showInsight?: boolean;
  insightText?: string;
  showDropdown?: boolean;
  className?: string;
}

const RejectionReasons = ({
  title = "Причини відмов",
  chartData = [
    { name: "Дорого", value: 27, color: "#B27D45" },
    { name: "Немає довіри", value: 22, color: "#B2A945" },
    { name: "Немає бюджету", value: 17, color: "#4573B2" },
    { name: "Інше", value: 12, color: "#D9D9D9" },
  ],
  totalRejections = 4211,
  timeOptions = [
    { value: "all", label: "Весь час" },
    { value: "today", label: "Сьогодні" },
    { value: "week", label: "Цей тиждень" },
    { value: "month", label: "Цей місяць" },
    { value: "quarter", label: "Цей квартал" },
    { value: "year", label: "Цей рік" },
  ],
  defaultTimeFilter = "all",
  showInsight = true,
  insightText = "Основний фокус відмов - ціна і недожим.\nПропонуємо переглянути аргументацію за ціною",
  showDropdown = true,
  className = "",
}: RejectionReasonsProps) => {
  const [timeFilter, setTimeFilter] = useState(defaultTimeFilter);

  return (
    <div
      className={`w-full lg:max-w-[542px] bg-white p-4 md:p-6 rounded-2xl flex flex-col gap-4 md:gap-6 ${className}`}
    >
      <div
        className={`flex flex-col ${
          showDropdown ? "sm:flex-row sm:items-center sm:justify-between" : ""
        } gap-4`}
      >
        <h2 className="text-[#00101F] text-[20px] md:text-[24px] leading-[100%] font-semibold">
          {title}
        </h2>
        {showDropdown && (
          <Dropdown
            options={timeOptions}
            value={timeFilter}
            onChange={setTimeFilter}
            variant="minimal"
            className="w-auto min-w-[150px]"
          />
        )}
      </div>

      <div className="flex flex-col gap-4 items-center justify-center">
        <RejectionReasonsChart data={chartData} total={totalRejections} />

        {showInsight && (
          <div className="bg-[#EBF0F0] w-full rounded-[12px] py-3 px-4 flex items-start gap-4">
            <div className="size-10 shrink-0 bg-[#739C9C] rounded-full flex items-center justify-center mt-1">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 4V2H9V4L3 7V9H9.75C10.6 8.53 11.75 8.53 12.25 9H21ZM12 20C17.05 20 21 16.05 21 11H3C3 16.05 6.95 20 12 20Z"
                  fill="white"
                />
              </svg>
            </div>
            <p className="font-semibold text-[12px] md:text-[14px] leading-[120%] italic text-[#739C9C]">
              "
              {insightText.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  {index < insightText.split("\n").length - 1 && (
                    <>
                      <br className="hidden sm:block" />
                      <span className="sm:hidden"> </span>
                    </>
                  )}
                </span>
              ))}
              "
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 md:gap-y-4 gap-x-4 md:gap-x-6">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-3 md:gap-4">
            <div
              className="size-2 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-[#9A9A9A] text-[13px] md:text-[14px] leading-[100%]">
              {item.name} ({item.value}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RejectionReasons;
