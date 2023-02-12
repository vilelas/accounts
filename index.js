// módulos externos
const chalk = require("chalk");
const inquirer = require("inquirer");

// core modules
const fs = require("fs");

// módulos internos
const getAccount = require("./utils/getAccount")
const checkAccount = require("./utils/checkAccount")

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
        withDraw();
      } else if (action === "Sair") {
        sair();
      } else if (action === "Consultar saldo") {
        checkAccountBalance();
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

// Depositar
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

// sair
const sair = () => {
  console.log(chalk.bgBlue.black("Obrigado por usar o Accounts!"));
  process.exit();
};

// sacar
const removeAmount = (accountName, amount) => {
  const accountData = getAccount(accountName);

  if (!amount) {
    console.log(chalk.bgRed.black("Dados inválidos na entrada."));
    return withDraw();
  }

  if (accountData.balance < amount) {
    console.log(chalk.bgRed.black("Valor indisponível!"));
    return withDraw();
  }

  accountData.balance = parseFloat(accountData.balance) - parseFloat(amount);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    (err) => {
      console.log(err);
    }
  );

  console.log(
    chalk.green(
      `Foi realizado um saque no valor de ${parseFloat(amount).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      })} da sua conta`
    )
  );

  operation()
};

const withDraw = () => {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da conta? ",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      if (!checkAccount(accountName)) {
        return withDraw();
      }

      inquirer
        .prompt([
          {
            name: "amount",
            message: "Qual o valor do saque? ",
          },
        ])
        .then((answer) => {
          const amount = answer["amount"];
          removeAmount(accountName, amount);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => console.log(err));
};

// consultar saldo
const checkAccountBalance = () => {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta? ",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      // verificar se a conta existe
      if (!checkAccount(accountName)) {
        return checkAccountBalance();
      }

      const accountData = getAccount(accountName);

      console.log(
        chalk.bgBlue.black(
          `Seu saldo é de: ${parseFloat(accountData.balance).toLocaleString(
            "pt-br",
            {
              style: "currency",
              currency: "BRL",
            }
          )}`
        )
      );

      operation();
    })
    .catch((err) => console.log(err));
};

operation();
