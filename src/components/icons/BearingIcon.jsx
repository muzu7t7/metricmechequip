import React from 'react';

/**
 * Custom SVG icon representing a ball bearing (cross-section view).
 * Outer ring, inner ring, and 6 ball bearings evenly spaced between them.
 */
const BearingIcon = ({ size = 24, ...props }) => (
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
    {/* Outer ring */}
    <circle cx="12" cy="12" r="10" />
    {/* Inner ring */}
    <circle cx="12" cy="12" r="4" />
    {/* 6 ball bearings at r=7 from center, every 60° */}
    <circle cx="12"    cy="5"    r="1.5" fill="currentColor" stroke="none" />
    <circle cx="18.06" cy="8.5"  r="1.5" fill="currentColor" stroke="none" />
    <circle cx="18.06" cy="15.5" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="12"    cy="19"   r="1.5" fill="currentColor" stroke="none" />
    <circle cx="5.94"  cy="15.5" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="5.94"  cy="8.5"  r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

export default BearingIcon;
