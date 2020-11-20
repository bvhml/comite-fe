import React, { useState, useEffect } from 'react';
import UserHelperMethods from '../../helpers/UserHelperMethods';
import axios from 'axios';
import UsuariosReducer from './../../reducers/UsuariosReducer';
import TablaEntidad from '../forms/TablaEntidad';

import './usuarios.scss';

import { getRoleText, rolesEnum } from '../../enums/RolesEnum';
  


const Usuarios = () => {

  const UsuariosHelper = new UserHelperMethods(process.env.REACT_APP_EP); 
  
  const initialState = {
    entity: null,
    isLoading: false,
    error: false,
    showError: false,
    isLoggedIn: false,
    open: false,
    editar: false,
  };

  const initialFieldsState = [{ 
    label: 'Rol',
    columnSize: '20%',
    field: 'rol',
    validWhen: false,
    message: 'Seleccione un rol',
    error: false,
    type: 'select',
    required: true,
    defaultValue: '',
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
    }, {
      label: getRoleText(rolesEnum.SUPPORT),
      value: rolesEnum.SUPPORT
    }],
    wrapGroup: 0
  }, {
    label: 'Título',
    columnSize: '20%',
    field: 'titulo',
    validWhen: false,
    message: 'Nombres requeridos',
    error: false,
    type: 'text',
    defaultValue: '',
    required: false,
    wrapGroup: 0
  }, {
    label: 'Nombres',
    columnSize: '30%',
    field: 'nombre',
    validWhen: false,
    message: 'Nombres requeridos',
    error: false,
    type: 'text',
    defaultValue: '',
    required: true,
    wrapGroup: 0
  }, { 
    label: 'Apellido',
    columnSize: '30%',
    field: 'apellido',
    validWhen: true,
    message: 'Apellidos requeridos',
    error: false,
    type: 'text',
    defaultValue: '',
    required: true,
    wrapGroup: 0
  }, { 
    label: 'Edad',
    columnSize: '40%',
    field: 'edad',
    validWhen: false,
    message: 'Edad requerida',
    error: false,
    type: 'text',
    defaultValue: '',
    required: true,
    wrapGroup: 0
  }, { 
    label: 'DPI',
    columnSize: '60%',
    field: 'dpi',
    validWhen: false,
    message: 'DPI requerido',
    error: false,
    type: 'text',
    defaultValue: '',
    required: true,
    wrapGroup: 0
  }, { 
    label: 'Correo electrónico',  
    columnSize: '100%',
    field: 'username',  
    validWhen: true,
    message: 'Correo electrónico requerido',
    error: false,
    type: 'text',
    defaultValue: '',
    required: true,
    wrapGroup: 0
  }, { 
    label: 'Contraseña',  
    columnSize: '100%',
    field: 'password',  
    validWhen: true,
    message: 'Contraseña requerida',
    error: false,
    type: 'password',
    defaultValue: '',
    required: true,
    wrapGroup: 0
  }];
  
  let columns= [
    { 
      title: 'Rol', 
      field: 'rol',
      searchable:true,
      lookup: {
        [rolesEnum.PILOTO]: getRoleText(rolesEnum.PILOTO),
        [rolesEnum.SOLICITANTE]: getRoleText(rolesEnum.SOLICITANTE),
        [rolesEnum.ADMINISTRADOR]: getRoleText(rolesEnum.ADMINISTRADOR),
        [rolesEnum.DIRECTOR]: getRoleText(rolesEnum.DIRECTOR),
        [rolesEnum.SUPPORT]: getRoleText(rolesEnum.SUPPORT)
      },
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

  const [usuarios, setUsuarios] = useState([]);
  const [fields, setFields] = useState([].concat(initialFieldsState))

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
  }, []);

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

  const eliminarUsuario = async usuario => {
    try {
      let signal = axios.CancelToken.source();
      await UsuariosHelper.eliminarUsuario(usuario);
      getTodosUsuarios(signal);
    }
    catch (error) {
      console.log(error);
    } 
  }

  const resetFormStructure = () => {
    setFields(initialFieldsState)
  }

  return (
    <TablaEntidad
      entitiesList={usuarios}
      onCreate={enviarUsuario}
      onEdit={editarUsuario}
      onDelete={eliminarUsuario}
      formFields={fields}
      columns={columns}
      reducer={UsuariosReducer}
      initialState={initialState}
      entitiesListName="usuarios"
      entityName="usuario"
      resetFormStructure={resetFormStructure}
      enableEdit
      enableDelete
      enableCreate
      enableFiltering
    />
  );
}

export default Usuarios;