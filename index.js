// módulos externos
const chalk = require("chalk");
const inquirer = require("inquirer");

// módulos internos
const fs = require("fs");

// função principal
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

      if (action === "Criar conta") {
        createAccount();
      } else if (action === "Depositar") {
      } else if (action === "Sacar") {
      } else if (action === "Sair") {
        sair();
      } else if (action === "Consultar saldo") {
      }
    })
    .catch((err) => console.log(err));
};

// criar conta
const createAccount = () => {
  console.log(chalk.bgGreen.black("Parabéns por escolher o nosso banco!"));
  console.log(chalk.green("Defina as opções da sua conta a seguir"));

  buildAccount();
};

// Sair
const sair = () => {
  console.log(chalk.bgBlue.black("Obrigado por usar o Accounts!"));
  process.exit()
};

// construção da conta
const buildAccount = () => {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Digite um nome para a sua conta: ",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      console.info(accountName);

      if (!fs.existsSync("accounts")) {
        fs.mkdirSync("accounts");
      }

      if (fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(
          chalk.bgRed.black("Esta conta já existe, escolha outro nome!")
        );
        buildAccount();
        return;
      }

      fs.writeFileSync(
        `accounts/${accountName}.json`,
        `{"balance": 0}`,
        (err) => {
          console.log(chalk.bgRed.black(err));
        }
      );
      console.log(chalk.green("Parabéns, sua conta foi criada!"));

      operation();
    })
    .catch((err) => console.log(chalk.bgRed.black(err)));
};

operation();
