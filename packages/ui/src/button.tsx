// components/base/Button.tsx
'use client';
import { motion, HTMLMotionProps } from 'framer-motion';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
} & HTMLMotionProps<'button'>; // ✅ Use HTMLMotionProps to fix type issue

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseStyles = 'px-6 py-3 font-medium rounded-lg shadow-md transition';
  const variants = {
    primary: 'bg-[#0EA5E9] text-white hover:bg-[#0284C7]',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      className={`${baseStyles} ${variants[variant]}`}
      {...props} // ✅ Fix: Props now correctly extend Framer Motion's button props
    >
      {children}
    </motion.button>
  );
};

export default Button;
