import React, { InputHTMLAttributes } from 'react';
import { cn } from "@repo/lib/utils" // You might have a utility for combining class names

interface InputProps extends InputHTMLAttributes<HTMLInputElement> { }

const Input: React.FC<InputProps> = ({ className, ...props }) => {
    return (
        <input
            className={cn(
                "w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800",
                "text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
                className
            )}
            {...props}
        />
    );
};

export default Input;
