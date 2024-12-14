import React from "react";

export default function ObjectsCard() {
  return (
    <div className="p-4 bg-zinc-800 rounded-lg">
      <div className="flex gap-5 justify-between">
        <div className="flex gap-2">
          <div>Scene 1</div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/6c6df1dbc5f96b387b979a0bdc6231f6da9bd81497f448e9cb103d1ac2d6bdce?apiKey=aefa27f3a4d84b2fb61917384a45b85c&"
            className="object-contain shrink-0 my-auto w-1.5 aspect-[0.67]"
            alt="Scene indicator"
          />
        </div>
        <button
          aria-label="Scene options"
          className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg"
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/364c46597119570f620ea40d2c71b0c4853b10d551264e876cde24ab4c33c023?apiKey=aefa27f3a4d84b2fb61917384a45b85c&"
            className="object-contain shrink-0 my-auto aspect-square w-[13px]"
            alt=""
          />
        </button>
      </div>
    </div>
  );
}
