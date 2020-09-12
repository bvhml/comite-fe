import React from 'react';

import {TextField, Grid, Dialog, DialogActions, DialogContent, DialogContentText, FormControl, InputLabel, Select, FormHelperText } from '@material-ui/core';

import FormValidator from '../../utils/FormValidator';
import validator from 'validator';

const FormularioVehiculos = () => {

    const fields = [{
        label: 'Placa',
        field: 'placa',
        method: validator.isEmpty,
        validWhen: false,
        message: 'Placa requerida'
    },
    { 
        label: 'Marca',
        field: 'marca',
        method: validator.isEmpty,
        validWhen: false,
        message: 'Ingrese la marca'
    },
    { 
        label: 'Modelo',
        field: 'modelo',
        method: validator.isNumeric,
        validWhen: true,
        message: 'Ingrese el modelo'
    },
    { 
        label: 'Línea',
        field: 'linea',
        method: validator.isEmpty,
        validWhen: false,
        message: 'Ingrese la línea'
    },
    { 
        label: 'Tipo',
        field: 'tipo',
        method: validator.isEmpty,
        validWhen: false,
        message: 'Seleccione un tipo de vehículo'
    },
    { 
        label: 'Chasis',
        field: 'chasis',
        method: validator.isEmpty,
        validWhen: false,
        message: 'Ingrese el código del chasis'
    },
    { 
        label: 'Tamaño de motor',
        field: 'tamaño_motor',
        method: validator.isEmpty,
        validWhen: false,
        message: 'Ingrese el tamaño del motor'
    },
    { 
        label: 'Cantidad de cilindros',
        field: 'cant_cilindros',
        method: validator.isNumeric,
        validWhen: false,
        message: 'Ingrese un número de cilindros válido'
    },
    { 
        label: 'Toneladas',
        field: 'toneladas',
        method: validator.isNumeric,
        validWhen: false,
        message: 'Ingrese un número de toneladas válido'
    },
    { 
        label: 'Transmisión',
        field: 'transmision',
        method: validator.isEmpty,
        validWhen: false,
        message: 'Seleccione el tipo de transmisión'
    },
    { 
        label: 'Número de asientos',
        field: 'asientos',
        method: validator.isNumeric,
        validWhen: false,
        message: 'Ingrese un número de asientos válido'
    },
    { 
        label: 'Color',
        field: 'color',
        method: validator.isEmpty,
        validWhen: false,
        message: 'Ingrese un color'
    }];
    const validatorArg = new FormValidator(fields);

    const getFields = () => {
        return fields.map(field => {
            return (
                <Grid item xs={12} md={6}>
                    <TextField
                        variant="outlined"
                        margin="dense"
                        required
                        fullWidth
                        id={field.field}
                        label={field.label}
                        name={field.field}
                        autoFocus
                        //error={validationResponse[field.field]}
                        //helperText={formState[field.field].errorMessage}
                    />
                </Grid>
            )
        });
    }

    const handleSubmit = () => {}

    return (
        <form onSubmit={handleSubmit} noValidate autoComplete='off'>
            <Grid container spacing={2}>
                { getFields() }      
            </Grid>      
        </form>
    );
}

export default FormularioVehiculos;