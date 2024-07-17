const notifier = require('node-notifier');
const category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all Category.
exports.category_list = asyncHandler(async (req, res, next) => {
  const allcategorys = await category.find({},{'_id': 0})
    .sort({ name: 1 })
    .exec();
  res.render('categorys', { title: "Category List", category_list: allcategorys });
});




// Display supplier create form on GET.
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
});

// Handle Category create on POST.

exports.category_create_post = [
  // Validate and sanitize the name field.
  body("name", "Category name should be 3-100 characters")
    .trim()
    .isLength({ min: 3},{ max: 100}),
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


/*

// Display Supplier delete form on GET.
exports.supplier_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of supplier and all their products (in parallel)
  const [supplier1, allProductsbySupplier] = await Promise.all([
    supplier.findById(req.params.id).exec(),
    product.find({ supplier1: req.params.id }, "product description").exec(),
  ]);

  if (supplier1 === null) {
    // No results.
    res.redirect("/inventory/suupliers");
  }

  res.render("supplier_delete", {
    title: "Delete Supplier",
    supplier: supplier1,
    productSupplliers: allProductsbySupplier,
  });
});

// Handle Supplier delete on POST.
exports.supplier_delete_post = asyncHandler(async (req, res, next) => {
 // Get details of supplier and all their products (in parallel)
 const [supplier1, allProductsbySupplier] = await Promise.all([
  supplier.findById(req.params.id).exec(),
  product.find({ supplier1: req.params.id }, "product description").exec(),
]);
  if (allProductsbySupplier.length > 0) {
    // Supplier has products. Render in same way as for GET route.
    res.render("supplier_delete", {
      title: "Delete Supplier",
      supplier: supplier1,
      productSuppliers: allProductsbySupplier,
    });
    return;
  } else {
    // Supplier has no products. Delete object and redirect to the list of authors.
    await supplier.findByIdAndDelete(req.body.supplierid);
    res.redirect("/inventory/suppliers");
  }
});

*/

// Display Category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category update GET");
});

// Handle Category update on POST.
exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category update POST");
});
