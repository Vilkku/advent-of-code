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

export function simulateStep(initialState: MoonMap): MoonMap {
  const nextState = cloneMoonMap(initialState);

  for (let i = 0; i < initialState.length; i++) {
    for (let j = i; j < initialState.length; j++) {
      for (let dimension of dimensions) {
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
    }

    for (let dimension of dimensions) {
      nextState[i].position[dimension] += initialState[i].velocity[dimension];
    }
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

export function simulateUntilDuplicateState(
  initialState: MoonMap,
  maxIterations?: number,
) {
  let nextState = cloneMoonMap(initialState);
  let cacheKey = JSON.stringify(nextState);
  const cache = new Set<string>();
  let i = 0;

  while (!cache.has(cacheKey)) {
    cache.add(cacheKey);

    if (maxIterations && i > maxIterations) {
      throw new Error("Did not encounter duplicate before limit");
    }

    nextState = simulateStep(nextState);
    cacheKey = JSON.stringify(nextState);
    i++;
  }

  return i;
}
