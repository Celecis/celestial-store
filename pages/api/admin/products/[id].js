import nc from 'next-connect';
import Product from '../../../../models/product-model';
import { isAuth, isAdmin } from '../../../../utils/auth';
import { onError } from '../../../../utils/error';
import db from '../../../../utils/db';

const handler = nc({
  onError,
});
handler.use(isAuth, isAdmin);

handler.put(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    product.slug = req.body.slug;
    product.name = req.body.name;
    product.category = req.body.category;
    product.image = req.body.image;
    product.size = req.body.size;
    product.price = req.body.price;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    await product.save();
    await db.disconnect();
    res.send({ message: 'Product Updated Successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Product Not Found' });
  }
});

handler.delete(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    await product.remove();
    await db.disconnect();
    res.send({ message: 'Product Deleted' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Product Not Found' });
  }
});

export default handler;
