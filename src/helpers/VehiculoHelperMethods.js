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

    obtenerTodosMantenimientoVehiculo = async (vehiculoId,cancelToken) => {
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

    obtenerVehiculo() {

    }

    editarVehiculo() {

    }

    eliminarVehiculo() {

    }
}