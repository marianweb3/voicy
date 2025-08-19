import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "../../../../components/ui/input";
import { IoSearch } from "react-icons/io5";
import { MdOutlineStar, MdOutlineStarBorder } from "react-icons/md";
import { IoMdArrowForward } from "react-icons/io";
import { useManagerCalls } from "../../../../hooks/useManagers";
import useDebounce from "../../../../hooks/useDebounce";
import Pagination from "../../../users/components/Pagination";

const LastCalls = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const managerId = id ? parseInt(id) : 0;

  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Debounce search value to avoid too many API calls
  const debouncedSearchValue = useDebounce(searchValue, 500);

  // Use the API hook
  const {
    calls,
    pagination,
    timeUpdate,
    isLoadingManagerCalls,
    managerCallsError,
  } = useManagerCalls(
    managerId,
    currentPage,
    itemsPerPage,
    debouncedSearchValue
  );

  // Reset to first page when search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const handleCallClick = (callId: number, canOpen: boolean) => {
    if (canOpen) {
      navigate(`/calls/${callId}`);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Format phone number like: 380991998317 -> +38 (099) 199 83 17
    if (phone.length === 12 && phone.startsWith("380")) {
      return `+38 (${phone.substring(3, 6)}) ${phone.substring(
        6,
        9
      )} ${phone.substring(9, 11)} ${phone.substring(11)}`;
    }
    return phone;
  };

  const renderRating = (score: string, color: string) => {
    if (!score || score === "0" || score === "0.0") {
      return (
        <div className="flex items-center gap-1">
          <MdOutlineStarBorder size={16} className="text-[#D9D9D9]" />
          <span className="text-[#9A9A9A] text-[14px]">-</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1">
        <MdOutlineStar size={16} style={{ color }} />
        <span
          className="text-[#00101F] text-[14px] font-medium"
          style={{ color }}
        >
          {score}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col bg-[#FFFFFF] rounded-2xl p-4 md:p-6 gap-4 md:gap-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[#00101F] font-semibold text-[20px] md:text-[24px] leading-[100%]">
            Останні дзвінки
          </h2>
          {timeUpdate && (
            <span className="text-[#9A9A9A] text-[12px] md:text-[14px] leading-[100%]">
              останнє оновлення: {timeUpdate}
            </span>
          )}
        </div>

        <Input
          placeholder="Пошук по ID або номеру клієнта"
          value={searchValue}
          onChange={handleSearchChange}
          icon={<IoSearch size={18} />}
          iconPosition="left"
          containerClassName="w-full lg:!max-w-[400px]"
        />
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        {isLoadingManagerCalls ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-[#9A9A9A]">Завантаження...</div>
          </div>
        ) : managerCallsError ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-red-500">
              Помилка завантаження:{" "}
              {managerCallsError?.message || "Невідома помилка"}
            </div>
          </div>
        ) : (
          <table className="w-full">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-[#F0F0F0]">
                <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-0">
                  Дата
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
                  Статус
                </th>
                <th className="text-right text-[#9A9A9A] text-[16px] font-normal py-3 px-0"></th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-[#F0F0F0]">
              {calls.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="text-[#9A9A9A]">
                      {debouncedSearchValue
                        ? "Дзвінків не знайдено"
                        : "Немає дзвінків"}
                    </div>
                  </td>
                </tr>
              ) : (
                calls.map((call) => (
                  <tr
                    key={call.id}
                    className="hover:bg-[#FAFAFA] transition-colors"
                  >
                    {/* Date & Time */}
                    <td className="py-3 pl-4">
                      <div className="flex flex-col">
                        <span className="text-[#00101F] text-[16px] font-semibold leading-[100%]">
                          {call.time}
                        </span>
                        <span className="text-[#9A9A9A] text-[16px] leading-[100%] mt-1">
                          {call.date}
                        </span>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="py-3 px-0">
                      <span className="text-[#00101F] text-[16px] font-normal leading-[100%]">
                        {call.duration}
                      </span>
                    </td>

                    {/* Client Phone */}
                    <td className="py-3 px-0">
                      <span className="text-[#00101F] text-[16px] font-normal leading-[100%]">
                        {formatPhoneNumber(call.client_phone)}
                      </span>
                    </td>

                    {/* AI Rating */}
                    <td className="py-3 px-0">
                      {renderRating(call.ai_score, call.ai_color)}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-0">
                      <span
                        className="inline-flex max-w-[140px] w-full justify-center items-center px-2 py-[9px] rounded-[8px] text-[14px] font-semibold"
                        style={{
                          color: call.status_color,
                          backgroundColor: `${call.status_color}1A`,
                        }}
                      >
                        {call.status_label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 pr-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() =>
                            handleCallClick(call.id, call.can_open)
                          }
                          disabled={!call.can_open}
                          className={`w-8 h-8 rounded-[8px] flex items-center justify-center transition-colors group ${
                            call.can_open
                              ? "bg-[#EBF0F0] hover:bg-[#D1E5E5] cursor-pointer"
                              : "bg-gray-200 cursor-not-allowed"
                          }`}
                        >
                          <IoMdArrowForward
                            size={16}
                            className={
                              call.can_open
                                ? "text-[#739C9C] group-hover:text-[#5F8888]"
                                : "text-gray-400"
                            }
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {isLoadingManagerCalls ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-[#9A9A9A]">Завантаження...</div>
          </div>
        ) : managerCallsError ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-red-500">
              Помилка завантаження:{" "}
              {managerCallsError?.message || "Невідома помилка"}
            </div>
          </div>
        ) : calls.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-[#9A9A9A]">
              {debouncedSearchValue ? "Дзвінків не знайдено" : "Немає дзвінків"}
            </div>
          </div>
        ) : (
          calls.map((call) => (
            <div
              key={call.id}
              className="bg-white border border-[#F0F0F0] rounded-[12px] p-4 hover:bg-[#FAFAFA] transition-colors"
            >
              {/* Header Row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[#00101F] text-[14px] font-medium">
                      {call.time}
                    </span>
                    <span className="text-[#9A9A9A] text-[12px]">
                      {call.date}
                    </span>
                  </div>
                  <span className="text-[#9A9A9A] text-[12px] mt-1">
                    {call.duration}
                  </span>
                </div>

                <button
                  onClick={() => handleCallClick(call.id, call.can_open)}
                  disabled={!call.can_open}
                  className={`w-8 h-8 rounded-[8px] flex items-center justify-center transition-colors group ${
                    call.can_open
                      ? "bg-[#EBF0F0] hover:bg-[#D1E5E5] cursor-pointer"
                      : "bg-gray-200 cursor-not-allowed"
                  }`}
                >
                  <IoMdArrowForward
                    size={16}
                    className={
                      call.can_open
                        ? "text-[#739C9C] group-hover:text-[#5F8888]"
                        : "text-gray-400"
                    }
                  />
                </button>
              </div>

              {/* Details Row */}
              <div className="space-y-2 text-[14px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#9A9A9A]">Телефон:</span>
                  <span className="text-[#00101F]">
                    {formatPhoneNumber(call.client_phone)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#9A9A9A]">AI-оцінка:</span>
                  {renderRating(call.ai_score, call.ai_color)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#9A9A9A]">Статус:</span>
                  <span
                    className="inline-flex items-center px-2 py-1 rounded-[6px] text-[12px] font-medium"
                    style={{
                      color: call.status_color,
                      backgroundColor: `${call.status_color}1A`,
                    }}
                  >
                    {call.status_label}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.total_pages}
          totalItems={pagination.total}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
};

export default LastCalls;
