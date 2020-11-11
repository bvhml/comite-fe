import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Grid } from '@material-ui/core';
import AuthHelperMethods from '../../helpers/AuthHelperMethods';
import UserHelperMethods from '../../helpers/UserHelperMethods';
import { useHistory, useParams } from 'react-router-dom';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import CommuteIcon from '@material-ui/icons/Commute';
import axios from 'axios';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Usuarios } from '../usuarios/index';
import Vehiculos from '../vehiculos/Vehiculos';
import MantenimientoVehiculo from '../vehiculos/MantenimientoVehiculo';
import { rolesEnum } from '../../enums/RolesEnum';

import './inicio.css'
import ViajeSolicitante from '../viajes/ViajesSolicitante';
import BitacoraAcciones from '../bitacora/BitacoraAcciones';


export default function PersistentDrawerLeft({ classes, mobile }) {
  const theme = useTheme();
  const open = true;
  const Auth = new AuthHelperMethods(process.env.REACT_APP_EP);  

  const history = useHistory();
  let params = useParams();

  const [ usuario, setUsuario ] = useState(null);
  const [ navOption, setNavOption] = useState(params.pagina);

  
  useEffect(()=>{
    let signal = axios.CancelToken.source();
    const getUsuario = async ()=>{
      const UserHelperMethodsInstance = new UserHelperMethods(process.env.REACT_APP_EP); 
      try {
        const response = await UserHelperMethodsInstance.buscarUsuario(localStorage.getItem('usuario'), signal.token)
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
  
  const selectNavOption = (option) => {
    
    if(option === 'logout') {
      Auth.logout(); 
      history.push('/');
    }
    else {
      history.push(`/home/${option}`);
      setNavOption(option);
    }    
  } 

  const getComponent = (pagina, classes, mobile) => {
    switch(pagina) {
      case 'vehiculos': 
        if(usuario.rol !== rolesEnum.ADMINISTRADOR && usuario.rol !== rolesEnum.SUPPORT) {
          history.push('/home/viaje');
          break;
        }
        return <Vehiculos classes={classes} mobile={mobile}/>
        
      case 'usuarios':
        if(usuario.rol !== rolesEnum.SUPPORT) {
          history.push('/home/viaje');
          break;
        }
        return <Usuarios classes={classes} mobile={mobile}/>
      case 'viajes':
        return <ViajeSolicitante user={usuario} />
      case 'bitacora':
        if(usuario.rol !== rolesEnum.SUPPORT) {
          history.push('/home/viaje');
          break;
        }
        return <BitacoraAcciones user={usuario} />
      
      default: return <ViajeSolicitante user={usuario} />
    }
  }

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
            <img src="/logo.png" alt="logo" style={{width:'150px'}}/>
          </div>          
        </div>
        <List>

          {usuario ? 
            (usuario.rol === rolesEnum.ADMINISTRADOR || usuario.rol === rolesEnum.SUPPORT ? 
          <ListItem button key={'Vehiculos'} selected={navOption === 'vehiculos'} onClick={()=>{selectNavOption('vehiculos')}}>
            <ListItemIcon>{<CommuteIcon onClick={()=>{history.push('/home/vehiculos')}}/>}</ListItemIcon>
            <ListItemText primary={'Vehiculos'}/>
          </ListItem>:null):null}
          

          {usuario &&
          ((usuario.rol === rolesEnum.SUPPORT) &&
          <ListItem button key={'Usuarios'} selected={navOption === 'usuarios'} onClick={()=>{selectNavOption('usuarios')}}>
            <ListItemIcon><AssignmentIndIcon onClick={()=>{history.push('/home/usuarios')}}/></ListItemIcon>
            <ListItemText primary={'Usuarios'}/>
          </ListItem>
          )}          

          {usuario &&
          ((usuario.rol === rolesEnum.SUPPORT) &&
          <ListItem button key={'Bitacora'} selected={navOption === 'bitacora'} onClick={()=>{selectNavOption('bitacora')}}>
            <ListItemIcon><AssignmentIndIcon onClick={()=>{history.push('/home/bitacora')}}/></ListItemIcon>
            <ListItemText primary={'Bitácora de acciones'}/>
          </ListItem>
          )}

          {usuario &&
          <ListItem button key={'Viajes'} selected={navOption === 'viaje'} onClick={()=>{selectNavOption('viaje')}}>
            <ListItemIcon><CommuteIcon onClick={()=>{history.push('/home/viaje')}}/></ListItemIcon>
            <ListItemText primary={'Viajes'}/>
          </ListItem>
          }
        </List>
        <div className="cerrar-sesion" onClick={()=>{selectNavOption('logout')}}>
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
            { usuario && getComponent(params.pagina, classes, mobile) }  
        </Grid>
      </main>
    </div>
  );
}
