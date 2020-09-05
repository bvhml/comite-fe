import React, { useEffect } from 'react';
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
import { Grid, Button } from '@material-ui/core';
import AuthHelperMethods from '../../helpers/AuthHelperMethods';
import UserHelperMethods from '../../helpers/UserHelperMethods';
import { useHistory } from 'react-router-dom';
import DashboardIcon from '@material-ui/icons/Dashboard';
import CommuteIcon from '@material-ui/icons/Commute';
import axios from 'axios';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { useState } from 'react';
import { Usuarios } from '.';


export default function PersistentDrawerLeft({classes, mobile}) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const Auth = new AuthHelperMethods(process.env.REACT_APP_EP);  
  const [ usuario, setUsuario ] = useState(null);
  const history = useHistory();
  

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  
  useEffect(()=>{
    let signal = axios.CancelToken.source();
    const getUsuario = async ()=>{
      const UserHelperMethodsInstance = new UserHelperMethods(process.env.REACT_APP_EP); 
      try {
        const response = await UserHelperMethodsInstance.buscarUsuario(localStorage.getItem('usuario'),signal.token)
        setUsuario(response);
        if (response) {
          if (Number(response.inicio_sesion) === 0) {
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
    <div className={classes.root} style={{backgroundColor:'transparent', padding:'0vh 0vh 0vh 2.5vh'}}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar style={{backgroundColor:'#db1f26'}}>
            <Grid container justify={'space-between'} alignItems={'baseline'}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    className={clsx(classes.menuButton, open && classes.hide)}
                    style={{color:'white'}}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant={!mobile ? "caption":"h6"} noWrap style={{color:'white', textTransform:'none'}}>
                      Benemérito Comité Pro-Ciegos y Sordos de Guatemala
                </Typography>

                <Button
                onClick={()=>{Auth.logout(); history.push('/');}}
                variant="contained"
                color={"primary"}
                className={classes.submit}
                style={{backgroundColor:"#ee2e24", fontSize:!mobile ? "10px":""}}
                >
                Cerrar sesion
                </Button>
            </Grid>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
        {(history.location.pathname !== '/inicio' || true) &&
          <ListItem button key={'Inicio'} onClick={()=>{history.push('/inicio')}}>
            <ListItemIcon>{<DashboardIcon onClick={()=>{history.push('/inicio')}}/>}</ListItemIcon>
            <ListItemText primary={'Inicio'}/>
          </ListItem>}

          {usuario &&
            ((usuario.rol === 2 || usuario.rol === 3 || true ) &&
          <ListItem button key={'Vehiculos'} onClick={()=>{history.push('/vehiculos')}}>
            <ListItemIcon>{<CommuteIcon onClick={()=>{history.push('/vehiculos')}}/>}</ListItemIcon>
            <ListItemText primary={'Vehiculos'}/>
          </ListItem>)}
          

          <ListItem button key={'Cambiar mi contraseña'} onClick={()=>{history.push('/reiniciar-contraseña')}}>
            <ListItemIcon>{<VpnKeyIcon onClick={()=>{history.push('/programa')}}/>}</ListItemIcon>
            <ListItemText primary={'Cambiar mi contraseña'}/>
          </ListItem>
        </List>
        <Divider />
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <Grid container component="main" className={classes.root} style={{backgroundColor:'transparent', padding:!mobile? '0vh':'15vh 0vh', height:"auto"}}>
            <CssBaseline />
            <Usuarios classes={classes} mobile={mobile}/>
        </Grid>
      </main>
    </div>
  );
}
