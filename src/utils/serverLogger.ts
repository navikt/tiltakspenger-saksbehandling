import pino, { LoggerOptions } from 'pino';
import redactPaths from './redactPaths';

const loggerOptions: LoggerOptions = {
    redact: {
        paths: redactPaths,
        remove: true,
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
        level: (label) => {
            return { level: label };
        },
        log: (object: any) => {
            if (object.err) {
                const err = object.err instanceof Error ? pino.stdSerializers.err(object.err) : object.err;
                object.stack_trace = err.stack;
                object.type = err.type;
                object.message = err.message;
                delete object.err;
            }

            return object;
        },
    },
};

const serverLogger = pino(loggerOptions);

export default serverLogger;
