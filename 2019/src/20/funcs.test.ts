import { expect, test } from "bun:test";
import { parsePlutoMap } from "./funcs.ts";
import { bfs } from "../util/bfs.ts";

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

test("parsePlutoMap + bfs", () => {
  const plutoMap = parsePlutoMap(example1);

  expect(plutoMap.start).toBe("9,2");
  expect(plutoMap.end).toBe("13,16");

  expect(bfs(plutoMap.graph, plutoMap.start)[plutoMap.end]).toBe(23);
});
