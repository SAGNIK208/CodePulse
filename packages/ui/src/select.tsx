import React, { useState, ReactNode, SelectHTMLAttributes, HTMLAttributes } from 'react';
import { cn } from "@repo/lib/utils"

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    children: ReactNode;
}

const Select: React.FC<SelectProps> = ({ className, children, ...props }) => {
    const [value, setValue] = useState<string | undefined>();
    const triggerProps = {
        className: cn(
            "w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800",
            "text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
            className
        ),
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
            const newValue = e.target.value;
            setValue(newValue);
            if (props.onChange) {
                props.onChange(e); // Pass the event
            }
        },
        value: props.value ?? value,
    };


    return (
        <div className="relative">
            <select {...triggerProps}>
                {children}
            </select>
        </div>
    );
};

interface SelectTriggerProps extends SelectHTMLAttributes<HTMLSelectElement> {
    children?: ReactNode;
}
const SelectTrigger: React.FC<SelectTriggerProps> = ({ className, children, ...props }) => {
      const combinedClassName = cn(
            "w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800",
            "text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
            className
        );

    return (
        <div className="relative">
            <select {...props} className={combinedClassName}>
                {children}
            </select>
             {/* Add a default arrow, since we are mimicking the look. */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-700 dark:text-gray-300">
                {/* You can replace this with a more styled icon if you have one */}
                ▼
            </div>
        </div>
    );
};

const SelectValue: React.FC<{ children?: ReactNode }> = ({ children }) => {
    return <>{children}</>;
};

const SelectContent: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
            {children}
        </div>
    );
};

const SelectItem: React.FC<{ value: string; children: ReactNode }> = ({ value, children }) => {
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.currentTarget; // Use currentTarget
        const selectElement = target.closest('select');
        if (selectElement) {
            selectElement.value = value;
            const changeEvent = new Event('change', { bubbles: true });
            selectElement.dispatchEvent(changeEvent);
        }
    };

    return (
        <div
            role="option"
            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-md transition-colors duration-200"
            onClick={handleClick}

        >
            {children}
        </div>
    );
};

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };

