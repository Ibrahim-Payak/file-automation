#!/usr/bin/env node
let input = process.argv.slice(2);

let { tree, organize, help } = require("./command");

// Get the command from the input arguments
let command = input[0];

// Execute the appropriate function based on the command
switch (command) {
  case "tree":
    tree(input[1]);
    break;
  case "organize":
    organize(input[1]);
    break;
  case "help":
    help();
    break;
  default:
    console.log("Please input the right command");
}
