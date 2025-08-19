import { useState } from "react";
import { useParams } from "react-router-dom";
import { BiPencil } from "react-icons/bi";
import {
  MdOutlineLocalPhone,
  MdOutlineStarOutline,
  MdOutlinePhonePaused,
} from "react-icons/md";
import { RiArrowLeftLine } from "react-icons/ri";
import { Dropdown } from "../../../../components/ui/dropdown";
import ManagerRejectionReasonsWrapper from "../ManagerRejectionReasonsWrapper";
import EditUserModal from "../../../users/components/EditUserModal";
import { useManagerView, useManagers } from "../../../../hooks/useManagers";
import { showSuccessToast, showErrorToast } from "../../../../utils/toast";

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  dateAdded: string;
  timeAdded: string;
  lastLogin: string;
  isOnline: boolean;
}

export const UserInfo = () => {
  const { id } = useParams<{ id: string }>();
  const [timeFilter, setTimeFilter] = useState<
    "all" | "year" | "month" | "week" | "day"
  >("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch manager data using the custom hook
  const {
    managerData,
    isLoadingManagerView,
    managerViewError,
    refetchManagerView,
  } = useManagerView(id ? parseInt(id) : 0, timeFilter);

  // Get manager functionality from useManagers hook
  const { deletePhoto, isDeletingPhoto, editManager, isEditingManager } =
    useManagers();

  // Sample user data for fallback - in a real app, this would come from API
  const userData: UserData = {
    id: "1",
    name: "Максим Дмитрович",
    email: "max_dmitr@gmail.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    dateAdded: "27-03-2024",
    timeAdded: "13:21",
    lastLogin: "28 хвилин назад",
    isOnline: false,
  };

  // Time filter options for dropdown
  const timeOptions = [
    { value: "all", label: "Весь час" },
    { value: "day", label: "Сьогодні" },
    { value: "week", label: "Цей тиждень" },
    { value: "month", label: "Цей місяць" },
    { value: "year", label: "Цей рік" },
  ];

  // Get data from API or use fallback
  const displayData = managerData
    ? {
        id: managerData.manager.id,
        name: managerData.manager.full_name,
        email: managerData.manager.email,
        avatar:
          managerData.manager.photo ||
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        totalCalls: managerData.stats.total_calls,
        avgDuration: managerData.stats.avg_duration,
        aiScore: managerData.stats.avg_ai_score,
        totalOnLine: managerData.stats.total_duration,
        rejectionReasons: managerData.rejects,
        totalRejections: managerData.rejects.total,
        rejectsText: managerData.rejects.text,
      }
    : {
        id: 3,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        totalCalls: 10312,
        avgDuration: "4хв 19с",
        aiScore: "5.3",
        totalOnLine: "128хв 15с",
        rejectionReasons: [
          { name: "Дорого", value: 27, color: "#B27D45" },
          { name: "Немає довіри", value: 22, color: "#B2A945" },
          { name: "Немає бюджету", value: 17, color: "#4573B2" },
          { name: "Інше", value: 12, color: "#D9D9D9" },
        ],
        totalRejections: 4211,
        rejectsText: "Fallback data",
      };

  const handleEditUser = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveUser = (updatedUserData: {
    id: number;
    name: string;
    email: string;
    password?: string;
    avatar?: string;
    photo?: File;
  }) => {
    const editData = {
      full_name: updatedUserData.name,
      email: updatedUserData.email,
      photo: updatedUserData.photo,
    };

    editManager(
      { id: updatedUserData.id, managerData: editData },
      {
        onSuccess: (response: any) => {
          showSuccessToast(response.message);
          // Refetch manager data to get updated info
          // refetchManagerView();
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message || "Помилка оновлення менеджера";
          showErrorToast(message);
        },
      }
    );
  };

  const handleDeletePhoto = (userId: number) => {
    deletePhoto(userId, {
      onSuccess: (response: any) => {
        showSuccessToast(response.message);
        // Refetch manager data to get updated info
        refetchManagerView();
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message || "Помилка видалення фото";
        showErrorToast(message);
      },
    });
  };

  // Show loading state
  if (isLoadingManagerView) {
    return (
      <div className="max-w-[542px] w-full p-6 flex items-center justify-center bg-[#FFFFFF] rounded-2xl min-h-[400px]">
        <div className="text-[#9A9A9A] text-lg">Завантаження...</div>
      </div>
    );
  }

  // Show error state
  if (managerViewError) {
    return (
      <div className="max-w-[542px] w-full p-6 flex flex-col items-center justify-center bg-[#FFFFFF] rounded-2xl min-h-[400px] gap-4">
        <div className="text-red-500 text-lg">Помилка завантаження даних</div>
        <button
          onClick={() => refetchManagerView()}
          className="px-4 py-2 bg-[#739C9C] text-white rounded-lg hover:bg-[#5F8888] transition-colors"
        >
          Спробувати знову
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[542px] w-full p-6  flex flex-col gap-6 bg-[#FFFFFF] rounded-2xl ">
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-8 items-center w-full">
          <div className="flex items-start justify-between w-full">
            <button
              onClick={() => {}}
              className="size-8 md:size-10 rounded-[12px] flex items-center justify-center bg-[#EBF0F0] hover:bg-[#D1E5E5] transition-colors duration-200 group"
            >
              <RiArrowLeftLine
                size={20}
                className="text-[#739C9C] group-hover:text-[#5F8888] transition-colors duration-200 md:w-6 md:h-6"
              />
            </button>
            <img
              src={displayData.avatar}
              className="size-[120px] shrink-0 rounded-full"
              alt={displayData.name}
            />
            <button
              onClick={handleEditUser}
              className="size-8 md:size-10 rounded-[12px] flex items-center justify-center border border-[#739C9C] hover:bg-[#D1E5E5] transition-colors duration-200 group"
            >
              <BiPencil
                size={16}
                className="text-[#739C9C] group-hover:text-[#5F8888] transition-colors duration-200 md:w-6 md:h-6"
              />
            </button>
          </div>
          <div className="text-center flex flex-col gap-2">
            <h2 className="text-[#00101F] font-semibold text-[24px] leading-[100%]">
              {displayData.name}
            </h2>
            <span className="text-[#9A9A9A] text-[14px] leading-[100%]">
              {displayData.email}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-[#00101F] text-[20px] md:text-[24px] leading-[100%] font-semibold">
              Статистика
            </h2>
            <Dropdown
              options={timeOptions}
              value={timeFilter}
              onChange={(value: string) =>
                setTimeFilter(
                  value as "all" | "year" | "month" | "week" | "day"
                )
              }
              variant="minimal"
              className="w-auto min-w-[150px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-6">
            {/* Кількість дзвінків */}
            <div className="bg-[#739C9C14] rounded-[16px] p-4 flex items-center gap-3 md:gap-4">
              <div
                className="size-12 md:size-14 shrink-0 rounded-[6px] md:rounded-[8px] flex items-center justify-center"
                style={{ backgroundColor: "#62B2451A" }}
              >
                <MdOutlineLocalPhone
                  color="#4CAF50"
                  className="w-6 h-6 md:w-7 md:h-7"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[#00101F] text-[16px] md:text-[18px]  leading-[100%] font-semibold">
                  {displayData.totalCalls}
                </h3>
                <p className="text-[#9A9A9A] text-[12px] md:text-[14px] leading-[100%] mt-1">
                  Кількість дзвінків
                </p>
              </div>
            </div>

            {/* Середня AI-оцінка */}
            <div className="bg-[#B2A9451A] rounded-[16px] p-4 flex items-center gap-3 md:gap-4">
              <div
                className="size-12 md:size-14 shrink-0 rounded-[6px] md:rounded-[8px] flex items-center justify-center"
                style={{ backgroundColor: "#B2A9451A" }}
              >
                <MdOutlineStarOutline
                  color="#FFB74D"
                  className="w-6 h-6 md:w-7 md:h-7"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[#00101F] text-[16px] md:text-[18px] leading-[100%] font-semibold">
                  {displayData.aiScore}
                </h3>
                <p className="text-[#9A9A9A] text-[12px] md:text-[14px] leading-[100%] mt-1">
                  Середня AI-оцінка
                </p>
              </div>
            </div>

            {/* Тривалість дзвінка */}
            <div className="bg-[#739C9C14] rounded-[16px] p-4 flex items-center gap-3 md:gap-4">
              <div
                className="size-12 md:size-14 shrink-0 rounded-[6px] md:rounded-[8px] flex items-center justify-center"
                style={{ backgroundColor: "#4573B21A" }}
              >
                <MdOutlinePhonePaused
                  color="#42A5F5"
                  className="w-6 h-6 md:w-7 md:h-7"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[#00101F] text-[16px] md:text-[18px] leading-[100%] font-semibold">
                  {displayData.avgDuration}
                </h3>
                <p className="text-[#9A9A9A] text-[12px] md:text-[14px] leading-[100%] mt-1">
                  Тривалість дзвінка
                </p>
              </div>
            </div>

            {/* Всього на лінії */}
            <div className="bg-[#739C9C14] rounded-[16px] p-4 flex items-center gap-3 md:gap-4">
              <div
                className="size-12 md:size-14 shrink-0 rounded-[6px] md:rounded-[8px] flex items-center justify-center"
                style={{ backgroundColor: "#4573B21A" }}
              >
                <SpeedIcon />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[#00101F] text-[16px] md:text-[18px]  leading-[100%] font-semibold">
                  {displayData.totalOnLine}
                </h3>
                <p className="text-[#9A9A9A] text-[12px] md:text-[14px] leading-[100%] mt-1">
                  Всього на лінії
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full border-t border-[#EAEAEA]"></div>

        <ManagerRejectionReasonsWrapper
          title="Причини відмов"
          className="!p-0"
          showDropdown={false}
        />
      </div>
      <div></div>

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        //@ts-ignore
        onSave={handleSaveUser}
        //@ts-ignore
        user={{
          id: displayData.id,
          full_name: displayData.name,
          email: displayData.email,
          photo: displayData.avatar,
          role: ["manager"],
          is_blocked: 0,
          created_at: new Date().toISOString(),
          last_login_at: null,
        }}
        isLoading={isEditingManager}
        onDeletePhoto={handleDeletePhoto}
        isDeletingPhoto={isDeletingPhoto}
      />
    </div>
  );
};

const SpeedIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M31.6133 22.2265C27.5467 18.3732 22.0533 15.9998 16 15.9998C9.94667 15.9998 4.45333 18.3732 0.386667 22.2265C0.146667 22.4665 0 22.7998 0 23.1732C0 23.5465 0.146667 23.8798 0.386667 24.1198L3.69333 27.4265C3.93333 27.6665 4.26667 27.8132 4.64 27.8132C5 27.8132 5.33333 27.6665 5.57333 27.4398C6.62667 26.4532 7.82667 25.6265 9.12 24.9732C9.56 24.7598 9.86667 24.3065 9.86667 23.7732V19.6398C11.8 18.9998 13.8667 18.6665 16 18.6665C18.1333 18.6665 20.2 18.9998 22.1333 19.6265V23.7598C22.1333 24.2798 22.44 24.7465 22.88 24.9598C24.1867 25.6132 25.3733 26.4532 26.4267 27.4265C26.6667 27.6665 27 27.7998 27.36 27.7998C27.7333 27.7998 28.0667 27.6532 28.3067 27.4132L31.6133 24.1065C31.8533 23.8665 32 23.5332 32 23.1598C32 22.7998 31.8533 22.4665 31.6133 22.2265ZM7.2 22.9732C6.32 23.4665 5.48 24.0398 4.70667 24.6665L3.28 23.2398C4.49333 22.2398 5.81333 21.3865 7.21333 20.7065V22.9732H7.2ZM27.2933 24.6532C26.5067 24.0132 25.68 23.4532 24.8 22.9598V20.6932C26.1867 21.3732 27.5067 22.2265 28.72 23.2265L27.2933 24.6532ZM28.2133 8.3465L26.3333 6.4665L21.5867 11.1998L23.4667 13.0798C23.4667 13.0798 28.0667 8.3865 28.2133 8.3465ZM14.6667 2.6665H17.3333V9.33317H14.6667V2.6665ZM8.53333 13.0798L10.4133 11.1998L5.68 6.45317L3.78667 8.3465C3.93333 8.3865 8.53333 13.0798 8.53333 13.0798Z"
      fill="#4573B2"
    />
  </svg>
);
