let fs = require("fs");
let path = require("path");

// Define file types and their corresponding categories
let types = {
  media: ["mp4", "mkv"],
  archives: ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"],
  documents: [
    "docx",
    "doc",
    "pdf",
    "xlsx",
    "xls",
    "odt",
    "ods",
    "odp",
    "odg",
    "odf",
    "txt",
    "ps",
    "tex",
  ],
  app: ["exe", "dmg", "pkg", "deb"],
};

// Function to display a directory tree structure
function tree(dirName) {
  //if dirName is undefined, then it will take current working directory
  if (dirName == undefined) {
    treeHelper(process.cwd(), "");
    return;
  }

  let isExist = fs.existsSync(dirName);

  //if dirName is not a valid directory
  if (!isExist) {
    console.log("Please enter a correct directory");
    return;
  }

  //"" used as indent showing hirarchy structure
  treeHelper(dirName, "");
}

// Helper function for displaying the directory tree structure
function treeHelper(dirName, indent) {
  let isFile = fs.lstatSync(dirName).isFile();

  //if file print it
  if (isFile) {
    let fileName = path.basename(dirName);
    console.log(indent + "├──" + fileName);
    return;
  }

  //explore sub folder
  let childdirName = path.basename(dirName);
  console.log(indent + "└──" + childdirName);
  let childs = fs.readdirSync(dirName);

  for (let i = 0; i < childs.length; i++) {
    let childPath = path.join(dirName, childs[i]);
    treeHelper(childPath, indent + "\t");
  }
}

// Function to organize files in a directory into specific categories
function organize(dirName) {
  let destPath;
  if (dirName === undefined) {
    destPath = process.cwd();
    return;
  }
  let isExist = fs.existsSync(dirName);

  if (!isExist) {
    console.log("Please enter a correct directory");
    return;
  }

  destPath = path.join(dirName, "organized_files");

  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath);
  }

  organizeHelper(dirName, destPath);
}

// Helper function for organizing files into categories
function organizeHelper(src, dest) {
  let childNames = fs.readdirSync(src);

  for (let i = 0; i < childNames.length; i++) {
    let childAddress = path.join(src, childNames[i]);
    let isFile = fs.lstatSync(childAddress).isFile();

    if (isFile) {
      let category = getCategory(childNames[i]);
      sendFiles(path.join(src, childNames[i]), dest, category);
    }
  }
}

// Function to move files to their respective categories
function sendFiles(file, dest, category) {
  let categoryPath = path.join(dest, category);
  if (!fs.existsSync(categoryPath)) {
    fs.mkdirSync(categoryPath);
  }

  let fileName = path.basename(file);

  let destFilePath = path.join(categoryPath, fileName);
  if (fs.existsSync(destFilePath)) return;
  fs.writeFileSync(destFilePath, "");
  fs.copyFileSync(file, destFilePath);
  fs.unlinkSync(file);
}

// Function to determine the category of a file based on its extension
function getCategory(file) {
  let extension = path.extname(file);
  extension = extension.slice(1);

  for (let type in types) {
    for (let j = 0; j < types[type].length; j++) {
      if (extension == types[type][j]) {
        return type;
      }
    }
  }
  return "other";
}

// Function to display a list of available commands
function help() {
  console.log(`To implement commands:
  ibu tree/organize 'directoryPath'`);
}

module.exports = {
  tree,
  organize,
  help,
};
