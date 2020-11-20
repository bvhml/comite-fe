import React from 'react';
import { FormControl, InputLabel, Input } from '@material-ui/core';

const InputEntidad = ({ model, field, type, columnSize, label, handleChange }) => {    
    return <div style={{ width: columnSize, display: 'inline-block', padding: '1rem' }} key={field}>
        <FormControl fullWidth={true} margin="dense">
            <InputLabel htmlFor={field} className="formulario-entidad__label">{label}</InputLabel>
            <Input id={field} type={type} defaultValue={model && model[field] ? model[field] : ''} onBlur={handleChange} className="formulario-entidad__input"></Input>
        </FormControl>
    </div> 
}

export default InputEntidad;