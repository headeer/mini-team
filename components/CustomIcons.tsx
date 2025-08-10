import React from "react";

type IconProps = { size?: number; className?: string; color?: string };

export const BucketIcon: React.FC<IconProps> = ({ size = 24, className, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M4 10c0-4 3-7 8-7s8 3 8 7v2H4v-2Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M5 12l1.2 7a3 3 0 0 0 3 2.5h5.6a3 3 0 0 0 3-2.5L19 12H5Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M9 10c0-2 1.5-3.5 3-3.5S15 8 15 10" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const DitchingBucketIcon: React.FC<IconProps> = ({ size = 24, className, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="8" width="18" height="6" rx="2" stroke={color} strokeWidth="1.8" />
    <path d="M4 14l2 5h12l2-5" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

export const QuickCouplerIcon: React.FC<IconProps> = ({ size = 24, className, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M5 9h14M6 15h12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="8" cy="12" r="2.2" stroke={color} strokeWidth="1.8" />
    <circle cx="16" cy="12" r="2.2" stroke={color} strokeWidth="1.8" />
  </svg>
);

export const AugerIcon: React.FC<IconProps> = ({ size = 24, className, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2v5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M12 7c-4 0-4 3-8 3 4 0 4 3 8 3s4-3 8-3c-4 0-4-3-8-3Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 13v4l-2 3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const RipperIcon: React.FC<IconProps> = ({ size = 24, className, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M6 3l8 2 4 4-6 10-4-2 4-6-6-8Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M8 19l-2 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const RakeIcon: React.FC<IconProps> = ({ size = 24, className, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M3 17h18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M6 17V7m4 10V7m4 10V7m4 10V7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const AccessoriesIcon: React.FC<IconProps> = ({ size = 24, className, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="12" r="3" stroke={color} strokeWidth="1.8" />
    <rect x="12" y="9" width="9" height="6" rx="2" stroke={color} strokeWidth="1.8" />
  </svg>
);

export const categoryIconFor = (title?: string) => {
  const t = (title || "").toLowerCase();
  if (/skarpow/.test(t)) return DitchingBucketIcon;
  if (/\błyżk|lyzk|kopi/.test(t)) return BucketIcon;
  if (/szybkoz|\bcw0?5|\bms0[138]|\bs3[0459]|q-?fit/.test(t)) return QuickCouplerIcon;
  if (/wiertnic|wiert|auger/.test(t)) return AugerIcon;
  if (/zryw|ripper/.test(t)) return RipperIcon;
  if (/grab/.test(t)) return RakeIcon;
  return AccessoriesIcon;
};

