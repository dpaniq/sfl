export function isNumber(number: any): number is number {
  return !Number.isNaN(Number(number));
}
