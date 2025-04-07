
import * as React from "react";
import { useState, useEffect } from "react";
import { getProjects, deleteProject } from "../../../services/MyProjects";

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProjects(getProjects());
    setLoading(false);
  }, []);

  const handleDelete = (projectId) => {
    deleteProject(projectId);
    setProjects((prevProjects) => prevProjects.filter((p) => p.id !== projectId));
  };

  return (
    <section aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="mt-9 text-base font-bold text-white">
        My Projects
      </h2>
      {loading ? (
        <p className="text-white mt-4">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-white mt-4">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-9 mt-7 sm:grid-cols-3 lg:grid-cols-5 max-h-[80vh] overflow-y-auto scrollbar-hide">
          {projects.map((project) => (
            <div key={project.id} className="relative">
              <button
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs"
                onClick={() => handleDelete(project.id)}
              >
                ✖
              </button>
              <button
                className="flex flex-col px-2 py-3 rounded-xl border-2 border-solid bg-zinc-900 border-zinc-700 w-[280px] hover:bg-opacity-50 focus:ring-2 focus:border-blue-500"
                role="menuitem"
                onClick={() => alert(`Selected Project: ${project.title}`)}
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
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
