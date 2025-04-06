import React from "react";
import CodeTerminal from "./CodeTerminal";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center items-center text-center bg-gray-100 text-gray-900 px-6">
      <h1 className="text-6xl font-extrabold text-blue-600">
        Master Coding with <span className="text-gray-900">Daily Practice</span>
      </h1>

      <p className="mt-4 text-lg text-gray-700 max-w-2xl">
        Learn, practice, and improve your problem-solving skills with real-world coding challenges.
      </p>

      <div className="mt-8">
        <Link href={"/problems"}>
        <div
          className="px-6 py-3 text-lg font-semibold bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
        >
          Start Coding 🚀
        </div>
        </Link>
      </div>

      {/* Code Typing Animation */}
      <div className="mt-10 w-full flex justify-center">
        <CodeTerminal />
      </div>
    </section>
  );
};

export default HeroSection;
