import { Bolt, Code, Users, Star, BarChart, BookOpen } from "lucide-react";
import Card from "@repo/ui/card";

const features = [
  {
    icon: <Code size={24} />,
    title: "3000+ Coding Problems",
    description: "A vast library of challenges sorted by difficulty and topics to help you grow systematically."
  },
  {
    icon: <Users size={24} />,
    title: "Active Community",
    description: "Connect with peers, discuss solutions, and learn from the best programmers worldwide."
  },
  {
    icon: <Bolt size={24} />,
    title: "Live Contests",
    description: "Weekly coding competitions to test your skills against peers and win exciting prizes."
  },
  {
    icon: <Star size={24} />,
    title: "Premium IDE",
    description: "Code directly in your browser with our feature-rich editor supporting 20+ languages."
  },
  {
    icon: <BarChart size={24} />,
    title: "Skill Assessment",
    description: "Track your progress with detailed performance analytics and skill ratings."
  },
  {
    icon: <BookOpen size={24} />,
    title: "Interview Preparation",
    description: "Curated problem sets designed specifically for technical interviews at top companies."
  }
];

export default function FeaturesSection() {
  return (
    <section id = "features" className="py-16 bg-gray-200 dark:bg-gray-800 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-800 text-indigo-600 dark:text-white text-sm font-semibold">
          Features
        </div>
        <h2 className="text-3xl font-bold mt-4 text-gray-900 dark:text-white">
          Everything you need to excel at coding
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mt-3">
          Our platform provides the tools, problems, and community to take your coding skills to the next level,
          whether you're a beginner or experienced developer.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-10">
        {features.map((feature, index) => (
          <Card key={index} className="text-left flex gap-4 items-start bg-white dark:bg-gray-900 shadow-md rounded-lg">
            <div className="text-indigo-600 bg-indigo-100 dark:bg-indigo-700 p-2 rounded-xl">
              {feature.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 mt-1">{feature.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
