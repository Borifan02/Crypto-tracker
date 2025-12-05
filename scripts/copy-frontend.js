const fs = require('fs').promises;
const path = require('path');

async function copyDir(src, dest) {
  try {
    await fs.rm(dest, { recursive: true, force: true });
  } catch (e) {
    // ignore
  }
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  const root = path.resolve(__dirname, '..');
  const frontend = path.join(root, 'frontend');
  const out = path.join(root, 'public');
  try {
    const stat = await fs.stat(frontend);
    if (!stat.isDirectory()) throw new Error('frontend exists but is not a directory');
  } catch (err) {
    console.error('Error: `frontend/` directory not found.');
    process.exit(1);
  }

  try {
    await copyDir(frontend, out);
    console.log('Copied frontend/ -> public/');
  } catch (err) {
    console.error('Copy failed:', err);
    process.exit(1);
  }
}

main();
