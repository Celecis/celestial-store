import React, { useContext, useEffect } from 'react';
import Design from '../components/layout';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { AppStore } from '../utils/store';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  List,
  ListItem,
  Typography,
  TextField,
  Button,
  Link,
} from '@material-ui/core';
import useStyles from '../utils/styles';
import { Controller, useForm } from 'react-hook-form';
//Controller is like a wrapper for <TextField> MATERIALUI element
//HTML5 email pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
//[a-z0-9._%+-]: name
//[a-z0-9.-]: dom
//[a-z]{2,4}$: extension of given dom
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';

export default function Login() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();
  //const { redirect } = router.query; // login?redirect=/checkout
  const { state, dispatch } = useContext(AppStore);
  const { userInfo } = state;
  const styles = useStyles;

  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
  }, []);

  //const [email, setEmail] = useState('');
  //const [password, setPassword] = useState('');
  //there is no need to use useState to get/set values when we use React Hook Form

  const submitHandlerClick = async ({ email, password }) => {
    closeSnackbar();
    try {
      const { data } = await axios.post('/api/users/login', {
        email,
        password,
      });
      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));
      //for js-cookie version above 3.0.0 use JSON.stringify(data) instead of data
      router.push('/');
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Design title="Login">
      <form onSubmit={handleSubmit(submitHandlerClick)} className={styles.form}>
        <Typography component="h1" variant="h1">
          Login
        </Typography>
        <List>
          <ListItem>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="Email"
                  inputProps={{ type: 'email' }}
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email
                      ? errors.email.type === 'pattern'
                        ? 'Email is not valid'
                        : 'Email is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="password"
                  label="Password"
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password
                      ? errors.password.type === 'minLength'
                        ? 'Password length has to be more than 5'
                        : 'Password is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Login
            </Button>
          </ListItem>

          <ListItem>
            Don&apos;t have an account? &nbsp;
            <NextLink href={'/register'} passHref>
              <Link>Register</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Design>
  );
}
