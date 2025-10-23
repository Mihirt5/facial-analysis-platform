import type { NextPage } from "next";
import Image from "next/image";

export type StyleType = {
  className?: string;

  /** Variant props */
  thickness?: 64;
};

const Style: NextPage<StyleType> = ({ className = "", thickness = 56 }) => {
  return (
    <div className={`w-[92px] h-[46px] relative z-[2] ${className}`}>
      <Image
        className="absolute h-full w-full top-[0%] right-[0%] bottom-[1.09%] left-[0%] rounded-lg max-w-full overflow-hidden max-h-full"
        width={92}
        height={46}
        sizes="100vw"
        alt=""
        src="/Subtract4.svg"
        style={{ width: "auto", height: "auto" }}
      />
      <Image
        className="absolute h-full w-full top-[0%] right-[0%] bottom-[1.09%] left-[0%] rounded-lg max-w-full overflow-hidden max-h-full z-[1]"
        width={92}
        height={46}
        sizes="100vw"
        alt=""
        src="/Subtract5.svg"
        style={{ width: "auto", height: "auto" }}
      />
      <Image
        className="absolute h-full w-full top-[0%] right-[0%] bottom-[1.09%] left-[0%] rounded-lg max-w-full overflow-hidden max-h-full z-[2]"
        width={92}
        height={46}
        sizes="100vw"
        alt=""
        src="/Subtract3.svg"
        style={{ width: "auto", height: "auto" }}
      />
      <Image
        className="absolute h-full w-full top-[0%] right-[0%] bottom-[1.09%] left-[0%] rounded-lg max-w-full overflow-hidden max-h-full z-[3]"
        width={92}
        height={46}
        sizes="100vw"
        alt=""
        src="/Subtract2.svg"
        style={{ width: "auto", height: "auto" }}
      />
    </div>
  );
};

export default Style;
