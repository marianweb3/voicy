# Complete Toast Notification System Implementation Guide

## Overview

This guide provides a complete implementation of custom SuccessToast and ErrorToast components using `react-hot-toast`. The system includes beautiful animations, custom styling, and easy-to-use helper functions.

## 🎨 Visual Design

### Design Specifications

- **Dimensions**: 398px width × 81px height
- **Background**: Light blue (#ECF2FE) with subtle shadow
- **Border Radius**: 16px (rounded-2xl)
- **Shadow**: `0px 8px 14px rgba(207, 207, 207, 0.55)`
- **Font**: Open Sans (configurable)
- **Position**: Top-right corner
- **Duration**: 4 seconds (customizable)

### Icons

- **Success**: Green checkmark (#0AAA02) on light green background (rgba(10,170,2,0.1))
- **Error**: Red X (#FF3B30) on light red background (rgba(255,59,48,0.1))

## 📦 Dependencies Required

```bash
npm install react-hot-toast
```

## 🚀 Implementation Steps

### 1. Create Toast Components (`src/utils/toast.tsx`)

```tsx
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
export const showSuccessToast = (message: string, duration: number = 4000) => {
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
export const showErrorToast = (message: string, duration: number = 4000) => {
  toast.custom((t) => <ErrorToast t={t} message={message} />, {
    duration,
    position: "top-right",
  });
};

// Export the toast object for other uses like toast.dismiss()
export { toast };
```

### 2. Add CSS Animations (add to your main CSS file)

```css
/* Toast animations for SuccessToast and ErrorToast */
@keyframes enter {
  0% {
    transform: translate3d(0, -200%, 0) scale(0.6);
    opacity: 0.5;
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 1;
  }
}

@keyframes leave {
  0% {
    transform: translate3d(0, 0, -1px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, -150%, -1px) scale(0.6);
    opacity: 0;
  }
}

.animate-enter {
  animation: enter 0.35s ease-out;
}

.animate-leave {
  animation: leave 0.4s ease-out forwards;
}
```

### 3. Setup Toaster Component (in your main App component)

```tsx
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="App">
      {/* Your app content */}

      {/* Add the Toaster component */}
      <Toaster />
    </div>
  );
}

export default App;
```

## 📝 Usage Examples

### Basic Usage

```tsx
import { showSuccessToast, showErrorToast } from "./utils/toast";

// Success notification
showSuccessToast("Операцію виконано успішно!");

// Error notification
showErrorToast("Сталася помилка при виконанні операції");
```

### Advanced Usage Examples

```tsx
import { showSuccessToast, showErrorToast, toast } from "./utils/toast";

function ExampleComponent() {
  // Basic success
  const handleSuccess = () => {
    showSuccessToast("Дані успішно збережено!");
  };

  // Basic error
  const handleError = () => {
    showErrorToast("Не вдалося зберегти дані");
  };

  // Custom duration (6 seconds)
  const handleLongMessage = () => {
    showSuccessToast("Це повідомлення буде показане протягом 6 секунд", 6000);
  };

  // Dismiss all toasts
  const dismissAll = () => {
    toast.dismiss();
  };

  // API integration example
  const handleApiCall = async () => {
    try {
      const response = await fetch("/api/data");
      if (response.ok) {
        showSuccessToast("Дані завантажено успішно!");
      } else {
        showErrorToast("Помилка завантаження даних");
      }
    } catch (error) {
      showErrorToast("Помилка з'єднання з сервером");
    }
  };

  // Form submission example
  const handleFormSubmit = async (formData: any) => {
    try {
      await submitForm(formData);
      showSuccessToast("Форму відправлено успішно!");
    } catch (error) {
      showErrorToast("Помилка відправки форми");
    }
  };

  return (
    <div className="space-y-4">
      <button onClick={handleSuccess} className="btn-success">
        Show Success
      </button>
      <button onClick={handleError} className="btn-error">
        Show Error
      </button>
      <button onClick={handleLongMessage} className="btn-info">
        Show Long Message
      </button>
      <button onClick={dismissAll} className="btn-secondary">
        Dismiss All
      </button>
    </div>
  );
}
```

### React Query Integration

```tsx
import { useMutation, useQuery } from "@tanstack/react-query";
import { showSuccessToast, showErrorToast } from "./utils/toast";

// Mutation with toast notifications
const createUserMutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => {
    showSuccessToast("Користувача створено успішно!");
  },
  onError: (error) => {
    showErrorToast(`Помилка створення користувача: ${error.message}`);
  },
});

// Query with error handling
const { data, error } = useQuery({
  queryKey: ["users"],
  queryFn: fetchUsers,
  onError: (error) => {
    showErrorToast("Помилка завантаження користувачів");
  },
});
```

## 🎨 Customization Options

### Color Schemes

You can easily customize colors by modifying the component:

```tsx
// Success colors
const successIconBg = "bg-[rgba(10,170,2,0.1)]"; // Light green background
const successIconColor = "#0AAA02"; // Green icon

// Error colors
const errorIconBg = "bg-[rgba(255,59,48,0.1)]"; // Light red background
const errorIconColor = "#FF3B30"; // Red icon

// Background
const toastBg = "bg-[#ECF2FE]"; // Light blue background
```

### Different Languages

```tsx
// English version
<p className="font-open-sans font-semibold text-base leading-[19px] text-[#22272F] flex-none">
  Success!
</p>

// Ukrainian version (current)
<p className="font-open-sans font-semibold text-base leading-[19px] text-[#22272F] flex-none">
  Успіх!
</p>
```

### Custom Duration

```tsx
// Short notification (2 seconds)
showSuccessToast("Quick message", 2000);

// Long notification (8 seconds)
showErrorToast("Important error message", 8000);

// Permanent (until manually dismissed)
showSuccessToast("Stay until dismissed", Infinity);
```

## 🔧 Animation Details

### Enter Animation

- **Initial State**: Positioned -200% above viewport, scaled to 0.6, 50% opacity
- **Final State**: Normal position (0%), scale 1.0, full opacity
- **Duration**: 0.35 seconds
- **Easing**: ease-out

### Leave Animation

- **Initial State**: Normal position, scale 1.0, full opacity
- **Final State**: Positioned -150% above viewport, scaled to 0.6, 0% opacity
- **Duration**: 0.4 seconds
- **Easing**: ease-out
- **Fill Mode**: forwards (keeps final state)

## 🐛 Common Issues & Solutions

### Font Not Loading

If Open Sans font isn't loading, make sure you have it imported in your CSS:

```css
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap");
```

### Animations Not Working

Ensure the CSS animations are properly defined and the classes are being applied:

```css
/* Make sure these keyframes exist in your CSS */
@keyframes enter {
  /* ... */
}
@keyframes leave {
  /* ... */
}
```

### Toasts Not Appearing

Make sure the `<Toaster />` component is rendered in your app:

```tsx
// This should be in your main App component
<Toaster />
```

### TypeScript Errors

If you get TypeScript errors, make sure react-hot-toast is properly typed:

```bash
npm install @types/react-hot-toast
```

## 🚀 Advanced Features

### Custom Positioning

```tsx
export const showSuccessToast = (message: string, duration: number = 4000) => {
  toast.custom((t) => <SuccessToast t={t} message={message} />, {
    duration,
    position: "top-center", // top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
  });
};
```

### Multiple Toasts Management

```tsx
import { toast } from "./utils/toast";

// Dismiss specific toast
const toastId = showSuccessToast("Message");
toast.dismiss(toastId);

// Dismiss all toasts
toast.dismiss();

// Check if any toasts are visible
const hasToasts = toast.visible.length > 0;
```

### Promise-based Toasts

```tsx
import { toast } from "react-hot-toast";

const myPromise = fetch("/api/data");

toast.promise(myPromise, {
  loading: "Завантаження...",
  success: (data) => showSuccessToast("Дані завантажено!"),
  error: (err) => showErrorToast("Помилка завантаження"),
});
```

## 📱 Responsive Design

The toasts are designed with fixed width (398px) but can be made responsive:

```tsx
// Responsive width version
className={`${
  t.visible ? "animate-enter" : "animate-leave"
} flex flex-row items-center p-3 gap-4 relative w-[398px] max-w-[90vw] h-[81px] bg-[#ECF2FE] rounded-2xl pointer-events-auto`}
```

## 🧪 Testing

Example test for toast components:

```tsx
import { render, screen } from "@testing-library/react";
import { showSuccessToast } from "./utils/toast";

test("shows success toast with message", () => {
  showSuccessToast("Test message");
  expect(screen.getByText("Test message")).toBeInTheDocument();
  expect(screen.getByText("Успіх!")).toBeInTheDocument();
});
```

## 🔄 Migration from Other Toast Libraries

If migrating from other toast libraries:

```tsx
// From react-toastify
import { toast } from "react-toastify";
toast.success("Message"); // OLD

import { showSuccessToast } from "./utils/toast";
showSuccessToast("Message"); // NEW

// From react-hot-toast default
import { toast } from "react-hot-toast";
toast.success("Message"); // OLD

import { showSuccessToast } from "./utils/toast";
showSuccessToast("Message"); // NEW
```

## 📚 Complete File Structure

```
src/
├── utils/
│   └── toast.tsx          # Toast components and functions
├── index.css              # CSS with animations
└── main.tsx              # App entry with Toaster component
```

This implementation provides a complete, production-ready toast notification system with beautiful animations and easy customization options.
