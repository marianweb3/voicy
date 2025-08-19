import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Dropdown } from "../../components/ui/dropdown";
import { SearchableDropdown } from "../../components/ui/searchable-dropdown";
import { IoSearch } from "react-icons/io5";
import { BiRefresh } from "react-icons/bi";
import { MdOutlineStar, MdOutlineStarBorder } from "react-icons/md";
import { IoMdArrowForward } from "react-icons/io";
import Pagination from "../users/components/Pagination";
import { useCalls, useManagersForDropdown } from "../../hooks/useCalls";
import useDebounce from "../../hooks/useDebounce";

const CallsPage = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [managerFilter, setManagerFilter] = useState<number | undefined>(
    undefined
  );
  const [managerSearchTerm, setManagerSearchTerm] = useState("");
  const [verificationFilter, setVerificationFilter] = useState<
    number | undefined
  >(undefined);
  const [ratingFilter, setRatingFilter] = useState("");
  const [reasonFilter, setReasonFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Debounce the main search value
  const debouncedSearchValue = useDebounce(searchValue, 500);

  // Use the useCalls hook to fetch data
  const {
    calls,
    pagination,
    timeUpdate,
    isLoadingCalls,
    callsError,
    refetchCalls,
  } = useCalls(
    currentPage,
    itemsPerPage,
    debouncedSearchValue,
    managerFilter,
    verificationFilter,
    ratingFilter,
    reasonFilter,
    statusFilter
  );

  // Fetch managers for dropdown
  const { managers, isLoadingManagers } =
    useManagersForDropdown(managerSearchTerm);

  // Remove the static sample data
  const allCalls = calls;

  // Filter options
  const managerOptions = [
    { value: "", label: "Менеджер" },
    ...managers.map((manager) => ({
      value: manager.id.toString(),
      label: manager.name,
    })),
  ];

  const verificationOptions = [
    { value: "", label: "Перевірка" },
    { value: "0", label: "Ні" },
    { value: "1", label: "Так" },
  ];

  const ratingOptions = [
    { value: "", label: "AI-оцінка" },
    { value: "90-100", label: "Висока (90-100)" },
    { value: "70-89", label: "Середня (70-89)" },
    { value: "50-69", label: "Низька (50-69)" },
    { value: "0-49", label: "Дуже низька (0-49)" },
  ];

  const reasonOptions = [
    { value: "", label: "Причина відмови" },
    { value: "expensive", label: "Дорого" },
    { value: "no_trust", label: "Немає довіри" },
    { value: "thinking", label: "Думає" },
    { value: "no_budget", label: "Немає бюджету" },
    { value: "weak_followup", label: "Менеджер не дотиснув" },
    { value: "already_bought", label: "Вже купив" },
  ];

  const statusOptions = [
    { value: "", label: "Статус" },
    { value: "done", label: "Виконано" },
    { value: "waiting", label: "Очікування" },
    { value: "in_progress", label: "В процесі" },
  ];

  // Since filtering is now handled by the API, we use the calls directly
  const currentCalls = allCalls;
  const totalItems = pagination?.total || 0;
  const totalPages = pagination?.total_pages || 1;

  const renderRating = (aiScore: string, aiColor: string) => {
    if (!aiScore || aiScore === "0" || aiScore === "-") {
      return (
        <div className="flex items-center gap-1">
          <MdOutlineStarBorder size={16} className="text-[#D9D9D9]" />
          <span className="text-[#9A9A9A] text-[14px]">-</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1">
        <MdOutlineStar size={16} style={{ color: aiColor }} />
        <span
          className="text-[#00101F] text-[14px] font-medium"
          style={{ color: aiColor }}
        >
          {aiScore}
        </span>
      </div>
    );
  };

  const handleRefresh = () => {
    refetchCalls();
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

  const handleCallClick = (callId: number) => {
    navigate(`/calls/${callId}`);
  };

  const handleManagerFilterChange = (value: string) => {
    setManagerFilter(value ? parseInt(value) : undefined);
    setCurrentPage(1);
  };

  const handleManagerSearchChange = (search: string) => {
    setManagerSearchTerm(search);
  };

  const handleVerificationFilterChange = (value: string) => {
    setVerificationFilter(value ? parseInt(value) : undefined);
    setCurrentPage(1);
  };

  const handleRatingFilterChange = (value: string) => {
    setRatingFilter(value);
    setCurrentPage(1);
  };

  const handleReasonFilterChange = (value: string) => {
    setReasonFilter(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  return (
    <div className="w-full flex flex-col gap-4 md:gap-6 max-w-[1400px] mx-auto">
      {/* Main Section */}
      <div className="bg-[#FFFFFF] rounded-2xl p-3 md:p-4 lg:p-6 flex flex-col gap-3 md:gap-4 lg:gap-6">
        {/* Header */}
        <div className="flex flex-col gap-3 md:gap-4 lg:gap-6">
          {/* Title and Search */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 md:gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 md:gap-3">
                <h1 className="text-[#00101F] font-semibold text-[20px] md:text-[24px] lg:text-[32px] leading-[100%]">
                  Дзвінки
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
                  {timeUpdate || "N/A"}
                </span>
              </div>
            </div>
            <Input
              placeholder="Пошук по ID або номеру клієнта"
              value={searchValue}
              onChange={handleSearchChange}
              icon={<IoSearch size={16} />}
              iconPosition="left"
              containerClassName="w-full lg:max-w-[400px]"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
            <span className="text-[#00101F] text-[14px] md:text-[16px] font-semibold">
              Фільтри:
            </span>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-3 w-full sm:w-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex gap-2 md:gap-3">
                <SearchableDropdown
                  options={managerOptions}
                  value={managerFilter?.toString() || ""}
                  onChange={handleManagerFilterChange}
                  onSearchChange={handleManagerSearchChange}
                  placeholder="Менеджер"
                  searchPlaceholder="Пошук менеджера..."
                  variant="default"
                  size="sm"
                  isLoading={isLoadingManagers}
                  className="w-full sm:w-auto sm:min-w-[120px] md:min-w-[200px]"
                />
                <Dropdown
                  options={verificationOptions}
                  value={verificationFilter?.toString() || ""}
                  onChange={handleVerificationFilterChange}
                  variant="default"
                  size="sm"
                  className="w-full sm:w-auto [&>button]:!py-[14.5px]  sm:min-w-[120px] md:min-w-[200px]"
                />
                <Dropdown
                  options={ratingOptions}
                  value={ratingFilter}
                  onChange={handleRatingFilterChange}
                  variant="default"
                  size="sm"
                  className="w-full sm:w-auto [&>button]:!py-[14.5px]  sm:min-w-[120px] md:min-w-[200px]"
                />
              </div>
              <div className="grid grid-cols-2 sm:flex gap-2 md:gap-3">
                <Dropdown
                  options={reasonOptions}
                  value={reasonFilter}
                  onChange={handleReasonFilterChange}
                  variant="default"
                  size="sm"
                  className="w-full sm:w-auto [&>button]:!py-[14.5px]  sm:min-w-[120px] md:min-w-[200px]"
                />
                <Dropdown
                  options={statusOptions}
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  variant="default"
                  size="sm"
                  className="w-full sm:w-auto [&>button]:!py-[14.5px]  sm:min-w-[120px] md:min-w-[200px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoadingCalls && !calls.length && (
          <div className="flex items-center justify-center py-12">
            <div className="text-[#9A9A9A] text-[16px]">
              Завантаження дзвінків...
            </div>
          </div>
        )}

        {/* Error State */}
        {callsError && (
          <div className="flex items-center justify-center py-12">
            <div className="text-[#B24545] text-[16px]">
              Помилка завантаження: {callsError.message}
            </div>
          </div>
        )}

        {/* Desktop Table View */}
        {!isLoadingCalls && !callsError && (
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#F0F0F0]">
                  <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-0">
                    ID
                  </th>
                  <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-0">
                    Дата
                  </th>
                  <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-0">
                    Менеджер
                  </th>
                  <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-0">
                    Перевірка
                  </th>
                  <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-0">
                    Тривалість
                  </th>
                  <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-0">
                    Телефон клієнта
                  </th>
                  <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-0">
                    AI-оцінка
                  </th>
                  <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-0">
                    Причина відмови
                  </th>
                  <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-0">
                    Статус
                  </th>
                  <th className="text-right text-[#9A9A9A] text-[16px] font-normal py-3 px-0"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {currentCalls.map((call, index) => (
                  <tr
                    key={`${call.id}-${index}`}
                    className="hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                    onClick={() => call.can_open && handleCallClick(call.id)}
                  >
                    <td className="py-3 pl-4">
                      <span className="text-[#00101F] text-[16px] font-medium leading-[100%]">
                        #{call.id}
                      </span>
                    </td>
                    <td className="py-3 px-0">
                      <div className="flex flex-col">
                        <span className="text-[#00101F] text-[16px] font-semibold leading-[100%]">
                          {call.time}
                        </span>
                        <span className="text-[#9A9A9A] text-[16px] leading-[100%] mt-1">
                          {call.date}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-0">
                      <div className="flex items-center gap-3">
                        <img
                          src={call.manager_photo}
                          alt={call.manager_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-[#00101F] text-[16px] font-normal leading-[100%]">
                          {call.manager_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-0">
                      <span className="text-[#00101F] text-[16px] font-normal leading-[100%]">
                        {call.check ? "Так" : "Ні"}
                      </span>
                    </td>
                    <td className="py-3 px-0">
                      <span className="text-[#00101F] text-[16px] font-normal leading-[100%]">
                        {call.duration_call}
                      </span>
                    </td>
                    <td className="py-3 px-0">
                      <span className="text-[#00101F] text-[16px] font-normal leading-[100%]">
                        {call.client_phone}
                      </span>
                    </td>
                    <td className="py-3 px-0">
                      {renderRating(call.ai_score, call.ai_color)}
                    </td>
                    <td className="py-3 px-0">
                      <span className="text-[#00101F] text-[16px] font-normal leading-[100%] max-w-[200px] truncate">
                        {call.reject_reason}
                      </span>
                    </td>
                    <td className="py-3 px-0">
                      <span
                        className={`inline-flex max-w-[140px] w-full justify-center items-center px-2 py-[9px] rounded-[8px] text-[14px] font-semibold`}
                        style={{
                          backgroundColor: `${call.status_color}1A`,
                          color: call.status_color,
                        }}
                      >
                        {call.status_label}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center justify-end">
                        {call.can_open && (
                          <button
                            className="w-8 h-8 rounded-[8px] bg-[#EBF0F0] flex items-center justify-center hover:bg-[#D1E5E5] transition-colors group"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCallClick(call.id);
                            }}
                          >
                            <IoMdArrowForward
                              size={16}
                              className="text-[#739C9C] group-hover:text-[#5F8888]"
                            />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile/Tablet Card View */}
        {!isLoadingCalls && !callsError && (
          <div className="lg:hidden space-y-3">
            {currentCalls.map((call, index) => (
              <div
                key={`${call.id}-${index}`}
                className="bg-white border border-[#F0F0F0] rounded-[12px] p-4 hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                onClick={() => call.can_open && handleCallClick(call.id)}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-col">
                    <span className="text-[#00101F] text-[16px] font-medium leading-[100%]">
                      #{call.id}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[#00101F] text-[14px] font-semibold">
                        {call.time}
                      </span>
                      <span className="text-[#9A9A9A] text-[14px]">
                        {call.date}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-[8px] text-[12px] font-semibold`}
                      style={{
                        backgroundColor: call.status_color,
                      }}
                    >
                      {call.status_label}
                    </span>
                    {call.can_open && (
                      <button
                        className="w-8 h-8 rounded-[8px] bg-[#EBF0F0] flex items-center justify-center hover:bg-[#D1E5E5] transition-colors group"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCallClick(call.id);
                        }}
                      >
                        <IoMdArrowForward
                          size={16}
                          className="text-[#739C9C] group-hover:text-[#5F8888]"
                        />
                      </button>
                    )}
                  </div>
                </div>

                {/* Manager and Details */}
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={call.manager_photo}
                    alt={call.manager_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-[#00101F] text-[14px] font-medium">
                    {call.manager_name}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-[12px]">
                  <div>
                    <span className="text-[#9A9A9A]">Тривалість:</span>
                    <span className="text-[#00101F] ml-1">
                      {call.duration_call}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#9A9A9A]">Перевірка:</span>
                    <span className="text-[#00101F] ml-1">
                      {call.check ? "Так" : "Ні"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#9A9A9A]">Телефон:</span>
                    <span className="text-[#00101F] ml-1">
                      {call.client_phone}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[#9A9A9A] mr-2">AI-оцінка:</span>
                    {renderRating(call.ai_score, call.ai_color)}
                  </div>
                  {call.reject_reason && call.reject_reason !== "-" && (
                    <div className="col-span-2">
                      <span className="text-[#9A9A9A]">Причина:</span>
                      <span className="text-[#00101F] ml-1">
                        {call.reject_reason}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoadingCalls && !callsError && calls.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-[#9A9A9A] text-[14px]">
              Всього {totalItems} Записів
            </span>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CallsPage;
