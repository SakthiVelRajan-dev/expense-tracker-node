 
import { createLogger, format, transports  } from 'winston';

export interface LogQueryOptions {
    from?: Date;
    limit?: number;
    order?: SortOrder
    start?: number;
    to?: Date;
}

export type logType ='debug' | 'error' | 'info' | 'warn';

export type SortOrder = 'asc' | 'desc';

type fileName = 'app' | 'cron-error' | 'custom' | 'error';

export const getLogger = (type: logType, filename: fileName) => {
    const logger = createLogger({
        exceptionHandlers: [
            new transports.File({ dirname: './src/logs', filename: 'exceptions.log', tailable: true}),
        ],
        format: format.combine(
            format.metadata({ fillExcept: ['message', 'level', 'timestamp'],  key: 'data' }), // Extract metadata
            format.timestamp(),
            format.json()),
        level: type,
        rejectionHandlers: [
                new transports.File({ dirname: './src/logs', filename: 'rejections.log', tailable: true}),
            ],
        transports: [
            new transports.Console(),
            new transports.File({
                dirname: './src/logs',
                filename: `${filename}.log`,
                tailable: true
            })
        ],
    });
    return logger;
}

export const addLogger = (type: logType, filename: fileName, message: string, data: unknown) => {
    const logger = getLogger(type, filename);
    logger.log(type, message, data);
}

export const getLogData = async (type: logType, filename: fileName, queryOptions: LogQueryOptions = {
    from: new Date((+new Date()) - (24 * 60 * 60 * 1000)),
    limit: 10,
    order: 'desc',
    start: 0,
    to: new Date()
}) => {
    const logger = getLogger(type, filename);
    const result = await new Promise((resolve, reject) => {
      logger.query({
        fields: ['message', 'timestamp', 'data'],
        from: queryOptions.from,
        limit: queryOptions.limit,
        order: queryOptions.order,
        start: queryOptions.start,
        until: queryOptions.to
    }, (err, result) => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
    return result;
}