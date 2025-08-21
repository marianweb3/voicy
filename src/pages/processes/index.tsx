import { useState, useMemo } from "react";
import { Input } from "../../components/ui/input";
import { Dropdown } from "../../components/ui/dropdown";
import { DatePicker } from "../../components/ui/datepicker";
import { IoSearch } from "react-icons/io5";
import { BiRefresh } from "react-icons/bi";
import Pagination from "../users/components/Pagination";
import { AiOutlineStop } from "react-icons/ai";
import { AIAnalysis, FoundedCalls, SendToTelegram, VoiceToText } from "./icons";
import { useProcesses, useProcessesCatalog } from "../../hooks/useProcesses";

import { ProcessTask } from "../../services/api";

// Skeleton loader component with shimmer effect
const SkeletonLoader = ({
  className,
  children,
}: {
  className: string;
  children?: React.ReactNode;
}) => (
  <div
    className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] ${className}`}
  >
    {children}
  </div>
);

const ProcessesPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch process statistics
  const {
    processStatistics,
    timeUpdate,
    isLoadingProcesses,
    refetchProcesses,
  } = useProcesses();

  // Fetch process catalog/tasks
  const {
    tasks,
    pagination,
    filters,
    isLoadingCatalog,
    isFetchingCatalog,
    refetchCatalog,
  } = useProcessesCatalog(
    currentPage,
    itemsPerPage,
    searchValue,
    stageFilter,
    statusFilter,
    dateFrom,
    dateTo
  );

  // Statistics data mapping from API response
  const stats = useMemo(() => {
    if (!processStatistics) {
      return [];
    }

    return [
      {
        id: "total",
        value: processStatistics.total.count.toLocaleString(),
        label: "Отримані дзвінки",
        percentage: `${processStatistics.total.percent}%`,
        color: "#B24545",
        bgColor: "#B245451A",
        icon: <AiOutlineStop color="#B24545" />,
      },
      {
        id: "search_call",
        value: processStatistics.search_call.count.toLocaleString(),
        label: "Знайдені дзвінки",
        percentage: `${processStatistics.search_call.percent}%`,
        color: "#62B245",
        bgColor: "#62B2451A",
        icon: <FoundedCalls />,
      },
      {
        id: "voice_to_text",
        value: processStatistics.voice_to_text.count.toLocaleString(),
        label: "Розпізнавання тексту",
        percentage: `${processStatistics.voice_to_text.percent}%`,
        color: "#4573B2",
        bgColor: "#4573B21A",
        icon: <VoiceToText />,
      },
      {
        id: "ai",
        value: processStatistics.ai.count.toLocaleString(),
        label: "AI-аналіз",
        percentage: `${processStatistics.ai.percent}%`,
        color: "#B2A945",
        bgColor: "#B2A9451A",
        icon: <AIAnalysis />,
      },
      {
        id: "sent",
        value: processStatistics.sent.count.toLocaleString(),
        label: "Відправка в Telegram",
        percentage: `${processStatistics.sent.percent}%`,
        color: "#4573B2",
        bgColor: "#4573B21A",
        icon: <SendToTelegram />,
      },
    ];
  }, [processStatistics]);

  // Filter options from API
  const statusOptions = useMemo(() => {
    if (!filters?.statuses) {
      return [{ value: "all", label: "Стан" }];
    }
    return filters.statuses;
  }, [filters]);

  const stageOptions = useMemo(() => {
    if (!filters?.stages) {
      return [{ value: "all", label: "Етап" }];
    }
    return filters.stages;
  }, [filters]);

  // Use tasks from API directly (no client-side filtering needed)
  const currentTasks = tasks;
  const totalItems = pagination?.total || 0;
  const totalPages = pagination?.total_pages || 0;

  const getStatusColor = (statusLabel: string) => {
    // Map status labels to colors - can be enhanced based on actual status labels from API
    if (statusLabel.includes("Успішно") || statusLabel.includes("success")) {
      return "text-[#62B245] bg-[#62B2451A]";
    }
    if (statusLabel.includes("роботі") || statusLabel.includes("working")) {
      return "text-[#B2A945] bg-[#B2A9451A]";
    }
    if (statusLabel.includes("Помилка") || statusLabel.includes("error")) {
      return "text-[#B24545] bg-[#B245451A]";
    }
    return "text-[#9A9A9A] bg-[#F5F5F5]";
  };

  const handleRefresh = () => {
    refetchProcesses();
    refetchCatalog();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="w-full flex flex-col gap-4 md:gap-6 max-w-[1400px] mx-auto">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2 md:gap-4 lg:gap-4">
        {isLoadingProcesses
          ? // Loading skeleton for stats
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="bg-[#FFFFFF] rounded-[12px] md:rounded-[16px] p-3 md:p-4 lg:p-6 flex items-center gap-2 md:gap-3 lg:gap-4 animate-pulse"
              >
                <div className="size-8 md:size-12 lg:size-14 shrink-0 rounded-[6px] md:rounded-[8px] bg-gray-200"></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start flex-wrap gap-1 md:gap-2 mb-1">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-5 bg-gray-200 rounded w-12"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))
          : stats.map((stat) => (
              <div
                key={stat.id}
                className="bg-[#FFFFFF] rounded-[12px] md:rounded-[16px] p-3 md:p-4 lg:p-6 flex items-center gap-2 md:gap-3 lg:gap-4"
              >
                <div
                  className="size-8 md:size-12 lg:size-14 shrink-0 rounded-[6px] md:rounded-[8px] flex items-center justify-center text-[16px] md:text-[20px] lg:text-[24px]"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  {stat.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start flex-wrap gap-1 md:gap-2 mb-1">
                    <h3 className="text-[#00101F] text-[16px] md:text-[20px] lg:text-[20px] leading-[100%] font-semibold">
                      {stat.value}
                    </h3>
                    <div
                      className="shrink-0 flex items-center justify-center px-2 rounded-[12px] md:rounded-[24px]"
                      style={{ backgroundColor: stat.bgColor }}
                    >
                      <span
                        className="text-[10px] md:text-[12px] lg:text-[14px] font-semibold"
                        style={{ color: stat.color }}
                      >
                        {stat.percentage}
                      </span>
                    </div>
                  </div>
                  <p className="text-[#9A9A9A] text-[10px] md:text-[12px] lg:text-[12px] leading-[100%]">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
      </div>

      {/* Tasks Section */}
      <div className="bg-[#FFFFFF] rounded-2xl p-3 md:p-4 lg:p-6 flex flex-col gap-3 md:gap-4 lg:gap-6">
        {/* Filters */}
        <div className="flex flex-col gap-3 md:gap-4 lg:gap-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 md:gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 md:gap-3">
                <h1 className="text-[#00101F] font-semibold text-[20px] md:text-[24px] lg:text-[32px] leading-[100%]">
                  Задачі
                </h1>
                <button
                  onClick={handleRefresh}
                  className="size-7 md:size-8 lg:size-10 rounded-[8px] md:rounded-[12px] flex items-center justify-center bg-[#EBF0F0] hover:bg-[#D1E5E5] transition-colors duration-200 group"
                >
                  <BiRefresh
                    size={16}
                    className="text-[#739C9C] group-hover:text-[#5F8888] transition-colors duration-200 md:w-5 md:h-5 lg:w-6 lg:h-6"
                  />
                </button>
              </div>
              <div className="flex gap-1">
                <span className="text-[#9A9A9A] text-[10px] md:text-[12px] lg:text-[14px] leading-[100%]">
                  останнє оновлення:
                </span>
                <span className="font-semibold text-[10px] md:text-[12px] lg:text-[14px] leading-[100%] text-[#00101F]">
                  {timeUpdate || "—"}
                </span>
              </div>
            </div>
            <Input
              placeholder="Пошук по ID задачі"
              value={searchValue}
              onChange={handleSearchChange}
              icon={<IoSearch size={16} />}
              iconPosition="left"
              containerClassName="w-full lg:max-w-[400px]"
            />
          </div>

          {/* Filters Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
            <span className="text-[#00101F] text-[14px] md:text-[16px] font-semibold">
              Фільтри:
            </span>

            {isLoadingCatalog && !filters ? (
              // Filters skeleton
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-3 w-full sm:w-auto animate-pulse">
                <div className="grid grid-cols-2 sm:flex gap-2 md:gap-3">
                  <SkeletonLoader className="h-[42px] rounded-[12px] w-full sm:min-w-[120px] md:min-w-[150px]" />
                  <SkeletonLoader className="h-[42px] rounded-[12px] w-full sm:min-w-[120px] md:min-w-[150px]" />
                </div>
                <div className="grid grid-cols-2 sm:flex gap-2 md:gap-3">
                  <SkeletonLoader className="h-[42px] rounded-[12px] w-full sm:min-w-[120px] md:min-w-[150px]" />
                  <SkeletonLoader className="h-[42px] rounded-[12px] w-full sm:min-w-[120px] md:min-w-[150px]" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-3 w-full sm:w-auto">
                <div className="grid grid-cols-2 sm:flex gap-2 md:gap-3">
                  <Dropdown
                    options={statusOptions}
                    value={statusFilter}
                    onChange={setStatusFilter}
                    variant="default"
                    size="sm"
                    className="w-full sm:w-auto [&>button]:!py-[14.5px]  sm:min-w-[120px] md:min-w-[150px]"
                  />
                  <Dropdown
                    options={stageOptions}
                    value={stageFilter}
                    onChange={setStageFilter}
                    variant="default"
                    size="sm"
                    className="w-full sm:w-auto [&>button]:!py-[14.5px]  sm:min-w-[120px] md:min-w-[150px]"
                  />
                </div>
                <div className="grid grid-cols-2 sm:flex gap-2 md:gap-3">
                  <DatePicker
                    value={dateFrom}
                    onChange={setDateFrom}
                    placeholder="Дата від"
                    size="sm"
                    className="w-full sm:w-auto [&>button]:!py-[14.5px]  sm:min-w-[120px] md:min-w-[150px]"
                  />
                  <DatePicker
                    value={dateTo}
                    onChange={setDateTo}
                    placeholder="Дата до"
                    size="sm"
                    className="w-full sm:w-auto [&>button]:!py-[14.5px]  sm:min-w-[120px] md:min-w-[150px]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          {isLoadingCatalog && !isFetchingCatalog ? (
            // Enhanced loading skeleton for table
            <div className="w-full">
              {/* Table header skeleton */}
              <div className="border-b border-[#F0F0F0] pb-3 mb-4">
                <div className="flex items-center justify-between animate-pulse">
                  <SkeletonLoader className="h-4 rounded w-8" />
                  <SkeletonLoader className="h-4 rounded w-24" />
                  <SkeletonLoader className="h-4 rounded w-16" />
                  <SkeletonLoader className="h-4 rounded w-12" />
                </div>
              </div>

              {/* Table rows skeleton */}
              <div className="space-y-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-[#F5F5F5] animate-pulse"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* ID column */}
                    <div className="flex-1">
                      <SkeletonLoader className="h-4 rounded w-16" />
                    </div>

                    {/* Date/Time column */}
                    <div className="flex-1">
                      <div className="space-y-1">
                        <SkeletonLoader className="h-4 rounded w-12" />
                        <SkeletonLoader className="h-3 rounded w-20" />
                      </div>
                    </div>

                    {/* Stage column */}
                    <div className="flex-1">
                      <SkeletonLoader className="h-4 rounded w-32" />
                    </div>

                    {/* Status column */}
                    <div className="flex-1">
                      <SkeletonLoader className="h-6 rounded-lg w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#F0F0F0]">
                  <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-0">
                    ID
                  </th>
                  <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-0">
                    Дата створення
                  </th>
                  <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-0">
                    Етап
                  </th>
                  <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-0">
                    Статус
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {currentTasks.map((task: ProcessTask, index: number) => (
                  <tr
                    key={`${task.id}-${index}`}
                    className="hover:bg-[#FAFAFA] transition-colors"
                  >
                    <td className="py-3 pl-4">
                      <span className="text-[#00101F] text-[16px] font-medium leading-[100%]">
                        {task.id}
                      </span>
                    </td>
                    <td className="py-3 px-0">
                      <div className="flex flex-col">
                        <span className="text-[#00101F] text-[16px] font-semibold leading-[100%]">
                          {task.time}
                        </span>
                        <span className="text-[#9A9A9A] text-[16px] leading-[100%] mt-1">
                          {task.date}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-0">
                      <span className="text-[#00101F] text-[16px] font-normal leading-[100%]">
                        {task.stage_label}
                      </span>
                    </td>
                    <td className="py-3 px-0">
                      <span
                        className={`inline-flex max-w-fit w-full justify-center items-center px-2 py-[9px] rounded-[8px] text-[14px] font-semibold ${getStatusColor(
                          task.status_label
                        )}`}
                      >
                        {task.status_label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {isLoadingCatalog && !isFetchingCatalog
            ? // Enhanced loading skeleton for mobile cards
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white border border-[#F0F0F0] rounded-[12px] p-4 animate-pulse"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Header Row Skeleton */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="flex items-center space-x-2">
                        <div className="h-3 bg-gray-200 rounded w-12"></div>
                        <div className="h-3 bg-gray-100 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded-lg w-18"></div>
                  </div>

                  {/* Details Row Skeleton */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="h-3 bg-gray-100 rounded w-10"></div>
                      <div className="h-3 bg-gray-200 rounded w-28"></div>
                    </div>
                  </div>
                </div>
              ))
            : currentTasks.map((task: ProcessTask, index: number) => (
                <div
                  key={`${task.id}-${index}`}
                  className="bg-white border border-[#F0F0F0] rounded-[12px] p-4 hover:bg-[#FAFAFA] transition-colors"
                >
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col">
                      <span className="text-[#00101F] text-[16px] font-medium leading-[100%]">
                        {task.id}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[#00101F] text-[14px] font-semibold">
                          {task.time}
                        </span>
                        <span className="text-[#9A9A9A] text-[14px]">
                          {task.date}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-[8px] text-[12px] font-semibold ${getStatusColor(
                        task.status_label
                      )}`}
                    >
                      {task.status_label}
                    </span>
                  </div>

                  {/* Details Row */}
                  <div className="space-y-2 text-[14px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#9A9A9A]">Етап:</span>
                      <span className="text-[#00101F] font-medium">
                        {task.stage_label}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Pagination */}
        <div
          className={`transition-opacity duration-200 ${
            isFetchingCatalog ? "opacity-50" : "opacity-100"
          }`}
        >
          {isLoadingCatalog && !pagination ? (
            // Pagination skeleton
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-pulse">
              <div className="flex items-center gap-2">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
                <div className="h-4 bg-gray-200 rounded w-8"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 bg-gray-200 rounded w-8"></div>
                <div className="h-8 bg-gray-200 rounded w-8"></div>
                <div className="h-8 bg-gray-200 rounded w-8"></div>
                <div className="h-8 bg-gray-200 rounded w-8"></div>
                <div className="h-8 bg-gray-200 rounded w-8"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 bg-gray-200 rounded w-12"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ) : (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessesPage;
