#!/usr/bin/env zx


/**
 * Preview to heic
 * This script converts `.png` images to `.heic` format within a directory, preserving the directory structure.
 *
 * Usage:
 * ./preview2heic.mjs ~/my-dir/source ~/Downloads/target
 *
 */

const checkIsDirectory = async(directory) => {
  try {
    const stats = await fs.stat(directory);
    return stats.isDirectory();
  } catch (error) {
    console.error(`Error checking directory: ${directory}`, error);
    process.exit(1);
  }
}

const ensureDirectories = async() => {
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

async function processDirectory(src, dest) {
  const items = await fs.readdir(src, {withFileTypes: true});
  const stat = {dirsCounter: 0, convertedCounter: 0};

  const directories = items.filter(item => item.isDirectory());

  for (const dir of directories) {
    const srcPath = path.join(src, dir.name);
    const destPath = path.join(dest, dir.name);

    await fs.mkdir(destPath, {recursive: true});

    const files = await fs.readdir(srcPath, {withFileTypes: true});
    let isDirProcessed = false;

    for (const file of files) {
      if (file.isFile()) {
        const srcFilePath = path.join(srcPath, file.name);

        if (file.name === 'preview.png') {
          // copy as is
          await $`cp ${srcFilePath} ${path.join(destPath, file.name)}`;
        } else if (path.extname(file.name) === '.png') {
          // convert other .png files with renaming to .heic
          const newFileName = path.basename(file.name, '.png') + '.heic';
          const newDestPath = path.join(destPath, newFileName);
          logConverting(srcFilePath, newDestPath);
          await convertImage(srcFilePath, newDestPath);
          stat.convertedCounter++;
          isDirProcessed = true;
        }
      }
    }

    if (isDirProcessed) {
      stat.dirsCounter++;
    }
  }

  return stat;
}

async function main() {
  const {sourceDir, targetDir} = await ensureDirectories();

  console.log('sourceDir:', sourceDir)
  console.log('targetDir:', targetDir)

  const stat = await spinner('🍺', () => processDirectory(sourceDir, targetDir));

  console.log('-'.repeat(80))
  console.log('✅ Done:');
  console.log(`  - folders processed:\t ${stat.dirsCounter}`);
  console.log(`  - files converted:\t ${stat.convertedCounter}`);
  console.log('Have a great day! 🙌');
}

main();
