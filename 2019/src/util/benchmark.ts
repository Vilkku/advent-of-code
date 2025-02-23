export const useBenchmark = () => {
  const start = performance.now();
  let prev = start;

  const print = (label: string): void => {
    const now = performance.now();
    console.log(`${label}: Took ${now - prev}ms`);
    prev = now;
  };

  return { print };
};
