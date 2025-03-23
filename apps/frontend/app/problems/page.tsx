import Button from "@repo/ui/button";
import Badge from "@repo/ui/badge";
import Layout from "../../components/Layout";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
];


const problems = [
  { title: "Two Sum", difficulty: "Easy", tags: ["Array", "Hash Table"],id: 0 },
  {
    title: "Add Two Numbers",
    difficulty: "Medium",
    tags: ["Linked List", "Math"],
    id: 1
  },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["String", "Sliding Window"],
    id: 2
  },
  {
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["Array", "Binary Search"],
    id: 3
  },
  {
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    tags: ["String", "Dynamic Programming"],
    id: 4
  },
  { title: "Valid Parentheses", difficulty: "Easy", tags: ["String", "Stack"],id:5 },
];

export default function ProblemsPage() {
    return (
      <Layout links={links}>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-full max-w-4xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Coding Problems</h1>
              <Link href={"/admin"}><Button variant="primary">Add Problem</Button></Link>
            </div>
            <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Difficulty</th>
                    <th className="p-3 text-left">Tags</th>
                  </tr>
                </thead>
                <tbody>
                  {problems.map((problem, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-3 text-blue-600 font-medium hover:underline cursor-pointer">
                       <Link href={`/problems/${problem.id}`}>{problem.title}</Link> 
                      </td>
                      <td className="p-3">
                        <Badge
                          className={
                            problem.difficulty === "Easy"
                              ? "bg-green-200 text-green-800"
                              : problem.difficulty === "Medium"
                                ? "bg-yellow-200 text-yellow-800"
                                : "bg-red-200 text-red-800"
                          }
                        >
                          {problem.difficulty}
                        </Badge>
                      </td>
                      <td className="p-3 flex flex-wrap gap-2">
                        {problem.tags.map((tag, i) => (
                          <Badge
                            key={i}
                            className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  