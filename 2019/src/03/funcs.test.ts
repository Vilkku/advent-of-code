import { expect, test } from "bun:test";
import {
  type Path,
  findIntersections,
  getClosestDistance,
  getFewestSteps,
  inputRowToInstructions,
  instructionsToPath,
} from "./funcs";

const path1: Path = {
  horizontal: {
    0: [
      {
        start: [0, 0],
        end: [8, 0],
        stepsFromOriginToStart: 0,
      },
    ],
    5: [
      {
        start: [8, 5],
        end: [3, 5],
        stepsFromOriginToStart: 13,
      },
    ],
  },
  vertical: {
    3: [
      {
        start: [3, 5],
        end: [3, 2],
        stepsFromOriginToStart: 18,
      },
    ],
    8: [
      {
        start: [8, 0],
        end: [8, 5],
        stepsFromOriginToStart: 8,
      },
    ],
  },
};

const path2: Path = {
  horizontal: {
    3: [
      {
        start: [6, 3],
        end: [2, 3],
        stepsFromOriginToStart: 17,
      },
    ],
    7: [
      {
        start: [0, 7],
        end: [6, 7],
        stepsFromOriginToStart: 7,
      },
    ],
  },
  vertical: {
    0: [
      {
        start: [0, 0],
        end: [0, 7],
        stepsFromOriginToStart: 0,
      },
    ],
    6: [
      {
        start: [6, 7],
        end: [6, 3],
        stepsFromOriginToStart: 13,
      },
    ],
  },
};

test("instructionsToPath", () => {
  expect(
    instructionsToPath(inputRowToInstructions("R8,U5,L5,D3")),
  ).toMatchObject(path1);

  expect(
    instructionsToPath(inputRowToInstructions("U7,R6,D4,L4")),
  ).toMatchObject(path2);
});

test("findIntersections", () => {
  expect(findIntersections(path1, path2)).toMatchObject([
    { coordinate: [6, 5], steps: 30 },
    { coordinate: [3, 3], steps: 40 },
  ]);
});

test("getClosestDistance", () => {
  expect(getClosestDistance(findIntersections(path1, path2))).toEqual(6);

  expect(
    getClosestDistance(
      findIntersections(
        instructionsToPath(
          inputRowToInstructions("R75,D30,R83,U83,L12,D49,R71,U7,L72"),
        ),
        instructionsToPath(
          inputRowToInstructions("U62,R66,U55,R34,D71,R55,D58,R83"),
        ),
      ),
    ),
  ).toEqual(159);

  expect(
    getClosestDistance(
      findIntersections(
        instructionsToPath(
          inputRowToInstructions("R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51"),
        ),
        instructionsToPath(
          inputRowToInstructions("U98,R91,D20,R16,D67,R40,U7,R15,U6,R7"),
        ),
      ),
    ),
  ).toEqual(135);
});

test("getFewestSteps", () => {
  expect(getFewestSteps(findIntersections(path1, path2))).toEqual(30);

  expect(
    getFewestSteps(
      findIntersections(
        instructionsToPath(
          inputRowToInstructions("R75,D30,R83,U83,L12,D49,R71,U7,L72"),
        ),
        instructionsToPath(
          inputRowToInstructions("U62,R66,U55,R34,D71,R55,D58,R83"),
        ),
      ),
    ),
  ).toEqual(610);

  expect(
    getFewestSteps(
      findIntersections(
        instructionsToPath(
          inputRowToInstructions("R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51"),
        ),
        instructionsToPath(
          inputRowToInstructions("U98,R91,D20,R16,D67,R40,U7,R15,U6,R7"),
        ),
      ),
    ),
  ).toEqual(410);
});
