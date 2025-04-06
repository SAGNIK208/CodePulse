'use client';
import { motion } from 'framer-motion';

type CardProps = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

const Card: React.FC<CardProps> = ({ title, description, children, className }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }} 
    className={`p-6 bg-white shadow-lg rounded-lg ${className}`}
  >
    {children ? (
      children
    ) : (
      <>
        <h4 className="text-xl font-semibold">{title}</h4>
        <p className="text-gray-600 mt-2">{description}</p>
      </>
    )}
  </motion.div>
);

export default Card;
