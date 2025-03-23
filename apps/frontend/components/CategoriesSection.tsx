export default function CategoriesSection() {
  const categories = [
    { name: "Arrays & Strings", icon: "🔢", difficulty: "Mixed", color: "bg-purple-200 text-purple-700" },
    { name: "Linked Lists", icon: "🔗", difficulty: "Medium", color: "bg-yellow-200 text-yellow-700" },
    { name: "Trees & Graphs", icon: "🌳", difficulty: "Hard", color: "bg-red-200 text-red-700" },
    { name: "Dynamic Programming", icon: "📊", difficulty: "Hard", color: "bg-red-200 text-red-700" },
    { name: "Sorting & Searching", icon: "🔍", difficulty: "Medium", color: "bg-yellow-200 text-yellow-700" },
    { name: "Greedy Algorithms", icon: "🤔", difficulty: "Medium", color: "bg-yellow-200 text-yellow-700" },
    { name: "Backtracking", icon: "🔙", difficulty: "Hard", color: "bg-red-200 text-red-700" },
    { name: "Math & Logic", icon: "🔢", difficulty: "Easy", color: "bg-green-200 text-green-700" },
  ];

  return (
    <section id="categories" className="py-20 px-6 text-center">
      {/* Rounded Header */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-800 text-indigo-600 dark:text-white text-sm font-semibold">
        Categories
      </div>

      <h2 className="text-3xl font-bold mt-4">Master key coding concepts</h2>
      <p className="text-gray-600 mt-2">
        Our problems are organized into categories to help you focus on specific areas and build your skills methodically.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8 max-w-6xl mx-auto">
        {categories.map((category) => (
          <div key={category.name} className="p-4 bg-white shadow-md rounded-lg text-left text-sm">
            <span className="text-2xl">{category.icon}</span>
            <h4 className="text-base font-semibold mt-2">{category.name}</h4>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${category.color}`}>
              {category.difficulty}
            </span>
            <a href="#" className="text-blue-600 mt-2 block font-medium">
              Explore →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
