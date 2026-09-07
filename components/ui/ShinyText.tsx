"use client";

interface ShinyTextProps {
  text: string;
  className?: string;
  speed?: number;
  shimmerWidth?: number;
  disabled?: boolean;
}

export default function ShinyText({
  text,
  className = "",
  speed = 3,
  shimmerWidth = 200,
  disabled = false,
}: ShinyTextProps) {
  if (disabled) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span
      className={`relative inline-block overflow-hidden ${className}`}
      style={
        {
          "--shiny-speed": `${speed}s`,
          "--shimmer-width": `${shimmerWidth}px`,
        } as React.CSSProperties
      }
    >
      {/* Base text */}
      {text}
      {/* Shimmer overlay */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(
            105deg,
            transparent 40%,
            rgba(255, 255, 255, 0.55) 50%,
            transparent 60%
          )`,
          backgroundSize: `var(--shimmer-width) 100%`,
          backgroundRepeat: "no-repeat",
          backgroundPositionX: "-200%",
          animation: `shiny-sweep var(--shiny-speed) ease-in-out infinite`,
          mixBlendMode: "overlay",
        }}
      />
      <style>{`
        @keyframes shiny-sweep {
          0%   { background-position-x: -200%; }
          100% { background-position-x: 300%; }
        }
      `}</style>
    </span>
  );
}
