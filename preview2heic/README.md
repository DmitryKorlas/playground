# Preview to heic

This script converts `.png` images to `.heic` format within a directory and its subdirectories, preserving the directory structure.


For each `.png` file:
- If the file is named `preview.png`, it is copied to the target directory without conversion.
- For all other `.png` files, they are converted to `.heic` format using the [vips](https://www.libvips.org/)
  command-line tool, renamed accordingly, and saved in the `targetDir`.

## Prerequisites

```sh
brew install zx
brew install vips
```

Optional, it probably shipped with vips

```sh
brew install x265
```

compat vips version: **8.15.3**

## Usage:

```sh
./preview2heic.mjs ~/my-dir/source ~/Downloads/target
```

## Example

Let's assume directory structure:

```sh
$ tree  ~/temp/test/source
~/temp/test/source
├── astronaut
│   ├── background.png
│   ├── foreground.png
│   ├── preview.png
│   └── previewOverlay.png
└── landscape
    ├── background.png
    ├── preview.png
    └── previewOverlay.png
```

Script will create the following directory structure:

```sh
$ tree  ~/Downloads/target/
~/Downloads/target/
├── astronaut
│   ├── background.heic
│   ├── foreground.heic
│   ├── preview.png
│   └── previewOverlay.heic
└── landscape
    ├── background.heic
    ├── preview.png
    └── previewOverlay.heic
```
