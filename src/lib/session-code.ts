/**
 * Generates a short, human-typeable session join code.
 * Avoids ambiguous characters (0/O, 1/I/L) since players type this
 * on a phone keyboard, often glancing at a projector across a room.
 */
const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateSessionCode(length = 5): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}
