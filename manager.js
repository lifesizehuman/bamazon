var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "insecure",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) {
    return console.log(err);
  }
  adminMenu();
});

var adminMenu = function() {
  inquirer.prompt([
    {
      type: "list",
      message: "Please select:",
      choices: [
        "View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"
      ],
      name: "choice"
    }
  ]).then(function(res) {
    switch (res.choice) {
      case ("Exit"):
        connection.end();
        return;
      case ("View Products for Sale"):
        adminQuery();
        break;
      // case ("View Low Inventory"):
      //   adminLowInventory();
      //   break;
      case ("Add to Inventory"):
        adminAddInvetory();
        break;
      // case ("Add New Product"):
      //   adminAddItem();
      //   break;
    }
  });

  function adminQuery() {
    console.log("Items up for sale");
    console.log("------------------");
    connection.query("SELECT * FROM products", function(err, res) {
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].item_id + " | " + res[i].product_name + " |  $" + res[i].price + " | " + res[i].quantity);
        console.log("------------------");
      }
      adminMenu();
    });
  }

  var adminAddInvetory = function() {
    inquirer.prompt([
      {
        type: "input",
        message: "enter the item id of the product you would like to add into",
        name: "item"
      }, {
        type: "input",
        message: "how many do you want to add?",
        name: "quantity"
      }
    ]).then(function(argument) {
      connection.query("SELECT quantity FROM products WHERE item_id = ?", [argument.item], function(err, res) {
        var numToAdd = parseInt(argument.quantity);
        var newInventory = parseInt(res[0].quantity) + numToAdd;

        if (err) {
          return console.log(err);
        }
        connection.query("UPDATE products SET quantity = ? WHERE item_id = ?", [newInventory, argument.item]);
        console.log(argument.quantity + " units added to inventory.");
        connection.end();
      });
    });
  };
};
