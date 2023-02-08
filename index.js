// módulos externos
const chalk = require("chalk");
const inquirer = require("inquirer");

// módulos internos
const fs = require("fs");

const operation = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "O que você deseja fazer?",
        choices: [
          "Criar conta",
          "Consultar saldo",
          "Depositar",
          "Sacar",
          "Sair",
        ],
      },
    ])
    .then((answer) => {
      const action = answer["action"];
      console.log(action);
    })
    .catch((err) => console.log(err));
};

operation();
