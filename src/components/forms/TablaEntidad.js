import React, { useReducer } from 'react';
import MaterialTable from 'material-table';
import { Grid, Button, Modal } from '@material-ui/core';
import tableIcons from './../../utils/TableIcons';
import FormularioEntidad from '../forms/FormularioEntidad';


const TablaEntidad = ({ entitiesList, onCreate, onEdit, onDelete, onFieldChange, formFields, columns, reducer, initialState, entitiesListName, entityName, sideModalComponentRender }) => {

    // Hooks
    const [state, dispatch] = useReducer(reducer, initialState);
    const { entity, isLoading, open, editar, error, showError, side } = state;

    // Methods
    const handleOpen = () => {
        dispatch({ type: 'showModal' });
    };

    const handleClose = () => {
        dispatch({ type: 'hideModal' });
    };

    const handleCreate = entity => {
        dispatch({ type: 'entity', payload: entity });
        onCreate(entity)
        handleClose();
    }

    const handleEdit = entity => {
        onEdit(entity);
        handleClose();
    }

    return (
        <Grid container style={{backgroundColor:'whitesmoke', width:'100%'}}>
            <div className="vehiculos">
                <div className="vehiculos__encabezado">
                    <Grid container justify='flex-end'>
                        <Button className="vehiculos__boton-agregar" variant="contained" onClick={handleOpen}>Ingresar {entityName}</Button>
                    </Grid>

                    <Grid container style={{minHeight:'80vh', marginTop:'20px'}}>
                        { entitiesList && (entitiesList.length > 0) && !isLoading && <MaterialTable
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

                            actions={[{
                                icon: tableIcons.BuildIcon,
                                tooltip: 'Mantenimiento de vehiculo',
                                onClick: (event, rowData) => {
                                    dispatch({ type: 'entity', payload: rowData });
                                    dispatch({type: 'side'})
                                }
                            },
                            {
                                icon: tableIcons.Edit,
                                tooltip: 'Editar vehiculo',
                                onClick: (event, rowData) => {                                
                                    dispatch({type: 'editar'})
                                    dispatch({ type: 'entity', payload: rowData });
                                }
                            },
                            {
                                icon: tableIcons.Delete,
                                tooltip: 'Eliminar vehiculo'
                            }]}
                            
                        />}

                        {isLoading && <Grid> Cargando {entitiesListName}...</Grid>} 
                    </Grid>

                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                    >
                        <FormularioEntidad title={`Nuevo ${entityName}`} fields={formFields} model={null} onChange={onFieldChange} onSubmit={handleCreate} /> 
                    </Modal>
                    <Modal
                        open={editar}
                        onClose={()=> dispatch({ type: 'noEditar'})}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                    >
                    <Grid container style={{maxHeight:'85vh', position:'absolute', top:'50%', left: '50%', width:'50rem', backgroundColor:'white', transform: 'translate(-50%, -50%)', padding:'2rem'}} >
                        { entity && <FormularioEntidad title={`Editar ${entityName}`} fields={formFields} model={entity} onChange={onFieldChange} onSubmit={handleEdit} /> }
                    </Grid>
                    </Modal>

                    <Modal open={side} onClose={()=> dispatch({ type: 'noSide'})}>
                        {side && entity && sideModalComponentRender({ entityId: entity.id }) }
                    </Modal>
                </div>
            </div>
        </Grid>
    )
}

export default TablaEntidad;