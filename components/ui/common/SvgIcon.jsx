import Image from "next/image";

const SvgIcon = ({ name, size = 24, className = "" }) => {
  return (
    <Image
      src={`/icons/${name}.svg`}
      alt={name}
      width={size}
      height={size}
      className={className}
    />
  );
};

export default SvgIcon;
