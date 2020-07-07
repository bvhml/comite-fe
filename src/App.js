import React,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import blue from '@material-ui/core/colors/blue';
import deepOrange from '@material-ui/core/colors/deepOrange';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import SignInForm from './components/auth/SignInForm';
import ForgotPassword from './components/auth/ForgotPassword';
import Me from './components/auth/Me';
import Register from './components/auth/Register';
import AuthHelperMethods from './helpers/AuthHelperMethods';
import DarkTheme from './DarkTheme';
import PirateTheme from './PirateTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

let theme = PirateTheme;
let themeName = 'Dark';




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
      backgroundImage: 'url(https://source.unsplash.com/random)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
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
      width: '70%', // Fix IE 11 issue.
      //marginTop: theme.spacing(1),
      
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
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
  }));
  const classes = useStyles();
  let Auth = new AuthHelperMethods(process.env.REACT_APP_EP);

  const [tema, setTema] = useState({
    checkedA: false,
    checkedB: true,
  });

  const handleChange = name => event => {
    
    console.log(event.target.checked);
    setTema({ ...tema, [name]: event.target.checked});
    if (event.target.checked) {
      themeName = 'Dark';
      theme = DarkTheme;
    }
    else{
      themeName = 'Light';
      theme = PirateTheme;
    }
    return;
    };
 

  //const [greeting, setGreeting] = React.useState('Hello World');


  function SignInFormRoute(){
    return <SignInForm handleChange={handleChange} classes={classes} themeName={themeName} checkedB={tema.checkedB}/>
  }  

  // eslint-disable-next-line
  function ForgotPasswordRoute(){
    return <ForgotPassword classes={classes} />
  }  
  function ProtectedRoute(){
    return <Me handleChange={handleChange} classes={classes} themeName={themeName} checkedB={tema.checkedB}/>
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
        <Router>
          <Route path="/" exact component={SignInFormRoute}>
            <SignInForm handleChange={handleChange} classes={classes} themeName={themeName} checkedB={tema.checkedB} mobile={mobile}/>
          </Route>
          <Route path="/register" exact>
            <Register handleChange={handleChange} classes={classes} themeName={themeName} checkedB={tema.checkedB} mobile={mobile}/>
          </Route>
          <PrivateRoute path="/me" component={ProtectedRoute} />
        </Router>
      </ThemeProvider>
    );
}