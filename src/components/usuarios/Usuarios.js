import React, { useState, useEffect, forwardRef, useReducer } from 'react';
import validator from 'validator';
import FormularioEntidad from '../forms/FormularioEntidad'
import UserHelperMethods from '../../helpers/UserHelperMethods';
import { Grid, TextField, Button, Modal } from '@material-ui/core';
import axios from 'axios';
import MaterialTable from 'material-table';

import './usuarios.scss';

import { AddBox, ArrowDownward, Check, ChevronLeft, ChevronRight, Clear, DeleteOutline, Edit, FilterList, FirstPage, LastPage, Remove, SaveAlt, Search, ViewColumn } from '@material-ui/icons';


  const tableIcons = {
      Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
      Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
      Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
      Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
      DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
      Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
      Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
      Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
      FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
      LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
      NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
      PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
      ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
      Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
      SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
      ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
      ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
    };

  function usuariosReducer(state, action) {
    switch (action.type) {
      case 'field': {
        return {
          ...state,
          error: false,
          usuario: {...state.usuario, [action.fieldName]:action.payload},
        };
      }
      case 'load': {
        return {
          ...state,
          error: '',
          isLoading: true,
        };
      }
      case 'usuarios': {
        return {
          ...state,
          usuarios: action.payload,
          isLoading: false,
        };
      }
      case 'usuario': {
        return {
          ...state,
          usuario: action.payload,
          isLoading: false,
        };
      }
      case 'error': {
        return {
          ...state,
          error: true,
          showError: true,
          isLoading: false,
        };
      }
      case 'logOut': {
        return {
          ...state,
          isLoggedIn: false,
        };
      }
      case 'hideModal': {
        return {
          ...state,
          open: false,
        };
      }
      case 'showModal': {
        return {
          ...state,
          open: true,
        };
      }
      case 'editar': {
        return {
          ...state,
          editar: true,
        };
      }
      case 'noEditar': {
        return {
          ...state,
          editar: false,
        };
      }
      default:
        return state;
    }
  }
  
  const initialState = {
    usuarios: [],
    usuario: null,
    isLoading: false,
    error: false,
    showError: false,
    isLoggedIn: false,
    open: false,
    editar: false,
  };

