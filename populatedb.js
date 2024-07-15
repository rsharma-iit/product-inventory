#! /usr/bin/env node

console.log(
  'This script populates some producsts, suppliers and categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Product = require("./models/product");
const Category = require("./models/category");
const Supplier = require("./models/supplier");

const suppliers = [];
const categorys = [];
const products = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createSupplier();
  await createCategory();
  await createProduct();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// supplier[0] will always be the Microsoft, regardless of the order
// in which the elements of promise.all's argument complete.
async function supplierCreate(index, name, phone, address) {
  const supplierdetail = { name: name, phone: phone, address: address };
  const supplier= new Supplier(supplierdetail)
  await supplier.save();
  suppliers[index] = supplier;
  console.log(`Added supplier: ${name}`);
}

async function categoryCreate(index, name, description) {
  const categorydetail = { name: name,description: description };
  const category= new Category(categorydetail)
  await category.save();
  categorys[index] = category;
  console.log(`Added category: ${name}`);
}

async function productCreate(index, name, category, sku, description, supplier, price, quantity) {
  const product = {
    name: name,
    category: category,
    sku: sku,
    description: bookdesc,
    supplier: supplier,
    price: price,
    quantity: quantity
  };
  await product.save();
  products[index] = product;
  console.log(`Added product: ${name}`);
}



async function createSupplier() {
  console.log("Adding suppliers");
  await Promise.all([
    supplierCreate(0, "Microsoft",1234567890,"1 Farrer park"),
    supplierCreate(1, "AWS",1234567812,"1 Farrer park"),
    supplierCreate(2, "Google",1234567813,"1 Farrer park"),
  ]);
}

async function createCategory() {
  console.log("Adding category");
  await Promise.all([
    categoryCreate(0, "Electronics", "Electrical Stuff"),
    categoryCreate(1, "Home Appliance", "Kitchen electrical stuff"),
    categoryCreate(2, "Sports", "Play items"),
    categoryCreate(3, "Mens Clothing", "Dress shirts and pants"),
    categoryCreate(4, "Womens Clothing", "Women stuff"),
    categoryCreate(5, "Shoes", "Girls/Boys"),
    ]);
}

async function createProduct() {
  console.log("Adding Products");
  await Promise.all([
    productCreate(0,
      "Voltage Regulator",
      categorys[0],
      "123ADGVDA",
      "test123",
      [suppliers[1]],
      100,
      50
    ),
    productCreate(1,
      "Circuit Breaker",
      categorys[0],
      "12454DGVDA",
      "test123",
      [suppliers[1]],
      100,
      50
    ),
    productCreate(2,
      "Multimeter",
      categorys[1],
      "1237687DGVDA",
      "test123",
      [suppliers[1]],
      10,
      50
    ),
    productCreate(3,
      "Electric Motor",
      categorys[2],
      "123A234GVDA",
      "test123",
      [suppliers[2]],
      300,
      50
    ),
    productCreate(4,
      "LED Light Bulb",
      categorys[5],
      "123A123GVDA",
      "test123",
      [suppliers[0]],
      100,
      30
    ),
    productCreate(5,
      "Surge Protector",
      categorys[3],
      "123ADG879DA",
      "test123",
      [suppliers[2]],
      100,
      10
    ),
    productCreate(6,
      "Surge Low",
      categorys[4],
      "123ADG345DA",
      "test123",
      [suppliers[1]],
      100,
      40
    ),
  ]);
}

