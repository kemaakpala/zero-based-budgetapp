export class BudgetTemplate {
  constructor(storageAdapter) {
    this.storageAdapter = storageAdapter;
  }

  get() {
    const raw = this.storageAdapter.get("budget_app_defaults");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("Error parsing default budget template", e);
      return null;
    }
  }

  save(templateData) {
    this.storageAdapter.set(
      "budget_app_defaults",
      JSON.stringify(templateData)
    );
    return this;
  }

  updateDebtBalance(itemId, amountChange) {
    const template = this.get();
    if (!template) return this;

    for (const group of template.budgetGroups || []) {
      for (const item of group.budgetGroupItems || []) {
        if (item.id === itemId && item.type === "debt") {
          item.outstandingBalance =
            (parseFloat(item.outstandingBalance) || 0) + amountChange;
          this.save(template);
          return this;
        }
      }
    }
    return this;
  }

  updateDebtAssigned(itemId, value) {
    const template = this.get();
    if (!template) return this;

    for (const group of template.budgetGroups || []) {
      for (const item of group.budgetGroupItems || []) {
        if (item.id === itemId && item.type === "debt") {
          item.assigned = parseFloat(value) || 0;
          this.save(template);
          return this;
        }
      }
    }
    return this;
  }

  addDebtItem(debtData) {
    const template = this.get() || { budgetGroups: [] };
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
      outstandingBalance: parseFloat(debtData.outstandingBalance) || 0,
      minimumPayment: parseFloat(debtData.minimumPayment) || 0,
      debtType: debtData.debtType || "other",
      interestRate: debtData.interestRate
        ? parseFloat(debtData.interestRate)
        : undefined,
    });

    this.save(template);
    return this;
  }

  updateDebtItem(debtData) {
    const template = this.get();
    if (!template) return this;

    for (const group of template.budgetGroups || []) {
      for (const item of group.budgetGroupItems || []) {
        if (item.id === debtData.itemId && item.type === "debt") {
          if (debtData.name !== undefined) item.name = debtData.name;
          if (debtData.outstandingBalance !== undefined)
            item.outstandingBalance =
              parseFloat(debtData.outstandingBalance) || 0;
          if (debtData.minimumPayment !== undefined)
            item.minimumPayment = parseFloat(debtData.minimumPayment) || 0;
          if (debtData.debtType !== undefined)
            item.debtType = debtData.debtType;
          if (debtData.interestRate !== undefined)
            item.interestRate = parseFloat(debtData.interestRate) || undefined;
          this.save(template);
          return this;
        }
      }
    }
    return this;
  }

  updateSavingsBalance(itemId, amountChange) {
    const template = this.get();
    if (!template) return this;

    for (const group of template.budgetGroups || []) {
      for (const item of group.budgetGroupItems || []) {
        if (item.id === itemId && item.type === "savings") {
          item.startingBalance =
            (parseFloat(item.startingBalance) || 0) + amountChange;
          this.save(template);
          return this;
        }
      }
    }
    return this;
  }

  addSavingsItem(savingsData) {
    const template = this.get() || { budgetGroups: [] };
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
      goal: parseFloat(savingsData.goal) || 0,
      startingBalance: parseFloat(savingsData.startingBalance) || 0,
    });

    this.save(template);
    return this;
  }

  updateSavingsItem(savingsData) {
    const template = this.get();
    if (!template) return this;

    for (const group of template.budgetGroups || []) {
      for (const item of group.budgetGroupItems || []) {
        if (item.id === savingsData.itemId && item.type === "savings") {
          if (savingsData.name !== undefined) item.name = savingsData.name;
          if (savingsData.goal !== undefined)
            item.goal = parseFloat(savingsData.goal) || 0;
          if (savingsData.startingBalance !== undefined)
            item.startingBalance = parseFloat(savingsData.startingBalance) || 0;
          this.save(template);
          return this;
        }
      }
    }
    return this;
  }
}
