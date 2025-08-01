import type React from "react"

export function OrangeMoneyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <circle cx="12" cy="12" r="6" fill="#FF6600" />
      <path d="M8 12h8" stroke="white" strokeWidth="2" />
      <path d="M12 8v8" stroke="white" strokeWidth="2" />
      <text x="12" y="16" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">
        OM
      </text>
    </svg>
  )
}
