import { BudgetCycleCalculator } from "./budgetCycle";

const defaultCalculator = new BudgetCycleCalculator({
  paydayDay: 20,
  weekendBehavior: "preceding-friday",
});

export { BudgetCycleCalculator, defaultCalculator };
export default defaultCalculator;
