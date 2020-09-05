import React, { useState, useEffect } from 'react';
import {TextField, Grid, Dialog, DialogActions, DialogContent, DialogContentText, FormControl, InputLabel, Select, FormHelperText } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import FormValidator from '../../utils/FormValidator';
import validator from 'validator';
import Info from '@material-ui/icons/Info';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import AuthHelperMethods from '../../helpers/AuthHelperMethods';
import UserHelperMethods from '../../helpers/UserHelperMethods';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const validatorArg = new FormValidator([
  {
    field: 'username',
    method: validator.isEmpty,
    validWhen: false,
    message: 'Nombre de usuario requerido'
  },
  { 
    field: 'username',
    method: validator.isEmail,
    validWhen: true,
    message: 'Ingrese un correo electronico valido'
  },
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
  },
  { 
    field: 'rol',
    method: validator.isEmpty,
    validWhen: false,
    message: 'Seleccione un rol.'
  },
]);

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
const Vehiculos = ({classes,mobile}) =>{

  const { addToast } = useToasts();
  const [state,setState] = useState({
    username:'',
    password:'',
    messageDialog:'',
    showDialog:false,
  });
  const [ formState, setFormState ] = useState({
    username:{value:'',errorMessage:''},
    password:{value:'',errorMessage:''},
    nombre:{value:'',errorMessage:''},
    apellido:{value:'',errorMessage:''},
    email:{value:'',errorMessage:''},
    rol:{value:'',errorMessage:''},
  });


  const [ formState2, setFormState2 ] = useState({
    username2:{value:'',errorMessage:''},
    password2:{value:'',errorMessage:''},
  });

  const [users, setUsers] = useState(null);
  
  useEffect(() =>{
    const Auth = new AuthHelperMethods(process.env.REACT_APP_EP);
    if (!Auth.loggedIn()){
      Auth.logout();
    }

    let signal = axios.CancelToken.source();
    const getUsuarios = async ()=>{
      let UserHelperMethodsInstance = new UserHelperMethods(process.env.REACT_APP_EP);

      try {
        const response = await UserHelperMethodsInstance.buscarUsuarios(signal.token);
        setUsers(response);
      } catch (error) {
        if (axios.isCancel(error)) {
          //console.log('Error: ', error.message); // => prints: Api is being canceled
        }
      }
      
    }

    getUsuarios();

    return ()=>{signal.cancel('Api is being canceled');}
  },[]);

  function handleSubmit(event){

    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    const nombre = event.target.nombre.value;
    const apellido = event.target.apellido.value;
    const rol = event.target.rol.value;

    const validation = validatorArg.validate({username,password,nombre,apellido,rol});
    setFormState({username:{value:username,errorMessage:validation.username.message},password:{value:password,errorMessage:validation.password.message},nombre:{value:nombre,errorMessage:validation.nombre.message},apellido:{value:apellido,errorMessage:validation.apellido.message},rol:{value:rol,errorMessage:validation.rol.message}});
    validationResponse = {username: validation.username.isInvalid,password:validation.password.isInvalid,nombre:validation.nombre.isInvalid,apellido:validation.apellido.isInvalid,rol:validation.rol.isInvalid};

    const Auth = new AuthHelperMethods(process.env.REACT_APP_EP);
    if (validation.isValid) {
      event.target.username.value = '';
      event.target.password.value = '';
      event.target.nombre.value = '';
      event.target.apellido.value = '';
      event.target.rol.value = '';

      Auth.signUp(username, password,nombre,apellido,rol)
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
    }else{
      addToast('Verifique los campos', { appearance: 'error', autoDismiss:true });
    }
    return;

  }
  function handleSubmitContraseña(event){

    event.preventDefault();
    const username2 = event.target.username2.value;
    const password2 = event.target.password2.value;

    const validation = validatorArg2.validate({username2: username2,password2: password2});
   
    setFormState2({username2:{value:username2,errorMessage:validation.username2.message},password2:{value:password2,errorMessage:validation.password2.message}});
    validationResponse = {username2: validation.username2.isInvalid,password2:validation.password2.isInvalid};
    
    const Auth = new AuthHelperMethods(process.env.REACT_APP_EP);
    if (validation.isValid) {
      event.target.username2.value = '';
      event.target.password2.value = '';
      Auth.resetPassword(username2, password2)
        .then(res => {
          if (res.status === 400) {
            setState(state => ({
              ...state,
              messageDialog:res.err,
            }));
            
          }
          else if (res.status === 200){
            addToast('Contraseña reiniciada exitosamente!', { appearance: 'success', autoDismiss:true });
            event.target.password2.value = '';
            setState(state => ({
              ...state,
              messageDialog:"Contraseña reiniciada con exito",
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
    setState(state => ({
      ...state,
      showDialog:false
    }));
  }
        
  return(
      <Grid container item xs={12} md={12} component={Paper} elevation={5} square spacing={2} style={{backgroundColor:'transparent', padding:'10vh', minHeight:'100vh'}} justify={'center'} alignContent='center'>
        <Grid container item className={classes.paper} spacing={1} justify={'center'}>
        <Grid item container justify='center'>
          <Typography component="h1" variant="h5" style={{color:'#54686f'}}>
            Vehiculos
          </Typography>
        </Grid>
        </Grid>
      </Grid>
  );
    
}

Vehiculos.propTypes= {
  classes: PropTypes.object,
  mobile: PropTypes.bool,
};

export default Vehiculos;