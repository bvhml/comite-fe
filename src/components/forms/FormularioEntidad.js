import React from 'react';

import { Button } from '@material-ui/core';

import './forms.scss';
import InputEntidad from './InputEntidad';
import SelectEntidad from './SelectEntidad';

const FormularioEntidad = ({ title, fields, model, onChange, onSubmit }) => {

    return (
        <div className="formulario-entidad">
            <h1 className="formulario-entidad__titulo">{ title }</h1>
            <form noValidate autoComplete="off" onSubmit={onSubmit}>
                {
                    fields.map(field => {
                        switch(field.type) {
                            case 'select':
                                return <SelectEntidad
                                            model={model} 
                                            field={field.field}
                                            columnSize={field.columnSize} 
                                            options={field.options}
                                            label={field.label} 
                                            handleChange={onChange} />
                            default:                                
                                return <InputEntidad 
                                            model={model} 
                                            field={field.field} 
                                            type={field.type} 
                                            columnSize={field.columnSize} 
                                            label={field.label} 
                                            handleChange={onChange} />
                        }
                         
                    })
                }                
                <Button type="submit" className="formulario-entidad__boton-ingresar" variant="contained">Ingresar</Button>
            </form>            
        </div>
    );
}

export default FormularioEntidad;