import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Grid, Button, FormHelperText } from '@material-ui/core';
import AuthHelperMethods from '../../helpers/AuthHelperMethods';
import UserHelperMethods from '../../helpers/UserHelperMethods';
import { BrowserRouter as Router, Route, Redirect, useHistory, useParams } from 'react-router-dom';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import CommuteIcon from '@material-ui/icons/Commute';
import axios from 'axios';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { Dashboard } from '.';
import { Usuarios } from '../usuarios/index';

import './inicio.css'


export default function PersistentDrawerLeft({ classes, mobile }) {
  const theme = useTheme();
  const open = true;
  const Auth = new AuthHelperMethods(process.env.REACT_APP_EP);  
  const [ usuario, setUsuario ] = useState(null);
  const history = useHistory();
  let params = useParams();

  
  useEffect(()=>{
    let signal = axios.CancelToken.source();
    const getUsuario = async ()=>{
      const UserHelperMethodsInstance = new UserHelperMethods(process.env.REACT_APP_EP); 
      try {
        const response = await UserHelperMethodsInstance.buscarUsuario(localStorage.getItem('usuario'),signal.token)
        setUsuario(response);
        if (response) {
          if ((Number(response.inicio_sesion) === 0) && false) {
            history.push('/reiniciar-contraseña');
          }
        } 
      } catch (error) {
          if (axios.isCancel(error)) {
            //console.log('Error: ', error.message); // => prints: Api is being canceled
        }
      }  
    }
    getUsuario();
    return ()=>{signal.cancel('Api is being canceled');}
  },[history]);
  
  

  return (
    <div className="menu-principal">
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <div className="menu-principal__logo">
            <img src="/logo.png" alt="logo" style={{width:'200px'}}/>
          </div>          
        </div>
        <List>

          {usuario ? 
            ((usuario.rol === 2 || usuario.rol === 3 || true)? 
          <ListItem button key={'Vehiculos'} onClick={()=>{history.push('/home/vehiculos')}}>
            <ListItemIcon>{<CommuteIcon onClick={()=>{history.push('/home/vehiculos')}}/>}</ListItemIcon>
            <ListItemText primary={'Vehiculos'}/>
          </ListItem>:null):null}
          

          {usuario &&
          ((usuario.rol === 3 || true) &&
          <ListItem button key={'Usuarios'} onClick={()=>{history.push('/home/usuarios')}}>
            <ListItemIcon><AssignmentIndIcon onClick={()=>{history.push('/home/usuarios')}}/></ListItemIcon>
            <ListItemText primary={'Usuarios'}/>
          </ListItem>
          )}

          <ListItem button key={'Cambiar mi contraseña'} onClick={()=>{history.push('/reiniciar-contraseña')}}>
            <ListItemIcon>{<VpnKeyIcon onClick={()=>{history.push('/programa')}}/>}</ListItemIcon>
            <ListItemText primary={'Cambiar mi contraseña'}/>
          </ListItem>
        </List>
        <div className="cerrar-sesion" onClick={()=>{Auth.logout()}}>
          <ExitToAppIcon />
          <span>Cerrar sesión</span>       
        </div>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <Grid container component="main" className={classes.root} style={{backgroundColor:'transparent', height:"auto", minHeight:'100vh'}}>
            <CssBaseline />
            { getComponent(params.pagina, classes, mobile) }  
        </Grid>
      </main>
    </div>
  );
}

const getComponent = (pagina, classes, mobile) => {
  switch(pagina) {
    case 'vehiculos': return <Dashboard classes={classes} mobile={mobile}/>
    case 'usuarios': return <Usuarios classes={classes} mobile={mobile}/>
  }
}
