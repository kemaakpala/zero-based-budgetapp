export interface BudgetItem {
  id: string;
  name: string;
  assigned: number;
  type: "expense" | "debt" | "savings";
  outstandingBalance?: number;
  minimumPayment?: number;
  debtType?: string;
  interestRate?: number;
  goal?: number;
  startingBalance?: number;
}

export interface BudgetGroup {
  name: string;
  isDebtGroup?: boolean;
  isSavingsGroup?: boolean;
  columns?: { name: string }[];
  budgetGroupItems: BudgetItem[];
}

export interface Transaction {
  id: string;
  payee: string;
  amount: number;
  budgetItemId: string;
  date: string;
}

export interface Income {
  id: string;
  name: string;
  amount: number;
  received: boolean;
}

export interface BudgetState {
  startingSalary: number;
  budgetGroups: BudgetGroup[];
  transactions: Transaction[];
  paydayDay: number;
  weekendBehavior: "preceding-friday" | "following-monday" | "exact";
  incomes?: Income[];
}

export type BudgetAction =
  | { type: "LOAD_CYCLE"; payload: BudgetState }
  | {
      type: "ADD_INCOME";
      payload: { name?: string; amount?: string | number; received?: boolean };
    }
  | { type: "DELETE_INCOME"; payload: { incomeId: string } }
  | {
      type: "UPDATE_INCOME_FIELD";
      payload: { incomeId: string; fieldName: string; value: unknown };
    }
  | {
      type: "UPDATE_ITEM_FIELD";
      payload: { itemId: string; fieldName: string; value: unknown };
    }
  | { type: "ADD_ITEM"; payload: { groupIndex: number } }
  | { type: "DELETE_ITEM"; payload: string }
  | { type: "ADD_GROUP"; payload: { name: string } }
  | { type: "DELETE_GROUP"; payload: { groupIndex: number } }
  | { type: "RENAME_GROUP"; payload: { groupIndex: number; newName: string } }
  | {
      type: "MOVE_GROUP";
      payload: { groupIndex: number; direction: "up" | "down" };
    }
  | { type: "SWAP_GROUPS"; payload: { index1: number; index2: number } }
  | {
      type: "ADD_TRANSACTION";
      payload: { payee: string; amount: string | number; budgetItemId: string };
    }
  | { type: "DELETE_TRANSACTION"; payload: string }
  | { type: "DELETE_MULTIPLE_TRANSACTIONS"; payload: string[] }
  | { type: "ADD_DEBT_REPAYMENT_GROUP" }
  | {
      type: "ADD_DEBT_ITEM";
      payload: {
        id?: string;
        name: string;
        outstandingBalance: string | number;
        minimumPayment: string | number;
        debtType?: string;
        interestRate?: string | number;
      };
    }
  | {
      type: "UPDATE_DEBT_ITEM";
      payload: {
        itemId: string;
        name?: string;
        outstandingBalance?: string | number;
        minimumPayment?: string | number;
        debtType?: string;
        interestRate?: string | number;
      };
    }
  | { type: "ADD_SAVINGS_GROUP" }
  | {
      type: "ADD_SAVINGS_ITEM";
      payload: {
        id?: string;
        name: string;
        goal: string | number;
        startingBalance: string | number;
      };
    }
  | {
      type: "UPDATE_SAVINGS_ITEM";
      payload: {
        itemId: string;
        name?: string;
        goal?: string | number;
        startingBalance?: string | number;
      };
    };
