import { useState, useEffect } from "react";
import { Modal } from "../../../components/ui/modal";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { HiOutlineCamera } from "react-icons/hi2";
import { MdOutlineEmail, MdOutlinePassword } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { User } from "./UsersTable";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: {
    id: number;
    name: string;
    email: string;
    password?: string;
    avatar?: string;
    photo?: File;
  }) => void;
  user: User | null;
  isLoading?: boolean;
  onDeletePhoto?: (userId: number) => void;
  isDeletingPhoto?: boolean;
}

const EditUserModal = ({
  isOpen,
  onClose,
  onSave,
  user,
  isLoading,
  onDeletePhoto,
  isDeletingPhoto = false,
}: EditUserModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [avatar, setAvatar] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Initialize form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.full_name,
        email: user.email,
        password: "",
      });
      setAvatar(user.photo || "");
      setPhotoFile(null);
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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

  const handleSave = () => {
    if (user && formData.name && formData.email) {
      onSave({
        id: user.id,
        name: formData.name,
        email: formData.email,
        password: formData.password || undefined,
        avatar: avatar || undefined,
        photo: photoFile || undefined,
      });
      onClose();
    }
  };

  const handleDeletePhoto = () => {
    if (user && user.photo && onDeletePhoto) {
      onDeletePhoto(user.id);
      // Reset local state immediately for better UX
      setAvatar("");
      setPhotoFile(null);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (user) {
      setFormData({
        name: user.full_name,
        email: user.email,
        password: "",
      });
      setAvatar(user.photo || "");
      setPhotoFile(null);
    }
    onClose();
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} className="max-w-[480px]">
      <div className="p-10">
        {/* Modal Header */}
        <div className="text-center mb-8">
          <h2 className="text-[#22272F] text-[24px] font-semibold leading-[100%]">
            Редагувати користувача
          </h2>
        </div>

        {/* Avatar Upload */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#F7F7F7] border-2 border-dashed border-[#E0E0E0] flex items-center justify-center">
                  <HiOutlineCamera size={32} className="text-[#739C9C]" />
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          {avatar && onDeletePhoto && (
            <button
              type="button"
              onClick={handleDeletePhoto}
              disabled={isDeletingPhoto}
              className="text-[#B24545] text-[16px] font-semibold mt-4 hover:text-[#A03939] disabled:opacity-50"
            >
              {isDeletingPhoto ? "Видалення..." : "Видалити фото"}
            </button>
          )}
          {!avatar && (
            <span className="text-[#739C9C] text-[16px] font-semibold mt-4">
              Додати фото
            </span>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-4 mb-8">
          {/* Name Field */}
          <div>
            <label className="block text-[#9A9A9A] text-[16px] font-normal mb-2">
              Ім'я
            </label>
            <Input
              placeholder="Повне ім'я менеджера"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              icon={<FaRegUser size={20} />}
              iconPosition="left"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-[#9A9A9A] text-[16px] font-normal mb-2">
              Email
            </label>
            <Input
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              icon={<MdOutlineEmail size={20} />}
              iconPosition="left"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[#9A9A9A] text-[16px] font-normal mb-2">
              Пароль
            </label>
            <Input
              type="password"
              placeholder="Введіть новий пароль (залишіть пустим, щоб не змінювати)"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              icon={<MdOutlinePassword size={20} />}
              iconPosition="left"
              showPasswordToggle={true}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 !w-full max-w-[86px]"
          >
            Відміна
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!formData.name || !formData.email || isLoading}
            className="flex-1 !w-full max-w-[120px]"
          >
            {isLoading ? "Оновлення..." : "Зберегти"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditUserModal;
