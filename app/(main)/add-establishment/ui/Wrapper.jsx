import React from "react";

const Wrapper = ({ children, withBorder = true, fullWidth = false }) => {
  return (
    <div
      className={`rounded-lg py-4 px-8 mb-10 ${
        withBorder ? "border border-gray-200" : ""
      } ${!fullWidth ? "max-w-5xl mx-auto" : ""}`}
    >
      {children}
    </div>
  );
};

export default Wrapper;
