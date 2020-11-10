import React from 'react';
import { Button } from '@material-ui/core';
import { withFormik, Field, Form } from 'formik';
import SelectEntidad from './SelectEntidad';
import { statusEnum } from '../../enums/StatusEnum';
import moment from 'moment'

const PresentacionEntidad = ({ entity, values, fields, enableAssignment, enableAproval, onAprove, onAssign, onStart, onFinish, onDeny, closeModal, assigneesFieldData }) => {

    const handleSumbission = async event => {
        event.preventDefault();
        if(enableAproval && values.id_estatus === statusEnum.SOLICITED) {
            await onAprove(values);
            closeModal();
        }
        else if(enableAssignment && values.id_estatus === statusEnum.APROVED) {
            await onAssign(values);
            closeModal();
        }
        else if(enableAssignment && values.id_estatus === statusEnum.ASIGNED) {
            await onStart(values);
            closeModal();
        }
        else if(enableAssignment && values.id_estatus === statusEnum.IN_PROGRESS) {
            await onFinish(values);
            closeModal();
        }
    }

    const handleDeny = async event => {
        event.preventDefault(); 
        await onDeny(values); 
        closeModal();
    }

    const renderButtons = () => {
        if(enableAproval && values.id_estatus === statusEnum.SOLICITED) {
            return (
                <div className="presentacion-entidad__buttons">
                    <Button className="presentacion-entidad__boton-denegar" variant="contained" onClick={handleDeny}>Denegar</Button>
                    <Button className="presentacion-entidad__boton-aprobar" variant="contained" onClick={handleSumbission}>Aprobar</Button>
                </div>
            );
        }
        else if(enableAssignment && values.id_estatus !== statusEnum.CANCELLED && values.id_estatus !== statusEnum.FINISHED) {
            let buttonText = '';
            if(enableAssignment && values.id_estatus === statusEnum.APROVED){
                buttonText = 'Asignar';
            }
            else if(enableAssignment && values.id_estatus === statusEnum.ASIGNED){
                buttonText = 'Iniciar viaje';
            }
            else if(enableAssignment && values.id_estatus === statusEnum.IN_PROGRESS){
                buttonText = 'Finalizar viaje';
            }
            return (
                <div className="presentacion-entidad__buttons">
                    <Button className="presentacion-entidad__boton-aprobar" variant="contained"  onClick={handleSumbission}>{buttonText}</Button>
                </div>
            );
        }
        return '';
    }

    const toTitleCase = label => label[0].toUpperCase() + label.substring(1);

    return values && fields && (
        <div className="presentacion-entidad">
            <div className="presentacion-entidad__wrapper">
                {
                    Object.keys(values).map(fieldKey => {
                        const field = fields.find(field => field.field.replace('id_', 'nombre').toLowerCase() === fieldKey.toLowerCase());
                        if(Array.isArray(values[fieldKey])) {
                            return (
                                <div className="presentacion-entidad__array" key={fieldKey}>
                                    <div className="presentacion-entidad__array__label">{toTitleCase(fieldKey)}</div>
                                    <div className="presentacion-entidad__array__content">
                                        <Form>
                                        {
                                            values[fieldKey].map((arrayItem, index) => (
                                                <div className={`presentacion-entidad__array__content__item__wrapper ${enableAssignment ? 'presentacion-entidad__array__content__item__wrapper--assignment' : '' }`} key={index}>
                                                    {
                                                        Object.keys(arrayItem).map(arrayItemProperty => {
                                                            const field = fields.find(field => field.field === `${arrayItemProperty}_${index}`);
                                                            return field ? (
                                                                <div className="presentacion-entidad__array__content__item" key={arrayItemProperty}>
                                                                    <div className="presentacion-entidad__array__content__item__label">{field.label}</div>
                                                                    { field.type === 'datetime-local' ? 
                                                                        <div className="presentacion-entidad__array__content__item__content">{moment(arrayItem[arrayItemProperty]).format('DD/MM/YYYY hh:mm')}</div> : 
                                                                        <div className="presentacion-entidad__array__content__item__content">{arrayItem[arrayItemProperty]}</div> }
                                                                </div>                                                            
                                                            ) : '';
                                                        })                                        
                                                    }                                                    
                                                    {
                                                        enableAssignment ? <div className="presentacion-entidad__array__content__item" key={`id_conductor_${index}`}>
                                                            <Field name={`id_conductor_${index}`}>
                                                                {
                                                                    ({ field, meta }) => <SelectEntidad field={field} meta={meta} fieldItem={assigneesFieldData[index]} />
                                                                }
                                                            </Field>
                                                        </div> : ''
                                                    } 
                                                </div>
                                            ))
                                        } 
                                        </Form>
                                    </div>
                                </div>
                            );
                        }
                        return field ? (
                            <div className="presentacion-entidad__item" key={fieldKey}>
                                <div className="presentacion-entidad__item__label">{field.label}:</div>
                                <div className="presentacion-entidad__item__content">{values[fieldKey]}</div>
                            </div>
                        ) : '';
                    })
                }
                { renderButtons() }
            </div>
        </div>
    );
}

export default withFormik({
    mapPropsToValues({ entity }) {
        if(entity){
            return entity;
        }
        return {};
    },
    validate(values) {   
        const errors = {};
        Object.keys(values).forEach(key => {
            if(key.substring(0, key.length - 1) === 'id_conductor' && !values[key]) {
                errors[key] = 'Seleccione un piloto';
            }
        })
    }
})(PresentacionEntidad);