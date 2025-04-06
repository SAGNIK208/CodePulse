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
  // ... (default problems remain the same)
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

// --- Interfaces (remain the same) ---
interface ProblemsPageResolvedSearchParams {
  page?: string;
  tags?: string | string[];
  difficulty?: string;
  sort?: string;
}

interface ProblemsPageProps {
  searchParams: Promise<ProblemsPageResolvedSearchParams>;
}

// --- Data Fetching Functions (remain the same) ---
async function fetchProblems({
  page = 1,
  tags = [],
  difficulty = "",
  sort = "",
}: {
  page?: number;
  tags?: string[];
  difficulty?: string;
  sort?: string;
}) {
  try {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (tags.length) params.set("tags", tags.join(","));
    if (difficulty) params.set("difficulty", difficulty);
    if (sort) params.set("sort", sort);

    if (!PROBLEM_SERVICE_URL) {
      throw new Error("PROBLEM_SERVICE_URL is not defined.");
    }
    const response = await axios.get(`${PROBLEM_SERVICE_URL}/problems?${params}`);
    if (response.data?.data) {
      return {
        problems: response.data.data.problems || [],
        totalPages: response.data.data.totalPages || 0,
        currentPage: response.data.data.currentPage || 1,
      };
    } else { throw new Error("Invalid data structure received."); }
  } catch (error) {
    console.error("Failed to fetch problems:", error);
    return { problems: defaultProblems, totalPages: 1, currentPage: 1 };
  }
}

let tagListCache: string[] | null = null;
async function fetchTags(): Promise<string[]> {
  // This logic can be simplified/improved based on caching needs
  if (tagListCache && tagListCache.length > 0) return tagListCache;
  try {
    if (!PROBLEM_SERVICE_URL) throw new Error("Missing PROBLEM_SERVICE_URL");
    const res = await axios.get(`${PROBLEM_SERVICE_URL}/problems/tags`);
    if (Array.isArray(res.data?.data)) {
      tagListCache = res.data.data;
      if(tagListCache == null) return [];
      return tagListCache;
    } return [];
  } catch (error) { console.error("Failed to fetch tags:", error); return []; }
}

