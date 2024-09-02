import {getToken} from './apiClient.js';

export async function postAuth() {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    const {access_token, role, username} = await getToken(code);
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('role', role);
    localStorage.setItem('username', username);
}
