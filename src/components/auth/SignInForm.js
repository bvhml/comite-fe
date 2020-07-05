import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import FormValidator from './FormValidator'
import validator from 'validator'
import Info from '@material-ui/icons/Info'
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import * as LinkRouter from "react-router-dom";
import {Redirect} from "react-router-dom";
import AuthHelperMethods from '../../helpers/AuthHelperMethods';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';

const validatorArg = new FormValidator([
  {
    field: 'email',
    method: validator.isEmpty,
    validWhen: false,
    message: 'Ingresar un usuario'
  },
  { 
    field: 'password',
    method: validator.isEmpty,
    validWhen: false,
    message: 'Ingresar una contraseña'
  }
]);


let validationResponse =  {};

export default function SignInForm ({classes, mobile}) {


  const Auth = new AuthHelperMethods(process.env.REACT_APP_EP);
  const { from } = { from: { pathname: "/me" } };
  const [state,setState] = useState({
    email:'',
    password:'',
    messageDialog:'',
    showDialog:false,
  });

  const [ formState, setFormState ] = useState({
    email:{value:'',errorMessage:''},
    password:{value:'',errorMessage:''}
  });

  useEffect(() =>{
    if (!Auth.loggedIn()){
      Auth.logout();
    }
  }, [Auth]);
  
  function handleSubmit(event){
    
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    const validation = validatorArg.validate({email:email,password:password});
    setFormState({email:{value:email,errorMessage:validation.email.message},password:{value:password,errorMessage:validation.password.message}});
    validationResponse = {email: validation.email.isInvalid,password:validation.password.isInvalid}
    
    if (validation.isValid) {
      Auth.login(email, password)
        .then(res => {
          if (res.data.status === 400) {
            setState(state => ({
              ...state,
              messageDialog:"Usuario/Password no son correctos",
              showDialog:true,
            }));
          }
          else if (res.data.status === 200){
            setState(state => ({
              ...state,
              email:email,
              password:password,
            }));
          }
        })
        .catch(err => {
          setState(state => ({
            ...state,
            messageDialog:"Usuario/Password no son correctos",
            showDialog:true,
          }));
        });
    }
  }
  
  function handleClose() { 
    setState(state => ({
      ...state,
      showDialog:false
    }));
  } 

  if (Auth.loggedIn()) {
    return <Redirect to={from}/>;
  }
    return(
      <Grid container component="main" className={classes.root} fixed = {'true'} justify={'center'} style={{padding: !mobile ? '1vh':'6vh'}}>
        <CssBaseline />
        <Grid container item xs={12} md={7} lg={5} component={Paper} elevation={7} square justify={'center'} >
          <Grid container item className={classes.paper} justify={'center'}>
          <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
              Iniciar sesion
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit} noValidate autoComplete={'false'}>
                <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                id="email"
                label="Usuario"
                name="email"
                autoComplete="email"
                autoFocus
                error={validationResponse.email}
                helperText={formState.email.errorMessage}
                />
                <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
                error={validationResponse.password}
                helperText={formState.password.errorMessage}
                />
                <Dialog
                  open={state.showDialog}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{"Attention!"}</DialogTitle>
                  <DialogContent className={classes.dialogContent}>
                  <Avatar  className={classes.bigAvatar} >
                  <Info className={classes.icon} />
                  </Avatar>
                    <DialogContentText id="alert-dialog-description" className={classes.DialogContentText}>
                      {state.messageDialog}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                      Cerrar
                    </Button>
                  </DialogActions>
                </Dialog>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  >
                  Iniciar sesion
                </Button>
                <Grid container>
                {/*<Grid item xs>

                <LinkRouter.Link to="/" component={Link} className={classes.Link} style={{ textDecoration: 'none' }}>
                  Forgot password?
                </LinkRouter.Link>
                </Grid>*/}
                <Grid item>
                <LinkRouter.Link to="/register" className={classes.Link} style={{ textDecoration: 'none' }}>
                  No estas registrado? Crear cuenta
                </LinkRouter.Link>
                </Grid>
                </Grid>
            </form>
          </Grid>
        </Grid>
      </Grid>
    );
    
}