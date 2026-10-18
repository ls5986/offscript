import { expect, test } from "vitest";
import { swipeDirection } from "../../src/domain/prompt-navigation";

test("only deliberate, predominantly horizontal one-finger movement navigates", () => {
  expect(swipeDirection(-64, 0)).toBe(1);
  expect(swipeDirection(64, 0)).toBe(-1);
  expect(swipeDirection(63, 0)).toBeNull();
  expect(swipeDirection(0, 160)).toBeNull();
  expect(swipeDirection(-90, 60)).toBeNull();
  expect(swipeDirection(-130, 5, 2)).toBeNull();
  expect(swipeDirection(-130, 5, 0)).toBeNull();
  expect(swipeDirection(0, 0)).toBeNull();
});
