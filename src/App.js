import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import blue from '@material-ui/core/colors/blue';
import deepOrange from '@material-ui/core/colors/deepOrange';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import SignInForm from './components/auth/SignInForm';
import AuthHelperMethods from './helpers/AuthHelperMethods';
import PirateTheme from './PirateTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Register from './components/auth/Register';
import { Inicio } from './components/inicio';
import { ToastProvider } from 'react-toast-notifications';

let theme = PirateTheme;




export default function App (props) {

  
  const mobile = useMediaQuery('(min-width:600px)');
  let useStyles = makeStyles(theme => ({
    root: {
      height:  '100vh',
      padding: '6vh',
    },
    footer: {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'center',
      overflow: 'hidden',
      //background: 'linear-gradient(to right bottom, #2c3e50, #82ffa1)',
      backgroundColor: 'transparent',
      height: '100vh',
      alignItems: 'center',
    },
    image: {
      //backgroundImage: 'url(https://source.unsplash.com/random)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundImage: 'url(\'/cars-moving.gif\')',
      background:'linear-gradient(90deg, rgba(0,145,212,1) 0%, rgba(1,126,211,1) 35%, rgba(1,102,212,1) 100%);'
    },
    paper: {
      margin: theme.spacing(8, 1), //8,1
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    paperContainer: {
      backgroundColor:'#303030',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    photo: {
      margin: 10,
      width: 100,
      height: 100,
    },
    bigPhoto: {
      margin: 10,
      width: 75,
      height: 75,
      background: theme.palette.background.paper,
      color: 'red',
    },
    bigAvatar: {
      margin: 10,
      width: 100,
      height: 100,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      //marginTop: theme.spacing(1),
      
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      background:'linear-gradient(90deg, rgba(0,145,212,1) 0%, rgba(1,126,211,1) 35%, rgba(1,102,212,1) 100%);', 
      color:'white', 
      textTransform:'none'
    },
    palette: {
      primary: blue,
      secondary: deepOrange,
    },
    status: {
      danger: 'orange',
    },
    icon: {
      fontSize: 100,
      color:'#273c75'
    },
    dialogContent:{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent:'center',
      width:'50vw',
      maxWidth:400,
      minWidth:220,
      color: 'white',
    },
    DialogContentText:{
      color:blue[400],
    },
    Link: {
      color:blue[400],
    },
    NavLink: {
      textDecoration: 'none',
      color:'white',
      backgroundColor:'transparent',
    },
    MadeBy: {
      color:'white',
      backgroundColor:'transparent',
      display: 'flex',
      justifyContent: 'center',
    },
    ContainerFooter: {
      backgroundColor:'transparent',
    },
    bluredForm: {
      width: 'auto',
      borderRadius: '5px',
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    search: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      height:'53px',
      width: 200,
      margin:`-10px 0 0 ${theme.spacing(2)}px`,
      backgroundColor:theme.palette.background.paper,
    },
    dividerFullWidth: {
      margin: `500px 0 0 ${theme.spacing(2)}px`,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    cssOutlinedInput: {
      '&$cssFocused $notchedOutline': {
        borderColor: 'white',
      }
    },
    cssFocused: {},
    notchedOutline: {
      borderWidth: '0px',
      borderColor: '#eaf6fb !important'
    },
    inputLogin:{
      backgroundColor:'#eaf6fb'
    }
  }));
  
  const classes = useStyles();
  let Auth = new AuthHelperMethods(process.env.REACT_APP_EP);

  function ProtectedRoute(){
    return <Inicio classes={classes} mobile={mobile}/>
  }  
  
  function PrivateRoute({ component: Component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          Auth.loggedIn() ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/"
              }}
            />
          )
        }
      />
    );
  }
    return (
      <ThemeProvider theme={theme}>
        <ToastProvider placement={'bottom-center'}>
          <Router>
            <Route path="/" exact>
              <SignInForm classes={classes} mobile={mobile}/>
            </Route>
            <Route path="/registrarse" exact>
              <Register classes={classes} mobile={mobile}/>
            </Route>
            <PrivateRoute path="/home/:pagina" component={ProtectedRoute}/>
            <PrivateRoute path="/home/:pagina/:entidad" component={ProtectedRoute}/>
          </Router>
        </ToastProvider>
      </ThemeProvider>
    );
}