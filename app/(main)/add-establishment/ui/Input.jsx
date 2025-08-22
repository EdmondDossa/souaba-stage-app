import React from "react";

function Input({
  name,
  type = "text",
  value,
  error,
  onChange = () => {},
  ...props
}) {
  
  const commonClass =
    "border border-gray-200 rounded-lg outline-0 w-full p-3 placeholder:text-md  placeholder-black font-montserrat-medium ring-2 ring-white focus:ring-primary";
  return (
    <div>
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          type={type}
          value={value ?? ""}
          rows={3}
          onChange={onChange}
          className={`${commonClass} resize-none`}
          {...props}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          className={`${commonClass}`}
          {...props}
        />
      )}
      <p className="empty:hidden text-red-500 text-sm font-light"> {error} </p>
    </div>
  );
}

export default Input;
