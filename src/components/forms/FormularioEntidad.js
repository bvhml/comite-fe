import React from 'react';

import { Button, FormControl, InputLabel, Input, Select} from '@material-ui/core';

import './forms.scss';

const FormularioEntidad = ({ type, fields, onChange, onSubmit }) => {

    const getTitle = () => {
        switch(type) {
            case 'vehiculos': return 'Nuevo vehículo'
            case 'usuarios': return 'Nuevo usuario'
            default: return 'Nuevo item'
        }
    }    

    const handleSubmit = event => {
        onSubmit(event);
    }

    const handleChange = event => {
        onChange(event);
    }

    return (
        <div className="formulario-entidad">
            <h1 className="formulario-entidad__titulo">{ getTitle() }</h1>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                {
                    fields.map(field => {
                        switch(field.type) {
                            case 'select':
                                return (    
                                    <div style={{ width: field.columnSize, display: 'inline-block', padding: '1rem' }} key={field.field}>
                                        <FormControl fullWidth={true} margin="dense">
                                            <InputLabel htmlFor={field.field} className="formulario-entidad__label">{field.label}</InputLabel>
                                            <Select id={field.field} onChange={handleChange} className="formulario-entidad__input" children={
                                                field.options.map(option => {
                                                    return <option style={{ cursor: 'pointer' }} value={option.value}>{option.label}</option>
                                                })                                                
                                            }></Select>
                                        </FormControl>
                                    </div>    
                                );
                            default:
                                return (    
                                    <div style={{ width: field.columnSize, display: 'inline-block', padding: '1rem' }} key={field.field}>
                                        <FormControl fullWidth={true} margin="dense">
                                            <InputLabel htmlFor={field.field} className="formulario-entidad__label">{field.label}</InputLabel>
                                            <Input id={field.field} type={field.type} onChange={handleChange} className="formulario-entidad__input"></Input>
                                        </FormControl>
                                    </div>    
                                );
                        }
                         
                    })
                }                
                <Button type="submit" className="formulario-entidad__boton-ingresar" variant="contained">Ingresar</Button>
            </form>            
        </div>
    );
}

export default FormularioEntidad;