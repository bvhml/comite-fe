import React, { useState, useEffect, forwardRef, useReducer } from 'react';
import validator from 'validator';
import FormularioEntidad from '../forms/FormularioEntidad'
import VehiculoHelperMethods from '../../helpers/VehiculoHelperMethods';
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
import { useParams } from 'react-router-dom';

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
          mantenimiento: {...state.mantenimiento,[action.fieldName]:action.payload},
        };
      }
      case 'load': {
        return {
          ...state,
          error: '',
          isLoading: true,
        };
      }
      case 'mantenimientos': {
        return {
          ...state,
          mantenimientos: action.payload,
          isLoading: false,
        };
      }
      case 'mantenimiento': {
        return {
          ...state,
          mantenimiento: action.payload,
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
    mantenimientos: [],
    mantenimiento: null,
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
  const { mantenimientos, mantenimiento, isLoading, open, editar, error, showError } = state;
  let { entidad } = useParams();


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
      render: rowData => <div style={{color:'cornflowerblue'}}>{rowData.fecha}</div>
    },
  ];

  useEffect(() =>{
    let signal = axios.CancelToken.source();
    const getTodosVehiculos = async ()=>{

      if (entidad){
        const VehiculosHelper = new VehiculoHelperMethods(process.env.REACT_APP_EP); 
        try {
          dispatch({ type: 'load' });
          const response = await VehiculosHelper.obtenerTodosMantenimientoVehiculo(entidad, signal.token)
          if (response) {
              dispatch({ type: 'mantenimientos', payload: response });
          } 
        } catch (error) {
            if (axios.isCancel(error)) {
              //console.log('Error: ', error.message); // => prints: Api is being canceled
          }
        }  
      }
    }
    getTodosVehiculos();
    return ()=>{signal.cancel('Api is being canceled');}
  },[entidad]);

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
      if(!error && !mantenimiento[field.field]) {
        dispatch({ type: 'error' });
      }
    });
  }

  const enviarVehiculo = async () => {
    try {
      let saveResponse = await VehiculosHelper.guardarVehiculo(mantenimiento);
      mantenimientos.push(mantenimiento);
      dispatch({ type: 'mantenimientos', payload: mantenimientos });
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
      let saveResponse = await VehiculosHelper.guardarVehiculo(mantenimiento);
      let signal = axios.CancelToken.source();
      
      try {
        dispatch({ type: 'load' });
        const response = await VehiculosHelper.obtenerTodosVehiculos(signal.token)
        if (response) {
          dispatch({ type: 'mantenimientos', payload: response });
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
            <Button className="vehiculos__boton-agregar" variant="contained" onClick={handleOpen}>Nuevo mantenimiento</Button>
          </Grid>
          
          <Grid container style={{minHeight:'80vh', marginTop:'20px'}}>
            { mantenimientos && !isLoading && <MaterialTable
              icons={tableIcons}
              columns={columns}
              data={mantenimientos}
              stickyHeader
              title="Gestionar mantenimientos"
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
                    tooltip: 'Editar mantenimiento',
                    onClick: (event, rowData) => {
                      
                      dispatch({type: 'editar'})
                      dispatch({ type: 'mantenimiento', payload: rowData });

                    }
                  },
                ]}
                
            /> }
            {console.log(mantenimientos)}
            {isLoading && <Grid> Cargando mantenimientos ...</Grid>} 
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
            { mantenimiento && <FormularioEntidad title="Editar vehículo" fields={fields} model={mantenimiento} onChange={handleChange} onSubmit={editarVehiculo} /> }
          </Grid>
          </Modal>
        </div>
      </div>
    </Grid>
    );
}

export default Vehiculos;