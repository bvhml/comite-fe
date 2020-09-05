import React, { useState, useEffect } from 'react';
import {TextField, Grid, Dialog, DialogActions, DialogContent, DialogContentText } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import FormValidator from '../../utils/FormValidator';
import validator from 'validator';
import Info from '@material-ui/icons/Info';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import AuthHelperMethods from '../../helpers/AuthHelperMethods';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';
import { useToasts } from 'react-toast-notifications';
import { useHistory } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const validatorArg2= new FormValidator([
  {
    field: 'username2',
    method: validator.isEmpty,
    validWhen: false,
    message: 'Nombre de usuario requerido'
  },
  { 
    field: 'password2',
    method: validator.isEmpty,
    validWhen: false,
    message: 'Contraseña requerida'
  },
]);


let validationResponse =  {};
const ResetMyPassword = ({classes,mobile}) =>{

  const { addToast } = useToasts();
  const Auth = new AuthHelperMethods(process.env.REACT_APP_EP);
  const history = useHistory();
  const [state,setState] = useState({
    username:'',
    password:'',
    messageDialog:'',
    showDialog:false,
  });

  const [ formState2, setFormState2 ] = useState({
    username2:{value:'',errorMessage:''},
    password2:{value:'',errorMessage:''},
  });

  useEffect(() =>{
    if (!Auth.loggedIn()){
      Auth.logout();
    }
  },[Auth]);

  function handleSubmitContraseña(event){

    event.preventDefault();
    const username2 = event.target.username2.value;
    const password2 = event.target.password2.value;
   
    const validation = validatorArg2.validate({username2: username2,password2: password2});
   
    setFormState2({username2:{value:username2,errorMessage:validation.username2.message},password2:{value:password2,errorMessage:validation.password2.message}});
    validationResponse = {username2: validation.username2.isInvalid,password2:validation.password2.isInvalid};
    
    if (validation.isValid) {
      Auth.resetMyPassword(username2, password2)
        .then(res => {
          if (res.status === 400) {
            setState(state => ({
              ...state,
              messageDialog:res.err,
            }));
            
          }
          else if (res.status === 200){

            Auth.logout();
            setState(state => ({
              ...state,
              messageDialog:'Contraseña reiniciada exitosamente, Inicie sesion con su nueva contraseña',
              showDialog: true,
            }));
          }
        })
        .catch(err => {
          setState(state => ({
            ...state,
            messageDialog:"Ha ocurrido un error, intenta mas tarde",
            
          }));
        });
    }else{
      addToast('Verifique los campos', { appearance: 'error', autoDismiss:true });
    }
    return;


  }
    

  function handleClose() { 

    const token = localStorage.getItem('id_token');

    setState(state => ({
      ...state,
      showDialog:false
    }));

    if (!token) {
      history.push('/');
    }
  }
      
  return(
    <Grid container component="main" className={classes.root} justify={'center'} style={{backgroundColor:'transparent', height:'100vh',padding:!mobile? '2vh':'5vh'}}>
    <CssBaseline />
      <Grid container item xs={12} md={12} component={Paper} elevation={7} square justify={'center'} style={{backgroundColor:'transparent'}}>
        <Grid container item className={classes.paper} spacing={1} justify={'center'}>
        <Typography component="h1" variant="h5">
          Reiniciar contraseña
        </Typography>
        <form className={classes.form} onSubmit={handleSubmitContraseña} noValidate autoComplete='off' style={{padding:!mobile ? '0':'20vh'}}>
          <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                name="username2"
                label="Usuario"
                type="text"
                id="username2"
                value={localStorage.getItem('usuario') || ''}
                disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                name="password2"
                label="Contraseña"
                type="text"
                id="password2"
                error={validationResponse.password2}
                helperText={formState2.password2.errorMessage}
                />
              </Grid>
              <Dialog
                open={state.showDialog}
                onClose={handleClose}
                TransitionComponent={Transition}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{"Mensaje:"}</DialogTitle>
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
                Reiniciar contraseña
              </Button>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
    
}

ResetMyPassword.propTypes= {
  classes: PropTypes.object,
  mobile: PropTypes.bool,
};

export default ResetMyPassword;