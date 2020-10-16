import React, { useState, useEffect, forwardRef, useReducer } from 'react';
import validator from 'validator';
import FormularioEntidad from '../forms/FormularioEntidad'
import ViajesHelperMethods from '../../helpers/ViajesHelperMethods';
import UserHelperMethods from '../../helpers/UserHelperMethods';

import Mantenimientos from './MantenimientoVehiculo'
import { Grid, Button, Modal } from '@material-ui/core';
import axios from 'axios';
import MaterialTable from 'material-table';

import './vehiculos.scss';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { useHistory } from 'react-router-dom';

  const tableIcons = {
      Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
      Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
      Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
      Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
      DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
      Edit: forwardRef((props, ref) => <EditOutlinedIcon {...props} ref={ref} />),
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
      ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
      BuildIcon: forwardRef((props, ref) =><BuildOutlinedIcon {...props} ref={ref}/>)
  };

  function vehiculosReducer(state, action) {
    switch (action.type) {
      case 'field': {
        return {
          ...state,
          error: false,
          vehiculo: {
            ...state.vehiculo,
            [action.fieldName]:action.payload
          },
        };
      }
      case 'load': {
        return {
          ...state,
          error: '',
          isLoading: true,
        };
      }
      case 'viajes': {
        return {
          ...state,
          vehiculos: action.payload,
          isLoading: false,
        };
      }
      case 'viaje': {
        return {
          ...state,
          vehiculo: action.payload,
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
    viajes: [],
    viaje: null,
    isLoading: false,
    error: false,
    showError: false,
    isLoggedIn: false,
    open: false,
    editar: false
  };

const Viajes = ({ classes, mobile }) => {

  const ViajesHelper = new ViajesHelperMethods(process.env.REACT_APP_EP);
  const UsuariosHelper = new UserHelperMethods(process.env.REACT_APP_EP); 

  const [state, dispatch] = useReducer(vehiculosReducer, initialState);
  const { viajes, viaje, isLoading, open, editar, error, showError} = state;
  const history = useHistory();
  const [fields, setFields] = useState([{ 
    label: 'Dirección de origen',
    columnSize: '50%',
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
    form: [{ 
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
    }]
  }]);
  
  let columns= [
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

  const getViajes = async signal => {
    try {
      dispatch({ type: 'load' });
      const response = await ViajesHelper.getViajes(signal.token)
      if (response) {
        await response.forEach(async viaje => {
            
            // Map pilotos
            await viaje.rutas.forEach(async ruta => {
                if(ruta){
                    const response = await UsuariosHelper.buscarUsuarioById(ruta.id_conductor, signal.token)
                    ruta.nombrePiloto = response.nombre;
                } else {
                    ruta.nombrePiloto = 'No aplica';
                }
              
            });
          
        });
        dispatch({ type: 'viajes', payload: response });
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
    getTodosVehiculos(signal);
    getPilotos(signal);
    return ()=>{signal.cancel('Api is being canceled');}
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
    })
  }

  const handleSubmit = vehiculo => {
    dispatch({ type: 'vehiculo', payload: vehiculo })
    enviarVehiculo();
  }

  const enviarVehiculo = async () => {
    try {
      let saveResponse = await VehiculosHelper.guardarVehiculo(vehiculo);
      vehiculos.push(vehiculo);
      dispatch({ type: 'vehiculos', payload: vehiculos });
      handleClose();
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
        dispatch({ type: 'load' });
        const response = await VehiculosHelper.obtenerTodosVehiculos(signal.token)
        if (response) {
          dispatch({ type: 'vehiculos', payload: response });
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
      <div className="vehiculos">
        <div className="vehiculos__encabezado">
          <Grid container justify='flex-end'>
            <Button className="vehiculos__boton-agregar" variant="contained" onClick={handleOpen}>Ingresar vehículo</Button>
          </Grid>

          <Grid container style={{minHeight:'80vh', marginTop:'20px'}}>
            { vehiculos && (vehiculos.length > 0) && !isLoading && <MaterialTable
              icons={tableIcons}
              columns={columns}
              data={vehiculos}
              stickyHeader
              title="Gestionar Vehiculos"
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
                    icon: tableIcons.BuildIcon,
                    tooltip: 'Mantenimiento de vehiculo',
                    onClick: (event, rowData) => {
                      dispatch({type: 'side'})
                      dispatch({ type: 'vehiculo', payload: rowData });
                      //history.push(`/home/mantenimiento-vehiculo/${rowData.id}`)
                    }
                  },
                  {
                    icon: tableIcons.Edit,
                    tooltip: 'Editar vehiculo',
                    onClick: (event, rowData) => {
                      
                      dispatch({type: 'editar'})
                      dispatch({ type: 'vehiculo', payload: rowData });

                    }
                  },
                  {
                    icon: tableIcons.Delete,
                    tooltip: 'Eliminar vehiculo',
                    onClick: (event, rowData) => {
                      
                    }
                  },
                ]}
                
            />}

            {isLoading && <Grid> Cargando vehiculos ...</Grid>} 
          </Grid>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
           <FormularioEntidad title="Nuevo vehículo" fields={fields} model={null} onChange={handleChange} onSubmit={handleSubmit} /> 
          </Modal>
          <Modal
            open={editar}
            onClose={()=> dispatch({ type: 'noEditar'})}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
          <Grid container style={{maxHeight:'85vh', position:'absolute', top:'50%', left: '50%', width:'50rem', backgroundColor:'white', transform: 'translate(-50%, -50%)', padding:'2rem'}} >
            { vehiculo && <FormularioEntidad title="Editar vehículo" fields={fields} model={vehiculo} onChange={handleChange} onSubmit={editarVehiculo} /> }
          </Grid>
          </Modal>

          <Modal open={side} onClose={()=> dispatch({ type: 'noSide'})}>
            {side && vehiculo && <Mantenimientos vehiculoId={vehiculo.id}/>}
          </Modal>
        </div>
      </div>
    </Grid>
    );
}

export default Vehiculos;