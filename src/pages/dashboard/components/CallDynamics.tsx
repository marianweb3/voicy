import { useState } from "react";
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

interface RangeTab {
  value: "week" | "month" | "year";
  label: string;
}

interface CallDynamicsProps {
  title?: string;
  chartData?: ChartDataItem[];
  typeOptions?: TypeOption[];
  rangeTabs?: RangeTab[];
  defaultTypeFilter?: "calls" | "ai_avg";
  defaultRangeFilter?: "week" | "month" | "year";
  showDropdown?: boolean;
  showRangeTabs?: boolean;
  className?: string;
}

const CallDynamics = ({
  title = "Динаміка дзвінків",
  chartData = [
    { day: "Понеділок", calls: 4.0 },
    { day: "Вівторок", calls: 8.2 },
    { day: "Середа", calls: 7.1 },
    { day: "Четвер", calls: 5.8 },
    { day: "П'ятниця", calls: 8.5 },
    { day: "Субота", calls: 4.9 },
    { day: "Неділя", calls: 9.5 },
  ],
  typeOptions = [
    { value: "calls", label: "Дзвінки" },
    { value: "ai_avg", label: "AI Середній" },
  ],
  rangeTabs = [
    { value: "week", label: "Тиждень" },
    { value: "month", label: "Місяць" },
    { value: "year", label: "Рік" },
  ],
  defaultTypeFilter = "calls",
  defaultRangeFilter = "week",
  showDropdown = true,
  showRangeTabs = true,
  className = "",
}: CallDynamicsProps) => {
  const [typeFilter, setTypeFilter] = useState(defaultTypeFilter);
  const [rangeFilter, setRangeFilter] = useState(defaultRangeFilter);

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
          <h2 className="text-[#00101F] text-[20px] md:text-[24px] leading-[100%] font-semibold">
            {title}
          </h2>
          {showDropdown && (
            <Dropdown
              options={typeOptions}
              value={typeFilter}
              onChange={(value) => setTypeFilter(value as "calls" | "ai_avg")}
              variant="minimal"
              className="w-auto min-w-[150px]"
            />
          )}
        </div>

        {showRangeTabs && (
          <div className="w-full border-b border-[#EAEAEA]">
            <div className="flex gap-6 md:gap-10 overflow-x-auto">
              {rangeTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setRangeFilter(tab.value)}
                  className={`py-[10.5px] border-b-[3px] text-[14px] leading-[100%] transition-colors whitespace-nowrap ${
                    rangeFilter === tab.value
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

      <CallDynamicsChart data={chartData} typeFilter={typeFilter} />
    </div>
  );
};

export default CallDynamics;
