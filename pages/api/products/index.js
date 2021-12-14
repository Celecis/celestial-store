import nc from 'next-connect';
//next-connect is a replacement of express
import Product from '../../../models/product-model';
import db from '../../../utils/db';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

export default handler;
