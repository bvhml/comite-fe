import React, { useState, useEffect } from 'react';
import VehiculoHelperMethods from '../../helpers/VehiculoHelperMethods';
import axios from 'axios';

import './vehiculos.scss';
import MantenimientosReducer from '../../reducers/MantenimientosReducer';
import TablaEntidad from '../forms/TablaEntidad';
import moment from 'moment';

const Mantenimientos = ({ entityId, onClose }) => {
  
  const initialState = {
    mantenimientos: [],
    mantenimiento: null,
    isLoading: false,
    error: false,
    showError: false,
    isLoggedIn: false,
    open: false,
    editar: false
  };

  const initialFieldsState = [{ 
    label: 'Lugar',
    columnSize: '50%',
    field: 'lugar',
    validWhen: false,
    message: 'Ingrese el lugar',
    error: false,
    type: 'text',
    defaultValue: '',
    required: true,
    wrapGroup: 0
  }, { 
    label: 'Fecha',
    columnSize: '50%',
    field: 'fecha',
    validWhen: false,
    message: 'Ingrese la fecha',
    error: false,
    type: 'date',
    defaultValue: '',
    required: true,
    wrapGroup: 0
  }, { 
    label: 'Descripción',
    columnSize: '100%',
    field: 'descripcion',
    validWhen: false,
    message: 'Ingrese la descripción',
    error: false,
    type: 'textarea',
    defaultValue: '',
    required: true,
    wrapGroup: 0
  }];
  
  let columns= [
    { 
      title: 'Descripcion', 
      field: 'descripcion',
      searchable:true,
      render: rowData => <div style={{color:'cornflowerblue'}}>{rowData.descripcion}</div>
    },
    { 
      title: 'Lugar', 
      field: 'lugar',
      searchable:true,
      render: rowData => <div style={{color:'cornflowerblue'}}>{rowData.lugar}</div>
    },
    { 
      title: 'Fecha', 
      field: 'fecha',
      searchable:true,
      render: rowData => <div style={{color:'cornflowerblue'}}>{moment(rowData.fecha).format('DD/MM/YYYY')}</div>
    },
  ];

  const VehiculosHelper = new VehiculoHelperMethods(process.env.REACT_APP_EP);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [fields, setFields] = useState([].concat(initialFieldsState));

  useEffect(() =>{
    let signal = axios.CancelToken.source();
    const getMantenimientos = async (idVehiculo)=>{

      if (idVehiculo){
        const VehiculosHelper = new VehiculoHelperMethods(process.env.REACT_APP_EP); 
        try {
          const response = await VehiculosHelper.getMantenimientos(idVehiculo, signal.token)
          if (response) {
            setMantenimientos(response);
          } 
        } catch (error) {
            if (axios.isCancel(error)) {
              //console.log('Error: ', error.message); // => prints: Api is being canceled
          }
        }  
      }
    }
    getMantenimientos(entityId);
    return ()=>{signal.cancel('Api is being canceled');}
  },[entityId]);  

  const resetFormStructure = () => {
    setFields(initialFieldsState)
  }

  const enviarMantenimiento = async (mantenimiento) => {
    try {
      mantenimiento.vehiculoId = entityId;
      let saveResponse = await VehiculosHelper.guardarMantenimiento(mantenimiento);
      mantenimientos.push(mantenimiento);
      setMantenimientos(mantenimientos);
    }
    catch (error) {
      console.log(error);
    } 
  }

  const editarMantenimiento = async (mantenimiento) => {
    try {
      mantenimiento.vehiculoId = entityId;
      let saveResponse = await VehiculosHelper.editarMantenimiento(mantenimiento);      
      try {
        const response = await VehiculosHelper.getMantenimientos(entityId)
        if (response) {
          setMantenimientos(response);
        } 
      } catch (error) {
          if (axios.isCancel(error)) {
            //console.log('Error: ', error.message); // => prints: Api is being canceled
        }
      }  
    }
    catch (error) {
      console.log(error);
    } 
  }

  const eliminarMantenimiento = async (mantenimiento) => {
    try {
      mantenimiento.vehiculoId = entityId;
      let saveResponse = await VehiculosHelper.eliminarMantenimiento(mantenimiento);      
      try {
        const response = await VehiculosHelper.getMantenimientos(entityId)
        if (response) {
          setMantenimientos(response);
        } 
      } catch (error) {
          if (axios.isCancel(error)) {
            //console.log('Error: ', error.message); // => prints: Api is being canceled
        }
      }  
    }
    catch (error) {
      console.log(error);
    } 
  }

  return (
    <div className="mantenimientos">
      <TablaEntidad
        entitiesList={mantenimientos}
        onCreate={enviarMantenimiento}
        onEdit={editarMantenimiento}
        onDelete={null}
        formFields={fields}
        columns={columns}
        reducer={MantenimientosReducer}
        initialState={initialState}
        entitiesListName="Mantenimientos"
        entityName="mantenimiento"
        resetFormStructure={resetFormStructure}
        enableEdit
        enableDelete
        enableCreate
        enableFiltering
      />
    </div>    
  );
}

export default Mantenimientos;