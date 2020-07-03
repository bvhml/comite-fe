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



export const validatorArg = new FormValidator([
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

export default function SignInForm (props) {
  
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
      
    let emailInput = React.createRef();
    
    let Auth = new AuthHelperMethods();

    useEffect(() =>{
      let Authenticate = new AuthHelperMethods();
      if (Authenticate.loggedIn()){
        //this.props.history.replace('/');
        //console.log("Ya inicie sesion");
      }
      else{
        //console.log("No inicie sesion");
        Authenticate.logout();
      }
    }, []);
    
    function handleSubmit(event){
     
      event.preventDefault();


      const email = event.target.email.value;
      const password = event.target.password.value;
      const validation = validatorArg.validate({email:email,password:password});
      setFormState({email:{value:email,errorMessage:validation.email.message},password:{value:password,errorMessage:validation.password.message}});
    

      validationResponse = {email: validation.email.isInvalid,password:validation.password.isInvalid}
      

      if (validation.isValid) {
        //console.log("TODO BIEN");
          

        Auth.login(email, password)
          .then(res => {
            if (res.data.status === 400) {
              setState(state => ({
                ...state,
                messageDialog:"Usuario/Password no son correctos",
                showDialog:true,
              }));
              //return alert("Usuario/Password no son correctos");
              
            }
            else if (res.data.status === 200){
              
                //this.props.history.replace('/');
                console.log("Respuesto correcta de Log In");
                
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
      else{
        //if is Invalid
        
      }
      
      setState(state => ({
        ...state,
        email:email,
        password:password,
      }));
      
      return;

      }
    

      function handleClose() { 
        setState(state => ({
          ...state,
          showDialog:false
        }));
      }

      

   
        const {classes} = props;
        
        let { from } = { from: { pathname: "/me" } };
    

        if (Auth.loggedIn()) {
          return <Redirect to={from}/>;
        }
        return(
          <Grid container component="main" className={classes.root} fixed = {'true'} justify={'center'}>
          <CssBaseline />
              <Grid container item xs={12} sm={7} md={5} component={Paper} elevation={7} square justify={'center'} >
                <Grid container item className={classes.paper} justify={'center'}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit} noValidate autoComplete={'false'}>
                      <TextField
                      variant="outlined"
                      margin="dense"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      error={validationResponse.email}
                      helperText={formState.email.errorMessage}
                      inputRef={emailInput}
                      
                      />
                      <TextField
                      variant="outlined"
                      margin="dense"
                      required
                      fullWidth
                      name="password"
                      label="Password"
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
                            Dismiss
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
                        Sign In
                      </Button>
                      <Grid container>
                      {/*<Grid item xs>

                      <LinkRouter.Link to="/" component={Link} className={classes.Link} style={{ textDecoration: 'none' }}>
                        Forgot password?
                      </LinkRouter.Link>
                      </Grid>*/}
                      <Grid item>
                      <LinkRouter.Link to="/register" className={classes.Link} style={{ textDecoration: 'none' }}>
                        Don't have an account? Sign Up
                      </LinkRouter.Link>
                      </Grid>
                      </Grid>
                  </form>
                </Grid>
              </Grid>
          </Grid>
        );
    
}