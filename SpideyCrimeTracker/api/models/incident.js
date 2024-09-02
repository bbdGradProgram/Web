export class Incident {
    incidentId;
    date;
    description;
    userId;
    hotspotId;

    constructor(incidentId, date, description, userId, hotspotId) {
        this.incidentId = incidentId;
        this.date = date;
        this.description = description;
        this.userId = userId;
        this.hotspotId = hotspotId;
    }
}
