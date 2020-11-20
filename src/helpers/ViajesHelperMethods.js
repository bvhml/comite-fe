import { statusEnum } from '../enums/StatusEnum';
import AuthHelperMethods from './AuthHelperMethods';

export default class ViajesHelperMethods {
    constructor(domain) {
        //THIS LINE IS ONLY USED WHEN YOU'RE IN PRODUCTION MODE!
        this.domain = domain //|| "localhost:80"; // API server domain
    }

    mapViaje = viaje => {
        if(viaje.id_director === -1){
            viaje.id_director = 0;
            viaje.id_estatus = statusEnum.APROVED;
        }
        viaje.id_estatus = viaje.id_estatus || statusEnum.SOLICITED;
        if(viaje.id_estatus === statusEnum.SOLICITED || viaje.id_director === 0){
            viaje.rutas = [];
            Object.keys(viaje).forEach(viajePropKey => {
                switch(viajePropKey.substring(0, viajePropKey.length - 1)) {
                    case 'fecha_':
                    case 'ubicacion_inicio_':
                    case 'ubicacion_fin_':
                    case 'numero_personas_':
                    case 'notas_':
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
                        viaje[viajePropKey] = undefined;
                        break;
                }
            });
        }        
    }

    mapRutas = viaje => {
        viaje.rutas = JSON.parse(viaje.rutas);
        viaje.rutas.forEach((ruta, index) => {
            if(ruta.id_conductor){
                viaje[`id_conductor_${index}`] = ruta.id_conductor;
            }
        })
        viaje.id_estatus = viaje.id_estatus || 0;
        viaje.id_estatus = Number.parseInt(viaje.id_estatus);
    }

    mapPilotos = viaje => {
        Object.keys(viaje).forEach(viajePropKey => {
            if(viajePropKey.substring(0, viajePropKey.length - 1) === 'id_conductor_') {
                const index = Number.parseInt(viajePropKey.substring(viajePropKey.length - 1, viajePropKey.length));
                viaje.rutas[index].id_conductor = viaje[viajePropKey]
                
                viaje[viajePropKey] = undefined;
            }
        })
    }

    solicitarViaje = async viaje => {
        try {
            const Auth = new AuthHelperMethods(this.domain);
            this.mapViaje(viaje);
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
            response = await response.json();
            return response;
        }
        catch (error) {
            throw error;
        }
    }

    getViajesBySolicitant = async (cancelToken, solicitantId) => {
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
      
            let response = await fetch(`http://${process.env.REACT_APP_EP}/viaje/misviajes/solicitante/${solicitantId}`, config);
            response = await response.json();
            response.forEach(this.mapRutas);
            return response;
        }
        catch (error) {
            throw error;
        }
    }

    getViajesByDirector = async (cancelToken, directorId) => {
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
      
            let response = await fetch(`http://${process.env.REACT_APP_EP}/viaje/misviajes/director/${directorId}`, config);
            response = await response.json();
            response.forEach(this.mapRutas);
            return response;
        }
        catch (error) {
            throw error;
        }
    }

    getViajes = async (cancelToken) => {
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
      
            let response = await fetch(`http://${process.env.REACT_APP_EP}/viaje/todos`, config);
            response = await response.json();
            response.forEach(this.mapRutas);
            return response.filter(trip => trip.id_estatus !== statusEnum.SOLICITED);
        }
        catch (error) {
            throw error;
        }
    }

    editarViaje = async (cancelToken, viaje) => {
        try {
            const Auth = new AuthHelperMethods(this.domain);
            this.mapViaje(viaje);
            if(viaje.id_estatus === statusEnum.ASIGNED) {
                this.mapPilotos(viaje);
            }            
            let config = {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ viaje }),
                cancelToken
            }

            if (Auth.loggedIn()) {
                config.headers["Authorization"] = "Bearer " + Auth.getToken();
            }
      
            let response = await fetch(`http://${process.env.REACT_APP_EP}/viaje`, config);
            response = await response.json();
            return response;
        }
        catch (error) {
            throw error;
        }
    }
}