export const benchmark = <T>(func: () => T, label?: string): T => {
  const start = performance.now();
  const returnValue = func();
  const end = performance.now();

  console.log(`${!!label ? `${label}: ` : ""}Took ${end - start}ms`);

  return returnValue;
};
