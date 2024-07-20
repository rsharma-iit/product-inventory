const notifier = require('node-notifier');
const product = require("../models/product");
const category = require("../models/category");
const supplier = require("../models/supplier");

const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

//index page with inventory
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
    title: "Product Inventory Tool",
    product_count: numProducts,
    category_count: numCategories,
    supplier_count: numSuppliers,

  });
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
    .trim()
    .matches(/^[A-Za-z\s]+$/).withMessage('Name must be alphabetic.'),
    
  body("category","Category must not be empty.")
  .trim()
  .isLength({ min: 1 })
  .escape(),
  body("sku", "SKU should be 8-12 characters")
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
    .withMessage("Quantity must be numbers"),


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
        res.redirect("/inventory/products");   
        // New product saved. 
        console.log("Product created successfully !");
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
  const product1 = await product.findById(req.params.id).populate("category").populate("supplier").exec();

  if (product1 === null) {
    // No results.
    res.redirect("/inventory/products");
  }

  res.render("product_delete", {
    title: "Delete Product",
    product: product1,
  });
});



// Handle product delete on POST.
exports.product_delete_post = asyncHandler(async (req, res, next) => {
  // Assume the post has valid id (ie no validation/sanitization).

  const product1 = await product.findById(req.params.id).populate("category").populate("supplier").exec();
  

  if (product1 === null) {
    // No results.
    res.redirect("/inventory/products");
  }

  res.render("product_delete", {
    title: "Delete Product",
    product: product1,
  });

    // Delete object and redirect to the list of product.
    await product.findByIdAndDelete(req.body.id);
 //   req.flash('success', 'Testing notification');
    res.redirect("/inventory/products");

  }
);

// Display product update form on GET.
exports.product_update_get = asyncHandler(async (req, res, next) => {
  // Get product, suppliers and categorys for form.
  const [product1, allSuppliers, allCategorys] = await Promise.all([
    product.findById(req.params.id).populate("category").exec(),
    supplier.find().sort({ name: 1 }).exec(),
    category.find().sort({ name: 1 }).exec(),
  ]);

  if (product1 === null) {
    // No results.
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

  // Mark our selected genres as checked.
  allSuppliers.forEach((supplier) => {
    if (product1.supplier.includes(supplier._id)) supplier.checked = "true";
  });


  res.render("product_form", {
    title: "Update Product",
    suppliers: allSuppliers,
    categorys: allCategorys,
    product: product1,
  });
});

// Handle product update on POST
exports.product_update_post = [

  // Convert the suppliers to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.supplier)) {
      req.body.supplier =
        typeof req.body.supplier === "undefined" ? [] : [req.body.supplier];
    }
    next();
  },
   // Validate and sanitize the name field.
  body("name", "Product name should be 3-100 characters")
   .trim()
   .matches(/^[A-Za-z\s]+$/).withMessage('Name must be alphabetic.'),
  body("category","Category must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("sku", "SKU should be 8-12 characters")
    .trim()
    .isLength({ min: 8},{ max: 12}),
  body("description")
    .trim()
    .isLength({ min: 3},{ max: 100}),
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
    .withMessage("Quantity must be numbers"),



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
      supplier: typeof req.body.supplier === "undefined" ? [] : req.body.supplier,
      _id: req.params.id, // This is required, or a new ID will be assigned!
      price: req.body.price, 
      quantity: req.body.quantity
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all suppliers and categorys for form
      const [allSuppliers, allCategorys] = await Promise.all([
        supplier.find().sort({ name: 1 }).exec(),
        category.find().sort({ name: 1 }).exec(),
      ]);
      
      for (const supplier of allSuppliers) {
        if (product1.supplier.indexOf(supplier._id) > -1) {
          supplier.checked = "true";
        }
      }
        res.render("product_form", {
        title: "Update Product",
        suppliers: allSuppliers,
        categorys: allCategorys,
        product: product1,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record
      const updatedProduct = await product.findByIdAndUpdate(req.params.id, product1, {});
      res.redirect(updatedProduct.url);
    }
  }),
];


// Display detail page for a specific product.
exports.product_detail = asyncHandler(async (req, res, next) => {
  // Get details of products
  const [product1] = await Promise.all([
    product.findById(req.params.id).populate("category").populate("supplier").exec(),
  
  ]);

  if (product1 === null) {
    // No results.
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

  res.render("product_detail", {
    name: product1.name,
    product: product1,
    
  });
});


//product list page
exports.product_list = asyncHandler(async (req, res, next) => {
  const allproducts = await product.find({}, "name category")
    .sort({ name: 1 })
    .populate("category")
    .exec();

  res.render("products", { title: "Product List", product_list: allproducts });
});
