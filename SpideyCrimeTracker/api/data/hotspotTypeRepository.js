import {executeStatement} from './dbConnection.js';
import {TYPES} from 'tedious';

const tableName = 'SpideyCrimeTrackerDB.dbo.HotspotType';

/**
 *
 * @return {Promise<HotspotType[]>} - Array of area objects
 */
export function getAllHotspotTypes() {
    const query =
        `SELECT *
         FROM ${tableName}`;
    return executeStatement(query, []);
}

/**
 *
 * @param {HotspotTypeCreateDto} hotspotTypeDto - Area DTO to create hotspotType
 *
 * @return {Promise<HotspotType[]>} - Array of hotspotType objects
 */
export async function createHotspotTypeIfNotExists(hotspotTypeDto) {
    if (await hotspotTypeExists(hotspotTypeDto.hotspotType)) {
        return;
    }
    const query = `INSERT INTO ${tableName} (hotspotType)
                   VALUES (@hotspotType)`;
    const params = [
        {name: 'hotspotType', type: TYPES.VarChar, value: hotspotTypeDto.hotspotType},
    ];

    return executeStatement(query, params);
}

export async function hotspotTypeExists(hotspotType) {
    const query =
        `SELECT *
         FROM ${tableName}
         WHERE hotspotType = @hotspotType`;
    const params = [
        {name: 'hotspotType', type: TYPES.VarChar, value: hotspotType},
    ];

    const hotspotTypes = await executeStatement(query, params);
    return hotspotTypes.length > 0;
}

