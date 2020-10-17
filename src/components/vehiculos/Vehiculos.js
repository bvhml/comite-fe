import React, { useState, useEffect, useReducer } from 'react';
import VehiculoHelperMethods from '../../helpers/VehiculoHelperMethods';
import UserHelperMethods from '../../helpers/UserHelperMethods';

import Mantenimientos from './MantenimientoVehiculo'
import axios from 'axios';

import './vehiculos.scss';
import VehiculosReducer from '../../reducers/VehiculosReducer';
import TablaEntidad from '../forms/TablaEntidad';

const Vehiculos = () => {

  const VehiculosHelper = new VehiculoHelperMethods(process.env.REACT_APP_EP);
  const UsuariosHelper = new UserHelperMethods(process.env.REACT_APP_EP); 

  const initialState = {
    entity: null,
    isLoading: false,
    error: false,
    showError: false,
    isLoggedIn: false,
    open: false,
    editar: false,
    side: false
  };

  const [ vehiculos, setVehiculos ] = useState([])
  const [fields, setFields] = useState([{ 
    label: 'Marca',
    columnSize: '30%',
    field: 'marca',
    validWhen: false,
    message: 'Ingrese la marca',
    error: false,
    type: 'text'
  }, {
    label: 'Placa',
    columnSize: '20%',
    field: 'placa',
    validWhen: false,
    message: 'Placa requerida',
    error: false,
    type: 'text'
  }, { 
    label: 'Modelo',
    columnSize: '20%',
    field: 'modelo',
    validWhen: true,
    message: 'Ingrese el modelo',
    error: false,
    type: 'text'
  }, { 
    label: 'Línea',
    columnSize: '30%',
    field: 'linea',
    validWhen: false,
    message: 'Ingrese la línea',
    error: false,
    type: 'text'
  }, { 
    label: 'Tipo',
    columnSize: '20%',
    field: 'tipo',
    validWhen: false,
    message: 'Seleccione un tipo de vehículo',
    error: false,
    type: 'text'
  }, { 
    label: 'Chasis',
    columnSize: '40%',
    field: 'chasis',
    validWhen: false,
    message: 'Ingrese el código del chasis',
    error: false,
    type: 'text'
  }, { 
    label: 'Motor',
    columnSize: '40%',
    field: 'tamaño_motor',
    validWhen: false,
    message: 'Ingrese el tamaño del motor',
    error: false,
    type: 'text'
  }, { 
    label: 'Cilindros',
    columnSize: '30%',
    field: 'cant_cilindros',
    validWhen: false,
    message: 'Ingrese un número de cilindros válido',
    error: false,
    type: 'text'
  }, { 
    label: 'Toneladas',
    columnSize: '30%',
    field: 'toneladas',
    validWhen: false,
    message: 'Ingrese un número de toneladas válido',
    error: false,
    type: 'text'
  }, { 
    label: 'Transmisión',
    columnSize: '40%',
    field: 'transmision',
    validWhen: false,
    message: 'Seleccione el tipo de transmisión',
    error: false,
    type: 'select',
    options: [{
      label: 'Mecánica',
      value: 'Mecánica'
    }, {
      label: 'Automática',
      value: 'Automática'
    }, {
      label: 'Tiptronic',
      value: 'Tiptronic'
    }]
  }, { 
    label: 'Número de asientos',
    columnSize: '50%',
    field: 'asientos',
    validWhen: false,
    message: 'Ingrese un número de asientos válido',
    error: false,
    type: 'text'
  }, { 
    label: 'Color',
    columnSize: '50%',
    field: 'color',
    validWhen: false,
    message: 'Ingrese un color',
    error: false,
    type: 'text'
  }, { 
    label: 'Piloto',
    columnSize: '100%',
    field: 'piloto',
    validWhen: false,
    message: 'Seleccione un piloto',
    error: false,
    type: 'select',
    options: []
  }]);
  
  let columns= [
    { 
      title: 'Piloto Asignado', 
      field: 'piloto',
      searchable:true,
      render: rowData => <div style={{color:'cornflowerblue'}}>{rowData.nombrePiloto}</div>
    },
    { 
      title: 'Vehículo', 
      field: 'marca',
      searchable:true,
      render: rowData => <div style={{color:'cornflowerblue'}}>{rowData.marca}</div>
    },
    { 
      title: 'Transmisión', 
      field: 'transmision',
      searchable:true,
      render: rowData => <div style={{color:'cornflowerblue'}}>{rowData.transmision}</div>
    },
    { 
      title: 'Placa', 
      field: 'placa',
      searchable:true,
      render: rowData => <div style={{color:'cornflowerblue'}}>{rowData.placa}</div>
    },
  ];

  const mapPilotoToVehiculo = async (vehiculos, signal) => {
    vehiculos.forEach(async vehiculo => {
      if(vehiculo.piloto){
        const response = await UsuariosHelper.buscarUsuarioById(vehiculo.piloto, signal.token)
        vehiculo.nombrePiloto = response.nombre;
      } else {
        vehiculo.nombrePiloto = 'No aplica';
      }      
    });
  }

  const getTodosVehiculos = async (signal)=>{
    try {
      const response = await VehiculosHelper.obtenerTodosVehiculos(signal.token)
      if (response) {
        await mapPilotoToVehiculo(response, signal);
        setVehiculos(response);
      } 
    } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Error: ', error.message); // => prints: Api is being canceled
      }
    }  
  }

  const getPilotos = async (signal) => {
    try {
      const response = await UsuariosHelper.buscarPilotos(signal.token)
      if (response) {
        const pilotos = response.map(res => {
          return {
            label: res.nombre,
            value: res.id
          }
        })
        fields.forEach(field => {
          if(field.label === 'Piloto') {
            field.options = pilotos;
          }
        });
        setFields(fields);

      } 
    } catch (error) {
        if (axios.isCancel(error)) {
          //console.log('Error: ', error.message); // => prints: Api is being canceled
      }
    }  
  }

  useEffect(() =>{
    let signal = axios.CancelToken.source();
    getTodosVehiculos(signal);
    getPilotos(signal);
    return ()=>{signal.cancel('Api is being canceled');}
  },[]);
  

  const enviarVehiculo = async entity => {
    try {
      await VehiculosHelper.guardarVehiculo(entity);
      vehiculos.push(entity);
      setVehiculos(vehiculos);
    }
    catch (error) {
      console.log(error);
    } 
  }

  const editarVehiculo = async (vehiculo) => {
    try {
      const VehiculosHelper = new VehiculoHelperMethods(process.env.REACT_APP_EP); 
      await VehiculosHelper.guardarVehiculo(vehiculo);
      let signal = axios.CancelToken.source();
      
      try {
        const response = await VehiculosHelper.obtenerTodosVehiculos(signal.token)
        if (response) {
          setVehiculos(response);
        } 
      } 
      catch (error) {
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
      <TablaEntidad
        entitiesList={vehiculos}
        onCreate={enviarVehiculo}
        onEdit={editarVehiculo}
        onDelete={null}
        formFields={fields}
        columns={columns}
        reducer={VehiculosReducer}
        initialState={initialState}
        entitiesListName="vehículos"
        entityName="vehículo"
        sideModalComponentRender={props => <Mantenimientos {...props}/> }
        enableEdit
        enableDelete
        enebaleMaintenance
      />
    );
}

export default Vehiculos;