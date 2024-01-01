#!/usr/bin/env zx


/**
 * This script renames all files from "antennafly_aaa_bb_Cc_r__AAAA-AAA-AA.jpg" > "aaa bb Cc r.jpg"
 *
 * Usage:
 * brew install zx
 *
 * 1) rename in current folder
 * ./rename.mjs
 *
 * 2) rename in another folder
 * ./rename.mjs ./yourFolder
 * or
 * ./rename.mjs ./yourFolder/
 */


const addEndingSlash = (filePath) => filePath.endsWith('/') ? filePath : `${filePath}/`;

const DIR = addEndingSlash(process.argv[3] || './');

const renameFile = (file) => {
  const match = file.match(/antennafly_(.+)_+([^_]+)/);

  if (!match) {
    return false;
  }

  const fileName = match[1];

  // replace '_' to spaces
  const newName = fileName.replace(/_/g, " ").trim();

  const newFileName = `${newName}.jpg`;

  if (fs.existsSync(`${DIR}${newFileName}`)) {
    console.log(`❌ Skip rename. File already exists "${newFileName}"`);
    return false;
  }

  fs.renameSync(`${DIR}${file}`, `${DIR}${newFileName}`);

  console.log(`✅ File "${file}" renamed to "${newFileName}"`);
  return true;
};


const run = () => {
  console.log(`Used dir=${DIR}`);
  const files = fs.readdirSync(DIR);

  const renamedCounter = files.reduce((acc, file) => {
    if (renameFile(file)) {
      acc++;
    }
    return acc;
  }, 0);

  console.log('\n===\nResult:');
  if (renamedCounter === 0) {
    console.log(`❌ Nothing to rename`);
    return;
  }
  console.log(`✅ Renamed ${renamedCounter} from ${files.length} files`)
}

run();