const Usuarios = ({ classes, mobile }) => {

  const UsuariosHelper = new UserHelperMethods(process.env.REACT_APP_EP); 

  const [state, dispatch] = useReducer(usuariosReducer, initialState);
  const { usuarios, usuario, isLoading, open, editar, error, showError } = state;

  let fields = [{ 
    label: 'Rol',
    columnSize: '20%',
    field: 'rol',
    validWhen: false,
    message: 'Seleccione un rol',
    error: false,
    type: 'select',
    options: [{
      label: 'Piloto',
      value: 1
    }, {
      label: 'Solicitante',
      value: 2
    }, {
      label: 'Administrador',
      value: 3
    }, {
      label: 'Director',
      value: 4
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
      render: rowData => <div style={{color:'cornflowerblue'}}>{rowData.rol}</div>
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

  useEffect(() =>{
    let signal = axios.CancelToken.source();
    const getTodosUsuarios = async ()=>{
      try {
        dispatch({ type: 'load' });
        const response = await UsuariosHelper.buscarUsuarios(signal.token)
        if (response) {
          dispatch({ type: 'usuarios', payload: response });
        } 
      } catch (error) {
          if (axios.isCancel(error)) {
            //console.log('Error: ', error.message); // => prints: Api is being canceled
        }
      }  
    }
    getTodosUsuarios();
    return ()=>{
      signal.cancel('Api is being canceled');}
  },[]);

  const handleOpen = () => {
    dispatch({ type: 'showModal' });
  };

  const handleClose = () => {
    dispatch({ type: 'hideModal' });
  };
  
  const handleChange = event => {
    event.preventDefault();
    dispatch({
      type: 'field',
      fieldName: event.target.id,
      payload: event.currentTarget.value,
    });
  }

  const handleSubmit = event => {
      event.preventDefault();
      validateForm();
      if(!error){
          enviarUsuario()
      }
  }

  const validateForm = () => {
    fields.forEach(field => {
      if(!error && !usuario[field.field]) {
        dispatch({ type: 'error' });
      }
    });
  }

  const enviarUsuario = async () => {
    try {
      let saveResponse = await UsuariosHelper.guardarUsuario(usuario);
      usuarios.push(usuario);
      dispatch({ type: 'usuarios', payload: usuarios });
      handleClose();
    }
    catch (error) {
      console.log(error);
    } 
  }

  const editarUsuario = async () => {
    try {
      let saveResponse = await UsuariosHelper.guardarUsuario(usuario);
      let signal = axios.CancelToken.source();
      
      try {
        dispatch({ type: 'load' });
        const response = await UsuariosHelper.buscarUsuarios(signal.token)
        if (response) {
          dispatch({ type: 'usuarios', payload: response });
        } 
      } catch (error) {
        if (axios.isCancel(error)) {
          //console.log('Error: ', error.message); // => prints: Api is being canceled
        }
      }  

      dispatch({ type: 'noEditar'});
    }
    catch (error) {
      console.log(error);
    } 
  }

    return (
    <Grid container style={{backgroundColor:'whitesmoke', width:'100%'}}>
      <div className="usuarios">
        <div className="usuarios__encabezado">
          <Grid container justify='flex-end'>
            <Button className="usuarios__boton-agregar" variant="contained" onClick={handleOpen}>Ingresar usuario</Button>
          </Grid>

          <Grid container style={{minHeight:'80vh', marginTop:'20px'}}>

            { usuarios && !isLoading && <MaterialTable
              icons={tableIcons}
              columns={columns}
              data={usuarios}
              stickyHeader
              title="Gestionar Usuarios"
              style={{padding: '3vh', width:'100%', height:'auto'}}
              options={{
                search: false,
                searchFieldAlignment:'left',
                defaultGroupOrder:'0',
                pageSize: 10,
                actionsColumnIndex: -1,
                rowStyle:{backgroundColor:'whitesmoke',
                emptyRowsWhenPaging: true,}}
                }
                
              localization={{ 
                toolbar: { searchPlaceholder: 'Buscar' },
                body: {
                    emptyDataSourceMessage: 'No hay resultados',
                    filterRow: {
                        filterTooltip: 'Filter'
                    }
                },
                header:{
                  actions:''
                } 
                }}

                actions={[
                  {
                    icon: tableIcons.Edit,
                    tooltip: 'Editar usuario',
                    onClick: (event, rowData) => {
                      // Do save operation
                      dispatch({type: 'editar'})
                      dispatch({ type: 'usuario', payload: rowData });

                    }
                  },
                  {
                    icon: tableIcons.Delete,
                    tooltip: 'Eliminar usuario',
                    onClick: (event, rowData) => {
                      // Do save operation
                    }
                  }
                ]}
                
            />}

            {isLoading && <Grid> Cargando usuarios ...</Grid>}
          </Grid>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
           <FormularioEntidad type="usuarios" fields={fields} onChange={handleChange} onSubmit={handleSubmit} /> 
          </Modal>
          <Modal
            open={editar}
            onClose={()=> dispatch({ type: 'noEditar'})}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
          <Grid container style={{maxHeight:'85vh', position:'absolute', top:'50%', left: '50%', width:'50rem', backgroundColor:'white', transform: 'translate(-50%, -50%)', padding:'2rem'}} >
            {usuario && <form noValidate autoComplete="off" spacing={2} >
              <TextField
                id="rol"
                label='Rol'
                value={usuario.rol || ''}
                variant='standard'
                style={{paddingLeft:'1rem'}}
                onChange={handleChange}
              />
              <TextField
                id="nombre"
                label='Nombres'
                value={usuario.nombre || ''}
                variant='standard'
                style={{paddingLeft:'1rem'}}
                onChange={handleChange}
              />
              <TextField
                id="apellido"
                label='Apellidos'
                value={usuario.apellido || ''}
                variant='standard'
                style={{paddingLeft:'1rem'}}
                onChange={handleChange}
              />
              <TextField
                id="edad"
                label='Edad'
                value={usuario.edad || ''}
                variant='standard'
                style={{paddingLeft:'1rem'}}
                onChange={handleChange}
              />
              <TextField
                id="dpi"
                label='DPI'
                value={usuario.dpi || ''}
                variant='standard'
                style={{paddingLeft:'1rem'}}
                onChange={handleChange}
              />
              <TextField
                id="username"
                label='Correo electrónico'
                value={usuario.username || ''}
                variant='standard'
                style={{paddingLeft:'1rem'}}
                onChange={handleChange}
              />
              <TextField
                id="password"
                label='Contraseña'
                value={usuario.password || ''}
                variant='standard'
                style={{paddingLeft:'1rem'}}
                onChange={handleChange}
              />
              <Button onClick={()=> dispatch({type:'noEditar'})} style={{backgroundColor: '#e04046',color: '#ffffff',float: 'right',marginTop: '1rem',marginRight: '1rem'}}>
                Cancelar
              </Button>
              <Button onClick={editarUsuario} style={{backgroundColor: 'green',color: '#ffffff',float: 'right',marginTop: '1rem',marginRight: '1rem'}}>
                Guardar
              </Button>
            </form>}
          </Grid>
          </Modal>
        </div>
      </div>
    </Grid>
    );
}

export default Usuarios;