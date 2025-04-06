import React, { TextareaHTMLAttributes } from 'react';
import { cn } from "@repo/lib/utils"

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => {
    return (
        <textarea
            className={cn(
                "w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800",
                "text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
                className
            )}
            {...props}
        />
    );
};

export default Textarea;
