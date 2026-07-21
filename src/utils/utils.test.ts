import { describe, beforeAll, it, expect } from "vitest";
import * as nodeCrypto from "crypto";
import {
  generateUniqueId,
  formatBudgetItemAmount,
  removeSpace,
  getFullYear,
} from "./utils";

describe("utils", () => {
  beforeAll(() => {
    Object.defineProperty(globalThis, "crypto", {
      value: {
        getRandomValues: function <T extends ArrayBufferView>(buffer: T): T {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return nodeCrypto.randomFillSync(buffer as any) as any;
        },
      },
      writable: true,
      configurable: true,
    });
  });

  it("should test that space is removed", () => {
    expect(removeSpace("hello world")).toBe("helloworld");
  });

  it("should test that unique id is generated", () => {
    expect(generateUniqueId()).toBeTruthy();
  });

  it("should test that amount is formatted", () => {
    expect(formatBudgetItemAmount(100)).toBe("100.00");
  });

  it("should test getFullYear", () => {
    expect(getFullYear()).toBeTruthy();
    expect(getFullYear()).toMatch(/^[a-zA-Z]+\s\d{4}$/);
    expect(getFullYear()).toMatch(
      /January|February|March|April|May|June|July|August|September|October|November|December\s\d{4}/
    );
  });
});
