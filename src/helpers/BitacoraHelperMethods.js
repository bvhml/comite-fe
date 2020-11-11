import axios from 'axios'
import AuthHelperMethods from './AuthHelperMethods';

const httpsCall = process.env.REACT_APP_HTTPS === 'true' ? 'https' : 'http';

export default class BitacoraHelperMethods {
    constructor(domain) {
        //THIS LINE IS ONLY USED WHEN YOU'RE IN PRODUCTION MODE!
        this.domain = domain //|| "localhost:80"; // API server domain
    }

    getBitacora = (cancelToken) => {
        const Auth = new AuthHelperMethods(this.domain);

        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json"
        };
        if (Auth.loggedIn()) {
            headers["Authorization"] = "Bearer " + Auth.getToken();
        }

        return axios.get(`${httpsCall}://${this.domain}/logs/`, { headers, cancelToken })
            .then(this._checkStatus)
            .then(response => response.data);
    }
}