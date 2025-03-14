export function gcd(a: number, b: number): number {
  return !b ? a : gcd(b, a % b);
}

export function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

export function lcmN(n: number[]): number {
  return n.reduce(lcm, 1);
}
