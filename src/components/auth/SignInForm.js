import React, { useEffect, useReducer, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import FormValidator from '../../utils/FormValidator'
import validator from 'validator'
import Info from '@material-ui/icons/Info'
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import * as LinkRouter from "react-router-dom";
import {Redirect} from "react-router-dom";
import AuthHelperMethods from '../../helpers/AuthHelperMethods';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Slide from '@material-ui/core/Slide';
import { rolesEnum } from '../../enums/RolesEnum';
import { useHistory } from 'react-router-dom';
import UserHelperMethods from '../../helpers/UserHelperMethods';
import Hidden from '@material-ui/core/Hidden';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const validatorArg = new FormValidator([
  {
    field: 'username',
    method: validator.isEmpty,
    validWhen: false,
    message: 'Ingresar un usuario'
  },
  {
    field: 'username',
    method: validator.isEmail,
    validWhen: true,
    message: 'Ingresar un email valido'
  },
  { 
    field: 'password',
    method: validator.isEmpty,
    validWhen: false,
    message: 'Ingresar una contraseña'
  }
]);

function loginReducer(state, action) {
  switch (action.type) {
    case 'field': {
      return {
        ...state,
        [action.fieldName]: action.payload,
      };
    }
    case 'login': {
      return {
        ...state,
        error: '',
        isLoading: true,
      };
    }
    case 'success': {
      return {
        ...state,
        isLoggedIn: true,
        isLoading: false,
      };
    }
    case 'error': {
      return {
        ...state,
        error: 'El usuario y/o contraseña no son válidos',
        showError: true,
        isLoggedIn: false,
        isLoading: false,
      };
    }
    case 'logOut': {
      return {
        ...state,
        isLoggedIn: false,
      };
    }
    case 'hideDialog': {
      return {
        ...state,
        showError: false,
      };
    }
    case 'hideLoading': {
      return {
        ...state,
        isLoading: false,
      };
    }
    default:
      return state;
  }
}

const initialState = {
  username: '',
  password: '',
  isLoading: false,
  error: '',
  showError: false,
  isLoggedIn: false,
};

let validationResponse =  {};

const SignInForm =  ({classes, mobile}) => {

  const history = useHistory();
  const Auth = new AuthHelperMethods(process.env.REACT_APP_EP);
  
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const [usuario, setUsuario] = useState({});
  const { username, password, isLoading, error, showError } = state;

  useEffect(() =>{
    if (!Auth.loggedIn()){
      Auth.logout();
    }
  }, [Auth]);  

  const initializeSessionByRole = () => {
    switch(usuario.rol) {
      case rolesEnum.PILOTO:
      case rolesEnum.SOLICITANTE:
      case rolesEnum.DIRECTOR:
        history.push('/home/viaje');
        break;
      case rolesEnum.ADMINISTRADOR:
        history.push('/home/vehiculos');
        break;
      case rolesEnum.SUPPORT:
        history.push('/home/usuarios');
        break;
    }
  }
  
  function handleSubmit(e){
    
    e.preventDefault();
    dispatch({ type: 'login' });

    const validation = validatorArg.validate({username,password});
    validationResponse = {username: validation.username.isInvalid,password:validation.password.isInvalid}
    
    if (validation.isValid) {
      Auth.login(username, password)
        .then(async res => {
          if (res.data.status === 400) {
            dispatch({ type: 'error' });
          }
          else if (res.data.status === 200){
            localStorage.setItem("usuario", res.data.user);
            let signal = axios.CancelToken.source();
            const UserHelperMethodsInstance = new UserHelperMethods(process.env.REACT_APP_EP); 
            const response = await UserHelperMethodsInstance.buscarUsuario(res.data.user, signal.token)
            setUsuario(response)
            initializeSessionByRole();
            dispatch({ type: 'success' });
          }
        })
        .catch(err => {
          dispatch({ type: 'error' });
        });
    }else{
    dispatch({ type: 'hideLoading' });
    }
  }
  
  function handleClose() { 
    dispatch({ type: 'hideDialog' });
  } 

  if (Auth.loggedIn()) {
    initializeSessionByRole();
  }
    return(
      <Grid container component="main" className={classes.root} fixed = {'true'} justify={'center'} style={{padding: !mobile ? '1vh':'3vh 12vh', height:'auto', minHeight:'100vh'}}>
        <CssBaseline />
        <Grid container item xs={12} md={7} lg={5} component={Paper} elevation={6}>
          <Grid container item className={classes.paper} justify={'center'} spacing={6}>
            <Grid container item justify='center'>
              <img src="/logo.png" alt="logo" style={{width:'260px', height:'180px'}}/>
            </Grid>
            <Grid container item justify='center'>
              <form className={classes.form} onSubmit={handleSubmit} noValidate autoComplete={'false'}>
                <Typography style={{color:validationResponse.username ? 'red':'#54686f'}}>
                Usuario
                </Typography>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="email"
                  label=""
                  name="email"
                  autoComplete="email"
                  autoFocus
                  error={validationResponse.email}
                  InputLabelProps={{
                    classes: {
                      root: classes.cssLabel,
                      focused: classes.cssFocused,
                    },
                  }}
                  InputProps={{
                    classes: {
                      root: classes.cssOutlinedInput,
                      focused: classes.cssFocused,
                      notchedOutline: classes.notchedOutline,
                    },
                  }}
                  className={classes.inputLogin}
                  onChange={(e)=>
                  dispatch({
                    type: 'field',
                    fieldName: 'username',
                    payload: e.currentTarget.value,
                })}
                />
                <Typography style={{color: validationResponse.password ? 'red':'#54686f'}}>
                Contraseña
                </Typography>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  name="password"
                  label=""
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  error={validationResponse.password}
                  InputLabelProps={{
                    classes: {
                      root: classes.cssLabel,
                      focused: classes.cssFocused,
                    },
                  }}
                  InputProps={{
                    classes: {
                      root: classes.cssOutlinedInput,
                      focused: classes.cssFocused,
                      notchedOutline: classes.notchedOutline,
                    },
                  }}
                  className={classes.inputLogin}
                  onChange={(e)=>
                  dispatch({
                    type: 'field',
                    fieldName: 'password',
                    payload: e.currentTarget.value,
                })}
                />
                <Grid container item justify='flex-end' style={{fontSize:'12px'}}>
                <LinkRouter.Link to="/" className={classes.Link} style={{ textDecoration: 'none' }}>
                  Olvide mi contraseña
                </LinkRouter.Link>
                </Grid>  
                <Dialog
                  open={showError}
                  onClose={handleClose}
                  TransitionComponent={Transition}
                  keepMounted
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{"Atencion"}</DialogTitle>
                  <DialogContent className={classes.dialogContent}>
                  <Avatar  className={classes.bigAvatar} >
                  <Info className={classes.icon} />
                  </Avatar>
                    <DialogContentText id="alert-dialog-description" className={classes.DialogContentText}>
                      {error}
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
                  className={classes.submit}
                  >
                  { isLoading ? <CircularProgress style={{color:'white', width:'24px', height:'24px'}}/>:'Ingresar'}
                </Button>
              </form>
            </Grid>  
          </Grid>
        </Grid> 
        <Hidden mdDown>
          <Grid item xs={false} sm={5} md={7} component={Paper} className={classes.image} elevation={5} square style={{borderRadius: '0px 3px 3px 0px'}}/>
        </Hidden> 
      </Grid>
    );
    
}

SignInForm.propTypes= {
  classes: PropTypes.object,
  mobile: PropTypes.bool,
};

export default SignInForm;