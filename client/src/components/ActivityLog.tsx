import { useState, useEffect } from "react";
import {
  ref,
  onValue,
  off,
  query,
  orderByChild,
  limitToLast,
} from "firebase/database";
import { database } from "../config/firebase";
import type { ProductLog } from "../types/product";
import { formatDistanceToNow } from "date-fns";
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "./ui/LoadingSpinner";

function ActivityLog() {
  const [logs, setLogs] = useState<ProductLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reference ke Firebase Realtime Database
    const logsRef = ref(database, "product_logs");

    // Query untuk mendapatkan 50 log terakhir, diurutkan berdasarkan timestamp
    const logsQuery = query(
      logsRef,
      orderByChild("timestamp"),
      limitToLast(50)
    );

    console.log("🔥 Connecting to Firebase Realtime Database...");

    // Listener untuk perubahan data real-time
    const unsubscribe = onValue(
      logsQuery,
      (snapshot) => {
        setLoading(false);
        setError(null);

        if (snapshot.exists()) {
          const data = snapshot.val();

          // Convert object ke array dan urutkan terbaru dulu
          const logsArray: ProductLog[] = Object.keys(data)
            .map((key) => ({
              id: key,
              ...data[key],
            }))
            .sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            );

          setLogs(logsArray);
          console.log("✅ Firebase data updated:", logsArray.length, "logs");
        } else {
          setLogs([]);
          console.log("📭 No logs found in Firebase");
        }
      },
      (error) => {
        setLoading(false);
        setError("Failed to load activity logs");
        console.error("❌ Firebase error:", error);
      }
    );

    // Cleanup function untuk unsubscribe saat component unmount
    return () => {
      console.log("🔌 Disconnecting from Firebase...");
      off(logsRef);
      unsubscribe();
    };
  }, []);

  // const getActionIcon = (action: ProductLog["action"]) => {
  //   switch (action) {
  //     case "CREATE_PRODUCT":
  //       return <PlusCircleIcon className="h-5 w-5 text-green-600" />;
  //     case "UPDATE_PRODUCT":
  //       return <PencilSquareIcon className="h-5 w-5 text-blue-600" />;
  //     case "DELETE_PRODUCT":
  //       return <TrashIcon className="h-5 w-5 text-red-600" />;
  //     default:
  //       return <ClockIcon className="h-5 w-5 text-gray-600" />;
  //   }
  // };

  // const getActionText = (action: ProductLog["action"]) => {
  //   switch (action) {
  //     case "CREATE_PRODUCT":
  //       return "created product";
  //     case "UPDATE_PRODUCT":
  //       return "updated product";
  //     case "DELETE_PRODUCT":
  //       return "deleted product";
  //     default:
  //       return "performed action on product";
  //   }
  // };

  // const getActionColor = (action: ProductLog["action"]) => {
  //   switch (action) {
  //     case "CREATE_PRODUCT":
  //       return "text-green-800 bg-green-100";
  //     case "UPDATE_PRODUCT":
  //       return "text-blue-800 bg-blue-100";
  //     case "DELETE_PRODUCT":
  //       return "text-red-800 bg-red-100";
  //     default:
  //       return "text-gray-800 bg-gray-100";
  //   }
  // };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Activity Log
            </h2>
          </div>
          <div className="flex items-center bg-white px-2 py-1 rounded-full shadow-sm border border-gray-200">
            <div
              className={`w-2 h-2 rounded-full ${
                error ? "bg-red-400" : "bg-green-400"
              } mr-2 animate-pulse`}
            ></div>
            <span className="text-xs font-medium text-gray-700">
              {error ? "Disconnected" : "Live"}
            </span>
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-600">Real-time product activity</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-4 text-center">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p className="text-gray-600 text-sm">No activity yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {logs.map((log) => (
              <LogItem
                key={log.id || `${log.productId}-${log.timestamp}`}
                log={log}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Individual Log Item Component
interface LogItemProps {
  log: ProductLog;
}

function LogItem({ log }: LogItemProps) {
  const getActionIcon = (action: ProductLog["action"]) => {
    switch (action) {
      case "CREATE_PRODUCT":
        return <PlusCircleIcon className="h-5 w-5 text-green-600" />;
      case "UPDATE_PRODUCT":
        return <PencilSquareIcon className="h-5 w-5 text-blue-600" />;
      case "DELETE_PRODUCT":
        return <TrashIcon className="h-5 w-5 text-red-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getActionText = (action: ProductLog["action"]) => {
    switch (action) {
      case "CREATE_PRODUCT":
        return "created product";
      case "UPDATE_PRODUCT":
        return "updated product";
      case "DELETE_PRODUCT":
        return "deleted product";
      default:
        return "performed action on product";
    }
  };

  const getActionColor = (action: ProductLog["action"]) => {
    switch (action) {
      case "CREATE_PRODUCT":
        return "text-green-800 bg-green-100";
      case "UPDATE_PRODUCT":
        return "text-blue-800 bg-blue-100";
      case "DELETE_PRODUCT":
        return "text-red-800 bg-red-100";
      default:
        return "text-gray-800 bg-gray-100";
    }
  };

  const actionIcon = getActionIcon(log.action);
  const actionText = getActionText(log.action);
  const actionColor = getActionColor(log.action);

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors animate-fade-in">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">{actionIcon}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${actionColor}`}
            >
              {log.action.replace("_", " ")}
            </span>
          </div>

          <p className="text-sm text-gray-900">
            {actionText}{" "}
            {log.productName && (
              <span className="font-medium">"{log.productName}"</span>
            )}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ActivityLog;
