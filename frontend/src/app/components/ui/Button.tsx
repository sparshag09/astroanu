import { motion } from 'motion/react';
import { type ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
  className = ''
}: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[#6E1F2A] text-[#FFFBF5] hover:bg-[#8B2838] shadow-md hover:shadow-lg",
    secondary: "bg-[#C89B3C] text-[#3D2F28] hover:bg-[#D4A84D] shadow-md hover:shadow-lg",
    outline: "border-2 border-[#7A5B46] text-[#7A5B46] hover:bg-[#7A5B46] hover:text-[#FFFBF5]"
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}
