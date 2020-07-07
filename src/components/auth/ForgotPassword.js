import React from 'react';
import axios from 'axios'
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import FormValidator from './FormValidator'
import validator from 'validator'
import Info from '@material-ui/icons/Info'
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Help from '@material-ui/icons/Help';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const validatorArg = new FormValidator([
  {
    field: 'email',
    method: validator.isEmpty,
    validWhen: false,
    message: 'Please provide an email address.'
  },
  { 
    field: 'email',
    method: validator.isEmail,
    validWhen: true,
    message: 'That is not a valid email.'
  },
  { 
    field: 'password',
    method: validator.isEmpty,
    validWhen: false,
    message: 'Email and Password required.'
  }
]);

var  validationResponse =  {email:false,password:false};

export default class ForgotPassword extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            email:'',
            password:'',
            messageDialog:'',
            showDialog:false,
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.emailInput = React.createRef();
        
    }

    focusInput(component) {
      if (component) {
          React.findDOMNode(component).focus(); 
      }
    }

    handleSubmit(event){

        const email = event.target.email.value;
        const password = event.target.password.value;
        
          axios.post('http://172.20.10.4/usuario', {
            nombre: email,
            apellido: password
          })
          .then( response => {
            //console.log(response);
              this.setState({
                email:email,
                password:password,
                messageDialog:response.data.mensaje,
                showDialog:true
            });

            const validation = validatorArg.validate(this.state);
            validationResponse = {email: validation.email.isInvalid,password:validation.password.isInvalid}

            if (validation.isValid) {
              console.log("TODO BIEN");
            }
            else{
              //if is Invalid
              if (validationResponse.email) { 
              }
              else if (validationResponse.password) {
                
              }
            }
          })
          .catch((error) => {
            //console.log(error);
              this.setState({
                email:email,
                password:password,
                messageDialog:error.data.mensaje,
                showDialog:true
            });

            const validation = validatorArg.validate(this.state);
            validationResponse = {email: validation.email.isInvalid,password:validation.password.isInvalid}
            
            if (validation.isValid) {
              console.log("TODO BIEN");
            }
            else{
              //if is Invalid
              if (validationResponse.email) {
                
              }
              else if (validationResponse.password) {
                
              }
            }
          });

        
      event.preventDefault();
      return;

      }
    
      componentDidUpdate(){

        
        if (validationResponse.email) {
          //console.log(this.emailInput.current);
           
        }
        else if (validationResponse.password) {
          
        }
      }

      handleClose() { 
        this.setState({
          showDialog:false
        });
      }

      

    render(){
        const {classes,handleClick} = this.props;
        
        
        return(
            <div className={classes.paper} spacing={5}>
              <Avatar className={classes.avatar}>
                  <Help/>
              </Avatar>
              <Typography component="h1" variant="h5">
                  Forgot Password
              </Typography>
             
            
              <form className={classes.form} onSubmit={this.handleSubmit} noValidate>
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
                    inputRef={this.emailInput}
                    
                    />

                    <Dialog
                      open={this.state.showDialog}
                      onClose={this.handleClose}
                      TransitionComponent={Transition}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">{"Attention!"}</DialogTitle>
                      <DialogContent className={classes.dialogContent}>
                      <Info className={classes.icon} />
                        <DialogContentText id="alert-dialog-description" >
                          
                          {this.state.messageDialog}
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={this.handleClose} color="primary" autoFocus>
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
                      Restore Password
                    </Button>
                    <Grid container>
                    <Grid item xs>
                    <Link href="#" className={classes.Link} onClick={handleClick('signIn')}>
                        Have already an account, Sign In
                    </Link>
                    </Grid>
                    <Grid item>
                      <Link href="#" variant="body2"  className={classes.Link} onClick={handleClick('register')}>
                        Don't have an account? Sign Up
                      </Link>
                    </Grid>
                    </Grid>
                </form>
              </div>
        );
    }
}