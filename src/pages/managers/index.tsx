import { BiRefresh } from "react-icons/bi";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { IoSearch, IoStarSharp } from "react-icons/io5";
import { HiUserPlus } from "react-icons/hi2";
import { useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Pagination from "../users/components/Pagination";
import AddManagerModal from "./components/AddManagerModal";
import { IoMdArrowForward } from "react-icons/io";
import { useManagers } from "../../hooks/useManagers";
import useDebounce from "../../hooks/useDebounce";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

const ManagersPage = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAddManagerModalOpen, setIsAddManagerModalOpen] = useState(false);

  // Debounce search value to avoid too many API calls
  const debouncedSearchValue = useDebounce(searchValue, 500);

  // Use the API hook
  const {
    managers,
    pagination,
    timeUpdate,
    isLoadingManagers: isLoading,
    isFetchingManagers: isFetching,
    managersError: error,
    refetchManagers: refetch,
    createManager,
    isCreatingManager,
  } = useManagers(currentPage, itemsPerPage, debouncedSearchValue);

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

  const handleRefresh = () => {
    refetch();
  };

  const handleAddManager = (
    managerData: {
      crmId: string;
      name: string;
      email: string;
      phone?: string;
      photo?: File;
      department_id?: number;
    },
    onSuccess: () => void
  ) => {
    const createData = {
      full_name: managerData.name,
      email: managerData.email,
      phone: managerData.phone,
      crm_id: managerData.crmId,
      photo: managerData.photo,
      department_id: managerData.department_id,
    };

    createManager(createData, {
      onSuccess: (response) => {
        showSuccessToast(response.message);
        setIsAddManagerModalOpen(false);
        // Reset to first page to see the new manager
        setCurrentPage(1);
        onSuccess();
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message || "Помилка створення менеджера";
        showErrorToast(message);
      },
    });
  };

  const handleViewDetails = (managerId: number) => {
    navigate(`/managers/${managerId}`);
  };

  return (
    <div className="w-full flex flex-col bg-[#FFFFFF] rounded-2xl p-4 md:p-6 gap-4 md:gap-6 max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Title and Refresh */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-[#00101F] font-semibold text-[24px] md:text-[32px] leading-[100%]">
              Менеджери
            </h1>
            <button
              onClick={handleRefresh}
              className="size-8 md:size-10 rounded-[12px] flex items-center justify-center bg-[#EBF0F0] hover:bg-[#D1E5E5] transition-colors duration-200 group"
            >
              <BiRefresh
                size={20}
                className="text-[#739C9C] group-hover:text-[#5F8888] transition-colors duration-200 md:w-6 md:h-6"
              />
            </button>
          </div>
          <div className="flex gap-1">
            <span className="text-[#9A9A9A] text-[12px] md:text-[14px] leading-[100%]">
              останнє оновлення:
            </span>
            <span className="font-semibold text-[12px] md:text-[14px] leading-[100%] text-[#00101F]">
              {timeUpdate || "12:32"}
            </span>
          </div>
        </div>

        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:max-w-[637px]">
          <Input
            placeholder="Пошук по імені"
            value={searchValue}
            onChange={handleSearchChange}
            icon={<IoSearch size={18} />}
            iconPosition="left"
            className="!w-full sm:max-w-[400px]"
          />
          <Button
            variant="primary"
            size="md"
            className="flex items-center justify-center gap-2 w-full sm:w-auto sm:max-w-[222px] px-4 sm:px-6 !min-w-[180px] whitespace-nowrap"
            onClick={() => setIsAddManagerModalOpen(true)}
          >
            <HiUserPlus size={18} />
            <span className="text-sm md:text-base">Додати менеджера</span>
          </Button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-[#9A9A9A]">Завантаження...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-red-500">
              Помилка завантаження: {error?.message || "Невідома помилка"}
            </div>
          </div>
        ) : (
          <table className="w-full">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-[#F0F0F0]">
                <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-4">
                  Менеджер
                </th>
                <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-4">
                  Дзвінки
                </th>
                <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-4">
                  Середня тривалість
                </th>
                <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-4">
                  AI-оцінка
                </th>
                <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-4">
                  Топ причин відмов
                </th>
                <th className="text-[#9A9A9A] text-[16px] text-right font-normal py-3 px-4">
                  Дія
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-[#F0F0F0]">
              {managers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="text-[#9A9A9A]">
                      {debouncedSearchValue
                        ? "Менеджерів не знайдено"
                        : "Немає менеджерів"}
                    </div>
                  </td>
                </tr>
              ) : (
                managers.map((manager) => (
                  <tr
                    key={manager.id}
                    className="hover:bg-[#FAFAFA] transition-colors"
                  >
                    {/* Manager Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            manager.photo ||
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                          }
                          alt={manager.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="text-[#00101F] text-[16px] font-normal leading-[100%]">
                          {manager.name}
                        </span>
                      </div>
                    </td>

                    {/* Calls */}
                    <td className="py-4 px-4">
                      <span className="text-[#00101F] text-[16px] font-normal leading-[100%]">
                        {manager.total_calls}
                      </span>
                    </td>

                    {/* Average Duration */}
                    <td className="py-4 px-4">
                      <span className="text-[#00101F] text-[16px] font-normal leading-[100%]">
                        {manager.avg_duration}
                      </span>
                    </td>

                    {/* AI Rating */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <IoStarSharp color={manager.ai_color_avg} />
                        <span
                          className="text-[16px] font-normal leading-[100%]"
                          style={{ color: manager.ai_color_avg }}
                        >
                          {manager.ai_score_avg}
                        </span>
                      </div>
                    </td>

                    {/* Top Reasons */}
                    <td className="py-4 px-4 max-w-md">
                      <span className="text-[#00101F] text-[16px] font-normal leading-[100%]">
                        {manager.top_rejects_text}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => handleViewDetails(manager.id)}
                          className="w-10 h-10 rounded-[12px] bg-[#EBF0F0] flex items-center justify-center hover:bg-[#D1E5E5] transition-colors group"
                        >
                          <IoMdArrowForward
                            size={18}
                            className="text-[#739C9C] group-hover:text-[#5F8888]"
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
        {isFetching && !isLoading && (
          <div className="flex justify-center py-2">
            <div className="text-sm text-[#9A9A9A]">Оновлення...</div>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-[#9A9A9A]">Завантаження...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-red-500">
              Помилка завантаження: {error?.message || "Невідома помилка"}
            </div>
          </div>
        ) : managers.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-[#9A9A9A]">
              {debouncedSearchValue
                ? "Менеджерів не знайдено"
                : "Немає менеджерів"}
            </div>
          </div>
        ) : (
          managers.map((manager) => (
            <div
              key={manager.id}
              className="bg-white border border-[#F0F0F0] rounded-[12px] p-4 hover:bg-[#FAFAFA] transition-colors"
            >
              {/* Header Row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      manager.photo ||
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                    }
                    alt={manager.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-[#00101F] text-[16px] font-normal leading-[100%]">
                      {manager.name}
                    </div>
                    <div className="text-[#9A9A9A] text-[14px] leading-[100%] mt-1">
                      {manager.total_calls} дзвінків • {manager.avg_duration}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleViewDetails(manager.id)}
                  className="w-8 h-8 rounded-[8px] bg-[#EBF0F0] flex items-center justify-center hover:bg-[#D1E5E5] transition-colors group"
                >
                  <MdKeyboardArrowRight
                    size={16}
                    className="text-[#739C9C] group-hover:text-[#5F8888]"
                  />
                </button>
              </div>

              {/* Details Row */}
              <div className="space-y-2 text-[14px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#9A9A9A]">AI-оцінка:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[#FFA500]">★</span>
                    <span
                      className="font-normal"
                      style={{ color: manager.ai_color_avg }}
                    >
                      {manager.ai_score_avg}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-[#9A9A9A]">Топ причин: </span>
                  <span className="text-[#00101F]">
                    {manager.top_rejects_text}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
        {isFetching && !isLoading && (
          <div className="flex justify-center py-2">
            <div className="text-sm text-[#9A9A9A]">Оновлення...</div>
          </div>
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

      {/* Add Manager Modal */}
      <AddManagerModal
        isOpen={isAddManagerModalOpen}
        onClose={() => setIsAddManagerModalOpen(false)}
        onAddManager={handleAddManager}
        isLoading={isCreatingManager}
      />
    </div>
  );
};

export default ManagersPage;
