const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  category: { type: Schema.ObjectId, ref: "Category", required: true },
  sku: { type: String, required: true, minLength: 8, maxLength: 12 },
  description: { type: String, required: true },
  supplier: [{ type: Schema.ObjectId, ref: "Supplier", required: true }],
  price: {type: Number, required: true},
  quantity: {type: Number,  required: true}
});


// Export model.
module.exports = mongoose.model("Product", ProductSchema);
