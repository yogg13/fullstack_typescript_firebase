import type {
  UseFormRegister,
  FieldError,
  FieldValues,
  Path,
} from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  required?: boolean;
  prefix?: string;
  suffix?: string;
  step?: string;
  min?: string;
  max?: string;
}

function FormField<T extends FieldValues>({
  label,
  name,
  type = "text",
  placeholder,
  register,
  error,
  required = false,
  prefix,
  suffix,
  step,
  min,
  max,
}: FormFieldProps<T>) {
  const fieldId = `field-${name}`;

  return (
    <div className="space-y-2">
      <label htmlFor={fieldId} className="form-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm font-medium">
              {prefix}
            </span>
          </div>
        )}

        <input
          id={fieldId}
          type={type}
          placeholder={placeholder}
          step={step}
          min={min}
          max={max}
          {...register(name, {
            valueAsNumber: type === "number",
          })}
          className={`w-full px-4 py-2 rounded-lg border ${
            error
              ? "border-red-300 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          } focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
            prefix ? "pl-8" : ""
          } ${suffix ? "pr-16" : ""}`}
        />

        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{suffix}</span>
          </div>
        )}
      </div>

      {error && <p className="form-error">{error.message}</p>}
    </div>
  );
}

export default FormField;
