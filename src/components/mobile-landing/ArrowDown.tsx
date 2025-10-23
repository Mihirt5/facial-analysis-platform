"use client";
import type { FC } from "react";

type ArrowDownProps = {
  stroke?: string; // CSS color
  height?: number; // total height in px
  className?: string;
};

// Thin vertical arrow with a guaranteed connected head (filled triangle) and 1px stem.
const ArrowDown: FC<ArrowDownProps> = ({ stroke = "#000", height = 30, className = "" }) => {
  const headHeight = 8; // px reserved for the head
  const stemHeight = Math.max(0, height - headHeight);
  const viewHeight = height;
  const width = 12;
  const stemWidth = 1;
  const stemX = (width - stemWidth) / 2; // center stem

  return (
    <svg
      className={className}
      width={width}
      height={viewHeight}
      viewBox={`0 0 ${width} ${viewHeight}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable={false}
    >
      {/* Stem as a rect to avoid anti-alias gaps */}
      <rect x={stemX} y={0} width={stemWidth} height={stemHeight} fill={stroke} />
      {/* Filled head to guarantee connection with the stem */}
      <path d={`M0 ${stemHeight} L${width / 2} ${viewHeight} L${width} ${stemHeight} Z`} fill={stroke} />
    </svg>
  );
};

export default ArrowDown;


