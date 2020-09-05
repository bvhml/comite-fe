import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import FormValidator from '../../utils/FormValidator';
import validator from 'validator';
import Typography from '@material-ui/core/Typography';
import AuthHelperMethods from '../../helpers/AuthHelperMethods';
import UserHelperMethods from '../../helpers/UserHelperMethods';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { useToasts } from 'react-toast-notifications';
import axios from 'axios';

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
const Dashboard = ({classes,mobile}) =>{

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
  },[]);

        
  return(
        <Grid container item xs={12} md={12} component={Paper} elevation={5} square spacing={2} style={{backgroundColor:'transparent', padding:'10vh', minHeight:'100vh', height:'auto'}} justify={'center'} alignContent='center'>
        <Grid item xs={12} md={5} container justify='center'>
          <Typography component="h1" variant="h5" style={{color:'#54686f'}}>
            Bienvenido <strong>{localStorage.getItem('usuario')}</strong>, esta pagina esta en desarrollo. Puedes explorar otras paginas en el menu izquierdo.
          </Typography>
        </Grid>
        </Grid>
  );
    
}

Dashboard.propTypes= {
  classes: PropTypes.object,
  mobile: PropTypes.bool,
};

export default Dashboard;