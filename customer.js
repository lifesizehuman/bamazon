var mysql = require('mysql')
var inquirer = require('inquirer')

var connection = mysql.createConnection({
  host: 'localhost',
  port: 8889,
  user: 'root',
  password: 'insecure',
  database: 'bamazon'
})

connection.connect(function (err) {
  if (err) {
    return console.log(err)
  }
  queryBamazon()
})

function queryBamazon () {
  console.log("Items up for sale")
  console.log('------------------')
  connection.query('SELECT * FROM products', function (err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + ' | ' + res[i].product_name + ' | ' + "$" + res[i].price + ' | ' + res[i].quantity);
      console.log('------------------');
    }
    mainMenu();
  });
};

var mainMenu = function() {
  inquirer.prompt([
    {
      type: "list",
      message: "Please select:",
      choices: ["Exit", "Buy an Item"],
      name: "choice"
    }
  ]).then(function(res){
    switch(res.choice){
      case("Exit"):
        connection.end();
        return;
        break;
      case ("Buy an Item"):
        buyItem();
        break;
    }
  });
};

var buyItem = function() {
  console.log("This is still in production.");
  mainMenu();
}
