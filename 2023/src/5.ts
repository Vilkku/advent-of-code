export const part1 = (input: string) => {
  type Map = {
    from: string;
    to: string;
    mappings: { from: number; to: number; offset: number }[];
  };
  let seeds: number[] = [];
  const maps: Map[] = [];
  let currentMap: Map;

  input.split("\n").forEach((line) => {
    const parts = line.split(" ");

    if (parts[0] === "seeds:") {
      seeds = parts.slice(1).map((s) => parseInt(s, 10));
      return;
    }

    if (parts[0] === "") {
      if (currentMap) {
        maps.push(currentMap);
      }

      return;
    }

    if (parts[1] === "map:") {
      if (currentMap) {
        maps.push(currentMap);
      }

      const mappingParts = parts[0].split("-");
      currentMap = { from: mappingParts[0], to: mappingParts[2], mappings: [] };
      return;
    }

    if (currentMap) {
      const numParts = parts.map((p) => parseInt(p, 10));
      currentMap.mappings.push({
        from: numParts[1],
        to: numParts[1] + numParts[2] - 1,
        offset: numParts[0] - numParts[1],
      });
    }
  });

  const convert = (value: number, from = "seed"): number => {
    const map = maps.find((m) => m.from === from);

    if (!map) {
      throw new Error(`No map found for ${from}`);
    }

    const mapping = map.mappings.find((m) => value >= m.from && value <= m.to);
    const nextValue = mapping ? value + mapping.offset : value;

    if (map.to === "location") {
      return nextValue;
    }

    return convert(nextValue, map.to);
  };

  const locations = seeds.map((s) => convert(s));
  const smallestLocation = Math.min(...locations);

  return smallestLocation;
};

export const part2 = (input: string) => {
  type Map = Mapping[];
  type Mapping = { dstStart: number; srcStart: number; rangeLength: number };
  let seeds: number[] = [];
  const maps: Map[] = [];

  input.split("\n").forEach((line) => {
    const parts = line.split(" ");

    if (parts[0] === "seeds:") {
      seeds = parts.slice(1).map((s) => parseInt(s, 10));
      return;
    }

    if (parts[0] === "") {
      return;
    }

    if (parts[1] === "map:") {
      maps.push([]);
      return;
    }

    const currentMap = maps[maps.length - 1];
    const numParts = parts.map((p) => parseInt(p, 10));
    currentMap.push({
      dstStart: numParts[0],
      srcStart: numParts[1],
      rangeLength: numParts[2],
    });
  });

  const seedMappings: { from: number; to: number }[] = [];
  for (let i = 0; i < seeds.length; i += 2) {
    seedMappings.push({ from: seeds[i], to: seeds[i] + seeds[i + 1] });
  }

  console.log(seedMappings.length);

  const reversedMaps = [...maps].reverse();

  for (let i = 0; ; i++) {
    const seed = reversedMaps.reduce((dst: number, map: Map) => {
      const mapping = map.find(
        (m) => dst >= m.dstStart && dst <= m.dstStart + m.rangeLength
      );
      return mapping ? mapping.srcStart + dst - mapping.dstStart : dst;
    }, i);

    if (seedMappings.some((m) => seed >= m.from && seed <= m.to)) {
      return i;
    }
  }
};

if (import.meta.main) {
  const file = Bun.file("./inputs/5.txt");
  const input = await file.text();

  console.log([part1(input), part2(input)]);
}
