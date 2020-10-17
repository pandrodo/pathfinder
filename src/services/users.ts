import { authHeader } from "../helpers/authHeader";

export function loginUser(username: string, password: string) {
    const headers = { 'Content-type': 'application/json' };

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ username: username, password: password})
    };

    return fetch('http://127.0.0.1:3000/loginUser', requestOptions)
        .then(handleResponse)
        .then(message => {
            const user = { username: message.username, token: message.token, points: [] };
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

export function logoutUser() {
    localStorage.removeItem('user');
}

export function addNewUserPoint(username: string, nodeId: string, name: string) {
    const headers = { 'Content-type': 'application/json' };
    const tokenHeader = authHeader();

    const requestOptions = {
        method: 'POST',
        headers: tokenHeader ? Object.assign(headers, tokenHeader) : headers,
        body: JSON.stringify({ username: username, nodeId: nodeId, name: name})
    };

    return fetch('http://127.0.0.1:3000/addUserPoint', requestOptions)
        .then(handleResponse)
        .then(response => {
            return response.message;
        });
}

export function getUserPoints(username: string) {
    const headers = { 'Content-type': 'application/json' };
    const tokenHeader = authHeader();

    const requestOptions = {
        method: 'POST',
        headers: tokenHeader ? Object.assign(headers, tokenHeader) : headers,
        body: JSON.stringify({ username: username })
    };

    return fetch('http://127.0.0.1:3000/getUserPoints', requestOptions)
        .then(handleResponse)
        .then(message => {
            const validKeys = ['nodeId', 'name'];
            message.forEach((point: any) => Object.keys(point).forEach((key) => validKeys.includes(key) || delete point[key]));
            message.forEach((point: any) => point.nodeId = String(point.nodeId));

            return message;
        });
}

export function registrationUser(username: string, password: string) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ username: username, password: password})
    };

    return fetch('http://127.0.0.1:3000/registerUser', requestOptions)
        .then(handleResponse)
        .then(response => {
            return response.message;
        });
}

function handleResponse(response: Response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);

        if (!response.ok) {
            if (response.status === 401) {
                logoutUser();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}