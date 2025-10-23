import "./DonutCount3Thickness48.css";

export const DonutCount3Thickness48 = ({
  count = "6",
  thickness = "4",
  className,
  ...props
}) => {
  const variantsClassName = "count-" + count + " thickness-" + thickness;

  return (
    <img
      className={
        "donut-count-3-thickness-48 " + className + " " + variantsClassName
      }
      src="donut-count-3-thickness-48.svg"
    />
  );
};
