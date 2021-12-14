import React, { useContext, useEffect, useReducer } from 'react';
import dynamic from 'next/dynamic';
import Design from '../../components/layout';
import { AppStore } from '../../utils/store';
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
  Card,
  List,
  ListItem,
  CircularProgress,
  Button,
} from '@material-ui/core';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { getError } from '../../utils/error';
import { reducer, initialState } from '../../utils/orderRequest';
import useStyles from '../../utils/styles.js';

function Order({ params }) {
  const orderId = params.id;
  //the params.id will be equal to the dynamical id in the url

  const router = useRouter();
  const { state } = useContext(AppStore);
  const { userInfo } = state;
  const styles = useStyles();

  const [{ loading, error, order, loadingDeliver, successDeliver }, dispatch] =
    useReducer(reducer, initialState);

  const { orderItems, totalPrice, isPaid, paidAt, isDelivered, deliveredAt } =
    order;

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_ORDER_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (!order._id || successDeliver || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
    }
  }, [order, successDeliver]);

  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  async function deliverOrderHandler() {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      enqueueSnackbar('Order is delivered', { variant: 'success' });
    } catch (err) {
      dispatch({ type: 'DELIVER_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  }

  return (
    <Design title={`Order ${orderId}`}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography className={styles.error}>{error}</Typography>
      ) : (
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
                      <TableCell>Product</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Individual Price</TableCell>
                      <TableCell align="right">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderItems.map((item) => (
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
                        <strong>{totalPrice}€</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </Card>
            <Card className={styles.section}>
              <List>
                <ListItem>
                  <Typography variant="h2">Status</Typography>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>
                        <strong>Paid:</strong>
                      </Typography>
                      <Typography>Paid at:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">
                        <strong>{isPaid ? 'Paid' : 'Not paid'}</strong>
                      </Typography>
                      <Typography align="right">{paidAt}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>
                        <strong>Delivered:</strong>
                      </Typography>
                      <Typography>Delivered at:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">
                        <strong>
                          {isDelivered ? 'Delivered' : 'Not delivered'}
                        </strong>
                      </Typography>
                      <Typography align="right">
                        {deliveredAt}
                        {deliveredAt ? deliveredAt : 'Not delivered'}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </Card>
            <Card>
              {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <ListItem>
                  {loadingDeliver && <CircularProgress />}
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={deliverOrderHandler}
                  >
                    Deliver Order
                  </Button>
                </ListItem>
              )}
            </Card>
          </Grid>
        </Grid>
      )}
    </Design>
  );
}

export async function getServerSideProps({ params }) {
  return { props: { params } };
}

export default dynamic(() => Promise.resolve(Order), { ssr: false });
