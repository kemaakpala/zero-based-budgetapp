import { generateUniqueId, formatBudgetItemAmount } from "../utils";

export const budgetReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_CYCLE":
      return action.payload;

    case "SET_STARTING_SALARY":
      return {
        ...state,
        startingSalary: action.payload,
      };

    case "UPDATE_FIELD": {
      const { groupIndex, itemIndex, fieldIndex, value } = action.payload;
      const updatedGroups = JSON.parse(JSON.stringify(state.budgetGroups));
      const field = updatedGroups[groupIndex].budgetGroupItems[itemIndex].fields[fieldIndex];

      if (
        field.label.toLowerCase() === "assigned" ||
        field.label.toLowerCase() === "planned"
      ) {
        field.value = formatBudgetItemAmount(value);
      } else {
        field.value = value;
      }

      return {
        ...state,
        budgetGroups: updatedGroups,
      };
    }

    case "ADD_ITEM": {
      const { groupIndex } = action.payload;
      const updatedGroups = JSON.parse(JSON.stringify(state.budgetGroups));
      const newItem = {
        id: generateUniqueId(),
        fields: [
          { label: "Name", value: "New Item", type: "text" },
          { label: "Assigned", value: "0.00", type: "text" },
        ],
        status: [{ label: "Remaining", value: "0.00", type: "text" }],
        type: "expense",
      };
      updatedGroups[groupIndex].budgetGroupItems.push(newItem);
      return {
        ...state,
        budgetGroups: updatedGroups,
      };
    }

    case "DELETE_ITEM": {
      const { groupIndex, itemIndex } = action.payload;
      const updatedGroups = JSON.parse(JSON.stringify(state.budgetGroups));
      const itemToDelete = updatedGroups[groupIndex].budgetGroupItems[itemIndex];
      updatedGroups[groupIndex].budgetGroupItems.splice(itemIndex, 1);

      // Clean up orphaned transactions
      const updatedTransactions = state.transactions.filter(
        (tx) => tx.budgetItemId !== itemToDelete.id
      );

      return {
        ...state,
        budgetGroups: updatedGroups,
        transactions: updatedTransactions,
      };
    }

    case "ADD_GROUP": {
      const { name } = action.payload;
      const updatedGroups = JSON.parse(JSON.stringify(state.budgetGroups));
      updatedGroups.push({
        name,
        columns: [{ name: "Assigned" }, { name: "Remaining" }],
        budgetGroupItems: [],
      });
      return {
        ...state,
        budgetGroups: updatedGroups,
      };
    }

    case "ADD_TRANSACTION": {
      const { name, amount, budgetItemId } = action.payload;
      const newTx = {
        id: generateUniqueId(),
        name: name.trim(),
        amount: parseFloat(amount) || 0,
        budgetItemId,
        date: new Date().toISOString(),
      };
      return {
        ...state,
        transactions: [...state.transactions, newTx],
      };
    }

    case "DELETE_TRANSACTION": {
      const txId = action.payload;
      return {
        ...state,
        transactions: state.transactions.filter((tx) => tx.id !== txId),
      };
    }

    case "DELETE_MULTIPLE_TRANSACTIONS": {
      const txIds = action.payload;
      return {
        ...state,
        transactions: state.transactions.filter((tx) => !txIds.includes(tx.id)),
      };
    }

    default:
      return state;
  }
};
