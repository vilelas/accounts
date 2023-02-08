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
        deposit();
      } else if (action === "Sacar") {
      } else if (action === "Sair") {
        sair();
      } else if (action === "Consultar saldo") {
      }
    })
    .catch((err) => console.log(err));
};

const checkAccount = (accountName) => {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(
      chalk.bgRed.black("Esta conta não existe, escolha outro nome!")
    );
    return false;
  }
  return true;
};

const addAmount = (accountName, amount) => {
  const account = getAccount(accountName);
  if (!amount) {
    console.log(
      chalk.bgRed.black("Ocorreu um erro, tente novamente mais tarde!")
    );
  }

  account.balance = parseFloat(account.balance) + parseFloat(amount);
  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(account),
    (err) => {
      console.log(err);
    }
  );

  console.log(
    chalk.green(
      `Foi depositado o valor de ${parseFloat(amount).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      })}`
    )
  );
};

const getAccount = (accountName) => {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: "utf-8",
    flag: "r",
  });
  return JSON.parse(accountJSON);
};

// Depositar
const deposit = () => {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta? ",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      // Verificar se a conta existe
      if (!checkAccount(accountName)) {
        return deposit();
      }

      inquirer
        .prompt([
          {
            name: "amount",
            message: "Quanto você deseja depositar? ",
          },
        ])
        .then((answer) => {
          const amount = answer["amount"];

          // adicionando o saldo
          addAmount(accountName, amount);
          operation();
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Sair
const sair = () => {
  console.log(chalk.bgBlue.black("Obrigado por usar o Accounts!"));
  process.exit();
};

// criar conta
const createAccount = () => {
  console.log(chalk.bgGreen.black("Parabéns por escolher o nosso banco!"));
  console.log(chalk.green("Defina as opções da sua conta a seguir"));

  buildAccount();
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
