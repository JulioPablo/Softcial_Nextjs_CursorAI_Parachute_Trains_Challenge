"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { runUntilCollision, SimulationState } from "@/lib/simulation";
import { RailwayVisualization } from "@/components/RailwayVisualization";
import { SimulationControls } from "@/components/SimulationControls";
import { StateInfo } from "@/components/StateInfo";
import { AlgorithmExplanation } from "@/components/AlgorithmExplanation";

export default function Home() {
  const [distance, setDistance] = useState(10);
  const [history, setHistory] = useState<SimulationState[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);

  // Compute full simulation when distance changes
  useEffect(() => {
    const newHistory = runUntilCollision(distance);
    setHistory(newHistory);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [distance]);

  // Auto-play effect
  useEffect(() => {
    if (!isPlaying || currentStep >= history.length - 1) {
      if (currentStep >= history.length - 1) {
        setIsPlaying(false);
      }
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= history.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, history.length, currentStep]);

  const handlePlayPause = useCallback(() => {
    if (currentStep >= history.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying((prev) => !prev);
  }, [currentStep, history.length]);

  const handleStep = useCallback(() => {
    if (currentStep < history.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, history.length]);

  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const currentState = history[currentStep] || history[0];

  // Calculate viewport to keep both trains and parachutes visible
  const viewportCenter = useMemo(() => {
    if (!currentState) return distance / 2;
    const minPos = Math.min(
      currentState.train1.position,
      currentState.train2.position,
      currentState.parachute1,
      currentState.parachute2
    );
    const maxPos = Math.max(
      currentState.train1.position,
      currentState.train2.position,
      currentState.parachute1,
      currentState.parachute2
    );
    return (minPos + maxPos) / 2;
  }, [currentState, distance]);

  const viewportWidth = useMemo(() => {
    if (!currentState) return distance + 10;
    const minPos = Math.min(
      currentState.train1.position,
      currentState.train2.position,
      currentState.parachute1,
      currentState.parachute2
    );
    const maxPos = Math.max(
      currentState.train1.position,
      currentState.train2.position,
      currentState.parachute1,
      currentState.parachute2
    );
    return Math.max(maxPos - minPos + 10, 20);
  }, [currentState, distance]);

  if (!currentState) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Parachute Trains Puzzle
          </h1>
          <p className="text-gray-400">
            Two identical trains on an infinite railway must collide using only
            parachute detection and step counting
          </p>
        </div>

        {/* Main visualization */}
        <RailwayVisualization
          state={currentState}
          viewportCenter={viewportCenter}
          viewportWidth={viewportWidth}
        />

        {/* Controls */}
        <SimulationControls
          distance={distance}
          onDistanceChange={setDistance}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onStep={handleStep}
          onReset={handleReset}
          speed={speed}
          onSpeedChange={setSpeed}
          currentStep={currentStep}
          totalSteps={history.length}
          onStepChange={setCurrentStep}
          collided={currentState.collided}
        />

        {/* Info panels */}
        <div className="grid md:grid-cols-2 gap-4">
          <StateInfo state={currentState} />
          <AlgorithmExplanation />
        </div>
      </div>
    </div>
  );
}
