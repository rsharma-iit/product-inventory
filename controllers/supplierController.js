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














// Display Suppler delete form on GET.
exports.supplier_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of supplier and all associated products (in parallel)
  const [supplier1, productsfromSupplier] = await Promise.all([
    supplier.findById(req.params.id).exec(),
    product.find({ supplier: req.params.id }, "name description").exec(),
  ]);
  if (supplier1 === null) {
    // No results.
    res.redirect("/inventory/suppliers");
  }

  res.render("supplier_delete", {
    title: "Delete Supplier",
    supplier: supplier1,
    supplier_product: productsfromSupplier,
  });
});

// Handle Supplier delete on POST.
exports.supplier_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of supplier and all associated products (in parallel)
  const [supplier1, productsfromSupplier] = await Promise.all([
    supplier.findById(req.params.id).exec(),
    product.find({ supplier: req.params.id }, "name description").exec(),
  ]);

  if (productsfromSupplier.length > 0) {
    // Suppliers has suppliers. Render in same way as for GET route.
    res.render("supplier_delete", {
      title: "Delete Supplier",
      supplier: supplier1,
      supplier_product: productsfromSupplier,
    });
    return;
  } else {
    // Supplier has no products. Delete object and redirect to the list of suppliers.
    await supplier.findByIdAndDelete(req.body.id);
    res.redirect("/inventory/suppliers");
  }
});











// Display Supplier update form on GET.
exports.supplier_update_get = asyncHandler(async (req, res, next) => {
  const supplier1 = await supplier.findById(req.params.id).exec();

  if (supplier1 === null) {
    // No results.
    const err = new Error("supplier not found");
    err.status = 404;
    return next(err);
  }

  res.render("supplier_form", { title: "Update Supplier", supplier: supplier1 });
});


// Handle Supplier update on POST.
exports.supplier_update_post = [
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
    // Extract the validation errors from a request .
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data (and the old id!)
    const supplier1 = new supplier({ 
      name: req.body.name, 
      phone: req.body.phone,
      address: req.body.address,
      _id: req.params.id,     
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.render("supplier_form", {
        title: "Create Supplier",
        supplier: supplier1,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      await supplier.findByIdAndUpdate(req.params.id, supplier1);
      res.redirect(supplier1.url);
    }
  }),
];