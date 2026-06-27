"use client";

import { CSSProperties, useEffect, useRef } from "react";

interface ShineBorderProps {
  shineColor?: string[];
  borderRadius?: number;
  borderWidth?: number;
}

export function ShineBorder({
  shineColor = ["#A07CFE", "#FE8FB5", "#FFBE7B"],
  borderRadius = 8,
  borderWidth = 2,
}: ShineBorderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const gradient = shineColor.join(", ");
    const styleSheet = document.createElement("style");
    const keyframes = `
      @keyframes shine {
        0% {
          background-position: 0% 0%;
        }
        100% {
          background-position: 200% 0%;
        }
      }
    `;
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);

    container.style.setProperty(
      "--border-radius",
      `${borderRadius}px`
    );
    container.style.setProperty("--border-width", `${borderWidth}px`);
    container.style.setProperty("--shine-color", gradient);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [shineColor, borderRadius, borderWidth]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={
        {
          "--border-radius": `${borderRadius}px`,
          "--border-width": `${borderWidth}px`,
          "--shine-color": shineColor.join(", "),
          borderRadius: `${borderRadius}px`,
        } as CSSProperties & Record<string, any>
      }
    >
      <div
        className="absolute inset-0 opacity-75"
        style={
          {
            backgroundImage: `conic-gradient(from 0deg, ${shineColor.join(", ")})`,
            animation: "shine 8s linear infinite",
            backgroundSize: "200% 200%",
            borderRadius: `${borderRadius}px`,
            padding: `${borderWidth}px`,
            WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          } as CSSProperties & Record<string, any>
        }
      />
    </div>
  );
}
