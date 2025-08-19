import { useState } from "react";
import { useDashboardRejects } from "../../../hooks/useDashboard";
import { Dropdown } from "../../../components/ui/dropdown";
import RejectionReasonsChart from "./RejectionReasonsChart";

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface RangeOption {
  value: "all" | "year" | "month" | "week" | "day";
  label: string;
}

interface RejectionReasonsWrapperProps {
  title?: string;
  defaultRange?: "all" | "year" | "month" | "week" | "day";
  showInsight?: boolean;
  showDropdown?: boolean;
  className?: string;
}

// Predefined colors for different rejection reasons
const rejectionColors: Record<string, string> = {
  already_bought: "#B27D45",
  weak_followup: "#B2A945",
  thinking: "#4573B2",
  no_trust: "#D9534F",
  expensive: "#5BC0DE",
  no_budget: "#D9D9D9",
};

const RejectionReasonsWrapper = ({
  title = "Причини відмов",
  defaultRange = "day",
  showInsight = true,
  showDropdown = true,
  className = "",
}: RejectionReasonsWrapperProps) => {
  const [selectedRange, setSelectedRange] = useState<
    "all" | "year" | "month" | "week" | "day"
  >(defaultRange);

  const {
    rejectsBreakdown,
    rejectsTotals,
    rejectsInsight,
    isLoadingRejects,
    rejectsError,
    timeUpdate,
  } = useDashboardRejects(selectedRange);

  const rangeOptions: RangeOption[] = [
    { value: "all", label: "Весь час" },
    { value: "year", label: "Цей рік" },
    { value: "month", label: "Цей місяць" },
    { value: "week", label: "Цей тиждень" },
    { value: "day", label: "Сьогодні" },
  ];

  // Transform API data to chart format
  const chartData: ChartDataItem[] = rejectsBreakdown
    ? rejectsBreakdown.map((item) => ({
        name: item.label,
        value: item.percent,
        color: rejectionColors[item.key] || "#D9D9D9",
      }))
    : [];

  const totalRejections = rejectsTotals?.total_calls || 0;

  // Loading skeleton component
  const LoadingSkeleton = () => {
    return (
      <div className="flex flex-col gap-4 items-center justify-center">
        {/* Chart skeleton */}
        <div className="w-[200px] h-[200px] bg-gray-100 rounded-full animate-pulse"></div>

        {/* Insight skeleton */}
        <div className="bg-gray-50 w-full rounded-[12px] py-3 px-4 flex items-start gap-4 animate-pulse">
          <div className="size-10 shrink-0 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>

        {/* Legend skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 md:gap-y-4 gap-x-4 md:gap-x-6 w-full">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="flex items-center gap-3 md:gap-4">
              <div className="size-2 rounded-full shrink-0 bg-gray-200 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (rejectsError) {
    return (
      <div
        className={`w-full lg:max-w-[542px] bg-white p-4 md:p-6 rounded-2xl flex flex-col gap-4 md:gap-6 ${className}`}
      >
        <h2 className="text-[#00101F] text-[20px] md:text-[24px] leading-[100%] font-semibold">
          {title}
        </h2>
        <div className="text-red-500 text-center py-8">
          Помилка завантаження даних. Спробуйте пізніше.
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full lg:max-w-[542px] bg-white p-4 md:p-6 rounded-2xl flex flex-col gap-4 md:gap-6 ${className}`}
    >
      <div
        className={`flex flex-col ${
          showDropdown ? "sm:flex-row sm:items-center sm:justify-between" : ""
        } gap-4`}
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-[#00101F] text-[20px] md:text-[24px] leading-[100%] font-semibold">
            {title}
          </h2>
          {timeUpdate && (
            <p className="text-[#666] text-sm">Оновлено: {timeUpdate}</p>
          )}
        </div>
        {showDropdown && (
          <Dropdown
            options={rangeOptions}
            value={selectedRange}
            onChange={(value) =>
              setSelectedRange(
                value as "all" | "year" | "month" | "week" | "day"
              )
            }
            variant="minimal"
            className="w-auto min-w-[150px]"
          />
        )}
      </div>

      {isLoadingRejects ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div className="flex flex-col gap-4 items-center justify-center">
            <RejectionReasonsChart data={chartData} total={totalRejections} />

            {showInsight && rejectsInsight && (
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
                  {rejectsInsight.split("\n").map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < rejectsInsight.split("\n").length - 1 && (
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
        </>
      )}
    </div>
  );
};

export default RejectionReasonsWrapper;
