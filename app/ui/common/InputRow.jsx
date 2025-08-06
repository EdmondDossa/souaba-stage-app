"use client";

import React, { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { FaEyeSlash } from "react-icons/fa";

const InputRow = ({
  label,
  name,
  type = "text",
  required = true,
  defaultValue,
  ...props
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const tooglePasswordVisibility = () => setPasswordVisible(!isPasswordVisible);

  return (
    <div className="mb-4">
      <label
        className="block text-[15px] font-extrabold font-montserrat-medium mb-3"
        htmlFor={name}
      >
        {" "}
        {label}{" "}
      </label>
      <input
        className="w-full px-5 py-4 rounded-xl outline-none focus:outline-none ring-2 transition duration-300 ring-white focus:ring-primary bg-[#F9F9F9]"
        type={isPasswordVisible ? "text" : type}
        name={name}
        id={name}
        defaultValue={defaultValue}
        {...props}
      />
      {type === "password" && (
        <>
          <span
            className="float-right  px-4 z-50 -translate-y-10 transition-all duration-200 cursor-pointer"
            onClick={tooglePasswordVisibility}
          >
            {" "}
            {isPasswordVisible ? (
              <Eye className="w-6 h-6" />
            ) : (
              <FaEyeSlash className="w-6 h-6" />
            )}
          </span>
          {/* To avoid float-right effect */}
          <div className="clear-both"></div>
        </>
      )}
    </div>
  );
};

export default InputRow;
