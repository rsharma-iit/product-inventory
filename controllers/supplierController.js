const supplier = require("../models/supplier");
const asyncHandler = require("express-async-handler");

// Display list of all supplier.
exports.supplier_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Supplier list");
});


// Display supplier create form on GET.
exports.supplier_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: supplier create GET");
});

// Handle supplier create on POST.
exports.supplier_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: supplier create POST");
});

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
