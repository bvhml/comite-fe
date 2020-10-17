import React, { useState, useEffect} from 'react';
import ViajesHelperMethods from '../../helpers/ViajesHelperMethods';
import UserHelperMethods from '../../helpers/UserHelperMethods';
import ViajesReducer from './../../reducers/ViajesReducer';
import TablaEntidad from './../forms/TablaEntidad';
import axios from 'axios';  

const ViajeSolicitante = ({ classes, mobile }) => {

  const ViajesHelper = new ViajesHelperMethods(process.env.REACT_APP_EP);
  const UsuariosHelper = new UserHelperMethods(process.env.REACT_APP_EP); 

  const { viajes, setViajes} = useState([]);
  
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
  

  const addChildForm = () => {
    
    fields[1].children.push([{ 
      label: 'Fecha',
      columnSize: '25%',
      field: 'fecha',
      validWhen: false,
      message: 'Este campo es requerido',
      error: false,
      type: 'date'
    }, { 
      label: 'Dirección de destino',
      columnSize: '75%',
      field: 'descripcion',
      validWhen: false,
      message: 'Este campo es requerido',
      error: false,
      type: 'text'
    }]);
    setFields(fields);
  }
 
  const [fields, setFields] = useState([{ 
    label: 'Dirección de origen',
    columnSize: '100%',
    field: 'ubicacion_inicio',
    validWhen: false,
    message: 'Ingrese la dirección de origen',
    error: false,
    type: 'text'
  }, { 
    label: 'Agregar ruta',
    columnSize: '20%',
    field: 'rutas',
    validWhen: false,
    message: 'Debe agregar al menos una ruta',
    error: false,
    type: 'dynamic',
    children: [],
    onClick: addChildForm,
  }]);

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
    getViajes(signal);
    getPilotos(signal);
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
    />
  );
}

export default ViajeSolicitante;