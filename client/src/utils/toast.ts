// Simple toast implementation
// Untuk production, gunakan library seperti react-hot-toast atau sonner

type ToastType = "success" | "error" | "info" | "warning";

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

class ToastManager {
  private listeners: ((toasts: ToastMessage[]) => void)[] = [];
  private toasts: ToastMessage[] = [];

  subscribe(listener: (toasts: ToastMessage[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.toasts));
  }

  private show(type: ToastType, message: string, duration = 5000) {
    const id = Date.now().toString();
    const toast = { id, type, message, duration };

    this.toasts.push(toast);
    this.notify();

    setTimeout(() => {
      this.remove(id);
    }, duration);

    return id;
  }

  remove(id: string) {
    this.toasts = this.toasts.filter((toast) => toast.id !== id);
    this.notify();
  }

  success(message: string, duration?: number) {
    return this.show("success", message, duration);
  }

  error(message: string, duration?: number) {
    return this.show("error", message, duration);
  }

  info(message: string, duration?: number) {
    return this.show("info", message, duration);
  }

  warning(message: string, duration?: number) {
    return this.show("warning", message, duration);
  }
}

export const toast = new ToastManager();
