export function generateRandomId() {
  const characters = 'abcdefghijklmnopqrstuvwxyz234567'
  const idLength = 32
  let randomId = 'ptu_'

  for (let i = 0; i < idLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    randomId += characters[randomIndex]
  }

  return randomId
}
