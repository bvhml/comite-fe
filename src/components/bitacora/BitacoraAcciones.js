import React, { useState, useEffect } from 'react';
import BitacoraHelperMethods from '../../helpers/BitacoraHelperMethods';
import axios from 'axios';
import BitacoraReducer from './../../reducers/BitacoraReducer';
import TablaEntidad from '../forms/TablaEntidad';

import './bitacora.scss';

import moment from 'moment';
  


const BitacoraAcciones = () => {

  const BitacoraHelper = new BitacoraHelperMethods(process.env.REACT_APP_EP); 
  
  const initialState = {
    entity: null,
    isLoading: false,
    error: false,
    showError: false,
    isLoggedIn: false,
    open: false,
    editar: false,
  };
  
  let columns= [{ 
      title: 'Fecha', 
      field: 'createdAt',
      searchable:true,
      render: rowData => <div style={{color:'cornflowerblue'}}>{moment(rowData.createdAt).format('DD/MM/YYYY hh:mm')}</div>,
      cellStyle: {
        width: '20%'
      }
    },
    { 
      title: 'Acción', 
      field: 'descripcion',
      searchable:true,
      render: rowData => <div style={{color:'cornflowerblue'}}>{rowData.descripcion}</div>,
      cellStyle: {
        width: '80%'
      }
    }
  ];

  const [acciones, setAcciones] = useState([]);

  const getTodosUsuarios = async (signal)=>{
    try {
      const response = await BitacoraHelper.getBitacora(signal.token)
      if (response) {
        setAcciones(response)
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

  return (
    <TablaEntidad
      entitiesList={acciones}
      columns={columns}
      reducer={BitacoraReducer}
      initialState={initialState}
      entitiesListName="acciones"
      entityName="accion"
      enableCreate={false}
    />
  );
}

export default BitacoraAcciones;