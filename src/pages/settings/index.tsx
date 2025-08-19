import { BiRefresh } from "react-icons/bi";
import { Button } from "../../components/ui/button";
import { HiPlus } from "react-icons/hi2";
import { HiPencil } from "react-icons/hi2";
import { useState } from "react";
import Pagination from "../users/components/Pagination";
import AddSettingModal from "./components/AddSettingModal";
import EditSettingModal from "./components/EditSettingModal";
import { useSettings } from "../../hooks/useSettings";
import { Setting } from "../../services/api";

const SettingsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);

  // Use settings hook with React Query
  const {
    settings,
    pagination,
    timeUpdate,
    isLoadingSettings,
    isFetchingSettings,
    isEditingSetting,
    isSwitchingSetting,
    refetchSettings,
    switchSetting,
  } = useSettings(currentPage, itemsPerPage);

  // Calculate pagination values
  const totalItems = pagination?.total || 0;
  const totalPages = pagination?.total_pages || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    refetchSettings();
  };

  const handleToggle = (id: number) => {
    switchSetting(id);
  };

  const handleEdit = (id: number) => {
    const setting = settings.find((s) => s.id === id);
    if (setting) {
      setSelectedSetting(setting);
      setIsEditModalOpen(true);
    }
  };

  const handleAddSetting = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSetting(null);
  };

  return (
    <div className="w-full flex flex-col bg-[#FFFFFF] rounded-2xl p-4 md:p-6 gap-4 md:gap-6 max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Title and Refresh */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-[#00101F] font-semibold text-[24px] md:text-[32px] leading-[100%]">
              Налаштування
            </h1>
            <button
              onClick={handleRefresh}
              disabled={isFetchingSettings}
              className="size-8 md:size-10 rounded-[12px] flex items-center justify-center bg-[#EBF0F0] hover:bg-[#D1E5E5] transition-colors duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BiRefresh
                size={20}
                className={`text-[#739C9C] group-hover:text-[#5F8888] transition-colors duration-200 md:w-6 md:h-6 ${
                  isFetchingSettings ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>
          <div className="flex gap-1">
            <span className="text-[#9A9A9A] text-[12px] md:text-[14px] leading-[100%]">
              останнє оновлення:
            </span>
            <span className="font-semibold text-[12px] md:text-[14px] leading-[100%] text-[#00101F]">
              {timeUpdate || "--:--"}
            </span>
          </div>
        </div>

        {/* Add Button */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            size="md"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 sm:px-6 !min-w-[200px] whitespace-nowrap"
            onClick={handleAddSetting}
          >
            <HiPlus size={18} />
            <span className="text-sm md:text-base">Додати налаштування</span>
          </Button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-[#F0F0F0]">
              <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-4 w-20">
                Стан
              </th>
              <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-4">
                ID статусу
              </th>
              <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-4">
                Назва статусу
              </th>
              <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-4">
                ID поля
              </th>
              <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-4">
                AI промт
              </th>
              <th className="text-[#9A9A9A] text-[16px] text-right font-normal py-3 px-4">
                Дія
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#F0F0F0]">
            {isLoadingSettings ? (
              <tr>
                <td colSpan={6} className="py-8 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#739C9C]"></div>
                    <span className="ml-2 text-[#9A9A9A]">Завантаження...</span>
                  </div>
                </td>
              </tr>
            ) : settings.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#9A9A9A]">
                  Налаштування не знайдено
                </td>
              </tr>
            ) : (
              settings
                .sort((a, b) => a.id - b.id)
                .map((setting) => (
                  <tr
                    key={setting.id}
                    className="hover:bg-[#FAFAFA] transition-colors"
                  >
                    {/* Toggle */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggle(setting.id)}
                        disabled={isSwitchingSetting}
                        className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                          setting.enabled ? "bg-[#739C9C]" : "bg-[#E0E0E0]"
                        }`}
                      >
                        <span
                          className={`inline-block transform rounded-full  transition-all duration-200 shadow-sm ${
                            setting.enabled
                              ? "translate-x-6 bg-[#fff] size-5"
                              : "translate-x-1 bg-[#9A9A9A] size-3"
                          }`}
                        />
                      </button>
                    </td>

                    {/* Status ID */}
                    <td className="py-4 px-4">
                      <span className="text-[#9A9A9A] text-[16px] font-normal leading-[100%]">
                        #{setting.status_id}
                      </span>
                    </td>

                    {/* Status Name */}
                    <td className="py-4 px-4">
                      <span className="text-[#00101F] text-[16px] font-normal leading-[100%]">
                        {setting.status_name}
                      </span>
                    </td>

                    {/* Field ID */}
                    <td className="py-4 px-4">
                      <span className="text-[#9A9A9A] text-[16px] font-normal leading-[100%]">
                        #{setting.field_id}
                      </span>
                    </td>

                    {/* AI Prompt */}
                    <td className="py-4 px-4 max-w-md">
                      <div
                        className={`text-[16px] font-normal leading-[140%] ${
                          setting.enabled ? "text-[#00101F]" : "text-[#9A9A9A]"
                        }`}
                      >
                        {setting.prompt_for_table}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => handleEdit(setting.id)}
                          disabled={isEditingSetting}
                          className="w-10 h-10 rounded-[12px] bg-[#EBF0F0] flex items-center justify-center hover:bg-[#D1E5E5] transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <HiPencil
                            size={16}
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
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {isLoadingSettings ? (
          <div className="py-8 text-center">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#739C9C]"></div>
              <span className="ml-2 text-[#9A9A9A]">Завантаження...</span>
            </div>
          </div>
        ) : settings.length === 0 ? (
          <div className="py-8 text-center text-[#9A9A9A]">
            Налаштування не знайдено
          </div>
        ) : (
          settings
            .sort((a, b) => a.id - b.id)
            .map((setting) => (
              <div
                key={setting.id}
                className="bg-white border border-[#F0F0F0] rounded-[12px] p-4 hover:bg-[#FAFAFA] transition-colors"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggle(setting.id)}
                      disabled={isSwitchingSetting}
                      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                        setting.enabled ? "bg-[#739C9C]" : "bg-[#E0E0E0]"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-200 shadow-sm ${
                          setting.enabled ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                    <div>
                      <div className="text-[#00101F] text-[16px] font-normal leading-[100%]">
                        {setting.status_name}
                      </div>
                      <div className="text-[#9A9A9A] text-[14px] leading-[100%] mt-1">
                        #{setting.status_id}
                      </div>
                    </div>
                  </div>
                  {/* Edit Button */}
                  <button
                    onClick={() => handleEdit(setting.id)}
                    disabled={isEditingSetting}
                    className="w-8 h-8 rounded-[8px] bg-[#EBF0F0] flex items-center justify-center hover:bg-[#D1E5E5] transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <HiPencil
                      size={14}
                      className="text-[#739C9C] group-hover:text-[#5F8888]"
                    />
                  </button>
                </div>
                {/* AI Prompt */}
                <div
                  className={`text-[14px] leading-[140%] ${
                    setting.enabled ? "text-[#00101F]" : "text-[#9A9A9A]"
                  }`}
                >
                  {setting.prompt_full}
                </div>
              </div>
            ))
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Modals */}
      <AddSettingModal isOpen={isAddModalOpen} onClose={handleCloseAddModal} />

      <EditSettingModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        setting={selectedSetting}
      />
    </div>
  );
};

export default SettingsPage;