// --- Main Server Component ---
export default async function ProblemsPage({ searchParams }: ProblemsPageProps) {
  const resolved = await searchParams;
  const currentDifficulty = resolved.difficulty || "";
  const currentSort = resolved.sort || "";
  const currentPageNum = parseInt(resolved.page || "1", 10);

  const tagsParam = resolved.tags;
  const currentTags = tagsParam
    ? (Array.isArray(tagsParam) ? tagsParam : tagsParam.split(",")).filter(Boolean)
    : [];

  const [{ problems, totalPages, currentPage }, tagList] = await Promise.all([
    fetchProblems({ page: currentPageNum, tags: currentTags, difficulty: currentDifficulty, sort: currentSort }),
    fetchTags(),
  ]);

  // --- Helper to build query strings ---
  // Preserves existing filters when generating links for new ones
  const buildQueryString = (newParams: Record<string, string | string[] | number | undefined>) => {
    const currentQS = new URLSearchParams();
    // Start with current filters
    if (currentTags.length > 0) currentQS.set('tags', currentTags.join(','));
    if (currentDifficulty) currentQS.set('difficulty', currentDifficulty);
    if (currentSort) currentQS.set('sort', currentSort);

    // Apply new/updated params
    for (const key in newParams) {
        const value = newParams[key];
        if (value !== undefined && value !== null && value !== '') {
             // Special handling for arrays like tags if needed, otherwise join
             if (Array.isArray(value)) {
                 currentQS.set(key, value.join(','));
             } else {
                 currentQS.set(key, String(value));
             }
        } else {
            currentQS.delete(key); // Remove param if value is explicitly undefined/null/empty
        }
    }
    // Always reset page to 1 when filters/sort change, unless page is the specific param being set
    if (!('page' in newParams)) {
        currentQS.set('page', '1');
    } else if(newParams.page === undefined || newParams.page === null || newParams.page === '') {
         currentQS.set('page', '1'); // Ensure page is set if cleared
    }

    const qs = currentQS.toString();
    return qs ? `?${qs}` : ''; // Return empty string if no params
  };

  // --- Define Sort Options ---
  const sortOptions = [
    { label: "Default", value: "" }, // Value to clear sorting
    { label: "Difficulty ↑", value: "difficulty:easy-to-hard" },
    { label: "Difficulty ↓", value: "difficulty:hard-to-easy" },
    { label: "Title A-Z", value: "title:asc" },
    { label: "Title Z-A", value: "title:desc" },
    { label: "Newest", value: "createdAt:desc" },
    { label: "Oldest", value: "createdAt:asc" },
  ];

  return (
    <Layout links={links}>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-4xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Coding Problems</h1>
            <Link href="/admin">
              <Button variant="primary">Add Problem</Button>
            </Link>
          </div>

           {/* Tags Filter */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
             <span className="text-sm font-medium mr-2">Tags:</span>
             {tagList.map((tag) => {
              const isActive = currentTags.includes(tag);
              const newTags = isActive ? currentTags.filter((t) => t !== tag) : [...currentTags, tag];
              const href = buildQueryString({ tags: newTags.length > 0 ? newTags : undefined }); // Pass undefined to clear

              return (
                <Link key={tag} href={href}>
                  <Badge className={`cursor-pointer ${isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}`}>
                    {tag}
                  </Badge>
                </Link>
              );
            })}
            {currentTags.length > 0 && (
              <Link href={buildQueryString({ tags: undefined })}>
                <Badge className="bg-red-200 text-red-800 hover:bg-red-300 cursor-pointer text-xs">Clear Tags</Badge>
              </Link>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
            {/* Difficulty Filter */}
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-sm font-medium mr-2">Difficulty:</span>
              {["Easy", "Medium", "Hard"].map((level) => {
                const lowerLevel = level.toLowerCase();
                const isActive = currentDifficulty === lowerLevel;
                const href = buildQueryString({ difficulty: isActive ? undefined : lowerLevel });

                return (
                  <Link key={level} href={href}>
                    <Badge className={`cursor-pointer ${isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}`}>
                      {level}
                    </Badge>
                  </Link>
                );
              })}
              {currentDifficulty && (
                <Link href={buildQueryString({ difficulty: undefined })}>
                  <Badge className="bg-red-200 text-red-800 hover:bg-red-300 cursor-pointer text-xs">Clear</Badge>
                </Link>
              )}
            </div>

            {/* --- Sort Options as Links/Badges --- */}
            <div className="flex gap-2 flex-wrap items-center">
               <span className="text-sm font-medium mr-2">Sort By:</span>
               {sortOptions.map((option) => {
                  const isActive = currentSort === option.value;
                  // Pass undefined for the 'Default' option's value to clear sort param
                  const href = buildQueryString({ sort: option.value || undefined });

                  return (
                    <Link key={option.value} href={href}>
                       <Badge className={`cursor-pointer ${isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}`}>
                         {option.label}
                       </Badge>
                    </Link>
                  );
               })}
            </div>
             {/* --- End Sort Options --- */}

          </div>

          {/* Problems Table */}
           {problems.length > 0 ? (
             <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-hidden">
               <table className="w-full">
                 <thead className="bg-gray-100 dark:bg-gray-800">
                   <tr>
                     <th className="p-3 text-left">Title</th>
                     <th className="p-3 text-left">Difficulty</th>
                     <th className="p-3 text-left">Tags</th>
                   </tr>
                 </thead>
                 <tbody>
                   {problems.map((problem:Problem) => (
                     <tr key={problem._id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800">
                       <td className="p-3 text-blue-600 hover:underline">
                         <Link href={`/problems/${problem._id}`}>{problem.title}</Link>
                       </td>
                       <td className="p-3">
                         <Badge className={ /* ... difficulty badge class ... */
                           problem.difficulty.toLowerCase() === "easy"
                             ? "bg-green-200 text-green-800"
                             : problem.difficulty.toLowerCase() === "medium"
                             ? "bg-yellow-200 text-yellow-800"
                             : "bg-red-200 text-red-800"
                         }>
                           {problem.difficulty}
                         </Badge>
                       </td>
                       <td className="p-3 flex flex-wrap gap-2">
                         {Array.isArray(problem.tags) && problem.tags.map((tag, i) => (
                           <Badge key={i} className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
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
             <p className="text-center text-gray-500 dark:text-gray-400 mt-4">No problems found matching your criteria.</p>
           )}


          {/* Pagination */}
           {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              {currentPage > 1 && (
                <Link href={buildQueryString({ page: currentPage - 1 })}>
                  <Button variant="secondary">Previous</Button>
                </Link>
              )}
              <span>Page {currentPage} of {totalPages}</span>
              {currentPage < totalPages && (
                <Link href={buildQueryString({ page: currentPage + 1 })}>
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