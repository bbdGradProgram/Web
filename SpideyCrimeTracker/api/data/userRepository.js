import {executeStatement} from './dbConnection.js';
import {TYPES} from 'tedious';

const tableName = 'SpideyCrimeTrackerDB.dbo.[User]';

/**
 *
 * @param {string} username
 *
 * @return {Promise<User>} - User object
 */
export async function getUserByUsername(username) {
    const query =
        `SELECT *
         FROM ${tableName}
         WHERE username = @username`;
    const params = [{name: 'username', type: TYPES.VarChar, value: username}];
    const users = await executeStatement(query, params);
    if (users.length === 0) {
        return undefined;
    }

    return users[0];
}

/**
 *
 * @param {string} username
 * @param {number} roleId
 *
 * @return {Promise<unknown>}
 */
export function createUser(username, roleId) {
    const query =
        `INSERT INTO ${tableName} (username, roleId)
         VALUES (@username, @roleId)`;
    const params = [
        {name: 'username', type: TYPES.VarChar, value: username},
        {name: 'roleId', type: TYPES.Int, value: roleId}
    ];

    return executeStatement(query, params);
}

/**
 *
 * @param {User} user
 *
 * @return {Promise<unknown>}
 */
export function updateUser(user) {
    const query =
        `UPDATE ${tableName}
         SET roleId=@roleId
         WHERE userId = @userId `;
    const params = [
        {name: 'userId', type: TYPES.Int, value: user.userId},
        {name: 'roleId', type: TYPES.Int, value: user.roleId}
    ];

    return executeStatement(query, params);
}

/**
 *
 * @return {Promise<User[]>} - Array of user objects
 */
export async function getAllUsers() {
    const query =
        `SELECT *
         FROM ${tableName}`;

    return await executeStatement(query, []);
}
