export interface IDonutCount3Thickness48Props {
  count?: "2" | "3" | "4" | "5" | "6";
  thickness?:
    | "4"
    | "8"
    | "16"
    | "24"
    | "32"
    | "40"
    | "48"
    | "56"
    | "64"
    | "72"
    | "80";
  className?: string;
}

export const DonutCount3Thickness48 = ({
  count = "6",
  thickness = "4",
  className,
  ...props
}: IDonutCount3Thickness48Props) => {
  const variantsClassName = "count-" + count + " thickness-" + thickness;

  return (
    <img
      className={
        "shrink-0 w-28 h-28 relative overflow-visible " +
        className +
        " " +
        variantsClassName
      }
      style={{ aspectRatio: "1" }}
      src="donut-count-3-thickness-48.svg"
    />
  );
};
