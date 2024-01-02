#!/usr/bin/env zx


/**
 * This script renames all files from "annadesignfly_aaa_bb_Cc_r__AAAA-AAA-AA.jpg" > "aaa bb Cc r.jpg"
 * If target file exists, script will add suffix starting from '1', i.e.:
 * "aaa bb Cc r.jpg"
 * "aaa bb Cc r-1.jpg",
 * "aaa bb Cc r-2.jpg" etc.
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
  const match = file.match(/^annadesignfly_(.+)_+([^_]+)(\.[a-z0-9]{2,4})$/i);

  if (!match) {
    return false;
  }

  const fileName = match[1];
  const fileExt = match[3];

  // replace '_' to spaces
  let newFileName = fileName.replace(/_/g, " ").trim();

  // convert first char to upper case
  newFileName = newFileName.charAt(0).toUpperCase() + newFileName.substring(1);
  newFileName = findFileName(`${DIR}${newFileName}${fileExt}`);

  fs.renameSync(`${DIR}${file}`, `${DIR}${newFileName}`);

  console.log(`✅ File "${file}" renamed to "${newFileName}"`);
  return true;
};

const findFileName = (filepath) => {
  const extname = path.extname(filepath);
  const basename = path.basename(filepath, extname);
  const dirname = path.dirname(filepath);

  let index = 0;
  while (true) {
    const nextName = index === 0
      ? `${basename}${extname}`
      : `${basename}-${index}${extname}`;

    if (!fs.existsSync(path.join(dirname, nextName))) {
      return nextName;
    }
    index++;
  }
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
