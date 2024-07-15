var express = require('express');
var router = express.Router();


// Require controller modules.
const product_controller = require("../controllers/productController");
const supplier_controller = require("../controllers/supplierController");
const category_controller = require("../controllers/categoryController");

// GET inventory home page.
router.get("/", product_controller.index);

// GET home page.
//router.get('/', function (req, res, next) {
//  res.render('index',{title:'Warehouse Inventory'});
//});


module.exports = router;