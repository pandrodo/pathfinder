import {authHeader} from "../helpers/authHeader";

const API = 'http://192.168.1.39:3000';

export function loginUser(username: string, password: string) {
    const headers = {'Content-type': 'application/json'};

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({username: username, password: password})
    };

    return fetch(`${API}/loginUser`, requestOptions)
        .then(handleResponse)
        .then(response => {
            localStorage.setItem('user', JSON.stringify(response.user));

            return response;
        })
        .catch(error => {
            throw(error.message);
        });
}

export function logoutUser() {
    localStorage.removeItem('user');
}

export function registrationUser(username: string, password: string) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({username: username, password: password})
    };

    return fetch(`${API}/registerUser`, requestOptions)
        .then(handleResponse)
        .catch(error => {
            throw(error.message);
        });

}

export function addNewUserPoint(username: string, nodeId: string, name: string) {
    const headers = {'Content-type': 'application/json'};
    const tokenHeader = authHeader();

    const requestOptions = {
        method: 'POST',
        headers: tokenHeader ? Object.assign(headers, tokenHeader) : headers,
        body: JSON.stringify({username: username, nodeId: nodeId, name: name})
    };

    return fetch(`${API}/addUserPoint`, requestOptions)
        .then(handleResponse)
        .catch(error => {
            throw(error.message);
        });
}

export function getUserPoints(username: string) {
    const headers = {'Content-type': 'application/json'};
    const tokenHeader = authHeader();

    const requestOptions = {
        method: 'POST',
        headers: tokenHeader ? Object.assign(headers, tokenHeader) : headers,
        body: JSON.stringify({username: username})
    };

    return fetch(`${API}/getUserPoints`, requestOptions)
        .then(handleResponse)
        .catch(error => {
            throw(error.message);
        });
}

function handleResponse(response: Response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);

        if (!response.ok) {
            if (response.status === 401) {
                logoutUser();
            }

            const error: TypeError = {
                name: 'Response error',
                message: (data && data.message) || response.statusText
            };

            return Promise.reject(error);
        }

        return data;
    });
}