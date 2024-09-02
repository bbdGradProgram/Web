import {executeStatement} from './dbConnection.js';
import {TYPES} from 'tedious';

const tableName = 'SpideyCrimeTrackerDB.dbo.Role';

/**
 *
 * @param {string} roleType
 *
 * @return {Promise<Role[]>} - Role object
 */
export async function getRoleByRoleType(roleType) {
    const query =
        `SELECT *
         FROM ${tableName}
         WHERE roleType = @roleType`;
    const params = [{name: 'roleType', type: TYPES.VarChar, value: roleType}];
    const roles = await executeStatement(query, params);
    if (roles.length === 0) {
        return undefined;
    }

    return roles[0];
}

/**
 *
 * @param {number} roleId
 *
 * @return {Promise<Role>} - Role object
 */
export async function getRoleById(roleId) {
    const query =
        `SELECT *
         FROM ${tableName}
         WHERE roleId = @roleId`;
    const params = [{name: 'roleId', type: TYPES.Int, value: roleId}];
    const roles = await executeStatement(query, params);
    if (roles.length === 0) {
        return undefined;
    }

    return roles[0];
}

/**
 *
 * @param {string} roleType
 *
 * @return {Promise<unknown>}
 */
export function createRole(roleType) {
    const query =
        `INSERT INTO ${tableName} (roleType)
         VALUES (@roleType)`;
    const params = [
        {name: 'roleType', type: TYPES.VarChar, value: roleType},
    ];

    return executeStatement(query, params);
}

/**
 *
 * @return {Promise<Role[]>} - Array of area objects
 */
export function getAllRoles() {
    const query =
        `SELECT *
         FROM ${tableName}`;
    return executeStatement(query, []);
}
