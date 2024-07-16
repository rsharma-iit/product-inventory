const product = require("../models/product");
const category = require("../models/category");
const supplier = require("../models/supplier");
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of products, suppliers and categories (in parallel)
  const [
    numProducts,
    numCategories,
    numSuppliers,

  ] = await Promise.all([
    product.countDocuments({}).exec(),
    category.countDocuments({}).exec(),
    supplier.countDocuments({}).exec(),

  ]);

  res.render("index", {
    title: "Warehouse Inventory",
    product_count: numProducts,
    category_count: numCategories,
    supplier_count: numSuppliers,

  });
});




exports.product_list = asyncHandler(async (req, res, next) => {
  const allproducts = await product.find({},{'_id': 0})
    .sort({ name: 1 })
    .populate('supplier', 'name')
    .populate('category','name')
    .exec();

  res.render('inventory', { title: "Product List", product_list: allproducts });
});



// Display list of all product.
//exports.product_list = asyncHandler(async (req, res, next) => {
//  res.send("NOT IMPLEMENTED: product list");
//});


// Display product create form on GET.
exports.product_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: product create GET");
});

// Handle product create on POST.
exports.product_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: product create POST");
});

// Display product delete form on GET.
exports.product_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: product delete GET");
});

// Handle product delete on POST.
exports.product_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: product delete POST");
});

// Display product update form on GET.
exports.product_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: product update GET");
});

// Handle product update on POST.
exports.product_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: product update POST");
});
