import React, { useState, useEffect, useRef } from "react";

export default function AnimationPanel({ animations, mixer, actions }) {
  const [playingIndex, setPlayingIndex] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const rafRef = useRef();

  // Play the selected animation
  const handlePlay = (idx) => {
    actions.forEach((action, i) => {
      if (i === idx) {
        action.reset().play();
        setPlayingIndex(idx);
        setDuration(animations[idx].duration);
        setIsPlaying(true);
      } else {
        action.stop();
      }
    });
    if (mixer) mixer.time = 0;
    setCurrentTime(0);
  };

  // Pause the animation
  const handlePause = () => {
    if (playingIndex !== null) {
      actions[playingIndex].paused = true;
      setIsPlaying(false);
    }
  };

  // Resume animation
  const handleResume = () => {
    if (playingIndex !== null) {
      actions[playingIndex].paused = false;
      setIsPlaying(true);
    }
  };

  // Stop the animation
  const handleStop = () => {
    actions.forEach(action => action.stop());
    setPlayingIndex(null);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // Seek in the animation
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (playingIndex !== null) {
      actions[playingIndex].time = newTime;
      mixer.setTime(newTime);
    }
  };

  // Track current time while playing
  useEffect(() => {
    if (isPlaying && mixer && playingIndex !== null) {
      const tick = () => {
        setCurrentTime(mixer.time % duration);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafRef.current);
    }
  }, [isPlaying, mixer, playingIndex, duration]);

  // Reset when animation changes
  useEffect(() => {
    if (playingIndex === null) {
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
    }
  }, [playingIndex]);

  return (
    <div className="fixed top-20 right-8 z-50 p-4 bg-zinc-900 bg-opacity-95 rounded-xl shadow-2xl w-96 border border-zinc-700">
      <h3 className="text-lg font-bold mb-4 text-white">Animations</h3>
      {(!animations || animations.length === 0) && <div className="text-gray-400">No animations found.</div>}
      <ul className="space-y-2">
        {animations && animations.map((clip, idx) => (
          <li key={clip.name + idx} className="flex flex-col gap-2 bg-zinc-800 rounded-lg px-3 py-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-white">{clip.name || `Animation ${idx+1}`}</span>
                <span className="ml-2 text-xs text-gray-400">
                  ({clip.duration.toFixed(2)}s)
                </span>
              </div>
              <div className="flex gap-2">
                {playingIndex === idx && isPlaying && (
                  <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={handlePause}>Pause</button>
                )}
                {playingIndex === idx && !isPlaying && (
                  <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={handleResume}>Resume</button>
                )}
                {playingIndex === idx ? (
                  <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={handleStop}>Stop</button>
                ) : (
                  <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => handlePlay(idx)}>Play</button>
                )}
              </div>
            </div>
            {playingIndex === idx && (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="range"
                  min={0}
                  max={duration}
                  step={0.01}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full accent-blue-500"
                />
                <span className="text-xs text-gray-300 w-20 text-right">
                  {currentTime.toFixed(2)}s / {duration.toFixed(2)}s
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
