import { expect, test } from "bun:test";
import { dijkstra } from "../util/dijkstra.ts";
import { parsePlutoMap } from "./funcs.ts";

const example1 = `         A
         A
  #######.#########
  #######.........#
  #######.#######.#
  #######.#######.#
  #######.#######.#
  #####  B    ###.#
BC...##  C    ###.#
  ##.##       ###.#
  ##...DE  F  ###.#
  #####    G  ###.#
  #########.#####.#
DE..#######...###.#
  #.#########.###.#
FG..#########.....#
  ###########.#####
             Z
             Z`;

test("parsePlutoMap + dijkstra", () => {
  const plutoMap = parsePlutoMap(example1);

  expect(plutoMap.start).toBe("9,2");
  expect(plutoMap.end).toBe("13,16");

  expect(dijkstra(plutoMap.graph, plutoMap.start)[plutoMap.end]).toBe(23);
});
