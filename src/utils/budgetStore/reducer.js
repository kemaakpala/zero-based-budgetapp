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

    case "UPDATE_ITEM_FIELD": {
      const { itemId, fieldName, value } = action.payload;
      const updatedGroups = JSON.parse(JSON.stringify(state.budgetGroups));

      let found = false;
      for (const group of updatedGroups) {
        for (const item of group.budgetGroupItems) {
          if (item.id === itemId) {
            if (fieldName === "assigned") {
              item.assigned = parseFloat(formatBudgetItemAmount(value)) || 0;
            } else {
              item[fieldName] = value;
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
      const updatedGroups = JSON.parse(JSON.stringify(state.budgetGroups));
      const newItem = {
        id: generateUniqueId(),
        name: "New Item",
        assigned: 0,
        type: "expense",
      };
      updatedGroups[groupIndex].budgetGroupItems.push(newItem);
      return {
        ...state,
        budgetGroups: updatedGroups,
      };
    }

    case "DELETE_ITEM": {
      const itemId = action.payload;
      const updatedGroups = JSON.parse(JSON.stringify(state.budgetGroups));

      let itemToDelete = null;
      for (const group of updatedGroups) {
        const index = group.budgetGroupItems.findIndex(
          (item) => item.id === itemId
        );
        if (index !== -1) {
          itemToDelete = group.budgetGroupItems[index];
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

    case "DELETE_GROUP": {
      const { groupIndex } = action.payload;
      const updatedGroups = JSON.parse(JSON.stringify(state.budgetGroups));

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
      const updatedGroups = JSON.parse(JSON.stringify(state.budgetGroups));
      if (updatedGroups[groupIndex]) {
        updatedGroups[groupIndex].name = newName.trim();
      }
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
