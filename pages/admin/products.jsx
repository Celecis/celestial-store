import React, { useEffect, useContext, useReducer } from 'react';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { AppStore } from '../../utils/store';
import { reducer, initialState } from '../../utils/products';
import { getError } from '../../utils/error';
import { useSnackbar } from 'notistack';
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
  CardMedia,
} from '@material-ui/core';
import useStyles from '../../utils/styles';

function AdminProducts() {
  const { state } = useContext(AppStore);
  const router = useRouter();
  const styles = useStyles();
  const { userInfo } = state;

  const [
    { loading, error, products, loadingCreate, successDelete, loadingDelete },
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/products`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_PRODUCTS_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const { enqueueSnackbar } = useSnackbar();

  //CREATE NEW PRODUCT BUTTON
  const createHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        `/api/admin/products`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'CREATE_SUCCESS' });
      enqueueSnackbar('Product created successfully', { variant: 'success' });
      router.push(`/admin/products/${data.product._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  //DELETE PRODUCT
  const deleteHandler = async (productId) => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    try {
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/admin/products/${productId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'DELETE_SUCCESS' });
      enqueueSnackbar('Product deleted successfully', { variant: 'success' });
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Design title="Products">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={styles.section}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Admin Dashboard"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/products" passHref>
                <ListItem selected button component="a">
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
                <Grid container className={styles.alignItemsCenter}>
                  <Grid item xs={6}>
                    <Typography component="h1" variant="h1">
                      Products
                    </Typography>
                    {loadingDelete && <CircularProgress />}
                  </Grid>
                  <Grid item xs={6} align="right">
                    <Button
                      onClick={createHandler}
                      color="primary"
                      variant="contained"
                    >
                      Create
                    </Button>
                    {loadingCreate && <CircularProgress />}
                  </Grid>
                </Grid>
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
                          <TableCell>IMAGE</TableCell>
                          <TableCell>ID</TableCell>
                          <TableCell>NAME</TableCell>
                          <TableCell>PRICE</TableCell>
                          <TableCell>SIZE</TableCell>
                          <TableCell>CATEGORY</TableCell>
                          <TableCell>COUNT</TableCell>
                          <TableCell>ACTIONS</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product._id}>
                            <TableCell>
                              {product._id.substring(20, 24)}
                            </TableCell>
                            <TableCell>
                              <CardMedia
                                component="img"
                                image={product.image}
                                title={product.name}
                                width={50}
                                height={50}
                              ></CardMedia>
                            </TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.price}€</TableCell>
                            <TableCell>{product.size}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{product.countInStock}</TableCell>
                            <TableCell className={styles.justifyGrid}>
                              <NextLink
                                href={`/admin/product/${product._id}`}
                                passHref
                              >
                                <Button
                                  size="small"
                                  variant="contained"
                                  className={styles.justifyGridItem}
                                >
                                  Edit
                                </Button>
                              </NextLink>{' '}
                              <Button
                                onClick={() => deleteHandler(product._id)}
                                size="small"
                                variant="contained"
                                className={styles.alignItemsCenter}
                              >
                                Delete
                              </Button>
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

export default dynamic(() => Promise.resolve(AdminProducts), { ssr: false });
