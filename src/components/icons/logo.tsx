import React from 'react';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Food Wastage Detection Logo"
    >
      <g fill="none" fillRule="evenodd">
        <g transform="translate(0, 4)" fill="hsl(var(--primary))">
          <path
            d="M20.2,15.1c-1.2-1.2-2.8-1.9-4.6-1.9c-1.8,0-3.4,0.6-4.6,1.9c-1.2,1.2-1.9,2.8-1.9,4.6s0.6,3.4,1.9,4.6
		c1.2,1.2,2.8,1.9,4.6,1.9s3.4-0.6,4.6-1.9c1.2-1.2,1.9-2.8,1.9-4.6S21.4,16.3,20.2,15.1z M18.5,22.5c-0.7,0.7-1.6,1-2.9,1
		c-1.2,0-2.2-0.4-2.9-1c-0.7-0.7-1-1.6-1-2.9s0.4-2.2,1-2.9c0.7-0.7,1.6-1,2.9-1c1.2,0,2.2,0.4,2.9,1c0.7,0.7,1,1.6,1,2.9
		S19.2,21.8,18.5,22.5z"
          />
          <path
            d="M19.7,1.9C17.6,0.6,15.2,0,12.5,0C9.1,0,6.2,1.2,3.7,3.7C1.2,6.2,0,9.1,0,12.5c0,2.4,0.5,4.6,1.5,6.6l2-1.2
		c-0.8-1.7-1.2-3.4-1.2-5.4c0-2.8,1-5.2,2.9-7.1C7,3,9.4,2,12.2,2c2.3,0,4.4,0.5,6.2,1.5L19.7,1.9z"
          />
          <path
            d="M31.4,16.2c0-1.7,0.1-3,0.4-3.9l-1.9-0.8c-0.5,1.4-0.7,3.1-0.7,5.1c0,2.6,0.5,4.9,1.6,6.7l2-1.1
		C31.8,21.2,31.4,19,31.4,16.2z"
          />
        </g>
        <text
          fontFamily="'PT Sans', sans-serif"
          fontSize="14"
          fontWeight="bold"
          fill="hsl(var(--foreground))"
          x="38"
          y="26"
        >
          Food Wastage Detection
        </text>
      </g>
    </svg>
  );
}
