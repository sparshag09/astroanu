import { motion } from 'motion/react';

export function ConstellationLines({ className = '' }: { className?: string }) {
  return (
    <svg
      width="300"
      height="300"
      viewBox="0 0 300 300"
      className={className}
      style={{ position: 'absolute', pointerEvents: 'none' }}
    >
      <g stroke="#C89B3C" strokeWidth="1" opacity="0.15" fill="none">
        <motion.line
          x1="50" y1="50" x2="120" y2="80"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.2 }}
        />
        <motion.line
          x1="120" y1="80" x2="180" y2="60"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.4 }}
        />
        <motion.line
          x1="180" y1="60" x2="220" y2="120"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.6 }}
        />
        <motion.line
          x1="220" y1="120" x2="180" y2="180"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.8 }}
        />
        <motion.line
          x1="180" y1="180" x2="100" y2="200"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1 }}
        />
      </g>
      <g fill="#C89B3C" opacity="0.3">
        <circle cx="50" cy="50" r="3" />
        <circle cx="120" cy="80" r="3" />
        <circle cx="180" cy="60" r="3" />
        <circle cx="220" cy="120" r="3" />
        <circle cx="180" cy="180" r="3" />
        <circle cx="100" cy="200" r="3" />
      </g>
    </svg>
  );
}
