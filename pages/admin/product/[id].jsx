import React, { useEffect, useContext, useReducer } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import { AppStore } from '../../../utils/store';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { getError } from '../../../utils/error';
import Design from '../../../components/layout';
import {
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  ListItemText,
  TextField,
  CircularProgress,
} from '@material-ui/core';
import useStyles from '../../../utils/styles';
import { reducer, initialState } from '../../../utils/products';

function EditProduct({ params }) {
  const { state } = useContext(AppStore);
  const productId = params.id;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, initialState);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const styles = useStyles();
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });
          const { data } = await axios.get(`/api/products/${productId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          dispatch({ type: 'FETCH_PRODUCT_SUCCESS', payload: data });
          setValue('slug', data.slug);
          setValue('name', data.name);
          setValue('category', data.category);
          setValue('size', data.size);
          setValue('image', data.image);
          setValue('price', data.price);
          setValue('countInStock', data.countInStock);
          setValue('description', data.description);
        } catch (err) {
          dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        }
      };
      fetchData();
    }
  }, []);

  //UPLOAD PHOTO
  const uploadHandler = async (e) => {
    //the file is going to be the file loaded from our pc
    const file = e.target.files[0];

    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    // By having:
    // Content-Type': 'multipart/form-data
    // in our header, it will let upload the file in our bodyFormData
    // through AJAX request

    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/admin/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });
      setValue('image', data.secure_url);

      //console.log(image);
      //secure_url will be the returned value from cloudinary server

      enqueueSnackbar('File uploaded successfully', { variant: 'success' });
    } catch (err) {
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  //UPDATE ITEM
  const submitHandler = async ({
    slug,
    name,
    category,
    size,
    image,
    price,
    countInStock,
    description,
  }) => {
    closeSnackbar();

    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/admin/product/${productId}`,
        {
          slug,
          name,
          category,
          size,
          image,
          price,
          countInStock,
          description,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      enqueueSnackbar('Product updated successfully', { variant: 'success' });
      router.push('/admin/products');
      //console.log(image);
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Design title={`Edit Product ${productId}`}>
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
                <Typography component="h1" variant="h1">
                  Product {productId}
                </Typography>
              </ListItem>
              <ListItem>
                {loading && <CircularProgress></CircularProgress>}
                {error && (
                  <Typography className={styles.error}>{error}</Typography>
                )}
              </ListItem>
              <ListItem>
                <form
                  onSubmit={handleSubmit(submitHandler)}
                  className={styles.form}
                >
                  <List>
                    <ListItem>
                      <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="name"
                            label="Name"
                            error={Boolean(errors.name)}
                            helperText={errors.name ? 'Name is required' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Controller
                        name="slug"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="slug"
                            label="Slug"
                            error={Boolean(errors.slug)}
                            helperText={errors.slug ? 'Slug is required' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Controller
                        name="price"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="price"
                            label="Price"
                            error={Boolean(errors.price)}
                            helperText={errors.price ? 'Price is required' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Controller
                        name="size"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="size"
                            label="Size"
                            error={Boolean(errors.size)}
                            helperText={errors.size ? 'Size is required' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Controller
                        name="category"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="category"
                            label="Category"
                            error={Boolean(errors.category)}
                            helperText={
                              errors.category ? 'Category is required' : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Controller
                        name="countInStock"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="countInStock"
                            label="Count In Stock"
                            error={Boolean(errors.countInStock)}
                            helperText={
                              errors.countInStock
                                ? 'Count In Stock is required'
                                : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Controller
                        name="description"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="description"
                            label="Description"
                            error={Boolean(errors.description)}
                            helperText={
                              errors.description
                                ? 'Description is required'
                                : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <Grid
                      container
                      spacing={1}
                      className={styles.alignItemsCenter}
                    >
                      <Grid item md={8} xs={12}>
                        <ListItem>
                          <Controller
                            name="image"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <TextField
                                variant="outlined"
                                fullWidth
                                id="image"
                                label="Image"
                                error={Boolean(errors.image)}
                                helperText={
                                  errors.image ? 'Image is required' : ''
                                }
                                {...field}
                              ></TextField>
                            )}
                          ></Controller>
                        </ListItem>
                      </Grid>
                      <Grid item md={4} xs={12}>
                        <ListItem>
                          <Button variant="contained" component="label">
                            Upload File
                            <input
                              type="file"
                              onChange={uploadHandler}
                              hidden
                            />
                          </Button>
                          {loadingUpload && (
                            <CircularProgress
                              className={styles.circularProgressMargin}
                            />
                          )}
                        </ListItem>
                      </Grid>
                    </Grid>

                    <ListItem>
                      <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        color="primary"
                      >
                        Update
                      </Button>
                      {loadingUpdate && (
                        <CircularProgress
                          className={styles.circularProgressMargin}
                        />
                      )}
                    </ListItem>
                  </List>
                </form>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Design>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(EditProduct), { ssr: false });
