import decode from "jwt-decode";
import axios from 'axios'

export default class AuthHelperMethods {
  // Initializing important variables
  constructor(domain) {
    //THIS LINE IS ONLY USED WHEN YOU'RE IN PRODUCTION MODE!
    this.domain = domain || "localhost:80"; // API server domain
  }
  login = (username, password) => {
    // Get a token from api server using the fetch api
    var config = {};
    if (this.loggedIn()) {
        config = {
            headers: { Authorization: "bearer " + this.getToken() }
          };
    }

    return axios.post(`http://${this.domain}/usuarios/login`, {
        email: username,
        password: password
      },config)
      .then(this._checkStatus)
      .then(response => response);

    }

    signUp = async (usuario) => {
      // Get a token from api server using the fetch api
      var config = {};
      if (this.loggedIn()) {
          config = {
              headers: { Authorization: "bearer " + this.getToken() }
            };
      }
  
      return axios.post(`http://${this.domain}/usuarios/register`, usuario, config)
        .then(response => {
          //this.login(username,password)
          return response.data;
        });
  
      }

      resetPassword = (username,password) => {
        // Get a token from api server using the fetch api
        var config = {};
        console.log(this.loggedIn());
        if (this.loggedIn()) {
            config = {
                headers: { Authorization: "bearer " + this.getToken() }
              };
        }
    
        return axios.post(`http://${this.domain}/usuarios/resetpassword`, {
            username: username,
            password: password,
          },config)
          .then(response => {
            //this.login(username,password)
            return response.data;
          });
    
        }

        resetMyPassword = (username,password) => {
          // Get a token from api server using the fetch api
          var config = {};
          console.log(this.loggedIn());
          if (this.loggedIn()) {
              config = {
                  headers: { Authorization: "bearer " + this.getToken() }
                };
          }
      
          return axios.post(`http://${this.domain}/usuarios/resetmypassword`, {
              username: username,
              password: password,
            },config)
            .then(response => {
              //this.login(username,password)
              return response.data;
            });
      
          }

      validateMe = () => {
        // Get a token from api server using the fetch api
        //console.log(this.getToken());
        if (this.getToken() !== 'undefined') {
          const instance = axios.create({
            baseURL: this.domain,
            timeout: 1000,
            headers: {'Authorization': 'Bearer '+this.getToken() }
          });
          instance.get('/me')
          .then(response => {
              return response;
          })

          return this.getConfirm();
        }
        else{
          this.logout();
          return {}
        }
      }
        

  loggedIn = () => {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken(); // Getting token from localstorage

    if (token === 'undefined') {
      this.logout();
    }
    return !!token && !this.isTokenExpired(token); // handwaiving here
  };

  isTokenExpired = token => {
    try {
      const decoded = decode(token);
      
      if (decoded.exp < Date.now() / 1000) {
        // Checking if token is expired.
        return true;
      } else return false;
    } catch (err) {
      console.log("expired check failed! Line 42: AuthService.js");
      return false;
    }
  };

  setToken = idToken => {
    // Saves user token to localStorage
    localStorage.setItem("id_token", idToken);
  };

  getToken = () => {
    // Retrieves the user token from localStorage
    return localStorage.getItem("id_token");
  };

  logout = () => {
    // Clear user token and profile data from localStorage
    localStorage.removeItem("id_token");
  };

  getConfirm = () => {
    // Using jwt-decode npm package to decode the token
    let answer = decode(this.getToken());
    
    return answer;
  };

  fetch = (url, options) => {
    // performs api calls sending the required authentication headers
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };
    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (this.loggedIn()) {
      headers["Authorization"] = "Bearer " + this.getToken();
    }

    return fetch(url, {
      headers,
      ...options
    })
      .then(this._checkStatus)
      .then(response => response.json());
};

  _checkStatus = response => {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) {
      // Success status lies between 200 to 300

      if ((response.data.jwt !== null)|| (response.data.jwt !== undefined)) {
        this.setToken(response.data.jwt);
      }
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  };
}
