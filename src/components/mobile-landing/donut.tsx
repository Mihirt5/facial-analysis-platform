import type { NextPage } from "next";
import Image from "next/image";

export type DonutType = {
  className?: string;

  /** Variant props */
  count?: 3;
  thickness?: 48;
};

const Donut: NextPage<DonutType> = ({
  className = "",
  count = 6,
  thickness = 4,
}) => {
  return (
    <div className={`w-28 h-28 relative ${className}`}>
      <Image
        className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded max-w-full overflow-hidden max-h-full"
        width={112}
        height={112}
        sizes="100vw"
        alt=""
        src="/Subtract.svg"
      />
      <Image
        className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded max-w-full overflow-hidden max-h-full z-[1]"
        width={112}
        height={112}
        sizes="100vw"
        alt=""
        src="/Subtract7.svg"
      />
      <Image
        className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded max-w-full overflow-hidden max-h-full z-[2]"
        width={112}
        height={112}
        sizes="100vw"
        alt=""
        src="/Subtract6.svg"
      />
    </div>
  );
};

export default Donut;
