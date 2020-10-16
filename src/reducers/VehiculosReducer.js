const VehiculosReducer = (state, action) => {
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
      case 'side': {
        return {
          ...state,
          side: true,
        };
      }
      case 'noEditar': {
        return {
          ...state,
          editar: false,
        };
      }
      case 'noSide': {
        return {
          ...state,
          side: false,
        };
      }
      default:
        return state;
    }
  }

  export default VehiculosReducer;