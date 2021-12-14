import {
  Card,
  CardActions,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Button,
  makeStyles,
} from '@material-ui/core';
import NextLink from 'next/link';
import Design from '../components/layout';
//import data from '../utils/data';
import db from '../utils/db';
import Product from '../models/product-model';
import axios from 'axios';
import { useContext } from 'react';
import { AppStore } from '../utils/store';

const useStyles = makeStyles(() => ({
  button: {
    fontFamily: "'Comfortaa', cursive",
  },
}));

export default function Home(props) {
  const styles = useStyles();
  const { state, dispatch } = useContext(AppStore);
  const { products } = props;

  const addToCartHandler = async (product) => {
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
    <Design>
      <div>
        <Typography component="h1" variant="h1">
          Products
        </Typography>
        <Grid container spacing={4} className="grid">
          {products.map((product) => (
            <Grid item md={4} key={product.name}>
              <Card>
                <NextLink href={`/product/${product.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={product.image}
                      title={product.name}
                    ></CardMedia>
                    <CardContent>
                      <Typography component="h2" variant="h2">
                        {product.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  <Typography>{product.price}€</Typography>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => addToCartHandler(product)}
                    className={styles.button}
                  >
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Design>
  );
}

//If you export an async function called getServerSideProps from a page, Next.js will pre-render this page on each request using the data returned by getServerSideProps.
export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find({}).lean();
  //By default, Mongoose queries return an instance of the Mongoose Document class. Documents are much heavier than vanilla JavaScript objects, because they have a lot of internal state for change tracking.
  //Enabling the lean option tells Mongoose to skip instantiating a full Mongoose document and just give you the POJO.
  await db.disconnect();
  return {
    // will be passed to the page component as props
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
