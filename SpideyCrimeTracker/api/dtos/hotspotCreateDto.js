export class HotspotCreateDto {
    areaId;
    hotspotTypeId;

    constructor(areaId, hotspotTypeId) {
        this.areaId = areaId;
        this.hotspotTypeId = hotspotTypeId;
    }
}
