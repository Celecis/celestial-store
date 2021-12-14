import React, { useContext, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Design from '../components/layout';
import { AppStore } from '../utils/store';
import NextLink from 'next/link';
import Image from 'next/image';
import {
  Grid,
  TableContainer,
  Table,
  Typography,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Link,
  Button,
  Card,
  List,
  ListItem,
  CircularProgress,
} from '@material-ui/core';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';
import Cookies from 'js-cookie';

function PlaceOrder() {
  const router = useRouter();
  const { state, dispatch } = useContext(AppStore);
  const {
    userInfo,
    cart: { cartItems },
  } = state;

  const roundDecimal = (num) => Math.round((num + Number.EPSILON) * 100) / 100;
  //https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
  const totalPrice = roundDecimal(
    cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
  );

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, []);

  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const placeOrderHandler = async () => {
    closeSnackbar();
    try {
      setLoading(true);
      //setting isPaid to true, because this app does not have a payment method applied like paypal or stripe
      const isPaid = true;
      const paidAt = Date.now();

      //send AJAX request to backend to create an order
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems,
          totalPrice,
          isPaid,
          paidAt,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      //for the AJAX requesst, we need to pass the user token, otherwhise we will get "unauthorized" error
      //the 3rd param is options
      dispatch({ type: 'CLEAR_CART' });
      Cookies.remove('cartItems');
      setLoading(false);
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  if (!userInfo) {
    router.push('/login?redirect=/checkout');
  }

  return (
    <Design title="Shopping Cart">
      <Typography component="h1" variant="h1">
        Place Order
      </Typography>
      <Grid container spacing={1}>
        <Grid item md={8} xs={12}>
          <Card>
            <ListItem>
              <Typography variant="h2">Order Items</Typography>
            </ListItem>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Individual Price</TableCell>
                    <TableCell align="right">Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <NextLink href={`/product/${item.slug}`} passHref>
                          <Link>
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            ></Image>
                          </Link>
                        </NextLink>
                      </TableCell>

                      <TableCell>
                        <NextLink href={`/product/${item.slug}`} passHref>
                          <Link>
                            <Typography>{item.name}</Typography>
                          </Link>
                        </NextLink>
                      </TableCell>

                      <TableCell align="right">
                        <Typography>{item.quantity}</Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Typography>{item.price}€</Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Typography>{item.quantity * item.price}€</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
        <Grid item md={4} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Typography variant="h2">Order Summary</Typography>
              </ListItem>

              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>
                      <strong>Total Price:</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">
                      <strong>${totalPrice}</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                <Button
                  onClick={placeOrderHandler}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Place Order
                </Button>
              </ListItem>
              {loading && (
                <ListItem>
                  <CircularProgress />
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Design>
  );
}

export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false });
// dynamic accepts a function that returns a promise
// the resolve of that promise is our cart component
// as a 2nd argument we are going to set ssr to false

// Next.js supports ES2020 dynamic import() for JavaScript. With it you can import JavaScript
// modules dynamically and work with them. They also work with SSR - Server Side Rendering.
