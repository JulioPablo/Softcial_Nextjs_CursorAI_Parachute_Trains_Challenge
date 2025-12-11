"use client";

import { SimulationState } from "@/lib/simulation";

type Props = {
  state: SimulationState;
};

export function StateInfo({ state }: Props) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3 text-white">Current State</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Train 1 Info */}
        <div className="bg-blue-900/30 rounded p-3 border border-blue-800">
          <h4 className="font-medium text-blue-400 mb-2">Train 1 (Blue)</h4>
          <div className="text-sm space-y-1 text-gray-300">
            <p>Position: <span className="font-mono text-white">{state.train1.position}</span></p>
            <p>Relative Pos: <span className="font-mono text-white">{state.train1.relativePosition}</span></p>
            <p>Phase: <span className={`font-medium ${state.train1.phase === "chasing" ? "text-green-400" : "text-yellow-400"}`}>
              {state.train1.phase}
            </span></p>
            <p>Search Radius: <span className="font-mono text-white">{state.train1.searchRadius}</span></p>
            <p>Found New Parachute: <span className={state.train1.foundOtherParachute ? "text-green-400" : "text-gray-500"}>
              {state.train1.foundOtherParachute ? "Yes (at rel ≠ 0)" : "No"}
            </span></p>
          </div>
        </div>

        {/* Train 2 Info */}
        <div className="bg-red-900/30 rounded p-3 border border-red-800">
          <h4 className="font-medium text-red-400 mb-2">Train 2 (Red)</h4>
          <div className="text-sm space-y-1 text-gray-300">
            <p>Position: <span className="font-mono text-white">{state.train2.position}</span></p>
            <p>Relative Pos: <span className="font-mono text-white">{state.train2.relativePosition}</span></p>
            <p>Phase: <span className={`font-medium ${state.train2.phase === "chasing" ? "text-green-400" : "text-yellow-400"}`}>
              {state.train2.phase}
            </span></p>
            <p>Search Radius: <span className="font-mono text-white">{state.train2.searchRadius}</span></p>
            <p>Found New Parachute: <span className={state.train2.foundOtherParachute ? "text-green-400" : "text-gray-500"}>
              {state.train2.foundOtherParachute ? "Yes (at rel ≠ 0)" : "No"}
            </span></p>
          </div>
        </div>
      </div>

      {/* Collision status */}
      {state.collided && (
        <div className="mt-4 p-3 bg-yellow-900/30 rounded border border-yellow-700">
          <p className="text-yellow-400 font-medium">
            Collision detected at position {state.collisionPosition} after {state.step} steps!
          </p>
        </div>
      )}
    </div>
  );
}
