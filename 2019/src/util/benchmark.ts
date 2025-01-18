export const benchmark = <T>(func: () => T, label?: string): T => {
  const start = Date.now();
  const returnValue = func();
  const end = Date.now();

  console.log(`${!!label ? `${label}: ` : ""}Took ${end - start}ms`);

  return returnValue;
};
