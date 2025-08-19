import React from "react";
import { showSuccessToast, showErrorToast, toast } from "../utils/toast";

/**
 * ToastExample Component
 *
 * A demonstration component showing all the different ways to use
 * the SuccessToast and ErrorToast components.
 *
 * This component serves as both documentation and testing interface
 * for the toast notification system.
 */
const ToastExample: React.FC = () => {
  // Basic toast examples
  const handleBasicSuccess = () => {
    showSuccessToast("Операцію виконано успішно!");
  };

  const handleBasicError = () => {
    showErrorToast("Сталася помилка при виконанні операції");
  };

  // Custom duration examples
  const handleShortSuccess = () => {
    showSuccessToast("Коротке повідомлення (2 сек)", 2000);
  };

  const handleLongError = () => {
    showErrorToast("Довге повідомлення про помилку (8 секунд)", 8000);
  };

  // Multiple toasts
  const handleMultipleToasts = () => {
    showSuccessToast("Перше повідомлення");
    setTimeout(() => showErrorToast("Друге повідомлення"), 500);
    setTimeout(() => showSuccessToast("Третє повідомлення"), 1000);
  };

  // Dismiss all toasts
  const handleDismissAll = () => {
    toast.dismiss();
  };

  // API simulation examples
  const handleApiSuccess = async () => {
    // Simulate API call
    showSuccessToast("Завантаження...", 1000);
    setTimeout(() => {
      showSuccessToast("Дані успішно завантажено з сервера!");
    }, 1000);
  };

  const handleApiError = async () => {
    // Simulate API error
    setTimeout(() => {
      showErrorToast("Помилка з'єднання з сервером (код: 500)");
    }, 500);
  };

  // Form validation examples
  const handleFormValidation = () => {
    const email = "invalid-email";
    if (!email.includes("@")) {
      showErrorToast("Введіть правильний email адрес");
    } else {
      showSuccessToast("Email валідний!");
    }
  };

  // Authentication examples
  const handleLogin = () => {
    // Simulate login process
    const success = Math.random() > 0.5;
    if (success) {
      showSuccessToast("Ви успішно увійшли в систему!");
    } else {
      showErrorToast("Невірний email або пароль");
    }
  };

  // File upload examples
  const handleFileUpload = () => {
    // Simulate file upload
    const fileSize = Math.random() * 10; // MB
    if (fileSize > 5) {
      showErrorToast("Файл занадто великий (максимум 5MB)");
    } else {
      showSuccessToast("Файл успішно завантажено!");
    }
  };

  // Network examples
  const handleNetworkOperation = () => {
    // Simulate network check
    const isOnline = navigator.onLine;
    if (isOnline) {
      showSuccessToast("З'єднання з інтернетом активне");
    } else {
      showErrorToast("Відсутнє з'єднання з інтернетом");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Toast Notification Examples
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Basic Examples */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Basic Examples
          </h2>
          <div className="space-y-3">
            <button
              onClick={handleBasicSuccess}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Basic Success
            </button>
            <button
              onClick={handleBasicError}
              className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Basic Error
            </button>
          </div>
        </div>

        {/* Duration Examples */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Custom Duration
          </h2>
          <div className="space-y-3">
            <button
              onClick={handleShortSuccess}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Short (2s)
            </button>
            <button
              onClick={handleLongError}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Long (8s)
            </button>
          </div>
        </div>

        {/* Multiple & Control */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Multiple & Control
          </h2>
          <div className="space-y-3">
            <button
              onClick={handleMultipleToasts}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Multiple Toasts
            </button>
            <button
              onClick={handleDismissAll}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Dismiss All
            </button>
          </div>
        </div>

        {/* API Examples */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            API Simulation
          </h2>
          <div className="space-y-3">
            <button
              onClick={handleApiSuccess}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              API Success
            </button>
            <button
              onClick={handleApiError}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              API Error
            </button>
          </div>
        </div>

        {/* Form Examples */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Form Validation
          </h2>
          <div className="space-y-3">
            <button
              onClick={handleFormValidation}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Validate Email
            </button>
            <button
              onClick={handleLogin}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Login Attempt
            </button>
          </div>
        </div>

        {/* File & Network */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            File & Network
          </h2>
          <div className="space-y-3">
            <button
              onClick={handleFileUpload}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Upload File
            </button>
            <button
              onClick={handleNetworkOperation}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Check Network
            </button>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="mt-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          How to Use in Your Components
        </h2>
        <div className="bg-gray-800 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
          <pre>{`import { showSuccessToast, showErrorToast } from '../utils/toast';

// Basic usage
showSuccessToast("Операцію виконано успішно!");
showErrorToast("Сталася помилка");

// With custom duration
showSuccessToast("Message", 6000); // 6 seconds

// In async functions
try {
  await apiCall();
  showSuccessToast("Дані збережено!");
} catch (error) {
  showErrorToast("Помилка збереження");
}`}</pre>
        </div>
      </div>

      {/* Visual Guide */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">
          Visual Specifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2 text-blue-700">
              Success Toast
            </h3>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Green checkmark icon (#0AAA02)</li>
              <li>• Light green icon background</li>
              <li>• Text: "Успіх!" + custom message</li>
              <li>• 398px × 81px dimensions</li>
              <li>• Top-right positioning</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-blue-700">
              Error Toast
            </h3>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Red X icon (#FF3B30)</li>
              <li>• Light red icon background</li>
              <li>• Text: "Помилка!" + custom message</li>
              <li>• 398px × 81px dimensions</li>
              <li>• Top-right positioning</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastExample;
