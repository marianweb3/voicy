import { useState } from "react";
import { useDashboardWorst } from "../../../hooks/useDashboard";
import ManagerPerformanceBars from "./ManagerPerformanceBars";

interface ManagerData {
  name: string;
  rating: number;
  isPositive: boolean;
}

interface WorstManagersWrapperProps {
  title?: string;
  className?: string;
}

const WorstManagersWrapper = ({
  title = "Найгірші менеджери",
  className = "",
}: WorstManagersWrapperProps) => {
  const [periodFilter, setPeriodFilter] = useState<"week" | "month" | "year">(
    "year"
  );

  const { worstManagers, isLoadingWorst, worstError } =
    useDashboardWorst(periodFilter);

  // Transform API data to component format
  const transformedData: ManagerData[] = worstManagers
    ? worstManagers.map((manager) => ({
        name: manager.name.replace(/\s+/g, "\n"), // Replace spaces with newlines for better display
        rating: manager.ai_score,
        isPositive: false,
      }))
    : [];

  // Loading skeleton component
  const LoadingSkeleton = () => {
    const barHeights = [65, 45, 80, 55, 70]; // Different heights for variety

    return (
      <div className="flex justify-between gap-2 md:gap-4 overflow-x-auto">
        {[1, 2, 3, 4, 5].map((item, index) => (
          <div
            key={item}
            className="flex flex-col items-center gap-2 md:gap-3 flex-1 min-w-0"
          >
            <div className="relative flex flex-col items-center justify-end h-[150px] md:h-[200px] w-[60px] md:w-[80px]">
              <div
                className="w-full rounded-[8px] md:rounded-[12px] flex flex-col items-center justify-start p-2 md:p-3 relative bg-gray-100 animate-pulse"
                style={{
                  height: `${barHeights[index]}%`,
                }}
              >
                {/* Star and rating skeleton */}
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-6 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Manager name skeleton */}
            <div className="text-center w-full space-y-1">
              <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (worstError) {
    return (
      <div
        className={`w-full bg-white p-4 md:p-6 rounded-2xl flex flex-col gap-4 md:gap-6 ${className}`}
      >
        <h2 className="text-[#00101F] text-[18px] md:text-[24px] leading-[100%] font-semibold">
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
        <div className="flex items-center justify-between">
          <h2 className="text-[#00101F] text-[18px] md:text-[24px] leading-[100%] font-semibold">
            {title}
          </h2>
        </div>

        <div className="w-full border-b border-[#EAEAEA]">
          <div className="flex gap-6 md:gap-10 overflow-x-auto">
            <button
              onClick={() => setPeriodFilter("week")}
              className={`py-[10.5px] border-b-[3px] text-[14px] leading-[100%] transition-colors whitespace-nowrap ${
                periodFilter === "week"
                  ? "border-[#739C9C] text-[#739C9C] font-semibold"
                  : "border-transparent text-[#00101F]"
              }`}
            >
              Тиждень
            </button>
            <button
              onClick={() => setPeriodFilter("month")}
              className={`py-[10.5px] border-b-[3px] text-[14px] leading-[100%] transition-colors whitespace-nowrap ${
                periodFilter === "month"
                  ? "border-[#739C9C] text-[#739C9C] font-semibold"
                  : "border-transparent text-[#00101F]"
              }`}
            >
              Місяць
            </button>
            <button
              onClick={() => setPeriodFilter("year")}
              className={`py-[10.5px] border-b-[3px] text-[14px] leading-[100%] transition-colors whitespace-nowrap ${
                periodFilter === "year"
                  ? "border-[#739C9C] text-[#739C9C] font-semibold"
                  : "border-transparent text-[#00101F]"
              }`}
            >
              Рік
            </button>
          </div>
        </div>
      </div>

      {isLoadingWorst ? (
        <LoadingSkeleton />
      ) : (
        <ManagerPerformanceBars data={transformedData} isPositive={false} />
      )}
    </div>
  );
};

export default WorstManagersWrapper;
