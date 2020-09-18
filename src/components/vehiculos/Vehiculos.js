import React, { useState, useEffect, forwardRef } from 'react';
import { Button, Modal } from '@material-ui/core';
import validator from 'validator';
import FormularioEntidad from '../forms/FormularioEntidad'
import VehiculoHelperMethods from '../../helpers/VehiculoHelperMethods';
import { Grid } from '@material-ui/core';
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


const Vehiculos = ({ classes, mobile }) => {

  const VehiculosHelper = new VehiculoHelperMethods(process.env.REACT_APP_EP);

  const [open, setOpen] = useState(false);
  const [vehiculo, setVehiculo] = useState({});
  const [vehiculos, setVehiculos] = useState(null);
  const [formError, setFormError] = useState(false);
  const [editar, setEditar] = useState(false);

  let fields = [{ 
    label: 'Marca',
    columnSize: '30%',
    field: 'marca',
    validWhen: false,
    message: 'Ingrese la marca',
    error: false
  }, {
    label: 'Placa',
    columnSize: '20%',
    field: 'placa',
    validWhen: false,
    message: 'Placa requerida',
    error: false
  }, { 
    label: 'Modelo',
    columnSize: '20%',
    field: 'modelo',
    validWhen: true,
    message: 'Ingrese el modelo',
    error: false
  }, { 
    label: 'Línea',
    columnSize: '30%',
    field: 'linea',
    validWhen: false,
    message: 'Ingrese la línea',
    error: false
  }, { 
    label: 'Tipo',
    columnSize: '20%',
    field: 'tipo',
    validWhen: false,
    message: 'Seleccione un tipo de vehículo',
    error: false
  }, { 
    label: 'Chasis',
    columnSize: '40%',
    field: 'chasis',
    validWhen: false,
    message: 'Ingrese el código del chasis',
    error: false
  }, { 
    label: 'Motor',
    columnSize: '40%',
    field: 'tamaño_motor',
    validWhen: false,
    message: 'Ingrese el tamaño del motor',
    error: false
  }, { 
    label: 'Cilindros',
    columnSize: '30%',
    field: 'cant_cilindros',
    validWhen: false,
    message: 'Ingrese un número de cilindros válido',
    error: false
  }, { 
    label: 'Toneladas',
    columnSize: '30%',
    field: 'toneladas',
    validWhen: false,
    message: 'Ingrese un número de toneladas válido',
    error: false
  }, { 
    label: 'Transmisión',
    columnSize: '40%',
    field: 'transmision',
    validWhen: false,
    message: 'Seleccione el tipo de transmisión',
    error: false
  }, { 
    label: 'Número de asientos',
    columnSize: '50%',
    field: 'asientos',
    validWhen: false,
    message: 'Ingrese un número de asientos válido',
    error: false
  }, { 
    label: 'Color',
    columnSize: '50%',
    field: 'color',
    validWhen: false,
    message: 'Ingrese un color',
    error: false
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
        const response = await VehiculosHelper.obtenerTodosVehiculos(signal.token)
        setVehiculos(response);
        if (response) {

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
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleChange = event => {
    setFormError(false);
    setVehiculo({ ...vehiculo, [event.target.id]: event.target.value });
  }

  const handleSubmit = event => {
      event.preventDefault();
      validateForm();
      if(!formError){
          enviarVehiculo()
      }
  }

  const validateForm = () => {
    fields.forEach(field => {
      if(!formError && !vehiculo[field.field]) {
        setFormError(true);
      }
    });
  }

  const enviarVehiculo = async () => {
    try {
      let saveResponse = await VehiculosHelper.guardarVehiculo(vehiculo);
      console.log(saveResponse);
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
            <Button className="vehiculos__boton-agregar" variant="contained" onClick={handleOpen}>Ingresar un vehículo</Button>
          </Grid>

          <Grid container style={{minHeight:'80vh', marginTop:'20px'}}>

            { vehiculos && <MaterialTable
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
          </Grid>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <FormularioEntidad type="vehiculos" fields={fields} onChange={handleChange} onSubmit={handleSubmit} />
          </Modal>
        </div>
      </div>
    </Grid>
    );
}

export default Vehiculos;