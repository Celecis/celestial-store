import nc from 'next-connect';
import Product from '../../models/product-model';
import User from '../../models/user-model';
import db from '../../utils/db';
import data from '../../utils/data';

const handler = nc();

// sending data to mongoDB on machine
// we can see if data is on the "server" using MongoDB Compass

handler.get(async (req, res) => {
  await db.connect();
  await Product.deleteMany();
  await Product.insertMany(data.products);
  await User.deleteMany();
  await User.insertMany(data.users);
  await db.disconnect();
  res.send({ message: 'seeded successfully' });
});

export default handler;
