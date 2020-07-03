import { createMuiTheme } from '@material-ui/core/styles';
import { blue, deepOrange } from '@material-ui/core/colors';

const theme = createMuiTheme({
    overrides: {
      // Style sheet name ⚛️
      MuiButton: {
        root: {
          backgroundColor:blue[400],
          border: 0,
          color: 'white',
          "&:hover": { // increase the specificity for the pseudo class
            color: "white",
            backgroundColor:blue[900],
          }
        },
      },
      MuiPaper:{
        root: {
          backgroundColor:'#303030',
          color:'white',
          boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        },
      },
      MuiGrid:{
        root:{
          backgroundColor:'#2b2a2a',
        },
        item:{
          //backgroundColor:'#303030',
        },
        
      },
      MuiTextField:{
        root:{
          color :'white',   
          borderColor:blue,           
        },
      },
      MuiInputLabel: { // Name of the component ⚛️ / style sheet
        root: { // Name of the rule
          color: "white",
          borderColor:"white",
          "&$focused": { // increase the specificity for the pseudo class
            color: "white"
          }
        }
      },
      MuiOutlinedInput:{
        root:{
          color:'white',
          borderColor:"white",
          '&:hover': {
            borderColor: blue[100],
            borderWidth: 1,
          },
        },
        
        notchedOutline: {
          borderWidth: "1px",
          borderColor: blue[400],
          '&:hover': {
            borderColor: blue[100],
            borderWidth: 1,
          },
        },
      },
      MuiInputBase:{
        root:{
          color:'black',
        },
      },
      
    },
    palette: {
      primary: {
        light: '#69696a',
        main: '#28282a',
        dark: '#1e1e1f',
      },
      secondary: deepOrange,
      dark:'#303030',
    },
    status: {
      danger: 'orange',
    },
    paper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor:'#303030',
    },
    paperContainer: {
      backgroundColor:'#303030',
    },
    typography: {
      fontFamily: "'Work Sans', sans-serif",
      fontSize: 14,
      fontWeightLight: 300, // Work Sans
      fontWeightRegular: 400, // Work Sans
      fontWeightMedium: 700, // Roboto Condensed
      fontFamilySecondary: "'Roboto Condensed', sans-serif",
    },
  });

  const fontHeader = {
    color: theme.palette.primary,
    fontWeight: theme.typography.fontWeightMedium,
    fontFamily: theme.typography.fontFamilySecondary,
    textTransform: 'uppercase',
  };

const DarkTheme = createMuiTheme({
  ...theme,
    overrides: {
      // Style sheet name ⚛️
      MuiButton: {
        root: {
          color: 'white',
          backgroundColor:blue,
        },
        
      },
      MuiPaper:{
        root: {
          backgroundColor:'#303030',
          color:'white',
          boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        },
      },
      MuiGrid:{
        root:{
          backgroundColor:'#2b2a2a',
        },
        item:{
          backgroundColor:'#303030',
        },
        
      },
      MuiTextField:{
        root:{
          color :'white',   
          borderColor:blue,           
        },
      },
      MuiInputLabel: { // Name of the component ⚛️ / style sheet
        root: { // Name of the rule
          color: "white",
          borderColor:"white",
          "&$focused": { // increase the specificity for the pseudo class
            color: "white"
          }
        }
      },
      MuiOutlinedInput:{
        root:{
          color:'white',
          borderColor:"white",
        },
        notchedOutline: {
          borderWidth: "1px",
          borderColor: theme.palette.primary.main,
        },
      },
      MuiDivider:{
        light:{
          backgroundColor: theme.palette.primary.light,
        },
      },
      MuiTypography:{
        h6:{
          '&:hover':{
            color:blue[200],
          },
        },
        h5:{
          '&:hover':{
            color:blue[200],
          },
        },
        body1:{
          '&:hover':{
            color:blue[500],
          },
        }
      },
    },
    palette: {
      primary: blue,
      secondary: deepOrange,
      dark:'#303030',
    },
    status: {
      danger: 'orange',
    },
    paper: {
      margin: theme.spacing(8, 1), //8,1
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor:'#303030',
    },
    paperContainer: {
      backgroundColor:'#303030',
    },
    NavLink: {
      color:'white',
    },
    typography: {
      ...theme.typography,
      fontHeader,
      h1: {
        ...theme.typography.h1,
        ...fontHeader,
        letterSpacing: 0,
        fontSize: 60,
      },
      h2: {
        ...theme.typography.h2,
        ...fontHeader,
        fontSize: 48,
      },
      h3: {
        ...theme.typography.h3,
        ...fontHeader,
        fontSize: 42,
      },
      h4: {
        ...theme.typography.h4,
        ...fontHeader,
        fontSize: 36,
      },
      h5: {
        ...theme.typography.h5,
        fontSize: 20,
        fontWeight: theme.typography.fontWeightLight,
      },
      h6: {
        ...theme.typography.h6,
        ...fontHeader,
        fontSize: 18,
      },
      subtitle1: {
        ...theme.typography.subtitle1,
        fontSize: 18,
      },
      body1: {
        ...theme.typography.body2,
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: 16,
      },
      body2: {
        ...theme.typography.body1,
        fontSize: 14,
      },
    },
  });


export default DarkTheme;
