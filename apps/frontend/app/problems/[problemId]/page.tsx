"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Editor from "@monaco-editor/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ArrowLeft } from 'lucide-react';
import  Button  from "@repo/ui/button" // Assuming you have shadcn/ui
import Layout from "../../../components/Layout"; // Import your Layout component

const links = [
  { href: "/", label: "Home" },
  { href: "/problems", label: "Problems" }
];


interface Problem {
  id: string;
  title: string;
  description: string;
  editorial: string;
  starterCode: Record<string, string>;
}

const languages = ["JavaScript", "Java", "C++", "Python"] as const;
type Language = (typeof languages)[number];

const languageMap: Record<Language, string> = {
  JavaScript: "javascript",
  Java: "java",
  "C++": "cpp",
  Python: "python",
};

const ProblemPage = () => {
  const { problemId } = useParams();
  const router = useRouter();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [activeTab, setActiveTab] = useState<"Description" | "Editorial">("Description");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("JavaScript");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      // Replace with your actual API call here
      const dummyProblem: Problem = {
        id: problemId as string,
        title: "Two Sum",
        description: `### Two Sum Problem\n\nGiven an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\n**Example:**\n\`\`\`\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\n\`\`\``,
        editorial: `### Editorial Solution\n\n#### Optimal Approach:\n\`\`\`javascript\nfunction twoSum(nums, target) {\n  let map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    let complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n}\n\`\`\`\n`,
        starterCode: {
          JavaScript: `function twoSum(nums, target) {\n  // Write your code here\n};`,
          Java: `public int[] twoSum(int[] nums, int target) {\n    // Write your code here\n    return new int[0];\n}`,
          "C++": `vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n    return {};\n}`,
          Python: `def twoSum(nums, target):\n    # Write your code here\n    pass`,
        },
      };
      setProblem(dummyProblem);
      setCode(dummyProblem.starterCode[selectedLanguage] || "");
      setLoading(false);
    };
    fetchProblem();
  }, [problemId, selectedLanguage]);

  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode[selectedLanguage] || "");
    }
  }, [selectedLanguage, problem]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <span className="loading loading-spinner text-blue-500 loading-lg"></span>
      </div>
    );
  }

  return (
    <Layout links={links}>
      {/* Main Content Area - No Navbar Here */}
      <div className="p-4 md:p-6 lg:p-8 flex flex-col h-full">
        <div className="flex items-center mb-6 md:mb-8">
          <Button
            variant="primary"
            onClick={() => router.back()}
            className="mr-2 md:mr-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {problem?.title}
            <span className="ml-2 text-sm font-medium text-green-500">Easy</span>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 h-full">
          {/* Left Panel - Description/Editorial */}
          <div className="w-full md:w-1/2  bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {["Description", "Editorial"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as "Description" | "Editorial")}
                  className={`px-4 py-2 md:px-6 md:py-3 text-sm md:text-lg font-medium ${activeTab === tab
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 border-b border-gray-200 dark:border-gray-700" //Added border to button
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-4 md:p-6 prose dark:prose-invert mt-4 md:mt-6 border-l border-r border-gray-200 dark:border-gray-700">  {/* Added border to the description */}
              <ReactMarkdown>
                {activeTab === "Description" ? problem?.description || "" : problem?.editorial || ""}
              </ReactMarkdown>
            </div>
          </div>

          {/* Right Panel - Editor and Controls */}
          <div className="w-full md:w-1/2 flex flex-col">
            {/* Language Selection and Submit Button */}
            <div className="mb-4 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex items-center mb-2 sm:mb-0">
                <span className="text-sm md:text-md font-medium text-gray-700 dark:text-gray-300 mr-2 sm:mr-4">
                  Language:
                </span>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger className="px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 text-sm md:text-md">
                    {selectedLanguage}
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg min-w-[180px] md:min-w-[200px]">
                      {languages.map((lang) => (
                        <DropdownMenu.Item
                          key={lang}
                          onClick={() => setSelectedLanguage(lang)}
                          className="px-3 py-1.5 md:px-4 md:py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-md transition-colors duration-200 text-sm md:text-md"
                        >
                          {lang}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
              <div className="mt-4 sm:mt-0">
              <Button
                className="px-4 py-2 md:px-6 md:py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 text-sm md:text-lg font-medium"
              >
                Submit
              </Button>
              </div>
            </div>

            {/* Code Editor */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 flex-1 flex flex-col">
              <div className="mb-2 md:mb-4">
                <h2 className="text-md md:text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-1 md:pb-2">
                  Code Editor
                </h2>
              </div>
              <Editor
                height="calc(100vh - 350px)"
                defaultLanguage={languageMap[selectedLanguage]}
                theme="vs-light"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  selectOnLineNumbers: false,
                  readOnly: false,
                  scrollbar: { vertical: 'auto', horizontal: 'auto' },
                }}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProblemPage;
