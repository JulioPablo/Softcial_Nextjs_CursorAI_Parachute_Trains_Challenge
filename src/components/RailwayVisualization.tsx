"use client";

import { SimulationState } from "@/lib/simulation";

type Props = {
  state: SimulationState;
  viewportCenter: number;
  viewportWidth: number;
};

export function RailwayVisualization({
  state,
  viewportCenter,
  viewportWidth,
}: Props) {
  const minPos = viewportCenter - viewportWidth / 2;
  const maxPos = viewportCenter + viewportWidth / 2;

  const toPercent = (pos: number) => ((pos - minPos) / (maxPos - minPos)) * 100;

  const train1Percent = toPercent(state.train1.position);
  const train2Percent = toPercent(state.train2.position);
  const para1Percent = toPercent(state.parachute1);
  const para2Percent = toPercent(state.parachute2);

  const isVisible = (percent: number) => percent >= -5 && percent <= 105;

  return (
    <div className="relative w-full h-48 bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
      {/* Railway track */}
      <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-600 -translate-y-1/2">
        {/* Track ties */}
        {Array.from({ length: Math.floor(viewportWidth) + 1 }).map((_, i) => {
          const pos = minPos + i;
          const percent = toPercent(pos);
          return (
            <div
              key={i}
              className="absolute w-1 h-6 bg-gray-700 -translate-x-1/2 -translate-y-1/2 top-1/2"
              style={{ left: `${percent}%` }}
            />
          );
        })}
      </div>

      {/* Position markers */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 text-xs text-gray-500">
        <span>{Math.floor(minPos)}</span>
        <span>{Math.floor(viewportCenter)}</span>
        <span>{Math.floor(maxPos)}</span>
      </div>

      {/* Parachute 1 */}
      {isVisible(para1Percent) && (
        <div
          className="absolute top-1/2 -translate-x-1/2 transition-all duration-300"
          style={{ left: `${para1Percent}%`, transform: "translate(-50%, -120%)" }}
        >
          <div className="flex flex-col items-center">
            <div className="w-8 h-6 bg-blue-400 rounded-t-full opacity-70" />
            <div className="w-0.5 h-3 bg-blue-300" />
            <span className="text-xs text-blue-400 mt-1">P1</span>
          </div>
        </div>
      )}

      {/* Parachute 2 */}
      {isVisible(para2Percent) && (
        <div
          className="absolute top-1/2 -translate-x-1/2 transition-all duration-300"
          style={{ left: `${para2Percent}%`, transform: "translate(-50%, -120%)" }}
        >
          <div className="flex flex-col items-center">
            <div className="w-8 h-6 bg-red-400 rounded-t-full opacity-70" />
            <div className="w-0.5 h-3 bg-red-300" />
            <span className="text-xs text-red-400 mt-1">P2</span>
          </div>
        </div>
      )}

      {/* Train 1 */}
      {isVisible(train1Percent) && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300 ${
            state.collided ? "animate-pulse" : ""
          }`}
          style={{ left: `${train1Percent}%` }}
        >
          <div className="relative">
            <div
              className={`w-12 h-8 rounded-md flex items-center justify-center text-white font-bold text-sm ${
                state.train1.phase === "chasing"
                  ? "bg-blue-600 ring-2 ring-blue-300"
                  : "bg-blue-500"
              }`}
            >
              T1
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-blue-400">
              {state.train1.position}
            </div>
          </div>
        </div>
      )}

      {/* Train 2 */}
      {isVisible(train2Percent) && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300 ${
            state.collided ? "animate-pulse" : ""
          }`}
          style={{ left: `${train2Percent}%` }}
        >
          <div className="relative">
            <div
              className={`w-12 h-8 rounded-md flex items-center justify-center text-white font-bold text-sm ${
                state.train2.phase === "chasing"
                  ? "bg-red-600 ring-2 ring-red-300"
                  : "bg-red-500"
              }`}
            >
              T2
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-red-400">
              {state.train2.position}
            </div>
          </div>
        </div>
      )}

      {/* Collision indicator */}
      {state.collided && state.collisionPosition !== null && (
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
          style={{ left: `${toPercent(state.collisionPosition)}%` }}
        >
          <div className="animate-ping absolute w-16 h-16 bg-yellow-500 rounded-full opacity-50 -translate-x-1/2 -translate-y-1/2" />
          <div className="relative text-2xl">💥</div>
        </div>
      )}
    </div>
  );
}
