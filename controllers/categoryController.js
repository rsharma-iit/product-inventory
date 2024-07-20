const notifier = require('node-notifier');
const category = require("../models/category");
const product = require("../models/product");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all Category.
exports.category_list = asyncHandler(async (req, res, next) => {
  const allcategorys = await category.find().sort({name: 1}).exec();
  res.render('categorys', { title: "Category List", category_list: allcategorys });
});


// Display detail page for a specific Category.
exports.category_detail = asyncHandler(async (req, res, next) => {
  // Get details of category and all their products
  const [category1, allProductsbyCategory] = await Promise.all([
    category.findById(req.params.id).exec(),
    product.find({ category: req.params.id }, "name description").exec(),
  ]);

  if (category1 === null) {
    // No results.
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_detail", {
    title: "Category Detail",
    category: category1,
    category_products: allProductsbyCategory,
  });
});


// Display supplier create form on GET.
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
});

// Handle Category create on POST.

exports.category_create_post = [
  // Validate and sanitize the name field.
  body("name", "Category name should be 3-100 characters, no numbers allowed")
    .trim()
    .isLength({ min: 3},{ max: 100}),
//    .isAlphabetic(),
  body("description", "Category description  should be 3-100 characters")
    .trim()
    .isLength({ min: 3},{ max: 100}),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a category object with escaped and trimmed data.
    const category1 = new category({ 
      name: req.body.name, 
      description: req.body.description
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create Category",
        category: category1,
        errors: errors.array(),
      });
      return;
    } else {

        await category1.save();
        // New category saved. 
        notifier.notify({
          title: 'Category Added!',
          message: 'good stuff!',
//          icon: path.join(__dirname, 'icon.jpg'),
//          sound: true,
          wait: true
        })}
    }
  ),
];





// Display Category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of category and all their products (in parallel)
  const [category1, allProductsbyCategory] = await Promise.all([
    category.findById(req.params.id).exec(),
    product.find({ category: req.params.id }, "name description").exec(),
  ]);

  if (category1 === null) {
    // No results.
    res.redirect("/inventory/categorys");
  }

  res.render("category_delete", {
    title: "Delete Category",
    category: category1,
    category_products: allProductsbyCategory,
  });
});

// Handle Category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of category and all their products (in parallel)
  const [category1, allProductsbyCategory] = await Promise.all([
    category.findById(req.params.id).exec(),
    product.find({ category: req.params.id }, "name description").exec(),
  ]);

  if (allProductsbyCategory.length > 0) {
    // Category has products. Render in same way as for GET route.
    res.render("category_delete", {
      title: "Delete Category",
      category: category1,
      category_products: allProductsbyCategory,
    });
    return;
  } else {
    // Category has no products. Delete object and redirect to the list of authors.
    await category.findByIdAndDelete(req.body.id);
    res.redirect("/inventory/categorys");
  }
});









// Display category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category1 = await category.findById(req.params.id).exec();
  if (category1 === null) {
    // No results.
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_form", { title: "Update Category", category: category1 });
});

// Handle category update on POST.
exports.category_update_post = [

  // Validate and sanitize fields.
  body("name", "Category name should be 3-100 characters, no numbers allowed")
    .trim()
    .isLength({ min: 3},{ max: 100}),
//    .isAlphabetic(),
  body("description", "Category description  should be 3-100 characters")
    .trim()
    .isLength({ min: 3},{ max: 100}),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Category object with escaped/trimmed data and old id.
    const category1 = new category({
      name: req.body.name, 
      description: req.body.description,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      res.render("category_form", {
        title: "Update Category",
        category: category1,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      await category.findByIdAndUpdate(req.params.id, category1);
      res.redirect(category1.url);
    }
  }),
];
