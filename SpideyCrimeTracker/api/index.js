import express from 'express';
import 'dotenv/config';
import {areaController} from './controllers/areaController.js';
import {authController} from './controllers/authController.js';
import {authenticationMiddleware} from './middleware/authenticationMiddleware.js';
import {hotspotController} from './controllers/hotspotController.js';
import {roleController} from './controllers/roleController.js';
import {userController} from './controllers/userController.js';
import {hotspotTypeController} from './controllers/hotspotTypeController.js';
import {incidentController} from './controllers/incidentController.js';
import {authorizationMiddleware} from './middleware/authorizationMiddleware.js';
import {corsMiddleware} from './middleware/corsMiddleware.js';
import {errorHandler} from './middleware/errorHandler.js';

const protectedRoutes = {
    '/user': ['PUT', 'GET'],
    '/role': ['GET', 'POST'],
    '/hotspot': ['POST'],
    '/hotspotType': ['POST'],
    '/area': ['POST']
};

export const app = express();
app.use(express.json());
app.use(corsMiddleware);
app.use(authenticationMiddleware);
app.use(authorizationMiddleware(protectedRoutes));
app.use(errorHandler);


areaController();
hotspotController();
hotspotTypeController();
incidentController();
authController();
roleController();
userController();

app.listen(3000);

process.on('uncaughtException', err => {
    console.log(`Uncaught Exception: ${err.stack}`);
});
