"use client";

import { useState, useRef, useEffect } from "react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  altBefore?: string;
  altAfter?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  altBefore = "Before",
  altAfter = "After",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateAfter90] = useState(false);

  // Debug logging for images
  useEffect(() => {
    console.log("🔍 [Debug] BeforeAfterSlider images:", {
      beforeImage,
      afterImage,
      altBefore,
      altAfter
    });
  }, [beforeImage, afterImage, altBefore, altAfter]);

  // Detect orientation mismatch between before/after and rotate the AFTER
  // image to match the BEFORE orientation for consistent comparison.
  // Removed client-side rotation. Server now normalizes orientation.
  useEffect(() => {}, [beforeImage, afterImage]);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0]!.clientX);
  };

  const handleStart = () => setIsDragging(true);
  const handleEnd = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden rounded-[2rem]"
      onMouseDown={(e) => {
        handleStart();
        handleMove(e.clientX);
      }}
      onTouchStart={(e) => {
        handleStart();
        handleMove(e.touches[0]!.clientX);
      }}
    >
      {/* After Image (full) */}
      <div className="absolute inset-0">
        <img
          src={afterImage}
          alt={altAfter}
          className="h-full w-full object-cover"
          draggable={false}
          style={rotateAfter90 ? { transform: "rotate(0deg)" } : undefined}
        />
      </div>

      {/* Before Image (clipped) */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        }}
      >
        <img
          src={beforeImage}
          alt={altBefore}
          className="h-full w-full object-cover"
          draggable={false}
          // Server ensures correct orientation; no rotation here
        />
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
        style={{
          left: `${sliderPosition}%`,
          transform: "translateX(-50%)",
        }}
      >
        {/* Slider Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-white">
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l4-4 4 4m0 6l-4 4-4-4"
            />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium">
        BEFORE
      </div>
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium">
        AFTER
      </div>
    </div>
  );
}

