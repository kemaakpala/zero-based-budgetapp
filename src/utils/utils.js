
export const generateUniqueId = () =>
Array.from(window.crypto.getRandomValues(new Uint8Array(16)))
  .map((b) => b.toString(16).padStart(2, "0"))
  .join("");

export const removeSpace = (str) => str.replace(/\s+/g, '')