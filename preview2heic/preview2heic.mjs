#!/usr/bin/env zx


/**
 * Preview to heic
 * This script converts `.png` images to `.heic` format within a directory and its subdirectories, preserving the directory structure.
 *
 * Usage:
 * ./preview2heic.mjs ~/my-dir/source ~/Downloads/target
 *
 */

const checkIsDirectory = async (directory) => {
  try {
    const stats = await fs.stat(directory);
    return stats.isDirectory();
  } catch (error) {
    console.error(`Error checking directory: ${directory}`, error);
    process.exit(1);
  }
}

const ensureDirectories = async () => {
  const [sourceDir, targetDir] = process.argv.slice(3);

  if (!sourceDir || !targetDir) {
    console.error('Usage: ./convert.mjs <sourceDir> <targetDir>');
    process.exit(1);
  }

  if (!(await checkIsDirectory(sourceDir))) {
    console.error(`Source path ${sourceDir} is not a directory or does not exist.`);
    process.exit(1);
  }

  try {
    await fs.ensureDir(targetDir);
  } catch (error) {
    console.error(`Can't create target directory: ${targetDir}`, error);
    process.exit(1);
  }

  return {sourceDir, targetDir}
}

const convertImage = async (fromPath, toPath) => {
  return $`vips heifsave --lossless --encoder=x265 --Q=100 ${fromPath} ${toPath}`
}

const logConverting = (fromPath, toPath) => {
  console.log(`Processing ${fromPath} > ${toPath}`);
}

async function processDirectory(src, dest, initialStat) {
  console.log('processDirectory', src, dest);
  const stat = {...initialStat};

  const files = await fs.readdir(src, {withFileTypes: true});

  let isPngProcessedInDir = false;
  for (const file of files) {
    const srcPath = path.join(src, file.name);
    const destPath = path.join(dest, file.name);
    if (file.isDirectory()) {
      await fs.mkdir(destPath, {recursive: true});
      const nestedStat = await processDirectory(srcPath, destPath, stat);
      stat.convertedCounter = nestedStat.convertedCounter;
      stat.dirsCounter = nestedStat.dirsCounter;
      continue;
    }

    if (!file.isFile()) {
      continue;
    }

    if (file.name === 'preview.png') {
      // copy as is
      await $`cp ${srcPath} ${destPath}`;
    } else if (path.extname(file.name) === '.png') {
      // convert other .png files with renaming to .heic
      const newFileName = path.basename(file.name, '.png') + '.heic';
      const newDestPath = path.join(dest, newFileName);
      logConverting(srcPath, newDestPath);
      await convertImage(srcPath, newDestPath);
      stat.convertedCounter++;
      if (!isPngProcessedInDir) {
        stat.dirsCounter++;
      }
      isPngProcessedInDir = src;
    }
  }

  return stat;
}

async function main() {
  const {sourceDir, targetDir} = await ensureDirectories();

  console.log('sourceDir:', sourceDir)
  console.log('targetDir:', targetDir)
  const stat = await spinner('🍺', () => processDirectory(sourceDir, targetDir, {dirsCounter: 0, convertedCounter: 0}));

  console.log('-'.repeat(80))
  console.log('✅ Done:');
  console.log(`  - folders processed:\t ${stat.dirsCounter}`);
  console.log(`  - files converted:\t ${stat.convertedCounter}`);
  console.log('Have a great day! 🙌');
}

main();
