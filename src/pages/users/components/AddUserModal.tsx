import { useState } from "react";
import { Modal } from "../../../components/ui/modal";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { MultiselectDropdown } from "../../../components/ui/multiselect-dropdown";
import { HiOutlineCamera } from "react-icons/hi2";
import { MdOutlineEmail, MdOutlinePassword } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (userData: {
    name: string;
    email: string;
    password: string;
    avatar?: string;
    photo?: File;
    role: string;
  }) => void;
  isLoading?: boolean;
}

const AddUserModal = ({
  isOpen,
  onClose,
  onAddUser,
  isLoading,
}: AddUserModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admins,dashboard",
    permissions: ["admins", "dashboard"] as string[],
  });
  const [avatar, setAvatar] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Permissions options for multiselect
  const permissionsOptions = [
    { value: "admins", label: "Адміністратори" },
    { value: "dashboard", label: "Дашборд" },
    { value: "calls", label: "Дзвінки" },
    { value: "managers", label: "Менеджери" },
    { value: "processes", label: "Процеси" },
    { value: "settings", label: "Налаштування" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePermissionsChange = (value: string[]) => {
    setFormData((prev) => ({
      ...prev,
      permissions: value,
      role: value.join(","), // Update role field to match permissions
    }));
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (formData.name && formData.email && formData.password && formData.role) {
      onAddUser({
        ...formData,
        avatar: avatar || undefined,
        photo: photoFile || undefined,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "admins,dashboard",
        permissions: ["admins", "dashboard"],
      });
      setAvatar("");
      setPhotoFile(null);
      onClose();
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "admins,dashboard",
      permissions: ["admins", "dashboard"],
    });
    setAvatar("");
    setPhotoFile(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      className="max-w-[95vw] sm:max-w-[480px]"
    >
      <div className="p-6 sm:p-8 md:p-10">
        {/* Modal Header */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-[#22272F] text-[20px] sm:text-[24px] font-semibold leading-[100%]">
            Додати користувача
          </h2>
        </div>

        {/* Avatar Upload */}
        <div className="flex flex-col items-center mb-4 md:mb-6">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#F7F7F7] border-2 border-dashed border-[#E0E0E0] flex items-center justify-center overflow-hidden">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <HiOutlineCamera
                  size={28}
                  className="text-[#739C9C] sm:w-8 sm:h-8"
                />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <span className="text-[#739C9C] text-[14px] sm:text-[16px] font-semibold mt-3 sm:mt-4">
            Додати фото
          </span>
        </div>

        {/* Form Fields */}
        <div className="space-y-3 sm:space-y-4 mb-6 md:mb-8">
          {/* Name Field */}
          <div>
            <label className="block text-[#9A9A9A] text-[14px] sm:text-[16px] font-normal mb-2">
              Ім'я
            </label>
            <Input
              placeholder="Повне ім'я менеджера"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              icon={<FaRegUser size={18} />}
              iconPosition="left"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-[#9A9A9A] text-[14px] sm:text-[16px] font-normal mb-2">
              Email
            </label>
            <Input
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              icon={<MdOutlineEmail size={18} />}
              iconPosition="left"
            />
          </div>

          {/* Permissions Field */}
          <div>
            <label className="block text-[#9A9A9A] text-[14px] sm:text-[16px] font-normal mb-2">
              Права
            </label>
            <MultiselectDropdown
              options={permissionsOptions}
              value={formData.permissions}
              onChange={handlePermissionsChange}
              placeholder="Виберіть права доступу"
              variant="default"
              size="sm"
              className="!w-full"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[#9A9A9A] text-[14px] sm:text-[16px] font-normal mb-2">
              Пароль
            </label>
            <Input
              type="password"
              placeholder="Введіть пароль"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              icon={<MdOutlinePassword size={18} />}
              iconPosition="left"
              showPasswordToggle={true}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="w-full sm:flex-1 sm:!w-full sm:max-w-[86px] order-2 sm:order-1"
          >
            Відміна
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={
              !formData.name ||
              !formData.email ||
              !formData.password ||
              !formData.role ||
              isLoading
            }
            className="w-full sm:flex-1 sm:!w-full sm:!max-w-[170px] sm:!px-[11px] order-1 sm:order-2"
          >
            {isLoading ? "Створення..." : "Додати користувача"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddUserModal;
