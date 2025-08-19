import { HiPencil } from "react-icons/hi2";
import { IoTrashOutline } from "react-icons/io5";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { uk } from "date-fns/locale";

interface User {
  id: number;
  full_name: string;
  email: string;
  photo?: string;
  role: string[];
  is_blocked: number;
  created_at: string;
  last_login_at: string | null;
}

interface UsersTableProps {
  users: User[];
  onEditUser: (userId: number) => void;
  onDeleteUser: (userId: number) => void;
  isLoading?: boolean;
  isFetching?: boolean;
  error?: any;
}

const UsersTable = ({
  users,
  onEditUser,
  onDeleteUser,
  isLoading,
  isFetching,
  error,
}: UsersTableProps) => {
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return {
      date: format(date, "dd-MM-yyyy", { locale: uk }),
      time: format(date, "HH:mm", { locale: uk }),
    };
  };

  // Helper function to format last login
  const formatLastLogin = (lastLogin: string | null) => {
    if (!lastLogin) return "Ніколи не входив";

    const loginDate = parseISO(lastLogin);
    const now = new Date();
    const diffMs = now.getTime() - loginDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 5) return "Онлайн";

    return formatDistanceToNow(loginDate, {
      addSuffix: true,
      locale: uk,
    });
  };

  // Loading skeleton component
  const LoadingSkeleton = () => {
    const skeletonRows = Array.from({ length: 5 }, (_, i) => i); // Show 5 skeleton rows

    return (
      <div className="w-full">
        {/* Desktop Skeleton */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-[#F0F0F0]">
                <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-4">
                  Користувач
                </th>
                <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-4">
                  Email
                </th>
                <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-4">
                  Дата додавання
                </th>
                <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-4">
                  Останній вхід
                </th>
                <th className="text-[#9A9A9A] text-[16px] text-right font-normal py-3 px-4">
                  Дія
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0F0]">
              {skeletonRows.map((index) => (
                <tr key={index} className="animate-pulse">
                  {/* User Info Skeleton */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded-md w-32 animate-pulse"></div>
                    </div>
                  </td>
                  {/* Email Skeleton */}
                  <td className="py-4 px-4">
                    <div className="h-4 bg-gray-200 rounded-md w-40 animate-pulse"></div>
                  </td>
                  {/* Date Skeleton */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1">
                      <div className="h-4 bg-gray-200 rounded-md w-16 animate-pulse"></div>
                      <div className="h-3 bg-gray-100 rounded-md w-20 animate-pulse"></div>
                    </div>
                  </td>
                  {/* Last Login Skeleton */}
                  <td className="py-4 px-4">
                    <div className="h-4 bg-gray-200 rounded-md w-24 animate-pulse"></div>
                  </td>
                  {/* Actions Skeleton */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4 justify-end">
                      <div className="w-10 h-10 bg-gray-200 rounded-[12px] animate-pulse"></div>
                      <div className="w-10 h-10 bg-gray-200 rounded-[12px] animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Skeleton */}
        <div className="md:hidden space-y-3">
          {skeletonRows.map((index) => (
            <div
              key={index}
              className="bg-white border border-[#F0F0F0] rounded-[12px] p-4 animate-pulse"
            >
              {/* User Info Row Skeleton */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded-md w-28 mb-1 animate-pulse"></div>
                    <div className="h-3 bg-gray-100 rounded-md w-32 animate-pulse"></div>
                  </div>
                </div>
                {/* Actions Skeleton */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-[8px] animate-pulse"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-[8px] animate-pulse"></div>
                </div>
              </div>
              {/* Details Row Skeleton */}
              <div className="flex items-center justify-between">
                <div className="h-3 bg-gray-100 rounded-md w-24 animate-pulse"></div>
                <div className="h-3 bg-gray-100 rounded-md w-16 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Handle loading state
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full flex items-center justify-center h-64 bg-white rounded-2xl">
        <div className="text-[#B24545] text-lg">Помилка завантаження даних</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Progress bar for subsequent loading */}
      {isFetching && !isLoading && (
        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-[#739C9C] rounded-full progress-bar"></div>
        </div>
      )}
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-[#F0F0F0]">
              <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-4">
                Користувач
              </th>
              <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-4">
                Email
              </th>
              <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-4">
                Дата додавання
              </th>
              <th className="text-left text-[#9A9A9A] text-[16px] font-normal py-3 px-4">
                Останній вхід
              </th>
              <th className="text-[#9A9A9A] text-[16px] text-right font-normal py-3 px-4">
                Дія
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#F0F0F0]">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-[#FAFAFA] transition-colors"
              >
                {/* User Info */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={
                          user.photo ||
                          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                        }
                        alt={user.full_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {formatLastLogin(user.last_login_at) === "Онлайн" && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#62B245] border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-[#00101F] text-[16px] font-normal leading-[100%]">
                      {user.full_name}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className="py-4 px-4">
                  <span className="text-[#00101F] text-[16px] font-normal leading-[100%]">
                    {user.email}
                  </span>
                </td>

                {/* Date Added */}
                <td className="py-4 px-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[#00101F] text-[16px] font-semibold leading-[100%]">
                      {formatDate(user.created_at).time}
                    </span>
                    <span className="text-[#9A9A9A] text-[16px] font-normal leading-[100%]">
                      {formatDate(user.created_at).date}
                    </span>
                  </div>
                </td>

                {/* Last Login */}
                <td className="py-4 px-4">
                  <span
                    className={`text-[16px] leading-[100%] ${
                      formatLastLogin(user.last_login_at) === "Онлайн"
                        ? "text-[#739C9C]"
                        : "text-[#00101F]"
                    }`}
                  >
                    {formatLastLogin(user.last_login_at)}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-4 justify-end">
                    <button
                      onClick={() => onEditUser(user.id)}
                      className="w-10 h-10 rounded-[12px] bg-[#EBF0F0] flex items-center justify-center hover:bg-[#D1E5E5] transition-colors group"
                    >
                      <HiPencil
                        size={16}
                        className="text-[#739C9C] group-hover:text-[#5F8888]"
                      />
                    </button>
                    <button
                      onClick={() => onDeleteUser(user.id)}
                      className="w-10 h-10 rounded-[12px] bg-[#FEF2F2] flex items-center justify-center hover:bg-[#FEE2E2] transition-colors group"
                    >
                      <IoTrashOutline
                        size={16}
                        className="text-[#B24545] group-hover:text-[#A03939]"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white border border-[#F0F0F0] rounded-[12px] p-4 hover:bg-[#FAFAFA] transition-colors"
          >
            {/* User Info Row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={
                      user.photo ||
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                    }
                    alt={user.full_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {formatLastLogin(user.last_login_at) === "Онлайн" && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#62B245] border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <div className="text-[#00101F] text-[16px] font-normal leading-[100%]">
                    {user.full_name}
                  </div>
                  <div className="text-[#9A9A9A] text-[14px] leading-[100%] mt-1">
                    {user.email}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEditUser(user.id)}
                  className="w-8 h-8 rounded-[8px] bg-[#EBF0F0] flex items-center justify-center hover:bg-[#D1E5E5] transition-colors group"
                >
                  <HiPencil
                    size={14}
                    className="text-[#739C9C] group-hover:text-[#5F8888]"
                  />
                </button>
                <button
                  onClick={() => onDeleteUser(user.id)}
                  className="w-8 h-8 rounded-[8px] bg-[#FEF2F2] flex items-center justify-center hover:bg-[#FEE2E2] transition-colors group"
                >
                  <IoTrashOutline
                    size={14}
                    className="text-[#B24545] group-hover:text-[#A03939]"
                  />
                </button>
              </div>
            </div>

            {/* Details Row */}
            <div className="flex items-center justify-between text-[14px]">
              <div>
                <span className="text-[#9A9A9A]">Додано: </span>
                <span className="text-[#00101F] font-semibold">
                  {formatDate(user.created_at).time}{" "}
                  {formatDate(user.created_at).date}
                </span>
              </div>
              <div
                className={`${
                  formatLastLogin(user.last_login_at) === "Онлайн"
                    ? "text-[#739C9C]"
                    : "text-[#00101F]"
                }`}
              >
                {formatLastLogin(user.last_login_at)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersTable;
export type { User, UsersTableProps };
