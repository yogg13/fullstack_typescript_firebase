import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface ErrorAlertProps {
  title: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

function ErrorAlert({
  title,
  message,
  onRetry,
  retryText = "Try Again",
}: ErrorAlertProps) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <p className="mt-1 text-sm text-red-700">{message}</p>
          {onRetry && (
            <div className="mt-4">
              <button
                onClick={onRetry}
                className="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-3 rounded-md text-sm transition-colors"
              >
                {retryText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorAlert;
