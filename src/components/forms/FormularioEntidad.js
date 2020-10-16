import React from 'react';

import { Button, Input, FormControl, InputLabel } from '@material-ui/core';
import { withFormik, Field, Form } from 'formik'
import SelectEntidad from './SelectEntidad'

import './forms.scss';

const FormularioEntidad = ({ title, fields, options }) => {

    return (
        <div className="formulario-entidad">
            <div className="formulario-entidad__wrapper">
                <h1 className="formulario-entidad__titulo">{ title }</h1>
                <Form>
                    {
                        fields && fields.map(fieldItem => {
                            switch(fieldItem.type) {
                                case 'select':
                                    return (
                                        <Field name={fieldItem.field}>
                                            {({ field, meta }) => <SelectEntidad field={field} meta={meta} fieldItem={fieldItem} options={options} />}
                                        </Field>
                                    );
                                default:                                
                                    return (
                                        <Field name={fieldItem.field}>
                                            {
                                                ({ field, meta }) => (
                                                    <div style={{ width: fieldItem.columnSize, display: 'inline-block', padding: '1rem' }} key={fieldItem.field}>
                                                        <FormControl fullWidth={true} margin="dense">
                                                            <InputLabel htmlFor={fieldItem.field} className="formulario-entidad__label">{fieldItem.label}</InputLabel>
                                                            <Input className="formulario-entidad__input" type="text" {...field} />
                                                            { meta.touched && meta.error && <div className="error">{meta.error}</div> }
                                                        </FormControl>
                                                    </div>
                                                )
                                            }
                                        </Field>
                                    );
                            }
                            
                        })
                    }                
                    <Button type="submit" className="formulario-entidad__boton-ingresar" variant="contained">Ingresar</Button>
                </Form>
            </div>                        
        </div>
    );
}

const fieldsArrayToObject = (fieldsArray) => {
    return fieldsArray && fieldsArray.reduce((fieldsObject, fieldItem) => {
        return { ...fieldsObject, [fieldItem.field]: ''}
    }, {})
}

export default withFormik({

    mapPropsToValues({ model, fields }) {
        if(model){
            return model;
        }
        return fieldsArrayToObject(fields);
    },

    validate(values) {
        const errors = {};

        Object.keys(values).forEach(key => {
            if(!values[key]){
                errors[key] = 'Este campo es requerido'
            }
        });

        return errors;
    },

    handleSubmit(values, { props, setSubmitting }) {
        props.onSubmit(values);
        setSubmitting(false);
    }

})(FormularioEntidad);