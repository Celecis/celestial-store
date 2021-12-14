import React, { useEffect, useContext, useReducer } from 'react';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { AppStore } from '../utils/store';
import { reducer, initialState } from '../utils/orderRequest';
import { getError } from '../utils/error';
import Design from '../components/layout';
import {
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Card,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@material-ui/core';
import useStyles from '../utils/styles';

function OrderHistory() {
  const { state } = useContext(AppStore);
  const [{ loading, error, orders }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const { userInfo } = state;
  const router = useRouter();
  const styles = useStyles();

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/history`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_ORDERS_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchOrders();
  }, []);

  return (
    <Design title="Order History">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={styles.section}>
            <List>
              <NextLink href="/profile" passHref>
                <ListItem button component="a">
                  <ListItemText primary="User Profile"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/order-history" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Order History"></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={styles.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Order History
                </Typography>
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={styles.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>DATE</TableCell>
                          <TableCell>TOTAL</TableCell>
                          <TableCell>PAID</TableCell>
                          <TableCell>DELIVERED</TableCell>
                          <TableCell>ACTION</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order._id.substring(20, 24)}</TableCell>
                            <TableCell>{order.paidAt}</TableCell>
                            <TableCell>{order.totalPrice}€</TableCell>
                            <TableCell>
                              {order.isPaid
                                ? `paid at ${order.paidAt}`
                                : 'not paid'}
                            </TableCell>
                            <TableCell>
                              {order.isDelivered
                                ? `delivered at ${order.deliveredAt}`
                                : 'not delivered'}
                            </TableCell>
                            <TableCell>
                              <NextLink href={`/order/${order._id}`} passHref>
                                <Button variant="contained">Details</Button>
                              </NextLink>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Design>
  );
}

export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false });
