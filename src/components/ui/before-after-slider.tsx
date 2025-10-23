"use client";

import { useState, useRef, useEffect } from "react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
  initialPosition?: number; // 0-100
  reverse?: boolean; // when true, reveal from the right and overlay 'after' over 'before'
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt = "Before",
  afterAlt = "After",
  className = "",
  initialPosition = 50,
  reverse = false,
}: BeforeAfterSliderProps) {
  const initial = Math.max(0, Math.min(100, initialPosition));
  const [sliderPosition, setSliderPosition] = useState(initial);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSliderPosition(Math.max(0, Math.min(100, initialPosition)));
  }, [initialPosition]);

  const updateFromClientX = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Enable dragging and capture pointer to continue receiving events
    setIsDragging(true);
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault(); // Avoid in-app browsers treating this as a scroll
    updateFromClientX(e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    } catch {
      // no-op if capture was not set
    }
  };

  // Mouse/touch fallbacks for broader compatibility
  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (ev: MouseEvent) => updateFromClientX(ev.clientX);
    const onTouchMove = (ev: TouchEvent) => {
      const t = ev.touches[0] ?? ev.changedTouches[0];
      if (t) updateFromClientX(t.clientX);
    };
    const endDrag = () => setIsDragging(false);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", endDrag);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", endDrag);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", endDrag);
    };
  }, [isDragging]);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updateFromClientX(e.clientX);
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const t = e.touches[0] ?? e.changedTouches[0];
    if (t) updateFromClientX(t.clientX);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-lg bg-gray-200 select-none touch-none ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={{ WebkitUserSelect: "none", WebkitTouchCallout: "none" }}
    >
      {/* Background Image (depends on reverse) */}
      <img
        src={reverse ? beforeImage : afterImage}
        alt={reverse ? beforeAlt : afterAlt}
        className="h-full w-full object-cover"
        draggable={false}
      />

      {/* Overlay Image (Clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={
          reverse
            ? { clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`, WebkitClipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }
            : { clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`, WebkitClipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }
        }
      >
        <img
          src={reverse ? afterImage : beforeImage}
          alt={reverse ? afterAlt : beforeAlt}
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
        style={{ left: `${sliderPosition}%` }}
      />

      {/* Slider Handle */}
      <div
        className="absolute top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full bg-transparent border border-white/50 shadow-none transition-transform hover:scale-110 active:cursor-grabbing"
        style={{ left: `${sliderPosition}%` }}
        aria-hidden="true"
      >
      </div>

      {/* Labels */}
      <div className="absolute top-0 left-0 m-2 ml-4">
        <span className="text-xs font-thin text-white uppercase sm:text-sm">{reverse ? "After" : "Before"}</span>
      </div>
      <div className="absolute top-0 right-0 m-2 mr-4">
        <span className="text-xs font-thin text-white uppercase sm:text-sm">{reverse ? "Before" : "After"}</span>
      </div>
    </div>
  );
}
