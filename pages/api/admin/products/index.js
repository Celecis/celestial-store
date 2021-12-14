import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../utils/auth';
import Product from '../../../../models/product-model';
import db from '../../../../utils/db';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

handler.post(async (req, res) => {
  await db.connect();
  const newProduct = new Product({
    slug: 'sample-slug-' + Math.random(),
    name: 'sample name',
    category: 'sample category',
    size: 'A4',
    image: '/images/shirt1.jpg',
    price: 0,
    countInStock: 0,
    description: 'sample description',
  });

  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: 'Product Created', product });
});

export default handler;
