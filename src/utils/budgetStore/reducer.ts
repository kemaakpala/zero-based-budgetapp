import { generateUniqueId, formatBudgetItemAmount } from "../utils";
import type {
  BudgetState,
  BudgetAction,
  BudgetGroup,
  Income,
  BudgetItem,
} from "./types";

const updateDebtItemBalance = (
  budgetGroups: BudgetGroup[],
  itemId: string,
  amountChange: number
): void => {
  for (const group of budgetGroups) {
    for (const item of group.budgetGroupItems) {
      if (item.id === itemId && item.type === "debt") {
        item.outstandingBalance = (item.outstandingBalance ?? 0) + amountChange;
        return;
      }
    }
  }
};

export const budgetReducer = (
  state: BudgetState,
  action: BudgetAction
): BudgetState => {
  switch (action.type) {
    case "LOAD_CYCLE":
      return action.payload;

    case "ADD_INCOME": {
      const { name, amount, received } = action.payload;
      return {
        ...state,
        incomes: [
          ...(state.incomes || []),
          {
            id: generateUniqueId(),
            name: (name || "New Income").trim(),
            amount:
              typeof amount === "number"
                ? amount
                : parseFloat(amount || "") || 0,
            received: !!received,
          },
        ],
      };
    }

    case "DELETE_INCOME": {
      const { incomeId } = action.payload;
      return {
        ...state,
        incomes: (state.incomes || []).filter((i) => i.id !== incomeId),
      };
    }

    case "UPDATE_INCOME_FIELD": {
      const { incomeId, fieldName, value } = action.payload;
      return {
        ...state,
        incomes: (state.incomes || []).map((inc) => {
          if (inc.id === incomeId) {
            const parsed =
              fieldName === "amount"
                ? typeof value === "number"
                  ? value
                  : parseFloat(value as string) || 0
                : value;
            return { ...inc, [fieldName]: parsed } as Income;
          }
          return inc;
        }),
      };
    }

    case "UPDATE_ITEM_FIELD": {
      const { itemId, fieldName, value } = action.payload;
      const updatedGroups: BudgetGroup[] = JSON.parse(
        JSON.stringify(state.budgetGroups)
      );

      let found = false;
      for (const group of updatedGroups) {
        for (const item of group.budgetGroupItems) {
          if (item.id === itemId) {
            if (fieldName === "assigned") {
              item.assigned =
                parseFloat(formatBudgetItemAmount(value as string | number)) ||
                0;
            } else {
              (item as unknown as Record<string, unknown>)[
                fieldName as string
              ] = value;
            }
            found = true;
            break;
          }
        }
        if (found) break;
      }

      return {
        ...state,
        budgetGroups: updatedGroups,
      };
    }

    case "ADD_ITEM": {
      const { groupIndex } = action.payload;
      const updatedGroups: BudgetGroup[] = JSON.parse(
        JSON.stringify(state.budgetGroups)
      );
      const newItem = {
        id: generateUniqueId(),
        name: "New Item",
        assigned: 0,
        type: "expense" as const,
      };
      updatedGroups[groupIndex]!.budgetGroupItems.push(newItem);
      return {
        ...state,
        budgetGroups: updatedGroups,
      };
    }

    case "DELETE_ITEM": {
      const itemId = action.payload;
      const updatedGroups: BudgetGroup[] = JSON.parse(
        JSON.stringify(state.budgetGroups)
      );

      let itemToDelete: BudgetItem | null = null;
      for (const group of updatedGroups) {
        const index = group.budgetGroupItems.findIndex(
          (item) => item.id === itemId
        );
        if (index !== -1) {
          itemToDelete = group.budgetGroupItems[index] ?? null;
          group.budgetGroupItems.splice(index, 1);
          break;
        }
      }

      // Clean up orphaned transactions
      const updatedTransactions = itemToDelete
        ? state.transactions.filter((tx) => tx.budgetItemId !== itemToDelete.id)
        : state.transactions;

      return {
        ...state,
        budgetGroups: updatedGroups,
        transactions: updatedTransactions,
      };
    }

    case "ADD_GROUP": {
      const { name } = action.payload;
      const updatedGroups: BudgetGroup[] = JSON.parse(
        JSON.stringify(state.budgetGroups)
      );
      updatedGroups.push({
        name,
        budgetGroupItems: [],
      });
      return {
        ...state,
        budgetGroups: updatedGroups,
      };
    }

    case "DELETE_GROUP": {
      const { groupIndex } = action.payload;
      const updatedGroups: BudgetGroup[] = JSON.parse(
        JSON.stringify(state.budgetGroups)
      );

      const itemsInDeletedGroup =
        updatedGroups[groupIndex]?.budgetGroupItems || [];
      const deletedItemIds = itemsInDeletedGroup.map((item) => item.id);

      updatedGroups.splice(groupIndex, 1);

      const updatedTransactions = state.transactions.filter(
        (tx) => !deletedItemIds.includes(tx.budgetItemId)
      );

      return {
        ...state,
        budgetGroups: updatedGroups,
        transactions: updatedTransactions,
      };
    }

    case "RENAME_GROUP": {
      const { groupIndex, newName } = action.payload;
      const updatedGroups: BudgetGroup[] = JSON.parse(
        JSON.stringify(state.budgetGroups)
      );
      if (updatedGroups[groupIndex]) {
        updatedGroups[groupIndex].name = newName.trim();
      }
      return {
        ...state,
        budgetGroups: updatedGroups,
      };
    }

    case "MOVE_GROUP": {
      const { groupIndex, direction } = action.payload;
      const updatedGroups: BudgetGroup[] = JSON.parse(
        JSON.stringify(state.budgetGroups)
      );
      const targetIndex = direction === "up" ? groupIndex - 1 : groupIndex + 1;
      if (targetIndex >= 0 && targetIndex < updatedGroups.length) {
        const temp = updatedGroups[groupIndex]!;
        updatedGroups[groupIndex] = updatedGroups[targetIndex]!;
        updatedGroups[targetIndex] = temp;
      }
      return {
        ...state,
        budgetGroups: updatedGroups,
      };
    }

    case "SWAP_GROUPS": {
      const { index1, index2 } = action.payload;
      const updatedGroups: BudgetGroup[] = JSON.parse(
        JSON.stringify(state.budgetGroups)
      );
      if (
        index1 >= 0 &&
        index1 < updatedGroups.length &&
        index2 >= 0 &&
        index2 < updatedGroups.length
      ) {
        const temp = updatedGroups[index1]!;
        updatedGroups[index1] = updatedGroups[index2]!;
        updatedGroups[index2] = temp;
      }
      return {
        ...state,
        budgetGroups: updatedGroups,
      };
    }

    case "ADD_TRANSACTION": {
      const { payee, amount, budgetItemId } = action.payload;
      const newTx = {
        id: generateUniqueId(),
        payee: payee.trim(),
        amount: typeof amount === "number" ? amount : parseFloat(amount) || 0,
        budgetItemId,
        date: new Date().toISOString(),
      };

      const updatedGroups: BudgetGroup[] = JSON.parse(
        JSON.stringify(state.budgetGroups)
      );
      updateDebtItemBalance(
        updatedGroups,
        budgetItemId,
        -(typeof amount === "number" ? amount : parseFloat(amount) || 0)
      );

      return {
        ...state,
        budgetGroups: updatedGroups,
        transactions: [...state.transactions, newTx],
      };
    }

    case "DELETE_TRANSACTION": {
      const txId = action.payload;
      const tx = state.transactions.find((t) => t.id === txId);

      const updatedGroups: BudgetGroup[] = JSON.parse(
        JSON.stringify(state.budgetGroups)
      );
      if (tx) {
        updateDebtItemBalance(updatedGroups, tx.budgetItemId, tx.amount);
      }

      return {
        ...state,
        budgetGroups: updatedGroups,
        transactions: state.transactions.filter((tx) => tx.id !== txId),
      };
    }

    case "DELETE_MULTIPLE_TRANSACTIONS": {
      const txIds = action.payload;
      const txs = state.transactions.filter((t) => txIds.includes(t.id));

      const updatedGroups: BudgetGroup[] = JSON.parse(
        JSON.stringify(state.budgetGroups)
      );
      for (const tx of txs) {
        updateDebtItemBalance(updatedGroups, tx.budgetItemId, tx.amount);
      }

      return {
        ...state,
        budgetGroups: updatedGroups,
        transactions: state.transactions.filter((tx) => !txIds.includes(tx.id)),
      };
    }

    case "ADD_DEBT_REPAYMENT_GROUP": {
      const alreadyExists = state.budgetGroups.some((g) => g.isDebtGroup);
      if (alreadyExists) return state;

      const updatedGroups: BudgetGroup[] = JSON.parse(
        JSON.stringify(state.budgetGroups)
      );
      updatedGroups.push({
        name: "Debt",
        isDebtGroup: true,
        budgetGroupItems: [],
      });
      return {
        ...state,
        budgetGroups: updatedGroups,
      };
    }

    case "ADD_DEBT_ITEM": {
      const {
        id,
        name,
        outstandingBalance,
        minimumPayment,
        debtType,
        interestRate,
      } = action.payload;
      const updatedGroups: BudgetGroup[] = JSON.parse(
        JSON.stringify(state.budgetGroups)
      );
      const debtGroup = updatedGroups.find((g) => g.isDebtGroup);
      if (!debtGroup) return state;

      const newDebtItem = {
        id: id || generateUniqueId(),
        name,
        assigned: 0,
        type: "debt" as const,
        outstandingBalance:
          typeof outstandingBalance === "number"
            ? outstandingBalance
            : parseFloat(outstandingBalance) || 0,
        minimumPayment:
          typeof minimumPayment === "number"
            ? minimumPayment
            : parseFloat(minimumPayment) || 0,
        debtType: debtType || "other",
        interestRate: interestRate
          ? typeof interestRate === "number"
            ? interestRate
            : parseFloat(interestRate)
          : undefined,
      };
      debtGroup.budgetGroupItems.push(newDebtItem);

      return {
        ...state,
        budgetGroups: updatedGroups,
      };
    }

    case "UPDATE_DEBT_ITEM": {
      const {
        itemId,
        name: debtName,
        outstandingBalance: newBalance,
        minimumPayment: newMinPayment,
        debtType: newDebtType,
        interestRate: newInterestRate,
      } = action.payload;
      const updatedGroups: BudgetGroup[] = JSON.parse(
        JSON.stringify(state.budgetGroups)
      );

      for (const group of updatedGroups) {
        for (const item of group.budgetGroupItems) {
          if (item.id === itemId && item.type === "debt") {
            if (debtName !== undefined) item.name = debtName;
            if (newBalance !== undefined) {
              item.outstandingBalance =
                typeof newBalance === "number"
                  ? newBalance
                  : parseFloat(newBalance) || 0;
            }
            if (newMinPayment !== undefined) {
              item.minimumPayment =
                typeof newMinPayment === "number"
                  ? newMinPayment
                  : parseFloat(newMinPayment) || 0;
            }
            if (newDebtType !== undefined) item.debtType = newDebtType;
            if (newInterestRate !== undefined) {
              item.interestRate =
                typeof newInterestRate === "number"
                  ? newInterestRate
                  : parseFloat(newInterestRate) || undefined;
            }
            break;
          }
        }
      }
      return {
        ...state,
        budgetGroups: updatedGroups,
      };
    }

    case "ADD_SAVINGS_GROUP": {
      const alreadyExists = state.budgetGroups.some((g) => g.isSavingsGroup);
      if (alreadyExists) return state;

      const updatedGroups: BudgetGroup[] = JSON.parse(
        JSON.stringify(state.budgetGroups)
      );
      updatedGroups.push({
        name: "Savings",
        isSavingsGroup: true,
        budgetGroupItems: [],
      });
      return {
        ...state,
        budgetGroups: updatedGroups,
      };
    }

    case "ADD_SAVINGS_ITEM": {
      const { id, name, goal, startingBalance } = action.payload;
      const updatedGroups: BudgetGroup[] = JSON.parse(
        JSON.stringify(state.budgetGroups)
      );
      const savingsGroup = updatedGroups.find(
        (g) => g.isSavingsGroup || g.name === "Savings"
      );
      if (!savingsGroup) return state;

      const newSavingsItem = {
        id: id || generateUniqueId(),
        name,
        assigned: 0,
        type: "savings" as const,
        goal: typeof goal === "number" ? goal : parseFloat(goal) || 0,
        startingBalance:
          typeof startingBalance === "number"
            ? startingBalance
            : parseFloat(startingBalance) || 0,
      };
      savingsGroup.budgetGroupItems.push(newSavingsItem);
      return {
        ...state,
        budgetGroups: updatedGroups,
      };
    }

    case "UPDATE_SAVINGS_ITEM": {
      const { itemId, name, goal, startingBalance } = action.payload;
      const updatedGroups: BudgetGroup[] = JSON.parse(
        JSON.stringify(state.budgetGroups)
      );

      for (const group of updatedGroups) {
        for (const item of group.budgetGroupItems) {
          if (item.id === itemId && item.type === "savings") {
            if (name !== undefined) item.name = name;
            if (goal !== undefined) {
              item.goal =
                typeof goal === "number" ? goal : parseFloat(goal) || 0;
            }
            if (startingBalance !== undefined) {
              item.startingBalance =
                typeof startingBalance === "number"
                  ? startingBalance
                  : parseFloat(startingBalance) || 0;
            }
            break;
          }
        }
      }
      return {
        ...state,
        budgetGroups: updatedGroups,
      };
    }

    default:
      return state;
  }
};
