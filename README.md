# Parachute Trains Puzzle - Visual Simulation

A Next.js web application that visually simulates and explains the solution to the "parachute trains on a railway line" puzzle.

## The Puzzle

A helicopter drops two trains, each on a parachute, onto a straight infinite railway line. The distance between the trains is unknown. Both trains face the same direction. When they land, each parachute detaches and stays on the track next to the train.

Each train is controlled by an identical microchip running the same program. The trains:
- Do not know their position on the line
- Do not know the distance between them
- Cannot communicate with each other
- Can only: move forward one unit, move backward one unit, or wait
- **Can detect when they are at a parachute, but CANNOT distinguish which parachute it is**

**Goal:** Design an algorithm that guarantees the two trains will eventually collide.

## The Algorithm

The key constraint is that trains cannot tell parachutes apart. However, each train **can remember its relative position** from where it started (by counting steps).

### Key Insight
Each train starts at a parachute, which is at **relative position 0**. If a train ever detects a parachute at a relative position **other than 0**, it knows this is a **different parachute** from where it started (without needing to know *which* parachute it is).

### Phase 1: Searching
Each train performs an expanding search from its starting position:
1. Move to relative position +r
2. Move to relative position -r
3. Increase r and repeat

While searching, the train checks at each position: "Am I at a parachute AND is my relative position ≠ 0?"

### Phase 2: Chasing
When a train detects a parachute at relative position ≠ 0, it switches to chasing mode and continuously moves in that direction until collision.

### Why It Works
- Both trains run identical code and move symmetrically
- When Train 1 reaches relative position +D (where a parachute exists), Train 2 is also at +D from its start (where no parachute exists)
- Only Train 1 detects a parachute at rel ≠ 0, breaking the symmetry
- Train 1 chases in that direction while Train 2 keeps searching, guaranteeing collision

## How to Run

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Visual railway simulation** - See trains and parachutes on a scrolling track
- **Step-by-step playback** - Watch the algorithm unfold one step at a time
- **Adjustable parameters** - Change initial distance and playback speed
- **Real-time state display** - Track each train's phase, relative position, and search radius
- **Collision detection** - Visual indication when trains meet

## How Claude Code Was Used

This project was developed using Claude Code (Anthropic's CLI for Claude). Claude Code assisted with:

1. **Project Setup** - Creating the Next.js project structure with TypeScript and Tailwind CSS
2. **Algorithm Design** - Designing the expanding search algorithm that respects the constraint that trains cannot distinguish between parachutes
3. **Simulation Logic** - Implementing the train state machine using only relative position tracking
4. **UI Components** - Building React components for visualization and controls
5. **Documentation** - Writing this README explaining the solution
6. **Bug Fixing** - Correcting an initial algorithm that incorrectly assumed trains could identify parachutes

The entire codebase was generated through iterative conversation with Claude Code, including algorithm refinement based on constraint analysis.

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [React 19](https://react.dev/) - UI library
