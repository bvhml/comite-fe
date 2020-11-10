import React from 'react';

import { Button, Input, FormControl, InputLabel } from '@material-ui/core';
import { withFormik, Field, Form } from 'formik'
import SelectEntidad from './SelectEntidad'
import moment from 'moment';

const FormularioEntidad = ({ title, fields, dynamicClick, resetForm, values, setValues, formAction, wrappedFieldGroups }) => {

    const handleDynamicClick = () => {       
        dynamicClick();
        resetForm({ nextState: { ...values } });
        setValues(fieldsArrayToObject(fields, values));
    }

    const renderForm = (fieldItem) => {
        switch(fieldItem.type) {
            case 'select':
                return (
                    <Field name={fieldItem.field} key={fieldItem.field}>
                        {({ field, meta }) => <SelectEntidad field={field} meta={meta} fieldItem={fieldItem} />}
                    </Field>
                );

            case 'dynamic':
                return (
                    <Field name={fieldItem.field} key={fieldItem.field}>
                        { 
                            () => (
                                <div className="formulario-entidad__boton-agregar__wrapper">
                                    <Button type="button" className="formulario-entidad__boton-agregar" onClick={handleDynamicClick}>{fieldItem.label}</Button>
                                </div>                                                    
                            ) 
                        }                                     
                    </Field>                                        
                );

            default:                                
                return (
                    <Field name={fieldItem.field} key={fieldItem.field}>
                        {
                            ({ field, meta }) => (
                                <div style={{ width: fieldItem.columnSize, display: 'inline-block', padding: '1rem' }} key={fieldItem.field}>
                                    <FormControl fullWidth={true} margin="dense">
                                        <InputLabel htmlFor={fieldItem.field} className="formulario-entidad__label">{fieldItem.label}</InputLabel>
                                        <Input className="formulario-entidad__input" type={fieldItem.type} autoComplete="off" {...field} required={fieldItem.required && (fieldItem.type !== 'password' || formAction === 'create')} readOnly={fieldItem.readOnly} />
                                        { meta.touched && meta.error && <div className="error">{meta.error}</div> }
                                    </FormControl>
                                </div>
                            )
                        }
                    </Field>
                );
        }
    }
    const splitFields = fields && fields.reduce((splitFieldsObject, field) => { 
        if(!splitFieldsObject[`wrappedGroup${field.wrapGroup}`]){
            splitFieldsObject[`wrappedGroup${field.wrapGroup}`] = []
        }
        splitFieldsObject[`wrappedGroup${field.wrapGroup}`].push(field)
        return splitFieldsObject;
    }, {})
    return (
        <div className="formulario-entidad">
            <div className="formulario-entidad__wrapper">
                <h1 className="formulario-entidad__titulo">{title}</h1>
                <Form>
                    {
                        Object.entries(splitFields).map(([fieldsGroupName, fields]) => {
                            if(fieldsGroupName === 'wrappedGroup0') {
                                return fields.map(renderForm)
                            }
                            else {
                                return (
                                    <div className="wrapped-form" key={fieldsGroupName}>
                                        {
                                            fields.map(renderForm)
                                        }
                                    </div>
                                )
                            }
                        })
                    }          
                    <Button type="submit" className="formulario-entidad__boton-ingresar" variant="contained">Ingresar</Button>
                </Form>
            </div>                        
        </div>
    );
}

const fieldsArrayToObject = (fieldsArray, previousValues) => {
    return fieldsArray && fieldsArray.reduce((fieldsObject, fieldItem) => {
        return { 
            ...fieldsObject, 
            [fieldItem.field]: previousValues[fieldItem.field] || fieldItem.defaultValue
        }
    }, {})
}

export default withFormik({

    enableReinitialize: true,

    mapPropsToValues({ model, fields }) {
        if(model){
            return model;
        }
        return fieldsArrayToObject(fields, {});
    },

    validate(values, props) {
        const errors = {};

        props.fields.forEach(field => {
            if(values[field.field] && field.type === 'datetime-local' && moment().isAfter(new Date(values[field.field]))) {
                errors[field.field] = 'La fecha debe ser hoy o después';
            }
            if(values[field.field] && field.type === 'number' && values[field.field] <= 0) {
                errors[field.field] = 'La cantidad debe ser mayor que cero';
            }
            if(!values[field.field] && field.required && (field.type !== 'password' || props.formAction === 'create')){
                errors[field.field] = 'Este campo es requerido';
            }
        });

        return errors;
    },

    handleSubmit(values, { props, setSubmitting }) {
        props.onSubmit(values);
        setSubmitting(false);
    }

})(FormularioEntidad);