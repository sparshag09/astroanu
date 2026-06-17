import { motion } from 'motion/react';

export function LotusIcon({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      width="80"
      height="80"
      viewBox="0 0 100 100"
      className={className}
      animate={{ rotate: [0, 5, 0, -5, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    >
      <g fill="#C89B3C" opacity="0.3">
        <ellipse cx="50" cy="70" rx="8" ry="25" transform="rotate(-30 50 70)" />
        <ellipse cx="50" cy="70" rx="8" ry="25" transform="rotate(-15 50 70)" />
        <ellipse cx="50" cy="70" rx="8" ry="25" />
        <ellipse cx="50" cy="70" rx="8" ry="25" transform="rotate(15 50 70)" />
        <ellipse cx="50" cy="70" rx="8" ry="25" transform="rotate(30 50 70)" />
        <circle cx="50" cy="70" r="10" fill="#C96A2B" opacity="0.6" />
      </g>
    </motion.svg>
  );
}
