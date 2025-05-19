import React, { useState } from "react";

export default function AnimationPanel({ animations, mixer, actions }) {
  const [playingIndex, setPlayingIndex] = useState(null);

  const handlePlay = (idx) => {
    actions.forEach((action, i) => {
      if (i === idx) {
        action.reset().play();
        setPlayingIndex(idx);
      } else {
        action.stop();
      }
    });
    if (mixer) mixer.time = 0;
  };

  const handleStop = () => {
    actions.forEach(action => action.stop());
    setPlayingIndex(null);
  };

  return (
    <div className="fixed top-20 right-8 z-50 p-4 bg-zinc-900 bg-opacity-95 rounded-xl shadow-2xl w-80 border border-zinc-700">
      <h3 className="text-lg font-bold mb-4 text-white">Animations</h3>
      {(!animations || animations.length === 0) && <div className="text-gray-400">No animations found.</div>}
      <ul className="space-y-2">
        {animations && animations.map((clip, idx) => (
          <li key={clip.name + idx} className="flex items-center justify-between bg-zinc-800 rounded-lg px-3 py-2">
            <div>
              <span className="font-semibold text-white">{clip.name || `Animation ${idx+1}`}</span>
              <span className="ml-2 text-xs text-gray-400">
                ({clip.duration.toFixed(2)}s)
              </span>
            </div>
            {playingIndex === idx ? (
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={handleStop}
              >Stop</button>
            ) : (
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded"
                onClick={() => handlePlay(idx)}
              >Play</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
