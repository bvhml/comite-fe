import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import FormValidator from '../../utils/FormValidator'
import validator from 'validator'
import { Redirect } from "react-router-dom";
import AuthHelperMethods from '../../helpers/AuthHelperMethods';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import NavBar from './NavBar'
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

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



 function Me (props) {


      const [state,setState] = useState({
        email:'',
        password:'',
        messageDialog:'',
        showDialog:false,
        bandera:false,
      });
 
   

    
    let Auth = new AuthHelperMethods(process.env.REACT_APP_EP);
    
    
    useEffect(() =>{
      let Authenticate = new AuthHelperMethods(process.env.REACT_APP_EP);
      if (Authenticate.loggedIn()){
        //this.props.history.replace('/');
        //console.log("Ya inicie sesion ME");
        //information = Auth.validateMe();
        //console.log(information.username);
        //Authenticate.validateMe();
        //decoded = Auth.getConfirm();
        //console.log(decoded);
      }
      else{
        console.log("No inicie sesion");
        Authenticate.logout();
      }
    }, []);

    // eslint-disable-next-line
    function logOut(){
        setState({
          ...state,
          showDialog:false
        });
        Auth.logout();
      }

     /* function ListItemLink(props) {
        return <ListItem button component="a" {...props} />;
      }
      */

        const {classes} = props;
        let { from } = { from: { pathname: "/" } };
        if (!Auth.loggedIn()) {
          return <Redirect to={from}/>;
        }
        else{
         // information = Auth.validateMe();
        }
        
        return(
          
          <Grid container component="main" className={classes.root} >
          <CssBaseline />
          {/* HEADER */}
            <Grid container component={Paper} elevation={7} square style= {{backgroundColor: 'green'}}>
              <Grid item xs ={12} sm={12} md={12} style={{backgroundColor:'blue',height:'auto'}}>
                <NavBar classes={classes}/>

                <Grid container item style={{backgroundColor:'transparent'}}>
                  <List style={{width:'100%'}}>
                    <Divider component="li" light/>
                    <li>
                    </li>
                  </List>
                </Grid>
                
              </Grid> 
              <List style={{width:'100%'}}>
                <Divider component="li" light/>
                <li>
                </li>
                </List> 
              {/* BODY 
              <Grid container style= {{backgroundColor:'red'}}>
                
              </Grid>  
              */}
              {/* FOOTER 
              <Grid item container style={{backgroundColor:'yellow',height:'100px',alignSelf:'flex-end'}} justify={'flex-end'} >
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={logOut}
                  style={{height:'50px',width:'100px',margin:'0px 40px 0px 0px'}}
                  >
                  Log Out
                </Button>
              </Grid> 

            */}

            </Grid>  
            

            
          </Grid>
            
        );
    
}

export default Me;