import React from "react";

const StepTitle = ({ children }) => {
  return (
    <h1 className="font-montserrat-bold  text-2xl lg:text-3xl text-center text-gray-700 my-4 mb-15">
      {children}
    </h1>
  );
};

export default StepTitle;
