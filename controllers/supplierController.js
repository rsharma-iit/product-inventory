const notifier = require('node-notifier');
const supplier = require("../models/supplier");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


//supplier list page
exports.supplier_list = asyncHandler(async (req, res, next) => {
  const allsuppliers = await supplier.find({}, "name")
    .sort({ name: 1 })

    .exec();

  res.render("suppliers", { title: "Suppliers List", supplier_list: allsuppliers});
});



// Display detail page for a specific supplier.
exports.supplier_detail = asyncHandler(async (req, res, next) => {
  // Get details of suppliers
  const [supplier1] = await Promise.all([
    supplier.findById(req.params.id).exec(),
  
  ]);

  if (supplier1 === null) {
    // No results.
    const err = new Error("Supplier not found");
    err.status = 404;
    return next(err);
  }

  res.render("supplier_detail", {
    name: supplier1.name,
    supplier: supplier1,
    
  });
});



// Display supplier create form on GET.
exports.supplier_create_get = asyncHandler(async (req, res, next) => {
  res.render("supplier_form", { title: "Create Supplier" });
});

// Handle supplier create on POST.

exports.supplier_create_post = [
  // Validate and sanitize the name field.
  body("name", "Supplier name should be 3-100 characters")
    .trim()
    .isLength({ min: 3},{ max: 100}),
  body("phone")
    .trim()
    .isLength({min: 10},{ max: 9999999999})
    .escape()
    .isNumeric()
    .withMessage("Phone Number must be numbers"),
  body("address", "Supplier address should be 3-100 characters")
    .trim()
    .isLength({ min: 3},{ max: 100}),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a supplier object with escaped and trimmed data.
    const supplier1 = new supplier({ 
      name: req.body.name, 
      phone: req.body.phone,
      address: req.body.address
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("supplier_form", {
        title: "Create Supplier",
        supplier: supplier1,
        errors: errors.array(),
      });
      return;
    } else {

        await supplier1.save();
        // New supplier saved. Redirect to genre detail page.
        notifier.notify({
          title: 'Supplier Added!',
          message: 'good stuff!',
//          icon: path.join(__dirname, 'icon.jpg'),
//          sound: true,
          wait: true
        })}
    }
  ),
];














// Display supplier delete form on GET.
exports.supplier_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: supplier delete GET");
});

// Handle supplier delete on POST.
exports.supplier_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: supplier delete POST");
});

// Display supplier update form on GET.
exports.supplier_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: supplier update GET");
});

// Handle supplier update on POST.
exports.supplier_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: supplier update POST");
});
