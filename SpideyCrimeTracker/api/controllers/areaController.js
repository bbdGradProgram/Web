import {app} from '../index.js';
import {createAreaIfNotExists, getAllAreas, getAllProvinces, getSuburbsForProvince} from '../data/areaRepository.js';

export function areaController() {
    app.get('/area', async (req, res) => {
        res.send(await getAllAreas());
    });

    app.post('/area', async (req, res) => {
        try {
            await createAreaIfNotExists(req.body);
        } catch (e) {
            return res.sendStatus(400);
        }
        res.sendStatus(201);
    });

    app.get('/area/province', async (req, res) => {
        const provinces = await getAllProvinces();
        const provinceArr = provinces.map(obj => obj.province);
        res.send(provinceArr);
    });

    app.get('/area/suburb', async (req, res) => {
        const province = req.query.province;
        const suburbs = await getSuburbsForProvince(province);
        const suburbArr = suburbs.map(obj => {
            return {suburb: obj.suburb, areaId: obj.areaId};
        });
        res.send(suburbArr);
    });
}
