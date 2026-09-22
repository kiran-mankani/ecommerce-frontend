import { forwardRef } from "react";

const Input = forwardRef(
  ({ label, error, type = "text", className = "", ...rest }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="label">{label}</label>}
        <input
          ref={ref}
          type={type}
          className={`input-field ${error ? "border-red-500" : ""} ${className}`}
          {...rest}
        />
        {error && <p className="error-text">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;