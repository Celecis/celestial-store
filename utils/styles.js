import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  navbar: {
    backgroundColor: '#b9cee3',
    '& a': {
      color: 'black',
      margin: '10px',
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
  form: {
    maxWidth: 800,
    width: '100%',
    margin: '0 auto',
  },
  error: {
    color: '#f04040',
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
  justifyGrid: {
    display: 'grid',
  },
  justifyGridItem: {
    margin: '5px 0px',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  circularProgressMargin: {
    marginLeft: '30px',
  },
});

export default useStyles;
