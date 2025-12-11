"use client";

type Props = {
  distance: number;
  onDistanceChange: (d: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onStep: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (s: number) => void;
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
  collided: boolean;
};

export function SimulationControls({
  distance,
  onDistanceChange,
  isPlaying,
  onPlayPause,
  onStep,
  onReset,
  speed,
  onSpeedChange,
  currentStep,
  totalSteps,
  onStepChange,
  collided,
}: Props) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Distance control */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">Initial Distance:</label>
          <input
            type="number"
            min="1"
            max="100"
            value={distance}
            onChange={(e) => onDistanceChange(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 px-2 py-1 bg-gray-700 rounded border border-gray-600 text-white"
          />
        </div>

        {/* Speed control */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">Speed:</label>
          <input
            type="range"
            min="1"
            max="10"
            value={speed}
            onChange={(e) => onSpeedChange(parseInt(e.target.value))}
            className="w-24"
          />
          <span className="text-sm text-gray-400">{speed}x</span>
        </div>

        {/* Playback controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-white text-sm"
          >
            Reset
          </button>
          <button
            onClick={onStep}
            disabled={collided}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white text-sm"
          >
            Step
          </button>
          <button
            onClick={onPlayPause}
            disabled={collided}
            className={`px-4 py-1 rounded text-white text-sm ${
              isPlaying
                ? "bg-yellow-600 hover:bg-yellow-500"
                : "bg-green-600 hover:bg-green-500"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      </div>

      {/* Step slider */}
      <div className="flex items-center gap-4">
        <label className="text-sm text-gray-400">Step {currentStep} / {totalSteps - 1}</label>
        <input
          type="range"
          min="0"
          max={totalSteps - 1}
          value={currentStep}
          onChange={(e) => onStepChange(parseInt(e.target.value))}
          className="flex-1"
        />
      </div>
    </div>
  );
}
