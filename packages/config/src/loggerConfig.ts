import winston from 'winston';
import 'winston-mongodb';
import { LOG_DB_URL } from './constant';

const allowedTransports: winston.transport[] = [];

allowedTransports.push(
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf((log) => `${log.timestamp} [${log.level}]: ${log.message}`)
        )
    })
);

if (LOG_DB_URL) {
    allowedTransports.push(
        new winston.transports.MongoDB({
            level: 'error',
            db: LOG_DB_URL,
            collection: 'code_pulse_logs',
            options: { useUnifiedTopology: true },
        })
    );
}

allowedTransports.push(
    new winston.transports.File({ filename: 'logs/app.log' })
);

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf((log) => `${log.timestamp} [${log.level.toUpperCase()}]: ${log.message}`)
    ),
    transports: allowedTransports,
});

export default logger;