import {app} from '../index.js';
import {createIncident, getAllIncidents, getCrimeStatistics} from '../data/incidentRepository.js';
import {IncidentCreateDto} from '../dtos/incidentCreateDto.js';
import {getUserByUsername} from '../data/userRepository.js';
import {getOrCreateHotspot} from '../data/hotspotRepository.js';

export function incidentController() {
    app.get('/incident', async (req, res) => {
        let options = {};
        const queryParams = req.query;
        if (queryParams.incidentId) {
            const incidentId = parseInt(queryParams.incidentId, 10);
            if (isNaN(incidentId)) {
                return res.status(400).send('Invalid incidentId');
            } else {
                options.incidentId = incidentId;
            }
        } else if (queryParams.hotspotId) {
            const hotspotId = parseInt(queryParams.hotspotId, 10);
            if (isNaN(hotspotId)) {
                return res.status(400).send('Invalid hotspotId');
            } else {
                options.hotspotId = hotspotId;
            }
        }

        res.send(await getAllIncidents(options));
    });

    app.post('/incident', async (req, res) => {
        const body = req.body;
        const {hotspotTypeId, description, date, areaId} = body;
        const username = req.headers.username;
        try {
            const user = await getUserByUsername(username);
            const hotspot = await getOrCreateHotspot(areaId, hotspotTypeId);
            const incidentCreateDto = new IncidentCreateDto(date, description, user.userId, hotspot.hotspotId);
            await createIncident(incidentCreateDto);
        } catch (e) {
            return res.sendStatus(400);
        }

        res.sendStatus(201);
    });


    app.get('/incidents/statistics', async (req, res) => {
        res.send(await getCrimeStatistics());
    });
}
