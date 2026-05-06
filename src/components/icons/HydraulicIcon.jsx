import React from 'react';

/**
 * Flanged pipe gate valve icon — matches the style of industrial
 * pipe/valve schematic icons (flanges on both sides, circular handwheel on top).
 *
 *      |○|          ← handwheel (circle + stem)
 *  ═══[■■■]═══     ← flanges + valve body
 */
const HydraulicIcon = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    {/* Left Flange & Pipe Connection */}
    <rect x="1" y="10" width="1.5" height="8" rx="0.2" />
    <rect x="2.5" y="12.5" width="4" height="3" />

    {/* Right Flange & Pipe Connection */}
    <rect x="21.5" y="10" width="1.5" height="8" rx="0.2" />
    <rect x="17.5" y="12.5" width="4" height="3" />

    {/* Valve Body (Outer ring with center bore) */}
    <path fillRule="evenodd" d="M12 7a7 7 0 100 14 7 7 0 000-14zm0 3a4 4 0 110 8 4 4 0 010-8z" />

    {/* Bolt patterns (punched holes) */}
    <circle cx="12" cy="8.5" r="0.6" fill="white" />
    <circle cx="15.2" cy="10" r="0.6" fill="white" />
    <circle cx="16.5" cy="14" r="0.6" fill="white" />
    <circle cx="14" cy="16.8" r="0.6" fill="white" />
    <circle cx="10" cy="16.8" r="0.6" fill="white" />
    <circle cx="7.5" cy="14" r="0.6" fill="white" />
    <circle cx="8.8" cy="10" r="0.6" fill="white" />

    {/* Stem Assembly */}
    <rect x="10.2" y="7" width="3.6" height="2" />
    <rect x="11.2" y="4.5" width="1.6" height="3" />

    {/* Top T-Handle */}
    <rect x="6" y="3.5" width="12" height="1.5" rx="0.3" />
  </svg>
);

export default HydraulicIcon;
