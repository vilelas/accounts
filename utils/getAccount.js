// módulos externos
const chalk = require("chalk");
const inquirer = require("inquirer");

// core modules
const fs = require("fs");

const getAccount = (accountName) => {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: "utf-8",
    flag: "r",
  });
  return JSON.parse(accountJSON);
};

module.exports = getAccount;
