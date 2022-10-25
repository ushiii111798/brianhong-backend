//DB Setup
import mongoose from 'mongoose';

const ProductsSchema = new mongoose.Schema({
  title: String,
  img: String,
  seller: String,
  salePrice: String,
  gotoURL: String,
});

export const Products = mongoose.model('Products', ProductsSchema, 'Products');
