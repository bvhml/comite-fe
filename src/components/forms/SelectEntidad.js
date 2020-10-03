import React from 'react';
import { FormControl, InputLabel, Select} from '@material-ui/core';

const SelectEntidad = ({ model, field, options, columnSize, label, handleChange }) => {    
    return <div style={{ width: columnSize, display: 'inline-block', padding: '1rem' }} key={field}>
        <FormControl fullWidth={true} margin="dense">
            <InputLabel htmlFor={field} className="formulario-entidad__label">{label}</InputLabel>
            <Select id={field} native defaultValue={model && model[field] ? model[field] : ''} className="formulario-entidad__input" onChange={handleChange} children={
                options.map(option => {
                    return <option style={{ cursor: 'pointer' }} value={option.value}>{option.label}</option>
                })                                                
            }></Select>
        </FormControl>
    </div>    
}

export default SelectEntidad;