import "./SemicircleStyle2Thickness64.css";

export const SemicircleStyle2Thickness64 = ({
  thickness = "56",
  visibleComponent = undefined,
  className,
  ...props
}) => {
  const variantsClassName = "thickness-" + thickness;

  return (
    <img
      className={
        "semicircle-style-2-thickness-64 " + className + " " + variantsClassName
      }
      src="semicircle-style-2-thickness-64.svg"
    />
  );
};
