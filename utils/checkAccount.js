// módulos externos
const chalk = require("chalk");
const inquirer = require("inquirer");

// core modules
const fs = require("fs");

const checkAccount = (accountName) => {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(
      chalk.bgRed.black("Esta conta não existe, escolha outro nome!")
    );
    return false;
  }
  return true;
};

module.exports = checkAccount;
