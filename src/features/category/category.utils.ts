import { BankAccount, Category, Item, Transaction, User } from "@prisma/client";
import {
  INCOME_BRACKETS,
  NEEDS_CATEGORIES,
  SAVINGS_CATEGORIES,
  WANTS_CATEGORIES,
} from "./category.constant";

export type UserTransactions = User & {
  items: ItemWithBankAccounts[];
};

type ItemWithBankAccounts = Item & {
  bankAccounts: BankAccountWithTransactions[];
};

type BankAccountWithTransactions = BankAccount & {
  transactions: TransactionWithCategory[];
};

type TransactionWithCategory = Transaction & {
  category: Category;
};

function categorizeTransaction(
  transaction: TransactionWithCategory
): string | undefined {
  const category = transaction.category.name;

  if (NEEDS_CATEGORIES.includes(category)) return "needs";
  if (SAVINGS_CATEGORIES.includes(category)) return "savings";
  if (WANTS_CATEGORIES.includes(category)) return "wants";
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
        if (!transaction.category || transaction.amount > 0) return;
        const category = categorizeTransaction(transaction);
        if (category) budget[category].push(transaction);
      })
    )
  );

  const needsTotal = +calculateTotalExpenses(budget.needs).toFixed(2);
  const wantsTotal = +calculateTotalExpenses(budget.wants).toFixed(2);
  const savingsTotal = +calculateTotalExpenses(budget.savings).toFixed(2);

  const needs = { expenses: budget.needs, total: needsTotal };
  const wants = { expenses: budget.wants, total: wantsTotal };
  const savings = { expenses: budget.savings, total: savingsTotal };

  return { needs, wants, savings };
}

export function mergeExpenses(expenses: TransactionWithCategory[]) {
  const totalExpenses: Record<string, number> = {};

  expenses.forEach((expense) => {
    const { clean_description, amount } = expense;
    if (totalExpenses[clean_description]) {
      totalExpenses[clean_description] += amount;
    } else {
      totalExpenses[clean_description] = amount;
    }
  });

  const result = Object.entries(totalExpenses)
    .map(([description, total]) => ({
      clean_description: description,
      amount: total,
    }))
    .sort((a, b) => a.amount - b.amount);

  return result;
}

export function getIncomeTransactions(userTransactions: UserTransactions) {
  return userTransactions.items.flatMap((item) =>
    item.bankAccounts.flatMap((bankAccount) =>
      bankAccount.transactions.filter(
        (transaction) => transaction.category?.name === "Revenus"
      )
    )
  );
}

export function getIncomeValue(incomes: TransactionWithCategory[]) {
  return incomes
    .reduce(
      (accumulator, currentValue) => accumulator + (currentValue.amount || 0),
      0
    )
    .toFixed(2);
}

export function getBudgetPlan(income: number) {
  const bracket =
    INCOME_BRACKETS.find((b) => income <= b.max) ||
    INCOME_BRACKETS[INCOME_BRACKETS.length - 1];

  const plan = {
    needs: Math.round((bracket.needs / 100) * income),
    wants: Math.round((bracket.wants / 100) * income),
    savings: Math.round((bracket.savings / 100) * income),
  };

  return { bracket, plan };
}
