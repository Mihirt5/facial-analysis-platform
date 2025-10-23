"use client";

export function AuthBackground() {
  return (
    <>
      {/* Animated gradient background with fractal noise */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 transition-all duration-1000"
          style={{
            backgroundImage: 'linear-gradient(135deg, #8B9DC3 0%, #C0C7D4 25%, #DFE3E8 50%, #C0C7D4 75%, #8B9DC3 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 15s ease infinite',
          }}
        />
        
        {/* Animated blurred circles for depth */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-40"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(192,199,212,0) 70%)',
            filter: 'blur(80px)',
            left: '20%',
            top: '10%',
            animation: 'float1 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(139,157,195,0.8) 0%, rgba(192,199,212,0) 70%)',
            filter: 'blur(60px)',
            right: '15%',
            bottom: '20%',
            animation: 'float2 25s ease-in-out infinite',
          }}
        />
        
        {/* SVG noise filter */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
          <filter id="fractalNoiseAuth">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.65" 
              numOctaves="3" 
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#fractalNoiseAuth)" />
        </svg>
      </div>
    </>
  );
}

