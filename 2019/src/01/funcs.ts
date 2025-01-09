export const calculateFuelForMass = (mass: number): number => {
  return Math.floor(mass / 3) - 2;
};

export const calculateFuelForMassAndFuel = (mass: number): number => {
  const initialFuel = calculateFuelForMass(mass);
  const additionalFuel = calculateFuelForMass(initialFuel);

  if (additionalFuel <= 0) {
    return Math.max(initialFuel, 0);
  }

  return (
    initialFuel + additionalFuel + calculateFuelForMassAndFuel(additionalFuel)
  );
};
