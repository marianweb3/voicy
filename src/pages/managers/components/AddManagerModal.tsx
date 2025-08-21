import { useState } from "react";
import { Modal } from "../../../components/ui/modal";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Dropdown } from "../../../components/ui/dropdown";
import { HiOutlineCamera } from "react-icons/hi2";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { useDepartments } from "../../../hooks/useCalls";

interface AddManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddManager: (
    managerData: {
      crmId: string;
      name: string;
      email: string;
      phone?: string;
      photo?: File;
      department_id?: number;
    },
    onSuccess: () => void
  ) => void;
  isLoading?: boolean;
}

const AddManagerModal = ({
  isOpen,
  onClose,
  onAddManager,
  isLoading = false,
}: AddManagerModalProps) => {
  const [formData, setFormData] = useState({
    crmId: "",
    name: "",
    email: "",
    phone: "",
    department_id: undefined as number | undefined,
  });
  const [avatar, setAvatar] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Fetch departments for dropdown
  const { departments,  } = useDepartments();

  // Department options for dropdown
  const departmentOptions = [
    { value: "", label: "Виберіть відділ" },
    ...departments.map((department: { id: number; name: string }) => ({
      value: department.id.toString(),
      label: department.name,
    })),
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDepartmentChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      department_id: value ? parseInt(value) : undefined,
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
    console.log(formData, "formData");

    if (
      formData.crmId &&
      formData.name &&
      formData.email &&
      typeof formData.department_id === "number"
    ) {
      onAddManager(
        {
          ...formData,
          photo: photoFile || undefined,
        },
        () => {
          // Reset form
          setFormData({
            crmId: "",
            name: "",
            email: "",
            phone: "",
            department_id: undefined,
          });
          setAvatar("");
          setPhotoFile(null);
        }
      );
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      crmId: "",
      name: "",
      email: "",
      phone: "",
      department_id: undefined,
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
      <div className="p-6 sm:p-10">
        {/* Modal Header */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-[#22272F] text-[20px] sm:text-[24px] font-semibold leading-[100%]">
            Додати менеджера
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
          {/* CRM ID Field */}
          <div>
            <label className="block text-[#9A9A9A] text-[14px] sm:text-[16px] font-normal mb-2">
              ID в CRM
            </label>
            <Input
              placeholder="Введіть ID"
              value={formData.crmId}
              onChange={(e) => handleInputChange("crmId", e.target.value)}
              icon={<FaRegUser size={18} />}
              iconPosition="left"
              className="!w-full"
            />
          </div>

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
              className="!w-full"
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
              className="!w-full"
            />
          </div>

          <div>
            <label className="block text-[#9A9A9A] text-[14px] sm:text-[16px] font-normal mb-2">
              Відділ
            </label>
            <Dropdown
              options={departmentOptions}
              value={formData.department_id?.toString() || ""}
              onChange={handleDepartmentChange}
              variant="default"
              size="sm"
              className="!w-full"
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-[#9A9A9A] text-[14px] sm:text-[16px] font-normal mb-2">
              Телефон (необов'язково)
            </label>
            <Input
              type="tel"
              placeholder="+380 XX XXX XX XX"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="!w-full"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:flex-1 sm:!w-full sm:max-w-[100px] order-2 sm:order-1"
          >
            Відміна
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={
              !formData.crmId || !formData.name || !formData.email || isLoading
            }
            className="w-full sm:flex-1 sm:!w-full sm:!max-w-[200px] !px-[11px] order-1 sm:order-2"
          >
            {isLoading ? "Створення..." : "Додати менеджера"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddManagerModal;
