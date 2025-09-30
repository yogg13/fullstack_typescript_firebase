import React from 'react';
import { Dialog } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from './LoadingSpinner';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmStyle?: 'primary' | 'danger';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmStyle = 'primary',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmButtonClass = confirmStyle === 'danger' 
    ? 'btn-danger' 
    : 'btn-primary';

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex items-center mb-4">
            {confirmStyle === 'danger' && (
              <div className="flex-shrink-0 mr-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
            )}
            
            <Dialog.Title className="text-lg font-medium text-gray-900">
              {title}
            </Dialog.Title>
          </div>

          <Dialog.Description className="text-sm text-gray-600 mb-6">
            {message}
          </Dialog.Description>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="btn-secondary"
            >
              {cancelText}
            </button>
            
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`${confirmButtonClass} relative min-w-[100px]`}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default ConfirmDialog;