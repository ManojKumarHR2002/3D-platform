import * as React from "react";

// Card Component
function FeatureCard({ image, title, description }) {
  return (
    <div className="p-6 bg-zinc-800 rounded-lg shadow-md text-center flex flex-col items-center">
      <img
        src={image}
        alt={title}
        className="mb-4 w-24 h-24 object-cover rounded-full"
      />
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}

// Features Section
export function FeaturesSection() {
  // Feature Data
  const features = [
    {
      image: "https://via.placeholder.com/150",
      title: "Feature 1",
      description: "This is a brief description of feature 1.",
    },
    {
      image: "https://via.placeholder.com/150",
      title: "Feature 2",
      description: "This is a brief description of feature 2.",
    },
    {
      image: "https://via.placeholder.com/150",
      title: "Feature 3",
      description: "This is a brief description of feature 3.",
    },
    {
      image: "https://via.placeholder.com/150",
      title: "Feature 4",
      description: "This is a brief description of feature 4.",
    },
    {
      image: "https://via.placeholder.com/150",
      title: "Feature 5",
      description: "This is a brief description of feature 5.",
    },
    {
      image: "https://via.placeholder.com/150",
      title: "Feature 6",
      description: "This is a brief description of feature 6.",
    },
    {
      image: "https://via.placeholder.com/150",
      title: "Feature 7",
      description: "This is a brief description of feature 7.",
    },
    {
      image: "https://via.placeholder.com/150",
      title: "Feature 8",
      description: "This is a brief description of feature 8.",
    },
    {
      image: "https://via.placeholder.com/150",
      title: "Feature 9",
      description: "This is a brief description of feature 9.",
    },
    // Add more features as needed
  ];

  return (
    <div className="px-16 py-10 mt-36 w-full text-white rounded-xl bg-zinc-900 bg-opacity-100 max-w-[1183px] shadow-[1px_1px_2px_rgba(0,0,0,0.1)] max-md:px-5 max-md:mt-10 max-md:max-w-full">
      <div className="mb-8 text-center text-3xl font-bold">Best Features</div>
      <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            image={feature.image}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
}
