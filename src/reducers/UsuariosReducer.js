const UsuariosReducer = (state, action) => {
    switch (action.type) {
      case 'field': 
        return {
          ...state,
          error: false,
          entity: {...state.entity, [action.fieldName]:action.payload},
        };
      case 'load': 
        return {
          ...state,
          error: '',
          isLoading: true,
        };

      case 'entity': 
        return {
          ...state,
          entity: action.payload,
          isLoading: false,
        };

      case 'error': 
        return {
          ...state,
          error: true,
          showError: true,
          isLoading: false,
        };
      
      case 'logOut': 
        return {
          ...state,
          isLoggedIn: false,
        };
      
      case 'hideModal': 
        return {
          ...state,
          open: false,
        };
      
      case 'showModal': 
        return {
          ...state,
          open: true,
        };
      
      case 'editar': 
        return {
          ...state,
          editar: true,
        };
      
      case 'noEditar': 
        return {
          ...state,
          editar: false,
        };
      
      case 'eliminar': 
        return {
          ...state,
          eliminar: true,
        };
      
      case 'noEliminar': 
        return {
          ...state,
          eliminar: false,
        };
      
      default:
        return state;
    }
}

export default UsuariosReducer;