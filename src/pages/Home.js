import React, { useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useMutation } from '@apollo/react-hooks';
import source from '../assets/images/bg-login.png';

const LOGIN = gql`
  mutation($input: AuthInputType) {
    login(input: $input) {
      token
    }
  }
`;

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
  },
  image: {
    height: '90vh',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  title: {
    marginBottom: '30px',
  },
}));

export default function SpacingGrid() {
  const classes = useStyles();

  const [login] = useMutation(LOGIN);

  const initialValues = useMemo(
    () => ({
      email: '',
      password: '',
    }),
    [],
  );

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .label('Email')
      .required(),
    password: Yup.string()
      .label('Senha')
      .required(),
  });

  const onSubmit = useCallback(async input => {
    await login({ variables: { input } });
  }, []);

  const { handleSubmit, handleChange, values } = useFormik({
    onSubmit,
    initialValues,
    validationSchema,
  });

  return (
    <Grid container className={classes.root}>
      <Grid container justify="center">
        <Grid item xs={12} sm={8} md={4}>
          <div className={classes.paper}>
            <Typography variant="h4" color="textSecondary" className={classes.title}>
              Bem vindo ao
            </Typography>
            <Typography variant="h2" className={classes.title}>
              ez.coins
            </Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="E-mail"
                name="email"
                autoComplete="email"
                onChange={handleChange}
                value={values.email}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={handleChange}
                value={values.password}
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                ENTRAR
              </Button>
            </form>
          </div>
        </Grid>
        <Grid item xs={false} sm={4} md={4}>
          <img src={source} alt="" className={classes.image} />
        </Grid>
      </Grid>
    </Grid>
  );
}