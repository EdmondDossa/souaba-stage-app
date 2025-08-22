import React from "react";

function Input({
  name,
  type = "text",
  value,
  error,
  onChange = () => {},
  ...props
}) {
  return (
    <div>
      <input
        id={name}
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        className="border border-gray-200 rounded-lg outline-0 w-full p-3 placeholder:text-md  placeholder-black font-montserrat-medium"
        {...props}
      />
      <p className="empty:hidden text-red-500 text-sm font-sans"> {error} </p>
    </div>
  );
}

export default Input;
