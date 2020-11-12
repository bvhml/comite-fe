import React, { useState, useEffect} from 'react';
import ViajesHelperMethods from '../../helpers/ViajesHelperMethods';
import UserHelperMethods from '../../helpers/UserHelperMethods';
import ViajesReducer from './../../reducers/ViajesReducer';
import TablaEntidad from './../forms/TablaEntidad';
import axios from 'axios';  
import { rolesEnum } from '../../enums/RolesEnum';
import { getStatusText, statusEnum } from '../../enums/StatusEnum';

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
    columnSize: '25%',
    field: 'fecha_0',
    validWhen: false,
    message: 'Este campo es requerido',
    error: false,
    type: 'datetime-local',
    required: true,
    defaultValue: nowDate,
    wrapGroup: 1
  }, { 
    label: 'Dirección de origen',
    columnSize: '37.5%',
    field: 'ubicacion_inicio_0',
    validWhen: false,
    message: 'Ingrese la dirección de origen',
    error: false,
    type: 'text',
    required: true,
    defaultValue: '',
    wrapGroup: 1
  }, { 
    label: 'Dirección de destino',
    columnSize: '37.5%',
    field: 'ubicacion_fin_0',
    validWhen: false,
    message: 'Este campo es requerido',
    error: false,
    type: 'text',
    required: true,
    defaultValue: '',
    wrapGroup: 1
  }, { 
    label: 'Personas',
    columnSize: '20%',
    field: 'numero_personas_0',
    validWhen: false,
    message: 'Este campo es requerido',
    error: false,
    type: 'number',
    required: true,
    defaultValue: 1,
    wrapGroup: 1
  }, { 
    label: 'Notas',
    columnSize: '80%',
    field: 'notas_0',
    validWhen: false,
    message: 'Este campo es requerido',
    error: false,
    type: 'text',
    required: false,
    defaultValue: '',
    wrapGroup: 1
  }, { 
    label: 'Agregar ruta',
    columnSize: '20%',
    field: 'rutas',
    validWhen: false,
    message: 'Debe agregar al menos una ruta',
    error: false,
    type: 'dynamic',
    childFields: ['fecha', 'ubicacion_inicio', 'ubicacion_fin', 'numero_personas'],
    required: false,
    wrapGroup: 0
  }, { 
    label: 'Aprobar por director',
    columnSize: '100%',
    field: 'id_director',
    validWhen: false,
    message: 'Ingrese la dirección de origen',
    error: false,
    type: 'select',
    required: false,
    defaultValue: -1,
    options: [],
    wrapGroup: 0
  }]; 
  const [fields, setFields] = useState([].concat(initialFieldsState));
  const [pilotsAssignmentFields, setPilotAssignmentFields] = useState([]);

  const permissions = {
    enableAssignment: user.rol === rolesEnum.ADMINISTRADOR, 
    enableAproval: user.rol === rolesEnum.DIRECTOR, 
    onAssign: async (viaje) => {
      await editarViaje(viaje, statusEnum.ASIGNED);
    }, 
    onAprove: async (viaje) => {
      await editarViaje(viaje, statusEnum.APROVED);
    },
    onStart: async (viaje) => {
      await editarViaje(viaje, statusEnum.IN_PROGRESS);
    }, 
    onFinish: async (viaje) => {
      await editarViaje(viaje, statusEnum.FINISHED);
    },
    onDeny: async (viaje) => {
      await editarViaje(viaje, statusEnum.CANCELLED);
    }
  }

  
  const dynamicClick = (data) => {    

    const index = ((fields.length - 7) / 5) + 1;

    fields.splice(fields.length - 2, 0, { 
      label: 'Fecha',
      columnSize: '25%',
      field: 'fecha_' + index,
      validWhen: false,
      message: 'Este campo es requerido',
      error: false,
      type: 'datetime-local',
      required: true,
      defaultValue: data && data.fecha || nowDate,
      wrapGroup: index + 1
    });

    fields.splice(fields.length - 2, 0, { 
      label: 'Dirección de origen',
      columnSize: '37.5%',
      field: 'ubicacion_inicio_' + index,
      validWhen: false,
      message: 'Ingrese la dirección de origen',
      error: false,
      type: 'text',
      required: true,
      defaultValue: data && data.ubicacion_inicio || '',
      wrapGroup: index + 1
    })

    fields.splice(fields.length - 2, 0, { 
      label: 'Dirección de destino',
      columnSize: '37.5%',
      field: 'ubicacion_fin_' + index,
      validWhen: false,
      message: 'Este campo es requerido',
      error: false,
      type: 'text',
      required: true,
      defaultValue: data && data.ubicacion_fin || '',
      wrapGroup: index + 1
    });
    
    fields.splice(fields.length - 2, 0, { 
      label: 'Personas',
      columnSize: '20%',
      field: 'numero_personas_' + index,
      validWhen: false,
      message: 'Este campo es requerido',
      error: false,
      type: 'number',
      required: true,
      defaultValue: data && data.numero_personas || 1,
      wrapGroup: index + 1
    });
    
    fields.splice(fields.length - 2, 0, { 
      label: 'Notas',
      columnSize: '80%',
      field: 'notas_' + index,
      validWhen: false,
      message: 'Este campo es requerido',
      error: false,
      type: 'text',
      required: false,
      defaultValue: data && data.notas || '',
      wrapGroup: index + 1
    });

    setFields(fields);
  }

  const entityToFormFields = async entity => {
    let signal = axios.CancelToken.source();
    let pilotos = await getPilotos(signal);
    entity.rutas.forEach((ruta, index) => {
      pilotsAssignmentFields.push({
        label: 'Piloto',
        columnSize: '100%',
        field: `id_conductor_${index}`,
        type: 'select',
        readOnly: entity.id_estatus > statusEnum.ASIGNED,
        required: true,
        defaultValue: '',
        options: pilotos.reduce((options, pilotoItem) => {
          pilotoItem.vehiculos.forEach(vehiculo => {
            if(ruta.numero_personas <= vehiculo.asientos) {
              options.push({
                label: `${pilotoItem.nombre} ${pilotoItem.apellido} (${vehiculo.marca} ${vehiculo.linea} - ${vehiculo.asientos} asientos)`,
                value: pilotoItem.id
              });
            }            
          })
          return options;
        }, []),
        wrapGroup: index + 1
      })
      setPilotAssignmentFields(pilotsAssignmentFields);

      if(index > 0) {
        dynamicClick(ruta);
      }
      else {
        for(const rutaProperty in ruta) {
          fields.forEach(field => {
            if(field.field === `${rutaProperty}_${index}`) {
              field.defaultValue = ruta[rutaProperty];
            }
          })
        }
      }      
    });
    setFields(fields)
  }

  const columns= [{ 
      title: 'Rutas',
      searchable:true,
      filtering: true,
      render: rowData => <div style={{color:'cornflowerblue'}}>{rowData.rutas.length}</div>
    }, { 
      title: 'Solicitante',
      field: 'nombreSolicitante',
      searchable:true,
      filtering: true,
      render: rowData => <div style={{color:'cornflowerblue'}}>{rowData.nombreSolicitante}</div>
    }, { 
        title: 'Director',
        field: 'nombreDirector',
        searchable:true,
        filtering: true,
        render: rowData => <div style={{color:'cornflowerblue'}}>{rowData.nombreDirector}</div>
    }, { 
      title: 'Dirección inicial',
      searchable:true,
      filtering: true,
      render: rowData => <div style={{color:'cornflowerblue'}}>{rowData.rutas.length && rowData.rutas[0].ubicacion_inicio}</div>
    }, { 
      title: 'Estatus',
      field: 'id_estatus',
      searchable:true,
      filtering: true,
      lookup: { 0: 'Solicitado', 1: 'Autorizado', 2: 'Asignado', 3: 'En Progreso', 4: 'Completado', '-1': 'Cancelado' },
      render: rowData => <div style={{color:'cornflowerblue'}}>{getStatusText(rowData.id_estatus)}</div>
    }
  ];

  const mapPilotosToViaje = async (viajes, signal) => {
    return Promise.all(await viajes.map(async viaje => {            
      // Map pilotos
      viaje.rutas = await Promise.all( await viaje.rutas.map(async (ruta, index) => {
          if(ruta){
              const response = await UsuariosHelper.buscarUsuarioById(ruta.id_conductor, signal.token);
              viaje[`id_conductor_${index}`] = ruta.id_conductor;
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

  const getPilotos = async (signal) => {
    try {
      const pilotos = await UsuariosHelper.getPilotos();
      return pilotos;
    }
    catch (error) {
      console.log(error);
        if (axios.isCancel(error)) {
            //console.log('Error: ', error.message); // => prints: Api is being canceled
        }
    } 
  }

  const getViajes = async signal => {
    try {
      let response = null;
      switch(user.rol) {
        case rolesEnum.SOLICITANTE:
          response = await ViajesHelper.getViajesBySolicitant(signal.token, user.id);
          break;
        case rolesEnum.DIRECTOR:
          response = await ViajesHelper.getViajesByDirector(signal.token, user.id);
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
            label: `${res.nombre} ${res.apellido}${res.titulo ? ` - ${res.titulo}` : ''}`,
            value: res.id
          }
        })
        fields.forEach(field => {
          if(field.field === 'id_director') {
            field.options = [{
              label: 'No solicitar autorización',
              value: -1
            }].concat(directores);
          }
        });
        await mapPilotosToViaje(viajes, signal);
        setFields(fields);

        viajes = await Promise.all(await viajes.map(async viaje => {
          if(!viaje.nombreSolicitante) {
            const solicitante = await UsuariosHelper.buscarUsuarioById(viaje.id_solicitante)
            viaje.nombreSolicitante = `${solicitante.nombre} ${solicitante.apellido}`
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

  const editarViaje = async (viaje, status) => {
    try {
      viaje.id_estatus = status;
      let signal = axios.CancelToken.source()
      await ViajesHelper.editarViaje(signal, viaje);
      getViajes(signal);
    }
    catch (error) {
      console.log(error);
    }
  }

  const resetFormStructure = async () => {
    let signal = axios.CancelToken.source()
    setFields(initialFieldsState)
    await getUsers(signal, viajes);
    setViajes(viajes);
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
      entityToFormFields={entityToFormFields}
      enableView
      enableCreate
      enableFiltering
      permissions={permissions}
      assigneesFieldData={pilotsAssignmentFields}
    />
  );
}

export default ViajeSolicitante;