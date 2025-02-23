export const useBenchmark = () => {
  let current = performance.now();

  const reset = (): void => {
    current = performance.now();
  };

  const get = (): void => {
    const now = performance.now();
    console.log(`Took ${now - current}ms`);
    current = now;
  };

  return { reset, get };
};
