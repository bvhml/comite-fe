import AuthHelperMethods from './AuthHelperMethods';

export default class VehiculoHelperMethods {
    constructor(domain) {
        //THIS LINE IS ONLY USED WHEN YOU'RE IN PRODUCTION MODE!
        this.domain = domain //|| "localhost:80"; // API server domain
    }
    
    guardarVehiculo = async vehiculo => {
        try {
            const Auth = new AuthHelperMethods(this.domain);
            let config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ vehiculo: vehiculo })
            }

            if (Auth.loggedIn()) {
                config.headers["Authorization"] = "Bearer " + Auth.getToken();
            }
      
            let response = await fetch(`http://${process.env.REACT_APP_EP}/vehiculos`, config);
            let jsonResponse = await response.json();
            return jsonResponse;
        }
        catch (error) {
            throw error;
        }
    }
    
    editarVehiculo = async vehiculo => {
        try {
            const Auth = new AuthHelperMethods(this.domain);
            let config = {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ vehiculo: vehiculo })
            }

            if (Auth.loggedIn()) {
                config.headers["Authorization"] = "Bearer " + Auth.getToken();
            }
      
            let response = await fetch(`http://${process.env.REACT_APP_EP}/vehiculos`, config);
            let jsonResponse = await response.json();
            return jsonResponse;
        }
        catch (error) {
            throw error;
        }
    }

    eliminarVehiculo = async vehiculo => {
        try {
            vehiculo.eliminado = true;
            const Auth = new AuthHelperMethods(this.domain);
            let config = {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ vehiculo: vehiculo })
            }

            if (Auth.loggedIn()) {
                config.headers["Authorization"] = "Bearer " + Auth.getToken();
            }
      
            let response = await fetch(`http://${process.env.REACT_APP_EP}/vehiculos`, config);
            let jsonResponse = await response.json();
            return jsonResponse;
        }
        catch (error) {
            throw error;
        }
    }

    obtenerTodosVehiculos = async (cancelToken) => {
        try {
            const Auth = new AuthHelperMethods(this.domain);
            let config = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                cancelToken
            }

            if (Auth.loggedIn()) {
                config.headers["Authorization"] = "Bearer " + Auth.getToken();
            }
      
            let response = await fetch(`http://${process.env.REACT_APP_EP}/vehiculos`, config);
            let jsonResponse = await response.json();
            return jsonResponse;
        }
        catch (error) {
            return error;
        }
    }


    //MANTENIMIENTOS

    async getMantenimientos(vehiculoId, cancelToken) {
        try {
            const Auth = new AuthHelperMethods(this.domain);
            let config = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                cancelToken
            }

            if (Auth.loggedIn()) {
                config.headers["Authorization"] = "Bearer " + Auth.getToken();
            }
      
            let response = await fetch(`http://${process.env.REACT_APP_EP}/mantenimiento-vehiculo/${vehiculoId}`, config);
            let jsonResponse = await response.json();
            return jsonResponse;
        }
        catch (error) {
            return error;
        }
    }

    async guardarMantenimiento(mantenimiento) {
        try {
            const Auth = new AuthHelperMethods(this.domain);
            let config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mantenimiento: mantenimiento })
            }

            if (Auth.loggedIn()) {
                config.headers["Authorization"] = "Bearer " + Auth.getToken();
            }
      
            let response = await fetch(`http://${process.env.REACT_APP_EP}/mantenimiento-vehiculo`, config);
            let jsonResponse = await response.json();
            return jsonResponse;
        }
        catch (error) {
            throw error;
        }
    }

    async editarMantenimiento(mantenimiento) {
        try {
            const Auth = new AuthHelperMethods(this.domain);
            let config = {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mantenimiento: mantenimiento })
            }

            if (Auth.loggedIn()) {
                config.headers["Authorization"] = "Bearer " + Auth.getToken();
            }
      
            let response = await fetch(`http://${process.env.REACT_APP_EP}/mantenimiento-vehiculo`, config);
            let jsonResponse = await response.json();
            return jsonResponse;
        }
        catch (error) {
            throw error;
        }
    }

    async eliminarMantenimiento(mantenimiento) {
        try {
            mantenimiento.eliminado = true;
            const Auth = new AuthHelperMethods(this.domain);
            let config = {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mantenimiento: mantenimiento })
            }

            if (Auth.loggedIn()) {
                config.headers["Authorization"] = "Bearer " + Auth.getToken();
            }
      
            let response = await fetch(`http://${process.env.REACT_APP_EP}/mantenimiento-vehiculo`, config);
            let jsonResponse = await response.json();
            return jsonResponse;
        }
        catch (error) {
            throw error;
        }
    }
}