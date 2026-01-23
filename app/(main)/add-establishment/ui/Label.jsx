import React from "react";
import { Asterisk } from "lucide-react";

function Label({ displayName, id }) {
  return (
    <label
      className="font-montserrat-bold capitalize text-gray-800 font-bold text-md  flex items-center mb-2"
      htmlFor={id}
    >
      {" "}
      {displayName && (
        <>
          {" "}
          {displayName} <Asterisk className="w-4 h-4 text-danger" />{" "}
        </>
      )}
    </label>
  );
}

export default Label;
