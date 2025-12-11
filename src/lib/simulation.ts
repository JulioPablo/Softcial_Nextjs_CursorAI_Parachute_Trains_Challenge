export type TrainState = {
  position: number;           // Absolute position (for visualization only)
  relativePosition: number;   // Position relative to start (what the train actually tracks)
  foundOtherParachute: boolean;
  otherParachuteDirection: 1 | -1 | null; // Direction to other parachute when found
  phase: "searching" | "chasing";
  searchRadius: number;
  searchDirection: 1 | -1;
};

export type SimulationState = {
  train1: TrainState;
  train2: TrainState;
  parachute1: number;
  parachute2: number;
  step: number;
  collided: boolean;
  collisionPosition: number | null;
};

export function createInitialState(distance: number): SimulationState {
  // Train 1 at position 0, Train 2 at position `distance`
  // Both trains face the same direction (positive = forward)
  return {
    train1: {
      position: 0,
      relativePosition: 0,  // Starts at 0 relative to itself
      foundOtherParachute: false,
      otherParachuteDirection: null,
      phase: "searching",
      searchRadius: 1,
      searchDirection: 1,
    },
    train2: {
      position: distance,
      relativePosition: 0,  // Starts at 0 relative to itself
      foundOtherParachute: false,
      otherParachuteDirection: null,
      phase: "searching",
      searchRadius: 1,
      searchDirection: 1,
    },
    parachute1: 0,
    parachute2: distance,
    step: 0,
    collided: false,
    collisionPosition: null,
  };
}

/**
 * The algorithm each train runs:
 *
 * CONSTRAINT: Trains can only detect "I am at A parachute" - they cannot
 * distinguish which parachute it is. However, they CAN remember their
 * relative position from where they started.
 *
 * Phase 1 (Searching): Expand outward from starting position in increasing
 * radiuses. Go forward `r` units, back `2r` units, forward `r` units (back to start),
 * then increase radius.
 *
 * KEY INSIGHT: The train starts at its own parachute (relative position 0).
 * If it detects a parachute at ANY other relative position, that MUST be
 * the other train's parachute.
 *
 * Phase 2 (Chasing): Once the other parachute is found, move continuously
 * toward it. The other train is either at its parachute or beyond it,
 * so collision is guaranteed.
 */
function computeTrainMove(
  train: TrainState,
  atParachute: boolean  // The ONLY external information: "am I at a parachute?"
): { move: number; newState: Partial<TrainState> } {

  // Check if we found the OTHER parachute (a parachute not at our starting position)
  if (atParachute && train.relativePosition !== 0 && !train.foundOtherParachute) {
    // Found the other parachute! It's at our current relative position.
    // We need to keep moving in the direction we were going to find the other train.
    // The other train is on the "far side" of its parachute from us.
    const directionToOther = train.relativePosition > 0 ? 1 : -1;
    return {
      move: directionToOther,
      newState: {
        foundOtherParachute: true,
        otherParachuteDirection: directionToOther,
        phase: "chasing",
      },
    };
  }

  if (train.phase === "chasing") {
    // Keep moving in the direction where we found the other parachute
    return { move: train.otherParachuteDirection!, newState: {} };
  }

  // Searching phase: expanding search pattern
  // Pattern: from start (rel pos 0), go +r, then -2r (to -r), then +2r (back to +r), etc.
  // But simpler: go to +r, then to -r, then increase r and repeat

  if (train.searchDirection === 1) {
    // Moving in positive direction
    if (train.relativePosition < train.searchRadius) {
      return { move: 1, newState: {} };
    } else {
      // Reached positive limit, turn around
      return { move: -1, newState: { searchDirection: -1 } };
    }
  } else {
    // Moving in negative direction
    if (train.relativePosition > -train.searchRadius) {
      return { move: -1, newState: {} };
    } else {
      // Reached negative limit, increase radius and turn around
      return {
        move: 1,
        newState: {
          searchDirection: 1,
          searchRadius: train.searchRadius + 1,
        },
      };
    }
  }
}

/**
 * Check if a train is at any parachute
 */
function isAtParachute(trainPosition: number, para1: number, para2: number): boolean {
  return trainPosition === para1 || trainPosition === para2;
}

export function simulateStep(state: SimulationState): SimulationState {
  if (state.collided) return state;

  // Determine if each train is at A parachute (the only info they get)
  const train1AtParachute = isAtParachute(
    state.train1.position,
    state.parachute1,
    state.parachute2
  );
  const train2AtParachute = isAtParachute(
    state.train2.position,
    state.parachute1,
    state.parachute2
  );

  // Compute moves for both trains
  const move1 = computeTrainMove(state.train1, train1AtParachute);
  const move2 = computeTrainMove(state.train2, train2AtParachute);

  // Apply moves
  const newPos1 = state.train1.position + move1.move;
  const newPos2 = state.train2.position + move2.move;
  const newRel1 = state.train1.relativePosition + move1.move;
  const newRel2 = state.train2.relativePosition + move2.move;

  // Check for collision (trains at same position or crossed paths)
  const collided =
    newPos1 === newPos2 ||
    (state.train1.position < state.train2.position && newPos1 >= newPos2) ||
    (state.train1.position > state.train2.position && newPos1 <= newPos2);

  const collisionPosition = collided
    ? newPos1 === newPos2
      ? newPos1
      : (state.train1.position + state.train2.position) / 2
    : null;

  return {
    train1: {
      ...state.train1,
      position: newPos1,
      relativePosition: newRel1,
      ...move1.newState,
    },
    train2: {
      ...state.train2,
      position: newPos2,
      relativePosition: newRel2,
      ...move2.newState,
    },
    parachute1: state.parachute1,
    parachute2: state.parachute2,
    step: state.step + 1,
    collided,
    collisionPosition,
  };
}

export function runUntilCollision(
  initialDistance: number,
  maxSteps: number = 10000
): SimulationState[] {
  const history: SimulationState[] = [];
  let state = createInitialState(initialDistance);
  history.push(state);

  while (!state.collided && state.step < maxSteps) {
    state = simulateStep(state);
    history.push(state);
  }

  return history;
}
