const MantenimientosReducer = (state, action) => {
    switch (action.type) {
        case 'field': {
          return {
            ...state,
            error: false,
            mantenimiento: {...state.mantenimiento,[action.fieldName]:action.payload},
          };
        }
        case 'load': {
          return {
            ...state,
            error: '',
            isLoading: true,
          };
        }
        case 'mantenimientos': {
          return {
            ...state,
            mantenimientos: action.payload,
            isLoading: false,
          };
        }
        case 'mantenimiento': {
          return {
            ...state,
            mantenimiento: action.payload,
            isLoading: false,
          };
        }
        case 'error': {
          return {
            ...state,
            error: true,
            showError: true,
            isLoading: false,
          };
        }
        case 'logOut': {
          return {
            ...state,
            isLoggedIn: false,
          };
        }
        case 'hideModal': {
          return {
            ...state,
            open: false,
          };
        }
        case 'showModal': {
          return {
            ...state,
            open: true,
          };
        }
        case 'editar': {
          return {
            ...state,
            editar: true,
          };
        }
        case 'noEditar': {
          return {
            ...state,
            editar: false,
          };
        }
        default:
          return state;
      }
  }

  export default MantenimientosReducer;