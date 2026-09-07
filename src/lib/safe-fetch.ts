/**
 * fetch + JSON parse that never throws. Dev-server hot reloads
 * (Turbopack) occasionally interrupt an in-flight request mid-poll,
 * returning a closed/empty body - a plain res.json() call on that
 * throws "Unexpected end of JSON input" and, since these run inside
 * useCallback poll loops, that can surface as an uncaught error and
 * crash the component. This just returns null for that one poll
 * cycle instead - the next interval tick tries again normally.
 */
export async function safeFetchJson<T = unknown>(
  input: string,
  init?: RequestInit,
): Promise<{ ok: boolean; status: number; data: T | null }> {
  try {
    const res = await fetch(input, init);
    const text = await res.text();
    if (!text) {
      return { ok: res.ok, status: res.status, data: null };
    }
    try {
      return { ok: res.ok, status: res.status, data: JSON.parse(text) as T };
    } catch {
      return { ok: false, status: res.status, data: null };
    }
  } catch {
    // Network error - offline, server not yet up, request aborted, etc.
    return { ok: false, status: 0, data: null };
  }
}
