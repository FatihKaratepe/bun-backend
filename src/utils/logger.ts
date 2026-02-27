import fs from 'fs';
import path from 'path';

interface Theme {
  id: string;
  datetime: string;
  message: string;
  level: string;
}

interface LogOptions {
  id?: string;
  path?: string;
  colors?: Theme;
  toStdout?: boolean;
  dayBasedFileLog?: boolean;
  dateFormat?: string;
}

interface Logger {
  (...args: any[]): void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  debug: (...args: any[]) => void;
  success: (...args: any[]) => void;
  id: (newId: string) => Logger;
}

const tzOffset = new Date().getTimezoneOffset() * 60000;

const COLORS = Object.freeze({
  reset: '\u001b[0m',
  gray: '\u001b[90m',
  red: '\u001b[31m',
  green: '\u001b[32m',
  yellow: '\u001b[33m',
  blue: '\u001b[34m',
  magenta: '\u001b[35m',
  cyan: '\u001b[36m',
  white: '\u001b[37m',
});

const LEVELS: Record<string, Theme> = Object.freeze({
  default: {
    id: COLORS.blue,
    datetime: COLORS.green,
    message: COLORS.white,
    level: COLORS.white,
  },
  info: {
    id: COLORS.blue,
    datetime: COLORS.white,
    message: COLORS.blue,
    level: COLORS.blue,
  },
  warn: {
    id: COLORS.blue,
    datetime: COLORS.white,
    message: COLORS.yellow,
    level: COLORS.yellow,
  },
  error: {
    id: COLORS.blue,
    datetime: COLORS.red,
    message: COLORS.red,
    level: COLORS.red,
  },
  success: {
    id: COLORS.blue,
    datetime: COLORS.white,
    message: COLORS.green,
    level: COLORS.green,
  },
  debug: {
    id: COLORS.blue,
    datetime: COLORS.green,
    message: COLORS.white,
    level: COLORS.magenta,
  },
});

function formatArgs(args: any[]): string {
  return args
    .map((arg) => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg, null, 2);
      }
      return String(arg);
    })
    .join(' ');
}

interface MessageFactoryProps {
  id?: string | boolean;
  level?: string;
  args?: any[];
  colors?: Theme;
}

function messageFactory({ id = '', level, args = [], colors }: MessageFactoryProps): string {
  const timestamp = new Date(Date.now() - tzOffset).toISOString().replace('T', ' ').replace('Z', '');

  let message = `${COLORS.reset}${colors?.datetime}[${timestamp}]${COLORS.reset}`;

  if (id) {
    message += `${COLORS.reset} - ${colors?.id}[id:${id}]${COLORS.reset}`;
  }

  if (level) {
    message += `${COLORS.reset} - ${colors?.level}[${level}]${COLORS.reset}`;
  }

  message += `${COLORS.reset} - ${colors?.message}${formatArgs(args)}${COLORS.reset}`;

  return message;
}

function stripAnsiCodes(text: string): string {
  return text.replace(/\u001b\[\d{1,2}m|\u001b\[0m/g, '');
}

function writeToStdout(message: string): void {
  console.log(message);
}

function writeToFile(message: string, filePath: string): void {
  fs.appendFileSync(filePath, stripAnsiCodes(message) + '\n', 'utf8');
}

function formatDate(date: Date, format: string): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const replacements: Record<string, string> = {
    YYYY: String(year),
    YY: String(year).slice(-2),
    MM: month,
    DD: day,
    HH: hours,
    mm: minutes,
    ss: seconds,
    M: String(date.getMonth() + 1),
    D: String(date.getDate()),
    H: String(date.getHours()),
    m: String(date.getMinutes()),
    s: String(date.getSeconds()),
  };

  let formatted = format;
  for (const [token, value] of Object.entries(replacements)) {
    formatted = formatted.replace(new RegExp(token, 'g'), value);
  }

  return formatted;
}

function getDayBasedFilePath(originalPath: string, dateFormat: string): string {
  const now = new Date();
  const datePrefix = formatDate(now, dateFormat) + '-';

  const dir = path.dirname(originalPath);
  const basename = path.basename(originalPath);

  return path.join(dir, datePrefix + basename);
}

export function logFactory({
  id,
  path: logPath,
  colors,
  toStdout = true,
  dayBasedFileLog = false,
  dateFormat = 'YYYYMMDD',
}: LogOptions): Logger {
  let currentId: string | undefined = id;

  const createLogHandler =
    (theme: Theme, level?: string) =>
    (...args: any[]) => {
      const message = messageFactory({
        id: currentId || false,
        colors: theme,
        level,
        args,
      });
      if (toStdout !== false) {
        writeToStdout(message);
      }
      if (logPath) {
        const filePath = dayBasedFileLog ? getDayBasedFilePath(logPath, dateFormat) : logPath;
        writeToFile(message, filePath);
      }
    };

  const baseLogger = createLogHandler(colors || (LEVELS['default'] as Theme));
  const logger = baseLogger as Logger;

  Object.keys(LEVELS)
    .filter((level) => level !== 'default')
    .forEach((levelKey) => {
      (logger as any)[levelKey] = createLogHandler(LEVELS[levelKey] as Theme, levelKey);
    });

  logger.id = (newId: string) => {
    currentId = newId;
    return logger;
  };

  return logger;
}
