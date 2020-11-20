import React, { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import AuthHelperMethods from '../../helpers/AuthHelperMethods';
import PropTypes from 'prop-types';



const Dashboard = ({classes,mobile}) =>{
  
  useEffect(() =>{
    const Auth = new AuthHelperMethods(process.env.REACT_APP_EP);
    if (!Auth.loggedIn()){
      Auth.logout();
    }
  },[]);

        
  return(
    <div className="dashboard">
      <Typography component="h1" variant="h5" style={{color:'#54686f'}}>
          Bienvenido <strong>{localStorage.getItem('usuario')}</strong>, esta pagina esta en desarrollo. Puedes explorar otras paginas en el menu izquierdo.
        </Typography>
    </div>
  );
    
}

Dashboard.propTypes= {
  classes: PropTypes.object,
  mobile: PropTypes.bool,
};

export default Dashboard;