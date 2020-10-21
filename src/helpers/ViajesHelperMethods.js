import AuthHelperMethods from './AuthHelperMethods';

export default class ViajesHelperMethods {
    constructor(domain) {
        //THIS LINE IS ONLY USED WHEN YOU'RE IN PRODUCTION MODE!
        this.domain = domain //|| "localhost:80"; // API server domain
    }

    mapViaje = viaje => {
        viaje.rutas = [];
        Object.keys(viaje).forEach(viajePropKey => {
            switch(viajePropKey.substring(0, viajePropKey.length - 1)) {
                case 'fecha_':
                case 'ubicacion_inicio_':
                case 'ubicacion_fin_':
                    const index = Number.parseInt(viajePropKey.substring(viajePropKey.length - 1, viajePropKey.length));
                    if(!viaje.rutas[index]) {
                        viaje.rutas[index] = {
                            [viajePropKey.substring(0, viajePropKey.length - 2)]: viaje[viajePropKey]
                        }
                    }
                    else {
                        viaje.rutas[index] = {
                            ...viaje.rutas[index],
                            [viajePropKey.substring(0, viajePropKey.length - 2)]: viaje[viajePropKey]
                        }
                    }
                    break;
            }
        })
    }

    solicitarViaje = async viaje => {
        this.mapViaje(viaje);
        try {
            const Auth = new AuthHelperMethods(this.domain);
            let config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ viaje })
            }

            if (Auth.loggedIn()) {
                config.headers["Authorization"] = "Bearer " + Auth.getToken();
            }
      
            let response = await fetch(`http://${process.env.REACT_APP_EP}/viaje`, config);
            let jsonResponse = await response.json();
            return jsonResponse;
        }
        catch (error) {
            throw error;
        }
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
}