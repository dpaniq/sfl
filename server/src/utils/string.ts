const NUMBERS = '0123456789'
const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'



export function makeId(length: number) {
  let result = '';
  const symbols = CHARACTERS + NUMBERS
  const charactersLength = symbols.length;
  let counter = 0;
  while (counter < length) {
    result += symbols.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function randomSentence(spaces: number): void {
  //
}