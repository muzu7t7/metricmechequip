import React from 'react';

const BoltIcon = ({ size = 24, ...props }) => (
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
    {/* Hex Head */}
    <path d="M12 2l4.5 2.5v5L12 12 7.5 9.5v-5L12 2z" />
    
    {/* Bolt Shank */}
    <rect x="10.5" y="12" width="3" height="10" />
    
    {/* Thread lines */}
    <path d="M10.5 15h3" />
    <path d="M10.5 18h3" />
    <path d="M10.5 21h3" />
    
    {/* Top reflection line for premium look */}
    <path d="M12 4v4" opacity="0.3" />
  </svg>
);

export default BoltIcon;
