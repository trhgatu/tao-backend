import log from '@common/logger';
import fs from 'fs';
import path from 'path';

const moduleName = process.argv[2];

if (!moduleName) {
  log.error('Please provide a module name. Example: npm run generate quote');
  process.exit(1);
}

const SRC_DIR = path.join(__dirname, '../modules');
const TEMPLATE_DIR = path.join(SRC_DIR, '__template__');
const TARGET_DIR = path.join(SRC_DIR, moduleName);

const replaceContent = (content: string, name: string) => {
  const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
  return content
    .replace(/__template__/g, name)
    .replace(/__Template__/g, capitalized)
    .replace(/Template/g, capitalized);
};

const copyFolder = (src: string, dest: string) => {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  fs.readdirSync(src).forEach((file) => {
    const srcPath = path.join(src, file);
    const newFileName = file.replace(/__template__/g, moduleName);
    const destPath = path.join(dest, newFileName);

    if (fs.lstatSync(srcPath).isDirectory()) {
      copyFolder(srcPath, destPath);
    } else {
      const content = fs.readFileSync(srcPath, 'utf-8');
      const replaced = replaceContent(content, moduleName);
      fs.writeFileSync(destPath, replaced, 'utf-8');
    }
  });
};

// Check if module already exists
if (fs.existsSync(TARGET_DIR)) {
  log.error(`Module "${moduleName}" already exists.`);
  process.exit(1);
}

copyFolder(TEMPLATE_DIR, TARGET_DIR);
log.info(`Module "${moduleName}" has been created at src/modules/${moduleName}`);
