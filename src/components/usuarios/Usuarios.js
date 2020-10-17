import React, { useState, useEffect } from 'react';
import UserHelperMethods from '../../helpers/UserHelperMethods';
import axios from 'axios';
import UsuariosReducer from './../../reducers/UsuariosReducer';
import TablaEntidad from '../forms/TablaEntidad';

import './usuarios.scss';

import { getRoleText, rolesEnum } from '../../enums/RolesEnum';
  


const Usuarios = () => {

  const UsuariosHelper = new UserHelperMethods(process.env.REACT_APP_EP); 

  const [usuarios, setUsuarios] = useState([]);
  
  const initialState = {
    entity: null,
    isLoading: false,
    error: false,
    showError: false,
    isLoggedIn: false,
    open: false,
    editar: false,
  };
  let fields = [{ 
    label: 'Rol',
    columnSize: '20%',
    field: 'rol',
    validWhen: false,
    message: 'Seleccione un rol',
    error: false,
    type: 'select',
    options: [{
      label: getRoleText(rolesEnum.PILOTO),
      value: rolesEnum.PILOTO
    }, {
      label: getRoleText(rolesEnum.SOLICITANTE),
      value: rolesEnum.SOLICITANTE
    }, {
      label: getRoleText(rolesEnum.ADMINISTRADOR),
      value: rolesEnum.ADMINISTRADOR
    }, {
      label: getRoleText(rolesEnum.DIRECTOR),
      value: rolesEnum.DIRECTOR
    }]
  }, {
    label: 'Nombres',
    columnSize: '40%',
    field: 'nombre',
    validWhen: false,
    message: 'Nombres requeridos',
    error: false,
    type: 'text'
  }, { 
    label: 'Apellido',
    columnSize: '40%',
    field: 'apellido',
    validWhen: true,
    message: 'Apellidos requeridos',
    error: false,
    type: 'text'
  }, { 
    label: 'Edad',
    columnSize: '40%',
    field: 'edad',
    validWhen: false,
    message: 'Edad requerida',
    error: false,
    type: 'text'
  }, { 
    label: 'DPI',
    columnSize: '60%',
    field: 'dpi',
    validWhen: false,
    message: 'DPI requerido',
    error: false,
    type: 'text'
  }, { 
    label: 'Correo electrónico',  
    columnSize: '100%',
    field: 'username',  
    validWhen: true,
    message: 'Correo electrónico requerido',
    error: false,
    type: 'text'
  }, { 
    label: 'Contraseña',  
    columnSize: '100%',
    field: 'password',  
    validWhen: true,
    message: 'Contraseña requerida',
    error: false,
    type: 'password'
  }];
  
  let columns= [
    { 
      title: 'Rol', 
      field: 'rol',
      searchable:true,
      render: rowData => <div style={{color:'cornflowerblue'}}>{getRoleText(rowData.rol)}</div>
    },
    { 
      title: 'Nombres', 
      field: 'nombre',
      searchable:true,
      render: rowData => <div style={{color:'cornflowerblue'}}>{rowData.nombre}</div>
    },
    { 
      title: 'Apellidos', 
      field: 'apellido',
      searchable:true,
      render: rowData => <div style={{color:'cornflowerblue'}}>{rowData.apellido}</div>
    },
    { 
      title: 'Correo electrónico', 
      field: 'username',
      searchable:true,
      render: rowData => <div style={{color:'cornflowerblue'}}>{rowData.username}</div>
    },
  ];

  const getTodosUsuarios = async (signal)=>{
    try {
      const response = await UsuariosHelper.buscarUsuarios(signal.token)
      if (response) {
        setUsuarios(response)
      } 
    } catch (error) {
        if (axios.isCancel(error)) {
          //console.log('Error: ', error.message); // => prints: Api is being canceled
      }
    }  
  }

  useEffect(() =>{
    let signal = axios.CancelToken.source();
    getTodosUsuarios(signal);
    return ()=>{
      signal.cancel('Api is being canceled');}
  },[]);

  const enviarUsuario = async usuario => {
    try {
      await UsuariosHelper.guardarUsuario(usuario);
      usuarios.push(usuario);
      setUsuarios(usuarios);
    }
    catch (error) {
      console.log(error);
    } 
  }

  const editarUsuario = async usuario => {
    try {
      let signal = axios.CancelToken.source();
      await UsuariosHelper.editarUsuario(usuario);
      getTodosUsuarios(signal);
    }
    catch (error) {
      console.log(error);
    } 
  }

  return (
    <TablaEntidad
      entitiesList={usuarios}
      onCreate={enviarUsuario}
      onEdit={editarUsuario}
      onDelete={null}
      formFields={fields}
      columns={columns}
      reducer={UsuariosReducer}
      initialState={initialState}
      entitiesListName="usuarios"
      entityName="usuario"
      enableEdit
      enableDelete
    />
  );
}

export default Usuarios;