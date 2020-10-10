import React from 'react';
import { FormControl, InputLabel, Select} from '@material-ui/core';

const SelectEntidad = ({ field, meta, fieldItem }) => {

    return (
        <div style={{ width: fieldItem.columnSize, display: 'inline-block', padding: '1rem' }} key={fieldItem.field}>
            <FormControl fullWidth={true} margin="dense">
                <InputLabel htmlFor={fieldItem.field} className="formulario-entidad__label">{fieldItem.label}</InputLabel>
                <Select className="formulario-entidad__input" id={fieldItem.field} {...field} children={
                    fieldItem.options && fieldItem.options.map(option => {
                        return <option style={{ cursor: 'pointer' }} value={option.value}>{option.label}</option>
                    })                                                
                }></Select>
                { meta.touched && meta.error && <div className="error">{meta.error}</div> }
            </FormControl>
        </div>
    )    
}

export default SelectEntidad;