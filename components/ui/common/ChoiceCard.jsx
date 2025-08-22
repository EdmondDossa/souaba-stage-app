import Image from "next/image";
import { CheckBox } from ".";

//optionType radio|checkbox
const ChoiceCard = ({
  icon,
  label,
  optionType = "radio",
  currentValue,
  setCurrentValue,
}) => {
  function updateCheckboxesState(isChecked,label) {
    if (isChecked) {
      setCurrentValue((prev) => [...prev, label]);
    } else {
      setCurrentValue((prev) =>
        prev.filter((value) => value !== label)
      );
    }
  }

  return (
    <label
      htmlFor={label}
      className="relative cursor-pointer flex items-center justify-between bg-gray-100 w-[280px] h-[100px] rounded-lg"
      key={label}
    >
      <strong className="block place-content-center bg-primary w-1/3 h-full rounded-l-lg">
        {icon && (
          <Image className="mx-auto" width={50} height={50} src={icon} alt="" />
        )}
      </strong>
      <div className="flex-grow ps-5 text-start w-2/3 p-2">
        <h2 className="font-montserrat-bold text-gray-700"> {label} </h2>
      </div>
      {optionType === "radio" && (
        <div className="shadow-3xl shadow-amber-700">
          <input
            id={label}
            type="radio"
            value={label}
            onChange={() => setCurrentValue(label)}
            checked={currentValue === label}
            className="absolute -top-2 left-12 border-[3.5px] bg-white border-gray-200 rounded-full w-5 h-5 m-4 checked:bg-yellow-400 appearance-none"
          />
        </div>
      )}

      {optionType === "checkbox" && (
        <div className="shadow-3xl shadow-amber-700">
          <CheckBox
            id={label}
            type="checkbox"
            value={label}
            onCheckedChange={(isChecked) =>
              updateCheckboxesState(isChecked, label)
            }
            defaultChecked={currentValue?.includes(label)}
            className="absolute bg-white w-5 h-5 top-2 left-16 rounded-sm border-2 border-gray-300"
            indicatorClassname="bg-white w-5 h-5 border-2 border-gray-300  rounded-sm rounded-none [&_svg]:w-4 [&_svg]:h-4  [&_svg]:text-primary"
          />
        </div>
      )}
    </label>
  );
};

export default ChoiceCard;
