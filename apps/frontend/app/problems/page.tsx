import Button from "@repo/ui/button";
import Badge from "@repo/ui/badge";
import Layout from "../../components/Layout";
import Link from "next/link";
import axios from "axios";

const links = [{ href: "/", label: "Home" }];
const PROBLEM_SERVICE_URL = process.env.NEXT_PUBLIC_PROBLEM_SERVICE_URL;

type Problem = {
  title: string;
  difficulty: string;
  tags: string[];
  _id: string | number;
};

const defaultProblems: Problem[] = [
  { title: "Two Sum", difficulty: "Easy", tags: ["Array", "Hash Table"], _id: 0 },
  { title: "Add Two Numbers", difficulty: "Medium", tags: ["Linked List", "Math"], _id: 1 },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["String", "Sliding Window"],
    _id: 2,
  },
  {
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["Array", "Binary Search"],
    _id: 3,
  },
  {
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    tags: ["String", "Dynamic Programming"],
    _id: 4,
  },
  { title: "Valid Parentheses", difficulty: "Easy", tags: ["String", "Stack"], _id: 5 },
];

// Define the structure of the object *resolved* by the searchParams Promise
interface ProblemsPageResolvedSearchParams {
  page?: string; // Assuming page is always a single string if present
  tags?: string | string[]; // Tags could be single string or array from URL
}

// Define the props where searchParams is a Promise wrapping the resolved type
interface ProblemsPageProps {
  // Assuming params might also be needed/passed by Next.js, even if empty
  // params: Promise<{}>; // Or specific type if you have route params
  searchParams: Promise<ProblemsPageResolvedSearchParams>;
}


async function fetchProblems({
  page = 1,
  tags = [],
}: {
  page?: number;
  tags?: string[];
}) {
  try {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (tags.length) params.set("tags", tags.join(","));

    if (!PROBLEM_SERVICE_URL) {
        console.error("PROBLEM_SERVICE_URL is not defined.");
        throw new Error("Problem service URL is missing.");
    }

    const response = await axios.get(`${PROBLEM_SERVICE_URL}/problems?${params}`);

    if (response.data && typeof response.data === 'object' && response.data.data) {
         return {
            problems: response.data.data.problems || [],
            totalPages: response.data.data.totalPages || 0,
            currentPage: response.data.data.currentPage || 1,
         };
    } else {
        console.error("Unexpected response structure from fetchProblems:", response.data);
        throw new Error("Invalid data structure received.");
    }

  } catch (error) {
    console.error("Failed to fetch problems:", error);
    return {
      problems: defaultProblems,
      totalPages: 1,
      currentPage: 1,
    };
  }
}

let tagListCache: string[] | null = null; // Basic cache for tags

async function fetchTags(): Promise<string[]> {
    if (tagListCache) {
        return tagListCache;
    }
     try {
      if (PROBLEM_SERVICE_URL) {
          const res = await axios.get(`${PROBLEM_SERVICE_URL}/problems/tags`);
          if (res.data && Array.isArray(res.data.data)) {
            tagListCache = res.data.data; // Cache the result
            if(tagListCache == null) return [];
            return tagListCache;
          } else {
             console.error("Unexpected response structure from fetch tags:", res.data);
             return []; // Return empty on unexpected structure
          }
      } else {
          console.error("PROBLEM_SERVICE_URL is not defined for fetching tags.");
          return []; // Return empty if URL missing
      }
  } catch (error) {
      console.error("Failed to fetch tags:", error);
      return []; // Return empty on error
  }
}


// Apply the Promise<searchParams> props type
export default async function ProblemsPage({ searchParams }: ProblemsPageProps) {

  // --- Await the searchParams Promise first ---
  const resolvedSearchParams = await searchParams;
  // --- Use the resolved object from here on ---

  const page = parseInt(resolvedSearchParams.page || "1", 10);

  const tagsParam = resolvedSearchParams.tags;
  const tags = tagsParam
    ? (Array.isArray(tagsParam) ? tagsParam : tagsParam.split(',')).filter(Boolean)
    : [];

  // Fetch problems and tags concurrently
  const [
      { problems = [], totalPages = 0, currentPage = 1 },
      tagList = []
    ] = await Promise.all([
        fetchProblems({ page, tags }),
        fetchTags() // Fetch tags using the separate function
    ]);


  return (
    <Layout links={links}>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-4xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Coding Problems</h1>
            <Link href={"/admin"}>
              <Button variant="primary">Add Problem</Button>
            </Link>
          </div>

          {/* Tags filter */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {tagList.map((tag) => {
              const isActive = tags.includes(tag);
              const newTags = isActive
                ? tags.filter((t) => t !== tag)
                : [...tags, tag];
              const href = `?page=1&tags=${newTags.join(",")}`;

              return (
                <Link href={href} key={tag}>
                  <Badge
                    className={`cursor-pointer transition ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {tag}
                  </Badge>
                </Link>
              );
            })}
            {tags.length > 0 && (
              <Link href="?page=1">
                <Badge className="bg-red-200 text-red-800 cursor-pointer hover:bg-red-300">
                  Clear Filters
                </Badge>
              </Link>
            )}
          </div>

          {/* Problems Table */}
          {Array.isArray(problems) && problems.length > 0 ? (
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
                  {problems.map((problem: Problem, index: number) => (
                    <tr
                      key={problem._id || index}
                      className="border-t hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition"
                    >
                      <td className="p-3 text-blue-600 font-medium hover:underline">
                        <Link href={`/problems/${problem._id}`}>{problem.title}</Link>
                      </td>
                      <td className="p-3">
                        <Badge
                          className={
                            problem.difficulty.toLowerCase() === "easy"
                              ? "bg-green-200 text-green-800"
                              : problem.difficulty.toLowerCase() === "medium"
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-red-200 text-red-800"
                          }
                        >
                          {problem.difficulty}
                        </Badge>
                      </td>
                      <td className="p-3 flex flex-wrap gap-2">
                        {Array.isArray(problem.tags) && problem.tags.map((tag: string, i: number) => (
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
           ) : (
             <p className="text-center text-gray-500 dark:text-gray-400 mt-4">No problems found or failed to load.</p>
           )}

          {/* Pagination */}
          { totalPages > 0 && (
            <div className="flex justify-center items-center gap-4 mt-6">
                {currentPage > 1 && (
                <Link href={`?page=${currentPage - 1}&tags=${tags.join(",")}`}>
                    <Button variant="secondary">Previous</Button>
                </Link>
                )}
                <span>
                Page {currentPage} of {totalPages}
                </span>
                {currentPage < totalPages && (
                <Link href={`?page=${currentPage + 1}&tags=${tags.join(",")}`}>
                    <Button variant="secondary">Next</Button>
                </Link>
                )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}