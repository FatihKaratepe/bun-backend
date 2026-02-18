import fs from 'fs';
import path from 'path';

const prismaDir = path.resolve(__dirname, '../prisma');
const modelsDir = path.join(prismaDir, 'models');
const schemaPath = path.join(prismaDir, 'schema.prisma');

const originalSchema = fs.readFileSync(schemaPath, 'utf-8');

const header = originalSchema.replace(/(model|enum|type)\s+\w+\s+{[^}]*}/gms, '');

const modelFiles = fs.readdirSync(modelsDir).filter((file) => file.endsWith('.prisma'));

let modelsContent = '';

for (const file of modelFiles) {
  const filePath = path.join(modelsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  modelsContent += `\n\n// ===== ${file} =====\n\n`;
  modelsContent += content;
}

const finalSchema = `${header.trim()}\n${modelsContent}`;

fs.writeFileSync(schemaPath, finalSchema);

console.log('✅ Prisma schema merged successfully.');
