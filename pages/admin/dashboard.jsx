import React, { useEffect, useContext, useReducer } from 'react';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { AppStore } from '../../utils/store';
import { reducer, initialState } from '../../utils/admin';
import { getError } from '../../utils/error';
import Design from '../../components/layout';
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
import useStyles from '../../utils/styles';

function AdminDashboard() {
  const { state } = useContext(AppStore);
  const [{ loading, error, summary }, dispatch] = useReducer(
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
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/dashboard`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUMMARY_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  return (
    <Design title="Admin Dashboard">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={styles.section}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Admin Dashboard"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/products" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Products"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/users" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Users"></ListItemText>
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
                  Summary
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
                          <TableCell>TOTAL ORDERS</TableCell>
                          <TableCell>TOTAL PRODUCTS SOLD</TableCell>
                          <TableCell>TOTAL SALES</TableCell>
                          <TableCell>TOTAL USERS</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>{summary.ordersCount}</TableCell>
                          <TableCell>{summary.productsCount}</TableCell>
                          <TableCell>{summary.ordersPrice}€</TableCell>
                          <TableCell>{summary.usersCount}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
          <Card className={styles.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Orders
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
                          <TableCell>USER</TableCell>
                          <TableCell>DATE</TableCell>
                          <TableCell>TOTAL</TableCell>
                          <TableCell>PAID</TableCell>
                          <TableCell>DELIVERED</TableCell>
                          <TableCell>ACTION</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {summary.orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order._id.substring(20, 24)}</TableCell>
                            <TableCell>
                              {order.user ? order.user.name : 'DELETED USER'}
                            </TableCell>
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

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });
