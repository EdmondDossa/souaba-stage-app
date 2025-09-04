import React from "react";
import { GoDotFill } from "react-icons/go";
const PropertyEllipsis = ({ current }) => {
  return (
    <div className="flex items-center me-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <GoDotFill
          key={i}
          className={`text-lg text-gray-300 ${i + 1 === current ? "text-primary" : ""}`}
        />
      ))}
    </div>
  ); 
};

export default PropertyEllipsis;
