export class BudgetCycleCalculator {
  constructor(options = {}) {
    this.paydayDay = options.paydayDay ?? 20;
    this.weekendBehavior = options.weekendBehavior ?? "preceding-friday";
  }

  calculatePayday(year, monthIndex) {
    const date = new Date(year, monthIndex, this.paydayDay);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

    if (this.weekendBehavior === "preceding-friday") {
      if (dayOfWeek === 0) {
        return new Date(year, monthIndex, this.paydayDay - 2);
      } else if (dayOfWeek === 6) {
        return new Date(year, monthIndex, this.paydayDay - 1);
      }
    } else if (this.weekendBehavior === "following-monday") {
      if (dayOfWeek === 0) {
        return new Date(year, monthIndex, this.paydayDay + 1);
      } else if (dayOfWeek === 6) {
        return new Date(year, monthIndex, this.paydayDay + 2);
      }
    }
    return date;
  }

  getCycleRange(year, monthIndex) {
    const start = this.calculatePayday(year, monthIndex);

    // Next month calculation
    let nextMonthIndex = monthIndex + 1;
    let nextYear = year;
    if (nextMonthIndex > 11) {
      nextMonthIndex = 0;
      nextYear += 1;
    }
    const nextPayday = this.calculatePayday(nextYear, nextMonthIndex);
    const end = new Date(nextPayday.getTime() - 24 * 60 * 60 * 1000);

    return { start, end };
  }

  formatDate(date) {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) suffix = "st";
    else if (day === 2 || day === 22) suffix = "nd";
    else if (day === 3 || day === 23) suffix = "rd";

    return `${month} ${day}${suffix}, ${year}`;
  }

  formatCycleRange(range) {
    return `${this.formatDate(range.start)} - ${this.formatDate(range.end)}`;
  }
}
