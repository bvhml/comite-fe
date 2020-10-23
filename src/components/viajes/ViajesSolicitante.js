import React, { useState, useEffect} from 'react';
import ViajesHelperMethods from '../../helpers/ViajesHelperMethods';
import UserHelperMethods from '../../helpers/UserHelperMethods';
import ViajesReducer from './../../reducers/ViajesReducer';
import TablaEntidad from './../forms/TablaEntidad';
import axios from 'axios';  
import { rolesEnum } from '../../enums/RolesEnum';
import { getStatusText } from '../../enums/StatusEnum';

const ViajeSolicitante = ({ user }) => {

  const ViajesHelper = new ViajesHelperMethods(process.env.REACT_APP_EP);
  const UsuariosHelper = new UserHelperMethods(process.env.REACT_APP_EP); 

  const [viajes, setViajes] = useState([]);

  const nowDate = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}T${new Date().getHours() + 1}:${new Date().getMinutes()}`;  
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
    columnSize: '22%',
    field: 'fecha_0',
    validWhen: false,
    message: 'Este campo es requerido',
    error: false,
    type: 'datetime-local',
    required: true,
    defaultValue: nowDate
  }, { 
    label: 'Dirección de origen',
    columnSize: '33%',
    field: 'ubicacion_inicio_0',
    validWhen: false,
    message: 'Ingrese la dirección de origen',
    error: false,
    type: 'text',
    required: true,
    defaultValue: ''
  }, { 
    label: 'Dirección de destino',
    columnSize: '33%',
    field: 'ubicacion_fin_0',
    validWhen: false,
    message: 'Este campo es requerido',
    error: false,
    type: 'text',
    required: true,
    defaultValue: ''
  }, { 
    label: 'Personas',
    columnSize: '12%',
    field: 'numero_personas_0',
    validWhen: false,
    message: 'Este campo es requerido',
    error: false,
    type: 'number',
    required: true,
    defaultValue: 1
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
    defaultValue: -1,
    options: [{
      label: 'No solicitar',
      value: -1
    }]
  }];
 
  const [fields, setFields] = useState([].concat(initialFieldsState));

  
  const dynamicClick = () => {    

    const index = ((fields.length - 6) / 4) + 1;

    fields.splice(fields.length - 2, 0, { 
      label: 'Fecha',
      columnSize: '22%',
      field: 'fecha_' + index,
      validWhen: false,
      message: 'Este campo es requerido',
      error: false,
      type: 'datetime-local',
      required: true,
      defaultValue: nowDate
    });

    fields.splice(fields.length - 2, 0, { 
      label: 'Dirección de origen',
      columnSize: '33%',
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
      columnSize: '33%',
      field: 'ubicacion_fin_' + index,
      validWhen: false,
      message: 'Este campo es requerido',
      error: false,
      type: 'text',
      required: true,
      defaultValue: ''
    });
    
    fields.splice(fields.length - 2, 0, { 
      label: 'Personas',
      columnSize: '12%',
      field: 'numero_personas_' + index,
      validWhen: false,
      message: 'Este campo es requerido',
      error: false,
      type: 'number',
      required: true,
      defaultValue: 1
    });

    setFields(fields);
  }

  const columns= [{ 
      title: 'Rutas',
      searchable:true,
      render: rowData => <div style={{color:'cornflowerblue'}}>{rowData.rutas.length}</div>
    }, { 
      title: 'Solicitante',
      searchable:true,
      render: rowData => <div style={{color:'cornflowerblue'}}>{rowData.nombreSolicitante}</div>
    }, { 
       title: 'Director',
      searchable:true,
      render: rowData => <div style={{color:'cornflowerblue'}}>{rowData.nombreDirector}</div>
    }, { 
      title: 'Dirección inicial',
      searchable:true,
      render: rowData => <div style={{color:'cornflowerblue'}}>{rowData.rutas[0].ubicacion_inicio}</div>
    }, { 
      title: 'Estatus',
      searchable:true,
      render: rowData => <div style={{color:'cornflowerblue'}}>{getStatusText(rowData.id_estatus)}</div>
    }
  ];

  const mapPilotosToViaje = async (viajes, signal) => {
    return Promise.all(await viajes.map(async viaje => {            
      // Map pilotos
      viaje.rutas = await Promise.all( await viaje.rutas.map(async ruta => {
          if(ruta){
              const response = await UsuariosHelper.buscarUsuarioById(ruta.id_conductor, signal.token);
              if(response){
                ruta.nombrePiloto = response.nombre;
              } else {
                ruta.nombrePiloto = 'No asignado';
              }
          } else {
              ruta.nombrePiloto = 'No asignado';
          }  
          return ruta;      
      }));
      return viaje    
    }));
  }

  const getViajes = async signal => {
    try {
      let response = null;
      switch(user.rol) {
        case rolesEnum.SOLICITANTE:
          response = await ViajesHelper.getViajesBySolicitant(signal.token, user.id);
          break;
        case rolesEnum.DIRECTOR:
          response = await ViajesHelper.getViajesBySolicitant(signal.token, user.id);
          break;
        default:
          response = await ViajesHelper.getViajes(signal.token);
          break;
      }
      if (response) {
        //viajes = await mapPilotosToViaje(response, signal)
        await getUsers(signal, response);
        setViajes(response);
      } 
    } catch (error) {
        console.log(error);
        if (axios.isCancel(error)) {
            //console.log('Error: ', error.message); // => prints: Api is being canceled
        }
    }  
  }

  const getUsers = async (signal, viajes) => {
    try {
      let directores = await UsuariosHelper.buscarUsuarioByRol(signal.token, rolesEnum.DIRECTOR)
      if (directores) {
        directores = directores.map(res => {
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

        viajes = await Promise.all(await viajes.map(async viaje => {
          if(!viaje.nombreSolicitante) {
            const solicitante = await UsuariosHelper.buscarUsuarioById(viaje.id_solicitante)
            viaje.nombreSolicitante = solicitante.nombre
          }
          directores.forEach(director => {
            if(!viaje.nombreDirector && viaje.id_director === director.value){
              viaje.nombreDirector = director.label;
            }
          })
          viaje.nombreDirector = viaje.nombreDirector || 'No aplica';
        }));

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
    return ()=>{signal.cancel('Api is being canceled');}
  }, []);

  const solicitarViaje = async (viaje) => {
    try {
      viaje.id_solicitante = user.id;
      await ViajesHelper.solicitarViaje(viaje);
      getViajes(axios.CancelToken.source());
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
      enableView
    />
  );
}

export default ViajeSolicitante;