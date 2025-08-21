import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { MdOutlineLogout } from "react-icons/md";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const LogoutModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: LogoutModalProps) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[480px]">
      <div className="p-10">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-2xl bg-[#B245451A] flex items-center justify-center">
            <MdOutlineLogout size={40} className="text-[#B24545]" />
          </div>
        </div>

        {/* Modal Header */}
        <div className="text-center mb-8">
          <h2 className="text-[#22272F] text-[24px] font-semibold leading-[100%] mb-4">
            Вийти з системи
          </h2>
          <p className="text-[#9A9A9A] text-[16px] font-normal leading-[140%] max-w-[400px] mx-auto">
            Ви дійсно хочете вийти з системи? Вам доведеться знову увійти для доступу до платформи.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 !w-full max-w-[86px]"
          >
            Відміна
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 !w-full max-w-[120px] bg-[#B24545] hover:bg-[#A03939] active:bg-[#8B2F2F] disabled:opacity-50"
          >
            {isLoading ? "Виходжу..." : "Вийти"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutModal;
