import {Connection, Request} from 'tedious';

const config = {
    server: process.env.DB_HOST,
    database: 'SpideyCrimeTrackerDB',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        rowCollectionOnRequestCompletion: true,
        useColumnNames: true,
    },
    authentication: {
        type: 'default',
        options: {
            userName: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
        }
    }
};


export function executeStatement(query, params = []) {
    return new Promise((resolve, reject) => {
        const connection = new Connection(config);

        connection.connect();

        connection.on('connect', (err) => {
            if (err) {
                console.log('Error: ', err);
                reject(err);
            }

            const request = new Request(query, (err, rowCount, rows) => {
                if (err) {
                    console.error('Request error:', err);
                    reject(err);
                }
                resolve(mapRows(rows));
                connection.close();
            });

            for (const param of params) {
                request.addParameter(param.name, param.type, param.value);
            }

            connection.execSql(request);
        });
    });
}

function mapRows(rows) {
    return rows.map((row) => {
        const keys = Object.keys(row);
        const obj = {};
        for (const key of keys) {
            obj[key] = row[key].value;
        }
        return obj;
    });
}
