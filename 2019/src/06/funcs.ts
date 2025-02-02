interface ObjectOrbitDef {
  satelliteTo: string | null;
  satellites: string[];
}

type OrbitTree = Record<string, ObjectOrbitDef>;

export function getOrbitTree(orbitMap: [string, string][]): OrbitTree {
  const orbitTree: OrbitTree = {};
  orbitMap.forEach(([satelliteTo, satellite]) => {
    if (!orbitTree[satelliteTo]) {
      orbitTree[satelliteTo] = {
        satelliteTo: null,
        satellites: [],
      };
    }

    if (!orbitTree[satellite]) {
      orbitTree[satellite] = {
        satelliteTo: satelliteTo,
        satellites: [],
      };
    }

    orbitTree[satelliteTo].satellites.push(satellite);
    orbitTree[satellite].satelliteTo = satelliteTo;
  });

  return orbitTree;
}

export function getOrbitCount(
  orbitTree: OrbitTree,
  object: string,
  count = 0,
): number {
  const objectOrbitDef = orbitTree[object];

  if (!objectOrbitDef) {
    throw new Error(`${object} not found in tree`);
  }

  if (objectOrbitDef.satellites.length === 0) {
    return count;
  }

  return objectOrbitDef.satellites.reduce(
    (acc, curr) => acc + getOrbitCount(orbitTree, curr, count + 1),
    count,
  );
}

export function getParents(orbitTree: OrbitTree, object: string): string[] {
  const objectOrbitDef = orbitTree[object];

  if (!objectOrbitDef) {
    throw new Error(`${object} not found in tree`);
  }

  if (!objectOrbitDef.satelliteTo) {
    return [];
  }

  return [
    objectOrbitDef.satelliteTo,
    ...getParents(orbitTree, objectOrbitDef.satelliteTo),
  ];
}

export function getClosestCommonParent(
  aParents: string[],
  bParents: string[],
): string | null {
  for (const aParent of aParents) {
    if (bParents.includes(aParent)) {
      return aParent;
    }
  }

  return null;
}

export function getStepsFromAtoB(orbitTree: OrbitTree, a: string, b: string) {
  const aParents = getParents(orbitTree, a);
  const bParents = getParents(orbitTree, b);

  const closestCommonParent = getClosestCommonParent(aParents, bParents);

  if (!closestCommonParent) {
    throw new Error("No common parent found");
  }

  return (
    aParents.indexOf(closestCommonParent) +
    bParents.indexOf(closestCommonParent)
  );
}
