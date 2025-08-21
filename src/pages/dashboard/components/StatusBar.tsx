import { AiOutlineStop } from "react-icons/ai";
import { BsShieldExclamation } from "react-icons/bs";
import {
  MdOutlineLocalPhone,
  MdOutlinePhonePaused,
  MdOutlineStarOutline,
} from "react-icons/md";
import { useMemo } from "react";
import { useDashboard } from "../../../hooks/useDashboard";

const StatusBar = () => {
  const { dashboardKPIs, dashboardError, isLoadingDashboard } = useDashboard();

  // Loading skeleton data
  const loadingData = [
    {
      id: "calls",
      label: "Загальна кількість аналізів",
      icon: "phone" as const,
      iconColor: "#62B245",
      backgroundColor: "#62B2451A",
    },
    {
      id: "duration",
      label: "Середня тривалість дзвінка",
      icon: "pause" as const,
      iconColor: "#4573B2",
      backgroundColor: "#4573B21A",
    },
    {
      id: "online",
      label: "Загальний час на лінії",
      icon: "phone" as const,
      iconColor: "#45B245",
      backgroundColor: "#45B2451A",
    },
    {
      id: "rating",
      label: "Середня АІ-оцінка",
      icon: "star" as const,
      iconColor: "#B2A945",
      backgroundColor: "#B2A9451A",
    },
    {
      id: "weak_followup",
      label: "% слабкого дожиму",
      icon: "shield" as const,
      iconColor: "#B27D45",
      backgroundColor: "#B27D451A",
    },
  ];

  // Map API data to StatusBar format
  const data = useMemo(() => {
    if (!dashboardKPIs) {
      return [];
    }

    return [
      {
        id: "calls",
        value: dashboardKPIs.total_analyses.toLocaleString(),
        label: "Загальна кількість аналізів",
        icon: "phone" as const,
        iconColor: "#62B245",
        backgroundColor: "#62B2451A",
      },
      {
        id: "duration",
        value: dashboardKPIs.avg_call_duration,
        label: "Середня тривалість дзвінка",
        icon: "pause" as const,
        iconColor: "#4573B2",
        backgroundColor: "#4573B21A",
      },
      {
        id: "online",
        value: dashboardKPIs.total_on_line,
        label: "Загальний час на лінії",
        icon: "phone" as const,
        iconColor: "#45B245",
        backgroundColor: "#45B2451A",
      },
      {
        id: "rating",
        value: dashboardKPIs.ai_score_avg,
        label: "Середня АІ-оцінка",
        icon: "star" as const,
        iconColor: "#B2A945",
        backgroundColor: "#B2A9451A",
      },
      {
        id: "weak_followup",
        value: `${dashboardKPIs.weak_followup_pct}%`,
        label: "% слабкого дожиму",
        icon: "shield" as const,
        iconColor: "#B27D45",
        backgroundColor: "#B27D451A",
      },
    ];
  }, [dashboardKPIs]);

  const getIcon = (iconType: string, color: string) => {
    const iconProps = { color, className: "w-6 h-6 md:w-7 md:h-7" };

    switch (iconType) {
      case "phone":
        return <MdOutlineLocalPhone {...iconProps} />;
      case "stop":
        return <AiOutlineStop {...iconProps} />;
      case "pause":
        return <MdOutlinePhonePaused {...iconProps} />;
      case "star":
        return <MdOutlineStarOutline {...iconProps} />;
      case "shield":
        return <BsShieldExclamation {...iconProps} />;
      default:
        return <MdOutlineLocalPhone {...iconProps} />;
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => {
    const skeletonWidths = ["w-16", "w-20", "w-18", "w-14", "w-16"]; // Different widths for variety

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
        {loadingData.map((item, index) => (
          <div
            key={item.id}
            className="bg-[#FFFFFF] rounded-[16px] p-4 md:p-6 flex items-center gap-3 md:gap-4"
          >
            <div
              className="size-12 md:size-14 shrink-0 rounded-[6px] md:rounded-[8px] flex items-center justify-center animate-pulse"
              style={{ backgroundColor: item.backgroundColor }}
            >
              <div className="opacity-40">
                {getIcon(item.icon, item.iconColor)}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div
                className={`h-5 md:h-6 bg-gray-200 rounded-md mb-2 ${skeletonWidths[index]} animate-pulse`}
              ></div>
              <div className="h-3 md:h-3.5 bg-gray-100 rounded-md w-24 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {dashboardError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">
            Помилка завантаження даних панелі керування. Спробуйте оновити
            сторінку.
          </p>
        </div>
      )}

      {isLoadingDashboard ? (
        <LoadingSkeleton />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-[#FFFFFF] rounded-[16px] p-4 md:p-6 flex items-center gap-3 md:gap-4"
            >
              <div
                className="size-8 md:size-11 shrink-0 rounded-[6px] md:rounded-[8px] flex items-center justify-center"
                style={{ backgroundColor: item.backgroundColor }}
              >
                {getIcon(item.icon, item.iconColor)}
              </div>
              <div className="w-full flex-1">
                <h3 className="text-[#00101F] text-[20px] md:text-[24px] leading-[100%] font-semibold ">
                  {item.value}
                </h3>
                <p className="text-[#9A9A9A] text-[12px] md:text-[12px] leading-[100%] mt-1">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusBar;
