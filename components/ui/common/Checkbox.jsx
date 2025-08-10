import React from "react";
import { IoCheckmark as Check } from "react-icons/io5";
import { Checkbox } from "radix-ui";

const CheckBox = ({
  id,
  className,
  defaultChecked = false,
  indicatorClassname = "",
  ...props
}) => {
  const customClass = `flex size-[25px] appearance-none items-center justify-center rounded bg-white cursor-pointer border border-gray-200 outline-none transition duration-200ms  ${className}`;
  return (
    <Checkbox.Root
      defaultChecked={defaultChecked}
      required
      className={customClass}
      {...props}
      id={id}
    >
      <Checkbox.Indicator
        className={`bg-primary border rounded-md border-white ${indicatorClassname}`}
      >
        <Check className="w-6 h-6 text-white" />
      </Checkbox.Indicator>
    </Checkbox.Root>
  );
};

export default CheckBox;
