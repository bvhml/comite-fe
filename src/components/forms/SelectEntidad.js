import React from 'react';
import { FormControl, InputLabel, Select} from '@material-ui/core';

const SelectEntidad = ({ field, meta, fieldItem }) => {

    return (
        <div style={{ width: fieldItem.columnSize, display: 'inline-block', padding: '1rem' }} key={field.name}>
            <FormControl fullWidth={true} margin="dense">
                <InputLabel htmlFor={field.name} className="formulario-entidad__label">{fieldItem.label}</InputLabel>
                <Select className="formulario-entidad__input" id={field.name} name={field.name} required={fieldItem.required} readOnly={fieldItem.readOnly} value={field.value} onChange={field.onChange} children={
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