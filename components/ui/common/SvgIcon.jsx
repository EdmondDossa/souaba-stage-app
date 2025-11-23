import Image from "next/image";

const SvgIcon = ({ name, size = 24, className = "" }) => {
  return (
    <img
      src={`/icons/${name}.svg`}
      alt={name}
      style={{ width:24, height:24}}
      className={`block ${className}`}
    />
  );
};

export default SvgIcon;
