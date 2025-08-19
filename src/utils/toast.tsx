import toast, { Toast } from "react-hot-toast";

/**
 * SuccessToast Component
 *
 * A custom toast component for displaying success notifications.
 * Features:
 * - Green checkmark icon with light green background
 * - Fixed dimensions: 398px width × 81px height
 * - Light blue background (#ECF2FE) with subtle shadow
 * - Smooth enter/exit animations
 * - Ukrainian text ("Успіх!")
 *
 * @param t - Toast object from react-hot-toast containing visibility state
 * @param message - Custom success message to display
 */
const SuccessToast = ({ t, message }: { t: Toast; message: string }) => (
  <div
    className={`${
      t.visible ? "animate-enter" : "animate-leave"
    } flex flex-row items-center p-3 gap-4 relative w-[398px] h-[81px] bg-[#ECF2FE] rounded-2xl pointer-events-auto`}
    style={{
      boxShadow: "0px 8px 14px rgba(207, 207, 207, 0.55)",
    }}
  >
    {/* Icon Container - Green checkmark with light green background */}
    <div className="items-center flex flex-col justify-center items-center p-2 gap-[16px] w-12 h-12 bg-[rgba(10,170,2,0.1)] rounded-[32px] flex-none">
      <div className="w-6 h-6 flex-none">
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 6L9 17L4 12"
            stroke="#0AAA02"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>

    {/* Text Container */}
    <div className="flex flex-col justify-center items-start p-0 gap-[4px] flex-none flex-grow">
      <p className="font-open-sans font-semibold text-base leading-[19px] text-[#22272F] flex-none">
        Успіх!
      </p>
      <p className="font-open-sans font-normal text-[14px] leading-[17px] text-[#A4A4A4] flex-none self-stretch">
        {message}
      </p>
    </div>
  </div>
);

/**
 * ErrorToast Component
 *
 * A custom toast component for displaying error notifications.
 * Features:
 * - Red X icon with light red background
 * - Fixed dimensions: 398px width × 81px height
 * - Light blue background (#ECF2FE) with subtle shadow
 * - Smooth enter/exit animations
 * - Ukrainian text ("Помилка!")
 *
 * @param t - Toast object from react-hot-toast containing visibility state
 * @param message - Custom error message to display
 */
const ErrorToast = ({ t, message }: { t: Toast; message: string }) => (
  <div
    className={`${
      t.visible ? "animate-enter" : "animate-leave"
    } flex flex-row items-center p-3 gap-4 relative w-[398px] h-[81px] bg-[#ECF2FE] rounded-2xl pointer-events-auto`}
    style={{
      boxShadow: "0px 8px 14px rgba(207, 207, 207, 0.55)",
    }}
  >
    {/* Icon Container - Red X with light red background */}
    <div className="items-center flex flex-col justify-center items-center p-2 gap-[16px] w-12 h-12 bg-[rgba(255,59,48,0.1)] rounded-[32px] flex-none">
      <div className="w-6 h-6 flex-none">
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 6L6 18M6 6L18 18"
            stroke="#FF3B30"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>

    {/* Text Container */}
    <div className="flex flex-col justify-center items-start p-0 gap-[4px] flex-none flex-grow">
      <p className="font-open-sans font-semibold text-base leading-[19px] text-[#22272F] flex-none">
        Помилка!
      </p>
      <p className="font-open-sans font-normal text-[14px] leading-[17px] text-[#A4A4A4] flex-none self-stretch">
        {message}
      </p>
    </div>
  </div>
);

/**
 * showSuccessToast Function
 *
 * Displays a success toast notification.
 *
 * @param message - The success message to display
 * @param duration - Duration in milliseconds (default: 4000ms = 4 seconds)
 *
 * Usage:
 * showSuccessToast("Операцію виконано успішно!");
 * showSuccessToast("Дані збережено", 6000); // Custom duration
 */
export const showSuccessToast = (message: string, duration: number = 2000) => {
  toast.custom((t) => <SuccessToast t={t} message={message} />, {
    duration,
    position: "top-right",
  });
};

/**
 * showErrorToast Function
 *
 * Displays an error toast notification.
 *
 * @param message - The error message to display
 * @param duration - Duration in milliseconds (default: 4000ms = 4 seconds)
 *
 * Usage:
 * showErrorToast("Сталася помилка при виконанні операції");
 * showErrorToast("Помилка з'єднання", 5000); // Custom duration
 */
export const showErrorToast = (message: string, duration: number = 2000) => {
  toast.custom((t) => <ErrorToast t={t} message={message} />, {
    duration,
    position: "top-right",
  });
};

// Export the toast object for other uses like toast.dismiss()
export { toast };
