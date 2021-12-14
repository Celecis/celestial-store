import nc from 'next-connect';
//next-connect is a replacement of express
import Order from '../../../models/order-model';
import { isAuth } from '../../../utils/auth';
import { onError } from '../../../utils/error';
import db from '../../../utils/db';

const handler = nc({
  onError,
});

//middleware for handler to use and get req.user._id value taken from user token in header
handler.use(isAuth);

//GET ORDER FROM BACKEND OF CURRENT USER
handler.get(async (req, res) => {
  await db.connect();
  const orders = await Order.find({ user: req.user._id });
  res.send(orders);
});

export default handler;
