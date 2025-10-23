import "./Frame1StatesDefault.css";

export const Frame1StatesDefault = ({
  states = "default",
  className,
  ...props
}) => {
  const variantsClassName = "states-" + states;

  return (
    <img
      className={
        "frame-1-states-default " + className + " " + variantsClassName
      }
      src="frame-1-states-default.svg"
    />
  );
};
