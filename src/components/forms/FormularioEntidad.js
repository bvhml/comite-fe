import React from 'react';

import FormularioVehiculos from './FormularioVehiculos'

import './forms.css';

const FormularioEntidad = ({ type }) => {

    const getTitle = () => {
        switch(type) {
            case 'vehiculos': return 'Nuevo vehículo'
        }
    }

    return (
        <div className="formulario-entidad">
            <h1 className="formulario-entidad__titulo">{ getTitle() }</h1>
            <FormularioVehiculos />
        </div>
    );
}

export default FormularioEntidad;