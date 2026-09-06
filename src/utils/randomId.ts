import crypto from 'crypto'

export default function generateId() {
  const number = crypto.randomInt(100000, 1000000); // 6 digit random number
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const randomLetter = letters[crypto.randomInt(0, letters.length)]; // Random letter (a-z)

  return `${number}${randomLetter}`; // Ex: "584920k"
}
