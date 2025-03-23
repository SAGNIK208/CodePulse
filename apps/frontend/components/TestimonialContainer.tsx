"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Testimonial = {
  quote: string;
  name: string;
};

type Props = {
  testimonials: Testimonial[];
};

export default function TestimonialContainer({ testimonials }: Props) {
  const [index, setIndex] = useState(0);
  const itemsPerPage = 3;

  if (!testimonials || testimonials.length === 0) {
    return <p className="text-center text-gray-500">No testimonials available.</p>;
  }

  const prevTestimonial = () => {
    setIndex((prev) =>
      prev - itemsPerPage < 0 ? Math.max(0, testimonials.length - itemsPerPage) : prev - itemsPerPage
    );
  };

  const nextTestimonial = () => {
    setIndex((prev) =>
      prev + itemsPerPage >= testimonials.length ? 0 : prev + itemsPerPage
    );
  };

  return (
    <section id="testimonials" className="py-20 px-6 bg-gray-100">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-800 text-indigo-600 dark:text-white text-sm font-semibold">
          Testimonials
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mt-4">What Our Users Say</h2>
      </div>

      <div className="relative max-w-5xl mx-auto mt-10 flex items-center">
        <button
          onClick={prevTestimonial}
          className="p-2 rounded-full transition-all duration-300 hover:bg-blue-100 hover:shadow-lg hover:scale-110"
        >
          <ChevronLeft size={30} className="text-gray-700" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
          {testimonials.slice(index, index + itemsPerPage).map((testimonial, idx) => (
            <div key={idx} className="p-6 bg-white shadow-lg rounded-xl text-center">
              <p className="text-lg text-gray-800 leading-relaxed">"{testimonial.quote}"</p>
              <p className="mt-4 font-semibold text-gray-700">- {testimonial.name}</p>
            </div>
          ))}
        </div>

        <button
          onClick={nextTestimonial}
          className="p-2 rounded-full transition-all duration-300 hover:bg-blue-100 hover:shadow-lg hover:scale-110"
        >
          <ChevronRight size={30} className="text-gray-700" />
        </button>
      </div>
    </section>
  );
}
