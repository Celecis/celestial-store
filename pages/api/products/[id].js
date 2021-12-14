import nc from 'next-connect';
//next-connect is a replacement of express
import Product from '../../../models/product-model';
import db from '../../../utils/db';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
});

export default handler;
