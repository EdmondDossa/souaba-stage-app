import React from "react";

const Wrapper = ({ children, withBorder = true }) => {
  return (
    <div
      className={`rounded-lg py-4 px-8 ${
        withBorder ? "border border-gray-200" : ""
      }`}
    >
      {children}
    </div>
  );
};

export default Wrapper;
