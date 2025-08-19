import { useState } from "react";
import { useDashboardDynamics } from "../../../hooks/useDashboard";
import { Dropdown } from "../../../components/ui/dropdown";
import CallDynamicsChart from "./CallDynamicsChart";

interface ChartDataItem {
  day: string;
  calls: number;
}

interface TypeOption {
  value: "calls" | "ai_avg";
  label: string;
}

interface PeriodTab {
  value: "week" | "month" | "year";
  label: string;
}

interface CallDynamicsWrapperProps {
  title?: string;
  defaultType?: "calls" | "ai_avg";
  defaultRange?: "week" | "month" | "year";
  showDropdown?: boolean;
  showPeriodTabs?: boolean;
  className?: string;
}

const CallDynamicsWrapper = ({
  title = "Динаміка дзвінків",
  defaultType = "ai_avg",
  defaultRange = "year",
  showDropdown = true,
  showPeriodTabs = true,
  className = "",
}: CallDynamicsWrapperProps) => {
  const [selectedType, setSelectedType] = useState<"calls" | "ai_avg">(
    defaultType
  );
  const [selectedRange, setSelectedRange] = useState<"week" | "month" | "year">(
    defaultRange
  );

  const { dynamicsPoints, isLoadingDynamics, dynamicsError, timeUpdate } =
    useDashboardDynamics(selectedRange, selectedType);

  const typeOptions: TypeOption[] = [
    { value: "calls", label: "Дзвінки" },
    { value: "ai_avg", label: "AI Середній" },
  ];

  const periodTabs: PeriodTab[] = [
    { value: "week", label: "Тиждень" },
    { value: "month", label: "Місяць" },
    { value: "year", label: "Рік" },
  ];

  // Transform API data to chart format
  const chartData: ChartDataItem[] = dynamicsPoints
    ? dynamicsPoints.map((point) => ({
        day: point.point_label,
        calls: point.value,
      }))
    : [];

  // Loading skeleton component
  const LoadingSkeleton = () => {
    return (
      <div className="w-full">
        {/* Chart area skeleton */}
        <div className="h-[300px] bg-gray-100 rounded-lg animate-pulse mb-6"></div>

        {/* Legend skeleton */}
        <div className="flex flex-wrap gap-4 justify-center">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (dynamicsError) {
    return (
      <div
        className={`w-full bg-white p-4 md:p-6 rounded-2xl flex flex-col gap-4 md:gap-6 ${className}`}
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
      className={`w-full bg-white p-4 md:p-6 rounded-2xl flex flex-col gap-4 md:gap-6 ${className}`}
    >
      <div className="flex flex-col gap-4 md:gap-6">
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
              options={typeOptions}
              value={selectedType}
              onChange={(value) => setSelectedType(value as "calls" | "ai_avg")}
              variant="minimal"
              className="w-auto min-w-[150px]"
            />
          )}
        </div>

        {showPeriodTabs && (
          <div className="w-full border-b border-[#EAEAEA]">
            <div className="flex gap-6 md:gap-10 overflow-x-auto">
              {periodTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setSelectedRange(tab.value)}
                  className={`py-[10.5px] border-b-[3px] text-[14px] leading-[100%] transition-colors whitespace-nowrap ${
                    selectedRange === tab.value
                      ? "border-[#739C9C] text-[#739C9C] font-semibold"
                      : "border-transparent text-[#00101F]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {isLoadingDynamics ? (
        <LoadingSkeleton />
      ) : (
        <CallDynamicsChart data={chartData} />
      )}
    </div>
  );
};

export default CallDynamicsWrapper;
