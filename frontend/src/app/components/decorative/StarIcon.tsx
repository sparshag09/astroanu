import { motion } from 'motion/react';

export function StarIcon({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      width="40"
      height="40"
      viewBox="0 0 100 100"
      className={className}
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      <path
        d="M50 10 L55 45 L90 50 L55 55 L50 90 L45 55 L10 50 L45 45 Z"
        fill="#6E1F2A"
        opacity="0.4"
      />
    </motion.svg>
  );
}
