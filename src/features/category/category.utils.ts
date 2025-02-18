import {
  BankAccount,
  Category,
  CategoryGroup,
  Item,
  Transaction,
  User,
} from "@prisma/client";
import {
  NEEDS_CATEGORIES,
  SAVINGS_CATEGORIES,
  WANTS_CATEGORIES,
} from "./category.constant";

type UserTransactions = User & {
  items: ItemWithBankAccounts[];
};

type ItemWithBankAccounts = Item & {
  bankAccounts: BankAccountWithTransactions[];
};

type BankAccountWithTransactions = BankAccount & {
  transactions: TransactionWithCategory[];
};

type TransactionWithCategory = Transaction & {
  category: Category & { categoryGroup: CategoryGroup };
};

function categorizeTransaction(
  transaction: TransactionWithCategory
): string | undefined {
  const categoryGroupName = transaction.category.categoryGroup.name;

  if (NEEDS_CATEGORIES.includes(categoryGroupName)) return "needs";
  if (SAVINGS_CATEGORIES.includes(categoryGroupName)) return "savings";
  if (WANTS_CATEGORIES.includes(categoryGroupName)) return "wants";
}

function calculateTotalExpenses(
  transactions: TransactionWithCategory[]
): number {
  return Math.abs(
    transactions.reduce((total, transaction) => total + transaction.amount, 0)
  );
}

export function categorizeBudget(userTransactions: UserTransactions) {
  const budget: Record<string, TransactionWithCategory[]> = {
    needs: [],
    wants: [],
    savings: [],
  };

  userTransactions.items.forEach((item) =>
    item.bankAccounts.forEach((bankAccount) =>
      bankAccount.transactions.forEach((transaction) => {
        const category = categorizeTransaction(transaction);
        if (category) budget[category].push(transaction);
      })
    )
  );

  const needsExpenses = +calculateTotalExpenses(budget.needs).toFixed(2);
  const wantsExpenses = +calculateTotalExpenses(budget.wants).toFixed(2);
  const savingsExpenses = +calculateTotalExpenses(budget.savings).toFixed(2);

  return { needsExpenses, wantsExpenses, savingsExpenses };
}
