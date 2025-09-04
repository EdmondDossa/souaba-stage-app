import { ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const SelectComponent = ({ placeholder, options, onChange }) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [currentValue, setCurrentValue] = useState("");
  const ref = useRef(null);

  function handleChange(value) {
    setShowDropDown(false);
    setCurrentValue(value);
    onChange(value);
  }

  useEffect(() => {
    function handleOutsideClick(e) {
      if (ref.current && !ref.current.contains(e.target))
        setShowDropDown(false);
    }
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <div ref={ref} className="w-64 relative">
      <div
        onClick={() => setShowDropDown(!showDropDown)}
        className="cursor-pointer border h-10 text-sm mt-2 py-4 px-3 border-gray-200 flex items-center justify-between rounded-lg"
      >
        {currentValue || placeholder} <ChevronDown className="text-gray-200" />
      </div>
      {showDropDown && (
        <ul className="bg-white border-lg border border-gray-200 rounded-lg absolute w-full">
          {options.map((option) => (
            <li
              onClick={() => handleChange(option)}
              className={`cursor-pointer w-full py-2 px-4 text-center font-montserrat text-sm hover:bg-gray-100 font-bold ${
                option === currentValue
                  ? "font-montserrat-bold text-gray-600 bg-gray-200"
                  : "text-gray-800 "
              }`}
              key={option}
            >
              {" "}
              <button className="text-center">{option}</button>{" "}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectComponent;
