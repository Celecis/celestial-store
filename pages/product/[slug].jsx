import React, { useContext } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import {
  Grid,
  Link,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  makeStyles,
} from '@material-ui/core';
//import data from '../../utils/data';
import { AppStore } from '../../utils/store';
import Design from '../../components/layout';
import Product from '../../models/product-model';
import db from '../../utils/db';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  section: {
    margin: '10px 0px',
  },
  descriptions: {
    display: 'grid',
    alignContent: 'space-around',
  },
}));

export default function ViewProduct(props) {
  const { state, dispatch } = useContext(AppStore);
  const { product } = props;
  const styles = useStyles();
  //const router = useRouter();
  //const { slug } = router.query;
  //const product = data.products.find((a) => a.slug === slug);

  if (!product) {
    return <div>Product Not Found</div>;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
  };

  return (
    <Design title={product.name}>
      <NextLink href="/" passHref>
        <Link>Back to products</Link>
      </NextLink>
      <div className={styles.section}>
        <Grid container spacing={4}>
          <Grid item md={6} xs={12}>
            <Image
              src={product.image}
              alt={product.name}
              width="640"
              height="426"
              layout="responsive"
              objectFit="contain"
              placeholder="empty"
              rel="preload"
            ></Image>
          </Grid>
          <Grid item md={6} xs={12} className={styles.descriptions}>
            <Grid item xs={12}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    {product.name}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography>Category: {product.category}</Typography>
                </ListItem>
                <ListItem>
                  <Typography> Description: {product.description}</Typography>
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <List>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Price</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>{product.price}€</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Status</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>
                          {product.countInStock > 0
                            ? 'In stock'
                            : 'Unavailable'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={addToCartHandler}
                    >
                      Add to cart
                    </Button>
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Design>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}
