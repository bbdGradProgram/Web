import {app} from '../index.js';
import jwt from 'jsonwebtoken';
import {createUser, getUserByUsername} from '../data/userRepository.js';
import {getRoleById, getRoleByRoleType} from '../data/roleRepository.js';

export function authController() {
    app.post('/auth/login', async (req, res) => {
        const githubCode = req.body.code;
        const githubClientId = process.env.GITHUB_CLIENT_ID;
        const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
        const accessTokenReqBody = JSON.stringify({
            'client_id': githubClientId,
            'client_secret': githubClientSecret,
            'code': githubCode
        });

        const accessTokenResponse = await fetch(`https://github.com/login/oauth/access_token`, {
            method: 'POST',
            body: accessTokenReqBody,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Content-Length': accessTokenReqBody.length
            }
        });

        const {access_token: accessToken} = await accessTokenResponse.json();

        const userDetailsResponse = await fetch('https://api.github.com/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json',
            }
        });
        const {login: username} = await userDetailsResponse.json();

        if (!username) {
            return res.status(400);
        }

        const user = await getUserByUsername(username);
        let role;

        if (!user) {
            role = await getRoleByRoleType('user');
            await createUser(username, role.roleId);
        } else {
            role = await getRoleById(user.roleId);
        }

        const jwtSecret = process.env.JWT_SECRET;

        const jwtToken = jwt.sign({
            'username': username,
            'role': role.roleType
        }, jwtSecret, {expiresIn: '1h', issuer: 'spidey-crime-tracker'});

        res.send({
            'access_token': jwtToken,
            'username': username,
            'role': role.roleType
        });
    });
}
