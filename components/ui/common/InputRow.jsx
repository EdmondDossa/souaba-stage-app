"use client";

import React, { useState } from "react";
import { Eye } from "lucide-react";
import { FaEyeSlash } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/plain.css";

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

  const customClass = `
    w-full px-5 py-3 rounded-xl outline-none focus:outline-none 
    ring-2 transition duration-300 ring-white focus:ring-primary 
    bg-[#F9F9F9] 
    ${className}
  `;
  const customlabelClass = `block text-sm font-extrabold 
    font-montserrat-medium mb-3 ${labelClassName}
  `;

  return (
    <div className="mb-3 relative">
      <label className={customlabelClass} htmlFor={name}>
        {label}
      </label>

      {type === "tel" ? (
        <PhoneInput
          country="bj"
          showDropdown={false}
          buttonStyle={{ border: "none" }}
          placeholder=""
          searchStyle={{ border: "none" }}
          inputStyle={{
            border: "none",
            width: "100%",
            borderRadius: "12px",
            padding: "24px 50px",
            backgroundColor: "#F9F9F9",
          }}
          value={value}
          inputProps={{ name: name }}
        />
      ) : (
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
      )}

      {type === "password" && (
        <>
          <span
            className="absolute px-4 z-50 right-0 mt-4 transition-all duration-200 cursor-pointer"
            onClick={tooglePasswordVisibility}
          >
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
      <div className="hidden py-3 border-none"></div>
    </div>
  );
};

export default React.memo(InputRow);
