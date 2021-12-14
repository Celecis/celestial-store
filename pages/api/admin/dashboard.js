import nc from 'next-connect';
import Order from '../../../models/order-model';
import Product from '../../../models/product-model';
import User from '../../../models/user-model';
import { isAuth, isAdmin } from '../../../utils/auth';
import { onError } from '../../../utils/error';
import db from '../../../utils/db';

const handler = nc({
  onError,
});
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();

  const orders = await Order.find({}).populate('user', 'name');
  const ordersCount = await Order.countDocuments();
  const productsCount = await Product.countDocuments();
  const usersCount = await User.countDocuments();
  const ordersPriceGroup = await Order.aggregate([
    {
      $group: {
        _id: null,
        sales: { $sum: '$totalPrice' },
      },
    },
  ]);
  const ordersPrice =
    ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

  await db.disconnect();
  res.send({
    ordersCount,
    productsCount,
    usersCount,
    ordersPrice,
    orders,
  });
});

export default handler;
