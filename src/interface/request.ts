import { ExpenseType } from './schema.js';

export type AddExpenseType = Omit<ExpenseType, 'created_by' | 'role'>;