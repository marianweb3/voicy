import { BiRefresh } from "react-icons/bi";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { IoSearch } from "react-icons/io5";
import { HiUserPlus } from "react-icons/hi2";
import { useState } from "react";
import UsersTable, { User } from "./components/UsersTable";
import Pagination from "./components/Pagination";
import AddUserModal from "./components/AddUserModal";
import DeleteUserModal from "./components/DeleteUserModal";
import EditUserModal from "./components/EditUserModal";
import { useAdmins } from "../../hooks/useAdmins";
import useDebounce from "../../hooks/useDebounce";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

const UsersPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Debounce search value to avoid too many API calls
  const debouncedSearchValue = useDebounce(searchValue, 500);

  // Use the API hook
  const {
    admins: users,
    pagination,
    timeUpdate,
    isLoadingAdmins: isLoading,
    isFetchingAdmins: isFetching,
    adminsError: error,
    refetchAdmins: refetch,
    createAdmin,
    isCreatingAdmin,
    editAdmin,
    isEditingAdmin,
    deleteAdmin,
    isDeletingAdmin,
    deletePhoto,
    isDeletingPhoto,
  } = useAdmins(currentPage, itemsPerPage, debouncedSearchValue);

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
    console.log(newItemsPerPage, "newItemsPerPage");
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const handleEditUser = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsEditUserModalOpen(true);
    }
  };

  const handleDeleteUser = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsDeleteUserModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      deleteAdmin(selectedUser.id, {
        onSuccess: (response) => {
          showSuccessToast(response.message);
          setSelectedUser(null);
          setIsDeleteUserModalOpen(false);
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message || "Помилка видалення користувача";
          showErrorToast(message);
        },
      });
    }
  };

  const handleSaveEditUser = (userData: {
    id: number;
    name: string;
    email: string;
    password?: string;
    avatar?: string;
    photo?: File;
  }) => {
    const editData = {
      full_name: userData.name,
      email: userData.email,
      password: userData.password,
      role: selectedUser?.role.join(",") || "",
      photo: userData.photo,
    };

    editAdmin(
      { id: userData.id, adminData: editData },
      {
        onSuccess: (response) => {
          showSuccessToast(response.message);
          setSelectedUser(null);
          setIsEditUserModalOpen(false);
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message || "Помилка оновлення користувача";
          showErrorToast(message);
        },
      }
    );
  };

  const handleDeletePhoto = (userId: number) => {
    deletePhoto(userId, {
      onSuccess: (response) => {
        showSuccessToast(response.message);
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message || "Помилка видалення фото";
        showErrorToast(message);
      },
    });
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleAddUser = (userData: {
    name: string;
    email: string;
    password: string;
    avatar?: string;
    photo?: File;
    role: string;
  }) => {
    const createData = {
      full_name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      photo: userData.photo,
    };

    createAdmin(createData, {
      onSuccess: (response) => {
        showSuccessToast(response.message);
        setIsAddUserModalOpen(false);
        // Reset to first page to see the new user
        setCurrentPage(1);
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message || "Помилка створення користувача";
        showErrorToast(message);
      },
    });
  };

  return (
    <div className="w-full flex flex-col bg-[#FFFFFF] rounded-2xl p-4 md:p-6 gap-4 md:gap-6 max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Title and Refresh */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-[#00101F] font-semibold text-[24px] md:text-[32px] leading-[100%]">
              Користувачі
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
        <div className="flex flex-col sm:flex-row gap-3 justify-end w-full lg:max-w-[687px]">
          <Input
            placeholder="Пошук по імені"
            value={searchValue}
            onChange={handleSearchChange}
            icon={<IoSearch size={18} />}
            iconPosition="left"
            containerClassName="!w-full sm:max-w-[400px]"
          />
          <Button
            variant="primary"
            size="md"
            className="flex items-center justify-center gap-2 w-full sm:w-auto sm:max-w-fit px-4 sm:px-6 !min-w-[180px] whitespace-nowrap"
            onClick={() => setIsAddUserModalOpen(true)}
          >
            <HiUserPlus size={18} />
            <span className="text-sm md:text-base">Додати користувача</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <UsersTable
        users={users}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
      />

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

      {/* Modals */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAddUser={handleAddUser}
        isLoading={isCreatingAdmin}
      />

      <DeleteUserModal
        isOpen={isDeleteUserModalOpen}
        onClose={() => {
          setIsDeleteUserModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmDelete}
        userName={selectedUser?.full_name || ""}
        isLoading={isDeletingAdmin}
      />

      <EditUserModal
        isOpen={isEditUserModalOpen}
        onClose={() => {
          setIsEditUserModalOpen(false);
          setSelectedUser(null);
        }}
        withoutDepartment
        onSave={handleSaveEditUser}
        user={selectedUser}
        isLoading={isEditingAdmin}
        onDeletePhoto={handleDeletePhoto}
        isDeletingPhoto={isDeletingPhoto}
      />
    </div>
  );
};

export default UsersPage;
