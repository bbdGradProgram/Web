import {executeStatement} from './dbConnection.js';
import {TYPES} from 'tedious';

const tableName = 'SpideyCrimeTrackerDB.dbo.Area';

/**
 *
 * @return {Promise<Area[]>} - Array of area objects
 */
export function getAllAreas() {
    const query =
        `SELECT *
         FROM ${tableName}`;
    return executeStatement(query, []);
}

/**
 *
 * @param {AreaCreateDto} areaDto - Area DTO to create area
 *
 * @return {Promise<Area[]>} - Array of area objects
 */
export async function createAreaIfNotExists(areaDto) {
    if (await areaExists(areaDto.province, areaDto.suburb)) {
        return;
    }
    const query = `INSERT INTO ${tableName} (province, suburb)
                   VALUES (@province, @suburb)`;
    const params = [
        {name: 'province', type: TYPES.VarChar, value: areaDto.province},
        {name: 'suburb', type: TYPES.VarChar, value: areaDto.suburb}
    ];

    return executeStatement(query, params);
}

export function getAllProvinces() {
    const query =
        `SELECT DISTINCT province
         FROM ${tableName}`;
    return executeStatement(query, []);
}

export function getSuburbsForProvince(province) {
    const query =
        `SELECT areaId, suburb
         FROM ${tableName}
         WHERE province = @province`;
    const params = [
        {name: 'province', type: TYPES.VarChar, value: province},
    ];
    return executeStatement(query, params);
}

export async function areaExists(province, suburb) {
    const query =
        `SELECT *
         FROM ${tableName}
         WHERE suburb = @suburb
           AND province = @province`;
    const params = [
        {name: 'suburb', type: TYPES.VarChar, value: suburb},
        {name: 'province', type: TYPES.VarChar, value: province},
    ];

    const suburbs = await executeStatement(query, params);
    return suburbs.length > 0;
}
