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
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Outer ring of the valve body */}
    <circle cx="12" cy="14" r="7" />
    
    {/* Inner ring / bore */}
    <circle cx="12" cy="14" r="3" />

    {/* Flanges */}
    <rect x="2" y="10" width="2" height="8" rx="0.5" fill="currentColor" stroke="none" />
    <rect x="20" y="10" width="2" height="8" rx="0.5" fill="currentColor" stroke="none" />
    
    {/* Pipe connections */}
    <path d="M4 14h1.5" />
    <path d="M18.5 14H20" />

    {/* Stem */}
    <path d="M12 7V4" />
    
    {/* Handwheel / Handle */}
    <rect x="7" y="3" width="10" height="1.5" rx="0.75" fill="currentColor" stroke="none" />
    
    {/* Mounting bolts (stylized points) */}
    <circle cx="12" cy="10.5" r="0.5" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="14" r="0.5" fill="currentColor" stroke="none" />
    <circle cx="12" cy="17.5" r="0.5" fill="currentColor" stroke="none" />
    <circle cx="8.5" cy="14" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

export default HydraulicIcon;
