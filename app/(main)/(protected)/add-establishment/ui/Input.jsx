import InputWithMap from "@/components/ui/common/InputWithMap";

function Input({
  name,
  type = "text",
  value,
  error,
  unitValue = "", //pour les champs qui ont d'unité
  unitValueExposant = "",
  onChange = () => {},
  ...props
}) {
  const commonClass =
    "border border-gray-200 rounded-lg outline-0 w-full p-3 placeholder:text-md placeholder-black font-montserrat-medium  ring-2 ring-white focus:border-1 focus:ring-primary";
  return (
    <div>
      {type === "textarea" ? (
        <>
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
          <p className="empty:hidden text-red-500 text-sm font-light"></p>
        </>
      ) : type === "number" ? (
        <div className="flex items-center">
          <div className="w-full">
            <input
              id={name}
              name={name}
              type={type}
              value={value ?? ""}
              onChange={onChange}
              className={`${commonClass} ${
                unitValue
                  ? "!w-[calc(100%-5px)] focus:!border-1 !border-3 !border-r-0 !rounded-r-0 "
                  : ""
              }`}
              {...props}
            />
            <p className="empty:hidden text-red-500 text-sm font-light">
              {" "}
              {error}{" "}
            </p>
          </div>
          {unitValue && (
            <div className="bg-gray-200 py-3 h-[49px] !ring-0 font-montserrat-bold w-[55px] place-content-center text-center rounded-r-[10px] -translate-x-3">
              {" "}
              {unitValue} <sup> {unitValueExposant} </sup>{" "}
            </div>
          )}
        </div>
      ) : type === "map" ? (
        <InputWithMap
          id={name}
          name={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          className={`${commonClass}`}
          {...props}
        />
      ) : (
        <>
          <input
            id={name}
            name={name}
            type={type}
            value={value ?? ""}
            onChange={onChange}
            className={`${commonClass}`}
            {...props}
          />
          <p className="empty:hidden text-red-500 text-sm font-light">
            {" "}
            {error}{" "}
          </p>
        </>
      )}
    </div>
  );
}

export default Input;
