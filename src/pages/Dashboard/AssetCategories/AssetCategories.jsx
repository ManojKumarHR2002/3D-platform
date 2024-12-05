import * as React from "react";

export default function AssetCategories() {
  return (
    <section aria-labelledby="categories-heading">
      <div className="flex flex-wrap gap-5 justify-between self-stretch mt-16 w-full text-white max-md:mt-10 max-md:max-w-full">
        <h2 id="categories-heading" className="my-auto text-base font-bold">
          Asset Categories
        </h2>
        <button 
          className="flex gap-2 px-3 py-2.5 text-sm font-medium rounded-xl bg-zinc-700 shadow-[0px_2px_4px_rgba(0,0,0,0.12)]"
          aria-label="View all asset categories"
        >
          <span>View All</span>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/914c32b535a5313cac2fe9625bb24cfab938073acf5f2e43908f34e992d64fee?apiKey=aefa27f3a4d84b2fb61917384a45b85c&"
            alt=""
            className="object-contain shrink-0 self-start mt-1 w-1.5 aspect-[0.67]"
          />
        </button>
      </div>
      <article className="flex flex-col px-px pt-px pb-4 mt-5 max-w-full text-base font-semibold whitespace-nowrap rounded-xl border-2 border-solid bg-zinc-900 bg-opacity-10 border-zinc-700 text-white text-opacity-80 w-[232px]">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/7b73db5ddbf1fa27f2e3b310a9af9f8bd808bf01088872fc1587593f1429937e?apiKey=aefa27f3a4d84b2fb61917384a45b85c&"
          alt="Cafe Category"
          className="object-contain w-full rounded-xl aspect-[1.7]"
        />
        <h3 className="self-start mt-3 ml-3 max-md:ml-2.5">Cafe</h3>
      </article>
    </section>
  );
}