export interface IFrame1StatesDefaultProps {
  states?: "default" | "mid" | "end";
  className?: string;
}

export const Frame1StatesDefault = ({
  states = "default",
  className,
  ...props
}: IFrame1StatesDefaultProps) => {
  const variantsClassName = "states-" + states;

  return (
    <img
      className={
        "h-[814px] relative overflow-visible " +
        (className ? className + " " : "") +
        variantsClassName
      }
      src="/frame-1-states-default.svg"
    />
  );
};


