import { motion } from 'motion/react';

export function OmSymbol({ className = '', size = 60 }: { className?: string; size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
    >
      <text
        x="50"
        y="70"
        fontSize="70"
        textAnchor="middle"
        fill="#C89B3C"
        fontFamily="serif"
      >
        ॐ
      </text>
    </motion.svg>
  );
}
