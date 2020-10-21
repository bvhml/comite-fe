import React, { useState, useEffect} from 'react';
import ViajesHelperMethods from '../../helpers/ViajesHelperMethods';
import UserHelperMethods from '../../helpers/UserHelperMethods';
import ViajesReducer from './../../reducers/ViajesReducer';
import TablaEntidad from './../forms/TablaEntidad';
import axios from 'axios';  
import { rolesEnum } from '../../enums/RolesEnum';

const ViajeSolicitante = () => {

  const ViajesHelper = new ViajesHelperMethods(process.env.REACT_APP_EP);
  const UsuariosHelper = new UserHelperMethods(process.env.REACT_APP_EP); 

  const { viajes, setViajes} = useState([]);

  const nowDate = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;  
  const initialState = {
    viajes: [],
    viaje: null,
    isLoading: false,
    error: false,
    showError: false,
    isLoggedIn: false,
    open: false,
    editar: false
  };
  
  const initialFieldsState = [{ 
    label: 'Fecha',
    columnSize: '24%',
    field: 'fecha_0',
    validWhen: false,
    message: 'Este campo es requerido',
    error: false,
    type: 'date',
    required: true,
    defaultValue: nowDate
  }, { 
    label: 'Dirección de origen',
    columnSize: '38%',
    field: 'ubicacion_inicio_0',
    validWhen: false,
    message: 'Ingrese la dirección de origen',
    error: false,
    type: 'text',
    required: true,
    defaultValue: ''
  }, { 
    label: 'Dirección de destino',
    columnSize: '38%',
    field: 'ubicacion_fin_0',
    validWhen: false,
    message: 'Este campo es requerido',
    error: false,
    type: 'text',
    required: true,
    defaultValue: ''
  }, { 
    label: 'Agregar ruta',
    columnSize: '20%',
    field: 'rutas',
    validWhen: false,
    message: 'Debe agregar al menos una ruta',
    error: false,
    type: 'dynamic',
    required: false
  }, { 
    label: 'Solicitar aprobación de un director',
    columnSize: '100%',
    field: 'id_director',
    validWhen: false,
    message: 'Ingrese la dirección de origen',
    error: false,
    type: 'select',
    required: false,
    defaultValue: 0,
    options: [{
      label: 'No solicitar',
      value: 0
    }]
  }];
 
  const [fields, setFields] = useState([].concat(initialFieldsState));

  
  const dynamicClick = () => {    

    const index = ((fields.length - 5) / 3) + 1;

    fields.splice(fields.length - 2, 0, { 
      label: 'Fecha',
      columnSize: '24%',
      field: 'fecha_' + index,
      validWhen: false,
      message: 'Este campo es requerido',
      error: false,
      type: 'date',
      required: true,
      defaultValue: nowDate
    });

    fields.splice(fields.length - 2, 0, { 
      label: 'Dirección de origen',
      columnSize: '38%',
      field: 'ubicacion_inicio_' + index,
      validWhen: false,
      message: 'Ingrese la dirección de origen',
      error: false,
      type: 'text',
      required: true,
      defaultValue: ''
    })

    fields.splice(fields.length - 2, 0, { 
      label: 'Dirección de destino',
      columnSize: '38%',
      field: 'ubicacion_fin_' + index,
      validWhen: false,
      message: 'Este campo es requerido',
      error: false,
      type: 'text',
      required: true,
      defaultValue: ''
    });
    console.log(initialFieldsState);
    setFields(fields);
  }

  const columns= [
    { 
      title: 'Destino', 
      field: 'ubicacion_fin',
      searchable:true,
      render: rowData => <div style={{color:'cornflowerblue'}}>{rowData.marca}</div>
    },
    { 
      title: 'Estatus',
      field: 'id_estatus',
      searchable:true,
      render: rowData => <div style={{color:'cornflowerblue'}}>{rowData.transmision}</div>
    }
  ];

  const mapPilotosToViaje = async (viajes, signal) => {
    viajes.forEach(async viaje => {            
      // Map pilotos
      await viaje.rutas.forEach(async ruta => {
          if(ruta){
              const response = await UsuariosHelper.buscarUsuarioById(ruta.id_conductor, signal.token)
              ruta.nombrePiloto = response.nombre;
          } else {
              ruta.nombrePiloto = 'No asignado';
          }        
      });    
    });
  }

  const getViajes = async signal => {
    try {
      const response = await ViajesHelper.getViajes(signal.token)
      if (response) {
        await mapPilotosToViaje(response, signal)
        setViajes(response)
      } 
    } catch (error) {
        if (axios.isCancel(error)) {
            //console.log('Error: ', error.message); // => prints: Api is being canceled
        }
    }  
  }

  const getDirectores = async (signal) => {
    try {
      const response = await UsuariosHelper.buscarUsuarioByRol(signal.token, rolesEnum.DIRECTOR)
      if (response) {
        const directores = response.map(res => {
          return {
            label: res.nombre,
            value: res.id
          }
        })
        fields.forEach(field => {
          if(field.field === 'id_director') {
            field.options = field.options.concat(directores);
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
    getViajes(signal);
    getDirectores(signal);
    return ()=>{signal.cancel('Api is being canceled');}
  },[]);

  const solicitarViaje = async (viaje) => {
    try {
      await ViajesHelper.solicitarViaje(viaje);
      viajes.push(viaje);
      setViajes(viajes)
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
      entitiesList={viajes}
      onCreate={solicitarViaje}
      formFields={fields}
      columns={columns}
      reducer={ViajesReducer}
      initialState={initialState}
      entitiesListName="viajes"
      entityName="viaje"
      dynamicClick={dynamicClick}
      resetFormStructure={resetFormStructure}
    />
  );
}

export default ViajeSolicitante;