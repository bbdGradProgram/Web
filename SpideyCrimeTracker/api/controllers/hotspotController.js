import {app} from '../index.js';
import {createHotspot, getAllHotspots} from '../data/hotspotRepository.js';

export function hotspotController() {
    app.get('/hotspot', async (req, res) => {
        let options = {};
        const queryParams = req.query;
        if (queryParams.areaId) {
            const areaId = parseInt(queryParams.areaId, 10);
            if (isNaN(areaId)) {
                return res.status(400).send('Invalid areaId');
            } else {
                options.areaId = areaId;
            }
        }
        if (queryParams.hotspotId) {
            const hotspotId = parseInt(queryParams.hotspotId, 10);
            if (isNaN(hotspotId)) {
                return res.status(400).send('Invalid hotspotId');
            } else {
                options.hotspotId = hotspotId;
            }
        }

        res.send(await getAllHotspots(options));
    });

    app.post('/hotspot', async (req, res) => {
        try {
            await createHotspot(req.body);
        } catch (e) {
            return res.sendStatus(400);
        }
        res.sendStatus(201);
    });
}
