import {executeStatement} from './dbConnection.js';
import {TYPES} from 'tedious';

const tableName = 'SpideyCrimeTrackerDB.dbo.Incident';

/**
 *
 * @param {Object} options - Optional parameters for filtering hotspots
 * @param {number} [options.incidentId] - Incident Id to filter by
 * @param {number} [options.hotspotTypeId] - Hotspot Type Id to filter by
 *
 * @return {Promise<Hotspot[]>} - Array of incident objects
 */
export function getAllIncidents(options = {}) {
    let query = `SELECT *
                 FROM ${tableName}`;
    const params = [];

    if (options.incidentId !== undefined) {
        query += ' WHERE incidentId = @incidentId';
        params.push({name: 'incidentId', type: TYPES.Int, value: options.incidentId});
    } else if (options.hotspotTypeId !== undefined) {
        query += ' WHERE hotspotTypeId = @hotspotTypeId';
        params.push({name: 'hotspotTypeId', type: TYPES.Int, value: options.hotspotTypeId});
    }

    return executeStatement(query, params);
}

/**
 *
 * @param {IncidentCreateDto} incidentDto - Incident DTO to create incident
 *
 * @return {Promise<Incident[]>} - Array of incident objects
 */
export function createIncident(incidentDto) {
    const query = `INSERT INTO ${tableName} (date, description, userId, hotspotId)
                   VALUES (@date, @description, @userId, @hotspotId);`;
    const params = [
        {name: 'date', type: TYPES.DateTime2, value: incidentDto.date},
        {name: 'description', type: TYPES.VarChar, value: incidentDto.description},
        {name: 'userId', type: TYPES.Int, value: incidentDto.userId},
        {name: 'hotspotId', type: TYPES.Int, value: incidentDto.hotspotId},
    ];

    return executeStatement(query, params);
}

export function getCrimeStatistics() {
    let query = `SELECT a.province, COUNT(i.incidentId) AS totalIncidents
                 FROM SpideyCrimeTrackerDB.dbo.Incident i
                          INNER JOIN SpideyCrimeTrackerDB.dbo.Hotspot h ON i.hotspotId = h.hotspotId
                          INNER JOIN SpideyCrimeTrackerDB.dbo.Area a ON h.areaId = a.areaId
                 GROUP BY a.province`;

    return executeStatement(query, []);
}
