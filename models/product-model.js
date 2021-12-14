import mongoose from 'mongoose';

const reqString = {
  type: String,
  required: true,
};

// SCHEMA
const productSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    name: reqString,
    category: reqString,
    size: reqString,
    image: reqString,
    price: {
      type: Number,
      required: true,
    },
    countInStock: {
      type: Number,
      default: 0,
    },
    description: reqString,
  },
  {
    timestamps: true,
  }
);

// MODEL
const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
