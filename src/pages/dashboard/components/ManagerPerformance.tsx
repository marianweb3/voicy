import { useState } from "react";
import ManagerPerformanceBars from "./ManagerPerformanceBars";

interface ManagerPerformanceProps {
  title: string;
  isPositive?: boolean;
}

const ManagerPerformance = ({
  title,
  isPositive = true,
}: ManagerPerformanceProps) => {
  const [periodFilter, setPeriodFilter] = useState("week");

  // Sample data for best managers
  const bestManagersData = [
    { name: "Владислав\nРоманов", rating: 9.3, isPositive: true },
    { name: "Дмитро\nРоманишин", rating: 9.1, isPositive: true },
    { name: "Віктор\nМорозенко", rating: 8.4, isPositive: true },
    { name: "Максим\nГрипільський", rating: 8.0, isPositive: true },
    { name: "Дмитро\nМисюченко", rating: 7.5, isPositive: true },
  ];

  // Sample data for worst managers
  const worstManagersData = [
    { name: "Владислав\nРоманов", rating: 3.5, isPositive: false },
    { name: "Дмитро\nРоманишин", rating: 3.0, isPositive: false },
    { name: "Віктор\nМорозенко", rating: 2.4, isPositive: false },
    { name: "Максим\nГрипільський", rating: 2.1, isPositive: false },
    { name: "Дмитро\nМисюченко", rating: 1.3, isPositive: false },
  ];

  const currentData = isPositive ? bestManagersData : worstManagersData;

  return (
    <div className="w-full bg-white p-4 md:p-6 rounded-2xl flex flex-col gap-4 md:gap-6">
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

      <ManagerPerformanceBars data={currentData} isPositive={isPositive} />
    </div>
  );
};

export default ManagerPerformance;
