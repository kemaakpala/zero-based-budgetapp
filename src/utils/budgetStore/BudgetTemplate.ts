import { StorageAdapter } from "./adapters";
import { BudgetState } from "./types";

export class BudgetTemplate {
  private storageAdapter: StorageAdapter;

  constructor(storageAdapter: StorageAdapter) {
    this.storageAdapter = storageAdapter;
  }

  public get(): BudgetState | null {
    const raw = this.storageAdapter.get("budget_app_defaults");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as BudgetState;
    } catch (e) {
      console.error("Error parsing default budget template", e);
      return null;
    }
  }

  public save(templateData: BudgetState): this {
    this.storageAdapter.set(
      "budget_app_defaults",
      JSON.stringify(templateData)
    );
    return this;
  }

  public updateDebtBalance(itemId: string, amountChange: number): this {
    const template = this.get();
    if (!template) return this;

    for (const group of template.budgetGroups || []) {
      for (const item of group.budgetGroupItems || []) {
        if (item.id === itemId && item.type === "debt") {
          item.outstandingBalance =
            (item.outstandingBalance ?? 0) + amountChange;
          this.save(template);
          return this;
        }
      }
    }
    return this;
  }

  public updateDebtAssigned(itemId: string, value: string | number): this {
    const template = this.get();
    if (!template) return this;

    for (const group of template.budgetGroups || []) {
      for (const item of group.budgetGroupItems || []) {
        if (item.id === itemId && item.type === "debt") {
          item.assigned =
            typeof value === "number" ? value : parseFloat(value) || 0;
          this.save(template);
          return this;
        }
      }
    }
    return this;
  }

  public addDebtItem(debtData: {
    id: string;
    name: string;
    outstandingBalance: string | number;
    minimumPayment: string | number;
    debtType?: string;
    interestRate?: string | number;
  }): this {
    const template = this.get() || {
      startingSalary: 0,
      budgetGroups: [],
      transactions: [],
      paydayDay: 20,
      weekendBehavior: "preceding-friday",
    };
    template.budgetGroups = template.budgetGroups || [];

    let debtGroup = template.budgetGroups.find((g) => g.isDebtGroup);
    if (!debtGroup) {
      debtGroup = {
        name: "Debt",
        isDebtGroup: true,
        budgetGroupItems: [],
      };
      template.budgetGroups.push(debtGroup);
    }

    debtGroup.budgetGroupItems.push({
      id: debtData.id,
      name: debtData.name,
      assigned: 0,
      type: "debt",
      outstandingBalance:
        typeof debtData.outstandingBalance === "number"
          ? debtData.outstandingBalance
          : parseFloat(debtData.outstandingBalance) || 0,
      minimumPayment:
        typeof debtData.minimumPayment === "number"
          ? debtData.minimumPayment
          : parseFloat(debtData.minimumPayment) || 0,
      debtType: debtData.debtType || "other",
      interestRate: debtData.interestRate
        ? typeof debtData.interestRate === "number"
          ? debtData.interestRate
          : parseFloat(debtData.interestRate)
        : undefined,
    });

    this.save(template);
    return this;
  }

  public updateDebtItem(debtData: {
    itemId: string;
    name?: string;
    outstandingBalance?: string | number;
    minimumPayment?: string | number;
    debtType?: string;
    interestRate?: string | number;
  }): this {
    const template = this.get();
    if (!template) return this;

    for (const group of template.budgetGroups || []) {
      for (const item of group.budgetGroupItems || []) {
        if (item.id === debtData.itemId && item.type === "debt") {
          if (debtData.name !== undefined) item.name = debtData.name;
          if (debtData.outstandingBalance !== undefined) {
            item.outstandingBalance =
              typeof debtData.outstandingBalance === "number"
                ? debtData.outstandingBalance
                : parseFloat(debtData.outstandingBalance) || 0;
          }
          if (debtData.minimumPayment !== undefined) {
            item.minimumPayment =
              typeof debtData.minimumPayment === "number"
                ? debtData.minimumPayment
                : parseFloat(debtData.minimumPayment) || 0;
          }
          if (debtData.debtType !== undefined) {
            item.debtType = debtData.debtType;
          }
          if (debtData.interestRate !== undefined) {
            item.interestRate =
              typeof debtData.interestRate === "number"
                ? debtData.interestRate
                : parseFloat(debtData.interestRate) || undefined;
          }
          this.save(template);
          return this;
        }
      }
    }
    return this;
  }

  public updateSavingsBalance(itemId: string, amountChange: number): this {
    const template = this.get();
    if (!template) return this;

    for (const group of template.budgetGroups || []) {
      for (const item of group.budgetGroupItems || []) {
        if (item.id === itemId && item.type === "savings") {
          item.startingBalance = (item.startingBalance ?? 0) + amountChange;
          this.save(template);
          return this;
        }
      }
    }
    return this;
  }

  public addSavingsItem(savingsData: {
    id: string;
    name: string;
    goal: string | number;
    startingBalance: string | number;
  }): this {
    const template = this.get() || {
      startingSalary: 0,
      budgetGroups: [],
      transactions: [],
      paydayDay: 20,
      weekendBehavior: "preceding-friday",
    };
    template.budgetGroups = template.budgetGroups || [];

    let savingsGroup = template.budgetGroups.find(
      (g) => g.isSavingsGroup || g.name === "Savings"
    );
    if (!savingsGroup) {
      savingsGroup = {
        name: "Savings",
        isSavingsGroup: true,
        budgetGroupItems: [],
      };
      template.budgetGroups.push(savingsGroup);
    }

    savingsGroup.budgetGroupItems.push({
      id: savingsData.id,
      name: savingsData.name,
      assigned: 0,
      type: "savings",
      goal:
        typeof savingsData.goal === "number"
          ? savingsData.goal
          : parseFloat(savingsData.goal) || 0,
      startingBalance:
        typeof savingsData.startingBalance === "number"
          ? savingsData.startingBalance
          : parseFloat(savingsData.startingBalance) || 0,
    });

    this.save(template);
    return this;
  }

  public updateSavingsItem(savingsData: {
    itemId: string;
    name?: string;
    goal?: string | number;
    startingBalance?: string | number;
  }): this {
    const template = this.get();
    if (!template) return this;

    for (const group of template.budgetGroups || []) {
      for (const item of group.budgetGroupItems || []) {
        if (item.id === savingsData.itemId && item.type === "savings") {
          if (savingsData.name !== undefined) item.name = savingsData.name;
          if (savingsData.goal !== undefined) {
            item.goal =
              typeof savingsData.goal === "number"
                ? savingsData.goal
                : parseFloat(savingsData.goal) || 0;
          }
          if (savingsData.startingBalance !== undefined) {
            item.startingBalance =
              typeof savingsData.startingBalance === "number"
                ? savingsData.startingBalance
                : parseFloat(savingsData.startingBalance) || 0;
          }
          this.save(template);
          return this;
        }
      }
    }
    return this;
  }
}
