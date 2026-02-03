"use client";

import React, { useState, useMemo } from "react";
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
  hasError = false,
  value,
  className = "",
  labelClassName = "",
  onBlur = () => {},
  onChange = () => {},
  ...props
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const tooglePasswordVisibility = () => setPasswordVisible(!isPasswordVisible);

  const passwordValue = useMemo(
    () => (type === "password" ? (value ?? "") : value),
    [type, value],
  );
  const MIN_PASSWORD_LENGTH = 8;
  const passwordProgress = useMemo(() => {
    if (type !== "password" || !passwordValue) return 0;
    return Math.min(passwordValue.length / MIN_PASSWORD_LENGTH, 1);
  }, [passwordValue, type]);

  const errorRing = hasError
    ? "ring-red-500 focus:ring-red-500"
    : "ring-white focus:ring-primary";
  const customClass = `
    w-full px-5 py-3 rounded-xl outline-none focus:outline-none 
    ring-2 transition duration-300 ${errorRing}
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
          onChange={onChange}
          inputStyle={{
            border: "none",
            width: "100%",
            borderRadius: "12px",
            padding: "24px 50px",
            backgroundColor: "#F9F9F9",
          }}
          value={value}
          inputProps={{ name: name, ...props }}
          onBlur={onBlur}
          {...props}
        />
      ) : (
        <input
          className={customClass}
          type={isPasswordVisible ? "text" : type}
          name={name}
          id={name}
          value={passwordValue || value}
          required={required}
          onBlur={onBlur}
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
          {passwordValue?.length > 0 && (
            <div className="mt-3 space-y-1">
              <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-200"
                  style={{ width: `${passwordProgress * 100}%` }}
                />
              </div>
              {passwordValue.length < MIN_PASSWORD_LENGTH && (
                <p className="text-danger text-[12px] font-semibold">
                  Mot de passe trop court (min. {MIN_PASSWORD_LENGTH}{" "}
                  caractères)
                </p>
              )}
            </div>
          )}
        </>
      )}
      {errorMessage && (
        <p className="text-red-600 text-[12px]"> {errorMessage} </p>
      )}
      <div className="hidden py-3 border-none"></div>
    </div>
  );
};

export default React.memo(InputRow);
