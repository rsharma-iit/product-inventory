const express = require("express");
const router = express.Router();

// Require controller modules.
const product_controller = require("../controllers/productController");
const supplier_controller = require("../controllers/supplierController");
const category_controller = require("../controllers/categoryController");

/// product ROUTES ///

//GET inventory home page.
router.get("/products", product_controller.product_list);

// GET request for creating a product. NOTE This must come before routes that display product (uses id).
router.get("/product/create", product_controller.product_create_get);

// POST request for creating product.
router.post("/product/create", product_controller.product_create_post);

// GET request to delete product.
router.get("/product/:id/delete", product_controller.product_delete_get);

// POST request to delete product.
router.post("/product/:id/delete", product_controller.product_delete_post);

// GET request to update product.
router.get("/product/:id/update", product_controller.product_update_get);

// POST request to update product.
router.post("/product/:id/update", product_controller.product_update_post);

// GET request for one Product.
router.get("/product/:id", product_controller.product_detail);

/// category ROUTES ///

// GET request for list of all category.
router.get("/categorys", category_controller.category_list);

// GET request for creating a category. NOTE This must come before route that displays category (uses id).
router.get("/category/create", category_controller.category_create_get);

//POST request for creating category.
router.post("/category/create", category_controller.category_create_post);

// GET request to delete category.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete category.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update category.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update category.
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for one Category.
router.get("/category/:id", category_controller.category_detail);



//Supplier Routes
// GET request for creating a supplier. NOTE This must come before route that displays supplier (uses id).
router.get("/supplier/create", supplier_controller.supplier_create_get);

//POST request for creating supplier.
router.post("/supplier/create", supplier_controller.supplier_create_post);

// GET request to delete supplier.
router.get("/supplier/:id/delete", supplier_controller.supplier_delete_get);

// POST request to delete supplier.
router.post("/supplier/:id/delete", supplier_controller.supplier_delete_post);

// GET request to update supplier.
router.get("/supplier/:id/update", supplier_controller.supplier_update_get);

// POST request to update supplier.
router.post("/supplier/:id/update", supplier_controller.supplier_update_post);


// GET request for list of all supplier.
router.get("/suppliers", supplier_controller.supplier_list);

// GET request for one Supplier.
router.get("/supplier/:id", supplier_controller.supplier_detail);

module.exports = router;
