/**
 * Simple structured logger for serverless functions
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  [key: string]: any;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLogLevel: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) || 'info';

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLogLevel];
}

function log(level: LogLevel, message: string, meta?: Record<string, any>) {
  if (!shouldLog(level)) return;

  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };

  // In production, output JSON for better log parsing
  if (process.env.NODE_ENV === 'production') {
    console.log(JSON.stringify(entry));
  } else {
    // In development, use readable format
    const emoji = {
      debug: '🔍',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
    }[level];

    console.log(`${emoji} [${level.toUpperCase()}] ${message}`, meta || '');
  }
}

export const logger = {
  debug(message: string, meta?: Record<string, any>) {
    log('debug', message, meta);
  },

  info(message: string, meta?: Record<string, any>) {
    log('info', message, meta);
  },

  warn(message: string, meta?: Record<string, any>) {
    log('warn', message, meta);
  },

  error(message: string, error?: Error | Record<string, any>) {
    const meta =
      error instanceof Error
        ? {
            error: error.message,
            stack: error.stack,
          }
        : error;

    log('error', message, meta);
  },
};
