import { lcmN } from "../util/math.ts";
import { useBenchmark } from "../util/benchmark.ts";

const dimensions = ["x", "y", "z"] as const;
type Dimension = (typeof dimensions)[number];
type MoonData = {
  position: Record<Dimension, number>;
  velocity: Record<Dimension, number>;
};
export type MoonMap = MoonData[];

function cloneMoonMap(map: MoonMap): MoonMap {
  return map.map((data) => ({
    position: { ...data.position },
    velocity: { ...data.velocity },
  }));
}

function simulateDimensionStep(
  initialState: MoonMap,
  dimension: Dimension,
): MoonMap {
  const nextState = cloneMoonMap(initialState);

  for (let i = 0; i < initialState.length; i++) {
    for (let j = i + 1; j < initialState.length; j++) {
      if (
        initialState[i].position[dimension] >
        initialState[j].position[dimension]
      ) {
        nextState[i].position[dimension]--;
        nextState[i].velocity[dimension]--;

        nextState[j].position[dimension]++;
        nextState[j].velocity[dimension]++;
      } else if (
        initialState[i].position[dimension] <
        initialState[j].position[dimension]
      ) {
        nextState[i].position[dimension]++;
        nextState[i].velocity[dimension]++;

        nextState[j].position[dimension]--;
        nextState[j].velocity[dimension]--;
      }
    }

    nextState[i].position[dimension] += initialState[i].velocity[dimension];
  }

  return nextState;
}

export function simulateStep(initialState: MoonMap): MoonMap {
  let nextState = initialState;

  for (let dimension of dimensions) {
    nextState = simulateDimensionStep(nextState, dimension);
  }

  return nextState;
}

export function simulateNSteps(initialState: MoonMap, steps: number): MoonMap {
  let nextState = cloneMoonMap(initialState);

  for (let i = 0; i < steps; i++) {
    nextState = simulateStep(nextState);
  }

  return nextState;
}

export function calculateEnergy(state: MoonMap) {
  return state.reduce((acc, data) => {
    const potentialEnergy = dimensions.reduce((acc, dimension) => {
      return acc + Math.abs(data.position[dimension]);
    }, 0);

    const kineticEnergy = dimensions.reduce((acc, dimension) => {
      return acc + Math.abs(data.velocity[dimension]);
    }, 0);

    return acc + potentialEnergy * kineticEnergy;
  }, 0);
}

function getDimensionCycle(
  initialState: MoonMap,
  dimension: Dimension,
): number {
  function isInitialState(state: MoonMap): boolean {
    return state.every(
      (moon, index) =>
        moon.position[dimension] === initialState[index].position[dimension] &&
        moon.velocity[dimension] === initialState[index].velocity[dimension],
    );
  }

  let nextState = simulateDimensionStep(cloneMoonMap(initialState), dimension);
  let i = 1;

  while (!isInitialState(nextState)) {
    nextState = simulateDimensionStep(nextState, dimension);
    i++;
  }

  return i;
}

export function getStepsRequiredForDuplicateState(
  initialState: MoonMap,
): number {
  const xCycle = getDimensionCycle(initialState, "x");
  const yCycle = getDimensionCycle(initialState, "y");
  const zCycle = getDimensionCycle(initialState, "z");

  return lcmN([xCycle, yCycle, zCycle]);
}
