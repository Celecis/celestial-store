import React, { useContext, useState } from 'react';
import { AppStore } from '../utils/store';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Link,
  makeStyles,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Badge,
  Button,
  Menu,
  MenuItem,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  navbar: {
    backgroundColor: '#b9cee3',
    '& a': {
      color: 'black',
      margin: '10px 50px',
    },
  },
  navbarButton: {
    backgroundColor: '#fff',
    color: '#b9cee3',
    marginRight: '50px',
    '&:hover': {
      color: 'white',
    },
  },

  grow: {
    flexGrow: 1,
  },

  main: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  container: {
    marginTop: '64px',
    minHeight: '80vh',
    padding: '4rem 2rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  footer: {
    display: 'flex',
    padding: '1rem 0',
    borderTop: '1px solid #eaeaea',
    justifyContent: 'center',
    alignItems: 'center',
    '& a': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexGrow: 1,
    },
  },
}));

export default function Design({ title, description, children }) {
  const { state, dispatch } = useContext(AppStore);
  const { cart, userInfo } = state;
  const styles = useStyles();
  const router = useRouter();

  const totalQuantity = cart.cartItems.reduce((acc, item) => {
    return (acc += item.quantity);
  }, 0);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleLoginClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);
    if (redirect !== 'backdropClick') {
      router.push(redirect);
    }
  };

  const handleLogoutClick = () => {
    setAnchorEl(null);
    dispatch({ type: 'USER_LOGOUT' });
    Cookies.remove('userInfo');
    Cookies.remove('cartItems');
    router.push('/');
  };

  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '2rem',
        fontWeight: 400,
        marginBottom: '1rem',
        fontFamily: "'Outfit', sans-serif",
        paddingLeft: '16px',
        paddingRight: '16px',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
        fontFamily: "'Comfortaa', cursive",
      },
      subtitle1: { fontFamily: "'Comfortaa', cursive" },
      body1: { fontWeight: 'normal', fontFamily: "'Outfit', sans-serif" },
    },
    palette: {
      type: 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
    },
  });

  return (
    <div className={styles.main}>
      <Head>
        <title>
          {title ? `Celestial Design: ${title}` : `Celestial Design`}
        </title>
        {description && <meta name="description" content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="fixed" className={styles.navbar}>
          <Toolbar>
            <NextLink href="/" passHref>
              <Link>Celestial Design</Link>
            </NextLink>
            <div className={styles.grow}></div>
            <div>
              <NextLink href="/cart" passHref>
                <Link>
                  {cart.cartItems.length > 0 ? (
                    <Badge color="secondary" badgeContent={totalQuantity}>
                      Cart
                    </Badge>
                  ) : (
                    'Cart'
                  )}
                </Link>
              </NextLink>
              {userInfo ? (
                <>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleLoginClick}
                    className={styles.navbarButton}
                  >
                    {userInfo.name}
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={loginMenuCloseHandler}
                  >
                    <MenuItem
                      onClick={(e) => loginMenuCloseHandler(e, '/profile')}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={(e) =>
                        loginMenuCloseHandler(e, '/order-history')
                      }
                    >
                      Order History
                    </MenuItem>
                    {userInfo.isAdmin && (
                      <MenuItem
                        onClick={(e) =>
                          loginMenuCloseHandler(e, '/admin/dashboard')
                        }
                      >
                        Admin Dashboard
                      </MenuItem>
                    )}
                    <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href="/login" passHref>
                  <Link>Login</Link>
                </NextLink>
              )}
            </div>
          </Toolbar>
        </AppBar>
        <Container className={styles.container}>{children}</Container>
        <footer className={styles.footer}>
          <Typography>All rights reserved. Celestial Design.</Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
}
