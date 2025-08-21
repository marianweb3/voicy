import { useState } from "react";
import { useParams } from "react-router-dom";
import { Modal } from "../../../../components/ui/modal";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";

import { useAIAnalysis } from "../../../../hooks/useManagers";

interface AddAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddAnalysisModal = ({ isOpen, onClose }: AddAnalysisModalProps) => {
  const { analyzeAI, isAnalyzing } = useAIAnalysis({
    onFinish: () => {
      setFormData({
        id_crm: "",
        client_phone: "",
        audio_file: null,
      });
      setErrors({});
      onClose();
    },
  });
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState({
    id_crm: "",
    client_phone: "",
    audio_file: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, audio_file: file }));
    // Clear error when user selects file
    if (errors.audio_file) {
      setErrors((prev) => ({ ...prev, audio_file: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.id_crm.trim()) {
      newErrors.id_crm = "ID CRM є обов'язковим";
    }
    if (!formData.client_phone.trim()) {
      newErrors.client_phone = "Телефон клієнта є обов'язковим";
    }
    if (!formData.audio_file) {
      newErrors.audio_file = "Аудіо файл є обов'язковим";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm() && formData.audio_file) {
      // Use the hook directly
      analyzeAI({
        id_crm: formData.id_crm,
        manager_id: id || "",
        client_phone: formData.client_phone,
        file: formData.audio_file,
      });
    }
  };

  const handleClose = () => {
    if (!isAnalyzing) {
      setFormData({
        id_crm: "",
        client_phone: "",
        audio_file: null,
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[600px]">
      <div className="p-10">
        {/* Modal Header */}
        <div className="text-center mb-8">
          <h2 className="text-[#22272F] text-[24px] font-semibold leading-[100%]">
            Додати новий AI аналіз
          </h2>
        </div>

        {/* Form Fields */}
        <div className="space-y-6 mb-8">
          {/* ID CRM */}
          <div>
            <label className="block text-[#00101F] text-[16px] font-medium mb-2">
              ID CRM
            </label>
            <Input
              placeholder="Введіть ID CRM"
              value={formData.id_crm}
              onChange={(e) => handleInputChange("id_crm", e.target.value)}
              disabled={isAnalyzing}
              className={errors.id_crm ? "border-red-500" : ""}
            />
            {errors.id_crm && (
              <p className="text-red-500 text-[14px] mt-1">{errors.id_crm}</p>
            )}
          </div>

          {/* Client Phone */}
          <div>
            <label className="block text-[#00101F] text-[16px] font-medium mb-2">
              Телефон клієнта
            </label>
            <Input
              placeholder="Введіть телефон клієнта"
              value={formData.client_phone}
              onChange={(e) =>
                handleInputChange("client_phone", e.target.value)
              }
              disabled={isAnalyzing}
              className={errors.client_phone ? "border-red-500" : ""}
            />
            {errors.client_phone && (
              <p className="text-red-500 text-[14px] mt-1">
                {errors.client_phone}
              </p>
            )}
          </div>

          {/* Audio File */}
          <div>
            <label className="block text-[#00101F] text-[16px] font-medium mb-2">
              Аудіо файл
            </label>
            <div className="relative">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                disabled={isAnalyzing}
                className={`w-full px-4 py-3 border rounded-[12px] text-[16px] leading-[100%] transition-colors
                  ${errors.audio_file ? "border-red-500" : "border-[#EAEAEA]"}
                  ${
                    isAnalyzing
                      ? "bg-gray-100 cursor-not-allowed"
                      : "hover:border-[#739C9C] focus:border-[#739C9C] focus:outline-none"
                  }
                  file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold
                  file:bg-[#739C9C] file:text-white hover:file:bg-[#5F8888]`}
              />
            </div>
            {formData.audio_file && (
              <p className="text-[#739C9C] text-[14px] mt-1">
                Обрано: {formData.audio_file.name}
              </p>
            )}
            {errors.audio_file && (
              <p className="text-red-500 text-[14px] mt-1">
                {errors.audio_file}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isAnalyzing}
            className="flex-1 !w-full max-w-[100px]"
          >
            Відміна
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isAnalyzing}
            className="flex-1 !w-full max-w-[140px] bg-[#739C9C] hover:bg-[#5F8888] active:bg-[#4A6B6B] disabled:opacity-50"
          >
            {isAnalyzing ? "Аналізую..." : "Аналізувати"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddAnalysisModal;
