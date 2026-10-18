/** Only owner-configured public HTTPS pages are opened from the native app. */
export function publicReleaseLinks(extra: unknown): {
  privacyURL: string | null;
  supportURL: string | null;
} {
  const release =
    extra && typeof extra === "object" && "release" in extra
      ? extra.release
      : null;
  const safe = (key: string) => {
    if (!release || typeof release !== "object" || !(key in release))
      return null;
    const value = (release as Record<string, unknown>)[key];
    if (typeof value !== "string") return null;
    try {
      const u = new URL(value);
      return u.protocol === "https:" && !u.username && !u.password
        ? value
        : null;
    } catch {
      return null;
    }
  };
  return { privacyURL: safe("privacyURL"), supportURL: safe("supportURL") };
}
