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
        <>
          <div className="relative">
            <input
              id={name}
              name={name}
              type={type}
              value={value ?? ""}
              onChange={onChange}
              className={`${commonClass} ${unitValue ? "pr-16" : ""}`}
              {...props}
            />
            {unitValue && (
              <div className="absolute top-2 right-3 px-3 py-1 rounded-md text-sm font-montserrat-bold text-gray-700">
                {unitValue}{" "}
                <sup className="text-[10px] align-super">
                  {unitValueExposant}
                </sup>
              </div>
            )}
          </div>
          <p className="empty:hidden text-red-500 text-sm font-light">
            {" "}
            {error}{" "}
          </p>
        </>
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
