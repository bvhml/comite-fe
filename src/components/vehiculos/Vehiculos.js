import React, { useState, useEffect, forwardRef, useReducer } from 'react';
import validator from 'validator';
import FormularioEntidad from '../forms/FormularioEntidad'
import VehiculoHelperMethods from '../../helpers/VehiculoHelperMethods';
import { Grid, TextField, Button, Modal } from '@material-ui/core';
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
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';


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

  function vehiculosReducer(state, action) {
    switch (action.type) {
      case 'field': {
        return {
          ...state,
          error: false,
          vehiculo: {...state.vehiculo,[action.fieldName]:action.payload},
        };
      }
      case 'load': {
        return {
          ...state,
          error: '',
          isLoading: true,
        };
      }
      case 'vehiculos': {
        return {
          ...state,
          vehiculos: action.payload,
          isLoading: false,
        };
      }
      case 'vehiculo': {
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
    vehiculos: [],
    vehiculo: null,
    isLoading: false,
    error: false,
    showError: false,
    isLoggedIn: false,
    open: false,
    editar: false,
  };

const Vehiculos = ({ classes, mobile }) => {

  const VehiculosHelper = new VehiculoHelperMethods(process.env.REACT_APP_EP);

  const [state, dispatch] = useReducer(vehiculosReducer, initialState);
  const { vehiculos, vehiculo, isLoading, open, editar, error, showError } = state;

  let fields = [{ 
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
  }];
  
  let columns= [
    { 
      title: 'Piloto Asignado', 
      field: 'piloto',
      searchable:true,
      render: rowData => <div style={{color:'cornflowerblue'}}>{rowData.piloto}</div>
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

  useEffect(() =>{
    let signal = axios.CancelToken.source();
    const getTodosVehiculos = async ()=>{
      const VehiculosHelper = new VehiculoHelperMethods(process.env.REACT_APP_EP); 
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
    }
    getTodosVehiculos();
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

  const handleSubmit = event => {
      event.preventDefault();
      validateForm();
      if(!error){
          enviarVehiculo()
      }
  }

  const validateForm = () => {
    fields.forEach(field => {
      if(!error && !vehiculo[field.field]) {
        dispatch({ type: 'error' });
      }
    });
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

  const editarVehiculo = async (event) => {
    event.preventDefault();
    try {
      const VehiculosHelper = new VehiculoHelperMethods(process.env.REACT_APP_EP); 
      let saveResponse = await VehiculosHelper.guardarVehiculo(vehiculo);
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

            { vehiculos && vehiculos.length && !isLoading && <MaterialTable
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
                    icon: tableIcons.Edit,
                    tooltip: 'Editar vehiculo',
                    onClick: (event, rowData) => {
                      // Do save operation
                      dispatch({type: 'editar'})
                      dispatch({ type: 'vehiculo', payload: rowData });

                    }
                  },
                  {
                    icon: tableIcons.Delete,
                    tooltip: 'Eliminar vehiculo',
                    onClick: (event, rowData) => {
                      // Do save operation
                    }
                  }
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
            {
              vehiculo && <FormularioEntidad title="Editar vehículo" fields={fields} model={vehiculo} onChange={handleChange} onSubmit={editarVehiculo} /> 
            /* {vehiculo && <form noValidate autoComplete="off" spacing={2} >
              <TextField
              id="marca"
              label='Marca'
              value={vehiculo.marca || ''}
              variant='standard'
              style={{paddingLeft:'1rem'}}
              onChange={handleChange}
              />
              <TextField
              id="placa"
              label='Placa'
              value={vehiculo.placa || ''}
              variant='standard'
              style={{paddingLeft:'1rem'}}
              onChange={handleChange}
              />
              <TextField
              id="modelo"
              label='Modelo'
              value={vehiculo.modelo || ''}
              variant='standard'
              style={{paddingLeft:'1rem'}}
              onChange={handleChange}
              />
              <TextField
              id="linea"
              label='Linea'
              value={vehiculo.linea || ''}
              variant='standard'
              style={{paddingLeft:'1rem'}}
              onChange={handleChange}
              />
              <TextField
              id="tipo"
              label='Tipo'
              value={vehiculo.tipo || ''}
              variant='standard'
              style={{paddingLeft:'1rem'}}
              onChange={handleChange}
              />
              <TextField
              id="chasis"
              label='Chasis'
              value={vehiculo.chasis || ''}
              variant='standard'
              style={{paddingLeft:'1rem'}}
              onChange={handleChange}
              />
              <TextField
              id="tamaño_motor"
              label='Motor'
              value={vehiculo.tamaño_motor || ''}
              variant='standard'
              style={{paddingLeft:'1rem'}}
              onChange={handleChange}
              />
              <TextField
              id="cant_cilindros"
              label='Cilindros'
              value={vehiculo.cant_cilindros || ''}
              variant='standard'
              style={{paddingLeft:'1rem'}}
              onChange={handleChange}
              />
              <TextField
              id="toneladas"
              label='Toneladas'
              value={vehiculo.toneladas || ''}
              variant='standard'
              style={{paddingLeft:'1rem'}}
              onChange={handleChange}
              />
              <TextField
              id="transmision"
              label='Transmision'
              value={vehiculo.transmision || ''}
              variant='standard'
              style={{paddingLeft:'1rem'}}
              onChange={handleChange}
              />
              <TextField
              id="asientos"
              label='Numero de asientos'
              value={vehiculo.asientos || ''}
              variant='standard'
              style={{paddingLeft:'1rem'}}
              onChange={handleChange}
              />
              <TextField
              id="color"
              label='Color'
              value={vehiculo.color || ''}
              variant='standard'
              style={{paddingLeft:'1rem'}}
              onChange={handleChange}
              />

              <Button onClick={()=> dispatch({type:'noEditar'})} style={{backgroundColor: '#e04046',color: '#ffffff',float: 'right',marginTop: '1rem',marginRight: '1rem'}}>
                Cancelar
              </Button>
              <Button onClick={editarVehiculo} style={{backgroundColor: 'green',color: '#ffffff',float: 'right',marginTop: '1rem',marginRight: '1rem'}}>
                Guardar
              </Button>
            </form>} */}
          </Grid>
          </Modal>
        </div>
      </div>
    </Grid>
    );
}

export default Vehiculos;