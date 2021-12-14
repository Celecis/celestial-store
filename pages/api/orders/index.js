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

//CREATE ORDER IN BACKEND
handler.post(async (req, res) => {
  await db.connect();
  const newOrder = new Order({
    ...req.body,
    user: req.user._id,
  });
  const order = await newOrder.save();
  res.status(201).send(order);
  console.log(req);
  //201 is the CREATE Status Code
});

/*  ...req.body is the data comming from checkout.jsx axios.post() 2nd param:
        {
          orderOItems: cartItems,
          totalPrice,
        },
        it does not contain the user info who made the order
        for it to be included, we need to pass userInfo.token aswell
        for this we can create a "middleware" where we check if user is logged in and authorized
        https://auth0.com/docs/security/tokens/json-web-tokens/validate-json-web-tokens
        to place an order and also pass that info to our new Order via an isAuth function*/

export default handler;
