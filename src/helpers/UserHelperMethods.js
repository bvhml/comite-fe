import axios from 'axios'
import AuthHelperMethods from './AuthHelperMethods';

const httpsCall = process.env.REACT_APP_HTTPS === 'true' ? 'https' : 'http';

export default class UserHelperMethods {
    constructor(domain) {
        //THIS LINE IS ONLY USED WHEN YOU'RE IN PRODUCTION MODE!
        this.domain = domain //|| "localhost:80"; // API server domain
    }

    buscarUsuarios = (cancelToken) => {
        const Auth = new AuthHelperMethods(this.domain);

        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json"
        };
        if (Auth.loggedIn()) {
            headers["Authorization"] = "Bearer " + Auth.getToken();
        }

        return axios.get(`${httpsCall}://${this.domain}/usuarios/`, { headers, cancelToken })
            .then(this._checkStatus)
            .then(response => response.data);
    }

    buscarUsuario = (username, cancelToken) => {

        try {


            const Auth = new AuthHelperMethods(this.domain);

            const headers = {
                Accept: "application/json",
                "Content-Type": "application/json"
            };
            if (Auth.loggedIn()) {
                headers["Authorization"] = "Bearer " + Auth.getToken();
            }
            return axios.get(`${httpsCall}://${this.domain}/usuarios/${username}`, { headers, cancelToken })
                .then(this._checkStatus)
                .then(response => response.data);
        } catch (error) {
            throw error;
        }
    }

    guardarUsuario = async usuario => {
        try {
            const Auth = new AuthHelperMethods(this.domain);
            const response = await Auth.signUp(usuario);
            let jsonResponse = await response.json();
            return jsonResponse;
        }
        catch (error) {
            return error;
        }
    }

    editarUsuario = async usuario => {
        try {
            const Auth = new AuthHelperMethods(this.domain);
            let config = {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            }

            if (Auth.loggedIn()) {
                config.headers["Authorization"] = "Bearer " + Auth.getToken();
            }
            const response = await fetch(`${httpsCall}://${this.domain}/usuarios/register`, config)
            let jsonResponse = await response.json();
            return jsonResponse;
        }
        catch (error) {
            throw error;
        }
    }

    eliminarUsuario = async usuario => {
        try {
            usuario.eliminado = true;
            const Auth = new AuthHelperMethods(this.domain);
            let config = {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            }

            if (Auth.loggedIn()) {
                config.headers["Authorization"] = "Bearer " + Auth.getToken();
            }
            const response = await fetch(`${httpsCall}://${this.domain}/usuarios/register`, config)
            let jsonResponse = await response.json();
            return jsonResponse;
        }
        catch (error) {
            throw error;
        }
    }

    buscarUsuarioById = async (userId, cancelToken) => {
        const usuarios = await this.buscarUsuarios(cancelToken);
        return usuarios.filter(usuario => usuario.id === userId)[0];
    }

    buscarUsuarioByRol = async (cancelToken, rol) => {
        const usuarios = await this.buscarUsuarios(cancelToken);
        return usuarios.filter(usuario => usuario.rol === rol);
    }

    getPilotos = async () => {
        try {
            const Auth = new AuthHelperMethods(this.domain);
            let config = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
            if (Auth.loggedIn()) {
                config.headers["Authorization"] = "Bearer " + Auth.getToken();
            }
            let response = await fetch(`${httpsCall}://${this.domain}/vehiculos/asignados`, config)
            response = await response.json();
            response.forEach(piloto => {
                piloto.vehiculos = JSON.parse(piloto.vehiculos);
            })
            return response;
        } catch (error) {
            throw error;
        }
    }
}