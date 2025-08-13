"use client";

import React, { useState } from "react";
import { Eye } from "lucide-react";
import { FaEyeSlash } from "react-icons/fa";

const InputRow = ({
  label,
  name,
  type = "text",
  required = true,
  errorMessage = "",
  value,
  className = "",
  labelClassName = "",
  onChange = () => {},
  ...props
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const tooglePasswordVisibility = () => setPasswordVisible(!isPasswordVisible);
  
  const customClass = `w-full px-5 py-3 rounded-xl outline-none focus:outline-none ring-2 transition duration-300 ring-white focus:ring-primary bg-[#F9F9F9] ${className}`;
  const customlabelClass = `block text-sm font-extrabold font-montserrat-medium mb-3 ${labelClassName}`;

  return (
    <div className="mb-3 relative">
      <label
        className={customlabelClass}
        htmlFor={name}
      >
        {" "}
        {label}{" "}
      </label>
      <input
        className={customClass}
        type={isPasswordVisible ? "text" : type}
        name={name}
        id={name}
        value={value}
        required={required}
        onChange={onChange}
        {...props}
      />
      {type === "password" && (
        <>
          <span
            className="absolute px-4 z-50 right-0 mt-4 transition-all duration-200 cursor-pointer"
            onClick={tooglePasswordVisibility}
          >
            {" "}
            {isPasswordVisible ? (
              <Eye className="w-6 h-6" />
            ) : (
              <FaEyeSlash className="w-6 h-6" />
            )}
          </span>
        </>
      )}
      {errorMessage && (
        <p className="text-danger text-[12px]"> {errorMessage} </p>
      )}
    </div>
  );
};

export default React.memo(InputRow);
