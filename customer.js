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
  queryBamazon();
});

function queryBamazon() {
  console.log("Items up for sale");
  console.log("------------------");
  connection.query("SELECT * FROM products", function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " |  $" + res[i].price + " | " + res[i].quantity);
      console.log("------------------");
    }
    mainMenu();
  });
}

var mainMenu = function() {
  inquirer.prompt([
    {
      type: "list",
      message: "Please select:",
      choices: ["Buy an Item", "Exit"],
      name: "choice"
    }
  ]).then(function(res) {
    switch (res.choice) {
      case ("Exit"):
        connection.end();
        return;
      case ("Buy an Item"):
        buyItem();
        break;
    }
  });
};

var buyItem = function() {
  inquirer.prompt([
    {
      type: "input",
      message: "enter the item id of the product you would like to buy",
      name: "item"
    }, {
      type: "number",
      message: "how many do you want to buy?",
      name: "quantity"
    }
  ]).then(function(argument) {
    connection.query("SELECT quantity, price, product_name FROM products WHERE item_id = ?", [argument.item], function(err, res) {
      var numSold = argument.quantity;
      var totalCost = res[0].price * numSold;
      var newQuantity = parseInt(res[0].quantity - numSold);
      if (err) {
        return console.log(err);
      }
      if (res[0].quantity < argument.quantity) {
        return console.log("ERROR: Insufficient store quantity.");
      }
      connection.query("UPDATE products SET quantity = ? WHERE item_id = ?", [newQuantity, argument.item]);
      console.log("Your order for " + numSold + " units of " + res[0].product_name + " has been placed.");
      console.log("You spent $" + totalCost + " on your purchase.");
      console.log("Thank you for shopping with Bamazon. Logging you out now. Please come again.");
      connection.end();
    });
  });
};
