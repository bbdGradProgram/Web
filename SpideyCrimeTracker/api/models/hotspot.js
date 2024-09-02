export class Hotspot {
    hotspotId;
    description;
    areaId;
    hotspotTypeId;

    constructor(areaId, description, hotspotId, hotspotTypeId) {
        this.hotspotId = hotspotId;
        this.description = description;
        this.areaId = areaId;
        this.hotspotTypeId = hotspotTypeId;
    }
}
