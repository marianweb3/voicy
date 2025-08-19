# Complete Toast System Rebuild Guide

## 🎯 Overview

This document provides **everything** another AI needs to completely rebuild the SuccessToast and ErrorToast notification system from scratch. The system uses `react-hot-toast` with custom components, animations, and styling.

## 📋 Complete Implementation Checklist

### ✅ Dependencies

- [x] `react-hot-toast` - Main toast library
- [x] `@types/react` - TypeScript support
- [x] `tailwindcss` - Styling framework

### ✅ File Structure

```
src/
├── utils/
│   └── toast.tsx              # Main toast components and functions
├── components/
│   └── ToastExample.tsx       # Demo component (optional)
├── index.css                  # CSS with animations
└── main.tsx                   # App entry with Toaster setup
```

## 🚀 Step-by-Step Implementation

### Step 1: Install Dependencies

```bash
npm install react-hot-toast
```

### Step 2: Create Toast Components (`src/utils/toast.tsx`)

**CRITICAL SPECIFICATIONS:**

- **Dimensions**: Exactly 398px width × 81px height
- **Background**: `#ECF2FE` (light blue)
- **Shadow**: `0px 8px 14px rgba(207, 207, 207, 0.55)`
- **Border Radius**: 16px (`rounded-2xl`)
- **Position**: Top-right
- **Duration**: 4000ms default
- **Animation**: Enter/leave with scale and slide effects

