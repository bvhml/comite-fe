const ViajesReducer = (state, action) => {
    switch (action.type) {
      case 'field': {
        return {
          ...state,
          error: false,
          entity: {
            ...state.entity,
            [action.fieldName]:action.payload
          },
        };
      }
      case 'load': {
        return {
          ...state,
          error: '',
          isLoading: true,
        };
      }
      case 'entity': {
        return {
          ...state,
          entity: action.payload,
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
      case 'view': {
        return {
          ...state,
          error: '',
          view: true,
        };
      }     
      case 'noView': {
        return {
          ...state,
          error: '',
          view: false,
        };
      }      
      case 'eliminar': {
        return {
          ...state,
          error: '',
          eliminar: true,
        };
      }     
      case 'noEliminar': {
        return {
          ...state,
          error: '',
          eliminar: false,
        };
      }
      default:
        return state;
    }
  }

  export default ViajesReducer;