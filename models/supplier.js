const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SupplierSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
  phone: { type: Number, min: 10, max: 99999999999, required: true},
  address: { type: String, required: true, minLength: 3, maxLength: 100 }
  
});

// Virtual for supplier's URL
SupplierSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/inventory/supplier/${this._id}`;
});

// Export model.
module.exports = mongoose.model("Supplier", SupplierSchema);