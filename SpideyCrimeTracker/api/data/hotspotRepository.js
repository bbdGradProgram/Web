import {executeStatement} from './dbConnection.js';
import {TYPES} from 'tedious';
import {HotspotCreateDto} from '../dtos/hotspotCreateDto.js';

const tableName = 'SpideyCrimeTrackerDB.dbo.Hotspot';

/**
 *
 * @param {Object} options - Optional parameters for filtering hotspots
 * @param {number} [options.areaID] - Area ID to filter by
 * @param {number} [options.hotspotTypeID] - Hotspot Type ID to filter by
 *
 * @return {Promise<Hotspot[]>} - Array of hotspot objects
 */
export function getAllHotspots(options = {}) {
    let query = `SELECT *
                 FROM ${tableName}`;
    const params = [];

    if (options.areaId !== undefined) {
        query += ' WHERE areaId = @areaId';
        params.push({name: 'areaId', type: TYPES.Int, value: options.areaId});
    }

    if (options.hotspotTypeId !== undefined) {
        // If there's already a WHERE clause, append with AND
        if (params.length > 0) {
            query += ' AND hotspotTypeId = @hotspotTypeId';
        } else {
            query += ' WHERE hotspotTypeId = @hotspotTypeId';
        }
        params.push({name: 'hotspotTypeId', type: TYPES.Int, value: options.hotspotTypeId});
    }

    return executeStatement(query, params);
}

/**
 *
 * @param {HotspotCreateDto} hotspotDto - Hotspot DTO to create hotspot
 *
 * @return {Promise<Hotspot[]>} - Array of hotspot objects
 */
export function createHotspot(hotspotDto) {
    const query = `INSERT INTO ${tableName} (areaId, hotspotTypeId)
                   VALUES (@areaId, @hotspotTypeId);`;
    const params = [
        {name: 'areaId', type: TYPES.Int, value: hotspotDto.areaId},
        {name: 'hotspotTypeId', type: TYPES.Int, value: hotspotDto.hotspotTypeId},
    ];

    return executeStatement(query, params);
}

export async function getOrCreateHotspot(areaId, hotspotTypeId) {
    let hotspots = await getAllHotspots({areaId, hotspotTypeId});
    if (hotspots.length === 0) {
        await createHotspot({areaId, hotspotTypeId});
        hotspots = await getAllHotspots({areaId, hotspotTypeId});
    }
    return hotspots[0];
}
