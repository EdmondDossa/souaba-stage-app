import React from "react";
import { FaSpinner } from "react-icons/fa";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  isLoading = false,
  ...props
}) => {
  const baseStyles =
    "flex items-center justify-center font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out";

  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 text-gray-800",
    outline:
      "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700",
  };

  const sizeStyles = {
    sm: "text-sm py-1 px-3",
    md: "text-base py-2 px-4",
    lg: "text-lg py-3 px-6",
  };

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button disabled={isLoading} className={combinedStyles} {...props}>
       { isLoading ? <FaSpinner className="animate-spin" />: children}
    </button>
  );
};

export default Button;
