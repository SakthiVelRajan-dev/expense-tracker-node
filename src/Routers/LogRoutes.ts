import { getLogData, logType, SortOrder } from '@Config/logger.js';
import express from 'express';

const logRouter = express.Router();

logRouter.get('/app', async (req, res) => {
    const logType = req.query.type as logType;

    /* in milliseconds */
    const from = +(req.query.from as string);
    const to = +(req.query.to as string);
    const limit = +(req.query.limit as string);
    const order = req.query.order as SortOrder;
    const start = +(req.query.start as string);


    const log = await getLogData(logType, 'app', {
        from: new Date(from),
        limit,
        order,
        start,
        to: new Date(to)
    });
    res.status(200).json(JSON.parse(JSON.stringify(log)));
});

logRouter.get('/custom', async (req, res) => {
    const logType = req.query.type as logType;
    
    /* in milliseconds */
    const from = +(req.query.from as string);
    const to = +(req.query.to as string);
    const limit = +(req.query.limit as string);
    const order = req.query.order as SortOrder;
    const start = +(req.query.start as string);
     
    const log = await getLogData(logType, 'custom', {
        from: new Date(from),
        limit,
        order,
        start,
        to: new Date(to)
    });
    res.status(200).json(JSON.parse(JSON.stringify(log)));
});

logRouter.get('/error', async (req, res) => {
    const logType = req.query.type as logType;
    
    /* in milliseconds */
    const from = +(req.query.from as string);
    const to = +(req.query.to as string);
    const limit = +(req.query.limit as string);
    const order = req.query.order as SortOrder;
    const start = +(req.query.start as string);
     
    const log = await getLogData(logType, 'error', {
        from: new Date(from),
        limit,
        order,
        start,
        to: new Date(to)
    });
    res.status(200).json(JSON.parse(JSON.stringify(log)));
});

export default logRouter;
