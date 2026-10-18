import type { Page } from "@playwright/test";

export async function unreadableText(page: Page) {
  return page.locator("body").evaluate((body) => {
    const rgba = (value: string) => {
      const channels = value.match(/[\d.]+/g)?.map(Number);
      if (!channels || channels.length < 3)
        throw new Error(`Unsupported rendered color: ${value}`);
      return [channels[0], channels[1], channels[2], channels[3] ?? 1];
    };
    const luminance = (channels: number[]) => {
      const rgb = channels.slice(0, 3).map((channel) => {
        const value = channel / 255;
        return value <= 0.04045
          ? value / 12.92
          : ((value + 0.055) / 1.055) ** 2.4;
      });
      return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
    };
    const failures: { text: string; ratio: number; required: number }[] = [];
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const element = walker.currentNode.parentElement;
      const text = walker.currentNode.textContent?.trim();
      if (!element || !text || element.closest('[aria-disabled="true"]'))
        continue;
      const style = getComputedStyle(element);
      const bounds = element.getBoundingClientRect();
      if (!bounds.width || !bounds.height || style.visibility !== "visible")
        continue;
      let background: number[] | undefined;
      for (
        let parent: HTMLElement | null = element;
        parent;
        parent = parent.parentElement
      ) {
        const color = rgba(getComputedStyle(parent).backgroundColor);
        if (color[3] === 1) {
          background = color;
          break;
        }
        if (color[3] !== 0)
          throw new Error(`Unmeasured translucent text surface: ${text}`);
      }
      if (!background) throw new Error(`Missing text background: ${text}`);
      const foreground = rgba(style.color);
      const values = [luminance(foreground), luminance(background)].sort(
        (a, b) => a - b,
      );
      const ratio = (values[1] + 0.05) / (values[0] + 0.05);
      const size = parseFloat(style.fontSize);
      const required =
        size >= 24 || (size >= 18.667 && Number(style.fontWeight) >= 700)
          ? 3
          : 4.5;
      if (ratio < required) failures.push({ text, ratio, required });
    }
    return failures;
  });
}
