import React, { useState } from 'react';
import { Button, Modal } from '@material-ui/core';

import FormularioEntidad from '../forms/FormularioEntidad'

import './vehiculos.css';

const Vehiculos = ({ classes, mobile }) => {

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
            <FormularioEntidad type="vehiculos" onSubmit={()=>{}} />
          </Modal>
        </div>
      </div>
      
    );
}

export default Vehiculos;