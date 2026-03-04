import fs from 'fs';
import path from 'path';
import { createStream } from 'rotating-file-stream';

const logDirectory = path.join(process.cwd(), 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

export const accessLogStream = createStream(
  () => {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}.log`;
  },
  {
    interval: '1d',
    path: logDirectory,
  },
);
