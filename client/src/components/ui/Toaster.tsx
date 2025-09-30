import { useState, useEffect } from "react";
import { toast } from "../../utils/toast";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
}

function Toaster() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe(setToasts);
    return unsubscribe;
  }, []);

  const getIcon = (type: ToastMessage["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case "error":
        return <XCircleIcon className="h-5 w-5 text-red-400" />;
      case "warning":
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />;
      case "info":
        return <InformationCircleIcon className="h-5 w-5 text-blue-400" />;
      default:
        return null;
    }
  };

  const getStyles = (type: ToastMessage["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 text-green-800 border-green-200";
      case "error":
        return "bg-red-50 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      case "info":
        return "bg-blue-50 text-blue-800 border-blue-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toastItem) => (
        <div
          key={toastItem.id}
          className={`
            max-w-sm p-4 border rounded-lg shadow-lg animate-slide-up
            ${getStyles(toastItem.type)}
          `}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">{getIcon(toastItem.type)}</div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">{toastItem.message}</p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={() => toast.remove(toastItem.id)}
                className="inline-flex text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Toaster;
