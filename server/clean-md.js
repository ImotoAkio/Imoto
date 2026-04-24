import fs from 'fs';
import path from 'path';

const historiasPath = './historias';

function cleanMarkdown(content) {
  // Remove line breaks before a period
  let cleaned = content.replace(/\n\./g, '.');
  // Remove multiple spaces before a period
  cleaned = cleaned.replace(/\s+\./g, '.');
  // Fix other potential issues like periods followed by too many line breaks
  cleaned = cleaned.replace(/\.\n\./g, '.');
  return cleaned;
}

const files = fs.readdirSync(historiasPath);

files.forEach(file => {
  if (file.endsWith('.md')) {
    const filePath = path.join(historiasPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const cleaned = cleanMarkdown(content);
    fs.writeFileSync(filePath, cleaned);
    console.log(`Cleaned ${file}`);
  }
});
