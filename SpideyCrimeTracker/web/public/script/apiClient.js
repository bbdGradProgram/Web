export const apiUrl = 'http://spidey-crime-tracker-environment.eba-whvjczmu.eu-west-1.elasticbeanstalk.com';

function getAccessToken() {
    return `Bearer ${localStorage.getItem('access_token')}`;
}

async function customFetch(url, options) {
    const response = await fetch(url, options);
    if (response.status === 401 || response.status === 403) {
        localStorage.clear();
        window.router('/');
    }
    return response;
}

export async function getToken(code) {
    const body = {
        code,
    };

    const response = await customFetch(`${apiUrl}/auth/login`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });

    return response.json();
}

export async function getAllProvinces() {
    const response = await customFetch(`${apiUrl}/area/province`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getAccessToken()
        },
    });

    return response.json();
}

export async function getSuburbsForProvince(province) {
    const params = new URLSearchParams({province}).toString();
    const response = await customFetch(`${apiUrl}/area/suburb?${params}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getAccessToken()
        },
    });

    return response.json();
}

export async function getAllCrimeTypes() {
    const response = await customFetch(`${apiUrl}/hotspotType`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getAccessToken()
        },
    });

    return response.json();
}

export async function createIncident(data) {
    const response = await customFetch(`${apiUrl}/incident`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getAccessToken()
        },
        body: JSON.stringify(data)
    });

    return response.status;
}

export async function getIncidentStatistics() {
    const response = await customFetch(`${apiUrl}/incidents/statistics`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getAccessToken()
        },
    });

    return response.json();
}

export async function getIncidents() {
    return customFetch(`${apiUrl}/incident`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getAccessToken()
        },
    }).then((r) => r.json());
}

export async function getHotSpots() {
    return customFetch(`${apiUrl}/hotspot`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getAccessToken()
        },
    }).then((r) => r.json());
}

export async function getHotSpotTypes() {
    return customFetch(`${apiUrl}/hotspotType`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getAccessToken()
        },
    }).then((r) => r.json());
}

export async function getAreas() {
    return customFetch(`${apiUrl}/area`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getAccessToken()
        },
    }).then((r) => r.json());
}

export async function createArea(data) {
    const response = await customFetch(`${apiUrl}/area`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getAccessToken()
        },
        body: JSON.stringify(data)
    });

    return response.status;
}

export async function createTypeOfCrime(data) {
    const response = await customFetch(`${apiUrl}/hotspotType`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getAccessToken()
        },
        body: JSON.stringify(data)
    });

    return response.status;
}

export async function getUsers() {
    const response = await customFetch(`${apiUrl}/user`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getAccessToken()
        },
    });

    return response.json();
}

export async function getRoles() {
    const response = await customFetch(`${apiUrl}/role`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getAccessToken()
        },
    });

    return response.json();
}

export async function updateUserRole(data) {
    const response = await customFetch(`${apiUrl}/user`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getAccessToken()
        },
        body: JSON.stringify(data)
    });

    return response.status;
}
