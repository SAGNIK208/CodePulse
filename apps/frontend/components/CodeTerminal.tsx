"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const codeSnippet = `
function twoSum(nums, target) {
    let map = new Map();

    for (let i = 0; i < nums.length; i++) {
        let complement = target - nums[i];

        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}

// Example Usage
const nums = [2, 7, 11, 15];
const target = 9;
console.log(twoSum(nums, target)); // Output: [0, 1] 🎯
`.split("\n");

export default function CodeTerminal() {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const maxVisibleLines = 10; // Max number of visible lines in the terminal

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < codeSnippet.length) {
        setVisibleLines((prev): string[] => {
          const newLines = [...prev, codeSnippet[index]].filter(Boolean) as string[];
          return newLines.length > maxVisibleLines ? newLines.slice(1) : newLines;
        });
        index++;
      } else {
        // Restart animation after a delay
        setTimeout(() => {
          setVisibleLines([]); // Clear terminal
          index = 0; // Restart from beginning
        }, 2000); // 2-second pause before restart
      }
    }, 1000); // 1 line per second

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto rounded-lg shadow-lg bg-[#0d1117] text-white font-mono text-sm overflow-hidden">
      {/* Terminal Header */}
      <div className="bg-[#161b22] flex items-center justify-between px-4 py-2">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-gray-400 text-xs">JavaScript</span>
      </div>

      {/* Code Display (Auto-Scrolling Effect) */}
      <div className="p-4 h-[240px] overflow-hidden">
        {visibleLines.map((line, index) => (
          <motion.pre
            key={index} // Keeps animations consistent
            className="text-left text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8 }}
          >
            {line}
          </motion.pre>
        ))}
      </div>
    </div>
  );
}
