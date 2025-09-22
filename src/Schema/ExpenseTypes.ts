import { ExpenseTypes } from '@interface/schema.js';
import mongoose, { model, Model, Schema } from 'mongoose';

export type IExpenseModel = Model<ExpenseTypes>


const ExpenseTypesSchema = new Schema<ExpenseTypes, IExpenseModel>({
    created_by: {
        ref: 'User',
        type: mongoose.Types.ObjectId
    },
    description: {
        type: String,
    },
    name: {
        required: true,
        type: String,
        unique: true
    },
    role: {
        default: 'user',
        enum: ['log_user', 'user', 'super_admin'],
        required: true,
        type: String
    }
}, { timestamps: true });

const ExpenseTypeTable = model<ExpenseTypes, IExpenseModel>('Expense Types', ExpenseTypesSchema);


export default ExpenseTypeTable;


