import * as React from "react";

export default function MyProjects() {
  return (
    <section aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="mt-24 text-base font-bold text-white max-md:mt-10">
        My Projects
      </h2>
      <article className="flex flex-col px-px pt-px pb-5 mt-7 max-w-full rounded-xl border-2 border-solid bg-zinc-900 bg-opacity-10 border-zinc-700 w-[232px]">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/d33578efcc50b7eaf81edfcd293c9087dd0c8be8c6ab8df5e821b171e1ebf186?apiKey=aefa27f3a4d84b2fb61917384a45b85c&"
          alt="Race Car Project"
          className="object-contain w-full rounded-xl aspect-[1.7] shadow-[0px_2px_4px_rgba(0,0,0,0.12)]"
        />
        <div className="flex flex-col self-start mt-3 ml-3 max-md:ml-2.5">
          <h3 className="self-start text-base font-semibold text-white text-opacity-80">
            Race Car
          </h3>
          <p className="text-sm text-white text-opacity-80">
            Edited 10 mins ago
          </p>
        </div>
      </article>
    </section>
  );
}