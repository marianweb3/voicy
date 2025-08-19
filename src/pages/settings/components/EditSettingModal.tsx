import { useState, useEffect } from "react";
import { Modal } from "../../../components/ui/modal";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { useSettings } from "../../../hooks/useSettings";
import { Setting } from "../../../services/api";

interface EditSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  setting: Setting | null;
}

const EditSettingModal = ({
  isOpen,
  onClose,
  setting,
}: EditSettingModalProps) => {
  const { editSetting, isEditingSetting } = useSettings();

  const [formData, setFormData] = useState({
    statusId: "",
    name: "",
    fieldId: "",
    prompt: "",
  });

  // Pre-fill form when setting changes
  useEffect(() => {
    if (setting) {
      setFormData({
        statusId: setting.status_id.toString(),
        name: setting.status_name,
        fieldId: setting.field_id.toString(),
        prompt: setting.prompt_full,
      });
    }
  }, [setting]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      setting &&
      formData.statusId &&
      formData.name &&
      formData.fieldId &&
      formData.prompt
    ) {
      try {
        await editSetting({
          id: setting.id,
          settingData: {
            status_id: parseInt(formData.statusId),
            status_name: formData.name,
            field_id: parseInt(formData.fieldId),
            prompt: formData.prompt,
          },
        });

        onClose();
      } catch (error) {
        // Error is handled by the hook with toast
        console.error("Failed to edit setting:", error);
      }
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (setting) {
      setFormData({
        statusId: setting.status_id.toString(),
        name: setting.status_name,
        fieldId: setting.field_id.toString(),
        prompt: setting.prompt_full,
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      className="max-w-[95vw] sm:max-w-[920px]"
    >
      <div className="p-6 sm:p-10">
        {/* Modal Header */}
        <div className="text-center mb-6">
          <h2 className="text-[#22272F] text-[20px] sm:text-[24px] font-semibold leading-[100%]">
            Редагувати налаштування
          </h2>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Status ID Field */}
            <div>
              <label className="block text-[#9A9A9A] text-[14px] sm:text-[16px] font-normal mb-2">
                ID статусу
              </label>
              <Input
                placeholder="ID статусу с CRM системи"
                value={formData.statusId}
                onChange={(e) => handleInputChange("statusId", e.target.value)}
                className="!w-full"
                disabled
              />
            </div>

            {/* Status Name Field */}
            <div>
              <label className="block text-[#9A9A9A] text-[14px] sm:text-[16px] font-normal mb-2">
                Назва статусу
              </label>
              <Input
                placeholder="Введіть назву статусу"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="!w-full"
              />
            </div>

            {/* Field ID Field */}
            <div>
              <label className="block text-[#9A9A9A] text-[14px] sm:text-[16px] font-normal mb-2">
                ID поля
              </label>
              <Input
                placeholder="ID поля с CRM системи"
                value={formData.fieldId}
                onChange={(e) => handleInputChange("fieldId", e.target.value)}
                className="!w-full"
                disabled
              />
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* AI Prompt Field */}
            <div className="h-full flex flex-col">
              <label className="block text-[#9A9A9A] text-[14px] sm:text-[16px] font-normal mb-2">
                AI промт
              </label>
              <textarea
                placeholder="Промт для AI аналізу"
                value={formData.prompt}
                onChange={(e) => handleInputChange("prompt", e.target.value)}
                className="min-h-[200px] w-full px-4 py-3 text-[16px] text-[#00101F] placeholder-[#9A9A9A] bg-[#F7F7F7] border-0 rounded-[12px] focus:outline-none focus:ring-1 focus:ring-[#739C9C]"
                rows={8}
              />
            </div>
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
            disabled={!formData.name || !formData.prompt || isEditingSetting}
            className="w-full sm:flex-1 sm:!w-full sm:!max-w-[220px] order-1 sm:order-2 !px-[11px]"
          >
            {isEditingSetting ? "Збереження..." : "Зберегти налаштування"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditSettingModal;
