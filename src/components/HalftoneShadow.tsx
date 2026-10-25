import React from "react";

export const HalftonePattern: React.FC = () => {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <pattern id="halftone-dots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="2.2" fill="#111111" opacity="0.35" />
        </pattern>
        <pattern id="halftone-dense" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.8" fill="#111111" opacity="0.5" />
        </pattern>
      </defs>
    </svg>
  );
};
