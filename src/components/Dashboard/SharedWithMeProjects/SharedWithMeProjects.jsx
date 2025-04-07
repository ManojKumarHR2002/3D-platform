
import { useState, useEffect } from "react";
import sharedProjectsService from "../../../services/SharedWithMeProjects"; // Adjust path if necessary

export default function SharedWithMeProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await sharedProjectsService.getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch shared projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <section aria-labelledby="shared-projects-heading">
      <h2
        id="shared-projects-heading"
        className="mt-9 text-base font-bold text-white max-md:mt-10"
      >
        Shared With Me
      </h2>
      {loading ? (
        <p className="text-white mt-4">Loading shared projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-white mt-4">No shared projects available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-9 mt-7 sm:grid-cols-3 lg:grid-cols-5 max-h-[80vh] overflow-y-auto scrollbar-hide">
          {projects.map((project) => (
            <button
              key={project.id}
              className="flex flex-col px-2 py-3 rounded-xl border-2 border-solid bg-zinc-900 border-zinc-700 w-[280px] hover:bg-opacity-50 focus:ring-2 focus:ring-blue-500"
              role="menuitem"
              onClick={() => alert(`Selected Shared Project: ${project.title}`)}
            >
              <img
                loading="lazy"
                src={project.imgSrc}
                alt={`${project.title} Project`}
                className="object-contain w-full rounded-xl aspect-[1.7] shadow-lg"
              />
              <div className="flex flex-col self-start mt-3 ml-3">
                <h3 className="text-base font-semibold text-white">{project.title}</h3>
                <p className="text-sm text-gray-400">{project.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
