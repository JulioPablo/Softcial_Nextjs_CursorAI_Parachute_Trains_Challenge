"use client";

export function AlgorithmExplanation() {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3 text-white">Algorithm Explanation</h3>

      <div className="text-sm text-gray-300 space-y-3">
        <div className="bg-purple-900/30 rounded p-3 border border-purple-700">
          <h4 className="font-medium text-purple-400 mb-1">Key Constraint</h4>
          <p>
            Trains can only detect <em>&quot;I am at a parachute&quot;</em> - they
            <strong className="text-white"> cannot distinguish</strong> which parachute it is.
            However, they can count steps and remember their
            <strong className="text-white"> relative position</strong> from where they started.
          </p>
        </div>

        <p>
          Both trains run the <strong className="text-white">same identical program</strong> and
          start in identical states (at their own parachute, relative position 0).
        </p>

        <div className="bg-gray-900 rounded p-3 space-y-2">
          <h4 className="font-medium text-yellow-400">Phase 1: Searching</h4>
          <p>
            Each train performs an expanding search from its starting position.
            It moves to relative position +r, then to -r, then increases r and repeats.
            Both trains move symmetrically, maintaining constant distance apart.
          </p>
        </div>

        <div className="bg-gray-900 rounded p-3 space-y-2">
          <h4 className="font-medium text-green-400">Phase 2: Chasing</h4>
          <p>
            When a train detects a parachute at <strong className="text-white">relative position ≠ 0</strong>,
            it knows this is a <strong className="text-white">different parachute</strong> from where it started
            (since it started at relative position 0). The train then moves continuously in that
            direction, toward where the other train must be.
          </p>
        </div>

        <div className="bg-gray-900 rounded p-3 space-y-2">
          <h4 className="font-medium text-blue-400">Why It Works</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Each train starts at a parachute (relative position 0)</li>
            <li>Both move identically, staying distance D apart</li>
            <li>When Train 1 reaches rel +D (a parachute is there), Train 2 is at rel +D (no parachute there)</li>
            <li>Only Train 1 detects a parachute at rel ≠ 0, breaking symmetry</li>
            <li>Train 1 chases while Train 2 keeps searching, guaranteeing collision</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
