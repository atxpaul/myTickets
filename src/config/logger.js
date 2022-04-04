import log4js from 'log4js';

log4js.configure({
    appenders: {
        console: { type: 'console' },
        fileErrors: { type: 'file', filename: 'logs/errors.log' },
        fileWarn: { type: 'file', filename: 'logs/warn.log' },
        loggerConsole: {
            type: 'logLevelFilter',
            appender: 'console',
            level: 'info',
        },
        loggerFileErrors: {
            type: 'logLevelFilter',
            appender: 'fileErrors',
            level: 'error',
        },
        loggerFileWarn: {
            type: 'logLevelFilter',
            appender: 'fileWarn',
            level: 'warn',
        },
    },
    categories: {
        default: {
            appenders: ['loggerConsole', 'loggerFileErrors', 'loggerFileWarn'],
            level: 'all',
        },
    },
});

let logger = log4js.getLogger();

export default logger;
