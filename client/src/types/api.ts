// This is a type declaration for API Error interface (Axios Error)
export interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
}

// Generic API types
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error: string;
}

// Form state types
export interface FormState {
  isLoading: boolean;
  error: string | null;
}
