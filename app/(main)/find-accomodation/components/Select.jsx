import { ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const SelectComponent = ({ placeholder, options, onChange, value }) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [currentValue, setCurrentValue] = useState(value || "");
  console.log("Select current value:", currentValue);
  const ref = useRef(null);

  // permet de trouver le label correspondant à la valeur actuelle
  const currentLabel = options.find(
    (opt) => (typeof opt === "object" ? opt.value === currentValue : opt === currentValue)
  );
  const displayValue = typeof currentLabel === "object" ? currentLabel?.label : currentLabel || currentValue;

  function handleChange(option) {
    setShowDropDown(false);
    const newValue = typeof option === "object" ? option.value : option;
    setCurrentValue(newValue);
    onChange(newValue);
  }

  useEffect(() => {
    function handleOutsideClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setShowDropDown(false);
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
        {displayValue || placeholder} <ChevronDown className="text-gray-200" />
      </div>
      {showDropDown && (
        <ul className="bg-white border-lg border border-gray-200 rounded-lg absolute w-full z-10">
          {options.map((option, index) => {
            const optionValue = typeof option === "object" ? option.value : option;
            const optionLabel = typeof option === "object" ? option.label : option;

            return (
              <li
                onClick={() => handleChange(option)}
                className={`cursor-pointer w-full py-2 px-4 text-center font-montserrat text-sm hover:bg-gray-100 font-bold ${
                  optionValue === currentValue
                    ? "font-montserrat-bold text-gray-600 bg-gray-200"
                    : "text-gray-800 "
                }`}
                key={index}
              >
                <button className="text-center">{optionLabel}</button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SelectComponent;
