export function range(num: number): number[] {
  return Array(num).fill(undefined);
}

export function rangeInt(num: number): number[] {
  return [...Array(num).keys()];
}
