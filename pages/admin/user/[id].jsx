import React, { useEffect, useContext, useReducer, useState } from 'react';
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
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import useStyles from '../../../utils/styles';
import { reducer, initialState } from '../../../utils/users';

function EditUser({ params }) {
  const { state } = useContext(AppStore);
  const userId = params.id;
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  //Checkbox does not work with useForm()
  const [isAdmin, setIsAdmin] = useState(false);

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
          const { data } = await axios.get(`/api/admin/users/${userId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setIsAdmin(data.isAdmin);
          dispatch({ type: 'FETCH_USER_SUCCESS', payload: data });
          setValue('name', data.name);
          setValue('email', data.email);
        } catch (err) {
          dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        }
      };
      fetchData();
    }
  }, []);

  //UPDATE ITEM
  const submitHandler = async ({ name, email }) => {
    closeSnackbar();

    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/admin/users/${userId}`,
        {
          name,
          email,
          isAdmin,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      enqueueSnackbar('User updated successfully', { variant: 'success' });
      router.push('/admin/users');
      //console.log(image);
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Design title={`Edit User ${userId}`}>
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
                <ListItem button component="a">
                  <ListItemText primary="Products"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/users" passHref>
                <ListItem selected button component="a">
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
                  User {userId}
                </Typography>
              </ListItem>
              <ListItem>
                {loading && <CircularProgress />}
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
                        name="email"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="email"
                            label="Email"
                            error={Boolean(errors.email)}
                            helperText={errors.email ? 'Email is required' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <FormControlLabel
                        label="Is Admin?"
                        control={
                          <Checkbox
                            onClick={(e) => setIsAdmin(e.target.checked)}
                            checked={isAdmin}
                            name="isAdmin"
                          />
                        }
                      ></FormControlLabel>
                    </ListItem>

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

export default dynamic(() => Promise.resolve(EditUser), { ssr: false });
