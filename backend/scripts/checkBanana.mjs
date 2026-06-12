import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('Product', productSchema);

await mongoose.connect(process.env.MONGO_URI || process.env.DATABASE_URL);
console.log('Connected');

const banana = await Product.findOne({ name: /banana/i }).lean();
if (!banana) {
  console.log('Banana not found');
} else {
  console.log('=== BANANA PRODUCT ===');
  console.log('name:', banana.name);
  console.log('price:', banana.price);
  console.log('salePrice:', banana.salePrice);
  console.log('originalPrice:', banana.originalPrice);
  console.log('variants:', JSON.stringify(banana.variants, null, 2));
}

await mongoose.disconnect();
