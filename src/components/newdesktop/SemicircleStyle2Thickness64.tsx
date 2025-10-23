export interface ISemicircleStyle2Thickness64Props {
  thickness?: "56" | "64" | "72" | "80";
  visibleComponent?: boolean;
  className?: string;
}

export const SemicircleStyle2Thickness64 = ({
  thickness = "56",
  visibleComponent = undefined,
  className,
  ...props
}: ISemicircleStyle2Thickness64Props) => {
  const variantsClassName = "thickness-" + thickness;

  return (
    <img
      className={
        "w-[92px] h-[46px] relative overflow-visible " +
        (className ? className + " " : "") +
        variantsClassName
      }
      style={{ aspectRatio: "2/1" }}
      src="/semicircle-style-2-thickness-64.svg"
    />
  );
};


