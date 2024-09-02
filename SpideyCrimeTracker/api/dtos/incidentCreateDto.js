export class IncidentCreateDto {
    date;
    description;
    userId;
    hotspotId;

    constructor(date, description, userId, hotspotId) {
        this.date = date;
        this.description = description;
        this.userId = userId;
        this.hotspotId = hotspotId;
    }
}
