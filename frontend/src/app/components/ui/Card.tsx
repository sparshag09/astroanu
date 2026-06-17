import { motion } from 'motion/react';
import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 12px 24px rgba(122, 91, 70, 0.15)' } : {}}
      transition={{ duration: 0.3 }}
      className={`bg-[#FFFBF5] rounded-xl p-6 shadow-md border border-[#EFE6D6] ${className}`}
    >
      {children}
    </motion.div>
  );
}
