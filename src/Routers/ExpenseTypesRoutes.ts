import { AddExpenseType } from '@interface/request.js';
import { ExpenseType } from '@interface/schema.js';
import ExpenseTypeTable from '@Schema/ExpenseTypes.js';
import express from 'express';

const expenseTypeRouter = express.Router();

expenseTypeRouter.get('/', async (req, res) => {
    const offset = +(req.query.offset ?? '0');
    const limit = +(req.query.limit ?? '0');
    const expenseTypes = ExpenseTypeTable.find().select('name description _id').lean();
    if (offset) {
        expenseTypes.skip(offset);
    }
    if (limit) {
        expenseTypes.limit(limit);
    }
    const result = await expenseTypes.exec();
    res.status(200).send({
        data: result,
        message: 'Expense types list fetched successfully'
    });
});

expenseTypeRouter.post('/add', async (req, res) => {
    const tokenDetail = req.session.tokenDetail;
    if (!tokenDetail) {
        return res.status(401).send('Invalid session');
    }
    const body = req.body as AddExpenseType;
    const name= body.name;
    const description = (body.description ?? '');
    if (!name) {
        return res.status(400).send({
            message: 'Invalid request'
        })
    }
    const payload = {  created_by: tokenDetail.id, description, name, role: tokenDetail.role } as unknown as ExpenseType;
    await ExpenseTypeTable.insertOne(payload);
    res.status(201).send({
        message: 'Expense type added successfully'
    })
});

expenseTypeRouter.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const tokenDetail = req.session.tokenDetail;
    if (!id) {
        return res.status(400).send({
            message: 'Invalid request'
        });
    }
    if (tokenDetail?.role !== 'super_admin') {
        const selectedItem = await ExpenseTypeTable.findById(id).populate('created_by').exec();
        if (!selectedItem?.created_by?._id.equals(tokenDetail?.id)) {
            return res.status(401).send({
                message: 'Unauthoized access'
            })
        }
    }
    const response = await ExpenseTypeTable.findByIdAndDelete(id);
    if (response) {
        res.status(200).send({
            message: 'Expense type deleted successfully'
        });
    } else {
        res.status(500).send({
            message: 'Something went wrong!'
        })
    }
})

export default expenseTypeRouter;