import TestimonialContainer from "./TestimonialContainer";

const getTestimonials = async () => {
  // Replace with an API call later
  return [
    {
      quote:
        "This platform completely changed the way I approach coding interviews. The structured approach and real-world problems made all the difference!",
      name: "Emily Johnson",
    },
    {
      quote:
        "A game-changer for learning system design. The interactive lessons and hands-on coding helped me tremendously.",
      name: "Daniel Martinez",
    },
    {
      quote:
        "Absolutely love the UI and the experience. The challenges were spot on, and the explanations helped me understand better.",
      name: "Michael Chen",
    },
    {
      quote:
        "I landed my dream job at a top tech company thanks to the well-structured coding practice!",
      name: "Sophia Williams",
    },
    {
      quote:
        "The best platform for honing problem-solving skills. Highly recommended for all aspiring developers.",
      name: "James Anderson",
    },
    {
      quote:
        "The real-world challenges made me more confident in system design interviews.",
      name: "Olivia Brown",
    },
    {
      quote:
        "I've tried many platforms, but this one stands out with its high-quality content and smooth experience.",
      name: "William Davis",
    },
    {
      quote:
        "The perfect place to sharpen your coding skills with an engaging and interactive experience!",
      name: "Ava Wilson",
    },
    {
      quote:
        "The UI is so intuitive! I love solving problems here every day.",
      name: "Ethan Thomas",
    },
  ];
};

export default async function Testimonial() {
  const testimonials = await getTestimonials(); // Fetch testimonials

  return <TestimonialContainer testimonials={testimonials} />;
}
