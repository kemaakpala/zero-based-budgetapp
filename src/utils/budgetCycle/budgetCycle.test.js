import { describe, it, expect } from "vitest";
import { BudgetCycleCalculator, defaultCalculator } from "./index";

describe("BudgetCycleCalculator", () => {
  describe("defaultCalculator (payday 20th, preceding Friday)", () => {
    it("should calculate correct payday when it is a weekday", () => {
      // July 20th 2026 is a Monday
      const payday = defaultCalculator.calculatePayday(2026, 6); // index 6 is July
      expect(payday.getFullYear()).toBe(2026);
      expect(payday.getMonth()).toBe(6);
      expect(payday.getDate()).toBe(20);
    });

    it("should shift payday to Friday 18th when 20th is Sunday", () => {
      // September 20th 2026 is a Sunday
      const payday = defaultCalculator.calculatePayday(2026, 8); // index 8 is Sept
      expect(payday.getDate()).toBe(18);
    });

    it("should shift payday to Friday 19th when 20th is Saturday", () => {
      // June 20th 2026 is a Saturday
      const payday = defaultCalculator.calculatePayday(2026, 5); // index 5 is June
      expect(payday.getDate()).toBe(19);
    });

    it("should calculate correct budget cycle range", () => {
      // Budget cycle for June 2026
      // June payday is June 19th (since 20th is Saturday)
      // July payday is July 20th (Monday)
      // Cycle starts June 19th and ends July 19th
      const range = defaultCalculator.getCycleRange(2026, 5);
      expect(range.start.getDate()).toBe(19);
      expect(range.start.getMonth()).toBe(5);
      expect(range.end.getDate()).toBe(19);
      expect(range.end.getMonth()).toBe(6);
    });

    it("should format dates correctly with correct suffix", () => {
      const date1 = new Date(2026, 5, 1);
      const date2 = new Date(2026, 5, 2);
      const date3 = new Date(2026, 5, 3);
      const date4 = new Date(2026, 5, 4);
      const date21 = new Date(2026, 5, 21);
      const date22 = new Date(2026, 5, 22);
      const date23 = new Date(2026, 5, 23);

      expect(defaultCalculator.formatDate(date1)).toBe("June 1st, 2026");
      expect(defaultCalculator.formatDate(date2)).toBe("June 2nd, 2026");
      expect(defaultCalculator.formatDate(date3)).toBe("June 3rd, 2026");
      expect(defaultCalculator.formatDate(date4)).toBe("June 4th, 2026");
      expect(defaultCalculator.formatDate(date21)).toBe("June 21st, 2026");
      expect(defaultCalculator.formatDate(date22)).toBe("June 22nd, 2026");
      expect(defaultCalculator.formatDate(date23)).toBe("June 23rd, 2026");
    });

    it("should format cycle range correctly", () => {
      const range = defaultCalculator.getCycleRange(2026, 5);
      expect(defaultCalculator.formatCycleRange(range)).toBe(
        "June 19th, 2026 - July 19th, 2026",
      );
    });
  });

  describe("custom configurations", () => {
    it("should support custom payday date (e.g. 25th)", () => {
      const calc = new BudgetCycleCalculator({ paydayDay: 25 });
      // July 25th 2026 is Saturday -> preceding Friday 24th
      const payday = calc.calculatePayday(2026, 6);
      expect(payday.getDate()).toBe(24);
    });

    it("should support following-monday weekend behavior", () => {
      const calc = new BudgetCycleCalculator({
        paydayDay: 20,
        weekendBehavior: "following-monday",
      });
      // June 20th 2026 is Saturday -> following Monday 22nd
      const payday = calc.calculatePayday(2026, 5);
      expect(payday.getDate()).toBe(22);
    });
  });
});
