import React, { useState, useEffect } from 'react';
import { Button, Modal } from '@material-ui/core';
import validator from 'validator';

import FormularioEntidad from '../forms/FormularioEntidad'
import VehiculoHelperMethods from '../../helpers/VehiculoHelperMethods';

import './vehiculos.scss';

const Vehiculos = ({ classes, mobile }) => {

  const VehiculosHelper = new VehiculoHelperMethods(process.env.REACT_APP_EP);

  const [open, setOpen] = useState(false);
  const [vehiculo, setVehiculo] = useState({});
  const [formError, setFormError] = useState(false);
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
      <div className="vehiculos">
        <div className="vehiculos__encabezado">
          <Button className="vehiculos__boton-agregar" variant="contained" onClick={handleOpen}>Ingresar un vehículo</Button>
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
      
    );
}

export default Vehiculos;