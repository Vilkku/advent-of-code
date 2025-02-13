export const benchmark_deprecated = <T>(func: () => T, label?: string): T => {
  const start = performance.now();
  const returnValue = func();
  const end = performance.now();

  console.log(`${!!label ? `${label}: ` : ""}Took ${end - start}ms`);

  return returnValue;
};

export const useBenchmark = () => {
  const benchmarks: Record<string, DOMHighResTimeStamp> = {
    global: performance.now(),
  };

  const start = (label: string) => {
    if (label === "global") {
      throw new Error(`"global" is a reserved label`);
    }

    benchmarks[label] = performance.now();
  };

  const get = (label: string): number | undefined =>
    benchmarks[label] ? performance.now() - benchmarks[label] : undefined;

  const print = (label: string): void => {
    const value = get(label);
    console.log(`${label}: Took ${value}ms`);
  };

  const printGlobal = () => print("global");

  return { start, get, print, printGlobal };
};
