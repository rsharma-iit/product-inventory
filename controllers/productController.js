const notifier = require('node-notifier');
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

// Handle supplier create on GET.
exports.product_create_get = asyncHandler(async (req, res, next) => {
  // Get all suppliers and categories, which we can use for adding to our product.
  const [allSuppliers, allCategorys] = await Promise.all([
    supplier.find().sort({ name: 1 }).exec(),
    category.find().sort({ name: 1 }).exec(),
  ]);

  res.render("product_form", {
    title: "Create Product",
    suppliers: allSuppliers,
    categorys: allCategorys,
  });
});

// Handle supplier create on POST.

exports.product_create_post = [

  // Validate and sanitize the name field.
  body("name", "Product name should be 3-100 characters")
    .trim(),
    
  body("category","Category must not be empty.")
  .trim()
  .isLength({ min: 1 })
  .escape(),
  body("sku", "SKU should be 3-100 characters")
    .trim()
    .isLength({ min: 8},{ max: 12}),
  body("description")
    .trim()
    .isLength({ min: 8},{ max: 12}),
    body("supplier","Supplier must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body("price")
    .trim()
    .isLength({min: 1})
    .escape()
    .isFloat()
    .withMessage("Price must be numbers"),
  body("quantity")
    .trim()
    .isLength({min: 0})
    .escape()
    .isNumeric()
    .withMessage("Price must be numbers"),


    // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a product object with escaped and trimmed data.
    const product1 = new product({ 
      name: req.body.name, 
      category: req.body.category,
      sku: req.body.sku,
      description: req.body.description,
      supplier: req.body.supplier,
      price: req.body.price, 
      quantity: req.body.quantity
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.

      const [allSuppliers, allCategorys] = await Promise.all([
        supplier.find().sort({ name: 1 }).exec(),
        category.find().sort({ name: 1 }).exec(),
      ]);

      res.render("product_form", {
        title: "Create Product",
        suppliers: allSuppliers,
        categorys: allCategorys,
        product: product1,
        errors: errors.array(),
      });
      
    } else {

        await product1.save();
        // New product saved. 
        notifier.notify({
          title: 'Product Added!',
          message: 'good stuff!',
          wait: true
        })}
    }
  ),
];


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
  // Get product, suppliers and categorys for form.
  const [product1, allSupplier, allCategorys] = await Promise.all([
    product.findById(req.params.id).populate("supplier","category").exec(),
    supplier.find().sort({ name: 1 }).exec(),
    category.find().sort({ name: 1 }).exec(),
  ]);

  if (product1 === null) {
    // No results.
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }


  res.render("product_form", {
    title: "Update Product",
    authors: allSuppliers,
    genres: allCategorys,
    product: product1,
  });
});

// Handle product update on POST.
exports.product_update_post = [


  // Validate and sanitize fields.
  body("title", "Product name should be 3-100 characters.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("author", "Category must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("sku", "SKU should be 3-100 characters")
    .trim()
    .isLength({ min: 8},{ max: 12}),
  body("description")
    .trim()
    .isLength({ min: 8},{ max: 12}),
    body("supplier","Supplier must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body("price")
    .trim()
    .isLength({min: 1})
    .escape()
    .isFloat()
    .withMessage("Price must be numbers"),
  body("quantity")
    .trim()
    .isLength({min: 0})
    .escape()
    .isNumeric()
    ,


  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Product object with escaped/trimmed data and old id.
    const product1 = new product({ 
      name: req.body.name, 
      category: req.body.category,
      sku: req.body.sku,
      description: req.body.description,
      supplier: req.body.supplier,
      price: req.body.price, 
      quantity: req.body.quantity
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form
      const [allSuppliers, allCategorys] = await Promise.all([
        supplier.find().sort({ name: 1 }).exec(),
        category.find().sort({ name: 1 }).exec(),
      ]);

      res.render("product_form", {
        title: "Update Product",
        suppliers: allSuppliers,
        categorys: allCategorys,
        product: product1,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedProduct = await product.findByIdAndUpdate(req.params.id, product1, {});
      
    }
  }),
];