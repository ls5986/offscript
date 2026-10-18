export function playHomePath(platform: string): "/" | "/play" {
  return platform === "web" ? "/play" : "/";
}
