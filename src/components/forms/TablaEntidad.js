import React, { useReducer, useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { Grid, Button, Modal } from '@material-ui/core';
import tableIcons from './../../utils/TableIcons';
import FormularioEntidad from '../forms/FormularioEntidad';

import './forms.scss';
import PresentacionEntidad from './PresentacionEntidad';
import ConfirmAction from './ConfirmAction';


const TablaEntidad = ({ entitiesList, onCreate, onEdit, onDelete, formFields, columns, reducer, initialState, entitiesListName, entityName, sideModalComponentRender, enableEdit, enableDelete, enableView, enebaleMaintenance, dynamicClick, resetFormStructure, entityToFormFields, permissions, assigneesFieldData, enableCreate, enableFiltering }) => {

    // Hooks
    const [state, dispatch] = useReducer(reducer, initialState);
    const { entity, isLoading, open, editar, side, view, eliminar } = state;
    const [actions, setActions] = useState([]);

    // Methods
    const handleOpen = () => {
        dispatch({ type: 'showModal' });
    };

    const handleClose = () => {
        resetFormStructure();
        dispatch({ type: 'hideModal' });
    };

    const handleCreate = async entity => {
        await onCreate(entity)
        handleClose();
    }

    const handleEdit = async entity => {
        await onEdit(entity);       
        resetFormStructure();
        dispatch({ type: 'noEditar'}); 
    }

    // Lifecycle
    useEffect(() => {

        if(enableView) {
            actions.push({
                icon: tableIcons.VisibilityIcon,
                tooltip: `Ver ${entityName}`,
                onClick: async (event, rowData) => {
                    dispatch({ type: 'entity', payload: rowData });
                    if(rowData && entityToFormFields) {
                        await entityToFormFields(rowData);
                    }
                    dispatch({type: 'view'})
                }
            });
        }

        if(enebaleMaintenance) {
            actions.push({
                icon: tableIcons.BuildIcon,
                tooltip: `Mantenimiento de ${entityName}`,
                onClick: (event, rowData) => {
                    dispatch({ type: 'entity', payload: rowData });
                    if(rowData && entityToFormFields) {
                        entityToFormFields(rowData);
                    }
                    dispatch({type: 'side'})
                }
            });
        }

        if(enableEdit) {
            actions.push({
                icon: tableIcons.Edit,
                tooltip: `Editar ${entityName}`,
                onClick: (event, rowData) => {                                
                    dispatch({type: 'editar'})
                    dispatch({ type: 'entity', payload: rowData });                    
                    if(rowData && entityToFormFields) {
                        entityToFormFields(rowData);
                    }
                }
            });
        }

        if(enableDelete) {
            actions.push({
                icon: tableIcons.Delete,
                tooltip: `Eliminar ${entityName}`,
                onClick: (event, rowData) => {                                
                    dispatch({type: 'eliminar'})
                    dispatch({ type: 'entity', payload: rowData });
                }
            });
        }
        setActions(actions);
    }, []);

    return (
        <Grid container style={{backgroundColor:'whitesmoke', width:'100%'}}>
            <div className="tabla-entidad">
                <div className="tabla-entidad__encabezado">
                    {
                        enableCreate &&
                        <Grid container justify='flex-end'>
                            <Button className="tabla-entidad__boton-agregar" variant="contained" onClick={handleOpen}>Ingresar {entityName}</Button>
                        </Grid> 
                    }

                    <Grid container style={{minHeight:'80vh', marginTop:'20px'}}>
                        { entitiesList && (entitiesList.length > 0) && !isLoading && 
                        <MaterialTable
                            icons={tableIcons}
                            columns={columns}
                            data={entitiesList}
                            stickyHeader
                            title={`Gestionar ${entitiesListName}`}
                            style={{padding: '3vh', width:'100%', height:'auto'}}
                            options={{
                                search: false,
                                searchFieldAlignment:'left',
                                defaultGroupOrder:'0',
                                exportButton: true,
                                filtering: enableFiltering,
                                pageSize: 10,
                                actionsColumnIndex: -1,
                                rowStyle:{backgroundColor:'whitesmoke',
                                emptyRowsWhenPaging: true,}}
                                }
                                
                            localization={{ 
                                toolbar: { searchPlaceholder: 'Buscar' },
                                body: {
                                    emptyDataSourceMessage: 'No hay resultados',
                                    filterRow: {
                                        filterTooltip: 'Filter'
                                    }
                                },
                                header:{
                                    actions:''
                                } 
                                }}

                                actions={actions}
                        />}

                        {isLoading && <Grid> Cargando {entitiesListName}...</Grid>} 
                    </Grid>
                    <Modal
                        open={open || false}
                        onClose={handleClose}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        children={<div><FormularioEntidad title={`Nuevo ${entityName}`} fields={formFields} model={null} onSubmit={handleCreate} dynamicClick={dynamicClick} formAction="create" /></div> }
                    />

                    <Modal
                        open={view || false}
                        onClose={()=> { dispatch({ type: 'noView'}); resetFormStructure();}}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        children={<div><PresentacionEntidad entity={entity} fields={formFields} {...permissions} closeModal={() => { dispatch({type: 'noView'}) }} assigneesFieldData={assigneesFieldData} /></div>}
                    />

                    <Modal
                        open={editar || false}
                        onClose={()=> dispatch({ type: 'noEditar'})}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        children={<div><FormularioEntidad title={`Editar ${entityName}`} fields={formFields} model={entity} onSubmit={handleEdit} formAction="edit" /></div>}
                    />

                    <Modal
                        open={eliminar || false}
                        onClose={()=> dispatch({ type: 'noEliminar'})}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        children={<div><ConfirmAction message={`¿Está seguro de que desea eliminar este ${entityName}?`} confirmAction={async () => { await onDelete(entity); dispatch({ type: 'noEliminar'}); }} cancelAction={()=> dispatch({ type: 'noEliminar'})} confirmText="Eliminar" cancelText="Cancelar" /></div>}
                    />

                    <Modal 
                        open={side || false} 
                        onClose={()=> dispatch({ type: 'noSide'})} 
                        children={<div> { side && entity && sideModalComponentRender({ entityId: entity.id, onClose(){ dispatch({ type: 'noSide'}) } }) } </div>} 
                    />
                </div>
            </div>
        </Grid>
    )
}

export default TablaEntidad;