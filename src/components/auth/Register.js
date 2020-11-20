import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import FormValidator from '../../utils/FormValidator'
import validator from 'validator'
import Info from '@material-ui/icons/Info'
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Help from '@material-ui/icons/Help';
import AuthHelperMethods from '../../helpers/AuthHelperMethods';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import * as LinkRouter from "react-router-dom";
import { Redirect } from "react-router-dom";
import PropTypes from 'prop-types';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const validatorArg = new FormValidator([
  {
    field: 'email',
    method: validator.isEmpty,
    validWhen: false,
    message: 'Nombre de usuario requerido'
  },/*
  { 
    field: 'email',
    method: validator.isEmail,
    validWhen: true,
    message: 'That is not a valid email.'
  },*/
  { 
    field: 'password',
    method: validator.isEmpty,
    validWhen: false,
    message: 'Contraseña requerida'
  },
  { 
    field: 'nombre',
    method: validator.isNumeric,
    validWhen: false,
    message: 'Solo se permiten letras.'
  },
  { 
    field: 'nombre',
    method: validator.isEmpty,
    validWhen: false,
    message: 'Nombre requerido.'
  },
  { 
    field: 'apellido',
    method: validator.isEmpty,
    validWhen: false,
    message: 'Apellido requerido.'
  },
  { 
    field: 'apellido',
    method: validator.isNumeric,
    validWhen: false,
    message: 'Solo se permiten letras.'
  }
]);


let validationResponse =  {};
let registrado = false;
const Register = ({classes,mobile}) =>{

  const { from } = { from: { pathname: "/" } };
  const [state,setState] = useState({
    email:'',
    password:'',
    messageDialog:'',
    showDialog:false,
  });
  const [ formState, setFormState ] = useState({
    email:{value:'',errorMessage:''},
    password:{value:'',errorMessage:''},
    nombre:{value:'',errorMessage:''},
    apellido:{value:'',errorMessage:''}
  });
  let Auth = new AuthHelperMethods(process.env.REACT_APP_EP);
  
  useEffect(() =>{
    if (!Auth.loggedIn()){
      Auth.logout();
    }
  },[Auth]);

  function handleSubmit(event){

    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    const nombre = event.target.nombre.value;
    const apellido = event.target.apellido.value;

    setState(state => ({
      ...state,
      email:email,
      password:password,
      nombre:nombre,
      apellido:apellido,
    }));

    const validation = validatorArg.validate({email: email,password: password,nombre: nombre,apellido: apellido});
    setFormState({email:{value:email,errorMessage:validation.email.message},password:{value:password,errorMessage:validation.password.message},nombre:{value:nombre,errorMessage:validation.nombre.message},apellido:{value:apellido,errorMessage:validation.apellido.message}});
    validationResponse = {email: validation.email.isInvalid,password:validation.password.isInvalid,nombre:validation.nombre.isInvalid,apellido:validation.apellido.isInvalid}
    
    

    if (validation.isValid) {
      Auth.signUp({email, password,nombre,apellido})
        .then(res => {
          if (res.status === 400) {
            setState(state => ({
              ...state,
              messageDialog:res.err,
              showDialog:true,
            }));
            
          }
          else if (res.status === 200){
            setState(state => ({
              ...state,
              messageDialog:"Creado con exito",
              showDialog:true,
            }));
          }
        })
        .catch(err => {
          setState(state => ({
            ...state,
            messageDialog:"Ha ocurrido un error, intenta mas tarde",
            showDialog:true,
          }));
        });
    }
    return;

  }
    

  function handleClose() { 

    if (state.messageDialog === 'Creado con exito'){
      registrado = true;
      
    }
    setState(state => ({
      ...state,
      showDialog:false
    }));
  }

  if(state.messageDialog !== 'Creado con exito'){
    registrado = false;
  }
  if (registrado) {
    return <Redirect to={from}/>;
  }
        
  return(
    <Grid container component="main" className={classes.root} fixed = {'true'} justify={'center'} style={{padding: !mobile ? '1vh':'6vh'}}>
    <CssBaseline />
      <Grid container item xs={12} md={7} lg={5} component={Paper} elevation={7} square justify={'center'}>
        <Grid container item className={classes.paper} spacing={1} justify={'center'}>
        <Avatar className={classes.avatar}>
          <Help/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Crear Cuenta
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
              <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="nombre"
              label="Nombres"
              name="nombre"
              autoComplete="Nombres"
              autoFocus
              error={validationResponse.nombre}
              helperText={formState.nombre.errorMessage}
              />
              <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="apellido"
              label="Apellidos"
              name="apellido"
              autoComplete="Apellidos"
              error={validationResponse.apellido}
              helperText={formState.apellido.errorMessage}
              />
              <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="email"
              label="Usuario"
              name="email"
              autoComplete="email"
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
                TransitionComponent={Transition}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{"Attention!"}</DialogTitle>
                <DialogContent className={classes.dialogContent} >
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
                Crear
              </Button>
              <Grid container>
                <Grid item lg>
                <LinkRouter.Link to="/" className={classes.Link} style={{ textDecoration: 'none' }}>
                  Ya tienes cuenta? Inicia sesion
                </LinkRouter.Link>
                </Grid>
              </Grid>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
    
}

Register.propTypes= {
  classes: PropTypes.object,
  mobile: PropTypes.bool,
};

export default Register;