```tsx
import toast, { Toast } from "react-hot-toast";

const SuccessToast = ({ t, message }: { t: Toast; message: string }) => (
  <div
    className={`${
      t.visible ? "animate-enter" : "animate-leave"
    } flex flex-row items-center p-3 gap-4 relative w-[398px] h-[81px] bg-[#ECF2FE] rounded-2xl pointer-events-auto`}
    style={{
      boxShadow: "0px 8px 14px rgba(207, 207, 207, 0.55)",
    }}
  >
    {/* Icon Container - Green checkmark */}
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

const ErrorToast = ({ t, message }: { t: Toast; message: string }) => (
  <div
    className={`${
      t.visible ? "animate-enter" : "animate-leave"
    } flex flex-row items-center p-3 gap-4 relative w-[398px] h-[81px] bg-[#ECF2FE] rounded-2xl pointer-events-auto`}
    style={{
      boxShadow: "0px 8px 14px rgba(207, 207, 207, 0.55)",
    }}
  >
    {/* Icon Container - Red X */}
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

export const showSuccessToast = (message: string, duration: number = 2000) => {
  toast.custom((t) => <SuccessToast t={t} message={message} />, {
    duration,
    position: "top-right",
  });
};

export const showErrorToast = (message: string, duration: number = 2000) => {
  toast.custom((t) => <ErrorToast t={t} message={message} />, {
    duration,
    position: "top-right",
  });
};

export { toast };
```

### Step 3: Add CSS Animations (to main CSS file)

**CRITICAL ANIMATION SPECIFICATIONS:**

- **Enter**: Slide from -200% Y, scale 0.6→1.0, opacity 0.5→1.0, 0.35s ease-out
- **Leave**: Slide to -150% Y, scale 1.0→0.6, opacity 1.0→0, 0.4s ease-out forwards

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

### Step 4: Setup Toaster in Main App

**CRITICAL**: Add `<Toaster />` component to your main app file:

```tsx
import { Toaster } from "react-hot-toast";

// In your main App component or main.tsx
function App() {
  return (
    <div>
      {/* Your app content */}
      <Toaster />
    </div>
  );
}
```

## 🎨 Visual Specifications

### Success Toast

- **Icon**: Green checkmark (SVG path: `M20 6L9 17L4 12`)
- **Icon Color**: `#0AAA02` (green)
- **Icon Background**: `rgba(10,170,2,0.1)` (light green)
- **Title**: "Успіх!" (Ukrainian for "Success!")
- **Title Font**: Open Sans, semibold, 16px, `#22272F`
- **Message Font**: Open Sans, normal, 14px, `#A4A4A4`

### Error Toast

- **Icon**: Red X (SVG path: `M18 6L6 18M6 6L18 18`)
- **Icon Color**: `#FF3B30` (red)
- **Icon Background**: `rgba(255,59,48,0.1)` (light red)
- **Title**: "Помилка!" (Ukrainian for "Error!")
- **Title Font**: Open Sans, semibold, 16px, `#22272F`
- **Message Font**: Open Sans, normal, 14px, `#A4A4A4`

### Common Specifications

- **Container**: 398px × 81px, `#ECF2FE` background
- **Padding**: 12px (p-3)
- **Gap**: 16px between icon and text
- **Border Radius**: 16px (rounded-2xl)
- **Shadow**: `0px 8px 14px rgba(207, 207, 207, 0.55)`
- **Position**: Top-right corner
- **Duration**: 4000ms (customizable)

## 📝 Usage Examples

### Basic Usage

```tsx
import { showSuccessToast, showErrorToast } from "./utils/toast";

// Success notification
showSuccessToast("Операцію виконано успішно!");

// Error notification
showErrorToast("Сталася помилка при виконанні операції");

// Custom duration
showSuccessToast("Custom message", 6000);
```

### Advanced Examples

```tsx
// API integration
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

// Form validation
if (!email.includes("@")) {
  showErrorToast("Введіть правильний email адрес");
} else {
  showSuccessToast("Email валідний!");
}

// Dismiss all toasts
import { toast } from "./utils/toast";
toast.dismiss();
```

### React Query Integration

```tsx
import { useMutation } from "@tanstack/react-query";

const mutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => showSuccessToast("Користувача створено!"),
  onError: (error) => showErrorToast(`Помилка: ${error.message}`),
});
```

## 🔧 Technical Details

### Animation Flow

1. **Entry**: Toast slides down from above viewport (-200% Y) while scaling from 60% to 100% and fading in
2. **Display**: Toast remains visible for specified duration (default 4s)
3. **Exit**: Toast slides up (-150% Y) while scaling down to 60% and fading out

### React Hot Toast Integration

- Uses `toast.custom()` for complete control over rendering
- `t.visible` property controls animation state
- `position: "top-right"` for consistent placement
- Custom duration support via function parameters

### TypeScript Types

```tsx
interface ToastProps {
  t: Toast; // From react-hot-toast
  message: string; // Custom message text
}

type ToastFunction = (message: string, duration?: number) => void;
```

## 🐛 Common Issues & Solutions

### 1. Animations Not Working

**Problem**: Toast appears without smooth animation
**Solution**: Ensure CSS keyframes are defined before use

### 2. Font Not Loading

**Problem**: Open Sans font not displaying
**Solution**: Add font import to CSS:

```css
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap");
```

### 3. Toasts Not Appearing

**Problem**: Toast functions called but nothing shows
**Solution**: Verify `<Toaster />` component is rendered in app

### 4. TypeScript Errors

**Problem**: Type errors with react-hot-toast
**Solution**: Ensure proper imports and types:

```tsx
import toast, { Toast } from "react-hot-toast";
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Success toast displays with green checkmark
- [ ] Error toast displays with red X
- [ ] Animations work smoothly (enter/exit)
- [ ] Custom durations work
- [ ] Multiple toasts stack properly
- [ ] `toast.dismiss()` removes all toasts
- [ ] Responsive design works on mobile

### Test Component

Create a test component with buttons to verify all functionality:

```tsx
const TestToasts = () => (
  <div className="space-y-4">
    <button onClick={() => showSuccessToast("Test success")}>
      Test Success
    </button>
    <button onClick={() => showErrorToast("Test error")}>Test Error</button>
    <button onClick={() => toast.dismiss()}>Dismiss All</button>
  </div>
);
```

## 📱 Responsive Considerations

The toasts are designed with fixed 398px width. For mobile responsiveness, consider:

```tsx
// Add max-width for mobile
className = "w-[398px] max-w-[90vw]";
```

## 🔄 Migration Guide

### From react-toastify

```tsx
// OLD
import { toast } from "react-toastify";
toast.success("Message");
toast.error("Error");

// NEW
import { showSuccessToast, showErrorToast } from "./utils/toast";
showSuccessToast("Message");
showErrorToast("Error");
```

### From native react-hot-toast

```tsx
// OLD
import { toast } from "react-hot-toast";
toast.success("Message");

// NEW
import { showSuccessToast } from "./utils/toast";
showSuccessToast("Message");
```

## 📦 Dependencies Summary

```json
{
  "react-hot-toast": "^2.4.1",
  "react": "^18.0.0",
  "react-dom": "^18.0.0"
}
```

## 🎯 Complete Implementation Priority

1. **FIRST**: Install `react-hot-toast`
2. **SECOND**: Create `src/utils/toast.tsx` with exact component code
3. **THIRD**: Add CSS animations to main stylesheet
4. **FOURTH**: Add `<Toaster />` to main app component
5. **FIFTH**: Test with basic usage examples

## 💡 Key Success Factors

1. **Exact Dimensions**: Must be 398px × 81px
2. **Exact Colors**: Use specified hex codes
3. **Exact Animations**: Follow the keyframe specifications
4. **Proper Setup**: Include Toaster component in app
5. **Ukrainian Text**: Use "Успіх!" and "Помилка!"

This guide contains **everything** needed to rebuild the complete toast notification system. Follow the steps in order, use the exact specifications, and the result will be identical to the original implementation.
