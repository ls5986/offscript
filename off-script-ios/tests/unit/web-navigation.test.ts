import { expect, test } from "vitest";
import { playHomePath } from "../../src/config/navigation";

test("the browser returns to the game entry instead of the public landing", () => {
  expect(playHomePath("web")).toBe("/play");
});
test.each(["ios", "android"])(
  "native %s keeps the original home route",
  (platform) => {
    expect(playHomePath(platform)).toBe("/");
  },
);
